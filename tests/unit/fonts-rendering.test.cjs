const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const geometry = require('../../src/scripts/ground-geometry.js');
const polygonClipping = require('../../src/vendor/polygon-clipping.js');
globalThis.polygonClipping = polygonClipping;

const square = (x, y, size, reverse = false) => { const r = [[x,y],[x+size,y],[x+size,y+size],[x,y+size],[x,y]]; return reverse ? r.reverse() : r; };

test('nonzero winding retains counters, islands, opposite independent contours and overlapping components', () => {
  const shapes = geometry.classify([square(0,0,20), square(3,3,14,true), square(6,6,3), square(30,0,4,true)]);
  assert.equal(shapes.length, 3);
  assert.equal(shapes[0].length, 2);
  assert.equal(geometry.classify([square(0,0,20), square(3,3,14)]).length, 1);
  assert.throws(() => geometry.classify([square(0,0,20), square(15,3,10,true)]), /styled raster/, 'mixed winding intersections must not be silently filled');
});

test('adaptive subdivision spends vertices on curved paths and rejects over-budget input', () => {
  const curve = [{type:'M',x:0,y:0},{type:'Q',x1:500,y1:1000,x:1000,y:0},{type:'L',x:0,y:0},{type:'Z'}];
  assert.ok(geometry.flatten(curve, 0.1)[0].length > geometry.flatten(curve, 10)[0].length);
  assert.throws(() => geometry.flatten(curve, 0.01, 3), /budget/);
  assert.throws(() => geometry.flatten([{type:'M',x:Infinity,y:0}]), /Invalid/);
});

test('repeated glyphs reuse origin shapes and kerning is computed once per pair', () => {
  let paths=0,kerns=0;
  const glyph={index:1,advanceWidth:100,getPath(){paths++;return {commands:[{type:'M',x:0,y:0},{type:'L',x:20,y:0},{type:'L',x:20,y:40},{type:'L',x:0,y:40},{type:'Z'}]};}};
  const font={unitsPerEm:1000,stringToGlyphs:s=>[...s].map(()=>glyph),getKerningValue(){kerns++;return 0;}};
  const result=geometry.model(font,'A'.repeat(1000),{quality:10});
  assert.equal(paths,1); assert.equal(kerns,999);
  assert.ok(Number.isFinite(result.bounds.cx)&&Number.isFinite(result.bounds.cy));
  geometry.model(font,'AA',{quality:10}); assert.equal(paths,1);
  assert.equal(result.polygons.length,1000);
});

test('overlapping glyphs dissolve to one silhouette instead of internal outline seams', () => {
  const glyph={index:1,advanceWidth:100,getPath(){return {commands:[{type:'M',x:0,y:0},{type:'L',x:100,y:0},{type:'L',x:100,y:100},{type:'L',x:0,y:100},{type:'Z'}]};}};
  const font={unitsPerEm:1000,stringToGlyphs:s=>[...s].map(()=>glyph),getKerningValue:()=>0};
  const result=geometry.model(font,'AA',{tracking:-5});
  assert.equal(result.polygons.length,1); assert.equal(result.bounds.width,150);
});

test('text model preserves zero advance combining marks and resolves symbol cmaps', () => {
  const origins = [];
  const glyph = (index, advanceWidth) => ({ index, advanceWidth, getPath(x,y) { origins.push(x); return {commands:[{type:'M',x,y},{type:'L',x:x+10,y},{type:'L',x:x+10,y:y+10},{type:'Z'}]}; } });
  const font = { unitsPerEm:1000, getKerningValue:()=>0, charToGlyphIndex:c => c.codePointAt(0) === 0xF041 ? 1 : 0, stringToGlyphs:text => { assert.equal(text, '\uF041'); return [glyph(1,500),glyph(2,0),glyph(3,500)]; } };
  const result = geometry.model(font, 'A', {symbol:true});
  assert.equal(origins[1], origins[2], 'zero advance does not become a full em');
  assert.equal(result.missing.length, 0);
  assert.ok(result.vertices > 0);
});

