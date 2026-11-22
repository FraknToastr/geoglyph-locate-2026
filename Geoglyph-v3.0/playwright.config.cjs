const {defineConfig}=require('./apps/geoglyph/node_modules/@playwright/test');
module.exports=defineConfig({
  testDir:'./tests/browser',timeout:75_000,expect:{timeout:15_000},workers:2,fullyParallel:true,
  use:{baseURL:'http://127.0.0.1:4186',browserName:'chromium',headless:true,viewport:{width:1440,height:1000}},
  outputDir:'/tmp/geoglyph-v3-browser-results',reporter:[['line']],
  webServer:{command:'node scripts/dev-server.cjs',url:'http://127.0.0.1:4186',reuseExistingServer:false,timeout:20_000}
});
