// Josue Kenge — Portfolio
// One file, organized top-to-bottom by section.
// Reveal animations driven by IntersectionObserver in index.html.

const { useEffect, useRef, useState } = React;

// ────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────

// Shipped outcomes — concrete artifacts, not generic stack words.
const STACK_TICKER = [
  'IBM WATSONX · 25K SELLERS',
  'WES CHATBOT · 20× FASTER',
  'AIQSR · 957 INITIATIVES',
  'M&A RAG · $120K SAVED',
  'COMPUTRITION · 400+ LEADERS',
  'MICROSOFT · $14.5K/WK SAVED',
  'ZERPHA · 3 MIN RESEARCH',
  'AI-DLC · 72 HR FRONTEND',
];

const HEADLINE_METRICS = [
  { v: '25K+', l: 'sellers reached at IBM' },
  { v: '$303K+', l: 'client savings shipped' },
  { v: '957', l: 'AI initiatives tracked' },
  { v: '20×', l: 'query response speedup' },
];

const EXPERIENCE = [
  {
    co: 'IBM',
    role: 'AI Engineer Intern, watsonx Workshop',
    loc: 'Markham, ON',
    when: 'May 2026 — Present',
    color: '#3b6dff',
    bullets: [
      'Engineering AI features on watsonx Workshop, IBM\'s internal sales enablement platform serving 25,000+ sellers globally.',
      'Building full-stack with FastAPI on Python backend and React / Next.js frontend, shipping features into the daily workflow of IBM\'s global sales force.',
    ],
  },
  {
    co: 'Jonas Software',
    role: 'AI Engineer Intern',
    loc: 'Remote',
    when: 'Jan 2026 — Apr 2026',
    color: '#6e8dff',
    bullets: [
      'Shipped Wes, a production AI chatbot for warehouse management — cut query response from 1 min → 2.3s (20× faster) at 95% accuracy, unlocking $150K in 2 weeks.',
      'Engineered AIQSR, an enterprise analytics platform on Azure Container Apps with fully automated CI/CD, tracking 957 AI initiatives across 100+ companies, 80% fewer redundant API calls.',
      'Architected HIPAA-aware AI healthcare chatbot for Computrition on Amazon Bedrock, driving $33K savings and adoption across 400+ senior leaders.',
      'Delivered a full-stack RAG-based M&A due diligence platform for the Jonas Finance team, generating $120K in yearly savings.',
      'Led brownfield AWS AI-DLC engagements (Minisoft, Computrition) — 60% time savings, frontend component shipped in 72 hours.',
    ],
  },
  {
    co: 'Microsoft',
    role: 'Software Engineering & PM Intern',
    loc: 'Redmond, WA',
    when: 'Jun 2024 — Aug 2024',
    color: '#9bb4ff',
    bullets: [
      'Built a semantic indexing prototype (Azure, C#) increasing search accuracy by 25% on a 1M+ entry dataset under heavy query load.',
      'Multithreaded microservices workflow → 40% lower latency, $14,500/week saved on Azure compute via concurrency tuning and caching.',
      'Maintainable, scalable C# microservices for Office 365 search infrastructure.',
    ],
  },
];

