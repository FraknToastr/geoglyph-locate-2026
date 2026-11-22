const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const start={center:[138.6,-34.93],zoom:7,pitch:0,bearing:0};
const end={center:[147.33,-42.88],zoom:8,pitch:55,bearing:35};
const flight=(duration=.7)=>({type:'flight',start,end,duration});
const script=rows=>({version:1,title:'Camera playback fixture',rows:rows.map((row,index)=>({id:'camera-'+index,message:'',duration:30,actions:[],...row}))});
async function open(page,{portable=false,camera}={}){
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(portable?pathToFileURL(path.resolve(__dirname,'../../GeoGlyph_Locate_2026.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphScripts&&window.GeoGlyphMapEngine?.playCameraFlight);
  if(camera)await page.evaluate(camera=>{GeoGlyphMapEngine.state.restoredCamera=camera;},camera);
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>{const s=GeoGlyphMapEngine.state;return s.mapReady&&!s.rebuilding&&!s.pendingBuild&&!s.map.isMoving();});
  await page.locator('[data-map-mode="arcgis"]').click();
  return errors;
}
const capture=page=>page.evaluate(()=>GeoGlyphMapEngine.captureCameraView());
async function expectView(page,view){
  const current=await capture(page);
  for(let index=0;index<2;index++)expect(current.center[index]).toBeCloseTo(view.center[index],4);
  for(const key of ['zoom','pitch','bearing'])expect(current[key]).toBeCloseTo(view[key],4);
}
async function expectAustralia(page){
  const view=await page.evaluate(()=>{
    const map=GeoGlyphMapEngine.state.map,canvas=map.getCanvas();
    return {pitch:map.getPitch(),bearing:map.getBearing(),width:canvas.clientWidth,height:canvas.clientHeight,
      points:[[112,-44],[154,-10],[112,-10],[154,-44],[147.3,-43.6]].map(point=>{const p=map.project(point);return {x:p.x,y:p.y};})};
  });
  expect(view.pitch).toBeCloseTo(0,4);expect(view.bearing).toBeCloseTo(0,4);
  for(const point of view.points){expect(point.x).toBeGreaterThanOrEqual(0);expect(point.x).toBeLessThanOrEqual(view.width);expect(point.y).toBeGreaterThanOrEqual(0);expect(point.y).toBeLessThanOrEqual(view.height);}
}
async function begin(page,value){
  await page.evaluate(value=>{
    GeoGlyphScripts.setDraft(value);
    window.cameraFlightStarts=[];window.cameraFlightEnds=[];window.cameraScriptPhases=[];
    const api=GeoGlyphMapEngine;
    window.GeoGlyphMapEngine={...api,playCameraFlight:async(...args)=>{
      cameraFlightStarts.push(performance.now());const result=await api.playCameraFlight(...args);cameraFlightEnds.push(performance.now());return result;
    }};
    document.addEventListener('geoglyph:script-changed',()=>cameraScriptPhases.push({...GeoGlyphScripts.state(),time:performance.now()}));
  },value);
  await page.locator('#mapScriptPlay').click();
}
async function moving(page){
  await page.waitForFunction(()=>cameraFlightStarts.length&&GeoGlyphMapEngine.state.map.isMoving()&&Math.abs(GeoGlyphMapEngine.state.map.getCenter().lng-138.6)>.0001);
}

for(const width of [1440,390])test(`fresh map and Home frame Australia including Tasmania without changing artwork (${width}px)`,async({page})=>{
  await page.setViewportSize({width,height:1000});const errors=await open(page);
  await expectAustralia(page);await expect(page.locator('#mapHomeBtn')).toHaveAccessibleName('Australia home view');
  const before=await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;return {message:s.message,font:s.selectedFontId,anchor:{...s.anchor}};});
  await page.evaluate(()=>GeoGlyphMapEngine.restoreCameraView({center:[151.2,-33.86],zoom:12,pitch:55,bearing:60}));
  await page.locator('#mapHomeBtn').click();await page.waitForFunction(()=>!GeoGlyphMapEngine.state.map.isMoving());
  await expectAustralia(page);
  expect(await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;return {message:s.message,font:s.selectedFontId,anchor:{...s.anchor}};})).toEqual(before);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);expect(errors).toEqual([]);
});

