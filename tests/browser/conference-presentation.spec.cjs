const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { config } = require('../../src/scripts/survey-results.js');

test.setTimeout(90_000);
const tile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
const cueFields = ['emojis', 'geoglyph_speaks', 'whats_on_your_mind', 'random_font', 'choose_a_font_font', 'choose_a_colour_colour', '_2d_or_3d', 'fit', 'animation', '_size_size', 'special_commands'];
function cue(id, attributes = {}, point) {
  return { attributes: { objectid: id, CreationDate: 1000 + id, ...attributes }, ...(point ? { geometry: { x: point[0], y: point[1], spatialReference: { wkid: 4326 } } } : {}) };
}
function metadata() {
  return { id: 7, name: 'Conference cues', capabilities: 'Query', objectIdField: 'objectid', maxRecordCount: 2,
    geometryType: 'esriGeometryPoint', spatialReference: { wkid: 4326 }, editFieldsInfo: { creationDateField: 'CreationDate' },
    advancedQueryCapabilities: { supportsOrderBy: true, supportsPagination: true },
    fields: [{ name: 'objectid', type: 'esriFieldTypeOID' }, { name: 'CreationDate', type: 'esriFieldTypeDate' },
      ...cueFields.map(name => ({ name, type: 'esriFieldTypeString' }))] };
}
async function open(page, { records = [], portable = false, localModular = false, delayTiles = false, overview = false } = {}) {
  const server = { records: overview ? [...records] : [], queries: [], requests: [] };
  const diagnostics = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (['warning', 'error'].includes(message.type()) && diagnostics.length < 30) diagnostics.push(message.text()); });
  const tileGate = delayTiles ? new Promise(resolve => { server.releaseTiles = resolve; }) : Promise.resolve();
  await page.route('**/MapServer/tile/**', async route => { await tileGate; await route.fulfill({ body: tile, contentType: 'image/png' }); });
  await page.route(`${config.serviceUrl}**`, async route => {
    const request = route.request();
    const url = new URL(request.url());
    const params = request.method() === 'POST' ? new URLSearchParams(request.postData()) : url.searchParams;
    server.requests.push({ url: request.url(), method: request.method(), headers: request.headers(), params });
    if (url.pathname.endsWith('/FeatureServer')) return route.fulfill({ json: { layers: [{ id: 7, name: 'Conference cues' }], tables: [] } });
    if (!url.pathname.endsWith('/query')) return route.fulfill({ json: metadata() });
    server.queries.push(params);
    let records = [...server.records];
    const newer = /objectid\s*>\s*(\d+)/i.exec(params.get('where') || '');
    if (newer) records = records.filter(row => row.attributes.objectid > Number(newer[1]));
    const ascending = !/DESC/i.test(params.get('orderByFields') || '');
    records.sort((a, b) => (a.attributes.objectid - b.attributes.objectid) * (ascending ? 1 : -1));
    const offset = Number(params.get('resultOffset') || 0);
    const count = Math.min(2, Number(params.get('resultRecordCount') || 2));
    return route.fulfill({ json: { features: records.slice(offset, offset + count), exceededTransferLimit: offset + count < records.length } });
  });
  await page.goto(portable || localModular ? pathToFileURL(path.resolve(__dirname, localModular ? '../../index.html' : '../../dist/GeoGlyph.html')).href : '/');
  try {
    await page.waitForFunction(() => (window.GeoGlyphConference?.state.ready && window.GeoGlyphMapEngine?.state.mapReady) || window.GeoGlyphConference?.state.error, null, { timeout: 60_000 });
    const error = await page.evaluate(() => GeoGlyphConference.state.error);
    if (error) throw Error(error);
  } catch (error) {
    const status = await page.evaluate(() => ({ error: window.GeoGlyphConference?.state.error, ready: window.GeoGlyphConference?.state.ready, mapReady: window.GeoGlyphMapEngine?.state.mapReady, fonts: window.GeoGlyphFontService?.stats() }));
    error.message += '\nStartup diagnostics: ' + JSON.stringify({ status, diagnostics });
    throw error;
  }
  await page.waitForFunction(() => GeoGlyphConference.state.baselined);
  if (!overview) {
    // Existing cue regressions exercise the live stage; command tests below
    // exercise the real overview -> Begin -> live transition separately.
    await page.evaluate(() => { GeoGlyphConference.state.phase = 'live'; GeoGlyphMapEngine.state.conferenceOverview = false; });
    server.records.push(...records);
    if (records.length) await poll(page);
  }
  return server;
}
async function poll(page) {
  await expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
  await page.locator('#mapArcgisPollBtn').evaluate(button => button.click());
}
async function applied(page, id) {
  await page.waitForFunction(expected => GeoGlyphConference.state.lastAppliedId === expected && !GeoGlyphConference.state.applying, id, { timeout: 60_000 });
}
async function submit(page, server, record) {
  server.records.push(record);
  await poll(page);
  await applied(page, record.attributes.objectid);
}
async function snapshot(page) {
  return page.evaluate(() => {
    const s = GeoGlyphMapEngine.state;
    return { content: { ...GeoGlyphConference.state.content }, font: s.selectedFontId, displayedFont: s.displayedFontId,
      nativeColor: s.nativeColor, extrusion: s.extrusionEnabled, height: s.baseHeightMeters, depth: s.extrusionDepthMeters,
      relativeSize: s.relativeSize, fill: s.fill, outline: s.outline, anchor: { ...s.anchor }, orientation: s.orientationMode,
      animation: GeoGlyph3D.stats().animation, history: [...GeoGlyphConference.state.history] };
  });
}
async function gateModel(page, message) {
  await page.evaluate(text => {
    const service = GeoGlyphFontService;
    window.conferenceModelEntered = false;
    window.GeoGlyphFontService = { ...service, model: async (...args) => {
      if (args[1] === text && !window.conferenceModelEntered) {
        window.conferenceModelEntered = true;
        window.conferenceModeAtModel = GeoGlyphMapEngine.state.extrusionEnabled;
        await new Promise(resolve => { window.releaseConferenceModel = resolve; });
      }
      return service.model(...args);
    } };
  }, message);
}

