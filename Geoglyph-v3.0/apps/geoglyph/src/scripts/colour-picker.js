/* Inline HSV colour control. Original inputs remain the authoring interface. */
(() => {
  'use strict';
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function fromHex(hex,previous){
    const [r,g,b]=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255);
    const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
    const hue=!d?previous.h:((max===r?(g-b)/d+(g<b?6:0):max===g?(b-r)/d+2:(r-g)/d+4)*60);
    return {h:hue,s:max?d/max:previous.s,v:max};
  }
  function toHex({h,s,v}){
    const c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c;
    const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
    return '#'+rgb.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('').toUpperCase();
  }
  function mount(element,getSource){
    if(!element)return null;
    element.className='inline-colour-picker';
    element.innerHTML=`<span class="control-label inline-picker-label"></span>
      <div class="inline-picker-sv" role="group" aria-label="Colour saturation and brightness">
        <input class="sr-only" type="range" min="0" max="100" step="any" aria-label="Colour saturation">
        <input class="sr-only" type="range" min="0" max="100" step="any" aria-label="Colour brightness">
        <span class="inline-picker-cursor" aria-hidden="true"></span>
      </div>
      <label class="inline-picker-hue"><span class="control-label">Hue</span><input type="range" min="0" max="359" step="1" aria-label="Colour hue"></label>
      <div class="inline-picker-values"><select aria-label="Colour input format"><option value="rgb">RGB</option><option value="hex">HEX</option><option value="hsl">HSL</option></select><div class="inline-picker-channels"></div></div>`;
    const plane=element.querySelector('.inline-picker-sv'),[saturation,brightness,hue]=element.querySelectorAll('input');
    const cursor=element.querySelector('.inline-picker-cursor'),label=element.querySelector('.inline-picker-label');
    const format=element.querySelector('select'),channels=element.querySelector('.inline-picker-channels');
    let hsv={h:0,s:1,v:1},lastKey='',lastHex='',drag=null,pending=null,frame=0,channelFormat='rgb';
    const isDisabled=(source=getSource())=>!source?.input || Boolean(source.disabled ?? source.input.disabled);
    function syncAvailability(source){
      const disabled=isDisabled(source);
      element.setAttribute('role','group');
      element.setAttribute('aria-label',source.label+' colour editor');
      element.setAttribute('aria-disabled',String(disabled));
      element.querySelectorAll('input,select').forEach(input=>{input.disabled=disabled;});
      if(disabled){
        if(frame)cancelAnimationFrame(frame);frame=0;pending=null;
        if(drag!==null&&plane.hasPointerCapture(drag))plane.releasePointerCapture(drag);
        drag=null;
      }
    }
    function channelValues(){
      const hex=toHex(hsv);
      if(channelFormat==='hex')return [hex];
      if(channelFormat==='rgb')return hex.slice(1).match(/../g).map(v=>parseInt(v,16));
      const light=hsv.v*(1-hsv.s/2),sat=light===0||light===1?0:(hsv.v-light)/Math.min(light,1-light);
      return [Math.round(hsv.h),Math.round(sat*100),Math.round(light*100)];
    }
    function drawChannels(){
      const values=channelValues();
      channels.querySelectorAll('input').forEach((input,i)=>{if(document.activeElement!==input)input.value=String(values[i]);});
    }
    function createChannels(){
      // Commit a focused field using its current format before replacing it.
      if(channels.contains(document.activeElement))document.activeElement.blur();
      channelFormat=format.value;
      const definitions=channelFormat==='rgb'?[['R','Red',255],['G','Green',255],['B','Blue',255]]:channelFormat==='hsl'?[['H','Hue degrees',360],['S','Saturation percent',100],['L','Lightness percent',100]]:[['HEX','Hex colour',null]];
      channels.replaceChildren(...definitions.map(([name,description,max])=>{
        const field=document.createElement('label'),caption=document.createElement('span'),input=document.createElement('input');
        caption.textContent=name;input.setAttribute('aria-label',description);input.type=max===null?'text':'number';
        if(max===null){input.maxLength=7;input.spellcheck=false;}else{input.min='0';input.max=String(max);input.step='1';}
        input.disabled=isDisabled();field.append(input,caption);return field;
      }));
      drawChannels();
    }
    function editChannels(){
      if(isDisabled())return;
      const inputs=[...channels.querySelectorAll('input')];
      if(inputs.some(n=>!n.value.trim()||!n.checkValidity()))return;
      if(channelFormat==='hex'){
        let hex=inputs[0].value.trim().replace(/^#/,'');if(/^[a-f\d]{3}$/i.test(hex))hex=[...hex].map(c=>c+c).join('');
        if(!/^[a-f\d]{6}$/i.test(hex))return;hsv=fromHex('#'+hex,hsv);
      }else if(channelFormat==='rgb'){
        hsv=fromHex('#'+inputs.map(n=>Number(n.value).toString(16).padStart(2,'0')).join(''),hsv);
      }else{
        const [h,s,l]=inputs.map(n=>Number(n.value)),light=l/100,v=light+s/100*Math.min(light,1-light);
        hsv={h:h%360,s:v?2*(1-light/v):0,v};
      }
      apply();
    }
    function draw(){
      plane.style.setProperty('--picker-hue',String(hsv.h));
      cursor.style.left=hsv.s*100+'%';cursor.style.top=(1-hsv.v)*100+'%';
      saturation.value=String(hsv.s*100);brightness.value=String(hsv.v*100);hue.value=String(hsv.h);
      drawChannels();
    }
    function sync(){
      const source=getSource();if(!source?.input)return;
      syncAvailability(source);
      const hex=source.input.value.toUpperCase();
      if(source.key!==lastKey||hex!==lastHex){hsv=fromHex(hex,hsv);lastKey=source.key;lastHex=hex;draw();}
      label.textContent=source.label;
    }
    function apply(){
      const source=getSource();if(isDisabled(source))return;
      const hex=toHex(hsv);lastKey=source.key;lastHex=hex;
      source.input.value=hex;source.input.dispatchEvent(new Event('input',{bubbles:true}));draw();
    }
    function change(){const source=getSource();if(!isDisabled(source))source.input.dispatchEvent(new Event('change',{bubbles:true}));}
    function move(point){
      if(isDisabled())return;
      const r=plane.getBoundingClientRect();
      hsv.s=clamp((point.x-r.left)/r.width,0,1);hsv.v=1-clamp((point.y-r.top)/r.height,0,1);apply();
    }
    function flush(){if(frame)cancelAnimationFrame(frame);frame=0;if(pending){const p=pending;pending=null;move(p);}}
    plane.addEventListener('pointerdown',event=>{
      if(event.button!==0||isDisabled())return;event.preventDefault();sync();
      drag=event.pointerId;plane.setPointerCapture(drag);saturation.focus({preventScroll:true});move({x:event.clientX,y:event.clientY});
    });
    plane.addEventListener('pointermove',event=>{
      if(event.pointerId!==drag)return;pending={x:event.clientX,y:event.clientY};
      if(!frame)frame=requestAnimationFrame(()=>{frame=0;flush();});
    });
    function finish(event){if(event.pointerId!==drag)return;flush();drag=null;change();}
    plane.addEventListener('pointerup',finish);plane.addEventListener('pointercancel',finish);
    for(const [input,key,scale] of [[saturation,'s',100],[brightness,'v',100],[hue,'h',1]]){
      input.addEventListener('input',()=>{if(isDisabled())return;hsv[key]=Number(input.value)/scale;apply();});input.addEventListener('change',change);
    }
    format.addEventListener('change',createChannels);
    channels.addEventListener('input',editChannels);
    channels.addEventListener('change',()=>{editChannels();change();});
    channels.addEventListener('focusout',()=>{requestAnimationFrame(drawChannels);});
    channels.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();editChannels();change();event.target.blur();}});
    createChannels();
    sync();return {sync};
  }
  window.GeoGlyphColourPicker=Object.freeze({mount});
})();
