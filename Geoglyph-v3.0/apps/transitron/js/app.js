/* Adelaide Metro live network dashboard.
   Based on public UOS GTFS Live Refresh source. No online repo changes.
*/
(function(){'use strict';
const SNAP=window.METRO_SNAPSHOT;
const GTFS=window.MetroGTFS;
const TICK=window.MetroTicker;
const NETWORK=window.MetroNetwork;
const $=id=>document.getElementById(id);
const trackedVehicleTypes = new Set(['Bus', 'Train', 'Tram']);
const trackedVehicles = rows => rows.filter(vehicle => trackedVehicleTypes.has(vehicle?.VehicleType));
let state={vehicles:trackedVehicles(SNAP.vehicles),trips:[...SNAP.trips],alerts:[...SNAP.alerts]};
let mode='snapshot',map=null,selectedKey=null,selectedVehicle=null,selectedNode=null,loadedMap=false;
let usingFallback=false,activeTab='recordings';
let networkSelection=null;
let playbackSource;
let playbackFollow = null;
let activeRecordings = [];
let tickerShowsRecording = false;
let dismissRefreshStatus;
let savedCaptureTime;
let basemapMode='nova',metroKey='',headerFilter='all';
let mapLabelsVisible = false;
let basemapAnnotationsVisible = false;
let basemapSelection = 0;
let novaStyle;
let novaRequest;
const novaStyleUrl = 'https://cdn.arcgis.com/sharing/rest/content/items/1237385e55d9487489fe2a21766b43bb/resources/styles/root.json';
const esriServices = 'https://server.arcgisonline.com/ArcGIS/rest/services';
const mapTilePath = '/MapServer/tile/{z}/{y}/{x}';
const metroStorageKey='adelaide-metro:metromap-api-key';
const selectionPointFilter=['==',['geometry-type'],'Point'];
const selectionArrowFilter=['==',['geometry-type'],'Polygon'];
const vehicleHitCache=new WeakMap();
const debugEntries=[];
function log(text,level='INFO'){const msg=`[${new Date().toISOString()}] [${level}] ${text}`;debugEntries.push(msg);const el=$('debugLogWindow');if(el){el.value=debugEntries.join('\n');el.scrollTop=el.scrollHeight;}if(level==='ERROR')console.warn(msg);}
function esc(v){return String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
function number(v,digits=1){const n=Number(v);return v==null||!Number.isFinite(n)?'—':n.toLocaleString('en-AU',{maximumFractionDigits:digits});}
function modeLabel(){
  if (mode === 'saved') return 'SAVED GTFS-REALTIME SNAPSHOT';
  if (mode === 'playback') return 'RECORDED GTFS-REALTIME DATA';
  return mode === 'live' ? 'LIVE GTFS-REALTIME DATA' : 'ARCHIVED DATA — AUG 2026';
}
function keyFor(v){return String(v?.VehicleID||v?.EntityID||v?.TripID||'');}
function announceSelection(message) {
  $('selectionAnnouncement').replaceChildren(message);
}
function syncTicker(restart){
  window.MetroEdgeTracks?.updateSelection(selectedKey);
 if(tickerShowsRecording)return;
  if(selectedVehicle){
    const message=TICK.selected(selectedVehicle,mode,restart);
    if(restart)announceSelection(message);
 }else if(networkSelection?.info){
  const {heading, fields, mode} = networkSelection.info;
  TICK.information(heading, fields, {restart, accent: mode});
 }else if(!networkSelection)TICK.reset(restart);
}

function renderRecordingTicker(restart) {
 const message = TICK.recording(activeRecordings, {restart, startAtCentre: true});
 if (restart) announceSelection(message);
}

function updateRecordingStatus(sessions) {
 const started = sessions.some(session => !activeRecordings.some(previous => previous.id === session.id));
 activeRecordings = sessions;
 const button = document.querySelector('[data-tab="recordings"]');
 button.dataset.recording = String(sessions.length > 0);
 button.setAttribute('aria-description', sessions.length ? 'Recording active' : 'No active recordings');
 if (activeTab !== 'recordings') return;
 if (!sessions.length) {
  if (tickerShowsRecording) {
   tickerShowsRecording = false;
   syncTicker(true);
  }
  return;
 }
 if (started) tickerShowsRecording = true;
 if (tickerShowsRecording) renderRecordingTicker(started);
}

function selectTab(name){
 if(!$('tab-'+name)?.classList.contains('tab-panel'))return;
 activeTab=name;
 document.querySelectorAll('.nav-hit[data-tab]').forEach(button=>{
  const on=button.dataset.tab===name;
  button.classList.toggle('active',on);
  if (on) {
   button.setAttribute('aria-current','page');
   if (!button.hidden) {
    const navigation = button.parentElement;
    const bar = navigation.getBoundingClientRect();
    const tab = button.getBoundingClientRect();
    if (tab.right > bar.right) navigation.scrollLeft += tab.right - bar.right;
    else if (tab.left < bar.left) navigation.scrollLeft += tab.left - bar.left;
   }
  } else button.removeAttribute('aria-current');
 });
 document.querySelectorAll('.tab-panel').forEach(panel=>panel.classList.toggle('active',panel.id==='tab-'+name));
 const wasShowingRecording = tickerShowsRecording;
 tickerShowsRecording = name === 'recordings' && activeRecordings.length > 0;
 if (tickerShowsRecording) renderRecordingTicker(true);
 else if (wasShowingRecording) syncTicker(true);
 if(map&&typeof map.resize==='function')setTimeout(()=>map.resize(),0);
}
function setupNavigation() {
 document.querySelectorAll('.nav-hit[data-tab]').forEach(button => {
  button.addEventListener('click', () => selectTab(button.dataset.tab));
 });
 selectTab(activeTab);
}
function setBasemapStatus(message){const el=$('basemapStatus');if(el)el.textContent=message;}
function safeStorage(action,value){
  try{
    if(action==='read')return localStorage.getItem(metroStorageKey);
    if(action==='write'){localStorage.setItem(metroStorageKey,value);return true;}
    if(action==='remove'){localStorage.removeItem(metroStorageKey);return true;}
  }catch(e){setBasemapStatus('Browser storage is unavailable here. The key can still be used temporarily.');}
  return null;
}
function vehicleColor(type){
  return getComputedStyle(document.documentElement).getPropertyValue('--metro-'+type+'-color').trim();
}

function vehicleHaloColor(){
  const byType=['match',['get','VehicleType'],
  'Bus',vehicleColor('bus'),'Tram',vehicleColor('tram'),'Train',vehicleColor('train'),'#808080'];
  return selectedKey ? ['case',['==',['get','VehicleKey'],selectedKey],vehicleColor('selection'),byType] : byType;
}

function rasterBasemap() {
 const dark = basemapMode === 'dark';
 const aerial = basemapMode === 'metromap';
 const esriName = dark ? 'Canvas/World_Dark_Gray_Base' : 'World_Topo_Map';
 const url = aerial
    ?`https://api.metromap.com.au/ogc/key/${encodeURIComponent(metroKey)}/wmts/Australia_latest/webmercator/{z}/{x}/{y}.png`
  : `${esriServices}/${esriName}${mapTilePath}`;
 const attribution = aerial ? 'Imagery © MetroMap / Aerometrex' : dark
  ? 'Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community'
  : 'Tiles © Esri · Esri, HERE, Garmin and contributors';
 const visibility = basemapAnnotationsVisible ? 'visible' : 'none';
 return {sources:{
    basemap:{type:'raster',tiles:[url],tileSize:256,attribution, ...(dark && {maxzoom:16})},
    ...(dark && {basemapLabels: {
      type: 'raster',
      tiles: [`${esriServices}/Canvas/World_Dark_Gray_Reference${mapTilePath}`],
      tileSize: 256,
      maxzoom: 16
    }})
  },layers:[
    {id:'map-background',type:'background',paint:{'background-color':dark?'#242424':'#e4f2ee'}},
    {id:'basemap',type:'raster',source:'basemap'},
    ...(dark ? [{id:'basemap-labels',type:'raster',source:'basemapLabels',layout:{visibility}}] : [])
  ]};
}

function vectorNovaBasemap() {
 const {sprite, glyphs, sources, layers} = novaStyle;
 return {sprite, glyphs, sources, layers: layers.map(layer => layer.type === 'symbol' && !basemapAnnotationsVisible
  ? {...layer, layout: {...layer.layout, visibility:'none'}} : layer)};
}

function mapStyle(){
 const nova = basemapMode === 'nova';
 const basemap = nova ? vectorNovaBasemap() : rasterBasemap();
 const visibility = mapLabelsVisible ? 'visible' : 'none';
 const selectionColor = vehicleColor('selection');
 const outlineColor = '#17283a';
 const ringRadius = ['interpolate',['linear'],['zoom'],8,9,12,12,15,15];
 return {version:8,...basemap,sources:{
    ...basemap.sources,
    vehicles:{type:'geojson',data:geoVehicles()},
    vehicleSelection:{type:'geojson',data:vehicleSelection()}
  },layers:[
    ...basemap.layers,
    {id:'vehicle-halos',type:'circle',source:'vehicles',paint:{
      'circle-radius':['interpolate',['linear'],['zoom'],8,8.5,12,12,15,15.5],
      'circle-color':vehicleHaloColor(),'circle-opacity':.7,'circle-blur':.5
    }},
    {id:'vehicles-circle',type:'circle',source:'vehicles',paint:{'circle-color':['match',['get','VehicleType'],'Bus','#70d743','Tram','#ff4161','Train','#09c6fc','#808080'],'circle-radius':['interpolate',['linear'],['zoom'],8,3.5,12,6,15,8.5],'circle-stroke-width':1.5,'circle-stroke-color':'#1b2b41','circle-opacity':.95}},
    {id:'vehicle-bearing',type:'fill',source:'vehicleSelection',filter:selectionArrowFilter,
      paint:{'fill-color':selectionColor,'fill-antialias':false}},
    {id:'vehicle-bearing-outline',type:'line',source:'vehicleSelection',filter:selectionArrowFilter,layout:{'line-join':'round'},
      paint:{'line-color':outlineColor,'line-width':2}},
    {id:'vehicle-ring-outline',type:'circle',source:'vehicleSelection',filter:selectionPointFilter,
      paint:{'circle-radius':ringRadius,'circle-opacity':0,'circle-stroke-width':6.5,'circle-stroke-color':outlineColor}},
    {id:'vehicle-ring',type:'circle',source:'vehicleSelection',filter:selectionPointFilter,
      paint:{'circle-radius':ringRadius,'circle-opacity':0,'circle-stroke-width':3.5,'circle-stroke-color':selectionColor}},
    {id:'route-labels',type:'symbol',source:'vehicles',layout:{visibility,'text-field':['coalesce',['get','RouteID'],''],'text-size':11,'text-offset':[0,1.2],'text-anchor':'top',...(nova && {'text-font':['Orbitron Regular']})},paint:{'text-color':['to-color',['get','RouteColour'],'#16354c'],'text-halo-color':'#fff','text-halo-width':1.3}}
  ]};
}

function loadNovaStyle() {
 novaRequest ??= fetch(novaStyleUrl, {signal: AbortSignal.timeout(12_000)}).then(async response => {
  if (!response.ok) throw Error('HTTP ' + response.status);
  const {version, sprite, glyphs, sources, layers} = await response.json();
  if (version !== 8 || !sprite || !glyphs || !sources || !Array.isArray(layers)) {
   throw Error('The ArcGIS item did not return a vector basemap style');
  }
  const vectorSources = Object.fromEntries(Object.entries(sources).map(([id, source]) => {
   const {url, ...spec} = source;
   const service = new URL(url, novaStyleUrl).href.replace(/\/$/, '');
   return [id, {...spec, tiles:[service + '/tile/{z}/{y}/{x}.pbf'], maxzoom:22,
    attribution:'Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community'}];
  }));
  const glyphUrl = new URL(glyphs, novaStyleUrl).href.replace(/%7B(fontstack|range)%7D/g, '{$1}');
  const annotations = layers.filter(layer => layer.type === 'symbol').map(({id, layout}) =>
   ({id, visibility:layout?.visibility ?? 'visible'}));
  novaStyle = {sprite:new URL(sprite, novaStyleUrl).href, glyphs:glyphUrl,
   sources:vectorSources, layers, annotations};
 }).catch(error => {
  novaRequest = null;
  throw error;
 });
 return novaRequest;
}

function selectBasemap(choice) {
 if (choice === 'nova' && !novaStyle) {
  const request = ++basemapSelection;
  setBasemapStatus('Loading Nova…');
  void loadNovaStyle().then(() => {
   if (request === basemapSelection) applyBasemap(choice);
  }).catch(error => {
   if (request !== basemapSelection) return;
   const fellBack = basemapMode === 'nova' && applyBasemap('topo');
   const fallbackMessage = fellBack ? ' Esri World Topography selected instead.' : '';
   setBasemapStatus('Nova is unavailable. ' + error.message + '.' + fallbackMessage);
   log('Could not load Nova: ' + error.message, 'WARN');
  });
  return true;
 }
 const applied = applyBasemap(choice);
 if (applied) basemapSelection++;
 return applied;
}

function applyBasemap(choice){
  if(choice==='metromap'){
    const value=$('metromapApiKey').value.trim();
    if(!value){setBasemapStatus('Enter a MetroMap API key before selecting imagery.');$('metromapApiKey').focus();return false;}
    metroKey=value;
  }
 const previous = basemapMode;
 basemapMode=choice;
 try {
  if (map) map.setStyle(mapStyle(), {diff:false});
 } catch (error) {
  basemapMode = previous;
  setBasemapStatus('Could not switch basemaps. ' + error.message);
  log('Basemap style error: ' + error.message, 'WARN');
  return false;
 }
  document.querySelectorAll('[data-basemap]').forEach(el=>{const chosen=el.dataset.basemap===choice;el.classList.toggle('active',chosen);el.setAttribute('aria-pressed',String(chosen));});
 $('basemapAnnotationsButton').disabled = choice !== 'dark' && choice !== 'nova';
 const label = {dark:'Esri Dark Gray Canvas', topo:'Esri World Topography', nova:'Esri Nova', metromap:'MetroMap aerial imagery'}[choice];
  setBasemapStatus(label+' selected.');log('Basemap: '+label);
  if (!loadedMap) initMap();
  return true;
}
function setupMapPopovers() {
 let openPopover;
 function close() {
  if (!openPopover) return;
  const {button, panel} = openPopover;
  panel.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  openPopover = null;
  return button;
 }
 for (const button of document.querySelectorAll('.map-control-button[aria-controls]')) {
  const panel = $(button.getAttribute('aria-controls'));
  button.addEventListener('click', event => {
   if (close() === button) return;
   panel.hidden = false;
   button.setAttribute('aria-expanded', 'true');
   openPopover = {button, panel};
   if (event.detail === 0) panel.focus({preventScroll: true});
  });
 }
 document.addEventListener('pointerdown', event => {
  if (openPopover && !openPopover.panel.contains(event.target) && !openPopover.button.contains(event.target)) close();
 });
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape') close()?.focus();
 });
}

function setupBasemap(){
  const key=safeStorage('read');if(key){metroKey=key;$('metromapApiKey').value=key;setBasemapStatus('Saved key loaded in this browser.');}
 $('basemapAnnotationsButton').disabled = false;
  document.querySelectorAll('[data-basemap]').forEach(b=>b.addEventListener('click',()=>selectBasemap(b.dataset.basemap)));
  $('rememberMetroKey').addEventListener('click',()=>{
    const value=$('metromapApiKey').value.trim();
    if(!value){setBasemapStatus('Enter a MetroMap API key to remember.');return;}
    if(safeStorage('write',value)){metroKey=value;setBasemapStatus('MetroMap key saved in browser storage.');}
  });
  $('forgetMetroKey').addEventListener('click',()=>{
    const ok=safeStorage('remove');metroKey='';$('metromapApiKey').value='';
    if(basemapMode==='metromap')selectBasemap('topo');
    setBasemapStatus(ok?'Stored key cleared; MetroMap access disabled.':'Key cleared from this page. Browser storage may not be accessible.');
  });
}
function getVehiclePixelAlpha(button,e){
  if(e.detail===0 && e.type==='click')return 255; // keyboard activation
  const img=button.querySelector('img');if(!img||!img.naturalWidth)return 0;
  const rect=img.getBoundingClientRect();
  const u=(e.clientX-rect.left)/rect.width,v=(e.clientY-rect.top)/rect.height;
  if(u<0||u>=1||v<0||v>=1)return 0;
  if(button.dataset.filter==='Tram' && u<.01)return 0; // Match the clipped image edge.
  const preset=window.METRO_VEHICLE_HIT_MASKS?.[button.dataset.filter];
  if(preset){
    let bytes=vehicleHitCache.get(img);
    if(!bytes){
      const binary=atob(preset.mask);bytes=Uint8Array.from(binary,character=>character.charCodeAt(0));
      vehicleHitCache.set(img,bytes);
    }
    const xi=Math.floor(u*preset.w),yi=Math.floor(v*preset.h),index=yi*preset.w+xi;
    return (bytes[index>>3]>>(index&7)&1)?255:0;
  }
  let data=vehicleHitCache.get(img);
  if(!data){
    try{
      const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
      data={alpha:ctx.getImageData(0,0,canvas.width,canvas.height).data,w:canvas.width,h:canvas.height};
      vehicleHitCache.set(img,data);
    }catch(e){
      // The fallback uses a tight vehicle outline when local browser origin
      // policy prohibits canvas reads. Normal HTTPS hosting uses pixel alpha.
      return v>.11&&v<.97&&u>.02&&u<.99?255:0;
    }
  }
  const x=Math.floor(u*data.w),y=Math.floor(v*data.h);
  return data.alpha[(y*data.w+x)*4+3];
}
function setHeaderVehicleFilter(type){
  headerFilter=(headerFilter===type?'all':type);
  document.querySelectorAll('[data-vehicle-toggle]').forEach(el=>{el.checked=headerFilter==='all'||el.dataset.vehicleToggle===headerFilter;});
 if(selectedVehicle && headerFilter!=='all' && selectedVehicle.VehicleType!==headerFilter) clearVehicleSelection();
  filterModes();updateSelectionUI();
  log('Header map filter: '+(headerFilter==='all'?'all vehicles':headerFilter));
}
function syncHeaderFilter(){
  const enabled=[...document.querySelectorAll('[data-vehicle-toggle]:checked')].map(x=>x.dataset.vehicleToggle);
  headerFilter=enabled.length===1?enabled[0]:'all';
  document.querySelectorAll('.vehicle-sprite').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===headerFilter)));
}
function setupVehicleArt(){
  for(const button of document.querySelectorAll('.vehicle-sprite')){
    const onMove=e=>{const hot=getVehiclePixelAlpha(button,e)>45;button.classList.toggle('is-hot',hot);button.style.cursor=hot?'pointer':'default';};
    button.addEventListener('pointermove',onMove);
    button.addEventListener('pointerleave',()=>button.classList.remove('is-hot'));
    button.addEventListener('click',e=>{if(getVehiclePixelAlpha(button,e)>45)setHeaderVehicleFilter(button.dataset.filter);});
  }
  syncHeaderFilter();
}
function stats(){const tally={Bus:0,Train:0,Tram:0};for(const v of state.vehicles)tally[v.VehicleType]++;for(const [id,n] of [['countBus',tally.Bus],['countTrain',tally.Train],['countTram',tally.Tram],['countVehicles',state.vehicles.length],['countTrips',state.trips.length],['countAlerts',state.alerts.length]])$(id).textContent=n.toLocaleString('en-AU');$('sourceDescription').textContent=mode==='live'?`Live GTFS-Realtime response loaded ${new Date().toLocaleString('en-AU')}. Select a map marker or table row to inspect a vehicle.`:`Historical sample from ${SNAP.generated}. Original snapshot: ${SNAP.countsOriginal.vehicle_positions} vehicles, ${SNAP.countsOriginal.trip_updates} trip updates and ${SNAP.countsOriginal.service_alerts} alerts. Use Refresh latest feeds on the map.`;}
function clearTableSelection(){document.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));}
function highlightRow(){clearTableSelection();if(selectedVehicle){document.querySelectorAll('[data-vehicle-id]').forEach(el=>{if(el.dataset.vehicleId===keyFor(selectedVehicle))el.classList.add('selected');});}}
function routeBadge(route) {
 const badge = document.createElement('span');
 badge.className = 'route-pill';
 badge.textContent = route;
 const style = NETWORK?.routeStyle(route);
 if (style) {
  badge.style.setProperty('--route-accent', style.colour);
  if (style.region) badge.dataset.tooltip = style.region;
 }
 return badge;
}
function selectedSummary(){const el=$('selectedSummary');if(!selectedVehicle){el.hidden=true;el.innerHTML='';return;}const v=selectedVehicle;el.hidden=false;el.innerHTML=`<h2>Selected vehicle</h2><p><b>${esc(v.VehicleType||'Vehicle')} ${esc(v.VehicleLabel||v.VehicleID||'')}</b> — Route ${routeBadge(v.RouteID || '—').outerHTML}</p><p>Trip ${esc(v.TripID||'—')} · ${number(Number(v.Speed)*3.6,0)} km/h · Bearing ${number(v.Bearing,0)}°</p><p>${esc(modeLabel())} · ${esc(v.PositionTimestamp||'Time unavailable')}</p>`;}
function updateSelectionUI(restartTicker=false){
 $('clearSelectionButton').disabled = !selectedVehicle && !networkSelection && !playbackFollow;
 syncTicker(restartTicker);
 selectedSummary();
 highlightRow();
 if(usingFallback)renderFallbackMap();else setMapSelection();
}
function clearVehicleSelection() {
 selectedVehicle = null;
 selectedKey = null;
 playbackFollow = null;
}
function clearSelection(){
 clearVehicleSelection();
 networkSelection = null;
 updateSelectionUI();
 announceSelection('Selection cleared');
}
function deselect(){clearSelection();fitHome();}
function selectVehicle(vehicle, {fly = true, toggle = false, follow = false} = {}) {
 if (!vehicle) return;
 tickerShowsRecording = false;
 const key = keyFor(vehicle);
 if (toggle && selectedKey === key) {
  deselect();
  return;
 }
 networkSelection = null;
 selectedVehicle = vehicle;
 selectedKey = key;
 playbackFollow = follow && mode === 'playback' && key
  ? {vehicleType: vehicle.VehicleType, center: null} : null;
 updateSelectionUI(true);
 if (playbackFollow) {
  updatePlaybackCamera();
 } else if (map && fly && hasCoordinates(vehicle)) {
  map.flyTo({center: displayCoordinates(vehicle), zoom: 15.8, duration: 450});
 }
}
function renderTable(el,items,cols,kind){
 el.replaceChildren();
 if (!items.length) {
  el.innerHTML = '<tbody><tr><td>No records in this selection.</td></tr></tbody>';
  return;
 }
 const header = el.createTHead().insertRow();
 for (const [, label] of cols) {
  const th = document.createElement('th');
  th.textContent = label;
  header.append(th);
 }
 const body = el.createTBody();
 for (const record of items.slice(0,400)) {
  const row = body.insertRow();
  row.className = 'selectable';
  row.tabIndex = 0;
  row.dataset.vehicleId = kind === 'vehicles' ? keyFor(record) : '';
  for (const [property] of cols) {
   const cell = row.insertCell();
   const value = record[property];
   if (property === 'RouteID' && value != null && value !== '') {
    cell.append(routeBadge(value));
   } else {
    const digits = property === 'Latitude' || property === 'Longitude' ? 5 : 1;
    cell.textContent = typeof value === 'number' ? number(value,digits) : String(value ?? '—');
   }
  }
  function select() {
   if (kind === 'vehicles') {
    selectVehicle(record, {follow: true});
    return;
   }
   const vehicle = state.vehicles.find(item => (record.VehicleID && item.VehicleID === record.VehicleID)
     || (record.TripID && item.TripID === record.TripID));
   if (vehicle) {
    selectVehicle(vehicle);
    log('Selected associated vehicle for trip ' + record.TripID);
   } else log('No active vehicle matches trip ' + record.TripID,'WARN');
  }
  row.addEventListener('click', select);
  row.addEventListener('keydown', event => {
   if (event.key !== 'Enter' && event.key !== ' ') return;
   event.preventDefault();
   select();
  });
 }
}
function renderVehicles(){const q=$('vehicleSearch').value.toLowerCase().trim();const filtered=q?state.vehicles.filter(v=>[v.RouteID,v.VehicleID,v.VehicleLabel,v.TripID,v.VehicleType].some(s=>String(s||'').toLowerCase().includes(q))):state.vehicles;$('vehicleRowCount').textContent=`${filtered.length} shown`;renderTable($('vehicleTable'),filtered,[['VehicleType','Type'],['RouteID','Route'],['VehicleLabel','Vehicle'],['TripID','Trip'],['Speed','Speed m/s'],['PositionTimestamp','Position time']],'vehicles');highlightRow();}
function renderTrips(){$('tripRowCount').textContent=state.trips.length.toLocaleString('en-AU');renderTable($('tripTable'),state.trips,[['RouteID','Route'],['TripID','Trip'],['VehicleID','Vehicle'],['StopTimeUpdateCount','Stops'],['DelaySeconds','Delay s'],['FirstStopID','Next stop']],'trips');}
function plainText(html){if(!html)return'';const doc=new DOMParser().parseFromString(String(html),'text/html');return doc.body.textContent.trim().replace(/\s+/g,' ');}
function renderAlerts(){const el=$('alertList');el.replaceChildren();$('alertRowCount').textContent=state.alerts.length.toLocaleString('en-AU');if(!state.alerts.length){el.textContent='No alerts in this feed.';return;}for(const alert of state.alerts.slice(0,200)){const button=document.createElement('button');button.type='button';button.className='alert-item';const h=document.createElement('strong');h.textContent=plainText(alert.HeaderText)||'Untitled alert';button.appendChild(h);const p=document.createElement('p');p.textContent=plainText(alert.DescriptionText);button.appendChild(p);for(const r of String(alert.RouteIDs||'').split(/[,;|]/).map(x=>x.trim()).filter(Boolean)){button.append(routeBadge(r));}button.addEventListener('click',()=>{const routes=String(alert.RouteIDs||'').split(/[,;|]/).map(x=>x.trim());const selected=state.vehicles.filter(v=>routes.includes(String(v.RouteID||'')));if(selected.length){selectVehicle(selected[0],{toggle:false});if(map&&selected.length>1){const b=new maplibregl.LngLatBounds();selected.forEach(v=>b.extend([+v.Longitude,+v.Latitude]));map.fitBounds(b,{padding:60,maxZoom:14});}}else log('No tracked vehicles currently match alert routes '+alert.RouteIDs,'WARN');});el.appendChild(button);}}
function render(){
  stats();renderVehicles();renderTrips();renderAlerts();selectedSummary();
  if (mode === 'saved') {
    const date = new Date(savedCaptureTime).toLocaleString('en-AU', {timeZone: 'Australia/Adelaide', timeZoneName: 'short'});
    $('sourceDescription').textContent = 'Saved startup snapshot captured ' + date + '. Use Refresh latest feeds on the map.';
  }
  window.MetroEdgeTracks?.updateVehicles(state.vehicles,{mode,selectedKey});
  renderNetwork();
  redrawVehiclePositions();
}
function renderNetwork(){
  NETWORK?.render(state,mode,map,{selectDarkBasemap,redraw:redrawVehiclePositions});
}
function redrawVehiclePositions(){
  if(map&&map.getSource('vehicles'))map.getSource('vehicles').setData(geoVehicles());
 updatePlaybackCamera();
  setMapSelection();
  if(usingFallback)renderFallbackMap();
}
function hasCoordinates(vehicle){
  return vehicle.Longitude!=null&&vehicle.Latitude!=null&&Number.isFinite(+vehicle.Longitude)&&Number.isFinite(+vehicle.Latitude);
}
const displayCoordinates=vehicle=>NETWORK?.coordinates(vehicle)||[+vehicle.Longitude,+vehicle.Latitude];
function updatePlaybackCamera() {
 if (!map || !playbackFollow || !selectedVehicle || !hasCoordinates(selectedVehicle)) return;
 const center = displayCoordinates(selectedVehicle);
 if (Math.abs(center[1]) > 90) return;
 const previous = playbackFollow.center;
 if (previous && center[0] === previous[0] && center[1] === previous[1]) return;
 const camera = {center};
 if (!previous) camera.zoom = Math.max(map.getZoom(), 15.8);
 map.jumpTo(camera);
 playbackFollow.center = center;
}
const geoVehicles=()=>({type:'FeatureCollection',features:state.vehicles.filter(hasCoordinates).map(vehicle=>({
 type:'Feature',geometry:{type:'Point',coordinates:displayCoordinates(vehicle)},
 properties:{...vehicle,VehicleKey:keyFor(vehicle),RouteColour:NETWORK?.routeStyle(vehicle.RouteID)?.colour ?? null}
}))});