test('an explicitly restored saved camera takes priority over the fresh Australia overview',async({page})=>{
  const camera={center:[151.2,-33.86],zoom:9,pitch:40,bearing:27};
  const errors=await open(page,{camera});await expectView(page,camera);expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`script flight holds its end view and begins the row hold after arrival (${portable?'standalone':'HTTP'})`,async({page})=>{
  const errors=await open(page,{portable});
  await begin(page,script([{duration:.4,actions:[{type:'camera',value:flight()}]},{actions:[{type:'title',value:'After the camera hold'}]}]));
  await moving(page);
  await page.waitForFunction(()=>cameraScriptPhases.some(phase=>phase.index===0&&phase.phase==='waiting'));
  await expectView(page,end);expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  await page.waitForFunction(()=>GeoGlyphScripts.state().index===1&&GeoGlyphScripts.state().phase==='waiting');
  const timing=await page.evaluate(()=>({start:cameraFlightStarts[0],end:cameraFlightEnds[0],hold:cameraScriptPhases.find(s=>s.index===1&&s.phase==='preparing').time}));
  expect(timing.end-timing.start).toBeGreaterThanOrEqual(560);expect(timing.hold-timing.end).toBeGreaterThanOrEqual(375);
  await expectView(page,end);await expect(page.locator('[data-map-mode="arcgis"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('#mapScriptStop').click();expect(errors).toEqual([]);
});

for(const action of ['Stop','Next','Home','Canvas'])test(`${action} cancels a script flight without a late camera movement`,async({page})=>{
  const errors=await open(page);
  await begin(page,script([{actions:[{type:'camera',value:flight(1.2)}]},{actions:[{type:'title',value:'Next camera cue'}]}]));
  await moving(page);
  await page.locator({Stop:'#mapScriptStop',Next:'#mapScriptNext',Home:'#mapHomeBtn',Canvas:'#mapCanvasToggleBtn'}[action]).click();
  if(action==='Next')await page.waitForFunction(()=>GeoGlyphScripts.state().index===1&&GeoGlyphScripts.state().phase==='waiting');
  else await page.waitForFunction(()=>!GeoGlyphScripts.state().running);
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.map.isMoving());
  if(action==='Home')await expectAustralia(page);
  const stopped=await capture(page);
  expect(Math.abs(stopped.center[0]-end.center[0])+Math.abs(stopped.center[1]-end.center[1])).toBeGreaterThan(.001);
  await page.waitForTimeout(1300);await expectView(page,stopped);
  if(action==='Canvas')expect(await page.evaluate(()=>GeoGlyphMapEngine.state.previewActive)).toBe(false);
  expect(await page.evaluate(()=>GeoGlyphScripts.state().error)).toBe('');expect(errors).toEqual([]);
});

test('reduced motion jumps to the saved end view before starting the row hold',async({page})=>{
  const errors=await open(page);await page.emulateMedia({reducedMotion:'reduce'});
  await begin(page,script([{actions:[{type:'camera',value:flight(2)}]}]));
  await page.waitForFunction(()=>GeoGlyphScripts.state().phase==='waiting');
  await expectView(page,end);
  expect(await page.evaluate(()=>cameraFlightEnds[0]-cameraFlightStarts[0])).toBeLessThan(500);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.isMoving())).toBe(false);await page.locator('#mapScriptStop').click();expect(errors).toEqual([]);
});

test('Next during preparation skips a camera flight that has not started yet',async({page})=>{
  const errors=await open(page),original=await capture(page);
  await page.evaluate(()=>{
    const morph=GeoGlyphFontMorph;let held=false;
    window.GeoGlyphFontMorph={...morph,ensureBuiltins:()=>{
      if(held)return morph.ensureBuiltins();held=true;
      return new Promise(resolve=>{window.releaseCameraPreparation=async()=>resolve(await morph.ensureBuiltins());});
    }};
  });
  await begin(page,script([{actions:[{type:'camera',value:flight()}]},{actions:[{type:'title',value:'Skipped the flight'}]}]));
  await page.waitForFunction(()=>typeof releaseCameraPreparation==='function');
  await page.locator('#mapScriptNext').click();await page.evaluate(()=>releaseCameraPreparation());
  await page.waitForFunction(()=>GeoGlyphScripts.state().index===1&&GeoGlyphScripts.state().phase==='waiting');
  expect(await page.evaluate(()=>cameraFlightStarts)).toEqual([]);await expectView(page,original);
  await page.locator('#mapScriptStop').click();expect(errors).toEqual([]);
});

test('a camera flight stops an existing 3D orbit and holds its end until another animation action',async({page})=>{
  const errors=await open(page);
  const font=await page.evaluate(async()=>{await GeoGlyphFontMorph.ensureBuiltins();return GeoGlyphScripts.fontIdentity([...GeoGlyphMapEngine.state.fontRecords.values()].find(font=>font.fontResourceKey==='conference:Gill Sans'));});
  await begin(page,script([
    {message:'AB',actions:[{type:'font',value:font},{type:'mode',value:'3d'},{type:'animation',value:'yaw'}]},
    {actions:[{type:'camera',value:flight(.5)}]},
    {actions:[{type:'animation',value:'yaw'}]}
  ]));
  await page.waitForFunction(()=>GeoGlyphScripts.state().index===0&&GeoGlyphScripts.state().phase==='waiting'&&GeoGlyph3D.stats().animation.orbiting);
  const before=await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,anchor:{...GeoGlyphMapEngine.state.anchor},mesh:GeoGlyph3D.stats().meshKey,uploads:GeoGlyph3D.stats().uploads}));
  await page.locator('#mapScriptNext').click();await page.waitForFunction(()=>GeoGlyphScripts.state().index===1&&GeoGlyphScripts.state().phase==='waiting');
  await expectView(page,end);expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);
  await page.waitForTimeout(150);await expectView(page,end);
  expect(await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,anchor:{...GeoGlyphMapEngine.state.anchor},mesh:GeoGlyph3D.stats().meshKey,uploads:GeoGlyph3D.stats().uploads}))).toEqual(before);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.extrusionEnabled)).toBe(true);
  await page.locator('#mapScriptNext').click();await page.waitForFunction(()=>GeoGlyphScripts.state().index===2&&GeoGlyphScripts.state().phase==='waiting'&&GeoGlyph3D.stats().animation.orbiting);
  await page.locator('#mapScriptStop').click();expect(errors).toEqual([]);
});
