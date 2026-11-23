'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const routing=require('../../shared/suite-routing.js');
const source='https://services.example.test/survey/FeatureServer';
const handoff=overrides=>({version:1,app:'geoglyph',source,cursor:20,layerId:0,interval:2,active:true,...overrides});
const fragment=value=>'#'+new URLSearchParams({suite:JSON.stringify(value)});
const cue=(objectId,command)=>({objectId,attributes:{special_commands:command}});
const layer={id:0,url:source+'/0'};
const turn=()=>new Promise(resolve=>setImmediate(resolve));
const deferred=()=>{let resolve;const promise=new Promise(done=>{resolve=done;});return {promise,resolve};};
function client(overrides={}){
  const calls={discover:0,latest:0,after:0};
  return {calls,
    async discover(options){calls.discover++;return overrides.discover?overrides.discover(options):[layer];},
    async latestCue(selected,options){calls.latest++;return overrides.latestCue?overrides.latestCue(selected,options):cue(20,'Launch Geoglyph');},
    async afterCues(selected,cursor,options){calls.after++;return overrides.afterCues?overrides.afterCues(selected,cursor,options):[];}
  };
}
function poller(t,options){const value=routing.createPoller(options);t.after(()=>value.dispose());return value;}

test('launch commands trim whitespace, ignore capitalization and resolve only registered targets',()=>{
  assert.deepEqual(routing.launchCommand({attributes:{SPECIAL_COMMANDS:'  LaUnCh GeoGlyph  '}}),{target:'geoglyph',label:'GeoGlyph'});
  assert.deepEqual(routing.launchCommand({special_commands:'Launch Geoglyph'}),{target:'geoglyph',label:'Geoglyph'});
  assert.deepEqual(routing.launchCommand(cue(1,'Launch Other App')),{target:null,label:'Other App'});
  assert.deepEqual(routing.launchCommand(cue(1,'Launch')),{target:null,label:'(missing app)'});
  for(const value of ['Begin','Reset','Geoglyph','Relaunch Geoglyph','',null,undefined])assert.equal(routing.launchCommand(cue(1,value)),null);
  assert.equal(routing.launchCommand(null),null);
});

test('Begin Geoglyph is exact, case-insensitive and separate from launch and removed Begin values',()=>{
  for(const value of ['Begin Geoglyph','  bEgIn GeOgLyPh  '])assert.equal(routing.beginCommand(cue(1,value)),true);
  assert.equal(routing.beginCommand({SPECIAL_COMMANDS:'Begin Geoglyph'}),true);
  for(const value of ['Begin','Begin Other','Begin Geoglyph now','Launch Geoglyph','Reset','',null])assert.equal(routing.beginCommand(cue(1,value)),false);
  assert.equal(routing.beginCommand({undefined:'Begin Geoglyph'}),false);
});

test('Begin on the launcher carries its exact cursor to Geoglyph without consuming later submissions',async t=>{
  let batch=[cue(21,'Begin Geoglyph')];const launches=[];
  const api=client({afterCues:async(_selected,cursor)=>batch.filter(row=>row.objectId>cursor)});
  let value;value=poller(t,{client:api,handoff:handoff({active:false}),onLaunch:(target,options)=>launches.push({target,cursor:value.state().cursor,...options})});
  batch.push(cue(22,'Reset'));
  await value.fetch();assert.deepEqual(launches,[{target:'geoglyph',cursor:21,beginId:21}]);
  assert.equal(value.state().cursor,21);assert.equal(value.state().active,false);
});

test('the rehearsal submission is restricted to a survey handoff for the same Geoglyph cursor',()=>{
  const value=handoff({launchReason:'survey',beginId:20});
  assert.deepEqual(routing.decodeHandoff(fragment(value),source,'geoglyph'),value);
  for(const patch of [{beginId:21},{beginId:0},{beginId:'20'},{app:'launcher'},{launchReason:'manual'}]){
    assert.throws(()=>routing.validateHandoff({...value,...patch},source),/Invalid Begin Geoglyph submission/);
  }
});

