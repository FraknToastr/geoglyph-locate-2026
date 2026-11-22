const {test,expect}=require('./studio-fixture.cjs');
async function open(page){
 const tile=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');x.fillStyle='#24bc68';x.fillRect(0,0,16,16);return c.toDataURL().split(',')[1];});
 await page.route('**/MapServer/tile/**',r=>r.fulfill({body:Buffer.from(tile,'base64'),contentType:'image/png'}));
 await page.goto('/');await page.waitForFunction(()=>window.GeoGlyphMapEngine);
 await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
 await page.waitForFunction(()=>{const s=GeoGlyphMapEngine.state;return s.initialFitStatus!=='pending'&&!s.pendingBuild&&!s.rebuilding&&!s.map.isMoving();});
}
test('ground raster covers elevated tilted cameras across bearings and wide exports',async({page})=>{
 test.setTimeout(90_000);await open(page);
 await page.evaluate(()=>{
  const m=GeoGlyphMapEngine.state.map;
  for(const layer of m.getStyle().layers)if(layer.type!=='background'&&layer.type!=='raster')m.setLayoutProperty(layer.id,'visibility','none');
  m.setPaintProperty('background','background-color','#ff00ff');
 });
 for(const [width,height] of [[1440,1000],[1914,923]]){
  await page.setViewportSize({width,height});
  for(const bearing of [0,90,180,270]){
   await page.evaluate(bearing=>{const m=GeoGlyphMapEngine.state.map;m.setCenterClampedToGround(false);m.jumpTo({zoom:bearing===180?12:13,pitch:60,bearing,elevation:450});m.resize();},bearing);
   await page.evaluate(()=>new Promise(resolve=>{const m=GeoGlyphMapEngine.state.map;m.once("idle",resolve);m.triggerRepaint();}));
   const pixels=await page.evaluate(()=>new Promise(resolve=>{
    const m=GeoGlyphMapEngine.state.map;
    m.once('render',()=>{
     const canvas=m.getCanvas(),gl=canvas.getContext('webgl2')||canvas.getContext('webgl');
     const data=new Uint8Array(gl.drawingBufferWidth*gl.drawingBufferHeight*4);gl.readPixels(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,data);
     let holes=0,green=0;for(let i=0;i<data.length;i+=4){if(data[i]===255&&data[i+1]===0&&data[i+2]===255||data[i+3]===0)holes++;if(data[i+1]>data[i]+50&&data[i+1]>data[i+2]+30)green++;}
     resolve({holes,green,total:data.length/4,png:canvas.toDataURL('image/png').length,jpg:canvas.toDataURL('image/jpeg').length});
    });m.triggerRepaint();
   }));
   expect(pixels.holes).toBe(0);expect(pixels.green/pixels.total).toBeGreaterThan(.99);expect(pixels.png).toBeGreaterThan(1000);expect(pixels.jpg).toBeGreaterThan(1000);
  }
 }
});
test('mini header buttons are orange with panel-coloured gaps in both themes',async({page})=>{
 await open(page);await page.locator('#mapEditorCollapseBtn').click();await page.mouse.move(0,0);
 for(const theme of ['dark','light'])for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  const styles=await page.locator('.map-editor-head :is(.map-collapsed-action,.map-editor-collapse)').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().width).map(n=>{const s=getComputedStyle(n);return {id:n.id,bg:s.backgroundColor,border:s.borderTopColor};}));
  expect(styles).toHaveLength(4);for(const s of styles){expect(s.bg).toBe('rgb(244, 125, 34)');expect(s.border).toBe('rgba(0, 0, 0, 0)');}
  for(const selector of ['.map-editor-title-row','.map-editor-head-actions','.map-collapsed-actions'])await expect(page.locator(selector)).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
  await expect(page.locator('#geoglyphMapEditor')).toHaveCSS('height','138px');
  await expect(page.locator('.map-editor-head-actions')).toHaveCSS('gap','4px');
  await expect(page.locator('.map-collapsed-actions')).toHaveCSS('gap','4px');
 }
 await page.locator('#mapCollapsedFitBtn').focus();await expect(page.locator('#mapCollapsedFitBtn')).toBeFocused();
});
