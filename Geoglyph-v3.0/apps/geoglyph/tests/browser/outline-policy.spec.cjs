const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {fontBuffer}=require('../fixtures/overlapping-outline.cjs');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const fixtures=[
  {name:'synthetic overlapping font',bytes:fontBuffer()},
  {name:'portable synthetic overlapping font',bytes:fontBuffer(),standalone:true},
  ...['SitkaVF.ttf','SitkaVF-Italic.ttf'].map(name=>({name,file:'/mnt/c/Windows/Fonts/'+name}))
];

async function settled(page) {
  await page.waitForFunction(()=>{
    const s=GeoGlyphMapEngine.state;
    return !s.pendingBuild&&!s.rebuilding&&s.displayedFontId===s.selectedFontId&&s.committedSelection?.message==='A'&&s.committedSelection.quality===s.quality;
  });
}

async function inspectGeometry(page) {
  return page.evaluate(()=>{
    const s=GeoGlyphMapEngine.state,model=GeoGlyphMapEngine.getLocalModel(),g=GeoGlyphGeometry;
    const font=opentype.parse(window.outlineFixtureBuffer),glyph=font.charToGlyph('A');
    const component=g.flatten(glyph.getPath(0,0,1000).commands,model.tolerance)[1].slice(0,-1);
    const bridge=component.reduce((p,q)=>[p[0]+q[0]/component.length,p[1]+q[1]/component.length],[0,0]);
    bridge[0]-=glyph.advanceWidth*1000/font.unitsPerEm/2;
    const hole=model.polygons[0][1]?.slice(0,-1)||[];
    const counter=hole.reduce((p,q)=>[p[0]+q[0]/hole.length,p[1]+q[1]/hole.length],[0,0]);
    const filled=point=>model.polygons.some(p=>g.contains(point,p[0])&&!p.slice(1).some(r=>g.contains(point,r)));
    const area=model.polygons.reduce((sum,p)=>sum+Math.abs(g.area(p[0]))-p.slice(1).reduce((n,r)=>n+Math.abs(g.area(r)),0),0);
    const layer=s.map.getLayer('geoglyph-extruded-font')?.implementation;
    let mesh=null;
    if(layer) {
      const p=layer.geometry.attributes.position.array;
      const normalize=point=>[(point[0]-model.bounds.cx)/model.bounds.height,(model.bounds.cy-point[1])/model.bounds.height];
      const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
      const hits=point=>{
        point=normalize(point);
        for(let i=0;i<p.length;i+=9) {
          if(p[i+2]!==.5||p[i+5]!==.5||p[i+8]!==.5)continue;
          const a=[p[i],p[i+1]],b=[p[i+3],p[i+4]],c=[p[i+6],p[i+7]];
          if(Math.abs(cross(a,b,c))<1e-12)continue;
          const signs=[cross(a,b,point),cross(b,c,point),cross(c,a,point)];
          if(!(signs.some(v=>v < -1e-9)&&signs.some(v=>v > 1e-9)))return true;
        }
        return false;
      };
      let capArea=0;
      for(let i=0;i<p.length;i+=9)if(p[i+2]===.5&&p[i+5]===.5&&p[i+8]===.5)
        capArea+=Math.abs((p[i+3]-p[i])*(p[i+7]-p[i+1])-(p[i+6]-p[i])*(p[i+4]-p[i+1]))/2;
      mesh={bridge:hits(bridge),counter:hits(counter),capArea,finite:Array.from(p).every(Number.isFinite),outlineVertices:layer.lineGeometry.attributes.instanceStart.count};
    }
    return {
      mode:s.lastRenderMode,polygons:model.polygons.length,holes:hole.length?model.polygons[0].length-1:0,
      bridge:filled(bridge),counter:filled(counter),area:area/model.bounds.height**2,
      geoHoles:GeoGlyphMapEngine.getGeoJSON().features[0].geometry.coordinates.reduce((n,p)=>n+p.length-1,0),
      visible:GeoGlyph3D.isVisible(),groundVisibility:s.map.getLayoutProperty('geoglyph-ground-fill','visibility'),mesh
    };
  });
}

for(const fixture of fixtures)test(fixture.name+' keeps its crossbar and counter in vector 2D, GeoJSON and 3D',async({page})=>{
  test.skip(fixture.file&&!fs.existsSync(fixture.file),'Optional installed Sitka font unavailable');
  const bytes=fixture.bytes||fs.readFileSync(fixture.file);
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(fixture.standalone?pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphMapEngine&&window.GeoGlyph3D&&document.getElementById('map3DEnabled'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.evaluate(async b64=>{
    window.outlineFixtureBuffer=Uint8Array.from(atob(b64),c=>c.charCodeAt(0)).buffer;
    Object.assign(GeoGlyphMapEngine.state,{mode:'message',message:'A',tracking:0,fill:'#31A765',outline:'#FFFFFF',nativeColor:false});
    await GeoGlyphMapEngine.importFonts([new File([window.outlineFixtureBuffer],'outline-fixture.otf',{lastModified:1})],'file');
    await GeoGlyphMapEngine.rebuild();
  },bytes.toString('base64'));
  await settled(page);
  const anchor=await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}));
  for(const enabled of [false,true]) {
    await page.locator('#map3DEnabled').setChecked(enabled);
    for(const quality of [4,10,36]) {
      await page.evaluate(async quality=>{GeoGlyphMapEngine.state.quality=quality;await GeoGlyphMapEngine.rebuild();},quality);
      await settled(page);
      const result=await inspectGeometry(page);
      expect(result.mode).toBe('vector');expect(result.polygons).toBe(1);expect(result.holes).toBe(1);expect(result.geoHoles).toBe(1);
      expect(result.bridge).toBe(true);expect(result.counter).toBe(false);expect(result.visible).toBe(enabled);
      if(enabled) {
        expect(result.groundVisibility).toBe('none');expect(result.mesh.finite).toBe(true);
        expect(result.mesh.bridge).toBe(true);expect(result.mesh.counter).toBe(false);
        expect(result.mesh.capArea).toBeCloseTo(result.area,5);expect(result.mesh.outlineVertices).toBeGreaterThan(0);
      }
    }
  }
  const before=await page.evaluate(()=>GeoGlyphFontService.workerStats());
  await page.evaluate(async()=>{GeoGlyphMapEngine.state.quality=10;await GeoGlyphMapEngine.rebuild();});
  await settled(page);
  expect((await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds).toBe(before.meshBuilds);
  await page.locator('#map3DEnabled').uncheck();await settled(page);
  expect((await inspectGeometry(page)).bridge).toBe(true);
  expect(await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}))).toEqual(anchor);
});
