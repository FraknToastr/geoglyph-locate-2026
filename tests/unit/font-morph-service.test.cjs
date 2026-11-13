const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.resolve(__dirname, '../../src/scripts/font-service.js'), 'utf8');
const flush = () => new Promise(setImmediate);

function harness(behavior = () => 'ok', { constructorError = false } = {}) {
  const workers = [], created = [], revoked = [], timers = new Map(), posts = [];
  let timerId = 0;
  class Worker {
    constructor(url) {
      if (constructorError) throw Error('Worker creation refused');
      this.url = url; this.number = workers.length + 1; this.terminations = 0;
      workers.push(this);
    }
    postMessage(sent, transfers = []) {
      const delivered = structuredClone(sent, {transfer:transfers});
      const post = {worker:this.number, sent, delivered, transferCount:transfers.length};
      posts.push(post);
      const action = behavior(post, this);
      if (action === 'postthrow') throw Error('Transfer failed');
      const respond = this.onmessage, fail = this.onerror, decode = this.onmessageerror;
      this.saved = {respond,fail,decode};
      queueMicrotask(() => {
        if (action === 'stall') return;
        if (action === 'crash') return fail({message:'Morph fixture crash'});
        if (action === 'decode') return decode({});
        if (action === 'malformed') return respond({data:null});
        if (action === 'missing-result') return respond({data:{id:delivered.id}});
        if (action === 'content') return respond({data:{id:delivered.id,error:'Missing glyph in target font'}});
        if (action === 'old-id') respond({data:{id:delivered.id+999,result:{incorrect:true}}});
        respond({data:{id:delivered.id,result:delivered.type==='prepare'?{codes:[65]}:{ok:true,worker:this.number,type:delivered.type}}});
      });
    }
    terminate() { this.terminations++; }
  }
  const context = vm.createContext({Worker, Blob, performance, DOMException,
    URL:{createObjectURL() { const url='blob:morph-'+(created.length+1);created.push(url);return url; },revokeObjectURL:url=>revoked.push(url)},
    setTimeout(fn,delay) { const id=++timerId;timers.set(id,{fn,delay});return id; },clearTimeout:id=>timers.delete(id),
    document:{getElementById:()=>({textContent:'"source"'}),fonts:{add(){},delete(){}}}
  });
  vm.runInContext(source,context);
  return {service:context.GeoGlyphFontService,workers,created,revoked,timers,posts,
    record(name='font') { const bytes=new Uint8Array(16);bytes[0]=name.charCodeAt(0);return {id:name,fontResourceKey:name,arrayBuffer:bytes.buffer}; },
    timeout() { const entry=[...timers].find(([,timer])=>timer.delay===30000);assert.ok(entry,'a worker timeout exists');timers.delete(entry[0]);entry[1].fn(); }
  };
}

function trackedController() {
  const controller = new AbortController(), listeners = new Set(), signal=controller.signal;
  const add=signal.addEventListener.bind(signal), remove=signal.removeEventListener.bind(signal);
  signal.addEventListener=(type,listener,...rest)=>{ if(type==='abort')listeners.add(listener);return add(type,listener,...rest); };
  signal.removeEventListener=(type,listener,...rest)=>{ if(type==='abort')listeners.delete(listener);return remove(type,listener,...rest); };
  return {controller,signal,listeners};
}

function clean(h) {
  assert.equal(h.timers.size,0,'worker timeout released');
  assert.deepEqual(h.revoked,h.created,'all worker object URLs revoked');
  for(const worker of h.workers) {
    assert.equal(worker.terminations,1,'each dedicated worker terminated once');
    assert.equal(worker.onmessage,null);assert.equal(worker.onerror,null);assert.equal(worker.onmessageerror,null);
  }
}

test('dedicated preparation transfers copies and preserves retained font input bytes',async()=>{
  const h=harness(), a=h.record('a'), b=h.record('b'), {signal,listeners}=trackedController();
  const result=await h.service.morph(a,b,'A',{signal,tracking:4,lineHeight:1.25,resolution:256});
  assert.equal(result.type,'morph');assert.equal(h.workers.length,1);
  assert.deepEqual(h.posts.map(post=>post.delivered.type),['prepare','prepare','morph']);
  assert.equal(a.arrayBuffer.byteLength,16);assert.equal(b.arrayBuffer.byteLength,16);
  assert.equal(h.service.stats().retainedBytes,32);
  for(const post of h.posts.slice(0,2)) {
    assert.equal(post.transferCount,1);assert.equal(post.sent.payload.buffer.byteLength,0,'transferred copy detached');
    assert.equal(post.delivered.payload.buffer.byteLength,16);
  }
  const payload=h.posts[2].delivered.payload;
  assert.equal(payload.from,'a');assert.equal(payload.to,'b');assert.equal(payload.text,'A');
  assert.deepEqual(payload.options,{tracking:4,lineHeight:1.25,resolution:256});
  assert.equal(listeners.size,0);clean(h);h.service.dispose();
});

