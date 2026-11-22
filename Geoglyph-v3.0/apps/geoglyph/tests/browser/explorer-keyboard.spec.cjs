const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

async function openExplorer(page,portable=false){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(portable?pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphStudio&&document.querySelector('.workflow-font-btn'));
  if(!await page.locator('body').evaluate(body=>body.classList.contains('drawer-open')))await page.locator('.workflow-font-btn').click();
  await expect(page.locator('#glyphGrid')).toBeVisible();
  await page.waitForFunction(()=>document.getElementById('glyphGrid')._virtualStride>0);
}
const selection=page=>page.evaluate(()=>({font:GeoGlyphStudio.state.selectedFontId,code:GeoGlyphStudio.state.selectedCode,range:GeoGlyphStudio.state.rangeStart}));

for(const portable of [false,true])test(`Explorer arrows switch fonts and page characters (${portable?'portable':'modular'})`,async({page})=>{
  await openExplorer(page,portable);
  const ids=await page.evaluate(()=>GeoGlyphStudio.state.fonts.map(font=>font.id));
  const before=await selection(page);
  await page.locator('#fontList .font-row.is-active').focus();
  await page.keyboard.press('ArrowDown');
  await expect.poll(()=>selection(page)).toEqual({...before,font:ids[1]});
  await expect(page.locator('#fontList .font-row.is-active')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect.poll(()=>selection(page)).toEqual({...before,font:ids[2]});
  await page.keyboard.press('ArrowUp');
  await expect.poll(()=>selection(page)).toEqual({...before,font:ids[1]});
  const grid=page.locator('#glyphGrid');
  await grid.focus();
  const start=await selection(page);
  const metrics=()=>grid.evaluate(el=>({top:el.scrollTop,height:el.clientHeight,total:el.scrollHeight,stride:el._virtualStride,columns:el._virtualColumns,focus:document.activeElement.id}));
  const firstPage=await metrics();
  await page.keyboard.press('ArrowRight');
  await expect.poll(()=>grid.evaluate(el=>el.scrollTop)).toBe(Math.min(firstPage.total-firstPage.height,firstPage.top+Math.max(1,Math.floor(firstPage.height/firstPage.stride))*firstPage.stride));
  await expect(grid).toBeFocused();
  expect(await selection(page)).toEqual(start);
  await page.keyboard.press('ArrowLeft');
  await expect.poll(()=>grid.evaluate(el=>el.scrollTop)).toBe(firstPage.top);
  await grid.evaluate(el=>{el.scrollTop=el.scrollHeight-el.clientHeight;GeoGlyphStudio.renderGlyphGrid();});
  const end=await grid.evaluate(el=>el.scrollTop);
  await page.keyboard.press('ArrowRight');
  expect(await grid.evaluate(el=>el.scrollTop)).toBe(end);
  await grid.evaluate(el=>{el.scrollTop=0;GeoGlyphStudio.renderGlyphGrid();});
  await page.keyboard.press('ArrowLeft');
  expect(await grid.evaluate(el=>el.scrollTop)).toBe(0);
  expect(await selection(page)).toEqual(start);
  expect(await grid.locator('[data-code]').count()).toBeLessThan(200);
});

test('font arrows respect filtering and boundaries across a virtualised list',async({page})=>{
  await openExplorer(page);
  const ids=await page.evaluate(()=>GeoGlyphStudio.registerFonts(Array.from({length:1000},(_,i)=>({
    name:`Keyboard ${String(i).padStart(4,'0')}`,family:'sans-serif',source:'keyboard-fixture',fontResourceKey:`keyboard-${i}`
  }))).map(font=>font.id));
  await page.locator('#fontSearch').fill('Keyboard');
  await page.locator('#clearFontSearch').focus();
  await page.keyboard.press('ArrowDown');
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.selectedFontId)).toBe(ids[0]);
  await page.keyboard.press('ArrowUp');
  expect((await selection(page)).font).toBe(ids[0]);
  await page.evaluate(id=>GeoGlyphStudio.selectFont(id),ids[998]);
  await page.locator('#glyphGrid').focus();
  await page.keyboard.press('ArrowDown');
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.selectedFontId)).toBe(ids[999]);
  await expect(page.locator('#fontList .font-row.is-active')).toBeInViewport();
  await expect(page.locator('#fontList .font-row.is-active')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  expect((await selection(page)).font).toBe(ids[999]);
  await page.keyboard.press('ArrowUp');
  expect((await selection(page)).font).toBe(ids[998]);
  expect(await page.locator('#fontList .font-row').count()).toBeLessThanOrEqual(48);
  await page.locator('#fontSearch').fill('No matching fonts');
  await page.locator('#clearFontSearch').focus();
  const before=await selection(page);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  expect(await selection(page)).toEqual(before);
});

test('Explorer shortcuts preserve editing, modifiers, other controls and closed-drawer behaviour',async({page})=>{
  await openExplorer(page);
  const before=await selection(page);
  for(const id of ['fontSearch','glyphSearch','rangeStart']){
    const prevented=await page.locator('#'+id).evaluate(input=>['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].map(key=>{
      const event=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});input.dispatchEvent(event);return event.defaultPrevented;
    }));
    expect(prevented).toEqual([false,false,false,false]);
  }
  await page.locator('#fontList .font-row.is-active').focus();
  for(const modifier of ['Shift','Alt','Control','Meta'])await page.keyboard.press(`${modifier}+ArrowDown`);
  expect(await selection(page)).toEqual(before);
  await page.locator('#headerSaveBtn').focus();
  await page.keyboard.press('ArrowDown');
  expect(await selection(page)).toEqual(before);
  await page.locator('#closeDrawerBtn').click();
  await page.evaluate(()=>document.activeElement.blur());
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  expect(await selection(page)).toEqual(before);
});
