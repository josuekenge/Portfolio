import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { logo, type LogoKey } from '../data/logos';
import { log, prefersReducedMotion } from '../lib/log';
import { Logo } from './Logos';

export interface OrbitBody {
  id: string;
  mark: LogoKey;
  size: string;
  value: string;
  label: string;
}

export const ORBIT_BODIES: OrbitBody[] = [
  { id: 'ibm', mark: 'ibm', size: 'sz-ibm', value: '35K+', label: 'sellers reached at IBM' },
  { id: 'jonas', mark: 'jonas', size: 'sz-jonas', value: '$303K+', label: 'savings delivered at Jonas' },
  { id: 'microsoft', mark: 'microsoft', size: 'sz-ms', value: '40%', label: 'lower latency at Microsoft' },
  { id: 'carleton', mark: 'carleton', size: 'sz-cu', value: 'Dec 2027', label: 'B.Sc. CS, Carleton' },
];

const TAU = Math.PI * 2;
const EPICYCLE = 0.032;

/** Where body i sits. Each body rides one shared ellipse while slowly circling its own point on it. */
export function orbitPoint(i: number, count: number, angle: number, time: number, w: number, h: number, bw: number, bh: number) {
  const amp = Math.min(w, h) * EPICYCLE;
  // Largest body scale is 1.16, so this margin keeps every card inside the stage.
  const rx = Math.max(10, w / 2 - (bw * 1.16) / 2 - amp - 6);
  const ry = Math.max(10, h / 2 - (bh * 1.16) / 2 - amp - 6);
  const a = angle + (i * TAU) / count;
  const dir = i % 2 ? -1 : 1;
  const b = time * 0.34 * dir + i * 1.7;
  const depth = (Math.sin(a) + 1) / 2;
  return { x: w / 2 + Math.cos(a) * rx + Math.cos(b) * amp, y: h / 2 + Math.sin(a) * ry + Math.sin(b) * amp * 0.7, depth, rx, ry };
}

const seeded = (() => {
  let s = 11;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: 70 }, () => ({ a: r() * TAU, k: 0.35 + r() * 0.8, v: 0.02 + r() * 0.05, z: r() }));
})();

