const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../../src/scripts/geoglyph-map-engine-inline.js'), 'utf8');
function extract(name) {
  const start = source.search(new RegExp('(?:async )?function ' + name + '\\('));
  assert.ok(start >= 0);
  return source.slice(start, source.indexOf('\n  }', start) + 4);
}
function harness() {
  const jobs = new Map(), gates = new Map(), draws = [], rollbacks = [];
  let sequence = 0, orbitStops = 0;
  const state = { fontRecords: new Map([['cue', {}], ['manual', {}]]), previewActive: true,
    rebuilding: false, buildToken: 0, fontChoiceVersion: 0, conferenceApplying: false,
    conferenceRebuildPending: false, selectedFontId: 'previous', message: 'previous',
    initialFitStatus: 'done', conferenceOverview: false,
    map: { stop() {}, getSource: () => ({ setData(value) { rollbacks.push(value); } }) } };
  const context = vm.createContext({ mapState: state, SOURCE_ID: 'source',
    setTimeout(fn) { const id = ++sequence; jobs.set(id, fn); return id; },
    clearTimeout(id) { jobs.delete(id); },
    window: { GeoGlyphUi: { isRestoring: () => false }, GeoGlyph3D: {
      stopOrbit() { orbitStops++; }, refreshControls() {}, isVisible: () => true, update: async () => {} } },
    $: () => null, waitForCondition: async () => {}, cancelRandomSearch() {},
    syncUiFromState() {}, updateAnchorStats() {}, activateSelectedFont() {},
    emptyFeatureCollection: () => ({ features: [] }), setGroundDecal() {}, clearGroundDecal() {},
    waitForGroundFrame: async () => {}, fitDrawnGeometry: async () => {},
    async rebuildGeometry(_fit, options = {}) {
      draws.push(state.selectedFontId);
      if (gates.has(options.cueId)) await gates.get(options.cueId).promise;
      return !options.isCurrent || options.isCurrent() ? { ok: true } : undefined;
    } });
  vm.runInContext('let activeBuildToken=0;\n' + (source.match(/let conferenceApplyOwner = null;/)?.[0] || ''), context);
  for (const name of ['queueRebuild', 'selectFont', 'applyConferenceCue', 'cancelConferenceWork']) vm.runInContext(extract(name), context);
  function gate(id) { let release; const promise = new Promise(resolve => { release = resolve; }); gates.set(id, { promise }); return release; }
  const cue = id => context.applyConferenceCue({ objectId: id, fontId: 'cue', message: 'cue-' + id,
    nativeColor: false, extrusionEnabled: true });
  return { context, state, draws, jobs, gate, cue, rollbacks, orbitStops: () => orbitStops,
    flush() { const pending = [...jobs.values()]; jobs.clear(); pending.forEach(fn => fn()); } };
}
const entered = () => new Promise(setImmediate);

test('manual font selection releases the superseded cue lock and draws without a later survey', async () => {
  const h = harness(), release = h.gate(1), result = h.cue(1).catch(error => error.message);
  await entered(); await h.context.selectFont('manual'); release();
  assert.match(await result, /superseded/);
  assert.equal(h.state.conferenceApplying, false);
  assert.equal(h.state.conferenceRebuildPending, false);
  assert.equal(h.state.selectedFontId, 'manual');
  h.flush(); await entered(); assert.deepEqual(h.draws, ['cue', 'manual']);
  h.state.message = 'manual text'; h.context.queueRebuild(); h.flush(); await entered();
  assert.equal(h.draws.length, 3); assert.equal(h.orbitStops(), 0);
});

test('older cleanup cannot release the lock owned by a newer cue', async () => {
  const h = harness(), first = h.gate(1), second = h.gate(2);
  const old = h.cue(1).catch(error => error.message); await entered();
  const latest = h.cue(2); await entered(); first(); await old;
  assert.equal(h.state.conferenceApplying, true); assert.equal(h.state.message, 'cue-2');
  second(); await latest; assert.equal(h.state.conferenceApplying, false);
});

test('explicit cancellation invalidates ownership before another cue starts', async () => {
  const h = harness(), first = h.gate(1), second = h.gate(2);
  const old = h.cue(1).catch(error => error.message); await entered();
  h.context.cancelConferenceWork(); assert.equal(h.state.conferenceApplying, false);
  const latest = h.cue(2); await entered(); first(); await old;
  assert.equal(h.state.conferenceApplying, true); second(); await latest;
  assert.equal(h.state.conferenceApplying, false); assert.equal(h.state.message, 'cue-2');
});

test('leaving Map releases the old lock without restoring stale state', async () => {
  const h = harness(), release = h.gate(1), result = h.cue(1).catch(error => error.message);
  await entered(); h.state.previewActive = false; h.state.fontChoiceVersion++; release(); await result;
  assert.equal(h.state.conferenceApplying, false); assert.equal(h.rollbacks.length, 0);
});

test('a current failed cue still restores the preceding display and releases its lock', async () => {
  const h = harness();
  await assert.rejects(h.context.applyConferenceCue({ fontId: 'missing', message: 'invalid' }), /unavailable/);
  assert.equal(h.state.selectedFontId, 'previous'); assert.equal(h.state.message, 'previous');
  assert.equal(h.state.conferenceApplying, false); assert.equal(h.rollbacks.length, 1);
});
