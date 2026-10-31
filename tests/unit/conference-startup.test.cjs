const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'src/scripts/conference-presentation.js'), 'utf8');
const flush = () => new Promise(setImmediate);
function harness(options = {}) {
  let sequence = 0, now = 0;
  const timers = new Map(), calls = { fetch:[], defaults:0, registrations:0, polls:0, draws:0, retries:0, faces:[], parses:[], aborts:0, errors:[] };
  const manifest = ['Segoe UI Emoji','Gill Sans','Forte','Chiller','Magneto','Showcard Gothic'].map((key,i) => ({ key,
    name:key, family:key, style:'Regular', emoji:i===0, file:'font-'+i, ...(options.inline ? {data:'AAECAw=='} : {}) }));
  const map = { mapReady:options.mapReady !== false, fontRecords:new Map() };
  let registered = [];
  const nodes = { 'geoglyph-conference-fonts':{textContent:JSON.stringify(manifest)},
    geoglyphMapEditor:{classList:{add(){}},querySelector:()=>({setAttribute(){}})}, mapArcgisInterval:{} };
  const engine = { state:map, showMap(){calls.defaults++;}, refreshControls(){}, setConnectionStatus(){},
    refreshFonts(){for(const f of registered)map.fontRecords.set('geoglyph:'+f.id,f);},
    retryConferenceMapInitialization(){calls.retries++;map.mapReady=true;},
    showConferenceOverview(){}, async drawConferenceOpening(_id,opts){calls.draws++;assert.ok(opts.isCurrent());},
    async startPolling(){calls.polls++;}, cancelConferenceWork(){} };
  const window = { GeoGlyphConferenceConfig:{enabled:true,pollSeconds:1}, GeoGlyphSurveyResults:{create:()=>({})},
    GeoGlyphStudio:{state:{fonts:[{family:'Segoe UI Emoji',id:'preset-emoji'}]},registerFonts(records){calls.registrations++;registered=records;return records;}},
    GeoGlyph3D:{}, GeoGlyphMapEngine:engine,
    GeoGlyphFontService:{async ensureFace(record,opts){calls.faces.push(opts);if(options.face)await options.face(record,opts);},
      async prepare(record,opts){calls.parses.push(opts);if(options.parse)await options.parse(record,opts);}} };
  if (options.noHost) delete window.GeoGlyphStudio;
  const ctx = vm.createContext({window,document:{getElementById:id=>nodes[id]},location:{protocol:options.inline?'file:':'https:'},
    AbortController, Uint8Array, atob, console:{error(...args){calls.errors.push(args);}},
    setTimeout(fn,ms){const id=++sequence;timers.set(id,{fn,due:now+ms});return id;},clearTimeout(id){timers.delete(id);},
    async fetch(file,{signal}){calls.fetch.push(file);signal.addEventListener('abort',()=>calls.aborts++);
      if(options.fetch)return options.fetch(file,signal,calls);
      return {ok:true,arrayBuffer:async()=>new Uint8Array([0,1,2,3]).buffer};} });
  vm.runInContext(source,ctx);
  return {api:window.GeoGlyphConference,window,map,calls,timers,
    async advance(ms){now+=ms;for(const [id,t]of [...timers])if(t.due<=now){timers.delete(id);t.fn();}await flush();} };
}

