(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.GeoGlyphMessageText=api;
})(globalThis,function(){
  'use strict';
  const segmenter=new Intl.Segmenter(undefined,{granularity:'grapheme'});
  function isEmoji(text){
    return !text.includes('\uFE0E')&&(/\p{Emoji_Presentation}/u.test(text)||/^[#*0-9]\uFE0F?\u20E3$/u.test(text)||(/[\uFE0F\u200D]/u.test(text)&&/\p{Extended_Pictographic}/u.test(text)));
  }
  function runs(text){
    const result=[];
    for(const {segment} of segmenter.segment(String(text))){
      const emoji=isEmoji(segment),last=result[result.length-1];
      if(last?.emoji===emoji)last.text+=segment;
      else result.push({text:segment,emoji});
    }
    return result;
  }
  function hasEmoji(text){return runs(text).some(run=>run.emoji);}
  function nativeColour(record,text,fillOverride=false){
    // Ordinary text keeps the current scripted fill even when it inherits an
    // emoji face. Non-text colour glyphs can still retain their original paint.
    return hasEmoji(text)||(!fillOverride&&!/[\p{Letter}\p{Number}]/u.test(text)&&Boolean(record?.hasColor||/emoji/i.test(record?.name||'')));
  }
  // Keep shaping and kerning within each run. Never split a joined emoji or a
  // combining sequence when measuring or drawing a mixed-font message.
  function measureLine(ctx,text,textFont,emojiFont){
    let width=0,left=0,right=0,ascent=0,descent=0;
    const parts=runs(text||' ').map(run=>{
      const font=run.emoji?emojiFont:textFont;ctx.font=font;
      const metric=ctx.measureText(run.text),x=width;
      left=Math.max(left,(metric.actualBoundingBoxLeft||0)-x);
      right=Math.max(right,x+(metric.actualBoundingBoxRight||metric.width));
      ascent=Math.max(ascent,metric.actualBoundingBoxAscent||0);descent=Math.max(descent,metric.actualBoundingBoxDescent||0);
      width+=metric.width;
      return {...run,font,x};
    });
    return {parts,width,actualBoundingBoxLeft:left,actualBoundingBoxRight:right,actualBoundingBoxAscent:ascent,actualBoundingBoxDescent:descent};
  }
  return Object.freeze({runs,hasEmoji,nativeColour,measureLine});
});
