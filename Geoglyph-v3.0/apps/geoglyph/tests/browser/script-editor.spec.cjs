const {test,expect}=require('@playwright/test');
const path=require('node:path'),fs=require('node:fs/promises');
const {pathToFileURL}=require('node:url');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
async function open(page,{studio=true,portable=false}={}){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  if(studio)await page.addInitScript(()=>window.GeoGlyphConferenceAutoStart=false);
  await page.goto(portable?pathToFileURL(path.resolve(__dirname,'../../GeoGlyph_Locate_2026.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphScripts&&document.getElementById('mapScriptSection'));
  if(studio){await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.locator('[data-map-mode="arcgis"]').click();}
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
  return errors;
}
async function choose(page,type,configure){
  await page.locator('.script-row').first().locator('[data-add-action]').click();
  await page.locator(`[data-choose-action="${type}"]`).click();
  await configure?.();await page.locator('#mapScriptDialog [data-apply]').click();await expect(page.locator('#mapScriptDialog')).toBeHidden();
}
async function fonts(page){return page.evaluate(async()=>{await GeoGlyphFontMorph.ensureBuiltins();const records=[...GeoGlyphMapEngine.state.fontRecords.values()];return Object.fromEntries(['Gill Sans','Forte'].map(name=>[name,GeoGlyphScripts.fontIdentity(records.find(r=>r.fontResourceKey==='conference:'+name))]));});}
function script(rows){return {version:1,title:'Browser script',rows:rows.map((row,i)=>({id:'row-'+i,message:'',duration:30,actions:[],...row}))};}

test('default startup, retry and reload never poll; Start and Fetch remain explicit',async({page})=>{
  let requests=0;
  await page.route('**/FeatureServer**',route=>{requests++;return route.fulfill({json:{error:{message:'Test endpoint'}}});});
  const errors=await open(page,{studio:false});
  await page.waitForFunction(()=>GeoGlyphConference.state.ready);
  expect(requests).toBe(0);expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  await page.evaluate(()=>GeoGlyphConference.retryStartup());expect(requests).toBe(0);
  await page.locator('#mapArcgisStartBtn').click();await expect.poll(()=>requests).toBeGreaterThan(0);
  await page.locator('#mapArcgisStopBtn').click();const before=requests;
  await page.locator('#mapArcgisPollBtn').click();await expect.poll(()=>requests).toBeGreaterThan(before);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  await page.reload();await page.waitForFunction(()=>GeoGlyphConference?.state.ready);
  const after=requests;await page.waitForTimeout(1100);expect(requests).toBe(after);expect(errors).toEqual([]);
});

test('numbered auth form, toolbar icons and extrusion switch retain a compact mini panel',async({page})=>{
  const errors=await open(page);await page.locator('[data-map-mode="admin"]').click();
  await expect(page.locator('#mapArcgisRequestTokenBtn')).toContainText('1');await expect(page.locator('#mapArcgisExchangeCodeBtn')).toContainText('3');
  await expect(page.locator('.map-token-field .map-step-number')).toHaveText('2');
  const boxes=await page.evaluate(()=>Object.fromEntries(['mapArcgisRequestTokenBtn','mapArcgisToken','mapArcgisExchangeCodeBtn','mapArcgisUseTokenBtn','mapArcgisClearTokenBtn'].map(id=>{const b=document.getElementById(id).getBoundingClientRect();return [id,{top:b.top,bottom:b.bottom}];})));
  expect(boxes.mapArcgisToken.top-boxes.mapArcgisRequestTokenBtn.bottom).toBeGreaterThanOrEqual(12);
  expect(boxes.mapArcgisExchangeCodeBtn.top).toBeGreaterThan(boxes.mapArcgisToken.bottom);
  await expect(page.locator('#mapArcgisAuth')).not.toContainText('ARCGIS TOKEN');await expect(page.locator('#mapArcgisAuth')).not.toContainText('Open sign-in →');await expect(page.locator('.arcgis-note')).toHaveCount(0);
  await page.locator('[data-map-mode="message"]').click();
  await expect(page.getByRole('switch',{name:'3D extrusion'})).not.toBeChecked();
  await expect(page.locator('#map3DStatus')).not.toContainText('Extrude outline');
  await expect(page.locator('.map-editor-head-actions #mapControlsHeader')).toBeVisible();
  for(const button of ['#mapFitBtn','#mapEditorCollapseBtn','#mapControlsHeader [data-collapse-all="expand"]'])await expect(page.locator(button+' svg')).toHaveCount(1);
  for(const button of ['#mapArcgisRequestTokenBtn','#mapArcgisExchangeCodeBtn'])await expect(page.locator(button+' svg')).toHaveCount(0);
  await page.locator('#mapEditorCollapseBtn').click();expect(await page.locator('#geoglyphMapEditor').evaluate(n=>n.getBoundingClientRect().height)).toBe(138);
  await expect(page.locator('#mapControlsHeader')).toBeHidden();expect(errors).toEqual([]);
});

test('Message has appearance controls, ArcGIS has Survey123, and Geoglyph has Script and Survey123',async({page})=>{
  const errors=await open(page),sections=page.locator('#geoglyphMapEditor>[data-control-section]:visible');
  const draft=await page.evaluate(()=>GeoGlyphScripts.getDraft());
  await expect(sections).toHaveCount(2);await expect(page.locator('#mapArcgisAuth')).toBeHidden();await expect(page.locator('#mapArcgisPolling')).toBeVisible();
  expect(await sections.evaluateAll(nodes=>nodes.map(node=>node.id))).toEqual(['mapScriptSection','mapArcgisSection']);
  await page.locator('[data-map-mode="message"]').click();
  await expect(sections).toHaveCount(6);await expect(page.locator('#mapScriptSection')).toBeHidden();await expect(page.locator('#mapArcgisSection')).toBeHidden();
  await page.locator('[data-map-mode="admin"]').click();
  await expect(sections).toHaveCount(1);await expect(sections).toHaveAttribute('id','mapArcgisSection');await expect(page.locator('#mapArcgisToken')).toBeVisible();
  await expect(page.locator('#mapArcgisPolling')).toBeHidden();
  await page.locator('[data-map-mode="arcgis"]').click();
  await expect(sections).toHaveCount(2);await expect(page.locator('#mapScriptSection')).toBeVisible();
  await expect(page.locator('#mapArcgisPolling')).toBeVisible();
  for(const id of ['mapArcgisRequestTokenBtn','mapArcgisToken','mapArcgisExchangeCodeBtn','mapArcgisUseTokenBtn','mapArcgisClearTokenBtn','mapArcgisAuthStatus'])await expect(page.locator('#'+id)).toBeHidden();
  expect(await page.evaluate(()=>GeoGlyphScripts.getDraft())).toEqual(draft);expect(errors).toEqual([]);
});

test('Survey123 steps, polling and Reset rows fit desktop and narrow sidebars in both themes',async({page})=>{
  await page.route('https://www.arcgis.com/sharing/rest/community/self',route=>route.fulfill({json:{username:'layout-test'},headers:{'access-control-allow-origin':'*'}}));
  const errors=await open(page);await page.locator('[data-map-mode="admin"]').click();
  await page.locator('#mapArcgisToken').fill('layout-fixture-token');await page.locator('#mapArcgisUseTokenBtn').click();
  await expect(page.locator('#mapArcgisReset123Btn')).toBeVisible();
  const measure=()=>page.evaluate(()=>{
    const rect=node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width};};
    const boxes=Object.fromEntries(['mapArcgisRequestTokenBtn','mapArcgisToken','mapArcgisExchangeCodeBtn','mapArcgisUseTokenBtn','mapArcgisClearTokenBtn','mapArcgisStartBtn','mapArcgisPollBtn','mapArcgisStopBtn','mapArcgisInterval','mapArcgisReset123Btn'].map(id=>[id,rect(document.getElementById(id))]));
    return {...boxes,badge:rect(document.querySelector('.map-token-field .map-step-number')),auth:rect(document.getElementById('mapArcgisAuth')),pollRow:rect(document.getElementById('mapArcgisPolling')),grid:rect(document.querySelector('.arcgis-grid'))};
  });
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    for(const theme of ['dark','light']){
      await page.locator(theme==='light'?'#themeLightBtn':'#themeDarkBtn').click();
      await page.locator('[data-map-mode="admin"]').click();
      const b=await measure();
      expect(b.mapArcgisRequestTokenBtn.width).toBeCloseTo(b.mapArcgisExchangeCodeBtn.width,1);
      expect(b.mapArcgisExchangeCodeBtn.width).toBeCloseTo(b.grid.width,1);
      expect(b.mapArcgisUseTokenBtn.width).toBeCloseTo(b.mapArcgisClearTokenBtn.width,1);
      expect(b.mapArcgisUseTokenBtn.width+b.mapArcgisClearTokenBtn.width).toBeCloseTo(b.grid.width,1);
      expect(b.mapArcgisUseTokenBtn.top).toBeGreaterThan(b.mapArcgisExchangeCodeBtn.bottom);
      expect(b.mapArcgisUseTokenBtn.top).toBeCloseTo(b.mapArcgisClearTokenBtn.top,1);
      expect(b.mapArcgisUseTokenBtn.left).toBeCloseTo(b.grid.left,1);
      expect(b.mapArcgisExchangeCodeBtn.left).toBeCloseTo(b.grid.left,1);expect(b.mapArcgisClearTokenBtn.right).toBeCloseTo(b.grid.right,1);
      expect(b.badge.left).toBeGreaterThan(b.mapArcgisToken.left);expect(b.badge.right).toBeLessThan(b.mapArcgisToken.right);
      expect(b.badge.top).toBeGreaterThan(b.mapArcgisToken.top);expect(b.badge.bottom).toBeLessThan(b.mapArcgisToken.bottom);
      expect(b.mapArcgisReset123Btn.top).toBeGreaterThan(b.auth.bottom);expect(b.mapArcgisReset123Btn.width).toBeCloseTo(b.grid.width,1);
      for(const id of ['mapArcgisRequestTokenBtn','mapArcgisToken','mapArcgisExchangeCodeBtn','mapArcgisUseTokenBtn','mapArcgisClearTokenBtn','mapArcgisReset123Btn']){expect(b[id].left,id).toBeGreaterThanOrEqual(b.grid.left-1);expect(b[id].right,id).toBeLessThanOrEqual(b.grid.right+1);}
      await expect(page.locator('#mapArcgisPolling')).toBeHidden();
      await page.mouse.move(width-10,900);
      await page.locator('#mapArcgisSection').screenshot({path:`/tmp/geoglyph-survey-auth-${width}-${theme}.png`});
      await page.locator('[data-map-mode="arcgis"]').click();await expect(page.locator('#mapArcgisAuth')).toBeHidden();
      const p=await measure(),pollIds=['mapArcgisStartBtn','mapArcgisPollBtn','mapArcgisStopBtn','mapArcgisInterval'];
      const bottoms=pollIds.map(id=>p[id].bottom);expect(Math.max(...bottoms)-Math.min(...bottoms)).toBeLessThanOrEqual(1);
      expect(p.mapArcgisReset123Btn.top).toBeGreaterThan(p.pollRow.bottom);expect(p.mapArcgisReset123Btn.width).toBeCloseTo(p.grid.width,1);
      for(const id of pollIds){expect(p[id].width,id).toBeGreaterThan(0);expect(p[id].left,id).toBeGreaterThanOrEqual(p.grid.left-1);expect(p[id].right,id).toBeLessThanOrEqual(p.grid.right+1);}
      await page.mouse.move(width-10,900);
      await page.locator('#mapArcgisSection').screenshot({path:`/tmp/geoglyph-survey-polling-${width}-${theme}.png`});
    }
  }
  await page.locator('[data-map-mode="admin"]').click();
  await page.locator('#mapArcgisClearTokenBtn').click();await expect(page.locator('#mapArcgisReset123Btn')).toBeHidden();expect(errors).toEqual([]);
});

