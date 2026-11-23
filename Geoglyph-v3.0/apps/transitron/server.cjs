const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { createReadStream } = require('node:fs');
const { randomUUID } = require('node:crypto');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { createGzip } = require('node:zlib');
const { RecordingStore, pageSize, sessionPattern, stringify } = require('./recording-store.cjs');
const decoder = require('./js/gtfs.js');
const { validateRecordingInterval } = require('./js/recording.js');

const root = __dirname;
const suiteRoot = path.resolve(root, '../..');
const suitePublicPath = /^(?:index\.html|(?:assets|launcher|shared|vendor)\/.+|apps\/(?:geoglyph\/(?:index\.html|(?:src|dist)\/.+)|panoptigon\/(?:index\.html|(?:css|js|vendor)\/.+)|umbramatic\/(?:ShadowPlayer|SampleExport)\/.+))$/;
const port = Number(process.env.METRO_PORT || 8080);
const storage = path.resolve(process.env.METRO_RECORDINGS_DIR || path.join(root, '.metro-recordings'));
const defaultFeed = 'https://gtfs.adelaidemetro.com.au/v1/realtime';
const feedParsers = {
  vehicle_positions: 'parseVehicles',
  trip_updates: 'parseTrips',
  service_alerts: 'parseAlerts'
};
const mediaTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.geojson': 'application/geo+json'
};
const suiteMediaTypes = {
  ...mediaTypes,
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};
function reply(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function validateURL(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Use an HTTP or HTTPS feed URL without credentials');
  }
  return url;
}

function feedURL(baseUrl, endpoint) {
  const url = validateURL(baseUrl);
  url.pathname = url.pathname.replace(/\/+$/, '') + '/' + endpoint;
  return url;
}

async function readConfig(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 8192) throw new Error('Recording configuration is too large');
  }
  const data = JSON.parse(body || '{}');
  const baseUrl = validateURL(data.baseUrl || defaultFeed).href;
  const customProxyUrl = data.customProxyUrl || '';
  if (customProxyUrl) validateURL(customProxyUrl.replace('{url}', 'placeholder'));
  return { baseUrl, customProxyUrl, intervalSeconds: validateRecordingInterval(data.intervalSeconds), keepRaw: data.keepRaw === true };
}

