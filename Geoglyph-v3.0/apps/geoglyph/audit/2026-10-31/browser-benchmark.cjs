/* Standalone audit harness. Requires an already running, unchanged HTTP build.
 * Real-service survey requests are intercepted; no survey records are written.
 * See GEOGLYPH_PERFORMANCE_AUDIT.md for limitations and manual release gates. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../../node_modules/playwright');
const { config } = require('../../src/scripts/survey-results.js');
const argv = process.argv.slice(2);
const value = (name, fallback) => { const i = argv.indexOf(name); return i < 0 ? fallback : argv[i + 1]; };
const minutes = Number(value('--minutes', '90'));
if (!(minutes > 0 && minutes <= 120)) throw Error('--minutes must be >0 and <=120');
const target = value('--url', 'http://127.0.0.1:4174/');
const liveTiles = argv.includes('--live-tiles');
const resultFile = path.resolve(value('--output', path.join(__dirname, 'browser-results.json')));
const result = { startedAt: new Date().toISOString(), status: 'starting', minutes, target,
  headed: argv.includes('--headed'), liveTiles, node: process.version,
  limitations: ['rAF intervals are scheduling observations, not GPU completion timings.',
    'TaskDuration / wall duration estimates renderer main-thread occupancy, not total CPU utilization.',
    'Synthetic survey records; no production submissions, authentication changes or survey writes.',
    'Fullscreen, real hidden-tab timer throttling, display hotplug and visual comparison require operator checks.',
    'JavaScript heap measurements exclude browser/native/GPU memory.',
    'Default tiles are synthetic 1x1 images; use --live-tiles for representative imagery transfer/decoding.',
    'Collection completion does not signify demonstration readiness or a passing release gate.'], periods: [], errors: [] };
function save() { fs.mkdirSync(path.dirname(resultFile), { recursive: true }); fs.writeFileSync(resultFile, JSON.stringify(result, null, 2) + '\n'); }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const fields = ['emojis', 'geoglyph_speaks', 'whats_on_your_mind', 'random_font', 'choose_a_font_font',
  'choose_a_colour_colour', '_2d_or_3d', 'fit', 'animation', '_size_size', 'special_commands'];
const metadata = { id: 7, name: 'Synthetic audit cues', capabilities: 'Query', objectIdField: 'objectid', maxRecordCount: 25,
  geometryType: 'esriGeometryPoint', spatialReference: { wkid: 4326 }, editFieldsInfo: { creationDateField: 'CreationDate' },
  advancedQueryCapabilities: { supportsOrderBy: true, supportsPagination: true },
  fields: [{ name: 'objectid', type: 'esriFieldTypeOID' }, { name: 'CreationDate', type: 'esriFieldTypeDate' },
    ...fields.map(name => ({ name, type: 'esriFieldTypeString' }))] };
const tile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
let browser;
(async () => {
  try { browser = await chromium.launch({ headless: !result.headed }); }
  catch (error) {
    result.status = 'blocked-browser-launch'; result.launchError = String(error.message).split('Browser logs:')[0].trim();
    save(); console.error(result.status + ': ' + result.launchError); process.exitCode = 2; return;
  }
  result.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: Number(value('--dpr', '1')) });
  const page = await context.newPage();
  const server = { records: [], fail: false, slow: false, requests: 0, failures: 0, totalMs: 0, maxMs: 0 };
  const requests = new Map();
  page.on('request', request => { if (request.url().startsWith(config.serviceUrl)) requests.set(request, performance.now()); });
  const finished = (request, failed) => {
    const start = requests.get(request); if (start === undefined) return; requests.delete(request);
    const elapsed = performance.now() - start; server.requests++; server.failures += Number(failed);
    server.totalMs += elapsed; server.maxMs = Math.max(server.maxMs, elapsed);
  };
  page.on('requestfinished', request => finished(request, false));
  page.on('requestfailed', request => finished(request, true));
  page.on('pageerror', error => { if (result.errors.length < 100) result.errors.push({ name: error.name,
    message: error.message.replace(/https?:\/\/\S+/g, '[URL]').slice(0, 300) }); });
  await page.route('**/MapServer/tile/**', async route => {
    if (server.fail) return route.abort('internetdisconnected');
    if (liveTiles) return route.continue();
    return route.fulfill({ body: tile, contentType: 'image/png' });
  });
  await page.route(config.serviceUrl + '**', async route => {
    if (server.fail) return route.abort('internetdisconnected');
    if (server.slow) await sleep(2500);
    const request = route.request(), url = new URL(request.url());
    const params = request.method() === 'POST' ? new URLSearchParams(request.postData()) : url.searchParams;
    if (url.pathname.endsWith('/FeatureServer')) return route.fulfill({ json: { layers: [{ id: 7, name: 'Synthetic audit cues' }], tables: [] } });
    if (!url.pathname.endsWith('/query')) return route.fulfill({ json: metadata });
    const cursor = /objectid\s*>\s*(\d+)/i.exec(params.get('where') || '');
    let rows = server.records.filter(row => !cursor || row.attributes.objectid > Number(cursor[1]));
    rows = rows.slice().sort((a, b) => (a.attributes.objectid - b.attributes.objectid) * (/DESC/i.test(params.get('orderByFields') || '') ? -1 : 1));
    const count = Math.min(25, Number(params.get('resultRecordCount') || 25));
    return route.fulfill({ json: { features: rows.slice(0, count), exceededTransferLimit: rows.length > count } });
  });
  await page.addInitScript(() => {
    const a = window.__geoglyphAudit = { frames: [], previous: 0, longCount: 0, longTotal: 0, longMax: 0,
      submitted: new Map(), latencies: [], firstUsable: null, mapRenderCount: 0, lastMapRenderMs: null,
      latencyCounts: { submitted: 0, drawn: 0, failed: 0, expired: 0 }, lastFailureId: 0,
      pendingLimit: 512, pendingMaxAgeMs: 300000, measuredMap: null };
    a.reconcileLatency = () => {
      for (const item of window.GeoGlyphConference?.state.history || []) {
        if (item.phase === 'failed' && item.objectId > a.lastFailureId) {
          a.lastFailureId = item.objectId;
          if (a.submitted.delete(item.objectId)) a.latencyCounts.failed++;
        }
      }
      const now = performance.now();
      for (const [id, time] of a.submitted) {
        if (now - time > a.pendingMaxAgeMs) { a.submitted.delete(id); a.latencyCounts.expired++; }
      }
    };
    a.attachMap = map => {
      if (!map || a.measuredMap === map) return;
      if (a.measuredMap) a.measuredMap.off('render', a.countMapRender);
      a.measuredMap = map; map.on('render', a.countMapRender);
    };
    a.countMapRender = () => { a.mapRenderCount++; a.lastMapRenderMs = performance.now(); };
    const frame = time => { if (a.previous && a.frames.length < 12000) a.frames.push(time - a.previous); a.previous = time; requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
    if (window.PerformanceObserver) try { new PerformanceObserver(list => { for (const e of list.getEntries()) {
      a.longCount++; a.longTotal += e.duration; a.longMax = Math.max(a.longMax, e.duration);
    } }).observe({ type: 'longtask', buffered: true }); } catch (_) {}
    document.addEventListener('geoglyph:ground-rendered', event => {
      const map = window.GeoGlyphMapEngine?.state.map, id = event.detail?.cueId;
      if (!map) return;
      a.attachMap(map);
      let timeout;
      const rendered = () => {
        const s = window.GeoGlyphMapEngine.state;
        const source = s.lastRenderMode === 'decal' ? 'geoglyph-ground-decal' : 'geoglyph-ground-geometry';
        if (!map.getSource(source) || !map.isSourceLoaded(source)) return;
        map.off('render', rendered);
        clearTimeout(timeout);
        a.firstUsable ??= performance.now();
        if (a.submitted.has(id)) {
          a.latencies.push(performance.now() - a.submitted.get(id)); a.submitted.delete(id); a.latencyCounts.drawn++;
        }
      };
      map.on('render', rendered);
      timeout = setTimeout(() => map.off('render', rendered), 20000);
    });
  });
  const cdp = await context.newCDPSession(page); await cdp.send('Performance.enable');
  const navigationStart = performance.now();
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => (window.GeoGlyphConference?.state.ready && window.GeoGlyphConference.state.baselined) || window.GeoGlyphConference?.state.error, null, { timeout: 120000 });
  const startupError = await page.evaluate(() => window.GeoGlyphConference?.state.error);
  if (startupError) throw Error('Conference startup: ' + startupError);
  result.readyFromNavigationMs = performance.now() - navigationStart;
  result.graphics = await page.evaluate(() => {
    const map = GeoGlyphMapEngine.state.map, gl = map.getCanvas().getContext('webgl2'), debug = gl?.getExtension('WEBGL_debug_renderer_info');
    window.__geoglyphAudit.attachMap(map);
    return { renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : 'unavailable',
      attributes: gl?.getContextAttributes(), dpr: devicePixelRatio, width: map.getCanvas().width, height: map.getCanvas().height };
  });
  let id = 0;
  async function submit(attributes) {
    const number = ++id;
    await page.evaluate(n => {
      const a = window.__geoglyphAudit; a.reconcileLatency();
      while (a.submitted.size >= a.pendingLimit) { a.submitted.delete(a.submitted.keys().next().value); a.latencyCounts.expired++; }
      a.submitted.set(n, performance.now()); a.latencyCounts.submitted++;
    }, number);
    server.records.push({ attributes: { objectid: number, CreationDate: number * 1000, ...attributes } });
    return number;
  }
  const start = performance.now(); let sampleAt = start, updateAt = start, began = false, content = false, update = 0, lastTask;
  result.status = 'running'; save();
  while (performance.now() - start < minutes * 60000) {
    const elapsed = performance.now() - start;
    const phase = elapsed < 30000 ? 'idle' : elapsed < 65000 ? 'introduction' : elapsed < 125000 ? 'orbit' : 'repeated-updates';
    if (!began && elapsed >= 30000) { await submit({ special_commands: 'Begin' }); began = true; }
    if (!content && elapsed >= 65000) {
      await submit({ geoglyph_speaks: 'GE OGLYPH AUDIT', choose_a_font_font: 'Gill Sans', _2d_or_3d: '3D', animation: 'Orbit', _size_size: 'Large' }); content = true;
    }
    // A 20-second outage followed by 20 seconds of slow responses every five minutes.
    const cycle = elapsed % 300000;
    server.fail = elapsed > 300000 && cycle < 20000;
    server.slow = elapsed > 300000 && cycle >= 20000 && cycle < 40000;
    if (elapsed >= 125000 && performance.now() >= updateAt) {
      const fonts = ['Gill Sans', 'Forte', 'Chiller', 'Magneto', 'Showcard Gothic'];
      await submit({ geoglyph_speaks: 'AUDIT ' + (++update) + ' THE QUICK BROWN FOX',
        choose_a_font_font: fonts[update % fonts.length], _2d_or_3d: update % 7 === 0 ? '2D' : '3D',
        ...(update % 7 === 0 ? {} : { animation: ['Orbit', 'Turn', 'Face'][update % 3] }), _size_size: ['Small', 'Medium', 'Large', 'Huge'][update % 4] });
      if (update % 10 === 0) {
        for (let burst = 0; burst < 3; burst++) await submit({ geoglyph_speaks: 'BURST ' + update + ' ' + burst });
        await page.setViewportSize(update % 20 === 0 ? { width: 1920, height: 1080 } : { width: 1440, height: 900 });
      }
      updateAt = performance.now() + 5000;
    }
    if (performance.now() - sampleAt >= 10000 || performance.now() - start >= minutes * 60000 - 1000) {
      const snapshot = await page.evaluate(() => {
        const a = window.__geoglyphAudit, sorted = a.frames.splice(0).sort((x, y) => x - y), sum = sorted.reduce((x, y) => x + y, 0);
        a.reconcileLatency();
        const percentile = q => sorted.length ? sorted[Math.ceil(q * sorted.length) - 1] : null;
        const slow = sorted.slice(-Math.max(1, Math.ceil(sorted.length * .01)));
        const s = GeoGlyphConference.state;
        const snapshot = { firstUsableMs: a.firstUsable, frameSamples: sorted.length,
          averageRafFps: sum ? 1000 * sorted.length / sum : null, medianMs: percentile(.5), p95Ms: percentile(.95), p99Ms: percentile(.99),
          onePercentLowFps: slow.length ? 1000 / (slow.reduce((x, y) => x + y, 0) / slow.length) : null,
          gapsOver50Ms: sorted.filter(x => x > 50).length, longTasks: { count: a.longCount, totalMs: a.longTotal, maxMs: a.longMax },
          drawLatencyMs: a.latencies.splice(0), latencyCounts: { ...a.latencyCounts }, pendingLatencyCount: a.submitted.size,
          mapRenderEvents: a.mapRenderCount, sinceLastMapRenderMs: a.lastMapRenderMs === null ? null : performance.now() - a.lastMapRenderMs,
          actualConferencePhase: s.phase, cueError: s.error, queueDepth: s.queue.length, applying: s.applying, lastAppliedId: s.lastAppliedId,
          fontService: GeoGlyphFontService.stats(), ground3D: GeoGlyph3D.stats(), heap: performance.memory?.usedJSHeapSize ?? null };
        a.longCount = a.longTotal = a.longMax = a.mapRenderCount = 0; return snapshot;
      });
      const metrics = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
      const now = performance.now(), wallSeconds = (now - sampleAt) / 1000;
      result.periods.push({ elapsedMs: now - start, plannedWorkloadPhase: phase, outage: server.fail, slowNetwork: server.slow,
        ...snapshot, rendererMainThreadBusyFraction: lastTask === undefined ? null : (metrics.TaskDuration - lastTask) / wallSeconds,
        cdp: { JSHeapUsedSize: metrics.JSHeapUsedSize, JSHeapTotalSize: metrics.JSHeapTotalSize, Nodes: metrics.Nodes, Documents: metrics.Documents },
        network: { requests: server.requests, failures: server.failures, meanMs: server.requests ? server.totalMs / server.requests : null, maxMs: server.maxMs } });
      lastTask = metrics.TaskDuration; sampleAt = now;
      server.requests = server.failures = server.totalMs = server.maxMs = 0;
      save();
    }
    await sleep(250);
  }
   // End the workload, restore the synthetic service and allow only a bounded
   // drain. This is collection evidence, never an automatic readiness signoff.
   server.fail = server.slow = false;
   const drainStart = performance.now();
   let drained = false;
   while (performance.now() - drainStart < 30000) {
     drained = await page.evaluate(expected => {
       const s = GeoGlyphConference.state;
       return s.lastAppliedId === expected && !s.applying && s.queue.length === 0;
     }, id);
     if (drained) break;
     await sleep(250);
   }
   result.finalState = await page.evaluate(() => {
     const a = window.__geoglyphAudit, s = GeoGlyphConference.state;
     a.reconcileLatency();
     return { actualConferencePhase: s.phase, lastQueuedId: s.lastQueuedId, lastAppliedId: s.lastAppliedId,
       queueDepth: s.queue.length, applying: s.applying, cueError: s.error,
       pendingLatencyCount: a.submitted.size, latencyCounts: { ...a.latencyCounts },
       finalDrawLatencyMs: a.latencies.splice(0),
       sinceLastMapRenderMs: a.lastMapRenderMs === null ? null : performance.now() - a.lastMapRenderMs,
       fontService: GeoGlyphFontService.stats(), ground3D: GeoGlyph3D.stats() };
   });
   result.status = 'collection-completed'; result.submittedCues = id;
   result.drain = { drained, durationMs: performance.now() - drainStart, limitMs: 30000 };
   result.validationPassed = null;
   result.operatorReviewRequired = true;
   result.finishedAt = new Date().toISOString(); save();
  console.log('Saved ' + resultFile + '; this run alone does not replace visual/hardware release checks.');
})().catch(error => { result.status = 'failed'; result.error = String(error.message).replace(/https?:\/\/\S+/g, '[URL]').slice(0, 500); save(); console.error(result.error); process.exitCode = 1; })
  .finally(async () => { if (browser) await browser.close(); });
