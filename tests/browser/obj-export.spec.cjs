const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs/promises');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');

async function settled(page){
  await page.waitForFunction(()=>{const s=GeoGlyphMapEngine.state;return s.mapReady&&!s.rebuilding&&!s.pendingBuild&&!s.map.isMoving()&&GeoGlyph3D.stats().animation.phase!=='framing';});
}
async function open(page,url='/'){
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(url);await page.waitForFunction(()=>window.GeoGlyphFontMorph&&window.GeoGlyphUi);
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  const fonts=await page.evaluate(async()=>{
    const fonts=await GeoGlyphFontMorph.ensureBuiltins(),source=fonts.find(f=>f.fontResourceKey==='conference:Gill Sans'),target=fonts.find(f=>f.fontResourceKey==='conference:Forte');
    Object.assign(GeoGlyphMapEngine.state,{message:'AB',nativeColor:false,baseHeightMeters:300,relativeSize:100,bearing:0,extrusionTilt:90,extrusionDepthMeters:30});
    await GeoGlyphMapEngine.selectFont(source.id);GeoGlyphMapEngine.refreshControls();
    return {source:source.id,target:target.id};
  });
  await settled(page);return {fonts,errors};
}
async function downloadOBJ(page){
  const promise=page.waitForEvent('download');
  await page.locator('#mapExportObjBtn').click();
  const download=await promise;expect(download.suggestedFilename()).toMatch(/\.obj$/);
  const text=await fs.readFile(await download.path(),'utf8');
  const vertices=text.split('\n').filter(line=>line.startsWith('v ')).map(line=>line.slice(2).split(' ').map(Number));
  const normals=text.split('\n').filter(line=>line.startsWith('vn ')).map(line=>line.slice(3).split(' ').map(Number));
  const faces=text.split('\n').filter(line=>line.startsWith('f '));
  expect(vertices.length).toBe(faces.length*3);expect(normals.length).toBe(vertices.length);
  expect(vertices.flat().every(Number.isFinite)).toBe(true);
  expect(normals.every(n=>Math.abs(Math.hypot(...n)-1)<.00001)).toBe(true);
  return {text,vertices,faces,bounds:[0,1,2].map(axis=>{const values=vertices.map(v=>v[axis]);return [Math.min(...values),Math.max(...values)];})};
}

test('ordinary 3D OBJ preserves metre scale and downloads without stopping an orbit',async({page})=>{
  const {errors}=await open(page);
  await expect(page.locator('#mapExportObjBtn')).toBeDisabled();
  await expect(page.locator('#mapObjStatus')).toContainText('Enable 3D');
  await page.locator('#map3DEnabled').check();await settled(page);
  await expect(page.locator('#mapExportObjBtn')).toBeEnabled();
  const mesh=await page.evaluate(()=>GeoGlyph3D.stats());
  const result=await downloadOBJ(page);
  expect(result.faces.length).toBe(mesh.triangles);
  expect(result.bounds[2][0]).toBeCloseTo(0,3);expect(result.bounds[2][1]).toBeCloseTo(300,3);
  expect(result.bounds[1][1]-result.bounds[1][0]).toBeCloseTo(30,3);
  await page.evaluate(()=>GeoGlyph3D.ensureOrbit('yaw'));
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting'&&GeoGlyph3D.stats().animation.frames>3);
  const before=await page.evaluate(()=>({stats:GeoGlyph3D.stats(),anchor:{...GeoGlyphMapEngine.state.anchor}}));
  await downloadOBJ(page);
  await expect.poll(()=>page.evaluate(()=>GeoGlyph3D.stats().animation.frames)).toBeGreaterThan(before.stats.animation.frames);
  const after=await page.evaluate(()=>({stats:GeoGlyph3D.stats(),anchor:{...GeoGlyphMapEngine.state.anchor}}));
  expect(after.stats.animation.phase).toBe('orbiting');expect(after.stats.uploads).toBe(before.stats.uploads);expect(after.anchor).toEqual(before.anchor);
  expect(errors).toEqual([]);
});

test('OBJ exports both morph endpoints at the source scale and blocks intermediate shapes',async({page})=>{
  const {fonts,errors}=await open(page);
  await page.locator('#map3DEnabled').check();await settled(page);
  await page.evaluate(async target=>{await GeoGlyphFontMorph.prepare(target);},fonts.target);
  await expect.poll(()=>page.evaluate(()=>GeoGlyphFontMorph.stats().ready)).toBe(true);
  const source=await downloadOBJ(page);
  await page.evaluate(()=>GeoGlyphFontMorph.seek(.5));
  await expect(page.locator('#mapExportObjBtn')).toBeDisabled();
  await expect(page.locator('#mapObjStatus')).toContainText('endpoint');
  await page.evaluate(()=>GeoGlyphFontMorph.seek(1));
  await expect(page.locator('#mapExportObjBtn')).toBeEnabled();
  const endpoint=await page.evaluate(async()=>{
    const prepared=await GeoGlyphFontMorph.prepareOBJEndpoint();
    return {height:prepared.model.bounds.height/prepared.referenceBounds.height*300};
  });
  await page.evaluate(()=>GeoGlyph3D.ensureOrbit('fixed'));
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
  const before=await page.evaluate(()=>({progress:GeoGlyphFontMorph.stats().progress,stats:GeoGlyph3D.stats(),renderer:GeoGlyphFontMorph.stats().renderer}));
  const target=await downloadOBJ(page);
  expect(target.text).not.toBe(source.text);expect(target.bounds[2][1]-target.bounds[2][0]).toBeCloseTo(endpoint.height,2);
  const after=await page.evaluate(()=>({progress:GeoGlyphFontMorph.stats().progress,stats:GeoGlyph3D.stats(),renderer:GeoGlyphFontMorph.stats().renderer}));
  expect(after.progress).toBe(before.progress);expect(after.stats.animation.phase).toBe('orbiting');
  expect(after.renderer.uploads).toBe(before.renderer.uploads);expect(after.stats.uploads).toBe(before.stats.uploads);
  expect(errors).toEqual([]);
});

test('standalone contains the new layout, migrates Character settings, and exports OBJ locally',async({page})=>{
  const {errors}=await open(page,pathToFileURL(path.resolve(__dirname,'../../GeoGlyph_Locate_2026.html')).href);
  await expect(page.locator('[data-map-mode]')).toHaveText(['Message','Geoglyph','ArcGIS']);
  await expect(page.locator('#mapGlyphGrid')).toHaveCount(0);
  expect(await page.evaluate(()=>[...document.querySelectorAll('#geoglyphMapEditor>[data-control-section]')].map(n=>n.id)))
    .toEqual(['mapMessageSection','mapFontSection','map3DSection','mapMorphPanel','mapScriptSection','mapArcgisSection','mapStyleSection','mapBasemapSection']);
  await page.evaluate(()=>GeoGlyphUi.applyMapSettings({mode:'glyph',selectedCode:0x1F600,message:'old message'}));
  await expect(page.locator('#mapMessage')).toHaveValue('😀');
  expect(await page.evaluate(()=>GeoGlyphUi.collectMapSettings().mode)).toBe('message');
  await page.evaluate(()=>GeoGlyphUi.applyMapSettings({mode:'glyph',selectedCode:65}));await settled(page);
  await page.locator('#map3DEnabled').check();await settled(page);
  await downloadOBJ(page);
  expect(errors).toEqual([]);
});
