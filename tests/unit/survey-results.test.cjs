const { test } = require('node:test');
const assert = require('node:assert/strict');
const { create, config } = require('../../src/scripts/survey-results.js');

function metadata(id = 7, extras = {}) {
  return { id, name: 'Public responses', capabilities: 'Query,Extract', objectIdField: 'objectid', maxRecordCount: 2,
    editFieldsInfo: { creationDateField: 'CreationDate' },
    advancedQueryCapabilities: { supportsOrderBy: true, supportsPagination: true },
    fields: [{ name: 'objectid', type: 'esriFieldTypeOID' }, { name: config.field, type: 'esriFieldTypeString' }, { name: 'CreationDate', type: 'esriFieldTypeDate' }], ...extras };
}

function fixture(replies) {
  const calls = [];
  const client = create({ fetch: async (url, options) => {
    calls.push({ url: new URL(url), options, params: new URLSearchParams(options.body || new URL(url).search) });
    assert.ok(replies.length, 'Unexpected extra request');
    const json = replies.shift();
    return { ok: true, status: 200, json: async () => json };
  }});
  return { client, calls };
}

test('discovers a nonzero sublayer and sends no credentials or token', async () => {
  const { client, calls } = fixture([{ layers: [{ id: 7 }], tables: [] }, metadata()]);
  const [layer] = await client.discover();
  assert.equal(layer.id, 7);
  assert.equal(layer.url, `${config.serviceUrl}/7`);
  assert.equal(layer.orderBy, 'CreationDate DESC,objectid DESC');
  for (const call of calls) {
    assert.equal(call.options.credentials, 'omit');
    assert.equal(call.options.cache, 'no-store');
    assert.equal(call.url.searchParams.has('token'), false);
    assert.equal(call.options.headers, undefined);
  }
});

test('discovers matching tables, ignores other layers and preserves multiple choices', async () => {
  const upper = metadata(9); upper.fields[1].name = config.field.toUpperCase();
  const { client } = fixture([{ layers: [{ id: 1 }, { id: 7 }], tables: [{ id: 9 }] }, metadata(1, { fields: [] }), metadata(), upper]);
  const layers = await client.discover();
  assert.deepEqual(layers.map(layer => layer.id), [7, 9]);
  assert.equal(layers[1].field, config.field.toUpperCase());
});

test('orders by creation date and Object ID, paging past blank responses', async () => {
  const feature = (objectid, value) => ({ attributes: { objectid, [config.field]: value } });
  const { client, calls } = fixture([{ layers: [{ id: 7 }] }, metadata(),
    { features: [feature(4, null), feature(3, ' \n\t')], exceededTransferLimit: true },
    { features: [feature(2, ' Hello Locate! '), feature(1, 'Older')], exceededTransferLimit: false }]);
  const [layer] = await client.discover();
  assert.deepEqual(await client.latest(layer), { message: ' Hello Locate! ', objectId: 2 });
  const query = calls[2].params;
  assert.equal(calls[2].options.method, 'POST');
  assert.equal(calls[2].options.headers['Content-Type'], 'application/x-www-form-urlencoded;charset=UTF-8');
  assert.equal(calls[2].options.credentials, 'omit');
  assert.equal(calls[2].options.cache, 'no-store');
  assert.equal(calls[2].url.search, '');
  assert.equal(query.has('token'), false);
  assert.equal(query.get('orderByFields'), 'CreationDate DESC,objectid DESC');
  assert.equal(query.get('outFields'), 'whats_on_your_mind,objectid,CreationDate');
  assert.equal(query.get('where'), 'whats_on_your_mind IS NOT NULL');
  assert.equal(query.get('returnGeometry'), 'false');
  assert.equal(query.get('cacheHint'), 'false');
  assert.equal(query.get('resultOffset'), '0');
  assert.equal(calls[3].params.get('resultOffset'), '2');
});

test('returns null for an empty table and for entirely blank responses', async () => {
  for (const features of [[], [{ attributes: { objectid: 1, [config.field]: '  ' } }]]) {
    const { client } = fixture([{ layers: [{ id: 7 }] }, metadata(), { features, exceededTransferLimit: false }]);
    assert.equal(await client.latest((await client.discover())[0]), null);
  }
});

