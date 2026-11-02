const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const cues=require('../../src/scripts/conference-cues.js');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/conference-presentation.js'),'utf8');
const flush=()=>new Promise(setImmediate);
const transcript=['🥱','😶','😏','😏','🙂','Hello',"I'm Geoglyph",'Call me Geo','I was made by ChatGPT','Today I will be presenting','with my best friend','Josh Roberts','Where are you Josh?'];
function harness(options={}){
  let now=0,seq=0;const timers=new Map(),listeners={},calls=[],doc={hidden:false,addEventListener:(type,fn)=>{listeners[type]=fn;}};
  const map={previewActive:true,mode:'arcgis',extrusionEnabled:false,map:{stop(){}},fontRecords:new Map()};
  const engine={state:map,cancelConferenceWork(){calls.push({type:'cancel',time:now});},showConferenceOverview(){calls.push({type:'overview',time:now});},setConnectionStatus(){},
    async drawConferenceOpening(){calls.push({type:'opening',time:now});},async flyToConferenceOpening(){calls.push({type:'flight',time:now});await options.flight?.();},
    async applyConferenceCue(patch){calls.push({type:'cue',time:now,patch:{...patch}});await options.apply?.(patch);map.extrusionEnabled=patch.extrusionEnabled;return{fitted:true};},
    async waitForCamera(){calls.push({type:'camera',time:now});}};
  const client={latestCue:async()=>null,afterCues:async()=>[]};
  const window={GeoGlyphConferenceConfig:{enabled:true},GeoGlyphSurveyResults:{create:()=>client},GeoGlyphMapEngine:engine,GeoGlyphConferenceCues:cues,
    GeoGlyph3D:{stopOrbit(){},ensureOrbit(mode,opts){calls.push({type:'orbit',time:now,mode,opts});return true;}}};
  const ctx=vm.createContext({window,document:doc,retryStartup(){},performance:{now:()=>now},console,
    setTimeout(fn,ms){timers.set(++seq,{fn,due:now+ms});return seq;},clearTimeout:id=>timers.delete(id)});
  vm.runInContext(source.slice(0,source.indexOf('  async function conferenceFonts('))+'})();',ctx);
  const api=window.GeoGlyphConference;api.state.ready=true;api.state.fontIds={'Segoe UI Emoji':'emoji','Gill Sans':'gill'};
  return {api,map,client,doc,listeners,calls,timers,
    async begin(){api.state.queue.push({objectId:1,attributes:{special_commands:'begin'}});api.resume();await flush();},
    async advance(ms){now+=ms;for(const [id,t]of [...timers])if(t.due<=now){timers.delete(id);t.fn();}await flush();},
    async hidden(value){doc.hidden=value;listeners.visibilitychange();await flush();},
    steps:()=>calls.filter(c=>c.type==='cue')};
}
test('Begin renders the exact transcript and final Large 3D Turn after thirteen visible holds',async()=>{
  const h=harness();await h.begin();assert.equal(h.calls[0].type,'opening');assert.equal(h.calls[1].type,'flight');
  for(let i=0;i<13;i++){await h.advance(4999);assert.equal(h.steps().length,i);await h.advance(1);assert.equal(h.steps().length,i+1);}
  assert.deepEqual(h.steps().map(c=>c.patch.message),transcript);
  assert.deepEqual(h.steps().map(c=>c.time),transcript.map((_,i)=>(i+1)*5000));
  assert.deepEqual(h.steps().map(c=>c.patch.mirrorX),transcript.map((_,i)=>i===3));
  for(const {patch}of h.steps().slice(0,-1)){assert.equal(patch.extrusionEnabled,false);assert.equal(patch.height,300);assert.equal(patch.depth,30);assert.equal(patch.relativeSize,100);}
  const final=h.steps().at(-1).patch;assert.equal(final.fontId,'gill');assert.equal(final.height,30000);assert.equal(final.depth,3000);assert.equal(final.animation,'yaw');
  assert.equal(final.extrusionEnabled,true);assert.equal(h.calls.at(-2).type,'orbit');assert.equal(h.calls.at(-2).mode,'yaw');assert.equal(h.calls.at(-1).type,'camera');
  assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.lastAppliedId,1);assert.equal(h.api.state.content.message,'Where are you Josh?');assert.equal(h.timers.size,0);
});
test('Stop and Resume preserve remaining hold time rather than consuming paused time',async()=>{
  const h=harness();await h.begin();await h.advance(2000);h.api.pause();await h.advance(100000);assert.equal(h.steps().length,0);
  h.api.resume();await h.advance(2999);assert.equal(h.steps().length,0);await h.advance(1);assert.equal(h.steps().length,1);
});
test('hidden time cannot consume introduction holds',async()=>{
  const h=harness();await h.begin();await h.advance(2000);await h.hidden(true);await h.advance(100000);assert.equal(h.steps().length,0);
  await h.hidden(false);await h.advance(3000);assert.equal(h.steps().length,1);
});
test('the first hold starts after the descent and later holds after artwork/Fit completion',async()=>{
  let arrive,draw;const flight=new Promise(r=>{arrive=r;}),first=new Promise(r=>{draw=r;});
  const h=harness({flight:()=>flight,apply:p=>p.message==='🥱'?first:undefined});await h.begin();await h.advance(100000);assert.equal(h.steps().length,0);
  arrive();await flush();await h.advance(5000);assert.equal(h.steps().length,1);await h.advance(50000);assert.equal(h.steps().length,1);
  draw();await flush();await h.advance(4999);assert.equal(h.steps().length,1);await h.advance(1);assert.equal(h.steps().length,2);
});
test('Reset interrupts a hold, clears queued responses and cannot revive old timers',async()=>{
  const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin();await h.advance(5000);
  h.api.state.queue.push({objectId:2,attributes:{geoglyph_speaks:'queued'}});
  h.client.afterCues=async()=>[{objectId:3,attributes:{special_commands:'reset'}}];await h.api.poll(layer);await flush();
  assert.equal(h.api.state.phase,'overview');assert.equal(h.api.state.lastAppliedId,3);assert.equal(h.api.state.queue.length,0);
  await h.advance(100000);assert.equal(h.steps().length,1);assert.equal(h.timers.size,0);assert.equal(h.api.state.applying,false);
});
test('manual artwork changes cancel the script without returning to the overview',async()=>{
  const h=harness();await h.begin();await h.advance(5000);const overviews=h.calls.filter(c=>c.type==='overview').length;
  h.listeners['geoglyph:manual-map-change']();await flush();await h.advance(100000);
  assert.equal(h.steps().length,1);assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.applying,false);
  assert.equal(h.calls.filter(c=>c.type==='overview').length,overviews);assert.equal(h.timers.size,0);
});
test('manual change dispatch lets its caller mutate artwork before queued survey work starts',async()=>{
  let manualMutationFinished=false;
  const h=harness({apply:p=>{if(p.message==='manual-followup')assert.equal(manualMutationFinished,true);}});
  await h.begin();await h.advance(5000);
  h.api.state.queue.push({objectId:2,attributes:{geoglyph_speaks:'manual-followup'}});
  h.listeners['geoglyph:manual-map-change']();
  assert.equal(h.steps().length,1);
  manualMutationFinished=true;await flush();
  assert.equal(h.steps().at(-1).patch.message,'manual-followup');assert.equal(h.api.state.lastAppliedId,2);
});
test('Reset still redraws immediately while Stop keeps later ordinary work paused',async()=>{
  const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin();h.api.pause();
  h.client.afterCues=async()=>[{objectId:3,attributes:{special_commands:'reset'}},{objectId:4,attributes:{geoglyph_speaks:'later'}}];
  await h.api.poll(layer);await flush();assert.equal(h.api.state.lastAppliedId,3);assert.equal(h.api.state.phase,'overview');
  assert.equal(h.api.state.paused,true);assert.equal(h.api.state.queue.length,1);assert.equal(h.calls.filter(c=>c.type==='opening').length,2);
  h.api.resume();await flush();assert.equal(h.api.state.lastAppliedId,4);assert.equal(h.steps().at(-1).patch.message,'later');
});
test('ordinary responses remain queued during introduction and a duplicate Begin is ignored',async()=>{
  const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin();
  h.client.afterCues=async()=>[{objectId:2,attributes:{special_commands:'begin'}},{objectId:3,attributes:{geoglyph_speaks:'next'}}];
  await h.api.poll(layer);assert.equal(h.api.state.queue.length,1);assert.equal(h.api.state.queue[0].objectId,3);
  for(let i=0;i<13;i++)await h.advance(5000);
  assert.equal(h.steps().length,14);assert.equal(h.steps().at(-1).patch.message,'next');assert.equal(h.api.state.lastAppliedId,3);
});
test('failed introduction step keeps prior successful content and releases the busy flag',async()=>{
  const h=harness({apply:p=>{if(p.message==='😶')throw Error('fixture draw failed');}});await h.begin();await h.advance(5000);await h.advance(5000);
  assert.equal(h.api.state.content.message,'🥱');assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.applying,false);assert.match(h.api.state.error,/fixture draw failed/);
  await h.advance(100000);assert.equal(h.steps().length,2);assert.equal(h.timers.size,0);
});
test('leaving Map invalidates the held step without further rendering',async()=>{
  const h=harness();await h.begin();h.map.previewActive=false;await h.advance(100);assert.equal(h.steps().length,0);assert.equal(h.api.state.applying,false);assert.equal(h.timers.size,0);
});
