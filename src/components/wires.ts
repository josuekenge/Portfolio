import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { log } from '../lib/log';

export type Side = 'bt' | 'lr' | 'rl';
export interface Edge {
  from: string;
  to: string;
  side?: Side;
  color?: string;
  label?: string;
  realtime?: boolean;
}
export interface Box {
  l: number;
  r: number;
  t: number;
  b: number;
}
export interface Wire {
  d: string;
  color: string;
  realtime: boolean;
  delay: string;
}
export interface Pill {
  x: number;
  y: number;
  text: string;
}
export interface BandBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}
export interface BandSpec {
  from: string;
  to: string;
  label: string;
}

/** Curved path between two boxes. 'bt' runs bottom to top; 'lr' leaves the left edge; 'rl' leaves the right. */
export function wirePath(a: Box, b: Box, side: Side = 'bt') {
  const acx = (a.l + a.r) / 2;
  const bcx = (b.l + b.r) / 2;
  if (side === 'bt') {
    const x1 = acx;
    const y1 = a.b;
    const x2 = bcx + (acx - bcx) * 0.14;
    const y2 = b.t;
    const k = (y2 - y1) * 0.55;
    return { d: `M${x1} ${y1}C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`, mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } };
  }
  const dir = side === 'lr' ? -1 : 1;
  const x1 = dir < 0 ? a.l : a.r;
  const y1 = (a.t + a.b) / 2;
  const x2 = dir < 0 ? b.r : b.l;
  const y2 = (b.t + b.b) / 2;
  const k = Math.abs(x2 - x1) * 0.55;
  return { d: `M${x1} ${y1}C${x1 + dir * k} ${y1} ${x2 - dir * k} ${y2} ${x2} ${y2}`, mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } };
}

const COMPACT_WIDTH = 760;

export function useWires(stage: RefObject<HTMLElement | null>, getEdges: (compact: boolean) => Edge[], band?: BandSpec, alwaysWide = false) {
  const [state, setState] = useState<{ wires: Wire[]; pills: Pill[]; band: BandBox | null }>({ wires: [], pills: [], band: null });

  useLayoutEffect(() => {
    const host = stage.current;
    if (!host) return;
    const box = (id: string): Box | null => {
      const node = host.querySelector<HTMLElement>(`[data-node="${id}"]`);
      if (!node) return null;
      // Layout offsets ignore CSS transforms, so a panel mid-transition still measures true.
      let x = 0;
      let y = 0;
      let at: HTMLElement | null = node;
      while (at && at !== host) {
        x += at.offsetLeft;
        y += at.offsetTop;
        at = at.offsetParent as HTMLElement | null;
      }
      return { l: x, r: x + node.offsetWidth, t: y, b: y + node.offsetHeight };
    };
    const measure = () => {
      const compact = !alwaysWide && host.clientWidth < COMPACT_WIDTH;
      const wires: Wire[] = [];
      const pills: Pill[] = [];
      getEdges(compact).forEach((edge, i) => {
        const a = box(edge.from);
        const b = box(edge.to);
        if (!a || !b) {
          log.error('map', `missing node for wire ${edge.from} to ${edge.to}`);
          return;
        }
        const { d, mid } = wirePath(a, b, edge.side);
        wires.push({ d, color: edge.color ?? '#EFEDE8', realtime: !!edge.realtime, delay: `${(i * 0.26).toFixed(2)}s` });
        if (edge.label && !compact) pills.push({ x: Math.round(mid.x), y: Math.round(mid.y), text: edge.label });
      });
      let bandBox: BandBox | null = null;
      if (band) {
        const a = box(band.from);
        const b = box(band.to);
        const pad = compact ? 8 : 16;
        // When rows stack, each tier label sits above its node, so the band starts above that label.
        const top = compact ? 34 : pad;
        if (a && b) bandBox = { x: Math.round(a.l - pad), y: Math.round(a.t - top), w: Math.round(a.r - a.l + pad * 2), h: Math.round(b.b - a.t + top + pad), label: band.label };
      }
      setState({ wires, pills, band: bandBox });
    };
    measure();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    ro?.observe(host);
    void document.fonts?.ready.then(measure);
    return () => ro?.disconnect();
  }, [stage, getEdges, band, alwaysWide]);

  return state;
}

/** Pauses a map's looping light when it is off-screen. */
export function usePauseOffscreen(ref: RefObject<HTMLElement | null>) {
  const seen = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver !== 'function') return;
    seen.current = new IntersectionObserver((entries) => node.classList.toggle('off', !entries[entries.length - 1].isIntersecting));
    seen.current.observe(node);
    return () => seen.current?.disconnect();
  }, [ref]);
}
