// Opt-in short diagnostic. Pixel reads perturb timing; compare coverage, not FPS.
const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
test('bounded Turn tile-loading and edge-coverage diagnostic',async({page})=>{
  test.skip(!process.env.GEOGLYPH_TILE_PROFILE,'Opt-in diagnostic only');test.setTimeout(55000);
  const output=[];
  for(const scenario of ['immediate','delayed',...(process.env.GEOGLYPH_REAL_TILE_PROFILE?['real']:[])]){
    let requested=0,completed=0;const tasks=new Set();
    await page.unrouteAll({behavior:'wait'});
    const green=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').fillStyle='#24bc68';c.getContext('2d').fillRect(0,0,16,16);return c.toDataURL().split(',')[1];});
    if(scenario!=='real')await page.route('**/MapServer/tile/**',async route=>{
      requested++;if(scenario==='delayed')await new Promise(resolve=>{const timer=setTimeout(()=>{tasks.delete(timer);resolve();},600);tasks.add(timer);});
      try{await route.fulfill({body:Buffer.from(green,'base64'),contentType:'image/png'});completed++;}catch(_){}
    });
    const onRequest=r=>{if(scenario==='real'&&r.url().includes('/MapServer/tile/'))requested++;};
    const onFinished=r=>{if(scenario==='real'&&r.url().includes('/MapServer/tile/'))completed++;};
    page.on('request',onRequest);page.on('requestfinished',onFinished);
    await page.goto(pathToFileURL(path.resolve(__dirname,'../../index.html')).href);
    await page.waitForFunction(()=>window.GeoGlyph3D);
    if(process.env.GEOGLYPH_KEEP_PENDING)await page.evaluate(()=>{const Original=maplibregl.Map;maplibregl.Map=new Proxy(Original,{construct(Target,args,NewTarget){args[0]={...args[0],cancelPendingTileRequestsWhileZooming:false};return Reflect.construct(Target,args,NewTarget);}});});
    await page.evaluate(()=>GeoGlyphMapEngine.showMap());
    await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
    await page.locator('#mapFontFiles').setInputFiles(path.resolve(__dirname,'../../src/fonts/GILLUBCD.TTF'));
    await page.waitForFunction(()=>GeoGlyphMapEngine.state.fontRecords.get(GeoGlyphMapEngine.state.selectedFontId)?.source==='file'&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild);
    await page.evaluate(async()=>{
      const s=GeoGlyphMapEngine.state;s.mode='arcgis';s.conferenceOverview=false;
      const result=await GeoGlyphMapEngine.applyConferenceCue({fontId:s.selectedFontId,message:'Where are you Josh?',hasNewContent:true,nativeColor:false,extrusionEnabled:true,height:3000,depth:300,animation:'yaw',mirrorX:false});
      const map=s.map;map.setPaintProperty('background','background-color','#ff00ff');
      for(const layer of map.getStyle().layers)if(!['background','raster'].includes(layer.type))map.setLayoutProperty(layer.id,'visibility','none');
      GeoGlyph3D.ensureOrbit('yaw',{framed:result.fitted});
    });
    const requestsAtStart={requested,completed};
    const samples=await page.evaluate(async()=>{
      const map=GeoGlyphMapEngine.state.map,canvas=map.getCanvas(),gl=canvas.getContext('webgl2')||canvas.getContext('webgl');
      const edge=8,right=new Uint8Array(edge*gl.drawingBufferHeight*4),top=new Uint8Array(gl.drawingBufferWidth*edge*4),samples=[];let last=0;
      const count=data=>{let n=0;for(let i=0;i<data.length;i+=4)if(data[i+3]===0||(data[i]>220&&data[i+1]<40&&data[i+2]>220))n++;return n/(data.length/4);};
      const inspect=()=>{const now=performance.now();if(now-last<250)return;last=now;gl.readPixels(gl.drawingBufferWidth-edge,0,edge,gl.drawingBufferHeight,gl.RGBA,gl.UNSIGNED_BYTE,right);gl.readPixels(0,gl.drawingBufferHeight-edge,gl.drawingBufferWidth,edge,gl.RGBA,gl.UNSIGNED_BYTE,top);samples.push({bearing:map.getBearing(),right:count(right),top:count(top),loaded:map.areTilesLoaded()});};
      map.on('render',inspect);await new Promise(r=>setTimeout(r,3000));GeoGlyph3D.stopOrbit();await new Promise(r=>setTimeout(r,1200));map.triggerRepaint();await new Promise(r=>map.once('render',r));inspect();map.off('render',inspect);
      return samples;
    });
    output.push({scenario,requestsAtStart,requestsAtEnd:{requested,completed},samples});
    expect(samples.length).toBeGreaterThan(3);
    page.off('request',onRequest);page.off('requestfinished',onFinished);
    for(const timer of tasks)clearTimeout(timer);
  }
  if(process.env.GEOGLYPH_TILE_PROFILE_OUTPUT)fs.writeFileSync(process.env.GEOGLYPH_TILE_PROFILE_OUTPUT,JSON.stringify(output,null,2));
  console.log('TILE_PROFILE '+JSON.stringify(output));
});
