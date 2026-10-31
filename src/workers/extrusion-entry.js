import { ExtrudeGeometry, Shape, Path } from 'three';

// Unit-height, unit-depth meshes can be reused for size, depth, tilt and paint edits.
export function build(model) {
  if(!model?.polygons?.length||!model.bounds?.height)throw Error('No validated outlines to extrude');
  const {cx,cy,height}=model.bounds,shapes=[],edges=[];
  for(const polygon of model.polygons) {
    let shape;
    polygon.forEach((ring,index)=>{
      const path=index?new Path():new Shape();
      ring.forEach(([x,y],i)=>{const px=(x-cx)/height,py=(cy-y)/height;i?path.lineTo(px,py):path.moveTo(px,py);});
      if(index)shape.holes.push(path);else {shape=path;shapes.push(shape);}
      for(let i=1;i<ring.length;i++)for(const z of [-.5,.5])edges.push((ring[i-1][0]-cx)/height,(cy-ring[i-1][1])/height,z,(ring[i][0]-cx)/height,(cy-ring[i][1])/height,z);
    });
  }
  const geometry=new ExtrudeGeometry(shapes,{depth:1,steps:1,bevelEnabled:false,curveSegments:1});
  geometry.translate(0,0,-.5);geometry.computeBoundingBox();
  if(geometry.attributes.position.count>1200000){geometry.dispose();throw Error('3D mesh budget exceeded; reduce curve quality or message length');}
  // Pack identical triangles by material for two solid draws. Keep the original
  // group sequence remapped into those buffers for unchanged transparent order.
  const sourcePosition=geometry.attributes.position.array,sourceNormal=geometry.attributes.normal.array;
  const position=new Float32Array(sourcePosition.length),normal=new Float32Array(sourceNormal.length),outline=new Float32Array(edges);
  const groups=new Array(geometry.groups.length),solidGroups=[];
  let offset=0;
  for(const materialIndex of [0,1]) {
    const start=offset;
    geometry.groups.forEach((group,index)=>{
      if(group.materialIndex!==materialIndex)return;
      position.set(sourcePosition.subarray(group.start*3,(group.start+group.count)*3),offset*3);
      normal.set(sourceNormal.subarray(group.start*3,(group.start+group.count)*3),offset*3);
      groups[index]={start:offset,count:group.count,materialIndex};offset+=group.count;
    });
    if(offset>start)solidGroups.push({start,count:offset-start,materialIndex});
  }
  if(offset!==position.length/3){geometry.dispose();throw Error('Unexpected extrusion material ranges');}
  const b=geometry.boundingBox;
  const result={position,normal,outline,groups,solidGroups,bounds:{minX:b.min.x,maxX:b.max.x,minY:b.min.y,maxY:b.max.y,minZ:b.min.z,maxZ:b.max.z}};
  result.bytes=position.byteLength+normal.byteLength+outline.byteLength;
  geometry.dispose();
  if(result.bytes>32*1024*1024)throw Error('3D mesh exceeds the 32 MiB budget; reduce curve quality or message length');
  return result;
}
