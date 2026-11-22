const { test, expect } = require('./studio-fixture.cjs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// Use the shipped fonts and mocked tiles so these tests require neither Local
// Font Access permission nor a live survey or basemap service.
const tile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');

async function settled(page) {
  await page.waitForFunction(() => {
    const s = GeoGlyphMapEngine.state;
    return s.mapReady && !s.pendingBuild && !s.rebuilding &&
      !s.explicitFitPending && GeoGlyph3D.stats().animation.phase !== 'framing';
  });
}

async function open(page, message = 'B8 i\nMorph', url = '/') {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', entry => {
    if (entry.type() === 'error' && /shader|GL_INVALID|WebGL|THREE/i.test(entry.text())) errors.push(entry.text());
  });
  await page.route('**/MapServer/tile/**', route => route.fulfill({ body: tile, contentType: 'image/png' }));
  await page.goto(url);
  await page.waitForFunction(() => window.GeoGlyphFontMorph && window.GeoGlyphMapEngine && window.GeoGlyph3D);
  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.waitForFunction(() => GeoGlyphMapEngine.state.mapReady);
  const fonts = await page.evaluate(async text => {
    await GeoGlyphFontMorph.ensureBuiltins();
    const s = GeoGlyphMapEngine.state;
    const source = [...s.fontRecords.values()].find(font => font.fontResourceKey === 'conference:Gill Sans');
    const target = [...s.fontRecords.values()].find(font => font.fontResourceKey === 'conference:Forte');
    if (!source || !target) throw Error('Shipped morph fixtures were not registered');
    Object.assign(s, { mode: 'message', message: text, nativeColor: false, fill: '#F00000', outline: '#FFFFFF', outlineWidth: 0, opacity: 1 });
    await GeoGlyphMapEngine.selectFont(source.id);
    GeoGlyphMapEngine.refreshControls();
    return { source: source.id, target: target.id };
  }, message);
  await settled(page);
  await page.evaluate(() => GeoGlyphMapEngine.fit());
  await page.waitForFunction(() => !GeoGlyphMapEngine.state.map.isMoving());
  return { fonts, errors };
}

async function ink(page) {
  return page.evaluate(() => new Promise(resolve => {
    const map = GeoGlyphMapEngine.state.map;
    map.once('render', () => {
      const gl = map.getCanvas().getContext('webgl2');
      const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let count = 0, hash = 2166136261;
      for (let i = 0; i < pixels.length; i += 4) {
        const present = pixels[i] > 100 && pixels[i] > pixels[i + 1] * 1.7 && pixels[i] > pixels[i + 2] * 1.7;
        if (present) { count++; hash = Math.imul(hash ^ (i >>> 2), 16777619); }
      }
      resolve({ count, hash: hash >>> 0 });
    });
    map.triggerRepaint();
  }));
}

async function captureControls(page, path) {
  await page.evaluate(() => {
    GeoGlyphMapSidebar.setPresentation('full');
    const sidebar = document.getElementById('mapControlSidebar'), panel = document.getElementById('mapMorphPanel');
    sidebar.scrollTop = Math.max(0, panel.offsetTop - 100);
  });
  await page.screenshot({ path });
}

test('built-in map fonts reshape in 2D and scrubbing retains one renderer and stable anchor', async ({ page }) => {
  const { fonts, errors } = await open(page);
  await expect(page.locator('#mapMorphTarget')).toBeVisible();
  await expect(page.locator('#mapMorphDuration')).toHaveValue('2');
  await page.locator('#mapMorphTarget').selectOption(fonts.target);
  await expect.poll(() => page.evaluate(() => GeoGlyphFontMorph.stats().ready)).toBe(true);
  const before = await page.evaluate(() => ({ anchor: { ...GeoGlyphMapEngine.state.anchor }, stats: GeoGlyphFontMorph.stats() }));
  const samples = [];
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate(value => GeoGlyphFontMorph.seek(value), progress);
    samples.push(await ink(page));
  }
  samples.forEach(sample => expect(sample.count).toBeGreaterThan(20));
  expect(new Set(samples.map(sample => sample.hash)).size).toBe(samples.length);
  const after = await page.evaluate(() => ({ anchor: { ...GeoGlyphMapEngine.state.anchor }, stats: GeoGlyphFontMorph.stats() }));
  expect(after.anchor).toEqual(before.anchor);
  expect(after.stats.progress).toBe(1);
  expect(after.stats.renderer.uploads).toBe(before.stats.renderer.uploads);
  await page.evaluate(() => GeoGlyphFontMorph.seek(0.5));
  await captureControls(page, '/tmp/geoglyph-font-morph-2d.png');
  expect(errors).toEqual([]);
});

