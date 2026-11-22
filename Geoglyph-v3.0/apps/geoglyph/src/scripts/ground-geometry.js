(function (root) {
  'use strict';
  const LIMIT = 200000;
  const fontCaches = new WeakMap();
  const area = ring => ring.reduce((s, p, i) => i ? s + ring[i - 1][0] * p[1] - p[0] * ring[i - 1][1] : s, 0) / 2;
  const same = (a, b) => Math.abs(a[0] - b[0]) < 1e-8 && Math.abs(a[1] - b[1]) < 1e-8;
  // Exact curve extrema keep placement and scale independent of tessellation LOD.
  function pathBounds(commands) {
    const points = []; let at = [0, 0], start = at;
    const bezier = (values, t) => { let v=values.slice(); for(let n=v.length-1;n>0;n--) for(let i=0;i<n;i++) v[i]=v[i]*(1-t)+v[i+1]*t; return v[0]; };
    for (const c of commands) {
      if (c.type === 'M') { at=[c.x,c.y]; start=at; points.push(at); }
      else if (c.type === 'Z') at=start;
      else if (['L','Q','C'].includes(c.type)) {
        const end=[c.x,c.y], control=c.type==='Q'?[[c.x1,c.y1]]:c.type==='C'?[[c.x1,c.y1],[c.x2,c.y2]]:[];
        const axes=[0,1].map(axis=>[at[axis],...control.map(p=>p[axis]),end[axis]]);
        points.push(at,end);
        for(const values of axes) {
          let roots=[];
          if(values.length===3) { const d=values[0]-2*values[1]+values[2]; if(Math.abs(d)>1e-12) roots=[(values[0]-values[1])/d]; }
          if(values.length===4) {
            const [p0,p1,p2,p3]=values,a=-p0+3*p1-3*p2+p3,b=2*(p0-2*p1+p2),d=p1-p0;
            if(Math.abs(a)<1e-12) { if(Math.abs(b)>1e-12) roots=[-d/b]; }
            else { const disc=b*b-4*a*d; if(disc>=0) roots=[(-b+Math.sqrt(disc))/(2*a),(-b-Math.sqrt(disc))/(2*a)]; }
          }
          for(const t of roots) if(t>0&&t<1) points.push(axes.map(values=>bezier(values,t)));
        }
        at=end;
      }
    }
    return bounds([points]);
  }
  function bounds(rings) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const ring of rings) for (const p of ring) { minX = Math.min(minX, p[0]); minY = Math.min(minY, p[1]); maxX = Math.max(maxX, p[0]); maxY = Math.max(maxY, p[1]); }
    if (!Number.isFinite(minX)) return { minX:0, minY:0, maxX:0, maxY:0, width:0, height:0, cx:0, cy:0 };
    return { minX, minY, maxX, maxY, width:maxX-minX, height:maxY-minY, cx:(minX+maxX)/2, cy:(minY+maxY)/2 };
  }
  function distance(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    if (!dx && !dy) return Math.hypot(p[0] - a[0], p[1] - a[1]);
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }
  function flatten(commands, tolerance = 0.6, limit = LIMIT) {
    let ring = [], current = [0, 0], rings = [], vertices = 0;
    const append = p => { if (!p.every(Number.isFinite)) throw Error('Invalid font coordinates'); if (++vertices > limit) throw Error('Geometry vertex budget exceeded'); if (!ring.length || !same(ring[ring.length - 1], p)) ring.push(p); current = p; };
    const finish = () => { if (ring.length > 2) { if (!same(ring[0], ring[ring.length - 1])) ring.push(ring[0].slice()); if (Math.abs(area(ring)) > 1e-7) rings.push(ring); } ring = []; };
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    function quadratic(a, b, c, depth) {
      if (depth >= 16 || distance(b, a, c) <= tolerance) return append(c);
      const ab = mid(a, b), bc = mid(b, c), center = mid(ab, bc); quadratic(a, ab, center, depth + 1); quadratic(center, bc, c, depth + 1);
    }
    function cubic(a, b, c, d, depth) {
      if (depth >= 16 || Math.max(distance(b, a, d), distance(c, a, d)) <= tolerance) return append(d);
      const ab = mid(a, b), bc = mid(b, c), cd = mid(c, d), abc = mid(ab, bc), bcd = mid(bc, cd), center = mid(abc, bcd);
      cubic(a, ab, abc, center, depth + 1); cubic(center, bcd, cd, d, depth + 1);
    }
    for (const c of commands) {
      if (c.type === 'M') { finish(); append([c.x, c.y]); }
      else if (c.type === 'L') append([c.x, c.y]);
      else if (c.type === 'Q') quadratic(current, [c.x1, c.y1], [c.x, c.y], 0);
      else if (c.type === 'C') cubic(current, [c.x1, c.y1], [c.x2, c.y2], [c.x, c.y], 0);
      else if (c.type === 'Z') finish();
    }
    finish(); return rings;
  }
  function contains(point, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[j], b = ring[i];
      if (distance(point, a, b) < 1e-7) return true;
      if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }
  function intersects(a, b, c, d) {
    const cross = (p, q, r) => (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
    if (Math.max(a[0],b[0])+1e-8 < Math.min(c[0],d[0]) || Math.max(c[0],d[0])+1e-8 < Math.min(a[0],b[0]) || Math.max(a[1],b[1])+1e-8 < Math.min(c[1],d[1]) || Math.max(c[1],d[1])+1e-8 < Math.min(a[1],b[1])) return false;
    const x=cross(a,b,c), y=cross(a,b,d), z=cross(c,d,a), w=cross(c,d,b);
    return ((x<=1e-8&&y>=-1e-8)||(y<=1e-8&&x>=-1e-8))&&((z<=1e-8&&w>=-1e-8)||(w<=1e-8&&z>=-1e-8));
  }
  function boundariesIntersect(a, b, sameRing = false) {
    const segments = [];
    [a,b].forEach((ring, group) => { if (sameRing && group) return; for(let i=0;i<ring.length-1;i++) segments.push({a:ring[i],b:ring[i+1],group,i,minX:Math.min(ring[i][0],ring[i+1][0]),maxX:Math.max(ring[i][0],ring[i+1][0])}); });
    segments.sort((x,y)=>x.minX-y.minX);
    for(let i=0;i<segments.length;i++) for(let j=i+1;j<segments.length&&segments[j].minX<=segments[i].maxX+1e-8;j++) {
      const x=segments[i],y=segments[j];
      if(!sameRing&&x.group===y.group) continue;
      if(sameRing&&(Math.abs(x.i-y.i)===1||Math.abs(x.i-y.i)===a.length-2)) continue;
      if(intersects(x.a,x.b,y.a,y.b)) return true;
    }
    return false;
  }
  function classify(rings) {
    const nodes = rings.map(ring => ({ ring, signed: area(ring), box: bounds([ring]), parent: null, winding: 0, polygon: null })).filter(n => Math.abs(n.signed) > 1e-7).sort((a, b) => Math.abs(b.signed) - Math.abs(a.signed));
    const polygons = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      for (let j = i - 1; j >= 0; j--) {
        const candidate = nodes[j], a = candidate.box, b = node.box;
        // Vertices inside a concave contour do not prove full containment:
        // overlapping crossbars can span its gap. Keep those components for union.
        if (a.minX <= b.minX && a.minY <= b.minY && a.maxX >= b.maxX && a.maxY >= b.maxY && node.ring.every(p => contains(p, candidate.ring)) && !boundariesIntersect(node.ring, candidate.ring)) { node.parent = candidate; break; }
      }
      const previous = node.parent?.winding || 0;
      node.winding = previous + Math.sign(node.signed);
      if (!previous && node.winding) { node.polygon = [node.ring]; polygons.push(node.polygon); }
      else if (previous && !node.winding) {
        let owner = node.parent; while (owner && !owner.polygon) owner = owner.parent;
        if (!owner) throw Error('Unresolved font counter'); owner.polygon.push(node.ring);
      }
    }
    for(let i=0;i<nodes.length;i++) {
      const node=nodes[i];
      if(node.ring.length>12000 || boundariesIntersect(node.ring,node.ring,true)) throw Error('Complex or self-crossing outline requires styled raster rendering');
      for(let j=0;j<i;j++) {
        const other=nodes[j], a=node.box,b=other.box;
        if(a.maxX<b.minX||b.maxX<a.minX||a.maxY<b.minY||b.maxY<a.minY) continue;
        if((Math.sign(node.signed)!==Math.sign(other.signed)||!node.winding||!other.winding)&&boundariesIntersect(node.ring,other.ring)) throw Error('Intersecting font counters require styled raster rendering');
      }
    }
    return polygons;
  }
  function glyphShape(font, glyph, tolerance) {
    let cache=fontCaches.get(font);
    if(!cache) { cache={glyphs:new Map(),pairs:new Map(),bytes:0,pathBuilds:0}; fontCaches.set(font,cache); }
    const identity=glyph.index === undefined ? glyph : glyph.index;
    let variants=cache.glyphs.get(identity);
    if(variants?.has(tolerance)) {
      const shape=variants.get(tolerance); cache.glyphs.delete(identity); cache.glyphs.set(identity,variants); return shape;
    }
    if(!variants) {
      variants=new Map();
      const commands=glyph.getPath(0,0,1000).commands||[];
      variants.path={commands,bounds:pathBounds(commands)};
      cache.glyphs.set(identity,variants); cache.pathBuilds++;
    }
    const rings=flatten(variants.path.commands,tolerance);
    let polygons=classify(rings);
    if(polygons.length>1) {
      if(!root.polygonClipping?.union) throw Error('Font contour union unavailable');
      polygons=root.polygonClipping.union(...polygons);
    }
    const shape={polygons,bounds:variants.path.bounds};
    shape.bytes=polygons.reduce((n,p)=>n+p.reduce((m,r)=>m+r.length*16,0),0);
    if(!variants) { variants=new Map(); cache.glyphs.set(identity,variants); }
    variants.set(tolerance,shape); cache.bytes+=shape.bytes;
    while((cache.glyphs.size>1024||cache.bytes>16*1024*1024)&&cache.glyphs.size>1) {
      const [key,value]=cache.glyphs.entries().next().value;
      cache.glyphs.delete(key); for(const item of value.values()) cache.bytes-=item.bytes;
    }
    return shape;
  }
  function cacheStats(font) { const c=fontCaches.get(font); return c?{glyphs:c.glyphs.size,bytes:c.bytes,pathBuilds:c.pathBuilds}:{glyphs:0,bytes:0,pathBuilds:0}; }
  function model(font, text, options = {}) {
    const design = 1000, units = Number(font.unitsPerEm) || design, scale = design / units;
    const tracking = design * (Number(options.tracking) || 0) / 100, lineHeight = design * (Number(options.lineHeight) || 1.15);
    const tolerance = Math.max(0.002, Number(options.tolerance) || 8 / (Math.max(1, Number(options.quality) || 10) + 1));
    const polygons = [], missing = [], placedBounds = []; let vertices = 0;
    for (const [lineIndex, line] of String(text).replace(/\r\n?/g, '\n').split('\n').entries()) {
      const input = options.symbol ? [...line].map(c => { const code = c.codePointAt(0); return !font.charToGlyphIndex(c) && code <= 255 && font.charToGlyphIndex(String.fromCodePoint(code + 0xF000)) ? String.fromCodePoint(code + 0xF000) : c; }).join('') : line;
      const glyphs = font.stringToGlyphs(input);
      const advance = g => Number.isFinite(g.advanceWidth) ? g.advanceWidth * scale : design;
      const kernings=glyphs.map((g,i)=>i+1<glyphs.length?(font.getKerningValue(g,glyphs[i+1])||0)*scale+tracking:0);
      let width = glyphs.reduce((sum, g, i) => sum + advance(g) + kernings[i], 0);
      let x = -width / 2;
      for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        if (!glyph.index && input.trim()) missing.push([...input][i]?.codePointAt(0));
        const shape=glyphShape(font,glyph,tolerance);
        const shapes=shape.polygons.map(p=>p.map(r=>r.map(([px,py])=>[px+x,py+lineIndex*lineHeight])));
        if(shapes.length) placedBounds.push({minX:shape.bounds.minX+x,maxX:shape.bounds.maxX+x,minY:shape.bounds.minY+lineIndex*lineHeight,maxY:shape.bounds.maxY+lineIndex*lineHeight});
        for (const polygon of shapes) for (const ring of polygon) { vertices += ring.length; if (vertices > LIMIT) throw Error('Geometry vertex budget exceeded'); }
        polygons.push(...shapes);
        x += advance(glyph);
        x += kernings[i];
      }
    }
    let result=polygons;
    placedBounds.sort((a,b)=>a.minX-b.minX);
    let overlap=false;
    for(let i=0;!overlap&&i<placedBounds.length;i++) for(let j=i+1;j<placedBounds.length&&placedBounds[j].minX<placedBounds[i].maxX-1e-8;j++) {
      if(placedBounds[j].maxY>placedBounds[i].minY+1e-8&&placedBounds[i].maxY>placedBounds[j].minY+1e-8) { overlap=true; break; }
    }
    if(overlap&&polygons.length>1) {
      if(!root.polygonClipping?.union) throw Error('Overlapping text requires polygon union');
      result=root.polygonClipping.union(...polygons);
      vertices=result.reduce((n,p)=>n+p.reduce((m,r)=>m+r.length,0),0);
    }
    const layoutBounds=bounds(placedBounds.map(b=>[[b.minX,b.minY],[b.maxX,b.maxY]]));
    return { polygons:result, bounds: layoutBounds, vertices, missing: [...new Set(missing.filter(Number.isFinite))], tolerance, cache:cacheStats(font) };
  }
  root.GeoGlyphGeometry = Object.freeze({ flatten, classify, model, bounds, pathBounds, area, contains, cacheStats });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.GeoGlyphGeometry;
})(globalThis);