const PROJECTS = [
  {
    n: '01',
    title: 'AIQSR Dashboard',
    sub: 'AI Initiative Quarterly Scorecard',
    year: '2025',
    role: 'Full-stack lead · Jonas Software',
    tech: ['Next.js 14', 'Express', 'Supabase', 'Azure OpenAI', 'Docker', 'Azure Container Apps'],
    blurb: 'Enterprise analytics platform tracking AI initiatives across 100+ operating companies at Jonas/CSI. Shipped from zero to production in a single dev cycle on a monorepo with automated CI/CD.',
    metrics: [
      { v: '957', l: 'AI initiatives' },
      { v: '100+', l: 'companies' },
      { v: '80%', l: 'fewer API calls' },
    ],
  },
  {
    n: '02',
    title: 'Wes Chatbot',
    sub: 'AI for warehouse ops',
    year: '2025',
    role: 'AI Engineer · Jonas Software',
    tech: ['.NET Framework', 'Angular', 'AWS AI-DLC', 'RBAC'],
    blurb: 'Production AI chatbot embedded into existing warehouse software via brownfield approach. Cut query response from 1 minute to 2.3 seconds at 95% accuracy.',
    metrics: [
      { v: '20×', l: 'faster queries' },
      { v: '2 wks', l: 'delivery (vs 4)' },
      { v: '$150K', l: 'savings unlocked' },
    ],
  },
  {
    n: '03',
    title: 'M&A Due Diligence',
    sub: 'AI-powered Acquisition Intel',
    year: '2025',
    role: 'AI Engineer · Jonas Finance',
    tech: ['Next.js 15', 'pgvector', 'Azure OpenAI GPT-4.1', 'LangChain', 'RAG'],
    blurb: 'Full-stack RAG platform for the Jonas Software finance team — grounded document querying with clickable in-line citations linking AI responses to source passages.',
    metrics: [
      { v: 'RAG', l: 'on prod docs' },
      { v: 'GPT-4.1', l: '+ pgvector' },
      { v: '$120K', l: 'yearly savings' },
    ],
  },
  {
    n: '04',
    title: 'Computrition Chatbot',
    sub: 'Healthcare AI · Architect',
    year: '2025',
    role: 'AI Consultant · Jonas Subsidiary',
    tech: ['Amazon Bedrock', 'AWS AI-DLC', 'HIPAA-aware', 'Brownfield'],
    blurb: 'Designed end-to-end AI chatbot architecture for a healthcare platform and coached the Computrition team through implementation, guided by AWS AI-DLC.',
    metrics: [
      { v: '< 2 wks', l: 'delivery' },
      { v: '10+', l: 'team using AI daily' },
      { v: '+1 day', l: 'ahead of plan' },
    ],
  },
  {
    n: '05',
    title: 'Zerpha Intelligence',
    sub: 'AI Vertical SaaS analysis · zerpha.ca',
    year: '2025 — present',
    role: 'Founder',
    tech: ['Node.js', 'Express', 'Supabase', 'React', 'Claude', 'Gemini'],
    blurb: 'AI platform with modular services for discovery, multi-page scraping, and structured insight extraction — reducing analyst research time from hours to under 3 minutes.',
    metrics: [
      { v: '< 3 min', l: 'research cycles' },
      { v: '4×', l: 'dev velocity' },
      { v: 'RAG', l: 'semantic M&A' },
    ],
  },
  {
    n: '06',
    title: 'Ulife AI Agency',
    sub: 'Automated AI Receptionist · ulife.ai',
    year: '2024 — 2025',
    role: 'Founder',
    tech: ['React', 'Node.js', 'OpenAI API', 'PostgreSQL'],
    blurb: 'Launched an AI receptionist for healthcare and service-industry clients — handles scheduling, intake queries, and client comms end-to-end.',
    metrics: [
      { v: '3', l: 'contracts closed' },
      { v: '30–50', l: 'qualified meetings' },
      { v: 'Healthcare', l: 'service vertical' },
    ],
  },
  {
    n: '07',
    title: 'Minisoft Payments',
    sub: 'AI-DLC Consulting',
    year: '2025',
    role: 'AI Architect / Coach',
    tech: ['AWS AI-DLC', 'Brownfield', 'Payments'],
    blurb: 'Coaching the Minisoft team (post-acquisition into Jonas/CSI) through AWS AI-DLC to build AI capabilities into their core payments feature.',
    metrics: [
      { v: '60%', l: 'time saved' },
      { v: 'AI-DLC', l: 'methodology' },
      { v: 'CSI', l: 'onboarding' },
    ],
  },
];

const SKILLS = [
  { group: 'AI / ML', items: ['Claude API', 'OpenAI / Azure OpenAI', 'Amazon Bedrock', 'RAG', 'pgvector', 'Agentic workflows', 'Prompt engineering', 'Spec-driven dev'] },
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'Java', 'C / C++', 'SQL', 'HTML / CSS'] },
  { group: 'Frameworks', items: ['Next.js', 'React', 'FastAPI', 'Express', 'Spring Boot', '.NET Core', 'LangChain', 'Tailwind'] },
  { group: 'Infra / Cloud', items: ['Azure Container Apps', 'AWS Bedrock', 'Docker', 'PostgreSQL', 'Supabase', 'GitHub Actions', 'Firebase', 'REST APIs'] },
];

// ────────────────────────────────────────────────────────────────
// PROJECT VISUALS — one designed mockup per project
// ────────────────────────────────────────────────────────────────

const VisualFrame = ({ children, label }) => (
  <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
    <div className="absolute inset-0 rounded-3xl overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 30% 20%, #1c3a8f 0%, #0a1a4a 40%, #050a1f 100%)',
        boxShadow: 'inset -8px -16px 40px rgba(3,6,15,0.6), inset 6px 10px 26px rgba(155,180,255,0.12), 0 20px 60px rgba(59,109,255,0.22)',
      }}>
      {/* faint grid */}
      <div className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'linear-gradient(rgba(155,180,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(155,180,255,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* glow highlight */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(155,180,255,0.35), transparent 65%)' }} />
      {/* content */}
      <div className="absolute inset-0 p-5 flex flex-col">{children}</div>
    </div>
    {label && (
      <div className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.2em] text-paper/55 bg-ink-950/60 backdrop-blur px-2 py-1 rounded">
        {label}
      </div>
    )}
  </div>
);

