const {test,expect}=require('./studio-fixture.cjs');
const {test:conferenceTest}=require('@playwright/test');
const {config}=require('../../src/scripts/survey-results.js');

const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const message='MMMMMMMMMMMM';
test.setTimeout(90_000);

async function settled(page){
  await page.waitForFunction(()=>{
    const s=GeoGlyphMapEngine.state,a=GeoGlyph3D.stats().animation;
    return !s.pendingBuild&&!s.rebuilding&&!s.randomSearching&&!s.explicitFitPending&&a.phase!=='framing'&&(!s.map.isMoving()||a.orbiting);
  });
}

async function openMap(page,mode='2D'){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphMapEngine&&window.GeoGlyph3D&&document.getElementById('mapQuickRandom'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);await settled(page);
  const ids=await page.evaluate(async text=>{
    const files=await Promise.all(['GILLUBCD.TTF','MAGNETOB.TTF'].map(async name=>new File([await(await fetch('src/fonts/'+name)).arrayBuffer()],name,{lastModified:1})));
    const s=GeoGlyphMapEngine.state;s.mode='message';s.message=text;
    await GeoGlyphMapEngine.importFonts(files,'file');
    return files.map(file=>[...s.fontRecords.values()].find(record=>record.file?.name===file.name).id);
  },message);
  await settled(page);
  await page.evaluate(async({ids,mode})=>{
    const s=GeoGlyphMapEngine.state;
    for(const id of s.fontRecords.keys())if(!ids.includes(id))s.fontRecords.delete(id);
    s.nativeColor=false;s.baseHeightMeters=300;s.relativeSize=100;s.extrusionDepthMeters=30;
    await GeoGlyphMapEngine.selectFont(ids[0]);
    if(mode!=='2D'){s.extrusionEnabled=true;GeoGlyphMapEngine.queueRebuild(false);}
  },{ids,mode});
  await settled(page);
  if(mode!=='2D')await page.waitForFunction(()=>GeoGlyph3D.isVisible());
  if(['fixed','yaw','billboard'].includes(mode)){
    await page.evaluate(mode=>GeoGlyph3D.ensureOrbit(mode),mode);
    await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
  }else{await page.evaluate(()=>GeoGlyphMapEngine.fit());await settled(page);}
  await page.locator('#mapEditorCollapseBtn').click();
  await installTrace(page);
  return ids;
}

async function installTrace(page){
  await page.evaluate(()=>{
    const s=GeoGlyphMapEngine.state,map=s.map;
    window.randomFitTrace=[];
    let drawNumber=0,framedNumber=0;
    const snapshot=()=>({font:s.displayedFontId,selected:s.selectedFontId,zoom:map.getZoom(),busy:s.randomSearching,
      sourceLoaded:map.isSourceLoaded(s.lastRenderMode==='decal'?'geoglyph-ground-decal':'geoglyph-ground-geometry')});
    document.addEventListener('geoglyph:ground-rendered',event=>{
      drawNumber++;window.randomFitTrace.push({type:'draw',drawNumber,...event.detail,...snapshot()});
    });
    map.on('render',()=>{
      if(drawNumber!==framedNumber&&snapshot().sourceLoaded){framedNumber=drawNumber;window.randomFitTrace.push({type:'frame',drawNumber,...snapshot()});}
    });
    const ease=map.easeTo;
    map.easeTo=function(options,...rest){
      if(options.zoom!==undefined)window.randomFitTrace.push({type:'fit',method:'easeTo',drawNumber,...snapshot()});
      return ease.call(this,options,...rest);
    };
    const three=GeoGlyph3D;
    window.GeoGlyph3D={...three,fitCurrent:function(...args){
      window.randomFitTrace.push({type:'fit',method:'fitCurrent',drawNumber,...snapshot()});
      return three.fitCurrent(...args);
    }};
  });
}

async function clearTrace(page){await page.evaluate(()=>{window.randomFitTrace.length=0;});}

async function snapshot(page){
  return page.evaluate(()=>{
    const s=GeoGlyphMapEngine.state,map=s.map;
    return {font:s.displayedFontId,selected:s.selectedFontId,zoom:map.getZoom(),anchor:{...s.anchor},
      message:s.message,animation:GeoGlyph3D.stats().animation,moving:map.isMoving(),busy:s.randomSearching,
      width:GeoGlyphMapEngine.getLocalModel()?.bounds.width,trace:[...window.randomFitTrace]};
  });
}

