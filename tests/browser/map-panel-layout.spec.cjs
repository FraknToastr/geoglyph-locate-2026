const {test,expect}=require('./studio-fixture.cjs');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
test.beforeEach(async({page})=>{
 await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
 await page.route('https://api.metromap.com.au/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
 await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphUi&&document.getElementById('mapFillHex'));
 await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
});
test('Map control rows share the panel width on desktop and mobile',async({page})=>{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  const result=await page.evaluate(()=>{
   const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width};};
   const group=selector=>Array.from(document.querySelectorAll(selector),n=>{const r=n.getBoundingClientRect();return {width:r.width,y:r.y};});
   return {font:group('.map-control-grid>.map-action'),modes:group('.map-mode-switch>.map-chip'),basemaps:['mapEsriAerialBtn','mapEsriWorldBtn','mapMetroMapBtn'].map(rect),exports:['mapFitBtn','mapExportGeoJsonBtn','mapSaveJpgBtn','mapSavePngBtn'].map(rect),native:rect('mapNativeColor'),label:(()=>{const r=document.getElementById('mapNativeColor').closest('label').getBoundingClientRect();return {x:r.x,width:r.width};})(),panel:rect('geoglyphMapEditor')};
  });
  for(const group of [result.font,result.modes,result.basemaps,result.exports])for(const item of group){expect(item.width).toBeCloseTo(group[0].width,0);expect(item.y).toBeCloseTo(group[0].y,0);}
  const extrusion=await page.locator('#map3DEnabled').boundingBox(),solid=await page.locator('#map3DSolid').boundingBox();
  expect(solid.y).toBeCloseTo(extrusion.y,0);expect(solid.x).toBeGreaterThan(extrusion.x);
  expect(result.label.x+result.label.width/2).toBeCloseTo(result.panel.x+result.panel.width/2,0);
 }
 await expect(page.locator('#mapFitBtn')).toHaveText('Fit');await expect(page.locator('#mapExportGeoJsonBtn')).toHaveText('Geojson');
 await expect(page.locator('#mapSaveJpgBtn')).toHaveText('JPG');await expect(page.locator('#mapSavePngBtn')).toHaveText('PNG');
 await expect(page.locator('[data-recent-context="map"]')).toHaveCount(0);
 expect(await page.locator('#mapEngineStatus').evaluate(n=>n.getBoundingClientRect().height)).toBe(1);
});
test('MetroMap dialog saves, selects and removes the key with keyboard dismissal',async({page})=>{
 await expect(page.locator('#mapMetroMapKey')).toBeHidden();
 await page.locator('#mapMetroMapBtn').click();await expect(page.locator('#mapMetroMapDialog')).toBeVisible();await expect(page.locator('#mapMetroMapKey')).toBeFocused();
 await page.locator('#mapMetroMapSaveBtn').click();await expect(page.locator('#mapMetroMapStatus')).toContainText('Enter a MetroMap API key');
 await page.locator('#mapMetroMapKey').fill('test-key');await page.locator('#mapMetroMapSaveBtn').click();await expect(page.locator('#mapMetroMapDialog')).toBeHidden();
 expect(await page.evaluate(()=>GeoGlyphMapEngine.state.basemap)).toBe('metromap');
 await page.locator('#mapMetroMapBtn').click();await expect(page.locator('#mapMetroMapKey')).toHaveValue('test-key');
 await page.locator('#mapMetroMapRemoveBtn').click();await expect(page.locator('#mapMetroMapKey')).toHaveValue('');expect(await page.evaluate(()=>GeoGlyphMapEngine.state.basemap)).toBe('aerial');
 await page.keyboard.press('Escape');await expect(page.locator('#mapMetroMapDialog')).toBeHidden();await expect(page.locator('#mapMetroMapBtn')).toBeFocused();
});
test('Esri path copy and font folder chooser have separate buttons',async({page})=>{
 await page.evaluate(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedEsriPath=value;}}});
  window.showDirectoryPicker=async options=>{window.esriChooserMode=options.mode;return {async *entries(){}};};
 });
 await page.locator('#mapCopyEsriPathBtn').click();expect(await page.evaluate(()=>window.copiedEsriPath)).toBe('C:\\Program Files\\ArcGIS\\Pro\\Resources\\Fonts');
 await page.locator('#mapLoadEsriBtn').click();expect(await page.evaluate(()=>window.esriChooserMode)).toBe('read');
});
