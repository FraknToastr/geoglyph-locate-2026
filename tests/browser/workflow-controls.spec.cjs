const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs/promises');

async function open(page,workflow='qr'){
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphControls&&document.querySelector('#studioControls .controls-bulk')&&document.querySelector('#symbolInlinePicker input'));
  await page.locator(`.workflow-nav [data-workflow="${workflow}"]`).click();
  await page.evaluate(()=>document.getElementById('closeDrawerBtn').click());
}
const expand=scope=>scope.getByRole('button',{name:'Expand all sections',exact:true});
const collapse=scope=>scope.getByRole('button',{name:'Collapse all sections',exact:true});
async function editHex(page,value){
  const picker=page.locator('#symbolInlinePicker');
  await picker.getByRole('combobox',{name:'Colour input format'}).selectOption('hex');
  await picker.getByRole('textbox',{name:'Hex colour',exact:true}).fill(value);
  await picker.getByRole('textbox',{name:'Hex colour',exact:true}).press('Tab');
}

test('QR correction precedes content while the centred count and divider remain below the input',async({page})=>{
  await open(page);
  await expect(page.locator('#qrPixelModeLabel')).toHaveText('QR Pixel Mode');
  await expect(page.locator('#qrCorrectionSettings>.control-label')).toHaveText('Correction (Changes the QR character limit)');
  await expect(page.locator('.qr-limit-help')).toHaveCount(0);
  await page.locator('#qrInput').fill('ABC😀');
  for(const [level,limit] of [['L',2953],['M',2331],['Q',1663],['H',1273]]){
    await page.locator(`[data-qr-level="${level}"]`).click();
    await expect(page.locator('#qrCharacterStats')).toHaveText(`4/${limit} characters used`);
  }
  for(const width of [1440,390])for(const theme of ['dark','light']){
    await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
    const layout=await page.evaluate(()=>{
      const rect=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,bottom:r.bottom}};
      const content=document.getElementById('qrContentPanel');
      return {input:rect(document.getElementById('qrInput')),fields:rect(content.querySelector('.qr-content-fields')),count:rect(document.getElementById('qrCharacterStats')),divider:rect(content.querySelector('.studio-divider')),correction:rect(document.getElementById('qrCorrectionSettings')),edge:rect(content.querySelector('.qr-buffer-edge-home')),overflow:content.scrollWidth-content.clientWidth,progress:!!content.querySelector('.v1512-capacity-track')};
    });
    expect(layout.count.y).toBeGreaterThanOrEqual(layout.input.bottom);
    expect(layout.count.x+layout.count.w/2).toBeCloseTo(layout.input.x+layout.input.w/2,0);
    expect(layout.divider.y-layout.count.bottom).toBeGreaterThanOrEqual(16);
    expect(layout.fields.y-layout.correction.bottom).toBeGreaterThanOrEqual(16);
    expect(layout.edge.y-layout.divider.bottom).toBeGreaterThanOrEqual(16);expect(layout.overflow).toBeLessThanOrEqual(1);expect(layout.progress).toBe(true);
  }
  await page.locator('#qrInput').fill('A'.repeat(1274));
  await expect(page.locator('#qrCharacterStats')).toHaveText('1274/1273 characters used · 1 character over limit');
  await expect(page.locator('#qrCharacterStats')).toHaveClass(/qr-error/);
  await page.locator('#clearContentBtn').click();await expect(page.locator('#qrCharacterStats')).toHaveText('0/1273 characters used');
  await expect(page.locator('#qrCharacterStats')).not.toHaveClass(/qr-error/);
});

