const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = fs.readFileSync(path.join(__dirname, '../../src/scripts/core.js'), 'utf8');
function extract(name) {
  const match = new RegExp(`  (?:async )?function ${name}\\(`).exec(core);
  const start = match.index;
  const rest = core.slice(start + match[0].length);
  const next = /\n  (?:async )?function |\n  const qreverseRowViews/.exec(rest);
  return core.slice(start, next ? start + match[0].length + next.index : undefined);
}
function context(values, names) {
  const c = vm.createContext(values);
  for (const name of names) vm.runInContext(extract(name), c);
  return c;
}
test('explicit QR values do not read or overwrite authored input, and preserve character limits', async () => {
  const encoded = [], messages = [];
  let reads = 0, stats = 0;
  const c = context({ state: { qrLevel: 'H', logoMode: 'none', quietZone: 4, qrMode: 'square' }, QR_LIMITS: { H: 3 },
    $() { reads++; return { value: 'UI' }; }, updateQrStats() { stats++; return { over: 0 }; },
    targetPaint() {}, drawMessage: (_, message) => messages.push(message), window: { QRious: true },
    createQrMatrix: text => { encoded.push(text); return {}; }, drawQrMatrix() {} }, ['drawQrToCanvas']);
  const canvas = { getContext: () => ({ clearRect() {}, fillRect() {} }) };
  await c.drawQrToCanvas(canvas, 1024, false, 'A😀');
  await c.drawQrToCanvas(canvas, 1024, false, 'ABCD');
  assert.deepEqual(encoded, ['A😀']);
  assert.equal(messages.length, 1); assert.equal(reads, 0); assert.equal(stats, 0);
  await c.drawQrToCanvas(canvas, 1024, false);
  assert.deepEqual(encoded, ['A😀', 'UI']); assert.equal(stats, 1);
});
test('directory batch waits for each PNG write, reuses one canvas and retains no file array', async () => {
  const events = [], canvases = new Set();
  let authored = 'original', pending = 0;
  const c = context({ state: { qreverse: { stub: 'test', lastDesignPreview: 'combined' } },
    selectedQReverseValues: () => ['one', 'two', 'three'], sanitizeFilename: value => value,
    document: { createElement: () => ({}) }, setQReverseProgress() {},
    async drawQrToCanvas(canvas, size, combined, text) { assert.equal(pending, 0); canvases.add(canvas); events.push(`render:${text}`); },
    async canvasToBlob() { return {}; }, $() { return { get value() { return authored; }, set value(v) { authored = v; } }; }
  }, ['buildQReverseBatch']);
  const result = await c.buildQReverseBatch(async (file, index) => {
    pending++; events.push(`write:${index}`); await Promise.resolve(); pending--;
    assert.equal(file.name, `test-${String(index + 1).padStart(3, '0')}.png`);
  });
  assert.equal(result.count, 3); assert.equal(result.files.length, 0); assert.equal(canvases.size, 1);
  assert.equal(authored, 'original');
  assert.deepEqual(events, ['render:one', 'write:0', 'render:two', 'write:1', 'render:three', 'write:2']);
  const zipped = await c.buildQReverseBatch(); assert.equal(zipped.files.length, 3);
});
test('failed directory write aborts its stream and preserves the original error', async () => {
  const failure = Error('disk full'); let aborted = 0, closed = 0;
  const c = context({}, ['writeQReverseFile']);
  const directory = { async getFileHandle() { return { async createWritable() { return {
    async write() { throw failure; }, async close() { closed++; }, async abort() { aborted++; throw Error('secondary'); }
  }; } }; } };
  await assert.rejects(c.writeQReverseFile(directory, { name: 'one.png', blob: {} }), error => error === failure);
  assert.equal(aborted, 1); assert.equal(closed, 0);
});
test('failed streaming export releases busy state and permits another export', async () => {
  const failure = Error('disk full'); const messages = [];
  const c = context({ state: { qreverse: { exporting: false } }, isQReverseBusy: () => false,
    renderQReverse() {}, window: { async showDirectoryPicker() { return {}; } },
    async buildQReverseBatch(writer) { await writer({ name: 'one.png' }, 0, 2); },
    async writeQReverseFile() { throw failure; }, console: { error() {} }, showToast: message => messages.push(message), setQReverseProgress() {}
  }, ['exportQReverseBatch']);
  await c.exportQReverseBatch('files'); assert.equal(c.state.qreverse.exporting, false);
  assert.deepEqual(messages, ['disk full']);
});
test('multi-code full-resolution scan yields between passes without dropping or reordering detections', async () => {
  let passes = 0, yields = 0, masks = 0;
  const canvas = { getContext: () => ({ drawImage() {}, getImageData: () => ({ data: [], width: 4000, height: 3000 }) }) };
  const c = context({ document: { createElement: () => canvas }, window: { jsQR() { return ++passes <= 3 ? { data: String(passes), location: {} } : null; } },
    maskQReverseRegion: () => masks++, setTimeout: resolve => { yields++; resolve(); }
  }, ['detectQReverseWithJsQr']);
  const codes = await c.detectQReverseWithJsQr({ width: 4000, height: 3000 });
  assert.equal(JSON.stringify(codes.map(code => code.rawValue)), '["1","2","3"]');
  assert.equal(passes, 4); assert.equal(yields, 3); assert.equal(masks, 3);
  assert.equal(canvas.width, 4000); assert.equal(canvas.height, 3000);
});

