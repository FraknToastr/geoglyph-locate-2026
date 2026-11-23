const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { Readable, Writable } = require('node:stream');
const { setImmediate } = require('node:timers/promises');
const { gunzipSync } = require('node:zlib');
const { test } = require('node:test');
const { createDashboardServer } = require('../server.cjs');
const { RecordingStore, segmentDuration } = require('../recording-store.cjs');

function request(server, url, method = 'GET', data, headers = {}) {
  const req = Readable.from(data === undefined ? [] : [JSON.stringify(data)]);
  Object.assign(req, { url, method, headers: { host: '127.0.0.1:8080', ...headers } });
  return new Promise((resolve, reject) => {
    const chunks = [];
    const res = new Writable({write(chunk, encoding, done) { chunks.push(chunk); done(); }});
    res.writeHead = (status, headers) => Object.assign(res, {status, headers, headersSent: true});
    res.on('error', reject);
    res.on('finish', () => resolve({status: res.status, headers: res.headers, body: Buffer.concat(chunks)}));
    server.emit('request', req, res);
  });
}

const catalog = async server => JSON.parse((await request(server, '/api/recordings')).body);
const clock = {now: () => Date.now(), monotonic: () => Date.now()};
const payload = Uint8Array.from([0x0a, 0x03, 0x0a, 0x01, 0x32]);

async function until(check) {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const value = await check();
    if (value) return value;
    await setImmediate();
  }
  assert.fail('Recorder did not reach the expected state.');
}

test('background capture uses its configured interval and exports successes and gaps', {timeout: 5000}, async t => {
  const storage = await fs.mkdtemp(path.join(os.tmpdir(), 'metro-recording-test-'));
  let server = await createDashboardServer({directory: storage, clock});
  t.after(async () => { await server.closeRecorder(); await fs.rm(storage, {recursive: true}); });
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
  assert.equal(session.version, 2);
  assert.equal(session.mode, 'background');
  assert.equal(session.intervalSeconds, 7);
  assert.ok(session.endedAt >= session.startedAt);
  assert.equal(session.frames.length, 2);
  assert.equal(session.frames[1].time - session.frames[0].time, 7000);
  assert.equal(JSON.parse(stopped.body).latestFrame.time, session.frames[1].time);
  const { feeds } = session.frames[0];
  assert.equal('raw' in feeds.vehicle_positions, false);
  assert.deepEqual(feeds.vehicle_positions.rows, []);
  assert.match(feeds.trip_updates.error, /503/);
  assert.equal(fetch.mock.callCount(), 6);

  const meta = JSON.parse((await request(server, '/api/recordings/' + id + '/meta')).body);
  assert.deepEqual(meta.times, session.frames.map(frame => frame.time));
  const page = JSON.parse((await request(server, '/api/recordings/' + id + '/frames?offset=1')).body);
  assert.deepEqual(page.frames, session.frames.slice(1));
  const gzip = await request(server, '/api/recordings/' + id + '/export');
  assert.equal(gzip.headers['Content-Type'], 'application/gzip');
  const [manifest, ...frames] = gunzipSync(gzip.body).toString().trimEnd().split('\n').map(JSON.parse);
  assert.equal(manifest.format, 'transitron-ndjson');
  assert.equal(manifest.frameCount, 2);
  assert.deepEqual(frames, session.frames);
  await server.closeRecorder();
  server = await createDashboardServer({directory: storage, clock});
  const history = await catalog(server);
  assert.equal(history.activeId, null);
  assert.equal(history.sessions[0].frameCount, 2);
});

