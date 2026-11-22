// Read-only audit probe. Uses actual application functions with synthetic I/O.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.argv[2] || path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'src/scripts/geoglyph-map-engine-inline.js'), 'utf8');
function functionSource(name) {
  const start = source.search(new RegExp('(?:async )?function ' + name + '\\('));
  assert(start >= 0, 'Function exists: ' + name);
  const end = source.indexOf('\n  }', start);
  return source.slice(start, end + 4);
}
async function manualSelectionRace() {
  let release;
  let rebuilds = 0;
  const mapState = { fontRecords:new Map([['cue-font',{}],['manual-font',{}]]), previewActive:true,
    rebuilding:false,fontChoiceVersion:0,conferenceRenderSuspended:false,conferenceApplying:false,
    conferenceRebuildPending:false,selectedFontId:'previous',extrusionEnabled:false };
  const gate = new Promise(resolve => { release = resolve; });
  const ctx = vm.createContext({ mapState, clearTimeout(){}, setTimeout(){return 1;},
    window:{GeoGlyph3D:{stopOrbit(){},refreshControls(){}},GeoGlyphUi:{isRestoring(){return false;}}},
    $(){return null;}, waitForCondition:async()=>{}, cancelRandomSearch(){},syncUiFromState(){},
    updateAnchorStats(){},activateSelectedFont(){},
    async rebuildGeometry(_fit,options){rebuilds++;await gate;return options.isCurrent()?{ok:true}:undefined;}
  });
  for(const name of ['queueRebuild','selectFont','applyConferenceCue'])vm.runInContext(functionSource(name),ctx);
  const applying = ctx.applyConferenceCue({fontId:'cue-font',message:'synthetic',nativeColor:false,extrusionEnabled:false}).catch(e=>e.message);
  await new Promise(setImmediate);
  assert.equal(mapState.conferenceApplying,true);
  await ctx.selectFont('manual-font');
  release();
  const error=await applying;
  ctx.queueRebuild(false);
  assert.equal(mapState.conferenceApplying,true);
  assert.equal(mapState.conferenceRebuildPending,true);
  assert.equal(rebuilds,1);
  return {error,conferenceApplying:mapState.conferenceApplying,conferenceRebuildPending:mapState.conferenceRebuildPending,actualRebuildCalls:rebuilds};
}
async function pagingBudget() {
  const {create}=require(path.join(root,'src/scripts/survey-results.js'));
  let calls=0;
  const controller=new AbortController();
  const client=create({serviceUrl:'https://example.invalid/FeatureServer',fetch:async()=>{
    calls++;
    if(calls===101)controller.abort(new Error('Synthetic probe stops after 100 full pages'));
    return {ok:true,status:200,json:async()=>({features:Array.from({length:25},(_,i)=>({attributes:{objectid:(calls-1)*25+i+1}})),exceededTransferLimit:true})};
  }});
  const layer={url:'https://example.invalid/FeatureServer/0',field:'message',objectIdField:'objectid',cueFields:{},pageSize:25};
  let result,error;
  try{result=await client.afterCues(layer,0,{signal:controller.signal});}catch(e){error=e.message;}
  assert.equal(calls,101);assert.equal(result,undefined);
  return {fullPagesAcceptedBeforeExternalAbort:100,rowsHeldBeforeExternalAbort:2500,fetchCalls:calls,deliveredBeforeAbort:Boolean(result),error};
}
(async()=>{
 const result={methodology:'Unmodified source functions/client, synthetic dependencies and records; no browser, network or app source mutation.',manualSelectionRace:await manualSelectionRace(),unboundedPaging:await pagingBudget()};
 fs.writeFileSync(path.join(__dirname,'network-repro-results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
