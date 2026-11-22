import { createFontMorphLayer } from './font-morph-renderer.js';
import { Matrix4 } from 'three';

const $=id=>document.getElementById(id);
const engine=()=>window.GeoGlyphMapEngine;
const state=()=>engine()?.state;
const service=()=>window.GeoGlyphFontService;
const LAYER='geoglyph-font-morph';
const exportIds=['mapExportGeoJsonBtn','mapSaveJpgBtn','mapSavePngBtn','mapCollapsedJpgBtn','mapCollapsedPngBtn'];
const blockedExports=new Map();
const observedMaps=new WeakSet();
let installed=false,builtinJob=null,layer=null,model=null,controller=null,sequence=0;
let ready=false,preparing=false,playing=false,progress=0,error='',status='Choose two built-in outline fonts.';
let fromId='',toId='',signature='',pendingSignature='',frame=0,lastTime=0,playTime=0,lastUi=0,angles=null;
let lastPreparationMs=0,preparationStarted=0;
let scriptedPlayback=null;
const smooth=t=>t*t*(3-2*t);
function inverseSmooth(t){let lo=0,hi=1;for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(smooth(mid)<t)lo=mid;else hi=mid;}return (lo+hi)/2;}
function selectionKey(){const s=state();return JSON.stringify([s?.selectedFontId,s?.mode,s?.message,s?.tracking,s?.lineHeight]);}
function builtin(record){return !!record&&record.source==='conference'&&/^conference:/.test(service().keyFor(record))&&!record.hasColor&&!/emoji/i.test(record.name);}
function eligibility(){
  const s=state();
  if(!s?.previewActive||!s.mapReady)return 'Open the map preview before preparing a morph.';
  const script=window.GeoGlyphScripts?.state();
  if(s.mode!=='message'&&!(s.mode==='arcgis'&&(script?.running||script?.fontCycling)))return 'Choose Message mode to morph the same text between fonts.';
  if(s.extrusionEnabled&&!s.extrusionSolid)return 'Font morphing needs Solid model enabled in 3D. Transparent 3D is not supported yet.';
  if(!builtin(s.fontRecords.get(s.selectedFontId)))return 'Choose a From font in the Font morph panel. Emoji fonts cannot be morphed.';
  if(!String(s.message||'').trim())return 'Enter a message to morph.';
  return '';
}

