'use strict';
self.onmessage=function(event){
  const {id,width,height,buffer}=event.data;
  try {
    const canvas=new OffscreenCanvas(width,height),context=canvas.getContext('2d',{willReadFrequently:true});
    context.putImageData(new ImageData(new Uint8ClampedArray(buffer),width,height),0,0);
    const detections=[];
    for(let attempt=0;attempt<25;attempt++){
      const image=context.getImageData(0,0,width,height);
      const code=self.jsQR(image.data,width,height,{inversionAttempts:'attemptBoth'});
      if(!code)break;
      detections.push({rawValue:code.data||'',format:'qr_code'});
      const location=code.location;
      const points=[location.topLeftCorner,location.topRightCorner,location.bottomRightCorner,location.bottomLeftCorner];
      const xs=points.map(point=>point.x),ys=points.map(point=>point.y);
      const padding=Math.max(12,Math.round(Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))*.18));
      const left=Math.max(0,Math.floor(Math.min(...xs)-padding)),top=Math.max(0,Math.floor(Math.min(...ys)-padding));
      const right=Math.min(width,Math.ceil(Math.max(...xs)+padding)),bottom=Math.min(height,Math.ceil(Math.max(...ys)+padding));
      context.fillStyle='#fff';context.fillRect(left,top,right-left,bottom-top);
    }
    self.postMessage({id,result:detections});
  }catch(error){self.postMessage({id,error:error.message||String(error)});}
};