async function expectAustralia(page) {
  const view = await page.evaluate(() => {
    const map = GeoGlyphMapEngine.state.map;
    const canvas = map.getCanvas();
    return { corners:[[112,-44],[154,-10]].map(point => { const p=map.project(point); return [p.x,p.y]; }),
      width:canvas.clientWidth, height:canvas.clientHeight, pitch:map.getPitch(), bearing:map.getBearing(),
      phase:GeoGlyphConference.state.phase, moving:map.isMoving() };
  });
  expect(view.phase).toBe('overview');
  expect(view.moving).toBe(false);
  expect(view.pitch).toBe(0);
  expect(view.bearing).toBe(0);
  for (const [x,y] of view.corners) {
    expect(x).toBeGreaterThanOrEqual(40);
    expect(x).toBeLessThanOrEqual(view.width-40);
    expect(y).toBeGreaterThanOrEqual(40);
    expect(y).toBeLessThanOrEqual(view.height-40);
  }
}

test('Begin draws sleeping Geo before a real 30-second flight and holds later cues until arrival', async ({ page }) => {
  const server = await open(page, { overview:true });
  await expectAustralia(page);
  const anchor = (await snapshot(page)).anchor;
  await page.evaluate(() => {
    const map = GeoGlyphMapEngine.state.map, fly = map.flyTo.bind(map);
    window.introFlights = [];
    map.flyTo = options => {
      window.introFlights.push({ duration:options.duration, start:performance.now(),
        phases:GeoGlyphConference.state.history.filter(item => item.objectId === 1).map(item => item.phase) });
      return fly(options);
    };
    map.on('moveend', () => {
      const flight = window.introFlights.at(-1);
      if (flight && !flight.end) flight.end = performance.now();
    });
  });
  server.records.push(cue(1, { special_commands:' Begin ', emojis:'👋', animation:'Face', _size_size:'Huge' }));
  await poll(page);
  await page.waitForFunction(() => window.introFlights.length === 1);
  server.records.push(cue(2, { geoglyph_speaks:'AWAKE' }), cue(3, { special_commands:'Begin' }));
  await poll(page);
  expect(await page.evaluate(() => GeoGlyphConference.state.phase)).toBe('beginning');
  expect((await snapshot(page)).history.some(item => item.objectId === 2 && item.phase === 'started')).toBe(false);
  await applied(page, 2);
  const flights = await page.evaluate(() => window.introFlights);
  expect(flights).toHaveLength(1);
  expect(flights[0].duration).toBe(30000);
  expect(flights[0].end-flights[0].start).toBeGreaterThanOrEqual(29500);
  expect(flights[0].phases).toEqual(['started','drawn','flight']);
  const result = await snapshot(page);
  expect(result.anchor).toEqual(anchor);
  expect(result.content.message).toBe('AWAKE');
  expect(result.history.filter(item => item.objectId === 1).map(item => item.phase)).toEqual(['started','drawn','flight','fit','applied']);
  expect(result.history.filter(item => item.objectId === 3).map(item => item.phase)).toEqual(['ignored']);
  expect(await page.evaluate(() => GeoGlyphConference.state.phase)).toBe('live');
});

test('Begin preserves native emoji colours before, during and after the flight', async ({ page }) => {
  const server = await open(page, { overview:true, localModular:true });
  await page.evaluate(() => {
    const map = GeoGlyphMapEngine.state.map, fly = map.flyTo.bind(map);
    const colours = () => {
      const canvas = GeoGlyphMapEngine.state.lastDecal.canvas;
      const pixels = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
      let opaque=0, coloured=0, white=0;
      for(let i=0;i<pixels.length;i+=4) if(pixels[i+3]>128) {
        opaque++;
        const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
        if(Math.max(r,g,b)-Math.min(r,g,b)>40)coloured++;
        if(r>235&&g>235&&b>235)white++;
      }
      return { coloured:coloured/opaque, white:white/opaque, width:canvas.width, height:canvas.height,
        samplingHeightPx:GeoGlyphMapEngine.state.lastDecal.samplingHeightPx };
    };
    window.beginColourSamples = {};
    window.sampleBeginColours = colours;
    map.flyTo = options => { window.beginColourSamples.before=colours(); return fly(options); };
    map.on('render', () => {
      if(window.beginColourSamples.mid || GeoGlyphConference.state.phase!=='beginning' || map.getZoom()<13 || !map.isMoving())return;
      const decal=GeoGlyphMapEngine.state.lastDecal;
      const points=decal.coordinates.map(point=>map.project(point));
      const left=Math.max(0,Math.floor(Math.min(...points.map(p=>p.x))));
      const top=Math.max(0,Math.floor(Math.min(...points.map(p=>p.y))));
      const right=Math.min(map.getCanvas().width,Math.ceil(Math.max(...points.map(p=>p.x))));
      const bottom=Math.min(map.getCanvas().height,Math.ceil(Math.max(...points.map(p=>p.y))));
      if(right<=left||bottom<=top)return;
      const capture=document.createElement('canvas');capture.width=map.getCanvas().width;capture.height=map.getCanvas().height;
      const ctx=capture.getContext('2d');ctx.drawImage(map.getCanvas(),0,0);
      const pixels=ctx.getImageData(left,top,right-left,bottom-top).data;
      let yellow=0;
      for(let i=0;i<pixels.length;i+=4)if(pixels[i]>150&&pixels[i+1]>90&&pixels[i+2]<180)yellow++;
      window.beginColourSamples.mid={...colours(), yellowPixels:yellow, moving:map.isMoving()};
    });
  });
  server.records.push(cue(1, { special_commands:'Begin' }));
  await poll(page);
  await page.waitForFunction(() => window.beginColourSamples.before);
  const before=await page.evaluate(() => window.beginColourSamples.before);
  expect(before.coloured).toBeGreaterThan(.65);
  expect(before.white).toBeLessThan(.15);
  await applied(page,1);
  await page.waitForFunction(() => !GeoGlyphMapEngine.state.pendingBuild && !GeoGlyphMapEngine.state.rebuilding);
  const samples=await page.evaluate(() => ({...window.beginColourSamples,after:window.sampleBeginColours()}));
  expect(samples.mid.moving).toBe(true);
  expect(samples.mid.yellowPixels).toBeGreaterThan(50);
  for(const sample of [samples.mid,samples.after]) {
    expect(sample.coloured).toBeGreaterThan(.65);
    expect(sample.white).toBeLessThan(.15);
  }
  expect(samples.before.width).toBe(samples.after.width);
  expect(samples.before.height).toBe(samples.after.height);
  require('node:fs').writeFileSync(path.resolve(__dirname,'../../validation/intro-colour-samples.json'),JSON.stringify(samples,null,2)+'\n');
});

