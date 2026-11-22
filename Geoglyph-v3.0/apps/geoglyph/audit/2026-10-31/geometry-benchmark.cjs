#!/usr/bin/env node
// Audit-only source CPU benchmark. Run from conference root:
// rtk proxy node --expose-gc audit/2026-10-31/geometry-benchmark.cjs
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),os=require('node:os'),crypto=require('node:crypto'),Module=require('node:module');
const {performance}=require('node:perf_hooks');
const root=path.resolve(process.argv[2]||process.cwd()),out=path.resolve(process.argv[3]||path.join(__dirname,'geometry-results.json'));
const req=Module.createRequire(path.join(root,'package.json')),ot=req('./src/vendor/opentype.js');
globalThis.polygonClipping=req('./src/vendor/polygon-clipping.js');
const geom=req('./src/scripts/ground-geometry.js'),esbuild=req('esbuild');
function loadModule(entry){const m=new Module(path.join(root,'audit-virtual.cjs'),module);m.filename=path.join(root,'audit-virtual.cjs');m.paths=Module._nodeModulePaths(root);m._compile(esbuild.buildSync({absWorkingDir:root,entryPoints:[entry],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text,m.filename);return m.exports;}
const extrusion=loadModule('src/workers/extrusion-entry.js'),{createGroundModelCache}=loadModule('src/scripts/ground-model-cache.js');
const fonts=JSON.parse(fs.readFileSync(path.join(root,'src/fonts/manifest.json'),'utf8')).filter(x=>!x.emoji).map(x=>{const b=fs.readFileSync(path.join(root,x.file));return {...x,buffer:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)};});
const options={tracking:0,lineHeight:1.15,quality:10,symbol:false,tolerance:2/11};
const cases=[{name:'short',text:'GeoGlyph'},{name:'normal-multiline',text:'GeoGlyph\nLocate 2026'},{name:'heavy-update',text:'GEOGLYPH LIVE VISUALISATION '.repeat(8).trim()}];
function quantile(s,p){return s[Math.min(s.length-1,Math.max(0,Math.ceil(s.length*p)-1))];}
function summary(a){const s=a.slice().sort((a,b)=>a-b);return {n:a.length,meanMs:a.reduce((s,x)=>s+x,0)/a.length,medianMs:quantile(s,.5),p95Ms:quantile(s,.95),p99Ms:quantile(s,.99),minMs:s[0],maxMs:s.at(-1)};}
function timed(fn){const t=performance.now(),value=fn();return {ms:performance.now()-t,value};}
function measure(fn,n,warm=0){for(let i=0;i<warm;i++)fn();const samples=[];let value;for(let i=0;i<n;i++){const t=timed(fn);samples.push(t.ms);value=t.value;}return {summary:summary(samples),samplesMs:samples,value};}
const rows=[],started=new Date().toISOString(),startTime=performance.now(),startCPU=process.cpuUsage();
for(const f of fonts){
 const parse=measure(()=>ot.parse(f.buffer.slice(0),{lowMemory:true}),20,3);
 for(const c of cases){
  const row={font:f.key,scenario:c.name,characters:[...c.text].length,utf8Bytes:Buffer.byteLength(c.text),parse:parse.summary};
  try{
   const cold=[];let model;
   for(let i=0;i<12;i++){const font=ot.parse(f.buffer.slice(0),{lowMemory:true});const t=timed(()=>geom.model(font,c.text,options));cold.push(t.ms);model=t.value;}
   row.coldModel=summary(cold);
   const font=ot.parse(f.buffer.slice(0),{lowMemory:true}),warm=measure(()=>geom.model(font,c.text,options),50,5);model=warm.value;
   row.warmGlyphCacheModel=warm.summary;
   row.model={vertices:model.vertices,polygons:model.polygons.length,missing:model.missing.length,estimatedWorkerCacheBytes:Math.max(128,model.vertices*24),glyphCache:geom.cacheStats(font)};
   row.modelStructuredClone=measure(()=>structuredClone(model),50,5).summary;
   const mesh=measure(()=>extrusion.build(model),20,3);row.meshBuild=mesh.summary;
   row.mesh={bytes:mesh.value.bytes,positionBytes:mesh.value.position.byteLength,normalBytes:mesh.value.normal.byteLength,outlineBytes:mesh.value.outline.byteLength,triangles:mesh.value.position.length/9,groups:mesh.value.groups.length,nonemptyGroups:mesh.value.groups.filter(x=>x.count>0).length,predictedSolidDrawCallsWithOutline:mesh.value.groups.filter(x=>x.count>0).length+1};
   row.meshStructuredClone=measure(()=>structuredClone(mesh.value),50,5).summary;
  }catch(e){row.error=e.message;}
  rows.push(row);process.stdout.write(JSON.stringify({font:f.key,scenario:c.name,coldModel:row.coldModel?.medianMs,meshBuild:row.meshBuild?.medianMs,groups:row.mesh?.groups,error:row.error})+'\n');
 }
}
// Actual classic worker protocol in VM; explicit cloning in both directions.
// This measures CPU/copy costs, not browser worker scheduling.
function workerHarness(){
 let response,seq=0,parseCalls=0;
 const context={console,postMessage:x=>{response=structuredClone(x);}};context.self=context;vm.createContext(context);
 for(const name of ['src/vendor/opentype.js','src/vendor/polygon-clipping.js','src/scripts/ground-geometry.js','src/vendor/extrusion-worker.js','src/workers/font-geometry-worker.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
 const original=context.opentype.parse;context.opentype.parse=function(...a){parseCalls++;return original(...a);};
 function request(type,payload){response=null;context.onmessage({data:structuredClone({id:++seq,type,payload})});if(response.error)throw Error(response.error);return response.result;}
 return {request,parseCalls:()=>parseCalls};
}
const worker=workerHarness();for(const f of fonts)worker.request('prepare',{key:f.key,buffer:f.buffer});
const preparationState={...worker.request('stats',{}),parseCalls:worker.parseCalls(),allFiveFontSourceBytes:fonts.reduce((s,f)=>s+f.buffer.byteLength,0)},cycleSamples=[],cycleErrors=[];let evictedRetries=0;
for(let i=0;i<50;i++){
 const f=fonts[i%fonts.length],t=performance.now();
 try{try{worker.request('model',{key:f.key,text:cases[0].text,options});}catch(e){if(e.message!=='FONT_EVICTED')throw e;evictedRetries++;worker.request('prepare',{key:f.key,buffer:f.buffer});worker.request('model',{key:f.key,text:cases[0].text,options});}cycleSamples.push(performance.now()-t);}catch(e){cycleErrors.push({font:f.key,error:e.message});}
}
const cycling={requests:50,evictedRetries,parseCalls:worker.parseCalls(),before:preparationState,after:worker.request('stats',{}),successfulRequestLatency:cycleSamples.length?summary(cycleSamples):null,errors:cycleErrors};
const single=workerHarness(),f=fonts[0];single.request('prepare',{key:f.key,buffer:f.buffer});
let singleModel=single.request('model',{key:f.key,text:cases[1].text,options});singleModel.renderKey='normal';single.request('mesh',{key:singleModel.renderKey,model:singleModel});
const repeatedModel=measure(()=>single.request('model',{key:f.key,text:cases[1].text,options}),100,10),repeatedMesh=measure(()=>single.request('mesh',{key:singleModel.renderKey,model:singleModel}),100,10);
let builds=0;const cache=createGroundModelCache(async(key,m)=>{builds++;return single.request('mesh',{key,model:m});});
(async()=>{
 const a=await cache.prepare(singleModel);cache.activate(a);const hitTimes=[];for(let i=0;i<1000;i++){const t=performance.now();await cache.prepare(singleModel);hitTimes.push(performance.now()-t);}const cacheReuse={lookup:summary(hitTimes),workerBuildRequests:builds,stats:cache.stats()};cache.clear();
 const stressFont=ot.parse(fonts[0].buffer.slice(0),{lowMemory:true}),thousand=timed(()=>geom.model(stressFont,'A'.repeat(1000),options)),thousandMesh=timed(()=>extrusion.build(thousand.value));
 const thousandGlyphs={characters:1000,modelMs:thousand.ms,meshMs:thousandMesh.ms,vertices:thousand.value.vertices,polygons:thousand.value.polygons.length,bytes:thousandMesh.value.bytes,groups:thousandMesh.value.groups.length,triangles:thousandMesh.value.position.length/9,predictedSolidDrawCallsWithOutline:thousandMesh.value.groups.filter(g=>g.count>0).length+1};
 const memory=[],stress=workerHarness();stress.request('prepare',{key:fonts[0].key,buffer:fonts[0].buffer});
 function sample(label){global.gc?.();memory.push({label,processMemory:process.memoryUsage(),worker:stress.request('stats',{})});}
 sample('before');const updateTimes=[];
 for(let i=0;i<600;i++){const t=performance.now(),text='GEOGLYPH LIVE VISUALISATION '+String(i).padStart(4,'0')+' '+('A B C D E F G H I J '.repeat(4));const m=stress.request('model',{key:fonts[0].key,text,options}),key=JSON.stringify([fonts[0].key,text,options]);stress.request('mesh',{key,model:m});updateTimes.push(performance.now()-t);if((i+1)%100===0)sample('after-'+(i+1));}
 const cpu=process.cpuUsage(startCPU);
 const result={generatedAt:started,completedAt:new Date().toISOString(),root,environment:{node:process.version,platform:process.platform,arch:process.arch,kernel:os.release(),logicalCpus:os.cpus().length,cpu:os.cpus()[0]?.model,totalMemory:os.totalmem(),exposedGC:typeof global.gc==='function'},methodology:{clock:'node:perf_hooks.performance.now',percentiles:'nearest rank; short sample tails do not estimate browser p99',coldModel:'fresh parsed font per sample; parse time excluded',warmGlyphCacheModel:'same font; glyph outline cache warm; complete text model still regenerated',worker:'unmodified classic worker protocol in Node VM with structuredClone both directions; no browser threading, GPU, frame or DOM measurement',execution:'shared WSL host, no exclusive CPU reservation',options,scenarios:cases,sampleCounts:{parse:{warmup:3,samples:20},coldModel:12,warmGlyphCacheModel:{warmup:5,samples:50},meshBuild:{warmup:3,samples:20},clone:{warmup:5,samples:50},warmWorker:{warmup:10,samples:100},mainCacheHits:1000}},rows,cycling,repeatedWorker:{model:repeatedModel.summary,mesh:repeatedMesh.summary,stats:single.request('stats',{})},mainCacheReuse:cacheReuse,thousandGlyphs,continuousCPUUpdateProbe:{updates:600,totalLatency:summary(updateTimes),memory,warning:'Short CPU/cache probe, not 60–120 minute browser soak. Process memory includes other benchmark objects and VM runtime; worker byte counters estimate retained payloads, not GPU or true JS heap.'},processTotals:{wallMs:performance.now()-startTime,userCPUms:cpu.user/1000,systemCPUms:cpu.system/1000},sourceHashes:Object.fromEntries(['src/scripts/ground-geometry.js','src/scripts/ground-model-cache.js','src/workers/font-geometry-worker.js','src/workers/extrusion-entry.js','src/vendor/extrusion-worker.js'].map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,n))).digest('hex')]))};
 fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');process.stdout.write(JSON.stringify({output:out,wallMs:result.processTotals.wallMs,cycling:result.cycling,thousandGlyphs,cacheReuse,stressLatency:result.continuousCPUUpdateProbe.totalLatency})+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
