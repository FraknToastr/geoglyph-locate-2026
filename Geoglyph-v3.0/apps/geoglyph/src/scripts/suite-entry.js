// Resolve entry once before the map, sidebar and conference startup mount.
// Opening defaults must not be reapplied after the user changes a control.
(()=>{
  'use strict';
  const inbound=window.GeoGlyphSuite.consume('geoglyph');
  const root=document.documentElement;
  const fullscreenDisplay=window.matchMedia('(display-mode: fullscreen)');
  const isFullscreen=()=>Boolean(document.fullscreenElement)||fullscreenDisplay.matches;
  let presentation=null, handoffBeginId=inbound.value?.beginId;

  function restoreLayout(){
    presentation=null;
    root.classList.remove('geoglyph-presentation');
    window.GeoGlyphMapEngine?.resizeViewport();
  }

  function fullscreenChanged(){
    if(!presentation)return;
    if(isFullscreen())presentation.enteredFullscreen=true;
    else if(presentation.enteredFullscreen)restoreLayout();
  }

  async function requestBrowserFullscreen(view){
    if(!view||presentation!==view||view.requesting||isFullscreen()||!document.fullscreenEnabled)return;
    view.requesting=true;
    try{
      await root.requestFullscreen({navigationUI:'hide'});
      if(presentation)fullscreenChanged();
      else if(document.fullscreenElement===root)await document.exitFullscreen();
    }catch{
      // Browser fullscreen may require user activation. Keep the map-only view.
    }finally{
      view.requesting=false;
    }
  }

  async function requestWhenPermitted(view){
    if(view.enteredFullscreen)return;
    if(navigator.userActivation?.isActive){
      await requestBrowserFullscreen(view);
      return;
    }
    try{
      const permission=await navigator.permissions?.query({name:'fullscreen',allowWithoutGesture:true});
      if(permission?.state==='granted')await requestBrowserFullscreen(view);
    }catch{
      // Browsers without this permission still support a fullscreen gesture.
    }
  }

  function showPresentation(){
    if(presentation)return;
    const view={enteredFullscreen:isFullscreen(),requesting:false,triedClick:false};
    presentation=view;
    root.classList.add('geoglyph-presentation');
    window.GeoGlyphMapEngine?.resizeViewport();
    void requestWhenPermitted(view);
  }

  function presentBegin(objectId){
    // The launcher handoff already entered presentation before map startup.
    // Honor an exit during startup when this same submission is applied later.
    const alreadyHandled=handoffBeginId!==undefined&&handoffBeginId===objectId;
    handoffBeginId=undefined;
    if(!alreadyHandled)showPresentation();
  }

  document.addEventListener('fullscreenchange',fullscreenChanged);
  fullscreenDisplay.addEventListener?.('change',fullscreenChanged);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&presentation&&!isFullscreen())restoreLayout();
  });
  document.addEventListener('click',event=>{
    const view=presentation;
    if(!view||view.triedClick||view.requesting||isFullscreen()||!document.fullscreenEnabled||
      !event.isTrusted||!event.target?.closest?.('#geoglyphMap canvas'))return;
    view.triedClick=true;
    // A fullscreen gesture must not be interpreted as moving Geo's anchor.
    event.preventDefault();
    event.stopPropagation();
    void requestBrowserFullscreen(view);
  },true);

  window.GeoGlyphSuiteEntry=Object.freeze({...inbound,
    profile:window.GeoGlyphSuiteRouting.openingProfile(inbound.value?.launchReason),presentBegin});
  if(handoffBeginId!==undefined)showPresentation();
})();