test('startup coalesces callers, preserves all six fonts and starts one poller; ready retry is a no-op',async()=>{
  const h=harness(), first=h.api.retryStartup(), same=h.api.retryStartup();assert.equal(first,same);
  assert.equal(await first,true);assert.equal(h.api.state.ready,true);assert.equal(h.calls.fetch.length,6);
  assert.equal(h.calls.faces.length,6);assert.equal(h.calls.parses.length,5);assert.equal(h.calls.polls,1);
  assert.equal(h.calls.defaults,1);await h.api.retryStartup();assert.equal(h.calls.polls,1);assert.equal(h.timers.size,0);
});
test('embedded portable fonts do not fetch and retain exact startup policy',async()=>{
  const h=harness({inline:true});assert.equal(await h.api.retryStartup(),true);assert.equal(h.calls.fetch.length,0);
  assert.equal(h.calls.faces.length,6);assert.equal(h.calls.draws,1);assert.equal(h.map.nativeColor,true);assert.equal(h.map.extrusionEnabled,false);
});
test('permanent font failure settles; Start retry reuses good downloads and clears prior preparation failure',async()=>{
  let fail=true;
  const h=harness({fetch:async file=>file==='font-1'&&fail?{ok:false,status:404}:{ok:true,arrayBuffer:async()=>new ArrayBuffer(4)}});
  assert.equal(await h.api.retryStartup(),false);assert.match(h.api.state.error,/HTTP 404/);
  assert.equal(h.calls.fetch.filter(x=>x==='font-1').length,1);assert.equal(h.calls.polls,0);
  await flush();fail=false;assert.equal(await h.api.retryStartup(),true);
  assert.equal(h.calls.fetch.length,7);assert.equal(h.calls.defaults,1);assert.equal(h.calls.polls,1);
  assert.ok(h.calls.faces.every(opts=>opts.timeoutMs===30000));assert.ok(h.calls.parses.every(opts=>opts.retry));
});
test('a held response body is timed out and aborted before a bounded delayed retry',async()=>{
  let first=true,heldSignal;
  const h=harness({fetch:async(file,signal)=>({ok:true,arrayBuffer:()=>{
    if(file==='font-1'&&first){first=false;heldSignal=signal;return new Promise(()=>{});}
    return Promise.resolve(new ArrayBuffer(4));
  }})});
  const startup=h.api.retryStartup();await flush();await h.advance(15000);
  assert.equal(h.calls.fetch.filter(x=>x==='font-1').length,1);assert.equal(heldSignal.aborted,true);
  await h.advance(1000);assert.equal(await startup,true);assert.equal(h.calls.fetch.filter(x=>x==='font-1').length,2);
});
test('transient HTTP failure retries twice then settles; no fourth automatic request',async()=>{
  const h=harness({fetch:async()=>({ok:false,status:503})});const pending=h.api.retryStartup();await flush();
  await h.advance(1000);await h.advance(2000);assert.equal(await pending,false);
  assert.equal(h.calls.fetch.length,18);assert.equal(h.calls.polls,0);assert.equal(h.timers.size,0);
});
test('missing host reaches its deadline with no engine access exception or perpetual readiness loop',async()=>{
  const h=harness({noHost:true});delete h.window.GeoGlyphMapEngine;
  const pending=h.api.retryStartup();await flush();await h.advance(10000);assert.equal(await pending,false);
  assert.match(h.api.state.error,/dependencies/);await h.advance(20);assert.equal(h.timers.size,0);
});
test('whole-startup deadline settles a held preparation and rejects stale continuations',async()=>{
  let release;const held=new Promise(resolve=>{release=resolve;});let hang=true;
  const h=harness({parse:async()=>{if(hang)await held;}});const pending=h.api.retryStartup();await flush();
  await h.advance(120000);assert.equal(await pending,false);assert.equal(h.calls.polls,0);
  hang=false;assert.equal(await h.api.retryStartup(),true);release();await flush();
  assert.equal(h.calls.polls,1);assert.equal(h.calls.draws,1);assert.equal(h.calls.defaults,1);
});
test('explicit startup retry requests preparation retry after a cached preparation error',async()=>{
  let fail=true;const h=harness({parse:async()=>{if(fail)throw Error('Font worker unavailable');}});
  assert.equal(await h.api.retryStartup(),false);fail=false;assert.equal(await h.api.retryStartup(),true);
  assert.equal(h.calls.fetch.length,6);assert.ok(h.calls.parses.some(opts=>opts.retry===false));
  assert.ok(h.calls.parses.some(opts=>opts.retry===true));assert.equal(h.calls.polls,1);
});
test('failed map readiness can retry without reinitializing defaults or recreating a ready map',async()=>{
  const h=harness({mapReady:false});const pending=h.api.retryStartup();await flush();await h.advance(20000);
  assert.equal(await pending,false);assert.match(h.api.state.error,/map/);
  assert.equal(await h.api.retryStartup(),true);assert.equal(h.calls.retries,1);assert.equal(h.calls.defaults,1);
  await h.api.retryStartup();assert.equal(h.calls.retries,1);
});

test('an optional native face deadline frees its acquisition slot and allows explicit retry',async()=>{
  const serviceSource=fs.readFileSync(path.join(root,'src/scripts/font-service.js'),'utf8');
  const timers=new Map();let id=0,hang=true;
  class Face{load(){return hang?new Promise(()=>{}):Promise.resolve(this);}}
  const ctx=vm.createContext({FontFace:Face,performance,console,
    setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);},
    document:{fonts:{add(){},delete(){}}}});vm.runInContext(serviceSource,ctx);
  const font={id:'face',fontResourceKey:'face',arrayBuffer:new ArrayBuffer(4)};
  const failure=ctx.GeoGlyphFontService.ensureFace(font,{timeoutMs:30000}).catch(e=>e.message);await flush();
  [...timers.values()].find(t=>t.ms===30000).fn();assert.match(await failure,/timed out/);await flush();
  assert.equal(ctx.GeoGlyphFontService.stats().active,0);hang=false;
  assert.ok((await ctx.GeoGlyphFontService.ensureFace(font,{timeoutMs:30000,retry:true})).face);
  ctx.GeoGlyphFontService.dispose();assert.equal(timers.size,0);
});

