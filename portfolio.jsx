// Josue Kenge — Portfolio
// Warm editorial redesign (inspired by ulife.ai). One file, top-to-bottom by section.
// Reveal animations driven by IntersectionObserver in index.html.

const { useEffect, useRef, useState } = React;

// ────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────

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

// What I do — "The Blueprint"-style capability grid.
const CAPABILITIES = [
  {
    n: '01',
    title: 'Brownfield Integration',
    body: 'Embedding net-new AI capability into live production codebases — .NET, Angular, legacy stacks — without disrupting operations, often at 2× the expected velocity.',
    icon: 'layers',
  },
  {
    n: '02',
    title: 'Agentic & RAG Systems',
    body: 'Grounded document Q&A with clickable citations, text-to-SQL agents, and multi-model pipelines on Azure OpenAI, Bedrock, pgvector, and LangChain.',
    icon: 'brain',
  },
  {
    n: '03',
    title: 'Full-stack Delivery',
    body: 'Architecture to deployment — Next.js / FastAPI / Express front-to-back, Dockerized on Azure Container Apps with automated CI/CD, shipped in a single dev cycle.',
    icon: 'code',
  },
];

const EXPERIENCE = [
  {
    co: 'IBM',
    role: 'AI Engineer Intern, watsonx Workshop',
    loc: 'Markham, ON',
    when: 'May 2026 — Present',
    context: 'watsonx Workshop is IBM\'s internal AI platform that helps 25,000+ sellers research accounts, build demos, and rehearse pitches. I build the AI agents and full-stack features they use every day.',
    bullets: [
      'Engineering AI features across a FastAPI / Python backend and a React frontend, shipping into the daily workflow of IBM\'s global sales force.',
      'Built the Demo Creator agent end-to-end: an LLM tool that turns a 2-question, product-led intake (replacing a 6-question form) into tailored demo recommendations, auto-deriving sales stage, audience, and industry from the seller\'s linked opportunity so they only answer what can\'t be inferred.',
      'Architected its multi-source search — concurrent, permission-scoped Seismic (per-user OAuth) plus IBM TechZone and Navattic interactive demos over MCP — keeping scenario and product separate so each source is queried the way it ranks best, then fusing results through several tuned LLM passes into a deduped, availability-gated top-3 with matched L100–L300 build scripts.',
      'Gave IBM\'s Slack bot long-term memory: a recall system that scores up to a dozen of a seller\'s prior threads (30-day window) with an LLM judge and, on a confident match, carries the earlier session\'s context into the new conversation.',
      'Shipped AI podcast & presentation generation from any session (script → ElevenLabs audio / branded PPTX), with a Slack notification bell that DMs the owner a deep link the moment content is ready and auto-delivers the file back into the thread where they asked.',
    ],
  },
  {
    co: 'Jonas Software',
    role: 'AI Engineer Intern',
    loc: 'Remote',
    when: 'Jan 2026 — Apr 2026',
    context: 'Jonas Software is part of Constellation Software (CSI), a portfolio of 100+ vertical-market software companies. I was the AI engineer embedding GenAI into their live products and coaching acquired teams to build with it.',
    bullets: [
      'Shipped Wes, a production AI chatbot embedded into an existing .NET warehouse system — translating natural-language questions into validated SQL, cutting query response from 1 min → 2.3s (20× faster) at 95% accuracy and unlocking $150K in 2 weeks.',
      'Engineered AIQSR, an enterprise analytics platform on Azure Container Apps with fully automated CI/CD, tracking 957 AI initiatives across 100+ operating companies while cutting redundant API calls 80% via caching and request dedup.',
      'Architected a HIPAA-aware AI healthcare chatbot for Computrition on Amazon Bedrock, driving $33K in savings and daily adoption across 400+ senior leaders.',
      'Delivered a full-stack RAG M&A due-diligence platform for the Jonas finance team — grounded document Q&A with clickable citations back to the source — generating $120K in yearly savings.',
      'Led brownfield AWS AI-DLC engagements (Minisoft, Computrition), coaching teams toward AI-native workflows — 60% time savings, with a production frontend component shipped in 72 hours.',
    ],
  },
  {
    co: 'Microsoft',
    role: 'Software Engineering & PM Intern',
    loc: 'Redmond, WA',
    when: 'Jun 2024 — Aug 2024',
    context: 'On the Office 365 substrate search team in Redmond — the C# / Azure microservices behind enterprise search across Microsoft 365. A hybrid SWE/PM role: I scoped the work, set the targets, and shipped to Microsoft\'s core productivity stack.',
    bullets: [
      'Prototyped a semantic-indexing approach in C# on Azure that lifted search accuracy 25% on a 1M+ entry corpus under production-scale query load — validating a concrete relevance improvement for Office 365 substrate search.',
      'Re-worked a microservices workflow to run multithreaded, cutting request latency 40% and saving ~$14,500/week in Azure compute through concurrency tuning, request batching, and caching.',
      'Shipped maintainable, scalable C# microservices into the Office 365 search infrastructure, meeting the reliability and code-review bar required of a service on Microsoft\'s core productivity stack.',
      'Operated across engineering and product — scoping the prototype, defining its accuracy and latency targets, and presenting results back to the team to steer next steps.',
    ],
  },
];

