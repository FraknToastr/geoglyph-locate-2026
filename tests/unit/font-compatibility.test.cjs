const {test}=require('node:test'),assert=require('node:assert/strict');
const {create,identity,probeCodes,probe,STORAGE_KEY}=require('../../src/scripts/font-compatibility.js');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const item=(id,key=id,extra={})=>({id,key,accessible:true,record:{},...extra});
function memory(){const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};}
async function done(f){for(let i=0;i<150&&f.progress().scanning;i++)await sleep(20);assert.equal(f.progress().scanning,false);}
test('catalogue updates do not scan; explicit Rescan rechecks outcomes instead of reusing them',async()=>{
  const calls=[],f=create({storage:memory(),check:async x=>{calls.push(x.id);return x.id==='a';}});
  try{
    f.update([item('a'),item('b')]);await sleep(125);assert.deepEqual(calls,[]);assert.equal(f.progress().hasScan,false);
    f.rescan();await done(f);assert.equal(f.result('a'),'compatible');assert.equal(f.result('b'),'incompatible');
    f.update([item('a','a',{message:'🫣',quality:36}),item('b')]);await sleep(125);assert.deepEqual(calls,['a','b']);
    f.rescan();await done(f);assert.deepEqual(calls,['a','b','a','b']);
  }finally{f.dispose();}
});
test('reload restores only scan results with no font work, including inaccessible catalogue aliases',async()=>{
  const storage=memory(),first=create({storage,check:async()=>true});
  first.update([item('a')]);first.rescan();await done(first);first.dispose();
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)),{version:1,scanned:true,entries:[['a','compatible']]});
  let calls=0;const second=create({storage,check:async()=>{calls++;return false;}});
  try{second.update([item('alias','a',{accessible:false})]);assert.equal(second.result('alias'),'compatible');await sleep(125);assert.equal(calls,0);assert.equal(second.progress().inaccessible,1);}
  finally{second.dispose();}
});
test('aliases share one sequential check and prefer an accessible source',async()=>{
  const calls=[],f=create({storage:memory(),check:async x=>{calls.push(x.id);return true;}});
  try{f.update([item('inaccessible','same',{accessible:false}),item('accessible','same')]);f.rescan();assert.equal(f.rescan(),false);await done(f);
    assert.deepEqual(calls,['accessible']);assert.equal(f.result('inaccessible'),'compatible');assert.equal(f.progress().total,1);
  }finally{f.dispose();}
});
test('transient and inaccessible outcomes are not persisted as incompatibility',async()=>{
  const storage=memory(),f=create({storage,check:async x=>{if(x.id==='error')throw Error('temporary');return 'incompatible';}});
  try{f.update([item('error'),item('no-bytes','no-bytes',{accessible:false}),item('colour')]);f.rescan();await done(f);
    assert.equal(f.result('error'),'unverified');assert.equal(f.result('no-bytes'),'inaccessible');assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)).entries,[['colour','incompatible']]);
  }finally{f.dispose();}
});
test('blocked and full storage retain usable results in memory',async()=>{
  for(const blockedRead of [true,false]){
    const storage={getItem(){if(blockedRead)throw Error('blocked');return null;},setItem(){throw Error('quota');}};
    const f=create({storage,check:async()=>true});
    try{f.update([item('a')]);f.rescan();await done(f);assert.equal(f.result('a'),'compatible');assert.match(f.progress().storageError,/storage unavailable/);}finally{f.dispose();}
  }
});
test('corrupt and obsolete saved data are ignored and replaced by an explicit scan',async()=>{
  for(const raw of ['{broken',JSON.stringify({version:0,scanned:true,entries:[]}),JSON.stringify({version:1,scanned:true,entries:[['a','unverified']]})]){
    const storage=memory();storage.setItem(STORAGE_KEY,raw);const f=create({storage,check:async()=>true});
    try{f.update([item('a')]);assert.equal(f.result('a'),'not scanned');assert.equal(f.progress().hasScan,false);f.rescan();await done(f);assert.equal(f.progress().storageError,'');assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).entries[0][1],'compatible');}finally{f.dispose();}
  }
});
test('storage entry and byte budgets evict oldest outcomes',async()=>{
  for(const options of [{cacheLimit:2},{byteLimit:300}]){
    const storage=memory(),f=create({storage,check:async()=>true,...options});
    try{
      const keys=options.byteLimit?['a','b','c'].map(s=>s.repeat(40)):['a','b','c'];
      f.update(keys.map(key=>item(key)));f.rescan();await done(f);
      const raw=storage.getItem(STORAGE_KEY),data=JSON.parse(raw);
      assert.ok(data.entries.length<3);assert.equal(data.entries.at(-1)[0],keys.at(-1));
      if(options.byteLimit)assert.ok(Math.max(raw.length*2,Buffer.byteLength(raw))<=options.byteLimit);
      else assert.equal(data.entries.length,2);
    }finally{f.dispose();}
  }
});
test('busy foreground work defers checks; disposal prevents late publications and further work',async()=>{
  let busy=true,calls=0,release;const gate=new Promise(r=>release=r);
  const f=create({storage:memory(),canWork:()=>!busy,check:async()=>{calls++;await gate;return true;}});
  f.update([item('a'),item('b')]);f.rescan();await sleep(125);assert.equal(calls,0);busy=false;
  for(let i=0;i<40&&!calls;i++)await sleep(20);assert.equal(calls,1);f.dispose();release();await sleep(125);assert.equal(calls,1);assert.equal(f.progress().checked,0);
});
test('stable identities use available source metadata and ignore transient provider versions',()=>{
  const file={name:'font.ttf',size:42,lastModified:123},read=()=>{throw Error('Must not read font bytes');};
  assert.equal(identity({file:{...file,arrayBuffer:read},providerVersion:1},'file-resource'),identity({geoGlyphRef:{file:{...file,arrayBuffer:read}},providerVersion:99},'file-resource'));
  assert.notEqual(identity({file},'file-resource'),identity({file:{...file,lastModified:124}},'file-resource'));
  assert.equal(identity({metadata:{postscriptName:'FontPS',style:'Regular'}},'one'),identity({localDescriptor:{postscriptName:'fontps',style:'regular'}},'two'));
});
function probeService(codes){
  const texts=[],calls={prepare:0,mesh:0},service={
    async prepare(){calls.prepare++;return {codes};},keyFor:()=> 'font',yieldTask:async()=>{},
    async model(record,text,options){texts.push({text,options});return {missing:[],polygons:[[]],bounds:{height:1},vertices:3};},
    async mesh(){calls.mesh++;return {position:new Float32Array(9),outline:new Float32Array(0),bytes:36};}
  };return {service,texts,calls};
}
test('general probe ignores current message/settings, including for non-Latin and private-use fonts',async()=>{
  for(const code of [65,0x4e00,0xf041]){
    const h=probeService([code]),record={};
    assert.equal(await probe({record,text:'😴',options:{quality:36}},()=>true,h),'compatible');
    assert.equal(h.texts[0].text,String.fromCodePoint(code));assert.equal(h.texts[0].options.quality,10);assert.equal(h.calls.mesh,1);
  }
});
test('colour/browser-only and unresolved glyphs cannot produce a false compatible result',async()=>{
  const h=probeService([65]);assert.equal(await probe({record:{hasColor:true}},()=>true,h),'incompatible');assert.equal(h.calls.mesh,0);
  assert.equal(await probe({record:{}},()=>true,{...h,prefersBrowser:()=>true}),'unverified');
  const blanks=probeService(Array.from({length:20},(_,i)=>65+i));blanks.service.model=async()=>{blanks.calls.models=(blanks.calls.models||0)+1;return {missing:[],polygons:[],bounds:{height:0}};};
  assert.equal(await probe({record:{}},()=>true,blanks),'unverified');assert.equal(blanks.calls.models,8);
  assert.deepEqual(probeCodes([0,32,0x0301,0xf041,0x4e00]),[0xf041,0x4e00]);
});
test('general probe stops stale/failed-worker checks before creating later models or meshes',async()=>{
  const stale=probeService([65]);assert.equal(await probe({record:{}},()=>false,stale),'unverified');assert.equal(stale.texts.length,0);
  const h=probeService([65,66]);h.service.model=async()=>{h.calls.models=(h.calls.models||0)+1;throw Object.assign(Error('worker failed'),{workerFailure:true});};
  assert.equal(await probe({record:{}},()=>true,h),'unverified');assert.equal(h.calls.models,1);
});
