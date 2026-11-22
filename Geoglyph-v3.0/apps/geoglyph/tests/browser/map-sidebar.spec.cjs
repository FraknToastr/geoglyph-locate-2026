const { test, expect } = require('./studio-fixture.cjs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const tile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');

async function boot(page, url = '/') {
  await page.route('**/MapServer/tile/**', route => route.fulfill({ body: tile, contentType: 'image/png' }));
  await page.goto(url);
  await page.waitForFunction(() => window.GeoGlyphMapSidebar && window.GeoGlyphMapEngine && document.getElementById('map3DSection'));
  if (await page.locator('body').evaluate(body => body.classList.contains('drawer-open'))) {
    await page.locator('#closeDrawerBtn').click();
  }
}

async function openMap(page) {
  await boot(page);
  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.waitForFunction(() => GeoGlyphMapEngine.state.mapReady);
  await expect(page.locator('#mapControlSidebar')).toBeVisible();
}

async function state(page) {
  return page.evaluate(() => GeoGlyphMapSidebar.state());
}

async function expectState(page, expected) {
  await expect.poll(() => state(page)).toMatchObject(expected);
}

async function expectMapWidth(page, full) {
  await expect.poll(() => page.evaluate(isFull => {
    const workspace = document.getElementById('geoglyphMapWorkspace').getBoundingClientRect();
    const sidebar = document.getElementById('mapControlSidebar').getBoundingClientRect();
    const canvas = GeoGlyphMapEngine.state.map.getCanvas().getBoundingClientRect();
    return Math.abs(workspace.left - (isFull ? sidebar.right : 0)) < 1.5 &&
      Math.abs(workspace.right - innerWidth) < 1.5 &&
      Math.abs(canvas.width - workspace.width) < 1.5;
  }, full)).toBe(true);
}

async function openExplorer(page) {
  await page.locator('.workflow-font-btn').click();
  await expect(page.locator('body')).toHaveClass(/drawer-open/);
  await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
}

async function settled(page) {
  await page.waitForFunction(() => {
    const s = GeoGlyphMapEngine.state;
    return s.mapReady && !s.pendingBuild && !s.rebuilding && !s.explicitFitPending &&
      GeoGlyph3D.stats().animation.phase !== 'framing';
  });
}

async function prepareMorph(page, three = false) {
  const target = await page.evaluate(async () => {
    await GeoGlyphFontMorph.ensureBuiltins();
    const s = GeoGlyphMapEngine.state;
    const fonts = [...s.fontRecords.values()];
    const source = fonts.find(font => font.fontResourceKey === 'conference:Gill Sans');
    const target = fonts.find(font => font.fontResourceKey === 'conference:Forte');
    if (!source || !target) throw Error('Shipped morph fonts were not registered');
    Object.assign(s, { mode: 'message', message: 'B8 i Morph', nativeColor: false, outlineWidth: 0, opacity: 1 });
    await GeoGlyphMapEngine.selectFont(source.id);
    GeoGlyphMapEngine.refreshControls();
    return target.id;
  });
  await settled(page);
  await page.waitForFunction(() => !GeoGlyphMapEngine.state.map.isMoving());
  if (three) {
    expect(await page.evaluate(() => GeoGlyphMapEngine.setModelMode(true))).toBe(true);
    await settled(page);
  }
  expect(await page.evaluate(id => GeoGlyphFontMorph.prepare(id), target)).toBe(true);
}

