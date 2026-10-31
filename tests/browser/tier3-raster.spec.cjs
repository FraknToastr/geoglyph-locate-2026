const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const before=fs.readFileSync(path.join(__dirname,'../fixtures/tier2-colour-ground-mask.js'),'utf8');
const source=fs.readFileSync(path.join(__dirname,'../../src/scripts/geoglyph-map-engine-inline.js'),'utf8');
const start=source.indexOf('  function colourGroundMask(');
const after=source.slice(start,source.indexOf('  function cssFontFamily(',start));

test('raster scratch reuse preserves every pixel and independently owned results',async({page})=>{
  await page.goto('about:blank');
  const result=await page.evaluate(({before,after})=>{
    const mapState={fill:'#bc3268',outline:'#2183b9',outlineWidth:0};
    const make=text=>new Function('mapState',text+';return colourGroundMask;')(mapState);
    const baseline=make(before),candidate=make(after);
    const mask=document.createElement('canvas');mask.width=151;mask.height=97;
    const ctx=mask.getContext('2d');
    const gradient=ctx.createLinearGradient(0,0,151,97);
    gradient.addColorStop(0,'rgba(255,60,20,.4)');gradient.addColorStop(1,'rgba(20,130,255,1)');
    ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(48.3,46.8,31.6,0,Math.PI*2);ctx.fill();
    ctx.font='27px serif';ctx.fillText('Åg🙂',58,70);
    const oldSaved={mask,inkHeight:73},newSaved={mask,inkHeight:73};
    const pixels=canvas=>canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    const originalCreate=document.createElement.bind(document);
    let count=0;
    document.createElement=(...args)=>{if(args[0]==='canvas')count++;return originalCreate(...args);};
    let cases=0,differences=0,beforeCanvases=0,afterCanvases=0;
    const retained=[];
    try{
      for(const nativeColor of [false,true])for(const cssHeight of [0,73,119.4]){
        for(const width of [0,1,1,2.75,8,8,0]){
          mapState.outlineWidth=width;
          mapState.fill=cases%2?'rgba(170,10,230,.65)':'#bc3268';
          mapState.outline=cases%3?'#2183b9':'rgba(20,240,30,.6)';
          count=0;const a=baseline(oldSaved,{nativeColor},cssHeight);beforeCanvases+=count;
          count=0;const b=candidate(newSaved,{nativeColor},cssHeight);afterCanvases+=count;
          const x=pixels(a.canvas),y=pixels(b.canvas);
          for(let i=0;i<x.length;i++)if(x[i]!==y[i])differences++;
          if(a.inkHeight!==b.inkHeight)throw Error('Ink height changed');
          retained.push({canvas:b.canvas,pixels:Uint8ClampedArray.from(y)});cases++;
        }
      }
      for(const item of retained){const now=pixels(item.canvas);for(let i=0;i<now.length;i++)if(now[i]!==item.pixels[i])throw Error('Retained result mutated');}
      return {cases,differences,beforeCanvases,afterCanvases};
    }finally{document.createElement=originalCreate;}
  },{before,after});
  expect(result.cases).toBe(42);expect(result.differences).toBe(0);
  expect(result.afterCanvases).toBeLessThan(result.beforeCanvases);
  console.log('Tier 3 raster comparison',JSON.stringify(result));
});
