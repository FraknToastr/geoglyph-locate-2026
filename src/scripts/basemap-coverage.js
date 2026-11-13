(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.GeoGlyphBasemapCoverage=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const installed=new WeakMap();
  // Elevated model cameras may look beyond the single finite basemap. Keeping
  // the whole viewport inside that world would move the model's camera target.
  // Projection clones use the same policy without changing tile world copies.
  function preserveCameraTarget(transform,enabled=()=>true){
    const constrain=transform?.getConstrained;
    if(typeof constrain!=='function')return null;
    function modelConstraints(center,zoom){
      const result=constrain.call(this,center,zoom);
      if(!enabled()||this.lngRange)return result;
      result.center.lng=center.lng;
      result.center.lat=Math.max(-85.051129,Math.min(85.051129,center.lat));
      result.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,+zoom));
      return result;
    }
    transform.getConstrained=modelConstraints;
    return ()=>{if(transform.getConstrained===modelConstraints)transform.getConstrained=constrain;};
  }
  // Compatibility adapter for the bundled MapLibre 5.3 Mercator transform.
  // Keep automatic near/far calculation, including its native safety margins.
  function install(map){
    const transform=map&&map.transform;
    if(!transform)return false;
    if(installed.has(transform))return true;
    const calculate=transform._calculateNearFarZIfNeeded;
    const helper=transform._helper;
    const provider=transform.getCoveringTilesDetailsProvider?.();
    if(typeof calculate!=='function'||!helper||!Number.isFinite(helper._farZ)||typeof provider?.getTileAABB!=='function')return false;
    const tileAABB=provider.getTileAABB;
    function extendedFarPlane(...args){
      const result=calculate.apply(this,args);
      if(this.autoCalculateNearFarZ&&Number.isFinite(this._helper._farZ))this._helper._farZ*=1.1;
      return result;
    }
    function groundTileBounds(tileID,wrap,elevation,options){
      // Flat raster tiles lie at sea level, even when the camera targets a
      // raised model. Leave MapLibre's terrain min/max calculation intact.
      return tileAABB.call(this,tileID,wrap,options?.terrain?elevation:0,options);
    }
    transform._calculateNearFarZIfNeeded=extendedFarPlane;
    provider.getTileAABB=groundTileBounds;
    const restoreConstraints=preserveCameraTarget(transform,()=>map.getCenterClampedToGround?.()===false);
    installed.set(transform,true);
    map.once?.('remove',()=>{
      if(transform._calculateNearFarZIfNeeded===extendedFarPlane)transform._calculateNearFarZIfNeeded=calculate;
      if(provider.getTileAABB===groundTileBounds)provider.getTileAABB=tileAABB;
      restoreConstraints?.();
      installed.delete(transform);
    });
    return true;
  }
  return {install,preserveCameraTarget};
});
