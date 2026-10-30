
(() => {
  "use strict";
  const FIXED_MAGIC_EYE_DATA_URL = "data:image/png;base64,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";

  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    if (!api) return;
    const state = api.state;
    const $ = id => document.getElementById(id);

    document.title=GeoGlyphVersion.title;

    const workflowNav = document.querySelector(".workflow-nav");
    const fontButton = document.querySelector(".header-font-btn");
    const exportButton = document.querySelector(".header-export-btn");
    const previewHead = document.querySelector(".preview-panel-head");
    const previewTitle = previewHead?.querySelector(".panel-title");
    const middle = document.querySelector(".middle-column");
    const exportPanel = document.querySelector(".export-panel");
    const drawer = $("explorerDrawer");
    const drawerBody = drawer?.querySelector(".drawer-body");
    const drawerOptions = drawer?.querySelector(".drawer-options");
    const glyphWorkspace = drawer?.querySelector(".glyph-workspace");
    const glyphToolbar = drawer?.querySelector(".glyph-toolbar");
    const oldOpenDrawer = $("openDrawerBtn");
    const magicEyeButton = $("magicEyeBtn");
    const magicEyeInput = $("magicEyeInput");
    const sharedColourModule = $("sharedColourModule");
    const qreverseCsvInput = $("qreverseCsvInput");
    const oldCsvButton = $("v151ImportCsv");
    const qreversePrimary = document.querySelector(".qreverse-primary");

    /* Put Font Explorer first in the centred workflow strip. */
    if (workflowNav && fontButton) {
      fontButton.textContent = "Font Explorer";
      fontButton.title = "Open Font Explorer and preview symbols";
      fontButton.classList.add("workflow-font-btn");
      workflowNav.insertBefore(fontButton, workflowNav.firstChild);
      fontButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const isOpen = document.body.classList.contains("drawer-open");
        if (isOpen) {
          $("closeDrawerBtn")?.click();
          return;
        }
        state.preview = "symbol";
        api.syncControlsFromState();
        api.renderPreview();
        oldOpenDrawer?.click();
      }, true);
    }

    /* The Preview header is the natural home for Export. */
    if (previewHead && exportButton) previewHead.append(exportButton);
    if (middle && exportPanel) middle.append(exportPanel);

    /* Use the main Preview as the Font Explorer symbol preview. */
    if (drawerOptions && glyphWorkspace && glyphToolbar) {
      drawerOptions.classList.add("font-explorer-controls");
      glyphWorkspace.insertBefore(drawerOptions, glyphToolbar);
      const internalPreview = [...drawerOptions.querySelectorAll(".option-block")]
        .find(block => block.querySelector(".option-title")?.textContent.trim() === "Character preview");
      internalPreview?.classList.add("font-internal-preview-disabled");
    }

    function workflowMode() {
      return document.body.dataset.workflow || (state.preview === "symbol" ? "symbol" : state.preview === "magic-eye" ? "magic-eye" : state.preview === "qreverse" ? "qreverse" : "qr");
    }

    function syncContextLabels() {
      const mode = workflowMode();
      if (previewTitle) {
        previewTitle.textContent = mode === "symbol" ? "Symbol Preview" : mode === "magic-eye" ? "Magic Eye Preview" : mode === "qreverse" ? "Scan Preview" : "QR Preview";
      }
      const moduleLabel = sharedColourModule?.querySelector(".module-collapse-btn span:last-child");
      if (moduleLabel) {
        moduleLabel.textContent = "Palette & Gradient";
      }
      if (["qr", "magic-eye"].includes(mode) && sharedColourModule) {
        sharedColourModule.hidden = false;
      }
    }

    new MutationObserver(syncContextLabels).observe(document.body, { attributes: true, attributeFilter: ["data-workflow"] });

    /* Magic Eye now uses the supplied embedded PNG and never opens a file picker. */
    state.magicEyeDataUrl = FIXED_MAGIC_EYE_DATA_URL;
    state.magicEyeName = "magic_eye_qr_large.png";
    state.magicEyeImage = null;
    if (magicEyeInput) magicEyeInput.disabled = true;
    if (magicEyeButton) {
      magicEyeButton.title = "Open Magic Eye using the embedded PNG artwork";
      magicEyeButton.addEventListener("click", async event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        state.magicEyeDataUrl = FIXED_MAGIC_EYE_DATA_URL;
        state.magicEyeName = "magic_eye_qr_large.png";
        state.magicEyeImage = null;
        state.preview = "magic-eye";
        api.syncControlsFromState();
        await api.renderPreview();
        syncContextLabels();
      }, true);
    }

    /* Replace ambiguous CSV import with explicit Header / No Header choices. */
    let csvHasHeader = false;
    let csvMenu = null;
    if (qreversePrimary && oldCsvButton && qreverseCsvInput) {
      csvMenu = document.createElement("details");
      csvMenu.className = "qreverse-menu csv-import-menu";
      csvMenu.innerHTML = `
        <summary class="square-btn">Import CSV ▾</summary>
        <div class="qreverse-menu-popover">
          <button class="square-btn" data-csv-header="yes" type="button">CSV with header</button>
          <button class="square-btn" data-csv-header="no" type="button">CSV with no header</button>
        </div>`;
      oldCsvButton.before(csvMenu);
      oldCsvButton.hidden = true;
      csvMenu.addEventListener("click", event => {
        const choice = event.target.closest("[data-csv-header]")?.dataset.csvHeader;
        if (!choice) return;
        csvHasHeader = choice === "yes";
        qreverseCsvInput.value = "";
        qreverseCsvInput.click();
        csvMenu.removeAttribute("open");
      });

      const syncCsvDisabled = () => {
        const disabled = Boolean($("qreverseImportCsvBtn")?.disabled);
        csvMenu.querySelector("summary")?.classList.toggle("inactive-control", disabled);
        csvMenu.querySelectorAll("button").forEach(button => { button.disabled = disabled; });
      };
      const sourceButton = $("qreverseImportCsvBtn");
      if (sourceButton) new MutationObserver(syncCsvDisabled).observe(sourceButton, { attributes: true, attributeFilter: ["disabled"] });
      syncCsvDisabled();

      qreverseCsvInput.addEventListener("change", async event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const file = event.target.files?.[0];
        if (!file) return;
        await api.runQReverseImport(async () => {
        try {
          let values = parseSingleColumnCsv(await file.text()).map(value => value.trim()).filter(Boolean);
          if (csvHasHeader && values.length) values = values.slice(1);
          if (!values.length) throw new Error(csvHasHeader ? "CSV contains a header but no QR values" : "CSV contains no QR values");
          const batchId = `csv-${Date.now()}`;
          values.forEach(value => state.qreverse.rows.push({
            id: state.qreverse.nextId++,
            groupId: batchId,
            source: "CSV",
            value,
            selected: true,
            status: "Processed",
            error: "",
            filename: file.name,
            path: file.name,
            size: file.size,
            lastModified: file.lastModified,
            file: null
          }));
          api.showToast(`${values.length} CSV value${values.length === 1 ? "" : "s"} imported${csvHasHeader ? "; header skipped" : ""}`);
        } catch (error) {
          api.showToast(error.message || "CSV could not be imported");
        } finally {
          event.target.value = "";
          api.renderQReverse();
        }
        });
      }, true);
    }

    function parseSingleColumnCsv(text) {
      const rows = [];
      let row = [];
      let field = "";
      let quoted = false;
      const source = String(text || "").replace(/^\uFEFF/, "");
      for (let i = 0; i <= source.length; i += 1) {
        const char = source[i] ?? "\n";
        if (quoted) {
          if (char === '"' && source[i + 1] === '"') { field += '"'; i += 1; }
          else if (char === '"') quoted = false;
          else field += char;
        } else if (char === '"' && field === "") quoted = true;
        else if (char === ",") { row.push(field); field = ""; }
        else if (char === "\n" || char === "\r") {
          if (char === "\r" && source[i + 1] === "\n") i += 1;
          row.push(field);
          field = "";
          if (row.some(value => value.trim() !== "")) {
            if (row.length !== 1) throw new Error("CSV must contain exactly one column");
            rows.push(row[0]);
          }
          row = [];
        } else field += char;
      }
      if (quoted) throw new Error("CSV contains an unterminated quoted value");
      return rows;
    }

    syncContextLabels();
  });
})();
