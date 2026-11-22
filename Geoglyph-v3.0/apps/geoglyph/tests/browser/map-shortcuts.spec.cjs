const {test,expect}=require('./studio-fixture.cjs');
const fs=require('node:fs');

const sans='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf';
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const layerId='geoglyph-extruded-font';

async function settled(page){
  await page.waitForFunction(()=>{
    const s=GeoGlyphMapEngine.state;
    const animation=GeoGlyph3D.stats().animation;
    return !s.pendingBuild&&!s.rebuilding&&(!s.map.isMoving()||animation.orbiting)&&animation.phase!=='framing';
  });
}

async function open(page,{fonts=true,model=true}={}){
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphMapEngine&&window.GeoGlyph3D&&document.getElementById('mapQuickRandom'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await settled(page);
  let ids=[];
  if(fonts){
    test.skip(!fs.existsSync(sans)||!fs.existsSync(serif),'Optional installed DejaVu font fixtures unavailable');
    ids=await page.evaluate(async files=>{
      await GeoGlyphMapEngine.importFonts(files.map(({name,bytes})=>new File([Uint8Array.from(atob(bytes),c=>c.charCodeAt(0))],name,{lastModified:1})),'file');
      return files.map(({name})=>[...GeoGlyphMapEngine.state.fontRecords.values()].find(record=>record.file?.name===name).id);
    },[
      {name:'shortcut-sans.ttf',bytes:fs.readFileSync(sans).toString('base64')},
      {name:'shortcut-serif.ttf',bytes:fs.readFileSync(serif).toString('base64')}
    ]);
    await settled(page);
    await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.mode='message';s.message='Glyph 123';GeoGlyphMapEngine.queueRebuild(false);});
    await settled(page);
  }
  if(model){
    await page.locator('#map3DEnabled').check();
    await page.waitForFunction(()=>GeoGlyph3D.isVisible());
    await settled(page);
  }
  await page.locator('#mapEditorCollapseBtn').click();
  await expect(page.locator('.map-motion-actions')).toBeVisible();
  return ids;
}

async function start(page,selector='#mapQuickOrbit'){
  await page.locator(selector).click();
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
}

async function sample(page){
  return page.evaluate(id=>{
    const s=GeoGlyphMapEngine.state,l=s.map.getLayer(id)?.implementation,stats=GeoGlyph3D.stats();
    return {stats,anchor:{...s.anchor},message:s.message,code:s.selectedCode,selected:s.selectedFontId,
      font:GeoGlyphMapEngine.getGeoJSON()?.features[0]?.properties.font,
      renderer:l?.renderer.uuid,zoom:s.map.getZoom(),bearing:s.map.getBearing()};
  },layerId);
}

function angleDifference(a,b){return Math.abs(((a-b+540)%360)-180);}

test('collapsed Map has five accessible shortcuts inside desktop and mobile panels in both themes',async({page})=>{
  await open(page,{fonts:false,model:false});
  const row=page.locator('.map-motion-actions');
  await expect(row.locator('button')).toHaveCount(5);
  for(const id of ['mapQuickModel','mapQuickOrbit','mapQuickTurn','mapQuickFace','mapQuickRandom']){
    await expect.poll(()=>page.locator('#'+id).evaluate(button=>button.title||button.dataset.hoverTip)).toMatch(/.+/);
    await expect(page.locator('#'+id+' svg')).toHaveCount(1);
  }
  for(const [width,height] of [[1440,1000],[390,844]]){
    await page.setViewportSize({width,height});
    for(const theme of ['dark','light']){
      await page.locator(theme==='light'?'#themeLightBtn':'#themeDarkBtn').click();
      const layout=await row.evaluate(node=>{
        const panel=node.closest('.geoglyph-map-editor').getBoundingClientRect();
        return [...node.querySelectorAll('button')].map(button=>{
          const b=button.getBoundingClientRect(),s=getComputedStyle(button);
          return {width:b.width,height:b.height,inside:b.left>=panel.left&&b.right<=panel.right&&b.top>=panel.top&&b.bottom<=panel.bottom,
            text:s.color,background:s.backgroundColor};
        });
      });
      for(const button of layout){
        expect(button.width).toBeGreaterThanOrEqual(44);
        expect(button.height).toBeGreaterThanOrEqual(44);
        expect(button.inside).toBe(true);
        expect(button.text).toBe('rgb(16, 20, 22)');
      }
      expect(new Set(layout.map(button=>button.background)).size).toBe(5);
    }
  }
  await page.locator('#mapEditorCollapseBtn').click();
  await expect(row).toBeHidden();
});

