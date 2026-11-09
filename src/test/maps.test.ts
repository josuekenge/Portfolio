import { describe, expect, it } from 'vitest';
import { wirePath } from '../components/wires';
import { LOGO_DATA } from '../data/logos.generated';
import { INTERNSHIPS } from '../data/internships';
import { COMPANY, EXTRAS, marksForNode, MOBI_EDGES, MOBI_NODES, nodeId, systemEdges, tierLabel, toModel, type MapModel, isMine } from '../data/maps';
import { SYSTEMS } from '../data/systems';

describe('system maps', () => {
  it.each(SYSTEMS.map((s) => [s.title, s] as const))('%s: every node has a mark that exists', (_t, s) => {
    s.rows.flat().forEach((node) => {
      const marks = marksForNode(node);
      expect(marks.length).toBeGreaterThan(0);
      marks.forEach((m) => expect(LOGO_DATA[m]).toBeDefined());
    });
  });

  it.each(SYSTEMS.map((s) => [s.title, s] as const))('%s: wires connect only real nodes and reach every row', (_t, s) => {
    const ids = new Set(s.rows.flatMap((nodes, r) => nodes.map((_, i) => nodeId(s, r, i))));
    for (const compact of [false, true]) {
      const edges = systemEdges(toModel(s), compact);
      edges.forEach((e) => {
        expect(ids.has(e.from)).toBe(true);
        expect(ids.has(e.to)).toBe(true);
      });
      const targets = new Set(edges.map((e) => Number(e.to.split('-')[1])));
      for (let r = 1; r < s.rows.length; r++) expect(targets.has(r)).toBe(true);
    }
  });

  it('wires every node to every node in the next row on wide screens, one spine on narrow', () => {
    const decks = SYSTEMS.find((s) => s.id === 'decks')!;
    expect(systemEdges(toModel(decks), false)).toHaveLength(3 + 1 + 2 + 2 + 1 + 1);
    expect(systemEdges(toModel(decks), true)).toHaveLength(decks.rows.length - 1);
  });

  it('every configured wire label lands on a real wire', () => {
    SYSTEMS.forEach((s) => {
      const labels = EXTRAS[s.id]?.labels ?? [];
      const drawn = systemEdges(toModel(s), false).filter((e) => e.label).length;
      expect(drawn).toBe(labels.length);
    });
  });

  it('decks has its band and its hero stat is the headline number', () => {
    const decks = SYSTEMS.find((s) => s.id === 'decks')!;
    const x = EXTRAS.decks!;
    expect(decks.out[x.heroStat!][0]).toBe('0 → 11.6K');
    expect(decks.rows[x.band!.fromRow][0][1]).toContain('Session Reader');
    expect(decks.rows[x.band!.toRow][0][1]).toBe('Grounding Rules');
  });

  it('joins differing tiers in a row and does not repeat identical ones', () => {
    expect(tierLabel([['Input', 'a', ''], ['Input', 'b', '']])).toBe('Input');
    expect(tierLabel([['LLM', 'a', ''], ['Database', 'b', '']])).toBe('LLM / Database');
  });

  it('MobiSoins edges connect real nodes, all marks exist', () => {
    const ids = new Set(MOBI_NODES.map((n) => n.id));
    MOBI_EDGES.forEach((e) => {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
    });
    MOBI_NODES.flatMap((n) => n.marks).forEach((m) => expect(LOGO_DATA[m]).toBeDefined());
  });

  it('only employers get a company mark, and founder projects do not', () => {
    expect(COMPANY.zerpha).toBeUndefined();
    expect(COMPANY.ulife).toBeUndefined();
    expect(COMPANY.decks).toBe('ibm');
  });
});

describe('wirePath', () => {
  const a = { l: 0, r: 100, t: 0, b: 40 };
  it('runs bottom to top between stacked boxes', () => {
    const { d } = wirePath(a, { l: 0, r: 100, t: 100, b: 140 });
    expect(d.startsWith('M50 40C')).toBe(true);
    expect(d.endsWith('50 100')).toBe(true);
  });
  it('leaves the left edge for lr and the right edge for rl', () => {
    const b = { l: -200, r: -100, t: 0, b: 40 };
    expect(wirePath(a, b, 'lr').d.startsWith('M0 20C')).toBe(true);
    expect(wirePath(a, b, 'lr').d.endsWith('-100 20')).toBe(true);
    const c = { l: 200, r: 300, t: 0, b: 40 };
    expect(wirePath(a, c, 'rl').d.startsWith('M100 20C')).toBe(true);
    expect(wirePath(a, c, 'rl').d.endsWith('200 20')).toBe(true);
  });
  it('has no NaN for touching boxes', () => {
    expect(wirePath(a, { l: 0, r: 100, t: 40, b: 80 }).d).not.toMatch(/NaN/);
  });
});

