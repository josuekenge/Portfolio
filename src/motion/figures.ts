// One motion graphic per project and per experience. Each is drawn from that
// entry's real numbers: counts are exact counts and bars are to scale.
export type FigureKey =
  | 'mobisoins'
  | 'decks'
  | 'wes'
  | 'aiqsr'
  | 'ma'
  | 'computrition'
  | 'zerpha'
  | 'ulife'
  | 'minisoft'
  | 'ibm'
  | 'jonas'
  | 'microsoft'
  | 'carleton';

type Ctx = CanvasRenderingContext2D;
/** w and h are CSS pixels, t is seconds, still means draw the finished state with no motion. */
export type DrawFigure = (c: Ctx, w: number, h: number, t: number, still: boolean) => void;

const INK = '#EFEDE8';
const MID = 'rgba(239,237,232,.42)';
const LOW = 'rgba(239,237,232,.14)';
const DIM = '#8E8C87';
const TAU = Math.PI * 2;

const display = (px: number) => `300 ${px}px "Funnel Display", system-ui, sans-serif`;
const mono = (px: number) => `400 ${px}px "Geist Mono", ui-monospace, monospace`;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  const k = clamp01(x);
  return k * k * (3 - 2 * k);
};
const ink = (a: number) => `rgba(239,237,232,${a.toFixed(3)})`;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function text(c: Ctx, value: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = 'left') {
  c.font = font;
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = 'alphabetic';
  c.fillText(value, x, y);
}

/** Forward morph, hold, back: 0 to 1 and returning, over a period in seconds. */
function pingPong(t: number, period: number, still: boolean) {
  if (still) return 1;
  const p = (t % period) / period;
  return smooth(p / 0.3) * (1 - smooth((p - 0.86) / 0.14));
}

// MobiSoins: the exclusive 18-second offer, across its 3 rounds, at real speed.
const mobisoins: DrawFigure = (c, w, h, t, still) => {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.46;
  const gap = Math.max(5, R * 0.075);
  const clock = still ? 0 : t % 54;
  const round = Math.floor(clock / 18);
  const sec = clock % 18;
  c.lineCap = 'butt';
  c.lineWidth = Math.max(1, R * 0.012);
  for (let i = 0; i < 3; i++) {
    const r = R - i * gap;
    c.strokeStyle = LOW;
    c.beginPath();
    c.arc(cx, cy, r, 0, TAU);
    c.stroke();
    const left = i < round ? 0 : i === round ? 1 - sec / 18 : 1;
    if (left > 0) {
      c.strokeStyle = i === round ? INK : MID;
      c.beginPath();
      c.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * left);
      c.stroke();
    }
  }
  text(c, `${Math.ceil(18 - sec)} s`, cx, cy + R * 0.14, display(R * 0.42), INK, 'center');
  if (R > 70) text(c, `Round ${round + 1} of 3`, cx, cy + R * 0.4, mono(Math.max(11, R * 0.07)), DIM, 'center');
};

// Grounded Decks: 11,600 cells, one per character of chat reaching the engine.
const CELL_COLS = 145;
const CELL_ROWS = 80;
const decks: DrawFigure = (c, w, h, t, still) => {
  const size = Math.min(w / CELL_COLS, h / CELL_ROWS);
  const ox = (w - size * CELL_COLS) / 2;
  const oy = (h - size * CELL_ROWS) / 2;
  const k = still ? 1 : clamp01((t % 9) / 6.5);
  const count = Math.floor(11600 * (1 - (1 - k) * (1 - k)));
  const inner = Math.max(0.6, size - Math.min(0.9, size * 0.3));
  c.fillStyle = LOW;
  c.fillRect(ox, oy, size * CELL_COLS, size * CELL_ROWS);
  c.fillStyle = INK;
  c.beginPath();
  for (let i = 0; i < count; i++) c.rect(ox + (i % CELL_COLS) * size, oy + Math.floor(i / CELL_COLS) * size, inner, inner);
  c.fill();
};

