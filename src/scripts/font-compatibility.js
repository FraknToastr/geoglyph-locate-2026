(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GeoGlyphFontCompatibility=api;})(globalThis,function(){
'use strict';
const STORAGE_KEY='geoglyph-locate2026.3d-font-results',VERSION=1;
const definitive=value=>value==='compatible'||value==='incompatible';
const normal=value=>String(value||'').trim().replace(/\s+/g,' ').toLowerCase();
// Only source metadata is inspected here. Restoring a scan must not read font files.
function identity(record,resourceKey){
  const ref=record.geoGlyphRef||record,file=record.file||ref.file,buffer=record.arrayBuffer||ref.arrayBuffer;
  const descriptor=record.localDescriptor||record.metadata||ref.metadata;
  if(file)return JSON.stringify(['file',resourceKey,file.webkitRelativePath||file.name,file.size,file.lastModified||0]);
  if(buffer)return JSON.stringify(['buffer',resourceKey,buffer.byteLength]);
  if(descriptor?.postscriptName)return JSON.stringify(['local',normal(descriptor.postscriptName),normal(descriptor.style||'Regular')]);
  return JSON.stringify(['face',resourceKey,normal(record.style||ref.style||'Regular')]);
}
function probeCodes(codes){
  const result=[],add=code=>{
    if(result.length>=8||result.includes(code)||!Number.isInteger(code)||code<0||code>0x10FFFF)return;
    if(!/[\p{Cc}\p{Cf}\p{Cs}\p{Cn}\p{Z}\p{M}]/u.test(String.fromCodePoint(code)))result.push(code);
  };
  for(const code of [65,97,77,48])if(codes.includes(code))add(code);
  for(const code of codes){add(code);if(result.length===8)break;}
  return result;
}
async function probe({record},current,{service,prefersBrowser=()=>false}){
  const metadata=await service.prepare(record,{priority:10,retry:true});
  if(!current())return 'unverified';
  if(record.hasColor)return 'incompatible';
  // Fixed probe settings deliberately exclude the displayed message, size and quality.
  const options={tracking:0,lineHeight:1.15,quality:10,symbol:true,tolerance:2/11};
  for(const code of probeCodes(metadata.codes||[])){
    if(!current())return 'unverified';
    const text=String.fromCodePoint(code);if(prefersBrowser(record,text))continue;
    try{
      const model=await service.model(record,text,options);
      if(!current())return 'unverified';
      if(record.hasColor)return 'incompatible';
      if(model.missing.length||!model.polygons.length||!model.bounds.height)continue;
      const key=JSON.stringify([service.keyFor(record),text,options]),mesh=await service.mesh(key,model);
      if(!current())return 'unverified';
      const bytes=mesh.bytes+mesh.outline.byteLength+(model.vertices||0)*16;
      if(mesh.position?.length&&bytes<=32*1024*1024)return 'compatible';
    }catch(error){if(error.workerFailure||!current())return 'unverified';}
    await service.yieldTask();
  }
  // A bounded sample cannot prove that every other glyph is unusable.
  return 'unverified';
}
function create({check,changed=()=>{},canWork=()=>true,yieldTask=()=>new Promise(r=>setTimeout(r,0)),storage,cacheLimit=4000,byteLimit=1024*1024}={}){
  let catalogue=[],jobs=[],index=0,generation=0,active=false,scanning=false,disposed=false;
  let timer=0,notification=0,saveTimer=0,dirty=false,hasScan=false,storageError='';
  const byId=new Map(),cache=new Map(),results=new Map(),jobKeys=new Set();
  const store=()=>storage===undefined?globalThis.localStorage:storage;
  const size=text=>Math.max(text.length*2,new TextEncoder().encode(text).byteLength);
  function encode(){return JSON.stringify({version:VERSION,scanned:hasScan,entries:[...cache]});}
  let cacheBytes=0;
  const overhead=size(JSON.stringify({version:VERSION,scanned:false,entries:[]}));
  const entryCost=(key,value)=>size(JSON.stringify([key,value]))+2;
  function drop(key){if(cache.has(key)){cacheBytes-=entryCost(key,cache.get(key));cache.delete(key);}}
  function put(key,value){
    drop(key);cache.set(key,value);cacheBytes+=entryCost(key,value);
    while(cache.size&&(cache.size>cacheLimit||cacheBytes+overhead>byteLimit))drop(cache.keys().next().value);
  }
  try{
    const raw=store().getItem(STORAGE_KEY);
    if(raw!==null){
      if(typeof raw!=='string'||size(raw)>byteLimit)throw Error('Invalid scan');
      const data=JSON.parse(raw);
      if(data?.version!==VERSION||typeof data.scanned!=='boolean'||!Array.isArray(data.entries)||data.entries.length>cacheLimit)throw Error('Invalid scan');
      for(const entry of data.entries){
        if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string'||!definitive(entry[1]))throw Error('Invalid scan');
      }
      for(const [key,result]of data.entries)put(key,result);
      hasScan=data.scanned;
    }
  }catch(_){storageError='Saved results unavailable; using this session only.';}
  function notify(){if(!disposed&&!notification)notification=setTimeout(()=>{notification=0;changed();},150);}
  function flush(){
    clearTimeout(saveTimer);saveTimer=0;if(!dirty)return;
    const text=encode();
    try{store().setItem(STORAGE_KEY,text);storageError='';}
    catch(_){storageError='Results kept for this session; browser storage unavailable.';}
    dirty=false;
  }
  function saveSoon(){dirty=true;if(!saveTimer)saveTimer=setTimeout(()=>{saveTimer=0;flush();notify();},500);}
  function update(next){
    byId.clear();const unique=new Map();
    for(const item of next){
      byId.set(item.id,item);
      const previous=unique.get(item.key);
      if(!previous||(!previous.accessible&&item.accessible))unique.set(item.key,item);
    }
    catalogue=[...unique.values()];
  }
  function finish(){scanning=false;flush();notify();}
  function schedule(delay=100){if(scanning&&!active&&!timer&&!disposed)timer=setTimeout(()=>{timer=0;void work();},delay);}
  async function work(){
    if(active||!scanning||disposed)return;
    if(index>=jobs.length){finish();return;}
    if(!canWork()){schedule(500);return;}
    const owner=generation,item=jobs[index++];active=true;
    const current=()=>!disposed&&owner===generation;
    try{
      let result;
      if(!item.accessible)result='inaccessible';
      else{
        try{result=await check(item,current);if(typeof result==='boolean')result=result?'compatible':'incompatible';}
        catch(_){result=item.record?.hasColor?'incompatible':'unverified';}
        if(!definitive(result)&&result!=='inaccessible')result='unverified';
      }
      if(current()){
        results.set(item.key,result);
        if(definitive(result)){put(item.key,result);saveSoon();}
        notify();
      }
    }finally{
      await yieldTask();active=false;
      if(current()){if(index>=jobs.length)finish();else schedule();}
    }
  }
  function rescan(){
    if(scanning||disposed)return false;
    generation++;scanning=true;hasScan=true;jobs=catalogue.filter(item=>item.accessible);index=0;
    jobKeys.clear();
    for(const item of catalogue){
      jobKeys.add(item.key);drop(item.key);results.delete(item.key);
      // Missing access is already known from metadata; do not wait one timer per alias.
      if(!item.accessible)results.set(item.key,'inaccessible');
    }
    saveSoon();if(jobs.length)schedule();else finish();return true;
  }
  function result(id){
    const item=byId.get(id);if(!item)return 'not scanned';
    return results.get(item.key)||cache.get(item.key)||(scanning&&jobKeys.has(item.key)?'checking':!item.accessible?'inaccessible':'not scanned');
  }
  function progress(){
    const count={total:catalogue.length,checked:0,compatible:0,incompatible:0,inaccessible:0,unverified:0,notScanned:0,scanning,hasScan,storageError};
    for(const item of catalogue){
      if(results.has(item.key)||cache.has(item.key))count.checked++;
      const status=result(item.id);
      if(status==='compatible')count.compatible++;
      if(status==='incompatible')count.incompatible++;
      if(status==='unverified')count.unverified++;
      if(status==='not scanned')count.notScanned++;
      if(!item.accessible)count.inaccessible++;
    }
    return count;
  }
  return {update,rescan,result,progress,flush,dispose(){flush();disposed=true;generation++;scanning=false;clearTimeout(timer);clearTimeout(notification);}};
}
return {create,identity,probeCodes,probe,STORAGE_KEY};
});
