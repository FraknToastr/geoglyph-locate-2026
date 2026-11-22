const { test, expect } = require('@playwright/test');
const { buildSync } = require('esbuild');
const path = require('node:path');

// Let headless Chromium finish selecting its graphics adapter before the
// isolated canvas tests. The full map already performs this during startup.
test.beforeAll(async({browser})=>{
  const page=await browser.newPage();
  await page.evaluate(async()=>{
    const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl2');
    if(!gl)throw Error('WebGL 2 is unavailable');
    gl.clear(gl.COLOR_BUFFER_BIT);gl.finish();
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  await page.close();
});

const bundle = buildSync({ stdin: { contents: `
  import {createFontMorphLayer} from './src/scripts/font-morph-renderer.js';
  import {Matrix4,PerspectiveCamera,WebGLRenderer,Scene,Mesh,PlaneGeometry,MeshBasicMaterial,BoxGeometry,MeshLambertMaterial,AmbientLight,DirectionalLight,DoubleSide} from 'three';
  window.MorphRendererTest={createFontMorphLayer,Matrix4,PerspectiveCamera,WebGLRenderer,Scene,Mesh,PlaneGeometry,MeshBasicMaterial,BoxGeometry,MeshLambertMaterial,AmbientLight,DirectionalLight,DoubleSide};
`, resolveDir:path.resolve(__dirname,'../..'), sourcefile:'font-morph-renderer-test.js' }, bundle:true, format:'iife', write:false }).outputFiles[0].text;

async function setup(page) {
  await page.setContent('<canvas width="512" height="512" style="width:512px;height:512px"></canvas>');
  await page.addScriptTag({content:bundle});
  await page.evaluate(async()=>{
    const {createFontMorphLayer,Matrix4,PerspectiveCamera}=window.MorphRendererTest;
    const canvas=document.querySelector('canvas');
    const gl=canvas.getContext('webgl2',{preserveDrawingBuffer:true,antialias:false});
    const map={getCanvas:()=>canvas,triggerRepaint:()=>{}};
    const style={extruded:true,fill:'#ee4400',outline:'#ffffff',outlineWidth:2,opacity:1};
    const camera=new PerspectiveCamera(40,1,.1,20);
    const geographic=new Matrix4(),object=new Matrix4();
    const size=128,source=new Float32Array(size*size),target=new Float32Array(size*size);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const a=(x+.5)/size*1.4-.7,b=(y+.5)/size*1.4-.7;
      source[y*size+x]=(Math.abs(Math.hypot(a,b)-.36)-.12)*1000;
      target[y*size+x]=Math.max(Math.abs(a)-.46,Math.abs(b)-.46)*1000;
    }
    const model={glyphs:[{width:size,height:size,source,target,rect:[-700,-700,700,700],originA:[0,0],originB:[0,0]}],
      fromBounds:{minX:-500,maxX:500,minY:-500,maxY:500,height:1000,cx:0,cy:0},bounds:{minX:-500,maxX:500,minY:-500,maxY:500,height:1000,cx:0,cy:0}};
    const errors=[];
    const layer=createFontMorphLayer({map,getPose:()=>({geographic,object}),getStyle:()=>style,onError:e=>errors.push(e.message)});
    layer.onAdd(map,gl);await layer.prepareModel(model);
    const clip=()=>new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    const pose=(angle=0,elevation=0)=>{
      const radius=3;camera.position.set(Math.sin(angle)*Math.cos(elevation)*radius,Math.sin(elevation)*radius,Math.cos(angle)*Math.cos(elevation)*radius);
      camera.lookAt(0,0,0);camera.updateMatrixWorld();
    };
    const draw=progress=>{
      gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      layer.setProgress(progress);layer.render(gl,{defaultProjectionData:{mainMatrix:clip().elements}});
      gl.finish();const pixels=new Uint8Array(512*512*4);gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      let visible=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]>100)visible++;
      return {visible,center:Array.from(pixels.slice((256*512+256)*4,(256*512+256)*4+4)),error:gl.getError()};
    };
    pose();window.probe={canvas,gl,map,layer,style,camera,geographic,object,model,errors,pose,draw};
  });
}

