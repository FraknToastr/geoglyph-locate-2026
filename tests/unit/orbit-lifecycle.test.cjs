const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const source=require('esbuild').buildSync({stdin:{contents:"export {createGroundCamera} from './ground-camera.js'; export {Matrix4} from 'three';",resolveDir:path.resolve(__dirname,'../../src/scripts')},bundle:true,format:'iife',globalName:'CameraModule',write:false}).outputFiles[0].text;
const math=require('../../src/scripts/ground-transform.js');
function harness(){
  let sequence=0,time=100,clamped=true,elevation=0,heading=0,currentZoom=14,pitch=55,center={lng:139,lat:-35},lastOptions;
  let projectionCalls=0;
  let Matrix4;
  const frames=new Map(),listeners=new Map(),events=new Map();
  const map={
    on(type,fn){events.set(type,fn);},off(type,fn){if(events.get(type)===fn)events.delete(type);},once(type,fn){events.set(type,fn);},
    stop(){const fn=events.get('moveend');events.delete('moveend');fn?.();},triggerRepaint(){},
    getBearing:()=>heading,getPitch:()=>pitch,getZoom:()=>currentZoom,getCenter:()=>center,getMinZoom:()=>0,getMaxZoom:()=>22,
    getCenterClampedToGround:()=>clamped,getCenterElevation:()=>elevation,setCenterClampedToGround:v=>{clamped=v;},
    jumpTo(value){lastOptions=value;if(value.bearing!==undefined)heading=value.bearing;if(value.elevation!==undefined)elevation=value.elevation;if(value.zoom!==undefined)currentZoom=value.zoom;if(value.pitch!==undefined)pitch=value.pitch;if(value.center)center=Array.isArray(value.center)?{lng:value.center[0],lat:value.center[1]}:value.center;},
    easeTo(value){map.jumpTo(value);map.stop();},
    transform:{width:1440,height:1000,fov:36.86989764584402,tileSize:512,clone(){return {
      width:this.width,height:this.height,fov:this.fov,tileSize:this.tileSize,zoom:14,pitch:55,bearing:0,
      setCenter(){},setElevation(){},setRenderWorldCopies(){},setPitch(v){this.pitch=v;},setBearing(v){this.bearing=v;},setZoom(v){this.zoom=v;},
      getProjectionDataForCustomLayer(){projectionCalls++;return {mainMatrix:new Matrix4().makeScale(2**this.zoom*1024/this.width,2**this.zoom*1024/this.height,1).elements};}
    };}}
  };
  const environment={map,visible:true,anchor:{lng:139,lat:-35},bounds:{minX:-1,maxX:1,minY:-1,maxY:1,minZ:-1,maxZ:1},bearing:42,tilt:75,period:30,orientationMode:'fixed'};
  let pose=()=>({center:{lng:139,lat:-35},elevation:150,radius:200,units:1/40000000});
  Object.defineProperty(environment,'pose',{get:()=>angles=>{
    const value=pose(angles),scale=value.radius*value.units;
    return {...value,geographic:new Matrix4().makeScale(scale,scale,scale),object:new Matrix4()};
  },set:value=>{pose=value;}});
  const document={hidden:false,addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:type=>listeners.delete(type)};
  const context=vm.createContext({document,window:{matchMedia:()=>({matches:false}),GeoGlyphGroundTransform:math,GeoGlyphMapEngine:{cancelInitialFit(){}}},requestAnimationFrame:fn=>{frames.set(++sequence,fn);return sequence;},cancelAnimationFrame:id=>frames.delete(id)});
  vm.runInContext(source,context);Matrix4=context.CameraModule.Matrix4;const camera=context.CameraModule.createGroundCamera(()=>environment,()=>{});
  function step(ms=100){time+=ms;const jobs=[...frames.values()];frames.clear();jobs.forEach(fn=>fn(time));}
  return {camera,environment,frames,map,document,listeners,events,step,projectionCalls:()=>projectionCalls,
    finish(){while(camera.stats().phase==='framing')step();},
    hidden(value){document.hidden=value;listeners.get('visibilitychange')();},options:()=>lastOptions};
}

test('automatic Fit reframes a running orbit without stopping or snapping back afterward',()=>{
  const h=harness();h.camera.start();h.finish();h.step();h.step();
  const before=h.camera.stats().bearing;
  h.environment.pose=()=>({center:{lng:140,lat:-34},elevation:90,radius:50,units:1/40000000});
  h.camera.retarget();
  assert.equal(h.camera.fit({preserveOrbit:true}),true);
  assert.equal(h.camera.isRunning(),true);
  assert.equal(h.camera.stats().phase,'framing');
  assert.equal(h.camera.stats().bearing,before);
  assert.equal(h.frames.size,1);
  h.finish();
  const fittedZoom=h.map.getZoom();
  assert.equal(h.camera.stats().phase,'orbiting');
  assert.deepEqual(h.map.getCenter(),{lng:140,lat:-34});
  h.step();h.step();
  assert.equal(h.map.getZoom(),fittedZoom);
  assert.ok(h.camera.stats().bearing>before);
  h.camera.fit({orbit:true});
  assert.equal(h.camera.isRunning(),false);
  h.camera.dispose();
});

