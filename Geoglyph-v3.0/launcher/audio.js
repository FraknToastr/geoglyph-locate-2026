/* Offline C64 jukebox. Streams the original PSID and RSID programs. */
(() => {
'use strict';
const toggle=document.getElementById('audio-toggle'),restart=document.getElementById('audio-restart-song'),meter=document.getElementById('audio-meter');
const select=document.getElementById('audio-track'),previous=document.getElementById('audio-prev'),next=document.getElementById('audio-next'),volumeControl=document.getElementById('audio-volume'),status=document.getElementById('audio-track-status');
const tracks=window.UOSSIDTracks||[],decoded=new Map();
const resumeKey='uos.sid.resume.v1:'+new URL('.',location.href).pathname;
let checkpoint=null,resumeRecord=null,checkpointWait=null,navigating=false;
const checkpointTime=saved=>saved.version===2?saved.frames/saved.rate:saved.scalars[11];
function readResume(){
  try{
    const saved=JSON.parse(sessionStorage.getItem(resumeKey)||'null');
    if(saved?.version!==1||!Number.isFinite(saved.volume))return null;
    const index=tracks.findIndex(track=>track.id===saved.track&&track.sha256===saved.sha256);
    const state=saved.checkpoint;
    if(index<0||!Number.isFinite(state?.rate)||state.rate<8000||state.rate>192000)return null;
    if(tracks[index].format==='RSID'){
      if(state.version!==2||!Number.isSafeInteger(state.frames)||state.frames<0||state.frames>state.rate*3600)return null;
    }else{
      if(typeof state.memory!=='string'||state.memory.length>90000)return null;
      const binary=atob(state.memory);
      if(binary.length!==65536)return null;
      state.memory=Uint8Array.from(binary,character=>character.charCodeAt(0));
      new window.UOSSIDCore(state.rate).restore(state);
    }
    return {...saved,index};
  }catch{return null;}
}
function persist(){
  const track=tracks[loadedIndex];
  if(!checkpoint||!track)return;
  try{
    const saved={...checkpoint};
    if(checkpoint.memory){
      let binary='';
      for(let i=0;i<checkpoint.memory.length;i+=8192)binary+=String.fromCharCode(...checkpoint.memory.subarray(i,i+8192));
      saved.memory=btoa(binary);
    }
    sessionStorage.setItem(resumeKey,JSON.stringify({version:1,track:track.id,sha256:track.sha256,active:wanted,volume,checkpoint:saved}));
  }catch{}
}
function acceptCheckpoint(s){checkpoint=s;if(checkpointWait){checkpointWait(s);checkpointWait=null}}
async function captureCheckpoint(){if(loadedIndex<0)return;if(backend==='scriptprocessor')acceptCheckpoint(engine.save());else if(node){await new Promise(resolve=>{const done=s=>{clearTimeout(timer);resolve(s)},timer=setTimeout(()=>{checkpointWait=null;resolve(null)},350);checkpointWait=done;node.port.postMessage({type:'checkpoint'})})}persist()}
let context=null,master=null,node=null,engine=null,initialising=null,ack=null;
let wanted=false,disposed=false,epoch=0,trackIndex=0,loadedIndex=-1,loadId=0,backend='uninitialised',volume=.35,contextsCreated=0,elapsed=0,pcmRms=0,peak=0,renderedFrames=0;
const aborted=()=>new DOMException('Audio selection changed','AbortError');
function running(){return wanted&&!disposed&&!document.hidden&&context?.state==='running'&&loadedIndex===trackIndex&&!!node}
function ui(message){
  const active=running(),track=tracks[trackIndex];
  toggle.textContent=message||(active?'MUTE SID':wanted?(context?.state==='running'?'LOADING SID':'RESUME SID'):'PLAY SID');toggle.setAttribute('aria-pressed',String(active));
  restart.disabled=!context;if(select)select.value=String(trackIndex);
  if(status)status.textContent=track?track.composer+' · subtune '+track.subtune+' · '+track.model+' PAL':'';
  if(meter)meter.style.transform=active?'scaleX('+Math.min(1,Math.max(.1,pcmRms*5))+')':'scaleX(0)';
}
function bytes(index){
  if(!decoded.has(index)){
    const text=atob(tracks[index].data),value=new Uint8Array(text.length);for(let i=0;i<text.length;i++)value[i]=text.charCodeAt(i);decoded.set(index,value);
  }
  return decoded.get(index);
}
function cancelAck(){if(ack){clearTimeout(ack.timer);ack.reject(aborted());ack=null}}
function report(data){if(data.id!==loadId)return;renderedFrames=data.frames;elapsed=data.seconds;pcmRms=data.rms;peak=data.peak;ui()}
function setGain(silent=false){
  if(!master||!context)return;
  master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(silent?0:volume*.45,context.currentTime,.008);
}
function pauseSource(){if(backend==='audio-worklet')node?.port.postMessage({type:'pause'});setGain(true);ui()}
const processorSource=()=>`const SIDCore=${window.UOSSIDCore.toString()};
const createRSID=${window.UOSRSIDPlayback?.create.toString()||'null'};
const libsidplayfpFactory=${window.UOSLibsidplayfp?.toString()||'null'};
class UOSSIDProcessor extends AudioWorkletProcessor{
 constructor(){
  super();this.psid=new SIDCore(sampleRate);this.sid=this.psid;this.id=0;
  this.running=false;this.pending=null;this.frames=0;this.squares=0;this.peak=0;this.since=0;
  this.port.onmessage=({data})=>{
   if(data.type==='load'){this.pending=data;this.running=false;void this.load(data);}
   else if(data.type==='play'&&data.id===this.id)this.running=true;
   else if(data.type==='pause')this.running=false;
   else if(data.type==='checkpoint'){
    this.running=false;this.port.postMessage({type:'checkpoint',id:this.id,state:this.sid.save()});
   }else if(data.type==='dispose'){
    this.running=false;this.pending=null;this.closed=true;
    this.rsid?.then(sid=>sid.dispose()).catch(()=>{});
   }
  };
 }
 async load(data){
  try{
   if(data.wasm){
    this.rsid??=createRSID(sampleRate,new WebAssembly.Module(data.wasm),libsidplayfpFactory).catch(error=>{this.rsid=null;throw error;});
   }
   const sid=data.wasm?await this.rsid:this.psid;
   if(this.pending!==data||this.closed)return;
   sid.load(new Uint8Array(data.bytes),data.subtune);
   if(data.checkpoint)sid.restore(data.checkpoint);
   this.sid=sid;this.id=data.id;this.frames=this.since=this.squares=this.peak=0;
   this.port.postMessage({type:'loaded',id:data.id});
  }catch(error){
   if(this.pending===data&&!this.closed)this.port.postMessage({type:'error',id:data.id,message:error.message});
  }finally{
   if(this.pending===data)this.pending=null;
  }
 }
 process(inputs,outputs){
  if(this.closed)return false;
  const out=outputs[0][0];
  if(!this.running){out.fill(0);return true}
  this.sid.render(out);for(let i=0;i<out.length;i++){this.squares+=out[i]*out[i];this.peak=Math.max(this.peak,Math.abs(out[i]))}
  this.frames+=out.length;this.since+=out.length;
  if(this.since>=sampleRate/10){this.port.postMessage({type:'stats',id:this.id,frames:this.frames,seconds:this.sid.time(),rms:Math.sqrt(this.squares/this.since),peak:this.peak,state:this.sid.save()});this.since=this.squares=this.peak=0}
  return true;
 }
}registerProcessor('uos-sid',UOSSIDProcessor);`;
async function initialiseNode(active){
  if(node)return;if(initialising?.context===active)return initialising.promise;
  const loading=(async()=>{
    if(!window.UOSSIDCore||!tracks.length)throw Error('Bundled SID runtime or tunes are missing');
    if(active.audioWorklet&&window.AudioWorkletNode&&window.__UOS_AUDIO_TEST__?.forceScriptProcessor!==true){
      let url,moduleTimer;
      try{
        url=URL.createObjectURL(new Blob([processorSource()],{type:'text/javascript'}));
        await Promise.race([active.audioWorklet.addModule(url),new Promise((_,reject)=>{moduleTimer=setTimeout(()=>reject(Error('AudioWorklet module load timed out')),1800)})]);
        if(disposed||context!==active)throw aborted();
        const source=new AudioWorkletNode(active,'uos-sid',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[1]});
        source.port.onmessage=({data})=>{
          if(context!==active)return;
          if(data.type==='loaded'&&ack?.id===data.id){const ready=ack;ack=null;clearTimeout(ready.timer);ready.resolve()}
          else if(data.type==='error'&&ack?.id===data.id){const failed=ack;ack=null;clearTimeout(failed.timer);failed.reject(Error(data.message))}
          else if(data.type==='checkpoint'&&data.id===loadId)acceptCheckpoint(data.state);
          else if(data.type==='stats'){report(data);if(data.id===loadId&&data.state)checkpoint=data.state}
        };
        source.onprocessorerror=()=>{if(context===active){wanted=false;++epoch;cancelAck();pauseSource();source.disconnect();node=null;backend='failed';toggle.title='SID audio processor stopped; press Play to initialise it again';ui('AUDIO STOPPED')}};
        node=source;backend='audio-worklet';node.connect(master);return;
      }catch(error){if(disposed||context!==active)throw aborted();toggle.title='AudioWorklet unavailable; using bounded SID audio fallback'}
      finally{clearTimeout(moduleTimer);if(url)URL.revokeObjectURL(url)}
    }
    if(disposed||context!==active)throw aborted();
    node=active.createScriptProcessor(2048,0,1);backend='scriptprocessor';
    node.onaudioprocess=event=>{
      const out=event.outputBuffer.getChannelData(0);if(!running()){out.fill(0);return}
      engine.render(out);let sum=0,maximum=0;for(let i=0;i<out.length;i++){sum+=out[i]*out[i];maximum=Math.max(maximum,Math.abs(out[i]))}
      if(!checkpoint||engine.time()-checkpointTime(checkpoint)>=.1)checkpoint=engine.save();
      report({id:loadId,frames:Math.round(engine.time()*active.sampleRate),seconds:engine.time(),rms:Math.sqrt(sum/out.length),peak:maximum});
    };
    node.connect(master);
  })().finally(()=>{if(initialising?.promise===loading)initialising=null});
  initialising={context:active,promise:loading};return loading;
}
async function loadTrack(index,restore,current){
  cancelAck();pauseSource();
  const id=++loadId,data=bytes(index),track=tracks[index];
  loadedIndex=-1;elapsed=pcmRms=peak=renderedFrames=0;
  const rsid=track.format==='RSID'?window.UOSRSIDPlayback:null;
  if(!current()||id!==loadId)throw aborted();
  if(backend==='audio-worklet'){
    const copy=data.slice().buffer,wasm=rsid?.bytes().slice().buffer;
    await new Promise((resolve,reject)=>{
      ack={id,resolve,reject,timer:setTimeout(()=>{
        if(ack?.id===id){ack=null;reject(Error('SID processor did not initialise the selected tune'));}
      },5000)};
      try{
        node.port.postMessage({type:'load',id,bytes:copy,subtune:track.subtune-1,checkpoint:restore,wasm},wasm?[copy,wasm]:[copy]);
      }catch(error){
        clearTimeout(ack.timer);ack=null;reject(error);
      }
    });
  }else{
    const sid=rsid
      ?await rsid.create(context.sampleRate,await rsid.compile(),window.UOSLibsidplayfp)
      :new window.UOSSIDCore(context.sampleRate);
    try{
      if(!current()||id!==loadId)throw aborted();
      sid.load(data,track.subtune-1);
      if(restore)sid.restore(restore);
    }catch(error){
      sid.dispose?.();throw error;
    }
    engine?.dispose?.();engine=sid;
  }
  if(id===loadId&&current()){
    loadedIndex=index;
    if(restore){checkpoint=restore;elapsed=checkpointTime(restore);}
  }
}
async function play(reset=false){
  const run=++epoch;wanted=true;ui('LOADING SID');
  try{
    if(!context){
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Web Audio is unavailable');
      const active=context=resumeRecord?new Audio({sampleRate:resumeRecord.checkpoint.rate}):new Audio();contextsCreated++;master=active.createGain();master.gain.value=0;master.connect(active.destination);
      active.addEventListener('statechange',()=>{if(context===active)ui()});
    }
    const active=context,resuming=active.resume(); // Keep resume inside the user's gesture.
    setTimeout(()=>{if(context===active&&run===epoch&&wanted&&active.state!=='running')ui('RESUME SID')},600);
    await initialiseNode(active);await resuming;
    if(run!==epoch||disposed||document.hidden||!wanted)return;
    if(reset){resumeRecord=null;checkpoint=null}
    if(reset||loadedIndex!==trackIndex){
      const saved=resumeRecord;resumeRecord=null;
      await loadTrack(trackIndex,saved?.checkpoint||null,()=>run===epoch&&!disposed&&!document.hidden&&wanted);
    }
    if(run!==epoch||disposed||document.hidden||!wanted)return;
    if(backend==='audio-worklet')node.port.postMessage({type:'play',id:loadId});setGain();ui();
  }catch(error){if(run!==epoch||error.name==='AbortError')return;wanted=false;pauseSource();context?.suspend().catch(()=>{});toggle.title=error.message;ui('AUDIO UNAVAILABLE')}
}
function mute(){wanted=false;++epoch;cancelAck();pauseSource();context?.suspend().catch(()=>{});ui()}
function choose(index){
  if(!tracks.length)return;
  trackIndex=((index%tracks.length)+tracks.length)%tracks.length;resumeRecord=null;checkpoint=null;try{sessionStorage.removeItem(resumeKey)}catch{}loadedIndex=-1;++epoch;cancelAck();pauseSource();elapsed=pcmRms=peak=renderedFrames=0;
  if(wanted&&!document.hidden&&!disposed)play(true);else ui();
}
function changeVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));if(volumeControl)volumeControl.value=String(Math.round(volume*100));setGain(!running())}
toggle.addEventListener('click',()=>{if(wanted&&context?.state==='running')mute();else play(false)});
restart.addEventListener('click',()=>play(true));
previous?.addEventListener('click',()=>choose(trackIndex-1));next?.addEventListener('click',()=>choose(trackIndex+1));
if(select){select.replaceChildren(...tracks.map((track,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=track.title+' — '+track.composer;return option}));select.addEventListener('change',()=>choose(Number(select.value)))}
volumeControl?.addEventListener('input',()=>changeVolume(Number(volumeControl.value)/100));
const jukebox=document.getElementById('audio-jukebox');
document.addEventListener('pointerdown',event=>{if(jukebox?.open&&!jukebox.contains(event.target))jukebox.open=false});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&jukebox?.open){jukebox.open=false;jukebox.querySelector('summary').focus()}});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){++epoch;cancelAck();pauseSource();context?.suspend().catch(()=>{});ui()}
  else if(wanted)play(false);
});
window.addEventListener('pagehide',()=>{
  if(backend==='scriptprocessor'&&engine&&loadedIndex>=0)checkpoint=engine.save();persist();
  disposed=true;wanted=false;++epoch;cancelAck();pauseSource();if(backend==='audio-worklet'){node?.port.postMessage({type:'dispose'});node?.port.close()}
  if(node){node.onaudioprocess=null;node.disconnect()}engine?.dispose?.();master?.disconnect();context?.close().catch(()=>{});node=master=engine=context=null;initialising=null;loadedIndex=-1;decoded.clear();ui();
});
function restoreSession(){resumeRecord=readResume();if(!resumeRecord)return;trackIndex=resumeRecord.index;volume=resumeRecord.volume;elapsed=checkpointTime(resumeRecord.checkpoint);wanted=!!resumeRecord.active;disposed=false;navigating=false;changeVolume(volume);ui();if(wanted)play(false)}
window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;wanted=false;restoreSession();ui()}});
window.UOSAudio={prepareNavigation:async()=>{if(navigating)return;navigating=true;++epoch;cancelAck();pauseSource();await captureCheckpoint();context?.suspend().catch(()=>{});},mute,play,restart:()=>play(true),select:choose,next:()=>choose(trackIndex+1),previous:()=>choose(trackIndex-1),setVolume:changeVolume,
  stats:()=>({wanted,state:context?.state||'uninitialised',voices:running()?3:0,scheduler:running(),step:Math.floor(elapsed*8),trackIndex,title:tracks[trackIndex]?.title||'',composer:tracks[trackIndex]?.composer||'',subtune:tracks[trackIndex]?.subtune||0,model:6581,clock:'PAL',engine:tracks[trackIndex]?.format==='RSID'?'libsidplayfp / reSIDfp':'Hermit jsSID 0.9.1',backend,elapsed,renderedFrames,pcmRms,peak,volume,contextsCreated,sourceNodes:node?1:0,loadPending:!!ack,decodedBytes:[...decoded.values()].reduce((sum,data)=>sum+data.byteLength,0),bufferFrames:backend==='audio-worklet'?128:backend==='scriptprocessor'?2048:0})};
ui();
restoreSession();
})();