test('Magic Eye keeps all colour controls right, other controls left and its editor fully functional',async({page})=>{
  await open(page,'magic-eye');
  await expect(page.locator('#qrPixelModeLabel')).toHaveText('QR Pixel Mode');
  await expect(page.locator('#symbolInlinePicker')).toBeVisible();
  for(const width of [1440,390])for(const theme of ['dark','light']){
    await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
    const layout=await page.evaluate(()=>{
      const box=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,overflow:node.scrollWidth-node.clientWidth};};
      return {left:box(document.getElementById('qrControlModule')),right:box(document.getElementById('sharedColourModule')),picker:box(document.getElementById('symbolInlinePicker')),allColours:['colourSwitch','colourTargetBar','symbolInlinePicker','gradientDirection','gradientStopB'].every(id=>!!document.getElementById(id).closest('#sharedColourModule')),other:['qrModes','magicEyeBlur'].every(id=>!!document.getElementById(id).closest('#qrControlModule'))};
    });
    expect(layout.left.w).toBeCloseTo(layout.right.w,0);expect(layout.right.x).toBeGreaterThan(layout.left.x+layout.left.w);expect(layout.right.y).toBeCloseTo(layout.left.y,0);
    expect(layout.left.overflow).toBeLessThanOrEqual(1);expect(layout.right.overflow).toBeLessThanOrEqual(1);expect(layout.allColours&&layout.other).toBe(true);
  }
  await page.setViewportSize({width:1440,height:1100});
  await page.locator('[data-colour-target="qrFg"]').click();await page.locator('[data-colour-view="gradient"]').click();
  await page.locator('#gradBColor').click();await expect(page.locator('#symbolInlinePicker .inline-picker-label')).toHaveText('Stop B');
  await editHex(page,'#123456');expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.qrFg.gradient.colors[1])).toBe('#123456');
  await page.locator('#magicEyeBlur').fill('2');await expect(page.locator('#magicEyeBlurValue')).toHaveText('2 px');
  await page.locator('[data-qr-mode="rounded"]').click();await expect(page.locator('.v1512-scan-warning')).toBeVisible();
  const paint=await page.evaluate(()=>JSON.stringify(GeoGlyphStudio.state.colourTargets));
  await page.locator('#magicEyeRandomColourBtn').click();expect(await page.evaluate(()=>JSON.stringify(GeoGlyphStudio.state.colourTargets))).not.toBe(paint);
  await page.locator('#magicEyeFullscreenBtn').click();await expect(page.locator('#magicEyeFullscreen')).toBeVisible();
  await page.locator('#closeMagicEyeFullscreen').click();await expect(page.locator('#magicEyeFullscreen')).toBeHidden();
  await page.locator('.header-export-btn').click();const pending=page.waitForEvent('download');await page.locator('#exportQrPngBtn').click();
  const file=await pending;expect((await fs.readFile(await file.path())).subarray(1,4).toString()).toBe('PNG');
});

test('scan reliability occupies one compact full-width preview footer across workflows',async({page})=>{
  await open(page);
  const warning=page.locator('.preview-panel>.v1512-scan-warning');
  await page.locator('[data-qr-mode="rounded"]').click();
  await expect(warning).toBeVisible();
  await expect(page.locator('#studioControls .v1512-scan-warning')).toHaveCount(0);
  for(const mode of ['qr','magic-eye']){
    await page.locator(`.workflow-nav [data-workflow="${mode}"]`).click();
    await expect(page.locator('#qrPixelModeLabel')).toHaveText('QR Pixel Mode');
    if(mode==='magic-eye')await page.locator('#magicEyeBlur').fill('2');
    for(const width of [1440,390])for(const theme of ['dark','light']){
      await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
      const layout=await warning.evaluate(node=>{
        const panel=node.parentElement,body=panel.querySelector(':scope>.panel-body'),r=node.getBoundingClientRect(),p=panel.getBoundingClientRect(),b=body.getBoundingClientRect(),s=getComputedStyle(node);
        return {width:r.width,panelWidth:panel.clientWidth,y:r.top,bottom:r.bottom,bodyBottom:b.bottom,panelBottom:p.bottom-parseFloat(getComputedStyle(panel).borderBottomWidth),height:r.height,whiteSpace:s.whiteSpace,lines:(node.clientHeight-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom))/parseFloat(s.lineHeight),overflow:panel.scrollWidth-panel.clientWidth};
      });
      expect(layout.width).toBeCloseTo(layout.panelWidth,0);expect(layout.y).toBeCloseTo(layout.bodyBottom,0);expect(layout.bottom).toBeCloseTo(layout.panelBottom,0);
      expect(layout.height).toBeLessThanOrEqual(26);expect(layout.whiteSpace).toBe('nowrap');expect(layout.lines).toBeCloseTo(1,0);expect(layout.overflow).toBeLessThanOrEqual(1);
    }
    await collapse(page.locator('#studioControls')).click();await expect(warning).toBeVisible();await expand(page.locator('#studioControls')).click();
  }
  await warning.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');await expect(warning).toBeFocused();
  await expect(page.locator('#uosHoverTip')).toContainText('Scan reliability may be reduced by blur, non-square modules. Test the finished QR before publishing.');
  for(const mode of ['symbol','qreverse']){await page.locator(`.workflow-nav [data-workflow="${mode}"]`).click();await expect(warning).toBeHidden();}
  await page.locator('.workflow-nav [data-workflow="qr"]').click();await expect(warning).toBeVisible();
  await page.route('**/MapServer/tile/**',route=>route.abort());
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());await expect(page.locator('body')).toHaveClass(/geoglyph-map-preview/);await expect(warning).toBeHidden();
});

