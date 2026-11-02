const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {Matrix4:ThreeMatrix4}=require('three');
const root=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'src/scripts/ground-3d.js'),'utf8');
const transform=require(path.join(root,'src/scripts/ground-transform.js'));
function harness(){
  let allocations=0;
  class Matrix4 extends ThreeMatrix4 {constructor(){super();allocations++;}}
  class MercatorCoordinate {
    constructor(x,y,z=0){Object.assign(this,{x,y,z});}
    static fromLngLat(anchor,z){return new this(anchor.lng/360,(90-anchor.lat)/180,z);}
    meterInMercatorCoordinateUnits(){return 1/(40000000*Math.cos((90-this.y*180)*Math.PI/180));}
    toLngLat(){return {lng:this.x*360,lat:90-this.y*180};}
    toAltitude(){return this.z/this.meterInMercatorCoordinateUnits();}
  }
  const s={anchor:{lng:138,lat:-35},baseHeightMeters:300,relativeSize:100,extrusionDepthMeters:30};
  const data={bounds:{minX:-2,maxX:3,minY:-.5,maxY:.6,minZ:-.5,maxZ:.5}};
  const c=vm.createContext({Matrix4,state:()=>s,data,camera:{getAngles:()=>({bearing:20,tilt:90})},window:{GeoGlyphGroundTransform:transform,maplibregl:{MercatorCoordinate}}});
  vm.runInContext('const matrixScratch=new Matrix4();\n'+source.slice(source.indexOf('function settings('),source.indexOf('function isVisible('))+'\nglobalThis.calculate=matrices;',c);
  return {s,data,c,calculate:c.calculate,reset(){allocations=0;},allocations:()=>allocations};
}
function original(h,angles){
  const {s,data}=h,Matrix4=h.c.Matrix4,values={heightMeters:s.baseHeightMeters*s.relativeSize/100,depthMeters:s.extrusionDepthMeters??30,...angles};
  const p=transform.parameters(values,data.bounds),origin=h.c.window.maplibregl.MercatorCoordinate.fromLngLat(s.anchor,0),u=origin.meterInMercatorCoordinateUnits();
  const geographic=new Matrix4().makeTranslation(origin.x,origin.y,origin.z).multiply(new Matrix4().makeScale(u,-u,u)).multiply(new Matrix4().makeRotationZ(-p.bearing));
  const object=new Matrix4().makeTranslation(0,0,p.lift).multiply(new Matrix4().makeRotationX(p.tilt)).multiply(new Matrix4().makeScale(p.height,p.height,p.depth));
  const b=data.bounds,mid=[(b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2];
  const localCenter=transform.point(mid,values,b),center=new h.c.window.maplibregl.MercatorCoordinate(origin.x+localCenter[0]*u,origin.y-localCenter[1]*u,localCenter[2]*u);
  return {geographic,object,localCenter,center:center.toLngLat(),elevation:center.toAltitude(),units:u,radius:Math.hypot((b.maxX-b.minX)*p.height,(b.maxY-b.minY)*p.height,(b.maxZ-b.minZ)*p.depth)/2};
}
test('scratch matrix products equal original transforms across latitude, bearing, tilt and size',()=>{
  const h=harness();let cases=0;
  for(const lat of [-70,-35,0,65])for(const bearing of [-360,-27,0,89,270])for(const tilt of [0,25,55,90,135,180])for(const size of [1,100,250]){
    h.s.anchor.lat=lat;h.s.relativeSize=size;
    const angles={bearing,tilt},a=h.calculate(angles),b=original(h,angles);
    for(const key of ['geographic','object'])assert.deepEqual(Array.from(a[key].elements),b[key].elements);
    for(const key of ['localCenter','center','elevation','units','radius'])assert.equal(JSON.stringify(a[key]),JSON.stringify(b[key]));
    cases++;
  }
  assert.equal(cases,360);
});
test('camera poses keep independent matrices while render outputs can be reused without allocations',()=>{
  const h=harness();h.reset();
  original(h,{bearing:10,tilt:55});assert.equal(h.allocations(),6);h.reset();
  const first=h.calculate({bearing:10,tilt:55}),elements=Array.from(first.object.elements),geographic=Array.from(first.geographic.elements);
  assert.equal(h.allocations(),2,'original implementation allocated six Matrix4s per pose');
  const second=h.calculate({bearing:100,tilt:90});
  assert.notEqual(first.object,second.object);assert.notEqual(first.geographic,second.geographic);
  assert.deepEqual(Array.from(first.object.elements),elements);assert.deepEqual(Array.from(first.geographic.elements),geographic);
  const output={object:new ThreeMatrix4(),geographic:new ThreeMatrix4()};h.reset();
  for(let i=0;i<100;i++){
    const result=h.calculate({bearing:i,tilt:55},output);
    assert.equal(result.object,output.object);assert.equal(result.geographic,output.geographic);
  }
  assert.equal(h.allocations(),0);
});
test('custom render shares one coherent pose between paint and projection and retains GL resets',()=>{
  let solves=0,paintPose,projectionPose,resets=0,draws=0;
  const pose={object:{},geographic:{}},c=vm.createContext({isVisible:()=>true,state:()=>({previewActive:true}),matrices:(angles,output)=>{solves++;assert.equal(output,c.layer.poseMatrices);return pose;}});
  const start=source.indexOf('    render(gl,args) {'),end=source.indexOf('    onRemove()',start);
  vm.runInContext('globalThis.layer={'+source.slice(start,end)+'};',c);
  Object.assign(c.layer,{poseMatrices:{},paint:p=>{paintPose=p;},camera:{projectionMatrix:{fromArray(){return this;},multiply:p=>{projectionPose=p;}},projectionMatrixInverse:{copy(){return this;},invert(){}}},renderer:{resetState(){resets++;},setViewport(){},render(){draws++;}}});
  c.layer.render({drawingBufferWidth:800,drawingBufferHeight:600},{defaultProjectionData:{mainMatrix:[]}});
  assert.equal(solves,1);assert.equal(paintPose,pose);assert.equal(projectionPose,pose.geographic);assert.equal(resets,2);assert.equal(draws,1);
});

test('horizontal reflection affects faces and outlines around their shared centre without moving the camera target',()=>{
  const h=harness();
  for(const bearing of [-120,0,75])for(const tilt of [0,45,90]){
    h.s.mirrorX=false;
    const angles={bearing,tilt},plain=h.calculate(angles);
    h.s.mirrorX=true;
    const mirrored=h.calculate(angles),b=h.data.bounds;
    const expected=plain.object.clone().multiply(new ThreeMatrix4().makeTranslation(b.minX+b.maxX,0,0)).multiply(new ThreeMatrix4().makeScale(-1,1,1));
    assert.deepEqual(Array.from(mirrored.object.elements),expected.elements);
    assert.deepEqual(Array.from(mirrored.geographic.elements),Array.from(plain.geographic.elements));
    for(const key of ['localCenter','center','elevation','radius'])assert.equal(JSON.stringify(mirrored[key]),JSON.stringify(plain[key]));
    assert.ok(mirrored.object.determinant()<0);
    h.s.mirrorX=false;
    assert.deepEqual(Array.from(h.calculate(angles).object.elements),Array.from(plain.object.elements));
  }
});

test('point transformation reflects asymmetric local x coordinates exactly while retaining tilt, bearing and elevation',()=>{
  const bounds={minX:-2,maxX:6,minY:-1,maxY:2,minZ:-.5,maxZ:.5};
  for(const bearing of [0,35,180])for(const tilt of [0,90,135])for(const p of [[-2,-1,-.5],[0,1,0],[6,2,.5]]){
    const values={heightMeters:300,depthMeters:30,bearing,tilt};
    const mirrored=transform.point(p,{...values,mirrorX:true},bounds);
    assert.deepEqual(mirrored,transform.point([bounds.minX+bounds.maxX-p[0],p[1],p[2]],values,bounds));
  }
});
