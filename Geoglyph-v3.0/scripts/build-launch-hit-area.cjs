'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('../apps/geoglyph/node_modules/playwright-core/lib/utilsBundle.js');
const root = path.resolve(__dirname, '..');

// Some supplied PNGs have trailing bytes after IEND. Decode the image stream
// only and leave the source artwork untouched.
function readImage(file) {
  const bytes = fs.readFileSync(file);
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const end = offset + bytes.readUInt32BE(offset) + 12;
    if (end > bytes.length) break;
    if (bytes.toString('ascii', offset + 4, offset + 8) === 'IEND') {
      return PNG.sync.read(bytes.subarray(0, end));
    }
    offset = end;
  }
  throw Error(`PNG is missing its end chunk: ${file}`);
}

function trace({ width, height, data }) {
  const edges = new Map();
  const stride = width + 1;
  const solid = (x, y) => x >= 0 && x < width && y >= 0 && y < height && data[(y * width + x) * 4 + 3] >= 16;
  function addEdge(x, y, nx, ny, direction) {
    const key = y * stride + x;
    const outgoing = edges.get(key) ?? [];
    outgoing.push({ end: ny * stride + nx, direction, used: false });
    edges.set(key, outgoing);
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!solid(x, y)) continue;
      if (!solid(x, y - 1)) addEdge(x, y, x + 1, y, 0);
      if (!solid(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1, 1);
      if (!solid(x, y + 1)) addEdge(x + 1, y + 1, x, y + 1, 2);
      if (!solid(x - 1, y)) addEdge(x, y + 1, x, y, 3);
    }
  }

  const point = key => [key % stride, Math.floor(key / stride)];
  const loops = [];
  for (const [start, outgoing] of edges) {
    for (const initial of outgoing) {
      if (initial.used) continue;
      const loop = [point(start)];
      let edge = initial;
      while (edge && !edge.used) {
        edge.used = true;
        loop.push(point(edge.end));
        if (edge.end === start) {
          loops.push(loop);
          break;
        }
        // A right turn keeps diagonal contacts from merging two separate loops.
        const priority = [1, 0, 3, 2].map(turn => (edge.direction + turn) % 4);
        const candidates = edges.get(edge.end) ?? [];
        edge = priority.map(direction => candidates.find(next => !next.used && next.direction === direction)).find(Boolean);
      }
    }
  }
  return loops;
}

function area(loop) {
  let sum = 0;
  for (let i = 1; i < loop.length; i++) {
    sum += loop[i - 1][0] * loop[i][1] - loop[i][0] * loop[i - 1][1];
  }
  return Math.abs(sum / 2);
}

function simplify(points, tolerance) {
  const [x, y] = points[0];
  const [endX, endY] = points.at(-1);
  const dx = endX - x;
  const dy = endY - y;
  const length = dx * dx + dy * dy;
  let maximum = 0;
  let split = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const along = length ? Math.max(0, Math.min(1, ((px - x) * dx + (py - y) * dy) / length)) : 0;
    const distance = (px - x - along * dx) ** 2 + (py - y - along * dy) ** 2;
    if (distance > maximum) {
      maximum = distance;
      split = i;
    }
  }
  if (maximum <= tolerance * tolerance) return [points[0], points.at(-1)];
  return [...simplify(points.slice(0, split + 1), tolerance).slice(0, -1), ...simplify(points.slice(split), tolerance)];
}

function outline(png) {
  const minimumArea = 16 * (png.width / 1536) ** 2;
  const tolerance = 2 * png.width / 1536;
  return trace(png)
    .filter(loop => area(loop) >= minimumArea)
    .map(loop => simplify(loop, tolerance))
    .filter(loop => loop.length >= 4 && area(loop) > 0)
    .map(loop => 'M' + loop.slice(0, -1).map(point => point.join(' ')).join('L') + 'Z');
}

const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const button = /<(a|button)\b[^>]*\bdata-launch-app="([a-z-]+)"[^>]*>[\s\S]*?<\/\1>/g;
const count = [...html.matchAll(/data-launch-app=/g)].length;
let generated = 0;
const result = html.replace(button, (markup, _tag, id) => {
  const imageTag = /<img src="(assets\/[^"\n]+\.png)"[^>]*>/;
  const viewBox = /viewBox="0 0 \d+ \d+"/;
  const pathAttribute = new RegExp(`(<path id="${id}-hit-outline" d=")[^"]*"`);
  const source = markup.match(imageTag)?.[1];
  if (!source || !viewBox.test(markup) || !pathAttribute.test(markup)) {
    throw Error(`Missing PNG or hit area markup for ${id}`);
  }
  const png = readImage(path.join(root, source));
  const contours = outline(png);
  if (!contours.length) throw Error(`No visible outline found for ${id}`);
  generated++;
  console.log(`${id}: ${contours.length} contours from ${png.width} × ${png.height} artwork`);
  return markup
    .replace(imageTag, tag => tag.replace(/(width|height)="\d+"/g, (_match, name) => `${name}="${png[name]}"`))
    .replace(viewBox, `viewBox="0 0 ${png.width} ${png.height}"`)
    .replace(pathAttribute, (_match, prefix) => `${prefix}${contours.join('')}"`);
});
if (!generated || generated !== count) throw Error(`Generated ${generated} hit areas for ${count} app controls`);
if (result !== html) fs.writeFileSync(file, result);
