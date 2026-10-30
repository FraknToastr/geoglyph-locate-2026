const {test}=require('node:test');
const assert=require('node:assert/strict');
const {install}=require('../../src/scripts/basemap-coverage.js');
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
});