test('GPU fields reshape holes and silhouettes in flat and extruded modes without uploads during playback',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await setup(page);
  const result=await page.evaluate(()=>{
    const {layer,style,pose,draw,errors}=probe;
    const before=layer.stats();style.extruded=false;
    const flat=[draw(0),draw(.5),draw(1)];
    style.extruded=true;const orbit=[];
    for(let i=0;i<12;i++){pose(i*Math.PI/6,.35);orbit.push(draw(i/11));}
    return {before,after:layer.stats(),flat,orbit,errors};
  });
  expect(errors).toEqual([]);expect(result.errors).toEqual([]);
  expect(result.flat[0].center[0]).toBe(0);expect(result.flat[2].center[0]).toBeGreaterThan(200);
  expect(result.flat[0].visible).toBeLessThan(result.flat[1].visible);
  expect(result.flat[1].visible).toBeLessThan(result.flat[2].visible);
  expect(result.orbit.every(frame=>frame.visible>1000&&frame.error===0)).toBe(true);
  expect(result.after.uploads).toBe(result.before.uploads);
  expect(result.after.uniformUpdates-result.before.uniformUpdates).toBe(15);
  expect(result.after.failures).toBe(0);
});

test('raymarched surfaces write hit depth instead of back-of-proxy depth',async({page})=>{
  await setup(page);
  const result=await page.evaluate(()=>{
    const {layer,style,camera,gl,map,draw}=probe;
    const {WebGLRenderer,Scene,Mesh,PlaneGeometry,MeshBasicMaterial}=window.MorphRendererTest;
    style.extruded=true;draw(1);
    const renderer=new WebGLRenderer({canvas:map.getCanvas(),context:gl,antialias:false});renderer.autoClear=false;
    const scene=new Scene(),geometry=new PlaneGeometry(1.1,1.1),material=new MeshBasicMaterial({color:'#0044ff'});
    const plane=new Mesh(geometry,material);scene.add(plane);
    // Plane at z=0 lies behind the implicit front cap (+.5) but ahead of the
    // proxy's back face (-.5). A proxy-depth bug would incorrectly paint blue.
    renderer.resetState();renderer.render(scene,camera);renderer.resetState();
    const pixel=new Uint8Array(4);gl.readPixels(256,256,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
    const front=Array.from(pixel);plane.position.z=.7;renderer.render(scene,camera);renderer.resetState();
    gl.readPixels(256,256,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
    const occluded=Array.from(pixel);geometry.dispose();material.dispose();renderer.dispose();
    return {front,occluded,error:gl.getError(),stats:layer.stats()};
  });
  expect(result.front[0]).toBeGreaterThan(200);expect(result.front[2]).toBeLessThan(20);
  expect(result.occluded[2]).toBeGreaterThan(200);expect(result.occluded[0]).toBeLessThan(20);
  expect(result.error).toBe(0);expect(result.stats.failures).toBe(0);
});

test('mirrored extrusion stays visible outside and inside the proxy box',async({page})=>{
  await setup(page);
  const result=await page.evaluate(()=>{
    const {style,object,camera,pose,draw}=probe;
    style.extruded=true;style.outlineWidth=0;
    const images=[];
    for(const [close,outlineWidth] of [[false,0],[true,0],[true,2]]){
      style.outlineWidth=outlineWidth;
      if(close){camera.position.set(.2,0,0);camera.lookAt(.2,0,1);camera.updateMatrixWorld();}
      else pose(.7,.35);
      object.identity();const ordinary=draw(0);
      object.makeScale(-1,1,1);const mirrored=draw(0);
      images.push({close,outlineWidth,ordinary,mirrored});
    }
    return {images,errors:probe.errors};
  });
  expect(result.errors).toEqual([]);
  for(const image of result.images){
    expect(image.ordinary.visible,JSON.stringify(image)).toBeGreaterThan(1000);
    expect(image.mirrored.visible,JSON.stringify(image)).toBeGreaterThan(1000);
    expect(Math.abs(image.mirrored.visible-image.ordinary.visible)/image.ordinary.visible).toBeLessThan(.03);
    expect(image.mirrored.error).toBe(0);
  }
});

test('cancelled staged upload preserves the displayed model and disposal frees GPU resources',async({page})=>{
  await setup(page);
  const result=await page.evaluate(async()=>{
    const {layer,model,draw}=probe,before=layer.stats();
    let code='';try{await layer.prepareModel(model,{isCurrent:()=>false});}catch(error){code=error.code;}
    const frame=draw(1),after=layer.stats();layer.dispose();
    return {code,before,after,frame,disposed:layer.stats()};
  });
  expect(result.code).toBe('MORPH_CANCELLED');expect(result.frame.visible).toBeGreaterThan(1000);
  expect(result.after.bytes).toBe(result.before.bytes);expect(result.after.glyphs).toBe(result.before.glyphs);
  expect(result.disposed.bytes).toBe(0);expect(result.disposed.glyphs).toBe(0);expect(result.disposed.ready).toBe(false);
});

test('repeated glyph pairs share one GPU field texture and one upload',async({page})=>{
  await setup(page);
  const result=await page.evaluate(async()=>{
    const {layer,model}=probe,before=layer.stats();
    const repeated={...model,glyphs:Array.from({length:12},(_,index)=>({...model.glyphs[0],originA:[index*100,0],originB:[index*110,0]}))};
    await layer.prepareModel(repeated);const after=layer.stats();
    return {before,after};
  });
  expect(result.after.glyphs).toBe(12);
  expect(result.after.bytes).toBe(result.before.bytes);
  expect(result.after.uploads-result.before.uploads).toBe(1);
});

test('flat opacity is applied once to the union of overlapping glyphs',async({page})=>{
  await setup(page);
  const result=await page.evaluate(async()=>{
    const {layer,style,model,draw,gl}=probe;style.extruded=false;style.opacity=.4;
    const single=draw(1);
    const a=new Uint8Array(512*512*4);gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,a);
    const repeated={...model,glyphs:Array.from({length:5},()=>({...model.glyphs[0]}))};
    await layer.prepareModel(repeated);const overlap=draw(1);
    const b=new Uint8Array(a.length);gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,b);
    let differences=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])differences++;
    return {single,overlap,differences,stats:layer.stats()};
  });
  expect(result.single.center[0]).toBeGreaterThan(85);expect(result.single.center[0]).toBeLessThan(105);
  expect(result.overlap.center).toEqual(result.single.center);
  expect(result.overlap.visible).toBe(result.single.visible);
  expect(result.differences).toBe(0);
  expect(result.stats.coverageBytes).toBe(512*512*4);expect(result.stats.failures).toBe(0);
});

