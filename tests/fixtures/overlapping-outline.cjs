// The bridge's corners lie inside the legs, while its edges cross the gap.
// Its union has area 140, one counter, and no internal component seams.
const arch = [[0,0],[10,0],[10,20],[7,20],[7,3],[3,3],[3,20],[0,20],[0,0]];
const bridge = [[2,10],[8,10],[8,12],[2,12],[2,10]];

function contours() { return [arch,bridge].map(ring => ring.map(point => point.slice())); }
function commandsFor(rings) {
  return rings.flatMap(ring => [...ring.slice(0,-1).map(([x,y],i) => ({type:i?'L':'M',x,y})),{type:'Z'}]);
}
function fontFor(rings) {
  const commands=commandsFor(rings);
  const glyph={index:1,advanceWidth:16,getPath:()=>({commands})};
  return {unitsPerEm:1000,stringToGlyphs:text=>[...text].map(()=>glyph),getKerningValue:()=>0};
}
function fontBuffer() {
  const opentype=require('../../src/vendor/opentype.js');
  const path=new opentype.Path();
  for(const c of commandsFor(contours())) {
    if(c.type==='M')path.moveTo(c.x*40,c.y*40);
    else if(c.type==='L')path.lineTo(c.x*40,c.y*40);
    else path.close();
  }
  return Buffer.from(new opentype.Font({familyName:'Overlapping Outline Fixture',styleName:'Regular',unitsPerEm:1000,ascender:900,descender:-200,glyphs:[
    new opentype.Glyph({name:'.notdef',advanceWidth:600,path:new opentype.Path()}),
    new opentype.Glyph({name:'A',unicode:65,advanceWidth:600,path})
  ]}).toArrayBuffer());
}
module.exports={contours,fontFor,fontBuffer};