const PROJECTS = [
  {
    n: '01',
    title: 'AIQSR Dashboard',
    sub: 'AI Initiative Quarterly Scorecard',
    tag: 'ENTERPRISE ANALYTICS',
    link: 'https://www.csisoftware.com',
    year: '2025',
    role: 'Full-stack lead · Jonas Software',
    tech: ['Next.js 14', 'Express', 'Supabase', 'Azure OpenAI', 'Docker'],
    blurb: 'Enterprise analytics platform tracking AI initiatives across 100+ operating companies at Jonas / CSI. Shipped zero to production in a single dev cycle with automated CI/CD.',
    metric: { v: '957', l: 'AI initiatives tracked' },
    metrics: [
      { v: '957', l: 'AI initiatives' },
      { v: '100+', l: 'companies' },
      { v: '80%', l: 'fewer API calls' },
    ],
    grad: 'linear-gradient(150deg, #1d2a6b 0%, #14205a 45%, #0b1440 100%)',
  },
  {
    n: '02',
    title: 'Wes Chatbot',
    sub: 'AI for warehouse ops',
    tag: 'BROWNFIELD · TEXT-TO-SQL',
    link: 'https://www.csisoftware.com',
    year: '2025',
    role: 'AI Engineer · Jonas Software',
    tech: ['.NET', 'Angular', 'AWS AI-DLC', 'RBAC'],
    blurb: 'Production AI chatbot embedded into existing warehouse software via a brownfield approach. Cut query response from 1 minute to 2.3 seconds at 95% accuracy.',
    metric: { v: '20×', l: 'faster queries' },
    metrics: [
      { v: '20×', l: 'faster queries' },
      { v: '2 wks', l: 'delivery (vs 4)' },
      { v: '$150K', l: 'savings unlocked' },
    ],
    grad: 'linear-gradient(150deg, #23221f 0%, #171613 55%, #0c0b09 100%)',
  },
  {
    n: '03',
    title: 'M&A Due Diligence',
    sub: 'AI-powered acquisition intel',
    tag: 'RAG · CITATIONS',
    link: 'https://www.csisoftware.com',
    year: '2025',
    role: 'AI Engineer · Jonas Finance',
    tech: ['Next.js 15', 'pgvector', 'GPT-4.1', 'LangChain'],
    blurb: 'Full-stack RAG platform for the Jonas finance team — grounded document querying with clickable in-line citations linking every AI response to its source passage.',
    metric: { v: '$120K', l: 'yearly savings' },
    metrics: [
      { v: 'RAG', l: 'on prod docs' },
      { v: 'GPT-4.1', l: '+ pgvector' },
      { v: '$120K', l: 'yearly savings' },
    ],
    grad: 'linear-gradient(150deg, #0f5148 0%, #0b3f39 50%, #072a26 100%)',
  },
  {
    n: '04',
    title: 'Computrition Chatbot',
    sub: 'Healthcare AI · architect',
    tag: 'HEALTHCARE · HIPAA-AWARE',
    link: 'https://www.csisoftware.com',
    year: '2025',
    role: 'AI Consultant · Jonas Subsidiary',
    tech: ['Amazon Bedrock', 'AWS AI-DLC', 'Brownfield'],
    blurb: 'Designed the end-to-end AI chatbot architecture for a healthcare platform and coached the Computrition team through implementation, guided by AWS AI-DLC.',
    metric: { v: '400+', l: 'leaders adopted' },
    metrics: [
      { v: '< 2 wks', l: 'delivery' },
      { v: '10+', l: 'team on AI daily' },
      { v: '+1 day', l: 'ahead of plan' },
    ],
    grad: 'linear-gradient(150deg, #5a2b8f 0%, #431f72 50%, #2c1450 100%)',
  },
  {
    n: '05',
    title: 'Zerpha Intelligence',
    sub: 'AI vertical SaaS analysis',
    tag: 'FOUNDER · zerpha.ca',
    link: 'https://zerpha.ca',
    year: '2025 — present',
    role: 'Founder',
    tech: ['Node.js', 'Supabase', 'React', 'Claude', 'Gemini'],
    blurb: 'AI platform with modular services for discovery, multi-page scraping, and structured insight extraction — cutting analyst research from hours to under 3 minutes.',
    metric: { v: '< 3 min', l: 'research cycles' },
    metrics: [
      { v: '< 3 min', l: 'research cycles' },
      { v: '4×', l: 'dev velocity' },
      { v: 'RAG', l: 'semantic M&A' },
    ],
    grad: 'linear-gradient(150deg, #9a3b12 0%, #7c2f10 50%, #4d1d0a 100%)',
  },
  {
    n: '06',
    title: 'Ulife AI Agency',
    sub: 'Automated AI receptionist',
    tag: 'FOUNDER · ulife.ai',
    link: 'https://ulife.ai',
    year: '2024 — 2025',
    role: 'Founder',
    tech: ['React', 'Node.js', 'OpenAI', 'Vapi', 'PostgreSQL'],
    blurb: 'Launched an AI voice receptionist for healthcare and service clients — handling scheduling, intake, and qualification end-to-end. Closed 3 paid contracts.',
    metric: { v: '3', l: 'contracts closed' },
    metrics: [
      { v: '3', l: 'contracts closed' },
      { v: '30–50', l: 'qualified meetings' },
      { v: '24/7', l: 'always on' },
    ],
    grad: 'linear-gradient(150deg, #1e46b0 0%, #163a92 50%, #0d245e 100%)',
  },
  {
    n: '07',
    title: 'Minisoft Payments',
    sub: 'AI-DLC consulting',
    tag: 'CONSULTING · AI-DLC',
    link: 'https://www.csisoftware.com',
    year: '2025',
    role: 'AI Architect / Coach',
    tech: ['AWS AI-DLC', 'Brownfield', 'Payments'],
    blurb: 'Coaching the Minisoft team (post-acquisition into Jonas / CSI) through AWS AI-DLC to build AI capability into their core payments feature.',
    metric: { v: '60%', l: 'time saved' },
    metrics: [
      { v: '60%', l: 'time saved' },
      { v: 'AI-DLC', l: 'methodology' },
      { v: 'CSI', l: 'onboarding' },
    ],
    grad: 'linear-gradient(150deg, #1f5136 0%, #163f2a 50%, #0c2a1c 100%)',
  },
];

const SKILLS = [
  { group: 'AI / ML', items: ['Claude API', 'OpenAI / Azure OpenAI', 'Amazon Bedrock', 'RAG', 'pgvector', 'Agentic workflows', 'Prompt engineering', 'Spec-driven dev'] },
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'Java', 'C / C++', 'SQL', 'HTML / CSS'] },
  { group: 'Frameworks', items: ['Next.js', 'React', 'FastAPI', 'Express', 'Spring Boot', '.NET Core', 'LangChain', 'Tailwind'] },
  { group: 'Infra / Cloud', items: ['Azure Container Apps', 'AWS Bedrock', 'Docker', 'PostgreSQL', 'Supabase', 'GitHub Actions', 'Firebase', 'REST APIs'] },
];

// ── MobiSoins — flagship app spotlight (real product details). ──
const MOBI_NAVY = '#253E7D';
const MOBI_GREEN = '#45B39D';

