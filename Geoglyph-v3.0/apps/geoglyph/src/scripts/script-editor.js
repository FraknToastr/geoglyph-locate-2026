import { installScriptRuntime } from './script-runtime.js';
import { actionTypes, validateAction } from './script-model.js';
import { icon } from './control-icons.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(name,label,attrs='')=>`<button type="button" class="map-action" ${attrs}>${icon(name)}<span>${esc(label)}</span></button>`;
const field=(label,content)=>`<label class="map-field"><span>${esc(label)}</span>${content}</label>`;
const input=(id,value,min,max)=>`<input id="${id}" type="number" value="${value}" min="${min}" max="${max}" step="any">`;
const select=(id,options,value)=>`<select id="${id}">${options.map(([key,label])=>`<option value="${esc(key)}" ${String(key)===String(value)?'selected':''}>${esc(label)}</option>`).join('')}</select>`;
export function installScriptEditor(){
  if(document.getElementById('mapScriptSection'))return;
  const service=installScriptRuntime(),panel=document.createElement('section');
  panel.id='mapScriptSection';panel.className='map-script-panel';panel.setAttribute('aria-label','Script editor');
  panel.innerHTML=`<label class="map-field"><span>Script name</span><input id="mapScriptTitle" class="script-edit" type="text" maxlength="300"></label>
    <div class="script-file-actions">${button('file','New','id="mapScriptNew"')}${button('folder','Load JSON','id="mapScriptLoad"')}${button('save','Save JSON','id="mapScriptSave"')}${button('refresh','Reset intro','id="mapScriptReset" title="Restore bundled introduction"')}</div>
    <input id="mapScriptFile" type="file" accept=".json,application/json" hidden>
    <div class="script-play-actions">${button('play','Play','id="mapScriptPlay"')}${button('next','Next','id="mapScriptNext"')}${button('stop','Stop','id="mapScriptStop"')}</div>
    <p id="mapScriptStatus" class="map-3d-status" role="status" aria-live="polite"></p>
    <div class="script-rows" id="mapScriptRows" aria-label="Script rows"></div>
    ${button('plus','Add row','id="mapScriptAddRow"')}`;
  document.getElementById('mapMorphPanel').after(panel);
  panel.addEventListener('wheel',event=>{
    if(event.ctrlKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
    const sidebar=panel.closest('.map-control-sidebar');if(!sidebar)return;
    const previous=sidebar.scrollTop;
    const scale=event.deltaMode===1?16:event.deltaMode===2?sidebar.clientHeight:1;
    sidebar.scrollTop+=event.deltaY*scale;
    if(sidebar.scrollTop!==previous)event.preventDefault();
  },{passive:false});
  const dialog=document.createElement('dialog');dialog.id='mapScriptDialog';dialog.className='script-dialog';
  dialog.setAttribute('aria-labelledby','mapScriptDialogTitle');document.body.append(dialog);
  const $=id=>document.getElementById(id);
  let lastDraft='',modal=null,opener=null,openerRowId=null,modalVersion=0,localError='',cameraSession=null;
  function error(message){localError=String(message);$('mapScriptStatus').textContent=localError;$('mapScriptStatus').dataset.state='error';}
  function edit(change){try{localError='';const draft=service.getDraft();change(draft);service.setDraft(draft);}catch(reason){error(reason.message);}}
  function grow(textarea){textarea.style.height='auto';textarea.style.height=Math.max(34,textarea.scrollHeight)+'px';}
  function rowMarkup(row,index){
    let slots='';
    for(let slot=0;slot<4;slot++){
      const action=row.actions[slot];
      const label=action?(action.type==='mode'?action.value.toUpperCase():action.type==='font'?'Font: '+action.value.name:actionTypes[action.type][0]):'';
      slots+=action?`<button type="button" class="map-action script-action script-edit" data-edit-action="${slot}" aria-label="${esc(label)}" title="${esc(label)}">${icon(action.type==='mode'&&action.value==='2d'?'layers':actionTypes[action.type][1])}</button>`
        :slot===row.actions.length?`<button type="button" class="map-action script-action script-edit" data-add-action aria-label="Add action to row ${index+1}" title="Add action">${icon('plus')}</button>`:'<span class="script-empty-slot" aria-hidden="true"></span>';
    }
    return `<div class="script-row-primary">${slots}<textarea class="script-message script-edit" rows="1" placeholder="Message…" aria-label="Row ${index+1} message">${esc(row.message)}</textarea></div>
      <div class="script-row-tools"><button type="button" class="map-action script-edit" data-select-row aria-label="Select row ${index+1}">${index+1}</button>
      <label class="script-duration">Hold <input class="script-edit" type="number" min="0" max="3600" step=".25" value="${row.duration}" aria-label="Row ${index+1} duration"> s</label>
      ${[['above','plus','Insert row above'],['below','plus','Insert row below'],['up','up','Move row up'],['down','down','Move row down'],['copy','copy','Duplicate row'],['delete','trash','Delete row']].map(([action,name,label])=>`<button class="map-action script-edit" type="button" data-row-command="${action}" aria-label="${label}" title="${label}">${icon(name)}</button>`).join('')}</div>`;
  }
  function render(){
    const state=service.state(),draft=service.getDraft(),signature=JSON.stringify(draft),rows=$('mapScriptRows');
    if(signature!==lastDraft){
      const previous=new Map([...rows.children].map(node=>[node.dataset.rowId,node]));
      draft.rows.forEach((row,index)=>{
        let node=previous.get(row.id);if(!node){node=document.createElement('div');node.className='script-row';node.dataset.rowId=row.id;}
        previous.delete(row.id);const rowSignature=JSON.stringify([row,index]);
        if(node.dataset.signature!==rowSignature&&!node.contains(document.activeElement))node.innerHTML=rowMarkup(row,index);
        node.dataset.signature=rowSignature;
        if(rows.children[index]!==node)rows.insertBefore(node,rows.children[index]||null);
      });
      previous.forEach(node=>node.remove());lastDraft=signature;
      if(document.activeElement!==$('mapScriptTitle'))$('mapScriptTitle').value=draft.title;
      rows.querySelectorAll('textarea').forEach(grow);
    }
    for(const [index,node] of [...rows.children].entries()){
      node.classList.toggle('is-selected',index===state.selected);node.classList.toggle('is-playing',state.running&&!state.rehearsal&&index===state.index);
      node.querySelector('[data-select-row]')?.setAttribute('aria-pressed',String(index===state.selected));
    }
    panel.querySelectorAll('.script-edit,#mapScriptNew,#mapScriptLoad,#mapScriptReset,#mapScriptAddRow').forEach(node=>node.disabled=state.running);
    $('mapScriptPlay').innerHTML=icon(state.running&&!state.paused?'pause':'play')+`<span>${state.running?state.paused?'Resume':'Pause':'Play'}</span>`;
    $('mapScriptPlay').disabled=!draft.rows.length;$('mapScriptNext').disabled=!draft.rows.length;
    $('mapScriptStop').disabled=!state.running&&!state.hasMotion;
    if(!localError){$('mapScriptStatus').dataset.state=state.error?'error':'';$('mapScriptStatus').textContent=state.error||state.storageError||
      (state.running?(state.phase==='preflight'?'Preparing rehearsal fonts and morphs…':
        `${state.rehearsal?'Rehearsal row':'Row'} ${state.index+1} · ${state.paused?'Paused':state.phase==='preparing'?'Preparing…':'Playing'}`)
        :state.fontCycling?'Cycling fonts':state.phase==='complete'?'Script complete':`${draft.rows.length} rows · up to 4 actions per row`);}
  }
  function finishCamera(restore=true){const session=cameraSession;cameraSession=null;session?.dispose(restore);}
  function focusOpener(){const target=opener?.isConnected?opener:[...panel.querySelectorAll('[data-row-id]')].find(n=>n.dataset.rowId===openerRowId)?.querySelector('button');target?.focus({preventScroll:true});}
  function close(){finishCamera();++modalVersion;modal=null;if(dialog.open)dialog.close();else focusOpener();}
  dialog.addEventListener('close',()=>{
    // Closing the native dialog releases its focus trap while picking. Its
    // queued close event must not discard the suspended form or a reopened one.
    if(dialog.open||cameraSession?.suspended)return;
    finishCamera();++modalVersion;modal=null;
    focusOpener();
  });
  function shell(title,body,footer){
    dialog.innerHTML=`<form method="dialog"><div class="script-dialog-head"><h2 id="mapScriptDialogTitle">${esc(title)}</h2>${button('close','Close','data-dialog-close aria-label="Close picker"')}</div>
      <div class="script-dialog-body">${body}</div><p class="script-dialog-error" role="alert"></p><div class="script-dialog-footer">${footer||''}</div></form>`;
    dialog.querySelector('[data-dialog-close]').addEventListener('click',close);
    dialog.querySelector('form').addEventListener('submit',event=>event.preventDefault());
    if(!dialog.open)dialog.showModal();
  }
  function openMenu(rowId,trigger){
    opener=trigger;openerRowId=rowId;modal={rowId};++modalVersion;
    shell('Add action',`<div class="script-action-menu">${Object.entries(actionTypes).map(([type,[label,name]])=>button(name,label,`data-choose-action="${type}"`)).join('')}</div>`,button('close','Cancel','data-cancel'));
    dialog.querySelector('[data-cancel]').onclick=close;
    dialog.querySelectorAll('[data-choose-action]').forEach(node=>node.onclick=()=>openConfig(rowId,node.dataset.chooseAction));
  }
  function openCameraConfig(rowId,existing){
    const api=window.GeoGlyphMapEngine,value=existing?.value;
    const flight=typeof value==='object'?JSON.parse(JSON.stringify(value)):{type:'flight',start:null,end:null,duration:5};
    let original=null;
    try{original=api.captureCameraView();}catch{}
    const session={suspended:false,pickCleanup:null,preview:null,toolbar:null,markers:[],sidebarVisible:null,selected:null,disposed:false};
    cameraSession=session;
    shell('Camera action',field('Camera action',select('scriptValue',[
      ['opening','Prepare sleeping Geo'],['opening-and-fly','Prepare sleeping Geo and start zoom'],
      ['fly-opening','Fly to sleeping Geo (20 seconds)'],['wait-for-opening-flight','Wait for opening zoom'],
      ['overview','Australia overview'],['flight','Custom camera flight']
    ],typeof value==='object'?'flight':value||'fly-opening'))+
      `<div id="scriptCameraFlight" class="script-camera-fields">
        <div class="script-camera-point"><strong>Start</strong><output id="scriptCameraStartSummary" aria-live="polite"></output>${button('camera','Pick Start','id="scriptCameraPickStart"')}</div>
        <div class="script-camera-point"><strong>End</strong><output id="scriptCameraEndSummary" aria-live="polite"></output>${button('camera','Pick End','id="scriptCameraPickEnd"')}</div>
        ${field('Flight duration (s)',input('scriptCameraDuration',flight.duration,.25,300))}
        ${button('play','Preview','id="scriptCameraPreview"')}
      </div>`,footer(existing));
    const report=reason=>{const text=reason?.message||String(reason);dialog.querySelector('.script-dialog-error').textContent=text;return text;};
    function readValue(){
      return $('scriptValue').value==='flight'?{type:'flight',start:flight.start,end:flight.end,duration:Number($('scriptCameraDuration').value)}:$('scriptValue').value;
    }
    function validFlight(){try{validateAction({type:'camera',value:{type:'flight',start:flight.start,end:flight.end,duration:Number($('scriptCameraDuration').value)}});return true;}catch{return false;}}
    function describe(view){return view?`${view.center[0].toFixed(5)}, ${view.center[1].toFixed(5)} · Zoom ${view.zoom.toFixed(2)} · ${view.pitch<1?'2D':`3D ${view.pitch.toFixed(1)}°`} · Bearing ${view.bearing.toFixed(1)}°`:'Not selected';}
    function removeMarkers(){for(const marker of session.markers)marker.remove();session.markers=[];}
    function drawMarkers(){
      removeMarkers();if(!session.suspended||!api.state.map)return;
      for(const key of ['start','end'])if(flight[key]){
        const element=document.createElement('div');element.className='script-camera-marker is-'+key;element.setAttribute('role','img');element.setAttribute('aria-label',`${key==='start'?'Start':'End'} camera location`);
        element.innerHTML=icon('camera')+`<span>${key==='start'?'Start':'End'}</span>`;
        session.markers.push(new window.maplibregl.Marker({element,anchor:'bottom'}).setLngLat(flight[key].center).addTo(api.state.map));
      }
    }
    function update(){
      const custom=$('scriptValue').value==='flight';$('scriptCameraFlight').hidden=!custom;
      $('scriptCameraStartSummary').textContent=describe(flight.start);$('scriptCameraEndSummary').textContent=describe(flight.end);
      const valid=validFlight();$('scriptCameraPreview').disabled=!valid;
      dialog.querySelector('[data-apply]').disabled=custom&&!valid;
      if(session.toolbar){
        const status=session.toolbar.querySelector('[data-camera-status]');
        status.textContent=session.preview?'Previewing camera flight…':session.selected?`Click the map to set ${session.selected}. Pan, zoom or tilt before clicking.`:'Point captured. Pick another point or return to Camera Action.';
        for(const key of ['start','end'])session.toolbar.querySelector(`[data-camera-pick="${key}"]`).setAttribute('aria-pressed',String(session.selected===key));
        session.toolbar.querySelector('[data-camera-stop-preview]').hidden=!session.preview;
        session.toolbar.querySelectorAll('[data-camera-pick]').forEach(node=>node.disabled=Boolean(session.preview));
      }
    }
    function stopPick(){session.pickCleanup?.();session.pickCleanup=null;session.selected=null;}
    function restoreSidebar(){
      if(session.sidebarVisible!==null){window.GeoGlyphMapSidebar?.setVisible(session.sidebarVisible);session.sidebarVisible=null;}
      panel.inert=false;
    }
    function returnToModal(){
      if(cameraSession!==session||session.disposed)return;
      stopPick();session.preview?.abort();session.preview=null;
      session.toolbar?.remove();session.toolbar=null;removeMarkers();api.setCameraAuthoring(false);
      session.suspended=false;restoreSidebar();
      if(!dialog.open)dialog.showModal();update();
      $('scriptCameraPick'+(session.returnFocus==='end'?'End':'Start')).focus({preventScroll:true});
    }
    function suspend(){
      if(cameraSession!==session||session.disposed)return;
      if(!api.state.previewActive||!api.state.mapReady)throw Error('Open the map and wait until it is ready');
      if(!original)original=api.captureCameraView();
      if(!session.suspended){
        session.suspended=true;api.setCameraAuthoring(true);panel.inert=true;
        const sidebar=window.GeoGlyphMapSidebar;
        if(sidebar){session.sidebarVisible=sidebar.state().visible;sidebar.setVisible(false);}
        if(dialog.open)dialog.close();
        const toolbar=document.createElement('div');toolbar.id='scriptCameraToolbar';toolbar.className='script-camera-toolbar';toolbar.setAttribute('role','region');toolbar.setAttribute('aria-label','Camera flight map editor');
        toolbar.innerHTML=`<p data-camera-status role="status" aria-live="polite"></p><div class="script-camera-toolbar-actions">
          ${button('camera','Pick Start','data-camera-pick="start"')}${button('camera','Pick End','data-camera-pick="end"')}
          ${button('panel','Return to Camera Action','data-camera-return')}${button('close','Cancel','data-camera-cancel')}
          ${button('stop','Stop Preview','data-camera-stop-preview hidden')}
        </div>`;
        $('geoglyphMapWorkspace').append(toolbar);session.toolbar=toolbar;
        toolbar.querySelectorAll('[data-camera-pick]').forEach(node=>node.onclick=()=>pick(node.dataset.cameraPick));
        toolbar.querySelector('[data-camera-return]').onclick=returnToModal;
        toolbar.querySelector('[data-camera-cancel]').onclick=close;
        toolbar.querySelector('[data-camera-stop-preview]').onclick=returnToModal;
      }
      drawMarkers();update();
    }
    function pick(key){
      try{
        session.preview?.abort();session.preview=null;stopPick();session.returnFocus=key;suspend();session.selected=key;
        session.pickCleanup=api.pickCameraView({onPick:view=>{
          if(cameraSession!==session||session.disposed)return;
          flight[key]=JSON.parse(JSON.stringify(view));stopPick();drawMarkers();update();
          session.toolbar?.querySelector('[data-camera-return]')?.focus({preventScroll:true});
        },onCancel:close});
        update();session.toolbar.querySelector(`[data-camera-pick="${key}"]`).focus({preventScroll:true});
      }catch(reason){returnToModal();report(reason);}
    }
    session.dispose=restore=>{
      session.disposed=true;stopPick();session.preview?.abort();session.preview=null;
      session.toolbar?.remove();session.toolbar=null;removeMarkers();api.setCameraAuthoring(false);restoreSidebar();
      if(restore&&original)api.restoreCameraView(original);
    };
    $('scriptValue').onchange=update;$('scriptCameraDuration').oninput=update;
    $('scriptCameraPickStart').onclick=()=>pick('start');$('scriptCameraPickEnd').onclick=()=>pick('end');
    $('scriptCameraPreview').onclick=async()=>{
      const controller=new AbortController();
      try{
        const action=validateAction({type:'camera',value:readValue()});
        stopPick();session.preview=controller;
        suspend();update();session.toolbar.querySelector('[data-camera-stop-preview]').focus({preventScroll:true});
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        if(cameraSession!==session||controller.signal.aborted)return;
        await api.playCameraFlight(action.value,{signal:controller.signal,isCurrent:()=>cameraSession===session&&!session.disposed&&!controller.signal.aborted});
      }catch(reason){if(reason.name!=='AbortError'&&cameraSession===session)report(reason);}
      finally{if(cameraSession===session&&session.preview===controller){session.preview=null;returnToModal();}}
    };
    dialog.querySelector('[data-cancel]').onclick=close;
    const remove=dialog.querySelector('[data-remove]');if(remove)remove.onclick=()=>{
      try{const draft=service.getDraft(),row=draft.rows.find(row=>row.id===rowId);if(!row)throw Error('Script row no longer exists');row.actions=row.actions.filter(action=>action.type!=='camera');service.setDraft(draft);close();}catch(reason){report(reason);}
    };
    dialog.querySelector('[data-apply]').onclick=()=>{
      try{
        const action=validateAction({type:'camera',value:readValue()}),draft=service.getDraft(),row=draft.rows.find(row=>row.id===rowId);
        if(!row)throw Error('Script row no longer exists');const index=row.actions.findIndex(action=>action.type==='camera');
        if(index<0)row.actions.push(action);else row.actions[index]=action;
        service.setDraft(draft);finishCamera(false);close();
      }catch(reason){report(reason);}
    };
    update();$('scriptValue').focus();
  }
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&cameraSession?.suspended){event.preventDefault();close();}},{capture:true});
  document.addEventListener('geoglyph:map-exit',()=>{if(cameraSession)close();});
  new MutationObserver(()=>{if(cameraSession&&!window.GeoGlyphMapEngine.state.previewActive)close();}).observe(document.body,{attributes:true,attributeFilter:['class']});
  async function openConfig(rowId,type){
    const version=++modalVersion,row=service.getDraft().rows.find(r=>r.id===rowId),existing=row.actions.find(a=>a.type===type),value=existing?.value,s=window.GeoGlyphMapEngine.state;
    modal={rowId,type};let body='',readValue,colourPicker;
    if(type==='camera'){openCameraConfig(rowId,existing);return;}
    if(type==='font'||type==='morph'){
      shell('Loading fonts', '<p role="status">Preparing available fonts…</p>',button('close','Cancel','data-cancel'));
      dialog.querySelector('[data-cancel]').onclick=close;
      try{await window.GeoGlyphFontMorph.ensureBuiltins();}catch(reason){if(version===modalVersion)dialog.querySelector('.script-dialog-body').textContent=reason.message;return;}
      if(version!==modalVersion||!dialog.open)return;
    }
    if(type==='font'){
      let chosen;
      try{if(value)chosen=service.resolveFont(value);}catch{}
      body=field('Search fonts','<input id="scriptFontSearch" type="search" placeholder="Font name…">')+'<div class="script-font-list" role="group" aria-label="Available fonts"></div>';
      readValue=()=>{if(!chosen)throw Error('Choose a font');return service.fontIdentity(chosen);};
      shell('Font',body,footer(existing));
      const list=dialog.querySelector('.script-font-list');
      function fonts(){
        const search=$('scriptFontSearch').value.toLowerCase(),all=[...s.fontRecords.values()].filter(r=>`${r.name} ${r.family}`.toLowerCase().includes(search));
        list.replaceChildren();
        for(const record of all.slice(0,100)){
          const choice=document.createElement('button');choice.type='button';choice.className='script-font-choice';
          choice.setAttribute('aria-pressed',String(chosen?.id===record.id));
          const preview=document.createElement('span');preview.textContent=record.name;preview.style.fontFamily=JSON.stringify(record.cssFamily||record.family||'sans-serif');
          const badge=document.createElement('small'),status=window.GeoGlyphMapEngine.fontCompatibility(record.id);
          badge.textContent=record.hasColor||/emoji/i.test(record.name)?'2D':status==='compatible'?'Both':'2D · 3D not checked';
          choice.append(preview,badge);choice.onclick=()=>{chosen=record;list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));};list.append(choice);
        }
        if(all.length>100){const note=document.createElement('p');note.textContent=`Showing 100 of ${all.length} fonts. Refine the search.`;list.append(note);}
      }
      $('scriptFontSearch').oninput=fonts;fonts();
    }else{
      if(type==='mode'){body=field('Rendering',select('scriptValue',[['2d','2D'],['3d','3D']],value||'2d'));readValue=()=>$('scriptValue').value;}
      else if(type==='animation'){body=field('Animation',select('scriptValue',[['none','Stop animation'],['fixed','Orbit'],['yaw','Turn toward camera'],['billboard','Face camera']],value||'fixed'));readValue=()=>$('scriptValue').value;}
      else if(type==='colour'){
        body=field('Destination',select('scriptColourTarget',[['fill','Fill'],['outline','Outline']],value?.fill?'fill':value?.outline?'outline':'fill'))+
          field('Colour','<input id="scriptColourValue" type="color">')+'<div id="scriptColourPicker"></div>';
        readValue=()=>({...value,[$('scriptColourTarget').value]:$('scriptColourValue').value});
      }else if(type==='morph'){
        const fonts=[...s.fontRecords.values()].filter(r=>r.fontResourceKey?.startsWith('conference:')&&!r.hasColor&&!/emoji/i.test(r.name));
        const choices=fonts.map(r=>[r.id,r.name]);let from,to;try{from=value&&service.resolveFont(value.from).id;to=value&&service.resolveFont(value.to).id;}catch{}
        body=field('From font',select('scriptMorphFrom',choices,from||fonts[0]?.id))+
          field('To font',select('scriptMorphTo',choices,to||fonts[1]?.id))+
          field('Morph duration (s)',input('scriptValue',value?.duration??2,.25,30))+
          field('Target message (optional)',`<textarea id="scriptMorphMessage" rows="3" maxlength="2000" placeholder="Leave blank to keep the same text">${esc(value?.targetMessage||'')}</textarea>`);
        readValue=()=>{
          const targetMessage=$('scriptMorphMessage').value;
          const from=service.fontIdentity(s.fontRecords.get($('scriptMorphFrom').value));
          const to=service.fontIdentity(s.fontRecords.get($('scriptMorphTo').value));
          return {from,to,duration:Number($('scriptValue').value),...(targetMessage.trim()?{targetMessage}:{})};
        };
      }else if(type==='size'){
        body=field('Height (m)',input('scriptValue',value?.height??s.baseHeightMeters,1,300000))+field('Depth (m)',input('scriptDepth',value?.depth??s.extrusionDepthMeters??30,.1,100000));
        readValue=()=>({height:Number($('scriptValue').value),depth:Number($('scriptDepth').value)});
      }else if(type==='location'){
        body=field('Latitude',input('scriptLatitude',value?.lat??s.anchor.lat,-85.051129,85.051129))+
          field('Longitude',input('scriptLongitude',value?.lng??s.anchor.lng,-180,180))+
          field('Caption at the top',`<input id="scriptLocationCaption" maxlength="2000" value="${esc(value?.caption)}">`)+
          field('Camera move',select('scriptLocationMove',[['ease','Ease'],['jump','Jump']],value?.instant?'jump':'ease'))+
          field('Maximum fit zoom (optional)',input('scriptLocationMaxZoom',value?.maxZoom??'',0,24))+
          field('Camera bearing (optional)',input('scriptLocationBearing',value?.cameraBearing??'',-360,360));
        readValue=()=>{
          const caption=$('scriptLocationCaption').value;
          const maxZoom=$('scriptLocationMaxZoom').value;
          const cameraBearing=$('scriptLocationBearing').value;
          return {lng:$('scriptLongitude').valueAsNumber,lat:$('scriptLatitude').valueAsNumber,
            ...(caption||value?.caption!==undefined?{caption}:{}),...($('scriptLocationMove').value==='jump'?{instant:true}:{}),
            ...(maxZoom!==''?{maxZoom:Number(maxZoom)}:{}),...(cameraBearing!==''?{cameraBearing:Number(cameraBearing)}:{})};
        };
      }else if(type==='mirror'||type==='fit'){
        body=field(type==='mirror'?'Mirror horizontally':'Fit geometry',select('scriptValue',[['true','On'],['false','Off']],String(value??true)));readValue=()=>$('scriptValue').value==='true';
      }else if(type==='title'){
        body=field('Overlay text (empty removes title)',`<textarea id="scriptValue" rows="3" maxlength="2000">${esc(value||'')}</textarea>`);readValue=()=>$('scriptValue').value;
      }else{
        const range={depth:[.1,100000,s.extrusionDepthMeters??30],tilt:[0,90,s.extrusionTilt],bearing:[-360,360,s.bearing],wait:[0,3600,5]}[type];
        body=field(type==='wait'?'Additional wait (s)':actionTypes[type][0],input('scriptValue',value??range[2],range[0],range[1]));readValue=()=>Number($('scriptValue').value);
      }
      shell(actionTypes[type][0],body,footer(existing));
      if(type==='colour'){
        const syncColour=()=>{$('scriptColourValue').value=value?.[$('scriptColourTarget').value]||s[$('scriptColourTarget').value];colourPicker?.sync();};
        syncColour();colourPicker=window.GeoGlyphColourPicker.mount($('scriptColourPicker'),()=>({key:'script-'+$('scriptColourTarget').value,label:'Script colour',input:$('scriptColourValue')}));
        $('scriptColourValue').oninput=()=>colourPicker.sync();$('scriptColourTarget').onchange=syncColour;
      }
    }
    dialog.querySelector('[data-cancel]').onclick=close;
    const remove=dialog.querySelector('[data-remove]');if(remove)remove.onclick=()=>{edit(draft=>{const row=draft.rows.find(r=>r.id===rowId);row.actions=row.actions.filter(a=>a.type!==type);});close();};
    dialog.querySelector('[data-apply]').onclick=()=>{
      try{
        const action=validateAction({type,value:readValue()});
        const draft=service.getDraft(),row=draft.rows.find(r=>r.id===rowId),index=row.actions.findIndex(a=>a.type===type);
        if(index<0)row.actions.push(action);else row.actions[index]=action;
        service.setDraft(draft);close();
      }catch(reason){dialog.querySelector('.script-dialog-error').textContent=reason.message;}
    };
    dialog.querySelector('input,select,textarea')?.focus();
  }
  function footer(existing){return (existing?button('trash','Remove action','data-remove'):'')+button('close','Cancel','data-cancel')+button('check','Apply','data-apply');}
  panel.addEventListener('input',event=>{
    if(event.target.id==='mapScriptTitle')edit(draft=>{draft.title=event.target.value;});
    if(event.target.matches('.script-message')){const id=event.target.closest('[data-row-id]').dataset.rowId;edit(draft=>{draft.rows.find(r=>r.id===id).message=event.target.value;});grow(event.target);}
  });
  panel.addEventListener('change',event=>{
    if(event.target.closest('.script-duration')){const id=event.target.closest('[data-row-id]').dataset.rowId;edit(draft=>{draft.rows.find(r=>r.id===id).duration=Number(event.target.value);});}
  });
  panel.addEventListener('click',event=>{
    const trigger=event.target.closest('button'),node=trigger?.closest('[data-row-id]');if(!trigger||!node)return;
    const id=node.dataset.rowId,row=service.getDraft().rows.find(r=>r.id===id);
    if(trigger.hasAttribute('data-add-action'))openMenu(id,trigger);
    if(trigger.hasAttribute('data-edit-action')){opener=trigger;openerRowId=id;openConfig(id,row.actions[Number(trigger.dataset.editAction)].type);}
    if(trigger.hasAttribute('data-select-row'))service.select(service.getDraft().rows.findIndex(r=>r.id===id));
    if(trigger.dataset.rowCommand)edit(draft=>{
      const index=draft.rows.findIndex(r=>r.id===id),command=trigger.dataset.rowCommand;
      if(command==='delete')draft.rows.splice(index,1);
      else if(command==='copy')draft.rows.splice(index+1,0,{...draft.rows[index],id:service.newRow().id});
      else if(command==='above'||command==='below')draft.rows.splice(index+(command==='below'?1:0),0,service.newRow());
      else {const next=index+(command==='up'?-1:1);if(next>=0&&next<draft.rows.length)[draft.rows[index],draft.rows[next]]=[draft.rows[next],draft.rows[index]];}
    });
  });
  $('mapScriptNew').onclick=()=>{localError='';service.newScript();};$('mapScriptReset').onclick=()=>{localError='';service.reset();};
  $('mapScriptAddRow').onclick=()=>edit(draft=>draft.rows.push(service.newRow()));
  $('mapScriptLoad').onclick=()=>$('mapScriptFile').click();
  $('mapScriptFile').onchange=async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>5*1024*1024)throw Error('Script file exceeds 5 MiB');const draft=service.parse(await file.text());localError='';service.setDraft(draft);}catch(reason){error(reason.message);}finally{event.target.value='';}
  };
  $('mapScriptSave').onclick=()=>{
    const blob=new Blob([service.serialize()],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=(service.getDraft().title.replace(/[^a-z\d_-]/gi,'-')||'geoglyph-script')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  $('mapScriptPlay').onclick=()=>{localError='';const s=service.state();if(s.running){s.paused?service.resume():service.pause();}else service.play().catch(reason=>error(reason.message));};
  $('mapScriptNext').onclick=()=>{localError='';Promise.resolve(service.next()).catch(reason=>error(reason.message));};
  $('mapScriptStop').onclick=()=>service.stop();
  document.addEventListener('geoglyph:script-changed',render);render();
}
