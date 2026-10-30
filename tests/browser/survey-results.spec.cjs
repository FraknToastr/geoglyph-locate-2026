const { test, expect } = require('./studio-fixture.cjs');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { config } = require('../../src/scripts/survey-results.js');
const tile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');

function metadata(id = 7) {
  return { id, name: `Responses ${id}`, capabilities: 'Query,Extract', objectIdField: 'objectid', maxRecordCount: 2,
    editFieldsInfo: { creationDateField: 'CreationDate' }, advancedQueryCapabilities: { supportsOrderBy: true, supportsPagination: true },
    fields: [{ name: 'objectid', type: 'esriFieldTypeOID' }, { name: config.field, type: 'esriFieldTypeString' }, { name: 'CreationDate', type: 'esriFieldTypeDate' }] };
}

function feature(message, objectid = 1) {
  return { attributes: { [config.field]: message, objectid, CreationDate: 1000 + objectid } };
}

async function open(page, { portable = false, layers = [7], reply } = {}) {
  const state = { queries: [], requests: [], response: { features: [] }, layers, reply };
  await page.route('**/MapServer/tile/**', route => route.fulfill({ body: tile, contentType: 'image/png' }));
  await page.route(`${config.serviceUrl}**`, async route => {
    const request = route.request(), url = new URL(request.url());
    state.requests.push({ url: request.url(), headers: request.headers(), method: request.method(), body: request.postData() });
    if (request.method() === 'POST') url.search = request.postData();
    if (url.pathname.endsWith('/FeatureServer')) {
      return route.fulfill({ json: { layers: state.layers.map(id => ({ id })), tables: [] } });
    }
    if (!url.pathname.endsWith('/query')) return route.fulfill({ json: metadata(Number(url.pathname.split('/').pop())) });
    state.queries.push(url);
    const response = state.reply ? await state.reply(url, state) : state.response;
    return route.fulfill({ json: response });
  });
  await page.goto(portable ? pathToFileURL(path.resolve(__dirname, '../../dist/GeoGlyph.html')).href : '/');
  await page.waitForFunction(() => window.GeoGlyphMapEngine && window.GeoGlyph3D);
  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.waitForFunction(() => GeoGlyphMapEngine.state.mapReady);
  await page.locator('[data-map-mode="arcgis"]').click();
  return state;
}

async function fetchOnce(page) {
  await page.locator('#mapArcgisPollBtn').click();
  await expect(page.locator('#mapArcgisPollBtn')).toBeEnabled();
}

for (const portable of [false, true]) {
  test(`${portable ? 'portable' : 'modular'} public connection handles an empty table without login`, async ({ page, context }) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await context.addCookies([{ name: 'geoglyph-test-cookie', value: 'must-not-send', domain: 'services.arcgis.com', path: '/', secure: true, sameSite: 'None' }]);
    const state = await open(page, { portable });
    const before = await page.evaluate(() => ({ message: GeoGlyphMapEngine.state.message, anchor: { ...GeoGlyphMapEngine.state.anchor } }));
    await expect(page).toHaveTitle('GeoGlyph — Locate 2026');
    await expect(page.locator('#mapArcgisToken, #mapArcgisRequestTokenBtn, #mapArcgisExchangeCodeBtn')).toHaveCount(0);
    await fetchOnce(page);
    await expect(page.locator('#mapArcgisLiveValue')).toContainText('Connected · Waiting for a non-empty response');
    await expect(page.locator('#mapArcgisLayerField')).toBeHidden();
    expect(await page.evaluate(() => ({ message: GeoGlyphMapEngine.state.message, anchor: { ...GeoGlyphMapEngine.state.anchor } }))).toEqual(before);
    expect(state.queries).toHaveLength(1);
    for (const request of state.requests) {
      expect(new URL(request.url).searchParams.has('token')).toBe(false);
      expect(request.headers.authorization).toBeUndefined();
      expect(request.headers.cookie).toBeUndefined();
      expect(new URLSearchParams(request.body || '').has('token')).toBe(false);
    }
    expect(state.requests.at(-1).method).toBe('POST');
    expect(errors).toEqual([]);
  });
}

test('ordered fetch skips whitespace pages and duplicate messages do not rebuild', async ({ page }) => {
  const state = await open(page, { reply: url => ({
    features: url.searchParams.get('resultOffset') === '0' ? [feature(' ', 4), feature('\n', 3)] : [feature('Hello Locate!', 2)],
    exceededTransferLimit: url.searchParams.get('resultOffset') === '0'
  }) });
  await fetchOnce(page);
  await expect(page.locator('#mapMessage')).toHaveValue('Hello Locate!');
  await expect(page.locator('#mapMessage')).toHaveAttribute('readonly', '');
  expect(state.queries.map(url => url.searchParams.get('resultOffset'))).toEqual(['0', '2']);
  expect(state.queries[0].searchParams.get('orderByFields')).toBe('CreationDate DESC,objectid DESC');
  const build = await page.evaluate(() => GeoGlyphMapEngine.state.buildToken);
  await fetchOnce(page);
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('No change');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.buildToken)).toBe(build);
  state.reply = null; state.response = { features: [] };
  await fetchOnce(page);
  await expect(page.locator('#mapMessage')).toHaveValue('Hello Locate!');
});