function bearingDegrees(vehicle) {
  if (vehicle?.Bearing == null || vehicle.Bearing === '') return null;
  const heading = Number(vehicle.Bearing);
  return Number.isFinite(heading) && heading >= 0 && heading <= 360 ? heading : null;
}

function vehicleSelection() {
  const data = {type: 'FeatureCollection', features: []};
  if (!selectedVehicle || !hasCoordinates(selectedVehicle)) return data;

  const [lon, lat] = displayCoordinates(selectedVehicle);
  const properties = {VehicleType: selectedVehicle.VehicleType};
  data.features.push({type:'Feature', geometry:{type:'Point', coordinates:[lon, lat]}, properties});
  const heading = bearingDegrees(selectedVehicle);
  if (heading === null) return data;

  const radians = Math.PI / 180;
  const zoom = map?.getZoom() ?? 11;
  const degreesPerPixel = 360 / (512 * 2 ** zoom);
  const longitudeStep = degreesPerPixel;
  const latitudeStep = degreesPerPixel * Math.cos(lat * radians);
  const sine = Math.sin(heading * radians);
  const cosine = Math.cos(heading * radians);
  const arrow = [[16,3.5],[58,3.5],[58,13],[82,0],[58,-13],[58,-3.5],[16,-3.5],[16,3.5]];
  const outline = arrow.map(([forward, right]) => [
    lon + (forward * sine + right * cosine) * longitudeStep,
    lat + (forward * cosine - right * sine) * latitudeStep
  ]);
  data.features.push({
    type: 'Feature',
    geometry: {type: 'Polygon', coordinates: [outline]},
    properties
  });
  return data;
}

