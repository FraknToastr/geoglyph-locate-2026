import { BufferGeometry, BufferAttribute } from 'three';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

// Retain ready geometry, rather than asking the worker to clone and triangulate
// a recently displayed font again. The active model is never evicted mid-frame.
export function createGroundModelCache(build) {
  const entries=new Map(),pending=new Map(),limit=32*1024*1024;
  let active=null,epoch=0,hits=0,evictions=0;
  const bytes=()=>[...entries.values()].reduce((sum,item)=>sum+item.bytes,0);
  function trim(protectedKey) {
    for(const [key,item] of entries){
      if(entries.size<=3&&bytes()<=limit)break;
      if(key===active||key===protectedKey)continue;
      item.geometry.dispose();item.lineGeometry.dispose();entries.delete(key);evictions++;
    }
  }
  function get(key) {
    const item=entries.get(key);if(!item)return null;
    entries.delete(key);entries.set(key,item);hits++;return item;
  }
  async function prepare(model) {
    const key=model.renderKey,cached=get(key);if(cached)return cached;
    if(pending.has(key))return pending.get(key);
    const generation=epoch;
    const job=(async()=>{
      const mesh=await build(key,model);
      if(generation!==epoch)throw Error('Model preparation cancelled');
      const retained=mesh.bytes+mesh.outline.byteLength+(model.vertices||0)*16;
      if(retained>limit)throw Error('Prepared model exceeds the 32 MiB budget; reduce curve quality or message length');
      const geometry=new BufferGeometry();
      geometry.setAttribute('position',new BufferAttribute(mesh.position,3));
      geometry.setAttribute('normal',new BufferAttribute(mesh.normal,3));
      mesh.groups.forEach(g=>geometry.addGroup(g.start,g.count,g.materialIndex));
      const lineGeometry=new LineSegmentsGeometry();lineGeometry.setPositions(mesh.outline);
      const item={key,model,mesh,geometry,lineGeometry,bytes:retained};
      // Make room before insertion, even when the previous active entry is large.
      if(active&&entries.get(active)?.bytes+retained>limit){
        geometry.dispose();lineGeometry.dispose();
        throw Error('Combined models exceed the 32 MiB budget; reduce curve quality or message length');
      }
      entries.set(key,item);trim(key);return item;
    })().finally(()=>{if(pending.get(key)===job)pending.delete(key);});
    pending.set(key,job);return job;
  }
  function clear(){epoch++;for(const item of entries.values()){item.geometry.dispose();item.lineGeometry.dispose();}entries.clear();pending.clear();active=null;}
  return {get,prepare,activate(item){active=item.key;entries.delete(item.key);entries.set(item.key,item);trim();},clear,
    stats:()=>({entries:entries.size,bytes:bytes(),hits,evictions,pending:pending.size})};
}