test('orbit framing is cached across frames and invalidated by model, orientation, location and viewport changes',()=>{
  const h=harness();h.camera.start();h.finish();
  let calls=h.projectionCalls();
  for(let i=0;i<4;i++){h.camera.retarget();h.step();}
  assert.equal(h.projectionCalls(),calls);
  const change=update=>{update();h.camera.retarget();assert.ok(h.projectionCalls()>calls);calls=h.projectionCalls();h.camera.retarget();assert.equal(h.projectionCalls(),calls);};
  change(()=>{h.environment.orientationMode='yaw';});
  change(()=>{h.environment.tilt=55;});
  change(()=>{h.environment.bounds.maxX=4;});
  change(()=>{h.environment.anchor={lng:140,lat:-34};});
  change(()=>{h.map.transform.width=1200;});
  h.map.transform.height=800;h.events.get('resize')();assert.ok(h.projectionCalls()>calls);
  assert.equal(h.frames.size,1);h.camera.dispose();
});

test('low-zoom constraints cannot leave later framing trials centred away from the model',()=>{
  const base=harness();base.environment.pose=()=>({center:{lng:139,lat:-35},elevation:150,radius:4000,units:1/40000000});
  base.camera.start();base.finish();const expected=base.map.getZoom();base.camera.dispose();
  const h=harness(),clone=h.map.transform.clone.bind(h.map.transform);
  h.environment.pose=()=>({center:{lng:139,lat:-35},elevation:150,radius:4000,units:1/40000000});
  h.map.transform.clone=()=>{
    const transform=clone(),setZoom=transform.setZoom,projection=transform.getProjectionDataForCustomLayer;
    let drift=false;
    transform.setZoom=function(value){setZoom.call(this,value);if(value<10)drift=true;};
    transform.setCenter=()=>{drift=false;};
    transform.getProjectionDataForCustomLayer=function(){const result=projection.call(this);if(drift)result.mainMatrix[12]=4;return result;};
    return transform;
  };
  h.camera.start();h.finish();assert.ok(Math.abs(h.map.getZoom()-expected)<1e-5);h.camera.dispose();
});

test('continuous orbit completes circles with one callback, preserving model settings and target elevation',()=>{
  const h=harness();assert.equal(h.camera.start(),true);assert.equal(h.frames.size,1);h.finish();
  h.step();for(let i=0;i<600;i++)h.step();
  assert.ok(Math.abs(h.camera.stats().bearing-720)<1e-8);
  assert.equal(h.frames.size,1);assert.equal(h.options().elevation,150);
  assert.deepEqual(h.environment.anchor,{lng:139,lat:-35});assert.equal(h.environment.bearing,42);assert.equal(h.environment.tilt,75);
  h.camera.start();assert.equal(h.frames.size,1);
  h.events.get('dragstart')({originalEvent:{}});assert.equal(h.frames.size,0);assert.equal(h.camera.isRunning(),false);
  h.camera.dispose();assert.equal(h.listeners.size,0);assert.equal(h.events.size,0);
});

test('hidden tabs and export pauses resume without elapsed-time jumps or unintended restarts',()=>{
  const h=harness();h.camera.start();h.finish();h.step();h.step();const angle=h.camera.stats().bearing;
  h.hidden(true);assert.equal(h.frames.size,0);h.step(60000);h.hidden(false);h.step();assert.equal(h.camera.stats().bearing,angle);
  const resume=h.camera.pause();assert.equal(h.frames.size,0);h.step(60000);resume();resume();assert.equal(h.frames.size,1);h.step();assert.equal(h.camera.stats().bearing,angle);
  const release=h.camera.pause();h.camera.stop();release();assert.equal(h.frames.size,0);assert.equal(h.camera.isRunning(),false);
  h.camera.exit();assert.equal(h.map.getCenterElevation(),0);assert.equal(h.map.getCenterClampedToGround(),true);
});

test('framing interpolates elevation and can pause without jumping to the end',()=>{
  const h=harness();h.camera.start();h.step();h.step();
  const halfway=h.map.getCenterElevation();assert.ok(halfway>0&&halfway<150);
  const resume=h.camera.pause();h.step(60000);resume();h.step();assert.equal(h.map.getCenterElevation(),halfway);
  h.finish();assert.equal(h.map.getCenterElevation(),150);assert.equal(h.camera.stats().phase,'orbiting');h.camera.exit();
});

