(()=>{
  'use strict';
  const suite=window.GeoGlyphSuite,inbound=window.GeoGlyphSuiteEntry;
  let leaving=false;
  const button=document.createElement('button');button.id='suiteReturnLauncher';button.type='button';button.className='square-btn suite-return';
  button.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 5H4v14h6M4 12h16m-5-5 5 5-5 5"/></svg><span>Return to launcher</span>';
  button.title='Return to launcher';button.setAttribute('aria-label','Return to launcher');
  function checkpoint(){
    const map=window.GeoGlyphMapEngine?.state;
    const layerId=map?map.arcgisLayerId:inbound.value?.layerId??null;
    const cursor=window.GeoGlyphConference?window.GeoGlyphConference.surveyCursor(layerId):inbound.value?.cursor??null;
    return {layerId,cursor:layerId===null?null:cursor,
      interval:Number(document.getElementById('mapArcgisInterval')?.value)||inbound.value?.interval||1,
      active:map?.arcgisPolling??inbound.value?.active??false};
  }
  function release(){
    leaving=true;
    window.GeoGlyphMapEngine?.stopPolling({quiet:true});
    window.GeoGlyphScripts?.stop();window.GeoGlyphConference?.shutdown();
    window.GeoGlyph3D?.stopOrbit({freezePose:true});window.GeoGlyphMapEngine?.cancelCameraFlight();
  }
  suite.configure({checkpoint,release});
  button.onclick=()=>void suite.navigate('launcher').catch(error=>{leaving=false;window.GeoGlyphMapEngine?.setConnectionStatus(error.message,'warn');});
  async function boot(){
    document.querySelector('.header-actions,.top-actions,.workflow-nav')?.append(button);
    if(inbound.value?.cursor!==null&&inbound.value?.cursor!==undefined)window.GeoGlyphConference?.restoreSurveyCursor(inbound.value.cursor,inbound.value.layerId,inbound.value.beginId);
    if(!inbound.value){if(inbound.error)window.GeoGlyphMapEngine?.setConnectionStatus(inbound.error+'. Polling remains stopped.','warn');return;}
    if(window.GeoGlyphMapEngine)window.GeoGlyphMapEngine.state.arcgisLayerId=inbound.value.layerId;
    try{
      if(window.GeoGlyphConference&&!await window.GeoGlyphConference.retryStartup())return;
      if(leaving)return;
      const map=window.GeoGlyphMapEngine.state;
      if(inbound.value.layerId!==null)map.arcgisLayerId=inbound.value.layerId;
      document.getElementById('mapArcgisInterval').value=String(inbound.value.interval);
      if(inbound.value.active)await window.GeoGlyphMapEngine.startPolling();
      if(!leaving&&inbound.value.beginId!==undefined)window.GeoGlyphConference?.runHandoffBegin(inbound.value.layerId);
    }catch(error){if(!leaving)window.GeoGlyphMapEngine?.setConnectionStatus('Survey handoff failed: '+error.message,'warn');}
  }
  window.addEventListener('pagehide',release);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>void boot(),{once:true});else void boot();
})();
