const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { Readable } = require('node:stream');
const { test } = require('node:test');

function request(server, url, method = 'GET', data, headers = {}) {
  const req = Readable.from(data === undefined ? [] : [JSON.stringify(data)]);
  Object.assign(req, { url, method, headers: { host: '127.0.0.1:8080', ...headers } });
  return new Promise(resolve => {
    const res = {
      writeHead(status, outgoingHeaders) {
        this.status = status;
        this.headers = outgoingHeaders;
      },
      end(body) {
        resolve({ status: this.status, headers: this.headers, body });
      }
    };
    server.emit('request', req, res);
  });
}

test('background capture uses its configured interval and exports successes and gaps', {timeout: 5000}, async t => {
  const storage = await fs.mkdtemp(path.join(os.tmpdir(), 'metro-recording-test-'));
  t.after(() => fs.rm(storage, { recursive: true }));
  process.env.METRO_RECORDINGS_DIR = storage;
  const { createDashboardServer } = require('../server.cjs');
  const server = await createDashboardServer();
  const payload = Uint8Array.from([0x0a, 0x03, 0x0a, 0x01, 0x32]);
  const fetch = t.mock.method(globalThis, 'fetch', url => Promise.resolve(
    String(url).endsWith('/trip_updates') ? new Response(null, { status: 503 }) : new Response(payload)
  ));

  const staticPage = await request(server, '/', 'HEAD');
  assert.equal(staticPage.status, 200);
  assert.match(staticPage.headers['Content-Type'], /text\/html/);
  assert.equal(staticPage.headers['Cache-Control'], 'no-cache');

  const foreignStart = await request(server, '/api/recordings', 'POST', {},
    { origin: 'https://example.test' });
  assert.equal(foreignStart.status, 403);
  const invalidStart = await request(server, '/api/recordings', 'POST', { baseUrl: 'file:///tmp' });
  assert.equal(invalidStart.status, 400);
  const invalidInterval = await request(server, '/api/recordings', 'POST', { intervalSeconds: 0 });
  assert.equal(invalidInterval.status, 400);

  t.mock.timers.enable({apis: ['Date', 'setTimeout'], now: 1_700_000_000_000});
  const schedule = globalThis.setTimeout;
  let captureScheduled;
  const firstDelay = new Promise(resolve => { captureScheduled = resolve; });
  t.mock.method(globalThis, 'setTimeout', (callback, delay, ...args) => {
    const timer = schedule(callback, delay, ...args);
    captureScheduled(delay);
    return timer;
  });
  const options = { baseUrl: 'https://fixture.test/v1', intervalSeconds: 7 };
  const started = await request(server, '/api/recordings', 'POST', options);
  assert.equal(started.status, 201);
  const { id } = JSON.parse(started.body);
  const running = await request(server, '/api/recordings');
  assert.equal(JSON.parse(running.body).activeId, id);
  assert.equal((await request(server, '/api/recordings', 'POST', options)).status, 409);
  assert.equal(await firstDelay, 7000);
  const { latestFrame } = JSON.parse((await request(server, '/api/recordings?after=0')).body);
  assert.equal(latestFrame.time, 1_700_000_000_000);
  assert.deepEqual(latestFrame.feeds.vehicle_positions.rows, []);
  assert.equal('raw' in latestFrame.feeds.vehicle_positions, false);
  assert.match(latestFrame.feeds.trip_updates.error, /503/);
  const unchanged = await request(server, '/api/recordings?after=' + latestFrame.time);
  assert.equal('latestFrame' in JSON.parse(unchanged.body), false);
  t.mock.timers.tick(6999);
  assert.equal(fetch.mock.callCount(), 3);
  t.mock.timers.tick(1);

  const stopped = await request(server, '/api/recordings/' + id + '/stop', 'POST');
  assert.equal(stopped.status, 200);
  const exported = await request(server, '/api/recordings/' + id);
  assert.equal(exported.status, 200);
  const session = JSON.parse(exported.body);
  assert.equal(session.version, 1);
  assert.equal(session.mode, 'background');
  assert.equal(session.intervalSeconds, 7);
  assert.ok(session.endedAt >= session.startedAt);
  assert.equal(session.frames.length, 2);
  assert.equal(session.frames[1].time - session.frames[0].time, 7000);
  assert.equal(JSON.parse(stopped.body).latestFrame.time, session.frames[1].time);
  const { feeds } = session.frames[0];
  assert.equal(feeds.vehicle_positions.raw, Buffer.from(payload).toString('base64'));
  assert.deepEqual(feeds.vehicle_positions.rows, []);
  assert.match(feeds.trip_updates.error, /503/);
  assert.equal(fetch.mock.callCount(), 6);

  const reconnected = await createDashboardServer();
  const history = JSON.parse((await request(reconnected, '/api/recordings')).body);
  assert.equal(history.activeId, null);
  assert.equal(history.sessions[0].frameCount, 2);
});
