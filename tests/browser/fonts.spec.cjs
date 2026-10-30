const { test, expect } = require('./studio-fixture.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '../..');
const dejavu = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const emoji = '/mnt/c/Windows/Fonts/seguiemj.ttf';
const tile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');

async function open(page, url = '/') {
  await page.route('**/MapServer/tile/**', route => route.fulfill({ body: tile, contentType: 'image/png' }));
  await page.goto(url);
  await page.waitForFunction(() => window.GeoGlyphStudio && window.GeoGlyphMapEngine && window.GeoGlyphUi);
}

async function fontRoute(page, file) {
  await page.route('**/__fixture.ttf', route => route.fulfill({ body: fs.readFileSync(file), contentType: 'font/ttf' }));
}

test('standalone release boots without CDN dependencies and contains its worker', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('https://**', route => route.abort());
  await open(page, pathToFileURL(path.join(root, 'dist/GeoGlyph.html')).href);
  const result = await page.evaluate(() => ({
    parser: !!window.opentype, clipping: !!window.polygonClipping,
    worker: JSON.parse(document.getElementById('geoglyph-font-worker-source').textContent).includes('self.onmessage'),
    duplicateIds: [...document.querySelectorAll('[id]')].map(n => n.id).filter((id, i, all) => all.indexOf(id) !== i),
  }));
  expect(result).toEqual({ parser: true, clipping: true, worker: true, duplicateIds: [] });
  expect(errors).toEqual([]);
});

test('1000 local font records remain lazy and rescanning is idempotent', async ({ page }) => {
  await page.addInitScript(() => {
    window.fixtureReads = 0;
    window.queryLocalFonts = async () => Array.from({ length: 1000 }, (_, i) => ({
      family: 'Synthetic', fullName: `Synthetic ${String(i).padStart(4, '0')}`,
      postscriptName: `Synthetic-${i}`, style: 'Regular',
      blob: async () => { window.fixtureReads++; throw Error('Catalogue must not read this font'); },
    }));
  });
  await open(page);
  await page.locator('#scanBtn').click();
  await expect(page.locator('#scanBtn')).toBeEnabled();
  await expect.poll(() => page.evaluate(() => GeoGlyphStudio.state.fonts.filter(f => f.source === 'windows').length)).toBe(1000);
  const count = await page.evaluate(() => GeoGlyphStudio.state.fonts.length);
  expect(await page.evaluate(() => window.fixtureReads)).toBe(0);
  expect(await page.locator('#fontList .font-row').count()).toBeLessThanOrEqual(48);
  await page.locator('#scanBtn').click();
  await expect(page.locator('#scanBtn')).toBeEnabled();
  expect(await page.evaluate(() => GeoGlyphStudio.state.fonts.length)).toBe(count);
  expect(await page.evaluate(() => window.fixtureReads)).toBe(0);
  await page.locator('#fontSearch').fill('Synthetic 0999');
  await expect(page.locator('#fontList .font-row')).toHaveCount(1);
  await expect(page.locator('#fontList')).toContainText('Synthetic 0999');
});

test('Stop loading ignores a late font-access result and keeps the app usable',async({page})=>{
  await page.addInitScript(()=>{window.queryLocalFonts=()=>new Promise(resolve=>{window.resolveFontQuery=resolve;});});
  await open(page);const before=await page.evaluate(()=>GeoGlyphStudio.state.fonts.length);
  await page.locator('#scanBtn').click();
  await expect(page.locator('#stopFontLoading')).toBeVisible();
  await page.locator('#stopFontLoading').click();
  await page.evaluate(()=>window.resolveFontQuery([{family:'Late',fullName:'Late font',postscriptName:'Late',style:'Regular',blob:()=>{throw Error('Must not read cancelled result');}}]));
  await expect(page.locator('#scanBtn')).toBeEnabled();
  expect(await page.evaluate(()=>GeoGlyphStudio.state.fonts.length)).toBe(before);
  await expect(page.locator('#fontLoadingText')).toContainText('Loading stopped');
  await page.locator('#themeLightBtn').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});

test('real font parsing and repeated layout use the worker and its caches', async ({ page }) => {
  test.skip(!fs.existsSync(dejavu), 'Optional local font fixture unavailable');
  await open(page);
  await fontRoute(page, dejavu);
  const result = await page.evaluate(async () => {
    const file = new File([await (await fetch('/__fixture.ttf')).arrayBuffer()], 'DejaVuSans.ttf', { lastModified: 1 });
    const record = { name: 'DejaVu Sans', source: 'file', file };
    const service = GeoGlyphFontService;
    let ticks = 0; const timer = setInterval(() => ticks++, 1);
    const metadata = await service.prepare(record);
    const first = await service.model(record, 'AAAAAA', { quality: 10, tracking: 0, lineHeight: 1.15 });
    const second = await service.model(record, 'AAAAAA', { quality: 10, tracking: 0, lineHeight: 1.15 });
    clearInterval(timer);
    return { metadata, polygons: first.polygons.length, equal: JSON.stringify(first) === JSON.stringify(second), ticks, stats: service.stats(), worker: await service.workerStats() };
  });
  expect(result.polygons).toBeGreaterThan(0);
  expect(result.equal).toBe(true);
  expect(result.ticks).toBeGreaterThan(0);
  expect(result.stats.parses).toBe(1);
  expect(result.worker.fonts).toBe(1);
  expect(result.worker.models).toBe(1);
});

