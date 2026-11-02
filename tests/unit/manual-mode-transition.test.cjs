const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/geoglyph-map-engine-inline.js'),'utf8');
function harness(build){
  const calls=[],state={fontChoiceVersion:0,previewActive:true,mapReady:true,extrusionEnabled:false,lastRenderMode:'vector',lastGeoJSON:{old:true},map:{getSource:()=>({setData:value=>calls.push(['data',value])})}};
  const c=vm.createContext({mapState:state,SOURCE_ID:'source',CustomEvent:class{constructor(type){this.type=type;}},document:{dispatchEvent:()=>calls.push(['manual'])},window:{GeoGlyph3D:{stopOrbit(){},refreshControls(){},syncVisibility(){},isVisible:()=>true,update:async()=>{}}},cancelInitialFit(){},syncUiFromState(){},clearTimeout,queueRebuild(){},rebuildGeometry:build,waitForGroundFrame:async()=>calls.push(['frame']),fitDrawnGeometry:async(current,options)=>{assert.equal(current(),true);assert.equal(options.explicit,true);calls.push(['fit']);},emptyFeatureCollection:()=>({}),setGroundDecal(){},clearGroundDecal(){},setStatus:message=>calls.push(['status',message])});
  const start=source.indexOf('  let manualModelVersion ='),end=source.indexOf('  function setMirrorX(',start);
  vm.runInContext(source.slice(start,end)+';globalThis.change=setModelMode;',c);
  return {state,calls,change:c.change};
}
test('manual mode switch waits for new artwork frame before one explicit Fit',async()=>{
  let h;h=harness(async()=>{h.calls.push(['rebuild']);return {ok:true};});
  assert.equal(await h.change(true),true);assert.equal(h.state.extrusionEnabled,true);
  assert.deepEqual(h.calls.map(call=>call[0]),['manual','rebuild','frame','fit']);
});
test('rapid mode switches only fit the final committed representation',async()=>{
  const releases=[],h=harness(()=>new Promise(resolve=>releases.push(resolve)));
  const a=h.change(true),b=h.change(false);
  releases[1]({ok:true});assert.equal(await b,true);
  releases[0]({ok:true});assert.equal(await a,false);
  assert.equal(h.state.extrusionEnabled,false);assert.equal(h.calls.filter(call=>call[0]==='fit').length,1);
});
test('failed extrusion retains prior artwork and mode without fitting stale content',async()=>{
  const h=harness(async()=>({ok:false,error:Error('No exact outlines')})),old=h.state.lastGeoJSON;
  assert.equal(await h.change(true),false);assert.equal(h.state.extrusionEnabled,false);assert.equal(h.state.lastGeoJSON,old);
  assert.equal(h.calls.filter(call=>call[0]==='fit').length,0);assert.ok(h.calls.some(call=>call[0]==='status'&&call[1]==='No exact outlines'));
});
