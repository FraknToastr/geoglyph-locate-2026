const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../../src/scripts/geoglyph-map-engine-inline.js'), 'utf8');
function harness(overrides = {}, visible = true) {
  let rebuilds = 0;
  const mapState = { previewActive: true, lastMetrics: {}, extrusionEnabled: true,
    lastRenderMode: 'vector', lastLocalModel: {}, ...overrides };
  const c = vm.createContext({ mapState, window: { GeoGlyph3D: { isVisible: () => visible } }, queueRebuild() { rebuilds++; } });
  const start = source.indexOf('  function rebuildAfterZoom(');
  vm.runInContext(source.slice(start, source.indexOf('\n  }', start) + 4), c);
  return { run: c.rebuildAfterZoom, count: () => rebuilds };
}
test('100 camera zoom events do not dispatch committed visible 3D geometry again', () => {
  const h = harness(); for (let i = 0; i < 100; i++) h.run(); assert.equal(h.count(), 0);
});
test('2D, decal, incomplete and invisible models retain their zoom rebuild path', () => {
  for (const [state, visible] of [[{ extrusionEnabled: false }, true], [{ lastRenderMode: 'decal' }, true],
    [{ lastLocalModel: null }, true], [{}, false]]) {
    const h = harness(state, visible); h.run(); assert.equal(h.count(), 1);
  }
});
test('inactive map or missing display metrics do not schedule zoom work', () => {
  for (const state of [{ previewActive: false }, { lastMetrics: null }]) { const h = harness(state); h.run(); assert.equal(h.count(), 0); }
});