test('live messages use the fresh POST query when a public GET would return cached data', async ({ page }) => {
  const state = await open(page, { reply: (url, state) => ({
    features: [feature(state.requests.at(-1).method === 'POST' ? 'Fresh latest message' : 'Cached previous message')]
  }) });
  await fetchOnce(page);
  await expect(page.locator('#mapMessage')).toHaveValue('Fresh latest message');
  expect(state.requests.at(-1).method).toBe('POST');
});

async function pausePollingClock(page) {
  await page.clock.install({ time: new Date('2030-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2030-01-01T00:00:01Z'));
}

const idle = page => expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
const press = (page, id) => page.locator(id).evaluate(button => button.click());

test('lowering and raising the interval changes the running schedule without restarting', async ({ page }) => {
  const state = await open(page);
  await page.locator('#mapArcgisInterval').fill('30');
  await pausePollingClock(page);
  await press(page, '#mapArcgisStartBtn'); await idle(page);
  expect(state.queries).toHaveLength(1);
  await page.clock.runFor(4000);
  expect(state.queries).toHaveLength(1);
  // Four seconds have already elapsed: reducing to one second checks immediately.
  await page.locator('#mapArcgisInterval').fill('1');
  await page.clock.runFor(1); await idle(page);
  expect(state.queries).toHaveLength(2);
  await page.clock.runFor(900);
  expect(state.queries).toHaveLength(2);
  await page.clock.runFor(100); await idle(page);
  expect(state.queries).toHaveLength(3);
  await page.locator('#mapArcgisInterval').fill('10');
  await page.clock.runFor(2000);
  expect(state.queries).toHaveLength(3);
  await page.clock.runFor(8000); await idle(page);
  expect(state.queries).toHaveLength(4);
  await press(page, '#mapArcgisStopBtn');
  await page.locator('#mapArcgisInterval').fill('1');
  await page.clock.runFor(5000);
  expect(state.queries).toHaveLength(4);
});

test('interval changes during a slow response preserve it and poll again without an extra wait', async ({ page }) => {
  const state = await open(page);
  await page.locator('#mapArcgisInterval').fill('30');
  await pausePollingClock(page);
  await press(page, '#mapArcgisStartBtn'); await idle(page);
  await delayNextQuery(page);
  await press(page, '#mapArcgisPollBtn');
  await expect.poll(() => page.evaluate(() => typeof window.releaseOldResults)).toBe('function');
  const generation = await page.evaluate(() => GeoGlyphMapEngine.state.arcgisGeneration);
  await page.locator('#mapArcgisInterval').fill('1');
  await page.clock.runFor(5000);
  expect(state.queries).toHaveLength(2);
  expect(await page.evaluate(() => ({ generation: GeoGlyphMapEngine.state.arcgisGeneration, aborted: GeoGlyphMapEngine.state.arcgisAbort.signal.aborted }))).toEqual({ generation, aborted: false });
  state.response = { features: [feature('Fresh response after slow request')] };
  await page.evaluate(() => window.releaseOldResults()); await idle(page);
  await page.clock.runFor(1); await idle(page);
  expect(state.queries).toHaveLength(3);
  await expect(page.locator('#mapMessage')).toHaveValue('Fresh response after slow request');
});

test('polling waits for the first response and Stop prevents further requests', async ({ page }) => {
  const state = await open(page);
  await page.locator('#mapArcgisInterval').fill('2');
  await page.locator('#mapArcgisStartBtn').click();
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('Waiting');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  state.response = { features: [feature('The first response')] };
  await expect(page.locator('#mapMessage')).toHaveValue('The first response', { timeout: 5000 });
  await page.locator('#mapArcgisStopBtn').click();
  const requests = state.queries.length;
  await page.waitForTimeout(2200);
  expect(state.queries).toHaveLength(requests);
  await expect(page.locator('#mapArcgisStartBtn')).toBeEnabled();
  await expect(page.locator('#mapArcgisStopBtn')).toBeDisabled();
});

test('access failures stop polling, preserve the displayed message and explain permissions', async ({ page }) => {
  const state = await open(page);
  state.response = { features: [feature('Keep this message')] };
  await fetchOnce(page);
  state.response = { error: { code: 499, message: 'Token Required' } };
  await page.locator('#mapArcgisStartBtn').click();
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('public query access');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  await expect(page.locator('#mapMessage')).toHaveValue('Keep this message');
  await expect(page.locator('#mapArcgisStopBtn')).toBeDisabled();
});

test('temporary network failures retain the model and live polling recovers', async ({ page }) => {
  const state = await open(page);
  state.response = { features: [feature('Keep during outage')] };
  await fetchOnce(page);
  await page.route(url => url.pathname.endsWith('/query'), route => route.abort('failed'), { times: 1 });
  await page.locator('#mapArcgisInterval').fill('2');
  await page.locator('#mapArcgisStartBtn').click();
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('Failed to fetch');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  await expect(page.locator('#mapMessage')).toHaveValue('Keep during outage');
  state.response = { features: [feature('Recovered connection', 2)] };
  await expect(page.locator('#mapMessage')).toHaveValue('Recovered connection', { timeout: 5000 });
  await page.locator('#mapArcgisStopBtn').click();
});

async function delayNextQuery(page) {
  await page.evaluate(() => {
    const original = Response.prototype.json;
    Response.prototype.json = function (...args) {
      if (this.url.includes('/FeatureServer/') && /\/query(?:\?|$)/.test(this.url)) {
        Response.prototype.json = original;
        return original.apply(this, args).then(() => new Promise(resolve => {
          window.releaseOldResults = () => resolve({ features: [{ attributes: { whats_on_your_mind: 'Stale response', objectid: 90 } }] });
        }));
      }
      return original.apply(this, args);
    };
  });
}

test('Stop cancels an in-flight fetch and discards even an uncancellable late response', async ({ page }) => {
  const state = await open(page);
  await fetchOnce(page);
  await delayNextQuery(page);
  await page.locator('#mapArcgisPollBtn').click();
  await page.waitForFunction(() => typeof window.releaseOldResults === 'function');
  await page.locator('#mapArcgisStopBtn').click();
  state.response = { features: [feature('Fresh response')] };
  await fetchOnce(page);
  await page.evaluate(() => window.releaseOldResults());
  await expect(page.locator('#mapMessage')).toHaveValue('Fresh response');
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('Updated');
});

test('multiple matching layers require a choice and changing it invalidates old requests', async ({ page }) => {
  const state = await open(page, { layers: [7, 9] });
  await fetchOnce(page);
  await expect(page.locator('#mapArcgisLayerSelect')).toBeVisible();
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('Choose a results layer');
  expect(state.queries).toHaveLength(0);
  await page.locator('#mapArcgisLayerSelect').selectOption('7');
  await delayNextQuery(page);
  await page.locator('#mapArcgisPollBtn').click();
  await page.waitForFunction(() => typeof window.releaseOldResults === 'function');
  await page.locator('#mapArcgisLayerSelect').selectOption('9');
  state.response = { features: [feature('Layer nine')] };
  await fetchOnce(page);
  await page.evaluate(() => window.releaseOldResults());
  await expect(page.locator('#mapMessage')).toHaveValue('Layer nine');
  expect(state.queries.at(-1).pathname).toMatch(/\/9\/query$/);
});

test('new responses preserve the anchor, style, renderer and active 3D orbit', async ({ page }) => {
  const font = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
  test.skip(!fs.existsSync(font), 'Optional DejaVu font fixture unavailable');
  const state = await open(page);
  await page.evaluate(async bytes => {
    await GeoGlyphMapEngine.importFonts([new File([Uint8Array.from(atob(bytes), c => c.charCodeAt(0))], 'conference-test.ttf')], 'file');
    const record = [...GeoGlyphMapEngine.state.fontRecords.values()].find(font => font.file?.name === 'conference-test.ttf');
    await GeoGlyphMapEngine.selectFont(record.id);
  }, fs.readFileSync(font).toString('base64'));
  state.response = { features: [feature('LOCATE 2026')] };
  await fetchOnce(page);
  await page.locator('#map3DEnabled').check();
  await page.waitForFunction(() => GeoGlyph3D.isVisible() && !GeoGlyphMapEngine.state.rebuilding);
  await page.locator('#mapEditorCollapseBtn').click();
  await page.locator('#mapQuickOrbit').click();
  await page.waitForFunction(() => GeoGlyph3D.stats().animation.phase === 'orbiting');
  const sample = () => page.evaluate(() => {
    const s = GeoGlyphMapEngine.state;
    return { anchor: { ...s.anchor }, font: s.selectedFontId, fill: s.fill, outline: s.outline, depth: s.extrusionDepthMeters,
      stats: GeoGlyph3D.stats(), renderer: s.map.getLayer('geoglyph-extruded-font')?.implementation.renderer.uuid };
  });
  const before = await sample();
  await page.locator('#mapEditorCollapseBtn').click();
  state.response = { features: [feature('HI', 2)] };
  await fetchOnce(page);
  await expect.poll(async () => (await sample()).stats.meshKey).not.toBe(before.stats.meshKey);
  const after = await sample();
  expect(after.anchor).toEqual(before.anchor);
  for (const key of ['font', 'fill', 'outline', 'depth', 'renderer']) expect(after[key]).toEqual(before[key]);
  expect(after.stats.animation.orbiting).toBe(true);
  expect(after.stats.animation.frames).toBeGreaterThan(before.stats.animation.frames);
  await expect(page.locator('#mapMessage')).toHaveValue('HI');
});

test('conference settings do not overwrite original application storage', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('geoglyph-theme', 'dark'));
  await page.goto('/');
  await page.waitForFunction(() => window.GeoGlyphStudio);
  await page.locator('#themeLightBtn').click();
  expect(await page.evaluate(() => ({ original: localStorage.getItem('geoglyph-theme'), conference: localStorage.getItem('geoglyph-locate2026.geoglyph-theme') }))).toEqual({ original: 'dark', conference: 'light' });
});