test('bulk collapse is local to each workflow, keeps headings and restores preferences',async({page})=>{
  await open(page,'symbol');
  const studio=page.locator('#studioControls');
  await expect(expand(studio)).toBeDisabled();await collapse(studio).click();
  for(const id of ['sharedColourModule','symbolControlModule'])await expect(page.locator(`[data-collapse-module="${id}"]`)).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#sharedColourModule .module-head')).toBeVisible();await expect(page.locator('#symbolInlinePicker')).toBeHidden();
  await expect(collapse(studio)).toBeDisabled();
  await page.locator('.workflow-nav [data-workflow="qr"]').click();await expect(expand(studio)).toBeDisabled();
  await page.locator('[data-collapse-module="sharedColourModule"]').click();await expect(expand(studio)).toBeEnabled();await expect(collapse(studio)).toBeEnabled();
  await page.locator('.workflow-nav [data-workflow="magic-eye"]').click();await expect(page.locator('#symbolInlinePicker')).toBeVisible();
  await collapse(studio).click();await expect(page.locator('#qrModes')).toBeHidden();await expect(page.locator('#symbolInlinePicker')).toBeHidden();
  await page.locator('.workflow-nav [data-workflow="qr"]').click();
  await expect(page.locator('#qrInput')).toBeVisible();await expect(page.locator('#symbolInlinePicker')).toBeHidden();
  await page.locator('.workflow-nav [data-workflow="symbol"]').click();await expect(page.locator('#symbolControlModule .dpad')).toBeHidden();
  await page.locator('.workflow-nav [data-workflow="qr"]').click();
  await page.reload();await page.waitForFunction(()=>document.querySelector('#studioControls .controls-bulk'));
  await page.locator('.workflow-nav [data-workflow="qr"]').click();await page.evaluate(()=>document.getElementById('closeDrawerBtn').click());
  await expect(page.locator('#qrInput')).toBeVisible();await expect(page.locator('#symbolInlinePicker')).toBeHidden();
  await expand(studio).click();await expect(page.locator('#symbolInlinePicker')).toBeVisible();
  const order=await page.locator('#studioControls>.panel-body').evaluate(node=>[...node.children].filter(n=>n.getClientRects().length).map(n=>n.id));
  expect(order).toEqual(['qrControlModule','sharedColourModule','symbolControlModule']);
  await expect(page.locator('#explorerDrawer .controls-bulk')).toHaveCount(0);
  await page.locator('.workflow-nav [data-workflow="qreverse"]').click();const scan=page.locator('#qreverseWorkspace');
  await expect(scan.locator(':scope>.controls-head .panel-title')).toHaveText('Controls · Scan QR');
  await collapse(scan).click();await expect(page.locator('.qreverse-controls')).toBeHidden();await expect(page.locator('.qreverse-table-wrap')).toBeHidden();
  await expect(page.locator('#qreverseResetModuleBtn')).toBeVisible();await expect(page.locator('#scanResultsPanel .panel-head')).toBeVisible();
  await expand(scan).click();await expect(page.locator('.qreverse-controls')).toBeVisible();
});