test('Begin waits for a delayed sleeping-emoji draw before starting its flight', async ({ page }) => {
  const server = await open(page, { overview:true, portable:true });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.evaluate(() => {
    const service = GeoGlyphFontService;
    const gate = new Promise(resolve => { window.releaseSleepingFace = resolve; });
    window.sleepingFaceEntered = false;
    window.GeoGlyphFontService = { ...service, ensureFace:async (...args) => {
      window.sleepingFaceEntered = true;
      await gate;
      return service.ensureFace(...args);
    } };
  });
  const zoom = await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom());
  server.records.push(cue(1, { special_commands:'Begin' }));
  await poll(page);
  await page.waitForFunction(() => window.sleepingFaceEntered);
  expect((await snapshot(page)).history.map(item => item.phase)).toEqual(['started']);
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom())).toBeCloseTo(zoom, 8);
  await page.evaluate(() => window.releaseSleepingFace());
  await applied(page, 1);
  expect((await snapshot(page)).history.map(item => item.phase)).toEqual(['started','drawn','flight','fit','applied']);
});

test('Reset interrupts a flight, drops preceding queued messages and prevents a late camera move', async ({ page }) => {
  const server = await open(page, { overview:true });
  server.records.push(cue(1, { special_commands:'Begin' }));
  await poll(page);
  await page.waitForFunction(() => GeoGlyphConference.state.history.some(item => item.phase === 'flight'));
  server.records.push(cue(2, { geoglyph_speaks:'DISCARD' }), cue(3, { special_commands:'Reset', emojis:'👋' }, [140,-36]));
  await poll(page);
  await applied(page, 3);
  await expectAustralia(page);
  const before = await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom());
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom())).toBeCloseTo(before, 8);
  const state = await snapshot(page);
  expect(state.content).toEqual({ kind:'emoji', message:'😴' });
  expect(state.anchor).toEqual({ lng:138.6007, lat:-34.9285 });
  expect(state.history.some(item => item.objectId === 2)).toBe(false);
  expect(state.history.some(item => item.objectId === 1 && item.phase === 'applied')).toBe(false);
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  // A second introduction remains usable after cancellation, including reduced motion.
  await page.emulateMedia({ reducedMotion:'reduce' });
  await submit(page, server, cue(4, { special_commands:'Begin' }));
  expect(await page.evaluate(() => GeoGlyphConference.state.phase)).toBe('live');
});

test('Reset does not wait for a superseded font model to load', async ({ page }) => {
  const server = await open(page, { records:[cue(1, { geoglyph_speaks:'BEFORE', _2d_or_3d:'3D' })] });
  await applied(page, 1);
  await gateModel(page, 'DELAYED');
  server.records.push(cue(2, { geoglyph_speaks:'DELAYED' }));
  await poll(page);
  await page.waitForFunction(() => window.conferenceModelEntered);
  server.records.push(cue(3, { special_commands:'Reset' }));
  await poll(page);
  await page.waitForFunction(() => GeoGlyphConference.state.lastAppliedId === 3, null, { timeout:5000 });
  await page.evaluate(() => window.releaseConferenceModel());
  await page.waitForTimeout(250);
  await expectAustralia(page);
  const state = await snapshot(page);
  expect(state.content.message).toBe('😴');
  expect(state.extrusion).toBe(false);
  expect(state.history.some(item => item.objectId === 2 && item.phase === 'applied')).toBe(false);
  expect(await page.evaluate(() => [GeoGlyphMapEngine.state.rebuilding, GeoGlyphMapEngine.state.conferenceApplying, GeoGlyphConference.state.applying])).toEqual([false,false,false]);
});

test('leaving Map during Begin releases the introduction so it can be started again', async ({ page }) => {
  const server = await open(page, { overview:true });
  server.records.push(cue(1, { special_commands:'Begin' }));
  await poll(page);
  await page.waitForFunction(() => GeoGlyphConference.state.history.some(item => item.phase === 'flight'));
  await page.evaluate(() => GeoGlyphMapEngine.showCanvas());
  await page.waitForFunction(() => GeoGlyphConference.state.phase === 'overview' && !GeoGlyphConference.state.applying);
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.evaluate(() => GeoGlyphMapEngine.startPolling());
  await submit(page, server, cue(2, { special_commands:'Begin' }));
  expect(await page.evaluate(() => GeoGlyphConference.state.phase)).toBe('live');
});

for (const animation of ['Orbit','Turn','Face']) test(`Reset restores the opening after ${animation} and keeps polling`, async ({ page }) => {
  const server = await open(page, { records:[cue(1, { geoglyph_speaks:'LOCATE', animation,
    _size_size:'Large', choose_a_font_font:'Forte', choose_a_colour_colour:'Pink' }, [140,-36])] });
  await applied(page, 1);
  expect((await snapshot(page)).animation.orbiting).toBe(true);
  await submit(page, server, cue(2, { special_commands:'RESET', fit:'Fit' }));
  await expectAustralia(page);
  const state = await snapshot(page);
  expect(state.content.message).toBe('😴');
  expect(state.nativeColor).toBe(true);
  expect(state.extrusion).toBe(false);
  expect(state.height).toBe(300);
  expect(state.depth).toBe(30);
  expect(state.animation.orbiting).toBe(false);
  expect(state.anchor).toEqual({ lng:138.6007, lat:-34.9285 });
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
});