function redrawVehicleSelection(){
  map?.getSource('vehicleSelection')?.setData(vehicleSelection());
}

function setMapSelection(){
  if(map?.getLayer('vehicle-halos'))map.setPaintProperty('vehicle-halos','circle-color',vehicleHaloColor());
  redrawVehicleSelection();
}
function fitHome(){if(!map)return;const bounds=new maplibregl.LngLatBounds();state.vehicles.forEach(v=>{if(Number.isFinite(+v.Latitude)&&Number.isFinite(+v.Longitude))bounds.extend([+v.Longitude,+v.Latitude]);});if(!bounds.isEmpty())map.fitBounds(bounds,{padding:48,maxZoom:13,duration:450});else map.jumpTo({center:[138.6007,-34.9285],zoom:11});}
function enabledVehicleTypes() {
 return Array.from(document.querySelectorAll('[data-vehicle-toggle]:checked'), input => input.dataset.vehicleToggle);
}

function extendCoordinates(bounds, coordinates) {
 const [longitude, latitude] = coordinates;
 if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
  if (Math.abs(latitude) <= 90) bounds.extend([longitude, latitude]);
  return;
 }
 for (const part of coordinates) {
  if (Array.isArray(part)) extendCoordinates(bounds, part);
 }
}

function extendGeometry(bounds, geometry) {
 if (geometry?.type === 'GeometryCollection') {
  for (const part of geometry.geometries) extendGeometry(bounds, part);
 } else if (geometry?.coordinates) {
  extendCoordinates(bounds, geometry.coordinates);
 }
}