function expectOnePostDrawFit(result,font,{busy=true}={}){
  const fits=result.trace.filter(event=>event.type==='fit');
  expect(fits).toHaveLength(1);
  expect(fits[0].font).toBe(font);expect(fits[0].sourceLoaded).toBe(true);
  if(busy)expect(fits[0].busy).toBe(true);
  const index=result.trace.indexOf(fits[0]);
  const draw=result.trace.findLastIndex((event,i)=>i<index&&event.type==='draw'&&event.font===font&&event.drawNumber===fits[0].drawNumber);
  expect(draw,'the selected font commits before Fit').toBeGreaterThanOrEqual(0);
  expect(result.trace.slice(draw+1,index).some(event=>event.type==='frame'&&event.font===font&&event.drawNumber===fits[0].drawNumber),
    'the selected font reaches its own map frame before Fit').toBe(true);
}

for(const mode of ['2D','static3D','fixed','yaw','billboard']){
  test('Map Random fits larger and smaller fonts after drawing in '+mode+', including warm caches',async({page})=>{
    const ids=await openMap(page,mode);
    let before=await snapshot(page),warmBuilds;
    const orbiting=['fixed','yaw','billboard'].includes(mode);
    for(let step=0;step<4;step++){
      const expected=ids[step%2===0?1:0];
      await clearTrace(page);
      const finished=await page.evaluate(async()=>{
        const ok=await GeoGlyphMapEngine.randomFont();
        return {ok,moving:GeoGlyphMapEngine.state.map.isMoving(),phase:GeoGlyph3D.stats().animation.phase,busy:GeoGlyphMapEngine.state.randomSearching};
      });
      expect(finished.ok).toBe(true);expect(finished.busy).toBe(false);expect(finished.phase).not.toBe('framing');
      if(!orbiting)expect(finished.moving).toBe(false);
      await settled(page);
      const after=await snapshot(page);
      expect(after.font).toBe(expected);expect(after.selected).toBe(expected);
      expectOnePostDrawFit(after,expected);
      expect(after.anchor).toEqual(before.anchor);expect(after.message).toBe(message);
      expect(after.animation.orbiting).toBe(orbiting);
      if(orbiting){expect(after.animation.frames).toBeGreaterThan(before.animation.frames);expect(after.animation.phase).toBe('orbiting');}
      if(step%2===0){expect(after.width/before.width).toBeGreaterThan(1.5);expect(before.zoom-after.zoom).toBeGreaterThan(.2);}
      else{expect(before.width/after.width).toBeGreaterThan(1.5);expect(after.zoom-before.zoom).toBeGreaterThan(.2);}
      if(mode!=='2D'&&step===1)warmBuilds=(await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds;
      if(mode!=='2D'&&step>1)expect((await page.evaluate(()=>GeoGlyphFontService.workerStats())).meshBuilds).toBe(warmBuilds);
      before=after;
    }
  });
}

test('a Fit clicked while Random waits for its new 3D draw performs one post-draw Fit',async({page})=>{
  const ids=await openMap(page,'billboard');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>{
    const api=GeoGlyph3D;
    window.randomFitCommitEntered=false;
    window.GeoGlyph3D={...api,commit:async(...args)=>{
      if(!window.randomFitCommitEntered){window.randomFitCommitEntered=true;await new Promise(resolve=>{window.releaseRandomFitCommit=resolve;});}
      return api.commit(...args);
    }};
  });
  await page.locator('#mapQuickRandom').click();
  await page.waitForFunction(()=>window.randomFitCommitEntered);
  expect((await snapshot(page)).font).toBe(ids[0]);
  expect((await snapshot(page)).trace.filter(event=>event.type==='fit')).toHaveLength(0);
  await expect(page.locator('#mapQuickRandom')).toHaveAttribute('aria-busy','true');
  await page.locator('#mapCollapsedFitBtn').click();
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.explicitFitPending)).toBe(true);
  expect((await snapshot(page)).trace.filter(event=>event.type==='fit')).toHaveLength(0);
  await page.evaluate(()=>window.releaseRandomFitCommit());
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='framing');
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.randomSearching)).toBe(true);
  await expect(page.locator('#mapQuickRandom')).toHaveAttribute('aria-busy','true');
  await settled(page);
  const after=await snapshot(page);
  expect(after.font).toBe(ids[1]);expect(after.animation.orbiting).toBe(false);
  expectOnePostDrawFit(after,ids[1]);
  await expect(page.locator('#mapQuickRandom')).toHaveAttribute('aria-busy','false');
});

