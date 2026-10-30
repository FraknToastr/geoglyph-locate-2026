const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const logo=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="16" y="16" width="32" height="32" fill="#B978FF"/></svg>');

async function open(page,standalone=false){
  await page.goto(standalone?pathToFileURL(path.resolve(__dirname,'../../dist/GeoGlyph.html')).href:'/');
  await page.waitForFunction(()=>window.GeoGlyphUi&&document.querySelector('#qrBufferEdgePicker input'));
  await page.locator('.workflow-nav [data-workflow="qr"]').click();
}
async function loadLogo(page){
  await page.locator('#logoInput').setInputFiles({name:'logo.svg',mimeType:'image/svg+xml',buffer:logo});
  await expect(page.locator('#qrBufferEdgePicker')).toHaveAttribute('aria-disabled','false');
}
async function editHex(page,picker,value){
  await picker.getByRole('combobox',{name:'Colour input format'}).selectOption('hex');
  const input=picker.getByRole('textbox',{name:'Hex colour',exact:true});
  await input.fill(value);await input.press('Tab');
}

for(const standalone of [false,true])test(`QART entry and resets use slider limits while edits and settings remain usable (${standalone?'portable':'development'})`,async({page})=>{
  await open(page,standalone);
  const nav=page.getByRole('button',{name:'QART',exact:true});
  await expect(nav).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#studioControls>.panel-head .panel-title')).toContainText('QART');
  const limits=await page.evaluate(()=>({logo:Number(document.getElementById('zoneSlider').max),quiet:Number(document.getElementById('quietSlider').min),backdrop:Number(document.getElementById('backdropSize').max)}));
  expect(limits).toEqual({logo:28,quiet:1,backdrop:95});
  const values=()=>page.evaluate(()=>({logo:GeoGlyphStudio.state.logoSize,quiet:GeoGlyphStudio.state.quietZone,backdrop:GeoGlyphStudio.state.bgScale}));
  await expect.poll(values).toEqual(limits);
  await expect(page.locator('#zoneValue')).toHaveText('28%');
  await expect(page.locator('#quietValue')).toHaveText('1');
  await expect(page.locator('#backdropValue')).toHaveText('95%');
  await page.locator('#zoneSlider').fill('14');await page.locator('#quietSlider').fill('5');await page.locator('#backdropSize').fill('50');
  await nav.click();await page.locator('#themeLightBtn').click();
  expect(await values()).toEqual({logo:14,quiet:5,backdrop:50});
  const pending=page.waitForEvent('download');await page.locator('#headerSaveBtn').click();
  const saved=await fs.readFile(await(await pending).path());
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();
  await nav.click();await expect.poll(values).toEqual(limits);
  await page.locator('#zoneSlider').fill('14');await page.locator('#quietSlider').fill('5');await page.locator('#backdropSize').fill('50');
  await page.locator('#qrControlModule .v1512-reset-btn').click();
  expect(await values()).toEqual({...limits,backdrop:50});
  await page.locator('#zoneSlider').fill('14');await page.locator('#quietSlider').fill('5');
  await page.locator('#symbolControlModule .v1512-reset-btn').click();
  expect(await values()).toEqual({logo:14,quiet:5,backdrop:95});
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();
  await page.locator('#settingsFileInput').setInputFiles({name:'qart-settings.json',mimeType:'application/json',buffer:saved});
  await expect(nav).toHaveAttribute('aria-pressed','true');
  await expect.poll(values).toEqual({logo:14,quiet:5,backdrop:50});
  await page.locator('.header-export-btn').click();
  await expect(page.locator('.export-panel .panel-title')).toHaveText('Export QART');
});