for (const [entrypoint, url] of [
  ['HTTP', '/'],
  ['Local index.html', pathToFileURL(path.resolve(__dirname, '../../index.html')).href],
  ['Standalone GeoGlyph_Locate_2026.html', pathToFileURL(path.resolve(__dirname, '../../GeoGlyph_Locate_2026.html')).href]
]) test(`${entrypoint}: UOS logo opens an independent full sidebar beneath the header only in Map`, async ({ page }) => {
  await boot(page, url);
  await expect(page.locator('.workflow-nav>button').first()).toHaveAttribute('id','geoglyphPreviewBtn');
  await expect(page.locator('#geoglyphPreviewBtn')).toHaveText('Geoglyph');
  await expect(page.locator('#mapCanvasToggleBtn')).toHaveText('Canvas');
  const toggle = page.locator('#mapSidebarToggle');
  await expect(toggle).toBeDisabled();
  await expect(toggle).toHaveAttribute('type', 'button');
  await expect(toggle).toHaveClass(/logo-link/);
  await expect(toggle).toHaveAttribute('aria-controls', /\bmapControlSidebar\b/);
  await expect(toggle).toHaveAttribute('aria-controls', /\bgeoglyphMapEditor\b/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAccessibleName(/controls/i);
  await expect(page.locator('#mapControlSidebar')).toBeHidden();

  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.waitForFunction(() => GeoGlyphMapEngine.state.mapReady);
  await expect(page.locator('#geoglyphPreviewBtn')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#mapCanvasToggleBtn')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('.workflow-nav>[data-workflow="symbol"]')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('.workflow-nav>[data-workflow="symbol"]')).not.toHaveClass(/is-active/);
  // The inherited renderer schedules navigation refreshes after updating its
  // private Symbol preview. They must not reactivate Symbol over Geoglyph.
  await page.evaluate(()=>new Promise(resolve=>setTimeout(()=>{
    document.querySelector('.preview-tabs [data-preview="symbol"]').setAttribute('aria-pressed','true');
    requestAnimationFrame(()=>requestAnimationFrame(resolve));
  },0)));
  await expect(page.locator('#geoglyphPreviewBtn')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.workflow-nav>[data-workflow="symbol"]')).toHaveAttribute('aria-pressed','false');
  await expect(page.locator('#mapCanvasToggleBtn')).toHaveText('Canvas');
  await expect(toggle).toBeEnabled();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expectState(page, { active: true, visible: true, presentation: 'full', suppressed: false });
  const structure = await page.evaluate(() => {
    const sidebar = document.getElementById('mapControlSidebar');
    const rect = sidebar.getBoundingClientRect();
    return {
      tag: sidebar.tagName,
      parent: sidebar.parentElement.tagName,
      editorParent: document.getElementById('geoglyphMapEditor').parentElement.id,
      width: rect.width,
      top: rect.top,
      headerBottom: document.querySelector('.app-header').getBoundingClientRect().bottom,
      bottom: rect.bottom,
      viewport: innerHeight
    };
  });
  expect(structure.tag).toBe('ASIDE');
  expect(structure.parent).toBe('BODY');
  expect(structure.editorParent).toBe('mapControlSidebar');
  expect(structure.width).toBeCloseTo(425, 0);
  expect(structure.top).toBeCloseTo(structure.headerBottom, 0);
  expect(structure.bottom).toBeCloseTo(structure.viewport, 0);
  await expectMapWidth(page, true);
});

for(const url of ['/',pathToFileURL(path.resolve(__dirname,'../../GeoGlyph_Locate_2026.html')).href])test(`separate Geoglyph and Canvas buttons retain the last sidebar mode and presentation (${url==='/'?'HTTP':'standalone'})`,async({page})=>{
  await boot(page,url);
  const geoglyph=page.locator('#geoglyphPreviewBtn'),canvas=page.locator('#mapCanvasToggleBtn');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:1000});
    for(const [mode,presentation,visible] of [['message','full',true],['arcgis','mini',true],['admin','mini',false]]){
      await geoglyph.click();await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
      await page.evaluate(()=>{GeoGlyphMapSidebar.setVisible(true);GeoGlyphMapSidebar.setPresentation('full');});
      await page.locator(`[data-map-mode="${mode}"]`).click();
      if(mode==='arcgis')await expect(page.locator('#mapScriptSection>.map-section-head')).toHaveText("Geo's Script");
      await page.evaluate(({presentation,visible})=>{GeoGlyphMapSidebar.setPresentation(presentation);GeoGlyphMapSidebar.setVisible(visible);},{presentation,visible});
      await canvas.click();await expectState(page,{active:false,presentation,visible});
      await expect(canvas).toHaveText('Canvas');await expect(canvas).toHaveAttribute('aria-pressed','true');await expect(geoglyph).toHaveAttribute('aria-pressed','false');
      await expect(page.locator('.workflow-nav>[data-workflow="symbol"]')).toHaveAttribute('aria-pressed','true');
      await canvas.focus();await page.keyboard.press('Space');await expectState(page,{active:false,presentation,visible});
      await geoglyph.focus();await page.keyboard.press('Enter');await expectState(page,{active:true,presentation,visible,suppressed:false});
      await expect(page.locator(`[data-map-mode="${mode}"]`)).toHaveAttribute('aria-pressed','true');
      await expect(geoglyph).toHaveAttribute('aria-pressed','true');await expect(canvas).toHaveAttribute('aria-pressed','false');await expect(canvas).toHaveText('Canvas');
      await expect(page.locator('.workflow-nav>[data-workflow="symbol"]')).toHaveAttribute('aria-pressed','false');
    }
    await page.locator('[data-workflow="qr"]').click();await expectState(page,{active:false});
    await expect(canvas).toHaveAttribute('aria-pressed','false');await expect(geoglyph).toHaveAttribute('aria-pressed','false');
    await canvas.click();await expect(canvas).toHaveAttribute('aria-pressed','true');await expectState(page,{active:false});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.locator('.workflow-nav>button').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth+1))).toBe(true);
  }
});