test('an incompatible emoji source can be replaced directly in the morph panel', async ({ page }) => {
  const {fonts,errors}=await open(page,'Morph');
  await page.evaluate(async()=>{
    const source=[...GeoGlyphMapEngine.state.fontRecords.values()].find(font=>/Segoe UI Emoji/i.test(font.name));
    if(!source)throw Error('Expected the default emoji font');
    await GeoGlyphMapEngine.selectFont(source.id);
    GeoGlyphMapEngine.refreshControls();
  });
  await settled(page);
  await page.locator('#mapFont3DFilter').check();
  await page.locator('#mapMorphTarget').selectOption(fonts.target);
  await expect(page.locator('#mapMorphSource')).toHaveValue('');
  await expect(page.locator('#mapMorphSource option')).toHaveCount(6);
  await expect(page.locator('#mapMorphStatus')).toContainText('Choose a From font');
  await expect(page.locator('#mapMorphStatus')).not.toContainText('Could not prepare');
  await expect(page.locator('#mapMorphPlay')).toBeDisabled();
  await expect(page.locator('#mapMorphPrepare')).toBeDisabled();
  await page.locator('#mapMorphSource').selectOption(fonts.source);
  await expect.poll(()=>page.evaluate(()=>GeoGlyphFontMorph.stats().ready)).toBe(true);
  await expect(page.locator('#mapFontSelect')).toHaveValue(fonts.source);
  await expect(page.locator('#mapMorphSource')).toHaveValue(fonts.source);
  await expect(page.locator('#mapMorphPlay')).toBeEnabled();
  await page.evaluate(()=>GeoGlyphFontMorph.seek(.5));
  expect((await ink(page)).count).toBeGreaterThan(20);
  expect(errors).toEqual([]);
});

test('play, pause, scrubbing and replay keep a deterministic progress state', async ({ page }) => {
  const { fonts, errors } = await open(page, 'Morph');
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(true);
  await page.locator('#mapMorphPlay').click();
  await expect.poll(() => page.evaluate(() => GeoGlyphFontMorph.stats().progress)).toBeGreaterThan(0.05);
  await page.evaluate(() => GeoGlyphFontMorph.pause());
  const paused = await page.evaluate(() => GeoGlyphFontMorph.stats().progress);
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => GeoGlyphFontMorph.stats().progress)).toBe(paused);
  await page.locator('#mapMorphProgress').evaluate(input => { input.value = '0.4'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  expect(await page.evaluate(() => GeoGlyphFontMorph.stats().progress)).toBeCloseTo(0.4);
  await page.evaluate(() => GeoGlyphFontMorph.play());
  await expect.poll(() => page.evaluate(() => GeoGlyphFontMorph.stats().progress), { timeout: 6000 }).toBe(1);
  expect(await page.evaluate(() => GeoGlyphFontMorph.stats().playing)).toBe(false);
  await page.locator('#mapMorphPlay').click();
  await expect.poll(() => page.evaluate(() => GeoGlyphFontMorph.stats().playing)).toBe(true);
  expect(await page.evaluate(() => GeoGlyphFontMorph.stats().progress)).toBeLessThan(1);
  await page.locator('#mapMorphClear').click();
  expect(await page.evaluate(() => GeoGlyphFontMorph.stats().ready)).toBe(false);
  expect(errors).toEqual([]);
});

