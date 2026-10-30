const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const emoji='/mnt/c/Windows/Fonts/seguiemj.ttf';
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
async function open(page,standalone=false){
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(standalone?pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphMapEngine&&window.GeoGlyph3D&&document.getElementById('map3DEnabled'));
}
async function show(page){await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);}
async function settled(page){await page.waitForFunction(()=>{const s=GeoGlyphMapEngine.state;return !s.pendingBuild&&!s.rebuilding&&!s.map.isMoving()&&GeoGlyph3D.stats().animation.phase!=='framing';});}
async function importFont(page,file=font){
  test.skip(!fs.existsSync(file),'Optional installed font unavailable');
  await page.evaluate(async b64=>{const file=new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],'fixture.ttf',{lastModified:1});await GeoGlyphMapEngine.importFonts([file],'file');},fs.readFileSync(file).toString('base64'));
  await settled(page);
}
async function anchor(page){return page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}));}

test('first Map entry fits once and camera changes never move vector or raster anchors',async({page})=>{
  await open(page);await show(page);await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitCount)).toBe(1);
  const initial=await anchor(page);
  for(const file of [null,font]){
    if(file)await importFont(page,file);
    await page.evaluate(()=>{const m=GeoGlyphMapEngine.state.map,c=m.getCenter();m.jumpTo({center:[c.lng+.02,c.lat+.01],zoom:m.getZoom()-2,pitch:45,bearing:30});});
    await settled(page);expect(await anchor(page)).toEqual(initial);
    await page.evaluate(()=>GeoGlyphMapEngine.fit());await settled(page);expect(await anchor(page)).toEqual(initial);
  }
  const camera=await page.evaluate(()=>({center:GeoGlyphMapEngine.state.map.getCenter(),zoom:GeoGlyphMapEngine.state.map.getZoom()}));
  await page.evaluate(()=>{GeoGlyphMapEngine.showCanvas();GeoGlyphMapEngine.showMap();});await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitCount)).toBe(1);
  expect(await page.evaluate(()=>({center:GeoGlyphMapEngine.state.map.getCenter(),zoom:GeoGlyphMapEngine.state.map.getZoom()}))).toEqual(camera);
  await page.evaluate(()=>GeoGlyphMapEngine.state.map.fire('click',{lngLat:{lng:138.61,lat:-34.93}}));await settled(page);
  expect(await anchor(page)).toEqual({lng:138.61,lat:-34.93});
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.mode='message';s.message='AB\nCD';s.baseHeightMeters=600;s.quality=30;GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  expect(await anchor(page)).toEqual({lng:138.61,lat:-34.93});
});

test('first fit survives an empty initial character and deliberate navigation cancels it',async({page})=>{
  await open(page);await page.evaluate(()=>{GeoGlyphStudio.state.selectedCode=32;GeoGlyphMapEngine.showMap();GeoGlyphMapEngine.state.selectedCode=32;GeoGlyphMapEngine.queueRebuild(false);});
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitStatus)).toBe('pending');
  await page.evaluate(()=>{GeoGlyphMapEngine.state.selectedCode=65;GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitCount)).toBe(1);
  await page.reload();await page.waitForFunction(()=>window.GeoGlyphMapEngine);
  await page.evaluate(()=>{GeoGlyphStudio.state.selectedCode=32;GeoGlyphMapEngine.showMap();GeoGlyphMapEngine.state.selectedCode=32;});
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.map.fire('zoomstart',{originalEvent:new WheelEvent('wheel')});s.selectedCode=65;GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitStatus)).toBe('cancelled');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitCount)).toBe(0);
});

test('3D depth, tilt, paint, camera and size edits reuse the mesh and preserve its anchor',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await open(page);await show(page);await settled(page);await importFont(page);
  const initial=await anchor(page);
  await page.locator('#map3DEnabled').check();await page.waitForFunction(()=>GeoGlyph3D.isVisible());await settled(page);
  const builds=(await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds;
  const uploads=await page.evaluate(()=>GeoGlyph3D.stats().uploads);
  await page.locator('#map3DDepth').fill('70');
  await page.locator('#map3DTilt').fill('45');
  await page.locator('#mapFill').fill('#ff3366');await page.locator('#mapOutlineWidth').fill('5');
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.baseHeightMeters=450;s.map.jumpTo({zoom:s.map.getZoom()-2,bearing:40});GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  expect((await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds).toBe(builds);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().uploads)).toBe(uploads);
  expect(await anchor(page)).toEqual(initial);
  await page.locator('#map3DTilt').fill('90');await page.locator('#map3DView').click();await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getPitch())).toBeCloseTo(55);
  expect(await anchor(page)).toEqual(initial);
  const implementation=await page.evaluate(()=>{const s=GeoGlyphMapEngine.state,l=s.map.getLayer('geoglyph-extruded-font').implementation;return {fill:l.front.color.getHexString(),width:l.lineMaterial.linewidth,hidden:s.map.getLayoutProperty('geoglyph-ground-fill','visibility')};});
  expect(implementation.fill).toBe('ff3366');expect(implementation.width).toBeGreaterThanOrEqual(5);expect(implementation.hidden).toBe('none');
  await page.locator('#map3DEnabled').uncheck();await settled(page);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().disposals)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getLayer('geoglyph-extruded-font'))).toBeFalsy();
  expect(errors).toEqual([]);
});

