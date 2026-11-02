const {test}=require('node:test'),assert=require('node:assert/strict');
const {create}=require('../../src/scripts/arcgis-admin.js');
const crypto=require('node:crypto').webcrypto;
const service='https://services.arcgis.com/org/arcgis/rest/services/survey_results/FeatureServer';
function harness(handler=()=>({})){let time=0;const calls=[];const client=create({crypto,now:()=>time,fetch:async(url,options)=>{
  const params=Object.fromEntries(new URLSearchParams(options.body));calls.push({url,params});
  const body=await handler(url,params);return {ok:true,json:async()=>url.endsWith('/community/self')?{username:'owner'}:body};
}});return {client,calls,advance(ms){time+=ms;}};}
test('PKCE code exchange preserves old file-compatible return URI and validates identity',async()=>{
  const h=harness(url=>url.endsWith('/oauth2/token')?{access_token:'secret',expires_in:60}:{});
  const url=new URL(await h.client.authorize());assert.equal(url.searchParams.get('redirect_uri'),'urn:ietf:wg:oauth:2.0:oob');assert.equal(url.searchParams.get('code_challenge_method'),'S256');
  await h.client.login('returned-code');assert.equal(h.client.authenticated(),true);assert.equal(h.calls[0].params.code_verifier.length,86);
  h.advance(61000);assert.equal(h.client.authenticated(),false);
});
test('stale code cannot exchange and Clear removes authentication',async()=>{
  const h=harness();await h.client.authorize();h.advance(900001);await assert.rejects(h.client.login('code'),/again/);
  await h.client.login('token',{exchange:false});h.client.clear();assert.equal(h.client.authenticated(),false);
});
test('Clear invalidates an in-flight login',async()=>{
  let release;const gate=new Promise(r=>release=r),h=harness(async()=>{await gate;return {};});
  const login=h.client.login('secret',{exchange:false});h.client.clear();release();await assert.rejects(login,/cancelled/);
});
function deletionHarness(options={}){
  let removed=false;
  return harness((url,p)=>{
    if(url===service)return {layers:[{id:0,name:'survey'}]};
    if(url.includes('/rest/admin/'))return {adminLayerInfo:{viewLayerDefinition:{sourceServiceName:'survey_source',sourceLayerId:0}}};
    if(url.endsWith('/0'))return options.view&&url.includes('survey_results')?{isView:true,capabilities:'Query'}:{name:'survey',capabilities:options.denied?'Query':'Query,Delete',...(options.restricted?{serviceItemId:'survey-item',ownershipBasedAccessControlForFeatures:{allowOthersToQuery:false}}:{})};
    if(url.endsWith('/query'))return {objectIds:p.objectIds?(options.remaining?[1]:[]):Array.from({length:405},(_,i)=>i+1)};
    if(url.endsWith('/deleteFeatures')){removed=true;return {deleteResults:p.objectIds.split(',').map(Number).map(objectId=>({objectId,success:!options.partial}))};}
    return {};
  });
}
test('deletion snapshots IDs, batches requests and verifies all confirmed records',async()=>{
  const h=deletionHarness();await h.client.login('secret',{exchange:false});const plan=await h.client.prepare(service);
  assert.equal(h.calls.some(c=>c.url.endsWith('/deleteFeatures')),false,'preparation never deletes');
  assert.equal(await h.client.remove(plan),405);
  const deletes=h.calls.filter(c=>c.url.endsWith('/deleteFeatures'));assert.deepEqual(deletes.map(c=>c.params.objectIds.split(',').length),[200,200,5]);assert.ok(deletes.every(c=>!c.params.where));
});
test('read-only view resolves verified source service instead of unrelated old service',async()=>{
  const h=deletionHarness({view:true});await h.client.login('secret',{exchange:false});const plan=await h.client.prepare(service);assert.equal(plan.url,service.replace('survey_results','survey_source')+'/0');
});
test('permissions prevent deletion',async()=>{
  const h=deletionHarness({denied:true});await h.client.login('secret',{exchange:false});await assert.rejects(h.client.prepare(service),/permit deletion/);assert.equal(h.calls.some(c=>c.url.endsWith('/deleteFeatures')),false);
});
test('ownership-filtered access cannot masquerade as all survey responses',async()=>{
  const h=deletionHarness({restricted:true});await h.client.login('secret',{exchange:false});
  await assert.rejects(h.client.prepare(service),/owner or an administrator/);
  assert.equal(h.calls.some(c=>c.url.endsWith('/query')||c.url.endsWith('/deleteFeatures')),false);
});
test('partial failure stops without retrying later batches',async()=>{
  const h=deletionHarness({partial:true});await h.client.login('secret',{exchange:false});const plan=await h.client.prepare(service);await assert.rejects(h.client.remove(plan),/incomplete/);assert.equal(h.calls.filter(c=>c.url.endsWith('/deleteFeatures')).length,1);
});
test('verification failure is not reported as successful deletion',async()=>{
  const h=deletionHarness({remaining:true});await h.client.login('secret',{exchange:false});await assert.rejects(h.client.remove(await h.client.prepare(service)),/verify deletion/);
});
test('expired token errors clear session without reflecting secrets',async()=>{
  const h=harness(()=>({error:{code:498,message:'secret-token'}}));await h.client.login('secret',{exchange:false});await assert.rejects(h.client.prepare(service),error=>!error.message.includes('secret-token'));assert.equal(h.client.authenticated(),false);
});
test('network timeout is bounded and is not automatically retried',async()=>{
  let requests=0;
  const client=create({crypto,timeoutMs:5,fetch:async(url,{signal})=>{
    requests++;await new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Object.assign(Error('aborted'),{name:'AbortError'})),{once:true}));
  }});
  await assert.rejects(client.login('secret',{exchange:false}),/timed out/);assert.equal(requests,1);assert.equal(client.authenticated(),false);
});
