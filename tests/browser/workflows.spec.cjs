const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const fs=require('node:fs');

test('all established workflows remain reachable without script errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 for(const workflow of ['qr','symbol','qreverse','magic-eye','symbol']){
  await page.locator('[data-workflow="'+workflow+'"]').first().click();
  await expect(page.locator('body')).toHaveAttribute('data-workflow',workflow);
 }
 expect(errors).toEqual([]);
 await expect(page).toHaveTitle('GeoGlyph — Locate 2026');
});

test('generated QR encodes its value and offline reverse scanning decodes it',async({page})=>{
 await page.goto('/');await page.locator('[data-workflow="qr"]').first().click();
 await page.locator('#qrInput').fill('https://example.test/geoglyph-stage-one');
 const result=await page.evaluate(async()=>{
  const canvas=document.createElement('canvas');await GeoGlyphStudio.drawQrToCanvas(canvas,512,false);
  const image=canvas.getContext('2d').getImageData(0,0,512,512);
  return {decoded:window.jsQR(image.data,image.width,image.height,{inversionAttempts:'attemptBoth'})?.data,data:canvas.toDataURL('image/png')};
 });
 expect(result.decoded).toBe('https://example.test/geoglyph-stage-one');
 await page.locator('[data-workflow="qreverse"]').first().click();
 await page.locator('#qreverseImageInput').setInputFiles({name:'roundtrip.png',mimeType:'image/png',buffer:Buffer.from(result.data.split(',')[1],'base64')});
 await page.locator('#v15ScanQueued').click();
 await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows[0]?.value)).toBe(result.decoded);
});

test('large glyph ranges keep bounded DOM and support Find and keyboard selection',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{const s=GeoGlyphStudio.state;s.rangeStart=32;s.rangeCount=4096;s.characterSet='custom';GeoGlyphStudio.renderGlyphGrid();});
 expect(await page.locator('#glyphGrid [data-code]').count()).toBeLessThan(200);
 await page.evaluate(()=>{GeoGlyphStudio.state.selectedCode=3500;GeoGlyphStudio.renderGridSelectionPreview();});
 await page.locator('#gridPreviewFindBtn').click();
 await expect(page.locator('#glyphGrid [data-code="3500"]')).toBeFocused();
 await page.locator('#glyphGrid [data-code="3500"]').press('End');
 await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.selectedCode)).toBe(4127);
 await expect(page.locator('#glyphGrid [data-code="4127"]')).toHaveAttribute('aria-current','true');
 expect(await page.locator('#glyphGrid [data-code]').count()).toBeLessThan(200);
});

test('first font fills the explorer after startup layout and viewport growth',async({page})=>{
 await page.setViewportSize({width:1440,height:1300});await page.goto('/');
 await page.waitForFunction(()=>window.GeoGlyphStudio&&document.body.classList.contains('drawer-open'));
 const initial=await page.evaluate(()=>({font:GeoGlyphStudio.state.selectedFontId,code:GeoGlyphStudio.state.selectedCode}));
 const covered=()=>page.evaluate(()=>{
  const grid=document.getElementById('glyphGrid'),cells=[...grid.querySelectorAll('[data-code]')];
  return cells.length>0&&Math.max(...cells.map(n=>n.getBoundingClientRect().bottom))>=grid.getBoundingClientRect().bottom;
 });
 await expect.poll(covered).toBe(true);
 await page.setViewportSize({width:1440,height:1700});await expect.poll(covered).toBe(true);
 await page.setViewportSize({width:1920,height:1400});await expect.poll(covered).toBe(true);
 expect(await page.evaluate(()=>({font:GeoGlyphStudio.state.selectedFontId,code:GeoGlyphStudio.state.selectedCode}))).toEqual(initial);
 await page.evaluate(()=>{GeoGlyphStudio.state.rangeCount=4096;GeoGlyphStudio.renderGlyphGrid();});
 expect(await page.locator('#glyphGrid [data-code]').count()).toBeLessThan(200);
 await page.locator('#closeDrawerBtn').click();await page.setViewportSize({width:1440,height:1300});
 await page.evaluate(()=>document.getElementById('openDrawerBtn').click());await expect.poll(covered).toBe(true);
});

test('standalone build can parse and render a font through its embedded worker',async({page})=>{
 test.skip(!fs.existsSync('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'),'Optional installed DejaVu fixture unavailable');
 await page.goto(pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href);
 await page.locator('#fontFile').setInputFiles('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');
 await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.fonts.find(f=>f.source==='file')?.exactFace)).toBe(true);
 const result=await page.evaluate(async()=>{
  const record=GeoGlyphStudio.state.fonts.find(f=>f.source==='file');
  return GeoGlyphFontService.model(record,'OO',{quality:16,tracking:0,lineHeight:1.15});
 });
 expect(result.polygons.length).toBe(2);
 expect(Number.isFinite(result.bounds.cx)).toBe(true);
});