// 01 — AIQSR Dashboard
const VAIQSR = () => (
  <VisualFrame label="LIVE">
    <div className="flex items-center justify-between font-mono text-[8px] tracking-widest text-paper/60">
      <span>AIQSR / Q4</span>
      <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400" />SYNCED</span>
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="font-display text-5xl text-paper leading-none num-glow">957</span>
      <span className="font-mono text-[9px] text-cobalt-300 uppercase tracking-widest">initiatives</span>
    </div>
    <div className="mt-1 font-mono text-[8px] text-emerald-400">▲ +124 QoQ</div>

    <div className="mt-4 space-y-1.5 flex-1">
      {[
        ['Jonas Construction', 92],
        ['Computrition', 78],
        ['Minisoft Inc', 64],
        ['Aspire Software', 51],
        ['Volaris Group', 38],
      ].map(([name, pct], i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="font-mono text-[8px] text-paper/70 w-20 truncate">{name}</span>
          <div className="flex-1 h-1.5 rounded-full bg-ink-950/60 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3b6dff, #9bb4ff)' }} />
          </div>
          <span className="font-mono text-[8px] text-paper/55 w-6 text-right">{pct}</span>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-3 font-mono text-[8px] tracking-widest text-paper/45">
      <span>100+ COS</span>
      <span className="text-cobalt-400">◆</span>
      <span>5 VIEWS</span>
    </div>
  </VisualFrame>
);

// 02 — Wes Chatbot
const VWes = () => (
  <VisualFrame label="WES">
    <div className="font-mono text-[8px] tracking-widest text-paper/55">/ WAREHOUSE OPS</div>

    <div className="mt-4 self-end max-w-[78%] bg-cobalt-500 text-ink-950 rounded-2xl rounded-br-sm px-3 py-2 text-[10px] leading-snug">
      How many SKUs in zone B?
    </div>

    <div className="mt-3 max-w-[88%] bg-ink-950/50 border border-cobalt-500/25 rounded-2xl rounded-bl-sm px-3 py-2 text-[10px] text-paper/85 leading-snug">
      1,247 active SKUs in Zone B. 38 below reorder threshold. Want the list?
    </div>

    <div className="mt-3 inline-flex items-center gap-1.5 self-start font-mono text-[8px] text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 rounded-full px-2 py-1 w-fit">
      <span className="w-1 h-1 rounded-full bg-emerald-400" />
      2.3s · 95% acc
    </div>

    <div className="flex-1" />
    <div className="flex items-center gap-2 rounded-full bg-ink-950/60 border border-cobalt-500/20 px-3 py-1.5">
      <span className="font-mono text-[8px] text-paper/40">Ask Wes…</span>
      <span className="ml-auto text-cobalt-400 text-[10px]">▸</span>
    </div>
  </VisualFrame>
);

// 03 — M&A RAG
const VMA = () => (
  <VisualFrame label="RAG">
    <div className="flex items-center justify-between font-mono text-[8px] tracking-widest text-paper/55">
      <span>M&A / DOC #12</span>
      <span className="text-cobalt-300">GPT-4.1</span>
    </div>
    <div className="mt-3 space-y-1.5 flex-1">
      <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '90%' }} />
      <div className="flex gap-1 items-center">
        <div className="h-1.5 rounded-full bg-cobalt-400" style={{ width: '40%' }} />
        <span className="font-mono text-[7px] text-cobalt-300 bg-cobalt-500/20 px-1 rounded">¹</span>
        <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '30%' }} />
      </div>
      <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '70%' }} />
      <div className="flex gap-1 items-center">
        <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '25%' }} />
        <div className="h-1.5 rounded-full bg-cobalt-400" style={{ width: '45%' }} />
        <span className="font-mono text-[7px] text-cobalt-300 bg-cobalt-500/20 px-1 rounded">²</span>
      </div>
      <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '85%' }} />
      <div className="flex gap-1 items-center">
        <div className="h-1.5 rounded-full bg-cobalt-400" style={{ width: '55%' }} />
        <span className="font-mono text-[7px] text-cobalt-300 bg-cobalt-500/20 px-1 rounded">³</span>
        <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '20%' }} />
      </div>
      <div className="h-1.5 rounded-full bg-paper/15" style={{ width: '65%' }} />
    </div>

    <div className="mt-3 rounded-xl bg-ink-950/60 border border-cobalt-500/20 p-2.5">
      <div className="font-mono text-[8px] text-cobalt-300 mb-1">▸ AI RESPONSE</div>
      <div className="text-[9px] text-paper/85 leading-snug">
        Revenue grew 34% YoY <span className="text-cobalt-300 bg-cobalt-500/20 px-1 rounded">¹</span>,
        with EBITDA <span className="text-cobalt-300 bg-cobalt-500/20 px-1 rounded">²</span>…
      </div>
    </div>
  </VisualFrame>
);

// 04 — Computrition
const VComp = () => (
  <VisualFrame label="HIPAA">
    <div className="font-mono text-[8px] tracking-widest text-paper/55">/ HEALTHCARE AI</div>
    <div className="mt-1 font-display text-xl text-paper leading-tight">Architecture</div>

    <div className="mt-4 flex-1 space-y-2">
      {[
        { l: 'CHAT INTERFACE', s: 'React · Angular', c: '#9bb4ff' },
        { l: 'AI ORCHESTRATION', s: 'AWS AI-DLC', c: '#6e8dff' },
        { l: 'AMAZON BEDROCK', s: 'Claude / Llama', c: '#3b6dff' },
        { l: 'PATIENT DATA', s: 'HIPAA-aware', c: '#1d3dc4' },
      ].map((row, i) => (
        <div key={i} className="rounded-lg border px-2.5 py-1.5"
          style={{ borderColor: `${row.c}55`, background: `linear-gradient(90deg, ${row.c}22, transparent)` }}>
          <div className="font-mono text-[8px] tracking-widest" style={{ color: row.c }}>{row.l}</div>
          <div className="font-mono text-[8px] text-paper/55 mt-0.5">{row.s}</div>
        </div>
      ))}
    </div>

    <div className="mt-2 flex items-center gap-2">
      <div className="font-mono text-[8px] text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 rounded px-2 py-0.5 inline-flex items-center gap-1">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4z" /></svg>
        SHIELDED
      </div>
      <span className="font-mono text-[8px] text-paper/45">400+ leaders</span>
    </div>
  </VisualFrame>
);