test('unlinked apps are recognised without navigation or stopping an active poller',async t=>{
  const targets=['assassins-leaves'],notices=[],launches=[];
  const rows=targets.map((target,index)=>cue(21+index,'  '+routing.apps[target].command.toUpperCase()+'  '));
  for(const [index,target]of targets.entries()){
    assert.equal(routing.launchCommand(rows[index]).target,target);
    assert.throws(()=>routing.destination('file:///suite/',target,handoff(),source),/linked yet/);
  }
  const api=client({afterCues:async()=>rows});
  const value=poller(t,{client:api,handoff:handoff(),onNotice:message=>notices.push(message),onLaunch:target=>launches.push(target)});
  await value.fetch();
  assert.deepEqual(notices,targets.map(routing.unlinkedMessage));
  assert.deepEqual(launches,[]);
  assert.equal(value.state().cursor,21);assert.equal(value.state().active,true);
});

test('imported app commands and return handoffs keep the surveyed cursor and connection settings',async t=>{
  const destinations={panoptigon:'apps/panoptigon/index.html',umbramatic:'apps/umbramatic/ShadowPlayer/index.html',
    transitron:'http://127.0.0.1:8090/'};
  for(const [target,path] of Object.entries(destinations)){
    const initial=handoff({active:false});
    let navigation;
    const api=client({afterCues:async()=>[cue(21,routing.apps[target].command)]});
    const value=poller(t,{client:api,handoff:initial,onLaunch:app=>{
      navigation=routing.destination('file:///suite/',app,{...value.state(),launchReason:'survey'},source);
    }});
    await value.fetch();
    const url=new URL(navigation);
    assert.equal(url.href.split('#')[0],new URL(path,'file:///suite/').href);
    const checkpoint=routing.decodeHandoff(url.hash,source,target);
    assert.deepEqual(checkpoint,handoff({app:target,cursor:21,active:false,launchReason:'survey'}));
    const root=target==='transitron'?new URL('/suite/',url).href:routing.suiteRoot(url.href);
    const returnUrl=new URL(routing.destination(root,'launcher',{...checkpoint,returnFrom:target},source));
    assert.equal(returnUrl.origin,url.origin);
    assert.equal(returnUrl.pathname,'/suite/index.html');
    assert.deepEqual(routing.decodeHandoff(returnUrl.hash,source,'launcher'),{...checkpoint,app:'launcher',returnFrom:target});
  }
  for(const returnFrom of ['assassins-leaves','../other',null,['panoptigon']]){
    assert.throws(()=>routing.validateHandoff(handoff({app:'launcher',returnFrom}),source),/Invalid returning app/);
  }
  assert.throws(()=>routing.validateHandoff(handoff({returnFrom:'panoptigon'}),source),/Invalid returning app/);
});

test('handoffs retain only connection settings and omit credentials or arbitrary fields',()=>{
  const value=handoff({token:'secret',credentials:{password:'hidden'},url:'https://untrusted.test'});
  assert.deepEqual(routing.validateHandoff(value,source),handoff());
  assert.deepEqual(routing.decodeHandoff(fragment(value),source,'geoglyph'),handoff());
  const encoded=routing.destination('file:///home/user/Geoglyph-v3.0/','geoglyph',value,source);
  assert.equal(encoded.includes('secret'),false);assert.equal(encoded.includes('hidden'),false);assert.equal(encoded.includes('untrusted'),false);
});

test('version 1 launch reasons round trip while older handoffs remain ordinary entries',()=>{
  for(const launchReason of ['manual','survey']){
    const value=handoff({launchReason});
    assert.deepEqual(routing.decodeHandoff(fragment(value),source,'geoglyph'),value);
    const url=new URL(routing.destination('file:///home/user/suite/','geoglyph',value,source));
    assert.equal(routing.decodeHandoff(url.hash,source,'geoglyph').launchReason,launchReason);
  }
  assert.deepEqual(routing.decodeHandoff(fragment(handoff()),source,'geoglyph'),handoff());
  for(const launchReason of ['other',true,0,null,{}])assert.throws(()=>routing.validateHandoff(handoff({launchReason}),source),/entry reason/);
});

