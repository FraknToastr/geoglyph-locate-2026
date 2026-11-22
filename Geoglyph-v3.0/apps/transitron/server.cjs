const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const { createReadStream } = require('node:fs');
const { randomUUID } = require('node:crypto');
const decoder = require('./js/gtfs.js');
const { validateRecordingInterval } = require('./js/recording.js');

const root = __dirname;
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
let active;

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
  return { baseUrl, customProxyUrl, intervalSeconds: validateRecordingInterval(data.intervalSeconds) };
}

async function getFeed(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(6500), cache: 'no-store' });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 2 || bytes[0] !== 0x0a) throw new Error('Response is not a GTFS-Realtime feed');
  return bytes;
}

async function captureFeed(endpoint, parse, config) {
  const direct = feedURL(config.baseUrl, endpoint);
  const urls = [direct];
  if (config.customProxyUrl) {
    urls.push(config.customProxyUrl.includes('{url}')
      ? config.customProxyUrl.replace('{url}', encodeURIComponent(direct.href))
      : feedURL(config.customProxyUrl, endpoint));
  }
  const errors = [];
  for (const url of urls) {
    let bytes;
    try {
      bytes = await getFeed(url);
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    const time = Date.now();
    const raw = bytes.toString('base64');
    try {
      const rows = parse(bytes);
      return { time, raw, rows };
    } catch (error) {
      return { time, raw, error: 'Decode failed: ' + error.message };
    }
  }
  return { time: Date.now(), error: errors.join(' / ') };
}

function sessionDir(id) {
  return path.join(storage, id);
}

async function saveJSON(file, data) {
  const temporary = file + '.tmp';
  const json = JSON.stringify(data, (_, value) => typeof value === 'bigint' ? String(value) : value);
  await fs.writeFile(temporary, json);
  await fs.rename(temporary, file);
}

function metadataFile(id) {
  return path.join(sessionDir(id), 'session.json');
}

async function readJSON(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function frameFiles(id) {
  const files = await fs.readdir(sessionDir(id));
  return files.filter(file => /^\d+\.json$/.test(file)).sort((a, b) => parseInt(a) - parseInt(b));
}

async function capture(session) {
  const time = Date.now();
  try {
    const feeds = Object.fromEntries(await Promise.all(
      Object.entries(feedParsers).map(async ([endpoint, method]) => [
        endpoint, await captureFeed(endpoint, decoder[method], session.config)
      ])
    ));
    await saveJSON(path.join(sessionDir(session.meta.id), time + '.json'), { time, feeds });
    session.latestFrame = {
      time,
      feeds: Object.fromEntries(Object.entries(feeds).map(([name, {time, rows, error}]) => [name, {time, rows, error}]))
    };
    if (!session.stopping) {
      const interval = session.meta.intervalSeconds * 1000;
      session.timer = setTimeout(() => runCapture(session), Math.max(0, time + interval - Date.now()));
    }
  } catch (error) {
    session.meta.error = 'Recording stopped: ' + error.message;
    session.meta.endedAt = Date.now();
    console.error(session.meta.error);
    await saveJSON(metadataFile(session.meta.id), session.meta).catch(console.error);
    if (active === session) active = null;
  }
}

function runCapture(session) {
  session.pending = capture(session);
}

async function startRecording(config) {
  const meta = {
    version: 1, id: randomUUID(), startedAt: Date.now(), endedAt: null,
    mode: 'background', intervalSeconds: config.intervalSeconds
  };
  const session = { meta, config };
  active = session;
  session.ready = (async () => {
    await fs.mkdir(sessionDir(meta.id), { recursive: true, mode: 0o700 });
    await saveJSON(metadataFile(meta.id), meta);
  })();
  try {
    await session.ready;
  } catch (error) {
    active = null;
    throw error;
  }
  if (!session.stopping) runCapture(session);
  return meta.id;
}

async function stopRecording(session) {
  session.stopping = true;
  clearTimeout(session.timer);
  try {
    await session.ready;
    await session.pending;
    session.meta.endedAt ??= Date.now();
    await saveJSON(metadataFile(session.meta.id), session.meta);
  } finally {
    if (active === session) active = null;
  }
}

const sessionPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;

async function listRecordings() {
  const ids = (await fs.readdir(storage)).filter(name => sessionPattern.test(name));
  const sessions = await Promise.all(ids.map(async id => {
    try {
      const meta = await readJSON(metadataFile(id));
      const frames = await frameFiles(id);
      if (meta.endedAt === null && active?.meta.id !== id) {
        meta.endedAt = frames.length ? parseInt(frames.at(-1)) : meta.startedAt;
        meta.error = 'Recording was interrupted';
      }
      return { ...meta, frameCount: frames.length };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      return null;
    }
  }));
  return sessions.filter(Boolean).sort((a, b) => b.startedAt - a.startedAt);
}

async function recordingAPI(req, res, url) {
  const match = /^\/api\/recordings(?:\/([^/]+)(\/stop)?)?$/.exec(url.pathname);
  if (!match) return reply(res, 404, { error: 'Recording endpoint not found' });
  const [, id, stop] = match;
  if (id && !sessionPattern.test(id)) return reply(res, 404, { error: 'Recording not found' });
  if (req.method === 'POST' && !id) {
    let config;
    try {
      config = await readConfig(req);
    } catch (error) {
      return reply(res, 400, { error: error.message });
    }
    if (active) return reply(res, 409, { error: 'A background recording is already running' });
    return reply(res, 201, { id: await startRecording(config) });
  }
  if (req.method === 'POST' && stop) {
    if (active?.meta.id !== id || active.stopping) {
      return reply(res, 409, { error: 'This recording is not running' });
    }
    const session = active;
    await stopRecording(session);
    return reply(res, 200, { id, latestFrame: session.latestFrame });
  }
  if (req.method !== 'GET' || stop) return reply(res, 405, { error: 'Method unavailable' });
  const sessions = await listRecordings();
  if (!id) {
    const after = url.searchParams.get('after');
    const latestFrame = active?.latestFrame;
    return reply(res, 200, {
      activeId: active?.meta.id ?? null,
      sessions,
      ...(after !== null && latestFrame?.time > Number(after) && { latestFrame })
    });
  }
  const found = sessions.find(session => session.id === id);
  if (!found) return reply(res, 404, { error: 'Recording not found' });
  const { frameCount, ...meta } = found;
  const files = await frameFiles(id);
  const frames = [];
  for (const file of files) frames.push(await readJSON(path.join(sessionDir(id), file)));
  return reply(res, 200, { ...meta, frames });
}

async function serveStatic(req, res, url) {
  if (!['GET', 'HEAD'].includes(req.method)) return reply(res, 405, { error: 'Method unavailable' });
  const requested = decodeURIComponent(url.pathname);
  const relative = requested === '/' ? 'index.html' : requested.slice(1);
  const allowed = /^(?:index\.html|(?:assets|css|js|GTFS data)\/[\w .()-]+)$/.test(relative);
  const type = ['GTFS data/route-index.json', 'GTFS data/stop-details.json', 'GTFS data/startup-snapshot.json'].includes(relative)
    ? 'application/json'
    : mediaTypes[path.extname(relative)];
  if (!allowed || !type) return reply(res, 404, { error: 'File not found' });
  const file = path.join(root, relative);
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

async function createDashboardServer() {
  await fs.mkdir(storage, { recursive: true, mode: 0o700 });
  return http.createServer(async (req, res) => {
    try {
      const permittedHost = /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
      if (!permittedHost.test(req.headers.host || '')) return reply(res, 403, { error: 'Use a loopback URL' });
      const origin = 'http://' + req.headers.host;
      const url = new URL(req.url, origin);
      if (url.origin !== origin || (req.headers.origin && req.headers.origin !== origin)) {
        return reply(res, 403, { error: 'Cross-origin requests are unavailable' });
      }
      if (url.pathname.startsWith('/api/recordings')) return await recordingAPI(req, res, url);
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
}

async function main() {
  const server = await createDashboardServer();
  server.once('error', error => {
    console.error('Dashboard server could not listen: ' + error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log('Adelaide Metro dashboard at http://127.0.0.1:' + server.address().port);
  });
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, async () => {
      server.close();
      if (active && !active.stopping) await stopRecording(active).catch(console.error);
    });
  }
}

module.exports = { createDashboardServer };

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
