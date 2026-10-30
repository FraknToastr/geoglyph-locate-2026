
(() => {
  "use strict";

  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    if (!api) return;
    const state = api.state;
    const $ = id => document.getElementById(id);
    const workspace = document.querySelector(".workspace");
    const header = document.querySelector(".app-header");
    const headerActions = document.querySelector(".header-actions");
    const middle = document.querySelector(".middle-column");
    const controls = document.querySelector(".right-panel");
    const exportPanel = document.querySelector(".export-panel");
    const qreverse = $("qreverseWorkspace");
    const drawer = $("explorerDrawer");
    const drawerBody = drawer?.querySelector(".drawer-body");
    const fontPanel = document.querySelector(".font-panel");
    if (!workspace || !header || !middle || !controls || !exportPanel || !qreverse || !drawerBody || !fontPanel) return;

    document.title=GeoGlyphVersion.title;

    // Stable two-pane work area.
    const left = document.createElement("section");
    left.className = "left-workspace";
    left.setAttribute("aria-label", "Contextual workspace");
    workspace.insertBefore(left, middle);
    left.append(controls, exportPanel, qreverse);
    workspace.append(middle);

    // One complete Font Explorer drawer: font list, Unicode controls and glyph grid.
    drawer.querySelector(".panel-title").textContent = "Font Explorer";
    drawer.querySelector("#closeDrawerBtn")?.setAttribute("title", "Close Font Explorer");
    fontPanel.querySelector(".panel-title").textContent = "Fonts";
    drawerBody.insertBefore(fontPanel, drawerBody.firstChild);
    const oldOpenDrawer = $("openDrawerBtn");
    if (oldOpenDrawer) oldOpenDrawer.hidden = true;

    // Primary workflow navigation. Combined remains only as the internal QR-with-logo renderer.
    const workflowNav = document.createElement("nav");
    workflowNav.className = "workflow-nav";
    workflowNav.setAttribute("aria-label", "GeoGlyph workflows");
    workflowNav.innerHTML = `
      <button class="square-btn" data-workflow="symbol" type="button">Symbol</button>
      <button class="square-btn" id="mapCanvasToggleBtn" type="button" aria-pressed="false" title="Show map preview">Map</button>
      <button class="square-btn" data-workflow="qr" type="button">QR</button>
      <button class="square-btn" data-workflow="qreverse" type="button">Scan QRs</button>
      <button class="square-btn" data-workflow="magic-eye" type="button">Magic Eye</button>`;
    header.insertBefore(workflowNav, headerActions);

    const fontButton = document.createElement("button");
    fontButton.className = "square-btn header-font-btn";
    fontButton.type = "button";
    fontButton.textContent = "Font";
    fontButton.title = "Open Font Explorer";
    headerActions.insertBefore(fontButton, headerActions.firstChild);
    fontButton.addEventListener("click", () => oldOpenDrawer?.click());

    const exportButton = document.createElement("button");
    exportButton.className = "square-btn header-export-btn";
    exportButton.type = "button";
    exportButton.textContent = "Export";
    headerActions.insertBefore(exportButton, headerActions.firstChild);
    const exportClose = document.createElement("button");
    exportClose.className = "icon-btn export-close-btn";
    exportClose.type = "button";
    exportClose.textContent = "×";
    exportClose.setAttribute("aria-label", "Close export options");
    exportPanel.querySelector(".panel-head")?.append(exportClose);
    const setExportOpen = open => {
      exportPanel.classList.toggle("is-open", Boolean(open));
      exportButton.classList.toggle("is-active", Boolean(open));
      exportButton.setAttribute("aria-pressed", String(Boolean(open)));
    };
    exportButton.addEventListener("click", () => setExportOpen(!exportPanel.classList.contains("is-open")));
    exportClose.addEventListener("click", () => setExportOpen(false));
    exportPanel.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setExportOpen(false);
      exportButton.focus();
    });

    // Clear QR logo source selector.
    const logoLoadLabel = document.querySelector('label[for="logoInput"]');
    const logoUse = $("useSymbolLogoBtn");
    const logoClear = $("clearLogoBtn");
    const legacyLogoRow = logoLoadLabel?.closest(".control-row");
    if (legacyLogoRow && logoUse && logoClear && logoLoadLabel) {
      legacyLogoRow.id = "legacyLogoRow";
      const logoModeBar = document.createElement("div");
      logoModeBar.id = "logoModeBar";
      logoModeBar.innerHTML = `
        <button class="square-btn" data-logo-choice="none" type="button">None</button>
        <button class="square-btn" data-logo-choice="symbol" type="button">Font symbol</button>
        <button class="square-btn" data-logo-choice="image" type="button">Image</button>`;
      const row = document.createElement("div");
      row.className = "control-row";
      row.innerHTML = '<span class="control-label">Logo</span>';
      row.append(logoModeBar);
      legacyLogoRow.before(row);
      logoModeBar.addEventListener("click", event => {
        const choice = event.target.closest("[data-logo-choice]")?.dataset.logoChoice;
        if (choice === "none") logoClear.click();
        else if (choice === "symbol") logoUse.click();
        else if (choice === "image") $("logoInput")?.click();
        window.setTimeout(syncLogoChoice, 0);
      });
    }

    // Preview header Source / Output switch for Scan QRs.
    const previewHead = document.querySelector(".preview-panel-head");
    const previewTools = document.createElement("div");
    previewTools.className = "preview-mode-tools";
    previewTools.innerHTML = `
      <button class="square-btn is-active" data-qreverse-preview="source" type="button">Source</button>
      <button class="square-btn" data-qreverse-preview="output" type="button">Output</button>`;
    previewHead.append(previewTools);
    const sourceLayer = document.createElement("div");
    sourceLayer.className = "preview-source-layer";
    sourceLayer.innerHTML = '<div class="preview-source-message">Select a queued image or result.</div>';
    $("previewStage").append(sourceLayer);

    let qreversePreviewMode = "source";
    let selectedQReverseId = null;
    let sourceObjectUrl = "";
    let outputRefreshTimer = 0;

    const originalPreviewButtons = Object.fromEntries(
      [...document.querySelectorAll(".preview-tabs [data-preview]")].map(button => [button.dataset.preview, button])
    );

    function modeFromState() {
      if (state.preview === "symbol") return "symbol";
      if (state.preview === "qreverse") return "qreverse";
      if (state.preview === "magic-eye") return "magic-eye";
      return "qr";
    }

    function switchWorkflow(mode) {
      setExportOpen(false);
      if (mode === "symbol") originalPreviewButtons.symbol?.click();
      else if (mode === "qr") originalPreviewButtons.combined?.click();
      else if (mode === "qreverse") originalPreviewButtons.qreverse?.click();
      else if (mode === "magic-eye") originalPreviewButtons["magic-eye"]?.click();
      window.setTimeout(() => updateModeUI(modeFromState()), 0);
    }

    workflowNav.addEventListener("click", event => {
      const mode = event.target.closest("[data-workflow]")?.dataset.workflow;
      if (mode) switchWorkflow(mode);
    });

    function updateModeUI(mode = modeFromState()) {
      document.body.dataset.workflow = mode;
      workflowNav.querySelectorAll("[data-workflow]").forEach(button => {
        const active = button.dataset.workflow === mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      const title = controls.querySelector(".panel-title");
      if (title) title.textContent = mode === "symbol" ? "Symbol controls" : mode === "magic-eye" ? "Magic Eye controls" : "QR controls";
      exportButton.hidden = mode === "qreverse";
      if (mode !== "qreverse") sourceLayer.classList.remove("is-visible");
      else {
        qreversePreviewMode = "source";
        syncPreviewToggle();
        ensureQReverseSelection();
        updateQReversePreview();
      }
      syncLogoChoice();
    }

    function syncLogoChoice() {
      document.querySelectorAll("[data-logo-choice]").forEach(button => {
        const active = button.dataset.logoChoice === state.logoMode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    // Compact QReverse action bars. Existing buttons remain the single source of logic.
    const qControls = qreverse.querySelector(".qreverse-controls");
    const primary = document.createElement("div");
    primary.className = "qreverse-primary";
    primary.innerHTML = `
      <details class="qreverse-menu qreverse-add-menu">
        <summary class="square-btn">Add images ▾</summary>
        <div class="qreverse-menu-popover">
          <button class="square-btn" data-q-add="images" type="button">Image files</button>
          <button class="square-btn" data-q-add="folder" type="button">Image folder</button>
        </div>
      </details>
      <button class="square-btn" id="v151ImportCsv" type="button" title="Import a single-column CSV; each non-empty row becomes one batch QR value">Import CSV values</button>
      <button class="square-btn" id="v152PasteValues" type="button" title="Paste one QR value per line for batch generation">Paste QR values</button>
      <button class="square-btn is-active" id="v15ScanQueued" type="button">Scan queued</button>
      <span class="qreverse-spacer"></span>
      <span class="small-status" id="v15QueueHint">Import files to begin</span>`;
    const secondary = document.createElement("div");
    secondary.className = "qreverse-secondary";
    secondary.innerHTML = `
      <button class="square-btn" id="v15ExportCsv" type="button">Export CSV</button>
      <button class="square-btn" id="v15DesignQr" type="button">Design QR</button>
      <details class="qreverse-menu qreverse-generate-menu">
        <summary class="square-btn is-active">Generate QRs ▾</summary>
        <div class="qreverse-menu-popover">
          <button class="square-btn" data-q-generate="download" type="button">ZIP to Downloads</button>
          <button class="square-btn" data-q-generate="files" type="button">Individual files to folder</button>
          <button class="square-btn" data-q-generate="zip-folder" type="button">ZIP to folder</button>
        </div>
      </details>
      <span class="qreverse-spacer"></span>
      <button class="square-btn" id="v15ResetRows" type="button" title="Reset selected processed rows to queued">Reset selected</button>`;
    qControls.prepend(secondary);
    qControls.prepend(primary);

    const pasteModal = document.createElement("div");
    pasteModal.className = "modal-backdrop";
    pasteModal.id = "pasteValuesModal";
    pasteModal.hidden = true;
    pasteModal.innerHTML = `
      <section aria-labelledby="pasteValuesTitle" aria-modal="true" class="paste-values-dialog" role="dialog">
        <header class="about-head">
          <h2 id="pasteValuesTitle">Paste QR values</h2>
          <span class="spacer"></span>
          <button aria-label="Close pasted values window" class="icon-btn" id="closePasteValues" type="button">×</button>
        </header>
        <div class="paste-values-body">
          <p class="paste-values-instructions">Paste one value per line. Every non-empty line becomes a separate selected batch QR row. Duplicate values are retained.</p>
          <textarea aria-describedby="pasteValuesCount" class="textarea paste-values-textarea" id="pasteValuesInput" placeholder="https://example.com/first&#10;https://example.com/second&#10;Asset 49382" spellcheck="false"></textarea>
          <div class="paste-values-meta">
            <span class="small-status" id="pasteValuesCount">0 values</span>
            <span class="paste-values-example">Blank lines are ignored; leading and trailing whitespace is removed.</span>
          </div>
        </div>
        <footer class="paste-values-footer">
          <button class="square-btn" id="clearPasteValues" type="button">Clear</button>
          <span class="spacer"></span>
          <button class="square-btn" id="cancelPasteValues" type="button">Cancel</button>
          <button class="square-btn is-active" disabled id="importPasteValues" type="button">Add to batch</button>
        </footer>
      </section>`;
    document.body.append(pasteModal);

    const pasteInput = $("pasteValuesInput");
    const pasteCount = $("pasteValuesCount");
    const pasteImport = $("importPasteValues");
    const parsePastedValues = () => String(pasteInput.value || "")
      .split(/\r?\n/)
      .map(value => value.trim())
      .filter(Boolean);
    const syncPasteValues = () => {
      const count = parsePastedValues().length;
      pasteCount.textContent = `${count} value${count === 1 ? "" : "s"}`;
      pasteImport.disabled = count === 0;
    };
    const openPasteValues = () => {
      pasteModal.hidden = false;
      document.body.classList.add("modal-open");
      syncPasteValues();
      window.setTimeout(() => pasteInput.focus(), 0);
    };
    const closePasteValues = (restoreFocus = true) => {
      if (pasteModal.hidden) return;
      pasteModal.hidden = true;
      document.body.classList.remove("modal-open");
      if (restoreFocus) $("v152PasteValues")?.focus();
    };
    const importPastedValues = () => {
      const values = parsePastedValues();
      if (!values.length) return;
      const batchId = `paste-${Date.now()}`;
      values.forEach(value => state.qreverse.rows.push({
        id: state.qreverse.nextId++,
        groupId: batchId,
        source: "Pasted",
        value,
        selected: true,
        status: "Processed",
        error: "",
        filename: "Pasted values",
        path: "Pasted values",
        size: 0,
        lastModified: Date.now(),
        file: null
      }));
      pasteInput.value = "";
      syncPasteValues();
      api.renderQReverse();
      closePasteValues();
      api.showToast(`${values.length} pasted value${values.length === 1 ? "" : "s"} added`);
    };

    $("v152PasteValues").addEventListener("click", openPasteValues);
    pasteInput.addEventListener("input", syncPasteValues);
    $("closePasteValues").addEventListener("click", () => closePasteValues());
    $("cancelPasteValues").addEventListener("click", () => closePasteValues());
    $("clearPasteValues").addEventListener("click", () => { pasteInput.value = ""; syncPasteValues(); pasteInput.focus(); });
    pasteImport.addEventListener("click", importPastedValues);
    pasteModal.addEventListener("click", event => { if (event.target === pasteModal) closePasteValues(); });
    pasteModal.addEventListener("keydown", event => {
      if (event.key === "Escape") { event.preventDefault(); closePasteValues(); }
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && !pasteImport.disabled) { event.preventDefault(); importPastedValues(); }
    });

    primary.addEventListener("click", event => {
      const add = event.target.closest("[data-q-add]")?.dataset.qAdd;
      if (add === "images") $("qreverseImportImagesBtn").click();
      else if (add === "folder") $("qreverseImportFolderBtn").click();
      else if (add === "csv") $("qreverseImportCsvBtn").click();
      if (add) primary.querySelector("details")?.removeAttribute("open");
    });
    $("v151ImportCsv").addEventListener("click", () => $("qreverseImportCsvBtn").click());
    $("v15ScanQueued").addEventListener("click", () => $("qreverseScanBtn").click());
    $("v15ExportCsv").addEventListener("click", () => $("qreverseExportCsvBtn").click());
    $("v15DesignQr").addEventListener("click", () => $("qreverseDesignBtn").click());
    $("v15ResetRows").addEventListener("click", () => $("qreverseResetBtn").click());
    secondary.addEventListener("click", event => {
      const destination = event.target.closest("[data-q-generate]")?.dataset.qGenerate;
      if (destination === "download") $("qreverseBatchDownloadBtn").click();
      else if (destination === "files") $("qreverseBatchFolderBtn").click();
      else if (destination === "zip-folder") $("qreverseBatchZipFolderBtn").click();
      if (destination) secondary.querySelector("details")?.removeAttribute("open");
    });

    const resultsPanel = qreverse.querySelectorAll(":scope > .metal-panel")[1];
    const detail = document.createElement("section");
    detail.className = "qreverse-detail";
    detail.setAttribute("aria-label", "Selected queue item details");
    resultsPanel.append(detail);

    function currentQReverseRow() {
      return state.qreverse.rows.find(row => row.id === selectedQReverseId) || null;
    }

    function ensureQReverseSelection() {
      if (!state.qreverse.rows.some(row => row.id === selectedQReverseId)) selectedQReverseId = state.qreverse.rows[0]?.id ?? null;
      [...$("qreverseBody").querySelectorAll("tr")].forEach(rowElement => {
        const id = Number(rowElement.querySelector("[data-qreverse-id]")?.dataset.qreverseId);
        rowElement.classList.toggle("is-current", id === selectedQReverseId);
      });
      updateQReverseDetail();
    }

    function updateQReverseDetail() {
      const row = currentQReverseRow();
      if (!row) {
        detail.innerHTML = '<div class="v15-section-note">Select a queue item to inspect its source, status and output.</div>';
        return;
      }
      const value = row.value || row.error || (row.status === "Queued" ? "Awaiting scan" : "—");
      detail.innerHTML = `
        <div class="qreverse-detail-grid">
          <span class="qreverse-detail-label">Value</span><span class="qreverse-detail-value">${escapeHtml(value)}</span>
          <span class="qreverse-detail-label">Source</span><span class="qreverse-detail-value">${escapeHtml(row.source)}</span>
          <span class="qreverse-detail-label">Status</span><span class="qreverse-detail-value">${escapeHtml(row.status)}</span>
          <span class="qreverse-detail-label">File</span><span class="qreverse-detail-value">${escapeHtml(row.path || row.filename || "—")}</span>
        </div>`;
    }
    document.addEventListener('geoglyph:qreverse-reset', event => {
      if (event.detail?.module) {
        selectedQReverseId = null;
        qreversePreviewMode = 'source';
        pasteInput.value = '';
        syncPasteValues();
        qreverse.querySelectorAll('details[open]').forEach(menu => menu.removeAttribute('open'));
      }
      clearSourceObjectUrl();
      ensureQReverseSelection();
      updateQReversePreview();
    });

    $("qreverseBody").addEventListener("click", event => {
      if (event.target.closest('input[type="checkbox"]')) return;
      const rowElement = event.target.closest("tr");
      const id = Number(rowElement?.querySelector("[data-qreverse-id]")?.dataset.qreverseId);
      if (!Number.isFinite(id)) return;
      selectedQReverseId = id;
      ensureQReverseSelection();
      updateQReversePreview();
    });

    function syncPreviewToggle() {
      previewTools.querySelectorAll("[data-qreverse-preview]").forEach(button => {
        const active = button.dataset.qreversePreview === qreversePreviewMode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    previewTools.addEventListener("click", event => {
      const mode = event.target.closest("[data-qreverse-preview]")?.dataset.qreversePreview;
      if (!mode) return;
      qreversePreviewMode = mode;
      syncPreviewToggle();
      updateQReversePreview();
    });

    function clearSourceObjectUrl() {
      if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
      sourceObjectUrl = "";
    }

    async function updateQReversePreview() {
      if (document.body.dataset.workflow !== "qreverse") return;
      const row = currentQReverseRow();
      if (qreversePreviewMode === "source") {
        clearTimeout(outputRefreshTimer);
        clearSourceObjectUrl();
        sourceLayer.classList.add("is-visible");
        if (row?.source === "Image" && row.file) {
          sourceObjectUrl = URL.createObjectURL(row.file);
          sourceLayer.innerHTML = `<img alt="${escapeAttr(row.filename || "Selected QR source image")}" src="${sourceObjectUrl}">`;
        } else if (row?.source === "Image") {
          sourceLayer.innerHTML = '<div class="preview-source-message">The saved image row needs reattachment before its source can be previewed.</div>';
        } else if (["CSV", "Pasted"].includes(row?.source)) {
          const sourceName = row.source === "Pasted" ? "Pasted values" : "CSV values";
          sourceLayer.innerHTML = `<div class="preview-source-message">${sourceName} have no source image. Switch to Output to preview the generated QR.</div>`;
        } else {
          sourceLayer.innerHTML = '<div class="preview-source-message">Select a queued image or result.</div>';
        }
        return;
      }
      clearSourceObjectUrl();
      sourceLayer.classList.remove("is-visible");
      if (!row?.value) {
        sourceLayer.classList.add("is-visible");
        sourceLayer.innerHTML = '<div class="preview-source-message">This row does not yet contain a QR value.</div>';
        return;
      }
      const input = $("qrInput");
      const original = input.value;
      input.value = row.value;
      await api.renderPreview();
      input.value = original;
    }

    function scheduleOutputRefresh() {
      if (document.body.dataset.workflow !== "qreverse" || qreversePreviewMode !== "output") return;
      clearTimeout(outputRefreshTimer);
      outputRefreshTimer = window.setTimeout(updateQReversePreview, 40);
    }

    function syncQReverseButtons() {
      const map = [
        ["v15ScanQueued", "qreverseScanBtn"],
        ["v15ExportCsv", "qreverseExportCsvBtn"],
        ["v15DesignQr", "qreverseDesignBtn"],
        ["v15ResetRows", "qreverseResetBtn"]
      ];
      map.forEach(([target, source]) => { if ($(target) && $(source)) $(target).disabled = $(source).disabled; });
      const generateDisabled = $("qreverseBatchDownloadBtn").disabled;
      secondary.querySelector(".qreverse-generate-menu summary").classList.toggle("inactive-control", generateDisabled);
      secondary.querySelectorAll("[data-q-generate]").forEach(button => button.disabled = generateDisabled);
      primary.querySelector(".qreverse-add-menu summary").classList.toggle("inactive-control", $("qreverseImportImagesBtn").disabled);
      $("v152PasteValues").disabled = $("qreverseImportCsvBtn").disabled;
      $("v15QueueHint").textContent = $("qreverseSummary").textContent;
    }

    const qObserver = new MutationObserver(() => {
      ensureQReverseSelection();
      syncQReverseButtons();
      if (document.body.dataset.workflow === "qreverse") updateQReversePreview();
    });
    qObserver.observe($("qreverseBody"), { childList: true, subtree: true });
    ["qreverseScanBtn","qreverseExportCsvBtn","qreverseDesignBtn","qreverseResetBtn","qreverseBatchDownloadBtn","qreverseImportImagesBtn"].forEach(id => {
      const node = $(id); if (node) qObserver.observe(node, { attributes: true, attributeFilter: ["disabled"] });
    });

    // Keep workflow and logo controls synchronized after the original renderer runs.
    const previewObserver = new MutationObserver(() => updateModeUI(modeFromState()));
    Object.values(originalPreviewButtons).filter(Boolean).forEach(button => previewObserver.observe(button, { attributes: true, attributeFilter: ["class","aria-pressed"] }));
    [logoUse, logoClear, $("logoInput")].filter(Boolean).forEach(node => node.addEventListener("change", () => window.setTimeout(syncLogoChoice, 0)));
    logoUse?.addEventListener("click", () => window.setTimeout(syncLogoChoice, 0));
    logoClear?.addEventListener("click", () => window.setTimeout(syncLogoChoice, 0));

    // v16.5: Font Explorer persists until the user explicitly closes it.

    // Changes to QR styling redraw the selected QReverse output when Output is active.
    controls.addEventListener("input", scheduleOutputRefresh);
    controls.addEventListener("click", event => {
      if (event.target.closest("button,label")) window.setTimeout(scheduleOutputRefresh, 0);
    });

    document.addEventListener("click", event => {
      document.querySelectorAll(".qreverse-menu[open]").forEach(menu => {
        if (!menu.contains(event.target)) menu.removeAttribute("open");
      });
    });

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
    }
    function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }

    syncQReverseButtons();
    ensureQReverseSelection();
    updateModeUI(modeFromState());
  });
})();