test('switching flat and opaque 3D preserves morph progress and camera without fitting', async ({ page }) => {
  const { fonts, errors } = await open(page, 'Morph');
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(true);
  await page.evaluate(() => GeoGlyphFontMorph.seek(0.43));
  const result = await page.evaluate(async () => {
    const map = GeoGlyphMapEngine.state.map, camera = () => ({ center: { ...map.getCenter() }, zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() });
    const before = camera(), fits = [], originalEase = map.easeTo, api = window.GeoGlyph3D;
    map.easeTo = function (...args) { fits.push('easeTo'); return originalEase.apply(this, args); };
    window.GeoGlyph3D = { ...api, fitCurrent: (...args) => { fits.push('fitCurrent'); return api.fitCurrent(...args); } };
    try {
      const three = await GeoGlyphMapEngine.setModelMode(true), after3D = { progress: GeoGlyphFontMorph.stats().progress, ready: GeoGlyphFontMorph.stats().ready, camera: camera() };
      const flat = await GeoGlyphMapEngine.setModelMode(false), after2D = { progress: GeoGlyphFontMorph.stats().progress, ready: GeoGlyphFontMorph.stats().ready, camera: camera() };
      return { before, after3D, after2D, fits, three, flat };
    } finally { map.easeTo = originalEase; window.GeoGlyph3D = api; }
  });
  expect(result.three).toBe(true); expect(result.flat).toBe(true);
  expect(result.after3D.ready).toBe(true); expect(result.after2D.ready).toBe(true);
  expect(result.after3D.progress).toBeCloseTo(0.43); expect(result.after2D.progress).toBeCloseTo(0.43);
  expect(result.after3D.camera).toEqual(result.before); expect(result.after2D.camera).toEqual(result.before);
  expect(result.fits).toEqual([]);
  expect(errors).toEqual([]);
});

