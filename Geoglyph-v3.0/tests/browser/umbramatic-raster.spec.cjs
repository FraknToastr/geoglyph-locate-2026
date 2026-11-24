const {mkdir,mkdtemp,readFile,rm,writeFile}=require('node:fs/promises');
const {createServer}=require('node:http');
const {tmpdir}=require('node:os');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {test,expect}=require('../../apps/geoglyph/node_modules/@playwright/test');

const player='apps/umbramatic/ShadowPlayer/index.html';
const suite=path.resolve(__dirname,'../..');
const corners=[[138.59,-34.92],[138.60,-34.92],[138.60,-34.93],[138.59,-34.93]];
const eastCorners=corners.map(([x,y])=>[x+.01,y]);
const mapFixture=`
  class RasterMap {
    constructor(){
      this.sources=new Map();
      this.layers=new Map();
      this.listeners=new Map();
      this.held=new Map();
      window.rasterMap=this;
    }
    on(event,callback){
      if(!this.listeners.has(event))this.listeners.set(event,new Set());
      this.listeners.get(event).add(callback);
      if(event==='load')queueMicrotask(callback);
    }
    off(event,callback){this.listeners.get(event)?.delete(callback);}
    emit(event,data){for(const callback of this.listeners.get(event)??[])callback(data);}
    addControl(){}
    addSource(id,options){
      const source={...options,updateImage(update){Object.assign(this,update);}};
      this.sources.set(id,source);
      if(options.type==='image')void this.decodeSource(id,source);
    }
    async decodeSource(id,source){
      try {
        const bitmap=await createImageBitmap(await (await fetch(source.url)).blob());
        source.width=bitmap.width;
        bitmap.close();
        if(this.sources.get(id)!==source)return;
        const ready=()=>this.emit('sourcedata',{sourceId:id,sourceDataType:'metadata'});
        if(this.hold?.(id,source))this.held.set(id,ready);
        else ready();
      }catch(error){
        if(this.sources.get(id)===source)this.emit('error',{sourceId:id,error});
      }
    }
    getSource(id){return this.sources.get(id);}
    removeSource(id){this.held.delete(id);this.sources.delete(id);}
    addLayer(layer){this.layers.set(layer.id,layer);}
    getLayer(id){return this.layers.get(id);}
    removeLayer(id){this.layers.delete(id);}
    setPaintProperty(){}
    fitBounds(){}
  }
  window.maplibregl={Map:RasterMap,NavigationControl:class {}};
`;

function mockMapLibre(page){
  return page.route('https://unpkg.com/maplibre-gl@5.13.0/**',route=>{
    const css=new URL(route.request().url()).pathname.endsWith('.css');
    return route.fulfill({contentType:css?'text/css':'application/javascript',body:css?'':mapFixture});
  });
}

