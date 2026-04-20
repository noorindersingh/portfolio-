import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

export default function LiquidEther({
  mouseForce = 20, cursorSize = 100, isViscous = false, viscous = 30,
  iterationsViscous = 32, iterationsPoisson = 32, dt = 0.014, BFECC = true,
  resolution = 0.5, isBounce = false, colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  style = {}, className = '', autoDemo = true, autoSpeed = 0.5, autoIntensity = 2.2,
  takeoverDuration = 0.25, autoResumeDelay = 1000, autoRampDuration = 0.6
}) {
  const mountRef = useRef(null);
  const webglRef = useRef(null);
  const rafRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (!mountRef.current) return;

    function makePaletteTexture(stops) {
      let arr = (Array.isArray(stops) && stops.length > 0) ? (stops.length === 1 ? [stops[0], stops[0]] : stops) : ['#ffffff', '#ffffff'];
      const data = new Uint8Array(arr.length * 4);
      arr.forEach((s, i) => {
        const c = new THREE.Color(s);
        data[i*4]=Math.round(c.r*255); data[i*4+1]=Math.round(c.g*255);
        data[i*4+2]=Math.round(c.b*255); data[i*4+3]=255;
      });
      const tex = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
      tex.magFilter = tex.minFilter = THREE.LinearFilter;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false; tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0,0,0,0);

    const face_vert=`attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;precision highp float;void main(){vec3 pos=position;vec2 scale=1.0-boundarySpace*2.0;pos.xy=pos.xy*scale;uv=vec2(0.5)+(pos.xy)*0.5;gl_Position=vec4(pos,1.0);}`;
    const line_vert=`attribute vec3 position;uniform vec2 px;precision highp float;varying vec2 uv;void main(){vec3 pos=position;uv=0.5+pos.xy*0.5;vec2 n=sign(pos.xy);pos.xy=abs(pos.xy)-px*1.0;pos.xy*=n;gl_Position=vec4(pos,1.0);}`;
    const mouse_vert=`precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`;
    const advection_frag=`precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 ratio=max(fboSize.x,fboSize.y)/fboSize;if(isBFECC==false){vec2 vel=texture2D(velocity,uv).xy;vec2 uv2=uv-vel*dt*ratio;vec2 newVel=texture2D(velocity,uv2).xy;gl_FragColor=vec4(newVel,0.0,0.0);}else{vec2 spot_new=uv;vec2 vel_old=texture2D(velocity,uv).xy;vec2 spot_old=spot_new-vel_old*dt*ratio;vec2 vel_new1=texture2D(velocity,spot_old).xy;vec2 spot_new2=spot_old+vel_new1*dt*ratio;vec2 error=spot_new2-spot_new;vec2 spot_new3=spot_new-error/2.0;vec2 vel_2=texture2D(velocity,spot_new3).xy;vec2 spot_old2=spot_new3-vel_2*dt*ratio;vec2 newVel2=texture2D(velocity,spot_old2).xy;gl_FragColor=vec4(newVel2,0.0,0.0);}}`;
    const color_frag=`precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 vel=texture2D(velocity,uv).xy;float lenv=clamp(length(vel),0.0,1.0);vec3 c=texture2D(palette,vec2(lenv,0.5)).rgb;vec3 outRGB=mix(bgColor.rgb,c,lenv);float outA=mix(bgColor.a,1.0,lenv);gl_FragColor=vec4(outRGB,outA);}`;
    const divergence_frag=`precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0.0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0.0)).x;float y0=texture2D(velocity,uv-vec2(0.0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0.0,px.y)).y;float divergence=(x1-x0+y1-y0)/2.0;gl_FragColor=vec4(divergence/dt);}`;
    const externalForce_frag=`precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 circle=(vUv-0.5)*2.0;float d=1.0-min(length(circle),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
    const poisson_frag=`precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y*2.0)).r;float div=texture2D(divergence,uv).r;float newP=(p0+p1+p2+p3)/4.0-div;gl_FragColor=vec4(newP);}`;
    const pressure_frag=`precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x,0.0)).r;float p1=texture2D(pressure,uv-vec2(px.x,0.0)).r;float p2=texture2D(pressure,uv+vec2(0.0,px.y)).r;float p3=texture2D(pressure,uv-vec2(0.0,px.y)).r;vec2 v=texture2D(velocity,uv).xy;vec2 gradP=vec2(p0-p1,p2-p3)*0.5;v=v-gradP*dt;gl_FragColor=vec4(v,0.0,1.0);}`;
    const viscous_frag=`precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 old=texture2D(velocity,uv).xy;vec2 new0=texture2D(velocity_new,uv+vec2(px.x*2.0,0.0)).xy;vec2 new1=texture2D(velocity_new,uv-vec2(px.x*2.0,0.0)).xy;vec2 new2=texture2D(velocity_new,uv+vec2(0.0,px.y*2.0)).xy;vec2 new3=texture2D(velocity_new,uv-vec2(0.0,px.y*2.0)).xy;vec2 newv=4.0*old+v*dt*(new0+new1+new2+new3);newv/=4.0*(1.0+v*dt);gl_FragColor=vec4(newv,0.0,0.0);}`;

    // Common
    const Common = {
      width:0, height:0, pixelRatio:1, renderer:null, clock:null, time:0, delta:0, container:null,
      init(container) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio||1,2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000),0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width,this.height);
        this.renderer.domElement.style.cssText='width:100%;height:100%;display:block;';
        this.clock = new THREE.Clock(); this.clock.start();
      },
      resize() {
        if(!this.container) return;
        const r = this.container.getBoundingClientRect();
        this.width = Math.max(1,Math.floor(r.width));
        this.height = Math.max(1,Math.floor(r.height));
        if(this.renderer) this.renderer.setSize(this.width,this.height,false);
      },
      update() { this.delta=this.clock.getDelta(); this.time+=this.delta; }
    };

    // Mouse
    const Mouse = {
      mouseMoved:false, coords:new THREE.Vector2(), coords_old:new THREE.Vector2(),
      diff:new THREE.Vector2(), timer:null, container:null, listenerTarget:null,
      docTarget:null, isHoverInside:false, hasUserControl:false, isAutoActive:false,
      autoIntensity:2.0, takeoverActive:false, takeoverStartTime:0, takeoverDuration:0.25,
      takeoverFrom:new THREE.Vector2(), takeoverTo:new THREE.Vector2(), onInteract:null,
      init(container) {
        this.container=container;
        this.docTarget=container.ownerDocument;
        this.listenerTarget=window;
        this._mm=this.onMouseMove.bind(this);
        this._ts=this.onTouchStart.bind(this);
        this._tm=this.onTouchMove.bind(this);
        this._te=()=>{ this.isHoverInside=false; };
        this._dl=()=>{ this.isHoverInside=false; };
        window.addEventListener('mousemove',this._mm);
        window.addEventListener('touchstart',this._ts,{passive:true});
        window.addEventListener('touchmove',this._tm,{passive:true});
        window.addEventListener('touchend',this._te);
        this.docTarget.addEventListener('mouseleave',this._dl);
      },
      dispose() {
        window.removeEventListener('mousemove',this._mm);
        window.removeEventListener('touchstart',this._ts);
        window.removeEventListener('touchmove',this._tm);
        window.removeEventListener('touchend',this._te);
        if(this.docTarget) this.docTarget.removeEventListener('mouseleave',this._dl);
      },
      isInside(cx,cy) {
        if(!this.container) return false;
        const r=this.container.getBoundingClientRect();
        return cx>=r.left&&cx<=r.right&&cy>=r.top&&cy<=r.bottom;
      },
      setCoords(x,y) {
        if(!this.container) return;
        if(this.timer) clearTimeout(this.timer);
        const r=this.container.getBoundingClientRect();
        const nx=(x-r.left)/r.width, ny=(y-r.top)/r.height;
        this.coords.set(nx*2-1,-(ny*2-1));
        this.mouseMoved=true;
        this.timer=setTimeout(()=>{ this.mouseMoved=false; },100);
      },
      setNormalized(nx,ny) { this.coords.set(nx,ny); this.mouseMoved=true; },
      onMouseMove(e) {
        this.isHoverInside=this.isInside(e.clientX,e.clientY);
        if(!this.isHoverInside) return;
        if(this.onInteract) this.onInteract();
        if(this.isAutoActive&&!this.hasUserControl&&!this.takeoverActive) {
          const r=this.container.getBoundingClientRect();
          const nx=(e.clientX-r.left)/r.width, ny=(e.clientY-r.top)/r.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx*2-1,-(ny*2-1));
          this.takeoverStartTime=performance.now();
          this.takeoverActive=true; this.hasUserControl=true; this.isAutoActive=false;
          return;
        }
        this.setCoords(e.clientX,e.clientY); this.hasUserControl=true;
      },
      onTouchStart(e) {
        if(e.touches.length!==1) return;
        const t=e.touches[0];
        this.isHoverInside=this.isInside(t.clientX,t.clientY);
        if(!this.isHoverInside) return;
        if(this.onInteract) this.onInteract();
        this.setCoords(t.clientX,t.clientY); this.hasUserControl=true;
      },
      onTouchMove(e) {
        if(e.touches.length!==1) return;
        const t=e.touches[0];
        this.isHoverInside=this.isInside(t.clientX,t.clientY);
        if(!this.isHoverInside) return;
        if(this.onInteract) this.onInteract();
        this.setCoords(t.clientX,t.clientY);
      },
      update() {
        if(this.takeoverActive) {
          const t=(performance.now()-this.takeoverStartTime)/(this.takeoverDuration*1000);
          if(t>=1){ this.takeoverActive=false; this.coords.copy(this.takeoverTo); this.coords_old.copy(this.coords); this.diff.set(0,0); }
          else { const k=t*t*(3-2*t); this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,k); }
        }
        this.diff.subVectors(this.coords,this.coords_old);
        this.coords_old.copy(this.coords);
        if(this.coords_old.x===0&&this.coords_old.y===0) this.diff.set(0,0);
        if(this.isAutoActive&&!this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    };

    // AutoDriver
    class AutoDriver {
      constructor(mouse,manager,opts) {
        this.mouse=mouse; this.manager=manager; this.enabled=opts.enabled;
        this.speed=opts.speed; this.resumeDelay=opts.resumeDelay||3000;
        this.rampDurationMs=(opts.rampDuration||0)*1000; this.active=false;
        this.current=new THREE.Vector2(0,0); this.target=new THREE.Vector2();
        this.lastTime=performance.now(); this.activationTime=0; this.margin=0.2;
        this._tmp=new THREE.Vector2(); this.pickNewTarget();
      }
      pickNewTarget() { this.target.set((Math.random()*2-1)*(1-this.margin),(Math.random()*2-1)*(1-this.margin)); }
      forceStop() { this.active=false; this.mouse.isAutoActive=false; }
      update() {
        if(!this.enabled) return;
        const now=performance.now(), idle=now-this.manager.lastUserInteraction;
        if(idle<this.resumeDelay){ if(this.active) this.forceStop(); return; }
        if(this.mouse.isHoverInside){ if(this.active) this.forceStop(); return; }
        if(!this.active){ this.active=true; this.current.copy(this.mouse.coords); this.lastTime=now; this.activationTime=now; }
        this.mouse.isAutoActive=true;
        let dt=Math.min((now-this.lastTime)/1000,0.2); this.lastTime=now;
        const dir=this._tmp.subVectors(this.target,this.current), dist=dir.length();
        if(dist<0.01){ this.pickNewTarget(); return; }
        dir.normalize();
        const ramp=this.rampDurationMs>0?Math.min(1,(now-this.activationTime)/this.rampDurationMs):1;
        const k=ramp*ramp*(3-2*ramp);
        this.current.addScaledVector(dir,Math.min(this.speed*dt*k,dist));
        this.mouse.setNormalized(this.current.x,this.current.y);
      }
    }

    // FBO helper
    const makeFBO=(w,h)=>{
      const isIOS=/(iPad|iPhone|iPod)/i.test(navigator.userAgent);
      return new THREE.WebGLRenderTarget(w,h,{
        type: isIOS ? THREE.HalfFloatType : THREE.FloatType,
        depthBuffer:false, stencilBuffer:false,
        minFilter:THREE.LinearFilter, magFilter:THREE.LinearFilter,
        wrapS:THREE.ClampToEdgeWrapping, wrapT:THREE.ClampToEdgeWrapping
      });
    };

    // ShaderPass base
    class SP {
      constructor(vs,fs,unis,out){ this.out=out; this.scene=new THREE.Scene(); this.camera=new THREE.Camera(); this.mat=new THREE.RawShaderMaterial({vertexShader:vs,fragmentShader:fs,uniforms:unis}); this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),this.mat)); }
      render(target){ Common.renderer.setRenderTarget(target||null); Common.renderer.render(this.scene,this.camera); Common.renderer.setRenderTarget(null); }
    }

    class Simulation {
      constructor(opts) {
        this.opts=opts;
        this.fboSize=new THREE.Vector2(); this.cellScale=new THREE.Vector2(); this.boundarySpace=new THREE.Vector2();
        this.calcSize();
        const [w,h]=[this.fboSize.x,this.fboSize.y];
        const f=()=>makeFBO(w,h);
        this.v0=f(); this.v1=f(); this.vv0=f(); this.vv1=f(); this.div=f(); this.p0=f(); this.p1=f();
        this.buildPasses();
      }
      calcSize() {
        const w=Math.max(1,Math.round(this.opts.resolution*Common.width));
        const h=Math.max(1,Math.round(this.opts.resolution*Common.height));
        this.cellScale.set(1/w,1/h); this.fboSize.set(w,h);
      }
      buildPasses() {
        const cs=this.cellScale, fs=this.fboSize, dt=this.opts.dt;
        // Advection
        this.adv=new SP(face_vert,advection_frag,{boundarySpace:{value:cs},px:{value:cs},fboSize:{value:fs},velocity:{value:this.v0.texture},dt:{value:dt},isBFECC:{value:true}},this.v1);
        // Advection boundary
        const bg=new THREE.BufferGeometry(); bg.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]),3));
        this.advLine=new THREE.LineSegments(bg,new THREE.RawShaderMaterial({vertexShader:line_vert,fragmentShader:advection_frag,uniforms:this.adv.mat.uniforms}));
        this.adv.scene.add(this.advLine);
        // External force
        this.extScene=new THREE.Scene(); this.extCamera=new THREE.Camera();
        this.mouseM=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.RawShaderMaterial({vertexShader:mouse_vert,fragmentShader:externalForce_frag,blending:THREE.AdditiveBlending,depthWrite:false,uniforms:{px:{value:cs},force:{value:new THREE.Vector2()},center:{value:new THREE.Vector2()},scale:{value:new THREE.Vector2(this.opts.cursor_size,this.opts.cursor_size)}}}));
        this.extScene.add(this.mouseM);
        // Viscous
        this.visc=new SP(face_vert,viscous_frag,{boundarySpace:{value:this.boundarySpace},velocity:{value:this.v1.texture},velocity_new:{value:this.vv0.texture},v:{value:this.opts.viscous},px:{value:cs},dt:{value:dt}});
        // Divergence
        this.divP=new SP(face_vert,divergence_frag,{boundarySpace:{value:this.boundarySpace},velocity:{value:this.v1.texture},px:{value:cs},dt:{value:dt}},this.div);
        // Poisson
        this.poi=new SP(face_vert,poisson_frag,{boundarySpace:{value:this.boundarySpace},pressure:{value:this.p0.texture},divergence:{value:this.div.texture},px:{value:cs}});
        // Pressure
        this.pres=new SP(face_vert,pressure_frag,{boundarySpace:{value:this.boundarySpace},pressure:{value:this.p0.texture},velocity:{value:this.v1.texture},px:{value:cs},dt:{value:dt}},this.v0);
      }
      resize() {
        this.calcSize();
        const [w,h]=[this.fboSize.x,this.fboSize.y];
        [this.v0,this.v1,this.vv0,this.vv1,this.div,this.p0,this.p1].forEach(f=>f.setSize(w,h));
      }
      update() {
        const o=this.opts, cs=this.cellScale, bs=this.boundarySpace;
        bs.copy(o.isBounce?new THREE.Vector2():cs);
        // Advection
        this.adv.mat.uniforms.velocity.value=this.v0.texture;
        this.adv.mat.uniforms.dt.value=o.dt; this.adv.mat.uniforms.isBFECC.value=o.BFECC;
        this.advLine.visible=o.isBounce; this.adv.render(this.v1);
        // External force
        const mu=Mouse, fx=(mu.diff.x/2)*o.mouse_force, fy=(mu.diff.y/2)*o.mouse_force;
        const csx=o.cursor_size*cs.x, csy=o.cursor_size*cs.y;
        const cx=Math.min(Math.max(mu.coords.x,-1+csx+cs.x*2),1-csx-cs.x*2);
        const cy=Math.min(Math.max(mu.coords.y,-1+csy+cs.y*2),1-csy-cs.y*2);
        const eu=this.mouseM.material.uniforms;
        eu.force.value.set(fx,fy); eu.center.value.set(cx,cy); eu.scale.value.set(o.cursor_size,o.cursor_size);
        Common.renderer.setRenderTarget(this.v1); Common.renderer.render(this.extScene,this.extCamera); Common.renderer.setRenderTarget(null);
        // Viscous
        let vel=this.v1;
        if(o.isViscous) {
          let i0=this.vv0, i1=this.vv1;
          this.visc.mat.uniforms.velocity.value=this.v1.texture;
          for(let i=0;i<o.iterations_viscous;i++){ const [fi,fo]=i%2===0?[i0,i1]:[i1,i0]; this.visc.mat.uniforms.velocity_new.value=fi.texture; this.visc.render(fo); }
          vel=this.vv0;
        }
        // Divergence
        this.divP.mat.uniforms.velocity.value=vel.texture; this.divP.render(this.div);
        // Poisson
        let pi0=this.p0, pi1=this.p1;
        this.poi.mat.uniforms.divergence.value=this.div.texture;
        for(let i=0;i<o.iterations_poisson;i++){ const [fi,fo]=i%2===0?[pi0,pi1]:[pi1,pi0]; this.poi.mat.uniforms.pressure.value=fi.texture; this.poi.render(fo); }
        // Pressure
        this.pres.mat.uniforms.velocity.value=vel.texture; this.pres.mat.uniforms.pressure.value=pi0.texture; this.pres.render(this.v0);
      }
    }

    // Setup
    Common.init(mountRef.current);
    Mouse.init(mountRef.current);
    Mouse.autoIntensity=autoIntensity; Mouse.takeoverDuration=takeoverDuration;

    const sim=new Simulation({
      resolution, dt, BFECC, isBounce, isViscous, viscous,
      iterations_viscous:iterationsViscous, iterations_poisson:iterationsPoisson,
      mouse_force:mouseForce, cursor_size:cursorSize
    });

    // Output scene
    const outScene=new THREE.Scene(), outCamera=new THREE.Camera();
    const outMesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.RawShaderMaterial({
      vertexShader:face_vert, fragmentShader:color_frag, transparent:true, depthWrite:false,
      uniforms:{velocity:{value:sim.v0.texture},boundarySpace:{value:new THREE.Vector2()},palette:{value:paletteTex},bgColor:{value:bgVec4}}
    }));
    outScene.add(outMesh);

    const manager={lastUserInteraction:performance.now()};
    Mouse.onInteract=()=>{ manager.lastUserInteraction=performance.now(); if(autoDriver) autoDriver.forceStop(); };
    const autoDriver=new AutoDriver(Mouse,manager,{enabled:autoDemo,speed:autoSpeed,resumeDelay:autoResumeDelay,rampDuration:autoRampDuration});

    let running=false;
    const loop=()=>{
      if(!running) return;
      if(autoDriver) autoDriver.update();
      Mouse.update(); Common.update(); sim.update();
      Common.renderer.setRenderTarget(null);
      Common.renderer.render(outScene,outCamera);
      rafRef.current=requestAnimationFrame(loop);
    };
    const start=()=>{ if(running) return; running=true; loop(); };
    const pause=()=>{ running=false; if(rafRef.current){ cancelAnimationFrame(rafRef.current); rafRef.current=null; } };

    mountRef.current.prepend(Common.renderer.domElement);
    start();

    const io=new IntersectionObserver(()=>{
      isVisibleRef.current = true; // Force always visible
      if(!document.hidden) start(); else pause();
    },{threshold:[0,0.01]});
    io.observe(mountRef.current);

    const ro=new ResizeObserver(()=>{ Common.resize(); sim.resize(); });
    ro.observe(mountRef.current);

    const onVis=()=>{ if(document.hidden) pause(); else if(isVisibleRef.current) start(); };
    document.addEventListener('visibilitychange',onVis);

    webglRef.current={pause, dispose:()=>{
      pause(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange',onVis);
      Mouse.dispose();
      if(Common.renderer){ const c=Common.renderer.domElement; if(c.parentNode) c.parentNode.removeChild(c); Common.renderer.dispose(); Common.renderer.forceContextLoss(); }
    }};

    return ()=>{ if(webglRef.current) webglRef.current.dispose(); webglRef.current=null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={`liquid-ether-container ${className}`} style={style} />;
}
