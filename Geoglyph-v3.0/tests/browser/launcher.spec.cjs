const {test,expect}=require('../../apps/geoglyph/node_modules/@playwright/test');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {config}=require('../../apps/geoglyph/src/scripts/survey-results.js');
const rehearsal=require('../../apps/geoglyph/src/scripts/locate-2026-rehearsal.json');
const transitronURL='http://127.0.0.1:8090/';
const atApp=(url,route)=>route===transitronURL ? url.origin+url.pathname===transitronURL : url.pathname.endsWith('/'+route);
const withTransitron=test.extend({
  page:async({page},use,testInfo)=>{
    const {createDashboardServer}=require('../../apps/transitron/server.cjs');
    const server=await createDashboardServer({directory:testInfo.outputPath('recordings')});
    try{
      await new Promise((resolve,reject)=>server.once('error',reject).listen(0,'127.0.0.1',resolve));
      const local=`http://127.0.0.1:${server.address().port}`;
      await page.route(`${transitronURL}**`,async route=>{
        const {pathname,search}=new URL(route.request().url());
        if(pathname.startsWith('/api/gtfs/')) return route.fulfill({status:503});
        const response=await route.fetch({url:local+pathname+search});
        await route.fulfill({response});
      });
      await page.route('https://unpkg.com/maplibre-gl@5.24.0/**',route=>route.abort());
      await use(page);
    }finally{
      server.closeAllConnections();
      await new Promise(resolve=>server.close(resolve));
      await server.closeRecorder();
    }
  }
});
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const fields=['emojis','geoglyph_speaks','whats_on_your_mind','random_font','choose_a_font_font','choose_a_colour_colour','_2d_or_3d','fit','animation','_size_size','special_commands'];
const cue=(id,attributes={})=>({attributes:{objectid:id,CreationDate:1000+id,...attributes}});
const metadata=()=>({id:7,name:'Launcher cues',capabilities:'Query',objectIdField:'objectid',maxRecordCount:2,
  geometryType:'esriGeometryPoint',spatialReference:{wkid:4326},editFieldsInfo:{creationDateField:'CreationDate'},
  advancedQueryCapabilities:{supportsOrderBy:true,supportsPagination:true},
  fields:[{name:'objectid',type:'esriFieldTypeOID'},{name:'CreationDate',type:'esriFieldTypeDate'},...fields.map(name=>({name,type:'esriFieldTypeString'}))]});
const initial=cue(10,{special_commands:'Launch Geoglyph'});
const launcherUrl=portable=>portable?pathToFileURL(path.resolve(__dirname,'../../index.html')).href:'/';

