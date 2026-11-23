const {mkdtemp,rm,writeFile}=require('node:fs/promises');
const {tmpdir}=require('node:os');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {test,expect}=require('../../apps/geoglyph/node_modules/@playwright/test');

const player='apps/umbramatic/ShadowPlayer/index.html';
const corners=[[138.59,-34.92],[138.60,-34.92],[138.60,-34.93],[138.59,-34.93]];
const mapFixture=`
  class RasterMap {
    constructor(){ this.sources=new Map(); this.layers=new Map(); window.rasterMap=this; }
    on(event,callback){ if(event==='load') queueMicrotask(callback); }
    addControl(){}
    addSource(id,options){
      const source={...options,updateImage(update){Object.assign(this,update);}};
      this.sources.set(id,source);
    }
    getSource(id){return this.sources.get(id);}
    removeSource(id){this.sources.delete(id);}
    addLayer(layer){this.layers.set(layer.id,layer);}
    getLayer(id){return this.layers.get(id);}
    removeLayer(id){this.layers.delete(id);}
    setPaintProperty(){}
    fitBounds(){}
  }
  window.maplibregl={Map:RasterMap,NavigationControl:class {}};
`;

for(const portable of [false,true]){
  test(`Umbramatic applies the latest tint after a superseded seek (${portable?'file':'HTTP'})`,async({page})=>{
    await page.route('https://unpkg.com/maplibre-gl@5.13.0/**',route=>{
      const css=new URL(route.request().url()).pathname.endsWith('.css');
      return route.fulfill({contentType:css?'text/css':'application/javascript',body:css?'':mapFixture});
    });
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
    const url=portable?pathToFileURL(path.resolve(__dirname,'../..',player)).href:'/'+player;
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