test('overview suppresses automatic Fit and animation; reduced-motion Begin restores the opening at its anchor', async ({ page }) => {
  await page.setViewportSize({ width:1000, height:720 });
  const server = await open(page, { overview:true });
  await expectAustralia(page);
  const zoom = await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom());
  await submit(page, server, cue(1, { geoglyph_speaks:'WAIT', animation:'Face', fit:'Fit' }, [139,-35]));
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom())).toBeCloseTo(zoom, 8);
  expect((await snapshot(page)).animation.orbiting).toBe(false);
  await page.emulateMedia({ reducedMotion:'reduce' });
  await submit(page, server, cue(2, { SPECIAL_COMMANDS:'bEgIn' }));
  const state = await snapshot(page);
  expect(state.content).toEqual({ kind:'emoji', message:'😴' });
  expect(state.extrusion).toBe(false);
  expect(state.nativeColor).toBe(true);
  expect(state.anchor).toEqual({ lng:139, lat:-35 });
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.map.getZoom())).toBeGreaterThan(10);
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.map.isMoving())).toBe(false);
});

test('modular startup opens a collapsed Map with emoji defaults and anonymous polling even with no responses', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { window.conferenceLocalFontCalls = 0; window.queryLocalFonts = () => { window.conferenceLocalFontCalls++; throw new Error('Conference fonts must be bundled'); }; });
  const server = await open(page, { overview:true });
  expect(await page.evaluate(() => window.conferenceLocalFontCalls)).toBe(0);
  await expect(page.locator('#geoglyphMapEditor')).toHaveClass(/is-collapsed/);
  await expect(page.locator('#mapArcgisInterval')).toHaveValue('1');
  const state = await page.evaluate(() => ({
    preview: GeoGlyphMapEngine.state.previewActive, mode: GeoGlyphMapEngine.state.mode,
    polling: GeoGlyphMapEngine.state.arcgisPolling, font: GeoGlyphMapEngine.state.selectedFontId,
    emoji: GeoGlyphConference.state.fontIds['Segoe UI Emoji'], native: GeoGlyphMapEngine.state.nativeColor,
    extrusion: GeoGlyphMapEngine.state.extrusionEnabled, fontCount: Object.keys(GeoGlyphConference.state.fontIds).length
  }));
  expect(state).toEqual({ preview: true, mode: 'arcgis', polling: true, font: state.emoji, emoji: state.emoji, native: true, extrusion: false, fontCount: 6 });
  await expect.poll(() => server.queries.length).toBeGreaterThan(0);
  for (const request of server.requests) {
    expect(request.params.has('token')).toBe(false);
    expect(request.headers.authorization).toBeUndefined();
    expect(request.headers.cookie).toBeUndefined();
  }
  expect(errors).toEqual([]);
});

test('modular file startup can load conference fonts without fetch access to local files', async ({ page }) => {
  const fontRequests = [];
  page.on('request', request => { if (/\/fonts\/.*\.(ttf|otf)$/i.test(request.url())) fontRequests.push(request.url()); });
  await open(page, { localModular:true, overview:true });
  await expectAustralia(page);
  expect(await page.evaluate(() => GeoGlyphConference.state.error)).toBe('');
  expect((await snapshot(page)).content.message).toBe('😴');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.displayedFontId)).toBe(await page.evaluate(() => GeoGlyphConference.state.fontIds['Segoe UI Emoji']));
  expect(fontRequests).toEqual([]);
});

test('an unavailable local font pack explains how to open or rebuild the app', async ({ page }) => {
  await page.route('**/conference-font-data.js', route => route.abort());
  await expect(open(page, { localModular:true, overview:true })).rejects.toThrow(/Could not load the local font pack.*GeoGlyph_Locate_2026.html/);
  await expect(page.locator('#mapArcgisLiveValue')).toContainText('local font pack');
});

test('HTTP font acquisition failures identify the bundled font instead of only Failed to fetch', async ({ page }) => {
  await page.route('**/src/fonts/seguiemj.ttf', route => route.abort());
  await expect(open(page, { overview:true })).rejects.toThrow(/Could not load bundled font Segoe UI Emoji/);
  expect(await page.evaluate(() => GeoGlyphConference.state.ready)).toBe(false);
});

test('portable startup holds Australia and ignores historical commands and content', async ({ page }) => {
  const server = await open(page, { portable:true, overview:true, records:[cue(1, { special_commands:'Begin' }), cue(2, { special_commands:'Reset', emojis:'👋' }, [138.6, -34.9])] });
  const before = await snapshot(page);
  expect(before.content).toEqual({ kind: 'emoji', message: '😴' });
  expect(before.nativeColor).toBe(true);
  expect(before.extrusion).toBe(false);
  expect(before.height).toBe(300);
  expect(before.anchor).toEqual({ lng: 138.6007, lat: -34.9285 });
  expect(server.queries[0].get('orderByFields')).toMatch(/CreationDate DESC.*objectid DESC/i);
  expect(server.queries[0].get('returnGeometry')).toBe('true');
  expect(server.queries[0].get('outSR')).toBe('4326');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.initialFitCount)).toBe(0);
  await poll(page);
  await expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
  expect((await snapshot(page)).history).toEqual([]);
  expect(await page.evaluate(() => ({ phase:GeoGlyphConference.state.phase, cursor:GeoGlyphConference.state.lastQueuedId }))).toEqual({ phase:'overview', cursor:2 });
});

