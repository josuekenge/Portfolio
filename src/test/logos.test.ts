import { describe, expect, it } from 'vitest';
import { LOGO_DATA } from '../data/logos.generated';
import { logo, MARQUEE_LOGOS, matchLogos } from '../data/logos';
import { buildField, flatten, LOGO_PATHS } from '../lib/logo';

const keys = (text: string) => matchLogos(text).map((l) => l.key);

describe('matchLogos', () => {
  it('finds real tools in text', () => {
    expect(keys('Supabase + pgvector · Azure OpenAI GPT-4.1 · LangChain')).toEqual(['supabase', 'azure', 'openai', 'langchain']);
  });
  it('does not confuse similar names', () => {
    expect(keys('JavaScript')).toEqual(['javascript']);
    expect(keys('Java')).toEqual(['java']);
    expect(keys('React Native')).toEqual(['react']);
    expect(keys('React')).toEqual(['react']);
    expect(keys('GitHub Actions')).toEqual(['githubactions']);
    expect(keys('Next.js')).toEqual(['nextdotjs']);
  });
  it('maps AWS services to the AWS mark once', () => {
    expect(keys('Amazon Bedrock · AWS EC2 · S3 · SES · SNS')).toEqual(['aws']);
  });
  it('returns nothing for text naming no tool, and honours max', () => {
    expect(keys('')).toEqual([]);
    expect(keys('Warehouse Staff')).toEqual([]);
    expect(matchLogos('React Docker Python', 1)).toHaveLength(1);
  });
});

describe('logo data', () => {
  it('has path data and a viewBox for every mark', () => {
    Object.values(LOGO_DATA).forEach((l) => {
      expect(l.inner).toMatch(/<(path|rect|circle|ellipse)/);
      expect(l.inner).not.toMatch(/<script/i);
      expect(l.viewBox).toMatch(/^[\d.-]+ [\d.-]+ [\d.]+ [\d.]+$/);
    });
  });
  it('has a real mark for every tool the matcher can return', () => {
    const everyTool = 'Next.js React TypeScript JavaScript Node.js Express Supabase PostgreSQL Docker GitHub Actions Python FastAPI SQLAlchemy OpenShift Claude AWS Azure OpenAI Vapi .NET C# Angular LangChain Tailwind shadcn Expo Firebase Stripe Twilio Mapbox NestJS TypeORM Gemini Netlify Railway ElevenLabs Slack pytest Cursor Chart.js Spring Boot Java C++ HTML CSS';
    const found = matchLogos(everyTool);
    expect(found.length).toBeGreaterThanOrEqual(44);
    found.forEach((l) => {
      expect(l.viewBox).toBeTruthy();
      expect(l.title).toBeTruthy();
    });
  });
  it('has no duplicates in the marquee', () => {
    expect(new Set(MARQUEE_LOGOS).size).toBe(MARQUEE_LOGOS.length);
    MARQUEE_LOGOS.forEach((k) => expect(logo(k).title).toBeTruthy());
  });
});

describe('JK mark geometry', () => {
  it('flattens all four pieces inside the 785 x 675 box', () => {
    LOGO_PATHS.forEach((d) => {
      const pts = flatten(d);
      expect(pts.length).toBeGreaterThanOrEqual(4);
      pts.forEach(([x, y]) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(785);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(675);
      });
    });
  });
  it('builds a field that is inside the mark and outside at the corners', () => {
    const W = 180;
    const H = 156;
    const f = buildField(W, H);
    expect(f).toHaveLength(W * H * 2);
    expect(f[0]).toBeLessThan(0);
    // A point in the K stem, at logo (388, 550).
    const s = (W * 0.86) / 785;
    const x = Math.round((W - 785 * s) / 2 + 388 * s);
    const y = Math.round((H - 675 * s) / 2 + 550 * s);
    expect(f[(y * W + x) * 2]).toBeGreaterThan(0);
    expect(f.every((v) => Number.isFinite(v))).toBe(true);
  });
});