test('opaque 3D morphing preserves orbit phase without model builds or GPU uploads per frame', async ({ page }, info) => {
  test.setTimeout(45000);
  const { fonts, errors } = await open(page, 'B8 i Morph');
  expect(await page.evaluate(() => GeoGlyphMapEngine.setModelMode(true))).toBe(true);
  await settled(page);
  await page.evaluate(() => { GeoGlyphMapEngine.state.orientationMode = 'yaw'; GeoGlyph3D.ensureOrbit('yaw', { framed: true }); });
  await page.waitForFunction(() => GeoGlyph3D.stats().animation.phase === 'orbiting');
  const initial = await page.evaluate(() => ({ anchor: { ...GeoGlyphMapEngine.state.anchor }, animation: GeoGlyph3D.stats().animation }));
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(true);
  const result = await page.evaluate(async () => {
    const map = GeoGlyphMapEngine.state.map;
    const before = { morph: GeoGlyphFontMorph.stats(), render: GeoGlyph3D.stats(), worker: await GeoGlyphFontService.workerStats() };
    const intervals = [];
    let last = 0;
    const frame = () => { const now = performance.now(); if (last) intervals.push(now - last); last = now; };
    map.on('render', frame);
    GeoGlyphFontMorph.play();
    await new Promise(resolve => setTimeout(resolve, 700));
    GeoGlyphFontMorph.pause();
    map.off('render', frame);
    const after = { morph: GeoGlyphFontMorph.stats(), render: GeoGlyph3D.stats(), worker: await GeoGlyphFontService.workerStats() };
    return { before, after, intervals, anchor: { ...GeoGlyphMapEngine.state.anchor } };
  });
  expect(result.after.render.animation.phase).toBe('orbiting');
  expect(result.after.render.animation.frames).toBeGreaterThan(initial.animation.frames);
  expect(result.after.render.animation.bearing).toBeGreaterThan(result.before.render.animation.bearing);
  expect(result.after.render.animation.bearing - result.before.render.animation.bearing).toBeLessThan(45);
  expect(result.anchor).toEqual(initial.anchor);
  expect(result.after.morph.renderer.uploads).toBe(result.before.morph.renderer.uploads);
  expect(result.after.render.uploads).toBe(result.before.render.uploads);
  expect(result.after.worker.meshBuilds).toBe(result.before.worker.meshBuilds);
  expect(result.intervals.length).toBeGreaterThan(3);
  await info.attach('morph-orbit-frame-times', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
  for (const mode of ['fixed', 'billboard']) {
    await page.evaluate(value => { GeoGlyphMapEngine.state.orientationMode = value; GeoGlyphFontMorph.seek(0.5); }, mode);
    expect((await ink(page)).count).toBeGreaterThan(10);
    expect(await page.evaluate(() => GeoGlyph3D.stats().animation.phase)).toBe('orbiting');
  }
  await page.evaluate(() => { GeoGlyphMapEngine.state.orientationMode = 'yaw'; GeoGlyphFontMorph.seek(0.5); window.resumeMorphScreenshot = GeoGlyph3D.pauseAnimation(); });
  await ink(page);
  await captureControls(page, '/tmp/geoglyph-font-morph-3d.png');
  await page.evaluate(() => { window.resumeMorphScreenshot(); delete window.resumeMorphScreenshot; });
  await page.evaluate(() => GeoGlyph3D.stopOrbit());
  expect(errors).toEqual([]);
});

test('a 3D morph to different words commits the target without interrupting orbit', async ({ page }) => {
  const { errors } = await open(page, 'Same letters.');
  const target = await page.evaluate(() => [...GeoGlyphMapEngine.state.fontRecords.values()].find(font=>font.fontResourceKey==='conference:Showcard Gothic').id);
  expect(await page.evaluate(() => GeoGlyphMapEngine.setModelMode(true))).toBe(true);
  await settled(page);
  await page.evaluate(() => GeoGlyph3D.ensureOrbit('yaw', { framed:true }));
  await page.waitForFunction(() => GeoGlyph3D.stats().animation.phase === 'orbiting');
  const result = await page.evaluate(async target => {
    const state = GeoGlyphMapEngine.state;
    const anchor = { ...state.anchor };
    const frames = GeoGlyph3D.stats().animation.frames;
    const targetMessage = 'Different shapes.';
    const prepared = await GeoGlyphFontMorph.prepare(target, {targetMessage});
    if (!prepared) throw Error(GeoGlyphFontMorph.stats().error);
    const transitions = new Set();
    const map = state.map;
    const track = () => transitions.add(GeoGlyph3D.stats().animation.phase);
    map.on('render', track);
    try { await GeoGlyphFontMorph.playToEnd({duration:.4}); }
    finally { map.off('render', track); }
    return {anchor, frames, active:GeoGlyphFontMorph.isActive(), transitions:[...transitions], animation:GeoGlyph3D.stats().animation,
      afterAnchor:state.anchor, message:state.message, svgMessage:document.getElementById('mapMessage').value,
      renderedMessage:state.committedSelection.message, font:state.displayedFontId, visible:GeoGlyph3D.isVisible()};
  }, target);
  expect(result.message).toBe('Different shapes.');
  expect(result.renderedMessage).toBe(result.message);
  expect(result.svgMessage).toBe(result.message);
  expect(result.font).toBe(target);
  expect(result.visible).toBe(true);
  expect(result.active).toBe(false);
  expect(result.afterAnchor).toEqual(result.anchor);
  expect(result.transitions).toEqual(['orbiting']);
  expect(result.animation.phase).toBe('orbiting');
  expect(result.animation.frames).toBeGreaterThan(result.frames);
  expect(errors).toEqual([]);
});

test('bounded desktop profiles compare orbit alone, preparation, playback and scrubbing', async ({ page }, info) => {
  test.setTimeout(90000);
  const reports = [];
  for (const text of ['B8 i Morph', 'Morph B8\nFonts i']) {
    const { fonts, errors } = await open(page, text);
    expect(await page.evaluate(() => GeoGlyphMapEngine.setModelMode(true))).toBe(true);
    await settled(page);
    await page.evaluate(() => { GeoGlyphMapEngine.state.orientationMode = 'yaw'; GeoGlyph3D.ensureOrbit('yaw', { framed: true }); });
    await page.waitForFunction(() => GeoGlyph3D.stats().animation.phase === 'orbiting');
    const report = await page.evaluate(async ({ target, text }) => {
      const map = GeoGlyphMapEngine.state.map;
      async function capture(action, duration = 1200) {
        const intervals = [], bearings = [], longTasks = [];
        let last = 0, raf = 0;
        const frame = () => { const now = performance.now(); if (last) intervals.push(now - last); last = now; bearings.push(GeoGlyph3D.stats().animation.bearing); };
        const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration }))));
        observer.observe({ type: 'longtask', buffered: false });
        map.on('render', frame);
        const start = performance.now();
        try {
          if (action === 'prepare') {
            const prepared = await GeoGlyphFontMorph.prepare(target);
            if (!prepared) throw Error(GeoGlyphFontMorph.stats().error || 'Preparation failed');
            // Include first texture upload and shader use in this window.
            await new Promise(resolve => { map.once('render', resolve); map.triggerRepaint(); });
          } else {
            if (action === 'play') GeoGlyphFontMorph.play();
            if (action === 'scrub') {
              const tick = now => { GeoGlyphFontMorph.seek((Math.sin((now - start) / 400) + 1) / 2); raf = requestAnimationFrame(tick); };
              raf = requestAnimationFrame(tick);
            }
            await new Promise(resolve => setTimeout(resolve, duration));
          }
        } finally { cancelAnimationFrame(raf); GeoGlyphFontMorph.pause(); map.off('render', frame); observer.disconnect(); }
        const ordered = [...intervals].sort((a, b) => a - b);
        return { elapsed: performance.now() - start, frames: intervals.length, median: ordered[Math.floor(ordered.length * 0.5)], p95: ordered[Math.floor(ordered.length * 0.95)], max: ordered.at(-1), intervals, bearings, longTasks };
      }
      const gl = map.getCanvas().getContext('webgl2'), debug = gl.getExtension('WEBGL_debug_renderer_info');
      const platform = { renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), userAgent: navigator.userAgent, viewport: [gl.drawingBufferWidth, gl.drawingBufferHeight] };
      const baseline = await capture('baseline'), prepare = await capture('prepare');
      const before = { morph: GeoGlyphFontMorph.stats(), render: GeoGlyph3D.stats(), worker: await GeoGlyphFontService.workerStats() };
      const playback = await capture('play'), scrub = await capture('scrub');
      const after = { morph: GeoGlyphFontMorph.stats(), render: GeoGlyph3D.stats(), worker: await GeoGlyphFontService.workerStats() };
      return { text, platform, baseline, prepare, playback, scrub, before, after };
    }, { target: fonts.target, text });
    reports.push(report);
    for (const stage of ['baseline', 'playback', 'scrub']) {
      expect(report[stage].frames).toBeGreaterThan(10);
      expect(report[stage].bearings.at(-1)).toBeGreaterThan(report[stage].bearings[0]);
    }
    expect(report.after.morph.renderer.uploads).toBe(report.before.morph.renderer.uploads);
    expect(report.after.render.uploads).toBe(report.before.render.uploads);
    expect(report.after.worker.meshBuilds).toBe(report.before.worker.meshBuilds);
    expect(report.after.render.animation.phase).toBe('orbiting');
    await page.evaluate(() => GeoGlyph3D.stopOrbit());
    expect(errors).toEqual([]);
  }
  await info.attach('morph-desktop-profiles', { body: JSON.stringify(reports, null, 2), contentType: 'application/json' });
});