async function setup(page,{portable=false,records=[initial],width=1440,hash='',collapsedMessage=false,realRehearsal=false,openLauncher=true}={}){
  const server={records:[...records],requests:[],queries:[],hold:null,holdEntered:false,failQueries:0},errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(({collapsedMessage,realRehearsal})=>{
    window.testDocumentId=Math.random();
    try{
      localStorage.setItem('geoglyph-locate2026.script-draft-v1',JSON.stringify({version:1,title:'Short launch regression introduction',rows:[{id:'short-intro',message:'',duration:.25,actions:[{type:'title',value:'Introduction via survey'}]}]}));
      if(collapsedMessage)localStorage.setItem('geoglyph-locate2026.geoglyph-controls-v1',JSON.stringify({geoglyphMapEditor:{mapMessageSection:true}}));
    }catch{}
    if(!realRehearsal){
      // Queue, routing and workspace tests use a short fixture script. The
      // rehearsal tests below exercise the actual authored sequence and assets.
      Object.defineProperty(window,'GeoGlyphScripts',{
        configurable:true,
        set(api){Object.defineProperty(window,'GeoGlyphScripts',{configurable:true,writable:true,value:{...api,playRehearsal:api.playConference}});}
      });
    }
  },{collapsedMessage,realRehearsal});
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.route(`${config.serviceUrl}**`,async route=>{
    const request=route.request(),url=new URL(request.url()),params=request.method()==='POST'?new URLSearchParams(request.postData()):url.searchParams;
    server.requests.push({url:request.url(),method:request.method(),params});
    if(url.pathname.endsWith('/FeatureServer'))return route.fulfill({json:{layers:[{id:7,name:'Launcher cues'}],tables:[]}});
    if(!url.pathname.endsWith('/query'))return route.fulfill({json:metadata()});
    server.queries.push(params);
    if(server.failQueries){server.failQueries--;return route.fulfill({status:503,body:'Temporary fixture outage'});}
    if(server.hold){const held=server.hold;server.hold=null;server.holdEntered=true;await held;}
    let rows=[...server.records];const where=params.get('where')||'';
    const after=/objectid\s*>\s*(\d+)/i.exec(where),before=/objectid\s*<\s*(\d+)/i.exec(where);
    if(after)rows=rows.filter(row=>row.attributes.objectid>Number(after[1]));
    if(before)rows=rows.filter(row=>row.attributes.objectid<Number(before[1]));
    if(/UPPER\(/i.test(where))rows=rows.filter(row=>/RESET GEOGLYPH|RETURN TO LAUNCHER/i.test(row.attributes.special_commands||''));
    rows.sort((a,b)=>(a.attributes.objectid-b.attributes.objectid)*(/DESC/i.test(params.get('orderByFields')||'')?-1:1));
    const offset=Number(params.get('resultOffset')||0),count=Math.min(2,Number(params.get('resultRecordCount')||2));
    try{await route.fulfill({json:{features:rows.slice(offset,offset+count),exceededTransferLimit:offset+count<rows.length}});}catch(error){if(!/closed|already handled|intercepted|invalid state/i.test(error.message))throw error;}
  });
  if(openLauncher){
    await page.goto(launcherUrl(portable)+hash);
    await page.waitForFunction(()=>window.GeoGlyphLauncherSurvey);
  }
  return {server,errors};
}
async function readyApp(page){
  await expect(page).toHaveURL(/\/apps\/geoglyph\/(?:index\.html|GeoGlyph_Locate_2026\.html|dist\/GeoGlyph\.html)/);
  await page.waitForFunction(()=>window.GeoGlyphConference?.state.ready&&window.GeoGlyphMapEngine?.state.mapReady,null,{timeout:60_000});
  expect(await page.evaluate(()=>GeoGlyphConference.state.error)).toBe('');
  await expect(page.locator('#suiteReturnLauncher')).toBeAttached();
}
async function waitForLauncherPolling(page,cursor=10){
  await page.waitForFunction(expected=>{
    const polling=window.GeoGlyphLauncherSurvey?.state();
    return polling?.active&&polling.cursor===expected&&!polling.busy;
  },cursor);
}
async function baseline(page){
  await waitForLauncherPolling(page);
  await openControls(page);
}
async function openControls(page){
  if(!await page.locator('#globe-panel').isVisible())await page.locator('#globe-settings').click();
  await expect(page.locator('#globe-panel')).toBeVisible();
}
async function expectProfile(page,{survey=false,visible=true}={}){
  await expect.poll(()=>page.evaluate(()=>({mode:GeoGlyphMapEngine.state.mode,visible:GeoGlyphMapSidebar.state().visible,presentation:GeoGlyphMapSidebar.state().presentation})))
    .toEqual({mode:survey?'arcgis':'message',visible,presentation:survey?'mini':'full'});
  await expect(page.locator(`[data-map-mode="${survey?'arcgis':'message'}"]`)).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#mapSidebarToggle')).toHaveAttribute('aria-expanded',String(visible));
  await expect(page.locator('#geoglyphMapEditor')).toBeVisible({visible});
  if(survey){
    await expect(page.locator('#mapControlSidebar')).toBeHidden();
    await expect(page.locator('#geoglyphMapEditor')).toHaveClass(/is-collapsed/);
  }else{
    await expect(page.locator('#mapControlSidebar')).toBeVisible();
    await expect(page.locator('#mapMessageSection')).toBeVisible();
    await expect(page.locator('#mapMessageSection')).not.toHaveClass(/is-collapsed/);
    await expect(page.locator('[data-collapse-module="mapMessageSection"]')).toHaveAttribute('aria-expanded','true');
  }
}
async function expectPresentation(page){
  await expect(page.locator('.app-header')).toBeHidden();
  await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
  await expect(page.locator('#geoglyphMapStats')).toBeHidden();
  await expect(page.locator('#geoglyphMap .maplibregl-ctrl-top-right')).toBeHidden();
  await expect.poll(()=>page.evaluate(()=>{
    const viewport=document.getElementById('geoglyphMapWorkspace').getBoundingClientRect();
    const canvas=GeoGlyphMapEngine.state.map.getCanvas().getBoundingClientRect();
    return [viewport,canvas].every(box=>box.x===0&&box.y===0&&box.width===innerWidth&&box.height===innerHeight);
  })).toBe(true);
}
async function leavePresentation(page){
  const exited=await page.evaluate(async()=>{
    if(!document.fullscreenElement)return false;
    await document.exitFullscreen();
    return true;
  });
  if(!exited)await page.keyboard.press('Escape');
  await expect(page.locator('.app-header')).toBeVisible();
}
async function applied(page,id){
  await page.waitForFunction(id=>GeoGlyphConference.state.lastAppliedId===id&&!GeoGlyphConference.state.applying,id,{timeout:60_000});
}
async function pollApp(page){
  await page.waitForFunction(()=>!GeoGlyphMapEngine.state.arcgisPollBusy);
  await page.evaluate(()=>document.getElementById('mapArcgisPollBtn').click());
}
async function countConferenceStarts(page,{duration=.25,title='Editable conference script'}={}){
  await page.evaluate(({duration,title})=>{
    GeoGlyphScripts.setDraft({version:1,title,rows:[{id:'begin-command-row',message:'',duration,actions:[{type:'title',value:title}]}]});
    window.conferenceStartCount=0;
    const scripts=GeoGlyphScripts;
    window.GeoGlyphScripts={...scripts,playRehearsal:async options=>{window.conferenceStartCount++;return scripts.playConference(options);}};
  },{duration,title});
}

for(const portable of [false,true])test(`SID jukebox plays the Galway themes and Cybernoid (${portable?'file':'HTTP'})`,async({page})=>{
  const {errors}=await setup(page,{portable,openLauncher:false});
  if(portable)await page.addInitScript(()=>{window.__UOS_AUDIO_TEST__={forceScriptProcessor:true};});
  await page.goto(launcherUrl(portable));
  const jukebox=page.locator('#audio-jukebox > summary');
  const select=page.locator('#audio-track'),play=page.locator('#audio-toggle');
  const backend=portable?'scriptprocessor':'audio-worklet';
  const tracks=[
    ['Wizball Theme','Martin Galway',4],
    ['Combat School Theme','Martin Galway',1],
    ['Arkanoid Theme','Martin Galway',1],
    ['Parallax Theme','Martin Galway',1],
    ['Cybernoid','Jeroen Tel',1]
  ];
  await jukebox.click();
  for(const [index,[title,composer,subtune]] of tracks.entries()){
    await select.selectOption({label:title+' — '+composer});
    if(index===0){await play.click();await jukebox.click();}
    await page.waitForFunction(({title,subtune,backend})=>{
      const audio=UOSAudio.stats();
      return audio.title===title&&audio.subtune===subtune&&audio.backend===backend&&
        audio.scheduler&&audio.elapsed>.25&&audio.pcmRms>.001;
    },{title,subtune,backend});
  }
  await page.locator('#audio-next').click();
  await page.waitForFunction(()=>UOSAudio.stats().title==='Cybernoid II'&&UOSAudio.stats().elapsed>.25);
  expect(await page.evaluate(()=>UOSAudio.stats().contextsCreated)).toBe(1);
  await play.click();
  expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`Geoglyph logo follows its visible outline without mouse hover effects (${portable?'file':'HTTP'})`,async({page})=>{
  const {errors}=await setup(page,{portable});
  await page.waitForFunction(()=>document.querySelector('#open-geoglyph img').complete);
  const original=page.url();
  for(const viewport of [{width:1440,height:1000},{width:390,height:844},{width:844,height:390}]){
    await page.setViewportSize(viewport);
    const box=await page.locator('#open-geoglyph img').boundingBox();
    // Transparent corners and inset edges must pass through the link; the
    // UFO, lettering and main body remain clickable at every layout size.
    const samples=[
      [.02,.02,false],[.5,.02,false],[.98,.02,false],[.02,.98,false],[.98,.98,false],
      [.35,.2,false],[.85,.9,false],
      [.5,.5,true],[.8,.25,true],[.2,.7,true],[.95,.4,true]
    ];
    for(const [u,v,expected]of samples){
      const point={x:box.x+box.width*u,y:box.y+box.height*v};
      await page.mouse.move(point.x,point.y);
      expect(await page.evaluate(point=>Boolean(document.elementFromPoint(point.x,point.y)?.closest('#open-geoglyph')),point)).toBe(expected);
      expect(await page.locator('#open-geoglyph').evaluate(node=>getComputedStyle(node).filter)).toBe('none');
      if(!expected){await page.mouse.click(point.x,point.y);expect(page.url()).toBe(original);}
    }
  }
  // Pointer events on the SVG bubble to the existing link navigation. Keyboard
  // access remains available even though the rectangular anchor passes clicks through.
  const link=page.locator('#open-geoglyph');await link.focus();
  await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  expect(await page.locator('#geoglyph-hit-outline').evaluate(node=>getComputedStyle(node).stroke)).toBe('rgb(189, 252, 255)');
  await page.keyboard.press(portable?'Space':'Enter');await readyApp(page);await expectProfile(page);
  expect(errors).toEqual([]);
});

for(const portable of [false,true]){
  const label=portable?'file':'HTTP';
  test(`launcher polls with controls closed, and polls again after returning from Geoglyph (${label})`,async({page})=>{
    const {server,errors}=await setup(page,{portable,width:portable?390:1440,collapsedMessage:true});
    await expect(page).toHaveTitle('ChatGPT Experiments — Launcher');
    await expect(page.locator('#launcher-title img')).toHaveAttribute('src','assets/Retro UFO ChatGPT Experiments Logo.png');
    await expect(page.locator('#open-geoglyph img')).toHaveAttribute('src','assets/Retro Geoglyph UFO Sticker-updated.png');
    await expect(page.locator('#open-geoglyph')).toHaveAccessibleName('Launch Geoglyph');
    await expect(page.locator('#globe-settings')).toHaveAccessibleName('Launcher controls');
    await expect(page.locator('#globe-panel')).toBeHidden();
    expect(await page.locator('#globe-panel #suiteSurvey').count()).toBe(1);
    await expect(page.locator('#open-gdb-explorer,#open-arcgis-online-explorer,#corner-logo')).toHaveCount(0);
    expect(await page.locator('a[href*="gdb/"],a[href*="online/"]').count()).toBe(0);
    await waitForLauncherPolling(page);
    await expect(page.locator('#suiteSurveyStart')).toBeDisabled();
    await expect(page.locator('#suiteSurveyStop')).toBeEnabled();
    expect(server.queries.some(query=>query.get('where')==='1=1')).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await openControls(page);
    await page.locator('#suiteSurveyStop').click();
    await page.keyboard.press('Escape');
    await page.locator('#open-geoglyph').click();await readyApp(page);await expectProfile(page);
    expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
    const queriesBeforeReturn=server.queries.length;
    await page.locator('#suiteReturnLauncher').click();await waitForLauncherPolling(page);
    expect(server.queries.length).toBeGreaterThan(queriesBeforeReturn);
    expect(errors).toEqual([]);
  });
  test(`new launch commands transfer polling cursor; later Begin, Reset and messages apply once (${label})`,async({page})=>{
    const {server,errors}=await setup(page,{portable});await baseline(page);
    // Historical Launch is baselined rather than executed.
    await expect(page.locator('#open-geoglyph')).toBeVisible();
    await page.locator('#suiteSurveyInterval').fill('2');await page.locator('#suiteSurveyInterval').dispatchEvent('change');
    server.records.push(cue(11,{special_commands:'  lAuNcH Geoglyph  '}),cue(12,{special_commands:'Begin Geoglyph'}));
    await page.locator('#suiteSurveyFetch').click();await readyApp(page);await applied(page,12);await expectProfile(page,{survey:true,visible:false});
    expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
    expect(await page.locator('#mapArcgisInterval').inputValue()).toBe('2');
    expect(await page.evaluate(()=>GeoGlyphConference.state.phase)).toBe('live');
    // Launch preferences apply once, rather than overriding later user choices.
    await page.evaluate(()=>GeoGlyphMapSidebar.setPresentation('full'));
    const art=await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,font:GeoGlyphMapEngine.state.selectedFontId,anchor:{...GeoGlyphMapEngine.state.anchor}}));
    const identity=await page.evaluate(()=>testDocumentId);
    server.records.push(cue(13,{special_commands:'Launch Geoglyph'}));
    await page.evaluate(()=>document.getElementById('mapArcgisPollBtn').click());await applied(page,13);
    expect(await page.evaluate(()=>testDocumentId)).toBe(identity);
    expect(await page.evaluate(()=>GeoGlyphMapSidebar.state().presentation)).toBe('full');
    expect(await page.evaluate(()=>GeoGlyphMapEngine.state.mode)).toBe('arcgis');
    expect(await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,font:GeoGlyphMapEngine.state.selectedFontId,anchor:{...GeoGlyphMapEngine.state.anchor}}))).toEqual(art);
    const beforeReset=await page.evaluate(()=>GeoGlyphMapEngine.state.message);
    server.records.push(cue(14,{special_commands:'Reset Geoglyph'}));
    await page.evaluate(()=>document.getElementById('mapArcgisPollBtn').click());await applied(page,14);
    expect(await page.evaluate(()=>GeoGlyphConference.state.phase)).toBe('overview');
    server.records.push(cue(15,{emojis:'😎'}));
    await page.evaluate(()=>document.getElementById('mapArcgisPollBtn').click());await applied(page,15);
    expect(await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,nativeColor:GeoGlyphMapEngine.state.nativeColor}))).toEqual({message:'😎',nativeColor:true});
    expect(beforeReset).toBe('😴');
    const history=await page.evaluate(()=>GeoGlyphConference.state.history);
    for(const id of [12,14,15])expect(history.filter(row=>row.objectId===id&&row.phase==='applied')).toHaveLength(1);
    expect(history.filter(row=>row.objectId===13&&row.phase==='launch-acknowledged')).toHaveLength(1);
    expect(history.some(row=>row.objectId===10||row.objectId===11)).toBe(false);
    await expectPresentation(page);
    await leavePresentation(page);
    await page.locator('#suiteReturnLauncher').click();await page.waitForFunction(()=>window.GeoGlyphLauncherSurvey);
    await page.waitForFunction(()=>GeoGlyphLauncherSurvey.state().active&&!GeoGlyphLauncherSurvey.state().busy);
    expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().cursor)).toBe(15);
    expect(await page.locator('#suiteSurveyInterval').inputValue()).toBe('2');
    await openControls(page);await page.locator('#suiteSurveyStop').click();expect(errors).toEqual([]);
  });
}

