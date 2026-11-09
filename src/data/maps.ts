import { matchLogos, type LogoKey } from './logos';
import type { DiagramNode, System } from './systems';
import type { Edge } from '../components/wires';
import type { FigureKey } from '../motion/figures';

export const COMPANY: Partial<Record<FigureKey, LogoKey>> = {
  decks: 'ibm',
  wes: 'jonas',
  aiqsr: 'jonas',
  ma: 'jonas',
  computrition: 'jonas',
  minisoft: 'jonas',
};

export interface MapModel {
  id: string;
  title: string;
  frame: string;
  rows: DiagramNode[][];
  foot?: { k: string; v: string };
  labels?: { from: string; to: string; text: string }[];
  band?: { fromRow: number; toRow: number; label: string };
  rules?: { k: string; t: string; d: string }[];
}

interface SystemExtras {
  labels?: { from: string; to: string; text: string }[];
  band?: { fromRow: number; toRow: number; label: string };
  rules?: { k: string; t: string; d: string }[];
  heroStat?: number;
}

export const EXTRAS: Partial<Record<FigureKey, SystemExtras>> = {
  decks: {
    heroStat: 1,
    band: { fromRow: 1, toRow: 2, label: 'The grounding layer · what I engineered' },
    labels: [
      { from: 'Grounding Rules', to: 'Context · Slides · Outline', text: 'size-capped documents' },
      { from: 'Grounding Rules', to: 'Short Goal', text: 'short goal' },
      { from: 'Background Poller', to: 'Agentic Slide Builder', text: '8 s polls · up to 35 min' },
    ],
    rules: [
      { k: 'Chat only', t: 'Context + outline', d: 'Session context plus a generated outline' },
      { k: 'Deck only', t: 'Slides + own outline', d: "The deck's slides and its own structure" },
      { k: 'Deck + chat', t: 'Deck leads', d: 'Deck sets the structure, session tailors it' },
      { k: 'Nothing', t: 'Nothing invented', d: 'No outline, and the logs say so' },
    ],
  },
  computrition: { labels: [{ from: 'AI Architecture + Roadmap', to: 'AWS AI-DLC Framework', text: 'daily standups' }] },
  wes: { labels: [{ from: 'NL Query Translator', to: 'Warehouse SQL DB', text: 'validated SQL' }] },
  ma: { labels: [{ from: 'Next.js 15 + React', to: 'Next.js Server Functions', text: 'type-safe RPC' }] },
};

const GLYPH_BY_NAME: Record<string, LogoKey> = {
  'Session Chat': 'glyph-chat',
  'Uploaded Deck': 'glyph-deck',
  'Title + Focus': 'glyph-target',
  'Grounding Rules': 'glyph-rules',
  'Context · Slides · Outline': 'glyph-docs',
  'Short Goal': 'glyph-goal',
  'Background Poller': 'glyph-poll',
  'Agentic Slide Builder': 'glyph-engine',
  'Chat Message': 'glyph-chat',
  'Turn API': 'glyph-stream',
  'LangGraph Runtime': 'glyph-loop',
  'Demo Finder App': 'glyph-target',
  'Talk Track Tool': 'glyph-docs',
  'Silent Failure': 'glyph-alert',
  'Flat 60 s Tool Limit': 'glyph-clock',
  'Frozen Event Loop': 'glyph-freeze',
  'Timing Breakdown': 'glyph-bars',
  'Watchdog Stack Dumps': 'glyph-stack',
  'Background Search': 'glyph-run',
  'Platform Write-up': 'glyph-deck',
  'Stale Run Reconciler': 'glyph-shield',
};

function glyphForTier(tier: string): LogoKey {
  if (/user|analyst|caller|role|architect|team|seller|portfolio|product/i.test(tier)) return 'glyph-patient';
  if (/output|response|outcome/i.test(tier)) return 'glyph-output';
  if (/database|vector|source|retrieve|index|memory|cache|opportunity/i.test(tier)) return 'glyph-db';
  if (/text|method|framework|rule|gate|contract|ranking|inception|context|oversight|concurrency|batching/i.test(tier)) return 'glyph-rules';
  if (/frontend|app|surface|render|generate|query|input/i.test(tier)) return 'glyph-deck';
  if (/notify|operation|restructure/i.test(tier)) return 'glyph-poll';
  return 'glyph-engine';
}

/** The marks shown on a node: the real product logos when it names any, otherwise a line icon. */
export function marksForNode([tier, name, sub]: DiagramNode): LogoKey[] {
  if (GLYPH_BY_NAME[name]) return [GLYPH_BY_NAME[name]];
  const found = matchLogos(`${name} ${sub}`, 2).map((l) => l.key);
  if (found.length) return found;
  const fromTier = matchLogos(tier, 1).map((l) => l.key);
  return fromTier.length ? fromTier : [glyphForTier(tier)];
}

