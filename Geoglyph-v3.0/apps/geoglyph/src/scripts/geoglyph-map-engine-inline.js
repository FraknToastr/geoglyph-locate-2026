
(() => {
  "use strict";

  const MAPLIBRE_VERSION = "5.3.0-embedded";
  const ESRI_AERIAL_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const ESRI_TOPO_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
  const METROMAP_STORAGE_KEY = "geoglyph-locate2026.geoglyph.metromap.apiKey";
  const surveyResults = window.GeoGlyphSurveyResults.create();
  const presentation = Boolean(window.GeoGlyphConferenceConfig?.enabled);
  const DEFAULT_ANCHOR = presentation
    ? { lng: 144.95604, lat: -37.82402 } // Beside MCEC in South Wharf
    : { lng: 138.6007, lat: -34.9285 };
  const AUSTRALIA_BOUNDS = [[112, -44], [154, -10]];
  const CONFERENCE_INTRO_DURATION_MS = 20000;
  const SOURCE_ID = "geoglyph-ground-geometry";
  const FILL_LAYER_ID = "geoglyph-ground-fill";
  const LINE_LAYER_ID = "geoglyph-ground-outline";
  const DECAL_SOURCE_ID = "geoglyph-ground-decal";
  const DECAL_LAYER_ID = "geoglyph-ground-decal-layer";
  const DESIGN_SIZE = 1000;

  const mapState = {
    mode: window.GeoGlyphSuiteEntry?.profile.mode ?? (presentation ? "arcgis" : "message"),
    message: presentation ? "" : "ADELAIDE",
    anchor: { ...DEFAULT_ANCHOR },
    baseHeightMeters: 300,
    relativeSize: 100,
    bearing: 0,
    tracking: 0,
    lineHeight: 1.15,
    fill: "#31A765",
    outline: "#FFFFFF",
    outlineWidth: 2,
    opacity: 0.82,
    quality: 10,
    extrusionEnabled: false,
    mirrorX: false,
    extrusionDepthMeters: null,
    extrusionTilt: 90,
    extrusionSolid: true,
    orientationMode: "fixed",
    orbitPeriodSeconds: 30,
    selectedFontId: "",
    fontChoiceVersion:0,
    lastHostSignature:'',
    nativeColor: presentation,
    emojiFallbackFontId: null,
    conferenceRenderSuspended: presentation,
    conferenceOverview: presentation,
    conferenceApplying: false,
    conferenceRebuildPending: false,
    lastLocalModel: null,
    displayedFontId: "",
    committedSelection: null,
    pendingBuild: false,
    pendingFit: false,
    explicitFitPending: false,
    randomSearching: false,
    fontRecords: new Map(),
    map: null,
    mapReady: false,
    lastGeoJSON: null,
    lastMetrics: null,
    lastDecal: null,
    lastRenderMode: "none",
    firstFitDone: false,
    initialFitStatus: "pending",
    initialFitCount: 0,
    anchorInitialised: false,
    rebuilding: false,
    rebuildQueued: false,
    systemScanned: false,
    esriLoaded: false,
    mapInitialising: false,
    mapLibrePromise: null,
    basemapAdded: true,
    basemap: "aerial",
    metroMapSourceKey: "",
    arcgisMessage: "",
    arcgisLastValue: undefined,
    arcgisTimer: 0,
    arcgisPolling: false,
    arcgisPollBusy: false,
    arcgisPollStartedAt: null,
    arcgisLayers: null,
    arcgisLayerId: null,
    arcgisGeneration: 0,
    arcgisAbort: null,
    previewActive: false,
    basemapErrorReported: false,
    buildToken: 0,
    anchorPinned: false,
    localFontDescriptors: null,
    hostSyncTimer: 0,
    openTypeFallbackPromise: null,
    statusHistory: []
  };

  const $ = id => document.getElementById(id);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, Number(v)));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const formatCode = code => `U+${Number(code).toString(16).toUpperCase().padStart(4, "0")}`;
  const fontRecordId = (source, name, suffix = "") => `${source}:${name}:${suffix}`.toLowerCase().replace(/[^a-z0-9:_-]+/g, "-");

  function placeAnchor(point, source = "click") {
    if (!point || !Number.isFinite(point.lng) || !Number.isFinite(point.lat)) return false;
    window.GeoGlyph3D?.stopOrbit();
    mapState.anchor = { lng: point.lng, lat: point.lat };
    mapState.anchorInitialised = true;
    mapState.anchorPinned = source === "click";
    updateAnchorStats();
    return true;
  }

  function cancelInitialFit() {
    mapState.explicitFitPending=false;
    if (mapState.initialFitStatus === "pending") mapState.initialFitStatus = "cancelled";
  }

  async function fitInitialGeometry(current) {
    if (mapState.conferenceOverview) return;
    if (mapState.initialFitStatus !== "pending") return;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (!current() || mapState.initialFitStatus !== "pending") return;
    mapState.map?.resize();
    if (fitGeometry()) {
      mapState.initialFitStatus = "done";
      mapState.firstFitDone = true;
      mapState.initialFitCount++;
    }
  }

  // Map engine must not depend on private helpers inside GeoGlyph 15.12's closure.
  // Keep legacy-symbol detection local so Wingdings/Webdings can use the decal path.
  function mapLegacySymbolFamily(record) {
    const name = `${record?.name || ""} ${record?.family || ""} ${record?.cssFamily || ""} ${record?.postscriptName || ""}`
      .toLowerCase().replace(/[\s_-]+/g, "");
    if (name.includes("wingdings3")) return "wingdings3";
    if (name.includes("wingdings2")) return "wingdings2";
    if (name.includes("webdings")) return "webdings";
    if (name.includes("wingdings")) return "wingdings";
    return "";
  }


  function geoGlyphApi() {
    return window.GeoGlyphStudio || null;
  }

  function selectedRecord() {
    return mapState.fontRecords.get(mapState.selectedFontId) || [...mapState.fontRecords.values()][0] || null;
  }

  function makeUi() {
    const nav = document.querySelector(".workflow-nav");
    if (!nav) return;

    let canvasButton = $("mapCanvasToggleBtn");
    if (!canvasButton) {
      canvasButton = document.createElement("button");
      canvasButton.className = "square-btn";
      canvasButton.id = "mapCanvasToggleBtn";
      canvasButton.type = "button";
      const symbolButton = nav.querySelector('[data-workflow="symbol"]');
      symbolButton?.after(canvasButton);
    }
    canvasButton.textContent = "Canvas";
    canvasButton.title = "Show canvas preview";
    canvasButton.setAttribute('aria-controls','previewStage');
    let geoglyphButton = $('geoglyphPreviewBtn');
    if (!geoglyphButton) {
      geoglyphButton = document.createElement('button');
      geoglyphButton.id = 'geoglyphPreviewBtn';
      geoglyphButton.className = 'square-btn';
      geoglyphButton.type = 'button';
      geoglyphButton.textContent = 'Geoglyph';
      geoglyphButton.title = 'Show Geoglyph';
      geoglyphButton.setAttribute('aria-controls','geoglyphMapWorkspace');
    }
    // Geoglyph takes the first position whether Font Explorer has already
    // mounted or is inserted by a later header enhancement.
    if (nav.firstElementChild !== geoglyphButton) nav.prepend(geoglyphButton);

    if ($("geoglyphMapWorkspace")) return;
    const previewBody = document.querySelector(".preview-panel > .panel-body");
    if (!previewBody) return;

    const workspace = document.createElement("section");
    workspace.id = "geoglyphMapWorkspace";
    workspace.className = "geoglyph-map-workspace";
    workspace.hidden = true;
    workspace.innerHTML = `
      <canvas id="geoglyphGroundDecalCanvas" width="64" height="64" aria-hidden="true" style="position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;pointer-events:none"></canvas>
      <div class="geoglyph-map" id="geoglyphMap" aria-label="Map preview canvas"></div>
      <div class="geoglyph-map-overlay geoglyph-map-editor" id="geoglyphMapEditor">
        <div class="map-editor-head">
          <div class="map-editor-title-row">
            <div class="map-editor-titleblock">
              <strong>Ground Font Engine</strong>
            </div>
            ${presentation ? `<div class="map-mini-conference-actions" role="group" aria-label="Local presentation commands">
              <button class="map-collapsed-action" id="mapLocalBeginBtn" type="button">Begin Geoglyph</button>
              <button class="map-collapsed-action" id="mapLocalResetBtn" type="button">Reset</button>
            </div>` : ''}
            <div class="map-editor-head-actions">
              <button class="map-collapsed-action map-header-fit" id="mapFitBtn" type="button" title="Fit geometry" aria-label="Fit geometry">⛶</button>
              <div class="map-collapsed-actions" aria-label="Collapsed map actions">
                <button class="map-collapsed-action map-collapsed-fit" id="mapCollapsedFitBtn" type="button" title="Fit geometry" aria-label="Fit geometry">⛶</button>
                <button class="map-collapsed-action" id="mapCollapsedJpgBtn" type="button" title="Save map to JPG">JPG</button>
                <button class="map-collapsed-action" id="mapCollapsedPngBtn" type="button" title="Save map to PNG">PNG</button>
              </div>
              <button class="map-editor-collapse" id="mapEditorCollapseBtn" type="button" aria-expanded="true" title="Collapse Ground Font Engine">−</button>
            </div>
          </div>
          <div class="map-mode-switch" role="group" aria-label="Projection mode">
            <button class="square-btn is-active" type="button" data-map-mode="message" aria-pressed="true">Message</button>
            <button class="square-btn" type="button" data-map-mode="arcgis" aria-pressed="false">Geoglyph</button>
            <button class="square-btn" type="button" data-map-mode="admin" aria-pressed="false">ArcGIS</button>
          </div>
        </div>

        <section class="map-pane map-arcgis-pane" data-map-pane="arcgis" hidden>
          <div class="arcgis-grid">
            <div id="mapArcgisAuth" hidden>
              <div class="arcgis-token-actions arcgis-signin-actions">
                <button class="map-action map-numbered-step" id="mapArcgisRequestTokenBtn" type="button"><b class="map-step-number">1</b> <span>Open ArcGIS sign-in</span></button>
              </div>
              <label class="map-field map-token-field"><span class="map-step-number">2</span><input id="mapArcgisToken" type="password" autocomplete="off" spellcheck="false" aria-label="Step 2: Paste returned authorization code or access token" placeholder="Paste returned code or access token"></label>
              <div class="arcgis-token-actions arcgis-exchange-actions">
                <button class="map-action map-numbered-step" id="mapArcgisExchangeCodeBtn" type="button"><b class="map-step-number">3</b> <span>Exchange code</span></button>
              </div>
              <div class="arcgis-token-actions arcgis-session-actions">
                <button class="map-action" id="mapArcgisUseTokenBtn" type="button">Use token</button>
                <button class="map-action" id="mapArcgisClearTokenBtn" type="button">Clear</button>
              </div>
              <span id="mapArcgisAuthStatus" role="status">Not signed in</span>
            </div>
            <label class="map-field" id="mapArcgisLayerField" hidden><span>Results layer</span><select id="mapArcgisLayerSelect"><option value="">Choose a results layer</option></select></label>
          <div class="arcgis-actions arcgis-poll-actions" id="mapArcgisPolling" hidden>
              <button class="map-action" id="mapArcgisStartBtn" type="button">Start</button>
              <button class="map-action" id="mapArcgisPollBtn" type="button">Fetch</button>
              <button class="map-action" id="mapArcgisStopBtn" type="button" disabled>Stop</button>
            <label class="arcgis-poll-interval"><span>Poll (s)</span><button class="map-action" id="mapArcgisIntervalMinus" type="button" aria-label="Decrease poll interval">−</button><input id="mapArcgisInterval" type="number" min="1" max="3600" step="1" value="5" aria-label="ArcGIS poll interval in seconds" title="Seconds between checks; changes apply while polling"><button class="map-action" id="mapArcgisIntervalPlus" type="button" aria-label="Increase poll interval">+</button></label>
            </div>
            <button class="map-action arcgis-reset-action" id="mapArcgisReset123Btn" type="button" hidden>Reset 123</button>
            <div class="arcgis-live"><strong>Survey123 results</strong><span id="mapArcgisLiveValue" role="status" aria-live="polite">Ready · Fetch once or Start live updates</span></div>
          </div>
        </section>

        <div class="map-control-grid">
          <label class="map-field map-span-2"><span>Font</span><select id="mapFontSelect"></select></label>
          <div class="map-font-filter-row map-span-2">
            <label><input id="mapFont3DFilter" type="checkbox"> 3D compatible</label>
            <button id="mapFontRescanBtn" class="map-action" type="button">Rescan</button>
          </div>
          <span class="map-span-2" id="mapFontFilterStatus" role="status" hidden></span>
          <div class="map-font-actions map-span-2" role="group" aria-label="Font loading">
            <button class="map-action" id="mapScanSystemBtn" type="button">Allow local fonts</button>
            <button class="map-action" id="mapCopyEsriPathBtn" type="button">Copy Esri Path</button>
            <button class="map-action" id="mapLoadEsriBtn" type="button">Load Esri Fonts</button>
          </div>
          <input id="mapFontFiles" type="file" accept=".ttf,.otf,.ttc" multiple hidden>
          <input id="mapEsriFolderInput" type="file" accept=".ttf,.otf,.ttc" multiple webkitdirectory hidden>
        </div>
        <p id="mapEngineStatus" class="map-engine-status map-status-announcement" role="status">Geometry idle</p>

        <section class="map-pane" data-map-pane="message">
          <label class="map-field"><span>Message</span><textarea id="mapMessage" rows="3">ADELAIDE</textarea></label>
          <div class="map-pair">
            <label class="map-field"><span>Base height</span><div class="map-number"><input id="mapHeight" type="number" min="1" max="300000" step="10" value="300"><em>m</em></div></label>
            <label class="map-field"><span>Relative size</span><div class="map-number"><input id="mapRelativeSize" type="number" min="5" max="1000" step="5" value="100"><em>%</em></div></label>
          </div>
          <div class="map-pair">
            <label class="map-field"><span>Tracking</span><div class="map-number"><input id="mapTracking" type="number" min="-20" max="100" step="1" value="0"><em>% em</em></div></label>
            <label class="map-field"><span>Line height</span><input id="mapLineHeight" type="number" min="0.5" max="3" step="0.05" value="1.15"></label>
          </div>
        </section>

        <section class="map-style-panel">
          <div class="map-pair">
            <label class="map-field"><span>Fill</span><input id="mapFill" type="color" value="#31A765"></label>
            <label class="map-field"><span>Outline</span><input id="mapOutline" type="color" value="#FFFFFF"></label>
          </div>
          <div class="map-pair">
            <label class="map-field"><span>Outline width</span><div class="map-number"><input id="mapOutlineWidth" type="number" min="0" max="20" step="0.5" value="2"><em>px</em></div></label>
            <label class="map-field"><span>Opacity</span><div class="map-number"><input id="mapOpacity" type="number" min="0.05" max="1" step="0.05" value="0.82"><em>α</em></div></label>
          </div>
          <div class="map-pair">
            <label class="map-field"><span>Text bearing</span><div class="map-number"><input id="mapBearing" type="number" min="-360" max="360" step="0.5" value="0"><em>°</em></div></label>
            <label class="map-field"><span>Curve quality</span><div class="map-number"><input id="mapQuality" type="number" min="4" max="36" step="1" value="10"><em>seg</em></div></label>
          </div>
          <label class="map-field map-native-colour"><span>Fix Font Colours e.g. Emojis</span><input id="mapNativeColor" type="checkbox" title="Preserve original glyph colours; the selected outline remains available"></label>
        </section>

        <div class="map-editor-actions">
          <div class="map-action-row">
            <button class="map-action" id="mapExportObjBtn" type="button" disabled aria-describedby="mapObjStatus">OBJ</button>
            <button class="map-action" id="mapExportGeoJsonBtn" type="button">Geojson</button>
            <button class="map-action" id="mapSaveJpgBtn" type="button">JPG</button>
            <button class="map-action" id="mapSavePngBtn" type="button">PNG</button>
          </div>
          <p id="mapObjStatus" class="map-3d-status" role="status">Enable 3D to export an OBJ object.</p>
          <div class="map-action-row map-basemap-row" role="group" aria-label="Basemap">
            <button class="map-action" id="mapEsriAerialBtn" type="button" title="Esri World Imagery">Esri Aerial</button>
            <button class="map-action" id="mapEsriWorldBtn" type="button" title="Esri World Topographic Map">Esri World</button>
            <button class="map-action" id="mapMetroMapBtn" type="button" aria-haspopup="dialog" aria-controls="mapMetroMapDialog">MetroMap</button>
          </div>
          <div class="map-click-note"><span class="map-info-icon" aria-hidden="true">i</span><span>Click the map to move the stamp</span></div>
        </div>
      </div>

      <dialog class="map-key-dialog" id="mapMetroMapDialog" aria-labelledby="mapMetroMapTitle">
        <form id="mapMetroMapForm">
          <div class="map-key-dialog-head"><strong id="mapMetroMapTitle">MetroMap API key</strong><button class="map-action" id="mapMetroMapCloseBtn" type="button" aria-label="Close MetroMap settings">×</button></div>
          <label class="map-field"><span>API key</span><input id="mapMetroMapKey" type="password" autocomplete="off" spellcheck="false" placeholder="MetroMap API key"></label>
          <p id="mapMetroMapStatus" role="status"></p>
          <div class="map-key-dialog-actions"><button class="map-action" id="mapMetroMapSaveBtn" type="submit">Save</button><button class="map-action" id="mapMetroMapRemoveBtn" type="button">Remove</button></div>
        </form>
      </dialog>
      <div class="geoglyph-map-overlay geoglyph-map-stats" id="geoglyphMapStats">
        <span id="mapBasemapStats">Esri Aerial · MapLibre 5.3.0</span>
        <span id="mapGeometryStats">No geometry</span>
        <span id="mapAnchorStats">${DEFAULT_ANCHOR.lng.toFixed(5)}, ${DEFAULT_ANCHOR.lat.toFixed(5)}</span>
      </div>`;
    document.body.append(workspace);

    bindUi();
    refreshFontStore();
    syncUiFromState();
  }

  function bindUi() {
    const nav = document.querySelector(".workflow-nav");
    $("mapCanvasToggleBtn")?.addEventListener("click", event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      showCanvasPreview();
    }, true);
    $('geoglyphPreviewBtn')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (mapState.previewActive && isMapSurfaceVisible()) return;
      // Call Local Font Access while this click still carries user activation. Only the selected face is parsed.
      const outlinePromise = primeHostFontOutline();
      showMapPreview(outlinePromise);
    }, true);
    nav?.addEventListener("click", event => {
      const workflowButton = event.target.closest("[data-workflow]");
      // Dismiss Map without overwriting the workflow the user just requested.
      // This prevents QR / Scan QRs / Magic Eye from requiring a second click.
      if (workflowButton && mapState.previewActive) showCanvasPreview({ preserveWorkflow: true });
    });

    $("mapLocalBeginBtn")?.addEventListener("click", () => window.GeoGlyphConference.runLocalCommand('begin'));
    $("mapLocalResetBtn")?.addEventListener("click", () => window.GeoGlyphConference.runLocalCommand('reset'));

    document.querySelectorAll("[data-map-mode]").forEach(button => button.addEventListener("click", async () => {
      notifyManualMapChange();
      const nextMode = button.dataset.mapMode;
      mapState.adminMode = nextMode === 'admin';
      if (!presentation && mapState.mode === "arcgis" && nextMode !== "arcgis") stopArcgisPolling({ quiet: true });
      mapState.mode = mapState.adminMode ? 'arcgis' : nextMode;
      syncModeUi();
      if (mapState.mode === "arcgis") {
        if (mapState.message) queueRebuild(false);
        else setStatus("Survey123 results · Fetch once or Start live updates", "info");
      } else {
        queueRebuild(false);
      }
    }));

    $("mapEditorCollapseBtn")?.addEventListener("click", () => {
      const sidebar = window.GeoGlyphMapSidebar;
      if (sidebar) sidebar.setPresentation(sidebar.state().presentation === 'full' ? 'mini' : 'full');
    });

    $("mapFontSelect")?.addEventListener("change", async event => {
      await selectFont(event.target.value);
    });
    $('mapFont3DFilter')?.addEventListener('change',event=>{
      fontFilterEnabled=event.target.checked;
      renderFontChooser();
    });
    $('mapFontRescanBtn')?.addEventListener('click',()=>{
      renderFontChooser();compatibilityFilter().rescan();renderFontChooser();
    });
    window.addEventListener('pagehide',()=>fontFilter?.flush());

    $("mapScanSystemBtn")?.addEventListener("click", scanSystemFonts);
    $("mapCopyEsriPathBtn")?.addEventListener("click",()=>geoGlyphApi()?.copyEsriFontPath());
    $("mapLoadEsriBtn")?.addEventListener("click", loadEsriFonts);
    $("mapFontFiles")?.addEventListener("change", async event => {
      await importFileList(Array.from(event.target.files || []), "file");
      event.target.value = "";
    });
    $("mapEsriFolderInput")?.addEventListener("change", async event => {
      await importFileList(Array.from(event.target.files || []), "esri");
      event.target.value = "";
    });

    const bindValue = (id, key, coerce = value => value, fit = false, paintOnly = false) => {
      $(id)?.addEventListener("input", event => {
        notifyManualMapChange();
        mapState[key] = coerce(event.target.value);
        if (paintOnly) {
          if (mapState.lastRenderMode === "decal" && key !== "opacity") {
            queueRebuild(false);
          } else {
            applyMapPaint();
            updateFeatureStyleProperties();
          }
        } else {
          queueRebuild(fit);
        }
      });
    };
    bindValue("mapMessage", "message", String, false);
    bindValue("mapHeight", "baseHeightMeters", value => clamp(value, 1, 300000), false);
    bindValue("mapRelativeSize", "relativeSize", value => clamp(value, 5, 1000), false);
    bindValue("mapTracking", "tracking", value => clamp(value, -20, 100), false);
    bindValue("mapLineHeight", "lineHeight", value => clamp(value, 0.5, 3), false);
    bindValue("mapFill", "fill", String, false, true);
    bindValue("mapOutline", "outline", String, false, true);
    bindValue("mapOutlineWidth", "outlineWidth", value => clamp(value, 0, 20), false, true);
    bindValue("mapOpacity", "opacity", value => clamp(value, 0.05, 1), false, true);
    bindValue("mapBearing", "bearing", value => Number(value) || 0, false);
    bindValue("mapQuality", "quality", value => Math.round(clamp(value, 4, 36)), false);
    $("mapNativeColor")?.addEventListener("change", event => { notifyManualMapChange(); mapState.nativeColor = event.target.checked; queueRebuild(false); });

    const explicitFit = requestFit;
    $("mapFitBtn")?.addEventListener("click", explicitFit);
    $("mapCollapsedFitBtn")?.addEventListener("click", explicitFit);
    $("mapExportGeoJsonBtn")?.addEventListener("click", exportGeoJSON);
    $("mapMetroMapBtn")?.addEventListener("click", () => {
      syncMetroMapKeyUi();
      if(metroMapKeyValue())setBasemap("metromap");
      $("mapMetroMapStatus").textContent="";
      $("mapMetroMapDialog").showModal();
      $("mapMetroMapKey").focus();
    });
    $("mapEsriAerialBtn")?.addEventListener("click", () => setBasemap("aerial"));
    $("mapEsriWorldBtn")?.addEventListener("click", () => setBasemap("world"));
    $("mapMetroMapForm")?.addEventListener("submit",event=>{
      event.preventDefault();saveMetroMapKey();
      if(metroMapKeyValue()){setBasemap("metromap");$("mapMetroMapDialog").close();}
    });
    $("mapMetroMapCloseBtn")?.addEventListener("click",()=>$("mapMetroMapDialog").close());
    $("mapMetroMapRemoveBtn")?.addEventListener("click", removeMetroMapKey);
    $("mapArcgisStartBtn")?.addEventListener("click", startArcgisPolling);
    $("mapArcgisPollBtn")?.addEventListener("click", () => pollArcgisOnce());
    $("mapArcgisStopBtn")?.addEventListener("click", () => stopArcgisPolling());
    bindArcgisAdministration();
    for(const [id,delta] of [['mapArcgisIntervalMinus',-1],['mapArcgisIntervalPlus',1]]) $(id)?.addEventListener('click',()=>{
      $('mapArcgisInterval').value=clamp(arcgisSettings().seconds+delta,1,3600);scheduleArcgisPoll();
    });
    $("mapArcgisInterval")?.addEventListener("input", () => {
      if ($("mapArcgisInterval").validity.valid) scheduleArcgisPoll();
    });
    $("mapArcgisInterval")?.addEventListener("change", () => {
      $("mapArcgisInterval").value = arcgisSettings().seconds;
      scheduleArcgisPoll();
    });
    $("mapArcgisLayerSelect")?.addEventListener("change", () => {
      stopArcgisPolling({ quiet: true });
      const value = $("mapArcgisLayerSelect").value;
      mapState.arcgisLayerId = value === "" ? null : Number(value);
      setArcgisStatus(value === "" ? "Choose a results layer" : "Ready · Fetch once or Start live updates", "info");
    });
    $("mapSaveJpgBtn")?.addEventListener("click", () => saveMapImage("jpeg"));
    $("mapSavePngBtn")?.addEventListener("click", () => saveMapImage("png"));
    $("mapCollapsedJpgBtn")?.addEventListener("click", () => saveMapImage("jpeg"));
    $("mapCollapsedPngBtn")?.addEventListener("click", () => saveMapImage("png"));

    new MutationObserver(() => {
      // Workflow changes initiated while Map is visible must keep the new workflow.
      if (mapState.previewActive && document.body.dataset.workflow !== "symbol")
        showCanvasPreview({ preserveWorkflow: true });
      syncPreviewNavigation();
    }).observe(document.body, { attributes: true, attributeFilter: ["data-workflow"] });

    const selectionObserver = new MutationObserver(scheduleHostSelectionSync);
    [$("fontStatus"), $("codeStatus"), $("selectedUnicode")].filter(Boolean).forEach(node =>
      selectionObserver.observe(node, { childList: true, characterData: true, subtree: true })
    );
    document.addEventListener("click", event => {
      if (event.target.closest("#fontList [data-font-id], #glyphGrid [data-code], #explorerDrawer [data-code]"))
        window.setTimeout(scheduleHostSelectionSync, 0);
    });

    // In Map mode Font Explorer is a true split pane. Keep MapLibre's backing
    // canvas synchronised whenever the drawer or viewport geometry changes.
    new MutationObserver(() => {
      if (mapState.previewActive) syncMapViewportLayout();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", () => {
      if (mapState.previewActive) syncMapViewportLayout();
    }, { passive: true });
  }

  function isMapSurfaceVisible() {
    const workspace = $("geoglyphMapWorkspace");
    return Boolean(workspace && !workspace.hidden && document.body.classList.contains("geoglyph-map-preview"));
  }

  function syncPreviewNavigation() {
    const geoglyph = mapState.previewActive && isMapSurfaceVisible();
    const canvas = !geoglyph && document.body.dataset.workflow === 'symbol';
    for (const [id, active] of [['geoglyphPreviewBtn',geoglyph],['mapCanvasToggleBtn',canvas]]) {
      const button = $(id);
      button?.classList.toggle('is-active',active);
      button?.setAttribute('aria-pressed',String(active));
    }
    document.querySelectorAll('.workflow-nav [data-workflow]').forEach(button => {
      const active = !geoglyph && button.dataset.workflow === document.body.dataset.workflow;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
  }

  function ensureHostSymbolWorkflow() {
    const api = geoGlyphApi();
    if (api?.state) api.state.preview = "symbol";
    const symbolPreview = document.querySelector('.preview-tabs [data-preview="symbol"]');
    if (symbolPreview && !symbolPreview.classList.contains("is-active")) symbolPreview.click();
    document.body.dataset.workflow = "symbol";
    document.querySelectorAll('.workflow-nav [data-workflow]').forEach(button => {
      const active = button.dataset.workflow === "symbol";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function togglePreviewSurface() {
    if (isMapSurfaceVisible()) showCanvasPreview();
    else showMapPreview(primeHostFontOutline());
  }

  function closeExplorerForMapEntry() {
    if (!document.body.classList.contains("drawer-open")) return;
    document.body.classList.remove("drawer-open");
    const drawer = $("explorerDrawer");
    if (drawer) drawer.setAttribute("aria-hidden", "true");
    const toggle = document.querySelector(".workflow-font-btn");
    if (toggle) {
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-pressed", "false");
      toggle.dataset.hoverTip = "Open Font Explorer and preview symbols";
    }
  }

  let viewportResizeFrame = 0;
  function syncMapViewportLayout() {
    if (!mapState.previewActive) return;
    const header = document.querySelector(".app-header");
    const top = Math.max(0, Math.round(header?.getBoundingClientRect().bottom ?? 48));
    const value = `${top}px`;
    if (document.documentElement.style.getPropertyValue('--geoglyph-map-top') !== value)
      document.documentElement.style.setProperty("--geoglyph-map-top", value);
    if (viewportResizeFrame) return;
    viewportResizeFrame = requestAnimationFrame(() => {
      viewportResizeFrame = requestAnimationFrame(() => {
        viewportResizeFrame = 0;
        if (mapState.previewActive) mapState.map?.resize();
      });
    });
  }

  function showMapPreview(outlinePromise = null) {
    const workspace = $("geoglyphMapWorkspace");
    if (!workspace) return;
    if (mapState.previewActive && isMapSurfaceVisible()) { syncPreviewNavigation(); return; }
    ensureHostSymbolWorkflow();
    syncHostSelectionBasics();
    mapState.lastHostSignature=hostSelectionSignature();
    // Enter Map with the whole geographic viewport available. The Font Explorer
    // may then be explicitly opened to create the live 50/50 split.
    closeExplorerForMapEntry();
    mapState.previewActive = true;
    document.body.classList.add("geoglyph-map-preview");
    workspace.hidden = false;
    window.GeoGlyphMapSidebar?.sync();
    syncMapViewportLayout();
    syncPreviewNavigation();
    const headerTitle = document.querySelector(".preview-panel .panel-title");
    if (headerTitle) headerTitle.textContent = "Map Preview";
    refreshFontStore();
    initMap();
    Promise.resolve(outlinePromise).then(record => {
      if (!mapState.previewActive) return;
      queueRebuild(false);
    }).catch(error => {
      console.warn("Selected font outline could not be prepared; using decal fallback", error);
      if (mapState.previewActive) queueRebuild(false);
    });
  }

  function openFontExplorerAfterCanvasReturn() {
    window.setTimeout(() => {
      if (mapState.previewActive || document.body.classList.contains("drawer-open")) return;
      const toggle = document.querySelector(".workflow-font-btn");
      if (toggle) {
        toggle.click();
        return;
      }
      document.body.classList.add("drawer-open");
      const drawer = $("explorerDrawer");
      if (drawer) drawer.setAttribute("aria-hidden", "false");
    }, 0);
  }

  // A received Begin command selects the map-only presentation surface.
  function enterConferenceMode(objectId) {
    mapState.mode = 'arcgis';
    mapState.adminMode = false;
    window.GeoGlyphMapSidebar?.setVisible(false);
    closeExplorerForMapEntry();
    window.GeoGlyphSuiteEntry?.presentBegin?.(objectId);
    if (!mapState.previewActive || !isMapSurfaceVisible()) showMapPreview();
    syncUiFromState();
    syncModeUi();
    window.GeoGlyphMapSidebar?.sync();
    syncMapViewportLayout();
    return mapState.previewActive;
  }

  function showCanvasPreview(options = {}) {
    if (!mapState.previewActive && !options.preserveWorkflow && document.body.dataset.workflow === 'symbol') { syncPreviewNavigation(); return; }
    document.dispatchEvent(new CustomEvent('geoglyph:map-exit'));
    cancelCameraPick();setCameraAuthoring(false);cancelCameraFlight();
    window.GeoGlyphScripts?.stop();
    window.GeoGlyphFontMorph?.clear({message:'Open the map to prepare a font morph.'});
    cancelRandomSearch();mapState.explicitFitPending=false;
    window.GeoGlyph3D?.exitCamera();
    const preserveWorkflow = Boolean(options.preserveWorkflow);
    if (!presentation && (mapState.arcgisPolling || mapState.arcgisPollBusy)) stopArcgisPolling({ quiet: true });
    mapState.previewActive = false;
    document.body.classList.remove("geoglyph-map-preview");
    const workspace = $("geoglyphMapWorkspace");
    if (workspace) workspace.hidden = true;
    window.GeoGlyphMapSidebar?.sync();
    if (!preserveWorkflow) ensureHostSymbolWorkflow();
    syncPreviewNavigation();
    if (!preserveWorkflow) {
      const headerTitle = document.querySelector(".preview-panel .panel-title");
      if (headerTitle) headerTitle.textContent = "Symbol Preview";
      openFontExplorerAfterCanvasReturn();
    }
  }

  function syncUiFromState() {
    const values = {
      mapMessage: mapState.message,
      mapHeight: mapState.baseHeightMeters,
      mapRelativeSize: mapState.relativeSize,
      mapTracking: mapState.tracking,
      mapLineHeight: mapState.lineHeight,
      mapFill: mapState.fill,
      mapOutline: mapState.outline,
      mapOutlineWidth: mapState.outlineWidth,
      mapOpacity: mapState.opacity,
      mapBearing: mapState.bearing,
      mapQuality: mapState.quality
    };
    Object.entries(values).forEach(([id, value]) => { if ($(id)) $(id).value = value; });
    syncMetroMapKeyUi();
    if ($("mapNativeColor")) $("mapNativeColor").checked = mapState.nativeColor;
    syncBasemapButtons();
    syncModeUi();
    renderFontChooser();
  }

  function syncModeUi() {
    syncPreviewNavigation();
    const editorMode = mapState.adminMode && mapState.mode === 'arcgis' ? 'admin' : mapState.mode;
    if ($('geoglyphMapEditor')) $('geoglyphMapEditor').dataset.mapEditorMode = editorMode;
    document.querySelectorAll("[data-map-mode]").forEach(button => {
      const active = button.dataset.mapMode === editorMode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if($('mapArcgisAuth'))$('mapArcgisAuth').hidden=editorMode!=='admin';
    if($('mapArcgisPolling'))$('mapArcgisPolling').hidden=editorMode!=='arcgis';
    syncArcgisAuthentication();
    document.querySelectorAll("[data-map-pane]").forEach(pane => {
      const paneMode = pane.dataset.mapPane;
      pane.hidden = mapState.mode === "arcgis" ? !["arcgis", "message"].includes(paneMode) : paneMode !== mapState.mode;
    });
    document.querySelectorAll('#geoglyphMapEditor [data-map-editor-modes]').forEach(section => {
      section.hidden = !section.dataset.mapEditorModes.split(' ').includes(editorMode);
    });
    const messageBox = $("mapMessage");
    if (messageBox) {
      messageBox.readOnly = mapState.mode === "arcgis";
      messageBox.title = mapState.mode === "arcgis" ? "Live ArcGIS attribute value" : "Ground message";
    }
    window.GeoGlyphControls?.sync();
  }

  function setStatus(message, kind = "") {
    const status = $("mapEngineStatus");
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
    if($("mapMetroMapDialog")?.open)$("mapMetroMapStatus").textContent=message;
    else if(kind==='warn')geoGlyphApi()?.showToast(message);
  }

  function refreshFontStore() {
    const api = geoGlyphApi();
    for (const font of api?.state?.fonts || []) {
      const id = `geoglyph:${font.id}`;
      const existing = mapState.fontRecords.get(id);
      mapState.fontRecords.set(id, {
        id,
        source: font.source || "geoglyph",
        name: font.name || font.family || "Font",
        family: font.family || font.cssFamily || font.name,
        cssFamily: font.cssFamily || font.family || font.name,
        postscriptName: font.postscriptName || "",
        style: font.style || "",
        fontResourceKey: font.fontResourceKey,
        arrayBuffer: font.arrayBuffer || existing?.arrayBuffer || null,
        opentypeFont: font.opentypeFont || existing?.opentypeFont || null,
        geoGlyphRef: font
      });
    }
    if (!mapState.selectedFontId) {
      const preferred = [...mapState.fontRecords.values()].find(record => /Segoe UI Symbol/i.test(record.name)) || [...mapState.fontRecords.values()][0];
      mapState.selectedFontId = preferred?.id || "";
    }
    renderFontChooser();
  }

  function addFontRecord(record) {
    const id = record.id || fontRecordId(record.source || "font", record.name || record.family || "font", record.postscriptName || record.fileName || "");
    const current = mapState.fontRecords.get(id) || {};
    mapState.fontRecords.set(id, { ...current, ...record, id });
    if (!mapState.selectedFontId) mapState.selectedFontId = id;
    return id;
  }

  let fontFilterEnabled=false,fontFilter=null;
  function compatibilityFilter(){
    return fontFilter ||= window.GeoGlyphFontCompatibility.create({
      changed:()=>renderFontChooser(),
      canWork:()=>mapState.previewActive&&!document.hidden&&!mapState.rebuilding&&!mapState.randomSearching&&!mapState.conferenceApplying,
      yieldTask:()=>window.GeoGlyphFontService.yieldTask(),
      check:(item,current)=>window.GeoGlyphFontCompatibility.probe(item,current,{service:window.GeoGlyphFontService,prefersBrowser:shouldPreferDecal})
    });
  }
  function renderFontChooser() {
    const select = $("mapFontSelect");
    if (!select) return;
    const current = mapState.selectedFontId;
    let records = [...mapState.fontRecords.values()].sort((a, b) => `${a.source} ${a.name}`.localeCompare(`${b.source} ${b.name}`));
    const filterStatus=$('mapFontFilterStatus');
    const filter=compatibilityFilter(),service=window.GeoGlyphFontService;
    filter.update(records.map(record=>({id:record.id,record,accessible:hasFontBytes(record),key:window.GeoGlyphFontCompatibility.identity(record,service.keyFor(record))})));
    const p=filter.progress();
    if($('mapFontRescanBtn'))$('mapFontRescanBtn').disabled=p.scanning;
    if(filterStatus){
      filterStatus.hidden=!(fontFilterEnabled||p.scanning||p.storageError);
      filterStatus.textContent=(p.scanning?'Scanning · ':'')+(!p.hasScan?'No saved scan — click Rescan.':`${p.compatible} compatible · ${p.checked}/${p.total} checked`)
        +(p.notScanned?` · ${p.notScanned} not scanned`:'')+(p.inaccessible?` · ${p.inaccessible} need font access`:'')+(p.unverified?` · ${p.unverified} unverified`:'')+(p.storageError?` · ${p.storageError}`:'');
    }
    if(fontFilterEnabled)records=records.filter(record=>filter.result(record.id)==='compatible');
    const groupOrder = ["esri", "system", "windows", "file", "preset", "geoglyph"];
    const groups = new Map();
    for (const record of records) {
      const source = String(record.source || "font").toLowerCase();
      if (!groups.has(source)) groups.set(source, []);
      groups.get(source).push(record);
    }
    const orderedSources = [...groups.keys()].sort((a, b) => {
      const ai = groupOrder.indexOf(a), bi = groupOrder.indexOf(b);
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b);
    });
    select.innerHTML = orderedSources.map(source => {
      const label = source === "esri" ? "Esri / ArcGIS Pro" : source === "system" || source === "windows" ? "System fonts" : source === "file" ? "Loaded files" : "GeoGlyph fonts";
      return `<optgroup label="${esc(label)}">${groups.get(source).map(record => `<option value="${esc(record.id)}">${esc(record.name)}${record.style ? ` — ${esc(record.style)}` : ""}</option>`).join("")}</optgroup>`;
    }).join("");
    if (records.some(record => record.id === current)) select.value = current;
    else if(fontFilterEnabled){
      const currentRecord=mapState.fontRecords.get(current),label=currentRecord?.name||'No font selected';
      const option=new Option(`${label} — current selection (${compatibilityFilter().result(current)})`,current,true,true);
      option.disabled=true;select.prepend(option);select.value=current;
    }
  }

  async function scanSystemFonts() {
    if (typeof window.queryLocalFonts !== "function") {
      setStatus("Local Font Access unavailable; load font files instead", "warn");
      return;
    }
    const button = $("mapScanSystemBtn");
    if (button) { button.disabled = true; button.textContent = "Scanning…"; }
    try {
      const fonts = await window.GeoGlyphFontService.requestLocalFonts();
      mapState.localFontDescriptors = fonts;
      fonts.forEach((descriptor, index) => {
        const name = descriptor.fullName || descriptor.family || descriptor.postscriptName || `System font ${index + 1}`;
        addFontRecord({
          id: fontRecordId("system", name, descriptor.postscriptName || descriptor.style || index),
          source: "system",
          name,
          family: descriptor.family || name,
          cssFamily: descriptor.family || name,
          postscriptName: descriptor.postscriptName || "",
          style: descriptor.style || "",
          localDescriptor: descriptor
        });
      });
      mapState.systemScanned = true;
      window.GeoGlyphFontService.resolveLocalFont(selectedRecord());
      renderFontChooser();
      setStatus(`${fonts.length} system font faces indexed`, "ok");
      if (mapState.previewActive) queueRebuild(false);
    } catch (error) {
      console.error(error);
      setStatus("System font scan cancelled or blocked", "warn");
    } finally {
      if (button) { button.disabled = false; button.textContent = "Allow local fonts"; }
    }
  }

  async function loadEsriFonts() {
    setStatus("Choose ArcGIS Pro Resources\\Fonts", "info");
    if (typeof window.showDirectoryPicker === "function") {
      try {
        const directory = await window.showDirectoryPicker({ mode: "read" });
        const entries = [];
        for await (const [name, handle] of directory.entries()) {
          if (handle.kind === "file" && /\.(ttf|otf|ttc)$/i.test(name)) entries.push({ name, handle });
        }
        entries.forEach(({ name, handle }) => addFontRecord({
          id: fontRecordId("esri", name, "folder"),
          source: "esri",
          name: name.replace(/\.(ttf|otf|ttc)$/i, ""),
          family: name.replace(/\.(ttf|otf|ttc)$/i, ""),
          cssFamily: name.replace(/\.(ttf|otf|ttc)$/i, ""),
          fileName: name,
          fileHandle: handle
        }));
        mapState.esriLoaded = true;
        renderFontChooser();
        setStatus(`${entries.length} Esri font files indexed`, "ok");
      } catch (error) {
        if (error?.name !== "AbortError") console.error(error);
        if (error?.name !== "AbortError") $("mapEsriFolderInput")?.click();
      }
      return;
    }
    $("mapEsriFolderInput")?.click();
  }

  async function importFileList(files, source = "file") {
    cancelRandomSearch();
    mapState.fontChoiceVersion++;
    const candidates = files.filter(file => /\.(ttf|otf|ttc)$/i.test(file.name));
    for (const file of candidates) {
      addFontRecord({
        id: fontRecordId(source, file.webkitRelativePath || file.name, file.size),
        source,
        name: file.name.replace(/\.(ttf|otf|ttc)$/i, ""),
        family: file.name.replace(/\.(ttf|otf|ttc)$/i, ""),
        cssFamily: file.name.replace(/\.(ttf|otf|ttc)$/i, ""),
        file,
        fileName: file.name
      });
    }
    renderFontChooser();
    if (candidates.length) {
      const last = [...mapState.fontRecords.values()].filter(r => r.source === source).at(-1);
      if (last) {
        mapState.selectedFontId = last.id;
        $("mapFontSelect").value = last.id;
        await activateSelectedFont();
        queueRebuild(false);
      }
    }
    setStatus(`${candidates.length} ${source === "esri" ? "Esri" : "font"} file(s) indexed`, candidates.length ? "ok" : "warn");
  }

  async function activateSelectedFont() {
    const record = selectedRecord(); if (!record) return null;
    const selectedId = record.id,choice=mapState.fontChoiceVersion;
    try {
      const font = await ensureOpenTypeFont(record);
      if (selectedId !== mapState.selectedFontId || choice!==mapState.fontChoiceVersion) return font;
      record.outlineIndexUnavailable = false;
      setStatus(record.name + ' · outline geometry ready', 'ok'); return font;
    } catch (error) {
      record.outlineIndexUnavailable = true;
      if (selectedId !== mapState.selectedFontId || choice!==mapState.fontChoiceVersion) return null;
      setStatus(record.name + ' · styled browser rendering ready', 'warn'); return null;
    }
  }

  async function ensureOpenTypeFont(record) {
    const service = window.GeoGlyphFontService;
    service.resolveLocalFont(record);
    // CSS face registration does not depend on the outline parser supporting the font.
    service.ensureFace(record).catch(() => null);
    const metadata = await service.prepare(record);
    record.opentypeFont = metadata; return metadata;
  }

  function normalizedFontName(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }

  function currentHostFont() {
    const api = geoGlyphApi();
    return api?.state?.fonts?.find(font => font.id === api.state.selectedFontId) || null;
  }

  function syncHostSelectionBasics() {
    refreshFontStore();
    const hostFont = currentHostFont();
    if (hostFont?.id) {
      const directId = `geoglyph:${hostFont.id}`;
      if (mapState.fontRecords.has(directId)) mapState.selectedFontId = directId;
    }
    renderFontChooser();
    if ($("mapFontSelect") && mapState.selectedFontId) $("mapFontSelect").value = mapState.selectedFontId;
  }

  function recordHasOutlineAccess(record) {
    return Boolean(record && (record.opentypeFont || record.arrayBuffer || record.geoGlyphRef?.arrayBuffer || record.localDescriptor?.blob || record.metadata?.blob || record.geoGlyphRef?.metadata?.blob || record.geoGlyphRef?.file || record.fileHandle?.getFile || record.file));
  }

  function fontMatchScore(descriptor, hostFont) {
    if (!descriptor || !hostFont) return -1;
    const targets = [hostFont.postscriptName, hostFont.name, hostFont.family, hostFont.cssFamily].map(normalizedFontName).filter(Boolean);
    const values = [descriptor.postscriptName, descriptor.fullName, descriptor.family].map(normalizedFontName).filter(Boolean);
    let score = -1;
    for (let ti = 0; ti < targets.length; ti++) for (let vi = 0; vi < values.length; vi++) {
      if (targets[ti] === values[vi]) score = Math.max(score, 100 - ti * 4 - vi);
    }
    const wantedStyle = normalizedFontName(hostFont.style);
    if (score >= 0 && wantedStyle && descriptor.style && normalizedFontName(descriptor.style) !== wantedStyle) return -1;
    if (score >= 0 && wantedStyle && normalizedFontName(descriptor.style) === wantedStyle) score += 8;
    return score;
  }

  function bestLocalDescriptor(descriptors, hostFont) {
    return window.GeoGlyphFontService.matchLocalFont(hostFont);
  }

  function existingMatchingOutlineRecord(hostFont) {
    const direct = hostFont?.id ? mapState.fontRecords.get(`geoglyph:${hostFont.id}`) : null;
    if (recordHasOutlineAccess(direct)) return direct;
    let best = null, bestScore = -1, ambiguous = false;
    for (const record of mapState.fontRecords.values()) {
      if (!recordHasOutlineAccess(record)) continue;
      const descriptorLike = { postscriptName: record.postscriptName, fullName: record.name, family: record.family, style: record.style };
      const score = fontMatchScore(descriptorLike, hostFont);
      if (score > bestScore) { best = record; bestScore = score; ambiguous = false; }
      else if (score === bestScore && score >= 50 && best && window.GeoGlyphFontService.keyFor(best) !== window.GeoGlyphFontService.keyFor(record)) ambiguous = true;
    }
    return bestScore >= 50 && !ambiguous ? best : direct;
  }

  function ensureOpenTypeLibrary() { return Promise.resolve(Boolean(window.opentype?.parse)); }
  function hostSelectionSignature() { return (currentHostFont()?.id||'')+':'+String(geoGlyphApi()?.state?.selectedCode??65); }

  async function primeHostFontOutline(options = {}) {
    const choice=mapState.fontChoiceVersion,signature=hostSelectionSignature();
    const current=()=>choice===mapState.fontChoiceVersion&&signature===hostSelectionSignature();
    syncHostSelectionBasics();
    const hostFont = currentHostFont();
    if (!hostFont) {
      setStatus("Select a font in Font Explorer", "warn");
      return null;
    }

    let record = existingMatchingOutlineRecord(hostFont);
    if (!recordHasOutlineAccess(record) && typeof window.queryLocalFonts === "function" &&
        (options.requestPermission !== false || window.GeoGlyphFontService.localFonts().length)) {
      try {
        setStatus(`Resolving ${hostFont.name || hostFont.family || "selected font"} outline…`, "info");
        if (!window.GeoGlyphFontService.localFonts().length) await window.GeoGlyphFontService.requestLocalFonts();
        mapState.localFontDescriptors = window.GeoGlyphFontService.localFonts();
        if(!current())return null;
        const descriptor = window.GeoGlyphFontService.matchLocalFont(hostFont);
        if (descriptor) {
          const name = descriptor.fullName || descriptor.family || descriptor.postscriptName || hostFont.name;
          const id = fontRecordId("system", name, descriptor.postscriptName || descriptor.style || "selected");
          addFontRecord({
            id,
            source: "system",
            name,
            family: descriptor.family || hostFont.family || name,
            cssFamily: hostFont.cssFamily || descriptor.family || name,
            postscriptName: descriptor.postscriptName || "",
            style: descriptor.style || "",
            localDescriptor: descriptor
          });
          record = mapState.fontRecords.get(id);
        }
      } catch (error) {
        if (error?.name !== "AbortError") console.warn("Local Font Access", error);
      }
    }

    if(!current())return null;
    if (!recordHasOutlineAccess(record)) {
      mapState.selectedFontId = hostFont.id ? `geoglyph:${hostFont.id}` : mapState.selectedFontId;
      renderFontChooser();
      const fallbackRecord = selectedRecord();
      setStatus(`${hostFont.name || "Selected font"} · outline unavailable, decal fallback ready`, "warn");
      return fallbackRecord;
    }

    mapState.selectedFontId = record.id;
    renderFontChooser();
    if ($("mapFontSelect")) $("mapFontSelect").value = record.id;
    if (!await ensureOpenTypeLibrary()) {
      setStatus(`${record.name} · OpenType parser unavailable, decal fallback ready`, "warn");
      return record;
    }
    if(!current())return null;
    const font = await activateSelectedFont();
    if(!current())return null;
    if (!font) {
      setStatus(`${record.name} · outline parse unavailable, decal fallback ready`, "warn");
      return record;
    }
    if (mapState.previewActive && mapState.mapReady) queueRebuild(false);
    return record;
  }

  function scheduleHostSelectionSync() {
    if (!mapState.previewActive) return;
    const signature=hostSelectionSignature();if(signature===mapState.lastHostSignature)return;
    cancelRandomSearch();mapState.lastHostSignature=signature;mapState.fontChoiceVersion++;
    if (mapState.hostSyncTimer) window.clearTimeout(mapState.hostSyncTimer);
    const choice=mapState.fontChoiceVersion;
    mapState.hostSyncTimer = window.setTimeout(async () => {
      mapState.hostSyncTimer = 0;
      if (!mapState.previewActive||choice!==mapState.fontChoiceVersion||signature!==hostSelectionSignature()) return;
      syncHostSelectionBasics();
      await primeHostFontOutline({ requestPermission:false });
      queueRebuild(false);
    }, 0);
  }

  function ensureMapLibre() {
    return Promise.resolve(Boolean(window.maplibregl && typeof window.maplibregl.Map === "function"));
  }

  function webglSupported() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2", { antialias: false }) || canvas.getContext("webgl", { antialias: false });
      if (!gl) return false;
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      return true;
    } catch {
      return false;
    }
  }

  let arcgisAdminClient=null,arcgisAdminBusy=false,arcgisAuthTimer=0;
  function adminClient(){return arcgisAdminClient ||= window.GeoGlyphArcgisAdmin.create();}
  function syncArcgisAuthentication(){
    const button=$('mapArcgisReset123Btn');
    if(button){button.hidden=!(mapState.mode==='arcgis'&&arcgisAdminClient?.authenticated());button.disabled=arcgisAdminBusy;}
    for(const id of ['mapArcgisRequestTokenBtn','mapArcgisExchangeCodeBtn','mapArcgisUseTokenBtn','mapArcgisClearTokenBtn'])if($(id))$(id).disabled=arcgisAdminBusy;
    if(arcgisAdminBusy)for(const id of ['mapArcgisStartBtn','mapArcgisPollBtn'])if($(id))$(id).disabled=true;
  }
  function bindArcgisAdministration(){
    const status=(text)=>{$('mapArcgisAuthStatus').textContent=text;};
    const action=async(job)=>{
      if(arcgisAdminBusy)return;arcgisAdminBusy=true;syncArcgisAuthentication();
      try{await job();}catch(error){status(error instanceof TypeError?'ArcGIS network request failed. Check connectivity and retry.':error.message);}
      finally{arcgisAdminBusy=false;syncArcgisControls();syncArcgisAuthentication();if(mapState.arcgisPolling)scheduleArcgisPoll();}
    };
    $('mapArcgisRequestTokenBtn').addEventListener('click',()=>{
      // Open synchronously to retain the browser's popup permission during SHA-256.
      const popup=window.open('about:blank','geoglyph-arcgis-signin','popup=yes,width=760,height=760,resizable=yes,scrollbars=yes');
      void action(async()=>{if(!popup)throw Error('Allow popups for GeoGlyph, then open sign-in again.');
        try{popup.location=await adminClient().authorize();}catch(error){popup.close();throw error;}
        status('Sign in to ArcGIS, then paste the returned code and choose Exchange code.');
      });
    });
    for(const [id,exchange] of [['mapArcgisExchangeCodeBtn',true],['mapArcgisUseTokenBtn',false]])$(id).addEventListener('click',()=>void action(async()=>{
      const input=$('mapArcgisToken'),value=input.value;input.value='';
      const name=await adminClient().login(value,{exchange});status('Signed in as '+name);
      clearTimeout(arcgisAuthTimer);arcgisAuthTimer=setTimeout(()=>{adminClient().authenticated();syncArcgisAuthentication();status('Session expired. Sign in again.');},Math.max(1,adminClient().expiresAt-Date.now()));
    }));
    $('mapArcgisClearTokenBtn').addEventListener('click',()=>{adminClient().clear();clearTimeout(arcgisAuthTimer);$('mapArcgisToken').value='';status('Not signed in');syncArcgisAuthentication();});
    $('mapArcgisReset123Btn').addEventListener('click',()=>void action(async()=>{
      status('Checking survey and deletion permissions…');
      const plan=await adminClient().prepare(window.GeoGlyphSurveyResults.config.serviceUrl);
      if(!plan.ids.length){status('The survey has no records to delete.');return;}
      if(!window.confirm(`Reset 123: permanently delete ${plan.ids.length} survey responses from ${plan.name}?\n${plan.url}\nRelated attachments may also be removed. This cannot be undone.`)){status('Reset 123 cancelled.');return;}
      stopArcgisPolling({quiet:true});window.GeoGlyphConference?.clearSurveyQueue();
      status('Deleting confirmed survey responses…');
      try{const count=await adminClient().remove(plan);status(`Deleted and verified ${count} survey responses. Polling is stopped.`);}
      finally{window.GeoGlyphConference?.clearSurveyQueue();mapState.arcgisLayers=null;mapState.arcgisLastValue=null;}
    }));
  }
  function arcgisSettings() {
    return { seconds: Math.round(clamp($("mapArcgisInterval")?.value || 5, 1, 3600)) };
  }

  function setArcgisStatus(message, kind = "") {
    const live = $("mapArcgisLiveValue");
    if (live) live.textContent = message;
    if (mapState.mode === "arcgis") setStatus(message, kind);
  }

  function syncArcgisControls() {
    const start = $("mapArcgisStartBtn"), fetch = $("mapArcgisPollBtn"), stop = $("mapArcgisStopBtn");
    if (start) { start.disabled = mapState.arcgisPolling; start.setAttribute("aria-pressed", String(mapState.arcgisPolling)); }
    if (fetch) fetch.disabled = mapState.arcgisPollBusy;
    if (stop) stop.disabled = !mapState.arcgisPolling && !mapState.arcgisPollBusy;
  }

  function stopArcgisPolling(options = {}) {
    if (mapState.arcgisTimer) window.clearTimeout(mapState.arcgisTimer);
    mapState.arcgisTimer = 0;
    mapState.arcgisPolling = false;
    mapState.arcgisGeneration++;
    mapState.arcgisAbort?.abort();
    mapState.arcgisAbort = null;
    mapState.arcgisPollBusy = false;
    mapState.arcgisPollStartedAt = null;
    if (presentation) window.GeoGlyphConference?.pause();
    syncArcgisControls();
    if (!options.quiet) setArcgisStatus("Live updates stopped", "info");
  }

  async function startArcgisPolling() {
    if(arcgisAdminBusy)return;
    window.GeoGlyphScripts?.stop();
    if (presentation && window.GeoGlyphConference && !window.GeoGlyphConference.state.ready)
      if(!await window.GeoGlyphConference.retryStartup())return;
    stopArcgisPolling({ quiet: true });
    mapState.arcgisPolling = true;
    if (presentation) window.GeoGlyphConference?.resume();
    syncArcgisControls();
    await pollArcgisOnce();
  }

  function scheduleArcgisPoll() {
    if (mapState.arcgisTimer) window.clearTimeout(mapState.arcgisTimer);
    mapState.arcgisTimer = 0;
    if (!mapState.arcgisPolling || mapState.arcgisPollBusy) return;
    const generation = mapState.arcgisGeneration;
    const elapsed = mapState.arcgisPollStartedAt === null ? Infinity : performance.now() - mapState.arcgisPollStartedAt;
    const delay = Math.max(0, arcgisSettings().seconds * 1000 - elapsed);
    mapState.arcgisTimer = window.setTimeout(() => {
      mapState.arcgisTimer = 0;
      if (generation === mapState.arcgisGeneration && mapState.arcgisPolling) pollArcgisOnce();
    }, delay);
  }

  async function resultsLayer(signal) {
    if (!mapState.arcgisLayers) {
      const layers = await surveyResults.discover({ signal });
      signal.throwIfAborted();
      mapState.arcgisLayers = layers;
      const selector = $("mapArcgisLayerSelect");
      selector.replaceChildren(new Option("Choose a results layer", ""), ...layers.map(layer => new Option(layer.name, String(layer.id))));
      $("mapArcgisLayerField").hidden = layers.length === 1;
      if (layers.length === 1 && mapState.arcgisLayerId === null) {
        mapState.arcgisLayerId = layers[0].id;
        selector.value = String(layers[0].id);
      }
    }
    const layer = mapState.arcgisLayers.find(layer => layer.id === mapState.arcgisLayerId);
    if (!layer) throw new window.GeoGlyphSurveyResults.ResultsError("Choose a results layer, then Fetch or Start.", "selection");
    return layer;
  }

  async function pollArcgisOnce() {
    if(arcgisAdminBusy)return false;
    if (mapState.arcgisPollBusy) return false;
    if (mapState.arcgisTimer) window.clearTimeout(mapState.arcgisTimer);
    mapState.arcgisTimer = 0;
    const generation = mapState.arcgisGeneration;
    const controller = new AbortController();
    const current = () => generation === mapState.arcgisGeneration && mapState.arcgisAbort === controller && !controller.signal.aborted;
    mapState.arcgisAbort = controller;
    mapState.arcgisPollBusy = true;
    mapState.arcgisPollStartedAt = performance.now();
    syncArcgisControls();
    setArcgisStatus("Checking Survey123 results…", "info");
    try {
      const layer = await resultsLayer(controller.signal);
      if (presentation && window.GeoGlyphConference) {
        const status = await window.GeoGlyphConference.poll(layer, { signal: controller.signal });
        if (!current()) return false;
        setArcgisStatus(status, "ok");
        return true;
      }
      const result = await surveyResults.latest(layer, { signal: controller.signal });
      if (!current()) return false;
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      if (!result) {
        setArcgisStatus(`Connected · Waiting for a non-empty response · ${time} · ${layer.orderingLabel}`, "info");
        return true;
      }
      const message = result.message;
      const changed = message !== mapState.arcgisLastValue;
      mapState.arcgisLastValue = message;
      mapState.arcgisMessage = message;
      mapState.message = message;
      if ($("mapMessage")) $("mapMessage").value = message;
      setArcgisStatus(`${changed ? "Updated" : "No change"} · ${time} · ${layer.orderingLabel}`, "ok");
      if (changed && mapState.previewActive && mapState.mode === "arcgis") queueRebuild(false);
      return true;
    } catch (error) {
      if (!current()) return false;
      if (["access", "schema", "selection"].includes(error?.kind)) stopArcgisPolling({ quiet: true });
      setArcgisStatus(error?.message || "Could not reach the results view. Check your connection.", "warn");
      return false;
    } finally {
      if (current()) {
        mapState.arcgisAbort = null;
        mapState.arcgisPollBusy = false;
        syncArcgisControls();
        scheduleArcgisPoll();
      }
    }
  }

  async function waitForMapSnapshotFrame(map) {
    return new Promise(resolve => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(done, 650);
      try { map.once("render", done); } catch (_) { done(); }
      try { map.triggerRepaint(); } catch (_) {}
    });
  }

  function captureMapFramebuffer(map) {
    const source = map?.getCanvas?.();
    if (!source?.width || !source?.height) throw new Error("Map canvas is unavailable");
    const gl = source.getContext("webgl2") || source.getContext("webgl");
    if (!gl) throw new Error("Map WebGL framebuffer is unavailable");
    const width = source.width;
    const height = source.height;
    const raw = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, raw);
    const glError = gl.getError();
    if (glError !== gl.NO_ERROR) throw new Error(`WebGL readPixels failed (${glError})`);
    const flipped = new Uint8ClampedArray(raw.length);
    const rowBytes = width * 4;
    for (let y = 0; y < height; y++) {
      const srcOffset = (height - 1 - y) * rowBytes;
      const dstOffset = y * rowBytes;
      flipped.set(raw.subarray(srcOffset, srcOffset + rowBytes), dstOffset);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Image export canvas is unavailable");
    ctx.putImageData(new ImageData(flipped, width, height), 0, 0);
    return canvas;
  }

  async function encodeCanvasBlob(canvas, mime, quality) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Browser could not encode the map image")), mime, quality);
      } catch (error) {
        reject(error);
      }
    });
  }

  async function saveMapImage(format = "png") {
    if(window.GeoGlyphFontMorph&&!window.GeoGlyphFontMorph.canExport()){
      setStatus('Move the morph slider to an endpoint before exporting.','warn');return;
    }
    if(window.GeoGlyphFontMorph?.isActive())window.GeoGlyphFontMorph.pause();
    const map = mapState.map;
    if (!mapState.previewActive || !mapState.mapReady || !map) {
      setStatus("Map is not ready to export", "warn");
      return;
    }
    const isJpeg = format === "jpeg" || format === "jpg";
    const ext = isJpeg ? "jpg" : "png";
    const mime = isJpeg ? "image/jpeg" : "image/png";
    const resumeAnimation=window.GeoGlyph3D?.pauseAnimation();
    try {
      setStatus(`Preparing ${isJpeg ? "JPG" : "PNG"} map export…`, "info");
      if (mapState.extrusionEnabled) await window.GeoGlyph3D?.update();
      await waitForMapSnapshotFrame(map);
      const captured = captureMapFramebuffer(map);
      let output = captured;
      if (isJpeg) {
        const flattened = document.createElement("canvas");
        flattened.width = captured.width;
        flattened.height = captured.height;
        const ctx = flattened.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("JPG export canvas is unavailable");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, flattened.width, flattened.height);
        ctx.drawImage(captured, 0, 0);
        output = flattened;
      }
      const blob = await encodeCanvasBlob(output, mime, isJpeg ? 0.94 : undefined);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `geoglyph-map-${mapState.mode}-${Date.now()}.${ext}`;
      link.style.display = "none";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setStatus(`${ext.toUpperCase()} map saved`, "ok");
    } catch (error) {
      console.error("Map image export", error);
      const security = /security|cross-origin|origin-clean|readpixels/i.test(String(error?.message || error));
      setStatus(security ? "Map image export blocked by browser/WebGL security" : `Map image export failed · ${error.message || error}`, "warn");
    } finally { resumeAnimation?.(); }
  }

  function metroMapKeyValue() {
    return String($("mapMetroMapKey")?.value || "").trim();
  }

  function storedMetroMapKey() {
    try { return String(localStorage.getItem(METROMAP_STORAGE_KEY) || ""); }
    catch (_) { return ""; }
  }

  function syncMetroMapKeyUi() {
    const input = $("mapMetroMapKey");
    if (!input) return;
    const stored = storedMetroMapKey();
    if (stored && !input.value) input.value = stored;
  }

  function saveMetroMapKey() {
    const key = metroMapKeyValue();
    if (!key) {
      setStatus("Enter a MetroMap API key before saving", "warn");
      $("mapMetroMapKey")?.focus();
      return;
    }
    try {
      localStorage.setItem(METROMAP_STORAGE_KEY, key);
      setStatus("MetroMap API key saved in this browser", "ok");
    } catch (error) {
      console.warn(error);
      setStatus("Browser storage is unavailable; key kept for this session only", "warn");
    }
  }

  function removeMetroMapKey() {
    try { localStorage.removeItem(METROMAP_STORAGE_KEY); } catch (_) {}
    const input = $("mapMetroMapKey");
    if (input) input.value = "";
    if (mapState.basemap === "metromap") setBasemap("aerial");
    setStatus("Saved MetroMap API key removed", "ok");
  }

  function metroMapTileUrl(key) {
    // MetroMap official Australia_latest WMTS template, GDA2020 service.
    return `https://api.metromap.com.au/ogc/gda2020/key/${encodeURIComponent(key)}/state:LATEST/service?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=Australia_latest&STYLE=default&FORMAT=image/png&TILEMATRIXSET=webmercator&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;
  }

  function basemapLabel(key = mapState.basemap) {
    if (key === "metromap") return "MetroMap Australia Latest";
    if (key === "world") return "Esri World Topographic";
    return "Esri Aerial";
  }

  function syncBasemapButtons() {
    $("mapMetroMapBtn")?.classList.toggle("is-active", mapState.basemap === "metromap");
    $("mapEsriAerialBtn")?.classList.toggle("is-active", mapState.basemap === "aerial");
    $("mapEsriWorldBtn")?.classList.toggle("is-active", mapState.basemap === "world");
    const stats = $("mapBasemapStats");
    if (stats) stats.textContent = `${basemapLabel()} · MapLibre 5.3.0`;
  }

  function setLayerVisibility(map, id, visible) {
    if (map?.getLayer(id)) map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
  }

  function ensureMetroMapLayer(key) {
    const map = mapState.map;
    if (!map || !mapState.mapReady || !key) return false;
    const sourceId = "metromap-latest";
    const layerId = "metromap-latest";
    if (mapState.metroMapSourceKey !== key) {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      mapState.metroMapSourceKey = "";
    }
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "raster",
        tiles: [metroMapTileUrl(key)],
        tileSize: 256,
        maxzoom: 22,
        attribution: "Imagery © MetroMap"
      });
    }
    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "raster",
        source: sourceId,
        layout: { visibility: "none" },
        paint: { "raster-opacity": 1, "raster-fade-duration": 0 }
      }, map.getLayer(FILL_LAYER_ID) ? FILL_LAYER_ID : undefined);
    }
    mapState.metroMapSourceKey = key;
    return true;
  }

  function setBasemap(kind) {
    const map = mapState.map;
    if (!map || !mapState.mapReady) return;
    if (kind === "metromap") {
      const key = metroMapKeyValue();
      if (!key) {
        setStatus("Enter a MetroMap API key below, then choose MetroMap", "warn");
        $("mapMetroMapKey")?.focus();
        return;
      }
      if (!ensureMetroMapLayer(key)) return;
    }
    mapState.basemap = kind;
    mapState.basemapErrorReported = false;
    setLayerVisibility(map, "esri-world-imagery", kind === "aerial");
    setLayerVisibility(map, "esri-world-topographic", kind === "world");
    setLayerVisibility(map, "metromap-latest", kind === "metromap");
    syncBasemapButtons();
    setStatus(`${basemapLabel(kind)} active`, "ok");
  }

  class GeoGlyphCameraControl {
    onAdd(map) {
      this.map = map;
      this.container = document.createElement("div");
      this.container.className = "maplibregl-ctrl maplibregl-ctrl-group geoglyph-camera-control";
      this.homeButton = document.createElement('button');
      this.homeButton.type = 'button';
      this.homeButton.id = 'mapHomeBtn';
      this.homeButton.title = 'Australia home view';
      this.homeButton.setAttribute('aria-label','Australia home view');
      this.homeButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" style="margin:auto" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/></svg>';
      this.homeButton.addEventListener('click',()=>showHomeView());
      this.northButton = document.createElement("button");
      this.northButton.type = "button";
      this.northButton.textContent = "↑";
      this.northButton.className = "geoglyph-north-symbol";
      this.northButton.title = "Reset map bearing to north";
      this.northButton.setAttribute("aria-label", "Reset map bearing to north");
      this.northButton.addEventListener("click", () => map.easeTo({ bearing: 0, duration: 350 }));
      this.viewButton = document.createElement("button");
      this.viewButton.type = "button";
      this.viewButton.title = "Toggle 2D / 3D map pitch";
      this.viewButton.setAttribute("aria-label", "Toggle 2D / 3D map pitch");
      this.viewButton.addEventListener("click", () => {
        const make3D = map.getPitch() < 10;
        map.easeTo({ pitch: make3D ? 55 : 0, duration: 450 });
      });
      this.update = () => {
        const is3D = map.getPitch() >= 10;
        this.viewButton.textContent = is3D ? "2D" : "3D";
        this.viewButton.classList.toggle("is-active", is3D);
      };
      map.on("pitch", this.update);
      this.update();
      this.container.append(this.homeButton, this.northButton, this.viewButton);
      return this.container;
    }
    onRemove() {
      if (this.map && this.update) this.map.off("pitch", this.update);
      this.container?.remove();
      this.map = null;
    }
  }

  let mapInitialisationGeneration = 0;
  function retryConferenceMapInitialization() {
    if (!presentation || mapState.mapReady) return;
    ++mapInitialisationGeneration;
    const old = mapState.map;
    if (old) { window.GeoGlyph3D?.clear(); old.remove(); }
    mapState.map = null;
    mapState.mapInitialising = false;
    return initMap();
  }
  async function initMap() {
    if (mapState.map || mapState.mapInitialising) return;
    mapState.mapInitialising = true;
    const generation = mapInitialisationGeneration;
    setStatus("Creating map canvas…", "info");
    try {
      const available = await ensureMapLibre();
      if (generation !== mapInitialisationGeneration) return;
      if (!available) {
        setStatus("Embedded MapLibre vendor failed to initialise", "warn");
        return;
      }
      if (!webglSupported()) {
        setStatus("WebGL is unavailable in this browser session", "warn");
        return;
      }
      const container = $("geoglyphMap");
      if (!container) return;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (generation !== mapInitialisationGeneration) return;
      const map = new window.maplibregl.Map({
        container,
        style: {
          version: 8,
          sources: {
            "esri-world-imagery": {
              type: "raster",
              tiles: [ESRI_AERIAL_URL],
              tileSize: 256,
              maxzoom: 19,
              attribution: "Tiles © Esri — Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            },
            "esri-world-topographic": {
              type: "raster",
              tiles: [ESRI_TOPO_URL],
              tileSize: 256,
              maxzoom: 19,
              attribution: "Tiles © Esri"
            }
          },
          layers: [
            { id: "background", type: "background", paint: { "background-color": "#10171b" } },
            { id: "esri-world-imagery", type: "raster", source: "esri-world-imagery", paint: { "raster-opacity": 1, "raster-fade-duration": 0 } },
            { id: "esri-world-topographic", type: "raster", source: "esri-world-topographic", layout: { visibility: "none" }, paint: { "raster-opacity": 1, "raster-fade-duration": 0 } }
          ]
        },
        center: [mapState.anchor.lng, mapState.anchor.lat],
        zoom: 13.1,
        bounds: AUSTRALIA_BOUNDS,
        fitBoundsOptions: { padding: Math.max(8,Math.min(48,container.clientWidth*.08,container.clientHeight*.08)) },
        pitch: 0,
        bearing: 0,
        minZoom: 0,
        maxZoom: 24,
        maxPitch: 85,
        attributionControl: true,
        renderWorldCopies: false,
        fadeDuration: 0,
        preserveDrawingBuffer: true,
        antialias: false
      });
      window.GeoGlyphBasemapCoverage?.install(map);
      // Style initialisation can replace MapLibre's transform. Apply the
      // guarded adapter to its replacement before subsequent render frames.
      map.on('styledata',()=>window.GeoGlyphBasemapCoverage?.install(map));
      if (mapState.restoredCamera) { map.setCenterClampedToGround(mapState.restoredCameraClamped??true); map.jumpTo(mapState.restoredCamera); }
      map.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new GeoGlyphCameraControl(), "top-right");
      map.addControl(new window.maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-right");
      const watchdog = window.setTimeout(() => {
        if (!mapState.mapReady) setStatus("Map canvas created; waiting for renderer", "warn");
      }, 4000);
      map.once('remove', () => window.clearTimeout(watchdog));
      // Cue readiness depends on the style, not every remote basemap tile.
      // Keep the established authoring startup boundary outside presentation.
      map.once(presentation ? "style.load" : "load", () => {
        window.clearTimeout(watchdog);
        if (generation !== mapInitialisationGeneration || mapState.map !== map) return;
        mapState.mapReady = true;
        if (mapState.restoredCamera) cancelInitialFit();
        else if (presentation && mapState.conferenceOverview) showConferenceOverview();
        else { frameAustralia(); cancelInitialFit(); }
        syncMetroMapKeyUi();
        syncBasemapButtons();
        if (!map.getSource(SOURCE_ID)) map.addSource(SOURCE_ID, { type: "geojson", data: mapState.lastGeoJSON || emptyFeatureCollection() });
        if (!map.getLayer(FILL_LAYER_ID)) map.addLayer({
          id: FILL_LAYER_ID,
          type: "fill",
          source: SOURCE_ID,
          paint: { "fill-color": mapState.fill, "fill-opacity": mapState.opacity, "fill-antialias": true }
        });
        if (!map.getLayer(LINE_LAYER_ID)) map.addLayer({
          id: LINE_LAYER_ID,
          type: "line",
          source: SOURCE_ID,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": mapState.outline, "line-width": mapState.outlineWidth, "line-opacity": mapState.opacity }
        });
        refreshFontStore();
        if (!mapState.anchorInitialised) placeAnchor(mapState.anchor, "initial");
        const record = selectedRecord();
        if (mapState.conferenceRenderSuspended) return;
        if (recordHasOutlineAccess(record)) {
          setStatus("Map ready · projecting selected outline font", "ok");
          window.setTimeout(() => queueRebuild(false), 0);
        } else {
          setStatus("Map ready · resolving Font Explorer selection", "ok");
          const choice=mapState.fontChoiceVersion;
          window.setTimeout(async () => {
            if(choice!==mapState.fontChoiceVersion)return;
            await primeHostFontOutline({ requestPermission:false });
            if (mapState.previewActive) queueRebuild(false);
          }, 0);
        }
        requestAnimationFrame(() => map.resize());
      });
      map.on("zoomend", rebuildAfterZoom);

      for (const event of ["dragstart", "zoomstart", "pitchstart", "rotatestart"]) {
        map.on(event, e => { if (e.originalEvent) { cancelInitialFit(); if(activeCameraFlight)notifyManualMapChange({preserveModel:true}); } });
      }
    map.on("click", event => {
        if (!mapState.mapReady) return;
        if(cameraPick){
          const picker=cameraPick,view=captureCameraView();
          view.center=[event.lngLat.wrap().lng,clamp(event.lngLat.lat,-85.051129,85.051129)];
          picker.cleanup();picker.onPick(view);return;
        }
        if(cameraAuthoring)return;
        notifyManualMapChange();
        cancelInitialFit();
        placeAnchor(event.lngLat, "click");
        if (mapState.previewActive) queueRebuild(false);
      });
      map.on("error", event => {
        const message = String(event?.error?.message || "");
        if (/tile|image|raster|network|fetch/i.test(message)) {
          if (!mapState.basemapErrorReported) {
            mapState.basemapErrorReported = true;
            setStatus(`Map ready · ${basemapLabel()} tile request was blocked`, "warn");
          }
          return;
        }
        console.warn("MapLibre", event?.error || event);
      });
      mapState.map = map;
    } catch (error) {
      console.error(error);
      setStatus(`Map initialisation failed: ${error.message}`, "warn");
    } finally {
      if (generation === mapInitialisationGeneration) mapState.mapInitialising = false;
    }
  }

  function emptyFeatureCollection() {
    return { type: "FeatureCollection", features: [] };
  }

  function rebuildAfterZoom() {
    if(window.GeoGlyphFontMorph?.isActive())return;
    if (!mapState.previewActive || !mapState.lastMetrics) return;
    // Committed 3D outlines use fixed model detail; only their camera changes.
    if (mapState.extrusionEnabled && mapState.lastRenderMode === 'vector' &&
        mapState.lastLocalModel && window.GeoGlyph3D?.isVisible()) return;
    queueRebuild(false);
  }

  function queueRebuild(fit = false) {
    window.GeoGlyphFontMorph?.onGeometryChange();
    if(window.GeoGlyphFontMorph?.isActive()){applyMapPaint();return;}
    if($('mapFont3DFilter')?.checked)renderFontChooser();
    if (mapState.conferenceRenderSuspended) return;
    if (mapState.conferenceApplying) { mapState.conferenceRebuildPending = true; return; }
    if(!window.GeoGlyphUi?.isRestoring?.())mapState.historyRestoreChoice=null;
    ++mapState.buildToken; mapState.pendingBuild = true; mapState.pendingFit ||= Boolean(fit);
    clearTimeout(queueRebuild.timer);
    queueRebuild.timer = setTimeout(() => { if (!mapState.rebuilding||mapState.extrusionEnabled) rebuildGeometry(); }, 0);
  }

  async function ensurePolygonClipping() { return window.polygonClipping || null; }

  function layoutFor(record) {
    return { tracking: mapState.tracking, lineHeight: mapState.lineHeight, quality: mapState.quality, symbol: Boolean(mapLegacySymbolFamily(record)), tolerance:mapState.extrusionEnabled?Math.max(.02,2/(mapState.quality+1)):groundTolerance(mapState.lastLocalModel?.bounds?.height||1000) };
  }
  function modelKey(record,text,options) {return JSON.stringify([window.GeoGlyphFontService.keyFor(record),text,options]);}
  async function prepareConferenceFont(fontId, patch) {
    if (!patch.extrusionEnabled) return;
    const record = mapState.fontRecords.get(fontId);
    const options = { ...layoutFor(record), tolerance:Math.max(.02,2/(mapState.quality+1)) };
    const model = await window.GeoGlyphFontService.model(record, patch.message, options);
    if (!model.polygons.length || !model.bounds.height || model.missing.length) throw Error('Unsupported outline font');
    model.renderKey = modelKey(record,patch.message,options);
    await window.GeoGlyph3D.prepare(model);
  }
  async function prepareFontModel(record,text,options=layoutFor(record)) {
    const key=modelKey(record,text,options),cached=mapState.extrusionEnabled&&window.GeoGlyph3D?.cached(key);
    if(cached)return cached.model;
    if(shouldPreferDecal(record,text))throw Error('This font or text requires browser rendering');
    let model=await window.GeoGlyphFontService.model(record,text,options);
    if(record.hasColor)throw Error('Colour font rendered through its exact browser mask');
    if(!mapState.extrusionEnabled&&groundTolerance(model.bounds.height)<model.tolerance*.9){options={...options,tolerance:groundTolerance(model.bounds.height)};model=await window.GeoGlyphFontService.model(record,text,options);}
    if(!model.polygons.length||!model.bounds.height)throw Error('No outline geometry available');
    if(model.missing.length)throw Error('Selected font lacks characters: '+model.missing.map(formatCode).join(', '));
    model.renderKey=modelKey(record,text,options);return model;
  }
  async function selectFont(id) {
    if(!mapState.fontRecords.has(id))return false;
    notifyManualMapChange();
    cancelRandomSearch();mapState.fontChoiceVersion++;mapState.selectedFontId=id;
    if($('mapFontSelect'))$('mapFontSelect').value=id;
    // Native face work is independent of the visible 3D model.
    activateSelectedFont();
    queueRebuild(false);return true;
  }
  let activeBuildToken=0;
  async function rebuildGeometry(fit = false, options = {}) {
    const endpoint = options.morphEndpoint;
    if (!endpoint) {
      window.GeoGlyphFontMorph?.onGeometryChange();
      if (window.GeoGlyphFontMorph?.isActive()) { applyMapPaint(); return {ok:true}; }
    }
    if (mapState.conferenceRenderSuspended) return;
    mapState.pendingFit ||= Boolean(fit);
    if (!mapState.previewActive || !mapState.mapReady) return;
    if (mapState.rebuilding&&!mapState.extrusionEnabled) { ++mapState.buildToken; mapState.pendingBuild = true; return; }
    mapState.rebuilding = true; mapState.pendingBuild = false;
    const buildToken = ++mapState.buildToken, shouldFit = mapState.pendingFit; mapState.pendingFit = false;
    activeBuildToken=buildToken;
    const choice=mapState.fontChoiceVersion;
    const current = () => buildToken === mapState.buildToken && choice === mapState.fontChoiceVersion && mapState.previewActive &&
      (endpoint || !window.GeoGlyphFontMorph?.isActive()) && (!options.isCurrent || options.isCurrent());
    try {
      const record = endpoint ? mapState.fontRecords.get(endpoint.fontId) : selectedRecord();
      if (!record) throw Error('Choose a font');
      if (!endpoint) window.GeoGlyphFontService.pin(record,'map');
      const text = endpoint?.message ?? previewTextForMode(record);
      if (!text || !text.trim()) throw Error('Enter visible content');
      setStatus('Preparing '+record.name+'…', 'info');
      window.GeoGlyph3D?.preparing(record.name);
      // The browser face and worker can share bytes without waiting for each other.
      window.GeoGlyphFontService.ensureFace(record,{isCurrent:current}).catch(()=>null);
      let model = null, vectorError = null;
      try {model=await prepareFontModel(record,text);}catch(error){vectorError=error;}
      if (!current()) return;
      const heightMeters = mapState.baseHeightMeters * mapState.relativeSize / 100;
      const selection={selectedFontId:record.id,mode:mapState.mode,message:text,tracking:mapState.tracking,lineHeight:mapState.lineHeight,quality:mapState.quality};
      if (model) {
        const coordinates = projectPolygons(model.polygons, model.bounds, heightMeters / model.bounds.height, mapState.bearing, mapState.anchor);
        const fc = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { mode: mapState.mode, renderer: 'vector', message: text, font: record.name, fill: mapState.fill, outline: mapState.outline, height_m: heightMeters, bearing: mapState.bearing }, geometry: { type: 'MultiPolygon', coordinates } }] };
        const apply=()=>{
          if (endpoint) {
            Object.assign(mapState, { selectedFontId: record.id, message: text, arcgisMessage: text, nativeColor: false, emojiFallbackFontId: null });
            window.GeoGlyphFontService.pin(record, 'map');
            syncUiFromState();
          }
          mapState.lastLocalModel = model; mapState.lastGeoJSON = fc; mapState.lastDecal = null; mapState.lastRenderMode = 'vector';
          mapState.displayedFontId=record.id;mapState.committedSelection=selection;
          mapState.lastMetrics = { glyphs: [...text].length, polygons: coordinates.length, vertices: model.vertices, heightMeters, font: record.name, renderer: 'Vector geometry' };
          clearGroundDecal(); mapState.map.getSource(SOURCE_ID)?.setData(fc); applyMapPaint();
        };
        if(mapState.extrusionEnabled&&window.GeoGlyph3D){
          const prepared=await window.GeoGlyph3D.prepare(model);
          if(!current()||!await window.GeoGlyph3D.commit(prepared,apply,current,endpoint?.release))return;
        } else {
          endpoint?.release();
          apply();
          await window.GeoGlyph3D?.update(current);
        }
      } else {
        if (endpoint) throw vectorError || Error('No outline geometry for the morph target');
        // A failed request never replaces an already displayed 3D model.
        if(mapState.extrusionEnabled&&window.GeoGlyph3D?.isVisible())throw vectorError||Error('No validated outlines to extrude');
        const face=await window.GeoGlyphFontService.ensureFace(record, { isCurrent: current }).catch(() => null);
        if (!current()) return;
        const emojiFallback=mapState.fontRecords.get(mapState.emojiFallbackFontId);
        if(emojiFallback&&window.GeoGlyphMessageText?.hasEmoji(text)){
          const flags=[...mapState.fontRecords.values()].find(font=>font.fontResourceKey==='conference:Emoji Flags');
          await Promise.all([emojiFallback,flags].filter(Boolean).map(font=>window.GeoGlyphFontService.ensureFace(font,{isCurrent:current})));
          if(!current())return;
        }
        const provider=record.geoGlyphRef||record;
        if((record.file||record.fileHandle||record.localDescriptor||record.arrayBuffer||provider.file||provider.metadata)&&!face?.face&&!record.exactFace)throw Error('Exact font could not be loaded: '+record.name);
        const decal = buildGroundDecal(record, text); if (!decal) throw vectorError || Error('Preview unavailable');
        mapState.lastLocalModel = null; mapState.lastGeoJSON = null; mapState.lastRenderMode = 'decal'; mapState.lastDecal = decal;
        mapState.displayedFontId=record.id;mapState.committedSelection=selection;
        mapState.map.getSource(SOURCE_ID)?.setData(emptyFeatureCollection()); setGroundDecal(decal);
        mapState.lastMetrics = { glyphs: [...text].length, polygons: 1, vertices: 4, heightMeters, font: record.name, renderer: decal.rendererLabel, fallbackReason: vectorError?.message || '' };
        await window.GeoGlyph3D?.update(current);
        if(mapState.extrusionEnabled)window.GeoGlyph3D?.failure(vectorError?.message||'No outline geometry');
      }
      if (!current()) return;
      updateGeometryStats(); setStatus(record.name + ' · ' + mapState.lastMetrics.renderer + (vectorError ? ' · ' + vectorError.message : ''), vectorError ? 'warn' : 'ok');
      if (!options.deferFit && !mapState.randomSearching) {
        if (mapState.explicitFitPending || (shouldFit && !mapState.conferenceOverview)) { mapState.explicitFitPending=false;cancelInitialFit(); fitGeometry(); }
        else await fitInitialGeometry(current);
      }
      const historyRestore=mapState.historyRestoreChoice===choice;
      if(historyRestore)mapState.historyRestoreChoice=null;
      document.dispatchEvent(new CustomEvent('geoglyph:ground-rendered', { detail: { renderMode: mapState.lastRenderMode, historyRestore, buildToken, cueId: options.cueId } }));
      scheduleRandomPreparation();
      return { ok: true, buildToken, selection };
    } catch (error) {
      if (!current()) return;
      if (options.preserveOnFailure) return { ok: false, error };
      if(mapState.historyRestoreChoice===choice)mapState.historyRestoreChoice=null;
      if(mapState.extrusionEnabled&&window.GeoGlyph3D?.isVisible()){
        window.GeoGlyph3D.failure(error.message);
        setStatus('Showing '+mapState.lastMetrics.font+' · '+(selectedRecord()?.name||'Selected font')+': '+error.message+' · Switch to 2D to preview it', 'warn');
      }else{
        mapState.lastGeoJSON = null; mapState.lastMetrics = null; mapState.lastDecal = null; mapState.lastLocalModel = null; mapState.lastRenderMode = 'none';
        window.GeoGlyph3D?.clear();
        mapState.map?.getSource(SOURCE_ID)?.setData(emptyFeatureCollection()); clearGroundDecal(); updateGeometryStats(); setStatus(error.message || 'Geometry unavailable', 'warn');
      }
      if(mapState.explicitFitPending&&!mapState.randomSearching){mapState.explicitFitPending=false;fitGeometry();}
    } finally {
      if(activeBuildToken===buildToken){
        mapState.rebuilding = false;
        window.GeoGlyph3D?.refreshExportControls?.();
        if (mapState.pendingBuild && mapState.previewActive) { clearTimeout(queueRebuild.timer); queueRebuild.timer = setTimeout(() => rebuildGeometry(), 0); }
      }
    }
  }

  let randomBag=[],randomSignature='',randomIdle=0,randomPreparing=false,randomRequest=0;
  let randomDescriptorSource=null;
  const resolvedRandomAliases=new Set();
  function hasFontBytes(record) {
    const ref=record?.geoGlyphRef||record;
    return Boolean(record&&(record.arrayBuffer||ref.arrayBuffer||record.file||ref.file||record.fileHandle?.getFile||record.localDescriptor?.blob||record.metadata?.blob||ref.metadata?.blob));
  }
  function resolveKnownRandomFonts() {
    // Manual selection already obtained these descriptors with the user's permission.
    // Resolve catalogue aliases from that metadata, without scanning or reading files.
    if(!mapState.localFontDescriptors?.length)return;
    if(randomDescriptorSource!==mapState.localFontDescriptors){randomDescriptorSource=mapState.localFontDescriptors;resolvedRandomAliases.clear();}
    let added=false;
    for(const record of [...mapState.fontRecords.values()]){
      if(hasFontBytes(record)||resolvedRandomAliases.has(record.id))continue;
      resolvedRandomAliases.add(record.id);
      const descriptor=bestLocalDescriptor(mapState.localFontDescriptors,record.geoGlyphRef||record);
      if(!descriptor)continue;
      const name=descriptor.fullName||descriptor.family||descriptor.postscriptName;
      const id=fontRecordId('system',name,descriptor.postscriptName||descriptor.style||'selected');
      if(mapState.fontRecords.has(id))continue;
      addFontRecord({id,source:'system',name,family:descriptor.family||name,cssFamily:descriptor.family||name,postscriptName:descriptor.postscriptName||'',style:descriptor.style||'',localDescriptor:descriptor});
      added=true;
    }
    if(added)renderFontChooser();
  }
  function cancelRandomSearch() {
    randomRequest++;mapState.randomSearching=false;
    $('mapQuickRandom')?.setAttribute('aria-busy','false');
    window.GeoGlyph3D?.refreshExportControls?.();
  }
  function randomCandidates() {
    resolveKnownRandomFonts();
    const unique=new Map();
    for(const record of mapState.fontRecords.values())if(hasFontBytes(record)&&!record.hasColor)unique.set(window.GeoGlyphFontService.keyFor(record),record.id);
    const ids=[...unique.values()],signature=ids.join('|');
    const shuffle=()=>{randomBag=ids.slice();for(let i=randomBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[randomBag[i],randomBag[j]]=[randomBag[j],randomBag[i]];}};
    if(signature!==randomSignature||!randomBag.length){randomSignature=signature;shuffle();}
    const shown=mapState.fontRecords.get(mapState.displayedFontId),selected=selectedRecord();
    const baseline=shown||selected;
    const excluded=new Set(baseline?[window.GeoGlyphFontService.keyFor(baseline)]:[]);
    const eligible=()=>randomBag.filter(id=>!excluded.has(window.GeoGlyphFontService.keyFor(mapState.fontRecords.get(id))));
    if(!eligible().length&&ids.some(id=>!excluded.has(window.GeoGlyphFontService.keyFor(mapState.fontRecords.get(id)))))shuffle();
    return eligible();
  }
  async function prepareRandomCandidate(id,current) {
    const record=mapState.fontRecords.get(id);if(!record||!current())return null;
    const text=previewTextForMode(record),model=await prepareFontModel(record,text);
    if(!current())return null;
    if(mapState.extrusionEnabled)await window.GeoGlyph3D.prepare(model);
    return current()?record:null;
  }
  async function randomFont() {
    notifyManualMapChange();
    refreshFontStore();
    if (!mapState.previewActive || !mapState.mapReady || mapState.conferenceRenderSuspended) return false;
    const operation=++randomRequest,choice=++mapState.fontChoiceVersion;
    const current=()=>operation===randomRequest&&choice===mapState.fontChoiceVersion&&mapState.previewActive;
    mapState.randomSearching=true;
    const button=$('mapQuickRandom');button?.setAttribute('aria-busy','true');
    setStatus('Preparing a random font…','info');window.GeoGlyph3D?.preparing('a random font');
    try{
      const candidates=randomCandidates();
      for(let index=0;index<candidates.length;index++){
        if(!current())return false;
        if(index&&index%8===0){
          const progress=`a compatible font · ${index}/${candidates.length} checked`;
          setStatus('Looking for '+progress+'…','info');window.GeoGlyph3D?.preparing(progress);
          await window.GeoGlyphFontService.yieldTask();if(!current())return false;
        }
        const id=candidates[index];randomBag=randomBag.filter(candidate=>candidate!==id);
        try{
          if(!await prepareRandomCandidate(id,current))return false;
        }catch(error){if(!current())return false;continue;}
        if(!current())return false;
        // Keep this operation current through the draw and Fit. selectFont()
        // cancels Random and only queues a rebuild, so it cannot be this boundary.
        await waitForCondition(()=>!current()||!mapState.rebuilding,'Previous render did not complete');
        if(!current())return false;
        const previous=mapState.selectedFontId;
        clearTimeout(queueRebuild.timer);
        mapState.pendingBuild=false;
        mapState.selectedFontId=id;
        if($('mapFontSelect'))$('mapFontSelect').value=id;
        activateSelectedFont();
        try{
          const rendered=await rebuildGeometry(false,{deferFit:true,preserveOnFailure:true,isCurrent:current});
          if(!rendered?.ok||!current())throw rendered?.error||Error('Random font render was superseded');
          await waitForGroundFrame(()=>current()&&mapState.displayedFontId===id);
          const explicit=mapState.explicitFitPending;
          mapState.explicitFitPending=false;
          // Manual Random must frame its block even while the survey remains in overview.
          await fitDrawnGeometry(current,{explicit,force:true});
          if(current()&&mapState.explicitFitPending){
            mapState.explicitFitPending=false;
            await fitDrawnGeometry(current,{explicit:true});
          }
          return true;
        }catch(error){
          if(current()&&mapState.displayedFontId!==id){
            mapState.selectedFontId=previous;
            if($('mapFontSelect'))$('mapFontSelect').value=previous;
          }
          throw error;
        }
      }
      if(current()){
        const text='No other compatible font is accessible. Current model kept. Use System or Font files to add more fonts.';
        setStatus(text,'warn');window.GeoGlyph3D?.notice(text);
        // Honour a separate manual Fit; failed Random has no automatic Fit.
        if(mapState.explicitFitPending){mapState.explicitFitPending=false;fitGeometry();}
      }
      return false;
    }catch(error){
      if(current()){
        setStatus(error.message||'The random font could not be fitted','warn');
        window.GeoGlyph3D?.notice(error.message||'The random font could not be fitted');
        if(mapState.explicitFitPending){mapState.explicitFitPending=false;fitGeometry();}
      }
      return false;
    }finally{if(operation===randomRequest){mapState.randomSearching=false;button?.setAttribute('aria-busy','false');window.GeoGlyph3D?.refreshExportControls?.();}}
  }
  function scheduleRandomPreparation() {
    if(presentation)return;
    if(randomIdle)window.cancelIdleCallback?cancelIdleCallback(randomIdle):clearTimeout(randomIdle);
    if(!mapState.extrusionEnabled||!mapState.previewActive||randomPreparing)return;
    const choice=mapState.fontChoiceVersion;
    const work=async()=>{
      randomIdle=0;if(choice!==mapState.fontChoiceVersion||!mapState.previewActive||randomPreparing)return;
      const id=randomCandidates()[0];if(!id)return;
      randomPreparing=true;
      try{await prepareRandomCandidate(id,()=>choice===mapState.fontChoiceVersion&&mapState.previewActive);}catch(_){}finally{randomPreparing=false;}
    };
    randomIdle=window.requestIdleCallback?requestIdleCallback(work,{timeout:2000}):setTimeout(work,500);
  }

  function previewTextForMode() {
    return String(mapState.message || "");
  }

  function renderWaitClock() {
    let last = performance.now(), visible = !document.hidden, elapsed = 0;
    const update = () => {
      const now = performance.now();
      if (visible) elapsed += Math.max(0, now - last);
      last = now; visible = !document.hidden;
      return elapsed;
    };
    document.addEventListener('visibilitychange', update);
    return { elapsed:update, dispose:() => document.removeEventListener('visibilitychange', update) };
  }

  function waitForCondition(check, message, timeout = 30000) {
    return new Promise((resolve, reject) => {
      const clock = renderWaitClock();
      let timer, settled = false;
      const finish = error => {
        if (settled) return;
        settled = true; clearTimeout(timer); clock.dispose();
        document.removeEventListener('visibilitychange', poll);
        error ? reject(error) : resolve();
      };
      const poll = () => {
        if (settled) return;
        clearTimeout(timer);
        try {
          if (check()) return finish();
          if (clock.elapsed() > timeout) return finish(Error(message));
          timer = setTimeout(poll, document.hidden ? 250 : 16);
        } catch (error) { finish(error); }
      };
      document.addEventListener('visibilitychange', poll);
      poll();
    });
  }

  async function waitForCamera(current = () => true, timeout = 30000) {
    await waitForCondition(() => !current() || (!mapState.map?.isMoving() && window.GeoGlyph3D?.stats().animation.phase !== 'framing'), 'Camera movement did not complete', timeout);
    if (!current()) throw Error('Artwork was superseded during Fit');
  }

  function waitForGroundFrame(current) {
    const map = mapState.map;
    return new Promise((resolve, reject) => {
      const clock = renderWaitClock();
      let timer, settled = false;
      const finish = error => {
        if (settled) return;
        settled = true; clearTimeout(timer); clock.dispose(); map.off('render', rendered);
        document.removeEventListener('visibilitychange', visibility);
        error ? reject(error) : resolve();
      };
      const rendered = () => {
        if (settled) return;
        if (!current()) return finish(Error('Artwork was superseded'));
        if (document.hidden) return;
        const source = mapState.lastRenderMode === 'decal' ? DECAL_SOURCE_ID : SOURCE_ID;
        if (!map.getSource(source) || map.isSourceLoaded(source)) finish();
        else map.triggerRepaint();
      };
      const deadline = () => {
        if (settled) return;
        clearTimeout(timer);
        if (!current()) return finish(Error('Artwork was superseded'));
        const remaining = 15000 - clock.elapsed();
        if (remaining <= 0) return finish(Error('The artwork did not reach the map frame'));
        timer = setTimeout(deadline, document.hidden ? 250 : Math.min(remaining, 250));
      };
      const visibility = () => { deadline(); if (!settled && !document.hidden) map.triggerRepaint(); };
      document.addEventListener('visibilitychange', visibility);
      map.on('render', rendered); deadline();
      if (!document.hidden) map.triggerRepaint();
    });
  }

  // Call only after the new artwork has reached its own map frame. Automatic
  // Fits preserve animation; an explicit Fit retains the manual stop policy.
  async function fitDrawnGeometry(current, { explicit = false, orbit = false, introduction = false, force = false, instant = false, maxZoom, cameraBearing } = {}) {
    if (!current()) throw Error('Artwork was superseded before Fit');
    if (mapState.conferenceOverview && !explicit && !introduction && !force) return false;
    const first = mapState.initialFitStatus === 'pending';
    const preserveOrbit = !explicit && mapState.extrusionEnabled && Boolean(window.GeoGlyph3D?.stats().animation.orbiting);
    if (!preserveOrbit) window.GeoGlyph3D?.stopOrbit();
    const motion = introduction ? { duration:CONFERENCE_INTRO_DURATION_MS, fly:true } : instant ? { duration:0 } : {};
    if (!fitGeometry({ orbit:orbit || preserveOrbit, preserveOrbit, maxZoom, cameraBearing, ...motion })) throw Error('The artwork could not be fitted');
    await waitForCamera(current, introduction ? CONFERENCE_INTRO_DURATION_MS + 10000 : undefined);
    if (first) { mapState.initialFitStatus='done'; mapState.firstFitDone=true; mapState.initialFitCount++; }
    return true;
  }

  let conferenceApplyOwner = null;
  async function applyConferenceCue(patch, options = {}) {
    await waitForCondition(() => !mapState.rebuilding || options.isCurrent?.() === false, 'Previous render did not complete');
    if (options.isCurrent?.() === false) throw Error('Cue was superseded');
    if (!mapState.previewActive) throw Error('Map is not active');
    const keys = ['mode','message','arcgisMessage','selectedFontId','nativeColor','emojiFallbackFontId','extrusionEnabled','mirrorX','orientationMode','fill','outline','outlineWidth','opacity','bearing','tracking','lineHeight','quality','relativeSize','extrusionTilt','extrusionSolid','anchor','anchorInitialised','anchorPinned','baseHeightMeters','extrusionDepthMeters','lastLocalModel','lastGeoJSON','lastDecal','lastRenderMode','lastMetrics','displayedFontId','committedSelection'];
    const previous = Object.fromEntries(keys.map(key => [key, mapState[key]]));
    const anchorChanged = Boolean(patch.anchor && (patch.anchor.lng !== previous.anchor?.lng || patch.anchor.lat !== previous.anchor?.lat));
    const previousHeight = previous.baseHeightMeters * previous.relativeSize / 100;
    const nextHeight = (patch.height ?? previous.baseHeightMeters) * (patch.relativeSize ?? previous.relativeSize) / 100;
    const zoomOutBeforeBuild = nextHeight >= previousHeight * 10 && patch.extrusionEnabled &&
      window.GeoGlyph3D?.stats().animation.orbiting;
    cancelRandomSearch();
    const choice = ++mapState.fontChoiceVersion;
    const current = () => mapState.fontChoiceVersion === choice && mapState.previewActive && (!options.isCurrent || options.isCurrent());
    const owner = {};
    // A manual edit during preparation should edit the artwork actually on
    // screen, rather than inheriting a pending script step's uncommitted state.
    owner.cancelPending = () => {
      if (mapState.committedSelection === previous.committedSelection) {
        Object.assign(mapState, previous);
        syncUiFromState(); window.GeoGlyph3D?.refreshControls();
      }
    };
    conferenceApplyOwner = owner;
    mapState.conferenceApplying = true;
    clearTimeout(queueRebuild.timer);
    try {
      if (!mapState.fontRecords.has(patch.fontId)) throw Error('Presentation font is unavailable');
      if (!patch.extrusionEnabled || (patch.fit && !options.preserveOrbit)) window.GeoGlyph3D?.stopOrbit();
      if (options.opening) Object.assign(mapState, { orientationMode:'fixed', relativeSize:100, bearing:0,
        tracking:0, lineHeight:1.15, quality:10, fill:'#31A765', outline:'#FFFFFF', outlineWidth:2,
        opacity:.82, extrusionTilt:90, extrusionSolid:true });
      Object.assign(mapState, { mode:options.mode||'arcgis', message:patch.message, arcgisMessage:patch.message, nativeColor:patch.nativeColor,
        emojiFallbackFontId:patch.emojiFallbackFontId||null,selectedFontId:patch.fontId, extrusionEnabled:patch.extrusionEnabled });
      if (patch.mirrorX !== undefined) mapState.mirrorX = patch.mirrorX === true;
      else if (patch.hasNewContent || options.opening) mapState.mirrorX = false;
      if (patch.relativeSize !== undefined) mapState.relativeSize = patch.relativeSize;
      if (patch.animation) mapState.orientationMode = patch.animation;
      if (patch.fill) mapState.fill = patch.fill;
      if (patch.outline) mapState.outline = patch.outline;
      if (patch.tilt !== undefined) mapState.extrusionTilt = patch.tilt;
      if (patch.bearing !== undefined) mapState.bearing = patch.bearing;
      if (patch.height !== undefined) mapState.baseHeightMeters = patch.height;
      if (patch.depth !== undefined) mapState.extrusionDepthMeters = patch.depth;
      if (patch.anchor) {
        mapState.anchor = { ...patch.anchor };
        mapState.anchorInitialised = true;
        mapState.anchorPinned = patch.anchorPinned === true;
        updateAnchorStats();
        // Start the camera move before an orbit frame can jump to the new anchor.
        if (anchorChanged && !zoomOutBeforeBuild && options.preserveOrbit && window.GeoGlyph3D?.stats().animation.orbiting) {
          window.GeoGlyph3D.fitCurrent({preserveOrbit:true});
        }
      }
      // Frame the larger model before publishing its map geometry at the old zoom.
      if (zoomOutBeforeBuild) window.GeoGlyph3D.fitCurrent({preserveOrbit:true,duration:0});
      mapState.conferenceRenderSuspended = false;
      mapState.pendingBuild = false; mapState.pendingFit = false; mapState.explicitFitPending = false;
      syncUiFromState(); window.GeoGlyph3D?.refreshControls();
      // A controls-only opening cue can set placement/size while waiting for content.
      if (!patch.message) return { fitted:false, empty:true };
      const rendered = await rebuildGeometry(false, { cueId:patch.objectId, deferFit:true, preserveOnFailure:true, isCurrent:current });
      if (!rendered?.ok || !current()) throw rendered?.error || Error('Cue render was superseded');
      if (patch.extrusionEnabled && !window.GeoGlyph3D?.isVisible()) throw Error('This content cannot be extruded');
      await waitForGroundFrame(current);
      options.onDrawn?.();
      const first = mapState.initialFitStatus === 'pending';
      const fitting = !options.suppressFit && !mapState.conferenceOverview && Boolean(patch.fit || patch.hasNewContent || patch.random || anchorChanged || first);
      if (fitting) {
        await fitDrawnGeometry(current,{explicit:Boolean(patch.fit)&&!options.preserveOrbit,orbit:Boolean(patch.animation),instant:options.instantFit,maxZoom:options.maxZoom,cameraBearing:options.cameraBearing});
        options.onFit?.();
      }
      return { fitted:fitting };
    } catch (error) {
      if (current()) {
        Object.assign(mapState, previous);
        mapState.map?.getSource(SOURCE_ID)?.setData(previous.lastGeoJSON || emptyFeatureCollection());
        if (previous.lastDecal) setGroundDecal(previous.lastDecal); else clearGroundDecal();
        syncUiFromState(); await window.GeoGlyph3D?.update().catch(() => {});
      }
      throw error;
    } finally {
      // A manual selection invalidates the result, but this transaction must
      // still release its lock. Older cleanup must never release a newer owner.
      if (conferenceApplyOwner === owner) {
        conferenceApplyOwner = null;
        mapState.conferenceApplying = false;
        if (mapState.conferenceRebuildPending) { mapState.conferenceRebuildPending=false; queueRebuild(false); }
      }
    }
  }

  function cancelConferenceWork({preserveMotion=false}={}) {
    cancelCameraFlight();
    cancelRandomSearch();
    conferenceApplyOwner?.cancelPending?.();
    conferenceApplyOwner = null;
    ++mapState.fontChoiceVersion;
    // Cancelled async work must not own a later draw or its cleanup.
    activeBuildToken = ++mapState.buildToken;
    mapState.rebuilding = false;
    mapState.conferenceApplying = false;
    mapState.conferenceRebuildPending = false;
    mapState.pendingBuild = mapState.pendingFit = mapState.explicitFitPending = false;
    clearTimeout(queueRebuild.timer);
    if(!preserveMotion)window.GeoGlyph3D?.stopOrbit();
    mapState.map?.stop();
  }

  function frameAustralia({animate=false}={}) {
    const map = mapState.map;
    if (!map) return false;
    window.GeoGlyph3D?.stopOrbit();
    map.stop();
    map.setCenterClampedToGround(true);
    const canvas = map.getCanvas();
    const panel = $('geoglyphMapEditor');
    const panelWidth = panel && !panel.hidden ? Math.max(0, panel.getBoundingClientRect().right - canvas.getBoundingClientRect().left) : 0;
    const inset=Math.max(8,Math.min(48,canvas.clientWidth*.08,canvas.clientHeight*.08));
    const padding = { top:inset, bottom:inset, right:inset, left:Math.max(inset, Math.min(panelWidth+24, canvas.clientWidth*.4)) };
    const camera = map.cameraForBounds(AUSTRALIA_BOUNDS, { padding, bearing:0, pitch:0 });
    if (!camera) return false;
    map.setPadding({top:0,bottom:0,left:0,right:0});
    map[animate?'easeTo':'jumpTo']({ ...camera, bearing:0, pitch:0, elevation:0,
      ...(animate?{duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:450,essential:true}:{}) });
    return true;
  }

  function showConferenceOverview() {
    mapState.conferenceOverview = true;
    return frameAustralia();
  }

  function showHomeView() {
    if(!mapState.previewActive||!mapState.mapReady)return false;
    notifyManualMapChange({preserveModel:true});
    cancelCameraFlight();cancelInitialFit();
    window.GeoGlyph3D?.stopOrbit({freezePose:true});
    return frameAustralia({animate:true});
  }

  let cameraAuthoring=false,cameraPick=null,activeCameraFlight=null;
  function setCameraAuthoring(active) {
    cameraAuthoring=Boolean(active);
    if(active){cancelInitialFit();window.GeoGlyph3D?.stopOrbit({freezePose:true});}
    else cancelCameraPick();
  }
  function captureCameraView() {
    const map=mapState.map;if(!map)throw Error('Open the map before choosing a camera view');
    const center=map.getCenter().wrap();
    return {center:[center.lng,clamp(center.lat,-85.051129,85.051129)],zoom:map.getZoom(),pitch:map.getPitch(),bearing:map.getBearing()};
  }
  function restoreCameraView(value) {
    const map=mapState.map;if(!map)return false;
    const view=window.GeoGlyphCameraFlight.validateView(value);
    cancelCameraFlight();map.stop();map.setCenterClampedToGround(true);
    map.setPadding({top:0,bottom:0,left:0,right:0});
    map.jumpTo({...view,elevation:0});return true;
  }
  function cancelCameraPick() {
    if(!cameraPick)return;
    const picker=cameraPick;picker.cleanup();picker.onCancel?.();
  }
  function pickCameraView({onPick,onCancel}={}) {
    if(!mapState.previewActive||!mapState.mapReady)throw Error('Wait for the map before choosing a camera view');
    cancelCameraPick();cancelInitialFit();window.GeoGlyph3D?.stopOrbit({freezePose:true});
    const map=mapState.map,canvas=map.getCanvas(),previous=canvas.style.cursor;
    const picker={onPick,onCancel,cleanup:()=>{
      if(cameraPick!==picker)return;
      cameraPick=null;canvas.style.cursor=previous;document.removeEventListener('keydown',escape);
    }};
    const escape=event=>{if(event.key==='Escape'){event.preventDefault();cancelCameraPick();}};
    cameraPick=picker;canvas.style.cursor='crosshair';document.addEventListener('keydown',escape);
    return picker.cleanup;
  }
  function cancelCameraFlight() { activeCameraFlight?.cancel(); }
  function playCameraFlight(value,{signal,isCurrent=()=>true}={}) {
    const action=window.GeoGlyphCameraFlight.validateFlight(value),map=mapState.map;
    const aborted=()=>new DOMException('Camera flight cancelled','AbortError');
    if(!mapState.previewActive||!mapState.mapReady)return Promise.reject(Error('Open the map before playing a camera flight'));
    if(signal?.aborted||!isCurrent())return Promise.reject(aborted());
    cancelCameraFlight();cancelInitialFit();window.GeoGlyph3D?.stopOrbit({freezePose:true});
    mapState.conferenceOverview=false;
    map.stop();map.setCenterClampedToGround(true);map.setPadding({top:0,bottom:0,left:0,right:0});
    map.jumpTo({...action.start,elevation:0});
    return new Promise((resolve,reject)=>{
      let settled=false,timer;
      const clock=renderWaitClock();
      const finish=(error,result=true,stop=false)=>{
        if(settled)return;settled=true;clearTimeout(timer);clock.dispose();
        map.off('moveend',ended);map.off('remove',removed);signal?.removeEventListener('abort',abort);
        if(activeCameraFlight===job)activeCameraFlight=null;
        if(stop)map.stop();error?reject(error):resolve(result);
      };
      const abort=()=>finish(aborted(),false,true);
      const ended=()=>signal?.aborted||!isCurrent()?abort():finish(null,true);
      const removed=()=>finish(aborted(),false);
      const job={cancel:()=>finish(null,false,true)};
      const poll=()=>{
        if(settled)return;
        if(signal?.aborted||!isCurrent()||!mapState.previewActive)return abort();
        if(clock.elapsed()>action.duration*1000+15000)return finish(Error('Camera flight did not complete'),false,true);
        timer=setTimeout(poll,50);
      };
      activeCameraFlight=job;map.on('moveend',ended);map.on('remove',removed);signal?.addEventListener('abort',abort,{once:true});
      if(signal?.aborted||!isCurrent())return abort();
      try{
        map.flyTo({...action.end,elevation:0,duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:action.duration*1000,essential:true});
        if(!settled&&!map.isMoving())ended();
        if(!settled)poll();
      }catch(error){finish(error,false,true);}
    });
  }

  function drawConferenceOpening(fontId, options = {}) {
    return applyConferenceCue({ fontId, objectId:options.objectId, message:'😴', nativeColor:true,
      extrusionEnabled:false, height:300, depth:30, ...(options.resetAnchor ? { anchor:{...DEFAULT_ANCHOR} } : {})
    }, { ...options, opening:true, suppressFit:true });
  }

  function shouldPreferDecal(record, text) { return Boolean(record?.hasColor)|| /[\u0590-\u0FFF\u1780-\u17FF\u200D\uFE0F]/u.test(text)||Boolean(mapState.emojiFallbackFontId&&window.GeoGlyphMessageText?.hasEmoji(text)); }

  function groundPixelsPerMeter() {
    const map=mapState.map;if(!map?.project)return 0;
    const origin=window.maplibregl.MercatorCoordinate.fromLngLat(mapState.anchor),u=origin.meterInMercatorCoordinateUnits();
    const a=map.project(mapState.anchor),east=map.project(new window.maplibregl.MercatorCoordinate(origin.x+u,origin.y).toLngLat()),north=map.project(new window.maplibregl.MercatorCoordinate(origin.x,origin.y-u).toLngLat());
    return Math.max(Math.hypot(east.x-a.x,east.y-a.y),Math.hypot(north.x-a.x,north.y-a.y));
  }

  function groundTolerance(designHeight) {
    const pixels=groundPixelsPerMeter()*mapState.baseHeightMeters*mapState.relativeSize/100;
    const target=Math.min(.5,1/(window.devicePixelRatio||1));
    const value=Math.min(8/(mapState.quality+1),pixels>0?target*Math.max(1,designHeight)/pixels:1);
    return Math.max(.002,Math.pow(2,Math.floor(Math.log2(Math.max(.002,value)))));
  }

  function groundDecalFootprint(rendered) {
    const targetHeight = mapState.baseHeightMeters * mapState.relativeSize / 100;
    const canvasHeight = targetHeight * rendered.canvas.height / rendered.inkHeight;
    const widthMeters = canvasHeight * rendered.canvas.width / rendered.canvas.height;
    return { coordinates: projectGroundQuad(widthMeters, canvasHeight, mapState.bearing, mapState.anchor), widthMeters, heightMeters:targetHeight };
  }

  function buildGroundDecal(record, text) {
    const options = { nativeColor:shouldPreserveNativeColor(record, text) };
    if (mapState.conferenceOverview) {
      // The continent view is not the sampling scale for the coming close-up.
      // Measure the footprint first, then prepare resolution and pixel-based
      // outlines for the same camera target that Fit will use. Keep this scale
      // through any rebuild during the introduction, including camera updates.
      const measured = rasteriseGroundDecal(record, text, { measureOnly:true });
      if (!measured) return null;
      const footprint = groundDecalFootprint(measured);
      const target = groundFramingTarget(footprint.coordinates);
      if (target) {
        const units = window.maplibregl.MercatorCoordinate.fromLngLat(mapState.anchor).meterInMercatorCoordinateUnits();
        options.screenHeight = footprint.heightMeters * units * 512 * 2 ** target.zoom;
      }
    }
    const rendered = rasteriseGroundDecal(record, text, options);
    if (!rendered) return null;
    return { canvas:rendered.canvas, ...groundDecalFootprint(rendered), widthPx:rendered.canvas.width,
      heightPx:rendered.canvas.height, samplingHeightPx:rendered.samplingHeightPx,
      rendererLabel:(mapState.nativeColor ? 'Native colour decal' : 'Styled ground decal')+(rendered.resolutionLimited?' · texture resolution limit':'') };
  }

  function shouldPreserveNativeColor() { return Boolean(mapState.nativeColor); }

  function rasteriseGroundDecal(record, text, options = {}) {
    const cache=rasteriseGroundDecal.cache ||= new Map();
    const fallback=window.GeoGlyphMessageText?.hasEmoji(text)&&mapState.fontRecords.get(mapState.emojiFallbackFontId);
    const flags=fallback&&[...mapState.fontRecords.values()].find(font=>font.fontResourceKey==='conference:Emoji Flags');
    const lines=String(text).replace(/\r\n?/g,'\n').split('\n');
    const cssHeight=options.screenHeight ?? groundPixelsPerMeter()*mapState.baseHeightMeters*mapState.relativeSize/100;
    const base=420;
    const desired=cssHeight*(window.devicePixelRatio||1)*Math.min(2,Math.max(1,mapState.quality/12));
    const multiplier=Math.max(1,Math.min(4,Math.pow(2,Math.ceil(Math.log2(Math.max(1,desired/(base*lines.length)))))));
    const fontPx=base*multiplier;
    const key=JSON.stringify([record.fontResourceKey||record.id||record.name,record.cssFamily,record.style,text,mapState.mode,mapState.tracking,mapState.lineHeight,fontPx,
      fallback?[fallback.fontResourceKey||fallback.id,fallback.cssFamily,fallback.style,flags?.fontResourceKey,flags?.cssFamily]:null,Boolean(options.nativeColor)]);
    let saved=cache.get(key);
    if(!saved) {
      const probe=document.createElement('canvas'),pctx=probe.getContext('2d');if(!pctx)return null;
      const style=record.style||'',font=(record.exactFace?'':(/italic|oblique/i.test(style)?'italic ':''))+fontPx+'px '+cssFontFamily(record);
      pctx.font=font.replace(fontPx+'px','1000px');pctx.textBaseline='alphabetic';
      const tracking=fontPx*mapState.tracking/100;
      if('letterSpacing' in pctx)pctx.letterSpacing=(tracking*1000/fontPx)+'px';
      const emojiFamily=fallback?(flags?cssFontFamily(flags)+',':'')+cssFontFamily(fallback):'';
      const layouts=fallback?lines.map(line=>window.GeoGlyphMessageText.measureLine(pctx,line,font.replace(fontPx+'px','1000px'),'1000px '+emojiFamily)):null;
      const metrics=lines.map((line,index)=>{const m=layouts?layouts[index]:pctx.measureText(line||' '),ratio=fontPx/1000;return Object.fromEntries(['width','actualBoundingBoxLeft','actualBoundingBoxRight','actualBoundingBoxAscent','actualBoundingBoxDescent'].map(key=>[key,m[key]*ratio]));});
      const ascent=Math.max(1,...metrics.map(m=>m.actualBoundingBoxAscent||fontPx*.8));
      const descent=Math.max(0,...metrics.map(m=>m.actualBoundingBoxDescent||0));
      const advance=fontPx*mapState.lineHeight;
      const inkHeight=Math.max(1,ascent+descent+(lines.length-1)*advance);
      const maxWidth=Math.max(fontPx*.2,...metrics.map(m=>Math.max(m.width,(m.actualBoundingBoxLeft||0)+(m.actualBoundingBoxRight||0))));
      const pad=Math.ceil(Math.max(48,fontPx*.12));
      const rawWidth=maxWidth+pad*2,rawHeight=inkHeight+pad*2;
      const scale=Math.min(1,4096/Math.max(rawWidth,rawHeight),Math.sqrt((layouts?2:4)*1024*1024/(rawWidth*rawHeight)));
      const mask=document.createElement('canvas');mask.width=Math.max(1,Math.floor(rawWidth*scale));mask.height=Math.max(1,Math.floor(rawHeight*scale));
      const ctx=mask.getContext('2d');ctx.scale(scale,scale);ctx.font=font;ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.fillStyle='#000000';
      if('letterSpacing' in ctx)ctx.letterSpacing=tracking+'px';
      let textMask,emojiMask,textContext,emojiContext;
      if(layouts){
        const layer=()=>{const canvas=document.createElement('canvas');canvas.width=mask.width;canvas.height=mask.height;const context=canvas.getContext('2d');context.scale(scale,scale);context.textBaseline='alphabetic';context.fillStyle='#000';if('letterSpacing' in context)context.letterSpacing=tracking+'px';return {canvas,context};};
        ({canvas:textMask,context:textContext}=layer());({canvas:emojiMask,context:emojiContext}=layer());
      }
      let y=mask.height/(2*scale)-inkHeight/2+ascent;
      lines.forEach((line,i)=>{
        const m=metrics[i],offset=((m.actualBoundingBoxLeft||0)-(m.actualBoundingBoxRight||m.width))/2,x=mask.width/(2*scale)+offset;
        if(layouts)for(const part of layouts[i].parts){const target=part.emoji?emojiContext:textContext;target.font=part.font.replace('1000px',fontPx+'px');target.fillText(part.text,x+part.x*fontPx/1000,y);}
        else ctx.fillText(line||' ',x,y);
        y+=advance;
      });
      if(layouts){ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(textMask,0,0);ctx.drawImage(emojiMask,0,0);}
      saved={mask,textMask,emojiMask,inkHeight:inkHeight*scale};cache.set(key,saved);
    }
    cache.delete(key);cache.set(key,saved);
    const result=options.measureOnly ? { canvas:saved.mask, inkHeight:saved.inkHeight } : colourGroundMask(saved,options,cssHeight);
    const size=item=>item.mask.width*item.mask.height*4*(1+Boolean(item.textMask)+Boolean(item.emojiMask)+Boolean(item.outlineMask));
    let bytes=[...cache.values()].reduce((sum,item)=>sum+size(item),0);
    while((cache.size>8||bytes>32*1024*1024)&&cache.size>1){const [old,item]=cache.entries().next().value;cache.delete(old);bytes-=size(item);}
    result.resolutionLimited=cssHeight>0&&saved.inkHeight<cssHeight*(window.devicePixelRatio||1)*.9;
    result.samplingHeightPx=cssHeight;
    return result;
  }

  function colourGroundMask(saved,options,cssHeight) {
    const {mask,inkHeight}=saved;
    const canvas=document.createElement('canvas');canvas.width=mask.width;canvas.height=mask.height;
    const out=canvas.getContext('2d');
    const ratio=cssHeight>0?inkHeight/cssHeight:1;
    const radius=Math.max(0,Math.round(mapState.outlineWidth*ratio*2)/4);
    if(radius>0) {
      if(!saved.outlineMask||saved.outlineRadius!==radius) {
        // This result is still private, so its canvas can be the temporary
        // inner mask before the final paint. Cached masks and prior results
        // remain immutable; no extra retained canvas budget is introduced.
        const outer=document.createElement('canvas');
        outer.width=mask.width;outer.height=mask.height;
        const oc=outer.getContext('2d'),ic=out;oc.drawImage(mask,0,0);ic.drawImage(mask,0,0);ic.globalCompositeOperation='destination-in';
        const steps=Math.max(8,Math.min(64,Math.ceil(radius*Math.PI*2)));
        for(let i=0;i<steps;i++){const angle=i*Math.PI*2/steps,x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;oc.drawImage(mask,x,y);ic.drawImage(mask,x,y);}
        oc.globalCompositeOperation='destination-out';oc.drawImage(canvas,0,0);
        saved.outlineMask=outer;saved.outlineRadius=radius;
        out.clearRect(0,0,canvas.width,canvas.height);out.globalCompositeOperation='source-over';
      }
    }
    const mixed=options.nativeColor&&saved.emojiMask;
    out.drawImage(mixed?saved.textMask:mask,0,0);
    if(mixed||!options.nativeColor){out.globalCompositeOperation='source-in';out.fillStyle=mapState.fill;out.fillRect(0,0,canvas.width,canvas.height);out.globalCompositeOperation='source-over';}
    if(mixed)out.drawImage(saved.emojiMask,0,0);
    if(radius>0) {
      const tint=document.createElement('canvas');tint.width=canvas.width;tint.height=canvas.height;
      const tc=tint.getContext('2d');tc.drawImage(saved.outlineMask,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle=mapState.outline;tc.fillRect(0,0,tint.width,tint.height);out.drawImage(tint,0,0);
    }
    return {canvas,inkHeight};
  }

  function cssFontFamily(record) {
    const family = record?.cssFamily || record?.family || record?.name || "sans-serif";
    if (/^['"].*['"]$/.test(family) || /,/.test(family)) return family;
    return `"${String(family).replace(/"/g, '\\"')}"`;
  }

  function projectGroundQuad(widthMeters, heightMeters, bearingDegrees, anchor) {
    const maplibregl = window.maplibregl;
    const origin = maplibregl.MercatorCoordinate.fromLngLat([anchor.lng, anchor.lat], 0);
    const unitsPerMeter = origin.meterInMercatorCoordinateUnits();
    const radians = bearingDegrees * Math.PI / 180;
    const cos = Math.cos(radians), sin = Math.sin(radians);
    const halfW = widthMeters / 2, halfH = heightMeters / 2;
    const corners = [
      [-halfW,  halfH],
      [ halfW,  halfH],
      [ halfW, -halfH],
      [-halfW, -halfH]
    ];
    return corners.map(([east0, north0]) => {
      const east = east0 * cos + north0 * sin;
      const north = -east0 * sin + north0 * cos;
      const merc = new maplibregl.MercatorCoordinate(
        origin.x + east * unitsPerMeter,
        origin.y - north * unitsPerMeter,
        0
      );
      const lngLat = merc.toLngLat();
      return [lngLat.lng, lngLat.lat];
    });
  }

  function setGroundDecal(decal) {
    const map = mapState.map;
    if (!map || !decal?.canvas) return;
    const target = $("geoglyphGroundDecalCanvas");
    if (!target) throw new Error("Ground decal canvas is unavailable");
    target.width = decal.canvas.width;
    target.height = decal.canvas.height;
    const ctx = target.getContext("2d");
    ctx.clearRect(0, 0, target.width, target.height);
    if (mapState.mirrorX) { ctx.translate(target.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(decal.canvas, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const existing = map.getSource(DECAL_SOURCE_ID);
    if (existing) { existing.setCoordinates(decal.coordinates); existing.play?.(); existing.pause?.(); applyMapPaint(); map.triggerRepaint(); return; }
    map.addSource(DECAL_SOURCE_ID, {
      type: "canvas",
      canvas: "geoglyphGroundDecalCanvas",
      coordinates: decal.coordinates,
      animate: false
    });
    map.addLayer({
      id: DECAL_LAYER_ID,
      type: "raster",
      source: DECAL_SOURCE_ID,
      paint: { "raster-opacity": mapState.opacity, "raster-fade-duration": 0 }
    });
    map.triggerRepaint();
  }

  function clearGroundDecal() {
    const map = mapState.map;
    if (!map) return;
    if (map.getLayer(DECAL_LAYER_ID)) map.removeLayer(DECAL_LAYER_ID);
    if (map.getSource(DECAL_SOURCE_ID)) map.removeSource(DECAL_SOURCE_ID);
  }

  function updateFeatureStyleProperties() {
    const feature = mapState.lastGeoJSON?.features?.[0];
    if (!feature) return;
    feature.properties = {
      ...feature.properties,
      fill: mapState.fill,
      outline: mapState.outline,
      opacity: mapState.opacity,
      outline_width: mapState.outlineWidth
    };
  }

  function applyMapPaint() {
    const map = mapState.map;
    if (!mapState.mapReady || !map) return;
    if (map.getLayer(FILL_LAYER_ID)) {
      map.setPaintProperty(FILL_LAYER_ID, "fill-color", mapState.fill);
      map.setPaintProperty(FILL_LAYER_ID, "fill-opacity", mapState.opacity);
    }
    if (map.getLayer(LINE_LAYER_ID)) {
      map.setPaintProperty(LINE_LAYER_ID, "line-color", mapState.outline);
      map.setPaintProperty(LINE_LAYER_ID, "line-width", mapState.outlineWidth);
      map.setPaintProperty(LINE_LAYER_ID, "line-opacity", mapState.outlineWidth > 0 ? mapState.opacity : 0);
    }
    if (map.getLayer(DECAL_LAYER_ID)) {
      map.setPaintProperty(DECAL_LAYER_ID, "raster-opacity", mapState.opacity);
    }
    window.GeoGlyph3D?.syncVisibility();
    document.dispatchEvent(new CustomEvent('geoglyph:ground-style'));
  }

  function buildTextGeometry(font, text, options) { return window.GeoGlyphGeometry.model(font, text, options); }
  function flattenPath(commands, quality = 14) { return window.GeoGlyphGeometry.flatten(commands, 8 / (quality + 1)); }
  function classifyFontContours(rings) { return window.GeoGlyphGeometry.classify(rings); }
  function dissolveFontPolygons(polygons) { if (polygons.length < 2) return polygons; if (!window.polygonClipping?.union) throw Error('Font contour union unavailable'); return window.polygonClipping.union(...polygons); }


  function projectPolygons(polygons, bounds, scaleMeters, bearingDegrees, anchor, mirrorX = mapState.mirrorX) {
    const maplibregl = window.maplibregl;
    const origin = maplibregl.MercatorCoordinate.fromLngLat([anchor.lng, anchor.lat], 0);
    const unitsPerMeter = origin.meterInMercatorCoordinateUnits();
    const radians = bearingDegrees * Math.PI / 180;
    const cos = Math.cos(radians), sin = Math.sin(radians);

    return polygons.map(polygon => polygon.map(ring => ring.map(([x, y]) => {
      const localEast = (x - bounds.cx) * scaleMeters * (mirrorX ? -1 : 1);
      const localNorth = -(y - bounds.cy) * scaleMeters;
      const east = localEast * cos + localNorth * sin;
      const north = -localEast * sin + localNorth * cos;
      const merc = new maplibregl.MercatorCoordinate(
        origin.x + east * unitsPerMeter,
        origin.y - north * unitsPerMeter,
        0
      );
      const lngLat = merc.toLngLat();
      return [lngLat.lng, lngLat.lat];
    })).map(ring => mirrorX ? ring.reverse() : ring));
  }

  let manualModelVersion = 0;
  function notifyManualMapChange({ preserveModel = false } = {}) {
    if (!preserveModel) manualModelVersion++;
    document.dispatchEvent(new CustomEvent('geoglyph:manual-map-change'));
  }
  async function setModelMode(enabled) {
    if(window.GeoGlyphFontMorph?.isActive())return window.GeoGlyphFontMorph.setMode(Boolean(enabled));
    notifyManualMapChange();
    const version = manualModelVersion, choice = mapState.fontChoiceVersion;
    const current = () => version === manualModelVersion && choice === mapState.fontChoiceVersion && mapState.previewActive;
    const keys = ['extrusionEnabled','lastLocalModel','lastGeoJSON','lastDecal','lastRenderMode','lastMetrics','displayedFontId','committedSelection'];
    const previous = Object.fromEntries(keys.map(key => [key,mapState[key]]));
    cancelInitialFit(); window.GeoGlyph3D?.stopOrbit();
    mapState.extrusionEnabled = Boolean(enabled);
    if (enabled && mapState.extrusionDepthMeters == null) mapState.extrusionDepthMeters = Math.max(.1, Math.min(100000,mapState.baseHeightMeters*mapState.relativeSize/1000));
    syncUiFromState(); window.GeoGlyph3D?.refreshControls(); window.GeoGlyph3D?.syncVisibility();
    if (!mapState.previewActive || !mapState.mapReady) return false;
    clearTimeout(queueRebuild.timer);
    mapState.pendingBuild = mapState.pendingFit = mapState.explicitFitPending = false;
    try {
      const result = await rebuildGeometry(false,{deferFit:true,preserveOnFailure:true,isCurrent:current});
      if (!current()) return false;
      if (!result?.ok || (enabled && !window.GeoGlyph3D?.isVisible())) throw result?.error || Error('This content cannot be extruded');
      await waitForGroundFrame(current);
      mapState.explicitFitPending = false;
      await fitDrawnGeometry(current,{explicit:true});
      return true;
    } catch (error) {
      if (!current()) return false;
      Object.assign(mapState,previous);
      mapState.map.getSource(SOURCE_ID)?.setData(previous.lastGeoJSON || emptyFeatureCollection());
      if (previous.lastDecal) setGroundDecal(previous.lastDecal); else clearGroundDecal();
      await window.GeoGlyph3D?.update(current).catch(()=>{});
      syncUiFromState(); window.GeoGlyph3D?.refreshControls(); window.GeoGlyph3D?.syncVisibility();
      if (mapState.explicitFitPending) { mapState.explicitFitPending=false; fitGeometry(); }
      setStatus(error.message,'warn');
      return false;
    }
  }
  function setMirrorX(enabled) {
    notifyManualMapChange();
    mapState.mirrorX = enabled === true;
    syncUiFromState(); window.GeoGlyph3D?.refreshControls();
    queueRebuild(false);
  }
  function requestFit() {
    // A camera request waits for the current model switch instead of cancelling it.
    notifyManualMapChange({ preserveModel:true });
    cancelInitialFit();window.GeoGlyph3D?.stopOrbit({freezePose:true});
    if(!mapState.previewActive||!mapState.mapReady)return false;
    if(mapState.pendingBuild||mapState.rebuilding||mapState.randomSearching){mapState.explicitFitPending=true;return true;}
    return fitGeometry();
  }

  function fitGeometry(options = {}) {
    const map = mapState.map;
    if (!map) return false;
    if (window.GeoGlyph3D?.isVisible()) return window.GeoGlyph3D.fitCurrent(options);
    const coords = [];
    const fc = mapState.lastGeoJSON;
    if(window.GeoGlyphFontMorph?.isActive())coords.push(...window.GeoGlyphFontMorph.framingCoordinates());
    else if (fc?.features?.length) walkCoordinates(fc.features[0].geometry.coordinates, coords);
    else if (mapState.lastDecal?.coordinates?.length) walkCoordinates(mapState.lastDecal.coordinates, coords);
    if (!coords.length) return false;
    const bearing = options.cameraBearing ?? mapState.bearing;
    const target = groundFramingTarget(coords,options.maxZoom,bearing);
    if (!target) return false;
    map.stop();map.setCenterClampedToGround(true);map.jumpTo({elevation:0});
    map[options.fly ? 'flyTo' : 'easeTo']({
      center: target.center,
      zoom: Math.max(map.getMinZoom(), target.zoom),
      bearing,
      pitch: 0,
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:(options.duration ?? 650),
      essential: true
    });
    return true;
  }

  function groundFramingTarget(coords,maxZoom=18,bearing=mapState.bearing) {
    const map = mapState.map;
    if (!map || !coords.length) return null;
    const bounds = new window.maplibregl.LngLatBounds(coords[0], coords[0]);
    coords.slice(1).forEach(coord => bounds.extend(coord));
    const canvas = map.getCanvas();
    const padding = window.GeoGlyphGroundTransform.framingPadding(canvas.clientWidth,canvas.clientHeight);
    const target = map.cameraForBounds(bounds, { padding, maxZoom, bearing, pitch:0 });
    return target ? { ...target, zoom:Math.max(map.getMinZoom(),target.zoom) } : null;
  }

  function walkCoordinates(value, output) {
    if (Array.isArray(value) && value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
      output.push(value);
      return;
    }
    if (Array.isArray(value)) value.forEach(item => walkCoordinates(item, output));
  }

  function updateGeometryStats() {
    const metrics = mapState.lastMetrics;
    if ($("mapGeometryStats")) {
      $("mapGeometryStats").textContent = metrics
        ? `${metrics.glyphs} glyphs · ${metrics.polygons} ${mapState.lastRenderMode === "decal" ? "decals" : "polygons"} · ${metrics.vertices.toLocaleString()} ${mapState.lastRenderMode === "decal" ? "corners" : "vertices"} · ${Math.round(metrics.heightMeters).toLocaleString()} m high · ${metrics.renderer || mapState.lastRenderMode}`
        : "No preview";
    }
    updateAnchorStats();
  }

  function updateAnchorStats() {
    if ($("mapAnchorStats")) $("mapAnchorStats").textContent = `${mapState.anchor.lng.toFixed(5)}, ${mapState.anchor.lat.toFixed(5)} · ${mapState.anchorPinned ? "placed by click" : "fixed anchor"}`;
  }

  async function exportGeoJSON() {
    const morph=window.GeoGlyphFontMorph;
    if(morph&&!morph.canExport()){setStatus('Move the morph slider to an endpoint before exporting.','warn');return;}
    let exportData = mapState.lastGeoJSON;
    if(morph?.isActive()){
      try{
        exportData=await morph.exportGeoJSON();
        if(!exportData){setStatus('The morph changed before export. Choose an endpoint and retry.','warn');return;}
      }catch(error){setStatus('Font endpoint export failed: '+error.message,'warn');return;}
    }
    if (!exportData && mapState.lastDecal?.coordinates?.length === 4) {
      const ring = [...mapState.lastDecal.coordinates, mapState.lastDecal.coordinates[0]];
      exportData = {
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          properties: {
            renderer: "ground-decal-footprint",
            font: selectedRecord()?.name || "Font",
            height_m: mapState.lastDecal.heightMeters,
            width_m: mapState.lastDecal.widthMeters,
            bearing: mapState.bearing
          },
          geometry: { type: "Polygon", coordinates: [ring] }
        }]
      };
    }
    if (!exportData) {
      setStatus("No map preview to export", "warn");
      return;
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `geoglyph-${mapState.mode}-${Date.now()}.geojson`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function observeExistingFontChanges() {
    // v16.3: no polling. The store is refreshed on Map entry and on explicit imports/scans.
  }

  let bootComplete = false;
  let observerStarted = false;

  function exposeApi() {
    if (window.GeoGlyphMapEngine) return;
    window.GeoGlyphMapEngine = Object.freeze({
      state: mapState,
      setModelMode,
      setMirrorX,
      notifyManualMapChange,
      refreshFonts: refreshFontStore,
    prepareConferenceFont,
      applyConferenceCue,
      applyScriptCue:(patch,options={})=>applyConferenceCue(patch,{...options,suppressFit:patch.fit!==true}),
      fitScriptMorph:(current,{orbit=false,maxZoom,cameraBearing}={})=>fitDrawnGeometry(current,{force:true,orbit,maxZoom,cameraBearing}),
      commitMorphEndpoint:(morphEndpoint,isCurrent)=>rebuildGeometry(false,{morphEndpoint,isCurrent,deferFit:true,preserveOnFailure:true}),
      cancelScriptWork:()=>cancelConferenceWork({preserveMotion:true}),
      fontCompatibility:id=>compatibilityFilter().result(id),
      cancelConferenceWork,
      showConferenceOverview,
      showHomeView,captureCameraView,restoreCameraView,pickCameraView,setCameraAuthoring,playCameraFlight,cancelCameraFlight,
      enterConferenceMode,
      drawConferenceOpening,
      flyToConferenceOpening: current => fitDrawnGeometry(current, { introduction:true }),
      waitForCamera: waitForCamera,
      retryConferenceMapInitialization,
      startPolling: startArcgisPolling,
      stopPolling: stopArcgisPolling,
      setConnectionStatus: setArcgisStatus,
      rebuild: rebuildGeometry,
      queueRebuild,
      placeAnchor,
      cancelInitialFit,
      refreshControls: () => { syncUiFromState(); syncModeUi(); syncBasemapButtons(); window.GeoGlyph3D?.refreshControls(); },
      getLocalModel: () => mapState.lastLocalModel,
      getFontService: () => window.GeoGlyphFontService,
      importFonts: importFileList,
      selectFont,
      randomFont,
      fit: requestFit,
      getGeoJSON: () => window.GeoGlyphFontMorph?.isActive()?null:mapState.lastGeoJSON,
      scanSystemFonts,
      loadEsriFonts,
      showMap: showMapPreview,
      showCanvas: showCanvasPreview,
      resizeViewport: syncMapViewportLayout,
      togglePreview: togglePreviewSurface,
      geometry: Object.freeze({ buildTextGeometry, flattenPath, classifyFontContours, dissolveFontPolygons, projectPolygons }),
      rasteriseGroundDecal
    });
  }

  function scheduleMapLibreWarmup() {
    // v16.3: no background map warmup. The embedded renderer starts only when Map is selected.
  }

  function tryBoot() {
    if (bootComplete) return true;
    const hostReady = Boolean(
      window.GeoGlyphStudio &&
      document.querySelector(".workflow-nav") &&
      document.querySelector(".preview-panel > .panel-body")
    );
    if (!hostReady) return false;
    makeUi();
    if (!$("mapCanvasToggleBtn") || !$('geoglyphPreviewBtn') || !$("geoglyphMapWorkspace")) return false;
    observeExistingFontChanges();
    exposeApi();
    bootComplete = true;
    document.documentElement.dataset.geoglyphMapEngine = "ready";
    scheduleMapLibreWarmup();
    // Warm the small boolean-geometry helper without delaying the host UI.
    ensurePolygonClipping();
    return true;
  }

  function bootWhenHostReady() {
    if (tryBoot()) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryBoot() || attempts >= 100) window.clearInterval(timer);
    }, 50);
    if (!observerStarted) {
      observerStarted = true;
      const observer = new MutationObserver(() => {
        if (tryBoot()) observer.disconnect();
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.setTimeout(() => observer.disconnect(), 10000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootWhenHostReady, { once: true });
  } else {
    bootWhenHostReady();
  }
  window.addEventListener("load", bootWhenHostReady, { once: true });
})();