for(const viewport of [{width:1440,height:860},{width:940,height:520},{width:420,height:680}]){
  test(`Umbramatic Sun Dome leaves the media controls usable at ${viewport.width}px`,async({page})=>{
    await page.setViewportSize(viewport);
    await mockMapLibre(page);
    const folder=await mkdtemp(path.join(tmpdir(),'umbramatic-dome-test-'));
    try{
      await makePreviewExport(page,folder);
      await page.goto(pathToFileURL(path.join(suite,player)).href);
      await page.locator('#folderInput').setInputFiles(folder);
      const capture=page.locator('#captureIndex');
      await expect(capture).toHaveText('1 / 3');
      const toggle=page.getByRole('button',{name:'Sun Dome',exact:true});
      await toggle.click();
      const dome=page.getByRole('dialog',{name:'Sun Dome'});
      const minimise=dome.getByRole('button',{name:'Minimise Sun Dome'});
      const media=page.locator('#mediaPlayer');
      await expect(minimise).toBeFocused();
      const [snapshotBox,domeBox,mediaBox,minimiseBox]=await Promise.all([
        page.locator('#mapMeta').boundingBox(),dome.boundingBox(),media.boundingBox(),minimise.boundingBox()
      ]);
      expect(domeBox.y-snapshotBox.y-snapshotBox.height).toBeGreaterThanOrEqual(10);
      expect(Math.abs(domeBox.x+domeBox.width-snapshotBox.x-snapshotBox.width)).toBeLessThan(2);
      expect(viewport.width-domeBox.x-domeBox.width).toBeGreaterThanOrEqual(16);
      expect(viewport.height-domeBox.y-domeBox.height).toBeGreaterThanOrEqual(18);
      const verticalGap=mediaBox.y-domeBox.y-domeBox.height;
      const horizontalGap=domeBox.x-mediaBox.x-mediaBox.width;
      expect(Math.max(verticalGap,horizontalGap)).toBeGreaterThanOrEqual(12);
      expect(minimiseBox.y+minimiseBox.height).toBeLessThan(domeBox.y+domeBox.height);

      await media.locator('[data-speed="0.25"]').click();
      await media.getByRole('button',{name:'Play',exact:true}).click();
      await media.getByRole('button',{name:'Pause',exact:true}).press('Space');
      await media.getByRole('button',{name:'Next capture'}).click();
      await expect(capture).toHaveText('2 / 3');
      await media.getByRole('slider').press('End');
      await expect(capture).toHaveText('3 / 3');
      await expect(dome).toBeVisible();
      const before=await page.locator('#domeDirection').textContent();
      await dome.locator('#solarDome').press('ArrowRight');
      await expect(page.locator('#domeDirection')).not.toHaveText(before);
      await expect(capture).toHaveText('3 / 3');
      await page.keyboard.press('Escape');
      await expect(dome).toBeHidden();
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute('aria-expanded','false');
    }finally{await rm(folder,{force:true,recursive:true});}
  });
}

for(const portable of [false,true]){
  test(`Umbramatic applies the latest tint after a superseded seek (${portable?'file':'HTTP'})`,async({page})=>{
    await mockMapLibre(page);
    await page.addInitScript(()=>{
      window.pendingRed=0;
      window.cancelledTintWorkers=0;
      const WorkerConstructor=window.Worker;
      window.Worker=class extends WorkerConstructor {
        postMessage(message,...args){
          if(message.finish?.colour==='#aa0000'){window.pendingRed++;return;}
          return super.postMessage(message,...args);
        }
        terminate(){window.cancelledTintWorkers++;return super.terminate();}
      };
    });
    const url=portable?pathToFileURL(path.join(suite,player)).href:'/'+player;
    await page.goto(url);
    const folder=await mkdtemp(path.join(tmpdir(),'umbramatic-raster-test-'));
    try{
      const raw=await page.evaluate(()=>{
        const canvas=document.createElement('canvas');
        canvas.width=canvas.height=4;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle='rgba(0,0,0,.5)';
        ctx.fillRect(0,0,2,4);
        return canvas.toDataURL('image/png').split(',')[1];
      });
      const manifest={
        schema:'uos-shadow-player-v1',encoding:{format:'png',transparent_sunlit:true},
        frames:[0,1].map(index=>({
          local_datetime:`2026-06-21T0${8+index}:00:00`,
          tiles:[{path:`mask-${index}.png`,coordinates:corners}]
        }))
      };
      await Promise.all([
        writeFile(path.join(folder,'shadow_player_manifest.json'),JSON.stringify(manifest)),
        ...manifest.frames.map(frame=>writeFile(path.join(folder,frame.tiles[0].path),Buffer.from(raw,'base64')))
      ]);
      await page.locator('#folderInput').setInputFiles(folder);
      await page.waitForFunction(()=>shadowPlayerDiagnostics().activeTiles===1);
      const colour=page.locator('#shadowColour');
      await colour.fill('#aa0000');
      await page.waitForFunction(()=>window.pendingRed>0);

      // Supersede an in-flight worker job with a seek followed by a new colour.
      await page.locator('#scrubber').evaluate(slider=>{
        slider.value='1';
        slider.dispatchEvent(new Event('input',{bubbles:true}));
      });
      await colour.fill('#008000');
      const sample=()=>page.evaluate(async()=>{
        const source=rasterMap.getSource('shadow-source-r0_c0');
        const bitmap=await createImageBitmap(await (await fetch(source.url)).blob());
        try{
          const canvas=document.createElement('canvas');
          canvas.width=bitmap.width;canvas.height=bitmap.height;
          const ctx=canvas.getContext('2d');
          ctx.drawImage(bitmap,0,0);
          return {shadow:[...ctx.getImageData(0,0,1,1).data],clear:[...ctx.getImageData(3,0,1,1).data],coordinates:source.coordinates};
        }finally{bitmap.close();}
      });
      await expect.poll(sample).toEqual({shadow:[0,128,0,128],clear:[0,0,0,0],coordinates:corners});
      expect(await page.evaluate(()=>window.cancelledTintWorkers)).toBeGreaterThan(0);
      const stats=await page.evaluate(()=>shadowPlayerDiagnostics());
      expect(stats.selected).toBe(1);
      expect(stats.cacheBytes).toBeLessThanOrEqual(stats.cacheBudget);
      expect(stats.tintBackend).toBe('worker');
      await page.locator('#resetShadowColour').click();
      await expect.poll(sample).toEqual({shadow:[0,0,0,128],clear:[0,0,0,0],coordinates:corners});
    }finally{await rm(folder,{force:true,recursive:true});}
  });
}

