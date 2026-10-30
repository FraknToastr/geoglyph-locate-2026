const {test,expect}=require('./studio-fixture.cjs');
test.beforeEach(async({page})=>{
 await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphUi&&document.querySelector('#symbolInlinePicker input'));
 await page.locator('.workflow-nav [data-workflow="symbol"]').click();
 await page.evaluate(()=>document.getElementById('closeDrawerBtn').click());
});
test('Symbol panels split evenly and group the enlarged joystick beneath its heading',async({page})=>{
 for(const width of [1440,390])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:1100});await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
  const layout=await page.evaluate(()=>{
   const rect=n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
   return {modules:[...document.querySelectorAll('#sharedColourModule .studio-module-split,#symbolControlModule .studio-module-split')].map(n=>[...n.children].map(rect)),pad:rect(document.querySelector('.dpad')),home:rect(document.querySelector('.dpad-wrap')),heading:rect(document.querySelector('.dpad-wrap>.control-label')),support:rect(document.querySelector('.dpad-wrap>div:not(.dpad)')),tools:['offsetTargetBar','offsetStepBar'].every(id=>!!document.getElementById(id).closest('.joystick-home')),presets:!!document.querySelector('.palette-presets').closest('.colour-picker-home')};
  });
  for(const [left,right] of layout.modules){expect(left.w).toBeCloseTo(right.w,0);expect(right.x).toBeGreaterThan(left.x+left.w);}
  expect(layout.pad.w).toBeGreaterThan(120);expect(layout.pad.w).toBeLessThanOrEqual(230);
  expect(layout.pad.x+layout.pad.w/2).toBeCloseTo(layout.home.x+layout.home.w/2,0);
  expect(layout.pad.y-layout.heading.y-layout.heading.h).toBeCloseTo(10,0);expect(layout.support.y-layout.pad.y-layout.pad.h).toBeCloseTo(10,0);
  expect(layout.tools&&layout.presets).toBe(true);await expect(page.locator('#symbolInlinePicker .inline-picker-sv')).toBeVisible();
 }
 await expect(page.locator('[data-recent-context]')).toHaveCount(0);
 await page.locator('[data-collapse-module="sharedColourModule"]').click();await expect(page.locator('#symbolInlinePicker')).toBeHidden();
 await page.locator('[data-collapse-module="sharedColourModule"]').click();await expect(page.locator('#symbolInlinePicker')).toBeVisible();
});
async function red(page){
 await page.getByRole('slider',{name:'Colour hue',exact:true}).focus();await page.keyboard.press('Home');
 await page.getByRole('slider',{name:'Colour saturation',exact:true}).focus();await page.keyboard.press('End');
 await page.getByRole('slider',{name:'Colour brightness',exact:true}).focus();await page.keyboard.press('End');
}
test('inline colour picker supports pointer and keyboard updates without altering other targets',async({page})=>{
 await page.locator('[data-colour-target="symbol"]').click();
 const before=await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbolBg);
 const original=await page.locator('#fgHex').inputValue();
 const plane=page.locator('#symbolInlinePicker .inline-picker-sv');await plane.scrollIntoViewIfNeeded();const r=await plane.boundingBox();
 await page.mouse.move(r.x+r.width-1,r.y+1);await page.mouse.down();await page.mouse.move(r.x+r.width+10,r.y+r.height+10,{steps:5});await page.mouse.up();
 await expect(page.locator('#fgHex')).toHaveValue('#000000');
 await page.locator('#v1512Undo').click();await expect(page.locator('#fgHex')).toHaveValue(original);
 await page.locator('#v1512Redo').click();await expect(page.locator('#fgHex')).toHaveValue('#000000');
 await red(page);await expect(page.locator('#fgHex')).toHaveValue('#FF0000');
 expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbol.solid)).toBe('#FF0000');
 expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbolBg)).toEqual(before);
 await page.locator('.colour-picker-home [data-palette="#76AEFE"]').click();await expect(page.locator('#fgHex')).toHaveValue('#76AEFE');
 await page.locator('#fgHex').fill('abc');await page.locator('#fgHex').press('Tab');await expect(page.locator('#fgHex')).toHaveValue('#AABBCC');
});
test('inline picker edits the selected gradient stop and follows presets and hex edits',async({page})=>{
 await page.locator('[data-colour-target="symbol"]').click();await page.locator('[data-colour-view="gradient"]').click();
 const before=await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbol.gradient.colors.slice());
 await page.locator('#gradBColor').click();await expect(page.locator('#symbolInlinePicker .inline-picker-label')).toHaveText('Stop B');
 await red(page);
 const colors=await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbol.gradient.colors.slice());
 expect(colors[1]).toBe('#FF0000');for(const i of [0,2,3])expect(colors[i]).toBe(before[i]);
 expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbol.mode)).toBe('gradient');
 await page.locator('#gradCHex').fill('abc');await page.getByRole('slider',{name:'Colour hue',exact:true}).focus();
 await expect(page.locator('#gradCHex')).toHaveValue('#AABBCC');await expect(page.locator('#symbolInlinePicker .inline-picker-label')).toHaveText('Stop C');
 await page.locator('.colour-picker-home [data-gradient-preset]').first().click();
 expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbol.gradient.colors)).toEqual(['#31A765','#76AEFE','#D2A6FF','#F47D22']);
});
test('joystick target and step buttons continue to move and reset the correct layers',async({page})=>{
 await page.locator('[data-offset-target="background"]').click();await page.locator('[data-offset-step="5"]').click();await page.locator('[data-move="1,0"]').click();
 expect(await page.evaluate(()=>GeoGlyphStudio.state.bgOffset)).toEqual({x:5,y:0});
 await page.locator('[data-offset-step="1"]').click();await page.locator('[data-move="0,-1"]').click();
 expect(await page.evaluate(()=>GeoGlyphStudio.state.bgOffset)).toEqual({x:5,y:-1});
 await page.locator('[data-offset-target="symbol"]').click();await page.locator('[data-move="-1,0"]').click();
 expect(await page.evaluate(()=>GeoGlyphStudio.state.symbolOffset)).toEqual({x:-1,y:0});
 await page.locator('#centerOffsetsBtn').click();expect(await page.evaluate(()=>[GeoGlyphStudio.state.symbolOffset,GeoGlyphStudio.state.bgOffset])).toEqual([{x:0,y:0},{x:0,y:0}]);
});

