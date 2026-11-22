/* Browser capture, background recorder client and recorded-timestamp playback. */
(() => {
  const defaultIntervalSeconds = 30;
  const maxIntervalSeconds = Math.floor(0x7fffffff / 1000);
  const historyWindow = 300_000;
  const scanSpeed = 4;
  const endpoints = ['vehicle_positions', 'trip_updates', 'service_alerts'];
  const api = '/api/recordings';
  const sourceLabels = {browser: 'Browser', background: 'Background', imported: 'Import'};
  const adelaideTime = new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Adelaide'
  });
  let database;

  function validateRecordingInterval(seconds = defaultIntervalSeconds) {
    if (!Number.isInteger(seconds) || seconds < 1 || seconds > maxIntervalSeconds) {
      throw new Error('Enter a whole number of seconds from 1 to ' + maxIntervalSeconds.toLocaleString('en-AU') + '.');
    }
    return seconds;
  }

  function openDatabase() {
    if (!database) database = new Promise((resolve, reject) => {
      const request = indexedDB.open('adelaide-metro-recordings', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sessions', {keyPath: 'id'});
        request.result.createObjectStore('frames', {keyPath: ['id', 'sequence']});
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return database;
  }

  async function transaction(stores, mode, operation) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, mode);
      const request = operation(tx);
      tx.oncomplete = () => resolve(request?.result);
      tx.onabort = () => reject(tx.error || new Error('Recording storage transaction cancelled'));
    });
  }

  async function browserExport(session) {
    const range = IDBKeyRange.bound([session.id, 0], [session.id, Number.MAX_SAFE_INTEGER]);
    const frames = await transaction(['frames'], 'readonly', tx => tx.objectStore('frames').getAll(range));
    const {frameCount, ...metadata} = session;
    return {...metadata, frames: frames.map(entry => entry.frame)};
  }

  async function request(path = '', body) {
    const response = await fetch(api + path, {
      cache: 'no-store',
      signal: AbortSignal.timeout(35_000),
      ...(body && {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
    });
    if (!response.ok) {
      const details = await response.json().catch(() => null);
      throw new Error(details?.error || 'Recorder returned HTTP ' + response.status);
    }
    return response.json();
  }

  function validate(session) {
    if (session?.version !== 1 || !Number.isFinite(session.startedAt) || !Array.isArray(session.frames)) {
      throw new Error('Choose a version 1 Adelaide Metro recording');
    }
    let previous = -Infinity;
    for (const frame of session.frames) {
      if (!Number.isFinite(frame?.time) || frame.time < previous ||
          !endpoints.every(endpoint => {
            const feed = frame.feeds?.[endpoint];
            return Number.isFinite(feed?.time) && (typeof feed.error === 'string' ||
              (typeof feed.raw === 'string' && Array.isArray(feed.rows) &&
               feed.rows.every(row => row && typeof row === 'object' && !Array.isArray(row))));
          })) {
        throw new Error('Recording contains an invalid frame');
      }
      previous = frame.time;
    }
    return {...session, intervalSeconds: validateRecordingInterval(session.intervalSeconds)};
  }

  function download(session) {
    const json = JSON.stringify(session, (_, value) => typeof value === 'bigint' ? String(value) : value);
    const url = URL.createObjectURL(new Blob([json], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'adelaide-metro-' + new Date(session.startedAt).toISOString().replaceAll(':', '-') + '.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }

  function timeLabel(milliseconds) {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
      .map(part => String(part).padStart(2, '0')).join(':');
  }

  function recordingName(session) {
    const savedName = typeof session.name === 'string' ? session.name.trim() : '';
    return savedName || adelaideTime.format(session.startedAt);
  }

  function frameLabel(count) {
    return count + (count === 1 ? ' frame' : ' frames');
  }

  function lastFrameAt(frames, time) {
    let low = 0;
    let high = frames.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (frames[mid].time <= time) low = mid + 1;
      else high = mid;
    }
    return low - 1;
  }

  function init({capture, config, refreshLive, statusChanged, display, exit}) {
    const panel = document.getElementById('recorderDeck');
    if (!panel) return;
    const controls = Object.fromEntries(Array.from(panel.querySelectorAll('[data-control]'),
      element => [element.dataset.control, element]));
    controls.interval.defaultValue = defaultIntervalSeconds;
    controls.interval.max = maxIntervalSeconds;
    let powered = true;
    let browserSession;
    let browserAvailable;
    let deletingBrowser = false;
    let backgroundSession;
    let backgroundFrameTime = 0;
    let backgroundAvailable;
    let backgroundBusy = false;
    let browserRecordings = [];
    let backgroundRecordings = [];
    let browserCatalog;
    let backgroundCatalog;
    const imports = new Map();
    let nextImportId = 0;
    let stopRequested = false;
    let wake;
    let playback;
    let playbackSource;
    let playbackLoad;
    let transport = 'paused';
    let cursor;
    let currentFrame = -1;
    let firstHistoryFrame = -1;
    let inCaptureGap = false;
    let animation = 0;
    let lastTick;

    function publishActivity() {
      statusChanged([browserSession, backgroundSession].filter(Boolean));
      syncDeck();
    }

    function show(control, message) {
      if (controls[control].textContent !== message) controls[control].textContent = message;
    }

    function captureIsReady() {
      return controls.source.value === 'browser'
        ? browserAvailable && !deletingBrowser
        : backgroundAvailable && !backgroundBusy;
    }

    function selectedCapture() {
      return controls.source.value === 'browser' ? browserSession : backgroundSession;
    }

    function syncTransport() {
      const loading = Boolean(playbackLoad);
      const start = playback?.frames[0].time;
      const end = playback?.frames.at(-1).time;
      const canMove = end > start;
      const newSelection = controls.sessions.value && controls.sessions.value !== playbackSource;
      controls.play.disabled = loading || !(newSelection || (canMove && transport !== 'play'));
      controls['library-play'].disabled = controls.play.disabled;
      controls.pause.disabled = !animation;
      controls.rewind.disabled = loading || !canMove || cursor <= start || transport === 'rewind';
      controls['fast-forward'].disabled = loading || !canMove || cursor >= end || transport === 'fast-forward';
      controls.stop.disabled = !(playback || loading ||
        (captureIsReady() && selectedCapture() && !(controls.source.value === 'browser' && stopRequested)));
      controls.timeline.disabled = loading || !canMove;
      controls.restart.disabled = loading || !playback || (currentFrame === 0 && cursor === start);
      controls.previous.disabled = loading || !playback || currentFrame <= 0;
      controls.next.disabled = loading || !playback || currentFrame >= playback.frames.length - 1;
    }

    function syncDeck() {
      const recording = browserSession || backgroundSession;
      const armedCapture = selectedCapture();
      panel.dataset.power = powered ? 'on' : 'standby';
      panel.dataset.recording = String(Boolean(recording));
      panel.dataset.transport = playback ? transport : 'idle';
      controls.power.setAttribute('aria-pressed', String(powered));
      controls.deck.disabled = !powered;
      controls.setup.inert = !powered;
      controls.library.hidden = !powered;
      controls.sessions.disabled = !controls.sessions.value || Boolean(playbackLoad);
      controls['library-up'].disabled = controls.sessions.disabled || controls.sessions.selectedIndex <= 0;
      controls['library-down'].disabled = controls.sessions.disabled ||
        controls.sessions.selectedIndex >= controls.sessions.options.length - 1;
      controls.record.disabled = !captureIsReady() || Boolean(armedCapture);
      controls.interval.disabled = Boolean(armedCapture) || backgroundBusy;
      controls.record.dataset.engaged = String(Boolean(armedCapture));
      controls.import.disabled = Boolean(playbackLoad);
      controls.export.disabled = !controls.sessions.value || Boolean(playbackLoad);
      controls['delete-browser'].disabled = deletingBrowser || Boolean(browserSession) || !browserRecordings.length;
      for (const action of ['play', 'rewind', 'fast-forward', 'pause']) {
        const engaged = action === transport || (action === 'pause' && transport === 'paused');
        controls[action].dataset.engaged = String(Boolean(playback) && engaged);
      }
      syncTransport();

      const transportText = {paused: 'Pause', play: 'Play', rewind: 'Rewind 4×', 'fast-forward': 'Fast-forward 4×'};
      const liveMode = recording ? 'Rec' : 'Ready';
      const activeMode = playback ? transportText[transport] : liveMode;
      show('mode', powered ? (playbackLoad ? 'Loading' : activeMode) : 'Standby');
      const option = Array.from(controls.sessions.options).find(item => item.value === playbackSource);
      const program = playback ? (option?.dataset.name || recordingName(playback)) : 'Live feed';
      show('program', powered ? program : '');
      const selected = controls.sessions.selectedOptions[0];
      show('library-info', selected?.value ? selected.text : '');

      if (!playback) {
        const capture = armedCapture || recording;
        const hasStartTime = Number.isFinite(capture?.startedAt);
        show('elapsed', hasStartTime ? timeLabel(Date.now() - capture.startedAt) : (powered ? '00:00:00' : '--:--:--'));
      }
      const activity = [];
      if (browserSession) {
        activity.push(stopRequested ? 'Finishing browser recording…' :
          'Recording in browser · ' + frameLabel(browserSession.frameCount) + ' · Keep this tab open');
      }
      if (backgroundSession) {
        activity.push('Recording in background · ' + frameLabel(backgroundSession.frameCount ?? 0));
      }
      if ((controls.source.value === 'background' || backgroundSession) && !backgroundAvailable) {
        activity.push(backgroundAvailable === false ? 'Background recorder unavailable.' : 'Checking background recorder…');
      }
      if (controls.source.value === 'browser' && browserAvailable === false) activity.push('Browser storage unavailable.');
      show('capture-status', activity.join(' · '));
    }

    function refreshFromBackground(frame) {
      if (!Number.isFinite(frame?.time) || frame.time <= backgroundFrameTime) return;
      backgroundFrameTime = frame.time;
      refreshLive(frame);
    }

    function updateLibrary(selection = controls.sessions.value) {
      const library = controls.sessions;
      const scrollTop = library.scrollTop;
      const items = [...browserRecordings, ...backgroundRecordings]
        .sort((a, b) => b.startedAt - a.startedAt)
        .map(session => ({
          name: recordingName(session),
          mode: session.mode,
          count: session.frameCount,
          value: session.mode + ':' + session.id
        }));
      for (const [value, {name, session}] of imports) {
        items.unshift({name, mode: 'imported', count: session.frames.length, value});
      }
      const options = items.map(({name, mode, count, value}) => {
        const option = new Option([name, sourceLabels[mode], frameLabel(count)].join(' · '), value);
        option.dataset.name = name;
        return option;
      });
      if (!options.length) options.push(new Option('No recordings', ''));
      const changed = options.length !== library.options.length || options.some((option, index) =>
        option.value !== library.options[index].value || option.text !== library.options[index].text);
      if (changed) library.replaceChildren(...options);
      if (changed || selection !== library.value) {
        library.value = selection && options.some(option => option.value === selection)
          ? selection : options[0].value;
        if (changed) library.scrollTop = scrollTop;
      }
    }

    function refreshBrowserCatalog() {
      browserCatalog ??= transaction(['sessions'], 'readonly', tx => tx.objectStore('sessions').getAll())
        .then(records => {
          browserAvailable = true;
          browserRecordings = records;
          updateLibrary();
        }, () => { browserAvailable = false; })
        .finally(() => {
          browserCatalog = null;
          syncDeck();
        });
      return browserCatalog;
    }

    function refreshBackgroundCatalog() {
      backgroundCatalog ??= request('?after=' + backgroundFrameTime).then(result => {
        backgroundAvailable = Array.isArray(result?.sessions);
        if (!backgroundAvailable) return;
        const {activeId, sessions, latestFrame} = result;
        backgroundRecordings = sessions;
        backgroundSession = activeId ? sessions.find(session => session.id === activeId)
          ?? {id: activeId, mode: 'background'} : null;
        refreshFromBackground(latestFrame);
        updateLibrary();
      }, () => { backgroundAvailable = false; }).finally(() => {
        backgroundCatalog = null;
        publishActivity();
      });
      return backgroundCatalog;
    }

    async function updateBrowserSession(session, frame) {
      const stores = frame ? ['sessions', 'frames'] : ['sessions'];
      const key = await transaction(stores, 'readwrite', tx => {
        const sessions = tx.objectStore('sessions');
        const lookup = sessions.getKey(session.id);
        lookup.onsuccess = () => {
          // A capture in another tab must not restore a deleted session.
          if (lookup.result === undefined) return;
          sessions.put(session);
          if (frame) tx.objectStore('frames').add({id: session.id, sequence: session.frameCount - 1, frame});
        };
        return lookup;
      });
      if (key === undefined) throw new Error('This browser recording was deleted.');
    }

    async function deleteBrowserRecordings() {
      if (deletingBrowser || browserSession || !window.confirm('Permanently delete all recordings saved in this browser?')) return;
      deletingBrowser = true;
      syncDeck();
      try {
        await transaction(['sessions', 'frames'], 'readwrite', tx => {
          tx.objectStore('sessions').clear();
          tx.objectStore('frames').clear();
        });
        if (playbackSource?.startsWith('browser:')) closePlayback();
        show('status', 'Browser recordings deleted.');
      } finally {
        if (browserCatalog) await browserCatalog;
        deletingBrowser = false;
        await refreshBrowserCatalog();
      }
    }

    function recordingSettings() {
      const intervalSeconds = validateRecordingInterval(controls.interval.valueAsNumber);
      return {...config(), intervalSeconds};
    }

    async function recordBrowser() {
      const startedAt = Date.now();
      const settings = recordingSettings();
      const interval = settings.intervalSeconds * 1000;
      browserSession = {
        version: 1, id: crypto.randomUUID(), mode: 'browser', startedAt, endedAt: null,
        intervalSeconds: settings.intervalSeconds, frameCount: 0
      };
      stopRequested = false;
      let previousFrameTime;
      try {
        publishActivity();
        await transaction(['sessions'], 'readwrite', tx => tx.objectStore('sessions').add(browserSession));
        while (!stopRequested) {
          const began = Date.now();
          const frame = await capture(settings);
          const gap = frame.time - previousFrameTime;
          if (gap > interval * 1.5) frame.gapMs = gap;
          previousFrameTime = frame.time;
          const updated = {...browserSession, frameCount: browserSession.frameCount + 1};
          await updateBrowserSession(updated, frame);
          browserSession = updated;
          refreshLive(frame);
          publishActivity();
          void refreshBrowserCatalog();
          if (!stopRequested) {
            await new Promise(resolve => {
              const timer = setTimeout(resolve, Math.max(0, interval - (Date.now() - began)));
              wake = () => { clearTimeout(timer); resolve(); };
            });
            wake = null;
          }
        }
        browserSession.endedAt = Date.now();
        await updateBrowserSession(browserSession);
        show('status', 'Browser recording saved.');
      } catch (error) {
        browserSession.endedAt = Date.now();
        browserSession.error = error.message;
        await updateBrowserSession(browserSession).catch(() => {});
        show('status', 'Browser recording stopped: ' + error.message);
      } finally {
        browserSession = null;
        stopRequested = false;
        publishActivity();
        if (browserCatalog) await browserCatalog;
        await refreshBrowserCatalog();
      }
    }

    async function recordBackground(stop = false) {
      const id = backgroundSession?.id;
      backgroundBusy = true;
      syncDeck();
      try {
        if (stop) {
          const stopped = await request('/' + encodeURIComponent(id) + '/stop', {});
          refreshFromBackground(stopped.latestFrame);
          show('status', 'Background recording saved.');
        } else {
          await request('', recordingSettings());
        }
      } finally {
        if (backgroundCatalog) await backgroundCatalog;
        await refreshBackgroundCatalog();
        backgroundBusy = false;
        syncDeck();
      }
    }

    async function selectedSession(choice = controls.sessions.value) {
      const imported = imports.get(choice);
      if (imported) return imported.session;
      const separator = choice.indexOf(':');
      const mode = choice.slice(0, separator);
      const id = choice.slice(separator + 1);
      if (mode === 'background') return validate(await request('/' + encodeURIComponent(id)));
      const metadata = await transaction(['sessions'], 'readonly', tx => tx.objectStore('sessions').get(id));
      if (!metadata) throw new Error('Recording unavailable');
      return validate(await browserExport(metadata));
    }

    function seek(time, force = false, targetFrame) {
      const {frames} = playback;
      const start = frames[0].time;
      const end = frames.at(-1).time;
      const interval = playback.intervalSeconds * 1000;
      cursor = Math.min(end, Math.max(start, time));
      const index = targetFrame ?? lastFrameAt(frames, cursor);
      const first = lastFrameAt(frames, cursor - historyWindow - 1) + 1;
      const frame = frames[index];
      const gap = cursor - frame.time > interval * 1.5;
      if (force || currentFrame !== index || inCaptureGap !== gap) {
        const missing = endpoints.filter(endpoint => frame.feeds[endpoint].error);
        show('frame-status', [
          'Frame ' + (index + 1) + ' of ' + frames.length + ' · ' + adelaideTime.format(frame.time),
          missing.length ? 'Unavailable: ' + missing.map(name => name.replaceAll('_', ' ')).join(', ') : '',
          gap ? 'Gap in capture · showing last recorded frame' : ''
        ].filter(Boolean).join(' · '));
      }
      inCaptureGap = gap;
      if (force || currentFrame !== index || firstHistoryFrame !== first) {
        currentFrame = index;
        firstHistoryFrame = first;
        display(frame, frames.slice(first, index + 1), cursor, start, interval);
      }
      const elapsed = cursor - start;
      const duration = end - start;
      const positionText = timeLabel(elapsed) + ' of ' + timeLabel(duration);
      controls.timeline.value = String(Math.round(elapsed));
      if (controls.timeline.getAttribute('aria-valuetext') !== positionText) {
        controls.timeline.setAttribute('aria-valuetext', positionText);
      }
      show('elapsed', timeLabel(elapsed) + ' / ' + timeLabel(duration));
      syncTransport();
    }

    function resetMotion() {
      cancelAnimationFrame(animation);
      animation = 0;
      lastTick = undefined;
      transport = 'paused';
    }

    function pause() {
      resetMotion();
      syncDeck();
    }

    function tick(now) {
      const speed = transport === 'play' ? Number(controls.speed.value)
        : (transport === 'rewind' ? -scanSpeed : scanSpeed);
      if (lastTick !== undefined) seek(cursor + (now - lastTick) * speed);
      lastTick = now;
      const atEnd = speed < 0 ? cursor <= playback.frames[0].time : cursor >= playback.frames.at(-1).time;
      if (atEnd) pause();
      else animation = requestAnimationFrame(tick);
    }

    function move(direction) {
      const start = playback.frames[0].time;
      const end = playback.frames.at(-1).time;
      if (end <= start) return;
      resetMotion();
      if (direction === 'play' && cursor >= end) seek(start, true, 0);
      transport = direction;
      animation = requestAnimationFrame(tick);
      syncDeck();
    }

    function openPlayback(session, source) {
      if (!session.frames.length) throw new Error('This recording has no frames yet');
      playback = session;
      playbackSource = source;
      controls.timeline.max = String(session.frames.at(-1).time - session.frames[0].time);
      if (session.error) show('status', 'Capture ended early: ' + session.error);
      seek(session.frames[0].time, true, 0);
      syncDeck();
    }

    async function loadPlayback(load, source, autoplay = false) {
      resetMotion();
      const pending = load();
      playbackLoad = pending;
      syncDeck();
      try {
        const session = await pending;
        if (playbackLoad !== pending) return;
        if (imports.has(source)) controls.sessions.value = source;
        if (!session) return;
        openPlayback(session, source);
        if (autoplay) move('play');
      } catch (error) {
        if (playbackLoad === pending) throw error;
      } finally {
        if (playbackLoad === pending) {
          playbackLoad = null;
          syncDeck();
        }
      }
    }

    function closePlayback() {
      resetMotion();
      playbackLoad = null;
      if (playback) {
        playback = null;
        playbackSource = null;
        controls.timeline.value = '0';
        controls.timeline.max = '0';
        controls.timeline.removeAttribute('aria-valuetext');
        show('frame-status', '');
        exit();
      }
      syncDeck();
    }

    function togglePower() {
      powered = !powered;
      if (!powered) closePlayback();
      else syncDeck();
    }

    function stop() {
      if (playback || playbackLoad) return closePlayback();
      if (controls.source.value === 'background') return recordBackground(true);
      if (!browserSession || stopRequested) return;
      stopRequested = true;
      syncDeck();
      wake?.();
    }

    function play() {
      const choice = controls.sessions.value;
      if (choice && choice !== playbackSource) return loadPlayback(() => selectedSession(choice), choice, true);
      if (playback) move('play');
    }

    function moveLibrarySelection(step) {
      const library = controls.sessions;
      const button = step < 0 ? controls['library-up'] : controls['library-down'];
      const hadFocus = document.activeElement === button;
      const index = library.selectedIndex + step;
      const option = library.options[index];
      if (!option?.value) return;
      library.selectedIndex = index;

      // Scroll only the native listbox and keep focus on the joystick.
      const viewportTop = library.getBoundingClientRect().top + library.clientTop;
      const viewportBottom = viewportTop + library.clientHeight;
      const {top, bottom} = option.getBoundingClientRect();
      if (top < viewportTop) library.scrollTop -= viewportTop - top;
      else if (bottom > viewportBottom) library.scrollTop += bottom - viewportBottom;
      syncDeck();
      if (hadFocus && button.disabled) library.focus({preventScroll: true});
    }

    function action(fn) {
      return async () => {
        show('status', '');
        try { await fn(); } catch (error) { show('status', error.message); }
      };
    }

    controls.power.onclick = action(togglePower);
    controls.source.onchange = syncDeck;
    controls.record.onclick = action(() => controls.source.value === 'browser' ? recordBrowser() : recordBackground());
    controls.stop.onclick = action(stop);
    controls.play.onclick = action(play);
    controls.pause.onclick = pause;
    controls.rewind.onclick = () => move('rewind');
    controls['fast-forward'].onclick = () => move('fast-forward');
    controls['library-up'].onclick = () => moveLibrarySelection(-1);
    controls['library-down'].onclick = () => moveLibrarySelection(1);
    controls['library-play'].onclick = () => controls.play.click();
    controls.sessions.onchange = syncDeck;
    controls.sessions.onkeydown = event => {
      if (event.key !== 'Enter' || controls.play.disabled) return;
      event.preventDefault();
      controls.play.click();
    };
    controls['delete-browser'].onclick = action(deleteBrowserRecordings);
    controls.export.onclick = action(async () => download(await selectedSession()));
    controls.import.onclick = () => controls.file.click();
    controls.file.onchange = action(async () => {
      const file = controls.file.files[0];
      controls.file.value = '';
      if (!file || !powered) return;
      const source = 'imported:' + ++nextImportId;
      await loadPlayback(async () => {
        const session = validate(JSON.parse(await file.text()));
        imports.set(source, {name: file.name, session});
        updateLibrary();
        if (!session.frames.length) {
          show('status', 'Recording imported. No frames to play.');
          return null;
        }
        return session;
      }, source);
    });

    controls.restart.onclick = () => { pause(); seek(playback.frames[0].time, true, 0); };
    controls.previous.onclick = () => { pause(); seek(playback.frames[currentFrame - 1].time, true, currentFrame - 1); };
    controls.next.onclick = () => { pause(); seek(playback.frames[currentFrame + 1].time, true, currentFrame + 1); };
    controls.timeline.oninput = () => { pause(); seek(playback.frames[0].time + Number(controls.timeline.value), true); };

    function refreshCatalog() {
      if (document.hidden) return;
      void refreshBrowserCatalog();
      void refreshBackgroundCatalog();
    }

    syncDeck();
    void refreshBrowserCatalog();
    void refreshBackgroundCatalog();
    setInterval(refreshCatalog, 5000);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validateRecordingInterval};
  } else {
    window.MetroRecording = {init};
  }
})();