const engineSource=fs.readFileSync(path.join(root,'src/scripts/geoglyph-map-engine-inline.js'),'utf8');
function engineFunction(name){const start=engineSource.indexOf('function '+name+'(');assert.ok(start>=0);return engineSource.slice(start,engineSource.indexOf('\n  }',start)+4);}
function mapHarness(){
  const instances=[],frames=[],timers=new Map();let timerId=0,firstGate=null,ensureCalls=0;
  class MapFixture{
    constructor(){this.events=new Map();this.removed=false;this.sources=new Map();this.layers=new Map();instances.push(this);}
    on(type,fn){this.events.set(type,fn);return this;}
    once(type,fn){this.events.set(type,fn);return this;}
    addControl(){} getSource(id){return this.sources.get(id);}addSource(id,value){this.sources.set(id,value);}
    getLayer(id){return this.layers.get(id);}addLayer(layer){this.layers.set(layer.id,layer);}
    remove(){this.removed=true;this.events.get('remove')?.();}
  }
  const state={map:null,mapInitialising:false,mapReady:false,anchor:{lng:138,lat:-35},conferenceRenderSuspended:true};
  const context=vm.createContext({mapState:state,presentation:true,AUSTRALIA_BOUNDS:[],ESRI_AERIAL_URL:'fixture',ESRI_TOPO_URL:'fixture',
    SOURCE_ID:'source',FILL_LAYER_ID:'fill',LINE_LAYER_ID:'line',GeoGlyphCameraControl:class {},console,
    window:{maplibregl:{Map:MapFixture,NavigationControl:class {},ScaleControl:class {}},GeoGlyph3D:{clear(){}},
      setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout(id){timers.delete(id);}},
    async ensureMapLibre(){ensureCalls++;if(ensureCalls===1&&firstGate)await firstGate;return true;},
    webglSupported:()=>true,$:()=>({}),requestAnimationFrame:fn=>frames.push(fn),
    setStatus(){},syncMetroMapKeyUi(){},syncBasemapButtons(){},refreshFontStore(){},selectedRecord:()=>({}),
    placeAnchor(){},emptyFeatureCollection:()=>({features:[]}),showConferenceOverview(){},rebuildAfterZoom(){} });
  vm.runInContext('let mapInitialisationGeneration=0;'+engineFunction('retryConferenceMapInitialization')+'\nasync '+engineFunction('initMap'),context);
  return {context,state,instances,frames,holdFirst(){let release;firstGate=new Promise(resolve=>{release=resolve;});return release;},
    async paint(){while(frames.length){const pending=frames.splice(0);pending.forEach(fn=>fn());await flush();}}};
}
test('map retry invalidates an old initialization awaiting the vendor and preserves newer initialization ownership',async()=>{
  const h=mapHarness(),release=h.holdFirst(),old=h.context.initMap();await flush();
  const latest=h.context.retryConferenceMapInitialization();await flush();release();await old;
  assert.equal(h.state.mapInitialising,true);await h.paint();await latest;
  assert.equal(h.instances.length,1);assert.equal(h.state.map,h.instances[0]);assert.equal(h.state.mapInitialising,false);
});
test('map retry invalidates an old initializer awaiting animation frames before map construction',async()=>{
  const h=mapHarness(),old=h.context.initMap();await flush();assert.equal(h.frames.length,1);
  const latest=h.context.retryConferenceMapInitialization();await flush();await h.paint();await Promise.all([old,latest]);
  assert.equal(h.instances.length,1);assert.equal(h.state.map,h.instances[0]);
});
test('old map style completion cannot mark a replacement ready; ready map retry is a no-op',async()=>{
  const h=mapHarness(),first=h.context.initMap();await flush();await h.paint();await first;const old=h.instances[0];
  const latest=h.context.retryConferenceMapInitialization();await flush();await h.paint();await latest;
  old.events.get('style.load')();assert.equal(h.state.mapReady,false);assert.equal(old.removed,true);
  h.instances[1].events.get('style.load')();assert.equal(h.state.mapReady,true);
  h.context.retryConferenceMapInitialization();assert.equal(h.instances.length,2);assert.equal(h.instances[1].removed,false);
});
test('Start routes failed presentation startup to retry, while ready Start preserves polling semantics',async()=>{
  let retries=0,polls=0,stops=0,resumes=0;const conference={state:{ready:false},retryStartup:async()=>{retries++;return false;},resume(){resumes++;}};
  const state={};const ctx=vm.createContext({presentation:true,window:{GeoGlyphConference:conference},mapState:state,
    stopArcgisPolling(){stops++;},syncArcgisControls(){},async pollArcgisOnce(){polls++;}});
  vm.runInContext('async '+engineFunction('startArcgisPolling'),ctx);
  await ctx.startArcgisPolling();assert.equal(retries,1);assert.equal(polls,0);assert.equal(stops,0);
  conference.state.ready=true;await ctx.startArcgisPolling();assert.equal(retries,1);assert.equal(polls,1);assert.equal(stops,1);assert.equal(resumes,1);
});
