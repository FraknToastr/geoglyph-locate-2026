
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);
    const drawer = $("explorerDrawer");
    const drawerBody = drawer?.querySelector(".drawer-body");
    const controls = drawer?.querySelector(".drawer-options");
    const fontPanel = drawerBody?.querySelector(".font-panel");
    const glyphWorkspace = drawerBody?.querySelector(".glyph-workspace");
    const fontButton = document.querySelector(".workflow-font-btn");
    const workflowNav = document.querySelector(".workflow-nav");
    const leftWorkspace = document.querySelector(".left-workspace");
    const header = document.querySelector(".app-header");

    document.title=GeoGlyphVersion.title;

    /* Controls span the full explorer width; font picker and glyph grid share all remaining height. */
    if (drawerBody && controls && fontPanel) drawerBody.insertBefore(controls, fontPanel);

    function syncExplorerBounds() {
      if (!leftWorkspace || !header) return;
      const leftRect = leftWorkspace.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const top = Math.round(headerRect.bottom + 5);
      const bottomGap = 5;
      document.documentElement.style.setProperty("--font-explorer-left", `${Math.round(leftRect.left)}px`);
      document.documentElement.style.setProperty("--font-explorer-top", `${top}px`);
      document.documentElement.style.setProperty("--font-explorer-width", `${Math.round(leftRect.width)}px`);
      document.documentElement.style.setProperty("--font-explorer-height", `${Math.max(280, Math.round(window.innerHeight - top - bottomGap))}px`);
    }

    function syncFontButton() {
      if (!fontButton) return;
      const open = document.body.classList.contains("drawer-open");
      fontButton.classList.toggle("is-active", open);
      fontButton.setAttribute("aria-pressed", String(open));
      fontButton.dataset.hoverTip = open ? "Close Font Explorer" : "Open Font Explorer and preview symbols";
      fontButton.removeAttribute("title");
    }

    syncExplorerBounds();
    syncFontButton();
    window.addEventListener("resize", syncExplorerBounds);
    new MutationObserver(() => {
      syncFontButton();
      if (document.body.classList.contains("drawer-open")) syncExplorerBounds();
    }).observe(document.body, { attributes:true, attributeFilter:["class"] });

    /* v16.5: workflow changes do not close Font Explorer; X/Escape/scrim and the Font Explorer toggle remain explicit close paths. */

    /* Force the fixed PNG after settings are loaded so stale SVG state cannot return. */
    const api = window.GeoGlyphStudio;
    if (api) {
      const pngSource = document.querySelector("#geoglyph-v154-base-ui")?.textContent.match(/const FIXED_MAGIC_EYE_DATA_URL = "([^"]+)";/)?.[1];
      if (pngSource) {
        api.state.magicEyeDataUrl = pngSource;
        api.state.magicEyeName = "magic_eye_qr_large.png";
        api.state.magicEyeImage = null;
      }
    }
  });
})();
