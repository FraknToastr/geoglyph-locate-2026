import { WebGLRenderer, Scene, Camera, Mesh, BoxGeometry, PlaneGeometry, RawShaderMaterial,
  DataTexture, RGFormat, FloatType, NearestFilter, LinearFilter, ClampToEdgeWrapping, GLSL3,
  Matrix3, Matrix4, Vector2, Vector4, Color, FrontSide, BackSide, DoubleSide, WebGLRenderTarget,
  CustomBlending, MaxEquation, OneFactor, NoBlending } from 'three';

// Both endpoints are immutable GPU resources. Playback changes only uniforms;
// glyph positions and distance-field interpolation happen in the shaders.
const vertexShader = `precision highp float;
in vec3 position;
uniform mat4 uMatrix;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uProgress;
out vec3 vLocal;
void main() {
  vLocal = position;
  vec3 p = position + vec3(mix(uFrom, uTo, uProgress), 0.0);
  gl_Position = uMatrix * vec4(p, 1.0);
}`;

const fragmentShader = `precision highp float;
precision highp int;
uniform sampler2D uFields;
uniform vec2 uTextureSize;
uniform vec4 uRect;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform float uProgress;
uniform mat4 uMatrix;
uniform mat4 uInverse;
uniform mat3 uNormal;
uniform vec2 uViewport;
uniform vec3 uFill;
uniform vec3 uFillLinear;
uniform vec3 uOutline;
uniform float uOutlineLocal;
uniform float uOpacity;
uniform float uPixel;
uniform bool uExtruded;
uniform bool uCoveragePass;
uniform bool uHardwareLinear;
in vec3 vLocal;
out vec4 outColor;

float field(vec2 p) {
  // Field rows follow the font's downward Y axis; model Y points upward.
  vec2 uv = vec2((p.x-uRect.x)/(uRect.z-uRect.x),
                 (uRect.w-p.y)/(uRect.w-uRect.y));
  if(uHardwareLinear){
    vec2 edge=0.5/uTextureSize;
    // The ray loop diverges between pixels; explicit LOD avoids relying on
    // implicit texture derivatives inside that loop (there are no mipmaps).
    vec2 values=textureLod(uFields,clamp(uv,edge,1.0-edge),0.0).rg;
    return mix(values.x,values.y,uProgress);
  }
  vec2 texel = clamp(uv*uTextureSize-0.5, vec2(0.0), uTextureSize-1.0);
  ivec2 lo = ivec2(floor(texel));
  ivec2 hi = min(lo+ivec2(1), ivec2(uTextureSize)-1);
  vec2 f = fract(texel);
  // Manual bilinear sampling works without OES_texture_float_linear.
  vec2 a = mix(texelFetch(uFields,lo,0).rg,
               texelFetch(uFields,ivec2(hi.x,lo.y),0).rg,f.x);
  vec2 b = mix(texelFetch(uFields,ivec2(lo.x,hi.y),0).rg,
               texelFetch(uFields,hi,0).rg,f.x);
  vec2 values = mix(a,b,f.y);
  return mix(values.x,values.y,uProgress);
}
vec2 rayBox(vec3 origin,vec3 direction) {
  vec3 directionSafe = mix(vec3(1e-9),direction,greaterThan(abs(direction),vec3(1e-9)));
  vec3 a = (vec3(uRect.xy,-0.5)-origin)/directionSafe;
  vec3 b = (vec3(uRect.zw, 0.5)-origin)/directionSafe;
  vec3 nearT = min(a,b),farT=max(a,b);
  return vec2(max(max(nearT.x,nearT.y),nearT.z),min(min(farT.x,farT.y),farT.z));
}
vec3 displayColour(vec3 linear){
  return mix(linear*12.92,1.055*pow(max(linear,vec3(0.0)),vec3(1.0/2.4))-0.055,greaterThan(linear,vec3(0.0031308)));
}
void main() {
  vec3 hit=vLocal;
  if(uExtruded) {
    vec2 ndc=gl_FragCoord.xy/uViewport*2.0-1.0;
    vec4 nearP=uInverse*vec4(ndc,-1.0,1.0);
    vec4 farP=uInverse*vec4(ndc,1.0,1.0);
    vec3 origin=nearP.xyz/nearP.w-vec3(mix(uFrom,uTo,uProgress),0.0);
    vec3 direction=normalize(farP.xyz/farP.w-nearP.xyz/nearP.w);
    vec2 range=rayBox(origin,direction);
    float travel=max(range.x,0.0);
    if(range.y<travel)discard;
    float xySpeed=length(direction.xy);
    bool found=false;
    for(int i=0;i<192;i++) {
      hit=origin+direction*travel;
      float distanceToSurface=field(hit.xy)-uOutlineLocal*0.5;
      if(distanceToSurface<uPixel*0.3){found=true;break;}
      // Within the slab, field distance depends only on XY. Divide by XY ray
      // speed so near-normal rays through holes do not take hundreds of tiny
      // steps through the extrusion depth. A perpendicular empty column exits
      // immediately; the first filled sample on a cap is already an exact hit.
      if(xySpeed<1e-8)break;
      travel+=max(distanceToSurface*0.7,uPixel*0.15)/xySpeed;
      if(travel>range.y+uPixel)break;
    }
    if(!found)discard;
  }
  float distanceToGlyph=field(hit.xy);
  float aa=max(fwidth(distanceToGlyph),uPixel*0.2);
  if(!uExtruded && distanceToGlyph>uOutlineLocal*0.5+aa)discard;
  if(uCoveragePass) {
    float outer=1.0-smoothstep(uOutlineLocal*0.5-aa,uOutlineLocal*0.5+aa,distanceToGlyph);
    float inner=1.0-smoothstep(-uOutlineLocal*0.5-aa,-uOutlineLocal*0.5+aa,distanceToGlyph);
    // MAX blending unions all glyphs before applying message opacity. Separate
    // inner/outer coverage prevents overlapping glyph outlines cutting into fill.
    outColor=vec4(inner,outer,0.0,1.0);return;
  }
  vec3 colour=uFill;
  if(uExtruded) {
    float cap=abs(hit.z);
    bool side=cap<0.5-uPixel*0.7;
    if(side) {
      float e=uPixel;
      vec3 normal=normalize(vec3(field(hit.xy+vec2(e,0.0))-field(hit.xy-vec2(e,0.0)),
                                  field(hit.xy+vec2(0.0,e))-field(hit.xy-vec2(0.0,e)),0.0));
      normal=normalize(uNormal*normal);
      // Match the ordinary renderer's MeshLambertMaterial: .62 diffuse,
      // ambient intensity 1.3 and directional intensity 2, in linear colour.
      float light=(1.3+2.0*max(dot(normal,normalize(vec3(-1.0,-2.0,4.0))),0.0))/3.141592653589793;
      colour=displayColour(uFillLinear*0.62*light);
    }
    if(uOutlineLocal>0.0) {
      float edge=side?(0.5-cap):abs(distanceToGlyph);
      colour=mix(uOutline,colour,smoothstep(uOutlineLocal*0.5-aa,uOutlineLocal*0.5+aa,edge));
    }
  } else if(uOutlineLocal>0.0) {
    colour=mix(uFill,uOutline,smoothstep(-uOutlineLocal*0.5-aa,-uOutlineLocal*0.5+aa,distanceToGlyph));
  }
  float coverage=uExtruded?1.0:1.0-smoothstep(uOutlineLocal*0.5-aa,uOutlineLocal*0.5+aa,distanceToGlyph);
  vec3 placed=hit+vec3(mix(uFrom,uTo,uProgress),0.0);
  vec4 clip=uMatrix*vec4(placed,1.0);
  // Write the actual implicit surface depth, never the proxy-box depth.
  gl_FragDepth=clamp(clip.z/clip.w*0.5+0.5,0.0,1.0);
  outColor=vec4(colour,uOpacity*coverage);
}`;