test('unknown targets stay on the launcher and stopped Fetch does not resume polling in Geoglyph',async({page})=>{
  const {server,errors}=await setup(page);
  await baseline(page);
  await page.locator('#suiteSurveyStop').click();
  server.records.push(cue(11,{special_commands:'Launch https://untrusted.example/'}));
  await page.locator('#suiteSurveyFetch').click();await expect(page.locator('#suiteSurveyStatus')).toContainText('Unknown launch target');
  await expect(page.locator('#open-geoglyph')).toBeVisible();
  server.records.push(cue(12,{special_commands:'Launch Geoglyph'}));
  await page.locator('#suiteSurveyFetch').click();await readyApp(page);await expectProfile(page,{survey:true});
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  const queries=server.queries.length;await page.waitForTimeout(350);expect(server.queries).toHaveLength(queries);expect(errors).toEqual([]);
});

test('Stop aborts a held survey result so it cannot navigate later',async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);
  let release;server.hold=new Promise(resolve=>{release=resolve;});server.records.push(cue(11,{special_commands:'Launch Geoglyph'}));
  await page.locator('#suiteSurveyFetch').click();await expect.poll(()=>server.holdEntered).toBe(true);
  await page.locator('#suiteSurveyStop').click();release();await page.waitForTimeout(400);
  await expect(page.locator('#open-geoglyph')).toBeVisible();expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().active)).toBe(false);
  expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().cursor)).toBe(10);expect(errors).toEqual([]);
});

test('temporary query failure retains the cursor and Start retries without replaying history',async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);await page.locator('#suiteSurveyStop').click();
  server.failQueries=1;await page.locator('#suiteSurveyFetch').click();await expect(page.locator('#suiteSurveyStatus')).toContainText('503');
  expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().cursor)).toBe(10);
  server.records.push(cue(11,{special_commands:'Launch Geoglyph'}));await page.locator('#suiteSurveyStart').click();await readyApp(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`malformed handoff never starts survey polling (${portable?'file':'HTTP'})`,async({page})=>{
  const {server,errors}=await setup(page,{portable,hash:'#suite=%7B%22version%22%3A99%2C%22active%22%3Atrue%7D'});
  await page.waitForFunction(()=>window.GeoGlyphLauncherSurvey);await expect(page.locator('#suiteSurveyStatus')).toContainText('Polling remains stopped');
  expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().active)).toBe(false);await page.waitForTimeout(250);expect(server.requests).toEqual([]);expect(errors).toEqual([]);
});

for(const output of ['GeoGlyph_Locate_2026.html','dist/GeoGlyph.html'])test(`standalone ${output} accepts a stopped handoff and returns to the suite launcher`,async({page})=>{
  const {server,errors}=await setup(page,{openLauncher:false});
  const destination=pathToFileURL(path.resolve(__dirname,'../../apps/geoglyph',output));
  destination.hash=new URLSearchParams({suite:JSON.stringify({version:1,app:'geoglyph',source:config.serviceUrl,cursor:10,layerId:7,interval:3,active:false})}).toString();
  await page.goto(destination.href);await readyApp(page);
  await expectProfile(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  expect(await page.locator('#mapArcgisInterval').inputValue()).toBe('3');
  expect(server.requests).toEqual([]);
  await page.locator('#suiteReturnLauncher').click();await waitForLauncherPolling(page);
  expect(new URL(page.url()).pathname).toBe(path.resolve(__dirname,'../../index.html'));
  expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().interval)).toBe(3);
  expect(server.queries.some(query=>query.get('where')==='objectid>10')).toBe(true);
  expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`alien opens the remote control QR code (${portable?'file':'HTTP'} launcher)`,async({page})=>{
  const {errors}=await setup(page,{portable,width:portable?360:1440});
  const trigger=page.getByRole('button',{name:'Open Geoglyph remote control QR code'});
  const dialog=page.getByRole('dialog',{name:"Geoglyph's remote control"});
  const originalUrl=page.url();
  const head=await trigger.evaluate(node=>new DOMPoint(770,90).matrixTransform(node.getScreenCTM()).toJSON());
  await page.mouse.click(head.x,head.y);
  await expect(dialog).toBeVisible();
  const graphic=dialog.getByRole('img');
  await expect.poll(()=>graphic.evaluate(image=>image.naturalWidth)).toBe(2048);
  const box=await graphic.boundingBox();
  const viewport=page.viewportSize();
  expect(box.width).toBeGreaterThan(Math.min(viewport.width,viewport.height)*.8);
  expect(box.x+box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y+box.height).toBeLessThanOrEqual(viewport.height);
  const close=dialog.getByRole('button',{name:'Close remote control QR code'});
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await expect(dialog).toBeVisible();
  await close.click();
  await expect(dialog).toBeHidden();
  await trigger.press('Space');
  await expect(dialog).toBeVisible();
  await page.mouse.click(2,2);
  await expect(dialog).toBeHidden();
  expect(page.url()).toBe(originalUrl);
  expect(errors).toEqual([]);
});

test('Survey Return to Launcher resumes polling from the command cursor',async({page})=>{
  const {server,errors}=await setup(page,{portable:true});
  await baseline(page);
  server.records.push(cue(11,{special_commands:'Launch Geoglyph'}));
  await page.locator('#suiteSurveyFetch').click();
  await readyApp(page);
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.arcgisPolling);
  await page.evaluate(()=>GeoGlyphConference.pause());
  server.records.push(cue(12,{special_commands:' Return to Launcher '}));
  await waitForLauncherPolling(page,12);
  await expect(page.locator('#open-geoglyph')).toBeVisible();
  expect(server.queries.some(query=>query.get('where')==='objectid>12')).toBe(true);
  server.records.push(cue(13,{special_commands:'Launch Geoglyph'}));
  await readyApp(page);
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.arcgisPolling);
  expect(errors).toEqual([]);
});

for(const width of [320,390,1440])test(`app header keeps its logo, controls and accessible Return button inside ${width}px`,async({page})=>{
  const {errors}=await setup(page,{width});
  await page.locator('#open-geoglyph').click();await readyApp(page);
  const back=page.locator('#suiteReturnLauncher'),logo=page.locator('#mapSidebarToggle');
  await expect(back).toHaveAccessibleName('Return to launcher');await expect(back).toHaveAttribute('data-hover-tip','Return to launcher');
  await back.hover();await expect(page.locator('#uosHoverTip')).toContainText('Return to launcher');
  await expect(page.locator('#uosHoverTip')).toHaveAttribute('aria-hidden','false');
  await expect(back.locator('svg')).toBeVisible();await expect(logo).toBeVisible();
  if(width<=650)await expect(back.locator('span')).toBeHidden();else await expect(back.locator('span')).toBeVisible();
  const geometry=await page.evaluate(()=>{
    const rect=element=>{const box=element.getBoundingClientRect();return {left:box.left,right:box.right,width:box.width,top:box.top,bottom:box.bottom};};
    const back=document.getElementById('suiteReturnLauncher');
    return {logo:rect(document.getElementById('mapSidebarToggle')),back:rect(back),icon:rect(back.querySelector('svg')),
      controls:['headerSaveBtn','headerLoadBtn','themeDarkBtn','themeLightBtn','aboutBtn'].map(id=>{
        const node=document.getElementById(id);return {id,exists:!!node,...(node?rect(node):{})};
      })};
  });
  for(const box of [geometry.logo,geometry.back,geometry.icon]){
    expect(box.width).toBeGreaterThan(0);expect(box.left).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(width);
  }
  const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  expect(overlaps(geometry.logo,geometry.back),JSON.stringify(geometry)).toBe(false);
  expect(geometry.icon.left).toBeGreaterThanOrEqual(geometry.back.left);expect(geometry.icon.right).toBeLessThanOrEqual(geometry.back.right);
  for(const box of geometry.controls){
    expect(box.exists,box.id).toBe(true);expect(box.width,box.id).toBeGreaterThan(0);expect(box.left,box.id).toBeGreaterThanOrEqual(0);
    expect(box.right,box.id).toBeLessThanOrEqual(width);
    expect(overlaps(box,geometry.logo),JSON.stringify(geometry)).toBe(false);expect(overlaps(box,geometry.back),JSON.stringify(geometry)).toBe(false);
    await expect(page.locator('#'+box.id)).toBeVisible();
  }
  if(width>650)expect(await back.evaluate(node=>node.scrollWidth<=node.clientWidth)).toBe(true);
  await back.click();await expect(page.locator('#open-geoglyph')).toBeVisible();expect(errors).toEqual([]);
});

test('browser Back starts polling on the launcher and accepts Begin without opening controls',async({page})=>{
  const {server,errors}=await setup(page,{portable:true});
  await waitForLauncherPolling(page);
  await page.locator('#open-geoglyph').click();await readyApp(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  await page.goBack();await expect(page.locator('#open-geoglyph')).toBeVisible();
  await waitForLauncherPolling(page);
  await expect(page.locator('#globe-panel')).toBeHidden();
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));
  await readyApp(page);await expectProfile(page,{survey:true,visible:false});await applied(page,11);
  expect(errors).toEqual([]);
});

