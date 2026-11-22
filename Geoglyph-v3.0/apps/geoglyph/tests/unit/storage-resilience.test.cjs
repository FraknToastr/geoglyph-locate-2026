const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const core = fs.readFileSync(path.join(__dirname, '../../src/scripts/core.js'), 'utf8');
const ui = fs.readFileSync(path.join(__dirname, '../../src/scripts/geoglyph-v1512-ux-ui.js'), 'utf8');
function boot(storage, deniedGetter = false) {
  const c = { window: { addEventListener() {} }, localStorage: storage };
  if (deniedGetter) Object.defineProperty(c, 'localStorage', { get() { throw Error('SecurityError'); } });
  vm.createContext(c); vm.runInContext(core, c); return c.window.GeoGlyphStudio;
}
test('denied storage property or reads still publish the core API with defaults', () => {
  for (const denied of [true, false]) {
    const api = boot({ getItem() { throw Error('SecurityError'); } }, denied);
    assert.equal(api.state.theme, 'dark'); assert.equal(api.state.favourites.length, 0);
  }
});
test('healthy existing preference formats load unchanged', () => {
  const api = boot({ getItem: key => key.includes('theme') ? 'light' : '[65,65,66]' });
  assert.equal(api.state.theme, 'light'); assert.equal(JSON.stringify(api.state.favourites), '[65,66]');
});
function extract(name) { const start = core.indexOf('  function ' + name + '('); return core.slice(start, core.indexOf('\n  }', start) + 4); }
test('quota failure does not interrupt in-memory theme or favourite changes', () => {
  let synced = 0;
  const c = { state: { theme: 'dark', favourites: [65] }, THEME_STORAGE_KEY: 'theme', FAVOURITES_STORAGE_KEY: 'favourites',
    localStorage: { setItem() { throw Error('QuotaExceededError'); } }, document: { documentElement: { dataset: {} } },
    syncThemeControls() { synced++; }, renderGlyphGrid() {}, renderGridSelectionPreview() {} };
  vm.createContext(c); vm.runInContext(extract('setTheme') + extract('persistFavourites'), c);
  c.setTheme('light'); c.persistFavourites(); assert.equal(c.state.theme, 'light'); assert.equal(synced, 1);
});
test('favourite owner synchronization works with failing and healthy writes', () => {
  for (const fail of [true, false]) {
    const writes = [], c = { state: { favourites: [99] }, favouriteOwners: { 65: ['font'] }, FAVOURITE_OWNERS_KEY: 'owners',
      favouritesForFont: () => [65], localStorage: { setItem(key, value) { if (fail) throw Error('quota'); writes.push([key, value]); } } };
    vm.createContext(c);
    for (const name of ['saveFavouriteOwners', 'syncCurrentFontFavourites']) vm.runInContext(ui.split('\n').find(line => line.includes('function ' + name + '(')), c);
    c.saveFavouriteOwners(); c.syncCurrentFontFavourites(); assert.deepEqual(c.state.favourites, [65]);
    if (!fail) assert.deepEqual(writes, [['owners', '{"65":["font"]}'], ['geoglyph-locate2026.geoglyph-favourites', '[65]']]);
  }
});
