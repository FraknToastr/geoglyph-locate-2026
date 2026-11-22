const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const fields = require('../../src/scripts/font-morph-fields.js');
const opentype = require('../../src/vendor/opentype.js');

function square(x, y, width, height = width, reverse = false) {
  const ring = [[x,y],[x+width,y],[x+width,y+height],[x,y+height],[x,y]];
  return reverse ? ring.reverse() : ring;
}

function fixtureFont({ width = 600, advance = 700, hole = false, kerning = -30, missing = false } = {}) {
  const glyphs = new Map();
  function glyph(char) {
    if (!glyphs.has(char)) {
      const isSpace = char === ' ';
      const rings = isSpace ? [] : [square(0, -800, width, 800), ...(hole ? [square(100, -600, width - 200, 400, true)] : [])];
      const commands = rings.flatMap(ring => [{ type: 'M', x: ring[0][0], y: ring[0][1] }, ...ring.slice(1).map(([x,y]) => ({type:'L', x,y})), {type:'Z'}]);
      glyphs.set(char, { index: missing && char === '?' ? 0 : char.codePointAt(0), advanceWidth: isSpace ? 250 : advance, getPath() { return {commands}; } });
    }
    return glyphs.get(char);
  }
  return { unitsPerEm: 1000, charToGlyph: glyph, charToGlyphIndex: char => glyph(char).index, getKerningValue: () => kerning };
}

test('distance field keeps counters, islands, overlaps and independent reverse contours', () => {
  const rect = [-2,-2,24,14], width = 260, height = 160;
  const rings = [square(0,0,10), square(2,2,6,6,true), square(4,4,2), square(15,0,4,10,true)];
  const field = fields.createField(rings, width, height, rect);
  const sample = (x,y) => fields.sample(field,width,height,rect,x,y);
  assert.ok(sample(1,1)<0, 'outer stroke is solid');
  assert.ok(sample(3,3)>0, 'counter stays empty');
  assert.ok(sample(5,5)<0, 'island inside the counter stays solid');
  assert.ok(sample(17,5)<0, 'independent reversed contour stays solid');
  assert.ok(sample(12,5)>0, 'gap between components stays empty');
  assert.ok(sample(-1,-1)>0, 'padding stays empty');
  const overlap = fields.createField([square(0,0,8),square(4,0,8)],width,height,rect);
  assert.ok(fields.sample(overlap,width,height,rect,6,4)<0, 'same-winding overlap is a union');
});

test('distance values stay in model units and are finite for empty and filled masks', () => {
  const rect = [-5,-5,15,15], field = fields.createField([square(0,0,10)],200,200,rect);
  assert.ok(Math.abs(fields.sample(field,200,200,rect,5,5)+4.95)<0.15);
  assert.ok(Math.abs(fields.sample(field,200,200,rect,12,5)-2)<0.15);
  for (const rings of [[], [square(-100,-100,200)]]) {
    const result = fields.createField(rings,10,10,rect);
    assert.ok(result.every(Number.isFinite));
    assert.ok(result.every(value => rings.length ? value < 0 : value > 0));
  }
  assert.throws(() => fields.createField([],0,10,rect),/dimensions/);
  assert.throws(() => fields.createField([],10,10,[0,0,0,1]),/bounds/);
});

test('aligned font fields morph topology without assuming matching contour counts', () => {
  const source = fixtureFont(), target = fixtureFont({hole:true,width:800,advance:900});
  const result = fields.prepare(source,target,'B',{resolution:128});
  assert.equal(result.glyphs.length,1);
  const glyph = result.glyphs[0];
  const at = (field,x,y) => fields.sample(field,glyph.width,glyph.height,glyph.bounds,x,y);
  assert.ok(at(glyph.fromField,300,-400)<0);
  assert.ok(at(glyph.toField,300,-400)>0);
  assert.deepEqual(glyph.from,[-350,0]);
  assert.deepEqual(glyph.to,[-450,0]);
  assert.equal(result.fromBounds.width,600);
  assert.equal(result.toBounds.width,800);
  assert.equal(result.unitsPerEm,1000);
  assert.ok(result.bounds.minX < -450 && result.bounds.maxX > 350);
  assert.strictEqual(glyph.fromField,glyph.source);
  assert.strictEqual(glyph.toField,glyph.target);
  assert.strictEqual(glyph.from,glyph.originA);
  assert.strictEqual(glyph.bounds,glyph.rect);
});