for(const [width,height] of [[320,568],[390,844],[844,390],[1440,900],[1920,1080]])test(`launcher artwork clears the saucer orbit and keeps Survey123 accessible (${width}×${height})`,async({page})=>{
  const {server,errors}=await setup(page,{width});
  await page.setViewportSize({width,height});
  await page.waitForFunction(()=>[...document.querySelectorAll('#launcher-title img,#logo-launcher img')].every(image=>image.complete&&image.naturalWidth>0));
  await expect(page.locator('#globe-panel')).toBeHidden();
  const {title,logos,car,controls,globe}=await page.evaluate(()=>{
    const box=element=>element.getBoundingClientRect().toJSON();
    const artwork=image=>({...box(image),naturalRatio:image.naturalWidth/image.naturalHeight,objectFit:getComputedStyle(image).objectFit});
    const wrap=document.querySelector('#wrap'),orbit=box(wrap);
    const globeSpan=orbit.width/Number(getComputedStyle(wrap).getPropertyValue('--globe-viewport'));
    // Include the saucer's radial height and halo, at the largest globe scale.
    const radius=globeSpan/2*Number(document.querySelector('#control-scale').max)*Math.hypot(1.18+.025,.052);
    return {title:artwork(document.querySelector('#launcher-title img')),
      logos:[...document.querySelectorAll('#logo-launcher img')].map(artwork),
      car:box(document.querySelector('#alien-car')),controls:box(document.querySelector('#audio-ui')),
      globe:{x:orbit.x+orbit.width/2,y:orbit.y+orbit.height/2,radius}};
  });
  for(const image of [title,...logos]){
    expect(image.width).toBeGreaterThan(44);expect(image.height).toBeGreaterThan(44);
    expect(image.left).toBeGreaterThanOrEqual(0);expect(image.right).toBeLessThanOrEqual(width);
    expect(image.top).toBeGreaterThanOrEqual(0);expect(image.bottom).toBeLessThanOrEqual(height);
    expect(image.width/image.height).toBeCloseTo(image.naturalRatio,2);expect(image.objectFit).not.toBe('cover');
  }
  const overlaps=(a,b)=>a.right>b.left&&b.right>a.left&&a.bottom>b.top&&b.bottom>a.top;
  expect(controls.top-car.bottom).toBeGreaterThanOrEqual(4);
  expect(controls.bottom).toBeLessThanOrEqual(height-14);
  expect(logos[1].left-logos[0].left).toBeGreaterThanOrEqual(10);
  expect(logos[2].left-logos[3].left).toBeGreaterThanOrEqual(10);
  for(const [index,logo] of logos.entries()){
    expect(width-logo.right).toBeGreaterThanOrEqual(14);
    expect(logo.top).toBeGreaterThanOrEqual(16);
    expect(height-logo.bottom).toBeGreaterThanOrEqual(16);
    expect([title,car,controls].some(box=>overlaps(box,logo))).toBe(false);
    if(index)expect(logo.top-logos[index-1].bottom).toBeGreaterThanOrEqual(7);
    const nearestX=Math.max(logo.left-globe.x,globe.x-logo.right,0);
    const nearestY=Math.max(logo.top-globe.y,globe.y-logo.bottom,0);
    expect(Math.hypot(nearestX,nearestY)-globe.radius).toBeGreaterThanOrEqual(8);
  }
  const jukebox=page.locator('#audio-jukebox > summary'),musicPanel=page.locator('.sid-panel');
  await jukebox.click();
  await expect(musicPanel).toBeVisible();
  const popup=await musicPanel.boundingBox();
  expect(popup.x).toBeGreaterThanOrEqual(14);
  expect(popup.x+popup.width).toBeLessThanOrEqual(width-14);
  expect(popup.y).toBeGreaterThanOrEqual(0);
  expect(popup.y+popup.height).toBeLessThan(controls.top);
  await jukebox.click();
  await expect(musicPanel).toBeHidden();
  await page.locator('#open-geoglyph').focus();await expect(page.locator('#open-geoglyph')).toBeFocused();
  await openControls(page);
  expect(await page.locator('#globe-panel #suiteSurveyStart,#globe-panel #suiteSurveyFetch,#globe-panel #suiteSurveyStop,#globe-panel #suiteSurveyInterval,#globe-panel #suiteSurveyStatus').count()).toBe(5);
  const order=await page.evaluate(()=>document.getElementById('suiteSurvey').compareDocumentPosition(document.getElementById('control-autoRotate'))&Node.DOCUMENT_POSITION_FOLLOWING);
  expect(order).toBeTruthy();
  await page.locator('#suiteSurveyInterval').fill('2');await page.locator('#suiteSurveyInterval').dispatchEvent('change');
  await baseline(page);
  await page.locator('#globe-panel').evaluate(node=>{node.scrollTop=node.scrollHeight;});
  await page.locator('#reset-globe').click();
  expect(await page.evaluate(()=>({active:GeoGlyphLauncherSurvey.state().active,interval:GeoGlyphLauncherSurvey.state().interval,cursor:GeoGlyphLauncherSurvey.state().cursor}))).toEqual({active:true,interval:2,cursor:10});
  await page.keyboard.press('Escape');await expect(page.locator('#globe-panel')).toBeHidden();await expect(page.locator('#globe-settings')).toBeFocused();
  expect(server.queries.length).toBeGreaterThan(0);expect(errors).toEqual([]);
});

