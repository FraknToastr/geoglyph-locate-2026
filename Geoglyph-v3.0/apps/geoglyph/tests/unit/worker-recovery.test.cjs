const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(process.env.FONT_SERVICE_SOURCE || path.join(__dirname, '../../src/scripts/font-service.js'), 'utf8');
function harness(behavior = () => 'ok') {
  const workers = [], revoked = [], timers = new Map(), posts = [], faces = new Set(); let timerId = 0;
  class Worker {
    constructor() { this.number = workers.length + 1; this.fonts = new Set(); this.terminations = 0; workers.push(this); }
    terminate() { this.terminations++; }
    postMessage(message, transfers) {
      const post = { worker: this.number, ...message, transfers }; posts.push(post);
      const respond = this.onmessage, fail = this.onerror, decode = this.onmessageerror;
      this.saved = { respond, fail, decode };
      queueMicrotask(() => {
        const action = behavior(post, this);
        if (action === 'stall') return;
        if (action === 'crash') return fail({ message: 'Synthetic worker crash' });
        if (action === 'decode') return decode({});
        if (action === 'malformed') return respond({ data: null });
        if (action === 'content') return respond({ data: { id: message.id, error: 'Unsupported outlines' } });
        if (action === 'evict') return respond({ data: { id: message.id, error: 'FONT_EVICTED' } });
        if (message.type === 'prepare') this.fonts.add(message.payload.key);
        if (message.type === 'model' && !this.fonts.has(message.payload.key)) return respond({ data: { id: message.id, error: 'FONT_EVICTED' } });
        respond({ data: { id: message.id, result: message.type === 'prepare' ? { codes: [65] } : { ok: true, worker: this.number } } });
      });
    }
  }
  class FontFace { async load() { return this; } }
  const context = vm.createContext({ Worker, FontFace, Blob, performance,
    URL: { createObjectURL: () => 'blob:' + (workers.length + 1), revokeObjectURL: url => revoked.push(url) },
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, delay }); return id; }, clearTimeout(id) { timers.delete(id); },
    document: { getElementById: () => ({ textContent: '"source"' }), fonts: { add: face => faces.add(face), delete: face => faces.delete(face) } } });
  vm.runInContext(source, context);
  return { service: context.GeoGlyphFontService, workers, revoked, posts, timers, faces,
    record: { id: 'test-font', fontResourceKey: 'test-font', arrayBuffer: new ArrayBuffer(16) },
    timeout() { const [id, item] = [...timers].find(([, timer]) => timer.delay === 30000); timers.delete(id); item.fn(); } };
}
const flush = () => new Promise(setImmediate);

test('timeout replaces one worker, retries mesh once and cleans old resources', async () => {
  const h = harness(post => post.worker === 1 ? 'stall' : 'ok');
  const request = h.service.mesh('mesh', {}); await flush(); h.timeout();
  assert.equal((await request).worker, 2); assert.equal(h.workers.length, 2);
  assert.equal(h.workers[0].terminations, 1); assert.deepEqual(h.revoked, ['blob:1']);
  assert.equal(h.timers.size, 0); h.service.dispose();
});

test('model infrastructure recovery rehydrates font bytes and preserves exact browser face', async () => {
  const h = harness(post => post.worker === 1 && post.type === 'model' ? 'crash' : 'ok');
  await h.service.ensureFace(h.record); await h.service.prepare(h.record);
  assert.equal((await h.service.model(h.record, 'A')).worker, 2);
  assert.deepEqual(h.posts.map(post => [post.worker, post.type]), [[1, 'prepare'], [1, 'model'], [2, 'prepare'], [2, 'model']]);
  assert.equal(h.faces.size, 1); assert.equal(h.record.arrayBuffer.byteLength, 16);
  for (const post of h.posts.filter(post => post.type === 'prepare')) assert.notEqual(post.payload.buffer, h.record.arrayBuffer);
  h.service.dispose();
});

for (const failure of ['decode', 'malformed']) test(failure + ' invalidates the generation and retries', async () => {
  const h = harness(post => post.worker === 1 ? failure : 'ok');
  assert.equal((await h.service.mesh('mesh', {})).worker, 2);
  assert.equal(h.workers[0].terminations, 1); assert.equal(h.timers.size, 0); h.service.dispose();
});

test('repeated infrastructure failure stops after one retry and permits a later operation', async () => {
  const h = harness(post => post.worker <= 2 ? 'crash' : 'ok');
  await assert.rejects(h.service.prepare(h.record), /Synthetic/); assert.equal(h.workers.length, 2);
  await h.service.prepare(h.record); assert.equal(h.workers.length, 3); h.service.dispose();
});

test('one timed-out worker settles every concurrent pending operation', async () => {
  const h = harness(post => post.worker === 1 ? 'stall' : 'ok');
  const requests = [h.service.mesh('one', {}), h.service.mesh('two', {})];
  await flush(); h.timeout(); const results = await Promise.all(requests);
  assert.deepEqual(results.map(result => result.worker), [2, 2]);
  assert.equal(h.workers.length, 2); assert.equal(h.timers.size, 0); h.service.dispose();
});

test('saved late callbacks from a terminated worker cannot corrupt the replacement', async () => {
  const h = harness(post => post.worker === 1 ? 'stall' : 'ok');
  const request = h.service.mesh('one', {}); await flush(); const stale = h.workers[0].saved;
  h.timeout(); await request;
  stale.fail({ message: 'Old crash' }); stale.decode({}); stale.respond({ data: null });
  assert.equal((await h.service.mesh('two', {})).worker, 2);
  assert.equal(h.workers.length, 2); assert.equal(h.workers[1].terminations, 0); h.service.dispose();
});

test('permanent parse failures remain cached without replacement or retry', async () => {
  const h = harness(() => 'content'); await h.service.ensureFace(h.record);
  await assert.rejects(h.service.prepare(h.record), /Unsupported/);
  await assert.rejects(h.service.prepare(h.record), /Unsupported/);
  assert.equal(h.posts.length, 1); assert.equal(h.workers.length, 1); assert.equal(h.faces.size, 1); h.service.dispose();
});

test('FONT_EVICTED re-prepares once without replacing a healthy worker', async () => {
  let evicted = false;
  const h = harness(post => { if (post.type === 'model' && !evicted) { evicted = true; return 'evict'; } return 'ok'; });
  await h.service.model(h.record, 'A');
  assert.deepEqual(h.posts.map(post => post.type), ['prepare', 'model', 'prepare', 'model']);
  assert.equal(h.workers.length, 1); h.service.dispose();
});

test('dispose settles pending jobs without starting a recovery worker', async () => {
  const h = harness(() => 'stall'); const request = h.service.mesh('mesh', {});
  const rejected = assert.rejects(request, /disposed/); await flush(); h.service.dispose(); await rejected;
  assert.equal(h.workers.length, 1); assert.equal(h.workers[0].terminations, 1); assert.equal(h.timers.size, 0);
});

test('disposal between font preparation and model dispatch cannot create another worker', async () => {
  let service;
  const h = harness(post => {
    if (post.type === 'prepare') queueMicrotask(() => service.dispose());
    return 'ok';
  });
  service = h.service;
  await assert.rejects(service.model(h.record, 'A'), /disposed/);
  assert.equal(h.workers.length, 1); assert.equal(h.timers.size, 0);
});