function fitMap() {
 if (!map) return;
 const bounds = new maplibregl.LngLatBounds();
 if (selectedVehicle && hasCoordinates(selectedVehicle)) {
  extendCoordinates(bounds, displayCoordinates(selectedVehicle));
 } else if (networkSelection) {
  extendGeometry(bounds, NETWORK.selectedGeometry(networkSelection.feature));
 }
 if (bounds.isEmpty()) {
  const enabled = new Set(enabledVehicleTypes());
  for (const vehicle of state.vehicles) {
   if (enabled.has(vehicle.VehicleType) && hasCoordinates(vehicle)) {
    extendCoordinates(bounds, displayCoordinates(vehicle));
   }
  }
  for (const geometry of NETWORK.visibleGeometries()) extendGeometry(bounds, geometry);
 }
 if (bounds.isEmpty()) {
  map.jumpTo({center:[138.6007,-34.9285],zoom:11});
  return;
 }
 const {clientWidth, clientHeight} = $('map');
 const edge = Math.min(32, Math.floor(Math.min(clientWidth, clientHeight) / 8));
 map.fitBounds(bounds, {
  padding: {top: edge, right: edge, bottom: edge, left: edge},
  maxZoom: 15.8,
  duration: 450
 });
}

function filterModes(){
 const enabled=enabledVehicleTypes();
 if (playbackFollow && !enabled.includes(playbackFollow.vehicleType)) clearSelection();
  if(map?.getLayer('vehicles-circle')){
    const filter=['in',['get','VehicleType'],['literal',enabled]];
    for(const layer of ['vehicle-halos','vehicles-circle','route-labels']){
      map.setFilter(layer,filter);
    }
    for(const layer of ['vehicle-bearing','vehicle-bearing-outline']){
      map.setFilter(layer,['all',filter,selectionArrowFilter]);
    }
    for(const layer of ['vehicle-ring','vehicle-ring-outline']){
      map.setFilter(layer,['all',filter,selectionPointFilter]);
    }
  }
  if(usingFallback)renderFallbackMap();
  syncHeaderFilter();
}
function featureAt(point) {
  const layers = (map.getStyle()?.layers ?? []).map(layer => layer.id).filter(id =>
    id === 'vehicles-circle' || id === 'network-stops' || id === 'network-heat' || id.startsWith('network-routes')
  );
  if (!layers.length) return null;
  const bounds = [[point.x - 5, point.y - 5], [point.x + 5, point.y + 5]];
  const features = map.queryRenderedFeatures(bounds, {layers});
  return features.find(feature => feature.layer.id === 'vehicles-circle')
    ?? features.find(feature => feature.layer.id === 'network-stops')
    ?? features.find(feature => feature.properties?.route)
    ?? features[0];
}