for(const entry of ['http-index','file-index','GeoGlyph_Locate_2026.html','dist/GeoGlyph.html'])test(`direct ${entry} entry forces Message expanded once and preserves later choices`,async({page})=>{
  const {server,errors}=await setup(page,{collapsedMessage:true,openLauncher:false});
  const url=entry==='http-index'?'/apps/geoglyph/index.html':pathToFileURL(path.resolve(__dirname,'../../apps/geoglyph',entry==='file-index'?'index.html':entry)).href;
  await page.goto(url);await readyApp(page);await expectProfile(page);
  await page.locator('[data-collapse-module="mapMessageSection"]').click();
  await expect(page.locator('#mapMessageSection')).toHaveClass(/is-collapsed/);
  await page.locator('[data-map-mode="arcgis"]').click();
  await page.locator('[data-map-mode="message"]').click();
  await expect(page.locator('#mapMessageSection')).toHaveClass(/is-collapsed/);
  await page.evaluate(()=>GeoGlyphMapSidebar.setPresentation('mini'));
  await page.evaluate(()=>GeoGlyphConference.retryStartup());
  expect(await page.evaluate(()=>({mode:GeoGlyphMapEngine.state.mode,presentation:GeoGlyphMapSidebar.state().presentation}))).toEqual({mode:'message',presentation:'mini'});
  expect(server.requests).toEqual([]);expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`an ordinary logo launch preserves Message mode until Begin Geoglyph explicitly starts the script (${portable?'file':'HTTP'})`,async({page})=>{
  const {server,errors}=await setup(page,{portable,collapsedMessage:true});await baseline(page);
  await page.locator('#open-geoglyph').click();await readyApp(page);await expectProfile(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  server.records.push(cue(11,{special_commands:'  bEgIn gEoGlYpH  '}));
  await page.evaluate(()=>document.getElementById('mapArcgisPollBtn').click());
  await applied(page,11);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.mode)).toBe('arcgis');
  expect(await page.evaluate(()=>GeoGlyphConference.state.phase)).toBe('live');
  expect(await page.evaluate(()=>GeoGlyphMapSidebar.state().presentation)).toBe('full');
  await expectPresentation(page);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('a launch already queued in Message mode does not reapply the survey entry profile',async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);
  server.records.push(cue(11,{special_commands:'Launch Geoglyph'}));await page.locator('#suiteSurveyFetch').click();await readyApp(page);await expectProfile(page,{survey:true});
  await page.evaluate(()=>GeoGlyphMapSidebar.setPresentation('full'));
  await page.locator('[data-map-mode="message"]').click();
  server.records.push(cue(12,{special_commands:'Launch Geoglyph'}));
  await page.evaluate(()=>GeoGlyphMapEngine.startPolling());
  await page.waitForFunction(()=>GeoGlyphConference.state.lastQueuedId===12);
  await expectProfile(page);
  const identity=await page.evaluate(()=>testDocumentId);
  await page.locator('[data-map-mode="arcgis"]').click();
  await page.evaluate(()=>document.getElementById('mapArcgisPollBtn').click());await applied(page,12);
  expect(await page.evaluate(()=>testDocumentId)).toBe(identity);
  expect(await page.evaluate(()=>GeoGlyphMapSidebar.state().presentation)).toBe('full');
  expect(await page.evaluate(()=>GeoGlyphConference.state.history.filter(row=>row.objectId===12&&row.phase==='launch-acknowledged').length)).toBe(1);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('failed startup and font retry keep the ordinary entry defaults and later user changes',async({page})=>{
  const {server,errors}=await setup(page,{collapsedMessage:true,openLauncher:false});let unavailable=true;
  await page.route('**/GILLUBCD.TTF',route=>unavailable?route.fulfill({status:404,body:'Fixture font unavailable'}):route.continue());
  await page.goto('/apps/geoglyph/index.html');
  await page.waitForFunction(()=>Boolean(window.GeoGlyphConference?.state.error));
  expect(await page.evaluate(()=>GeoGlyphConference.state.ready)).toBe(false);
  await expectProfile(page);
  await page.locator('[data-collapse-module="mapMessageSection"]').click();
  await page.evaluate(()=>GeoGlyphMapSidebar.setPresentation('mini'));
  unavailable=false;
  expect(await page.evaluate(()=>GeoGlyphConference.retryStartup())).toBe(true);
  await readyApp(page);
  expect(await page.evaluate(()=>({mode:GeoGlyphMapEngine.state.mode,presentation:GeoGlyphMapSidebar.state().presentation}))).toEqual({mode:'message',presentation:'mini'});
  await expect(page.locator('#mapMessageSection')).toHaveClass(/is-collapsed/);
  expect(server.requests).toEqual([]);expect(errors).toEqual([]);
});

for(const portable of [false,true])test(`Launch Geoglyph only opens the app; Begin Geoglyph starts the editable script (${portable?'file':'HTTP'})`,async({page})=>{
  const {server,errors}=await setup(page,{portable});await baseline(page);
  server.records.push(cue(11,{special_commands:'Launch Geoglyph'}));await page.locator('#suiteSurveyFetch').click();
  await readyApp(page);await expectProfile(page,{survey:true});
  expect(await page.evaluate(()=>({phase:GeoGlyphConference.state.phase,running:GeoGlyphScripts.state().running,history:GeoGlyphConference.state.history})))
    .toEqual({phase:'overview',running:false,history:[]});
  await countConferenceStarts(page,{title:'Current editable conference draft'});
  server.records.push(cue(12,{special_commands:'  BEGIN GeoGLYPH  '}));await pollApp(page);await applied(page,12);
  await expectProfile(page,{survey:true,visible:false});
  expect(await page.evaluate(()=>conferenceStartCount)).toBe(1);
  expect(await page.evaluate(()=>GeoGlyphConference.state.phase)).toBe('live');
  expect(await page.evaluate(()=>GeoGlyphConference.state.history.filter(row=>row.objectId===12&&row.phase==='applied').length)).toBe(1);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('mini panel can begin and reset with Survey123 unavailable',async({page})=>{
  const {errors}=await setup(page,{portable:true,width:360});
  await page.route(`${config.serviceUrl}**`,route=>route.fulfill({status:503,body:'Survey unavailable'}));
  await page.locator('#open-geoglyph').click();await readyApp(page);
  await expect(page.locator('#mapLocalBeginBtn')).toBeHidden();
  await page.locator('#mapEditorCollapseBtn').click();
  await expect(page.locator('.map-editor-titleblock')).toBeHidden();
  const clippedButtons=await page.locator('#geoglyphMapEditor').evaluate(panel=>{
    const bounds=panel.getBoundingClientRect();
    return [...panel.querySelectorAll('.map-editor-head button')].filter(button=>{
      if(!button.getClientRects().length)return false;
      const rect=button.getBoundingClientRect();
      return rect.left<bounds.left||rect.right>bounds.right||rect.top<bounds.top||rect.bottom>bounds.bottom;
    }).map(button=>button.id);
  });
  expect(clippedButtons).toEqual([]);
  await page.getByRole('button',{name:'Begin Geoglyph',exact:true}).click();
  await expectPresentation(page);
  await page.waitForFunction(()=>GeoGlyphConference.state.phase==='live');
  await leavePresentation(page);
  await page.locator('#mapSidebarToggle').click();
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await page.waitForFunction(()=>GeoGlyphConference.state.phase==='overview'&&!GeoGlyphConference.state.applying);
  expect(await page.evaluate(()=>({message:GeoGlyphMapEngine.state.message,polling:GeoGlyphMapEngine.state.arcgisPolling,
    lastApplied:GeoGlyphConference.state.lastAppliedId}))).toEqual({message:'😴',polling:false,lastApplied:null});
  expect(errors).toEqual([]);
});

test('a stopped Fetch can launch Begin Geoglyph without starting a poller',async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);
  await page.addInitScript(()=>{
    Object.defineProperty(navigator,'userActivation',{value:{isActive:false}});
    const query=navigator.permissions.query.bind(navigator.permissions);
    navigator.permissions.query=descriptor=>descriptor.name==='fullscreen'?Promise.resolve({state:'denied'}):query(descriptor);
  });
  await page.locator('#suiteSurveyStop').click();
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));
  await page.locator('#suiteSurveyFetch').click();await readyApp(page);await expectProfile(page,{survey:true,visible:false});
  await applied(page,11);
  await expectPresentation(page);
  expect(await page.evaluate(()=>document.fullscreenElement)).toBeNull();
  const anchor=await page.evaluate(()=>({...GeoGlyphMapEngine.state.anchor}));
  await page.locator('#geoglyphMap .maplibregl-canvas').click({position:{x:100,y:100}});
  await page.waitForFunction(()=>document.fullscreenElement===document.documentElement);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.anchor)).toEqual(anchor);
  await expectPresentation(page);
  await leavePresentation(page);
  await page.locator('#mapSidebarToggle').click();
  await expectProfile(page,{survey:true});
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(false);
  expect(await page.evaluate(()=>GeoGlyphConference.state.history.filter(row=>row.objectId===11&&row.phase==='started').length)).toBe(1);
  expect(server.queries.some(params=>params.get('where')==='objectid>11')).toBe(false);
  expect(errors).toEqual([]);
});

test('leaving browser fullscreen restores the header during Begin playback',async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);
  await page.addInitScript(()=>{
    const matchMedia=window.matchMedia.bind(window);
    const fullscreen=new EventTarget();
    fullscreen.matches=true;
    window.matchMedia=query=>query==='(display-mode: fullscreen)'?fullscreen:matchMedia(query);
    window.leaveBrowserFullscreen=()=>{
      fullscreen.matches=false;
      fullscreen.dispatchEvent(new Event('change'));
    };
  });
  await page.locator('#open-geoglyph').click();await readyApp(page);
  await countConferenceStarts(page,{duration:30});
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));await pollApp(page);
  await page.waitForFunction(()=>GeoGlyphScripts.state().phase==='waiting');
  await expectPresentation(page);
  expect(await page.evaluate(()=>document.fullscreenElement)).toBeNull();
  await page.evaluate(()=>leaveBrowserFullscreen());
  await expect(page.locator('.app-header')).toBeVisible();
  expect(await page.evaluate(()=>GeoGlyphScripts.state().running)).toBe(true);
  await page.evaluate(()=>{GeoGlyphScripts.stop();GeoGlyphMapEngine.stopPolling({quiet:true});});
  expect(errors).toEqual([]);
});

test('launcher lists the four logos and reports the unlinked Assassin’s Leaves command',async({page})=>{
  const {server,errors}=await setup(page,{width:390});
  const order=['geoglyph','transitron','panoptigon','umbramatic'];
  expect(await page.locator('[data-launch-app]').evaluateAll(nodes=>nodes.map(node=>node.dataset.launchApp))).toEqual(order);
  await baseline(page);
  server.records.push(cue(11,{special_commands:'  lAuNcH Assassin\'s Leaves  '}));
  await page.locator('#suiteSurveyFetch').click();
  await expect.poll(()=>page.evaluate(()=>GeoGlyphLauncherSurvey.state().cursor)).toBe(11);
  await expect(page.locator('#suiteLaunchStatus')).toContainText('Assassin’s Leaves hasn’t been linked yet');
  expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().active)).toBe(true);
  expect(await page.evaluate(()=>GeoGlyphLauncherSurvey.state().cursor)).toBe(11);
  expect(errors).toEqual([]);
});

