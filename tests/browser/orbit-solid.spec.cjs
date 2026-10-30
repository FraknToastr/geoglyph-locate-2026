const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs');
const font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
async function settled(page){await page.waitForFunction(()=>{const s=GeoGlyphMapEngine.state;return !s.pendingBuild&&!s.rebuilding&&!s.map.isMoving()&&GeoGlyph3D.stats().animation.phase!=='framing';});}
async function open3D(page){
  test.skip(!fs.existsSync(font),'Optional installed font unavailable');
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphMapEngine&&document.getElementById('map3DOrbit'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);await settled(page);
  await page.evaluate(async bytes=>{await GeoGlyphMapEngine.importFonts([new File([Uint8Array.from(atob(bytes),c=>c.charCodeAt(0))],'fixture.ttf')],'file');},fs.readFileSync(font).toString('base64'));
  await settled(page);await page.locator('#map3DEnabled').check();await page.waitForFunction(()=>GeoGlyph3D.isVisible());await settled(page);
}
async function start(page){await page.locator('#map3DOrbit').click();await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');}
async function sample(page){return page.evaluate(()=>{
  const s=GeoGlyphMapEngine.state,m=s.map,b=GeoGlyph3D.getBounds(),a=GeoGlyph3D.stats().animation;
  const local=GeoGlyphGroundTransform.point([(b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2],{heightMeters:s.baseHeightMeters*s.relativeSize/100,depthMeters:s.extrusionDepthMeters,...a.angles},b);
  const origin=maplibregl.MercatorCoordinate.fromLngLat(s.anchor),u=origin.meterInMercatorCoordinateUnits(),c=[origin.x+local[0]*u,origin.y-local[1]*u,local[2]*u,1];
  const matrix=m.transform.getProjectionDataForCustomLayer().mainMatrix,out=[0,1,2,3].map(i=>c.reduce((sum,v,j)=>sum+matrix[j*4+i]*v,0));
  const cam=maplibregl.MercatorCoordinate.fromLngLat(m.transform.getCameraLngLat(),m.transform.getCameraAltitude()),v=[(cam.x-c[0])/u,(c[1]-cam.y)/u,(cam.z-c[2])/u],length=Math.hypot(...v);
  const bearing=a.angles.bearing*Math.PI/180,tilt=a.angles.tilt*Math.PI/180,normal=[-Math.sin(tilt)*Math.sin(bearing),-Math.sin(tilt)*Math.cos(bearing),Math.cos(tilt)];
  return {a,center:[out[0]/out[3],out[1]/out[3]],dot:normal.reduce((sum,n,i)=>sum+n*v[i]/length,0),anchor:{...s.anchor},savedBearing:s.bearing,savedTilt:s.extrusionTilt,uploads:GeoGlyph3D.stats().uploads};
});}

test('solid 3D has opaque depth-tested faces and preserves 2D opacity',async({page})=>{
  await open3D(page);await expect(page.locator('#map3DSolid')).toBeChecked();await expect(page.locator('#mapOpacity')).toBeDisabled();
  const material=()=>page.evaluate(()=>{const l=GeoGlyphMapEngine.state.map.getLayer('geoglyph-extruded-font').implementation;return {opacity:l.front.opacity,transparent:l.front.transparent,depthWrite:l.front.depthWrite,sideOpacity:l.side.opacity};});
  expect(await material()).toEqual({opacity:1,transparent:false,depthWrite:true,sideOpacity:1});
  await page.locator('#map3DSolid').uncheck();await page.locator('#mapOpacity').fill('0.35');
  expect((await material()).opacity).toBe(.35);expect((await material()).transparent).toBe(true);
  await page.locator('#map3DSolid').check();expect((await material()).opacity).toBe(1);
  for(const [width,height,theme] of [[1440,1000,'dark'],[390,844,'light']]){
    await page.setViewportSize({width,height});await page.locator(theme==='light'?'#themeLightBtn':'#themeDarkBtn').click();
    const inset=await page.locator('.map-3d-panel').evaluate(panel=>{const p=panel.getBoundingClientRect();return [...panel.querySelectorAll('input,select,button')].filter(n=>n.getBoundingClientRect().width).map(n=>{const r=n.getBoundingClientRect();return [r.left-p.left,p.right-r.right];});});
    for(const [left,right] of inset){expect(left).toBeGreaterThanOrEqual(7);expect(right).toBeGreaterThanOrEqual(7);}
  }
  await page.locator('#map3DEnabled').uncheck();await settled(page);await expect(page.locator('#mapOpacity')).toBeEnabled();
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.opacity)).toBe(.35);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getPaintProperty('geoglyph-ground-fill','fill-opacity'))).toBe(.35);
});

