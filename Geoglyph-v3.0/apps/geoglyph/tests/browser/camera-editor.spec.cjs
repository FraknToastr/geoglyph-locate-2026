const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),{pathToFileURL}=require('node:url');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
async function open(page,{portable=false,width=1440}={}){
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width,height:1000});
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(portable?pathToFileURL(path.resolve(__dirname,'../../GeoGlyph_Locate_2026.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphScripts&&window.GeoGlyphMapEngine);
  await page.locator('#geoglyphPreviewBtn').click();
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  await page.locator('[data-map-mode="arcgis"]').click();
  await page.locator('#mapScriptNew').click();
  return errors;
}
async function cameraModal(page){
  await page.locator('[data-add-action]').click();await page.locator('[data-choose-action="camera"]').click();
  await page.locator('#scriptValue').selectOption('flight');
}
async function clickLocation(page,x=.45,y=.35){
  await expect.poll(()=>page.evaluate(()=>Math.abs(GeoGlyphMapEngine.state.map.getCanvas().clientWidth-document.getElementById('geoglyphMapWorkspace').clientWidth))).toBeLessThan(2);
  const canvas=page.locator('#geoglyphMap canvas.maplibregl-canvas'),box=await canvas.boundingBox();
  const position={x:Math.round(box.x+box.width*x),y:Math.round(box.y+box.height*y)};
  const expected=await page.evaluate(({x,y})=>{const map=GeoGlyphMapEngine.state.map,rect=map.getCanvas().getBoundingClientRect(),point=map.unproject([x-rect.left,y-rect.top]);return {...GeoGlyphMapEngine.captureCameraView(),center:[point.wrap().lng,point.lat]};},position);
  await page.mouse.click(position.x,position.y);
  return expected;
}
async function view(page){return page.evaluate(()=>GeoGlyphMapEngine.captureCameraView());}
function sameView(actual,expected){
  for(const key of ['zoom','pitch','bearing'])expect(actual[key],key).toBeCloseTo(expected[key],4);
  actual.center.forEach((value,i)=>expect(value,'centre '+i).toBeCloseTo(expected.center[i],4));
}

for(const settings of [{portable:false,width:1440},{portable:true,width:390}])test(`camera points support map picking, modal return, preview and JSON playback (${settings.portable?'standalone narrow':'HTTP desktop'})`,async({page})=>{
  const errors=await open(page,settings),before=await page.evaluate(()=>({anchor:{...GeoGlyphMapEngine.state.anchor},extrusion:GeoGlyphMapEngine.state.extrusionEnabled}));
  await cameraModal(page);await page.locator('#scriptCameraDuration').fill('0.5');
  await expect(page.locator('[data-apply]')).toBeDisabled();
  await page.locator('#scriptCameraPickStart').click();await expect(page.locator('#mapScriptDialog')).toBeHidden();await expect(page.locator('#mapControlSidebar')).toBeHidden();
  await page.locator('[data-camera-return]').click();await expect(page.locator('#mapScriptDialog')).toBeVisible();await expect(page.locator('#scriptCameraDuration')).toHaveValue('0.5');
  await expect(page.locator('#scriptCameraStartSummary')).toHaveText('Not selected');
  await page.locator('#scriptCameraPickStart').click();
  await page.evaluate(()=>GeoGlyphMapEngine.restoreCameraView({center:[138,-30],zoom:7,pitch:0,bearing:10}));
  const start=await clickLocation(page);await expect(page.locator('.script-camera-marker.is-start')).toHaveCount(1);
  // A click between picks must never move the artwork.
  await clickLocation(page,.6,.4);
  await page.locator('[data-camera-pick="end"]').click();
  await page.getByRole('button',{name:'Toggle 2D / 3D map pitch'}).click();
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.map.getPitch()>54&&!GeoGlyphMapEngine.state.map.isMoving());
  await page.evaluate(()=>GeoGlyphMapEngine.state.map.jumpTo({zoom:8,bearing:35}));
  const end=await clickLocation(page,.55,.3);await expect(page.locator('.script-camera-marker')).toHaveCount(2);
  await page.screenshot({path:`/tmp/geoglyph-camera-map-${settings.width}.png`});
  await page.locator('[data-camera-return]').click();await expect(page.locator('#mapScriptDialog')).toBeVisible();await expect(page.locator('#mapControlSidebar')).toBeVisible();
  await page.screenshot({path:`/tmp/geoglyph-camera-modal-${settings.width}.png`});
  await expect(page.locator('#scriptCameraEndSummary')).toContainText('3D');await expect(page.locator('#scriptCameraDuration')).toHaveValue('0.5');
  expect(await page.evaluate(()=>GeoGlyphScripts.getDraft().rows[0].actions)).toEqual([]);
  await page.locator('#scriptCameraPreview').click();await expect(page.locator('#scriptCameraToolbar')).toBeVisible();
  await expect(page.locator('#mapScriptDialog')).toBeVisible({timeout:10000});sameView(await view(page),end);
  await page.locator('[data-apply]').click();await expect(page.locator('#mapScriptDialog')).toBeHidden();
  const saved=await page.evaluate(()=>JSON.parse(GeoGlyphScripts.serialize()));
  expect(saved.rows[0].actions[0].type).toBe('camera');sameView(saved.rows[0].actions[0].value.start,start);sameView(saved.rows[0].actions[0].value.end,end);
  await page.locator('#mapScriptFile').setInputFiles({name:'camera-flight.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await page.locator('#mapScriptPlay').click();await page.waitForFunction(()=>GeoGlyphScripts.state().phase==='waiting'||GeoGlyphScripts.state().error);
  expect(await page.evaluate(()=>GeoGlyphScripts.state().error)).toBe('');sameView(await view(page),end);
  expect(await page.evaluate(()=>({anchor:{...GeoGlyphMapEngine.state.anchor},extrusion:GeoGlyphMapEngine.state.extrusionEnabled}))).toEqual(before);
  await page.locator('#mapScriptStop').click();expect(errors).toEqual([]);
});

test('camera editor cancellation discards uncommitted picks, restores the view and removes click guards',async({page})=>{
  const errors=await open(page);await page.evaluate(()=>GeoGlyphMapEngine.restoreCameraView({center:[140,-30],zoom:6,pitch:25,bearing:20}));
  const original=await view(page),draft=await page.evaluate(()=>GeoGlyphScripts.getDraft());
  for(const cancel of ['button','escape','map-exit']){
    if(cancel==='map-exit'){await page.locator('#geoglyphPreviewBtn').click();await page.locator('[data-map-mode="arcgis"]').click();}
    await cameraModal(page);await page.locator('#scriptCameraPickStart').click();await clickLocation(page);
    if(cancel==='button')await page.locator('[data-camera-cancel]').click();
    else if(cancel==='escape')await page.keyboard.press('Escape');
    else await page.locator('#mapCanvasToggleBtn').click();
    await expect(page.locator('#mapScriptDialog')).toBeHidden();await expect(page.locator('#scriptCameraToolbar')).toHaveCount(0);await expect(page.locator('.script-camera-marker')).toHaveCount(0);
    sameView(await view(page),original);expect(await page.evaluate(()=>GeoGlyphScripts.getDraft())).toEqual(draft);
  }
  await page.locator('#geoglyphPreviewBtn').click();const anchor=await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}));await clickLocation(page,.5,.45);
  expect(await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}))).not.toEqual(anchor);expect(errors).toEqual([]);
});

test('closing a camera preview never reopens its modal after the animation settles',async({page})=>{
  const errors=await open(page),original=await view(page);
  const flight={type:'flight',start:{center:[130,-30],zoom:5,pitch:0,bearing:0},end:{center:[145,-40],zoom:8,pitch:55,bearing:30},duration:1};
  await page.evaluate(flight=>{const draft=GeoGlyphScripts.getDraft();draft.rows[0].actions=[{type:'camera',value:flight}];GeoGlyphScripts.setDraft(draft);},flight);
  await page.locator('[data-edit-action]').click();await page.locator('#scriptCameraPreview').click();
  await expect(page.locator('#scriptCameraToolbar')).toBeVisible();await page.locator('[data-camera-cancel]').click();
  await page.waitForTimeout(1100);await expect(page.locator('#mapScriptDialog')).toBeHidden();await expect(page.locator('#scriptCameraToolbar')).toHaveCount(0);sameView(await view(page),original);expect(errors).toEqual([]);
});