function setLabelVisibility(id, visibility) {
 if (map?.getLayer(id) && (map.getLayoutProperty(id, 'visibility') ?? 'visible') !== visibility) {
  map.setLayoutProperty(id, 'visibility', visibility);
 }
}

function syncMapLabels() {
 setLabelVisibility('route-labels', mapLabelsVisible ? 'visible' : 'none');
}

function syncBasemapAnnotations() {
 if (basemapMode === 'nova' && novaStyle) {
  for (const {id, visibility} of novaStyle.annotations) {
   setLabelVisibility(id, basemapAnnotationsVisible ? visibility : 'none');
  }
 } else if (basemapMode === 'dark') {
  setLabelVisibility('basemap-labels', basemapAnnotationsVisible ? 'visible' : 'none');
 }
}

function updateViewButton(pitched) {
 const button = $('mapViewButton');
 button.setAttribute('aria-pressed', String(pitched));
 button.firstElementChild.textContent = pitched ? '2D' : '3D';
}

function toggleMapView() {
 if (!map) return;
 const pitched = $('mapViewButton').getAttribute('aria-pressed') === 'true';
 map.easeTo({pitch: pitched ? 0 : 55, duration: 450});
 updateViewButton(!pitched);
}

function selectDarkBasemap() {
 if (basemapMode !== 'dark' && basemapMode !== 'nova') selectBasemap('dark');
}

