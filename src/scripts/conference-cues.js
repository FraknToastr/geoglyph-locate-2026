(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GeoGlyphConferenceCues = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const fonts = Object.freeze(['Gill Sans', 'Forte', 'Chiller', 'Magneto', 'Showcard Gothic']);
  const sizes = Object.freeze({ small: [300, 30], medium: [3000, 300], large: [30000, 3000], huge: [300000, 6000] });
  const colours = Object.freeze({ green: '#3FDE78', orange: '#F47D22', blue: '#429EFF', purple: '#B978FF', yellow: '#FFDF3A', pink: '#FF6288' });
  const animations = Object.freeze({ orbit: 'fixed', turn: 'yaw', face: 'billboard' });
  const text = value => value == null ? '' : String(value).trim();
  const key = value => text(value).toLowerCase();

  function command(raw) {
    const attributes = raw?.attributes || raw || {};
    const name = Object.keys(attributes).find(name => name.toLowerCase() === 'special_commands');
    const value = key(attributes[name]);
    return value === 'begin' || value === 'reset' ? value : undefined;
  }

  // Resolve one submission without changing either the feature or current state.
  // Rendering, font randomness and camera sequencing belong to the engine.
  function resolve(raw, context = {}) {
    raw = raw || {};
    const source = raw.attributes || raw;
    const attributes = Object.create(null);
    Object.keys(source).forEach(name => { attributes[name.toLowerCase()] = source[name]; });
    const get = name => attributes[name];
    const warnings = [];
    // Commands own the entire submission, including submissions with emoji content.
    const special = command(raw);
    if (special) return { command: special, objectId: raw.objectId ?? get('objectid') ?? get('object_id'), warnings };
    function option(name, choices) {
      const value = key(get(name));
      if (!value) return undefined;
      if (Object.prototype.hasOwnProperty.call(choices, value)) return choices[value];
      warnings.push(`Unknown ${name} value: ${text(get(name))}`);
      return undefined;
    }

    if (key(get('special_commands'))) warnings.push(`Unknown special_commands value: ${text(get('special_commands'))}`);
    const emoji = text(get('emojis'));
    const message = emoji || text(get('geoglyph_speaks')) || text(get('whats_on_your_mind'));
    const previous = context.content || { kind: 'emoji', message: '' };
    const kind = message ? (emoji ? 'emoji' : 'text') : previous.kind === 'text' ? 'text' : 'emoji';
    const result = {
      objectId: raw.objectId ?? get('objectid') ?? get('object_id'),
      kind,
      message: message || text(previous.message),
      hasNewContent: Boolean(message),
      font: kind === 'emoji' ? 'Segoe UI Emoji' : context.lastTextFont || 'Gill Sans',
      nativeColor: kind === 'emoji',
      extrusionEnabled: kind === 'emoji' ? false : !!context.extrusionEnabled,
      fit: false,
      random: false,
      warnings,
      nextContent: null
    };
    result.nextContent = { kind: result.kind, message: result.message };

    const size = option('_size_size', sizes);
    if (size) [result.height, result.depth] = size;
    result.fit = option('fit', { fit: true, yes: true, no: false, true: true, false: false }) === true;

    if (raw.geometry != null) {
      const { x, y, spatialReference } = raw.geometry;
      const wkid = spatialReference && (spatialReference.latestWkid || spatialReference.wkid);
      if (typeof x === 'number' && typeof y === 'number' && Number.isFinite(x) && Number.isFinite(y) &&
          x >= -180 && x <= 180 && y >= -85.051129 && y <= 85.051129 && (!wkid || wkid === 4326)) {
        // Survey123 can store (0,0) when the location question is unanswered.
        // For this conference feed it means retain the current anchor. Either
        // zero ordinate alone remains valid (equator and Greenwich points).
        if (x !== 0 || y !== 0) result.anchor = { lng: x, lat: y };
      } else warnings.push('Invalid survey point; retaining the current anchor.');
    }

    // An existing emoji also keeps these restrictions for controls-only cues.
    if (kind === 'emoji') return result;

    result.random = option('random_font', { yes: true, no: false, true: true, false: false }) === true;
    if (!result.random) {
      const fontChoices = Object.fromEntries(fonts.map(font => [key(font), font]));
      const font = option('choose_a_font_font', fontChoices);
      if (font) result.font = font;
    }
    const fill = option('choose_a_colour_colour', colours);
    if (fill) result.fill = fill;
    const extrusion = option('_2d_or_3d', { '2d': false, '3d': true });
    if (extrusion !== undefined) result.extrusionEnabled = extrusion;
    const animation = option('animation', animations);
    if (animation) {
      result.animation = animation;
      result.extrusionEnabled = true;
    }
    return result;
  }

  return Object.freeze({ resolve, command, fonts });
});
