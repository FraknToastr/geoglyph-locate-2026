
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const panelBody = document.querySelector(".right-panel>.panel-body");
    const qrModule = document.getElementById("qrControlModule");
    const symbolModule = document.getElementById("symbolControlModule");
    const colourModule = document.getElementById("sharedColourModule");
    if (!panelBody || !qrModule || !symbolModule || !colourModule) return;

    function syncSectionVisibility() {
      const workflow = document.body.dataset.workflow;
      const order = workflow === 'qr' || workflow === 'magic-eye'
        ? [qrModule, colourModule, symbolModule] : [colourModule, symbolModule, qrModule];
      order.forEach((section, index) => {
        if (panelBody.children[index] !== section) panelBody.insertBefore(section, panelBody.children[index] || null);
      });
      const symbolVisible = workflow === "qr" || workflow === "symbol";
      symbolModule.hidden = !symbolVisible;
      symbolModule.setAttribute("aria-hidden", String(!symbolVisible));
      if (symbolVisible) {
        symbolModule.setAttribute("aria-disabled", "false");
        symbolModule.querySelectorAll("button,input,textarea,select").forEach(control => { control.disabled = false; });
      }
    }

    syncSectionVisibility();
    new MutationObserver(syncSectionVisibility).observe(document.body, { attributes:true, attributeFilter:["data-workflow"] });
  });
})();
