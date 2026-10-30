(function (root) {
  'use strict';
  function parameters(value, bounds = { minY:-0.5, minZ:-0.5 }) {
    const height=Math.max(0.001,Number(value.heightMeters)||1),depth=Math.max(0.1,Number(value.depthMeters)||0.1);
    const tilt=Math.max(0,Math.min(180,Number(value.tilt)||0))*Math.PI/180;
    const bearing=(Number(value.bearing)||0)*Math.PI/180;
    const bottomZ=Math.cos(tilt)>=0?bounds.minZ:(bounds.maxZ??.5);
    return {height,depth,tilt,bearing,lift:-bounds.minY*height*Math.sin(tilt)-bottomZ*depth*Math.cos(tilt)};
  }
  function point(p, value, bounds) {
    const t=parameters(value,bounds),x=p[0]*t.height,y=p[1]*t.height,z=p[2]*t.depth;
    const north=y*Math.cos(t.tilt)-z*Math.sin(t.tilt);
    return [x*Math.cos(t.bearing)+north*Math.sin(t.bearing),-x*Math.sin(t.bearing)+north*Math.cos(t.bearing),y*Math.sin(t.tilt)+z*Math.cos(t.tilt)+t.lift];
  }
  function facing(camera, target, tilt, mode) {
    const east=camera[0]-target[0],north=camera[1]-target[1],up=camera[2]-target[2];
    return {bearing:Math.atan2(-east,-north)*180/Math.PI,tilt:mode==='billboard'?Math.atan2(Math.hypot(east,north),up)*180/Math.PI:tilt};
  }
  function advanceOrbit(bearing,seconds,period) { return bearing+360*Math.max(0,Math.min(.1,seconds))/Math.max(10,Math.min(120,period)); }
function framingPadding(width,height) { return { top:height*.1, bottom:height*.1, left:width*.1, right:width*.1 }; }
const api=Object.freeze({parameters,point,facing,advanceOrbit,framingPadding});
  root.GeoGlyphGroundTransform=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
