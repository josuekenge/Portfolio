// case-studies.jsx
// Full case study modal + per-project architecture diagrams.
// Click any project card → renders <CaseStudyModal projectId={n} />

// ────────────────────────────────────────────────────────────────
// DIAGRAM PRIMITIVES
// ────────────────────────────────────────────────────────────────

const DNode = ({ tier, name, sub, accent = '#3b6dff', wide }) => (
  <div
    className="rounded-2xl px-5 py-4 text-center relative"
    style={{
      background: 'linear-gradient(160deg, rgba(28,58,143,0.4), rgba(10,26,74,0.6) 70%, rgba(5,10,31,0.85))',
      border: `1px solid ${accent}55`,
      boxShadow: `0 12px 30px rgba(3,6,15,0.4), inset 0 1px 0 rgba(155,180,255,0.08)`,
      minWidth: wide ? '260px' : '180px',
    }}
  >
    <div className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: accent }}>
      {tier}
    </div>
    <div className="font-display text-xl text-paper leading-tight">{name}</div>
    {sub && (
      <div className="font-mono text-[10px] text-paper/55 mt-1.5 tracking-wide">{sub}</div>
    )}
  </div>
);

const DArrow = ({ dir = 'down', label }) => {
  if (dir === 'down') {
    return (
      <div className="flex flex-col items-center" style={{ height: '36px' }}>
        <div className="w-px flex-1" style={{ background: 'linear-gradient(to bottom, transparent, rgba(110,141,255,0.5), rgba(110,141,255,0.8))' }} />
        <div className="text-cobalt-400 text-sm leading-none">▼</div>
        {label && <div className="absolute font-mono text-[9px] text-paper/55 ml-12 mt-2">{label}</div>}
      </div>
    );
  }
  if (dir === 'split') {
    return (
      <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none" style={{ display: 'block' }}>
        <line x1="100" y1="0" x2="100" y2="14" stroke="rgba(110,141,255,0.6)" strokeWidth="1" />
        <line x1="40" y1="14" x2="160" y2="14" stroke="rgba(110,141,255,0.6)" strokeWidth="1" />
        <line x1="40" y1="14" x2="40" y2="34" stroke="rgba(110,141,255,0.6)" strokeWidth="1" />
        <line x1="160" y1="14" x2="160" y2="34" stroke="rgba(110,141,255,0.6)" strokeWidth="1" />
        <polygon points="36,30 44,30 40,38" fill="#6e8dff" />
        <polygon points="156,30 164,30 160,38" fill="#6e8dff" />
      </svg>
    );
  }
  if (dir === 'right') {
    return (
      <div className="flex items-center px-2">
        <div className="h-px w-12" style={{ background: 'linear-gradient(to right, rgba(110,141,255,0.4), rgba(110,141,255,0.8))' }} />
        <div className="text-cobalt-400 text-sm leading-none ml-1">▶</div>
      </div>
    );
  }
};

const DRow = ({ children }) => (
  <div className="flex items-stretch justify-center gap-6 flex-wrap">{children}</div>
);

const DFrame = ({ children, label }) => (
  <div className="relative rounded-3xl p-8 lg:p-10"
    style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,109,255,0.08), transparent 60%), rgba(6,8,15,0.6)',
      border: '1px solid rgba(96,165,250,0.15)',
    }}
  >
    <div className="font-mono text-[10px] tracking-[0.2em] text-cobalt-400/80 uppercase mb-6">
      ◆ {label || 'Architecture'}
    </div>
    {children}
  </div>
);

// ────────────────────────────────────────────────────────────────
// DIAGRAMS — one per project
// ────────────────────────────────────────────────────────────────

