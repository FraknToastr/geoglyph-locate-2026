const { test, expect } = require('./studio-fixture.cjs');
const fs = require('node:fs/promises');

test.beforeEach(async ({ page }) => {
  await page.goto('index.html');
  await page.waitForFunction(() => window.GeoGlyphUi && document.querySelector('#mapFillHex'));
  if (await page.locator('body').evaluate(body => body.classList.contains('drawer-open'))) await page.locator('#closeDrawerBtn').click();
});

test('palette targets follow the active artwork and preserve independent colours', async ({ page }) => {
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();
  await expect(page.locator('[data-colour-target="qrFg"]')).toBeHidden();
  await expect(page.locator('[data-colour-target="symbol"]')).toBeVisible();
  await page.locator('[data-colour-target="symbol"]').click();
  const qrBefore = await page.evaluate(() => window.GeoGlyphStudio.state.colourTargets.qrFg.solid);
  await page.locator('#fgHex').fill('abc');
  await page.locator('#fgHex').press('Tab');
  await expect(page.locator('#fgHex')).toHaveValue('#AABBCC');
  expect(await page.evaluate(() => window.GeoGlyphStudio.state.colourTargets.symbol.solid)).toBe('#AABBCC');
  expect(await page.evaluate(() => window.GeoGlyphStudio.state.colourTargets.qrFg.solid)).toBe(qrBefore);
  await expect(page.locator('[data-recent-context]')).toHaveCount(0);
  await expect(page.locator('.palette-presets button').first()).toHaveAttribute('aria-label', /White/);
});

test('map settings use a validated authoring whitelist and omit credentials', async ({ page }) => {
  const value = await page.evaluate(() => {
    const engine = window.GeoGlyphMapEngine;
    engine.state.arcgisPkce = { verifier:'do-not-save' };
    engine.state.metroMapSourceKey = 'do-not-save';
    window.GeoGlyphUi.applyMapSettings({ version:1, message:'Restored', mode:'glyph', fill:'#abc', outline:'#123456', opacity:99, baseHeightMeters:1e12, anchor:{lng:999,lat:99}, arcgisPkce:{verifier:'malicious'} });
    return window.GeoGlyphUi.collectMapSettings();
  });
  expect(value.message).toBe('Restored');
  expect(value.fill).toBe('#AABBCC');
  expect(value.opacity).toBe(1);
  expect(value.baseHeightMeters).toBe(300000);
  expect(value.anchor.lng).toBe(180);
  expect(value.anchor.lat).toBeCloseTo(85.051129);
  expect(JSON.stringify(value)).not.toContain('do-not-save');
  expect(JSON.stringify(value)).not.toContain('malicious');
  await expect(page.locator('#mapFillHex')).toHaveValue('#AABBCC');
});

test('text editing keeps browser undo and header Load is keyboard accessible', async ({ page }) => {
  await page.locator('#headerSaveBtn').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#headerLoadBtn')).toBeFocused();
  const chooser = page.waitForEvent('filechooser');
  await page.locator('#headerLoadBtn').press('Enter');
  await chooser;
  const intercepted = await page.evaluate(() => {
    const input = document.querySelector('#qrInput');
    const event = new KeyboardEvent('keydown', {key:'z',ctrlKey:true,bubbles:true,cancelable:true});
    input.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(intercepted).toBe(false);
});

test('application undo restores a committed map colour', async ({ page }) => {
  const before = await page.evaluate(() => window.GeoGlyphMapEngine.state.fill);
  await page.evaluate(() => {
    const picker = document.querySelector('#mapFill');
    picker.value = '#123456';
    picker.dispatchEvent(new Event('input', {bubbles:true}));
    picker.dispatchEvent(new Event('change', {bubbles:true}));
  });
  await expect(page.locator('#v1512Undo')).toBeEnabled();
  await page.locator('#v1512Undo').click();
  await expect.poll(() => page.evaluate(() => window.GeoGlyphMapEngine.state.fill)).toBe(before);
  await expect(page.locator('#v1512Redo')).toBeEnabled();
  await page.locator('#v1512Redo').click();
  await expect.poll(() => page.evaluate(() => window.GeoGlyphMapEngine.state.fill)).toBe('#123456');
});

test('Save and Load round trip map design settings through the application', async ({ page }) => {
  await page.evaluate(() => window.GeoGlyphUi.applyMapSettings({mode:'message',message:'Map design',fill:'#456789',outline:'#FFFFFF',outlineWidth:3}));
  const downloading = page.waitForEvent('download');
  await page.locator('#headerSaveBtn').click();
  const download = await downloading;
  const json = await fs.readFile(await download.path(), 'utf8');
  const settings = JSON.parse(json);
  expect(settings.map.version).toBe(3);
  expect(settings.map.message).toBe('Map design');
  expect(settings.map.fill).toBe('#456789');
  await page.evaluate(() => window.GeoGlyphUi.applyMapSettings({message:'Changed',fill:'#000000'}));
  await page.locator('#settingsFileInput').setInputFiles({name:'settings.json',mimeType:'application/json',buffer:Buffer.from(json)});
  await expect.poll(() => page.evaluate(() => window.GeoGlyphMapEngine.state.message)).toBe('Map design');
  await expect(page.locator('#mapFillHex')).toHaveValue('#456789');
});