async function getFeed(url, deadline = AbortSignal.timeout(6500)) {
  const response = await fetch(url, { signal: deadline, cache: 'no-store' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 2 || bytes[0] !== 0x0a) throw new Error('Response is not a GTFS-Realtime feed');
  return bytes;
}

async function captureFeed(endpoint, parse, config, deadline) {
  const direct = feedURL(config.baseUrl, endpoint);
  const urls = [direct];
  if (config.customProxyUrl) {
    urls.push(config.customProxyUrl.includes('{url}')
      ? config.customProxyUrl.replace('{url}', encodeURIComponent(direct.href))
      : feedURL(config.customProxyUrl, endpoint));
  }
  const errors = [];
  for (const url of urls) {
    if (deadline.aborted) break;
    let bytes;
    try {
      // Leave the shared deadline in place for fallback attempts.
      bytes = await getFeed(url, AbortSignal.any([deadline, AbortSignal.timeout(6500)]));
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    const time = Date.now();
  const raw = config.keepRaw ? {raw: bytes.toString('base64')} : {};
    try {
      const rows = parse(bytes);
      return { time, ...raw, rows };
    } catch (error) {
      return { time, ...raw, error: 'Decode failed: ' + error.message };
    }
  }
  return { time: Date.now(), error: errors.join(' / ') || 'Capture deadline elapsed.' };
}

function createRecorder(store, clock) {
  let active;
  let sealing;
  let archiveError;
  let closing = false;
  let closePending;
  let stopPending;
  const seal = async () => {
    if (closing || sealing) return sealing;
    sealing = (async () => {
      let failure;
      const now = clock.now();
      for (const meta of store.pendingArchives()) {
        try {
          const session = active?.meta.id === meta.id ? active : null;
          if (session?.stopping) continue;
          const cutoff = session?.captureTime ?? now;
          if (session) session.timeFloor = Math.max(session.timeFloor, cutoff);
          await store.seal(meta, cutoff);
        } catch (error) {
          failure = 'Segment save will retry: ' + error.message;
          if (archiveError !== failure) console.error(failure);
        }
      }
      archiveError = failure;
    })().catch(error => {
      archiveError = 'Could not check recording segments: ' + error.message;
    }).finally(() => { sealing = null; });
    return sealing;
  };

  function schedule(session) {
    if (closing || session.stopping) return;
    const interval = session.meta.intervalSeconds * 1000;
    const now = clock.monotonic();
    session.slot += interval;
    if (session.slot < now) session.slot += Math.ceil((now - session.slot) / interval) * interval;
    session.timer = setTimeout(() => runCapture(session), Math.max(0, session.slot - now));
  }

  function runCapture(session) {
    const time = Math.max(clock.now(), session.timeFloor, (session.lastSavedAt ?? -1) + 1);
    session.captureTime = time;
    const deadline = AbortSignal.timeout(Math.min(session.meta.intervalSeconds * 1000, 15000));
    session.pending = (async () => {
      try {
        const feeds = Object.fromEntries(await Promise.all(Object.entries(feedParsers).map(async ([name, method]) =>
          [name, await captureFeed(name, decoder[method], session.config, deadline)])));
        const frame = {time, feeds};
        if (session.lastSavedAt != null && time - session.lastSavedAt > session.meta.intervalSeconds * 1500) {
          frame.gapMs = time - session.lastSavedAt;
        }
        await store.saveFrame(session.meta, frame);
        session.lastSavedAt = time;
        session.latestFrame = {
          time, feeds: Object.fromEntries(Object.entries(feeds).map(([name, {time, rows, error}]) =>
            [name, {time, rows, error}]))
        };
        session.feedFailures = Object.keys(feeds).filter(name => feeds[name].error);
        session.captureError = undefined;
      } catch (error) {
        session.captureError = 'Frame save failed: ' + error.message;
        console.error(session.captureError);
      } finally {
        session.captureTime = undefined;
        schedule(session);
      }
    })();
  }

  function begin(meta, config, lastSavedAt, resumed) {
    active = {meta, config, lastSavedAt, resumed, slot: clock.monotonic(),
      timeFloor: Math.max(meta.startedAt, lastSavedAt ?? meta.startedAt)};
    runCapture(active);
  }

  const unfinished = store.sessions().find(({meta}) => meta.endedAt == null);
  if (unfinished) begin(unfinished.meta, unfinished.config, unfinished.meta.lastSavedAt, true);
  const maintenance = setInterval(seal, 1000);
  maintenance.unref();
  void seal();

  function close() {
    if (closePending) return closePending;
    closing = true;
    clearInterval(maintenance);
    clearTimeout(active?.timer);
    closePending = Promise.all([active?.pending, stopPending, sealing]).finally(() => store.close());
    return closePending;
  }

  async function api(req, res, url) {
    const match = /^\/api\/recordings(?:\/([^/]+)(?:\/(stop|meta|frames|export))?)?$/.exec(url.pathname);
    if (!match) return reply(res, 404, {error: 'Recording endpoint not found'});
    const [, id, operation] = match;
    if (id && !sessionPattern.test(id)) return reply(res, 404, {error: 'Recording not found'});
    if (closing) return reply(res, 503, {error: 'Recorder is shutting down'});
    if (req.method === 'POST' && !id) {
      let config;
      try { config = await readConfig(req); } catch (error) { return reply(res, 400, {error: error.message}); }
      if (closing) return reply(res, 503, {error: 'Recorder is shutting down'});
      if (active) return reply(res, 409, {error: 'A background recording is already running'});
      const meta = {version: 2, id: randomUUID(), startedAt: clock.now(), endedAt: null,
        mode: 'background', intervalSeconds: config.intervalSeconds, keepRaw: config.keepRaw};
      store.start(meta, config);
      begin(meta, config, null, false);
      return reply(res, 201, {id: meta.id});
    }
    if (req.method === 'POST' && operation === 'stop') {
      if (active?.meta.id !== id || active.stopping) return reply(res, 409, {error: 'This recording is not running'});
      const session = active;
      // Commit the stop before waiting for the pending capture or the archive.
      const terminal = {...session.meta, endedAt: Math.max(clock.now(), session.captureTime ?? 0, session.lastSavedAt ?? 0)};
      store.saveMeta(terminal);
      session.stopping = true;
      clearTimeout(session.timer);
      stopPending = (async () => {
        await session.pending;
        await sealing;
        active = null;
        await seal();
      })();
      await stopPending;
      return reply(res, 200, {id, latestFrame: session.latestFrame, ...(archiveError && {error: archiveError})});
    }
    if (req.method !== 'GET' || operation === 'stop') return reply(res, 405, {error: 'Method unavailable'});
    if (!id) {
      const legacy = await store.legacySessions();
      const entries = [...store.sessions(), ...legacy];
      const after = url.searchParams.get('after');
      const latestFrame = active?.latestFrame;
      return reply(res, 200, {
        activeId: active?.meta.id ?? null, pagedFrames: true,
        sessions: entries.map(({meta}) => meta).sort((a, b) => b.startedAt - a.startedAt),
        health: {resumed: active?.resumed, feedFailures: active?.feedFailures, error: active?.captureError ?? archiveError},
        ...(after !== null && latestFrame?.time > Number(after) && {latestFrame})
      });
    }

    const entry = store.sessions(id)[0] ?? (await store.legacySessions(id))[0];
    if (!entry) return reply(res, 404, {error: 'Recording not found'});
    const {meta, files} = entry;
    const read = (offset, count) => files ? store.readLegacy(id, files, offset, count) : store.readFrames(id, offset, count);
    if (operation === 'meta') {
      const times = files ? files.map(file => parseInt(file)) : store.index(id);
      return reply(res, 200, {...meta, times});
    }
    if (operation === 'export') {
      async function* records() {
        yield stringify({...meta, version: 2, format: 'transitron-ndjson'}) + '\n';
        for await (const frame of read(0, meta.frameCount)) yield stringify(frame) + '\n';
      }
      res.writeHead(200, {
        'Content-Type': 'application/gzip', 'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="transitron-${id}.ndjson.gz"`
      });
      await pipeline(Readable.from(records()), createGzip(), res);
      return;
    }
    if (!operation) {
      async function* legacyJSON() {
        yield stringify(meta).slice(0, -1) + ',"frames":[';
        let separator = '';
        for await (const frame of read(0, meta.frameCount)) {
          yield separator + stringify(frame);
          separator = ',';
        }
        yield ']}';
      }
      res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'});
      await pipeline(Readable.from(legacyJSON()), res);
      return;
    }
    const offset = Number(url.searchParams.get('offset') ?? 0);
    if (!Number.isSafeInteger(offset) || offset < 0) return reply(res, 400, {error: 'Invalid frame offset'});
    const frames = [];
    for await (const frame of read(offset, pageSize)) frames.push(frame);
    return reply(res, 200, {offset, frames});
  }

  return {api, close};
}

async function serveStatic(req, res, url) {
  if (!['GET', 'HEAD'].includes(req.method)) return reply(res, 405, { error: 'Method unavailable' });
  const requested = decodeURIComponent(url.pathname);
  if (requested === '/suite') return res.writeHead(308, {Location: '/suite/'}).end();
  if (requested.startsWith('/suite/')) {
    const relative = requested.slice('/suite/'.length) || 'index.html';
    const type = suiteMediaTypes[path.extname(relative).toLowerCase()];
    if (!type || !suitePublicPath.test(relative) || relative.split('/').some(part => !part || part.startsWith('.'))) {
      return reply(res, 404, { error: 'File not found' });
    }
    const file = await fs.realpath(path.join(suiteRoot, relative));
    if (!file.startsWith(suiteRoot + path.sep)) return reply(res, 404, { error: 'File not found' });
    return serveFile(req, res, file, type);
  }
  const relative = requested === '/' ? 'index.html' : requested.slice(1);
  const allowed = /^(?:index\.html|(?:assets|css|js|GTFS data)\/[\w .()-]+)$/.test(relative);
  const type = ['GTFS data/route-index.json', 'GTFS data/stop-details.json', 'GTFS data/startup-snapshot.json'].includes(relative)
    ? 'application/json'
    : mediaTypes[path.extname(relative)];
  if (!allowed || !type) return reply(res, 404, { error: 'File not found' });
  return serveFile(req, res, path.join(root, relative), type);
}

async function serveFile(req, res, file, type) {
  const info = await fs.stat(file);
  if (!info.isFile()) return reply(res, 404, { error: 'File not found' });
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': info.size,
    'Cache-Control': 'no-cache'
  });
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(file);
  stream.on('error', () => res.destroy());
  stream.pipe(res);
}