test('orbit shortcuts enable 3D and change live orientation without restarting the camera',async({page})=>{
  await open(page,{model:false});
  await expect(page.locator('#mapQuickModel')).toHaveAttribute('aria-pressed','false');
  await start(page);
  await expect(page.locator('#mapQuickModel')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#mapQuickOrbit')).toHaveAttribute('aria-pressed','true');
  const first=await sample(page);
  for(const [id,mode] of [['mapQuickTurn','yaw'],['mapQuickFace','billboard'],['mapQuickOrbit','fixed']]){
    const before=await sample(page);
    await page.locator('#'+id).click();
    const after=await sample(page);
    expect(after.stats.animation.phase).toBe('orbiting');
    expect(after.stats.animation.frames).toBeGreaterThanOrEqual(before.stats.animation.frames);
    expect(angleDifference(after.bearing,before.bearing)).toBeLessThan(20);
    expect(after.anchor).toEqual(first.anchor);
    expect(after.stats.uploads).toBe(first.stats.uploads);
    expect(await page.evaluate(()=>GeoGlyphMapEngine.state.orientationMode)).toBe(mode);
    await expect(page.locator('#'+id)).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.map-motion-action.is-running')).toHaveCount(1);
  }
  await page.locator('#mapQuickOrbit').focus();
  await page.keyboard.press('Space');
  expect((await sample(page)).stats.animation.orbiting).toBe(false);
  await expect(page.locator('#mapQuickOrbit')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('.map-motion-action.is-running')).toHaveCount(0);
  await page.locator('#mapQuickModel').click();
  expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(false);
  await expect(page.locator('#mapQuickModel')).toHaveAttribute('aria-pressed','false');
});

test('font swaps retain the renderer, layer and orbit, and cached swaps avoid another worker mesh build',async({page})=>{
  const [sansId,serifId]=await open(page);
  await start(page,'#mapQuickFace');
  await page.evaluate(id=>{
    const layer=GeoGlyphMapEngine.state.map.getLayer(id).implementation;
    window.shortcutLayer=layer;window.shortcutRenderer=layer.renderer;
    window.shortcutFailures=[];
    window.shortcutMonitor=()=>{
      if(!GeoGlyph3D.isVisible()||!GeoGlyph3D.stats().animation.orbiting||GeoGlyphMapEngine.state.map.getLayer(id)?.implementation!==window.shortcutLayer)window.shortcutFailures.push('visible model, orbit or layer changed');
      window.shortcutMonitorFrame=requestAnimationFrame(window.shortcutMonitor);
    };
    window.shortcutMonitorFrame=requestAnimationFrame(window.shortcutMonitor);
  },layerId);
  const before=await sample(page);
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),sansId);
  await settled(page);
  const swapped=await sample(page);
  await expect(page.locator('#mapDisplayedFont')).toHaveText('Font: '+swapped.font);
  expect(swapped.stats.meshKey).not.toBe(before.stats.meshKey);
  expect(swapped.stats.uploads).toBeGreaterThan(before.stats.uploads);
  expect(swapped.stats.disposals).toBe(before.stats.disposals);
  expect(swapped.stats.animation.frames).toBeGreaterThan(before.stats.animation.frames);
  expect(swapped.stats.animation.phase).toBe('orbiting');
  expect(swapped.anchor).toEqual(before.anchor);
  expect(swapped.message).toBe(before.message);
  expect(swapped.code).toBe(before.code);
  const builds=(await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds;
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),serifId);
  await settled(page);
  const cached=await sample(page);
  await expect(page.locator('#mapDisplayedFont')).toHaveText('Font: '+cached.font);
  expect(cached.stats.meshKey).toBe(before.stats.meshKey);
  expect(cached.stats.cache.hits).toBeGreaterThan(before.stats.cache.hits);
  expect(cached.stats.cache.entries).toBeLessThanOrEqual(3);
  expect(cached.stats.cache.bytes).toBeLessThanOrEqual(32*1024*1024);
  expect((await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds).toBe(builds);
  expect(await page.evaluate(()=>{
    cancelAnimationFrame(window.shortcutMonitorFrame);
    return {renderer:window.shortcutLayer.renderer===window.shortcutRenderer,failures:window.shortcutFailures};
  })).toEqual({renderer:true,failures:[]});
});