const compositeVertexShader=`precision highp float;
in vec3 position;
out vec2 vUv;
void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,0.0,1.0);}`;
const compositeFragmentShader=`precision highp float;
uniform sampler2D uCoverage;
uniform vec3 uFill;
uniform vec3 uOutline;
uniform float uOpacity;
uniform mat4 uMatrix;
uniform mat4 uInverse;
in vec2 vUv;
out vec4 outColor;
void main(){
  vec2 coverage=texture(uCoverage,vUv).rg;
  if(coverage.y<0.001)discard;
  vec2 ndc=vUv*2.0-1.0;
  vec4 nearP=uInverse*vec4(ndc,-1.0,1.0),farP=uInverse*vec4(ndc,1.0,1.0);
  vec3 origin=nearP.xyz/nearP.w,direction=farP.xyz/farP.w-origin;
  if(abs(direction.z)<1e-9)discard;
  vec3 hit=origin+direction*(-origin.z/direction.z);
  vec4 clip=uMatrix*vec4(hit,1.0);
  gl_FragDepth=clamp(clip.z/clip.w*0.5+0.5,0.0,1.0);
  outColor=vec4(mix(uOutline,uFill,clamp(coverage.x/coverage.y,0.0,1.0)),coverage.y*uOpacity);
}`;

