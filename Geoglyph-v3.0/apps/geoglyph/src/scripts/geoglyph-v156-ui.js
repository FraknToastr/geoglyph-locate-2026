
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    if (!api) return;
    const $ = id => document.getElementById(id);
    const state = api.state;
    const qrModule = $("qrControlModule");
    const symbolModule = $("symbolControlModule");
    const fontList = $("fontList");
    const qrHead = qrModule?.querySelector(":scope > .module-head");
    const qrTitle = qrHead?.querySelector(".module-collapse-btn span:last-child");

    document.title=GeoGlyphVersion.title;

    /* Wrap QR fields without nesting the independent Font Symbol section. */
    if (qrModule && !qrModule.querySelector(':scope > .qr-fields')) {
      const fields = document.createElement("div");
      fields.className = "qr-fields";
      [...qrModule.children].forEach(child => {
        if (child !== qrHead) fields.appendChild(child);
      });
      qrModule.append(fields);
    }

    const qrFields = qrModule?.querySelector(":scope > .qr-fields");

    let syncingUnifiedModule = false;
    function syncUnifiedModule() {
      if (!qrModule || !symbolModule || syncingUnifiedModule) return;
      syncingUnifiedModule = true;
      try {
        const workflow = document.body.dataset.workflow || (state.preview === "symbol" ? "symbol" : "qr");
        const qrVisible = workflow === "qr" || workflow === "magic-eye";
        const symbolVisible = workflow === "symbol" || workflow === "qr";
        if (qrModule.hidden === qrVisible) qrModule.hidden = !qrVisible;
        if (symbolModule.hidden === symbolVisible) symbolModule.hidden = !symbolVisible;
        if (qrFields) qrFields.hidden = !qrVisible;
        if (qrTitle) qrTitle.textContent = "QR";
        if (symbolVisible) symbolModule.setAttribute("aria-disabled", "false");
        // The original control sync owns availability, including image-only crop tools.
      } finally {
        syncingUnifiedModule = false;
      }
    }

    /* The original renderer still manages legacy visibility, so reassert the unified rules after it runs. */
    const unifiedObserver = new MutationObserver(() => queueMicrotask(syncUnifiedModule));
    unifiedObserver.observe(document.body, { attributes:true, attributeFilter:["data-workflow"] });
    if (qrModule) unifiedObserver.observe(qrModule, { attributes:true, attributeFilter:["hidden","class"] });
    if (symbolModule) unifiedObserver.observe(symbolModule, { attributes:true, attributeFilter:["hidden","class"] });
    document.querySelector(".workflow-nav")?.addEventListener("click", () => window.setTimeout(syncUnifiedModule, 0));

    function selectedFont() {
      return state.fonts.find(font => font.id === state.selectedFontId) || state.fonts[0] || null;
    }
    function fontFamily(font) {
      const family = String(font?.cssFamily || font?.family || "system-ui").trim();
      if (/^(system-ui|serif|sans-serif|monospace|cursive|fantasy)$/i.test(family)) return family;
      return family.includes(",") ? family : `"${family.replace(/"/g, "\\\"")}"`;
    }
    function applyFontSelection(fontId) {
      if (!fontId || !state.fonts.some(font => font.id === fontId)) return;
      state.selectedFontId = fontId;
      const font = selectedFont();
      const family = fontFamily(font);
      fontList?.querySelectorAll("[data-font-id]").forEach(row => {
        const active = row.dataset.fontId === fontId;
        row.classList.toggle("is-active", active);
        row.setAttribute("aria-pressed", String(active));
      });
      $("glyphGrid")?.querySelectorAll(".glyph-cell strong:not(.emoji-glyph)").forEach(glyph => {
        glyph.style.fontFamily = family;
      });
      const previewGlyph = $("gridSelectionGlyph");
      if (previewGlyph && !previewGlyph.classList.contains("emoji-glyph")) previewGlyph.style.fontFamily = family;
      const status = $("fontStatus");
      if (status) status.textContent = font?.name || family;
      api.syncControlsFromState();
      api.renderPreview();
    }

    /* A single delegated path remains valid whenever the original list renderer rebuilds its rows. */
    fontList?.addEventListener("click", event => {
      const row = event.target.closest("[data-font-id]");
      if (!row || !fontList.contains(row)) return;
      const fontId = row.dataset.fontId;
      applyFontSelection(fontId);
      window.setTimeout(() => applyFontSelection(fontId), 0);
      window.requestAnimationFrame(() => applyFontSelection(fontId));
    }, true);

    fontList?.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const row = event.target.closest("[data-font-id]");
      if (!row) return;
      event.preventDefault();
      row.click();
    });

    syncUnifiedModule();
    applyFontSelection(state.selectedFontId);
  });
})();