async function gateCandidate(page,id){
  await page.evaluate(id=>{
    const service=GeoGlyphFontService;
    window.randomFitModelEntered=false;
    window.GeoGlyphFontService={...service,model:async(...args)=>{
      if(args[0].id===id&&!window.randomFitModelEntered){window.randomFitModelEntered=true;await new Promise(resolve=>{window.releaseRandomFitModel=resolve;});}
      return service.model(...args);
    }};
  },id);
}

test('rapid Random requests let only the latest font request draw and Fit',async({page})=>{
  const ids=await openMap(page);await gateCandidate(page,ids[1]);
  await page.evaluate(()=>{window.firstRandomFit=GeoGlyphMapEngine.randomFont();});
  await page.waitForFunction(()=>window.randomFitModelEntered);
  expect((await snapshot(page)).trace.filter(event=>event.type==='fit')).toHaveLength(0);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.randomFont())).toBe(true);
  await page.evaluate(()=>window.releaseRandomFitModel());
  expect(await page.evaluate(()=>window.firstRandomFit)).toBe(false);await settled(page);
  const after=await snapshot(page);expect(after.font).toBe(ids[1]);expectOnePostDrawFit(after,ids[1]);
});

test('leaving Map cancels a pending Random without fitting previous artwork',async({page})=>{
  const ids=await openMap(page);await gateCandidate(page,ids[1]);
  await page.evaluate(()=>{window.cancelledRandomFit=GeoGlyphMapEngine.randomFont();});
  await page.waitForFunction(()=>window.randomFitModelEntered);
  const before=await snapshot(page);
  await page.evaluate(()=>GeoGlyphMapEngine.showCanvas());
  await page.evaluate(()=>window.releaseRandomFitModel());
  expect(await page.evaluate(()=>window.cancelledRandomFit)).toBe(false);
  const after=await snapshot(page);
  expect(after.font).toBe(before.font);expect(after.zoom).toBe(before.zoom);
  expect(after.trace.filter(event=>event.type==='fit')).toHaveLength(0);
  await expect(page.locator('#mapQuickRandom')).toHaveAttribute('aria-busy','false');
});

test('no compatible Random candidates keep the old display and never Fit it',async({page})=>{
  const ids=await openMap(page),before=await snapshot(page);
  await page.evaluate(id=>GeoGlyphMapEngine.state.fontRecords.delete(id),ids[1]);
  for(const invalid of [false,true]){
    if(invalid)await page.evaluate(()=>{
      const id='random-fit-invalid';GeoGlyphMapEngine.state.fontRecords.set(id,{id,source:'file',name:id,family:id,
        file:new File([new Uint8Array([0,1,2,3])],'random-fit-invalid.ttf',{lastModified:2})});
    });
    await clearTrace(page);
    expect(await page.evaluate(()=>GeoGlyphMapEngine.randomFont())).toBe(false);await settled(page);
    const after=await snapshot(page);
    expect(after.font).toBe(before.font);expect(after.zoom).toBe(before.zoom);expect(after.anchor).toEqual(before.anchor);
    expect(after.trace.filter(event=>event.type==='fit')).toHaveLength(0);
  }
});

