(() => {
  'use strict';
  const link = document.querySelector('a[data-suite-return]');
  const routing = window.GeoGlyphSuiteRouting;
  const serviceUrl = window.GeoGlyphSurveyResults?.config?.serviceUrl;
  if (!link || !routing || !serviceUrl) return;
  const app = link.dataset.suiteReturn;
  try {
    // Hold the checkpoint in the URL so reloading the player keeps the return trip intact.
    const checkpoint = routing.decodeHandoff(location.hash, serviceUrl, app);
    if (checkpoint) {
      link.href = routing.destination(routing.suiteRoot(location.href), 'launcher',
        { ...checkpoint, returnFrom: app }, serviceUrl);
    }
  } catch {
    // The literal relative link still works for an invalid or outdated checkpoint.
  }
})();