test('internal collapse moves the existing editor into a mini floating panel and expands it again', async ({ page }) => {
  await openMap(page);
  await expect(page.locator('.map-motion-actions')).toBeVisible();
  const shortcutLayout=await page.locator('.map-editor-head').evaluate(head=>{
    const title=head.querySelector('.map-editor-title-row'),shortcuts=head.querySelector('.map-motion-actions'),modes=head.querySelector('.map-mode-switch');
    return {titleBottom:title.getBoundingClientRect().bottom,shortcutsTop:shortcuts.getBoundingClientRect().top,shortcutsBottom:shortcuts.getBoundingClientRect().bottom,modesTop:modes.getBoundingClientRect().top,divider:getComputedStyle(title).borderBottomWidth};
  });
  expect(shortcutLayout.shortcutsTop).toBeGreaterThanOrEqual(shortcutLayout.titleBottom);
  expect(shortcutLayout.modesTop).toBeGreaterThanOrEqual(shortcutLayout.shortcutsBottom);
  expect(shortcutLayout.divider).toBe('0px');
  await page.evaluate(() => { window.sidebarOriginalEditor = document.getElementById('geoglyphMapEditor');window.sidebarOriginalShortcuts=document.querySelector('.map-motion-actions'); });
  const collapse = page.locator('#mapEditorCollapseBtn');
  await collapse.click();
  await expectState(page, { visible: true, presentation: 'mini' });
  await expect(page.locator('#mapControlSidebar')).toBeHidden();
  await expect(page.locator('#geoglyphMapEditor')).toBeVisible();
  await expect(page.locator('#mapControlsHeader')).toBeHidden();
  await expect(page.locator('.map-motion-actions')).toBeVisible();
  expect(await page.locator('.map-motion-actions').evaluate(node=>node===window.sidebarOriginalShortcuts)).toBe(true);
  await expect(collapse).toHaveAttribute('aria-expanded', 'false');
  expect(await page.locator('#geoglyphMapEditor').evaluate(editor => ({
    same: editor === window.sidebarOriginalEditor,
    parent: editor.parentElement.id,
    height: editor.getBoundingClientRect().height
  }))).toEqual({ same: true, parent: 'geoglyphMapWorkspace', height: 138 });
  await expectMapWidth(page, false);

  await collapse.click();
  await expectState(page, { visible: true, presentation: 'full' });
  await expect(page.locator('#mapControlsHeader')).toBeVisible();
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.map-motion-actions')).toBeVisible();
  expect(await page.locator('#geoglyphMapEditor').evaluate(editor => editor === window.sidebarOriginalEditor && editor.parentElement.id === 'mapControlSidebar')).toBe(true);
  await expectMapWidth(page, true);
});

