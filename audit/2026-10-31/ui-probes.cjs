// Read-only source probes. Browser/DOM dependencies are explicitly simulated.
// Run from the conference root: rtk proxy node audit/2026-10-31/ui-probes.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const core = read('src/scripts/core.js');
const ui = read('src/scripts/geoglyph-v1512-ux-ui.js');
const workflow = read('src/scripts/geoglyph-v15-ui.js');
const results = { measuredAt: new Date().toISOString(), node: process.version, evidenceKind: 'isolated source execution with simulated browser dependencies', probes: {} };

async function main() {
  const storageContext = { window: {}, localStorage: { getItem() { const e = Error('Simulated denied storage'); e.name = 'SecurityError'; throw e; } } };
  try { vm.runInNewContext(core, storageContext); results.probes.storageStartup = { threw: false }; }
  catch (e) { results.probes.storageStartup = { threw: true, errorName: e.name, studioApiCreated: Boolean(storageContext.window.GeoGlyphStudio), errorSite: e.stack.split('\n').slice(0, 4).join('\n') }; }

  const storageWrite = ui.split('\n').find(line => line.includes('function saveFavouriteOwners()'));
  try {
    vm.runInNewContext(storageWrite + '\nsaveFavouriteOwners();', { favouriteOwners: {}, FAVOURITE_OWNERS_KEY: 'synthetic', localStorage: { setItem() { const e = Error('Simulated full quota'); e.name = 'QuotaExceededError'; throw e; } } });
    results.probes.favouriteStartupWrite = { threw: false };
  } catch (e) { results.probes.favouriteStartupWrite = { threw: true, errorName: e.name }; }

  const start = workflow.indexOf('    async function updateQReversePreview()');
  const end = workflow.indexOf('\n    function scheduleOutputRefresh()', start);
  const resolvers = [], input = { value: 'ORIGINAL-AUTHORED-VALUE' };
  const previewContext = {
    document: { body: { dataset: { workflow: 'qreverse' } } }, qreversePreviewMode: 'output',
    currentQReverseRow() { return previewContext.row; }, row: { value: 'FIRST-SYNTHETIC-ROW' },
    clearSourceObjectUrl() {}, sourceLayer: { classList: { remove() {}, add() {} } },
    $() { return input; }, api: { renderPreview() { return new Promise(resolve => resolvers.push(resolve)); } }
  };
  vm.createContext(previewContext);
  vm.runInContext(workflow.slice(start, end), previewContext);
  const first = vm.runInContext('updateQReversePreview()', previewContext);
  previewContext.row = { value: 'SECOND-SYNTHETIC-ROW' };
  const second = vm.runInContext('updateQReversePreview()', previewContext);
  resolvers[0](); await first;
  resolvers[1](); await second;
  results.probes.concurrentQrPreview = { expectedInput: 'ORIGINAL-AUTHORED-VALUE', actualInput: input.value, originalPreserved: input.value === 'ORIGINAL-AUTHORED-VALUE', note: 'The two actual extracted source calls overlap at api.renderPreview; only DOM/render completion is simulated.' };

  const applySettings = core.split('\n').find(line => line.includes('function applySettings(s)'));
  const state = { fonts: [], colourTargets: {}, qreverse: {}, preview: 'symbol' };
  const settingsContext = { state, QR_LIMITS: {}, resetExternalLogoAssetCache() {}, sanitizeOffset: () => ({ x: 0, y: 0 }), validHex: () => false, restoreQReverseSettings() {}, window: {}, document: { dispatchEvent() {} }, CustomEvent: class {}, renderAll() {} };
  vm.createContext(settingsContext);
  vm.runInContext(applySettings + '\napplySettings({selectedCode: 0x110000});', settingsContext);
  let conversionError;
  try { String.fromCodePoint(state.selectedCode); } catch(e) { conversionError = e.name; }
  results.probes.settingsCodeRange = { input: 0x110000, stored: state.selectedCode, conversionError, note: 'Settings mutation isolated from DOM and rendering; actual invalid value is retained by the loader.' };

  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'geoglyph-ui-css-probe-'));
  for (const file of ['scripts/consolidate-css.cjs', 'src/assets.json', 'src/template.html', 'src/styles/app.css', 'src/styles/map-controls.css']) {
    const dest = path.join(scratch, file); fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(path.join(root, file), dest);
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
  const consolidation = spawnSync(process.execPath, ['scripts/consolidate-css.cjs'], { cwd: scratch, encoding: 'utf8' });
  const manifest = JSON.parse(fs.readFileSync(path.join(scratch, 'src/assets.json'), 'utf8'));
  results.probes.cssConsolidation = { exitCode: consolidation.status, output: consolidation.stdout.trim(), appCssExists: fs.existsSync(path.join(scratch, 'src/styles/app.css')), manifestStillReferencesAppCss: manifest.some(asset => asset.path === 'src/styles/app.css'), note: 'Unmodified maintenance script executed in a disposable copy. Workspace application files were not changed.' };
  fs.rmSync(scratch, { recursive: true, force: true });
  fs.writeFileSync(path.join(__dirname, 'ui-probe-results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