test('flat union composite respects actual map depth after the offscreen pass',async({page})=>{
  await setup(page);
  const result=await page.evaluate(()=>{
    const {layer,style,camera,gl,map}=probe;
    const {WebGLRenderer,Scene,Mesh,PlaneGeometry,MeshBasicMaterial,Matrix4}=window.MorphRendererTest;
    style.extruded=false;style.outlineWidth=0;layer.setProgress(1);
    const renderer=new WebGLRenderer({canvas:map.getCanvas(),context:gl,antialias:false});renderer.autoClear=false;
    const scene=new Scene(),geometry=new PlaneGeometry(1.1,1.1),material=new MeshBasicMaterial({color:'#0044ff'});
    const plane=new Mesh(geometry,material);scene.add(plane);
    const renderAt=z=>{
      renderer.resetState();gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      plane.position.z=z;renderer.render(scene,camera);renderer.resetState();
      const matrix=new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
      layer.render(gl,{defaultProjectionData:{mainMatrix:matrix.elements}});
      const pixel=new Uint8Array(4);gl.readPixels(256,256,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);return Array.from(pixel);
    };
    const behind=renderAt(-.2),ahead=renderAt(.2);
    geometry.dispose();material.dispose();renderer.dispose();
    return {behind,ahead,error:gl.getError(),stats:layer.stats()};
  });
  expect(result.behind[0]).toBeGreaterThan(200);expect(result.behind[2]).toBeLessThan(20);
  expect(result.ahead[2]).toBeGreaterThan(200);expect(result.ahead[0]).toBeLessThan(20);
  expect(result.error).toBe(0);expect(result.stats.failures).toBe(0);
});

test('staged uploads settle on abort and disposal even when animation frames are suspended',async({page})=>{
  await setup(page);
  const result=await page.evaluate(async()=>{
    const {layer,model}=probe,before=layer.stats();
    const raf=requestAnimationFrame,cancel=cancelAnimationFrame;
    window.requestAnimationFrame=()=>12345;window.cancelAnimationFrame=()=>{};
    try {
      const controller=new AbortController();let abortCode='',disposeCode='';
      const pending=layer.prepareModel(model,{signal:controller.signal}).catch(error=>{abortCode=error.code;});
      controller.abort();await pending;
      const after=layer.stats(),pendingDispose=layer.prepareModel(model).catch(error=>{disposeCode=error.code;});
      layer.dispose();await pendingDispose;
      return {before,after,abortCode,disposeCode,disposed:layer.stats()};
    }finally{window.requestAnimationFrame=raf;window.cancelAnimationFrame=cancel;}
  });
  expect(result.abortCode).toBe('MORPH_CANCELLED');expect(result.disposeCode).toBe('MORPH_CANCELLED');
  expect(result.after.fieldBytes).toBe(result.before.fieldBytes);expect(result.after.glyphs).toBe(1);
  expect(result.disposed.bytes).toBe(0);expect(result.disposed.ready).toBe(false);
});

