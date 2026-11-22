const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

async function openSymbol(page,standalone=false){
  await page.goto(standalone?pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphUi&&document.querySelector('#symbolInlinePicker input'));
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();
  await page.evaluate(()=>document.getElementById('closeDrawerBtn').click());
  await page.evaluate(()=>GeoGlyphStudio.renderPreview());
}
async function download(page,selector){
  const pending=page.waitForEvent('download');
  await page.locator(selector).click();
  const file=await pending;
  return {name:file.suggestedFilename(),bytes:await fs.readFile(await file.path())};
}

for(const standalone of [false,true])test(`crosshair colours remain preview-only and survive workflow changes (${standalone?'portable':'development'})`,async({page})=>{
  await openSymbol(page,standalone);
  const crosshair=page.getByRole('group',{name:'Crosshair colour',exact:true});
await expect(crosshair.getByRole('button')).toHaveCount(7);
await expect(crosshair.getByRole('button',{name:'Pale grey crosshair'})).toHaveAttribute('aria-pressed','true');
expect(await page.locator('#previewStage').evaluate(node=>getComputedStyle(node,'::before').backgroundColor)).toBe('rgb(211, 211, 211)');
  const before=await page.evaluate(()=>({canvas:document.getElementById('qrCanvas').toDataURL(),paints:JSON.stringify(GeoGlyphStudio.state.colourTargets)}));
  await page.locator('.header-export-btn').click();
  await page.locator('#symbolFileName').fill('crosshair-test');
  const png=await download(page,'#exportSymbolPngBtn');
  const svg=await download(page,'#exportSymbolSvgBtn');
  await page.locator('.export-close-btn').click();
for(const [name,expected] of [['Pale grey','rgb(211, 211, 211)'],['White','rgb(255, 255, 255)'],['Black','rgb(0, 0, 0)'],['Orange','rgb(244, 125, 34)'],['Cyan','rgb(0, 255, 255)'],['Magenta','rgb(255, 0, 255)']]){
    const button=crosshair.getByRole('button',{name:`${name} crosshair`,exact:true});
    await button.focus();await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(crosshair.locator('[aria-pressed="true"]')).toHaveCount(1);
    for(const pseudo of ['::before','::after'])expect(await page.locator('#previewStage').evaluate((node,pseudo)=>getComputedStyle(node,pseudo).backgroundColor,pseudo)).toBe(expected);
  }
  expect(await page.evaluate(()=>({canvas:document.getElementById('qrCanvas').toDataURL(),paints:JSON.stringify(GeoGlyphStudio.state.colourTargets)}))).toEqual(before);
  await page.locator('.header-export-btn').click();
  expect((await download(page,'#exportSymbolPngBtn')).bytes.equals(png.bytes)).toBe(true);
  expect((await download(page,'#exportSymbolSvgBtn')).bytes.equals(svg.bytes)).toBe(true);
  expect(png.name).toBe('crosshair-test.png');expect(svg.name).toBe('crosshair-test.svg');
  await page.locator('.export-close-btn').click();
const off=crosshair.getByRole('button',{name:'Turn off crosshair',exact:true});
await off.focus();await page.keyboard.press('Enter');
await expect(off).toHaveAttribute('aria-pressed','true');
await expect(crosshair.locator('[aria-pressed="true"]')).toHaveCount(1);
for(const pseudo of ['::before','::after'])expect(await page.locator('#previewStage').evaluate((node,pseudo)=>getComputedStyle(node,pseudo).backgroundColor,pseudo)).toBe('rgba(0, 0, 0, 0)');
expect(await page.evaluate(()=>({canvas:document.getElementById('qrCanvas').toDataURL(),paints:JSON.stringify(GeoGlyphStudio.state.colourTargets)}))).toEqual(before);
await page.locator('.header-export-btn').click();
expect((await download(page,'#exportSymbolPngBtn')).bytes.equals(png.bytes)).toBe(true);
expect((await download(page,'#exportSymbolSvgBtn')).bytes.equals(svg.bytes)).toBe(true);
await page.locator('.export-close-btn').click();
  await page.locator('.workflow-nav [data-workflow="qr"]').click();await expect(crosshair).toBeHidden();
  expect(await page.locator('#previewStage').evaluate(node=>getComputedStyle(node,'::before').backgroundColor)).toBe('rgba(185, 202, 209, 0.18)');
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();
await expect(off).toHaveAttribute('aria-pressed','true');
await page.reload();await page.waitForFunction(()=>document.querySelector('[data-crosshair-colour="off"][aria-pressed="true"]'));
expect(await page.locator('#previewStage').evaluate(node=>getComputedStyle(node,'::before').backgroundColor)).toBe('rgba(0, 0, 0, 0)');
await crosshair.getByRole('button',{name:'Pale grey crosshair'}).click();
expect(await page.locator('#previewStage').evaluate(node=>getComputedStyle(node,'::before').backgroundColor)).toBe('rgb(211, 211, 211)');
await page.reload();await page.waitForFunction(()=>document.querySelector('[data-crosshair-colour="#D3D3D3"][aria-pressed="true"]'));
});

