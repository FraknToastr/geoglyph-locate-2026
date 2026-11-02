const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/font-service.js'),'utf8');
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
function harness(query){
  const faces=new Set();let calls=0;
  class FontFace{async load(){return this;}}
  const c=vm.createContext({performance,setTimeout,clearTimeout,FontFace,
    document:{fonts:{add:face=>faces.add(face),delete:face=>faces.delete(face)}},
    queryLocalFonts:query&&(()=>{calls++;return query();})});
  vm.runInContext(source,c);
  return {service:c.GeoGlyphFontService,faces,calls:()=>calls};
}
function descriptor(overrides={}){return {family:'Example',fullName:'Example Regular',postscriptName:'Example-Regular',style:'Regular',blob:async()=>({arrayBuffer:async()=>new ArrayBuffer(16)}),...overrides};}
test('permission request invokes browser API synchronously and shares concurrent request without reading fonts',async t=>{
  let release,reads=0;const font=descriptor({blob:()=>{reads++;throw Error('Not selected');}});
  const h=harness(()=>new Promise(resolve=>{release=resolve;}));t.after(()=>h.service.dispose());
  const first=h.service.requestLocalFonts(),second=h.service.requestLocalFonts();
  assert.equal(h.calls(),1);assert.equal(first,second);release([font]);await first;
  assert.equal(h.service.localFonts()[0],font);assert.equal(reads,0);
});
test('matching uses exact identities and style, rejects substring and ambiguous faces',async t=>{
  const regular=descriptor(),bold=descriptor({fullName:'Example Bold',postscriptName:'Example-Bold',style:'Bold'});
  const h=harness(async()=>[regular,bold]);t.after(()=>h.service.dispose());await h.service.requestLocalFonts();
  assert.equal(h.service.matchLocalFont({postscriptName:'Example-Bold'}),bold);
  assert.equal(h.service.matchLocalFont({name:'Example Regular'}),regular);
  assert.equal(h.service.matchLocalFont({family:'Example',style:'Bold'}),bold);
  assert.equal(h.service.matchLocalFont({family:'Example'}),regular);
  assert.equal(h.service.matchLocalFont({name:'Example Extra',family:'Example Extra'}),null);
  const ambiguous=harness(async()=>[regular,{...regular}]);t.after(()=>ambiguous.service.dispose());await ambiguous.service.requestLocalFonts();
  assert.equal(ambiguous.service.matchLocalFont({postscriptName:'Example-Regular'}),null);
});
test('a failed preset recovers after permission and aliases retain a canonical exact byte source',async t=>{
  const font=descriptor();const h=harness(async()=>[font]);t.after(()=>h.service.dispose());
  const preset={id:'preset',name:'Example',family:'Example'};
  await assert.rejects(h.service.ensureFace(preset),/Exact font bytes unavailable/);
  await h.service.requestLocalFonts();
  const resource=await h.service.ensureFace(preset);
  assert.equal(preset.localDescriptor,font);assert.equal(preset.fontResourceKey,'local:example-regular:regular');
  assert.equal(h.faces.size,1);assert.equal(resource.provider,preset);
  const alias={id:'alias',fontResourceKey:preset.fontResourceKey,name:'Metadata only'};
  h.service.register(alias);assert.equal(resource.provider,preset);assert.equal(alias.exactFace,true);
});
test('map aliases resolve their host preset and use the shared local key',async t=>{
  const font=descriptor(),h=harness(async()=>[font]);t.after(()=>h.service.dispose());await h.service.requestLocalFonts();
  const host={id:'host',name:'Example',family:'Example',fontResourceKey:'css:example:'};
  const alias={id:'map-host',name:'Example',family:'Example',fontResourceKey:host.fontResourceKey,geoGlyphRef:host};
  h.service.resolveLocalFont(alias);
  assert.equal(alias.localDescriptor,font);assert.equal(host.metadata,font);assert.equal(alias.fontResourceKey,host.fontResourceKey);
  await h.service.ensureFace(alias);assert.equal(h.faces.size,1);
});
test('descriptor attached externally rebinds a previously failed CSS alias',async t=>{
  const h=harness();t.after(()=>h.service.dispose());const host={id:'host',family:'Example'};
  const alias={id:'map',family:'Example',geoGlyphRef:host};
  await assert.rejects(h.service.ensureFace(alias),/bytes unavailable/);
  host.metadata=descriptor();await h.service.ensureFace(alias);
  assert.equal(alias.fontResourceKey,'local:example-regular:regular');assert.equal(h.faces.size,1);
});
test('old read failure cannot poison a replacement byte provider or clear its pending work',async t=>{
  const h=harness();t.after(()=>h.service.dispose());let reject;
  const old={id:'old',fontResourceKey:'shared',file:{arrayBuffer:()=>new Promise((_,fail)=>{reject=fail;})}};
  const pending=h.service.ensureFace(old);const rejected=assert.rejects(pending,/old read failed/);await flush();
  const replacement={id:'new',fontResourceKey:'shared',arrayBuffer:new ArrayBuffer(16)};
  const current=h.service.ensureFace(replacement);reject(Error('old read failed'));await rejected;
  await current;await h.service.ensureFace(replacement);assert.equal(h.faces.size,1);
  assert.equal(h.service.register(replacement).readError,null);assert.equal(h.service.register(replacement).faceError,null);
});
test('a renewed descriptor retries a previous access failure without losing font identity',async t=>{
  let current=descriptor({blob:async()=>{throw Error('permission expired');}});
  const h=harness(async()=>[current]);t.after(()=>h.service.dispose());await h.service.requestLocalFonts();
  const first={id:'scanned',metadata:current,family:'Example'};
  await assert.rejects(h.service.ensureFace(first),/permission expired/);
  current=descriptor();await h.service.requestLocalFonts();
  const refreshed={id:'scanned',metadata:current,family:'Example'};
  await h.service.ensureFace(refreshed);assert.equal(h.faces.size,1);
});
test('denied or unavailable permission rejects without touching an already valid font',async t=>{
  const h=harness(async()=>{throw Error('Permission denied');});t.after(()=>h.service.dispose());
  await h.service.ensureFace({id:'uploaded',arrayBuffer:new ArrayBuffer(16)});
  await assert.rejects(h.service.requestLocalFonts(),/Permission denied/);assert.equal(h.faces.size,1);
  const absent=harness();t.after(()=>absent.service.dispose());await assert.rejects(absent.service.requestLocalFonts(),/unavailable/);
});
test('disposed service cannot retain descriptors returned by an old permission request',async()=>{
  let release;const h=harness(()=>new Promise(resolve=>{release=resolve;}));
  const pending=h.service.requestLocalFonts();h.service.dispose();release([descriptor()]);
  await assert.rejects(pending,/disposed/);assert.equal(h.service.localFonts().length,0);
});
