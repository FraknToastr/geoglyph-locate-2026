const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs');
const sans='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf';
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const bytes=file=>fs.readFileSync(file).toString('base64');
async function settled(page){await page.waitForFunction(()=>{
  const s=GeoGlyphMapEngine.state,a=GeoGlyph3D.stats().animation;
  return !s.pendingBuild&&!s.rebuilding&&!s.explicitFitPending&&!s.randomSearching&&a.phase!=='framing'&&(!s.map.isMoving()||a.orbiting);
});}
async function open(page,importFont=true){
  test.skip(!fs.existsSync(sans)||!fs.existsSync(serif),'Optional installed DejaVu fixtures unavailable');
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');await page.waitForFunction(()=>window.GeoGlyph3D&&document.getElementById('mapQuickRandom'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);await settled(page);
  if(importFont){
    await page.evaluate(async data=>{
      const s=GeoGlyphMapEngine.state;s.mode='message';s.message='AB BA';
      await GeoGlyphMapEngine.importFonts([new File([Uint8Array.from(atob(data),c=>c.charCodeAt(0))],'map-fix-sans.ttf',{lastModified:1})],'file');
      GeoGlyphMapEngine.refreshControls();
    },bytes(sans));await settled(page);
  }
}
async function enable3D(page){await page.locator('#map3DEnabled').check();await page.waitForFunction(()=>GeoGlyph3D.isVisible());await settled(page);}
const difference=(a,b)=>Math.abs(((a-b+540)%360)-180);

test('Random resolves catalogue aliases from granted local descriptors while the model keeps orbiting',async({page})=>{
  test.skip(!fs.existsSync(sans)||!fs.existsSync(serif),'Optional installed DejaVu fixtures unavailable');
  await page.addInitScript(data=>{
    window.mapFixQueryCalls=0;
    window.queryLocalFonts=async()=>{
      window.mapFixQueryCalls++;
      const host=GeoGlyphStudio.state.fonts.find(f=>f.id===GeoGlyphStudio.state.selectedFontId);
      return [host.name,'Consolas'].map((name,index)=>({fullName:name,family:name,postscriptName:'MapFix'+index,style:'Regular',blob:async()=>new Blob([Uint8Array.from(atob(data[index]),c=>c.charCodeAt(0))])}));
    };
  },[bytes(sans),bytes(serif)]);
  await open(page,false);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.localFontDescriptors.length)).toBe(2);
  await enable3D(page);await page.locator('#mapEditorCollapseBtn').click();await page.locator('#mapQuickOrbit').click();
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
  const before=await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;window.mapFixLayer=s.map.getLayer('geoglyph-extruded-font').implementation;return {font:s.displayedFontId,anchor:{...s.anchor},code:s.selectedCode,frames:GeoGlyph3D.stats().animation.frames};});
  await page.locator('#mapQuickRandom').click();
  await page.waitForFunction(id=>GeoGlyphMapEngine.state.displayedFontId!==id,before.font);await settled(page);
  const after=await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;return {name:s.fontRecords.get(s.displayedFontId).name,queries:mapFixQueryCalls,anchor:{...s.anchor},code:s.selectedCode,animation:GeoGlyph3D.stats().animation,sameLayer:s.map.getLayer('geoglyph-extruded-font').implementation===mapFixLayer};});
  expect(after.name).toBe('Consolas');expect(after.queries).toBe(1);expect(after.sameLayer).toBe(true);
  expect(after.anchor).toEqual(before.anchor);expect(after.code).toBe(before.code);expect(after.animation.orbiting).toBe(true);expect(after.animation.frames).toBeGreaterThan(before.frames);
});

test('Random reaches a compatible font beyond eight incompatible entries',async({page})=>{
  await open(page);
  await page.evaluate(data=>{
    const s=GeoGlyphMapEngine.state;
    for(const id of s.fontRecords.keys())if(id!==s.displayedFontId)s.fontRecords.delete(id);
    for(let i=0;i<9;i++){
      const id='map-fix-invalid-'+i;
      s.fontRecords.set(id,{id,source:'file',name:id,family:id,file:new File([new Uint8Array([0,1,2,3])],id+'.ttf',{lastModified:i+1})});
    }
    s.fontRecords.set('map-fix-compatible',{id:'map-fix-compatible',source:'file',name:'Compatible serif',family:'Compatible serif',file:new File([Uint8Array.from(atob(data),c=>c.charCodeAt(0))],'compatible-serif.ttf',{lastModified:20})});
    // Keep the shuffled order deterministic so the compatible font is ninth+.
  },bytes(serif));
  expect(await page.evaluate(()=>{
    const random=Math.random;
    try{
      // Fix the synchronous shuffle only. Worker request identifiers still
      // need normal randomness while candidates draw and reach a map frame.
      Math.random=()=>.999999;
      return GeoGlyphMapEngine.randomFont();
    }finally{Math.random=random;}
  })).toBe(true);
  await settled(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.displayedFontId)).toBe('map-fix-compatible');
  await expect(page.locator('#mapQuickRandom')).toHaveAttribute('aria-busy','false');
});

