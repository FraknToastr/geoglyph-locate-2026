(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GeoGlyphArcgisAdmin=api;})(globalThis,function(){
'use strict';
const CLIENT='2i8ErWnjyQES93El', REDIRECT='urn:ietf:wg:oauth:2.0:oob', PORTAL='https://www.arcgis.com/sharing/rest';
function create({fetch:request=globalThis.fetch,crypto=globalThis.crypto,now=Date.now,timeoutMs=20000}={}){
  let token='',expires=0,pending=null,generation=0,username='',fullEdit=false;
  function clear(){generation++;token='';expires=0;pending=null;username='';fullEdit=false;}
  function authenticated(){if(token&&expires<=now())clear();return Boolean(token);}
  async function post(url,params={},credential=token){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{
      const response=await request(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({f:'json',...params,...(credential?{token:credential}:{})}).toString(),cache:'no-store',signal:controller.signal});
      if(!response.ok)throw Error('ArcGIS request failed (HTTP '+response.status+').');
      const json=await response.json();
      if(json.error){if([498,499].includes(json.error.code))clear();throw Error('ArcGIS rejected the request'+(json.error.code?' ('+json.error.code+')':'')+'. Check sign-in and permissions.');}
      return json;
    }catch(error){if(error.name==='AbortError')throw Error('ArcGIS request timed out; its outcome may be unknown.');throw error;}finally{clearTimeout(timer);}
  }
  function base64(bytes){return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  async function authorize(){
    if(!crypto?.getRandomValues)throw Error('This browser cannot create a secure sign-in request.');
    const owner=++generation,verifier=base64(crypto.getRandomValues(new Uint8Array(64)));
    const challenge=crypto.subtle?.digest?base64(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier)))):verifier;
    if(owner!==generation)throw Error('Sign-in was cancelled.');
    pending={verifier,created:now(),owner};
    return PORTAL+'/oauth2/authorize?'+new URLSearchParams({client_id:CLIENT,redirect_uri:REDIRECT,response_type:'code',code_challenge:challenge,code_challenge_method:challenge===verifier?'plain':'S256',state:base64(crypto.getRandomValues(new Uint8Array(24))),expiration:'120'});
  }
  async function login(value,{exchange=true}={}){
    const owner=generation;let candidate=value.trim(),lifetime=7200;
    if(!candidate)throw Error('Paste the returned code or access token.');
    if(exchange){const p=pending;if(!p||now()-p.created>900000)throw Error('Open ArcGIS sign-in again before exchanging a code.');
      const result=await post(PORTAL+'/oauth2/token',{client_id:CLIENT,grant_type:'authorization_code',code:candidate,redirect_uri:REDIRECT,code_verifier:p.verifier},'');
      if(!result.access_token)throw Error('ArcGIS returned no access token.');candidate=result.access_token;lifetime=Number(result.expires_in)||7200;
    }
    const user=await post(PORTAL+'/community/self',{},candidate);
    if(!user.username)throw Error('ArcGIS could not validate this account.');
    if(owner!==generation)throw Error('Sign-in was cancelled.');
    token=candidate;expires=now()+lifetime*1000;username=user.username;fullEdit=user.role==='org_admin'||user.privileges?.includes('features:user:fullEdit');pending=null;return username;
  }
  async function prepare(serviceUrl){
    if(!authenticated())throw Error('Sign in to ArcGIS first.');
    const owner=generation,service=await post(serviceUrl),layers=service.layers||[];
    if(layers.length!==1)throw Error('Expected one survey response layer; deletion target is ambiguous.');
    let url=serviceUrl+'/'+layers[0].id,meta=await post(url);
    if(!String(meta.capabilities).split(',').includes('Delete')){
      if(!meta.isView)throw Error('This survey layer does not permit deletion for this account.');
      const admin=await post(url.replace('/rest/services/','/rest/admin/services/'));
      const definition=admin.adminLayerInfo?.viewLayerDefinition;
      if(!definition?.sourceServiceName||!Number.isInteger(definition.sourceLayerId))throw Error('Cannot verify the survey source layer.');
      const name=definition.sourceServiceName;
      if(!/^[A-Za-z0-9_-]+$/.test(name))throw Error('Unsupported survey source service name.');
      url=serviceUrl.replace(/\/[^/]+\/FeatureServer$/, '/'+name+'/FeatureServer')+'/'+definition.sourceLayerId;
      meta=await post(url);
      if(meta.isView||!String(meta.capabilities).split(',').includes('Delete'))throw Error('The survey source does not permit deletion for this account.');
    }
    const ownership=meta.ownershipBasedAccessControlForFeatures;
    if(!fullEdit&&(ownership?.allowOthersToQuery===false||ownership?.allowOthersToDelete===false)){
      if(!meta.serviceItemId)throw Error('Cannot verify permission to delete all survey responses.');
      const item=await post(PORTAL+'/content/items/'+encodeURIComponent(meta.serviceItemId));
      if(item.owner!==username)throw Error('This survey requires its owner or an administrator to delete all responses.');
    }
    const result=await post(url+'/query',{where:'1=1',returnIdsOnly:'true'});
    if(result.exceededTransferLimit||!Array.isArray(result.objectIds)||!result.objectIds.every(Number.isSafeInteger))throw Error('Could not obtain the complete survey record list.');
    if(owner!==generation||!authenticated())throw Error('Sign-in changed while preparing deletion.');
    return Object.freeze({url,name:meta.name||layers[0].name,ids:Object.freeze([...new Set(result.objectIds)]),owner});
  }
  async function remove(plan){
    if(!authenticated()||plan.owner!==generation)throw Error('Sign-in changed; prepare Reset 123 again.');
    let deleted=0;
    for(let i=0;i<plan.ids.length;i+=200){
      if(!authenticated()||plan.owner!==generation)throw Error('Sign-in changed during deletion.');
      const ids=plan.ids.slice(i,i+200);
      const result=await post(plan.url+'/deleteFeatures',{objectIds:ids.join(','),rollbackOnFailure:'true'});
      if(!Array.isArray(result.deleteResults)||result.deleteResults.length!==ids.length||new Set(result.deleteResults.map(r=>r.objectId)).size!==ids.length||result.deleteResults.some(r=>!r.success)||result.deleteResults.some(r=>!ids.includes(r.objectId)))throw Error('Deletion was incomplete. Verify the survey before trying again.');
      deleted+=ids.length;
    }
    for(let i=0;i<plan.ids.length;i+=200){const remaining=await post(plan.url+'/query',{objectIds:plan.ids.slice(i,i+200).join(','),returnIdsOnly:'true'});if(!Array.isArray(remaining.objectIds)||remaining.objectIds.length)throw Error('Could not verify deletion. Inspect the survey before trying again.');}
    return deleted;
  }
  return {authorize,login,clear,authenticated,prepare,remove,get expiresAt(){return expires;},get username(){return authenticated()?username:'';}};
}
return {create};
});