test('saved 3D settings restore their anchor and camera and older settings restore 2D',async({page})=>{
  await open(page);await show(page);await settled(page);await importFont(page);
  await page.locator('#map3DEnabled').check();await page.waitForFunction(()=>GeoGlyph3D.isVisible());await settled(page);
  await page.locator('#map3DDepth').fill('80');await page.locator('#map3DTilt').fill('35');
  const saved=await page.evaluate(()=>GeoGlyphUi.collectMapSettings());
  expect(saved.extrusionEnabled).toBe(true);expect(saved.extrusionDepthMeters).toBe(80);expect(saved.extrusionTilt).toBe(35);
  await page.evaluate(value=>{GeoGlyphMapEngine.state.map.jumpTo({center:[0,0],zoom:3});GeoGlyphUi.applyMapSettings(value);},saved);await settled(page);
  expect(await anchor(page)).toEqual(saved.anchor);expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(true);
  await page.evaluate(()=>GeoGlyphUi.applyMapSettings({version:1,anchor:{lng:139,lat:-35},anchorPinned:false}));await settled(page);
  expect(await anchor(page)).toEqual({lng:139,lat:-35});expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(false);
  await page.evaluate(()=>GeoGlyphMapEngine.state.map.jumpTo({center:[140,-36],zoom:5}));await settled(page);
  expect(await anchor(page)).toEqual({lng:139,lat:-35});
});

test('standalone 3D supports multiline text, exports, persistent resources and cleanup',async({page})=>{
  await open(page,true);await show(page);await settled(page);await importFont(page);
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.mode='message';s.message='BO\nAD';GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  await page.locator('#map3DEnabled').check();await page.waitForFunction(()=>GeoGlyph3D.isVisible());await settled(page);
  await page.locator('#map3DView').click();await settled(page);
  const uploads=await page.evaluate(()=>GeoGlyph3D.stats().uploads);
  for(const [button,extension] of [['#mapSavePngBtn','.png'],['#mapSaveJpgBtn','.jpg']]){
    const event=page.waitForEvent('download');await page.locator(button).click();const download=await event;
    expect(download.suggestedFilename()).toContain(extension);expect(fs.statSync(await download.path()).size).toBeGreaterThan(1000);
  }
  await page.evaluate(()=>{GeoGlyphMapEngine.state.message='NEW';GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().uploads)).toBeGreaterThan(uploads);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().disposals)).toBe(0);
  await page.evaluate(async()=>{const s=GeoGlyphMapEngine.state;s.message='OLD';const first=GeoGlyphMapEngine.rebuild();s.message='FINAL MESSAGE';const second=GeoGlyphMapEngine.rebuild();await Promise.all([first,second]);});await settled(page);
  const final=await page.evaluate(()=>({text:GeoGlyphMapEngine.getGeoJSON().features[0].properties.message,width:GeoGlyphMapEngine.getLocalModel().bounds.width/GeoGlyphMapEngine.getLocalModel().bounds.height,mesh:GeoGlyph3D.getBounds()}));
  expect(final.text).toBe('FINAL MESSAGE');expect(final.mesh.maxX-final.mesh.minX).toBeCloseTo(final.width,5);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().cache.entries)).toBeLessThanOrEqual(3);
  await page.locator('#map3DEnabled').uncheck();await settled(page);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().disposals)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().cache.entries)).toBe(0);
});

test('colour fonts remain styled in 2D with an explicit extrusion explanation',async({page})=>{
  await open(page);await show(page);await settled(page);await importFont(page,emoji);
  await page.locator('#map3DEnabled').check();await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.lastRenderMode)).toBe('decal');
  expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(false);
  await expect(page.locator('#map3DStatus')).toContainText('Choose an outline font');
  await expect(page.locator('#map3DView')).toBeDisabled();
});

test('3D depth participates in undo and controls fit smaller dark and light viewports',async({page})=>{
  await open(page);await show(page);await settled(page);await importFont(page);
  await page.locator('#map3DEnabled').check();await page.waitForFunction(()=>GeoGlyph3D.isVisible());await settled(page);
  for(const value of [25,65])await page.evaluate(async value=>{const input=document.getElementById('map3DDepth');input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(resolve=>setTimeout(resolve,0));},value);
  await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press('Control+z');
  await expect.poll(()=>page.evaluate(()=>GeoGlyphMapEngine.state.extrusionDepthMeters)).toBe(25);
  await settled(page);expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(true);
  await page.keyboard.press('Control+y');await expect.poll(()=>page.evaluate(()=>GeoGlyphMapEngine.state.extrusionDepthMeters)).toBe(65);await settled(page);
  for(const [width,height,theme] of [[1024,768,'dark'],[390,844,'light']]){
    await page.setViewportSize({width,height});await page.locator(theme==='light'?'#themeLightBtn':'#themeDarkBtn').click();
    const layout=await page.locator('.map-3d-panel').evaluate(panel=>({width:panel.clientWidth,scroll:panel.scrollWidth,range:panel.querySelector('input[type=range]').getBoundingClientRect().width}));
    expect(layout.scroll).toBeLessThanOrEqual(layout.width+1);expect(layout.range).toBeGreaterThan(40);
  }
});

test('settings loaded before first Map entry retain their camera and anchor',async({page})=>{
  await open(page);
  await page.evaluate(()=>{GeoGlyphUi.applyMapSettings({version:1,anchor:{lng:139,lat:-35},anchorPinned:false,camera:{lng:139.02,lat:-35.01,zoom:12,pitch:30,bearing:25}});GeoGlyphMapEngine.showMap();});
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);await settled(page);
  expect(await anchor(page)).toEqual({lng:139,lat:-35});
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.initialFitCount)).toBe(0);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getZoom())).toBeCloseTo(12);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getPitch())).toBeCloseTo(30);
});
