const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs');
const font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
test('solid material batching reduces actual draws with identical pixels and unchanged transparent order',async({page})=>{
  test.skip(!fs.existsSync(font),'Optional installed fixture font unavailable');
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphMapEngine&&document.getElementById('map3DEnabled'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.evaluate(async bytes=>{
    await GeoGlyphMapEngine.importFonts([new File([Uint8Array.from(atob(bytes),c=>c.charCodeAt(0))],'fixture.ttf')],'file');
    const s=GeoGlyphMapEngine.state;s.mode='message';s.message=('GEOGLYPH LIVE VISUALISATION ').repeat(8).trim();GeoGlyphMapEngine.queueRebuild(false);
  },fs.readFileSync(font).toString('base64'));
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  await page.locator('#map3DEnabled').evaluate(el=>{el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));});
  await page.waitForFunction(()=>GeoGlyph3D.isVisible()&&!GeoGlyphMapEngine.state.rebuilding);
  await page.evaluate(()=>GeoGlyphMapEngine.fit());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.map.loaded()&&!GeoGlyphMapEngine.state.map.isMoving()&&GeoGlyph3D.stats().animation.phase!=='framing');
  const result=await page.evaluate(async()=>{
    const s=GeoGlyphMapEngine.state,map=s.map,l=map.getLayer('geoglyph-extruded-font').implementation;
    s.extrusionSolid=false;GeoGlyph3D.syncVisibility();const originalGroups=l.geometry.groups;
    const actualPaint=l.paint;let forceOriginal=false;
    l.paint=function(){actualPaint.call(this);if(forceOriginal)this.geometry.groups=originalGroups;};
    const frame=()=>new Promise(resolve=>{map.once('render',()=>{const gl=l.renderer.getContext(),pixels=new Uint8Array(gl.drawingBufferWidth*gl.drawingBufferHeight*4);gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,pixels);resolve({pixels,calls:l.renderer.info.render.calls});});map.triggerRepaint();});
    const differences=(a,b)=>{let changed=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])changed++;return changed;};
    try{
      s.extrusionSolid=true;forceOriginal=true;const solidBaseline=await frame();
      forceOriginal=false;const solidCandidate=await frame();
      s.extrusionSolid=false;forceOriginal=true;const transparentBaseline=await frame();
      forceOriginal=false;const transparentCandidate=await frame();
      return {groups:originalGroups.length,solidBefore:solidBaseline.calls,solidAfter:solidCandidate.calls,
        solidDifferences:differences(solidBaseline.pixels,solidCandidate.pixels),transparentBefore:transparentBaseline.calls,
        transparentAfter:transparentCandidate.calls,transparentDifferences:differences(transparentBaseline.pixels,transparentCandidate.pixels)};
    }finally{l.paint=actualPaint;}
  });
  expect(result.groups).toBeGreaterThan(100);expect(result.solidBefore).toBe(result.groups+1);expect(result.solidAfter).toBe(3);
  expect(result.solidDifferences).toBe(0);expect(result.transparentAfter).toBe(result.transparentBefore);expect(result.transparentDifferences).toBe(0);
  expect(errors).toEqual([]);
});