test('logo visibility is independent of the remembered full or mini presentation', async ({ page }) => {
  await openMap(page);
  const toggle = page.locator('#mapSidebarToggle');
  for (const presentation of ['full', 'mini']) {
    await page.evaluate(mode => GeoGlyphMapSidebar.setPresentation(mode), presentation);
    await toggle.click();
    await expectState(page, { visible: false, presentation });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
    await expectMapWidth(page, false);
    await toggle.click();
    await expectState(page, { visible: true, presentation });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#geoglyphMapEditor')).toBeVisible();
    await expectMapWidth(page, presentation === 'full');
  }
});

test('Map and Canvas switches retain mini and hidden choices without enabling the logo elsewhere', async ({ page }) => {
  await openMap(page);
  for (const visible of [true, false]) {
    await page.evaluate(value => {
      GeoGlyphMapSidebar.setPresentation('mini');
      GeoGlyphMapSidebar.setVisible(value);
      GeoGlyphMapEngine.showCanvas();
    }, visible);
    await expectState(page, { active: false, visible, presentation: 'mini' });
    await expect(page.locator('#mapSidebarToggle')).toBeDisabled();
    await expect(page.locator('#mapSidebarToggle')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
    await page.evaluate(() => GeoGlyphMapEngine.showMap());
    await expectState(page, { active: true, visible, presentation: 'mini' });
    if (visible) await expect(page.locator('#geoglyphMapEditor')).toBeVisible();
    else await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
    await expectMapWidth(page, false);
  }
});

test('Font Explorer temporarily suppresses full, mini and hidden controls then restores each choice', async ({ page }) => {
  await openMap(page);
  for (const choice of [{ presentation: 'full', visible: true }, { presentation: 'mini', visible: true }, { presentation: 'mini', visible: false }]) {
    await page.evaluate(({ presentation, visible }) => {
      GeoGlyphMapSidebar.setPresentation(presentation);
      GeoGlyphMapSidebar.setVisible(visible);
    }, choice);
    await openExplorer(page);
    await expectState(page, { ...choice, active: true, suppressed: true });
    await expect(page.locator('#mapControlSidebar')).toBeHidden();
    await expect(page.locator('#mapSidebarToggle')).toHaveAttribute('aria-expanded', 'false');
    await page.locator('#closeDrawerBtn').click();
    await expectState(page, { ...choice, active: true, suppressed: false });
    if (choice.visible) await expect(page.locator('#geoglyphMapEditor')).toBeVisible();
    else await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
    await expectMapWidth(page, choice.visible && choice.presentation === 'full');
  }
});

test('logo closes Font Explorer and shows the remembered full or mini controls', async ({ page }) => {
  await openMap(page);
  for (const presentation of ['full', 'mini']) {
    await page.evaluate(mode => {
      GeoGlyphMapSidebar.setPresentation(mode);
      GeoGlyphMapSidebar.setVisible(false);
    }, presentation);
    await openExplorer(page);
    await page.locator('#mapSidebarToggle').click();
    await expect(page.locator('body')).not.toHaveClass(/drawer-open/);
    await expectState(page, { visible: true, presentation, active: true, suppressed: false });
    await expect(page.locator('#geoglyphMapEditor')).toBeVisible();
    await expectMapWidth(page, presentation === 'full');
  }
});

test('logo and internal collapse work with a keyboard and hiding focused controls returns focus to the logo', async ({ page }) => {
  await openMap(page);
  const toggle = page.locator('#mapSidebarToggle');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expectState(page, { visible: false });
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Space');
  await expectState(page, { visible: true, presentation: 'full' });
  await expect(toggle).toBeFocused();
  const collapse = page.locator('#mapEditorCollapseBtn');
  await collapse.focus();
  await page.keyboard.press('Space');
  await expectState(page, { presentation: 'mini' });
  await expect(collapse).toBeFocused();
  await page.keyboard.press('Enter');
  await expectState(page, { presentation: 'full' });
  await expect(collapse).toBeFocused();
  await page.locator('[data-map-mode="message"]').focus();
  await page.evaluate(() => GeoGlyphMapSidebar.setPresentation('mini'));
  await expect(collapse).toBeFocused();
  await page.keyboard.press('Enter');
  await expectState(page, { presentation: 'full' });
  await page.locator('#mapFontSelect').focus();
  await expect(page.locator('#mapFontSelect')).toBeFocused();
  await page.evaluate(() => GeoGlyphMapSidebar.setVisible(false));
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#geoglyphMapEditor')).toBeVisible();
});

test('reparenting preserves controls, section collapse states, message values and the Map instance', async ({ page }) => {
  await openMap(page);
  await page.locator('[data-map-mode="message"]').click();
  await page.locator('#mapMessage').fill('Sidebar continuity');
  await page.locator('[data-collapse-module="mapStyleSection"]').click();
  await expect(page.locator('#mapStyleSection')).toHaveClass(/is-collapsed/);
  await page.evaluate(() => {
    window.sidebarOriginalNodes = ['geoglyphMapEditor', 'mapMessage', 'mapMorphPanel', 'mapFontSelect', 'map3DEnabled'].map(id => document.getElementById(id));
    window.sidebarOriginalMap = GeoGlyphMapEngine.state.map;
  });
  await page.locator('#mapEditorCollapseBtn').click();
  await page.locator('#mapSidebarToggle').click();
  await page.evaluate(() => { GeoGlyphMapEngine.showCanvas(); GeoGlyphMapEngine.showMap(); });
  await page.locator('#mapSidebarToggle').click();
  await openExplorer(page);
  await page.locator('#closeDrawerBtn').click();
  await page.locator('#mapEditorCollapseBtn').click();
  await expect(page.locator('#mapMessage')).toHaveValue('Sidebar continuity');
  await expect(page.locator('#mapStyleSection')).toHaveClass(/is-collapsed/);
  await expect(page.locator('[data-collapse-module="mapStyleSection"]')).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => window.sidebarOriginalNodes.every(node => node === document.getElementById(node.id)) && window.sidebarOriginalMap === GeoGlyphMapEngine.state.map)).toBe(true);
  for (const id of ['geoglyphMapEditor', 'mapMessage', 'mapMorphPanel', 'mapFontSelect', 'map3DEnabled']) {
    await expect(page.locator('#' + id)).toHaveCount(1);
  }
  await page.locator('[data-collapse-module="mapStyleSection"]').click();
  await expect(page.locator('#mapStyleSection')).not.toHaveClass(/is-collapsed/);
});

