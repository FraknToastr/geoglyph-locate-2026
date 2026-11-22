/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: './tests',
  testMatch: '**/*.spec.js',
  use: {
    browserName: 'chromium',
    headless: true
  }
};
