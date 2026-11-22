const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path'),Module=require('node:module');
const {buildSync}=require('esbuild');
const {validateView,validateFlight}=require('../../src/scripts/camera-flight.js');
const filename=path.resolve(__dirname,'camera-flight-model.bundle.cjs'),modelModule=new Module(filename,module);
modelModule._compile(buildSync({entryPoints:[path.resolve(__dirname,'../../src/scripts/script-model.js')],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text,filename);
const {validateAction,validateScript}=modelModule.exports;
const view=(overrides={})=>({center:[138.6007,-34.9285],zoom:12.5,pitch:0,bearing:0,...overrides});
const flight=(overrides={})=>({type:'flight',start:view(),end:view({center:[147.3272,-42.8821],zoom:8,pitch:55,bearing:45}),duration:5,...overrides});

test('camera endpoints retain flat and tilted views and copy only their camera fields',()=>{
  const input=flight({temporary:'not saved'});input.start.center.extra='not saved';input.start.unused=true;
  const saved=validateFlight(input);
  assert.deepEqual(saved,flight());assert.notEqual(saved,input);assert.notEqual(saved.start,input.start);assert.notEqual(saved.start.center,input.start.center);
  input.start.center[0]=0;assert.equal(saved.start.center[0],138.6007);
  assert.deepEqual(validateView(view({center:[-180,-85.051129],zoom:0,pitch:0,bearing:-360})),view({center:[-180,-85.051129],zoom:0,pitch:0,bearing:-360}));
  assert.deepEqual(validateView(view({center:[180,85.051129],zoom:24,pitch:85,bearing:360})),view({center:[180,85.051129],zoom:24,pitch:85,bearing:360}));
  assert.equal(validateFlight(flight({duration:.25})).duration,.25);assert.equal(validateFlight(flight({duration:300})).duration,300);
});

test('incomplete endpoints and non-finite or unsupported camera values reject before saving',()=>{
  for(const invalid of [null,[],{},view({center:null}),view({center:[0]}),view({center:[0,0,0]})])assert.throws(()=>validateView(invalid));
  for(const key of ['center','zoom','pitch','bearing']){const incomplete=view();delete incomplete[key];assert.throws(()=>validateView(incomplete));}
  for(const value of [NaN,Infinity,-Infinity,'10',null,undefined]){
    for(const key of ['zoom','pitch','bearing'])assert.throws(()=>validateView(view({[key]:value})));
    assert.throws(()=>validateView(view({center:[value,0]})));assert.throws(()=>validateView(view({center:[0,value]})));
    assert.throws(()=>validateFlight(flight({duration:value})));
  }
  for(const invalid of [view({center:[180.01,0]}),view({center:[-180.01,0]}),view({center:[0,85.05113]}),view({center:[0,-85.05113]}),view({zoom:-.01}),view({zoom:24.01}),view({pitch:-.01}),view({pitch:85.01}),view({bearing:-360.01}),view({bearing:360.01})])assert.throws(()=>validateView(invalid));
  for(const invalid of [null,[],{},flight({type:'unknown'}),flight({start:undefined}),flight({end:null}),flight({duration:0}),flight({duration:300.01})])assert.throws(()=>validateFlight(invalid));
});

test('custom camera flights round trip in version 1 scripts alongside existing camera actions',()=>{
  const values=['opening','fly-opening','overview',flight()];
  for(const value of values)assert.deepEqual(validateAction({type:'camera',value}),{type:'camera',value});
  const document={version:1,title:'Camera journey',rows:values.map((value,index)=>({id:String(index),message:'',duration:2,actions:[{type:'camera',value}]}))};
  assert.deepEqual(validateScript(JSON.parse(JSON.stringify(document))),document);
  assert.equal(validateScript(require('../../src/scripts/introduction.json')).rows.length,21);
  assert.throws(()=>validateAction({type:'camera',value:'flight'}),/Choose a camera action/);
  assert.throws(()=>validateAction({type:'camera',value:{type:'flight'}}),/Start camera view/);
});

test('new camera values preserve row limits and report invalid endpoint errors with row numbers',()=>{
  const document={version:1,title:'Fixture',rows:[{id:'row',message:'',duration:0,actions:[{type:'camera',value:flight()},{type:'mode',value:'3d'},{type:'colour',value:{fill:'#00FF00'}},{type:'title',value:'Flight'}]}]};
  assert.equal(validateScript(document).rows[0].actions.length,4);
  assert.throws(()=>validateScript({...document,rows:[{...document.rows[0],actions:[...document.rows[0].actions,{type:'fit',value:true}]}]}),/four actions/);
  assert.throws(()=>validateScript({...document,rows:[{...document.rows[0],actions:[{type:'camera',value:flight({end:view({pitch:90})})}]}]}),/Row 1: End camera view pitch/);
});
