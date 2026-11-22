/* Vintage 5×7 LCD dot-matrix ticker, entirely code-rendered.
   No external fonts, text-shadow font tricks or images. The individual
   monochrome square pixels are drawn on canvas, including dim unlit cells. */
(() => {
'use strict';
const FONT={
 ' ':['00000','00000','00000','00000','00000','00000','00000'],
 'A':['01110','10001','10001','11111','10001','10001','10001'],
 'B':['11110','10001','10001','11110','10001','10001','11110'],
 'C':['01111','10000','10000','10000','10000','10000','01111'],
 'D':['11110','10001','10001','10001','10001','10001','11110'],
 'E':['11111','10000','10000','11110','10000','10000','11111'],
 'F':['11111','10000','10000','11110','10000','10000','10000'],
 'G':['01111','10000','10000','10111','10001','10001','01111'],
 'H':['10001','10001','10001','11111','10001','10001','10001'],
 'I':['11111','00100','00100','00100','00100','00100','11111'],
 'J':['00111','00010','00010','00010','10010','10010','01100'],
 'K':['10001','10010','10100','11000','10100','10010','10001'],
 'L':['10000','10000','10000','10000','10000','10000','11111'],
 'M':['10001','11011','10101','10101','10001','10001','10001'],
 'N':['10001','11001','10101','10011','10001','10001','10001'],
 'O':['01110','10001','10001','10001','10001','10001','01110'],
 'P':['11110','10001','10001','11110','10000','10000','10000'],
 'Q':['01110','10001','10001','10001','10101','10010','01101'],
 'R':['11110','10001','10001','11110','10100','10010','10001'],
 'S':['01111','10000','10000','01110','00001','00001','11110'],
 'T':['11111','00100','00100','00100','00100','00100','00100'],
 'U':['10001','10001','10001','10001','10001','10001','01110'],
 'V':['10001','10001','10001','10001','10001','01010','00100'],
 'W':['10001','10001','10001','10101','10101','10101','01010'],
 'X':['10001','10001','01010','00100','01010','10001','10001'],
 'Y':['10001','10001','01010','00100','00100','00100','00100'],
 'Z':['11111','00001','00010','00100','01000','10000','11111'],
 'a':['00000','00000','01110','00001','01111','10001','01111'],
 'm':['00000','00000','11010','10101','10101','10101','10101'],
 'p':['00000','00000','11110','10001','11110','10000','10000'],
 '0':['01110','10001','10011','10101','11001','10001','01110'],
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '2':['01110','10001','00001','00010','00100','01000','11111'],
 '3':['11110','00001','00001','01110','00001','00001','11110'],
 '4':['00010','00110','01010','10010','11111','00010','00010'],
 '5':['11111','10000','10000','11110','00001','00001','11110'],
 '6':['01110','10000','10000','11110','10001','10001','01110'],
 '7':['11111','00001','00010','00100','01000','01000','01000'],
 '8':['01110','10001','10001','01110','10001','10001','01110'],
 '9':['01110','10001','10001','01111','00001','00001','01110'],
 ':':['00000','00100','00100','00000','00100','00100','00000'],
 '.':['00000','00000','00000','00000','00000','00110','00110'],
 ',':['00000','00000','00000','00000','00110','00100','01000'],
 '-':['00000','00000','00000','11111','00000','00000','00000'],
 '/':['00001','00001','00010','00100','01000','10000','10000'],
 '#':['01010','01010','11111','01010','11111','01010','01010'],
 '?':['01110','10001','00001','00010','00100','00000','00100'],
 '!':['00100','00100','00100','00100','00100','00000','00100'],
 '+':['00000','00100','00100','11111','00100','00100','00000'],
 '=':['00000','11111','00000','11111','00000','00000','00000'],
 '(':['00010','00100','01000','01000','01000','00100','00010'],
 ')':['01000','00100','00010','00010','00010','00100','01000'],
 '%':['11001','11010','00100','00100','01011','10011','00000'],
 "'":['00100','00100','00000','00000','00000','00000','00000'],
 '&':['01100','10010','10100','01000','10101','10010','01101'],
 '|':['00100','00100','00100','00100','00100','00100','00100'],
 '*':['00000','10101','01110','11111','01110','10101','00000'],
 '>':['10000','01000','00100','00010','00100','01000','10000'],
 '<':['00001','00010','00100','01000','00100','00010','00001'],
 '_':['00000','00000','00000','00000','00000','00000','11111']
};
const instruction='CLICK A VEHICLE, STOP OR ROUTE ON THE MAP FOR DETAILS';
const separator=' · ';
const scrollSpeed=80;
const defaultColour = '#ffd05e';
const accentColours = new Map([
 ['bus', '#88db66'],
 ['train', '#69c9ff'],
 ['tram', '#ff6b72'],
 ['recording', '#ff5f6a']
]);
let colour = defaultColour;
let holdUntil=0;
let centreStart=false;
let drag;
let canvas,host,ctx,offImage=null,pitch=4,offset=0,last=0,frame=0,
    label=instruction,bits=[],visualCols=0,viewW=0,viewH=0,scale=1;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clean=s=>String(s??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
 .toUpperCase().replace(/(\d:\d{2})(AM|PM)\b/g,(_,time,period)=>time+period.toLowerCase())
 .replace(/[•◆→↗—–]/g,' * ').replace(/[\x00-\x1f]/g,' ').replace(/\s+/g,' ').trim();
const timeOptions={day:'2-digit',month:'2-digit',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true};
const adelaideClock=new Intl.DateTimeFormat('en-AU',{...timeOptions,timeZone:'Australia/Adelaide'});
const snapshotClock=new Intl.DateTimeFormat('en-AU',{...timeOptions,timeZone:'UTC'});

function formatDateTime(value, clock=adelaideClock){
 const date=new Date(value);
 if(!Number.isFinite(date.getTime()))return '';
 const {day,month,year,hour,minute,dayPeriod}=Object.fromEntries(clock.formatToParts(date).map(part=>[part.type,part.value]));
 return `${day}/${month}/${year} ${Number(hour)}:${minute}${dayPeriod.toLowerCase()}`;
}

function formatPositionTime(value){
 const text=String(value??'').trim().replace(' ','T');
 // Archive timestamps without a timezone already represent local wall time.
 const archiveTime=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(text);
 const formatted=formatDateTime(archiveTime?text+'Z':text,archiveTime?snapshotClock:adelaideClock);
 return formatted ? 'UPDATED ' + formatted : 'TIME UNKNOWN';
}

const messageStart=()=>centreStart?-Math.round(viewW/(2*pitch))*pitch:0;

function setText(text, {restart=true, startAtCentre=false, accent}={}){
 const next=clean(text)||instruction;
 colour = accentColours.get(String(accent ?? '').toLowerCase()) ?? defaultColour;
 if(restart){
   centreStart=startAtCentre;
   offset=messageStart();
   holdUntil=performance.now()+350;
 }
 if(next===label&&bits.length)return;
 label=next;
 const message=label+'     *     ';
 bits=[];
 for(const char of message){
 const rows=char==='·'?['00000','00000','00000','00100','00000','00000','00000']:FONT[char]||FONT['?'];
   for(let c=0;c<5;c++){
     let mask=0;
     for(let r=0;r<7;r++)if(rows[r][c]==='1')mask|=(1<<r);
     bits.push(mask);
   }
   bits.push(0);
 }
 offset%=bits.length*pitch;
 if(host)host.setAttribute('aria-label',label);
 const accessible=document.getElementById('lcdReadable');
 if(accessible)accessible.textContent=label;
}
function resize(){
  if (!canvas || !host) return;
  const {width, height} = canvas.getBoundingClientRect();
  if (width <= 0 || height <= 0) return;
  const dpr = Math.min(devicePixelRatio || 1, 3);
  const pixelWidth = Math.max(1, Math.round(width * dpr));
  const pixelHeight = Math.max(1, Math.round(height * dpr));
  const nextScale = parseFloat(getComputedStyle(host).getPropertyValue('--ticker-scale')) || 1;
  if (ctx && width === viewW && height === viewH && nextScale === scale &&
      pixelWidth === canvas.width && pixelHeight === canvas.height) return;
  viewW = width;
  viewH = height;
  scale = nextScale;
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  const scaleX = pixelWidth / width;
  const scaleY = pixelHeight / height;
  ctx = canvas.getContext('2d', {alpha: true});
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  ctx.imageSmoothingEnabled = false;
  const nextPitch = Math.max(3, Math.min(5, Math.floor((height / scale - 4) / 9))) * scale;
  offset *= nextPitch / pitch;
  pitch = nextPitch;
  visualCols = Math.ceil(width / pitch) + 1;
  offImage = document.createElement('canvas');
  offImage.width = pixelWidth;
  offImage.height = pixelHeight;
  const background = offImage.getContext('2d');
  background.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  const y0 = Math.floor((height - 7 * pitch) / 2);
  background.fillStyle = '#796b3988';
  for (let col = 0; col < visualCols; col++) {
    for (let row = 0; row < 7; row++) {
      background.fillRect(col * pitch + 1, y0 + row * pitch + 1, pitch - 1, pitch - 1);
    }
  }
  draw();
}
function draw(){
 if(!canvas||!ctx||!bits.length)return;
 ctx.clearRect(0,0,viewW,viewH);
 if(offImage)ctx.drawImage(offImage,0,0,viewW,viewH);
 const y0=Math.floor((viewH-7*pitch)/2);
 const position=offset/pitch;
 const shifted=Math.floor(position);
 const blend=position-shifted;
 ctx.fillStyle=colour;
 // Blend the neighbouring samples while keeping each LED in its fixed grid cell.
 for(let col=0;col<visualCols;col++){
   const column=shifted+col;
   if(column < -1)continue;
   const current=column < 0 ? 0 : bits[column%bits.length];
   const next=bits[(column+1)%bits.length];
   if(!(current|next))continue;
   const x=col*pitch+1;
   for(let row=0;row<7;row++){
     const pixel=1<<row;
     const brightness=(current&pixel?1-blend:0)+(next&pixel?blend:0);
     if(!brightness)continue;
     ctx.globalAlpha=brightness;
     ctx.fillRect(x,y0+row*pitch+1,pitch-1,pitch-1);
   }
 }
 ctx.globalAlpha=1;
}
function animate(now){
 const delta=Math.min(.06,(now-Math.max(last||now,holdUntil))/1000);
 last=now;
 if(delta>0&&!drag&&!document.hidden&&!reduced.matches&&bits.length){
   offset=(offset+delta*scrollSpeed*scale)%(bits.length*pitch);
   draw();
 }
 frame=requestAnimationFrame(animate);
}
function render(text,options){setText(text,options);draw();}
function reset(restart=true){
 if(restart||label!==instruction)render(instruction);
}
function selected(v,mode='snapshot',restart=true){
 if(!v){reset(restart);return;}
 const speed=Number(v.Speed);
 const kph=v.Speed!=null&&v.Speed!==''&&Number.isFinite(speed)?Math.round(speed*3.6)+' KM/H':'SPEED UNKNOWN';
 const timestamp=formatPositionTime(v.PositionTimestamp);
 const label = {live:'LIVE', playback:'PLAYBACK', snapshot:'SNAPSHOT', saved:'SAVED SNAPSHOT'}[mode] ?? 'SNAPSHOT';
 const fields = [
   'Route ' + (v.RouteID || 'unknown'),
   'Vehicle ' + (v.VehicleLabel || v.VehicleID || 'unknown'),
   kph, 'Trip ' + (v.TripID || 'N/A'), timestamp, label
 ];
 return information((v.VehicleType && v.VehicleType !== 'Unknown' ? v.VehicleType : 'Vehicle') + ' information', fields, {
  restart, startAtCentre: true, accent: v.VehicleType
 });
}

function recording(sessions, options) {
 const now = Date.now();
 const fields = [];
 for (const session of sessions) {
   if (fields.length) fields.push('Also active');
   fields.push(session.mode === 'browser' ? 'Browser recording' : 'Background recording');
   if (!Number.isFinite(session.startedAt)) {
     fields.push('Waiting for session details');
     continue;
   }
   const frames = session.frameCount ?? 0;
   const seconds = Math.max(0, Math.floor((now - session.startedAt) / 1000));
   const elapsed = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
     .map(unit => String(unit).padStart(2, '0')).join(':');
   fields.push(`${frames.toLocaleString('en-AU')} ${frames === 1 ? 'frame' : 'frames'}`,
     'Started ' + formatDateTime(session.startedAt), 'Length ' + elapsed);
   if (session.intervalSeconds) fields.push(`Every ${session.intervalSeconds} sec`);
 }
 return information('Recording information', fields, {...options, accent: 'recording'});
}

function information(heading, fields, options) {
 const text = heading + ': ' + fields.filter(Boolean).join(separator);
  render(text,options);
 return text;
}

function bindDrag(){
 host.addEventListener('pointerdown',event=>{
   if(drag||event.button!==0||!bits.length)return;
   host.setPointerCapture(event.pointerId);
   drag={id:event.pointerId,x:event.clientX};
   host.classList.add('is-dragging');
 });
 host.addEventListener('pointermove',event=>{
   if(drag?.id!==event.pointerId)return;
   offset=Math.max(messageStart(),offset+drag.x-event.clientX)%(bits.length*pitch);
   drag.x=event.clientX;
   draw();
 });
 const endDrag=event=>{
   if(drag?.id!==event.pointerId)return;
   drag=null;
   holdUntil=performance.now()+550;
   host.classList.remove('is-dragging');
 };
 for(const event of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(event,endDrag);
}

function init(){
 host=document.querySelector('.ticker-window');if(!host)return;
 const existing=host.querySelector('#tickerTrack');if(existing)existing.remove();
 canvas=document.createElement('canvas');canvas.className='lcd-canvas';canvas.setAttribute('aria-hidden','true');
 host.appendChild(canvas);
 // Pixel data is also available to assistive technology as ordinary text.
 const text=document.createElement('span');text.className='screenreader-status';text.id='lcdReadable';text.textContent=label;
 host.appendChild(text);
 resize();setText(label);draw();
 bindDrag();
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(host);
 else addEventListener('resize',resize);
 frame=requestAnimationFrame(animate);
 document.addEventListener('visibilitychange',()=>{last=0;});
 addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame)},{once:true});
}
window.MetroTicker={render,selected,information,recording,reset,debugState:()=>({label,pitch,columns:bits.length,scrollColumn:Math.floor(offset/pitch),canvasReady:!!ctx})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
