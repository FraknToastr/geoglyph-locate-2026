const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const geometry=require('../../src/scripts/ground-geometry.js');
const transform=require('../../src/scripts/ground-transform.js');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(require.resolve('../../src/vendor/extrusion-worker.js'),'utf8'),context);
const square=(x,y,n)=>[[x,y],[x+n,y],[x+n,y+n],[x,y+n],[x,y]];

test('curve extrema and model placement stay identical across zoom tolerances',()=>{
  let paths=0;
  const commands=[{type:'M',x:0,y:0},{type:'C',x1:15,y1:123,x2:86,y2:72,x:100,y:0},{type:'L',x:0,y:0},{type:'Z'}];
  const glyph={index:1,advanceWidth:110,getPath(){paths++;return {commands};}};
  const font={unitsPerEm:1000,stringToGlyphs:()=>[glyph],getKerningValue:()=>0};
  const coarse=geometry.model(font,'A',{tolerance:9}),fine=geometry.model(font,'A',{tolerance:.002});
  assert.ok(fine.vertices>coarse.vertices);
  assert.deepEqual(coarse.bounds,fine.bounds);
  assert.equal(paths,1,'different LODs reuse original path commands');
  const q=geometry.pathBounds([{type:'M',x:0,y:0},{type:'Q',x1:50,y1:100,x:100,y:0}]);
  assert.equal(q.maxY,50);
});

test('extrusion preserves counters and supplies finite unit-depth geometry',()=>{
  const model={polygons:[[square(0,0,10),square(3,3,4).reverse()]],bounds:{cx:5,cy:5,height:10}};
  const mesh=context.GeoGlyphMesh.build(model);
  assert.ok(mesh.position.length>0&&Array.from(mesh.position).every(Number.isFinite));
  assert.equal(mesh.bounds.minZ,-.5);assert.equal(mesh.bounds.maxZ,.5);
  let frontArea=0;
  for(let i=0;i<mesh.position.length;i+=9){const p=mesh.position;if(p[i+2]===.5&&p[i+5]===.5&&p[i+8]===.5)frontArea+=Math.abs((p[i+3]-p[i])*(p[i+7]-p[i+1])-(p[i+6]-p[i])*(p[i+4]-p[i+1]))/2;}
  assert.ok(Math.abs(frontArea-.84)<1e-6,'cap area excludes the counter');
  assert.equal(mesh.outline.length,96,'both contours have front and rear outlines');
});

test('tilting and changing depth keeps the geographical pivot fixed and bottom on the ground',()=>{
  const bounds={minY:-.5,minZ:-.5};
  for(const tilt of [0,30,45,90,120,180])for(const depthMeters of [.1,30,120])for(const bearing of [0,90,247]){
    const value={heightMeters:300,depthMeters,tilt,bearing};
    const points=[];for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5])points.push(transform.point([x,y,z],value,bounds));
    assert.ok(Math.abs(Math.min(...points.map(p=>p[2])))<1e-9);
    const pivot=transform.point([0,0,0],value,bounds);
    assert.equal(Math.abs(pivot[0]),0);assert.equal(Math.abs(pivot[1]),0);
  }
  assert.ok(Math.abs(transform.point([0,.5,0],{heightMeters:300,depthMeters:30,tilt:90,bearing:0},bounds)[2]-300)<1e-9);
});

test('camera-facing angles align the front normal and yaw-only preserves tilt',()=>{
  for(const position of [[0,-500,300],[500,0,200],[-300,500,100],[100,100,-100],[0,0,300]]){
    const a=transform.facing(position,[0,0,0],73,'billboard'),b=a.bearing*Math.PI/180,t=a.tilt*Math.PI/180;
    const normal=[-Math.sin(t)*Math.sin(b),-Math.sin(t)*Math.cos(b),Math.cos(t)],length=Math.hypot(...position);
    assert.ok(normal.reduce((sum,n,i)=>sum+n*position[i]/length,0)>1-1e-12);
    assert.equal(transform.facing(position,[0,0,0],73,'yaw').tilt,73);
  }
});

test('orbit timing is independent of normal frame rate and bounds long frame gaps',()=>{
  for(const rate of [30,60,120]){let bearing=0;for(let i=0;i<rate*30;i++)bearing=transform.advanceOrbit(bearing,1/rate,30);assert.ok(Math.abs(bearing-360)<1e-8);}
  assert.equal(transform.advanceOrbit(0,60,30),1.2);
});