const DiagramAIQSR = () => (
  <DFrame label="Monolithic · Greenfield">
    <DRow>
      <DNode tier="USERS" name="120+ Orgs" sub="120 approved domains" accent="#9bb4ff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="FRONTEND" name="React + TypeScript" sub="Next.js 14 · Chart.js · 5 dashboards" wide accent="#6e8dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="API" name="Node.js + Express" sub="Caching · Request dedup (-80% calls)" wide accent="#3b6dff" />
    </DRow>
    <DArrow dir="split" />
    <DRow>
      <DNode tier="DATABASE" name="Supabase (PostgreSQL)" sub="RLS · 44 migrations · 957 initiatives" accent="#1d3dc4" wide />
      <DNode tier="AI LAYER" name="Azure OpenAI" sub="GPT-4 · context-grounded chat" accent="#7c5cff" wide />
    </DRow>
    <div className="mt-8 rounded-xl border border-cobalt-500/15 p-3 text-center"
      style={{ background: 'rgba(6,8,15,0.5)' }}>
      <div className="font-mono text-[10px] tracking-[0.2em] text-cobalt-300 uppercase mb-2">▸ INFRA</div>
      <div className="font-mono text-[12px] text-paper/75">
        Docker · Azure Container Apps · Azure Container Registry · GitHub Actions CI/CD
      </div>
    </div>
  </DFrame>
);

const DiagramWes = () => (
  <DFrame label="Brownfield · < 2 weeks · Text-to-SQL">
    <DRow>
      <DNode tier="USER" name="Warehouse Staff" sub="RBAC: operator / supervisor / admin" wide accent="#9bb4ff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="EXISTING APP" name="Angular Frontend" sub="Wes chatbot module · embedded" wide accent="#6e8dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier=".NET BACKEND" name="C# API + Chatbot Service" sub="Brownfield integration · no disruption" wide accent="#3b6dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="TEXT → SQL" name="NL Query Translator" sub="LLM-grounded · validates against schema" wide accent="#7c5cff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="DATABASE" name="Warehouse SQL DB" sub="1.2s avg query · 95% accuracy" wide accent="#1d3dc4" />
    </DRow>
    <div className="mt-8 grid grid-cols-3 gap-3 text-center">
      <div className="rounded-xl border border-emerald-400/30 p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
        <div className="font-display text-2xl text-emerald-300">20×</div>
        <div className="font-mono text-[9px] tracking-widest text-paper/55 uppercase mt-1">faster queries</div>
      </div>
      <div className="rounded-xl border border-emerald-400/30 p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
        <div className="font-display text-2xl text-emerald-300">95%</div>
        <div className="font-mono text-[9px] tracking-widest text-paper/55 uppercase mt-1">accuracy</div>
      </div>
      <div className="rounded-xl border border-emerald-400/30 p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
        <div className="font-display text-2xl text-emerald-300">2 wks</div>
        <div className="font-mono text-[9px] tracking-widest text-paper/55 uppercase mt-1">vs 4 planned</div>
      </div>
    </div>
  </DFrame>
);

const DiagramMA = () => (
  <DFrame label="RAG · Server Actions">
    <DRow>
      <DNode tier="ANALYST" name="Finance Team" sub="Brent · Zack · Maria" wide accent="#9bb4ff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="FRONTEND" name="Next.js 15 + React" sub="Two-panel UX · TypeScript" wide accent="#6e8dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="SERVER ACTIONS" name="Next.js Server Functions" sub="No exposed API · type-safe RPC" wide accent="#3b6dff" />
    </DRow>
    <DArrow dir="split" />
    <DRow>
      <DNode tier="VECTOR STORE" name="Supabase + pgvector" sub="text-embedding-3-large · prod docs" accent="#1d3dc4" wide />
      <DNode tier="LLM" name="Azure OpenAI GPT-4.1" sub="LangChain · grounded responses" accent="#7c5cff" wide />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="RESPONSE" name="Cited Answer" sub="Clickable ¹ ² ³ → source passage" wide accent="#10b981" />
    </DRow>
  </DFrame>
);