describe('internship pages', () => {
  const models: MapModel[] = INTERNSHIPS.flatMap((job) => [
    { id: `${job.id}-overview`, title: job.company, frame: job.overviewFrame, rows: job.overview },
    ...job.workstreams.filter((w) => w.rows).map((w) => ({ id: w.id, title: w.title, frame: w.frame ?? '', rows: w.rows!, labels: w.labels })),
  ]);

  it('covers all three internships with their workstreams', () => {
    expect(INTERNSHIPS.map((j) => [j.id, j.workstreams.length])).toEqual([['ibm', 6], ['jonas', 6], ['microsoft', 3]]);
  });

  it('gives every workstream an architecture diagram, its own or a linked case study', () => {
    INTERNSHIPS.flatMap((j) => j.workstreams).forEach((w) => {
      const linked = w.system && SYSTEMS.some((s) => s.id === w.system);
      expect(Boolean(linked || (w.rows && w.rows.length >= 4)), w.id).toBe(true);
      expect(w.summary.length).toBeGreaterThan(60);
    });
  });

  it('has unique section ids on each page', () => {
    INTERNSHIPS.forEach((j) => {
      const ids = j.workstreams.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it.each(models.map((m) => [m.id, m] as const))('%s: marks exist, wires connect, labels land', (_id, m) => {
    m.rows.flat().forEach((node) => marksForNode(node).forEach((k) => expect(LOGO_DATA[k], k).toBeDefined()));
    const edges = systemEdges(m, false);
    expect(edges.length).toBeGreaterThanOrEqual(m.rows.length - 1);
    expect(edges.filter((e) => e.label)).toHaveLength(m.labels?.length ?? 0);
    expect(new Set(m.rows.flat().map((n) => n[1])).size).toBe(m.rows.flat().length);
  });

  describe('Agent V2 sections', () => {
    const ibm = INTERNSHIPS.find((j) => j.id === 'ibm')!;
    const v2 = ibm.workstreams.filter((w) => ['demo-creator-v2', 'v2-timeouts'].includes(w.id));

    it('follow straight after the V1 Demo Creator, each with its own diagram', () => {
      expect(ibm.workstreams.slice(0, 3).map((w) => w.id)).toEqual(['demo-creator', 'demo-creator-v2', 'v2-timeouts']);
      v2.forEach((w) => expect(w.rows?.length, w.id).toBeLessThanOrEqual(6));
    });

    it('credit the platform to the team and describe only my part as mine', () => {
      const port = JSON.stringify(v2[0]);
      expect(port).toMatch(/built by the Workshop team/);
      expect(port).toMatch(/What was my part\?/);
    });

    it('do not claim the event loop freeze is fixed or show unbuilt runtime stages', () => {
      const all = JSON.stringify(v2);
      expect(all).not.toMatch(/freeze (is|was) fixed/i);
      expect(all).not.toMatch(/\b(critic|invariants)\b/i);
    });

    it('mark exactly my two pieces of the V2 diagram as mine', () => {
      const mine = v2[0].rows!.flat().filter(([tier]) => isMine(tier)).map(([, name]) => name);
      expect(mine).toEqual(['Demo Finder App', 'Talk Track Tool']);
      expect(isMine('Platform')).toBe(false);
      expect(isMine('Output')).toBe(false);
    });

    it('give the diagrams distinct icons instead of one repeated chip', () => {
      v2.forEach((w) => {
        const marks = w.rows!.flat().flatMap((node) => marksForNode(node));
        expect(marks, w.id).not.toContain('glyph-engine');
      });
      const timeouts = v2[1].rows!.flat().map((node) => marksForNode(node)[0]);
      expect(new Set(timeouts).size).toBe(timeouts.length);
    });

    it('lead with stats a recruiter can read', () => {
      const stats = JSON.stringify(v2[0].out);
      expect(stats).not.toMatch(/characters?|12\.4K|8,000/);
      expect(stats).toContain('60 s');
    });

    it('keep internal identifiers and teammates off the public page', () => {
      const all = JSON.stringify(v2);
      expect(all).not.toMatch(/#\d{3}\b|CLRTY|Michael|tutor_v2|datasources_v2|[0-9a-f]{8}-[0-9a-f]{4}-|USE_FRONTIER|AGENT_[A-Z_]+|\bISC\b|\bEPM\b|\bDB2\b|workshop\.ibm\.com|github\.ibm/);
    });
  });

  it('keeps the key numbers consistent with the rest of the site', () => {
    const all = JSON.stringify(INTERNSHIPS);
    ['35,000+', '$303K+', '2.3 seconds', '$14,500', '72 hours', '50%', '90%'].forEach((fact) => expect(all).toContain(fact));
    expect(all).not.toMatch(/1\.2\s?s/);
  });
});
