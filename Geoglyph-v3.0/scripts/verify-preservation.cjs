#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const manifestDirectory = path.resolve(__dirname, '../preservation');
const names = ['geoglyph-v2', 'explorer-suite-v2'];

function matches(name, pattern) {
  const expression = pattern.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return new RegExp(`^${expression}$`).test(name);
}

function inspect(name) {
  const manifest = JSON.parse(fs.readFileSync(path.join(manifestDirectory, name + '.json'), 'utf8'));
  if (!path.isAbsolute(manifest.source) || !Array.isArray(manifest.excluded) ||
      manifest.excluded.some(pattern => typeof pattern !== 'string') ||
      !manifest.sha256 || typeof manifest.sha256 !== 'object' || Array.isArray(manifest.sha256)) {
    throw Error(`${name}: invalid preservation manifest`);
  }
  const expected = manifest.sha256, found = new Set(), changed = [], missing = [], added = [], errors = [];
  for (const [relative, digest] of Object.entries(expected)) {
    if (!relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..') ||
        !/^[a-f\d]{64}$/.test(digest)) throw Error(`${name}: invalid entry ${relative}`);
  }
  function walk(relative = '') {
    const directory = path.join(manifest.source, relative);
    let entries;
    try { entries = fs.readdirSync(directory, { withFileTypes: true }); }
    catch (error) { errors.push(`${relative || '.'}: ${error.code || error.message}`); return; }
    for (const entry of entries) {
      if (manifest.excluded.some(pattern => matches(entry.name, pattern))) continue;
      const item = path.join(relative, entry.name);
      if (entry.isDirectory()) { walk(item); continue; }
      found.add(item);
      if (!Object.hasOwn(expected, item)) { added.push(item); continue; }
      if (!entry.isFile()) { changed.push(`${item} (no longer a regular file)`); continue; }
      try {
        const digest = crypto.createHash('sha256').update(fs.readFileSync(path.join(manifest.source, item))).digest('hex');
        if (digest !== expected[item]) changed.push(item);
      } catch (error) { errors.push(`${item}: ${error.code || error.message}`); }
    }
  }
  walk();
  for (const item of Object.keys(expected)) if (!found.has(item)) missing.push(item);
  const ok = !changed.length && !missing.length && !added.length && !errors.length;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${Object.keys(expected).length} recorded files; ${changed.length} changed, ${missing.length} missing, ${added.length} added, ${errors.length} read errors`);
  for (const [kind, items] of Object.entries({ changed, missing, added, errors })) {
    for (const item of items.sort()) console.error(`  ${kind}: ${item}`);
  }
  return ok;
}

let ok = true;
for (const name of names) {
  try { if (!inspect(name)) ok = false; }
  catch (error) { console.error(`FAIL ${error.message}`); ok = false; }
}
process.exitCode = ok ? 0 : 1;
