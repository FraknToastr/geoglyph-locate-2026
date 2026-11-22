import introduction from './introduction.json';
import rehearsal from './locate-2026-rehearsal.json';
import { validateScript, fontIdentity, newRow } from './script-model.js';
import { createScriptPlayer } from './script-player.js';
import './message-text.js';

const KEY='geoglyph-locate2026.script-draft-v1';
const engine=()=>window.GeoGlyphMapEngine;
const morph=()=>window.GeoGlyphFontMorph;
const fontService=()=>window.GeoGlyphFontService;
const openingEmoji={resourceKey:'conference:Segoe UI Emoji',name:'Segoe UI Emoji'};
const openingFlights=new WeakMap();
let draft=validateScript(introduction),selected=0,storageError='',titleNode=null,ownsOrbit=false,ownsMorph=false,morphPreparing=false,installed=false;
let rehearsalRun=null,fontCycle=null;
const clone=value=>JSON.parse(JSON.stringify(value));
const notify=()=>document.dispatchEvent(new CustomEvent('geoglyph:script-changed'));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(draft));storageError='';}catch{storageError='Draft is available for this session. Save JSON to keep it.';}}
function removeTitle(){titleNode?.remove();titleNode=null;}
function freeze(){
  stopFontCycle();
  removeTitle();engine()?.cancelScriptWork?.();
  if(ownsOrbit)window.GeoGlyph3D?.stopOrbit({freezePose:true});
  if(morphPreparing)morph()?.clear({restore:false});else if(ownsMorph)morph()?.pause();
  ownsOrbit=ownsMorph=morphPreparing=false;
}
function resolveFont(identity) {
  const records=[...engine().state.fontRecords.values()];
  const exact=identity.resourceKey&&records.find(r=>window.GeoGlyphFontService.keyFor(r)===identity.resourceKey);
  const match=exact||records.find(r=>identity.postscriptName&&r.postscriptName===identity.postscriptName)
    ||records.find(r=>(identity.name&&(r.name===identity.name||r.family===identity.name)||identity.family&&r.family===identity.family)&&(!identity.style||r.style===identity.style));
  if(!match)throw Error(`Font unavailable: ${identity.name||identity.resourceKey}. Load that font and retry.`);
  return match;
}
function checked(current){if(!current())throw new DOMException('Script stopped','AbortError');}
const rowActions=row=>Object.fromEntries(row.actions.map(action=>[action.type,action.value]));

function stopFontCycle(){
  const run=fontCycle;
  if(!run)return;
  fontCycle=null;
  if(run.preparingMorph&&(morph().isActive()||morph().stats().preparing))morph().clear();
  run.controller.abort();
  notify();
}

function holdFont(ms,signal){
  return new Promise(resolve=>{
    const done=()=>{
      clearTimeout(timer);
      signal.removeEventListener('abort',done);
      resolve();
    };
    const timer=setTimeout(done,ms);
    signal.addEventListener('abort',done,{once:true});
  });
}

async function cycleFinalFont({duration,hold},owner){
  const api=engine(),s=api.state,{message,mode,extrusionEnabled,tracking,lineHeight}=s;
  const run={owner,controller:new AbortController(),preparingMorph:false};
  const {signal}=run.controller;
  fontCycle=run;
  const current=()=>fontCycle===run&&s.previewActive&&s.mode===mode&&s.message===message&&s.extrusionEnabled===extrusionEnabled;
  notify();
  try{
    const fonts=(await morph().ensureBuiltins()).filter(record=>(record.geoGlyphRef||record).fontCycle!==false);
    let index=fonts.findIndex(record=>record.id===s.selectedFontId);
    if(index<0)throw Error('Use a bundled English outline font for the last message.');
    while(current()){
      const source=fonts[index];
      if(s.selectedFontId!==source.id)return;
      const next=(index+1)%fonts.length,target=fonts[next];
      const held=holdFont(hold*1000,signal);
      // Stage the next shapes and frame them while the completed font holds.
      const [prepared,mesh]=await Promise.allSettled([
        fontService().morph(source,target,message,{targetMessage:message,tracking,lineHeight,signal}),
        api.prepareConferenceFont(target.id,{message,extrusionEnabled})
      ]);
      checked(current);
      if(mesh.status==='rejected'){
        if(!/^(Unsupported outline font|Complex or self-crossing outline requires styled raster rendering)$/.test(mesh.reason.message))throw mesh.reason;
        fonts.splice(next,1);
        if(fonts.length<2)throw Error('No other bundled font can render this message in 3D.');
        index=fonts.indexOf(source);
        continue;
      }
      if(prepared.status==='rejected')throw prepared.reason;
      run.preparingMorph=true;
      const ready=await morph().prepare(target.id,{targetMessage:message,prepared:prepared.value});
      checked(current);
      if(!ready)throw Error(morph().stats().error||'Morph could not be prepared');
      await Promise.all([held,api.fitScriptMorph(current)]);
      checked(current);
      await morph().playToEnd({duration,signal});
      run.preparingMorph=false;
      index=next;
    }
  }catch(error){
    if(current()&&error.name!=='AbortError')api.setConnectionStatus(`Final font cycle: ${error.message}`,'warn');
  }finally{
    if(fontCycle===run)stopFontCycle();
  }
}

