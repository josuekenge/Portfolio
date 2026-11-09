// The JK mark, as vector paths in a 785 x 675 box, plus the distance field the
// liquid-metal shader reads. The field is computed analytically from the polygons
// so it works everywhere, with no dependency on reading pixels back from a canvas.
export const LOGO_VIEWBOX = '0 0 785 675';
export const LOGO_PATHS = [
  'M120 455L120 537L83.5 575L105 597.4C122 615 155 620 177 600.2L318 460C318 525 306 548 292.4 569L216 646.6C186 673 110 690 62 639L0 574Z',
  'M318 212L318 412L244 485.5L244 286Z',
  'M425.3 0L425.3 305L351 378.5L350 156.4L143.3 276Z',
  'M615.2 74L785 74L502 361L778 674L618 674L461 522L648 608.6L456 407.6L425.4 439L425.2 600L351 673.5L351.3 427L638 135.7L461.4 224Z',
] as const;

type Point = [number, number];

export function flatten(d: string, steps = 16): Point[] {
  const tokens = d.match(/[MLCZ]|-?\d+\.?\d*/g) ?? [];
  const points: Point[] = [];
  let i = 0;
  let cur: Point = [0, 0];
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === 'M' || cmd === 'L') {
      cur = [Number(tokens[i]), Number(tokens[i + 1])];
      points.push(cur);
      i += 2;
    } else if (cmd === 'C') {
      const v = tokens.slice(i, i + 6).map(Number);
      const p0 = cur;
      i += 6;
      for (let k = 1; k <= steps; k++) {
        const u = k / steps;
        const a = (1 - u) ** 3;
        const b = 3 * u * (1 - u) ** 2;
        const c = 3 * u * u * (1 - u);
        const e = u ** 3;
        cur = [a * p0[0] + b * v[0] + c * v[2] + e * v[4], a * p0[1] + b * v[1] + c * v[3] + e * v[5]];
        points.push(cur);
      }
    }
  }
  return points;
}

/** Returns an RG float field: R = signed distance (positive inside), G = bevel height, both in texture widths. */
export function buildField(W: number, H: number): Float32Array {
  const scale = (W * 0.86) / 785;
  const ox = (W - 785 * scale) / 2;
  const oy = (H - 675 * scale) / 2;
  const seg: number[] = [];
  LOGO_PATHS.map((d) => flatten(d)).forEach((poly) =>
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length];
      seg.push(p[0] * scale + ox, p[1] * scale + oy, q[0] * scale + ox, q[1] * scale + oy);
    }),
  );
  const m = seg.length / 4;
  const n = W * H;
  const dist = new Float32Array(n);
  const height = new Float32Array(n);
  const bevel = W * 0.03;
  for (let y = 0, i = 0; y < H; y++) {
    const py = y + 0.5;
    for (let x = 0; x < W; x++, i++) {
      const px = x + 0.5;
      let best = 1e18;
      let inside = false;
      for (let k = 0; k < m; k++) {
        const x1 = seg[k * 4];
        const y1 = seg[k * 4 + 1];
        const x2 = seg[k * 4 + 2];
        const y2 = seg[k * 4 + 3];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const ax = px - x1;
        const ay = py - y1;
        let t = (ax * dx + ay * dy) / (dx * dx + dy * dy);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const ex = ax - t * dx;
        const ey = ay - t * dy;
        const d2 = ex * ex + ey * ey;
        if (d2 < best) best = d2;
        if (y1 > py !== y2 > py && px < (dx * ay) / dy + x1) inside = !inside;
      }
      const d = Math.sqrt(best);
      dist[i] = (inside ? d : -d) / W;
      if (inside) {
        const k = Math.min(1, d / bevel);
        height[i] = Math.sqrt(1 - (1 - k) * (1 - k)) * bevel;
      }
    }
  }
  // Three box-blur passes smooth the bevel so the medial axis has no creases.
  const R = Math.max(2, Math.round(W * 0.007));
  const tmp = new Float32Array(Math.max(W, H));
  const box = (off: number, stride: number, len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) tmp[i] = height[off + i * stride];
    for (let i = -R; i <= R; i++) sum += tmp[Math.max(0, Math.min(len - 1, i))];
    for (let i = 0; i < len; i++) {
      height[off + i * stride] = sum / (2 * R + 1);
      sum += tmp[Math.min(len - 1, i + R + 1)] - tmp[Math.max(0, i - R)];
    }
  };
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < H; y++) box(y * W, 1, W);
    for (let x = 0; x < W; x++) box(x, W, H);
  }
  const out = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    out[i * 2] = dist[i];
    out[i * 2 + 1] = height[i] / W;
  }
  return out;
}