// Wes: one minute against 2.3 seconds, with the bars drawn to scale.
const wes: DrawFigure = (c, w, h, t, still) => {
  const ratio = 2.3 / 60;
  const showText = h > 120;
  const y1 = h * (showText ? 0.3 : 0.32);
  const y2 = h * (showText ? 0.78 : 0.68);
  const k = still ? 1 : clamp01((t % 7.5) / 6);
  c.fillStyle = LOW;
  c.fillRect(0, y1, w, 1);
  c.fillRect(0, y2, w * ratio, 1);
  c.fillStyle = MID;
  c.fillRect(0, y1 - 1, w * k, 3);
  c.fillStyle = INK;
  c.fillRect(0, y2 - 1, w * ratio * clamp01(k / ratio), 3);
  if (showText) {
    text(c, 'Before · 1 min', 0, y1 - 14, mono(12), DIM);
    text(c, '2.3 s', 0, y2 - 16, display(Math.min(72, h * 0.27)), INK);
  }
};

// AIQSR: 957 dots, one per AI initiative (33 x 29).
const aiqsr: DrawFigure = (c, w, h, t, still) => {
  const cols = 33;
  const rows = 29;
  const size = Math.min(w / cols, h / rows);
  const ox = (w - size * cols) / 2;
  const oy = (h - size * rows) / 2;
  const radius = Math.max(0.7, size * 0.13);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const wave = still ? 1 : 0.5 + 0.5 * Math.sin((i + j) * 0.34 - t * 1.5);
      c.fillStyle = ink(0.2 + 0.8 * wave ** 5);
      c.beginPath();
      c.arc(ox + (i + 0.5) * size, oy + (j + 0.5) * size, radius, 0, TAU);
      c.fill();
    }
  }
};

// M&A: every answer links to the source passage it came from (the two-panel UX).
const ma: DrawFigure = (c, w, h, t, still) => {
  const lines = 12;
  const lh = h / (lines + 1);
  const docR = w * 0.42;
  const ansL = w * 0.58;
  const docWidths = [1, 0.86, 0.94, 0.7, 1, 0.9, 0.82, 1, 0.76, 0.92, 1, 0.6];
  const links = [
    [2, 2],
    [5, 6],
    [9, 9],
  ];
  const active = still ? -1 : Math.floor(t / 2.2) % 3;
  const p = still ? 1 : smooth(((t % 2.2) / 2.2) / 0.6);
  const thick = Math.max(1.5, lh * 0.18);
  docWidths.forEach((dw, i) => {
    const lit = links.findIndex((l) => l[1] === i);
    c.fillStyle = lit !== -1 && (still || lit === active) ? ink(0.14 + 0.86 * p) : LOW;
    c.fillRect(0, lh * (i + 1), docR * dw, thick);
  });
  for (let i = 0; i < lines; i += 1) {
    const isAnswer = i % 2 === 0 || links.some((l) => l[0] === i);
    if (!isAnswer) continue;
    c.fillStyle = MID;
    c.fillRect(ansL, lh * (i + 1), (w - ansL) * (links.some((l) => l[0] === i) ? 0.82 : 0.96), thick);
  }
  links.forEach(([from, to], idx) => {
    const on = still || idx === active;
    const sx = ansL - 8;
    const sy = lh * (from + 1) + thick / 2;
    const ex = docR + 8;
    const ey = lh * (to + 1) + thick / 2;
    c.fillStyle = on ? INK : LOW;
    c.beginPath();
    c.arc(sx, sy, Math.max(2, thick), 0, TAU);
    c.fill();
    if (!on) return;
    c.strokeStyle = INK;
    c.lineWidth = 1;
    c.beginPath();
    const mx = (sx + ex) / 2;
    const steps = 28;
    for (let s = 0; s <= steps * p; s++) {
      const u = s / steps;
      const a = (1 - u) ** 3;
      const b = 3 * u * (1 - u) ** 2;
      const d = 3 * u * u * (1 - u);
      const e = u ** 3;
      const x = a * sx + b * mx + d * mx + e * ex;
      const y = a * sy + b * sy + d * ey + e * ey;
      if (s === 0) c.moveTo(x, y);
      else c.lineTo(x, y);
    }
    c.stroke();
  });
};

