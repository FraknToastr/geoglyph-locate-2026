const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const geometry=require('../../src/scripts/ground-geometry.js');
const clip=require('../../src/vendor/polygon-clipping.js');
const opentype=require('../../src/vendor/opentype.js');
const {contours,fontFor,fontBuffer}=require('../fixtures/overlapping-outline.cjs');
globalThis.polygonClipping=clip;
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(require.resolve('../../src/vendor/extrusion-worker.js'),'utf8'),context);
const area=polygons=>polygons.reduce((sum,p)=>sum+Math.abs(geometry.area(p[0]))-p.slice(1).reduce((n,r)=>n+Math.abs(geometry.area(r)),0),0);
const filled=(polygons,point)=>polygons.some(p=>geometry.contains(point,p[0])&&!p.slice(1).some(r=>geometry.contains(point,r)));
const square=(x,y,n)=>[[x,y],[x+n,y],[x+n,y+n],[x,y+n],[x,y]];

function frontArea(mesh) {
  let area=0;const p=mesh.position;
  for(let i=0;i<p.length;i+=9)if(p[i+2]===.5&&p[i+5]===.5&&p[i+8]===.5)
    area+=Math.abs((p[i+3]-p[i])*(p[i+7]-p[i+1])-(p[i+6]-p[i])*(p[i+4]-p[i+1]))/2;
  return area;
}

test('overlapping components retain the bridge and counter for either contour order and winding',()=>{
  for(const reverseOrder of [false,true])for(const reverseWinding of [false,true]) {
    const rings=contours();if(reverseOrder)rings.reverse();if(reverseWinding)rings.forEach(r=>r.reverse());
    const model=geometry.model(fontFor(rings),'A');
    assert.equal(model.polygons.length,1);
    assert.equal(model.polygons[0].length,2,'the union forms one genuine counter');
    assert.equal(area(model.polygons),140);
    assert.ok(filled(model.polygons,[-3,11]),'the bridge spans the gap between the legs');
    assert.ok(!filled(model.polygons,[-3,5]),'the counter stays empty');
    assert.ok(!filled(model.polygons,[-3,16]),'the lower opening stays empty');
    const perimeter=model.polygons.reduce((sum,p)=>sum+p.reduce((n,r)=>n+r.slice(1).reduce((length,q,i)=>length+Math.hypot(q[0]-r[i][0],q[1]-r[i][1]),0),0),0);
    assert.equal(perimeter,98,'component overlap leaves no internal outline seams');
  }
});

test('nonzero nesting, disconnected contours and unsafe intersections keep their policy',()=>{
  const nested=geometry.classify([square(0,0,20),square(3,3,14).reverse(),square(6,6,3),square(30,0,4).reverse()]);
  assert.equal(area(nested),229);
  const redundant=geometry.classify([square(0,0,20),square(3,3,14)]);
  assert.equal(area(redundant),400,'same-direction enclosed contours do not become holes');
  assert.throws(()=>geometry.classify([square(0,0,20),square(15,3,10).reverse()]),/styled raster/);
  assert.throws(()=>geometry.classify([square(0,0,20),square(0,3,10).reverse()]),/styled raster/,'touching counters still use the safe fallback');
  assert.throws(()=>geometry.classify([[[0,0],[10,10],[0,10],[6,0],[0,0]]]),/self-crossing/);
});

test('corrected models retain their geometry across quality, repeated layout and cache reuse',()=>{
  const font=fontFor(contours());let first;
  for(const quality of [4,10,36]) {
    const model=geometry.model(font,'AAA',{quality});
    assert.equal(area(model.polygons),420);
    assert.equal(model.polygons.length,3);
    assert.ok(model.polygons.every(p=>p.length===2));
    if(first)assert.deepEqual(model.bounds,first.bounds);else first=model;
    assert.deepEqual(geometry.model(font,'AAA',{quality}).polygons,model.polygons);
  }
  assert.equal(geometry.cacheStats(font).pathBuilds,1);
});

test('a portable real font preserves the overlapping component through parsing and extrusion',()=>{
  const bytes=fontBuffer();
  const font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
  const model=geometry.model(font,'A');
  assert.equal(model.polygons[0].length,2);
  assert.equal(area(model.polygons),224000);
  const mesh=context.GeoGlyphMesh.build(model);
  assert.ok(Array.from(mesh.position).every(Number.isFinite));
  assert.ok(Array.from(mesh.normal).every(Number.isFinite));
  assert.ok(Math.abs(frontArea(mesh)-.35)<1e-6,'the cap includes the bridge and excludes the counter');
  assert.ok(mesh.outline.length>0);
  assert.ok(Math.abs(mesh.outline.reduce((sum,value,i,a)=>i%6?sum:sum+Math.hypot(a[i+3]-value,a[i+4]-a[i+1],a[i+5]-a[i+2]),0)-9.8)<1e-6,'both faces outline the dissolved perimeter');
});

for(const name of ['SitkaVF.ttf','SitkaVF-Italic.ttf'])test(name+' keeps A counters, repeated letters and ADELAIDE at every quality',{skip:!fs.existsSync('/mnt/c/Windows/Fonts/'+name)},()=>{
  const bytes=fs.readFileSync('/mnt/c/Windows/Fonts/'+name);
  const font=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
  const glyph=font.charToGlyph('A');
  for(const quality of [4,10,36]) {
    const model=geometry.model(font,'A',{quality});
    const rings=geometry.flatten(glyph.getPath(0,0,1000).commands,model.tolerance);
    const expected=clip.union(...rings.map(r=>[r]));
    assert.equal(model.polygons.length,1);assert.equal(model.polygons[0].length,2);
    assert.ok(Math.abs(area(model.polygons)-area(expected))<1e-6);
    for(const text of ['AAA','ADELAIDE']) {
      const word=geometry.model(font,text,{quality});
      assert.deepEqual(word.missing,[]);
      assert.ok(word.polygons.reduce((n,p)=>n+p.length-1,0)>=text.split('A').length-1);
      const mesh=context.GeoGlyphMesh.build(word);
      assert.ok(Array.from(mesh.position).every(Number.isFinite));
      assert.ok(Math.abs(frontArea(mesh)-area(word.polygons)/word.bounds.height**2)<1e-5);
    }
  }
});