test('Scan QR clear retains inputs and module reset restores defaults, including missing attachments',async({page})=>{
  await open(page,'qreverse');
  const png=await page.evaluate(async()=>{const canvas=document.createElement('canvas');await GeoGlyphStudio.drawQrToCanvas(canvas,512,false);return canvas.toDataURL().split(',')[1];});
  await page.locator('#qreverseImageInput').setInputFiles({name:'codes.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
  const chooser=page.waitForEvent('filechooser');await page.locator('.csv-import-menu>summary').click();await page.locator('[data-csv-header="yes"]').click();
  await (await chooser).setFiles({name:'values.csv',mimeType:'text/csv',buffer:Buffer.from('value\nhttps://example.test/csv\n')});
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows.length)).toBe(2);
  await page.evaluate(()=>{
    const q=GeoGlyphStudio.state.qreverse;
    q.rows.push({id:q.nextId++,groupId:'paste',source:'Pasted',value:'https://example.test/paste',selected:false,status:'Processed',error:'',filename:'Pasted values',file:null});
    q.scanner={detect:()=>new Promise(resolve=>{window.finishTestScan=()=>resolve([{rawValue:'image-one'},{rawValue:'image-two'}]);})};
    GeoGlyphStudio.renderQReverse();
  });
  await page.locator('#qreverseStub').fill('custom-name');await page.locator('#v15ScanQueued').click();
  await expect(page.locator('#qreverseResetModuleBtn')).toBeDisabled();await expect(page.locator('#qreverseClearResultsBtn')).toBeDisabled();
  await collapse(page.locator('#qreverseWorkspace')).click();
  await page.waitForFunction(()=>typeof window.finishTestScan==='function');await page.evaluate(()=>window.finishTestScan());
  await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows.length)).toBe(4);
  const before=await page.evaluate(()=>({inputs:GeoGlyphStudio.state.qreverse.rows.filter(row=>row.source!=='Image'),design:{content:document.getElementById('qrInput').value,colours:JSON.stringify(GeoGlyphStudio.state.colourTargets)},scanner:GeoGlyphStudio.state.qreverse.scannerMode}));
  await page.locator('#qreverseClearResultsBtn').click();
  const cleared=await page.evaluate(()=>{const q=GeoGlyphStudio.state.qreverse;return {images:q.rows.filter(row=>row.source==='Image').map(row=>({value:row.value,error:row.error,status:row.status,file:!!row.file})),inputs:q.rows.filter(row=>row.source!=='Image'),stub:q.stub};});
  expect(cleared.images).toEqual([{value:'',error:'',status:'Queued',file:true}]);expect(cleared.inputs).toEqual(before.inputs);expect(cleared.stub).toBe('custom-name');
  await page.evaluate(()=>{const q=GeoGlyphStudio.state.qreverse;const image=q.rows.find(row=>row.source==='Image');image.file=null;image.status='Processed';image.value='restored';GeoGlyphStudio.renderQReverse();});
  await page.locator('#qreverseClearResultsBtn').click();
  expect(await page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows.find(row=>row.source==='Image').status)).toBe('Needs reattachment');
  await page.locator('#qreverseResetModuleBtn').click();
  const reset=await page.evaluate(()=>{const q=GeoGlyphStudio.state.qreverse;return {rows:q.rows,nextId:q.nextId,stub:q.stub,lastDesign:q.lastDesignPreview,scanner:!!q.scanner,scannerMode:q.scannerMode,design:{content:document.getElementById('qrInput').value,colours:JSON.stringify(GeoGlyphStudio.state.colourTargets)}};});
  expect(reset.rows).toEqual([]);expect(reset.nextId).toBe(1);expect(reset.stub).toBe('geoglyph-batch');expect(reset.lastDesign).toBe('combined');expect(reset.scanner).toBe(true);expect(reset.scannerMode).toBe(before.scanner);expect(reset.design).toEqual(before.design);
  await expect(page.locator('#qreverseProgressCount')).toHaveText('0 / 0');await expect(page.locator('#qreverseSummary')).toHaveText('0 rows · 0 selected');
  await expect(page.locator('#qreverseClearResultsBtn')).toBeDisabled();await expand(page.locator('#qreverseWorkspace')).click();
  const empty=page.locator('#qreverseBody .qreverse-empty');await expect(empty).toBeVisible();
  await expect(empty).toContainText('Add Images');await expect(empty).toContainText('Scan queued');await expect(empty).toContainText('reverse the QR codes');
  for(const width of [1440,390])for(const theme of ['dark','light']){
    await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
    const box=await empty.evaluate(node=>({width:node.getBoundingClientRect().width,row:node.parentElement.clientWidth,client:node.clientWidth,scroll:node.scrollWidth,height:node.clientHeight,scrollHeight:node.scrollHeight,wrap:getComputedStyle(node).whiteSpace}));
    expect(box.width).toBeGreaterThanOrEqual(box.row-1);expect(box.scroll).toBeLessThanOrEqual(box.client+1);expect(box.scrollHeight).toBeLessThanOrEqual(box.height+1);expect(box.wrap).toBe('normal');
  }
});