test('a pending unrelated font set does not stall the selected-symbol preview',async({page})=>{
  await open(page);
  const result=await page.evaluate(async()=>{
    Object.defineProperty(document.fonts,'ready',{get:()=>new Promise(()=>{}),configurable:true});
    GeoGlyphStudio.state.preview='symbol';
    return Promise.race([GeoGlyphStudio.renderPreview().then(()=>true),new Promise(resolve=>setTimeout(()=>resolve(false),1000))]);
  });
  expect(result).toBe(true);
});

test('Segoe UI Emoji letters and colour glyphs accept fill and outline', async ({ page }) => {
  test.skip(!fs.existsSync(emoji), 'Optional installed Windows Segoe UI Emoji fixture unavailable');
  await open(page);
  await fontRoute(page, emoji);
  const results = await page.evaluate(async () => {
    const file = new File([await (await fetch('/__fixture.ttf')).arrayBuffer()], 'seguiemj.ttf', { lastModified: 1 });
    const record = { id: 'actual-segoe-emoji', name: 'Segoe UI Emoji Regular', source: 'file', file };
    await GeoGlyphFontService.ensureFace(record);
    Object.assign(GeoGlyphMapEngine.state, { mode: 'glyph', fill: '#31A765', outline: '#FFFFFF', outlineWidth: 4, nativeColor: false });
    return ['A', '7', '!', '😀'].map(text => {
      const styled = GeoGlyphMapEngine.rasteriseGroundDecal(record, text, { nativeColor: false });
      const data = styled.canvas.getContext('2d').getImageData(0, 0, styled.canvas.width, styled.canvas.height).data;
      let green = 0, white = 0, black = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 250) continue;
        if (data[i] === 49 && data[i + 1] === 167 && data[i + 2] === 101) green++;
        if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) white++;
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) black++;
      }
      return { text, green, white, black };
    });
  });
  for (const result of results) {
    expect(result.green, result.text).toBeGreaterThan(100);
    expect(result.white, result.text).toBeGreaterThan(100);
    expect(result.black, result.text).toBe(0);
  }
});

test('map publishes the final edit and paint changes do not rebuild outlines', async ({ page }) => {
  test.skip(!fs.existsSync(dejavu), 'Optional local font fixture unavailable');
  await open(page);
  await fontRoute(page, dejavu);
  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.waitForFunction(() => GeoGlyphMapEngine.state.mapReady);
  await page.evaluate(async () => {
    const file = new File([await (await fetch('/__fixture.ttf')).arrayBuffer()], 'DejaVuSans.ttf', { lastModified: 1 });
    GeoGlyphMapEngine.state.mode = 'message';
    await GeoGlyphMapEngine.importFonts([file], 'file');
    GeoGlyphMapEngine.state.message = 'OLD';
    const first = GeoGlyphMapEngine.rebuild();
    GeoGlyphMapEngine.state.message = 'AAAAA';
    const second = GeoGlyphMapEngine.rebuild();
    await Promise.all([first, second]);
  });
  await page.waitForFunction(() => GeoGlyphMapEngine.getGeoJSON()?.features?.[0]?.properties?.message === 'AAAAA');
  const before = await page.evaluate(() => GeoGlyphFontService.stats());
  await page.locator('#mapFill').fill('#ff3366');
  await page.locator('#mapOpacity').fill('0.5');
  await expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.map.getPaintProperty('geoglyph-ground-fill', 'fill-color'))).toBe('#ff3366');
  const after = await page.evaluate(() => GeoGlyphFontService.stats());
  expect(after.parses).toBe(before.parses);
  expect(after.jobs).toBe(before.jobs);
});

test('an unreadable font reports failure instead of drawing a substituted map font',async({page})=>{
  await open(page);await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.evaluate(async()=>{
    GeoGlyphMapEngine.state.mode='message';GeoGlyphMapEngine.state.message='A';
    await GeoGlyphMapEngine.importFonts([new File(['invalid font data'],'broken.ttf',{lastModified:1})],'file');
    await GeoGlyphMapEngine.rebuild();
  });
  await expect(page.locator('#mapEngineStatus')).toContainText('Exact font could not be loaded');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.lastRenderMode)).toBe('none');
});
