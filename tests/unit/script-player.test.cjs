const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path'),Module=require('node:module');
const {buildSync}=require('esbuild');
function load(file){const filename=path.resolve(__dirname,file+'.bundle.cjs'),moduleObject=new Module(filename,module);moduleObject._compile(buildSync({entryPoints:[path.resolve(__dirname,'../../src/scripts/'+file+'.js')],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text,filename);return moduleObject.exports;}
const {validateScript,validateAction}=load('script-model'),{createScriptPlayer}=load('script-player');
const introduction=require('../../src/scripts/introduction.json');
const flush=()=>new Promise(setImmediate);
const script=rows=>({version:1,title:'Fixture',rows:rows.map((row,index)=>({id:String(index),message:'row '+index,duration:1,actions:[],...row}))});
function harness(apply){
  let time=0,visible=true,sequence=0,freezes=0;const timers=new Map(),calls=[];
  const player=createScriptPlayer({applyRow:async(row,context)=>{calls.push(row.id);await apply?.(row,context);},now:()=>time,visible:()=>visible,
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
test('invalid imports reject excess/duplicate actions, bad values, unsupported versions and conflicting 2D orbit',()=>{
  for(const value of [script([{actions:Array(5).fill({type:'fit',value:true})}]),script([{actions:[{type:'fit',value:true},{type:'fit',value:false}]}]),script([{actions:[{type:'mode',value:'2d'},{type:'animation',value:'fixed'}]}]),{...script([]),version:2},script([{duration:Infinity}]),script([{actions:[{type:'colour',value:{fill:'red'}}]}]),script([{actions:[{type:'eval',value:'alert(1)'}]}])])assert.throws(()=>validateScript(value));
  assert.throws(()=>validateAction({type:'font',value:{}}));
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