test('vertical wheel input over focused Script messages scrolls the entire sidebar',async({page})=>{
  const errors=await open(page),sidebar=page.locator('#mapControlSidebar');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    const message=page.locator('.script-message').first();await message.scrollIntoViewIfNeeded();await message.focus();
    const box=await message.boundingBox(),side=await sidebar.boundingBox();
    await page.mouse.move(Math.min(box.x+box.width/2,side.x+side.width-15),box.y+Math.min(15,box.height/2));
    const previous=await sidebar.evaluate(node=>node.scrollTop);await page.mouse.wheel(0,220);
    await expect.poll(()=>sidebar.evaluate(node=>node.scrollTop)).toBeGreaterThan(previous+100);
    expect(await message.evaluate(node=>node===document.activeElement)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('four progressive action slots, modal pickers and multiline text keep every message aligned',async({page})=>{
  const errors=await open(page);await page.locator('#mapScriptNew').click();
  const row=page.locator('.script-row').first();await expect(row.locator('[data-add-action]')).toHaveCount(1);
  await choose(page,'mode',()=>page.locator('#scriptValue').selectOption('3d'));
  await choose(page,'colour',()=>page.locator('#scriptColourValue').fill('#ff4400'));
  await choose(page,'font',async()=>{await page.locator('#scriptFontSearch').fill('Gill Sans');await page.locator('.script-font-choice').first().click();});
  await choose(page,'animation',()=>page.locator('#scriptValue').selectOption('yaw'));
  await expect(row.locator('[data-add-action]')).toHaveCount(0);await expect(row.locator('[data-edit-action]')).toHaveCount(4);
  await row.locator('textarea').fill('First line\nSecond line');await page.locator('#mapScriptAddRow').click();
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    const positions=await page.locator('.script-message').evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
    expect(positions[0].x).toBeCloseTo(positions[1].x,1);expect(positions[0].width).toBeCloseTo(positions[1].width,1);expect(positions[0].height).toBeGreaterThan(positions[1].height);
  }
  await row.locator('[data-edit-action="1"]').click();await expect(page.locator('#scriptColourPicker')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#mapScriptDialog')).toBeHidden();
  await row.locator('[data-edit-action="3"]').click();await page.locator('[data-remove]').click();await expect(row.locator('[data-edit-action]')).toHaveCount(3);await expect(row.locator('[data-add-action]')).toHaveCount(1);
  expect(errors).toEqual([]);await page.screenshot({path:'/tmp/geoglyph-script-editor-narrow.png'});
});

test('Save/Load JSON round trips, invalid loads retain the draft, and reload restores unfinished edits',async({page})=>{
  await open(page);await page.locator('#mapScriptNew').click();await page.locator('.script-message').fill('Saved\nscript');
  await choose(page,'location',async()=>{
    await page.getByLabel('Latitude').fill('-37.81785');
    await page.getByLabel('Longitude').fill('144.96896');
    await page.getByLabel('Maximum fit zoom (optional)').fill('22');
  });
  const downloading=page.waitForEvent('download');await page.locator('#mapScriptSave').click();const download=await downloading,content=await fs.readFile(await download.path(),'utf8'),saved=JSON.parse(content);
  expect(saved.rows[0].message).toBe('Saved\nscript');
  expect(saved.rows[0].actions).toEqual([{type:'location',value:{lng:144.96896,lat:-37.81785,maxZoom:22}}]);
  await page.locator('#mapScriptAddRow').click();
  await page.locator('#mapScriptFile').setInputFiles({name:'valid.json',mimeType:'application/json',buffer:Buffer.from(content)});await expect(page.locator('.script-row')).toHaveCount(1);
  await page.locator('#mapScriptFile').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...saved,rows:[{...saved.rows[0],actions:Array(5).fill({type:'fit',value:true})}]}))});
  await expect(page.locator('#mapScriptStatus')).toContainText('four actions');expect(await page.evaluate(()=>GeoGlyphScripts.getDraft())).toEqual(saved);
  await page.reload();await page.waitForFunction(()=>window.GeoGlyphScripts);await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.locator('[data-map-mode="arcgis"]').click();await expect(page.locator('.script-message')).toHaveValue('Saved\nscript');
  const rehearsal=path.resolve(__dirname,'../../src/scripts/locate-2026-rehearsal.json');
  await page.locator('#mapScriptFile').setInputFiles(rehearsal);
  await expect(page.locator('#mapScriptTitle')).toHaveValue('Locate 2026 opening rehearsal');
  const rehearsalDownload=page.waitForEvent('download');
  await page.locator('#mapScriptSave').click();
  expect(JSON.parse(await fs.readFile(await (await rehearsalDownload).path(),'utf8')))
    .toEqual(JSON.parse(await fs.readFile(rehearsal,'utf8')));
});