test('a message change invalidates a prepared morph and a newer request wins', async ({ page }) => {
  const { fonts, errors } = await open(page, 'Morph');
  const result = await page.evaluate(async target => {
    const pending = GeoGlyphFontMorph.prepare(target);
    GeoGlyphMapEngine.state.message = 'New B8';
    GeoGlyphMapEngine.queueRebuild(false);
    const cancelled = await pending;
    return { cancelled, ready: GeoGlyphFontMorph.stats().ready };
  }, fonts.target);
  expect(result.cancelled).toBe(false);
  expect(result.ready).toBe(false);
  await settled(page);
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(true);
  await page.locator('#mapMessage').fill('Latest message');
  await settled(page);
  expect(await page.evaluate(() => GeoGlyphFontMorph.stats().ready)).toBe(false);
  expect(errors).toEqual([]);
});

test('unsupported glyphs and transparent 3D report eligibility without replacing the displayed model', async ({ page }) => {
  const { fonts, errors } = await open(page, 'Morph');
  const result = await page.evaluate(async target => {
    const s = GeoGlyphMapEngine.state, key = GeoGlyphMapEngine.getLocalModel()?.renderKey;
    s.message = 'Morph \u{1F30D}';
    const ready = await GeoGlyphFontMorph.prepare(target);
    return { ready, error: GeoGlyphFontMorph.stats().error, key, after: GeoGlyphMapEngine.getLocalModel()?.renderKey };
  }, fonts.target);
  expect(result.ready).toBe(false);
  expect(result.error).toMatch(/character|glyph|support|outline|emoji/i);
  expect(result.after).toBe(result.key);
  await page.evaluate(() => { GeoGlyphMapEngine.state.message = 'Morph'; GeoGlyphMapEngine.queueRebuild(false); });
  await settled(page);
  expect(await page.evaluate(() => GeoGlyphMapEngine.setModelMode(true))).toBe(true);
  await settled(page);
  await page.locator('#map3DSolid').uncheck();
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(false);
  await expect(page.locator('#mapMorphStatus')).toContainText(/opaque|solid|transparent/i);
  expect(await page.evaluate(() => GeoGlyph3D.isVisible())).toBe(true);
  expect(errors).toEqual([]);
});