test('emoji cues override text styling, 3D and animation while still applying point, size and Fit', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'LOCATE', choose_a_font_font: 'Forte', animation: 'Turn' })] });
  await applied(page, 1);
  expect((await snapshot(page)).animation.orbiting).toBe(true);
  await submit(page, server, cue(2, { emojis: '😴', geoglyph_speaks: 'Ignored', random_font: 'Yes', choose_a_font_font: 'Chiller',
    choose_a_colour_colour: 'Orange', _2d_or_3d: '3D', animation: 'Face', _size_size: 'Medium', fit: 'Fit' }, [139, -35]));
  const state = await snapshot(page);
  expect(state.content).toEqual({ kind: 'emoji', message: '😴' });
  expect(state.displayedFont).toBe(await page.evaluate(() => GeoGlyphConference.state.fontIds['Segoe UI Emoji']));
  expect(state.nativeColor).toBe(true);
  expect(state.extrusion).toBe(false);
  expect(state.animation.orbiting).toBe(false);
  expect(state.height).toBe(3000);
  expect(state.depth).toBe(300);
  expect(state.anchor).toEqual({ lng: 139, lat: -35 });
  const phases = state.history.filter(item => item.objectId === 2).map(item => item.phase);
  expect(phases.indexOf('drawn')).toBeLessThan(phases.indexOf('fit'));
  expect(phases.at(-1)).toBe('applied');
});

test('text prioritises speech and restores the last text font after emoji while applying the bright fill', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'HELLO', choose_a_font_font: 'Chiller', choose_a_colour_colour: 'Orange' })] });
  await applied(page, 1);
  const first = await snapshot(page);
  expect(first.fill.toUpperCase()).toBe('#F47D22');
  await submit(page, server, cue(2, { emojis: '👋' }));
  await submit(page, server, cue(3, { geoglyph_speaks: 'Speech wins', whats_on_your_mind: 'Ignored', choose_a_colour_colour: 'Pink' }));
  const state = await snapshot(page);
  expect(state.content).toEqual({ kind: 'text', message: 'Speech wins' });
  expect(state.font).toBe(first.font);
  expect(state.nativeColor).toBe(false);
  expect(state.fill.toUpperCase()).toBe('#FF6288');
  expect(state.outline).toBe(first.outline);
  await submit(page, server, cue(4, { whats_on_your_mind: 'Fallback thought' }));
  expect((await snapshot(page)).content.message).toBe('Fallback thought');
});

test('new submission IDs randomise only approved text fonts once, even for identical messages', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'SAME' })] });
  await applied(page, 1);
  const ids = await page.evaluate(() => ({ ...GeoGlyphConference.state.fontIds }));
  const eligible = ['Gill Sans', 'Forte', 'Chiller', 'Magneto', 'Showcard Gothic'].map(name => ids[name]);
  let previous = (await snapshot(page)).font;
  for (let id = 2; id <= 5; id++) {
    await submit(page, server, cue(id, { geoglyph_speaks: 'SAME', random_font: 'Yes', choose_a_font_font: 'Forte' }));
    const current = (await snapshot(page)).font;
    expect(eligible).toContain(current);
    expect(current).not.toBe(ids['Segoe UI Emoji']);
    expect(current).not.toBe(previous);
    previous = current;
  }
  const before = await snapshot(page);
  await poll(page);
  await expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
  const after = await snapshot(page);
  expect(after.font).toBe(before.font);
  expect(after.history.filter(item => item.phase === 'applied').map(item => item.objectId)).toEqual([1, 2, 3, 4, 5]);
});

test('controls-only cues retain content and an existing emoji keeps its drawing restrictions', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { emojis: '😴' })] });
  await applied(page, 1);
  await submit(page, server, cue(2, { _2d_or_3d: '3D', animation: 'Orbit', random_font: 'Yes', _size_size: 'Medium' }));
  const emoji = await snapshot(page);
  expect(emoji.content).toEqual({ kind: 'emoji', message: '😴' });
  expect(emoji.extrusion).toBe(false);
  expect(emoji.nativeColor).toBe(true);
  expect(emoji.height).toBe(3000);
  await submit(page, server, cue(3, { geoglyph_speaks: 'TEXT', choose_a_font_font: 'Magneto' }));
  await submit(page, server, cue(4, { _2d_or_3d: '3D', choose_a_colour_colour: 'Yellow' }));
  const text = await snapshot(page);
  expect(text.content).toEqual({ kind: 'text', message: 'TEXT' });
  expect(text.extrusion).toBe(true);
  expect(text.fill.toUpperCase()).toBe('#FFDF3A');
});

test('a paginated burst is rendered in Object ID order without dropping or replaying cues', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'START' })] });
  await applied(page, 1);
  server.records.push(...[2, 3, 4, 5, 6, 7].map(id => cue(id, { geoglyph_speaks: `CUE ${id}` })));
  await poll(page);
  await applied(page, 7);
  const history = (await snapshot(page)).history;
  expect(history.filter(item => item.phase === 'applied').map(item => item.objectId)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  expect(history.filter(item => item.phase === 'failed')).toEqual([]);
  const ascending = server.queries.filter(params => /objectid ASC/i.test(params.get('orderByFields') || ''));
  expect(ascending.length).toBeGreaterThanOrEqual(3);
  expect(ascending.every(params => params.get('returnGeometry') === 'true')).toBe(true);
  expect((await snapshot(page)).content.message).toBe('CUE 7');
});

test('2D and Fit wait for the requested font model to finish drawing', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'BEFORE', _2d_or_3d: '3D' })] });
  await applied(page, 1);
  await gateModel(page, 'Await draw');
  server.records.push(cue(2, { geoglyph_speaks: 'Await draw', _2d_or_3d: '2D', fit: 'Fit' }, [139.5, -35.5]));
  await poll(page);
  await page.waitForFunction(() => window.conferenceModelEntered);
  expect(await page.evaluate(() => window.conferenceModeAtModel)).toBe(false);
  expect(await page.evaluate(() => GeoGlyphConference.state.lastAppliedId)).toBe(1);
  const blocked = (await snapshot(page)).history.filter(item => item.objectId === 2).map(item => item.phase);
  expect(blocked).toContain('started');
  expect(blocked).not.toContain('drawn');
  expect(blocked).not.toContain('fit');
  await page.evaluate(() => window.releaseConferenceModel());
  await applied(page, 2);
  const finished = await snapshot(page);
  expect(finished.history.filter(item => item.objectId === 2).map(item => item.phase)).toEqual(['started', 'drawn', 'fit', 'applied']);
  expect(finished.anchor).toEqual({ lng: 139.5, lat: -35.5 });
  expect(finished.extrusion).toBe(false);
});