test('combined 3D/font/colour/orbit rows apply together; Pause and Next preserve orbit and Stop freezes it',async({page})=>{
  const errors=await open(page),f=await fonts(page);
  await page.evaluate(value=>GeoGlyphScripts.setDraft(value),script([{message:'AB',actions:[{type:'mode',value:'3d'},{type:'font',value:f['Gill Sans']},{type:'colour',value:{fill:'#FF4400'}},{type:'animation',value:'yaw'}]},{message:'Next'}]));
  await page.locator('#mapScriptPlay').click();await page.waitForFunction(()=>GeoGlyphScripts.state().phase==='waiting'||GeoGlyphScripts.state().error);
  expect(await page.evaluate(()=>GeoGlyphScripts.state().error)).toBe('');
  await expect(page.locator('[data-map-mode="arcgis"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#mapScriptPlay')).toBeVisible();
  await expect(page.locator('#mapScriptSection>.map-section-head')).toHaveText("Geo's Script");
  await page.locator('#geoglyphPreviewBtn').click();expect(await page.evaluate(()=>GeoGlyphScripts.state().running)).toBe(true);
  const before=await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,fill:GeoGlyphMapEngine.state.fill,stats:GeoGlyph3D.stats()}));
  expect(before.message).toBe('AB');expect(before.fill).toBe('#FF4400');expect(before.stats.animation.orbiting).toBe(true);
  await page.locator('#mapScriptPlay').click();await expect(page.locator('#mapScriptStatus')).toContainText('Paused');await page.waitForTimeout(200);
  expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.frames)).toBeGreaterThan(before.stats.animation.frames);
  await page.locator('#mapScriptNext').click();await page.waitForFunction(()=>GeoGlyphMapEngine.state.message==='Next'&&GeoGlyphScripts.state().phase==='waiting');
  expect(await page.evaluate(()=>GeoGlyphScripts.state().paused)).toBe(true);expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(true);
  await page.locator('#mapScriptStop').click();expect(await page.evaluate(()=>GeoGlyph3D.stats().animation.orbiting)).toBe(false);expect(errors).toEqual([]);
});

