const {test,expect}=require('./studio-fixture.cjs');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
test.beforeEach(async({page})=>{
 await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
 await page.route('https://api.metromap.com.au/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
 await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphUi&&document.getElementById('mapFillHex'));
 await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
});
test('Map control rows share available width and wrap within the narrow sidebar',async({page})=>{
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  const result=await page.evaluate(()=>{
   const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width};};
   const group=selector=>Array.from(document.querySelectorAll(selector),n=>{const r=n.getBoundingClientRect();return {width:r.width,y:r.y};});
   return {font:group('.map-font-actions>.map-action'),modes:group('.map-mode-switch>.square-btn'),basemaps:['mapEsriAerialBtn','mapEsriWorldBtn','mapMetroMapBtn'].map(rect),exports:['mapExportObjBtn','mapExportGeoJsonBtn','mapSaveJpgBtn','mapSavePngBtn'].map(rect),native:rect('mapNativeColor'),label:(()=>{const r=document.getElementById('mapNativeColor').closest('label').getBoundingClientRect();return {x:r.x,width:r.width};})(),panel:rect('geoglyphMapEditor')};
  });
  const sections=await page.locator('#geoglyphMapEditor>.control-section:not([hidden])').evaluateAll(nodes=>nodes.map(node=>{
   const heading=node.querySelector('.map-section-head'),first=[...node.children].find(child=>!child.matches('.map-section-head')&&child.getBoundingClientRect().height);
   return {id:node.id,size:parseFloat(getComputedStyle(heading.querySelector('button')).fontSize),gap:first?first.getBoundingClientRect().top-heading.getBoundingClientRect().bottom:10};
  }));
  for(const section of sections){expect(section.size).toBe(18);expect(section.gap,section.id+' heading spacing').toBeGreaterThanOrEqual(9);}
  for(const group of [result.font,result.modes,result.basemaps,result.exports])for(const item of group){
   expect(item.width).toBeCloseTo(group[0].width,0);
   expect(item.y).toBeCloseTo(group[0].y,0);
  }
  const extrusion=await page.locator('#map3DEnabled').boundingBox(),mirror=await page.locator('#mapMirrorX').boundingBox(),solid=await page.locator('#map3DSolid').boundingBox();
  if(width>680){expect(mirror.y+mirror.height/2).toBeCloseTo(extrusion.y+extrusion.height/2,0);expect(mirror.x).toBeGreaterThan(extrusion.x);}
  else{expect(mirror.x).toBeCloseTo(extrusion.x,0);expect(mirror.y).toBeGreaterThan(extrusion.y);}
  expect(solid.x).toBeCloseTo(extrusion.x,0);expect(solid.y).toBeGreaterThan(extrusion.y);
  expect(result.label.x+result.label.width/2).toBeCloseTo(result.panel.x+result.panel.width/2,0);
 }
 await expect(page.locator('#mapFitBtn')).toHaveAccessibleName('Fit geometry');await expect(page.locator('#mapExportObjBtn')).toHaveText('OBJ');await expect(page.locator('#mapExportGeoJsonBtn')).toHaveText('Geojson');
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