async function inspectMapFeature(event) {
  const feature = featureAt(event.point);
  if (!feature) return;
  const properties = feature.properties;
  if (feature.layer.id === 'vehicles-circle') {
    const vehicle = state.vehicles.find(row => keyFor(row) === keyFor(properties)) ?? properties;
    selectVehicle(vehicle, {follow: true});
    return;
  }
  clearVehicleSelection();
 tickerShowsRecording = false;
 const selection = networkSelection = {feature};
  updateSelectionUI();
  const info = await NETWORK.featureInformation(feature);
 if (networkSelection === selection) {
  selection.info = info;
  if (!tickerShowsRecording) {
   announceSelection(TICK.information(info.heading, info.fields, {accent: info.mode}));
  }
 }
}

function initMap(){
 if (loadedMap) return;
 if (!window.maplibregl || (basemapMode === 'nova' && !novaStyle)) {
  if (!usingFallback) renderFallbackMap();
  return;
 }
 try{
  const style=mapStyle();
  $('map').replaceChildren();map=new maplibregl.Map({container:'map',style,center:[138.6007,-34.9285],zoom:11,attributionControl:false});loadedMap=true;usingFallback=false;
  const slot = $('mapNavigation');
  const offlineButtons = [...slot.children];
  class MapNavigationControl extends maplibregl.NavigationControl {
    onAdd(instance) {
      const controls = super.onAdd(instance);
      controls.classList.replace('maplibregl-ctrl-group', 'map-native-navigation');
      this.deckElement = controls;
      return controls;
    }
    onRemove(instance) {
      super.onRemove(instance);
      slot.replaceChildren(...offlineButtons);
    }
  }
  // Keep MapLibre's control lifecycle and mount its buttons in the bottom panel.
  const navigation = new MapNavigationControl({visualizePitch:false});
  map.addControl(navigation);
  slot.replaceChildren(navigation.deckElement);
  map.addControl(new maplibregl.AttributionControl({compact:true}),'top-left');
  $('fitMapButton').disabled = false;
  $('mapViewButton').disabled = false;
 map.on('load', () => {
  filterModes();
  if (!playbackFollow?.center) fitHome();
  updatePlaybackCamera();
  setMapSelection();
  log('MapLibre loaded. Vehicle points available: ' + state.vehicles.length);
 });
  map.on('style.load',()=>{filterModes();syncMapLabels();syncBasemapAnnotations();renderNetwork();redrawVehiclePositions();});
  map.on('pitchend', () => updateViewButton(map.getPitch() > 0));
  map.on('zoom',()=>{if(bearingDegrees(selectedVehicle)!==null)redrawVehicleSelection();});
 map.on('click', inspectMapFeature);
 map.on('mousemove', event => {
   map.getCanvas().style.cursor = featureAt(event.point) ? 'pointer' : '';
 });
 map.getCanvas().addEventListener('mouseleave', () => { map.getCanvas().style.cursor = ''; });
  map.on('error',e=>log('Map resource warning: '+(e.error?.message||'Tile or style unavailable'),'WARN'));
  const observer=new ResizeObserver(()=>map?.resize());observer.observe($('map'));
 }catch(err){log('MapLibre initialization failed: '+err.message,'ERROR');if(map){try{map.remove();}catch(_){}map=null;}loadedMap=false;renderFallbackMap();}}