function bounded(value, fallback) { return Number.isFinite(value) ? value : fallback; }
function cancelled(){return Object.assign(new Error('Font morph preparation cancelled.'),{code:'MORPH_CANCELLED'});}
function waitForOperation(signal,operation) {
  if(signal.aborted)return Promise.reject(cancelled());
  return new Promise((resolve,reject)=>{
    let settled=false;
    const finish=(callback,value)=>{if(settled)return;settled=true;clearTimeout(timer);signal.removeEventListener('abort',abort);callback(value);};
    const abort=()=>finish(reject,cancelled());
    const timer=setTimeout(()=>finish(reject,Object.assign(new Error('Font morph GPU preparation timed out. Try a shorter message.'),{code:'MORPH_TIMEOUT'})),30000);
    signal.addEventListener('abort',abort,{once:true});
    Promise.resolve().then(()=>{if(signal.aborted)throw cancelled();return operation();}).then(value=>finish(resolve,value),error=>finish(reject,error));
  });
}
function waitForFrame(signal) {
  let frame;
  return waitForOperation(signal,()=>new Promise(resolve=>{frame=requestAnimationFrame(resolve);})).finally(()=>{if(frame!==undefined)cancelAnimationFrame(frame);});
}
function normalizedBounds(prepared) {
  const source=prepared.fromBounds||prepared.bounds,b=prepared.bounds;
  const height=Math.max(1e-6,bounded(source.height,source.maxY-source.minY));
  const cx=bounded(source.cx,(source.minX+source.maxX)/2),cy=bounded(source.cy,(source.minY+source.maxY)/2);
  return {height,cx,cy,bounds:{minX:(b.minX-cx)/height,maxX:(b.maxX-cx)/height,
    minY:-(b.maxY-cy)/height,maxY:-(b.minY-cy)/height,minZ:-.5,maxZ:.5}};
}

/** A MapLibre custom layer sharing the application's WebGL2 context.
 * getPose receives normalized union bounds and returns geographic/object Matrix4s.
 * getStyle returns {extruded,fill,outline,outlineWidth,opacity,visible}.
 * The caller owns map/camera motion and ordinary-layer visibility.
 */