test('QR sections share equal columns, remain independently collapsible and scroll naturally',async({page})=>{
  await open(page);
  for(const width of [1440,390])for(const theme of ['dark','light']){
    await page.setViewportSize({width,height:1000});
    await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
    const layout=await page.evaluate(()=>{
      const panel=document.querySelector('.right-panel>.panel-body');
      const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,scroll:n.scrollWidth,client:n.clientWidth};};
      return {sections:[...panel.children].filter(n=>n.getClientRects().length).map(n=>n.id),panel:rect(panel),height:panel.clientHeight,scroll:panel.scrollHeight,
        columns:['sharedColourModule','qrControlModule','symbolControlModule'].map(id=>[...document.getElementById(id).querySelector('.studio-module-split').children].map(rect)),
        content:['qrInput','qrCharacterStats','clearContentBtn','correctionBar','qrBufferEdgePicker','logoCropEdgeRow'].every(id=>!!document.getElementById(id).closest('.qr-content-column')),
        edgeTogether:document.getElementById('qrBufferEdgePicker').nextElementSibling===document.getElementById('logoCropEdgeRow'),
        options:['qrModes','zoneSlider','quietSlider','logoModeBar','logoCropRow','logoCropOptionsRow'].every(id=>!!document.getElementById(id).closest('.qr-options-column'))};
    });
    expect(layout.sections).toEqual(['qrControlModule','sharedColourModule','symbolControlModule']);
    for(const [left,right] of layout.columns){expect(left.w).toBeCloseTo(right.w,0);expect(right.x).toBeGreaterThan(left.x+left.w);for(const col of [left,right])expect(col.scroll).toBeLessThanOrEqual(col.client+1);}
    expect(layout.content&&layout.options&&layout.edgeTogether).toBe(true);expect(layout.panel.scroll).toBeLessThanOrEqual(layout.panel.client+1);expect(layout.scroll).toBeGreaterThan(layout.height);
  }
  await page.locator('[data-collapse-module="qrControlModule"]').click();
  await expect(page.locator('#qrContentPanel')).toBeHidden();await expect(page.locator('#symbolControlModule .dpad')).toBeVisible();
  await page.locator('[data-collapse-module="sharedColourModule"]').click();await expect(page.locator('#symbolInlinePicker')).toBeHidden();
  await page.locator('[data-collapse-module="qrControlModule"]').click();await expect(page.locator('#qrContentPanel')).toBeVisible();
  await page.locator('[data-collapse-module="sharedColourModule"]').click();
  await page.evaluate(()=>{document.getElementById('qrInput').style.height='350px';});
  const separation=await page.evaluate(()=>document.getElementById('symbolControlModule').getBoundingClientRect().top-document.getElementById('qrControlModule').getBoundingClientRect().bottom);
  expect(separation).toBeGreaterThanOrEqual(4);
});

test('QR palette and gradient picker stays independent from the Buffer edge editor',async({page})=>{
  await open(page);
  const main=page.locator('#symbolInlinePicker'),buffer=page.locator('#qrBufferEdgePicker');
  await expect(buffer).toHaveAttribute('aria-disabled','true');await expect(buffer.locator('select')).toBeDisabled();
  await expect(page.locator('#logoCropEdgeUp')).toBeDisabled();
  const original=await page.evaluate(()=>GeoGlyphStudio.state.logoCropEdgeColor);
  await page.locator('[data-colour-target="qrFg"]').click();await editHex(page,main,'#123456');
  expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.qrFg.solid)).toBe('#123456');
  expect(await page.evaluate(()=>GeoGlyphStudio.state.logoCropEdgeColor)).toBe(original);
  await page.locator('[data-colour-view="gradient"]').click();await page.locator('#gradBColor').click();
  await expect(main.locator('.inline-picker-label')).toHaveText('Stop B');await editHex(page,main,'#ABCDEF');
  expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.qrFg.gradient.colors[1])).toBe('#ABCDEF');
  await loadLogo(page);const paints=await page.evaluate(()=>JSON.parse(JSON.stringify(GeoGlyphStudio.state.colourTargets)));
  for(const [name,value] of [['Red','230'],['Green','93'],['Blue','23']])await buffer.getByRole('spinbutton',{name,exact:true}).fill(value);
  await expect(page.locator('#logoCropEdgeHex')).toHaveValue('#E65D17');
  await buffer.getByRole('combobox').selectOption('hsl');
  for(const [name,value] of [['Hue degrees','120'],['Saturation percent','100'],['Lightness percent','50']])await buffer.getByRole('spinbutton',{name,exact:true}).fill(value);
  await expect(page.locator('#logoCropEdgeHex')).toHaveValue('#00FF00');
  await editHex(page,buffer,'#112233');expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets)).toEqual(paints);
  await page.locator('[data-logo-crop="off"]').click();await expect(buffer).toHaveAttribute('aria-disabled','true');
  await expect(page.locator('#logoCropEdgeUp')).toBeDisabled();
  expect(await buffer.locator('input,select').evaluateAll(nodes=>nodes.every(n=>n.disabled))).toBe(true);
  await buffer.locator('input').first().evaluate(input=>{input.value='40';input.dispatchEvent(new Event('input',{bubbles:true}));});
  expect(await page.evaluate(()=>GeoGlyphStudio.state.logoCropEdgeColor)).toBe('#112233');
  await page.locator('[data-logo-crop="on"]').click();await expect(buffer).toHaveAttribute('aria-disabled','false');
  await expect(page.locator('#logoCropEdgeUp')).toBeEnabled();
  await page.locator('#qrControlModule .v1512-reset-btn').click();await expect(buffer).toHaveAttribute('aria-disabled','true');
  await expect(page.locator('#qrBufferEdgeHint')).toBeVisible();
});