test('scripted font morph and orbit continue during Pause and preserve progress on Stop',async({page})=>{
  const errors=await open(page),f=await fonts(page);
  await page.evaluate(value=>GeoGlyphScripts.setDraft(value),script([{message:'AB',actions:[{type:'mode',value:'3d'},{type:'morph',value:{from:f['Gill Sans'],to:f.Forte,duration:10}},{type:'animation',value:'fixed'}]}]));
  await page.locator('#mapScriptPlay').click();await page.waitForFunction(()=>GeoGlyphScripts.state().phase==='waiting'||GeoGlyphScripts.state().error);
  expect(await page.evaluate(()=>GeoGlyphScripts.state().error)).toBe('');await page.locator('#mapScriptPlay').click();
  const progress=await page.evaluate(()=>GeoGlyphFontMorph.stats().progress);await page.waitForTimeout(250);
  expect(await page.evaluate(()=>GeoGlyphFontMorph.stats().progress)).toBeGreaterThan(progress);
  await page.locator('#mapScriptStop').click();expect(await page.evaluate(()=>GeoGlyphFontMorph.stats().playing)).toBe(false);expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`scripts silently update Message controls and preserve emoji colours with automatic fallback (${portable?'standalone':'HTTP'})`,async({page})=>{
  const errors=await open(page,{portable}),f=await fonts(page);
  await page.evaluate(value=>{
    GeoGlyphMapEngine.state.outlineWidth=0;
    window.scriptManualEvents=0;document.addEventListener('geoglyph:manual-map-change',()=>window.scriptManualEvents++);
    GeoGlyphScripts.setDraft(value);
  },script([
    {message:'HELLO 😴\n👩🏽‍💻 🇦🇺 1️⃣ ❤️',actions:[{type:'mode',value:'2d'},{type:'font',value:f['Gill Sans']},{type:'colour',value:{fill:'#FF2200'}}]},
    {message:'😴'},
    {message:'Plain text'},
    {message:'Cache 😴',actions:[{type:'colour',value:{fill:'#FF2200'}}]},
    {message:'Cache 😴',actions:[{type:'colour',value:{fill:'#22CC44'}}]},
    {message:'🇦🇺'}
  ]));
  const wait=async index=>{await page.waitForFunction(index=>{const s=GeoGlyphScripts.state();return s.error||s.index===index&&s.phase==='waiting';},index);expect(await page.evaluate(()=>GeoGlyphScripts.state().error)).toBe('');await expect(page.locator('[data-map-mode="arcgis"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('#mapScriptPlay')).toBeVisible();};
  const pixels=()=>page.evaluate(()=>{
    const canvas=GeoGlyphMapEngine.state.lastDecal.canvas,rgba=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    let red=0,green=0,yellow=0,blue=0,edges=0;
    for(let i=0;i<rgba.length;i+=4)if(rgba[i+3]>220){const [r,g,b]=rgba.slice(i,i+3);if(r>190&&g<90&&b<90)red++;if(g>140&&r<100&&b<130)green++;if(r>160&&g>120&&b<100)yellow++;if(b>100&&r<100&&g<170)blue++;const p=i/4,x=p%canvas.width,y=Math.floor(p/canvas.width);if(x===0||y===0||x===canvas.width-1||y===canvas.height-1)edges++;}
    return {red,green,yellow,blue,edges};
  });
  await page.locator('#mapScriptPlay').click();await wait(0);
  await expect(page.locator('#mapMessage')).toHaveValue('HELLO 😴\n👩🏽‍💻 🇦🇺 1️⃣ ❤️');await expect(page.locator('#mapNativeColor')).toBeChecked();
  let colours=await pixels();expect(colours.red).toBeGreaterThan(100);expect(colours.yellow).toBeGreaterThan(100);expect(colours.edges).toBe(0);
  const png=await page.evaluate(()=>GeoGlyphMapEngine.state.lastDecal.canvas.toDataURL().split(',')[1]);await fs.writeFile(`/tmp/geoglyph-script-emoji-${portable?'standalone':'http'}.png`,Buffer.from(png,'base64'));
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.selectedFontId)).toBe(await page.evaluate(()=>GeoGlyphScripts.resolveFont({name:'Gill Sans',resourceKey:'conference:Gill Sans'}).id));
  await page.locator('#mapScriptNext').click();await wait(1);await expect(page.locator('#mapNativeColor')).toBeChecked();expect((await pixels()).yellow).toBeGreaterThan(100);
  await page.locator('#mapScriptNext').click();await wait(2);await expect(page.locator('#mapNativeColor')).not.toBeChecked();expect(await page.evaluate(()=>GeoGlyphMapEngine.state.emojiFallbackFontId)).toBeNull();
  await page.locator('#mapScriptNext').click();await wait(3);colours=await pixels();expect(colours.red).toBeGreaterThan(100);const yellow=colours.yellow;
  await page.locator('#mapScriptNext').click();await wait(4);colours=await pixels();expect(colours.green).toBeGreaterThan(100);expect(colours.yellow).toBe(yellow);
  await page.locator('#mapScriptNext').click();await wait(5);colours=await pixels();expect(colours.blue).toBeGreaterThan(100);expect(colours.edges).toBe(0);
  expect(await page.evaluate(()=>window.scriptManualEvents)).toBe(0);
  await page.locator('[data-map-mode="message"]').click();await expect(page.locator('#mapMessage')).toHaveValue('🇦🇺');await expect(page.locator('#mapNativeColor')).toBeChecked();await expect(page.locator('#mapFill')).toHaveValue('#22cc44');
  expect(errors).toEqual([]);
});

test('unsupported emoji extrusion and morph rows preserve the last successful artwork',async({page})=>{
  const errors=await open(page),f=await fonts(page);
  await page.evaluate(value=>GeoGlyphScripts.setDraft(value),script([{message:'Safe',actions:[{type:'font',value:f['Gill Sans']},{type:'mode',value:'3d'},{type:'animation',value:'yaw'}]},{message:'😴'}]));
  await page.locator('#mapScriptPlay').click();await page.waitForFunction(()=>GeoGlyphScripts.state().phase==='waiting');
  await page.evaluate(()=>window.safeScriptModel=GeoGlyphMapEngine.state.lastLocalModel);
  await page.locator('#mapScriptNext').click();await expect(page.locator('#mapScriptStatus')).toContainText('Colour emoji require 2D');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.lastLocalModel===window.safeScriptModel&&GeoGlyphMapEngine.state.message==='Safe')).toBe(true);
  await page.evaluate(value=>GeoGlyphScripts.setDraft(value),script([{message:'😴',actions:[{type:'mode',value:'2d'},{type:'morph',value:{from:f['Gill Sans'],to:f.Forte,duration:2}}]}]));
  await page.locator('#mapScriptPlay').click();await expect(page.locator('#mapScriptStatus')).toContainText('cannot be font morphed');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.lastLocalModel===window.safeScriptModel&&GeoGlyphMapEngine.state.message==='Safe')).toBe(true);expect(errors).toEqual([]);
});