test('full sidebar fits both themes on desktop and narrow windows with its wider column', async ({ page }) => {
  await openMap(page);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ['dark', 'light']) {
      await page.locator(theme === 'light' ? '#themeLightBtn' : '#themeDarkBtn').evaluate(button => button.click());
      await expectMapWidth(page, true);
      const layout = await page.locator('#mapControlSidebar').evaluate(sidebar => {
        const bounds = sidebar.getBoundingClientRect(), editor = document.getElementById('geoglyphMapEditor');
        const controls = [...editor.querySelectorAll('button,input:not([type="hidden"]),select,textarea')]
          .filter(node => node.checkVisibility() && !node.closest('.script-rows')).map(node => {
            const rect = node.getBoundingClientRect();
            return { id: node.id || node.className, left: rect.left, right: rect.right };
          });
        const luminance = color => {
          const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
            const channel = value / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
          });
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const background = getComputedStyle(editor).backgroundColor, backgroundLuminance = luminance(background);
        const headings = [...editor.querySelectorAll('.map-section-collapse')].filter(node => node.checkVisibility()).map(node => {
          const color = getComputedStyle(node).color, foreground = luminance(color);
          return { label: node.textContent.trim(), color, background,
            contrast: (Math.max(foreground, backgroundLuminance) + 0.05) / (Math.min(foreground, backgroundLuminance) + 0.05) };
        });
        return { width: bounds.width, left: bounds.left, right: bounds.right, scroll: sidebar.scrollWidth,
          client: sidebar.clientWidth, editorScroll: editor.scrollWidth, editorClient: editor.clientWidth, controls, headings };
      });
      expect(layout.width).toBeCloseTo(Math.min(425, width * .625), 0);
      expect(layout.scroll).toBeLessThanOrEqual(layout.client + 1);
      expect(layout.editorScroll).toBeLessThanOrEqual(layout.editorClient + 1);
      for (const control of layout.controls) {
        expect(control.left, `${theme} ${width}px ${control.id} left`).toBeGreaterThanOrEqual(layout.left - 1);
        expect(control.right, `${theme} ${width}px ${control.id} right`).toBeLessThanOrEqual(layout.right + 1);
      }
      for (const heading of layout.headings) {
        expect(heading.contrast, `${theme} ${heading.label}: ${heading.color} against ${heading.background}`).toBeGreaterThanOrEqual(4.5);
      }
      if (width === 390 || theme === 'dark') {
        await page.screenshot({ path: `/tmp/geoglyph-sidebar-${width === 390 ? 'narrow' : 'desktop'}-${theme}.png` });
      }
      await page.locator('#mapEditorCollapseBtn').click();
      await expect(page.locator('.map-motion-actions')).toBeVisible();
      expect(await page.locator('#geoglyphMapEditor').evaluate(node => node.getBoundingClientRect().height)).toBe(138);
      await expectMapWidth(page, false);
      await page.locator('#mapEditorCollapseBtn').click();
    }
  }
});