for(const portable of [false,true])withTransitron(`imported app logos and Survey123 commands round trip (${portable?'file':'HTTP'})`,async({page})=>{
  const {server,errors}=await setup(page,{portable,width:portable?390:1440});
  // This routing check can run without the map library CDN.
  await page.route('https://unpkg.com/maplibre-gl@5.13.0/**',route=>route.abort());
  await baseline(page);
  await page.evaluate(()=>GeoGlyphLauncherSurvey.setInterval(60));
  const routes=[
    ['panoptigon','apps/panoptigon/index.html','Launch Panoptigon'],
    ['umbramatic','apps/umbramatic/ShadowPlayer/index.html','Launch Umbramatic'],
    ['transitron',transitronURL,'Launch Transitron']
  ];
  async function checkReturn(target,route,cursor,active){
    await expect.poll(()=>atApp(new URL(page.url()),route)).toBe(true);
    if(target==='transitron')await page.getByRole('button',{name:'Enter dashboard'}).click();
    const back=page.getByRole('link',{name:/^return to launcher$/i});
    await expect.poll(()=>back.evaluate(node=>{
      const fragment=new URL(node.href).hash;
      return fragment?JSON.parse(new URLSearchParams(fragment.slice(1)).get('suite')):null;
    })).toMatchObject({app:'launcher',returnFrom:target,cursor,active,interval:60,layerId:7});
    if(target==='panoptigon'){
      await page.waitForFunction(()=>typeof document.getElementById('importBtn')?.onclick==='function');
      await page.getByRole('button',{name:'Import data'}).click();
      await expect(page.locator('#importModal')).toBeVisible();
      await page.getByRole('button',{name:'Done',exact:true}).click();
    }
    if(target==='umbramatic')await expect(page.locator('#openFolder')).toBeVisible();
    if(target==='transitron'){
      await expect(page.locator('.masthead .app-title')).toHaveText('Realtime Recorder');
      await expect(page.locator('.masthead [data-suite-return]')).toHaveCount(0);
      const nav=page.getByRole('navigation',{name:'Report navigation'});
      await expect(nav.getByRole('button')).toHaveText(['Overview','Vehicles','Trip Updates','Service Alerts','Recorder']);
      await expect(nav.getByRole('button',{name:'Trip Updates'})).toHaveCSS('border-radius','4px');
      const recorder=nav.getByRole('button',{name:'Recorder'});
      await recorder.click();
      await expect(recorder).toHaveCSS('background-color','rgb(25, 44, 39)');
      await expect(recorder.locator('.recording-led')).toBeVisible();
    }
    const queriesBeforeReturn=server.queries.length;
    await back.click();
    await expect.poll(()=>page.evaluate(()=>{
      const state=window.GeoGlyphLauncherSurvey?.state();
      return state&&{cursor:state.cursor,active:state.active,interval:state.interval,layerId:state.layerId};
    })).toEqual({cursor,active,interval:60,layerId:7});
    if(!active)expect(server.queries).toHaveLength(queriesBeforeReturn);
  }
  let cursor=10;
  for(const [target,route,command] of routes){
    const logo=page.getByRole('link',{name:command,exact:true});
    await expect(logo).toHaveAttribute('href',route);
    await logo.focus();await page.keyboard.press('Enter');
    await checkReturn(target,route,cursor,true);

    await openControls(page);
    const active=target!=='transitron';
    if(!active)await page.locator('#suiteSurveyStop').click();
    server.records.push(cue(++cursor,{special_commands:command}));
    await page.locator('#suiteSurveyFetch').click();
    await checkReturn(target,route,cursor,active);
  }
  expect(errors).toEqual([]);
});

for(const portable of [false,true])withTransitron(`Survey123 keeps routing while imported apps are open (${portable?'file':'HTTP'})`,async({page})=>{
  const {server,errors}=await setup(page,{portable});
  await page.route('https://unpkg.com/maplibre-gl@5.13.0/**',route=>route.abort());
  await waitForLauncherPolling(page);
  const send=(id,special_commands)=>server.records.push(cue(id,{special_commands}));
  const app=route=>page.waitForURL(url=>atApp(url,route));
  const checkpoint=()=>page.evaluate(()=>JSON.parse(new URLSearchParams(location.hash.slice(1)).get('suite')));
  const panoptigon='apps/panoptigon/index.html';

  send(11,'Launch Panoptigon');
  await app(panoptigon);
  const identity=await page.evaluate(()=>window.testDocumentId);
  send(12,'Launch Panoptigon');
  await expect.poll(async()=>(await checkpoint())?.cursor).toBe(12);
  expect(await page.evaluate(()=>window.testDocumentId)).toBe(identity);

  await page.reload();
  await expect.poll(async()=>(await checkpoint())?.cursor).toBe(12);
  send(13,'Launch Umbramatic');
  await app('apps/umbramatic/ShadowPlayer/index.html');
  send(14,'Launch Transitron');
  await app(transitronURL);
  send(15,'Return to Launcher');
  await waitForLauncherPolling(page,15);

  send(16,'Launch Panoptigon');
  await app(panoptigon);
  send(17,'Begin Geoglyph');
  await readyApp(page);
  await applied(page,17);
  expect(errors).toEqual([]);
});