test('continuous orbit locks the elevated centre in all orientation modes without rebuilding',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await open3D(page);
  await page.locator('#map3DTilt').fill('72');const initial=await sample(page);const builds=(await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds;
  await start(page);await page.waitForFunction(()=>GeoGlyph3D.stats().animation.frames>5);
  for(const mode of ['fixed','yaw','billboard']){
    await page.locator('#map3DOrientation').selectOption(mode);const frames=(await sample(page)).a.frames;
    await page.waitForFunction(n=>GeoGlyph3D.stats().animation.frames>n+3,frames);const result=await sample(page);
    expect(Math.abs(result.center[0])).toBeLessThan(1e-7);expect(Math.abs(result.center[1])).toBeLessThan(1e-7);
    expect(result.anchor).toEqual(initial.anchor);expect(result.savedBearing).toBe(initial.savedBearing);expect(result.savedTilt).toBe(72);
    if(mode==='fixed')expect(result.a.angles.tilt).toBe(72);
    if(mode==='yaw'){expect(result.a.angles.tilt).toBe(72);expect(result.a.angles.bearing).toBeCloseTo(result.a.bearing);}
    if(mode==='billboard'){expect(result.dot).toBeGreaterThan(.9999);await expect(page.locator('#map3DTilt')).toBeDisabled();}
    expect(result.uploads).toBe(initial.uploads);
  }
  await page.locator('#map3DOrbitPeriod').fill('10');expect(await page.evaluate(()=>GeoGlyphMapEngine.state.orbitPeriodSeconds)).toBe(10);
  expect((await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds).toBe(builds);
  await page.locator('#map3DOrbit').click();expect((await sample(page)).a.scheduled).toBe(false);
  await page.locator('#map3DOrientation').selectOption('fixed');expect((await sample(page)).a.angles).toEqual({bearing:initial.savedBearing,tilt:72});expect(errors).toEqual([]);
});

test('navigation, edits and leaving Map stop the orbit and restore the ground camera',async({page})=>{
  await open3D(page);await start(page);await page.evaluate(()=>GeoGlyphMapEngine.state.map.fire('dragstart',{originalEvent:{}}));
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  await start(page);await page.locator('#map3DDepth').fill('80');expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.scheduled)).toBe(false);
  await expect(page.locator('#map3DDepth')).toHaveValue('80');
  await start(page);await page.locator('#map3DTilt').fill('40');expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.extrusionTilt)).toBe(40);await expect(page.locator('#map3DTilt')).toHaveValue('40');
  await start(page);await page.evaluate(()=>GeoGlyphMapEngine.showCanvas());
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getCenterElevation())).toBe(0);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getCenterClampedToGround())).toBe(true);
});

test('settings save preferences and camera elevation without restarting animation or changing legacy transparency',async({page})=>{
  await open3D(page);await page.locator('#map3DOrientation').selectOption('billboard');await page.locator('#map3DOrbitPeriod').fill('45');await start(page);
  const saved=await page.evaluate(()=>GeoGlyphUi.collectMapSettings());expect(saved.version).toBe(3);expect(saved.extrusionSolid).toBe(true);expect(saved.orientationMode).toBe('billboard');expect(saved.orbitPeriodSeconds).toBe(45);expect(saved.camera.elevation).toBeGreaterThan(0);
  expect(JSON.stringify(saved)).not.toMatch(/orbiting|scheduled|frames/);
  await page.evaluate(value=>GeoGlyphUi.applyMapSettings(value),saved);await settled(page);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getCenterElevation())).toBeCloseTo(saved.camera.elevation);
  await page.locator('#map3DEnabled').uncheck();await settled(page);expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getCenterElevation())).toBe(0);
  await page.evaluate(()=>GeoGlyphUi.applyMapSettings({version:2,extrusionEnabled:true,opacity:.4}));await settled(page);
  await expect(page.locator('#map3DSolid')).not.toBeChecked();expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getLayer('geoglyph-extruded-font').implementation.front.opacity)).toBe(.4);
});

test('exports freeze and resume orbit and automatic facing also works with manual camera changes',async({page})=>{
  await open3D(page);await page.locator('#map3DOrientation').selectOption('billboard');await start(page);
  for(const button of ['#mapSavePngBtn','#mapSaveJpgBtn']){
    const downloading=page.waitForEvent('download');await page.locator(button).click();const download=await downloading;
    expect(fs.statSync(await download.path()).size).toBeGreaterThan(1000);expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(true);
    await page.waitForFunction(()=>GeoGlyph3D.stats().animation.scheduled&&!GeoGlyph3D.stats().animation.paused);
  }
  await page.evaluate(()=>{GeoGlyph3D.stopOrbit();const m=GeoGlyphMapEngine.state.map;m.jumpTo({center:[138.602,-34.93],zoom:15,pitch:40,bearing:80});});await settled(page);
  expect((await sample(page)).dot).toBeGreaterThan(.9999);
});

test('undo changes solid rendering once without replaying intervening orbit frames',async({page})=>{
  await open3D(page);await start(page);await page.waitForFunction(()=>GeoGlyph3D.stats().animation.frames>10);
  await page.locator('#map3DSolid').uncheck();await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,0)));
  await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press('Control+z');
  await expect(page.locator('#map3DSolid')).toBeChecked();expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
});

test('reduced-motion preference never auto-starts orbit and explicit Start remains available',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await open3D(page);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  await start(page);await page.waitForFunction(()=>GeoGlyph3D.stats().animation.frames>2);
  await page.locator('#map3DEnabled').uncheck();await settled(page);expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.scheduled)).toBe(false);
});
