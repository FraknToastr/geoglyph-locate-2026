(function (root) {
  'use strict';
  function create(fallback) {
    let worker=null,url='',generation=0,cancellation=0,sequence=0,pending=null;
    const counters={jobs:0,workerJobs:0,fallbacks:0,cancellations:0};
    function reset(error) {
      generation++;
      if(worker){worker.onmessage=worker.onerror=worker.onmessageerror=null;worker.terminate();worker=null;}
      if(url){URL.revokeObjectURL(url);url='';}
      if(pending){const job=pending;pending=null;clearTimeout(job.timer);job.reject(error);}
    }
    function cancel() {
      cancellation++;
      counters.cancellations++;
      const error=Error('QR scan cancelled');error.name='AbortError';reset(error);
    }
    function ensureWorker() {
      if(worker)return worker;
      const source=document.getElementById('geoglyph-qr-worker-source');
      if(!root.Worker||!root.OffscreenCanvas||!source)throw Error('QR worker unavailable');
      url=URL.createObjectURL(new Blob([JSON.parse(source.textContent)],{type:'text/javascript'}));
      let target;
      try{target=worker=new Worker(url);}catch(error){reset(error);throw error;}
      const epoch=generation;
      const current=()=>target===worker&&epoch===generation;
      target.onmessage=event=>{
        if(!current())return;
        const message=event.data,job=pending;
        if(!job||message?.id!==job.id)return;
        if(message.error){reset(Error(message.error));return;}
        if(!Array.isArray(message.result)||message.result.some(code=>!code||typeof code.rawValue!=='string'||code.format!=='qr_code')){reset(Error('Invalid QR worker response'));return;}
        pending=null;clearTimeout(job.timer);counters.workerJobs++;job.resolve(message.result);
      };
      target.onerror=()=>{if(current())reset(Error('QR worker failed'));};
      target.onmessageerror=()=>{if(current())reset(Error('QR worker message failed'));};
      return target;
    }
    async function detect(bitmap) {
      if(pending)throw Error('QR scan already running');
      const epoch=cancellation;counters.jobs++;
      try {
        const target=ensureWorker();
        // Transfer a fresh pixel buffer, retaining caller ownership of bitmap for
        // cleanup and a full-resolution fallback if worker startup/execution fails.
        const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
        const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(bitmap,0,0);
        const image=context.getImageData(0,0,canvas.width,canvas.height);
        canvas.width=canvas.height=0;
        return await new Promise((resolve,reject)=>{
          const id=++sequence;
          const timer=setTimeout(()=>reset(Error('QR worker timed out')),120000);
          pending={id,resolve,reject,timer};
          try{target.postMessage({id,width:image.width,height:image.height,buffer:image.data.buffer},[image.data.buffer]);}
          catch(error){reset(error);}
        });
      } catch(error) {
        if(error.name==='AbortError'||epoch!==cancellation){const aborted=Error('QR scan cancelled');aborted.name='AbortError';throw aborted;}
        counters.fallbacks++;
        const result=await fallback(bitmap);
        if(epoch!==cancellation){const aborted=Error('QR scan cancelled');aborted.name='AbortError';throw aborted;}
        return result;
      }
    }
    return {detect,cancel,dispose:cancel,stats:()=>({...counters,pending:pending?1:0})};
  }
  root.GeoGlyphQrScanner=Object.freeze({create});
})(globalThis);