test('seals 30-minute segments, retries after a failed publish, and resumes the same recording', {timeout: 10_000}, async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'metro-segments-test-'));
  t.mock.timers.enable({apis: ['setTimeout', 'setInterval', 'Date'], now: new Date('2026-11-20T00:00:00Z')});
  t.mock.method(globalThis, 'fetch', async () => new Response(payload));
  let server = await createDashboardServer({directory, clock});
  t.after(async () => { await server.closeRecorder(); await fs.rm(directory, {recursive: true}); });
  const start = await request(server, '/api/recordings', 'POST', {intervalSeconds: 900, keepRaw: true});
  const {id} = JSON.parse(start.body);
  const recording = '/api/recordings/' + id;
  const segment = bucket => path.join(directory, id, `segment-${bucket}.ndjson.gz`);
  const frames = async () => JSON.parse((await request(server, recording + '/frames')).body).frames;
  const waitForFrames = count => until(async () => (await catalog(server)).sessions[0]?.frameCount === count);
  const waitForSegment = bucket => until(() => fs.stat(segment(bucket)).then(info => info.isFile()).catch(() => false));

  await waitForFrames(1);
  await assert.rejects(createDashboardServer({directory, clock}), /locked/);
  t.mock.timers.tick(segmentDuration / 2);
  await waitForFrames(2);
  await assert.rejects(fs.stat(segment(0)), {code: 'ENOENT'});
  t.mock.timers.tick(segmentDuration / 2);
  await waitForFrames(3);
  await waitForSegment(0);
  const first = gunzipSync(await fs.readFile(segment(0))).toString().trimEnd().split('\n').map(JSON.parse);
  assert.equal(first.length, 2);
  assert.equal(first[0].feeds.vehicle_positions.raw, Buffer.from(payload).toString('base64'));

  await fs.mkdir(segment(1));
  t.mock.timers.tick(segmentDuration / 2);
  await waitForFrames(4);
  t.mock.timers.tick(segmentDuration / 2);
  await waitForFrames(5);
  t.mock.timers.tick(1000);
  await until(async () => (await catalog(server)).health.error?.includes('Segment save will retry'));
  assert.equal((await frames()).length, 5);
  await server.closeRecorder();
  await fs.rmdir(segment(1));
  t.mock.timers.tick(segmentDuration / 2);
  server = await createDashboardServer({directory, clock});
  await waitForFrames(6);
  await waitForSegment(1);
  const resumed = await catalog(server);
  assert.equal(resumed.activeId, id);
  assert.equal(resumed.health.resumed, true);
  assert.equal(resumed.sessions.length, 1);
  const recovered = await frames();
  const second = gunzipSync(await fs.readFile(segment(1))).toString().trimEnd().split('\n').map(JSON.parse);
  assert.deepEqual(second, recovered.slice(2, 4));
  assert.equal(new Set(recovered.map(frame => frame.time)).size, 6);

  await server.closeRecorder();
  t.mock.timers.tick(segmentDuration);
  server = await createDashboardServer({directory, clock});
  await waitForFrames(7);
  assert.equal((await frames()).at(-1).gapMs, segmentDuration);
  assert.equal((await request(server, recording + '/stop', 'POST')).status, 200);
  await waitForSegment(3);
  await server.closeRecorder();
  server = await createDashboardServer({directory, clock});
  const ended = await catalog(server);
  assert.equal(ended.activeId, null);
  assert.equal(ended.sessions[0].frameCount, 7);
  assert.equal((await frames()).length, 7);
});

test('reconciles a published file whose index transaction did not finish and opens legacy files', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'metro-reconcile-test-'));
  const id = '00000000-0000-0000-0000-000000000001';
  const legacy = '00000000-0000-0000-0000-000000000002';
  const store = new RecordingStore(directory);
  const meta = {version: 2, id, startedAt: 1000, endedAt: 2000, mode: 'background', intervalSeconds: 1};
  store.start(meta, {});
  const feeds = Object.fromEntries(['vehicle_positions', 'trip_updates', 'service_alerts'].map(name => [name, {time: 1000, rows: []}]));
  const frame = {time: 1000, feeds};
  await store.saveFrame(meta, frame);
  const published = store.segmentPath(id, 0);
  await fs.mkdir(path.dirname(published), {recursive: true});
  await fs.writeFile(published, 'publication interrupted');
  store.close();
  await fs.mkdir(path.join(directory, legacy));
  await fs.writeFile(path.join(directory, legacy, 'session.json'), JSON.stringify({...meta, version: 1, id: legacy}));
  await fs.writeFile(path.join(directory, legacy, '1000.json'), JSON.stringify(frame));
  const server = await createDashboardServer({directory, clock});
  t.after(async () => { await server.closeRecorder(); await fs.rm(directory, {recursive: true}); });
  const archived = await until(async () => {
    const bytes = await fs.readFile(published);
    return bytes[0] === 0x1f && gunzipSync(bytes).toString();
  });
  assert.deepEqual(JSON.parse(archived), frame);
  assert.equal((await catalog(server)).activeId, null);
  for (const recording of [id, legacy]) {
    const page = await request(server, `/api/recordings/${recording}/frames`);
    assert.deepEqual(JSON.parse(page.body).frames, [frame]);
  }
});