test('animation selections ensure the chosen mode runs, override 2D and continue through blank selections', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'ORBIT', _2d_or_3d: '2D', animation: 'Orbit', fit: 'Fit' })] });
  await applied(page, 1);
  for (const [id, animation, orientation] of [[2, 'Orbit', 'fixed'], [3, 'Turn', 'yaw'], [4, 'Face', 'billboard']]) {
    await submit(page, server, cue(id, { geoglyph_speaks: animation.toUpperCase(), _2d_or_3d: '2D', animation }));
    const current = await snapshot(page);
    expect(current.extrusion).toBe(true);
    expect(current.orientation).toBe(orientation);
    expect(current.animation.orbiting).toBe(true);
  }
  await submit(page, server, cue(5, { geoglyph_speaks: 'LOCATE', choose_a_font_font: 'Forte' }));
  expect((await snapshot(page)).animation.orbiting).toBe(true);
  await submit(page, server, cue(6, { fit: 'Fit' }));
  expect((await snapshot(page)).animation.orbiting).toBe(false);
  const phases = (await snapshot(page)).history.filter(item => item.objectId === 1).map(item => item.phase);
  expect(phases.indexOf('fit')).toBeLessThan(phases.indexOf('animation'));
});

test('all four size presets remain exact in 2D and 3D and Huge survives settings restoration', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'A', _size_size: 'Small' })] });
  await applied(page, 1);
  let id = 1;
  for (const [size, height, depth] of [['Small', 300, 30], ['Medium', 3000, 300], ['Large', 30000, 3000], ['Huge', 300000, 6000]]) {
    for (const mode of ['2D', '3D']) {
      await submit(page, server, cue(++id, { _size_size: size, _2d_or_3d: mode }));
      const state = await snapshot(page);
      expect(state.height).toBe(height);
      expect(state.depth).toBe(depth);
      expect(state.extrusion).toBe(mode === '3D');
      expect(state.relativeSize).toBe(100);
    }
  }
  const saved = await page.evaluate(() => GeoGlyphUi.collectMapSettings());
  expect(saved.baseHeightMeters).toBe(300000);
  expect(saved.extrusionDepthMeters).toBe(6000);
  await page.evaluate(settings => {
    GeoGlyphMapEngine.state.baseHeightMeters = 300;
    GeoGlyphMapEngine.state.extrusionDepthMeters = 30;
    GeoGlyphUi.applyMapSettings(settings);
  }, saved);
  await expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.baseHeightMeters)).toBe(300000);
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.extrusionDepthMeters)).toBe(6000);
});

test('manual placement survives repeated polls until a new cue supplies another survey point', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { emojis: '😴' }, [138.6, -34.9])] });
  await applied(page, 1);
  await page.evaluate(() => GeoGlyphMapEngine.state.map.fire('click', { lngLat: { lng: 140, lat: -36 } }));
  await expect.poll(() => page.evaluate(() => ({ ...GeoGlyphMapEngine.state.anchor }))).toEqual({ lng: 140, lat: -36 });
  await poll(page);
  await expect.poll(() => page.evaluate(() => GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
  expect((await snapshot(page)).anchor).toEqual({ lng: 140, lat: -36 });
  await submit(page, server, cue(2, { emojis: '👋' }));
  expect((await snapshot(page)).anchor).toEqual({ lng: 140, lat: -36 });
  await submit(page, server, cue(3, { emojis: '😴' }, [139, -35]));
  expect((await snapshot(page)).anchor).toEqual({ lng: 139, lat: -35 });
});

test('Stop lets an accepted cue finish and Resume drains queued submissions without replay', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'START' })] });
  await applied(page, 1);
  await gateModel(page, 'BLOCKED');
  server.records.push(cue(2, { geoglyph_speaks: 'BLOCKED' }), cue(3, { geoglyph_speaks: 'NEXT' }), cue(4, { geoglyph_speaks: 'LAST' }));
  await poll(page);
  await page.waitForFunction(() => window.conferenceModelEntered && GeoGlyphConference.state.lastQueuedId === 4);
  await page.locator('#mapArcgisStopBtn').evaluate(button => button.click());
  await page.evaluate(() => window.releaseConferenceModel());
  await applied(page, 2);
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  expect(await page.evaluate(() => GeoGlyphConference.state.queue.length)).toBe(2);
  const queryCount = server.queries.length;
  await page.waitForTimeout(1200);
  expect(server.queries.length).toBe(queryCount);
  expect(await page.evaluate(() => GeoGlyphConference.state.lastAppliedId)).toBe(2);
  await page.locator('#mapArcgisStartBtn').evaluate(button => button.click());
  await applied(page, 4);
  expect((await snapshot(page)).history.filter(item => item.phase === 'applied').map(item => item.objectId)).toEqual([1, 2, 3, 4]);
});

test('an unsupported 3D outline preserves the previous display and does not block later cues', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'LOCATE', _2d_or_3d: '3D' })] });
  await applied(page, 1);
  const before = await snapshot(page);
  server.records.push(cue(2, { geoglyph_speaks: 'CONTINUE', choose_a_font_font: 'Forte', _2d_or_3d: '3D' }));
  await poll(page);
  await page.waitForFunction(() => GeoGlyphConference.state.history.some(item => item.objectId === 2 && item.phase === 'failed'));
  const after = await snapshot(page);
  expect(after.content).toEqual(before.content);
  expect(after.displayedFont).toBe(before.displayedFont);
  expect(await page.evaluate(() => [GeoGlyphMapEngine.state.message, GeoGlyphMapEngine.state.arcgisMessage])).toEqual(['LOCATE', 'LOCATE']);
  await submit(page, server, cue(3, { emojis: '😎' }));
  expect((await snapshot(page)).content.message).toBe('😎');
});

