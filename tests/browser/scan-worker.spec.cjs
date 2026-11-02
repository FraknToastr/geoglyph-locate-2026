const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

for(const portable of [false,true])test(`QR scan worker decodes and recreates after cancellation (${portable?'portable':'modular'})`,async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{delete window.BarcodeDetector;});
  await page.goto(portable?pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href:'/');
  await page.locator('[data-workflow="qr"]').first().click();
  await page.locator('#qrInput').fill('https://example.test/geoglyph-stage-one');
  const data=await page.evaluate(async()=>{
    const canvas=document.createElement('canvas');await GeoGlyphStudio.drawQrToCanvas(canvas,512,false);
    return canvas.toDataURL('image/png');
  });
  await page.evaluate(()=>{window.jsQR=()=>{throw Error('Unexpected main-thread QR decode');};});
  await page.locator('[data-workflow="qreverse"]').first().click();
  await page.locator('#qreverseImageInput').setInputFiles({name:'worker.png',mimeType:'image/png',buffer:Buffer.from(data.split(',')[1],'base64')});
  await page.locator('#v15ScanQueued').click();
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows[0]?.value)).toBe('https://example.test/geoglyph-stage-one');
  const stats=await page.evaluate(()=>GeoGlyphStudio.state.qreverse.scanner.stats());
  expect(stats.workerJobs).toBe(1);expect(stats.fallbacks).toBe(0);expect(stats.pending).toBe(0);
  const result=await page.evaluate(async data=>{
    const scanner=GeoGlyphStudio.state.qreverse.scanner;
    scanner.cancel();
    const bitmap=await createImageBitmap(await (await fetch(data)).blob());
    try{return {codes:await scanner.detect(bitmap),stats:scanner.stats()};}
    finally{bitmap.close();}
  },data);
  expect(result.codes.map(code=>code.rawValue)).toEqual(['https://example.test/geoglyph-stage-one']);
  expect(result.stats.workerJobs).toBe(2);expect(result.stats.fallbacks).toBe(0);expect(errors).toEqual([]);
});