for(const entry of ['HTTP launcher','file launcher','standalone'])test(`one Begin runs the full rehearsal (${entry})`,async({page})=>{
  test.setTimeout(120000);
  const standalone=entry==='standalone';
  const greetings=rehearsal.rows.slice(rehearsal.rows.findIndex(row=>row.id==='hello')+1,rehearsal.rows.findIndex(row=>row.id==='my-name'));
  const greetingIds=greetings.map(row=>row.id);
  const {server,errors}=await setup(page,{portable:entry!=='HTTP launcher',realRehearsal:true,openLauncher:!standalone});
  if(!standalone)await waitForLauncherPolling(page);
  if(entry==='file launcher')await page.emulateMedia({reducedMotion:'no-preference'});
  // Keep the full opening flight, title and finale holds on the local launcher.
  await page.addInitScript(({keepHolds,greetingIds})=>{
    window.rehearsalRows=[];
    window.rehearsalTitles=[];
    window.rehearsalFits=[];
    window.rehearsalHolds=[];
    window.rehearsalFinale=[];
    const heldIds=['speak-languages','become-them'];
    document.addEventListener('geoglyph:script-changed',()=>{
      const scripts=window.GeoGlyphScripts, state=scripts?.state();
      if(state?.owner!=='conference')return;
      const api=GeoGlyphMapEngine,map=api.state;
      if(state.phase==='preflight'){
        if(keepHolds){
          const morph=window.GeoGlyphFontMorph;
          window.GeoGlyphFontMorph={...morph,async playToEnd(options){
            const finale=scripts.state().rowId==='thanks';
            const start=performance.now(),startFrames=GeoGlyph3D.stats().animation.frames;
            const result=await morph.playToEnd(options);
            if(finale){
              const {orbiting,frames}=GeoGlyph3D.stats().animation;
          rehearsalFinale.push({font:map.fontRecords.get(map.displayedFontId).fontResourceKey,message:map.message,fill:map.fill,
                start,end:performance.now(),startFrames,frames,orbiting,duration:options.duration});
            }
            return result;
          }};
        }
        window.GeoGlyphMapEngine={...api,async fitScriptMorph(...args){
          if(scripts.state().fontCycling)return api.fitScriptMorph(...args);
          const progress=GeoGlyphFontMorph.stats().progress;
          const startFrames=GeoGlyph3D.stats().animation.frames;
          const result=await api.fitScriptMorph(...args);
          const bounds=GeoGlyphFontMorph.getBounds();
          const flat=!map.extrusionEnabled;
          const pose=GeoGlyph3D.morphPose(bounds,{flat});
          const model=pose.geographic.multiply(pose.object);
          const matrix=model.clone().fromArray(map.map.transform.getProjectionDataForCustomLayer().mainMatrix).multiply(model).elements;
          let inside=true;
          for(const x of [bounds.minX,bounds.maxX])for(const y of [bounds.minY,bounds.maxY]){
            for(const z of flat?[0]:[bounds.minZ,bounds.maxZ]){
              const w=matrix[3]*x+matrix[7]*y+matrix[11]*z+matrix[15];
              const projectedX=matrix[0]*x+matrix[4]*y+matrix[8]*z+matrix[12];
              const projectedY=matrix[1]*x+matrix[5]*y+matrix[9]*z+matrix[13];
              inside&&=w>0&&Math.abs(projectedX)<=w&&Math.abs(projectedY)<=w;
            }
          }
          const animation=GeoGlyph3D.stats().animation;
          rehearsalFits.push({id:scripts.state().rowId,progress,inside,orbiting:animation.orbiting,frames:animation.frames-startFrames});
          return result;
        }};
      }
      const previous=rehearsalRows.at(-1);
      if(keepHolds&&state.phase==='preparing'&&heldIds.includes(previous?.id)&&state.rowId!==previous.id){
        rehearsalHolds.push({id:previous.id,ms:performance.now()-previous.since,message:map.message,
          orbitFrames:GeoGlyph3D.stats().animation.frames-previous.orbitFrames});
      }
      if(state.rowId==='conference-day'&&state.phase==='preparing'){
        const flyTo=map.map.flyTo;
        map.map.flyTo=function(options){
          this.flyTo=flyTo;
          const flight={anchor:{...map.anchor},center:options.center.toArray(),duration:options.duration,
            title:document.getElementById('geoglyphConferenceTitle')?.textContent??null};
          window.rehearsalFlight=flight;
          this.once('moveend',()=>{
            flight.arrived=performance.now();
            flight.titleAtArrival=document.getElementById('geoglyphConferenceTitle')?.textContent??null;
          });
          return flyTo.call(this,options);
        };
      }
      if(state.rowId==='yawn'&&state.phase==='preparing'&&window.rehearsalFlight){
        window.rehearsalFlight.yawnStarted=performance.now();
      }
      if(state.phase!=='waiting'||rehearsalRows.at(-1)?.id===state.rowId)return;
      if(state.rowId.startsWith('conference-day')){
        const title=document.getElementById('geoglyphConferenceTitle');
        const style=title&&getComputedStyle(title);
        rehearsalTitles.push({text:title?.textContent,align:style?.alignItems,size:parseFloat(style?.fontSize)});
      }
      const caption=document.querySelector('.geoglyph-rehearsal-caption');
      const highlight=caption?.querySelector('.geoglyph-caption-highlight');
      rehearsalRows.push({id:state.rowId,message:map.message,extruded:map.extrusionEnabled,fill:map.fill,
        height:map.baseHeightMeters,depth:map.extrusionDepthMeters,orbiting:GeoGlyph3D.stats().animation.orbiting,
      orientation:map.orientationMode,
        font:map.fontRecords.get(map.displayedFontId)?.fontResourceKey,anchor:{...map.anchor},since:performance.now(),
        moving:map.map.isMoving(),orbitFrames:GeoGlyph3D.stats().animation.frames,caption:caption?.textContent??null,
        zoom:map.map.getZoom(),renderer:map.lastRenderMode,mesh:GeoGlyph3D.isVisible(),
      anchorScreenX:map.map.project(map.anchor).x/map.map.getContainer().clientWidth,
        bearing:map.map.getBearing(),cameraLat:map.map.transform.getCameraLngLat().lat,
      captionFont:caption?.style.fontFamily,captionSize:caption?parseFloat(getComputedStyle(caption).fontSize):null,
      captionHighlight:highlight?.textContent,captionHighlightColour:highlight&&getComputedStyle(highlight).color,
        cssFamily:map.fontRecords.get(map.displayedFontId)?.cssFamily});
      if(keepHolds&&(state.rowId.startsWith('conference-day')||heldIds.includes(state.rowId)||state.rowId===greetingIds.at(-1)))return;
      queueMicrotask(()=>{if(scripts.state().rowId===state.rowId&&scripts.state().phase==='waiting')scripts.next();});
    });
  },{keepHolds:entry==='file launcher',greetingIds});
  server.records.push(cue(11,{special_commands:'  bEgIn GeOgLyPh  '}));
  if(standalone){
    const destination=pathToFileURL(path.resolve(__dirname,'../../apps/geoglyph/GeoGlyph_Locate_2026.html'));
    const handoff={version:1,app:'geoglyph',source:config.serviceUrl,cursor:11,beginId:11,layerId:7,interval:1,active:true,launchReason:'survey'};
    destination.hash=new URLSearchParams({suite:JSON.stringify(handoff)}).toString();
    await page.goto(destination.href);
  }
  await readyApp(page);await expectProfile(page,{survey:true,visible:false});
  await page.waitForFunction(()=>GeoGlyphConference.state.lastAppliedId===11||Boolean(GeoGlyphConference.state.error),null,{timeout:90000});
  const state=await page.evaluate(()=>({error:GeoGlyphConference.state.error,phase:GeoGlyphConference.state.phase,
    message:GeoGlyphMapEngine.state.message,draft:GeoGlyphScripts.getDraft().title,rows:rehearsalRows,
    titles:rehearsalTitles,flight:window.rehearsalFlight,fits:rehearsalFits,holds:rehearsalHolds,
    starts:GeoGlyphConference.state.history.filter(row=>row.objectId===11&&row.phase==='started').length}));
  expect(state.error).toBe('');
  expect(state.phase).toBe('live');expect(state.starts).toBe(1);
  expect(state.message).toBe('Thanks for watching');
  expect(await page.evaluate(()=>GeoGlyphScripts.state().fontCycling)).toBe(true);
  expect(state.draft).toBe('Short launch regression introduction');
  expect(state.titles.map(({size,...title})=>title)).toEqual([{text:'Conference day...',align:'start'}]);
  expect(state.titles.every(title=>title.size>100)).toBe(true);
  expect(state.flight).toMatchObject({anchor:{lng:144.95604,lat:-37.82402},title:'Conference day...'});
  expect(state.flight.center[0]).toBeCloseTo(144.95604,3);
  expect(state.flight.center[1]).toBeCloseTo(-37.82402,3);
  const rows=Object.fromEntries(state.rows.map(row=>[row.id,row]));
  expect(rows.smirk.anchorScreenX-rows.awake.anchorScreenX).toBeCloseTo(.07,2);
  expect(rows['smirk-mirror'].anchorScreenX-rows.awake.anchorScreenX).toBeCloseTo(-.07,2);
  expect(rows.sunglasses.anchorScreenX).toBeCloseTo(rows.awake.anchorScreenX,2);
  expect(rows.hello).toMatchObject({message:'Hello!',caption:null,extruded:false});
  expect(rows['same-words']).toMatchObject({message:'I am style and\ntime fontified',extruded:false,orbiting:false});
  for(const id of ['simple','elegant','ancient','future']){
    expect(rows[id]).toMatchObject({message:'The Amazing\nGeoglyph',extruded:true,orbiting:true,orientation:'yaw'});
  }
  expect(rows['my-name']).toMatchObject({message:"I'm Geoglyph",anchor:{lng:144.95604,lat:-37.82402},
    height:300,depth:30,extruded:false,caption:null});
  expect(rows.dialects).toMatchObject({message:'I speak all\n2D and 3D fonts',extruded:false});
  expect(greetings).toHaveLength(6);
  const openingSpeech=state.rows.slice(state.rows.findIndex(row=>row.id==='hello'));
  expect(openingSpeech.slice(0,8).map(row=>row.id)).toEqual(['hello',...greetingIds,'my-name']);
  for(const cue of greetings){
    const morph=cue.actions.find(action=>action.type==='morph').value;
    expect(rows[cue.id]).toMatchObject({message:morph.targetMessage,caption:'Hello in Korean, Georgian, Armenian, Ukrainian, Greek, Tamazight',font:morph.to.resourceKey,anchor:rows.hello.anchor,
      orbiting:false,moving:false,extruded:false,renderer:'vector',mesh:false});
    expect(rows[cue.id]).toMatchObject({captionHighlight:morph.titleHighlight,captionHighlightColour:'rgb(255, 133, 0)',fill:'#FF8500'});
    expect(rows[cue.id].captionSize).toBeGreaterThan(42);
  }
  expect(rows['speak-languages']).toMatchObject({height:300,depth:30,orbiting:true,caption:null});
  expect(openingSpeech.slice(0,-1).map(row=>row.anchor)).toEqual(openingSpeech.slice(0,-1).map(()=>state.flight.anchor));
  const speech=openingSpeech.slice(1);
  const distinctFaces=speech.slice(0,-1).filter(row=>!['clone-obj','more-features','josh'].includes(row.id));
  expect(new Set(distinctFaces.map(row=>row.font)).size).toBe(distinctFaces.length);
  expect(new Set(speech.map(row=>row.fill))).toEqual(new Set(['#FF8500','#28EFFF','#FF45B8','#39FF78','#CE82FF']));
  expect(rows['become-them'].fill).toBe(rows['call-me'].fill);
  expect(rows['speak-languages'].fill).toBe(rows['become-them'].fill);
  expect(rows['made-by'].message).toBe('I was made by\nChatGPT');
  expect(rows.thanks).toMatchObject({fill:'#FF45B8',height:300000,depth:40000,orbiting:true,anchor:{lat:-25.61011,lng:134.35481}});
  expect(rows.thanks.zoom).toBeLessThan(rows['become-them'].zoom-4);
  for(const id of ['simple','elegant','ancient','future']){
    expect(rows[id].caption).toBe(id[0].toUpperCase()+id.slice(1)+' Geo');
    expect(rows[id].captionFont).toContain(rows[id].cssFamily);
    expect(rows[id].captionSize).toBeGreaterThan(42);
  }
  expect(rows.future.font).toBe('conference:Audiowide');
  const finale=[['speak-languages',"I don't just speak languages"],['become-them','I become them'],['thanks','Thanks for watching']];
  expect(speech.slice(-9).map(row=>row.id)).toEqual(['future','speak-languages','become-them','cloning-powers','clone-geojson','clone-obj','more-features','josh','thanks']);
  expect(rows['cloning-powers']).toMatchObject({message:'ChatGPT gave me\ncloning powers too',extruded:false,fill:'#FF8500',font:'conference:Lilita One'});
  expect(rows['clone-geojson']).toMatchObject({message:"I can clone 2D Geo's\nto GeoJSON",extruded:false});
  expect(rows['clone-obj']).toMatchObject({message:"and 3D Geo's\nto OBJ.",extruded:true,orbiting:true});
  expect(rows['more-features']).toMatchObject({message:'I have lots\nmore features',extruded:true,orbiting:true});
  expect(rows.josh).toMatchObject({message:'but Josh has more\nstuff to show you',extruded:true,orbiting:true});
  for(const [id,message] of finale)expect(rows[id]).toMatchObject({message,extruded:true});
    expect(state.fits.map(({frames,...fit})=>fit)).toEqual([...greetingIds.map(id=>({id,progress:0,inside:true,orbiting:false})),
      ...['elegant','ancient','future','speak-languages','become-them','josh','thanks'].map(id=>({id,progress:0,inside:true,orbiting:true}))]);
  if(entry==='file launcher'){
    const lastGreeting=greetings.at(-1);
    expect(rows['my-name'].since-rows[lastGreeting.id].since).toBeGreaterThanOrEqual(lastGreeting.duration*1000-10);
    expect(state.flight).toMatchObject({duration:20000,titleAtArrival:null});
    expect(rows['conference-day'].moving).toBe(true);
    expect(state.flight.yawnStarted).toBeGreaterThanOrEqual(state.flight.arrived);
    expect(state.holds.map(hold=>[hold.id,hold.message])).toEqual(finale.slice(0,2));
    for(const hold of state.holds){
      expect(hold.ms,hold.id).toBeGreaterThanOrEqual(rehearsal.rows.find(row=>row.id===hold.id).duration*1000-10);
      expect(hold.orbitFrames).toBeGreaterThan(0);
    }
    for(const fit of state.fits.filter(fit=>fit.orbiting))expect(fit.frames,fit.id).toBeGreaterThan(0);
    await page.waitForFunction(()=>rehearsalFinale.length>=3);
    const transitions=await page.evaluate(()=>rehearsalFinale.slice(0,3));
    expect(transitions.map(step=>step.font)).toEqual(['conference:Bungee','conference:Secular One','conference:Saira Stencil One']);
    for(const [index,step] of transitions.entries()){
      expect(step.duration).toBe(2);
      expect(step.orbiting).toBe(true);
      expect(step.message).toBe('Thanks for watching');
    expect(step.fill).toBe('#FF45B8');
      expect(step.frames).toBeGreaterThan(step.startFrames);
      if(index){
        const previous=transitions[index-1];
        expect(step.start-previous.end).toBeGreaterThanOrEqual(1990);
        expect(step.start-previous.end).toBeLessThan(5000);
        expect(step.startFrames).toBeGreaterThan(previous.frames);
      }
    }
  }
  expect(server.queries.some(params=>params.get('where')==='objectid>11')).toBe(true);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('final font cycle visits compatible English fonts, wraps, and yields to new Survey text',async({page})=>{
  test.setTimeout(135000);
  const {server,errors}=await setup(page,{portable:true});await baseline(page);
  await page.locator('#open-geoglyph').click();await readyApp(page);
  const english=require('../../apps/geoglyph/src/fonts/manifest.json')
    // Forte's a and g cannot be extruded for this phrase.
    .filter(font=>!font.emoji&&font.fontCycle!==false&&font.key!=='Forte').map(font=>'conference:'+font.key);
  const start=english.indexOf('conference:Bungee');
  const expected=[...english.slice(start+1),...english.slice(0,start+2)];
  await page.evaluate(()=>{
    GeoGlyphScripts.setDraft({version:1,title:'Finale cycle',fontCycle:{duration:.25,hold:.05},rows:[{
      id:'finale',message:'Thanks for watching',duration:0,actions:[
        {type:'font',value:{resourceKey:'conference:Bungee'}},{type:'mode',value:'3d'},
        {type:'animation',value:'yaw'},{type:'fit',value:true}
      ]
    }]});
    const morph=window.GeoGlyphFontMorph,s=GeoGlyphMapEngine.state;
    const api=GeoGlyphMapEngine;
    window.GeoGlyphMapEngine={...api,setConnectionStatus(message,kind){
      if(message.startsWith('Final font cycle:'))window.cycleError=message;
      return api.setConnectionStatus(message,kind);
    }};
    window.cycledFonts=[];window.orbitInterrupted=false;
    s.map.on('render',()=>{
      if(GeoGlyphScripts.state().fontCycling&&!GeoGlyph3D.stats().animation.orbiting)orbitInterrupted=true;
    });
    window.GeoGlyphFontMorph={...morph,async playToEnd(options){
      const result=await morph.playToEnd(options);
      cycledFonts.push(s.fontRecords.get(s.displayedFontId).fontResourceKey);
      return result;
    }};
  });
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));
  await pollApp(page);await applied(page,11);
  await page.waitForFunction(count=>cycledFonts.length>=count||window.cycleError,expected.length,{timeout:100000});
  expect(await page.evaluate(()=>window.cycleError)).toBeUndefined();
  expect(await page.evaluate(count=>({fonts:cycledFonts.slice(0,count),orbitInterrupted,
    message:GeoGlyphMapEngine.state.message,extruded:GeoGlyphMapEngine.state.extrusionEnabled}),expected.length))
    .toEqual({fonts:expected,orbitInterrupted:false,message:'Thanks for watching',extruded:true});
  server.records.push(cue(12,{geoglyph_speaks:'New survey message'}));
  await pollApp(page);await applied(page,12);
  expect(await page.evaluate(()=>({cycling:GeoGlyphScripts.state().fontCycling,message:GeoGlyphMapEngine.state.message})))
    .toEqual({cycling:false,message:'New survey message'});
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('Reset received during the launcher handoff supersedes the pending rehearsal',async({page})=>{
  const {server}=await setup(page);await baseline(page);
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}),cue(12,{special_commands:'Reset Geoglyph'}));
  await page.locator('#suiteSurveyFetch').click();await readyApp(page);await applied(page,12);
  expect(await page.evaluate(()=>({
    phase:GeoGlyphConference.state.phase,
    started:GeoGlyphConference.state.history.some(row=>row.objectId===11&&row.phase==='started')
  }))).toEqual({phase:'overview',started:false});
});

