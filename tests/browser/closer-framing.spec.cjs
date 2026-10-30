const {test,expect}=require('./studio-fixture.cjs');

const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
const viewports=[{name:'widescreen',width:1600,height:900},{name:'portrait',width:600,height:1000}];
const presets=[{name:'Small',height:300,depth:30},{name:'Medium',height:3000,depth:300},{name:'Large',height:30000,depth:3000},{name:'Huge',height:300000,depth:6000}];

test.setTimeout(120_000);

async function settled(page){
  await page.waitForFunction(()=>{
    const s=GeoGlyphMapEngine.state,a=GeoGlyph3D.stats().animation;
    return !s.pendingBuild&&!s.rebuilding&&!s.map.isMoving()&&a.phase!=='framing';
  });
}

test('Face orbit smoothly reframes from widescreen to portrait and back without changing its anchor',async({page})=>{
  await page.setViewportSize({width:1600,height:900});
  const fonts=await open(page);
  await draw(page,{font:fonts['MAGNETOB.TTF'],threeD:true});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>GeoGlyph3D.ensureOrbit('billboard'));
  await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
  const original=await measure(page);
  expect(await page.evaluate(()=>GeoGlyphMapEngine.state.map.getRenderWorldCopies())).toBe(false);
  await page.evaluate(()=>{
    const map=GeoGlyphMapEngine.state.map;
    const probe={events:0,zooms:[]};
    probe.resized=()=>{probe.events++;};
    probe.moved=()=>{probe.zooms.push(map.getZoom());};
    map.on('resize',probe.resized);map.on('move',probe.moved);
    window.__resizeFitProbe=probe;
  });
  for(const viewport of [{width:600,height:1000},{width:1600,height:900}]){
    const before=await measure(page);
    await page.evaluate(()=>{window.__resizeFitProbe.events=0;window.__resizeFitProbe.zooms=[];});
    await page.setViewportSize(viewport);
    await page.waitForFunction(()=>window.__resizeFitProbe.events>0);
    let previousZoom=null;
    await expect.poll(async()=>{
      const current=await measure(page),stable=previousZoom!==null&&Math.abs(current.zoom-previousZoom)<.0002;
      previousZoom=current.zoom;
      const animation=await page.evaluate(()=>GeoGlyph3D.stats().animation);
      return current.width===viewport.width&&current.occupancy>.73&&current.occupancy<=.805&&
        current.margin>=.095&&stable&&animation.orbiting&&animation.phase==='orbiting'&&animation.frames>before.frames+5;
    },{timeout:15_000,intervals:[100,100,200,200,300]}).toBe(true);
    const after=await measure(page);
    const movement=await page.evaluate(()=>({zooms:window.__resizeFitProbe.zooms,
      mode:GeoGlyphMapEngine.state.orientationMode,worldCopies:GeoGlyphMapEngine.state.map.getRenderWorldCopies()}));
    expect(after.anchor).toEqual(original.anchor);
    expect(after.center.lng).toBeCloseTo(after.poseCenter.lng,4);
    expect(after.center.lat).toBeCloseTo(after.poseCenter.lat,4);
    expect(movement.mode).toBe('billboard');expect(movement.worldCopies).toBe(false);
    const low=Math.min(before.zoom,after.zoom),high=Math.max(before.zoom,after.zoom);
    expect(high-low,'aspect ratio changes the required orbit zoom').toBeGreaterThan(.2);
    expect(movement.zooms.some(zoom=>zoom>low+.005&&zoom<high-.005),'resize includes intermediate zoom frames').toBe(true);
    for(const zoom of movement.zooms){expect(zoom).toBeGreaterThanOrEqual(low-.005);expect(zoom).toBeLessThanOrEqual(high+.005);}
  }
  await page.evaluate(()=>{
    const map=GeoGlyphMapEngine.state.map,probe=window.__resizeFitProbe;
    map.off('resize',probe.resized);map.off('move',probe.moved);delete window.__resizeFitProbe;
  });
});

