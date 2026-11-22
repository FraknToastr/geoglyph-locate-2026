
window.addEventListener("DOMContentLoaded",()=>{
  document.title=GeoGlyphVersion.title;
  const api=window.GeoGlyphStudio;if(!api)return;
  const state=api.state;
  /* Validate the corrected five-target colour model. */
  if(!state.colourTargets){return;}
  const body=document.body;
  const suggested=()=>body.dataset.workflow==="symbol"?"symbol":"qrFg";
  if(!Object.prototype.hasOwnProperty.call(state.colourTargets,state.colourTarget))state.colourTarget=suggested();
  api.syncControlsFromState();api.renderPreview();
});
