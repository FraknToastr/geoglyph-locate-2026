const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const put = (p, data) => { const file=path.join(root,p);if(fs.existsSync(file)&&fs.readFileSync(file,'utf8')===data)return;fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, data); };
const esbuild=require('esbuild');
for(const [entry,output,globalName] of [
  ['src/workers/extrusion-entry.js','src/vendor/extrusion-worker.js','GeoGlyphMesh'],
  ['src/scripts/ground-3d.js','src/vendor/ground-3d.js',undefined]
]) {
  const bundle=esbuild.buildSync({absWorkingDir:root,entryPoints:[entry],bundle:true,format:'iife',globalName,minify:true,write:false,target:'es2022',legalComments:'inline'});
  put(output,bundle.outputFiles[0].text);
}
put('src/vendor/licenses/three.txt',read('node_modules/three/LICENSE'));
const version=JSON.parse(read('src/version.json'));
put('src/scripts/version.js',`globalThis.GeoGlyphVersion=Object.freeze(${JSON.stringify(version)});document.title=GeoGlyphVersion.title;document.documentElement.dataset.geoglyphBuild=GeoGlyphVersion.version;\n`);
if (fs.existsSync(path.join(root, 'node_modules/polygon-clipping/dist/polygon-clipping.umd.min.js'))) {
  put('src/vendor/polygon-clipping.js', read('node_modules/polygon-clipping/dist/polygon-clipping.umd.min.js'));
}
const manifest = JSON.parse(read('src/assets.json'));
const licenceNames=fs.readdirSync(path.join(root,'src/vendor/licenses')).sort();
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const licences=licenceNames.map(name=>`<details><summary>${escape(name.replace('.txt',''))}</summary><pre>${escape(read('src/vendor/licenses/'+name))}</pre></details>`).join('\n');
const template = read('src/template.html').replace(/<title>[^<]*<\/title>/,`<title>${version.title}</title>`).replace('<!-- GE0GLYPH_LICENSES -->',`<section class="bundled-licences"><h3>Bundled library licences</h3>${licences}</section>`);
function workerSource(asset) {
  return ['src/vendor/opentype.js', 'src/vendor/polygon-clipping.js', 'src/scripts/ground-geometry.js', 'src/vendor/extrusion-worker.js', asset.path].map(read).join('\n;\n');
}
function render(inline) {
  return manifest.reduce((html, asset) => {
    const attrs = `${asset.attrs || ''} data-geoglyph-asset="${asset.key}"`;
    let tag;
    if (asset.type === 'font-pack') {
      const fonts=JSON.parse(read(asset.path)).map(font=>inline?{...font,data:fs.readFileSync(path.join(root,font.file)).toString('base64')}:font);
      // Local file pages can load classic scripts, but cannot fetch font files.
      // Keep HTTP's individual font requests and supply a generated local pack
      // only when the modular index is opened directly from disk.
      const localPack=path.posix.join(path.posix.dirname(asset.path),'conference-font-data.js');
      if(!inline){
        const localFonts=fonts.map(font=>({...font,data:fs.readFileSync(path.join(root,font.file)).toString('base64')}));
        put(localPack,`globalThis.GeoGlyphConferenceFontData=${JSON.stringify(localFonts).replace(/</g,'\\u003c')};\n`);
      }
      tag=`<script id="geoglyph-conference-fonts" type="application/json"${inline?'':` data-local-font-pack="${localPack}"`}>${JSON.stringify(fonts).replace(/</g,'\\u003c')}</script>`;
    }
    else if (asset.type === 'worker') tag = `<script id="geoglyph-font-worker-source" type="application/json">${JSON.stringify(workerSource(asset)).replace(/</g, '\\u003c')}</script>`;
    else if (inline) {
      const content = read(asset.path).replace(new RegExp(`</${asset.type}`, 'gi'), `<\\/${asset.type}`);
      tag = `<${asset.type}${attrs}>${content}</${asset.type}>`;
    } else tag = asset.type === 'style' ? `<link rel="stylesheet" href="${asset.path}"${attrs}>` : `<script src="${asset.path}"${attrs}></script>`;
    const marker = `<!-- GE0GLYPH_ASSET:${asset.key} -->`;
    if (!html.includes(marker)) throw new Error(`Missing template marker for ${asset.key}`);
    return html.replace(marker, () => tag);
  }, template);
}
const development = render(false), standalone = render(true);
if (/<!-- GE0GLYPH_ASSET:/.test(standalone)) throw new Error('Unresolved asset marker');
put('index.html', development);
put('dist/GeoGlyph.html', standalone);
put('GeoGlyph_Locate_2026.html', standalone);
console.log(`Built development index and standalone GeoGlyph (${Buffer.byteLength(standalone).toLocaleString()} bytes).`);