const DiagramComp = () => (
  <DFrame label="Consulting · AI-DLC Methodology">
    <DRow>
      <DNode tier="ARCHITECT" name="AI Architecture + Roadmap" sub="Designed end-to-end · handed off" wide accent="#9bb4ff" />
    </DRow>
    <DArrow label="daily standups" />
    <DRow>
      <DNode tier="METHODOLOGY" name="AWS AI-DLC Framework" sub="Mob elaboration · semantic context · adaptive rituals" wide accent="#7c5cff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="TEAM" name="Computrition Dev Team" sub="10+ engineers · brownfield healthcare app" wide accent="#3b6dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="OUTCOME" name="Production Chatbot · Shipped" sub="< 2 weeks · 1 day ahead of plan" wide accent="#10b981" />
    </DRow>
    <div className="mt-8 rounded-xl border border-cobalt-500/15 p-4 text-center"
      style={{ background: 'rgba(6,8,15,0.5)' }}>
      <div className="font-mono text-[11px] tracking-[0.2em] text-emerald-300 uppercase mb-1">
        ▸ ONGOING IMPACT
      </div>
      <div className="text-paper/85 text-sm">
        10+ person team now uses AI coding in their daily workflow via AI-DLC
      </div>
    </div>
  </DFrame>
);

const DiagramZerpha = () => (
  <DFrame label="Personal · RAG-powered M&A tracker">
    <DRow>
      <DNode tier="ANALYST" name="M&A Researcher" sub="Initial-stage deal discovery" wide accent="#9bb4ff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="FRONTEND" name="React (Netlify)" sub="Static site · zerpha.ca" wide accent="#6e8dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="BACKEND" name="Node.js (Railway)" sub="Multi-page scraper · structured extraction" wide accent="#3b6dff" />
    </DRow>
    <DArrow dir="split" />
    <DRow>
      <DNode tier="RAG PIPELINE" name="Claude + Gemini" sub="Semantic M&A queries · JSON correction" wide accent="#7c5cff" />
      <DNode tier="DATABASE" name="Supabase + MDE" sub="Model-driven entity tracking" wide accent="#1d3dc4" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="OUTPUT" name="Deal Intel · < 3 min" sub="Hours → minutes · 4× dev velocity" wide accent="#10b981" />
    </DRow>
  </DFrame>
);

const DiagramUlife = () => (
  <DFrame label="AI Receptionist · Voice + Sales">
    <DRow>
      <DNode tier="CALLER" name="Patient / Client" sub="Inbound voice call" wide accent="#9bb4ff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="VOICE LAYER" name="Vapi" sub="Real-time speech-to-speech AI agent" wide accent="#7c5cff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="BACKEND" name="Node.js API" sub="Intent routing · sales scripts · qualifier" wide accent="#3b6dff" />
    </DRow>
    <DArrow dir="split" />
    <DRow>
      <DNode tier="LLM" name="OpenAI API" sub="Conversational + intent classification" wide accent="#6e8dff" />
      <DNode tier="DATABASE" name="PostgreSQL" sub="Appointments · intake · client log" wide accent="#1d3dc4" />
    </DRow>
    <div className="mt-8 grid grid-cols-3 gap-3 text-center">
      <div className="rounded-xl border border-emerald-400/30 p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
        <div className="font-display text-2xl text-emerald-300">3</div>
        <div className="font-mono text-[9px] tracking-widest text-paper/55 uppercase mt-1">contracts closed</div>
      </div>
      <div className="rounded-xl border border-emerald-400/30 p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
        <div className="font-display text-2xl text-emerald-300">30–50</div>
        <div className="font-mono text-[9px] tracking-widest text-paper/55 uppercase mt-1">qualified meetings</div>
      </div>
      <div className="rounded-xl border border-emerald-400/30 p-3" style={{ background: 'rgba(16,185,129,0.05)' }}>
        <div className="font-display text-2xl text-emerald-300">24/7</div>
        <div className="font-mono text-[9px] tracking-widest text-paper/55 uppercase mt-1">always on</div>
      </div>
    </div>
  </DFrame>
);

