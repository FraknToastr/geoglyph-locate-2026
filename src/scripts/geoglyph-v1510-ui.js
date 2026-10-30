
window.addEventListener("DOMContentLoaded",()=>{
  document.title=GeoGlyphVersion.title;
  const toolbarRow=document.querySelector(".glyph-toolbar .favourites-toolbar-row");
  const buttonBar=toolbarRow?.querySelector(":scope > .button-bar");
  const count=document.getElementById("favouritesCount");
  const ordered=["codeGridBtn","favouritesBtn","copyCodeBtn","useSymbolBtn","addFavouriteBtn"]
    .map(id=>document.getElementById(id)).filter(Boolean);
  if(toolbarRow&&buttonBar){
    ordered.forEach(button=>{
      button.classList.remove("header-favourite-btn");
      buttonBar.appendChild(button);
    });
    const favouritesButton=document.getElementById("favouritesBtn");
    if(count&&favouritesButton) favouritesButton.insertAdjacentElement("afterend",count);
  }
});
