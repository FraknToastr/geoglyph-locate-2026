// Frozen Tier 2 reference (a7a255e), used only for exact canvas pixel comparison.
  function colourGroundMask(saved,options,cssHeight) {
    const {mask,inkHeight}=saved;
    const canvas=document.createElement('canvas');canvas.width=mask.width;canvas.height=mask.height;
    const out=canvas.getContext('2d');out.drawImage(mask,0,0);
    if(!options.nativeColor){out.globalCompositeOperation='source-in';out.fillStyle=mapState.fill;out.fillRect(0,0,canvas.width,canvas.height);out.globalCompositeOperation='source-over';}
    const ratio=cssHeight>0?inkHeight/cssHeight:1;
    const radius=Math.max(0,Math.round(mapState.outlineWidth*ratio*2)/4);
    if(radius>0) {
      if(!saved.outlineMask||saved.outlineRadius!==radius) {
        const outer=document.createElement('canvas'),inner=document.createElement('canvas');
        outer.width=inner.width=mask.width;outer.height=inner.height=mask.height;
        const oc=outer.getContext('2d'),ic=inner.getContext('2d');oc.drawImage(mask,0,0);ic.drawImage(mask,0,0);ic.globalCompositeOperation='destination-in';
        const steps=Math.max(8,Math.min(64,Math.ceil(radius*Math.PI*2)));
        for(let i=0;i<steps;i++){const angle=i*Math.PI*2/steps,x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;oc.drawImage(mask,x,y);ic.drawImage(mask,x,y);}
        oc.globalCompositeOperation='destination-out';oc.drawImage(inner,0,0);
        saved.outlineMask=outer;saved.outlineRadius=radius;
      }
      const tint=document.createElement('canvas');tint.width=canvas.width;tint.height=canvas.height;
      const tc=tint.getContext('2d');tc.drawImage(saved.outlineMask,0,0);tc.globalCompositeOperation='source-in';tc.fillStyle=mapState.outline;tc.fillRect(0,0,tint.width,tint.height);out.drawImage(tint,0,0);
    }
    return {canvas,inkHeight};
  }