test('Scan QR reset actions cannot race CSV import or batch export',async({page})=>{
  await open(page,'qreverse');
  await page.evaluate(()=>{
    const read=File.prototype.text;
    File.prototype.text=function(){const file=this;return new Promise(resolve=>{window.finishCsvImport=async()=>resolve(await read.call(file));});};
  });
  await page.locator('#qreverseCsvInput').setInputFiles({name:'values.csv',mimeType:'text/csv',buffer:Buffer.from('https://example.test/imported\n')});
  await page.waitForFunction(()=>typeof window.finishCsvImport==='function');
  for(const id of ['qreverseResetModuleBtn','qreverseClearResultsBtn'])await expect(page.locator('#'+id)).toBeDisabled();
  await page.evaluate(()=>document.getElementById('qreverseResetModuleBtn').dispatchEvent(new Event('click',{bubbles:true})));
  expect(await page.evaluate(()=>GeoGlyphStudio.state.qreverse.importing)).toBe(true);
  await page.evaluate(()=>window.finishCsvImport());await expect.poll(()=>page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows.length)).toBe(1);
  await page.evaluate(()=>{const generate=JSZip.prototype.generateAsync;JSZip.prototype.generateAsync=function(...args){return new Promise(resolve=>{window.finishZipExport=async()=>resolve(await generate.apply(this,args));});};GeoGlyphStudio.state.exportSize=512;});
  const pending=page.waitForEvent('download');await page.locator('[data-q-generate="download"]').evaluate(button=>button.click());
  await page.waitForFunction(()=>typeof window.finishZipExport==='function');await expect(page.locator('#qreverseResetModuleBtn')).toBeDisabled();
  await collapse(page.locator('#qreverseWorkspace')).click();await page.evaluate(()=>window.finishZipExport());
  const file=await pending;expect(file.suggestedFilename()).toBe('geoglyph-batch.zip');expect((await fs.readFile(await file.path())).subarray(0,2).toString()).toBe('PK');
  await expect(page.locator('#qreverseResetModuleBtn')).toBeEnabled();await page.locator('#qreverseResetModuleBtn').click();expect(await page.evaluate(()=>GeoGlyphStudio.state.qreverse.rows.length)).toBe(0);
});