async function makePreviewExport(page,folder){
  const rasters=await page.evaluate(()=>{
    const canvas=document.createElement('canvas');
    const files={};
    for(const [type,width] of [['png',16],['webp',8]]){
      canvas.width=width;
      canvas.height=width;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='rgba(0,0,0,.5)';
      ctx.fillRect(0,0,width/2,width);
      files[type]=canvas.toDataURL('image/'+type).split(',')[1];
    }
    return files;
  });
  const previews='shadow_player_previews/';
  const stamp='2026-06-21T00:00:00Z';
  const index={schema:'uos-shadow-player-previews-v1',export_generated_at_utc:stamp,tiles:{}};
  const manifest={
    schema:'uos-shadow-player-v1',generated_at_utc:stamp,encoding:{format:'png',transparent_sunlit:true},
    frames:[0,1,2].map(frame=>({
      local_datetime:`2026-06-21T0${frame+7}:00:00`,
      tiles:[corners,eastCorners].map((coordinates,column)=>({
        path:`capture-${frame}-${column}.png`,row:0,column,coordinates
      }))
    }))
  };
  const contents=new Map([['shadow_player_manifest.json',JSON.stringify(manifest)]]);
  for(const [frame,{tiles}] of manifest.frames.entries()){
    for(const tile of tiles){
      const name=String(frame*2+tile.column).padStart(64,'0')+'.webp';
      index.tiles[tile.path]=name;
      contents.set(tile.path,Buffer.from(rasters.png,'base64'));
      const image=frame===2 && tile.column===1 ? 'Unreadable preview' : Buffer.from(rasters.webp,'base64');
      contents.set(previews+name,image);
    }
  }
  contents.set(previews+'index.json',JSON.stringify(index));
  await mkdir(path.join(folder,previews));
  await Promise.all(Array.from(contents,([file,body])=>writeFile(path.join(folder,file),body)));
  return contents;
}

async function hostPreviewExport(contents){
  const mount='/'+path.posix.dirname(player)+'/';
  const appFiles=['index.html','app.js','raster-images.js','solar.js','controls.css','styles.css','solar.css',
    'vendor/ambientcss-3.1.0/ambient.css'].map(file=>mount+file);
  appFiles.push('/apps/geoglyph/src/scripts/survey-results.js','/shared/suite-routing.js','/shared/app-return.js');
  const types={'.html':'text/html','.js':'application/javascript','.css':'text/css',
    '.json':'application/json','.png':'image/png','.webp':'image/webp'};
  const server=createServer(async(req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    const body=pathname.startsWith(mount+'data/') ? contents.get(pathname.slice(mount.length+5))
      : appFiles.includes(pathname) ? await readFile(path.join(suite,pathname)) : undefined;
    if(body===undefined){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(pathname)]}).end(body);
  });
  await new Promise((resolve,reject)=>{
    server.once('error',reject);
    server.listen(0,'127.0.0.1',resolve);
  });
  return {
    url:`http://127.0.0.1:${server.address().port}/${player}`,
    async close(){
      server.closeAllConnections();
      await new Promise(resolve=>server.close(resolve));
    }
  };
}

