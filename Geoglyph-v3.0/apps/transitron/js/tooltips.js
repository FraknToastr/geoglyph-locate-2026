(() => {
  'use strict';

  const tooltip = document.getElementById('appTooltip');
  const selector = '[data-tooltip]';
  const screenInset = 8;
  const pointerGap = 64;
  let active;
  let pointer;
  let previousDescription;

  function hide() {
    if (!active) return;
    if (previousDescription === null) active.removeAttribute('aria-describedby');
    else active.setAttribute('aria-describedby', previousDescription);
    active = null;
    pointer = null;
    tooltip.hidden = true;
  }

  function position() {
    const viewport = window.visualViewport;
    const left = (viewport?.offsetLeft ?? 0) + screenInset;
    const top = (viewport?.offsetTop ?? 0) + screenInset;
    const availableWidth = (viewport?.width ?? document.documentElement.clientWidth) - 2 * screenInset;
    const availableHeight = (viewport?.height ?? document.documentElement.clientHeight) - 2 * screenInset;
    tooltip.style.maxWidth = Math.max(0, Math.min(availableWidth, 300)) + 'px';
    tooltip.style.maxHeight = Math.max(0, availableHeight) + 'px';

    const {width, height} = tooltip.getBoundingClientRect();
    const maxLeft = Math.max(left, left + availableWidth - width);
    const maxTop = Math.max(top, top + availableHeight - height);
    const anchor = pointer
      ? {left: pointer.x, right: pointer.x, top: pointer.y, bottom: pointer.y}
      : active.getBoundingClientRect();
    const gap = pointer ? pointerGap : 10;
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    const centredX = clamp((anchor.left + anchor.right - width) / 2, left, maxLeft);
    const centredY = clamp((anchor.top + anchor.bottom - height) / 2, top, maxTop);
    // Prefer the sides away from the body of a large pointer.
    const positions = [
      [anchor.left - width - gap, centredY],
      [centredX, anchor.top - height - gap],
      [anchor.right + gap, centredY],
      [centredX, anchor.bottom + gap]
    ];
    const [x, y] = positions.find(([x, y]) => x >= left && x <= maxLeft && y >= top && y <= maxTop)
      ?? positions[3];
    tooltip.style.left = clamp(x, left, maxLeft) + 'px';
    tooltip.style.top = clamp(y, top, maxTop) + 'px';
  }

  function show(element, atPointer) {
    const text = element?.dataset.tooltip?.trim();
    if (!text) return;
    if (element !== active) {
      hide();
      active = element;
      previousDescription = element.getAttribute('aria-describedby');
      element.setAttribute('aria-describedby', [previousDescription, tooltip.id].filter(Boolean).join(' '));
      tooltip.textContent = text;
      tooltip.hidden = false;
    }
    pointer = atPointer;
    position();
  }

  function keepInside(event) {
    return event.relatedTarget instanceof Node && active?.contains(event.relatedTarget);
  }

  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch' || keepInside(event)) return;
    show(event.target.closest(selector), {x: event.clientX, y: event.clientY});
  });
  document.addEventListener('pointermove', event => {
    if (!pointer || !active?.contains(event.target)) return;
    pointer = {x: event.clientX, y: event.clientY};
    position();
  });
  document.addEventListener('pointerout', event => {
    if (pointer && active?.contains(event.target) && !keepInside(event)) hide();
  });
  document.addEventListener('focusin', event => {
    if (event.target.matches(':focus-visible')) show(event.target.closest(selector));
  });
  document.addEventListener('focusout', event => {
    if (active?.contains(event.target) && !keepInside(event)) hide();
  });

  document.addEventListener('pointerdown', hide);
  document.addEventListener('pointercancel', hide);
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  window.visualViewport?.addEventListener('resize', hide);
  window.visualViewport?.addEventListener('scroll', hide);
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') hide();
  });

  function replaceTitle(element) {
    const title = element.getAttribute('title');
    if (title === null) return;
    if (title && !element.hasAttribute('data-tooltip')) element.dataset.tooltip = title;
    element.removeAttribute('title');
  }

  // MapLibre assigns native titles as it creates its controls.
  document.querySelectorAll('[title]').forEach(replaceTitle);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.attributeName === 'title') replaceTitle(record.target);
      for (const node of record.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        replaceTitle(node);
        node.querySelectorAll('[title]').forEach(replaceTitle);
      }
    }
    if (active && (!active.isConnected || !active.getClientRects().length || !active.dataset.tooltip?.trim())) hide();
  }).observe(document.body, {subtree: true, childList: true, attributes: true, attributeFilter: ['title', 'data-tooltip', 'hidden']});
})();
