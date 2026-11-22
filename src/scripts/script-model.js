import './camera-flight.js';

export const actionTypes = Object.freeze({
  mode:['2D / 3D','box'], font:['Font','type'], colour:['Colour','palette'], animation:['Animation','orbit'],
  size:['Size','maximize'], depth:['Depth','layers'], tilt:['Tilt','rotate-3d'], bearing:['Bearing','compass'],
  mirror:['Mirror','flip'], fit:['Fit','maximize'], morph:['Font morph','blend'],
  title:['Title overlay','heading'], wait:['Wait','clock'], camera:['Camera flight','camera']
});
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const fail = message => { throw Error(message); };
const string = (value, name, max=100000) => typeof value === 'string' && value.length <= max ? value : fail(name+' must be text');
const number = (value, name, min, max) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? value : fail(name+` must be between ${min} and ${max}`);
function font(value) {
  if(!object(value))fail('Choose a font');
  const result={};
  for(const key of ['name','family','style','postscriptName','resourceKey'])if(value[key]!==undefined)result[key]=string(value[key],'Font '+key,300);
  if(!result.name&&!result.resourceKey)fail('Choose a font');
  return result;
}
export function validateAction(action) {
  if(!object(action)||!Object.hasOwn(actionTypes,action.type))fail('Unknown script action');
  const {type,value}=action;let result;
  switch(type) {
    case 'mode': result=['2d','3d'].includes(value)?value:fail('Choose 2D or 3D');break;
    case 'font':result=font(value);break;
    case 'colour':
      if(!object(value))fail('Choose a colour');result={};
      for(const key of ['fill','outline'])if(value[key]!==undefined)result[key]=/^#[\da-f]{6}$/i.test(value[key])?value[key].toUpperCase():fail('Enter a six-digit hex colour');
      if(!Object.keys(result).length)fail('Choose fill or outline colour');break;
    case 'animation':result=['none','fixed','yaw','billboard'].includes(value)?value:fail('Choose an animation');break;
    case 'size':
      if(!object(value))fail('Choose a size');result={height:number(value.height,'Height',1,300000)};
      if(value.depth!==undefined)result.depth=number(value.depth,'Depth',.1,100000);break;
    case 'depth':result=number(value,'Depth',.1,100000);break;
    case 'tilt':result=number(value,'Tilt',0,90);break;
    case 'bearing':result=number(value,'Bearing',-360,360);break;
    case 'mirror':case 'fit':result=typeof value==='boolean'?value:fail('Choose on or off');break;
    case 'wait':result=number(value,'Wait',0,3600);break;
    case 'title':result=string(value,'Title',2000);break;
    case 'camera':result=object(value)?globalThis.GeoGlyphCameraFlight.validateFlight(value):['opening','fly-opening','overview'].includes(value)?value:fail('Choose a camera action');break;
    case 'morph':
      if(!object(value))fail('Choose morph fonts');
      result={from:font(value.from),to:font(value.to),duration:number(value.duration,'Morph duration',.25,30)};break;
  }
  return {type,value:result};
}
export function validateScript(value) {
  if(!object(value)||value.version!==1||!Array.isArray(value.rows))fail('Expected a version 1 Geoglyph script with rows');
  if(value.rows.length>10000)fail('Script is too large');
  const ids=new Set();let textSize=0;
  const rows=value.rows.map((row,index)=>{
    try {
      if(!object(row))fail('Invalid row');
      const id=string(row.id,'Row ID',100);if(!id||ids.has(id))fail('Row IDs must be unique');ids.add(id);
      const message=string(row.message??'','Message');textSize+=message.length;
      const duration=number(row.duration??5,'Duration',0,3600);
      if(!Array.isArray(row.actions)||row.actions.length>4)fail('A row supports at most four actions');
      const actions=row.actions.map(validateAction),types=new Set(actions.map(a=>a.type));
      if(types.size!==actions.length)fail('Only one action per category is allowed');
      if(actions.some(a=>a.type==='mode'&&a.value==='2d')&&actions.some(a=>a.type==='animation'&&a.value!=='none'))fail('Orbit, Turn and Face require 3D');
      return {id,message,duration,actions};
    }catch(error){throw Error(`Row ${index+1}: ${error.message}`);}
  });
  if(textSize>2000000)fail('Script text is too large');
  return {version:1,title:string(value.title??'Untitled script','Script title',300),rows};
}
export const newRow = () => ({id:globalThis.crypto?.randomUUID?.()||'row-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),message:'',duration:5,actions:[]});
export function fontIdentity(record) {
  return {name:record.name||'',family:record.family||'',style:record.style||'',postscriptName:record.postscriptName||'',resourceKey:record.fontResourceKey||''};
}
