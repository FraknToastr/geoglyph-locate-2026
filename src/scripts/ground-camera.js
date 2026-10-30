import { Matrix4, Vector4 } from 'three';

// Camera state is transient. User angles, opacity and the geographic anchor stay in app state.
export function createGroundCamera(environment, changed) {
  let active=false,phase='stopped',frame=0,lastTime=0,bearing=0,zoom=0,frames=0,pauseDepth=0;
  let mapRef=null,savedCameraMode=null,flight=null,zoomTransition=null;
  let orbitFitCache=null;
  const motionReduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cancelFrame=()=>{if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;};
  function bindMap(map) {
    if(mapRef===map)return;
    if(mapRef){for(const type of ['dragstart','zoomstart','rotatestart','pitchstart'])mapRef.off(type,manual);mapRef.off('resize',resized);}
    mapRef=map;
    if(map){for(const type of ['dragstart','zoomstart','rotatestart','pitchstart'])map.on(type,manual);map.on('resize',resized);}
  }
  function manual(event){if(event.originalEvent){environment().cancelPending?.();stop();}}
  function resized(){if(active)retarget();}
  function getAngles() {
    const e=environment(),base={bearing:e.bearing||0,tilt:e.tilt??90};
    if(!e.visible||e.orientationMode==='fixed'||!e.bounds)return base;
    if(active)return {bearing,tilt:e.orientationMode==='billboard'?55:base.tilt};
    const map=e.map;if(!map)return base;
    const origin=window.maplibregl.MercatorCoordinate.fromLngLat(e.anchor),u=origin.meterInMercatorCoordinateUnits();
    const camera=window.maplibregl.MercatorCoordinate.fromLngLat(map.transform.getCameraLngLat(),map.transform.getCameraAltitude());
    const position=[(camera.x-origin.x)/u,(origin.y-camera.y)/u,camera.z/u];
    let result=base;
    // The ground-contact lift changes the target height when the model tilts.
    for(let i=0;i<6;i++)result=window.GeoGlyphGroundTransform.facing(position,e.pose(result).localCenter,base.tilt,e.orientationMode);
    return result;
  }
  function enter() {
    const e=environment(),map=e.map;bindMap(map);
    if(map&&!savedCameraMode)savedCameraMode={map,clamped:e.restoredElevatedView?true:map.getCenterClampedToGround(),elevation:e.restoredElevatedView?0:map.getCenterElevation()};
  }
  function takeCamera() {
    const map=environment().map;enter();
    map.setCenterClampedToGround(false);
  }
  function stop() {
    const map=environment().map,wasActive=active;
    active=false;phase='stopped';cancelFrame();
    flight=null;zoomTransition=null;
    if(wasActive){map?.triggerRepaint();changed();}
  }
  function exit() {
    stop();
    if(savedCameraMode){const previous=savedCameraMode;savedCameraMode=null;previous.map.setCenterClampedToGround(previous.clamped);previous.map.jumpTo({elevation:previous.elevation});}
  }
  function projectedFit(e,orbit,heading,angles) {
    const map=e.map,base=e.pose(angles),viewport=map.transform;
    const padding=window.GeoGlyphGroundTransform.framingPadding(viewport.width,viewport.height);
    const minimum=map.getMinZoom(),maximum=Math.max(minimum,Math.min(18,map.getMaxZoom()));
    let key;
    if(orbit){
      const reference=e.pose({bearing:e.orientationMode==='fixed'?(e.bearing||0):0,tilt:e.orientationMode==='billboard'?55:e.tilt});
      key=JSON.stringify([e.bounds,e.anchor,e.orientationMode,e.bearing,e.tilt,reference.center,reference.elevation,reference.geographic.elements,reference.object.elements,
        viewport.width,viewport.height,viewport.fov,viewport.tileSize,viewport.roll||0,minimum,maximum]);
      if(orbitFitCache?.key===key)return orbitFitCache.zoom;
    }
    const b=e.bounds,corners=[];
    for(const x of [b.minX,b.maxX])for(const y of [b.minY,b.maxY])for(const z of [b.minZ,b.maxZ])corners.push(new Vector4(x,y,z,1));
    const scenarios=[];
    const add=(cameraBearing,pose)=>{
      const transform=viewport.clone();
      // Projection trials must target the model even when a trial viewport
      // crosses the date line. This changes only the offscreen math clone.
      transform.setRenderWorldCopies(true);
      transform.setCenter(pose.center);transform.setElevation(pose.elevation);
      transform.setPitch(55);transform.setBearing(cameraBearing);
      const object=new Matrix4().multiplyMatrices(pose.geographic,pose.object);
      scenarios.push({transform,center:pose.center,elevation:pose.elevation,points:corners.map(c=>c.clone().applyMatrix4(object))});
    };
    if(orbit){
      // Project the real model through a full turn. A sphere wastes the wide
      // viewport's horizontal room by reserving its full diameter vertically.
      for(let a=0;a<360;a+=5)add(a,e.pose({
        bearing:e.orientationMode==='fixed'?(e.bearing||0):a,
        tilt:e.orientationMode==='billboard'?55:e.tilt
      }));
    }else add(heading,base);
    const limitX=1-2*padding.left/viewport.width,limitY=1-2*padding.top/viewport.height;
    const fits=value=>{
      for(const scenario of scenarios){
        scenario.transform.setZoom(value);
        // A low-zoom trial can constrain the finite world's camera centre.
        // Restore the target for every trial so that drift cannot poison later fits.
        scenario.transform.setCenter(scenario.center);scenario.transform.setElevation(scenario.elevation);
        const m=scenario.transform.getProjectionDataForCustomLayer().mainMatrix;
        for(const p of scenario.points){
          const x=m[0]*p.x+m[4]*p.y+m[8]*p.z+m[12];
          const y=m[1]*p.x+m[5]*p.y+m[9]*p.z+m[13];
          const w=m[3]*p.x+m[7]*p.y+m[11]*p.z+m[15];
          if(!(w>0)||!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(x)>limitX*w||Math.abs(y)>limitY*w)return false;
        }
      }
      return true;
    };
    const clearance=orbit?Math.log2(1.02):0;
    let low=minimum,high=maximum+clearance;
    if(fits(high))low=high;
    else for(let i=0;i<24;i++){const middle=(low+high)/2;if(fits(middle))low=middle;else high=middle;}
    // Leave clearance between sampled headings without changing zoom each frame.
    const zoom=Math.max(minimum,Math.min(maximum,low-clearance));
    if(orbit)orbitFitCache={key,zoom};
    return zoom;
  }
  function fitOptions(options={}) {
    const e=environment(),map=e.map;
    const currentBearing=map.getBearing();
    const desiredBearing=options.orbit?currentBearing:(e.bearing||0)+25;
    const targetBearing=currentBearing+((desiredBearing-currentBearing+180)%360+360)%360-180;
    const pitch=55;
    const angles=options.orbit?{bearing:e.orientationMode==='fixed'?(e.bearing||0):bearing,tilt:e.orientationMode==='billboard'?pitch:e.tilt}:
      {bearing:e.orientationMode==='fixed'?(e.bearing||0):targetBearing,tilt:e.orientationMode==='billboard'?pitch:e.tilt};
    const pose=e.pose(angles),resultZoom=projectedFit(e,Boolean(options.orbit),targetBearing,angles);
    return {center:pose.center,elevation:pose.elevation,zoom:resultZoom,pitch,bearing:targetBearing,duration:motionReduced()?0:650};
  }
  function fit(options={}) {
    const e=environment();if(!e.visible)return false;
    if(options.preserveOrbit&&active){
      e.map.stop();takeCamera();bearing=e.map.getBearing();
      const target=fitOptions({...options,orbit:true});
      zoom=target.zoom;zoomTransition=null;fly(target);return true;
    }
    stop();e.map.stop();takeCamera();if(options.orbit)bearing=e.map.getBearing();fly(fitOptions(options));return true;
  }
  function currentCamera() {
    const map=environment().map,center=map.getCenter();
    return {center:[center.lng,center.lat],elevation:map.getCenterElevation(),zoom:map.getZoom(),pitch:map.getPitch(),bearing:map.getBearing()};
  }
  function fly(target) {
    const map=environment().map,from=currentCamera();
    if(!target.duration){map.jumpTo(target);phase=active?'orbiting':'stopped';schedule();return;}
    flight={from,target,elapsed:0};phase='framing';lastTime=0;schedule();
  }
  function schedule(){if((flight||(active&&phase==='orbiting'))&&!frame&&!document.hidden&&!pauseDepth)frame=requestAnimationFrame(tick);}
  function tick(time) {
    frame=0;const e=environment();
    if((!active&&!flight)||!e.visible){stop();return;}
    if(document.hidden||pauseDepth){lastTime=0;return;}
    const elapsed=lastTime?Math.max(0,Math.min(100,time-lastTime)):0;
    lastTime=time;
    if(flight){
      const f=flight;f.elapsed+=elapsed;const progress=Math.min(1,f.elapsed/f.target.duration),t=progress*progress*(3-2*progress);
      const interpolate=(a,b)=>a+(b-a)*t;
      const value={center:[interpolate(f.from.center[0],f.target.center.lng),interpolate(f.from.center[1],f.target.center.lat)]};
      for(const key of ['elevation','zoom','pitch','bearing'])value[key]=interpolate(f.from[key],f.target[key]);
      e.map.jumpTo(value,{geoglyphFraming:true});
      if(progress===1){flight=null;phase=active?'orbiting':'stopped';lastTime=0;changed();}
      schedule();return;
    }
    bearing=window.GeoGlyphGroundTransform.advanceOrbit(bearing,elapsed/1000,e.period);
    if(zoomTransition){
      zoomTransition.elapsed+=elapsed;
      const t=Math.min(1,zoomTransition.elapsed/650),ease=t*t*(3-2*t);
      zoom=zoomTransition.from+(zoomTransition.to-zoomTransition.from)*ease;
      if(t===1)zoomTransition=null;
    }
    const pose=e.pose(getAngles());
    e.map.jumpTo({center:pose.center,elevation:pose.elevation,zoom,pitch:55,bearing},{geoglyphOrbit:true});
    frames++;schedule();
  }
  function start(options={}) {
    const e=environment();if(!e.visible)return false;
    stop();e.map.stop();takeCamera();window.GeoGlyphMapEngine.cancelInitialFit();
    bearing=e.map.getBearing();active=true;phase='framing';
    const target=fitOptions({orbit:true,pitch:55});zoom=options.framed?e.map.getZoom():target.zoom;
    if(options.framed){phase='orbiting';flight=null;schedule();}else fly(target);
    changed();return true;
  }
  // A model swap updates the target without restarting the orbit or its clock.
  function retarget() {
    if(!active)return;
    const target=fitOptions({orbit:true,pitch:55});
    if(flight){
      if(Math.abs(flight.target.zoom-target.zoom)<=.001&&flight.target.elevation===target.elevation&&flight.target.center.lng===target.center.lng&&flight.target.center.lat===target.center.lat)return;
      const duration=Math.max(1,flight.target.duration-flight.elapsed);
      flight={from:currentCamera(),target:{...flight.target,center:target.center,elevation:target.elevation,zoom:target.zoom,duration},elapsed:0};
      zoom=target.zoom;
      return;
    }
    zoom=environment().map.getZoom();
    // Repainting or exporting the same model must not reset the transition.
    if(!zoomTransition||Math.abs(zoomTransition.to-target.zoom)>.001){
      zoomTransition=Math.abs(target.zoom-zoom)>.001?{from:zoom,to:target.zoom,elapsed:0}:null;
    }
    const pose=environment().pose(getAngles());
    environment().map.jumpTo({center:pose.center,elevation:pose.elevation,zoom,pitch:55,bearing},{geoglyphOrbit:true});
  }
  function pause() {
    if(!active&&!flight)return ()=>{};
    pauseDepth++;cancelFrame();
    let resumed=false;
    return ()=>{if(resumed)return;resumed=true;pauseDepth=Math.max(0,pauseDepth-1);lastTime=0;schedule();};
  }
  function visibility(){cancelFrame();if(!document.hidden)schedule();}
  document.addEventListener('visibilitychange',visibility);
  return {getAngles,fit,start,stop,exit,enter,pause,retarget,isRunning:()=>active,
    stats:()=>({orbiting:active,phase,scheduled:!!frame,paused:pauseDepth>0,frames,bearing,angles:getAngles()}),
    dispose(){exit();bindMap(null);document.removeEventListener('visibilitychange',visibility);}};
}
