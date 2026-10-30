const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');
const root = path.resolve(__dirname, '..');
const manifestFile = path.join(root, 'src/assets.json');
const assets = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const styles = assets.filter(a => a.type === 'style' && !a.path.startsWith('src/vendor/'));
if (styles.length <= 1) { console.log('Component styles already consolidated.'); process.exit(0); }
const source = styles.map(a => `/* Component source: ${a.key} */\n${fs.readFileSync(path.join(root, a.path), 'utf8')}`).join('\n\n');
const sheet = postcss.parse(source), rules = [];
sheet.walkRules(rule => rules.push(rule));
const future = new Map();
let removed = 0;
for (const rule of rules.reverse()) {
  const context = [];
  let skip = false;
  for (let parent = rule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
    if (parent.type !== 'atrule' || /keyframes|layer/i.test(parent.name)) { skip = true; break; }
    context.push(`@${parent.name} ${parent.params}`);
  }
  if (skip) continue;
  const key = context.reverse().join('|') + '|' + rule.selector;
  const later = future.get(key) || new Map(), kept = new Map();
  rule.each(declaration => {
    if (declaration.type !== 'decl') return;
    const property = declaration.prop, priority = declaration.important ? 1 : 0;
    if (later.has(property) && later.get(property) >= priority) { declaration.remove(); removed++; }
    else kept.set(property, Math.max(kept.get(property) ?? -1, priority));
  });
  for (const [property, priority] of kept) later.set(property, Math.max(later.get(property) ?? -1, priority));
  future.set(key, later);
  if (!rule.nodes.some(n => n.type === 'decl' || n.type === 'atrule')) rule.remove();
}
const out = 'src/styles/app.css';
fs.writeFileSync(path.join(root, out), sheet.toString() + '\n');
let template = fs.readFileSync(path.join(root, 'src/template.html'), 'utf8');
for (const asset of styles) template = template.replace(`<!-- GE0GLYPH_ASSET:${asset.key} -->`, '');
template = template.replace('<!-- GE0GLYPH_ASSET:geoglyph-maplibre-v530-css -->', '<!-- GE0GLYPH_ASSET:geoglyph-maplibre-v530-css -->\n<!-- GE0GLYPH_ASSET:app-style -->');
const keptAssets = assets.filter(a => !styles.includes(a));
keptAssets.splice(keptAssets.findIndex(a => a.key === 'geoglyph-maplibre-v530-css') + 1, 0, { key:'app-style', type:'style', attrs:'', path:out });
fs.writeFileSync(manifestFile, JSON.stringify(keptAssets, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'src/template.html'), template);
for (const asset of styles) fs.unlinkSync(path.join(root, asset.path));
console.log(`Consolidated ${styles.length} component styles; removed ${removed} superseded declarations; ${Buffer.byteLength(source)} → ${Buffer.byteLength(sheet.toString())} bytes.`);
