const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const Module=require('node:module');
const {buildSync}=require('esbuild');

const filename=path.resolve(__dirname,'ground-model-cache.bundle.cjs');
const compiled=new Module(filename,module);
compiled._compile(buildSync({
  entryPoints:[path.resolve(__dirname,'../../src/scripts/ground-model-cache.js')],
  bundle:true,format:'cjs',platform:'node',write:false
}).outputFiles[0].text,filename);
const {createGroundModelCache}=compiled.exports;
const MiB=1024*1024;

function model(key){
  return {renderKey:key,polygons:[],vertices:4,bounds:{minX:0,maxX:1,minY:0,maxY:1,width:1,height:1}};
}

function mesh(bytes=144){
  return {
    position:new Float32Array([0,0,0,1,0,0,0,1,0]),
    normal:new Float32Array([0,0,1,0,0,1,0,0,1]),
    outline:new Float32Array([0,0,0,1,0,0]),
    groups:[],bounds:{minX:0,maxX:1,minY:0,maxY:1,minZ:0,maxZ:1},bytes
  };
}

function disposed(item){
  const count={geometry:0,outline:0};
  item.geometry.addEventListener('dispose',()=>count.geometry++);
  item.lineGeometry.addEventListener('dispose',()=>count.outline++);
  return count;
}

test('a prepared model can be reused without rebuilding its mesh or GPU geometry',async()=>{
  let builds=0;
  const cache=createGroundModelCache(async()=>{builds++;return mesh();});
  const first=await cache.prepare(model('first'));
  cache.activate(first);
  const again=await cache.prepare(model('first'));
  assert.equal(again,first);
  assert.equal(again.geometry,first.geometry);
  assert.equal(again.lineGeometry,first.lineGeometry);
  assert.equal(builds,1);
  assert.equal(cache.stats().entries,1);
  assert.equal(cache.stats().hits,1);
  assert.equal(cache.stats().pending,0);
  assert.ok(cache.stats().bytes>first.mesh.bytes);
  cache.clear();
});

test('the three-entry LRU evicts unused geometry while protecting the displayed model',async()=>{
  const cache=createGroundModelCache(async()=>mesh());
  const active=await cache.prepare(model('active'));
  cache.activate(active);
  const old=await cache.prepare(model('old'));
  const recent=await cache.prepare(model('recent'));
  const activeDisposed=disposed(active),oldDisposed=disposed(old),recentDisposed=disposed(recent);
  assert.equal(cache.get('old'),old);
  const next=await cache.prepare(model('next'));
  assert.equal(cache.stats().entries,3);
  assert.equal(cache.stats().evictions,1);
  assert.equal(cache.get('recent'),null);
  assert.equal(cache.get('active'),active);
  assert.equal(cache.get('old'),old);
  assert.equal(cache.get('next'),next);
  assert.deepEqual(recentDisposed,{geometry:1,outline:1});
  assert.deepEqual(activeDisposed,{geometry:0,outline:0});
  assert.deepEqual(oldDisposed,{geometry:0,outline:0});
  cache.clear();
});

test('the byte budget evicts inactive models before reaching the entry-count limit',async()=>{
  const cache=createGroundModelCache(async()=>mesh(12*MiB));
  const first=await cache.prepare(model('first'));
  const firstDisposed=disposed(first);
  await cache.prepare(model('second'));
  await cache.prepare(model('third'));
  assert.equal(cache.stats().entries,2);
  assert.ok(cache.stats().bytes<=32*MiB);
  assert.equal(cache.stats().evictions,1);
  assert.equal(cache.get('first'),null);
  assert.deepEqual(firstDisposed,{geometry:1,outline:1});
  cache.clear();
});

test('a new model that cannot coexist with the displayed model is rejected without evicting it',async()=>{
  const cache=createGroundModelCache(async()=>mesh(17*MiB));
  const active=await cache.prepare(model('active'));
  cache.activate(active);
  const count=disposed(active),before=cache.stats().bytes;
  await assert.rejects(cache.prepare(model('too-large-together')),/32 MiB/);
  assert.equal(cache.get('active'),active);
  assert.equal(cache.get('too-large-together'),null);
  assert.equal(cache.stats().bytes,before);
  assert.equal(cache.stats().entries,1);
  assert.equal(cache.stats().pending,0);
  assert.deepEqual(count,{geometry:0,outline:0});
  cache.clear();
});

test('a single oversized prepared model is rejected and does not occupy the cache',async()=>{
  const cache=createGroundModelCache(async()=>mesh(33*MiB));
  await assert.rejects(cache.prepare(model('oversized')),/32 MiB/);
  assert.equal(cache.stats().entries,0);
  assert.equal(cache.stats().bytes,0);
  assert.equal(cache.stats().pending,0);
});

test('concurrent requests for one model share the build and prepared geometry',async()=>{
  let release,builds=0;
  const cache=createGroundModelCache(()=>{builds++;return new Promise(resolve=>{release=resolve;});});
  const first=cache.prepare(model('same')),second=cache.prepare(model('same'));
  assert.equal(builds,1);
  assert.equal(cache.stats().pending,1);
  release(mesh());
  const [a,b]=await Promise.all([first,second]);
  assert.equal(a,b);
  assert.equal(a.geometry,b.geometry);
  assert.equal(cache.stats().entries,1);
  assert.equal(cache.stats().pending,0);
  cache.clear();
});

test('clear disposes retained geometry and cancels old jobs without removing a new same-key job',async()=>{
  const releases=[];
  const cache=createGroundModelCache(key=>key==='delayed'?new Promise(resolve=>releases.push(resolve)):Promise.resolve(mesh()));
  const first=await cache.prepare(model('first'));
  cache.activate(first);
  const second=await cache.prepare(model('second'));
  const firstDisposed=disposed(first),secondDisposed=disposed(second);
  const oldJob=cache.prepare(model('delayed'));
  const cancelled=assert.rejects(oldJob,/cancelled/i);
  cache.clear();
  assert.equal(cache.stats().entries,0);
  assert.equal(cache.stats().bytes,0);
  assert.equal(cache.stats().pending,0);
  assert.deepEqual(firstDisposed,{geometry:1,outline:1});
  assert.deepEqual(secondDisposed,{geometry:1,outline:1});
  const newJob=cache.prepare(model('delayed'));
  releases[0](mesh());
  await cancelled;
  assert.equal(cache.stats().pending,1);
  assert.equal(cache.stats().entries,0);
  releases[1](mesh());
  const replacement=await newJob;
  assert.equal(cache.get('delayed'),replacement);
  assert.equal(cache.stats().pending,0);
  cache.clear();
  assert.deepEqual(firstDisposed,{geometry:1,outline:1});
  assert.deepEqual(secondDisposed,{geometry:1,outline:1});
});
