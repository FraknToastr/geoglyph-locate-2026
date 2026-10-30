const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  workers: 3,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: { command: 'node scripts/dev-server.cjs', url: 'http://127.0.0.1:4174', reuseExistingServer: false, timeout: 20_000 },
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile:'validation/browser-results.json' }]],
});
