(() => {
  'use strict';

  // These are session choices, independent of the active workspace or Explorer.
  const choices = { visible: true, presentation: 'full' };
  const $ = id => document.getElementById(id);
  let editor, workspace, sidebar, toggle;
  let fullScrollTop = 0;

  function state() {
    const active = Boolean(workspace && !workspace.hidden && document.body.classList.contains('geoglyph-map-preview'));
    return { ...choices, active, suppressed: active && document.body.classList.contains('drawer-open') };
  }

  function sync() {
    if (!editor) return;
    const current = state();
    const shown = current.active && current.visible && !current.suppressed;
    const full = shown && current.presentation === 'full';
    const mini = shown && current.presentation === 'mini';
    const focused = document.activeElement;
    const hadFocus = editor.contains(focused);
    if (!sidebar.hidden) fullScrollTop = sidebar.scrollTop;

    // Move the actual controls, retaining all inputs, sections and event handlers.
    const mount = current.presentation === 'full' ? sidebar : workspace;
    if (editor.parentElement !== mount) mount.prepend(editor);
    // Compact feedback remains over the map, immediately after the mini panel.
    const feedback = $('mapQuickStatus');
    if (current.presentation === 'mini' && feedback && editor.nextElementSibling !== feedback) editor.after(feedback);

    editor.classList.toggle('is-collapsed', current.presentation === 'mini');
    editor.hidden = !shown;
    editor.inert = !shown;
    sidebar.hidden = !full;
    sidebar.setAttribute('aria-hidden', String(!full));
    document.body.classList.toggle('map-sidebar-open', full);
    document.body.classList.toggle('map-controls-mini', mini);
    if (full) sidebar.scrollTop = fullScrollTop;

    const collapse = $('mapEditorCollapseBtn');
    if (collapse) {
      collapse.textContent = current.presentation === 'mini' ? '+' : '−';
      collapse.setAttribute('aria-expanded', String(current.presentation === 'full'));
      const label = current.presentation === 'mini' ? 'Expand map controls into sidebar' : 'Collapse map controls to floating mini panel';
      collapse.setAttribute('aria-label', label);
      collapse.dataset.hoverTip = label;
      collapse.removeAttribute('title');
    }
    toggle.disabled = !current.active;
    toggle.setAttribute('aria-expanded', String(shown));
    const label = !current.active ? 'Map controls (available in Map preview)' :
      current.suppressed ? 'Close Font Explorer and show map controls' :
      `${shown ? 'Hide' : 'Show'} map controls`;
    toggle.setAttribute('aria-label', label);
    toggle.dataset.hoverTip = label;
    toggle.removeAttribute('title');

    // A focused field must not disappear into a hidden or collapsed container.
    if (hadFocus) {
      if (!shown) (current.active ? toggle : $('mapCanvasToggleBtn'))?.focus({ preventScroll: true });
      else if (mini && !focused.getClientRects().length) collapse?.focus({ preventScroll: true });
      else if (document.activeElement !== focused) focused.focus({ preventScroll: true });
    }
    window.GeoGlyphMapEngine?.resizeViewport();
  }

  function setVisible(visible) {
    choices.visible = Boolean(visible);
    sync();
  }

  function setPresentation(presentation) {
    if (presentation !== 'full' && presentation !== 'mini') return;
    choices.presentation = presentation;
    sync();
  }

  function toggleControls() {
    const current = state();
    if (!current.active) return;
    if (current.suppressed) {
      // Use Explorer's existing close action to keep its button and ARIA in sync.
      $('closeDrawerBtn')?.click();
      choices.visible = true;
    } else choices.visible = !choices.visible;
    sync();
  }

  function boot() {
    if (editor) return true;
    editor = $('geoglyphMapEditor');
    workspace = $('geoglyphMapWorkspace');
    toggle = $('mapSidebarToggle');
    if (!editor || !workspace || !toggle) { editor = null; return false; }
    sidebar = document.createElement('aside');
    sidebar.id = 'mapControlSidebar';
    sidebar.className = 'map-control-sidebar';
    sidebar.setAttribute('aria-label', 'Map controls');
    sidebar.hidden = true;
    document.body.append(sidebar);
    toggle.addEventListener('click', toggleControls);
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(sync).observe(workspace, { attributes: true, attributeFilter: ['hidden'] });
    // Keep older integrations that set the editor's collapse class in sync too.
    new MutationObserver(() => {
      const presentation = editor.classList.contains('is-collapsed') ? 'mini' : 'full';
      if (presentation !== choices.presentation) setPresentation(presentation);
    }).observe(editor, { attributes: true, attributeFilter: ['class'] });
    const resize = new ResizeObserver(() => window.GeoGlyphMapEngine?.resizeViewport());
    resize.observe(workspace);
    const header = document.querySelector('.app-header');
    if (header) resize.observe(header);
    sync();
    return true;
  }

  window.GeoGlyphMapSidebar = Object.freeze({ state, setVisible, setPresentation, sync });
  function whenReady() {
    if (boot()) return;
    const observer = new MutationObserver(() => { if (boot()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', whenReady, { once: true });
  else whenReady();
})();
