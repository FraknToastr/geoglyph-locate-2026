'use strict';
(function () {
  const fonts = new Map(), models = new Map(), meshes = new Map(); let fontBytes = 0, modelBytes = 0, meshBytes = 0, meshBuilds = 0;
  function touch(map, key, value) { map.delete(key); map.set(key, value); }
  function trim(active) {
    for (const [key, entry] of fonts) {
      if (fonts.size <= 2 && fontBytes <= 64 * 1024 * 1024) break;
      if (key === active) continue; fonts.delete(key); fontBytes -= entry.bytes;
    }
    while (modelBytes > 32 * 1024 * 1024 && models.size > 1) { const [key, entry] = models.entries().next().value; models.delete(key); modelBytes -= entry.bytes; }
    while(meshBytes>32*1024*1024&&meshes.size>1){const [key,entry]=meshes.entries().next().value;meshes.delete(key);meshBytes-=entry.bytes;}
  }
  self.onmessage = function (event) {
    const { id, type, payload } = event.data;
    try {
      let result;
      if (type === 'prepare') {
        let entry = fonts.get(payload.key);
        if (!entry) {
          const font = self.opentype.parse(payload.buffer, { lowMemory: true });
          entry = { font, bytes: payload.buffer.byteLength }; fontBytes += entry.bytes;
        }
        touch(fonts, payload.key, entry); trim(payload.key);
        const cmap = entry.font.tables?.cmap?.glyphIndexMap || {};
        const codes = Object.keys(cmap).map(Number).filter(code => code >= 0 && code <= 0x10FFFF && cmap[code] > 0).sort((a, b) => a - b);
        result = { name: entry.font.names?.fullName?.en || entry.font.names?.fontFamily?.en, codes, bytes: entry.bytes };
      } else if (type === 'model') {
        const key = JSON.stringify([payload.key, payload.text, payload.options]); let cached = models.get(key);
        const entry = fonts.get(payload.key); if (entry) touch(fonts, payload.key, entry);
        // Complete models outlive parsed-font eviction; a cache hit needs no font.
        if (!cached) {
          if (!entry) throw Error('FONT_EVICTED');
          const model = self.GeoGlyphGeometry.model(entry.font, payload.text, payload.options); cached = { model, bytes: Math.max(128, model.vertices * 24) }; modelBytes += cached.bytes;
        }
        touch(models, key, cached); trim(payload.key); result = cached.model;
      } else if(type === 'mesh') {
        let entry=meshes.get(payload.key);
        if(!entry){
          const cached=models.get(payload.key),model=payload.model||cached?.model;
          if(!model)throw Error('MESH_MODEL_MISSING');
          if(cached)touch(models,payload.key,cached);
          entry=self.GeoGlyphMesh.build(model);meshes.set(payload.key,entry);meshBytes+=entry.bytes;meshBuilds++;
        }
        touch(meshes,payload.key,entry);trim();result=entry;
      } else if (type === 'clear') { fonts.clear(); models.clear(); meshes.clear(); fontBytes = modelBytes = meshBytes = 0; result = true; }
      else if (type === 'stats') result = { fonts: fonts.size, fontBytes, models: models.size, modelBytes, meshes:meshes.size, meshBytes, meshBuilds };
      else throw Error('Unknown font worker request');
      self.postMessage({ id, result });
    } catch (error) { self.postMessage({ id, error: error.message || String(error) }); }
  };
})();
