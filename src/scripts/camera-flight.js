(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.GeoGlyphCameraFlight=api;
})(globalThis,function(){
  'use strict';
  const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
  function number(value,label,min,max){
    if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw Error(`${label} must be between ${min} and ${max}`);
    return value;
  }
  function validateView(value,label='Camera view'){
    if(!object(value))throw Error(`${label} is required`);
    if(!Array.isArray(value.center)||value.center.length!==2)throw Error(`${label} centre must contain longitude and latitude`);
    return {
      center:[number(value.center[0],`${label} longitude`,-180,180),number(value.center[1],`${label} latitude`,-85.051129,85.051129)],
      zoom:number(value.zoom,`${label} zoom`,0,24),
      pitch:number(value.pitch,`${label} pitch`,0,85),
      bearing:number(value.bearing,`${label} bearing`,-360,360)
    };
  }
  function validateFlight(value){
    if(!object(value)||value.type!=='flight')throw Error('Choose a custom camera flight');
    return {
      type:'flight',
      start:validateView(value.start,'Start camera view'),
      end:validateView(value.end,'End camera view'),
      duration:number(value.duration,'Camera flight duration',.25,300)
    };
  }
  return Object.freeze({validateView,validateFlight});
});