test('opening profiles depend on entry reason rather than the active polling flag',()=>{
  assert.deepEqual(routing.openingProfile('survey'),{mode:'arcgis',presentation:'mini',expandMessage:false});
  for(const reason of [undefined,'manual'])assert.deepEqual(routing.openingProfile(reason),{mode:'message',presentation:'full',expandMessage:true});
  for(const active of [true,false]){
    const value=routing.validateHandoff(handoff({active,launchReason:'survey'}),source);
    assert.equal(routing.openingProfile(value.launchReason).presentation,'mini');
    const legacy=routing.validateHandoff(handoff({active}),source);
    assert.equal(routing.openingProfile(legacy.launchReason).mode,'message');
  }
});

test('browser navigation explicitly marks manual and survey launch paths before releasing resources',async()=>{
  for(const launchReason of [undefined,'survey']){
    const steps=[],host={location:{href:'https://host.test/suite/index.html',assign:url=>steps.push(url)},GeoGlyphSurveyResults:{config:{serviceUrl:source}}};
    const suite=routing.browser(host);suite.configure({checkpoint:()=>handoff(),release:async()=>steps.push('released')});
    assert.equal(await suite.navigate('geoglyph',launchReason?{launchReason}:undefined),true);
    assert.equal(steps[0],'released');
    assert.equal(routing.decodeHandoff(new URL(steps[1]).hash,source,'geoglyph').launchReason,launchReason||'manual');
    assert.equal(await suite.navigate('geoglyph'),false);assert.equal(steps.length,2);
  }
});

test('handoff rejects unsupported apps, source mismatches, missing fields and invalid ranges',()=>{
  for(const patch of [
    {version:2},{app:'other'},{source:'https://untrusted.test/FeatureServer'},
    {cursor:-1},{cursor:1.5},{cursor:Number.MAX_SAFE_INTEGER+1},{cursor:undefined},
    {layerId:-1},{layerId:1.2},{layerId:undefined},{layerId:null,cursor:1},
    {active:1},{interval:0},{interval:3601},{interval:1.5},{interval:undefined}
  ])assert.throws(()=>routing.validateHandoff(handoff(patch),source),JSON.stringify(patch));
  for(const value of [null,[],true,'handoff'])assert.throws(()=>routing.validateHandoff(value,source));
  assert.throws(()=>routing.validateHandoff(handoff({source:'http://example.test'}),'http://example.test'));
  assert.deepEqual(routing.validateHandoff(handoff({cursor:null,layerId:null,interval:3600,active:false}),source),handoff({cursor:null,layerId:null,interval:3600,active:false}));
});

test('fragment consumption handles absence and rejects malformed, oversized or wrong-app handoffs',()=>{
  assert.equal(routing.decodeHandoff('#other=1',source,'geoglyph'),null);
  assert.equal(routing.decodeHandoff('',source,'geoglyph'),null);
  assert.throws(()=>routing.decodeHandoff('#suite=%7Bbroken',source,'geoglyph'));
  assert.throws(()=>routing.decodeHandoff('#suite='+('x'.repeat(2049)),source,'geoglyph'),/too large/);
  assert.throws(()=>routing.decodeHandoff(fragment(handoff()),source,'launcher'),/different app/);
  assert.throws(()=>routing.decodeHandoff(fragment(handoff({source:'https://elsewhere.test'})),source,'geoglyph'),/does not match/);
});