const MOBISOINS = {
  status: 'In development · Montreal',
  title: 'MobiSoins',
  tagline: 'On-demand home nursing — Uber, but for licensed nurses.',
  blurb: 'A two-sided marketplace connecting patients who need clinical care with licensed (OIIQ) nurses who deliver it at home — see nurses on a live map, book, pay, and track in real time. Architected and built end-to-end: a role-aware Expo / React Native client, a NestJS + TypeORM API over PostgreSQL as the system of record, and Firebase RTDB as the realtime layer — self-hosted on AWS (EC2, Cognito, S3 / SES / SNS) and glued to Stripe, Twilio, and Mapbox.',
  roles: [
    {
      label: 'For patients',
      items: [
        'Live map of available nurses nearby',
        'Book a service, pay in-app before the visit',
        'Real-time tracking to your door + arrival alert',
        'In-app chat, visit history, ratings & receipts',
      ],
    },
    {
      label: 'For nurses',
      items: [
        'Go online to appear on the patient map',
        'Job requests with service, distance & payout',
        '30-second accept, then one-tap navigation',
        'Visit reports + weekly earnings dashboard',
      ],
    },
  ],
  highlights: [
    { t: 'Uber-style dispatch', d: 'Online nurses are ranked by a Haversine SQL query and offered each job for an exclusive 18s, rolling through 3 rounds. A single atomic conditional UPDATE — guarded by a partial unique index — makes concurrent accepts race-safe: exactly one winner, everyone else a clean 409.' },
    { t: 'Real-time tracking', d: 'Nurse GPS publishes to Firebase RTDB every few seconds; the client tweens the pin on a requestAnimationFrame loop so it glides instead of teleporting, fires a 200 m arrival alert, and speaks Mapbox turn-by-turn cues.' },
    { t: 'Escrow payments', d: 'Stripe manual-capture PaymentIntents pre-authorize on booking and capture only after the visit report — itemized GST 5% + QST 9.975% + platform fee, a $25 partial-capture cancellation, signed idempotent webhooks, and weekly Stripe Connect payouts.' },
    { t: 'Built for Québec', d: 'Law 25 by design: a PHI audit interceptor, soft deletes, 30-day deletion grace with purge fan-out (Cognito · S3 · Stripe), ca-central-1 residency, plus helmet + tiered rate-limiting on the API.' },
  ],
  note: 'Plus an in-app support assistant powered by Claude Haiku 4.5 with a hard medical-advice guardrail (emergencies → 911 / Info-Santé 811).',
  techApp: ['Expo', 'React Native', 'TypeScript', 'Zustand', 'Mapbox', 'Stripe', 'Firebase'],
  techApi: ['NestJS', 'TypeORM', 'PostgreSQL', 'AWS EC2', 'AWS Cognito', 'S3 · SES · SNS', 'Twilio', 'Claude'],
  metrics: [
    { v: '1 app', l: 'two roles, role-aware' },
    { v: '< 3 min', l: 'open → nurse confirmed' },
    { v: '~111', l: 'REST endpoints · 18 modules' },
    { v: 'iOS · Android', l: 'Expo · EAS → TestFlight' },
  ],
};

// ────────────────────────────────────────────────────────────────
// PRIMITIVES
// ────────────────────────────────────────────────────────────────

