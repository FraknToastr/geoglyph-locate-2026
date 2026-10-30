
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    const previewHead = document.querySelector(".preview-panel-head");
    const payloadButton = document.getElementById("magicEyePayloadBtn");
    const sourceCanvas = document.getElementById("qrCanvas");
    if (!api || !previewHead || !sourceCanvas) return;

    const button = document.createElement("button");
    button.className = "square-btn magic-eye-fullscreen-btn";
    button.id = "magicEyeFullscreenBtn";
    button.type = "button";
    button.textContent = "Full Screen";
    button.title = "Open the coloured Magic Eye QR on a black full-screen background";
    if (payloadButton?.parentElement === previewHead) previewHead.insertBefore(button, payloadButton);
    else previewHead.append(button);

    const overlay = document.createElement("div");
    overlay.className = "magic-eye-fullscreen";
    overlay.id = "magicEyeFullscreen";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Magic Eye full-screen preview");
    overlay.innerHTML = `
      <canvas aria-label="Coloured Magic Eye QR" class="magic-eye-fullscreen-canvas" id="magicEyeFullscreenCanvas"></canvas>
      <div aria-label="Magic Eye QR module shape" class="magic-eye-fullscreen-modes" id="magicEyeFullscreenModes">
        <button class="square-btn" data-fullscreen-qr-mode="square" type="button">Square</button>
        <button class="square-btn" data-fullscreen-qr-mode="circle" type="button">Circle</button>
        <button class="square-btn" data-fullscreen-qr-mode="rounded" type="button">Rounded</button>
        <button class="square-btn" data-fullscreen-qr-mode="diamond" type="button">Diamond</button>
      </div>
      <label class="magic-eye-fullscreen-blur" for="magicEyeFullscreenBlur">
        <span class="control-label">Blur</span>
        <input aria-label="Magic Eye full-screen blur" id="magicEyeFullscreenBlur" max="10" min="0" step="0.25" type="range" value="0">
        <span aria-live="polite" class="slider-value" id="magicEyeFullscreenBlurValue">0 px</span>
      </label>
      <button class="magic-eye-fullscreen-random" id="magicEyeFullscreenRandom" title="Create another random Magic Eye colour combination" type="button">Random</button>
      <button aria-label="Close full-screen Magic Eye preview" class="magic-eye-fullscreen-close" id="closeMagicEyeFullscreen" type="button">×</button>`;
    document.body.append(overlay);

    const fullscreenCanvas = document.getElementById("magicEyeFullscreenCanvas");
    const closeButton = document.getElementById("closeMagicEyeFullscreen");
    const randomButton = document.getElementById("magicEyeFullscreenRandom");
    const fullscreenModes = document.getElementById("magicEyeFullscreenModes");
    const qrModeRow = document.querySelector("#qrControlModule .qr-mode-row");
    const blurRow = document.createElement("label");
    blurRow.className = "slider-row magic-eye-blur-row";
    blurRow.htmlFor = "magicEyeBlur";
    blurRow.innerHTML = `<span class="control-label">Blur</span><input aria-label="Magic Eye blur" id="magicEyeBlur" max="10" min="0" step="0.25" type="range" value="0"><span aria-live="polite" class="slider-value" id="magicEyeBlurValue">0 px</span>`;
    qrModeRow?.insertAdjacentElement("afterend", blurRow);
    const blurInput = document.getElementById("magicEyeBlur");
    const blurValue = document.getElementById("magicEyeBlurValue");
    const fullscreenBlurInput = document.getElementById("magicEyeFullscreenBlur");
    const fullscreenBlurValue = document.getElementById("magicEyeFullscreenBlurValue");
    let blurAmount = 0;

    function formatBlur(value) {
      return `${Number(value).toLocaleString(undefined, { maximumFractionDigits:2 })} px`;
    }

    function applyBlur(value) {
      blurAmount = Math.max(0, Math.min(10, Number(value) || 0));
      const displayValue = formatBlur(blurAmount);
      blurInput.value = String(blurAmount);
      fullscreenBlurInput.value = String(blurAmount);
      blurValue.textContent = displayValue;
      fullscreenBlurValue.textContent = displayValue;
      sourceCanvas.style.filter = document.body.dataset.workflow === "magic-eye" && blurAmount > 0 ? `blur(${blurAmount}px)` : "";
      fullscreenCanvas.style.filter = blurAmount > 0 ? `blur(${blurAmount}px)` : "";
    }

    function syncFullscreenModes() {
      fullscreenModes.querySelectorAll("[data-fullscreen-qr-mode]").forEach(modeButton => {
        const active = modeButton.dataset.fullscreenQrMode === api.state.qrMode;
        modeButton.classList.toggle("is-active", active);
        modeButton.setAttribute("aria-pressed", String(active));
      });
    }

    function copyRenderedPreview() {
      fullscreenCanvas.width = sourceCanvas.width;
      fullscreenCanvas.height = sourceCanvas.height;
      const ctx = fullscreenCanvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, fullscreenCanvas.width, fullscreenCanvas.height);
      ctx.drawImage(sourceCanvas, 0, 0);
    }

    async function openFullscreenPreview() {
      await api.renderPreview();
      copyRenderedPreview();
      syncFullscreenModes();
      overlay.hidden = false;
      document.body.classList.add("modal-open");
      closeButton.focus();
      try {
        if (overlay.requestFullscreen && document.fullscreenElement !== overlay) await overlay.requestFullscreen();
      } catch {
        // The fixed viewport overlay remains the functional fallback.
      }
    }

    async function closeFullscreenPreview() {
      if (overlay.hidden) return;
      overlay.hidden = true;
      document.body.classList.remove("modal-open");
      if (document.fullscreenElement === overlay) {
        try { await document.exitFullscreen(); } catch {}
      }
      button.focus();
    }

    button.addEventListener("click", openFullscreenPreview);
    blurInput.addEventListener("input", event => applyBlur(event.currentTarget.value));
    fullscreenBlurInput.addEventListener("input", event => applyBlur(event.currentTarget.value));
    randomButton.addEventListener("click", () => document.getElementById("magicEyeRandomColourBtn")?.click());
    fullscreenModes.addEventListener("click", async event => {
      const modeButton = event.target.closest("[data-fullscreen-qr-mode]");
      if (!modeButton) return;
      api.state.qrMode = modeButton.dataset.fullscreenQrMode;
      api.syncControlsFromState();
      syncFullscreenModes();
      await api.renderPreview();
      document.dispatchEvent(new CustomEvent("geoglyph:magic-eye-rendered"));
    });
    closeButton.addEventListener("click", closeFullscreenPreview);
    overlay.addEventListener("pointerdown", event => {
      if (event.target === overlay) closeFullscreenPreview();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !overlay.hidden) closeFullscreenPreview();
    });
    document.addEventListener("fullscreenchange", () => {
      if (!overlay.hidden && !document.fullscreenElement) closeFullscreenPreview();
    });
    document.addEventListener("geoglyph:magic-eye-rendered", () => {
      if (!overlay.hidden) copyRenderedPreview();
    });
    new MutationObserver(() => applyBlur(blurAmount)).observe(document.body, { attributes:true, attributeFilter:["data-workflow"] });
    applyBlur(0);
  });
})();