test('an unreadable requested font leaves the committed model and animation available',async({page})=>{
  await open(page);
  await start(page);
  const before=await sample(page);
  await page.evaluate(async()=>{
    const id='shortcut-invalid';
    GeoGlyphMapEngine.state.fontRecords.set(id,{id,source:'file',name:'Invalid shortcut font',family:'Invalid shortcut font',cssFamily:'Invalid shortcut font',file:new File([new Uint8Array([0,1,2,3])],'shortcut-invalid.ttf',{lastModified:4})});
    await GeoGlyphMapEngine.selectFont(id);
  });
  await settled(page);
  const after=await sample(page);
  expect(after.stats.meshKey).toBe(before.stats.meshKey);
  expect(after.stats.uploads).toBe(before.stats.uploads);
  expect(after.stats.disposals).toBe(before.stats.disposals);
  expect(after.stats.animation.orbiting).toBe(true);
  expect(after.anchor).toEqual(before.anchor);
  expect(after.font).toBe(before.font);
  await expect(page.locator('#mapDisplayedFont')).toHaveText('Font: '+before.font);
  await expect(page.locator('#mapEngineStatus')).toContainText(/showing|kept|current|unavailable|invalid|unable/i);
  const saved=await page.evaluate(()=>GeoGlyphUi.collectMapSettings());
  expect(JSON.stringify(saved)).not.toContain('Invalid shortcut font');
});

test('the latest font wins when an earlier font is still reading bytes',async({page})=>{
  const [sansId]=await open(page);
  await start(page,'#mapQuickTurn');
  const before=await sample(page);
  await page.evaluate(bytes=>{
    const buffer=Uint8Array.from(atob(bytes),c=>c.charCodeAt(0)).buffer,id='shortcut-delayed';
    const file={name:'shortcut-delayed.ttf',size:buffer.byteLength,lastModified:99,arrayBuffer:()=>new Promise(resolve=>{window.shortcutReleaseFont=()=>resolve(buffer);})};
    GeoGlyphMapEngine.state.fontRecords.set(id,{id,source:'file',name:'Delayed shortcut font',family:'Delayed shortcut font',cssFamily:'Delayed shortcut font',file});
    window.shortcutSlowSelection=GeoGlyphMapEngine.selectFont(id);
  },fs.readFileSync(sans).toString('base64'));
  await page.waitForFunction(()=>typeof window.shortcutReleaseFont==='function');
  const pending=await sample(page);
  expect(pending.stats.meshKey).toBe(before.stats.meshKey);
  expect(pending.stats.animation.orbiting).toBe(true);
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),sansId);
  await settled(page);
  const latest=await sample(page);
  expect(latest.selected).toBe(sansId);
  expect(latest.stats.meshKey).not.toBe(before.stats.meshKey);
  await page.evaluate(async()=>{window.shortcutReleaseFont();await window.shortcutSlowSelection;});
  await settled(page);
  const final=await sample(page);
  expect(final.selected).toBe(sansId);
  expect(final.stats.meshKey).toBe(latest.stats.meshKey);
  expect(final.font).toBe(latest.font);
  expect(final.stats.animation.orbiting).toBe(true);
  expect(final.anchor).toEqual(before.anchor);
});