export const isTerminal = (tier: string) => /^(Output|Response|Outcome)$/i.test(tier);

/** Nodes that are the author's own work inside a diagram of a shared system. */
export const isMine = (tier: string) => /^My part$/i.test(tier);

export const nodeId = (model: { id: string }, row: number, index: number) => `${model.id}-${row}-${index}`;

export function toModel(system: System): MapModel {
  const extras = EXTRAS[system.id];
  return { id: system.id, title: system.title, frame: system.frame, rows: system.rows, foot: system.foot, labels: extras?.labels, band: extras?.band, rules: extras?.rules };
}

export function tierLabel(nodes: DiagramNode[]) {
  return [...new Set(nodes.map(([tier]) => tier))].join(' / ');
}

/** Wires between rows. On narrow screens the rows stack, so one spine connects them. */
export function systemEdges(system: MapModel, compact: boolean): Edge[] {
  const labels = system.labels ?? [];
  const edges: Edge[] = [];
  system.rows.forEach((nodes, r) => {
    const next = system.rows[r + 1];
    if (!next) return;
    if (compact) {
      edges.push({ from: nodeId(system, r, nodes.length - 1), to: nodeId(system, r + 1, 0) });
      return;
    }
    nodes.forEach((a, i) =>
      next.forEach((b, j) => {
        edges.push({
          from: nodeId(system, r, i),
          to: nodeId(system, r + 1, j),
          label: labels.find((l) => l.from === a[1] && l.to === b[1])?.text,
        });
      }),
    );
  });
  return edges;
}

export interface MobiNode {
  id: string;
  name: string;
  sub: string;
  marks: LogoKey[];
  gc: string;
  gr: string;
}

export const MOBI_NODES: MobiNode[] = [
  { id: 'mapbox', name: 'Mapbox', sub: 'Maps + directions', marks: ['mapbox'], gc: '1 / 2', gr: '1' },
  { id: 'patient', name: 'Patient app', sub: 'Map, book, track, pay', marks: ['glyph-patient', 'expo'], gc: '3 / 4', gr: '1' },
  { id: 'nurse', name: 'Nurse app', sub: 'Go online, accept, navigate', marks: ['glyph-nurse', 'react'], gc: '4 / 5', gr: '1' },
  { id: 'firebase', name: 'Firebase', sub: 'GPS, offers, chat, FCM push', marks: ['firebase'], gc: '6 / 7', gr: '1 / 3' },
  { id: 'stripe', name: 'Stripe', sub: 'Escrow + Connect', marks: ['stripe'], gc: '1 / 2', gr: '2' },
  { id: 'nest', name: 'NestJS API', sub: '18 modules, ~111 endpoints, system of record', marks: ['nestjs'], gc: '3 / 5', gr: '2' },
  { id: 'twilio', name: 'Twilio', sub: 'Phone OTP', marks: ['twilio'], gc: '1 / 2', gr: '3' },
  { id: 'pg', name: 'PostgreSQL', sub: '15 entities, 18 migrations, Law 25 audit', marks: ['postgresql'], gc: '3 / 5', gr: '3' },
  { id: 'claude', name: 'Claude Haiku', sub: 'Support assistant, medical guardrail', marks: ['claude'], gc: '6 / 7', gr: '3' },
  { id: 'aws', name: 'AWS', sub: 'EC2 hosting · Cognito auth · S3, SES, SNS · ca-central-1 residency', marks: ['aws'], gc: '1 / -1', gr: '4' },
];

export const MOBI_EDGES: Edge[] = [
  { from: 'patient', to: 'nest', label: 'REST' },
  { from: 'nurse', to: 'nest' },
  { from: 'nest', to: 'pg', color: '#8FB0FF', label: 'TypeORM' },
  { from: 'patient', to: 'mapbox', side: 'lr' },
  { from: 'nest', to: 'stripe', side: 'lr', color: '#A49EFF' },
  { from: 'nest', to: 'twilio', side: 'lr', color: '#FF6B7E' },
  { from: 'nurse', to: 'firebase', side: 'rl', color: '#FFC24D', realtime: true },
  { from: 'nest', to: 'firebase', side: 'rl', color: '#FFC24D', label: 'Admin SDK', realtime: true },
  { from: 'nest', to: 'claude', side: 'rl', color: '#F0A085' },
  { from: 'pg', to: 'aws', color: '#FFB547', label: 'self-hosted' },
];
