import { WebGLRenderer, Scene, Camera, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, AmbientLight, DirectionalLight, Matrix4, DoubleSide } from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { createGroundCamera } from './ground-camera.js';
import { createGroundModelCache } from './ground-model-cache.js';
import { groundIcons } from './ground-icons.js';

const ID='geoglyph-extruded-font';
const $=id=>document.getElementById(id);
const engine=()=>window.GeoGlyphMapEngine;
const state=()=>engine()?.state;
let layer=null,data=null,meshKey='',request=0,lastError='',queuedOrbit=null;
const cache=createGroundModelCache((key,model)=>window.GeoGlyphFontService.mesh(key,model));
let uploads=0,disposals=0;
const camera=createGroundCamera(()=>{
  const s=state()||{};
  return {map:s.map,anchor:s.anchor,bearing:s.bearing,tilt:s.extrusionTilt,orientationMode:s.orientationMode||'fixed',period:s.orbitPeriodSeconds||30,bounds:data?.bounds,visible:isVisible()&&s.previewActive,restoredElevatedView:s.restoredCamera?.elevation>0,pose:matrices,cancelPending:()=>{queuedOrbit=null;refreshControls();}};
},()=>refreshControls());

function message(text,compact=false) {
  const node=$('map3DStatus');if(node)node.textContent=text;
  const quick=$('mapQuickStatus');if(quick){quick.textContent=compact?text:'';quick.hidden=!compact;}
}
function settings(angles=camera.getAngles()) {
  const s=state();return {heightMeters:s.baseHeightMeters*s.relativeSize/100,depthMeters:s.extrusionDepthMeters??30,tilt:angles.tilt,bearing:angles.bearing};
}
function matrices(angles=camera.getAngles()) {
  const s=state(),values=settings(angles),p=window.GeoGlyphGroundTransform.parameters(values,data.bounds);
  const origin=window.maplibregl.MercatorCoordinate.fromLngLat(s.anchor,0),u=origin.meterInMercatorCoordinateUnits();
  const geographic=new Matrix4().makeTranslation(origin.x,origin.y,origin.z)
    .multiply(new Matrix4().makeScale(u,-u,u)).multiply(new Matrix4().makeRotationZ(-p.bearing));
  const object=new Matrix4().makeTranslation(0,0,p.lift).multiply(new Matrix4().makeRotationX(p.tilt))
    .multiply(new Matrix4().makeScale(p.height,p.height,p.depth));
  const b=data.bounds,mid=[(b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2];
  const localCenter=window.GeoGlyphGroundTransform.point(mid,values,b);
  const centerMerc=new window.maplibregl.MercatorCoordinate(origin.x+localCenter[0]*u,origin.y-localCenter[1]*u,localCenter[2]*u);
  return {geographic,object,localCenter,center:centerMerc.toLngLat(),elevation:centerMerc.toAltitude(),units:u,radius:Math.hypot((b.maxX-b.minX)*p.height,(b.maxY-b.minY)*p.height,(b.maxZ-b.minZ)*p.depth)/2};
}
function isVisible() {return !!(layer?.ready&&data&&state()?.extrusionEnabled&&state()?.lastRenderMode==='vector');}
function syncVisibility() {
  const s=state(),map=s?.map;if(!map)return;
  const visibility=isVisible()?'none':'visible';
  for(const id of ['geoglyph-ground-fill','geoglyph-ground-outline'])if(map.getLayer(id)&&map.getLayoutProperty(id,'visibility')!==visibility)map.setLayoutProperty(id,'visibility',visibility);
  if(layer?.ready&&data)layer.paint();
  map.triggerRepaint();
}
function clear() {
  camera.exit();
  ++request;const map=state()?.map;
  if(layer&&map?.getLayer(ID))map.removeLayer(ID);
  layer=null;data=null;meshKey='';cache.clear();queuedOrbit=null;lastError='';syncVisibility();refreshControls();
}
function createLayer(map) {
  const custom={id:ID,type:'custom',renderingMode:'3d',ready:false,
    onAdd(_map,gl) {
      this.renderer=new WebGLRenderer({canvas:map.getCanvas(),context:gl,antialias:false});
      this.renderer.autoClear=false;this.scene=new Scene();this.camera=new Camera();this.group=new Group();
      this.group.matrixAutoUpdate=false;this.scene.add(this.group);
      this.scene.add(new AmbientLight(0xffffff,1.3));
      const light=new DirectionalLight(0xffffff,2);light.position.set(-1,-2,4);this.scene.add(light);
      this.front=new MeshBasicMaterial({side:DoubleSide,transparent:true,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
      this.side=new MeshLambertMaterial({side:DoubleSide,transparent:true,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
      const item=cache.get(meshKey);
      this.mesh=new Mesh(item.geometry,[this.front,this.side]);this.group.add(this.mesh);
      this.lineMaterial=new LineMaterial({worldUnits:false,transparent:true,depthWrite:false});
      this.lines=new LineSegments2(item.lineGeometry,this.lineMaterial);this.group.add(this.lines);
      this.geometry=item.geometry;this.lineGeometry=item.lineGeometry;
      this.ready=true;uploads++;this.paint();
    },
    replace(item) {
      this.geometry=item.geometry;this.lineGeometry=item.lineGeometry;
      this.mesh.geometry=item.geometry;this.lines.geometry=item.lineGeometry;uploads++;
    },
    paint() {
      const s=state();if(!this.ready||!data)return;
      this.front.color.set(s.fill);this.side.color.set(s.fill).multiplyScalar(.62);
      const opacity=s.extrusionSolid?1:s.opacity;
      for(const material of [this.front,this.side]){
        const transparent=!s.extrusionSolid;
        if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true;}
        material.opacity=opacity;material.depthWrite=s.extrusionSolid||opacity>=.99;
      }
      this.lineMaterial.opacity=opacity;this.lineMaterial.depthWrite=false;this.lineMaterial.color.set(s.outline);
      const canvas=map.getCanvas(),ratio=canvas.width/Math.max(1,canvas.clientWidth);
      this.lineMaterial.linewidth=s.outlineWidth*ratio;this.lineMaterial.resolution.set(canvas.width,canvas.height);
      this.lines.visible=s.outlineWidth>0;
      this.group.matrix.copy(matrices().object);this.group.matrixWorldNeedsUpdate=true;
    },
    render(gl,args) {
      if(!isVisible()||!state()?.previewActive)return;
      this.paint();
      this.camera.projectionMatrix.fromArray(args.defaultProjectionData.mainMatrix).multiply(matrices().geographic);
      this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
      this.renderer.resetState();this.renderer.setViewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
      this.renderer.render(this.scene,this.camera);this.renderer.resetState();
    },
    onRemove() {
      this.ready=false;
      for(const resource of [this.front,this.side,this.lineMaterial])resource?.dispose();
      this.renderer?.dispose();disposals++;
    }
  };
  return custom;
}
async function commit(item, apply=()=>{}, current=()=>true) {
  const version=request;
  // Background preparation may have evicted a candidate before its frame.
  item=cache.get(item.key)||await cache.prepare(item.model);
  return new Promise((resolve,reject)=>requestAnimationFrame(()=>{try{
    const s=state();
    if(version!==request||!current()||!s.extrusionEnabled){resolve(false);return;}
    if(cache.get(item.key)!==item){engine().queueRebuild(false);resolve(false);return;}
    // Commit the display metadata and both geometries in the same animation frame.
    const replaced=meshKey!==item.key;
    apply();data=item.mesh;meshKey=item.key;cache.activate(item);
    camera.enter();
    if(layer?.ready){if(replaced)layer.replace(item);}
    else {layer=createLayer(s.map);s.map.addLayer(layer);}
    lastError='';camera.retarget();syncVisibility();refreshControls();
    if(queuedOrbit){s.orientationMode=queuedOrbit;queuedOrbit=null;camera.start();}
    resolve(true);
  }catch(error){reject(error);}}));
}
async function update(current=()=>true) {
  const s=state();if(!s?.extrusionEnabled){if(layer)clear();message('Extrude outline fonts and stand them upright.');refreshControls();return;}
  if(s.lastRenderMode!=='vector'||!s.lastLocalModel){
    if(!isVisible())message('This content uses a font image. Choose an outline font to enable extrusion.');
    refreshControls();return;
  }
  try {
    const item=await cache.prepare(s.lastLocalModel);
    if(!current())return;
    if(meshKey!==item.key||!layer?.ready)await commit(item,()=>{},current);
    else {camera.retarget();syncVisibility();refreshControls();}
  }catch(error){failure(error.message);}
}
function failure(reason) {
  lastError=reason;queuedOrbit=null;refreshControls();
  const s=state(),requested=s?.fontRecords.get(s.selectedFontId)?.name||'Selected font';
  const displayed=s?.fontRecords.get(s.displayedFontId)?.name;
  message(isVisible()?`${requested} cannot be shown in 3D: ${reason}. Showing ${displayed||'previous font'}. Switch to 2D to preview the selected font.`:`3D unavailable: ${reason}. Choose an outline font or switch to 2D.`,true);
}
function setEnabled(enabled) {
  const s=state();s.extrusionEnabled=enabled;
  if(enabled&&s.extrusionDepthMeters==null)s.extrusionDepthMeters=Math.max(.1,Math.min(100000,s.baseHeightMeters*s.relativeSize/1000));
  if(!enabled)clear();refreshControls();engine().queueRebuild(false);
}
function stopMotion(){queuedOrbit=null;camera.stop();refreshControls();}
function exitCamera(){queuedOrbit=null;camera.exit();refreshControls();}
function toggleOrbit(mode=state().orientationMode) {
  const s=state();
  if(queuedOrbit===mode){queuedOrbit=null;refreshControls();return;}
  if(camera.isRunning()&&s.orientationMode===mode){camera.stop();return;}
  s.orientationMode=mode;
  if(!s.extrusionEnabled||!isVisible()){
    queuedOrbit=mode;camera.enter();setEnabled(true);refreshControls();return;
  }
  if(camera.isRunning()){camera.retarget();syncVisibility();refreshControls();}
  else camera.start();
}
function ensureOrbit(mode,options={}) {
  const s=state();
  if(!s||!isVisible())return false;
  s.orientationMode=mode;queuedOrbit=null;
  if(camera.isRunning())camera.retarget();else camera.start(options);
  syncVisibility();refreshControls();return true;
}
function refreshControls() {
  const s=state();if(!s)return;
  const fontName=s.fontRecords.get(s.displayedFontId)?.name;
  const fontRow=$('mapDisplayedFont');
  if(fontRow){
    const text=fontName?'Font: '+fontName:'Font: Preparing…';
    if(fontRow.textContent!==text){fontRow.textContent=text;fontRow.title=text;}
  }
  if($('map3DEnabled'))$('map3DEnabled').checked=s.extrusionEnabled;
  if($('map3DControls'))$('map3DControls').hidden=!s.extrusionEnabled;
  if($('map3DDepth'))$('map3DDepth').value=String(s.extrusionDepthMeters??Math.max(.1,s.baseHeightMeters*s.relativeSize/1000));
  if($('map3DTilt'))$('map3DTilt').value=String(s.extrusionTilt);
  if($('map3DTiltValue'))$('map3DTiltValue').textContent=s.extrusionTilt+'°';
  if($('map3DView'))$('map3DView').disabled=!isVisible();
  if($('map3DSolid'))$('map3DSolid').checked=s.extrusionSolid;
  if($('map3DOrientation'))$('map3DOrientation').value=s.orientationMode;
  if($('map3DOrbitPeriod'))$('map3DOrbitPeriod').value=String(s.orbitPeriodSeconds);
  if($('map3DOrbitPeriodValue'))$('map3DOrbitPeriodValue').textContent=s.orbitPeriodSeconds+' s / circle';
  if($('map3DOrbit')){$('map3DOrbit').disabled=!isVisible();$('map3DOrbit').textContent=camera.isRunning()?'Stop orbit':'Start orbit';$('map3DOrbit').setAttribute('aria-pressed',String(camera.isRunning()));}
  const automatic=isVisible()&&s.orientationMode!=='fixed';
  if($('mapBearing'))$('mapBearing').disabled=automatic;
  if($('map3DTilt'))$('map3DTilt').disabled=automatic&&s.orientationMode==='billboard';
  if($('mapOpacity')){$('mapOpacity').disabled=isVisible()&&s.extrusionSolid;$('mapOpacity').title=$('mapOpacity').disabled?'Solid model uses full opacity. Your 2D opacity is preserved.':'';}
  if($('map3DOrientationNote'))$('map3DOrientationNote').textContent=s.orientationMode==='fixed'?'Uses your text bearing and tilt.':s.orientationMode==='yaw'?'Bearing follows the camera; your tilt is preserved.':'Bearing and tilt follow the camera. Fixed mode restores your angles.';
  const quick=$('mapQuickModel');if(quick){quick.setAttribute('aria-pressed',String(s.extrusionEnabled));quick.querySelector('span').textContent=s.extrusionEnabled?'3D':'2D';quick.title=s.extrusionEnabled?'Switch model to 2D':'Switch model to 3D';}
  for(const [id,mode] of [['mapQuickOrbit','fixed'],['mapQuickTurn','yaw'],['mapQuickFace','billboard']]){
    const button=$(id);if(!button)continue;const running=camera.isRunning()&&s.orientationMode===mode;
    button.setAttribute('aria-pressed',String(running));button.classList.toggle('is-running',running);
    button.setAttribute('aria-busy',String(queuedOrbit===mode));
    button.title=(running?'Stop ':'Start ')+({fixed:'orbit',yaw:'orbit, turning toward the camera',billboard:'orbit, facing the camera square-on'}[mode]);
  }
  if(isVisible()&&!lastError)message('Outline mesh · '+Math.round(data.position.length/9).toLocaleString()+' triangles');
}
function fit(options={}) {
  return engine().fit();
}
function initialise() {
  if($('map3DEnabled'))return true;
  const s=state(),parent=$('geoglyphMapEditor')?.querySelector('.map-editor-actions');if(!s||!parent)return false;
  const panel=document.createElement('section');panel.className='map-3d-panel';panel.setAttribute('aria-label','3D text');
  panel.innerHTML=`<div class="map-3d-toggles"><label class="map-3d-toggle"><input id="map3DEnabled" type="checkbox"><span>3D extrusion</span></label>
      <label class="map-3d-toggle"><input id="map3DSolid" type="checkbox" checked><span>Solid model</span></label></div>
    <div id="map3DControls" hidden>
      <label class="map-field"><span>Depth</span><div class="map-number"><input id="map3DDepth" type="number" min="0.1" max="100000" step="0.1" value="30"><em>m</em></div></label>
      <label class="map-field map-3d-tilt"><span>Tilt <output id="map3DTiltValue" for="map3DTilt">90°</output></span><input id="map3DTilt" type="range" min="0" max="90" step="1" value="90"><span class="map-3d-endpoints"><span>Flat</span><span>Upright</span></span></label>
      <button id="map3DView" class="map-action" type="button" disabled>View in 3D</button>
      <label class="map-field map-span-2"><span>Orientation</span><select id="map3DOrientation" aria-describedby="map3DOrientationNote"><option value="fixed">Fixed</option><option value="yaw">Turn toward camera</option><option value="billboard">Face camera square-on</option></select></label>
      <p id="map3DOrientationNote" class="map-3d-status map-span-2">Uses your text bearing and tilt.</p>
      <label class="map-field map-span-2"><span>Orbit speed <output id="map3DOrbitPeriodValue" for="map3DOrbitPeriod">30 s / circle</output></span><input id="map3DOrbitPeriod" type="range" min="10" max="120" step="1" value="30"><span class="map-3d-endpoints"><span>Faster</span><span>Slower</span></span></label>
      <button id="map3DOrbit" class="map-action" type="button" aria-pressed="false" disabled>Start orbit</button>
    </div><p id="map3DStatus" class="map-3d-status" role="status">Extrude outline fonts and stand them upright.</p>`;
  parent.after(panel);
  $('map3DEnabled').addEventListener('change',event=>setEnabled(event.target.checked));
  $('map3DSolid').addEventListener('change',event=>{s.extrusionSolid=event.target.checked;refreshControls();syncVisibility();});
  $('map3DOrientation').addEventListener('change',event=>{s.orientationMode=event.target.value;if(queuedOrbit)queuedOrbit=s.orientationMode;camera.retarget();refreshControls();syncVisibility();});
  $('map3DOrbitPeriod').addEventListener('input',event=>{s.orbitPeriodSeconds=Math.max(10,Math.min(120,Number(event.target.value)||30));refreshControls();});
  $('map3DOrbit').addEventListener('click',()=>toggleOrbit());
  $('map3DDepth').addEventListener('input',event=>{const n=Number(event.target.value);if(!Number.isFinite(n)||n<.1)return;s.extrusionDepthMeters=Math.min(100000,n);stopMotion();syncVisibility();});
  $('map3DDepth').addEventListener('change',event=>{event.target.value=String(s.extrusionDepthMeters??30);});
  $('map3DTilt').addEventListener('input',event=>{s.extrusionTilt=Math.max(0,Math.min(90,Number(event.target.value)||0));stopMotion();syncVisibility();});
  $('map3DView').addEventListener('click',()=>engine().fit());
  const geometryInputs=new Set(['mapMessage','mapHeight','mapRelativeSize','mapTracking','mapLineHeight','mapBearing','mapQuality','mapNativeColor']);
  for(const type of ['input','change'])document.addEventListener(type,event=>{if(geometryInputs.has(event.target.id))stopMotion();},true);
  document.addEventListener('click',event=>{if(state()?.previewActive&&event.target.closest?.('[data-map-mode],[data-map-code],[data-code],.key-button[data-base]'))stopMotion();},true);
  const shortcuts=document.createElement('div');shortcuts.className='map-motion-actions';shortcuts.setAttribute('aria-label','Model and animation shortcuts');
  shortcuts.innerHTML=[['Model','box','model','2D'],['Orbit','orbit','orbit','Orbit'],['Turn','rotate-3d','turn','Turn'],['Face','scan-eye','face','Face'],['Random','shuffle','random','Random']].map(([id,icon,accent,caption])=>`<button id="mapQuick${id}" class="map-motion-action" data-accent="${accent}" type="button" ${id==='Random'?'aria-label="Choose a random font"':'aria-pressed="false"'}>${groundIcons[icon]}<span>${caption}</span></button>`).join('');
  $('geoglyphMapEditor').querySelector('.map-editor-head').append(shortcuts);
  const fontRow=document.createElement('p');fontRow.id='mapDisplayedFont';fontRow.className='map-displayed-font';fontRow.setAttribute('role','status');fontRow.setAttribute('aria-atomic','true');
  shortcuts.after(fontRow);
  const status=document.createElement('p');status.id='mapQuickStatus';status.className='map-compact-feedback';status.hidden=true;status.setAttribute('role','status');$('geoglyphMapEditor').after(status);
  $('mapQuickModel').setAttribute('aria-label','Toggle 2D or 3D model');
  $('mapQuickRandom').title='Choose a random font; keep text and animation';
  $('mapQuickModel').addEventListener('click',()=>setEnabled(!s.extrusionEnabled));
  for(const [id,mode] of [['Orbit','fixed'],['Turn','yaw'],['Face','billboard']])$('mapQuick'+id).addEventListener('click',()=>toggleOrbit(mode));
  $('mapQuickRandom').addEventListener('click',()=>engine().randomFont());
  refreshControls();
  return true;
}
window.GeoGlyph3D=Object.freeze({update,prepare:cache.prepare,cached:cache.get,commit,failure,notice:text=>{lastError=text;message(text,true);},preparing:name=>{lastError='';message('Preparing '+name+'…',true);},clear,syncVisibility,isVisible,refreshControls,fit,fitCurrent:camera.fit,startOrbit:camera.start,ensureOrbit,stopOrbit:stopMotion,exitCamera,pauseAnimation:camera.pause,
  stats:()=>({visible:isVisible(),uploads,disposals,bytes:data?.bytes||0,triangles:(data?.position.length||0)/9,lastError,meshKey,cache:cache.stats(),animation:camera.stats()}),
  getBounds:()=>data?.bounds||null});
function boot(){if(initialise())return;const observer=new MutationObserver(()=>{if(initialise())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});window.addEventListener('load',()=>{if(initialise())observer.disconnect();},{once:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pagehide',clear);
window.addEventListener('pageshow',event=>{if(event.persisted&&state()?.extrusionEnabled)engine().queueRebuild(false);});