async function createDashboardServer({directory = storage, clock = {now: Date.now, monotonic: () => performance.now()}} = {}) {
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const store = new RecordingStore(directory);
  let recorder;
  try {
    recorder = createRecorder(store, clock);
  } catch (error) {
    store.close();
    throw error;
  }
  const server = http.createServer(async (req, res) => {
    try {
      const permittedHost = /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
      if (!permittedHost.test(req.headers.host || '')) return reply(res, 403, { error: 'Use a loopback URL' });
      const origin = 'http://' + req.headers.host;
      const url = new URL(req.url, origin);
      if (url.origin !== origin || (req.headers.origin && req.headers.origin !== origin)) {
        return reply(res, 403, { error: 'Cross-origin requests are unavailable' });
      }
      if (url.pathname.startsWith('/api/recordings')) return await recorder.api(req, res, url);
      const feed = /^\/api\/gtfs\/([^/]+)$/.exec(url.pathname)?.[1];
      if (Object.hasOwn(feedParsers, feed)) {
        if (req.method !== 'GET') return reply(res, 405, { error: 'Method unavailable' });
        const response = await getFeed(feedURL(defaultFeed, feed));
        res.writeHead(200, { 'Content-Type': 'application/x-protobuf', 'Cache-Control': 'no-store' });
        return res.end(response);
      }
      return await serveStatic(req, res, url);
    } catch (error) {
      if (res.headersSent) return res.destroy();
      if (error.code === 'ENOENT') return reply(res, 404, { error: 'File not found' });
      return reply(res, 500, { error: error.message });
    }
  });
  server.closeRecorder = recorder.close;
  server.once('close', () => void recorder.close().catch(console.error));
  return server;
}

async function main() {
  const server = await createDashboardServer();
  server.once('error', error => {
    console.error('Dashboard server could not listen: ' + error.message);
    process.exitCode = 1;
    void server.closeRecorder().catch(console.error);
  });
  server.listen(port, '127.0.0.1', () => {
    console.log('Adelaide Metro dashboard at http://127.0.0.1:' + server.address().port);
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close());
  }
}

module.exports = { createDashboardServer };

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