const DiagramMini = () => (
  <DFrame label="Consulting · Tech Implementation Coaching">
    <DRow>
      <DNode tier="ROLE" name="AI Architect / Coach" sub="Post-acquisition onboarding into CSI" wide accent="#9bb4ff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="FRAMEWORK" name="AWS AI-DLC" sub="Translated to payments domain" wide accent="#7c5cff" />
    </DRow>
    <DArrow dir="split" />
    <DRow>
      <DNode tier="TOOLING" name="AI Coding Tools" sub="Cursor · Claude Code · spec-driven" wide accent="#3b6dff" />
      <DNode tier="TEAM" name="Minisoft Engineers" sub="Brownfield payments integration" wide accent="#6e8dff" />
    </DRow>
    <DArrow />
    <DRow>
      <DNode tier="OUTCOME" name="60% time savings" sub="Team now ships AI-assisted features" wide accent="#10b981" />
    </DRow>
  </DFrame>
);

const DIAGRAMS = {
  '01': DiagramAIQSR,
  '02': DiagramWes,
  '03': DiagramMA,
  '04': DiagramComp,
  '05': DiagramZerpha,
  '06': DiagramUlife,
  '07': DiagramMini,
};

// ────────────────────────────────────────────────────────────────
// CASE STUDIES DATA
// ────────────────────────────────────────────────────────────────

