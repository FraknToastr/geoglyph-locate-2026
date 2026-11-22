const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const fixture='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
for(const entry of ['http','disk','portable'])test(`permission grants recover a failed preset and render 3D (${entry})`,async({page})=>{
  test.skip(!fs.existsSync(fixture),'Installed fixture unavailable');
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.addInitScript(bytes=>{
    window.localFontRequests=0;
    window.queryLocalFonts=async()=>{window.localFontRequests++;return [{family:'Arial Unicode MS',fullName:'Arial Unicode MS',postscriptName:'ArialUnicodeMS',style:'Regular',blob:async()=>new Blob([Uint8Array.from(atob(bytes),c=>c.charCodeAt(0))])}];};
  },fs.readFileSync(fixture).toString('base64'));
  const url=entry==='http'?'/' :pathToFileURL(path.resolve(__dirname,entry==='disk'?'../../index.html':'../../dist/GeoGlyph.html')).href;
  await page.goto(url);await page.waitForFunction(()=>window.GeoGlyphMapEngine);
  const failed=await page.evaluate(async()=>{
    const record=GeoGlyphStudio.state.fonts.find(font=>font.name==='Arial Unicode MS');
    GeoGlyphStudio.state.selectedFontId=record.id;
    try{await GeoGlyphFontService.prepare(record);return false;}catch(error){return error.message.includes('Exact font bytes unavailable');}
  });expect(failed).toBe(true);
  await page.locator('#scanBtn').click();
  await expect.poll(()=>page.evaluate(()=>GeoGlyphFontService.localFonts().length)).toBe(1);
  await page.evaluate(async()=>{
    const record=GeoGlyphStudio.state.fonts.find(font=>font.name==='Arial Unicode MS'&&font.source==='preset');
    await GeoGlyphFontService.prepare(record);GeoGlyphMapEngine.refreshFonts();
    const s=GeoGlyphMapEngine.state;s.selectedFontId='geoglyph:'+record.id;s.mode='message';s.message='Geo';
    GeoGlyphMapEngine.showMap();
  });
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady&&!GeoGlyphMapEngine.state.rebuilding);
  const enabled=await page.evaluate(()=>GeoGlyphMapEngine.setModelMode(true));
  expect(enabled).toBe(true);
  expect(await page.evaluate(()=>({visible:GeoGlyph3D.isVisible(),requests:window.localFontRequests,key:GeoGlyphMapEngine.state.fontRecords.get(GeoGlyphMapEngine.state.selectedFontId).fontResourceKey}))).toEqual({visible:true,requests:1,key:'local:arialunicodems:regular'});
});

test('manual mode switches Fit committed artwork; mirroring reuses mesh and flips native emoji pixels',async({page})=>{
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphMapEngine);
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.locator('#mapFontFiles').setInputFiles(path.resolve(__dirname,'../../src/fonts/GILLUBCD.TTF'));
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.mode='message';s.message='Geo';GeoGlyphMapEngine.queueRebuild(false);});
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild&&GeoGlyphMapEngine.state.lastLocalModel);
  await page.evaluate(()=>{const map=GeoGlyphMapEngine.state.map,api=GeoGlyph3D;window.modeFits=0;window.GeoGlyph3D={...api,fitCurrent:(...args)=>{window.modeFits++;return api.fitCurrent(...args);}};const ease=map.easeTo.bind(map);map.easeTo=(...args)=>{window.modeFits++;return ease(...args);};});
  expect(await page.evaluate(()=>GeoGlyphMapEngine.setModelMode(true))).toBe(true);
  const before=await page.evaluate(async()=>({builds:(await GeoGlyphFontService.workerStats()).meshBuilds,model:GeoGlyphMapEngine.getLocalModel().renderKey,fits:window.modeFits}));
  expect(before.fits).toBe(1);
  await page.locator('#mapMirrorX').check();
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  const after=await page.evaluate(async()=>({builds:(await GeoGlyphFontService.workerStats()).meshBuilds,model:GeoGlyphMapEngine.getLocalModel().renderKey,mirror:GeoGlyphMapEngine.state.mirrorX}));
  expect(after).toEqual({builds:before.builds,model:before.model,mirror:true});
  expect(await page.evaluate(()=>GeoGlyphMapEngine.setModelMode(false))).toBe(true);
  await page.locator('#mapFontFiles').setInputFiles(path.resolve(__dirname,'../../src/fonts/seguiemj.ttf'));
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.message='😏';s.nativeColor=true;s.mirrorX=false;GeoGlyphMapEngine.queueRebuild(false);});
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild&&GeoGlyphMapEngine.state.lastRenderMode==='decal');
  const original=await page.evaluate(()=>{const c=document.getElementById('geoglyphGroundDecalCanvas');window.originalEmoji={width:c.width,height:c.height,pixels:c.getContext('2d').getImageData(0,0,c.width,c.height).data};return {width:c.width,height:c.height};});
  await page.evaluate(()=>GeoGlyphMapEngine.setMirrorX(true));
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  const comparison=await page.evaluate(()=>{const c=document.getElementById('geoglyphGroundDecalCanvas'),a=window.originalEmoji,b=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let diff=0,ink=0;for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++)for(let k=0;k<4;k++){if(a.pixels[(y*a.width+x)*4+k]!==b[(y*a.width+(a.width-1-x))*4+k])diff++;if(k===3&&a.pixels[(y*a.width+x)*4+k])ink++;}return {diff,ink,width:c.width,height:c.height};});
  expect(comparison.diff).toBe(0);expect(comparison.ink).toBeGreaterThan(0);expect(comparison.width).toBe(original.width);expect(comparison.height).toBe(original.height);
});
