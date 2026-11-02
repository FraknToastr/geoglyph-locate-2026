const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../../src/scripts/ground-3d.js'),'utf8');
function harness(transition){
  const calls=[],s={extrusionEnabled:false,baseHeightMeters:300,relativeSize:100,extrusionDepthMeters:null};
  const api={setModelMode:transition,queueRebuild:fit=>calls.push(['rebuild',fit])};
  const c=vm.createContext({state:()=>s,engine:()=>api,clear:()=>calls.push(['clear']),refreshControls:()=>calls.push(['refresh']),failure:text=>calls.push(['failure',text])});
  vm.runInContext(source.slice(source.indexOf('function setEnabled('),source.indexOf('function stopMotion(')),c);
  return {calls,s,setEnabled:c.setEnabled};
}
test('manual 2D/3D control delegates one transition without rebuilding or clearing the currently valid model',async()=>{
  const modes=[],h=harness(async enabled=>{modes.push(enabled);});
  await h.setEnabled(true);await h.setEnabled(false);
  assert.deepEqual(modes,[true,false]);assert.equal(h.s.extrusionEnabled,false);assert.equal(h.s.extrusionDepthMeters,null);assert.deepEqual(h.calls,[]);
});
test('failed manual transition reports failure and restores controls without launching a second rebuild',async()=>{
  const h=harness(async()=>{throw Error('Outline unavailable');});
  await h.setEnabled(true);
  assert.deepEqual(h.calls,[['failure','Outline unavailable'],['refresh']]);assert.equal(h.s.extrusionEnabled,false);
});
test('internal animation enablement retains its existing non-manual rebuild path',()=>{
  const h=harness(()=>{throw Error('Manual transition must not run');});
  h.setEnabled(true,{manual:false});
  assert.equal(h.s.extrusionEnabled,true);assert.equal(h.s.extrusionDepthMeters,30);
  assert.deepEqual(h.calls,[['refresh'],['rebuild',false]]);
});
