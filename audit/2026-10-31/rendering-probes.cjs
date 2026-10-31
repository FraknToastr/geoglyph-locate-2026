/* Audit probes: evaluate unchanged source with explicit boundary mocks. No GPU timings. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

async function workerTimeoutProbe() {
  const timers = new Map(); let sequence = 0, creations = 0, posts = 0, terminations = 0;
  class Worker {
    constructor() { creations++; }
    postMessage() { posts++; }
    terminate() { terminations++; }
  }
  const context = vm.createContext({
    performance, console, Worker, Blob,
    URL: { createObjectURL: () => 'blob:audit', revokeObjectURL() {} },
    document: { getElementById: () => ({ textContent: JSON.stringify('/* mock worker */') }) },
    setTimeout(fn, ms) { const id = ++sequence; timers.set(id, { fn, ms }); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  vm.runInContext(read('src/scripts/font-service.js'), context);
  const service = context.GeoGlyphFontService;
  const errors = [];
  for (let i = 0; i < 2; i++) {
    const failure = service.mesh('synthetic-' + i, {}).catch(error => errors.push(error.message));
    const [id, timer] = [...timers].find(([, value]) => value.ms === 30000);
    timers.delete(id); timer.fn(); await failure;
  }
  const result = { creations, posts, terminationsBeforeDispose: terminations, errors };
  assert.equal(creations, 1); assert.equal(posts, 2); assert.equal(terminations, 0);
  service.dispose();
  return result;
}

async function identicalGeometryProbe() {
  const source = read('src/scripts/geoglyph-map-engine-inline.js');
  const begin = source.indexOf('  async function rebuildGeometry(');
  const end = source.indexOf('  let randomBag=', begin);
  assert.ok(begin >= 0 && end > begin);
  const calls = { projection: 0, sourceSetData: 0, meshPrepare: 0, commits: 0, events: 0 };
  const model = { polygons: [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], bounds: { height: 1 }, vertices: 4 };
  const record = { id: 'synthetic-font', name: 'Synthetic outline' };
  const mapState = { previewActive: true, mapReady: true, extrusionEnabled: true, rebuilding: false,
    pendingBuild: false, pendingFit: false, buildToken: 0, fontChoiceVersion: 1, baseHeightMeters: 300,
    relativeSize: 100, mode: 'arcgis', message: 'AUDIT', bearing: 0, anchor: { lng: 138.6, lat: -34.9 },
    fill: '#31A765', outline: '#FFFFFF', quality: 10,
    map: { getSource: () => ({ setData() { calls.sourceSetData++; } }) } };
  const context = vm.createContext({ mapState, console, SOURCE_ID: 'synthetic-source',
    window: { GeoGlyphFontService: { pin() {}, ensureFace: async () => ({}) },
      GeoGlyph3D: { preparing() {}, isVisible: () => true, failure(message) { throw Error(message); },
        prepare: async () => { calls.meshPrepare++; return {}; },
        commit: async (_, apply, current) => { if (!current()) return false; calls.commits++; apply(); return true; } } },
    selectedRecord: () => record, previewTextForMode: () => 'AUDIT', prepareFontModel: async () => model,
    projectPolygons: polygons => { calls.projection++; return polygons; },
    clearGroundDecal() {}, applyMapPaint() {}, updateGeometryStats() {}, setStatus() {},
    scheduleRandomPreparation() {}, document: { dispatchEvent() { calls.events++; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    clearTimeout, setTimeout, queueRebuild() {} });
  vm.runInContext('let activeBuildToken=0;\n' + source.slice(begin, end) + '\nglobalThis.run=rebuildGeometry;', context);
  for (let i = 0; i < 100; i++) assert.equal((await context.run(false, { deferFit: true })).ok, true);
  assert.equal(calls.sourceSetData, 100); assert.equal(calls.projection, 100);
  return { iterations: 100, calls,
    boundary: 'Unchanged rebuildGeometry with cached model and mocked Three/map commits; verifies work dispatch counts, not execution time or GPU allocation.' };
}

(async () => {
  const result = { generatedAt: new Date().toISOString(), node: process.version,
    evidenceClass: 'Deterministic unchanged-source probes with boundary mocks; no browser/GPU performance claims.',
    stalledWorker: await workerTimeoutProbe(), identicalGeometry: await identicalGeometryProbe() };
  fs.writeFileSync(path.join(__dirname, 'rendering-probes.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
