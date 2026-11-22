import introduction from './introduction.json';
import { validateScript, fontIdentity, newRow } from './script-model.js';
import { createScriptPlayer } from './script-player.js';
import './message-text.js';

const KEY='geoglyph-locate2026.script-draft-v1';
const engine=()=>window.GeoGlyphMapEngine;
const morph=()=>window.GeoGlyphFontMorph;
let draft=validateScript(introduction),selected=0,storageError='',titleNode=null,ownsOrbit=false,ownsMorph=false,morphPreparing=false,installed=false;
const clone=value=>JSON.parse(JSON.stringify(value));
const notify=()=>document.dispatchEvent(new CustomEvent('geoglyph:script-changed'));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(draft));storageError='';}catch{storageError='Draft is available for this session. Save JSON to keep it.';}}
function removeTitle(){titleNode?.remove();titleNode=null;}
function freeze(){
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
function showTitle(text){
  removeTitle();if(!text)return;
  titleNode=document.createElement('div');titleNode.id='geoglyphConferenceTitle';titleNode.className='geoglyph-conference-title';
  titleNode.setAttribute('role','status');titleNode.textContent=text;
  const font=[...engine().state.fontRecords.values()].find(r=>r.fontResourceKey==='conference:Gill Sans');
  if(font)titleNode.style.fontFamily=JSON.stringify(font.cssFamily);
  document.getElementById('geoglyphMapWorkspace').append(titleNode);
}
async function applyRow(row,{isCurrent,signal,owner}) {
  await morph().ensureBuiltins();checked(isCurrent);
  const api=engine(),s=api.state,actions=Object.fromEntries(row.actions.map(a=>[a.type,a.value]));
  checked(isCurrent);
  if(!s.previewActive||!s.mapReady)throw Error('Open the map and wait until it is ready');
  const hasArt=Boolean(row.message)||row.actions.some(a=>!['title','wait','camera'].includes(a.type));
  const font=actions.font?resolveFont(actions.font):s.fontRecords.get(s.selectedFontId);
  const source=actions.morph?resolveFont(actions.morph.from):font;
  const target=actions.morph?resolveFont(actions.morph.to):null;
  const enabled=actions.mode?actions.mode==='3d':s.extrusionEnabled;
  const animation=actions.animation;
  if(animation&&animation!=='none'&&!enabled)throw Error('Orbit, Turn and Face require 3D. Add a 3D action.');
  if(actions.morph&&actions.font&&source.id!==font.id)throw Error('Font and morph source must be the same font');
  const message=row.message||s.message;
  if(hasArt&&!message.trim())throw Error('Enter a message before applying appearance actions');
  const emoji=window.GeoGlyphMessageText.hasEmoji(message);
  if(hasArt&&emoji&&(enabled||actions.morph))throw Error('Colour emoji require 2D and cannot be font morphed.');
  if(actions.morph){
    if(source.id===target.id)throw Error('Choose different source and target morph fonts');
    if(!morph().stats().ready&&(!source.fontResourceKey?.startsWith('conference:')||!target.fontResourceKey?.startsWith('conference:')))throw Error('Morphing requires built-in outline fonts');
    // Preflight font/glyph compatibility before changing the visible row.
    await window.GeoGlyphFontService.morph(source,target,message,{tracking:s.tracking,lineHeight:s.lineHeight,signal});checked(isCurrent);
  }
  if(hasArt){
    await window.GeoGlyphFontService.ensureFace(source).catch(()=>null);checked(isCurrent);
    const fallback=emoji?resolveFont({resourceKey:'conference:Segoe UI Emoji',name:'Segoe UI Emoji'}):null;
    if(fallback){
      await Promise.all([fallback,resolveFont({resourceKey:'conference:Emoji Flags'})].map(record=>window.GeoGlyphFontService.ensureFace(record)));
      checked(isCurrent);
    }
    const patch={fontId:source?.id,message,hasNewContent:Boolean(row.message),
      nativeColor:window.GeoGlyphMessageText.nativeColour(source,message,Boolean(actions.colour?.fill)),emojiFallbackFontId:fallback?.id||null,
      extrusionEnabled:enabled,mirrorX:actions.mirror??s.mirrorX,fit:actions.fit===true};
    if(actions.colour)Object.assign(patch,actions.colour);
    if(actions.size)Object.assign(patch,{height:actions.size.height,depth:actions.size.depth,relativeSize:100});
    if(actions.depth!==undefined)patch.depth=actions.depth;
    if(actions.tilt!==undefined)patch.tilt=actions.tilt;
    if(actions.bearing!==undefined)patch.bearing=actions.bearing;
    if(animation&&animation!=='none')patch.animation=animation;
    const previous={fontId:s.selectedFontId,message:s.message,nativeColor:s.nativeColor,emojiFallbackFontId:s.emojiFallbackFontId,extrusionEnabled:s.extrusionEnabled,mirrorX:s.mirrorX,
      height:s.baseHeightMeters,relativeSize:s.relativeSize,depth:s.extrusionDepthMeters,fill:s.fill,outline:s.outline,tilt:s.extrusionTilt,bearing:s.bearing};
    if(actions.morph||actions.font||row.message&&message!==s.message)morph()?.clear({restore:false});
    const mode=owner==='conference'?'arcgis':s.mode;
    const result=await api.applyScriptCue(patch,{isCurrent,mode});checked(isCurrent);
    if(animation==='none'){window.GeoGlyph3D.stopOrbit({freezePose:true});ownsOrbit=false;}
    else if(animation){if(!window.GeoGlyph3D.ensureOrbit(animation,{framed:result.fitted}))throw Error('Animation could not start');ownsOrbit=true;await api.waitForCamera(isCurrent);checked(isCurrent);}
    if(actions.morph){
      try {
        ownsMorph=morphPreparing=true;
        const prepared=await morph().prepare(target.id);checked(isCurrent);
        if(!prepared)throw Error(morph().stats().error||'Morph could not be prepared');
        document.getElementById('mapMorphDuration').value=actions.morph.duration;morph().play();ownsMorph=true;
      }catch(error){
        if(isCurrent()){morph().clear({restore:false});await api.applyScriptCue(previous,{isCurrent,mode});}
        throw error;
      }finally{morphPreparing=false;}
    }
  }
  if(actions.camera){
    if(typeof actions.camera==='object'){
      if(!player.state().skip)await api.playCameraFlight(actions.camera,{isCurrent,signal});
      checked(isCurrent);ownsOrbit=false;
    }else if(actions.camera==='overview'){api.showConferenceOverview();}
    else if(actions.camera==='opening'){
      api.state.conferenceOverview=true;window.GeoGlyph3D.stopOrbit();
      const emoji=resolveFont({resourceKey:'conference:Segoe UI Emoji',name:'Segoe UI Emoji'});
      await api.drawConferenceOpening(emoji.id,{resetAnchor:false,isCurrent});
    }else {
      await api.flyToConferenceOpening(isCurrent);checked(isCurrent);api.state.conferenceOverview=false;
    }
  }
  checked(isCurrent);if(actions.title!==undefined)showTitle(actions.title);
}
const player=createScriptPlayer({applyRow,changed:s=>{selected=s.index;notify();},stopped:freeze});
function setDraft(value){if(player.state().running)throw Error('Stop playback before editing the script');draft=validateScript(value);player.clearError();selected=Math.min(selected,Math.max(0,draft.rows.length-1));persist();notify();return clone(draft);}
async function play({start=selected,owner='manual',isCurrent=()=>true,onRow=()=>{},onRowStart=()=>{},singleStep=false}={}) {
  if(player.state().running){player.resume();return;}
  if(owner==='manual'){
    engine().stopPolling({quiet:true});window.GeoGlyphConference?.clearSurveyQueue();
    engine().state.conferenceOverview=false;
  }
  checked(isCurrent);
  return player.play(draft,start,{owner,isCurrent,onRow,onRowStart,singleStep});
}
export function installScriptRuntime(){
  if(installed)return window.GeoGlyphScripts;installed=true;
  try{const saved=localStorage.getItem(KEY);if(saved)draft=validateScript(JSON.parse(saved));}catch{storageError='Saved draft could not be restored. The bundled introduction is available.';}
  window.GeoGlyphScripts=Object.freeze({
    validate:validateScript,getDraft:()=>clone(draft),setDraft,newRow,fontIdentity,resolveFont,
    parse:text=>validateScript(JSON.parse(text)),serialize:()=>JSON.stringify(validateScript(draft),null,2),
    reset:()=>setDraft(introduction),newScript:()=>setDraft({version:1,title:'Untitled script',rows:[newRow()]}),
    select:index=>{if(!player.state().running){selected=Math.max(0,Math.min(draft.rows.length-1,index));notify();}},
    state:()=>({...player.state(),selected,storageError,hasMotion:ownsOrbit||ownsMorph}),play,
    pause:player.pause,resume:player.resume,stop:()=>{const running=player.state().running;player.stop();if(!running&&(ownsOrbit||ownsMorph)){freeze();notify();}},
    next:()=>{if(player.state().running){engine().cancelCameraFlight();return player.next();}return play({singleStep:true});},
    playConference:options=>play({...options,start:0,owner:'conference'}),
    pauseConference:()=>{if(player.state().owner==='conference')player.pause();},
    resumeConference:()=>{if(player.state().owner==='conference')player.resume();},
    stopConference:()=>{if(player.state().owner==='conference')player.stop();}
  });
  document.addEventListener('visibilitychange',player.wake);
  document.addEventListener('geoglyph:manual-map-change',()=>{if(player.state().running)player.stop();});
  window.addEventListener('pagehide',()=>player.stop());
  return window.GeoGlyphScripts;
}