export function Orbit({ focus }: { focus: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bodies = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const [lead, setLead] = useState(0);

  useEffect(() => {
    const host = stage.current;
    const c = canvas.current;
    const ctx = c?.getContext('2d');
    if (!host || !c || !ctx) {
      log.error('orbit', 'stage did not mount');
      return;
    }
    const reduce = prefersReducedMotion();
    const count = ORBIT_BODIES.length;
    const weights = new Array(count).fill(0);
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let angle = -Math.PI / 2 + 0.6;
    let speed = 0.17;
    let visible = true;
    let tilt = 0;
    let tiltTo = 0;
    let dim = 0;
    let shown = 0;
    let dead = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(host.clientWidth * dpr);
      c.height = Math.round(host.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(size) : null;
    ro?.observe(host);
    const io = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver((e) => {
          visible = e[e.length - 1].isIntersecting;
          last = performance.now();
        })
      : null;
    io?.observe(host);
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tiltTo = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / r.width));
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const draw = (dt: number) => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      const first = bodies.current[0];
      const bw = first?.offsetWidth || 128;
      const bh = first?.offsetHeight || 88;
      const hovering = focusRef.current >= 0;
      speed += ((hovering ? 0.05 : 0.17) - speed) * Math.min(1, dt * 3);
      angle += speed * dt;
      time += dt;
      tilt += (tiltTo - tilt) * Math.min(1, dt * 2.5);
      dim += ((hovering ? 1 : 0) - dim) * Math.min(1, dt * 6);

      const pts = ORBIT_BODIES.map((_, i) => {
        weights[i] += ((focusRef.current === i ? 1 : 0) - weights[i]) * Math.min(1, dt * 7);
        return orbitPoint(i, count, angle, time, w, h, bw, bh);
      });
      const { rx, ry } = pts[0];
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';

      // Rings fade toward the back, with a highlight that follows the pointer.
      [1.05, 0.82, 0.6].forEach((k, ring) => {
        const steps = 110;
        ctx.lineWidth = ring === 0 ? 1.1 : 0.8;
        for (let s = 0; s < steps; s++) {
          const a0 = (s / steps) * TAU;
          const a1 = ((s + 1) / steps) * TAU;
          const front = (Math.sin(a0 + tilt * 0.7) + 1) / 2;
          ctx.strokeStyle = `rgba(239,237,232,${(0.035 + 0.17 * front * front).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a0) * rx * k, cy + Math.sin(a0) * ry * k);
          ctx.lineTo(cx + Math.cos(a1) * rx * k, cy + Math.sin(a1) * ry * k);
          ctx.stroke();
        }
      });

      seeded.forEach((d) => {
        const a = d.a + time * d.v;
        const f = (Math.sin(a) + 1) / 2;
        ctx.fillStyle = `rgba(239,237,232,${(0.05 + 0.32 * f * d.z).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * rx * d.k, cy + Math.sin(a) * ry * d.k, 0.7 + d.z * 0.7, 0, TAU);
        ctx.fill();
      });

      // Tethers curve through the centre of the system rather than cutting straight across.
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % count];
        const mx = cx + ((p.x + q.x) / 2 - cx) * 0.58;
        const my = cy + ((p.y + q.y) / 2 - cy) * 0.58;
        const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
        grad.addColorStop(0, `rgba(239,237,232,${(0.08 + 0.26 * p.depth).toFixed(3)})`);
        grad.addColorStop(1, `rgba(239,237,232,${(0.08 + 0.26 * q.depth).toFixed(3)})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(mx, my, q.x, q.y);
        ctx.stroke();
        // A soft pulse glides along each tether.
        const u = (time * 0.16 + i * 0.25) % 1;
        const e = u * u * (3 - 2 * u);
        const x = (1 - e) * (1 - e) * p.x + 2 * (1 - e) * e * mx + e * e * q.x;
        const y = (1 - e) * (1 - e) * p.y + 2 * (1 - e) * e * my + e * e * q.y;
        const fade = Math.sin(u * Math.PI);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 9);
        glow.addColorStop(0, `rgba(255,255,255,${(0.85 * fade).toFixed(3)})`);
        glow.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, TAU);
        ctx.fill();
      });

      // Two comets run the rings in opposite directions, with long tapered tails.
      [
        { k: 1.05, dir: 1, off: 0 },
        { k: 0.6, dir: -1, off: 2.1 },
      ].forEach(({ k, dir, off }) => {
        const head = time * 0.42 * dir + off;
        const tail = 54;
        for (let s = 0; s < tail; s++) {
          const a0 = head - dir * s * 0.016;
          const a1 = head - dir * (s + 1) * 0.016;
          const f = 1 - s / tail;
          ctx.strokeStyle = `rgba(255,255,255,${(0.75 * f * f).toFixed(3)})`;
          ctx.lineWidth = 0.6 + 1.3 * f;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a0) * rx * k, cy + Math.sin(a0) * ry * k);
          ctx.lineTo(cx + Math.cos(a1) * rx * k, cy + Math.sin(a1) * ry * k);
          ctx.stroke();
        }
      });

      let front = 0;
      pts.forEach((p, i) => {
        const el = bodies.current[i];
        if (p.depth > pts[front].depth) front = i;
        if (!el) return;
        const scale = 0.8 + p.depth * 0.24 + weights[i] * 0.12;
        const opacity = (0.6 + p.depth * 0.4) * (1 - dim * 0.55 * (1 - weights[i]));
        el.style.transform = `translate3d(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(10 + Math.round(p.depth * 20) + Math.round(weights[i] * 30));
      });
      const next = hovering ? focusRef.current : front;
      if (next !== shown) {
        shown = next;
        setLead(next);
      }
    };

    const frame = (now: number) => {
      if (dead) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      // Clamp so returning to a background tab never makes the system jump.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      try {
        draw(dt);
      } catch (err) {
        log.error('orbit', 'draw failed, animation stopped', err);
        dead = true;
      }
    };
    if (reduce) draw(0);
    else raf = requestAnimationFrame(frame);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="orb" ref={stage}>
      <canvas ref={canvas} className="orbc" aria-hidden="true" />
      <div className="orbcore" aria-live="off">
        {ORBIT_BODIES.map((b, i) => (
          <div className={`ocl ${i === lead ? 'on' : ''}`} key={b.id} aria-hidden={i !== lead}>
            <div className="ocv">{b.value}</div>
            <div className="ocs">{b.label}</div>
          </div>
        ))}
      </div>
      {ORBIT_BODIES.map((b, i) => (
        <Link
          key={b.id}
          className={`bodyo ${b.size}`}
          to={`/experience#${b.id}`}
          aria-label={`${logo(b.mark).title} experience`}
          ref={(el) => {
            bodies.current[i] = el;
          }}
        >
          <Logo def={logo(b.mark)} decorative />
        </Link>
      ))}
    </div>
  );
}
