const assert=require('node:assert/strict');
const {runs,hasEmoji,nativeColour,measureLine}=require('../../src/scripts/message-text.js');

for(const emoji of ['😴','👩🏽‍💻','👨‍👩‍👧‍👦','🇦🇺','1️⃣','❤️']){
  assert.deepEqual(runs('Hi '+emoji+'!'),[{text:'Hi ',emoji:false},{text:emoji,emoji:true},{text:'!',emoji:false}]);
  assert.equal(nativeColour({name:'Gill Sans'},emoji,true),true);
}
for(const text of ['Hello','123 #*','©™','♥\uFE0E','e\u0301'])assert.equal(hasEmoji(text),false);
assert.deepEqual(runs('e\u0301'),[{text:'e\u0301',emoji:false}]);
assert.equal(nativeColour({name:'Gill Sans'},'Plain text'),false);
assert.equal(nativeColour({hasColor:true},'Symbol'),false);
assert.equal(nativeColour({hasColor:true},'\uE001'),true);
assert.equal(nativeColour({hasColor:true},'Symbol',true),false);

// The layout uses the fallback face only for complete emoji runs and keeps
// ordinary text together so ligatures and kerning are handled by Canvas.
const measured=[];
const context={font:'',measureText(text){measured.push([text,this.font]);return {width:text==='Hi '?30:text==='😴'?20:5,actualBoundingBoxLeft:1,actualBoundingBoxRight:text==='Hi '?29:text==='😴'?21:6,actualBoundingBoxAscent:8,actualBoundingBoxDescent:2};}};
const layout=measureLine(context,'Hi 😴!','1000px Outline','1000px Emoji');
assert.deepEqual(measured,[['Hi ','1000px Outline'],['😴','1000px Emoji'],['!','1000px Outline']]);
assert.equal(layout.width,55);
assert.equal(layout.actualBoundingBoxRight,56);
assert.deepEqual(layout.parts.map(part=>part.x),[0,30,50]);
console.log('Message emoji segmentation, colour policy and mixed-font layout pass.');
