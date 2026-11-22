(function (root) {
  'use strict';

  // Font outlines and all returned distances use the same 1000-unit em as
  // GeoGlyphGeometry. Nothing here depends on Canvas or a browser main thread.
  const EM = 1000;
  const DEFAULT_MAX_BYTES = 32 * 1024 * 1024;
  const DEFAULT_MAX_GLYPHS = 256;
  const INF = 1e20;
  const geometry = () => root.GeoGlyphGeometry || (typeof require === 'function' ? require('./ground-geometry.js') : null);
  const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

  function checkCancelled(options) {
    if (typeof options.cancelled === 'function' && options.cancelled()) throw Error('MORPH_CANCELLED');
  }

  function box(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
    return { minX, minY, maxX, maxY };
  }
  function include(target, bounds, x = 0, y = 0) {
    target.minX = Math.min(target.minX, bounds.minX + x);
    target.minY = Math.min(target.minY, bounds.minY + y);
    target.maxX = Math.max(target.maxX, bounds.maxX + x);
    target.maxY = Math.max(target.maxY, bounds.maxY + y);
  }
  function finish(bounds) {
    if (!Number.isFinite(bounds.minX)) bounds = box(0, 0, 0, 0);
    return Object.assign(bounds, { width: bounds.maxX - bounds.minX, height: bounds.maxY - bounds.minY, cx: (bounds.minX + bounds.maxX) / 2, cy: (bounds.minY + bounds.maxY) / 2 });
  }

  // Scanline nonzero winding preserves counters, disconnected parts and
  // overlapping contours. Font contour orientation is not assumed.
  function rasterize(rings, width, height, rect) {
    const mask = new Uint8Array(width * height);
    const stepX = (rect[2] - rect[0]) / width, stepY = (rect[3] - rect[1]) / height;
    const segments = [];
    for (const ring of rings) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[j], b = ring[i];
        if (a[1] !== b[1]) segments.push([a[0], a[1], b[0], b[1]]);
      }
    }
    for (let row = 0; row < height; row++) {
      const y = rect[1] + (row + 0.5) * stepY, crossings = [];
      for (const [ax, ay, bx, by] of segments) {
        if ((ay <= y && by > y) || (by <= y && ay > y)) crossings.push([(ax + (y - ay) * (bx - ax) / (by - ay) - rect[0]) / stepX, by > ay ? 1 : -1]);
      }
      crossings.sort((a, b) => a[0] - b[0]);
      let winding = 0, at = 0;
      for (let column = 0; column < width; column++) {
        while (at < crossings.length && crossings[at][0] <= column + 0.5) winding += crossings[at++][1];
        if (winding !== 0) mask[row * width + column] = 1;
      }
    }
    return mask;
  }

  // Lower envelope of parabolas (Felzenszwalb/Huttenlocher squared Euclidean
  // distance transform), with anisotropic pixel spacing in design units.
  function edtLine(input, output, length, spacing, sites, boundaries) {
    const weight = spacing * spacing;
    let k = 0;
    sites[0] = 0; boundaries[0] = -Infinity; boundaries[1] = Infinity;
    for (let q = 1; q < length; q++) {
      let site = sites[k];
      let split = ((input[q] + weight * q * q) - (input[site] + weight * site * site)) / (2 * weight * (q - site));
      while (k > 0 && split <= boundaries[k]) {
        site = sites[--k];
        split = ((input[q] + weight * q * q) - (input[site] + weight * site * site)) / (2 * weight * (q - site));
      }
      sites[++k] = q; boundaries[k] = split; boundaries[k + 1] = Infinity;
    }
    k = 0;
    for (let q = 0; q < length; q++) {
      while (boundaries[k + 1] < q) k++;
      const distance = q - sites[k];
      output[q] = weight * distance * distance + input[sites[k]];
    }
  }

  function edt(mask, width, height, inside, stepX, stepY) {
    const pixels = width * height, result = new Float64Array(pixels), size = Math.max(width, height);
    const input = new Float64Array(size), output = new Float64Array(size), sites = new Int32Array(size), boundaries = new Float64Array(size + 1);
    for (let y = 0; y < height; y++) {
      const offset = y * width;
      for (let x = 0; x < width; x++) input[x] = mask[offset + x] === inside ? 0 : INF;
      edtLine(input, output, width, stepX, sites, boundaries);
      result.set(output.subarray(0, width), offset);
    }
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) input[y] = result[y * width + x];
      edtLine(input, output, height, stepY, sites, boundaries);
      for (let y = 0; y < height; y++) result[y * width + x] = output[y];
    }
    return result;
  }

  function createField(rings, width, height, rect) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2 || width > 1024 || height > 1024) throw Error('Invalid morph field dimensions');
    if (!Array.isArray(rect) || rect.length !== 4 || !rect.every(Number.isFinite) || rect[2] <= rect[0] || rect[3] <= rect[1]) throw Error('Invalid morph field bounds');
    const mask = rasterize(rings, width, height, rect);
    const stepX = (rect[2] - rect[0]) / width, stepY = (rect[3] - rect[1]) / height;
    const toInside = edt(mask, width, height, 1, stepX, stepY), toOutside = edt(mask, width, height, 0, stepX, stepY);
    const result = new Float32Array(width * height), maxDistance = Math.hypot(rect[2] - rect[0], rect[3] - rect[1]);
    const halfPixel = Math.min(stepX, stepY) * 0.5;
    for (let i = 0; i < result.length; i++) {
      const distance = Math.min(maxDistance, Math.max(0, Math.sqrt(mask[i] ? toOutside[i] : toInside[i]) - halfPixel));
      result[i] = mask[i] ? -distance : distance;
    }
    return result;
  }

  function sample(field, width, height, rect, x, y) {
    const px = Math.max(0, Math.min(width - 1, (x - rect[0]) / (rect[2] - rect[0]) * width - 0.5));
    const py = Math.max(0, Math.min(height - 1, (y - rect[1]) / (rect[3] - rect[1]) * height - 0.5));
    const x0 = Math.floor(px), y0 = Math.floor(py), x1 = Math.min(width - 1, x0 + 1), y1 = Math.min(height - 1, y0 + 1), fx = px - x0, fy = py - y0;
    return (field[y0 * width + x0] * (1 - fx) + field[y0 * width + x1] * fx) * (1 - fy) + (field[y1 * width + x0] * (1 - fx) + field[y1 * width + x1] * fx) * fy;
  }

  function fontLayout(font, text, options, symbol) {
    const geo = geometry();
    if (!geo) throw Error('Morph outline geometry is unavailable');
    if (!font || typeof font.charToGlyph !== 'function' || typeof font.getKerningValue !== 'function') throw Error('Morphing requires an outline-capable font');
    const scale = EM / (Number(font.unitsPerEm) || EM), tracking = EM * finite(options.tracking, 0) / 100;
    const lineHeight = EM * Math.max(0.1, finite(options.lineHeight, 1.15));
    const layout = [], bounds = box(), shapeCache = new Map();
    let index = 0;
    for (const [lineNumber, line] of text.split('\n').entries()) {
      const characters = [...line];
      const mappedCharacters = [];
      const glyphs = characters.map(char => {
        let mapped = char;
        if (symbol && !font.charToGlyphIndex(char) && char.codePointAt(0) <= 255) mapped = String.fromCodePoint(char.codePointAt(0) + 0xF000);
        mappedCharacters.push(mapped);
        const glyph = font.charToGlyph(mapped);
        if (!glyph || (!glyph.index && !/^\s$/u.test(char))) throw Error('The selected font does not contain ' + JSON.stringify(char) + '. Choose another font or remove that character.');
        return glyph;
      });
      if (typeof font.stringToGlyphs === 'function') {
        const shaped = font.stringToGlyphs(mappedCharacters.join(''));
        if (shaped.length !== glyphs.length || shaped.some((glyph, i) => glyph.index !== glyphs[i].index)) throw Error('This message uses contextual shaping or ligatures. Choose unjoined text or another font for morphing.');
      }
      const advance = glyph => Number.isFinite(glyph.advanceWidth) ? glyph.advanceWidth * scale : EM;
      const kernings = glyphs.map((glyph, i) => i + 1 < glyphs.length ? finite(font.getKerningValue(glyph, glyphs[i + 1]), 0) * scale + tracking : 0);
      const lineWidth = glyphs.reduce((sum, glyph, i) => sum + advance(glyph) + kernings[i], 0);
      let x = -lineWidth / 2;
      for (let i = 0; i < glyphs.length; i++) {
        checkCancelled(options);
        const glyph = glyphs[i], key = glyph.index === undefined ? glyph : glyph.index;
        let shape = shapeCache.get(key);
        if (!shape) {
          const commands = glyph.getPath(0, 0, EM).commands;
          const rings = geo.flatten(commands, Math.max(0.05, finite(options.tolerance, 0.4)));
          // Keep raw nonzero-winding contours rather than unioning away glyph
          // correspondence. The distance-field rasterizer resolves overlaps.
          shape = { rings, bounds: geo.pathBounds(commands) };
          shapeCache.set(key, shape);
        }
        const origin = [x, lineNumber * lineHeight];
        layout.push({ char: characters[i], index: index++, glyphIndex: glyph.index, origin, shape });
        if (shape.rings.length) include(bounds, shape.bounds, ...origin);
        x += advance(glyph) + kernings[i];
      }
      index++; // Newline positions preserve stable text identity for diagnostics.
    }
    return { glyphs: layout, bounds: finish(bounds) };
  }

  // Align visible glyphs without changing either endpoint's spacing. Matching
  // letters are preferred, then substitutions, with gaps for extra characters.
  function align(source, target, options) {
    const a = source.filter(glyph => glyph.shape.rings.length);
    const b = target.filter(glyph => glyph.shape.rings.length);
    const width = b.length + 1;
    const costs = new Uint16Array((a.length + 1) * width);
    for (let i = a.length; i >= 0; i--) {
      checkCancelled(options);
      for (let j = b.length; j >= 0; j--) {
        const at = i * width + j;
        if (i === a.length || j === b.length) costs[at] = a.length - i + b.length - j;
        else costs[at] = Math.min(costs[at + width + 1] + Number(a[i].char !== b[j].char), costs[at + width] + 1, costs[at + 1] + 1);
      }
    }
    const pairs = [];
    for (let i = 0, j = 0; i < a.length || j < b.length;) {
      const at = i * width + j;
      if (i < a.length && j < b.length && costs[at] === costs[at + width + 1] + Number(a[i].char !== b[j].char)) pairs.push([a[i++], b[j++]]);
      else if (i < a.length && costs[at] === costs[at + width] + 1) pairs.push([a[i++], null]);
      else pairs.push([null, b[j++]]);
    }
    return pairs;
  }

  function normalizeTarget(layout, fromBounds) {
    const { cx, cy, height } = layout.bounds;
    const scale = fromBounds.height / height;
    const shapes = new Map();
    return layout.glyphs.map(glyph => {
      let shape = shapes.get(glyph.shape);
      if (!shape) {
        const bounds = glyph.shape.bounds;
        shape = { rings: glyph.shape.rings.map(ring => ring.map(([x, y]) => [x * scale, y * scale])),
          bounds: box(bounds.minX * scale, bounds.minY * scale, bounds.maxX * scale, bounds.maxY * scale) };
        shapes.set(glyph.shape, shape);
      }
      return { ...glyph, shape, origin: [(glyph.origin[0] - cx) * scale + fromBounds.cx, (glyph.origin[1] - cy) * scale + fromBounds.cy] };
    });
  }

  // An unmatched glyph collapses to a point inside its ink. The empty
  // endpoint has no negative samples, so no geometry remains at that end.
  function pointField(field, width, height, rect) {
    let center = 0;
    for (let i = 1; i < field.length; i++) if (field[i] < field[center]) center = i;
    const cx = center % width, cy = Math.floor(center / width);
    const dx = (rect[2] - rect[0]) / width, dy = (rect[3] - rect[1]) / height;
    return Float32Array.from(field, (_, i) => Math.max(.001, Math.hypot((i % width - cx) * dx, (Math.floor(i / width) - cy) * dy)));
  }

  function prepare(fontA, fontB, text, options = {}) {
    text = String(text).replace(/\r\n?/g, '\n');
    const commitEndpoint = options.targetMessage !== undefined;
    const targetText = commitEndpoint ? String(options.targetMessage).replace(/\r\n?/g, '\n') : text;
    const maxGlyphs = Math.max(1, Math.min(DEFAULT_MAX_GLYPHS, finite(options.maxGlyphs, DEFAULT_MAX_GLYPHS)));
    if ([text, targetText].some(message => [...message.replace(/\n/g, '')].length > maxGlyphs)) throw Error('Font morphing supports up to ' + maxGlyphs + ' characters. Shorten the message.');
    const from = fontLayout(fontA, text, options, options.symbolA || options.symbol), to = fontLayout(fontB, targetText, options, options.symbolB || options.symbol);
    if (commitEndpoint && (!from.bounds.height || !to.bounds.height)) throw Error('Both morph messages need visible font outlines.');
    const targetGlyphs = commitEndpoint ? normalizeTarget(to, from.bounds) : to.glyphs;
    const layout = text === targetText ? from.glyphs.map((glyph, index) => [glyph, targetGlyphs[index]]) : align(from.glyphs, targetGlyphs, options);
    const bounds = box(), glyphs = [], pairs = new Map();
    const resolution = Math.round(Math.max(64, Math.min(256, finite(options.resolution, 256))));
    const maxBytes = Math.max(1, Math.min(DEFAULT_MAX_BYTES, finite(options.maxBytes, DEFAULT_MAX_BYTES)));
    let bytes = 0;
    // Validate the complete budget before any distance-field allocation.
    for (const [a, b] of layout) {
      checkCancelled(options);
      const ringsA = a?.shape.rings || [], ringsB = b?.shape.rings || [];
      if (!ringsA.length && !ringsB.length) continue;
      const pairKey = String(a?.glyphIndex) + ':' + String(b?.glyphIndex);
      let pair = pairs.get(pairKey);
      if (!pair) {
        const shapeBounds = box();
        if (ringsA.length) include(shapeBounds, a.shape.bounds);
        if (ringsB.length) include(shapeBounds, b.shape.bounds);
        const padding = Math.max(64, finite(options.padding, 64));
        const rect = [shapeBounds.minX - padding, shapeBounds.minY - padding, shapeBounds.maxX + padding, shapeBounds.maxY + padding];
        const longest = Math.max(rect[2] - rect[0], rect[3] - rect[1]);
        const width = Math.max(8, Math.ceil((rect[2] - rect[0]) / longest * resolution));
        const height = Math.max(8, Math.ceil((rect[3] - rect[1]) / longest * resolution));
        bytes += width * height * 8;
        if (bytes > maxBytes) throw Error('Font morph texture budget exceeded. Shorten the message or reduce quality.');
        pair = { rect, width, height, ringsA, ringsB };
        pairs.set(pairKey, pair);
      }
      const fromOrigin = a?.origin || b.origin, toOrigin = b?.origin || a.origin;
      include(bounds, { minX: pair.rect[0], minY: pair.rect[1], maxX: pair.rect[2], maxY: pair.rect[3] }, ...fromOrigin);
      include(bounds, { minX: pair.rect[0], minY: pair.rect[1], maxX: pair.rect[2], maxY: pair.rect[3] }, ...toOrigin);
      glyphs.push({ char: a?.char || b.char, index: a?.index ?? b.index, from: fromOrigin, to: toOrigin, pair });
    }
    if (!glyphs.length) throw Error('Enter a message containing visible font outlines.');
    for (const pair of pairs.values()) {
      checkCancelled(options);
      if (pair.ringsA.length || !commitEndpoint) pair.source = createField(pair.ringsA, pair.width, pair.height, pair.rect);
      checkCancelled(options);
      if (pair.ringsB.length || !commitEndpoint) pair.target = createField(pair.ringsB, pair.width, pair.height, pair.rect);
      if (!pair.source) pair.source = pointField(pair.target, pair.width, pair.height, pair.rect);
      if (!pair.target) pair.target = pointField(pair.source, pair.width, pair.height, pair.rect);
    }
    for (const glyph of glyphs) {
      const pair = glyph.pair;
      glyph.originA = glyph.from; glyph.originB = glyph.to;
      glyph.rect = glyph.bounds = pair.rect; glyph.width = pair.width; glyph.height = pair.height;
      glyph.source = glyph.fromField = pair.source; glyph.target = glyph.toField = pair.target;
      delete glyph.pair;
    }
    return { glyphs, bounds: finish(bounds), fromBounds: from.bounds, toBounds: to.bounds, bytes, unitsPerEm: EM, resolution, sourceText: text, targetText, commitEndpoint };
  }

  function transferables(prepared) {
    const buffers = new Set();
    for (const glyph of prepared.glyphs) { buffers.add(glyph.fromField.buffer); buffers.add(glyph.toField.buffer); }
    return [...buffers];
  }

  root.GeoGlyphMorphFields = Object.freeze({ prepare, createField, rasterize, sample, transferables, maxBytes: DEFAULT_MAX_BYTES, maxGlyphs: DEFAULT_MAX_GLYPHS });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.GeoGlyphMorphFields;
})(globalThis);