test('camera-facing modes are temporary and orbit speed changes do not rebuild or restart animation',()=>{
  const h=harness();h.camera.start();h.finish();h.step();h.environment.orientationMode='yaw';h.step();
  assert.equal(h.camera.getAngles().tilt,75);assert.equal(h.camera.getAngles().bearing,h.camera.stats().bearing);
  h.environment.orientationMode='billboard';assert.equal(h.camera.getAngles().tilt,55);
  const before=h.camera.stats().bearing;h.environment.period=10;h.step();assert.ok(Math.abs(h.camera.stats().bearing-before-3.6)<1e-9);
  h.environment.orientationMode='fixed';assert.deepEqual(JSON.parse(JSON.stringify(h.camera.getAngles())),{bearing:42,tilt:75});h.camera.exit();
});

test('model swaps preserve orbit phase and smoothly zoom both out and in',()=>{
  const h=harness();h.camera.start();h.finish();h.step();h.step();
  const before=h.camera.stats(),initialZoom=h.map.getZoom();
  h.environment.pose=()=>({center:{lng:139,lat:-35},elevation:170,radius:400,units:1/40000000});
  h.camera.retarget();
  assert.equal(h.camera.stats().phase,'orbiting');assert.equal(h.camera.stats().bearing,before.bearing);
  assert.equal(h.map.getZoom(),initialZoom);assert.equal(h.map.getCenterElevation(),170);assert.equal(h.frames.size,1);
  h.step();assert.ok(h.map.getZoom()<initialZoom&&h.map.getZoom()>initialZoom-1);
  for(let i=0;i<8;i++)h.step();
  assert.ok(Math.abs(h.map.getZoom()-(initialZoom-1))<1e-5);
  const wideZoom=h.map.getZoom(),frames=h.camera.stats().frames;
  h.environment.pose=()=>({center:{lng:139,lat:-35},elevation:120,radius:50,units:1/40000000});
  h.camera.retarget();assert.equal(h.map.getZoom(),wideZoom);h.step();
  assert.ok(h.map.getZoom()>wideZoom&&h.map.getZoom()<18);
  for(let i=0;i<8;i++)h.step();
  assert.equal(h.map.getZoom(),18);assert.ok(h.camera.stats().frames>frames);
  assert.equal(h.camera.stats().phase,'orbiting');assert.equal(h.frames.size,1);h.camera.dispose();
});

test('rapid model changes replace zoom destinations from the current displayed zoom',()=>{
  const h=harness();h.camera.start();h.finish();h.step();h.step();
  const initial=h.map.getZoom();
  const radius=value=>{h.environment.pose=()=>({center:{lng:139,lat:-35},elevation:150,radius:value,units:1/40000000});h.camera.retarget();};
  radius(800);h.step();h.step();const outward=h.map.getZoom();assert.ok(outward<initial);
  radius(50);assert.equal(h.map.getZoom(),outward);h.step();assert.ok(h.map.getZoom()>outward);
  radius(200);for(let i=0;i<8;i++)h.step();assert.ok(Math.abs(h.map.getZoom()-initial)<1e-5);
  radius(400);h.step();const partial=h.map.getZoom();
  // Retargeting to the current framing cancels the old destination.
  const currentRadius=200*Math.pow(2,initial-partial);radius(currentRadius);
  for(let i=0;i<8;i++)h.step();assert.ok(Math.abs(h.map.getZoom()-partial)<1e-9);
  assert.equal(h.frames.size,1);h.camera.stop();radius(50);h.step();assert.equal(h.map.getZoom(),partial);h.camera.dispose();
});

test('repeated updates and export pauses preserve a zoom transition clock',()=>{
  const h=harness();h.camera.start();h.finish();h.step();h.step();const initial=h.map.getZoom();
  h.environment.pose=()=>({center:{lng:139,lat:-35},elevation:150,radius:400,units:1/40000000});
  h.camera.retarget();h.step();h.step();const partial=h.map.getZoom(),resume=h.camera.pause();
  h.camera.retarget();h.step(60000);assert.equal(h.map.getZoom(),partial);resume();h.step();assert.equal(h.map.getZoom(),partial);
  for(let i=0;i<5;i++){h.camera.retarget();h.step();}
  assert.ok(Math.abs(h.map.getZoom()-(initial-1))<1e-5);assert.equal(h.frames.size,1);h.camera.dispose();
});

test('model changes during initial framing accept closer targets without jumps or extending the flight',()=>{
  const h=harness();h.camera.start();h.step();h.step();h.step();
  const before=h.map.getZoom();
  h.environment.pose=()=>({center:{lng:140,lat:-34},elevation:90,radius:50,units:1/40000000});
  h.camera.retarget();assert.equal(h.map.getZoom(),before);assert.equal(h.camera.stats().phase,'framing');
  h.step();assert.ok(h.map.getZoom()>before);h.step();
  const midway=h.map.getZoom();
  h.environment.pose=()=>({center:{lng:139,lat:-35},elevation:170,radius:400,units:1/40000000});
  h.camera.retarget();assert.equal(h.map.getZoom(),midway);
  for(let i=0;i<3;i++)h.step();
  assert.equal(h.camera.stats().phase,'orbiting');
  assert.equal(h.map.getCenterElevation(),170);assert.equal(h.frames.size,1);h.camera.dispose();
});
