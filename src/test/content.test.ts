import { describe, expect, it } from 'vitest';
import { EDUCATION, EXPERIENCE } from '../data/experience';
import { ARCH_CARDS, MOBISOINS } from '../data/mobisoins';
import { SYSTEMS } from '../data/systems';
import { FIGURE_LABELS, FIGURES } from '../motion/figures';
import { splitLead } from '../lib/text';

describe('site content keeps the full depth of the original site', () => {
  it('has all 8 systems, each with unique routes', () => {
    expect(SYSTEMS.map((s) => s.id).sort()).toEqual(['aiqsr', 'computrition', 'decks', 'ma', 'minisoft', 'ulife', 'wes', 'zerpha']);
    expect(new Set(SYSTEMS.map((s) => s.n)).size).toBe(8);
  });

  it.each(SYSTEMS.map((s) => [s.title, s] as const))('%s has a full case study', (_title, s) => {
    expect(s.summary.length).toBeGreaterThan(60);
    expect(s.rows.length).toBeGreaterThanOrEqual(4);
    s.rows.flat().forEach((node) => node.forEach((part) => expect(part).not.toBe('')));
    expect(s.out.length).toBeGreaterThanOrEqual(4);
    expect(s.steps.length).toBeGreaterThanOrEqual(4);
    expect(s.stack.length).toBeGreaterThanOrEqual(4);
  });

  it('keeps the Grounded Decks investigation', () => {
    const decks = SYSTEMS.find((s) => s.id === 'decks');
    expect(decks?.find).toHaveLength(8);
    expect(decks?.steps).toHaveLength(10);
  });

  it('keeps every experience bullet', () => {
    expect(EXPERIENCE.map((e) => [e.id, e.bullets.length])).toEqual([['ibm', 7], ['jonas', 5], ['microsoft', 4]]);
    expect(EDUCATION.id).toBe('carleton');
  });

  it('keeps the MobiSoins architecture depth', () => {
    expect(MOBISOINS.highlights).toHaveLength(4);
    expect(MOBISOINS.roles).toHaveLength(2);
    expect(ARCH_CARDS).toHaveLength(8);
  });

  it('uses one consistent value where the old site contradicted itself', () => {
    const all = JSON.stringify([SYSTEMS, MOBISOINS, EXPERIENCE]);
    expect(all).not.toMatch(/1\.2\s?s/);
    expect(all).not.toMatch(/30-second/);
  });

  it('gives every project and experience its own motion figure', () => {
    const owners = [...SYSTEMS.map((s) => s.id), 'mobisoins', ...EXPERIENCE.map((e) => e.id), EDUCATION.id] as const;
    expect(owners).toHaveLength(13);
    expect(new Set(owners).size).toBe(13);
    owners.forEach((id) => {
      expect(typeof FIGURES[id]).toBe('function');
      expect(FIGURE_LABELS[id].length).toBeGreaterThan(10);
    });
  });
});

describe('splitLead', () => {
  it('pulls out a question or label lead', () => {
    expect(splitLead('Why documents? Because.')).toEqual({ lead: 'Why documents?', rest: 'Because.' });
    expect(splitLead('CI/CD: GitHub Actions builds.')).toEqual({ lead: 'CI/CD:', rest: 'GitHub Actions builds.' });
  });
  it('does not turn a long sentence ending in a colon into a heading', () => {
    expect(splitLead('Delivered the full feature in 2 weeks against a 4-week plan: 2× velocity.').lead).toBe('');
    expect(splitLead('How does a 15 to 20 minute job fit a web request? It does not.').lead).toBe('How does a 15 to 20 minute job fit a web request?');
  });
  it('leaves plain sentences alone', () => {
    expect(splitLead('Designed the full chatbot architecture.')).toEqual({ lead: '', rest: 'Designed the full chatbot architecture.' });
    expect(splitLead('')).toEqual({ lead: '', rest: '' });
  });
});