function serviceHarness({ failParse = false, clock } = {}) {
  const faces = new Set(); let reads = 0, loading = 0, peak = 0, parses = 0;
  class Face { async load() { loading++; peak = Math.max(peak, loading); await new Promise(r => setTimeout(r, 1)); loading--; return this; } }
  class Worker {
    postMessage({id,type}) { if(type === 'prepare') parses++; queueMicrotask(() => this.onmessage({data:{id,...(failParse && type === 'prepare' ? {error:'Unsupported outlines'} : {result:type === 'prepare' ? {codes:[65],name:'Fixture'} : {polygons:[],bounds:{},missing:[]}})}})); }
    terminate() {}
  }
  const context = { FontFace:Face, Worker, Blob, URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}}, performance:clock || performance, setTimeout,clearTimeout, console, document:{getElementById:()=>({textContent:'"worker"'}),fonts:{add:f=>faces.add(f),delete:f=>faces.delete(f)}} };
  vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(root,'src/scripts/font-service.js'),'utf8'),context);
  const record = index => ({name:'Fixture '+index,source:'file',file:{name:'fixture'+index+'.ttf',size:4,lastModified:1,async arrayBuffer(){reads++;return new Uint8Array([0,1,2,3]).buffer;}}});
  return { service:context.GeoGlyphFontService,record,counts:()=>({reads,faces:faces.size,peak,parses}) };
}

test('1000-font catalog reads no bytes; duplicate catalog identities remain stable', async () => {
  const {service,record,counts} = serviceHarness(); const records = Array.from({length:1000},(_,i)=>record(i));
  await service.catalog(records,()=>{}); await service.catalog(records.map(r=>({...r})),()=>{});
  assert.equal(service.stats().resources,1000); assert.equal(counts().reads,0); assert.equal(counts().faces,0);
  service.dispose();
});

test('selected-face preparation deduplicates work, limits native work to two, and caches parsing', async () => {
  const {service,record,counts} = serviceHarness(); const first = record(0);
  await Promise.all([service.ensureFace(first),service.ensureFace({...first})]);
  assert.equal(counts().reads,1); assert.equal(counts().faces,1);
  await Promise.all(Array.from({length:30},(_,i)=>service.ensureFace(record(i+1))));
  assert.equal(counts().peak,2); assert.ok(counts().faces <=24);
  await service.prepare(first); await service.prepare(first); assert.equal(counts().parses,1);
  service.dispose(); assert.equal(counts().faces,0);
});

test('unsupported outline parsing keeps an independently loaded browser face and caches failure', async () => {
  const {service,record,counts} = serviceHarness({failParse:true}); const font = record(0);
  await service.ensureFace(font); await assert.rejects(service.prepare(font),/Unsupported/); await assert.rejects(service.prepare(font),/Unsupported/);
  assert.equal(counts().faces,1); assert.equal(counts().reads,1); assert.equal(counts().parses,1);
  service.dispose();
});

test('cancelling a catalog stops later slices without reading font data', async () => {
  let time=0; const {service,record,counts} = serviceHarness({clock:{now:()=>++time}});
  const importing=service.catalog(Array.from({length:1000},(_,i)=>record(i)),()=>{}); service.cancelCatalog();
  const result=await importing; assert.equal(result.cancelled,true); assert.ok(result.done<1000); assert.equal(counts().reads,0); service.dispose();
});

test('standalone worker protocol parses a real generated font, caches models and evicts inactive fonts', () => {
  const opentype = require('../../src/vendor/opentype.js');
  const p=new opentype.Path();p.moveTo(0,0);p.lineTo(500,0);p.lineTo(250,700);p.close();
  const font=new opentype.Font({familyName:'Fixture',styleName:'Regular',unitsPerEm:1000,ascender:800,descender:-200,glyphs:[new opentype.Glyph({name:'.notdef',advanceWidth:500,path:new opentype.Path()}),new opentype.Glyph({name:'A',unicode:65,advanceWidth:600,path:p})]});
  const buffer=font.toArrayBuffer(); const responses=[]; const context={postMessage:r=>responses.push(r),console}; context.self=context;
  vm.createContext(context);
  for(const file of ['src/vendor/opentype.js','src/vendor/polygon-clipping.js','src/scripts/ground-geometry.js','src/workers/font-geometry-worker.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
  let id=0; const request=(type,payload)=>{ context.onmessage({data:{id:++id,type,payload}}); const result=responses.pop(); assert.equal(result.error,undefined,result.error); return result.result; };
  assert.ok(request('prepare',{key:'one',buffer}).codes.includes(65));
  const first=request('model',{key:'one',text:'A',options:{quality:10}}); assert.ok(first.polygons.length);
  request('model',{key:'one',text:'A',options:{quality:10}}); assert.equal(request('stats',{}).models,1);
  request('prepare',{key:'two',buffer});request('prepare',{key:'three',buffer});assert.equal(request('stats',{}).fonts,2);
  assert.deepEqual(request('model',{key:'one',text:'A',options:{quality:10}}),first,'complete cached outlines do not require the evicted parsed font');
});