test('preview title and live font metadata wrap without hiding or overlapping actions',async({page})=>{
  await openSymbol(page);
  const chosen=await page.evaluate(()=>{
    const font=GeoGlyphStudio.state.fonts.find(font=>font.id!==GeoGlyphStudio.state.selectedFontId);
    GeoGlyphStudio.state.selectedFontId=font.id;GeoGlyphStudio.state.selectedCode=66;
    GeoGlyphStudio.syncControlsFromState();return font.name;
  });
  await expect(page.locator('.preview-title-group #fontStatus')).toHaveText(chosen);
  await expect(page.locator('.preview-title-group #codeStatus')).toHaveText('U+0042');
  const gap=await page.evaluate(()=>document.querySelector('.preview-header-status').getBoundingClientRect().left-document.querySelector('.preview-title-group .panel-title').getBoundingClientRect().right);
  expect(gap).toBeCloseTo(8,0);
  await page.evaluate(()=>{document.getElementById('fontStatus').textContent='A very long font family name with an extended descriptive style and weight';});
  for(const width of [1440,1100,899,390])for(const theme of ['dark','light']){
    await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
    await expect(page.locator('#fontStatus')).toBeVisible();await expect(page.locator('#codeStatus')).toBeVisible();
    const layout=await page.evaluate(()=>{
      const box=node=>{const r=node.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top,b:r.bottom};};
      const head=document.querySelector('.preview-panel-head');
      return {head:box(head),client:head.clientWidth,scroll:head.scrollWidth,items:[...head.querySelectorAll('.preview-title-group,.preview-crosshair-controls,.v1512-history,.header-export-btn')].map(box)};
    });
    expect(layout.scroll).toBeLessThanOrEqual(layout.client+1);
    for(const item of layout.items){expect(item.l).toBeGreaterThanOrEqual(layout.head.l);expect(item.r).toBeLessThanOrEqual(layout.head.r);expect(item.t).toBeGreaterThanOrEqual(layout.head.t);expect(item.b).toBeLessThanOrEqual(layout.head.b);}
    for(let i=0;i<layout.items.length;i++)for(let j=i+1;j<layout.items.length;j++){
      const a=layout.items[i],b=layout.items[j];expect(Math.min(a.r,b.r)<=Math.max(a.l,b.l)||Math.min(a.b,b.b)<=Math.max(a.t,b.t)).toBe(true);
    }
  }
});

test('compact Export Symbol keeps details aligned, close at top right and keyboard focus contained',async({page})=>{
  await openSymbol(page);await page.locator('.header-export-btn').click();
  await expect(page.locator('.export-panel .panel-title')).toHaveText('Export Symbol');
  await expect(page.locator('#symbolFileName')).toBeFocused();
  for(const width of [1440,390])for(const theme of ['dark','light']){
    await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
    const layout=await page.evaluate(()=>{
      const box=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
      const panel=document.querySelector('.export-panel'),body=panel.querySelector('.panel-body');
      return {panel:box(panel),head:box(panel.querySelector('.panel-head')),close:box(panel.querySelector('.export-close-btn')),details:[...panel.querySelectorAll('.export-details-row>.control-row')].map(box),buttons:[...panel.querySelectorAll('.symbol-export-group button')].map(box),client:body.clientWidth,scroll:body.scrollWidth};
    });
    expect(layout.panel.w).toBeLessThanOrEqual(460);expect(layout.panel.h).toBeLessThan(340);expect(layout.scroll).toBeLessThanOrEqual(layout.client+1);
    expect(layout.head.right-layout.close.right).toBeLessThanOrEqual(6);expect(layout.close.y-layout.head.y).toBeLessThanOrEqual(8);
    if(width===1440){expect(layout.details[0].y).toBeCloseTo(layout.details[1].y,0);expect(layout.details[1].x).toBeGreaterThan(layout.details[0].right);}
    else expect(layout.details[1].y).toBeGreaterThanOrEqual(layout.details[0].bottom);
    for(const button of layout.buttons)expect(button.w).toBeLessThan(125);
  }
  await page.locator('.export-close-btn').focus();await page.keyboard.press('Shift+Tab');await expect(page.locator('#transparentCanvasBtn')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('.export-close-btn')).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('.export-panel')).toBeHidden();await expect(page.locator('.header-export-btn')).toBeFocused();
  await page.locator('.header-export-btn').click();await page.locator('.export-close-btn').click();await expect(page.locator('.header-export-btn')).toBeFocused();
});