function renderFallbackMap() {
  $('fitMapButton').disabled = true;
  $('mapViewButton').disabled = true;
  if (loadedMap) return;
  usingFallback = true;
  const target = $('map');
  const wrap = document.createElement('div');
  wrap.className = 'fallback-map';
  const note = document.createElement('div');
  note.className = 'fallback-status';
  note.textContent = 'Schematic offline map. Connect to the internet for MapLibre tiles and live feeds.';
  wrap.append(note);

  const enabled = new Set(enabledVehicleTypes());
  const bounds = {minLon:138.43, maxLon:138.78, minLat:-35.06, maxLat:-34.74};
  for (const vehicle of state.vehicles) {
    if (!enabled.has(vehicle.VehicleType) || !hasCoordinates(vehicle)) continue;
    const [lon, lat] = displayCoordinates(vehicle);
    const x = (lon - bounds.minLon) / (bounds.maxLon - bounds.minLon);
    const y = (bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat);
    if (x < 0 || x > 1 || y < 0 || y > 1) continue;
    const selected = selectedKey === keyFor(vehicle);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fallback-pin ' + vehicle.VehicleType;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-label', `${vehicle.VehicleType} ${vehicle.RouteID}, vehicle ${vehicle.VehicleID}`);
    button.style.left = x * 100 + '%';
    button.style.top = y * 100 + '%';
    const bearing = selected ? bearingDegrees(vehicle) : null;
    if (bearing !== null) {
      button.classList.add('has-bearing');
      button.style.setProperty('--vehicle-bearing', bearing + 'deg');
    }
    button.addEventListener('click', () => selectVehicle(vehicle, {fly: false, follow: true}));
    wrap.append(button);
  }
  target.replaceChildren(wrap);
}
const cacheBust=url=>url+(url.includes('?')?'&':'?')+'_cb='+Date.now();
function validProtobuf(bytes){return bytes.byteLength>2&&new Uint8Array(bytes)[0]===0x0a;}
async function tryUrl(url, signal) {
  const timeout = AbortSignal.timeout(6500);
  const response = await fetch(url, {cache: 'no-store', signal: signal ? AbortSignal.any([signal, timeout]) : timeout});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = await response.arrayBuffer();
  if (!validProtobuf(bytes)) throw new Error('Not GTFS protobuf response');
  return bytes;
}
function proxyList(url, endpoint, custom) {
  const candidates = [['Direct endpoint', cacheBust(url)]];
  if (custom) {
    const target = custom.includes('{url}')
      ? custom.replace('{url}', encodeURIComponent(url))
      : custom.replace(/\/+$/, '') + '/' + endpoint;
    candidates.push(['Custom proxy', target]);
  }
  if (url === SNAP.baseUrl + '/' + endpoint) {
    candidates.push(
      ['Relative feed proxy', cacheBust('/api/gtfs/' + endpoint)],
      ['Published feed proxy', cacheBust('https://toolbox-gtfs-live-refresh.web.app/api/gtfs/' + endpoint)]
    );
  }
  candidates.push(['Local proxy', 'http://localhost:8080/proxy?url=' + encodeURIComponent(url)]);
  return candidates;
}
async function fetchFeed(endpoint, {baseUrl, customProxyUrl}, signal) {
  const url = baseUrl.replace(/\/+$/, '') + '/' + endpoint;
  let lastError;
  for (const [label, target] of proxyList(url, endpoint, customProxyUrl)) {
    signal?.throwIfAborted();
    try {
      log(`${endpoint}: fetching via ${label}`);
      const bytes = await tryUrl(target, signal);
      log(`${endpoint}: received ${bytes.byteLength} bytes via ${label}`, 'SUCCESS');
      return bytes;
    } catch (error) {
      lastError = error;
      log(`${endpoint}: ${label} failed — ${error.message}`, 'WARN');
    }
  }
  throw lastError || new Error('No feed request succeeded');
}

const feedSpecs = [
  ['vehicle_positions', 'vehicles', GTFS.parseVehicles],
  ['trip_updates', 'trips', GTFS.parseTrips],
  ['service_alerts', 'alerts', GTFS.parseAlerts]
];

async function loadStartupSnapshot(initialState) {
  try {
    const response = await fetch('./GTFS%20data/startup-snapshot.json', {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000)
    });
    if (!response.ok) return;
    const saved = await response.json();
    if (state !== initialState || mode !== 'snapshot' || $('refreshButton').disabled) return;
    const timestamp = Date.parse(saved.capturedAt);
    if (!Number.isFinite(timestamp) || !feedSpecs.every(([,key]) => Array.isArray(saved[key]))) return;
    savedCaptureTime = timestamp;
    state = Object.fromEntries(feedSpecs.map(([,key]) => [key, saved[key]]));
    state.vehicles = trackedVehicles(state.vehicles);
    mode = 'saved';
    renderFrame();
    $('refreshStatus').textContent = 'Showing the saved startup snapshot. Select Refresh latest feeds for current data.';
  } catch {
    // The bundled snapshot also works on hosts without a local capture.
  }
}
let beforePlayback;
const lastAppliedCapture = new Map();

function feedConfig() {
  return {baseUrl: SNAP.baseUrl};
}

function base64(data) {
  const bytes = new Uint8Array(data);
  const chunks = [];
  for (let start = 0; start < bytes.length; start += 8192) {
    chunks.push(String.fromCharCode(...bytes.subarray(start, start + 8192)));
  }
  return btoa(chunks.join(''));
}