test('falls back explicitly to descending Object ID when creation time is unavailable', async () => {
  const data = metadata(); data.fields.pop(); data.editFieldsInfo = {};
  const { client } = fixture([{ layers: [{ id: 7 }] }, data]);
  const [layer] = await client.discover();
  assert.equal(layer.orderBy, 'objectid DESC');
  assert.match(layer.orderingLabel, /creation date unavailable/);
});

test('rejects missing fields and unsupported ordering instead of showing an arbitrary record', async () => {
  for (const data of [metadata(7, { fields: [] }), metadata(7, { advancedQueryCapabilities: { supportsOrderBy: false, supportsPagination: true } })]) {
    const { client } = fixture([{ layers: [{ id: 7 }] }, data]);
    await assert.rejects(client.discover(), error => error.kind === 'schema');
  }
});

test('HTTP and ArcGIS JSON access failures explain public query permissions', async () => {
  for (const http of [false, true]) {
    const client = create({ fetch: async () => ({ ok: !http, status: http ? 403 : 200, json: async () => ({ error: { code: 499, message: 'Token Required' } }) }) });
    await assert.rejects(client.discover(), error => error.kind === 'access' && /public query access/.test(error.message));
  }
});

test('network timeouts terminate the request and external cancellation stays cancelled', async () => {
  const client = create({ timeoutMs: 10, fetch: (_, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true })) });
  await assert.rejects(client.discover(), /timed out/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(client.discover({ signal: controller.signal }), { name: 'AbortError' });
});

test('malformed responses and repeated pages cannot replace a valid displayed message', async () => {
  for (const reply of [{}, { features: [{ attributes: {} }] }]) {
    const { client } = fixture([{ layers: [{ id: 7 }] }, metadata(), reply]);
    await assert.rejects(client.latest((await client.discover())[0]));
  }
  const blanks = { features: [{ attributes: { objectid: 1, [config.field]: '' } }], exceededTransferLimit: true };
  const { client } = fixture([{ layers: [{ id: 7 }] }, metadata(7, { maxRecordCount: 1 }), blanks, blanks]);
  await assert.rejects(client.latest((await client.discover())[0]), /changed during paging/);
});

function cueMetadata() {
  const data = metadata();
  data.fields.push(...['Emojis', 'geoglyph_speaks', 'random_font', 'choose_a_font_font', 'choose_a_colour_colour', '_size_size', '_2d_or_3d', 'fit', 'animation', 'special_commands', 'private_email']
    .map(name => ({ name, type: 'esriFieldTypeString' })));
  return data;
}

test('latest cue retains a blank-content controls record and requests only approved fields plus geometry', async () => {
  const geometry = { x: 138.6, y: -34.92, spatialReference: { wkid: 4326 } };
  const attributes = { OBJECTID: 17, [config.field]: '', _2d_or_3d: '2D', fit: 'Fit' };
  const { client, calls } = fixture([{ layers: [{ id: 7 }] }, cueMetadata(), { features: [{ attributes, geometry }] }]);
  const [layer] = await client.discover();
  assert.equal(layer.cueFields.emojis, 'Emojis');
  assert.equal(layer.cueFields.fit, 'fit');
  assert.ok(Object.isFrozen(layer.cueFields));
  assert.deepEqual(await client.latestCue(layer), { objectId: 17, attributes, geometry });
  const query = calls.at(-1);
  assert.equal(query.params.get('where'), '1=1');
  assert.equal(query.params.get('resultRecordCount'), '1');
  assert.equal(query.params.get('orderByFields'), 'CreationDate DESC,objectid DESC');
  assert.equal(query.params.get('returnGeometry'), 'true');
  assert.equal(query.params.get('outSR'), '4326');
  assert.deepEqual(query.params.get('outFields').split(',').sort(), ['whats_on_your_mind', 'objectid', 'CreationDate', 'Emojis', 'geoglyph_speaks', 'random_font', 'choose_a_font_font', 'choose_a_colour_colour', '_size_size', '_2d_or_3d', 'fit', 'animation', 'special_commands'].sort());
  assert.equal(query.options.method, 'POST');
  assert.equal(query.options.credentials, 'omit');
  assert.equal(query.options.cache, 'no-store');
  assert.equal(query.params.has('token'), false);
  assert.equal(query.url.search, '');
});