function cue(id,attributes={}){return {attributes:{objectid:id,CreationDate:1000+id,...attributes}};}
async function openConference(page){
  const server={records:[]};
  const fields=['emojis','geoglyph_speaks','whats_on_your_mind','random_font','choose_a_font_font','choose_a_colour_colour','_2d_or_3d','fit','animation','_size_size','special_commands'];
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.route(`${config.serviceUrl}**`,async route=>{
    const request=route.request(),url=new URL(request.url());
    const params=request.method()==='POST'?new URLSearchParams(request.postData()):url.searchParams;
    if(url.pathname.endsWith('/FeatureServer'))return route.fulfill({json:{layers:[{id:7,name:'Random Fit cues'}],tables:[]}});
    if(!url.pathname.endsWith('/query'))return route.fulfill({json:{id:7,name:'Random Fit cues',capabilities:'Query',objectIdField:'objectid',maxRecordCount:100,
      geometryType:'esriGeometryPoint',spatialReference:{wkid:4326},editFieldsInfo:{creationDateField:'CreationDate'},
      advancedQueryCapabilities:{supportsOrderBy:true,supportsPagination:true},fields:[{name:'objectid',type:'esriFieldTypeOID'},
        {name:'CreationDate',type:'esriFieldTypeDate'},...fields.map(name=>({name,type:'esriFieldTypeString'}))]}});
    const newer=/objectid\s*>\s*(\d+)/i.exec(params.get('where')||'');
    const ascending=!/DESC/i.test(params.get('orderByFields')||'');
    const records=server.records.filter(row=>!newer||row.attributes.objectid>Number(newer[1]))
      .sort((a,b)=>(a.attributes.objectid-b.attributes.objectid)*(ascending?1:-1));
    return route.fulfill({json:{features:records.slice(0,Number(params.get('resultRecordCount')||100)),exceededTransferLimit:false}});
  });
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphConference?.state.ready&&GeoGlyphConference.state.baselined&&GeoGlyphMapEngine.state.mapReady);
  for(const record of [cue(1,{special_commands:'Begin'}),cue(2,{geoglyph_speaks:message,choose_a_font_font:'Gill Sans',animation:'Face'})]){
    server.records.push(record);
    await expect.poll(()=>page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
    await page.locator('#mapArcgisPollBtn').evaluate(button=>button.click());
    await applied(page,record.attributes.objectid);
  }
  await installTrace(page);
  return server;
}
async function applied(page,id){
  await page.waitForFunction(id=>!GeoGlyphConference.state.applying&&(GeoGlyphConference.state.lastAppliedId===id||
    GeoGlyphConference.state.history.some(event=>event.objectId===id&&event.phase==='failed')),id);
  expect(await page.evaluate(()=>GeoGlyphConference.state.error),'survey cue '+id+' succeeds').toBe('');
}
async function submit(page,server,record,{failure=false}={}){
  await clearTrace(page);server.records.push(record);
  await expect.poll(()=>page.evaluate(()=>GeoGlyphMapEngine.state.arcgisPollBusy)).toBe(false);
  await page.locator('#mapArcgisPollBtn').evaluate(button=>button.click());
  if(failure)await page.waitForFunction(id=>GeoGlyphConference.state.history.some(event=>event.objectId===id&&event.phase==='failed')&&!GeoGlyphConference.state.applying,record.attributes.objectid);
  else await applied(page,record.attributes.objectid);
}

conferenceTest('Survey controls-only Random fits once and preserves animation while explicit Fit keeps its established rule',async({page})=>{
  const server=await openConference(page),before=await snapshot(page);
  for(const [id,attributes,animation,mode] of [
    [3,{random_font:'Yes'},true,'billboard'],
    [4,{random_font:'Yes',fit:'Fit'},false,'billboard'],
    [5,{random_font:'Yes',fit:'Fit',animation:'Turn'},true,'yaw'],
    [6,{random_font:'Yes',whats_on_your_mind:'WIDER MESSAGE',fit:'Fit'},false,'yaw']
  ]){
    const previous=await snapshot(page);await submit(page,server,cue(id,attributes));
    const after=await snapshot(page),phases=await page.evaluate(id=>GeoGlyphConference.state.history.filter(event=>event.objectId===id).map(event=>event.phase),id);
    expect(after.message).toBe(attributes.whats_on_your_mind||message);expect(after.font).not.toBe(previous.font);expect(after.anchor).toEqual(before.anchor);
    expect(after.animation.orbiting).toBe(animation);expect(await page.evaluate(()=>GeoGlyphMapEngine.state.orientationMode)).toBe(mode);
    expect(phases.filter(phase=>phase==='fit')).toHaveLength(1);expect(phases.indexOf('drawn')).toBeLessThan(phases.indexOf('fit'));
    expect(phases.at(-1)).toBe('applied');expectOnePostDrawFit(after,after.font,{busy:false});
  }
  const last=await snapshot(page);
  await submit(page,server,cue(7,{geoglyph_speaks:'🧠',random_font:'Yes'}),{failure:true});
  const failed=await snapshot(page);
  expect(failed.font).toBe(last.font);expect(failed.message).toBe(last.message);
  expect(failed.trace.filter(event=>event.type==='fit')).toHaveLength(0);
});
