const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/geoglyph-map-engine-inline.js'),'utf8');
class MercatorCoordinate {
  constructor(x,y){this.x=x;this.y=y;}
  static fromLngLat([x,y]){return new MercatorCoordinate(x,y);}
  meterInMercatorCoordinateUnits(){return 1;}
  toLngLat(){return {lng:this.x,lat:this.y};}
}
test('horizontal reflection retains polygon/hole winding, anchor and source geometry',()=>{
  const context=vm.createContext({window:{maplibregl:{MercatorCoordinate}},mapState:{mirrorX:false}});
  const start=source.indexOf('  function projectPolygons('),end=source.indexOf('  let manualModelVersion',start);
  vm.runInContext(source.slice(start,end)+';globalThis.project=projectPolygons;',context);
  const polygons=[[[[-3,-2],[3,-2],[3,2],[-3,2],[-3,-2]],[[-1,-1],[-1,1],[1,1],[1,-1],[-1,-1]]]],snapshot=JSON.stringify(polygons);
  const args=[polygons,{cx:0,cy:0},2,0,{lng:10,lat:20}],a=context.project(...args,false),b=context.project(...args,true);
  const area=ring=>ring.slice(1).reduce((sum,p,i)=>sum+ring[i][0]*p[1]-p[0]*ring[i][1],0)/2;
  for(let i=0;i<2;i++){
    assert.equal(area(a[0][i]),area(b[0][i]));
    const reverse=[...a[0][i]].reverse();
    b[0][i].forEach((p,j)=>{assert.equal(p[0],20-reverse[j][0]);assert.equal(p[1],reverse[j][1]);});
  }
  assert.equal(JSON.stringify(polygons),snapshot);
});
