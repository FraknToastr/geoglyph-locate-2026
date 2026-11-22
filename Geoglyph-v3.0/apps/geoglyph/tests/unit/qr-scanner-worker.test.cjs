const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'src/scripts/qr-scanner-service.js'),'utf8');
function harness(fallback=async bitmap=>[{rawValue:'fallback',format:'qr_code'}]){
  const workers=[],revoked=[],timers=new Map(),bitmap={width:2,height:2,closed:false};let timerId=0;
  class Worker{
    constructor(){workers.push(this);}
    postMessage(message,transfers){this.message=structuredClone(message,{transfer:transfers});this.detached=transfers[0].byteLength===0;}
    terminate(){this.terminated=true;}
    respond(data){this.onmessage?.({data});}
  }
  const c=vm.createContext({Worker,OffscreenCanvas:class{},Blob,URL:{createObjectURL:()=>`blob:${workers.length}`,revokeObjectURL:url=>revoked.push(url)},
    document:{getElementById:()=>({textContent:'"worker"'}),createElement:()=>({getContext:()=>({drawImage(image){assert.equal(image,bitmap);assert.equal(image.closed,false);},getImageData:()=>({width:2,height:2,data:new Uint8ClampedArray(16)})})})},
    setTimeout:callback=>{const id=++timerId;timers.set(id,callback);return id;},clearTimeout:id=>timers.delete(id)});
  vm.runInContext(source,c);
  return {scanner:c.GeoGlyphQrScanner.create(fallback),workers,revoked,timers,bitmap,c};
}
test('worker receives only fresh transferred pixels and returns ordered detections',async()=>{
  const h=harness(),job=h.scanner.detect(h.bitmap),worker=h.workers[0];
  assert.equal(worker.detached,true);assert.equal(worker.message.buffer.byteLength,16);assert.equal(h.bitmap.closed,false);
  const codes=[{rawValue:'first',format:'qr_code'},{rawValue:'second',format:'qr_code'}];
  worker.respond({id:worker.message.id,result:codes});assert.deepEqual(await job,codes);
  assert.equal(h.scanner.stats().workerJobs,1);assert.equal(h.timers.size,0);h.scanner.dispose();
});
test('worker failure retains original bitmap for exact fallback and replaces worker on next job',async()=>{
  let calls=0;const h=harness(async bitmap=>{calls++;assert.equal(bitmap,h.bitmap);assert.equal(bitmap.closed,false);return [];});
  const job=h.scanner.detect(h.bitmap);h.workers[0].onerror();assert.deepEqual(await job,[]);
  assert.equal(calls,1);assert.equal(h.revoked.length,1);assert.equal(h.workers[0].terminated,true);
  const next=h.scanner.detect(h.bitmap),worker=h.workers[1];worker.respond({id:worker.message.id,result:[]});await next;
  assert.equal(h.scanner.stats().workerJobs,1);h.scanner.dispose();
});
test('malformed worker results and timeouts fall back and settle their timers',async()=>{
  const h=harness();const invalid=h.scanner.detect(h.bitmap),worker=h.workers[0];
  worker.respond({id:worker.message.id,result:[null]});assert.equal((await invalid)[0].rawValue,'fallback');
  const timeout=h.scanner.detect(h.bitmap);[...h.timers.values()][0]();assert.equal((await timeout)[0].rawValue,'fallback');
  assert.equal(h.scanner.stats().pending,0);assert.equal(h.timers.size,0);h.scanner.dispose();
});
test('cancel terminates active decode, rejects once without fallback, ignores late messages and permits return',async()=>{
  let calls=0;const h=harness(async()=>{calls++;return [];});
  const job=h.scanner.detect(h.bitmap),old=h.workers[0],late=old.onmessage;
  const cancelled=assert.rejects(job,{name:'AbortError'});h.scanner.cancel();await cancelled;
  late({data:{id:old.message.id,result:[]}});assert.equal(calls,0);assert.equal(h.scanner.stats().workerJobs,0);
  assert.equal(h.scanner.stats().pending,0);assert.equal(h.timers.size,0);assert.equal(old.terminated,true);
  const next=h.scanner.detect(h.bitmap),worker=h.workers[1];worker.respond({id:worker.message.id,result:[]});await next;
  assert.equal(h.scanner.stats().workerJobs,1);h.scanner.dispose();
});
test('cancellation during asynchronous compatibility fallback rejects its late result',async()=>{
  let finish;const h=harness(()=>new Promise(resolve=>{finish=resolve;}));
  const job=h.scanner.detect(h.bitmap);h.workers[0].onerror();await Promise.resolve();
  const cancelled=assert.rejects(job,{name:'AbortError'});h.scanner.cancel();finish([]);await cancelled;
});
test('unsupported workers preserve the original full-resolution decoder',async()=>{
  const h=harness();h.c.OffscreenCanvas=undefined;
  assert.equal((await h.scanner.detect(h.bitmap))[0].rawValue,'fallback');assert.equal(h.workers.length,0);
});
test('failed worker construction revokes its object URL before compatibility fallback',async()=>{
  const h=harness();h.c.Worker=class{constructor(){throw Error('Worker blocked');}};
  assert.equal((await h.scanner.detect(h.bitmap))[0].rawValue,'fallback');
  assert.equal(h.revoked.length,1);assert.equal(h.scanner.stats().pending,0);
});

