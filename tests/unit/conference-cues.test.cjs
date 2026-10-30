const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const { resolve, fonts } = require('../../src/scripts/conference-cues.js');

test('special commands take precedence over all content and controls including emojis', () => {
  for (const [value, command] of [[' Begin ', 'begin'], ['RESET', 'reset']]) {
    const result = resolve({ objectId:42, attributes:{ SPECIAL_COMMANDS:value, emojis:'👋',
      geoglyph_speaks:'Ignored', animation:'Face', random_font:'Yes', fit:'Fit' } });
    assert.deepEqual(result, { command, objectId:42, warnings:[] });
  }
  const cues = require('../../src/scripts/conference-cues.js');
  assert.equal(cues.command({ special_commands:'begin' }), 'begin');
  assert.equal(cues.command({ special_commands:null }), undefined);
  assert.equal(resolve({ special_commands:'', emojis:'👋' }).message, '👋');
  const unknown = resolve({ special_commands:'Other', whats_on_your_mind:'Hello' });
  assert.equal(unknown.message, 'Hello');
  assert.match(unknown.warnings[0], /Unknown special_commands/);
});
const textContext = { content: { kind: 'text', message: 'Previous' }, lastTextFont: 'Forte', currentFont: 'Forte', extrusionEnabled: true };
const feature = (attributes, geometry) => ({ attributes, geometry });

test('exports the same pure resolver to the browser global', () => {
  const sandbox = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../src/scripts/conference-cues.js'), 'utf8'), sandbox);
  assert.equal(typeof sandbox.GeoGlyphConferenceCues.resolve, 'function');
  assert.equal(sandbox.GeoGlyphConferenceCues.resolve({ emojis: '😴' }).font, 'Segoe UI Emoji');
  assert.deepEqual(fonts, ['Gill Sans', 'Forte', 'Chiller', 'Magneto', 'Showcard Gothic']);
});

test('emoji wins and enforces its complete drawing policy before applying shared controls', () => {
  const result = resolve(feature({ OBJECTID: 19, EMOJIS: ' 😴 ', geoglyph_speaks: 'speech', whats_on_your_mind: 'thought',
    random_font: 'Yes', choose_a_font_font: 'Chiller', choose_a_colour_colour: 'Orange', _2d_or_3d: '3D', animation: 'Turn',
    _size_size: 'Huge', fit: 'Fit' }, { x: 138.6, y: -34.9, spatialReference: { wkid: 4326 } }), textContext);
  assert.equal(result.objectId, 19);
  assert.equal(result.kind, 'emoji');
  assert.equal(result.message, '😴');
  assert.equal(result.font, 'Segoe UI Emoji');
  assert.equal(result.nativeColor, true);
  assert.equal(result.extrusionEnabled, false);
  assert.equal(result.random, false);
  assert.equal(result.animation, undefined);
  assert.equal(result.fill, undefined);
  assert.equal(result.fit, true);
  assert.equal(result.height, 300000);
  assert.equal(result.depth, 6000);
  assert.deepEqual(result.anchor, { lng: 138.6, lat: -34.9 });
  assert.deepEqual(result.nextContent, { kind: 'emoji', message: '😴' });
});

test('speech precedes thoughts and text restores the last text font', () => {
  const result = resolve({ emojis: ' ', geoglyph_speaks: ' Hello ', whats_on_your_mind: 'Other' }, {
    ...textContext, content: { kind: 'emoji', message: '😴' }, currentFont: 'Segoe UI Emoji'
  });
  assert.equal(result.kind, 'text');
  assert.equal(result.message, 'Hello');
  assert.equal(result.font, 'Forte');
  assert.equal(result.nativeColor, false);
  assert.equal(resolve({ whats_on_your_mind: 'Thought' }).font, 'Gill Sans');
});

test('controls-only submissions retain content and protect an existing emoji', () => {
  const context = { content: { kind: 'emoji', message: '👋' }, lastTextFont: 'Chiller', extrusionEnabled: true };
  const emoji = resolve({ _2d_or_3d: '3D', animation: 'Face', random_font: 'Yes' }, context);
  assert.deepEqual(emoji.nextContent, context.content);
  assert.equal(emoji.font, 'Segoe UI Emoji');
  assert.equal(emoji.extrusionEnabled, false);
  assert.equal(emoji.animation, undefined);
  assert.equal(emoji.random, false);
  const text = resolve({ _2d_or_3d: '2D', fit: 'Fit' }, textContext);
  assert.deepEqual(text.nextContent, textContext.content);
  assert.equal(text.extrusionEnabled, false);
  assert.equal(text.fit, true);
  assert.equal(resolve({}).kind, 'emoji');
});

test('all explicit fonts resolve and Random Yes overrides the explicit font', () => {
  for (const font of fonts) assert.equal(resolve({ choose_a_font_font: ` ${font.toUpperCase()} ` }, textContext).font, font);
  const result = resolve({ choose_a_font_font: 'Chiller', random_font: ' YES ' }, textContext);
  assert.equal(result.random, true);
  assert.equal(result.font, 'Forte');
  assert.equal(resolve({ random_font: 'No' }, textContext).random, false);
  assert.ok(!fonts.includes('Segoe UI Emoji'));
});

