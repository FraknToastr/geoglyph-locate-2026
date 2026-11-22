const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../../src/scripts/geoglyph-map-engine-inline.js'), 'utf8');
function extract(name) {
  const start = source.indexOf('  function ' + name + '(');
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('\n  }', start) + 4);
}
function harness() {
  let now = 0, next = 0, loaded = false, repaints = 0;
  const timers = new Map(), listeners = new Set(), renders = new Set();
  const document = { hidden:false, addEventListener(type, fn) { assert.equal(type, 'visibilitychange'); listeners.add(fn); },
    removeEventListener(type, fn) { listeners.delete(fn); } };
  const map = { on(type, fn) { renders.add(fn); }, off(type, fn) { renders.delete(fn); },
    getSource:() => ({}), isSourceLoaded:() => loaded, triggerRepaint() { repaints++; } };
  const c = vm.createContext({ document, mapState:{map,lastRenderMode:'vector'}, SOURCE_ID:'vector', DECAL_SOURCE_ID:'decal',
    performance:{now:() => now}, setTimeout(fn, ms) { timers.set(++next, {fn,due:now+ms}); return next; },
    clearTimeout(id) { timers.delete(id); } });
  for (const name of ['renderWaitClock', 'waitForCondition', 'waitForGroundFrame']) vm.runInContext(extract(name), c);
  return { c, timers, listeners, renders,
    async tick(ms) { now += ms; for (const [id,timer] of [...timers]) if (timer.due <= now) { timers.delete(id); timer.fn(); } await Promise.resolve(); },
    hidden(value) { document.hidden=value; for (const fn of [...listeners]) fn(); },
    frame(value=true) { loaded=value; for (const fn of [...renders]) fn(); }, repaints:() => repaints };
}
test('condition deadline excludes a simulated 60-second hidden interval and resumes promptly', async () => {
  const h=harness();let done=false, settled=false;
  const pending=h.c.waitForCondition(() => done, 'expired', 100).then(() => {settled=true;});
  await h.tick(10);h.hidden(true);await h.tick(60000);assert.equal(settled,false);
  done=true;h.hidden(false);await pending;
  assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);
});
test('condition deadline still expires after its visible-time budget', async () => {
  const h=harness(), rejected=assert.rejects(h.c.waitForCondition(() => false, 'expired', 100), /expired/);
  await h.tick(40);h.hidden(true);await h.tick(60000);h.hidden(false);await h.tick(61);await rejected;
  assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);
});
test('condition errors clean up their timer and visibility listeners', async () => {
  const h=harness();await assert.rejects(h.c.waitForCondition(() => {throw Error('bad check');}, 'expired'), /bad check/);
  assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);
});
test('ground-frame deadline pauses hidden and requires a visible loaded map frame', async () => {
  const h=harness();let complete=false;
  const pending=h.c.waitForGroundFrame(() => true).then(() => {complete=true;});
  await h.tick(100);h.hidden(true);await h.tick(60000);h.frame();await Promise.resolve();
  assert.equal(complete,false);const repaints=h.repaints();h.hidden(false);assert.ok(h.repaints()>repaints);
  h.frame();await pending;assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);assert.equal(h.renders.size,0);
});
test('ground-frame expiry counts only visible time and removes all ownership', async () => {
  const h=harness(), rejected=assert.rejects(h.c.waitForGroundFrame(() => true), /did not reach/);
  await h.tick(1000);h.hidden(true);await h.tick(60000);h.hidden(false);await h.tick(14000);await rejected;
  assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);assert.equal(h.renders.size,0);
});
test('superseded hidden frame work rejects and cleans listeners without waiting for visibility', async () => {
  const h=harness();let current=true;h.hidden(true);
  const rejected=assert.rejects(h.c.waitForGroundFrame(() => current), /superseded/);
  current=false;await h.tick(250);await rejected;
  assert.equal(h.timers.size,0);assert.equal(h.listeners.size,0);assert.equal(h.renders.size,0);
});
