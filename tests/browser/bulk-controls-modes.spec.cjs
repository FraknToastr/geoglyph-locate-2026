const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),{pathToFileURL}=require('node:url');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');

test('disk bulk controls refresh across all four modes and after reopening the editor',async({page})=>{
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../../index.html')).href);
  await page.waitForFunction(()=>window.GeoGlyphControls&&document.getElementById('map3DSection'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  const editor=page.locator('#geoglyphMapEditor'),header=page.locator('#mapControlsHeader');
  const expand=header.locator('[data-collapse-all="expand"]'),collapse=header.locator('[data-collapse-all="collapse"]');
  for(const mode of ['message','glyph','arcgis','admin']){
    await page.locator(`[data-map-mode="${mode}"]`).click();
    if(await expand.isEnabled())await expand.click();
    await expect(collapse).toBeEnabled();await expect(expand).toBeDisabled();
    const hiddenBefore=await editor.locator('[data-control-section][hidden]').evaluateAll(nodes=>nodes.map(n=>[n.id,n.classList.contains('is-collapsed')]));
    const visible=editor.locator('[data-control-section]:visible');
    const count=await visible.count();expect(count).toBeGreaterThan(0);
    await collapse.click();await expect(editor.locator('[data-control-section].is-collapsed:visible')).toHaveCount(count);
    await expect(collapse).toBeDisabled();await expect(expand).toBeEnabled();
    for(const section of await visible.all())await expect(section.locator('[data-collapse-module]').first()).toHaveAttribute('aria-expanded','false');
    // Startup and other UI refreshes may sync while the whole editor is hidden.
    await page.locator('#mapEditorCollapseBtn').click();
    await page.evaluate(()=>GeoGlyphControls.sync());
    await page.locator('#mapEditorCollapseBtn').click();
    await expect(expand).toBeEnabled();await expand.click();
    await expect(editor.locator('[data-control-section].is-collapsed:visible')).toHaveCount(0);
    for(const section of await visible.all())await expect(section.locator('[data-collapse-module]').first()).toHaveAttribute('aria-expanded','true');
    expect(await editor.locator('[data-control-section][hidden]').evaluateAll(nodes=>nodes.map(n=>[n.id,n.classList.contains('is-collapsed')]))).toEqual(hiddenBefore);
    await expect(page.locator('#mapArcgisReset123Btn')).toBeHidden();
    if(mode==='admin')await expect(page.locator('#mapArcgisAuth')).toBeVisible();
    else await expect(page.locator('#mapArcgisAuth')).toBeHidden();
  }
});
