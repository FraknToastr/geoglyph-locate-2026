// Opt-in bounded diagnostic: mocked tiles, no live survey.
const {test,expect}=require('./studio-fixture.cjs');
const path=require('node:path'),{pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==','base64');
test('bounded Turn comparison',async({page},info)=>{
  test.skip(!process.env.GEOGLYPH_TURN_PROFILE,'Opt-in profiling only');
  test.setTimeout(60000);
  const results=[];
  for(const variant of ['previous','current']){
    console.log('TURN_PROFILE starting '+variant);
    await page.unrouteAll();
    await page.route('**/MapServer/tile/**',r=>r.fulfill({body:tile,contentType:'image/png'}));
    const source=variant==='previous'?execFileSync('rtk',['proxy','git','show','14dd480:src/vendor/ground-3d.js'],{maxBuffer:10000000}).toString():require('node:fs').readFileSync(path.resolve(__dirname,'../../src/vendor/ground-3d.js'),'utf8');
    await page.route('**/src/vendor/ground-3d.js',r=>r.fulfill({body:source+';globalThis.turnProbeVariant='+JSON.stringify(variant)+';',contentType:'text/javascript'}));
    await page.goto(pathToFileURL(path.resolve(__dirname,'../../index.html')).href);
    await page.waitForFunction(()=>window.GeoGlyph3D);
    expect(await page.evaluate(()=>window.turnProbeVariant)).toBe(variant);
    await page.evaluate(()=>GeoGlyphMapEngine.showMap());
    await page.waitForFunction(()=>GeoGlyphMapEngine.state.mapReady);
    await page.locator('#mapFontFiles').setInputFiles(path.resolve(__dirname,'../../src/fonts/GILLUBCD.TTF'));
    await page.waitForFunction(()=>GeoGlyphMapEngine.state.fontRecords.get(GeoGlyphMapEngine.state.selectedFontId)?.source==='file'&&!GeoGlyphMapEngine.state.rebuilding&&!GeoGlyphMapEngine.state.pendingBuild,null,{timeout:5000});
    for(const size of [3000,30000]){
      console.log('TURN_PROFILE size '+size);
      await page.evaluate(async height=>{
        GeoGlyph3D.stopOrbit();const s=GeoGlyphMapEngine.state;
        Object.assign(s,{mode:'arcgis',conferenceOverview:false});
        const result=await GeoGlyphMapEngine.applyConferenceCue({fontId:s.selectedFontId,message:'Where are you Josh?',hasNewContent:true,nativeColor:false,extrusionEnabled:true,height,depth:height/10,animation:'yaw',mirrorX:false});
        GeoGlyph3D.ensureOrbit('yaw',{framed:result.fitted});
      },size);
      await page.waitForFunction(()=>GeoGlyph3D.stats().animation.phase==='orbiting');
      const result=await page.evaluate(async()=>{
        const s=GeoGlyphMapEngine.state,map=s.map,intervals=[],updates=[],longTasks=[];let last=0,jumps=0,dom=0;
        const render=()=>{const now=performance.now();if(last)intervals.push(now-last);last=now;};
        const original=map.jumpTo;map.jumpTo=function(...args){const t=performance.now();const result=original.apply(this,args);updates.push(performance.now()-t);jumps++;return result;};
        const observer=new MutationObserver(records=>dom+=records.length);observer.observe(document.getElementById('geoglyphMapEditor'),{subtree:true,attributes:true,childList:true,characterData:true});
        const long=new PerformanceObserver(list=>longTasks.push(...list.getEntries().map(e=>e.duration)));long.observe({type:'longtask',buffered:false});
        const before={worker:await GeoGlyphFontService.workerStats(),render:GeoGlyph3D.stats()};
        map.on('render',render);await new Promise(r=>setTimeout(r,3000));map.off('render',render);
        map.jumpTo=original;observer.disconnect();long.disconnect();
        const after={worker:await GeoGlyphFontService.workerStats(),render:GeoGlyph3D.stats()};
        const quantile=(a,p)=>{const b=[...a].sort((a,b)=>a-b);return b[Math.min(b.length-1,Math.floor(b.length*p))]||0;};
        return {frames:intervals.length,jumps,median:quantile(intervals,.5),p95:quantile(intervals,.95),p99:quantile(intervals,.99),updateP95:quantile(updates,.95),over33:intervals.filter(x=>x>33.4).length,longTasks,dom,before,after,userAgent:navigator.userAgent,renderer:map.getCanvas().getContext('webgl2')?.getParameter(0x1F01)};
      });
      results.push({variant,size,...result});
      expect(result.frames).toBeGreaterThan(10);
      expect(result.after.render.uploads).toBe(result.before.render.uploads);
      expect(result.after.worker.meshBuilds).toBe(result.before.worker.meshBuilds);
      await page.evaluate(()=>GeoGlyph3D.stopOrbit());
    }
  }
  await info.attach('turn-profile',{body:JSON.stringify(results,null,2),contentType:'application/json'});
  if(process.env.GEOGLYPH_PROFILE_OUTPUT)require('node:fs').writeFileSync(process.env.GEOGLYPH_PROFILE_OUTPUT,JSON.stringify(results,null,2));
  console.log('TURN_PROFILE '+JSON.stringify(results));
});