// 05 — Zerpha
const VZerpha = () => (
  <VisualFrame label="SCRAPE">
    <div className="font-mono text-[8px] tracking-widest text-paper/55">/ ZERPHA.CA</div>
    <div className="relative flex-1 mt-3">
      {/* stacked pages */}
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute rounded-lg border border-cobalt-500/30 bg-ink-950/70 p-2"
          style={{ top: `${i * 12}px`, left: `${i * 14}px`, right: `${(2 - i) * 14 + 60}px`, height: '54px', zIndex: 3 - i }}>
          <div className="flex gap-1 mb-1.5">
            <span className="w-1 h-1 rounded-full bg-paper/30" />
            <span className="w-1 h-1 rounded-full bg-paper/30" />
            <span className="w-1 h-1 rounded-full bg-paper/30" />
          </div>
          <div className="space-y-1">
            <div className="h-1 rounded bg-paper/20" style={{ width: '70%' }} />
            <div className="h-1 rounded bg-paper/20" style={{ width: '50%' }} />
            <div className="h-1 rounded bg-cobalt-400/70" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
      {/* arrow */}
      <svg className="absolute right-[60px] top-[40px]" width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M0 10 L 32 10" stroke="#6e8dff" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M28 4 L 36 10 L 28 16" stroke="#6e8dff" strokeWidth="1.5" fill="none" />
      </svg>
      {/* extracted data */}
      <div className="absolute right-0 top-[20px] w-[56px] rounded-lg border border-cobalt-400/50 bg-cobalt-500/15 p-2">
        <div className="font-mono text-[7px] text-cobalt-300 mb-1">JSON</div>
        <div className="space-y-0.5">
          <div className="h-0.5 rounded bg-cobalt-400/60" style={{ width: '80%' }} />
          <div className="h-0.5 rounded bg-cobalt-400/60" style={{ width: '60%' }} />
          <div className="h-0.5 rounded bg-cobalt-400/60" style={{ width: '90%' }} />
          <div className="h-0.5 rounded bg-cobalt-400/60" style={{ width: '50%' }} />
          <div className="h-0.5 rounded bg-cobalt-400/60" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
    <div className="font-mono text-[8px] text-paper/45 tracking-widest">
      <span className="text-cobalt-300">◆</span> CLAUDE + GEMINI · 3 MIN
    </div>
  </VisualFrame>
);