test('multiline layout interpolates natural advances, kerning and tracking while reusing repeated glyph fields', () => {
  const result=fields.prepare(fixtureFont(),fixtureFont({width:800,advance:900}),'BB\nB B',{tracking:5,lineHeight:1.5});
  assert.equal(result.glyphs.length,4, 'spaces contribute advances but do not allocate fields');
  assert.equal(result.glyphs[1].from[0]-result.glyphs[0].from[0],720, 'advance + kerning + tracking');
  assert.equal(result.glyphs[1].to[0]-result.glyphs[0].to[0],920);
  assert.equal(result.glyphs[2].from[1],1500);
  assert.equal(result.glyphs[3].from[0]-result.glyphs[2].from[0],990, 'space width and both kerning pairs contribute');
  assert.strictEqual(result.glyphs[0].fromField,result.glyphs[3].fromField);
  assert.equal(fields.transferables(result).length,2);
  assert.equal(result.bytes,result.glyphs[0].width*result.glyphs[0].height*8);
  assert.deepEqual(result.glyphs.map(glyph=>glyph.char),['B','B','B','B']);
});

test('a different target message keeps independent layouts and grows or shrinks unmatched glyphs', () => {
  const font = fixtureFont();
  const longer = fields.prepare(font, font, 'AB', {targetMessage:'A\nBB', resolution:64});
  const shorter = fields.prepare(font, font, 'A\nBB', {targetMessage:'AB', resolution:64});
  assert.equal(longer.sourceText, 'AB');
  assert.equal(longer.targetText, 'A\nBB');
  assert.equal(longer.commitEndpoint, true);
  assert.equal(longer.glyphs.length, 3);
  assert.equal(longer.fromBounds.height, 800);
  assert.equal(longer.toBounds.height, 1950);
  assert.equal(shorter.fromBounds.height, longer.toBounds.height);
  assert.equal(shorter.toBounds.height, longer.fromBounds.height);
  const added = longer.glyphs.find(glyph => glyph.fromField.every(distance => distance > 0));
  const removed = shorter.glyphs.find(glyph => glyph.toField.every(distance => distance > 0));
  assert.ok(added && removed);
  assert.ok(added.toField.some(distance => distance < 0));
  assert.ok(removed.fromField.some(distance => distance < 0));
  assert.ok(added.toField.some((distance,index) => distance + added.fromField[index] < 0), 'growth is already visible halfway');
  assert.ok(removed.fromField.some((distance,index) => distance + removed.toField[index] < 0), 'shrinkage is still visible halfway');
  assert.throws(() => fields.prepare(font,font,'A',{targetMessage:'   '}), /Both morph messages/);
  assert.throws(() => fields.prepare(font,font,'A',{targetMessage:'AAA',maxGlyphs:2}), /up to 2/);
});

test('missing glyphs, resource limits, empty messages and cancellation fail before returning partial geometry', () => {
  const font=fixtureFont();
  assert.throws(()=>fields.prepare(font,fixtureFont({missing:true}),'?'),/does not contain/);
  assert.throws(()=>fields.prepare(font,font,'AAA',{maxGlyphs:2}),/up to 2/);
  assert.throws(()=>fields.prepare(font,font,'A',{maxBytes:100}),/budget/);
  assert.throws(()=>fields.prepare(font,font,' \n '),/visible font outlines/);
  assert.throws(()=>fields.prepare(font,font,'A',{cancelled:()=>true}),/MORPH_CANCELLED/);
});

test('contextual shaping and ligatures reject instead of returning a different font endpoint', () => {
  const font = fixtureFont();
  const ligatureFont = { ...fixtureFont(), stringToGlyphs: () => [{index:999}] };
  assert.throws(() => fields.prepare(font,ligatureFont,'fi'), /contextual shaping or ligatures/);
  const substitutedFont = { ...fixtureFont(), stringToGlyphs: () => [{index:999},{index:1000}] };
  assert.throws(() => fields.prepare(font,substitutedFont,'fi'), /contextual shaping or ligatures/);
  const identicalFont = { ...font, stringToGlyphs: text => [...text].map(char=>font.charToGlyph(char)) };
  assert.equal(fields.prepare(font,identicalFont,'fi').glyphs.length,2);
});