test('leaving Map cancels a Random search that is still reading a font',async({page})=>{
  await open(page);
  const selected=await page.evaluate(()=>GeoGlyphMapEngine.state.selectedFontId);
  await page.evaluate(data=>{
    const s=GeoGlyphMapEngine.state,buffer=Uint8Array.from(atob(data),c=>c.charCodeAt(0)).buffer;
    for(const id of s.fontRecords.keys())if(id!==s.displayedFontId)s.fontRecords.delete(id);
    const id='map-fix-delayed-random';
    s.fontRecords.set(id,{id,source:'file',name:'Delayed random serif',family:'Delayed random serif',file:{name:'delayed-random-serif.ttf',size:buffer.byteLength,lastModified:100,arrayBuffer:()=>new Promise(resolve=>{window.mapFixReleaseRandom=()=>resolve(buffer);})}});
    window.mapFixRandomResult=GeoGlyphMapEngine.randomFont();
  },bytes(serif));
  await page.waitForFunction(()=>typeof mapFixReleaseRandom==='function');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.randomSearching)).toBe(true);
  await page.evaluate(()=>GeoGlyphMapEngine.showCanvas());
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.randomSearching)).toBe(false);
  expect(await page.evaluate(async()=>{mapFixReleaseRandom();return await mapFixRandomResult;})).toBe(false);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.selectedFontId)).toBe(selected);
  await expect(page.locator('#mapQuickRandom')).toHaveAttribute('aria-busy','false');
});

test('mini panel keeps two fixed rows and equal buffers through feedback and model changes',async({page})=>{
  await open(page);await page.locator('#mapEditorCollapseBtn').click();
  await expect(page.locator('#mapEngineFontMeta')).toHaveCount(0);
  await expect(page.locator('.map-editor-head #mapEngineStatus')).toHaveCount(0);
  for(const [width,height] of [[1440,1000],[390,844]]){
    await page.setViewportSize({width,height});
    for(const theme of ['dark','light']){
      await page.locator(theme==='dark'?'#themeDarkBtn':'#themeLightBtn').click();
      const measure=()=>page.locator('#geoglyphMapEditor').evaluate(panel=>{
        const p=panel.getBoundingClientRect(),head=panel.querySelector('.map-editor-title-row').getBoundingClientRect(),row=panel.querySelector('.map-displayed-font').getBoundingClientRect();
        return {width:p.width,height:p.height,insets:[row.left-p.left,p.right-row.right,head.top-p.top,p.bottom-row.bottom]};
      });
      const baseline=await measure();expect(baseline.height).toBe(138);
      for(const inset of baseline.insets)expect(inset).toBeCloseTo(11,0);
      await page.evaluate(()=>GeoGlyph3D.preparing('a font with a very long name '.repeat(12)));
      expect(await measure()).toEqual(baseline);
      await expect(page.locator('#mapQuickStatus')).toBeVisible();
      expect(await page.locator('#mapQuickStatus').evaluate(node=>!!node.closest('#geoglyphMapEditor'))).toBe(false);
      await page.evaluate(()=>GeoGlyph3D.notice('No compatible font is available. '.repeat(6)));
      expect(await measure()).toEqual(baseline);
      await page.locator('#mapQuickModel').click();await settled(page);
      expect(await measure()).toEqual(baseline);
    }
  }
});