async function prepareRehearsal(script,{signal,isCurrent}) {
  await morph().ensureBuiltins();
  checked(isCurrent);
  const state=engine().state;
  const faces=new Set(),fontCoverage=new Map(),preparedMeshes=new Set(),morphs=new Map();
  let displayedFont=state.fontRecords.get(state.selectedFontId),message=state.message;
  let tracking=state.tracking,lineHeight=state.lineHeight,bytes=0,extruded=state.extrusionEnabled;
  async function ensureFace(record) {
    if(!record)throw Error('No font is selected');
    if(!faces.has(record.id)) {
      await fontService().ensureFace(record,{retry:true,timeoutMs:30000,isCurrent});
      checked(isCurrent);
      faces.add(record.id);
    }
  }
  async function coverage(record) {
    await ensureFace(record);
    if(!fontCoverage.has(record.id)) {
      const metadata=await fontService().prepare(record).catch(error=>{
        checked(isCurrent);
        return fontService().prepare(record,{retry:true});
      });
      checked(isCurrent);
      fontCoverage.set(record.id,new Set(metadata.codes));
    }
    return fontCoverage.get(record.id);
  }
  async function verifyText(record,text) {
    const codes=await coverage(record);
    let fallbackCodes=null;
    if(window.GeoGlyphMessageText.hasEmoji(text)) {
      fallbackCodes=await coverage(resolveFont(openingEmoji));
      // The flag fallback is a bitmap face. Load it for browser rendering
      // without sending it through the outline parser.
      await ensureFace(resolveFont({resourceKey:'conference:Emoji Flags'}));
    }
    const missing=[...new Set(text)].find(letter=>!/\s/u.test(letter)&&
      !codes.has(letter.codePointAt(0))&&!fallbackCodes?.has(letter.codePointAt(0)));
    if(missing)throw Error(`${record.name} cannot draw “${missing}”`);
  }
  async function verifyMesh(record,text) {
    if(!extruded)return;
    const key=JSON.stringify([record.id,text]);
    if(preparedMeshes.has(key))return;
    await engine().prepareConferenceFont(record.id,{message:text,extrusionEnabled:true});
    checked(isCurrent);
    preparedMeshes.add(key);
  }
  for(const [index,row] of script.rows.entries()) {
    checked(isCurrent);
    const actions=rowActions(row);
    try {
      const action=actions.morph;
      if(actions.mode)extruded=actions.mode==='3d';
      if(actions.font||actions.mode||action||row.message) {
        displayedFont=action?resolveFont(action.from):actions.font?resolveFont(actions.font):displayedFont;
        message=row.message||message;
        await verifyText(displayedFont,message);
        await verifyMesh(displayedFont,message);
      }
      if(action) {
        const target=resolveFont(action.to),targetMessage=action.targetMessage??message;
        await verifyText(target,targetMessage);
        await verifyMesh(target,targetMessage);
        const result=await fontService().morph(displayedFont,target,message,{targetMessage:action.targetMessage,tracking,lineHeight,signal});
        checked(isCurrent);
        bytes+=result.bytes;
        if(bytes>96*1024*1024)throw Error('Prepared morphs exceed the rehearsal memory limit');
        morphs.set(row.id,{result,tracking,lineHeight});
        if(action.targetMessage!==undefined) {
          displayedFont=target;
          message=targetMessage;
        }
      }
      if(actions.camera==='opening'||actions.camera==='opening-and-fly') {
        displayedFont=resolveFont(openingEmoji);
        message='😴';
        tracking=0;
        lineHeight=1.15;
        extruded=false;
        await verifyText(displayedFont,message);
      }
    }catch(error) {
      checked(isCurrent);
      const line=row.message||actions.morph?.targetMessage||actions.title||row.id;
      throw Error(`Rehearsal row ${index+1} (“${line}”): ${error.message}`);
    }
  }
  return morphs;
}
function showTitle(text,{caption=false,font}={}){
  removeTitle();if(!text)return;
  titleNode=document.createElement('div');titleNode.id='geoglyphConferenceTitle';titleNode.className='geoglyph-conference-title';
  if(caption)titleNode.classList.add('geoglyph-rehearsal-caption');
  titleNode.setAttribute('role','status');titleNode.textContent=text;
  const face=font||[...engine().state.fontRecords.values()].find(r=>r.fontResourceKey==='conference:Gill Sans');
  if(face?.cssFamily)titleNode.style.fontFamily=`${JSON.stringify(face.cssFamily)}, system-ui, sans-serif`;
  document.getElementById('geoglyphMapWorkspace').append(titleNode);
}
async function flyToOpening(api,isCurrent) {
  await api.flyToConferenceOpening(isCurrent);
  checked(isCurrent);
  api.state.conferenceOverview=false;
}
async function applyRow(row,{isCurrent,signal,owner,prepared}) {
  await morph().ensureBuiltins();checked(isCurrent);
  const api=engine(),s=api.state,actions=rowActions(row);
  checked(isCurrent);
  if(!s.previewActive||!s.mapReady)throw Error('Open the map and wait until it is ready');
  if(!row.message&&row.actions.length===1&&actions.animation==='none'){
    window.GeoGlyph3D.stopOrbit({freezePose:true});
    ownsOrbit=false;
    return;
  }
  const hasArt=Boolean(row.message)||row.actions.some(a=>!['title','wait','camera'].includes(a.type));
  const font=actions.font?resolveFont(actions.font):s.fontRecords.get(s.selectedFontId);
  const source=actions.morph?resolveFont(actions.morph.from):font;
  const target=actions.morph?resolveFont(actions.morph.to):null;
  const enabled=actions.mode?actions.mode==='3d':s.extrusionEnabled;
  const animation=actions.animation;
  const animate=Boolean(animation&&animation!=='none');
  const location=actions.location;
  const fit=actions.fit??Boolean(location);
  const instantFit=location?.instant===true;
  const {maxZoom,cameraBearing}=location??{};
  const title=actions.title??location?.caption;
  const caption=Boolean(title&&hasArt&&(location?.caption!==undefined||prepared!==undefined||actions.font||actions.morph));
  if(animation&&animation!=='none'&&!enabled)throw Error('Orbit, Turn and Face require 3D. Add a 3D action.');
  if(actions.morph&&actions.font&&source.id!==font.id)throw Error('Font and morph source must be the same font');
  const message=row.message||s.message;
  if(hasArt&&!message.trim())throw Error('Enter a message before applying appearance actions');
  const emoji=window.GeoGlyphMessageText.hasEmoji(message);
  if(hasArt&&emoji&&(enabled||actions.morph))throw Error('Colour emoji require 2D and cannot be font morphed.');
  const targetMessage=actions.morph?.targetMessage;
  let preparedMorph;
  if(actions.morph){
    if(source.id===target.id&&(targetMessage??message)===message)throw Error('Choose a different target font or message');
    if(targetMessage!==undefined&&window.GeoGlyphMessageText.hasEmoji(targetMessage))throw Error('Colour emoji cannot be font morphed.');
    if(!morph().stats().ready&&(!source.fontResourceKey?.startsWith('conference:')||!target.fontResourceKey?.startsWith('conference:')))throw Error('Morphing requires built-in outline fonts');
    // Preflight font/glyph compatibility before changing the visible row.
    const cached=prepared?.get(row.id);
    if(cached&&cached.tracking===s.tracking&&cached.lineHeight===s.lineHeight)preparedMorph=cached.result;
    else preparedMorph=await fontService().morph(source,target,message,{targetMessage,tracking:s.tracking,lineHeight:s.lineHeight,signal});
    checked(isCurrent);
  }
  let titleShown=false;
  if(hasArt){
    await window.GeoGlyphFontService.ensureFace(source).catch(()=>null);checked(isCurrent);
    const fallback=emoji?resolveFont({resourceKey:'conference:Segoe UI Emoji',name:'Segoe UI Emoji'}):null;
    if(fallback){
      await Promise.all([fallback,resolveFont({resourceKey:'conference:Emoji Flags'})].map(record=>window.GeoGlyphFontService.ensureFace(record)));
      checked(isCurrent);
    }
    const patch={fontId:source?.id,message,hasNewContent:Boolean(row.message),
      nativeColor:window.GeoGlyphMessageText.nativeColour(source,message,Boolean(actions.colour?.fill)),emojiFallbackFontId:fallback?.id||null,
      extrusionEnabled:enabled,mirrorX:actions.mirror??s.mirrorX,fit:fit&&!actions.morph};
    if(actions.colour)Object.assign(patch,actions.colour);
    if(actions.size)Object.assign(patch,{height:actions.size.height,depth:actions.size.depth,relativeSize:100});
    if(actions.depth!==undefined)patch.depth=actions.depth;
    if(actions.tilt!==undefined)patch.tilt=actions.tilt;
    if(actions.bearing!==undefined)patch.bearing=actions.bearing;
    if(location)patch.anchor={lng:location.lng,lat:location.lat};
    if(animate)patch.animation=animation;
    const previous={fontId:s.selectedFontId,message:s.message,nativeColor:s.nativeColor,emojiFallbackFontId:s.emojiFallbackFontId,extrusionEnabled:s.extrusionEnabled,mirrorX:s.mirrorX,
      height:s.baseHeightMeters,relativeSize:s.relativeSize,depth:s.extrusionDepthMeters,fill:s.fill,outline:s.outline,tilt:s.extrusionTilt,bearing:s.bearing,
      ...(location?{anchor:{...s.anchor},anchorPinned:s.anchorPinned}:{})};
    if(actions.morph||actions.font||row.message&&message!==s.message)morph()?.clear({restore:false});
    if(location?.caption!==undefined)removeTitle();
    const mode=owner==='conference'?'arcgis':s.mode,options={isCurrent,mode,preserveOrbit:Boolean(location)&&!instantFit,instantFit,maxZoom,cameraBearing};
    const alreadyDisplayed=targetMessage!==undefined&&!row.message&&s.selectedFontId===source.id&&
      s.displayedFontId===source.id&&row.actions.every(action=>['morph','title','fit'].includes(action.type));
    const result=alreadyDisplayed?null:await api.applyScriptCue(patch,options);checked(isCurrent);
    if(animation==='none'){window.GeoGlyph3D.stopOrbit({freezePose:true});ownsOrbit=false;}
    try {
      let framed=result?.fitted??false;
      if(actions.morph){
        ownsMorph=morphPreparing=true;
        const ready=await morph().prepare(target.id,{targetMessage,prepared:preparedMorph});checked(isCurrent);
        if(!ready)throw Error(morph().stats().error||'Morph could not be prepared');
        if(fit){framed=await api.fitScriptMorph(isCurrent,{orbit:animate,maxZoom,cameraBearing});checked(isCurrent);}
      }
      if(animate){
        if(!window.GeoGlyph3D.ensureOrbit(animation,{framed}))throw Error('Animation could not start');
        ownsOrbit=true;await api.waitForCamera(isCurrent);checked(isCurrent);
      }
      if(actions.morph){
        if(title!==undefined){
          if(caption){await fontService().ensureFace(target,{isCurrent});checked(isCurrent);}
          showTitle(title,{caption,font:caption?target:undefined});titleShown=true;
        }
        document.getElementById('mapMorphDuration').value=actions.morph.duration;
        if(targetMessage!==undefined){
          await morph().playToEnd({duration:actions.morph.duration,signal});
          checked(isCurrent);
          ownsMorph=false;
        }else morph().play();
      }
    }catch(error){
      if(actions.morph&&isCurrent()){morph().clear({restore:false});await api.applyScriptCue(previous,options);}
      throw error;
    }finally{morphPreparing=false;}
  }
  if(title===''&&!titleShown)removeTitle();
  if(actions.camera){
    if(typeof actions.camera==='object'){
      if(!player.state().skip)await api.playCameraFlight(actions.camera,{isCurrent,signal});
      checked(isCurrent);ownsOrbit=false;
    }else if(actions.camera==='overview'){api.showConferenceOverview();}
    else if(actions.camera==='opening'||actions.camera==='opening-and-fly'){
      api.state.conferenceOverview=true;window.GeoGlyph3D.stopOrbit();
      const emoji=resolveFont(openingEmoji);
      await api.drawConferenceOpening(emoji.id,{resetAnchor:rehearsalRun!==null,isCurrent});
    }else if(actions.camera==='wait-for-opening-flight'){
      const flight=openingFlights.get(signal);
      openingFlights.delete(signal);
      if(flight)await flight;
    }else {
      await flyToOpening(api,isCurrent);
    }
  }
  checked(isCurrent);if(title&&!titleShown)showTitle(title,{caption,font:caption?source:undefined});
  if(actions.camera==='opening-and-fly'){
    const flight=flyToOpening(api,isCurrent);
    openingFlights.set(signal,flight);
    // Handle early rejection while the title cues run. The wait cue reports it.
    void flight.catch(()=>{});
  }
}
const player=createScriptPlayer({applyRow,changed:s=>{if(!rehearsalRun)selected=s.index;notify();},stopped:freeze});
function setDraft(value){if(player.state().running)throw Error('Stop playback before editing the script');draft=validateScript(value);player.clearError();selected=Math.min(selected,Math.max(0,draft.rows.length-1));persist();notify();return clone(draft);}
async function play({start=selected,owner='manual',isCurrent=()=>true,onRow=()=>{},onRowStart=()=>{},singleStep=false,runRehearsal=false}={}) {
  if(player.state().running){player.resume();return;}
  stopFontCycle();
  if(owner==='manual'){
    engine().stopPolling({quiet:true});window.GeoGlyphConference?.clearSurveyQueue();
    engine().state.conferenceOverview=false;
  }
  checked(isCurrent);
  const script=runRehearsal?rehearsal:draft;
  const run=runRehearsal?{}:null;rehearsalRun=run;
  const recordRehearsalRow=(row,index)=>{
    const message=rowActions(row).morph?.targetMessage;
    return onRow(message===undefined?row:{...row,message},index);
  };
  try {
    const completed=await player.play(script,start,{owner,isCurrent,onRowStart,singleStep,
      onRow:runRehearsal?recordRehearsalRow:onRow,prepare:runRehearsal?prepareRehearsal:undefined});
    if(completed&&script.fontCycle&&isCurrent()&&!player.state().running)void cycleFinalFont(script.fontCycle,owner);
    return completed;
  } finally {
    if(run&&rehearsalRun===run){rehearsalRun=null;notify();}
  }
}
export function installScriptRuntime(){
  if(installed)return window.GeoGlyphScripts;installed=true;
  try{const saved=localStorage.getItem(KEY);if(saved)draft=validateScript(JSON.parse(saved));}catch{storageError='Saved draft could not be restored. The bundled introduction is available.';}
  window.GeoGlyphScripts=Object.freeze({
    validate:validateScript,getDraft:()=>clone(draft),setDraft,newRow,fontIdentity,resolveFont,
    parse:text=>validateScript(JSON.parse(text)),serialize:()=>JSON.stringify(validateScript(draft),null,2),
    reset:()=>setDraft(introduction),newScript:()=>setDraft({version:1,title:'Untitled script',rows:[newRow()]}),
    select:index=>{if(!player.state().running){selected=Math.max(0,Math.min(draft.rows.length-1,index));notify();}},
    state:()=>({...player.state(),selected,storageError,rehearsal:rehearsalRun!==null,fontCycling:Boolean(fontCycle),hasMotion:ownsOrbit||ownsMorph||Boolean(fontCycle)}),play,
    pause:player.pause,resume:player.resume,stop:()=>{const running=player.state().running;player.stop();if(!running&&(ownsOrbit||ownsMorph||fontCycle)){freeze();notify();}},
    next:()=>{if(player.state().running){engine().cancelCameraFlight();return player.next();}return play({singleStep:true});},
    playConference:options=>play({...options,start:0,owner:'conference'}),
    getRehearsal:()=>clone(rehearsal),
    playRehearsal:options=>play({...options,start:0,owner:'conference',runRehearsal:true}),
    pauseConference:()=>{if(player.state().owner==='conference')player.pause();},
    resumeConference:()=>{if(player.state().owner==='conference')player.resume();},
    stopFontCycle,
    stopConference:()=>{
      if(player.state().owner==='conference')player.stop();
      if(fontCycle?.owner==='conference')stopFontCycle();
    }
  });
  document.addEventListener('visibilitychange',player.wake);
  document.addEventListener('geoglyph:manual-map-change',()=>{if(player.state().running)player.stop();else stopFontCycle();});
  window.addEventListener('pagehide',()=>{player.stop();stopFontCycle();});
  return window.GeoGlyphScripts;
}
