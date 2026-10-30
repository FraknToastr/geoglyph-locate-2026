/* Shared, workflow-local section visibility. Artwork settings stay independent. */
(() => {
  'use strict';
  const STORAGE_KEY = 'geoglyph-locate2026.geoglyph-controls-v1';
  const scopes = new Map();
  const registered = new WeakSet();
  let preferences = {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) preferences = saved;
  } catch (_) {}
  let legacyCollapsed = [];
  try {
    const saved = JSON.parse(localStorage.getItem('geoglyph-locate2026.geoglyph-v1512-ui') || 'null');
    if (Array.isArray(saved?.collapsed)) legacyCollapsed = saved.collapsed;
  } catch (_) {}

  const keyFor = scope => scope.id === 'studioControls' ? `studio:${document.body.dataset.workflow || 'symbol'}` : scope.id;
  const sectionsFor = scope => [...scope.querySelectorAll('[data-control-section]')].filter(section => section.closest('[data-controls-scope]') === scope);
  const activeSections = scope => sectionsFor(scope).filter(section => !section.hidden && section.getClientRects().length > 0);
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch (_) {}
  }
  function applyCollapsed(section, collapsed) {
    const buttons = [...section.querySelectorAll('[data-collapse-module]')].filter(button => button.dataset.collapseModule === section.id);
    const focused = document.activeElement;
    if (collapsed && section.contains(focused) && !focused.closest('.module-head,.panel-head,.map-section-head')) buttons[0]?.focus();
    section.classList.toggle('is-collapsed', collapsed);
    buttons.forEach(button => {
      button.setAttribute('aria-expanded', String(!collapsed));
      button.setAttribute('aria-controls', section.id);
      const mark = button.querySelector('.module-collapse-mark');
      if (mark) mark.textContent = collapsed ? '+' : '−';
    });
  }
  function remember(scope) {
    const key = keyFor(scope);
    const saved = preferences[key] && typeof preferences[key] === 'object' ? preferences[key] : {};
    activeSections(scope).forEach(section => { saved[section.id] = section.classList.contains('is-collapsed'); });
    preferences[key] = saved;
    persist();
  }
  function syncScope(scope, record) {
    const key = keyFor(scope);
    if (record.key !== key) {
      record.key = key;
      sectionsFor(scope).forEach(section => {
        const saved = preferences[key]?.[section.id];
        applyCollapsed(section, typeof saved === 'boolean' ? saved : legacyCollapsed.includes(section.id));
      });
    }
    const sections = activeSections(scope);
    record.header.querySelectorAll('[data-collapse-all]').forEach(button => {
      const collapse = button.dataset.collapseAll === 'collapse';
      button.disabled = !sections.some(section => section.classList.contains('is-collapsed') !== collapse);
    });
  }
  function sync() {
    scopes.forEach((record, scope) => syncScope(scope, record));
  }
  function registerSection(section) {
    if (!section?.id) return;
    section.classList.add('control-section');
    section.dataset.controlSection = '';
    if (!registered.has(section)) {
      registered.add(section);
      const scope = section.closest('[data-controls-scope]');
      const key = scope && keyFor(scope);
      const saved = key && preferences[key]?.[section.id];
      applyCollapsed(section, typeof saved === 'boolean' ? saved : legacyCollapsed.includes(section.id));
    }
    sync();
  }
  function enhanceHeader(header, scope) {
    if (!header || !scope?.id || scopes.has(scope)) return;
    scope.dataset.controlsScope = scope.id;
    header.classList.add('controls-head');
    header.dataset.controlsFor = scope.id;
    const widget = document.createElement('div');
    widget.className = 'controls-bulk';
    widget.setAttribute('role', 'group');
    widget.setAttribute('aria-label', 'Section visibility');
    for (const action of ['expand', 'collapse']) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'square-btn';
      button.dataset.collapseAll = action;
      button.textContent = action === 'expand' ? 'Expand all' : 'Collapse all';
      button.setAttribute('aria-label', `${button.textContent} sections`);
      widget.append(button);
    }
    header.append(widget);
    scopes.set(scope, {header, key:null});
    sectionsFor(scope).forEach(registerSection);
    sync();
  }
  function setCollapsed(section, collapsed) {
    if (!section?.matches('[data-control-section]')) return;
    applyCollapsed(section, Boolean(collapsed));
    const scope = section.closest('[data-controls-scope]');
    if (scope) remember(scope);
    sync();
    document.dispatchEvent(new CustomEvent('geoglyph:sections-changed'));
  }
  window.GeoGlyphControls = Object.freeze({registerSection, enhanceHeader, setCollapsed, sync});

  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-collapse-module],[data-collapse-all]');
    if (!button || button.disabled) return;
    if (button.dataset.collapseModule) {
      const section = document.getElementById(button.dataset.collapseModule);
      setCollapsed(section, !section?.classList.contains('is-collapsed'));
    } else {
      const header = button.closest('[data-controls-for]');
      const scope = header && document.getElementById(header.dataset.controlsFor);
      if (!scope) return;
      activeSections(scope).forEach(section => applyCollapsed(section, button.dataset.collapseAll === 'collapse'));
      remember(scope);
      sync();
      document.dispatchEvent(new CustomEvent('geoglyph:sections-changed'));
    }
  });
  window.addEventListener('DOMContentLoaded', () => queueMicrotask(() => {
    document.querySelectorAll('.control-module,[data-control-section]').forEach(registerSection);
    const studio = document.getElementById('studioControls');
    enhanceHeader(studio?.querySelector(':scope>.panel-head'), studio);
    const scan = document.getElementById('qreverseWorkspace');
    enhanceHeader(scan?.querySelector(':scope>.controls-head'), scan);
    new MutationObserver(() => queueMicrotask(sync)).observe(document.body, {attributes:true,attributeFilter:['data-workflow','class']});
    sync();
  }));
})();
