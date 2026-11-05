const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const cues=require('../../src/scripts/conference-cues.js');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/conference-presentation.js'),'utf8');
const flush=()=>new Promise(setImmediate);
const transcript=['🥱','😶','😏','😏','😎','Hello',"I'm Geoglyph",'Call me Geo','Everything you about to see','was made by ChatGPT','including me!','Today I will be presenting','with my best friend','Josh Roberts','Where are you Josh?'];
const delays=[0,5000,3000,3000,3000,5000,5000,5000,5000,5000,5000,5000,5000,5000,5000];
function harness(options={}){
  let now=0,seq=0;const timers=new Map(),listeners={},calls=[],titles=[],nodes=[];
  const workspace={append(node){nodes.push(node);node.connected=true;}};
  const doc={hidden:false,addEventListener:(type,fn)=>{listeners[type]=fn;},
    getElementById:id=>id==='geoglyphMapWorkspace'?workspace:nodes.find(node=>node.id===id&&node.connected),
    createElement(){let text='';return{style:{},attributes:{},setAttribute(name,value){this.attributes[name]=value;},
      remove(){this.connected=false;},get textContent(){return text;},set textContent(value){text=value;titles.push({message:value,time:now});}};}};
  const map={previewActive:true,mode:'arcgis',extrusionEnabled:false,map:{stop(){}},fontRecords:new Map([['gill',{cssFamily:'Bundled Gill Sans'}]])};
  const engine={state:map,cancelConferenceWork(){calls.push({type:'cancel',time:now});},showConferenceOverview(){calls.push({type:'overview',time:now});},setConnectionStatus(){},
    async drawConferenceOpening(){calls.push({type:'opening',time:now});await options.opening?.();},async flyToConferenceOpening(){calls.push({type:'flight',time:now});await options.flight?.();},
    async applyConferenceCue(patch){calls.push({type:'cue',time:now,patch:{...patch}});await options.apply?.(patch);map.extrusionEnabled=patch.extrusionEnabled;return{fitted:true};},
    async waitForCamera(){calls.push({type:'camera',time:now});}};
  const client={latestCue:async()=>null,afterCues:async()=>[]};
  const window={GeoGlyphConferenceConfig:{enabled:true},GeoGlyphSurveyResults:{create:()=>client},GeoGlyphMapEngine:engine,GeoGlyphConferenceCues:cues,
    GeoGlyph3D:{stopOrbit(){},ensureOrbit(mode,opts){calls.push({type:'orbit',time:now,mode,opts});return true;}}};
  const ctx=vm.createContext({window,document:doc,retryStartup(){},performance:{now:()=>now},console,
    setTimeout(fn,ms){timers.set(++seq,{fn,due:now+ms});return seq;},clearTimeout:id=>timers.delete(id)});
  vm.runInContext(source.slice(0,source.indexOf('  async function conferenceFonts('))+'})();',ctx);
  const api=window.GeoGlyphConference;api.state.ready=true;api.state.fontIds={'Segoe UI Emoji':'emoji','Gill Sans':'gill'};
  return {api,map,client,doc,listeners,calls,timers,titles,
    title:()=>doc.getElementById('geoglyphConferenceTitle'),
    async begin({completeOpening=true}={}){api.state.queue.push({objectId:1,attributes:{special_commands:'begin'}});api.resume();await flush();if(completeOpening)await this.completeOpening();},
    async advance(ms){now+=ms;for(const [id,t]of [...timers])if(t.due<=now){timers.delete(id);t.fn();}await flush();},
    async completeOpening(){for(let i=0;i<5;i++)await this.advance(2000);},
    async hidden(value){doc.hidden=value;listeners.visibilitychange();await flush();},
    steps:()=>calls.filter(c=>c.type==='cue')};
}
test('opening title adds five dots at two-second boundaries and holds the fifth for two seconds',async()=>{
  const h=harness();await h.begin({completeOpening:false});
  const title=h.title();assert.equal(title.textContent,'Conference day.');
  assert.equal(title.style.fontFamily,'"Bundled Gill Sans"');assert.equal(title.attributes.role,'status');
  assert.equal(h.api.state.content.message,'😴');assert.equal(h.steps().length,0);
  for(let dots=2;dots<=5;dots++){
    await h.advance(1999);assert.equal(title.textContent,'Conference day'+'.'.repeat(dots-1));
    await h.advance(1);assert.equal(title.textContent,'Conference day'+'.'.repeat(dots));
  }
  assert.equal(h.calls.some(c=>c.type==='flight'),false);
  await h.advance(1999);assert.equal(h.title(),title);assert.equal(h.steps().length,0);
  await h.advance(1);assert.equal(h.title(),undefined);assert.equal(h.calls.find(c=>c.type==='flight').time,10000);
  assert.equal(h.steps()[0].patch.message,'🥱');
  assert.deepEqual(h.titles,Array.from({length:5},(_,i)=>({message:'Conference day'+'.'.repeat(i+1),time:i*2000})));
  h.listeners['geoglyph:manual-map-change']();await flush();
  assert.equal(h.timers.size,0);
});
test('Stop and Resume preserve the remaining opening title countdown',async()=>{
  const h=harness();await h.begin({completeOpening:false});await h.advance(750);h.api.pause();
  await h.advance(100000);assert.equal(h.title().textContent,'Conference day.');
  h.api.resume();await h.advance(1249);assert.equal(h.title().textContent,'Conference day.');
  await h.advance(1);assert.equal(h.title().textContent,'Conference day..');
  for(let i=0;i<3;i++)await h.advance(2000);
  await h.advance(500);h.api.pause();await h.advance(100000);
  assert.equal(h.title().textContent,'Conference day.....');assert.equal(h.calls.some(c=>c.type==='flight'),false);
  h.api.resume();await h.advance(1499);assert.ok(h.title());
  await h.advance(1);assert.equal(h.title(),undefined);assert.equal(h.steps().length,1);
});
test('hidden time cannot consume the second opening title hold',async()=>{
  const h=harness();await h.begin({completeOpening:false});await h.advance(2000);await h.advance(500);
  await h.hidden(true);await h.advance(100000);assert.equal(h.title().textContent,'Conference day..');
  await h.hidden(false);await h.advance(1499);assert.equal(h.title().textContent,'Conference day..');
  await h.advance(1);assert.equal(h.title().textContent,'Conference day...');
  for(let i=0;i<3;i++)await h.advance(2000);
  assert.equal(h.title(),undefined);assert.equal(h.steps().length,1);
});
test('Reset removes an opening title immediately during the first or fifth dot hold',async()=>{
  for(const atFinalHold of [false,true]){
    const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin({completeOpening:false});
    if(atFinalHold){for(let i=0;i<4;i++)await h.advance(2000);assert.equal(h.title().textContent,'Conference day.....');}
    h.api.state.queue.push({objectId:2,attributes:{geoglyph_speaks:'queued'}});
    h.api.pause();h.client.afterCues=async()=>[{objectId:3,attributes:{special_commands:'reset'}}];
    await h.api.poll(layer);assert.equal(h.title(),undefined);await flush();
    assert.equal(h.api.state.lastAppliedId,3);assert.equal(h.api.state.phase,'overview');assert.equal(h.api.state.queue.length,0);
    await h.advance(100000);assert.equal(h.steps().length,0);
    assert.equal(h.calls.some(c=>c.type==='flight'),false);assert.equal(h.timers.size,0);
  }
});
test('manual cancellation removes its title without stale cleanup removing a newer Begin title',async()=>{
  const h=harness();await h.begin({completeOpening:false});const first=h.title();
  h.listeners['geoglyph:manual-map-change']();assert.equal(h.title(),undefined);
  h.api.state.queue.push({objectId:2,attributes:{special_commands:'begin'}});h.api.resume();await flush();
  const second=h.title();assert.ok(second);assert.notEqual(second,first);assert.equal(first.connected,false);
  assert.equal(second.textContent,'Conference day.');assert.equal(h.api.state.phase,'beginning');
  await h.completeOpening();assert.equal(h.title(),undefined);assert.equal(h.steps().length,1);
  h.listeners['geoglyph:manual-map-change']();await flush();assert.equal(h.timers.size,0);
});
test('descent waits for sleeping artwork readiness and an opening failure clears the title and timers',async()=>{
  let ready;const opening=new Promise(resolve=>{ready=resolve;});
  const slow=harness({opening:()=>opening});await slow.begin({completeOpening:false});await slow.completeOpening();
  assert.equal(slow.title().textContent,'Conference day.....');assert.equal(slow.calls.some(c=>c.type==='flight'),false);
  ready();await flush();assert.equal(slow.title(),undefined);assert.equal(slow.steps().length,1);
  const failed=harness({opening:()=>{throw Error('fixture opening failed');}});await failed.begin({completeOpening:false});
  assert.equal(failed.title(),undefined);assert.equal(failed.api.state.error,'fixture opening failed');assert.equal(failed.api.state.applying,false);
  assert.equal(failed.timers.size,0);assert.equal(failed.calls.some(c=>c.type==='flight'),false);
});
test('leaving Map cancels the final title hold without starting descent',async()=>{
  const h=harness();await h.begin({completeOpening:false});for(let i=0;i<4;i++)await h.advance(2000);
  assert.equal(h.title().textContent,'Conference day.....');h.map.previewActive=false;await h.advance(100);
  assert.equal(h.title(),undefined);assert.equal(h.steps().length,0);assert.equal(h.timers.size,0);
  assert.equal(h.api.state.applying,false);assert.equal(h.calls.some(c=>c.type==='flight'),false);
});
test('Begin renders immediately after zoom, uses three-second emoji holds and ends in Medium 3D Turn',async()=>{
  const h=harness();await h.begin();assert.equal(h.calls[0].type,'opening');assert.equal(h.calls[1].type,'flight');
  assert.equal(h.steps().length,1);assert.equal(h.steps()[0].time,10000);
  for(let i=1;i<transcript.length;i++){await h.advance(delays[i]-1);assert.equal(h.steps().length,i);await h.advance(1);assert.equal(h.steps().length,i+1);}
  assert.deepEqual(h.steps().map(c=>c.patch.message),transcript);
  let elapsed=10000;assert.deepEqual(h.steps().map(c=>c.time),delays.map(ms=>elapsed+=ms));
  assert.deepEqual(h.steps().map(c=>c.patch.mirrorX),transcript.map((_,i)=>i===3));
  assert.ok(h.steps().slice(0,5).every(c=>c.patch.nativeColor&&c.patch.fontId==='emoji'));
  assert.ok(h.steps().slice(5).every(c=>!c.patch.nativeColor&&c.patch.fontId==='gill'));
  for(const {patch}of h.steps().slice(0,-1)){assert.equal(patch.extrusionEnabled,false);assert.equal(patch.height,300);assert.equal(patch.depth,30);assert.equal(patch.relativeSize,100);}
  const final=h.steps().at(-1).patch;assert.equal(final.fontId,'gill');assert.equal(final.height,3000);assert.equal(final.depth,300);assert.equal(final.animation,'yaw');
  assert.equal(final.extrusionEnabled,true);assert.equal(h.calls.at(-2).type,'orbit');assert.equal(h.calls.at(-2).mode,'yaw');assert.equal(h.calls.at(-1).type,'camera');
  assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.lastAppliedId,1);assert.equal(h.api.state.content.message,'Where are you Josh?');assert.equal(h.timers.size,0);
});
test('Stop and Resume preserve remaining hold time rather than consuming paused time',async()=>{
  const h=harness();await h.begin();await h.advance(2000);h.api.pause();await h.advance(100000);assert.equal(h.steps().length,1);
  h.api.resume();await h.advance(2999);assert.equal(h.steps().length,1);await h.advance(1);assert.equal(h.steps().length,2);
});
test('hidden time cannot consume introduction holds',async()=>{
  const h=harness();await h.begin();await h.advance(2000);await h.hidden(true);await h.advance(100000);assert.equal(h.steps().length,1);
  await h.hidden(false);await h.advance(3000);assert.equal(h.steps().length,2);
});
test('first emoji follows descent immediately and the next hold waits for artwork/Fit completion',async()=>{
  let arrive,draw;const flight=new Promise(r=>{arrive=r;}),first=new Promise(r=>{draw=r;});
  const h=harness({flight:()=>flight,apply:p=>p.message==='🥱'?first:undefined});await h.begin();await h.advance(100000);assert.equal(h.steps().length,0);
  arrive();await flush();assert.equal(h.steps().length,1);await h.advance(50000);assert.equal(h.steps().length,1);
  draw();await flush();await h.advance(4999);assert.equal(h.steps().length,1);await h.advance(1);assert.equal(h.steps().length,2);
});
test('Reset interrupts a hold, clears queued responses and cannot revive old timers',async()=>{
  const h=harness(),layer={url:'fixture',pageSize:25};await h.api.poll(layer);await h.begin();
  h.api.state.queue.push({objectId:2,attributes:{geoglyph_speaks:'queued'}});
  h.client.afterCues=async()=>[{objectId:3,attributes:{special_commands:'reset'}}];await h.api.poll(layer);await flush();
  assert.equal(h.api.state.phase,'overview');assert.equal(h.api.state.lastAppliedId,3);assert.equal(h.api.state.queue.length,0);
  await h.advance(100000);assert.equal(h.steps().length,1);assert.equal(h.timers.size,0);assert.equal(h.api.state.applying,false);
});
test('manual artwork changes cancel the script without returning to the overview',async()=>{
  const h=harness();await h.begin();const overviews=h.calls.filter(c=>c.type==='overview').length;
  h.listeners['geoglyph:manual-map-change']();await flush();await h.advance(100000);
  assert.equal(h.steps().length,1);assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.applying,false);
  assert.equal(h.calls.filter(c=>c.type==='overview').length,overviews);assert.equal(h.timers.size,0);
});
test('manual change dispatch lets its caller mutate artwork before queued survey work starts',async()=>{
  let manualMutationFinished=false;
  const h=harness({apply:p=>{if(p.message==='manual-followup')assert.equal(manualMutationFinished,true);}});
  await h.begin();
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
  for(const ms of delays.slice(1))await h.advance(ms);
  assert.equal(h.steps().length,transcript.length+1);assert.equal(h.steps().at(-1).patch.message,'next');assert.equal(h.api.state.lastAppliedId,3);
});
test('failed introduction step keeps prior successful content and releases the busy flag',async()=>{
  const h=harness({apply:p=>{if(p.message==='😶')throw Error('fixture draw failed');}});await h.begin();await h.advance(5000);await h.advance(5000);
  assert.equal(h.api.state.content.message,'🥱');assert.equal(h.api.state.phase,'live');assert.equal(h.api.state.applying,false);assert.match(h.api.state.error,/fixture draw failed/);
  await h.advance(100000);assert.equal(h.steps().length,2);assert.equal(h.timers.size,0);
});
test('leaving Map invalidates the held step without further rendering',async()=>{
  const h=harness();await h.begin();h.map.previewActive=false;await h.advance(100);assert.equal(h.steps().length,1);assert.equal(h.api.state.applying,false);assert.equal(h.timers.size,0);
});