async function ensureBuiltins(){
  if(builtinJob)return builtinJob;
  builtinJob=(async()=>{
    const element=$('geoglyph-conference-fonts');
    if(!element)throw Error('Built-in font pack is unavailable. Rebuild Geoglyph.');
    let manifest=JSON.parse(element.textContent);
    if(location.protocol==='file:'&&!manifest.every(font=>font.data)){
      if(!window.GeoGlyphConferenceFontData){
        await new Promise((resolve,reject)=>{
          const script=document.createElement('script');script.src=element.dataset.localFontPack;
          script.onload=()=>{script.remove();resolve();};
          script.onerror=()=>{script.remove();reject(Error('Keep src/fonts beside index.html, or open the standalone GeoGlyph file.'));};
          document.head.append(script);
        });
      }
      manifest=window.GeoGlyphConferenceFontData||manifest;
    }
    const added=[];
    for(const font of manifest){
      const key=`conference:${font.key}`;
      if([...state().fontRecords.values()].some(record=>service().keyFor(record)===key))continue;
      let buffer;
      if(font.data){
        const binary=atob(font.data),bytes=new Uint8Array(binary.length);
        for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
        buffer=bytes.buffer;
      }else{
        const response=await fetch(font.file,{signal:AbortSignal.timeout(15000)});
        if(!response.ok)throw Error(`Could not load built-in font ${font.name} (HTTP ${response.status}).`);
        buffer=await response.arrayBuffer();
      }
      added.push({id:`conference-${font.key.toLowerCase().replace(/\s/g,'-')}`,source:'conference',
        fontResourceKey:key,name:font.name,family:font.family,style:font.style,hasColor:Boolean(font.emoji),fontCycle:font.fontCycle,arrayBuffer:buffer});
    }
    if(added.length){window.GeoGlyphStudio.registerFonts(added);engine().refreshFonts();}
    const records=[...state().fontRecords.values()].filter(builtin);
    refreshTargets(records);return records;
  })().catch(reason=>{builtinJob=null;throw reason;});
  return builtinJob;
}
function refreshTargets(records=[...state().fontRecords.values()].filter(builtin)){
  const select=$('mapMorphTarget');if(!select)return;
  const selected=select.value;
  select.replaceChildren(new Option('Choose target font…',''),...records.map(record=>new Option(record.name,record.id)));
  if(records.some(record=>record.id===selected))select.value=selected;
  const source=$('mapMorphSource');
  source.replaceChildren(new Option('Choose source font…',''),...records.map(record=>new Option(record.name,record.id)));
  source.options[0].disabled=true;
  refreshUi();
}
function pairPrompt(){
  const s=state(),source=s.fontRecords.get(s.selectedFontId);
  if(!builtin(source))return 'Choose a From font above. Emoji fonts cannot be morphed.';
  const target=$('mapMorphTarget').value;
  if(!target)return 'Choose a different To font, then Play or drag Progress.';
  if(target===source.id)return 'Choose different From and To fonts.';
  return eligibility();
}
function feedback(message,reason=''){
  status=message;error=reason;refreshUi();
}
function refreshUi(){
  if(!installed)return;
  const s=state(),source=s.fontRecords.get(ready?fromId:s.selectedFontId);
  $('mapMorphSource').value=builtin(source)?source.id:'';
  const prompt=pairPrompt();
  $('mapMorphStatus').textContent=!ready&&!preparing&&!error?(prompt||'Ready. Play to morph, or Prepare to enable scrubbing.'):status;
  $('mapMorphStatus').dataset.state=error?'error':preparing?'preparing':'ready';
  $('mapMorphPanel').setAttribute('aria-busy',String(preparing));
  $('mapMorphPrepare').disabled=!!prompt||preparing;
  $('mapMorphPlay').disabled=(!ready&&!!prompt)||preparing;
  $('mapMorphPlay').textContent=playing?'Pause':progress>=1?'Replay':'Play';
  $('mapMorphPlay').setAttribute('aria-pressed',String(playing));
  $('mapMorphClear').disabled=!ready&&!preparing;
  $('mapMorphProgress').disabled=!ready;
  $('mapMorphProgress').value=String(progress);
  $('mapMorphValue').textContent=Math.round(progress*100)+'%';
  $('mapMorphProgress').setAttribute('aria-valuetext',Math.round(progress*100)+' percent');
  const intermediate=ready&&progress>0&&progress<1;
  for(const id of exportIds){
    const button=$(id);if(!button)continue;
    if(intermediate){
      if(!blockedExports.has(id))blockedExports.set(id,{disabled:button.disabled,title:button.title});
      button.disabled=true;button.title='Move the morph slider to an endpoint before exporting.';
    }else if(blockedExports.has(id)){
      const previous=blockedExports.get(id);button.disabled=previous.disabled;button.title=previous.title;blockedExports.delete(id);
    }
  }
  window.GeoGlyph3D?.refreshExportControls?.();
}
function stopClock(){if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;}
function pause(){
  playing=false;stopClock();
  scriptedPlayback?.finish(new DOMException('Message morph cancelled', 'AbortError'));
  refreshUi();return progress;
}
function unpin(){service().unpin('morph-from');service().unpin('morph-to');}
function removeLayer(){
  if(layer){
    const map=state()?.map;
    try{if(map?.getLayer(layer.id))map.removeLayer(layer.id);else layer.dispose();}catch{layer.dispose();}
  }
  layer=null;
}
function clear({message='Morph cleared. The source font is displayed.',restore=true}={}){
  ++sequence;controller?.abort();controller=null;pause();
  ready=preparing=false;model=null;signature=pendingSignature='';angles=null;progress=0;fromId=toId='';
  removeLayer();unpin();
  if(restore){
    window.GeoGlyph3D?.syncVisibility();window.GeoGlyph3D?.refreshControls();
    if(state()?.extrusionEnabled&&state()?.previewActive&&!window.GeoGlyph3D?.isVisible())window.GeoGlyph3D?.update();
  }
  feedback(message);return true;
}
function syncVisibility(){
  const s=state();
  if(ready&&s?.extrusionEnabled&&!s.extrusionSolid){clear({message:'Morph stopped: enable Solid model before morphing in 3D.'});return;}
  layer?.setVisible(ready&&!!s?.previewActive);
  s?.map?.triggerRepaint();
}
function rendererFailure(reason){
  const text=reason?.message||String(reason);
  clear({message:'Font morph unavailable: '+text});
  feedback(status,text);
}
async function prepare(targetId=$('mapMorphTarget')?.value,{targetMessage,prepared:preflight}={}){
  const version=++sequence;
  controller?.abort();controller=new AbortController();
  const signal=controller.signal;pause();preparing=true;
  pendingSignature=selectionKey();
  preparationStarted=performance.now();feedback('Preparing font shapes…');
  let candidate=null,candidateMap=null;
  const pinFrom=`morph-request-${version}-from`,pinTo=`morph-request-${version}-to`;
  try{
    await ensureBuiltins();if(version!==sequence)return false;
    const reason=eligibility();if(reason)throw Error(reason);
    const s=state(),from=s.fontRecords.get(s.selectedFontId),to=s.fontRecords.get(targetId);
    if(!observedMaps.has(s.map)){
      observedMaps.add(s.map);
      s.map.getCanvas().addEventListener('webglcontextlost',()=>clear({message:'Graphics context lost. Prepare the morph again after the map recovers.',restore:false}));
      s.map.on('remove',()=>clear({message:'Map closed.',restore:false}));
    }
    if(!builtin(to))throw Error('Choose a built-in outline font as the target.');
    if(service().keyFor(from)===service().keyFor(to)&&(targetMessage===undefined||targetMessage===s.message))throw Error('Choose a different target font or message.');
    const key=selectionKey(),current=()=>version===sequence&&!signal.aborted&&key===selectionKey();
    service().pin(from,pinFrom);service().pin(to,pinTo);
    const prepared=preflight ?? await service().morph(from,to,s.message,{targetMessage,tracking:s.tracking,lineHeight:s.lineHeight,signal});
    if(targetMessage!==undefined&&(!prepared.commitEndpoint||prepared.targetText!==targetMessage.replace(/\r\n?/g,'\n')||prepared.sourceText!==s.message.replace(/\r\n?/g,'\n'))) {
      throw Error('Prepared morph does not match its source and target messages.');
    }
    if(!current())return false;
    // Let a source font edit that was already requested finish before taking
    // over. Clear can then always restore the actual selected source model.
    const sourceDeadline=performance.now()+10000;
    while(!ready&&(s.rebuilding||s.pendingBuild)){
      if(!current())return false;
      if(performance.now()>sourceDeadline)throw Error('The source font is still preparing. Retry the morph in a moment.');
      await new Promise((resolve,reject)=>{
        const done=()=>{signal.removeEventListener('abort',aborted);resolve();};
        const timer=setTimeout(done,16);
        const aborted=()=>{clearTimeout(timer);reject(signal.reason);};
        signal.addEventListener('abort',aborted,{once:true});
      });
    }
    if(!current())return false;
    if(!ready&&s.displayedFontId!==from.id)throw Error('The selected source font could not be displayed. Choose a built-in outline font and retry.');
    // Stage a separate hidden layer, keeping the previous display intact until
    // textures and shaders are ready. Its id is temporary during preparation.
    const id=ready?`${LAYER}-pending-${version}`:LAYER;
    let staged,stageError=null;
    const poseOutput={geographic:new Matrix4(),object:new Matrix4()};
    candidate=staged=createFontMorphLayer({id,map:s.map,
      getPose:()=>{
        const pose=window.GeoGlyph3D.morphPose(staged.getBounds(),{flat:!s.extrusionEnabled,output:poseOutput});
        angles=pose.angles;return pose;
      },
      getStyle:()=>({extruded:s.extrusionEnabled,fill:s.fill,outline:s.outline,outlineWidth:s.outlineWidth,
        opacity:s.extrusionEnabled?1:s.opacity,visible:s.previewActive}),
      onError:reason=>{if(layer===staged)rendererFailure(reason);else stageError=reason;}});
    candidateMap=s.map;candidate.setVisible(false);candidateMap.addLayer(candidate);
    await candidate.prepareModel(prepared,{isCurrent:current,signal});
    if(stageError)throw stageError;
    if(!current())return false;
    const previous=layer;
    // Ordinary model requests that started before preparation must not commit
    // late and re-enter framing after the GPU morph has taken over the display.
    ++s.buildToken;s.pendingBuild=s.pendingFit=s.explicitFitPending=false;
    engine().cancelInitialFit();
    layer=candidate;candidate=null;model=prepared;
    fromId=from.id;toId=to.id;signature=key;ready=true;progress=0;
    service().pin(from,'morph-from');service().pin(to,'morph-to');
    if(previous){if(s.map.getLayer(previous.id))s.map.removeLayer(previous.id);else previous.dispose();}
    layer.setProgress(0);layer.setVisible(true);
    lastPreparationMs=performance.now()-preparationStarted;
    $('mapMorphTarget').value=targetId;
    window.GeoGlyph3D.syncVisibility();window.GeoGlyph3D.refreshControls();
    feedback(`${from.name} → ${to.name}. Ready to play or scrub.`);return true;
  }catch(reason){
    if(version!==sequence||signal.aborted)return false;
    feedback('Could not prepare morph: '+reason.message,reason.message);
    if(!ready)unpin();return false;
  }finally{
    service().unpin(pinFrom);service().unpin(pinTo);
    if(candidate){
      try{if(candidateMap?.getLayer(candidate.id))candidateMap.removeLayer(candidate.id);else candidate.dispose();}
      catch{candidate.dispose();}
    }
    if(version===sequence){preparing=false;pendingSignature='';controller=null;refreshUi();}
  }
}
function setProgress(value){progress=Math.max(0,Math.min(1,Number(value)||0));layer?.setProgress(progress);}
function seek(value){
  pause();if(!ready)return false;
  setProgress(value);feedback(`${Math.round(progress*100)}% · drag to reshape the message.`);return true;
}
function tick(now){
  frame=0;if(!playing||!ready||document.hidden)return;
  const duration=scriptedPlayback?.duration ?? Math.max(.25,Math.min(30,Number($('mapMorphDuration').value)||2))*1000;
  if(lastTime)playTime+=Math.max(0,now-lastTime);
  lastTime=now;setProgress(smooth(Math.min(1,playTime/duration)));
  if(now-lastUi>=100||progress===1){lastUi=now;refreshUi();}
  if(progress>=1){
    playing=false;lastTime=0;
    if(scriptedPlayback) void commitScriptedEndpoint(scriptedPlayback);
    else feedback('Target font reached. Replay or scrub the transition.');
  }
  else frame=requestAnimationFrame(tick);
}
async function commitScriptedEndpoint(run) {
  const current=()=>scriptedPlayback===run&&sequence===run.version&&!run.signal?.aborted;
  try {
    const result=await engine().commitMorphEndpoint({fontId:toId,message:model.targetText,release(){
      // The target mesh is ready. Remove the morph in the same frame as its
      // replacement, without cancelling the orbit or the playback promise.
      ready=false;
      removeLayer();unpin();
      model=null;signature='';angles=null;progress=0;fromId=toId='';
    }},current);
    if(!current())return;
    if(!result?.ok)throw result?.error || Error('Could not display the morph target.');
    run.finish();
    feedback('Target message and font displayed.');
  } catch(error) {
    if(!current())return;
    run.finish(error);
    clear({message:`Could not display the morph target: ${error.message}`});
    feedback(status,error.message);
  }
}
function playToEnd({duration=2,signal}={}) {
  const reason=eligibility();
  if(reason)return Promise.reject(Error(reason));
  if(!ready||!model?.commitEndpoint||preparing||scriptedPlayback)return Promise.reject(Error('Prepare a message morph before playing it.'));
  if(signal?.aborted){clear();return Promise.reject(signal.reason);}
  pause();setProgress(0);
  return new Promise((resolve,reject)=>{
    const run={duration:Math.max(.25,Math.min(30,Number(duration)||2))*1000,signal,version:sequence,
      finish(error){
        if(scriptedPlayback!==run)return;
        scriptedPlayback=null;signal?.removeEventListener('abort',abort);
        if(error)reject(error);else resolve(true);
      }};
    const abort=()=>{run.finish(signal.reason || new DOMException('Message morph cancelled','AbortError'));clear();};
    scriptedPlayback=run;signal?.addEventListener('abort',abort,{once:true});
    playTime=0;lastTime=0;playing=true;
    feedback('Morphing message shapes…');frame=requestAnimationFrame(tick);
  });
}
async function play(){
  if(playing){pause();return true;}
  if(preparing)return false;
  if(!ready){const expected=sequence+1;if(!await prepare()||sequence!==expected||!ready)return false;}
  if(eligibility()){feedback(eligibility(),eligibility());return false;}
  if(progress>=1)setProgress(0);
  const duration=Math.max(.25,Math.min(30,Number($('mapMorphDuration').value)||2))*1000;
  playTime=inverseSmooth(progress)*duration;playing=true;lastTime=0;
  feedback('Morphing font shapes…');frame=requestAnimationFrame(tick);return true;
}
function onGeometryChange(){
  const expected=preparing?pendingSignature:signature;
  if((ready||preparing)&&expected&&selectionKey()!==expected)clear({message:'Message or font changed. Prepare a new morph.'});
  else refreshUi();
}
function setMode(enabled){
  if(!ready)return false;
  pause();
  const s=state();
  if(enabled&&!s.extrusionSolid){feedback('Enable Solid model to morph in 3D.','Transparent 3D morphing is not supported yet.');return false;}
  s.extrusionEnabled=enabled;
  if(enabled&&s.extrusionDepthMeters==null)s.extrusionDepthMeters=Math.max(.1,s.baseHeightMeters*s.relativeSize/1000);
  engine().refreshControls();window.GeoGlyph3D.morphModeChanged(enabled);syncVisibility();return true;
}
function canExport(){return !ready||progress===0||progress===1;}
function framingCoordinates(){
  if(!ready)return [];
  const s=state(),b=model.bounds,height=s.baseHeightMeters*s.relativeSize/100;
  const ring=[[b.minX,b.minY],[b.maxX,b.minY],[b.maxX,b.maxY],[b.minX,b.maxY],[b.minX,b.minY]];
  return engine().geometry.projectPolygons([[ring]],model.fromBounds,height/model.fromBounds.height,s.bearing,s.anchor)[0][0];
}
async function exportGeoJSON(){
  if(!ready||!canExport())return null;
  const s=state(),at=progress,record=s.fontRecords.get(at===1?toId:fromId),version=sequence;
  const text=at===1&&model.commitEndpoint?model.targetText:s.message;
  const reference=at===1&&model.commitEndpoint?model.toBounds:model.fromBounds;
  const endpoint=await service().model(record,text,{tracking:s.tracking,lineHeight:s.lineHeight});
  if(version!==sequence||!ready||progress!==at)return null;
  const height=s.baseHeightMeters*s.relativeSize/100;
  const coordinates=engine().geometry.projectPolygons(endpoint.polygons,reference,height/reference.height,s.bearing,s.anchor);
  return {type:'FeatureCollection',features:[{type:'Feature',properties:{mode:s.mode,message:text,font:record.name,
    renderer:'font-morph-endpoint',fill:s.fill,outline:s.outline,height_m:height*endpoint.bounds.height/reference.height,bearing:s.bearing},
    geometry:{type:'MultiPolygon',coordinates}}]};
}
async function prepareOBJEndpoint(){
  if(!ready||preparing||!canExport())throw Error('Move the morph slider to an endpoint before exporting.');
  const s=state(),at=progress,version=sequence,key=selectionKey();
  const record=s.fontRecords.get(at===1?toId:fromId),target=at===1&&model.commitEndpoint;
  const referenceBounds={...(target?model.toBounds:model.fromBounds)};
  const text=target?model.targetText:s.message,options={tracking:s.tracking,lineHeight:s.lineHeight,tolerance:.4};
  const isCurrent=()=>ready&&!preparing&&version===sequence&&progress===at&&selectionKey()===key;
  const endpoint=await service().model(record,text,options);
  if(!isCurrent())throw Error('The morph changed before export. Choose an endpoint and retry.');
  const mesh=await service().mesh(JSON.stringify([service().keyFor(record),text,options]),endpoint);
  if(!isCurrent())throw Error('The morph changed before export. Choose an endpoint and retry.');
  return {mesh,model:endpoint,referenceBounds,name:record.name,isCurrent};
}
export function installFontMorph(){
  if(installed||!$('mapFontSelect')||!window.GeoGlyph3D)return;
  const panel=document.createElement('section');panel.id='mapMorphPanel';panel.className='map-morph-panel map-span-2';panel.setAttribute('aria-label','Font morph');
  panel.innerHTML=`<label class="map-field"><span>From font</span><select id="mapMorphSource" aria-describedby="mapMorphStatus"><option value="">Choose source font…</option></select></label>
    <label class="map-field"><span>To font</span><select id="mapMorphTarget"><option value="">Choose target font…</option></select></label>
    <div class="map-morph-actions"><label class="map-field"><span>Duration</span><div class="map-number"><input id="mapMorphDuration" type="number" min="0.25" max="30" step="0.25" value="2"><em>s</em></div></label>
    <div class="map-morph-buttons" role="group" aria-label="Morph playback"><button class="map-action" id="mapMorphPrepare" type="button" disabled>Prepare</button><button class="map-action" id="mapMorphPlay" type="button" aria-pressed="false" disabled>Play</button></div></div>
    <label class="map-field"><span>Progress <output id="mapMorphValue" for="mapMorphProgress">0%</output></span><input id="mapMorphProgress" type="range" min="0" max="1" step="0.001" value="0" disabled></label>
    <div class="map-morph-footer"><p id="mapMorphStatus" class="map-3d-status" role="status">Choose two built-in outline fonts.</p><button class="map-action" id="mapMorphClear" type="button" disabled>Clear</button></div>`;
  document.querySelector('.map-3d-panel').after(panel);installed=true;
  window.GeoGlyphFontMorph=Object.freeze({ensureBuiltins,prepare,play,playToEnd,pause,seek,clear,onGeometryChange,setMode,syncVisibility,canExport,exportGeoJSON,prepareOBJEndpoint,framingCoordinates,
    isActive:()=>ready,getBounds:()=>layer?.getBounds(),renderedAngles:()=>angles,
    label:()=>`${state().fontRecords.get(fromId)?.name||'Source'} → ${state().fontRecords.get(toId)?.name||'Target'}`,
    stats:()=>({ready,preparing,playing,progress,error,fromId,toId,lastPreparationMs,renderer:layer?.stats()||null})});
  $('mapMorphPrepare').addEventListener('click',()=>prepare());
  $('mapMorphSource').addEventListener('change',async event=>{
    const id=event.target.value;
    if(!builtin(state().fontRecords.get(id)))return;
    pause();
    await engine().selectFont(id);
    engine().refreshControls();
    if(state().selectedFontId!==id)return;
    feedback('Source font selected. Choose a different To font.');
    if(!pairPrompt())prepare();
  });
  $('mapMorphTarget').addEventListener('change',()=>{
    if(!pairPrompt())prepare();
    else if(ready||preparing)clear({message:pairPrompt()});
    else feedback(pairPrompt());
  });
  $('mapMorphPlay').addEventListener('click',()=>play());
  $('mapMorphProgress').addEventListener('input',event=>seek(event.target.value));
  $('mapMorphDuration').addEventListener('input',()=>pause());
  $('mapMorphClear').addEventListener('click',()=>clear());
  document.addEventListener('geoglyph:ground-rendered',()=>{onGeometryChange();refreshUi();});
  document.addEventListener('geoglyph:ground-style',syncVisibility);
  document.addEventListener('visibilitychange',()=>{
    if(!scriptedPlayback){if(document.hidden)pause();return;}
    if(document.hidden)stopClock();
    else if(playing&&!frame)frame=requestAnimationFrame(tick);
  });
  window.addEventListener('pagehide',()=>clear({restore:false}));
  // Only load the small monochrome built-ins on demand; unattended conference
  // startup and its emoji pack remain owned by the existing presentation flow.
  panel.addEventListener('focusin',()=>ensureBuiltins().catch(reason=>feedback(reason.message,reason.message)),{once:true});
  panel.addEventListener('pointerenter',()=>ensureBuiltins().catch(reason=>feedback(reason.message,reason.message)),{once:true});
  refreshUi();
}
