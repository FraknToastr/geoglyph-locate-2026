const {test}=require('node:test');
const assert=require('node:assert/strict');
const {install,preserveCameraTarget}=require('../../src/scripts/basemap-coverage.js');
function fixture(){
 const calls=[],provider={getTileAABB(...args){calls.push(args);return args;}};
 const transform={_helper:{_farZ:100},autoCalculateNearFarZ:true,
  _calculateNearFarZIfNeeded(value){if(this.autoCalculateNearFarZ)this._helper._farZ=value;return 'native';},
  getCoveringTilesDetailsProvider(){return provider;}};
 let remove;
 return {transform,provider,calls,map:{transform,once(event,fn){assert.equal(event,'remove');remove=fn;}},remove:()=>remove()};
}
test('coverage extends each automatic far calculation once and respects manual clipping',()=>{
 const f=fixture(),original=f.transform._calculateNearFarZIfNeeded;
 assert.equal(install(f.map),true);assert.equal(install(f.map),true);
 assert.equal(f.transform._calculateNearFarZIfNeeded(100),'native');assert.ok(Math.abs(f.transform._helper._farZ-110)<1e-9);
 f.transform._calculateNearFarZIfNeeded(200);assert.ok(Math.abs(f.transform._helper._farZ-220)<1e-9);
 f.transform.autoCalculateNearFarZ=false;f.transform._calculateNearFarZIfNeeded(800);assert.ok(Math.abs(f.transform._helper._farZ-220)<1e-9);
 f.remove();assert.equal(f.transform._calculateNearFarZIfNeeded,original);
});
test('flat basemap bounds stay at ground level; terrain and other arguments survive',()=>{
 const f=fixture(),original=f.provider.getTileAABB,id={z:10,x:4,y:5},terrain={terrain:{}};
 install(f.map);
 assert.deepEqual(f.provider.getTileAABB(id,2,900,{}),[id,2,0,{}]);
 assert.deepEqual(f.provider.getTileAABB(id,2,900,terrain),[id,2,900,terrain]);
 f.remove();assert.equal(f.provider.getTileAABB,original);
});
test('unsupported transforms are left untouched',()=>{
 assert.equal(install(null),false);assert.equal(install({transform:{}}),false);
 assert.equal(preserveCameraTarget(null),null);assert.equal(preserveCameraTarget({}),null);
});

// Exercise the pinned transform itself: the adapter depends on its private
// interface, and a simplified stub would miss the native viewport zoom floor.
function bundledTransform(){
 const fs=require('node:fs'),Module=require('node:module');
 const file=require.resolve('../../src/vendor/geoglyph-maplibre-v530-vendor.js');
 const source=fs.readFileSync(file,'utf8'),marker='e.createTileMesh=Wt';
 assert.ok(source.includes(marker),'Bundled MapLibre transform export hook changed');
 const bundled=new Module(file,module);bundled.filename=file;bundled.paths=module.paths;
 bundled._compile(source.replace(marker,'e.GeoglyphTestTransform=Dt,'+marker),file);
 const lib=bundled.exports;
 const transform=new lib.GeoglyphTestTransform(0,22,0,60,false);
 transform.resize(300,914);transform.setPitch(55);
 return {transform,lib};
}

test('elevated cameras retain their target and min/max zoom while normal Map bounds stay native',()=>{
 const {transform,lib}=bundledTransform(),target=new lib.LngLat(138.602,-34.93);
 const native=transform.getConstrained,calculate=transform._calculateNearFarZIfNeeded;
 const provider=transform.getCoveringTilesDetailsProvider(),tileAABB=provider.getTileAABB;
 let clamped=true,remove;
 const map={transform,getCenterClampedToGround:()=>clamped,once(event,callback){assert.equal(event,'remove');remove=callback;}};
 assert.equal(install(map),true);
 const nativeResult=native.call(transform,target,.5);
 assert.deepEqual(transform.getConstrained(target,.5),nativeResult);
 transform.setZoom(.5);transform.setCenter(target);
 assert.ok(Math.abs(transform.zoom-Math.log2(914/512))<1e-6);
 assert.ok(Math.abs(transform.center.lng-120.919037199)<1e-6);
 assert.ok(Math.abs(transform.center.lat)<1e-5);

 clamped=false;transform.setZoom(.5);transform.setCenter(target);
 assert.equal(transform.zoom,.5);assert.deepEqual(transform.center,target);
 assert.equal(transform.renderWorldCopies,false);
 transform.setMinZoom(.25);transform.setMaxZoom(3);
 transform.setZoom(-5);assert.equal(transform.zoom,.25);
 transform.setZoom(25);assert.equal(transform.zoom,3);
 assert.deepEqual(transform.center,target);
 const polar=transform.getConstrained(new lib.LngLat(138.602,89),1);
 assert.equal(polar.center.lat,85.051129);assert.equal(polar.zoom,1);

 transform.setMaxZoom(22);transform.setMaxBounds(new lib.LngLatBounds([120,-50],[150,-20]));
 const outside=new lib.LngLat(10,10);
 assert.deepEqual(transform.getConstrained(outside,7),native.call(transform,outside,7));
 transform.setMaxBounds(null);clamped=true;
 assert.deepEqual(transform.getConstrained(target,.5),native.call(transform,target,.5));
 remove();
 assert.equal(transform.getConstrained,native);
 assert.equal(transform._calculateNearFarZIfNeeded,calculate);assert.equal(provider.getTileAABB,tileAABB);
});

test('projection clones retain low-zoom targets without enabling world copies',()=>{
 const {transform,lib}=bundledTransform(),clone=transform.clone(),target=new lib.LngLat(138.602,-34.93);
 const native=clone.getConstrained,restore=preserveCameraTarget(clone);
 clone.setZoom(.5);clone.setCenter(target);
 assert.equal(clone.zoom,.5);assert.deepEqual(clone.center,target);
 assert.equal(clone.renderWorldCopies,false);assert.equal(transform.getConstrained,native);
 restore();assert.equal(clone.getConstrained,native);
});
