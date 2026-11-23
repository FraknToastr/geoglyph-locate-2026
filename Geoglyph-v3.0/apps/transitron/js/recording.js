/* Browser capture, background recorder client and recorded-timestamp playback. */
(() => {
  const defaultIntervalSeconds = 30;
  const maxIntervalSeconds = Math.floor(0x7fffffff / 1000);
  const historyWindow = 300_000;
  const framePageSize = 16;
  const exportFormat = 'transitron-ndjson';
  const scanSpeed = 4;
  const scanHoldMs = 400;
  const playbackSpeeds = [1, 12, 16, 24, 32, 60, 120];
  const intervalPresets = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600];
  const endpoints = ['vehicle_positions', 'trip_updates', 'service_alerts'];
  const api = '/api/recordings';
  const sourceLabels = {browser: 'Browser', background: 'Background', imported: 'Import'};
  const adelaideTime = new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Adelaide'
  });
  const adelaideClock = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Adelaide', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  const isLocalRecording = choice => choice.startsWith('browser:') || choice.startsWith('imported:');
  let database;

  function validateRecordingInterval(seconds = defaultIntervalSeconds) {
    if (!Number.isInteger(seconds) || seconds < 1 || seconds > maxIntervalSeconds) {
      throw new Error('Enter a whole number of seconds from 1 to ' + maxIntervalSeconds.toLocaleString('en-AU') + '.');
    }
    return seconds;
  }

  function openDatabase() {
    if (!database) database = new Promise((resolve, reject) => {
      const request = indexedDB.open('adelaide-metro-recordings', 2);
      let blocked = false;
      request.onupgradeneeded = event => {
        if (event.oldVersion === 0) {
          request.result.createObjectStore('sessions', {keyPath: 'id'});
          request.result.createObjectStore('frames', {keyPath: ['id', 'sequence']});
        }
        request.transaction.objectStore('frames').createIndex('byTime', ['id', 'frame.time']);
      };
      request.onblocked = () => {
        blocked = true;
        reject(new Error('Close older Transitron tabs to upgrade recording storage.'));
      };
      request.onsuccess = () => {
        const connection = request.result;
        if (blocked) { connection.close(); return; }
        connection.onversionchange = () => {
          connection.close();
          database = undefined;
        };
        resolve(connection);
      };
      request.onerror = () => reject(request.error);
    }).catch(error => {
      database = undefined;
      throw error;
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

  function removeStoredRecording(id) {
    return transaction(['sessions', 'frames'], 'readwrite', tx => {
      tx.objectStore('sessions').delete(id);
      tx.objectStore('frames').delete(IDBKeyRange.bound([id, 0], [id, Infinity]));
    });
  }

  async function indexedRecording(session) {
    const times = [];
    await transaction(['frames'], 'readonly', tx => {
      const range = IDBKeyRange.bound([session.id, -Infinity], [session.id, Infinity]);
      const request = tx.objectStore('frames').index('byTime').openKeyCursor(range);
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        const [, sequence] = cursor.primaryKey;
        if (sequence < session.frameCount) times[sequence] = cursor.key[1];
        cursor.continue();
      };
    });
    if (times.length !== session.frameCount || times.includes(undefined)) throw new Error('Recording frames are unavailable.');
    return pagedRecording(session, times, async (offset, count) => {
      const range = IDBKeyRange.bound([session.id, offset], [session.id, offset + count - 1]);
      const entries = await transaction(['frames'], 'readonly', tx => tx.objectStore('frames').getAll(range, count));
      return entries.map(entry => entry.frame);
    });
  }

  function pagedRecording(meta, times, readPage) {
    const pages = new Map();
    return {...meta, times, async read(first, count) {
      const frames = [];
      const end = Math.min(first + count, times.length);
      for (let index = first; index < end;) {
        const offset = Math.floor(index / framePageSize) * framePageSize;
        const length = Math.min(framePageSize, times.length - offset);
        const page = pages.get(offset) ?? readPage(offset, length).then(rows => {
          if (rows.length < length) throw new Error('Recording frame page is incomplete.');
          const frames = rows.slice(0, length);
          if (frames.some((frame, index) => frame?.time !== times[offset + index])) {
            throw new Error('Recording frames do not match the timestamp index.');
          }
          return frames;
        });
        pages.delete(offset);
        pages.set(offset, page);
        if (pages.size > 4) pages.delete(pages.keys().next().value);
        let rows;
        try { rows = await page; } catch (error) {
          if (pages.get(offset) === page) pages.delete(offset);
          throw error;
        }
        const next = Math.min(offset + length, end);
        frames.push(...rows.slice(index - offset, next - offset));
        index = next;
      }
      return frames;
    }};
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

  function validateMetadata(meta) {
    if (![1, 2].includes(meta?.version) || !Number.isFinite(meta.startedAt) || Math.abs(meta.startedAt) > 8.64e15) {
      throw new Error('Choose an Adelaide Metro recording.');
    }
    return {...meta, intervalSeconds: validateRecordingInterval(meta.intervalSeconds)};
  }

  function validateFrame(frame, previous) {
    if (!Number.isFinite(frame?.time) || Math.abs(frame.time) > 8.64e15 || frame.time < previous ||
        !endpoints.every(endpoint => {
          const feed = frame.feeds?.[endpoint];
          return Number.isFinite(feed?.time) && (typeof feed.error === 'string' ||
            (Array.isArray(feed.rows) && feed.rows.every(row => row && typeof row === 'object' && !Array.isArray(row))));
        })) {
      throw new Error('Recording contains an invalid frame.');
    }
    return frame.time;
  }

  function loadedRecording(session) {
    const {frames, ...meta} = validateMetadata(session);
    if (!Array.isArray(frames)) throw new Error('Recording frames are missing.');
    let previous = -Infinity;
    const times = frames.map(frame => previous = validateFrame(frame, previous));
    return {...meta, times, read: async (first, count) => frames.slice(first, first + count)};
  }

  function downloadLink(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }

  async function download(session) {
    const {times, read, ...meta} = session;
    const encode = new TextEncoder();
    const line = value => encode.encode(JSON.stringify(value, (_, item) => typeof item === 'bigint' ? String(item) : item) + '\n');
    let offset = 0;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(line({...meta, version: 2, format: exportFormat, frameCount: times.length}));
      },
      async pull(controller) {
        if (offset >= times.length) { controller.close(); return; }
        const frames = await read(offset, framePageSize);
        if (!frames.length) throw new Error('Recording frame is unavailable.');
        for (const frame of frames) controller.enqueue(line(frame));
        offset += frames.length;
      }
    });
    const blob = await new Response(stream.pipeThrough(new CompressionStream('gzip')),
      {headers: {'Content-Type': 'application/gzip'}}).blob();
    const url = URL.createObjectURL(blob);
    downloadLink(url, 'adelaide-metro-' + new Date(session.startedAt).toISOString().replaceAll(':', '-') + '.ndjson.gz');
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }

  async function* compressedLines(file) {
    const reader = file.stream().pipeThrough(new DecompressionStream('gzip'))
      .pipeThrough(new TextDecoderStream('utf-8', {fatal: true})).getReader();
    let line = '';
    try {
      while (true) {
        const {value, done} = await reader.read();
        if (done) break;
        line += value;
        let start = 0;
        for (let end = line.indexOf('\n'); end !== -1; end = line.indexOf('\n', start)) {
          yield line.slice(start, end);
          start = end + 1;
        }
        line = line.slice(start);
      }
      if (line) yield line;
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }
  }

  async function importCompressed(file) {
    const id = crypto.randomUUID();
    let session;
    let previous = -Infinity;
    let sequence = 0;
    let batch = [];
    const saveBatch = () => transaction(['sessions', 'frames'], 'readwrite', tx => {
      const sessions = tx.objectStore('sessions');
      const lookup = sessions.getKey(id);
      lookup.onsuccess = () => {
        if (lookup.result === undefined) { tx.abort(); return; }
        for (const entry of batch) tx.objectStore('frames').add(entry);
      };
      return lookup;
    });
    try {
      for await (const line of compressedLines(file)) {
        if (!session) {
          const manifest = validateMetadata(JSON.parse(line));
          if (manifest.version !== 2 || manifest.format !== exportFormat ||
              !Number.isSafeInteger(manifest.frameCount) || manifest.frameCount < 0) {
            throw new Error('Choose a compressed Transitron recording.');
          }
          session = {...manifest, id, name: file.name, mode: 'imported', importing: true};
          await transaction(['sessions'], 'readwrite', tx => tx.objectStore('sessions').add(session));
          continue;
        }
        if (sequence >= session.frameCount) throw new Error('Compressed recording has extra frames.');
        const frame = JSON.parse(line);
        previous = validateFrame(frame, previous);
        batch.push({id, sequence: sequence++, frame});
        if (batch.length === framePageSize) {
          await saveBatch();
          batch = [];
        }
      }
      if (!session || sequence !== session.frameCount) throw new Error('Compressed recording is incomplete.');
      if (batch.length) await saveBatch();
      await transaction(['sessions'], 'readwrite', tx => {
        const sessions = tx.objectStore('sessions');
        const lookup = sessions.getKey(id);
        lookup.onsuccess = () => {
          if (lookup.result === undefined) { tx.abort(); return; }
          sessions.put({...session, importing: false});
        };
        return lookup;
      });
      return indexedRecording(session);
    } catch (error) {
      if (session) await removeStoredRecording(id).catch(() => {});
      throw error;
    }
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

  function lastFrameAt(times, time) {
    let low = 0;
    let high = times.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (times[mid] <= time) low = mid + 1;
      else high = mid;
    }
    return low - 1;
  }

  function init({capture, config, refreshLive, statusChanged, display, exit}) {
    const panel = document.getElementById('recorderDeck');
    if (!panel) return;
    const controls = Object.fromEntries(Array.from(panel.querySelectorAll('[data-control]'),
      element => [element.dataset.control, element]));
    const dial = controls.speed.parentElement;
    const dialAngle = index => -135 + index * 45;
    controls.speed.max = playbackSpeeds.length - 1;
    const speedStops = playbackSpeeds.map((speed, index) => {
      const stop = document.createElement('span');
      stop.className = 'recorder-dial-stop';
      stop.style.setProperty('--stop-angle', dialAngle(index) + 'deg');
      stop.textContent = speed + '×';
      return stop;
    });
    controls['speed-stops'].append(...speedStops);

    let powered = true;
    let intervalIndex = intervalPresets.indexOf(defaultIntervalSeconds);
    let browserSession;
    let browserAvailable;
    let deletingRecording = false;
    let backgroundSession;
    let backgroundFrameTime = 0;
    let backgroundAvailable;
    let backgroundPaged = false;
    let backgroundHealth;
    let browserStorageError;
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
    let seeking = false;
    let seekGeneration = 0;
    let pendingSeek = Promise.resolve();
    let motionGeneration = 0;
    let playbackHistory = new Map();
    let visibleFrame;
    let transport = 'paused';
    let cursor;
    let displayedSecond;
    let currentFrame = -1;
    let firstHistoryFrame = -1;
    let inCaptureGap = false;
    let animation = 0;
    let lastTick;
    let scanPress;

    function publishActivity() {
      statusChanged([browserSession, backgroundSession].filter(Boolean));
      syncDeck();
    }

    function show(control, message) {
      if (controls[control].textContent !== message) controls[control].textContent = message;
    }
    function syncClock() {
      const timestamp = playback && transport !== 'paused' && Number.isFinite(cursor) ? cursor : Date.now();
      const second = Math.floor(timestamp / 1000);
      if (second !== displayedSecond) {
        displayedSecond = second;
        show('clock', adelaideClock.format(second * 1000));
      }
    }

    function recordingSource() {
      return controls.source.querySelector('input:checked').value;
    }

    function captureIsReady() {
      return recordingSource() === 'browser'
        ? browserAvailable && !deletingRecording
        : backgroundAvailable && !backgroundBusy;
    }

    function selectedCapture() {
      return recordingSource() === 'browser' ? browserSession : backgroundSession;
    }

    function syncTransport() {
      const loading = Boolean(playbackLoad);
      const start = playback?.times[0];
      const end = playback?.times.at(-1);
      const canMove = end > start;
      const newSelection = controls.sessions.value && controls.sessions.value !== playbackSource;
      controls.play.disabled = loading || deletingRecording || !(newSelection || (canMove && transport !== 'play'));
      controls['library-play'].disabled = controls.play.disabled;
      controls.pause.disabled = transport === 'paused';
      controls.rewind.disabled = loading || !playback || (currentFrame <= 0 && cursor <= start);
      controls['fast-forward'].disabled = loading || !playback ||
        (currentFrame >= playback.times.length - 1 && cursor >= end);
      controls.stop.disabled = !(playback || loading ||
        (captureIsReady() && selectedCapture() && !(recordingSource() === 'browser' && stopRequested)));
      controls.timeline.disabled = loading || !canMove;
      controls['skip-gaps'].disabled = loading || seeking || !playback || !inCaptureGap ||
        currentFrame >= playback.times.length - 1;
    }

    function syncSettings() {
      const speedIndex = controls.speed.valueAsNumber;
      const speedText = playbackSpeeds[speedIndex] + '×';
      dial.style.setProperty('--dial-angle', dialAngle(speedIndex) + 'deg');
      controls.speed.setAttribute('aria-valuetext', speedText);
      speedStops.forEach((stop, index) => { stop.dataset.selected = String(index === speedIndex); });
      show('speed-display', powered ? speedText : '');
      show('interval-display', powered ? intervalPresets[intervalIndex] + 's' : '');
      const intervalLocked = Boolean(selectedCapture()) || backgroundBusy;
      controls['keep-raw'].disabled = intervalLocked;
      controls['interval-up'].disabled = intervalLocked || intervalIndex === intervalPresets.length - 1;
      controls['interval-down'].disabled = intervalLocked || intervalIndex === 0;
    }

    function turnDial(event) {
      const {left, top, width, height} = dial.getBoundingClientRect();
      const dx = event.clientX - left - width / 2;
      const dy = event.clientY - top - height / 2;
      if (Math.hypot(dx, dy) < 8) return;
      const degrees = Math.atan2(dx, -dy) * 180 / Math.PI;
      const index = Math.round((degrees - dialAngle(0)) / 45);
      controls.speed.valueAsNumber = Math.max(0, Math.min(playbackSpeeds.length - 1, index));
      syncSettings();
    }

    function stepInterval(step) {
      intervalIndex += step;
      syncSettings();
    }

    function syncDeck() {
      const recording = browserSession || backgroundSession;
      const armedCapture = selectedCapture();
      panel.dataset.power = powered ? 'on' : 'standby';
      panel.dataset.recording = String(Boolean(recording));
      panel.dataset.transport = playback ? transport : 'idle';
      controls.power.setAttribute('aria-pressed', String(powered));
      controls.deck.disabled = !powered;
      controls.library.hidden = !powered;
      controls.sessions.disabled = !controls.sessions.value || Boolean(playbackLoad);
      controls['library-up'].disabled = controls.sessions.disabled || controls.sessions.selectedIndex <= 0;
      controls['library-down'].disabled = controls.sessions.disabled ||
        controls.sessions.selectedIndex >= controls.sessions.options.length - 1;
      controls.record.disabled = !captureIsReady() || Boolean(armedCapture);
      controls.record.dataset.engaged = String(Boolean(armedCapture));
      const libraryBusy = Boolean(playbackLoad) || deletingRecording;
      controls.import.disabled = libraryBusy;
      controls.export.disabled = libraryBusy || !controls.sessions.value;
      controls['delete-recording'].disabled = libraryBusy || Boolean(browserSession) || !isLocalRecording(controls.sessions.value);
      for (const action of ['play', 'rewind', 'fast-forward', 'pause']) {
        const engaged = action === transport || (action === 'pause' && transport === 'paused');
        controls[action].dataset.engaged = String(Boolean(playback) && engaged);
      }
      syncTransport();
      syncSettings();
      syncClock();

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
        if (backgroundHealth?.resumed) activity.push('Resumed after restart');
        if (backgroundHealth?.feedFailures?.length) {
          activity.push('Feed failures · ' + backgroundHealth.feedFailures.map(name => name.replaceAll('_', ' ')).join(', '));
        }
      }
      const lastSavedAt = selectedCapture()?.lastSavedAt ?? backgroundSession?.lastSavedAt ?? browserSession?.lastSavedAt;
      if (Number.isFinite(lastSavedAt)) activity.push('Last saved ' + adelaideTime.format(lastSavedAt));
      if (browserSession?.feedFailures?.length) {
        activity.push('Browser feed failures · ' + browserSession.feedFailures.map(name => name.replaceAll('_', ' ')).join(', '));
      }
      if (backgroundHealth?.error) activity.push(backgroundHealth.error);
      if ((recordingSource() === 'background' || backgroundSession) && !backgroundAvailable) {
        activity.push(backgroundAvailable === false ? 'Background recorder unavailable.' : 'Checking background recorder…');
      }
      if (recordingSource() === 'browser' && browserAvailable === false) {
        activity.push(browserStorageError || 'Browser storage unavailable.');
      }
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
        items.unshift({name, mode: 'imported', count: session.times.length, value});
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
          browserRecordings = records.filter(record => !record.importing);
          updateLibrary();
        }, error => {
          browserAvailable = false;
          browserStorageError = error.message;
        })
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
        const {activeId, sessions, latestFrame, pagedFrames, health} = result;
        backgroundPaged = pagedFrames === true;
        backgroundHealth = health;
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

    async function deleteRecording() {
      const choice = controls.sessions.value;
      if (controls['delete-recording'].matches(':disabled') || !isLocalRecording(choice)) return;
      const name = controls.sessions.selectedOptions[0].dataset.name;
      if (!window.confirm('Permanently delete “' + name + '” from this library?')) return;
      deletingRecording = true;
      syncDeck();
      try {
        if (!imports.delete(choice)) {
          const id = choice.slice(choice.indexOf(':') + 1);
          await removeStoredRecording(id);
          if (browserCatalog) await browserCatalog;
          browserRecordings = browserRecordings.filter(recording => recording.id !== id);
        }
        if (playbackSource === choice) closePlayback();
        updateLibrary();
        show('status', 'Recording deleted.');
      } finally {
        deletingRecording = false;
        syncDeck();
      }
    }

    function recordingSettings() {
      return {...config(), intervalSeconds: intervalPresets[intervalIndex], keepRaw: controls['keep-raw'].checked};
    }

    async function recordBrowser() {
      const startedAt = Date.now();
      const settings = recordingSettings();
      const interval = settings.intervalSeconds * 1000;
      browserSession = {
        version: 2, id: crypto.randomUUID(), mode: 'browser', startedAt, endedAt: null,
        intervalSeconds: settings.intervalSeconds, frameCount: 0, keepRaw: settings.keepRaw
      };
      stopRequested = false;
      let previousFrameTime;
      let slot = performance.now();
      try {
        publishActivity();
        await transaction(['sessions'], 'readwrite', tx => tx.objectStore('sessions').add(browserSession));
        while (!stopRequested) {
          const deadline = AbortSignal.timeout(Math.min(interval, 15_000));
          const frame = await capture(settings, settings.keepRaw, deadline);
          frame.time = Math.max(frame.time, (previousFrameTime ?? startedAt - 1) + 1);
          const gap = frame.time - previousFrameTime;
          if (gap > interval * 1.5) frame.gapMs = gap;
          previousFrameTime = frame.time;
          const updated = {...browserSession, frameCount: browserSession.frameCount + 1, lastSavedAt: frame.time,
            feedFailures: endpoints.filter(endpoint => frame.feeds[endpoint].error)};
          await updateBrowserSession(updated, frame);
          browserSession = updated;
          refreshLive(frame);
          publishActivity();
          void refreshBrowserCatalog();
          if (!stopRequested) {
            const now = performance.now();
            slot += interval;
            if (slot < now) slot += Math.ceil((now - slot) / interval) * interval;
            await new Promise(resolve => {
              const timer = setTimeout(resolve, Math.max(0, slot - now));
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
          show('status', stopped.error || 'Background recording saved.');
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
      if (mode === 'background') {
        const url = '/' + encodeURIComponent(id);
        if (!backgroundPaged) return loadedRecording(await request(url));
        const {times, ...meta} = validateMetadata(await request(url + '/meta'));
        if (!Array.isArray(times) || times.length !== meta.frameCount || times.some((time, index) =>
          !Number.isFinite(time) || Math.abs(time) > 8.64e15 || (index > 0 && time < times[index - 1]))) {
          throw new Error('Recording index is invalid.');
        }
        return pagedRecording(meta, times, async offset => {
          const page = await request(url + '/frames?offset=' + offset);
          if (page.offset !== offset || !Array.isArray(page.frames)) throw new Error('Recording frame page is invalid.');
          return page.frames;
        });
      }
      const metadata = await transaction(['sessions'], 'readonly', tx => tx.objectStore('sessions').get(id));
      if (!metadata || metadata.importing) throw new Error('Recording unavailable');
      return indexedRecording(validateMetadata(metadata));
    }

    function seek(time, force = false, targetFrame) {
      const generation = ++seekGeneration;
      // Finish the outstanding page request and keep only the latest position when scrubbing.
      const run = () => generation === seekGeneration && seekTo(time, force, targetFrame, generation);
      pendingSeek = pendingSeek.then(run, run);
      return pendingSeek;
    }

    async function seekTo(time, force, targetFrame, generation) {
      const session = playback;
      const {times, read} = session;
      const start = times[0];
      const end = times.at(-1);
      const interval = session.intervalSeconds * 1000;
      const position = Math.min(end, Math.max(start, time));
      const index = targetFrame ?? lastFrameAt(times, position);
      const first = lastFrameAt(times, position - historyWindow - 1) + 1;
      const gap = position - times[index] > interval * 1.5;
      let frame = visibleFrame;
      let history = playbackHistory;
      const render = force || currentFrame !== index || firstHistoryFrame !== first;
      if (render) {
        seeking = true;
        syncTransport();
        history = new Map();
        try {
          if (currentFrame !== index || !frame) [frame] = await read(index, 1);
          if (generation !== seekGeneration) return false;
          for (let sequence = first; sequence <= index;) {
            const cached = playbackHistory.get(sequence);
            if (cached) {
              history.set(sequence++, cached);
              continue;
            }
            const count = Math.min(framePageSize, index - sequence + 1);
            const batch = await read(sequence, count);
            if (generation !== seekGeneration) return false;
            if (batch.length !== count) throw new Error('Recording frame is unavailable.');
            for (const {time, feeds} of batch) {
              // The history overlay only uses vehicle positions.
              history.set(sequence++, {time, feeds: {vehicle_positions: {rows: feeds.vehicle_positions.rows}}});
            }
          }
        } finally {
          if (generation === seekGeneration) {
            seeking = false;
            syncTransport();
          }
        }
      }
      if (!frame) throw new Error('Recording frame is unavailable.');
      cursor = position;
      if (force || currentFrame !== index || inCaptureGap !== gap) {
        const missing = endpoints.filter(endpoint => frame.feeds[endpoint].error);
        show('frame-status', [
          'Frame ' + (index + 1) + ' of ' + times.length + ' · ' + adelaideTime.format(times[index]),
          missing.length ? 'Unavailable: ' + missing.map(name => name.replaceAll('_', ' ')).join(', ') : '',
          gap ? 'Gap in capture · showing last recorded frame' : ''
        ].filter(Boolean).join(' · '));
      }
      inCaptureGap = gap;
      if (render) {
        visibleFrame = frame;
        currentFrame = index;
        firstHistoryFrame = first;
        playbackHistory = history;
        display(frame, [...history.values()], cursor, start, interval, playbackSource);
      }
      const elapsed = cursor - start;
      const duration = end - start;
      const positionText = timeLabel(elapsed) + ' of ' + timeLabel(duration);
      controls.timeline.value = String(Math.round(elapsed));
      if (controls.timeline.getAttribute('aria-valuetext') !== positionText) {
        controls.timeline.setAttribute('aria-valuetext', positionText);
      }
      show('elapsed', timeLabel(elapsed) + ' / ' + timeLabel(duration));
      syncClock();
      syncTransport();
      return true;
    }

    function resetMotion(nextTransport = 'paused') {
      cancelAnimationFrame(animation);
      animation = 0;
      lastTick = undefined;
      transport = nextTransport;
      motionGeneration++;
      seekGeneration++;
      seeking = false;
    }

    function clearScanPress() {
      if (!scanPress) return;
      const {timer, pointerId, button} = scanPress;
      scanPress = null;
      clearTimeout(timer);
      if (pointerId !== null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
    }

    function pause() {
      clearScanPress();
      resetMotion();
      syncDeck();
    }

    async function tick(now, generation) {
      if (generation !== motionGeneration) return;
      const speed = transport === 'play' ? playbackSpeeds[controls.speed.valueAsNumber]
        : (transport === 'rewind' ? -scanSpeed : scanSpeed);
      // Keep the animation clock stopped while an uncached frame is being read.
      const began = performance.now();
      try {
        if (lastTick !== undefined) await seek(cursor + Math.max(0, now - lastTick) * speed);
      } catch (error) {
        if (generation !== motionGeneration) return;
        pause();
        show('status', error.message);
        return;
      }
      if (generation !== motionGeneration) return;
      const wait = performance.now() - began;
      lastTick = now + (wait > 16 ? wait : 0);
      const atEnd = speed < 0 ? cursor <= playback.times[0] : cursor >= playback.times.at(-1);
      if (atEnd) pause();
      else animation = requestAnimationFrame(time => void tick(time, generation));
    }

    async function move(direction, targetFrame) {
      const start = playback.times[0];
      const end = playback.times.at(-1);
      if (end <= start) return;
      if (direction === 'play') clearScanPress();
      resetMotion(direction);
      const generation = motionGeneration;
      syncDeck();
      const index = targetFrame ?? (direction === 'play' && cursor >= end ? 0 : undefined);
      try {
        if (index !== undefined && !await seek(playback.times[index], true, index)) return;
      } catch (error) {
        if (generation === motionGeneration) pause();
        throw error;
      }
      if (generation !== motionGeneration) return;
      animation = requestAnimationFrame(time => void tick(time, generation));
    }

    function stepPlayback(step) {
      if (!playback || playbackLoad) return;
      const index = currentFrame + step;
      const time = playback.times[index];
      pause();
      if (time !== undefined) return seek(time, true, index);
    }

    function endScanPress(tap) {
      if (!scanPress) return;
      const {held, step} = scanPress;
      clearScanPress();
      if (held) pause();
      else if (tap) void action(() => stepPlayback(step))();
    }

    function bindScanKey(direction, step) {
      const button = controls[direction];
      const available = () => !button.matches(':disabled') && !scanPress;
      const begin = (pointerId, key) => {
        const press = {button, pointerId, key, step, held: false};
        scanPress = press;
        press.timer = setTimeout(() => {
          press.held = true;
          if (!button.matches(':disabled')) move(direction);
        }, scanHoldMs);
      };
      const ownsPointer = event => scanPress?.button === button && scanPress.pointerId === event.pointerId;
      button.addEventListener('pointerdown', event => {
        if (event.button !== 0 || !event.isPrimary || !available()) return;
        event.preventDefault();
        button.focus({preventScroll: true});
        button.setPointerCapture(event.pointerId);
        begin(event.pointerId);
      });
      button.addEventListener('pointerup', event => {
        if (!ownsPointer(event)) return;
        const {left, right, top, bottom} = button.getBoundingClientRect();
        const inside = event.clientX >= left && event.clientX <= right &&
          event.clientY >= top && event.clientY <= bottom;
        endScanPress(inside);
      });
      for (const type of ['pointercancel', 'lostpointercapture']) {
        button.addEventListener(type, event => {
          if (ownsPointer(event)) endScanPress(false);
        });
      }
      button.addEventListener('contextmenu', event => {
        if (scanPress?.button === button) event.preventDefault();
      });
      button.addEventListener('blur', () => {
        if (scanPress?.button === button) endScanPress(false);
      });
      button.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!event.repeat && available()) begin(null, event.key);
      });
      button.addEventListener('keyup', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (scanPress?.button === button && scanPress.key === event.key) endScanPress(true);
      });
      // Assistive technology can activate the button without pointer or key events.
      button.addEventListener('click', event => {
        if (event.detail === 0 && available()) void action(() => stepPlayback(step))();
      });
    }

    async function skipGap() {
      if (controls['skip-gaps'].disabled) return;
      const direction = transport;
      const index = currentFrame + 1;
      if ((direction === 'play' || direction === 'fast-forward') && index < playback.times.length - 1) {
        clearScanPress();
        return move(direction, index);
      }
      pause();
      return seek(playback.times[index], true, index);
    }

    async function openPlayback(session, source) {
      if (!session.times.length) throw new Error('This recording has no frames yet');
      playback = session;
      playbackSource = source;
      pendingSeek = Promise.resolve();
      visibleFrame = undefined;
      playbackHistory = new Map();
      currentFrame = -1;
      firstHistoryFrame = -1;
      inCaptureGap = false;
      controls.timeline.max = String(session.times.at(-1) - session.times[0]);
      if (session.error) show('status', 'Capture ended early: ' + session.error);
      return seek(session.times[0], true, 0);
    }

    async function loadPlayback(load, source, autoplay = false) {
      clearScanPress();
      resetMotion();
      const pending = load();
      playbackLoad = pending;
      syncDeck();
      try {
        const session = await pending;
        if (playbackLoad !== pending || !session) return;
        if (session.mode === 'imported' && !imports.has(source)) source = 'imported:' + session.id;
        if (imports.has(source) || session.mode === 'imported') controls.sessions.value = source;
        if (await openPlayback(session, source) && autoplay && playbackLoad === pending) await move('play');
      } catch (error) {
        if (playbackLoad === pending) {
          closePlayback();
          throw error;
        }
      } finally {
        if (playbackLoad === pending) {
          playbackLoad = null;
          syncDeck();
        }
      }
    }

    function closePlayback() {
      clearScanPress();
      resetMotion();
      playbackLoad = null;
      if (playback) {
        playback = null;
        playbackSource = null;
        visibleFrame = undefined;
        playbackHistory = new Map();
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
      if (recordingSource() === 'background') return recordBackground(true);
      if (!browserSession || stopRequested) return;
      stopRequested = true;
      syncDeck();
      wake?.();
    }

    function play() {
      const choice = controls.sessions.value;
      if (choice && choice !== playbackSource) return loadPlayback(() => selectedSession(choice), choice, true);
      if (playback) return move('play');
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
    controls.speed.oninput = syncSettings;
    dial.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !event.isPrimary || controls.speed.matches(':disabled')) return;
      event.preventDefault();
      controls.speed.focus({preventScroll: true});
      dial.setPointerCapture(event.pointerId);
      turnDial(event);
    });
    dial.addEventListener('pointermove', event => {
      if (dial.hasPointerCapture(event.pointerId) && !controls.speed.matches(':disabled')) turnDial(event);
    });
    controls['interval-up'].onclick = () => stepInterval(1);
    controls['interval-down'].onclick = () => stepInterval(-1);
    controls.record.onclick = action(() => recordingSource() === 'browser' ? recordBrowser() : recordBackground());
    controls.stop.onclick = action(stop);
    controls.play.onclick = action(play);
    controls.pause.onclick = pause;
    bindScanKey('rewind', -1);
    bindScanKey('fast-forward', 1);
    window.addEventListener('blur', () => endScanPress(false));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) endScanPress(false);
    });
    controls['library-up'].onclick = () => moveLibrarySelection(-1);
    controls['library-down'].onclick = () => moveLibrarySelection(1);
    controls['library-play'].onclick = () => controls.play.click();
    controls.sessions.onchange = syncDeck;
    controls.sessions.onkeydown = event => {
      if (event.key !== 'Enter' || controls.play.disabled) return;
      event.preventDefault();
      controls.play.click();
    };
    controls['delete-recording'].onclick = action(deleteRecording);
    controls.export.onclick = action(async () => {
      const choice = controls.sessions.value;
      if (backgroundPaged && choice.startsWith('background:')) {
        const id = encodeURIComponent(choice.slice('background:'.length));
        return downloadLink(api + '/' + id + '/export', 'transitron-' + id + '.ndjson.gz');
      }
      await download(await selectedSession(choice));
    });
    controls.import.onclick = () => controls.file.click();
    controls.file.onchange = action(async () => {
      const file = controls.file.files[0];
      controls.file.value = '';
      if (!file || !powered) return;
      const source = 'imported:' + ++nextImportId;
      await loadPlayback(async () => {
        const compressed = /\.gz$/i.test(file.name);
        const session = compressed ? await importCompressed(file) : loadedRecording(JSON.parse(await file.text()));
        if (compressed) {
          if (browserCatalog) await browserCatalog;
          await refreshBrowserCatalog();
        } else {
          imports.set(source, {name: file.name, session});
          updateLibrary();
        }
        if (!session.times.length) {
          show('status', 'Recording imported. No frames to play.');
          return null;
        }
        return session;
      }, source);
    });

    controls['skip-gaps'].onclick = action(skipGap);
    controls.timeline.oninput = action(() => {
      const position = playback.times[0] + Number(controls.timeline.value);
      pause();
      return seek(position, true);
    });

    function refreshCatalog() {
      if (document.hidden) return;
      void refreshBrowserCatalog();
      void refreshBackgroundCatalog();
    }

    syncDeck();
    void refreshBrowserCatalog();
    void refreshBackgroundCatalog();
    setInterval(refreshCatalog, 5000);
    setInterval(syncClock, 1000);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {validateRecordingInterval};
  } else {
    window.MetroRecording = {init};
  }
})();
