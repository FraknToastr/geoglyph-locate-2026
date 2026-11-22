/* Shadow / Time — vanilla JavaScript; no bundler or server required for selected local files.
   MapLibre GL JS is loaded from a pinned public CDN in index.html.
   Image world files are GIS companions; MapLibre consumes the manifest coordinates. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const state = {
    map: null, mapReady: false, manifest: null, frames: [], allFrames: [], selected: 0,
    playing: false, speed: 1, playbackMode: 'loop', direction: 1, opacity: 1,
    basemap: 'dark', timer: null, renderToken: 0, tileSources: new Set(),
    localFiles: null, rootUrl: null, memoryCache: new Map(), cacheLimit: 32,
    focusedDate: '', loading: false, demoUrls: [], defaultFitted: false,
  };
  const mapEmpty = {version:8, sources:{}, layers:[
    {id:'background',type:'background',paint:{'background-color':'#0c1d2d'}}
  ]};
  const tileMaps = {
    dark: {url:'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', attribution:'© OpenStreetMap contributors · © CARTO'},
    street: {url:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution:'© OpenStreetMap contributors'},
    aerial: {url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution:'Imagery © Esri and contributors'},
  };
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
      state.map.addControl(new maplibregl.NavigationControl({showCompass:true,visualizePitch:false}),'bottom-right');
      state.map.on('load',()=>{
        state.mapReady=true; applyBasemap();
        if(state.frames.length) showFrame(state.selected,true);
      });
      state.map.on('error',e=>{
        const err=e?.error?.message||'';
        if(err && !err.includes('Failed to fetch') && !err.includes('NetworkError')) console.warn('MapLibre:',err);
      });
    }catch(e){status('Unable to initialize MapLibre: '+e.message,true);}
  }
  function applyBasemap(){
    if(!state.mapReady)return;
    const map=state.map;
    if(map.getLayer('base-tiles'))map.removeLayer('base-tiles');
    if(map.getSource('base-tiles'))map.removeSource('base-tiles');
    if(state.basemap!=='none'){
      const base=tileMaps[state.basemap];
      map.addSource('base-tiles',{type:'raster',tiles:[base.url],tileSize:256,attribution:base.attribution,maxzoom:19});
      // Place the basemap *below* all shadow image layers.
      map.addLayer({id:'base-tiles',type:'raster',source:'base-tiles',paint:{'raster-opacity':1,'raster-fade-duration':0}},
        state.tileSources.size ? mapLayerId([...state.tileSources][0]) : undefined);
    }
    map.setPaintProperty('background','background-color',state.basemap==='none'?'#102235':'#0c1d2d');
  }
  function applyOpacity(){
    if(!state.mapReady)return;
    for(const key of state.tileSources){
      const layer=mapLayerId(key);
      if(state.map.getLayer(layer))state.map.setPaintProperty(layer,'raster-opacity',state.opacity);
    }
  }
  function clearMapTiles(){
    if(!state.mapReady)return;
    for(const key of state.tileSources){
      if(state.map.getLayer(mapLayerId(key)))state.map.removeLayer(mapLayerId(key));
      if(state.map.getSource(mapSourceId(key)))state.map.removeSource(mapSourceId(key));
    }
    state.tileSources.clear();
  }
  function clearObjectUrls(){
    for(const entry of state.memoryCache.values()){
      if(entry.objectUrl) URL.revokeObjectURL(entry.objectUrl);
    }
    state.memoryCache.clear();
    for(const url of state.demoUrls)URL.revokeObjectURL(url);
    state.demoUrls=[];
  }
  async function resolveImage(tile){
    if(tile.direct_url)return tile.direct_url;
    const key=normalPath(tile.path);
    if(state.localFiles){
      const file=state.localFiles.get(key);
      if(!file)throw new Error(`Image not found in selected folder: ${key}`);
      return URL.createObjectURL(file);
    }
    if(!state.rootUrl)throw new Error('No loaded image folder or hosted URL.');
    return new URL(key,state.rootUrl).href;
  }
  async function decodedImage(tile){
    const key=tile.direct_url||normalPath(tile.path);
    const cached=state.memoryCache.get(key);
    if(cached){state.memoryCache.delete(key);state.memoryCache.set(key,cached);return cached.promise;}
    const entry={objectUrl:null,promise:null};
    const task=(async()=>{
      const url=await resolveImage(tile);
      if(state.localFiles && !tile.direct_url) entry.objectUrl=url;
      const img=new Image();
      img.decoding='async';img.crossOrigin='anonymous';img.src=url;
      if(img.decode){await img.decode();}
      else await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Unable to open '+key));});
      // MapLibre 5.13.0 requires a URL on every image-source update; retain
      // that URL alongside the decoded image for validation and caching.
      return {img,url};
    })();
    entry.promise=task;
    state.memoryCache.set(key,entry);
    task.catch(()=>{if(state.memoryCache.get(key)===entry){state.memoryCache.delete(key);if(entry.objectUrl)URL.revokeObjectURL(entry.objectUrl);}});
    while(state.memoryCache.size > state.cacheLimit){
      const oldest=state.memoryCache.keys().next().value;
      if(oldest===key)break;
      const stale=state.memoryCache.get(oldest);state.memoryCache.delete(oldest);
      if(stale.objectUrl)URL.revokeObjectURL(stale.objectUrl);
    }
    return task;
  }
  async function mapImages(tiles, token){
    const result=[];
    const parallel=Math.min(8,tiles.length);
    let next=0;
    async function worker(){
      while(next<tiles.length){
        if(token!==state.renderToken)return;
        const i=next++;
        const tile=tiles[i];
        const {img,url}=await decodedImage(tile);
        result[i]={tile,img,url};
      }
    }
    await Promise.all(Array.from({length:parallel},worker));
    if(token!==state.renderToken)return false;
    const active=new Set();
    for(const {tile,img,url} of result){
      const key=frameTileKey(tile), sid=mapSourceId(key), lid=mapLayerId(key);
      active.add(key);
      const source=state.map.getSource(sid);
      if(!source){
        // A newly created ImageSource is initialized *with* an image URL.
        // The previous code created an empty source and immediately called
        // getSource(sid).updateImage(), which can fail because getSource(sid)
        // is undefined when MapLibre rejects/has not registered that source.
        if(state.map.getLayer(lid))state.map.removeLayer(lid);
        state.map.addSource(sid,{type:'image',url,coordinates:tile.coordinates});
        state.map.addLayer({id:lid,type:'raster',source:sid,
          paint:{'raster-opacity':state.opacity,'raster-fade-duration':0}});
      }else{
        if(typeof source.updateImage!=='function')
          throw new Error(`MapLibre image source ${sid} cannot update. Reload the player and try again.`);
        // MapLibre GL JS 5.13.0 accepts ONLY {url, coordinates} here.
        // Passing {image: HTMLImageElement} silently does nothing in this pinned
        // version: the date/time changes while the raster remains static.
        // Keep the resolved URL (a blob: URL for folder-loaded files) for each
        // frame so MapLibre fetches and uploads the new tile texture.
        source.updateImage({url,coordinates:tile.coordinates});
      }
      state.tileSources.add(key);
    }
    for(const key of [...state.tileSources]){
      if(!active.has(key)){
        if(state.map.getLayer(mapLayerId(key)))state.map.removeLayer(mapLayerId(key));
        if(state.map.getSource(mapSourceId(key)))state.map.removeSource(mapSourceId(key));
        state.tileSources.delete(key);
      }
    }
    return true;
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
    if(bounds)state.map.fitBounds(bounds,{padding:{top:105,bottom:242,left:50,right:50},maxZoom:18,duration:500});
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
  }
  async function showFrame(idx, initial=false){
    if(!state.frames.length)return false;
    const count=state.frames.length;
    state.selected=Math.max(0,Math.min(count-1,idx));
    const token=++state.renderToken;
    updateFrameUI();
    if(!state.mapReady)return false;
    const frame=state.frames[state.selected];
    try{
      const success=await mapImages(frame.tiles,token);
      if(!success)return false;
      $('emptyState').hidden=true;
      if(initial || !state.defaultFitted){fit();state.defaultFitted=true;}
      return true;
    }catch(e){
      if(token===state.renderToken){status('Cannot display '+frame.local_datetime+': '+e.message,true);pause();}
      return false;
    }
  }
  function stopTimer(){if(state.timer!==null){clearTimeout(state.timer);state.timer=null;}}
  function pause(){state.playing=false;stopTimer();$('playPause').textContent='▶';$('playPause').setAttribute('aria-label','Play');}
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
  async function tick(){
    if(!state.playing)return;
    const index=nextIndex();
    if(index==null)return;
    await showFrame(index);
    if(state.playing)state.timer=setTimeout(tick,Math.round(650/state.speed));
  }
  function play(){
    if(!state.frames.length){toast('Open an export folder or load the demo first.');return;}
    if(state.playing){pause();return;}
    if(state.frames.length===1){toast('The selected date has only one capture.');return;}
    state.playing=true;$('playPause').textContent='❚❚';$('playPause').setAttribute('aria-label','Pause');
    stopTimer();state.timer=setTimeout(tick,Math.round(650/state.speed));
  }
  function step(direction){pause();state.direction=1;let i=state.selected+direction;
    if(i<0)i=state.frames.length-1;if(i>=state.frames.length)i=0;
    showFrame(i);
  }
  function dateChips(){
    const container=$('dateChips');container.replaceChildren();
    const dates=[...new Set(state.allFrames.map(f=>f.date))];
    const all=document.createElement('button');all.type='button';all.className='chip'+(!state.focusedDate?' active':'');all.textContent=`All (${state.allFrames.length})`;
    all.addEventListener('click',()=>setDate(''));container.append(all);
    for(const date of dates){
      const button=document.createElement('button');button.type='button';
      button.className='chip'+(state.focusedDate===date?' active':'');
      button.textContent=date.slice(5).replace('-','/');button.title=formatLong(date);
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
    pause();++state.renderToken;clearMapTiles();clearObjectUrls();
    state.manifest=data;state.allFrames=frames;state.frames=frames.slice();state.selected=0;
    state.focusedDate='';state.direction=1;state.defaultFitted=false;
    state.localFiles=fileMap;state.rootUrl=rootUrl;
    state.cacheLimit=Math.max(8,Math.min(1024,frames[0].tiles.length+Math.min(16,frames[0].tiles.length)));
    if(frames[0].tiles.length>80)toast('Large tiled animation: performance may improve by exporting with downsample 2 or 4.',false,7500);
    $('dateInput').value='';
    $('datasetInfo').hidden=false;
    $('datasetTitle').textContent=data.title||'Shadow capture series';
    $('mapTitle').textContent=String(data.title||'SHADOW CAPTURES').toUpperCase();
    $('frameCount').textContent=frames.length.toLocaleString('en-AU');
    $('formatLabel').textContent=(data.encoding?.format||'image').toUpperCase();
    const size=data.grid?.native_cell_x;
    $('resolutionLabel').textContent=Number.isFinite(size)?`${size} m`:'—';
    if(data.encoding?.transparent_sunlit===false){state.opacity=.4;$('opacity').value=40;}
    else{state.opacity=1;$('opacity').value=100;}
    $('opacityValue').textContent=`${Math.round(state.opacity*100)}%`;
    dateChips();updateFrameUI();applyOpacity();
    $('emptyState').hidden=true;
    await showFrame(0,true);
    toast(`${frames.length} captures loaded · ${data.encoding?.format?.toUpperCase()||'images'}`,false,3400);
    if(innerWidth<801)document.body.classList.add('panel-hidden');
  }
  async function openExportFolder(files){
    if(!files || !files.length)return;
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
      await activateDataset(data,{fileMap:local});
    }catch(e){status('Unable to open export: '+e.message,true);}
  }
  async function autoLoadHosted(){
    if(location.protocol==='file:')return;
    for(const relative of ['./data/shadow_player_manifest.json','./shadow_player_manifest.json']){
      try{
        const url=new URL(relative,location.href);
        const response=await fetch(url,{cache:'no-store'});
        if(!response.ok)continue;
        const data=await response.json();
        await activateDataset(data,{rootUrl:new URL('.',url).href});
        return;
      }catch(err){console.debug('No auto-load export at',relative,err.message);}
    }
  }
  async function demoDataset(){
    if(!state.mapReady){toast('MapLibre must load before the demo can display.',true);return;}
    const frames=[];const urls=[];
    const coordinates=[[138.5899,-34.9236],[138.6085,-34.9236],[138.6085,-34.9404],[138.5899,-34.9404]];
    for(let i=0;i<14;i++){
      const canvas=document.createElement('canvas');canvas.width=720;canvas.height=720;
      const g=canvas.getContext('2d');
      const ratio=i/13;const angle=(-0.92+ratio*1.84);
      const length=(.52+Math.abs(i-6.5)/13)*130;
      const blocks=[[145,157,70,82],[358,142,90,48],[535,280,56,116],[244,378,94,82],[410,490,135,78],[89,505,49,86]];
      for(const [x,y,w,h] of blocks){
        g.save();g.translate(x+w/2,y+h/2);g.rotate(angle);
        g.fillStyle='rgba(18,34,57,.73)';
        g.fillRect(-w/2,-h/2,w,h+length);
        g.restore();
      }
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      const url=URL.createObjectURL(blob);urls.push(url);
      const dt=`2026-12-21T${String(7+Math.floor(i/2)).padStart(2,'0')}:${i%2?'30':'00'}`;
      frames.push({index:i+1,id:'demo-'+i,local_datetime:dt,date:'2026-12-21',time:dt.slice(11,16),
        solar_azimuth_deg:(95+i*12).toFixed(1),solar_altitude_deg:(14+52*Math.sin(Math.PI*i/13)).toFixed(1),
        tiles:[{direct_url:url,coordinates,row:0,column:0,width:720,height:720}]});
    }
    const data={schema:'uos-shadow-player-v1',title:'SYNTHETIC SHADOW DEMO',source_kind:'demonstration',
      encoding:{format:'png',transparent_sunlit:true},grid:{native_cell_x:2},frames};
    // Preserve URLs against the old dataset cleanup performed by activateDataset.
    await activateDataset(data);state.demoUrls=urls;
    toast('Synthetic demonstration only — not derived from LiDAR.',false,6500);
  }

  function wireControls(){
    $('openFolder').addEventListener('click',()=>$('folderInput').click());
    $('emptyOpen').addEventListener('click',()=>$('folderInput').click());
    $('folderInput').addEventListener('change',async e=>{
      await openExportFolder(e.target.files);e.target.value='';
    });
    $('demoButton').addEventListener('click',demoDataset);
    $('playPause').addEventListener('click',play);
    $('stepBack').addEventListener('click',()=>{if(state.frames.length)step(-1);});
    $('stepForward').addEventListener('click',()=>{if(state.frames.length)step(1);});
    $('scrubber').addEventListener('input',e=>{if(state.frames.length){pause();showFrame(Number(e.target.value));}});
    $('speedOptions').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{
      state.speed=Number(btn.dataset.speed);
      $('speedOptions').querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===btn));
      updateFrameUI();
      if(state.playing){stopTimer();state.timer=setTimeout(tick,Math.round(650/state.speed));}
    }));
    $('clearDate').addEventListener('click',()=>setDate(''));
    $('dateInput').addEventListener('change',e=>setDate(e.target.value));
    document.querySelectorAll('[data-basemap]').forEach(btn=>btn.addEventListener('click',()=>{
      state.basemap=btn.dataset.basemap;
      document.querySelectorAll('[data-basemap]').forEach(x=>x.classList.toggle('active',x===btn));
      applyBasemap();
    }));
    document.querySelectorAll('[data-loop]').forEach(btn=>btn.addEventListener('click',()=>{
      state.playbackMode=btn.dataset.loop;state.direction=1;
      document.querySelectorAll('[data-loop]').forEach(x=>x.classList.toggle('active',x===btn));
    }));
    $('opacity').addEventListener('input',e=>{
      state.opacity=Number(e.target.value)/100;
      $('opacityValue').textContent=`${e.target.value}%`;
      applyOpacity();
    });
    $('fitBounds').addEventListener('click',fit);
    $('togglePanel').addEventListener('click',()=>{
      document.body.classList.toggle('panel-hidden');
      setTimeout(()=>state.map?.resize(),250);
    });
    window.addEventListener('keydown',e=>{
      if(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if(e.code==='Space'){e.preventDefault();play();}
      else if(e.key==='ArrowRight' && state.frames.length){e.preventDefault();step(1);}
      else if(e.key==='ArrowLeft' && state.frames.length){e.preventDefault();step(-1);}
      else if(e.key.toLowerCase()==='f'){fit();}
    });
  }
  wireControls();initMap();autoLoadHosted();
  // Smoke-test aid; immutable public diagnostics, no hidden app mutation.
  window.shadowPlayerDiagnostics=()=>({mapReady:state.mapReady,frames:state.frames.length,
    allFrames:state.allFrames.length,selected:state.selected,playing:state.playing,
    localFileCount:state.localFiles?.size||0,activeTiles:state.tileSources.size,
    cacheSize:state.memoryCache.size,sourceKind:state.manifest?.source_kind||null});
})();
