const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),{pathToFileURL}=require('node:url');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
async function open(page){
  await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../../index.html')).href);
  await page.waitForFunction(()=>window.GeoGlyphMapEngine);
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
}
test('disk index exposes four modes, hides login outside ArcGIS and steps Poll',async({page})=>{
  await open(page);
  await expect(page.locator('[data-map-mode]')).toHaveText(['Message','Character','Geoglyph','ArcGIS']);
  await page.locator('[data-map-mode="arcgis"]').click();await expect(page.locator('#mapArcgisAuth')).toBeHidden();
  await page.locator('[data-map-mode="admin"]').click();await expect(page.locator('#mapArcgisAuth')).toBeVisible();await expect(page.locator('#mapArcgisReset123Btn')).toBeHidden();
  await page.locator('#mapArcgisInterval').fill('5');await page.locator('#mapArcgisIntervalPlus').click();await expect(page.locator('#mapArcgisInterval')).toHaveValue('6');await page.locator('#mapArcgisIntervalMinus').click();await expect(page.locator('#mapArcgisInterval')).toHaveValue('5');
  await page.locator('[data-map-mode="message"]').click();await expect(page.locator('#mapArcgisAuth')).toBeHidden();
});
test('disk Reset 123 validates login, confirms snapshot, deletes mocked records and stops polling',async({page})=>{
  const calls=[];let removed=false;
  await page.route('https://www.arcgis.com/sharing/rest/**',route=>route.fulfill({json:route.request().url().includes('/oauth2/token')?{access_token:'test-secret',expires_in:7200}:{username:'test-owner'},headers:{'access-control-allow-origin':'*'}}));
  await page.route('https://services.arcgis.com/**',route=>{
    const url=route.request().url(),p=Object.fromEntries(new URLSearchParams(route.request().postData()||''));calls.push({url,p});
    let json;
    if(url.endsWith('/FeatureServer'))json={layers:[{id:0,name:'survey'}]};
    else if(url.endsWith('/0'))json={name:'survey',capabilities:'Query,Delete'};
    else if(url.endsWith('/query'))json={objectIds:removed?[]:[1,2]};
    else if(url.endsWith('/deleteFeatures')){removed=true;json={deleteResults:[{objectId:1,success:true},{objectId:2,success:true}]};}
    else json={error:{code:400}};
    return route.fulfill({json,headers:{'access-control-allow-origin':'*'}});
  });
  await open(page);await page.locator('[data-map-mode="admin"]').click();
  const popup=page.waitForEvent('popup');await page.locator('#mapArcgisRequestTokenBtn').click();
  const signIn=await popup;await expect(page.locator('#mapArcgisAuthStatus')).toContainText('paste the returned code');
  await signIn.close();
  await page.locator('#mapArcgisToken').fill('test-code');await page.locator('#mapArcgisExchangeCodeBtn').click();await expect(page.locator('#mapArcgisAuthStatus')).toHaveText('Signed in as test-owner');await expect(page.locator('#mapArcgisToken')).toHaveValue('');
  await expect(page.locator('#mapArcgisReset123Btn')).toBeVisible();
  page.once('dialog',d=>d.dismiss());await page.locator('#mapArcgisReset123Btn').click();await expect(page.locator('#mapArcgisAuthStatus')).toHaveText('Reset 123 cancelled.');expect(removed).toBe(false);
  page.once('dialog',async d=>{expect(d.message()).toContain('2 survey responses');await d.accept();});
  await page.locator('#mapArcgisReset123Btn').click();await expect(page.locator('#mapArcgisAuthStatus')).toHaveText('Deleted and verified 2 survey responses. Polling is stopped.');
  expect(calls.filter(c=>c.url.endsWith('/deleteFeatures')).map(c=>c.p.objectIds)).toEqual(['1,2']);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  await page.locator('#mapArcgisClearTokenBtn').click();await expect(page.locator('#mapArcgisReset123Btn')).toBeHidden();
});