test('bundled serif/script and block fonts prepare holes and accented glyphs with finite fields', () => {
  const read = filename => {
    const bytes = fs.readFileSync(path.resolve(__dirname,'../../src/fonts',filename));
    return opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),{lowMemory:true});
  };
  const source=read('GILLUBCD.TTF'), target=read('FORTE.TTF');
  const options={tracking:2,lineHeight:1.2,resolution:64};
  const prepared=fields.prepare(source,target,'Bi8\né',options);
  assert.equal(prepared.glyphs.length,4);
  assert.ok(prepared.bytes>0 && prepared.bytes<1024*1024);
  for(const glyph of prepared.glyphs) {
    assert.ok(glyph.fromField.every(Number.isFinite));
    assert.ok(glyph.toField.every(Number.isFinite));
    assert.ok(glyph.fromField.some(value=>value<0));
    assert.ok(glyph.toField.some(value=>value<0));
  }
  const previous=globalThis.polygonClipping;
  try {
    globalThis.polygonClipping=require('../../src/vendor/polygon-clipping.js');
    const geometry=require('../../src/scripts/ground-geometry.js');
    assert.deepEqual(prepared.fromBounds,geometry.model(source,'Bi8\né',options).bounds);
    assert.deepEqual(prepared.toBounds,geometry.model(target,'Bi8\né',options).bounds);
  } finally { globalThis.polygonClipping=previous; }
  assert.equal(fields.prepare(source,target,'Bi8').resolution,256,'desktop defaults to the full 256-pixel glyph field');
});

test('all ten built-in monochrome font pairs preserve counters, components, accents and endpoint bounds', t => {
  const files = ['GILLUBCD.TTF','FORTE.TTF','CHILLER.TTF','MAGNETOB.TTF','SHOWG.TTF'];
  const fonts = files.map(filename => {
    const bytes=fs.readFileSync(path.resolve(__dirname,'../../src/fonts',filename));
    return opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),{lowMemory:true});
  });
  const text='B8 i\né',options={resolution:64,tracking:2,lineHeight:1.2};
  const previous=globalThis.polygonClipping,geometry=require('../../src/scripts/ground-geometry.js');
  const endpointBounds=[];
  try {
    globalThis.polygonClipping=require('../../src/vendor/polygon-clipping.js');
    for(let i=0;i<fonts.length;i++) {
      try {
        const model=geometry.model(fonts[i],text,options);
        assert.deepEqual(model.missing,[],files[i]+' supplies every requested glyph');
        endpointBounds[i]=model.bounds;
      } catch(error) {
        t.diagnostic(files[i]+' ordinary mesh geometry rejects these outlines: '+error.message);
      }
    }
    let pairs=0;
    for(let a=0;a<fonts.length;a++)for(let b=a+1;b<fonts.length;b++) {
      const label=files[a]+' → '+files[b],prepared=fields.prepare(fonts[a],fonts[b],text,options);
      assert.equal(prepared.glyphs.length,4,label+' retains B, 8, i and é');
      assert.ok(prepared.bytes>0 && prepared.bytes<1024*1024,label+' stays within the low-resolution test budget');
      for(const glyph of prepared.glyphs)for(const field of [glyph.fromField,glyph.toField]) {
        assert.ok(field.every(Number.isFinite),label+' '+glyph.char+' distances are finite');
        assert.ok(field.some(value=>value<0),label+' '+glyph.char+' has a filled region');
        assert.ok(field.some(value=>value>0),label+' '+glyph.char+' has background padding');
      }
      if(endpointBounds[a])assert.deepEqual(prepared.fromBounds,endpointBounds[a],label+' source bounds match existing geometry');
      if(endpointBounds[b])assert.deepEqual(prepared.toBounds,endpointBounds[b],label+' target bounds match existing geometry');
      pairs++;
    }
    assert.equal(pairs,10);
  } finally {globalThis.polygonClipping=previous;}
});