export function createFontMorphLayer({id='geoglyph-font-morph',map,getPose,getStyle=()=>({}),onError=()=>{},forceManualFiltering=false}) {
  let prepared=null,normalization=null,progress=0,visible=true,disposed=false,resources=[];
  let preparation=0,preparationController=null;
  const staged=new Set();
  let uploads=0,renders=0,uniformUpdates=0,resourceBytes=0,failures=0,lastError='';
  let coverageBytes=0,lastFill,lastOutline,hardwareLinear=false;
  const matrix=new Matrix4(),inverse=new Matrix4(),projection=new Matrix4();
  const normalMatrix=new Matrix3();
  const probeA=new Vector4(),probeB=new Vector4();
  const fillColor=new Color(),fillLinear=new Color(),outlineColor=new Color();
  const layer={id,type:'custom',renderingMode:'3d',ready:false,
    onAdd(_map,gl) {
      if(typeof gl.texStorage2D!=='function')throw new Error('Font morphing requires WebGL 2.');
      hardwareLinear=!forceManualFiltering&&!!gl.getExtension('OES_texture_float_linear');
      this.renderer=new WebGLRenderer({canvas:map.getCanvas(),context:gl,antialias:false});
      this.renderer.autoClear=false;this.scene=new Scene();this.camera=new Camera();this.ready=true;
      this.renderer.debug.onShaderError=(context,program,vertex,fragment)=>{
        throw new Error('Font morph shader could not compile: '+(context.getProgramInfoLog(program)||context.getShaderInfoLog(fragment)||context.getShaderInfoLog(vertex)));
      };
      this.compositeScene=new Scene();this.compositeGeometry=new PlaneGeometry(2,2);
      this.compositeMaterial=new RawShaderMaterial({glslVersion:GLSL3,vertexShader:compositeVertexShader,fragmentShader:compositeFragmentShader,
        uniforms:{uCoverage:{value:null},uFill:{value:fillColor},uOutline:{value:outlineColor},uOpacity:{value:1},uMatrix:{value:matrix},uInverse:{value:inverse}},
        depthWrite:false,depthTest:true,transparent:true,side:DoubleSide});
      this.compositeMaterial.forceSinglePass=true;
      this.compositeMesh=new Mesh(this.compositeGeometry,this.compositeMaterial);this.compositeMesh.frustumCulled=false;this.compositeScene.add(this.compositeMesh);
      this.contextLost=()=>{visible=false;onError(new Error('Graphics context lost. Prepare the font morph again after the map recovers.'));};
      map.getCanvas().addEventListener('webglcontextlost',this.contextLost);
      if(prepared)this.build();
    },
    setModel(model) {
      if(disposed)throw new Error('Font morph layer has been disposed.');
      if(!model?.glyphs?.length||!model?.bounds)throw new Error('No outline glyphs were prepared for morphing.');
      ++preparation;
      preparationController?.abort();
      const candidateNormalization=normalizedBounds(model);
      const next=this.ready?this.buildResources(model,candidateNormalization):[];
      this.release();normalization=candidateNormalization;prepared=model;
      this.install(next);
      map.triggerRepaint();return this.getBounds();
    },
    build() {
      const next=this.buildResources(prepared,normalization);this.release();this.install(next);
    },
    buildResources(model,norm) {
      const {height,cx,cy}=norm,next=[],textures=new Map();
      try {
        for(const glyph of model.glyphs) {
          const source=glyph.fromField||glyph.source,target=glyph.toField||glyph.target;
          if(!source||!target||source.length!==glyph.width*glyph.height||target.length!==source.length)throw new Error('Invalid morph distance field.');
          let variants=textures.get(source);if(!variants){variants=new Map();textures.set(source,variants);}
          let texture=variants.get(target),bytes=0;
          if(!texture){
            const values=new Float32Array(source.length*2);
            for(let i=0;i<source.length;i++){values[i*2]=source[i]/height;values[i*2+1]=target[i]/height;}
            texture=new DataTexture(values,glyph.width,glyph.height,RGFormat,FloatType);
            texture.minFilter=hardwareLinear?LinearFilter:NearestFilter;texture.magFilter=texture.minFilter;
            texture.wrapS=ClampToEdgeWrapping;texture.wrapT=ClampToEdgeWrapping;texture.generateMipmaps=false;
            texture.flipY=false;texture.needsUpdate=true;
            variants.set(target,texture);bytes=values.byteLength;
          }
          const rect=glyph.bounds||glyph.rect,from=glyph.from||glyph.originA,to=glyph.to||glyph.originB;
          const r=[rect[0]/height,-rect[3]/height,rect[2]/height,-rect[1]/height];
          const uniforms={uFields:{value:texture},uTextureSize:{value:new Vector2(glyph.width,glyph.height)},
            uRect:{value:new Vector4(...r)},uFrom:{value:new Vector2((from[0]-cx)/height,-(from[1]-cy)/height)},
            uTo:{value:new Vector2((to[0]-cx)/height,-(to[1]-cy)/height)},uProgress:{value:progress},
            uMatrix:{value:matrix},uInverse:{value:inverse},uViewport:{value:new Vector2(1,1)},
            uNormal:{value:normalMatrix},
            uFill:{value:fillColor},uFillLinear:{value:fillLinear},uOutline:{value:outlineColor},uOutlineLocal:{value:0},uOpacity:{value:1},
            uPixel:{value:Math.max((r[2]-r[0])/glyph.width,(r[3]-r[1])/glyph.height)},uExtruded:{value:true},uCoveragePass:{value:false},uHardwareLinear:{value:hardwareLinear}};
          const geometry=new BoxGeometry(r[2]-r[0],r[3]-r[1],1);
          geometry.translate((r[0]+r[2])/2,(r[1]+r[3])/2,0);
          const flatGeometry=new PlaneGeometry(r[2]-r[0],r[3]-r[1]);
          flatGeometry.translate((r[0]+r[2])/2,(r[1]+r[3])/2,0);
          const material=new RawShaderMaterial({glslVersion:GLSL3,vertexShader,fragmentShader,uniforms,side:BackSide,
            transparent:false,depthWrite:true,depthTest:true});
          material.forceSinglePass=true;
          const mesh=new Mesh(geometry,material);mesh.frustumCulled=false;
          next.push({texture,material,geometry,flatGeometry,mesh,uniforms,bytes});
        }
      } catch(error) {this.releaseResources(next);throw error;}
      return next;
    },
    install(next) {
      resources=next;
      for(const item of next){this.scene?.add(item.mesh);resourceBytes+=item.bytes;}
    },
    async prepareModel(model,{isCurrent=()=>true,signal}={}) {
      if(!this.ready||disposed)throw new Error('Add the font morph layer to the map before preparing it.');
      if(!model?.glyphs?.length||!model?.bounds)throw new Error('No outline glyphs were prepared for morphing.');
      if(signal?.aborted)throw cancelled();
      preparationController?.abort();
      const controller=new AbortController();preparationController=controller;
      const abort=()=>controller.abort();signal?.addEventListener('abort',abort,{once:true});
      const version=++preparation;let norm,next=[];
      const current=()=>version===preparation&&!disposed&&isCurrent();
      try {
        norm=normalizedBounds(model);next=this.buildResources(model,norm);staged.add(next);
        const uploaded=new Set();
        for(const item of next) {
          if(uploaded.has(item.texture))continue;
          await waitForFrame(controller.signal);
          if(!current())throw cancelled();
          this.renderer.resetState();this.renderer.initTexture(item.texture);this.renderer.resetState();uploads++;uploaded.add(item.texture);
        }
        if(!current())throw cancelled();
        const stage=new Scene();for(const item of next)stage.add(item.mesh);
        this.renderer.resetState();await waitForOperation(controller.signal,()=>this.renderer.compileAsync(stage,this.camera));this.renderer.resetState();
        await waitForOperation(controller.signal,()=>this.renderer.compileAsync(this.compositeScene,this.camera));this.renderer.resetState();
        if(!current())throw cancelled();
        staged.delete(next);this.release();prepared=model;normalization=norm;this.install(next);
        map.triggerRepaint();return this.getBounds();
      } catch(error) {staged.delete(next);this.releaseResources(next);this.renderer?.resetState();throw error;}
      finally {signal?.removeEventListener('abort',abort);if(preparationController===controller)preparationController=null;}
    },
    setProgress(value) {
      progress=Math.max(0,Math.min(1,Number(value)||0));
      for(const item of resources)item.uniforms.uProgress.value=progress;
      uniformUpdates++;map.triggerRepaint();
    },
    setVisible(value){visible=!!value;map.triggerRepaint();},
    getBounds(){return normalization?{...normalization.bounds}:null;},
    ensureCoverageTarget(width,height) {
      // At most 16 MiB for the coverage union, independent of message length.
      // The target retains full device-pixel resolution for ordinary desktops.
      const scale=Math.min(1,Math.sqrt(4194304/(width*height)),4096/width,4096/height);
      const w=Math.max(1,Math.floor(width*scale)),h=Math.max(1,Math.floor(height*scale));
      if(!this.coverageTarget){this.coverageTarget=new WebGLRenderTarget(w,h,{depthBuffer:false,stencilBuffer:false});}
      else if(this.coverageTarget.width!==w||this.coverageTarget.height!==h)this.coverageTarget.setSize(w,h);
      coverageBytes=w*h*4;this.compositeMaterial.uniforms.uCoverage.value=this.coverageTarget.texture;
      return this.coverageTarget;
    },
    render(gl,args) {
      const style=getStyle();
      if(!this.ready||!prepared||!visible||style.visible===false||disposed)return;
      const framebuffer=gl.getParameter(gl.FRAMEBUFFER_BINDING);
      try {
        const pose=getPose(this.getBounds());if(!pose)return;
        projection.fromArray(args.defaultProjectionData?.mainMatrix||args);
        matrix.copy(projection).multiply(pose.geographic).multiply(pose.object);
        if(Math.abs(matrix.determinant())<1e-30)throw new Error('Font morph transform is singular.');
        inverse.copy(matrix).invert();
        normalMatrix.getNormalMatrix(pose.object);
        const canvas=map.getCanvas(),width=gl.drawingBufferWidth,height=gl.drawingBufferHeight;
        const extruded=style.extruded!==false;
        // Raw shaders write directly into MapLibre's sRGB framebuffer. Reuse
        // colour objects so orbit/playback do not create garbage every frame.
        if(lastFill!==(style.fill||'#ffffff')){lastFill=style.fill||'#ffffff';fillLinear.set(lastFill);fillColor.copy(fillLinear).convertLinearToSRGB();}
        if(lastOutline!==(style.outline||'#000000')){lastOutline=style.outline||'#000000';outlineColor.set(lastOutline).convertLinearToSRGB();}
        const ratio=width/Math.max(1,canvas.clientWidth);
        let outlineLocal=0;
        if(style.outlineWidth>0){
          const b=normalization.bounds,px=(b.minX+b.maxX)/2,py=(b.minY+b.maxY)/2;
          let z=0;
          probeA.set(px,py,z,1).applyMatrix4(matrix);
          // The camera can enter the proxy, putting its centre on the eye
          // plane. Measure a visible cap in that case; dividing by w=0 would
          // send NaN outline distances into every ray, even with zero width.
          if(probeA.w<=1e-8&&extruded){
            z=.5;probeA.set(px,py,z,1).applyMatrix4(matrix);
            if(probeA.w<=1e-8){z=-.5;probeA.set(px,py,z,1).applyMatrix4(matrix);}
          }
          probeA.multiplyScalar(1/probeA.w);
          probeB.set(px+.01,py,z,1).applyMatrix4(matrix);probeB.multiplyScalar(1/probeB.w);
          const measured=Math.hypot((probeB.x-probeA.x)*width/2,(probeB.y-probeA.y)*height/2)/.01;
          const pixelsPerUnit=Number.isFinite(measured)&&measured>0?measured:Math.max(1,height);
          outlineLocal=Math.min(.025,style.outlineWidth*ratio/Math.max(1,pixelsPerUnit));
        }
        for(const item of resources) {
          const u=item.uniforms;
          u.uExtruded.value=extruded;u.uCoveragePass.value=!extruded;
          u.uOutlineLocal.value=outlineLocal;u.uOpacity.value=extruded?1:Math.max(0,Math.min(1,style.opacity??1));
          u.uViewport.value.set(width,height);
          item.mesh.geometry=extruded?item.geometry:item.flatGeometry;
          // Transforms are shader uniforms, so Three cannot infer reflected
          // winding from mesh.matrixWorld as it does for ordinary meshes.
          const side=extruded?(pose.object.determinant()<0?FrontSide:BackSide):DoubleSide;
          const transparent=!extruded;
          if(item.material.side!==side||item.material.transparent!==transparent){
            item.material.side=side;item.material.transparent=transparent;item.material.needsUpdate=true;
          }
          item.material.depthWrite=extruded;item.material.depthTest=extruded;
          item.material.blending=extruded?NoBlending:CustomBlending;
          item.material.blendEquation=MaxEquation;item.material.blendSrc=OneFactor;item.material.blendDst=OneFactor;
        }
        this.renderer.resetState();this.renderer.setViewport(0,0,width,height);
        if(extruded){
          this.renderer.state.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
          this.renderer.render(this.scene,this.camera);
        }else{
          const target=this.ensureCoverageTarget(width,height);
          for(const item of resources)item.uniforms.uViewport.value.set(target.width,target.height);
          this.renderer.setRenderTarget(target);this.renderer.setClearColor(0,0);this.renderer.clear(true,false,false);
          this.renderer.render(this.scene,this.camera);
          this.renderer.setRenderTarget(null);this.renderer.state.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);this.renderer.setViewport(0,0,width,height);
          this.compositeMaterial.uniforms.uOpacity.value=Math.max(0,Math.min(1,style.opacity??1));
          this.renderer.render(this.compositeScene,this.camera);
        }
        this.renderer.resetState();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);renders++;
      } catch(error) {
        failures++;lastError=error.message;visible=false;
        this.renderer?.resetState();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);onError(error);
      }
    },
    release() {
      this.releaseResources(resources);
      resources=[];resourceBytes=0;
    },
    releaseResources(items) {
      const textures=new Set();
      for(const item of items){item.mesh.removeFromParent();textures.add(item.texture);item.material.dispose();item.geometry.dispose();item.flatGeometry.dispose();}
      for(const texture of textures){texture.dispose();if(texture.image)texture.image.data=null;}
    },
    stats(){return {ready:this.ready,visible,progress,glyphs:resources.length,uploads,renders,uniformUpdates,bytes:resourceBytes+coverageBytes,fieldBytes:resourceBytes,coverageBytes,filtering:hardwareLinear?'hardware-linear':'manual-bilinear',failures,lastError};},
    onRemove() {
      ++preparation;preparationController?.abort();preparationController=null;this.ready=false;this.release();this.renderer?.dispose();this.renderer=null;
      for(const items of staged)this.releaseResources(items);staged.clear();
      this.coverageTarget?.dispose();this.coverageTarget=null;coverageBytes=0;
      this.compositeMaterial?.dispose();this.compositeGeometry?.dispose();
      map.getCanvas().removeEventListener('webglcontextlost',this.contextLost);
    },
    dispose(){if(disposed)return;disposed=true;visible=false;prepared=null;this.onRemove();}
  };
  return layer;
}

export { normalizedBounds as normalizeMorphBounds };