for(const [button,mode] of [['#mapQuickOrbit','fixed'],['#mapQuickTurn','yaw'],['#mapQuickFace','billboard']])test(`dynamic zoom follows manual and cached Random font changes in ${mode} mode`,async({page})=>{
  const ids=await open(page);
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.message='MMMMMMMMMM';GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  const sizes=[],fitZooms=[];
  for(const id of ids){
    await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),id);await settled(page);
    sizes.push(await page.evaluate(()=>{const b=GeoGlyph3D.getBounds(),s=GeoGlyphMapEngine.state,h=s.baseHeightMeters*s.relativeSize/100;return Math.hypot((b.maxX-b.minX)*h,(b.maxY-b.minY)*h,(b.maxZ-b.minZ)*s.extrusionDepthMeters);}));
    // Calibrate each font's real projected framing. A diagonal/sphere ratio
    // cannot predict perspective bounds when height and depth scale differently.
    await start(page,button);fitZooms.push((await sample(page)).zoom);
    await page.evaluate(()=>GeoGlyph3D.stopOrbit());
  }
  const large=sizes[0]>sizes[1]?0:1,small=1-large;
  expect(sizes[large]/sizes[small]).toBeGreaterThan(1.01);
  await page.evaluate(({ids,id})=>{const records=GeoGlyphMapEngine.state.fontRecords;for(const key of records.keys())if(!ids.includes(key))records.delete(key);return GeoGlyphMapEngine.selectFont(id);},{ids,id:ids[large]});
  await settled(page);await start(page,button);
  const before=await sample(page),largeZoom=fitZooms[large],smallZoom=fitZooms[small];
  expect(before.zoom).toBeCloseTo(largeZoom,4);
  expect(smallZoom-largeZoom).toBeGreaterThan(.01);
  const reaches=target=>expect.poll(async()=>Math.abs((await sample(page)).zoom-target),{intervals:[100]}).toBeLessThan(.002);
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),ids[small]);await settled(page);await reaches(smallZoom);
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),ids[large]);await settled(page);await reaches(largeZoom);
  const builds=await page.evaluate(()=>GeoGlyphFontService.workerStats().meshBuilds);
  await page.locator('#mapQuickRandom').click();await page.waitForFunction(id=>GeoGlyphMapEngine.state.displayedFontId===id,ids[small]);await reaches(smallZoom);
  await page.locator('#mapQuickRandom').click();await page.waitForFunction(id=>GeoGlyphMapEngine.state.displayedFontId===id,ids[large]);await reaches(largeZoom);
  expect(await page.evaluate(()=>GeoGlyphFontService.workerStats().meshBuilds)).toBe(builds);
  // Relative size changes reuse the current mesh, but still need new framing.
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.relativeSize=50;GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  await expect.poll(async()=>(await sample(page)).zoom-largeZoom).toBeGreaterThan(.8);
  await page.evaluate(()=>{const s=GeoGlyphMapEngine.state;s.relativeSize=100;GeoGlyphMapEngine.queueRebuild(false);});await settled(page);await reaches(largeZoom);
  await page.evaluate(()=>{GeoGlyphMapEngine.state.message='MM';GeoGlyphMapEngine.queueRebuild(false);});await settled(page);
  await expect.poll(async()=>(await sample(page)).zoom-largeZoom).toBeGreaterThan(.5);
  const after=await sample(page);expect(after.stats.animation.orbiting).toBe(true);expect(after.stats.animation.phase).toBe('orbiting');
  expect(after.stats.animation.frames).toBeGreaterThan(before.stats.animation.frames);expect(after.anchor).toEqual(before.anchor);expect(after.renderer).toBe(before.renderer);
});

test('Random selects an eligible catalogue font without changing text or stopping the orbit',async({page})=>{
  const ids=await open(page);
  await page.evaluate(ids=>{
    const records=GeoGlyphMapEngine.state.fontRecords;
    for(const id of records.keys())if(!ids.includes(id))records.delete(id);
    records.set('shortcut-css-only',{id:'shortcut-css-only',name:'CSS only',family:'sans-serif',source:'preset'});
  },ids);
  await start(page,'#mapQuickFace');
  const before=await sample(page);
  await page.locator('#mapQuickRandom').click();
  await expect.poll(async()=>(await sample(page)).stats.meshKey).not.toBe(before.stats.meshKey);
  await settled(page);
  const after=await sample(page);
  expect(after.selected).toBe(ids[0]);
  await expect(page.locator('#mapDisplayedFont')).toHaveText('Font: '+after.font);
  expect(after.stats.animation.orbiting).toBe(true);
  expect(after.stats.disposals).toBe(before.stats.disposals);
  expect(after.anchor).toEqual(before.anchor);
  expect(after.message).toBe(before.message);
  expect(after.code).toBe(before.code);
  await expect(page.locator('#mapQuickRandom')).not.toHaveAttribute('aria-busy','true');
  await page.locator('#mapQuickRandom').click();
  await expect.poll(async()=>(await sample(page)).stats.meshKey).toBe(before.stats.meshKey);
  expect((await sample(page)).selected).toBe(ids[1]);
});

