(function (root) {
  'use strict';
  const resources = new Map(), queue = [], pending = new Map(), pins = new Map();
  let active = 0, sequence = 0, worker = null, workerUrl = '', catalogGeneration = 0, serviceEpoch = 0;
  const counters = { reads: 0, faces: 0, parses: 0, jobs: 0 };
  const yieldTask = () => root.scheduler?.yield ? root.scheduler.yield() : new Promise(resolve => setTimeout(resolve, 0));
  const hash = value => { let n = 2166136261; for (const c of String(value)) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return (n >>> 0).toString(36); };
  function keyFor(record) {
    if (record.fontResourceKey) return record.fontResourceKey;
    const ref = record.geoGlyphRef || record, file = record.file || ref.file;
    if (file) return `file:${file.webkitRelativePath || file.name}:${file.size}:${file.lastModified || 0}`;
    const descriptor = record.localDescriptor || record.metadata || ref.metadata;
    if (descriptor) return `local:${descriptor.postscriptName || descriptor.fullName || descriptor.family}:${descriptor.style || ''}`.toLowerCase();
    if (record.postscriptName && /windows|system|local/i.test(record.source || '')) return `local:${record.postscriptName}:${record.style || ''}`.toLowerCase();
    if (record.fileHandle) return `handle:${record.id || record.fileName || record.fileHandle.name}`;
    return `css:${record.family || record.name || record.cssFamily}:${record.style || ''}`.toLowerCase();
  }
  function register(record) {
    const key = keyFor(record); let resource = resources.get(key);
    if (!resource) { resource = { key, records: new Map(), buffer: null, face: null, facePromise: null, bufferPromise: null, parsePromise: null, metadata: null, error: null, faceError:null, readError:null, used: performance.now() }; resources.set(key, resource); }
    resource.records.set(record.id || `${record.source || ''}:${record.name || ''}:${record.style || ''}`, record); record.fontResourceKey = key; resource.provider = record;
    if (resource.face) { record.cssFamily = resource.cssFamily; record.exactFace = true; }
    if(resource.hasColor!==undefined)record.hasColor=resource.hasColor;
    return resource;
  }
  function schedule(task, priority = 1) {
    return new Promise((resolve, reject) => { queue.push({ task, priority, resolve, reject, order: sequence++ }); queue.sort((a, b) => a.priority - b.priority || a.order - b.order); pump(); });
  }
  function pump() {
    while (active < 2 && queue.length) {
      const item = queue.shift(); active++; counters.jobs++;
      Promise.resolve().then(item.task).then(item.resolve, item.reject).finally(() => { active--; pump(); });
    }
  }
  async function read(resource) {
    resource.used = performance.now();
    if (resource.buffer?.byteLength) return resource.buffer;
    if (resource.bufferPromise) return resource.bufferPromise;
    if (resource.readError) throw resource.readError;
    resource.bufferPromise = (async () => {
      const record = resource.provider, ref = record.geoGlyphRef || record;
      let buffer = record.arrayBuffer || ref.arrayBuffer;
      if (!buffer?.byteLength) {
        let file = record.file || ref.file;
        const descriptor = record.localDescriptor || record.metadata || ref.metadata;
        if (!file && descriptor?.blob) file = await descriptor.blob();
        if (!file && record.fileHandle?.getFile) file = await record.fileHandle.getFile();
        if (!file) throw Error('Exact font bytes unavailable; choose a local font or font file');
        counters.reads++; buffer = await file.arrayBuffer();
      }
      if (!buffer?.byteLength) throw Error('Font file is empty');
      const view=new DataView(buffer); let hasColor=false;
      if(buffer.byteLength>=12&&view.getUint32(0)!==0x74746366){const count=Math.min(view.getUint16(4),Math.floor((buffer.byteLength-12)/16));for(let i=0;i<count;i++){const tag=String.fromCharCode(...new Uint8Array(buffer,12+i*16,4));if(['COLR','CPAL','CBDT','CBLC','sbix','SVG '].includes(tag))hasColor=true;}}
      resource.hasColor=hasColor; for(const ref of resource.records.values())ref.hasColor=hasColor;
      resource.buffer = buffer; trimBuffers(resource.key); return buffer;
    })().catch(error => { resource.readError=error; throw error; }).finally(() => { resource.bufferPromise = null; });
    return resource.bufferPromise;
  }
  function trimBuffers(activeKey) {
    let bytes = [...resources.values()].reduce((sum, r) => sum + (r.buffer?.byteLength || 0), 0);
    for (const r of [...resources.values()].sort((a, b) => a.used - b.used)) {
      if (bytes <= 64 * 1024 * 1024) break;
      if (r.key !== activeKey && ![...pins.values()].includes(r.key) && !r.bufferPromise) { bytes -= r.buffer?.byteLength || 0; r.buffer = null; }
    }
  }
  function workerRequest(type, payload, transfers) {
    if (!worker) {
      const source = document.getElementById('geoglyph-font-worker-source');
      if (!source || !root.Worker) return Promise.reject(Error('Font worker unavailable; using styled browser rendering'));
      try {
        workerUrl = URL.createObjectURL(new Blob([JSON.parse(source.textContent)], { type: 'text/javascript' })); worker = new Worker(workerUrl);
        worker.onmessage = event => { const job = pending.get(event.data.id); if (!job) return; pending.delete(event.data.id); clearTimeout(job.timeout); event.data.error ? job.reject(Error(event.data.error)) : job.resolve(event.data.result); };
        worker.onerror = event => { const reason = Error(event.message || 'Font worker failed'); for (const job of pending.values()) { clearTimeout(job.timeout); job.reject(reason); } pending.clear(); worker.terminate(); worker = null; URL.revokeObjectURL(workerUrl); };
      } catch (error) { worker = null; return Promise.reject(error); }
    }
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timeout = setTimeout(() => { pending.delete(id); reject(Error('Font worker request timed out')); }, 30000);
      pending.set(id, { resolve, reject, timeout });
      try { worker.postMessage({ id, type, payload }, transfers || []); } catch (error) { clearTimeout(timeout); pending.delete(id); reject(error); }
    });
  }
  async function ensureFace(record, options = {}) {
    const resource = register(record); resource.used = performance.now();
    if(options.retry) { resource.faceError=null; resource.readError=null; }
    if (resource.face) return resource;
    if (resource.facePromise) return resource.facePromise;
    if(resource.faceError) throw resource.faceError;
    const epoch = serviceEpoch;
    resource.facePromise = schedule(async () => {
      if (epoch !== serviceEpoch) throw Error('Font service disposed');
      const buffer = await read(resource);
      if (epoch !== serviceEpoch) throw Error('Font service disposed');
      const cssFamily = `GeoGlyphExact_${hash(resource.key)}`;
      const face = new FontFace(cssFamily, buffer);
      await face.load();
      if(epoch!==serviceEpoch) throw Error('Font service disposed');
      if (options.isCurrent && !options.isCurrent()) return resource;
      document.fonts.add(face); counters.faces++; resource.face = face; resource.cssFamily = cssFamily;
      for (const ref of resource.records.values()) { ref.cssFamily = cssFamily; ref.exactFace = true; }
      const inactive = [...resources.values()].filter(r => r.face && r !== resource && ![...pins.values()].includes(r.key)).sort((a, b) => b.used - a.used);
      for (const old of inactive.slice(Math.max(0,23-pins.size))) { document.fonts.delete(old.face); old.face = null; for (const ref of old.records.values()) ref.exactFace = false; }
      return resource;
    }, options.priority ?? 0).catch(error=>{ if(epoch===serviceEpoch)resource.faceError=error; throw error; }).finally(() => { resource.facePromise = null; });
    return resource.facePromise;
  }
  async function prepare(record, options = {}) {
    const resource = register(record); resource.used = performance.now();
    if(options.retry) { resource.error=null; resource.readError=null; }
    if (resource.metadata && !options.retry) return resource.metadata;
    if (resource.parsePromise) return resource.parsePromise;
    if (resource.error && !options.retry) throw resource.error;
    resource.parsePromise = (async () => {
      const buffer = await schedule(()=>read(resource),options.priority ?? 0); const copy = buffer.slice(0); counters.parses++;
      try { resource.metadata = await workerRequest('prepare', { key: resource.key, buffer: copy }, [copy]); resource.error = null; return resource.metadata; }
      catch (error) { resource.error = error; throw error; }
    })().finally(() => { resource.parsePromise = null; });
    return resource.parsePromise;
  }
  async function model(record, text, options = {}) {
    const resource = register(record);
    if (!resource.metadata) await prepare(record);
    try { return await workerRequest('model', { key: resource.key, text, options }); }
    catch (error) { if (error.message !== 'FONT_EVICTED') throw error; await prepare(record, { retry: true }); return workerRequest('model', { key: resource.key, text, options }); }
  }
  async function catalog(records, onRecord, options = {}) {
    const generation = ++catalogGeneration; let sliceStart = performance.now(), lastProgress = 0, done = 0;
    for (const record of records) {
      if (generation !== catalogGeneration) return { done, cancelled: true };
      register(record); onRecord(record); done++;
      if (performance.now() - sliceStart >= 8) { if (performance.now() - lastProgress >= 100) { options.progress?.(done, records.length); lastProgress = performance.now(); } await yieldTask(); sliceStart = performance.now(); }
    }
    options.progress?.(done, records.length); return { done, cancelled: false };
  }
  function cancelCatalog() { catalogGeneration++; }
  function pin(record, owner) { const resource=register(record); pins.set(owner,resource.key); return resource; }
  function dispose() {
    ++serviceEpoch; cancelCatalog();
    for (const r of resources.values()) if (r.face) document.fonts.delete(r.face);
    resources.clear(); pins.clear(); for(const item of queue.splice(0))item.reject(Error('Font service disposed')); if (worker) worker.terminate(); worker = null; if (workerUrl) URL.revokeObjectURL(workerUrl);
    for (const job of pending.values()) { clearTimeout(job.timeout); job.reject(Error('Font service disposed')); } pending.clear();
  }
  root.GeoGlyphFontService = Object.freeze({ keyFor, register, ensureFace, prepare, model, mesh:(key,model)=>workerRequest('mesh',{key,model}), catalog, cancelCatalog, yieldTask, pin, unpin:owner=>pins.delete(owner), dispose, stats: () => ({ ...counters, resources: resources.size, queued: queue.length, active, retainedBytes: [...resources.values()].reduce((sum, r) => sum + (r.buffer?.byteLength || 0), 0) }), workerStats: () => workerRequest('stats', {}) });
})(globalThis);
