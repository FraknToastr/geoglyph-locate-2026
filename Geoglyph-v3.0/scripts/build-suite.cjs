'use strict';
const {spawnSync}=require('node:child_process');
const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..'),app=path.join(root,'apps/geoglyph');
if(!fs.existsSync(path.join(app,'node_modules/esbuild/package.json')))throw Error('Install the copied app dependencies first: npm run setup');
const result=spawnSync(process.execPath,['scripts/build.cjs'],{cwd:app,stdio:'inherit'});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status||1);
console.log('Launcher ready: '+path.join(root,'index.html'));
