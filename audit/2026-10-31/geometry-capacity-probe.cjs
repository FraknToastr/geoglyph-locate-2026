#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),{performance}=require('node:perf_hooks');
const root=path.resolve(process.argv[2]||process.cwd()),req=Module.createRequire(path.join(root,'package.json')),esbuild=req('esbuild');
function load(entry){const name=path.join(root,'audit-virtual.cjs'),m=new Module(name,module);m._compile(esbuild.buildSync({absWorkingDir:root,entryPoints:[entry],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text,name);return m.exports;}
const ot=req('./src/vendor/opentype.js');globalThis.polygonClipping=req('./src/vendor/polygon-clipping.js');const geom=req('./src/scripts/ground-geometry.js'),mesh=load('src/workers/extrusion-entry.js'),{createGroundModelCache}=load('src/scripts/ground-model-cache.js');
const b=fs.readFileSync(path.join(root,'src/fonts/MAGNETOB.TTF')),font=ot.parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),{lowMemory:true}),phrase='GEOGLYPH LIVE VISUALISATION '.repeat(8).trim();
const models=[phrase,phrase+' 1'].map((text,i)=>{const model=geom.model(font,text,{tracking:0,lineHeight:1.15,quality:10,symbol:false,tolerance:2/11});model.renderKey='probe-'+i;return {text,model};});
const meshes=models.map(x=>mesh.build(x.model)),cache=createGroundModelCache(async(key)=>meshes[Number(key.split('-')[1])]);
(async()=>{
 const first=await cache.prepare(models[0].model);cache.activate(first);let disposed=0;first.geometry.addEventListener('dispose',()=>disposed++);let rejected;
 try{await cache.prepare(models[1].model);}catch(e){rejected=e.message;}
 const preserved=cache.get(models[0].model.renderKey)===first,afterReject=cache.stats(),fresh=createGroundModelCache(async()=>meshes[1]);let freshAccepted=false;try{const item=await fresh.prepare(models[1].model);freshAccepted=!!item;}catch(_){}
 const result={font:'Magneto',source:'actual geometry/extrusion/main cache modules',budgetBytes:32*1024*1024,models:models.map((x,i)=>({characters:x.text.length,vertices:x.model.vertices,meshBytes:meshes[i].bytes,outlineBytes:meshes[i].outline.byteLength,retainedBudgetBytes:meshes[i].bytes+meshes[i].outline.byteLength+x.model.vertices*16,groups:meshes[i].groups.length})),rejection:rejected,previousDisplayGeometryPreserved:preserved,activeGeometryDisposalsDuringRejection:disposed,secondAcceptedInFreshCache:freshAccepted,afterReject};
 cache.clear();fresh.clear();fs.writeFileSync(path.join(__dirname,'geometry-capacity-probe.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1;});