test('random 3D selection skips incompatible outlines using the normal rendering policy', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { geoglyph_speaks: 'START', _2d_or_3d: '3D' })] });
  await applied(page, 1);
  await page.evaluate(() => { Math.random = () => 0; });
  await submit(page, server, cue(2, { geoglyph_speaks: 'CONTINUE', random_font: 'Yes', _2d_or_3d: '3D' }));
  expect((await snapshot(page)).font).not.toBe(await page.evaluate(() => GeoGlyphConference.state.fontIds.Forte));
  expect((await snapshot(page)).extrusion).toBe(true);
});

test('a failed opening Fit leaves the startup fit available for the next valid cue', async ({ page }) => {
  const server = await open(page);
  await page.evaluate(() => {
    window.savedConference3D = GeoGlyph3D;
    window.GeoGlyph3D = { ...GeoGlyph3D, fitCurrent: () => false };
  });
  server.records.push(cue(1, { geoglyph_speaks: 'LOCATE', _2d_or_3d: '3D' }));
  await poll(page);
  await page.waitForFunction(() => GeoGlyphConference.state.history.some(item => item.objectId === 1 && item.phase === 'failed'));
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.initialFitCount)).toBe(0);
  await page.evaluate(() => { window.GeoGlyph3D = window.savedConference3D; });
  await submit(page, server, cue(2, { emojis: '😴' }));
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.initialFitCount)).toBe(1);
});

test('unanswered Survey123 location retains Adelaide at startup and manual placement on later cues', async ({ page }) => {
  const server = await open(page, { records: [cue(1, { emojis:'😴', fit:'Fit' }, [0,0])] });
  await applied(page, 1);
  expect((await snapshot(page)).anchor).toEqual({ lng:138.6007, lat:-34.9285 });
  const center = await page.evaluate(() => GeoGlyphMapEngine.state.map.getCenter().toArray());
  expect(center[0]).toBeCloseTo(138.6007, 2);
  expect(center[1]).toBeCloseTo(-34.9285, 2);
  await page.evaluate(() => GeoGlyphMapEngine.state.map.fire('click', { lngLat:{ lng:140, lat:-36 } }));
  await submit(page, server, cue(2, { emojis:'😎', fit:'Fit' }, [0,0]));
  expect((await snapshot(page)).anchor).toEqual({ lng:140, lat:-36 });
  await submit(page, server, cue(3, { emojis:'😴', fit:'Fit' }, [139,-35]));
  expect((await snapshot(page)).anchor).toEqual({ lng:139, lat:-35 });
});

test('every new content submission fits once, including identical text, but unchanged polls and controls do not', async ({ page }) => {
  const server = await open(page, { records:[cue(1,{ emojis:'😴' })] });
  await applied(page,1);
  for (const [id, attributes] of [[2,{ emojis:'😎' }], [3,{ geoglyph_speaks:'HELLO' }],
      [4,{ whats_on_your_mind:'HELLO' }], [5,{ whats_on_your_mind:'HELLO', fit:'Fit' }]]) {
    await submit(page,server,cue(id,attributes));
    const phases = (await snapshot(page)).history.filter(item=>item.objectId===id).map(item=>item.phase);
    expect(phases).toEqual(['started','drawn','fit','applied']);
  }
  await submit(page,server,cue(6,{ choose_a_colour_colour:'Orange' }));
  expect((await snapshot(page)).history.filter(item=>item.objectId===6).map(item=>item.phase)).toEqual(['started','drawn','applied']);
  const before = (await snapshot(page)).history;
  await poll(page);
  await expect.poll(()=>page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
  expect((await snapshot(page)).history).toEqual(before);
});

test('automatic Fit waits for a delayed new message after switching from 3D to 2D', async ({ page }) => {
  const server = await open(page,{ records:[cue(1,{ geoglyph_speaks:'BEFORE', _2d_or_3d:'3D' })] });
  await applied(page,1);
  await gateModel(page,'AUTOMATIC');
  server.records.push(cue(2,{ geoglyph_speaks:'AUTOMATIC', _2d_or_3d:'2D' }));
  await poll(page);
  await page.waitForFunction(()=>window.conferenceModelEntered);
  expect(await page.evaluate(()=>window.conferenceModeAtModel)).toBe(false);
  expect((await snapshot(page)).history.filter(item=>item.objectId===2).map(item=>item.phase)).toEqual(['started']);
  await page.evaluate(()=>window.releaseConferenceModel());
  await applied(page,2);
  expect((await snapshot(page)).history.filter(item=>item.objectId===2).map(item=>item.phase)).toEqual(['started','drawn','fit','applied']);
});

test('explicit controls-only Fit waits for the requested 3D mesh before fitting', async ({ page }) => {
  const server = await open(page,{ records:[cue(1,{ geoglyph_speaks:'HELLO' })] });
  await applied(page,1);
  await page.evaluate(()=>{
    const api=GeoGlyph3D;
    window.conferenceMeshEntered=false;
    window.GeoGlyph3D={...api,prepare:async(...args)=>{
      if(!window.conferenceMeshEntered){window.conferenceMeshEntered=true;await new Promise(resolve=>{window.releaseConferenceMesh=resolve;});}
      return api.prepare(...args);
    }};
  });
  server.records.push(cue(2,{ _2d_or_3d:'3D', fit:'Fit' }));
  await poll(page);
  await page.waitForFunction(()=>window.conferenceMeshEntered);
  expect((await snapshot(page)).history.filter(item=>item.objectId===2).map(item=>item.phase)).toEqual(['started']);
  await page.evaluate(()=>window.releaseConferenceMesh());
  await applied(page,2);
  expect((await snapshot(page)).extrusion).toBe(true);
  expect((await snapshot(page)).history.filter(item=>item.objectId===2).map(item=>item.phase)).toEqual(['started','drawn','fit','applied']);
});

test('automatic message fits preserve an active animation through framing, while explicit Fit stops it', async ({ page }) => {
  const server = await open(page,{ records:[cue(1,{ geoglyph_speaks:'HELLO', animation:'Turn' })] });
  await applied(page,1);
  await page.evaluate(()=>{
    window.conferenceFitFrames=[];
    GeoGlyphMapEngine.state.map.on('move',()=>{
      if(GeoGlyphConference.state.applying){const a=GeoGlyph3D.stats().animation;
        if(a.phase==='framing')window.conferenceFitFrames.push(a.orbiting);
      }
    });
  });
  await submit(page,server,cue(2,{ whats_on_your_mind:'LOCATE' }));
  expect((await snapshot(page)).animation.orbiting).toBe(true);
  expect((await snapshot(page)).orientation).toBe('yaw');
  const frames=await page.evaluate(()=>window.conferenceFitFrames);
  expect(frames.length).toBeGreaterThan(0);
  expect(frames.every(Boolean)).toBe(true);
  await submit(page,server,cue(3,{ whats_on_your_mind:'HELLO', fit:'Fit' }));
  expect((await snapshot(page)).animation.orbiting).toBe(false);
  expect((await snapshot(page)).history.filter(item=>item.objectId===3&&item.phase==='fit')).toHaveLength(1);
});

test('slow basemap tiles do not block startup, polling or the first glyph Fit', async ({ page }) => {
  const server = await open(page, { delayTiles: true, records: [cue(1, { emojis: '😴' })] });
  try {
    await applied(page, 1);
    expect((await snapshot(page)).content.message).toBe('😴');
    expect(await page.evaluate(() => GeoGlyphMapEngine.state.initialFitCount)).toBe(1);
  } finally { server.releaseTiles(); }
});

for (const failure of ['read', 'write']) test(`Tier 1: denied storage ${failure} preserves startup and theme controls`, async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(kind => {
    if (kind === 'read') Object.defineProperty(window, 'localStorage', { configurable:true,
      get() { throw new DOMException('Synthetic denied storage', 'SecurityError'); } });
    else Storage.prototype.setItem = function () { throw new DOMException('Synthetic full storage', 'QuotaExceededError'); };
  }, failure);
  await open(page, { overview:true });
  await page.locator('#themeLightBtn').evaluate(button => button.click());
  expect(await page.evaluate(() => GeoGlyphStudio.state.theme)).toBe('light');
  expect(await page.evaluate(() => GeoGlyphConference.state.ready)).toBe(true);
  expect(errors).toEqual([]);
});