// 06 — Ulife
const VUlife = () => {
  const days = ['M','T','W','T','F','S','S'];
  const booked = [1, 3, 4, 8, 9, 13, 15, 17, 20, 24, 26];
  return (
    <VisualFrame label="AI RX">
      <div className="flex items-center justify-between font-mono text-[8px] tracking-widest text-paper/55">
        <span>/ ULIFE.AI</span>
        <span className="text-cobalt-300">DEC 2025</span>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div key={i} className="text-center font-mono text-[7px] text-paper/40">{d}</div>
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className={`aspect-square rounded text-center flex items-center justify-center font-mono text-[7px] ${booked.includes(i) ? 'bg-cobalt-500/80 text-ink-950' : 'bg-ink-950/40 text-paper/35'}`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="flex-1" />
      <div className="rounded-lg bg-ink-950/60 border border-cobalt-500/20 px-2.5 py-1.5 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[8px] text-paper/85">3 appts booked today</span>
      </div>
    </VisualFrame>
  );
};

// 07 — Minisoft Payments
const VMini = () => (
  <VisualFrame label="PAY">
    <div className="font-mono text-[8px] tracking-widest text-paper/55">/ AI-DLC PAYMENTS</div>

    {/* Payment card */}
    <div className="mt-4 relative rounded-2xl p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #3b6dff 0%, #1d3dc4 60%, #0a1750 100%)', boxShadow: '0 12px 30px rgba(59,109,255,0.4)' }}>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-cobalt-300/30 blur-2xl" />
      <div className="flex justify-between items-start relative">
        <div className="font-mono text-[8px] tracking-widest text-paper/80">MINISOFT</div>
        <div className="w-6 h-4 rounded bg-gradient-to-br from-amber-200 to-amber-400" />
      </div>
      <div className="mt-4 font-mono text-[10px] tracking-[0.2em] text-paper relative">
        4242 ◆◆◆◆ ◆◆◆◆ AI24
      </div>
      <div className="mt-2 flex justify-between font-mono text-[7px] text-paper/70 relative">
        <span>AI-DLC EDITION</span>
        <span>11/27</span>
      </div>
    </div>

    <div className="flex-1" />

    <div className="grid grid-cols-3 gap-1">
      {['SCOPE', 'BUILD', 'SHIP'].map((s, i) => (
        <div key={s} className={`rounded text-center py-1 font-mono text-[7px] tracking-widest ${i < 3 ? 'bg-cobalt-500/30 text-cobalt-200' : 'bg-ink-950/40 text-paper/40'}`}>
          {s}
        </div>
      ))}
    </div>
    <div className="mt-1.5 font-mono text-[8px] text-emerald-300">▲ 60% TIME SAVED</div>
  </VisualFrame>
);

const ProjectVisual = ({ n }) => {
  const map = {
    '01': VAIQSR,
    '02': VWes,
    '03': VMA,
    '04': VComp,
    '05': VZerpha,
    '06': VUlife,
    '07': VMini,
  };
  const C = map[n] || VAIQSR;
  return <C />;
};

// ────────────────────────────────────────────────────────────────
// SHARED BITS
// ────────────────────────────────────────────────────────────────

const Eyebrow = ({ children, n }) => (
  <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-cobalt-400/80 uppercase">
    {n && <span className="text-cobalt-400">{n}</span>}
    <span className="h-px w-8 bg-cobalt-500/40" />
    <span>{children}</span>
  </div>
);

const SectionLabel = ({ n, title }) => (
  <div className="flex items-baseline justify-between gap-6 mb-16 reveal">
    <div className="flex items-center gap-5">
      <span className="font-mono text-xs text-cobalt-400/70">{n}</span>
      <h2 className="font-display text-5xl md:text-7xl tracking-tight">{title}</h2>
    </div>
    <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-cobalt-500/40 via-cobalt-500/10 to-transparent" />
  </div>
);

// ────────────────────────────────────────────────────────────────
// NAV
// ────────────────────────────────────────────────────────────────

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between backdrop-blur-md bg-ink-950/50 border-b border-cobalt-500/10">
    <a href="#top" className="flex items-center gap-3 font-mono text-xs tracking-widest">
      <span className="inline-block w-2 h-2 rounded-full bg-cobalt-500 shadow-[0_0_12px_#3b6dff]" />
      <span className="text-paper">JOSUE KENGE</span>
      <span className="text-cobalt-400/60">/ AI ENGINEER</span>
    </a>
    <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest text-paper/70">
      <a href="#work" className="hover:text-paper transition">WORK</a>
      <a href="#experience" className="hover:text-paper transition">EXPERIENCE</a>
      <a href="#skills" className="hover:text-paper transition">STACK</a>
      <a href="#contact" className="hover:text-paper transition">CONTACT</a>
    </div>
    <a href="mailto:josuekenge4@gmail.com" className="font-mono text-xs tracking-widest px-4 py-2 rounded-full border border-cobalt-500/40 hover:bg-cobalt-500 hover:text-ink-950 transition-all">
      LET'S TALK →
    </a>
  </nav>
);

// ────────────────────────────────────────────────────────────────
// HERO
// ────────────────────────────────────────────────────────────────

const Hero = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const opts = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' };
      setTime(d.toLocaleTimeString('en-US', opts) + ' EST');
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative min-h-screen hero-bg pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative max-w-[1480px] mx-auto px-8 grid lg:grid-cols-[1.05fr_1fr] gap-16 items-center">
        {/* Left: text */}
        <div className="relative z-10 max-w-[820px]">
          <div className="reveal">
            <Eyebrow n="◆">AI Engineer · Markham / Toronto</Eyebrow>
          </div>

          <h1 className="reveal reveal-delay-1 mt-8 font-display text-[clamp(64px,9vw,156px)] leading-[0.92] tracking-[-0.02em]">
            Building AI<br/>
            <span className="acc text-cobalt-400">products </span>
            that<br/>
            actually <span className="acc">ship.</span>
          </h1>

          <p className="reveal reveal-delay-2 mt-10 max-w-[620px] text-lg md:text-xl text-paper/70 leading-relaxed">
            I'm Josue — an AI Engineer shipping production GenAI systems for enterprise and healthcare clients.
            Agentic workflows, RAG pipelines, and full-stack platforms serving <span className="text-paper">25,000+ users</span>.
            From architecture to deployment.
          </p>

          <div className="reveal reveal-delay-3 mt-12 flex flex-wrap items-center gap-4">
            <a href="#work" className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-cobalt-500 text-ink-950 font-medium hover:bg-paper transition-all">
              View selected work
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a href="mailto:josuekenge4@gmail.com" className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-paper/15 hover:border-paper/40 transition">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-sm tracking-wider">AVAILABLE FOR WORK</span>
            </a>
          </div>

          <div className="reveal reveal-delay-4 mt-16 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs tracking-widest text-paper/45 uppercase">
            <div><span className="text-cobalt-400">▸</span> {time || 'Loading…'}</div>
            <div><span className="text-cobalt-400">▸</span> Carleton · Computer Science</div>
            <div><span className="text-cobalt-400">▸</span> Currently @ IBM watsonx</div>
          </div>
        </div>

        {/* Right: agent reasoning terminal */}
        <div className="relative flex items-center justify-center lg:justify-end w-full lg:w-auto">
          {window.AgentTerminal && <window.AgentTerminal />}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.35em] text-paper/40 flex flex-col items-center gap-2">
        <span>SCROLL</span>
        <span className="w-px h-10 bg-gradient-to-b from-paper/40 to-transparent" />
      </div>
    </section>
  );
};