test('every 3D Fit restores a readable framed view and 2D Fit restores a top-down view',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
  await page.evaluate(()=>{GeoGlyphMapEngine.state.bearing=32;GeoGlyphMapEngine.queueRebuild(false);});await settled(page);await enable3D(page);
  const anchor=await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}));
  const badView=()=>page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.map.jumpTo({center:[s.anchor.lng+.01,s.anchor.lat+.01],bearing:-140,pitch:80,zoom:14});});
  const check3D=async()=>{
    await settled(page);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const result=await page.evaluate(()=>{
      const s=GeoGlyphMapEngine.state,l=s.map.getLayer('geoglyph-extruded-font').implementation,b=GeoGlyph3D.getBounds(),points=[];
      const mul=(matrix,v)=>[0,1,2,3].map(i=>v.reduce((sum,x,j)=>sum+matrix[j*4+i]*x,0));
      for(const x of [b.minX,b.maxX])for(const y of [b.minY,b.maxY])for(const z of [b.minZ,b.maxZ]){
        const v=mul(l.camera.projectionMatrix.elements,mul(l.group.matrix.elements,[x,y,z,1]));points.push([v[0]/v[3],v[1]/v[3],v[3]]);
      }
      return {pitch:s.map.getPitch(),bearing:s.map.getBearing(),anchor:{...s.anchor},savedBearing:s.bearing,points,orbiting:GeoGlyph3D.stats().animation.orbiting};
    });
    expect(result.pitch).toBeCloseTo(55);expect(difference(result.bearing,57)).toBeLessThan(.001);
    expect(result.anchor).toEqual(anchor);expect(result.savedBearing).toBe(32);expect(result.orbiting).toBe(false);
    for(const [x,y,w] of result.points){expect(w).toBeGreaterThan(0);expect(Math.abs(x)).toBeLessThan(.99);expect(Math.abs(y)).toBeLessThan(.99);}
  };
  for(const button of ['#mapFitBtn','#map3DView']){await badView();await page.locator(button).click();await check3D();}
  await page.locator('#mapEditorCollapseBtn').click();await badView();await page.locator('#mapCollapsedFitBtn').click();await check3D();
  for(const mode of ['fixed','yaw','billboard']){
    await page.evaluate(mode=>{GeoGlyphMapEngine.state.orientationMode=mode;},mode);await badView();
    await page.evaluate(()=>GeoGlyphMapEngine.fit());await check3D();
  }
  await badView();await page.evaluate(()=>GeoGlyph3D.fit());await check3D();
  const deferred=await page.evaluate(()=>{document.getElementById('mapQuickModel').click();GeoGlyphMapEngine.fit();return GeoGlyphMapEngine.state.explicitFitPending;});
  expect(deferred).toBe(true);await settled(page);
  const flat=await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;return {pitch:s.map.getPitch(),bearing:s.map.getBearing(),elevation:s.map.getCenterElevation(),anchor:{...s.anchor}};});
  expect(flat.pitch).toBe(0);expect(difference(flat.bearing,32)).toBeLessThan(.001);expect(flat.elevation).toBe(0);expect(flat.anchor).toEqual(anchor);
  expect(await page.evaluate(()=>{document.getElementById('mapQuickModel').click();GeoGlyphMapEngine.fit();return GeoGlyphMapEngine.state.explicitFitPending;})).toBe(true);await check3D();
  expect(errors).toEqual([]);
});

test('Map model presets are vivid and preserve Canvas presets and panel accents',async({page})=>{
  await open(page);
  const before=await page.evaluate(()=>({canvas:[...document.querySelectorAll('[data-palette]')].map(n=>n.dataset.palette),accent:getComputedStyle(document.getElementById('geoglyphMapEditor')).getPropertyValue('--map-orange'),fill:GeoGlyphMapEngine.state.fill}));
  const presets=page.locator('[data-map-palette] .studio-swatch-list button');
  expect(await presets.evaluateAll(nodes=>nodes.map(n=>n.dataset.colour))).toEqual(['#F1F5F6','#3FDE78','#F47D22','#429EFF','#B978FF','#FFDF3A','#FF6288','#0D0D0B']);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.fill)).toBe(before.fill);
  await page.locator('[data-map-colour-target="mapFill"]').click();await presets.nth(1).click();
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.fill.toUpperCase())).toBe('#3FDE78');
  await page.locator('[data-map-colour-target="mapOutline"]').click();await presets.nth(3).click();
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.outline.toUpperCase())).toBe('#429EFF');
  const after=await page.evaluate(()=>({canvas:[...document.querySelectorAll('[data-palette]')].map(n=>n.dataset.palette),accent:getComputedStyle(document.getElementById('geoglyphMapEditor')).getPropertyValue('--map-orange'),saved:GeoGlyphUi.collectMapSettings()}));
  expect(after.canvas).toEqual(before.canvas);expect(after.accent).toBe(before.accent);expect(after.saved.fill.toUpperCase()).toBe('#3FDE78');expect(after.saved.outline.toUpperCase()).toBe('#429EFF');
});
