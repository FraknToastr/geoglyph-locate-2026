(() => {
  'use strict';
  const link = document.querySelector('a[data-suite-return]');
  const routing = window.GeoGlyphSuiteRouting;
  const suite = window.GeoGlyphSuite;
  const survey = window.GeoGlyphSurveyResults;
  if (!link || !routing || !suite || !survey) return;
  const app = link.dataset.suiteReturn;
  const serviceUrl = survey.config.serviceUrl;
  const root = routing.suiteRoot(location.href);
  let handoff;
  try {
    handoff = routing.decodeHandoff(location.hash, serviceUrl, app);
  } catch {
    return; // The relative Return link also works without a valid handoff.
  }
  if (!handoff) return;

  let released = false;
  const poller = routing.createPoller({
    client: survey.create(), handoff, currentApp: app,
    onState({ layerId, cursor, interval, active }) {
      if (released) return;
      const checkpoint = { layerId, cursor, interval, active };
      link.href = routing.destination(root, 'launcher', { ...checkpoint, returnFrom: app }, serviceUrl);

      // Keep the checkpoint on this page for refresh and browser Back.
      const url = new URL(location.href);
      const params = new URLSearchParams(url.hash.slice(1));
      const saved = routing.validateHandoff({ ...handoff, ...checkpoint }, serviceUrl);
      params.set('suite', JSON.stringify(saved));
      url.hash = params.toString();
      if (url.href === location.href) return;
      try { history.replaceState(history.state, '', url.href); } catch { /* File browser restriction. */ }
    },
    onLaunch(target, { beginId }) {
      return suite.navigate(target, {
        launchReason: 'survey', beginId, returnFrom: target === 'launcher' ? app : undefined
      });
    }
  });

  function release() {
    if (released) return;
    released = true;
    poller.dispose();
  }
  suite.configure({ root, checkpoint: poller.state, release });
  window.addEventListener('pagehide', release);
  link.addEventListener('click', event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void suite.navigate('launcher', { returnFrom: app }).catch(() => location.assign(link.href));
  });
  void poller.resume();
})();