test('replacing an active target is atomic, failures retain it, and the newest target wins', async ({ page }) => {
  const { fonts, errors } = await open(page, 'B8 Morph');
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(true);
  await page.evaluate(() => GeoGlyphFontMorph.seek(0.37));
  const before = await ink(page);
  const failed = await page.evaluate(async () => {
    const before = GeoGlyphFontMorph.stats();
    const prepared = await GeoGlyphFontMorph.prepare('missing-target');
    return { prepared, before, after: GeoGlyphFontMorph.stats() };
  });
  expect(failed.prepared).toBe(false);
  expect(failed.after.ready).toBe(true);
  expect(failed.after.toId).toBe(failed.before.toId);
  expect(failed.after.progress).toBe(failed.before.progress);
  expect(await ink(page)).toEqual(before);
  const replacement = await page.evaluate(async () => {
    const s = GeoGlyphMapEngine.state, records = [...s.fontRecords.values()];
    const first = records.find(record => record.fontResourceKey === 'conference:Chiller');
    const last = records.find(record => record.fontResourceKey === 'conference:Showcard Gothic');
    const stale = GeoGlyphFontMorph.prepare(first.id), newest = GeoGlyphFontMorph.prepare(last.id);
    return { stale: await stale, newest: await newest, target: last.id, stats: GeoGlyphFontMorph.stats() };
  });
  expect(replacement.stale).toBe(false); expect(replacement.newest).toBe(true);
  expect(replacement.stats.toId).toBe(replacement.target);
  expect(replacement.stats.progress).toBe(0);
  await page.evaluate(() => GeoGlyphFontMorph.seek(0.37));
  expect((await ink(page)).hash).not.toBe(before.hash);
  expect(errors).toEqual([]);
});

