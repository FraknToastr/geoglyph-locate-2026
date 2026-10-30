(function () {
  'use strict';

  const sectionDefinitions = [
    ['.map-control-grid', 'mapFontSection', 'Font'],
    ['[data-map-pane="arcgis"]', 'mapArcgisSection', 'Content · ArcGIS'],
    ['[data-map-pane="message"]', 'mapMessageSection', 'Content · Message'],
    ['[data-map-pane="glyph"]', 'mapGlyphSection', 'Content · Character'],
    ['.map-style-panel', 'mapStyleSection', 'Style'],
    ['.map-editor-actions', 'mapBasemapSection', 'Basemap & Export'],
    ['.map-3d-panel', 'map3DSection', '3D']
  ];

  // Enhance existing containers in place. Their children, IDs and event handlers
  // are also used by the map engine and the lazily mounted 3D controls.
  function enhanceSection(editor, definition) {
    const [selector, id, label] = definition;
    const section = editor.querySelector(selector);
    if (!section) return false;
    if (section.dataset.controlSection !== undefined) return true;

    section.id = id;
    const header = document.createElement('header');
    header.className = 'map-section-head';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'module-collapse-btn map-section-collapse';
    button.dataset.collapseModule = id;
    button.setAttribute('aria-expanded', 'true');
    const mark = document.createElement('span');
    mark.className = 'module-collapse-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '−';
    const caption = document.createElement('span');
    caption.textContent = label;
    button.append(mark, caption);
    header.append(button);
    section.prepend(header);
    window.GeoGlyphControls.registerSection(section);
    return true;
  }

  function enhanceEditor(editor) {
    if (editor.dataset.mapControlsReady === 'true') return;
    const controls = window.GeoGlyphControls;
    if (!controls) return;
    editor.dataset.mapControlsReady = 'true';

    const header = document.createElement('header');
    header.className = 'panel-head map-controls-head';
    header.id = 'mapControlsHeader';
    const title = document.createElement('h2');
    title.className = 'panel-title';
    title.textContent = 'Controls · Ground Font Engine';
    header.append(title);
    editor.querySelector('.map-editor-head').after(header);
    controls.enhanceHeader(header, editor);

    for (const definition of sectionDefinitions) enhanceSection(editor, definition);

    // Message and Character are mutually exclusive; ArcGIS also shows Message.
    // Let the shared widget recalculate its active scope after mode changes.
    const modeObserver = new MutationObserver(() => controls.sync());
    editor.querySelectorAll('[data-map-pane]').forEach(pane => {
      modeObserver.observe(pane, { attributes: true, attributeFilter: ['hidden'] });
    });

    // ground-3d inserts its panel after the existing actions node, possibly
    // after the rest of the Map UI is ready. Watch only editor children until it
    // arrives, rather than observing map tiles or the font table continuously.
    const threeDDefinition = sectionDefinitions[sectionDefinitions.length - 1];
    if (!editor.querySelector('.map-3d-panel')) {
      const threeDObserver = new MutationObserver(() => {
        if (enhanceSection(editor, threeDDefinition)) {
          threeDObserver.disconnect();
          controls.sync();
        }
      });
      threeDObserver.observe(editor, { childList: true });
    }
    controls.sync();
  }

  function boot() {
    const editor = document.getElementById('geoglyphMapEditor');
    if (editor) {
      enhanceEditor(editor);
      return;
    }
    const observer = new MutationObserver(() => {
      const nextEditor = document.getElementById('geoglyphMapEditor');
      if (nextEditor && window.GeoGlyphControls) {
        observer.disconnect();
        enhanceEditor(nextEditor);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