// Computrition: adoption spreading through 400 senior leaders.
const computrition: DrawFigure = (c, w, h, t, still) => {
  const n = 400;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.48;
  const front = still ? 1.2 : smooth((t % 9) / 6) * 1.2;
  const dot = Math.max(0.8, R * 0.018);
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const r = Math.sqrt(u) * R;
    const a = i * 2.399963;
    const on = clamp01((front - u) * 14);
    const breathe = still ? 1 : 0.7 + 0.3 * Math.sin(t * 2 - u * 16);
    c.fillStyle = ink(0.14 + 0.86 * on * breathe);
    c.beginPath();
    c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, dot * (1 + on * 0.5), 0, TAU);
    c.fill();
  }
};

// Zerpha: noisy scraped fragments resolving into structured rows.
const zerphaSeeds = (() => {
  const r = rng(7);
  return Array.from({ length: 54 }, () => [r(), r(), 0.03 + r() * 0.2, r()]);
})();
const zerpha: DrawFigure = (c, w, h, t, still) => {
  const k = pingPong(t, 10, still);
  const cols = 6;
  const rows = 9;
  const pad = w * 0.02;
  const cw = w / cols;
  const rh = h / rows;
  const thick = Math.max(1.5, h * 0.012);
  zerphaSeeds.forEach(([sx, sy, sl, s], i) => {
    const e = smooth(k * 1.5 - s * 0.5);
    const tx = (i % cols) * cw + pad;
    const ty = Math.floor(i / cols) * rh + rh / 2;
    const tl = cw - pad * 2;
    const drift = still ? 0 : Math.sin(t * 0.7 + s * 20) * 0.02 * (1 - e);
    const x = (sx + drift) * (w * 0.85) * (1 - e) + tx * e;
    const y = sy * h * (1 - e) + ty * e;
    c.fillStyle = ink(0.2 + 0.8 * e * (i % cols === 0 ? 1 : 0.6));
    c.fillRect(x, y, sl * w * (1 - e) + tl * e, thick);
  });
};

// Ulife: a voice waveform on a 24-hour dial, always on.
const ulife: DrawFigure = (c, w, h, t, still) => {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.46;
  const inner = R * 0.56;
  const bars = 120;
  c.lineCap = 'round';
  c.lineWidth = Math.max(1, R * 0.012);
  const speech = still ? 0.8 : smooth(Math.sin(t * 0.8) * 2 + 0.6) * 0.8 + 0.2;
  for (let i = 0; i < bars; i++) {
    const a = (i / bars) * TAU - Math.PI / 2;
    const tt = still ? i * 0.3 : t * 3;
    const amp = (0.12 + 0.88 * Math.abs(Math.sin(i * 0.31 + tt) * Math.sin(i * 0.087 - tt * 0.37))) * speech;
    const len = R * 0.28 * amp;
    c.strokeStyle = ink(0.35 + 0.65 * amp);
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    c.lineTo(cx + Math.cos(a) * (inner + len), cy + Math.sin(a) * (inner + len));
    c.stroke();
  }
  const hour = still ? 0 : Math.floor((t % 24) / 1);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU - Math.PI / 2;
    c.strokeStyle = i === hour ? INK : MID;
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * R * 0.93, cy + Math.sin(a) * R * 0.93);
    c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    c.stroke();
  }
  if (R > 45) text(c, '24/7', cx, cy + R * 0.09, display(R * 0.26), INK, 'center');
};

