const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const workerSource = fs.readFileSync(process.env.FONT_WORKER_SOURCE || path.join(root, 'src/workers/font-geometry-worker.js'), 'utf8');
const serviceSource = fs.readFileSync(process.env.FONT_SERVICE_SOURCE || path.join(root, 'src/scripts/font-service.js'), 'utf8');
const bundle = require('esbuild').buildSync({entryPoints:[path.join(root,'src/workers/extrusion-entry.js')],bundle:true,format:'cjs',write:false}).outputFiles[0].text;
const exportsContext = {exports:{},module:{exports:{}}}; exportsContext.exports = exportsContext.module.exports;
vm.runInNewContext(bundle, exportsContext);
const build = exportsContext.module.exports.build;
const options = {quality:10,tolerance:.1};
const key = (font, text) => JSON.stringify([font, text, options]);
function fixture(text) {
  return {polygons:[[[[0,0],[10,0],[10,20],[0,20],[0,0]]]],bounds:{cx:5,cy:10,height:20},vertices:text === 'large' ? 1500000 : 5,missing:[],tolerance:.1};
}
function harness({action = () => {}, meshBuild = build} = {}) {
  const posts = [], workers = []; let parses = 0, modelBuilds = 0;
  class Worker {
    constructor() {
      workers.push(this); this.number = workers.length;
      this.context = {self:null,opentype:{parse(){ parses++; return {tables:{cmap:{glyphIndexMap:{65:1}}}}; }},
        GeoGlyphGeometry:{model(font,text){modelBuilds++;return fixture(text);}},GeoGlyphMesh:{build:meshBuild},
        postMessage:message => queueMicrotask(() => this.onmessage?.({data:structuredClone(message)}))};
      this.context.self = this.context; vm.createContext(this.context); vm.runInContext(workerSource,this.context);
    }
    postMessage(message,transfers) {
      posts.push({worker:this.number,...structuredClone(message),transferCount:transfers.length});
      const operation = action(message,this);
      if (operation === 'crash') return queueMicrotask(() => this.onerror?.({message:'Synthetic crash'}));
      queueMicrotask(() => this.context.onmessage({data:structuredClone(message)}));
    }
    terminate() {}
  }
  const context = vm.createContext({Worker,Blob,performance,setTimeout,clearTimeout,
    URL:{createObjectURL:()=> 'blob:fixture',revokeObjectURL(){}},
    document:{getElementById:()=>({textContent:'"worker"'}),fonts:{delete(){}}}});
  vm.runInContext(serviceSource,context);
  return {service:context.GeoGlyphFontService,posts,workers,counts:()=>({parses,modelBuilds}),
    record:id=>({id,fontResourceKey:id,arrayBuffer:new ArrayBuffer(16)})};
}

test('five-font warm model cycles survive parsed-font eviction without re-preparing', async t => {
  const h = harness(); t.after(()=>h.service.dispose());
  const records = Array.from({length:5},(_,i)=>h.record('font'+i));
  for (const record of records) await h.service.model(record,'A',options);
  const before = h.counts();
  for (let i=0;i<10;i++) for (const record of records) {
    assert.deepEqual(await h.service.model(record,'A',options),fixture('A'));
  }
  assert.deepEqual(h.counts(),before);
  const stats = await h.service.workerStats(); assert.equal(stats.fonts,2); assert.equal(stats.models,5);
  assert.equal(h.posts.filter(p=>p.type==='prepare').length,5);
  t.diagnostic('50 warm five-font model requests: 0 additional prepare requests, parses or model builds; parsed-font limit remains 2.');
});

test('mesh request reuses worker model by key and returns unchanged typed geometry', async t => {
  const h = harness(); t.after(()=>h.service.dispose()); const record = h.record('font');
  const model = await h.service.model(record,'A',options), renderKey = key('font','A');
  const mesh = await h.service.mesh(renderKey,model);
  assert.deepEqual(mesh,structuredClone(build(model)));
  const requests = h.posts.filter(p=>p.type==='mesh'); assert.equal(requests.length,1);
  assert.deepEqual(requests[0].payload,{key:renderKey}); assert.equal(requests[0].transferCount,0);
  assert.equal((await h.service.workerStats()).meshBuilds,1);
  t.diagnostic('Normal model-to-mesh path: 1 key-only request, 0 polygon payloads copied back to worker (previously 1).');
});

test('missing worker model falls back once, then mesh cache needs only its key', async t => {
  const h = harness(); t.after(()=>h.service.dispose()); const model = fixture('A');
  const first = await h.service.mesh('external-model',model),second = await h.service.mesh('external-model',model);
  assert.deepEqual(first,second);
  const requests = h.posts.filter(p=>p.type==='mesh'); assert.equal(requests.length,3);
  assert.deepEqual(requests.map(p=>'model' in p.payload),[false,true,false]);
  assert.equal((await h.service.workerStats()).meshBuilds,1);
  assert.equal(first.position.byteLength,second.position.byteLength); assert.ok(first.position.byteLength>0);
});

test('normalized-model eviction uses fallback without increasing existing cache budgets', async t => {
  const h = harness(); t.after(()=>h.service.dispose()); const record = h.record('font');
  const evicted = await h.service.model(record,'A',options);
  await h.service.model(record,'large',options);
  assert.equal((await h.service.workerStats()).models,1);
  const mesh = await h.service.mesh(key('font','A'),evicted); assert.ok(mesh.position.byteLength>0);
  assert.deepEqual(h.posts.filter(p=>p.type==='mesh').map(p=>'model' in p.payload),[false,true]);
  assert.equal((await h.service.workerStats()).models,1);
});

test('deterministic mesh errors propagate without redundant full-payload retry', async t => {
  const h = harness({meshBuild(){throw Error('Geometry budget exceeded');}}); t.after(()=>h.service.dispose());
  const record = h.record('font'),model = await h.service.model(record,'A',options);
  await assert.rejects(h.service.mesh(key('font','A'),model),/Geometry budget exceeded/);
  assert.equal(h.posts.filter(p=>p.type==='mesh').length,1); assert.equal(h.workers.length,1);
});

test('worker replacement falls back to caller model and does not detach cached mesh buffers', async t => {
  let crashed = false;
  const h = harness({action(message){if(message.type==='mesh'&&!crashed){crashed=true;return 'crash';}}});
  t.after(()=>h.service.dispose()); const record = h.record('font'),model = await h.service.model(record,'A',options);
  const mesh = await h.service.mesh(key('font','A'),model);
  assert.equal(h.workers.length,2); assert.ok(mesh.position.byteLength>0);
  assert.deepEqual(h.posts.filter(p=>p.type==='mesh').map(p=>[p.worker,'model' in p.payload]),[[1,false],[2,false],[2,true]]);
  const second = await h.service.mesh(key('font','A'),model);
  assert.deepEqual(second,mesh); assert.ok(mesh.position.byteLength>0);
  assert.ok(h.posts.filter(p=>p.type==='mesh').every(p=>p.transferCount===0));
});