test('font commits participate in undo and redo without replaying the orbit',async({page})=>{
  const [sansId,serifId]=await open(page);await start(page);
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),sansId);await settled(page);
  await page.evaluate(()=>document.activeElement?.blur());
  await page.keyboard.press('Control+z');
  await page.waitForFunction(id=>GeoGlyphMapEngine.state.displayedFontId===id,serifId);await settled(page);
  expect((await sample(page)).stats.animation.orbiting).toBe(false);
  await page.keyboard.press('Control+y');
  await page.waitForFunction(id=>GeoGlyphMapEngine.state.displayedFontId===id,sansId);await settled(page);
  expect((await sample(page)).stats.animation.orbiting).toBe(false);
});

test('manual navigation cancels an orbit queued while the first 3D font is reading',async({page})=>{
  await open(page,{model:false});
  await page.evaluate(bytes=>{
    const buffer=Uint8Array.from(atob(bytes),c=>c.charCodeAt(0)).buffer,id='shortcut-pending-orbit';
    const file={name:'shortcut-pending-orbit.ttf',size:buffer.byteLength,lastModified:101,arrayBuffer:()=>new Promise(resolve=>{window.shortcutReleaseOrbitFont=()=>resolve(buffer);})};
    GeoGlyphMapEngine.state.fontRecords.set(id,{id,source:'file',name:'Pending orbit font',family:'Pending orbit font',cssFamily:'Pending orbit font',file});
    window.shortcutPendingOrbitSelection=GeoGlyphMapEngine.selectFont(id);
  },fs.readFileSync(sans).toString('base64'));
  await page.waitForFunction(()=>typeof window.shortcutReleaseOrbitFont==='function');
  await page.locator('#mapQuickOrbit').click();
  await expect(page.locator('#mapQuickOrbit')).toHaveAttribute('aria-busy','true');
  expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(false);
  await page.evaluate(()=>GeoGlyphMapEngine.state.map.fire('dragstart',{originalEvent:{}}));
  await expect(page.locator('#mapQuickOrbit')).toHaveAttribute('aria-busy','false');
  await page.evaluate(async()=>{window.shortcutReleaseOrbitFont();await window.shortcutPendingOrbitSelection;});
  await page.waitForFunction(()=>GeoGlyph3D.isVisible());
  await settled(page);
  const after=await sample(page);
  expect(after.stats.animation.orbiting).toBe(false);
  expect(after.stats.animation.phase).toBe('stopped');
  expect(after.stats.animation.scheduled).toBe(false);
  await expect(page.locator('#mapQuickOrbit')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('.map-motion-action.is-running')).toHaveCount(0);
});

test('a font missing the message glyph keeps the current 3D model and can be previewed in 2D',async({page})=>{
  const [sansId,serifId]=await open(page,{model:false});
  const coverage=await page.evaluate(async ids=>{
    const metadata=await Promise.all(ids.map(id=>GeoGlyphFontService.prepare(GeoGlyphMapEngine.state.fontRecords.get(id))));
    return metadata.map(font=>font.codes.includes(0x1f600));
  },[sansId,serifId]);
  test.skip(!coverage[0]||coverage[1],'Installed DejaVu fixtures do not provide the expected emoji glyph coverage difference');
  await page.evaluate(async id=>{
    GeoGlyphMapEngine.state.message='😀';
    await GeoGlyphMapEngine.selectFont(id);
  },sansId);
  await settled(page);
  await page.locator('#mapQuickModel').click();
  await page.waitForFunction(()=>GeoGlyph3D.isVisible());
  await settled(page);
  await start(page);
  const before=await sample(page);
  await page.evaluate(id=>GeoGlyphMapEngine.selectFont(id),serifId);
  await settled(page);
  const after=await sample(page);
  expect(after.selected).toBe(serifId);
  expect(after.stats.meshKey).toBe(before.stats.meshKey);
  expect(after.stats.uploads).toBe(before.stats.uploads);
  expect(after.stats.animation.orbiting).toBe(true);
  expect(after.font).toBe(before.font);
  expect(after.message).toBe('😀');
  expect(after.anchor).toEqual(before.anchor);
  await expect(page.locator('#mapEngineStatus')).toContainText(/lacks characters|U\+1F600/i);
  await page.locator('#mapQuickModel').click();
  await page.waitForFunction(id=>{
    const s=GeoGlyphMapEngine.state;
    return !s.extrusionEnabled&&s.displayedFontId===id&&s.lastRenderMode==='decal';
  },serifId);
  await settled(page);
  expect(await page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(false);
  await expect(page.locator('#mapQuickModel')).toHaveAttribute('aria-pressed','false');
});
