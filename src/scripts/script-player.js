import { validateScript } from './script-model.js';

export function createScriptPlayer({applyRow,changed=()=>{},stopped=()=>{},now=()=>performance.now(),visible=()=>!document.hidden,timer=setTimeout,cancelTimer=clearTimeout}) {
  let run=null,sequence=0,wake=null;
  const state={running:false,paused:false,phase:'idle',index:0,rowId:null,error:'',owner:null};
  const emit=()=>changed({...state});
  function stop({freeze=true}={}) {
    const active=run;run=null;++sequence;
    active?.abort();wake?.();
    if(active&&freeze)stopped();
    Object.assign(state,{running:false,paused:false,phase:'stopped',owner:null});emit();
  }
  async function wait(ms,current,signal) {
    let remaining=ms,last=now(),wasRunning=!state.paused&&visible();
    await new Promise((resolve,reject)=>{
      let handle;
      const done=error=>{cancelTimer(handle);signal.removeEventListener('abort',aborted);wake=null;error?reject(error):resolve();};
      const aborted=()=>done(new DOMException('Script stopped','AbortError'));
      const tick=()=>{
        cancelTimer(handle);const time=now();if(wasRunning)remaining-=Math.max(0,time-last);last=time;
        wasRunning=!state.paused&&visible();
        if(!current())return aborted();
        if(state.skip){state.skip=false;return done();}
        if(!state.paused&&visible()&&remaining<=0)return done();
        handle=timer(tick,Math.max(1,Math.min(50,remaining>0?remaining:50)));
      };
      wake=tick;signal.addEventListener('abort',aborted,{once:true});tick();
    });
  }
  async function play(value,start=0,{owner='manual',isCurrent=()=>true,onRow=()=>{},onRowStart=()=>{},singleStep=false}={}) {
    const script=validateScript(value);
    if(!script.rows.length)throw Error('Add a script row first');
    if(!Number.isInteger(start)||start<0||start>=script.rows.length)throw Error('Choose a script row');
    stop({freeze:false});const version=++sequence,controller=new AbortController();run=controller;
    const current=()=>run===controller&&sequence===version&&!controller.signal.aborted&&isCurrent();
    Object.assign(state,{running:true,paused:false,phase:'preparing',index:start,error:'',owner,skip:false});emit();
    try {
      for(let index=start;index<script.rows.length;index++) {
        const row=script.rows[index];Object.assign(state,{index,rowId:row.id,phase:'preparing'});emit();
        if(!current())throw new DOMException('Script stopped','AbortError');
        await onRowStart(row,index);
        await applyRow(row,{signal:controller.signal,isCurrent:current,owner});
        if(!current())throw new DOMException('Script stopped','AbortError');
        await onRow(row,index);
        state.phase='waiting';if(singleStep)state.paused=true;emit();
        const delay=row.actions.find(a=>a.type==='wait')?.value??0;
        await wait((row.duration+delay)*1000,current,controller.signal);
      }
      if(!current())return false;
      run=null;Object.assign(state,{running:false,paused:false,phase:'complete',owner:null});emit();return true;
    }catch(error){
      if(run!==controller)return false;
      run=null;
      if(error.name!=='AbortError'){stopped();Object.assign(state,{phase:'error',error:`Row ${state.index+1}: ${error.message}`});}
      else state.phase='stopped';
      Object.assign(state,{running:false,paused:false,owner:null});emit();
      if(error.name!=='AbortError')throw Error(state.error);return false;
    }
  }
  return {play,stop,state:()=>({...state}),clearError(){if(!run){state.error='';state.phase='idle';}},pause(){if(run){state.paused=true;wake?.();emit();}},resume(){if(run){state.paused=false;wake?.();emit();}},next(){if(run){state.skip=true;wake?.();emit();}},wake:()=>wake?.()};
}