async function capture(settings, includeRaw = true, signal) {
  const time = Date.now();
  const entries = await Promise.all(feedSpecs.map(async ([endpoint, , parse]) => {
    let raw;
    try {
      const data = await fetchFeed(endpoint, settings, signal);
      const fetchedAt = Date.now();
      if (includeRaw) raw = base64(data);
      return [endpoint, {time: fetchedAt, raw, rows: parse(data)}];
    } catch (error) {
      return [endpoint, {time: Date.now(), raw, error: error.message}];
    }
  }));
  return {time, feeds: Object.fromEntries(entries)};
}

function renderFrame() {
  selectedVehicle = selectedKey ? state.vehicles.find(row => keyFor(row) === selectedKey) : null;
  if (!selectedVehicle && !playbackFollow) selectedKey = null;
  render();
  updateSelectionUI();
}

function displayPlayback(frame, history, cursorTime, startedAt, interval, source) {
  beforePlayback ??= {state, mode, selectedKey};
  if (playbackFollow && source !== playbackSource) clearVehicleSelection();
  playbackSource = source;
  mode = 'playback';
  $('refreshButton').disabled = true;
  state = Object.fromEntries(feedSpecs.map(([endpoint, key]) => [key, frame.feeds[endpoint]?.rows ?? []]));
  state.vehicles = trackedVehicles(state.vehicles);
  window.MetroNetwork?.setPlayback(history.filter(item => item.feeds.vehicle_positions?.rows).map(item => ({
    time: item.time,
    vehicles: trackedVehicles(item.feeds.vehicle_positions.rows)
  })), cursorTime, startedAt, interval);
  renderFrame();
  $('sourceDescription').textContent = 'Recording · ' + new Date(frame.time).toLocaleString('en-AU');
}

function exitPlayback() {
  if (!beforePlayback) return;
  ({state, mode, selectedKey} = beforePlayback);
  beforePlayback = null;
  playbackSource = undefined;
  playbackFollow = null;
  $('refreshButton').disabled = $('refreshButton').getAttribute('aria-busy') === 'true';
  window.MetroNetwork?.setPlayback(null);
  renderFrame();
}

function applyLiveFrame(frame) {
  const live = beforePlayback ?? {state, mode};
  const updatedState = {...live.state};
  const failures = [];
  let successes = 0;
  for (const [endpoint, key] of feedSpecs) {
    if (frame.time <= (lastAppliedCapture.get(endpoint) ?? -Infinity)) continue;
    const result = frame.feeds[endpoint];
    if (!Array.isArray(result?.rows)) {
      failures.push(endpoint + ': ' + (result?.error || 'Feed unavailable'));
      continue;
    }
    updatedState[key] = key === 'vehicles' ? trackedVehicles(result.rows) : result.rows;
    lastAppliedCapture.set(endpoint, frame.time);
    successes++;
    if (key === 'vehicles') {
      live.mode = 'live';
      window.MetroNetwork?.addLiveFrame(updatedState.vehicles, frame.time);
    }
  }
  if (successes) {
    live.state = updatedState;
    if (!beforePlayback) {
      ({state, mode} = live);
      renderFrame();
    }
  }
  if (successes || failures.length) {
    const summary = successes + ' of ' + feedSpecs.length + ' feeds refreshed.'
      + (failures.length ? ' ' + failures.join(' · ') : '');
    $('refreshStatus').textContent = summary;
    log(summary, successes ? 'SUCCESS' : 'WARN');
  }
}

function applyRecordingFrame(frame) {
  try {
    applyLiveFrame(frame);
  } catch (error) {
    log('Could not display the recorded feed refresh: ' + error.message, 'ERROR');
  }
}

async function refresh() {
  const button = $('refreshButton');
  if (button.disabled || mode === 'playback') return;
  clearTimeout(dismissRefreshStatus);
  const status = $('refreshStatus');
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  status.classList.add('is-visible');
  status.textContent = 'Requesting latest GTFS data…';
  try {
    applyLiveFrame(await capture(feedConfig(), false));
  } finally {
    button.disabled = mode === 'playback';
    button.removeAttribute('aria-busy');
    dismissRefreshStatus = setTimeout(() => status.classList.remove('is-visible'), 7000);
  }
}
function exportLog(){const a=document.createElement('a');const blob=new Blob([debugEntries.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);a.href=url;a.download='AdelaideMetro_DebugLog_'+Date.now()+'.txt';a.click();URL.revokeObjectURL(url);}
function installActions(){
 $('homeButton').addEventListener('click',deselect);
 $('fitMapButton').addEventListener('click',fitMap);
 $('mapViewButton').addEventListener('click',toggleMapView);
 $('clearSelectionButton').addEventListener('click',clearSelection);
 $('mapLabelsButton').addEventListener('click', event => {
  mapLabelsVisible = !mapLabelsVisible;
  event.currentTarget.setAttribute('aria-pressed', String(mapLabelsVisible));
  syncMapLabels();
 });
 $('basemapAnnotationsButton').addEventListener('click', event => {
  basemapAnnotationsVisible = !basemapAnnotationsVisible;
  event.currentTarget.setAttribute('aria-pressed', String(basemapAnnotationsVisible));
  syncBasemapAnnotations();
 });
 document.querySelectorAll('[data-vehicle-toggle]').forEach(el=>el.addEventListener('change',filterModes));
 $('vehicleSearch').addEventListener('input',renderVehicles);
 $('refreshButton').addEventListener('click',refresh);
 $('exportLogButton').addEventListener('click',exportLog);
 $('clearLogButton').addEventListener('click',()=>{debugEntries.length=0;$('debugLogWindow').value='';log('Debug log cleared');});
}
function boot(){
  setupNavigation();setupBasemap();setupVehicleArt();installActions();
 setupMapPopovers();
 window.MetroRecording?.init({
  capture, config:feedConfig, refreshLive:applyRecordingFrame, statusChanged:updateRecordingStatus,
  display:displayPlayback, exit:exitPlayback
 });
  render();TICK.reset();
  selectBasemap(basemapMode);
  initMap();
  void loadStartupSnapshot(state);
  log('Adelaide Metro dashboard loaded');log('Original source: https://github.com/FraknToastr/toolbox-gtfs-live-refresh');
  log('Historical sample: '+state.vehicles.length+' vehicles, '+state.trips.length+' trips, '+state.alerts.length+' alerts.');
}
window.MetroApp={upgradeMap:()=>{if(!loadedMap)initMap();},selectTab,selectVehicle,refresh,selectBasemap,setHeaderVehicleFilter,
  debugState:()=>({basemap:basemapMode,filter:headerFilter,markers:state.vehicles.length,selected:selectedKey,usingFallback,loadedMap})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