class Element {
  constructor(tag = 'tr') { this.tag = tag; this.children = []; this.parent = null; this.writes = 0; this.classes = new Set();
    this.classList = { toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name) }; }
  get firstElementChild() { return this.children[0] || null; }
  get nextElementSibling() { const siblings = this.parent.children; return siblings[siblings.indexOf(this) + 1] || null; }
  set innerHTML(value) { this.markup = value; this.writes++; this.children = []; if (this.tag === 'tbody') { const placeholder = new Element(); placeholder.empty = true; this.insertBefore(placeholder, null); } }
  querySelector() { return this.children.find(child => child.empty) || null; }
  insertBefore(element, cursor) { element.remove(); const index = cursor ? this.children.indexOf(cursor) : this.children.length; this.children.splice(index, 0, element); element.parent = this; }
  remove() { if (this.parent) { const siblings = this.parent.children; siblings.splice(siblings.indexOf(this), 1); this.parent = null; } }
}
test('100 scanned rows update only changed rows; stable DOM identity/current selection and removals survive', () => {
  const body = new Element('tbody');
  let escapes = 0;
  const escape = text => { escapes++; return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  const c = context({ $: () => body, document: { createElement: () => new Element() }, escapeAttr: escape, escapeHtml: escape }, []);
  vm.runInContext('const qreverseRowViews = new WeakMap();\n' + extract('renderQReverseTable'), c);
  const rows = Array.from({ length: 100 }, (_, index) => ({ id: index + 1, selected: true, source: 'Image', status: 'Queued', filename: `<${index}.png>` }));
  c.renderQReverseTable(rows);
  const original = [...body.children]; original[0].classes.add('is-current');
  for (const row of rows) { row.status = 'Scanning'; c.renderQReverseTable(rows); row.status = 'Processed'; row.value = `value:${row.id}`; c.renderQReverseTable(rows); }
  assert.deepEqual(body.children, original); assert.equal(original[0].classes.has('is-current'), true);
  assert.equal(original.reduce((sum, row) => sum + row.writes, 0), 300); // Old full-table path emitted 20,100 row markups.
  assert.equal(escapes, 2100); // Seven escaped fields per changed row; unchanged rows do not regenerate markup.
  assert.equal(body.writes, 0); assert.match(original[0].markup, /&lt;0.png>/);
  c.renderQReverseTable(rows.slice(0, 3)); assert.equal(body.children.length, 3); assert.equal(original[99].parent, null);
  const sibling = { ...rows[0], id: 101, value: 'second QR' };
  c.renderQReverseTable([rows[0], sibling, rows[1], rows[2]]);
  assert.equal(body.children[0], original[0]); assert.equal(body.children[2], original[1]);
  assert.match(original[1].markup, /Include row 3/);
  c.renderQReverseTable([]); assert.equal(body.children.length, 1); assert.equal(original[0].parent === null || !body.children.includes(original[0]), true);
  c.renderQReverseTable(rows.slice(0, 1)); assert.equal(body.children[0], original[0]); assert.equal(body.children.length, 1);
});
