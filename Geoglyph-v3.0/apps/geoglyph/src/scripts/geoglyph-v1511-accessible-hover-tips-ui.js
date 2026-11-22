
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    const tip = document.createElement("div");
    tip.id = "uosHoverTip";
    tip.className = "uos-hover-tip";
    tip.setAttribute("role", "tooltip");
    tip.setAttribute("aria-hidden", "true");
    document.body.append(tip);

    let active = null;
    let timer = 0;
    let pointer = { x: 0, y: 0 };
    let keyboardFocus = false;
    const targets = "button, .font-row[data-font-id], [data-hover-tip]";

    function fontDetails(row) {
      const font = api?.state?.fonts?.find(item => item.id === row.dataset.fontId);
      if (!font) return null;
      const source = font.opentypeFont || font.source === "file" ? "Esri font" : font.source === "windows" ? "Windows font" : "Preset font";
      return { text: font.name || row.textContent.trim(), source };
    }

    function readableButtonName(button) {
      const existing = button.dataset.hoverTip || button.getAttribute("aria-label") || button.getAttribute("title");
      if (existing) return existing.trim();
      const clone = button.cloneNode(true);
      clone.querySelectorAll("svg,.module-collapse-mark,.sr-only").forEach(node => node.remove());
      const text = clone.textContent.replace(/\s+/g, " ").trim();
      if (text) return text;
      return button.id ? button.id.replace(/Btn$|Button$/i, "").replace(/([a-z])([A-Z])/g, "$1 $2") : "Button";
    }

    function contentFor(target) {
      const font = target.matches(".font-row[data-font-id]") ? fontDetails(target) : null;
      return font || { text: readableButtonName(target), source: target.matches("button") ? "Button" : "Control" };
    }

    function positionTip(fromKeyboard = false) {
      if (!active) return;
      const gap = 28;
      const anchor = fromKeyboard ? active.getBoundingClientRect() : { left:pointer.x, right:pointer.x, top:pointer.y, bottom:pointer.y };
      const rect = tip.getBoundingClientRect();
      let left = anchor.right + gap;
      let top = anchor.bottom + gap;
      if (left + rect.width > innerWidth - 8) left = anchor.left - rect.width - gap;
      if (top + rect.height > innerHeight - 8) top = anchor.top - rect.height - gap;
      tip.style.left = `${Math.max(8,Math.min(left,innerWidth - rect.width - 8))}px`;
      tip.style.top = `${Math.max(8,Math.min(top,innerHeight - rect.height - 8))}px`;
    }

    function show(target, fromKeyboard = false) {
      window.clearTimeout(timer);
      active = target;
      const content = contentFor(target);
      tip.replaceChildren(document.createTextNode(content.text));
      const source = document.createElement("span");
      source.className = "uos-hover-tip-source";
      source.textContent = content.source;
      tip.append(source);
      tip.setAttribute("aria-hidden", "false");
      tip.classList.add("is-visible");
      target.setAttribute("aria-describedby", tip.id);
      positionTip(fromKeyboard);
    }

    function hide() {
      window.clearTimeout(timer);
      if (active?.getAttribute("aria-describedby") === tip.id) active.removeAttribute("aria-describedby");
      active = null;
      tip.classList.remove("is-visible");
      tip.setAttribute("aria-hidden", "true");
    }

    document.addEventListener("pointerdown", () => { keyboardFocus = false; hide(); }, true);
    document.addEventListener("pointerover", event => {
      const target = event.target.closest(targets);
      if (!target || target.disabled || target.contains(event.relatedTarget)) return;
      pointer = { x:event.clientX, y:event.clientY };
      window.clearTimeout(timer);
      timer = window.setTimeout(() => show(target, false), 420);
    });
    document.addEventListener("pointermove", event => {
      pointer = { x:event.clientX, y:event.clientY };
      if (active && event.target.closest(targets) === active) positionTip(false);
      else if (active && !keyboardFocus) hide();
    });
    document.addEventListener("pointerout", event => {
      const target = event.target.closest(targets);
      if (target && !target.contains(event.relatedTarget)) hide();
    });
    document.addEventListener("focusin", event => {
      const target = event.target.closest(targets);
      if (keyboardFocus && target && !target.disabled) show(target, true);
    });
    document.addEventListener("focusout", event => {
      if (event.target.closest(targets)) hide();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Tab") keyboardFocus = true;
      if (event.key === "Escape") hide();
    }, true);
    document.addEventListener("click", hide, true);
    document.addEventListener("scroll", hide, true);
    document.addEventListener("visibilitychange", () => { if (document.hidden) hide(); });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);

    /* Suppress overlapping native title bubbles while retaining their wording. */
    function absorbTitles(root = document) {
      root.querySelectorAll?.("button[title]").forEach(button => {
        if (!button.dataset.hoverTip) button.dataset.hoverTip = button.title;
        button.removeAttribute("title");
      });
    }
    absorbTitles();
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) absorbTitles(node);
    }))).observe(document.body,{childList:true,subtree:true});
  });
})();
