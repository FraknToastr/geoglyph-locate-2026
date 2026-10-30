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
  const position=new Float32Array(geometry.attributes.position.array),normal=new Float32Array(geometry.attributes.normal.array),outline=new Float32Array(edges);
  const b=geometry.boundingBox;
  const result={position,normal,outline,groups:geometry.groups.map(g=>({...g})),bounds:{minX:b.min.x,maxX:b.max.x,minY:b.min.y,maxY:b.max.y,minZ:b.min.z,maxZ:b.max.z}};
  result.bytes=position.byteLength+normal.byteLength+outline.byteLength;
  geometry.dispose();
  if(result.bytes>32*1024*1024)throw Error('3D mesh exceeds the 32 MiB budget; reduce curve quality or message length');
  return result;
}