test('retries after a frame write failure and keeps Stop final when the last segment cannot be published', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'metro-write-test-'));
  t.mock.timers.enable({apis: ['setTimeout', 'setInterval', 'Date'], now: new Date('2026-11-20T00:00:00Z')});
  t.mock.method(globalThis, 'fetch', async () => new Response(payload));
  const saveFrame = RecordingStore.prototype.saveFrame;
  let diskFull = false;
  t.mock.method(RecordingStore.prototype, 'saveFrame', async function (meta, frame) {
    if (diskFull) throw new Error('No space left on device');
    return saveFrame.call(this, meta, frame);
  });
  let server = await createDashboardServer({directory, clock});
  t.after(async () => { await server.closeRecorder(); await fs.rm(directory, {recursive: true}); });
  const starts = await Promise.all([1, 1].map(intervalSeconds =>
    request(server, '/api/recordings', 'POST', {intervalSeconds})));
  assert.deepEqual(starts.map(response => response.status).sort(), [201, 409]);
  const {id} = JSON.parse(starts.find(response => response.status === 201).body);
  await until(async () => (await catalog(server)).sessions[0]?.frameCount === 1);
  diskFull = true;
  t.mock.timers.tick(1000);
  const failed = await until(async () => {
    const status = await catalog(server);
    return status.health.error?.includes('No space left') && status;
  });
  assert.equal(failed.sessions[0].frameCount, 1);
  assert.equal(failed.activeId, id);
  diskFull = false;
  t.mock.timers.tick(1000);
  await until(async () => (await catalog(server)).sessions[0]?.frameCount === 2);
  const archive = path.join(directory, id, 'segment-0.ndjson.gz');
  await fs.mkdir(archive, {recursive: true});
  const stopped = await request(server, '/api/recordings/' + id + '/stop', 'POST');
  assert.match(JSON.parse(stopped.body).error, /Segment save will retry/);
  assert.equal((await catalog(server)).activeId, null);
  await server.closeRecorder();
  await fs.rmdir(archive);
  server = await createDashboardServer({directory, clock});
  await until(() => fs.stat(archive).then(info => info.isFile()).catch(() => false));
  const restored = await catalog(server);
  assert.equal(restored.activeId, null);
  assert.equal(restored.sessions[0].frameCount, 2);
  const frame = JSON.parse((await request(server, '/api/recordings/' + id + '/frames?offset=1')).body).frames[0];
  assert.equal(frame.gapMs, 2000);
});

test('uses one capture deadline for a feed and its fallback', {timeout: 4500}, async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'metro-deadline-test-'));
  const fetch = t.mock.method(globalThis, 'fetch', async (url, {signal}) => {
    if (!String(url).endsWith('/trip_updates')) return new Response(payload);
    if (String(url).includes('direct.test')) return new Response(null, {status: 503});
    return new Promise((resolve, reject) => {
      signal.throwIfAborted();
      signal.addEventListener('abort', () => reject(signal.reason), {once: true});
    });
  });
  const server = await createDashboardServer({directory});
  t.after(async () => { await server.closeRecorder(); await fs.rm(directory, {recursive: true}); });
  const start = await request(server, '/api/recordings', 'POST', {
    intervalSeconds: 1, baseUrl: 'https://direct.test/feed', customProxyUrl: 'https://proxy.test/feed'
  });
  const {id} = JSON.parse(start.body);
  const keepAlive = setTimeout(() => {}, 2000);
  t.after(() => clearTimeout(keepAlive));
  const stopped = await request(server, '/api/recordings/' + id + '/stop', 'POST');
  assert.equal(stopped.status, 200);
  const frame = JSON.parse(stopped.body).latestFrame;
  assert.match(frame.feeds.trip_updates.error, /503.*timeout/i);
  assert.deepEqual(frame.feeds.vehicle_positions.rows, []);
  assert.equal(fetch.mock.callCount(), 4);
});
