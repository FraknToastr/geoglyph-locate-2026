(()=>{
  'use strict';
  const $=id=>document.getElementById(id),suite=window.GeoGlyphSuite;
  const {apps,unlinkedMessage}=window.GeoGlyphSuiteRouting;
  function showLaunchNotice(message){
    const status=$('suiteLaunchStatus');
    if(status){status.textContent=message;status.hidden=!message;}
  }
  const inbound=suite.consume('launcher');
  const poller=GeoGlyphSuiteRouting.createPoller({
    client:GeoGlyphSurveyResults.create(),handoff:inbound.value,
    onState(state){
      $('suiteSurveyStart').disabled=state.active;
      $('suiteSurveyFetch').disabled=state.busy;
      $('suiteSurveyStop').disabled=!state.active&&!state.busy;
      $('suiteSurveyInterval').value=String(state.interval);
      $('suiteSurveyStatus').textContent=state.status;$('suiteSurveyStatus').dataset.state=state.kind;
    },
    onLayers(layers,selected){
      const select=$('suiteSurveyLayer');select.replaceChildren(new Option('Choose results layer',''),...layers.map(layer=>new Option(layer.name,String(layer.id))));
      select.hidden=layers.length===1;$('suiteSurveyLayerField').hidden=layers.length===1;select.value=selected===null?'':String(selected);
    },
    onNotice:showLaunchNotice,
    onLaunch:(target,{beginId})=>suite.navigate(target,{launchReason:'survey',beginId})
  });
  suite.configure({checkpoint:()=>poller.state(),release:async()=>{poller.dispose();await window.UOSLauncher?.prepareNavigation?.();}});
  $('suiteSurveyStart').onclick=()=>void poller.start();
  $('suiteSurveyFetch').onclick=()=>void poller.fetch();
  $('suiteSurveyStop').onclick=()=>poller.stop();
  $('suiteSurveyLayer').onchange=event=>{try{if(event.target.value==='')throw Error('Choose a results layer');poller.selectLayer(Number(event.target.value));}catch(error){$('suiteSurveyStatus').textContent=error.message;}};
  $('suiteSurveyInterval').onchange=event=>{
    try{poller.setInterval(Number(event.target.value));}catch(error){$('suiteSurveyStatus').textContent=error.message;event.target.value=String(poller.state().interval);}
  };
  for(const control of document.querySelectorAll('[data-launch-app]')){
    const target=control.dataset.launchApp;
    if(!Object.hasOwn(apps,target))continue;
    if(apps[target].path&&control.tagName==='A')control.href=apps[target].path;
    control.addEventListener('click',event=>{
      if(!apps[target].path){event.preventDefault();showLaunchNotice(unlinkedMessage(target));return;}
      if(control.tagName==='A'&&(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey))return;
      event.preventDefault();
      void suite.navigate(target).catch(error=>showLaunchNotice(error.message));
    });
  }
  window.addEventListener('pagehide',()=>poller.stop());
  window.GeoGlyphLauncherSurvey=poller;
  if(inbound.error){
    void poller.resume();
    $('suiteSurveyStatus').textContent=inbound.error+'. Polling remains stopped.';
  }else if(inbound.value?.returnFrom){
    void poller.resume();
  }else{
    void poller.start();
  }
})();
