import { groundIcons } from './ground-icons.js';
const paths={
  plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
  expand:'<path d="m8 8 4-4 4 4M8 16l4 4 4-4M4 12h16"/>',collapse:'<path d="m8 4 4 4 4-4M8 20l4-4 4 4M4 12h16"/>',
  maximize:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  panel:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16"/>',
  type:'<path d="M4 5V3h16v2M12 3v18M8 21h8"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a5 5 0 0 0 5-5c0-3-4-5-9-5Z"/><path d="M7 9h.01M10 6h.01M15 6h.01M6 13h.01"/>',
  layers:'<path d="m3 7 9-4 9 4-9 4-9-4Zm0 5 9 4 9-4M3 17l9 4 9-4"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
  flip:'<path d="M12 3v18M3 7l6-3v16l-6-3V7Zm18 0-6-3v16l6-3V7Z"/>',
  blend:'<circle cx="8" cy="12" r="6"/><circle cx="16" cy="12" r="6"/>',
  heading:'<path d="M4 4v16M14 4v16M4 12h10M18 14l3-2v8"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3V7Z"/><circle cx="12" cy="13" r="4"/>',
  'map-pin':'<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  play:'<path d="m7 4 14 8-14 8V4Z"/>',pause:'<path d="M8 4v16M16 4v16"/>',stop:'<rect x="5" y="5" width="14" height="14"/>',
  next:'<path d="m5 5 10 7-10 7V5Zm14 0v14"/>',
  save:'<path d="M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"/>',
  folder:'<path d="M3 6h7l2 3h9v11H3V6Z"/>',file:'<path d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 13h8M8 17h8"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  copy:'<rect x="8" y="8" width="13" height="13"/><path d="M16 8V3H3v13h5"/>',
  refresh:'<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5m-4 8a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
  key:'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3m-6 0 3-3"/>',
  login:'<path d="M14 3h7v18h-7M3 12h13m-5-5 5 5-5 5"/>',
  exchange:'<path d="M3 7h18m-5-5 5 5-5 5M21 17H3m5-5-5 5 5 5"/>',
  check:'<path d="m4 12 5 5L20 6"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',
  up:'<path d="m5 15 7-7 7 7"/>',down:'<path d="m5 9 7 7 7-7"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>'
};
export function icon(name){return groundIcons[name]||`<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.file}</svg>`;}
export function installControlIcons(){
  const editor=document.getElementById('geoglyphMapEditor');if(!editor)return;
  const names={mapFitBtn:'maximize',mapCollapsedFitBtn:'maximize',mapCollapsedJpgBtn:'camera',mapCollapsedPngBtn:'camera',mapEditorCollapseBtn:'panel',
    mapLocalBeginBtn:'play',mapLocalResetBtn:'refresh',
    mapArcgisUseTokenBtn:'key',mapArcgisClearTokenBtn:'close',
    mapArcgisStartBtn:'play',mapArcgisPollBtn:'refresh',mapArcgisStopBtn:'stop',mapArcgisReset123Btn:'trash',mapArcgisIntervalMinus:'minus',mapArcgisIntervalPlus:'plus',
    mapFontRescanBtn:'refresh',mapScanSystemBtn:'type',mapCopyEsriPathBtn:'copy',mapLoadEsriBtn:'folder',mapExportObjBtn:'box',mapExportGeoJsonBtn:'file',mapSaveJpgBtn:'camera',mapSavePngBtn:'camera',
    mapEsriAerialBtn:'layers',mapEsriWorldBtn:'layers',mapMetroMapBtn:'layers',map3DView:'maximize',map3DOrbit:'orbit',mapMorphPrepare:'blend',mapMorphPlay:'play',mapMorphClear:'close',
    mapMetroMapCloseBtn:'close',mapMetroMapSaveBtn:'save',mapMetroMapRemoveBtn:'trash'};
  let pending=false;
  function sync(){
    pending=false;
    for(const button of document.querySelectorAll('#geoglyphMapEditor button, #mapMetroMapDialog button')){
      const mark=button.querySelector('.module-collapse-mark');
      if(mark){if(!mark.querySelector('svg'))mark.innerHTML=icon(button.getAttribute('aria-expanded')==='false'?'plus':'minus');continue;}
      if(button.querySelector('svg')||button.classList.contains('studio-swatch'))continue;
      const name=button.dataset.collapseAll?button.dataset.collapseAll:button.dataset.mapMode?({message:'type',arcgis:'box',admin:'layers'}[button.dataset.mapMode]):button.dataset.mapColourTarget?'palette':button.id==='mapMorphPlay'&&button.textContent==='Pause'?'pause':names[button.id];
      if(!name)continue;
      const only=button.matches('.map-editor-collapse,.map-header-fit,.map-collapsed-fit,[data-collapse-all],#mapArcgisIntervalMinus,#mapArcgisIntervalPlus');
      if(only){if(!button.getAttribute('aria-label'))button.setAttribute('aria-label',button.textContent.trim());button.replaceChildren();}
      else {const caption=document.createElement('span');caption.className='icon-caption';while(button.firstChild)caption.append(button.firstChild);button.append(caption);}
      button.insertAdjacentHTML('afterbegin',icon(name));
      button.classList.add('map-icon-button');
    }
  }
  const observer=new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(sync);}});
  observer.observe(editor,{childList:true,subtree:true,characterData:true});
  const dialog=document.getElementById('mapMetroMapDialog');if(dialog)observer.observe(dialog,{childList:true,subtree:true,characterData:true});
  sync();
}