test('pre-aborted preparation creates no resources or workers',async()=>{
  const h=harness(),{controller,signal,listeners}=trackedController();controller.abort();
  await assert.rejects(h.service.morph(h.record('a'),h.record('b'),'A',{signal}),{name:'AbortError'});
  assert.equal(h.workers.length,0);assert.equal(h.service.stats().resources,0);assert.equal(listeners.size,0);clean(h);h.service.dispose();
});

test('aborting a pending font-file read settles immediately and never dispatches a late worker',async()=>{
  const h=harness(),{controller,signal,listeners}=trackedController();let release;
  const delayed={id:'delayed',fontResourceKey:'delayed',file:{arrayBuffer:()=>new Promise(resolve=>{release=resolve;})}};
  const request=h.service.morph(delayed,h.record('b'),'A',{signal});
  const rejected=assert.rejects(request,{name:'AbortError'});
  await flush();assert.equal(typeof release,'function');controller.abort();await rejected;
  assert.equal(listeners.size,0);clean(h);
  release(new ArrayBuffer(16));await flush();assert.equal(h.workers.length,0);h.service.dispose();
});

test('abort terminates the dedicated worker without resetting the shared mesh worker',async()=>{
  const h=harness(post=>post.delivered.type==='morph'?'stall':'ok');
  const a=h.record('a'),b=h.record('b');await h.service.prepare(a);
  const {controller,signal,listeners}=trackedController();const request=h.service.morph(a,b,'A',{signal});
  const rejected=assert.rejects(request,{name:'AbortError'});await flush();
  assert.equal(h.workers.length,2);controller.abort();await rejected;
  assert.equal(h.workers[0].terminations,0,'shared worker remains alive');assert.equal(h.workers[1].terminations,1);
  assert.equal((await h.service.model(a,'A')).worker,1,'next model reuses shared worker');
  assert.equal(listeners.size,0);assert.equal(h.timers.size,0);h.service.dispose();
  assert.deepEqual(h.revoked.slice().sort(),h.created.slice().sort());
});

for(const phase of ['prepare','morph']) test('dispose settles and terminates a stalled '+phase+' request',async()=>{
  const h=harness(post=>post.delivered.type===phase?'stall':'ok');
  const {signal,listeners}=trackedController();const request=h.service.morph(h.record('a'),h.record('b'),'A',{signal});
  const rejected=assert.rejects(request,/disposed/);await flush();h.service.dispose();await rejected;
  assert.equal(listeners.size,0);assert.equal(h.service.stats().resources,0);clean(h);
});

test('dispose during a byte read cancels the job before a worker exists',async()=>{
  const h=harness();let release;
  const delayed={id:'delayed',fontResourceKey:'delayed',file:{arrayBuffer:()=>new Promise(resolve=>{release=resolve;})}};
  const request=h.service.morph(delayed,h.record('b'),'A');const rejected=assert.rejects(request,/disposed/);
  await flush();h.service.dispose();await rejected;clean(h);
  release(new ArrayBuffer(16));await flush();assert.equal(h.workers.length,0);assert.equal(h.service.stats().resources,0);
});

for(const failure of ['crash','decode','malformed','missing-result','content','postthrow']) test(failure+' releases the dedicated worker without retrying',async()=>{
  const h=harness(post=>post.delivered.type==='morph'?failure:'ok');
  const {signal,listeners}=trackedController();
  await assert.rejects(h.service.morph(h.record('a'),h.record('b'),'A',{signal}),/fixture crash|could not be read|invalid message|Missing glyph|Transfer failed/);
  assert.equal(h.workers.length,1);assert.equal(h.posts.length,3);assert.equal(listeners.size,0);clean(h);h.service.dispose();
});

test('timeout rejects once, clears the worker, and permits another preparation',async()=>{
  let stalled=true;const h=harness(post=>post.delivered.type==='morph'&&stalled?'stall':'ok');
  const a=h.record('a'),b=h.record('b'),request=h.service.morph(a,b,'A');const rejected=assert.rejects(request,/timed out/);
  await flush();h.timeout();await rejected;assert.equal(h.workers[0].terminations,1);assert.equal(h.timers.size,0);
  stalled=false;assert.equal((await h.service.morph(a,b,'A')).worker,2);clean(h);h.service.dispose();
});

test('worker constructor failures revoke the allocated URL',async()=>{
  const h=harness(undefined,{constructorError:true});
  await assert.rejects(h.service.morph(h.record('a'),h.record('b'),'A'),/creation refused/);
  assert.equal(h.workers.length,0);clean(h);h.service.dispose();
});

test('out-of-order response IDs cannot resolve a different morph request',async()=>{
  const h=harness(()=> 'old-id');
  assert.equal((await h.service.morph(h.record('a'),h.record('b'),'A')).ok,true);clean(h);h.service.dispose();
});