for(const portable of [false,true]){
  test(`Umbramatic uses saved previews and holds the visible snapshot during inspection (${portable?'file':'hosted HTTP'})`,async({page})=>{
    await mockMapLibre(page);
    const folder=await mkdtemp(path.join(tmpdir(),'umbramatic-preview-test-'));
    let host;
    try{
      const contents=await makePreviewExport(page,folder);
      if(!portable)host=await hostPreviewExport(contents);
      await page.goto(host?.url??pathToFileURL(path.join(suite,player)).href);
      if(portable)await page.locator('#folderInput').setInputFiles(folder);
      const displayed=()=>page.evaluate(()=>{
        const {displayed,displayedPreview,playing}=shadowPlayerDiagnostics();
        return {displayed,displayedPreview,playing};
      });
      const tileState=()=>page.evaluate(()=>{
        const layers=[...rasterMap.layers.values()].filter(layer=>layer.id.startsWith('shadow-layer-'));
        return layers.map(layer=>{
          const source=rasterMap.getSource(layer.source);
          return {id:layer.id,width:source.width,coordinates:source.coordinates};
        });
      });
      const widths=async()=> (await tileState()).map(tile=>tile.width);
      await expect.poll(displayed).toEqual({displayed:0,displayedPreview:false,playing:false});
      expect(await widths()).toEqual([16,16]);
      await page.locator('#shadowColour').fill('#008000');
      await page.locator('#playPause').click();
      await expect.poll(displayed).toEqual({displayed:1,displayedPreview:true,playing:true});
      expect(await widths()).toEqual([8,8]);
      const preview=await page.evaluate(async()=>{
        const layer=[...rasterMap.layers.values()].find(layer=>layer.id.startsWith('shadow-layer-'));
        const {url}=rasterMap.getSource(layer.source);
        const image=await createImageBitmap(await(await fetch(url)).blob());
        try{
          const canvas=new OffscreenCanvas(image.width,image.height);
          const ctx=canvas.getContext('2d');
          ctx.drawImage(image,0,0);
          return [...ctx.getImageData(0,0,1,1).data,...ctx.getImageData(7,0,1,1).data];
        }finally{image.close();}
      });
      expect(preview).toEqual([0,128,0,128,0,0,0,0]);

      // Hold one native tile so the other one can finish without changing visible layers.
      const visible=await tileState();
      await page.evaluate(()=>{
        rasterMap.hold=(id,source)=>id.includes('_c1-') && source.width===16;
        document.querySelector('#playPause').click();
      });
      await page.waitForFunction(()=>rasterMap.held.size===1);
      expect(await displayed()).toEqual({displayed:1,displayedPreview:true,playing:false});
      expect(await tileState()).toEqual(visible);

      // The last seek supersedes the paused restoration and every earlier seek.
      await page.locator('#scrubber').evaluate(input=>{
        for(const target of ['2','1','0']){
          input.value=target;
          input.dispatchEvent(new Event('input',{bubbles:true}));
        }
      });
      await page.waitForFunction(()=>rasterMap.held.size===1 && shadowPlayerDiagnostics().selected===0);
      expect(await tileState()).toEqual(visible);
      await page.evaluate(()=>{
        rasterMap.hold=null;
        for(const ready of rasterMap.held.values())ready();
        rasterMap.held.clear();
      });
      await expect.poll(displayed).toEqual({displayed:0,displayedPreview:false,playing:false});
      expect(await widths()).toEqual([16,16]);
      expect((await tileState()).map(tile=>tile.coordinates)).toEqual([corners,eastCorners]);
      expect(await page.evaluate(()=>rasterMap.sources.size)).toBe(2);

      await page.locator('[data-loop="once"]').click();
      await page.locator('#playPause').click();
      await expect.poll(displayed).toEqual({displayed:2,displayedPreview:false,playing:false});
      expect(await widths()).toEqual([16,16]);
    }finally{
      await host?.close();
      await rm(folder,{force:true,recursive:true});
    }
  });
}
