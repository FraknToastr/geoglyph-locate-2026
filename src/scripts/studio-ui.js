/* Shared editing controls. Artwork colours remain independent of UI theme tokens. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const extensions = new Map();
  const HISTORY_KEY = "geoglyph-locate2026.geoglyph-colour-history-v1";
  const CROSSHAIR_KEY = "geoglyph-locate2026.geoglyph-preview-crosshair-v1";
  const DEFAULT_CROSSHAIR_COLOUR = "#D3D3D3";
  const MAP_MODEL_PRESETS = ["#F1F5F6", "#3FDE78", "#F47D22", "#429EFF", "#B978FF", "#FFDF3A", "#FF6288", "#0D0D0B"];
  const MAP_COLOUR_NAMES = ["White", "Green", "Orange", "Blue", "Violet", "Yellow", "Pink", "Black"];
  const COLOUR_NAMES = ["White", "Green", "Orange", "Blue", "Lilac", "Yellow", "Rose", "Black"];
  const TARGET_NAMES = { qrBg:"QR background", qrFg:"QR foreground", symbolBg:"Symbol backdrop", symbolEdge:"Backdrop edge", symbol:"Symbol fill" };
  let studio, recent = [], mapTarget = "mapFill", queued = false, restoring = false, lastWorkflow='', inlinePicker, bufferPicker, gradientPickerStop='A', crosshairColour = DEFAULT_CROSSHAIR_COLOUR;
  const state = () => studio?.state;
  const mapEngine = () => window.GeoGlyphMapEngine;
  const finite = value => typeof value === "number" && Number.isFinite(value);
  const bounded = (value, min, max, fallback) => finite(value) ? Math.max(min, Math.min(max, value)) : fallback;
  const colour = value => {
    let hex = String(value ?? "").trim().replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(hex)) hex = [...hex].map(c => c + c).join("");
    return /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : null;
  };

  function remember(value) {
    const hex = colour(value);
    if (!hex) return;
    recent = [hex, ...recent.filter(item => item !== hex)].slice(0, 12);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(recent)); } catch (_) {}
    syncRecent();
  }

  function makeSwatch(value, label, apply) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "studio-swatch";
    button.style.setProperty("--swatch", value);
    button.dataset.colour = value;
    button.setAttribute("aria-label", `${label} ${value}`);
    button.dataset.hoverTip = `${label} ${value}`;
    button.addEventListener("click", () => { apply(value); remember(value); scheduleSync(); });
    return button;
  }

  function applyCanvasColour(value) {
    if (!$('fgHex')) return;
    $("fgHex").value = value;
    $("fgHex").dispatchEvent(new Event("change", { bubbles:true }));
  }

  function applyMapColour(value) {
    const picker = $(mapTarget);
    if (!picker || picker.disabled) return;
    picker.value = value;
    picker.dispatchEvent(new Event("input", { bubbles:true }));
    picker.dispatchEvent(new Event("change", { bubbles:true }));
  }

  function makeRecent(context, apply) {
    const row = document.createElement("div");
    row.className = "studio-recent-row";
    row.dataset.recentContext = context;
    const label = document.createElement("span");
    label.className = "control-label";
    label.textContent = "Recent";
    const list = document.createElement("div");
    list.className = "studio-swatch-list";
    list.setAttribute("role", "group");
    list.setAttribute("aria-label", "Recently used colours");
    row.append(label, list);
    row.applyColour = apply;
    return row;
  }

  function syncRecent() {
    document.querySelectorAll("[data-recent-context]").forEach(row => {
      const list = row.querySelector(".studio-swatch-list");
      list.replaceChildren(...recent.map(value => makeSwatch(value, "Recent colour", row.applyColour)));
      row.hidden = !recent.length;
    });
    syncSwatches();
  }

  function syncSwatches() {
    const paint = state()?.colourTargets?.[state()?.colourTarget];
    document.querySelectorAll("[data-palette]").forEach(button => {
      const selected = paint?.mode === "solid" && colour(button.dataset.palette) === colour(paint.solid);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-gradient-preset]").forEach(button => {
      const selected = paint?.mode === "gradient" && button.dataset.gradientPreset.toUpperCase() === paint.gradient.colors.join(",").toUpperCase();
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-recent-context]").forEach(row => {
      const value = row.dataset.recentContext === "map" ? $(mapTarget)?.value : paint?.mode === "solid" ? paint.solid : null;
      row.querySelectorAll("[data-colour]").forEach(button => button.setAttribute("aria-pressed", String(colour(value) === button.dataset.colour)));
    });
    document.querySelectorAll("[data-map-palette] [data-colour]").forEach(button => button.setAttribute("aria-pressed", String(colour($(mapTarget)?.value) === button.dataset.colour)));
  }

  function allowedTargets() {
    const current = state();
    const workflow = document.body.dataset.workflow;
    if (workflow === "symbol") return ["symbolBg", "symbolEdge", "symbol"];
    if (workflow === "magic-eye") return ["qrBg", "qrFg"];
    if (workflow === "qreverse") return [];
    return current?.preview === "combined" && current.logoMode === "symbol"
      ? ["qrBg", "qrFg", "symbolBg", "symbolEdge", "symbol"] : ["qrBg", "qrFg"];
  }

  function syncCrosshair() {
    const preview = $('previewStage');
    if (crosshairColour && document.body.dataset.workflow === 'symbol') preview?.style.setProperty('--preview-crosshair-colour', crosshairColour === 'off' ? 'transparent' : crosshairColour);
    else preview?.style.removeProperty('--preview-crosshair-colour');
    document.querySelectorAll('[data-crosshair-colour]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.crosshairColour === crosshairColour));
    });
  }

  function syncContext() {
    const current = state();
    if (!current) return;
    syncCrosshair();
    const workflow=document.body.dataset.workflow||'symbol';
    if(workflow!==lastWorkflow){if(workflow!=='symbol'&&document.body.classList.contains('drawer-open'))$('closeDrawerBtn')?.click();lastWorkflow=workflow;}
    const targets = allowedTargets();
    if (targets.length && !targets.includes(current.colourTarget)) {
      current.colourTarget = targets.includes("symbol") && document.body.dataset.workflow === "symbol" ? "symbol" : "qrFg";
      current.colourView = current.colourTargets[current.colourTarget].mode === "gradient" ? "gradient" : "palette";
      studio.syncControlsFromState();
    }
    const bar = $("colourTargetBar");
    if (bar) {
      bar.style.setProperty("--target-count", String(Math.max(1, targets.length)));
      bar.querySelectorAll("[data-colour-target]").forEach(button => {
        const key = button.dataset.colourTarget;
        button.hidden = !targets.includes(key);
        button.setAttribute("aria-label", TARGET_NAMES[key]);
        button.dataset.hoverTip = TARGET_NAMES[key];
        const paint = current.colourTargets[key];
        button.style.setProperty("--target-colour", paint?.solid || "transparent");
      });
    }
    const module = $("sharedColourModule");
    if (module) module.dataset.colourContext = document.body.dataset.workflow || "qr";
    const picker = $("fgColor");
    if (picker) picker.setAttribute("aria-label", TARGET_NAMES[current.colourTarget] || "Selected colour");
    inlinePicker?.sync();
    bufferPicker?.sync();
    if($('qrBufferEdgeHint'))$('qrBufferEdgeHint').hidden=document.body.dataset.workflow==='qr'&&current.logoMode==='image'&&Boolean(current.externalLogoDataUrl)&&current.logoCrop;
    for(const stop of ['A','B','C','D'])$(`grad${stop}Color`)?.closest('.gradient-stop').classList.toggle('is-picker-source',current.colourView==='gradient'&&stop===gradientPickerStop);
    document.querySelectorAll("[data-colour-view]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.colourView === current.colourView)));
    const direction = current.colourTargets[current.colourTarget]?.gradient.direction;
    document.querySelectorAll("[data-gradient-direction]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.gradientDirection === direction)));
    if($('mapFill')) { $('mapFill').disabled=Boolean(mapEngine()?.state.nativeColor); $('mapFill').title=$('mapFill').disabled?'Native font colours are active':'Selected glyph fill'; }
    if(mapTarget==='mapFill'&&$('mapFill')?.disabled)mapTarget='mapOutline';
    for (const id of ["mapFill", "mapOutline"]) {
      const hex = $(`${id}Hex`), input = $(id);
      if (hex && input && document.activeElement !== hex) hex.value = input.value.toUpperCase();
      if (hex && input) hex.disabled = input.disabled;
    }
    document.querySelectorAll("[data-map-colour-target]").forEach(button => {
      const target = button.dataset.mapColourTarget;
      button.setAttribute("aria-pressed", String(target === mapTarget));
      button.disabled = Boolean($(target)?.disabled);
    });
    syncSwatches();
  }

  function scheduleSync() {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; syncContext(); });
  }

  function enhanceMapColours() {
    const panel = document.querySelector(".map-style-panel");
    if (!panel || panel.dataset.sharedColours) return;
    panel.dataset.sharedColours = "true";
    for (const id of ["mapFill", "mapOutline"]) {
      const picker = $(id);
      if (!picker) continue;
      const wrapper = document.createElement("div");
      wrapper.className = "studio-colour-control";
      const hex = document.createElement("input");
      hex.id = `${id}Hex`;
      hex.className = "studio-hex-input";
      hex.type = "text";
      hex.maxLength = 7;
      hex.spellcheck = false;
      hex.autocomplete = "off";
      hex.value = picker.value.toUpperCase();
      hex.setAttribute("aria-label", `${id === "mapFill" ? "Map fill" : "Map outline"} hex colour`);
      picker.setAttribute("aria-label", id === "mapFill" ? "Map fill colour" : "Map outline colour");
      picker.before(wrapper);
      wrapper.append(picker, hex);
      hex.addEventListener("change", () => {
        const value = colour(hex.value);
        if (!value) { hex.value = picker.value.toUpperCase(); studio.showToast("Enter a three or six digit hex colour"); return; }
        mapTarget = id;
        applyMapColour(value);
        remember(value);
      });
      wrapper.addEventListener("focusin", () => { mapTarget = id; scheduleSync(); });
    }
    const palette = document.createElement("div");
    palette.className = "studio-map-palette";
    palette.dataset.mapPalette = "true";
    const targets = document.createElement("div");
    targets.className = "button-bar studio-colour-targets";
    targets.setAttribute("role", "group");
    targets.setAttribute("aria-label", "Map palette destination");
    [ ["mapFill", "Fill"], ["mapOutline", "Outline"] ].forEach(([id, text]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "square-btn";
      button.dataset.mapColourTarget = id;
      button.textContent = text;
      button.addEventListener("click", () => { mapTarget = id; scheduleSync(); });
      targets.append(button);
    });
    const presets = document.createElement("div");
    presets.className = "studio-swatch-list";
    presets.setAttribute("role", "group");
    presets.setAttribute("aria-label", "Map colour presets");
    MAP_MODEL_PRESETS.forEach((value, index) => presets.append(makeSwatch(value, MAP_COLOUR_NAMES[index], applyMapColour)));
    palette.append(targets, presets);
    panel.querySelector(".map-pair")?.after(palette);
    syncRecent();
    document.dispatchEvent(new CustomEvent("geoglyph:map-ready"));
  }

  function fontIdentity(record) {
    if (!record) return null;
    return { name:String(record.name || ""), family:String(record.family || ""), postscriptName:String(record.postscriptName || ""), style:String(record.style || ""), source:String(record.source || "") };
  }

  function collectMapSettings() {
    const current = mapEngine()?.state;
    if (!current) return null;
    const result = { version:3 };
    for (const key of ["mode", "message", "baseHeightMeters", "relativeSize", "bearing", "tracking", "lineHeight", "fill", "outline", "outlineWidth", "opacity", "quality", "selectedCode", "basemap", "renderStyle", "anchorPinned"]) {
      if (["string", "number", "boolean"].includes(typeof current[key])) result[key] = current[key];
    }
    result.anchor = { lng:current.anchor.lng, lat:current.anchor.lat };
    result.renderStyle=current.nativeColor?'native':'styled';
    result.extrusionEnabled=current.extrusionEnabled;
    result.extrusionDepthMeters=current.extrusionDepthMeters;
    result.extrusionTilt=current.extrusionTilt;
    result.extrusionSolid=current.extrusionSolid;
    result.orientationMode=current.orientationMode;
    result.orbitPeriodSeconds=current.orbitPeriodSeconds;
    // Save the model that is actually visible while a new font is preparing,
    // or when that font cannot replace the current 3D outline model.
    const committed=current.previewActive&&current.lastRenderMode!=='none'&&current.committedSelection;
    if(committed)for(const key of ['mode','message','selectedCode','tracking','lineHeight','quality'])result[key]=committed[key];
    result.font = fontIdentity(current.fontRecords?.get(committed?.selectedFontId||current.selectedFontId));
    const map = current.map;
    if (map?.getCenter) {
      const center = map.getCenter();
      result.camera = { lng:center.lng, lat:center.lat, zoom:map.getZoom(), pitch:map.getPitch(), bearing:map.getBearing(), elevation:map.getCenterElevation(), centerClampedToGround:map.getCenterClampedToGround() };
    }
    const extra = {};
    extensions.forEach((extension, name) => { try { extra[name] = extension.collect(); } catch (_) {} });
    if (Object.keys(extra).length) result.extensions = extra;
    return result;
  }

  function applyMapSettings(value, options = {}) {
    const engine = mapEngine(), current = engine?.state;
    if (!current || !value || typeof value !== "object" || Array.isArray(value)) return false;
    restoring = true;
    try {
      if(options.history&&value.extrusionEnabled)window.GeoGlyph3D?.stopOrbit();else window.GeoGlyph3D?.exitCamera();
      if (!options.history) {
        $("mapArcgisStopBtn")?.click();
        window.GeoGlyphArcgisSession?.disconnect?.();
        if (current.arcgisTimer) clearInterval(current.arcgisTimer);
        current.arcgisTimer = 0;
        current.arcgisPolling = false;
      }
      if (["message", "glyph", "arcgis"].includes(value.mode)) current.mode = value.mode;
      if (typeof value.message === "string") current.message = value.message.slice(0, 100000);
      const limits = { baseHeightMeters:[1,300000], relativeSize:[5,1000], bearing:[-360,360], tracking:[-20,100], lineHeight:[0.5,3], outlineWidth:[0,20], opacity:[0.05,1], quality:[4,36] };
      Object.entries(limits).forEach(([key, [min, max]]) => { current[key] = bounded(value[key], min, max, current[key]); });
      current.quality = Math.round(current.quality);
      current.extrusionEnabled=value.extrusionEnabled===true;
      current.extrusionDepthMeters=finite(value.extrusionDepthMeters)?bounded(value.extrusionDepthMeters,.1,100000,30):null;
      current.extrusionTilt=bounded(value.extrusionTilt,0,90,90);
      current.extrusionSolid=typeof value.extrusionSolid==='boolean'?value.extrusionSolid:!value.extrusionEnabled;
      current.orientationMode=['fixed','yaw','billboard'].includes(value.orientationMode)?value.orientationMode:'fixed';
      current.orbitPeriodSeconds=Math.round(bounded(value.orbitPeriodSeconds,10,120,30));
      ["fill", "outline"].forEach(key => { if (colour(value[key])) current[key] = colour(value[key]); });
      if (["aerial", "world", "metromap"].includes(value.basemap)) current.basemap = value.basemap;
      if (["auto", "native", "styled", "fill-outline", "native-color"].includes(value.renderStyle)) { current.renderStyle=value.renderStyle; current.nativeColor=['native','native-color'].includes(value.renderStyle); }
      if (Number.isInteger(value.selectedCode) && value.selectedCode >= 0 && value.selectedCode <= 0x10FFFF && !(value.selectedCode >= 0xD800 && value.selectedCode <= 0xDFFF)) current.selectedCode = value.selectedCode;
      if (value.anchor && finite(value.anchor.lng) && finite(value.anchor.lat)) engine.placeAnchor({ lng:bounded(value.anchor.lng,-180,180,0), lat:bounded(value.anchor.lat,-85.051129,85.051129,0) }, 'restore');
      if (typeof value.anchorPinned === "boolean") current.anchorPinned = value.anchorPinned;
      const identity = value.font;
      if (identity && typeof identity === "object" && current.fontRecords?.values) {
        const records = [...current.fontRecords.values()];
        const match = records.find(record => identity.postscriptName && record.postscriptName === identity.postscriptName)
          || records.find(record => record.name === identity.name && (!identity.style || record.style === identity.style));
        if (match) current.selectedFontId = match.id;
        else if (!options.history && identity.name) studio?.showToast(`Reimport ${identity.name} to restore its exact font`);
      }
      const bindings = { mapMessage:"message", mapHeight:"baseHeightMeters", mapRelativeSize:"relativeSize", mapTracking:"tracking", mapLineHeight:"lineHeight", mapFill:"fill", mapOutline:"outline", mapOutlineWidth:"outlineWidth", mapOpacity:"opacity", mapBearing:"bearing", mapQuality:"quality", mapFontSelect:"selectedFontId" };
      Object.entries(bindings).forEach(([id, key]) => { if ($(id)) $(id).value = String(current[key]); });
      document.querySelectorAll("[data-map-mode]").forEach(button => {
        const active = button.dataset.mapMode === current.mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      document.querySelectorAll("[data-map-pane]").forEach(pane => { pane.hidden = current.mode === "arcgis" ? !["arcgis", "message"].includes(pane.dataset.mapPane) : pane.dataset.mapPane !== current.mode; });
      if ($("mapMessage")) $("mapMessage").readOnly = current.mode === "arcgis";
      if (value.camera && finite(value.camera.lng) && finite(value.camera.lat)) {
        engine.cancelInitialFit();
        current.restoredCamera = { center:[bounded(value.camera.lng,-180,180,0),bounded(value.camera.lat,-85.051129,85.051129,0)], zoom:bounded(value.camera.zoom,0,24,15), pitch:bounded(value.camera.pitch,0,85,0), bearing:bounded(value.camera.bearing,-360,360,0), elevation:bounded(value.camera.elevation,0,300000,0) };
        current.restoredCameraClamped=value.camera.centerClampedToGround!==false;
        current.map?.setCenterClampedToGround(current.restoredCameraClamped);
        current.map?.jumpTo?.(current.restoredCamera);
      }
      if (value.extensions && typeof value.extensions === "object") extensions.forEach((extension, name) => { if (Object.prototype.hasOwnProperty.call(value.extensions, name)) extension.apply(value.extensions[name]); });
      engine.refreshControls?.();
      if (current.mapReady) {
        const basemapButton = {aerial:"mapEsriAerialBtn", world:"mapEsriWorldBtn", metromap:"mapMetroMapBtn"}[current.basemap];
        if (basemapButton) $(basemapButton)?.click();
      }
      $("mapFontSelect")?.dispatchEvent(new Event("change", { bubbles:true }));
      if(options.history)current.historyRestoreChoice=current.fontChoiceVersion;
      if (current.mapReady) engine.rebuild(false);
      scheduleSync();
      return true;
    } finally { restoring = false; }
  }

  window.GeoGlyphUi = Object.freeze({
    collectMapSettings, applyMapSettings, normalizeColour:colour,
    isRestoring:() => restoring,
    registerSettingsExtension(name, extension) {
      if (typeof name === "string" && typeof extension?.collect === "function" && typeof extension?.apply === "function") extensions.set(name, extension);
    }
  });

  function initialise() {
    studio = window.GeoGlyphStudio;
    if (!studio) return;
    const crosshairButtons = [...document.querySelectorAll('[data-crosshair-colour]')];
    try {
      const saved = sessionStorage.getItem(CROSSHAIR_KEY);
      if (crosshairButtons.some(button => button.dataset.crosshairColour === saved)) crosshairColour = saved;
    } catch (_) {}
    crosshairButtons.forEach(button => button.addEventListener('click', () => {
      crosshairColour = button.dataset.crosshairColour;
      try { sessionStorage.setItem(CROSSHAIR_KEY, crosshairColour); } catch (_) {}
      syncCrosshair();
    }));
    const glyphSearch=$('glyphSearch'),findGlyph=$('gridPreviewFindBtn');
    if(glyphSearch&&findGlyph){const search=document.createElement('div');search.className='studio-glyph-search';glyphSearch.replaceWith(search);search.append(glyphSearch,findGlyph);findGlyph.textContent='Find selected';findGlyph.setAttribute('aria-label','Find selected character in grid');}
    try { const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); if (Array.isArray(saved)) recent = [...new Set(saved.map(colour).filter(Boolean))].slice(0,12); } catch (_) {}
    document.querySelectorAll("[data-palette]").forEach((button, index) => {
      button.setAttribute("aria-label", `${COLOUR_NAMES[index] || "Colour"} ${button.dataset.palette}`);
      button.dataset.hoverTip = button.getAttribute("aria-label");
      button.addEventListener("click", () => remember(button.dataset.palette));
    });
    const names = ["Garden", "Neon", "Ember", "Forest", "Graphite", "Pastel"];
    document.querySelectorAll("[data-gradient-preset]").forEach((button,index) => {
      button.setAttribute("aria-label", `${names[index] || "Custom"} gradient`);
      button.dataset.hoverTip = button.getAttribute("aria-label");
      button.addEventListener("click", () => button.dataset.gradientPreset.split(",").reverse().forEach(remember));
    });
    inlinePicker=window.GeoGlyphColourPicker?.mount($('symbolInlinePicker'),()=>{
      const current=state(),gradient=current.colourView==='gradient';
      return {input:$(gradient?`grad${gradientPickerStop}Color`:'fgColor'),key:current.colourTarget+':'+(gradient?gradientPickerStop:'solid'),label:gradient?`Stop ${gradientPickerStop}`:(TARGET_NAMES[current.colourTarget]||'Selected colour')};
    });
    bufferPicker=window.GeoGlyphColourPicker?.mount($('qrBufferEdgePicker'),()=>{
      const current=state();
      return {input:$('logoCropEdgeColor'),key:'logo-buffer-edge',label:'Buffer edge',disabled:document.body.dataset.workflow!=='qr'||current.logoMode!=='image'||!current.externalLogoDataUrl||!current.logoCrop};
    });
    for(const stop of ['A','B','C','D']){
      const input=$(`grad${stop}Color`),hex=$(`grad${stop}Hex`);
      const choose=()=>{gradientPickerStop=stop;scheduleSync();};
      input?.addEventListener('focus',choose);hex?.addEventListener('focus',choose);
      input?.addEventListener('click',event=>{if(['symbol','qr','magic-eye'].includes(document.body.dataset.workflow)){event.preventDefault();choose();}});
      input?.addEventListener('keydown',event=>{if(['symbol','qr','magic-eye'].includes(document.body.dataset.workflow)&&['Enter',' '].includes(event.key)){event.preventDefault();choose();$('symbolInlinePicker').querySelector('input').focus();}});
    }
    document.querySelectorAll(".file-square[for]").forEach(label => {
      label.tabIndex = 0;
      label.setAttribute("role", "button");
      label.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); $(label.htmlFor)?.click(); } });
    });
    document.querySelectorAll("button[data-file-input]").forEach(button => button.addEventListener("click", () => $(button.dataset.fileInput)?.click()));
    document.querySelectorAll("input[type=color]").forEach(input => { if (!input.getAttribute("aria-label") && !input.closest("label")) input.setAttribute("aria-label", input.id.replace(/([a-z])([A-Z])/g,"$1 $2")); });
    const enhanceMap = () => {
      enhanceMapColours();
      const mapFontLabel = document.querySelector('label[for="mapFontFiles"]');
      if (mapFontLabel && !mapFontLabel.dataset.keyboardImport) {
        mapFontLabel.dataset.keyboardImport = "true";
        mapFontLabel.tabIndex=0;
        mapFontLabel.setAttribute("role","button");
        mapFontLabel.addEventListener("keydown", event => { if (["Enter"," "].includes(event.key)) {event.preventDefault(); $("mapFontFiles")?.click();} });
      }
      return Boolean($("mapFillHex"));
    };
    if (!enhanceMap()) {
      const observer = new MutationObserver(() => { if (enhanceMap()) observer.disconnect(); });
      observer.observe(document.body, {childList:true});
    }
    document.addEventListener("change", event => {
      if (event.target.matches(".hex-input,.studio-hex-input") && colour(event.target.value)) event.target.value = colour(event.target.value);
    }, true);
    document.addEventListener("change", event => {
      const target = event.target;
      if (target.matches('input[type="color"],.hex-input,.studio-hex-input')) remember(target.value);
      scheduleSync();
    });
    document.addEventListener("input", event => { if (event.target.matches("input,textarea,select")) scheduleSync(); });
    document.addEventListener("click", event => { if (event.target.closest("button")) scheduleSync(); });
    new MutationObserver(scheduleSync).observe(document.body, {attributes:true,attributeFilter:["data-workflow"]});
    document.addEventListener("geoglyph:settings-loaded", scheduleSync);
    document.addEventListener("geoglyph:logo-controls-synced", scheduleSync);
    syncRecent();
    syncContext();
  }
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", () => setTimeout(initialise, 0), {once:true});
  else setTimeout(initialise, 0);
})();
