
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    if (!api) return;
    const state = api.state;
    const $ = id => document.getElementById(id);
    const STORAGE_KEY = "geoglyph-locate2026.geoglyph-v1512-ui";
    const exportPanel = document.querySelector(".export-panel");
    const exportGroups = [...(exportPanel?.querySelectorAll(".export-group") || [])];
    const previewHead = document.querySelector(".preview-panel-head");
    const controlsTitle = document.querySelector(".right-panel>.panel-head .panel-title");

    /* Merge Unicode Range and Character Set into their original combined footprint. */
    const explorerControls=document.querySelector(".font-explorer-controls");
    const optionBlocks=[...(explorerControls?.querySelectorAll(":scope>.option-block")||[])];
    const unicodeBlock=optionBlocks.find(block=>block.querySelector(".option-title")?.textContent.trim()==="Unicode range");
    const characterBlock=optionBlocks.find(block=>block.querySelector(".option-title")?.textContent.trim()==="Character set");
    const characterSetBar=$("characterSetBar");
    if(unicodeBlock&&characterBlock&&characterSetBar){
      unicodeBlock.classList.add("v1512-unicode-character-section");
      unicodeBlock.querySelector(".option-title").textContent="Unicode Range & Character Set";
      const unicodeBar=unicodeBlock.querySelector(":scope>.button-bar");
      const actionRow=document.createElement("div");actionRow.className="v1512-unicode-character-actions";
      $("emojiRange")?.remove();
      unicodeBar?.before(actionRow);if(unicodeBar)actionRow.append(unicodeBar);
      ["all","letters","symbols","emoji"].forEach(name=>{const button=characterSetBar.querySelector(`[data-character-set="${name}"]`);if(button)characterSetBar.append(button);});
      actionRow.append(characterSetBar);characterBlock.remove();
    }

    /* Context-sensitive Export plus exact output-name previews. */
    const qrGroup = exportGroups[0], symbolGroup = exportGroups[1];
    if (qrGroup) qrGroup.dataset.exportContext = "qr";
    if (symbolGroup) symbolGroup.dataset.exportContext = "symbol";
    let qrExportKind = "png", symbolExportKind = "png";
    function addNamePreview(input, suffix) {
      if (!input) return null;
      const line = document.createElement("div");
      line.className = "v1512-export-name-preview";
      const row = input.closest(".control-row");
      if (row?.closest(".export-details-row")) row.append(line);
      else row?.insertAdjacentElement("afterend", line);
      const update = () => { line.innerHTML = `Output: <strong>${String(input.value || "geoglyph").trim().replace(/[^\w.-]+/g,"-") || "geoglyph"}${suffix()}</strong>`; };
      input.addEventListener("input", update); update(); return update;
    }
    const updateQrName = addNamePreview($("fileName"), () => qrExportKind === "vector" ? "-vector.svg" : `-${state.preview}.${qrExportKind}`);
    const updateSymbolName = addNamePreview($("symbolFileName"), () => `.${symbolExportKind}`);
    qrGroup?.addEventListener("click", event => {
      const id = event.target.closest("button")?.id;
      if (id === "exportQrPngBtn") qrExportKind = "png";
      else if (id === "exportQrSvgBtn") qrExportKind = "svg";
      else if (id === "exportQrExperimentalSvgBtn") qrExportKind = "vector";
      updateQrName?.();
    });
    symbolGroup?.addEventListener("click", event => {
      const id = event.target.closest("button")?.id;
      if (id === "exportSymbolPngBtn") symbolExportKind = "png";
      else if (id === "exportSymbolSvgBtn") symbolExportKind = "svg";
      updateSymbolName?.();
    });
    function workflow() { return document.body.dataset.workflow || "qr"; }
    function syncContext() {
      const mode = workflow();
      const exportTitle = exportPanel?.querySelector('.panel-title');
      if (exportTitle) exportTitle.textContent = mode === 'symbol' ? 'Export Symbol' : mode === 'magic-eye' ? 'Export Magic Eye' : 'Export QART';
      // The shared colour editor chooses an applicable destination without
      // resetting a user's still-valid selection on every workflow change.
      if (qrGroup) qrGroup.hidden = mode === "symbol";
      if (symbolGroup) symbolGroup.hidden = mode !== "symbol";
      if (controlsTitle) controlsTitle.innerHTML = `Controls <span class="v1512-workflow-context">· ${mode === "symbol" ? "Font Symbol" : mode === "magic-eye" ? "Magic Eye" : mode === "qreverse" ? "QReverse" : "QART"}</span>`;
      updateQrName?.(); updateSymbolName?.(); updateCapacity(); updateWarning();
    }

    /* Capacity meter. */
    const stats = $("qrCharacterStats");
    const capacity = document.createElement("div");
    capacity.className = "v1512-capacity";
    capacity.innerHTML = '<div class="v1512-capacity-track"><span class="v1512-capacity-fill"></span></div><span class="v1512-capacity-label"></span>';
    $("qrContentPanel")?.querySelector('.content-label-row')?.insertAdjacentElement("afterend", capacity);
    const QR_LIMITS = { L:2953, M:2331, Q:1663, H:1273 };
    function updateCapacity() {
      const used = Array.from($("qrInput")?.value || "").length;
      const limit = QR_LIMITS[state.qrLevel] || 1273;
      const ratio = used / limit;
      const fill = capacity.querySelector(".v1512-capacity-fill");
      fill.style.width = `${Math.min(100, ratio * 100)}%`;
      fill.classList.toggle("is-warn", ratio >= .8 && ratio <= 1);
      fill.classList.toggle("is-error", ratio > 1);
      capacity.querySelector(".v1512-capacity-label").textContent = `${Math.round(ratio * 100)}% · ${state.qrLevel}`;
    }
    $("qrInput")?.addEventListener("input", updateCapacity);
    $("correctionBar")?.addEventListener("click", () => window.setTimeout(updateCapacity, 0));

    /* Non-blocking scan-confidence guidance. */
    const warning = document.createElement("section");
    warning.className = "v1512-scan-warning";
    warning.setAttribute("role", "status");
    warning.setAttribute('aria-label', 'Scan reliability');
    warning.tabIndex = 0;
    document.querySelector('.preview-panel')?.append(warning);
    function hexLuminance(hex) {
      if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return .5;
      const c = hex.slice(1).match(/../g).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
      return .2126*c[0]+.7152*c[1]+.0722*c[2];
    }
    function updateWarning() {
      const reasons = [];
      const blur = Number($("magicEyeBlur")?.value || 0);
      if (workflow() === "magic-eye" && blur > 1.5) reasons.push("blur");
      if (state.qrMode !== "square") reasons.push("non-square modules");
      if (state.logoMode && state.logoMode !== "none" && state.preview !== "magic-eye") reasons.push("a centre logo");
      const bg = state.colourTargets?.qrBg?.solid, fg = state.colourTargets?.qrFg?.solid;
      if (Math.abs(hexLuminance(bg)-hexLuminance(fg)) < .35) reasons.push("low colour contrast");
      warning.textContent = reasons.length ? `Scan reliability: ${reasons.join(", ")}. Test before publishing.` : "";
      warning.dataset.hoverTip = reasons.length ? `Scan reliability may be reduced by ${reasons.join(", ")}. Test the finished QR before publishing.` : '';
      warning.classList.toggle("is-visible", reasons.length > 0 && ["qr","magic-eye"].includes(workflow()));
    }
    document.addEventListener("input", event => { if (event.target.matches("input")) window.setTimeout(updateWarning,0); });
    document.addEventListener("click", () => window.setTimeout(updateWarning,0));

    /* Section-local Reset controls. */
    const initial = JSON.parse(JSON.stringify({ colourTargets:state.colourTargets, qrMode:state.qrMode, qrLevel:state.qrLevel, quietZone:state.quietZone, logoMode:state.logoMode, symbolShape:state.symbolShape, symbolBorder:state.symbolBorder, borderWidth:state.borderWidth, symbolScale:state.symbolScale, bgScale:state.bgScale, bgOffset:state.bgOffset, symbolOffset:state.symbolOffset }));
    function resetButton(module, label, reset) {
      const head = module?.querySelector(":scope>.module-head"); if (!head) return;
      const button = document.createElement("button"); button.type="button"; button.className="square-btn v1512-reset-btn"; button.textContent="Reset"; button.dataset.hoverTip=`Reset ${label} only`;
      head.querySelector(".spacer")?.insertAdjacentElement("afterend",button);
      button.addEventListener("click", event => { event.stopPropagation(); reset(); api.syncControlsFromState(); api.renderPreview(); recordHistory(); api.showToast(`${label} reset`); });
    }
    const blurInput = $("magicEyeBlur");
    function resetMagicEyeBlur(){if(!blurInput)return;blurInput.value="0";blurInput.dispatchEvent(new Event("input",{bubbles:true}));}
    resetButton($("sharedColourModule"), "Palette", () => { state.colourTargets = JSON.parse(JSON.stringify(initial.colourTargets)); if(workflow()==="magic-eye")resetMagicEyeBlur(); });
    resetButton($("qrControlModule"), "QR", () => { Object.assign(state,{qrMode:initial.qrMode,qrLevel:initial.qrLevel,quietZone:initial.quietZone,logoMode:initial.logoMode}); if(workflow()==='qr'){const defaults=api.getQartDefaults();Object.assign(state,{zone:'logo',logoSize:defaults.logoSize,quietZone:defaults.quietZone});} $("qrInput").value="https://uos.local/geoglyph"; if(workflow()==="magic-eye")resetMagicEyeBlur(); });
    resetButton($("symbolControlModule"), "Font Symbol", () => { Object.assign(state,{symbolShape:initial.symbolShape,symbolBorder:initial.symbolBorder,borderWidth:initial.borderWidth,symbolScale:initial.symbolScale,bgScale:workflow()==='qr'?api.getQartDefaults().bgScale:initial.bgScale,bgOffset:{...initial.bgOffset},symbolOffset:{...initial.symbolOffset}}); });
    if (blurInput) { const reset=document.createElement("button"); reset.type="button"; reset.className="square-btn v1512-blur-reset"; reset.textContent="Reset"; reset.dataset.hoverTip="Reset Magic Eye blur to 0 px"; blurInput.closest(".magic-eye-blur-row")?.append(reset); reset.addEventListener("click",resetMagicEyeBlur); }

    /* Font-family grouping and exact/fallback status. */
    const fontList = $("fontList");
    let groupQueued = false;
    function groupFonts() {
      groupQueued=false; if (!fontList || fontList.dataset.virtualized || fontList.querySelector(".v1512-font-family-heading")) return;
      let previous="";
      [...fontList.querySelectorAll(".font-row[data-font-id]")].forEach(row => {
        const font=state.fonts.find(item=>item.id===row.dataset.fontId); if(!font)return;
        const family=font.family||font.name||"Other";
        if(family!==previous){const h=document.createElement("div");h.className="v1512-font-family-heading";h.textContent=family;row.before(h);previous=family;}
        const source=row.querySelector("span"); if(source&&font.source==="windows")source.textContent=`Windows · ${font.exactFace?"Exact":"Fallback"}`;
      });
    }
    new MutationObserver(()=>{if(!groupQueued){groupQueued=true;queueMicrotask(groupFonts);}}).observe(fontList,{childList:true});
    groupFonts();

    /* Keep the selected font unmistakably highlighted and visible in its list viewport. */
    let fontRevealFrame=0;
    let lastRevealedFontId="";
    function revealSelectedFont(){
      fontRevealFrame=0;if(!fontList)return;
      api.revealFontSelection?.();
      const selectedId=state.selectedFontId;
      let activeRow=null;
      fontList.querySelectorAll(".font-row[data-font-id]").forEach(row=>{
        const active=row.dataset.fontId===selectedId;
        row.classList.toggle("is-active",active);
        row.setAttribute("aria-pressed",String(active));
        if(active){row.setAttribute("aria-current","true");activeRow=row;}else row.removeAttribute("aria-current");
      });
      lastRevealedFontId=selectedId;
      if(!activeRow||!document.body.classList.contains("drawer-open"))return;
      const listRect=fontList.getBoundingClientRect(),rowRect=activeRow.getBoundingClientRect();
      const topGuard=24;
      if(rowRect.top<listRect.top+topGuard)fontList.scrollTop-=listRect.top+topGuard-rowRect.top;
      else if(rowRect.bottom>listRect.bottom)fontList.scrollTop+=rowRect.bottom-listRect.bottom;
    }
    function queueFontReveal(){if(fontRevealFrame)return;fontRevealFrame=requestAnimationFrame(revealSelectedFont);}
    function commitFontSelection(fontId,render=true){
      if(!api.getFontById?.(fontId))return;
      api.selectFont(fontId);
      syncFavouriteActions();
      if(state.gridView==="favourites")$("favouritesBtn")?.click();
      queueFontReveal();
    }
    window.addEventListener("click",event=>{
      const row=event.target instanceof Element?event.target.closest("#fontList .font-row[data-font-id]"):null;
      if(!row)return;
      event.preventDefault();event.stopImmediatePropagation();
      commitFontSelection(row.dataset.fontId,true);
    },true);
    new MutationObserver(()=>{if(state.selectedFontId!==lastRevealedFontId)queueFontReveal();}).observe(fontList,{childList:true,subtree:true});
    let fontDrawerWasOpen=document.body.classList.contains("drawer-open");
    new MutationObserver(()=>{const open=document.body.classList.contains("drawer-open");if(open&&!fontDrawerWasOpen)queueFontReveal();fontDrawerWasOpen=open;}).observe(document.body,{attributes:true,attributeFilter:["class"]});
    document.addEventListener("click",event=>{if(event.target.closest("[data-font-id],.workflow-font-btn,#headerLoadBtn"))window.setTimeout(queueFontReveal,0);});
    queueFontReveal();

    /* Explicit Font Explorer favourite actions and stable right-edge ordering. */
    const favouriteRow=document.querySelector(".glyph-toolbar .favourites-toolbar-row");
    const favouriteBar=favouriteRow?.querySelector(":scope>.button-bar");
    const favouriteCount=$("favouritesCount");
    const addFavourite=$("addFavouriteBtn");
    const plusFavourite=document.createElement("button");
    plusFavourite.type="button";plusFavourite.id="v1512AddFavourite";plusFavourite.className="square-btn v1512-favourite-action";plusFavourite.textContent="+";plusFavourite.setAttribute("aria-label","Add selected glyph to Favourites");
    const minusFavourite=document.createElement("button");
    minusFavourite.type="button";minusFavourite.id="v1512RemoveFavourite";minusFavourite.className="square-btn v1512-favourite-action";minusFavourite.textContent="−";minusFavourite.setAttribute("aria-label","Remove selected glyph from Favourites");
    const FAVOURITE_OWNERS_KEY="geoglyph-locate2026.geoglyph-favourite-font-owners";
    let favouriteOwners={};
    try{const stored=JSON.parse(localStorage.getItem(FAVOURITE_OWNERS_KEY)||"{}");if(stored&&typeof stored==="object")favouriteOwners=stored;}catch{}
    state.favourites.forEach(code=>{const key=String(code);if(!Array.isArray(favouriteOwners[key])||!favouriteOwners[key].length)favouriteOwners[key]=[state.selectedFontId];});
    function saveFavouriteOwners(){try{localStorage.setItem(FAVOURITE_OWNERS_KEY,JSON.stringify(favouriteOwners));}catch{}}
    function favouritesForFont(fontId=state.selectedFontId){return Object.entries(favouriteOwners).filter(([,owners])=>Array.isArray(owners)&&owners.includes(fontId)).map(([code])=>Number(code)).filter(Number.isInteger).sort((a,b)=>a-b);}
    function allFavouritePairs(){return Object.entries(favouriteOwners).flatMap(([code,owners])=>(Array.isArray(owners)?owners:[]).map(fontId=>({code:Number(code),fontId}))).filter(pair=>Number.isInteger(pair.code)&&state.fonts.some(font=>font.id===pair.fontId)).sort((a,b)=>a.fontId.localeCompare(b.fontId)||a.code-b.code);}
    function syncCurrentFontFavourites(){const codes=favouritesForFont();state.favourites.splice(0,state.favourites.length,...codes);try{localStorage.setItem("geoglyph-locate2026.geoglyph-favourites",JSON.stringify(codes));}catch{}return codes;}
    function selectedOwnsFavourite(code=Number(state.selectedCode)){return(favouriteOwners[String(code)]||[]).includes(state.selectedFontId);}
    function applyFavouriteColours(){
      const favouriteCodes=new Set(favouritesForFont());
      $("glyphGrid")?.querySelectorAll(".glyph-cell[data-code]").forEach(cell=>{
        const code=Number(cell.dataset.code);
        const favourite=cell.dataset.ownerFont?(favouriteOwners[String(code)]||[]).includes(cell.dataset.ownerFont):favouriteCodes.has(code);
        cell.classList.toggle("is-favourite",favourite);
      });
      const owningFonts=new Set(Object.values(favouriteOwners).flat());
      fontList?.querySelectorAll(".font-row[data-font-id]").forEach(row=>row.classList.toggle("owns-favourite",owningFonts.has(row.dataset.fontId)));
    }
    function syncFavouriteActions(){syncCurrentFontFavourites();const owned=selectedOwnsFavourite();plusFavourite.disabled=owned;minusFavourite.disabled=!owned;if(favouriteCount)favouriteCount.textContent=String(allFavouritePairs().length);applyFavouriteColours();}
    let renderingFavouriteGallery=false;
    function renderFavouriteGallery(){
      if(state.gridView!=="favourites"||renderingFavouriteGallery)return;
      renderingFavouriteGallery=true;
      const grid=$("glyphGrid"),pairs=allFavouritePairs();
      grid.replaceChildren();
      if(!pairs.length){const empty=document.createElement("div");empty.className="empty-favourites";empty.textContent="No favourite font and Unicode pairs yet.";grid.append(empty);}
      pairs.forEach(({code,fontId})=>{
        const font=state.fonts.find(item=>item.id===fontId);if(!font)return;
        const button=document.createElement("button");button.type="button";button.className=`glyph-cell is-favourite${fontId===state.selectedFontId&&code===Number(state.selectedCode)?" is-active":""}`;button.dataset.code=String(code);button.dataset.ownerFont=fontId;button.setAttribute("aria-label",`${font.name} U+${code.toString(16).toUpperCase().padStart(4,"0")}`);
        const glyph=document.createElement("strong");glyph.textContent=String.fromCodePoint(code);glyph.style.fontFamily=font.cssFamily||font.family||font.name||"system-ui";
        const meta=document.createElement("small");meta.textContent=font.family||font.name;meta.title=font.family||font.name;
        button.append(glyph,meta);grid.append(button);
      });
      if(favouriteCount)favouriteCount.textContent=String(pairs.length);
      renderingFavouriteGallery=false;
    }
    function commitFavourite(add){
      const code=Number(state.selectedCode);if(!Number.isInteger(code)||!state.selectedFontId)return;
      const key=String(code),owners=new Set(Array.isArray(favouriteOwners[key])?favouriteOwners[key]:[]);
      if(add){owners.add(state.selectedFontId);api.showToast(`U+${code.toString(16).toUpperCase().padStart(4,"0")} added to this font`);}
      else{owners.delete(state.selectedFontId);api.showToast(`U+${code.toString(16).toUpperCase().padStart(4,"0")} removed from this font`);}
      if(owners.size)favouriteOwners[key]=[...owners];else delete favouriteOwners[key];
      saveFavouriteOwners();syncFavouriteActions();(state.gridView==="favourites"?$("favouritesBtn"):$("codeGridBtn"))?.click();window.setTimeout(applyFavouriteColours,0);
    }
    plusFavourite.addEventListener("click",()=>commitFavourite(true));minusFavourite.addEventListener("click",()=>commitFavourite(false));
    if(favouriteBar){
      [$("codeGridBtn"),$("copyCodeBtn"),$("favouritesBtn"),plusFavourite,minusFavourite].filter(Boolean).forEach(button=>favouriteBar.append(button));
      if(favouriteCount)favouriteBar.append(favouriteCount);
    }
    $("favouritesBtn")?.addEventListener("click",()=>window.setTimeout(renderFavouriteGallery,0));
    $("glyphGrid")?.addEventListener("click",event=>{
      const tile=event.target.closest(".glyph-cell[data-owner-font]");if(!tile)return;
      event.preventDefault();event.stopImmediatePropagation();
      commitFontSelection(tile.dataset.ownerFont,true);
      state.selectedCode=Number(tile.dataset.code);
      api.syncControlsFromState();api.renderPreview();syncFavouriteActions();renderFavouriteGallery();queueFontReveal();
    },true);
    document.addEventListener("click",event=>{if(event.target.closest(".glyph-cell,[data-font-id],#gridPreviewMinusBtn,#gridPreviewPlusBtn"))window.setTimeout(()=>{syncFavouriteActions();if(event.target.closest("[data-font-id]")&&state.gridView==="favourites")renderFavouriteGallery();},0);});
    new MutationObserver(()=>{applyFavouriteColours();if(state.gridView==="favourites"&&allFavouritePairs().length&&!$("glyphGrid").querySelector("[data-owner-font]"))queueMicrotask(renderFavouriteGallery);}).observe($("glyphGrid"),{childList:true});
    new MutationObserver(applyFavouriteColours).observe(fontList,{childList:true});
    saveFavouriteOwners();
    syncFavouriteActions();

    /* Undo/redo for visual adjustments. */
    const history=[], future=[];
    function historyJson(key,value){return value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,value[key]])):value;}
    function snapshot(){const map=window.GeoGlyphUi?.collectMapSettings() || null;if(map)delete map.camera;return JSON.stringify({map,colourTargets:state.colourTargets,qrMode:state.qrMode,qrLevel:state.qrLevel,quietZone:state.quietZone,logoMode:state.logoMode,logoCropEdgeColor:state.logoCropEdgeColor,logoCropEdgeWidth:state.logoCropEdgeWidth,logoSize:state.logoSize,safeSize:state.safeSize,symbolShape:state.symbolShape,symbolBorder:state.symbolBorder,borderWidth:state.borderWidth,symbolScale:state.symbolScale,bgScale:state.bgScale,bgOffset:state.bgOffset,symbolOffset:state.symbolOffset,blur:$("magicEyeBlur")?.value||"0"},historyJson);}
    function restore(value){const s=JSON.parse(value);Object.keys(s).forEach(key=>{if(key!=="blur"&&key!=="map")state[key]=s[key];});if($("magicEyeBlur")){ $("magicEyeBlur").value=s.blur;$("magicEyeBlur").dispatchEvent(new Event("input",{bubbles:true})); }window.GeoGlyphUi?.applyMapSettings(s.map,{history:true});api.syncControlsFromState();api.renderPreview();syncHistoryButtons();}
    function recordHistory(){if(window.GeoGlyphUi?.isRestoring())return;const value=snapshot();if(history.at(-1)!==value){history.push(value);if(history.length>60)history.shift();future.length=0;}syncHistoryButtons();}
    const historyBar=document.createElement("div");historyBar.className="v1512-history";historyBar.innerHTML='<button class="square-btn" id="v1512Undo" type="button">Undo</button><button class="square-btn" id="v1512Redo" type="button">Redo</button>';
    previewHead?.insertBefore(historyBar,previewHead.querySelector(".header-export-btn"));
    function syncHistoryButtons(){$("v1512Undo").disabled=history.length<2;$("v1512Redo").disabled=!future.length;}
    function undo(){if(history.length<2)return;future.push(history.pop());restore(history.at(-1));}
    function redo(){if(!future.length)return;const value=future.pop();history.push(value);restore(value);}
    $("v1512Undo")?.addEventListener("click",undo);$("v1512Redo")?.addEventListener("click",redo);
    document.addEventListener("keydown",event=>{if(!(event.ctrlKey||event.metaKey)||event.altKey||event.target.closest?.("input,textarea,[contenteditable]:not([contenteditable=\"false\"]),[role=\"textbox\"]"))return;if(event.key.toLowerCase()==="z"){event.preventDefault();event.shiftKey?redo():undo();}else if(event.key.toLowerCase()==="y"){event.preventDefault();redo();}});
    document.addEventListener("change",event=>{if(!window.GeoGlyphUi?.isRestoring()&&event.target.matches("input,textarea,select"))window.setTimeout(recordHistory,0);});
    document.addEventListener("geoglyph:ground-rendered",event=>{if(!event.detail?.historyRestore)recordHistory();});
    document.addEventListener("click",event=>{if(!window.GeoGlyphUi?.isRestoring()&&event.target.closest("button")&&!event.target.closest(".v1512-history"))window.setTimeout(recordHistory,0);});
    recordHistory();
    document.addEventListener("geoglyph:map-ready",()=>{if(history.length===1){history[0]=snapshot();syncHistoryButtons();}});

    /* Persist practical UI state. */
    function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({qrFile:$("fileName")?.value,symbolFile:$("symbolFileName")?.value,blur:$("magicEyeBlur")?.value,exportSize:state.exportSize,qrLevel:state.qrLevel,workflow:workflow(),collapsed:[...document.querySelectorAll(".control-module.is-collapsed")].map(el=>el.id)}));}catch{}}
    function restorePersisted(){try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(!p)return;if(typeof p.qrFile==="string")$("fileName").value=p.qrFile;if(typeof p.symbolFile==="string")$("symbolFileName").value=p.symbolFile;if(p.blur!=null&&$("magicEyeBlur")){ $("magicEyeBlur").value=p.blur;$("magicEyeBlur").dispatchEvent(new Event("input",{bubbles:true})); }if([512,1024,2048,4096].includes(Number(p.exportSize)))state.exportSize=Number(p.exportSize);if(QR_LIMITS[p.qrLevel])state.qrLevel=p.qrLevel;if(p.workflow){document.querySelector(`[data-workflow="${p.workflow}"]`)?.click();}api.syncControlsFromState();}catch(error){console.warn("UI preferences could not be restored",error);}}
    document.addEventListener("change",persist);window.addEventListener("beforeunload",persist);restorePersisted();

    /* Focus containment for active modal-like surfaces. */
    document.addEventListener("keydown",event=>{if(event.key!=="Tab")return;const active=[...document.querySelectorAll('.modal-backdrop:not([hidden]),.magic-eye-fullscreen:not([hidden]),.export-panel.is-open')].at(-1);if(!active)return;const items=[...active.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>el.offsetParent!==null);if(!items.length)return;const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
    const modalBackgrounds=[...document.querySelectorAll(".app-header,.workspace,.explorer-drawer")];
    function syncModalIsolation(){const active=[...document.querySelectorAll('.modal-backdrop:not([hidden]),.magic-eye-fullscreen:not([hidden])')].at(-1);modalBackgrounds.forEach(root=>{const isolate=Boolean(active&&!root.contains(active));root.inert=isolate;if(isolate)root.setAttribute("aria-hidden","true");else root.removeAttribute("aria-hidden");});}
    document.querySelectorAll(".modal-backdrop,.magic-eye-fullscreen").forEach(modal=>new MutationObserver(syncModalIsolation).observe(modal,{attributes:true,attributeFilter:["hidden"]}));
    const exportButton=document.querySelector(".header-export-btn");
    exportButton?.addEventListener("click",()=>window.setTimeout(()=>{if(exportPanel?.classList.contains("is-open")){const target=workflow()==="symbol"?$("symbolFileName"):$("fileName");target?.focus();target?.select();}},0));
    exportPanel?.querySelector(".export-close-btn")?.addEventListener("click",()=>window.setTimeout(()=>exportButton?.focus(),0));
    syncModalIsolation();

    new MutationObserver(syncContext).observe(document.body,{attributes:true,attributeFilter:["data-workflow"]});
    syncContext(); updateCapacity(); updateWarning(); syncHistoryButtons();
    window.setTimeout(()=>{if(!document.body.classList.contains("drawer-open"))document.querySelector(".workflow-font-btn")?.click();},0);
  });
})();