test('expanded gradient and symbol sections fit desktop heights without internal scrolling',async({page})=>{
 await page.locator('[data-colour-view="gradient"]').click();
 for(const [width,height] of [[1440,820],[1440,900],[1440,1000],[1920,1080],[2560,1080]]){
  await page.setViewportSize({width,height});
  for(const theme of ['dark','light']){
   await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
   const size=await page.locator('.right-panel>.panel-body').evaluate(n=>({client:n.clientHeight,scroll:n.scrollHeight}));
   expect(size.scroll).toBeLessThanOrEqual(size.client+1);
   const heights=await page.locator('#sharedColourModule,#symbolControlModule').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().height));expect(heights[0]).toBeCloseTo(heights[1],0);
   const clearance=await page.evaluate(()=>document.getElementById('sharedColourModule').getBoundingClientRect().bottom-document.querySelector('.gradient-position-grid').getBoundingClientRect().bottom);expect(clearance).toBeGreaterThanOrEqual(6);
  }
 }
});

test('RGB HEX and HSL picker inputs edit and follow the selected colour',async({page})=>{
 await page.locator('[data-colour-target="symbol"]').click();
 const picker=page.locator('#symbolInlinePicker'),format=picker.getByRole('combobox',{name:'Colour input format'});
 await expect(format).toHaveValue('rgb');
 for(const [name,value] of [['Red','255'],['Green','0'],['Blue','0']])await picker.getByRole('spinbutton',{name,exact:true}).fill(value);
 await expect(page.locator('#fgHex')).toHaveValue('#FF0000');
 await format.selectOption('hex');await expect(picker.getByRole('textbox',{name:'Hex colour',exact:true})).toHaveValue('#FF0000');
 await picker.getByRole('textbox',{name:'Hex colour',exact:true}).fill('#abc');await picker.getByRole('textbox',{name:'Hex colour',exact:true}).press('Enter');await expect(page.locator('#fgHex')).toHaveValue('#AABBCC');
 await format.selectOption('hsl');
 for(const [name,value] of [['Hue degrees','120'],['Saturation percent','100'],['Lightness percent','50']])await picker.getByRole('spinbutton',{name,exact:true}).fill(value);
 await expect(page.locator('#fgHex')).toHaveValue('#00FF00');
 await format.selectOption('rgb');await expect(picker.getByRole('spinbutton',{name:'Green',exact:true})).toHaveValue('255');
 await page.locator('[data-colour-view="gradient"]').click();await page.locator('#gradBColor').click();
 await format.selectOption('hex');await picker.getByRole('textbox',{name:'Hex colour',exact:true}).fill('#112233');await picker.getByRole('textbox',{name:'Hex colour',exact:true}).press('Enter');
 expect(await page.evaluate(()=>GeoGlyphStudio.state.colourTargets.symbol.gradient.colors[1])).toBe('#112233');
});