const CASE_STUDIES = {
  '01': {
    summary: 'Greenfield monolithic platform tracking AI initiatives across the entire Constellation Software portfolio. Shipped from zero to production in a single dev cycle.',
    stack: [
      ['Frontend', 'React · TypeScript · Next.js 14 · Chart.js'],
      ['Backend', 'Node.js · Express'],
      ['Database', 'Supabase (PostgreSQL) · Row-Level Security · 44 migrations'],
      ['AI Layer', 'Azure OpenAI · GPT-4 · context-grounded chat'],
      ['Infra', 'Docker · Azure Container Apps · Azure Container Registry · GitHub Actions CI/CD'],
    ],
    approach: [
      'Designed monolithic architecture (intentionally) — fast iteration, single dev cycle, zero infra overhead during rapid feature delivery.',
      'CI/CD: GitHub Actions builds 3 Docker images, pushes to ACR, deploys on every merge to main.',
      'Managed 44 PostgreSQL migrations across the project lifecycle with zero downtime.',
      'Implemented Supabase RLS for domain-restricted access — 120+ approved org domains, admin / editor / viewer roles.',
      'Diagnosed PKCE auth bug where code_verifier cookies failed across browser tabs → migrated to Supabase token_hash verification.',
      'Discovered PostgreSQL NULL != NULL bug in triggers silently blocking admin removal for invited users.',
      'Added client-side caching + request deduplication → 80% reduction in redundant API calls.',
    ],
    outcomes: [
      { v: '957', l: 'AI initiatives tracked' },
      { v: '100+', l: 'operating companies' },
      { v: '120+', l: 'approved org domains' },
      { v: '44', l: 'database migrations · 0 downtime' },
      { v: '80%', l: 'fewer API calls (caching + dedup)' },
      { v: '< 1s', l: 'page transitions (from 2+ s)' },
    ],
  },
  '02': {
    summary: 'Brownfield AI chatbot embedded into an existing .NET warehouse management system. Translated natural-language queries into SQL against the live ops database.',
    stack: [
      ['Frontend', 'Angular · embedded chatbot module'],
      ['Backend', 'C# · .NET Framework · brownfield integration'],
      ['AI Pattern', 'Text-to-SQL · schema-validated · LLM-grounded'],
      ['Auth', 'RBAC across warehouse user roles'],
      ['Methodology', 'AWS AI-DLC'],
    ],
    approach: [
      'Embedded a net-new AI chatbot into a production .NET codebase without disrupting live warehouse operations.',
      'Built a text-to-SQL translator: natural-language query → validated SQL against the warehouse schema → safe execution.',
      'Implemented RBAC governing chatbot access across operator / supervisor / admin roles.',
      'Delivered the full feature in 2 weeks against a 4-week plan — 2× velocity.',
      'Applied AWS AI-DLC throughout: mob elaboration, semantic context building, adaptive rituals.',
    ],
    outcomes: [
      { v: '20×', l: 'faster queries (1 min → 2.3 s)' },
      { v: '95%', l: 'accuracy on warehouse queries' },
      { v: '$150K', l: 'savings unlocked in 2 weeks' },
      { v: '2 wks', l: 'delivery (vs 4-week plan)' },
      { v: '0', l: 'production disruption' },
    ],
  },
  '03': {
    summary: 'RAG-based due diligence platform for the Jonas Finance team. Grounded document Q&A with clickable in-line citations so analysts could verify every AI claim instantly.',
    stack: [
      ['Frontend', 'Next.js 15 · React · TypeScript · Tailwind · shadcn/ui'],
      ['Server', 'Next.js Server Actions (no exposed API surface)'],
      ['Vector', 'Supabase + pgvector · text-embedding-3-large'],
      ['LLM', 'Azure OpenAI GPT-4.1 · LangChain'],
      ['Dev Loop', 'Supabase MCP server · Claude Code'],
    ],
    approach: [
      'Used Next.js Server Actions instead of REST endpoints — type-safe RPC, no exposed API surface, simpler auth.',
      'RAG pipeline: text-embedding-3-large into pgvector on Supabase for semantic doc search.',
      'Two-panel UX: document navigation on the left, AI response on the right. UX directive from finance stakeholders.',
      'Clickable in-line citations link every claim back to its source passage — analysts verify in one click.',
      'Deliberately no auto-generated summaries on doc load. AI only responds to explicit queries — analysts stay in control.',
      'Iterated weekly with Brent, Zack, and Maria from finance leadership.',
      'Used Supabase MCP server + Claude Code for accelerated delivery.',
    ],
    outcomes: [
      { v: '$120K', l: 'yearly savings' },
      { v: 'RAG', l: 'on production M&A docs' },
      { v: '¹ ² ³', l: 'clickable inline citations' },
      { v: '3', l: 'finance stakeholders bought in' },
    ],
    quote: {
      text: 'Impressed Brent, Zack, and Maria from finance leadership — built iteratively with weekly direct stakeholder input.',
      attr: 'Stakeholder feedback',
    },
  },
  '04': {
    summary: 'Consulting + coaching engagement. Designed the end-to-end AI chatbot architecture for Computrition\'s healthcare platform and coached the team through implementation via AWS AI-DLC.',
    stack: [
      ['Role', 'AI Architect / Consultant / Coach'],
      ['Methodology', 'AWS AI-Driven Development Lifecycle (AI-DLC)'],
      ['Format', 'Daily standups + working sessions · ~2 weeks'],
      ['Domain', 'Healthcare software · brownfield integration'],
    ],
    approach: [
      'Designed the full chatbot architecture and provided implementation guidance throughout the project lifecycle.',
      'Defined technical roadmap, best practices, and step-by-step integration approach.',
      'Facilitated daily standups + working sessions to keep the team aligned and unblocked.',
      'Coached AI-DLC rituals: mob elaboration, semantic context building, adaptive workflow.',
      'Ensured every line of AI-generated code was understood by the team — quality alongside velocity.',
    ],
    outcomes: [
      { v: '< 2 wks', l: 'team shipped to production' },
      { v: '+1 day', l: 'ahead of target deadline' },
      { v: '10+', l: 'team now using AI coding daily' },
      { v: 'AI-DLC', l: 'adopted as ongoing practice' },
    ],
    quote: {
      text: '10+ person team is now using AI coding in their work every day via AI-DLC — the methodology stuck.',
      attr: 'Ongoing outcome',
    },
  },
  '05': {
    summary: 'Personal project. RAG-powered intelligence platform for tracking M&A deals at the initial-stage — compressing analyst research from hours to under three minutes.',
    stack: [
      ['Frontend', 'React (Netlify) · static site at zerpha.ca'],
      ['Backend', 'Node.js · Express · Railway (deep dive into infra)'],
      ['Scraping', 'Modular multi-page scrapers · structured extraction'],
      ['AI', 'Claude · Gemini · semantic M&A queries · JSON correction logic'],
      ['Data', 'Supabase · MDE (model-driven entity tracking)'],
    ],
    approach: [
      'Architected modular services for discovery, multi-page scraping, and structured insight extraction.',
      'Deployed split-stack: Netlify for static frontend, Railway for backend services — chose intentionally to learn the infra layer.',
      'Built RAG pipeline grounding LLM responses in scraped deal documents.',
      'Used model-driven entity tracking (MDE) to maintain a canonical deal-stage representation across noisy sources.',
      'Service-oriented backend architecture enabled 4× faster development velocity vs initial monolith attempt.',
    ],
    outcomes: [
      { v: '< 3 min', l: 'research cycle (from hours)' },
      { v: '4×', l: 'dev velocity (vs early monolith)' },
      { v: 'RAG', l: 'semantic M&A queries' },
      { v: 'MDE', l: 'deal-stage tracking' },
    ],
  },
  '06': {
    summary: 'AI voice receptionist for healthcare and service-industry clients. Handles inbound calls end-to-end — appointment scheduling, intake, sales qualification.',
    stack: [
      ['Frontend', 'React · client dashboard'],
      ['Voice Layer', 'Vapi · real-time speech-to-speech AI agent'],
      ['Backend', 'Node.js API · intent routing · sales scripts'],
      ['LLM', 'OpenAI API · conversational + intent classification'],
      ['Database', 'PostgreSQL · appointments · intake · client log'],
    ],
    approach: [
      'Used Vapi as the real-time voice layer — handles speech-to-text, agent turn-taking, and TTS without rolling our own.',
      'Built intent routing and sales-qualification logic in Node.js — the agent does more than just book, it qualifies.',
      'Integrated with PostgreSQL for appointment booking and client intake — the agent writes directly to the schedule.',
      'Sold the platform via direct outreach + product demos in healthcare and service verticals.',
    ],
    outcomes: [
      { v: '3', l: 'paid contracts closed' },
      { v: '30–50', l: 'qualified meetings generated' },
      { v: '24/7', l: 'lead capture · no human staffing' },
      { v: 'Healthcare', l: 'primary vertical · PMF signal' },
    ],
  },
  '07': {
    summary: 'AI consulting + coaching engagement. Helping Minisoft (post-acquisition into Jonas/CSI) implement AI capabilities in their payments product via AWS AI-DLC.',
    stack: [
      ['Role', 'AI Architect / Consultant / Coach'],
      ['Framework', 'AWS AI-DLC · translated to payments domain'],
      ['Tooling', 'Cursor · Claude Code · spec-driven dev'],
      ['Pattern', 'Brownfield integration into existing payments feature'],
    ],
    approach: [
      'Acting as primary AI architect, translating AWS AI-DLC into Minisoft\'s payments product context.',
      'Hands-on guidance on AI coding tooling — Cursor, Claude Code, spec-driven workflows.',
      'Educating the team on AI-DLC rituals: mob elaboration, semantic context building, adaptive sprints.',
      'Same proven model that worked at Computrition — daily collaboration, architecture ownership, team enablement.',
      'Coaching the team from AI-assisted to AI-native development practices.',
    ],
    outcomes: [
      { v: '60%', l: 'time savings on delivery' },
      { v: 'CSI', l: 'AI standards onboarding' },
      { v: 'Brownfield', l: 'payments feature integration' },
      { v: 'Live', l: 'consulting · ongoing' },
    ],
  },
};

