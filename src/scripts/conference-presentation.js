(function () {
  'use strict';
  if (!window.GeoGlyphConferenceConfig?.enabled) return;

  const state = {
    ready: false, paused: false, applying: false, queue: [], history: [],
    lastQueuedId: null, lastAppliedId: null, baselined:false, phase:'overview', content: { kind: 'emoji', message: '😴' },
    lastTextFont: 'Gill Sans', fontIds: {}, error: ''
  };
  const client = window.GeoGlyphSurveyResults.create();
  let source = '', epoch = 0, activeRun = null;
  const delay = () => new Promise(resolve => setTimeout(resolve, 20));
  const engine = () => window.GeoGlyphMapEngine;
  function record(objectId, phase) {
    state.history.push({ objectId, phase });
    if (state.history.length > 1000) state.history.splice(0, state.history.length - 1000);
  }
  function interrupt() {
    epoch++;
    activeRun = null;
    state.applying = false;
    engine().cancelConferenceWork();
    if (state.phase === 'beginning') returnToOverview();
  }
  function returnToOverview() {
    state.phase = 'overview';
    state.content = { kind:'emoji', message:'😴' };
    state.lastTextFont = 'Gill Sans';
    engine().state.initialFitStatus = 'pending';
    engine().state.firstFitDone = false;
    engine().showConferenceOverview();
  }
  async function applyCommand(patch, current) {
    const api = engine();
    if (patch.command === 'reset') returnToOverview();
    else {
      state.phase = 'beginning';
      api.state.conferenceOverview = true;
      api.state.map.stop();
      window.GeoGlyph3D.stopOrbit();
    }
    await api.drawConferenceOpening(state.fontIds['Segoe UI Emoji'], {
      resetAnchor:patch.command === 'reset', objectId:patch.objectId, isCurrent:current,
      onDrawn:() => record(patch.objectId, 'drawn')
    });
    if (!current()) return;
    if (patch.command === 'begin') {
      record(patch.objectId, 'flight');
      await api.flyToConferenceOpening(current);
      if (!current()) return;
      record(patch.objectId, 'fit');
      state.phase = 'live';
      api.state.conferenceOverview = false;
    }
    state.content = { kind:'emoji', message:'😴' };
    state.lastTextFont = 'Gill Sans';
  }
  async function chooseFont(patch) {
    if (!patch.random) return patch.font;
    const eligible = [];
    for (const name of window.GeoGlyphConferenceCues.fonts) {
      const font = engine().state.fontRecords.get(state.fontIds[name]);
      const metadata = await window.GeoGlyphFontService.prepare(font);
      const codes = new Set(metadata.codes);
      if ([...patch.message].every(char => /\s/u.test(char) || codes.has(char.codePointAt(0)))) eligible.push(name);
    }
    const current = engine().state.selectedFontId;
    const choices = eligible.length > 1 ? eligible.filter(name => state.fontIds[name] !== current) : eligible;
    while (choices.length) {
      const [name] = choices.splice(Math.floor(Math.random() * choices.length), 1);
      try {
        await engine().prepareConferenceFont(state.fontIds[name], patch);
        return name;
      } catch (_) { /* Keep the shared outline and mesh policies for random fonts. */ }
    }
    throw Error('None of the survey fonts can draw this message in the selected mode.');
  }
  async function drain() {
    if (!state.ready || state.paused || state.applying || !engine().state.previewActive || engine().state.mode !== 'arcgis') return;
    const run = {};
    activeRun = run;
    state.applying = true;
    try {
      while (activeRun === run && !state.paused && state.queue.length && engine().state.previewActive && engine().state.mode === 'arcgis') {
        const raw = state.queue.shift(), generation = epoch;
        const current = () => activeRun === run && generation === epoch && engine().state.previewActive && engine().state.mode === 'arcgis';
        record(raw.objectId, 'started');
        try {
          const patch = window.GeoGlyphConferenceCues.resolve(raw, {
            content: state.content, lastTextFont: state.lastTextFont,
            extrusionEnabled: engine().state.extrusionEnabled
          });
          if (patch.command) {
            await applyCommand(patch, current);
            if (!current()) continue;
            state.lastAppliedId = raw.objectId;
            state.error = '';
            record(raw.objectId, 'applied');
            engine().setConnectionStatus(patch.command === 'reset' ? 'Ready · Australia overview' : 'Live · Introduction complete', 'ok');
            continue;
          }
          const font = await chooseFont(patch);
          patch.fontId = state.fontIds[font];
          if (!current()) continue;
          const result = await engine().applyConferenceCue(patch, {
            isCurrent: current,
            onDrawn: () => record(raw.objectId, 'drawn'),
            onFit: () => record(raw.objectId, 'fit')
          });
          if (patch.animation && patch.kind === 'text' && !result.empty && state.phase !== 'overview') {
            if (!window.GeoGlyph3D.ensureOrbit(patch.animation, { framed: result.fitted })) throw Error('Animation could not start.');
            await engine().waitForCamera();
            record(raw.objectId, 'animation');
          }
          if (!current()) continue;
          state.content = patch.nextContent;
          if (patch.kind === 'text') state.lastTextFont = font;
          state.lastAppliedId = raw.objectId;
          state.error = '';
          record(raw.objectId, 'applied');
          engine().setConnectionStatus(patch.warnings.length ? patch.warnings.join(' ') : `Live · Response ${raw.objectId}`, patch.warnings.length ? 'warn' : 'ok');
        } catch (error) {
          // Leaving Map can cancel a flight without a newer command. Do not
          // leave Begin permanently locked when the user returns to Map.
          if (patchCommand(raw) === 'begin' && generation === epoch && activeRun === run) returnToOverview();
          if (current()) {
            state.error = error.message;
            record(raw.objectId, 'failed');
            engine().setConnectionStatus(`Response ${raw.objectId}: ${error.message}`, 'warn');
          }
        }
      }
    } finally { if (activeRun === run) { activeRun = null; state.applying = false; } }
  }
  const patchCommand = raw => window.GeoGlyphConferenceCues.command(raw);
  async function poll(layer, { signal } = {}) {
    const key = layer.url || layer.id;
    if (source !== key) {
      if (activeRun) interrupt();
      source = key; epoch++;
      state.queue.length = 0; state.lastQueuedId = null; state.baselined = false;
    }
    const generation = epoch;
    const baseline = !state.baselined;
    let rows = baseline
      ? [await client.latestCue(layer, { signal })].filter(Boolean)
      : await client.afterCues(layer, state.lastQueuedId, { signal });
    signal?.throwIfAborted();
    if (generation !== epoch) return 'Results source changed';
    if (baseline) {
      // Old commands/content must never skip the conference's opening overview.
      state.lastQueuedId = rows[0]?.objectId ?? 0;
      state.baselined = true;
      return 'Ready · Australia overview';
    }
    const reset = rows.findLast(row => patchCommand(row) === 'reset');
    if (reset) {
      interrupt();
      state.queue.length = 0;
      returnToOverview();
      rows = rows.filter(row => row.objectId >= reset.objectId);
    }
    for (const row of rows) {
      if (state.lastQueuedId !== null && row.objectId <= state.lastQueuedId) continue;
      state.lastQueuedId = row.objectId;
      if (patchCommand(row) === 'begin' && (state.phase === 'beginning' || state.queue.some(cue => patchCommand(cue) === 'begin'))) {
        record(row.objectId, 'ignored');
        continue;
      }
      state.queue.push(row);
    }
    void drain();
    return state.queue.length || state.applying ? 'Live · Applying survey responses' : state.error || (state.phase === 'overview' ? 'Ready · Australia overview' : 'Live · Waiting for a new response');
  }
  window.GeoGlyphConference = Object.freeze({
    state, poll, retryStartup,
    pause() { state.paused = true; },
    resume() { state.paused = false; void drain(); }
  });

  async function conferenceFonts(run) {
    const element = document.getElementById('geoglyph-conference-fonts');
    const manifest = JSON.parse(element.textContent);
    if (location.protocol !== 'file:' || manifest.every(font => font.data)) return manifest;
    const source = element.dataset.localFontPack;
    if (!source) throw Error('The local font pack is missing. Rebuild the app or open GeoGlyph_Locate_2026.html.');
    await new Promise((resolve, reject) => {
      const script = document.createElement('script'), signal = run.controller.signal;
      const finish = error => {
        signal.removeEventListener('abort', aborted); script.onload = script.onerror = null; script.remove();
        error ? reject(error) : resolve();
      };
      const aborted = () => finish(signal.reason || Error('Conference startup cancelled'));
      script.src = source;
      script.onload = () => finish();
      script.onerror = () => finish(Error('Could not load the local font pack. Keep src/fonts with index.html, rebuild the app, or open GeoGlyph_Locate_2026.html.'));
      if (signal.aborted) { aborted(); return; }
      signal.addEventListener('abort', aborted, { once:true }); document.head.append(script);
    });
    const fonts = window.GeoGlyphConferenceFontData;
    delete window.GeoGlyphConferenceFontData;
    if (!Array.isArray(fonts) || fonts.length !== manifest.length || fonts.some(font => !font.data)) {
      throw Error('The local font pack is invalid. Rebuild the app or open GeoGlyph_Locate_2026.html.');
    }
    return fonts;
  }

  const startupBuffers = new Map();
  let startupPromise = null, startupRun = null, startupManifest = null, startupInitialised = false;
  function currentStartup(run) { return startupRun === run && !run.controller.signal.aborted; }
  function boundedStartup(task, milliseconds, message, signal) {
    return new Promise((resolve, reject) => {
      let timer, settled = false;
      const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer); signal.removeEventListener('abort', aborted); callback(value);
      };
      const aborted = () => finish(reject, signal.reason || Error('Conference startup cancelled'));
      if (signal.aborted) { aborted(); return; }
      signal.addEventListener('abort', aborted, { once:true });
      timer = setTimeout(() => finish(reject, Error(message)), milliseconds);
      Promise.resolve().then(() => { signal.throwIfAborted(); return task(); }).then(
        value => finish(resolve, value), error => finish(reject, error));
    });
  }
  async function waitStartup(check, milliseconds, message, run) {
    await boundedStartup(async () => {
      while (!check()) { run.controller.signal.throwIfAborted(); await delay(); }
    }, milliseconds, message, run.controller.signal);
  }
  async function acquireStartupFont(font, run) {
    const key = font.key;
    if (startupBuffers.has(key)) return startupBuffers.get(key);
    if (font.data) {
      const binary = atob(font.data), bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      run.controller.signal.throwIfAborted(); startupBuffers.set(key, bytes.buffer); return bytes.buffer;
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController(), parent = run.controller.signal;
      const abort = () => controller.abort(parent.reason);
      parent.addEventListener('abort', abort, { once:true });
      if (parent.aborted) abort();
      try {
        const buffer = await boundedStartup(async () => {
          const response = await fetch(font.file, { signal:controller.signal });
          if (!response.ok) {
            const error = Error(`HTTP ${response.status}`);
            error.permanent = !([408, 429].includes(response.status) || response.status >= 500);
            throw error;
          }
          return response.arrayBuffer();
        }, 15000, `Bundled font ${font.name} download timed out`, controller.signal);
        parent.throwIfAborted();
        if (!buffer.byteLength) { const error = Error('Font file is empty'); error.permanent = true; throw error; }
        startupBuffers.set(key, buffer); return buffer;
      } catch (error) {
        if (parent.aborted) throw parent.reason;
        if (error.permanent || attempt === 2) throw Error(`Could not load bundled font ${font.name}: ${error.message}`);
      } finally { parent.removeEventListener('abort', abort); controller.abort(); }
      await boundedStartup(() => new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000)),
        (attempt + 1) * 1000 + 1000, 'Font retry delay failed', parent);
    }
  }
  async function start(run, retry) {
    const signal = run.controller.signal;
    await waitStartup(() => window.GeoGlyphStudio && engine() && window.GeoGlyph3D && document.getElementById('geoglyphMapEditor'),
      10000, 'Conference dependencies did not become ready', run);
    const host = window.GeoGlyphStudio, map = engine().state;
    if (!startupInitialised) {
      startupInitialised = true;
      host.state.selectedFontId = host.state.fonts.find(font => font.family === 'Segoe UI Emoji').id;
      Object.assign(map, { mode:'arcgis', message:'', arcgisMessage:'', nativeColor:true, extrusionEnabled:false,
        baseHeightMeters:300, extrusionDepthMeters:30, relativeSize:100 });
      engine().showMap();
      const panel = document.getElementById('geoglyphMapEditor'); panel.classList.add('is-collapsed');
      const collapse = panel.querySelector('.map-editor-collapse');
      collapse.textContent = '+'; collapse.setAttribute('aria-expanded', 'false'); collapse.title = 'Expand map controls';
    } else if (retry && !map.mapReady) engine().retryConferenceMapInitialization();
    engine().refreshControls(); engine().setConnectionStatus('Preparing conference fonts…', 'info');
    if (!startupManifest) startupManifest = await boundedStartup(() => conferenceFonts(run), 15000,
      'Conference font pack did not load', signal);
    const manifest = startupManifest;
    const records = await Promise.all(manifest.map(async font => ({
      id:`conference-${font.key.toLowerCase().replace(/\s/g, '-')}`, source:'conference',
      fontResourceKey:`conference:${font.key}`, name:font.name, family:font.family, style:font.style,
      arrayBuffer:await acquireStartupFont(font, run)
    })));
    signal.throwIfAborted();
    const fonts = host.registerFonts(records); engine().refreshFonts();
    manifest.forEach((font,index) => { state.fontIds[font.key] = `geoglyph:${fonts[index].id}`; });
    await Promise.all(manifest.map(async font => {
      const record = map.fontRecords.get(state.fontIds[font.key]);
      await window.GeoGlyphFontService.ensureFace(record, { retry, timeoutMs:30000, isCurrent:() => currentStartup(run) });
      signal.throwIfAborted();
      if (!font.emoji) await window.GeoGlyphFontService.prepare(record, { retry });
    }));
    signal.throwIfAborted();
    host.state.selectedFontId = fonts[0].id; map.selectedFontId = state.fontIds['Segoe UI Emoji'];
    engine().refreshControls();
    await waitStartup(() => map.mapReady, 20000, 'Conference map did not become ready', run);
    engine().showConferenceOverview(); run.opening = true;
    await engine().drawConferenceOpening(state.fontIds['Segoe UI Emoji'], { resetAnchor:!retry, isCurrent:() => currentStartup(run) });
    signal.throwIfAborted(); run.opening = false;
    document.getElementById('mapArcgisInterval').value = String(window.GeoGlyphConferenceConfig.pollSeconds);
    state.ready = true;
    // Polling owns its own request deadlines; readiness does not await the service.
    void engine().startPolling().catch(() => engine()?.setConnectionStatus('Could not start live polling. Use Start to retry.', 'warn'));
    return true;
  }
  function retryStartup() {
    if (state.ready) return Promise.resolve(true);
    if (startupPromise) return startupPromise;
    const retry = Boolean(startupRun), run = { controller:new AbortController(), opening:false };
    startupRun = run; state.error = '';
    const timer = setTimeout(() => run.controller.abort(Error('Conference startup exceeded 120 seconds')), 120000);
    const job = boundedStartup(() => start(run, retry), 120000, 'Conference startup exceeded 120 seconds', run.controller.signal)
      .catch(error => {
        if (startupRun === run) {
          run.controller.abort(error);
          if (run.opening) engine()?.cancelConferenceWork();
          state.error = String(error.message || error).replace(/https?:\/\/\S+/g, '[URL]');
          engine()?.setConnectionStatus(`Conference startup failed: ${state.error}. Use Start to retry.`, 'warn');
          console.error('Conference startup failed:', state.error);
        }
        return false;
      }).finally(() => { clearTimeout(timer); if (startupPromise === job) startupPromise = null; });
    startupPromise = job; return job;
  }
  void retryStartup();
})();