test('sidebar visibility and presentation reset on reload instead of persisting in storage', async ({ page }) => {
  await openMap(page);
  await page.evaluate(() => { GeoGlyphMapSidebar.setPresentation('mini'); GeoGlyphMapSidebar.setVisible(false); });
  await expectState(page, { visible: false, presentation: 'mini' });
  await page.reload();
  await page.waitForFunction(() => window.GeoGlyphMapSidebar && window.GeoGlyphMapEngine);
  await page.evaluate(() => GeoGlyphMapEngine.showMap());
  await page.waitForFunction(() => GeoGlyphMapEngine.state.mapReady);
  if (await page.locator('body').evaluate(body => body.classList.contains('drawer-open'))) await page.locator('#closeDrawerBtn').click();
  await expectState(page, { visible: true, presentation: 'full', active: true, suppressed: false });
  await expect(page.locator('#mapControlSidebar')).toBeVisible();
  await expectMapWidth(page, true);
});

test('paused 2D morph progress and camera survive sidebar changes without another mesh build', async ({ page }) => {
  test.setTimeout(45000);
  await openMap(page);
  await prepareMorph(page);
  await page.evaluate(() => GeoGlyphFontMorph.seek(0.43));
  const before = await page.evaluate(async () => {
    const s = GeoGlyphMapEngine.state, map = s.map;
    window.sidebarCameraFits = [];
    for (const method of ['easeTo', 'flyTo', 'fitBounds']) {
      const original = map[method];
      map[method] = function (...args) { window.sidebarCameraFits.push(method); return original.apply(this, args); };
    }
    return { morph: GeoGlyphFontMorph.stats(), worker: await GeoGlyphFontService.workerStats(), anchor: { ...s.anchor },
      camera: { center: { ...map.getCenter() }, zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() } };
  });
  await page.locator('#mapEditorCollapseBtn').click();
  await page.locator('#mapSidebarToggle').click();
  await page.locator('#mapSidebarToggle').click();
  await page.locator('#mapEditorCollapseBtn').click();
  await openExplorer(page);
  await page.locator('#mapSidebarToggle').click();
  const after = await page.evaluate(async () => {
    const s = GeoGlyphMapEngine.state, map = s.map;
    return { morph: GeoGlyphFontMorph.stats(), worker: await GeoGlyphFontService.workerStats(), anchor: { ...s.anchor },
      camera: { center: { ...map.getCenter() }, zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() }, fits: window.sidebarCameraFits };
  });
  expect(after.morph.ready).toBe(true);
  expect(after.morph.playing).toBe(false);
  expect(after.morph.progress).toBeCloseTo(0.43);
  expect(after.morph.renderer.uploads).toBe(before.morph.renderer.uploads);
  expect(after.worker.meshBuilds).toBe(before.worker.meshBuilds);
  expect(after.anchor).toEqual(before.anchor);
  expect(after.camera).toEqual(before.camera);
  expect(after.fits).toEqual([]);
});

