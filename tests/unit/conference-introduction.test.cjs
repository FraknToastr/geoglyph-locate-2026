const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const cues=require('../../src/scripts/conference-cues.js');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/conference-presentation.js'),'utf8');
const flush=()=>new Promise(setImmediate);
function harness(){
  let finish,options,starts=0,stops=0,paused=false;
  const calls=[],listeners={},map={previewActive:true,mode:'arcgis',extrusionEnabled:false,nativeColor:true,map:{stop(){}},fontRecords:new Map([['gill',{family:'Gill Sans'}]])};
  const engine={state:map,cancelConferenceWork(){calls.push('cancel');},showConferenceOverview(){calls.push('overview');},setConnectionStatus(){},
    async drawConferenceOpening(){calls.push('opening');},async applyConferenceCue(patch){calls.push(patch.message);return{};}};
  const scripts={playConference:opts=>{starts++;options=opts;return new Promise(resolve=>finish=resolve);},
    stopConference(){stops++;finish?.(false);},pauseConference(){paused=true;},resumeConference(){paused=false;}};
  const client={latestCue:async()=>null,afterCues:async()=>[]};
  const window={GeoGlyphConferenceConfig:{enabled:true},GeoGlyphSurveyResults:{create:()=>client},GeoGlyphMapEngine:engine,GeoGlyphConferenceCues:cues,GeoGlyphScripts:scripts,GeoGlyph3D:{stopOrbit(){}}};
  const ctx=vm.createContext({window,document:{hidden:false,addEventListener:(name,fn)=>listeners[name]=fn},retryStartup(){},setTimeout,clearTimeout,console});
  vm.runInContext(source.slice(0,source.indexOf('  async function conferenceFonts('))+'})();',ctx);
  const api=window.GeoGlyphConference;api.state.ready=true;api.state.fontIds={'Segoe UI Emoji':'emoji','Gill Sans':'gill'};
  return {api,map,calls,client,listeners,get starts(){return starts;},get stops(){return stops;},get paused(){return paused;},
    async begin(){api.state.queue.push({objectId:1,attributes:{special_commands:'begin'}});api.resume();await flush();},
    async row(row){await options.onRowStart(row);if(row.message){map.nativeColor=false;map.selectedFontId='gill';}await options.onRow(row);},
    async finish(completed=true){finish(completed);await flush();},current:()=>options.isCurrent()};
}
test('Begin delegates to the shared editable script player and records its committed rows',async()=>{
  const h=harness();await h.begin();assert.equal(h.starts,1);assert.equal(h.api.state.phase,'beginning');
  await h.row({message:'',actions:[{type:'camera',value:'opening'}]});
  await h.row({message:'',actions:[{type:'camera',value:'fly-opening'}]});
  await h.row({message:'Edited introduction',actions:[]});
  await h.finish();assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.content.message,'Edited introduction');assert.equal(h.api.state.lastAppliedId,1);
  assert.ok(h.api.state.history.some(e=>e.phase==='flight'));assert.ok(h.api.state.history.some(e=>e.phase==='fit'));assert.ok(h.api.state.history.some(e=>e.phase==='introduction-0'));
});
test('Stop and Resume delegate pause state to the conference-owned script only',async()=>{
  const h=harness();await h.begin();h.api.pause();assert.equal(h.paused,true);assert.equal(h.api.state.paused,true);
  h.api.resume();assert.equal(h.paused,false);await h.finish();assert.equal(h.api.state.applying,false);
});
test('Reset preempts the shared script and redraws the opening without applying queued older text',async()=>{
  const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin();
  h.client.afterCues=async()=>[{objectId:2,attributes:{geoglyph_speaks:'old'}},{objectId:3,attributes:{special_commands:'reset'}}];
  await h.api.poll(layer);await flush();assert.ok(h.stops>0);assert.equal(h.api.state.lastAppliedId,3);assert.equal(h.api.state.phase,'overview');
  assert.ok(h.calls.includes('opening'));assert.ok(!h.calls.includes('old'));assert.equal(h.api.state.applying,false);
});
test('ordinary responses wait behind the introduction and duplicate Begin does not start a second player',async()=>{
  const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin();
  h.client.afterCues=async()=>[{objectId:2,attributes:{special_commands:'begin'}},{objectId:3,attributes:{geoglyph_speaks:'next'}}];
  await h.api.poll(layer);assert.equal(h.starts,1);assert.equal(h.api.state.queue.length,1);assert.ok(!h.calls.includes('next'));
  await h.finish();assert.ok(h.calls.includes('next'));assert.equal(h.api.state.lastAppliedId,3);
});
test('manual artwork changes invalidate pending script callbacks without returning to overview',async()=>{
  const h=harness();await h.begin();h.listeners['geoglyph:manual-map-change']();await flush();
  assert.equal(h.current(),false);assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.applying,false);assert.ok(!h.calls.includes('overview'));
});
test('leaving Map releases Begin when its cancelled script resolves normally and permits another Begin',async()=>{
  const h=harness();await h.begin();h.map.previewActive=false;await h.finish(false);
  assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.applying,false);assert.equal(h.api.state.lastAppliedId,null);
  h.map.previewActive=true;await h.begin();assert.equal(h.starts,2);await h.finish();assert.equal(h.api.state.phase,'live');
});
