// Keep legacy authoring regression checks separate from unattended presentation
// startup. conference-presentation.spec.cjs exercises the real default startup.
const base = require('@playwright/test');
const test = base.test.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => { window.GeoGlyphConferenceAutoStart = false; });
    await use(page);
  }
});
module.exports = { ...base, test };