// Pixel-square brand mark
const PixelMark = ({ size = 26, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="8" height="8" fill={color} />
    <rect x="12" y="3" width="5" height="5" fill={color} opacity="0.55" />
    <rect x="4" y="12" width="11" height="11" fill={color} opacity="0.28" />
  </svg>
);

// Little scattered pixel-square decorations
const PixelDeco = ({ className, style }) => (
  <div className={`pixel ${className || ''}`} style={style} aria-hidden="true">
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <rect x="0" y="0" width="12" height="12" fill="#1B1A16" opacity="0.9" />
      <rect x="20" y="6" width="7" height="7" fill="#1B1A16" opacity="0.35" />
      <rect x="8" y="20" width="16" height="16" fill="#B4B0A3" opacity="0.55" />
    </svg>
  </div>
);

const Eyebrow = ({ children }) => (
  <span className="eyebrow"><span className="sq" />{children}</span>
);

const StatusPill = () => (
  <span className="inline-flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full border border-lined bg-surface text-[11px] tracking-widest font-medium text-ink-700 uppercase">
    <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />
    Active
  </span>
);

// Simple line icons for capability / skill cards
const Icon = ({ name, size = 20 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    layers: <><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="M3 13l9 5 9-5" /><path d="M3 18l9 5 9-5" /></>,
    brain: <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V16a3 3 0 0 0 4 2.8" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V16a3 3 0 0 1-4 2.8" /><path d="M12 4v15" /></>,
    code: <><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13 5-2 14" /></>,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
    stack: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    cloud: <><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.98A6 6 0 0 0 6.34 9 4 4 0 0 0 7 17h10.5Z" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    star: <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9L12 3Z" />,
    chat: <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10Z" />,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  };
  return <svg {...common}>{paths[name] || paths.code}</svg>;
};

// ────────────────────────────────────────────────────────────────
// NAV
// ────────────────────────────────────────────────────────────────

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['Experience', '#experience'],
    ['MobiSoins', '#mobisoins'],
    ['Work', '#work'],
    ['Stack', '#skills'],
    ['About', '#about'],
  ];
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 py-4 md:py-5 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 min-w-0">
          <PixelMark size={26} color="#1B1A16" />
          <span className="font-display text-lg sm:text-xl tracking-tight text-ink truncate">Josue Kenge</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-[15px] text-ink-500">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-ink transition-colors">{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><StatusPill /></div>
          <a href="mailto:josuekenge4@gmail.com" className="pill pill-solid text-sm py-2.5 px-4 md:hidden">Email</a>
        </div>
      </div>
    </nav>
  );
};

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
    <section id="top" className="relative min-h-screen-d overflow-hidden pt-32 sm:pt-40 pb-20">
      <div className="absolute inset-0 grid-lines opacity-70" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(244,241,233,0) 40%, #F4F1E9 92%)' }} />

      {/* Scattered pixel glyphs — randomized across the gutters, clear of text + terminal */}
      <PixelDeco style={{ top: '9%', left: '4%', transform: 'scale(.55) rotate(-8deg)' }} />
      <PixelDeco style={{ top: '38%', left: '1.5%', transform: 'scale(.4) rotate(12deg)', opacity: .6 }} />
      <PixelDeco style={{ bottom: '10%', left: '6.5%', transform: 'scale(.5) rotate(-15deg)', opacity: .85 }} />
      <PixelDeco style={{ top: '18%', right: '3%', transform: 'scale(.34) rotate(9deg)', opacity: .5 }} />
      <PixelDeco style={{ bottom: '22%', right: '5.5%', transform: 'scale(.46) rotate(-6deg)', opacity: .7 }} />

      <div className="relative max-w-[1360px] mx-auto px-5 sm:px-8 grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-14 items-center">
        {/* Left — copy */}
        <div className="min-w-0">
          <div className="reveal">
            <Eyebrow>AI Engineer · Markham / Toronto</Eyebrow>
          </div>

          <h1 className="hero-headline reveal reveal-delay-1 mt-7 font-display font-normal text-ink text-[clamp(46px,6vw,96px)] leading-[0.94] tracking-[-0.02em]">
            <span className="whitespace-nowrap">Production AI,</span>
            <br />
            <span className="italic-accent text-ink-500">actually shipped.</span>
          </h1>

          <p className="reveal reveal-delay-2 mt-8 max-w-[540px] text-lg sm:text-xl text-ink-500 leading-relaxed font-light">
            I'm Josue — an AI Engineer building GenAI systems for enterprise and healthcare.
            Agentic workflows, RAG pipelines, and full-stack platforms serving
            <span className="text-ink font-normal"> 25,000+ users</span>. From architecture to deployment.
          </p>

          <div className="reveal reveal-delay-3 mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a href="#work" className="pill pill-solid justify-center">
              View selected work <span className="arw">→</span>
            </a>
            <a href="mailto:josuekenge4@gmail.com" className="pill pill-ghost justify-center">
              Get in touch <span className="arw">→</span>
            </a>
          </div>

          <div className="reveal reveal-delay-4 mt-12 sm:mt-16 flex flex-wrap gap-x-10 gap-y-3 text-[13px] tracking-wide text-ink-400">
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ink-300" />{time || '— : —'}</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ink-300" />Carleton · Computer Science</div>
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-ink-300" />Currently @ IBM watsonx</div>
          </div>

          {/* Multi-agent pipeline — a signal sweeps left→right, each stage lights as it passes */}
          <div className="reveal reveal-delay-4 mt-10 sm:mt-12 max-w-[460px]" aria-hidden="true">
            <div className="eyebrow mb-6"><span className="sq" />multi-agent pipeline</div>
            <div className="agentflow-row">
              <div className="agentflow-line" />
              {['Plan', 'Retrieve', 'Reason', 'Ship'].map((label, i) => (
                <div key={label} className="agentflow-node">
                  <span className="agentflow-dot" style={{ animationDelay: `${i * 0.9}s` }} />
                  <span className="agentflow-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — agent terminal (dark, matches brand) */}
        <div className="reveal reveal-delay-2 hidden lg:block w-full">
          {window.AgentTerminal && <window.AgentTerminal />}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────
// TICKER
// ────────────────────────────────────────────────────────────────

const Ticker = () => {
  const items = [...STACK_TICKER, ...STACK_TICKER];
  const hairline = 'linear-gradient(90deg, transparent, rgba(27,26,22,0.07) 22%, rgba(27,26,22,0.07) 78%, transparent)';
  const fade = 'linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent)';
  return (
    <section className="relative overflow-hidden py-7">
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{ background: hairline }} />
      <div className="marquee items-center" style={{ maskImage: fade, WebkitMaskImage: fade }}>
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-9 text-[11px] tracking-[0.28em] text-ink-400 font-medium whitespace-nowrap mr-9">
            {t}
            <span className="w-[3px] h-[3px] rotate-45 bg-ink-300/70" />
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 inset-x-0 h-px pointer-events-none" style={{ background: hairline }} />
    </section>
  );
};

// ────────────────────────────────────────────────────────────────
// METRICS
// ────────────────────────────────────────────────────────────────

const Metrics = () => (
  <section className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
    <div className="reveal mb-12"><Eyebrow>Impact at a glance</Eyebrow></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-line">
      {HEADLINE_METRICS.map((m, i) => (
        <div key={i} className={`reveal reveal-delay-${i + 1} py-8 sm:py-10 pr-6 border-b border-line ${i % 2 === 0 ? 'sm:border-r' : ''} lg:border-r ${i === 3 ? 'lg:border-r-0' : ''}`}>
          <div className="font-display font-normal text-5xl sm:text-6xl lg:text-7xl text-ink leading-none tracking-tight">{m.v}</div>
          <div className="mt-4 text-[13px] tracking-wide text-ink-500">{m.l}</div>
        </div>
      ))}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// CAPABILITIES — "The Blueprint"
// ────────────────────────────────────────────────────────────────

const Capabilities = () => (
  <section className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
    <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-12">
      <div className="reveal">
        <Eyebrow>How I work</Eyebrow>
        <h2 className="section-title mt-5 font-display font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02]">
          The Blueprint
        </h2>
        <p className="mt-5 max-w-[560px] text-ink-500 text-lg font-light leading-relaxed">
          I bring the AI layer to companies — solving their hardest problems through
          strategic architecture and hands-on engineering.
        </p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
      {CAPABILITIES.map((c, i) => (
        <div key={c.n} className="reveal group relative p-7 sm:p-9 border-b border-r border-line bg-surface/40 hover:bg-surface transition-colors" style={{ transitionDelay: `${i * 60}ms` }}>
          <span className="absolute top-6 right-7 text-[12px] tracking-widest text-ink-300">{c.n}</span>
          <span className="icon-sq"><Icon name={c.icon} /></span>
          <h3 className="mt-8 font-display font-normal text-2xl sm:text-[26px] tracking-tight text-ink">{c.title}</h3>
          <p className="mt-4 text-ink-500 leading-relaxed font-light text-[15px]">{c.body}</p>
        </div>
      ))}
      {/* Quote cell */}
      <div className="reveal p-7 sm:p-9 border-b border-r border-line bg-[#EEEAE0] flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-ink-300" />
          <span className="italic-accent text-ink-700 text-lg sm:text-xl leading-snug">"Brownfield AI, without the disruption."</span>
        </div>
        <a href="#work" className="group mt-6 inline-flex items-center gap-2 text-[13px] tracking-widest uppercase text-ink-500 hover:text-ink transition-colors">
          See it in production <span className="arw">→</span>
        </a>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// WORK — gradient project tiles
// ────────────────────────────────────────────────────────────────

const ProjectCard = ({ p, onOpen }) => (
  <article className="reveal group cursor-pointer" onClick={onOpen} role="button" tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } }}
    data-comment-anchor={`project-${p.n}`}>
    {/* Gradient tile */}
    <div className="proj-tile" style={{ background: p.grad }}>
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <span className="text-[11px] tracking-[0.2em] text-white/55 font-medium">{p.tag}</span>
        <span className="text-[11px] tracking-widest text-white/45">{p.n}</span>
      </div>
      <div className="relative text-center px-6">
        <div className="mx-auto mb-4 w-11 h-11 rounded-xl bg-white/12 border border-white/15 flex items-center justify-center text-white">
          <Icon name={['stack','cpu','brain','layers','code','cloud','stack'][(+p.n - 1) % 7]} size={22} />
        </div>
        <h3 className="font-display font-normal text-white text-[28px] sm:text-3xl leading-tight tracking-tight">{p.title}</h3>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <div>
          <div className="font-display text-2xl text-white leading-none">{p.metric.v}</div>
          <div className="text-[10px] tracking-widest uppercase text-white/55 mt-1">{p.metric.l}</div>
        </div>
        <span className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-ink transition-all">→</span>
      </div>
    </div>

    {/* Body under tile */}
    <div className="mt-5 px-1">
      <div className="text-[11px] tracking-widest uppercase text-ink-400">{p.role} · {p.year}</div>
      <p className="mt-2.5 text-ink-500 font-light leading-relaxed text-[15px]">{p.blurb}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.tech.map(t => (
          <span key={t} className="px-2.5 py-1 rounded-full border border-line text-[11px] text-ink-500">{t}</span>
        ))}
      </div>
      <div className="mt-5 inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-ink-700 group-hover:text-ink transition-colors">
        View case study <span className="arw">→</span>
      </div>
    </div>
  </article>
);