test('extruded side lighting matches the ordinary Lambert renderer across object tilt',async({page})=>{
  await setup(page);
  const result=await page.evaluate(()=>{
    const {layer,style,object,camera,gl,draw,pose}=probe;
    const {WebGLRenderer,Scene,Mesh,BoxGeometry,MeshBasicMaterial,MeshLambertMaterial,AmbientLight,DirectionalLight,DoubleSide}=window.MorphRendererTest;
    style.extruded=true;style.outlineWidth=0;object.makeRotationX(.55);pose(.7,.3);draw(1);
    const fieldImage=new Uint8Array(512*512*4);gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,fieldImage);
    const renderer=new WebGLRenderer({canvas:gl.canvas,context:gl,antialias:false});renderer.autoClear=false;
    const front=new MeshBasicMaterial({color:style.fill,side:DoubleSide}),side=new MeshLambertMaterial({color:style.fill,side:DoubleSide});side.color.multiplyScalar(.62);
    const geometry=new BoxGeometry(.92,.92,1),mesh=new Mesh(geometry,[side,side,side,side,front,front]);mesh.matrixAutoUpdate=false;mesh.matrix.copy(object);
    const scene=new Scene();scene.add(mesh);scene.add(new AmbientLight(0xffffff,1.3));
    const light=new DirectionalLight(0xffffff,2);light.position.set(-1,-2,4);scene.add(light);
    renderer.resetState();gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);renderer.render(scene,camera);renderer.resetState();
    const meshImage=new Uint8Array(512*512*4);gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,meshImage);
    let compared=0,matched=0,sideCompared=0,sideMatched=0;
    for(let i=0;i<fieldImage.length;i+=4){
      if(fieldImage[i]<30||meshImage[i]<30)continue;
      compared++;const same=Math.abs(fieldImage[i]-meshImage[i])<=4&&Math.abs(fieldImage[i+1]-meshImage[i+1])<=4;
      if(same)matched++;if(meshImage[i]<220){sideCompared++;if(same)sideMatched++;}
    }
    geometry.dispose();side.dispose();front.dispose();renderer.dispose();
    return {compared,matched,sideCompared,sideMatched,errors:probe.errors};
  });
  expect(result.errors).toEqual([]);expect(result.compared).toBeGreaterThan(1000);expect(result.sideCompared).toBeGreaterThan(1000);
  expect(result.matched/result.compared).toBeGreaterThan(.97);expect(result.sideMatched/result.sideCompared).toBeGreaterThan(.97);
});

test('hardware float filtering agrees with the manual fallback in 2D and 3D',async({page})=>{
  await setup(page);
  const result=await page.evaluate(async()=>{
    const {layer,style,model,map,gl,geographic,object,camera,pose}=probe;
    const {createFontMorphLayer,Matrix4}=window.MorphRendererTest,errors=[];
    const manual=createFontMorphLayer({map,getPose:()=>({geographic,object}),getStyle:()=>style,forceManualFiltering:true,onError:error=>errors.push(error.message)});
    manual.onAdd(map,gl);await manual.prepareModel(model);
    const draw=renderer=>{
      gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      const matrix=new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
      renderer.render(gl,{defaultProjectionData:{mainMatrix:matrix.elements}});
      const pixels=new Uint8Array(512*512*4);gl.readPixels(0,0,512,512,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return pixels;
    };
    const comparisons=[];
    for(const extruded of [false,true])for(const progress of [0,.37,1]){
      style.extruded=extruded;pose(extruded?.7:0,extruded?.3:0);
      layer.setProgress(progress);manual.setProgress(progress);
      const a=draw(layer),b=draw(manual);let differs=0,total=0;
      for(let i=0;i<a.length;i+=4){
        if(a[i]||b[i])total++;
        if(Math.abs(a[i]-b[i])>3||Math.abs(a[i+1]-b[i+1])>3||Math.abs(a[i+2]-b[i+2])>3)differs++;
      }
      comparisons.push({extruded,progress,differs,total});
    }
    const hardware=layer.stats(),fallback=manual.stats();manual.dispose();
    return {comparisons,hardware,fallback,errors,glError:gl.getError()};
  });
  expect(result.errors).toEqual([]);expect(result.glError).toBe(0);
  expect(result.fallback.filtering).toBe('manual-bilinear');
  for(const image of result.comparisons)expect(image.differs/Math.max(1,image.total)).toBeLessThan(.005);
  expect(result.hardware.failures).toBe(0);expect(result.fallback.failures).toBe(0);
});
