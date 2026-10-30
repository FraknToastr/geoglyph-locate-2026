(function () {
  'use strict';
  const enabled = window.GeoGlyphConferenceAutoStart !== false && !new URL(location.href).searchParams.has('studio');
  window.GeoGlyphConferenceConfig = Object.freeze({ enabled, pollSeconds: 1 });
  document.documentElement.dataset.conferenceMode = enabled ? 'presentation' : 'studio';
  if (enabled) document.body.classList.add('geoglyph-map-preview');
})();
