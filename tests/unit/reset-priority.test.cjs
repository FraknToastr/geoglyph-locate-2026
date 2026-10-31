const {test}=require('node:test'),assert=require('node:assert/strict');
const {create}=require('../../src/scripts/survey-results.js');
const layer={url:'https://example.invalid/FeatureServer/0',objectIdField:'objectid',field:'message',cueFields:{special_commands:'special_commands'}};
test('bounded Reset lookup finds a normalized command beyond the content queue',async()=>{
  const requests=[];
  const client=create({serviceUrl:'https://example.invalid/FeatureServer',fetch:async(_url,options)=>{
    const params=new URLSearchParams(options.body);requests.push(params);
    return {ok:true,status:200,json:async()=>({features:[{attributes:{objectid:1001,special_commands:'not reset'}},{attributes:{objectid:1000,special_commands:' ReSeT '}}],exceededTransferLimit:false})};
  }});
  assert.equal((await client.latestResetCue(layer,100)).objectId,1000);
  assert.equal(requests.length,1);assert.equal(requests[0].get('resultRecordCount'),'25');
  assert.match(requests[0].get('where'),/^objectid>100 AND UPPER\(special_commands\) LIKE/);
});
test('false-positive command matches are bounded to four descending pages',async()=>{
  let calls=0;
  const client=create({serviceUrl:'https://example.invalid/FeatureServer',fetch:async()=>({ok:true,status:200,json:async()=>({features:Array.from({length:25},(_,i)=>({attributes:{objectid:1000-calls*25-i,special_commands:'not reset'}})),exceededTransferLimit:!!++calls})})});
  assert.equal(await client.latestResetCue(layer,0),null);assert.equal(calls,4);
});
test('a source without a command field sends no additional query',async()=>{
  const client=create({serviceUrl:'https://example.invalid/FeatureServer',fetch:async()=>{throw Error('Unexpected request');}});
  assert.equal(await client.latestResetCue({...layer,cueFields:{}},0),null);
});
