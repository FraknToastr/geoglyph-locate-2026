
window.addEventListener("DOMContentLoaded",()=>{
  document.title=GeoGlyphVersion.title;
  const api=window.GeoGlyphStudio;
  if(!api)return;

  const grid=document.getElementById("glyphGrid");
  const selectedUnicode=document.getElementById("selectedUnicode");
  const drawer=document.getElementById("explorerDrawer");
  let revealQueued=false;
  let lastSelectionKey='',pendingReveal;

  function selectionKey(){
    return JSON.stringify([api.state.selectedFontId,api.state.selectedCode,api.state.gridView,
      api.state.rangeStart,api.state.rangeCount,document.getElementById('glyphSearch')?.value,
      document.body.classList.contains('drawer-open')]);
  }

  function revealCurrentSelection(){
    revealQueued=false;
    if(!grid||!document.body.classList.contains("drawer-open"))return;
    const code=Number(api.state.selectedCode);
    const active=grid.querySelector(`.glyph-cell[data-code="${code}"]`);
    if(!active)return;
    grid.querySelectorAll(".glyph-cell.is-active").forEach(cell=>cell.classList.toggle("is-active",cell===active));
    active.classList.add("is-active");
    active.setAttribute("aria-current","true");
    const pending=pendingReveal;
    window.requestAnimationFrame(()=>{
      // Paging must not be undone by a delayed selection reveal or by the
      // mutations that recycle virtual cells during ordinary scrolling.
      if(!pending||pending.key!==selectionKey()||pending.pageVersion!==(grid._pageNavigationVersion||0))return;
      const current=grid.querySelector(`.glyph-cell[data-code="${code}"]`);
      if(!current)return;
      const cellTop=current.offsetTop;
      const cellBottom=cellTop+current.offsetHeight;
      if(cellTop<grid.scrollTop)grid.scrollTop=cellTop;
      else if(cellBottom>grid.scrollTop+grid.clientHeight)grid.scrollTop=cellBottom-grid.clientHeight;
    });
  }

  function queueReveal(force=false){
    const key=selectionKey();
    if(!force&&key===lastSelectionKey)return;
    lastSelectionKey=key;
    pendingReveal={key,pageVersion:grid?._pageNavigationVersion||0};
    if(revealQueued)return;
    revealQueued=true;
    window.requestAnimationFrame(()=>window.requestAnimationFrame(revealCurrentSelection));
  }

  if(grid)new MutationObserver(()=>queueReveal()).observe(grid,{childList:true,subtree:true});
  if(selectedUnicode)new MutationObserver(()=>queueReveal()).observe(selectedUnicode,{childList:true,characterData:true,subtree:true});
  new MutationObserver(()=>queueReveal()).observe(document.body,{attributes:true,attributeFilter:["class"]});
  drawer?.addEventListener("click",event=>{
    if(event.target.closest("[data-font-id],#codeGridBtn,#favouritesBtn,#applyRange,#resetRange,#emojiRange,[data-character-set]"))queueReveal(true);
  });
  queueReveal();
});
