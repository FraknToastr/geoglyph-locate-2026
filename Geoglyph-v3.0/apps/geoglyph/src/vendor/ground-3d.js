(()=>{var df=Object.create;var Lu=Object.defineProperty;var ff=Object.getOwnPropertyDescriptor;var pf=Object.getOwnPropertyNames;var mf=Object.getPrototypeOf,gf=Object.prototype.hasOwnProperty;var Du=(i,e)=>()=>{try{return e||i((e={exports:{}}).exports,e),e.exports}catch(t){throw e=0,t}};var xf=(i,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of pf(e))!gf.call(i,r)&&r!==t&&Lu(i,r,{get:()=>e[r],enumerable:!(n=ff(e,r))||n.enumerable});return i};var Fu=(i,e,t)=>(t=i!=null?df(mf(i)):{},xf(e||!i||!i.__esModule?Lu(t,"default",{value:i,enumerable:!0}):t,i));var Bd=Du((GM,bl)=>{(function(i,e){let t=e();typeof bl=="object"&&bl.exports&&(bl.exports=t),i.GeoGlyphCameraFlight=t})(globalThis,function(){"use strict";let i=r=>r!==null&&typeof r=="object"&&!Array.isArray(r);function e(r,s,a,o){if(typeof r!="number"||!Number.isFinite(r)||r<a||r>o)throw Error(`${s} must be between ${a} and ${o}`);return r}function t(r,s="Camera view"){if(!i(r))throw Error(`${s} is required`);if(!Array.isArray(r.center)||r.center.length!==2)throw Error(`${s} centre must contain longitude and latitude`);return{center:[e(r.center[0],`${s} longitude`,-180,180),e(r.center[1],`${s} latitude`,-85.051129,85.051129)],zoom:e(r.zoom,`${s} zoom`,0,24),pitch:e(r.pitch,`${s} pitch`,0,85),bearing:e(r.bearing,`${s} bearing`,-360,360)}}function n(r){if(!i(r)||r.type!=="flight")throw Error("Choose a custom camera flight");return{type:"flight",start:t(r.start,"Start camera view"),end:t(r.end,"End camera view"),duration:e(r.duration,"Camera flight duration",.25,300)}}return Object.freeze({validateView:t,validateFlight:n})})});var Gd=Du((qM,wl)=>{(function(i,e){let t=e();typeof wl=="object"&&wl.exports&&(wl.exports=t),i.GeoGlyphMessageText=t})(globalThis,function(){"use strict";let i=new Intl.Segmenter(void 0,{granularity:"grapheme"});function e(a){return!a.includes("\uFE0E")&&(/\p{Emoji_Presentation}/u.test(a)||/^[#*0-9]\uFE0F?\u20E3$/u.test(a)||/[\uFE0F\u200D]/u.test(a)&&/\p{Extended_Pictographic}/u.test(a))}function t(a){let o=[];for(let{segment:l}of i.segment(String(a))){let c=e(l),u=o[o.length-1];u?.emoji===c?u.text+=l:o.push({text:l,emoji:c})}return o}function n(a){return t(a).some(o=>o.emoji)}function r(a,o,l=!1){return n(o)||!l&&!/[\p{Letter}\p{Number}]/u.test(o)&&!!(a?.hasColor||/emoji/i.test(a?.name||""))}function s(a,o,l,c){let u=0,d=0,h=0,f=0,_=0;return{parts:t(o||" ").map(g=>{let p=g.emoji?c:l;a.font=p;let b=a.measureText(g.text),P=u;return d=Math.max(d,(b.actualBoundingBoxLeft||0)-P),h=Math.max(h,P+(b.actualBoundingBoxRight||b.width)),f=Math.max(f,b.actualBoundingBoxAscent||0),_=Math.max(_,b.actualBoundingBoxDescent||0),u+=b.width,{...g,font:p,x:P}}),width:u,actualBoundingBoxLeft:d,actualBoundingBoxRight:h,actualBoundingBoxAscent:f,actualBoundingBoxDescent:_}}return Object.freeze({runs:t,hasEmoji:n,nativeColour:r,measureLine:s})})});/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var sh=0,uc=1,ah=2;var Xs=1,oh=2,Qr=3,Qn=0,Ot=1,Qt=2,Rn=0,es=1,hc=2,dc=3,fc=4,ho=5;var hr=100,lh=101,ch=102,uh=103,fo=104,hh=200,qs=201,dh=202,fh=203,pc=204,mc=205,ph=206,mh=207,gh=208,xh=209,_h=210,vh=211,yh=212,Sh=213,Mh=214,Fa=0,Na=1,Ua=2,Wr=3,Oa=4,Ba=5,za=6,ka=7,po=0,bh=1,wh=2,Gn=0,gc=1,xc=2,_c=3,vc=4,yc=5,Sc=6,Mc=7;var bc=300,$i=301,dr=302,mo=303,go=304,Ys=306,Ga=1e3,yn=1001,Va=1002,Pt=1003,Eh=1004;var $s=1005;var Lt=1006,xo=1007;var Zi=1008;var fn=1009,wc=1010,Ec=1011,ts=1012,_o=1013,Vn=1014,bn=1015,Hn=1016,vo=1017,yo=1018,ns=1020,Tc=35902,Ac=35899,Cc=1021,Rc=1022,Pn=1023,Zn=1026,Ji=1027,Pc=1028,So=1029,ei=1030,Mo=1031;var bo=1033,Zs=33776,Js=33777,Ks=33778,js=33779,wo=35840,Eo=35841,To=35842,Ao=35843,Co=36196,Ro=37492,Po=37496,Io=37488,Lo=37489,Qs=37490,Do=37491,Fo=37808,No=37809,Uo=37810,Oo=37811,Bo=37812,zo=37813,ko=37814,Go=37815,Vo=37816,Ho=37817,Wo=37818,Xo=37819,qo=37820,Yo=37821,$o=36492,Zo=36494,Jo=36495,Ko=36283,jo=36284,ea=36285,Qo=36286;var Ts=2300,Ha=2301,La=2302,ic=2303,rc=2400,sc=2401,ac=2402;var Th=3200;var el=0,Ah=1,bi="",vn="srgb",As="srgb-linear",Cs="linear",ot="srgb";var Da=7680;var Ch=519,Rh=512,Ph=513,Ih=514,tl=515,Lh=516,Dh=517,nl=518,Fh=519,Ic=35044;var is="300 es",zn=2e3,Xr=2001;function _f(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function vf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Nh(){let i=Rs("canvas");return i.style.display="block",i}var Nu={},qr=null;function Ps(...i){let e="THREE."+i.shift();qr?qr("log",e,...i):console.log(e,...i)}function Uh(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ue(...i){i=Uh(i);let e="THREE."+i.shift();if(qr)qr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Be(...i){i=Uh(i);let e="THREE."+i.shift();if(qr)qr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function lr(...i){let e=i.join(" ");e in Nu||(Nu[e]=!0,Ue(...i))}function Oh(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}var Bh={[Fa]:Na,[Ua]:za,[Oa]:ka,[Wr]:Ba,[Na]:Fa,[za]:Ua,[ka]:Oa,[Ba]:Wr},Jn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}},$t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Uu=1234567,ws=Math.PI/180,Yr=180/Math.PI;function _i(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return($t[i&255]+$t[i>>8&255]+$t[i>>16&255]+$t[i>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[t&63|128]+$t[t>>8&255]+"-"+$t[t>>16&255]+$t[t>>24&255]+$t[n&255]+$t[n>>8&255]+$t[n>>16&255]+$t[n>>24&255]).toLowerCase()}function He(i,e,t){return Math.max(e,Math.min(t,i))}function Lc(i,e){return(i%e+e)%e}function yf(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function Sf(i,e,t){return i!==e?(t-i)/(e-i):0}function Es(i,e,t){return(1-t)*i+t*e}function Mf(i,e,t,n){return Es(i,e,1-Math.exp(-t*n))}function bf(i,e=1){return e-Math.abs(Lc(i,e*2)-e)}function wf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ef(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Tf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Af(i,e){return i+Math.random()*(e-i)}function Cf(i){return i*(.5-Math.random())}function Rf(i){i!==void 0&&(Uu=i);let e=Uu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Pf(i){return i*ws}function If(i){return i*Yr}function Lf(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Df(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ff(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Nf(i,e,t,n,r){let s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),u=a((e+n)/2),d=s((e-n)/2),h=a((e-n)/2),f=s((n-e)/2),_=a((n-e)/2);switch(r){case"XYX":i.set(o*u,l*d,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*d,o*c);break;case"ZXZ":i.set(l*d,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*_,l*f,o*c);break;case"YXY":i.set(l*f,o*u,l*_,o*c);break;case"ZYZ":i.set(l*_,l*f,o*u,o*c);break;default:Ue("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Bn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ut(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Dc={DEG2RAD:ws,RAD2DEG:Yr,generateUUID:_i,clamp:He,euclideanModulo:Lc,mapLinear:yf,inverseLerp:Sf,lerp:Es,damp:Mf,pingpong:bf,smoothstep:wf,smootherstep:Ef,randInt:Tf,randFloat:Af,randFloatSpread:Cf,seededRandom:Rf,degToRad:Pf,radToDeg:If,isPowerOfTwo:Lf,ceilPowerOfTwo:Df,floorPowerOfTwo:Ff,setQuaternionFromProperEuler:Nf,normalize:ut,denormalize:Bn},We=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Kn=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let l=n[r+0],c=n[r+1],u=n[r+2],d=n[r+3],h=s[a+0],f=s[a+1],_=s[a+2],M=s[a+3];if(d!==M||l!==h||c!==f||u!==_){let g=l*h+c*f+u*_+d*M;g<0&&(h=-h,f=-f,_=-_,M=-M,g=-g);let p=1-o;if(g<.9995){let b=Math.acos(g),P=Math.sin(b);p=Math.sin(p*b)/P,o=Math.sin(o*b)/P,l=l*p+h*o,c=c*p+f*o,u=u*p+_*o,d=d*p+M*o}else{l=l*p+h*o,c=c*p+f*o,u=u*p+_*o,d=d*p+M*o;let b=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=b,c*=b,u*=b,d*=b}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,a){let o=n[r],l=n[r+1],c=n[r+2],u=n[r+3],d=s[a],h=s[a+1],f=s[a+2],_=s[a+3];return e[t]=o*_+u*d+l*f-c*h,e[t+1]=l*_+u*h+c*d-o*f,e[t+2]=c*_+u*f+o*h-l*d,e[t+3]=u*_-o*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(r/2),d=o(s/2),h=l(n/2),f=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=h*u*d+c*f*_,this._y=c*f*d-h*u*_,this._z=c*u*_+h*f*d,this._w=c*u*d-h*f*_;break;case"YXZ":this._x=h*u*d+c*f*_,this._y=c*f*d-h*u*_,this._z=c*u*_-h*f*d,this._w=c*u*d+h*f*_;break;case"ZXY":this._x=h*u*d-c*f*_,this._y=c*f*d+h*u*_,this._z=c*u*_+h*f*d,this._w=c*u*d-h*f*_;break;case"ZYX":this._x=h*u*d-c*f*_,this._y=c*f*d+h*u*_,this._z=c*u*_-h*f*d,this._w=c*u*d+h*f*_;break;case"YZX":this._x=h*u*d+c*f*_,this._y=c*f*d+h*u*_,this._z=c*u*_-h*f*d,this._w=c*u*d-h*f*_;break;case"XZY":this._x=h*u*d-c*f*_,this._y=c*f*d-h*u*_,this._z=c*u*_+h*f*d,this._w=c*u*d+h*f*_;break;default:Ue("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+o+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(a-r)*f}else if(n>o&&n>d){let f=2*Math.sqrt(1+n-o-d);this._w=(u-l)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+c)/f}else if(o>d){let f=2*Math.sqrt(1+o-n-d);this._w=(s-c)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-n-o);this._w=(a-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-r*o,this._w=a*u-n*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,s=-s,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ou.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ou.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*n),u=2*(o*t-s*r),d=2*(s*n-a*t);return this.x=t+l*c+a*d-o*u,this.y=n+l*u+o*c-s*d,this.z=r+l*d+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-n*l,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nl.copy(this).projectOnVector(e),this.sub(Nl)}reflect(e){return this.sub(Nl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Nl=new V,Ou=new Kn,Oe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c)}set(e,t,n,r,s,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],_=n[8],M=r[0],g=r[3],p=r[6],b=r[1],P=r[4],S=r[7],w=r[2],E=r[5],L=r[8];return s[0]=a*M+o*b+l*w,s[3]=a*g+o*P+l*E,s[6]=a*p+o*S+l*L,s[1]=c*M+u*b+d*w,s[4]=c*g+u*P+d*E,s[7]=c*p+u*S+d*L,s[2]=h*M+f*b+_*w,s[5]=h*g+f*P+_*E,s[8]=h*p+f*S+_*L,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+r*s*c-r*a*l}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=u*a-o*c,h=o*l-u*s,f=c*s-a*l,_=t*d+n*h+r*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/_;return e[0]=d*M,e[1]=(r*c-u*n)*M,e[2]=(o*n-r*a)*M,e[3]=h*M,e[4]=(u*t-r*l)*M,e[5]=(r*s-o*t)*M,e[6]=f*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*s)*M,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return lr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ul.makeScale(e,t)),this}rotate(e){return lr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ul.makeRotation(-e)),this}translate(e,t){return lr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ul.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ul=new Oe,Bu=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zu=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uf(){let i={enabled:!0,workingColorSpace:As,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ot&&(r.r=vi(r.r),r.g=vi(r.g),r.b=vi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(r.r=Hr(r.r),r.g=Hr(r.g),r.b=Hr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===bi?Cs:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return lr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return lr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[As]:{primaries:e,whitePoint:n,transfer:Cs,toXYZ:Bu,fromXYZ:zu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:vn},outputColorSpaceConfig:{drawingBufferColorSpace:vn}},[vn]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:Bu,fromXYZ:zu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:vn}}}),i}var Je=Uf();function vi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Hr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Cr,Wa=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Cr===void 0&&(Cr=Rs("canvas")),Cr.width=e.width,Cr.height=e.height;let r=Cr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),n=Cr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Rs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=vi(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(vi(t[n]/255)*255):t[n]=vi(t[n]);return{data:t,width:e.width,height:e.height}}else return Ue("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Of=0,$r=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=_i(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ol(r[a].image)):s.push(Ol(r[a]))}else s=Ol(r);n.url=s}return t||(e.images[this.uuid]=n),n}};function Ol(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ue("Texture: Unable to serialize Texture."),{})}var Bf=0,Bl=new V,hn=class i extends Jn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=yn,r=yn,s=Lt,a=Zi,o=Pn,l=fn,c=i.DEFAULT_ANISOTROPY,u=bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bf++}),this.uuid=_i(),this.name="",this.source=new $r(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Bl).x}get height(){return this.source.getSize(Bl).y}get depth(){return this.source.getSize(Bl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ue(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ue(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==bc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ga:e.x=e.x-Math.floor(e.x);break;case yn:e.x=e.x<0?0:1;break;case Va:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ga:e.y=e.y-Math.floor(e.y);break;case yn:e.y=e.y<0?0:1;break;case Va:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=bc;hn.DEFAULT_ANISOTROPY=1;var Ke=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],_=l[9],M=l[2],g=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-M)<.01&&Math.abs(_-g)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+M)<.1&&Math.abs(_+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let P=(c+1)/2,S=(f+1)/2,w=(p+1)/2,E=(u+h)/4,L=(d+M)/4,m=(_+g)/4;return P>S&&P>w?P<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(P),r=E/n,s=L/n):S>w?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=E/r,s=m/r):w<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),n=L/s,r=m/s),this.set(n,r,s,t),this}let b=Math.sqrt((g-_)*(g-_)+(d-M)*(d-M)+(h-u)*(h-u));return Math.abs(b)<.001&&(b=1),this.x=(g-_)/b,this.y=(d-M)/b,this.z=(h-u)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Xa=class extends Jn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Lt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ke(0,0,e,t),this.scissorTest=!1,this.viewport=new Ke(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:n.depth},s=new hn(r),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Lt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new $r(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},jt=class extends Xa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Is=class extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var qa=class extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pt,this.minFilter=Pt,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var ke=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,r,s,a,o,l,c,u,d,h,f,_,M,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,l,c,u,d,h,f,_,M,g)}set(e,t,n,r,s,a,o,l,c,u,d,h,f,_,M,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=_,p[11]=M,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Rr.setFromMatrixColumn(e,0).length(),s=1/Rr.setFromMatrixColumn(e,1).length(),a=1/Rr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let h=a*u,f=a*d,_=o*u,M=o*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+_*c,t[5]=h-M*c,t[9]=-o*l,t[2]=M-h*c,t[6]=_+f*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*u,f=l*d,_=c*u,M=c*d;t[0]=h+M*o,t[4]=_*o-f,t[8]=a*c,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=f*o-_,t[6]=M+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*u,f=l*d,_=c*u,M=c*d;t[0]=h-M*o,t[4]=-a*d,t[8]=_+f*o,t[1]=f+_*o,t[5]=a*u,t[9]=M-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*u,f=a*d,_=o*u,M=o*d;t[0]=l*u,t[4]=_*c-f,t[8]=h*c+M,t[1]=l*d,t[5]=M*c+h,t[9]=f*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,f=a*c,_=o*l,M=o*c;t[0]=l*u,t[4]=M-h*d,t[8]=_*d+f,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*d+_,t[10]=h-M*d}else if(e.order==="XZY"){let h=a*l,f=a*c,_=o*l,M=o*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+M,t[5]=a*u,t[9]=f*d-_,t[2]=_*d-f,t[6]=o*u,t[10]=M*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zf,e,kf)}lookAt(e,t,n){let r=this.elements;return xn.subVectors(e,t),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Fi.crossVectors(n,xn),Fi.lengthSq()===0&&(Math.abs(n.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Fi.crossVectors(n,xn)),Fi.normalize(),da.crossVectors(xn,Fi),r[0]=Fi.x,r[4]=da.x,r[8]=xn.x,r[1]=Fi.y,r[5]=da.y,r[9]=xn.y,r[2]=Fi.z,r[6]=da.z,r[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],_=n[2],M=n[6],g=n[10],p=n[14],b=n[3],P=n[7],S=n[11],w=n[15],E=r[0],L=r[4],m=r[8],y=r[12],R=r[1],I=r[5],F=r[9],D=r[13],A=r[2],U=r[6],Z=r[10],K=r[14],ne=r[3],N=r[7],W=r[11],C=r[15];return s[0]=a*E+o*R+l*A+c*ne,s[4]=a*L+o*I+l*U+c*N,s[8]=a*m+o*F+l*Z+c*W,s[12]=a*y+o*D+l*K+c*C,s[1]=u*E+d*R+h*A+f*ne,s[5]=u*L+d*I+h*U+f*N,s[9]=u*m+d*F+h*Z+f*W,s[13]=u*y+d*D+h*K+f*C,s[2]=_*E+M*R+g*A+p*ne,s[6]=_*L+M*I+g*U+p*N,s[10]=_*m+M*F+g*Z+p*W,s[14]=_*y+M*D+g*K+p*C,s[3]=b*E+P*R+S*A+w*ne,s[7]=b*L+P*I+S*U+w*N,s[11]=b*m+P*F+S*Z+w*W,s[15]=b*y+P*D+S*K+w*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],_=e[3],M=e[7],g=e[11],p=e[15],b=l*f-c*h,P=o*f-c*d,S=o*h-l*d,w=a*f-c*u,E=a*h-l*u,L=a*d-o*u;return t*(M*b-g*P+p*S)-n*(_*b-g*w+p*E)+r*(_*P-M*w+p*L)-s*(_*S-M*E+g*L)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(s*u-o*l)+r*(s*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],_=e[12],M=e[13],g=e[14],p=e[15],b=t*o-n*a,P=t*l-r*a,S=t*c-s*a,w=n*l-r*o,E=n*c-s*o,L=r*c-s*l,m=u*M-d*_,y=u*g-h*_,R=u*p-f*_,I=d*g-h*M,F=d*p-f*M,D=h*p-f*g,A=b*D-P*F+S*I+w*R-E*y+L*m;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/A;return e[0]=(o*D-l*F+c*I)*U,e[1]=(r*F-n*D-s*I)*U,e[2]=(M*L-g*E+p*w)*U,e[3]=(h*E-d*L-f*w)*U,e[4]=(l*R-a*D-c*y)*U,e[5]=(t*D-r*R+s*y)*U,e[6]=(g*S-_*L-p*P)*U,e[7]=(u*L-h*S+f*P)*U,e[8]=(a*F-o*R+c*m)*U,e[9]=(n*R-t*F-s*m)*U,e[10]=(_*E-M*S+p*b)*U,e[11]=(d*S-u*E-f*b)*U,e[12]=(o*y-a*I-l*m)*U,e[13]=(t*I-n*y+r*m)*U,e[14]=(M*P-_*w-g*b)*U,e[15]=(u*w-d*P+h*b)*U,this}scale(e){let t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+n,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,d=o+o,h=s*c,f=s*u,_=s*d,M=a*u,g=a*d,p=o*d,b=l*c,P=l*u,S=l*d,w=n.x,E=n.y,L=n.z;return r[0]=(1-(M+p))*w,r[1]=(f+S)*w,r[2]=(_-P)*w,r[3]=0,r[4]=(f-S)*E,r[5]=(1-(h+p))*E,r[6]=(g+b)*E,r[7]=0,r[8]=(_+P)*L,r[9]=(g-b)*L,r[10]=(1-(h+M))*L,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let a=Rr.set(r[0],r[1],r[2]).length(),o=Rr.set(r[4],r[5],r[6]).length(),l=Rr.set(r[8],r[9],r[10]).length();s<0&&(a=-a),Fn.copy(this);let c=1/a,u=1/o,d=1/l;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=u,Fn.elements[5]*=u,Fn.elements[6]*=u,Fn.elements[8]*=d,Fn.elements[9]*=d,Fn.elements[10]*=d,t.setFromRotationMatrix(Fn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,r,s,a,o=zn,l=!1){let c=this.elements,u=2*s/(t-e),d=2*s/(n-r),h=(t+e)/(t-e),f=(n+r)/(n-r),_,M;if(l)_=s/(a-s),M=a*s/(a-s);else if(o===zn)_=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(o===Xr)_=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=zn,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-r),h=-(t+e)/(t-e),f=-(n+r)/(n-r),_,M;if(l)_=1/(a-s),M=a/(a-s);else if(o===zn)_=-2/(a-s),M=-(a+s)/(a-s);else if(o===Xr)_=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Rr=new V,Fn=new ke,zf=new V(0,0,0),kf=new V(1,1,1),Fi=new V,da=new V,xn=new V,ku=new ke,Gu=new Kn,yi=class i{constructor(e=0,t=0,n=0,r=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],d=r[2],h=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-He(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ue("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ku.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ku,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gu.setFromEuler(this),this.setFromQuaternion(Gu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};yi.DEFAULT_ORDER="XYZ";var Ls=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Gf=0,Vu=new V,Pr=new Kn,di=new ke,fa=new V,ys=new V,Vf=new V,Hf=new Kn,Hu=new V(1,0,0),Wu=new V(0,1,0),Xu=new V(0,0,1),qu={type:"added"},Wf={type:"removed"},Ir={type:"childadded",child:null},zl={type:"childremoved",child:null},rn=class i extends Jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=_i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new V,t=new yi,n=new Kn,r=new V(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ke},normalMatrix:{value:new Oe}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ls,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Pr.setFromAxisAngle(e,t),this.quaternion.multiply(Pr),this}rotateOnWorldAxis(e,t){return Pr.setFromAxisAngle(e,t),this.quaternion.premultiply(Pr),this}rotateX(e){return this.rotateOnAxis(Hu,e)}rotateY(e){return this.rotateOnAxis(Wu,e)}rotateZ(e){return this.rotateOnAxis(Xu,e)}translateOnAxis(e,t){return Vu.copy(e).applyQuaternion(this.quaternion),this.position.add(Vu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hu,e)}translateY(e){return this.translateOnAxis(Wu,e)}translateZ(e){return this.translateOnAxis(Xu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fa.copy(e):fa.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(ys,fa,this.up):di.lookAt(fa,ys,this.up),this.quaternion.setFromRotationMatrix(di),r&&(di.extractRotation(r.matrixWorld),Pr.setFromRotationMatrix(di),this.quaternion.premultiply(Pr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Be("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qu),Ir.child=e,this.dispatchEvent(Ir),Ir.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wf),zl.child=e,this.dispatchEvent(zl),zl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qu),Ir.child=e,this.dispatchEvent(Ir),Ir.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,e,Vf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,Hf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*r,s[13]+=n-s[1]*t-s[5]*n-s[9]*r,s[14]+=r-s[2]*t-s[6]*n-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),d=a(e.shapes),h=a(e.skeletons),f=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),_.length>0&&(n.nodes=_)}return n.object=r,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let r=e.children[n];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};rn.DEFAULT_UP=new V(0,1,0);rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var xi=class extends rn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Xf={type:"move"},Zr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let M of e.hand.values()){let g=t.getJointPose(M,n),p=this._getHandJoint(c,M);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,_=.005;c.inputState.pinching&&h>f+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Xf)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new xi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ni={h:0,s:0,l:0},pa={h:0,s:0,l:0};function kl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var qe=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=vn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=n,Je.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Je.workingColorSpace){if(e=Lc(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=kl(a,s,e+1/3),this.g=kl(a,s,e),this.b=kl(a,s,e-1/3)}return Je.colorSpaceToWorking(this,r),this}setStyle(e,t=vn){function n(s){s!==void 0&&parseFloat(s)<1&&Ue("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ue("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Ue("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=vn){let n=zh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ue("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vi(e.r),this.g=vi(e.g),this.b=vi(e.b),this}copyLinearToSRGB(e){return this.r=Hr(e.r),this.g=Hr(e.g),this.b=Hr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=vn){return Je.workingToColorSpace(Zt.copy(this),e),Math.round(He(Zt.r*255,0,255))*65536+Math.round(He(Zt.g*255,0,255))*256+Math.round(He(Zt.b*255,0,255))}getHexString(e=vn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(Zt.copy(this),t);let n=Zt.r,r=Zt.g,s=Zt.b,a=Math.max(n,r,s),o=Math.min(n,r,s),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=u<=.5?d/(a+o):d/(2-a-o),a){case n:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-n)/d+2;break;case s:l=(n-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=vn){Je.workingToColorSpace(Zt.copy(this),e);let t=Zt.r,n=Zt.g,r=Zt.b;return e!==vn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Ni),this.setHSL(Ni.h+e,Ni.s+t,Ni.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ni),e.getHSL(pa);let n=Es(Ni.h,pa.h,t),r=Es(Ni.s,pa.s,t),s=Es(Ni.l,pa.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Zt=new qe;qe.NAMES=zh;var Si=class extends rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yi,this.environmentIntensity=1,this.environmentRotation=new yi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Nn=new V,fi=new V,Gl=new V,pi=new V,Lr=new V,Dr=new V,Yu=new V,Vl=new V,Hl=new V,Wl=new V,Xl=new Ke,ql=new Ke,Yl=new Ke,zi=class i{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Nn.subVectors(e,t),r.cross(Nn);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){Nn.subVectors(r,t),fi.subVectors(n,t),Gl.subVectors(e,t);let a=Nn.dot(Nn),o=Nn.dot(fi),l=Nn.dot(Gl),c=fi.dot(fi),u=fi.dot(Gl),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;let h=1/d,f=(c*l-o*u)*h,_=(a*u-o*l)*h;return s.set(1-f-_,_,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,t,n,r,s,a,o,l){return this.getBarycoord(e,t,n,r,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pi.x),l.addScaledVector(a,pi.y),l.addScaledVector(o,pi.z),l)}static getInterpolatedAttribute(e,t,n,r,s,a){return Xl.setScalar(0),ql.setScalar(0),Yl.setScalar(0),Xl.fromBufferAttribute(e,t),ql.fromBufferAttribute(e,n),Yl.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Xl,s.x),a.addScaledVector(ql,s.y),a.addScaledVector(Yl,s.z),a}static isFrontFacing(e,t,n,r){return Nn.subVectors(n,t),fi.subVectors(e,t),Nn.cross(fi).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),Nn.cross(fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return i.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,s=this.c,a,o;Lr.subVectors(r,n),Dr.subVectors(s,n),Vl.subVectors(e,n);let l=Lr.dot(Vl),c=Dr.dot(Vl);if(l<=0&&c<=0)return t.copy(n);Hl.subVectors(e,r);let u=Lr.dot(Hl),d=Dr.dot(Hl);if(u>=0&&d<=u)return t.copy(r);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Lr,a);Wl.subVectors(e,s);let f=Lr.dot(Wl),_=Dr.dot(Wl);if(_>=0&&f<=_)return t.copy(s);let M=f*c-l*_;if(M<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(Dr,o);let g=u*_-f*d;if(g<=0&&d-u>=0&&f-_>=0)return Yu.subVectors(s,r),o=(d-u)/(d-u+(f-_)),t.copy(r).addScaledVector(Yu,o);let p=1/(g+M+h);return a=M*p,o=h*p,t.copy(n).addScaledVector(Lr,a).addScaledVector(Dr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Sn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Un):Un.fromBufferAttribute(s,a),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ma.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ma.copy(n.boundingBox)),ma.applyMatrix4(e.matrixWorld),this.union(ma)}let r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ss),ga.subVectors(this.max,Ss),Fr.subVectors(e.a,Ss),Nr.subVectors(e.b,Ss),Ur.subVectors(e.c,Ss),Ui.subVectors(Nr,Fr),Oi.subVectors(Ur,Nr),rr.subVectors(Fr,Ur);let t=[0,-Ui.z,Ui.y,0,-Oi.z,Oi.y,0,-rr.z,rr.y,Ui.z,0,-Ui.x,Oi.z,0,-Oi.x,rr.z,0,-rr.x,-Ui.y,Ui.x,0,-Oi.y,Oi.x,0,-rr.y,rr.x,0];return!$l(t,Fr,Nr,Ur,ga)||(t=[1,0,0,0,1,0,0,0,1],!$l(t,Fr,Nr,Ur,ga))?!1:(xa.crossVectors(Ui,Oi),t=[xa.x,xa.y,xa.z],$l(t,Fr,Nr,Ur,ga))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},mi=[new V,new V,new V,new V,new V,new V,new V,new V],Un=new V,ma=new Sn,Fr=new V,Nr=new V,Ur=new V,Ui=new V,Oi=new V,rr=new V,Ss=new V,ga=new V,xa=new V,sr=new V;function $l(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){sr.fromArray(i,s);let o=r.x*Math.abs(sr.x)+r.y*Math.abs(sr.y)+r.z*Math.abs(sr.z),l=e.dot(sr),c=t.dot(sr),u=n.dot(sr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Rt=new V,_a=new We,qf=0,Jt=class extends Jn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ic,this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)_a.fromBufferAttribute(this,t),_a.applyMatrix3(e),this.setXY(t,_a.x,_a.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),r=ut(r,this.array),s=ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Ds=class extends Jt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Fs=class extends Jt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Kt=class extends Jt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Yf=new Sn,Ms=new V,Zl=new V,jn=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Yf.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ms.subVectors(e,this.center);let t=Ms.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Ms,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ms.copy(e.center).add(Zl)),this.expandByPoint(Ms.copy(e.center).sub(Zl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},$f=0,Cn=new ke,Jl=new rn,Or=new V,_n=new Sn,bs=new Sn,Ut=new V,dn=class i extends Jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=_i(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_f(e)?Fs:Ds)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Oe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return Jl.lookAt(e),Jl.updateMatrix(),this.applyMatrix4(Jl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Or).negate(),this.translate(Or.x,Or.y,Or.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let r=0,s=e.length;r<s;r++){let a=e[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Kt(n,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ue("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){let s=t[n];_n.setFromBufferAttribute(s),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(_n.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){let o=t[s];bs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(_n.min,bs.min),_n.expandByPoint(Ut),Ut.addVectors(_n.max,bs.max),_n.expandByPoint(Ut)):(_n.expandByPoint(bs.min),_n.expandByPoint(bs.max))}_n.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)Ut.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(Ut));if(t)for(let s=0,a=t.length;s<a;s++){let o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ut.fromBufferAttribute(o,c),l&&(Or.fromBufferAttribute(e,c),Ut.add(Or)),r=Math.max(r,n.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,r=t.normal,s=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Jt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let m=0;m<n.count;m++)o[m]=new V,l[m]=new V;let c=new V,u=new V,d=new V,h=new We,f=new We,_=new We,M=new V,g=new V;function p(m,y,R){c.fromBufferAttribute(n,m),u.fromBufferAttribute(n,y),d.fromBufferAttribute(n,R),h.fromBufferAttribute(s,m),f.fromBufferAttribute(s,y),_.fromBufferAttribute(s,R),u.sub(c),d.sub(c),f.sub(h),_.sub(h);let I=1/(f.x*_.y-_.x*f.y);isFinite(I)&&(M.copy(u).multiplyScalar(_.y).addScaledVector(d,-f.y).multiplyScalar(I),g.copy(d).multiplyScalar(f.x).addScaledVector(u,-_.x).multiplyScalar(I),o[m].add(M),o[y].add(M),o[R].add(M),l[m].add(g),l[y].add(g),l[R].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let m=0,y=b.length;m<y;++m){let R=b[m],I=R.start,F=R.count;for(let D=I,A=I+F;D<A;D+=3)p(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let P=new V,S=new V,w=new V,E=new V;function L(m){w.fromBufferAttribute(r,m),E.copy(w);let y=o[m];P.copy(y),P.sub(w.multiplyScalar(w.dot(y))).normalize(),S.crossVectors(E,y);let I=S.dot(l[m])<0?-1:1;a.setXYZW(m,P.x,P.y,P.z,I)}for(let m=0,y=b.length;m<y;++m){let R=b[m],I=R.start,F=R.count;for(let D=I,A=I+F;D<A;D+=3)L(e.getX(D+0)),L(e.getX(D+1)),L(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let r=new V,s=new V,a=new V,o=new V,l=new V,c=new V,u=new V,d=new V;if(e)for(let h=0,f=e.count;h<f;h+=3){let _=e.getX(h+0),M=e.getX(h+1),g=e.getX(h+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,M),a.fromBufferAttribute(t,g),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,g),o.add(u),l.add(u),c.add(u),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,d=o.normalized,h=new c.constructor(l.length*u),f=0,_=0;for(let M=0,g=l.length;M<g;M++){o.isInterleavedBufferAttribute?f=l[M]*o.data.stride+o.offset:f=l[M]*u;for(let p=0;p<u;p++)h[_++]=c[f++]}return new Jt(h,u,d)}if(this.index===null)return Ue("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,r=this.attributes;for(let o in r){let l=r[o],c=e(l,n);t.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],d=s[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ya=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ic,this.updateRanges=[],this.version=0,this.uuid=_i()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_i()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_i()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},nn=new V,kn=class i{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),r=ut(r,this.array),s=ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Ps("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Jt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ps("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Kl=new V,Zf=new V,Jf=new Oe,On=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Kl.subVectors(n,t).cross(Zf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Kl),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Jf.getNormalMatrix(e),r=this.coplanarPoint(Kl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Kf=0,ki=class extends Jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=_i(),this.name="",this.type="Material",this.blending=es,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=pc,this.blendDst=mc,this.blendEquation=hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Wr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ch,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Da,this.stencilZFail=Da,this.stencilZPass=Da,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ue(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ue(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(t){let s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new qe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new On().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new We().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new We().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var gi=new V,jl=new V,va=new V,ya=new V,$a=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gi.copy(this.origin).addScaledVector(this.direction,t),gi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){jl.copy(e).add(t).multiplyScalar(.5),va.copy(t).sub(e).normalize(),ya.copy(this.origin).sub(jl);let s=e.distanceTo(t)*.5,a=-this.direction.dot(va),o=ya.dot(this.direction),l=-ya.dot(va),c=ya.lengthSq(),u=Math.abs(1-a*a),d,h,f,_;if(u>0)if(d=a*l-o,h=a*o-l,_=s*u,d>=0)if(h>=-_)if(h<=_){let M=1/u;d*=M,h*=M,f=d*(d+a*h+2*o)+h*(a*d+h+2*l)+c}else h=s,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h=-s,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;else h<=-_?(d=Math.max(0,-(-a*s+o)),h=d>0?-s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c):h<=_?(d=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(d=Math.max(0,-(a*s+o)),h=d>0?s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c);else h=a>0?-s:s,d=Math.max(0,-(a*h+o)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(jl).addScaledVector(va,h),f}intersectSphere(e,t){if(e.radius<0)return null;gi.subVectors(e.center,this.origin);let n=gi.dot(this.direction),r=gi.dot(gi)-n*n,s=e.radius*e.radius;if(r>s)return null;let a=Math.sqrt(s-r),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(o=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||o>r)||((o>n||n!==n)&&(n=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,gi)!==null}intersectTriangle(e,t,n,r,s){let a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,d=e.x-a.x,h=e.y-a.y,f=e.z-a.z,_=t.x-a.x,M=t.y-a.y,g=t.z-a.z,p=n.x-a.x,b=n.y-a.y,P=n.z-a.z,S=Math.abs(l),w=Math.abs(c),E=Math.abs(u),L,m,y,R,I,F,D,A,U,Z,K,ne;if(S>=w&&S>=E?(y=l,F=d,U=_,ne=p,l>=0?(L=c,m=u,R=h,I=f,D=M,A=g,Z=b,K=P):(L=u,m=c,R=f,I=h,D=g,A=M,Z=P,K=b)):w>=E?(y=c,F=h,U=M,ne=b,c>=0?(L=u,m=l,R=f,I=d,D=g,A=_,Z=P,K=p):(L=l,m=u,R=d,I=f,D=_,A=g,Z=p,K=P)):(y=u,F=f,U=g,ne=P,u>=0?(L=l,m=c,R=d,I=h,D=_,A=M,Z=p,K=b):(L=c,m=l,R=h,I=d,D=M,A=_,Z=b,K=p)),y===0)return null;let N=L/y,W=m/y,C=1/y,Y=R-N*F,te=I-W*F,xe=D-N*U,ce=A-W*U,le=Z-N*ne,H=K-W*ne,O=le*ce-H*xe,j=Y*H-te*le,se=xe*te-ce*Y;if(r){if(O<0||j<0||se<0)return null}else if((O<0||j<0||se<0)&&(O>0||j>0||se>0))return null;let oe=O+j+se;if(oe===0)return null;let Ae=C*(O*F+j*U+se*ne);return(oe>0?Ae<0:Ae>0)?null:this.at(Ae/oe,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},cr=class extends ki{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=po,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},$u=new ke,ar=new $a,Sa=new jn,Zu=new V,Ma=new V,ba=new V,wa=new V,Ql=new V,Ea=new V,Ju=new V,Ta=new V,Dt=class extends rn{constructor(e=new dn,t=new cr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){let o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(s&&o){Ea.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=o[l],d=s[l];u!==0&&(Ql.fromBufferAttribute(d,e),a?Ea.addScaledVector(Ql,u):Ea.addScaledVector(Ql.sub(t),u))}t.add(Ea)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Sa.copy(n.boundingSphere),Sa.applyMatrix4(s),ar.copy(e.ray).recast(e.near),!(Sa.containsPoint(ar.origin)===!1&&(ar.intersectSphere(Sa,Zu)===null||ar.origin.distanceToSquared(Zu)>(e.far-e.near)**2))&&($u.copy(s).invert(),ar.copy(e.ray).applyMatrix4($u),!(n.boundingBox!==null&&ar.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ar)))}_computeIntersections(e,t,n){let r,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,M=h.length;_<M;_++){let g=h[_],p=a[g.materialIndex],b=Math.max(g.start,f.start),P=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let S=b,w=P;S<w;S+=3){let E=o.getX(S),L=o.getX(S+1),m=o.getX(S+2);r=Aa(this,p,e,n,c,u,d,E,L,m),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{let _=Math.max(0,f.start),M=Math.min(o.count,f.start+f.count);for(let g=_,p=M;g<p;g+=3){let b=o.getX(g),P=o.getX(g+1),S=o.getX(g+2);r=Aa(this,a,e,n,c,u,d,b,P,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,M=h.length;_<M;_++){let g=h[_],p=a[g.materialIndex],b=Math.max(g.start,f.start),P=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let S=b,w=P;S<w;S+=3){let E=S,L=S+1,m=S+2;r=Aa(this,p,e,n,c,u,d,E,L,m),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{let _=Math.max(0,f.start),M=Math.min(l.count,f.start+f.count);for(let g=_,p=M;g<p;g+=3){let b=g,P=g+1,S=g+2;r=Aa(this,a,e,n,c,u,d,b,P,S),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}};function jf(i,e,t,n,r,s,a,o){let l;if(e.side===Ot?l=n.intersectTriangle(a,s,r,!0,o):l=n.intersectTriangle(r,s,a,e.side===Qn,o),l===null)return null;Ta.copy(o),Ta.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ta);return c<t.near||c>t.far?null:{distance:c,point:Ta.clone(),object:i}}function Aa(i,e,t,n,r,s,a,o,l,c){i.getVertexPosition(o,Ma),i.getVertexPosition(l,ba),i.getVertexPosition(c,wa);let u=jf(i,e,t,n,Ma,ba,wa,Ju);if(u){let d=new V;zi.getBarycoord(Ju,Ma,ba,wa,d),r&&(u.uv=zi.getInterpolatedAttribute(r,o,l,c,d,new We)),s&&(u.uv1=zi.getInterpolatedAttribute(s,o,l,c,d,new We)),a&&(u.normal=zi.getInterpolatedAttribute(a,o,l,c,d,new V),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new V,materialIndex:0};zi.getNormal(Ma,ba,wa,h.normal),u.face=h,u.barycoord=d}return u}var Jr=class extends hn{constructor(e=null,t=1,n=1,r,s,a,o,l,c=Pt,u=Pt,d,h){super(null,a,o,l,c,u,r,s,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var or=new jn,Qf=new We(.5,.5),Ca=new V,Kr=class{constructor(e=new On,t=new On,n=new On,r=new On,s=new On,a=new On){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){let r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],d=s[5],h=s[6],f=s[7],_=s[8],M=s[9],g=s[10],p=s[11],b=s[12],P=s[13],S=s[14],w=s[15];if(r[0].setComponents(c-a,f-u,p-_,w-b).normalize(),r[1].setComponents(c+a,f+u,p+_,w+b).normalize(),r[2].setComponents(c+o,f+d,p+M,w+P).normalize(),r[3].setComponents(c-o,f-d,p-M,w-P).normalize(),n)r[4].setComponents(l,h,g,S).normalize(),r[5].setComponents(c-l,f-h,p-g,w-S).normalize();else if(r[4].setComponents(c-l,f-h,p-g,w-S).normalize(),t===zn)r[5].setComponents(c+l,f+h,p+g,w+S).normalize();else if(t===Xr)r[5].setComponents(l,h,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),or.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),or.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(or)}intersectsSprite(e){or.center.set(0,0,0);let t=Qf.distanceTo(e.center);return or.radius=.7071067811865476+t,or.applyMatrix4(e.matrixWorld),this.intersectsSphere(or)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ca.x=r.normal.x>0?e.max.x:e.min.x,Ca.y=r.normal.y>0?e.max.y:e.min.y,Ca.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ca)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ns=class extends hn{constructor(e=[],t=$i,n,r,s,a,o,l,c,u){super(e,t,n,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}};var Gi=class extends hn{constructor(e,t,n=Vn,r,s,a,o=Pt,l=Pt,c,u=Zn,d=1){if(u!==Zn&&u!==Ji)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,r,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $r(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Za=class extends Gi{constructor(e,t=Vn,n=$i,r,s,a=Pt,o=Pt,l,c=Zn){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,s,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Us=class extends hn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Vi=class i extends dn{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};let o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],u=[],d=[],h=0,f=0;_("z","y","x",-1,-1,n,t,e,a,s,0),_("z","y","x",1,-1,n,t,-e,a,s,1),_("x","z","y",1,1,e,n,t,r,a,2),_("x","z","y",1,-1,e,n,-t,r,a,3),_("x","y","z",1,-1,e,t,n,r,s,4),_("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(u,3)),this.setAttribute("uv",new Kt(d,2));function _(M,g,p,b,P,S,w,E,L,m,y){let R=S/L,I=w/m,F=S/2,D=w/2,A=E/2,U=L+1,Z=m+1,K=0,ne=0,N=new V;for(let W=0;W<Z;W++){let C=W*I-D;for(let Y=0;Y<U;Y++){let te=Y*R-F;N[M]=te*b,N[g]=C*P,N[p]=A,c.push(N.x,N.y,N.z),N[M]=0,N[g]=0,N[p]=E>0?1:-1,u.push(N.x,N.y,N.z),d.push(Y/L),d.push(1-W/m),K+=1}}for(let W=0;W<m;W++)for(let C=0;C<L;C++){let Y=h+C+U*W,te=h+C+U*(W+1),xe=h+(C+1)+U*(W+1),ce=h+(C+1)+U*W;l.push(Y,te,ce),l.push(te,xe,ce),ne+=6}o.addGroup(f,ne,y),f+=ne,h+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Hi=class i extends dn{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(r),c=o+1,u=l+1,d=e/o,h=t/l,f=[],_=[],M=[],g=[];for(let p=0;p<u;p++){let b=p*h-a;for(let P=0;P<c;P++){let S=P*d-s;_.push(S,-b,0),M.push(0,0,1),g.push(P/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){let P=b+c*p,S=b+c*(p+1),w=b+1+c*(p+1),E=b+1+c*p;f.push(P,S,E),f.push(S,w,E)}this.setIndex(f),this.setAttribute("position",new Kt(_,3)),this.setAttribute("normal",new Kt(M,3)),this.setAttribute("uv",new Kt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Os=class extends dn{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],n=new Set,r=new V,s=new V;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){let d=l[c],h=d.start,f=d.count;for(let _=h,M=h+f;_<M;_+=3)for(let g=0;g<3;g++){let p=o.getX(_+g),b=o.getX(_+(g+1)%3);r.fromBufferAttribute(a,p),s.fromBufferAttribute(a,b),Ku(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let u=3*o+c,d=3*o+(c+1)%3;r.fromBufferAttribute(a,u),s.fromBufferAttribute(a,d),Ku(r,s,n)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new Kt(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Ku(i,e,t){let n=`${i.x},${i.y},${i.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${i.x},${i.y},${i.z}`;return t.has(n)===!0||t.has(r)===!0?!1:(t.add(n),t.add(r),!0)}function fr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let r=i[t][n];if(ju(r))r.isRenderTargetTexture?(Ue("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone();else if(Array.isArray(r))if(ju(r[0])){let s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[t][n]=s}else e[t][n]=r.slice();else e[t][n]=r}}return e}function en(i){let e={};for(let t=0;t<i.length;t++){let n=fr(i[t]);for(let r in n)e[r]=n[r]}return e}function ju(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function ep(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Fc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var ta={clone:fr,merge:en},tp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,np=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,sn=class extends ki{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tp,this.fragmentShader=np,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fr(e.uniforms),this.uniformsGroups=ep(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case"t":this.uniforms[n].value=t[r.value]||null;break;case"c":this.uniforms[n].value=new qe().setHex(r.value);break;case"v2":this.uniforms[n].value=new We().fromArray(r.value);break;case"v3":this.uniforms[n].value=new V().fromArray(r.value);break;case"v4":this.uniforms[n].value=new Ke().fromArray(r.value);break;case"m3":this.uniforms[n].value=new Oe().fromArray(r.value);break;case"m4":this.uniforms[n].value=new ke().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ur=class extends sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Bs=class extends ki{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=el,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yi,this.combine=po,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ja=class extends ki{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Th,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ka=class extends ki{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Br(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ec(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Wi=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<r)){for(let o=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=r,r=t[++n],e<r)break e}a=t.length;break t}if(!(e>=s)){let o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ja=class extends Wi{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:rc,endingEnd:rc}}intervalChanged_(e,t,n){let r=this.parameterPositions,s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case sc:s=e,o=2*t-n;break;case ac:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case sc:a=e,l=2*n-t;break;case ac:a=1,l=n+r[1]-r[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,_=(n-t)/(r-t),M=_*_,g=M*_,p=-h*g+2*h*M-h*_,b=(1+h)*g+(-1.5-2*h)*M+(-.5+h)*_+1,P=(-1-f)*g+(1.5+f)*M+.5*_,S=f*g-f*M;for(let w=0;w!==o;++w)s[w]=p*a[u+w]+b*a[c+w]+P*a[l+w]+S*a[d+w];return s}},Qa=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(r-t),d=1-u;for(let h=0;h!==o;++h)s[h]=a[c+h]*d+a[l+h]*u;return s}},eo=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},to=class extends Wi{interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,d=this.outTangents;if(!u||!d){let _=(n-t)/(r-t),M=1-_;for(let g=0;g!==o;++g)s[g]=a[c+g]*M+a[l+g]*_;return s}let h=o*2,f=e-1;for(let _=0;_!==o;++_){let M=a[c+_],g=a[l+_],p=f*h+_*2,b=d[p],P=d[p+1],S=e*h+_*2,w=u[S],E=u[S+1],L=rp(n,t,b,w,r);s[_]=kh(L,M,P,E,g)}return s}};function kh(i,e,t,n,r){let s=1-i;return s*s*s*e+3*s*s*i*t+3*s*i*i*n+i*i*i*r}function ip(i,e,t,n,r){let s=1-i;return 3*s*s*(t-e)+6*s*i*(n-t)+3*i*i*(r-n)}function rp(i,e,t,n,r){let s=(i-e)/(r-e);for(let a=0;a<8;a++){let o=kh(s,e,t,n,r)-i;if(Math.abs(o)<1e-10)break;let l=ip(s,e,t,n,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}var Mn=class{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Br(t,this.TimeBufferType),this.values=Br(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Br(e.times,Array),values:Br(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r),ec(e.settings)&&(n.settings={inTangents:Br(e.settings.inTangents,Array),outTangents:Br(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new eo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Qa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new to(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ts:t=this.InterpolantFactoryMethodDiscrete;break;case Ha:t=this.InterpolantFactoryMethodLinear;break;case La:t=this.InterpolantFactoryMethodSmooth;break;case ic:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ue("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ts;case this.InterpolantFactoryMethodLinear:return Ha;case this.InterpolantFactoryMethodSmooth:return La;case this.InterpolantFactoryMethodBezier:return ic}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;ec(this.settings)&&(Qu(this.settings.inTangents,e),Qu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,s=0,a=r-1;for(;s!==r&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Be("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,r=this.values,s=n.length;s===0&&(Be("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Be("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Be("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&vf(r))for(let o=0,l=r.length;o!==l;++o){let c=r[o];if(isNaN(c)){Be("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===La,s=e.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(r)l=!0;else{let d=o*n,h=d-n,f=d+n;for(let _=0;_!==n;++_){let M=t[d+_];if(M!==t[h+_]||M!==t[f+_]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,h=a*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,ec(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Qu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=Ha;var Xi=class extends Mn{constructor(e,t,n){super(e,t,n)}};Xi.prototype.ValueTypeName="bool";Xi.prototype.ValueBufferType=Array;Xi.prototype.DefaultInterpolation=Ts;Xi.prototype.InterpolantFactoryMethodLinear=void 0;Xi.prototype.InterpolantFactoryMethodSmooth=void 0;var no=class extends Mn{constructor(e,t,n,r){super(e,t,n,r)}};no.prototype.ValueTypeName="color";var io=class extends Mn{constructor(e,t,n,r){super(e,t,n,r)}};io.prototype.ValueTypeName="number";var ro=class extends Wi{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(r-t),c=e*o;for(let u=c+o;c!==u;c+=4)Kn.slerpFlat(s,0,a,c-o,a,c,l);return s}},zs=class extends Mn{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ro(this.times,this.values,this.getValueSize(),e)}};zs.prototype.ValueTypeName="quaternion";zs.prototype.InterpolantFactoryMethodSmooth=void 0;var qi=class extends Mn{constructor(e,t,n){super(e,t,n)}};qi.prototype.ValueTypeName="string";qi.prototype.ValueBufferType=Array;qi.prototype.DefaultInterpolation=Ts;qi.prototype.InterpolantFactoryMethodLinear=void 0;qi.prototype.InterpolantFactoryMethodSmooth=void 0;var so=class extends Mn{constructor(e,t,n,r){super(e,t,n,r)}};so.prototype.ValueTypeName="vector";var ao=class{constructor(e,t,n){let r=this,s=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],_=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Gh=new ao,oo=class{constructor(e){this.manager=e!==void 0?e:Gh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};oo.DEFAULT_MATERIAL_NAME="__DEFAULT";var ks=class extends rn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var tc=new ke,eh=new V,th=new V,lo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new We(512,512),this.mapType=fn,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Kr,this._frameExtents=new We(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;eh.setFromMatrixPosition(e.matrixWorld),t.position.copy(eh),th.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(th),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){tc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(tc,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,a=r?r.z/s.x:1,o=r?r.w/s.y:1,l=r?r.x/s.x:0,c=r?r.y/s.y:0;e.coordinateSystem===Xr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(tc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ra=new V,Pa=new Kn,$n=new V,Mi=class extends rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ra,Pa,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ra,Pa,$n.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ra,Pa,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ra,Pa,$n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Bi=new V,nh=new We,ih=new We,un=class extends Mi{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Yr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Yr*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,t){return this.getViewBounds(e,nh,ih),t.subVectors(ih,nh)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ws*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*n/c,r*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var jr=class extends Mi{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=n-e,a=n+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},oc=class extends lo{constructor(){super(new jr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gs=class extends ks{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.target=new rn,this.shadow=new oc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Vs=class extends ks{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Hs=class extends dn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var zr=-90,kr=1,co=class extends rn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new un(zr,kr,e,t);r.layers=this.layers,this.add(r);let s=new un(zr,kr,e,t);s.layers=this.layers,this.add(s);let a=new un(zr,kr,e,t);a.layers=this.layers,this.add(a);let o=new un(zr,kr,e,t);o.layers=this.layers,this.add(o);let l=new un(zr,kr,e,t);l.layers=this.layers,this.add(l);let c=new un(zr,kr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,l]=t;for(let c of t)this.remove(c);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Xr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},uo=class extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Nc="\\[\\]\\.:\\/",sp=new RegExp("["+Nc+"]","g"),Uc="[^"+Nc+"]",ap="[^"+Nc.replace("\\.","")+"]",op=/((?:WC+[\/:])*)/.source.replace("WC",Uc),lp=/(WCOD+)?/.source.replace("WCOD",ap),cp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Uc),up=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Uc),hp=new RegExp("^"+op+lp+cp+up+"$"),dp=["material","materials","bones","map"],lc=class{constructor(e,t,n){let r=n||vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},vt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(sp,"")}static parseTrackName(e){let t=hp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=n.nodeName.substring(r+1);dp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ue("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Be("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Be("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Be("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Be("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Be("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Be("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[r];if(a===void 0){let c=t.nodeName;Be("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Be("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};vt.Composite=lc;vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};vt.prototype.GetterByBindingType=[vt.prototype._getValue_direct,vt.prototype._getValue_array,vt.prototype._getValue_arrayElement,vt.prototype._getValue_toArray];vt.prototype.SetterByBindingTypeAndVersioning=[[vt.prototype._setValue_direct,vt.prototype._setValue_direct_setNeedsUpdate,vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_array,vt.prototype._setValue_array_setNeedsUpdate,vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_arrayElement,vt.prototype._setValue_arrayElement_setNeedsUpdate,vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_fromArray,vt.prototype._setValue_fromArray_setNeedsUpdate,vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var B_=new Float32Array(1);var Yi=class extends Ya{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};var cc=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=r,this}};var rh=new V,Ia=new V,Gr=new V,Vr=new V,nc=new V,fp=new V,pp=new V,Ws=class{constructor(e=new V,t=new V){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){rh.subVectors(e,this.start),Ia.subVectors(this.end,this.start);let n=Ia.dot(Ia);if(n===0)return 0;let s=Ia.dot(rh)/n;return t&&(s=He(s,0,1)),s}closestPointToPoint(e,t,n){let r=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=fp,n=pp){let r=10000000000000001e-32,s,a,o=this.start,l=e.start,c=this.end,u=e.end;Gr.subVectors(c,o),Vr.subVectors(u,l),nc.subVectors(o,l);let d=Gr.dot(Gr),h=Vr.dot(Vr),f=Vr.dot(nc);if(d<=r&&h<=r)return t.copy(o),n.copy(l),t.sub(n),t.dot(t);if(d<=r)s=0,a=f/h,a=He(a,0,1);else{let _=Gr.dot(nc);if(h<=r)a=0,s=He(-_/d,0,1);else{let M=Gr.dot(Vr),g=d*h-M*M;g!==0?s=He((M*f-_*h)/g,0,1):s=0,a=(M*s+f)/h,a<0?(a=0,s=He(-_/d,0,1)):a>1&&(a=1,s=He((M-_)/d,0,1))}}return t.copy(o).addScaledVector(Gr,s),n.copy(l).addScaledVector(Vr,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};function Oc(i,e,t,n){let r=mp(n);switch(t){case Cc:return i*e;case Pc:return i*e/r.components*r.byteLength;case So:return i*e/r.components*r.byteLength;case ei:return i*e*2/r.components*r.byteLength;case Mo:return i*e*2/r.components*r.byteLength;case Rc:return i*e*3/r.components*r.byteLength;case Pn:return i*e*4/r.components*r.byteLength;case bo:return i*e*4/r.components*r.byteLength;case Zs:case Js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ks:case js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Eo:case Ao:return Math.max(i,16)*Math.max(e,8)/4;case wo:case To:return Math.max(i,8)*Math.max(e,8)/2;case Co:case Ro:case Io:case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Po:case Qs:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case No:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ko:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Go:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Vo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case qo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case $o:case Zo:case Jo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ko:case jo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ea:case Qo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function mp(i){switch(i){case fn:case wc:return{byteLength:1,components:1};case ts:case Ec:case Hn:return{byteLength:2,components:1};case vo:case yo:return{byteLength:2,components:4};case Vn:case _o:case bn:return{byteLength:4,components:1};case Tc:case Ac:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ue("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function cd(){let i=null,e=!1,t=null,n=null;function r(s,a){n=i.requestAnimationFrame(r),t(s,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function xp(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,_)=>f.start-_.start);let h=0;for(let f=1;f<d.length;f++){let _=d[h],M=d[f];M.start<=_.start+_.count+1?_.count=Math.max(_.count,M.start+M.count-_.start):(++h,d[h]=M)}d.length=h+1;for(let f=0,_=d.length;f<_;f++){let M=d[f];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var _p=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vp=`#ifdef USE_ALPHAHASH
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
#endif`,yp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wp=`#ifdef USE_AOMAP
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
#endif`,Ep=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tp=`#ifdef USE_BATCHING
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
#endif`,Ap=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ip=`#ifdef USE_IRIDESCENCE
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
#endif`,Lp=`#ifdef USE_BUMPMAP
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
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Bp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,kp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Gp=`#define PI 3.141592653589793
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
} // validated`,Vp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hp=`vec3 transformedNormal = objectNormal;
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
#endif`,Wp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$p="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jp=`#ifdef USE_ENVMAP
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
#endif`,Kp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,jp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,em=`#ifdef USE_ENVMAP
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
#endif`,tm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,nm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,im=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sm=`#ifdef USE_GRADIENTMAP
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
}`,am=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,um=`#ifdef USE_ENVMAP
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
#endif`,hm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,fm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mm=`PhysicalMaterial material;
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
#endif`,gm=`uniform sampler2D dfgLUT;
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
}`,xm=`
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
#endif`,_m=`#if defined( RE_IndirectDiffuse )
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
#endif`,vm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ym=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Sm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Em=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Am=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cm=`#if defined( USE_POINTS_UV )
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
#endif`,Rm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Im=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fm=`#ifdef USE_MORPHTARGETS
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
#endif`,Nm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Um=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Om=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,km=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Gm=`#ifdef USE_NORMALMAP
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
#endif`,Vm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ym=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$m=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Km=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Qm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ng=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ig=`float getShadowMask() {
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
}`,rg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sg=`#ifdef USE_SKINNING
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
#endif`,ag=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,og=`#ifdef USE_SKINNING
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
#endif`,lg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ug=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dg=`#ifdef USE_TRANSMISSION
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
#endif`,fg=`#ifdef USE_TRANSMISSION
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
#endif`,pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,_g=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vg=`uniform sampler2D t2D;
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
}`,yg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wg=`#include <common>
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
}`,Eg=`#if DEPTH_PACKING == 3200
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
}`,Tg=`#define DISTANCE
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
}`,Ag=`#define DISTANCE
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
}`,Cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`uniform float scale;
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
}`,Ig=`uniform vec3 diffuse;
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
}`,Lg=`#include <common>
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
}`,Dg=`uniform vec3 diffuse;
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
}`,Fg=`#define LAMBERT
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
}`,Ng=`#define LAMBERT
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
}`,Ug=`#define MATCAP
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
}`,Og=`#define MATCAP
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
}`,Bg=`#define NORMAL
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
}`,zg=`#define NORMAL
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
}`,kg=`#define PHONG
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
}`,Gg=`#define PHONG
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
}`,Vg=`#define STANDARD
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
}`,Hg=`#define STANDARD
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
}`,Wg=`#define TOON
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
}`,Xg=`#define TOON
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
}`,qg=`uniform float size;
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
}`,Yg=`uniform vec3 diffuse;
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
}`,$g=`#include <common>
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
}`,Zg=`uniform vec3 color;
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
}`,Jg=`uniform float rotation;
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
}`,Kg=`uniform vec3 diffuse;
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
}`,Ye={alphahash_fragment:_p,alphahash_pars_fragment:vp,alphamap_fragment:yp,alphamap_pars_fragment:Sp,alphatest_fragment:Mp,alphatest_pars_fragment:bp,aomap_fragment:wp,aomap_pars_fragment:Ep,batching_pars_vertex:Tp,batching_vertex:Ap,begin_vertex:Cp,beginnormal_vertex:Rp,bsdfs:Pp,iridescence_fragment:Ip,bumpmap_pars_fragment:Lp,clipping_planes_fragment:Dp,clipping_planes_pars_fragment:Fp,clipping_planes_pars_vertex:Np,clipping_planes_vertex:Up,color_fragment:Op,color_pars_fragment:Bp,color_pars_vertex:zp,color_vertex:kp,common:Gp,cube_uv_reflection_fragment:Vp,defaultnormal_vertex:Hp,displacementmap_pars_vertex:Wp,displacementmap_vertex:Xp,emissivemap_fragment:qp,emissivemap_pars_fragment:Yp,colorspace_fragment:$p,colorspace_pars_fragment:Zp,envmap_fragment:Jp,envmap_common_pars_fragment:Kp,envmap_pars_fragment:jp,envmap_pars_vertex:Qp,envmap_physical_pars_fragment:um,envmap_vertex:em,fog_vertex:tm,fog_pars_vertex:nm,fog_fragment:im,fog_pars_fragment:rm,gradientmap_pars_fragment:sm,lightmap_pars_fragment:am,lights_lambert_fragment:om,lights_lambert_pars_fragment:lm,lights_pars_begin:cm,lights_toon_fragment:hm,lights_toon_pars_fragment:dm,lights_phong_fragment:fm,lights_phong_pars_fragment:pm,lights_physical_fragment:mm,lights_physical_pars_fragment:gm,lights_fragment_begin:xm,lights_fragment_maps:_m,lights_fragment_end:vm,lightprobes_pars_fragment:ym,logdepthbuf_fragment:Sm,logdepthbuf_pars_fragment:Mm,logdepthbuf_pars_vertex:bm,logdepthbuf_vertex:wm,map_fragment:Em,map_pars_fragment:Tm,map_particle_fragment:Am,map_particle_pars_fragment:Cm,metalnessmap_fragment:Rm,metalnessmap_pars_fragment:Pm,morphinstance_vertex:Im,morphcolor_vertex:Lm,morphnormal_vertex:Dm,morphtarget_pars_vertex:Fm,morphtarget_vertex:Nm,normal_fragment_begin:Um,normal_fragment_maps:Om,normal_pars_fragment:Bm,normal_pars_vertex:zm,normal_vertex:km,normalmap_pars_fragment:Gm,clearcoat_normal_fragment_begin:Vm,clearcoat_normal_fragment_maps:Hm,clearcoat_pars_fragment:Wm,iridescence_pars_fragment:Xm,opaque_fragment:qm,packing:Ym,premultiplied_alpha_fragment:$m,project_vertex:Zm,dithering_fragment:Jm,dithering_pars_fragment:Km,roughnessmap_fragment:jm,roughnessmap_pars_fragment:Qm,shadowmap_pars_fragment:eg,shadowmap_pars_vertex:tg,shadowmap_vertex:ng,shadowmask_pars_fragment:ig,skinbase_vertex:rg,skinning_pars_vertex:sg,skinning_vertex:ag,skinnormal_vertex:og,specularmap_fragment:lg,specularmap_pars_fragment:cg,tonemapping_fragment:ug,tonemapping_pars_fragment:hg,transmission_fragment:dg,transmission_pars_fragment:fg,uv_pars_fragment:pg,uv_pars_vertex:mg,uv_vertex:gg,worldpos_vertex:xg,background_vert:_g,background_frag:vg,backgroundCube_vert:yg,backgroundCube_frag:Sg,cube_vert:Mg,cube_frag:bg,depth_vert:wg,depth_frag:Eg,distance_vert:Tg,distance_frag:Ag,equirect_vert:Cg,equirect_frag:Rg,linedashed_vert:Pg,linedashed_frag:Ig,meshbasic_vert:Lg,meshbasic_frag:Dg,meshlambert_vert:Fg,meshlambert_frag:Ng,meshmatcap_vert:Ug,meshmatcap_frag:Og,meshnormal_vert:Bg,meshnormal_frag:zg,meshphong_vert:kg,meshphong_frag:Gg,meshphysical_vert:Vg,meshphysical_frag:Hg,meshtoon_vert:Wg,meshtoon_frag:Xg,points_vert:qg,points_frag:Yg,shadow_vert:$g,shadow_frag:Zg,sprite_vert:Jg,sprite_frag:Kg},he={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},an={basic:{uniforms:en([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:en([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new qe(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:en([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:en([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:en([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new qe(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:en([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:en([he.points,he.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:en([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:en([he.common,he.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:en([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:en([he.sprite,he.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:en([he.common,he.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:en([he.lights,he.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};an.physical={uniforms:en([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};var il={r:0,b:0,g:0},jg=new ke,ud=new Oe;ud.set(-1,0,0,0,1,0,0,0,1);function Qg(i,e,t,n,r,s){let a=new qe(0),o=r===!0?0:1,l,c,u=null,d=0,h=null;function f(b){let P=b.isScene===!0?b.background:null;if(P&&P.isTexture){let S=b.backgroundBlurriness>0;P=e.get(P,S)}return P}function _(b){let P=!1,S=f(b);S===null?g(a,o):S&&S.isColor&&(g(S,1),P=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(i.autoClear||P)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(b,P){let S=f(P);S&&(S.isCubeTexture||S.mapping===Ys)?(c===void 0&&(c=new Dt(new Vi(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:fr(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,E,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=P.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=P.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(jg.makeRotationFromEuler(P.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(ud),c.material.toneMapped=Je.getTransfer(S.colorSpace)!==ot,(u!==S||d!==S.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=S,d=S.version,h=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new Dt(new Hi(2,2),new sn({name:"BackgroundMaterial",uniforms:fr(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=P.backgroundIntensity,l.material.toneMapped=Je.getTransfer(S.colorSpace)!==ot,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,h=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function g(b,P){b.getRGB(il,Fc(i)),t.buffers.color.setClear(il.r,il.g,il.b,P,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,P=1){a.set(b),o=P,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(b){o=b,g(a,o)},render:_,addToRenderList:M,dispose:p}}function e0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null),s=r,a=!1;function o(I,F,D,A,U){let Z=!1,K=d(I,A,D,F);s!==K&&(s=K,c(s.object)),Z=f(I,A,D,U),Z&&_(I,A,D,U),U!==null&&e.update(U,i.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,S(I,F,D,A),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return i.createVertexArray()}function c(I){return i.bindVertexArray(I)}function u(I){return i.deleteVertexArray(I)}function d(I,F,D,A){let U=A.wireframe===!0,Z=n[F.id];Z===void 0&&(Z={},n[F.id]=Z);let K=I.isInstancedMesh===!0?I.id:0,ne=Z[K];ne===void 0&&(ne={},Z[K]=ne);let N=ne[D.id];N===void 0&&(N={},ne[D.id]=N);let W=N[U];return W===void 0&&(W=h(l()),N[U]=W),W}function h(I){let F=[],D=[],A=[];for(let U=0;U<t;U++)F[U]=0,D[U]=0,A[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:D,attributeDivisors:A,object:I,attributes:{},index:null}}function f(I,F,D,A){let U=s.attributes,Z=F.attributes,K=0,ne=D.getAttributes();for(let N in ne)if(ne[N].location>=0){let C=U[N],Y=Z[N];if(Y===void 0&&(N==="instanceMatrix"&&I.instanceMatrix&&(Y=I.instanceMatrix),N==="instanceColor"&&I.instanceColor&&(Y=I.instanceColor)),C===void 0||C.attribute!==Y||Y&&C.data!==Y.data)return!0;K++}return s.attributesNum!==K||s.index!==A}function _(I,F,D,A){let U={},Z=F.attributes,K=0,ne=D.getAttributes();for(let N in ne)if(ne[N].location>=0){let C=Z[N];C===void 0&&(N==="instanceMatrix"&&I.instanceMatrix&&(C=I.instanceMatrix),N==="instanceColor"&&I.instanceColor&&(C=I.instanceColor));let Y={};Y.attribute=C,C&&C.data&&(Y.data=C.data),U[N]=Y,K++}s.attributes=U,s.attributesNum=K,s.index=A}function M(){let I=s.newAttributes;for(let F=0,D=I.length;F<D;F++)I[F]=0}function g(I){p(I,0)}function p(I,F){let D=s.newAttributes,A=s.enabledAttributes,U=s.attributeDivisors;D[I]=1,A[I]===0&&(i.enableVertexAttribArray(I),A[I]=1),U[I]!==F&&(i.vertexAttribDivisor(I,F),U[I]=F)}function b(){let I=s.newAttributes,F=s.enabledAttributes;for(let D=0,A=F.length;D<A;D++)F[D]!==I[D]&&(i.disableVertexAttribArray(D),F[D]=0)}function P(I,F,D,A,U,Z,K){K===!0?i.vertexAttribIPointer(I,F,D,U,Z):i.vertexAttribPointer(I,F,D,A,U,Z)}function S(I,F,D,A){M();let U=A.attributes,Z=D.getAttributes(),K=F.defaultAttributeValues;for(let ne in Z){let N=Z[ne];if(N.location>=0){let W=U[ne];if(W===void 0&&(ne==="instanceMatrix"&&I.instanceMatrix&&(W=I.instanceMatrix),ne==="instanceColor"&&I.instanceColor&&(W=I.instanceColor)),W!==void 0){let C=W.normalized,Y=W.itemSize,te=e.get(W);if(te===void 0)continue;let xe=te.buffer,ce=te.type,le=te.bytesPerElement,H=ce===i.INT||ce===i.UNSIGNED_INT||W.gpuType===_o;if(W.isInterleavedBufferAttribute){let O=W.data,j=O.stride,se=W.offset;if(O.isInstancedInterleavedBuffer){for(let oe=0;oe<N.locationSize;oe++)p(N.location+oe,O.meshPerAttribute);I.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let oe=0;oe<N.locationSize;oe++)g(N.location+oe);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let oe=0;oe<N.locationSize;oe++)P(N.location+oe,Y/N.locationSize,ce,C,j*le,(se+Y/N.locationSize*oe)*le,H)}else{if(W.isInstancedBufferAttribute){for(let O=0;O<N.locationSize;O++)p(N.location+O,W.meshPerAttribute);I.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let O=0;O<N.locationSize;O++)g(N.location+O);i.bindBuffer(i.ARRAY_BUFFER,xe);for(let O=0;O<N.locationSize;O++)P(N.location+O,Y/N.locationSize,ce,C,Y*le,Y/N.locationSize*O*le,H)}}else if(K!==void 0){let C=K[ne];if(C!==void 0)switch(C.length){case 2:i.vertexAttrib2fv(N.location,C);break;case 3:i.vertexAttrib3fv(N.location,C);break;case 4:i.vertexAttrib4fv(N.location,C);break;default:i.vertexAttrib1fv(N.location,C)}}}}b()}function w(){y();for(let I in n){let F=n[I];for(let D in F){let A=F[D];for(let U in A){let Z=A[U];for(let K in Z)u(Z[K].object),delete Z[K];delete A[U]}}delete n[I]}}function E(I){if(n[I.id]===void 0)return;let F=n[I.id];for(let D in F){let A=F[D];for(let U in A){let Z=A[U];for(let K in Z)u(Z[K].object),delete Z[K];delete A[U]}}delete n[I.id]}function L(I){for(let F in n){let D=n[F];for(let A in D){let U=D[A];if(U[I.id]===void 0)continue;let Z=U[I.id];for(let K in Z)u(Z[K].object),delete Z[K];delete U[I.id]}}}function m(I){for(let F in n){let D=n[F],A=I.isInstancedMesh===!0?I.id:0,U=D[A];if(U!==void 0){for(let Z in U){let K=U[Z];for(let ne in K)u(K[ne].object),delete K[ne];delete U[Z]}delete D[A],Object.keys(D).length===0&&delete n[F]}}}function y(){R(),a=!0,s!==r&&(s=r,c(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:y,resetDefaultState:R,dispose:w,releaseStatesOfGeometry:E,releaseStatesOfObject:m,releaseStatesOfProgram:L,initAttributes:M,enableAttribute:g,disableUnusedAttributes:b}}function t0(i,e,t){let n;function r(l){n=l}function s(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];t.update(h,n,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function n0(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let L=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(L){return!(L!==Pn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){let m=L===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==fn&&L!==bn&&!m&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Ue("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ue("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),P=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:_,maxTextureSize:M,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:P,maxFragmentUniforms:S,maxSamples:w,samples:E}}function i0(i){let e=this,t=null,n=0,r=!1,s=!1,a=new On,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||r;return r=h,n=d.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let _=d.clippingPlanes,M=d.clipIntersection,g=d.clipShadows,p=i.get(d);if(!r||_===null||_.length===0||s&&!g)s?u(null):c();else{let b=s?0:n,P=b*4,S=p.clippingState||null;l.value=S,S=u(_,h,P,f);for(let w=0;w!==P;++w)S[w]=t[w];p.clippingState=S,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,_){let M=d!==null?d.length:0,g=null;if(M!==0){if(g=l.value,_!==!0||g===null){let p=f+M*4,b=h.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let P=0,S=f;P!==M;++P,S+=4)a.copy(d[P]).applyMatrix4(b,o),a.normal.toArray(g,S),g[S+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,g}}var ss=4,r0=6,s0=20,a0=256,na=new jr,Vh=new qe,Bc=null,zc=0,kc=0,Gc=!1,o0=new V,pr=new V,sl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,s={}){let{size:a=256,position:o=o0}=s;Bc=this._renderer.getRenderTarget(),zc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Bc,zc,kc),this._renderer.xr.enabled=Gc,e.scissorTest=!1,rs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$i||e.mapping===dr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bc=this._renderer.getRenderTarget(),zc=this._renderer.getActiveCubeFace(),kc=this._renderer.getActiveMipmapLevel(),Gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Lt,minFilter:Lt,generateMipmaps:!1,type:Hn,format:Pn,colorSpace:As,depthBuffer:!1},r=Hh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hh(e,t,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=l0(s)),this._blurMaterial=u0(s,e,t),this._ggxMaterial=c0(s,e,t)}return r}_compileMaterial(e){let t=new Dt(new dn,e);this._renderer.compile(t,na)}_sceneToCubeUV(e,t,n,r,s){let l=new un(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Vh),d.toneMapping=Gn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new Vi,new cr({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,g=M.material,p=!1,b=e.background;b?b.isColor&&(g.color.copy(b),e.background=null,p=!0):(g.color.copy(Vh),p=!0);for(let P=0;P<6;P++){let S=P%3;S===0?(l.up.set(0,c[P],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[P],s.y,s.z)):S===1?(l.up.set(0,0,c[P]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[P],s.z)):(l.up.set(0,c[P],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[P]));let w=this._cubeSize;rs(r,S*w,P>2?w:0,w,w),d.setRenderTarget(r),p&&d.render(M,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===$i||e.mapping===dr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Wh());let s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let o=s.uniforms;o.envMap.value=e;let l=this._cubeSize;rs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,na)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:_}=this,M=this._sizeLods[n],g=3*M*(n>_-ss?n-_+ss:0),p=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=_-t,rs(s,g,p,3*M,2*M),r.setRenderTarget(s),r.render(o,na),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=_-n,rs(e,g,p,3*M,2*M),r.setRenderTarget(e),r.render(o,na)}_blur(e,t,n,r){let s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,n,a),this._blurPass(s,e,n,n,a)}_blurPass(e,t,n,r,s){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[r];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[r],d=3*u*(r>this._lodMax-ss?r-this._lodMax+ss:0),h=4*(this._cubeSize-u);rs(t,d,h,3*u,2*u),a.setRenderTarget(t),a.render(l,na)}};function l0(i){let e=[],t=[],n=i,r=i-ss+1+r0;for(let s=0;s<r;s++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,_=new Float32Array(f*h*d),M=new Float32Array(f*h*d);for(let p=0;p<d;p++){let b=p%3*2/3-1,P=p>2?0:-1,S=[b,P,0,b+2/3,P,0,b+2/3,P+1,0,b,P,0,b+2/3,P+1,0,b,P+1,0];_.set(S,f*h*p);for(let w=0;w<h;w++){let E=u[w*2]*2-1,L=u[w*2+1]*2-1;p===0?pr.set(1,L,E):p===1?pr.set(-E,1,-L):p===2?pr.set(-E,L,1):p===3?pr.set(-1,L,-E):p===4?pr.set(-E,-1,L):pr.set(E,L,-1),pr.toArray(M,(p*h+w)*f)}}let g=new dn;g.setAttribute("position",new Jt(_,f)),g.setAttribute("outputDirection",new Jt(M,f)),t.push(new Dt(g,null)),n>ss&&n--}return{lodMeshes:t,sizeLods:e}}function Hh(i,e,t){let n=new jt(i,e,t);return n.texture.mapping=Ys,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function rs(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function c0(i,e,t){return new sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:a0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ol(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function u0(i,e,t){return new sn({name:"SphericalGaussianBlur",defines:{SAMPLES:s0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ol(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Wh(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ol(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Xh(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function ol(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var al=class extends jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ns(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Vi(5,5,5),s=new sn({name:"CubemapFromEquirect",uniforms:fr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ot,blending:Rn});s.uniforms.tEquirect.value=t;let a=new Dt(r,s),o=t.minFilter;return t.minFilter===Zi&&(t.minFilter=Lt),new co(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}};function h0(i){let e=new WeakMap,t=new WeakMap,n=null;function r(h,f=!1){return h==null?null:f?a(h):s(h)}function s(h){if(h&&h.isTexture){let f=h.mapping;if(f===mo||f===go)if(e.has(h)){let _=e.get(h).texture;return o(_,h.mapping)}else{let _=h.image;if(_&&_.height>0){let M=new al(_.height);return M.fromEquirectangularTexture(i,h),e.set(h,M),h.addEventListener("dispose",c),o(M.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let f=h.mapping,_=f===mo||f===go,M=f===$i||f===dr;if(_||M){let g=t.get(h),p=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new sl(i)),g=_?n.fromEquirectangular(h,g):n.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),g.texture;if(g!==void 0)return g.texture;{let b=h.image;return _&&b&&b.height>0||M&&b&&l(b)?(n===null&&(n=new sl(i)),g=_?n.fromEquirectangular(h):n.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,t.set(h,g),h.addEventListener("dispose",u),g.texture):null}}}return h}function o(h,f){return f===mo?h.mapping=$i:f===go&&(h.mapping=dr),h}function l(h){let f=0,_=6;for(let M=0;M<_;M++)h[M]!==void 0&&f++;return f===_}function c(h){let f=h.target;f.removeEventListener("dispose",c);let _=e.get(f);_!==void 0&&(e.delete(f),_.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let _=t.get(f);_!==void 0&&(t.delete(f),_.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:r,dispose:d}}function d0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let r=i.getExtension(n);return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let r=t(n);return r===null&&lr("WebGLRenderer: "+n+" extension not supported."),r}}}function f0(i,e,t,n){let r={},s=new WeakMap;function a(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",a),delete r[h.id];let f=s.get(h);f&&(e.remove(f),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(d,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)e.update(h[f],i.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,_=d.attributes.position,M=0;if(_===void 0)return;if(f!==null){let b=f.array;M=f.version;for(let P=0,S=b.length;P<S;P+=3){let w=b[P+0],E=b[P+1],L=b[P+2];h.push(w,E,E,L,L,w)}}else{let b=_.array;M=_.version;for(let P=0,S=b.length/3-1;P<S;P+=3){let w=P+0,E=P+1,L=P+2;h.push(w,E,E,L,L,w)}}let g=new(_.count>=65535?Fs:Ds)(h,1);g.version=M;let p=s.get(d);p&&e.remove(p),s.set(d,g)}function u(d){let h=s.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:u}}function p0(i,e,t){let n;function r(d){n=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,h){i.drawElements(n,h,s,d*a),t.update(h,n,1)}function c(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,s,d*a,f),t.update(h,n,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,s,d,0,f);let M=0;for(let g=0;g<f;g++)M+=h[g];t.update(M,n,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function m0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:Be("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function g0(i,e,t){let n=new WeakMap,r=new Ke;function s(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==d){let y=function(){L.dispose(),n.delete(o),o.removeEventListener("dispose",y)};h!==void 0&&h.texture.dispose();let f=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,M=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],P=0;f===!0&&(P=1),_===!0&&(P=2),M===!0&&(P=3);let S=o.attributes.position.count*P,w=1;S>e.maxTextureSize&&(w=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let E=new Float32Array(S*w*4*d),L=new Is(E,S,w,d);L.type=bn,L.needsUpdate=!0;let m=P*4;for(let R=0;R<d;R++){let I=g[R],F=p[R],D=b[R],A=S*w*4*R;for(let U=0;U<I.count;U++){let Z=U*m;f===!0&&(r.fromBufferAttribute(I,U),E[A+Z+0]=r.x,E[A+Z+1]=r.y,E[A+Z+2]=r.z,E[A+Z+3]=0),_===!0&&(r.fromBufferAttribute(F,U),E[A+Z+4]=r.x,E[A+Z+5]=r.y,E[A+Z+6]=r.z,E[A+Z+7]=0),M===!0&&(r.fromBufferAttribute(D,U),E[A+Z+8]=r.x,E[A+Z+9]=r.y,E[A+Z+10]=r.z,E[A+Z+11]=D.itemSize===4?r.w:1)}}h={count:d,texture:L,size:new We(S,w)},n.set(o,h),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let M=0;M<c.length;M++)f+=c[M];let _=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function x0(i,e,t,n,r){let s=new WeakMap;function a(c){let u=r.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return h}function o(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var _0={[gc]:"LINEAR_TONE_MAPPING",[xc]:"REINHARD_TONE_MAPPING",[_c]:"CINEON_TONE_MAPPING",[vc]:"ACES_FILMIC_TONE_MAPPING",[Sc]:"AGX_TONE_MAPPING",[Mc]:"NEUTRAL_TONE_MAPPING",[yc]:"CUSTOM_TONE_MAPPING"};function v0(i,e,t,n,r,s){let a=new jt(e,t,{type:i,depthBuffer:r,stencilBuffer:s,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new dn;c.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Kt([0,2,0,0,2,0],2));let u=new ur({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new Dt(c,u),h=new jr(-1,1,1,-1,0,1),f=null,_=null,M=!1,g,p=null,b=[],P=!1;this.setSize=function(S,w){a.setSize(S,w),o!==null&&o.setSize(S,w),l!==null&&l.setSize(S,w);for(let E=0;E<b.length;E++){let L=b[E];L.setSize&&L.setSize(S,w)}},this.setEffects=function(S){b=S,P=b.length>0&&b[0].isRenderPass===!0;let w=a.width,E=a.height;b.length>0&&o===null&&(o=new jt(w,E,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),l=new jt(w,E,{type:Hn,depthBuffer:!1,stencilBuffer:!1}));for(let L=0;L<b.length;L++){let m=b[L];m.setSize&&m.setSize(w,E)}},this.begin=function(S,w){if(M||S.toneMapping===Gn&&b.length===0)return!1;if(p=w,w!==null){let E=w.width,L=w.height;(a.width!==E||a.height!==L)&&this.setSize(E,L)}return P===!1&&S.setRenderTarget(a),g=S.toneMapping,S.toneMapping=Gn,!0},this.hasRenderPass=function(){return P},this.end=function(S,w){S.toneMapping=g,M=!0;let E=a,L=o;for(let m=0;m<b.length;m++){let y=b[m];y.enabled!==!1&&(y.render(S,L,E,w),y.needsSwap!==!1&&(E=L,L=L===o?l:o))}if(f!==S.outputColorSpace||_!==S.toneMapping){f=S.outputColorSpace,_=S.toneMapping,u.defines={},Je.getTransfer(f)===ot&&(u.defines.SRGB_TRANSFER="");let m=_0[_];m&&(u.defines[m]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=E.texture,S.setRenderTarget(p),S.render(d,h),p=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var hd=new hn,Wc=new Gi(1,1),dd=new Is,fd=new qa,pd=new Ns,qh=[],Yh=[],$h=new Float32Array(16),Zh=new Float32Array(9),Jh=new Float32Array(4);function ls(i,e,t){let n=i[0];if(n<=0||n>0)return i;let r=e*t,s=qh[r];if(s===void 0&&(s=new Float32Array(r),qh[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Nt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ll(i,e){let t=Yh[e];t===void 0&&(t=new Int32Array(e),Yh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function y0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function S0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2fv(this.addr,e),Nt(t,e)}}function M0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;i.uniform3fv(this.addr,e),Nt(t,e)}}function b0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4fv(this.addr,e),Nt(t,e)}}function w0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Nt(t,e)}else{if(Ft(t,n))return;Jh.set(n),i.uniformMatrix2fv(this.addr,!1,Jh),Nt(t,n)}}function E0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Nt(t,e)}else{if(Ft(t,n))return;Zh.set(n),i.uniformMatrix3fv(this.addr,!1,Zh),Nt(t,n)}}function T0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Nt(t,e)}else{if(Ft(t,n))return;$h.set(n),i.uniformMatrix4fv(this.addr,!1,$h),Nt(t,n)}}function A0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function C0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2iv(this.addr,e),Nt(t,e)}}function R0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3iv(this.addr,e),Nt(t,e)}}function P0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4iv(this.addr,e),Nt(t,e)}}function I0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function L0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2uiv(this.addr,e),Nt(t,e)}}function D0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3uiv(this.addr,e),Nt(t,e)}}function F0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4uiv(this.addr,e),Nt(t,e)}}function N0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Wc.compareFunction=t.isReversedDepthBuffer()?nl:tl,s=Wc):s=hd,t.setTexture2D(e||s,r)}function U0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||fd,r)}function O0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||pd,r)}function B0(i,e,t){let n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||dd,r)}function z0(i){switch(i){case 5126:return y0;case 35664:return S0;case 35665:return M0;case 35666:return b0;case 35674:return w0;case 35675:return E0;case 35676:return T0;case 5124:case 35670:return A0;case 35667:case 35671:return C0;case 35668:case 35672:return R0;case 35669:case 35673:return P0;case 5125:return I0;case 36294:return L0;case 36295:return D0;case 36296:return F0;case 35678:case 36198:case 36298:case 36306:case 35682:return N0;case 35679:case 36299:case 36307:return U0;case 35680:case 36300:case 36308:case 36293:return O0;case 36289:case 36303:case 36311:case 36292:return B0}}function k0(i,e){i.uniform1fv(this.addr,e)}function G0(i,e){let t=ls(e,this.size,2);i.uniform2fv(this.addr,t)}function V0(i,e){let t=ls(e,this.size,3);i.uniform3fv(this.addr,t)}function H0(i,e){let t=ls(e,this.size,4);i.uniform4fv(this.addr,t)}function W0(i,e){let t=ls(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function X0(i,e){let t=ls(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function q0(i,e){let t=ls(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Y0(i,e){i.uniform1iv(this.addr,e)}function $0(i,e){i.uniform2iv(this.addr,e)}function Z0(i,e){i.uniform3iv(this.addr,e)}function J0(i,e){i.uniform4iv(this.addr,e)}function K0(i,e){i.uniform1uiv(this.addr,e)}function j0(i,e){i.uniform2uiv(this.addr,e)}function Q0(i,e){i.uniform3uiv(this.addr,e)}function ex(i,e){i.uniform4uiv(this.addr,e)}function tx(i,e,t){let n=this.cache,r=e.length,s=ll(t,r);Ft(n,s)||(i.uniform1iv(this.addr,s),Nt(n,s));let a;this.type===i.SAMPLER_2D_SHADOW?a=Wc:a=hd;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function nx(i,e,t){let n=this.cache,r=e.length,s=ll(t,r);Ft(n,s)||(i.uniform1iv(this.addr,s),Nt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||fd,s[a])}function ix(i,e,t){let n=this.cache,r=e.length,s=ll(t,r);Ft(n,s)||(i.uniform1iv(this.addr,s),Nt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||pd,s[a])}function rx(i,e,t){let n=this.cache,r=e.length,s=ll(t,r);Ft(n,s)||(i.uniform1iv(this.addr,s),Nt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||dd,s[a])}function sx(i){switch(i){case 5126:return k0;case 35664:return G0;case 35665:return V0;case 35666:return H0;case 35674:return W0;case 35675:return X0;case 35676:return q0;case 5124:case 35670:return Y0;case 35667:case 35671:return $0;case 35668:case 35672:return Z0;case 35669:case 35673:return J0;case 5125:return K0;case 36294:return j0;case 36295:return Q0;case 36296:return ex;case 35678:case 36198:case 36298:case 36306:case 35682:return tx;case 35679:case 36299:case 36307:return nx;case 35680:case 36300:case 36308:case 36293:return ix;case 36289:case 36303:case 36311:case 36292:return rx}}var Xc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=z0(t.type)}},qc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=sx(t.type)}},Yc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let s=0,a=r.length;s!==a;++s){let o=r[s];o.setValue(e,t[o.id],n)}}},Vc=/(\w+)(\])?(\[|\.)?/g;function Kh(i,e){i.seq.push(e),i.map[e.id]=e}function ax(i,e,t){let n=i.name,r=n.length;for(Vc.lastIndex=0;;){let s=Vc.exec(n),a=Vc.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Kh(t,c===void 0?new Xc(o,i,e):new qc(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new Yc(o),Kh(t,d)),t=d}}}var as=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);ax(o,l,this)}let r=[],s=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,n,r){let s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){let o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,s=e.length;r!==s;++r){let a=e[r];a.id in t&&n.push(a)}return n}};function jh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var ox=37297,lx=0;function cx(i,e){let t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Qh=new Oe;function ux(i){Je._getMatrix(Qh,Je.workingColorSpace,i);let e=`mat3( ${Qh.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(i)){case Cs:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return Ue("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ed(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=(i.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+cx(i.getShaderSource(e),o)}else return s}function hx(i,e){let t=ux(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var dx={[gc]:"Linear",[xc]:"Reinhard",[_c]:"Cineon",[vc]:"ACESFilmic",[Sc]:"AgX",[Mc]:"Neutral",[yc]:"Custom"};function fx(i,e){let t=dx[e];return t===void 0?(Ue("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var rl=new V;function px(){Je.getLuminanceCoefficients(rl);let i=rl.x.toFixed(4),e=rl.y.toFixed(4),t=rl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ra).join(`
`)}function gx(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function xx(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){let s=i.getActiveAttrib(e,r),a=s.name,o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ra(i){return i!==""}function td(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function nd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var _x=/^[ \t]*#include +<([\w\d./]+)>/gm;function $c(i){return i.replace(_x,yx)}var vx=new Map;function yx(i,e){let t=Ye[e];if(t===void 0){let n=vx.get(e);if(n!==void 0)t=Ye[n],Ue('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return $c(t)}var Sx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function id(i){return i.replace(Sx,Mx)}function Mx(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function rd(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var bx={[Xs]:"SHADOWMAP_TYPE_PCF",[Qr]:"SHADOWMAP_TYPE_VSM"};function wx(i){return bx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Ex={[$i]:"ENVMAP_TYPE_CUBE",[dr]:"ENVMAP_TYPE_CUBE",[Ys]:"ENVMAP_TYPE_CUBE_UV"};function Tx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Ex[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Ax={[dr]:"ENVMAP_MODE_REFRACTION"};function Cx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Ax[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Rx={[po]:"ENVMAP_BLENDING_MULTIPLY",[bh]:"ENVMAP_BLENDING_MIX",[wh]:"ENVMAP_BLENDING_ADD"};function Px(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Rx[i.combine]||"ENVMAP_BLENDING_NONE"}function Ix(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Lx(i,e,t,n){let r=i.getContext(),s=t.defines,a=t.vertexShader,o=t.fragmentShader,l=wx(t),c=Tx(t),u=Cx(t),d=Px(t),h=Ix(t),f=mx(t),_=gx(s),M=r.createProgram(),g,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ra).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ra).join(`
`),p.length>0&&(p+=`
`)):(g=[rd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ra).join(`
`),p=[rd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gn?"#define TONE_MAPPING":"",t.toneMapping!==Gn?Ye.tonemapping_pars_fragment:"",t.toneMapping!==Gn?fx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,hx("linearToOutputTexel",t.outputColorSpace),px(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ra).join(`
`)),a=$c(a),a=td(a,t),a=nd(a,t),o=$c(o),o=td(o,t),o=nd(o,t),a=id(a),o=id(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===is?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===is?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let P=b+g+a,S=b+p+o,w=jh(r,r.VERTEX_SHADER,P),E=jh(r,r.FRAGMENT_SHADER,S);r.attachShader(M,w),r.attachShader(M,E),t.index0AttributeName!==void 0?r.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(M,0,"position"),r.linkProgram(M);function L(I){if(i.debug.checkShaderErrors){let F=r.getProgramInfoLog(M)||"",D=r.getShaderInfoLog(w)||"",A=r.getShaderInfoLog(E)||"",U=F.trim(),Z=D.trim(),K=A.trim(),ne=!0,N=!0;if(r.getProgramParameter(M,r.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,M,w,E);else{let W=ed(r,w,"vertex"),C=ed(r,E,"fragment");Be("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(M,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+U+`
`+W+`
`+C)}else U!==""?Ue("WebGLProgram: Program Info Log:",U):(Z===""||K==="")&&(N=!1);N&&(I.diagnostics={runnable:ne,programLog:U,vertexShader:{log:Z,prefix:g},fragmentShader:{log:K,prefix:p}})}r.deleteShader(w),r.deleteShader(E),m=new as(r,M),y=xx(r,M)}let m;this.getUniforms=function(){return m===void 0&&L(this),m};let y;this.getAttributes=function(){return y===void 0&&L(this),y};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(M,ox)),R},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=lx++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=w,this.fragmentShader=E,this}var Dx=0,Zc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Jc(e),t.set(e,n)),n}},Jc=class{constructor(e){this.id=Dx++,this.code=e,this.usedTimes=0}};function Fx(i){return i===ei||i===Qs||i===ea}function Nx(i,e,t,n,r,s){let a=new Ls,o=new Zc,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(m){return l.add(m),m===0?"uv":`uv${m}`}function M(m,y,R,I,F,D){let A=I.fog,U=F.geometry,Z=m.isMeshStandardMaterial||m.isMeshLambertMaterial||m.isMeshPhongMaterial?I.environment:null,K=m.isMeshStandardMaterial||m.isMeshLambertMaterial&&!m.envMap||m.isMeshPhongMaterial&&!m.envMap,ne=e.get(m.envMap||Z,K),N=ne&&ne.mapping===Ys?ne.image.height:null,W=f[m.type];m.precision!==null&&(h=n.getMaxPrecision(m.precision),h!==m.precision&&Ue("WebGLProgram.getParameters:",m.precision,"not supported, using",h,"instead."));let C=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Y=C!==void 0?C.length:0,te=0;U.morphAttributes.position!==void 0&&(te=1),U.morphAttributes.normal!==void 0&&(te=2),U.morphAttributes.color!==void 0&&(te=3);let xe,ce,le,H;if(W){let ft=an[W];xe=ft.vertexShader,ce=ft.fragmentShader}else{xe=m.vertexShader,ce=m.fragmentShader;let ft=o.getVertexShaderStage(m),st=o.getFragmentShaderStage(m);o.update(m,ft,st),le=ft.id,H=st.id}let O=i.getRenderTarget(),j=i.state.buffers.depth.getReversed(),se=F.isInstancedMesh===!0,oe=F.isBatchedMesh===!0,Ae=!!m.map,$e=!!m.matcap,ze=!!ne,Re=!!m.aoMap,tt=!!m.lightMap,Ge=!!m.bumpMap&&m.wireframe===!1,ct=!!m.normalMap,xt=!!m.displacementMap,At=!!m.emissiveMap,Qe=!!m.metalnessMap,nt=!!m.roughnessMap,z=m.anisotropy>0,je=m.clearcoat>0,Ne=m.dispersion>0,T=m.retroreflectivity>0,x=m.iridescence>0,G=m.sheen>0,$=m.transmission>0,Q=z&&!!m.anisotropyMap,ue=je&&!!m.clearcoatMap,de=je&&!!m.clearcoatNormalMap,ee=je&&!!m.clearcoatRoughnessMap,re=x&&!!m.iridescenceMap,fe=x&&!!m.iridescenceThicknessMap,Ie=G&&!!m.sheenColorMap,_e=G&&!!m.sheenRoughnessMap,pe=!!m.specularMap,Le=!!m.specularColorMap,Fe=!!m.specularIntensityMap,Ve=$&&!!m.transmissionMap,k=$&&!!m.thicknessMap,me=!!m.gradientMap,ie=!!m.alphaMap,ge=m.alphaTest>0,Se=!!m.alphaHash,ae=!!m.extensions,De=Gn;m.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(De=i.toneMapping);let Ce={shaderID:W,shaderType:m.type,shaderName:m.name,vertexShader:xe,fragmentShader:ce,defines:m.defines,customVertexShaderID:le,customFragmentShaderID:H,isRawShaderMaterial:m.isRawShaderMaterial===!0,glslVersion:m.glslVersion,precision:h,batching:oe,batchingColor:oe&&F._colorsTexture!==null,instancing:se,instancingColor:se&&F.instanceColor!==null,instancingMorph:se&&F.morphTexture!==null,outputColorSpace:O===null?i.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!m.alphaToCoverage,map:Ae,matcap:$e,envMap:ze,envMapMode:ze&&ne.mapping,envMapCubeUVHeight:N,aoMap:Re,lightMap:tt,bumpMap:Ge,normalMap:ct,displacementMap:xt,emissiveMap:At,normalMapObjectSpace:ct&&m.normalMapType===Ah,normalMapTangentSpace:ct&&m.normalMapType===el,packedNormalMap:ct&&m.normalMapType===el&&Fx(m.normalMap.format),metalnessMap:Qe,roughnessMap:nt,anisotropy:z,anisotropyMap:Q,clearcoat:je,clearcoatMap:ue,clearcoatNormalMap:de,clearcoatRoughnessMap:ee,dispersion:Ne,retroreflection:T,iridescence:x,iridescenceMap:re,iridescenceThicknessMap:fe,sheen:G,sheenColorMap:Ie,sheenRoughnessMap:_e,specularMap:pe,specularColorMap:Le,specularIntensityMap:Fe,transmission:$,transmissionMap:Ve,thicknessMap:k,gradientMap:me,opaque:m.transparent===!1&&m.blending===es&&m.alphaToCoverage===!1,alphaMap:ie,alphaTest:ge,alphaHash:Se,combine:m.combine,mapUv:Ae&&_(m.map.channel),aoMapUv:Re&&_(m.aoMap.channel),lightMapUv:tt&&_(m.lightMap.channel),bumpMapUv:Ge&&_(m.bumpMap.channel),normalMapUv:ct&&_(m.normalMap.channel),displacementMapUv:xt&&_(m.displacementMap.channel),emissiveMapUv:At&&_(m.emissiveMap.channel),metalnessMapUv:Qe&&_(m.metalnessMap.channel),roughnessMapUv:nt&&_(m.roughnessMap.channel),anisotropyMapUv:Q&&_(m.anisotropyMap.channel),clearcoatMapUv:ue&&_(m.clearcoatMap.channel),clearcoatNormalMapUv:de&&_(m.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&_(m.clearcoatRoughnessMap.channel),iridescenceMapUv:re&&_(m.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&_(m.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&_(m.sheenColorMap.channel),sheenRoughnessMapUv:_e&&_(m.sheenRoughnessMap.channel),specularMapUv:pe&&_(m.specularMap.channel),specularColorMapUv:Le&&_(m.specularColorMap.channel),specularIntensityMapUv:Fe&&_(m.specularIntensityMap.channel),transmissionMapUv:Ve&&_(m.transmissionMap.channel),thicknessMapUv:k&&_(m.thicknessMap.channel),alphaMapUv:ie&&_(m.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ct||z),vertexNormals:!!U.attributes.normal,vertexColors:m.vertexColors,vertexAlphas:m.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!U.attributes.uv&&(Ae||ie),fog:!!A,useFog:m.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:m.wireframe===!1&&(m.flatShading===!0||U.attributes.normal===void 0&&ct===!1&&(m.isMeshLambertMaterial||m.isMeshPhongMaterial||m.isMeshStandardMaterial||m.isMeshPhysicalMaterial)),sizeAttenuation:m.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:te,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:m.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:Ae&&m.map.isVideoTexture===!0&&Je.getTransfer(m.map.colorSpace)===ot,decodeVideoTextureEmissive:At&&m.emissiveMap.isVideoTexture===!0&&Je.getTransfer(m.emissiveMap.colorSpace)===ot,premultipliedAlpha:m.premultipliedAlpha,doubleSided:m.side===Qt,flipSided:m.side===Ot,useDepthPacking:m.depthPacking>=0,depthPacking:m.depthPacking||0,index0AttributeName:m.index0AttributeName,extensionClipCullDistance:ae&&m.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&m.extensions.multiDraw===!0||oe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:m.customProgramCacheKey()};return Ce.vertexUv1s=l.has(1),Ce.vertexUv2s=l.has(2),Ce.vertexUv3s=l.has(3),l.clear(),Ce}function g(m){let y=[];if(m.shaderID?y.push(m.shaderID):(y.push(m.customVertexShaderID),y.push(m.customFragmentShaderID)),m.defines!==void 0)for(let R in m.defines)y.push(R),y.push(m.defines[R]);return m.isRawShaderMaterial===!1&&(p(y,m),b(y,m),y.push(i.outputColorSpace)),y.push(m.customProgramCacheKey),y.join()}function p(m,y){m.push(y.precision),m.push(y.outputColorSpace),m.push(y.envMapMode),m.push(y.envMapCubeUVHeight),m.push(y.mapUv),m.push(y.alphaMapUv),m.push(y.lightMapUv),m.push(y.aoMapUv),m.push(y.bumpMapUv),m.push(y.normalMapUv),m.push(y.displacementMapUv),m.push(y.emissiveMapUv),m.push(y.metalnessMapUv),m.push(y.roughnessMapUv),m.push(y.anisotropyMapUv),m.push(y.clearcoatMapUv),m.push(y.clearcoatNormalMapUv),m.push(y.clearcoatRoughnessMapUv),m.push(y.iridescenceMapUv),m.push(y.iridescenceThicknessMapUv),m.push(y.sheenColorMapUv),m.push(y.sheenRoughnessMapUv),m.push(y.specularMapUv),m.push(y.specularColorMapUv),m.push(y.specularIntensityMapUv),m.push(y.transmissionMapUv),m.push(y.thicknessMapUv),m.push(y.combine),m.push(y.fogExp2),m.push(y.sizeAttenuation),m.push(y.morphTargetsCount),m.push(y.morphAttributeCount),m.push(y.numSunLights),m.push(y.numDirLights),m.push(y.numPointLights),m.push(y.numSpotLights),m.push(y.numSpotLightMaps),m.push(y.numHemiLights),m.push(y.numRectAreaLights),m.push(y.numSunLightShadows),m.push(y.numDirLightShadows),m.push(y.numPointLightShadows),m.push(y.numSpotLightShadows),m.push(y.numSpotLightShadowsWithMaps),m.push(y.numLightProbes),m.push(y.shadowMapType),m.push(y.toneMapping),m.push(y.numClippingPlanes),m.push(y.numClipIntersection),m.push(y.depthPacking)}function b(m,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),m.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),m.push(a.mask)}function P(m){let y=f[m.type],R;if(y){let I=an[y];R=ta.clone(I.uniforms)}else R=m.uniforms;return R}function S(m,y){let R=u.get(y);return R!==void 0?++R.usedTimes:(R=new Lx(i,y,m,r),c.push(R),u.set(y,R)),R}function w(m){if(--m.usedTimes===0){let y=c.indexOf(m);c[y]=c[c.length-1],c.pop(),u.delete(m.cacheKey),m.destroy()}}function E(m){o.remove(m)}function L(){o.dispose()}return{getParameters:M,getProgramCacheKey:g,getUniforms:P,acquireProgram:S,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:L}}function Ux(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,l){i.get(a)[o]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function Ox(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function sd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ad(){let i=[],e=0,t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function o(h,f,_,M,g,p){let b=i[e];return b===void 0?(b={id:h.id,object:h,geometry:f,material:_,materialVariant:a(h),groupOrder:M,renderOrder:h.renderOrder,z:g,group:p},i[e]=b):(b.id=h.id,b.object=h,b.geometry=f,b.material=_,b.materialVariant=a(h),b.groupOrder=M,b.renderOrder=h.renderOrder,b.z=g,b.group=p),e++,b}function l(h,f,_,M,g,p,b){b.reversedDepth===!0&&(g=-g);let P=o(h,f,_,M,g,p);_.transmission>0?n.push(P):_.transparent===!0?r.push(P):t.push(P)}function c(h,f,_,M,g,p){let b=o(h,f,_,M,g,p);_.transmission>0?n.unshift(b):_.transparent===!0?r.unshift(b):t.unshift(b)}function u(h,f){t.length>1&&t.sort(h||Ox),n.length>1&&n.sort(f||sd),r.length>1&&r.sort(f||sd)}function d(){for(let h=e,f=i.length;h<f;h++){let _=i[h];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:l,unshift:c,finish:d,sort:u}}function Bx(){let i=new WeakMap;function e(n,r){let s=i.get(n),a;return s===void 0?(a=new ad,i.set(n,[a])):r>=s.length?(a=new ad,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function zx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new V,color:new qe};break;case"SpotLight":t={position:new V,direction:new V,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new V,halfWidth:new V,halfHeight:new V};break}return i[e.id]=t,t}}}function kx(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Gx=0;function Vx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Hx(i){let e=new zx,t=kx(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new V);let r=new V,s=new ke,a=new ke;function o(c){let u=0,d=0,h=0;for(let F=0;F<9;F++)n.probe[F].set(0,0,0);let f=0,_=0,M=0,g=0,p=0,b=0,P=0,S=0,w=0,E=0,L=0,m=0,y=0,R=0;c.sort(Vx);for(let F=0,D=c.length;F<D;F++){let A=c[F],U=A.color,Z=A.intensity,K=A.distance,ne=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===ei?ne=A.shadow.map.texture:ne=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)u+=U.r*Z,d+=U.g*Z,h+=U.b*Z;else if(A.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(A.sh.coefficients[N],Z);R++}else if(A.isSunLight){let N=e.get(A);if(N.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let W=A.shadow,C=t.get(A);C.shadowIntensity=W.intensity,C.shadowBias=W.bias,C.shadowNormalBias=W.normalBias,C.shadowRadius=W.radius,C.shadowMapSize.copy(W.mapSize).multiply(W.getFrameExtents()),n.sunShadow[_]=C,n.sunShadowMap[_]=ne;let Y=W.getViewportCount();for(let te=0;te<Y;te++)n.sunShadowMatrix[M+te]=W.getMatrix(te),n.sunShadowCascade[M+te]=W._cascadeData[te];M+=Y,_++}n.sun[f]=N,f++}else if(A.isDirectionalLight){let N=e.get(A);if(N.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){let W=A.shadow,C=t.get(A);C.shadowIntensity=W.intensity,C.shadowBias=W.bias,C.shadowNormalBias=W.normalBias,C.shadowRadius=W.radius,C.shadowMapSize=W.mapSize,n.directionalShadow[g]=C,n.directionalShadowMap[g]=ne,n.directionalShadowMatrix[g]=A.shadow.matrix,w++}n.directional[g]=N,g++}else if(A.isSpotLight){let N=e.get(A);N.position.setFromMatrixPosition(A.matrixWorld),N.color.copy(U).multiplyScalar(Z),N.distance=K,N.coneCos=Math.cos(A.angle),N.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),N.decay=A.decay,n.spot[b]=N;let W=A.shadow;if(A.map&&(n.spotLightMap[m]=A.map,m++,W.updateMatrices(A),A.castShadow&&y++),n.spotLightMatrix[b]=W.matrix,A.castShadow){let C=t.get(A);C.shadowIntensity=W.intensity,C.shadowBias=W.bias,C.shadowNormalBias=W.normalBias,C.shadowRadius=W.radius,C.shadowMapSize=W.mapSize,n.spotShadow[b]=C,n.spotShadowMap[b]=ne,L++}b++}else if(A.isRectAreaLight){let N=e.get(A);N.color.copy(U).multiplyScalar(Z),N.halfWidth.set(A.width*.5,0,0),N.halfHeight.set(0,A.height*.5,0),n.rectArea[P]=N,P++}else if(A.isPointLight){let N=e.get(A);if(N.color.copy(A.color).multiplyScalar(A.intensity),N.distance=A.distance,N.decay=A.decay,A.castShadow){let W=A.shadow,C=t.get(A);C.shadowIntensity=W.intensity,C.shadowBias=W.bias,C.shadowNormalBias=W.normalBias,C.shadowRadius=W.radius,C.shadowMapSize=W.mapSize,C.shadowCameraNear=W.camera.near,C.shadowCameraFar=W.camera.far,n.pointShadow[p]=C,n.pointShadowMap[p]=ne,n.pointShadowMatrix[p]=A.shadow.matrix,E++}n.point[p]=N,p++}else if(A.isHemisphereLight){let N=e.get(A);N.skyColor.copy(A.color).multiplyScalar(Z),N.groundColor.copy(A.groundColor).multiplyScalar(Z),n.hemi[S]=N,S++}}P>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let I=n.hash;(I.sunLength!==f||I.directionalLength!==g||I.pointLength!==p||I.spotLength!==b||I.rectAreaLength!==P||I.hemiLength!==S||I.numSunShadows!==_||I.numDirectionalShadows!==w||I.numPointShadows!==E||I.numSpotShadows!==L||I.numSpotMaps!==m||I.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=g,n.spot.length=b,n.rectArea.length=P,n.point.length=p,n.hemi.length=S,n.sunShadow.length=_,n.sunShadowMap.length=_,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=L,n.spotShadowMap.length=L,n.spotLightMatrix.length=L+m-y,n.spotLightMap.length=m,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=R,I.sunLength=f,I.directionalLength=g,I.pointLength=p,I.spotLength=b,I.rectAreaLength=P,I.hemiLength=S,I.numSunShadows=_,I.numDirectionalShadows=w,I.numPointShadows=E,I.numSpotShadows=L,I.numSpotMaps=m,I.numLightProbes=R,n.version=Gx++)}function l(c,u){let d=0,h=0,f=0,_=0,M=0,g=0,p=u.matrixWorldInverse;for(let b=0,P=c.length;b<P;b++){let S=c[b];if(S.isSunLight){let w=n.sun[d];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(p),d++}else if(S.isDirectionalLight){let w=n.directional[h];w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),h++}else if(S.isSpotLight){let w=n.spot[_];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),_++}else if(S.isRectAreaLight){let w=n.rectArea[M];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(p),a.identity(),s.copy(S.matrixWorld),s.premultiply(p),a.extractRotation(s),w.halfWidth.set(S.width*.5,0,0),w.halfHeight.set(0,S.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),M++}else if(S.isPointLight){let w=n.point[f];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){let w=n.hemi[g];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:n}}function od(i){let e=new Hx(i),t=[],n=[],r=[];function s(h){d.camera=h,t.length=0,n.length=0,r.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){r.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Wx(i){let e=new WeakMap;function t(r,s=0){let a=e.get(r),o;return a===void 0?(o=new od(i),e.set(r,[o])):s>=a.length?(o=new od(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Xx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qx=`uniform sampler2D shadow_pass;
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
}`,Yx=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],$x=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],ld=new ke,ia=new V,Hc=new V;function Zx(i,e,t){let n=new Kr,r=new We,s=new We,a=new Ke,o=new Ja,l=new Ka,c={},u=t.maxTextureSize,d={[Qn]:Ot,[Ot]:Qn,[Qt]:Qt},h=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:Xx,fragmentShader:qx}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let _=new dn;_.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Dt(_,h),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xs;let p=this.type;this.render=function(E,L,m){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;this.type===oh&&(Ue("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Xs);let y=i.getRenderTarget(),R=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Rn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let D=p!==this.type;D&&L.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(U=>U.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,U=E.length;A<U;A++){let Z=E[A],K=Z.shadow;if(K===void 0){Ue("WebGLShadowMap:",Z,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;r.copy(K.mapSize);let ne=K.getFrameExtents();r.multiply(ne),s.copy(K.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ne.x),r.x=s.x*ne.x,K.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ne.y),r.y=s.y*ne.y,K.mapSize.y=s.y));let N=i.state.buffers.depth.getReversed();if(K.camera._reversedDepth=N,K.map===null||D===!0){if(K.map!==null&&(K.map.depthTexture!==null&&(K.map.depthTexture.dispose(),K.map.depthTexture=null),K.map.dispose()),this.type===Qr){if(Z.isPointLight){Ue("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}K.map=new jt(r.x,r.y,{format:ei,type:Hn,minFilter:Lt,magFilter:Lt,generateMipmaps:!1}),K.map.texture.name=Z.name+".shadowMap",K.map.depthTexture=new Gi(r.x,r.y,bn),K.map.depthTexture.name=Z.name+".shadowMapDepth",K.map.depthTexture.format=Zn,K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=Pt,K.map.depthTexture.magFilter=Pt}else Z.isPointLight?(K.map=new al(r.x),K.map.depthTexture=new Za(r.x,Vn)):(K.map=new jt(r.x,r.y),K.map.depthTexture=new Gi(r.x,r.y,Vn)),K.map.depthTexture.name=Z.name+".shadowMap",K.map.depthTexture.format=Zn,this.type===Xs?(K.map.depthTexture.compareFunction=N?nl:tl,K.map.depthTexture.minFilter=Lt,K.map.depthTexture.magFilter=Lt):(K.map.depthTexture.compareFunction=null,K.map.depthTexture.minFilter=Pt,K.map.depthTexture.magFilter=Pt);K.camera.updateProjectionMatrix()}K.map.isWebGLCubeRenderTarget!==!0&&(K.map.width!==r.x||K.map.height!==r.y)&&K.map.setSize(r.x,r.y);let W=K.map.isWebGLCubeRenderTarget?6:K.getViewportCount();Z.isPointLight!==!0&&K.updateMatrices(Z,m);for(let C=0;C<W;C++){let Y=K.getCamera(C);if(Z.isPointLight){let te=K.camera,xe=K.matrix,ce=Z.distance||te.far;ce!==te.far&&(te.far=ce,te.updateProjectionMatrix()),ia.setFromMatrixPosition(Z.matrixWorld),te.position.copy(ia),Hc.copy(te.position),Hc.add(Yx[C]),te.up.copy($x[C]),te.lookAt(Hc),te.updateMatrixWorld(),xe.makeTranslation(-ia.x,-ia.y,-ia.z),ld.multiplyMatrices(te.projectionMatrix,te.matrixWorldInverse),K._frustum.setFromProjectionMatrix(ld,te.coordinateSystem,te.reversedDepth)}if(K.map.isWebGLCubeRenderTarget)i.setRenderTarget(K.map,C),i.clear();else{C===0&&(i.setRenderTarget(K.map),i.clear());let te=K.getViewport(C);a.set(s.x*te.x,s.y*te.y,s.x*te.z,s.y*te.w),F.viewport(a)}n=K.getFrustum(C),S(L,m,Y,Z,this.type)}K.isPointLightShadow!==!0&&this.type===Qr&&b(K,m),K.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(y,R,I)};function b(E,L){let m=e.update(M);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new jt(r.x,r.y,{format:ei,type:Hn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value.set(E.map.width,E.map.height),h.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(L,null,m,h,M,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(L,null,m,f,M,null)}function P(E,L,m,y){let R=null,I=m.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(I!==void 0)R=I;else if(R=m.isPointLight===!0?l:o,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){let F=R.uuid,D=L.uuid,A=c[F];A===void 0&&(A={},c[F]=A);let U=A[D];U===void 0&&(U=R.clone(),A[D]=U,L.addEventListener("dispose",w)),R=U}if(R.visible=L.visible,R.wireframe=L.wireframe,y===Qr?R.side=L.shadowSide!==null?L.shadowSide:L.side:R.side=L.shadowSide!==null?L.shadowSide:d[L.side],R.alphaMap=L.alphaMap,R.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,R.map=L.map,R.clipShadows=L.clipShadows,R.clippingPlanes=L.clippingPlanes,R.clipIntersection=L.clipIntersection,R.displacementMap=L.displacementMap,R.displacementScale=L.displacementScale,R.displacementBias=L.displacementBias,R.wireframeLinewidth=L.wireframeLinewidth,R.linewidth=L.linewidth,m.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let F=i.properties.get(R);F.light=m}return R}function S(E,L,m,y,R){if(E.visible===!1)return;if(E.layers.test(L.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===Qr)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(m.matrixWorldInverse,E.matrixWorld);let D=e.update(E),A=E.material;if(Array.isArray(A)){let U=D.groups;for(let Z=0,K=U.length;Z<K;Z++){let ne=U[Z],N=A[ne.materialIndex];if(N&&N.visible){let W=P(E,N,y,R);E.onBeforeShadow(i,E,L,m,D,W,ne),i.renderBufferDirect(m,null,D,W,E,ne),E.onAfterShadow(i,E,L,m,D,W,ne)}}}else if(A.visible){let U=P(E,A,y,R);E.onBeforeShadow(i,E,L,m,D,U,null),i.renderBufferDirect(m,null,D,U,E,null),E.onAfterShadow(i,E,L,m,D,U,null)}}let F=E.children;for(let D=0,A=F.length;D<A;D++)S(F[D],L,m,y,R)}function w(E){E.target.removeEventListener("dispose",w);for(let m in c){let y=c[m],R=E.target.uuid;R in y&&(y[R].dispose(),delete y[R])}}}function Jx(i,e){function t(){let k=!1,me=new Ke,ie=null,ge=new Ke(0,0,0,0);return{setMask:function(Se){ie!==Se&&!k&&(i.colorMask(Se,Se,Se,Se),ie=Se)},setLocked:function(Se){k=Se},setClear:function(Se,ae,De,Ce,ft){ft===!0&&(Se*=Ce,ae*=Ce,De*=Ce),me.set(Se,ae,De,Ce),ge.equals(me)===!1&&(i.clearColor(Se,ae,De,Ce),ge.copy(me))},reset:function(){k=!1,ie=null,ge.set(-1,0,0,0)}}}function n(){let k=!1,me=!1,ie=null,ge=null,Se=null;return{setReversed:function(ae){if(me!==ae){let De=e.get("EXT_clip_control");ae?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),me=ae;let Ce=Se;Se=null,this.setClear(Ce)}},getReversed:function(){return me},setTest:function(ae){ae?O(i.DEPTH_TEST):j(i.DEPTH_TEST)},setMask:function(ae){ie!==ae&&!k&&(i.depthMask(ae),ie=ae)},setFunc:function(ae){if(me&&(ae=Bh[ae]),ge!==ae){switch(ae){case Fa:i.depthFunc(i.NEVER);break;case Na:i.depthFunc(i.ALWAYS);break;case Ua:i.depthFunc(i.LESS);break;case Wr:i.depthFunc(i.LEQUAL);break;case Oa:i.depthFunc(i.EQUAL);break;case Ba:i.depthFunc(i.GEQUAL);break;case za:i.depthFunc(i.GREATER);break;case ka:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ge=ae}},setLocked:function(ae){k=ae},setClear:function(ae){Se!==ae&&(Se=ae,me&&(ae=1-ae),i.clearDepth(ae))},reset:function(){k=!1,ie=null,ge=null,Se=null,me=!1}}}function r(){let k=!1,me=null,ie=null,ge=null,Se=null,ae=null,De=null,Ce=null,ft=null;return{setTest:function(st){k||(st?O(i.STENCIL_TEST):j(i.STENCIL_TEST))},setMask:function(st){me!==st&&!k&&(i.stencilMask(st),me=st)},setFunc:function(st,Dn,qn){(ie!==st||ge!==Dn||Se!==qn)&&(i.stencilFunc(st,Dn,qn),ie=st,ge=Dn,Se=qn)},setOp:function(st,Dn,qn){(ae!==st||De!==Dn||Ce!==qn)&&(i.stencilOp(st,Dn,qn),ae=st,De=Dn,Ce=qn)},setLocked:function(st){k=st},setClear:function(st){ft!==st&&(i.clearStencil(st),ft=st)},reset:function(){k=!1,me=null,ie=null,ge=null,Se=null,ae=null,De=null,Ce=null,ft=null}}}let s=new t,a=new n,o=new r,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,_=[],M=null,g=!1,p=null,b=null,P=null,S=null,w=null,E=null,L=null,m=new qe(0,0,0),y=0,R=!1,I=null,F=null,D=null,A=null,U=null,Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),K=!1,ne=0,N=i.getParameter(i.VERSION);N.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(N)[1]),K=ne>=1):N.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),K=ne>=2);let W=null,C={},Y=i.getParameter(i.SCISSOR_BOX),te=i.getParameter(i.VIEWPORT),xe=new Ke().fromArray(Y),ce=new Ke().fromArray(te);function le(k,me,ie,ge){let Se=new Uint8Array(4),ae=i.createTexture();i.bindTexture(k,ae),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<ie;De++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(me,0,i.RGBA,1,1,ge,0,i.RGBA,i.UNSIGNED_BYTE,Se):i.texImage2D(me+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Se);return ae}let H={};H[i.TEXTURE_2D]=le(i.TEXTURE_2D,i.TEXTURE_2D,1),H[i.TEXTURE_CUBE_MAP]=le(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),H[i.TEXTURE_2D_ARRAY]=le(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),H[i.TEXTURE_3D]=le(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),O(i.DEPTH_TEST),a.setFunc(Wr),Ge(!1),ct(uc),O(i.CULL_FACE),Re(Rn);function O(k){u[k]!==!0&&(i.enable(k),u[k]=!0)}function j(k){u[k]!==!1&&(i.disable(k),u[k]=!1)}function se(k,me){return h[k]!==me?(i.bindFramebuffer(k,me),h[k]=me,k===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=me),k===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=me),!0):!1}function oe(k,me){let ie=_,ge=!1;if(k){ie=f.get(me),ie===void 0&&(ie=[],f.set(me,ie));let Se=k.textures;if(ie.length!==Se.length||ie[0]!==i.COLOR_ATTACHMENT0){for(let ae=0,De=Se.length;ae<De;ae++)ie[ae]=i.COLOR_ATTACHMENT0+ae;ie.length=Se.length,ge=!0}}else ie[0]!==i.BACK&&(ie[0]=i.BACK,ge=!0);ge&&i.drawBuffers(ie)}function Ae(k){return M!==k?(i.useProgram(k),M=k,!0):!1}let $e={[hr]:i.FUNC_ADD,[lh]:i.FUNC_SUBTRACT,[ch]:i.FUNC_REVERSE_SUBTRACT};$e[uh]=i.MIN,$e[fo]=i.MAX;let ze={[hh]:i.ZERO,[qs]:i.ONE,[dh]:i.SRC_COLOR,[pc]:i.SRC_ALPHA,[_h]:i.SRC_ALPHA_SATURATE,[gh]:i.DST_COLOR,[ph]:i.DST_ALPHA,[fh]:i.ONE_MINUS_SRC_COLOR,[mc]:i.ONE_MINUS_SRC_ALPHA,[xh]:i.ONE_MINUS_DST_COLOR,[mh]:i.ONE_MINUS_DST_ALPHA,[vh]:i.CONSTANT_COLOR,[yh]:i.ONE_MINUS_CONSTANT_COLOR,[Sh]:i.CONSTANT_ALPHA,[Mh]:i.ONE_MINUS_CONSTANT_ALPHA};function Re(k,me,ie,ge,Se,ae,De,Ce,ft,st){if(k===Rn){g===!0&&(j(i.BLEND),g=!1);return}if(g===!1&&(O(i.BLEND),g=!0),k!==ho){if(k!==p||st!==R){if((b!==hr||w!==hr)&&(i.blendEquation(i.FUNC_ADD),b=hr,w=hr),st)switch(k){case es:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case hc:i.blendFunc(i.ONE,i.ONE);break;case dc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case fc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",k);break}else switch(k){case es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case hc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case dc:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fc:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",k);break}P=null,S=null,E=null,L=null,m.set(0,0,0),y=0,p=k,R=st}return}Se=Se||me,ae=ae||ie,De=De||ge,(me!==b||Se!==w)&&(i.blendEquationSeparate($e[me],$e[Se]),b=me,w=Se),(ie!==P||ge!==S||ae!==E||De!==L)&&(i.blendFuncSeparate(ze[ie],ze[ge],ze[ae],ze[De]),P=ie,S=ge,E=ae,L=De),(Ce.equals(m)===!1||ft!==y)&&(i.blendColor(Ce.r,Ce.g,Ce.b,ft),m.copy(Ce),y=ft),p=k,R=!1}function tt(k,me){k.side===Qt?j(i.CULL_FACE):O(i.CULL_FACE);let ie=k.side===Ot;me&&(ie=!ie),Ge(ie),k.blending===es&&k.transparent===!1?Re(Rn):Re(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),s.setMask(k.colorWrite);let ge=k.stencilWrite;o.setTest(ge),ge&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),At(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?O(i.SAMPLE_ALPHA_TO_COVERAGE):j(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(k){I!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),I=k)}function ct(k){k!==sh?(O(i.CULL_FACE),k!==F&&(k===uc?i.cullFace(i.BACK):k===ah?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):j(i.CULL_FACE),F=k}function xt(k){k!==D&&(K&&i.lineWidth(k),D=k)}function At(k,me,ie){k?(O(i.POLYGON_OFFSET_FILL),(A!==me||U!==ie)&&(A=me,U=ie,a.getReversed()&&(me=-me),i.polygonOffset(me,ie))):j(i.POLYGON_OFFSET_FILL)}function Qe(k){k?O(i.SCISSOR_TEST):j(i.SCISSOR_TEST)}function nt(k){k===void 0&&(k=i.TEXTURE0+Z-1),W!==k&&(i.activeTexture(k),W=k)}function z(k,me,ie){ie===void 0&&(W===null?ie=i.TEXTURE0+Z-1:ie=W);let ge=C[ie];ge===void 0&&(ge={type:void 0,texture:void 0},C[ie]=ge),(ge.type!==k||ge.texture!==me)&&(W!==ie&&(i.activeTexture(ie),W=ie),i.bindTexture(k,me||H[k]),ge.type=k,ge.texture=me)}function je(){let k=C[W];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function Ne(){try{i.compressedTexImage2D(...arguments)}catch(k){Be("WebGLState:",k)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(k){Be("WebGLState:",k)}}function x(){try{i.texSubImage2D(...arguments)}catch(k){Be("WebGLState:",k)}}function G(){try{i.texSubImage3D(...arguments)}catch(k){Be("WebGLState:",k)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(k){Be("WebGLState:",k)}}function Q(){try{i.compressedTexSubImage3D(...arguments)}catch(k){Be("WebGLState:",k)}}function ue(){try{i.texStorage2D(...arguments)}catch(k){Be("WebGLState:",k)}}function de(){try{i.texStorage3D(...arguments)}catch(k){Be("WebGLState:",k)}}function ee(){try{i.texImage2D(...arguments)}catch(k){Be("WebGLState:",k)}}function re(){try{i.texImage3D(...arguments)}catch(k){Be("WebGLState:",k)}}function fe(k){return d[k]!==void 0?d[k]:i.getParameter(k)}function Ie(k,me){d[k]!==me&&(i.pixelStorei(k,me),d[k]=me)}function _e(k){xe.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),xe.copy(k))}function pe(k){ce.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),ce.copy(k))}function Le(k,me){let ie=c.get(me);ie===void 0&&(ie=new WeakMap,c.set(me,ie));let ge=ie.get(k);ge===void 0&&(ge=i.getUniformBlockIndex(me,k.name),ie.set(k,ge))}function Fe(k,me){let ge=c.get(me).get(k);l.get(me)!==ge&&(i.uniformBlockBinding(me,ge,k.__bindingPointIndex),l.set(me,ge))}function Ve(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},W=null,C={},h={},f=new WeakMap,_=[],M=null,g=!1,p=null,b=null,P=null,S=null,w=null,E=null,L=null,m=new qe(0,0,0),y=0,R=!1,I=null,F=null,D=null,A=null,U=null,xe.set(0,0,i.canvas.width,i.canvas.height),ce.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:O,disable:j,bindFramebuffer:se,drawBuffers:oe,useProgram:Ae,setBlending:Re,setMaterial:tt,setFlipSided:Ge,setCullFace:ct,setLineWidth:xt,setPolygonOffset:At,setScissorTest:Qe,activeTexture:nt,bindTexture:z,unbindTexture:je,compressedTexImage2D:Ne,compressedTexImage3D:T,texImage2D:ee,texImage3D:re,pixelStorei:Ie,getParameter:fe,updateUBOMapping:Le,uniformBlockBinding:Fe,texStorage2D:ue,texStorage3D:de,texSubImage2D:x,texSubImage3D:G,compressedTexSubImage2D:$,compressedTexSubImage3D:Q,scissor:_e,viewport:pe,reset:Ve}}function Kx(i,e,t,n,r,s,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new We,u=new WeakMap,d=new Set,h,f=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(T,x){return _?new OffscreenCanvas(T,x):Rs("canvas")}function g(T,x,G){let $=1,Q=Ne(T);if((Q.width>G||Q.height>G)&&($=G/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let ue=Math.floor($*Q.width),de=Math.floor($*Q.height);h===void 0&&(h=M(ue,de));let ee=x?M(ue,de):h;return ee.width=ue,ee.height=de,ee.getContext("2d").drawImage(T,0,0,ue,de),Ue("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ue+"x"+de+")."),ee}else return"data"in T&&Ue("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function p(T){return T.generateMipmaps}function b(T){i.generateMipmap(T)}function P(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(T,x,G,$,Q,ue=!1){if(T!==null){if(i[T]!==void 0)return i[T];Ue("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let de;$&&(de=e.get("EXT_texture_norm16"),de||Ue("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=x;if(x===i.RED&&(G===i.FLOAT&&(ee=i.R32F),G===i.HALF_FLOAT&&(ee=i.R16F),G===i.UNSIGNED_BYTE&&(ee=i.R8),G===i.UNSIGNED_SHORT&&de&&(ee=de.R16_EXT),G===i.SHORT&&de&&(ee=de.R16_SNORM_EXT)),x===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.R8UI),G===i.UNSIGNED_SHORT&&(ee=i.R16UI),G===i.UNSIGNED_INT&&(ee=i.R32UI),G===i.BYTE&&(ee=i.R8I),G===i.SHORT&&(ee=i.R16I),G===i.INT&&(ee=i.R32I)),x===i.RG&&(G===i.FLOAT&&(ee=i.RG32F),G===i.HALF_FLOAT&&(ee=i.RG16F),G===i.UNSIGNED_BYTE&&(ee=i.RG8),G===i.UNSIGNED_SHORT&&de&&(ee=de.RG16_EXT),G===i.SHORT&&de&&(ee=de.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RG8UI),G===i.UNSIGNED_SHORT&&(ee=i.RG16UI),G===i.UNSIGNED_INT&&(ee=i.RG32UI),G===i.BYTE&&(ee=i.RG8I),G===i.SHORT&&(ee=i.RG16I),G===i.INT&&(ee=i.RG32I)),x===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),G===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),G===i.UNSIGNED_INT&&(ee=i.RGB32UI),G===i.BYTE&&(ee=i.RGB8I),G===i.SHORT&&(ee=i.RGB16I),G===i.INT&&(ee=i.RGB32I)),x===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),G===i.UNSIGNED_INT&&(ee=i.RGBA32UI),G===i.BYTE&&(ee=i.RGBA8I),G===i.SHORT&&(ee=i.RGBA16I),G===i.INT&&(ee=i.RGBA32I)),x===i.RGB&&(G===i.UNSIGNED_SHORT&&de&&(ee=de.RGB16_EXT),G===i.SHORT&&de&&(ee=de.RGB16_SNORM_EXT),G===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(ee=i.R11F_G11F_B10F)),x===i.RGBA){let re=ue?Cs:Je.getTransfer(Q);G===i.FLOAT&&(ee=i.RGBA32F),G===i.HALF_FLOAT&&(ee=i.RGBA16F),G===i.UNSIGNED_BYTE&&(ee=re===ot?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT&&de&&(ee=de.RGBA16_EXT),G===i.SHORT&&de&&(ee=de.RGBA16_SNORM_EXT),G===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function w(T,x){let G;return T?x===null||x===Vn||x===ns?G=i.DEPTH24_STENCIL8:x===bn?G=i.DEPTH32F_STENCIL8:x===ts&&(G=i.DEPTH24_STENCIL8,Ue("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Vn||x===ns?G=i.DEPTH_COMPONENT24:x===bn?G=i.DEPTH_COMPONENT32F:x===ts&&(G=i.DEPTH_COMPONENT16),G}function E(T,x){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==Pt&&T.minFilter!==Lt?Math.log2(Math.max(x.width,x.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?x.mipmaps.length:1}function L(T){let x=T.target;x.removeEventListener("dispose",L),y(x),x.isVideoTexture&&u.delete(x),x.isHTMLTexture&&d.delete(x)}function m(T){let x=T.target;x.removeEventListener("dispose",m),I(x)}function y(T){let x=n.get(T);if(x.__webglInit===void 0)return;let G=T.source,$=f.get(G);if($){let Q=$[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&R(T),Object.keys($).length===0&&f.delete(G)}n.remove(T)}function R(T){let x=n.get(T);i.deleteTexture(x.__webglTexture);let G=T.source,$=f.get(G);delete $[x.__cacheKey],a.memory.textures--}function I(T){let x=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(x.__webglFramebuffer[$]))for(let Q=0;Q<x.__webglFramebuffer[$].length;Q++)i.deleteFramebuffer(x.__webglFramebuffer[$][Q]);else i.deleteFramebuffer(x.__webglFramebuffer[$]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[$])}else{if(Array.isArray(x.__webglFramebuffer))for(let $=0;$<x.__webglFramebuffer.length;$++)i.deleteFramebuffer(x.__webglFramebuffer[$]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let $=0;$<x.__webglColorRenderbuffer.length;$++)x.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[$]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let G=T.textures;for(let $=0,Q=G.length;$<Q;$++){let ue=n.get(G[$]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),a.memory.textures--),n.remove(G[$])}n.remove(T)}let F=0;function D(){F=0}function A(){return F}function U(T){F=T}function Z(){let T=F;return T>=r.maxTextures&&Ue("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+r.maxTextures),F+=1,T}function K(T){let x=[];return x.push(T.wrapS),x.push(T.wrapT),x.push(T.wrapR||0),x.push(T.magFilter),x.push(T.minFilter),x.push(T.anisotropy),x.push(T.internalFormat),x.push(T.format),x.push(T.type),x.push(T.generateMipmaps),x.push(T.premultiplyAlpha),x.push(T.flipY),x.push(T.unpackAlignment),x.push(T.colorSpace),x.join()}function ne(T,x){let G=n.get(T);if(T.isVideoTexture&&z(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&G.__version!==T.version){let $=T.image;if($===null)Ue("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ue("WebGLRenderer: Texture marked for update but image is incomplete");else{j(G,T,x);return}}else T.isExternalTexture&&(G.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+x)}function N(T,x){let G=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&G.__version!==T.version){j(G,T,x);return}else T.isExternalTexture&&(G.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+x)}function W(T,x){let G=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&G.__version!==T.version){j(G,T,x);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+x)}function C(T,x){let G=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&G.__version!==T.version){se(G,T,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+x)}let Y={[Ga]:i.REPEAT,[yn]:i.CLAMP_TO_EDGE,[Va]:i.MIRRORED_REPEAT},te={[Pt]:i.NEAREST,[Eh]:i.NEAREST_MIPMAP_NEAREST,[$s]:i.NEAREST_MIPMAP_LINEAR,[Lt]:i.LINEAR,[xo]:i.LINEAR_MIPMAP_NEAREST,[Zi]:i.LINEAR_MIPMAP_LINEAR},xe={[Rh]:i.NEVER,[Fh]:i.ALWAYS,[Ph]:i.LESS,[tl]:i.LEQUAL,[Ih]:i.EQUAL,[nl]:i.GEQUAL,[Lh]:i.GREATER,[Dh]:i.NOTEQUAL};function ce(T,x){if(x.type===bn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Lt||x.magFilter===xo||x.magFilter===$s||x.magFilter===Zi||x.minFilter===Lt||x.minFilter===xo||x.minFilter===$s||x.minFilter===Zi)&&Ue("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Y[x.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Y[x.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Y[x.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,te[x.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,te[x.minFilter]),x.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,xe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Pt||x.minFilter!==$s&&x.minFilter!==Zi||x.type===bn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function le(T,x){let G=!1;T.__webglInit===void 0&&(T.__webglInit=!0,x.addEventListener("dispose",L));let $=x.source,Q=f.get($);Q===void 0&&(Q={},f.set($,Q));let ue=K(x);if(ue!==T.__cacheKey){Q[ue]===void 0&&(Q[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),Q[ue].usedTimes++;let de=Q[T.__cacheKey];de!==void 0&&(Q[T.__cacheKey].usedTimes--,de.usedTimes===0&&R(x)),T.__cacheKey=ue,T.__webglTexture=Q[ue].texture}return G}function H(T,x,G){return Math.floor(Math.floor(T/G)/x)}function O(T,x,G,$){let ue=T.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,G,$,x.data);else{ue.sort((Ie,_e)=>Ie.start-_e.start);let de=0;for(let Ie=1;Ie<ue.length;Ie++){let _e=ue[de],pe=ue[Ie],Le=_e.start+_e.count,Fe=H(pe.start,x.width,4),Ve=H(_e.start,x.width,4);pe.start<=Le+1&&Fe===Ve&&H(pe.start+pe.count-1,x.width,4)===Fe?_e.count=Math.max(_e.count,pe.start+pe.count-_e.start):(++de,ue[de]=pe)}ue.length=de+1;let ee=t.getParameter(i.UNPACK_ROW_LENGTH),re=t.getParameter(i.UNPACK_SKIP_PIXELS),fe=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Ie=0,_e=ue.length;Ie<_e;Ie++){let pe=ue[Ie],Le=Math.floor(pe.start/4),Fe=Math.ceil(pe.count/4),Ve=Le%x.width,k=Math.floor(Le/x.width),me=Fe,ie=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(i.UNPACK_SKIP_ROWS,k),t.texSubImage2D(i.TEXTURE_2D,0,Ve,k,me,ie,G,$,x.data)}T.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ee),t.pixelStorei(i.UNPACK_SKIP_PIXELS,re),t.pixelStorei(i.UNPACK_SKIP_ROWS,fe)}}function j(T,x,G){let $=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&($=i.TEXTURE_3D);let Q=le(T,x),ue=x.source;t.bindTexture($,T.__webglTexture,i.TEXTURE0+G);let de=n.get(ue);if(ue.version!==de.__version||Q===!0){if(t.activeTexture(i.TEXTURE0+G),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let ie=Je.getPrimaries(Je.workingColorSpace),ge=x.colorSpace===bi?null:Je.getPrimaries(x.colorSpace),Se=x.colorSpace===bi||ie===ge?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let re=g(x.image,!1,r.maxTextureSize);re=je(x,re);let fe=s.convert(x.format,x.colorSpace),Ie=s.convert(x.type),_e=S(x.internalFormat,fe,Ie,x.normalized,x.colorSpace,x.isVideoTexture);ce($,x);let pe,Le=x.mipmaps,Fe=x.isVideoTexture!==!0,Ve=de.__version===void 0||Q===!0,k=ue.dataReady,me=E(x,re);if(x.isDepthTexture)_e=w(x.format===Ji,x.type),Ve&&(Fe?t.texStorage2D(i.TEXTURE_2D,1,_e,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,_e,re.width,re.height,0,fe,Ie,null));else if(x.isDataTexture)if(Le.length>0){Fe&&Ve&&t.texStorage2D(i.TEXTURE_2D,me,_e,Le[0].width,Le[0].height);for(let ie=0,ge=Le.length;ie<ge;ie++)pe=Le[ie],Fe?k&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,pe.width,pe.height,fe,Ie,pe.data):t.texImage2D(i.TEXTURE_2D,ie,_e,pe.width,pe.height,0,fe,Ie,pe.data);x.generateMipmaps=!1}else Fe?(Ve&&t.texStorage2D(i.TEXTURE_2D,me,_e,re.width,re.height),k&&O(x,re,fe,Ie)):t.texImage2D(i.TEXTURE_2D,0,_e,re.width,re.height,0,fe,Ie,re.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Fe&&Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,_e,Le[0].width,Le[0].height,re.depth);for(let ie=0,ge=Le.length;ie<ge;ie++)if(pe=Le[ie],x.format!==Pn)if(fe!==null)if(Fe){if(k)if(x.layerUpdates.size>0){let Se=Oc(pe.width,pe.height,x.format,x.type);for(let ae of x.layerUpdates){let De=pe.data.subarray(ae*Se/pe.data.BYTES_PER_ELEMENT,(ae+1)*Se/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,ae,pe.width,pe.height,1,fe,De)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,pe.width,pe.height,re.depth,fe,pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ie,_e,pe.width,pe.height,re.depth,0,pe.data,0,0);else Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Fe?k&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ie,0,0,0,pe.width,pe.height,re.depth,fe,Ie,pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ie,_e,pe.width,pe.height,re.depth,0,fe,Ie,pe.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Fe&&Ve&&t.texStorage2D(i.TEXTURE_2D,me,_e,Le[0].width,Le[0].height);for(let ie=0,ge=Le.length;ie<ge;ie++)pe=Le[ie],x.format!==Pn?fe!==null?Fe?k&&t.compressedTexSubImage2D(i.TEXTURE_2D,ie,0,0,pe.width,pe.height,fe,pe.data):t.compressedTexImage2D(i.TEXTURE_2D,ie,_e,pe.width,pe.height,0,pe.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Fe?k&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,pe.width,pe.height,fe,Ie,pe.data):t.texImage2D(i.TEXTURE_2D,ie,_e,pe.width,pe.height,0,fe,Ie,pe.data)}else if(x.isDataArrayTexture)if(Fe){if(Ve&&t.texStorage3D(i.TEXTURE_2D_ARRAY,me,_e,re.width,re.height,re.depth),k)if(x.layerUpdates.size>0){let ie=Oc(re.width,re.height,x.format,x.type);for(let ge of x.layerUpdates){let Se=re.data.subarray(ge*ie/re.data.BYTES_PER_ELEMENT,(ge+1)*ie/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ge,re.width,re.height,1,fe,Ie,Se)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,fe,Ie,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,_e,re.width,re.height,re.depth,0,fe,Ie,re.data);else if(x.isData3DTexture)Fe?(Ve&&t.texStorage3D(i.TEXTURE_3D,me,_e,re.width,re.height,re.depth),k&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,fe,Ie,re.data)):t.texImage3D(i.TEXTURE_3D,0,_e,re.width,re.height,re.depth,0,fe,Ie,re.data);else if(x.isFramebufferTexture){if(Ve)if(Fe)t.texStorage2D(i.TEXTURE_2D,me,_e,re.width,re.height);else{let ie=re.width,ge=re.height;for(let Se=0;Se<me;Se++)t.texImage2D(i.TEXTURE_2D,Se,_e,ie,ge,0,fe,Ie,null),ie>>=1,ge>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let ie=i.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),re.parentNode!==ie){ie.appendChild(re),d.add(x),ie.onpaint=ge=>{let Se=ge.changedElements;for(let ae of d)Se.includes(ae.image)&&(ae.needsUpdate=!0)},ie.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,re);else{let Se=i.RGBA,ae=i.RGBA,De=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Se,ae,De,re)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Le.length>0){if(Fe&&Ve){let ie=Ne(Le[0]);t.texStorage2D(i.TEXTURE_2D,me,_e,ie.width,ie.height)}for(let ie=0,ge=Le.length;ie<ge;ie++)pe=Le[ie],Fe?k&&t.texSubImage2D(i.TEXTURE_2D,ie,0,0,fe,Ie,pe):t.texImage2D(i.TEXTURE_2D,ie,_e,fe,Ie,pe);x.generateMipmaps=!1}else if(Fe){if(Ve){let ie=Ne(re);t.texStorage2D(i.TEXTURE_2D,me,_e,ie.width,ie.height)}k&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,Ie,re)}else t.texImage2D(i.TEXTURE_2D,0,_e,fe,Ie,re);p(x)&&b($),de.__version=ue.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function se(T,x,G){if(x.image.length!==6)return;let $=le(T,x),Q=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+G);let ue=n.get(Q);if(Q.version!==ue.__version||$===!0){t.activeTexture(i.TEXTURE0+G);let de=Je.getPrimaries(Je.workingColorSpace),ee=x.colorSpace===bi?null:Je.getPrimaries(x.colorSpace),re=x.colorSpace===bi||de===ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);let fe=x.isCompressedTexture||x.image[0].isCompressedTexture,Ie=x.image[0]&&x.image[0].isDataTexture,_e=[];for(let ae=0;ae<6;ae++)!fe&&!Ie?_e[ae]=g(x.image[ae],!0,r.maxCubemapSize):_e[ae]=Ie?x.image[ae].image:x.image[ae],_e[ae]=je(x,_e[ae]);let pe=_e[0],Le=s.convert(x.format,x.colorSpace),Fe=s.convert(x.type),Ve=S(x.internalFormat,Le,Fe,x.normalized,x.colorSpace),k=x.isVideoTexture!==!0,me=ue.__version===void 0||$===!0,ie=Q.dataReady,ge=E(x,pe);ce(i.TEXTURE_CUBE_MAP,x);let Se;if(fe){k&&me&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,Ve,pe.width,pe.height);for(let ae=0;ae<6;ae++){Se=_e[ae].mipmaps;for(let De=0;De<Se.length;De++){let Ce=Se[De];x.format!==Pn?Le!==null?k?ie&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,0,0,Ce.width,Ce.height,Le,Ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,Ve,Ce.width,Ce.height,0,Ce.data):Ue("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,0,0,Ce.width,Ce.height,Le,Fe,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De,Ve,Ce.width,Ce.height,0,Le,Fe,Ce.data)}}}else{if(Se=x.mipmaps,k&&me){Se.length>0&&ge++;let ae=Ne(_e[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ge,Ve,ae.width,ae.height)}for(let ae=0;ae<6;ae++)if(Ie){k?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,_e[ae].width,_e[ae].height,Le,Fe,_e[ae].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Ve,_e[ae].width,_e[ae].height,0,Le,Fe,_e[ae].data);for(let De=0;De<Se.length;De++){let ft=Se[De].image[ae].image;k?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,0,0,ft.width,ft.height,Le,Fe,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,Ve,ft.width,ft.height,0,Le,Fe,ft.data)}}else{k?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,Le,Fe,_e[ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Ve,Le,Fe,_e[ae]);for(let De=0;De<Se.length;De++){let Ce=Se[De];k?ie&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,0,0,Le,Fe,Ce.image[ae]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,De+1,Ve,Le,Fe,Ce.image[ae])}}}p(x)&&b(i.TEXTURE_CUBE_MAP),ue.__version=Q.version,x.onUpdate&&x.onUpdate(x)}T.__version=x.version}function oe(T,x,G,$,Q,ue){let de=s.convert(G.format,G.colorSpace),ee=s.convert(G.type),re=S(G.internalFormat,de,ee,G.normalized,G.colorSpace),fe=n.get(x),Ie=n.get(G);if(Ie.__renderTarget=x,!fe.__hasExternalTextures){let _e=Math.max(1,x.width>>ue),pe=Math.max(1,x.height>>ue);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,ue,re,_e,pe,x.depth,0,de,ee,null):t.texImage2D(Q,ue,re,_e,pe,0,de,ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),nt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Q,Ie.__webglTexture,0,Qe(x)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Q,Ie.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ae(T,x,G){if(i.bindRenderbuffer(i.RENDERBUFFER,T),x.depthBuffer){let $=x.depthTexture,Q=$&&$.isDepthTexture?$.type:null,ue=w(x.stencilBuffer,Q),de=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;nt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qe(x),ue,x.width,x.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe(x),ue,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ue,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,T)}else{let $=x.textures;for(let Q=0;Q<$.length;Q++){let ue=$[Q],de=s.convert(ue.format,ue.colorSpace),ee=s.convert(ue.type),re=S(ue.internalFormat,de,ee,ue.normalized,ue.colorSpace);nt(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qe(x),re,x.width,x.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe(x),re,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,re,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function $e(T,x,G){let $=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Q=n.get(x.depthTexture);if(Q.__renderTarget=x,(!Q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),$){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,x.depthTexture.addEventListener("dispose",L)),Q.__webglTexture===void 0){Q.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),ce(i.TEXTURE_CUBE_MAP,x.depthTexture);let fe=s.convert(x.depthTexture.format),Ie=s.convert(x.depthTexture.type),_e;x.depthTexture.format===Zn?_e=i.DEPTH_COMPONENT24:x.depthTexture.format===Ji&&(_e=i.DEPTH24_STENCIL8);for(let pe=0;pe<6;pe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,_e,x.width,x.height,0,fe,Ie,null)}}else ne(x.depthTexture,0);let ue=Q.__webglTexture,de=Qe(x),ee=$?i.TEXTURE_CUBE_MAP_POSITIVE_X+G:i.TEXTURE_2D,re=x.depthTexture.format===Ji?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===Zn)nt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ee,ue,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,re,ee,ue,0);else if(x.depthTexture.format===Ji)nt(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,re,ee,ue,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,re,ee,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ze(T){let x=n.get(T),G=T.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==T.depthTexture){let $=T.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),$){let Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=$}if(T.depthTexture&&!x.__autoAllocateDepthBuffer)if(G)for(let $=0;$<6;$++)$e(x.__webglFramebuffer[$],T,$);else{let $=T.texture.mipmaps;$&&$.length>0?$e(x.__webglFramebuffer[0],T,0):$e(x.__webglFramebuffer,T,0)}else if(G){x.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[$]),x.__webglDepthbuffer[$]===void 0)x.__webglDepthbuffer[$]=i.createRenderbuffer(),Ae(x.__webglDepthbuffer[$],T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=x.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ue)}}else{let $=T.texture.mipmaps;if($&&$.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Ae(x.__webglDepthbuffer,T,!1);else{let Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ue)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Re(T,x,G){let $=n.get(T);x!==void 0&&oe($.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&ze(T)}function tt(T){let x=T.texture,G=n.get(T),$=n.get(x);T.addEventListener("dispose",m);let Q=T.textures,ue=T.isWebGLCubeRenderTarget===!0,de=Q.length>1;if(de||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=x.version,a.memory.textures++),ue){G.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer[ee]=[];for(let re=0;re<x.mipmaps.length;re++)G.__webglFramebuffer[ee][re]=i.createFramebuffer()}else G.__webglFramebuffer[ee]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer=[];for(let ee=0;ee<x.mipmaps.length;ee++)G.__webglFramebuffer[ee]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(de)for(let ee=0,re=Q.length;ee<re;ee++){let fe=n.get(Q[ee]);fe.__webglTexture===void 0&&(fe.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&nt(T)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ee=0;ee<Q.length;ee++){let re=Q[ee];G.__webglColorRenderbuffer[ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[ee]);let fe=s.convert(re.format,re.colorSpace),Ie=s.convert(re.type),_e=S(re.internalFormat,fe,Ie,re.normalized,re.colorSpace,T.isXRRenderTarget===!0),pe=Qe(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,_e,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ee,i.RENDERBUFFER,G.__webglColorRenderbuffer[ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Ae(G.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ce(i.TEXTURE_CUBE_MAP,x);for(let ee=0;ee<6;ee++)if(x.mipmaps&&x.mipmaps.length>0)for(let re=0;re<x.mipmaps.length;re++)oe(G.__webglFramebuffer[ee][re],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,re);else oe(G.__webglFramebuffer[ee],T,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);p(x)&&b(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let ee=0,re=Q.length;ee<re;ee++){let fe=Q[ee],Ie=n.get(fe),_e=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(_e=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(_e,Ie.__webglTexture),ce(_e,fe),oe(G.__webglFramebuffer,T,fe,i.COLOR_ATTACHMENT0+ee,_e,0),p(fe)&&b(_e)}t.unbindTexture()}else{let ee=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ee=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,$.__webglTexture),ce(ee,x),x.mipmaps&&x.mipmaps.length>0)for(let re=0;re<x.mipmaps.length;re++)oe(G.__webglFramebuffer[re],T,x,i.COLOR_ATTACHMENT0,ee,re);else oe(G.__webglFramebuffer,T,x,i.COLOR_ATTACHMENT0,ee,0);p(x)&&b(ee),t.unbindTexture()}T.depthBuffer&&ze(T)}function Ge(T){let x=T.textures;for(let G=0,$=x.length;G<$;G++){let Q=x[G];if(p(Q)){let ue=P(T),de=n.get(Q).__webglTexture;t.bindTexture(ue,de),b(ue),t.unbindTexture()}}}let ct=[],xt=[];function At(T){if(T.samples>0){if(nt(T)===!1){let x=T.textures,G=T.width,$=T.height,Q=i.COLOR_BUFFER_BIT,ue=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=n.get(T),ee=x.length>1;if(ee)for(let fe=0;fe<x.length;fe++)t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let re=T.texture.mipmaps;re&&re.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let fe=0;fe<x.length;fe++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,de.__webglColorRenderbuffer[fe]);let Ie=n.get(x[fe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ie,0)}i.blitFramebuffer(0,0,G,$,0,0,G,$,Q,i.NEAREST),l===!0&&(ct.length=0,xt.length=0,ct.push(i.COLOR_ATTACHMENT0+fe),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&(ct.push(ue),xt.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,xt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ee)for(let fe=0;fe<x.length;fe++){t.bindFramebuffer(i.FRAMEBUFFER,de.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.RENDERBUFFER,de.__webglColorRenderbuffer[fe]);let Ie=n.get(x[fe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,de.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+fe,i.TEXTURE_2D,Ie,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){let x=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Qe(T){return Math.min(r.maxSamples,T.samples)}function nt(T){let x=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function z(T){let x=a.render.frame;u.get(T)!==x&&(u.set(T,x),T.update())}function je(T,x){let G=T.colorSpace,$=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||G!==As&&G!==bi&&(Je.getTransfer(G)===ot?($!==Pn||Q!==fn)&&Ue("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",G)),x}function Ne(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=Z,this.resetTextureUnits=D,this.getTextureUnits=A,this.setTextureUnits=U,this.setTexture2D=ne,this.setTexture2DArray=N,this.setTexture3D=W,this.setTextureCube=C,this.rebindTextures=Re,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=nt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function jx(i,e){function t(n,r=bi){let s,a=Je.getTransfer(r);if(n===fn)return i.UNSIGNED_BYTE;if(n===vo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===yo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Tc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ac)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===wc)return i.BYTE;if(n===Ec)return i.SHORT;if(n===ts)return i.UNSIGNED_SHORT;if(n===_o)return i.INT;if(n===Vn)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===Hn)return i.HALF_FLOAT;if(n===Cc)return i.ALPHA;if(n===Rc)return i.RGB;if(n===Pn)return i.RGBA;if(n===Zn)return i.DEPTH_COMPONENT;if(n===Ji)return i.DEPTH_STENCIL;if(n===Pc)return i.RED;if(n===So)return i.RED_INTEGER;if(n===ei)return i.RG;if(n===Mo)return i.RG_INTEGER;if(n===bo)return i.RGBA_INTEGER;if(n===Zs||n===Js||n===Ks||n===js)if(a===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Zs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Js)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ks)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===js)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Zs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Js)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ks)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===js)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wo||n===Eo||n===To||n===Ao)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===wo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Eo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===To)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ao)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Co||n===Ro||n===Po||n===Io||n===Lo||n===Qs||n===Do)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Co||n===Ro)return a===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Po)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===Io)return s.COMPRESSED_R11_EAC;if(n===Lo)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Qs)return s.COMPRESSED_RG11_EAC;if(n===Do)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Fo||n===No||n===Uo||n===Oo||n===Bo||n===zo||n===ko||n===Go||n===Vo||n===Ho||n===Wo||n===Xo||n===qo||n===Yo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Fo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===No)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Uo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ko)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Go)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Vo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ho)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Wo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Yo)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===$o||n===Zo||n===Jo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===$o)return a===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Jo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ko||n===jo||n===ea||n===Qo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ko)return s.COMPRESSED_RED_RGTC1_EXT;if(n===jo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ea)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Qx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,e_=`
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

}`,Kc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Us(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sn({vertexShader:Qx,fragmentShader:e_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Dt(new Hi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},jc=class extends Jn{constructor(e,t){super();let n=this,r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,_=null,M=typeof XRWebGLBinding<"u",g=new Kc,p={},b=t.getContextAttributes(),P=null,S=null,w=[],E=[],L=new We,m=null,y=null,R=new un;R.viewport=new Ke;let I=new un;I.viewport=new Ke;let F=[R,I],D=new uo,A=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let O=w[H];return O===void 0&&(O=new Zr,w[H]=O),O.getTargetRaySpace()},this.getControllerGrip=function(H){let O=w[H];return O===void 0&&(O=new Zr,w[H]=O),O.getGripSpace()},this.getHand=function(H){let O=w[H];return O===void 0&&(O=new Zr,w[H]=O),O.getHandSpace()};function Z(H){let O=E.indexOf(H.inputSource);if(O===-1)return;let j=w[O];j!==void 0&&(j.update(H.inputSource,H.frame,c||a),j.dispatchEvent({type:H.type,data:H.inputSource}))}function K(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",ne);for(let H=0;H<w.length;H++){let O=E[H];O!==null&&(E[H]=null,w[H].disconnect(O))}A=null,U=null,g.reset();for(let H in p)delete p[H];if(e.setRenderTarget(P),f=null,h=null,d=null,r=null,S=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(m),e.setSize(L.width,L.height,!1),y!==null){let H=y.camera;H.fov=y.fov,H.zoom=y.zoom,H.updateProjectionMatrix(),y=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,n.isPresenting===!0&&Ue("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,n.isPresenting===!0&&Ue("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&M&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(H){if(r=H,r!==null){if(P=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",K),r.addEventListener("inputsourceschange",ne),b.xrCompatible!==!0&&await t.makeXRCompatible(),m=e.getPixelRatio(),e.getSize(L),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let j=null,se=null,oe=null;b.depth&&(oe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,j=b.stencil?Ji:Zn,se=b.stencil?ns:Vn);let Ae={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};d=this.getBinding(),h=d.createProjectionLayer(Ae),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new jt(h.textureWidth,h.textureHeight,{format:Pn,type:fn,depthTexture:new Gi(h.textureWidth,h.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let j={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,j),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new jt(f.framebufferWidth,f.framebufferHeight,{format:Pn,type:fn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),le.setContext(r),le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ne(H){for(let O=0;O<H.removed.length;O++){let j=H.removed[O],se=E.indexOf(j);se>=0&&(E[se]=null,w[se].disconnect(j))}for(let O=0;O<H.added.length;O++){let j=H.added[O],se=E.indexOf(j);if(se===-1){for(let Ae=0;Ae<w.length;Ae++)if(Ae>=E.length){E.push(j),se=Ae;break}else if(E[Ae]===null){E[Ae]=j,se=Ae;break}if(se===-1)break}let oe=w[se];oe&&oe.connect(j)}}let N=new V,W=new V;function C(H,O,j){N.setFromMatrixPosition(O.matrixWorld),W.setFromMatrixPosition(j.matrixWorld);let se=N.distanceTo(W),oe=O.projectionMatrix.elements,Ae=j.projectionMatrix.elements,$e=oe[14]/(oe[10]-1),ze=oe[14]/(oe[10]+1),Re=(oe[9]+1)/oe[5],tt=(oe[9]-1)/oe[5],Ge=(oe[8]-1)/oe[0],ct=(Ae[8]+1)/Ae[0],xt=$e*Ge,At=$e*ct,Qe=se/(-Ge+ct),nt=Qe*-Ge;if(O.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(nt),H.translateZ(Qe),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),oe[10]===-1)H.projectionMatrix.copy(O.projectionMatrix),H.projectionMatrixInverse.copy(O.projectionMatrixInverse);else{let z=$e+Qe,je=ze+Qe,Ne=xt-nt,T=At+(se-nt),x=Re*ze/je*z,G=tt*ze/je*z;H.projectionMatrix.makePerspective(Ne,T,x,G,z,je),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function Y(H,O){O===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(O.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(r===null)return;let O=H.near,j=H.far;g.texture!==null&&(g.depthNear>0&&(O=g.depthNear),g.depthFar>0&&(j=g.depthFar)),D.near=I.near=R.near=O,D.far=I.far=R.far=j,(A!==D.near||U!==D.far)&&(r.updateRenderState({depthNear:D.near,depthFar:D.far}),A=D.near,U=D.far),D.layers.mask=H.layers.mask|6,R.layers.mask=D.layers.mask&-5,I.layers.mask=D.layers.mask&-3;let se=H.parent,oe=D.cameras;Y(D,se);for(let Ae=0;Ae<oe.length;Ae++)Y(oe[Ae],se);oe.length===2?C(D,R,I):D.projectionMatrix.copy(R.projectionMatrix),y===null&&H.isPerspectiveCamera&&(y={camera:H,fov:H.fov,zoom:H.zoom}),te(H,D,se)};function te(H,O,j){j===null?H.matrix.copy(O.matrixWorld):(H.matrix.copy(j.matrixWorld),H.matrix.invert(),H.matrix.multiply(O.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(O.projectionMatrix),H.projectionMatrixInverse.copy(O.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Yr*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(H){l=H,h!==null&&(h.fixedFoveation=H),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=H)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(H){return p[H]};let xe=null;function ce(H,O){if(u=O.getViewerPose(c||a),_=O,u!==null){let j=u.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let se=!1;j.length!==D.cameras.length&&(D.cameras.length=0,se=!0);for(let ze=0;ze<j.length;ze++){let Re=j[ze],tt=null;if(f!==null)tt=f.getViewport(Re);else{let ct=d.getViewSubImage(h,Re);tt=ct.viewport,ze===0&&(e.setRenderTargetTextures(S,ct.colorTexture,ct.depthStencilTexture),e.setRenderTarget(S))}let Ge=F[ze];Ge===void 0&&(Ge=new un,Ge.layers.enable(ze),Ge.viewport=new Ke,F[ze]=Ge),Ge.matrix.fromArray(Re.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(Re.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(tt.x,tt.y,tt.width,tt.height),ze===0&&(D.matrix.copy(Ge.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),se===!0&&D.cameras.push(Ge)}let oe=r.enabledFeatures;if(oe&&oe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&M){d=n.getBinding();let ze=d.getDepthInformation(j[0]);ze&&ze.isValid&&ze.texture&&g.init(ze,r.renderState)}if(oe&&oe.includes("camera-access")&&M){e.state.unbindTexture(),d=n.getBinding();for(let ze=0;ze<j.length;ze++){let Re=j[ze].camera;if(Re){let tt=p[Re];tt||(tt=new Us,p[Re]=tt);let Ge=d.getCameraImage(Re);tt.sourceTexture=Ge}}}}for(let j=0;j<w.length;j++){let se=E[j],oe=w[j];se!==null&&oe!==void 0&&oe.update(se,O,c||a)}xe&&xe(H,O),O.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:O}),_=null}let le=new cd;le.setAnimationLoop(ce),this.setAnimationLoop=function(H){xe=H},this.dispose=function(){}}},t_=new ke,md=new Oe;md.set(-1,0,0,0,1,0,0,0,1);function n_(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Fc(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,b,P,S){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(g,p):p.isMeshLambertMaterial?(s(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(g,p),d(g,p)):p.isMeshPhongMaterial?(s(g,p),u(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(g,p),h(g,p),p.isMeshPhysicalMaterial&&f(g,p,S)):p.isMeshMatcapMaterial?(s(g,p),_(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),M(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,b,P):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Ot&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Ot&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let b=e.get(p),P=b.envMap,S=b.envMapRotation;P&&(g.envMap.value=P,g.envMapRotation.value.setFromMatrix4(t_.makeRotationFromEuler(S)).transpose(),P.isCubeTexture&&P.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(md),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,b,P){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=P*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function d(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function h(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,b){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ot&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function _(g,p){p.matcap&&(g.matcap.value=p.matcap)}function M(g,p){let b=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function i_(i,e,t,n){let r={},s={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,w){let E=w.program;n.uniformBlockBinding(S,E)}function c(S,w){let E=r[S.id];E===void 0&&(g(S),E=u(S),r[S.id]=E,S.addEventListener("dispose",b));let L=w.program;n.updateUBOMapping(S,L);let m=e.render.frame;s[S.id]!==m&&(h(S),s[S.id]=m)}function u(S){let w=d();S.__bindingPointIndex=w;let E=i.createBuffer(),L=S.__size,m=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,L,m),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,E),E}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){let w=r[S.id],E=S.uniforms,L=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let m=0,y=E.length;m<y;m++){let R=E[m];if(Array.isArray(R))for(let I=0,F=R.length;I<F;I++)f(R[I],m,I,L);else f(R,m,0,L)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,w,E,L){if(M(S,w,E,L)===!0){let m=S.__offset,y=S.value;if(Array.isArray(y)){let R=0;for(let I=0;I<y.length;I++){let F=y[I],D=p(F);_(F,S.__data,R),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(R+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(y,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,m,S.__data)}}function _(S,w,E){typeof S=="number"||typeof S=="boolean"?w[0]=S:S.isMatrix3?(w[0]=S.elements[0],w[1]=S.elements[1],w[2]=S.elements[2],w[3]=0,w[4]=S.elements[3],w[5]=S.elements[4],w[6]=S.elements[5],w[7]=0,w[8]=S.elements[6],w[9]=S.elements[7],w[10]=S.elements[8],w[11]=0):ArrayBuffer.isView(S)?w.set(new S.constructor(S.buffer,S.byteOffset,w.length)):S.toArray(w,E)}function M(S,w,E,L){let m=S.value,y=w+"_"+E;if(L[y]===void 0)return typeof m=="number"||typeof m=="boolean"?L[y]=m:ArrayBuffer.isView(m)?L[y]=m.slice():L[y]=m.clone(),!0;{let R=L[y];if(typeof m=="number"||typeof m=="boolean"){if(R!==m)return L[y]=m,!0}else{if(ArrayBuffer.isView(m))return!0;if(R.equals(m)===!1)return R.copy(m),!0}}return!1}function g(S){let w=S.uniforms,E=0,L=16;for(let y=0,R=w.length;y<R;y++){let I=Array.isArray(w[y])?w[y]:[w[y]];for(let F=0,D=I.length;F<D;F++){let A=I[F],U=Array.isArray(A.value)?A.value:[A.value];for(let Z=0,K=U.length;Z<K;Z++){let ne=U[Z],N=p(ne),W=E%L,C=W%N.boundary,Y=W+C;E+=C,Y!==0&&L-Y<N.storage&&(E+=L-Y),A.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),A.__offset=E,E+=N.storage}}}let m=E%L;return m>0&&(E+=L-m),S.__size=E,S.__cache={},this}function p(S){let w={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(w.boundary=4,w.storage=4):S.isVector2?(w.boundary=8,w.storage=8):S.isVector3||S.isColor?(w.boundary=16,w.storage=12):S.isVector4?(w.boundary=16,w.storage=16):S.isMatrix3?(w.boundary=48,w.storage=48):S.isMatrix4?(w.boundary=64,w.storage=64):S.isTexture?Ue("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(w.boundary=16,w.storage=S.byteLength):Ue("WebGLRenderer: Unsupported uniform value type.",S),w}function b(S){let w=S.target;w.removeEventListener("dispose",b);let E=a.indexOf(w.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function P(){for(let S in r)i.deleteBuffer(r[S]);a=[],r={},s={}}return{bind:l,update:c,dispose:P}}var r_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ti=null;function s_(){return ti===null&&(ti=new Jr(r_,16,16,ei,Hn),ti.name="DFG_LUT",ti.minFilter=Lt,ti.magFilter=Lt,ti.wrapS=yn,ti.wrapT=yn,ti.generateMipmaps=!1,ti.needsUpdate=!0),ti}var os=class{constructor(e={}){let{canvas:t=Nh(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=fn}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;let M=f,g=new Set([bo,Mo,So]),p=new Set([fn,Vn,ts,ns,vo,yo]),b=new Uint32Array(4),P=new Int32Array(4),S=new V,w=null,E=null,L=[],m=[],y=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,I=!1,F=null,D=null,A=null,U=null;this._outputColorSpace=vn;let Z=0,K=0,ne=null,N=-1,W=null,C=new Ke,Y=new Ke,te=null,xe=new qe(0),ce=0,le=t.width,H=t.height,O=1,j=null,se=null,oe=new Ke(0,0,le,H),Ae=new Ke(0,0,le,H),$e=!1,ze=new Kr,Re=!1,tt=!1,Ge=new ke,ct=new V,xt=new Ke,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Qe=!1;function nt(){return ne===null?O:1}let z=n;function je(v,B){return t.getContext(v,B)}let Ne,T,x,G,$,Q,ue,de,ee,re,fe,Ie,_e,pe,Le,Fe,Ve,k,me,ie,ge,Se,ae;try{let v={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",ft,!1),t.addEventListener("webglcontextrestored",st,!1),t.addEventListener("webglcontextcreationerror",Dn,!1),z===null){let B="webgl2";if(z=je(B,v),z===null)throw je(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}De()}catch(v){throw t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Dn,!1),Be("WebGLRenderer: "+v.message),v}function De(){Ne=new d0(z),Ne.init(),ge=new jx(z,Ne),T=new n0(z,Ne,e,ge),x=new Jx(z,Ne),T.reversedDepthBuffer&&h&&x.buffers.depth.setReversed(!0),D=z.createFramebuffer(),A=z.createFramebuffer(),U=z.createFramebuffer(),G=new m0(z),$=new Ux,Q=new Kx(z,Ne,x,$,T,ge,G),ue=new h0(R),de=new xp(z),Se=new e0(z,de),ee=new f0(z,de,G,Se),re=new x0(z,ee,de,Se,G),k=new g0(z,T,Q),Le=new i0($),fe=new Nx(R,ue,Ne,T,Se,Le),Ie=new n_(R,$),_e=new Bx,pe=new Wx(Ne),Ve=new Qg(R,ue,x,re,_,l),Fe=new Zx(R,re,T),ae=new i_(z,G,T,x),me=new t0(z,Ne,G),ie=new p0(z,Ne,G),G.programs=fe.programs,R.capabilities=T,R.extensions=Ne,R.properties=$,R.renderLists=_e,R.shadowMap=Fe,R.state=x,R.info=G}M!==fn&&(y=new v0(M,t.width,t.height,o,r,s));let Ce=new jc(R,z);this.xr=Ce,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let v=Ne.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=Ne.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(v){v!==void 0&&(O=v,this.setSize(le,H,!1))},this.getSize=function(v){return v.set(le,H)},this.setSize=function(v,B,J=!0){if(Ce.isPresenting){Ue("WebGLRenderer: Can't change size while VR device is presenting.");return}le=v,H=B,t.width=Math.floor(v*O),t.height=Math.floor(B*O),J===!0&&(t.style.width=v+"px",t.style.height=B+"px"),y!==null&&y.setSize(t.width,t.height),this.setViewport(0,0,v,B)},this.getDrawingBufferSize=function(v){return v.set(le*O,H*O).floor()},this.setDrawingBufferSize=function(v,B,J){le=v,H=B,O=J,t.width=Math.floor(v*J),t.height=Math.floor(B*J),this.setViewport(0,0,v,B)},this.setEffects=function(v){if(M===fn){Be("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let B=0;B<v.length;B++)if(v[B].isOutputPass===!0){Ue("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}y.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(C)},this.getViewport=function(v){return v.copy(oe)},this.setViewport=function(v,B,J,X){v.isVector4?oe.set(v.x,v.y,v.z,v.w):oe.set(v,B,J,X),x.viewport(C.copy(oe).multiplyScalar(O).round())},this.getScissor=function(v){return v.copy(Ae)},this.setScissor=function(v,B,J,X){v.isVector4?Ae.set(v.x,v.y,v.z,v.w):Ae.set(v,B,J,X),x.scissor(Y.copy(Ae).multiplyScalar(O).round())},this.getScissorTest=function(){return $e},this.setScissorTest=function(v){x.setScissorTest($e=v)},this.setOpaqueSort=function(v){j=v},this.setTransparentSort=function(v){se=v},this.getClearColor=function(v){return v.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(v=!0,B=!0,J=!0){let X=0;if(v){let q=!1;if(ne!==null){let ye=ne.texture.format;q=g.has(ye)}if(q){let ye=ne.texture.type,be=p.has(ye),ve=Ve.getClearColor(),Ee=Ve.getClearAlpha(),Pe=ve.r,Xe=ve.g,Ze=ve.b;be?(b[0]=Pe,b[1]=Xe,b[2]=Ze,b[3]=Ee,z.clearBufferuiv(z.COLOR,0,b)):(P[0]=Pe,P[1]=Xe,P[2]=Ze,P[3]=Ee,z.clearBufferiv(z.COLOR,0,P))}else X|=z.COLOR_BUFFER_BIT}B&&(X|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(X|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&z.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),F=v},this.dispose=function(){t.removeEventListener("webglcontextlost",ft,!1),t.removeEventListener("webglcontextrestored",st,!1),t.removeEventListener("webglcontextcreationerror",Dn,!1),Ve.dispose(),_e.dispose(),pe.dispose(),$.dispose(),ue.dispose(),re.dispose(),Se.dispose(),ae.dispose(),fe.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",bu),Ce.removeEventListener("sessionend",wu),ir.stop()};function ft(v){v.preventDefault(),Ps("WebGLRenderer: Context Lost."),I=!0}function st(){Ps("WebGLRenderer: Context Restored."),I=!1;let v=G.autoReset,B=Fe.enabled,J=Fe.autoUpdate,X=Fe.needsUpdate,q=Fe.type;De(),G.autoReset=v,Fe.enabled=B,Fe.autoUpdate=J,Fe.needsUpdate=X,Fe.type=q}function Dn(v){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function qn(v){let B=v.target;B.removeEventListener("dispose",qn),sf(B)}function sf(v){af(v),$.remove(v)}function af(v){let B=$.get(v).programs;B!==void 0&&(B.forEach(function(J){fe.releaseProgram(J)}),v.isShaderMaterial&&fe.releaseShaderCache(v))}this.renderBufferDirect=function(v,B,J,X,q,ye){B===null&&(B=At);let be=q.isMesh&&q.matrixWorld.determinantAffine()<0,ve=cf(v,B,J,X,q);x.setMaterial(X,be);let Ee=J.index,Pe=1;if(X.wireframe===!0){if(Ee=ee.getWireframeAttribute(J),Ee===void 0)return;Pe=2}let Xe=J.drawRange,Ze=J.attributes.position,Te=Xe.start*Pe,at=(Xe.start+Xe.count)*Pe;ye!==null&&(Te=Math.max(Te,ye.start*Pe),at=Math.min(at,(ye.start+ye.count)*Pe)),Ee!==null?(Te=Math.max(Te,0),at=Math.min(at,Ee.count)):Ze!=null&&(Te=Math.max(Te,0),at=Math.min(at,Ze.count));let Ct=at-Te;if(Ct<0||Ct===1/0)return;Se.setup(q,X,ve,J,Ee);let _t,dt=me;if(Ee!==null&&(_t=de.get(Ee),dt=ie,dt.setIndex(_t)),q.isMesh)X.wireframe===!0?(x.setLineWidth(X.wireframeLinewidth*nt()),dt.setMode(z.LINES)):dt.setMode(z.TRIANGLES);else if(q.isLine){let Yt=X.linewidth;Yt===void 0&&(Yt=1),x.setLineWidth(Yt*nt()),q.isLineSegments?dt.setMode(z.LINES):q.isLineLoop?dt.setMode(z.LINE_LOOP):dt.setMode(z.LINE_STRIP)}else q.isPoints?dt.setMode(z.POINTS):q.isSprite&&dt.setMode(z.TRIANGLES);if(q.isBatchedMesh)if(Ne.get("WEBGL_multi_draw"))dt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let Yt=q._multiDrawStarts,Me=q._multiDrawCounts,tn=q._multiDrawCount,et=Ee?de.get(Ee).bytesPerElement:1,An=$.get(X).currentProgram.getUniforms();for(let Yn=0;Yn<tn;Yn++)An.setValue(z,"_gl_DrawID",Yn),dt.render(Yt[Yn]/et,Me[Yn])}else if(q.isInstancedMesh)dt.renderInstances(Te,Ct,q.count);else if(J.isInstancedBufferGeometry){let Yt=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Me=Math.min(J.instanceCount,Yt);dt.renderInstances(Te,Ct,Me)}else dt.render(Te,Ct)};function Mu(v,B,J,X){F!==null&&v.isNodeMaterial&&F.setObject(X,v),Re===!0&&Le.setState(v,J,!1),v.transparent===!0&&v.side===Qt&&v.forceSinglePass===!1?(v.side=Ot,v.needsUpdate=!0,ha(v,B,X),v.side=Qn,v.needsUpdate=!0,ha(v,B,X),v.side=Qt):ha(v,B,X)}this.compile=function(v,B,J=null){J===null&&(J=v),F!==null&&F.renderStart(v,B,J),E=pe.get(J),E.init(B),m.push(E),J.traverseVisible(function(q){q.isLight&&q.layers.test(B.layers)&&(E.pushLight(q),q.castShadow&&E.pushShadow(q))}),v!==J&&v.traverseVisible(function(q){q.isLight&&q.layers.test(B.layers)&&(E.pushLight(q),q.castShadow&&E.pushShadow(q))}),E.setupLights(),F!==null&&F.updateLights(E.state.lightsArray),tt=this.localClippingEnabled,Re=Le.init(this.clippingPlanes,tt),Re===!0&&Le.setGlobalState(this.clippingPlanes,B),F!==null&&Fe.render(E.state.shadowsArray,J,B);let X=new Set;return v.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let ye=q.material;if(ye)if(Array.isArray(ye))for(let be=0;be<ye.length;be++){let ve=ye[be];Mu(ve,J,B,q),X.add(ve)}else Mu(ye,J,B,q),X.add(ye)}),E=m.pop(),F!==null&&F.renderEnd(),X},this.compileAsync=function(v,B,J=null){let X=this.compile(v,B,J);return new Promise(q=>{function ye(){if(X.forEach(function(be){let Ee=$.get(be).currentProgram;(Ee===void 0||Ee.isReady())&&X.delete(be)}),X.size===0){q(v);return}setTimeout(ye,10)}Ne.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let Dl=null;function of(v){Dl&&Dl(v)}function bu(){ir.stop()}function wu(){ir.start()}let ir=new cd;ir.setAnimationLoop(of),typeof self<"u"&&ir.setContext(self),this.setAnimationLoop=function(v){Dl=v,Ce.setAnimationLoop(v),v===null?ir.stop():ir.start()},Ce.addEventListener("sessionstart",bu),Ce.addEventListener("sessionend",wu),this.render=function(v,B){if(B!==void 0&&B.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(v,B);let J=Ce.enabled===!0&&Ce.isPresenting===!0,X=y!==null&&(ne===null||J)&&y.begin(R,ne);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(y===null||y.isCompositing()===!1)&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(B),B=Ce.getCamera()),v.isScene===!0&&v.onBeforeRender(R,v,B,ne),E=pe.get(v,m.length),E.init(B),E.state.textureUnits=Q.getTextureUnits(),m.push(E),Ge.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ze.setFromProjectionMatrix(Ge,zn,B.reversedDepth),tt=this.localClippingEnabled,Re=Le.init(this.clippingPlanes,tt),w=_e.get(v,L.length),w.init(),L.push(w),Ce.enabled===!0&&Ce.isPresenting===!0){let be=R.xr.getDepthSensingMesh();be!==null&&Fl(be,B,-1/0,R.sortObjects)}Fl(v,B,0,R.sortObjects),w.finish(),F!==null&&F.updateLights(E.state.lightsArray),R.sortObjects===!0&&w.sort(j,se),Qe=Ce.enabled===!1||Ce.isPresenting===!1||Ce.hasDepthSensing()===!1,Qe&&Ve.addToRenderList(w,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Re===!0&&Le.beginShadows();let q=E.state.shadowsArray;if(Fe.render(q,v,B),Re===!0&&Le.endShadows(),(X&&y.hasRenderPass())===!1){let be=w.opaque,ve=w.transmissive;if(E.setupLights(),B.isArrayCamera){let Ee=B.cameras;if(ve.length>0)for(let Pe=0,Xe=Ee.length;Pe<Xe;Pe++){let Ze=Ee[Pe];Tu(be,ve,v,Ze)}Qe&&Ve.render(v);for(let Pe=0,Xe=Ee.length;Pe<Xe;Pe++){let Ze=Ee[Pe];Eu(w,v,Ze,Ze.viewport)}}else ve.length>0&&Tu(be,ve,v,B),Qe&&Ve.render(v),Eu(w,v,B)}ne!==null&&K===0&&(Q.updateMultisampleRenderTarget(ne),Q.updateRenderTargetMipmap(ne)),X&&y.end(R),v.isScene===!0&&v.onAfterRender(R,v,B),Se.resetDefaultState(),N=-1,W=null,m.pop(),m.length>0?(E=m[m.length-1],Q.setTextureUnits(E.state.textureUnits),Re===!0&&Le.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,L.pop(),L.length>0?w=L[L.length-1]:w=null,F!==null&&F.renderEnd()};function Fl(v,B,J,X){if(v.visible===!1)return;if(v.layers.test(B.layers)){if(v.isGroup)J=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(B);else if(v.isLightProbeGrid)E.pushLightProbeGrid(v);else if(v.isLight)E.pushLight(v),v.castShadow&&E.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(ze)){X&&xt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ge);let be=re.update(v),ve=v.material;ve.visible&&w.push(v,be,ve,J,xt.z,null,B)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(ze))){let be=re.update(v),ve=v.material;if(X&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),xt.copy(v.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),xt.copy(be.boundingSphere.center)),xt.applyMatrix4(v.matrixWorld).applyMatrix4(Ge)),Array.isArray(ve)){let Ee=be.groups;for(let Pe=0,Xe=Ee.length;Pe<Xe;Pe++){let Ze=Ee[Pe],Te=ve[Ze.materialIndex];Te&&Te.visible&&w.push(v,be,Te,J,xt.z,Ze,B)}}else ve.visible&&w.push(v,be,ve,J,xt.z,null,B)}}let ye=v.children;for(let be=0,ve=ye.length;be<ve;be++)Fl(ye[be],B,J,X)}function Eu(v,B,J,X){let{opaque:q,transmissive:ye,transparent:be}=v;E.setupLightsView(J),Re===!0&&Le.setGlobalState(R.clippingPlanes,J),X&&x.viewport(C.copy(X)),q.length>0&&ua(q,B,J),ye.length>0&&ua(ye,B,J),be.length>0&&ua(be,B,J),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Tu(v,B,J,X){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[X.id]===void 0){let Te=Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[X.id]=new jt(1,1,{generateMipmaps:!0,type:Te?Hn:fn,minFilter:Zi,samples:Math.max(4,T.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Je.workingColorSpace})}let ye=E.state.transmissionRenderTarget[X.id],be=X.viewport||C;ye.setSize(be.z*R.transmissionResolutionScale,be.w*R.transmissionResolutionScale);let ve=R.getRenderTarget(),Ee=R.getActiveCubeFace(),Pe=R.getActiveMipmapLevel();R.setRenderTarget(ye),R.getClearColor(xe),ce=R.getClearAlpha(),ce<1&&R.setClearColor(16777215,.5),R.clear(),Qe&&Ve.render(J);let Xe=R.toneMapping;R.toneMapping=Gn;let Ze=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),E.setupLightsView(X),Re===!0&&Le.setGlobalState(R.clippingPlanes,X),ua(v,J,X),Q.updateMultisampleRenderTarget(ye),Q.updateRenderTargetMipmap(ye),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let at=0,Ct=B.length;at<Ct;at++){let _t=B[at],{object:dt,geometry:Yt,material:Me,group:tn}=_t;if(Me.side===Qt&&dt.layers.test(X.layers)){let et=Me.side;Me.side=Ot,Me.needsUpdate=!0,Au(dt,J,X,Yt,Me,tn),Me.side=et,Me.needsUpdate=!0,Te=!0}}Te===!0&&(Q.updateMultisampleRenderTarget(ye),Q.updateRenderTargetMipmap(ye))}R.setRenderTarget(ve,Ee,Pe),R.setClearColor(xe,ce),Ze!==void 0&&(X.viewport=Ze),R.toneMapping=Xe}function ua(v,B,J){let X=B.isScene===!0?B.overrideMaterial:null;for(let q=0,ye=v.length;q<ye;q++){let be=v[q],{object:ve,geometry:Ee,group:Pe}=be,Xe=be.material;Xe.allowOverride===!0&&X!==null&&(Xe=X),ve.layers.test(J.layers)&&Au(ve,B,J,Ee,Xe,Pe)}}function Au(v,B,J,X,q,ye){F!==null&&q.isNodeMaterial&&F.setObject(v,q),v.onBeforeRender(R,B,J,X,q,ye),v.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),q.onBeforeRender(R,B,J,X,v,ye),q.transparent===!0&&q.side===Qt&&q.forceSinglePass===!1?(q.side=Ot,q.needsUpdate=!0,R.renderBufferDirect(J,B,X,q,v,ye),q.side=Qn,q.needsUpdate=!0,R.renderBufferDirect(J,B,X,q,v,ye),q.side=Qt):R.renderBufferDirect(J,B,X,q,v,ye),v.onAfterRender(R,B,J,X,q,ye)}function ha(v,B,J){B.isScene!==!0&&(B=At);let X=$.get(v),q=E.state.lights,ye=E.state.shadowsArray,be=q.state.version,ve=fe.getParameters(v,q.state,ye,B,J,E.state.lightProbeGridArray),Ee=fe.getProgramCacheKey(ve),Pe=X.programs;X.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?B.environment:null,X.fog=B.fog;let Xe=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;X.envMap=ue.get(v.envMap||X.environment,Xe),X.envMapRotation=X.environment!==null&&v.envMap===null?B.environmentRotation:v.envMapRotation,Pe===void 0&&(v.addEventListener("dispose",qn),Pe=new Map,X.programs=Pe);let Ze=Pe.get(Ee);if(Ze!==void 0){if(X.currentProgram===Ze&&X.lightsStateVersion===be)return Ru(v,ve),Ze}else ve.uniforms=fe.getUniforms(v),F!==null&&v.isNodeMaterial&&F.build(v,J,ve),v.onBeforeCompile(ve,R),Ze=fe.acquireProgram(ve,Ee),Pe.set(Ee,Ze),X.uniforms=ve.uniforms;let Te=X.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Te.clippingPlanes=Le.uniform),Ru(v,ve),X.needsLights=hf(v),X.lightsStateVersion=be,X.needsLights&&(Te.ambientLightColor.value=q.state.ambient,Te.lightProbe.value=q.state.probe,Te.sunLights.value=q.state.sun,Te.sunLightShadows.value=q.state.sunShadow,Te.directionalLights.value=q.state.directional,Te.directionalLightShadows.value=q.state.directionalShadow,Te.spotLights.value=q.state.spot,Te.spotLightShadows.value=q.state.spotShadow,Te.rectAreaLights.value=q.state.rectArea,Te.ltc_1.value=q.state.rectAreaLTC1,Te.ltc_2.value=q.state.rectAreaLTC2,Te.pointLights.value=q.state.point,Te.pointLightShadows.value=q.state.pointShadow,Te.hemisphereLights.value=q.state.hemi,Te.sunShadowMatrix.value=q.state.sunShadowMatrix,Te.sunShadowCascade.value=q.state.sunShadowCascade,Te.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Te.spotLightMatrix.value=q.state.spotLightMatrix,Te.spotLightMap.value=q.state.spotLightMap,Te.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=E.state.lightProbeGridArray.length>0,X.currentProgram=Ze,X.uniformsList=null,Ze}function Cu(v){if(v.uniformsList===null){let B=v.currentProgram.getUniforms();v.uniformsList=as.seqWithValue(B.seq,v.uniforms)}return v.uniformsList}function Ru(v,B){let J=$.get(v);J.outputColorSpace=B.outputColorSpace,J.batching=B.batching,J.batchingColor=B.batchingColor,J.instancing=B.instancing,J.instancingColor=B.instancingColor,J.instancingMorph=B.instancingMorph,J.skinning=B.skinning,J.morphTargets=B.morphTargets,J.morphNormals=B.morphNormals,J.morphColors=B.morphColors,J.morphTargetsCount=B.morphTargetsCount,J.numClippingPlanes=B.numClippingPlanes,J.numIntersection=B.numClipIntersection,J.vertexAlphas=B.vertexAlphas,J.vertexTangents=B.vertexTangents,J.toneMapping=B.toneMapping}function lf(v,B){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;S.setFromMatrixPosition(B.matrixWorld);for(let J=0,X=v.length;J<X;J++){let q=v[J];if(q.texture!==null&&q.boundingBox.containsPoint(S))return q}return null}function cf(v,B,J,X,q){B.isScene!==!0&&(B=At),Q.resetTextureUnits();let ye=B.fog,be=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?B.environment:null,ve=ne===null?R.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Je.workingColorSpace,Ee=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Pe=ue.get(X.envMap||be,Ee),Xe=X.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Ze=!!J.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Te=!!J.morphAttributes.position,at=!!J.morphAttributes.normal,Ct=!!J.morphAttributes.color,_t=Gn;X.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(_t=R.toneMapping);let dt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Yt=dt!==void 0?dt.length:0,Me=$.get(X),tn=E.state.lights;if(Re===!0&&(tt===!0||v!==W)){let pt=v===W&&X.id===N;Le.setState(X,v,pt)}let et=!1;X.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==tn.state.version||Me.outputColorSpace!==ve||q.isBatchedMesh&&Me.batching===!1||!q.isBatchedMesh&&Me.batching===!0||q.isBatchedMesh&&Me.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Me.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Me.instancing===!1||!q.isInstancedMesh&&Me.instancing===!0||q.isSkinnedMesh&&Me.skinning===!1||!q.isSkinnedMesh&&Me.skinning===!0||q.isInstancedMesh&&Me.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Me.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Me.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Me.instancingMorph===!1&&q.morphTexture!==null||Me.envMap!==Pe||X.fog===!0&&Me.fog!==ye||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Le.numPlanes||Me.numIntersection!==Le.numIntersection)||Me.vertexAlphas!==Xe||Me.vertexTangents!==Ze||Me.morphTargets!==Te||Me.morphNormals!==at||Me.morphColors!==Ct||Me.toneMapping!==_t||Me.morphTargetsCount!==Yt||!!Me.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(et=!0):(et=!0,Me.__version=X.version);let An=Me.currentProgram;et===!0&&(An=ha(X,B,q),F&&X.isNodeMaterial&&F.onUpdateProgram(X,An,Me));let Yn=!1,Ii=!1,Tr=!1,ht=An.getUniforms(),Tt=Me.uniforms;if(x.useProgram(An.program)&&(Yn=!0,Ii=!0,Tr=!0),X.id!==N&&(N=X.id,Ii=!0),Me.needsLights){let pt=lf(E.state.lightProbeGridArray,q);Me.lightProbeGrid!==pt&&(Me.lightProbeGrid=pt,Ii=!0)}if(Yn||W!==v){x.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ht.setValue(z,"projectionMatrix",v.projectionMatrix),ht.setValue(z,"viewMatrix",v.matrixWorldInverse);let Di=ht.map.cameraPosition;Di!==void 0&&Di.setValue(z,ct.setFromMatrixPosition(v.matrixWorld)),T.logarithmicDepthBuffer&&ht.setValue(z,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ht.setValue(z,"isOrthographic",v.isOrthographicCamera===!0),W!==v&&(W=v,Ii=!0,Tr=!0)}if(Me.needsLights&&(tn.state.sunShadowMap.length>0&&ht.setValue(z,"sunShadowMap",tn.state.sunShadowMap,Q),tn.state.directionalShadowMap.length>0&&ht.setValue(z,"directionalShadowMap",tn.state.directionalShadowMap,Q),tn.state.spotShadowMap.length>0&&ht.setValue(z,"spotShadowMap",tn.state.spotShadowMap,Q),tn.state.pointShadowMap.length>0&&ht.setValue(z,"pointShadowMap",tn.state.pointShadowMap,Q)),q.isSkinnedMesh){ht.setOptional(z,q,"bindMatrix"),ht.setOptional(z,q,"bindMatrixInverse");let pt=q.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),ht.setValue(z,"boneTexture",pt.boneTexture,Q))}q.isBatchedMesh&&(ht.setOptional(z,q,"batchingTexture"),ht.setValue(z,"batchingTexture",q._matricesTexture,Q),ht.setOptional(z,q,"batchingIdTexture"),ht.setValue(z,"batchingIdTexture",q._indirectTexture,Q),ht.setOptional(z,q,"batchingColorTexture"),q._colorsTexture!==null&&ht.setValue(z,"batchingColorTexture",q._colorsTexture,Q));let Li=J.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&k.update(q,J,An),(Ii||Me.receiveShadow!==q.receiveShadow)&&(Me.receiveShadow=q.receiveShadow,ht.setValue(z,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&B.environment!==null&&(Tt.envMapIntensity.value=B.environmentIntensity),Tt.dfgLUT!==void 0&&(Tt.dfgLUT.value=s_()),Ii){if(ht.setValue(z,"toneMappingExposure",R.toneMappingExposure),Me.needsLights&&uf(Tt,Tr),ye&&X.fog===!0&&Ie.refreshFogUniforms(Tt,ye),Ie.refreshMaterialUniforms(Tt,X,O,H,E.state.transmissionRenderTarget[v.id]),Me.needsLights&&Me.lightProbeGrid){let pt=Me.lightProbeGrid;Tt.probesSH.value=pt.texture,Tt.probesMin.value.copy(pt.boundingBox.min),Tt.probesMax.value.copy(pt.boundingBox.max),Tt.probesResolution.value.copy(pt.resolution)}as.upload(z,Cu(Me),Tt,Q)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(as.upload(z,Cu(Me),Tt,Q),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ht.setValue(z,"center",q.center),ht.setValue(z,"modelViewMatrix",q.modelViewMatrix),ht.setValue(z,"normalMatrix",q.normalMatrix),ht.setValue(z,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){let pt=X.uniformsGroups;for(let Di=0,Ar=pt.length;Di<Ar;Di++){let Iu=pt[Di];ae.update(Iu,An),ae.bind(Iu,An)}}return An}function uf(v,B){v.ambientLightColor.needsUpdate=B,v.lightProbe.needsUpdate=B,v.sunLights.needsUpdate=B,v.sunLightShadows.needsUpdate=B,v.directionalLights.needsUpdate=B,v.directionalLightShadows.needsUpdate=B,v.pointLights.needsUpdate=B,v.pointLightShadows.needsUpdate=B,v.spotLights.needsUpdate=B,v.spotLightShadows.needsUpdate=B,v.rectAreaLights.needsUpdate=B,v.hemisphereLights.needsUpdate=B}function hf(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return K},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(v,B,J){let X=$.get(v);X.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),$.get(v.texture).__webglTexture=B,$.get(v.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:J,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,B){let J=$.get(v);J.__webglFramebuffer=B,J.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(v,B=0,J=0){ne=v,Z=B,K=J;let X=null,q=!1,ye=!1;if(v){let ve=$.get(v);if(ve.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(z.FRAMEBUFFER,ve.__webglFramebuffer),C.copy(v.viewport),Y.copy(v.scissor),te=v.scissorTest,x.viewport(C),x.scissor(Y),x.setScissorTest(te),N=-1;return}else if(ve.__webglFramebuffer===void 0)Q.setupRenderTarget(v);else if(ve.__hasExternalTextures)Q.rebindTextures(v,$.get(v.texture).__webglTexture,$.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let Xe=v.depthTexture;if(ve.__boundDepthTexture!==Xe){if(Xe!==null&&$.has(Xe)&&(v.width!==Xe.image.width||v.height!==Xe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Q.setupDepthRenderbuffer(v)}}let Ee=v.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(ye=!0);let Pe=$.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Pe[B])?X=Pe[B][J]:X=Pe[B],q=!0):v.samples>0&&Q.useMultisampledRTT(v)===!1?X=$.get(v).__webglMultisampledFramebuffer:Array.isArray(Pe)?X=Pe[J]:X=Pe,C.copy(v.viewport),Y.copy(v.scissor),te=v.scissorTest}else C.copy(oe).multiplyScalar(O).floor(),Y.copy(Ae).multiplyScalar(O).floor(),te=$e;if(J!==0&&(X=D),x.bindFramebuffer(z.FRAMEBUFFER,X)&&x.drawBuffers(v,X),x.viewport(C),x.scissor(Y),x.setScissorTest(te),q){let ve=$.get(v.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+B,ve.__webglTexture,J)}else if(ye){let ve=B;for(let Ee=0;Ee<v.textures.length;Ee++){let Pe=$.get(v.textures[Ee]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Ee,Pe.__webglTexture,J,ve)}}else if(v!==null&&J!==0){let ve=$.get(v.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,ve.__webglTexture,J)}N=-1};function Pu(v){let B=$.get(v);return(B.__readFormat!==v.format||B.__readType!==v.type)&&(B.__readFormat=v.format,B.__readType=v.type,B.__formatReadable=T.textureFormatReadable(v.format),B.__typeReadable=T.textureTypeReadable(v.type)),B}this.readRenderTargetPixels=function(v,B,J,X,q,ye,be,ve=0){if(!(v&&v.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=$.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&be!==void 0&&(Ee=Ee[be]),Ee){x.bindFramebuffer(z.FRAMEBUFFER,Ee);try{let Pe=v.textures[ve],Xe=Pe.format,Ze=Pe.type;v.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+ve);let Te=Pu(Pe);if(Te.__formatReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Te.__typeReadable===!1){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=v.width-X&&J>=0&&J<=v.height-q&&z.readPixels(B,J,X,q,ge.convert(Xe),ge.convert(Ze),ye)}finally{let Pe=ne!==null?$.get(ne).__webglFramebuffer:null;x.bindFramebuffer(z.FRAMEBUFFER,Pe)}}},this.readRenderTargetPixelsAsync=async function(v,B,J,X,q,ye,be,ve=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=$.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&be!==void 0&&(Ee=Ee[be]),Ee)if(B>=0&&B<=v.width-X&&J>=0&&J<=v.height-q){x.bindFramebuffer(z.FRAMEBUFFER,Ee);let Pe=v.textures[ve],Xe=Pe.format,Ze=Pe.type;v.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+ve);let Te=Pu(Pe);if(Te.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Te.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let at=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,at),z.bufferData(z.PIXEL_PACK_BUFFER,ye.byteLength,z.STREAM_READ),z.readPixels(B,J,X,q,ge.convert(Xe),ge.convert(Ze),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let Ct=ne!==null?$.get(ne).__webglFramebuffer:null;x.bindFramebuffer(z.FRAMEBUFFER,Ct);let _t=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Oh(z,_t,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,at),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,ye),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(at),z.deleteSync(_t),ye}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,B=null,J=0){let X=Math.pow(2,-J),q=Math.floor(v.image.width*X),ye=Math.floor(v.image.height*X),be=B!==null?B.x:0,ve=B!==null?B.y:0;Q.setTexture2D(v,0),z.copyTexSubImage2D(z.TEXTURE_2D,J,0,0,be,ve,q,ye),x.unbindTexture()},this.copyTextureToTexture=function(v,B,J=null,X=null,q=0,ye=0){let be,ve,Ee,Pe,Xe,Ze,Te,at,Ct,_t=v.isCompressedTexture?v.mipmaps[ye]:v.image;if(J!==null)be=J.max.x-J.min.x,ve=J.max.y-J.min.y,Ee=J.isBox3?J.max.z-J.min.z:1,Pe=J.min.x,Xe=J.min.y,Ze=J.isBox3?J.min.z:0;else{let Tt=Math.pow(2,-q);be=Math.floor(_t.width*Tt),ve=Math.floor(_t.height*Tt),v.isDataArrayTexture?Ee=_t.depth:v.isData3DTexture?Ee=Math.floor(_t.depth*Tt):Ee=1,Pe=0,Xe=0,Ze=0}X!==null?(Te=X.x,at=X.y,Ct=X.z):(Te=0,at=0,Ct=0);let dt=ge.convert(B.format),Yt=ge.convert(B.type),Me;B.isData3DTexture?(Q.setTexture3D(B,0),Me=z.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Q.setTexture2DArray(B,0),Me=z.TEXTURE_2D_ARRAY):(Q.setTexture2D(B,0),Me=z.TEXTURE_2D),x.activeTexture(z.TEXTURE0),x.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,B.flipY),x.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),x.pixelStorei(z.UNPACK_ALIGNMENT,B.unpackAlignment);let tn=x.getParameter(z.UNPACK_ROW_LENGTH),et=x.getParameter(z.UNPACK_IMAGE_HEIGHT),An=x.getParameter(z.UNPACK_SKIP_PIXELS),Yn=x.getParameter(z.UNPACK_SKIP_ROWS),Ii=x.getParameter(z.UNPACK_SKIP_IMAGES);x.pixelStorei(z.UNPACK_ROW_LENGTH,_t.width),x.pixelStorei(z.UNPACK_IMAGE_HEIGHT,_t.height),x.pixelStorei(z.UNPACK_SKIP_PIXELS,Pe),x.pixelStorei(z.UNPACK_SKIP_ROWS,Xe),x.pixelStorei(z.UNPACK_SKIP_IMAGES,Ze);let Tr=v.isDataArrayTexture||v.isData3DTexture,ht=B.isDataArrayTexture||B.isData3DTexture;if(v.isDepthTexture){let Tt=$.get(v),Li=$.get(B),pt=$.get(Tt.__renderTarget),Di=$.get(Li.__renderTarget);x.bindFramebuffer(z.READ_FRAMEBUFFER,pt.__webglFramebuffer),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,Di.__webglFramebuffer);for(let Ar=0;Ar<Ee;Ar++)Tr&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,$.get(v).__webglTexture,q,Ze+Ar),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,$.get(B).__webglTexture,ye,Ct+Ar)),z.blitFramebuffer(Pe,Xe,be,ve,Te,at,be,ve,z.DEPTH_BUFFER_BIT,z.NEAREST);x.bindFramebuffer(z.READ_FRAMEBUFFER,null),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(q!==0||v.isRenderTargetTexture||$.has(v)){let Tt=$.get(v),Li=$.get(B);x.bindFramebuffer(z.READ_FRAMEBUFFER,A),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,U);for(let pt=0;pt<Ee;pt++)Tr?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Tt.__webglTexture,q,Ze+pt):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Tt.__webglTexture,q),ht?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Li.__webglTexture,ye,Ct+pt):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Li.__webglTexture,ye),q!==0?z.blitFramebuffer(Pe,Xe,be,ve,Te,at,be,ve,z.COLOR_BUFFER_BIT,z.NEAREST):ht?z.copyTexSubImage3D(Me,ye,Te,at,Ct+pt,Pe,Xe,be,ve):z.copyTexSubImage2D(Me,ye,Te,at,Pe,Xe,be,ve);x.bindFramebuffer(z.READ_FRAMEBUFFER,null),x.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else ht?v.isDataTexture||v.isData3DTexture?z.texSubImage3D(Me,ye,Te,at,Ct,be,ve,Ee,dt,Yt,_t.data):B.isCompressedArrayTexture?z.compressedTexSubImage3D(Me,ye,Te,at,Ct,be,ve,Ee,dt,_t.data):z.texSubImage3D(Me,ye,Te,at,Ct,be,ve,Ee,dt,Yt,_t):v.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,ye,Te,at,be,ve,dt,Yt,_t.data):v.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,ye,Te,at,_t.width,_t.height,dt,_t.data):z.texSubImage2D(z.TEXTURE_2D,ye,Te,at,be,ve,dt,Yt,_t);x.pixelStorei(z.UNPACK_ROW_LENGTH,tn),x.pixelStorei(z.UNPACK_IMAGE_HEIGHT,et),x.pixelStorei(z.UNPACK_SKIP_PIXELS,An),x.pixelStorei(z.UNPACK_SKIP_ROWS,Yn),x.pixelStorei(z.UNPACK_SKIP_IMAGES,Ii),ye===0&&B.generateMipmaps&&z.generateMipmap(Me),x.unbindTexture()},this.initRenderTarget=function(v){$.get(v).__webglFramebuffer===void 0&&Q.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Q.setTextureCube(v,0):v.isData3DTexture?Q.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Q.setTexture2DArray(v,0):Q.setTexture2D(v,0),x.unbindTexture()},this.resetState=function(){Z=0,K=0,ne=null,x.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var gd=new Sn,cl=new V,cs=class extends Hs{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new Kt(e,3)),this.setAttribute("uv",new Kt(t,2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new Yi(t,6,1);return this.setAttribute("instanceStart",new kn(n,3,0)),this.setAttribute("instanceEnd",new kn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new Yi(t,6,1);return this.setAttribute("instanceColorStart",new kn(n,3,0)),this.setAttribute("instanceColorEnd",new kn(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Os(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),gd.setFromBufferAttribute(t),this.boundingBox.union(gd))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jn),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)cl.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(cl)),cl.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(cl));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}};he.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new We},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};an.line={uniforms:ta.merge([he.common,he.fog,he.line]),vertexShader:`
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
		`};var us=class extends sn{constructor(e){super({type:"LineMaterial",uniforms:ta.clone(an.line.uniforms),vertexShader:an.line.vertexShader,fragmentShader:an.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}};var Qc=new Ke,xd=new V,_d=new V,zt=new Ke,kt=new Ke,ni=new Ke,eu=new V,tu=new ke,Gt=new Ws,vd=new V,ul=new Sn,hl=new jn,ii=new Ke,ri,mr;function yd(i,e,t){return ii.set(0,0,-e,1).applyMatrix4(i.projectionMatrix),ii.multiplyScalar(1/ii.w),ii.x=mr/t.width,ii.y=mr/t.height,ii.applyMatrix4(i.projectionMatrixInverse),ii.multiplyScalar(1/ii.w),Math.abs(Math.max(ii.x,ii.y))}function a_(i,e){let t=i.matrixWorld,n=i.geometry,r=n.attributes.instanceStart,s=n.attributes.instanceEnd,a=Math.min(n.instanceCount,r.count);for(let o=0,l=a;o<l;o++){Gt.start.fromBufferAttribute(r,o),Gt.end.fromBufferAttribute(s,o),Gt.applyMatrix4(t);let c=new V,u=new V;ri.distanceSqToSegment(Gt.start,Gt.end,u,c),u.distanceTo(c)<mr*.5&&e.push({point:u,pointOnLine:c,distance:ri.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function o_(i,e,t){let n=e.projectionMatrix,s=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),d=-e.near;ri.at(1,ni),ni.w=1,ni.applyMatrix4(e.matrixWorldInverse),ni.applyMatrix4(n),ni.multiplyScalar(1/ni.w),ni.x*=s.x/2,ni.y*=s.y/2,ni.z=0,eu.copy(ni),tu.multiplyMatrices(e.matrixWorldInverse,a);for(let h=0,f=u;h<f;h++){if(zt.fromBufferAttribute(l,h),kt.fromBufferAttribute(c,h),zt.w=1,kt.w=1,zt.applyMatrix4(tu),kt.applyMatrix4(tu),zt.z>d&&kt.z>d)continue;if(zt.z>d){let P=zt.z-kt.z,S=(zt.z-d)/P;zt.lerp(kt,S)}else if(kt.z>d){let P=kt.z-zt.z,S=(kt.z-d)/P;kt.lerp(zt,S)}zt.applyMatrix4(n),kt.applyMatrix4(n),zt.multiplyScalar(1/zt.w),kt.multiplyScalar(1/kt.w),zt.x*=s.x/2,zt.y*=s.y/2,kt.x*=s.x/2,kt.y*=s.y/2,Gt.start.copy(zt),Gt.start.z=0,Gt.end.copy(kt),Gt.end.z=0;let M=Gt.closestPointToPointParameter(eu,!0);Gt.at(M,vd);let g=Dc.lerp(zt.z,kt.z,M),p=g>=-1&&g<=1,b=eu.distanceTo(vd)<mr*.5;if(p&&b){Gt.start.fromBufferAttribute(l,h),Gt.end.fromBufferAttribute(c,h),Gt.start.applyMatrix4(a),Gt.end.applyMatrix4(a);let P=new V,S=new V;ri.distanceSqToSegment(Gt.start,Gt.end,S,P),t.push({point:S,pointOnLine:P,distance:ri.origin.distanceTo(S),object:i,face:null,faceIndex:h,uv:null,uv1:null})}}}var dl=class extends Dt{constructor(e=new cs,t=new us({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let a=0,o=0,l=t.count;a<l;a++,o+=2)xd.fromBufferAttribute(t,a),_d.fromBufferAttribute(n,a),r[o]=o===0?0:r[o-1],r[o+1]=r[o]+xd.distanceTo(_d);let s=new Yi(r,2,1);return e.setAttribute("instanceDistanceStart",new kn(s,1,0)),e.setAttribute("instanceDistanceEnd",new kn(s,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;if(r===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;ri=e.ray;let a=this.matrixWorld,o=this.geometry,l=this.material;mr=l.linewidth+s,o.boundingSphere===null&&o.computeBoundingSphere(),hl.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=mr*.5;else{let d=Math.max(r.near,hl.distanceToPoint(ri.origin));c=yd(r,d,l.resolution)}if(hl.radius+=c,ri.intersectsSphere(hl)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),ul.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=mr*.5;else{let d=Math.max(r.near,ul.distanceToPoint(ri.origin));u=yd(r,d,l.resolution)}ul.expandByScalar(u),ri.intersectsBox(ul)!==!1&&(n?a_(this,t):o_(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(Qc),this.material.uniforms.resolution.value.set(Qc.z,Qc.w))}};function Sd(i,e){let t=!1,n="stopped",r=0,s=0,a=0,o=0,l=0,c=0,u=null,d=null,h=null,f=null,_=null,M=["movestart","dragstart","zoomstart","rotatestart","pitchstart"],g=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,p=()=>{r&&cancelAnimationFrame(r),r=0,s=0};function b(C){if(u!==C){if(u){for(let Y of M)u.off(Y,P);u.off("resize",S)}if(u=C,C){for(let Y of M)C.on(Y,P);C.on("resize",S)}}}function P(C){C.originalEvent&&(i().cancelPending?.(),m({freezePose:!0}))}function S(){t&&ne()}function w(){let C=i(),Y={bearing:C.bearing||0,tilt:C.tilt??90};if(!C.visible||C.orientationMode==="fixed"||!C.bounds)return Y;if(t)return{bearing:a,tilt:C.orientationMode==="billboard"?55:Y.tilt};let te=C.map;if(!te)return Y;let xe=window.maplibregl.MercatorCoordinate.fromLngLat(C.anchor),ce=xe.meterInMercatorCoordinateUnits(),le=window.maplibregl.MercatorCoordinate.fromLngLat(te.transform.getCameraLngLat(),te.transform.getCameraAltitude()),H=[(le.x-xe.x)/ce,(xe.y-le.y)/ce,le.z/ce],O=Y;for(let j=0;j<6;j++)O=window.GeoGlyphGroundTransform.facing(H,C.pose(O).localCenter,Y.tilt,C.orientationMode);return O}function E(){let C=i(),Y=C.map;b(Y),Y&&!d&&(d={map:Y,clamped:C.restoredElevatedView?!0:Y.getCenterClampedToGround(),elevation:C.restoredElevatedView?0:Y.getCenterElevation()})}function L(){let C=i().map;E(),C.setCenterClampedToGround(!1)}function m({freezePose:C=!1}={}){let Y=i(),te=Y.map,xe=t,ce=C&&xe&&Y.visible&&Y.bounds?{...Y.renderedAngles||w()}:null;t=!1,n="stopped",p(),h=null,f=null,ce&&Y.freezePose?.(ce),xe&&(te?.triggerRepaint(),e())}function y(){if(m(),d){let C=d;d=null,C.map.setCenterClampedToGround(C.clamped),C.map.jumpTo({elevation:C.elevation})}}function R(C,Y,te,xe,ce=18){let le=C.map,H=C.pose(xe),O=le.transform,j=window.GeoGlyphGroundTransform.framingPadding(O.width,O.height),se=le.getMinZoom(),oe=Math.max(se,Math.min(ce,le.getMaxZoom())),Ae;if(Y){let je=C.pose({bearing:C.orientationMode==="fixed"&&C.bearing||0,tilt:C.orientationMode==="billboard"?55:C.tilt});if(Ae=JSON.stringify([C.bounds,C.anchor,C.orientationMode,C.bearing,C.tilt,je.center,je.elevation,je.geographic.elements,je.object.elements,O.width,O.height,O.fov,O.tileSize,O.roll||0,se,oe]),_?.key===Ae)return _.zoom}let $e=C.bounds,ze=[];for(let je of[$e.minX,$e.maxX])for(let Ne of[$e.minY,$e.maxY])for(let T of[$e.minZ,$e.maxZ])ze.push(new Ke(je,Ne,T,1));let Re=[],tt=(je,Ne)=>{let T=O.clone();T.setRenderWorldCopies(!0),window.GeoGlyphBasemapCoverage?.preserveCameraTarget(T),T.setCenter(Ne.center),T.setElevation(Ne.elevation),T.setPitch(55),T.setBearing(je);let x=new ke().multiplyMatrices(Ne.geographic,Ne.object);Re.push({transform:T,center:Ne.center,elevation:Ne.elevation,points:ze.map(G=>G.clone().applyMatrix4(x))})};if(Y)for(let je=0;je<360;je+=5)tt(je,C.pose({bearing:C.orientationMode==="fixed"?C.bearing||0:je,tilt:C.orientationMode==="billboard"?55:C.tilt}));else tt(te,H);let Ge=1-2*j.left/O.width,ct=1-2*j.top/O.height,xt=je=>{for(let Ne of Re){Ne.transform.setZoom(je),Ne.transform.setCenter(Ne.center),Ne.transform.setElevation(Ne.elevation);let T=Ne.transform.getProjectionDataForCustomLayer().mainMatrix;for(let x of Ne.points){let G=T[0]*x.x+T[4]*x.y+T[8]*x.z+T[12],$=T[1]*x.x+T[5]*x.y+T[9]*x.z+T[13],Q=T[3]*x.x+T[7]*x.y+T[11]*x.z+T[15];if(!(Q>0)||!Number.isFinite(G)||!Number.isFinite($)||Math.abs(G)>Ge*Q||Math.abs($)>ct*Q)return!1}}return!0},At=Y?Math.log2(1.02):0,Qe=se,nt=oe+At;if(xt(nt))Qe=nt;else for(let je=0;je<24;je++){let Ne=(Qe+nt)/2;xt(Ne)?Qe=Ne:nt=Ne}let z=Math.max(se,Math.min(oe,Qe-At));return Y&&(_={key:Ae,zoom:z}),z}function I(C={}){let Y=i(),xe=Y.map.getBearing(),ce=C.orbit?xe:C.cameraBearing??(Y.bearing||0)+25,le=xe+((ce-xe+180)%360+360)%360-180,H=55,O=C.orbit?{bearing:Y.orientationMode==="fixed"?Y.bearing||0:a,tilt:Y.orientationMode==="billboard"?H:Y.tilt}:{bearing:Y.orientationMode==="fixed"?Y.bearing||0:le,tilt:Y.orientationMode==="billboard"?H:Y.tilt},j=Y.pose(O),se=R(Y,!!C.orbit,le,O,C.maxZoom);return{center:j.center,elevation:j.elevation,zoom:se,pitch:H,bearing:le,duration:g()?0:C.duration??650}}function F(C={}){let Y=i();if(!Y.visible)return!1;if(C.preserveOrbit&&t){Y.map.stop(),L();let te=I({...C,orbit:!0});return o=te.zoom,f=null,A(te,!0),!0}return m(),Y.map.stop(),L(),C.orbit&&(a=Y.map.getBearing()),A(I(C)),!0}function D(){let C=i().map,Y=C.getCenter();return{center:[Y.lng,Y.lat],elevation:C.getCenterElevation(),zoom:C.getZoom(),pitch:C.getPitch(),bearing:C.getBearing()}}function A(C,Y=!1){let te=i().map,xe=D();if(!C.duration){te.jumpTo(C),n=t?"orbiting":"stopped",U();return}h={from:xe,target:C,elapsed:0,followOrbit:Y},n="framing",s=0,U()}function U(){(h||t&&n==="orbiting")&&!r&&!document.hidden&&!c&&(r=requestAnimationFrame(Z))}function Z(C){r=0;let Y=i();if(!t&&!h||!Y.visible){m();return}if(document.hidden||c){s=0;return}let te=s?Math.max(0,Math.min(100,C-s)):0;if(s=C,h){let ce=h;ce.elapsed+=te;let le=Math.min(1,ce.elapsed/ce.target.duration),H=le*le*(3-2*le),O=(oe,Ae)=>oe+(Ae-oe)*H,j=ce.target;if(ce.followOrbit){a=window.GeoGlyphGroundTransform.advanceOrbit(a,te/1e3,Y.period);let oe=Y.pose(w());j={...j,center:oe.center,elevation:oe.elevation,bearing:a},l++}let se={center:[O(ce.from.center[0],j.center.lng),O(ce.from.center[1],j.center.lat)]};for(let oe of["elevation","zoom","pitch"])se[oe]=O(ce.from[oe],j[oe]);se.bearing=ce.followOrbit?a:O(ce.from.bearing,j.bearing),Y.map.jumpTo(se,{geoglyphFraming:!0}),le===1&&(h=null,n=t?"orbiting":"stopped",s=0,e()),U();return}if(a=window.GeoGlyphGroundTransform.advanceOrbit(a,te/1e3,Y.period),f){f.elapsed+=te;let ce=Math.min(1,f.elapsed/650),le=ce*ce*(3-2*ce);o=f.from+(f.to-f.from)*le,ce===1&&(f=null)}let xe=Y.pose(w());Y.map.jumpTo({center:xe.center,elevation:xe.elevation,zoom:o,pitch:55,bearing:a},{geoglyphOrbit:!0}),l++,U()}function K(C={}){let Y=i();if(!Y.visible)return!1;m(),Y.map.stop(),L(),window.GeoGlyphMapEngine.cancelInitialFit(),a=Y.map.getBearing(),t=!0,n="framing";let te=I({orbit:!0,pitch:55});return o=C.framed?Y.map.getZoom():te.zoom,C.framed?(n="orbiting",h=null,U()):A(te),e(),!0}function ne(){if(!t)return;let C=I({orbit:!0,pitch:55});if(h){if(Math.abs(h.target.zoom-C.zoom)<=.001&&h.target.elevation===C.elevation&&h.target.center.lng===C.center.lng&&h.target.center.lat===C.center.lat)return;let te=Math.max(1,h.target.duration-h.elapsed);h={...h,from:D(),target:{...h.target,center:C.center,elevation:C.elevation,zoom:C.zoom,duration:te},elapsed:0},o=C.zoom;return}o=i().map.getZoom(),(!f||Math.abs(f.to-C.zoom)>.001)&&(f=Math.abs(C.zoom-o)>.001?{from:o,to:C.zoom,elapsed:0}:null);let Y=i().pose(w());i().map.jumpTo({center:Y.center,elevation:Y.elevation,zoom:o,pitch:55,bearing:a},{geoglyphOrbit:!0})}function N(){if(!t&&!h)return()=>{};c++,p();let C=!1;return()=>{C||(C=!0,c=Math.max(0,c-1),s=0,U())}}function W(){p(),document.hidden||U()}return document.addEventListener("visibilitychange",W),{getAngles:w,fit:F,start:K,stop:m,exit:y,enter:E,pause:N,retarget:ne,isRunning:()=>t,stats:()=>({orbiting:t,phase:n,scheduled:!!r,paused:c>0,frames:l,bearing:a,angles:w()}),dispose(){y(),b(null),document.removeEventListener("visibilitychange",W)}}}function Md(i){let e=new Map,t=new Map,n=32*1024*1024,r=null,s=0,a=0,o=0,l=()=>[...e.values()].reduce((f,_)=>f+_.bytes,0);function c(f){for(let[_,M]of e){if(e.size<=3&&l()<=n)break;_===r||_===f||(M.geometry.dispose(),M.lineGeometry.dispose(),e.delete(_),o++)}}function u(f){let _=e.get(f);return _?(e.delete(f),e.set(f,_),a++,_):null}async function d(f){let _=f.renderKey,M=u(_);if(M)return M;if(t.has(_))return t.get(_);let g=s,p=(async()=>{let b=await i(_,f);if(g!==s)throw Error("Model preparation cancelled");let P=b.bytes+b.outline.byteLength+(f.vertices||0)*16;if(P>n)throw Error("Prepared model exceeds the 32 MiB budget; reduce curve quality or message length");let S=new dn;S.setAttribute("position",new Jt(b.position,3)),S.setAttribute("normal",new Jt(b.normal,3)),b.groups.forEach(L=>S.addGroup(L.start,L.count,L.materialIndex));let w=new cs;w.setPositions(b.outline);let E={key:_,model:f,mesh:b,geometry:S,lineGeometry:w,bytes:P};if(r&&e.get(r)?.bytes+P>n)throw S.dispose(),w.dispose(),Error("Combined models exceed the 32 MiB budget; reduce curve quality or message length");return e.set(_,E),c(_),E})().finally(()=>{t.get(_)===p&&t.delete(_)});return t.set(_,p),p}function h(){s++;for(let f of e.values())f.geometry.dispose(),f.lineGeometry.dispose();e.clear(),t.clear(),r=null}return{get:u,prepare:d,activate(f){r=f.key,e.delete(f.key),e.set(f.key,f),c()},clear:h,stats:()=>({entries:e.size,bytes:l(),hits:a,evictions:o,pending:t.size})}}var fl={box:`<svg aria-hidden="true" focusable="false"
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
`};var l_=`precision highp float;
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
}`,c_=`precision highp float;
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
}`,u_=`precision highp float;
in vec3 position;
out vec2 vUv;
void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,0.0,1.0);}`,h_=`precision highp float;
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
}`;function nu(i,e){return Number.isFinite(i)?i:e}function gr(){return Object.assign(new Error("Font morph preparation cancelled."),{code:"MORPH_CANCELLED"})}function iu(i,e){return i.aborted?Promise.reject(gr()):new Promise((t,n)=>{let r=!1,s=(l,c)=>{r||(r=!0,clearTimeout(o),i.removeEventListener("abort",a),l(c))},a=()=>s(n,gr()),o=setTimeout(()=>s(n,Object.assign(new Error("Font morph GPU preparation timed out. Try a shorter message."),{code:"MORPH_TIMEOUT"})),3e4);i.addEventListener("abort",a,{once:!0}),Promise.resolve().then(()=>{if(i.aborted)throw gr();return e()}).then(l=>s(t,l),l=>s(n,l))})}function d_(i){let e;return iu(i,()=>new Promise(t=>{e=requestAnimationFrame(t)})).finally(()=>{e!==void 0&&cancelAnimationFrame(e)})}function bd(i){let e=i.fromBounds||i.bounds,t=i.bounds,n=Math.max(1e-6,nu(e.height,e.maxY-e.minY)),r=nu(e.cx,(e.minX+e.maxX)/2),s=nu(e.cy,(e.minY+e.maxY)/2);return{height:n,cx:r,cy:s,bounds:{minX:(t.minX-r)/n,maxX:(t.maxX-r)/n,minY:-(t.maxY-s)/n,maxY:-(t.minY-s)/n,minZ:-.5,maxZ:.5}}}function wd({id:i="geoglyph-font-morph",map:e,getPose:t,getStyle:n=()=>({}),onError:r=()=>{},forceManualFiltering:s=!1}){let a=null,o=null,l=0,c=!0,u=!1,d=[],h=0,f=null,_=new Set,M=0,g=0,p=0,b=0,P=0,S="",w=0,E,L,m=!1,y=new ke,R=new ke,I=new ke,F=new Oe,D=new Ke,A=new Ke,U=new qe,Z=new qe,K=new qe;return{id:i,type:"custom",renderingMode:"3d",ready:!1,onAdd(N,W){if(typeof W.texStorage2D!="function")throw new Error("Font morphing requires WebGL 2.");m=!s&&!!W.getExtension("OES_texture_float_linear"),this.renderer=new os({canvas:e.getCanvas(),context:W,antialias:!1}),this.renderer.autoClear=!1,this.scene=new Si,this.camera=new Mi,this.ready=!0,this.renderer.debug.onShaderError=(C,Y,te,xe)=>{throw new Error("Font morph shader could not compile: "+(C.getProgramInfoLog(Y)||C.getShaderInfoLog(xe)||C.getShaderInfoLog(te)))},this.compositeScene=new Si,this.compositeGeometry=new Hi(2,2),this.compositeMaterial=new ur({glslVersion:is,vertexShader:u_,fragmentShader:h_,uniforms:{uCoverage:{value:null},uFill:{value:U},uOutline:{value:K},uOpacity:{value:1},uMatrix:{value:y},uInverse:{value:R}},depthWrite:!1,depthTest:!0,transparent:!0,side:Qt}),this.compositeMaterial.forceSinglePass=!0,this.compositeMesh=new Dt(this.compositeGeometry,this.compositeMaterial),this.compositeMesh.frustumCulled=!1,this.compositeScene.add(this.compositeMesh),this.contextLost=()=>{c=!1,r(new Error("Graphics context lost. Prepare the font morph again after the map recovers."))},e.getCanvas().addEventListener("webglcontextlost",this.contextLost),a&&this.build()},setModel(N){if(u)throw new Error("Font morph layer has been disposed.");if(!N?.glyphs?.length||!N?.bounds)throw new Error("No outline glyphs were prepared for morphing.");++h,f?.abort();let W=bd(N),C=this.ready?this.buildResources(N,W):[];return this.release(),o=W,a=N,this.install(C),e.triggerRepaint(),this.getBounds()},build(){let N=this.buildResources(a,o);this.release(),this.install(N)},buildResources(N,W){let{height:C,cx:Y,cy:te}=W,xe=[],ce=new Map;try{for(let le of N.glyphs){let H=le.fromField||le.source,O=le.toField||le.target;if(!H||!O||H.length!==le.width*le.height||O.length!==H.length)throw new Error("Invalid morph distance field.");let j=ce.get(H);j||(j=new Map,ce.set(H,j));let se=j.get(O),oe=0;if(!se){let Qe=new Float32Array(H.length*2);for(let nt=0;nt<H.length;nt++)Qe[nt*2]=H[nt]/C,Qe[nt*2+1]=O[nt]/C;se=new Jr(Qe,le.width,le.height,ei,bn),se.minFilter=m?Lt:Pt,se.magFilter=se.minFilter,se.wrapS=yn,se.wrapT=yn,se.generateMipmaps=!1,se.flipY=!1,se.needsUpdate=!0,j.set(O,se),oe=Qe.byteLength}let Ae=le.bounds||le.rect,$e=le.from||le.originA,ze=le.to||le.originB,Re=[Ae[0]/C,-Ae[3]/C,Ae[2]/C,-Ae[1]/C],tt={uFields:{value:se},uTextureSize:{value:new We(le.width,le.height)},uRect:{value:new Ke(...Re)},uFrom:{value:new We(($e[0]-Y)/C,-($e[1]-te)/C)},uTo:{value:new We((ze[0]-Y)/C,-(ze[1]-te)/C)},uProgress:{value:l},uMatrix:{value:y},uInverse:{value:R},uViewport:{value:new We(1,1)},uNormal:{value:F},uFill:{value:U},uFillLinear:{value:Z},uOutline:{value:K},uOutlineLocal:{value:0},uOpacity:{value:1},uPixel:{value:Math.max((Re[2]-Re[0])/le.width,(Re[3]-Re[1])/le.height)},uExtruded:{value:!0},uCoveragePass:{value:!1},uHardwareLinear:{value:m}},Ge=new Vi(Re[2]-Re[0],Re[3]-Re[1],1);Ge.translate((Re[0]+Re[2])/2,(Re[1]+Re[3])/2,0);let ct=new Hi(Re[2]-Re[0],Re[3]-Re[1]);ct.translate((Re[0]+Re[2])/2,(Re[1]+Re[3])/2,0);let xt=new ur({glslVersion:is,vertexShader:l_,fragmentShader:c_,uniforms:tt,side:Ot,transparent:!1,depthWrite:!0,depthTest:!0});xt.forceSinglePass=!0;let At=new Dt(Ge,xt);At.frustumCulled=!1,xe.push({texture:se,material:xt,geometry:Ge,flatGeometry:ct,mesh:At,uniforms:tt,bytes:oe})}}catch(le){throw this.releaseResources(xe),le}return xe},install(N){d=N;for(let W of N)this.scene?.add(W.mesh),b+=W.bytes},async prepareModel(N,{isCurrent:W=()=>!0,signal:C}={}){if(!this.ready||u)throw new Error("Add the font morph layer to the map before preparing it.");if(!N?.glyphs?.length||!N?.bounds)throw new Error("No outline glyphs were prepared for morphing.");if(C?.aborted)throw gr();f?.abort();let Y=new AbortController;f=Y;let te=()=>Y.abort();C?.addEventListener("abort",te,{once:!0});let xe=++h,ce,le=[],H=()=>xe===h&&!u&&W();try{ce=bd(N),le=this.buildResources(N,ce),_.add(le);let O=new Set;for(let se of le)if(!O.has(se.texture)){if(await d_(Y.signal),!H())throw gr();this.renderer.resetState(),this.renderer.initTexture(se.texture),this.renderer.resetState(),M++,O.add(se.texture)}if(!H())throw gr();let j=new Si;for(let se of le)j.add(se.mesh);if(this.renderer.resetState(),await iu(Y.signal,()=>this.renderer.compileAsync(j,this.camera)),this.renderer.resetState(),await iu(Y.signal,()=>this.renderer.compileAsync(this.compositeScene,this.camera)),this.renderer.resetState(),!H())throw gr();return _.delete(le),this.release(),a=N,o=ce,this.install(le),e.triggerRepaint(),this.getBounds()}catch(O){throw _.delete(le),this.releaseResources(le),this.renderer?.resetState(),O}finally{C?.removeEventListener("abort",te),f===Y&&(f=null)}},setProgress(N){l=Math.max(0,Math.min(1,Number(N)||0));for(let W of d)W.uniforms.uProgress.value=l;p++,e.triggerRepaint()},setVisible(N){c=!!N,e.triggerRepaint()},getBounds(){return o?{...o.bounds}:null},ensureCoverageTarget(N,W){let C=Math.min(1,Math.sqrt(4194304/(N*W)),4096/N,4096/W),Y=Math.max(1,Math.floor(N*C)),te=Math.max(1,Math.floor(W*C));return this.coverageTarget?(this.coverageTarget.width!==Y||this.coverageTarget.height!==te)&&this.coverageTarget.setSize(Y,te):this.coverageTarget=new jt(Y,te,{depthBuffer:!1,stencilBuffer:!1}),w=Y*te*4,this.compositeMaterial.uniforms.uCoverage.value=this.coverageTarget.texture,this.coverageTarget},render(N,W){let C=n();if(!this.ready||!a||!c||C.visible===!1||u)return;let Y=N.getParameter(N.FRAMEBUFFER_BINDING);try{let te=t(this.getBounds());if(!te)return;if(I.fromArray(W.defaultProjectionData?.mainMatrix||W),y.copy(I).multiply(te.geographic).multiply(te.object),Math.abs(y.determinant())<1e-30)throw new Error("Font morph transform is singular.");R.copy(y).invert(),F.getNormalMatrix(te.object);let xe=e.getCanvas(),ce=N.drawingBufferWidth,le=N.drawingBufferHeight,H=C.extruded!==!1;E!==(C.fill||"#ffffff")&&(E=C.fill||"#ffffff",Z.set(E),U.copy(Z).convertLinearToSRGB()),L!==(C.outline||"#000000")&&(L=C.outline||"#000000",K.set(L).convertLinearToSRGB());let O=ce/Math.max(1,xe.clientWidth),j=0;if(C.outlineWidth>0){let se=o.bounds,oe=(se.minX+se.maxX)/2,Ae=(se.minY+se.maxY)/2,$e=0;D.set(oe,Ae,$e,1).applyMatrix4(y),D.w<=1e-8&&H&&($e=.5,D.set(oe,Ae,$e,1).applyMatrix4(y),D.w<=1e-8&&($e=-.5,D.set(oe,Ae,$e,1).applyMatrix4(y))),D.multiplyScalar(1/D.w),A.set(oe+.01,Ae,$e,1).applyMatrix4(y),A.multiplyScalar(1/A.w);let ze=Math.hypot((A.x-D.x)*ce/2,(A.y-D.y)*le/2)/.01,Re=Number.isFinite(ze)&&ze>0?ze:Math.max(1,le);j=Math.min(.025,C.outlineWidth*O/Math.max(1,Re))}for(let se of d){let oe=se.uniforms;oe.uExtruded.value=H,oe.uCoveragePass.value=!H,oe.uOutlineLocal.value=j,oe.uOpacity.value=H?1:Math.max(0,Math.min(1,C.opacity??1)),oe.uViewport.value.set(ce,le),se.mesh.geometry=H?se.geometry:se.flatGeometry;let Ae=H?te.object.determinant()<0?Qn:Ot:Qt,$e=!H;(se.material.side!==Ae||se.material.transparent!==$e)&&(se.material.side=Ae,se.material.transparent=$e,se.material.needsUpdate=!0),se.material.depthWrite=H,se.material.depthTest=H,se.material.blending=H?Rn:ho,se.material.blendEquation=fo,se.material.blendSrc=qs,se.material.blendDst=qs}if(this.renderer.resetState(),this.renderer.setViewport(0,0,ce,le),H)this.renderer.state.bindFramebuffer(N.FRAMEBUFFER,Y),this.renderer.render(this.scene,this.camera);else{let se=this.ensureCoverageTarget(ce,le);for(let oe of d)oe.uniforms.uViewport.value.set(se.width,se.height);this.renderer.setRenderTarget(se),this.renderer.setClearColor(0,0),this.renderer.clear(!0,!1,!1),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.renderer.state.bindFramebuffer(N.FRAMEBUFFER,Y),this.renderer.setViewport(0,0,ce,le),this.compositeMaterial.uniforms.uOpacity.value=Math.max(0,Math.min(1,C.opacity??1)),this.renderer.render(this.compositeScene,this.camera)}this.renderer.resetState(),N.bindFramebuffer(N.FRAMEBUFFER,Y),g++}catch(te){P++,S=te.message,c=!1,this.renderer?.resetState(),N.bindFramebuffer(N.FRAMEBUFFER,Y),r(te)}},release(){this.releaseResources(d),d=[],b=0},releaseResources(N){let W=new Set;for(let C of N)C.mesh.removeFromParent(),W.add(C.texture),C.material.dispose(),C.geometry.dispose(),C.flatGeometry.dispose();for(let C of W)C.dispose(),C.image&&(C.image.data=null)},stats(){return{ready:this.ready,visible:c,progress:l,glyphs:d.length,uploads:M,renders:g,uniformUpdates:p,bytes:b+w,fieldBytes:b,coverageBytes:w,filtering:m?"hardware-linear":"manual-bilinear",failures:P,lastError:S}},onRemove(){++h,f?.abort(),f=null,this.ready=!1,this.release(),this.renderer?.dispose(),this.renderer=null;for(let N of _)this.releaseResources(N);_.clear(),this.coverageTarget?.dispose(),this.coverageTarget=null,w=0,this.compositeMaterial?.dispose(),this.compositeGeometry?.dispose(),e.getCanvas().removeEventListener("webglcontextlost",this.contextLost)},dispose(){u||(u=!0,c=!1,a=null,this.onRemove())}}}var lt=i=>document.getElementById(i),Ei=()=>window.GeoGlyphMapEngine,It=()=>Ei()?.state,Vt=()=>window.GeoGlyphFontService,Ed="geoglyph-font-morph",f_=["mapExportGeoJsonBtn","mapSaveJpgBtn","mapSavePngBtn","mapCollapsedJpgBtn","mapCollapsedPngBtn"],sa=new Map,Td=new WeakSet,ru=!1,aa=null,on=null,Wt=null,hs=null,pn=0,rt=!1,Ht=!1,oi=!1,St=0,ml="",_l="Choose two built-in outline fonts.",Ki="",ji="",vl="",gl="",wi=0,xr=0,xl=0,Ad=0,yl=null,Ld=0,Cd=0,si=null,Dd=i=>i*i*(3-2*i);function p_(i){let e=0,t=1;for(let n=0;n<24;n++){let r=(e+t)/2;Dd(r)<i?e=r:t=r}return(e+t)/2}function ds(){let i=It();return JSON.stringify([i?.selectedFontId,i?.mode,i?.message,i?.tracking,i?.lineHeight])}function _r(i){return!!i&&i.source==="conference"&&/^conference:/.test(Vt().keyFor(i))&&!i.hasColor&&!/emoji/i.test(i.name)}function fs(){let i=It();if(!i?.previewActive||!i.mapReady)return"Open the map preview before preparing a morph.";let e=window.GeoGlyphScripts?.state();return i.mode!=="message"&&!(i.mode==="arcgis"&&(e?.running||e?.fontCycling))?"Choose Message mode to morph the same text between fonts.":i.extrusionEnabled&&!i.extrusionSolid?"Font morphing needs Solid model enabled in 3D. Transparent 3D is not supported yet.":_r(i.fontRecords.get(i.selectedFontId))?String(i.message||"").trim()?"":"Enter a message to morph.":"Choose a From font in the Font morph panel. Emoji fonts cannot be morphed."}async function pl(){return aa||(aa=(async()=>{let i=lt("geoglyph-conference-fonts");if(!i)throw Error("Built-in font pack is unavailable. Rebuild Geoglyph.");let e=JSON.parse(i.textContent);location.protocol==="file:"&&!e.every(r=>r.data)&&(window.GeoGlyphConferenceFontData||await new Promise((r,s)=>{let a=document.createElement("script");a.src=i.dataset.localFontPack,a.onload=()=>{a.remove(),r()},a.onerror=()=>{a.remove(),s(Error("Keep src/fonts beside index.html, or open the standalone GeoGlyph file."))},document.head.append(a)}),e=window.GeoGlyphConferenceFontData||e);let t=[];for(let r of e){let s=`conference:${r.key}`;if([...It().fontRecords.values()].some(o=>Vt().keyFor(o)===s))continue;let a;if(r.data){let o=atob(r.data),l=new Uint8Array(o.length);for(let c=0;c<o.length;c++)l[c]=o.charCodeAt(c);a=l.buffer}else{let o=await fetch(r.file,{signal:AbortSignal.timeout(15e3)});if(!o.ok)throw Error(`Could not load built-in font ${r.name} (HTTP ${o.status}).`);a=await o.arrayBuffer()}t.push({id:`conference-${r.key.toLowerCase().replace(/\s/g,"-")}`,source:"conference",fontResourceKey:s,name:r.name,family:r.family,style:r.style,hasColor:!!r.emoji,fontCycle:r.fontCycle,arrayBuffer:a})}t.length&&(window.GeoGlyphStudio.registerFonts(t),Ei().refreshFonts());let n=[...It().fontRecords.values()].filter(_r);return m_(n),n})().catch(i=>{throw aa=null,i}),aa)}function m_(i=[...It().fontRecords.values()].filter(_r)){let e=lt("mapMorphTarget");if(!e)return;let t=e.value;e.replaceChildren(new Option("Choose target font\u2026",""),...i.map(r=>new Option(r.name,r.id))),i.some(r=>r.id===t)&&(e.value=t);let n=lt("mapMorphSource");n.replaceChildren(new Option("Choose source font\u2026",""),...i.map(r=>new Option(r.name,r.id))),n.options[0].disabled=!0,Qi()}function oa(){let i=It(),e=i.fontRecords.get(i.selectedFontId);if(!_r(e))return"Choose a From font above. Emoji fonts cannot be morphed.";let t=lt("mapMorphTarget").value;return t?t===e.id?"Choose different From and To fonts.":fs():"Choose a different To font, then Play or drag Progress."}function Xt(i,e=""){_l=i,ml=e,Qi()}function Qi(){if(!ru)return;let i=It(),e=i.fontRecords.get(rt?Ki:i.selectedFontId);lt("mapMorphSource").value=_r(e)?e.id:"";let t=oa();lt("mapMorphStatus").textContent=!rt&&!Ht&&!ml?t||"Ready. Play to morph, or Prepare to enable scrubbing.":_l,lt("mapMorphStatus").dataset.state=ml?"error":Ht?"preparing":"ready",lt("mapMorphPanel").setAttribute("aria-busy",String(Ht)),lt("mapMorphPrepare").disabled=!!t||Ht,lt("mapMorphPlay").disabled=!rt&&!!t||Ht,lt("mapMorphPlay").textContent=oi?"Pause":St>=1?"Replay":"Play",lt("mapMorphPlay").setAttribute("aria-pressed",String(oi)),lt("mapMorphClear").disabled=!rt&&!Ht,lt("mapMorphProgress").disabled=!rt,lt("mapMorphProgress").value=String(St),lt("mapMorphValue").textContent=Math.round(St*100)+"%",lt("mapMorphProgress").setAttribute("aria-valuetext",Math.round(St*100)+" percent");let n=rt&&St>0&&St<1;for(let r of f_){let s=lt(r);if(s){if(n)sa.has(r)||sa.set(r,{disabled:s.disabled,title:s.title}),s.disabled=!0,s.title="Move the morph slider to an endpoint before exporting.";else if(sa.has(r)){let a=sa.get(r);s.disabled=a.disabled,s.title=a.title,sa.delete(r)}}}window.GeoGlyph3D?.refreshExportControls?.()}function Fd(){wi&&cancelAnimationFrame(wi),wi=0,xr=0}function ai(){return oi=!1,Fd(),si?.finish(new DOMException("Message morph cancelled","AbortError")),Qi(),St}function au(){Vt().unpin("morph-from"),Vt().unpin("morph-to")}function Nd(){if(on){let i=It()?.map;try{i?.getLayer(on.id)?i.removeLayer(on.id):on.dispose()}catch{on.dispose()}}on=null}function In({message:i="Morph cleared. The source font is displayed.",restore:e=!0}={}){return++pn,hs?.abort(),hs=null,ai(),rt=Ht=!1,Wt=null,vl=gl="",yl=null,St=0,Ki=ji="",Nd(),au(),e&&(window.GeoGlyph3D?.syncVisibility(),window.GeoGlyph3D?.refreshControls(),It()?.extrusionEnabled&&It()?.previewActive&&!window.GeoGlyph3D?.isVisible()&&window.GeoGlyph3D?.update()),Xt(i),!0}function su(){let i=It();if(rt&&i?.extrusionEnabled&&!i.extrusionSolid){In({message:"Morph stopped: enable Solid model before morphing in 3D."});return}on?.setVisible(rt&&!!i?.previewActive),i?.map?.triggerRepaint()}function g_(i){let e=i?.message||String(i);In({message:"Font morph unavailable: "+e}),Xt(_l,e)}async function la(i=lt("mapMorphTarget")?.value,{targetMessage:e,prepared:t}={}){let n=++pn;hs?.abort(),hs=new AbortController;let r=hs.signal;ai(),Ht=!0,gl=ds(),Cd=performance.now(),Xt("Preparing font shapes\u2026");let s=null,a=null,o=`morph-request-${n}-from`,l=`morph-request-${n}-to`;try{if(await pl(),n!==pn)return!1;let c=fs();if(c)throw Error(c);let u=It(),d=u.fontRecords.get(u.selectedFontId),h=u.fontRecords.get(i);if(Td.has(u.map)||(Td.add(u.map),u.map.getCanvas().addEventListener("webglcontextlost",()=>In({message:"Graphics context lost. Prepare the morph again after the map recovers.",restore:!1})),u.map.on("remove",()=>In({message:"Map closed.",restore:!1}))),!_r(h))throw Error("Choose a built-in outline font as the target.");if(Vt().keyFor(d)===Vt().keyFor(h)&&(e===void 0||e===u.message))throw Error("Choose a different target font or message.");let f=ds(),_=()=>n===pn&&!r.aborted&&f===ds();Vt().pin(d,o),Vt().pin(h,l);let M=t??await Vt().morph(d,h,u.message,{targetMessage:e,tracking:u.tracking,lineHeight:u.lineHeight,signal:r});if(e!==void 0&&(!M.commitEndpoint||M.targetText!==e.replace(/\r\n?/g,`
`)||M.sourceText!==u.message.replace(/\r\n?/g,`
`)))throw Error("Prepared morph does not match its source and target messages.");if(!_())return!1;let g=performance.now()+1e4;for(;!rt&&(u.rebuilding||u.pendingBuild);){if(!_())return!1;if(performance.now()>g)throw Error("The source font is still preparing. Retry the morph in a moment.");await new Promise((E,L)=>{let y=setTimeout(()=>{r.removeEventListener("abort",R),E()},16),R=()=>{clearTimeout(y),L(r.reason)};r.addEventListener("abort",R,{once:!0})})}if(!_())return!1;if(!rt&&u.displayedFontId!==d.id)throw Error("The selected source font could not be displayed. Choose a built-in outline font and retry.");let p=rt?`${Ed}-pending-${n}`:Ed,b,P=null,S={geographic:new ke,object:new ke};if(s=b=wd({id:p,map:u.map,getPose:()=>{let E=window.GeoGlyph3D.morphPose(b.getBounds(),{flat:!u.extrusionEnabled,output:S});return yl=E.angles,E},getStyle:()=>({extruded:u.extrusionEnabled,fill:u.fill,outline:u.outline,outlineWidth:u.outlineWidth,opacity:u.extrusionEnabled?1:u.opacity,visible:u.previewActive}),onError:E=>{on===b?g_(E):P=E}}),a=u.map,s.setVisible(!1),a.addLayer(s),await s.prepareModel(M,{isCurrent:_,signal:r}),P)throw P;if(!_())return!1;let w=on;return++u.buildToken,u.pendingBuild=u.pendingFit=u.explicitFitPending=!1,Ei().cancelInitialFit(),on=s,s=null,Wt=M,Ki=d.id,ji=h.id,vl=f,rt=!0,St=0,Vt().pin(d,"morph-from"),Vt().pin(h,"morph-to"),w&&(u.map.getLayer(w.id)?u.map.removeLayer(w.id):w.dispose()),on.setProgress(0),on.setVisible(!0),Ld=performance.now()-Cd,lt("mapMorphTarget").value=i,window.GeoGlyph3D.syncVisibility(),window.GeoGlyph3D.refreshControls(),Xt(`${d.name} \u2192 ${h.name}. Ready to play or scrub.`),!0}catch(c){return n!==pn||r.aborted||(Xt("Could not prepare morph: "+c.message,c.message),rt||au()),!1}finally{if(Vt().unpin(o),Vt().unpin(l),s)try{a?.getLayer(s.id)?a.removeLayer(s.id):s.dispose()}catch{s.dispose()}n===pn&&(Ht=!1,gl="",hs=null,Qi())}}function Sl(i){St=Math.max(0,Math.min(1,Number(i)||0)),on?.setProgress(St)}function Rd(i){return ai(),rt?(Sl(i),Xt(`${Math.round(St*100)}% \xB7 drag to reshape the message.`),!0):!1}function Ml(i){if(wi=0,!oi||!rt||document.hidden)return;let e=si?.duration??Math.max(.25,Math.min(30,Number(lt("mapMorphDuration").value)||2))*1e3;xr&&(xl+=Math.max(0,i-xr)),xr=i,Sl(Dd(Math.min(1,xl/e))),(i-Ad>=100||St===1)&&(Ad=i,Qi()),St>=1?(oi=!1,xr=0,si?x_(si):Xt("Target font reached. Replay or scrub the transition.")):wi=requestAnimationFrame(Ml)}async function x_(i){let e=()=>si===i&&pn===i.version&&!i.signal?.aborted;try{let t=await Ei().commitMorphEndpoint({fontId:ji,message:Wt.targetText,release(){rt=!1,Nd(),au(),Wt=null,vl="",yl=null,St=0,Ki=ji=""}},e);if(!e())return;if(!t?.ok)throw t?.error||Error("Could not display the morph target.");i.finish(),Xt("Target message and font displayed.")}catch(t){if(!e())return;i.finish(t),In({message:`Could not display the morph target: ${t.message}`}),Xt(_l,t.message)}}function __({duration:i=2,signal:e}={}){let t=fs();return t?Promise.reject(Error(t)):!rt||!Wt?.commitEndpoint||Ht||si?Promise.reject(Error("Prepare a message morph before playing it.")):e?.aborted?(In(),Promise.reject(e.reason)):(ai(),Sl(0),new Promise((n,r)=>{let s={duration:Math.max(.25,Math.min(30,Number(i)||2))*1e3,signal:e,version:pn,finish(o){si===s&&(si=null,e?.removeEventListener("abort",a),o?r(o):n(!0))}},a=()=>{s.finish(e.reason||new DOMException("Message morph cancelled","AbortError")),In()};si=s,e?.addEventListener("abort",a,{once:!0}),xl=0,xr=0,oi=!0,Xt("Morphing message shapes\u2026"),wi=requestAnimationFrame(Ml)}))}async function Pd(){if(oi)return ai(),!0;if(Ht)return!1;if(!rt){let e=pn+1;if(!await la()||pn!==e||!rt)return!1}if(fs())return Xt(fs(),fs()),!1;St>=1&&Sl(0);let i=Math.max(.25,Math.min(30,Number(lt("mapMorphDuration").value)||2))*1e3;return xl=p_(St)*i,oi=!0,xr=0,Xt("Morphing font shapes\u2026"),wi=requestAnimationFrame(Ml),!0}function Id(){let i=Ht?gl:vl;(rt||Ht)&&i&&ds()!==i?In({message:"Message or font changed. Prepare a new morph."}):Qi()}function v_(i){if(!rt)return!1;ai();let e=It();return i&&!e.extrusionSolid?(Xt("Enable Solid model to morph in 3D.","Transparent 3D morphing is not supported yet."),!1):(e.extrusionEnabled=i,i&&e.extrusionDepthMeters==null&&(e.extrusionDepthMeters=Math.max(.1,e.baseHeightMeters*e.relativeSize/1e3)),Ei().refreshControls(),window.GeoGlyph3D.morphModeChanged(i),su(),!0)}function ou(){return!rt||St===0||St===1}function y_(){if(!rt)return[];let i=It(),e=Wt.bounds,t=i.baseHeightMeters*i.relativeSize/100,n=[[e.minX,e.minY],[e.maxX,e.minY],[e.maxX,e.maxY],[e.minX,e.maxY],[e.minX,e.minY]];return Ei().geometry.projectPolygons([[n]],Wt.fromBounds,t/Wt.fromBounds.height,i.bearing,i.anchor)[0][0]}async function S_(){if(!rt||!ou())return null;let i=It(),e=St,t=i.fontRecords.get(e===1?ji:Ki),n=pn,r=e===1&&Wt.commitEndpoint?Wt.targetText:i.message,s=e===1&&Wt.commitEndpoint?Wt.toBounds:Wt.fromBounds,a=await Vt().model(t,r,{tracking:i.tracking,lineHeight:i.lineHeight});if(n!==pn||!rt||St!==e)return null;let o=i.baseHeightMeters*i.relativeSize/100,l=Ei().geometry.projectPolygons(a.polygons,s,o/s.height,i.bearing,i.anchor);return{type:"FeatureCollection",features:[{type:"Feature",properties:{mode:i.mode,message:r,font:t.name,renderer:"font-morph-endpoint",fill:i.fill,outline:i.outline,height_m:o*a.bounds.height/s.height,bearing:i.bearing},geometry:{type:"MultiPolygon",coordinates:l}}]}}async function M_(){if(!rt||Ht||!ou())throw Error("Move the morph slider to an endpoint before exporting.");let i=It(),e=St,t=pn,n=ds(),r=i.fontRecords.get(e===1?ji:Ki),s=e===1&&Wt.commitEndpoint,a={...s?Wt.toBounds:Wt.fromBounds},o=s?Wt.targetText:i.message,l={tracking:i.tracking,lineHeight:i.lineHeight,tolerance:.4},c=()=>rt&&!Ht&&t===pn&&St===e&&ds()===n,u=await Vt().model(r,o,l);if(!c())throw Error("The morph changed before export. Choose an endpoint and retry.");let d=await Vt().mesh(JSON.stringify([Vt().keyFor(r),o,l]),u);if(!c())throw Error("The morph changed before export. Choose an endpoint and retry.");return{mesh:d,model:u,referenceBounds:a,name:r.name,isCurrent:c}}function Ud(){if(ru||!lt("mapFontSelect")||!window.GeoGlyph3D)return;let i=document.createElement("section");i.id="mapMorphPanel",i.className="map-morph-panel map-span-2",i.setAttribute("aria-label","Font morph"),i.innerHTML=`<label class="map-field"><span>From font</span><select id="mapMorphSource" aria-describedby="mapMorphStatus"><option value="">Choose source font\u2026</option></select></label>
    <label class="map-field"><span>To font</span><select id="mapMorphTarget"><option value="">Choose target font\u2026</option></select></label>
    <div class="map-morph-actions"><label class="map-field"><span>Duration</span><div class="map-number"><input id="mapMorphDuration" type="number" min="0.25" max="30" step="0.25" value="2"><em>s</em></div></label>
    <div class="map-morph-buttons" role="group" aria-label="Morph playback"><button class="map-action" id="mapMorphPrepare" type="button" disabled>Prepare</button><button class="map-action" id="mapMorphPlay" type="button" aria-pressed="false" disabled>Play</button></div></div>
    <label class="map-field"><span>Progress <output id="mapMorphValue" for="mapMorphProgress">0%</output></span><input id="mapMorphProgress" type="range" min="0" max="1" step="0.001" value="0" disabled></label>
    <div class="map-morph-footer"><p id="mapMorphStatus" class="map-3d-status" role="status">Choose two built-in outline fonts.</p><button class="map-action" id="mapMorphClear" type="button" disabled>Clear</button></div>`,document.querySelector(".map-3d-panel").after(i),ru=!0,window.GeoGlyphFontMorph=Object.freeze({ensureBuiltins:pl,prepare:la,play:Pd,playToEnd:__,pause:ai,seek:Rd,clear:In,onGeometryChange:Id,setMode:v_,syncVisibility:su,canExport:ou,exportGeoJSON:S_,prepareOBJEndpoint:M_,framingCoordinates:y_,isActive:()=>rt,getBounds:()=>on?.getBounds(),renderedAngles:()=>yl,label:()=>`${It().fontRecords.get(Ki)?.name||"Source"} \u2192 ${It().fontRecords.get(ji)?.name||"Target"}`,stats:()=>({ready:rt,preparing:Ht,playing:oi,progress:St,error:ml,fromId:Ki,toId:ji,lastPreparationMs:Ld,renderer:on?.stats()||null})}),lt("mapMorphPrepare").addEventListener("click",()=>la()),lt("mapMorphSource").addEventListener("change",async e=>{let t=e.target.value;_r(It().fontRecords.get(t))&&(ai(),await Ei().selectFont(t),Ei().refreshControls(),It().selectedFontId===t&&(Xt("Source font selected. Choose a different To font."),oa()||la()))}),lt("mapMorphTarget").addEventListener("change",()=>{oa()?rt||Ht?In({message:oa()}):Xt(oa()):la()}),lt("mapMorphPlay").addEventListener("click",()=>Pd()),lt("mapMorphProgress").addEventListener("input",e=>Rd(e.target.value)),lt("mapMorphDuration").addEventListener("input",()=>ai()),lt("mapMorphClear").addEventListener("click",()=>In()),document.addEventListener("geoglyph:ground-rendered",()=>{Id(),Qi()}),document.addEventListener("geoglyph:ground-style",su),document.addEventListener("visibilitychange",()=>{if(!si){document.hidden&&ai();return}document.hidden?Fd():oi&&!wi&&(wi=requestAnimationFrame(Ml))}),window.addEventListener("pagehide",()=>In({restore:!1})),i.addEventListener("focusin",()=>pl().catch(e=>Xt(e.message,e.message)),{once:!0}),i.addEventListener("pointerenter",()=>pl().catch(e=>Xt(e.message,e.message)),{once:!0}),Qi()}async function Od(i,e,{name:t="GeoGlyph",isCurrent:n=()=>!0,yieldControl:r=()=>new Promise(s=>setTimeout(s,0))}={}){let{position:s,normal:a}=i||{};if(!s?.length||s.length%9||a?.length!==s.length)throw Error("No valid triangle mesh to export");if(!e?.elements?.every(Number.isFinite)||!Number.isFinite(e.determinant())||e.determinant()===0)throw Error("Invalid OBJ transform");let o=e.clone(),l=new Oe().getNormalMatrix(o),c=o.determinant()<0,u=new V,d=new V,f=[`# GeoGlyph OBJ
# Units: metres. X east, Y north, Z up. Origin: map anchor at ground level.
o ${String(t).replace(/[^\p{L}\p{N}_-]+/gu,"_").slice(0,100)||"GeoGlyph"}
`],_=M=>{if(!Number.isFinite(M))throw Error("Mesh contains a non-finite coordinate or normal");return String(Number(M.toFixed(6)))};for(let M=0;M<s.length;M+=9*256){if(!n())throw Error("The object changed before export. Retry with the desired object.");let g=[],p=Math.min(s.length,M+9*256);for(let b=M;b<p;b+=9){for(let E=0;E<3;E++){let L=b+E*3;if(![a[L],a[L+1],a[L+2]].every(Number.isFinite)||(u.fromArray(s,L).applyMatrix4(o),d.fromArray(a,L).applyMatrix3(l),!d.lengthSq()))throw Error("Mesh contains an invalid normal");d.normalize(),g.push(`v ${_(u.x)} ${_(u.y)} ${_(u.z)}
`,`vn ${_(d.x)} ${_(d.y)} ${_(d.z)}
`)}let P=b/3+1,S=P+(c?2:1),w=P+(c?1:2);g.push(`f ${P}//${P} ${S}//${S} ${w}//${w}
`)}f.push(g.join("")),await r()}if(!n())throw Error("The object changed before export. Retry with the desired object.");return new Blob(f,{type:"text/plain;charset=utf-8"})}var lu={version:1,title:"Conference introduction",rows:[{id:"opening",message:"",duration:2,actions:[{type:"camera",value:"opening"},{type:"title",value:"Conference day."}]},{id:"title-2",message:"",duration:2,actions:[{type:"title",value:"Conference day.."}]},{id:"title-3",message:"",duration:2,actions:[{type:"title",value:"Conference day..."}]},{id:"title-4",message:"",duration:2,actions:[{type:"title",value:"Conference day...."}]},{id:"title-5",message:"",duration:2,actions:[{type:"title",value:"Conference day....."}]},{id:"flight",message:"",duration:0,actions:[{type:"title",value:""},{type:"camera",value:"fly-opening"}]},{id:"yawn",message:"\u{1F971}",duration:5,actions:[{type:"font",value:{name:"Segoe UI Emoji",resourceKey:"conference:Segoe UI Emoji"}},{type:"mode",value:"2d"},{type:"size",value:{height:300,depth:30}},{type:"mirror",value:!1}]},{id:"neutral",message:"\u{1F636}",duration:3,actions:[]},{id:"smirk",message:"\u{1F60F}",duration:3,actions:[]},{id:"smirk-mirror",message:"\u{1F60F}",duration:3,actions:[{type:"mirror",value:!0}]},{id:"sunglasses",message:"\u{1F60E}",duration:5,actions:[{type:"mirror",value:!1}]},{id:"hello",message:"Hello",duration:5,actions:[{type:"font",value:{name:"Gill Sans",resourceKey:"conference:Gill Sans"}},{type:"colour",value:{fill:"#F47D22"}},{type:"mode",value:"2d"}]},{id:"geoglyph",message:"I'm Geoglyph",duration:5,actions:[]},{id:"geo",message:"Call me Geo",duration:5,actions:[]},{id:"everything",message:"Everything you about to see",duration:5,actions:[]},{id:"chatgpt",message:"was made by ChatGPT",duration:5,actions:[]},{id:"including",message:"including me!",duration:5,actions:[]},{id:"today",message:"Today I will be presenting",duration:5,actions:[]},{id:"friend",message:"with my best friend",duration:5,actions:[]},{id:"josh",message:"Josh Roberts",duration:5,actions:[]},{id:"where",message:"Where are you Josh?",duration:0,actions:[{type:"mode",value:"3d"},{type:"size",value:{height:3e3,depth:300}},{type:"animation",value:"yaw"}]}]};var cu={version:1,title:"Locate 2026 opening rehearsal",fontCycle:{duration:2,hold:2},rows:[{id:"conference-day",message:"",duration:2,actions:[{type:"camera",value:"opening-and-fly"},{type:"title",value:"Conference Day."}]},{id:"conference-day-2",message:"",duration:2,actions:[{type:"title",value:"Conference Day.."}]},{id:"conference-day-3",message:"",duration:2,actions:[{type:"title",value:"Conference Day..."}]},{id:"conference-day-4",message:"",duration:2,actions:[{type:"title",value:"Conference Day...."}]},{id:"conference-day-5",message:"",duration:2,actions:[{type:"title",value:"Conference Day....."}]},{id:"approach",message:"",duration:0,actions:[{type:"title",value:""},{type:"camera",value:"wait-for-opening-flight"}]},{id:"yawn",message:"\u{1F971}",duration:3,actions:[{type:"font",value:{name:"Segoe UI Emoji",resourceKey:"conference:Segoe UI Emoji"}},{type:"mode",value:"2d"}]},{id:"awake",message:"\u{1F636}",duration:3,actions:[]},{id:"smirk",message:"\u{1F60F}",duration:3,actions:[]},{id:"smirk-mirror",message:"\u{1F60F}",duration:3,actions:[{type:"mirror",value:!0}]},{id:"sunglasses",message:"\u{1F60E}",duration:3,actions:[{type:"mirror",value:!1}]},{id:"hello",message:"Hello!",duration:3,actions:[{type:"font",value:{name:"Gill Sans Ultra Bold Condensed",resourceKey:"conference:Gill Sans"}},{type:"colour",value:{fill:"#FF8500",outline:"#FFFFFF"}},{type:"mode",value:"2d"},{type:"fit",value:!0}]},{id:"seoul",message:"\uC548\uB155\uD558\uC138\uC694",duration:4,actions:[{type:"font",value:{name:"Gugi",resourceKey:"conference:Gugi"}},{type:"location",value:{lat:37.57273,lng:126.97684,caption:"Hello in Korean \xB7 Seoul, South Korea",instant:!0}},{type:"size",value:{height:72,depth:9}},{type:"mode",value:"3d"}]},{id:"tbilisi",message:"\u10D2\u10D0\u10DB\u10D0\u10E0\u10EF\u10DD\u10D1\u10D0",duration:4,actions:[{type:"font",value:{name:"Noto Sans Georgian Bold",resourceKey:"conference:Noto Sans Georgian"}},{type:"location",value:{lat:41.6932,lng:44.8094,caption:"Hello in Georgian \xB7 Tbilisi, Georgia",instant:!0}},{type:"size",value:{height:95,depth:13}},{type:"colour",value:{fill:"#FF45B8",outline:"#FFFFFF"}}]},{id:"yerevan",message:"\u0532\u0561\u0580\u0587",duration:4,actions:[{type:"font",value:{name:"Noto Serif Armenian Bold",resourceKey:"conference:Noto Serif Armenian"}},{type:"location",value:{lat:40.17745,lng:44.51263,caption:"Hello in Armenian \xB7 Yerevan, Armenia",instant:!0}},{type:"size",value:{height:75,depth:7}},{type:"mode",value:"2d"}]},{id:"kyiv",message:"\u041F\u0440\u0438\u0432\u0456\u0442",duration:5,actions:[{type:"font",value:{name:"Montserrat Alternates Bold",resourceKey:"conference:Montserrat Alternates"}},{type:"location",value:{lat:50.45013,lng:30.5234,caption:"Hello in Ukrainian \xB7 Kyiv, Ukraine",instant:!0}},{type:"size",value:{height:180,depth:18}},{type:"colour",value:{fill:"#28EFFF",outline:"#FFFFFF"}}]},{id:"sounion",message:"\u0393\u03B5\u03B9\u03B1 \u03C3\u03B1\u03C2",duration:5,actions:[{type:"font",value:{name:"Fira Sans ExtraBold",resourceKey:"conference:Fira Sans"}},{type:"location",value:{lat:37.6497,lng:24.0287,caption:"Hello in Greek \xB7 Cape Sounion, Greece",instant:!0,cameraBearing:345}},{type:"size",value:{height:120,depth:12}},{type:"mode",value:"3d"}]},{id:"marrakesh",message:"\u2D30\u2D63\u2D53\u2D4D",duration:7,actions:[{type:"font",value:{name:"Noto Sans Tifinagh",resourceKey:"conference:Noto Sans Tifinagh"}},{type:"location",value:{lat:31.62585,lng:-7.9891,caption:"Hello in Tamazight \xB7 Marrakesh, Morocco",instant:!0}},{type:"size",value:{height:1500,depth:150}},{type:"colour",value:{fill:"#FFE747",outline:"#FFFFFF"}}]},{id:"my-name",message:"I'm Geoglyph",duration:3,actions:[{type:"font",value:{name:"Righteous",resourceKey:"conference:Righteous"}},{type:"location",value:{lng:144.95604,lat:-37.82402,caption:"",instant:!0}},{type:"size",value:{height:300,depth:30}},{type:"mode",value:"2d"}]},{id:"call-me",message:"Call me Geo",duration:3,actions:[{type:"font",value:{name:"Bangers",resourceKey:"conference:Bangers"}},{type:"colour",value:{fill:"#FF45B8",outline:"#FFFFFF"}},{type:"fit",value:!0}]},{id:"made-by",message:"I was made by ChatGPT",duration:3,actions:[{type:"font",value:{name:"Archivo Black",resourceKey:"conference:Archivo Black"}},{type:"colour",value:{fill:"#FFE747",outline:"#FFFFFF"}},{type:"fit",value:!0}]},{id:"dialects",message:`I speak all
2D and 3D dialects`,duration:5,actions:[{type:"font",value:{name:"Anton",resourceKey:"conference:Anton"}},{type:"colour",value:{fill:"#28EFFF",outline:"#FFFFFF"}},{type:"mode",value:"3d"},{type:"fit",value:!0}]},{id:"interesting",message:`But here is something
amazing about me`,duration:3,actions:[{type:"font",value:{name:"Graduate",resourceKey:"conference:Graduate"}},{type:"colour",value:{fill:"#FF45B8",outline:"#FFFFFF"}},{type:"mode",value:"2d"},{type:"fit",value:!0}]},{id:"change-fonts",message:"I don't just change fonts",duration:3,actions:[{type:"font",value:{name:"Changa One",resourceKey:"conference:Changa One"}},{type:"colour",value:{fill:"#FFE747",outline:"#FFFFFF"}},{type:"fit",value:!0}]},{id:"morph-between",message:"I morph between them",duration:3,actions:[{type:"font",value:{name:"Passion One",resourceKey:"conference:Passion One"}},{type:"colour",value:{fill:"#BFFF18",outline:"#FFFFFF"}},{type:"fit",value:!0}]},{id:"watch",message:"Watch closely",duration:3,actions:[{type:"font",value:{name:"Alfa Slab One",resourceKey:"conference:Alfa Slab One"}},{type:"colour",value:{fill:"#CE82FF",outline:"#FFFFFF"}},{type:"location",value:{lng:144.96896,lat:-37.81785}},{type:"fit",value:!0}]},{id:"simple",message:`The amazing
Geoglyph`,duration:3,actions:[{type:"font",value:{name:"Staatliches",resourceKey:"conference:Staatliches"}},{type:"colour",value:{fill:"#28EFFF",outline:"#FFFFFF"}},{type:"title",value:"I can start with something simple"},{type:"fit",value:!0}]},{id:"elegant",message:"",duration:3,actions:[{type:"title",value:"Then become something elegant"},{type:"morph",value:{from:{name:"Staatliches",resourceKey:"conference:Staatliches"},to:{name:"Berkshire Swash",resourceKey:"conference:Berkshire Swash"},targetMessage:`The amazing
Geoglyph`,duration:2}},{type:"fit",value:!0}]},{id:"ancient",message:"",duration:3,actions:[{type:"title",value:"Or something ancient"},{type:"morph",value:{from:{name:"Berkshire Swash",resourceKey:"conference:Berkshire Swash"},to:{name:"Cinzel Decorative",resourceKey:"conference:Cinzel Decorative"},targetMessage:`The amazing
Geoglyph`,duration:2}},{type:"fit",value:!0}]},{id:"future",message:"",duration:3,actions:[{type:"title",value:"Or something from the future"},{type:"morph",value:{from:{name:"Cinzel Decorative",resourceKey:"conference:Cinzel Decorative"},to:{name:"Audiowide",resourceKey:"conference:Audiowide"},targetMessage:`The amazing
Geoglyph`,duration:2}},{type:"fit",value:!0}]},{id:"speak-languages",message:"",duration:5,actions:[{type:"location",value:{lng:144.97152,lat:-37.8046,caption:""}},{type:"mode",value:"3d"},{type:"animation",value:"yaw"},{type:"morph",value:{from:{name:"Audiowide",resourceKey:"conference:Audiowide"},to:{name:"Bree Serif",resourceKey:"conference:Bree Serif"},targetMessage:"I don't just speak languages",duration:2}}]},{id:"become-them",message:"",duration:3,actions:[{type:"location",value:{lng:144.95163,lat:-37.82461}},{type:"morph",value:{from:{name:"Bree Serif",resourceKey:"conference:Bree Serif"},to:{name:"Bungee",resourceKey:"conference:Bungee"},targetMessage:"I become them",duration:2}},{type:"fit",value:!0}]},{id:"thanks",message:"",duration:0,actions:[{type:"morph",value:{from:{name:"Bungee",resourceKey:"conference:Bungee"},to:{name:"Bungee",resourceKey:"conference:Bungee"},targetMessage:"Thanks for watching",duration:2}},{type:"fit",value:!0}]}]};var VM=Fu(Bd()),yr=Object.freeze({mode:["2D / 3D","box"],font:["Font","type"],colour:["Colour","palette"],animation:["Animation","orbit"],size:["Size","maximize"],depth:["Depth","layers"],tilt:["Tilt","rotate-3d"],bearing:["Bearing","compass"],mirror:["Mirror","flip"],fit:["Fit","maximize"],morph:["Font morph","blend"],title:["Title overlay","heading"],wait:["Wait","clock"],camera:["Camera flight","camera"],location:["Location","map-pin"]}),li=i=>i&&typeof i=="object"&&!Array.isArray(i),mt=i=>{throw Error(i)},vr=(i,e,t=1e5)=>typeof i=="string"&&i.length<=t?i:mt(e+" must be text"),mn=(i,e,t,n)=>typeof i=="number"&&Number.isFinite(i)&&i>=t&&i<=n?i:mt(e+` must be between ${t} and ${n}`);function uu(i){li(i)||mt("Choose a font");let e={};for(let t of["name","family","style","postscriptName","resourceKey"])i[t]!==void 0&&(e[t]=vr(i[t],"Font "+t,300));return!e.name&&!e.resourceKey&&mt("Choose a font"),e}function ps(i){(!li(i)||!Object.hasOwn(yr,i.type))&&mt("Unknown script action");let{type:e,value:t}=i,n;switch(e){case"mode":n=["2d","3d"].includes(t)?t:mt("Choose 2D or 3D");break;case"font":n=uu(t);break;case"colour":li(t)||mt("Choose a colour"),n={};for(let r of["fill","outline"])t[r]!==void 0&&(n[r]=/^#[\da-f]{6}$/i.test(t[r])?t[r].toUpperCase():mt("Enter a six-digit hex colour"));Object.keys(n).length||mt("Choose fill or outline colour");break;case"animation":n=["none","fixed","yaw","billboard"].includes(t)?t:mt("Choose an animation");break;case"size":li(t)||mt("Choose a size"),n={height:mn(t.height,"Height",1,3e5)},t.depth!==void 0&&(n.depth=mn(t.depth,"Depth",.1,1e5));break;case"depth":n=mn(t,"Depth",.1,1e5);break;case"tilt":n=mn(t,"Tilt",0,90);break;case"bearing":n=mn(t,"Bearing",-360,360);break;case"mirror":case"fit":n=typeof t=="boolean"?t:mt("Choose on or off");break;case"wait":n=mn(t,"Wait",0,3600);break;case"title":n=vr(t,"Title",2e3);break;case"camera":n=li(t)?globalThis.GeoGlyphCameraFlight.validateFlight(t):["opening","opening-and-fly","fly-opening","wait-for-opening-flight","overview"].includes(t)?t:mt("Choose a camera action");break;case"location":li(t)||mt("Choose an artwork location"),n={lng:mn(t.lng,"Longitude",-180,180),lat:mn(t.lat,"Latitude",-85.051129,85.051129)},t.caption!==void 0&&(n.caption=vr(t.caption,"Location caption",2e3)),t.maxZoom!==void 0&&(n.maxZoom=mn(t.maxZoom,"Maximum fit zoom",0,24)),t.cameraBearing!==void 0&&(n.cameraBearing=mn(t.cameraBearing,"Camera bearing",-360,360)),t.instant!==void 0&&(n.instant=typeof t.instant=="boolean"?t.instant:mt("Choose how to move to the location"));break;case"morph":li(t)||mt("Choose morph fonts"),n={from:uu(t.from),to:uu(t.to),duration:mn(t.duration,"Morph duration",.25,30)},t.targetMessage!==void 0&&(n.targetMessage=vr(t.targetMessage,"Target message",2e3),n.targetMessage.trim()||mt("Enter a visible target message or omit it to keep the same text"));break}return{type:e,value:n}}function Ti(i){(!li(i)||i.version!==1||!Array.isArray(i.rows))&&mt("Expected a version 1 Geoglyph script with rows"),i.rows.length>1e4&&mt("Script is too large");let e=new Set,t=0,n=i.rows.map((s,a)=>{try{li(s)||mt("Invalid row");let o=vr(s.id,"Row ID",100);(!o||e.has(o))&&mt("Row IDs must be unique"),e.add(o);let l=vr(s.message??"","Message");t+=l.length;let c=mn(s.duration??5,"Duration",0,3600);(!Array.isArray(s.actions)||s.actions.length>4)&&mt("A row supports at most four actions");let u=s.actions.map(ps),d=new Set(u.map(h=>h.type));return t+=u.find(h=>h.type==="morph")?.value.targetMessage?.length??0,d.size!==u.length&&mt("Only one action per category is allowed"),u.some(h=>h.type==="mode"&&h.value==="2d")&&u.some(h=>h.type==="animation"&&h.value!=="none")&&mt("Orbit, Turn and Face require 3D"),{id:o,message:l,duration:c,actions:u}}catch(o){throw Error(`Row ${a+1}: ${o.message}`)}});t>2e6&&mt("Script text is too large");let r={version:1,title:vr(i.title??"Untitled script","Script title",300),rows:n};return i.fontCycle!==void 0&&(li(i.fontCycle)||mt("Invalid final font cycle"),r.fontCycle={duration:mn(i.fontCycle.duration,"Font cycle duration",.25,30),hold:mn(i.fontCycle.hold,"Font cycle hold",0,3600)}),r}var hu=()=>({id:globalThis.crypto?.randomUUID?.()||"row-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2),message:"",duration:5,actions:[]});function zd(i){return{name:i.name||"",family:i.family||"",style:i.style||"",postscriptName:i.postscriptName||"",resourceKey:i.fontResourceKey||""}}function kd({applyRow:i,changed:e=()=>{},stopped:t=()=>{},now:n=()=>performance.now(),visible:r=()=>!document.hidden,timer:s=setTimeout,cancelTimer:a=clearTimeout}){let o=null,l=0,c=null,u={running:!1,paused:!1,phase:"idle",index:0,rowId:null,error:"",owner:null},d=()=>e({...u});function h({freeze:g=!0}={}){let p=o;o=null,++l,p?.abort(),c?.(),p&&g&&t(),Object.assign(u,{running:!1,paused:!1,phase:"stopped",owner:null}),d()}async function f(g,p,b){let P=g,S=n(),w=!u.paused&&r();await new Promise((E,L)=>{let m,y=F=>{a(m),b.removeEventListener("abort",R),c=null,F?L(F):E()},R=()=>y(new DOMException("Script stopped","AbortError")),I=()=>{a(m);let F=n();if(w&&(P-=Math.max(0,F-S)),S=F,w=!u.paused&&r(),!p())return R();if(u.skip)return u.skip=!1,y();if(!u.paused&&r()&&P<=0)return y();m=s(I,Math.max(1,Math.min(50,P>0?P:50)))};c=I,b.addEventListener("abort",R,{once:!0}),I()})}async function _(g,p=0,{owner:b="manual",isCurrent:P=()=>!0,onRow:S=()=>{},onRowStart:w=()=>{},singleStep:E=!1,prepare:L}={}){let m=Ti(g);if(!m.rows.length)throw Error("Add a script row first");if(!Number.isInteger(p)||p<0||p>=m.rows.length)throw Error("Choose a script row");h({freeze:!1});let y=++l,R=new AbortController;o=R;let I=()=>o===R&&l===y&&!R.signal.aborted&&P();Object.assign(u,{running:!0,paused:!1,phase:L?"preflight":"preparing",index:p,rowId:null,error:"",owner:b,skip:!1}),d();try{let F={signal:R.signal,isCurrent:I,owner:b},D=L?await L(m,F):void 0;if(!I())throw new DOMException("Script stopped","AbortError");for(let A=p;A<m.rows.length;A++){let U=m.rows[A];if(Object.assign(u,{index:A,rowId:U.id,phase:"preparing"}),d(),!I())throw new DOMException("Script stopped","AbortError");if(await w(U,A),await i(U,{...F,prepared:D}),!I())throw new DOMException("Script stopped","AbortError");await S(U,A),u.phase="waiting",E&&(u.paused=!0);let Z=U.actions.find(ne=>ne.type==="wait")?.value??0,K=f((U.duration+Z)*1e3,I,R.signal);d(),await K}return I()?(o=null,Object.assign(u,{running:!1,paused:!1,phase:"complete",owner:null}),d(),!0):!1}catch(F){if(o!==R)return!1;if(o=null,F.name!=="AbortError"){t();let D=u.phase==="preflight"?F.message:`Row ${u.index+1}: ${F.message}`;Object.assign(u,{phase:"error",error:D})}else u.phase="stopped";if(Object.assign(u,{running:!1,paused:!1,owner:null}),d(),F.name!=="AbortError")throw Error(u.error);return!1}}function M(){!o||u.phase==="waiting"&&!c||(u.skip=!0,c?.(),d())}return{play:_,stop:h,state:()=>({...u}),clearError(){o||(u.error="",u.phase="idle")},pause(){o&&(u.paused=!0,c?.(),d())},resume(){o&&(u.paused=!1,c?.(),d())},next:M,wake:()=>c?.()}}var KM=Fu(Gd()),Xd="geoglyph-locate2026.script-draft-v1",ui=()=>window.GeoGlyphMapEngine,Bt=()=>window.GeoGlyphFontMorph,Sr=()=>window.GeoGlyphFontService,pu={resourceKey:"conference:Segoe UI Emoji",name:"Segoe UI Emoji"},du=new WeakMap,Ai=Ti(lu),gs=0,Tl="",ci=null,er=!1,xs=!1,Al=!1,Vd=!1,ms=null,Ci=null,mu=i=>JSON.parse(JSON.stringify(i)),br=()=>document.dispatchEvent(new CustomEvent("geoglyph:script-changed"));function E_(){try{localStorage.setItem(Xd,JSON.stringify(Ai)),Tl=""}catch{Tl="Draft is available for this session. Save JSON to keep it."}}function Cl(){ci?.remove(),ci=null}function qd(){Mr(),Cl(),ui()?.cancelScriptWork?.(),er&&window.GeoGlyph3D?.stopOrbit({freezePose:!0}),Al?Bt()?.clear({restore:!1}):xs&&Bt()?.pause(),er=xs=Al=!1}function wn(i){let e=[...ui().state.fontRecords.values()],n=i.resourceKey&&e.find(r=>window.GeoGlyphFontService.keyFor(r)===i.resourceKey)||e.find(r=>i.postscriptName&&r.postscriptName===i.postscriptName)||e.find(r=>(i.name&&(r.name===i.name||r.family===i.name)||i.family&&r.family===i.family)&&(!i.style||r.style===i.style));if(!n)throw Error(`Font unavailable: ${i.name||i.resourceKey}. Load that font and retry.`);return n}function gt(i){if(!i())throw new DOMException("Script stopped","AbortError")}var gu=i=>Object.fromEntries(i.actions.map(e=>[e.type,e.value]));function Mr(){let i=Ci;i&&(Ci=null,i.preparingMorph&&(Bt().isActive()||Bt().stats().preparing)&&Bt().clear(),i.controller.abort(),br())}function T_(i,e){return new Promise(t=>{let n=()=>{clearTimeout(r),e.removeEventListener("abort",n),t()},r=setTimeout(n,i);e.addEventListener("abort",n,{once:!0})})}async function A_({duration:i,hold:e},t){let n=ui(),r=n.state,{message:s,mode:a,extrusionEnabled:o,tracking:l,lineHeight:c}=r,u={owner:t,controller:new AbortController,preparingMorph:!1},{signal:d}=u.controller;Ci=u;let h=()=>Ci===u&&r.previewActive&&r.mode===a&&r.message===s&&r.extrusionEnabled===o;br();try{let f=(await Bt().ensureBuiltins()).filter(M=>(M.geoGlyphRef||M).fontCycle!==!1),_=f.findIndex(M=>M.id===r.selectedFontId);if(_<0)throw Error("Use a bundled English outline font for the last message.");for(;h();){let M=f[_];if(r.selectedFontId!==M.id)return;let g=(_+1)%f.length,p=f[g],b=T_(e*1e3,d),[P,S]=await Promise.allSettled([Sr().morph(M,p,s,{targetMessage:s,tracking:l,lineHeight:c,signal:d}),n.prepareConferenceFont(p.id,{message:s,extrusionEnabled:o})]);if(gt(h),S.status==="rejected"){if(!/^(Unsupported outline font|Complex or self-crossing outline requires styled raster rendering)$/.test(S.reason.message))throw S.reason;if(f.splice(g,1),f.length<2)throw Error("No other bundled font can render this message in 3D.");_=f.indexOf(M);continue}if(P.status==="rejected")throw P.reason;u.preparingMorph=!0;let w=await Bt().prepare(p.id,{targetMessage:s,prepared:P.value});if(gt(h),!w)throw Error(Bt().stats().error||"Morph could not be prepared");await Promise.all([b,n.fitScriptMorph(h)]),gt(h),await Bt().playToEnd({duration:i,signal:d}),u.preparingMorph=!1,_=g}}catch(f){h()&&f.name!=="AbortError"&&n.setConnectionStatus(`Final font cycle: ${f.message}`,"warn")}finally{Ci===u&&Mr()}}async function C_(i,{signal:e,isCurrent:t}){await Bt().ensureBuiltins(),gt(t);let n=ui().state,r=new Set,s=new Map,a=new Set,o=new Map,l=n.fontRecords.get(n.selectedFontId),c=n.message,u=n.tracking,d=n.lineHeight,h=0,f=n.extrusionEnabled;async function _(b){if(!b)throw Error("No font is selected");r.has(b.id)||(await Sr().ensureFace(b,{retry:!0,timeoutMs:3e4,isCurrent:t}),gt(t),r.add(b.id))}async function M(b){if(await _(b),!s.has(b.id)){let P=await Sr().prepare(b).catch(S=>(gt(t),Sr().prepare(b,{retry:!0})));gt(t),s.set(b.id,new Set(P.codes))}return s.get(b.id)}async function g(b,P){let S=await M(b),w=null;window.GeoGlyphMessageText.hasEmoji(P)&&(w=await M(wn(pu)),await _(wn({resourceKey:"conference:Emoji Flags"})));let E=[...new Set(P)].find(L=>!/\s/u.test(L)&&!S.has(L.codePointAt(0))&&!w?.has(L.codePointAt(0)));if(E)throw Error(`${b.name} cannot draw \u201C${E}\u201D`)}async function p(b,P){if(!f)return;let S=JSON.stringify([b.id,P]);a.has(S)||(await ui().prepareConferenceFont(b.id,{message:P,extrusionEnabled:!0}),gt(t),a.add(S))}for(let[b,P]of i.rows.entries()){gt(t);let S=gu(P);try{let w=S.morph;if(S.mode&&(f=S.mode==="3d"),(S.font||S.mode||w||P.message)&&(l=w?wn(w.from):S.font?wn(S.font):l,c=P.message||c,await g(l,c),await p(l,c)),w){let E=wn(w.to),L=w.targetMessage??c;await g(E,L),await p(E,L);let m=await Sr().morph(l,E,c,{targetMessage:w.targetMessage,tracking:u,lineHeight:d,signal:e});if(gt(t),h+=m.bytes,h>96*1024*1024)throw Error("Prepared morphs exceed the rehearsal memory limit");o.set(P.id,{result:m,tracking:u,lineHeight:d}),w.targetMessage!==void 0&&(l=E,c=L)}(S.camera==="opening"||S.camera==="opening-and-fly")&&(l=wn(pu),c="\u{1F634}",u=0,d=1.15,f=!1,await g(l,c))}catch(w){gt(t);let E=P.message||S.morph?.targetMessage||S.title||P.id;throw Error(`Rehearsal row ${b+1} (\u201C${E}\u201D): ${w.message}`)}}return o}function Hd(i,{caption:e=!1,font:t}={}){if(Cl(),!i)return;ci=document.createElement("div"),ci.id="geoglyphConferenceTitle",ci.className="geoglyph-conference-title",e&&ci.classList.add("geoglyph-rehearsal-caption"),ci.setAttribute("role","status"),ci.textContent=i;let n=t||[...ui().state.fontRecords.values()].find(r=>r.fontResourceKey==="conference:Gill Sans");n?.cssFamily&&(ci.style.fontFamily=`${JSON.stringify(n.cssFamily)}, system-ui, sans-serif`),document.getElementById("geoglyphMapWorkspace").append(ci)}async function Wd(i,e){await i.flyToConferenceOpening(e),gt(e),i.state.conferenceOverview=!1}async function R_(i,{isCurrent:e,signal:t,owner:n,prepared:r}){await Bt().ensureBuiltins(),gt(e);let s=ui(),a=s.state,o=gu(i);if(gt(e),!a.previewActive||!a.mapReady)throw Error("Open the map and wait until it is ready");if(!i.message&&i.actions.length===1&&o.animation==="none"){window.GeoGlyph3D.stopOrbit({freezePose:!0}),er=!1;return}let l=!!i.message||i.actions.some(I=>!["title","wait","camera"].includes(I.type)),c=o.font?wn(o.font):a.fontRecords.get(a.selectedFontId),u=o.morph?wn(o.morph.from):c,d=o.morph?wn(o.morph.to):null,h=o.mode?o.mode==="3d":a.extrusionEnabled,f=o.animation,_=!!(f&&f!=="none"),M=o.location,g=o.fit??!!M,p=M?.instant===!0,{maxZoom:b,cameraBearing:P}=M??{},S=o.title??M?.caption,w=!!(S&&l&&(M?.caption!==void 0||r!==void 0||o.font||o.morph));if(f&&f!=="none"&&!h)throw Error("Orbit, Turn and Face require 3D. Add a 3D action.");if(o.morph&&o.font&&u.id!==c.id)throw Error("Font and morph source must be the same font");let E=i.message||a.message;if(l&&!E.trim())throw Error("Enter a message before applying appearance actions");let L=window.GeoGlyphMessageText.hasEmoji(E);if(l&&L&&(h||o.morph))throw Error("Colour emoji require 2D and cannot be font morphed.");let m=o.morph?.targetMessage,y;if(o.morph){if(u.id===d.id&&(m??E)===E)throw Error("Choose a different target font or message");if(m!==void 0&&window.GeoGlyphMessageText.hasEmoji(m))throw Error("Colour emoji cannot be font morphed.");if(!Bt().stats().ready&&(!u.fontResourceKey?.startsWith("conference:")||!d.fontResourceKey?.startsWith("conference:")))throw Error("Morphing requires built-in outline fonts");let I=r?.get(i.id);I&&I.tracking===a.tracking&&I.lineHeight===a.lineHeight?y=I.result:y=await Sr().morph(u,d,E,{targetMessage:m,tracking:a.tracking,lineHeight:a.lineHeight,signal:t}),gt(e)}let R=!1;if(l){await window.GeoGlyphFontService.ensureFace(u).catch(()=>null),gt(e);let I=L?wn({resourceKey:"conference:Segoe UI Emoji",name:"Segoe UI Emoji"}):null;I&&(await Promise.all([I,wn({resourceKey:"conference:Emoji Flags"})].map(ne=>window.GeoGlyphFontService.ensureFace(ne))),gt(e));let F={fontId:u?.id,message:E,hasNewContent:!!i.message,nativeColor:window.GeoGlyphMessageText.nativeColour(u,E,!!o.colour?.fill),emojiFallbackFontId:I?.id||null,extrusionEnabled:h,mirrorX:o.mirror??a.mirrorX,fit:g&&!o.morph};o.colour&&Object.assign(F,o.colour),o.size&&Object.assign(F,{height:o.size.height,depth:o.size.depth,relativeSize:100}),o.depth!==void 0&&(F.depth=o.depth),o.tilt!==void 0&&(F.tilt=o.tilt),o.bearing!==void 0&&(F.bearing=o.bearing),M&&(F.anchor={lng:M.lng,lat:M.lat}),_&&(F.animation=f);let D={fontId:a.selectedFontId,message:a.message,nativeColor:a.nativeColor,emojiFallbackFontId:a.emojiFallbackFontId,extrusionEnabled:a.extrusionEnabled,mirrorX:a.mirrorX,height:a.baseHeightMeters,relativeSize:a.relativeSize,depth:a.extrusionDepthMeters,fill:a.fill,outline:a.outline,tilt:a.extrusionTilt,bearing:a.bearing,...M?{anchor:{...a.anchor},anchorPinned:a.anchorPinned}:{}};(o.morph||o.font||i.message&&E!==a.message)&&Bt()?.clear({restore:!1}),M?.caption!==void 0&&Cl();let A=n==="conference"?"arcgis":a.mode,U={isCurrent:e,mode:A,preserveOrbit:!!M&&!p,instantFit:p,maxZoom:b,cameraBearing:P},K=m!==void 0&&!i.message&&a.selectedFontId===u.id&&a.displayedFontId===u.id&&i.actions.every(ne=>["morph","title","fit"].includes(ne.type))?null:await s.applyScriptCue(F,U);gt(e),f==="none"&&(window.GeoGlyph3D.stopOrbit({freezePose:!0}),er=!1);try{let ne=K?.fitted??!1;if(o.morph){xs=Al=!0;let N=await Bt().prepare(d.id,{targetMessage:m,prepared:y});if(gt(e),!N)throw Error(Bt().stats().error||"Morph could not be prepared");g&&(ne=await s.fitScriptMorph(e,{orbit:_,maxZoom:b,cameraBearing:P}),gt(e))}if(_){if(!window.GeoGlyph3D.ensureOrbit(f,{framed:ne}))throw Error("Animation could not start");er=!0,await s.waitForCamera(e),gt(e)}o.morph&&(S!==void 0&&(w&&(await Sr().ensureFace(d,{isCurrent:e}),gt(e)),Hd(S,{caption:w,font:w?d:void 0}),R=!0),document.getElementById("mapMorphDuration").value=o.morph.duration,m!==void 0?(await Bt().playToEnd({duration:o.morph.duration,signal:t}),gt(e),xs=!1):Bt().play())}catch(ne){throw o.morph&&e()&&(Bt().clear({restore:!1}),await s.applyScriptCue(D,U)),ne}finally{Al=!1}}if(S===""&&!R&&Cl(),o.camera)if(typeof o.camera=="object")yt.state().skip||await s.playCameraFlight(o.camera,{isCurrent:e,signal:t}),gt(e),er=!1;else if(o.camera==="overview")s.showConferenceOverview();else if(o.camera==="opening"||o.camera==="opening-and-fly"){s.state.conferenceOverview=!0,window.GeoGlyph3D.stopOrbit();let I=wn(pu);await s.drawConferenceOpening(I.id,{resetAnchor:ms!==null,isCurrent:e})}else if(o.camera==="wait-for-opening-flight"){let I=du.get(t);du.delete(t),I&&await I}else await Wd(s,e);if(gt(e),S&&!R&&Hd(S,{caption:w,font:w?u:void 0}),o.camera==="opening-and-fly"){let I=Wd(s,e);du.set(t,I),I.catch(()=>{})}}var yt=kd({applyRow:R_,changed:i=>{ms||(gs=i.index),br()},stopped:qd});function fu(i){if(yt.state().running)throw Error("Stop playback before editing the script");return Ai=Ti(i),yt.clearError(),gs=Math.min(gs,Math.max(0,Ai.rows.length-1)),E_(),br(),mu(Ai)}async function El({start:i=gs,owner:e="manual",isCurrent:t=()=>!0,onRow:n=()=>{},onRowStart:r=()=>{},singleStep:s=!1,runRehearsal:a=!1}={}){if(yt.state().running){yt.resume();return}Mr(),e==="manual"&&(ui().stopPolling({quiet:!0}),window.GeoGlyphConference?.clearSurveyQueue(),ui().state.conferenceOverview=!1),gt(t);let o=a?cu:Ai,l=a?{}:null;ms=l;let c=(u,d)=>{let h=gu(u).morph?.targetMessage;return n(h===void 0?u:{...u,message:h},d)};try{let u=await yt.play(o,i,{owner:e,isCurrent:t,onRowStart:r,singleStep:s,onRow:a?c:n,prepare:a?C_:void 0});return u&&o.fontCycle&&t()&&!yt.state().running&&A_(o.fontCycle,e),u}finally{l&&ms===l&&(ms=null,br())}}function Yd(){if(Vd)return window.GeoGlyphScripts;Vd=!0;try{let i=localStorage.getItem(Xd);i&&(Ai=Ti(JSON.parse(i)))}catch{Tl="Saved draft could not be restored. The bundled introduction is available."}return window.GeoGlyphScripts=Object.freeze({validate:Ti,getDraft:()=>mu(Ai),setDraft:fu,newRow:hu,fontIdentity:zd,resolveFont:wn,parse:i=>Ti(JSON.parse(i)),serialize:()=>JSON.stringify(Ti(Ai),null,2),reset:()=>fu(lu),newScript:()=>fu({version:1,title:"Untitled script",rows:[hu()]}),select:i=>{yt.state().running||(gs=Math.max(0,Math.min(Ai.rows.length-1,i)),br())},state:()=>({...yt.state(),selected:gs,storageError:Tl,rehearsal:ms!==null,fontCycling:!!Ci,hasMotion:er||xs||!!Ci}),play:El,pause:yt.pause,resume:yt.resume,stop:()=>{let i=yt.state().running;yt.stop(),!i&&(er||xs||Ci)&&(qd(),br())},next:()=>yt.state().running?(ui().cancelCameraFlight(),yt.next()):El({singleStep:!0}),playConference:i=>El({...i,start:0,owner:"conference"}),getRehearsal:()=>mu(cu),playRehearsal:i=>El({...i,start:0,owner:"conference",runRehearsal:!0}),pauseConference:()=>{yt.state().owner==="conference"&&yt.pause()},resumeConference:()=>{yt.state().owner==="conference"&&yt.resume()},stopFontCycle:Mr,stopConference:()=>{yt.state().owner==="conference"&&yt.stop(),Ci?.owner==="conference"&&Mr()}}),document.addEventListener("visibilitychange",yt.wake),document.addEventListener("geoglyph:manual-map-change",()=>{yt.state().running?yt.stop():Mr()}),window.addEventListener("pagehide",()=>{yt.stop(),Mr()}),window.GeoGlyphScripts}var $d={plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',expand:'<path d="m8 8 4-4 4 4M8 16l4 4 4-4M4 12h16"/>',collapse:'<path d="m8 4 4 4 4-4M8 20l4-4 4 4M4 12h16"/>',maximize:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16"/>',type:'<path d="M4 5V3h16v2M12 3v18M8 21h8"/>',palette:'<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a5 5 0 0 0 5-5c0-3-4-5-9-5Z"/><path d="M7 9h.01M10 6h.01M15 6h.01M6 13h.01"/>',layers:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',flip:'<path d="M12 3v18M3 7l6-3v16l-6-3V7Zm18 0-6-3v16l6-3V7Z"/>',blend:'<circle cx="8" cy="12" r="6"/><circle cx="16" cy="12" r="6"/>',heading:'<path d="M4 4v16M14 4v16M4 12h10M18 14l3-2v8"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3V7Z"/><circle cx="12" cy="13" r="4"/>',"map-pin":'<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',play:'<path d="m7 4 14 8-14 8V4Z"/>',pause:'<path d="M8 4v16M16 4v16"/>',stop:'<rect x="5" y="5" width="14" height="14"/>',next:'<path d="m5 5 10 7-10 7V5Zm14 0v14"/>',save:'<path d="M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"/>',folder:'<path d="M3 6h7l2 3h9v11H3V6Z"/>',file:'<path d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 13h8M8 17h8"/>',trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',copy:'<rect x="8" y="8" width="13" height="13"/><path d="M16 8V3H3v13h5"/>',refresh:'<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',key:'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3m-6 0 3-3"/>',login:'<path d="M14 3h7v18h-7M3 12h13m-5-5 5 5-5 5"/>',exchange:'<path d="M3 7h18m-5-5 5 5-5 5M21 17H3m5-5-5 5 5 5"/>',check:'<path d="m4 12 5 5L20 6"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',up:'<path d="m5 15 7-7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>'};function Ri(i){return fl[i]||`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${$d[i]||$d.file}</svg>`}function Zd(){let i=document.getElementById("geoglyphMapEditor");if(!i)return;let e={mapFitBtn:"maximize",mapCollapsedFitBtn:"maximize",mapCollapsedJpgBtn:"camera",mapCollapsedPngBtn:"camera",mapEditorCollapseBtn:"panel",mapLocalBeginBtn:"play",mapLocalResetBtn:"refresh",mapArcgisUseTokenBtn:"key",mapArcgisClearTokenBtn:"close",mapArcgisStartBtn:"play",mapArcgisPollBtn:"refresh",mapArcgisStopBtn:"stop",mapArcgisReset123Btn:"trash",mapArcgisIntervalMinus:"minus",mapArcgisIntervalPlus:"plus",mapFontRescanBtn:"refresh",mapScanSystemBtn:"type",mapCopyEsriPathBtn:"copy",mapLoadEsriBtn:"folder",mapExportObjBtn:"box",mapExportGeoJsonBtn:"file",mapSaveJpgBtn:"camera",mapSavePngBtn:"camera",mapEsriAerialBtn:"layers",mapEsriWorldBtn:"layers",mapMetroMapBtn:"layers",map3DView:"maximize",map3DOrbit:"orbit",mapMorphPrepare:"blend",mapMorphPlay:"play",mapMorphClear:"close",mapMetroMapCloseBtn:"close",mapMetroMapSaveBtn:"save",mapMetroMapRemoveBtn:"trash"},t=!1;function n(){t=!1;for(let a of document.querySelectorAll("#geoglyphMapEditor button, #mapMetroMapDialog button")){let o=a.querySelector(".module-collapse-mark");if(o){o.querySelector("svg")||(o.innerHTML=Ri(a.getAttribute("aria-expanded")==="false"?"plus":"minus"));continue}if(a.querySelector("svg")||a.classList.contains("studio-swatch"))continue;let l=a.dataset.collapseAll?a.dataset.collapseAll:a.dataset.mapMode?{message:"type",arcgis:"box",admin:"layers"}[a.dataset.mapMode]:a.dataset.mapColourTarget?"palette":a.id==="mapMorphPlay"&&a.textContent==="Pause"?"pause":e[a.id];if(!l)continue;if(a.matches(".map-editor-collapse,.map-header-fit,.map-collapsed-fit,[data-collapse-all],#mapArcgisIntervalMinus,#mapArcgisIntervalPlus"))a.getAttribute("aria-label")||a.setAttribute("aria-label",a.textContent.trim()),a.replaceChildren();else{let u=document.createElement("span");for(u.className="icon-caption";a.firstChild;)u.append(a.firstChild);a.append(u)}a.insertAdjacentHTML("afterbegin",Ri(l)),a.classList.add("map-icon-button")}}let r=new MutationObserver(()=>{t||(t=!0,queueMicrotask(n))});r.observe(i,{childList:!0,subtree:!0,characterData:!0});let s=document.getElementById("mapMetroMapDialog");s&&r.observe(s,{childList:!0,subtree:!0,characterData:!0}),n()}var Wn=i=>String(i??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),wt=(i,e,t="")=>`<button type="button" class="map-action" ${t}>${Ri(i)}<span>${Wn(e)}</span></button>`,Et=(i,e)=>`<label class="map-field"><span>${Wn(i)}</span>${e}</label>`,Pi=(i,e,t,n)=>`<input id="${i}" type="number" value="${e}" min="${t}" max="${n}" step="any">`,tr=(i,e,t)=>`<select id="${i}">${e.map(([n,r])=>`<option value="${Wn(n)}" ${String(n)===String(t)?"selected":""}>${Wn(r)}</option>`).join("")}</select>`;function Jd(){if(document.getElementById("mapScriptSection"))return;let i=Yd(),e=document.createElement("section");e.id="mapScriptSection",e.className="map-script-panel",e.setAttribute("aria-label","Script editor"),e.innerHTML=`<label class="map-field"><span>Script name</span><input id="mapScriptTitle" class="script-edit" type="text" maxlength="300"></label>
    <div class="script-file-actions">${wt("file","New",'id="mapScriptNew"')}${wt("folder","Load JSON",'id="mapScriptLoad"')}${wt("save","Save JSON",'id="mapScriptSave"')}${wt("refresh","Reset intro",'id="mapScriptReset" title="Restore bundled introduction"')}</div>
    <input id="mapScriptFile" type="file" accept=".json,application/json" hidden>
    <div class="script-play-actions">${wt("play","Play",'id="mapScriptPlay"')}${wt("next","Next",'id="mapScriptNext"')}${wt("stop","Stop",'id="mapScriptStop"')}</div>
    <p id="mapScriptStatus" class="map-3d-status" role="status" aria-live="polite"></p>
    <div class="script-rows" id="mapScriptRows" aria-label="Script rows"></div>
    ${wt("plus","Add row",'id="mapScriptAddRow"')}`,document.getElementById("mapMorphPanel").after(e),e.addEventListener("wheel",m=>{if(m.ctrlKey||m.shiftKey||Math.abs(m.deltaX)>Math.abs(m.deltaY))return;let y=e.closest(".map-control-sidebar");if(!y)return;let R=y.scrollTop,I=m.deltaMode===1?16:m.deltaMode===2?y.clientHeight:1;y.scrollTop+=m.deltaY*I,y.scrollTop!==R&&m.preventDefault()},{passive:!1});let t=document.createElement("dialog");t.id="mapScriptDialog",t.className="script-dialog",t.setAttribute("aria-labelledby","mapScriptDialogTitle"),document.body.append(t);let n=m=>document.getElementById(m),r="",s=null,a=null,o=null,l=0,c="",u=null;function d(m){c=String(m),n("mapScriptStatus").textContent=c,n("mapScriptStatus").dataset.state="error"}function h(m){try{c="";let y=i.getDraft();m(y),i.setDraft(y)}catch(y){d(y.message)}}function f(m){m.style.height="auto",m.style.height=Math.max(34,m.scrollHeight)+"px"}function _(m,y){let R="";for(let I=0;I<4;I++){let F=m.actions[I],D=F?F.type==="mode"?F.value.toUpperCase():F.type==="font"?"Font: "+F.value.name:yr[F.type][0]:"";R+=F?`<button type="button" class="map-action script-action script-edit" data-edit-action="${I}" aria-label="${Wn(D)}" title="${Wn(D)}">${Ri(F.type==="mode"&&F.value==="2d"?"layers":yr[F.type][1])}</button>`:I===m.actions.length?`<button type="button" class="map-action script-action script-edit" data-add-action aria-label="Add action to row ${y+1}" title="Add action">${Ri("plus")}</button>`:'<span class="script-empty-slot" aria-hidden="true"></span>'}return`<div class="script-row-primary">${R}<textarea class="script-message script-edit" rows="1" placeholder="Message\u2026" aria-label="Row ${y+1} message">${Wn(m.message)}</textarea></div>
      <div class="script-row-tools"><button type="button" class="map-action script-edit" data-select-row aria-label="Select row ${y+1}">${y+1}</button>
      <label class="script-duration">Hold <input class="script-edit" type="number" min="0" max="3600" step=".25" value="${m.duration}" aria-label="Row ${y+1} duration"> s</label>
      ${[["above","plus","Insert row above"],["below","plus","Insert row below"],["up","up","Move row up"],["down","down","Move row down"],["copy","copy","Duplicate row"],["delete","trash","Delete row"]].map(([I,F,D])=>`<button class="map-action script-edit" type="button" data-row-command="${I}" aria-label="${D}" title="${D}">${Ri(F)}</button>`).join("")}</div>`}function M(){let m=i.state(),y=i.getDraft(),R=JSON.stringify(y),I=n("mapScriptRows");if(R!==r){let F=new Map([...I.children].map(D=>[D.dataset.rowId,D]));y.rows.forEach((D,A)=>{let U=F.get(D.id);U||(U=document.createElement("div"),U.className="script-row",U.dataset.rowId=D.id),F.delete(D.id);let Z=JSON.stringify([D,A]);U.dataset.signature!==Z&&!U.contains(document.activeElement)&&(U.innerHTML=_(D,A)),U.dataset.signature=Z,I.children[A]!==U&&I.insertBefore(U,I.children[A]||null)}),F.forEach(D=>D.remove()),r=R,document.activeElement!==n("mapScriptTitle")&&(n("mapScriptTitle").value=y.title),I.querySelectorAll("textarea").forEach(f)}for(let[F,D]of[...I.children].entries())D.classList.toggle("is-selected",F===m.selected),D.classList.toggle("is-playing",m.running&&!m.rehearsal&&F===m.index),D.querySelector("[data-select-row]")?.setAttribute("aria-pressed",String(F===m.selected));e.querySelectorAll(".script-edit,#mapScriptNew,#mapScriptLoad,#mapScriptReset,#mapScriptAddRow").forEach(F=>F.disabled=m.running),n("mapScriptPlay").innerHTML=Ri(m.running&&!m.paused?"pause":"play")+`<span>${m.running?m.paused?"Resume":"Pause":"Play"}</span>`,n("mapScriptPlay").disabled=!y.rows.length,n("mapScriptNext").disabled=!y.rows.length,n("mapScriptStop").disabled=!m.running&&!m.hasMotion,c||(n("mapScriptStatus").dataset.state=m.error?"error":"",n("mapScriptStatus").textContent=m.error||m.storageError||(m.running?m.phase==="preflight"?"Preparing rehearsal fonts and morphs\u2026":`${m.rehearsal?"Rehearsal row":"Row"} ${m.index+1} \xB7 ${m.paused?"Paused":m.phase==="preparing"?"Preparing\u2026":"Playing"}`:m.fontCycling?"Cycling fonts":m.phase==="complete"?"Script complete":`${y.rows.length} rows \xB7 up to 4 actions per row`))}function g(m=!0){let y=u;u=null,y?.dispose(m)}function p(){(a?.isConnected?a:[...e.querySelectorAll("[data-row-id]")].find(y=>y.dataset.rowId===o)?.querySelector("button"))?.focus({preventScroll:!0})}function b(){g(),++l,s=null,t.open?t.close():p()}t.addEventListener("close",()=>{t.open||u?.suspended||(g(),++l,s=null,p())});function P(m,y,R){t.innerHTML=`<form method="dialog"><div class="script-dialog-head"><h2 id="mapScriptDialogTitle">${Wn(m)}</h2>${wt("close","Close",'data-dialog-close aria-label="Close picker"')}</div>
      <div class="script-dialog-body">${y}</div><p class="script-dialog-error" role="alert"></p><div class="script-dialog-footer">${R||""}</div></form>`,t.querySelector("[data-dialog-close]").addEventListener("click",b),t.querySelector("form").addEventListener("submit",I=>I.preventDefault()),t.open||t.showModal()}function S(m,y){a=y,o=m,s={rowId:m},++l,P("Add action",`<div class="script-action-menu">${Object.entries(yr).map(([R,[I,F]])=>wt(F,I,`data-choose-action="${R}"`)).join("")}</div>`,wt("close","Cancel","data-cancel")),t.querySelector("[data-cancel]").onclick=b,t.querySelectorAll("[data-choose-action]").forEach(R=>R.onclick=()=>E(m,R.dataset.chooseAction))}function w(m,y){let R=window.GeoGlyphMapEngine,I=y?.value,F=typeof I=="object"?JSON.parse(JSON.stringify(I)):{type:"flight",start:null,end:null,duration:5},D=null;try{D=R.captureCameraView()}catch{}let A={suspended:!1,pickCleanup:null,preview:null,toolbar:null,markers:[],sidebarVisible:null,selected:null,disposed:!1};u=A,P("Camera action",Et("Camera action",tr("scriptValue",[["opening","Prepare sleeping Geo"],["opening-and-fly","Prepare sleeping Geo and start zoom"],["fly-opening","Fly to sleeping Geo (20 seconds)"],["wait-for-opening-flight","Wait for opening zoom"],["overview","Australia overview"],["flight","Custom camera flight"]],typeof I=="object"?"flight":I||"fly-opening"))+`<div id="scriptCameraFlight" class="script-camera-fields">
        <div class="script-camera-point"><strong>Start</strong><output id="scriptCameraStartSummary" aria-live="polite"></output>${wt("camera","Pick Start",'id="scriptCameraPickStart"')}</div>
        <div class="script-camera-point"><strong>End</strong><output id="scriptCameraEndSummary" aria-live="polite"></output>${wt("camera","Pick End",'id="scriptCameraPickEnd"')}</div>
        ${Et("Flight duration (s)",Pi("scriptCameraDuration",F.duration,.25,300))}
        ${wt("play","Preview",'id="scriptCameraPreview"')}
      </div>`,L(y));let U=O=>{let j=O?.message||String(O);return t.querySelector(".script-dialog-error").textContent=j,j};function Z(){return n("scriptValue").value==="flight"?{type:"flight",start:F.start,end:F.end,duration:Number(n("scriptCameraDuration").value)}:n("scriptValue").value}function K(){try{return ps({type:"camera",value:{type:"flight",start:F.start,end:F.end,duration:Number(n("scriptCameraDuration").value)}}),!0}catch{return!1}}function ne(O){return O?`${O.center[0].toFixed(5)}, ${O.center[1].toFixed(5)} \xB7 Zoom ${O.zoom.toFixed(2)} \xB7 ${O.pitch<1?"2D":`3D ${O.pitch.toFixed(1)}\xB0`} \xB7 Bearing ${O.bearing.toFixed(1)}\xB0`:"Not selected"}function N(){for(let O of A.markers)O.remove();A.markers=[]}function W(){if(N(),!(!A.suspended||!R.state.map)){for(let O of["start","end"])if(F[O]){let j=document.createElement("div");j.className="script-camera-marker is-"+O,j.setAttribute("role","img"),j.setAttribute("aria-label",`${O==="start"?"Start":"End"} camera location`),j.innerHTML=Ri("camera")+`<span>${O==="start"?"Start":"End"}</span>`,A.markers.push(new window.maplibregl.Marker({element:j,anchor:"bottom"}).setLngLat(F[O].center).addTo(R.state.map))}}}function C(){let O=n("scriptValue").value==="flight";n("scriptCameraFlight").hidden=!O,n("scriptCameraStartSummary").textContent=ne(F.start),n("scriptCameraEndSummary").textContent=ne(F.end);let j=K();if(n("scriptCameraPreview").disabled=!j,t.querySelector("[data-apply]").disabled=O&&!j,A.toolbar){let se=A.toolbar.querySelector("[data-camera-status]");se.textContent=A.preview?"Previewing camera flight\u2026":A.selected?`Click the map to set ${A.selected}. Pan, zoom or tilt before clicking.`:"Point captured. Pick another point or return to Camera Action.";for(let oe of["start","end"])A.toolbar.querySelector(`[data-camera-pick="${oe}"]`).setAttribute("aria-pressed",String(A.selected===oe));A.toolbar.querySelector("[data-camera-stop-preview]").hidden=!A.preview,A.toolbar.querySelectorAll("[data-camera-pick]").forEach(oe=>oe.disabled=!!A.preview)}}function Y(){A.pickCleanup?.(),A.pickCleanup=null,A.selected=null}function te(){A.sidebarVisible!==null&&(window.GeoGlyphMapSidebar?.setVisible(A.sidebarVisible),A.sidebarVisible=null),e.inert=!1}function xe(){u!==A||A.disposed||(Y(),A.preview?.abort(),A.preview=null,A.toolbar?.remove(),A.toolbar=null,N(),R.setCameraAuthoring(!1),A.suspended=!1,te(),t.open||t.showModal(),C(),n("scriptCameraPick"+(A.returnFocus==="end"?"End":"Start")).focus({preventScroll:!0}))}function ce(){if(!(u!==A||A.disposed)){if(!R.state.previewActive||!R.state.mapReady)throw Error("Open the map and wait until it is ready");if(D||(D=R.captureCameraView()),!A.suspended){A.suspended=!0,R.setCameraAuthoring(!0),e.inert=!0;let O=window.GeoGlyphMapSidebar;O&&(A.sidebarVisible=O.state().visible,O.setVisible(!1)),t.open&&t.close();let j=document.createElement("div");j.id="scriptCameraToolbar",j.className="script-camera-toolbar",j.setAttribute("role","region"),j.setAttribute("aria-label","Camera flight map editor"),j.innerHTML=`<p data-camera-status role="status" aria-live="polite"></p><div class="script-camera-toolbar-actions">
          ${wt("camera","Pick Start",'data-camera-pick="start"')}${wt("camera","Pick End",'data-camera-pick="end"')}
          ${wt("panel","Return to Camera Action","data-camera-return")}${wt("close","Cancel","data-camera-cancel")}
          ${wt("stop","Stop Preview","data-camera-stop-preview hidden")}
        </div>`,n("geoglyphMapWorkspace").append(j),A.toolbar=j,j.querySelectorAll("[data-camera-pick]").forEach(se=>se.onclick=()=>le(se.dataset.cameraPick)),j.querySelector("[data-camera-return]").onclick=xe,j.querySelector("[data-camera-cancel]").onclick=b,j.querySelector("[data-camera-stop-preview]").onclick=xe}W(),C()}}function le(O){try{A.preview?.abort(),A.preview=null,Y(),A.returnFocus=O,ce(),A.selected=O,A.pickCleanup=R.pickCameraView({onPick:j=>{u!==A||A.disposed||(F[O]=JSON.parse(JSON.stringify(j)),Y(),W(),C(),A.toolbar?.querySelector("[data-camera-return]")?.focus({preventScroll:!0}))},onCancel:b}),C(),A.toolbar.querySelector(`[data-camera-pick="${O}"]`).focus({preventScroll:!0})}catch(j){xe(),U(j)}}A.dispose=O=>{A.disposed=!0,Y(),A.preview?.abort(),A.preview=null,A.toolbar?.remove(),A.toolbar=null,N(),R.setCameraAuthoring(!1),te(),O&&D&&R.restoreCameraView(D)},n("scriptValue").onchange=C,n("scriptCameraDuration").oninput=C,n("scriptCameraPickStart").onclick=()=>le("start"),n("scriptCameraPickEnd").onclick=()=>le("end"),n("scriptCameraPreview").onclick=async()=>{let O=new AbortController;try{let j=ps({type:"camera",value:Z()});if(Y(),A.preview=O,ce(),C(),A.toolbar.querySelector("[data-camera-stop-preview]").focus({preventScroll:!0}),await new Promise(se=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(se)))),u!==A||O.signal.aborted)return;await R.playCameraFlight(j.value,{signal:O.signal,isCurrent:()=>u===A&&!A.disposed&&!O.signal.aborted})}catch(j){j.name!=="AbortError"&&u===A&&U(j)}finally{u===A&&A.preview===O&&(A.preview=null,xe())}},t.querySelector("[data-cancel]").onclick=b;let H=t.querySelector("[data-remove]");H&&(H.onclick=()=>{try{let O=i.getDraft(),j=O.rows.find(se=>se.id===m);if(!j)throw Error("Script row no longer exists");j.actions=j.actions.filter(se=>se.type!=="camera"),i.setDraft(O),b()}catch(O){U(O)}}),t.querySelector("[data-apply]").onclick=()=>{try{let O=ps({type:"camera",value:Z()}),j=i.getDraft(),se=j.rows.find(Ae=>Ae.id===m);if(!se)throw Error("Script row no longer exists");let oe=se.actions.findIndex(Ae=>Ae.type==="camera");oe<0?se.actions.push(O):se.actions[oe]=O,i.setDraft(j),g(!1),b()}catch(O){U(O)}},C(),n("scriptValue").focus()}document.addEventListener("keydown",m=>{m.key==="Escape"&&u?.suspended&&(m.preventDefault(),b())},{capture:!0}),document.addEventListener("geoglyph:map-exit",()=>{u&&b()}),new MutationObserver(()=>{u&&!window.GeoGlyphMapEngine.state.previewActive&&b()}).observe(document.body,{attributes:!0,attributeFilter:["class"]});async function E(m,y){let R=++l,I=i.getDraft().rows.find(N=>N.id===m),F=I.actions.find(N=>N.type===y),D=F?.value,A=window.GeoGlyphMapEngine.state;s={rowId:m,type:y};let U="",Z,K;if(y==="camera"){w(m,F);return}if(y==="font"||y==="morph"){P("Loading fonts",'<p role="status">Preparing available fonts\u2026</p>',wt("close","Cancel","data-cancel")),t.querySelector("[data-cancel]").onclick=b;try{await window.GeoGlyphFontMorph.ensureBuiltins()}catch(N){R===l&&(t.querySelector(".script-dialog-body").textContent=N.message);return}if(R!==l||!t.open)return}if(y==="font"){let C=function(){let Y=n("scriptFontSearch").value.toLowerCase(),te=[...A.fontRecords.values()].filter(xe=>`${xe.name} ${xe.family}`.toLowerCase().includes(Y));W.replaceChildren();for(let xe of te.slice(0,100)){let ce=document.createElement("button");ce.type="button",ce.className="script-font-choice",ce.setAttribute("aria-pressed",String(N?.id===xe.id));let le=document.createElement("span");le.textContent=xe.name,le.style.fontFamily=JSON.stringify(xe.cssFamily||xe.family||"sans-serif");let H=document.createElement("small"),O=window.GeoGlyphMapEngine.fontCompatibility(xe.id);H.textContent=xe.hasColor||/emoji/i.test(xe.name)?"2D":O==="compatible"?"Both":"2D \xB7 3D not checked",ce.append(le,H),ce.onclick=()=>{N=xe,W.querySelectorAll("button").forEach(j=>j.setAttribute("aria-pressed",String(j===ce)))},W.append(ce)}if(te.length>100){let xe=document.createElement("p");xe.textContent=`Showing 100 of ${te.length} fonts. Refine the search.`,W.append(xe)}},N;try{D&&(N=i.resolveFont(D))}catch{}U=Et("Search fonts",'<input id="scriptFontSearch" type="search" placeholder="Font name\u2026">')+'<div class="script-font-list" role="group" aria-label="Available fonts"></div>',Z=()=>{if(!N)throw Error("Choose a font");return i.fontIdentity(N)},P("Font",U,L(F));let W=t.querySelector(".script-font-list");n("scriptFontSearch").oninput=C,C()}else{if(y==="mode")U=Et("Rendering",tr("scriptValue",[["2d","2D"],["3d","3D"]],D||"2d")),Z=()=>n("scriptValue").value;else if(y==="animation")U=Et("Animation",tr("scriptValue",[["none","Stop animation"],["fixed","Orbit"],["yaw","Turn toward camera"],["billboard","Face camera"]],D||"fixed")),Z=()=>n("scriptValue").value;else if(y==="colour")U=Et("Destination",tr("scriptColourTarget",[["fill","Fill"],["outline","Outline"]],D?.fill?"fill":D?.outline?"outline":"fill"))+Et("Colour",'<input id="scriptColourValue" type="color">')+'<div id="scriptColourPicker"></div>',Z=()=>({...D,[n("scriptColourTarget").value]:n("scriptColourValue").value});else if(y==="morph"){let N=[...A.fontRecords.values()].filter(te=>te.fontResourceKey?.startsWith("conference:")&&!te.hasColor&&!/emoji/i.test(te.name)),W=N.map(te=>[te.id,te.name]),C,Y;try{C=D&&i.resolveFont(D.from).id,Y=D&&i.resolveFont(D.to).id}catch{}U=Et("From font",tr("scriptMorphFrom",W,C||N[0]?.id))+Et("To font",tr("scriptMorphTo",W,Y||N[1]?.id))+Et("Morph duration (s)",Pi("scriptValue",D?.duration??2,.25,30))+Et("Target message (optional)",`<textarea id="scriptMorphMessage" rows="3" maxlength="2000" placeholder="Leave blank to keep the same text">${Wn(D?.targetMessage||"")}</textarea>`),Z=()=>{let te=n("scriptMorphMessage").value,xe=i.fontIdentity(A.fontRecords.get(n("scriptMorphFrom").value)),ce=i.fontIdentity(A.fontRecords.get(n("scriptMorphTo").value));return{from:xe,to:ce,duration:Number(n("scriptValue").value),...te.trim()?{targetMessage:te}:{}}}}else if(y==="size")U=Et("Height (m)",Pi("scriptValue",D?.height??A.baseHeightMeters,1,3e5))+Et("Depth (m)",Pi("scriptDepth",D?.depth??A.extrusionDepthMeters??30,.1,1e5)),Z=()=>({height:Number(n("scriptValue").value),depth:Number(n("scriptDepth").value)});else if(y==="location")U=Et("Latitude",Pi("scriptLatitude",D?.lat??A.anchor.lat,-85.051129,85.051129))+Et("Longitude",Pi("scriptLongitude",D?.lng??A.anchor.lng,-180,180))+Et("Caption at the top",`<input id="scriptLocationCaption" maxlength="2000" value="${Wn(D?.caption)}">`)+Et("Camera move",tr("scriptLocationMove",[["ease","Ease"],["jump","Jump"]],D?.instant?"jump":"ease"))+Et("Maximum fit zoom (optional)",Pi("scriptLocationMaxZoom",D?.maxZoom??"",0,24))+Et("Camera bearing (optional)",Pi("scriptLocationBearing",D?.cameraBearing??"",-360,360)),Z=()=>{let N=n("scriptLocationCaption").value,W=n("scriptLocationMaxZoom").value,C=n("scriptLocationBearing").value;return{lng:n("scriptLongitude").valueAsNumber,lat:n("scriptLatitude").valueAsNumber,...N||D?.caption!==void 0?{caption:N}:{},...n("scriptLocationMove").value==="jump"?{instant:!0}:{},...W!==""?{maxZoom:Number(W)}:{},...C!==""?{cameraBearing:Number(C)}:{}}};else if(y==="mirror"||y==="fit")U=Et(y==="mirror"?"Mirror horizontally":"Fit geometry",tr("scriptValue",[["true","On"],["false","Off"]],String(D??!0))),Z=()=>n("scriptValue").value==="true";else if(y==="title")U=Et("Overlay text (empty removes title)",`<textarea id="scriptValue" rows="3" maxlength="2000">${Wn(D||"")}</textarea>`),Z=()=>n("scriptValue").value;else{let N={depth:[.1,1e5,A.extrusionDepthMeters??30],tilt:[0,90,A.extrusionTilt],bearing:[-360,360,A.bearing],wait:[0,3600,5]}[y];U=Et(y==="wait"?"Additional wait (s)":yr[y][0],Pi("scriptValue",D??N[2],N[0],N[1])),Z=()=>Number(n("scriptValue").value)}if(P(yr[y][0],U,L(F)),y==="colour"){let N=()=>{n("scriptColourValue").value=D?.[n("scriptColourTarget").value]||A[n("scriptColourTarget").value],K?.sync()};N(),K=window.GeoGlyphColourPicker.mount(n("scriptColourPicker"),()=>({key:"script-"+n("scriptColourTarget").value,label:"Script colour",input:n("scriptColourValue")})),n("scriptColourValue").oninput=()=>K.sync(),n("scriptColourTarget").onchange=N}}t.querySelector("[data-cancel]").onclick=b;let ne=t.querySelector("[data-remove]");ne&&(ne.onclick=()=>{h(N=>{let W=N.rows.find(C=>C.id===m);W.actions=W.actions.filter(C=>C.type!==y)}),b()}),t.querySelector("[data-apply]").onclick=()=>{try{let N=ps({type:y,value:Z()}),W=i.getDraft(),C=W.rows.find(te=>te.id===m),Y=C.actions.findIndex(te=>te.type===y);Y<0?C.actions.push(N):C.actions[Y]=N,i.setDraft(W),b()}catch(N){t.querySelector(".script-dialog-error").textContent=N.message}},t.querySelector("input,select,textarea")?.focus()}function L(m){return(m?wt("trash","Remove action","data-remove"):"")+wt("close","Cancel","data-cancel")+wt("check","Apply","data-apply")}e.addEventListener("input",m=>{if(m.target.id==="mapScriptTitle"&&h(y=>{y.title=m.target.value}),m.target.matches(".script-message")){let y=m.target.closest("[data-row-id]").dataset.rowId;h(R=>{R.rows.find(I=>I.id===y).message=m.target.value}),f(m.target)}}),e.addEventListener("change",m=>{if(m.target.closest(".script-duration")){let y=m.target.closest("[data-row-id]").dataset.rowId;h(R=>{R.rows.find(I=>I.id===y).duration=Number(m.target.value)})}}),e.addEventListener("click",m=>{let y=m.target.closest("button"),R=y?.closest("[data-row-id]");if(!y||!R)return;let I=R.dataset.rowId,F=i.getDraft().rows.find(D=>D.id===I);y.hasAttribute("data-add-action")&&S(I,y),y.hasAttribute("data-edit-action")&&(a=y,o=I,E(I,F.actions[Number(y.dataset.editAction)].type)),y.hasAttribute("data-select-row")&&i.select(i.getDraft().rows.findIndex(D=>D.id===I)),y.dataset.rowCommand&&h(D=>{let A=D.rows.findIndex(Z=>Z.id===I),U=y.dataset.rowCommand;if(U==="delete")D.rows.splice(A,1);else if(U==="copy")D.rows.splice(A+1,0,{...D.rows[A],id:i.newRow().id});else if(U==="above"||U==="below")D.rows.splice(A+(U==="below"?1:0),0,i.newRow());else{let Z=A+(U==="up"?-1:1);Z>=0&&Z<D.rows.length&&([D.rows[A],D.rows[Z]]=[D.rows[Z],D.rows[A]])}})}),n("mapScriptNew").onclick=()=>{c="",i.newScript()},n("mapScriptReset").onclick=()=>{c="",i.reset()},n("mapScriptAddRow").onclick=()=>h(m=>m.rows.push(i.newRow())),n("mapScriptLoad").onclick=()=>n("mapScriptFile").click(),n("mapScriptFile").onchange=async m=>{let y=m.target.files[0];if(y)try{if(y.size>5*1024*1024)throw Error("Script file exceeds 5 MiB");let R=i.parse(await y.text());c="",i.setDraft(R)}catch(R){d(R.message)}finally{m.target.value=""}},n("mapScriptSave").onclick=()=>{let m=new Blob([i.serialize()],{type:"application/json"}),y=URL.createObjectURL(m),R=document.createElement("a");R.href=y,R.download=(i.getDraft().title.replace(/[^a-z\d_-]/gi,"-")||"geoglyph-script")+".json",R.click(),setTimeout(()=>URL.revokeObjectURL(y),1e3)},n("mapScriptPlay").onclick=()=>{c="";let m=i.state();m.running?m.paused?i.resume():i.pause():i.play().catch(y=>d(y.message))},n("mapScriptNext").onclick=()=>{c="",Promise.resolve(i.next()).catch(m=>d(m.message))},n("mapScriptStop").onclick=()=>i.stop(),document.addEventListener("geoglyph:script-changed",M),M()}var xu="geoglyph-extruded-font",we=i=>document.getElementById(i),En=()=>window.GeoGlyphMapEngine,bt=()=>En()?.state,Tn=()=>window.GeoGlyphFontMorph?.isActive()?window.GeoGlyphFontMorph:null,gn=null,qt=null,_s="",_u=0,wr="",cn=null,hi=Md((i,e)=>window.GeoGlyphFontService.mesh(i,e)),vu=0,Qd=0,Rl=!1;function ef(){let i=bt(),e=window.GeoGlyphFontMorph;return Rl?"Preparing OBJ download\u2026":!i?.previewActive||!i.extrusionEnabled?"Enable 3D to export an OBJ object.":i.rebuilding||i.pendingBuild||i.randomSearching||e?.stats().preparing?"Wait for geometry preparation before exporting.":e?.isActive()&&!e.canExport()?"Move the morph slider to an endpoint before exporting.":ln()?"":"Choose an outline font with valid 3D geometry to export."}function Er(){let i=we("mapExportObjBtn");if(!i)return;let e=ef();i.disabled=!!e,i.title=e||"Export 3D object as OBJ",i.setAttribute("aria-busy",String(Rl));let t=we("mapObjStatus");t&&t.dataset.state!=="error"&&(t.textContent=e||"OBJ \xB7 metres \xB7 geometry only")}async function tf(){if(ef())return Er(),!1;let e=bt(),t=Tn(),n=qt,r=e.buildToken,s={...t?.renderedAngles()||it.getAngles()},a=Pl(s).object.clone(),o=new ke().makeRotationZ(-s.bearing*Math.PI/180).multiply(a),l=e.fontRecords.get(e.displayedFontId)?.name||"GeoGlyph",c=()=>e.previewActive&&e.extrusionEnabled&&e.buildToken===r&&qt===n&&!Tn(),u=we("mapObjStatus");u&&(u.dataset.state=""),Rl=!0,Er();try{let d=n;if(t){let M=await t.prepareOBJEndpoint();d=M.mesh,l=M.name;let g=M.model.bounds,p=M.referenceBounds,b=g.height/p.height;o.multiply(new ke().makeTranslation((g.cx-p.cx)/p.height,(p.cy-g.cy)/p.height,0)).multiply(new ke().makeScale(b,b,1)),c=()=>e.previewActive&&e.extrusionEnabled&&M.isCurrent()}let h=await Od(d,o,{name:l,isCurrent:c}),f=URL.createObjectURL(h),_=document.createElement("a");return _.href=f,_.download=`geoglyph-${l.replace(/[^a-z0-9_-]/gi,"-")}-${Date.now()}.obj`,document.body.append(_),_.click(),_.remove(),setTimeout(()=>URL.revokeObjectURL(f),1e3),u&&(u.textContent=`OBJ saved \xB7 ${(d.position.length/9).toLocaleString()} triangles \xB7 metres`),!0}catch(d){return u&&(u.textContent="OBJ export failed: "+d.message,u.dataset.state="error"),!1}finally{Rl=!1,Er()}}var Xn=new ke,it=Sd(()=>{let i=bt()||{};return{map:i.map,anchor:i.anchor,bearing:i.bearing,tilt:i.extrusionTilt,orientationMode:i.orientationMode||"fixed",period:i.orbitPeriodSeconds||30,bounds:Tn()?.getBounds()||qt?.bounds,visible:ln()&&i.previewActive,restoredElevatedView:i.restoredCamera?.elevation>0,pose:Pl,renderedAngles:Tn()?.renderedAngles()||(gn?.ready&&gn.hasRenderedPose?gn.renderedAngles:null),freezePose:P_,cancelPending:()=>{cn=null,Mt()}}},()=>Mt());function P_(i){let e=bt();!e||!Number.isFinite(i.bearing)||!Number.isFinite(i.tilt)||(Object.assign(e,{bearing:i.bearing%360,extrusionTilt:i.tilt,orientationMode:"fixed"}),queueMicrotask(()=>En()?.refreshControls?.()))}function vs(i,e=!1){let t=we("map3DStatus");t&&(t.textContent=i);let n=we("mapQuickStatus");n&&(n.textContent=e?i:"",n.hidden=!e)}function yu(i=it.getAngles()){let e=bt();return{heightMeters:e.baseHeightMeters*e.relativeSize/100,depthMeters:e.extrusionDepthMeters??30,tilt:i.tilt,bearing:i.bearing,mirrorX:e.mirrorX===!0}}function Pl(i=it.getAngles(),e={geographic:new ke,object:new ke}){if(window.GeoGlyphFontMorph?.isActive())return nf(window.GeoGlyphFontMorph.getBounds(),!1,i,e);let t=bt(),n=yu(i),r=window.GeoGlyphGroundTransform.parameters(n,qt.bounds),s=window.maplibregl.MercatorCoordinate.fromLngLat(t.anchor,0),a=s.meterInMercatorCoordinateUnits(),o=e.geographic.makeTranslation(s.x,s.y,s.z).multiply(Xn.makeScale(a,-a,a)).multiply(Xn.makeRotationZ(-r.bearing)),l=e.object.makeTranslation(0,0,r.lift).multiply(Xn.makeRotationX(r.tilt)).multiply(Xn.makeScale(r.height,r.height,r.depth)),c=qt.bounds,u=[(c.minX+c.maxX)/2,(c.minY+c.maxY)/2,(c.minZ+c.maxZ)/2];n.mirrorX&&l.multiply(Xn.makeTranslation(c.minX+c.maxX,0,0)).multiply(Xn.makeScale(-1,1,1));let d=window.GeoGlyphGroundTransform.point(u,n,c),h=new window.maplibregl.MercatorCoordinate(s.x+d[0]*a,s.y-d[1]*a,d[2]*a);return{geographic:o,object:l,localCenter:d,center:h.toLngLat(),elevation:h.toAltitude(),units:a,radius:Math.hypot((c.maxX-c.minX)*r.height,(c.maxY-c.minY)*r.height,(c.maxZ-c.minZ)*r.depth)/2}}function nf(i,e=!1,t=it.getAngles(),n={geographic:new ke,object:new ke}){let r=bt(),s=e?{...yu(t),tilt:0}:yu(t),a=e?{minX:0,maxX:0,minY:-.5,minZ:0,maxZ:0}:{minX:0,maxX:0,minY:-.5,minZ:-.5,maxZ:.5},o=window.GeoGlyphGroundTransform.parameters(s,a);e&&(o.lift=0);let l=window.maplibregl.MercatorCoordinate.fromLngLat(r.anchor,0),c=l.meterInMercatorCoordinateUnits(),u=n.geographic.makeTranslation(l.x,l.y,l.z).multiply(Xn.makeScale(c,-c,c)).multiply(Xn.makeRotationZ(-o.bearing)),d=n.object.makeTranslation(0,0,o.lift).multiply(Xn.makeRotationX(o.tilt)).multiply(Xn.makeScale(o.height,o.height,e?1:o.depth)),h=i,f=[0,0,0];s.mirrorX&&d.multiply(Xn.makeScale(-1,1,1));let _=window.GeoGlyphGroundTransform.point(f,s,a),M=new window.maplibregl.MercatorCoordinate(l.x+_[0]*c,l.y-_[1]*c,_[2]*c);return{geographic:u,object:d,localCenter:_,center:M.toLngLat(),elevation:M.toAltitude(),units:c,angles:t,radius:Math.hypot((h.maxX-h.minX)*o.height,(h.maxY-h.minY)*o.height,(h.maxZ-h.minZ)*o.depth)/2}}function ln(){return!!(bt()?.extrusionEnabled&&(Tn()||gn?.ready&&qt&&bt()?.lastRenderMode==="vector"))}function Ln(){let i=bt(),e=i?.map;if(!e)return;let t=ln()||Tn()?"none":"visible";for(let r of["geoglyph-ground-fill","geoglyph-ground-outline"])e.getLayer(r)&&e.getLayoutProperty(r,"visibility")!==t&&e.setLayoutProperty(r,"visibility",t);let n="geoglyph-ground-decal-layer";e.getLayer(n)&&e.setLayoutProperty(n,"visibility",Tn()?"none":"visible"),gn?.ready&&qt&&gn.paint(),window.GeoGlyphFontMorph?.syncVisibility(),e.triggerRepaint()}function Il(){it.exit(),++_u;let i=bt()?.map;gn&&i?.getLayer(xu)&&i.removeLayer(xu),gn=null,qt=null,_s="",hi.clear(),cn=null,wr="",Ln(),Mt()}function I_(i){return{id:xu,type:"custom",renderingMode:"3d",ready:!1,onAdd(t,n){this.renderer=new os({canvas:i.getCanvas(),context:n,antialias:!1}),this.renderer.autoClear=!1,this.scene=new Si,this.camera=new Mi,this.group=new xi,this.poseMatrices={geographic:new ke,object:new ke},this.renderedAngles={bearing:0,tilt:90},this.hasRenderedPose=!1,this.group.matrixAutoUpdate=!1,this.scene.add(this.group),this.scene.add(new Vs(16777215,1.3));let r=new Gs(16777215,2);r.position.set(-1,-2,4),this.scene.add(r),this.front=new cr({side:Qt,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1}),this.side=new Bs({side:Qt,transparent:!0,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1});let s=hi.get(_s);this.mesh=new Dt(s.geometry,[this.front,this.side]),this.group.add(this.mesh),this.lineMaterial=new us({worldUnits:!1,transparent:!0,depthWrite:!1}),this.lines=new dl(s.lineGeometry,this.lineMaterial),this.group.add(this.lines),this.geometry=s.geometry,this.lineGeometry=s.lineGeometry,this.ready=!0,vu++,this.paint()},replace(t){this.hasRenderedPose=!1,this.geometry=t.geometry,this.lineGeometry=t.lineGeometry,this.mesh.geometry=t.geometry,this.lines.geometry=t.lineGeometry,vu++},paint(t){let n=bt();if(!this.ready||!qt)return;this.geometry.groups=n.extrusionSolid&&qt.solidGroups||qt.groups,this.front.color.set(n.fill),this.side.color.set(n.fill).multiplyScalar(.62);let r=n.extrusionSolid?1:n.opacity;for(let o of[this.front,this.side]){let l=!n.extrusionSolid;o.transparent!==l&&(o.transparent=l,o.needsUpdate=!0),o.opacity=r,o.depthWrite=n.extrusionSolid||r>=.99}this.lineMaterial.opacity=r,this.lineMaterial.depthWrite=!1,this.lineMaterial.color.set(n.outline);let s=i.getCanvas(),a=s.width/Math.max(1,s.clientWidth);this.lineMaterial.linewidth=n.outlineWidth*a,this.lineMaterial.resolution.set(s.width,s.height),this.lines.visible=n.outlineWidth>0,this.group.matrix.copy((t||Pl()).object),this.group.matrixWorldNeedsUpdate=!0},render(t,n){if(!ln()||Tn()||!bt()?.previewActive)return;let r=it.getAngles(),s=Pl(r,this.poseMatrices);this.paint(s),this.camera.projectionMatrix.fromArray(n.defaultProjectionData.mainMatrix).multiply(s.geographic),this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert(),this.renderer.resetState(),this.renderer.setViewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),this.renderer.render(this.scene,this.camera),this.renderer.resetState(),this.renderedAngles.bearing=r.bearing,this.renderedAngles.tilt=r.tilt,this.hasRenderedPose=!0},onRemove(){this.ready=!1;for(let t of[this.front,this.side,this.lineMaterial])t?.dispose();this.renderer?.dispose(),Qd++}}}async function rf(i,e=()=>{},t=()=>!0,n=null){let r=_u;return i=hi.get(i.key)||await hi.prepare(i.model),new Promise((s,a)=>requestAnimationFrame(()=>{try{let o=bt();if(r!==_u||!t()||!o.extrusionEnabled||!n&&Tn()){s(!1);return}if(hi.get(i.key)!==i){En().queueRebuild(!1),s(!1);return}let l=_s!==i.key;n?.(),e(),qt=i.mesh,_s=i.key,hi.activate(i),it.enter(),gn?.ready?l&&gn.replace(i):(gn=I_(o.map),o.map.addLayer(gn)),wr="",it.retarget(),Ln(),Mt(),cn&&(o.orientationMode=cn,cn=null,it.start()),s(!0)}catch(o){a(o)}}))}async function L_(i=()=>!0){if(Tn()){Ln(),Mt();return}let e=bt();if(!e?.extrusionEnabled){gn&&Il(),vs(""),Mt();return}if(e.lastRenderMode!=="vector"||!e.lastLocalModel){ln()||vs("This content uses a font image. Choose an outline font to enable extrusion."),Mt();return}try{let t=await hi.prepare(e.lastLocalModel);if(!i()||Tn())return;_s!==t.key||!gn?.ready?await rf(t,()=>{},i):(it.retarget(),Ln(),Mt())}catch(t){Ll(t.message)}}function Ll(i){wr=i,cn=null,Mt();let e=bt(),t=e?.fontRecords.get(e.selectedFontId)?.name||"Selected font",n=e?.fontRecords.get(e.displayedFontId)?.name;vs(ln()?`${t} cannot be shown in 3D: ${i}. Showing ${n||"previous font"}. Switch to 2D to preview the selected font.`:`3D unavailable: ${i}. Choose an outline font or switch to 2D.`,!0)}function Su(i,{manual:e=!0}={}){if(e&&En().setModelMode)return Promise.resolve(En().setModelMode(i)).catch(n=>{Ll(n.message),Mt()});let t=bt();t.extrusionEnabled=i,i&&t.extrusionDepthMeters==null&&(t.extrusionDepthMeters=Math.max(.1,Math.min(1e5,t.baseHeightMeters*t.relativeSize/1e3))),i||Il(),Mt(),En().queueRebuild(!1)}function ca(i){cn=null,it.stop(i),Mt()}function nr(){En()?.notifyManualMapChange?En().notifyManualMapChange():document.dispatchEvent(new CustomEvent("geoglyph:manual-map-change"))}function D_({freezePose:i=!0}={}){cn=null,it.stop({freezePose:i}),it.exit(),Mt()}function Kd(i=bt().orientationMode){let e=bt();if(cn===i){cn=null,Mt();return}if(it.isRunning()&&e.orientationMode===i){it.stop({freezePose:!0});return}if(e.orientationMode=i,!e.extrusionEnabled||!ln()){cn=i,it.enter(),Su(!0,{manual:!1}),Mt();return}it.isRunning()?(it.retarget(),Ln(),Mt()):it.start()}function F_(i,e={}){let t=bt();return!t||!ln()?!1:(t.orientationMode=i,cn=null,it.isRunning()?it.retarget():it.start(e),Ln(),Mt(),!0)}function Mt(){let i=bt();if(!i)return;Er();let e=Tn()?.label()||i.fontRecords.get(i.displayedFontId)?.name,t=we("mapDisplayedFont");if(t){let s=e?"Font: "+e:"Font: Preparing\u2026";t.textContent!==s&&(t.textContent=s,t.title=s)}we("map3DEnabled")&&(we("map3DEnabled").checked=i.extrusionEnabled),we("mapMirrorX")&&(we("mapMirrorX").checked=i.mirrorX===!0),we("map3DControls")&&(we("map3DControls").hidden=!i.extrusionEnabled),we("map3DDepth")&&(we("map3DDepth").value=String(i.extrusionDepthMeters??Math.max(.1,i.baseHeightMeters*i.relativeSize/1e3))),we("map3DTilt")&&(we("map3DTilt").value=String(i.extrusionTilt)),we("map3DTiltValue")&&(we("map3DTiltValue").textContent=i.extrusionTilt+"\xB0"),we("map3DView")&&(we("map3DView").disabled=!ln()),we("map3DSolid")&&(we("map3DSolid").checked=i.extrusionSolid),we("map3DOrientation")&&(we("map3DOrientation").value=i.orientationMode),we("map3DOrbitPeriod")&&(we("map3DOrbitPeriod").value=String(i.orbitPeriodSeconds)),we("map3DOrbitPeriodValue")&&(we("map3DOrbitPeriodValue").textContent=i.orbitPeriodSeconds+" s / circle"),we("map3DOrbit")&&(we("map3DOrbit").disabled=!ln(),we("map3DOrbit").textContent=it.isRunning()?"Stop orbit":"Start orbit",we("map3DOrbit").setAttribute("aria-pressed",String(it.isRunning())));let n=ln()&&i.orientationMode!=="fixed";we("mapBearing")&&(we("mapBearing").disabled=n),we("map3DTilt")&&(we("map3DTilt").disabled=n&&i.orientationMode==="billboard"),we("mapOpacity")&&(we("mapOpacity").disabled=ln()&&i.extrusionSolid,we("mapOpacity").title=we("mapOpacity").disabled?"Solid model uses full opacity. Your 2D opacity is preserved.":""),we("map3DOrientationNote")&&(we("map3DOrientationNote").textContent=i.orientationMode==="fixed"?"Uses your text bearing and tilt.":i.orientationMode==="yaw"?"Bearing follows the camera; your tilt is preserved.":"Bearing and tilt follow the camera. Fixed mode restores your angles.");let r=we("mapQuickModel");r&&(r.setAttribute("aria-pressed",String(i.extrusionEnabled)),r.querySelector("span").textContent=i.extrusionEnabled?"3D":"2D",r.title=i.extrusionEnabled?"Switch model to 2D":"Switch model to 3D");for(let[s,a]of[["mapQuickOrbit","fixed"],["mapQuickTurn","yaw"],["mapQuickFace","billboard"]]){let o=we(s);if(!o)continue;let l=it.isRunning()&&i.orientationMode===a;o.setAttribute("aria-pressed",String(l)),o.classList.toggle("is-running",l),o.setAttribute("aria-busy",String(cn===a)),o.title=(l?"Stop ":"Start ")+{fixed:"orbit",yaw:"orbit, turning toward the camera",billboard:"orbit, facing the camera square-on"}[a]}ln()&&!wr&&vs(Tn()?"Font morph \xB7 solid 3D":"Outline mesh \xB7 "+Math.round(qt.position.length/9).toLocaleString()+" triangles")}function N_(i={}){return En().fit()}function U_(){if(we("map3DEnabled"))return!0;let i=bt(),e=we("geoglyphMapEditor")?.querySelector(".map-control-grid");if(!i||!e)return!1;let t=document.createElement("section");t.className="map-3d-panel",t.setAttribute("aria-label","3D text"),t.innerHTML=`<div class="map-3d-toggles"><label class="map-3d-toggle"><input id="map3DEnabled" class="map-switch" type="checkbox" role="switch"><span>3D extrusion</span></label>
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
    </div><p id="map3DStatus" class="map-3d-status" role="status"></p>`,e.after(t),we("map3DEnabled").addEventListener("change",o=>Su(o.target.checked)),we("mapMirrorX").addEventListener("change",o=>{Promise.resolve(En().setMirrorX(o.target.checked)).catch(l=>{Ll(l.message),Mt()})}),we("map3DSolid").addEventListener("change",o=>{nr(),i.extrusionSolid=o.target.checked,Mt(),Ln()}),we("map3DOrientation").addEventListener("change",o=>{nr(),i.orientationMode=o.target.value,cn&&(cn=i.orientationMode),it.retarget(),Mt(),Ln()}),we("map3DOrbitPeriod").addEventListener("input",o=>{nr(),i.orbitPeriodSeconds=Math.max(10,Math.min(120,Number(o.target.value)||30)),Mt()}),we("map3DOrbit").addEventListener("click",()=>{nr(),Kd()}),we("map3DDepth").addEventListener("input",o=>{let l=Number(o.target.value);!Number.isFinite(l)||l<.1||(nr(),ca({freezePose:!0}),i.extrusionDepthMeters=Math.min(1e5,l),Ln())}),we("map3DDepth").addEventListener("change",o=>{o.target.value=String(i.extrusionDepthMeters??30)}),we("map3DTilt").addEventListener("input",o=>{let l=Math.max(0,Math.min(90,Number(o.target.value)||0));nr(),ca({freezePose:!0}),i.extrusionTilt=l,Ln()}),we("map3DView").addEventListener("click",()=>{nr(),En().fit()}),we("mapExportObjBtn").addEventListener("click",()=>tf());for(let o of["geoglyph:ground-rendered","geoglyph:ground-style"])document.addEventListener(o,Er);let n=new Set(["mapMessage","mapHeight","mapRelativeSize","mapTracking","mapLineHeight","mapBearing","mapQuality","mapNativeColor"]);for(let o of["input","change"])document.addEventListener(o,l=>{n.has(l.target.id)&&ca({freezePose:!0})},!0);document.addEventListener("click",o=>{bt()?.previewActive&&o.target.closest?.("[data-map-mode],[data-code],.key-button[data-base]")&&ca({freezePose:!0})},!0);let r=document.createElement("div");r.className="map-motion-actions",r.setAttribute("aria-label","Model and animation shortcuts"),r.innerHTML=[["Model","box","model","2D"],["Orbit","orbit","orbit","Orbit"],["Turn","rotate-3d","turn","Turn"],["Face","scan-eye","face","Face"],["Random","shuffle","random","Random"]].map(([o,l,c,u])=>`<button id="mapQuick${o}" class="map-motion-action" data-accent="${c}" type="button" ${o==="Random"?'aria-label="Choose a random font"':'aria-pressed="false"'}>${fl[l]}<span>${u}</span></button>`).join(""),we("geoglyphMapEditor").querySelector(".map-mode-switch").before(r);let s=document.createElement("p");s.id="mapDisplayedFont",s.className="map-displayed-font",s.setAttribute("role","status"),s.setAttribute("aria-atomic","true"),r.after(s);let a=document.createElement("p");a.id="mapQuickStatus",a.className="map-compact-feedback",a.hidden=!0,a.setAttribute("role","status"),we("geoglyphMapEditor").after(a),we("mapQuickModel").setAttribute("aria-label","Toggle 2D or 3D model"),we("mapQuickRandom").title="Choose a random font; keep text and animation",we("mapQuickModel").addEventListener("click",()=>Su(!i.extrusionEnabled));for(let[o,l]of[["Orbit","fixed"],["Turn","yaw"],["Face","billboard"]])we("mapQuick"+o).addEventListener("click",()=>{nr(),Kd(l)});return we("mapQuickRandom").addEventListener("click",()=>En().randomFont()),Mt(),!0}window.GeoGlyph3D=Object.freeze({update:L_,prepare:hi.prepare,cached:hi.get,commit:rf,failure:Ll,notice:i=>{wr=i,vs(i,!0)},preparing:i=>{wr="",vs("Preparing "+i+"\u2026",!0),Er()},clear:Il,syncVisibility:Ln,isVisible:ln,refreshControls:Mt,refreshExportControls:Er,exportOBJ:tf,fit:N_,fitCurrent:it.fit,startOrbit:it.start,ensureOrbit:F_,stopOrbit:ca,exitCamera:D_,pauseAnimation:it.pause,morphPose:(i,e={})=>nf(i,e.flat===!0,void 0,e.output),morphModeChanged:i=>{i?it.enter():it.exit(),Ln(),Mt()},stats:()=>({visible:ln(),uploads:vu,disposals:Qd,bytes:qt?.bytes||0,triangles:(qt?.position.length||0)/9,lastError:wr,meshKey:_s,cache:hi.stats(),animation:it.stats()}),getBounds:()=>qt?.bounds||null});function jd(){let i=()=>U_()?(Ud(),Jd(),Zd(),!0):!1;if(i())return;let e=new MutationObserver(()=>{i()&&e.disconnect()});e.observe(document.body,{childList:!0,subtree:!0}),window.addEventListener("load",()=>{i()&&e.disconnect()},{once:!0})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",jd,{once:!0}):jd();window.addEventListener("pagehide",Il);window.addEventListener("pageshow",i=>{i.persisted&&bt()?.extrusionEnabled&&En().queueRebuild(!1)});})();