// ────────────────────────────────────────────────────────────────
// MODAL
// ────────────────────────────────────────────────────────────────

const CaseStudyModal = ({ project, onClose }) => {
  React.useEffect(() => {
    if (!project) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;
  const cs = CASE_STUDIES[project.n];
  const Diagram = DIAGRAMS[project.n];
  if (!cs) return null;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{ background: 'rgba(3,6,15,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="min-h-screen flex items-start justify-center py-12 px-4 md:px-8">
        <div className="relative w-full max-w-[1200px] rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12,18,38,0.95), rgba(7,11,26,0.95))',
            border: '1px solid rgba(110,141,255,0.2)',
            boxShadow: '0 40px 120px rgba(3,6,15,0.7)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-ink-950/80 border border-cobalt-500/30 text-paper/70 hover:text-paper hover:border-cobalt-500 transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="p-8 md:p-12 border-b" style={{ borderColor: 'rgba(110,141,255,0.12)' }}>
            <div className="flex items-center gap-4 font-mono text-[11px] tracking-widest text-cobalt-400/80 uppercase">
              <span>CASE STUDY · {project.n}</span>
              <span className="h-px w-6 bg-cobalt-500/30" />
              <span className="text-paper/50">{project.year}</span>
            </div>
            <h2 className="mt-5 font-display text-5xl md:text-7xl tracking-tight leading-[0.95]">
              {project.title} <span className="acc text-cobalt-400">— {project.sub}</span>
            </h2>
            <div className="mt-4 font-mono text-xs tracking-widest text-paper/55 uppercase">
              {project.role}
            </div>
            <p className="mt-8 max-w-[820px] text-paper/80 text-lg leading-relaxed">
              {cs.summary}
            </p>
          </div>

          {/* Diagram */}
          <div className="p-8 md:p-12">
            {Diagram && <Diagram />}
          </div>

          {/* Stack + Approach */}
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 px-8 md:px-12 pb-12">
            {/* Stack */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-cobalt-400/80 uppercase mb-5">
                ◆ Stack
              </div>
              <div className="space-y-4">
                {cs.stack.map(([k, v]) => (
                  <div key={k}>
                    <div className="font-mono text-[10px] tracking-widest text-cobalt-300 uppercase mb-1">{k}</div>
                    <div className="text-paper/80 text-sm leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approach */}
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-cobalt-400/80 uppercase mb-5">
                ◆ Approach
              </div>
              <ul className="space-y-3">
                {cs.approach.map((a, i) => (
                  <li key={i} className="flex gap-3 text-paper/85 text-[15px] leading-relaxed">
                    <span className="text-cobalt-400 flex-shrink-0 pt-1.5">◆</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Outcomes */}
          <div className="px-8 md:px-12 pb-12">
            <div className="font-mono text-[10px] tracking-[0.2em] text-cobalt-400/80 uppercase mb-5">
              ◆ Outcomes
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cs.outcomes.map((o, i) => (
                <div key={i} className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(6,8,15,0.6)',
                    border: '1px solid rgba(110,141,255,0.15)',
                  }}>
                  <div className="font-display text-3xl text-cobalt-300 num-glow leading-none">{o.v}</div>
                  <div className="mt-2 font-mono text-[10px] tracking-widest text-paper/55 uppercase leading-snug">
                    {o.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          {cs.quote && (
            <div className="px-8 md:px-12 pb-12">
              <div className="rounded-3xl p-8 md:p-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,109,255,0.1), rgba(110,141,255,0.04))',
                  border: '1px solid rgba(110,141,255,0.25)',
                }}>
                <div className="font-display text-2xl md:text-3xl text-paper/95 leading-snug">
                  <span className="acc text-cobalt-400 text-4xl mr-2">"</span>
                  {cs.quote.text}
                </div>
                <div className="mt-5 font-mono text-[10px] tracking-widest text-cobalt-300/80 uppercase">
                  — {cs.quote.attr}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 md:px-12 py-8 border-t flex items-center justify-between"
            style={{ borderColor: 'rgba(110,141,255,0.12)' }}>
            <div className="font-mono text-[10px] tracking-widest text-paper/45 uppercase">
              ◆ {project.title} · {project.year}
            </div>
            <button
              onClick={onClose}
              className="font-mono text-[11px] tracking-widest uppercase text-paper/70 hover:text-paper transition"
            >
              ← back to portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CASE_STUDIES, DIAGRAMS, CaseStudyModal });