test('pagehide during bitmap acquisition closes the stale bitmap and skips worker dispatch',async()=>{
  const core=fs.readFileSync(path.join(root,'src/scripts/core.js'),'utf8');
  const lifecycle=core.slice(core.indexOf('  let qreverseScanGeneration=0;'),core.indexOf('  async function initialiseQReverseScanner('));
  const scan=core.slice(core.indexOf('  async function scanQReverseQueue('),core.indexOf('  function resetSelectedQReverseRows('));
  let pagehide,finish,detects=0,closed=0;
  const row={source:'Image',status:'Queued',file:{},filename:'fixture',value:''};
  const state={qreverse:{rows:[row],scanner:{detect(){detects++;},cancel(){}},scanning:false}};
  const c=vm.createContext({state,window:{addEventListener:(name,callback)=>{assert.equal(name,'pagehide');pagehide=callback;}},
    isQReverseBusy:()=>state.qreverse.scanning,renderQReverse(){},setQReverseProgress(){},showToast(){},
    createImageBitmap:()=>new Promise(resolve=>{finish=resolve;})});
  vm.runInContext(lifecycle+scan,c);
  const job=c.scanQReverseQueue();assert.equal(row.status,'Scanning');
  pagehide();assert.equal(state.qreverse.scanning,false);assert.equal(row.status,'Queued');
  finish({close(){closed++;}});await job;
  assert.equal(detects,0);assert.equal(closed,1);assert.equal(row.value,'');
});

test('worker keeps full resolution, 25-pass cap, detection order and identical mask rectangles',async()=>{
  const workerSource=fs.readFileSync(path.join(root,'src/workers/qr-scanner-worker.js'),'utf8');
  const core=fs.readFileSync(path.join(root,'src/scripts/core.js'),'utf8');
  const original=core.slice(core.indexOf('  async function detectQReverseWithJsQr('),core.indexOf('  async function scanQReverseQueue('));
  const location={topLeftCorner:{x:8.3,y:6.4},topRightCorner:{x:31.7,y:7.1},bottomRightCorner:{x:34,y:25.6},bottomLeftCorner:{x:7,y:27.1}};
  function context(worker){
    const masks=[];let passes=0,result;
    const draw={drawImage(){},putImageData(){},getImageData:()=>({data:new Uint8ClampedArray(64*48*4),width:64,height:48}),fillRect:(...args)=>masks.push(args)};
    const canvas={getContext:()=>draw};
    const decode=(data,width,height,options)=>{assert.equal(width,64);assert.equal(height,48);assert.equal(options.inversionAttempts,'attemptBoth');return {data:String(++passes),location};};
    const c=vm.createContext({self:null,window:{jsQR:decode},jsQR:decode,Uint8ClampedArray,ImageData:class{},OffscreenCanvas:class{constructor(width,height){assert.equal(width,64);assert.equal(height,48);}getContext(){return draw;}},
      document:{createElement:()=>canvas},setTimeout:callback=>callback(),postMessage:message=>{result=message;}});c.self=c;
    vm.runInContext(worker?workerSource:original,c);
    return {c,masks,result:()=>result,passes:()=>passes};
  }
  const a=context(false),b=context(true);
  const before=await a.c.detectQReverseWithJsQr({width:64,height:48});
  b.c.onmessage({data:{id:1,width:64,height:48,buffer:new ArrayBuffer(64*48*4)}});
  assert.equal(a.passes(),25);assert.equal(b.passes(),25);
  assert.equal(JSON.stringify(before),JSON.stringify(b.result().result));assert.deepEqual(a.masks,b.masks);
});