test('live 3D morphing and orbit continue through full, mini, hidden and Explorer layouts', async ({ page }, info) => {
  test.setTimeout(45000);
  await openMap(page);
  await prepareMorph(page, true);
  await page.evaluate(() => {
    GeoGlyphMapEngine.state.orientationMode = 'yaw';
    GeoGlyph3D.ensureOrbit('yaw', { framed: true });
    document.getElementById('mapMorphDuration').value = '30';
    GeoGlyphFontMorph.seek(0.25);
    GeoGlyphFontMorph.play();
  });
  await page.waitForFunction(() => GeoGlyph3D.stats().animation.phase === 'orbiting' && GeoGlyphFontMorph.stats().playing);
  const sample = () => page.evaluate(async () => ({
    morph: GeoGlyphFontMorph.stats(), render: GeoGlyph3D.stats(), worker: await GeoGlyphFontService.workerStats(),
    anchor: { ...GeoGlyphMapEngine.state.anchor }
  }));
  const samples = [await sample()];
  const actions = [
    () => page.locator('#geoglyphPreviewBtn').click(),
    () => page.locator('#mapEditorCollapseBtn').click(),
    () => page.locator('#mapSidebarToggle').click(),
    () => page.locator('#mapSidebarToggle').click(),
    () => openExplorer(page),
    () => page.locator('#mapSidebarToggle').click(),
    () => page.locator('#mapEditorCollapseBtn').click()
  ];
  for (const action of actions) {
    const previous = samples[samples.length - 1];
    await action();
    await page.waitForFunction(frames => GeoGlyph3D.stats().animation.frames > frames + 2, previous.render.animation.frames);
    const current = await sample();
    expect(current.render.animation.phase).toBe('orbiting');
    expect(current.render.animation.orbiting).toBe(true);
    expect(current.render.animation.frames).toBeGreaterThan(previous.render.animation.frames);
    expect(current.render.animation.bearing).toBeGreaterThan(previous.render.animation.bearing);
    expect(current.render.animation.bearing - previous.render.animation.bearing).toBeLessThan(45);
    expect(current.morph.ready).toBe(true);
    expect(current.morph.playing).toBe(true);
    expect(current.morph.progress).toBeGreaterThan(previous.morph.progress);
    expect(current.morph.renderer.uploads).toBe(samples[0].morph.renderer.uploads);
    expect(current.render.uploads).toBe(samples[0].render.uploads);
    expect(current.worker.meshBuilds).toBe(samples[0].worker.meshBuilds);
    expect(current.anchor).toEqual(samples[0].anchor);
    samples.push(current);
  }
  await info.attach('sidebar-morph-orbit-continuity', { body: JSON.stringify(samples, null, 2), contentType: 'application/json' });
  await page.evaluate(() => { GeoGlyphFontMorph.pause(); GeoGlyph3D.stopOrbit(); });
});