test('Tier 1: manual selection during a delayed cue releases rebuilding without another submission', async ({ page }) => {
  const server = await open(page, { records:[cue(1, { geoglyph_speaks:'INITIAL', _2d_or_3d:'3D' })] });
  await gateModel(page, 'DELAYED CUE');
  server.records.push(cue(2, { geoglyph_speaks:'DELAYED CUE' })); await poll(page);
  await page.waitForFunction(() => window.conferenceModelEntered);
  await page.evaluate(async () => {
    await GeoGlyphMapEngine.selectFont(GeoGlyphConference.state.fontIds['Magneto']);
    window.releaseConferenceModel();
  });
  await page.waitForFunction(() => {
    const s=GeoGlyphMapEngine.state;
    return !s.rebuilding && !s.conferenceApplying && !s.pendingBuild && s.displayedFontId===GeoGlyphConference.state.fontIds['Magneto'];
  });
  await page.evaluate(() => {
    GeoGlyphMapEngine.state.message='MANUAL AFTER CUE';
    GeoGlyphMapEngine.state.arcgisMessage='MANUAL AFTER CUE';
    GeoGlyphMapEngine.queueRebuild(false);
  });
  await page.waitForFunction(() => {
    const s=GeoGlyphMapEngine.state;
    return !s.rebuilding && !s.pendingBuild && s.committedSelection?.message==='MANUAL AFTER CUE';
  });
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.conferenceRebuildPending)).toBe(false);
  expect(await page.evaluate(() => GeoGlyph3D.isVisible())).toBe(true);
});

test('Tier 1: worker failure replaces the worker and renders the next text', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker=window.Worker;
    window.Worker=class extends NativeWorker {
      terminate() { this.regressionTerminated=true; return super.terminate(); }
      postMessage(message, ...rest) {
        if (message?.type==='model' && window.failNextFontWorker) {
          window.failNextFontWorker=false; window.regressionFailedWorker=this;
          setTimeout(() => this.onerror?.({message:'Synthetic worker failure'}), 0); return;
        }
        return super.postMessage(message, ...rest);
      }
    };
  });
  const server=await open(page, { records:[cue(1, {geoglyph_speaks:'FIRST', _2d_or_3d:'3D'})] });
  await page.evaluate(() => { window.failNextFontWorker=true; });
  await submit(page, server, cue(2, {geoglyph_speaks:'WORKER RECOVERED'}));
  expect(await page.evaluate(() => window.regressionFailedWorker?.regressionTerminated)).toBe(true);
  expect((await snapshot(page)).content.message).toBe('WORKER RECOVERED');
  expect(await page.evaluate(() => GeoGlyph3D.isVisible())).toBe(true);
});

test('Tier 1: Start recovers failed font startup without duplicate fonts or reload', async ({ page }) => {
  let unavailable=true, attempts=0;
  await page.route('**/src/fonts/seguiemj.ttf', route => {
    attempts++;
    return unavailable ? route.fulfill({status:404,body:'Synthetic font failure'}) : route.continue();
  });
  await expect(open(page, {overview:true})).rejects.toThrow(/HTTP 404/);
  expect(attempts).toBe(1); unavailable=false;
  await page.locator('#mapArcgisStartBtn').evaluate(button => button.click());
  await page.waitForFunction(() => GeoGlyphConference.state.ready && GeoGlyphConference.state.baselined);
  expect(attempts).toBe(2);
  expect(await page.evaluate(() => GeoGlyphStudio.state.fonts.filter(font => font.source==='conference').length)).toBe(6);
  expect(await page.evaluate(() => GeoGlyphConference.state.error)).toBe('');
  expect(await page.evaluate(() => GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  expect(await page.evaluate(() => GeoGlyphConference.retryStartup())).toBe(true);
  expect(attempts).toBe(2);
});
