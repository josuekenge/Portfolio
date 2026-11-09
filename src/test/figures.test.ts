import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { FIGURES, monthsUntilGraduation, type FigureKey } from '../motion/figures';

class FakePath {
  rects = 0;
  rect() {
    this.rects++;
  }
}

function recorder() {
  const log = { arcs: 0, rects: 0, fillRects: [] as number[][], pathRects: 0, texts: [] as string[] };
  const handler: ProxyHandler<object> = {
    get(_t, key) {
      if (key === 'arc') return () => void log.arcs++;
      if (key === 'measureText') return (s: string) => ({ width: s.length * 8 });
      if (key === 'rect') return () => void log.rects++;
      if (key === 'fillRect') return (...a: number[]) => void log.fillRects.push(a);
      if (key === 'fillText') return (s: string) => void log.texts.push(s);
      if (key === 'fill') return (p?: FakePath) => void (p && (log.pathRects += p.rects));
      return () => undefined;
    },
    set: () => true,
  };
  return { ctx: new Proxy({}, handler) as CanvasRenderingContext2D, log };
}

beforeAll(() => {
  (globalThis as unknown as { Path2D: unknown }).Path2D = FakePath;
});

const KEYS = Object.keys(FIGURES) as FigureKey[];

describe('every figure is safe to draw', () => {
  const cases: [string, number, number, number, boolean][] = [
    ['large', 640, 480, 3, false],
    ['thumbnail', 96, 56, 3, false],
    ['tiny', 2, 2, 3, false],
    ['time zero', 400, 300, 0, false],
    ['long after load', 400, 300, 987654.321, false],
    ['still', 400, 300, 0, true],
  ];
  it.each(KEYS)('%s draws at every size and time without error or NaN', (key) => {
    cases.forEach(([, w, h, t, still]) => {
      const { ctx, log } = recorder();
      expect(() => FIGURES[key](ctx, w, h, t, still)).not.toThrow();
      log.fillRects.flat().forEach((v) => expect(Number.isFinite(v)).toBe(true));
    });
  });
});

describe('figures draw the real numbers', () => {
  it('AIQSR draws exactly 957 dots', () => {
    const { ctx, log } = recorder();
    FIGURES.aiqsr(ctx, 400, 300, 2, false);
    expect(log.arcs).toBe(957);
  });
  it('Grounded Decks fills exactly 11,600 cells when complete', () => {
    const { ctx, log } = recorder();
    FIGURES.decks(ctx, 400, 300, 0, true);
    expect(log.rects).toBe(11600);
  });
  it('Computrition draws exactly 400 leaders', () => {
    const { ctx, log } = recorder();
    FIGURES.computrition(ctx, 400, 300, 0, true);
    expect(log.arcs).toBe(400);
  });
  it('IBM draws exactly 35,000 sellers', () => {
    const { ctx, log } = recorder();
    FIGURES.ibm(ctx, 400, 300, 0, true);
    expect(log.pathRects).toBe(35000);
  });
  it('Wes bars are to scale: 2.3 s against 60 s', () => {
    const { ctx, log } = recorder();
    FIGURES.wes(ctx, 1000, 300, 0, true);
    const ink = log.fillRects.filter((r) => r[3] === 3).map((r) => r[2]);
    expect(ink[0]).toBeCloseTo(1000);
    expect(ink[1]).toBeCloseTo((1000 * 2.3) / 60);
  });
  it('Jonas segments are proportional to $150K, $120K, $33K', () => {
    const { ctx, log } = recorder();
    FIGURES.jonas(ctx, 909, 300, 0, true);
    const widths = log.fillRects.filter((_r, i) => i % 2 === 1).map((r) => r[2]);
    expect(widths[0] / widths[1]).toBeCloseTo(150 / 120);
    expect(widths[1] / widths[2]).toBeCloseTo(120 / 33);
  });
  it('MobiSoins starts at a full 18 seconds of round 1 of 3', () => {
    const { ctx, log } = recorder();
    FIGURES.mobisoins(ctx, 400, 400, 0, true);
    expect(log.texts).toEqual(['18 s', 'Round 1 of 3']);
  });
  it('MobiSoins moves to round 2 after 18 real seconds', () => {
    const { ctx, log } = recorder();
    FIGURES.mobisoins(ctx, 400, 400, 18.5, false);
    expect(log.texts).toEqual(['18 s', 'Round 2 of 3']);
  });
  it('Microsoft finishes 40% sooner: 10 units serial, 6 on the longest parallel lane', () => {
    const { ctx, log } = recorder();
    FIGURES.microsoft(ctx, 1000, 300, 0, true);
    const blocks = log.fillRects.filter((r) => r[3] === 30);
    const rows = new Map<number, number>();
    blocks.forEach((r) => rows.set(r[1], Math.max(rows.get(r[1]) ?? 0, r[0] + 100)));
    expect([...rows.values()]).toEqual([1000, 600, 400]);
  });
});

describe('months until graduation', () => {
  it('counts down to December 2027 and passes through zero', () => {
    expect(monthsUntilGraduation(new Date(2026, 10, 9))).toBe(13);
    expect(monthsUntilGraduation(new Date(2027, 10, 30))).toBe(1);
    expect(monthsUntilGraduation(new Date(2027, 11, 1))).toBe(0);
    expect(monthsUntilGraduation(new Date(2028, 0, 1))).toBe(-1);
  });
});

describe('Carleton countdown label', () => {
  afterEach(() => vi.useRealTimers());
  // Measured in Chrome: "13 months" in Funnel Display is 209px wide at 41.8px, about 0.556em per character.
  const EM_PER_CHAR = 0.556;

  function labelWidth(w: number, h: number) {
    let font = '';
    let width = -1;
    const handler: ProxyHandler<object> = {
      get(_t, key) {
        const measure = (s: string) => s.length * EM_PER_CHAR * parseFloat(font.split(' ')[1]);
        if (key === 'measureText') return (s: string) => ({ width: measure(s) });
        if (key === 'fillText') {
          return (s: string) => {
            if (/months?$/.test(s)) width = measure(s);
          };
        }
        return () => undefined;
      },
      set(_t, key, value) {
        if (key === 'font') font = String(value);
        return true;
      },
    };
    FIGURES.carleton(new Proxy({}, handler) as CanvasRenderingContext2D, w, h, 1, false);
    return width;
  }

  it.each([[190, 190], [220, 220], [440, 330], [150, 130]])('a two-digit count fits a %ipx by %ipx figure', (w, h) => {
    vi.useFakeTimers({ now: new Date(2026, 10, 9), toFake: ['Date'] });
    const width = labelWidth(w, h);
    expect(width).toBeGreaterThan(0);
    expect(width).toBeLessThanOrEqual(w);
  });
});
