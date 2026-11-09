import { useEffect, useRef, useState } from 'react';
import { buildField, LOGO_PATHS, LOGO_VIEWBOX } from '../lib/logo';
import { log, prefersReducedMotion } from '../lib/log';

const VERTEX = '#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uD;uniform vec2 uRes,uC,uM;uniform float uT,uS,uA,uG;out vec4 o;
float D(vec2 p){return texture(uD,vec2(p.x+.5,.5-p.y*uA)).r;}
float H(vec2 p){
  vec2 s=texture(uD,vec2(p.x+.5,.5-p.y*uA)).rg;
  float h=s.g*smoothstep(-.075,0.,uG);
  h+=smoothstep(0.,.03,s.r)*.0016*sin(p.x*17.+uT*.55+1.7*sin(p.y*13.-uT*.4))*sin(p.y*15.-uT*.47+1.3*sin(p.x*11.+uT*.3));
  return h;
}
float st(float x,float c,float w,float s){return smoothstep(c-w-s,c-w,x)*(1.-smoothstep(c+w,c+w+s,x));}
float env(vec3 r,float t){
  float x=r.x,y=r.y,a=(x+y)*.7071;
  float v=.012+.05*smoothstep(-1.,1.,y);
  v+=1.25*st(y+x*.42,.62+.07*sin(t*.31),.11,.09);
  v+=.42*st(y-x*.26,-.42+.05*sin(t*.23+1.),.06,.1);
  v+=.95*st(x+y*.14,-.72+.05*cos(t*.27),.035,.05);
  v+=.7*st(x-y*.1,.78+.04*sin(t*.19),.025,.06);
  v+=.24*st(a,sin(t*.17)*.55,.02,.12);
  return v;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+uT)*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy;
  vec2 p=(uv-uC)/uS;
  float g=(hash(uv)-.5)*.022;
  float d=D(p)+uG;
  float c=.02;
  vec2 cn=(uv/uRes-.5)*vec2(uRes.x/uRes.y,1.);
  c+=.022*exp(-dot(p,p)*2.2);
  if(d<0.)c+=.045*exp(d*30.);
  c*=1.-.45*dot(cn,cn);
  if(d>-.004){
    float e=.0022;
    vec3 n=normalize(vec3(H(p-vec2(e,0.))-H(p+vec2(e,0.)),H(p-vec2(0.,e))-H(p+vec2(0.,e)),2.*e));
    n.xy+=p*.5+uM*.22+vec2(sin(uT*.21),cos(uT*.17))*.05;
    n=normalize(n);
    vec3 r=reflect(vec3(0.,0.,-1.),n);
    float m=env(r,uT);
    float fr=pow(1.-max(n.z,0.),3.);
    m+=fr*.5;
    float bv=1.-smoothstep(0.,.03,d);
    float s=fract(uT/8.5);float sp=mix(-1.3,1.3,smoothstep(0.,.3,s));
    m+=1.8*exp(-pow((p.x+p.y)-sp,2.)*260.)*(.35+bv);
    m+=.1+.1*smoothstep(-.5,.5,p.y-p.x);
    m+=.85*(1.-smoothstep(0.,.0032,d));
    m=1.-exp(-m*1.55);
    float a=smoothstep(-.0011,.0011,d);
    c=mix(c,m,a);
  }
  o=vec4(vec3(c+g)*vec3(1.,.992,.975),1.);
}`;

function compile(g: WebGL2RenderingContext, type: number, src: string) {
  const s = g.createShader(type);
  if (!s) throw new Error('createShader returned null');
  g.shaderSource(s, src);
  g.compileShader(s);
  if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) ?? 'shader compile failed');
  return s;
}

export function LiquidMark({ revealDelay }: { revealDelay: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let raf = 0;
    let stopped = false;
    let visible = true;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      log.error('liquid', 'webgl context lost, showing vector mark');
      stopped = true;
      cancelAnimationFrame(raf);
      setLive(false);
    };
    const seen = typeof IntersectionObserver === 'function' ? new IntersectionObserver((es) => (visible = es[es.length - 1].isIntersecting)) : null;

    // Deferred one tick so the page paints before the field is computed.
    const boot = window.setTimeout(() => {
      try {
        const g = c.getContext('webgl2', { antialias: false, powerPreference: 'high-performance' });
        if (!g) {
          log.warn('liquid', 'webgl2 unavailable, showing vector mark');
          return;
        }
        const W = 720;
        const H = 624;
        const t0 = performance.now();
        const field = buildField(W, H);
        log.info('liquid', `field ready in ${Math.round(performance.now() - t0)}ms`);
        const p = g.createProgram();
        if (!p) throw new Error('createProgram returned null');
        g.attachShader(p, compile(g, g.VERTEX_SHADER, VERTEX));
        g.attachShader(p, compile(g, g.FRAGMENT_SHADER, FRAGMENT));
        g.linkProgram(p);
        if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p) ?? 'link failed');
        g.useProgram(p);
        g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
        g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
        const loc = g.getAttribLocation(p, 'a');
        g.enableVertexAttribArray(loc);
        g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
        g.bindTexture(g.TEXTURE_2D, g.createTexture());
        g.pixelStorei(g.UNPACK_ALIGNMENT, 1);
        g.texImage2D(g.TEXTURE_2D, 0, g.RG16F, W, H, 0, g.RG, g.FLOAT, field);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
        const uniform = (n: string) => g.getUniformLocation(p, n);
        const u = { res: uniform('uRes'), c: uniform('uC'), m: uniform('uM'), t: uniform('uT'), s: uniform('uS'), a: uniform('uA'), g: uniform('uG') };
        g.uniform1f(u.a, W / H);
        const reduce = prefersReducedMotion();
        const start = performance.now();

        const frame = (now: number) => {
          if (stopped) return;
          if (!reduce) raf = requestAnimationFrame(frame);
          if (!visible && !reduce) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          const cw = c.clientWidth;
          const ch = c.clientHeight;
          const rw = Math.round(cw * dpr);
          const rh = Math.round(ch * dpr);
          if (c.width !== rw || c.height !== rh) {
            c.width = rw;
            c.height = rh;
            g.viewport(0, 0, rw, rh);
          }
          const t = reduce ? 40 : (now - start) / 1000;
          mx += (tx - mx) * 0.06;
          my += (ty - my) * 0.06;
          const phone = cw < 820;
          const markW = phone ? cw * 0.86 : Math.min(cw * 0.44, ch * 0.66 * (785 / 675));
          const k = reduce ? 1 : Math.min(1, Math.max(0, (t - revealDelay) / 0.75));
          g.uniform2f(u.res, rw, rh);
          g.uniform2f(u.c, (phone ? 0.5 : 0.69) * rw + mx * 10 * dpr, (phone ? 0.64 : 0.6) * rh + my * 10 * dpr);
          g.uniform2f(u.m, mx, my);
          g.uniform1f(u.t, t);
          g.uniform1f(u.s, (markW * dpr) / 0.86);
          g.uniform1f(u.g, -0.075 * (1 - (1 - (1 - k) ** 4)));
          g.drawArrays(g.TRIANGLES, 0, 3);
        };
        raf = requestAnimationFrame(frame);
        setLive(true);
        log.info('liquid', 'webgl started');
      } catch (err) {
        log.error('liquid', 'webgl failed, showing vector mark', err);
      }
    }, 0);

    window.addEventListener('pointermove', onMove, { passive: true });
    c.addEventListener('webglcontextlost', onLost);
    seen?.observe(c);
    return () => {
      stopped = true;
      window.clearTimeout(boot);
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      c.removeEventListener('webglcontextlost', onLost);
      seen?.disconnect();
    };
  }, [revealDelay]);

  return (
    <>
      <svg className={`fall ${live ? 'fall-off' : ''}`} viewBox={LOGO_VIEWBOX} aria-hidden="true">
        {LOGO_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <canvas ref={ref} className={`gl ${live ? '' : 'gl-off'}`} role="img" aria-label="JK logo rendered in liquid metal" />
    </>
  );
}
