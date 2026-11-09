import { useEffect, useRef } from 'react';
import { log, prefersReducedMotion } from '../lib/log';
import { FIGURE_LABELS, FIGURES, type FigureKey } from './figures';

interface Job {
  name: FigureKey;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  visible: boolean;
}

// One shared 30fps loop for every figure on the page; off-screen figures cost nothing.
const jobs = new Set<Job>();
const started = performance.now();
let raf = 0;
let last = 0;

function paint(job: Job, t: number, still: boolean) {
  const { ctx, w, h, name } = job;
  if (w < 2 || h < 2) return;
  try {
    ctx.clearRect(0, 0, w, h);
    FIGURES[name](ctx, w, h, t, still);
  } catch (err) {
    log.error('figure', `${name} failed and was stopped`, err);
    jobs.delete(job);
  }
}

function loop(now: number) {
  raf = jobs.size ? requestAnimationFrame(loop) : 0;
  if (now - last < 33) return;
  last = now;
  const t = (now - started) / 1000;
  jobs.forEach((job) => {
    if (job.visible) paint(job, t, false);
  });
}

export function Figure({ name, className = '' }: { name: FigureKey; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      log.error('figure', `${name} has no 2d context`);
      return;
    }
    const still = prefersReducedMotion();
    // Starts idle: the observer fires right away for anything on screen, so off-screen figures never paint.
    const job: Job = { name, canvas, ctx, w: 0, h: 0, visible: typeof IntersectionObserver !== 'function' };

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      job.w = canvas.clientWidth;
      job.h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(job.w * dpr));
      canvas.height = Math.max(1, Math.round(job.h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (still) paint(job, 0, true);
    };
    measure();

    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    resize?.observe(canvas);
    const seen =
      typeof IntersectionObserver === 'function'
        ? new IntersectionObserver((entries) => {
            job.visible = entries[entries.length - 1].isIntersecting;
          })
        : null;
    seen?.observe(canvas);

    if (still) {
      void document.fonts?.ready.then(() => paint(job, 0, true));
    } else {
      jobs.add(job);
      if (!raf) raf = requestAnimationFrame(loop);
    }
    return () => {
      jobs.delete(job);
      resize?.disconnect();
      seen?.disconnect();
    };
  }, [name]);

  return <canvas ref={ref} className={`fig ${className}`} role="img" aria-label={FIGURE_LABELS[name]} />;
}
