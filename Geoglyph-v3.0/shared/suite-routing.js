(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else {root.GeoGlyphSuiteRouting=api;root.GeoGlyphSuite=api.browser(root);}
})(globalThis,function(){
  'use strict';
  const apps=Object.freeze({
    geoglyph:Object.freeze({label:'Geoglyph',command:'Launch Geoglyph',path:'apps/geoglyph/index.html'}),
    transitron:Object.freeze({label:'Transitron',command:'Launch Transitron',path:'http://127.0.0.1:8090/'}),
    panoptigon:Object.freeze({label:'Panoptigon',command:'Launch Panoptigon',path:'apps/panoptigon/index.html'}),
    umbramatic:Object.freeze({label:'Umbramatic',command:'Launch Umbramatic',path:'apps/umbramatic/ShadowPlayer/index.html'}),
    'assassins-leaves':Object.freeze({label:'Assassin’s Leaves',command:"Launch Assassin's Leaves",path:null})
  });
  function commandValue(raw){
    const attributes=raw?.attributes||raw||{},field=Object.keys(attributes).find(key=>key.toLowerCase()==='special_commands');
    return field===undefined?'':String(attributes[field]??'').trim().toLowerCase();
  }
  const beginCommand=raw=>commandValue(raw)==='begin geoglyph';
  function launchCommand(raw){
    const attributes=raw?.attributes||raw||{},field=Object.keys(attributes).find(key=>key.toLowerCase()==='special_commands');
    const value=String(attributes[field]??'').trim(),match=/^launch(?:\s+(.*))?$/i.exec(value);
    if(!match)return null;
    const name=(match[1]||'').trim();
    const command=('launch '+name).toLowerCase().replace(/’/g,"'");
    const target=Object.keys(apps).find(id=>apps[id].command.toLowerCase()===command);
    return {target:target||null,label:name||'(missing app)'};
  }
  const unlinkedMessage=target=>apps[target].label+' hasn’t been linked yet.';
  function validateHandoff(value,serviceUrl){
    if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1||!['launcher',...Object.keys(apps)].includes(value.app))throw Error('Invalid launcher handoff');
    if(value.source!==serviceUrl||typeof serviceUrl!=='string'||!serviceUrl.startsWith('https://'))throw Error('Survey source does not match this suite');
    for(const key of ['cursor','layerId'])if(value[key]!==null&&(!Number.isSafeInteger(value[key])||value[key]<0))throw Error('Invalid survey '+key);
    if(value.cursor!==null&&value.layerId===null)throw Error('Submission cursor requires a results layer');
    if(typeof value.active!=='boolean'||!Number.isInteger(value.interval)||value.interval<1||value.interval>3600)throw Error('Invalid survey polling settings');
    if(value.launchReason!==undefined&&!['manual','survey'].includes(value.launchReason))throw Error('Invalid launcher entry reason');
    if(value.beginId!==undefined&&(value.app!=='geoglyph'||value.launchReason!=='survey'||!Number.isSafeInteger(value.beginId)||value.beginId<=0||value.beginId!==value.cursor))throw Error('Invalid Begin Geoglyph submission');
    if(value.returnFrom!==undefined&&(value.app!=='launcher'||typeof value.returnFrom!=='string'||!Object.hasOwn(apps,value.returnFrom)||!apps[value.returnFrom].path))throw Error('Invalid returning app');
    return {version:1,app:value.app,source:serviceUrl,cursor:value.cursor,layerId:value.layerId,interval:value.interval,active:value.active,
      ...(value.launchReason===undefined?{}:{launchReason:value.launchReason}),
      ...(value.beginId===undefined?{}:{beginId:value.beginId}),
      ...(value.returnFrom===undefined?{}:{returnFrom:value.returnFrom})};
  }
  function openingProfile(launchReason){
    const survey=launchReason==='survey';
    return Object.freeze({mode:survey?'arcgis':'message',presentation:survey?'mini':'full',expandMessage:!survey});
  }
  function decodeHandoff(hash,serviceUrl,app){
    const params=new URLSearchParams(String(hash||'').replace(/^#/,''));
    if(!params.has('suite'))return null;
    const encoded=params.get('suite');if(encoded.length>2048)throw Error('Launcher handoff is too large');
    const value=validateHandoff(JSON.parse(encoded),serviceUrl);
    if(value.app!==app)throw Error('Launcher handoff belongs to a different app');
    return value;
  }
  function destination(root,target,state,serviceUrl){
    if(target!=='launcher'&&!Object.hasOwn(apps,target))throw Error('Unknown launcher app');
    if(target!=='launcher'&&!apps[target].path)throw Error(unlinkedMessage(target));
    const base=new URL(root);if(!['file:','http:','https:'].includes(base.protocol))throw Error('Unsupported launcher location');
    const handoff=validateHandoff({...state,version:1,source:serviceUrl,app:target},serviceUrl);
    const route=target==='launcher'?'index.html':apps[target].path;
    const url=new URL(route,base);
    // The fixed Transitron URL owns the live feeds and its browser recordings.
    if(target!=='transitron'&&(url.protocol!==base.protocol||url.host!==base.host||!url.pathname.startsWith(new URL('./',base).pathname)))throw Error('Invalid launcher destination');
    url.hash=new URLSearchParams({suite:JSON.stringify(handoff)}).toString();return url.href;
  }
  function suiteRoot(href){
    const url=new URL(href);
    const appIndex=Math.max(...Object.keys(apps).map(id=>url.pathname.lastIndexOf('/apps/'+id+'/')));
    if(appIndex>=0){url.pathname=url.pathname.slice(0,appIndex+1);url.search='';url.hash='';return url.href;}
    return new URL('./',url).href;
  }
  function browser(host){
    let options=null,navigating=false;
    // Reload on browser Back/Forward when the page cache restores disposed
    // WebGL, audio or polling jobs. Each page applies its own startup policy.
    host.addEventListener?.('pageshow',event=>{if(event.persisted)host.location.reload();});
    return Object.freeze({
      configure(value){options=value;},
      consume(app){
        const source=host.GeoGlyphSurveyResults.config.serviceUrl;
        let value=null,error='';
        try{value=decodeHandoff(host.location.hash,source,app);}catch(reason){error=reason.message;}
        const url=new URL(host.location.href),params=new URLSearchParams(url.hash.slice(1));
        if(params.has('suite')){params.delete('suite');url.hash=params.toString();try{host.history.replaceState(host.history.state,'',url.href);}catch{/* file browsers may restrict history changes */}}
        return {value,error};
      },
      async navigate(target,{launchReason='manual',beginId,returnFrom}={}){
        if(navigating)return false;
        if(!options)throw Error('Launcher navigation is not ready');
        const url=destination(options.root||suiteRoot(host.location.href),target,{...options.checkpoint(),launchReason,beginId,returnFrom},host.GeoGlyphSurveyResults.config.serviceUrl);
        navigating=true;
        try{await options.release?.();host.location.assign(url);return true;}catch(error){navigating=false;throw error;}
      },
      isNavigating:()=>navigating
    });
  }
  // A finite, single-owner poller for the launcher. Geoglyph retains its renderer's existing queue.
  function createPoller({client,onState=()=>{},onLayers=()=>{},onLaunch=()=>{},onNotice=()=>{},handoff=null,currentApp='launcher'}){
    const state={active:handoff?.active||false,busy:false,interval:handoff?.interval||1,layerId:handoff?.layerId??null,cursor:handoff?.cursor??null,status:'Polling stopped. Choose Start or Fetch.',kind:'info'};
    let layers=null,timer=0,controller=null,generation=0,disposed=false;
    const publish=()=>onState({...state});
    function stop(status){generation++;clearTimeout(timer);timer=0;controller?.abort();controller=null;state.active=false;state.busy=false;if(status)state.status=status;publish();}
    function schedule(){clearTimeout(timer);timer=0;if(!disposed&&state.active&&!state.busy)timer=setTimeout(()=>{timer=0;void fetchOnce();},state.interval*1000);}
    async function fetchOnce(){
      if(disposed||state.busy)return false;
      clearTimeout(timer);timer=0;const own=generation,job=new AbortController();controller=job;state.busy=true;state.status='Checking Survey123…';state.kind='info';publish();
      const current=()=>!disposed&&generation===own&&!job.signal.aborted;
      try{
        if(!layers){const found=await client.discover({signal:job.signal});if(!current())return false;layers=found;if(layers.length===1&&state.layerId===null)state.layerId=layers[0].id;onLayers(layers,state.layerId);}
        const layer=layers.find(layer=>layer.id===state.layerId);
        if(!layer){const error=Error('Choose a results layer, then Start or Fetch.');error.kind='selection';throw error;}
        if(state.cursor===null){const latest=await client.latestCue(layer,{signal:job.signal});if(!current())return false;state.cursor=latest?.objectId??0;state.status='Connected · Waiting for a new launch command';}
        else {
          const rows=await client.afterCues(layer,state.cursor,{signal:job.signal,maxRows:100});if(!current())return false;
          state.status='Connected · Waiting for a new launch command';
          for(const row of rows){
            if(!Number.isSafeInteger(row.objectId)||row.objectId<=state.cursor)throw Error('Invalid submission ordering');
            state.cursor=row.objectId;
            if(currentApp!=='launcher'&&commandValue(row)==='return to launcher'){
              state.status='Returning to Launcher…';publish();
              await onLaunch('launcher',{});return true;
            }
            const begin=beginCommand(row);
            const command=begin?{target:'geoglyph'}:launchCommand(row);
            if(!command)continue;
            if(!command.target){state.kind='warn';state.status='Unknown launch target: '+command.label;continue;}
            if(command.target===currentApp)continue;
            if(!apps[command.target].path){
              state.kind='warn';state.status=unlinkedMessage(command.target);
              onNotice(state.status);
              continue;
            }
            state.status='Opening '+apps[command.target].label+'…';publish();
            await onLaunch(command.target,begin?{beginId:row.objectId}:{});return true;
          }
        }
        return true;
      }catch(error){
        if(!current())return false;
        if(['access','schema','selection'].includes(error.kind))state.active=false;
        state.kind='warn';state.status=error.message||'Could not reach Survey123';return false;
      }finally{if(current()){controller=null;state.busy=false;publish();schedule();}}
    }
    return Object.freeze({
      state:()=>({...state}),fetch:fetchOnce,
      start(){if(disposed)return Promise.resolve(false);state.active=true;publish();return fetchOnce();},
      stop(){stop('Polling stopped.');},
      setInterval(value){if(!Number.isInteger(value)||value<1||value>3600)throw Error('Poll interval must be 1–3600 seconds');state.interval=value;publish();schedule();},
      selectLayer(id){if(!layers?.some(layer=>layer.id===id))throw Error('Choose a valid results layer');stop();state.layerId=id;state.cursor=null;state.status='Results layer changed. Choose Start or Fetch.';publish();},
      dispose(){disposed=true;stop();},
      resume(){if(state.active)return fetchOnce();publish();return Promise.resolve(false);}
    });
  }
  return Object.freeze({apps,launchCommand,beginCommand,unlinkedMessage,validateHandoff,decodeHandoff,destination,suiteRoot,browser,createPoller,openingProfile});
});