// Minisoft: ten units of delivery work, six of them gone (60% time saved).
const minisoft: DrawFigure = (c, w, h, t, still) => {
  const k = pingPong(t, 8, still);
  const saved = [1, 2, 4, 5, 7, 8];
  const gap = w * 0.012;
  const barW = (w - gap * 9) / 10;
  const barH = h * 0.62;
  const y = h * 0.2;
  let kept = 0;
  for (let i = 0; i < 10; i++) {
    const isSaved = saved.includes(i);
    const from = i * (barW + gap);
    const to = kept * (barW + gap);
    c.strokeStyle = LOW;
    c.lineWidth = 1;
    c.strokeRect(from + 0.5, y + 0.5, barW - 1, barH - 1);
    if (isSaved) {
      const e = 1 - smooth(k * 1.4 - saved.indexOf(i) * 0.07);
      c.fillStyle = ink(0.45 * e);
      c.fillRect(from, y + barH * (1 - e), barW, barH * e);
    } else {
      c.fillStyle = INK;
      c.fillRect(from + (to - from) * k, y, barW, barH);
      kept++;
    }
  }
  if (h > 120) text(c, '60% saved', w, y + barH + Math.min(28, h * 0.14), mono(12), DIM, 'right');
};

// IBM: 35,000 points on a sphere, one per seller on the platform.
const SELLERS = 35000;
let sphere: Float32Array | null = null;
function sellers() {
  if (sphere) return sphere;
  sphere = new Float32Array(SELLERS * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < SELLERS; i++) {
    const y = 1 - (i / (SELLERS - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = g * i;
    sphere[i * 3] = Math.cos(a) * r;
    sphere[i * 3 + 1] = y;
    sphere[i * 3 + 2] = Math.sin(a) * r;
  }
  return sphere;
}
const ibm: DrawFigure = (c, w, h, t, still) => {
  const pts = sellers();
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.47;
  const rot = still ? 0.6 : t * 0.14;
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  const tilt = 0.38;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const size = Math.max(0.7, R / 260);
  const front = new Path2D();
  const back = new Path2D();
  for (let i = 0; i < SELLERS; i++) {
    const px = pts[i * 3];
    const py = pts[i * 3 + 1];
    const pz = pts[i * 3 + 2];
    const x = px * cr + pz * sr;
    const z = -px * sr + pz * cr;
    const y = py * ct - z * st;
    const depth = py * st + z * ct;
    (depth > 0 ? front : back).rect(cx + x * R, cy - y * R, size, size);
  }
  c.fillStyle = 'rgba(239,237,232,.1)';
  c.fill(back);
  c.fillStyle = 'rgba(239,237,232,.62)';
  c.fill(front);
};

// Jonas: the $303K, as its three real parts, to scale.
const jonas: DrawFigure = (c, w, h, t, still) => {
  const parts: [string, number][] = [
    ['Wes', 150],
    ['M&A', 120],
    ['Computrition', 33],
  ];
  const total = 303;
  const k = still ? 1 : smooth(((t % 9) / 9) / 0.55);
  const y = h * 0.42;
  const barH = Math.max(10, h * 0.14);
  const gap = 3;
  const usable = w - gap * 2;
  let x = 0;
  let spent = 0;
  parts.forEach(([, amount], i) => {
    const full = (amount / total) * usable;
    const start = spent / total;
    const local = clamp01((k - start) / (amount / total));
    c.fillStyle = LOW;
    c.fillRect(x, y, full, barH);
    c.fillStyle = ink(1 - i * 0.26);
    c.fillRect(x, y, full * local, barH);
    x += full + gap;
    spent += amount;
  });
  if (h < 120) return;
  text(c, '$303K+', 0, y - h * 0.09, display(Math.min(64, h * 0.24)), INK);
  const legendY = y + barH + 26;
  const size = Math.max(11, Math.min(13, w * 0.035));
  parts.forEach(([name, amount], i) => {
    text(c, name, 0, legendY + i * 20, mono(size), DIM);
    text(c, `$${amount}K`, w, legendY + i * 20, mono(size), INK, 'right');
  });
};

// Microsoft: the same ten units of work, serial and then multithreaded, 40% less latency.
const microsoft: DrawFigure = (c, w, h, t, still) => {
  const unit = w / 10;
  const blockH = Math.max(6, h * 0.1);
  const gap = 2;
  const showText = h > 120;
  const yA = h * (showText ? 0.22 : 0.16);
  const yB = h * (showText ? 0.56 : 0.5);
  const head = still ? 1 : clamp01((t % 8) / 6.5);
  const drawLane = (count: number, y: number) => {
    for (let i = 0; i < count; i++) {
      const fill = clamp01(head * 10 - i);
      c.fillStyle = LOW;
      c.fillRect(i * unit, y, unit - gap, blockH);
      c.fillStyle = INK;
      c.fillRect(i * unit, y, (unit - gap) * fill, blockH);
    }
  };
  drawLane(10, yA);
  drawLane(6, yB);
  drawLane(4, yB + blockH + 4);
  c.fillStyle = MID;
  c.fillRect(w * 0.6, yB - 6, 1, blockH * 2 + 16);
  if (showText) {
    text(c, 'Before', 0, yA - 10, mono(12), DIM);
    text(c, 'Multithreaded', 0, yB - 10, mono(12), DIM);
    text(c, '40% less latency', w, yB + blockH * 2 + 28, mono(12), INK, 'right');
  }
};

export function monthsUntilGraduation(now: Date) {
  return (2027 - now.getFullYear()) * 12 + (11 - now.getMonth());
}

// Carleton: the months left to the December 2027 finish, live from today's date.
const carleton: DrawFigure = (c, w, h, t, still) => {
  const n = monthsUntilGraduation(new Date());
  if (n <= 0) {
    text(c, 'Class of 2027', 0, h * 0.55, display(Math.min(48, w * 0.12)), INK);
    return;
  }
  const y = h * 0.6;
  const step = n > 0 ? (w - 16) / n : 0;
  c.fillStyle = LOW;
  c.fillRect(8, y, w - 16, 1);
  for (let i = 0; i <= n; i++) {
    const x = 8 + i * step;
    const beat = still ? 0 : 0.5 + 0.5 * Math.sin(t * 2 - i * 0.8);
    c.fillStyle = i === n ? INK : ink(0.3 + 0.4 * beat);
    c.beginPath();
    c.arc(x, y, i === n ? 6 : 3, 0, TAU);
    c.fill();
  }
  if (h > 120) {
    const label = `${n} ${n === 1 ? 'month' : 'months'}`;
    let size = Math.min(64, h * 0.26);
    c.font = display(size);
    const wide = c.measureText(label).width;
    if (wide > w - 2) size *= (w - 2) / wide;
    text(c, label, 0, y - h * 0.16, display(size), INK);
    text(c, 'to Dec 2027', w, y + 30, mono(12), DIM, 'right');
  }
};

export const FIGURES: Record<FigureKey, DrawFigure> = {
  mobisoins,
  decks,
  wes,
  aiqsr,
  ma,
  computrition,
  zerpha,
  ulife,
  minisoft,
  ibm,
  jonas,
  microsoft,
  carleton,
};

export const FIGURE_LABELS: Record<FigureKey, string> = {
  mobisoins: 'A ring counting down the exclusive 18-second nurse offer across 3 rounds.',
  decks: '11,600 cells filling in, one for each character of chat reaching the engine.',
  wes: 'Two bars to scale: one minute before, 2.3 seconds after.',
  aiqsr: '957 dots, one for each AI initiative tracked.',
  ma: 'Answer lines connecting by citation to their source passages.',
  computrition: 'Adoption spreading through 400 points, one for each senior leader.',
  zerpha: 'Noisy scraped fragments resolving into structured rows.',
  ulife: 'A voice waveform around a 24-hour dial.',
  minisoft: 'Ten units of work with six removed, 60% time saved.',
  ibm: 'A rotating sphere of 35,000 points, one for each seller.',
  jonas: 'A bar of $303K split to scale into Wes, M&A and Computrition savings.',
  microsoft: 'Ten units of work run serially and then in parallel, finishing 40% sooner.',
  carleton: 'A timeline of the months remaining until December 2027.',
};
