const {test,expect}=require('./studio-fixture.cjs');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');

async function openMap(page){
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphControls&&document.getElementById('map3DSection'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await page.locator('[data-map-mode="message"]').click();
}

test('Map section actions target active panes and retain independent collapse preferences',async({page})=>{
  await openMap(page);
  const editor=page.locator('#geoglyphMapEditor');
  const header=page.locator('#mapControlsHeader');
  await expect(header).toBeVisible();
  await expect(header.locator('.panel-title')).toHaveText('Controls · Ground Font Engine');
  await expect(editor.locator('[data-control-section]')).toHaveCount(7);
  await expect(editor.locator('[data-control-section]:visible')).toHaveCount(5);
  const before=await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}));

  await header.locator('[data-collapse-all="collapse"]').click();
  await expect(editor.locator('.control-section.is-collapsed:visible')).toHaveCount(5);
  await expect(page.locator('#mapMessage')).toBeHidden();
  await expect(page.locator('#mapFontSelect')).toBeHidden();
  await expect(page.locator('#map3DEnabled')).toBeHidden();
  await expect(page.locator('#mapGlyphSection')).not.toHaveClass(/is-collapsed/);
  await expect(page.locator('#mapMessageSection > .map-section-head')).toBeVisible();
  await expect(page.locator('[data-collapse-module="mapMessageSection"]')).toHaveAttribute('aria-expanded','false');

  await page.locator('[data-map-mode="glyph"]').click();
  await expect(page.locator('#mapGlyphSection')).toBeVisible();
  await expect(page.locator('#mapGlyphSearch')).toBeVisible();
  await expect(page.locator('#mapMessageSection')).toBeHidden();
  await header.locator('[data-collapse-all="expand"]').click();
  await expect(editor.locator('.control-section.is-collapsed:visible')).toHaveCount(0);
  await expect(page.locator('#mapMessageSection')).toHaveClass(/is-collapsed/);

  await page.locator('[data-map-mode="message"]').click();
  await expect(page.locator('#mapMessageSection')).toBeVisible();
  await expect(page.locator('#mapMessage')).toBeHidden();
  await page.locator('[data-collapse-module="mapMessageSection"]').click();
  await expect(page.locator('#mapMessage')).toBeVisible();
  expect(await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}))).toEqual(before);
  await page.locator('[data-collapse-module="mapMessageSection"]').click();

  await page.reload();
  await page.waitForFunction(()=>document.getElementById('map3DSection'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.locator('[data-map-mode="message"]').click();
  await expect(page.locator('#mapMessageSection')).toHaveClass(/is-collapsed/);
  await expect(page.locator('[data-collapse-module="mapMessageSection"]')).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#mapFontSection')).not.toHaveClass(/is-collapsed/);
});

test('Map Controls stay inside expanded panels and never change mini panel dimensions',async({page})=>{
  await openMap(page);
  const header=page.locator('#mapControlsHeader');
  for(const [width,height] of [[1440,1000],[390,844]]){
    await page.setViewportSize({width,height});
    for(const theme of ['dark','light']){
      await page.locator(theme==='light'?'#themeLightBtn':'#themeDarkBtn').click();
      await expect(header).toBeVisible();
      const layout=await header.evaluate(node=>{
        const panel=node.parentElement.getBoundingClientRect();
        return [...node.querySelectorAll('h2,button')].map(child=>{
          const rect=child.getBoundingClientRect();
          return rect.left>=panel.left&&rect.right<=panel.right&&rect.width>0;
        });
      });
      expect(layout.every(Boolean)).toBe(true);
      await header.locator('[data-collapse-all="collapse"]').click();
      await page.locator('#mapEditorCollapseBtn').click();
      await expect(header).toBeHidden();
      await expect(page.locator('.map-motion-actions')).toBeVisible();
      const compact=await page.locator('#geoglyphMapEditor').evaluate(node=>{
        const rect=node.getBoundingClientRect(),style=getComputedStyle(node);
        const visibleSections=[...node.querySelectorAll('.control-section')].filter(section=>section.getClientRects().length);
        return {height:rect.height,expected:parseFloat(style.height),scroll:node.scrollHeight,client:node.clientHeight,visibleSections:visibleSections.length};
      });
      expect(compact.height).toBeCloseTo(138,0);
      expect(compact.visibleSections).toBe(0);
      expect(compact.scroll).toBeLessThanOrEqual(compact.client+1);
      await page.locator('#mapEditorCollapseBtn').click();
      await expect(header).toBeVisible();
      await header.locator('[data-collapse-all="expand"]').click();
      await expect(page.locator('#mapFontSelect')).toBeVisible();
    }
  }
});