test('missing fonts and superseded preparations never replace the last successful artwork',async({page})=>{
  await open(page);const before=await page.evaluate(()=>GeoGlyphMapEngine.state.message);
  await page.evaluate(value=>GeoGlyphScripts.setDraft(value),script([{message:'Bad',actions:[{type:'font',value:{name:'Missing fixture font'}}]}]));
  await page.locator('#mapScriptPlay').click();await expect(page.locator('#mapScriptStatus')).toContainText('Font unavailable');expect(await page.evaluate(()=>GeoGlyphMapEngine.state.message)).toBe(before);
  const f=await fonts(page);
  await page.evaluate(value=>{GeoGlyphScripts.setDraft(value);const original=GeoGlyphFontService;window.GeoGlyphFontService={...original,model:async(...args)=>{if(args[1]==='Gate')await new Promise(resolve=>window.releaseScriptModel=resolve);return original.model(...args);}};},script([{message:'Gate',actions:[{type:'font',value:f['Gill Sans']}]}]));
  await page.locator('#mapScriptPlay').click();await page.waitForFunction(()=>window.releaseScriptModel);await page.locator('#mapScriptStop').click();
  await page.evaluate(()=>releaseScriptModel());await page.waitForTimeout(150);expect(await page.evaluate(()=>GeoGlyphMapEngine.state.message)).toBe(before);
});

test('large drafts and standalone editing retain fixed slots and do not start playback',async({page})=>{
  const errors=await open(page,{portable:true});
  await page.evaluate(value=>GeoGlyphScripts.setDraft(value),script(Array.from({length:500},(_,i)=>({message:'Line '+i}))));
  await expect(page.locator('.script-row')).toHaveCount(500);expect(await page.evaluate(()=>GeoGlyphScripts.state().running)).toBe(false);
  const first=page.locator('.script-row').first();await first.locator('.script-message').fill('Edited');
  expect(await page.evaluate(()=>GeoGlyphScripts.getDraft().rows[0].message)).toBe('Edited');expect(errors).toEqual([]);
});
