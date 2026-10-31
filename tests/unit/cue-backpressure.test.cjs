const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { create } = require('../../src/scripts/survey-results.js');
const layer = { url:'https://example.invalid/FeatureServer/0', field:'message', objectIdField:'objectid', pageSize:25 };
function transport(extra = {}) {
  const requests=[];
  const client=create({serviceUrl:'https://example.invalid/FeatureServer',fetch:async(_url,options)=>{
    const params=new URLSearchParams(options.body), cursor=Number(params.get('where').split('>')[1]), count=Number(params.get('resultRecordCount'));
    requests.push({cursor,count});
    return {ok:true,status:200,json:async()=>({features:Array.from({length:count+(extra.oversize?1:0)},(_,i)=>({attributes:{objectid:cursor+i+1}})),exceededTransferLimit:true})};
  }});
  return {client,requests};
}
test('four-page batches resume without losing or replaying ascending IDs',async()=>{
  const h=transport();const first=await h.client.afterCues(layer,0),next=await h.client.afterCues(layer,first.at(-1).objectId);
  assert.equal(first.length,100);assert.equal(next.length,100);assert.equal(h.requests.length,8);
  assert.deepEqual([...first,...next].map(c=>c.objectId),Array.from({length:200},(_,i)=>i+1));
});
test('remaining capacity reduces page size and cannot be exceeded silently',async()=>{
  const h=transport();assert.equal((await h.client.afterCues(layer,10,{maxRows:27})).length,27);
  assert.deepEqual(h.requests,[{cursor:10,count:25},{cursor:35,count:2}]);
  await assert.rejects(transport({oversize:true}).client.afterCues(layer,0,{maxRows:1}),/exceeded/);
});
test('invalid row and page bounds cannot reach the service',async()=>{
  const h=transport();
  for(const maxRows of [0,-1,101,Infinity,NaN,1.5,'2'])await assert.rejects(h.client.afterCues(layer,0,{maxRows}));
  for(const pageSize of [0,26,NaN,1.5])await assert.rejects(h.client.afterCues({...layer,pageSize},0));
  assert.equal(h.requests.length,0);
});
function conferenceHarness() {
  const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/conference-presentation.js'),'utf8');
  const calls=[], applied=[], listeners={}, doc={hidden:false,addEventListener:(name,fn)=>{listeners[name]=fn;}};
  let release;const gate=new Promise(resolve=>{release=resolve;});
  const engine={state:{previewActive:true,mode:'arcgis',extrusionEnabled:false},async applyConferenceCue(patch){applied.push(patch.objectId);if(patch.objectId===1)await gate;return{};},async drawConferenceOpening(){},setConnectionStatus(){},cancelConferenceWork(){},showConferenceOverview(){}};
  const client={latestCue:async()=>null,afterCues:async(_layer,cursor,opts)=>{calls.push({cursor,limit:opts.maxRows});return Array.from({length:opts.maxRows},(_,i)=>({objectId:cursor+i+1,attributes:{}}));}};
  const ctx=vm.createContext({window:{GeoGlyphConferenceConfig:{enabled:true},GeoGlyphSurveyResults:{create:()=>client},GeoGlyphMapEngine:engine,
    GeoGlyphConferenceCues:{command:raw=>raw.attributes?.special_commands,resolve:raw=>({objectId:raw.objectId,command:raw.attributes?.special_commands,font:'font',kind:'text',message:'same',nextContent:{kind:'text',message:'same'},warnings:[]})}},
    document:doc,retryStartup(){},setTimeout,clearTimeout,console});
  vm.runInContext(source.slice(0,source.indexOf('  async function conferenceFonts('))+'})();',ctx);
  return {api:ctx.window.GeoGlyphConference,client,calls,applied,doc,listeners,release};
}
const flush=()=>new Promise(setImmediate);
test('queue capacity stops fetching and resumes exactly after the last retained ID',async()=>{
  const h=conferenceHarness();await h.api.poll(layer);await h.api.poll(layer);
  assert.equal(h.api.state.queue.length,100);assert.equal(h.api.state.lastQueuedId,100);
  await h.api.poll(layer);assert.equal(h.calls.length,1);
  h.api.state.queue.splice(0,3);await h.api.poll(layer);
  assert.deepEqual(h.calls.at(-1),{cursor:100,limit:3});assert.equal(h.api.state.queue.length,100);assert.equal(h.api.state.lastQueuedId,103);
});
test('hidden presentation retains queued work and resumes FIFO without another submission',async()=>{
  const h=conferenceHarness();await h.api.poll(layer);await h.api.poll(layer);h.api.state.ready=true;
  h.doc.hidden=true;h.api.resume();await flush();assert.equal(h.applied.length,0);
  await h.api.poll(layer);assert.equal(h.calls.length,1);
  h.doc.hidden=false;h.listeners.visibilitychange();await flush();assert.deepEqual(h.applied,[1]);
  h.doc.hidden=true;h.release();await flush();assert.equal(h.api.state.queue.length,99);assert.deepEqual(h.applied,[1]);
  h.doc.hidden=false;h.listeners.visibilitychange();await flush();assert.deepEqual(h.applied,Array.from({length:100},(_,i)=>i+1));
  assert.equal(h.api.state.lastAppliedId,100);assert.equal(h.api.state.queue.length,0);
});
test('Stop lets the accepted cue finish and Resume drains its bounded queue once',async()=>{
  const h=conferenceHarness();await h.api.poll(layer);await h.api.poll(layer);h.api.state.ready=true;h.api.resume();await flush();
  h.api.pause();h.release();await flush();assert.deepEqual(h.applied,[1]);assert.equal(h.api.state.queue.length,99);
  h.api.resume();await flush();assert.equal(h.api.state.queue.length,0);assert.deepEqual(h.applied,Array.from({length:100},(_,i)=>i+1));
});
test('a Reset fetched after a full batch cancels older queued work without applying it',async()=>{
  const h=conferenceHarness();await h.api.poll(layer);await h.api.poll(layer);h.api.state.ready=true;h.api.resume();await flush();
  h.client.afterCues=async(_layer,cursor,opts)=>{assert.equal(cursor,100);assert.equal(opts.maxRows,1);return[{objectId:101,attributes:{special_commands:'reset'}}];};
  await h.api.poll(layer);await flush();h.release();await flush();
  assert.deepEqual(h.applied,[1]);assert.equal(h.api.state.lastAppliedId,101);assert.equal(h.api.state.queue.length,0);assert.equal(h.api.state.phase,'overview');
});
