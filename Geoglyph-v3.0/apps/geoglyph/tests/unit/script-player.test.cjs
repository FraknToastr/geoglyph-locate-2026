const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path'),Module=require('node:module');
const {buildSync}=require('esbuild');
function load(file){const filename=path.resolve(__dirname,file+'.bundle.cjs'),moduleObject=new Module(filename,module);moduleObject._compile(buildSync({entryPoints:[path.resolve(__dirname,'../../src/scripts/'+file+'.js')],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text,filename);return moduleObject.exports;}
const {validateScript,validateAction}=load('script-model'),{createScriptPlayer}=load('script-player');
const introduction=require('../../src/scripts/introduction.json');
const rehearsal=require('../../src/scripts/locate-2026-rehearsal.json');
const flush=()=>new Promise(setImmediate);
const script=rows=>({version:1,title:'Fixture',rows:rows.map((row,index)=>({id:String(index),message:'row '+index,duration:1,actions:[],...row}))});
function harness(apply,changed){
  let time=0,visible=true,sequence=0,freezes=0;const timers=new Map(),calls=[];
  const player=createScriptPlayer({applyRow:async(row,context)=>{calls.push(row.id);await apply?.(row,context);},changed,now:()=>time,visible:()=>visible,
    timer:(fn,ms)=>{const id=++sequence;timers.set(id,{fn,due:time+ms});return id;},cancelTimer:id=>timers.delete(id),stopped:()=>freezes++});
  return {player,calls,timers,get freezes(){return freezes;},
    async advance(ms){time+=ms;for(const [id,timer]of [...timers])if(timer.due<=time){timers.delete(id);timer.fn();}await flush();},
    hide(value){visible=!value;player.wake();}};
}
test('script JSON round trips four combined actions, multiline text and the complete introduction',()=>{
  const value=script([{message:'First\nSecond',actions:[{type:'mode',value:'3d'},{type:'colour',value:{fill:'#aabbcc'}},{type:'animation',value:'yaw'},{type:'font',value:{name:'Gill Sans',resourceKey:'conference:Gill Sans'}}]}]);
  assert.deepEqual(validateScript(JSON.parse(JSON.stringify(value))),{...value,rows:[{...value.rows[0],actions:[value.rows[0].actions[0],{type:'colour',value:{fill:'#AABBCC'}},...value.rows[0].actions.slice(2)]}]});
  const bundled=validateScript(introduction);assert.equal(bundled.rows.length,21);assert.ok(bundled.rows.every(r=>r.actions.length<=4));
  assert.equal(bundled.rows.slice(0,5).reduce((sum,r)=>sum+r.duration,0),10);
  assert.equal(bundled.rows.at(-1).message,'Where are you Josh?');
});
test('rehearsal JSON is importable and preserves the written lines and both morph demonstrations',()=>{
  const source=require('node:fs').readFileSync(path.resolve(__dirname,'../../../../scripts/Locate-2026-Geo-Begin-Script.txt'),'utf8');
  const first=source.indexOf('Hello!');
  const expected=source.slice(first).trim().split(/\r?\n(?:\r?\n)+/u)
    .filter(line=>!line.startsWith('[')).map(line=>line.replaceAll('\r\n','\n'));
  const bundled=validateScript(JSON.parse(JSON.stringify(rehearsal)));
  const opening=bundled.rows.slice(0,5);
  assert.deepEqual(opening.map(row=>row.duration),[2,2,2,2,2]);
  assert.deepEqual(opening.map(row=>row.actions.find(action=>action.type==='title')?.value),
    Array.from({length:5},(_,index)=>'Conference Day'+'.'.repeat(index+1)));
  assert.equal(opening[0].actions.find(action=>action.type==='camera')?.value,'opening-and-fly');
  assert.deepEqual(bundled.rows[5].actions,[{type:'title',value:''},{type:'camera',value:'wait-for-opening-flight'}]);
  const speech=bundled.rows.slice(bundled.rows.findIndex(row=>row.id==='hello'));
  const showcase='The amazing\nGeoglyph';
  const spoken=speech.flatMap(row=>{
    const title=row.actions.find(action=>action.type==='title')?.value;
    const target=row.actions.find(action=>action.type==='morph')?.value.targetMessage;
    return [title,row.message,target].filter(message=>message&&message!==showcase);
  });
  assert.deepEqual(spoken,expected);
  const morphs=bundled.rows.flatMap(row=>row.actions.filter(action=>action.type==='morph').map(action=>action.value));
  assert.deepEqual(morphs.slice(0,3).map(value=>value.targetMessage),[showcase,showcase,showcase]);
  assert.deepEqual(morphs.slice(3).map(value=>[value.from.resourceKey,value.targetMessage]),[
    ['conference:Audiowide',"I don't just speak languages"],['conference:Bree Serif','I become them'],
    ['conference:Bungee','Thanks for watching']
  ]);
  assert.ok(morphs.every(value=>value.duration===2));
  const faces=speech.slice(1,-1).map(row=>row.actions.find(a=>a.type==='font')?.value.resourceKey||
    row.actions.find(a=>a.type==='morph')?.value.to.resourceKey);
  assert.ok(faces.every(Boolean));
  assert.equal(new Set(faces).size,faces.length);
  assert.equal(morphs[2].to.resourceKey,'conference:Audiowide');
  assert.ok(!JSON.stringify(bundled).includes('Magneto'));
  assert.ok(speech.filter(row=>row.actions.some(a=>a.type==='morph')).every(row=>row.actions.some(a=>a.type==='location'||a.type==='fit'&&a.value)));
  const greetingIds=['seoul','tbilisi','yerevan','kyiv','sounion','marrakesh'];
  assert.deepEqual(speech.slice(0,12).map(row=>row.id),['hello',...greetingIds,'my-name','call-me','made-by','dialects','interesting']);
  const dialects=speech.find(row=>row.id==='dialects');
  assert.equal(dialects.message,'I speak all\n2D and 3D dialects');
  assert.ok(dialects.actions.some(action=>action.type==='mode'&&action.value==='3d'));
  const stops=speech.filter(row=>row.actions.some(a=>a.type==='location'));
  assert.deepEqual(stops.map(row=>row.id),[...greetingIds,'my-name','watch','speak-languages','become-them']);
  const greetings=stops.slice(0,greetingIds.length).map(row=>Object.fromEntries(row.actions.map(({type,value})=>[type,value])));
  assert.deepEqual(greetings.map(({location})=>location.caption),[
    'Hello in Korean · Seoul, South Korea','Hello in Georgian · Tbilisi, Georgia','Hello in Armenian · Yerevan, Armenia',
    'Hello in Ukrainian · Kyiv, Ukraine','Hello in Greek · Cape Sounion, Greece','Hello in Tamazight · Marrakesh, Morocco'
  ]);
  assert.deepEqual(greetings.map(({size})=>size.height),[72,95,75,180,120,1500]);
  assert.equal(greetings[4].location.cameraBearing,345);
  assert.ok(greetings.every(({location})=>location.maxZoom===undefined));
  assert.ok(greetings.every(({location,animation})=>location.instant&&animation===undefined));
  assert.deepEqual(speech.slice(-4).map(row=>row.id),['future','speak-languages','become-them','thanks']);
  assert.equal(speech.at(-3).duration,5);
  assert.equal(speech.at(-2).duration,3);
  assert.equal(speech.at(-1).duration,0);
  assert.deepEqual(bundled.fontCycle,{duration:2,hold:2});
  assert.throws(()=>validateAction({type:'morph',value:{...morphs[0],targetMessage:' '}}),/visible target message/);
  const {targetMessage,...sameText}=morphs[0];
  assert.deepEqual(validateAction({type:'morph',value:sameText}).value,sameText);
});
test('invalid imports reject excess/duplicate actions, bad values, unsupported versions and conflicting 2D orbit',()=>{
  for(const value of [script([{actions:Array(5).fill({type:'fit',value:true})}]),script([{actions:[{type:'fit',value:true},{type:'fit',value:false}]}]),script([{actions:[{type:'mode',value:'2d'},{type:'animation',value:'fixed'}]}]),{...script([]),version:2},script([{duration:Infinity}]),script([{actions:[{type:'colour',value:{fill:'red'}}]}]),script([{actions:[{type:'eval',value:'alert(1)'}]}])])assert.throws(()=>validateScript(value));
  assert.throws(()=>validateAction({type:'font',value:{}}));
  for(const value of [{lng:145},{lng:'145',lat:-37},{lng:181,lat:-37},{lng:145,lat:90}])
    assert.throws(()=>validateAction({type:'location',value}),/must be between/);
  assert.throws(()=>validateAction({type:'location',value:{lng:145,lat:-37,instant:'true'}}),/move to the location/);
  assert.throws(()=>validateAction({type:'location',value:{lng:145,lat:-37,maxZoom:25}}),/Maximum fit zoom/);
  assert.throws(()=>validateScript(script([{id:'a'},{id:'a'}])));
});
test('row holds begin after preparation, pause and hidden time do not consume holds, and Next steps while paused',async()=>{
  let release;const h=harness(row=>row.id==='0'?new Promise(resolve=>release=resolve):undefined);
  const playing=h.player.play(script([{},{}]));await flush();assert.deepEqual(h.calls,['0']);
  await h.advance(5000);assert.equal(h.player.state().phase,'preparing');release();await flush();
  await h.advance(400);h.player.pause();await h.advance(10000);assert.deepEqual(h.calls,['0']);
  h.player.next();await flush();assert.deepEqual(h.calls,['0','1']);assert.equal(h.player.state().paused,true);
  h.player.resume();h.hide(true);await h.advance(10000);assert.equal(h.player.state().running,true);
  h.hide(false);await h.advance(1000);assert.equal(await playing,true);assert.equal(h.timers.size,0);
});
test('stop cancels timers and rejects late preparations without applying another row',async()=>{
  let release;const h=harness(()=>new Promise(resolve=>release=resolve)),job=h.player.play(script([{},{}]));await flush();h.player.stop();release();
  assert.equal(await job,false);assert.deepEqual(h.calls,['0']);assert.equal(h.freezes,1);assert.equal(h.timers.size,0);
});
test('Next queued as a zero-duration row completes cannot skip the following hold',async()=>{
  let requested=false;
  const h=harness(undefined,state=>{
    if(state.phase!=='waiting'||state.rowId!=='0'||requested)return;
    requested=true;
    queueMicrotask(()=>h.player.next());
  });
  const playing=h.player.play(script([{duration:0},{duration:5}]));
  await flush();
  assert.deepEqual(h.calls,['0','1']);
  assert.equal(h.player.state().rowId,'1');
  await h.advance(4999);
  assert.equal(h.player.state().running,true);
  await h.advance(1);
  assert.equal(await playing,true);
});
test('rehearsal prepares once before any row, carries the prepared data, and can stop or retry',async()=>{
  let release;
  const prepared=new Map([['0','prepared outline']]);
  const h=harness((row,context)=>assert.equal(context.prepared.get(row.id),'prepared outline'));
  const ready=script([{duration:0}]);
  const pending=h.player.play(ready,0,{owner:'conference',prepare:(_value,context)=>new Promise(resolve=>{
    release=()=>{assert.equal(context.signal.aborted,true);resolve(prepared);};
  })});
  await flush();
  assert.equal(h.player.state().phase,'preflight');
  assert.deepEqual(h.calls,[]);
  h.player.stop();release();
  assert.equal(await pending,false);
  assert.deepEqual(h.calls,[]);
  await assert.rejects(h.player.play(ready,0,{prepare:async()=>{throw Error('Rehearsal row 6: Font missing');}}),/^Error: Rehearsal row 6: Font missing$/);
  assert.deepEqual(h.calls,[]);
  assert.equal(await h.player.play(ready,0,{prepare:async()=>prepared}),true);
  assert.deepEqual(h.calls,['0']);
});
test('a failed row retains the prior display and reports its row number',async()=>{
  const h=harness(row=>{if(row.id==='1')throw Error('Missing font');}),job=h.player.play(script([{duration:0},{}]));
  await assert.rejects(job,/Row 2: Missing font/);assert.equal(h.player.state().phase,'error');assert.equal(h.freezes,1);assert.equal(h.timers.size,0);
});
test('zero-duration scripts finish and invalid drafts never interrupt an active run',async()=>{
  const h=harness(),job=h.player.play(script([{}]));await flush();
  await assert.rejects(h.player.play({version:99}),/version 1/);assert.equal(h.player.state().running,true);
  h.player.stop();assert.equal(await job,false);
  assert.equal(await h.player.play(script([{duration:0},{duration:0}])),true);
});