// ────────────────────────────────────────────────────────────────
// MARQUEE
// ────────────────────────────────────────────────────────────────

const Marquee = () => {
  const items = [...STACK_TICKER, ...STACK_TICKER];
  return (
    <section className="border-y border-cobalt-500/10 py-8 overflow-hidden bg-ink-900/40">
      <div className="marquee gap-12 font-display text-4xl md:text-6xl tracking-tight whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-12 marquee-text">
            {t}
            <span className="text-cobalt-500 acc">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────
// METRICS STRIP
// ────────────────────────────────────────────────────────────────

const Metrics = () => (
  <section className="py-28 px-8 max-w-[1480px] mx-auto">
    <div className="reveal mb-12">
      <Eyebrow n="001">Impact at a glance</Eyebrow>
    </div>
    <div className="grid md:grid-cols-4 gap-8">
      {HEADLINE_METRICS.map((m, i) => (
        <div key={i} className={`reveal reveal-delay-${i+1} group`}>
          <div className="font-display text-7xl md:text-8xl text-cobalt-300 num-glow leading-none tracking-tight">
            {m.v}
          </div>
          <div className="mt-4 font-mono text-xs tracking-widest text-paper/55 uppercase">
            {m.l}
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// ABOUT
// ────────────────────────────────────────────────────────────────

const About = () => (
  <section id="about" className="relative py-32 px-8">
    <div className="max-w-[1480px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
      <div>
        <div className="reveal"><Eyebrow n="002">About</Eyebrow></div>
        <h2 className="reveal reveal-delay-1 mt-6 font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
          I ship GenAI<br/>
          <span className="acc text-cobalt-400">end-to-end</span> — from<br/>
          architecture to <span className="acc">production.</span>
        </h2>
        <div className="reveal reveal-delay-2 mt-10 space-y-6 text-lg text-paper/70 leading-relaxed max-w-[640px]">
          <p>
            I'm a Computer Science student at Carleton, currently engineering AI features
            on <span className="text-paper">IBM watsonx Workshop</span> for 25,000+ sellers globally. Before that I shipped 7 production AI systems
            at Jonas Software / CSI — chatbots, analytics platforms, and RAG pipelines that moved real numbers.
          </p>
          <p>
            I'm fluent across the stack and the AI layer. My favorite mode is brownfield integration —
            embedding net-new AI capabilities into existing production codebases without disrupting live operations,
            often at 2× the expected velocity.
          </p>
        </div>

        {/* Fun stuff terminal */}
        <div className="reveal reveal-delay-3 mt-12 max-w-[640px]">
          {window.Terminal && (
            <window.Terminal
              trace={window.FUN_TRACE}
              label="josue.fun · live"
              maxWidth="100%"
              minHeight="380px"
              fontSize="13px"
            />
          )}
        </div>
      </div>

      {/* Right: designed identity card + meta */}
      <div className="reveal reveal-delay-3 space-y-6">
        <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
          <div className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 30% 25%, #2a4ed3 0%, #0e1a52 45%, #050a1f 100%)',
              boxShadow: 'inset -10px -16px 50px rgba(3,6,15,0.6), inset 6px 12px 30px rgba(155,180,255,0.15), 0 24px 80px rgba(59,109,255,0.3)',
            }}>
            {/* grid */}
            <div className="absolute inset-0 opacity-25"
              style={{ backgroundImage: 'linear-gradient(rgba(155,180,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(155,180,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            {/* glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(155,180,255,0.4), transparent 65%)' }} />
            {/* avatar */}
            <img
              src="avatars/josue.png"
              alt="Josue Kenge avatar"
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[92%] object-contain"
              style={{
                filter: 'drop-shadow(0 24px 40px rgba(3,6,15,0.55))',
                WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)',
              }}
            />
            {/* top tag */}
            <div className="absolute top-5 left-5 right-5 flex justify-between font-mono text-[10px] tracking-[0.2em] text-paper/70">
              <span><span className="text-cobalt-300">◆</span> JOSUE KENGE</span>
              <span>'26</span>
            </div>
            {/* bottom tag */}
            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end font-mono text-[10px] tracking-[0.2em] text-paper/65">
              <div>
                <div className="text-cobalt-300">AI ENGINEER</div>
                <div className="text-paper/50 mt-1">MARKHAM · ON</div>
              </div>
              <div className="text-right">
                <div>EST.</div>
                <div className="text-paper/50">2024</div>
              </div>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 space-y-3">
          {[
            ['EDUCATION', 'Carleton University · B.Sc. Computer Science'],
            ['BASED IN', 'Markham, ON · open to remote'],
            ['LANGUAGES', 'English, French'],
            ['EMAIL', 'josuekenge4@gmail.com'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-mono text-[10px] tracking-widest text-cobalt-400/80">{k}</span>
              <span className="text-paper/85 text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// WORK / PROJECTS
// ────────────────────────────────────────────────────────────────

const ProjectCard = ({ p, onOpen }) => {
  return (
    <article
      className="reveal magnet glass rounded-3xl p-8 lg:p-10 grid lg:grid-cols-[1fr_280px] gap-8 items-center group cursor-pointer"
      data-comment-anchor={`project-${p.n}`}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
    >
      <div>
        <div className="flex items-center gap-4 font-mono text-[11px] tracking-widest text-cobalt-400/80">
          <span>PROJECT {p.n}</span>
          <span className="h-px w-6 bg-cobalt-500/30" />
          <span className="text-paper/50">{p.year}</span>
        </div>

        <h3 className="mt-4 font-display text-4xl md:text-5xl tracking-tight">
          {p.title} <span className="acc text-cobalt-400">— {p.sub}</span>
        </h3>

        <p className="mt-3 font-mono text-[11px] tracking-widest text-paper/45 uppercase">
          {p.role}
        </p>

        <p className="mt-5 text-paper/70 text-base lg:text-lg leading-relaxed max-w-[680px]">
          {p.blurb}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.tech.map(t => (
            <span key={t} className="px-3 py-1 rounded-full border border-cobalt-500/25 text-xs font-mono text-paper/75">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6 max-w-[480px]">
          {p.metrics.map((m, j) => (
            <div key={j}>
              <div className="font-display text-3xl text-cobalt-300 num-glow">{m.v}</div>
              <div className="mt-1 font-mono text-[10px] tracking-widest text-paper/45 uppercase">{m.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-cobalt-300/90 uppercase group-hover:text-cobalt-300 transition">
          <span>View case study</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>

      {/* Right: designed 3D-feel mockup */}
      <div className="relative">
        <ProjectVisual n={p.n} />
      </div>
    </article>
  );
};

const Work = ({ onOpenProject }) => (
  <section id="work" className="relative py-32 px-8 max-w-[1480px] mx-auto">
    <SectionLabel n="003" title="Selected work" />
    <div className="space-y-6">
      {PROJECTS.map((p) => <ProjectCard p={p} key={p.n} onOpen={() => onOpenProject(p)} />)}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// EXPERIENCE
// ────────────────────────────────────────────────────────────────

const Experience = () => (
  <section id="experience" className="relative py-32 px-8 max-w-[1480px] mx-auto">
    <SectionLabel n="004" title="Experience" />
    <div className="relative grid lg:grid-cols-[180px_1fr] gap-8">
      <div className="hidden lg:block absolute left-[226px] top-0 bottom-0 w-px conn" />

      {EXPERIENCE.map((e, i) => (
        <React.Fragment key={i}>
          <div className="reveal font-mono text-xs tracking-widest text-paper/55 pt-2">
            {e.when}
            <div className="text-paper/35 mt-1">{e.loc}</div>
          </div>
          <div className="reveal reveal-delay-1 relative pl-0 lg:pl-16 pb-16 border-b border-cobalt-500/10">
            <div className="hidden lg:block absolute left-[6px] top-4 w-4 h-4 rounded-full border-2 border-ink-950" style={{ background: e.color, boxShadow: `0 0 20px ${e.color}` }} />
            <div className="flex items-baseline gap-4 flex-wrap">
              <h3 className="font-display text-4xl md:text-5xl tracking-tight">{e.co}</h3>
              <span className="acc text-cobalt-400 text-2xl">— {e.role}</span>
            </div>
            <ul className="mt-6 space-y-3 max-w-[920px]">
              {e.bullets.map((b, j) => (
                <li key={j} className="flex gap-4 text-paper/75 text-base lg:text-lg leading-relaxed">
                  <span className="text-cobalt-400 flex-shrink-0 pt-2">◆</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </React.Fragment>
      ))}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// SKILLS
// ────────────────────────────────────────────────────────────────

const Skills = () => (
  <section id="skills" className="relative py-32 px-8 max-w-[1480px] mx-auto">
    <SectionLabel n="005" title="Stack" />
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {SKILLS.map((s, i) => (
        <div key={i} className={`reveal reveal-delay-${i+1} glass rounded-3xl p-7`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-cobalt-400 text-xs">0{i+1}</span>
            <h3 className="font-display text-2xl tracking-tight">{s.group}</h3>
          </div>
          <ul className="space-y-2">
            {s.items.map(item => (
              <li key={item} className="flex items-center gap-3 text-paper/80 text-sm">
                <span className="w-1 h-1 rounded-full bg-cobalt-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// EDUCATION
// ────────────────────────────────────────────────────────────────

const Education = () => (
  <section className="relative py-24 px-8 max-w-[1480px] mx-auto">
    <div className="reveal glass rounded-3xl p-10 lg:p-14 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
      <div>
        <Eyebrow n="006">Education</Eyebrow>
        <h3 className="mt-6 font-display text-5xl md:text-6xl tracking-tight">
          Carleton University
        </h3>
        <p className="mt-3 acc text-cobalt-400 text-3xl">
          B.Sc. Computer Science
        </p>
        <p className="mt-4 font-mono text-xs tracking-widest text-paper/55 uppercase">
          Ottawa, ON · Expected May 2027
        </p>
      </div>
      <div className="font-display text-7xl md:text-8xl text-cobalt-300 num-glow tracking-tight leading-none">
        '27
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// CONTACT
// ────────────────────────────────────────────────────────────────

const Contact = () => (
  <section id="contact" className="relative py-28 px-8 overflow-hidden">
    <div className="absolute inset-0 hero-bg opacity-80" />
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40">
      <div className="orb w-full h-full" />
    </div>

    <div className="relative max-w-[1480px] mx-auto text-center">
      <div className="reveal">
        <Eyebrow n="007">Contact</Eyebrow>
      </div>
      <h2 className="reveal reveal-delay-1 mt-8 font-display text-[clamp(56px,8vw,140px)] leading-[0.92] tracking-tight">
        Let's build<br/>
        something <span className="acc text-cobalt-400">that ships.</span>
      </h2>

      <div className="reveal reveal-delay-2 mt-12">
        <a href="mailto:josuekenge4@gmail.com" className="group inline-flex items-center gap-3 px-8 py-5 rounded-full bg-cobalt-500 text-ink-950 font-medium hover:bg-paper transition-all text-lg">
          josuekenge4@gmail.com
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>

      {/* Compact social text links */}
      <div className="reveal reveal-delay-3 mt-10 flex flex-wrap justify-center items-center gap-x-5 gap-y-3 font-mono text-[11px] tracking-[0.2em] uppercase">
        <a href="https://www.linkedin.com/in/josuekenge/" target="_blank" rel="noopener"
           className="text-paper/60 hover:text-paper transition">
          LinkedIn / @josuekenge
        </a>
        <span className="text-cobalt-400" aria-hidden="true">◆</span>
        <a href="https://github.com/josuekenge" target="_blank" rel="noopener"
           className="text-paper/60 hover:text-paper transition">
          GitHub / @josuekenge
        </a>
        <span className="text-cobalt-400" aria-hidden="true">◆</span>
        <a href="https://x.com/kengejosue" target="_blank" rel="noopener"
           className="text-paper/60 hover:text-paper transition">
          X / @kengejosue
        </a>
      </div>

      <div className="reveal reveal-delay-4 mt-10 font-mono text-xs tracking-widest text-paper/45 uppercase">
        <span className="text-cobalt-400">◆</span> 613.415.6829 · Markham, ON · Open to remote
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="border-t border-cobalt-500/10 py-12 px-8">
    <div className="max-w-[1480px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="font-mono text-xs tracking-widest text-paper/40 uppercase">
        © 2026 Josue Kenge · Designed & built end-to-end
      </div>

      <div className="flex items-center gap-4">
        {[
          { icon: 'assets/social/linkedin.png', label: 'LinkedIn', href: 'https://www.linkedin.com/in/josuekenge/' },
          { icon: 'assets/social/x.png', label: 'X / Twitter', href: 'https://x.com/kengejosue' },
          { icon: 'assets/social/whatsapp.png', label: 'WhatsApp', href: 'https://wa.me/16134156829' },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener"
             aria-label={s.label} title={s.label}
             className="group relative w-12 h-12 flex items-center justify-center rounded-2xl transition-transform duration-300 hover:-translate-y-1 hover:-rotate-6">
            <img src={s.icon} alt={s.label}
                 className="w-full h-full object-contain"
                 style={{ filter: 'drop-shadow(0 8px 16px rgba(3,6,15,0.5))' }} />
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-paper/40 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Available for AI engineering roles
      </div>
    </div>
  </footer>
);

// ────────────────────────────────────────────────────────────────
// TWEAKS PANEL
// ────────────────────────────────────────────────────────────────

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3b6dff",
  "headline": "Building AI products that actually ship.",
  "showCursor": true
}/*EDITMODE-END*/;

const Tweaks = () => {
  if (!window.useTweaks) return null;
  const [t, setTweak] = window.useTweaks(DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    const blob = document.getElementById('cursorBlob');
    if (blob) blob.style.display = t.showCursor ? '' : 'none';
  }, [t]);

  const TP = window.TweaksPanel;
  const TS = window.TweakSection;
  const TC = window.TweakColor;
  const TT = window.TweakToggle;
  if (!TP) return null;

  return (
    <TP>
      <TS title="Theme">
        <TC label="Accent" value={t.accent} onChange={v => setTweak('accent', v)}
           options={['#3b6dff', '#5b8bff', '#7c5cff', '#00d4ff']} />
      </TS>
      <TS title="Interactions">
        <TT label="Cursor glow" value={t.showCursor} onChange={v => setTweak('showCursor', v)} />
      </TS>
    </TP>
  );
};

// ────────────────────────────────────────────────────────────────
// APP
// ────────────────────────────────────────────────────────────────

const App = () => {
  const [openProject, setOpenProject] = React.useState(null);
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Metrics />
      <About />
      <Work onOpenProject={setOpenProject} />
      <Experience />
      <Skills />
      <Education />
      <Contact />
      <Footer />
      <Tweaks />
      {window.CaseStudyModal && (
        <window.CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
