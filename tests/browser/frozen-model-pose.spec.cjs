const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),{pathToFileURL}=require('node:url');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');

function expectHeld(before,after){
  expect(after.mode).toBe('fixed');expect(after.animation.orbiting).toBe(false);expect(after.animation.scheduled).toBe(false);
  expect(after.stateAngles).toEqual({bearing:before.renderedAngles.bearing%360,tilt:before.renderedAngles.tilt});
  expect(after.anchor).toEqual(before.anchor);expect(after.height).toBe(before.height);expect(after.depth).toBe(before.depth);
  expect(after.geometry).toEqual(before.geometry);
  after.world.forEach((value,i)=>expect(Math.abs(value-before.world[i])).toBeLessThan(1e-12));
}
async function rendered(page){
  await page.evaluate(()=>new Promise(resolve=>{const map=GeoGlyphMapEngine.state.map;map.once('render',resolve);map.triggerRepaint();}));
}
async function start(page,mode){
  if(!await page.locator('#geoglyphMapEditor').evaluate(node=>node.classList.contains('is-collapsed')))await page.locator('#mapEditorCollapseBtn').click();
  const frames=await page.evaluate(()=>GeoGlyph3D.stats().animation.frames);
  await page.locator('#mapQuick'+mode).click();
  await page.waitForFunction(n=>GeoGlyph3D.stats().animation.frames>n+3,frames);
}
async function moveCamera(page){
  await page.evaluate(()=>new Promise(resolve=>{
    const m=GeoGlyphMapEngine.state.map,c=m.getCenter();m.once('render',resolve);
    m.jumpTo({bearing:m.getBearing()+70,pitch:35,zoom:m.getZoom()-.1,center:[c.lng+.002,c.lat+.002]});
  }));
}

test('disk user interruptions freeze the last rendered Turn and Face pose through camera movement and edits',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../../index.html')).href);
  await page.waitForFunction(()=>window.GeoGlyph3D);await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.locator('#mapFontFiles').setInputFiles(path.resolve(__dirname,'../../src/fonts/GILLUBCD.TTF'));
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.fontRecords.get(GeoGlyphMapEngine.state.selectedFontId)?.source==='file'&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  await page.evaluate(async()=>{
    const s=GeoGlyphMapEngine.state;s.mode='arcgis';s.conferenceOverview=false;
    const drawn=await GeoGlyphMapEngine.applyConferenceCue({fontId:s.selectedFontId,message:'Where are you Josh?',hasNewContent:true,
      extrusionEnabled:true,nativeColor:false,height:3000,depth:300,animation:'yaw'});
    GeoGlyph3D.ensureOrbit('yaw',{framed:drawn.fitted});
    window.readPose=()=>{
      const s=GeoGlyphMapEngine.state,l=s.map.getLayer('geoglyph-extruded-font').implementation,a=GeoGlyph3D.stats();
      return {world:l.poseMatrices.geographic.clone().multiply(l.poseMatrices.object).elements.slice(),renderedAngles:{...l.renderedAngles},
        stateAngles:{bearing:s.bearing,tilt:s.extrusionTilt},anchor:{...s.anchor},height:s.baseHeightMeters,depth:s.extrusionDepthMeters,
        mode:s.orientationMode,animation:a.animation,geometry:{uploads:a.uploads,disposals:a.disposals,meshKey:a.meshKey}};
    };
  });
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.frames>4);
  const builds=await page.evaluate(async()=>(await GeoGlyphFontService.workerStats()).meshBuilds);
  const turn=await page.evaluate(()=>{const pose=readPose();GeoGlyphMapEngine.state.map.fire('dragstart',{originalEvent:{}});return pose;});
  await moveCamera(page);expectHeld(turn,await page.evaluate(()=>readPose()));
  await moveCamera(page);expectHeld(turn,await page.evaluate(()=>readPose()));
  await expect(page.locator('#map3DOrientation')).toHaveValue('fixed');
  await expect(page.locator('#mapBearing')).toHaveValue(String(turn.renderedAngles.bearing%360));

  await start(page,'Face');
  await page.evaluate(()=>document.getElementById('mapQuickFace').addEventListener('click',()=>{window.faceBeforeStop=readPose();},{capture:true,once:true}));
  await page.locator('#mapQuickFace').click();await rendered(page);
  const face=await page.evaluate(()=>faceBeforeStop);expect(face.renderedAngles.tilt).toBe(55);
  expectHeld(face,await page.evaluate(()=>readPose()));await moveCamera(page);expectHeld(face,await page.evaluate(()=>readPose()));

  await start(page,'Turn');
  await page.locator('#mapEditorCollapseBtn').click();
  await page.locator('#map3DTilt').evaluate(node=>{node.value='37';node.dispatchEvent(new Event('input',{bubbles:true}));});
  await rendered(page);await expect(page.locator('#map3DTilt')).toHaveValue('37');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.extrusionTilt)).toBe(37);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  await page.locator('#mapBearing').fill('123');
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.angles)).toEqual({bearing:123,tilt:37});

  await start(page,'Face');
  const exited=await page.evaluate(()=>{const pose=readPose();GeoGlyph3D.exitCamera();return pose;});
  await rendered(page);expectHeld(exited,await page.evaluate(()=>readPose()));
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getCenterClampedToGround())).toBe(true);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getCenterElevation())).toBe(0);
  expect(await page.evaluate(async()=>(await GeoGlyphFontService.workerStats()).meshBuilds)).toBe(builds);
  expect(errors).toEqual([]);
});