test('destinations stay in the local allowlist under file, HTTP and HTTPS roots',()=>{
  for(const root of ['file:///home/user/Geoglyph-v3.0/','http://127.0.0.1:4187/','https://host.test/suite/']){
    for(const target of ['geoglyph','launcher']){
      const url=new URL(routing.destination(root,target,handoff(),source));
      const expected=new URL(target==='launcher'?'index.html':'apps/geoglyph/index.html',root);
      assert.equal(url.protocol,expected.protocol);assert.equal(url.host,expected.host);assert.equal(url.pathname,expected.pathname);
      assert.deepEqual(routing.decodeHandoff(url.hash,source,target),handoff({app:target}));
    }
    for(const target of ['https://untrusted.test','../other.html','__proto__','constructor','unknown'])assert.throws(()=>routing.destination(root,target,handoff(),source),/Unknown/);
  }
  assert.throws(()=>routing.destination('javascript:alert(1)','geoglyph',handoff(),source),/Unsupported/);
  assert.equal(routing.suiteRoot('file:///home/user/Geoglyph-v3.0/apps/geoglyph/dist/GeoGlyph.html?studio=1#hello'),'file:///home/user/Geoglyph-v3.0/');
  assert.equal(routing.suiteRoot('http://127.0.0.1:4187/index.html#hello'),'http://127.0.0.1:4187/');
});

test('a fresh launcher makes no requests until Start or Fetch and baselines historical launch commands',async t=>{
  const api=client(),launches=[],value=poller(t,{client:api,onLaunch:target=>launches.push(target)});
  await turn();assert.deepEqual(api.calls,{discover:0,latest:0,after:0});assert.equal(value.state().active,false);
  assert.equal(await value.resume(),false);assert.deepEqual(api.calls,{discover:0,latest:0,after:0});
  assert.equal(await value.fetch(),true);assert.equal(value.state().cursor,20);assert.equal(value.state().active,false);assert.deepEqual(launches,[]);
  assert.deepEqual(api.calls,{discover:1,latest:1,after:0});
});

test('ordered batches stop at the launch submission rather than advancing into later app messages',async t=>{
  const launches=[],api=client({afterCues:async(selected,cursor,options)=>{
    assert.equal(selected.id,0);assert.equal(cursor,20);assert.equal(options.maxRows,100);
    return [cue(21,'An ordinary cue'),cue(22,'Launch Geoglyph'),cue(23,'Reset')];
  }});
  let value;value=poller(t,{client:api,handoff:handoff(),onLaunch:target=>{launches.push({target,cursor:value.state().cursor,active:value.state().active});}});
  await value.fetch();assert.deepEqual(launches,[{target:'geoglyph',cursor:22,active:true}]);assert.equal(value.state().cursor,22);
  assert.equal(api.calls.latest,0);
});

test('unknown launch targets show a warning without navigation or replaying the same submission',async t=>{
  const launches=[],api=client({afterCues:async(selected,cursor)=>cursor===20?[cue(21,'Launch Other App')]:[]});
  const value=poller(t,{client:api,handoff:handoff({active:false}),onLaunch:target=>launches.push(target)});
  assert.equal(await value.fetch(),true);assert.equal(value.state().cursor,21);assert.equal(value.state().kind,'warn');assert.match(value.state().status,/Unknown launch target: Other App/);
  assert.deepEqual(launches,[]);await value.fetch();assert.equal(value.state().cursor,21);assert.equal(api.calls.after,2);
});

test('Stop aborts an in-flight request and prevents navigation or cursor changes when a stale reply settles',async t=>{
  const held=deferred(),launches=[];let signal;
  const api=client({afterCues:async(selected,cursor,options)=>{signal=options.signal;return held.promise;}});
  const value=poller(t,{client:api,handoff:handoff(),onLaunch:target=>launches.push(target)});
  const job=value.fetch();await turn();assert.equal(value.state().busy,true);value.stop();assert.equal(signal.aborted,true);assert.equal(value.state().active,false);
  held.resolve([cue(21,'Launch Geoglyph')]);assert.equal(await job,false);assert.deepEqual(launches,[]);assert.equal(value.state().cursor,20);assert.equal(value.state().busy,false);
});

