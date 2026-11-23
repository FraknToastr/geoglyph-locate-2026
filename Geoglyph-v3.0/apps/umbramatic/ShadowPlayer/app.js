/* Shadow / Time — vanilla JavaScript; no bundler or server required for selected local files.
   MapLibre GL JS is loaded from a pinned public CDN in index.html.
   Image world files are GIS companions; MapLibre consumes the manifest coordinates. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const buttonSkin = 'ambient amb-surface amb-chamfer amb-elevation-1 umbramatic-control';
  const lightingRoot = document.documentElement;
  const compactLayout = window.matchMedia('(max-width: 800px)');
  const blankBackground = () => getComputedStyle(lightingRoot).getPropertyValue('--blank-map').trim() || '#d8dde5';
  const rasterImages = ShadowRasterImages.create();
  const state = {
    map: null, mapReady: false, manifest: null, frames: [], allFrames: [], selected: 0,
    playing: false, speed: 1, playbackMode: 'loop', direction: 1, opacity: 1,
    basemap: 'none', timer: null, frameJob: null, tileSources: new Map(),
    localFiles: null, rootUrl: null, importVersion: 0,
    shadowColour: null, jpegMask: false,
    focusedDate: '', loading: false, defaultFitted: false,
  };
  const solarDialog = $('solarConsole');
  const solar = ShadowSolar.create({onSelectFrame(index){
    pause();
    state.direction = 1;
    void showFrame(index);
  }});
  let referencesVisible = true;
  const mapEmpty = {version:8, sources:{}, layers:[
    {id:'background',type:'background',paint:{'background-color':blankBackground()}}
  ]};
  const esriServices = 'https://server.arcgisonline.com/ArcGIS/rest/services';
  const canvasAttribution = 'Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS user community';
  const novaStyleUrl = 'https://cdn.arcgis.com/sharing/rest/content/items/1237385e55d9487489fe2a21766b43bb/resources/styles/root.json';
  const esriRaster = (service, maxzoom, attribution) => ({
    type:'raster', tiles:[`${esriServices}/${service}/MapServer/tile/{z}/{y}/{x}`], tileSize:256, maxzoom, attribution,
  });
  const rasterBasemap = sources => ({
    sources,
    layers:Object.keys(sources).map(id=>({id,type:'raster',source:id,paint:{'raster-opacity':1,'raster-fade-duration':0}})),
  });
  const rasterBasemaps = {
    none: rasterBasemap({}),
    light: rasterBasemap({
      'light-gray-base':esriRaster('Canvas/World_Light_Gray_Base',23,canvasAttribution),
      'light-gray-labels':esriRaster('Canvas/World_Light_Gray_Reference',23,canvasAttribution),
    }),
    aerial: rasterBasemap({'base-tiles':esriRaster('World_Imagery',19,'Imagery © Esri and contributors')}),
  };
  const basemapBackgrounds = {dark:'#011222',light:'#f2f2f2',aerial:'#0c1d2d'};
  let displayedBasemap = rasterBasemaps.none;
  let requestedBasemap = 'none';
  let basemapRequest = 0;
  let novaStyleRequest;
  const formatLong = (iso) => {
    if (!iso) return 'UNKNOWN DATE';
    const parts = iso.split('-');
    if (parts.length !== 3) return iso;
    const date = new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]), 12);
    return date.toLocaleDateString('en-AU',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).toUpperCase();
  };
  const normalPath = (path) => {
    if (typeof path !== 'string') throw new Error('Invalid image path in manifest.');
    const cleaned = path.replace(/\\/g,'/');
    if (/^(?:[a-z]+:|\/)/i.test(cleaned) || cleaned.split('/').some(x => x === '..')) {
      throw new Error('Image paths must be relative to the export folder.');
    }
    return cleaned.replace(/^\.\//,'');
  };
  const fmt = (v,unit='°') => v==null || v==='' || !Number.isFinite(Number(v)) ? '—' : `${Number(v).toFixed(1)}${unit}`;
  let toastTimer = null;
  function toast(message, error=false, ms=5200){
    const box=$('toast'); box.textContent=String(message); box.hidden=false;
    box.style.borderColor=error?'#b47673':'rgba(197,225,239,.25)';
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>box.hidden=true,ms);
  }
  const status = (message, isError=false) => { $('timelineSubtitle').textContent=message; if(isError)toast(message,true,9000); };
  const frameTileKey = (tile) => `r${tile.row??0}_c${tile.column??0}`;
  const mapLayerId = (key) => `shadow-layer-${key}`;
  const mapSourceId = (key) => `shadow-source-${key}`;

  function initMap(){
    if (!window.maplibregl) {
      status('MapLibre could not load. Internet access to unpkg.com is required for the map library.',true);
      return;
    }
    try {
      state.map = new maplibregl.Map({container:'map',style:mapEmpty,center:[138.6007,-34.9286],zoom:12,
        maxZoom:22,attributionControl:true,fadeDuration:0,preserveDrawingBuffer:false});
      state.map.addControl(new maplibregl.NavigationControl({showCompass:true,visualizePitch:false}),'top-left');
      state.map.on('load',()=>{
        state.mapReady=true; void applyBasemap(requestedBasemap);
        if(state.frames.length) showFrame(state.selected,true);
      });
      state.map.on('error',e=>{
        const err=e?.error?.message||'';
        if(err && !err.includes('Failed to fetch') && !err.includes('NetworkError')) console.warn('MapLibre:',err);
      });
    }catch(e){status('Unable to initialize MapLibre: '+e.message,true);}
  }
  function loadNovaBasemap(){
    novaStyleRequest ??= fetch(novaStyleUrl,{signal:AbortSignal.timeout(12_000)}).then(async response=>{
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const {version,sprite,glyphs,sources,layers} = await response.json();
      if(version!==8 || !sprite || !glyphs || !sources || !Array.isArray(layers) || !layers.length){
        throw new Error('ArcGIS did not return the Nova vector style.');
      }
      return {
        sprite:new URL(sprite,novaStyleUrl).href,
        glyphs:new URL(glyphs,novaStyleUrl).href.replace(/%7B(fontstack|range)%7D/g,'{$1}'),
        sources:Object.fromEntries(Object.entries(sources).map(([id,{url,...source}])=>{
          const service = new URL(url,novaStyleUrl).href.replace(/\/$/,'');
          return [`nova-${id}`,{...source,tiles:[`${service}/tile/{z}/{y}/{x}.pbf`],maxzoom:22,
            attribution:'Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community'}];
        })),
        layers:layers.map(({id,source,...layer})=>({
          ...layer,id:`nova-${id}`,...(source && {source:`nova-${source}`}),
        })),
      };
    }).catch(error=>{
      novaStyleRequest=undefined;
      throw error;
    });
    return novaStyleRequest;
  }
  function removeBasemap(basemap){
    const map = state.map;
    for(const {id} of basemap.layers)if(map.getLayer(id))map.removeLayer(id);
    for(const id of Object.keys(basemap.sources))if(map.getSource(id))map.removeSource(id);
  }
  function referenceLayerIds(basemap){
    return basemap?.layers.filter(layer=>layer.id==='light-gray-labels' || layer.type==='symbol').map(layer=>layer.id) ?? [];
  }
  function applyReferenceVisibility(basemap=displayedBasemap){
    if(!state.mapReady)return;
    const ids=referenceLayerIds(basemap);
    for(const id of ids)if(state.map.getLayer(id))state.map.setLayoutProperty(id,'visibility',referencesVisible?'visible':'none');
  }
  function updateReferencesControl(){
    const button=$('basemapReferences');
    const available=referenceLayerIds(displayedBasemap).length>0;
    button.disabled=!available;
    button.setAttribute('aria-pressed',String(available&&referencesVisible));
    button.dataset.tooltip=available
      ? `${referencesVisible?'Hide':'Show'} the selected basemap's reference layer.`
      : 'This basemap has no separate reference layer.';
  }
  async function applyBasemap(choice){
    requestedBasemap=choice;
    if(!state.mapReady)return;
    const request = ++basemapRequest;
    if(choice===state.basemap){updateMapBackground();return;}
    const map = state.map;
    let next;
    try{
      next = choice==='dark' ? await loadNovaBasemap() : rasterBasemaps[choice];
      if(request!==basemapRequest)return;
      if(next.glyphs && map.getGlyphs()!==next.glyphs)map.setGlyphs(next.glyphs);
      if(next.sprite && !map.getSprite().length)map.setSprite(next.sprite);
      for(const [id,source] of Object.entries(next.sources))map.addSource(id,source);
      // Insert under the capture images so a basemap switch leaves playback running.
      const firstTile = state.tileSources.keys().next().value;
      const before = firstTile === undefined ? undefined : mapLayerId(firstTile);
      for(const layer of next.layers){
        map.addLayer(layer,before);
        if(!map.getLayer(layer.id))throw new Error(`Could not add ${layer.id}.`);
      }
    }catch(error){
      if(request!==basemapRequest)return;
      if(next)removeBasemap(next);
      const label = choice==='dark' ? 'Nova' : choice==='light' ? 'Light Gray Canvas' : 'the basemap';
      toast(`Unable to load ${label} · ${error.message}`,true);
      return;
    }
    removeBasemap(displayedBasemap);
    displayedBasemap=next;
    state.basemap=choice;
    document.querySelector('.main-view').dataset.basemap=choice;
    document.querySelectorAll('button[data-basemap]').forEach(button=>selectButton(button,button.dataset.basemap===choice));
    applyReferenceVisibility(displayedBasemap);
    updateReferencesControl();
    updateMapBackground();
  }
  function updateMapBackground(){
    if(state.mapReady)state.map.setPaintProperty('background','background-color',basemapBackgrounds[state.basemap]??blankBackground());
  }
  function applyOpacity(){
    if(!state.mapReady)return;
    for(const key of state.tileSources.keys()){
      const layer=mapLayerId(key);
      if(state.map.getLayer(layer))state.map.setPaintProperty(layer,'raster-opacity',state.opacity);
    }
  }
  function removeMapTile(key){
    if(state.map.getLayer(mapLayerId(key)))state.map.removeLayer(mapLayerId(key));
    if(state.map.getSource(mapSourceId(key)))state.map.removeSource(mapSourceId(key));
    const url = state.tileSources.get(key);
    if(url) URL.revokeObjectURL(url);
    state.tileSources.delete(key);
  }
  function tileInput(tile){
    if(tile.direct_url){
      const url = new URL(tile.direct_url, document.baseURI).href;
      return [url,url];
    }
    const key=normalPath(tile.path);
    if(state.localFiles){
      const file=state.localFiles.get(key);
      if(!file)throw new Error(`Image not found in selected folder: ${key}`);
      return [key,file];
    }
    if(!state.rootUrl)throw new Error('No loaded image folder or hosted URL.');
    return [key,new URL(key,state.rootUrl).href];
  }

  async function mapImages(tiles, signal){
    const finish = { colour: state.shadowColour, jpegMask: state.jpegMask };
    const images = new Array(tiles.length);
    const parallel = Math.min(finish.colour ? 4 : 8, tiles.length);
    let next = 0;
    async function prepareTiles(){
      while(next < tiles.length){
        signal.throwIfAborted();
        const index = next++;
        const [key,image] = tileInput(tiles[index]);
        images[index] = await rasterImages.read(key, image, finish, signal);
      }
    }
    await Promise.all(Array.from({length:parallel},prepareTiles));
    signal.throwIfAborted();

    const active = new Set();
    for(const [index,tile] of tiles.entries()){
      const key = frameTileKey(tile), sid = mapSourceId(key), lid = mapLayerId(key);
      const source = state.map.getSource(sid);
      const image = images[index];
      const objectUrl = typeof image === 'string' ? null : URL.createObjectURL(image);
      const url = objectUrl ?? image;
      try {
        // MapLibre 5.13 expects a URL. Keep displayed URLs alive independently of cache eviction.
        if(source) source.updateImage({url,coordinates:tile.coordinates});
        else {
          if(state.map.getLayer(lid))state.map.removeLayer(lid);
          state.map.addSource(sid,{type:'image',url,coordinates:tile.coordinates});
          state.map.addLayer({id:lid,type:'raster',source:sid,
            paint:{'raster-opacity':state.opacity,'raster-fade-duration':0}});
        }
      } catch(error) {
        if(objectUrl) URL.revokeObjectURL(objectUrl);
        throw error;
      }
      const previousUrl = state.tileSources.get(key);
      if(previousUrl) URL.revokeObjectURL(previousUrl);
      state.tileSources.set(key,objectUrl);
      active.add(key);
    }
    for(const key of state.tileSources.keys()){
      if(!active.has(key)) removeMapTile(key);
    }
  }

  function allCorners(){
    const frame=state.allFrames[0];
    if(!frame)return null;
    const corners=frame.tiles.flatMap(t=>t.coordinates);
    if(!corners.length)return null;
    return [[Math.min(...corners.map(v=>v[0])),Math.min(...corners.map(v=>v[1]))],
            [Math.max(...corners.map(v=>v[0])),Math.max(...corners.map(v=>v[1]))]];
  }
  function fit(){
    if(!state.mapReady)return;
    const bounds=allCorners();
    if(!bounds)return;
    const viewport = $('map').getBoundingClientRect();
    const panel = $('controlsPanel').getBoundingClientRect();
    const player = $('mediaPlayer').getBoundingClientRect();
    const inset = Math.min(50, viewport.width * .12);
    const sidebarBesideMap = panel.width && (player.width ? panel.right <= player.left : panel.width < viewport.width * .6);
    const left = inset + (sidebarBesideMap ? panel.right - viewport.left : 0);
    const padding = {
      top: Math.min(105, viewport.height * .23),
      bottom: Math.min(player.height ? viewport.bottom - player.top + 24 : 46, viewport.height * .5),
      left: Math.min(left, viewport.width * .65),
      right: inset,
    };
    state.map.fitBounds(bounds,{padding,maxZoom:18,duration:500});
  }
  function setPanelHidden(hidden){
    const restoreFocus = hidden && $('controlsPanel').contains(document.activeElement);
    const toggle = $('togglePanel');
    document.body.classList.toggle('panel-hidden',hidden);
    toggle.setAttribute('aria-expanded',String(!hidden));
    if(restoreFocus)toggle.focus({preventScroll:true});
  }
  function setPlayerHidden(hidden){
    const player = $('mediaPlayer');
    const restoreFocus = hidden && player.contains(document.activeElement);
    const toggle = $('togglePlayer');
    player.hidden = hidden;
    toggle.setAttribute('aria-expanded', String(!hidden));
    toggle.dataset.tooltip = hidden ? 'Show the media player.' : 'Hide the media player.';
    if(restoreFocus) toggle.focus({preventScroll:true});
  }
  function setShadowColour(colour){
    if(state.shadowColour === colour) return;
    state.shadowColour = colour;
    $('resetShadowColour').disabled = colour === null;
    if(colour === null) $('shadowColour').value = $('shadowColour').defaultValue;
    void showFrame(state.selected);
  }
  function updateFrameUI(){
    const frame=state.frames[state.selected];
    if(!frame)return;
    $('heroTime').textContent=frame.time||frame.local_datetime.slice(11,16);
    $('heroDate').textContent=formatLong(frame.date);
    $('solarAz').textContent=fmt(frame.solar_azimuth_deg);
    $('solarAlt').textContent=fmt(frame.solar_altitude_deg);
    $('captureIndex').textContent=`${state.selected+1} / ${state.frames.length}`;
    $('scrubber').max=Math.max(0,state.frames.length-1);$('scrubber').value=state.selected;
    $('firstLabel').textContent=state.frames[0].time;
    $('lastLabel').textContent=state.frames[state.frames.length-1].time;
    $('timelineCaption').textContent=`${frame.date}  ·  ${frame.time}`;
    $('timelineSubtitle').textContent=`${frame.tiles.length} georeferenced image ${frame.tiles.length===1?'tile':'tiles'} · ${state.speed}× speed`;
    $('frameHint').textContent=`FRAME ${state.selected+1} OF ${state.frames.length}`;
    if(solarDialog.open) solar.render(state.frames, state.selected);
  }
  async function showFrame(idx, initial=false){
    if(!state.frames.length)return false;
    const count=state.frames.length;
    state.selected=Math.max(0,Math.min(count-1,idx));
    stopTimer();
    state.frameJob?.abort();
    updateFrameUI();
    if(!state.mapReady)return false;
    const job = new AbortController();
    state.frameJob = job;
    const frame=state.frames[state.selected];
    try{
      await mapImages(frame.tiles,job.signal);
      if(job.signal.aborted)return false;
      $('emptyState').hidden=true;
      if(initial || !state.defaultFitted){fit();state.defaultFitted=true;}
      return true;
    }catch(e){
      if(!job.signal.aborted){
        job.abort();
        status('Cannot display '+frame.local_datetime+': '+e.message,true);
        pause();
      }
      return false;
    }finally{
      if(state.frameJob === job){
        state.frameJob = null;
        schedulePlayback();
      }
    }
  }
  function stopTimer(){if(state.timer!==null){clearTimeout(state.timer);state.timer=null;}}
  function schedulePlayback(){
    stopTimer();
    if(state.playing && state.mapReady && !state.frameJob){
      state.timer=setTimeout(tick,Math.round(650/state.speed));
    }
  }
  function pause(){state.playing=false;stopTimer();$('playPauseGlyph').textContent='▶';$('playPause').setAttribute('aria-label','Play');}
  function nextIndex(){
    let i=state.selected+state.direction;
    if(i>=state.frames.length||i<0){
      if(state.playbackMode==='once'){pause();return null;}
      if(state.playbackMode==='bounce'){
        state.direction*=-1;
        i=state.selected+state.direction;
      }else i=i<0?state.frames.length-1:0;
    }
    return Math.max(0,Math.min(state.frames.length-1,i));
  }
  function tick(){
    state.timer = null;
    if(!state.playing)return;
    const index=nextIndex();
    if(index!=null)void showFrame(index);
  }
  function play(){
    if(!state.frames.length){toast('Open an export folder or load the demo first.');return;}
    if(state.playing){pause();return;}
    if(state.frames.length===1){toast('The selected date has only one capture.');return;}
    state.playing=true;$('playPauseGlyph').textContent='❚❚';$('playPause').setAttribute('aria-label','Pause');
    schedulePlayback();
  }
  function step(direction){pause();state.direction=1;let i=state.selected+direction;
    if(i<0)i=state.frames.length-1;if(i>=state.frames.length)i=0;
    showFrame(i);
  }
  function selectButton(button, selected){
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
  function addControlShadow(control){
    const shadow=document.createElement('span');
    shadow.className='ambient amb-thickness-1 amb-elevation-1 control-drop-shadow';
    shadow.setAttribute('aria-hidden','true');
    control.prepend(shadow);
  }
  function bindTooltips(){
    const tooltip = $('controlTooltip');
    const app = document.querySelector('.app-shell');
    let trigger = null;
    let previousDescription = null;
    let pointer = null;
    let hoveredControl = null;
    let positionFrame = 0;

    function hideTooltip(){
      if(!trigger)return;
      tooltip.hidden=true;
      if(previousDescription===null)trigger.removeAttribute('aria-describedby');
      else trigger.setAttribute('aria-describedby',previousDescription);
      trigger=null;
      pointer=null;
      cancelAnimationFrame(positionFrame);
      positionFrame=0;
    }
    function positionTooltip(){
      const viewport = window.visualViewport;
      const margin = 8;
      const left = (viewport?.offsetLeft ?? 0) + margin;
      const top = (viewport?.offsetTop ?? 0) + margin;
      const right = left + (viewport?.width ?? innerWidth) - 2*margin;
      const bottom = top + (viewport?.height ?? innerHeight) - 2*margin;
      const anchor = trigger.getBoundingClientRect();
      const scroller = trigger.closest('.sidebar, .empty-state, dialog')?.getBoundingClientRect();
      if(!anchor.width || !anchor.height || anchor.bottom<=top || anchor.top>=bottom ||
        (scroller && (anchor.bottom<=scroller.top || anchor.top>=scroller.bottom))){
        hideTooltip();
        return;
      }

      tooltip.style.maxWidth=`${Math.min(272,right-left)}px`;
      tooltip.style.maxHeight=`${bottom-top}px`;
      const { width, height } = tooltip.getBoundingClientRect();
      const gap = pointer ? 42 : 8;
      let x = pointer ? pointer.clientX + gap : anchor.left;
      let y = (pointer?.clientY ?? anchor.bottom) + gap;
      if(pointer && x+width>right)x=pointer.clientX-width-gap;
      if(y+height>bottom)y=(pointer?.clientY ?? anchor.top)-height-gap;
      tooltip.style.left=`${Math.max(left,Math.min(x,right-width))}px`;
      tooltip.style.top=`${Math.max(top,Math.min(y,bottom-height))}px`;
    }
    function schedulePosition(){
      if(!trigger || positionFrame)return;
      positionFrame=requestAnimationFrame(()=>{
        positionFrame=0;
        positionTooltip();
      });
    }
    function showTooltip(control, point = null){
      if(!control.dataset.tooltip)return;
      hideTooltip();
      trigger=control;
      pointer=point;
      previousDescription=control.getAttribute('aria-describedby');
      (control.closest('dialog[open]') || document.body).append(tooltip);
      tooltip.textContent=control.dataset.tooltip;
      tooltip.hidden=false;
      control.setAttribute('aria-describedby',[previousDescription,tooltip.id].filter(Boolean).join(' '));
      positionTooltip();
    }

    // MapLibre creates its toolbar and attribution controls after the page starts.
    const observer = new MutationObserver(()=>{
      if(trigger && (!trigger.isConnected || !trigger.getClientRects().length || getComputedStyle(trigger).visibility==='hidden'))hideTooltip();
      for(const control of app.querySelectorAll('[title]')){
        if(!control.dataset.tooltip)control.dataset.tooltip=control.getAttribute('title');
        control.removeAttribute('title');
      }
    });
    observer.observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['title','hidden','open']});
    observer.observe(document.body,{attributes:true,attributeFilter:['class']});

    document.addEventListener('pointerout',event=>{
      if(hoveredControl?.contains(event.target) && !hoveredControl.contains(event.relatedTarget))hoveredControl=null;
      if(trigger?.contains(event.target) && !trigger.contains(event.relatedTarget))hideTooltip();
    });
    document.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch')return;
      const control = event.target.closest('[data-tooltip]');
      if(control!==hoveredControl){
        hoveredControl=control;
        if(control)showTooltip(control,event);
        else if(pointer)hideTooltip();
      }else if(pointer){
        pointer=event;
        schedulePosition();
      }
    },{passive:true});
    document.addEventListener('focusin',event=>{
      if(event.target.matches('[data-tooltip]:focus-visible'))showTooltip(event.target);
    });
    document.addEventListener('focusout',event=>{
      if(trigger===event.target)hideTooltip();
    });
    document.addEventListener('pointerdown',hideTooltip,{capture:true,passive:true});
    document.addEventListener('pointercancel',hideTooltip);
    document.addEventListener('keydown',event=>{if(event.key==='Escape')hideTooltip();});
    document.addEventListener('scroll',()=>{
      if(pointer && !trigger.contains(document.elementFromPoint(pointer.clientX,pointer.clientY)))hideTooltip();
      else schedulePosition();
    },{capture:true,passive:true});
    document.addEventListener('visibilitychange',hideTooltip);
    window.addEventListener('blur',hideTooltip);
    window.addEventListener('resize',hideTooltip);
    window.visualViewport?.addEventListener('scroll',hideTooltip);
    window.visualViewport?.addEventListener('resize',hideTooltip);
  }
  function bindLighting(){
    const presets = [...document.querySelectorAll('[data-lighting-preset]')];
    const axes = [[$('lightX'),'--amb-light-x'],[$('lightY'),'--amb-light-y']];
    const follow = $('lightFollow');
    let following = false;
    let pointer = null;
    let lightFrame = 0;
    function updatePointerLight(){
      if(!following || !pointer || lightFrame)return;
      lightFrame=requestAnimationFrame(()=>{
        lightFrame=0;
        const direction=(position,size)=>Math.max(-1,Math.min(1,2*position/Math.max(1,size)-1));
        lightingRoot.style.setProperty('--amb-light-x',direction(pointer.clientX,innerWidth).toFixed(3));
        lightingRoot.style.setProperty('--amb-light-y',direction(pointer.clientY,innerHeight).toFixed(3));
      });
    }
    function setFollowing(enabled){
      following=enabled;
      selectButton(follow,following);
      for(const [input,property] of axes){
        input.disabled=following;
        if(!following)lightingRoot.style.setProperty(property,String(input.valueAsNumber/100));
      }
      if(!following){
        cancelAnimationFrame(lightFrame);
        lightFrame=0;
      }
      updatePointerLight();
    }
    setFollowing(follow.getAttribute('aria-pressed')==='true');
    follow.addEventListener('click',()=>setFollowing(!following));
    window.addEventListener('pointermove',event=>{
      if(event.pointerType!=='mouse')return;
      pointer=event;
      updatePointerLight();
    },{passive:true});
    for(const button of presets)button.addEventListener('click',()=>{
      lightingRoot.dataset.lighting=button.dataset.lightingPreset;
      presets.forEach(preset=>selectButton(preset,preset===button));
      axes.forEach(([,property])=>lightingRoot.style.removeProperty(property));
      const lighting=getComputedStyle(lightingRoot);
      axes.forEach(([input,property])=>{input.value=Math.round(Number(lighting.getPropertyValue(property))*100);});
      updatePointerLight();
      if(state.basemap==='none')updateMapBackground();
    });
    for(const [input,property] of axes)input.addEventListener('input',()=>{
      lightingRoot.style.setProperty(property,String(input.valueAsNumber/100));
    });
  }
  function dateChips(){
    const container=$('dateChips');container.replaceChildren();
    const dates=[...new Set(state.allFrames.map(f=>f.date))];
    const all=document.createElement('button');all.type='button';all.className=`chip ${buttonSkin}`;all.textContent=`All (${state.allFrames.length})`;
    all.dataset.tooltip='Show captures from all dates.';
    addControlShadow(all);
    selectButton(all,!state.focusedDate);
    all.addEventListener('click',()=>setDate(''));container.append(all);
    for(const date of dates){
      const button=document.createElement('button');button.type='button';
      button.className=`chip ${buttonSkin}`;
      selectButton(button,state.focusedDate===date);
      button.textContent=date.slice(5).replace('-','/');
      button.dataset.tooltip=formatLong(date);
      addControlShadow(button);
      button.addEventListener('click',()=>setDate(date));container.append(button);
    }
  }
  function setDate(date){
    if(!state.allFrames.length)return;
    pause();state.focusedDate=date;
    state.frames=date?state.allFrames.filter(f=>f.date===date):state.allFrames.slice();
    if(!state.frames.length){state.frames=state.allFrames.slice();state.focusedDate='';toast('No captures on the selected date. Showing all.');}
    $('dateInput').value=state.focusedDate;
    state.direction=1;state.selected=0;dateChips();showFrame(0);
  }
  function validateManifest(data){
    if(!data || data.schema!=='uos-shadow-player-v1'||!Array.isArray(data.frames))
      throw new Error('Not a compatible Shadow Player manifest (schema uos-shadow-player-v1).');
    const frames=data.frames.map(f=>{
      if(!f.local_datetime || !Array.isArray(f.tiles)||!f.tiles.length)throw new Error('A frame is missing its timestamp or image tiles.');
      for(const tile of f.tiles){
        if(!Array.isArray(tile.coordinates)||tile.coordinates.length!==4 || tile.coordinates.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v))))
          throw new Error('Invalid WGS84 coordinates on image tile.');
        if(!tile.direct_url)normalPath(tile.path);
      }
      return {...f,date:f.date||f.local_datetime.slice(0,10),time:f.time||f.local_datetime.slice(11,16)};
    }).sort((a,b)=>a.local_datetime.localeCompare(b.local_datetime));
    if(!frames.length)throw new Error('No frames were found in the export.');
    return frames;
  }
  async function activateDataset(data,{fileMap=null,rootUrl=null}={}){
    const frames=validateManifest(data);
    pause();
    state.frameJob?.abort();
    state.frameJob = null;
    for(const key of state.tileSources.keys()) removeMapTile(key);
    rasterImages.clear();
    state.manifest=data;state.allFrames=frames;state.frames=frames.slice();state.selected=0;
    state.focusedDate='';state.direction=1;state.defaultFitted=false;
    state.localFiles=fileMap;state.rootUrl=rootUrl;
    if(frames[0].tiles.length>80)toast('Large tiled animation: performance may improve by exporting with downsample 2 or 4.',false,7500);
    $('dateInput').value='';
    $('datasetInfo').hidden=false;
    $('datasetTitle').textContent=data.title||'Shadow capture series';
    $('frameCount').textContent=frames.length.toLocaleString('en-AU');
    $('formatLabel').textContent=(data.encoding?.format||'image').toUpperCase();
    const size=data.grid?.native_cell_x;
    $('resolutionLabel').textContent=Number.isFinite(size)?`${size} m`:'—';
    if(data.encoding?.transparent_sunlit===false){state.opacity=.4;$('opacity').value=40;}
    else{state.opacity=1;$('opacity').value=100;}
    $('opacityValue').textContent=`${Math.round(state.opacity*100)}%`;
    state.shadowColour = null;
    state.jpegMask = data.encoding?.transparent_sunlit === false && /^jpe?g$/i.test(data.encoding.format);
    $('shadowColour').disabled = data.encoding?.transparent_sunlit === false && !state.jpegMask;
    $('shadowColour').value = $('shadowColour').defaultValue;
    $('resetShadowColour').disabled = true;
    dateChips();updateFrameUI();applyOpacity();
    $('emptyState').hidden=true;
    if(compactLayout.matches)setPanelHidden(true);
    await showFrame(0,true);
    if(state.manifest===data)toast(`${frames.length} captures loaded · ${data.encoding?.format?.toUpperCase()||'images'}`,false,3400);
  }
  async function openExportFolder(files){
    if(!files || !files.length)return;
    const version = ++state.importVersion;
    const manifests=[...files].filter(file=>file.name==='shadow_player_manifest.json');
    if(!manifests.length){status('No shadow_player_manifest.json in this folder. Choose the complete export folder.',true);return;}
    if(manifests.length>1)toast('Multiple exports found; using the first manifest. Select one export folder for precise control.');
    const manifestFile=manifests[0];
    const full=manifestFile.webkitRelativePath||manifestFile.name;
    const prefix=full.slice(0,full.length-manifestFile.name.length);
    const local=new Map();
    for(const file of files){
      const path=(file.webkitRelativePath||file.name).replace(/\\/g,'/');
      if(path.startsWith(prefix))local.set(path.slice(prefix.length),file);
    }
    try{
      const data=JSON.parse(await manifestFile.text());
      if(version===state.importVersion)await activateDataset(data,{fileMap:local});
    }catch(e){if(version===state.importVersion)status('Unable to open export: '+e.message,true);}
  }
  async function autoLoadHosted(){
    if(location.protocol==='file:')return;
    for(const relative of ['./data/shadow_player_manifest.json','./shadow_player_manifest.json']){
      if(state.importVersion)return;
      try{
        const url=new URL(relative,location.href);
        const response=await fetch(url,{cache:'no-store'});
        if(!response.ok)continue;
        const data=await response.json();
        if(!state.importVersion)await activateDataset(data,{rootUrl:new URL('.',url).href});
        return;
      }catch(err){console.debug('No auto-load export at',relative,err.message);}
    }
  }
  function wireControls(){
    $('openFolder').addEventListener('click',()=>$('folderInput').click());
    $('emptyOpen').addEventListener('click',()=>$('folderInput').click());
    $('folderInput').addEventListener('change',e=>{
      const files = Array.from(e.target.files);
      e.target.value='';
      void openExportFolder(files);
    });
    $('playPause').addEventListener('click',play);
    $('stepBack').addEventListener('click',()=>{if(state.frames.length)step(-1);});
    $('stepForward').addEventListener('click',()=>{if(state.frames.length)step(1);});
    $('scrubber').addEventListener('input',e=>{if(state.frames.length){pause();showFrame(Number(e.target.value));}});
    const speedButtons = $('speedOptions').querySelectorAll('button');
    speedButtons.forEach(button=>{
      button.dataset.tooltip=`Play at ${button.dataset.speed}× speed.`;
      button.addEventListener('click',()=>{
        state.speed=Number(button.dataset.speed);
        speedButtons.forEach(speed=>selectButton(speed,speed===button));
        updateFrameUI();
        schedulePlayback();
      });
    });
    $('clearDate').addEventListener('click',()=>setDate(''));
    $('dateInput').addEventListener('change',e=>setDate(e.target.value));
    document.querySelectorAll('button[data-basemap]').forEach(button=>button.addEventListener('click',()=>{
      void applyBasemap(button.dataset.basemap);
    }));
    $('basemapReferences').addEventListener('click',()=>{
      if($('basemapReferences').disabled)return;
      referencesVisible=!referencesVisible;
      applyReferenceVisibility();
      updateReferencesControl();
    });
    document.querySelectorAll('[data-loop]').forEach(btn=>btn.addEventListener('click',()=>{
      state.playbackMode=btn.dataset.loop;state.direction=1;
      document.querySelectorAll('[data-loop]').forEach(x=>selectButton(x,x===btn));
    }));
    $('opacity').addEventListener('input',e=>{
      state.opacity=Number(e.target.value)/100;
      $('opacityValue').textContent=`${e.target.value}%`;
      applyOpacity();
    });
    $('shadowColour').addEventListener('change',event=>setShadowColour(event.target.value));
    $('resetShadowColour').addEventListener('click',()=>{
      $('shadowColour').focus({preventScroll:true});
      setShadowColour(null);
    });
    $('fitBounds').addEventListener('click',fit);
    $('togglePanel').addEventListener('click',()=>setPanelHidden(!document.body.classList.contains('panel-hidden')));
    $('togglePlayer').addEventListener('click',()=>setPlayerHidden(!$('mediaPlayer').hidden));
    const solarToggle = $('toggleSolar');
    solarToggle.addEventListener('click',()=>{
      solarDialog.showModal();
      solarToggle.setAttribute('aria-expanded','true');
      solar.render(state.frames, state.selected);
    });
    $('minimiseDome').addEventListener('click',()=>solarDialog.close());
    solarDialog.addEventListener('close',()=>{
      if(solarDialog.open) return;
      solarToggle.setAttribute('aria-expanded','false');
      solarToggle.focus({preventScroll:true});
    });
    window.addEventListener('keydown',e=>{
      if(solarDialog.open)return;
      if(e.target instanceof Element && e.target.closest('input, textarea, select, button, a, [contenteditable]')) return;
      if(e.code==='Space'){e.preventDefault();play();}
      else if(e.key==='ArrowRight' && state.frames.length){e.preventDefault();step(1);}
      else if(e.key==='ArrowLeft' && state.frames.length){e.preventDefault();step(-1);}
      else if(e.key.toLowerCase()==='f'){fit();}
    });
  }
  document.querySelectorAll('.ambient-button-group > .umbramatic-control').forEach(addControlShadow);
  wireControls();bindLighting();bindTooltips();initMap();autoLoadHosted();
  // Smoke-test aid; immutable public diagnostics, no hidden app mutation.
  window.shadowPlayerDiagnostics=()=>({mapReady:state.mapReady,frames:state.frames.length,
    allFrames:state.allFrames.length,selected:state.selected,playing:state.playing,
    localFileCount:state.localFiles?.size||0,activeTiles:state.tileSources.size,
    ...rasterImages.stats(),sourceKind:state.manifest?.source_kind||null});
})();
