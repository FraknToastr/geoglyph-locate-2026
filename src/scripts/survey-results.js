(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GeoGlyphSurveyResults = api;
})(globalThis, function () {
  'use strict';

  const config = Object.freeze({
    serviceUrl: 'https://services.arcgis.com/BzylpWnjWP0tW4nL/arcgis/rest/services/survey123_03f5011529544723b64ad3f781a7e186_results/FeatureServer',
    field: 'whats_on_your_mind'
  });
  const cueFieldNames = Object.freeze([
    'whats_on_your_mind', 'emojis', 'geoglyph_speaks', 'random_font',
    'choose_a_font_font', 'choose_a_colour_colour', '_size_size', '_2d_or_3d', 'fit', 'animation', 'special_commands'
  ]);

  class ResultsError extends Error {
    constructor(message, kind = 'request') {
      super(message);
      this.name = 'ResultsError';
      this.kind = kind;
    }
  }

  function accessError() {
    return new ResultsError('The results view needs public query access, including anonymous responses. Check its sharing and feature-layer permissions.', 'access');
  }

  function fieldNamed(fields, name) {
    return fields.find(field => typeof field?.name === 'string' && field.name.toLowerCase() === String(name || '').toLowerCase());
  }

  function attribute(attributes, name) {
    const key = Object.keys(attributes).find(key => key.toLowerCase() === name.toLowerCase());
    if (key === undefined) throw new ResultsError(`The response is missing ${name}.`, 'schema');
    return attributes[key];
  }

  function describeLayer(metadata, serviceUrl, messageField) {
    const fields = Array.isArray(metadata.fields) ? metadata.fields : [];
    const message = fieldNamed(fields, messageField);
    if (!message) return null;
    if (message.type !== 'esriFieldTypeString') throw new ResultsError(`${messageField} must be a text field.`, 'schema');
    const oid = fieldNamed(fields, metadata.objectIdField) || fields.find(field => field?.type === 'esriFieldTypeOID');
    const trackedCreation = fieldNamed(fields, metadata.editFieldsInfo?.creationDateField);
    const creation = (trackedCreation?.type === 'esriFieldTypeDate' ? trackedCreation : null) || ['CreationDate', 'created_date', 'creation_date', 'created_at'].map(name => fieldNamed(fields, name)).find(field => field?.type === 'esriFieldTypeDate');
    const cueFields = Object.fromEntries(cueFieldNames.map(name => [name, fieldNamed(fields, name)?.name || '']));
    if (!oid || [message.name, oid.name, creation?.name, ...Object.values(cueFields)].filter(Boolean).some(name => !/^[a-z_][a-z\d_]*$/i.test(name))) {
      throw new ResultsError('The results view needs queryable message and Object ID fields.', 'schema');
    }
    if (metadata.capabilities && (typeof metadata.capabilities !== 'string' || !metadata.capabilities.split(',').some(value => value.trim().toLowerCase() === 'query'))) {
      throw new ResultsError('Querying is disabled on the results view.', 'schema');
    }
    if (metadata.advancedQueryCapabilities?.supportsOrderBy !== true || metadata.advancedQueryCapabilities?.supportsPagination !== true) {
      throw new ResultsError('The results view must support ordered, paginated queries to identify the latest non-empty response.', 'schema');
    }
    return Object.freeze({
      id: metadata.id,
      name: metadata.name || `Layer ${metadata.id}`,
      url: `${serviceUrl}/${metadata.id}`,
      field: message.name,
      cueFields: Object.freeze(cueFields),
      objectIdField: oid.name,
      creationField: creation?.name || '',
      orderBy: creation ? `${creation.name} DESC,${oid.name} DESC` : `${oid.name} DESC`,
      orderingLabel: creation ? `Newest by ${creation.name}` : 'Newest by Object ID (creation date unavailable)',
      pageSize: Math.max(1, Math.min(25, Number(metadata.maxRecordCount) || 25))
    });
  }

  function create(options = {}) {
    const serviceUrl = String(options.serviceUrl || config.serviceUrl).replace(/\/+$/, '');
    const messageField = options.field || config.field;
    const fetcher = options.fetch || globalThis.fetch.bind(globalThis);
    const timeoutMs = options.timeoutMs ?? 15000;
    if (!/^https:\/\/[^?#]+\/FeatureServer$/i.test(serviceUrl)) throw new ResultsError('Expected an HTTPS FeatureServer service URL.', 'schema');

    async function request(url, params, signal, method = 'GET') {
      const controller = new AbortController();
      const abort = () => controller.abort(signal.reason);
      if (signal?.aborted) abort();
      else signal?.addEventListener('abort', abort, { once: true });
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        controller.signal.throwIfAborted();
        const encoded = new URLSearchParams({ f: 'json', ...params }).toString();
        // Public GET queries can be served by ArcGIS's CDN for 30 seconds even
        // with cacheHint=false. POST /query is the same read-only REST operation
        // and avoids that shared response cache. Metadata can continue using GET.
        const response = await fetcher(method === 'POST' ? url : `${url}?${encoded}`, {
          method, credentials: 'omit', cache: 'no-store', signal: controller.signal,
          ...(method === 'POST' ? { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: encoded } : {})
        });
        if ([401, 403, 498, 499].includes(response.status)) throw accessError();
        if (!response.ok) throw new ResultsError(`Results request failed (HTTP ${response.status}).`);
        const json = await response.json();
        if (!json || typeof json !== 'object' || Array.isArray(json)) throw new ResultsError('ArcGIS returned an invalid results response.');
        if ([401, 403, 498, 499].includes(Number(json?.error?.code))) throw accessError();
        if (json?.error) throw new ResultsError(json.error.message || 'ArcGIS could not query the results view.');
        controller.signal.throwIfAborted();
        return json;
      } catch (error) {
        if (signal?.aborted) throw signal.reason;
        if (controller.signal.aborted) throw new ResultsError('Results request timed out.');
        throw error;
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', abort);
      }
    }

    async function discover({ signal } = {}) {
      const service = await request(serviceUrl, {}, signal);
      if ((service.layers != null && !Array.isArray(service.layers)) || (service.tables != null && !Array.isArray(service.tables))) {
        throw new ResultsError('ArcGIS returned invalid layer metadata.', 'schema');
      }
      const entries = [...(service.layers || []), ...(service.tables || [])];
      const ids = [...new Set(entries.map(layer => layer?.id).filter(id => Number.isInteger(id) && id >= 0))];
      const candidates = [];
      // Discovery is infrequent; sequential requests keep public-service traffic bounded.
      for (const id of ids) {
        const metadata = await request(`${serviceUrl}/${id}`, {}, signal);
        const layer = describeLayer({ ...metadata, id }, serviceUrl, messageField);
        if (layer) candidates.push(layer);
      }
      if (!candidates.length) throw new ResultsError(`No layer or table exposes ${messageField}.`, 'schema');
      return candidates;
    }

    async function latest(layer, { signal } = {}) {
      let offset = 0;
      const seen = new Set();
      for (;;) {
        const json = await request(`${layer.url}/query`, {
          where: `${layer.field} IS NOT NULL`,
          outFields: [...new Set([layer.field, layer.objectIdField, layer.creationField].filter(Boolean))].join(','),
          returnGeometry: 'false', orderByFields: layer.orderBy,
          resultRecordCount: String(layer.pageSize), resultOffset: String(offset), cacheHint: 'false'
        }, signal, 'POST');
        if (!Array.isArray(json.features)) throw new ResultsError('ArcGIS returned an invalid results response.');
        for (const feature of json.features) {
          const attributes = feature?.attributes;
          if (!attributes || typeof attributes !== 'object') throw new ResultsError('ArcGIS returned an invalid result record.');
          const value = attribute(attributes, layer.field);
          const id = attribute(attributes, layer.objectIdField);
          if (seen.has(id)) throw new ResultsError('Results changed during paging; the next poll will retry.');
          seen.add(id);
          if (value != null && typeof value !== 'string') throw new ResultsError('The message response must contain text.', 'schema');
          if (typeof value === 'string' && value.trim()) return { message: value, objectId: id };
        }
        if (!json.features.length || json.exceededTransferLimit === false || (json.exceededTransferLimit !== true && json.features.length < layer.pageSize)) return null;
        offset += json.features.length;
      }
    }

    function cueOutFields(layer) {
      return [...new Set([layer.field, layer.objectIdField, layer.creationField, ...Object.values(layer.cueFields || {})].filter(Boolean))].join(',');
    }

    function cueFeature(layer, feature) {
      const attributes = feature?.attributes;
      if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) throw new ResultsError('ArcGIS returned an invalid result record.');
      const objectId = attribute(attributes, layer.objectIdField);
      if (!Number.isSafeInteger(objectId) || objectId < 0) throw new ResultsError('The response contains an invalid Object ID.', 'schema');
      // Keep malformed points distinguishable from absent geometry so cue rules
      // can report a placement warning while retaining the current anchor.
      const geometry = feature.geometry ?? null;
      return { objectId, attributes: { ...attributes }, geometry };
    }

    async function queryCues(layer, params, signal) {
      const json = await request(`${layer.url}/query`, {
        outFields: cueOutFields(layer), returnGeometry: 'true', outSR: '4326', cacheHint: 'false', ...params
      }, signal, 'POST');
      if (!Array.isArray(json.features)) throw new ResultsError('ArcGIS returned an invalid results response.');
      return { json, cues: json.features.map(feature => cueFeature(layer, feature)) };
    }

    async function latestCue(layer, { signal } = {}) {
      const { cues } = await queryCues(layer, {
        where: '1=1', orderByFields: layer.orderBy, resultRecordCount: '1', resultOffset: '0'
      }, signal);
      return cues[0] || null;
    }

    async function afterCues(layer, afterId, { signal } = {}) {
      if (!Number.isSafeInteger(afterId) || afterId < 0) throw new ResultsError('Expected a valid submission Object ID.', 'schema');
      const cues = [];
      let cursor = afterId;
      for (;;) {
        // Keyset paging avoids skips when older records are removed during a poll.
        const { json, cues: page } = await queryCues(layer, {
          where: `${layer.objectIdField}>${cursor}`, orderByFields: `${layer.objectIdField} ASC`,
          resultRecordCount: String(layer.pageSize), resultOffset: '0'
        }, signal);
        for (const cue of page) {
          if (cue.objectId <= cursor) throw new ResultsError('Results changed during paging; the next poll will retry.');
          cursor = cue.objectId;
          cues.push(cue);
        }
        if (!page.length || json.exceededTransferLimit === false || (json.exceededTransferLimit !== true && page.length < layer.pageSize)) return cues;
      }
    }

    return Object.freeze({ discover, latest, latestCue, afterCues });
  }

  return Object.freeze({ config, create, ResultsError });
});