test('layer selection and interval settings remain explicit and reset the cursor for a new source',async t=>{
  const second={id:2,url:source+'/2'},api=client({discover:async()=>[layer,second],latestCue:async selected=>cue(selected.id+10,'Launch Geoglyph')});
  const value=poller(t,{client:api});assert.equal(await value.fetch(),false);assert.equal(value.state().layerId,null);assert.match(value.state().status,/Choose a results layer/);
  assert.throws(()=>value.selectLayer(99),/valid results layer/);value.selectLayer(2);value.setInterval(7);
  assert.equal(await value.fetch(),true);assert.equal(value.state().layerId,2);assert.equal(value.state().cursor,12);assert.equal(value.state().interval,7);
  value.selectLayer(0);assert.equal(value.state().cursor,null);assert.equal(value.state().active,false);
  for(const bad of [0,3601,1.5,'2',NaN])assert.throws(()=>value.setInterval(bad),/interval/);
});

test('network failures retain the active connection and retry on its next timer tick',async t=>{
  t.mock.timers.enable({apis:['setTimeout']});
  let attempts=0;const api=client({latestCue:async()=>{if(!attempts++)throw Error('Connection interrupted');return cue(30,'Launch Geoglyph');}});
  const value=poller(t,{client:api});assert.equal(await value.start(),false);assert.equal(value.state().active,true);assert.match(value.state().status,/Connection interrupted/);
  t.mock.timers.tick(1000);await turn();assert.equal(api.calls.latest,2);assert.equal(value.state().cursor,30);assert.equal(value.state().busy,false);
  value.stop();t.mock.timers.tick(5000);await turn();assert.equal(api.calls.latest,2);
});

test('access failures stop automatic polling while allowing an explicit later retry',async t=>{
  let deny=true;const api=client({discover:async()=>{if(deny)throw Object.assign(Error('Access denied'),{kind:'access'});return [layer];}});
  const value=poller(t,{client:api});assert.equal(await value.start(),false);assert.equal(value.state().active,false);assert.equal(value.state().kind,'warn');
  deny=false;assert.equal(await value.start(),true);assert.equal(value.state().active,true);assert.equal(value.state().cursor,20);
});

test('simultaneous Fetch and Start calls retain one request owner',async t=>{
  const held=deferred(),api=client({latestCue:()=>held.promise}),value=poller(t,{client:api});
  const first=value.fetch();await turn();assert.equal(await value.fetch(),false);assert.equal(await value.start(),false);
  assert.deepEqual(api.calls,{discover:1,latest:1,after:0});held.resolve(cue(24,'Begin'));assert.equal(await first,true);assert.equal(value.state().cursor,24);assert.equal(value.state().busy,false);
});

test('a superseded request cannot clear a replacement request or advance its cursor',async t=>{
  const old=deferred(),fresh=deferred();let attempts=0;
  const api=client({afterCues:()=>++attempts===1?old.promise:fresh.promise});
  const value=poller(t,{client:api,handoff:handoff({active:false})});
  const first=value.fetch();await turn();value.stop();const replacement=value.fetch();await turn();
  old.resolve([cue(21,'Launch Geoglyph')]);assert.equal(await first,false);assert.equal(value.state().busy,true);assert.equal(value.state().cursor,20);
  fresh.resolve([cue(22,'Begin')]);assert.equal(await replacement,true);assert.equal(value.state().busy,false);assert.equal(value.state().cursor,22);
});

test('disposing aborts current work and prevents further requests or launch callbacks',async t=>{
  const held=deferred(),api=client({discover:()=>held.promise}),launches=[],value=poller(t,{client:api,onLaunch:target=>launches.push(target)});
  const pending=value.start();value.dispose();held.resolve([layer]);assert.equal(await pending,false);assert.equal(await value.start(),false);assert.equal(await value.fetch(),false);
  assert.deepEqual(api.calls,{discover:1,latest:0,after:0});assert.deepEqual(launches,[]);
});