test('every size uses its exact height and depth even in 2D', () => {
  for (const [label, height, depth] of [['Small', 300, 30], ['Medium', 3000, 300], ['Large', 30000, 3000], ['Huge', 300000, 6000]]) {
    const result = resolve({ _size_size: ` ${label.toUpperCase()} `, _2d_or_3d: '2D' }, textContext);
    assert.equal(result.height, height);
    assert.equal(result.depth, depth);
    assert.equal(result.extrusionEnabled, false);
  }
});

test('bright colours resolve without supplying an outline change', () => {
  for (const [colour, fill] of Object.entries({ Green: '#3FDE78', Orange: '#F47D22', Blue: '#429EFF', Purple: '#B978FF', Yellow: '#FFDF3A', Pink: '#FF6288' })) {
    const result = resolve({ choose_a_colour_colour: ` ${colour.toUpperCase()} ` }, textContext);
    assert.equal(result.fill, fill);
    assert.equal(result.outline, undefined);
  }
});

test('animation overrides explicit 2D and blank animation preserves mode without a restart command', () => {
  for (const [animation, mode] of [['Orbit', 'fixed'], ['Turn', 'yaw'], ['Face', 'billboard']]) {
    const result = resolve({ animation: ` ${animation.toUpperCase()} `, _2d_or_3d: '2D' }, textContext);
    assert.equal(result.animation, mode);
    assert.equal(result.extrusionEnabled, true);
  }
  assert.equal(resolve({}, textContext).extrusionEnabled, true);
  assert.equal(resolve({}, textContext).animation, undefined);
  assert.equal(resolve({ _2d_or_3d: '3D' }, { ...textContext, extrusionEnabled: false }).extrusionEnabled, true);
});

test('invalid enum values warn and preserve current settings', () => {
  const result = resolve({ random_font: 'sometimes', choose_a_font_font: 'Arial', choose_a_colour_colour: 'beige',
    _size_size: 'Tiny', _2d_or_3d: '4D', animation: 'spin', fit: 'maybe' }, textContext);
  assert.equal(result.warnings.length, 7);
  assert.equal(result.font, 'Forte');
  assert.equal(result.extrusionEnabled, true);
  assert.equal(result.height, undefined);
  assert.equal(result.fill, undefined);
  assert.equal(result.animation, undefined);
  assert.equal(result.fit, false);
});

test('valid points become anchors and invalid points preserve placement with a warning', () => {
  assert.deepEqual(resolve(feature({}, { x: -180, y: 85.051129 })).anchor, { lng: -180, lat: 85.051129 });
  for (const geometry of [{ x: NaN, y: 0 }, { x: 181, y: 0 }, { x: 0, y: -86 }, { x: '138', y: -34 },
    { x: 0, y: Infinity }, {}, { x: 138, y: -34, spatialReference: { wkid: 3857 } }]) {
    const result = resolve(feature({}, geometry));
    assert.equal(result.anchor, undefined);
    assert.equal(result.warnings.length, 1);
  }
  assert.deepEqual(resolve(feature({}, null)).warnings, []);
});

test('Survey123 default origin preserves placement and still applies cue controls', () => {
  const result = resolve(feature({ geoglyph_speaks:'LOCATE', _size_size:'Medium', fit:'Fit', animation:'Turn' }, { x:0, y:0 }), textContext);
  assert.equal(result.anchor, undefined);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.message, 'LOCATE');
  assert.equal(result.height, 3000);
  assert.equal(result.depth, 300);
  assert.equal(result.fit, true);
  assert.equal(result.animation, 'yaw');
  assert.deepEqual(resolve(feature({}, { x:0, y:-34 })).anchor, { lng:0, lat:-34 });
  assert.deepEqual(resolve(feature({}, { x:138, y:0 })).anchor, { lng:138, lat:0 });
});

test('new content requests automatic fitting independently of explicit Fit and text equality', () => {
  for (const field of ['emojis','geoglyph_speaks','whats_on_your_mind']) {
    const result = resolve({ [field]:'Previous' }, textContext);
    assert.equal(result.hasNewContent, true);
    assert.equal(result.fit, false);
  }
  assert.equal(resolve({ emojis:' ', geoglyph_speaks:'\n', whats_on_your_mind:null }, textContext).hasNewContent, false);
  const control = resolve({ fit:'Fit', _2d_or_3d:'3D' }, textContext);
  assert.equal(control.hasNewContent, false);
  assert.equal(control.fit, true);
  const both = resolve({ whats_on_your_mind:'New message', fit:'Fit' }, textContext);
  assert.equal(both.hasNewContent, true);
  assert.equal(both.fit, true);
});

test('resolving does not mutate feature, context or nested data', () => {
  const raw = feature({ objectid: 4, whats_on_your_mind: 'Hi', _size_size: 'Medium' }, { x: 138, y: -34 });
  const before = JSON.stringify({ raw, context: textContext });
  resolve(raw, textContext);
  assert.equal(JSON.stringify({ raw, context: textContext }), before);
});