test('a failed rehearsal font identifies the cue and leaves the opening visible',async({page})=>{
  const {server}=await setup(page,{realRehearsal:true});await baseline(page);
  await page.locator('#open-geoglyph').click();await readyApp(page);
  await page.evaluate(()=>{
    const service=GeoGlyphFontService;
    window.GeoGlyphFontService={...service,prepare(record,options){
      if(record.fontResourceKey==='conference:Berkshire Swash')return Promise.reject(Error('Berkshire Swash fixture unavailable'));
      return service.prepare(record,options);
    }};
  });
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));await pollApp(page);
  await page.waitForFunction(()=>GeoGlyphConference.state.error.includes('Berkshire Swash fixture unavailable'));
  expect(await page.evaluate(()=>GeoGlyphConference.state.error)).toMatch(/Rehearsal row.+The Amazing/);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.message)).toBe('😴');
  await expect(page.locator('#geoglyphConferenceTitle')).toHaveCount(0);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));
});

for(const entry of [
  {mode:'message',presentation:'full',visible:true},
  {mode:'geoglyph',presentation:'mini',visible:true},
  {mode:'admin',presentation:'full',visible:false},
  {mode:'canvas',presentation:'mini',visible:false},
  {mode:'explorer',presentation:'mini',visible:true}
])test(`Begin Geoglyph activates the conference from ${entry.mode} and hides the controls`,async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);
  await page.locator('#open-geoglyph').click();await readyApp(page);await expectProfile(page);
  await countConferenceStarts(page);
  if(entry.mode==='geoglyph')await page.locator('[data-map-mode="arcgis"]').click();
  if(entry.mode==='admin')await page.locator('[data-map-mode="admin"]').click();
  await page.evaluate(({presentation,visible})=>{GeoGlyphMapSidebar.setPresentation(presentation);GeoGlyphMapSidebar.setVisible(visible);},entry);
  if(entry.mode==='canvas')await page.locator('#mapCanvasToggleBtn').click();
  if(entry.mode==='explorer'){
    await page.locator('.workflow-font-btn').click();await expect(page.locator('body')).toHaveClass(/drawer-open/);
  }
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPolling)).toBe(true);
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));await pollApp(page);await applied(page,11);
  expect(await page.evaluate(()=>({preview:GeoGlyphMapEngine.state.previewActive,mode:GeoGlyphMapEngine.state.mode,admin:GeoGlyphMapEngine.state.adminMode,
    visible:GeoGlyphMapSidebar.state().visible,presentation:GeoGlyphMapSidebar.state().presentation,starts:conferenceStartCount})))
    .toEqual({preview:true,mode:'arcgis',admin:false,visible:false,presentation:entry.presentation,starts:1});
  await expect(page.locator('#geoglyphMapEditor')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/drawer-open/);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('Begin Geoglyph works in the standalone app without requiring a launcher reload',async({page})=>{
  const {server,errors}=await setup(page,{portable:true});await baseline(page);
  const destination=pathToFileURL(path.resolve(__dirname,'../../apps/geoglyph/GeoGlyph_Locate_2026.html'));
  destination.hash=new URLSearchParams({suite:JSON.stringify({version:1,app:'geoglyph',source:config.serviceUrl,cursor:10,layerId:7,interval:1,active:true,launchReason:'manual'})}).toString();
  await page.goto(destination.href);await readyApp(page);await expectProfile(page);
  await page.evaluate(()=>GeoGlyphMapSidebar.setPresentation('mini'));
  await countConferenceStarts(page);
  const identity=await page.evaluate(()=>testDocumentId);
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));await pollApp(page);await applied(page,11);
  expect(await page.evaluate(()=>testDocumentId)).toBe(identity);
  await expectProfile(page,{survey:true,visible:false});
  expect(await page.evaluate(()=>conferenceStartCount)).toBe(1);
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});

test('duplicate Begin Geoglyph cannot restart an active script and Reset still interrupts it',async({page})=>{
  const {server,errors}=await setup(page);await baseline(page);
  await page.locator('#open-geoglyph').click();await readyApp(page);
  await countConferenceStarts(page,{duration:30});
  server.records.push(cue(11,{special_commands:'Begin Geoglyph'}));await pollApp(page);
  await page.waitForFunction(()=>GeoGlyphConference.state.phase==='beginning'&&GeoGlyphScripts.state().phase==='waiting');
  server.records.push(cue(12,{special_commands:'Begin Geoglyph'}));await pollApp(page);
  await page.waitForFunction(()=>GeoGlyphConference.state.history.some(row=>row.objectId===12&&row.phase==='ignored'));
  expect(await page.evaluate(()=>conferenceStartCount)).toBe(1);
  server.records.push(cue(13,{special_commands:'Reset Geoglyph'}));await pollApp(page);await applied(page,13);
  expect(await page.evaluate(()=>({phase:GeoGlyphConference.state.phase,running:GeoGlyphScripts.state().running,starts:conferenceStartCount})))
    .toEqual({phase:'overview',running:false,starts:1});
  server.records.push(cue(14,{special_commands:'Begin'}));await pollApp(page);await applied(page,14);
  expect(await page.evaluate(()=>({phase:GeoGlyphConference.state.phase,starts:conferenceStartCount}))).toEqual({phase:'overview',starts:1});
  await page.evaluate(()=>GeoGlyphMapEngine.stopPolling({quiet:true}));expect(errors).toEqual([]);
});