async function open(page,{emoji=false}={}){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/MapServer/tile/**',route=>route.fulfill({body:tile,contentType:'image/png'}));
  await page.goto('/');
  await page.waitForFunction(()=>window.GeoGlyphMapEngine&&window.GeoGlyph3D&&document.getElementById('mapQuickModel'));
  await page.evaluate(()=>GeoGlyphMapEngine.showMap());
  await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
  await settled(page);
  const fonts=await page.evaluate(async emoji=>{
    const files=['MAGNETOB.TTF',...(emoji?['seguiemj.ttf']:[])];
    const blobs=await Promise.all(files.map(async name=>new File([await(await fetch('src/fonts/'+name)).arrayBuffer()],name,{lastModified:1})));
    await GeoGlyphMapEngine.importFonts(blobs,'file');
    return Object.fromEntries(files.map(name=>[name,[...GeoGlyphMapEngine.state.fontRecords.values()].find(record=>record.file?.name===name).id]));
  },emoji);
  await settled(page);
  return fonts;
}

async function draw(page,{font,message='Where are you Josh?',height=300,depth=30,tilt=90,threeD=false,nativeColor=false}){
  await page.evaluate(settings=>{
    GeoGlyph3D.stopOrbit();
    const s=GeoGlyphMapEngine.state;
    Object.assign(s,{mode:'message',message:settings.message,selectedFontId:settings.font,
      baseHeightMeters:settings.height,relativeSize:100,extrusionDepthMeters:settings.depth,
      extrusionTilt:settings.tilt,extrusionEnabled:settings.threeD,nativeColor:settings.nativeColor,
      orientationMode:'fixed',bearing:0,anchor:{lng:138.602,lat:-34.93},anchorInitialised:true,anchorPinned:true});
    GeoGlyphMapEngine.queueRebuild(false);
  },{font,message,height,depth,tilt,threeD,nativeColor});
  await settled(page);
  await expect.poll(()=>page.evaluate(()=>GeoGlyph3D.isVisible())).toBe(threeD);
}

async function fit(page){
  expect(await page.evaluate(()=>GeoGlyphMapEngine.fit())).toBe(true);
  await settled(page);
}

// Measure rendered resources, independently of the camera's framing solver.
// 3D uses every depth/height corner transformed by the renderer's ground policy;
// 2D uses the actual committed vector geometry or canvas-source quadrilateral.
async function measure(page,{heading,rotation=false}={}){
  return page.evaluate(({heading,rotation})=>{
    const s=GeoGlyphMapEngine.state,map=s.map,actual=GeoGlyph3D.stats().animation;
    const sample=heading=>{
    const transform=map.transform.clone();
    let points=[],poseCenter,poseElevation,bounds,centerPoint;
    if(GeoGlyph3D.isVisible()){
      const b=GeoGlyph3D.getBounds(),angles=heading===undefined?actual.angles:
        {bearing:s.orientationMode==='fixed'?s.bearing:heading,tilt:s.orientationMode==='billboard'?55:s.extrusionTilt};
      const values={heightMeters:s.baseHeightMeters*s.relativeSize/100,depthMeters:s.extrusionDepthMeters,...angles};
      const origin=maplibregl.MercatorCoordinate.fromLngLat(s.anchor),unit=origin.meterInMercatorCoordinateUnits();
      const mercator=p=>{const q=GeoGlyphGroundTransform.point(p,values,b);return [origin.x+q[0]*unit,origin.y-q[1]*unit,q[2]*unit,1];};
      const center=mercator([(b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2]);
      centerPoint=center;
      const target=new maplibregl.MercatorCoordinate(...center.slice(0,3));
      poseCenter=target.toLngLat();poseElevation=target.toAltitude();bounds=b;
      if(heading!==undefined){
        // A mathematical projection must preserve its requested target; native
        // map longitude constraints are checked separately on the real map.
        transform.setRenderWorldCopies(true);
        transform.setPitch(55);transform.setBearing(heading);
        transform.setCenter(target.toLngLat());transform.setElevation(target.toAltitude());
      }
      for(const x of [b.minX,b.maxX])for(const y of [b.minY,b.maxY])for(const z of [b.minZ,b.maxZ])points.push(mercator([x,y,z]));
    }else{
      const coordinates=[];
      const walk=value=>{if(typeof value?.[0]==='number'&&typeof value?.[1]==='number')coordinates.push(value);else if(Array.isArray(value))value.forEach(walk);};
      if(s.lastGeoJSON?.features?.length)s.lastGeoJSON.features.forEach(feature=>walk(feature.geometry.coordinates));
      else walk(s.lastDecal?.coordinates);
      points=coordinates.map(value=>{const p=maplibregl.MercatorCoordinate.fromLngLat(value);return [p.x,p.y,p.z,1];});
    }
    const matrix=transform.getProjectionDataForCustomLayer().mainMatrix;
    const project=point=>{
      const clip=[0,1,2,3].map(i=>point.reduce((sum,value,j)=>sum+matrix[j*4+i]*value,0));
      return {x:(clip[0]/clip[3]+1)/2,y:(1-clip[1]/clip[3])/2,w:clip[3]};
    };
    const projected=points.map(project);
    const xs=projected.map(p=>p.x),ys=projected.map(p=>p.y);
    const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
    return {occupancy:Math.max(right-left,bottom-top),margin:Math.min(left,1-right,top,1-bottom),
      left,right,top,bottom,positiveW:projected.every(p=>p.w>0),count:points.length,
      zoom:map.getZoom(),anchor:{...s.anchor},bearing:map.getBearing(),renderer:s.lastRenderMode,
      width:transform.width,height:transform.height,phase:actual.phase,frames:actual.frames,
      center:map.getCenter(),elevation:map.getCenterElevation(),poseCenter,poseElevation,bounds,
      modelHeight:s.baseHeightMeters,depth:s.extrusionDepthMeters,angles:actual.angles,
      centerScreen:centerPoint?project(centerPoint):undefined};
    };
    return rotation?Array.from({length:144},(_,index)=>({heading:index*2.5,...sample(index*2.5)})):sample(heading);
  },{heading,rotation});
}

async function actualCameraTargets(page){
  return page.evaluate(()=>{
    const s=GeoGlyphMapEngine.state,map=s.map,b=GeoGlyph3D.getBounds();
    const original={center:map.getCenter(),elevation:map.getCenterElevation(),zoom:map.getZoom(),pitch:map.getPitch(),bearing:map.getBearing()};
    const origin=maplibregl.MercatorCoordinate.fromLngLat(s.anchor),unit=origin.meterInMercatorCoordinateUnits();
    const middle=[(b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2];
    const resume=GeoGlyph3D.pauseAnimation(),results=[];
    try{
      for(let heading=0;heading<360;heading+=45){
        const local=GeoGlyphGroundTransform.point(middle,{heightMeters:s.baseHeightMeters*s.relativeSize/100,
          depthMeters:s.extrusionDepthMeters,bearing:s.orientationMode==='fixed'?s.bearing:heading,
          tilt:s.orientationMode==='billboard'?55:s.extrusionTilt},b);
        const mercator=new maplibregl.MercatorCoordinate(origin.x+local[0]*unit,origin.y-local[1]*unit,local[2]*unit);
        const target=mercator.toLngLat(),elevation=mercator.toAltitude();
        map.jumpTo({center:target,elevation,zoom:original.zoom,pitch:55,bearing:heading},{geoglyphOrbit:true});
        results.push({heading,target,elevation,actual:map.getCenter(),actualElevation:map.getCenterElevation(),zoom:map.getZoom()});
      }
    }finally{map.jumpTo(original,{geoglyphOrbit:true});resume();}
    return results;
  });
}

function expectCloseFrame(result,label){
  label+=' '+JSON.stringify(result);
  expect(result.count,label+' has rendered bounds').toBeGreaterThan(0);
  expect(result.positiveW,label+' stays in front of camera').toBe(true);
  expect(result.margin,label+' retains the viewport buffer').toBeGreaterThanOrEqual(.095);
  // Keeping the camera aimed at the physical model centre makes the projected
  // bounds asymmetric in perspective. One limiting extent should reach the
  // padded edge; the complete span need not be symmetric around that centre.
  expect(result.margin,label+' reaches the padded edge').toBeLessThan(.12);
  expect(result.occupancy,label+' fills the viewport').toBeGreaterThan(.50);
  expect(result.occupancy,label+' remains near 80%').toBeLessThanOrEqual(.805);
}

for(const viewport of viewports){
  test('2D Fit fills '+viewport.name+' for short, wide, multiline and colour emoji messages',async({page})=>{
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    const fonts=await open(page,{emoji:true});
    for(const scenario of [
      {label:'short',message:'A',font:fonts['MAGNETOB.TTF']},
      {label:'wide',message:'Where are you Josh?',font:fonts['MAGNETOB.TTF']},
      {label:'multiline',message:'Hello\nLOCATE 2026',font:fonts['MAGNETOB.TTF']},
      {label:'emoji',message:'😴',font:fonts['seguiemj.ttf'],nativeColor:true}
    ]){
      await draw(page,scenario);
      // A deliberate previously tilted/distant camera must not influence 2D Fit.
      await page.evaluate(()=>GeoGlyphMapEngine.state.map.jumpTo({pitch:60,bearing:123,zoom:5,elevation:5000}));
      await settled(page);await fit(page);
      const result=await measure(page);
      expectCloseFrame(result,scenario.label+' '+viewport.name);
      expect(result.occupancy).toBeGreaterThan(.775);
      expect(result.anchor).toEqual({lng:138.602,lat:-34.93});
      if(scenario.label==='emoji')expect(result.renderer).toBe('decal');
      const zoom=result.zoom;
      await fit(page);
      expect(Math.abs((await measure(page)).zoom-zoom)).toBeLessThan(.005);
    }
  });

  test('static 3D Fit includes depth and tilt in '+viewport.name,async({page})=>{
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    const fonts=await open(page);
    for(const scenario of [
      {label:'short upright',message:'A',tilt:90},
      {label:'wide upright',message:'Where are you Josh?',tilt:90},
      {label:'multiline tilted',message:'Hello\nLOCATE 2026',tilt:45},
      {label:'deep extrusion',message:'3D',tilt:125,depth:3000}
    ]){
      await draw(page,{font:fonts['MAGNETOB.TTF'],...scenario,threeD:true});
      await fit(page);
      const result=await measure(page);
      expectCloseFrame(result,scenario.label+' '+viewport.name);
      expect(result.count).toBe(8);
      expect(result.anchor).toEqual({lng:138.602,lat:-34.93});
      await page.evaluate(()=>GeoGlyphMapEngine.state.map.jumpTo({pitch:10,bearing:-130,zoom:4}));
      await fit(page);
      expect((await measure(page)).zoom).toBeCloseTo(result.zoom,5);
    }
  });

  test('all animation modes keep stable close framing through full rotations at every size in '+viewport.name,async({page})=>{
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    const fonts=await open(page);
    const timings=[];
    try {
    for(const preset of [...presets,{name:'deep extrusion',height:300,depth:3000}]){
      await draw(page,{font:fonts['MAGNETOB.TTF'],...preset,threeD:true});
      for(const mode of ['fixed','yaw','billboard']){
        const timing=await page.evaluate(mode=>{
          GeoGlyph3D.stopOrbit();
          let start=performance.now();GeoGlyph3D.ensureOrbit(mode);const cold=performance.now()-start;
          start=performance.now();GeoGlyph3D.ensureOrbit(mode);const cached=performance.now()-start;
          return {cold,cached};
        },mode);
        timings.push({size:preset.name,mode,...timing});
        await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
        const first=await measure(page);
        await page.waitForFunction(frames=>GeoGlyph3D.stats().animation.frames>frames+3,first.frames);
        const live=await measure(page);
        expect(live.zoom,preset.name+' '+mode+' keeps a stable orbit distance').toBeCloseTo(first.zoom,6);
        expect(live.anchor).toEqual(first.anchor);
        expect(live.center.lng,preset.name+' '+mode+' targets the model longitude '+JSON.stringify(live)).toBeCloseTo(live.poseCenter.lng,4);
        expect(live.center.lat,preset.name+' '+mode+' targets the model latitude '+JSON.stringify(live)).toBeCloseTo(live.poseCenter.lat,4);
        expect(live.elevation,preset.name+' '+mode+' targets the elevated model centre').toBeCloseTo(live.poseElevation,1);
        for(const target of await actualCameraTargets(page)){
          const label=preset.name+' '+mode+' actual camera '+JSON.stringify(target);
          expect(target.actual.lng,label+' targets longitude').toBeCloseTo(target.target.lng,4);
          expect(target.actual.lat,label+' targets latitude').toBeCloseTo(target.target.lat,4);
          expect(target.actualElevation,label+' targets elevation').toBeCloseTo(target.elevation,1);
          expect(target.zoom,label+' preserves orbit zoom').toBeCloseTo(live.zoom,5);
        }
        let maximum=0,minimumMargin=1,maximumFrame;
        // Include the solver's five-degree headings and every half-step between
        // them, checking all three projection dimensions rather than a sphere.
        for(const projected of await measure(page,{rotation:true})){
          const heading=projected.heading;
          expect(projected.centerScreen.x,preset.name+' '+mode+' '+heading+'° targets centre horizontally '+JSON.stringify(projected)).toBeCloseTo(.5,4);
          expect(projected.centerScreen.y,preset.name+' '+mode+' '+heading+'° targets centre vertically '+JSON.stringify(projected)).toBeCloseTo(.5,4);
          expect(projected.positiveW,preset.name+' '+mode+' '+heading+'° faces camera').toBe(true);
          expect(projected.margin,preset.name+' '+mode+' '+heading+'° clears viewport '+JSON.stringify(projected)).toBeGreaterThanOrEqual(.095);
          if(projected.occupancy>maximum){maximum=projected.occupancy;maximumFrame=projected;}
          minimumMargin=Math.min(minimumMargin,projected.margin);
        }
        const label=preset.name+' '+mode+' '+JSON.stringify({maximum,minimumMargin,first,live,maximumFrame});
        expect(minimumMargin,label+' reaches the padded edge').toBeLessThan(.13);
        if(mode!=='fixed'&&preset.name!=='deep extrusion')expect(maximum,label+' uses close frontal framing').toBeGreaterThan(.73);
        expect(maximum,label+' uses close framing').toBeGreaterThan(.50);
        expect(maximum,preset.name+' '+mode+' respects the fit buffer').toBeLessThanOrEqual(.805);
      }
      await page.evaluate(()=>GeoGlyph3D.stopOrbit());
    }
    } finally {
      await test.info().attach('projected-fit-timings.json',{body:JSON.stringify(timings,null,2),contentType:'application/json'});
      const summary=key=>{const values=timings.map(sample=>sample[key]).sort((a,b)=>a-b);return {min:values[0],median:values[Math.floor(values.length/2)],max:values.at(-1)};};
      console.log(viewport.name+' projected fit timings (ms): '+JSON.stringify({cold:summary('cold'),cached:summary('cached')}));
    }
  });
}