test('optional cue fields remain optional and an empty table yields no latest cue', async () => {
  const { client } = fixture([{ tables: [{ id: 7 }] }, metadata(), { features: [] }]);
  const [layer] = await client.discover();
  assert.equal(layer.cueFields.emojis, '');
  assert.equal(layer.cueFields.animation, '');
  assert.equal(layer.cueFields.special_commands, '');
  assert.equal(layer.cueFields.whats_on_your_mind, config.field);
  assert.equal(await client.latestCue(layer), null);
});

test('new cue paging returns every record in ascending Object ID order including duplicate text and no content', async () => {
  const feature = (objectid, extra = {}) => ({ attributes: { objectid, [config.field]: 'same', ...extra } });
  const { client, calls } = fixture([{ layers: [{ id: 7 }] }, cueMetadata(),
    { features: [feature(11), feature(12)], exceededTransferLimit: true },
    { features: [feature(15, { [config.field]: null, fit: 'Fit' }), feature(19)], exceededTransferLimit: true },
    { features: [] }]);
  const [layer] = await client.discover();
  const cues = await client.afterCues(layer, 10);
  assert.deepEqual(cues.map(cue => cue.objectId), [11, 12, 15, 19]);
  assert.equal(cues[2].attributes.fit, 'Fit');
  assert.equal(cues[0].geometry, null);
  assert.deepEqual(calls.slice(2).map(call => call.params.get('where')), ['objectid>10', 'objectid>12', 'objectid>19']);
  for (const { params, options } of calls.slice(2)) {
    assert.equal(params.get('orderByFields'), 'objectid ASC');
    assert.equal(params.get('resultOffset'), '0');
    assert.equal(params.get('resultRecordCount'), '2');
    assert.equal(params.get('returnGeometry'), 'true');
    assert.equal(params.get('outSR'), '4326');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.method, 'POST');
  }
});

test('cue transport preserves invalid point values so placement rules can report them', async () => {
  const geometry = { x: 500, y: 'not a latitude' };
  const { client } = fixture([{ layers: [{ id: 7 }] }, metadata(), { features: [{ attributes: { objectid: 1 }, geometry }] }]);
  const [layer] = await client.discover();
  assert.deepEqual((await client.latestCue(layer)).geometry, geometry);
});

test('cue transport rejects malformed records, invalid cursors and non-progressing pages', async () => {
  for (const reply of [null, [], {}, { features: {} }, { features: [null] }, { features: [{ attributes: [] }] }, { features: [{ attributes: { objectid: '2' } }] }]) {
    const { client } = fixture([{ layers: [{ id: 7 }] }, metadata(), reply]);
    await assert.rejects(client.latestCue((await client.discover())[0]));
  }
  for (const ids of [[2, 2], [3, 2], [1, 2]]) {
    const { client } = fixture([{ layers: [{ id: 7 }] }, metadata(), { features: ids.map(objectid => ({ attributes: { objectid } })) }]);
    await assert.rejects(client.afterCues((await client.discover())[0], 1), /changed during paging/);
  }
  const { client, calls } = fixture([{ layers: [{ id: 7 }] }, metadata()]);
  const [layer] = await client.discover();
  for (const cursor of [-1, '1', Infinity, NaN, 1.5]) await assert.rejects(client.afterCues(layer, cursor), /valid submission Object ID/);
  assert.equal(calls.length, 2, 'invalid cursors must never reach the service');
});

test('cue polling cancellation aborts the active query and never starts another page', async () => {
  const controller = new AbortController();
  let requests = 0;
  const client = create({ fetch: async (url, options) => {
    requests++;
    if (requests < 3) return { ok: true, status: 200, json: async () => requests === 1 ? { layers: [{ id: 7 }] } : metadata() };
    assert.equal(options.method, 'POST');
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
      controller.abort();
    });
  } });
  const [layer] = await client.discover();
  await assert.rejects(client.afterCues(layer, 1, { signal: controller.signal }), { name: 'AbortError' });
  assert.equal(requests, 3);
});
