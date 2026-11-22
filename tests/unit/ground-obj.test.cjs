const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const { buildSync } = require('esbuild');
const { Matrix4, Vector3 } = require('three');
const filename = path.resolve(__dirname, 'ground-obj.bundle.cjs');
const compiled = new Module(filename, module);
compiled._compile(buildSync({entryPoints:[path.resolve(__dirname, '../../src/scripts/ground-obj.js')],bundle:true,format:'cjs',platform:'node',write:false}).outputFiles[0].text, filename);
const { createOBJ } = compiled.exports;
const triangle = () => ({ position:new Float32Array([0,0,0, 1,0,0, 0,1,1]), normal:new Float32Array([0,-Math.SQRT1_2,Math.SQRT1_2, 0,-Math.SQRT1_2,Math.SQRT1_2, 0,-Math.SQRT1_2,Math.SQRT1_2]) });
const parse = text => Object.fromEntries(['v','vn','f'].map(kind => [kind,text.split('\n').filter(line=>line.startsWith(kind+' ')).map(line=>line.slice(kind.length+1).split(' ').map(value=>kind==='f'?Number(value.split('//')[0]):Number(value)))]));

test('OBJ preserves triangles in metres with correctly transformed normals and mirrored winding', async () => {
  for (const mirror of [1,-1]) {
    const mesh=triangle(),original=Array.from(mesh.position);
    const transform=new Matrix4().makeTranslation(4,5,6).multiply(new Matrix4().makeRotationZ(.4)).multiply(new Matrix4().makeScale(mirror*300,300,30));
    const text=await (await createOBJ(mesh,transform,{name:'B\n8'})).text(),result=parse(text);
    assert.equal(result.v.length,3);assert.equal(result.vn.length,3);assert.equal(result.f.length,1);
    for(let i=0;i<3;i++) {
      const expected=new Vector3().fromArray(mesh.position,i*3).applyMatrix4(transform).toArray();
      result.v[i].forEach((value,axis)=>assert.ok(Math.abs(value-expected[axis])<1e-6));
      assert.ok(Math.abs(Math.hypot(...result.vn[i])-1)<1e-6);
    }
    const [a,b,c]=result.f[0].map(index=>new Vector3(...result.v[index-1]));
    const face=b.sub(a).cross(c.sub(a)).normalize();
    assert.ok(face.dot(new Vector3(...result.vn[0]))>.99999,'normals point out of the exported face even after reflection');
    assert.deepEqual(Array.from(mesh.position),original,'export leaves mesh buffers intact');
    assert.match(text,/o B_8\n/);assert.match(text,/# Units: metres/);
    const {OBJLoader}=await import('three/addons/loaders/OBJLoader.js');
    const imported=new OBJLoader().parse(text);
    assert.equal(imported.children.length,1);
    assert.equal(imported.children[0].geometry.attributes.position.count,3,'a standard OBJ loader accepts the exported mesh');
  }
});

test('OBJ serialization yields repeatedly and rejects a changed object before creating a partial download',async()=>{
  const base=triangle(),mesh={position:new Float32Array(9*600),normal:new Float32Array(9*600)};
  for(let i=0;i<600;i++){mesh.position.set(base.position,i*9);mesh.normal.set(base.normal,i*9);}
  let yields=0;
  const blob=await createOBJ(mesh,new Matrix4(),{yieldControl:async()=>{yields++;}});
  assert.equal(parse(await blob.text()).f.length,600);assert.equal(yields,3);
  let current=true;
  await assert.rejects(createOBJ(mesh,new Matrix4(),{isCurrent:()=>current,yieldControl:async()=>{current=false;}}),/object changed/);
});

test('OBJ rejects malformed buffers, invalid coordinates and singular transforms',async()=>{
  await assert.rejects(createOBJ({position:[0],normal:[0]},new Matrix4()),/valid triangle/);
  await assert.rejects(createOBJ(triangle(),new Matrix4().makeScale(1,0,1)),/transform/);
  const invalid=triangle();invalid.position[0]=NaN;
  await assert.rejects(createOBJ(invalid,new Matrix4()),/non-finite/);
  const badNormal=triangle();badNormal.normal[0]=Infinity;
  await assert.rejects(createOBJ(badNormal,new Matrix4()),/invalid normal/);
});