const Work = ({ onOpenProject }) => (
  <section id="work" className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
    <div className="reveal flex items-end justify-between gap-6 mb-12">
      <div>
        <Eyebrow>Selected work</Eyebrow>
        <h2 className="section-title mt-5 font-display font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight">Projects</h2>
      </div>
      <span className="hidden sm:block text-[13px] text-ink-400">{PROJECTS.length} shipped systems</span>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
      {PROJECTS.map(p => <ProjectCard key={p.n} p={p} onOpen={() => onOpenProject(p)} />)}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// MOBISOINS — mobile app spotlight
// ────────────────────────────────────────────────────────────────

// Real MobiSoins wordmark (navy text + green heartbeat) from the app.
const MobiWordmark = () => (
  <img src="assets/mobisoins-logo.png" alt="MobiSoins" style={{ width: 150, height: 'auto' }} />
);

// Clean mock of the MobiSoins welcome / role-select screen (English).
const PhoneMock = () => {
  const roleCards = [
    { icon: 'user', title: 'I need care', sub: 'Book a nurse to your home', tint: MOBI_GREEN },
    { icon: 'map', title: 'I provide care', sub: 'Go online & accept visits', tint: MOBI_NAVY },
  ];
  return (
    <div className="relative mx-auto" style={{ width: 'min(292px, 80vw)' }}>
      <div className="relative rounded-[2.7rem] p-2" style={{ background: '#111318', boxShadow: '0 40px 90px rgba(27,26,22,0.26)' }}>
        <div className="relative rounded-[2.3rem] overflow-hidden" style={{ background: '#FDFDFC', aspectRatio: '9/19.3' }}>
          {/* notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-2xl bg-[#111318] z-10" />
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3.5 text-[10px] font-medium" style={{ color: '#9aa1ac' }}>
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <svg width="15" height="10" viewBox="0 0 15 10" fill="none"><path d="M7.5 8.5a1 1 0 100-.01M4.7 6a4 4 0 015.6 0M2 3.4a8 8 0 0111 0" stroke="#c3c7cd" strokeWidth="1.1" strokeLinecap="round"/></svg>
              <span className="inline-block w-4 h-2 rounded-[2px] border border-[#c3c7cd]"><span className="block h-full w-2.5 rounded-[1px] bg-[#c3c7cd]" /></span>
            </span>
          </div>
          {/* content */}
          <div className="px-6 pt-12">
            <div className="flex justify-center"><MobiWordmark /></div>
            <div className="mt-10 text-center font-display text-[26px] leading-none" style={{ color: '#2a2c30' }}>Welcome</div>
            <div className="mt-2 text-center text-[11px] text-[#9aa1ac]">How can we help you today?</div>

            <div className="mt-7 space-y-3">
              {roleCards.map((r) => (
                <div key={r.title} className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3.5" style={{ border: '1px solid #eef0f2', boxShadow: '0 6px 16px rgba(37,62,125,0.05)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.tint}14`, color: r.tint }}>
                    <Icon name={r.icon} size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium" style={{ color: '#2a2c30' }}>{r.title}</div>
                    <div className="text-[10.5px] text-[#9aa1ac] leading-snug mt-0.5">{r.sub}</div>
                  </div>
                  <span className="text-[#c3c7cd] text-sm flex-shrink-0">›</span>
                </div>
              ))}
            </div>
            <div className="mt-7 text-center text-[9.5px] text-[#b3b7bd]">You can switch roles anytime.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Architecture modal — a glimpse of how MobiSoins fits together ──
const ANode = ({ tier, name, sub }) => (
  <div className="rounded-2xl bg-surface border border-line px-4 py-3 text-center" style={{ boxShadow: '0 8px 22px rgba(27,26,22,0.05)' }}>
    <div className="text-[9.5px] tracking-[0.2em] uppercase text-ink-400 mb-1">{tier}</div>
    <div className="font-display text-[17px] text-ink leading-tight">{name}</div>
    {sub && <div className="text-[10.5px] text-ink-400 mt-1 font-light leading-snug">{sub}</div>}
  </div>
);
const ADown = ({ label }) => (
  <div className="flex flex-col items-center py-1.5">
    {label && <span className="text-[9.5px] tracking-widest uppercase text-ink-400 mb-1">{label}</span>}
    <span className="text-ink-300 text-xs leading-none">▼</span>
  </div>
);

const ARCH_CARDS = [
  { icon: 'map', t: 'Live map & discovery', d: 'Nearby nurses come from a Haversine geo-query; each pin’s live GPS rides Firebase and is interpolated client-side so it glides instead of jumping.' },
  { icon: 'bolt', t: 'Booking & accept', d: 'A booking pre-authorizes payment, then the API offers it to the closest nurse for 18s across 3 rounds. The first atomic accept wins — everyone else gets a clean 409.' },
  { icon: 'cpu', t: 'Real-time speed', d: 'Offers land in ~hundreds of ms over Firebase, with push + polling as fallbacks. A patient goes from open → nurse confirmed in under 3 minutes.' },
  { icon: 'star', t: 'Reviews & ratings', d: 'A delayed prompt after each completed visit collects a rating; nurse profiles aggregate reviews that feed back into discovery.' },
  { icon: 'chat', t: 'Firebase SDK', d: 'The realtime backbone — RTDB streams GPS, job offers, and in-app chat keyed by bookingId; FCM handles push. App uses the JS SDK, backend the Admin SDK.' },
  { icon: 'lock', t: 'Auth & OTP', d: 'Google, Apple & Facebook sign-in flow through Firebase/Cognito; email OTP goes through AWS (Cognito + SES), phone OTP through Twilio. The backend verifies tokens (JWKS + Apple verifier) and issues role-scoped JWTs.' },
  { icon: 'card', t: 'Escrow payments', d: 'Stripe manual-capture holds funds until the visit report is filed; signed, idempotent webhooks reconcile state and nurses are paid weekly via Connect.' },
  { icon: 'database', t: 'Data & compliance', d: 'PostgreSQL via TypeORM — 15 entities, 18 migrations — with Law 25 audit logging, soft deletes, and ca-central-1 residency.' },
];

const MobiArchModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto" style={{ background: 'rgba(27,26,22,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="min-h-screen-d flex items-start justify-center py-6 sm:py-12 px-3 sm:px-4 md:px-8">
        <div className="relative w-full max-w-[1120px] rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ background: '#F4F1E9', border: '1px solid #E5E1D6', boxShadow: '0 50px 130px rgba(27,26,22,0.35)' }}>
          <button onClick={onClose} aria-label="Close"
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-lined text-ink-500 hover:bg-ink hover:text-paper hover:border-ink transition">✕</button>

          {/* Header */}
          <div className="p-5 sm:p-8 md:p-11 border-b border-line">
            <Eyebrow>System architecture</Eyebrow>
            <h2 className="mt-4 font-display font-normal text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.02]">
              How MobiSoins <span className="italic-accent text-ink-500">fits together</span>
            </h2>
            <p className="mt-4 max-w-[760px] text-ink-500 font-light text-sm sm:text-base leading-relaxed">
              One role-aware app, a NestJS API as the system of record, and Firebase as a realtime side-channel —
              here’s a glimpse of each piece and how they intertwine.
            </p>
          </div>

          {/* Diagram */}
          <div className="p-5 sm:p-8 md:p-11">
            <div className="rounded-2xl p-5 sm:p-7" style={{ background: '#F7F4EC', border: '1px solid #E5E1D6' }}>
              <div className="grid lg:grid-cols-[1fr_248px] gap-6 lg:gap-8 items-start">
                {/* Center stack */}
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <ANode tier="Patient" name="Patient app" sub="map · book · track · pay" />
                    <ANode tier="Nurse" name="Nurse app" sub="go online · accept · navigate" />
                  </div>
                  <div className="text-center text-[10.5px] text-ink-400 mt-2 font-light">One Expo / React Native codebase · role-aware navigation</div>
                  <ADown label="REST · Axios (typed errors)" />
                  <ANode tier="Gateway · system of record" name="NestJS API" sub="Node.js on AWS EC2 · 18 modules · ~111 endpoints · guards · i18n FR/EN" />
                  <ADown label="TypeORM" />
                  <ANode tier="Persistence" name="PostgreSQL" sub="15 entities · 18 migrations · Law 25 audit + soft deletes" />
                </div>

                {/* Firebase rail */}
                <div className="lg:pt-1">
                  <div className="rounded-2xl border border-line bg-surface p-4" style={{ boxShadow: '0 8px 22px rgba(27,26,22,0.05)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="icon-sq w-8 h-8 rounded-lg"><Icon name="chat" size={15} /></span>
                      <span className="text-[12px] font-medium text-ink">Firebase — realtime bus</span>
                    </div>
                    <ul className="space-y-2">
                      {['Live nurse GPS', 'Job offers & accept', 'In-app chat', 'FCM push'].map(x => (
                        <li key={x} className="flex items-center gap-2 text-[12px] text-ink-500 font-light"><span className="w-1 h-1 bg-ink-300" />{x}</li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-line text-[10px] text-ink-400 font-light leading-snug">Keyed by bookingId · JS SDK (app) ↔ Admin SDK (API)</div>
                  </div>
                  <div className="mt-2 text-center text-[10px] text-ink-400 font-light">↔ linked live to both apps</div>
                </div>
              </div>

              {/* External services */}
              <div className="mt-6 pt-5 border-t border-line">
                <div className="text-[10px] tracking-widest uppercase text-ink-400 mb-2.5">External services</div>
                <div className="flex flex-wrap gap-1.5">
                  {['AWS EC2 · hosting', 'AWS Cognito · auth + email OTP', 'Twilio · phone OTP', 'Stripe · escrow + Connect', 'Mapbox · maps + directions', 'S3 · SES · SNS', 'Claude Haiku · assistant'].map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full border border-line bg-surface text-[11px] text-ink-500">{s}</span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[11.5px] text-ink-500 font-light">
                  <span className="text-[10px] tracking-widest uppercase text-ink-400">Delivery</span>
                  CI/CD from GitHub → build → SSH deploy to the AWS EC2 instance · iOS builds via EAS → TestFlight for pre-prod QA.
                </div>
              </div>
            </div>

            {/* Glimpse cards */}
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-lined">
              {ARCH_CARDS.map(c => (
                <div key={c.t} className="p-5 border-b border-r border-lined bg-surface/40">
                  <span className="icon-sq w-9 h-9 rounded-lg"><Icon name={c.icon} size={16} /></span>
                  <div className="mt-4 font-display font-normal text-[17px] text-ink tracking-tight">{c.t}</div>
                  <p className="mt-2 text-[12.5px] text-ink-500 font-light leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 sm:px-8 md:px-11 py-6 border-t border-line flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-ink-400">MobiSoins · architecture</span>
            <button onClick={onClose} className="text-[11px] tracking-widest uppercase text-ink-500 hover:text-ink transition">← back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Mobisoins = () => {
  const m = MOBISOINS;
  const [arch, setArch] = useState(false);
  return (
    <section id="mobisoins" className="relative overflow-hidden border-y border-line" style={{ background: '#EFEBE0' }}>
      <div className="absolute inset-0 grid-lines opacity-50" />
      <div className="relative max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        {/* Top: intro + phone */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-start">
          <div>
            <div className="reveal"><Eyebrow>Featured build · flagship</Eyebrow></div>
            <div className="reveal reveal-delay-1 mt-5 flex items-center gap-3 flex-wrap">
              <h2 className="section-title font-display font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight">{m.title}</h2>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lined bg-surface text-[11px] tracking-widest uppercase text-ink-500">
                <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />{m.status}
              </span>
            </div>
            <p className="reveal reveal-delay-1 mt-4 italic-accent text-ink-500 text-xl sm:text-2xl">{m.tagline}</p>
            <p className="reveal reveal-delay-2 mt-6 max-w-[600px] text-ink-500 text-lg font-light leading-relaxed">{m.blurb}</p>

            <div className="reveal reveal-delay-2 mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button onClick={() => setArch(true)} className="pill pill-solid justify-center">
                <Icon name="layers" size={16} /> View architecture <span className="arw">→</span>
              </button>
              <a href="https://www.mobisoins.com" target="_blank" rel="noopener" className="pill pill-ghost justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-moss" /> Visit mobisoins.com <span className="arw">↗</span>
              </a>
              <a href="mobisoins-story.html" className="pill pill-ghost justify-center">
                <Icon name="chat" size={15} /> Read the story <span className="arw">→</span>
              </a>
            </div>

            {/* Role columns */}
            <div className="reveal reveal-delay-2 mt-9 grid sm:grid-cols-2 gap-6 max-w-[620px]">
              {m.roles.map((r, ri) => (
                <div key={r.label} className="rounded-2xl border border-line bg-surface/70 p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: ri === 0 ? MOBI_GREEN : MOBI_NAVY }} />
                    <span className="text-[11px] tracking-widest uppercase text-ink-700 font-medium">{r.label}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {r.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-[13.5px] text-ink-500 font-light leading-snug">
                        <span className="mt-1.5 w-1 h-1 bg-ink-300 flex-shrink-0" />{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Phone visual */}
          <div className="reveal reveal-delay-2 relative flex justify-center">
            <PhoneMock />
          </div>
        </div>

        {/* Engineering highlights */}
        <div className="reveal mt-16 grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-lined">
          {m.highlights.map((h) => (
            <div key={h.t} className="p-6 border-b border-r border-lined bg-surface/40">
              <div className="font-display font-normal text-xl text-ink tracking-tight">{h.t}</div>
              <p className="mt-2.5 text-[13.5px] text-ink-500 font-light leading-relaxed">{h.d}</p>
            </div>
          ))}
        </div>

        {m.note && (
          <p className="reveal mt-6 flex items-start gap-2.5 text-[13.5px] text-ink-500 font-light max-w-[760px]">
            <span className="mt-0.5 flex-shrink-0 text-ink-400">✦</span>{m.note}
          </p>
        )}

        {/* Stacks + metrics */}
        <div className="reveal mt-12 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] tracking-widest uppercase text-ink-400 mb-2">Mobile app</div>
              <div className="flex flex-wrap gap-1.5">
                {m.techApp.map(t => <span key={t} className="px-2.5 py-1 rounded-full border border-line bg-surface text-[11px] text-ink-500">{t}</span>)}
              </div>
            </div>
            <div>
              <div className="text-[11px] tracking-widest uppercase text-ink-400 mb-2">Backend API</div>
              <div className="flex flex-wrap gap-1.5">
                {m.techApi.map(t => <span key={t} className="px-2.5 py-1 rounded-full border border-line bg-surface text-[11px] text-ink-500">{t}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mt-12 grid grid-cols-2 lg:grid-cols-4 border-t border-line pt-8">
          {m.metrics.map((mt, i) => (
            <div key={i} className={`pr-6 ${i < 3 ? 'border-r border-line' : ''}`}>
              <div className="font-display font-normal text-2xl sm:text-3xl text-ink leading-none tracking-tight">{mt.v}</div>
              <div className="mt-2 text-[11px] tracking-wide text-ink-400 leading-snug">{mt.l}</div>
            </div>
          ))}
        </div>
      </div>
      <MobiArchModal open={arch} onClose={() => setArch(false)} />
    </section>
  );
};

// ────────────────────────────────────────────────────────────────
// EXPERIENCE
// ────────────────────────────────────────────────────────────────

const EducationCard = () => (
  <div className="card rounded-3xl p-7">
    <div className="flex items-start justify-between gap-4">
      <Eyebrow>Education</Eyebrow>
      <span className="font-display font-normal text-4xl text-ink leading-none tracking-tight">'27</span>
    </div>
    <h3 className="mt-6 font-display font-normal text-2xl sm:text-[28px] tracking-tight leading-tight">Carleton University</h3>
    <p className="mt-1.5 italic-accent text-ink-500 text-lg sm:text-xl">B.Sc. Computer Science</p>
    <p className="mt-5 pt-5 border-t border-line text-[12px] tracking-widest uppercase text-ink-400">Ottawa, ON · Expected May 2027</p>
  </div>
);

const Experience = () => (
  <section id="experience" className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
    <div className="reveal mb-12">
      <Eyebrow>Career</Eyebrow>
      <h2 className="section-title mt-5 font-display font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight">Experience</h2>
    </div>
    <div className="grid lg:grid-cols-[1fr_330px] gap-10 lg:gap-14 items-start">
      {/* Left: timeline */}
      <div className="border-t border-line">
        {EXPERIENCE.map((e, i) => (
          <div key={i} className="reveal grid md:grid-cols-[180px_1fr] gap-4 md:gap-8 py-9 sm:py-12 border-b border-line group">
            <div className="md:pt-2">
              <div className="text-[12px] tracking-widest uppercase text-ink-400">{e.when}</div>
              <div className="text-[12px] tracking-widest uppercase text-ink-300 mt-1.5">{e.loc}</div>
            </div>
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-display font-normal text-3xl sm:text-4xl tracking-tight text-ink">{e.co}</h3>
                <span className="italic-accent text-ink-500 text-lg sm:text-xl">— {e.role}</span>
              </div>
              {e.context && (
                <p className="mt-4 max-w-[760px] text-ink-500 font-light leading-relaxed text-[15px] sm:text-base border-l-2 border-lined pl-4">{e.context}</p>
              )}
              <ul className="mt-5 space-y-3">
                {e.bullets.map((b, j) => (
                  <li key={j} className="flex gap-3.5 text-ink-500 font-light leading-relaxed text-[15px] sm:text-base">
                    <span className="mt-2 w-1.5 h-1.5 bg-ink-300 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {/* Right: Education — same row as Experience */}
      <aside className="reveal reveal-delay-1 lg:sticky lg:top-28">
        <EducationCard />
      </aside>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// SKILLS
// ────────────────────────────────────────────────────────────────

const Skills = () => (
  <section id="skills" className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
    <div className="reveal mb-12">
      <Eyebrow>Toolkit</Eyebrow>
      <h2 className="section-title mt-5 font-display font-normal text-4xl sm:text-5xl md:text-6xl tracking-tight">Stack</h2>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {SKILLS.map((s, i) => (
        <div key={i} className={`reveal card rounded-2xl p-6 reveal-delay-${i + 1}`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="icon-sq w-9 h-9 rounded-lg"><Icon name={['brain','code','stack','cloud'][i]} size={17} /></span>
            <h3 className="font-display font-normal text-xl tracking-tight">{s.group}</h3>
          </div>
          <ul className="space-y-2.5">
            {s.items.map(item => (
              <li key={item} className="flex items-center gap-3 text-ink-500 text-[14px] font-light">
                <span className="w-1 h-1 bg-ink-300 flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// ABOUT
// ────────────────────────────────────────────────────────────────

const About = () => (
  <section id="about" className="max-w-[1360px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-start">
      <div>
        <div className="reveal"><Eyebrow>About</Eyebrow></div>
        <h2 className="reveal reveal-delay-1 mt-5 font-display font-normal text-4xl sm:text-5xl md:text-6xl leading-[1.02] tracking-tight">
          I ship GenAI <span className="italic-accent text-ink-500">end-to-end</span> — architecture to production.
        </h2>
        <div className="reveal reveal-delay-2 mt-8 space-y-5 text-ink-500 text-lg font-light leading-relaxed max-w-[620px]">
          <p>
            I'm a Computer Science student at Carleton, currently engineering AI features on
            <span className="text-ink font-normal"> IBM watsonx Workshop</span> for 25,000+ sellers globally.
            Before that I shipped 7 production AI systems at Jonas Software / CSI — chatbots, analytics
            platforms, and RAG pipelines that moved real numbers.
          </p>
          <p>
            My favorite mode is brownfield integration — embedding net-new AI capability into existing
            production codebases without disrupting live operations, often at 2× the expected velocity.
          </p>
        </div>

        <div className="reveal reveal-delay-3 mt-10 max-w-[620px]">
          {window.Terminal && (
            <window.Terminal
              trace={window.FUN_TRACE}
              label="josue.fun · live"
              maxWidth="100%"
              minHeight="300px"
              fontSize="clamp(11px, 2.8vw, 13px)"
            />
          )}
        </div>
      </div>

      {/* Identity card + meta */}
      <div className="reveal reveal-delay-2 space-y-5 max-w-md mx-auto lg:max-w-none w-full">
        <div className="relative w-full rounded-3xl overflow-hidden card" style={{ aspectRatio: '4/5' }}>
          <div className="absolute inset-0 grid-lines-sm opacity-60" />
          <img src="avatars/josue.png" alt="Josue Kenge"
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[92%] object-contain"
            style={{
              filter: 'drop-shadow(0 20px 30px rgba(27,26,22,0.18))',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)',
            }} />
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <PixelMark size={22} color="#1B1A16" />
            <span className="text-[11px] tracking-widest text-ink-400">'26</span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end text-[11px] tracking-widest uppercase">
            <div>
              <div className="text-ink font-medium">AI Engineer</div>
              <div className="text-ink-400 mt-1">Markham · ON</div>
            </div>
            <div className="text-right text-ink-400">
              <div>Est.</div>
              <div>2024</div>
            </div>
          </div>
        </div>
        <div className="card rounded-2xl p-6 space-y-3.5">
          {[
            ['Education', 'Carleton University · B.Sc. CS'],
            ['Based in', 'Markham, ON · open to remote'],
            ['Languages', 'English, French'],
            ['Email', 'josuekenge4@gmail.com'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-[11px] tracking-widest uppercase text-ink-400 flex-shrink-0">{k}</span>
              <span className="text-ink-700 text-right font-light">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// CONTACT
// ────────────────────────────────────────────────────────────────

const Contact = () => (
  <section id="contact" className="relative overflow-hidden py-24 sm:py-36">
    <div className="absolute inset-0 grid-lines opacity-60" />
    <PixelDeco style={{ top: '20%', left: '12%', transform: 'scale(.7)' }} />
    <PixelDeco style={{ bottom: '24%', right: '14%', transform: 'scale(.6)' }} />
    <div className="relative max-w-[1360px] mx-auto px-5 sm:px-8 text-center">
      <div className="reveal flex justify-center"><Eyebrow>Contact</Eyebrow></div>
      <h2 className="contact-headline reveal reveal-delay-1 mt-7 font-display font-normal text-[clamp(48px,9vw,140px)] leading-[0.96] tracking-tight">
        Let's build something
        <br /><span className="italic-accent text-ink-500">that ships.</span>
      </h2>

      <div className="reveal reveal-delay-2 mt-10 flex justify-center">
        <a href="mailto:josuekenge4@gmail.com" className="pill pill-solid text-base sm:text-lg py-4 px-7">
          josuekenge4@gmail.com <span className="arw">→</span>
        </a>
      </div>

      <div className="reveal reveal-delay-3 mt-10 flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-[12px] tracking-[0.15em] uppercase text-ink-500">
        <a href="https://www.linkedin.com/in/josuekenge/" target="_blank" rel="noopener" className="hover:text-ink transition-colors">LinkedIn / @josuekenge</a>
        <span className="w-1.5 h-1.5 bg-ink-300" />
        <a href="https://github.com/josuekenge" target="_blank" rel="noopener" className="hover:text-ink transition-colors">GitHub / @josuekenge</a>
        <span className="w-1.5 h-1.5 bg-ink-300" />
        <a href="https://x.com/kengejosue" target="_blank" rel="noopener" className="hover:text-ink transition-colors">X / @kengejosue</a>
      </div>

      <div className="reveal reveal-delay-4 mt-8 text-[12px] tracking-widest uppercase text-ink-400">
        613.415.6829 · Markham, ON · Open to remote
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────────────────────
// FOOTER
// ────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="border-t border-line py-10 px-5 sm:px-8">
    <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div className="flex items-center gap-2.5">
        <PixelMark size={20} color="#1B1A16" />
        <span className="text-[12px] tracking-wide text-ink-400">© 2026 Josue Kenge · Designed & built end-to-end</span>
      </div>
      <div className="flex items-center gap-3">
        {[
          { icon: 'assets/social/linkedin.png', label: 'LinkedIn', href: 'https://www.linkedin.com/in/josuekenge/' },
          { icon: 'assets/social/x.png', label: 'X / Twitter', href: 'https://x.com/kengejosue' },
          { icon: 'assets/social/whatsapp.png', label: 'WhatsApp', href: 'https://wa.me/16134156829' },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={s.label} title={s.label}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-transform duration-300 hover:-translate-y-1">
            <img src={s.icon} alt={s.label} className="w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 6px 12px rgba(27,26,22,0.15))' }} />
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2.5 text-[12px] tracking-widest uppercase text-ink-400">
        <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />Open to AI engineering roles
      </div>
    </div>
  </footer>
);

// ────────────────────────────────────────────────────────────────
// FLOATING "GET IN TOUCH"
// ────────────────────────────────────────────────────────────────

const FloatingContact = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a href="mailto:josuekenge4@gmail.com"
      className={`fixed bottom-5 right-5 z-40 pill pill-solid shadow-lg transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <PixelMark size={16} color="#F4F1E9" />
      Get in touch
    </a>
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
      <Experience />
      <Ticker />
      <Metrics />
      <Capabilities />
      <Mobisoins />
      <Work onOpenProject={setOpenProject} />
      <Skills />
      <About />
      <Contact />
      <Footer />
      <FloatingContact />
      {window.CaseStudyModal && (
        <window.CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
