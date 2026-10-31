const {test}=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const {ExtrudeGeometry,Shape,Path}=require('three');
const bundle=require('esbuild').buildSync({entryPoints:[path.join(root,'src/workers/extrusion-entry.js')],bundle:true,format:'cjs',write:false}).outputFiles[0].text;
const context={exports:{},module:{exports:{}}};context.exports=context.module.exports;vm.runInNewContext(bundle,context);const build=context.module.exports.build;
function original(model){
  const {cx,cy,height}=model.bounds,shapes=[];
  for(const polygon of model.polygons){let shape;polygon.forEach((ring,index)=>{const p=index?new Path():new Shape();ring.forEach(([x,y],i)=>{const a=(x-cx)/height,b=(cy-y)/height;i?p.lineTo(a,b):p.moveTo(a,b);});if(index)shape.holes.push(p);else{shape=p;shapes.push(shape);}});}
  const g=new ExtrudeGeometry(shapes,{depth:1,steps:1,bevelEnabled:false,curveSegments:1});g.translate(0,0,-.5);g.computeBoundingBox();return g;
}
const ring=(x,y,w)=>[[x,y],[x+w,y],[x+w,y+w],[x,y+w],[x,y]];
const fixture={polygons:[[ring(0,0,20),ring(3,3,5).reverse()],[ring(30,0,8)]],bounds:{cx:19,cy:10,height:20}};
test('packed geometry preserves every ordered transparent triangle, normal and material',()=>{
  const expected=original(fixture),actual=build(fixture);
  assert.equal(actual.groups.length,expected.groups.length);assert.equal(actual.solidGroups.length,2);
  for(let i=0;i<expected.groups.length;i++){
    const a=actual.groups[i],b=expected.groups[i];assert.equal(a.materialIndex,b.materialIndex);assert.equal(a.count,b.count);
    for(const [attribute,array] of [['position',actual.position],['normal',actual.normal]]){
      assert.deepEqual(Array.from(array.subarray(a.start*3,(a.start+a.count)*3)),Array.from(expected.attributes[attribute].array.subarray(b.start*3,(b.start+b.count)*3)));
    }
  }
  assert.equal(actual.position.length,expected.attributes.position.array.length);
  assert.equal(actual.bytes,actual.position.byteLength+actual.normal.byteLength+actual.outline.byteLength);
  assert.deepEqual(JSON.parse(JSON.stringify(actual.bounds)),{minX:expected.boundingBox.min.x,maxX:expected.boundingBox.max.x,minY:expected.boundingBox.min.y,maxY:expected.boundingBox.max.y,minZ:expected.boundingBox.min.z,maxZ:expected.boundingBox.max.z});
  expected.dispose();
});
test('1000 islands use two solid groups while retaining all 2000 transparent ranges',()=>{
  const model={polygons:Array.from({length:1000},(_,i)=>[ring(i*2,0,1)]),bounds:{cx:1000,cy:.5,height:1}};
  const mesh=build(model);assert.equal(mesh.groups.length,2000);assert.equal(mesh.solidGroups.length,2);
  assert.equal(mesh.solidGroups.reduce((n,g)=>n+g.count,0),mesh.position.length/3);
  assert.equal(mesh.solidGroups[0].start,0);assert.equal(mesh.solidGroups[1].start,mesh.solidGroups[0].count);
});
test('solid toggles select batched ranges and restore the original transparent draw sequence',()=>{
  const source=fs.readFileSync(path.join(root,'src/scripts/ground-3d.js'),'utf8'),start=source.indexOf('    paint() {'),end=source.indexOf('    render(',start);
  const s={extrusionSolid:true,fill:'#fff',outline:'#000',opacity:.43,outlineWidth:2},data={solidGroups:[{start:0,count:3,materialIndex:0}],groups:[{start:3,count:3,materialIndex:1}]};
  const c=vm.createContext({state:()=>s,data,map:{getCanvas:()=>({width:100,height:100,clientWidth:100})},matrices:()=>({object:{}})});
  vm.runInContext('globalThis.layer={'+source.slice(start,end)+'};',c);
  const material=()=>({color:{set(){return this;},multiplyScalar(){return this;}}});
  Object.assign(c.layer,{ready:true,geometry:{},front:material(),side:material(),lineMaterial:{...material(),resolution:{set(){}}},lines:{},group:{matrix:{copy(){}}}});
  c.layer.paint();assert.equal(c.layer.geometry.groups,data.solidGroups);
  s.extrusionSolid=false;c.layer.paint();assert.equal(c.layer.geometry.groups,data.groups);assert.equal(c.layer.front.opacity,.43);
});
