(()=>{var jd=Object.create;var vu=Object.defineProperty;var Qd=Object.getOwnPropertyDescriptor;var ef=Object.getOwnPropertyNames;var tf=Object.getPrototypeOf,nf=Object.prototype.hasOwnProperty;var yu=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var rf=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of ef(e))!nf.call(i,r)&&r!==t&&vu(i,r,{get:()=>e[r],enumerable:!(n=Qd(e,r))||n.enumerable});return i};var Su=(i,e,t)=>(t=i!=null?jd(tf(i)):{},rf(e||!i||!i.__esModule?vu(t,"default",{value:i,enumerable:!0}):t,i));var Ed=yu((wM,hl)=>{(function(i,e){let t=e();typeof hl=="object"&&hl.exports&&(hl.exports=t),i.GeoGlyphCameraFlight=t})(globalThis,function(){"use strict";let i=r=>r!==null&&typeof r=="object"&&!Array.isArray(r);function e(r,s,a,o){if(typeof r!="number"||!Number.isFinite(r)||r<a||r>o)throw Error(`${s} must be between ${a} and ${o}`);return r}function t(r,s="Camera view"){if(!i(r))throw Error(`${s} is required`);if(!Array.isArray(r.center)||r.center.length!==2)throw Error(`${s} centre must contain longitude and latitude`);return{center:[e(r.center[0],`${s} longitude`,-180,180),e(r.center[1],`${s} latitude`,-85.051129,85.051129)],zoom:e(r.zoom,`${s} zoom`,0,24),pitch:e(r.pitch,`${s} pitch`,0,85),bearing:e(r.bearing,`${s} bearing`,-360,360)}}function n(r){if(!i(r)||r.type!=="flight")throw Error("Choose a custom camera flight");return{type:"flight",start:t(r.start,"Start camera view"),end:t(r.end,"End camera view"),duration:e(r.duration,"Camera flight duration",.25,300)}}return Object.freeze({validateView:t,validateFlight:n})})});var Cd=yu((RM,dl)=>{(function(i,e){let t=e();typeof dl=="object"&&dl.exports&&(dl.exports=t),i.GeoGlyphMessageText=t})(globalThis,function(){"use strict";let i=new Intl.Segmenter(void 0,{granularity:"grapheme"});function e(a){return!a.includes("\uFE0E")&&(/\p{Emoji_Presentation}/u.test(a)||/^[#*0-9]\uFE0F?\u20E3$/u.test(a)||/[\uFE0F\u200D]/u.test(a)&&/\p{Extended_Pictographic}/u.test(a))}function t(a){let o=[];for(let{segment:l}of i.segment(String(a))){let c=e(l),u=o[o.length-1];u?.emoji===c?u.text+=l:o.push({text:l,emoji:c})}return o}function n(a){return t(a).some(o=>o.emoji)}function r(a,o,l=!1){return n(o)||!l&&!/[\p{Letter}\p{Number}]/u.test(o)&&!!(a?.hasColor||/emoji/i.test(a?.name||""))}function s(a,o,l,c){let u=0,d=0,h=0,p=0,_=0;return{parts:t(o||" ").map(g=>{let f=g.emoji?c:l;a.font=f;let b=a.measureText(g.text),L=u;return d=Math.max(d,(b.actualBoundingBoxLeft||0)-L),h=Math.max(h,L+(b.actualBoundingBoxRight||b.width)),p=Math.max(p,b.actualBoundingBoxAscent||0),_=Math.max(_,b.actualBoundingBoxDescent||0),u+=b.width,{...g,font:f,x:L}}),width:u,actualBoundingBoxLeft:d,actualBoundingBoxRight:h,actualBoundingBoxAscent:p,actualBoundingBoxDescent:_}}return Object.freeze({runs:t,hasEmoji:n,nativeColour:r,measureLine:s})})});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var qu=0,Kl=1,Yu=2;var Fs=1,$u=2,Hr=3,Yn=0,Ut=1,Yt=2,bn=0,Wr=1,jl=2,Ql=3,ec=4,so=5;var tr=100,Zu=101,Ju=102,Ku=103,ao=104,ju=200,Os=201,Qu=202,eh=203,tc=204,nc=205,th=206,nh=207,ih=208,rh=209,sh=210,ah=211,oh=212,lh=213,ch=214,Ca=0,Ra=1,Pa=2,Nr=3,Ia=4,La=5,Da=6,Na=7,oo=0,uh=1,hh=2,Fn=0,ic=1,rc=2,sc=3,ac=4,oc=5,lc=6,cc=7;var uc=300,Bi=301,nr=302,lo=303,co=304,Bs=306,Ua=1e3,mn=1001,Fa=1002,Ct=1003,dh=1004;var zs=1005;var Pt=1006,uo=1007;var zi=1008;var cn=1009,hc=1010,dc=1011,Xr=1012,ho=1013,On=1014,_n=1015,Bn=1016,fo=1017,po=1018,qr=1020,fc=35902,pc=35899,mc=1021,gc=1022,wn=1023,Hn=1026,ki=1027,xc=1028,mo=1029,$n=1030,go=1031;var xo=1033,ks=33776,Gs=33777,Vs=33778,Hs=33779,_o=35840,vo=35841,yo=35842,So=35843,Mo=36196,bo=37492,wo=37496,Eo=37488,To=37489,Ws=37490,Ao=37491,Co=37808,Ro=37809,Po=37810,Io=37811,Lo=37812,Do=37813,No=37814,Uo=37815,Fo=37816,Oo=37817,Bo=37818,zo=37819,ko=37820,Go=37821,Vo=36492,Ho=36494,Wo=36495,Xo=36283,qo=36284,Xs=36285,Yo=36286;var xs=2300,Oa=2301,Ta=2302,Wl=2303,Xl=2400,ql=2401,Yl=2402;var fh=3200;var $o=0,ph=1,hi="",pn="srgb",_s="srgb-linear",vs="linear",ot="srgb";var Aa=7680;var mh=519,gh=512,xh=513,_h=514,Zo=515,vh=516,yh=517,Jo=518,Sh=519,_c=35044;var Yr="300 es",Nn=2e3,Ur=2001;function sf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function af(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ys(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mh(){let i=ys("canvas");return i.style.display="block",i}var Mu={},Fr=null;function Ss(...i){let e="THREE."+i.shift();Fr?Fr("log",e,...i):console.log(e,...i)}function bh(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Fe(...i){i=bh(i);let e="THREE."+i.shift();if(Fr)Fr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Be(...i){i=bh(i);let e="THREE."+i.shift();if(Fr)Fr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function ji(...i){let e=i.join(" ");e in Mu||(Mu[e]=!0,Fe(...i))}function wh(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var Eh={[Ca]:Ra,[Pa]:Da,[Ia]:Na,[Nr]:La,[Ra]:Ca,[Da]:Pa,[Na]:Ia,[La]:Nr},Wn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}},Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bu=1234567,ms=Math.PI/180,Or=180/Math.PI;function ai(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[t&63|128]+Vt[t>>8&255]+"-"+Vt[t>>16&255]+Vt[t>>24&255]+Vt[n&255]+Vt[n>>8&255]+Vt[n>>16&255]+Vt[n>>24&255]).toLowerCase()}function He(i,e,t){return Math.max(e,Math.min(t,i))}function vc(i,e){return(i%e+e)%e}function of(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function lf(i,e,t){return i!==e?(t-i)/(e-i):0}function gs(i,e,t){return(1-t)*i+t*e}function cf(i,e,t,n){return gs(i,e,1-Math.exp(-t*n))}function uf(i,e=1){return e-Math.abs(vc(i,e*2)-e)}function hf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function df(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ff(i,e){return i+Math.floor(Math.random()*(e-i+1))}function pf(i,e){return i+Math.random()*(e-i)}function mf(i){return i*(.5-Math.random())}function gf(i){i!==void 0&&(bu=i);let e=bu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function xf(i){return i*ms}function _f(i){return i*Or}function vf(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function yf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Sf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Mf(i,e,t,n,r){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),u=a((e+n)/2),d=s((e-n)/2),h=a((e-n)/2),p=s((n-e)/2),_=a((n-e)/2);switch(r){case"XYX":i.set(o*u,l*d,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*d,o*c);break;case"ZXZ":i.set(l*d,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*_,l*p,o*c);break;case"YXY":i.set(l*p,o*u,l*_,o*c);break;case"ZYZ":i.set(l*_,l*p,o*u,o*c);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Dn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ct(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var yc={DEG2RAD:ms,RAD2DEG:Or,generateUUID:ai,clamp:He,euclideanModulo:vc,mapLinear:of,inverseLerp:lf,lerp:gs,damp:cf,pingpong:uf,smoothstep:hf,smootherstep:df,randInt:ff,randFloat:pf,randFloatSpread:mf,seededRandom:gf,degToRad:xf,radToDeg:_f,isPowerOfTwo:vf,ceilPowerOfTwo:yf,floorPowerOfTwo:Sf,setQuaternionFromProperEuler:Mf,normalize:ct,denormalize:Dn},We=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],d=n[r+3],h=s[a+0],p=s[a+1],_=s[a+2],M=s[a+3];if(d!==M||l!==h||c!==p||u!==_){let g=l*h+c*p+u*_+d*M;g<0&&(h=-h,p=-p,_=-_,M=-M,g=-g);let f=1-o;if(g<.9995){let b=Math.acos(g),L=Math.sin(b);f=Math.sin(f*b)/L,o=Math.sin(o*b)/L,l=l*f+h*o,c=c*f+p*o,u=u*f+_*o,d=d*f+M*o}else{l=l*f+h*o,c=c*f+p*o,u=u*f+_*o,d=d*f+M*o;let b=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=b,c*=b,u*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,a){let o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],d=s[a],h=s[a+1],p=s[a+2],_=s[a+3];return e[t]=o*_+u*d+l*p-c*h,e[t+1]=l*_+u*h+c*d-o*p,e[t+2]=c*_+u*p+o*h-l*d,e[t+3]=u*_-o*d-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),d=o(s/2),h=l(n/2),p=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=h*u*d+c*p*_,this._y=c*p*d-h*u*_,this._z=c*u*_+h*p*d,this._w=c*u*d-h*p*_;break;case"YXZ":this._x=h*u*d+c*p*_,this._y=c*p*d-h*u*_,this._z=c*u*_-h*p*d,this._w=c*u*d+h*p*_;break;case"ZXY":this._x=h*u*d-c*p*_,this._y=c*p*d+h*u*_,this._z=c*u*_+h*p*d,this._w=c*u*d-h*p*_;break;case"ZYX":this._x=h*u*d-c*p*_,this._y=c*p*d+h*u*_,this._z=c*u*_-h*p*d,this._w=c*u*d+h*p*_;break;case"YZX":this._x=h*u*d+c*p*_,this._y=c*p*d+h*u*_,this._z=c*u*_-h*p*d,this._w=c*u*d-h*p*_;break;case"XZY":this._x=h*u*d-c*p*_,this._y=c*p*d-h*u*_,this._z=c*u*_+h*p*d,this._w=c*u*d+h*p*_;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+o+d;if(h>0){let p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(u-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+u)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),d=2*(s*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-s*d,this.z=r+l*d+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ml.copy(this).projectOnVector(e),this.sub(Ml)}reflect(e){return this.sub(Ml.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ml=new V,wu=new Xn,Oe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],p=n[5],_=n[8],M=r[0],g=r[3],f=r[6],b=r[1],L=r[4],S=r[7],w=r[2],E=r[5],P=r[8];return s[0]=a*M+o*b+l*w,s[3]=a*g+o*L+l*E,s[6]=a*f+o*S+l*P,s[1]=c*M+u*b+d*w,s[4]=c*g+u*L+d*E,s[7]=c*f+u*S+d*P,s[2]=h*M+p*b+_*w,s[5]=h*g+p*L+_*E,s[8]=h*f+p*S+_*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,h=o*l-u*s,p=c*s-a*l,_=t*d+n*h+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/_;return e[0]=d*M,e[1]=(r*c-u*n)*M,e[2]=(o*n-r*a)*M,e[3]=h*M,e[4]=(u*t-r*l)*M,e[5]=(r*s-o*t)*M,e[6]=p*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*s)*M,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ji("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(bl.makeScale(e,t)),this}rotate(e){return ji("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(bl.makeRotation(-e)),this}translate(e,t){return ji("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(bl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},bl=new Oe,Eu=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tu=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function bf(){let i={enabled:!0,workingColorSpace:_s,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ot&&(r.r=oi(r.r),r.g=oi(r.g),r.b=oi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(r.r=Dr(r.r),r.g=Dr(r.g),r.b=Dr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===hi?vs:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ji("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ji("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[_s]:{primaries:e,whitePoint:n,transfer:vs,toXYZ:Eu,fromXYZ:Tu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:pn},outputColorSpaceConfig:{drawingBufferColorSpace:pn}},[pn]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Eu,fromXYZ:Tu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:pn}}}),i}var Je=bf();function oi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Dr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var _r,Ba=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_r===void 0&&(_r=ys("canvas")),_r.width=e.width,_r.height=e.height;let r=_r.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=_r}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ys("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=oi(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(oi(t[n]/255)*255):t[n]=oi(t[n]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},wf=0,Br=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=ai(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(wl(r[a].image)):s.push(wl(r[a]))}else s=wl(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function wl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ba.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}var Ef=0,El=new V,on=class i extends Wn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=mn,r=mn,s=Pt,a=zi,o=wn,l=cn,c=i.DEFAULT_ANISOTROPY,u=hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=ai(),this.name="",this.source=new Br(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(El).x}get height(){return this.source.getSize(El).y}get depth(){return this.source.getSize(El).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==uc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ua:e.x=e.x-Math.floor(e.x);break;case mn:e.x=e.x<0?0:1;break;case Fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ua:e.y=e.y-Math.floor(e.y);break;case mn:e.y=e.y<0?0:1;break;case Fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=uc;on.DEFAULT_ANISOTROPY=1;var Ke=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],p=l[5],_=l[9],M=l[2],g=l[6],f=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-M)<.01&&Math.abs(_-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+M)<.1&&Math.abs(_+g)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let L=(c+1)/2,S=(p+1)/2,w=(f+1)/2,E=(u+h)/4,P=(d+M)/4,m=(_+g)/4;return L>S&&L>w?L<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(L),r=E/n,s=P/n):S>w?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=E/r,s=m/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=P/s,r=m/s),this.set(n,r,s,t),this}let b=Math.sqrt((g-_)*(g-_)+(d-M)*(d-M)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(g-_)/b,this.y=(d-M)/b,this.z=(h-u)/b,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},za=class extends Wn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ke(0,0,e,t),this.scissorTest=!1,this.viewport=new Ke(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:n.depth},s=new on(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Pt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Br(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},qt=class extends za{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ms=class extends on{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ka=class extends on{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var ke=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,r,s,a,o,l,c,u,d,h,p,_,M,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,d,h,p,_,M,g)}set(e,t,n,r,s,a,o,l,c,u,d,h,p,_,M,g){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=_,f[11]=M,f[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/vr.setFromMatrixColumn(e,0).length(),s=1/vr.setFromMatrixColumn(e,1).length(),a=1/vr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let h=a*u,p=a*d,_=o*u,M=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+_*c,t[5]=h-M*c,t[9]=-o*l,t[2]=M-h*c,t[6]=_+p*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*u,p=l*d,_=c*u,M=c*d;t[0]=h+M*o,t[4]=_*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=p*o-_,t[6]=M+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*u,p=l*d,_=c*u,M=c*d;t[0]=h-M*o,t[4]=-a*d,t[8]=_+p*o,t[1]=p+_*o,t[5]=a*u,t[9]=M-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*u,p=a*d,_=o*u,M=o*d;t[0]=l*u,t[4]=_*c-p,t[8]=h*c+M,t[1]=l*d,t[5]=M*c+h,t[9]=p*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,p=a*c,_=o*l,M=o*c;t[0]=l*u,t[4]=M-h*d,t[8]=_*d+p,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*d+_,t[10]=h-M*d}else if(e.order==="XZY"){let h=a*l,p=a*c,_=o*l,M=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+M,t[5]=a*u,t[9]=p*d-_,t[2]=_*d-p,t[6]=o*u,t[10]=M*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Tf,e,Af)}lookAt(e,t,n){let r=this.elements;return dn.subVectors(e,t),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),wi.crossVectors(n,dn),wi.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),wi.crossVectors(n,dn)),wi.normalize(),aa.crossVectors(dn,wi),r[0]=wi.x,r[4]=aa.x,r[8]=dn.x,r[1]=wi.y,r[5]=aa.y,r[9]=dn.y,r[2]=wi.z,r[6]=aa.z,r[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],p=n[13],_=n[2],M=n[6],g=n[10],f=n[14],b=n[3],L=n[7],S=n[11],w=n[15],E=r[0],P=r[4],m=r[8],y=r[12],R=r[1],I=r[5],F=r[9],D=r[13],A=r[2],z=r[6],Z=r[10],K=r[14],se=r[3],U=r[7],q=r[11],C=r[15];return s[0]=a*E+o*R+l*A+c*se,s[4]=a*P+o*I+l*z+c*U,s[8]=a*m+o*F+l*Z+c*q,s[12]=a*y+o*D+l*K+c*C,s[1]=u*E+d*R+h*A+p*se,s[5]=u*P+d*I+h*z+p*U,s[9]=u*m+d*F+h*Z+p*q,s[13]=u*y+d*D+h*K+p*C,s[2]=_*E+M*R+g*A+f*se,s[6]=_*P+M*I+g*z+f*U,s[10]=_*m+M*F+g*Z+f*q,s[14]=_*y+M*D+g*K+f*C,s[3]=b*E+L*R+S*A+w*se,s[7]=b*P+L*I+S*z+w*U,s[11]=b*m+L*F+S*Z+w*q,s[15]=b*y+L*D+S*K+w*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],p=e[14],_=e[3],M=e[7],g=e[11],f=e[15],b=l*p-c*h,L=o*p-c*d,S=o*h-l*d,w=a*p-c*u,E=a*h-l*u,P=a*d-o*u;return t*(M*b-g*L+f*S)-n*(_*b-g*w+f*E)+r*(_*L-M*w+f*P)-s*(_*S-M*E+g*P)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+r*(s*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],p=e[11],_=e[12],M=e[13],g=e[14],f=e[15],b=t*o-n*a,L=t*l-r*a,S=t*c-s*a,w=n*l-r*o,E=n*c-s*o,P=r*c-s*l,m=u*M-d*_,y=u*g-h*_,R=u*f-p*_,I=d*g-h*M,F=d*f-p*M,D=h*f-p*g,A=b*D-L*F+S*I+w*R-E*y+P*m;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/A;return e[0]=(o*D-l*F+c*I)*z,e[1]=(r*F-n*D-s*I)*z,e[2]=(M*P-g*E+f*w)*z,e[3]=(h*E-d*P-p*w)*z,e[4]=(l*R-a*D-c*y)*z,e[5]=(t*D-r*R+s*y)*z,e[6]=(g*S-_*P-f*L)*z,e[7]=(u*P-h*S+p*L)*z,e[8]=(a*F-o*R+c*m)*z,e[9]=(n*R-t*F-s*m)*z,e[10]=(_*E-M*S+f*b)*z,e[11]=(d*S-u*E-p*b)*z,e[12]=(o*y-a*I-l*m)*z,e[13]=(t*I-n*y+r*m)*z,e[14]=(M*L-_*w-g*b)*z,e[15]=(u*w-d*L+h*b)*z,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,d=o+o,h=s*c,p=s*u,_=s*d,M=a*u,g=a*d,f=o*d,b=l*c,L=l*u,S=l*d,w=n.x,E=n.y,P=n.z;return r[0]=(1-(M+f))*w,r[1]=(p+S)*w,r[2]=(_-L)*w,r[3]=0,r[4]=(p-S)*E,r[5]=(1-(h+f))*E,r[6]=(g+b)*E,r[7]=0,r[8]=(_+L)*P,r[9]=(g-b)*P,r[10]=(1-(h+M))*P,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=vr.set(r[0],r[1],r[2]).length(),o=vr.set(r[4],r[5],r[6]).length(),l=vr.set(r[8],r[9],r[10]).length();s<0&&(a=-a),Rn.copy(this);let c=1/a,u=1/o,d=1/l;return Rn.elements[0]*=c,Rn.elements[1]*=c,Rn.elements[2]*=c,Rn.elements[4]*=u,Rn.elements[5]*=u,Rn.elements[6]*=u,Rn.elements[8]*=d,Rn.elements[9]*=d,Rn.elements[10]*=d,t.setFromRotationMatrix(Rn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,s,a,o=Nn,l=!1){let c=this.elements,u=2*s/(t-e),d=2*s/(n-r),h=(t+e)/(t-e),p=(n+r)/(n-r),_,M;if(l)_=s/(a-s),M=a*s/(a-s);else if(o===Nn)_=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(o===Ur)_=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=Nn,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-r),h=-(t+e)/(t-e),p=-(n+r)/(n-r),_,M;if(l)_=1/(a-s),M=a/(a-s);else if(o===Nn)_=-2/(a-s),M=-(a+s)/(a-s);else if(o===Ur)_=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},vr=new V,Rn=new ke,Tf=new V(0,0,0),Af=new V(1,1,1),wi=new V,aa=new V,dn=new V,Au=new ke,Cu=new Xn,li=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],d=r[2],h=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-He(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Au.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Au,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Cu.setFromEuler(this),this.setFromQuaternion(Cu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};li.DEFAULT_ORDER="XYZ";var bs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Cf=0,Ru=new V,yr=new Xn,ei=new ke,oa=new V,hs=new V,Rf=new V,Pf=new Xn,Pu=new V(1,0,0),Iu=new V(0,1,0),Lu=new V(0,0,1),Du={type:"added"},If={type:"removed"},Sr={type:"childadded",child:null},Tl={type:"childremoved",child:null},jt=class i extends Wn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new V,t=new li,n=new Xn,r=new V(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ke},normalMatrix:{value:new Oe}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yr.setFromAxisAngle(e,t),this.quaternion.multiply(yr),this}rotateOnWorldAxis(e,t){return yr.setFromAxisAngle(e,t),this.quaternion.premultiply(yr),this}rotateX(e){return this.rotateOnAxis(Pu,e)}rotateY(e){return this.rotateOnAxis(Iu,e)}rotateZ(e){return this.rotateOnAxis(Lu,e)}translateOnAxis(e,t){return Ru.copy(e).applyQuaternion(this.quaternion),this.position.add(Ru.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Pu,e)}translateY(e){return this.translateOnAxis(Iu,e)}translateZ(e){return this.translateOnAxis(Lu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ei.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?oa.copy(e):oa.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),hs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ei.lookAt(hs,oa,this.up):ei.lookAt(oa,hs,this.up),this.quaternion.setFromRotationMatrix(ei),r&&(ei.extractRotation(r.matrixWorld),yr.setFromRotationMatrix(ei),this.quaternion.premultiply(yr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Be("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Du),Sr.child=e,this.dispatchEvent(Sr),Sr.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(If),Tl.child=e,this.dispatchEvent(Tl),Tl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(ei),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Du),Sr.child=e,this.dispatchEvent(Sr),Sr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,e,Rf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hs,Pf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),p=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=r,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};jt.DEFAULT_UP=new V(0,1,0);jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var si=class extends jt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Lf={type:"move"},zr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new si,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new si,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new si,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let M of e.hand.values()){let g=t.getJointPose(M,n),f=this._getHandJoint(c,M);g!==null&&(f.matrix.fromArray(g.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=g.radius),f.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,_=.005;c.inputState.pinching&&h>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Lf)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new si;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Th={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ei={h:0,s:0,l:0},la={h:0,s:0,l:0};function Al(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Je.workingColorSpace){if(e=vc(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Al(a,s,e+1/3),this.g=Al(a,s,e),this.b=Al(a,s,e-1/3)}return Je.colorSpaceToWorking(this,r),this}setStyle(e,t=pn){function n(s){s!==void 0&&parseFloat(s)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pn){let n=Th[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=oi(e.r),this.g=oi(e.g),this.b=oi(e.b),this}copyLinearToSRGB(e){return this.r=Dr(e.r),this.g=Dr(e.g),this.b=Dr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pn){return Je.workingToColorSpace(Ht.copy(this),e),Math.round(He(Ht.r*255,0,255))*65536+Math.round(He(Ht.g*255,0,255))*256+Math.round(He(Ht.b*255,0,255))}getHexString(e=pn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(Ht.copy(this),t);let n=Ht.r,r=Ht.g,s=Ht.b,a=Math.max(n,r,s),o=Math.min(n,r,s),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-n)/d+2;break;case s:l=(n-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=pn){Je.workingToColorSpace(Ht.copy(this),e);let t=Ht.r,n=Ht.g,r=Ht.b;return e!==pn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Ei),this.setHSL(Ei.h+e,Ei.s+t,Ei.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ei),e.getHSL(la);let n=gs(Ei.h,la.h,t),r=gs(Ei.s,la.s,t),s=gs(Ei.l,la.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ht=new qe;qe.NAMES=Th;var ci=class extends jt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new li,this.environmentIntensity=1,this.environmentRotation=new li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Pn=new V,ti=new V,Cl=new V,ni=new V,Mr=new V,br=new V,Nu=new V,Rl=new V,Pl=new V,Il=new V,Ll=new Ke,Dl=new Ke,Nl=new Ke,Ri=class i{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Pn.subVectors(e,t),r.cross(Pn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Pn.subVectors(r,t),ti.subVectors(n,t),Cl.subVectors(e,t);let a=Pn.dot(Pn),o=Pn.dot(ti),l=Pn.dot(Cl),c=ti.dot(ti),u=ti.dot(Cl),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;let h=1/d,p=(c*l-o*u)*h,_=(a*u-o*l)*h;return s.set(1-p-_,_,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,ni)===null?!1:ni.x>=0&&ni.y>=0&&ni.x+ni.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,ni)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ni.x),l.addScaledVector(a,ni.y),l.addScaledVector(o,ni.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return Ll.setScalar(0),Dl.setScalar(0),Nl.setScalar(0),Ll.fromBufferAttribute(e,t),Dl.fromBufferAttribute(e,n),Nl.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Ll,s.x),a.addScaledVector(Dl,s.y),a.addScaledVector(Nl,s.z),a}static isFrontFacing(e,t,n,r){return Pn.subVectors(n,t),ti.subVectors(e,t),Pn.cross(ti).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pn.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Pn.cross(ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,a,o;Mr.subVectors(r,n),br.subVectors(s,n),Rl.subVectors(e,n);let l=Mr.dot(Rl),c=br.dot(Rl);if(l<=0&&c<=0)return t.copy(n);Pl.subVectors(e,r);let u=Mr.dot(Pl),d=br.dot(Pl);if(u>=0&&d<=u)return t.copy(r);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Mr,a);Il.subVectors(e,s);let p=Mr.dot(Il),_=br.dot(Il);if(_>=0&&p<=_)return t.copy(s);let M=p*c-l*_;if(M<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(br,o);let g=u*_-p*d;if(g<=0&&d-u>=0&&p-_>=0)return Nu.subVectors(s,r),o=(d-u)/(d-u+(p-_)),t.copy(r).addScaledVector(Nu,o);let f=1/(g+M+h);return a=M*f,o=h*f,t.copy(n).addScaledVector(Mr,a).addScaledVector(br,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},gn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(In.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(In.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=In.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,In):In.fromBufferAttribute(s,a),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ca.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ca.copy(n.boundingBox)),ca.applyMatrix4(e.matrixWorld),this.union(ca)}let r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ds),ua.subVectors(this.max,ds),wr.subVectors(e.a,ds),Er.subVectors(e.b,ds),Tr.subVectors(e.c,ds),Ti.subVectors(Er,wr),Ai.subVectors(Tr,Er),$i.subVectors(wr,Tr);let t=[0,-Ti.z,Ti.y,0,-Ai.z,Ai.y,0,-$i.z,$i.y,Ti.z,0,-Ti.x,Ai.z,0,-Ai.x,$i.z,0,-$i.x,-Ti.y,Ti.x,0,-Ai.y,Ai.x,0,-$i.y,$i.x,0];return!Ul(t,wr,Er,Tr,ua)||(t=[1,0,0,0,1,0,0,0,1],!Ul(t,wr,Er,Tr,ua))?!1:(ha.crossVectors(Ti,Ai),t=[ha.x,ha.y,ha.z],Ul(t,wr,Er,Tr,ua))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ii=[new V,new V,new V,new V,new V,new V,new V,new V],In=new V,ca=new gn,wr=new V,Er=new V,Tr=new V,Ti=new V,Ai=new V,$i=new V,ds=new V,ua=new V,ha=new V,Zi=new V;function Ul(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Zi.fromArray(i,s);let o=r.x*Math.abs(Zi.x)+r.y*Math.abs(Zi.y)+r.z*Math.abs(Zi.z),l=e.dot(Zi),c=t.dot(Zi),u=n.dot(Zi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var At=new V,da=new We,Df=0,Wt=class extends Wn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Df++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=_c,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)da.fromBufferAttribute(this,t),da.applyMatrix3(e),this.setXY(t,da.x,da.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix3(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Dn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Dn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Dn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Dn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Dn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),r=ct(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var ws=class extends Wt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Es=class extends Wt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Xt=class extends Wt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Nf=new gn,fs=new V,Fl=new V,qn=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Nf.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;fs.subVectors(e,this.center);let t=fs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(fs,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(fs.copy(e.center).add(Fl)),this.expandByPoint(fs.copy(e.center).sub(Fl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Uf=0,Mn=new ke,Ol=new jt,Ar=new V,fn=new gn,ps=new gn,Nt=new V,ln=class i extends Wn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sf(e)?Es:ws)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Oe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Mn.makeRotationFromQuaternion(e),this.applyMatrix4(Mn),this}rotateX(e){return Mn.makeRotationX(e),this.applyMatrix4(Mn),this}rotateY(e){return Mn.makeRotationY(e),this.applyMatrix4(Mn),this}rotateZ(e){return Mn.makeRotationZ(e),this.applyMatrix4(Mn),this}translate(e,t,n){return Mn.makeTranslation(e,t,n),this.applyMatrix4(Mn),this}scale(e,t,n){return Mn.makeScale(e,t,n),this.applyMatrix4(Mn),this}lookAt(e){return Ol.lookAt(e),Ol.updateMatrix(),this.applyMatrix4(Ol.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Xt(n,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];fn.setFromBufferAttribute(s),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(fn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Nt.addVectors(fn.min,ps.min),fn.expandByPoint(Nt),Nt.addVectors(fn.max,ps.max),fn.expandByPoint(Nt)):(fn.expandByPoint(ps.min),fn.expandByPoint(ps.max))}fn.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Nt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Nt));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Nt.fromBufferAttribute(o,c),l&&(Ar.fromBufferAttribute(e,c),Nt.add(Ar)),r=Math.max(r,n.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Wt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let m=0;m<n.count;m++)o[m]=new V,l[m]=new V;let c=new V,u=new V,d=new V,h=new We,p=new We,_=new We,M=new V,g=new V;function f(m,y,R){c.fromBufferAttribute(n,m),u.fromBufferAttribute(n,y),d.fromBufferAttribute(n,R),h.fromBufferAttribute(s,m),p.fromBufferAttribute(s,y),_.fromBufferAttribute(s,R),u.sub(c),d.sub(c),p.sub(h),_.sub(h);let I=1/(p.x*_.y-_.x*p.y);isFinite(I)&&(M.copy(u).multiplyScalar(_.y).addScaledVector(d,-p.y).multiplyScalar(I),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(I),o[m].add(M),o[y].add(M),o[R].add(M),l[m].add(g),l[y].add(g),l[R].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let m=0,y=b.length;m<y;++m){let R=b[m],I=R.start,F=R.count;for(let D=I,A=I+F;D<A;D+=3)f(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let L=new V,S=new V,w=new V,E=new V;function P(m){w.fromBufferAttribute(r,m),E.copy(w);let y=o[m];L.copy(y),L.sub(w.multiplyScalar(w.dot(y))).normalize(),S.crossVectors(E,y);let I=S.dot(l[m])<0?-1:1;a.setXYZW(m,L.x,L.y,L.z,I)}for(let m=0,y=b.length;m<y;++m){let R=b[m],I=R.start,F=R.count;for(let D=I,A=I+F;D<A;D+=3)P(e.getX(D+0)),P(e.getX(D+1)),P(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Wt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);let r=new V,s=new V,a=new V,o=new V,l=new V,c=new V,u=new V,d=new V;if(e)for(let h=0,p=e.count;h<p;h+=3){let _=e.getX(h+0),M=e.getX(h+1),g=e.getX(h+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,g),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u),p=0,_=0;for(let M=0,g=l.length;M<g;M++){o.isInterleavedBufferAttribute?p=l[M]*o.data.stride+o.offset:p=l[M]*u;for(let f=0;f<u;f++)h[_++]=c[p++]}return new Wt(h,u,d)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let o in r){let l=r[o],c=e(l,n);t.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let u=0,d=c.length;u<d;u++){let h=c[u],p=e(h,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],d=s[c];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ga=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=_c,this.updateRanges=[],this.version=0,this.uuid=ai()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ai()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ai()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Kt=new V,Un=class i{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix4(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyNormalMatrix(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.transformDirection(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Dn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ct(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Dn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Dn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Dn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Dn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),r=ct(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ct(t,this.array),n=ct(n,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Ss("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Wt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ss("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Bl=new V,Ff=new V,Of=new Oe,Ln=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Bl.subVectors(n,t).cross(Ff.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Bl),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Of.getNormalMatrix(e),r=this.coplanarPoint(Bl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Bf=0,Pi=class extends Wn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=ai(),this.name="",this.type="Material",this.blending=Wr,this.side=Yn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tc,this.blendDst=nc,this.blendEquation=tr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Nr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Aa,this.stencilZFail=Aa,this.stencilZPass=Aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(t){let s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Ln().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new We().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new We().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var ri=new V,zl=new V,fa=new V,pa=new V,Va=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ri.copy(this.origin).addScaledVector(this.direction,t),ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){zl.copy(e).add(t).multiplyScalar(.5),fa.copy(t).sub(e).normalize(),pa.copy(this.origin).sub(zl);let s=e.distanceTo(t)*.5,a=-this.direction.dot(fa),o=pa.dot(this.direction),l=-pa.dot(fa),c=pa.lengthSq(),u=Math.abs(1-a*a),d,h,p,_;if(u>0)if(d=a*l-o,h=a*o-l,_=s*u,d>=0)if(h>=-_)if(h<=_){let M=1/u;d*=M,h*=M,p=d*(d+a*h+2*o)+h*(a*d+h+2*l)+c}else h=s,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*l)+c;else h=-s,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*l)+c;else h<=-_?(d=Math.max(0,-(-a*s+o)),h=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+h*(h+2*l)+c):h<=_?(d=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(d=Math.max(0,-(a*s+o)),h=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+h*(h+2*l)+c);else h=a>0?-s:s,d=Math.max(0,-(a*h+o)),p=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(zl).addScaledVector(fa,h),p}intersectSphere(e,t){if(e.radius<0)return null;ri.subVectors(e.center,this.origin);let n=ri.dot(this.direction),r=ri.dot(ri)-n*n,s=e.radius*e.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ri)!==null}intersectTriangle(e,t,n,r,s){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,d=e.x-a.x,h=e.y-a.y,p=e.z-a.z,_=t.x-a.x,M=t.y-a.y,g=t.z-a.z,f=n.x-a.x,b=n.y-a.y,L=n.z-a.z,S=Math.abs(l),w=Math.abs(c),E=Math.abs(u),P,m,y,R,I,F,D,A,z,Z,K,se;if(S>=w&&S>=E?(y=l,F=d,z=_,se=f,l>=0?(P=c,m=u,R=h,I=p,D=M,A=g,Z=b,K=L):(P=u,m=c,R=p,I=h,D=g,A=M,Z=L,K=b)):w>=E?(y=c,F=h,z=M,se=b,c>=0?(P=u,m=l,R=p,I=d,D=g,A=_,Z=L,K=f):(P=l,m=u,R=d,I=p,D=_,A=g,Z=f,K=L)):(y=u,F=p,z=g,se=L,u>=0?(P=l,m=c,R=d,I=h,D=_,A=M,Z=f,K=b):(P=c,m=l,R=h,I=d,D=M,A=_,Z=b,K=f)),y===0)return null;let U=P/y,q=m/y,C=1/y,$=R-U*F,ne=I-q*F,ye=D-U*z,ce=A-q*z,le=Z-U*se,G=K-q*se,k=le*ce-G*ye,j=$*G-ne*le,ie=ye*ne-ce*$;if(r){if(k<0||j<0||ie<0)return null}else if((k<0||j<0||ie<0)&&(k>0||j>0||ie>0))return null;let oe=k+j+ie;if(oe===0)return null;let Ee=C*(k*F+j*z+ie*se);return(oe>0?Ee<0:Ee>0)?null:this.at(Ee/oe,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Qi=class extends Pi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=oo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Uu=new ke,Ji=new Va,ma=new qn,Fu=new V,ga=new V,xa=new V,_a=new V,kl=new V,va=new V,Ou=new V,ya=new V,It=class extends jt{constructor(e=new ln,t=new Qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(s&&o){va.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=o[l],d=s[l];u!==0&&(kl.fromBufferAttribute(d,e),a?va.addScaledVector(kl,u):va.addScaledVector(kl.sub(t),u))}t.add(va)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ma.copy(n.boundingSphere),ma.applyMatrix4(s),Ji.copy(e.ray).recast(e.near),!(ma.containsPoint(Ji.origin)===!1&&(Ji.intersectSphere(ma,Fu)===null||Ji.origin.distanceToSquared(Fu)>(e.far-e.near)**2))&&(Uu.copy(s).invert(),Ji.copy(e.ray).applyMatrix4(Uu),!(n.boundingBox!==null&&Ji.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ji)))}_computeIntersections(e,t,n){let r,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,M=h.length;_<M;_++){let g=h[_],f=a[g.materialIndex],b=Math.max(g.start,p.start),L=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let S=b,w=L;S<w;S+=3){let E=o.getX(S),P=o.getX(S+1),m=o.getX(S+2);r=Sa(this,f,e,n,c,u,d,E,P,m),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{let _=Math.max(0,p.start),M=Math.min(o.count,p.start+p.count);for(let g=_,f=M;g<f;g+=3){let b=o.getX(g),L=o.getX(g+1),S=o.getX(g+2);r=Sa(this,a,e,n,c,u,d,b,L,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,M=h.length;_<M;_++){let g=h[_],f=a[g.materialIndex],b=Math.max(g.start,p.start),L=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let S=b,w=L;S<w;S+=3){let E=S,P=S+1,m=S+2;r=Sa(this,f,e,n,c,u,d,E,P,m),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{let _=Math.max(0,p.start),M=Math.min(l.count,p.start+p.count);for(let g=_,f=M;g<f;g+=3){let b=g,L=g+1,S=g+2;r=Sa(this,a,e,n,c,u,d,b,L,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}};function zf(i,e,t,n,r,s,a,o){let l;if(e.side===Ut?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===Yn,o),l===null)return null;ya.copy(o),ya.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ya);return c<t.near||c>t.far?null:{distance:c,point:ya.clone(),object:i}}function Sa(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,ga),i.getVertexPosition(l,xa),i.getVertexPosition(c,_a);let u=zf(i,e,t,n,ga,xa,_a,Ou);if(u){let d=new V;Ri.getBarycoord(Ou,ga,xa,_a,d),r&&(u.uv=Ri.getInterpolatedAttribute(r,o,l,c,d,new We)),s&&(u.uv1=Ri.getInterpolatedAttribute(s,o,l,c,d,new We)),a&&(u.normal=Ri.getInterpolatedAttribute(a,o,l,c,d,new V),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new V,materialIndex:0};Ri.getNormal(ga,xa,_a,h.normal),u.face=h,u.barycoord=d}return u}var kr=class extends on{constructor(e=null,t=1,n=1,r,s,a,o,l,c=Ct,u=Ct,d,h){super(null,a,o,l,c,u,r,s,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ki=new qn,kf=new We(.5,.5),Ma=new V,Gr=class{constructor(e=new Ln,t=new Ln,n=new Ln,r=new Ln,s=new Ln,a=new Ln){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Nn,n=!1){let r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],d=s[5],h=s[6],p=s[7],_=s[8],M=s[9],g=s[10],f=s[11],b=s[12],L=s[13],S=s[14],w=s[15];if(r[0].setComponents(c-a,p-u,f-_,w-b).normalize(),r[1].setComponents(c+a,p+u,f+_,w+b).normalize(),r[2].setComponents(c+o,p+d,f+M,w+L).normalize(),r[3].setComponents(c-o,p-d,f-M,w-L).normalize(),n)r[4].setComponents(l,h,g,S).normalize(),r[5].setComponents(c-l,p-h,f-g,w-S).normalize();else if(r[4].setComponents(c-l,p-h,f-g,w-S).normalize(),t===Nn)r[5].setComponents(c+l,p+h,f+g,w+S).normalize();else if(t===Ur)r[5].setComponents(l,h,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ki.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ki.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ki)}intersectsSprite(e){Ki.center.set(0,0,0);let t=kf.distanceTo(e.center);return Ki.radius=.7071067811865476+t,Ki.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ki)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ma.x=r.normal.x>0?e.max.x:e.min.x,Ma.y=r.normal.y>0?e.max.y:e.min.y,Ma.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ma)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ts=class extends on{constructor(e=[],t=Bi,n,r,s,a,o,l,c,u){super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};var Ii=class extends on{constructor(e,t,n=On,r,s,a,o=Ct,l=Ct,c,u=Hn,d=1){if(u!==Hn&&u!==ki)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Br(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ha=class extends Ii{constructor(e,t=On,n=Bi,r,s,a=Ct,o=Ct,l,c=Hn){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},As=class extends on{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Li=class i extends ln{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],u=[],d=[],h=0,p=0;_("z","y","x",-1,-1,n,t,e,a,s,0),_("z","y","x",1,-1,n,t,-e,a,s,1),_("x","z","y",1,1,e,n,t,r,a,2),_("x","z","y",1,-1,e,n,-t,r,a,3),_("x","y","z",1,-1,e,t,n,r,s,4),_("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Xt(c,3)),this.setAttribute("normal",new Xt(u,3)),this.setAttribute("uv",new Xt(d,2));function _(M,g,f,b,L,S,w,E,P,m,y){let R=S/P,I=w/m,F=S/2,D=w/2,A=E/2,z=P+1,Z=m+1,K=0,se=0,U=new V;for(let q=0;q<Z;q++){let C=q*I-D;for(let $=0;$<z;$++){let ne=$*R-F;U[M]=ne*b,U[g]=C*L,U[f]=A,c.push(U.x,U.y,U.z),U[M]=0,U[g]=0,U[f]=E>0?1:-1,u.push(U.x,U.y,U.z),d.push($/P),d.push(1-q/m),K+=1}}for(let q=0;q<m;q++)for(let C=0;C<P;C++){let $=h+C+z*q,ne=h+C+z*(q+1),ye=h+(C+1)+z*(q+1),ce=h+(C+1)+z*q;l.push($,ne,ce),l.push(ne,ye,ce),se+=6}o.addGroup(p,se,y),p+=se,h+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Di=class i extends ln{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,d=e/o,h=t/l,p=[],_=[],M=[],g=[];for(let f=0;f<u;f++){let b=f*h-a;for(let L=0;L<c;L++){let S=L*d-s;_.push(S,-b,0),M.push(0,0,1),g.push(L/o),g.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<o;b++){let L=b+c*f,S=b+c*(f+1),w=b+1+c*(f+1),E=b+1+c*f;p.push(L,S,E),p.push(S,w,E)}this.setIndex(p),this.setAttribute("position",new Xt(_,3)),this.setAttribute("normal",new Xt(M,3)),this.setAttribute("uv",new Xt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Cs=class extends ln{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,r=new V,s=new V;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){let d=l[c],h=d.start,p=d.count;for(let _=h,M=h+p;_<M;_+=3)for(let g=0;g<3;g++){let f=o.getX(_+g),b=o.getX(_+(g+1)%3);r.fromBufferAttribute(a,f),s.fromBufferAttribute(a,b),Bu(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let u=3*o+c,d=3*o+(c+1)%3;r.fromBufferAttribute(a,u),s.fromBufferAttribute(a,d),Bu(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Xt(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Bu(i,e,t){let n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(r)===!0?!1:(t.add(n),t.add(r),!0)}function ir(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];if(zu(r))r.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(zu(r[0])){let s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function $t(i){let e={};for(let t=0;t<i.length;t++){let n=ir(i[t]);for(let r in n)e[r]=n[r]}return e}function zu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Gf(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Sc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var qs={clone:ir,merge:$t},Vf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Qt=class extends Pi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vf,this.fragmentShader=Hf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ir(e.uniforms),this.uniformsGroups=Gf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new qe().setHex(r.value);break;case"v2":this.uniforms[n].value=new We().fromArray(r.value);break;case"v3":this.uniforms[n].value=new V().fromArray(r.value);break;case"v4":this.uniforms[n].value=new Ke().fromArray(r.value);break;case"m3":this.uniforms[n].value=new Oe().fromArray(r.value);break;case"m4":this.uniforms[n].value=new ke().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},er=class extends Qt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Rs=class extends Pi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$o,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=oo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Wa=class extends Pi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Xa=class extends Pi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Cr(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Gl(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Ni=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<r)){for(let o=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=r,r=t[++n],e<r)break e}a=t.length;break t}if(!(e>=s)){let o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},qa=class extends Ni{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xl,endingEnd:Xl}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case ql:s=e,o=2*t-n;break;case Yl:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ql:a=e,l=2*n-t;break;case Yl:a=1,l=n+r[1]-r[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,p=this._weightNext,_=(n-t)/(r-t),M=_*_,g=M*_,f=-h*g+2*h*M-h*_,b=(1+h)*g+(-1.5-2*h)*M+(-.5+h)*_+1,L=(-1-p)*g+(1.5+p)*M+.5*_,S=p*g-p*M;for(let w=0;w!==o;++w)s[w]=f*a[u+w]+b*a[c+w]+L*a[l+w]+S*a[d+w];return s}},Ya=class extends Ni{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(r-t),d=1-u;for(let h=0;h!==o;++h)s[h]=a[c+h]*d+a[l+h]*u;return s}},$a=class extends Ni{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Za=class extends Ni{interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,d=this.outTangents;if(!u||!d){let _=(n-t)/(r-t),M=1-_;for(let g=0;g!==o;++g)s[g]=a[c+g]*M+a[l+g]*_;return s}let h=o*2,p=e-1;for(let _=0;_!==o;++_){let M=a[c+_],g=a[l+_],f=p*h+_*2,b=d[f],L=d[f+1],S=e*h+_*2,w=u[S],E=u[S+1],P=Xf(n,t,b,w,r);s[_]=Ah(P,M,L,E,g)}return s}};function Ah(i,e,t,n,r){let s=1-i;return s*s*s*e+3*s*s*i*t+3*s*i*i*n+i*i*i*r}function Wf(i,e,t,n,r){let s=1-i;return 3*s*s*(t-e)+6*s*i*(n-t)+3*i*i*(r-n)}function Xf(i,e,t,n,r){let s=(i-e)/(r-e);for(let a=0;a<8;a++){let o=Ah(s,e,t,n,r)-i;if(Math.abs(o)<1e-10)break;let l=Wf(s,e,t,n,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}var xn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Cr(t,this.TimeBufferType),this.values=Cr(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Cr(e.times,Array),values:Cr(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r),Gl(e.settings)&&(n.settings={inTangents:Cr(e.settings.inTangents,Array),outTangents:Cr(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new $a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new qa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Za(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case xs:t=this.InterpolantFactoryMethodDiscrete;break;case Oa:t=this.InterpolantFactoryMethodLinear;break;case Ta:t=this.InterpolantFactoryMethodSmooth;break;case Wl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Fe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return xs;case this.InterpolantFactoryMethodLinear:return Oa;case this.InterpolantFactoryMethodSmooth:return Ta;case this.InterpolantFactoryMethodBezier:return Wl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Gl(this.settings)&&(ku(this.settings.inTangents,e),ku(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,s=0,a=r-1;for(;s!==r&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Be("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(Be("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Be("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Be("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&af(r))for(let o=0,l=r.length;o!==l;++o){let c=r[o];if(isNaN(c)){Be("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ta,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(r)l=!0;else{let d=o*n,h=d-n,p=d+n;for(let _=0;_!==n;++_){let M=t[d+_];if(M!==t[h+_]||M!==t[p+_]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,h=a*n;for(let p=0;p!==n;++p)t[h+p]=t[d+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Gl(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function ku(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}xn.prototype.ValueTypeName="";xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=Oa;var Ui=class extends xn{constructor(e,t,n){super(e,t,n)}};Ui.prototype.ValueTypeName="bool";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=xs;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var Ja=class extends xn{constructor(e,t,n,r){super(e,t,n,r)}};Ja.prototype.ValueTypeName="color";var Ka=class extends xn{constructor(e,t,n,r){super(e,t,n,r)}};Ka.prototype.ValueTypeName="number";var ja=class extends Ni{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(r-t),c=e*o;for(let u=c+o;c!==u;c+=4)Xn.slerpFlat(s,0,a,c-o,a,c,l);return s}},Ps=class extends xn{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ja(this.times,this.values,this.getValueSize(),e)}};Ps.prototype.ValueTypeName="quaternion";Ps.prototype.InterpolantFactoryMethodSmooth=void 0;var Fi=class extends xn{constructor(e,t,n){super(e,t,n)}};Fi.prototype.ValueTypeName="string";Fi.prototype.ValueBufferType=Array;Fi.prototype.DefaultInterpolation=xs;Fi.prototype.InterpolantFactoryMethodLinear=void 0;Fi.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends xn{constructor(e,t,n,r){super(e,t,n,r)}};Qa.prototype.ValueTypeName="vector";var eo=class{constructor(e,t,n){let r=this,s=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let p=c[d],_=c[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Ch=new eo,to=class{constructor(e){this.manager=e!==void 0?e:Ch,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};to.DEFAULT_MATERIAL_NAME="__DEFAULT";var Is=class extends jt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var Vl=new ke,Gu=new V,Vu=new V,no=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gr,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Gu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Gu),Vu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Vu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Vl,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,a=r?r.z/s.x:1,o=r?r.w/s.y:1,l=r?r.x/s.x:0,c=r?r.y/s.y:0;e.coordinateSystem===Ur||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Vl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ba=new V,wa=new Xn,Vn=new V,ui=class extends jt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=Nn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ba,wa,Vn),Vn.x===1&&Vn.y===1&&Vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ba,wa,Vn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ba,wa,Vn),Vn.x===1&&Vn.y===1&&Vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ba,wa,Vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ci=new V,Hu=new We,Wu=new We,an=class extends ui{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Or*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Or*2*Math.atan(Math.tan(ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z)}getViewSize(e,t){return this.getViewBounds(e,Hu,Wu),t.subVectors(Wu,Hu)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ms*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Vr=class extends ui{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},$l=class extends no{constructor(){super(new Vr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ls=class extends Is{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(jt.DEFAULT_UP),this.updateMatrix(),this.target=new jt,this.shadow=new $l}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ds=class extends Is{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Ns=class extends ln{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var Rr=-90,Pr=1,io=class extends jt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new an(Rr,Pr,e,t);r.layers=this.layers,this.add(r);let s=new an(Rr,Pr,e,t);s.layers=this.layers,this.add(s);let a=new an(Rr,Pr,e,t);a.layers=this.layers,this.add(a);let o=new an(Rr,Pr,e,t);o.layers=this.layers,this.add(o);let l=new an(Rr,Pr,e,t);l.layers=this.layers,this.add(l);let c=new an(Rr,Pr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===Nn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},ro=class extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Mc="\\[\\]\\.:\\/",qf=new RegExp("["+Mc+"]","g"),bc="[^"+Mc+"]",Yf="[^"+Mc.replace("\\.","")+"]",$f=/((?:WC+[\/:])*)/.source.replace("WC",bc),Zf=/(WCOD+)?/.source.replace("WCOD",Yf),Jf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",bc),Kf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",bc),jf=new RegExp("^"+$f+Zf+Jf+Kf+"$"),Qf=["material","materials","bones","map"],Zl=class{constructor(e,t,n){let r=n||xt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},xt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(qf,"")}static parseTrackName(e){let t=jf.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);Qf.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Fe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Be("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Be("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Be("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Be("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Be("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[r];if(a===void 0){let c=t.nodeName;Be("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xt.Composite=Zl;xt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xt.prototype.GetterByBindingType=[xt.prototype._getValue_direct,xt.prototype._getValue_array,xt.prototype._getValue_arrayElement,xt.prototype._getValue_toArray];xt.prototype.SetterByBindingTypeAndVersioning=[[xt.prototype._setValue_direct,xt.prototype._setValue_direct_setNeedsUpdate,xt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_array,xt.prototype._setValue_array_setNeedsUpdate,xt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_arrayElement,xt.prototype._setValue_arrayElement_setNeedsUpdate,xt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_fromArray,xt.prototype._setValue_fromArray_setNeedsUpdate,xt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var M_=new Float32Array(1);var Oi=class extends Ga{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};var Jl=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}};var Xu=new V,Ea=new V,Ir=new V,Lr=new V,Hl=new V,ep=new V,tp=new V,Us=class{constructor(e=new V,t=new V){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Xu.subVectors(e,this.start),Ea.subVectors(this.end,this.start);let n=Ea.dot(Ea);if(n===0)return 0;let s=Ea.dot(Xu)/n;return t&&(s=He(s,0,1)),s}closestPointToPoint(e,t,n){let r=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=ep,n=tp){let r=10000000000000001e-32,s,a,o=this.start,l=e.start,c=this.end,u=e.end;Ir.subVectors(c,o),Lr.subVectors(u,l),Hl.subVectors(o,l);let d=Ir.dot(Ir),h=Lr.dot(Lr),p=Lr.dot(Hl);if(d<=r&&h<=r)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(d<=r)s=0,a=p/h,a=He(a,0,1);else{let _=Ir.dot(Hl);if(h<=r)a=0,s=He(-_/d,0,1);else{let M=Ir.dot(Lr),g=d*h-M*M;g!==0?s=He((M*p-_*h)/g,0,1):s=0,a=(M*s+p)/h,a<0?(a=0,s=He(-_/d,0,1)):a>1&&(a=1,s=He((M-_)/d,0,1))}}return t.copy(o).addScaledVector(Ir,s),n.copy(l).addScaledVector(Lr,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};function wc(i,e,t,n){let r=np(n);switch(t){case mc:return i*e;case xc:return i*e/r.components*r.byteLength;case mo:return i*e/r.components*r.byteLength;case $n:return i*e*2/r.components*r.byteLength;case go:return i*e*2/r.components*r.byteLength;case gc:return i*e*3/r.components*r.byteLength;case wn:return i*e*4/r.components*r.byteLength;case xo:return i*e*4/r.components*r.byteLength;case ks:case Gs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Vs:case Hs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case vo:case So:return Math.max(i,16)*Math.max(e,8)/4;case _o:case yo:return Math.max(i,8)*Math.max(e,8)/2;case Mo:case bo:case Eo:case To:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case wo:case Ws:case Ao:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ro:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Po:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Io:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Lo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Do:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case No:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Uo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Fo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Bo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case zo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ko:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Go:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Vo:case Ho:case Wo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Xo:case qo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xs:case Yo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function np(i){switch(i){case cn:case hc:return{byteLength:1,components:1};case Xr:case dc:case Bn:return{byteLength:2,components:1};case fo:case po:return{byteLength:2,components:4};case On:case ho:case _n:return{byteLength:4,components:1};case fc:case pc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Jh(){let i=null,e=!1,t=null,n=null;function r(s,a){n=i.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function rp(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,u);else{d.sort((p,_)=>p.start-_.start);let h=0;for(let p=1;p<d.length;p++){let _=d[h],M=d[p];M.start<=_.start+_.count+1?_.count=Math.max(_.count,M.start+M.count-_.start):(++h,d[h]=M)}d.length=h+1;for(let p=0,_=d.length;p<_;p++){let M=d[p];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var sp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ap=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,up=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,pp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_p=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ep=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Tp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Cp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Rp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Pp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Up="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Op=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,kp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$p=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Jp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Kp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,em=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,nm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,im=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,sm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,am=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,om=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,lm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,mm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_m=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ym=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Mm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Em=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Cm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Rm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Um=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Om=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,km=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Hm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Xm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ym=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$m=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,eg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,sg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ag=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,og=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,dg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,pg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_g=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,wg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Eg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Tg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ag=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Pg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ig=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ug=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Og=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:sp,alphahash_pars_fragment:ap,alphamap_fragment:op,alphamap_pars_fragment:lp,alphatest_fragment:cp,alphatest_pars_fragment:up,aomap_fragment:hp,aomap_pars_fragment:dp,batching_pars_vertex:fp,batching_vertex:pp,begin_vertex:mp,beginnormal_vertex:gp,bsdfs:xp,iridescence_fragment:_p,bumpmap_pars_fragment:vp,clipping_planes_fragment:yp,clipping_planes_pars_fragment:Sp,clipping_planes_pars_vertex:Mp,clipping_planes_vertex:bp,color_fragment:wp,color_pars_fragment:Ep,color_pars_vertex:Tp,color_vertex:Ap,common:Cp,cube_uv_reflection_fragment:Rp,defaultnormal_vertex:Pp,displacementmap_pars_vertex:Ip,displacementmap_vertex:Lp,emissivemap_fragment:Dp,emissivemap_pars_fragment:Np,colorspace_fragment:Up,colorspace_pars_fragment:Fp,envmap_fragment:Op,envmap_common_pars_fragment:Bp,envmap_pars_fragment:zp,envmap_pars_vertex:kp,envmap_physical_pars_fragment:Kp,envmap_vertex:Gp,fog_vertex:Vp,fog_pars_vertex:Hp,fog_fragment:Wp,fog_pars_fragment:Xp,gradientmap_pars_fragment:qp,lightmap_pars_fragment:Yp,lights_lambert_fragment:$p,lights_lambert_pars_fragment:Zp,lights_pars_begin:Jp,lights_toon_fragment:jp,lights_toon_pars_fragment:Qp,lights_phong_fragment:em,lights_phong_pars_fragment:tm,lights_physical_fragment:nm,lights_physical_pars_fragment:im,lights_fragment_begin:rm,lights_fragment_maps:sm,lights_fragment_end:am,lightprobes_pars_fragment:om,logdepthbuf_fragment:lm,logdepthbuf_pars_fragment:cm,logdepthbuf_pars_vertex:um,logdepthbuf_vertex:hm,map_fragment:dm,map_pars_fragment:fm,map_particle_fragment:pm,map_particle_pars_fragment:mm,metalnessmap_fragment:gm,metalnessmap_pars_fragment:xm,morphinstance_vertex:_m,morphcolor_vertex:vm,morphnormal_vertex:ym,morphtarget_pars_vertex:Sm,morphtarget_vertex:Mm,normal_fragment_begin:bm,normal_fragment_maps:wm,normal_pars_fragment:Em,normal_pars_vertex:Tm,normal_vertex:Am,normalmap_pars_fragment:Cm,clearcoat_normal_fragment_begin:Rm,clearcoat_normal_fragment_maps:Pm,clearcoat_pars_fragment:Im,iridescence_pars_fragment:Lm,opaque_fragment:Dm,packing:Nm,premultiplied_alpha_fragment:Um,project_vertex:Fm,dithering_fragment:Om,dithering_pars_fragment:Bm,roughnessmap_fragment:zm,roughnessmap_pars_fragment:km,shadowmap_pars_fragment:Gm,shadowmap_pars_vertex:Vm,shadowmap_vertex:Hm,shadowmask_pars_fragment:Wm,skinbase_vertex:Xm,skinning_pars_vertex:qm,skinning_vertex:Ym,skinnormal_vertex:$m,specularmap_fragment:Zm,specularmap_pars_fragment:Jm,tonemapping_fragment:Km,tonemapping_pars_fragment:jm,transmission_fragment:Qm,transmission_pars_fragment:eg,uv_pars_fragment:tg,uv_pars_vertex:ng,uv_vertex:ig,worldpos_vertex:rg,background_vert:sg,background_frag:ag,backgroundCube_vert:og,backgroundCube_frag:lg,cube_vert:cg,cube_frag:ug,depth_vert:hg,depth_frag:dg,distance_vert:fg,distance_frag:pg,equirect_vert:mg,equirect_frag:gg,linedashed_vert:xg,linedashed_frag:_g,meshbasic_vert:vg,meshbasic_frag:yg,meshlambert_vert:Sg,meshlambert_frag:Mg,meshmatcap_vert:bg,meshmatcap_frag:wg,meshnormal_vert:Eg,meshnormal_frag:Tg,meshphong_vert:Ag,meshphong_frag:Cg,meshphysical_vert:Rg,meshphysical_frag:Pg,meshtoon_vert:Ig,meshtoon_frag:Lg,points_vert:Dg,points_frag:Ng,shadow_vert:Ug,shadow_frag:Fg,sprite_vert:Og,sprite_frag:Bg},he={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},en={basic:{uniforms:$t([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:$t([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:$t([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:$t([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:$t([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:$t([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:$t([he.points,he.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:$t([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:$t([he.common,he.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:$t([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:$t([he.sprite,he.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:$t([he.common,he.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:$t([he.lights,he.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};en.physical={uniforms:$t([en.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};var Ko={r:0,b:0,g:0},zg=new ke,Kh=new Oe;Kh.set(-1,0,0,0,1,0,0,0,1);function kg(i,e,t,n,r,s){let a=new qe(0),o=r===!0?0:1,l,c,u=null,d=0,h=null;function p(b){let L=b.isScene===!0?b.background:null;if(L&&L.isTexture){let S=b.backgroundBlurriness>0;L=e.get(L,S)}return L}function _(b){let L=!1,S=p(b);S===null?g(a,o):S&&S.isColor&&(g(S,1),L=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||L)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(b,L){let S=p(L);S&&(S.isCubeTexture||S.mapping===Bs)?(c===void 0&&(c=new It(new Li(1,1,1),new Qt({name:"BackgroundCubeMaterial",uniforms:ir(en.backgroundCube.uniforms),vertexShader:en.backgroundCube.vertexShader,fragmentShader:en.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,E,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(zg.makeRotationFromEuler(L.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Kh),c.material.toneMapped=Je.getTransfer(S.colorSpace)!==ot,(u!==S||d!==S.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=S,d=S.version,h=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new It(new Di(2,2),new Qt({name:"BackgroundMaterial",uniforms:ir(en.background.uniforms),vertexShader:en.background.vertexShader,fragmentShader:en.background.fragmentShader,side:Yn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,l.material.toneMapped=Je.getTransfer(S.colorSpace)!==ot,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,h=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function g(b,L){b.getRGB(Ko,Sc(i)),t.buffers.color.setClear(Ko.r,Ko.g,Ko.b,L,s)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,L=1){a.set(b),o=L,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,g(a,o)},render:_,addToRenderList:M,dispose:f}}function Gg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null),s=r,a=!1;function o(I,F,D,A,z){let Z=!1,K=d(I,A,D,F);s!==K&&(s=K,c(s.object)),Z=p(I,A,D,z),Z&&_(I,A,D,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,S(I,F,D,A),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function u(I){return i.deleteVertexArray(I)}function d(I,F,D,A){let z=A.wireframe===!0,Z=n[F.id];Z===void 0&&(Z={},n[F.id]=Z);let K=I.isInstancedMesh===!0?I.id:0,se=Z[K];se===void 0&&(se={},Z[K]=se);let U=se[D.id];U===void 0&&(U={},se[D.id]=U);let q=U[z];return q===void 0&&(q=h(l()),U[z]=q),q}function h(I){let F=[],D=[],A=[];for(let z=0;z<t;z++)F[z]=0,D[z]=0,A[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:D,attributeDivisors:A,object:I,attributes:{},index:null}}function p(I,F,D,A){let z=s.attributes,Z=F.attributes,K=0,se=D.getAttributes();for(let U in se)if(se[U].location>=0){let C=z[U],$=Z[U];if($===void 0&&(U==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),U==="instanceColor"&&I.instanceColor&&($=I.instanceColor)),C===void 0||C.attribute!==$||$&&C.data!==$.data)return!0;K++}return s.attributesNum!==K||s.index!==A}function _(I,F,D,A){let z={},Z=F.attributes,K=0,se=D.getAttributes();for(let U in se)if(se[U].location>=0){let C=Z[U];C===void 0&&(U==="instanceMatrix"&&I.instanceMatrix&&(C=I.instanceMatrix),U==="instanceColor"&&I.instanceColor&&(C=I.instanceColor));let $={};$.attribute=C,C&&C.data&&($.data=C.data),z[U]=$,K++}s.attributes=z,s.attributesNum=K,s.index=A}function M(){let I=s.newAttributes;for(let F=0,D=I.length;F<D;F++)I[F]=0}function g(I){f(I,0)}function f(I,F){let D=s.newAttributes,A=s.enabledAttributes,z=s.attributeDivisors;D[I]=1,A[I]===0&&(i.enableVertexAttribArray(I),A[I]=1),z[I]!==F&&(i.vertexAttribDivisor(I,F),z[I]=F)}function b(){let I=s.newAttributes,F=s.enabledAttributes;for(let D=0,A=F.length;D<A;D++)F[D]!==I[D]&&(i.disableVertexAttribArray(D),F[D]=0)}function L(I,F,D,A,z,Z,K){K===!0?i.vertexAttribIPointer(I,F,D,z,Z):i.vertexAttribPointer(I,F,D,A,z,Z)}function S(I,F,D,A){M();let z=A.attributes,Z=D.getAttributes(),K=F.defaultAttributeValues;for(let se in Z){let U=Z[se];if(U.location>=0){let q=z[se];if(q===void 0&&(se==="instanceMatrix"&&I.instanceMatrix&&(q=I.instanceMatrix),se==="instanceColor"&&I.instanceColor&&(q=I.instanceColor)),q!==void 0){let C=q.normalized,$=q.itemSize,ne=e.get(q);if(ne===void 0)continue;let ye=ne.buffer,ce=ne.type,le=ne.bytesPerElement,G=ce===i.INT||ce===i.UNSIGNED_INT||q.gpuType===ho;if(q.isInterleavedBufferAttribute){let k=q.data,j=k.stride,ie=q.offset;if(k.isInstancedInterleavedBuffer){for(let oe=0;oe<U.locationSize;oe++)f(U.location+oe,k.meshPerAttribute);I.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let oe=0;oe<U.locationSize;oe++)g(U.location+oe);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let oe=0;oe<U.locationSize;oe++)L(U.location+oe,$/U.locationSize,ce,C,j*le,(ie+$/U.locationSize*oe)*le,G)}else{if(q.isInstancedBufferAttribute){for(let k=0;k<U.locationSize;k++)f(U.location+k,q.meshPerAttribute);I.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let k=0;k<U.locationSize;k++)g(U.location+k);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let k=0;k<U.locationSize;k++)L(U.location+k,$/U.locationSize,ce,C,$*le,$/U.locationSize*k*le,G)}}else if(K!==void 0){let C=K[se];if(C!==void 0)switch(C.length){case 2:i.vertexAttrib2fv(U.location,C);break;case 3:i.vertexAttrib3fv(U.location,C);break;case 4:i.vertexAttrib4fv(U.location,C);break;default:i.vertexAttrib1fv(U.location,C)}}}}b()}function w(){y();for(let I in n){let F=n[I];for(let D in F){let A=F[D];for(let z in A){let Z=A[z];for(let K in Z)u(Z[K].object),delete Z[K];delete A[z]}}delete n[I]}}function E(I){if(n[I.id]===void 0)return;let F=n[I.id];for(let D in F){let A=F[D];for(let z in A){let Z=A[z];for(let K in Z)u(Z[K].object),delete Z[K];delete A[z]}}delete n[I.id]}function P(I){for(let F in n){let D=n[F];for(let A in D){let z=D[A];if(z[I.id]===void 0)continue;let Z=z[I.id];for(let K in Z)u(Z[K].object),delete Z[K];delete z[I.id]}}}function m(I){for(let F in n){let D=n[F],A=I.isInstancedMesh===!0?I.id:0,z=D[A];if(z!==void 0){for(let Z in z){let K=z[Z];for(let se in K)u(K[se].object),delete K[se];delete z[Z]}delete D[A],Object.keys(D).length===0&&delete n[F]}}}function y(){R(),a=!0,s!==r&&(s=r,c(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:y,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:m,releaseStatesOfProgram:P,initAttributes:M,enableAttribute:g,disableUnusedAttributes:b}}function Vg(i,e,t){let n;function r(l){n=l}function s(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let p=0;p<u;p++)h+=c[p];t.update(h,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function Hg(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(P){return!(P!==wn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let m=P===Bn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==cn&&P!==_n&&!m&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Fe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Fe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),L=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:p,maxVertexTextures:_,maxTextureSize:M,maxCubemapSize:g,maxAttributes:f,maxVertexUniforms:b,maxVaryings:L,maxFragmentUniforms:S,maxSamples:w,samples:E}}function Wg(i){let e=this,t=null,n=0,r=!1,s=!1,a=new Ln,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let p=d.length!==0||h||n!==0||r;return r=h,n=d.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){let _=d.clippingPlanes,M=d.clipIntersection,g=d.clipShadows,f=i.get(d);if(!r||_===null||_.length===0||s&&!g)s?u(null):c();else{let b=s?0:n,L=b*4,S=f.clippingState||null;l.value=S,S=u(_,h,L,p);for(let w=0;w!==L;++w)S[w]=t[w];f.clippingState=S,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,p,_){let M=d!==null?d.length:0,g=null;if(M!==0){if(g=l.value,_!==!0||g===null){let f=p+M*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<f)&&(g=new Float32Array(f));for(let L=0,S=p;L!==M;++L,S+=4)a.copy(d[L]).applyMatrix4(b,o),a.normal.toArray(g,S),g[S+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}var Zr=4,Xg=6,qg=20,Yg=256,Ys=new Vr,Rh=new qe,Ec=null,Tc=0,Ac=0,Cc=!1,$g=new V,rr=new V,Qo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){let{size:a=256,position:o=$g}=s;Ec=this._renderer.getRenderTarget(),Tc=this._renderer.getActiveCubeFace(),Ac=this._renderer.getActiveMipmapLevel(),Cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Lh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ih(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Ec,Tc,Ac),this._renderer.xr.enabled=Cc,e.scissorTest=!1,$r(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Bi||e.mapping===nr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ec=this._renderer.getRenderTarget(),Tc=this._renderer.getActiveCubeFace(),Ac=this._renderer.getActiveMipmapLevel(),Cc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Pt,minFilter:Pt,generateMipmaps:!1,type:Bn,format:wn,colorSpace:_s,depthBuffer:!1},r=Ph(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ph(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Zg(s)),this._blurMaterial=Kg(s,e,t),this._ggxMaterial=Jg(s,e,t)}return r}_compileMaterial(e){let t=new It(new ln,e);this._renderer.compile(t,Ys)}_sceneToCubeUV(e,t,n,r,s){let l=new an(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,p=d.toneMapping;d.getClearColor(Rh),d.toneMapping=Fn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new It(new Li,new Qi({name:"PMREM.Background",side:Ut,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,g=M.material,f=!1,b=e.background;b?b.isColor&&(g.color.copy(b),e.background=null,f=!0):(g.color.copy(Rh),f=!0);for(let L=0;L<6;L++){let S=L%3;S===0?(l.up.set(0,c[L],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[L],s.y,s.z)):S===1?(l.up.set(0,0,c[L]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[L],s.z)):(l.up.set(0,c[L],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[L]));let w=this._cubeSize;$r(r,S*w,L>2?w:0,w,w),d.setRenderTarget(r),f&&d.render(M,l),d.render(e,l)}d.toneMapping=p,d.autoClear=h,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===Bi||e.mapping===nr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Lh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ih());let s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let o=s.uniforms;o.envMap.value=e;let l=this._cubeSize;$r(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ys)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,p=d*h,{_lodMax:_}=this,M=this._sizeLods[n],g=3*M*(n>_-Zr?n-_+Zr:0),f=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=_-t,$r(s,g,f,3*M,2*M),r.setRenderTarget(s),r.render(o,Ys),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=_-n,$r(e,g,f,3*M,2*M),r.setRenderTarget(e),r.render(o,Ys)}_blur(e,t,n,r){let s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,r,s){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[r];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[r],d=3*u*(r>this._lodMax-Zr?r-this._lodMax+Zr:0),h=4*(this._cubeSize-u);$r(t,d,h,3*u,2*u),a.setRenderTarget(t),a.render(l,Ys)}};function Zg(i){let e=[],t=[],n=i,r=i-Zr+1+Xg;for(let s=0;s<r;s++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,p=3,_=new Float32Array(p*h*d),M=new Float32Array(p*h*d);for(let f=0;f<d;f++){let b=f%3*2/3-1,L=f>2?0:-1,S=[b,L,0,b+2/3,L,0,b+2/3,L+1,0,b,L,0,b+2/3,L+1,0,b,L+1,0];_.set(S,p*h*f);for(let w=0;w<h;w++){let E=u[w*2]*2-1,P=u[w*2+1]*2-1;f===0?rr.set(1,P,E):f===1?rr.set(-E,1,-P):f===2?rr.set(-E,P,1):f===3?rr.set(-1,P,-E):f===4?rr.set(-E,-1,P):rr.set(E,P,-1),rr.toArray(M,(f*h+w)*p)}}let g=new ln;g.setAttribute("position",new Wt(_,p)),g.setAttribute("outputDirection",new Wt(M,p)),t.push(new It(g,null)),n>Zr&&n--}return{lodMeshes:t,sizeLods:e}}function Ph(i,e,t){let n=new qt(i,e,t);return n.texture.mapping=Bs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $r(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Jg(i,e,t){return new Qt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Yg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:tl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Kg(i,e,t){return new Qt({name:"SphericalGaussianBlur",defines:{SAMPLES:qg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:tl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Ih(){return new Qt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Lh(){return new Qt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:tl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function tl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var el=class extends qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ts(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Li(5,5,5),s=new Qt({name:"CubemapFromEquirect",uniforms:ir(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ut,blending:bn});s.uniforms.tEquirect.value=t;let a=new It(r,s),o=t.minFilter;return t.minFilter===zi&&(t.minFilter=Pt),new io(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}};function jg(i){let e=new WeakMap,t=new WeakMap,n=null;function r(h,p=!1){return h==null?null:p?a(h):s(h)}function s(h){if(h&&h.isTexture){let p=h.mapping;if(p===lo||p===co)if(e.has(h)){let _=e.get(h).texture;return o(_,h.mapping)}else{let _=h.image;if(_&&_.height>0){let M=new el(_.height);return M.fromEquirectangularTexture(i,h),e.set(h,M),h.addEventListener("dispose",c),o(M.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let p=h.mapping,_=p===lo||p===co,M=p===Bi||p===nr;if(_||M){let g=t.get(h),f=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return n===null&&(n=new Qo(i)),g=_?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let b=h.image;return _&&b&&b.height>0||M&&b&&l(b)?(n===null&&(n=new Qo(i)),g=_?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,p){return p===lo?h.mapping=Bi:p===co&&(h.mapping=nr),h}function l(h){let p=0,_=6;for(let M=0;M<_;M++)h[M]!==void 0&&p++;return p===_}function c(h){let p=h.target;p.removeEventListener("dispose",c);let _=e.get(p);_!==void 0&&(e.delete(p),_.dispose())}function u(h){let p=h.target;p.removeEventListener("dispose",u);let _=t.get(p);_!==void 0&&(t.delete(p),_.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:d}}function Qg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&ji("WebGLRenderer: "+n+" extension not supported."),r}}}function e0(i,e,t,n){let r={},s=new WeakMap;function a(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",a),delete r[h.id];let p=s.get(h);p&&(e.remove(p),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let p in h)e.update(h[p],i.ARRAY_BUFFER)}function c(d){let h=[],p=d.index,_=d.attributes.position,M=0;if(_===void 0)return;if(p!==null){let b=p.array;M=p.version;for(let L=0,S=b.length;L<S;L+=3){let w=b[L+0],E=b[L+1],P=b[L+2];h.push(w,E,E,P,P,w)}}else{let b=_.array;M=_.version;for(let L=0,S=b.length/3-1;L<S;L+=3){let w=L+0,E=L+1,P=L+2;h.push(w,E,E,P,P,w)}}let g=new(_.count>=65535?Es:ws)(h,1);g.version=M;let f=s.get(d);f&&e.remove(f),s.set(d,g)}function u(d){let h=s.get(d);if(h){let p=d.index;p!==null&&h.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function t0(i,e,t){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,h){i.drawElements(n,h,s,d*a),t.update(h,n,1)}function c(d,h,p){p!==0&&(i.drawElementsInstanced(n,h,s,d*a,p),t.update(h,n,p))}function u(d,h,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,s,d,0,p);let M=0;for(let g=0;g<p;g++)M+=h[g];t.update(M,n,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function n0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:Be("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function i0(i,e,t){let n=new WeakMap,r=new Ke;function s(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==d){let y=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",y)};h!==void 0&&h.texture.dispose();let p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],L=0;p===!0&&(L=1),_===!0&&(L=2),M===!0&&(L=3);let S=o.attributes.position.count*L,w=1;S>e.maxTextureSize&&(w=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let E=new Float32Array(S*w*4*d),P=new Ms(E,S,w,d);P.type=_n,P.needsUpdate=!0;let m=L*4;for(let R=0;R<d;R++){let I=g[R],F=f[R],D=b[R],A=S*w*4*R;for(let z=0;z<I.count;z++){let Z=z*m;p===!0&&(r.fromBufferAttribute(I,z),E[A+Z+0]=r.x,E[A+Z+1]=r.y,E[A+Z+2]=r.z,E[A+Z+3]=0),_===!0&&(r.fromBufferAttribute(F,z),E[A+Z+4]=r.x,E[A+Z+5]=r.y,E[A+Z+6]=r.z,E[A+Z+7]=0),M===!0&&(r.fromBufferAttribute(D,z),E[A+Z+8]=r.x,E[A+Z+9]=r.y,E[A+Z+10]=r.z,E[A+Z+11]=D.itemSize===4?r.w:1)}}h={count:d,texture:P,size:new We(S,w)},n.set(o,h),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let M=0;M<c.length;M++)p+=c[M];let _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function r0(i,e,t,n,r){let s=new WeakMap;function a(c){let u=r.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let p=c.skeleton;s.get(p)!==u&&(p.update(),s.set(p,u))}return h}function o(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var s0={[ic]:"LINEAR_TONE_MAPPING",[rc]:"REINHARD_TONE_MAPPING",[sc]:"CINEON_TONE_MAPPING",[ac]:"ACES_FILMIC_TONE_MAPPING",[lc]:"AGX_TONE_MAPPING",[cc]:"NEUTRAL_TONE_MAPPING",[oc]:"CUSTOM_TONE_MAPPING"};function a0(i,e,t,n,r,s){let a=new qt(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new ln;c.setAttribute("position",new Xt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Xt([0,2,0,0,2,0],2));let u=new er({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new It(c,u),h=new Vr(-1,1,1,-1,0,1),p=null,_=null,M=!1,g,f=null,b=[],L=!1;this.setSize=function(S,w){a.setSize(S,w),o!==null&&o.setSize(S,w),l!==null&&l.setSize(S,w);for(let E=0;E<b.length;E++){let P=b[E];P.setSize&&P.setSize(S,w)}},this.setEffects=function(S){b=S,L=b.length>0&&b[0].isRenderPass===!0;let w=a.width,E=a.height;b.length>0&&o===null&&(o=new qt(w,E,{type:Bn,depthBuffer:!1,stencilBuffer:!1}),l=new qt(w,E,{type:Bn,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<b.length;P++){let m=b[P];m.setSize&&m.setSize(w,E)}},this.begin=function(S,w){if(M||S.toneMapping===Fn&&b.length===0)return!1;if(f=w,w!==null){let E=w.width,P=w.height;(a.width!==E||a.height!==P)&&this.setSize(E,P)}return L===!1&&S.setRenderTarget(a),g=S.toneMapping,S.toneMapping=Fn,!0},this.hasRenderPass=function(){return L},this.end=function(S,w){S.toneMapping=g,M=!0;let E=a,P=o;for(let m=0;m<b.length;m++){let y=b[m];y.enabled!==!1&&(y.render(S,P,E,w),y.needsSwap!==!1&&(E=P,P=P===o?l:o))}if(p!==S.outputColorSpace||_!==S.toneMapping){p=S.outputColorSpace,_=S.toneMapping,u.defines={},Je.getTransfer(p)===ot&&(u.defines.SRGB_TRANSFER="");let m=s0[_];m&&(u.defines[m]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=E.texture,S.setRenderTarget(f),S.render(d,h),f=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var jh=new on,Ic=new Ii(1,1),Qh=new Ms,ed=new ka,td=new Ts,Dh=[],Nh=[],Uh=new Float32Array(16),Fh=new Float32Array(9),Oh=new Float32Array(4);function jr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=Dh[r];if(s===void 0&&(s=new Float32Array(r),Dh[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Lt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Dt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function nl(i,e){let t=Nh[e];t===void 0&&(t=new Int32Array(e),Nh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function o0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function l0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2fv(this.addr,e),Dt(t,e)}}function c0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;i.uniform3fv(this.addr,e),Dt(t,e)}}function u0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4fv(this.addr,e),Dt(t,e)}}function h0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;Oh.set(n),i.uniformMatrix2fv(this.addr,!1,Oh),Dt(t,n)}}function d0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;Fh.set(n),i.uniformMatrix3fv(this.addr,!1,Fh),Dt(t,n)}}function f0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;Uh.set(n),i.uniformMatrix4fv(this.addr,!1,Uh),Dt(t,n)}}function p0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function m0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2iv(this.addr,e),Dt(t,e)}}function g0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3iv(this.addr,e),Dt(t,e)}}function x0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4iv(this.addr,e),Dt(t,e)}}function _0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function v0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2uiv(this.addr,e),Dt(t,e)}}function y0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3uiv(this.addr,e),Dt(t,e)}}function S0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4uiv(this.addr,e),Dt(t,e)}}function M0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Ic.compareFunction=t.isReversedDepthBuffer()?Jo:Zo,s=Ic):s=jh,t.setTexture2D(e||s,r)}function b0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||ed,r)}function w0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||td,r)}function E0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Qh,r)}function T0(i){switch(i){case 5126:return o0;case 35664:return l0;case 35665:return c0;case 35666:return u0;case 35674:return h0;case 35675:return d0;case 35676:return f0;case 5124:case 35670:return p0;case 35667:case 35671:return m0;case 35668:case 35672:return g0;case 35669:case 35673:return x0;case 5125:return _0;case 36294:return v0;case 36295:return y0;case 36296:return S0;case 35678:case 36198:case 36298:case 36306:case 35682:return M0;case 35679:case 36299:case 36307:return b0;case 35680:case 36300:case 36308:case 36293:return w0;case 36289:case 36303:case 36311:case 36292:return E0}}function A0(i,e){i.uniform1fv(this.addr,e)}function C0(i,e){let t=jr(e,this.size,2);i.uniform2fv(this.addr,t)}function R0(i,e){let t=jr(e,this.size,3);i.uniform3fv(this.addr,t)}function P0(i,e){let t=jr(e,this.size,4);i.uniform4fv(this.addr,t)}function I0(i,e){let t=jr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function L0(i,e){let t=jr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function D0(i,e){let t=jr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function N0(i,e){i.uniform1iv(this.addr,e)}function U0(i,e){i.uniform2iv(this.addr,e)}function F0(i,e){i.uniform3iv(this.addr,e)}function O0(i,e){i.uniform4iv(this.addr,e)}function B0(i,e){i.uniform1uiv(this.addr,e)}function z0(i,e){i.uniform2uiv(this.addr,e)}function k0(i,e){i.uniform3uiv(this.addr,e)}function G0(i,e){i.uniform4uiv(this.addr,e)}function V0(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ic:a=jh;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function H0(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||ed,s[a])}function W0(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||td,s[a])}function X0(i,e,t){let n=this.cache,r=e.length,s=nl(t,r);Lt(n,s)||(i.uniform1iv(this.addr,s),Dt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Qh,s[a])}function q0(i){switch(i){case 5126:return A0;case 35664:return C0;case 35665:return R0;case 35666:return P0;case 35674:return I0;case 35675:return L0;case 35676:return D0;case 5124:case 35670:return N0;case 35667:case 35671:return U0;case 35668:case 35672:return F0;case 35669:case 35673:return O0;case 5125:return B0;case 36294:return z0;case 36295:return k0;case 36296:return G0;case 35678:case 36198:case 36298:case 36306:case 35682:return V0;case 35679:case 36299:case 36307:return H0;case 35680:case 36300:case 36308:case 36293:return W0;case 36289:case 36303:case 36311:case 36292:return X0}}var Lc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=T0(t.type)}},Dc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q0(t.type)}},Nc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(e,t[o.id],n)}}},Rc=/(\w+)(\])?(\[|\.)?/g;function Bh(i,e){i.seq.push(e),i.map[e.id]=e}function Y0(i,e,t){let n=i.name,r=n.length;for(Rc.lastIndex=0;;){let s=Rc.exec(n),a=Rc.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Bh(t,c===void 0?new Lc(o,i,e):new Dc(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Nc(o),Bh(t,d)),t=d}}}var Jr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Y0(o,l,this)}let r=[],s=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let a=e[r];a.id in t&&n.push(a)}return n}};function zh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var $0=37297,Z0=0;function J0(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var kh=new Oe;function K0(i){Je._getMatrix(kh,Je.workingColorSpace,i);let e=`mat3( ${kh.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case vs:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Gh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+J0(i.getShaderSource(e),o)}else return s}function j0(i,e){let t=K0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var Q0={[ic]:"Linear",[rc]:"Reinhard",[sc]:"Cineon",[ac]:"ACESFilmic",[lc]:"AgX",[cc]:"Neutral",[oc]:"Custom"};function ex(i,e){let t=Q0[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jo=new V;function tx(){Je.getLuminanceCoefficients(jo);let i=jo.x.toFixed(4),e=jo.y.toFixed(4),t=jo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function nx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zs).join(`
`)}function ix(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function rx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),a=s.name,o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Zs(i){return i!==""}function Vh(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Hh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var sx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uc(i){return i.replace(sx,ox)}var ax=new Map;function ox(i,e){let t=Ye[e];if(t===void 0){let n=ax.get(e);if(n!==void 0)t=Ye[n],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Uc(t)}var lx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wh(i){return i.replace(lx,cx)}function cx(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Xh(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var ux={[Fs]:"SHADOWMAP_TYPE_PCF",[Hr]:"SHADOWMAP_TYPE_VSM"};function hx(i){return ux[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var dx={[Bi]:"ENVMAP_TYPE_CUBE",[nr]:"ENVMAP_TYPE_CUBE",[Bs]:"ENVMAP_TYPE_CUBE_UV"};function fx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":dx[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var px={[nr]:"ENVMAP_MODE_REFRACTION"};function mx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":px[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var gx={[oo]:"ENVMAP_BLENDING_MULTIPLY",[uh]:"ENVMAP_BLENDING_MIX",[hh]:"ENVMAP_BLENDING_ADD"};function xx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":gx[i.combine]||"ENVMAP_BLENDING_NONE"}function _x(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function vx(i,e,t,n){let r=i.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=hx(t),c=fx(t),u=mx(t),d=xx(t),h=_x(t),p=nx(t),_=ix(s),M=r.createProgram(),g,f,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Zs).join(`
`),g.length>0&&(g+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Zs).join(`
`),f.length>0&&(f+=`
`)):(g=[Xh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zs).join(`
`),f=[Xh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Fn?"#define TONE_MAPPING":"",t.toneMapping!==Fn?Ye.tonemapping_pars_fragment:"",t.toneMapping!==Fn?ex("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,j0("linearToOutputTexel",t.outputColorSpace),tx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zs).join(`
`)),a=Uc(a),a=Vh(a,t),a=Hh(a,t),o=Uc(o),o=Vh(o,t),o=Hh(o,t),a=Wh(a),o=Wh(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,f=["#define varying in",t.glslVersion===Yr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let L=b+g+a,S=b+f+o,w=zh(r,r.VERTEX_SHADER,L),E=zh(r,r.FRAGMENT_SHADER,S);r.attachShader(M,w),r.attachShader(M,E),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function P(I){if(i.debug.checkShaderErrors){let F=r.getProgramInfoLog(M)||"",D=r.getShaderInfoLog(w)||"",A=r.getShaderInfoLog(E)||"",z=F.trim(),Z=D.trim(),K=A.trim(),se=!0,U=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(se=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,M,w,E);else{let q=Gh(r,w,"vertex"),C=Gh(r,E,"fragment");Be("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+z+`
`+q+`
`+C)}else z!==""?Fe("WebGLProgram: Program Info Log:",z):(Z===""||K==="")&&(U=!1);U&&(I.diagnostics={runnable:se,programLog:z,vertexShader:{log:Z,prefix:g},fragmentShader:{log:K,prefix:f}})}r.deleteShader(w),r.deleteShader(E),m=new Jr(r,M),y=rx(r,M)}let m;this.getUniforms=function(){return m===void 0&&P(this),m};let y;this.getAttributes=function(){return y===void 0&&P(this),y};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(M,$0)),R},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Z0++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=w,this.fragmentShader=E,this}var yx=0,Fc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Oc(e),t.set(e,n)),n}},Oc=class{constructor(e){this.id=yx++,this.code=e,this.usedTimes=0}};function Sx(i){return i===$n||i===Ws||i===Xs}function Mx(i,e,t,n,r,s){let a=new bs,o=new Fc,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(m){return l.add(m),m===0?"uv":`uv${m}`}function M(m,y,R,I,F,D){let A=I.fog,z=F.geometry,Z=m.isMeshStandardMaterial||m.isMeshLambertMaterial||m.isMeshPhongMaterial?I.environment:null,K=m.isMeshStandardMaterial||m.isMeshLambertMaterial&&!m.envMap||m.isMeshPhongMaterial&&!m.envMap,se=e.get(m.envMap||Z,K),U=se&&se.mapping===Bs?se.image.height:null,q=p[m.type];m.precision!==null&&(h=n.getMaxPrecision(m.precision),h!==m.precision&&Fe("WebGLProgram.getParameters:",m.precision,"not supported, using",h,"instead."));let C=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,$=C!==void 0?C.length:0,ne=0;z.morphAttributes.position!==void 0&&(ne=1),z.morphAttributes.normal!==void 0&&(ne=2),z.morphAttributes.color!==void 0&&(ne=3);let ye,ce,le,G;if(q){let ft=en[q];ye=ft.vertexShader,ce=ft.fragmentShader}else{ye=m.vertexShader,ce=m.fragmentShader;let ft=o.getVertexShaderStage(m),st=o.getFragmentShaderStage(m);o.update(m,ft,st),le=ft.id,G=st.id}let k=i.getRenderTarget(),j=i.state.buffers.depth.getReversed(),ie=F.isInstancedMesh===!0,oe=F.isBatchedMesh===!0,Ee=!!m.map,je=!!m.matcap,ze=!!se,Re=!!m.aoMap,nt=!!m.lightMap,Ge=!!m.bumpMap&&m.wireframe===!1,it=!!m.normalMap,mt=!!m.displacementMap,bt=!!m.emissiveMap,Qe=!!m.metalnessMap,rt=!!m.roughnessMap,N=m.anisotropy>0,$e=m.clearcoat>0,Ne=m.dispersion>0,T=m.retroreflectivity>0,x=m.iridescence>0,H=m.sheen>0,Y=m.transmission>0,Q=N&&!!m.anisotropyMap,ue=$e&&!!m.clearcoatMap,de=$e&&!!m.clearcoatNormalMap,ee=$e&&!!m.clearcoatRoughnessMap,re=x&&!!m.iridescenceMap,fe=x&&!!m.iridescenceThicknessMap,Ie=H&&!!m.sheenColorMap,xe=H&&!!m.sheenRoughnessMap,pe=!!m.specularMap,Le=!!m.specularColorMap,Ue=!!m.specularIntensityMap,Ve=Y&&!!m.transmissionMap,B=Y&&!!m.thicknessMap,me=!!m.gradientMap,te=!!m.alphaMap,ge=m.alphaTest>0,Se=!!m.alphaHash,ae=!!m.extensions,De=Fn;m.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(De=i.toneMapping);let Ce={shaderID:q,shaderType:m.type,shaderName:m.name,vertexShader:ye,fragmentShader:ce,defines:m.defines,customVertexShaderID:le,customFragmentShaderID:G,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:h,batching:oe,batchingColor:oe&&F._colorsTexture!==null,instancing:ie,instancingColor:ie&&F.instanceColor!==null,instancingMorph:ie&&F.morphTexture!==null,outputColorSpace:k===null?i.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!m.alphaToCoverage,map:Ee,matcap:je,envMap:ze,envMapMode:ze&&se.mapping,envMapCubeUVHeight:U,aoMap:Re,lightMap:nt,bumpMap:Ge,normalMap:it,displacementMap:mt,emissiveMap:bt,normalMapObjectSpace:it&&m.normalMapType===ph,normalMapTangentSpace:it&&m.normalMapType===$o,packedNormalMap:it&&m.normalMapType===$o&&Sx(m.normalMap.format),metalnessMap:Qe,roughnessMap:rt,anisotropy:N,anisotropyMap:Q,clearcoat:$e,clearcoatMap:ue,clearcoatNormalMap:de,clearcoatRoughnessMap:ee,dispersion:Ne,retroreflection:T,iridescence:x,iridescenceMap:re,iridescenceThicknessMap:fe,sheen:H,sheenColorMap:Ie,sheenRoughnessMap:xe,specularMap:pe,specularColorMap:Le,specularIntensityMap:Ue,transmission:Y,transmissionMap:Ve,thicknessMap:B,gradientMap:me,opaque:m.transparent===!1&&m.blending===Wr&&m.alphaToCoverage===!1,alphaMap:te,alphaTest:ge,alphaHash:Se,combine:m.combine,mapUv:Ee&&_(m.map.channel),aoMapUv:Re&&_(m.aoMap.channel),lightMapUv:nt&&_(m.lightMap.channel),bumpMapUv:Ge&&_(m.bumpMap.channel),normalMapUv:it&&_(m.normalMap.channel),displacementMapUv:mt&&_(m.displacementMap.channel),emissiveMapUv:bt&&_(m.emissiveMap.channel),metalnessMapUv:Qe&&_(m.metalnessMap.channel),roughnessMapUv:rt&&_(m.roughnessMap.channel),anisotropyMapUv:Q&&_(m.anisotropyMap.channel),clearcoatMapUv:ue&&_(m.clearcoatMap.channel),clearcoatNormalMapUv:de&&_(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&_(m.clearcoatRoughnessMap.channel),iridescenceMapUv:re&&_(m.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&_(m.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&_(m.sheenColorMap.channel),sheenRoughnessMapUv:xe&&_(m.sheenRoughnessMap.channel),specularMapUv:pe&&_(m.specularMap.channel),specularColorMapUv:Le&&_(m.specularColorMap.channel),specularIntensityMapUv:Ue&&_(m.specularIntensityMap.channel),transmissionMapUv:Ve&&_(m.transmissionMap.channel),thicknessMapUv:B&&_(m.thicknessMap.channel),alphaMapUv:te&&_(m.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(it||N),vertexNormals:!!z.attributes.normal,vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!z.attributes.uv&&(Ee||te),fog:!!A,useFog:m.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:m.wireframe===!1&&(m.flatShading===!0||z.attributes.normal===void 0&&it===!1&&(m.isMeshLambertMaterial||m.isMeshPhongMaterial||m.isMeshStandardMaterial||m.isMeshPhysicalMaterial)),sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:ne,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:m.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:Ee&&m.map.isVideoTexture===!0&&Je.getTransfer(m.map.colorSpace)===ot,decodeVideoTextureEmissive:bt&&m.emissiveMap.isVideoTexture===!0&&Je.getTransfer(m.emissiveMap.colorSpace)===ot,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===Yt,flipSided:m.side===Ut,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionClipCullDistance:ae&&m.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&m.extensions.multiDraw===!0||oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function g(m){let y=[];if(m.shaderID?y.push(m.shaderID):(y.push(m.customVertexShaderID),y.push(m.customFragmentShaderID)),m.defines!==void 0)for(let R in m.defines)y.push(R),y.push(m.defines[R]);return m.isRawShaderMaterial===!1&&(f(y,m),b(y,m),y.push(i.outputColorSpace)),y.push(m.customProgramCacheKey),y.join()}function f(m,y){m.push(y.precision),m.push(y.outputColorSpace),m.push(y.envMapMode),m.push(y.envMapCubeUVHeight),m.push(y.mapUv),m.push(y.alphaMapUv),m.push(y.lightMapUv),m.push(y.aoMapUv),m.push(y.bumpMapUv),m.push(y.normalMapUv),m.push(y.displacementMapUv),m.push(y.emissiveMapUv),m.push(y.metalnessMapUv),m.push(y.roughnessMapUv),m.push(y.anisotropyMapUv),m.push(y.clearcoatMapUv),m.push(y.clearcoatNormalMapUv),m.push(y.clearcoatRoughnessMapUv),m.push(y.iridescenceMapUv),m.push(y.iridescenceThicknessMapUv),m.push(y.sheenColorMapUv),m.push(y.sheenRoughnessMapUv),m.push(y.specularMapUv),m.push(y.specularColorMapUv),m.push(y.specularIntensityMapUv),m.push(y.transmissionMapUv),m.push(y.thicknessMapUv),m.push(y.combine),m.push(y.fogExp2),m.push(y.sizeAttenuation),m.push(y.morphTargetsCount),m.push(y.morphAttributeCount),m.push(y.numSunLights),m.push(y.numDirLights),m.push(y.numPointLights),m.push(y.numSpotLights),m.push(y.numSpotLightMaps),m.push(y.numHemiLights),m.push(y.numRectAreaLights),m.push(y.numSunLightShadows),m.push(y.numDirLightShadows),m.push(y.numPointLightShadows),m.push(y.numSpotLightShadows),m.push(y.numSpotLightShadowsWithMaps),m.push(y.numLightProbes),m.push(y.shadowMapType),m.push(y.toneMapping),m.push(y.numClippingPlanes),m.push(y.numClipIntersection),m.push(y.depthPacking)}function b(m,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),m.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),m.push(a.mask)}function L(m){let y=p[m.type],R;if(y){let I=en[y];R=qs.clone(I.uniforms)}else R=m.uniforms;return R}function S(m,y){let R=u.get(y);return R!==void 0?++R.usedTimes:(R=new vx(i,y,m,r),c.push(R),u.set(y,R)),R}function w(m){if(--m.usedTimes===0){let y=c.indexOf(m);c[y]=c[c.length-1],c.pop(),u.delete(m.cacheKey),m.destroy()}}function E(m){o.remove(m)}function P(){o.dispose()}return{getParameters:M,getProgramCacheKey:g,getUniforms:L,acquireProgram:S,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:P}}function bx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function wx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function qh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Yh(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(h){let p=0;return h.isInstancedMesh&&(p+=2),h.isSkinnedMesh&&(p+=1),p}function o(h,p,_,M,g,f){let b=i[e];return b===void 0?(b={id:h.id,object:h,geometry:p,material:_,materialVariant:a(h),groupOrder:M,renderOrder:h.renderOrder,z:g,group:f},i[e]=b):(b.id=h.id,b.object=h,b.geometry=p,b.material=_,b.materialVariant=a(h),b.groupOrder=M,b.renderOrder=h.renderOrder,b.z=g,b.group=f),e++,b}function l(h,p,_,M,g,f,b){b.reversedDepth===!0&&(g=-g);let L=o(h,p,_,M,g,f);_.transmission>0?n.push(L):_.transparent===!0?r.push(L):t.push(L)}function c(h,p,_,M,g,f){let b=o(h,p,_,M,g,f);_.transmission>0?n.unshift(b):_.transparent===!0?r.unshift(b):t.unshift(b)}function u(h,p){t.length>1&&t.sort(h||wx),n.length>1&&n.sort(p||qh),r.length>1&&r.sort(p||qh)}function d(){for(let h=e,p=i.length;h<p;h++){let _=i[h];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:l,unshift:c,finish:d,sort:u}}function Ex(){let i=new WeakMap;function e(n,r){let s=i.get(n),a;return s===void 0?(a=new Yh,i.set(n,[a])):r>=s.length?(a=new Yh,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Tx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new V,color:new qe};break;case"SpotLight":t={position:new V,direction:new V,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new V,halfWidth:new V,halfHeight:new V};break}return i[e.id]=t,t}}}function Ax(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Cx=0;function Rx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Px(i){let e=new Tx,t=Ax(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new V);let r=new V,s=new ke,a=new ke;function o(c){let u=0,d=0,h=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let p=0,_=0,M=0,g=0,f=0,b=0,L=0,S=0,w=0,E=0,P=0,m=0,y=0,R=0;c.sort(Rx);for(let F=0,D=c.length;F<D;F++){let A=c[F],z=A.color,Z=A.intensity,K=A.distance,se=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===$n?se=A.shadow.map.texture:se=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)u+=z.r*Z,d+=z.g*Z,h+=z.b*Z;else if(A.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(A.sh.coefficients[U],Z);R++}else if(A.isSunLight){let U=e.get(A);if(U.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let q=A.shadow,C=t.get(A);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),n.sunShadow[_]=C,n.sunShadowMap[_]=se;let $=q.getViewportCount();for(let ne=0;ne<$;ne++)n.sunShadowMatrix[M+ne]=q.getMatrix(ne),n.sunShadowCascade[M+ne]=q._cascadeData[ne];M+=$,_++}n.sun[p]=U,p++}else if(A.isDirectionalLight){let U=e.get(A);if(U.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let q=A.shadow,C=t.get(A);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize=q.mapSize,n.directionalShadow[g]=C,n.directionalShadowMap[g]=se,n.directionalShadowMatrix[g]=A.shadow.matrix,w++}n.directional[g]=U,g++}else if(A.isSpotLight){let U=e.get(A);U.position.setFromMatrixPosition(A.matrixWorld),U.color.copy(z).multiplyScalar(Z),U.distance=K,U.coneCos=Math.cos(A.angle),U.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),U.decay=A.decay,n.spot[b]=U;let q=A.shadow;if(A.map&&(n.spotLightMap[m]=A.map,m++,q.updateMatrices(A),A.castShadow&&y++),n.spotLightMatrix[b]=q.matrix,A.castShadow){let C=t.get(A);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize=q.mapSize,n.spotShadow[b]=C,n.spotShadowMap[b]=se,P++}b++}else if(A.isRectAreaLight){let U=e.get(A);U.color.copy(z).multiplyScalar(Z),U.halfWidth.set(A.width*.5,0,0),U.halfHeight.set(0,A.height*.5,0),n.rectArea[L]=U,L++}else if(A.isPointLight){let U=e.get(A);if(U.color.copy(A.color).multiplyScalar(A.intensity),U.distance=A.distance,U.decay=A.decay,A.castShadow){let q=A.shadow,C=t.get(A);C.shadowIntensity=q.intensity,C.shadowBias=q.bias,C.shadowNormalBias=q.normalBias,C.shadowRadius=q.radius,C.shadowMapSize=q.mapSize,C.shadowCameraNear=q.camera.near,C.shadowCameraFar=q.camera.far,n.pointShadow[f]=C,n.pointShadowMap[f]=se,n.pointShadowMatrix[f]=A.shadow.matrix,E++}n.point[f]=U,f++}else if(A.isHemisphereLight){let U=e.get(A);U.skyColor.copy(A.color).multiplyScalar(Z),U.groundColor.copy(A.groundColor).multiplyScalar(Z),n.hemi[S]=U,S++}}L>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let I=n.hash;(I.sunLength!==p||I.directionalLength!==g||I.pointLength!==f||I.spotLength!==b||I.rectAreaLength!==L||I.hemiLength!==S||I.numSunShadows!==_||I.numDirectionalShadows!==w||I.numPointShadows!==E||I.numSpotShadows!==P||I.numSpotMaps!==m||I.numLightProbes!==R)&&(n.sun.length=p,n.directional.length=g,n.spot.length=b,n.rectArea.length=L,n.point.length=f,n.hemi.length=S,n.sunShadow.length=_,n.sunShadowMap.length=_,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=P,n.spotShadowMap.length=P,n.spotLightMatrix.length=P+m-y,n.spotLightMap.length=m,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=R,I.sunLength=p,I.directionalLength=g,I.pointLength=f,I.spotLength=b,I.rectAreaLength=L,I.hemiLength=S,I.numSunShadows=_,I.numDirectionalShadows=w,I.numPointShadows=E,I.numSpotShadows=P,I.numSpotMaps=m,I.numLightProbes=R,n.version=Cx++)}function l(c,u){let d=0,h=0,p=0,_=0,M=0,g=0,f=u.matrixWorldInverse;for(let b=0,L=c.length;b<L;b++){let S=c[b];if(S.isSunLight){let w=n.sun[d];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(f),d++}else if(S.isDirectionalLight){let w=n.directional[h];w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(f),h++}else if(S.isSpotLight){let w=n.spot[_];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(f),w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(f),_++}else if(S.isRectAreaLight){let w=n.rectArea[M];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(f),a.identity(),s.copy(S.matrixWorld),s.premultiply(f),a.extractRotation(s),w.halfWidth.set(S.width*.5,0,0),w.halfHeight.set(0,S.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),M++}else if(S.isPointLight){let w=n.point[p];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(f),p++}else if(S.isHemisphereLight){let w=n.hemi[g];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(f),g++}}}return{setup:o,setupView:l,state:n}}function $h(i){let e=new Px(i),t=[],n=[],r=[];function s(h){d.camera=h,t.length=0,n.length=0,r.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){r.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Ix(i){let e=new WeakMap;function t(r,s=0){let a=e.get(r),o;return a===void 0?(o=new $h(i),e.set(r,[o])):s>=a.length?(o=new $h(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Lx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Nx=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Ux=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Zh=new ke,$s=new V,Pc=new V;function Fx(i,e,t){let n=new Gr,r=new We,s=new We,a=new Ke,o=new Wa,l=new Xa,c={},u=t.maxTextureSize,d={[Yn]:Ut,[Ut]:Yn,[Yt]:Yt},h=new Qt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:Lx,fragmentShader:Dx}),p=h.clone();p.defines.HORIZONTAL_PASS=1;let _=new ln;_.setAttribute("position",new Wt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new It(_,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fs;let f=this.type;this.render=function(E,P,m){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===$u&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Fs);let y=i.getRenderTarget(),R=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),F=i.state;F.setBlending(bn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let D=f!==this.type;D&&P.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(z=>z.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,z=E.length;A<z;A++){let Z=E[A],K=Z.shadow;if(K===void 0){Fe("WebGLShadowMap:",Z,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;r.copy(K.mapSize);let se=K.getFrameExtents();r.multiply(se),s.copy(K.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/se.x),r.x=s.x*se.x,K.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/se.y),r.y=s.y*se.y,K.mapSize.y=s.y));let U=i.state.buffers.depth.getReversed();if(K.camera._reversedDepth=U,K.map===null||D===!0){if(K.map!==null&&(K.map.depthTexture!==null&&(K.map.depthTexture.dispose(),K.map.depthTexture=null),K.map.dispose()),this.type===Hr){if(Z.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}K.map=new qt(r.x,r.y,{format:$n,type:Bn,minFilter:Pt,magFilter:Pt,generateMipmaps:!1}),K.map.texture.name=Z.name+".shadowMap",K.map.depthTexture=new Ii(r.x,r.y,_n),K.map.depthTexture.name=Z.name+".shadowMapDepth",K.map.depthTexture.format=Hn,K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=Ct,K.map.depthTexture.magFilter=Ct}else Z.isPointLight?(K.map=new el(r.x),K.map.depthTexture=new Ha(r.x,On)):(K.map=new qt(r.x,r.y),K.map.depthTexture=new Ii(r.x,r.y,On)),K.map.depthTexture.name=Z.name+".shadowMap",K.map.depthTexture.format=Hn,this.type===Fs?(K.map.depthTexture.compareFunction=U?Jo:Zo,K.map.depthTexture.minFilter=Pt,K.map.depthTexture.magFilter=Pt):(K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=Ct,K.map.depthTexture.magFilter=Ct);K.camera.updateProjectionMatrix()}K.map.isWebGLCubeRenderTarget!==!0&&(K.map.width!==r.x||K.map.height!==r.y)&&K.map.setSize(r.x,r.y);let q=K.map.isWebGLCubeRenderTarget?6:K.getViewportCount();Z.isPointLight!==!0&&K.updateMatrices(Z,m);for(let C=0;C<q;C++){let $=K.getCamera(C);if(Z.isPointLight){let ne=K.camera,ye=K.matrix,ce=Z.distance||ne.far;ce!==ne.far&&(ne.far=ce,ne.updateProjectionMatrix()),$s.setFromMatrixPosition(Z.matrixWorld),ne.position.copy($s),Pc.copy(ne.position),Pc.add(Nx[C]),ne.up.copy(Ux[C]),ne.lookAt(Pc),ne.updateMatrixWorld(),ye.makeTranslation(-$s.x,-$s.y,-$s.z),Zh.multiplyMatrices(ne.projectionMatrix,ne.matrixWorldInverse),K._frustum.setFromProjectionMatrix(Zh,ne.coordinateSystem,ne.reversedDepth)}if(K.map.isWebGLCubeRenderTarget)i.setRenderTarget(K.map,C),i.clear();else{C===0&&(i.setRenderTarget(K.map),i.clear());let ne=K.getViewport(C);a.set(s.x*ne.x,s.y*ne.y,s.x*ne.z,s.y*ne.w),F.viewport(a)}n=K.getFrustum(C),S(P,m,$,Z,this.type)}K.isPointLightShadow!==!0&&this.type===Hr&&b(K,m),K.needsUpdate=!1}f=this.type,g.needsUpdate=!1,i.setRenderTarget(y,R,I)};function b(E,P){let m=e.update(M);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null?E.mapPass=new qt(r.x,r.y,{format:$n,type:Bn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value.set(E.map.width,E.map.height),h.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(P,null,m,h,M,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value.set(E.map.width,E.map.height),p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(P,null,m,p,M,null)}function L(E,P,m,y){let R=null,I=m.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)R=I;else if(R=m.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let F=R.uuid,D=P.uuid,A=c[F];A===void 0&&(A={},c[F]=A);let z=A[D];z===void 0&&(z=R.clone(),A[D]=z,P.addEventListener("dispose",w)),R=z}if(R.visible=P.visible,R.wireframe=P.wireframe,y===Hr?R.side=P.shadowSide!==null?P.shadowSide:P.side:R.side=P.shadowSide!==null?P.shadowSide:d[P.side],R.alphaMap=P.alphaMap,R.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,R.map=P.map,R.clipShadows=P.clipShadows,R.clippingPlanes=P.clippingPlanes,R.clipIntersection=P.clipIntersection,R.displacementMap=P.displacementMap,R.displacementScale=P.displacementScale,R.displacementBias=P.displacementBias,R.wireframeLinewidth=P.wireframeLinewidth,R.linewidth=P.linewidth,m.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let F=i.properties.get(R);F.light=m}return R}function S(E,P,m,y,R){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===Hr)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(m.matrixWorldInverse,E.matrixWorld);let D=e.update(E),A=E.material;if(Array.isArray(A)){let z=D.groups;for(let Z=0,K=z.length;Z<K;Z++){let se=z[Z],U=A[se.materialIndex];if(U&&U.visible){let q=L(E,U,y,R);E.onBeforeShadow(i,E,P,m,D,q,se),i.renderBufferDirect(m,null,D,q,E,se),E.onAfterShadow(i,E,P,m,D,q,se)}}}else if(A.visible){let z=L(E,A,y,R);E.onBeforeShadow(i,E,P,m,D,z,null),i.renderBufferDirect(m,null,D,z,E,null),E.onAfterShadow(i,E,P,m,D,z,null)}}let F=E.children;for(let D=0,A=F.length;D<A;D++)S(F[D],P,m,y,R)}function w(E){E.target.removeEventListener("dispose",w);for(let m in c){let y=c[m],R=E.target.uuid;R in y&&(y[R].dispose(),delete y[R])}}}function Ox(i,e){function t(){let B=!1,me=new Ke,te=null,ge=new Ke(0,0,0,0);return{setMask:function(Se){te!==Se&&!B&&(i.colorMask(Se,Se,Se,Se),te=Se)},setLocked:function(Se){B=Se},setClear:function(Se,ae,De,Ce,ft){ft===!0&&(Se*=Ce,ae*=Ce,De*=Ce),me.set(Se,ae,De,Ce),ge.equals(me)===!1&&(i.clearColor(Se,ae,De,Ce),ge.copy(me))},reset:function(){B=!1,te=null,ge.set(-1,0,0,0)}}}function n(){let B=!1,me=!1,te=null,ge=null,Se=null;return{setReversed:function(ae){if(me!==ae){let De=e.get("EXT_clip_control");ae?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),me=ae;let Ce=Se;Se=null,this.setClear(Ce)}},getReversed:function(){return me},setTest:function(ae){ae?k(i.DEPTH_TEST):j(i.DEPTH_TEST)},setMask:function(ae){te!==ae&&!B&&(i.depthMask(ae),te=ae)},setFunc:function(ae){if(me&&(ae=Eh[ae]),ge!==ae){switch(ae){case Ca:i.depthFunc(i.NEVER);break;case Ra:i.depthFunc(i.ALWAYS);break;case Pa:i.depthFunc(i.LESS);break;case Nr:i.depthFunc(i.LEQUAL);break;case Ia:i.depthFunc(i.EQUAL);break;case La:i.depthFunc(i.GEQUAL);break;case Da:i.depthFunc(i.GREATER);break;case Na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ge=ae}},setLocked:function(ae){B=ae},setClear:function(ae){Se!==ae&&(Se=ae,me&&(ae=1-ae),i.clearDepth(ae))},reset:function(){B=!1,te=null,ge=null,Se=null,me=!1}}}function r(){let B=!1,me=null,te=null,ge=null,Se=null,ae=null,De=null,Ce=null,ft=null;return{setTest:function(st){B||(st?k(i.STENCIL_TEST):j(i.STENCIL_TEST))},setMask:function(st){me!==st&&!B&&(i.stencilMask(st),me=st)},setFunc:function(st,Cn,kn){(te!==st||ge!==Cn||Se!==kn)&&(i.stencilFunc(st,Cn,kn),te=st,ge=Cn,Se=kn)},setOp:function(st,Cn,kn){(ae!==st||De!==Cn||Ce!==kn)&&(i.stencilOp(st,Cn,kn),ae=st,De=Cn,Ce=kn)},setLocked:function(st){B=st},setClear:function(st){ft!==st&&(i.clearStencil(st),ft=st)},reset:function(){B=!1,me=null,te=null,ge=null,Se=null,ae=null,De=null,Ce=null,ft=null}}}let s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap,u={},d={},h={},p=new WeakMap,_=[],M=null,g=!1,f=null,b=null,L=null,S=null,w=null,E=null,P=null,m=new qe(0,0,0),y=0,R=!1,I=null,F=null,D=null,A=null,z=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,se=0,U=i.getParameter(i.VERSION);U.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec(U)[1]),K=se>=1):U.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec(U)[1]),K=se>=2);let q=null,C={},$=i.getParameter(i.SCISSOR_BOX),ne=i.getParameter(i.VIEWPORT),ye=new Ke().fromArray($),ce=new Ke().fromArray(ne);function le(B,me,te,ge){let Se=new Uint8Array(4),ae=i.createTexture();i.bindTexture(B,ae),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<te;De++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(me,0,i.RGBA,1,1,ge,0,i.RGBA,i.UNSIGNED_BYTE,Se):i.texImage2D(me+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Se);return ae}let G={};G[i.TEXTURE_2D]=le(i.TEXTURE_2D,i.TEXTURE_2D,1),G[i.TEXTURE_CUBE_MAP]=le(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[i.TEXTURE_2D_ARRAY]=le(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),G[i.TEXTURE_3D]=le(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),k(i.DEPTH_TEST),a.setFunc(Nr),Ge(!1),it(Kl),k(i.CULL_FACE),Re(bn);function k(B){u[B]!==!0&&(i.enable(B),u[B]=!0)}function j(B){u[B]!==!1&&(i.disable(B),u[B]=!1)}function ie(B,me){return h[B]!==me?(i.bindFramebuffer(B,me),h[B]=me,B===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=me),B===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=me),!0):!1}function oe(B,me){let te=_,ge=!1;if(B){te=p.get(me),te===void 0&&(te=[],p.set(me,te));let Se=B.textures;if(te.length!==Se.length||te[0]!==i.COLOR_ATTACHMENT0){for(let ae=0,De=Se.length;ae<De;ae++)te[ae]=i.COLOR_ATTACHMENT0+ae;te.length=Se.length,ge=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,ge=!0);ge&&i.drawBuffers(te)}function Ee(B){return M!==B?(i.useProgram(B),M=B,!0):!1}let je={[tr]:i.FUNC_ADD,[Zu]:i.FUNC_SUBTRACT,[Ju]:i.FUNC_REVERSE_SUBTRACT};je[Ku]=i.MIN,je[ao]=i.MAX;let ze={[ju]:i.ZERO,[Os]:i.ONE,[Qu]:i.SRC_COLOR,[tc]:i.SRC_ALPHA,[sh]:i.SRC_ALPHA_SATURATE,[ih]:i.DST_COLOR,[th]:i.DST_ALPHA,[eh]:i.ONE_MINUS_SRC_COLOR,[nc]:i.ONE_MINUS_SRC_ALPHA,[rh]:i.ONE_MINUS_DST_COLOR,[nh]:i.ONE_MINUS_DST_ALPHA,[ah]:i.CONSTANT_COLOR,[oh]:i.ONE_MINUS_CONSTANT_COLOR,[lh]:i.CONSTANT_ALPHA,[ch]:i.ONE_MINUS_CONSTANT_ALPHA};function Re(B,me,te,ge,Se,ae,De,Ce,ft,st){if(B===bn){g===!0&&(j(i.BLEND),g=!1);return}if(g===!1&&(k(i.BLEND),g=!0),B!==so){if(B!==f||st!==R){if((b!==tr||w!==tr)&&(i.blendEquation(i.FUNC_ADD),b=tr,w=tr),st)switch(B){case Wr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jl:i.blendFunc(i.ONE,i.ONE);break;case Ql:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ec:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",B);break}else switch(B){case Wr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case jl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ql:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ec:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",B);break}L=null,S=null,E=null,P=null,m.set(0,0,0),y=0,f=B,R=st}return}Se=Se||me,ae=ae||te,De=De||ge,(me!==b||Se!==w)&&(i.blendEquationSeparate(je[me],je[Se]),b=me,w=Se),(te!==L||ge!==S||ae!==E||De!==P)&&(i.blendFuncSeparate(ze[te],ze[ge],ze[ae],ze[De]),L=te,S=ge,E=ae,P=De),(Ce.equals(m)===!1||ft!==y)&&(i.blendColor(Ce.r,Ce.g,Ce.b,ft),m.copy(Ce),y=ft),f=B,R=!1}function nt(B,me){B.side===Yt?j(i.CULL_FACE):k(i.CULL_FACE);let te=B.side===Ut;me&&(te=!te),Ge(te),B.blending===Wr&&B.transparent===!1?Re(bn):Re(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),s.setMask(B.colorWrite);let ge=B.stencilWrite;o.setTest(ge),ge&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),bt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?k(i.SAMPLE_ALPHA_TO_COVERAGE):j(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(B){I!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),I=B)}function it(B){B!==qu?(k(i.CULL_FACE),B!==F&&(B===Kl?i.cullFace(i.BACK):B===Yu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):j(i.CULL_FACE),F=B}function mt(B){B!==D&&(K&&i.lineWidth(B),D=B)}function bt(B,me,te){B?(k(i.POLYGON_OFFSET_FILL),(A!==me||z!==te)&&(A=me,z=te,a.getReversed()&&(me=-me),i.polygonOffset(me,te))):j(i.POLYGON_OFFSET_FILL)}function Qe(B){B?k(i.SCISSOR_TEST):j(i.SCISSOR_TEST)}function rt(B){B===void 0&&(B=i.TEXTURE0+Z-1),q!==B&&(i.activeTexture(B),q=B)}function N(B,me,te){te===void 0&&(q===null?te=i.TEXTURE0+Z-1:te=q);let ge=C[te];ge===void 0&&(ge={type:void 0,texture:void 0},C[te]=ge),(ge.type!==B||ge.texture!==me)&&(q!==te&&(i.activeTexture(te),q=te),i.bindTexture(B,me||G[B]),ge.type=B,ge.texture=me)}function $e(){let B=C[q];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Ne(){try{i.compressedTexImage2D(...arguments)}catch(B){Be("WebGLState:",B)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(B){Be("WebGLState:",B)}}function x(){try{i.texSubImage2D(...arguments)}catch(B){Be("WebGLState:",B)}}function H(){try{i.texSubImage3D(...arguments)}catch(B){Be("WebGLState:",B)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(B){Be("WebGLState:",B)}}function Q(){try{i.compressedTexSubImage3D(...arguments)}catch(B){Be("WebGLState:",B)}}function ue(){try{i.texStorage2D(...arguments)}catch(B){Be("WebGLState:",B)}}function de(){try{i.texStorage3D(...arguments)}catch(B){Be("WebGLState:",B)}}function ee(){try{i.texImage2D(...arguments)}catch(B){Be("WebGLState:",B)}}function re(){try{i.texImage3D(...arguments)}catch(B){Be("WebGLState:",B)}}function fe(B){return d[B]!==void 0?d[B]:i.getParameter(B)}function Ie(B,me){d[B]!==me&&(i.pixelStorei(B,me),d[B]=me)}function xe(B){ye.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),ye.copy(B))}function pe(B){ce.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),ce.copy(B))}function Le(B,me){let te=c.get(me);te===void 0&&(te=new WeakMap,c.set(me,te));let ge=te.get(B);ge===void 0&&(ge=i.getUniformBlockIndex(me,B.name),te.set(B,ge))}function Ue(B,me){let ge=c.get(me).get(B);l.get(me)!==ge&&(i.uniformBlockBinding(me,ge,B.__bindingPointIndex),l.set(me,ge))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},q=null,C={},h={},p=new WeakMap,_=[],M=null,g=!1,f=null,b=null,L=null,S=null,w=null,E=null,P=null,m=new qe(0,0,0),y=0,R=!1,I=null,F=null,D=null,A=null,z=null,ye.set(0,0,i.canvas.width,i.canvas.height),ce.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:k,disable:j,bindFramebuffer:ie,drawBuffers:oe,useProgram:Ee,setBlending:Re,setMaterial:nt,setFlipSided:Ge,setCullFace:it,setLineWidth:mt,setPolygonOffset:bt,setScissorTest:Qe,activeTexture:rt,bindTexture:N,unbindTexture:$e,compressedTexImage2D:Ne,compressedTexImage3D:T,texImage2D:ee,texImage3D:re,pixelStorei:Ie,getParameter:fe,updateUBOMapping:Le,uniformBlockBinding:Ue,texStorage2D:ue,texStorage3D:de,texSubImage2D:x,texSubImage3D:H,compressedTexSubImage2D:Y,compressedTexSubImage3D:Q,scissor:xe,viewport:pe,reset:Ve}}function Bx(i,e,t,n,r,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new We,u=new WeakMap,d=new Set,h,p=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(T,x){return _?new OffscreenCanvas(T,x):ys("canvas")}function g(T,x,H){let Y=1,Q=Ne(T);if((Q.width>H||Q.height>H)&&(Y=H/Math.max(Q.width,Q.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let ue=Math.floor(Y*Q.width),de=Math.floor(Y*Q.height);h===void 0&&(h=M(ue,de));let ee=x?M(ue,de):h;return ee.width=ue,ee.height=de,ee.getContext("2d").drawImage(T,0,0,ue,de),Fe("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ue+"x"+de+")."),ee}else return"data"in T&&Fe("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function f(T){return T.generateMipmaps}function b(T){i.generateMipmap(T)}function L(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(T,x,H,Y,Q,ue=!1){if(T!==null){if(i[T]!==void 0)return i[T];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let de;Y&&(de=e.get("EXT_texture_norm16"),de||Fe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=x;if(x===i.RED&&(H===i.FLOAT&&(ee=i.R32F),H===i.HALF_FLOAT&&(ee=i.R16F),H===i.UNSIGNED_BYTE&&(ee=i.R8),H===i.UNSIGNED_SHORT&&de&&(ee=de.R16_EXT),H===i.SHORT&&de&&(ee=de.R16_SNORM_EXT)),x===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(ee=i.R8UI),H===i.UNSIGNED_SHORT&&(ee=i.R16UI),H===i.UNSIGNED_INT&&(ee=i.R32UI),H===i.BYTE&&(ee=i.R8I),H===i.SHORT&&(ee=i.R16I),H===i.INT&&(ee=i.R32I)),x===i.RG&&(H===i.FLOAT&&(ee=i.RG32F),H===i.HALF_FLOAT&&(ee=i.RG16F),H===i.UNSIGNED_BYTE&&(ee=i.RG8),H===i.UNSIGNED_SHORT&&de&&(ee=de.RG16_EXT),H===i.SHORT&&de&&(ee=de.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(ee=i.RG8UI),H===i.UNSIGNED_SHORT&&(ee=i.RG16UI),H===i.UNSIGNED_INT&&(ee=i.RG32UI),H===i.BYTE&&(ee=i.RG8I),H===i.SHORT&&(ee=i.RG16I),H===i.INT&&(ee=i.RG32I)),x===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),H===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),H===i.UNSIGNED_INT&&(ee=i.RGB32UI),H===i.BYTE&&(ee=i.RGB8I),H===i.SHORT&&(ee=i.RGB16I),H===i.INT&&(ee=i.RGB32I)),x===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),H===i.UNSIGNED_INT&&(ee=i.RGBA32UI),H===i.BYTE&&(ee=i.RGBA8I),H===i.SHORT&&(ee=i.RGBA16I),H===i.INT&&(ee=i.RGBA32I)),x===i.RGB&&(H===i.UNSIGNED_SHORT&&de&&(ee=de.RGB16_EXT),H===i.SHORT&&de&&(ee=de.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(ee=i.R11F_G11F_B10F)),x===i.RGBA){let re=ue?vs:Je.getTransfer(Q);H===i.FLOAT&&(ee=i.RGBA32F),H===i.HALF_FLOAT&&(ee=i.RGBA16F),H===i.UNSIGNED_BYTE&&(ee=re===ot?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&de&&(ee=de.RGBA16_EXT),H===i.SHORT&&de&&(ee=de.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function w(T,x){let H;return T?x===null||x===On||x===qr?H=i.DEPTH24_STENCIL8:x===_n?H=i.DEPTH32F_STENCIL8:x===Xr&&(H=i.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===On||x===qr?H=i.DEPTH_COMPONENT24:x===_n?H=i.DEPTH_COMPONENT32F:x===Xr&&(H=i.DEPTH_COMPONENT16),H}function E(T,x){return f(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ct&&T.minFilter!==Pt?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function P(T){let x=T.target;x.removeEventListener("dispose",P),y(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function m(T){let x=T.target;x.removeEventListener("dispose",m),I(x)}function y(T){let x=n.get(T);if(x.__webglInit===void 0)return;let H=T.source,Y=p.get(H);if(Y){let Q=Y[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&R(T),Object.keys(Y).length===0&&p.delete(H)}n.remove(T)}function R(T){let x=n.get(T);i.deleteTexture(x.__webglTexture);let H=T.source,Y=p.get(H);delete Y[x.__cacheKey],a.memory.textures--}function I(T){let x=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(x.__webglFramebuffer[Y]))for(let Q=0;Q<x.__webglFramebuffer[Y].length;Q++)i.deleteFramebuffer(x.__webglFramebuffer[Y][Q]);else i.deleteFramebuffer(x.__webglFramebuffer[Y]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[Y])}else{if(Array.isArray(x.__webglFramebuffer))for(let Y=0;Y<x.__webglFramebuffer.length;Y++)i.deleteFramebuffer(x.__webglFramebuffer[Y]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Y=0;Y<x.__webglColorRenderbuffer.length;Y++)x.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[Y]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let H=T.textures;for(let Y=0,Q=H.length;Y<Q;Y++){let ue=n.get(H[Y]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(H[Y])}n.remove(T)}let F=0;function D(){F=0}function A(){return F}function z(T){F=T}function Z(){let T=F;return T>=r.maxTextures&&Fe("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+r.maxTextures),F+=1,T}function K(T){let x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function se(T,x){let H=n.get(T);if(T.isVideoTexture&&N(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&H.__version!==T.version){let Y=T.image;if(Y===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{j(H,T,x);return}}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+x)}function U(T,x){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){j(H,T,x);return}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+x)}function q(T,x){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){j(H,T,x);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+x)}function C(T,x){let H=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&H.__version!==T.version){ie(H,T,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+x)}let $={[Ua]:i.REPEAT,[mn]:i.CLAMP_TO_EDGE,[Fa]:i.MIRRORED_REPEAT},ne={[Ct]:i.NEAREST,[dh]:i.NEAREST_MIPMAP_NEAREST,[zs]:i.NEAREST_MIPMAP_LINEAR,[Pt]:i.LINEAR,[uo]:i.LINEAR_MIPMAP_NEAREST,[zi]:i.LINEAR_MIPMAP_LINEAR},ye={[gh]:i.NEVER,[Sh]:i.ALWAYS,[xh]:i.LESS,[Zo]:i.LEQUAL,[_h]:i.EQUAL,[Jo]:i.GEQUAL,[vh]:i.GREATER,[yh]:i.NOTEQUAL};function ce(T,x){if(x.type===_n&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Pt||x.magFilter===uo||x.magFilter===zs||x.magFilter===zi||x.minFilter===Pt||x.minFilter===uo||x.minFilter===zs||x.minFilter===zi)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,$[x.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,$[x.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,$[x.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ne[x.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ne[x.minFilter]),x.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ye[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ct||x.minFilter!==zs&&x.minFilter!==zi||x.type===_n&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function le(T,x){let H=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",P));let Y=x.source,Q=p.get(Y);Q===void 0&&(Q={},p.set(Y,Q));let ue=K(x);if(ue!==T.__cacheKey){Q[ue]===void 0&&(Q[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[ue].usedTimes++;let de=Q[T.__cacheKey];de!==void 0&&(Q[T.__cacheKey].usedTimes--,de.usedTimes===0&&R(x)),T.__cacheKey=ue,T.__webglTexture=Q[ue].texture}return H}function G(T,x,H){return Math.floor(Math.floor(T/H)/x)}function k(T,x,H,Y){let ue=T.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,H,Y,x.data);else{ue.sort((Ie,xe)=>Ie.start-xe.start);let de=0;for(let Ie=1;Ie<ue.length;Ie++){let xe=ue[de],pe=ue[Ie],Le=xe.start+xe.count,Ue=G(pe.start,x.width,4),Ve=G(xe.start,x.width,4);pe.start<=Le+1&&Ue===Ve&&G(pe.start+pe.count-1,x.width,4)===Ue?xe.count=Math.max(xe.count,pe.start+pe.count-xe.start):(++de,ue[de]=pe)}ue.length=de+1;let ee=t.getParameter(i.UNPACK_ROW_LENGTH),re=t.getParameter(i.UNPACK_SKIP_PIXELS),fe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Ie=0,xe=ue.length;Ie<xe;Ie++){let pe=ue[Ie],Le=Math.floor(pe.start/4),Ue=Math.ceil(pe.count/4),Ve=Le%x.width,B=Math.floor(Le/x.width),me=Ue,te=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,Ve,B,me,te,H,Y,x.data)}T.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ee),t.pixelStorei(i.UNPACK_SKIP_PIXELS,re),t.pixelStorei(i.UNPACK_SKIP_ROWS,fe)}}function j(T,x,H){let Y=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Y=i.TEXTURE_3D);let Q=le(T,x),ue=x.source;t.bindTexture(Y,T.__webglTexture,i.TEXTURE0+H);let de=n.get(ue);if(ue.version!==de.__version||Q===!0){if(t.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let te=Je.getPrimaries(Je.workingColorSpace),ge=x.colorSpace===hi?null:Je.getPrimaries(x.colorSpace),Se=x.colorSpace===hi||te===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let re=g(x.image,!1,r.maxTextureSize);re=$e(x,re);let fe=s.convert(x.format,x.colorSpace),Ie=s.convert(x.type),xe=S(x.internalFormat,fe,Ie,x.normalized,x.colorSpace,x.isVideoTexture);ce(Y,x);let pe,Le=x.mipmaps,Ue=x.isVideoTexture!==!0,Ve=de.__version===void 0||Q===!0,B=ue.dataReady,me=E(x,re);if(x.isDepthTexture)xe=w(x.format===ki,x.type),Ve&&(Ue?t.texStorage2D(i.TEXTURE_2D,1,xe,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,xe,re.width,re.height,0,fe,Ie,null));else if(x.isDataTexture)if(Le.length>0){Ue&&Ve&&t.texStorage2D(i.TEXTURE_2D,me,xe,Le[0].width,Le[0].height);for(let te=0,ge=Le.length;te<ge;te++)pe=Le[te],Ue?B&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,pe.width,pe.height,fe,Ie,pe.data):t.texImage2D(i.TEXTURE_2D,te,xe,pe.width,pe.height,0,fe,Ie,pe.data);x.generateMipmaps=!1}else Ue?(Ve&&t.texStorage2D(i.TEXTURE_2D,me,xe,re.width,re.height),B&&k(x,re,fe,Ie)):t.texImage2D(i.TEXTURE_2D,0,xe,re.width,re.height,0,fe,Ie,re.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ue&&Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,xe,Le[0].width,Le[0].height,re.depth);for(let te=0,ge=Le.length;te<ge;te++)if(pe=Le[te],x.format!==wn)if(fe!==null)if(Ue){if(B)if(x.layerUpdates.size>0){let Se=wc(pe.width,pe.height,x.format,x.type);for(let ae of x.layerUpdates){let De=pe.data.subarray(ae*Se/pe.data.BYTES_PER_ELEMENT,(ae+1)*Se/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,ae,pe.width,pe.height,1,fe,De)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,pe.width,pe.height,re.depth,fe,pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,xe,pe.width,pe.height,re.depth,0,pe.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,pe.width,pe.height,re.depth,fe,Ie,pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,xe,pe.width,pe.height,re.depth,0,fe,Ie,pe.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Ue&&Ve&&t.texStorage2D(i.TEXTURE_2D,me,xe,Le[0].width,Le[0].height);for(let te=0,ge=Le.length;te<ge;te++)pe=Le[te],x.format!==wn?fe!==null?Ue?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,pe.width,pe.height,fe,pe.data):t.compressedTexImage2D(i.TEXTURE_2D,te,xe,pe.width,pe.height,0,pe.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?B&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,pe.width,pe.height,fe,Ie,pe.data):t.texImage2D(i.TEXTURE_2D,te,xe,pe.width,pe.height,0,fe,Ie,pe.data)}else if(x.isDataArrayTexture)if(Ue){if(Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,xe,re.width,re.height,re.depth),B)if(x.layerUpdates.size>0){let te=wc(re.width,re.height,x.format,x.type);for(let ge of x.layerUpdates){let Se=re.data.subarray(ge*te/re.data.BYTES_PER_ELEMENT,(ge+1)*te/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ge,re.width,re.height,1,fe,Ie,Se)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,fe,Ie,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,xe,re.width,re.height,re.depth,0,fe,Ie,re.data);else if(x.isData3DTexture)Ue?(Ve&&t.texStorage3D(i.TEXTURE_3D,me,xe,re.width,re.height,re.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,fe,Ie,re.data)):t.texImage3D(i.TEXTURE_3D,0,xe,re.width,re.height,re.depth,0,fe,Ie,re.data);else if(x.isFramebufferTexture){if(Ve)if(Ue)t.texStorage2D(i.TEXTURE_2D,me,xe,re.width,re.height);else{let te=re.width,ge=re.height;for(let Se=0;Se<me;Se++)t.texImage2D(i.TEXTURE_2D,Se,xe,te,ge,0,fe,Ie,null),te>>=1,ge>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let te=i.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),re.parentNode!==te){te.appendChild(re),d.add(x),te.onpaint=ge=>{let Se=ge.changedElements;for(let ae of d)Se.includes(ae.image)&&(ae.needsUpdate=!0)},te.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,re);else{let Se=i.RGBA,ae=i.RGBA,De=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Se,ae,De,re)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Le.length>0){if(Ue&&Ve){let te=Ne(Le[0]);t.texStorage2D(i.TEXTURE_2D,me,xe,te.width,te.height)}for(let te=0,ge=Le.length;te<ge;te++)pe=Le[te],Ue?B&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,fe,Ie,pe):t.texImage2D(i.TEXTURE_2D,te,xe,fe,Ie,pe);x.generateMipmaps=!1}else if(Ue){if(Ve){let te=Ne(re);t.texStorage2D(i.TEXTURE_2D,me,xe,te.width,te.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,Ie,re)}else t.texImage2D(i.TEXTURE_2D,0,xe,fe,Ie,re);f(x)&&b(Y),de.__version=ue.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function ie(T,x,H){if(x.image.length!==6)return;let Y=le(T,x),Q=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+H);let ue=n.get(Q);if(Q.version!==ue.__version||Y===!0){t.activeTexture(i.TEXTURE0+H);let de=Je.getPrimaries(Je.workingColorSpace),ee=x.colorSpace===hi?null:Je.getPrimaries(x.colorSpace),re=x.colorSpace===hi||de===ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);let fe=x.isCompressedTexture||x.image[0].isCompressedTexture,Ie=x.image[0]&&x.image[0].isDataTexture,xe=[];for(let ae=0;ae<6;ae++)!fe&&!Ie?xe[ae]=g(x.image[ae],!0,r.maxCubemapSize):xe[ae]=Ie?x.image[ae].image:x.image[ae],xe[ae]=$e(x,xe[ae]);let pe=xe[0],Le=s.convert(x.format,x.colorSpace),Ue=s.convert(x.type),Ve=S(x.internalFormat,Le,Ue,x.normalized,x.colorSpace),B=x.isVideoTexture!==!0,me=ue.__version===void 0||Y===!0,te=Q.dataReady,ge=E(x,pe);ce(i.TEXTURE_CUBE_MAP,x);let Se;if(fe){B&&me&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,Ve,pe.width,pe.height);for(let ae=0;ae<6;ae++){Se=xe[ae].mipmaps;for(let De=0;De<Se.length;De++){let Ce=Se[De];x.format!==wn?Le!==null?B?te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,0,0,Ce.width,Ce.height,Le,Ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,Ve,Ce.width,Ce.height,0,Ce.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,0,0,Ce.width,Ce.height,Le,Ue,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,Ve,Ce.width,Ce.height,0,Le,Ue,Ce.data)}}}else{if(Se=x.mipmaps,B&&me){Se.length>0&&ge++;let ae=Ne(xe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,Ve,ae.width,ae.height)}for(let ae=0;ae<6;ae++)if(Ie){B?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,xe[ae].width,xe[ae].height,Le,Ue,xe[ae].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Ve,xe[ae].width,xe[ae].height,0,Le,Ue,xe[ae].data);for(let De=0;De<Se.length;De++){let ft=Se[De].image[ae].image;B?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,0,0,ft.width,ft.height,Le,Ue,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,Ve,ft.width,ft.height,0,Le,Ue,ft.data)}}else{B?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,Le,Ue,xe[ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Ve,Le,Ue,xe[ae]);for(let De=0;De<Se.length;De++){let Ce=Se[De];B?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,0,0,Le,Ue,Ce.image[ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,Ve,Le,Ue,Ce.image[ae])}}}f(x)&&b(i.TEXTURE_CUBE_MAP),ue.__version=Q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function oe(T,x,H,Y,Q,ue){let de=s.convert(H.format,H.colorSpace),ee=s.convert(H.type),re=S(H.internalFormat,de,ee,H.normalized,H.colorSpace),fe=n.get(x),Ie=n.get(H);if(Ie.__renderTarget=x,!fe.__hasExternalTextures){let xe=Math.max(1,x.width>>ue),pe=Math.max(1,x.height>>ue);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,ue,re,xe,pe,x.depth,0,de,ee,null):t.texImage2D(Q,ue,re,xe,pe,0,de,ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),rt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,Q,Ie.__webglTexture,0,Qe(x)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,Q,Ie.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ee(T,x,H){if(i.bindRenderbuffer(i.RENDERBUFFER,T),x.depthBuffer){let Y=x.depthTexture,Q=Y&&Y.isDepthTexture?Y.type:null,ue=w(x.stencilBuffer,Q),de=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;rt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qe(x),ue,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe(x),ue,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ue,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,T)}else{let Y=x.textures;for(let Q=0;Q<Y.length;Q++){let ue=Y[Q],de=s.convert(ue.format,ue.colorSpace),ee=s.convert(ue.type),re=S(ue.internalFormat,de,ee,ue.normalized,ue.colorSpace);rt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qe(x),re,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe(x),re,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,re,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function je(T,x,H){let Y=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Q=n.get(x.depthTexture);if(Q.__renderTarget=x,(!Q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Y){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,x.depthTexture.addEventListener("dispose",P)),Q.__webglTexture===void 0){Q.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),ce(i.TEXTURE_CUBE_MAP,x.depthTexture);let fe=s.convert(x.depthTexture.format),Ie=s.convert(x.depthTexture.type),xe;x.depthTexture.format===Hn?xe=i.DEPTH_COMPONENT24:x.depthTexture.format===ki&&(xe=i.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,xe,x.width,x.height,0,fe,Ie,null)}}else se(x.depthTexture,0);let ue=Q.__webglTexture,de=Qe(x),ee=Y?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,re=x.depthTexture.format===ki?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===Hn)rt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ee,ue,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,re,ee,ue,0);else if(x.depthTexture.format===ki)rt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ee,ue,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,re,ee,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ze(T){let x=n.get(T),H=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){let Y=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Y){let Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Y.removeEventListener("dispose",Q)};Y.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=Y}if(T.depthTexture&&!x.__autoAllocateDepthBuffer)if(H)for(let Y=0;Y<6;Y++)je(x.__webglFramebuffer[Y],T,Y);else{let Y=T.texture.mipmaps;Y&&Y.length>0?je(x.__webglFramebuffer[0],T,0):je(x.__webglFramebuffer,T,0)}else if(H){x.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[Y]),x.__webglDepthbuffer[Y]===void 0)x.__webglDepthbuffer[Y]=i.createRenderbuffer(),Ee(x.__webglDepthbuffer[Y],T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=x.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ue)}}else{let Y=T.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Ee(x.__webglDepthbuffer,T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ue)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Re(T,x,H){let Y=n.get(T);x!==void 0&&oe(Y.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&ze(T)}function nt(T){let x=T.texture,H=n.get(T),Y=n.get(x);T.addEventListener("dispose",m);let Q=T.textures,ue=T.isWebGLCubeRenderTarget===!0,de=Q.length>1;if(de||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=x.version,a.memory.textures++),ue){H.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer[ee]=[];for(let re=0;re<x.mipmaps.length;re++)H.__webglFramebuffer[ee][re]=i.createFramebuffer()}else H.__webglFramebuffer[ee]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer=[];for(let ee=0;ee<x.mipmaps.length;ee++)H.__webglFramebuffer[ee]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(de)for(let ee=0,re=Q.length;ee<re;ee++){let fe=n.get(Q[ee]);fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&rt(T)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ee=0;ee<Q.length;ee++){let re=Q[ee];H.__webglColorRenderbuffer[ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ee]);let fe=s.convert(re.format,re.colorSpace),Ie=s.convert(re.type),xe=S(re.internalFormat,fe,Ie,re.normalized,re.colorSpace,T.isXRRenderTarget===!0),pe=Qe(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,xe,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ee,i.RENDERBUFFER,H.__webglColorRenderbuffer[ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Ee(H.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),ce(i.TEXTURE_CUBE_MAP,x);for(let ee=0;ee<6;ee++)if(x.mipmaps&&x.mipmaps.length>0)for(let re=0;re<x.mipmaps.length;re++)oe(H.__webglFramebuffer[ee][re],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,re);else oe(H.__webglFramebuffer[ee],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);f(x)&&b(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let ee=0,re=Q.length;ee<re;ee++){let fe=Q[ee],Ie=n.get(fe),xe=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(xe=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(xe,Ie.__webglTexture),ce(xe,fe),oe(H.__webglFramebuffer,T,fe,i.COLOR_ATTACHMENT0+ee,xe,0),f(fe)&&b(xe)}t.unbindTexture()}else{let ee=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ee=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,Y.__webglTexture),ce(ee,x),x.mipmaps&&x.mipmaps.length>0)for(let re=0;re<x.mipmaps.length;re++)oe(H.__webglFramebuffer[re],T,x,i.COLOR_ATTACHMENT0,ee,re);else oe(H.__webglFramebuffer,T,x,i.COLOR_ATTACHMENT0,ee,0);f(x)&&b(ee),t.unbindTexture()}T.depthBuffer&&ze(T)}function Ge(T){let x=T.textures;for(let H=0,Y=x.length;H<Y;H++){let Q=x[H];if(f(Q)){let ue=L(T),de=n.get(Q).__webglTexture;t.bindTexture(ue,de),b(ue),t.unbindTexture()}}}let it=[],mt=[];function bt(T){if(T.samples>0){if(rt(T)===!1){let x=T.textures,H=T.width,Y=T.height,Q=i.COLOR_BUFFER_BIT,ue=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(T),ee=x.length>1;if(ee)for(let fe=0;fe<x.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let re=T.texture.mipmaps;re&&re.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let fe=0;fe<x.length;fe++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[fe]);let Ie=n.get(x[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ie,0)}i.blitFramebuffer(0,0,H,Y,0,0,H,Y,Q,i.NEAREST),l===!0&&(it.length=0,mt.length=0,it.push(i.COLOR_ATTACHMENT0+fe),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&(it.push(ue),mt.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,mt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ee)for(let fe=0;fe<x.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,de.__webglColorRenderbuffer[fe]);let Ie=n.get(x[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,Ie,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){let x=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Qe(T){return Math.min(r.maxSamples,T.samples)}function rt(T){let x=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function N(T){let x=a.render.frame;u.get(T)!==x&&(u.set(T,x),T.update())}function $e(T,x){let H=T.colorSpace,Y=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||H!==_s&&H!==hi&&(Je.getTransfer(H)===ot?(Y!==wn||Q!==cn)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",H)),x}function Ne(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=Z,this.resetTextureUnits=D,this.getTextureUnits=A,this.setTextureUnits=z,this.setTexture2D=se,this.setTexture2DArray=U,this.setTexture3D=q,this.setTextureCube=C,this.rebindTextures=Re,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=rt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function zx(i,e){function t(n,r=hi){let s,a=Je.getTransfer(r);if(n===cn)return i.UNSIGNED_BYTE;if(n===fo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===po)return i.UNSIGNED_SHORT_5_5_5_1;if(n===fc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===pc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===hc)return i.BYTE;if(n===dc)return i.SHORT;if(n===Xr)return i.UNSIGNED_SHORT;if(n===ho)return i.INT;if(n===On)return i.UNSIGNED_INT;if(n===_n)return i.FLOAT;if(n===Bn)return i.HALF_FLOAT;if(n===mc)return i.ALPHA;if(n===gc)return i.RGB;if(n===wn)return i.RGBA;if(n===Hn)return i.DEPTH_COMPONENT;if(n===ki)return i.DEPTH_STENCIL;if(n===xc)return i.RED;if(n===mo)return i.RED_INTEGER;if(n===$n)return i.RG;if(n===go)return i.RG_INTEGER;if(n===xo)return i.RGBA_INTEGER;if(n===ks||n===Gs||n===Vs||n===Hs)if(a===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ks)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Gs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Vs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ks)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Gs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Vs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_o||n===vo||n===yo||n===So)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===_o)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===vo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===yo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===So)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Mo||n===bo||n===wo||n===Eo||n===To||n===Ws||n===Ao)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Mo||n===bo)return a===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===wo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Eo)return s.COMPRESSED_R11_EAC;if(n===To)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Ws)return s.COMPRESSED_RG11_EAC;if(n===Ao)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Co||n===Ro||n===Po||n===Io||n===Lo||n===Do||n===No||n===Uo||n===Fo||n===Oo||n===Bo||n===zo||n===ko||n===Go)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Co)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ro)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Po)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Io)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Lo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Do)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===No)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Uo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Fo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Oo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Bo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ko)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Go)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vo||n===Ho||n===Wo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Vo)return a===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ho)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Wo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xo||n===qo||n===Xs||n===Yo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Xo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===qo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xs)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Yo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===qr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var kx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Bc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new As(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Qt({vertexShader:kx,fragmentShader:Gx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new It(new Di(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},zc=class extends Wn{constructor(e,t){super();let n=this,r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,p=null,_=null,M=typeof XRWebGLBinding<"u",g=new Bc,f={},b=t.getContextAttributes(),L=null,S=null,w=[],E=[],P=new We,m=null,y=null,R=new an;R.viewport=new Ke;let I=new an;I.viewport=new Ke;let F=[R,I],D=new ro,A=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let k=w[G];return k===void 0&&(k=new zr,w[G]=k),k.getTargetRaySpace()},this.getControllerGrip=function(G){let k=w[G];return k===void 0&&(k=new zr,w[G]=k),k.getGripSpace()},this.getHand=function(G){let k=w[G];return k===void 0&&(k=new zr,w[G]=k),k.getHandSpace()};function Z(G){let k=E.indexOf(G.inputSource);if(k===-1)return;let j=w[k];j!==void 0&&(j.update(G.inputSource,G.frame,c||a),j.dispatchEvent({type:G.type,data:G.inputSource}))}function K(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",se);for(let G=0;G<w.length;G++){let k=E[G];k!==null&&(E[G]=null,w[G].disconnect(k))}A=null,z=null,g.reset();for(let G in f)delete f[G];if(e.setRenderTarget(L),p=null,h=null,d=null,r=null,S=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(m),e.setSize(P.width,P.height,!1),y!==null){let G=y.camera;G.fov=y.fov,G.zoom=y.zoom,G.updateProjectionMatrix(),y=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){s=G,n.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){o=G,n.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d===null&&M&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(G){if(r=G,r!==null){if(L=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",K),r.addEventListener("inputsourceschange",se),b.xrCompatible!==!0&&await t.makeXRCompatible(),m=e.getPixelRatio(),e.getSize(P),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let j=null,ie=null,oe=null;b.depth&&(oe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,j=b.stencil?ki:Hn,ie=b.stencil?qr:On);let Ee={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};d=this.getBinding(),h=d.createProjectionLayer(Ee),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new qt(h.textureWidth,h.textureHeight,{format:wn,type:cn,depthTexture:new Ii(h.textureWidth,h.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let j={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,j),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new qt(p.framebufferWidth,p.framebufferHeight,{format:wn,type:cn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),le.setContext(r),le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function se(G){for(let k=0;k<G.removed.length;k++){let j=G.removed[k],ie=E.indexOf(j);ie>=0&&(E[ie]=null,w[ie].disconnect(j))}for(let k=0;k<G.added.length;k++){let j=G.added[k],ie=E.indexOf(j);if(ie===-1){for(let Ee=0;Ee<w.length;Ee++)if(Ee>=E.length){E.push(j),ie=Ee;break}else if(E[Ee]===null){E[Ee]=j,ie=Ee;break}if(ie===-1)break}let oe=w[ie];oe&&oe.connect(j)}}let U=new V,q=new V;function C(G,k,j){U.setFromMatrixPosition(k.matrixWorld),q.setFromMatrixPosition(j.matrixWorld);let ie=U.distanceTo(q),oe=k.projectionMatrix.elements,Ee=j.projectionMatrix.elements,je=oe[14]/(oe[10]-1),ze=oe[14]/(oe[10]+1),Re=(oe[9]+1)/oe[5],nt=(oe[9]-1)/oe[5],Ge=(oe[8]-1)/oe[0],it=(Ee[8]+1)/Ee[0],mt=je*Ge,bt=je*it,Qe=ie/(-Ge+it),rt=Qe*-Ge;if(k.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(rt),G.translateZ(Qe),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert(),oe[10]===-1)G.projectionMatrix.copy(k.projectionMatrix),G.projectionMatrixInverse.copy(k.projectionMatrixInverse);else{let N=je+Qe,$e=ze+Qe,Ne=mt-rt,T=bt+(ie-rt),x=Re*ze/$e*N,H=nt*ze/$e*N;G.projectionMatrix.makePerspective(Ne,T,x,H,N,$e),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}}function $(G,k){k===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(k.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(r===null)return;let k=G.near,j=G.far;g.texture!==null&&(g.depthNear>0&&(k=g.depthNear),g.depthFar>0&&(j=g.depthFar)),D.near=I.near=R.near=k,D.far=I.far=R.far=j,(A!==D.near||z!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),A=D.near,z=D.far),D.layers.mask=G.layers.mask|6,R.layers.mask=D.layers.mask&-5,I.layers.mask=D.layers.mask&-3;let ie=G.parent,oe=D.cameras;$(D,ie);for(let Ee=0;Ee<oe.length;Ee++)$(oe[Ee],ie);oe.length===2?C(D,R,I):D.projectionMatrix.copy(R.projectionMatrix),y===null&&G.isPerspectiveCamera&&(y={camera:G,fov:G.fov,zoom:G.zoom}),ne(G,D,ie)};function ne(G,k,j){j===null?G.matrix.copy(k.matrixWorld):(G.matrix.copy(j.matrixWorld),G.matrix.invert(),G.matrix.multiply(k.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(k.projectionMatrix),G.projectionMatrixInverse.copy(k.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=Or*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(G){l=G,h!==null&&(h.fixedFoveation=G),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=G)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(G){return f[G]};let ye=null;function ce(G,k){if(u=k.getViewerPose(c||a),_=k,u!==null){let j=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let ie=!1;j.length!==D.cameras.length&&(D.cameras.length=0,ie=!0);for(let ze=0;ze<j.length;ze++){let Re=j[ze],nt=null;if(p!==null)nt=p.getViewport(Re);else{let it=d.getViewSubImage(h,Re);nt=it.viewport,ze===0&&(e.setRenderTargetTextures(S,it.colorTexture,it.depthStencilTexture),e.setRenderTarget(S))}let Ge=F[ze];Ge===void 0&&(Ge=new an,Ge.layers.enable(ze),Ge.viewport=new Ke,F[ze]=Ge),Ge.matrix.fromArray(Re.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(Re.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(nt.x,nt.y,nt.width,nt.height),ze===0&&(D.matrix.copy(Ge.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),ie===!0&&D.cameras.push(Ge)}let oe=r.enabledFeatures;if(oe&&oe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){d=n.getBinding();let ze=d.getDepthInformation(j[0]);ze&&ze.isValid&&ze.texture&&g.init(ze,r.renderState)}if(oe&&oe.includes("camera-access")&&M){e.state.unbindTexture(),d=n.getBinding();for(let ze=0;ze<j.length;ze++){let Re=j[ze].camera;if(Re){let nt=f[Re];nt||(nt=new As,f[Re]=nt);let Ge=d.getCameraImage(Re);nt.sourceTexture=Ge}}}}for(let j=0;j<w.length;j++){let ie=E[j],oe=w[j];ie!==null&&oe!==void 0&&oe.update(ie,k,c||a)}ye&&ye(G,k),k.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:k}),_=null}let le=new Jh;le.setAnimationLoop(ce),this.setAnimationLoop=function(G){ye=G},this.dispose=function(){}}},Vx=new ke,nd=new Oe;nd.set(-1,0,0,0,1,0,0,0,1);function Hx(i,e){function t(g,f){g.matrixAutoUpdate===!0&&g.updateMatrix(),f.value.copy(g.matrix)}function n(g,f){f.color.getRGB(g.fogColor.value,Sc(i)),f.isFog?(g.fogNear.value=f.near,g.fogFar.value=f.far):f.isFogExp2&&(g.fogDensity.value=f.density)}function r(g,f,b,L,S){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?s(g,f):f.isMeshLambertMaterial?(s(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(s(g,f),d(g,f)):f.isMeshPhongMaterial?(s(g,f),u(g,f),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(s(g,f),h(g,f),f.isMeshPhysicalMaterial&&p(g,f,S)):f.isMeshMatcapMaterial?(s(g,f),_(g,f)):f.isMeshDepthMaterial?s(g,f):f.isMeshDistanceMaterial?(s(g,f),M(g,f)):f.isMeshNormalMaterial?s(g,f):f.isLineBasicMaterial?(a(g,f),f.isLineDashedMaterial&&o(g,f)):f.isPointsMaterial?l(g,f,b,L):f.isSpriteMaterial?c(g,f):f.isShadowMaterial?(g.color.value.copy(f.color),g.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(g,f){g.opacity.value=f.opacity,f.color&&g.diffuse.value.copy(f.color),f.emissive&&g.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.bumpMap&&(g.bumpMap.value=f.bumpMap,t(f.bumpMap,g.bumpMapTransform),g.bumpScale.value=f.bumpScale,f.side===Ut&&(g.bumpScale.value*=-1)),f.normalMap&&(g.normalMap.value=f.normalMap,t(f.normalMap,g.normalMapTransform),g.normalScale.value.copy(f.normalScale),f.side===Ut&&g.normalScale.value.negate()),f.displacementMap&&(g.displacementMap.value=f.displacementMap,t(f.displacementMap,g.displacementMapTransform),g.displacementScale.value=f.displacementScale,g.displacementBias.value=f.displacementBias),f.emissiveMap&&(g.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,g.emissiveMapTransform)),f.specularMap&&(g.specularMap.value=f.specularMap,t(f.specularMap,g.specularMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest);let b=e.get(f),L=b.envMap,S=b.envMapRotation;L&&(g.envMap.value=L,g.envMapRotation.value.setFromMatrix4(Vx.makeRotationFromEuler(S)).transpose(),L.isCubeTexture&&L.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(nd),g.reflectivity.value=f.reflectivity,g.ior.value=f.ior,g.refractionRatio.value=f.refractionRatio),f.lightMap&&(g.lightMap.value=f.lightMap,g.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,g.lightMapTransform)),f.aoMap&&(g.aoMap.value=f.aoMap,g.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,g.aoMapTransform))}function a(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform))}function o(g,f){g.dashSize.value=f.dashSize,g.totalSize.value=f.dashSize+f.gapSize,g.scale.value=f.scale}function l(g,f,b,L){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.size.value=f.size*b,g.scale.value=L*.5,f.map&&(g.map.value=f.map,t(f.map,g.uvTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function c(g,f){g.diffuse.value.copy(f.color),g.opacity.value=f.opacity,g.rotation.value=f.rotation,f.map&&(g.map.value=f.map,t(f.map,g.mapTransform)),f.alphaMap&&(g.alphaMap.value=f.alphaMap,t(f.alphaMap,g.alphaMapTransform)),f.alphaTest>0&&(g.alphaTest.value=f.alphaTest)}function u(g,f){g.specular.value.copy(f.specular),g.shininess.value=Math.max(f.shininess,1e-4)}function d(g,f){f.gradientMap&&(g.gradientMap.value=f.gradientMap)}function h(g,f){g.metalness.value=f.metalness,f.metalnessMap&&(g.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,g.metalnessMapTransform)),g.roughness.value=f.roughness,f.roughnessMap&&(g.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,g.roughnessMapTransform)),f.envMap&&(g.envMapIntensity.value=f.envMapIntensity)}function p(g,f,b){g.ior.value=f.ior,f.sheen>0&&(g.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),g.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(g.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,g.sheenColorMapTransform)),f.sheenRoughnessMap&&(g.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,g.sheenRoughnessMapTransform))),f.clearcoat>0&&(g.clearcoat.value=f.clearcoat,g.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(g.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,g.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(g.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ut&&g.clearcoatNormalScale.value.negate())),f.dispersion>0&&(g.dispersion.value=f.dispersion),f.retroreflectivity>0&&(g.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(g.iridescence.value=f.iridescence,g.iridescenceIOR.value=f.iridescenceIOR,g.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(g.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,g.iridescenceMapTransform)),f.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),f.transmission>0&&(g.transmission.value=f.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(g.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,g.transmissionMapTransform)),g.thickness.value=f.thickness,f.thicknessMap&&(g.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=f.attenuationDistance,g.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(g.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(g.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=f.specularIntensity,g.specularColor.value.copy(f.specularColor),f.specularColorMap&&(g.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,g.specularColorMapTransform)),f.specularIntensityMap&&(g.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,g.specularIntensityMapTransform))}function _(g,f){f.matcap&&(g.matcap.value=f.matcap)}function M(g,f){let b=e.get(f).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Wx(i,e,t,n){let r={},s={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,w){let E=w.program;n.uniformBlockBinding(S,E)}function c(S,w){let E=r[S.id];E===void 0&&(g(S),E=u(S),r[S.id]=E,S.addEventListener("dispose",b));let P=w.program;n.updateUBOMapping(S,P);let m=e.render.frame;s[S.id]!==m&&(h(S),s[S.id]=m)}function u(S){let w=d();S.__bindingPointIndex=w;let E=i.createBuffer(),P=S.__size,m=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,P,m),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,E),E}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){let w=r[S.id],E=S.uniforms,P=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let m=0,y=E.length;m<y;m++){let R=E[m];if(Array.isArray(R))for(let I=0,F=R.length;I<F;I++)p(R[I],m,I,P);else p(R,m,0,P)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,w,E,P){if(M(S,w,E,P)===!0){let m=S.__offset,y=S.value;if(Array.isArray(y)){let R=0;for(let I=0;I<y.length;I++){let F=y[I],D=f(F);_(F,S.__data,R),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(R+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(y,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,m,S.__data)}}function _(S,w,E){typeof S=="number"||typeof S=="boolean"?w[0]=S:S.isMatrix3?(w[0]=S.elements[0],w[1]=S.elements[1],w[2]=S.elements[2],w[3]=0,w[4]=S.elements[3],w[5]=S.elements[4],w[6]=S.elements[5],w[7]=0,w[8]=S.elements[6],w[9]=S.elements[7],w[10]=S.elements[8],w[11]=0):ArrayBuffer.isView(S)?w.set(new S.constructor(S.buffer,S.byteOffset,w.length)):S.toArray(w,E)}function M(S,w,E,P){let m=S.value,y=w+"_"+E;if(P[y]===void 0)return typeof m=="number"||typeof m=="boolean"?P[y]=m:ArrayBuffer.isView(m)?P[y]=m.slice():P[y]=m.clone(),!0;{let R=P[y];if(typeof m=="number"||typeof m=="boolean"){if(R!==m)return P[y]=m,!0}else{if(ArrayBuffer.isView(m))return!0;if(R.equals(m)===!1)return R.copy(m),!0}}return!1}function g(S){let w=S.uniforms,E=0,P=16;for(let y=0,R=w.length;y<R;y++){let I=Array.isArray(w[y])?w[y]:[w[y]];for(let F=0,D=I.length;F<D;F++){let A=I[F],z=Array.isArray(A.value)?A.value:[A.value];for(let Z=0,K=z.length;Z<K;Z++){let se=z[Z],U=f(se),q=E%P,C=q%U.boundary,$=q+C;E+=C,$!==0&&P-$<U.storage&&(E+=P-$),A.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),A.__offset=E,E+=U.storage}}}let m=E%P;return m>0&&(E+=P-m),S.__size=E,S.__cache={},this}function f(S){let w={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(w.boundary=4,w.storage=4):S.isVector2?(w.boundary=8,w.storage=8):S.isVector3||S.isColor?(w.boundary=16,w.storage=12):S.isVector4?(w.boundary=16,w.storage=16):S.isMatrix3?(w.boundary=48,w.storage=48):S.isMatrix4?(w.boundary=64,w.storage=64):S.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(w.boundary=16,w.storage=S.byteLength):Fe("WebGLRenderer: Unsupported uniform value type.",S),w}function b(S){let w=S.target;w.removeEventListener("dispose",b);let E=a.indexOf(w.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function L(){for(let S in r)i.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:l,update:c,dispose:L}}var Xx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Zn=null;function qx(){return Zn===null&&(Zn=new kr(Xx,16,16,$n,Bn),Zn.name="DFG_LUT",Zn.minFilter=Pt,Zn.magFilter=Pt,Zn.wrapS=mn,Zn.wrapT=mn,Zn.generateMipmaps=!1,Zn.needsUpdate=!0),Zn}var Kr=class{constructor(e={}){let{canvas:t=Mh(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:p=cn}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;let M=p,g=new Set([xo,go,mo]),f=new Set([cn,On,Xr,qr,fo,po]),b=new Uint32Array(4),L=new Int32Array(4),S=new V,w=null,E=null,P=[],m=[],y=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,I=!1,F=null,D=null,A=null,z=null;this._outputColorSpace=pn;let Z=0,K=0,se=null,U=-1,q=null,C=new Ke,$=new Ke,ne=null,ye=new qe(0),ce=0,le=t.width,G=t.height,k=1,j=null,ie=null,oe=new Ke(0,0,le,G),Ee=new Ke(0,0,le,G),je=!1,ze=new Gr,Re=!1,nt=!1,Ge=new ke,it=new V,mt=new Ke,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Qe=!1;function rt(){return se===null?k:1}let N=n;function $e(v,O){return t.getContext(v,O)}let Ne,T,x,H,Y,Q,ue,de,ee,re,fe,Ie,xe,pe,Le,Ue,Ve,B,me,te,ge,Se,ae;try{let v={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",ft,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",Cn,!1),N===null){let O="webgl2";if(N=$e(O,v),N===null)throw $e(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}De()}catch(v){throw t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Cn,!1),Be("WebGLRenderer: "+v.message),v}function De(){Ne=new Qg(N),Ne.init(),ge=new zx(N,Ne),T=new Hg(N,Ne,e,ge),x=new Ox(N,Ne),T.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),D=N.createFramebuffer(),A=N.createFramebuffer(),z=N.createFramebuffer(),H=new n0(N),Y=new bx,Q=new Bx(N,Ne,x,Y,T,ge,H),ue=new jg(R),de=new rp(N),Se=new Gg(N,de),ee=new e0(N,de,H,Se),re=new r0(N,ee,de,Se,H),B=new i0(N,T,Q),Le=new Wg(Y),fe=new Mx(R,ue,Ne,T,Se,Le),Ie=new Hx(R,Y),xe=new Ex,pe=new Ix(Ne),Ve=new kg(R,ue,x,re,_,l),Ue=new Fx(R,re,T),ae=new Wx(N,H,T,x),me=new Vg(N,Ne,H),te=new t0(N,Ne,H),H.programs=fe.programs,R.capabilities=T,R.extensions=Ne,R.properties=Y,R.renderLists=xe,R.shadowMap=Ue,R.state=x,R.info=H}M!==cn&&(y=new a0(M,t.width,t.height,o,r,s));let Ce=new zc(R,N);this.xr=Ce,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let v=Ne.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=Ne.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(v){v!==void 0&&(k=v,this.setSize(le,G,!1))},this.getSize=function(v){return v.set(le,G)},this.setSize=function(v,O,J=!0){if(Ce.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}le=v,G=O,t.width=Math.floor(v*k),t.height=Math.floor(O*k),J===!0&&(t.style.width=v+"px",t.style.height=O+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,v,O)},this.getDrawingBufferSize=function(v){return v.set(le*k,G*k).floor()},this.setDrawingBufferSize=function(v,O,J){le=v,G=O,k=J,t.width=Math.floor(v*J),t.height=Math.floor(O*J),this.setViewport(0,0,v,O)},this.setEffects=function(v){if(M===cn){Be("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let O=0;O<v.length;O++)if(v[O].isOutputPass===!0){Fe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(C)},this.getViewport=function(v){return v.copy(oe)},this.setViewport=function(v,O,J,W){v.isVector4?oe.set(v.x,v.y,v.z,v.w):oe.set(v,O,J,W),x.viewport(C.copy(oe).multiplyScalar(k).round())},this.getScissor=function(v){return v.copy(Ee)},this.setScissor=function(v,O,J,W){v.isVector4?Ee.set(v.x,v.y,v.z,v.w):Ee.set(v,O,J,W),x.scissor($.copy(Ee).multiplyScalar(k).round())},this.getScissorTest=function(){return je},this.setScissorTest=function(v){x.setScissorTest(je=v)},this.setOpaqueSort=function(v){j=v},this.setTransparentSort=function(v){ie=v},this.getClearColor=function(v){return v.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(v=!0,O=!0,J=!0){let W=0;if(v){let X=!1;if(se!==null){let ve=se.texture.format;X=g.has(ve)}if(X){let ve=se.texture.type,be=f.has(ve),_e=Ve.getClearColor(),Te=Ve.getClearAlpha(),Pe=_e.r,Xe=_e.g,Ze=_e.b;be?(b[0]=Pe,b[1]=Xe,b[2]=Ze,b[3]=Te,N.clearBufferuiv(N.COLOR,0,b)):(L[0]=Pe,L[1]=Xe,L[2]=Ze,L[3]=Te,N.clearBufferiv(N.COLOR,0,L))}else W|=N.COLOR_BUFFER_BIT}O&&(W|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(W|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&N.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),F=v},this.dispose=function(){t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Cn,!1),Ve.dispose(),xe.dispose(),pe.dispose(),Y.dispose(),ue.dispose(),re.dispose(),Se.dispose(),ae.dispose(),fe.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",uu),Ce.removeEventListener("sessionend",hu),Yi.stop()};function ft(v){v.preventDefault(),Ss("WebGLRenderer: Context Lost."),I=!0}function st(){Ss("WebGLRenderer: Context Restored."),I=!1;let v=H.autoReset,O=Ue.enabled,J=Ue.autoUpdate,W=Ue.needsUpdate,X=Ue.type;De(),H.autoReset=v,Ue.enabled=O,Ue.autoUpdate=J,Ue.needsUpdate=W,Ue.type=X}function Cn(v){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function kn(v){let O=v.target;O.removeEventListener("dispose",kn),Xd(O)}function Xd(v){qd(v),Y.remove(v)}function qd(v){let O=Y.get(v).programs;O!==void 0&&(O.forEach(function(J){fe.releaseProgram(J)}),v.isShaderMaterial&&fe.releaseShaderCache(v))}this.renderBufferDirect=function(v,O,J,W,X,ve){O===null&&(O=bt);let be=X.isMesh&&X.matrixWorld.determinantAffine()<0,_e=Zd(v,O,J,W,X);x.setMaterial(W,be);let Te=J.index,Pe=1;if(W.wireframe===!0){if(Te=ee.getWireframeAttribute(J),Te===void 0)return;Pe=2}let Xe=J.drawRange,Ze=J.attributes.position,Ae=Xe.start*Pe,at=(Xe.start+Xe.count)*Pe;ve!==null&&(Ae=Math.max(Ae,ve.start*Pe),at=Math.min(at,(ve.start+ve.count)*Pe)),Te!==null?(Ae=Math.max(Ae,0),at=Math.min(at,Te.count)):Ze!=null&&(Ae=Math.max(Ae,0),at=Math.min(at,Ze.count));let Tt=at-Ae;if(Tt<0||Tt===1/0)return;Se.setup(X,W,_e,J,Te);let gt,dt=me;if(Te!==null&&(gt=de.get(Te),dt=te,dt.setIndex(gt)),X.isMesh)W.wireframe===!0?(x.setLineWidth(W.wireframeLinewidth*rt()),dt.setMode(N.LINES)):dt.setMode(N.TRIANGLES);else if(X.isLine){let Gt=W.linewidth;Gt===void 0&&(Gt=1),x.setLineWidth(Gt*rt()),X.isLineSegments?dt.setMode(N.LINES):X.isLineLoop?dt.setMode(N.LINE_LOOP):dt.setMode(N.LINE_STRIP)}else X.isPoints?dt.setMode(N.POINTS):X.isSprite&&dt.setMode(N.TRIANGLES);if(X.isBatchedMesh)if(Ne.get("WEBGL_multi_draw"))dt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let Gt=X._multiDrawStarts,Me=X._multiDrawCounts,Jt=X._multiDrawCount,et=Te?de.get(Te).bytesPerElement:1,Sn=Y.get(W).currentProgram.getUniforms();for(let Gn=0;Gn<Jt;Gn++)Sn.setValue(N,"_gl_DrawID",Gn),dt.render(Gt[Gn]/et,Me[Gn])}else if(X.isInstancedMesh)dt.renderInstances(Ae,Tt,X.count);else if(J.isInstancedBufferGeometry){let Gt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Me=Math.min(J.instanceCount,Gt);dt.renderInstances(Ae,Tt,Me)}else dt.render(Ae,Tt)};function cu(v,O,J,W){F!==null&&v.isNodeMaterial&&F.setObject(W,v),Re===!0&&Le.setState(v,J,!1),v.transparent===!0&&v.side===Yt&&v.forceSinglePass===!1?(v.side=Ut,v.needsUpdate=!0,sa(v,O,W),v.side=Yn,v.needsUpdate=!0,sa(v,O,W),v.side=Yt):sa(v,O,W)}this.compile=function(v,O,J=null){J===null&&(J=v),F!==null&&F.renderStart(v,O,J),E=pe.get(J),E.init(O),m.push(E),J.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(E.pushLight(X),X.castShadow&&E.pushShadow(X))}),v!==J&&v.traverseVisible(function(X){X.isLight&&X.layers.test(O.layers)&&(E.pushLight(X),X.castShadow&&E.pushShadow(X))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),nt=this.localClippingEnabled,Re=Le.init(this.clippingPlanes,nt),Re===!0&&Le.setGlobalState(this.clippingPlanes,O),F!==null&&Ue.render(E.state.shadowsArray,J,O);let W=new Set;return v.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let ve=X.material;if(ve)if(Array.isArray(ve))for(let be=0;be<ve.length;be++){let _e=ve[be];cu(_e,J,O,X),W.add(_e)}else cu(ve,J,O,X),W.add(ve)}),E=m.pop(),F!==null&&F.renderEnd(),W},this.compileAsync=function(v,O,J=null){let W=this.compile(v,O,J);return new Promise(X=>{function ve(){if(W.forEach(function(be){let Te=Y.get(be).currentProgram;(Te===void 0||Te.isReady())&&W.delete(be)}),W.size===0){X(v);return}setTimeout(ve,10)}Ne.get("KHR_parallel_shader_compile")!==null?ve():setTimeout(ve,10)})};let yl=null;function Yd(v){yl&&yl(v)}function uu(){Yi.stop()}function hu(){Yi.start()}let Yi=new Jh;Yi.setAnimationLoop(Yd),typeof self<"u"&&Yi.setContext(self),this.setAnimationLoop=function(v){yl=v,Ce.setAnimationLoop(v),v===null?Yi.stop():Yi.start()},Ce.addEventListener("sessionstart",uu),Ce.addEventListener("sessionend",hu),this.render=function(v,O){if(O!==void 0&&O.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(v,O);let J=Ce.enabled===!0&&Ce.isPresenting===!0,W=y!==null&&(se===null||J)&&y.begin(R,se);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(O),O=Ce.getCamera()),v.isScene===!0&&v.onBeforeRender(R,v,O,se),E=pe.get(v,m.length),E.init(O),E.state.textureUnits=Q.getTextureUnits(),m.push(E),Ge.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ze.setFromProjectionMatrix(Ge,Nn,O.reversedDepth),nt=this.localClippingEnabled,Re=Le.init(this.clippingPlanes,nt),w=xe.get(v,P.length),w.init(),P.push(w),Ce.enabled===!0&&Ce.isPresenting===!0){let be=R.xr.getDepthSensingMesh();be!==null&&Sl(be,O,-1/0,R.sortObjects)}Sl(v,O,0,R.sortObjects),w.finish(),F!==null&&F.updateLights(E.state.lightsArray),R.sortObjects===!0&&w.sort(j,ie),Qe=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,Qe&&Ve.addToRenderList(w,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Re===!0&&Le.beginShadows();let X=E.state.shadowsArray;if(Ue.render(X,v,O),Re===!0&&Le.endShadows(),(W&&y.hasRenderPass())===!1){let be=w.opaque,_e=w.transmissive;if(E.setupLights(),O.isArrayCamera){let Te=O.cameras;if(_e.length>0)for(let Pe=0,Xe=Te.length;Pe<Xe;Pe++){let Ze=Te[Pe];fu(be,_e,v,Ze)}Qe&&Ve.render(v);for(let Pe=0,Xe=Te.length;Pe<Xe;Pe++){let Ze=Te[Pe];du(w,v,Ze,Ze.viewport)}}else _e.length>0&&fu(be,_e,v,O),Qe&&Ve.render(v),du(w,v,O)}se!==null&&K===0&&(Q.updateMultisampleRenderTarget(se),Q.updateRenderTargetMipmap(se)),W&&y.end(R),v.isScene===!0&&v.onAfterRender(R,v,O),Se.resetDefaultState(),U=-1,q=null,m.pop(),m.length>0?(E=m[m.length-1],Q.setTextureUnits(E.state.textureUnits),Re===!0&&Le.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,P.pop(),P.length>0?w=P[P.length-1]:w=null,F!==null&&F.renderEnd()};function Sl(v,O,J,W){if(v.visible===!1)return;if(v.layers.test(O.layers)){if(v.isGroup)J=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(O);else if(v.isLightProbeGrid)E.pushLightProbeGrid(v);else if(v.isLight)E.pushLight(v),v.castShadow&&E.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(ze)){W&&mt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ge);let be=re.update(v),_e=v.material;_e.visible&&w.push(v,be,_e,J,mt.z,null,O)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(ze))){let be=re.update(v),_e=v.material;if(W&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),mt.copy(v.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),mt.copy(be.boundingSphere.center)),mt.applyMatrix4(v.matrixWorld).applyMatrix4(Ge)),Array.isArray(_e)){let Te=be.groups;for(let Pe=0,Xe=Te.length;Pe<Xe;Pe++){let Ze=Te[Pe],Ae=_e[Ze.materialIndex];Ae&&Ae.visible&&w.push(v,be,Ae,J,mt.z,Ze,O)}}else _e.visible&&w.push(v,be,_e,J,mt.z,null,O)}}let ve=v.children;for(let be=0,_e=ve.length;be<_e;be++)Sl(ve[be],O,J,W)}function du(v,O,J,W){let{opaque:X,transmissive:ve,transparent:be}=v;E.setupLightsView(J),Re===!0&&Le.setGlobalState(R.clippingPlanes,J),W&&x.viewport(C.copy(W)),X.length>0&&ra(X,O,J),ve.length>0&&ra(ve,O,J),be.length>0&&ra(be,O,J),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function fu(v,O,J,W){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[W.id]===void 0){let Ae=Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[W.id]=new qt(1,1,{generateMipmaps:!0,type:Ae?Bn:cn,minFilter:zi,samples:Math.max(4,T.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Je.workingColorSpace})}let ve=E.state.transmissionRenderTarget[W.id],be=W.viewport||C;ve.setSize(be.z*R.transmissionResolutionScale,be.w*R.transmissionResolutionScale);let _e=R.getRenderTarget(),Te=R.getActiveCubeFace(),Pe=R.getActiveMipmapLevel();R.setRenderTarget(ve),R.getClearColor(ye),ce=R.getClearAlpha(),ce<1&&R.setClearColor(16777215,.5),R.clear(),Qe&&Ve.render(J);let Xe=R.toneMapping;R.toneMapping=Fn;let Ze=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),E.setupLightsView(W),Re===!0&&Le.setGlobalState(R.clippingPlanes,W),ra(v,J,W),Q.updateMultisampleRenderTarget(ve),Q.updateRenderTargetMipmap(ve),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let at=0,Tt=O.length;at<Tt;at++){let gt=O[at],{object:dt,geometry:Gt,material:Me,group:Jt}=gt;if(Me.side===Yt&&dt.layers.test(W.layers)){let et=Me.side;Me.side=Ut,Me.needsUpdate=!0,pu(dt,J,W,Gt,Me,Jt),Me.side=et,Me.needsUpdate=!0,Ae=!0}}Ae===!0&&(Q.updateMultisampleRenderTarget(ve),Q.updateRenderTargetMipmap(ve))}R.setRenderTarget(_e,Te,Pe),R.setClearColor(ye,ce),Ze!==void 0&&(W.viewport=Ze),R.toneMapping=Xe}function ra(v,O,J){let W=O.isScene===!0?O.overrideMaterial:null;for(let X=0,ve=v.length;X<ve;X++){let be=v[X],{object:_e,geometry:Te,group:Pe}=be,Xe=be.material;Xe.allowOverride===!0&&W!==null&&(Xe=W),_e.layers.test(J.layers)&&pu(_e,O,J,Te,Xe,Pe)}}function pu(v,O,J,W,X,ve){F!==null&&X.isNodeMaterial&&F.setObject(v,X),v.onBeforeRender(R,O,J,W,X,ve),v.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),X.onBeforeRender(R,O,J,W,v,ve),X.transparent===!0&&X.side===Yt&&X.forceSinglePass===!1?(X.side=Ut,X.needsUpdate=!0,R.renderBufferDirect(J,O,W,X,v,ve),X.side=Yn,X.needsUpdate=!0,R.renderBufferDirect(J,O,W,X,v,ve),X.side=Yt):R.renderBufferDirect(J,O,W,X,v,ve),v.onAfterRender(R,O,J,W,X,ve)}function sa(v,O,J){O.isScene!==!0&&(O=bt);let W=Y.get(v),X=E.state.lights,ve=E.state.shadowsArray,be=X.state.version,_e=fe.getParameters(v,X.state,ve,O,J,E.state.lightProbeGridArray),Te=fe.getProgramCacheKey(_e),Pe=W.programs;W.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?O.environment:null,W.fog=O.fog;let Xe=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;W.envMap=ue.get(v.envMap||W.environment,Xe),W.envMapRotation=W.environment!==null&&v.envMap===null?O.environmentRotation:v.envMapRotation,Pe===void 0&&(v.addEventListener("dispose",kn),Pe=new Map,W.programs=Pe);let Ze=Pe.get(Te);if(Ze!==void 0){if(W.currentProgram===Ze&&W.lightsStateVersion===be)return gu(v,_e),Ze}else _e.uniforms=fe.getUniforms(v),F!==null&&v.isNodeMaterial&&F.build(v,J,_e),v.onBeforeCompile(_e,R),Ze=fe.acquireProgram(_e,Te),Pe.set(Te,Ze),W.uniforms=_e.uniforms;let Ae=W.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Ae.clippingPlanes=Le.uniform),gu(v,_e),W.needsLights=Kd(v),W.lightsStateVersion=be,W.needsLights&&(Ae.ambientLightColor.value=X.state.ambient,Ae.lightProbe.value=X.state.probe,Ae.sunLights.value=X.state.sun,Ae.sunLightShadows.value=X.state.sunShadow,Ae.directionalLights.value=X.state.directional,Ae.directionalLightShadows.value=X.state.directionalShadow,Ae.spotLights.value=X.state.spot,Ae.spotLightShadows.value=X.state.spotShadow,Ae.rectAreaLights.value=X.state.rectArea,Ae.ltc_1.value=X.state.rectAreaLTC1,Ae.ltc_2.value=X.state.rectAreaLTC2,Ae.pointLights.value=X.state.point,Ae.pointLightShadows.value=X.state.pointShadow,Ae.hemisphereLights.value=X.state.hemi,Ae.sunShadowMatrix.value=X.state.sunShadowMatrix,Ae.sunShadowCascade.value=X.state.sunShadowCascade,Ae.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ae.spotLightMatrix.value=X.state.spotLightMatrix,Ae.spotLightMap.value=X.state.spotLightMap,Ae.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=E.state.lightProbeGridArray.length>0,W.currentProgram=Ze,W.uniformsList=null,Ze}function mu(v){if(v.uniformsList===null){let O=v.currentProgram.getUniforms();v.uniformsList=Jr.seqWithValue(O.seq,v.uniforms)}return v.uniformsList}function gu(v,O){let J=Y.get(v);J.outputColorSpace=O.outputColorSpace,J.batching=O.batching,J.batchingColor=O.batchingColor,J.instancing=O.instancing,J.instancingColor=O.instancingColor,J.instancingMorph=O.instancingMorph,J.skinning=O.skinning,J.morphTargets=O.morphTargets,J.morphNormals=O.morphNormals,J.morphColors=O.morphColors,J.morphTargetsCount=O.morphTargetsCount,J.numClippingPlanes=O.numClippingPlanes,J.numIntersection=O.numClipIntersection,J.vertexAlphas=O.vertexAlphas,J.vertexTangents=O.vertexTangents,J.toneMapping=O.toneMapping}function $d(v,O){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;S.setFromMatrixPosition(O.matrixWorld);for(let J=0,W=v.length;J<W;J++){let X=v[J];if(X.texture!==null&&X.boundingBox.containsPoint(S))return X}return null}function Zd(v,O,J,W,X){O.isScene!==!0&&(O=bt),Q.resetTextureUnits();let ve=O.fog,be=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?O.environment:null,_e=se===null?R.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:Je.workingColorSpace,Te=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Pe=ue.get(W.envMap||be,Te),Xe=W.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Ze=!!J.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ae=!!J.morphAttributes.position,at=!!J.morphAttributes.normal,Tt=!!J.morphAttributes.color,gt=Fn;W.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(gt=R.toneMapping);let dt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Gt=dt!==void 0?dt.length:0,Me=Y.get(W),Jt=E.state.lights;if(Re===!0&&(nt===!0||v!==q)){let pt=v===q&&W.id===U;Le.setState(W,v,pt)}let et=!1;W.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Jt.state.version||Me.outputColorSpace!==_e||X.isBatchedMesh&&Me.batching===!1||!X.isBatchedMesh&&Me.batching===!0||X.isBatchedMesh&&Me.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&Me.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&Me.instancing===!1||!X.isInstancedMesh&&Me.instancing===!0||X.isSkinnedMesh&&Me.skinning===!1||!X.isSkinnedMesh&&Me.skinning===!0||X.isInstancedMesh&&Me.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Me.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Me.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Me.instancingMorph===!1&&X.morphTexture!==null||Me.envMap!==Pe||W.fog===!0&&Me.fog!==ve||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Le.numPlanes||Me.numIntersection!==Le.numIntersection)||Me.vertexAlphas!==Xe||Me.vertexTangents!==Ze||Me.morphTargets!==Ae||Me.morphNormals!==at||Me.morphColors!==Tt||Me.toneMapping!==gt||Me.morphTargetsCount!==Gt||!!Me.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(et=!0):(et=!0,Me.__version=W.version);let Sn=Me.currentProgram;et===!0&&(Sn=sa(W,O,X),F&&W.isNodeMaterial&&F.onUpdateProgram(W,Sn,Me));let Gn=!1,Si=!1,gr=!1,ht=Sn.getUniforms(),Et=Me.uniforms;if(x.useProgram(Sn.program)&&(Gn=!0,Si=!0,gr=!0),W.id!==U&&(U=W.id,Si=!0),Me.needsLights){let pt=$d(E.state.lightProbeGridArray,X);Me.lightProbeGrid!==pt&&(Me.lightProbeGrid=pt,Si=!0)}if(Gn||q!==v){x.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ht.setValue(N,"projectionMatrix",v.projectionMatrix),ht.setValue(N,"viewMatrix",v.matrixWorldInverse);let bi=ht.map.cameraPosition;bi!==void 0&&bi.setValue(N,it.setFromMatrixPosition(v.matrixWorld)),T.logarithmicDepthBuffer&&ht.setValue(N,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ht.setValue(N,"isOrthographic",v.isOrthographicCamera===!0),q!==v&&(q=v,Si=!0,gr=!0)}if(Me.needsLights&&(Jt.state.sunShadowMap.length>0&&ht.setValue(N,"sunShadowMap",Jt.state.sunShadowMap,Q),Jt.state.directionalShadowMap.length>0&&ht.setValue(N,"directionalShadowMap",Jt.state.directionalShadowMap,Q),Jt.state.spotShadowMap.length>0&&ht.setValue(N,"spotShadowMap",Jt.state.spotShadowMap,Q),Jt.state.pointShadowMap.length>0&&ht.setValue(N,"pointShadowMap",Jt.state.pointShadowMap,Q)),X.isSkinnedMesh){ht.setOptional(N,X,"bindMatrix"),ht.setOptional(N,X,"bindMatrixInverse");let pt=X.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),ht.setValue(N,"boneTexture",pt.boneTexture,Q))}X.isBatchedMesh&&(ht.setOptional(N,X,"batchingTexture"),ht.setValue(N,"batchingTexture",X._matricesTexture,Q),ht.setOptional(N,X,"batchingIdTexture"),ht.setValue(N,"batchingIdTexture",X._indirectTexture,Q),ht.setOptional(N,X,"batchingColorTexture"),X._colorsTexture!==null&&ht.setValue(N,"batchingColorTexture",X._colorsTexture,Q));let Mi=J.morphAttributes;if((Mi.position!==void 0||Mi.normal!==void 0||Mi.color!==void 0)&&B.update(X,J,Sn),(Si||Me.receiveShadow!==X.receiveShadow)&&(Me.receiveShadow=X.receiveShadow,ht.setValue(N,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&O.environment!==null&&(Et.envMapIntensity.value=O.environmentIntensity),Et.dfgLUT!==void 0&&(Et.dfgLUT.value=qx()),Si){if(ht.setValue(N,"toneMappingExposure",R.toneMappingExposure),Me.needsLights&&Jd(Et,gr),ve&&W.fog===!0&&Ie.refreshFogUniforms(Et,ve),Ie.refreshMaterialUniforms(Et,W,k,G,E.state.transmissionRenderTarget[v.id]),Me.needsLights&&Me.lightProbeGrid){let pt=Me.lightProbeGrid;Et.probesSH.value=pt.texture,Et.probesMin.value.copy(pt.boundingBox.min),Et.probesMax.value.copy(pt.boundingBox.max),Et.probesResolution.value.copy(pt.resolution)}Jr.upload(N,mu(Me),Et,Q)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Jr.upload(N,mu(Me),Et,Q),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ht.setValue(N,"center",X.center),ht.setValue(N,"modelViewMatrix",X.modelViewMatrix),ht.setValue(N,"normalMatrix",X.normalMatrix),ht.setValue(N,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){let pt=W.uniformsGroups;for(let bi=0,xr=pt.length;bi<xr;bi++){let _u=pt[bi];ae.update(_u,Sn),ae.bind(_u,Sn)}}return Sn}function Jd(v,O){v.ambientLightColor.needsUpdate=O,v.lightProbe.needsUpdate=O,v.sunLights.needsUpdate=O,v.sunLightShadows.needsUpdate=O,v.directionalLights.needsUpdate=O,v.directionalLightShadows.needsUpdate=O,v.pointLights.needsUpdate=O,v.pointLightShadows.needsUpdate=O,v.spotLights.needsUpdate=O,v.spotLightShadows.needsUpdate=O,v.rectAreaLights.needsUpdate=O,v.hemisphereLights.needsUpdate=O}function Kd(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return K},this.getRenderTarget=function(){return se},this.setRenderTargetTextures=function(v,O,J){let W=Y.get(v);W.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),Y.get(v.texture).__webglTexture=O,Y.get(v.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:J,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,O){let J=Y.get(v);J.__webglFramebuffer=O,J.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(v,O=0,J=0){se=v,Z=O,K=J;let W=null,X=!1,ve=!1;if(v){let _e=Y.get(v);if(_e.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(N.FRAMEBUFFER,_e.__webglFramebuffer),C.copy(v.viewport),$.copy(v.scissor),ne=v.scissorTest,x.viewport(C),x.scissor($),x.setScissorTest(ne),U=-1;return}else if(_e.__webglFramebuffer===void 0)Q.setupRenderTarget(v);else if(_e.__hasExternalTextures)Q.rebindTextures(v,Y.get(v.texture).__webglTexture,Y.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let Xe=v.depthTexture;if(_e.__boundDepthTexture!==Xe){if(Xe!==null&&Y.has(Xe)&&(v.width!==Xe.image.width||v.height!==Xe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(v)}}let Te=v.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(ve=!0);let Pe=Y.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Pe[O])?W=Pe[O][J]:W=Pe[O],X=!0):v.samples>0&&Q.useMultisampledRTT(v)===!1?W=Y.get(v).__webglMultisampledFramebuffer:Array.isArray(Pe)?W=Pe[J]:W=Pe,C.copy(v.viewport),$.copy(v.scissor),ne=v.scissorTest}else C.copy(oe).multiplyScalar(k).floor(),$.copy(Ee).multiplyScalar(k).floor(),ne=je;if(J!==0&&(W=D),x.bindFramebuffer(N.FRAMEBUFFER,W)&&x.drawBuffers(v,W),x.viewport(C),x.scissor($),x.setScissorTest(ne),X){let _e=Y.get(v.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+O,_e.__webglTexture,J)}else if(ve){let _e=O;for(let Te=0;Te<v.textures.length;Te++){let Pe=Y.get(v.textures[Te]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Te,Pe.__webglTexture,J,_e)}}else if(v!==null&&J!==0){let _e=Y.get(v.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,_e.__webglTexture,J)}U=-1};function xu(v){let O=Y.get(v);return(O.__readFormat!==v.format||O.__readType!==v.type)&&(O.__readFormat=v.format,O.__readType=v.type,O.__formatReadable=T.textureFormatReadable(v.format),O.__typeReadable=T.textureTypeReadable(v.type)),O}this.readRenderTargetPixels=function(v,O,J,W,X,ve,be,_e=0){if(!(v&&v.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Y.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&be!==void 0&&(Te=Te[be]),Te){x.bindFramebuffer(N.FRAMEBUFFER,Te);try{let Pe=v.textures[_e],Xe=Pe.format,Ze=Pe.type;v.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+_e);let Ae=xu(Pe);if(Ae.__formatReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ae.__typeReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=v.width-W&&J>=0&&J<=v.height-X&&N.readPixels(O,J,W,X,ge.convert(Xe),ge.convert(Ze),ve)}finally{let Pe=se!==null?Y.get(se).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(v,O,J,W,X,ve,be,_e=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=Y.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&be!==void 0&&(Te=Te[be]),Te)if(O>=0&&O<=v.width-W&&J>=0&&J<=v.height-X){x.bindFramebuffer(N.FRAMEBUFFER,Te);let Pe=v.textures[_e],Xe=Pe.format,Ze=Pe.type;v.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+_e);let Ae=xu(Pe);if(Ae.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ae.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let at=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,at),N.bufferData(N.PIXEL_PACK_BUFFER,ve.byteLength,N.STREAM_READ),N.readPixels(O,J,W,X,ge.convert(Xe),ge.convert(Ze),0),N.bindBuffer(N.PIXEL_PACK_BUFFER,null);let Tt=se!==null?Y.get(se).__webglFramebuffer:null;x.bindFramebuffer(N.FRAMEBUFFER,Tt);let gt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await wh(N,gt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,at),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ve),N.bindBuffer(N.PIXEL_PACK_BUFFER,null),N.deleteBuffer(at),N.deleteSync(gt),ve}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,O=null,J=0){let W=Math.pow(2,-J),X=Math.floor(v.image.width*W),ve=Math.floor(v.image.height*W),be=O!==null?O.x:0,_e=O!==null?O.y:0;Q.setTexture2D(v,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,be,_e,X,ve),x.unbindTexture()},this.copyTextureToTexture=function(v,O,J=null,W=null,X=0,ve=0){let be,_e,Te,Pe,Xe,Ze,Ae,at,Tt,gt=v.isCompressedTexture?v.mipmaps[ve]:v.image;if(J!==null)be=J.max.x-J.min.x,_e=J.max.y-J.min.y,Te=J.isBox3?J.max.z-J.min.z:1,Pe=J.min.x,Xe=J.min.y,Ze=J.isBox3?J.min.z:0;else{let Et=Math.pow(2,-X);be=Math.floor(gt.width*Et),_e=Math.floor(gt.height*Et),v.isDataArrayTexture?Te=gt.depth:v.isData3DTexture?Te=Math.floor(gt.depth*Et):Te=1,Pe=0,Xe=0,Ze=0}W!==null?(Ae=W.x,at=W.y,Tt=W.z):(Ae=0,at=0,Tt=0);let dt=ge.convert(O.format),Gt=ge.convert(O.type),Me;O.isData3DTexture?(Q.setTexture3D(O,0),Me=N.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Q.setTexture2DArray(O,0),Me=N.TEXTURE_2D_ARRAY):(Q.setTexture2D(O,0),Me=N.TEXTURE_2D),x.activeTexture(N.TEXTURE0),x.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,O.flipY),x.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),x.pixelStorei(N.UNPACK_ALIGNMENT,O.unpackAlignment);let Jt=x.getParameter(N.UNPACK_ROW_LENGTH),et=x.getParameter(N.UNPACK_IMAGE_HEIGHT),Sn=x.getParameter(N.UNPACK_SKIP_PIXELS),Gn=x.getParameter(N.UNPACK_SKIP_ROWS),Si=x.getParameter(N.UNPACK_SKIP_IMAGES);x.pixelStorei(N.UNPACK_ROW_LENGTH,gt.width),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,gt.height),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Pe),x.pixelStorei(N.UNPACK_SKIP_ROWS,Xe),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Ze);let gr=v.isDataArrayTexture||v.isData3DTexture,ht=O.isDataArrayTexture||O.isData3DTexture;if(v.isDepthTexture){let Et=Y.get(v),Mi=Y.get(O),pt=Y.get(Et.__renderTarget),bi=Y.get(Mi.__renderTarget);x.bindFramebuffer(N.READ_FRAMEBUFFER,pt.__webglFramebuffer),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,bi.__webglFramebuffer);for(let xr=0;xr<Te;xr++)gr&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Y.get(v).__webglTexture,X,Ze+xr),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Y.get(O).__webglTexture,ve,Tt+xr)),N.blitFramebuffer(Pe,Xe,be,_e,Ae,at,be,_e,N.DEPTH_BUFFER_BIT,N.NEAREST);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(X!==0||v.isRenderTargetTexture||Y.has(v)){let Et=Y.get(v),Mi=Y.get(O);x.bindFramebuffer(N.READ_FRAMEBUFFER,A),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,z);for(let pt=0;pt<Te;pt++)gr?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Et.__webglTexture,X,Ze+pt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Et.__webglTexture,X),ht?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Mi.__webglTexture,ve,Tt+pt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Mi.__webglTexture,ve),X!==0?N.blitFramebuffer(Pe,Xe,be,_e,Ae,at,be,_e,N.COLOR_BUFFER_BIT,N.NEAREST):ht?N.copyTexSubImage3D(Me,ve,Ae,at,Tt+pt,Pe,Xe,be,_e):N.copyTexSubImage2D(Me,ve,Ae,at,Pe,Xe,be,_e);x.bindFramebuffer(N.READ_FRAMEBUFFER,null),x.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else ht?v.isDataTexture||v.isData3DTexture?N.texSubImage3D(Me,ve,Ae,at,Tt,be,_e,Te,dt,Gt,gt.data):O.isCompressedArrayTexture?N.compressedTexSubImage3D(Me,ve,Ae,at,Tt,be,_e,Te,dt,gt.data):N.texSubImage3D(Me,ve,Ae,at,Tt,be,_e,Te,dt,Gt,gt):v.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ve,Ae,at,be,_e,dt,Gt,gt.data):v.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ve,Ae,at,gt.width,gt.height,dt,gt.data):N.texSubImage2D(N.TEXTURE_2D,ve,Ae,at,be,_e,dt,Gt,gt);x.pixelStorei(N.UNPACK_ROW_LENGTH,Jt),x.pixelStorei(N.UNPACK_IMAGE_HEIGHT,et),x.pixelStorei(N.UNPACK_SKIP_PIXELS,Sn),x.pixelStorei(N.UNPACK_SKIP_ROWS,Gn),x.pixelStorei(N.UNPACK_SKIP_IMAGES,Si),ve===0&&O.generateMipmaps&&N.generateMipmap(Me),x.unbindTexture()},this.initRenderTarget=function(v){Y.get(v).__webglFramebuffer===void 0&&Q.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Q.setTextureCube(v,0):v.isData3DTexture?Q.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Q.setTexture2DArray(v,0):Q.setTexture2D(v,0),x.unbindTexture()},this.resetState=function(){Z=0,K=0,se=null,x.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var id=new gn,il=new V,Qr=class extends Ns{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new Xt(e,3)),this.setAttribute("uv",new Xt(t,2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new Oi(t,6,1);return this.setAttribute("instanceStart",new Un(n,3,0)),this.setAttribute("instanceEnd",new Un(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new Oi(t,6,1);return this.setAttribute("instanceColorStart",new Un(n,3,0)),this.setAttribute("instanceColorEnd",new Un(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Cs(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gn);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),id.setFromBufferAttribute(t),this.boundingBox.union(id))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qn),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)il.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(il)),il.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(il));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}};he.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new We},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};en.line={uniforms:qs.merge([he.common,he.fog,he.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var es=class extends Qt{constructor(e){super({type:"LineMaterial",uniforms:qs.clone(en.line.uniforms),vertexShader:en.line.vertexShader,fragmentShader:en.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}};var kc=new Ke,rd=new V,sd=new V,Ft=new Ke,Ot=new Ke,Jn=new Ke,Gc=new V,Vc=new ke,Bt=new Us,ad=new V,rl=new gn,sl=new qn,Kn=new Ke,jn,sr;function od(i,e,t){return Kn.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),Kn.multiplyScalar(1/Kn.w),Kn.x=sr/t.width,Kn.y=sr/t.height,Kn.applyMatrix4(i.projectionMatrixInverse),Kn.multiplyScalar(1/Kn.w),Math.abs(Math.max(Kn.x,Kn.y))}function Yx(i,e){let t=i.matrixWorld,n=i.geometry,r=n.attributes.instanceStart,s=n.attributes.instanceEnd,a=Math.min(n.instanceCount,r.count);for(let o=0,l=a;o<l;o++){Bt.start.fromBufferAttribute(r,o),Bt.end.fromBufferAttribute(s,o),Bt.applyMatrix4(t);let c=new V,u=new V;jn.distanceSqToSegment(Bt.start,Bt.end,u,c),u.distanceTo(c)<sr*.5&&e.push({point:u,pointOnLine:c,distance:jn.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function $x(i,e,t){let n=e.projectionMatrix,s=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),d=-e.near;jn.at(1,Jn),Jn.w=1,Jn.applyMatrix4(e.matrixWorldInverse),Jn.applyMatrix4(n),Jn.multiplyScalar(1/Jn.w),Jn.x*=s.x/2,Jn.y*=s.y/2,Jn.z=0,Gc.copy(Jn),Vc.multiplyMatrices(e.matrixWorldInverse,a);for(let h=0,p=u;h<p;h++){if(Ft.fromBufferAttribute(l,h),Ot.fromBufferAttribute(c,h),Ft.w=1,Ot.w=1,Ft.applyMatrix4(Vc),Ot.applyMatrix4(Vc),Ft.z>d&&Ot.z>d)continue;if(Ft.z>d){let L=Ft.z-Ot.z,S=(Ft.z-d)/L;Ft.lerp(Ot,S)}else if(Ot.z>d){let L=Ot.z-Ft.z,S=(Ot.z-d)/L;Ot.lerp(Ft,S)}Ft.applyMatrix4(n),Ot.applyMatrix4(n),Ft.multiplyScalar(1/Ft.w),Ot.multiplyScalar(1/Ot.w),Ft.x*=s.x/2,Ft.y*=s.y/2,Ot.x*=s.x/2,Ot.y*=s.y/2,Bt.start.copy(Ft),Bt.start.z=0,Bt.end.copy(Ot),Bt.end.z=0;let M=Bt.closestPointToPointParameter(Gc,!0);Bt.at(M,ad);let g=yc.lerp(Ft.z,Ot.z,M),f=g>=-1&&g<=1,b=Gc.distanceTo(ad)<sr*.5;if(f&&b){Bt.start.fromBufferAttribute(l,h),Bt.end.fromBufferAttribute(c,h),Bt.start.applyMatrix4(a),Bt.end.applyMatrix4(a);let L=new V,S=new V;jn.distanceSqToSegment(Bt.start,Bt.end,S,L),t.push({point:S,pointOnLine:L,distance:jn.origin.distanceTo(S),object:i,face:null,faceIndex:h,uv:null,uv1:null})}}}var al=class extends It{constructor(e=new Qr,t=new es({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let a=0,o=0,l=t.count;a<l;a++,o+=2)rd.fromBufferAttribute(t,a),sd.fromBufferAttribute(n,a),r[o]=o===0?0:r[o-1],r[o+1]=r[o]+rd.distanceTo(sd);let s=new Oi(r,2,1);return e.setAttribute("instanceDistanceStart",new Un(s,1,0)),e.setAttribute("instanceDistanceEnd",new Un(s,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;if(r===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;jn=e.ray;let a=this.matrixWorld,o=this.geometry,l=this.material;sr=l.linewidth+s,o.boundingSphere===null&&o.computeBoundingSphere(),sl.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=sr*.5;else{let d=Math.max(r.near,sl.distanceToPoint(jn.origin));c=od(r,d,l.resolution)}if(sl.radius+=c,jn.intersectsSphere(sl)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),rl.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=sr*.5;else{let d=Math.max(r.near,rl.distanceToPoint(jn.origin));u=od(r,d,l.resolution)}rl.expandByScalar(u),jn.intersectsBox(rl)!==!1&&(n?Yx(this,t):$x(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(kc),this.material.uniforms.resolution.value.set(kc.z,kc.w))}};function ld(i,e){let t=!1,n="stopped",r=0,s=0,a=0,o=0,l=0,c=0,u=null,d=null,h=null,p=null,_=null,M=["movestart","dragstart","zoomstart","rotatestart","pitchstart"],g=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,f=()=>{r&&cancelAnimationFrame(r),r=0,s=0};function b(C){if(u!==C){if(u){for(let $ of M)u.off($,L);u.off("resize",S)}if(u=C,C){for(let $ of M)C.on($,L);C.on("resize",S)}}}function L(C){C.originalEvent&&(i().cancelPending?.(),m({freezePose:!0}))}function S(){t&&se()}function w(){let C=i(),$={bearing:C.bearing||0,tilt:C.tilt??90};if(!C.visible||C.orientationMode==="fixed"||!C.bounds)return $;if(t)return{bearing:a,tilt:C.orientationMode==="billboard"?55:$.tilt};let ne=C.map;if(!ne)return $;let ye=window.maplibregl.MercatorCoordinate.fromLngLat(C.anchor),ce=ye.meterInMercatorCoordinateUnits(),le=window.maplibregl.MercatorCoordinate.fromLngLat(ne.transform.getCameraLngLat(),ne.transform.getCameraAltitude()),G=[(le.x-ye.x)/ce,(ye.y-le.y)/ce,le.z/ce],k=$;for(let j=0;j<6;j++)k=window.GeoGlyphGroundTransform.facing(G,C.pose(k).localCenter,$.tilt,C.orientationMode);return k}function E(){let C=i(),$=C.map;b($),$&&!d&&(d={map:$,clamped:C.restoredElevatedView?!0:$.getCenterClampedToGround(),elevation:C.restoredElevatedView?0:$.getCenterElevation()})}function P(){let C=i().map;E(),C.setCenterClampedToGround(!1)}function m({freezePose:C=!1}={}){let $=i(),ne=$.map,ye=t,ce=C&&ye&&$.visible&&$.bounds?{...$.renderedAngles||w()}:null;t=!1,n="stopped",f(),h=null,p=null,ce&&$.freezePose?.(ce),ye&&(ne?.triggerRepaint(),e())}function y(){if(m(),d){let C=d;d=null,C.map.setCenterClampedToGround(C.clamped),C.map.jumpTo({elevation:C.elevation})}}function R(C,$,ne,ye){let ce=C.map,le=C.pose(ye),G=ce.transform,k=window.GeoGlyphGroundTransform.framingPadding(G.width,G.height),j=ce.getMinZoom(),ie=Math.max(j,Math.min(18,ce.getMaxZoom())),oe;if($){let N=C.pose({bearing:C.orientationMode==="fixed"&&C.bearing||0,tilt:C.orientationMode==="billboard"?55:C.tilt});if(oe=JSON.stringify([C.bounds,C.anchor,C.orientationMode,C.bearing,C.tilt,N.center,N.elevation,N.geographic.elements,N.object.elements,G.width,G.height,G.fov,G.tileSize,G.roll||0,j,ie]),_?.key===oe)return _.zoom}let Ee=C.bounds,je=[];for(let N of[Ee.minX,Ee.maxX])for(let $e of[Ee.minY,Ee.maxY])for(let Ne of[Ee.minZ,Ee.maxZ])je.push(new Ke(N,$e,Ne,1));let ze=[],Re=(N,$e)=>{let Ne=G.clone();Ne.setRenderWorldCopies(!0),window.GeoGlyphBasemapCoverage?.preserveCameraTarget(Ne),Ne.setCenter($e.center),Ne.setElevation($e.elevation),Ne.setPitch(55),Ne.setBearing(N);let T=new ke().multiplyMatrices($e.geographic,$e.object);ze.push({transform:Ne,center:$e.center,elevation:$e.elevation,points:je.map(x=>x.clone().applyMatrix4(T))})};if($)for(let N=0;N<360;N+=5)Re(N,C.pose({bearing:C.orientationMode==="fixed"?C.bearing||0:N,tilt:C.orientationMode==="billboard"?55:C.tilt}));else Re(ne,le);let nt=1-2*k.left/G.width,Ge=1-2*k.top/G.height,it=N=>{for(let $e of ze){$e.transform.setZoom(N),$e.transform.setCenter($e.center),$e.transform.setElevation($e.elevation);let Ne=$e.transform.getProjectionDataForCustomLayer().mainMatrix;for(let T of $e.points){let x=Ne[0]*T.x+Ne[4]*T.y+Ne[8]*T.z+Ne[12],H=Ne[1]*T.x+Ne[5]*T.y+Ne[9]*T.z+Ne[13],Y=Ne[3]*T.x+Ne[7]*T.y+Ne[11]*T.z+Ne[15];if(!(Y>0)||!Number.isFinite(x)||!Number.isFinite(H)||Math.abs(x)>nt*Y||Math.abs(H)>Ge*Y)return!1}}return!0},mt=$?Math.log2(1.02):0,bt=j,Qe=ie+mt;if(it(Qe))bt=Qe;else for(let N=0;N<24;N++){let $e=(bt+Qe)/2;it($e)?bt=$e:Qe=$e}let rt=Math.max(j,Math.min(ie,bt-mt));return $&&(_={key:oe,zoom:rt}),rt}function I(C={}){let $=i(),ye=$.map.getBearing(),ce=C.orbit?ye:($.bearing||0)+25,le=ye+((ce-ye+180)%360+360)%360-180,G=55,k=C.orbit?{bearing:$.orientationMode==="fixed"?$.bearing||0:a,tilt:$.orientationMode==="billboard"?G:$.tilt}:{bearing:$.orientationMode==="fixed"?$.bearing||0:le,tilt:$.orientationMode==="billboard"?G:$.tilt},j=$.pose(k),ie=R($,!!C.orbit,le,k);return{center:j.center,elevation:j.elevation,zoom:ie,pitch:G,bearing:le,duration:g()?0:650}}function F(C={}){let $=i();if(!$.visible)return!1;if(C.preserveOrbit&&t){$.map.stop(),P(),a=$.map.getBearing();let ne=I({...C,orbit:!0});return o=ne.zoom,p=null,A(ne),!0}return m(),$.map.stop(),P(),C.orbit&&(a=$.map.getBearing()),A(I(C)),!0}function D(){let C=i().map,$=C.getCenter();return{center:[$.lng,$.lat],elevation:C.getCenterElevation(),zoom:C.getZoom(),pitch:C.getPitch(),bearing:C.getBearing()}}function A(C){let $=i().map,ne=D();if(!C.duration){$.jumpTo(C),n=t?"orbiting":"stopped",z();return}h={from:ne,target:C,elapsed:0},n="framing",s=0,z()}function z(){(h||t&&n==="orbiting")&&!r&&!document.hidden&&!c&&(r=requestAnimationFrame(Z))}function Z(C){r=0;let $=i();if(!t&&!h||!$.visible){m();return}if(document.hidden||c){s=0;return}let ne=s?Math.max(0,Math.min(100,C-s)):0;if(s=C,h){let ce=h;ce.elapsed+=ne;let le=Math.min(1,ce.elapsed/ce.target.duration),G=le*le*(3-2*le),k=(ie,oe)=>ie+(oe-ie)*G,j={center:[k(ce.from.center[0],ce.target.center.lng),k(ce.from.center[1],ce.target.center.lat)]};for(let ie of["elevation","zoom","pitch","bearing"])j[ie]=k(ce.from[ie],ce.target[ie]);$.map.jumpTo(j,{geoglyphFraming:!0}),le===1&&(h=null,n=t?"orbiting":"stopped",s=0,e()),z();return}if(a=window.GeoGlyphGroundTransform.advanceOrbit(a,ne/1e3,$.period),p){p.elapsed+=ne;let ce=Math.min(1,p.elapsed/650),le=ce*ce*(3-2*ce);o=p.from+(p.to-p.from)*le,ce===1&&(p=null)}let ye=$.pose(w());$.map.jumpTo({center:ye.center,elevation:ye.elevation,zoom:o,pitch:55,bearing:a},{geoglyphOrbit:!0}),l++,z()}function K(C={}){let $=i();if(!$.visible)return!1;m(),$.map.stop(),P(),window.GeoGlyphMapEngine.cancelInitialFit(),a=$.map.getBearing(),t=!0,n="framing";let ne=I({orbit:!0,pitch:55});return o=C.framed?$.map.getZoom():ne.zoom,C.framed?(n="orbiting",h=null,z()):A(ne),e(),!0}function se(){if(!t)return;let C=I({orbit:!0,pitch:55});if(h){if(Math.abs(h.target.zoom-C.zoom)<=.001&&h.target.elevation===C.elevation&&h.target.center.lng===C.center.lng&&h.target.center.lat===C.center.lat)return;let ne=Math.max(1,h.target.duration-h.elapsed);h={from:D(),target:{...h.target,center:C.center,elevation:C.elevation,zoom:C.zoom,duration:ne},elapsed:0},o=C.zoom;return}o=i().map.getZoom(),(!p||Math.abs(p.to-C.zoom)>.001)&&(p=Math.abs(C.zoom-o)>.001?{from:o,to:C.zoom,elapsed:0}:null);let $=i().pose(w());i().map.jumpTo({center:$.center,elevation:$.elevation,zoom:o,pitch:55,bearing:a},{geoglyphOrbit:!0})}function U(){if(!t&&!h)return()=>{};c++,f();let C=!1;return()=>{C||(C=!0,c=Math.max(0,c-1),s=0,z())}}function q(){f(),document.hidden||z()}return document.addEventListener("visibilitychange",q),{getAngles:w,fit:F,start:K,stop:m,exit:y,enter:E,pause:U,retarget:se,isRunning:()=>t,stats:()=>({orbiting:t,phase:n,scheduled:!!r,paused:c>0,frames:l,bearing:a,angles:w()}),dispose(){y(),b(null),document.removeEventListener("visibilitychange",q)}}}function cd(i){let e=new Map,t=new Map,n=32*1024*1024,r=null,s=0,a=0,o=0,l=()=>[...e.values()].reduce((p,_)=>p+_.bytes,0);function c(p){for(let[_,M]of e){if(e.size<=3&&l()<=n)break;_===r||_===p||(M.geometry.dispose(),M.lineGeometry.dispose(),e.delete(_),o++)}}function u(p){let _=e.get(p);return _?(e.delete(p),e.set(p,_),a++,_):null}async function d(p){let _=p.renderKey,M=u(_);if(M)return M;if(t.has(_))return t.get(_);let g=s,f=(async()=>{let b=await i(_,p);if(g!==s)throw Error("Model preparation cancelled");let L=b.bytes+b.outline.byteLength+(p.vertices||0)*16;if(L>n)throw Error("Prepared model exceeds the 32 MiB budget; reduce curve quality or message length");let S=new ln;S.setAttribute("position",new Wt(b.position,3)),S.setAttribute("normal",new Wt(b.normal,3)),b.groups.forEach(P=>S.addGroup(P.start,P.count,P.materialIndex));let w=new Qr;w.setPositions(b.outline);let E={key:_,model:p,mesh:b,geometry:S,lineGeometry:w,bytes:L};if(r&&e.get(r)?.bytes+L>n)throw S.dispose(),w.dispose(),Error("Combined models exceed the 32 MiB budget; reduce curve quality or message length");return e.set(_,E),c(_),E})().finally(()=>{t.get(_)===f&&t.delete(_)});return t.set(_,f),f}function h(){s++;for(let p of e.values())p.geometry.dispose(),p.lineGeometry.dispose();e.clear(),t.clear(),r=null}return{get:u,prepare:d,activate(p){r=p.key,e.delete(p.key),e.set(p.key,p),c()},clear:h,stats:()=>({entries:e.size,bytes:l(),hits:a,evictions:o,pending:t.size})}}var ol={box:`<svg aria-hidden="true" focusable="false"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
  <path d="m3.3 7 8.7 5 8.7-5" />
  <path d="M12 22V12" />
</svg>
`,orbit:`<svg aria-hidden="true" focusable="false"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="3" />
  <circle cx="19" cy="5" r="2" />
  <circle cx="5" cy="19" r="2" />
  <path d="M10.4 21.9a10 10 0 0 0 9.941-15.416" />
  <path d="M13.5 2.1a10 10 0 0 0-9.841 15.416" />
</svg>
`,"rotate-3d":`<svg aria-hidden="true" focusable="false"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2" />
  <path d="m15.194 13.707 3.814 1.86-1.86 3.814" />
  <path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4" />
</svg>
`,"scan-eye":`<svg aria-hidden="true" focusable="false"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  <circle cx="12" cy="12" r="1" />
  <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
</svg>
`,shuffle:`<svg aria-hidden="true" focusable="false"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="m18 14 4 4-4 4" />
  <path d="m18 2 4 4-4 4" />
  <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
  <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
  <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
</svg>
`};var Zx=`precision highp float;
in vec3 position;
uniform mat4 uMatrix;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uProgress;
out vec3 vLocal;
void main() {
  vLocal = position;
  vec3 p = position + vec3(mix(uFrom, uTo, uProgress), 0.0);
  gl_Position = uMatrix * vec4(p, 1.0);
}`,Jx=`precision highp float;
precision highp int;
uniform sampler2D uFields;
uniform vec2 uTextureSize;
uniform vec4 uRect;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uProgress;
uniform mat4 uMatrix;
uniform mat4 uInverse;
uniform mat3 uNormal;
uniform vec2 uViewport;
uniform vec3 uFill;
uniform vec3 uFillLinear;
uniform vec3 uOutline;
uniform float uOutlineLocal;
uniform float uOpacity;
uniform float uPixel;
uniform bool uExtruded;
uniform bool uCoveragePass;
uniform bool uHardwareLinear;
in vec3 vLocal;
out vec4 outColor;

float field(vec2 p) {
  // Field rows follow the font's downward Y axis; model Y points upward.
  vec2 uv = vec2((p.x-uRect.x)/(uRect.z-uRect.x),
                 (uRect.w-p.y)/(uRect.w-uRect.y));
  if(uHardwareLinear){
    vec2 edge=0.5/uTextureSize;
    // The ray loop diverges between pixels; explicit LOD avoids relying on
    // implicit texture derivatives inside that loop (there are no mipmaps).
    vec2 values=textureLod(uFields,clamp(uv,edge,1.0-edge),0.0).rg;
    return mix(values.x,values.y,uProgress);
  }
  vec2 texel = clamp(uv*uTextureSize-0.5, vec2(0.0), uTextureSize-1.0);
  ivec2 lo = ivec2(floor(texel));
  ivec2 hi = min(lo+ivec2(1), ivec2(uTextureSize)-1);
  vec2 f = fract(texel);
  // Manual bilinear sampling works without OES_texture_float_linear.
  vec2 a = mix(texelFetch(uFields,lo,0).rg,
               texelFetch(uFields,ivec2(hi.x,lo.y),0).rg,f.x);
  vec2 b = mix(texelFetch(uFields,ivec2(lo.x,hi.y),0).rg,
               texelFetch(uFields,hi,0).rg,f.x);
  vec2 values = mix(a,b,f.y);
  return mix(values.x,values.y,uProgress);
}
vec2 rayBox(vec3 origin,vec3 direction) {
  vec3 directionSafe = mix(vec3(1e-9),direction,greaterThan(abs(direction),vec3(1e-9)));
  vec3 a = (vec3(uRect.xy,-0.5)-origin)/directionSafe;
  vec3 b = (vec3(uRect.zw, 0.5)-origin)/directionSafe;
  vec3 nearT = min(a,b),farT=max(a,b);
  return vec2(max(max(nearT.x,nearT.y),nearT.z),min(min(farT.x,farT.y),farT.z));
}
vec3 displayColour(vec3 linear){
  return mix(linear*12.92,1.055*pow(max(linear,vec3(0.0)),vec3(1.0/2.4))-0.055,greaterThan(linear,vec3(0.0031308)));
}
void main() {
  vec3 hit=vLocal;
  if(uExtruded) {
    vec2 ndc=gl_FragCoord.xy/uViewport*2.0-1.0;
    vec4 nearP=uInverse*vec4(ndc,-1.0,1.0);
    vec4 farP=uInverse*vec4(ndc,1.0,1.0);
    vec3 origin=nearP.xyz/nearP.w-vec3(mix(uFrom,uTo,uProgress),0.0);
    vec3 direction=normalize(farP.xyz/farP.w-nearP.xyz/nearP.w);
    vec2 range=rayBox(origin,direction);
    float travel=max(range.x,0.0);
    if(range.y<travel)discard;
    float xySpeed=length(direction.xy);
    bool found=false;
    for(int i=0;i<192;i++) {
      hit=origin+direction*travel;
      float distanceToSurface=field(hit.xy)-uOutlineLocal*0.5;
      if(distanceToSurface<uPixel*0.3){found=true;break;}
      // Within the slab, field distance depends only on XY. Divide by XY ray
      // speed so near-normal rays through holes do not take hundreds of tiny
      // steps through the extrusion depth. A perpendicular empty column exits
      // immediately; the first filled sample on a cap is already an exact hit.
      if(xySpeed<1e-8)break;
      travel+=max(distanceToSurface*0.7,uPixel*0.15)/xySpeed;
      if(travel>range.y+uPixel)break;
    }
    if(!found)discard;
  }
  float distanceToGlyph=field(hit.xy);
  float aa=max(fwidth(distanceToGlyph),uPixel*0.2);
  if(!uExtruded && distanceToGlyph>uOutlineLocal*0.5+aa)discard;
  if(uCoveragePass) {
    float outer=1.0-smoothstep(uOutlineLocal*0.5-aa,uOutlineLocal*0.5+aa,distanceToGlyph);
    float inner=1.0-smoothstep(-uOutlineLocal*0.5-aa,-uOutlineLocal*0.5+aa,distanceToGlyph);
    // MAX blending unions all glyphs before applying message opacity. Separate
    // inner/outer coverage prevents overlapping glyph outlines cutting into fill.
    outColor=vec4(inner,outer,0.0,1.0);return;
  }
  vec3 colour=uFill;
  if(uExtruded) {
    float cap=abs(hit.z);
    bool side=cap<0.5-uPixel*0.7;
    if(side) {
      float e=uPixel;
      vec3 normal=normalize(vec3(field(hit.xy+vec2(e,0.0))-field(hit.xy-vec2(e,0.0)),
                                  field(hit.xy+vec2(0.0,e))-field(hit.xy-vec2(0.0,e)),0.0));
      normal=normalize(uNormal*normal);
      // Match the ordinary renderer's MeshLambertMaterial: .62 diffuse,
      // ambient intensity 1.3 and directional intensity 2, in linear colour.
      float light=(1.3+2.0*max(dot(normal,normalize(vec3(-1.0,-2.0,4.0))),0.0))/3.141592653589793;
      colour=displayColour(uFillLinear*0.62*light);
    }
    if(uOutlineLocal>0.0) {
      float edge=side?(0.5-cap):abs(distanceToGlyph);
      colour=mix(uOutline,colour,smoothstep(uOutlineLocal*0.5-aa,uOutlineLocal*0.5+aa,edge));
    }
  } else if(uOutlineLocal>0.0) {
    colour=mix(uFill,uOutline,smoothstep(-uOutlineLocal*0.5-aa,-uOutlineLocal*0.5+aa,distanceToGlyph));
  }
  float coverage=uExtruded?1.0:1.0-smoothstep(uOutlineLocal*0.5-aa,uOutlineLocal*0.5+aa,distanceToGlyph);
  vec3 placed=hit+vec3(mix(uFrom,uTo,uProgress),0.0);
  vec4 clip=uMatrix*vec4(placed,1.0);
  // Write the actual implicit surface depth, never the proxy-box depth.
  gl_FragDepth=clamp(clip.z/clip.w*0.5+0.5,0.0,1.0);
  outColor=vec4(colour,uOpacity*coverage);
}`,Kx=`precision highp float;
in vec3 position;
out vec2 vUv;
void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,0.0,1.0);}`,jx=`precision highp float;
uniform sampler2D uCoverage;
uniform vec3 uFill;
uniform vec3 uOutline;
uniform float uOpacity;
uniform mat4 uMatrix;
uniform mat4 uInverse;
in vec2 vUv;
out vec4 outColor;
void main(){
  vec2 coverage=texture(uCoverage,vUv).rg;
  if(coverage.y<0.001)discard;
  vec2 ndc=vUv*2.0-1.0;
  vec4 nearP=uInverse*vec4(ndc,-1.0,1.0),farP=uInverse*vec4(ndc,1.0,1.0);
  vec3 origin=nearP.xyz/nearP.w,direction=farP.xyz/farP.w-origin;
  if(abs(direction.z)<1e-9)discard;
  vec3 hit=origin+direction*(-origin.z/direction.z);
  vec4 clip=uMatrix*vec4(hit,1.0);
  gl_FragDepth=clamp(clip.z/clip.w*0.5+0.5,0.0,1.0);
  outColor=vec4(mix(uOutline,uFill,clamp(coverage.x/coverage.y,0.0,1.0)),coverage.y*uOpacity);
}`;function Hc(i,e){return Number.isFinite(i)?i:e}function ar(){return Object.assign(new Error("Font morph preparation cancelled."),{code:"MORPH_CANCELLED"})}function Wc(i,e){return i.aborted?Promise.reject(ar()):new Promise((t,n)=>{let r=!1,s=(l,c)=>{r||(r=!0,clearTimeout(o),i.removeEventListener("abort",a),l(c))},a=()=>s(n,ar()),o=setTimeout(()=>s(n,Object.assign(new Error("Font morph GPU preparation timed out. Try a shorter message."),{code:"MORPH_TIMEOUT"})),3e4);i.addEventListener("abort",a,{once:!0}),Promise.resolve().then(()=>{if(i.aborted)throw ar();return e()}).then(l=>s(t,l),l=>s(n,l))})}function Qx(i){let e;return Wc(i,()=>new Promise(t=>{e=requestAnimationFrame(t)})).finally(()=>{e!==void 0&&cancelAnimationFrame(e)})}function ud(i){let e=i.fromBounds||i.bounds,t=i.bounds,n=Math.max(1e-6,Hc(e.height,e.maxY-e.minY)),r=Hc(e.cx,(e.minX+e.maxX)/2),s=Hc(e.cy,(e.minY+e.maxY)/2);return{height:n,cx:r,cy:s,bounds:{minX:(t.minX-r)/n,maxX:(t.maxX-r)/n,minY:-(t.maxY-s)/n,maxY:-(t.minY-s)/n,minZ:-.5,maxZ:.5}}}function hd({id:i="geoglyph-font-morph",map:e,getPose:t,getStyle:n=()=>({}),onError:r=()=>{},forceManualFiltering:s=!1}){let a=null,o=null,l=0,c=!0,u=!1,d=[],h=0,p=null,_=new Set,M=0,g=0,f=0,b=0,L=0,S="",w=0,E,P,m=!1,y=new ke,R=new ke,I=new ke,F=new Oe,D=new Ke,A=new Ke,z=new qe,Z=new qe,K=new qe;return{id:i,type:"custom",renderingMode:"3d",ready:!1,onAdd(U,q){if(typeof q.texStorage2D!="function")throw new Error("Font morphing requires WebGL 2.");m=!s&&!!q.getExtension("OES_texture_float_linear"),this.renderer=new Kr({canvas:e.getCanvas(),context:q,antialias:!1}),this.renderer.autoClear=!1,this.scene=new ci,this.camera=new ui,this.ready=!0,this.renderer.debug.onShaderError=(C,$,ne,ye)=>{throw new Error("Font morph shader could not compile: "+(C.getProgramInfoLog($)||C.getShaderInfoLog(ye)||C.getShaderInfoLog(ne)))},this.compositeScene=new ci,this.compositeGeometry=new Di(2,2),this.compositeMaterial=new er({glslVersion:Yr,vertexShader:Kx,fragmentShader:jx,uniforms:{uCoverage:{value:null},uFill:{value:z},uOutline:{value:K},uOpacity:{value:1},uMatrix:{value:y},uInverse:{value:R}},depthWrite:!1,depthTest:!0,transparent:!0,side:Yt}),this.compositeMaterial.forceSinglePass=!0,this.compositeMesh=new It(this.compositeGeometry,this.compositeMaterial),this.compositeMesh.frustumCulled=!1,this.compositeScene.add(this.compositeMesh),this.contextLost=()=>{c=!1,r(new Error("Graphics context lost. Prepare the font morph again after the map recovers."))},e.getCanvas().addEventListener("webglcontextlost",this.contextLost),a&&this.build()},setModel(U){if(u)throw new Error("Font morph layer has been disposed.");if(!U?.glyphs?.length||!U?.bounds)throw new Error("No outline glyphs were prepared for morphing.");++h,p?.abort();let q=ud(U),C=this.ready?this.buildResources(U,q):[];return this.release(),o=q,a=U,this.install(C),e.triggerRepaint(),this.getBounds()},build(){let U=this.buildResources(a,o);this.release(),this.install(U)},buildResources(U,q){let{height:C,cx:$,cy:ne}=q,ye=[],ce=new Map;try{for(let le of U.glyphs){let G=le.fromField||le.source,k=le.toField||le.target;if(!G||!k||G.length!==le.width*le.height||k.length!==G.length)throw new Error("Invalid morph distance field.");let j=ce.get(G);j||(j=new Map,ce.set(G,j));let ie=j.get(k),oe=0;if(!ie){let Qe=new Float32Array(G.length*2);for(let rt=0;rt<G.length;rt++)Qe[rt*2]=G[rt]/C,Qe[rt*2+1]=k[rt]/C;ie=new kr(Qe,le.width,le.height,$n,_n),ie.minFilter=m?Pt:Ct,ie.magFilter=ie.minFilter,ie.wrapS=mn,ie.wrapT=mn,ie.generateMipmaps=!1,ie.flipY=!1,ie.needsUpdate=!0,j.set(k,ie),oe=Qe.byteLength}let Ee=le.bounds||le.rect,je=le.from||le.originA,ze=le.to||le.originB,Re=[Ee[0]/C,-Ee[3]/C,Ee[2]/C,-Ee[1]/C],nt={uFields:{value:ie},uTextureSize:{value:new We(le.width,le.height)},uRect:{value:new Ke(...Re)},uFrom:{value:new We((je[0]-$)/C,-(je[1]-ne)/C)},uTo:{value:new We((ze[0]-$)/C,-(ze[1]-ne)/C)},uProgress:{value:l},uMatrix:{value:y},uInverse:{value:R},uViewport:{value:new We(1,1)},uNormal:{value:F},uFill:{value:z},uFillLinear:{value:Z},uOutline:{value:K},uOutlineLocal:{value:0},uOpacity:{value:1},uPixel:{value:Math.max((Re[2]-Re[0])/le.width,(Re[3]-Re[1])/le.height)},uExtruded:{value:!0},uCoveragePass:{value:!1},uHardwareLinear:{value:m}},Ge=new Li(Re[2]-Re[0],Re[3]-Re[1],1);Ge.translate((Re[0]+Re[2])/2,(Re[1]+Re[3])/2,0);let it=new Di(Re[2]-Re[0],Re[3]-Re[1]);it.translate((Re[0]+Re[2])/2,(Re[1]+Re[3])/2,0);let mt=new er({glslVersion:Yr,vertexShader:Zx,fragmentShader:Jx,uniforms:nt,side:Ut,transparent:!1,depthWrite:!0,depthTest:!0});mt.forceSinglePass=!0;let bt=new It(Ge,mt);bt.frustumCulled=!1,ye.push({texture:ie,material:mt,geometry:Ge,flatGeometry:it,mesh:bt,uniforms:nt,bytes:oe})}}catch(le){throw this.releaseResources(ye),le}return ye},install(U){d=U;for(let q of U)this.scene?.add(q.mesh),b+=q.bytes},async prepareModel(U,{isCurrent:q=()=>!0,signal:C}={}){if(!this.ready||u)throw new Error("Add the font morph layer to the map before preparing it.");if(!U?.glyphs?.length||!U?.bounds)throw new Error("No outline glyphs were prepared for morphing.");if(C?.aborted)throw ar();p?.abort();let $=new AbortController;p=$;let ne=()=>$.abort();C?.addEventListener("abort",ne,{once:!0});let ye=++h,ce,le=[],G=()=>ye===h&&!u&&q();try{ce=ud(U),le=this.buildResources(U,ce),_.add(le);let k=new Set;for(let ie of le)if(!k.has(ie.texture)){if(await Qx($.signal),!G())throw ar();this.renderer.resetState(),this.renderer.initTexture(ie.texture),this.renderer.resetState(),M++,k.add(ie.texture)}if(!G())throw ar();let j=new ci;for(let ie of le)j.add(ie.mesh);if(this.renderer.resetState(),await Wc($.signal,()=>this.renderer.compileAsync(j,this.camera)),this.renderer.resetState(),await Wc($.signal,()=>this.renderer.compileAsync(this.compositeScene,this.camera)),this.renderer.resetState(),!G())throw ar();return _.delete(le),this.release(),a=U,o=ce,this.install(le),e.triggerRepaint(),this.getBounds()}catch(k){throw _.delete(le),this.releaseResources(le),this.renderer?.resetState(),k}finally{C?.removeEventListener("abort",ne),p===$&&(p=null)}},setProgress(U){l=Math.max(0,Math.min(1,Number(U)||0));for(let q of d)q.uniforms.uProgress.value=l;f++,e.triggerRepaint()},setVisible(U){c=!!U,e.triggerRepaint()},getBounds(){return o?{...o.bounds}:null},ensureCoverageTarget(U,q){let C=Math.min(1,Math.sqrt(4194304/(U*q)),4096/U,4096/q),$=Math.max(1,Math.floor(U*C)),ne=Math.max(1,Math.floor(q*C));return this.coverageTarget?(this.coverageTarget.width!==$||this.coverageTarget.height!==ne)&&this.coverageTarget.setSize($,ne):this.coverageTarget=new qt($,ne,{depthBuffer:!1,stencilBuffer:!1}),w=$*ne*4,this.compositeMaterial.uniforms.uCoverage.value=this.coverageTarget.texture,this.coverageTarget},render(U,q){let C=n();if(!this.ready||!a||!c||C.visible===!1||u)return;let $=U.getParameter(U.FRAMEBUFFER_BINDING);try{let ne=t(this.getBounds());if(!ne)return;if(I.fromArray(q.defaultProjectionData?.mainMatrix||q),y.copy(I).multiply(ne.geographic).multiply(ne.object),Math.abs(y.determinant())<1e-30)throw new Error("Font morph transform is singular.");R.copy(y).invert(),F.getNormalMatrix(ne.object);let ye=e.getCanvas(),ce=U.drawingBufferWidth,le=U.drawingBufferHeight,G=C.extruded!==!1;E!==(C.fill||"#ffffff")&&(E=C.fill||"#ffffff",Z.set(E),z.copy(Z).convertLinearToSRGB()),P!==(C.outline||"#000000")&&(P=C.outline||"#000000",K.set(P).convertLinearToSRGB());let k=ce/Math.max(1,ye.clientWidth),j=0;if(C.outlineWidth>0){let ie=o.bounds,oe=(ie.minX+ie.maxX)/2,Ee=(ie.minY+ie.maxY)/2,je=0;D.set(oe,Ee,je,1).applyMatrix4(y),D.w<=1e-8&&G&&(je=.5,D.set(oe,Ee,je,1).applyMatrix4(y),D.w<=1e-8&&(je=-.5,D.set(oe,Ee,je,1).applyMatrix4(y))),D.multiplyScalar(1/D.w),A.set(oe+.01,Ee,je,1).applyMatrix4(y),A.multiplyScalar(1/A.w);let ze=Math.hypot((A.x-D.x)*ce/2,(A.y-D.y)*le/2)/.01,Re=Number.isFinite(ze)&&ze>0?ze:Math.max(1,le);j=Math.min(.025,C.outlineWidth*k/Math.max(1,Re))}for(let ie of d){let oe=ie.uniforms;oe.uExtruded.value=G,oe.uCoveragePass.value=!G,oe.uOutlineLocal.value=j,oe.uOpacity.value=G?1:Math.max(0,Math.min(1,C.opacity??1)),oe.uViewport.value.set(ce,le),ie.mesh.geometry=G?ie.geometry:ie.flatGeometry;let Ee=G?ne.object.determinant()<0?Yn:Ut:Yt,je=!G;(ie.material.side!==Ee||ie.material.transparent!==je)&&(ie.material.side=Ee,ie.material.transparent=je,ie.material.needsUpdate=!0),ie.material.depthWrite=G,ie.material.depthTest=G,ie.material.blending=G?bn:so,ie.material.blendEquation=ao,ie.material.blendSrc=Os,ie.material.blendDst=Os}if(this.renderer.resetState(),this.renderer.setViewport(0,0,ce,le),G)this.renderer.state.bindFramebuffer(U.FRAMEBUFFER,$),this.renderer.render(this.scene,this.camera);else{let ie=this.ensureCoverageTarget(ce,le);for(let oe of d)oe.uniforms.uViewport.value.set(ie.width,ie.height);this.renderer.setRenderTarget(ie),this.renderer.setClearColor(0,0),this.renderer.clear(!0,!1,!1),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.renderer.state.bindFramebuffer(U.FRAMEBUFFER,$),this.renderer.setViewport(0,0,ce,le),this.compositeMaterial.uniforms.uOpacity.value=Math.max(0,Math.min(1,C.opacity??1)),this.renderer.render(this.compositeScene,this.camera)}this.renderer.resetState(),U.bindFramebuffer(U.FRAMEBUFFER,$),g++}catch(ne){L++,S=ne.message,c=!1,this.renderer?.resetState(),U.bindFramebuffer(U.FRAMEBUFFER,$),r(ne)}},release(){this.releaseResources(d),d=[],b=0},releaseResources(U){let q=new Set;for(let C of U)C.mesh.removeFromParent(),q.add(C.texture),C.material.dispose(),C.geometry.dispose(),C.flatGeometry.dispose();for(let C of q)C.dispose(),C.image&&(C.image.data=null)},stats(){return{ready:this.ready,visible:c,progress:l,glyphs:d.length,uploads:M,renders:g,uniformUpdates:f,bytes:b+w,fieldBytes:b,coverageBytes:w,filtering:m?"hardware-linear":"manual-bilinear",failures:L,lastError:S}},onRemove(){++h,p?.abort(),p=null,this.ready=!1,this.release(),this.renderer?.dispose(),this.renderer=null;for(let U of _)this.releaseResources(U);_.clear(),this.coverageTarget?.dispose(),this.coverageTarget=null,w=0,this.compositeMaterial?.dispose(),this.compositeGeometry?.dispose(),e.getCanvas().removeEventListener("webglcontextlost",this.contextLost)},dispose(){u||(u=!0,c=!1,a=null,this.onRemove())}}}var lt=i=>document.getElementById(i),Gi=()=>window.GeoGlyphMapEngine,Rt=()=>Gi()?.state,zt=()=>window.GeoGlyphFontService,dd="geoglyph-font-morph",e_=["mapExportGeoJsonBtn","mapSaveJpgBtn","mapSavePngBtn","mapCollapsedJpgBtn","mapCollapsedPngBtn"],Js=new Map,fd=new WeakSet,Xc=!1,Ks=null,tn=null,pi=null,ts=null,En=0,ut=!1,Zt=!1,Vi=!1,St=0,cl="",$c="Choose two built-in outline fonts.",or="",ss="",Zc="",ul="",is=0,ns=0,qc=0,pd=0,Jc=null,vd=0,md=0,yd=i=>i*i*(3-2*i);function t_(i){let e=0,t=1;for(let n=0;n<24;n++){let r=(e+t)/2;yd(r)<i?e=r:t=r}return(e+t)/2}function rs(){let i=Rt();return JSON.stringify([i?.selectedFontId,i?.mode,i?.message,i?.tracking,i?.lineHeight])}function lr(i){return!!i&&i.source==="conference"&&/^conference:/.test(zt().keyFor(i))&&!i.hasColor&&!/emoji/i.test(i.name)}function ea(){let i=Rt();return!i?.previewActive||!i.mapReady?"Open the map preview before preparing a morph.":i.mode!=="message"&&!(i.mode==="arcgis"&&window.GeoGlyphScripts?.state().running)?"Choose Message mode to morph the same text between fonts.":i.extrusionEnabled&&!i.extrusionSolid?"Font morphing needs Solid model enabled in 3D. Transparent 3D is not supported yet.":lr(i.fontRecords.get(i.selectedFontId))?String(i.message||"").trim()?"":"Enter a message to morph.":"Choose a From font in the Font morph panel. Emoji fonts cannot be morphed."}async function ll(){return Ks||(Ks=(async()=>{let i=lt("geoglyph-conference-fonts");if(!i)throw Error("Built-in font pack is unavailable. Rebuild Geoglyph.");let e=JSON.parse(i.textContent);location.protocol==="file:"&&!e.every(r=>r.data)&&(window.GeoGlyphConferenceFontData||await new Promise((r,s)=>{let a=document.createElement("script");a.src=i.dataset.localFontPack,a.onload=()=>{a.remove(),r()},a.onerror=()=>{a.remove(),s(Error("Keep src/fonts beside index.html, or open the standalone GeoGlyph file."))},document.head.append(a)}),e=window.GeoGlyphConferenceFontData||e);let t=[];for(let r of e){let s=`conference:${r.key}`;if([...Rt().fontRecords.values()].some(o=>zt().keyFor(o)===s))continue;let a;if(r.data){let o=atob(r.data),l=new Uint8Array(o.length);for(let c=0;c<o.length;c++)l[c]=o.charCodeAt(c);a=l.buffer}else{let o=await fetch(r.file,{signal:AbortSignal.timeout(15e3)});if(!o.ok)throw Error(`Could not load built-in font ${r.name} (HTTP ${o.status}).`);a=await o.arrayBuffer()}t.push({id:`conference-${r.key.toLowerCase().replace(/\s/g,"-")}`,source:"conference",fontResourceKey:s,name:r.name,family:r.family,style:r.style,hasColor:!!r.emoji,arrayBuffer:a})}t.length&&(window.GeoGlyphStudio.registerFonts(t),Gi().refreshFonts());let n=[...Rt().fontRecords.values()].filter(lr);return n_(n),n})().catch(i=>{throw Ks=null,i}),Ks)}function n_(i=[...Rt().fontRecords.values()].filter(lr)){let e=lt("mapMorphTarget");if(!e)return;let t=e.value;e.replaceChildren(new Option("Choose target font\u2026",""),...i.map(r=>new Option(r.name,r.id))),i.some(r=>r.id===t)&&(e.value=t);let n=lt("mapMorphSource");n.replaceChildren(new Option("Choose source font\u2026",""),...i.map(r=>new Option(r.name,r.id))),n.options[0].disabled=!0,Hi()}function js(){let i=Rt(),e=i.fontRecords.get(i.selectedFontId);if(!lr(e))return"Choose a From font above. Emoji fonts cannot be morphed.";let t=lt("mapMorphTarget").value;return t?t===e.id?"Choose different From and To fonts.":ea():"Choose a different To font, then Play or drag Progress."}function un(i,e=""){$c=i,cl=e,Hi()}function Hi(){if(!Xc)return;let i=Rt(),e=i.fontRecords.get(ut?or:i.selectedFontId);lt("mapMorphSource").value=lr(e)?e.id:"";let t=js();lt("mapMorphStatus").textContent=!ut&&!Zt&&!cl?t||"Ready. Play to morph, or Prepare to enable scrubbing.":$c,lt("mapMorphStatus").dataset.state=cl?"error":Zt?"preparing":"ready",lt("mapMorphPanel").setAttribute("aria-busy",String(Zt)),lt("mapMorphPrepare").disabled=!!t||Zt,lt("mapMorphPlay").disabled=!ut&&!!t||Zt,lt("mapMorphPlay").textContent=Vi?"Pause":St>=1?"Replay":"Play",lt("mapMorphPlay").setAttribute("aria-pressed",String(Vi)),lt("mapMorphClear").disabled=!ut&&!Zt,lt("mapMorphProgress").disabled=!ut,lt("mapMorphProgress").value=String(St),lt("mapMorphValue").textContent=Math.round(St*100)+"%",lt("mapMorphProgress").setAttribute("aria-valuetext",Math.round(St*100)+" percent");let n=ut&&St>0&&St<1;for(let r of e_){let s=lt(r);if(s){if(n)Js.has(r)||Js.set(r,{disabled:s.disabled,title:s.title}),s.disabled=!0,s.title="Move the morph slider to an endpoint before exporting.";else if(Js.has(r)){let a=Js.get(r);s.disabled=a.disabled,s.title=a.title,Js.delete(r)}}}window.GeoGlyph3D?.refreshExportControls?.()}function i_(){is&&cancelAnimationFrame(is),is=0,ns=0}function di(){return Vi=!1,i_(),Hi(),St}function Sd(){zt().unpin("morph-from"),zt().unpin("morph-to")}function r_(){if(tn){let i=Rt()?.map;try{i?.getLayer(tn.id)?i.removeLayer(tn.id):tn.dispose()}catch{tn.dispose()}}tn=null}function fi({message:i="Morph cleared. The source font is displayed.",restore:e=!0}={}){return++En,ts?.abort(),ts=null,di(),ut=Zt=!1,pi=null,Zc=ul="",Jc=null,St=0,or=ss="",r_(),Sd(),e&&(window.GeoGlyph3D?.syncVisibility(),window.GeoGlyph3D?.refreshControls(),Rt()?.extrusionEnabled&&Rt()?.previewActive&&!window.GeoGlyph3D?.isVisible()&&window.GeoGlyph3D?.update()),un(i),!0}function Yc(){let i=Rt();if(ut&&i?.extrusionEnabled&&!i.extrusionSolid){fi({message:"Morph stopped: enable Solid model before morphing in 3D."});return}tn?.setVisible(ut&&!!i?.previewActive),i?.map?.triggerRepaint()}function s_(i){let e=i?.message||String(i);fi({message:"Font morph unavailable: "+e}),un($c,e)}async function Qs(i=lt("mapMorphTarget")?.value){let e=++En;ts?.abort(),ts=new AbortController;let t=ts.signal;di(),Zt=!0,ul=rs(),md=performance.now(),un("Preparing font shapes\u2026");let n=null,r=null,s=`morph-request-${e}-from`,a=`morph-request-${e}-to`;try{if(await ll(),e!==En)return!1;let o=ea();if(o)throw Error(o);let l=Rt(),c=l.fontRecords.get(l.selectedFontId),u=l.fontRecords.get(i);if(fd.has(l.map)||(fd.add(l.map),l.map.getCanvas().addEventListener("webglcontextlost",()=>fi({message:"Graphics context lost. Prepare the morph again after the map recovers.",restore:!1})),l.map.on("remove",()=>fi({message:"Map closed.",restore:!1}))),!lr(u))throw Error("Choose a built-in outline font as the target.");if(zt().keyFor(c)===zt().keyFor(u))throw Error("Choose a different target font.");let d=rs(),h=()=>e===En&&!t.aborted&&d===rs();zt().pin(c,s),zt().pin(u,a);let p=await zt().morph(c,u,l.message,{tracking:l.tracking,lineHeight:l.lineHeight,signal:t});if(!h())return!1;let _=performance.now()+1e4;for(;!ut&&(l.rebuilding||l.pendingBuild);){if(!h())return!1;if(performance.now()>_)throw Error("The source font is still preparing. Retry the morph in a moment.");await new Promise((S,w)=>{let P=setTimeout(()=>{t.removeEventListener("abort",m),S()},16),m=()=>{clearTimeout(P),w(t.reason)};t.addEventListener("abort",m,{once:!0})})}if(!h())return!1;if(!ut&&l.displayedFontId!==c.id)throw Error("The selected source font could not be displayed. Choose a built-in outline font and retry.");let M=ut?`${dd}-pending-${e}`:dd,g,f=null,b={geographic:new ke,object:new ke};if(n=g=hd({id:M,map:l.map,getPose:()=>{let S=window.GeoGlyph3D.morphPose(g.getBounds(),{flat:!l.extrusionEnabled,output:b});return Jc=S.angles,S},getStyle:()=>({extruded:l.extrusionEnabled,fill:l.fill,outline:l.outline,outlineWidth:l.outlineWidth,opacity:l.extrusionEnabled?1:l.opacity,visible:l.previewActive}),onError:S=>{tn===g?s_(S):f=S}}),r=l.map,n.setVisible(!1),r.addLayer(n),await n.prepareModel(p,{isCurrent:h,signal:t}),f)throw f;if(!h())return!1;let L=tn;return++l.buildToken,l.pendingBuild=l.pendingFit=l.explicitFitPending=!1,Gi().cancelInitialFit(),tn=n,n=null,pi=p,or=c.id,ss=u.id,Zc=d,ut=!0,St=0,zt().pin(c,"morph-from"),zt().pin(u,"morph-to"),L&&(l.map.getLayer(L.id)?l.map.removeLayer(L.id):L.dispose()),tn.setProgress(0),tn.setVisible(!0),vd=performance.now()-md,lt("mapMorphTarget").value=i,window.GeoGlyph3D.syncVisibility(),window.GeoGlyph3D.refreshControls(),un(`${c.name} \u2192 ${u.name}. Ready to play or scrub.`),!0}catch(o){return e!==En||t.aborted||(un("Could not prepare morph: "+o.message,o.message),ut||Sd()),!1}finally{if(zt().unpin(s),zt().unpin(a),n)try{r?.getLayer(n.id)?r.removeLayer(n.id):n.dispose()}catch{n.dispose()}e===En&&(Zt=!1,ul="",ts=null,Hi())}}function Kc(i){St=Math.max(0,Math.min(1,Number(i)||0)),tn?.setProgress(St)}function gd(i){return di(),ut?(Kc(i),un(`${Math.round(St*100)}% \xB7 drag to reshape the message.`),!0):!1}function Md(i){if(is=0,!Vi||!ut||document.hidden)return;let e=Math.max(.25,Math.min(30,Number(lt("mapMorphDuration").value)||2))*1e3;ns&&(qc+=Math.max(0,i-ns)),ns=i,Kc(yd(Math.min(1,qc/e))),(i-pd>=100||St===1)&&(pd=i,Hi()),St>=1?(Vi=!1,ns=0,un("Target font reached. Replay or scrub the transition.")):is=requestAnimationFrame(Md)}async function xd(){if(Vi)return di(),!0;if(Zt)return!1;if(!ut){let e=En+1;if(!await Qs()||En!==e||!ut)return!1}if(ea())return un(ea(),ea()),!1;St>=1&&Kc(0);let i=Math.max(.25,Math.min(30,Number(lt("mapMorphDuration").value)||2))*1e3;return qc=t_(St)*i,Vi=!0,ns=0,un("Morphing font shapes\u2026"),is=requestAnimationFrame(Md),!0}function _d(){let i=Zt?ul:Zc;(ut||Zt)&&i&&rs()!==i?fi({message:"Message or font changed. Prepare a new morph."}):Hi()}function a_(i){if(!ut)return!1;di();let e=Rt();return i&&!e.extrusionSolid?(un("Enable Solid model to morph in 3D.","Transparent 3D morphing is not supported yet."),!1):(e.extrusionEnabled=i,i&&e.extrusionDepthMeters==null&&(e.extrusionDepthMeters=Math.max(.1,e.baseHeightMeters*e.relativeSize/1e3)),Gi().refreshControls(),window.GeoGlyph3D.morphModeChanged(i),Yc(),!0)}function jc(){return!ut||St===0||St===1}function o_(){if(!ut)return[];let i=Rt(),e=pi.bounds,t=i.baseHeightMeters*i.relativeSize/100,n=[[e.minX,e.minY],[e.maxX,e.minY],[e.maxX,e.maxY],[e.minX,e.maxY],[e.minX,e.minY]];return Gi().geometry.projectPolygons([[n]],pi.fromBounds,t/pi.fromBounds.height,i.bearing,i.anchor)[0][0]}async function l_(){if(!ut||!jc())return null;let i=Rt(),e=St,t=i.fontRecords.get(e===1?ss:or),n=En,r=await zt().model(t,i.message,{tracking:i.tracking,lineHeight:i.lineHeight});if(n!==En||!ut||St!==e)return null;let s=i.baseHeightMeters*i.relativeSize/100,a=Gi().geometry.projectPolygons(r.polygons,pi.fromBounds,s/pi.fromBounds.height,i.bearing,i.anchor);return{type:"FeatureCollection",features:[{type:"Feature",properties:{mode:i.mode,message:i.message,font:t.name,renderer:"font-morph-endpoint",fill:i.fill,outline:i.outline,height_m:s*r.bounds.height/pi.fromBounds.height,bearing:i.bearing},geometry:{type:"MultiPolygon",coordinates:a}}]}}async function c_(){if(!ut||Zt||!jc())throw Error("Move the morph slider to an endpoint before exporting.");let i=Rt(),e=St,t=En,n=rs(),r=i.fontRecords.get(e===1?ss:or),s={...pi.fromBounds},a=i.message,o={tracking:i.tracking,lineHeight:i.lineHeight,tolerance:.4},l=()=>ut&&!Zt&&t===En&&St===e&&rs()===n,c=await zt().model(r,a,o);if(!l())throw Error("The morph changed before export. Choose an endpoint and retry.");let u=await zt().mesh(JSON.stringify([zt().keyFor(r),a,o]),c);if(!l())throw Error("The morph changed before export. Choose an endpoint and retry.");return{mesh:u,model:c,referenceBounds:s,name:r.name,isCurrent:l}}function bd(){if(Xc||!lt("mapFontSelect")||!window.GeoGlyph3D)return;let i=document.createElement("section");i.id="mapMorphPanel",i.className="map-morph-panel map-span-2",i.setAttribute("aria-label","Font morph"),i.innerHTML=`<label class="map-field"><span>From font</span><select id="mapMorphSource" aria-describedby="mapMorphStatus"><option value="">Choose source font\u2026</option></select></label>
    <label class="map-field"><span>To font</span><select id="mapMorphTarget"><option value="">Choose target font\u2026</option></select></label>
    <div class="map-morph-actions"><label class="map-field"><span>Duration</span><div class="map-number"><input id="mapMorphDuration" type="number" min="0.25" max="30" step="0.25" value="2"><em>s</em></div></label>
    <div class="map-morph-buttons" role="group" aria-label="Morph playback"><button class="map-action" id="mapMorphPrepare" type="button" disabled>Prepare</button><button class="map-action" id="mapMorphPlay" type="button" aria-pressed="false" disabled>Play</button></div></div>
    <label class="map-field"><span>Progress <output id="mapMorphValue" for="mapMorphProgress">0%</output></span><input id="mapMorphProgress" type="range" min="0" max="1" step="0.001" value="0" disabled></label>
    <div class="map-morph-footer"><p id="mapMorphStatus" class="map-3d-status" role="status">Choose two built-in outline fonts.</p><button class="map-action" id="mapMorphClear" type="button" disabled>Clear</button></div>`,document.querySelector(".map-3d-panel").after(i),Xc=!0,window.GeoGlyphFontMorph=Object.freeze({ensureBuiltins:ll,prepare:Qs,play:xd,pause:di,seek:gd,clear:fi,onGeometryChange:_d,setMode:a_,syncVisibility:Yc,canExport:jc,exportGeoJSON:l_,prepareOBJEndpoint:c_,framingCoordinates:o_,isActive:()=>ut,getBounds:()=>tn?.getBounds(),renderedAngles:()=>Jc,label:()=>`${Rt().fontRecords.get(or)?.name||"Source"} \u2192 ${Rt().fontRecords.get(ss)?.name||"Target"}`,stats:()=>({ready:ut,preparing:Zt,playing:Vi,progress:St,error:cl,fromId:or,toId:ss,lastPreparationMs:vd,renderer:tn?.stats()||null})}),lt("mapMorphPrepare").addEventListener("click",()=>Qs()),lt("mapMorphSource").addEventListener("change",async e=>{let t=e.target.value;lr(Rt().fontRecords.get(t))&&(di(),await Gi().selectFont(t),Gi().refreshControls(),Rt().selectedFontId===t&&(un("Source font selected. Choose a different To font."),js()||Qs()))}),lt("mapMorphTarget").addEventListener("change",()=>{js()?ut||Zt?fi({message:js()}):un(js()):Qs()}),lt("mapMorphPlay").addEventListener("click",()=>xd()),lt("mapMorphProgress").addEventListener("input",e=>gd(e.target.value)),lt("mapMorphDuration").addEventListener("input",()=>di()),lt("mapMorphClear").addEventListener("click",()=>fi()),document.addEventListener("geoglyph:ground-rendered",()=>{_d(),Hi()}),document.addEventListener("geoglyph:ground-style",Yc),document.addEventListener("visibilitychange",()=>{document.hidden&&di()}),window.addEventListener("pagehide",()=>fi({restore:!1})),i.addEventListener("focusin",()=>ll().catch(e=>un(e.message,e.message)),{once:!0}),i.addEventListener("pointerenter",()=>ll().catch(e=>un(e.message,e.message)),{once:!0}),Hi()}async function wd(i,e,{name:t="GeoGlyph",isCurrent:n=()=>!0,yieldControl:r=()=>new Promise(s=>setTimeout(s,0))}={}){let{position:s,normal:a}=i||{};if(!s?.length||s.length%9||a?.length!==s.length)throw Error("No valid triangle mesh to export");if(!e?.elements?.every(Number.isFinite)||!Number.isFinite(e.determinant())||e.determinant()===0)throw Error("Invalid OBJ transform");let o=e.clone(),l=new Oe().getNormalMatrix(o),c=o.determinant()<0,u=new V,d=new V,p=[`# GeoGlyph OBJ
# Units: metres. X east, Y north, Z up. Origin: map anchor at ground level.
o ${String(t).replace(/[^\p{L}\p{N}_-]+/gu,"_").slice(0,100)||"GeoGlyph"}
`],_=M=>{if(!Number.isFinite(M))throw Error("Mesh contains a non-finite coordinate or normal");return String(Number(M.toFixed(6)))};for(let M=0;M<s.length;M+=9*256){if(!n())throw Error("The object changed before export. Retry with the desired object.");let g=[],f=Math.min(s.length,M+9*256);for(let b=M;b<f;b+=9){for(let E=0;E<3;E++){let P=b+E*3;if(![a[P],a[P+1],a[P+2]].every(Number.isFinite)||(u.fromArray(s,P).applyMatrix4(o),d.fromArray(a,P).applyMatrix3(l),!d.lengthSq()))throw Error("Mesh contains an invalid normal");d.normalize(),g.push(`v ${_(u.x)} ${_(u.y)} ${_(u.z)}
`,`vn ${_(d.x)} ${_(d.y)} ${_(d.z)}
`)}let L=b/3+1,S=L+(c?2:1),w=L+(c?1:2);g.push(`f ${L}//${L} ${S}//${S} ${w}//${w}
`)}p.push(g.join("")),await r()}if(!n())throw Error("The object changed before export. Retry with the desired object.");return new Blob(p,{type:"text/plain;charset=utf-8"})}var Qc={version:1,title:"Conference introduction",rows:[{id:"opening",message:"",duration:2,actions:[{type:"camera",value:"opening"},{type:"title",value:"Conference day."}]},{id:"title-2",message:"",duration:2,actions:[{type:"title",value:"Conference day.."}]},{id:"title-3",message:"",duration:2,actions:[{type:"title",value:"Conference day..."}]},{id:"title-4",message:"",duration:2,actions:[{type:"title",value:"Conference day...."}]},{id:"title-5",message:"",duration:2,actions:[{type:"title",value:"Conference day....."}]},{id:"flight",message:"",duration:0,actions:[{type:"title",value:""},{type:"camera",value:"fly-opening"}]},{id:"yawn",message:"\u{1F971}",duration:5,actions:[{type:"font",value:{name:"Segoe UI Emoji",resourceKey:"conference:Segoe UI Emoji"}},{type:"mode",value:"2d"},{type:"size",value:{height:300,depth:30}},{type:"mirror",value:!1}]},{id:"neutral",message:"\u{1F636}",duration:3,actions:[]},{id:"smirk",message:"\u{1F60F}",duration:3,actions:[]},{id:"smirk-mirror",message:"\u{1F60F}",duration:3,actions:[{type:"mirror",value:!0}]},{id:"sunglasses",message:"\u{1F60E}",duration:5,actions:[{type:"mirror",value:!1}]},{id:"hello",message:"Hello",duration:5,actions:[{type:"font",value:{name:"Gill Sans",resourceKey:"conference:Gill Sans"}},{type:"colour",value:{fill:"#F47D22"}},{type:"mode",value:"2d"}]},{id:"geoglyph",message:"I'm Geoglyph",duration:5,actions:[]},{id:"geo",message:"Call me Geo",duration:5,actions:[]},{id:"everything",message:"Everything you about to see",duration:5,actions:[]},{id:"chatgpt",message:"was made by ChatGPT",duration:5,actions:[]},{id:"including",message:"including me!",duration:5,actions:[]},{id:"today",message:"Today I will be presenting",duration:5,actions:[]},{id:"friend",message:"with my best friend",duration:5,actions:[]},{id:"josh",message:"Josh Roberts",duration:5,actions:[]},{id:"where",message:"Where are you Josh?",duration:0,actions:[{type:"mode",value:"3d"},{type:"size",value:{height:3e3,depth:300}},{type:"animation",value:"yaw"}]}]};var EM=Su(Ed()),cr=Object.freeze({mode:["2D / 3D","box"],font:["Font","type"],colour:["Colour","palette"],animation:["Animation","orbit"],size:["Size","maximize"],depth:["Depth","layers"],tilt:["Tilt","rotate-3d"],bearing:["Bearing","compass"],mirror:["Mirror","flip"],fit:["Fit","maximize"],morph:["Font morph","blend"],title:["Title overlay","heading"],wait:["Wait","clock"],camera:["Camera flight","camera"]}),Xi=i=>i&&typeof i=="object"&&!Array.isArray(i),wt=i=>{throw Error(i)},ta=(i,e,t=1e5)=>typeof i=="string"&&i.length<=t?i:wt(e+" must be text"),Wi=(i,e,t,n)=>typeof i=="number"&&Number.isFinite(i)&&i>=t&&i<=n?i:wt(e+` must be between ${t} and ${n}`);function eu(i){Xi(i)||wt("Choose a font");let e={};for(let t of["name","family","style","postscriptName","resourceKey"])i[t]!==void 0&&(e[t]=ta(i[t],"Font "+t,300));return!e.name&&!e.resourceKey&&wt("Choose a font"),e}function as(i){(!Xi(i)||!Object.hasOwn(cr,i.type))&&wt("Unknown script action");let{type:e,value:t}=i,n;switch(e){case"mode":n=["2d","3d"].includes(t)?t:wt("Choose 2D or 3D");break;case"font":n=eu(t);break;case"colour":Xi(t)||wt("Choose a colour"),n={};for(let r of["fill","outline"])t[r]!==void 0&&(n[r]=/^#[\da-f]{6}$/i.test(t[r])?t[r].toUpperCase():wt("Enter a six-digit hex colour"));Object.keys(n).length||wt("Choose fill or outline colour");break;case"animation":n=["none","fixed","yaw","billboard"].includes(t)?t:wt("Choose an animation");break;case"size":Xi(t)||wt("Choose a size"),n={height:Wi(t.height,"Height",1,3e5)},t.depth!==void 0&&(n.depth=Wi(t.depth,"Depth",.1,1e5));break;case"depth":n=Wi(t,"Depth",.1,1e5);break;case"tilt":n=Wi(t,"Tilt",0,90);break;case"bearing":n=Wi(t,"Bearing",-360,360);break;case"mirror":case"fit":n=typeof t=="boolean"?t:wt("Choose on or off");break;case"wait":n=Wi(t,"Wait",0,3600);break;case"title":n=ta(t,"Title",2e3);break;case"camera":n=Xi(t)?globalThis.GeoGlyphCameraFlight.validateFlight(t):["opening","fly-opening","overview"].includes(t)?t:wt("Choose a camera action");break;case"morph":Xi(t)||wt("Choose morph fonts"),n={from:eu(t.from),to:eu(t.to),duration:Wi(t.duration,"Morph duration",.25,30)};break}return{type:e,value:n}}function mi(i){(!Xi(i)||i.version!==1||!Array.isArray(i.rows))&&wt("Expected a version 1 Geoglyph script with rows"),i.rows.length>1e4&&wt("Script is too large");let e=new Set,t=0,n=i.rows.map((r,s)=>{try{Xi(r)||wt("Invalid row");let a=ta(r.id,"Row ID",100);(!a||e.has(a))&&wt("Row IDs must be unique"),e.add(a);let o=ta(r.message??"","Message");t+=o.length;let l=Wi(r.duration??5,"Duration",0,3600);(!Array.isArray(r.actions)||r.actions.length>4)&&wt("A row supports at most four actions");let c=r.actions.map(as);return new Set(c.map(d=>d.type)).size!==c.length&&wt("Only one action per category is allowed"),c.some(d=>d.type==="mode"&&d.value==="2d")&&c.some(d=>d.type==="animation"&&d.value!=="none")&&wt("Orbit, Turn and Face require 3D"),{id:a,message:o,duration:l,actions:c}}catch(a){throw Error(`Row ${s+1}: ${a.message}`)}});return t>2e6&&wt("Script text is too large"),{version:1,title:ta(i.title??"Untitled script","Script title",300),rows:n}}var tu=()=>({id:globalThis.crypto?.randomUUID?.()||"row-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2),message:"",duration:5,actions:[]});function Td(i){return{name:i.name||"",family:i.family||"",style:i.style||"",postscriptName:i.postscriptName||"",resourceKey:i.fontResourceKey||""}}function Ad({applyRow:i,changed:e=()=>{},stopped:t=()=>{},now:n=()=>performance.now(),visible:r=()=>!document.hidden,timer:s=setTimeout,cancelTimer:a=clearTimeout}){let o=null,l=0,c=null,u={running:!1,paused:!1,phase:"idle",index:0,rowId:null,error:"",owner:null},d=()=>e({...u});function h({freeze:M=!0}={}){let g=o;o=null,++l,g?.abort(),c?.(),g&&M&&t(),Object.assign(u,{running:!1,paused:!1,phase:"stopped",owner:null}),d()}async function p(M,g,f){let b=M,L=n(),S=!u.paused&&r();await new Promise((w,E)=>{let P,m=I=>{a(P),f.removeEventListener("abort",y),c=null,I?E(I):w()},y=()=>m(new DOMException("Script stopped","AbortError")),R=()=>{a(P);let I=n();if(S&&(b-=Math.max(0,I-L)),L=I,S=!u.paused&&r(),!g())return y();if(u.skip)return u.skip=!1,m();if(!u.paused&&r()&&b<=0)return m();P=s(R,Math.max(1,Math.min(50,b>0?b:50)))};c=R,f.addEventListener("abort",y,{once:!0}),R()})}async function _(M,g=0,{owner:f="manual",isCurrent:b=()=>!0,onRow:L=()=>{},onRowStart:S=()=>{},singleStep:w=!1}={}){let E=mi(M);if(!E.rows.length)throw Error("Add a script row first");if(!Number.isInteger(g)||g<0||g>=E.rows.length)throw Error("Choose a script row");h({freeze:!1});let P=++l,m=new AbortController;o=m;let y=()=>o===m&&l===P&&!m.signal.aborted&&b();Object.assign(u,{running:!0,paused:!1,phase:"preparing",index:g,error:"",owner:f,skip:!1}),d();try{for(let R=g;R<E.rows.length;R++){let I=E.rows[R];if(Object.assign(u,{index:R,rowId:I.id,phase:"preparing"}),d(),!y())throw new DOMException("Script stopped","AbortError");if(await S(I,R),await i(I,{signal:m.signal,isCurrent:y,owner:f}),!y())throw new DOMException("Script stopped","AbortError");await L(I,R),u.phase="waiting",w&&(u.paused=!0),d();let F=I.actions.find(D=>D.type==="wait")?.value??0;await p((I.duration+F)*1e3,y,m.signal)}return y()?(o=null,Object.assign(u,{running:!1,paused:!1,phase:"complete",owner:null}),d(),!0):!1}catch(R){if(o!==m)return!1;if(o=null,R.name!=="AbortError"?(t(),Object.assign(u,{phase:"error",error:`Row ${u.index+1}: ${R.message}`})):u.phase="stopped",Object.assign(u,{running:!1,paused:!1,owner:null}),d(),R.name!=="AbortError")throw Error(u.error);return!1}}return{play:_,stop:h,state:()=>({...u}),clearError(){o||(u.error="",u.phase="idle")},pause(){o&&(u.paused=!0,c?.(),d())},resume(){o&&(u.paused=!1,c?.(),d())},next(){o&&(u.skip=!0,c?.(),d())},wake:()=>c?.()}}var DM=Su(Cd()),Pd="geoglyph-locate2026.script-draft-v1",dr=()=>window.GeoGlyphMapEngine,gi=()=>window.GeoGlyphFontMorph,_i=mi(Qc),os=0,fl="",xi=null,hr=!1,ls=!1,pl=!1,Rd=!1,Id=i=>JSON.parse(JSON.stringify(i)),ml=()=>document.dispatchEvent(new CustomEvent("geoglyph:script-changed"));function h_(){try{localStorage.setItem(Pd,JSON.stringify(_i)),fl=""}catch{fl="Draft is available for this session. Save JSON to keep it."}}function Ld(){xi?.remove(),xi=null}function Dd(){Ld(),dr()?.cancelScriptWork?.(),hr&&window.GeoGlyph3D?.stopOrbit({freezePose:!0}),pl?gi()?.clear({restore:!1}):ls&&gi()?.pause(),hr=ls=pl=!1}function ur(i){let e=[...dr().state.fontRecords.values()],n=i.resourceKey&&e.find(r=>window.GeoGlyphFontService.keyFor(r)===i.resourceKey)||e.find(r=>i.postscriptName&&r.postscriptName===i.postscriptName)||e.find(r=>(i.name&&(r.name===i.name||r.family===i.name)||i.family&&r.family===i.family)&&(!i.style||r.style===i.style));if(!n)throw Error(`Font unavailable: ${i.name||i.resourceKey}. Load that font and retry.`);return n}function Tn(i){if(!i())throw new DOMException("Script stopped","AbortError")}function d_(i){if(Ld(),!i)return;xi=document.createElement("div"),xi.id="geoglyphConferenceTitle",xi.className="geoglyph-conference-title",xi.setAttribute("role","status"),xi.textContent=i;let e=[...dr().state.fontRecords.values()].find(t=>t.fontResourceKey==="conference:Gill Sans");e&&(xi.style.fontFamily=JSON.stringify(e.cssFamily)),document.getElementById("geoglyphMapWorkspace").append(xi)}async function f_(i,{isCurrent:e,signal:t,owner:n}){await gi().ensureBuiltins(),Tn(e);let r=dr(),s=r.state,a=Object.fromEntries(i.actions.map(M=>[M.type,M.value]));if(Tn(e),!s.previewActive||!s.mapReady)throw Error("Open the map and wait until it is ready");let o=!!i.message||i.actions.some(M=>!["title","wait","camera"].includes(M.type)),l=a.font?ur(a.font):s.fontRecords.get(s.selectedFontId),c=a.morph?ur(a.morph.from):l,u=a.morph?ur(a.morph.to):null,d=a.mode?a.mode==="3d":s.extrusionEnabled,h=a.animation;if(h&&h!=="none"&&!d)throw Error("Orbit, Turn and Face require 3D. Add a 3D action.");if(a.morph&&a.font&&c.id!==l.id)throw Error("Font and morph source must be the same font");let p=i.message||s.message;if(o&&!p.trim())throw Error("Enter a message before applying appearance actions");let _=window.GeoGlyphMessageText.hasEmoji(p);if(o&&_&&(d||a.morph))throw Error("Colour emoji require 2D and cannot be font morphed.");if(a.morph){if(c.id===u.id)throw Error("Choose different source and target morph fonts");if(!gi().stats().ready&&(!c.fontResourceKey?.startsWith("conference:")||!u.fontResourceKey?.startsWith("conference:")))throw Error("Morphing requires built-in outline fonts");await window.GeoGlyphFontService.morph(c,u,p,{tracking:s.tracking,lineHeight:s.lineHeight,signal:t}),Tn(e)}if(o){await window.GeoGlyphFontService.ensureFace(c).catch(()=>null),Tn(e);let M=_?ur({resourceKey:"conference:Segoe UI Emoji",name:"Segoe UI Emoji"}):null;M&&(await Promise.all([M,ur({resourceKey:"conference:Emoji Flags"})].map(S=>window.GeoGlyphFontService.ensureFace(S))),Tn(e));let g={fontId:c?.id,message:p,hasNewContent:!!i.message,nativeColor:window.GeoGlyphMessageText.nativeColour(c,p,!!a.colour?.fill),emojiFallbackFontId:M?.id||null,extrusionEnabled:d,mirrorX:a.mirror??s.mirrorX,fit:a.fit===!0};a.colour&&Object.assign(g,a.colour),a.size&&Object.assign(g,{height:a.size.height,depth:a.size.depth,relativeSize:100}),a.depth!==void 0&&(g.depth=a.depth),a.tilt!==void 0&&(g.tilt=a.tilt),a.bearing!==void 0&&(g.bearing=a.bearing),h&&h!=="none"&&(g.animation=h);let f={fontId:s.selectedFontId,message:s.message,nativeColor:s.nativeColor,emojiFallbackFontId:s.emojiFallbackFontId,extrusionEnabled:s.extrusionEnabled,mirrorX:s.mirrorX,height:s.baseHeightMeters,relativeSize:s.relativeSize,depth:s.extrusionDepthMeters,fill:s.fill,outline:s.outline,tilt:s.extrusionTilt,bearing:s.bearing};(a.morph||a.font||i.message&&p!==s.message)&&gi()?.clear({restore:!1});let b=n==="conference"?"arcgis":s.mode,L=await r.applyScriptCue(g,{isCurrent:e,mode:b});if(Tn(e),h==="none")window.GeoGlyph3D.stopOrbit({freezePose:!0}),hr=!1;else if(h){if(!window.GeoGlyph3D.ensureOrbit(h,{framed:L.fitted}))throw Error("Animation could not start");hr=!0,await r.waitForCamera(e),Tn(e)}if(a.morph)try{ls=pl=!0;let S=await gi().prepare(u.id);if(Tn(e),!S)throw Error(gi().stats().error||"Morph could not be prepared");document.getElementById("mapMorphDuration").value=a.morph.duration,gi().play(),ls=!0}catch(S){throw e()&&(gi().clear({restore:!1}),await r.applyScriptCue(f,{isCurrent:e,mode:b})),S}finally{pl=!1}}if(a.camera)if(typeof a.camera=="object")_t.state().skip||await r.playCameraFlight(a.camera,{isCurrent:e,signal:t}),Tn(e),hr=!1;else if(a.camera==="overview")r.showConferenceOverview();else if(a.camera==="opening"){r.state.conferenceOverview=!0,window.GeoGlyph3D.stopOrbit();let M=ur({resourceKey:"conference:Segoe UI Emoji",name:"Segoe UI Emoji"});await r.drawConferenceOpening(M.id,{resetAnchor:!1,isCurrent:e})}else await r.flyToConferenceOpening(e),Tn(e),r.state.conferenceOverview=!1;Tn(e),a.title!==void 0&&d_(a.title)}var _t=Ad({applyRow:f_,changed:i=>{os=i.index,ml()},stopped:Dd});function nu(i){if(_t.state().running)throw Error("Stop playback before editing the script");return _i=mi(i),_t.clearError(),os=Math.min(os,Math.max(0,_i.rows.length-1)),h_(),ml(),Id(_i)}async function iu({start:i=os,owner:e="manual",isCurrent:t=()=>!0,onRow:n=()=>{},onRowStart:r=()=>{},singleStep:s=!1}={}){if(_t.state().running){_t.resume();return}return e==="manual"&&(dr().stopPolling({quiet:!0}),window.GeoGlyphConference?.clearSurveyQueue(),dr().state.conferenceOverview=!1),Tn(t),_t.play(_i,i,{owner:e,isCurrent:t,onRow:n,onRowStart:r,singleStep:s})}function Nd(){if(Rd)return window.GeoGlyphScripts;Rd=!0;try{let i=localStorage.getItem(Pd);i&&(_i=mi(JSON.parse(i)))}catch{fl="Saved draft could not be restored. The bundled introduction is available."}return window.GeoGlyphScripts=Object.freeze({validate:mi,getDraft:()=>Id(_i),setDraft:nu,newRow:tu,fontIdentity:Td,resolveFont:ur,parse:i=>mi(JSON.parse(i)),serialize:()=>JSON.stringify(mi(_i),null,2),reset:()=>nu(Qc),newScript:()=>nu({version:1,title:"Untitled script",rows:[tu()]}),select:i=>{_t.state().running||(os=Math.max(0,Math.min(_i.rows.length-1,i)),ml())},state:()=>({..._t.state(),selected:os,storageError:fl,hasMotion:hr||ls}),play:iu,pause:_t.pause,resume:_t.resume,stop:()=>{let i=_t.state().running;_t.stop(),!i&&(hr||ls)&&(Dd(),ml())},next:()=>_t.state().running?(dr().cancelCameraFlight(),_t.next()):iu({singleStep:!0}),playConference:i=>iu({...i,start:0,owner:"conference"}),pauseConference:()=>{_t.state().owner==="conference"&&_t.pause()},resumeConference:()=>{_t.state().owner==="conference"&&_t.resume()},stopConference:()=>{_t.state().owner==="conference"&&_t.stop()}}),document.addEventListener("visibilitychange",_t.wake),document.addEventListener("geoglyph:manual-map-change",()=>{_t.state().running&&_t.stop()}),window.addEventListener("pagehide",()=>_t.stop()),window.GeoGlyphScripts}var Ud={plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',expand:'<path d="m8 8 4-4 4 4M8 16l4 4 4-4M4 12h16"/>',collapse:'<path d="m8 4 4 4 4-4M8 20l4-4 4 4M4 12h16"/>',maximize:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16"/>',type:'<path d="M4 5V3h16v2M12 3v18M8 21h8"/>',palette:'<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a5 5 0 0 0 5-5c0-3-4-5-9-5Z"/><path d="M7 9h.01M10 6h.01M15 6h.01M6 13h.01"/>',layers:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',flip:'<path d="M12 3v18M3 7l6-3v16l-6-3V7Zm18 0-6-3v16l6-3V7Z"/>',blend:'<circle cx="8" cy="12" r="6"/><circle cx="16" cy="12" r="6"/>',heading:'<path d="M4 4v16M14 4v16M4 12h10M18 14l3-2v8"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3V7Z"/><circle cx="12" cy="13" r="4"/>',play:'<path d="m7 4 14 8-14 8V4Z"/>',pause:'<path d="M8 4v16M16 4v16"/>',stop:'<rect x="5" y="5" width="14" height="14"/>',next:'<path d="m5 5 10 7-10 7V5Zm14 0v14"/>',save:'<path d="M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"/>',folder:'<path d="M3 6h7l2 3h9v11H3V6Z"/>',file:'<path d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 13h8M8 17h8"/>',trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',copy:'<rect x="8" y="8" width="13" height="13"/><path d="M16 8V3H3v13h5"/>',refresh:'<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',key:'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3m-6 0 3-3"/>',login:'<path d="M14 3h7v18h-7M3 12h13m-5-5 5 5-5 5"/>',exchange:'<path d="M3 7h18m-5-5 5 5-5 5M21 17H3m5-5-5 5 5 5"/>',check:'<path d="m4 12 5 5L20 6"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',up:'<path d="m5 15 7-7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>'};function vi(i){return ol[i]||`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${Ud[i]||Ud.file}</svg>`}function Fd(){let i=document.getElementById("geoglyphMapEditor");if(!i)return;let e={mapFitBtn:"maximize",mapCollapsedFitBtn:"maximize",mapCollapsedJpgBtn:"camera",mapCollapsedPngBtn:"camera",mapEditorCollapseBtn:"panel",mapArcgisUseTokenBtn:"key",mapArcgisClearTokenBtn:"close",mapArcgisStartBtn:"play",mapArcgisPollBtn:"refresh",mapArcgisStopBtn:"stop",mapArcgisReset123Btn:"trash",mapArcgisIntervalMinus:"minus",mapArcgisIntervalPlus:"plus",mapFontRescanBtn:"refresh",mapScanSystemBtn:"type",mapCopyEsriPathBtn:"copy",mapLoadEsriBtn:"folder",mapExportObjBtn:"box",mapExportGeoJsonBtn:"file",mapSaveJpgBtn:"camera",mapSavePngBtn:"camera",mapEsriAerialBtn:"layers",mapEsriWorldBtn:"layers",mapMetroMapBtn:"layers",map3DView:"maximize",map3DOrbit:"orbit",mapMorphPrepare:"blend",mapMorphPlay:"play",mapMorphClear:"close",mapMetroMapCloseBtn:"close",mapMetroMapSaveBtn:"save",mapMetroMapRemoveBtn:"trash"},t=!1;function n(){t=!1;for(let a of document.querySelectorAll("#geoglyphMapEditor button, #mapMetroMapDialog button")){let o=a.querySelector(".module-collapse-mark");if(o){o.querySelector("svg")||(o.innerHTML=vi(a.getAttribute("aria-expanded")==="false"?"plus":"minus"));continue}if(a.querySelector("svg")||a.classList.contains("studio-swatch"))continue;let l=a.dataset.collapseAll?a.dataset.collapseAll:a.dataset.mapMode?{message:"type",arcgis:"box",admin:"layers"}[a.dataset.mapMode]:a.dataset.mapColourTarget?"palette":a.id==="mapMorphPlay"&&a.textContent==="Pause"?"pause":e[a.id];if(!l)continue;if(a.matches(".map-editor-collapse,.map-header-fit,.map-collapsed-fit,[data-collapse-all],#mapArcgisIntervalMinus,#mapArcgisIntervalPlus"))a.getAttribute("aria-label")||a.setAttribute("aria-label",a.textContent.trim()),a.replaceChildren();else{let u=document.createElement("span");for(u.className="icon-caption";a.firstChild;)u.append(a.firstChild);a.append(u)}a.insertAdjacentHTML("afterbegin",vi(l)),a.classList.add("map-icon-button")}}let r=new MutationObserver(()=>{t||(t=!0,queueMicrotask(n))});r.observe(i,{childList:!0,subtree:!0,characterData:!0});let s=document.getElementById("mapMetroMapDialog");s&&r.observe(s,{childList:!0,subtree:!0,characterData:!0}),n()}var yi=i=>String(i??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Mt=(i,e,t="")=>`<button type="button" class="map-action" ${t}>${vi(i)}<span>${yi(e)}</span></button>`,nn=(i,e)=>`<label class="map-field"><span>${yi(i)}</span>${e}</label>`,na=(i,e,t,n)=>`<input id="${i}" type="number" value="${e}" min="${t}" max="${n}" step="any">`,fr=(i,e,t)=>`<select id="${i}">${e.map(([n,r])=>`<option value="${yi(n)}" ${String(n)===String(t)?"selected":""}>${yi(r)}</option>`).join("")}</select>`;function Od(){if(document.getElementById("mapScriptSection"))return;let i=Nd(),e=document.createElement("section");e.id="mapScriptSection",e.className="map-script-panel",e.setAttribute("aria-label","Script editor"),e.innerHTML=`<label class="map-field"><span>Script name</span><input id="mapScriptTitle" class="script-edit" type="text" maxlength="300"></label>
    <div class="script-file-actions">${Mt("file","New",'id="mapScriptNew"')}${Mt("folder","Load JSON",'id="mapScriptLoad"')}${Mt("save","Save JSON",'id="mapScriptSave"')}${Mt("refresh","Reset intro",'id="mapScriptReset" title="Restore bundled introduction"')}</div>
    <input id="mapScriptFile" type="file" accept=".json,application/json" hidden>
    <div class="script-play-actions">${Mt("play","Play",'id="mapScriptPlay"')}${Mt("next","Next",'id="mapScriptNext"')}${Mt("stop","Stop",'id="mapScriptStop"')}</div>
    <p id="mapScriptStatus" class="map-3d-status" role="status" aria-live="polite"></p>
    <div class="script-rows" id="mapScriptRows" aria-label="Script rows"></div>
    ${Mt("plus","Add row",'id="mapScriptAddRow"')}`,document.getElementById("mapMorphPanel").after(e),e.addEventListener("wheel",m=>{if(m.ctrlKey||m.shiftKey||Math.abs(m.deltaX)>Math.abs(m.deltaY))return;let y=e.closest(".map-control-sidebar");if(!y)return;let R=y.scrollTop,I=m.deltaMode===1?16:m.deltaMode===2?y.clientHeight:1;y.scrollTop+=m.deltaY*I,y.scrollTop!==R&&m.preventDefault()},{passive:!1});let t=document.createElement("dialog");t.id="mapScriptDialog",t.className="script-dialog",t.setAttribute("aria-labelledby","mapScriptDialogTitle"),document.body.append(t);let n=m=>document.getElementById(m),r="",s=null,a=null,o=null,l=0,c="",u=null;function d(m){c=String(m),n("mapScriptStatus").textContent=c,n("mapScriptStatus").dataset.state="error"}function h(m){try{c="";let y=i.getDraft();m(y),i.setDraft(y)}catch(y){d(y.message)}}function p(m){m.style.height="auto",m.style.height=Math.max(34,m.scrollHeight)+"px"}function _(m,y){let R="";for(let I=0;I<4;I++){let F=m.actions[I],D=F?F.type==="mode"?F.value.toUpperCase():F.type==="font"?"Font: "+F.value.name:cr[F.type][0]:"";R+=F?`<button type="button" class="map-action script-action script-edit" data-edit-action="${I}" aria-label="${yi(D)}" title="${yi(D)}">${vi(F.type==="mode"&&F.value==="2d"?"layers":cr[F.type][1])}</button>`:I===m.actions.length?`<button type="button" class="map-action script-action script-edit" data-add-action aria-label="Add action to row ${y+1}" title="Add action">${vi("plus")}</button>`:'<span class="script-empty-slot" aria-hidden="true"></span>'}return`<div class="script-row-primary">${R}<textarea class="script-message script-edit" rows="1" placeholder="Message\u2026" aria-label="Row ${y+1} message">${yi(m.message)}</textarea></div>
      <div class="script-row-tools"><button type="button" class="map-action script-edit" data-select-row aria-label="Select row ${y+1}">${y+1}</button>
      <label class="script-duration">Hold <input class="script-edit" type="number" min="0" max="3600" step=".25" value="${m.duration}" aria-label="Row ${y+1} duration"> s</label>
      ${[["above","plus","Insert row above"],["below","plus","Insert row below"],["up","up","Move row up"],["down","down","Move row down"],["copy","copy","Duplicate row"],["delete","trash","Delete row"]].map(([I,F,D])=>`<button class="map-action script-edit" type="button" data-row-command="${I}" aria-label="${D}" title="${D}">${vi(F)}</button>`).join("")}</div>`}function M(){let m=i.state(),y=i.getDraft(),R=JSON.stringify(y),I=n("mapScriptRows");if(R!==r){let F=new Map([...I.children].map(D=>[D.dataset.rowId,D]));y.rows.forEach((D,A)=>{let z=F.get(D.id);z||(z=document.createElement("div"),z.className="script-row",z.dataset.rowId=D.id),F.delete(D.id);let Z=JSON.stringify([D,A]);z.dataset.signature!==Z&&!z.contains(document.activeElement)&&(z.innerHTML=_(D,A)),z.dataset.signature=Z,I.children[A]!==z&&I.insertBefore(z,I.children[A]||null)}),F.forEach(D=>D.remove()),r=R,document.activeElement!==n("mapScriptTitle")&&(n("mapScriptTitle").value=y.title),I.querySelectorAll("textarea").forEach(p)}for(let[F,D]of[...I.children].entries())D.classList.toggle("is-selected",F===m.selected),D.classList.toggle("is-playing",m.running&&F===m.index),D.querySelector("[data-select-row]")?.setAttribute("aria-pressed",String(F===m.selected));e.querySelectorAll(".script-edit,#mapScriptNew,#mapScriptLoad,#mapScriptReset,#mapScriptAddRow").forEach(F=>F.disabled=m.running),n("mapScriptPlay").innerHTML=vi(m.running&&!m.paused?"pause":"play")+`<span>${m.running?m.paused?"Resume":"Pause":"Play"}</span>`,n("mapScriptPlay").disabled=!y.rows.length,n("mapScriptNext").disabled=!y.rows.length,n("mapScriptStop").disabled=!m.running&&!m.hasMotion,c||(n("mapScriptStatus").dataset.state=m.error?"error":"",n("mapScriptStatus").textContent=m.error||m.storageError||(m.running?`Row ${m.index+1} \xB7 ${m.paused?"Paused":m.phase==="preparing"?"Preparing\u2026":"Playing"}`:m.phase==="complete"?"Script complete":`${y.rows.length} rows \xB7 up to 4 actions per row`))}function g(m=!0){let y=u;u=null,y?.dispose(m)}function f(){(a?.isConnected?a:[...e.querySelectorAll("[data-row-id]")].find(y=>y.dataset.rowId===o)?.querySelector("button"))?.focus({preventScroll:!0})}function b(){g(),++l,s=null,t.open?t.close():f()}t.addEventListener("close",()=>{t.open||u?.suspended||(g(),++l,s=null,f())});function L(m,y,R){t.innerHTML=`<form method="dialog"><div class="script-dialog-head"><h2 id="mapScriptDialogTitle">${yi(m)}</h2>${Mt("close","Close",'data-dialog-close aria-label="Close picker"')}</div>
      <div class="script-dialog-body">${y}</div><p class="script-dialog-error" role="alert"></p><div class="script-dialog-footer">${R||""}</div></form>`,t.querySelector("[data-dialog-close]").addEventListener("click",b),t.querySelector("form").addEventListener("submit",I=>I.preventDefault()),t.open||t.showModal()}function S(m,y){a=y,o=m,s={rowId:m},++l,L("Add action",`<div class="script-action-menu">${Object.entries(cr).map(([R,[I,F]])=>Mt(F,I,`data-choose-action="${R}"`)).join("")}</div>`,Mt("close","Cancel","data-cancel")),t.querySelector("[data-cancel]").onclick=b,t.querySelectorAll("[data-choose-action]").forEach(R=>R.onclick=()=>E(m,R.dataset.chooseAction))}function w(m,y){let R=window.GeoGlyphMapEngine,I=y?.value,F=typeof I=="object"?JSON.parse(JSON.stringify(I)):{type:"flight",start:null,end:null,duration:5},D=null;try{D=R.captureCameraView()}catch{}let A={suspended:!1,pickCleanup:null,preview:null,toolbar:null,markers:[],sidebarVisible:null,selected:null,disposed:!1};u=A,L("Camera action",nn("Camera action",fr("scriptValue",[["opening","Prepare sleeping Geo"],["fly-opening","Fly to sleeping Geo (30 seconds)"],["overview","Australia overview"],["flight","Custom camera flight"]],typeof I=="object"?"flight":I||"fly-opening"))+`<div id="scriptCameraFlight" class="script-camera-fields">
        <div class="script-camera-point"><strong>Start</strong><output id="scriptCameraStartSummary" aria-live="polite"></output>${Mt("camera","Pick Start",'id="scriptCameraPickStart"')}</div>
        <div class="script-camera-point"><strong>End</strong><output id="scriptCameraEndSummary" aria-live="polite"></output>${Mt("camera","Pick End",'id="scriptCameraPickEnd"')}</div>
        ${nn("Flight duration (s)",na("scriptCameraDuration",F.duration,.25,300))}
        ${Mt("play","Preview",'id="scriptCameraPreview"')}
      </div>`,P(y));let z=k=>{let j=k?.message||String(k);return t.querySelector(".script-dialog-error").textContent=j,j};function Z(){return n("scriptValue").value==="flight"?{type:"flight",start:F.start,end:F.end,duration:Number(n("scriptCameraDuration").value)}:n("scriptValue").value}function K(){try{return as({type:"camera",value:{type:"flight",start:F.start,end:F.end,duration:Number(n("scriptCameraDuration").value)}}),!0}catch{return!1}}function se(k){return k?`${k.center[0].toFixed(5)}, ${k.center[1].toFixed(5)} \xB7 Zoom ${k.zoom.toFixed(2)} \xB7 ${k.pitch<1?"2D":`3D ${k.pitch.toFixed(1)}\xB0`} \xB7 Bearing ${k.bearing.toFixed(1)}\xB0`:"Not selected"}function U(){for(let k of A.markers)k.remove();A.markers=[]}function q(){if(U(),!(!A.suspended||!R.state.map)){for(let k of["start","end"])if(F[k]){let j=document.createElement("div");j.className="script-camera-marker is-"+k,j.setAttribute("role","img"),j.setAttribute("aria-label",`${k==="start"?"Start":"End"} camera location`),j.innerHTML=vi("camera")+`<span>${k==="start"?"Start":"End"}</span>`,A.markers.push(new window.maplibregl.Marker({element:j,anchor:"bottom"}).setLngLat(F[k].center).addTo(R.state.map))}}}function C(){let k=n("scriptValue").value==="flight";n("scriptCameraFlight").hidden=!k,n("scriptCameraStartSummary").textContent=se(F.start),n("scriptCameraEndSummary").textContent=se(F.end);let j=K();if(n("scriptCameraPreview").disabled=!j,t.querySelector("[data-apply]").disabled=k&&!j,A.toolbar){let ie=A.toolbar.querySelector("[data-camera-status]");ie.textContent=A.preview?"Previewing camera flight\u2026":A.selected?`Click the map to set ${A.selected}. Pan, zoom or tilt before clicking.`:"Point captured. Pick another point or return to Camera Action.";for(let oe of["start","end"])A.toolbar.querySelector(`[data-camera-pick="${oe}"]`).setAttribute("aria-pressed",String(A.selected===oe));A.toolbar.querySelector("[data-camera-stop-preview]").hidden=!A.preview,A.toolbar.querySelectorAll("[data-camera-pick]").forEach(oe=>oe.disabled=!!A.preview)}}function $(){A.pickCleanup?.(),A.pickCleanup=null,A.selected=null}function ne(){A.sidebarVisible!==null&&(window.GeoGlyphMapSidebar?.setVisible(A.sidebarVisible),A.sidebarVisible=null),e.inert=!1}function ye(){u!==A||A.disposed||($(),A.preview?.abort(),A.preview=null,A.toolbar?.remove(),A.toolbar=null,U(),R.setCameraAuthoring(!1),A.suspended=!1,ne(),t.open||t.showModal(),C(),n("scriptCameraPick"+(A.returnFocus==="end"?"End":"Start")).focus({preventScroll:!0}))}function ce(){if(!(u!==A||A.disposed)){if(!R.state.previewActive||!R.state.mapReady)throw Error("Open the map and wait until it is ready");if(D||(D=R.captureCameraView()),!A.suspended){A.suspended=!0,R.setCameraAuthoring(!0),e.inert=!0;let k=window.GeoGlyphMapSidebar;k&&(A.sidebarVisible=k.state().visible,k.setVisible(!1)),t.open&&t.close();let j=document.createElement("div");j.id="scriptCameraToolbar",j.className="script-camera-toolbar",j.setAttribute("role","region"),j.setAttribute("aria-label","Camera flight map editor"),j.innerHTML=`<p data-camera-status role="status" aria-live="polite"></p><div class="script-camera-toolbar-actions">
          ${Mt("camera","Pick Start",'data-camera-pick="start"')}${Mt("camera","Pick End",'data-camera-pick="end"')}
          ${Mt("panel","Return to Camera Action","data-camera-return")}${Mt("close","Cancel","data-camera-cancel")}
          ${Mt("stop","Stop Preview","data-camera-stop-preview hidden")}
        </div>`,n("geoglyphMapWorkspace").append(j),A.toolbar=j,j.querySelectorAll("[data-camera-pick]").forEach(ie=>ie.onclick=()=>le(ie.dataset.cameraPick)),j.querySelector("[data-camera-return]").onclick=ye,j.querySelector("[data-camera-cancel]").onclick=b,j.querySelector("[data-camera-stop-preview]").onclick=ye}q(),C()}}function le(k){try{A.preview?.abort(),A.preview=null,$(),A.returnFocus=k,ce(),A.selected=k,A.pickCleanup=R.pickCameraView({onPick:j=>{u!==A||A.disposed||(F[k]=JSON.parse(JSON.stringify(j)),$(),q(),C(),A.toolbar?.querySelector("[data-camera-return]")?.focus({preventScroll:!0}))},onCancel:b}),C(),A.toolbar.querySelector(`[data-camera-pick="${k}"]`).focus({preventScroll:!0})}catch(j){ye(),z(j)}}A.dispose=k=>{A.disposed=!0,$(),A.preview?.abort(),A.preview=null,A.toolbar?.remove(),A.toolbar=null,U(),R.setCameraAuthoring(!1),ne(),k&&D&&R.restoreCameraView(D)},n("scriptValue").onchange=C,n("scriptCameraDuration").oninput=C,n("scriptCameraPickStart").onclick=()=>le("start"),n("scriptCameraPickEnd").onclick=()=>le("end"),n("scriptCameraPreview").onclick=async()=>{let k=new AbortController;try{let j=as({type:"camera",value:Z()});if($(),A.preview=k,ce(),C(),A.toolbar.querySelector("[data-camera-stop-preview]").focus({preventScroll:!0}),await new Promise(ie=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(ie)))),u!==A||k.signal.aborted)return;await R.playCameraFlight(j.value,{signal:k.signal,isCurrent:()=>u===A&&!A.disposed&&!k.signal.aborted})}catch(j){j.name!=="AbortError"&&u===A&&z(j)}finally{u===A&&A.preview===k&&(A.preview=null,ye())}},t.querySelector("[data-cancel]").onclick=b;let G=t.querySelector("[data-remove]");G&&(G.onclick=()=>{try{let k=i.getDraft(),j=k.rows.find(ie=>ie.id===m);if(!j)throw Error("Script row no longer exists");j.actions=j.actions.filter(ie=>ie.type!=="camera"),i.setDraft(k),b()}catch(k){z(k)}}),t.querySelector("[data-apply]").onclick=()=>{try{let k=as({type:"camera",value:Z()}),j=i.getDraft(),ie=j.rows.find(Ee=>Ee.id===m);if(!ie)throw Error("Script row no longer exists");let oe=ie.actions.findIndex(Ee=>Ee.type==="camera");oe<0?ie.actions.push(k):ie.actions[oe]=k,i.setDraft(j),g(!1),b()}catch(k){z(k)}},C(),n("scriptValue").focus()}document.addEventListener("keydown",m=>{m.key==="Escape"&&u?.suspended&&(m.preventDefault(),b())},{capture:!0}),document.addEventListener("geoglyph:map-exit",()=>{u&&b()}),new MutationObserver(()=>{u&&!window.GeoGlyphMapEngine.state.previewActive&&b()}).observe(document.body,{attributes:!0,attributeFilter:["class"]});async function E(m,y){let R=++l,I=i.getDraft().rows.find(U=>U.id===m),F=I.actions.find(U=>U.type===y),D=F?.value,A=window.GeoGlyphMapEngine.state;s={rowId:m,type:y};let z="",Z,K;if(y==="camera"){w(m,F);return}if(y==="font"||y==="morph"){L("Loading fonts",'<p role="status">Preparing available fonts\u2026</p>',Mt("close","Cancel","data-cancel")),t.querySelector("[data-cancel]").onclick=b;try{await window.GeoGlyphFontMorph.ensureBuiltins()}catch(U){R===l&&(t.querySelector(".script-dialog-body").textContent=U.message);return}if(R!==l||!t.open)return}if(y==="font"){let C=function(){let $=n("scriptFontSearch").value.toLowerCase(),ne=[...A.fontRecords.values()].filter(ye=>`${ye.name} ${ye.family}`.toLowerCase().includes($));q.replaceChildren();for(let ye of ne.slice(0,100)){let ce=document.createElement("button");ce.type="button",ce.className="script-font-choice",ce.setAttribute("aria-pressed",String(U?.id===ye.id));let le=document.createElement("span");le.textContent=ye.name,le.style.fontFamily=JSON.stringify(ye.cssFamily||ye.family||"sans-serif");let G=document.createElement("small"),k=window.GeoGlyphMapEngine.fontCompatibility(ye.id);G.textContent=ye.hasColor||/emoji/i.test(ye.name)?"2D":k==="compatible"?"Both":"2D \xB7 3D not checked",ce.append(le,G),ce.onclick=()=>{U=ye,q.querySelectorAll("button").forEach(j=>j.setAttribute("aria-pressed",String(j===ce)))},q.append(ce)}if(ne.length>100){let ye=document.createElement("p");ye.textContent=`Showing 100 of ${ne.length} fonts. Refine the search.`,q.append(ye)}},U;try{D&&(U=i.resolveFont(D))}catch{}z=nn("Search fonts",'<input id="scriptFontSearch" type="search" placeholder="Font name\u2026">')+'<div class="script-font-list" role="group" aria-label="Available fonts"></div>',Z=()=>{if(!U)throw Error("Choose a font");return i.fontIdentity(U)},L("Font",z,P(F));let q=t.querySelector(".script-font-list");n("scriptFontSearch").oninput=C,C()}else{if(y==="mode")z=nn("Rendering",fr("scriptValue",[["2d","2D"],["3d","3D"]],D||"2d")),Z=()=>n("scriptValue").value;else if(y==="animation")z=nn("Animation",fr("scriptValue",[["none","Stop animation"],["fixed","Orbit"],["yaw","Turn toward camera"],["billboard","Face camera"]],D||"fixed")),Z=()=>n("scriptValue").value;else if(y==="colour")z=nn("Destination",fr("scriptColourTarget",[["fill","Fill"],["outline","Outline"]],D?.fill?"fill":D?.outline?"outline":"fill"))+nn("Colour",'<input id="scriptColourValue" type="color">')+'<div id="scriptColourPicker"></div>',Z=()=>({...D,[n("scriptColourTarget").value]:n("scriptColourValue").value});else if(y==="morph"){let U=[...A.fontRecords.values()].filter(ne=>ne.fontResourceKey?.startsWith("conference:")&&!ne.hasColor&&!/emoji/i.test(ne.name)),q=U.map(ne=>[ne.id,ne.name]),C,$;try{C=D&&i.resolveFont(D.from).id,$=D&&i.resolveFont(D.to).id}catch{}z=nn("From font",fr("scriptMorphFrom",q,C||U[0]?.id))+nn("To font",fr("scriptMorphTo",q,$||U[1]?.id))+nn("Morph duration (s)",na("scriptValue",D?.duration??2,.25,30)),Z=()=>({from:i.fontIdentity(A.fontRecords.get(n("scriptMorphFrom").value)),to:i.fontIdentity(A.fontRecords.get(n("scriptMorphTo").value)),duration:Number(n("scriptValue").value)})}else if(y==="size")z=nn("Height (m)",na("scriptValue",D?.height??A.baseHeightMeters,1,3e5))+nn("Depth (m)",na("scriptDepth",D?.depth??A.extrusionDepthMeters??30,.1,1e5)),Z=()=>({height:Number(n("scriptValue").value),depth:Number(n("scriptDepth").value)});else if(y==="mirror"||y==="fit")z=nn(y==="mirror"?"Mirror horizontally":"Fit geometry",fr("scriptValue",[["true","On"],["false","Off"]],String(D??!0))),Z=()=>n("scriptValue").value==="true";else if(y==="title")z=nn("Overlay text (empty removes title)",`<textarea id="scriptValue" rows="3" maxlength="2000">${yi(D||"")}</textarea>`),Z=()=>n("scriptValue").value;else{let U={depth:[.1,1e5,A.extrusionDepthMeters??30],tilt:[0,90,A.extrusionTilt],bearing:[-360,360,A.bearing],wait:[0,3600,5]}[y];z=nn(y==="wait"?"Additional wait (s)":cr[y][0],na("scriptValue",D??U[2],U[0],U[1])),Z=()=>Number(n("scriptValue").value)}if(L(cr[y][0],z,P(F)),y==="colour"){let U=()=>{n("scriptColourValue").value=D?.[n("scriptColourTarget").value]||A[n("scriptColourTarget").value],K?.sync()};U(),K=window.GeoGlyphColourPicker.mount(n("scriptColourPicker"),()=>({key:"script-"+n("scriptColourTarget").value,label:"Script colour",input:n("scriptColourValue")})),n("scriptColourValue").oninput=()=>K.sync(),n("scriptColourTarget").onchange=U}}t.querySelector("[data-cancel]").onclick=b;let se=t.querySelector("[data-remove]");se&&(se.onclick=()=>{h(U=>{let q=U.rows.find(C=>C.id===m);q.actions=q.actions.filter(C=>C.type!==y)}),b()}),t.querySelector("[data-apply]").onclick=()=>{try{let U=as({type:y,value:Z()}),q=i.getDraft(),C=q.rows.find(ne=>ne.id===m),$=C.actions.findIndex(ne=>ne.type===y);$<0?C.actions.push(U):C.actions[$]=U,i.setDraft(q),b()}catch(U){t.querySelector(".script-dialog-error").textContent=U.message}},t.querySelector("input,select,textarea")?.focus()}function P(m){return(m?Mt("trash","Remove action","data-remove"):"")+Mt("close","Cancel","data-cancel")+Mt("check","Apply","data-apply")}e.addEventListener("input",m=>{if(m.target.id==="mapScriptTitle"&&h(y=>{y.title=m.target.value}),m.target.matches(".script-message")){let y=m.target.closest("[data-row-id]").dataset.rowId;h(R=>{R.rows.find(I=>I.id===y).message=m.target.value}),p(m.target)}}),e.addEventListener("change",m=>{if(m.target.closest(".script-duration")){let y=m.target.closest("[data-row-id]").dataset.rowId;h(R=>{R.rows.find(I=>I.id===y).duration=Number(m.target.value)})}}),e.addEventListener("click",m=>{let y=m.target.closest("button"),R=y?.closest("[data-row-id]");if(!y||!R)return;let I=R.dataset.rowId,F=i.getDraft().rows.find(D=>D.id===I);y.hasAttribute("data-add-action")&&S(I,y),y.hasAttribute("data-edit-action")&&(a=y,o=I,E(I,F.actions[Number(y.dataset.editAction)].type)),y.hasAttribute("data-select-row")&&i.select(i.getDraft().rows.findIndex(D=>D.id===I)),y.dataset.rowCommand&&h(D=>{let A=D.rows.findIndex(Z=>Z.id===I),z=y.dataset.rowCommand;if(z==="delete")D.rows.splice(A,1);else if(z==="copy")D.rows.splice(A+1,0,{...D.rows[A],id:i.newRow().id});else if(z==="above"||z==="below")D.rows.splice(A+(z==="below"?1:0),0,i.newRow());else{let Z=A+(z==="up"?-1:1);Z>=0&&Z<D.rows.length&&([D.rows[A],D.rows[Z]]=[D.rows[Z],D.rows[A]])}})}),n("mapScriptNew").onclick=()=>{c="",i.newScript()},n("mapScriptReset").onclick=()=>{c="",i.reset()},n("mapScriptAddRow").onclick=()=>h(m=>m.rows.push(i.newRow())),n("mapScriptLoad").onclick=()=>n("mapScriptFile").click(),n("mapScriptFile").onchange=async m=>{let y=m.target.files[0];if(y)try{if(y.size>5*1024*1024)throw Error("Script file exceeds 5 MiB");let R=i.parse(await y.text());c="",i.setDraft(R)}catch(R){d(R.message)}finally{m.target.value=""}},n("mapScriptSave").onclick=()=>{let m=new Blob([i.serialize()],{type:"application/json"}),y=URL.createObjectURL(m),R=document.createElement("a");R.href=y,R.download=(i.getDraft().title.replace(/[^a-z\d_-]/gi,"-")||"geoglyph-script")+".json",R.click(),setTimeout(()=>URL.revokeObjectURL(y),1e3)},n("mapScriptPlay").onclick=()=>{c="";let m=i.state();m.running?m.paused?i.resume():i.pause():i.play().catch(y=>d(y.message))},n("mapScriptNext").onclick=()=>{c="",Promise.resolve(i.next()).catch(m=>d(m.message))},n("mapScriptStop").onclick=()=>i.stop(),document.addEventListener("geoglyph:script-changed",M),M()}var ru="geoglyph-extruded-font",we=i=>document.getElementById(i),vn=()=>window.GeoGlyphMapEngine,yt=()=>vn()?.state,yn=()=>window.GeoGlyphFontMorph?.isActive()?window.GeoGlyphFontMorph:null,hn=null,kt=null,cs="",su=0,pr="",sn=null,Qn=cd((i,e)=>window.GeoGlyphFontService.mesh(i,e)),au=0,kd=0,gl=!1;function Gd(){let i=yt(),e=window.GeoGlyphFontMorph;return gl?"Preparing OBJ download\u2026":!i?.previewActive||!i.extrusionEnabled?"Enable 3D to export an OBJ object.":i.rebuilding||i.pendingBuild||i.randomSearching||e?.stats().preparing?"Wait for geometry preparation before exporting.":e?.isActive()&&!e.canExport()?"Move the morph slider to an endpoint before exporting.":rn()?"":"Choose an outline font with valid 3D geometry to export."}function mr(){let i=we("mapExportObjBtn");if(!i)return;let e=Gd();i.disabled=!!e,i.title=e||"Export 3D object as OBJ",i.setAttribute("aria-busy",String(gl));let t=we("mapObjStatus");t&&t.dataset.state!=="error"&&(t.textContent=e||"OBJ \xB7 metres \xB7 geometry only")}async function Vd(){if(Gd())return mr(),!1;let e=yt(),t=yn(),n=kt,r=e.buildToken,s={...t?.renderedAngles()||tt.getAngles()},a=xl(s).object.clone(),o=new ke().makeRotationZ(-s.bearing*Math.PI/180).multiply(a),l=e.fontRecords.get(e.displayedFontId)?.name||"GeoGlyph",c=()=>e.previewActive&&e.extrusionEnabled&&e.buildToken===r&&kt===n&&!yn(),u=we("mapObjStatus");u&&(u.dataset.state=""),gl=!0,mr();try{let d=n;if(t){let M=await t.prepareOBJEndpoint();d=M.mesh,l=M.name;let g=M.model.bounds,f=M.referenceBounds,b=g.height/f.height;o.multiply(new ke().makeTranslation((g.cx-f.cx)/f.height,(f.cy-g.cy)/f.height,0)).multiply(new ke().makeScale(b,b,1)),c=()=>e.previewActive&&e.extrusionEnabled&&M.isCurrent()}let h=await wd(d,o,{name:l,isCurrent:c}),p=URL.createObjectURL(h),_=document.createElement("a");return _.href=p,_.download=`geoglyph-${l.replace(/[^a-z0-9_-]/gi,"-")}-${Date.now()}.obj`,document.body.append(_),_.click(),_.remove(),setTimeout(()=>URL.revokeObjectURL(p),1e3),u&&(u.textContent=`OBJ saved \xB7 ${(d.position.length/9).toLocaleString()} triangles \xB7 metres`),!0}catch(d){return u&&(u.textContent="OBJ export failed: "+d.message,u.dataset.state="error"),!1}finally{gl=!1,mr()}}var zn=new ke,tt=ld(()=>{let i=yt()||{};return{map:i.map,anchor:i.anchor,bearing:i.bearing,tilt:i.extrusionTilt,orientationMode:i.orientationMode||"fixed",period:i.orbitPeriodSeconds||30,bounds:yn()?.getBounds()||kt?.bounds,visible:rn()&&i.previewActive,restoredElevatedView:i.restoredCamera?.elevation>0,pose:xl,renderedAngles:yn()?.renderedAngles()||(hn?.ready&&hn.hasRenderedPose?hn.renderedAngles:null),freezePose:p_,cancelPending:()=>{sn=null,vt()}}},()=>vt());function p_(i){let e=yt();!e||!Number.isFinite(i.bearing)||!Number.isFinite(i.tilt)||(Object.assign(e,{bearing:i.bearing%360,extrusionTilt:i.tilt,orientationMode:"fixed"}),queueMicrotask(()=>vn()?.refreshControls?.()))}function us(i,e=!1){let t=we("map3DStatus");t&&(t.textContent=i);let n=we("mapQuickStatus");n&&(n.textContent=e?i:"",n.hidden=!e)}function ou(i=tt.getAngles()){let e=yt();return{heightMeters:e.baseHeightMeters*e.relativeSize/100,depthMeters:e.extrusionDepthMeters??30,tilt:i.tilt,bearing:i.bearing,mirrorX:e.mirrorX===!0}}function xl(i=tt.getAngles(),e={geographic:new ke,object:new ke}){if(window.GeoGlyphFontMorph?.isActive())return Hd(window.GeoGlyphFontMorph.getBounds(),!1,i,e);let t=yt(),n=ou(i),r=window.GeoGlyphGroundTransform.parameters(n,kt.bounds),s=window.maplibregl.MercatorCoordinate.fromLngLat(t.anchor,0),a=s.meterInMercatorCoordinateUnits(),o=e.geographic.makeTranslation(s.x,s.y,s.z).multiply(zn.makeScale(a,-a,a)).multiply(zn.makeRotationZ(-r.bearing)),l=e.object.makeTranslation(0,0,r.lift).multiply(zn.makeRotationX(r.tilt)).multiply(zn.makeScale(r.height,r.height,r.depth)),c=kt.bounds,u=[(c.minX+c.maxX)/2,(c.minY+c.maxY)/2,(c.minZ+c.maxZ)/2];n.mirrorX&&l.multiply(zn.makeTranslation(c.minX+c.maxX,0,0)).multiply(zn.makeScale(-1,1,1));let d=window.GeoGlyphGroundTransform.point(u,n,c),h=new window.maplibregl.MercatorCoordinate(s.x+d[0]*a,s.y-d[1]*a,d[2]*a);return{geographic:o,object:l,localCenter:d,center:h.toLngLat(),elevation:h.toAltitude(),units:a,radius:Math.hypot((c.maxX-c.minX)*r.height,(c.maxY-c.minY)*r.height,(c.maxZ-c.minZ)*r.depth)/2}}function Hd(i,e=!1,t=tt.getAngles(),n={geographic:new ke,object:new ke}){let r=yt(),s=e?{...ou(t),tilt:0}:ou(t),a=e?{minX:0,maxX:0,minY:-.5,minZ:0,maxZ:0}:{minX:0,maxX:0,minY:-.5,minZ:-.5,maxZ:.5},o=window.GeoGlyphGroundTransform.parameters(s,a);e&&(o.lift=0);let l=window.maplibregl.MercatorCoordinate.fromLngLat(r.anchor,0),c=l.meterInMercatorCoordinateUnits(),u=n.geographic.makeTranslation(l.x,l.y,l.z).multiply(zn.makeScale(c,-c,c)).multiply(zn.makeRotationZ(-o.bearing)),d=n.object.makeTranslation(0,0,o.lift).multiply(zn.makeRotationX(o.tilt)).multiply(zn.makeScale(o.height,o.height,e?1:o.depth)),h=i,p=[0,0,0];s.mirrorX&&d.multiply(zn.makeScale(-1,1,1));let _=window.GeoGlyphGroundTransform.point(p,s,a),M=new window.maplibregl.MercatorCoordinate(l.x+_[0]*c,l.y-_[1]*c,_[2]*c);return{geographic:u,object:d,localCenter:_,center:M.toLngLat(),elevation:M.toAltitude(),units:c,angles:t,radius:Math.hypot((h.maxX-h.minX)*o.height,(h.maxY-h.minY)*o.height,(h.maxZ-h.minZ)*o.depth)/2}}function rn(){return!!(yt()?.extrusionEnabled&&(yn()||hn?.ready&&kt&&yt()?.lastRenderMode==="vector"))}function An(){let i=yt(),e=i?.map;if(!e)return;let t=rn()||yn()?"none":"visible";for(let r of["geoglyph-ground-fill","geoglyph-ground-outline"])e.getLayer(r)&&e.getLayoutProperty(r,"visibility")!==t&&e.setLayoutProperty(r,"visibility",t);let n="geoglyph-ground-decal-layer";e.getLayer(n)&&e.setLayoutProperty(n,"visibility",yn()?"none":"visible"),hn?.ready&&kt&&hn.paint(),window.GeoGlyphFontMorph?.syncVisibility(),e.triggerRepaint()}function _l(){tt.exit(),++su;let i=yt()?.map;hn&&i?.getLayer(ru)&&i.removeLayer(ru),hn=null,kt=null,cs="",Qn.clear(),sn=null,pr="",An(),vt()}function m_(i){return{id:ru,type:"custom",renderingMode:"3d",ready:!1,onAdd(t,n){this.renderer=new Kr({canvas:i.getCanvas(),context:n,antialias:!1}),this.renderer.autoClear=!1,this.scene=new ci,this.camera=new ui,this.group=new si,this.poseMatrices={geographic:new ke,object:new ke},this.renderedAngles={bearing:0,tilt:90},this.hasRenderedPose=!1,this.group.matrixAutoUpdate=!1,this.scene.add(this.group),this.scene.add(new Ds(16777215,1.3));let r=new Ls(16777215,2);r.position.set(-1,-2,4),this.scene.add(r),this.front=new Qi({side:Yt,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1}),this.side=new Rs({side:Yt,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1});let s=Qn.get(cs);this.mesh=new It(s.geometry,[this.front,this.side]),this.group.add(this.mesh),this.lineMaterial=new es({worldUnits:!1,transparent:!0,depthWrite:!1}),this.lines=new al(s.lineGeometry,this.lineMaterial),this.group.add(this.lines),this.geometry=s.geometry,this.lineGeometry=s.lineGeometry,this.ready=!0,au++,this.paint()},replace(t){this.hasRenderedPose=!1,this.geometry=t.geometry,this.lineGeometry=t.lineGeometry,this.mesh.geometry=t.geometry,this.lines.geometry=t.lineGeometry,au++},paint(t){let n=yt();if(!this.ready||!kt)return;this.geometry.groups=n.extrusionSolid&&kt.solidGroups||kt.groups,this.front.color.set(n.fill),this.side.color.set(n.fill).multiplyScalar(.62);let r=n.extrusionSolid?1:n.opacity;for(let o of[this.front,this.side]){let l=!n.extrusionSolid;o.transparent!==l&&(o.transparent=l,o.needsUpdate=!0),o.opacity=r,o.depthWrite=n.extrusionSolid||r>=.99}this.lineMaterial.opacity=r,this.lineMaterial.depthWrite=!1,this.lineMaterial.color.set(n.outline);let s=i.getCanvas(),a=s.width/Math.max(1,s.clientWidth);this.lineMaterial.linewidth=n.outlineWidth*a,this.lineMaterial.resolution.set(s.width,s.height),this.lines.visible=n.outlineWidth>0,this.group.matrix.copy((t||xl()).object),this.group.matrixWorldNeedsUpdate=!0},render(t,n){if(!rn()||yn()||!yt()?.previewActive)return;let r=tt.getAngles(),s=xl(r,this.poseMatrices);this.paint(s),this.camera.projectionMatrix.fromArray(n.defaultProjectionData.mainMatrix).multiply(s.geographic),this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert(),this.renderer.resetState(),this.renderer.setViewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),this.renderer.render(this.scene,this.camera),this.renderer.resetState(),this.renderedAngles.bearing=r.bearing,this.renderedAngles.tilt=r.tilt,this.hasRenderedPose=!0},onRemove(){this.ready=!1;for(let t of[this.front,this.side,this.lineMaterial])t?.dispose();this.renderer?.dispose(),kd++}}}async function Wd(i,e=()=>{},t=()=>!0){let n=su;return i=Qn.get(i.key)||await Qn.prepare(i.model),new Promise((r,s)=>requestAnimationFrame(()=>{try{let a=yt();if(n!==su||!t()||!a.extrusionEnabled||yn()){r(!1);return}if(Qn.get(i.key)!==i){vn().queueRebuild(!1),r(!1);return}let o=cs!==i.key;e(),kt=i.mesh,cs=i.key,Qn.activate(i),tt.enter(),hn?.ready?o&&hn.replace(i):(hn=m_(a.map),a.map.addLayer(hn)),pr="",tt.retarget(),An(),vt(),sn&&(a.orientationMode=sn,sn=null,tt.start()),r(!0)}catch(a){s(a)}}))}async function g_(i=()=>!0){if(yn()){An(),vt();return}let e=yt();if(!e?.extrusionEnabled){hn&&_l(),us(""),vt();return}if(e.lastRenderMode!=="vector"||!e.lastLocalModel){rn()||us("This content uses a font image. Choose an outline font to enable extrusion."),vt();return}try{let t=await Qn.prepare(e.lastLocalModel);if(!i()||yn())return;cs!==t.key||!hn?.ready?await Wd(t,()=>{},i):(tt.retarget(),An(),vt())}catch(t){vl(t.message)}}function vl(i){pr=i,sn=null,vt();let e=yt(),t=e?.fontRecords.get(e.selectedFontId)?.name||"Selected font",n=e?.fontRecords.get(e.displayedFontId)?.name;us(rn()?`${t} cannot be shown in 3D: ${i}. Showing ${n||"previous font"}. Switch to 2D to preview the selected font.`:`3D unavailable: ${i}. Choose an outline font or switch to 2D.`,!0)}function lu(i,{manual:e=!0}={}){if(e&&vn().setModelMode)return Promise.resolve(vn().setModelMode(i)).catch(n=>{vl(n.message),vt()});let t=yt();t.extrusionEnabled=i,i&&t.extrusionDepthMeters==null&&(t.extrusionDepthMeters=Math.max(.1,Math.min(1e5,t.baseHeightMeters*t.relativeSize/1e3))),i||_l(),vt(),vn().queueRebuild(!1)}function ia(i){sn=null,tt.stop(i),vt()}function qi(){vn()?.notifyManualMapChange?vn().notifyManualMapChange():document.dispatchEvent(new CustomEvent("geoglyph:manual-map-change"))}function x_({freezePose:i=!0}={}){sn=null,tt.stop({freezePose:i}),tt.exit(),vt()}function Bd(i=yt().orientationMode){let e=yt();if(sn===i){sn=null,vt();return}if(tt.isRunning()&&e.orientationMode===i){tt.stop({freezePose:!0});return}if(e.orientationMode=i,!e.extrusionEnabled||!rn()){sn=i,tt.enter(),lu(!0,{manual:!1}),vt();return}tt.isRunning()?(tt.retarget(),An(),vt()):tt.start()}function __(i,e={}){let t=yt();return!t||!rn()?!1:(t.orientationMode=i,sn=null,tt.isRunning()?tt.retarget():tt.start(e),An(),vt(),!0)}function vt(){let i=yt();if(!i)return;mr();let e=yn()?.label()||i.fontRecords.get(i.displayedFontId)?.name,t=we("mapDisplayedFont");if(t){let s=e?"Font: "+e:"Font: Preparing\u2026";t.textContent!==s&&(t.textContent=s,t.title=s)}we("map3DEnabled")&&(we("map3DEnabled").checked=i.extrusionEnabled),we("mapMirrorX")&&(we("mapMirrorX").checked=i.mirrorX===!0),we("map3DControls")&&(we("map3DControls").hidden=!i.extrusionEnabled),we("map3DDepth")&&(we("map3DDepth").value=String(i.extrusionDepthMeters??Math.max(.1,i.baseHeightMeters*i.relativeSize/1e3))),we("map3DTilt")&&(we("map3DTilt").value=String(i.extrusionTilt)),we("map3DTiltValue")&&(we("map3DTiltValue").textContent=i.extrusionTilt+"\xB0"),we("map3DView")&&(we("map3DView").disabled=!rn()),we("map3DSolid")&&(we("map3DSolid").checked=i.extrusionSolid),we("map3DOrientation")&&(we("map3DOrientation").value=i.orientationMode),we("map3DOrbitPeriod")&&(we("map3DOrbitPeriod").value=String(i.orbitPeriodSeconds)),we("map3DOrbitPeriodValue")&&(we("map3DOrbitPeriodValue").textContent=i.orbitPeriodSeconds+" s / circle"),we("map3DOrbit")&&(we("map3DOrbit").disabled=!rn(),we("map3DOrbit").textContent=tt.isRunning()?"Stop orbit":"Start orbit",we("map3DOrbit").setAttribute("aria-pressed",String(tt.isRunning())));let n=rn()&&i.orientationMode!=="fixed";we("mapBearing")&&(we("mapBearing").disabled=n),we("map3DTilt")&&(we("map3DTilt").disabled=n&&i.orientationMode==="billboard"),we("mapOpacity")&&(we("mapOpacity").disabled=rn()&&i.extrusionSolid,we("mapOpacity").title=we("mapOpacity").disabled?"Solid model uses full opacity. Your 2D opacity is preserved.":""),we("map3DOrientationNote")&&(we("map3DOrientationNote").textContent=i.orientationMode==="fixed"?"Uses your text bearing and tilt.":i.orientationMode==="yaw"?"Bearing follows the camera; your tilt is preserved.":"Bearing and tilt follow the camera. Fixed mode restores your angles.");let r=we("mapQuickModel");r&&(r.setAttribute("aria-pressed",String(i.extrusionEnabled)),r.querySelector("span").textContent=i.extrusionEnabled?"3D":"2D",r.title=i.extrusionEnabled?"Switch model to 2D":"Switch model to 3D");for(let[s,a]of[["mapQuickOrbit","fixed"],["mapQuickTurn","yaw"],["mapQuickFace","billboard"]]){let o=we(s);if(!o)continue;let l=tt.isRunning()&&i.orientationMode===a;o.setAttribute("aria-pressed",String(l)),o.classList.toggle("is-running",l),o.setAttribute("aria-busy",String(sn===a)),o.title=(l?"Stop ":"Start ")+{fixed:"orbit",yaw:"orbit, turning toward the camera",billboard:"orbit, facing the camera square-on"}[a]}rn()&&!pr&&us(yn()?"Font morph \xB7 solid 3D":"Outline mesh \xB7 "+Math.round(kt.position.length/9).toLocaleString()+" triangles")}function v_(i={}){return vn().fit()}function y_(){if(we("map3DEnabled"))return!0;let i=yt(),e=we("geoglyphMapEditor")?.querySelector(".map-control-grid");if(!i||!e)return!1;let t=document.createElement("section");t.className="map-3d-panel",t.setAttribute("aria-label","3D text"),t.innerHTML=`<div class="map-3d-toggles"><label class="map-3d-toggle"><input id="map3DEnabled" class="map-switch" type="checkbox" role="switch"><span>3D extrusion</span></label>
      <label class="map-3d-toggle"><input id="mapMirrorX" type="checkbox"><span>Mirror horizontally</span></label>
      <label class="map-3d-toggle"><input id="map3DSolid" type="checkbox" checked><span>Solid model</span></label></div>
    <div id="map3DControls" hidden>
      <label class="map-field"><span>Depth</span><div class="map-number"><input id="map3DDepth" type="number" min="0.1" max="100000" step="0.1" value="30"><em>m</em></div></label>
      <label class="map-field map-3d-tilt"><span>Tilt <output id="map3DTiltValue" for="map3DTilt">90\xB0</output></span><input id="map3DTilt" type="range" min="0" max="90" step="1" value="90"><span class="map-3d-endpoints"><span>Flat</span><span>Upright</span></span></label>
      <button id="map3DView" class="map-action" type="button" disabled>View in 3D</button>
      <label class="map-field map-span-2"><span>Orientation</span><select id="map3DOrientation" aria-describedby="map3DOrientationNote"><option value="fixed">Fixed</option><option value="yaw">Turn toward camera</option><option value="billboard">Face camera square-on</option></select></label>
      <p id="map3DOrientationNote" class="map-3d-status map-span-2">Uses your text bearing and tilt.</p>
      <label class="map-field map-span-2"><span>Orbit speed <output id="map3DOrbitPeriodValue" for="map3DOrbitPeriod">30 s / circle</output></span><input id="map3DOrbitPeriod" type="range" min="10" max="120" step="1" value="30"><span class="map-3d-endpoints"><span>Faster</span><span>Slower</span></span></label>
      <button id="map3DOrbit" class="map-action" type="button" aria-pressed="false" disabled>Start orbit</button>
    </div><p id="map3DStatus" class="map-3d-status" role="status"></p>`,e.after(t),we("map3DEnabled").addEventListener("change",o=>lu(o.target.checked)),we("mapMirrorX").addEventListener("change",o=>{Promise.resolve(vn().setMirrorX(o.target.checked)).catch(l=>{vl(l.message),vt()})}),we("map3DSolid").addEventListener("change",o=>{qi(),i.extrusionSolid=o.target.checked,vt(),An()}),we("map3DOrientation").addEventListener("change",o=>{qi(),i.orientationMode=o.target.value,sn&&(sn=i.orientationMode),tt.retarget(),vt(),An()}),we("map3DOrbitPeriod").addEventListener("input",o=>{qi(),i.orbitPeriodSeconds=Math.max(10,Math.min(120,Number(o.target.value)||30)),vt()}),we("map3DOrbit").addEventListener("click",()=>{qi(),Bd()}),we("map3DDepth").addEventListener("input",o=>{let l=Number(o.target.value);!Number.isFinite(l)||l<.1||(qi(),ia({freezePose:!0}),i.extrusionDepthMeters=Math.min(1e5,l),An())}),we("map3DDepth").addEventListener("change",o=>{o.target.value=String(i.extrusionDepthMeters??30)}),we("map3DTilt").addEventListener("input",o=>{let l=Math.max(0,Math.min(90,Number(o.target.value)||0));qi(),ia({freezePose:!0}),i.extrusionTilt=l,An()}),we("map3DView").addEventListener("click",()=>{qi(),vn().fit()}),we("mapExportObjBtn").addEventListener("click",()=>Vd());for(let o of["geoglyph:ground-rendered","geoglyph:ground-style"])document.addEventListener(o,mr);let n=new Set(["mapMessage","mapHeight","mapRelativeSize","mapTracking","mapLineHeight","mapBearing","mapQuality","mapNativeColor"]);for(let o of["input","change"])document.addEventListener(o,l=>{n.has(l.target.id)&&ia({freezePose:!0})},!0);document.addEventListener("click",o=>{yt()?.previewActive&&o.target.closest?.("[data-map-mode],[data-code],.key-button[data-base]")&&ia({freezePose:!0})},!0);let r=document.createElement("div");r.className="map-motion-actions",r.setAttribute("aria-label","Model and animation shortcuts"),r.innerHTML=[["Model","box","model","2D"],["Orbit","orbit","orbit","Orbit"],["Turn","rotate-3d","turn","Turn"],["Face","scan-eye","face","Face"],["Random","shuffle","random","Random"]].map(([o,l,c,u])=>`<button id="mapQuick${o}" class="map-motion-action" data-accent="${c}" type="button" ${o==="Random"?'aria-label="Choose a random font"':'aria-pressed="false"'}>${ol[l]}<span>${u}</span></button>`).join(""),we("geoglyphMapEditor").querySelector(".map-mode-switch").before(r);let s=document.createElement("p");s.id="mapDisplayedFont",s.className="map-displayed-font",s.setAttribute("role","status"),s.setAttribute("aria-atomic","true"),r.after(s);let a=document.createElement("p");a.id="mapQuickStatus",a.className="map-compact-feedback",a.hidden=!0,a.setAttribute("role","status"),we("geoglyphMapEditor").after(a),we("mapQuickModel").setAttribute("aria-label","Toggle 2D or 3D model"),we("mapQuickRandom").title="Choose a random font; keep text and animation",we("mapQuickModel").addEventListener("click",()=>lu(!i.extrusionEnabled));for(let[o,l]of[["Orbit","fixed"],["Turn","yaw"],["Face","billboard"]])we("mapQuick"+o).addEventListener("click",()=>{qi(),Bd(l)});return we("mapQuickRandom").addEventListener("click",()=>vn().randomFont()),vt(),!0}window.GeoGlyph3D=Object.freeze({update:g_,prepare:Qn.prepare,cached:Qn.get,commit:Wd,failure:vl,notice:i=>{pr=i,us(i,!0)},preparing:i=>{pr="",us("Preparing "+i+"\u2026",!0),mr()},clear:_l,syncVisibility:An,isVisible:rn,refreshControls:vt,refreshExportControls:mr,exportOBJ:Vd,fit:v_,fitCurrent:tt.fit,startOrbit:tt.start,ensureOrbit:__,stopOrbit:ia,exitCamera:x_,pauseAnimation:tt.pause,morphPose:(i,e={})=>Hd(i,e.flat===!0,void 0,e.output),morphModeChanged:i=>{i?tt.enter():tt.exit(),An(),vt()},stats:()=>({visible:rn(),uploads:au,disposals:kd,bytes:kt?.bytes||0,triangles:(kt?.position.length||0)/9,lastError:pr,meshKey:cs,cache:Qn.stats(),animation:tt.stats()}),getBounds:()=>kt?.bounds||null});function zd(){let i=()=>y_()?(bd(),Od(),Fd(),!0):!1;if(i())return;let e=new MutationObserver(()=>{i()&&e.disconnect()});e.observe(document.body,{childList:!0,subtree:!0}),window.addEventListener("load",()=>{i()&&e.disconnect()},{once:!0})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",zd,{once:!0}):zd();window.addEventListener("pagehide",_l);window.addEventListener("pageshow",i=>{i.persisted&&yt()?.extrusionEnabled&&vn().queueRebuild(!1)});})();
