// Verify that building this conference copy did not alter the parent project.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const original = path.resolve(process.argv[2] || path.join(root, '..'));
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'validation/original-file-inventory.json'), 'utf8'));
const excluded = new Set(['.git', '.codex', '.agents', '.aws', 'node_modules', 'playwright-report', 'test-results', 'Locate 2026 version']);
const changed = [], missing = [], unexpected = [];
for (const [relative, expected] of Object.entries(inventory)) {
  const file = path.join(original, relative);
  if (!fs.existsSync(file)) missing.push(relative);
  else if (crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') !== expected) changed.push(relative);
}
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && !Object.hasOwn(inventory, path.relative(original, file))) unexpected.push(path.relative(original, file));
  }
}
walk(original);
const result = { checkedAt: new Date().toISOString(), files: Object.keys(inventory).length, unchanged: !changed.length && !missing.length && !unexpected.length, changed, missing, unexpected };
fs.writeFileSync(path.join(root, 'validation/original-files-check.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (!result.unchanged) process.exitCode = 1;