test('Buffer edge changes support undo, redo and settings restoration',async({page})=>{
  await open(page);await loadLogo(page);
  const picker=page.locator('#qrBufferEdgePicker');const initial=await page.evaluate(()=>GeoGlyphStudio.state.logoCropEdgeColor);
  await editHex(page,picker,'#112233');await page.locator('#v1512Undo').click();
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.logoCropEdgeColor)).toBe(initial);
  await page.locator('#v1512Redo').click();await expect(page.locator('#logoCropEdgeHex')).toHaveValue('#112233');
  await page.locator('#logoCropEdgeUp').click();
  const pending=page.waitForEvent('download');await page.locator('#headerSaveBtn').click();const saved=JSON.parse(await fs.readFile(await (await pending).path(),'utf8'));
  expect(saved.logoCropEdgeColor).toBe('#112233');expect(saved.logoCropEdgeWidth).toBeGreaterThan(0);
  await page.locator('#qrControlModule .v1512-reset-btn').click();await expect(picker).toHaveAttribute('aria-disabled','true');
  await page.locator('#settingsFileInput').setInputFiles({name:'settings.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await expect(picker).toHaveAttribute('aria-disabled','false');await expect(picker.getByRole('textbox',{name:'Hex colour',exact:true})).toHaveValue('#112233');
  await expect(page.locator('#logoCropEdgeValue')).toHaveText(saved.logoCropEdgeWidth+' px');
});

test('QR Font Symbol controls and Magic Eye mode survive workflow changes',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
  await page.locator('[data-offset-target="background"]').click();await page.locator('[data-offset-step="5"]').click();await page.locator('[data-move="1,0"]').click();
  expect(await page.evaluate(()=>GeoGlyphStudio.state.bgOffset)).toEqual({x:5,y:0});
  await page.locator('.workflow-nav [data-workflow="magic-eye"]').click();
  await expect(page.locator('#qrModes')).toBeVisible();await expect(page.locator('#magicEyeBlur')).toBeVisible();
  await expect(page.locator('#qrContentPanel')).toBeHidden();await expect(page.locator('#symbolControlModule')).toBeHidden();
  await page.locator('[data-qr-mode="rounded"]').click();expect(await page.evaluate(()=>GeoGlyphStudio.state.qrMode)).toBe('rounded');
  await page.locator('[data-collapse-module="qrControlModule"]').click();await expect(page.locator('#qrModes')).toBeHidden();
  await page.locator('[data-collapse-module="qrControlModule"]').click();await expect(page.locator('#qrModes')).toBeVisible();
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();await expect(page.locator('#qrControlModule')).toBeHidden();await expect(page.locator('#symbolControlModule .dpad')).toBeVisible();
  expect(await page.evaluate(()=>GeoGlyphStudio.state.bgOffset)).toEqual({x:5,y:0});
  await page.locator('.workflow-nav [data-workflow="qr"]').click();await expect(page.locator('#qrInput')).toBeVisible();
  expect(await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id).filter((id,i,all)=>all.indexOf(id)!==i))).toEqual([]);expect(errors).toEqual([]);
});

test('portable QR exports retain embedded content and the new Buffer edge colour',async({page})=>{
  await open(page,true);await page.locator('#qrInput').fill('https://example.test/qr-layout');await loadLogo(page);
  await page.locator('#zoneSlider').fill('10');
  await editHex(page,page.locator('#qrBufferEdgePicker'),'#E65D17');await page.locator('#logoCropEdgeUp').click();await page.locator('#logoCropEdgeUp').click();
  await page.locator('.header-export-btn').click();
  const files={};
  for(const [kind,button] of [['png','#exportQrPngBtn'],['svg','#exportQrSvgBtn'],['vector','#exportQrExperimentalSvgBtn']]){
    const pending=page.waitForEvent('download');await page.locator(button).click();files[kind]=await fs.readFile(await (await pending).path());
  }
  expect(files.svg.toString()).toContain('<svg');expect(files.vector.toString()).toContain('stroke="#E65D17"');
  const result=await page.evaluate(async b64=>{
    const img=new Image();img.src='data:image/png;base64,'+b64;await img.decode();const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const image=ctx.getImageData(0,0,img.width,img.height);let edge=0;
    for(let i=0;i<image.data.length;i+=4)if(image.data[i]===230&&image.data[i+1]===93&&image.data[i+2]===23&&image.data[i+3]===255)edge++;
    // Use a consistent scanner probe size, independent of the PNG export size.
    const probe=document.createElement('canvas');probe.width=probe.height=512;const scanner=probe.getContext('2d');scanner.imageSmoothingEnabled=false;scanner.drawImage(img,0,0,512,512);
    const sample=scanner.getImageData(0,0,512,512);
    return {decoded:jsQR(sample.data,512,512,{inversionAttempts:'attemptBoth'})?.data,edge};
  },files.png.toString('base64'));
  expect(result.decoded).toBe('https://example.test/qr-layout');expect(result.edge).toBeGreaterThan(10);
});
