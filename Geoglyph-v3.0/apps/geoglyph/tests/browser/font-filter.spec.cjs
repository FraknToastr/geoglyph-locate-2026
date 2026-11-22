const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),{pathToFileURL}=require('node:url');
const hostedSmoke=process.env.GEOGLYPH_HOSTED_SMOKE==='1';
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
test(`${hostedSmoke?'hosted':'disk'} general 3D list persists; only Rescan checks fonts, not toggles, messages or reloads`,async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{window.filterFontPrompts=0;window.queryLocalFonts=async()=>{window.filterFontPrompts++;throw Error('Unexpected font prompt');};});
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  async function setup(reload=false){
    if(reload)await page.reload();else await page.goto(hostedSmoke?'/':pathToFileURL(path.resolve(__dirname,'../../index.html')).href);
    expect(new URL(page.url()).protocol).toBe(hostedSmoke?'http:':'file:');
    await page.waitForFunction(()=>window.GeoGlyph3D);
    await page.evaluate(()=>{
      window.filterChecks=0;const original=GeoGlyphFontCompatibility.probe;
      GeoGlyphFontCompatibility.probe=(...args)=>{window.filterChecks++;return original(...args);};
      GeoGlyphMapEngine.showMap();
    });
    await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
    await page.locator('#mapFontFiles').setInputFiles(['GILLUBCD.TTF','MAGNETOB.TTF','seguiemj.ttf'].map(name=>path.resolve(__dirname,'../../src/fonts/'+name)));
    await page.waitForFunction(()=>[...GeoGlyphMapEngine.state.fontRecords.values()].filter(r=>r.source==='file').length===3&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
    await page.evaluate(async()=>{
      const s=GeoGlyphMapEngine.state;for(const [id,r]of s.fontRecords)if(r.source!=='file')s.fontRecords.delete(id);
      s.fontRecords.set('no-bytes',{id:'no-bytes',name:'Inaccessible example',family:'NoSuchFont',source:'preset'});
      const font=[...s.fontRecords.values()].find(r=>r.file?.name==='GILLUBCD.TTF');
      s.mode='message';s.message='Geo';await GeoGlyphMapEngine.selectFont(font.id);GeoGlyphMapEngine.refreshControls();
    });
    await page.waitForFunction(()=>!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild&&!GeoGlyphMapEngine.state.map.isMoving());
  }
  await setup();
  const checkbox=page.getByRole('checkbox',{name:'3D compatible',exact:true}),rescan=page.getByRole('button',{name:'Rescan',exact:true});
  const before=await page.evaluate(()=>({selected:GeoGlyphMapEngine.state.selectedFontId,build:GeoGlyphMapEngine.state.buildToken,uploads:GeoGlyph3D.stats().uploads}));
  await checkbox.check();await expect(page.locator('#mapFontFilterStatus')).toContainText('No saved scan');
  await expect(page.locator('#mapFontSelect option:enabled')).toHaveCount(0);
  expect(await page.evaluate(()=>window.filterChecks)).toBe(0);
  await rescan.click();await expect(rescan).toBeDisabled();
  await checkbox.uncheck();await checkbox.check();
  await expect(page.locator('#mapFontFilterStatus')).toContainText('2 compatible · 4/4 checked');
  await expect(rescan).toBeEnabled();expect(await page.evaluate(()=>window.filterChecks)).toBe(3);
  await expect(page.locator('#mapFontSelect option:enabled')).toHaveCount(2);
  expect(await page.evaluate(()=>({selected:GeoGlyphMapEngine.state.selectedFontId,build:GeoGlyphMapEngine.state.buildToken,uploads:GeoGlyph3D.stats().uploads}))).toEqual(before);
  await checkbox.uncheck();await expect(page.locator('#mapFontSelect option')).toHaveCount(4);await checkbox.check();
  await page.locator('#mapMessage').fill('🫣');
  await expect(page.locator('#mapFontFilterStatus')).toContainText('2 compatible');
  await expect(page.locator('#mapFontSelect option:enabled')).toHaveCount(2);
  expect(await page.evaluate(()=>window.filterChecks)).toBe(3);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.selectedFontId)).toBe(before.selected);
  expect(await page.evaluate(()=>window.filterFontPrompts)).toBe(0);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem(GeoGlyphFontCompatibility.STORAGE_KEY)));
  expect(saved.entries).toHaveLength(3);expect(saved.entries.every(entry=>entry.length===2&&entry.every(value=>typeof value==='string'))).toBe(true);
  await setup(true);
  await expect(checkbox).not.toBeChecked();await checkbox.check();
  await expect(page.locator('#mapFontFilterStatus')).toContainText('2 compatible');await expect(page.locator('#mapFontSelect option:enabled')).toHaveCount(2);
  expect(await page.evaluate(()=>window.filterChecks)).toBe(0);
  await checkbox.uncheck();await checkbox.check();expect(await page.evaluate(()=>window.filterChecks)).toBe(0);
  await rescan.click();await expect(page.locator('#mapFontFilterStatus')).toContainText('4/4 checked');await expect(rescan).toBeEnabled();
  expect(await page.evaluate(()=>window.filterChecks)).toBe(3);expect(await page.evaluate(()=>window.filterFontPrompts)).toBe(0);
  const sameLine=await page.locator('.map-font-filter-row').evaluate(row=>{
    const a=row.querySelector('label').getBoundingClientRect(),b=row.querySelector('button').getBoundingClientRect();
    return Math.abs((a.top+a.bottom)/2-(b.top+b.bottom)/2)<2;
  });expect(sameLine).toBe(true);
  expect(errors).toEqual([]);
});
