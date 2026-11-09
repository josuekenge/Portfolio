import { describe, expect, it } from 'vitest';
import { buildSteps } from '../components/ExperienceScroll';
import { ORBIT_BODIES, orbitPoint } from '../components/Orbit';
import { INTERNSHIPS } from '../data/internships';

describe('orbitPoint', () => {
  const sizes: [number, number, number, number][] = [[640, 552, 128, 88], [350, 302, 88, 62], [1000, 640, 128, 88]];
  it.each(sizes)('keeps every card inside a %ix%i stage for a full turn', (w, h, bw, bh) => {
    for (let a = 0; a < Math.PI * 4; a += 0.05) {
      for (let i = 0; i < 4; i++) {
        const p = orbitPoint(i, 4, a, a * 7, w, h, bw, bh);
        const halfW = (bw * 1.16) / 2;
        const halfH = (bh * 1.16) / 2;
        expect(p.x - halfW).toBeGreaterThanOrEqual(0);
        expect(p.x + halfW).toBeLessThanOrEqual(w);
        expect(p.y - halfH).toBeGreaterThanOrEqual(0);
        expect(p.y + halfH).toBeLessThanOrEqual(h);
      }
    }
  });
  it('moves continuously, with no jumps for small time steps', () => {
    let prev = orbitPoint(0, 4, 0, 0, 640, 552, 128, 88);
    for (let t = 0.016; t < 40; t += 0.016) {
      const p = orbitPoint(0, 4, t * 0.17, t, 640, 552, 128, 88);
      expect(Math.hypot(p.x - prev.x, p.y - prev.y)).toBeLessThan(2);
      prev = p;
    }
  });
  it('spaces the bodies evenly around the ring', () => {
    const a = orbitPoint(0, 4, 0, 0, 640, 552, 128, 88).depth;
    const c = orbitPoint(2, 4, 0, 0, 640, 552, 128, 88).depth;
    expect(a).toBeCloseTo(c);
    expect(ORBIT_BODIES).toHaveLength(4);
  });
  it('survives a stage too small to orbit in', () => {
    const p = orbitPoint(0, 4, 1, 1, 40, 30, 128, 88);
    expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
  });
});

describe('experience steps', () => {
  const steps = buildSteps();
  it('has every piece of work plus Carleton, in order', () => {
    const total = INTERNSHIPS.reduce((n, j) => n + j.workstreams.length, 0);
    expect(steps).toHaveLength(total + 1);
    expect(steps[steps.length - 1].key).toBe('carleton');
    expect(new Set(steps.map((s) => s.key)).size).toBe(steps.length);
  });
  it('shows a company header once per employer', () => {
    expect(steps.filter((s) => s.showHead).map((s) => s.job?.id)).toEqual(['ibm', 'jonas', 'microsoft']);
  });
  it('gives every piece of work a diagram and real detail on the left', () => {
    steps.filter((s) => s.work).forEach((s) => {
      expect(s.model, s.key).toBeDefined();
      expect(s.points.length, s.key).toBeGreaterThanOrEqual(2);
      expect(s.work!.summary.length).toBeGreaterThan(60);
    });
  });
  it('does not repeat the same point twice in a section', () => {
    steps.forEach((s) => expect(new Set(s.points).size).toBe(s.points.length));
  });
});
