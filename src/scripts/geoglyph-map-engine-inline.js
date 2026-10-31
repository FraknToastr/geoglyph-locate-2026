
(() => {
  "use strict";

  const MAPLIBRE_VERSION = "5.3.0-embedded";
  const ESRI_AERIAL_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const ESRI_TOPO_URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
  const METROMAP_STORAGE_KEY = "geoglyph-locate2026.geoglyph.metromap.apiKey";
  const surveyResults = window.GeoGlyphSurveyResults.create();
  const presentation = Boolean(window.GeoGlyphConferenceConfig?.enabled);
  const DEFAULT_ANCHOR = { lng: 138.6007, lat: -34.9285 };
  const AUSTRALIA_BOUNDS = [[112, -44], [154, -10]];
  const CONFERENCE_INTRO_DURATION_MS = 30000;
  const SOURCE_ID = "geoglyph-ground-geometry";
  const FILL_LAYER_ID = "geoglyph-ground-fill";
  const LINE_LAYER_ID = "geoglyph-ground-outline";
  const DECAL_SOURCE_ID = "geoglyph-ground-decal";
  const DECAL_LAYER_ID = "geoglyph-ground-decal-layer";
  const MAX_GRID_CODES = 120;
  const DESIGN_SIZE = 1000;

  const mapState = {
    mode: presentation ? "arcgis" : "glyph",
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
    extrusionDepthMeters: null,
    extrusionTilt: 90,
    extrusionSolid: true,
    orientationMode: "fixed",
    orbitPeriodSeconds: 30,
    selectedFontId: "",
    fontChoiceVersion:0,
    lastHostSignature:'',
    selectedCode: 65,
    nativeColor: presentation,
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
    codepoints: [],
    codePage: 0,
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
  const safeCodePoint = code => Number.isInteger(code) && code >= 0 && code <= 0x10FFFF;
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

    let mapButton = $("mapCanvasToggleBtn");
    if (!mapButton) {
      mapButton = document.createElement("button");
      mapButton.className = "square-btn";
      mapButton.id = "mapCanvasToggleBtn";
      mapButton.type = "button";
      mapButton.textContent = "Map";
      mapButton.setAttribute("aria-pressed", "false");
      mapButton.title = "Show map preview";
      const symbolButton = nav.querySelector('[data-workflow="symbol"]');
      symbolButton?.after(mapButton);
    }

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
            <div class="map-editor-head-actions">
              <div class="map-collapsed-actions" aria-label="Collapsed map actions">
                <button class="map-collapsed-action map-collapsed-fit" id="mapCollapsedFitBtn" type="button" title="Fit geometry" aria-label="Fit geometry">⛶</button>
                <button class="map-collapsed-action" id="mapCollapsedJpgBtn" type="button" title="Save map to JPG">JPG</button>
                <button class="map-collapsed-action" id="mapCollapsedPngBtn" type="button" title="Save map to PNG">PNG</button>
              </div>
              <button class="map-editor-collapse" id="mapEditorCollapseBtn" type="button" aria-expanded="true" title="Collapse Ground Font Engine">−</button>
            </div>
          </div>
          <div class="map-mode-switch" role="group" aria-label="Projection mode">
            <button class="map-chip is-active" type="button" data-map-mode="message">Message</button>
            <button class="map-chip" type="button" data-map-mode="glyph">Character</button>
            <button class="map-chip" type="button" data-map-mode="arcgis">ArcGIS</button>
          </div>
        </div>

        <section class="map-pane map-arcgis-pane" data-map-pane="arcgis" hidden>
          <div class="arcgis-grid">
            <label class="map-field" id="mapArcgisLayerField" hidden><span>Results layer</span><select id="mapArcgisLayerSelect"><option value="">Choose a results layer</option></select></label>
          <div class="arcgis-actions arcgis-poll-actions">
              <button class="map-action" id="mapArcgisStartBtn" type="button">Start</button>
              <button class="map-action" id="mapArcgisPollBtn" type="button">Fetch</button>
              <button class="map-action" id="mapArcgisStopBtn" type="button" disabled>Stop</button>
            <label class="arcgis-poll-interval"><span>Poll (s)</span><input id="mapArcgisInterval" type="number" min="1" max="3600" step="1" value="5" aria-label="ArcGIS poll interval in seconds" title="Seconds between checks; changes apply while polling"></label>
            </div>
            <div class="arcgis-live"><strong>Survey123 results</strong><span id="mapArcgisLiveValue" role="status" aria-live="polite">Ready · Fetch once or Start live updates</span></div>
            <div class="arcgis-note">Latest non-empty response · whats_on_your_mind</div>
          </div>
        </section>

        <div class="map-control-grid">
          <label class="map-field map-span-2"><span>Font</span><select id="mapFontSelect"></select></label>
          <button class="map-action" id="mapScanSystemBtn" type="button">System</button>
          <button class="map-action" id="mapCopyEsriPathBtn" type="button">Copy Esri Path</button>
          <button class="map-action" id="mapLoadEsriBtn" type="button">Load Esri Fonts</button>
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

        <section class="map-pane" data-map-pane="glyph" hidden>
          <div class="map-glyph-summary">
            <strong id="mapGlyphSelected">A</strong>
            <span id="mapGlyphCode">U+0041</span>
            <span id="mapCoverage">Outline index not loaded</span>
          </div>
          <div class="map-glyph-toolbar">
            <button class="map-mini" id="mapGlyphPrev" type="button">‹</button>
            <span id="mapGlyphPage">1 / 1</span>
            <button class="map-mini" id="mapGlyphNext" type="button">›</button>
            <input id="mapGlyphSearch" type="search" placeholder="A, ★, 😀 or U+E000" aria-label="Find character or Unicode code" title="Type a character, emoji, symbol, or Unicode code such as U+E000">
          </div>
          <div class="map-glyph-grid" id="mapGlyphGrid" aria-label="Font character table"></div>
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
            <button class="map-action" id="mapFitBtn" type="button">Fit</button>
            <button class="map-action" id="mapExportGeoJsonBtn" type="button">Geojson</button>
            <button class="map-action" id="mapSaveJpgBtn" type="button">JPG</button>
            <button class="map-action" id="mapSavePngBtn" type="button">PNG</button>
          </div>
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
      const workspace = $("geoglyphMapWorkspace");
      const mapVisible = Boolean(workspace && !workspace.hidden && document.body.classList.contains("geoglyph-map-preview"));
      if (mapVisible) {
        showCanvasPreview();
        return;
      }
      // Call Local Font Access while this click still carries user activation. Only the selected face is parsed.
      const outlinePromise = primeHostFontOutline({ buildIndex: false });
      showMapPreview(outlinePromise);
    }, true);
    nav?.addEventListener("click", event => {
      const workflowButton = event.target.closest("[data-workflow]");
      // Dismiss Map without overwriting the workflow the user just requested.
      // This prevents QR / Scan QRs / Magic Eye from requiring a second click.
      if (workflowButton && mapState.previewActive) showCanvasPreview({ preserveWorkflow: true });
    });

    document.querySelectorAll("[data-map-mode]").forEach(button => button.addEventListener("click", async () => {
      const nextMode = button.dataset.mapMode;
      if (mapState.mode === "arcgis" && nextMode !== "arcgis") stopArcgisPolling({ quiet: true });
      mapState.mode = nextMode;
      syncModeUi();
      if (mapState.mode === "glyph") {
        await activateSelectedFont({ buildIndex: true, syncLegacy: false });
        queueRebuild(false);
      } else if (mapState.mode === "arcgis") {
        if (mapState.message) queueRebuild(false);
        else setStatus("Survey123 results · Fetch once or Start live updates", "info");
      } else {
        queueRebuild(false);
      }
    }));

    $("mapEditorCollapseBtn")?.addEventListener("click", () => {
      const editor = $("geoglyphMapEditor");
      if (!editor) return;
      const collapsed = editor.classList.toggle("is-collapsed");
      const button = $("mapEditorCollapseBtn");
      if (button) {
        button.textContent = collapsed ? "+" : "−";
        button.setAttribute("aria-expanded", String(!collapsed));
        button.title = collapsed ? "Expand Ground Font Engine" : "Collapse Ground Font Engine";
      }
    });

    $("mapFontSelect")?.addEventListener("change", async event => {
      await selectFont(event.target.value);
    });

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
    $("mapNativeColor")?.addEventListener("change", event => { mapState.nativeColor = event.target.checked; queueRebuild(false); });

    $("mapGlyphPrev")?.addEventListener("click", () => { mapState.codePage = Math.max(0, mapState.codePage - 1); renderGlyphTable(); });
    $("mapGlyphNext")?.addEventListener("click", () => { mapState.codePage += 1; renderGlyphTable(); });
    $("mapGlyphSearch")?.addEventListener("input", renderGlyphTable);
    $("mapGlyphSearch")?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        selectGlyphFromSearch(event.currentTarget.value);
      }
    });
    $("mapGlyphSearch")?.addEventListener("change", event => selectGlyphFromSearch(event.currentTarget.value));
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
    document.addEventListener("click", event => {
      const cell = event.target.closest("#mapGlyphGrid [data-map-code]");
      if (!cell) return;
      selectGlyph(Number(cell.dataset.mapCode));
    });

    new MutationObserver(() => {
      // Workflow changes initiated while Map is visible must keep the new workflow.
      if (mapState.previewActive && document.body.dataset.workflow !== "symbol")
        showCanvasPreview({ preserveWorkflow: true });
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
    else showMapPreview(primeHostFontOutline({ buildIndex: false }));
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

  function syncMapViewportLayout() {
    if (!mapState.previewActive) return;
    const header = document.querySelector(".app-header");
    const top = Math.max(0, Math.round(header?.getBoundingClientRect().bottom || 48));
    document.documentElement.style.setProperty("--geoglyph-map-top", `${top}px`);
    requestAnimationFrame(() => requestAnimationFrame(() => mapState.map?.resize()));
  }

  function showMapPreview(outlinePromise = null) {
    const workspace = $("geoglyphMapWorkspace");
    if (!workspace) return;
    ensureHostSymbolWorkflow();
    syncHostSelectionBasics();
    mapState.lastHostSignature=hostSelectionSignature();
    // Enter Map with the whole geographic viewport available. The Font Explorer
    // may then be explicitly opened to create the live 50/50 split.
    closeExplorerForMapEntry();
    mapState.previewActive = true;
    document.body.classList.add("geoglyph-map-preview");
    workspace.hidden = false;
    syncMapViewportLayout();
    const button = $("mapCanvasToggleBtn");
    if (button) {
      button.textContent = "Canvas";
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      button.title = "Return to canvas preview";
    }
    const headerTitle = document.querySelector(".preview-panel .panel-title");
    if (headerTitle) headerTitle.textContent = "Map Preview";
    refreshFontStore();
    initMap();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mapState.map?.resize();
    }));
    Promise.resolve(outlinePromise).then(record => {
      if (!mapState.previewActive) return;
      queueRebuild(false);
      if (mapState.mode === "glyph" && record?.opentypeFont) window.setTimeout(() => activateSelectedFont({ buildIndex: true, syncLegacy: false }), 250);
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

  function showCanvasPreview(options = {}) {
    cancelRandomSearch();mapState.explicitFitPending=false;
    window.GeoGlyph3D?.exitCamera();
    const preserveWorkflow = Boolean(options.preserveWorkflow);
    if (mapState.arcgisPolling || mapState.arcgisPollBusy) stopArcgisPolling({ quiet: true });
    mapState.previewActive = false;
    document.body.classList.remove("geoglyph-map-preview");
    const workspace = $("geoglyphMapWorkspace");
    if (workspace) workspace.hidden = true;
    if (!preserveWorkflow) ensureHostSymbolWorkflow();
    const button = $("mapCanvasToggleBtn");
    if (button) {
      button.textContent = "Map";
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
      button.title = "Show map preview";
    }
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
    document.querySelectorAll("[data-map-mode]").forEach(button => button.classList.toggle("is-active", button.dataset.mapMode === mapState.mode));
    document.querySelectorAll("[data-map-pane]").forEach(pane => {
      const paneMode = pane.dataset.mapPane;
      pane.hidden = mapState.mode === "arcgis" ? !["arcgis", "message"].includes(paneMode) : paneMode !== mapState.mode;
    });
    const messageBox = $("mapMessage");
    if (messageBox) {
      messageBox.readOnly = mapState.mode === "arcgis";
      messageBox.title = mapState.mode === "arcgis" ? "Live ArcGIS attribute value" : "Ground message";
    }
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

  function renderFontChooser() {
    const select = $("mapFontSelect");
    if (!select) return;
    const current = mapState.selectedFontId;
    const records = [...mapState.fontRecords.values()].sort((a, b) => `${a.source} ${a.name}`.localeCompare(`${b.source} ${b.name}`));
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
  }

  async function scanSystemFonts() {
    if (typeof window.queryLocalFonts !== "function") {
      setStatus("Local Font Access unavailable; load font files instead", "warn");
      return;
    }
    const button = $("mapScanSystemBtn");
    if (button) { button.disabled = true; button.textContent = "Scanning…"; }
    try {
      const fonts = await window.queryLocalFonts();
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
      renderFontChooser();
      setStatus(`${fonts.length} system font faces indexed`, "ok");
    } catch (error) {
      console.error(error);
      setStatus("System font scan cancelled or blocked", "warn");
    } finally {
      if (button) { button.disabled = false; button.textContent = "System"; }
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
        await activateSelectedFont({ buildIndex: mapState.mode === "glyph", syncLegacy: false });
        queueRebuild(false);
      }
    }
    setStatus(`${candidates.length} ${source === "esri" ? "Esri" : "font"} file(s) indexed`, candidates.length ? "ok" : "warn");
  }

  async function activateSelectedFont(options = {}) {
    const record = selectedRecord(); if (!record) return null;
    const selectedId = record.id,choice=mapState.fontChoiceVersion;
    try {
      const font = await ensureOpenTypeFont(record);
      if (selectedId !== mapState.selectedFontId || choice!==mapState.fontChoiceVersion) return font;
      record.outlineIndexUnavailable = false;
      if (options.buildIndex ?? (mapState.mode === 'glyph')) { buildCodepointIndex(font); renderGlyphTable(); }
      if (options.syncLegacy) syncGeoGlyphSelection(record);
      setStatus(record.name + ' · outline geometry ready', 'ok'); return font;
    } catch (error) {
      record.outlineIndexUnavailable = true;
      if (selectedId !== mapState.selectedFontId || choice!==mapState.fontChoiceVersion) return null;
      if (options.buildIndex ?? (mapState.mode === 'glyph')) { mapState.codepoints = []; renderGlyphTable(); syncGlyphSummary(); }
      setStatus(record.name + ' · styled browser rendering ready', 'warn'); return null;
    }
  }

  async function ensureOpenTypeFont(record) {
    const service = window.GeoGlyphFontService;
    // CSS face registration does not depend on the outline parser supporting the font.
    service.ensureFace(record).catch(() => null);
    const metadata = await service.prepare(record);
    record.opentypeFont = metadata; return metadata;
  }

  function syncGeoGlyphSelection(record) {
    const api = geoGlyphApi();
    const ref = record.geoGlyphRef;
    if (!api?.state || !ref?.id) return;
    api.state.selectedFontId = ref.id;
    api.state.selectedCode = mapState.selectedCode;
  }

  function buildCodepointIndex(font) {
    if (Array.isArray(font?.codes)) { mapState.codepoints = font.codes.slice(); mapState.codePage = 0; return; }
    const map = font?.tables?.cmap?.glyphIndexMap || {};
    const codes = Object.keys(map)
      .map(Number)
      .filter(code => safeCodePoint(code) && code > 31 && Number(map[code]) > 0)
      .sort((a, b) => a - b);
    mapState.codepoints = codes;
    mapState.codePage = Math.max(0, Math.min(mapState.codePage, Math.ceil(codes.length / MAX_GRID_CODES) - 1));
    if (!codes.includes(mapState.selectedCode)) mapState.selectedCode = codes.find(code => code === 65) ?? codes[0] ?? 65;
  }

  function renderGlyphTable() {
    const grid = $("mapGlyphGrid");
    if (!grid) return;
    const record = selectedRecord();
    const allCodes = mapState.codepoints;
    const query = $("mapGlyphSearch")?.value?.trim() || "";
    let codes = allCodes;
    const exact = query.match(/^u\+([0-9a-f]{1,6})$/i);
    if (exact) {
      const code = parseInt(exact[1], 16);
      codes = allCodes.includes(code) ? [code] : [];
    } else if (query) {
      const literal = [...query][0];
      const literalCode = literal?.codePointAt(0);
      codes = safeCodePoint(literalCode) && allCodes.includes(literalCode) ? [literalCode] : allCodes.filter(code => formatCode(code).toLowerCase().includes(query.toLowerCase()));
    }
    const pages = Math.max(1, Math.ceil(codes.length / MAX_GRID_CODES));
    mapState.codePage = Math.min(mapState.codePage, pages - 1);
    const start = mapState.codePage * MAX_GRID_CODES;
    const pageCodes = codes.slice(start, start + MAX_GRID_CODES);
    grid.style.setProperty("--map-glyph-font", record?.cssFamily ? `"${String(record.cssFamily).replace(/"/g, '\\"')}"` : "sans-serif");
    const emptyMessage = record?.outlineIndexUnavailable || (!allCodes.length && mapState.lastRenderMode === "decal")
      ? `<div class="map-empty-grid"><strong>Vector outline index unavailable.</strong><br>Ground decal rendering is available.<br><span>Type a character or Unicode code above, then press Enter.</span></div>`
      : query
      ? `<div class="map-empty-grid">No indexed characters match this filter. You can still type a character or Unicode code and press Enter.</div>`
      : `<div class="map-empty-grid">No indexed characters are available for this font.</div>`;
    grid.innerHTML = pageCodes.map(code => {
      let char = "";
      try { char = String.fromCodePoint(code); } catch { char = "□"; }
      return `<button class="map-glyph-cell ${code === mapState.selectedCode ? "is-active" : ""}" data-map-code="${code}" type="button" title="${formatCode(code)}"><b>${esc(char)}</b><span>${formatCode(code).replace("U+", "")}</span></button>`;
    }).join("") || emptyMessage;
    if ($("mapGlyphPage")) $("mapGlyphPage").textContent = `${mapState.codePage + 1} / ${pages}`;
    if ($("mapCoverage")) {
      $("mapCoverage").textContent = allCodes.length
        ? `${allCodes.length.toLocaleString()} indexed characters`
        : (record?.outlineIndexUnavailable || mapState.lastRenderMode === "decal")
        ? "Vector outline index unavailable · decal supported"
        : "Outline index not loaded";
    }
    syncGlyphSummary();
  }

  function selectGlyphFromSearch(value) {
    const query = String(value || "").trim();
    if (!query) return false;
    const exact = query.match(/^u\+([0-9a-f]{1,6})$/i);
    let code = exact ? parseInt(exact[1], 16) : [...query][0]?.codePointAt(0);
    if (!safeCodePoint(code)) return false;
    mapState.selectedCode = code;
    const api = geoGlyphApi();
    if (api?.state) api.state.selectedCode = code;
    syncGlyphSummary();
    renderGlyphTable();
    queueRebuild(false);
    return true;
  }

  function selectGlyph(code) {
    if (!safeCodePoint(code)) return;
    mapState.selectedCode = code;
    const api = geoGlyphApi();
    if (api?.state) api.state.selectedCode = code;
    syncGlyphSummary();
    renderGlyphTable();
    queueRebuild(false);
  }

  function syncGlyphSummary() {
    let char = "□";
    try { char = String.fromCodePoint(mapState.selectedCode); } catch {}
    if ($("mapGlyphSelected")) {
      $("mapGlyphSelected").textContent = char;
      const record = selectedRecord();
      $("mapGlyphSelected").style.fontFamily = record?.cssFamily ? `"${record.cssFamily}"` : "sans-serif";
    }
    if ($("mapGlyphCode")) $("mapGlyphCode").textContent = formatCode(mapState.selectedCode);
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
    const api = geoGlyphApi();
    const hostFont = currentHostFont();
    const code = Number(api?.state?.selectedCode);
    if (mapState.mode === "glyph" && safeCodePoint(code)) mapState.selectedCode = code;
    if (hostFont?.id) {
      const directId = `geoglyph:${hostFont.id}`;
      if (mapState.fontRecords.has(directId)) mapState.selectedFontId = directId;
    }
    renderFontChooser();
    if ($("mapFontSelect") && mapState.selectedFontId) $("mapFontSelect").value = mapState.selectedFontId;
    syncGlyphSummary();
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
      else if (targets[ti].length > 4 && (targets[ti].includes(values[vi]) || values[vi].includes(targets[ti]))) score = Math.max(score, 55 - ti * 3 - vi);
    }
    const wantedStyle = normalizedFontName(hostFont.style);
    if (score >= 0 && wantedStyle && normalizedFontName(descriptor.style) === wantedStyle) score += 8;
    return score;
  }

  function bestLocalDescriptor(descriptors, hostFont) {
    let best = null, bestScore = -1;
    for (const descriptor of descriptors || []) {
      const score = fontMatchScore(descriptor, hostFont);
      if (score > bestScore) { best = descriptor; bestScore = score; }
    }
    return bestScore >= 50 ? best : null;
  }

  function existingMatchingOutlineRecord(hostFont) {
    const direct = hostFont?.id ? mapState.fontRecords.get(`geoglyph:${hostFont.id}`) : null;
    if (recordHasOutlineAccess(direct)) return direct;
    let best = null, bestScore = -1;
    for (const record of mapState.fontRecords.values()) {
      if (!recordHasOutlineAccess(record)) continue;
      const descriptorLike = { postscriptName: record.postscriptName, fullName: record.name, family: record.family, style: record.style };
      const score = fontMatchScore(descriptorLike, hostFont);
      if (score > bestScore) { best = record; bestScore = score; }
    }
    return bestScore >= 50 ? best : direct;
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
    if (!recordHasOutlineAccess(record) && typeof window.queryLocalFonts === "function") {
      try {
        setStatus(`Resolving ${hostFont.name || hostFont.family || "selected font"} outline…`, "info");
        if (!mapState.localFontDescriptors) mapState.localFontDescriptors = await window.queryLocalFonts();
        if(!current())return null;
        const descriptor = bestLocalDescriptor(mapState.localFontDescriptors, hostFont);
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
    const font = await activateSelectedFont({ buildIndex: Boolean(options.buildIndex), syncLegacy: false });
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
      await primeHostFontOutline({ buildIndex: false });
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
    if (presentation && window.GeoGlyphConference && !window.GeoGlyphConference.state.ready)
      return window.GeoGlyphConference.retryStartup();
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
      if (layers.length === 1) {
        mapState.arcgisLayerId = layers[0].id;
        selector.value = String(layers[0].id);
      }
    }
    const layer = mapState.arcgisLayers.find(layer => layer.id === mapState.arcgisLayerId);
    if (!layer) throw new window.GeoGlyphSurveyResults.ResultsError("Choose a results layer, then Fetch or Start.", "selection");
    return layer;
  }

  async function pollArcgisOnce() {
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
      this.container.append(this.northButton, this.viewButton);
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
        ...(presentation ? { bounds: AUSTRALIA_BOUNDS, fitBoundsOptions: { padding: 48 } } : {}),
        pitch: 0,
        bearing: 0,
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
        if (presentation && mapState.conferenceOverview) showConferenceOverview();
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
            await primeHostFontOutline({ buildIndex: false });
            if (mapState.previewActive) queueRebuild(false);
          }, 0);
        }
        requestAnimationFrame(() => map.resize());
      });
      map.on("zoomend", rebuildAfterZoom);

      for (const event of ["dragstart", "zoomstart", "pitchstart", "rotatestart"]) {
        map.on(event, e => { if (e.originalEvent) cancelInitialFit(); });
      }
    map.on("click", event => {
        if (!mapState.mapReady) return;
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
    if (!mapState.previewActive || !mapState.lastMetrics) return;
    // Committed 3D outlines use fixed model detail; only their camera changes.
    if (mapState.extrusionEnabled && mapState.lastRenderMode === 'vector' &&
        mapState.lastLocalModel && window.GeoGlyph3D?.isVisible()) return;
    queueRebuild(false);
  }

  function queueRebuild(fit = false) {
    if (mapState.conferenceRenderSuspended) return;
    if (mapState.conferenceApplying) { mapState.conferenceRebuildPending = true; return; }
    if(!window.GeoGlyphUi?.isRestoring?.())mapState.historyRestoreChoice=null;
    ++mapState.buildToken; mapState.pendingBuild = true; mapState.pendingFit ||= Boolean(fit);
    clearTimeout(queueRebuild.timer);
    queueRebuild.timer = setTimeout(() => { if (!mapState.rebuilding||mapState.extrusionEnabled) rebuildGeometry(); }, 0);
  }

  async function ensurePolygonClipping() { return window.polygonClipping || null; }

  function layoutFor(record) {
    return { tracking: mapState.mode === 'glyph' ? 0 : mapState.tracking, lineHeight: mapState.lineHeight, quality: mapState.quality, symbol: Boolean(mapLegacySymbolFamily(record)), tolerance:mapState.extrusionEnabled?Math.max(.02,2/(mapState.quality+1)):groundTolerance(mapState.lastLocalModel?.bounds?.height||1000) };
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
    cancelRandomSearch();mapState.fontChoiceVersion++;mapState.selectedFontId=id;
    if($('mapFontSelect'))$('mapFontSelect').value=id;
    // Index/native face work is independent of the visible 3D model.
    activateSelectedFont({buildIndex:mapState.mode==='glyph'});
    queueRebuild(false);return true;
  }
  let activeBuildToken=0;
  async function rebuildGeometry(fit = false, options = {}) {
    if (mapState.conferenceRenderSuspended) return;
    mapState.pendingFit ||= Boolean(fit);
    if (!mapState.previewActive || !mapState.mapReady) return;
    if (mapState.rebuilding&&!mapState.extrusionEnabled) { ++mapState.buildToken; mapState.pendingBuild = true; return; }
    mapState.rebuilding = true; mapState.pendingBuild = false;
    const buildToken = ++mapState.buildToken, shouldFit = mapState.pendingFit; mapState.pendingFit = false;
    activeBuildToken=buildToken;
    const choice=mapState.fontChoiceVersion;
    const current = () => buildToken === mapState.buildToken && choice === mapState.fontChoiceVersion && mapState.previewActive && (!options.isCurrent || options.isCurrent());
    try {
      const record = selectedRecord(); if (!record) throw Error('Choose a font');
      window.GeoGlyphFontService.pin(record,'map');
      const text = previewTextForMode(record); if (!text || !text.trim()) throw Error('Enter visible content');
      setStatus('Preparing '+record.name+'…', 'info');
      window.GeoGlyph3D?.preparing(record.name);
      // The browser face and worker can share bytes without waiting for each other.
      window.GeoGlyphFontService.ensureFace(record,{isCurrent:current}).catch(()=>null);
      let model = null, vectorError = null;
      try {model=await prepareFontModel(record,text);}catch(error){vectorError=error;}
      if (!current()) return;
      const heightMeters = mapState.baseHeightMeters * mapState.relativeSize / 100;
      const selection={selectedFontId:record.id,mode:mapState.mode,message:mapState.message,selectedCode:mapState.selectedCode,tracking:mapState.tracking,lineHeight:mapState.lineHeight,quality:mapState.quality};
      if (model) {
        const coordinates = projectPolygons(model.polygons, model.bounds, heightMeters / model.bounds.height, mapState.bearing, mapState.anchor);
        const fc = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: { mode: mapState.mode, renderer: 'vector', message: text, font: record.name, fill: mapState.fill, outline: mapState.outline, height_m: heightMeters, bearing: mapState.bearing }, geometry: { type: 'MultiPolygon', coordinates } }] };
        const apply=()=>{
          mapState.lastLocalModel = model; mapState.lastGeoJSON = fc; mapState.lastDecal = null; mapState.lastRenderMode = 'vector';
          mapState.displayedFontId=record.id;mapState.committedSelection=selection;
          mapState.lastMetrics = { glyphs: [...text].length, polygons: coordinates.length, vertices: model.vertices, heightMeters, font: record.name, renderer: 'Vector geometry' };
          clearGroundDecal(); mapState.map.getSource(SOURCE_ID)?.setData(fc); applyMapPaint();
        };
        if(mapState.extrusionEnabled&&window.GeoGlyph3D){
          const prepared=await window.GeoGlyph3D.prepare(model);
          if(!current()||!await window.GeoGlyph3D.commit(prepared,apply,current))return;
        }else {apply();await window.GeoGlyph3D?.update(current);}
      } else {
        // A failed request never replaces an already displayed 3D model.
        if(mapState.extrusionEnabled&&window.GeoGlyph3D?.isVisible())throw vectorError||Error('No validated outlines to extrude');
        const face=await window.GeoGlyphFontService.ensureFace(record, { isCurrent: current }).catch(() => null);
        if (!current()) return;
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
        activateSelectedFont({buildIndex:mapState.mode==='glyph'});
        try{
          const rendered=await rebuildGeometry(false,{deferFit:true,preserveOnFailure:true,isCurrent:current});
          if(!rendered?.ok||!current())throw rendered?.error||Error('Random font render was superseded');
          await waitForGroundFrame(()=>current()&&mapState.displayedFontId===id);
          const explicit=mapState.explicitFitPending;
          mapState.explicitFitPending=false;
          await fitDrawnGeometry(current,{explicit});
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
    }finally{if(operation===randomRequest){mapState.randomSearching=false;button?.setAttribute('aria-busy','false');}}
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

  function previewTextForMode(record) {
    if (mapState.mode === "arcgis") return String(mapState.message || "");
    if (mapState.mode === "glyph") {
      const code = Number(mapState.selectedCode) || 65;
      if (mapLegacySymbolFamily(record)) {
        const slot = code <= 0xFF ? code : (code >= 0xF000 && code <= 0xF0FF ? code - 0xF000 : code);
        return String.fromCharCode(slot);
      }
      try {
        return String.fromCodePoint(code);
      } catch (_) {
        return String.fromCharCode(code & 0xFFFF);
      }
    }
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
  async function fitDrawnGeometry(current, { explicit = false, orbit = false, introduction = false } = {}) {
    if (!current()) throw Error('Artwork was superseded before Fit');
    if (mapState.conferenceOverview && !explicit && !introduction) return false;
    const first = mapState.initialFitStatus === 'pending';
    const preserveOrbit = !explicit && mapState.extrusionEnabled && Boolean(window.GeoGlyph3D?.stats().animation.orbiting);
    if (!preserveOrbit) window.GeoGlyph3D?.stopOrbit();
    if (!fitGeometry({ orbit:orbit || preserveOrbit, preserveOrbit, ...(introduction ? { duration:CONFERENCE_INTRO_DURATION_MS, fly:true } : {}) })) throw Error('The artwork could not be fitted');
    await waitForCamera(current, introduction ? CONFERENCE_INTRO_DURATION_MS + 10000 : undefined);
    if (first) { mapState.initialFitStatus='done'; mapState.firstFitDone=true; mapState.initialFitCount++; }
    return true;
  }

  let conferenceApplyOwner = null;
  async function applyConferenceCue(patch, options = {}) {
    await waitForCondition(() => !mapState.rebuilding || options.isCurrent?.() === false, 'Previous render did not complete');
    if (options.isCurrent?.() === false) throw Error('Cue was superseded');
    if (!mapState.previewActive) throw Error('Map is not active');
    const keys = ['mode','message','arcgisMessage','selectedFontId','nativeColor','extrusionEnabled','orientationMode','fill','outline','outlineWidth','opacity','bearing','tracking','lineHeight','quality','relativeSize','extrusionTilt','extrusionSolid','anchor','anchorInitialised','anchorPinned','baseHeightMeters','extrusionDepthMeters','lastLocalModel','lastGeoJSON','lastDecal','lastRenderMode','lastMetrics','displayedFontId','committedSelection'];
    const previous = Object.fromEntries(keys.map(key => [key, mapState[key]]));
    cancelRandomSearch();
    const choice = ++mapState.fontChoiceVersion;
    const current = () => mapState.fontChoiceVersion === choice && mapState.previewActive && (!options.isCurrent || options.isCurrent());
    const owner = {};
    conferenceApplyOwner = owner;
    mapState.conferenceApplying = true;
    clearTimeout(queueRebuild.timer);
    try {
      if (!mapState.fontRecords.has(patch.fontId)) throw Error('Presentation font is unavailable');
      if (!patch.extrusionEnabled || patch.fit) window.GeoGlyph3D?.stopOrbit();
      if (options.opening) Object.assign(mapState, { orientationMode:'fixed', relativeSize:100, bearing:0,
        tracking:0, lineHeight:1.15, quality:10, fill:'#31A765', outline:'#FFFFFF', outlineWidth:2,
        opacity:.82, extrusionTilt:90, extrusionSolid:true });
      Object.assign(mapState, { mode:'arcgis', message:patch.message, arcgisMessage:patch.message, nativeColor:patch.nativeColor,
        selectedFontId:patch.fontId, extrusionEnabled:patch.extrusionEnabled });
      if (patch.animation) mapState.orientationMode = patch.animation;
      if (patch.fill) mapState.fill = patch.fill;
      if (patch.height !== undefined) mapState.baseHeightMeters = patch.height;
      if (patch.depth !== undefined) mapState.extrusionDepthMeters = patch.depth;
      if (patch.anchor) { mapState.anchor = { ...patch.anchor }; mapState.anchorInitialised = true; mapState.anchorPinned = false; updateAnchorStats(); }
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
      const fitting = !options.suppressFit && !mapState.conferenceOverview && Boolean(patch.fit || patch.hasNewContent || patch.random || first);
      if (fitting) {
        await fitDrawnGeometry(current,{explicit:Boolean(patch.fit),orbit:Boolean(patch.animation)});
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

  function cancelConferenceWork() {
    cancelRandomSearch();
    conferenceApplyOwner = null;
    ++mapState.fontChoiceVersion;
    // Cancelled async work must not own a later draw or its cleanup.
    activeBuildToken = ++mapState.buildToken;
    mapState.rebuilding = false;
    mapState.conferenceApplying = false;
    mapState.conferenceRebuildPending = false;
    mapState.pendingBuild = mapState.pendingFit = mapState.explicitFitPending = false;
    clearTimeout(queueRebuild.timer);
    window.GeoGlyph3D?.stopOrbit();
    mapState.map?.stop();
  }

  function showConferenceOverview() {
    mapState.conferenceOverview = true;
    const map = mapState.map;
    if (!map) return false;
    window.GeoGlyph3D?.stopOrbit();
    map.stop();
    map.setCenterClampedToGround(true);
    const canvas = map.getCanvas();
    const panelWidth = $('geoglyphMapEditor')?.getBoundingClientRect().right || 0;
    const padding = { top:48, bottom:48, right:48, left:Math.max(48, Math.min(panelWidth+24, canvas.clientWidth*.4)) };
    const camera = map.cameraForBounds(AUSTRALIA_BOUNDS, { padding, bearing:0, pitch:0 });
    if (!camera) return false;
    map.jumpTo({ ...camera, bearing:0, pitch:0, elevation:0 });
    return true;
  }

  function drawConferenceOpening(fontId, options = {}) {
    return applyConferenceCue({ fontId, objectId:options.objectId, message:'😴', nativeColor:true,
      extrusionEnabled:false, height:300, depth:30, ...(options.resetAnchor ? { anchor:{...DEFAULT_ANCHOR} } : {})
    }, { ...options, opening:true, suppressFit:true });
  }

  function shouldPreferDecal(record, text) { return Boolean(record?.hasColor)|| /[\u0590-\u0FFF\u1780-\u17FF\u200D\uFE0F]/u.test(text); }

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
    const lines=String(text).replace(/\r\n?/g,'\n').split('\n');
    const cssHeight=options.screenHeight ?? groundPixelsPerMeter()*mapState.baseHeightMeters*mapState.relativeSize/100;
    const base=mapState.mode==='glyph'?900:420;
    const desired=cssHeight*(window.devicePixelRatio||1)*Math.min(2,Math.max(1,mapState.quality/12));
    const multiplier=Math.max(1,Math.min(4,Math.pow(2,Math.ceil(Math.log2(Math.max(1,desired/(base*lines.length)))))));
    const fontPx=base*multiplier;
    const key=JSON.stringify([record.fontResourceKey||record.id||record.name,record.cssFamily,record.style,text,mapState.mode,mapState.tracking,mapState.lineHeight,fontPx]);
    let saved=cache.get(key);
    if(!saved) {
      const probe=document.createElement('canvas'),pctx=probe.getContext('2d');if(!pctx)return null;
      const style=record.style||'',font=(record.exactFace?'':(/italic|oblique/i.test(style)?'italic ':''))+fontPx+'px '+cssFontFamily(record);
      pctx.font=font.replace(fontPx+'px','1000px');pctx.textBaseline='alphabetic';
      const tracking=mapState.mode==='glyph'?0:fontPx*mapState.tracking/100;
      if('letterSpacing' in pctx)pctx.letterSpacing=(tracking*1000/fontPx)+'px';
      const metrics=lines.map(line=>{const m=pctx.measureText(line||' '),ratio=fontPx/1000;return Object.fromEntries(['width','actualBoundingBoxLeft','actualBoundingBoxRight','actualBoundingBoxAscent','actualBoundingBoxDescent'].map(key=>[key,m[key]*ratio]));});
      const ascent=Math.max(1,...metrics.map(m=>m.actualBoundingBoxAscent||fontPx*.8));
      const descent=Math.max(0,...metrics.map(m=>m.actualBoundingBoxDescent||0));
      const advance=fontPx*(mapState.mode==='glyph'?1:mapState.lineHeight);
      const inkHeight=Math.max(1,ascent+descent+(lines.length-1)*advance);
      const maxWidth=Math.max(fontPx*.2,...metrics.map(m=>Math.max(m.width,(m.actualBoundingBoxLeft||0)+(m.actualBoundingBoxRight||0))));
      const pad=Math.ceil(Math.max(48,fontPx*.12));
      const rawWidth=maxWidth+pad*2,rawHeight=inkHeight+pad*2;
      const scale=Math.min(1,4096/Math.max(rawWidth,rawHeight),Math.sqrt(4*1024*1024/(rawWidth*rawHeight)));
      const mask=document.createElement('canvas');mask.width=Math.max(1,Math.floor(rawWidth*scale));mask.height=Math.max(1,Math.floor(rawHeight*scale));
      const ctx=mask.getContext('2d');ctx.scale(scale,scale);ctx.font=font;ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.fillStyle='#000000';
      if('letterSpacing' in ctx)ctx.letterSpacing=tracking+'px';
      let y=mask.height/(2*scale)-inkHeight/2+ascent;
      lines.forEach((line,i)=>{const m=metrics[i],offset=((m.actualBoundingBoxLeft||0)-(m.actualBoundingBoxRight||m.width))/2;ctx.fillText(line||' ',mask.width/(2*scale)+offset,y);y+=advance;});
      saved={mask,inkHeight:inkHeight*scale};cache.set(key,saved);
    }
    cache.delete(key);cache.set(key,saved);
    const result=options.measureOnly ? { canvas:saved.mask, inkHeight:saved.inkHeight } : colourGroundMask(saved,options,cssHeight);
    let bytes=[...cache.values()].reduce((sum,item)=>sum+item.mask.width*item.mask.height*4*(item.outlineMask?2:1),0);
    while((cache.size>8||bytes>32*1024*1024)&&cache.size>1){const [old,item]=cache.entries().next().value;cache.delete(old);bytes-=item.mask.width*item.mask.height*4*(item.outlineMask?2:1);}
    result.resolutionLimited=cssHeight>0&&saved.inkHeight<cssHeight*(window.devicePixelRatio||1)*.9;
    result.samplingHeightPx=cssHeight;
    return result;
  }

  function colourGroundMask(saved,options,cssHeight) {
    const {mask,inkHeight}=saved;
    const canvas=document.createElement('canvas');canvas.width=mask.width;canvas.height=mask.height;
    const out=canvas.getContext('2d');out.drawImage(mask,0,0);
    if(!options.nativeColor){out.globalCompositeOperation='source-in';out.fillStyle=mapState.fill;out.fillRect(0,0,canvas.width,canvas.height);out.globalCompositeOperation='source-over';}
    const ratio=cssHeight>0?inkHeight/cssHeight:1;
    const radius=Math.max(0,Math.round(mapState.outlineWidth*ratio*2)/4);
    if(radius>0) {
      if(!saved.outlineMask||saved.outlineRadius!==radius) {
        const outer=document.createElement('canvas'),inner=document.createElement('canvas');
        outer.width=inner.width=mask.width;outer.height=inner.height=mask.height;
        const oc=outer.getContext('2d'),ic=inner.getContext('2d');oc.drawImage(mask,0,0);ic.drawImage(mask,0,0);ic.globalCompositeOperation='destination-in';
        const steps=Math.max(8,Math.min(64,Math.ceil(radius*Math.PI*2)));
        for(let i=0;i<steps;i++){const angle=i*Math.PI*2/steps,x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;oc.drawImage(mask,x,y);ic.drawImage(mask,x,y);}
        oc.globalCompositeOperation='destination-out';oc.drawImage(inner,0,0);
        saved.outlineMask=outer;saved.outlineRadius=radius;
      }
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
    ctx.drawImage(decal.canvas, 0, 0);

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


  function projectPolygons(polygons, bounds, scaleMeters, bearingDegrees, anchor) {
    const maplibregl = window.maplibregl;
    const origin = maplibregl.MercatorCoordinate.fromLngLat([anchor.lng, anchor.lat], 0);
    const unitsPerMeter = origin.meterInMercatorCoordinateUnits();
    const radians = bearingDegrees * Math.PI / 180;
    const cos = Math.cos(radians), sin = Math.sin(radians);

    return polygons.map(polygon => polygon.map(ring => ring.map(([x, y]) => {
      const localEast = (x - bounds.cx) * scaleMeters;
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
    })));
  }

  function requestFit() {
    cancelInitialFit();window.GeoGlyph3D?.stopOrbit();
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
    if (fc?.features?.length) walkCoordinates(fc.features[0].geometry.coordinates, coords);
    else if (mapState.lastDecal?.coordinates?.length) walkCoordinates(mapState.lastDecal.coordinates, coords);
    if (!coords.length) return false;
    const target = groundFramingTarget(coords);
    if (!target) return false;
    map.stop();map.setCenterClampedToGround(true);map.jumpTo({elevation:0});
    map[options.fly ? 'flyTo' : 'easeTo']({
      center: target.center,
      zoom: Math.max(map.getMinZoom(), target.zoom),
      bearing: mapState.bearing,
      pitch: 0,
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:(options.duration ?? 650),
      essential: true
    });
    return true;
  }

  function groundFramingTarget(coords) {
    const map = mapState.map;
    if (!map || !coords.length) return null;
    const bounds = new window.maplibregl.LngLatBounds(coords[0], coords[0]);
    coords.slice(1).forEach(coord => bounds.extend(coord));
    const canvas = map.getCanvas();
    const padding = window.GeoGlyphGroundTransform.framingPadding(canvas.clientWidth,canvas.clientHeight);
    const target = map.cameraForBounds(bounds, { padding, maxZoom:18, bearing:mapState.bearing, pitch:0 });
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

  function exportGeoJSON() {
    let exportData = mapState.lastGeoJSON;
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
      refreshFonts: refreshFontStore,
    prepareConferenceFont,
      applyConferenceCue,
      cancelConferenceWork,
      showConferenceOverview,
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
      getGeoJSON: () => mapState.lastGeoJSON,
      scanSystemFonts,
      loadEsriFonts,
      showMap: showMapPreview,
      showCanvas: showCanvasPreview,
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
    if (!$("mapCanvasToggleBtn") || !$("geoglyphMapWorkspace")) return false;
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