test('intermediate exports are disabled and endpoint GeoJSON identifies the actual font', async ({ page }) => {
  const { fonts, errors } = await open(page, 'B8 Morph');
  expect(await page.evaluate(target => GeoGlyphFontMorph.prepare(target), fonts.target)).toBe(true);
  const from = await page.evaluate(() => GeoGlyphFontMorph.exportGeoJSON());
  expect(from.features[0].properties.font).toContain('Gill Sans');
  expect(from.features[0].geometry.coordinates.length).toBeGreaterThan(0);
  await page.evaluate(() => GeoGlyphFontMorph.seek(0.5));
  const intermediate = await page.evaluate(async () => ({ canExport: GeoGlyphFontMorph.canExport(), endpoint: await GeoGlyphFontMorph.exportGeoJSON(), ordinary: GeoGlyphMapEngine.getGeoJSON() }));
  expect(intermediate).toEqual({ canExport: false, endpoint: null, ordinary: null });
  for (const id of ['mapExportGeoJsonBtn', 'mapSaveJpgBtn', 'mapSavePngBtn', 'mapCollapsedJpgBtn', 'mapCollapsedPngBtn']) {
    await expect(page.locator('#' + id)).toBeDisabled();
  }
  await page.evaluate(() => GeoGlyphFontMorph.seek(1));
  const to = await page.evaluate(() => GeoGlyphFontMorph.exportGeoJSON());
  expect(to.features[0].properties.font).toBe('Forte');
  expect(to.features[0].geometry.coordinates).not.toEqual(from.features[0].geometry.coordinates);
  expect(await page.evaluate(() => GeoGlyphFontMorph.canExport())).toBe(true);
  await expect(page.locator('#mapSavePngBtn')).toBeEnabled();
  expect(errors).toEqual([]);
});

test('map removal cancels pending preparation without late display or page errors', async ({ page }) => {
  const { fonts, errors } = await open(page, 'Morph');
  await page.evaluate(target => {
    const original = window.GeoGlyphFontService;
    window.originalMorphFontService = original;
    window.GeoGlyphFontService = { ...original, morph: (...args) => new Promise(resolve => { window.releaseRemovedMapMorph = () => resolve(original.morph(...args)); }) };
    window.pendingRemovedMapMorph = GeoGlyphFontMorph.prepare(target);
  }, fonts.target);
  await page.waitForFunction(() => typeof window.releaseRemovedMapMorph === 'function');
  const result = await page.evaluate(async () => {
    GeoGlyphMapEngine.state.map.remove();
    window.releaseRemovedMapMorph();
    const prepared = await window.pendingRemovedMapMorph;
    window.GeoGlyphFontService = window.originalMorphFontService;
    return { prepared, stats: GeoGlyphFontMorph.stats() };
  });
  expect(result.prepared).toBe(false); expect(result.stats.ready).toBe(false);
  expect(result.stats.preparing).toBe(false); expect(result.stats.renderer).toBeNull();
  expect(errors).toEqual([]);
});

for(const entry of ['index.html','dist/GeoGlyph.html'])test(`font morphs work directly from disk (${entry})`,async({page})=>{
  test.setTimeout(45000);
  const {fonts,errors}=await open(page,'Morph',pathToFileURL(path.resolve(__dirname,'../..',entry)).href);
  expect(await page.evaluate(target=>GeoGlyphFontMorph.prepare(target),fonts.target)).toBe(true);
  const shapes=[];
  for(const progress of [0,.5,1]){
    await page.evaluate(value=>GeoGlyphFontMorph.seek(value),progress);
    shapes.push(await ink(page));
  }
  expect(shapes.every(shape=>shape.count>20)).toBe(true);
  expect(new Set(shapes.map(shape=>shape.hash)).size).toBe(3);
  await page.evaluate(()=>{GeoGlyphFontMorph.seek(.5);GeoGlyphMapEngine.setModelMode(true);GeoGlyphMapEngine.fit();});
  await settled(page);
  expect((await ink(page)).count).toBeGreaterThan(20);
  const stats=await page.evaluate(()=>GeoGlyphFontMorph.stats());
  expect(stats.progress).toBe(.5);expect(stats.renderer.failures).toBe(0);
  expect(errors).toEqual([]);
});
