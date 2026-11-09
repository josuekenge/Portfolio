import type { FigureKey } from '../motion/figures';

export type DiagramNode = [tier: string, name: string, sub: string];
export type Stat = [value: string, label: string];

export interface System {
  id: FigureKey;
  n: string;
  title: string;
  sub: string;
  tag: string;
  role: string;
  tech: string;
  summary: string;
  frame: string;
  rows: DiagramNode[][];
  foot?: { k: string; v: string };
  out: Stat[];
  find?: Stat[];
  steps: string[];
  stack: [key: string, value: string][];
  quote?: string;
  link?: string;
  linkText?: string;
}

export const SYSTEMS: System[] = [
    { id: 'decks', n: '08', title: 'Grounded Decks', sub: 'Context architecture for AI presentations', tag: 'IBM · Agentic generation', role: 'AI Engineer · IBM watsonx Workshop', tech: 'FastAPI · PostgreSQL · OpenShift · Claude Code · pytest',
      summary: "watsonx Workshop can turn a seller's working session into a finished presentation through an agentic slide engine. I engineered the grounding layer: the part that decides what the engine actually sees, the chat, the seller's own slides, the focus, so the deck is about their deal and not a generic pitch. Built on a teammate's base integration with the engine's API, with the engine itself owned by a partner team, and merged to main on the planned release day.",
      frame: 'Agentic generation · Grounding layer',
      rows: [
        [['Input', 'Session Chat', 'What the seller discussed'], ['Input', 'Uploaded Deck', 'Their own slides + notes'], ['Input', 'Title + Focus', 'What they asked for']],
        [['Context builder', 'FastAPI · Session Reader', 'Schema-qualified reads · one Postgres schema per environment']],
        [['Source assembler', 'Grounding Rules', 'Decides which documents and which outline the engine sees']],
        [['Sources', 'Context · Slides · Outline', 'Uploaded as documents · size-capped'], ['Brief', 'Short Goal', 'Title · focus · how to treat the deck']],
        [['Run driver', 'Background Poller', "8 s polls · up to 35 min · answers the engine's questions · cancellable"]],
        [['Engine', 'Agentic Slide Builder', "Partner team's service · chosen per environment"]],
        [['Output', 'Deck Grounded in the Session', '.pptx + PDF · optional narrated video']],
      ],
      foot: { k: 'Grounding rules', v: "Chat only: session context + generated outline. Deck only: slides + the deck's own outline. Deck + chat: deck sets the structure, session tailors it. Nothing: nothing is invented." },
      out: [['4', 'grounding rules, one per input case'], ['0 → 11.6K', 'characters of chat reaching the engine'], ['12 → 12', 'uploaded slides in, same slides out'], ['21 / 25', 'deck details traced to the chat'], ['17 min', 'real deck built end to end'], ['35 min', 'run budget, up from 20'], ['74', 'tests passing, new ones fail-first'], ['1 day', 'design to merged, on release day']],
      find: [['30 / 30', 'runs carried no chat before the change'], ['6', 'real chat sessions read as empty'], ['0', 'errors raised: it failed silently'], ['~2 KB', 'outline invented from an empty session'], ['95% vs 35%', 'faithful to the deck vs the session'], ['2', 'runs dropped at 20 min, engine still working'], ['5 on 2', 'runs queued on two engine workers'], ['4', 'design gaps, all on the Workshop side']],
      steps: [
        'What it does: a seller clicks Generate and Workshop gathers their session, hands it to the engine as source documents plus a short goal, drives the run to completion in the background, and stores the finished .pptx and PDF, with an optional narrated video.',
        'My part: the grounding layer and its release. I designed the rules for what gets sent, made session reads safe across environments, set how long Workshop waits for a run, and made the engine selectable per environment. I directed two AI coding agents in parallel, reviewed and approved every commit and push, and ran the real validation runs myself.',
        "What does the engine see? Four cases, one rule each. Chat only: the session context plus an outline generated from it. Deck only: the slides and the deck's own outline. Deck and chat: the deck sets the structure and the session tailors it. Nothing: nothing is sent, and no outline is invented.",
        'Why documents and not one big prompt? The engine takes source documents and a short goal, so the substance travels as size-capped documents and the goal stays a few lines: title, focus, and how to treat an uploaded deck.',
        'Why never generate an outline from an empty session? Asked to outline nothing, an LLM writes a confident generic pitch and the engine follows it. An empty input now produces no outline, and says so in the logs.',
        "How does it work in every environment? Each branch is deployed with its own Postgres schema. Raw SQL resolves bare table names through the default schema, so the session reader now names the environment's schema explicitly and rejects anything that is not a plain identifier.",
        "How does a 15 to 20 minute job fit a web request? It doesn't. Generation runs as a background task that polls the engine every 8 seconds for up to 35 minutes, reports progress to the UI, answers the engine's own questions so no human is needed, and can be cancelled.",
        'What happens when a piece fails? Each stage degrades on its own: an unreadable deck falls back to the session, a context failure still sends the deck, an outline failure is not fatal, and a timeout records which run it was and where it stopped. Every fallback is logged.',
        'How do we know it works? Each rule has a test that failed before the change and passes after, and the logs record how much chat was read and what was sent. A real run on the test environment went from 0 to 11,600 characters of chat sent, and 21 of 25 specific details in the deck traced back to the conversation.',
        'Who was involved? The engine is built by a separate team, so this ran in one shared channel with their engineers, our testers and my team lead. Each change shipped as its own small commit to the shared test environment so testers could retest while the next was in progress, and everything was reviewed and merged on release day.',
      ],
      stack: [['Backend', 'Python · FastAPI · SQLAlchemy · PostgreSQL'], ['Engine', "Partner team's agentic slide builder · HTTP API · long-running runs"], ['Grounding', 'Session context builder · source assembler · LLM outline step'], ['Infra', 'OpenShift · one environment and one Postgres schema per branch · CI/CD'], ['Dev loop', 'Two Claude Code agent sessions in parallel · written handoffs'], ['Testing', 'pytest · failing-first tests · real end-to-end runs'], ['Teams', "Workshop engineering · the engine's team · internal testers"]],
      quote: 'A generator is only as good as what you hand it. Most of the engineering here is deciding what the engine gets to see.' },
    { id: 'wes', n: '02', title: 'Wes Chatbot', sub: 'AI for warehouse ops', tag: 'Brownfield · Text-to-SQL', role: 'AI Engineer · Jonas Software', tech: '.NET · Angular · AWS AI-DLC · RBAC',
      summary: 'Brownfield AI chatbot embedded into an existing .NET warehouse management system. Translated natural-language queries into SQL against the live ops database.',
      frame: 'Brownfield · under 2 weeks · Text-to-SQL',
      rows: [
        [['User', 'Warehouse Staff', 'RBAC: operator / supervisor / admin']],
        [['Existing app', 'Angular Frontend', 'Wes chatbot module · embedded']],
        [['.NET backend', 'C# API + Chatbot Service', 'Brownfield integration · no disruption']],
        [['Text to SQL', 'NL Query Translator', 'LLM-grounded · validates against schema']],
        [['Database', 'Warehouse SQL DB', '2.3 s responses · 95% accuracy']],
      ],
      out: [['20×', 'faster queries (1 min to 2.3 s)'], ['95%', 'accuracy on warehouse queries'], ['$150K', 'savings unlocked in 2 weeks'], ['2 wks', 'delivery (vs 4-week plan)'], ['0', 'production disruption']],
      steps: [
        'Embedded a net-new AI chatbot into a production .NET codebase without disrupting live warehouse operations.',
        'Built a text-to-SQL translator: natural-language query, validated SQL against the warehouse schema, then safe execution.',
        'Implemented RBAC governing chatbot access across operator, supervisor and admin roles.',
        'Delivered the full feature in 2 weeks against a 4-week plan: 2× velocity.',
        'Applied AWS AI-DLC throughout: mob elaboration, semantic context building, adaptive rituals.',
      ],
      stack: [['Frontend', 'Angular · embedded chatbot module'], ['Backend', 'C# · .NET Framework · brownfield integration'], ['AI pattern', 'Text-to-SQL · schema-validated · LLM-grounded'], ['Auth', 'RBAC across warehouse user roles'], ['Methodology', 'AWS AI-DLC']] },
    { id: 'aiqsr', n: '01', title: 'AIQSR Dashboard', sub: 'AI Initiative Quarterly Scorecard', tag: 'Enterprise analytics', role: 'Full-stack lead · Jonas Software', tech: 'Next.js 14 · Express · Supabase · Azure OpenAI · Docker',
      summary: 'Greenfield monolithic platform tracking AI initiatives across the entire Constellation Software portfolio. Shipped from zero to production in a single dev cycle.',
      frame: 'Monolithic · Greenfield',
      rows: [
        [['Users', '120+ Orgs', '120 approved domains']],
        [['Frontend', 'React + TypeScript', 'Next.js 14 · Chart.js · 5 dashboards']],
        [['API', 'Node.js + Express', 'Caching · request dedup (80% fewer calls)']],
        [['Database', 'Supabase (PostgreSQL)', 'RLS · 44 migrations · 957 initiatives'], ['AI layer', 'Azure OpenAI', 'GPT-4 · context-grounded chat']],
      ],
      foot: { k: 'Infra', v: 'Docker · Azure Container Apps · Azure Container Registry · GitHub Actions CI/CD' },
      out: [['957', 'AI initiatives tracked'], ['100+', 'operating companies'], ['120+', 'approved org domains'], ['44', 'database migrations, 0 downtime'], ['80%', 'fewer API calls (caching + dedup)'], ['< 1 s', 'page transitions (from 2+ s)']],
      steps: [
        'Designed monolithic architecture (intentionally): fast iteration, single dev cycle, zero infra overhead during rapid feature delivery.',
        'CI/CD: GitHub Actions builds 3 Docker images, pushes to ACR, deploys on every merge to main.',
        'Managed 44 PostgreSQL migrations across the project lifecycle with zero downtime.',
        'Implemented Supabase RLS for domain-restricted access: 120+ approved org domains, admin, editor and viewer roles.',
        'Diagnosed a PKCE auth bug where code_verifier cookies failed across browser tabs, and migrated to Supabase token_hash verification.',
        'Discovered a PostgreSQL NULL != NULL bug in triggers silently blocking admin removal for invited users.',
        'Added client-side caching and request deduplication for an 80% reduction in redundant API calls.',
      ],
      stack: [['Frontend', 'React · TypeScript · Next.js 14 · Chart.js'], ['Backend', 'Node.js · Express'], ['Database', 'Supabase (PostgreSQL) · Row-Level Security · 44 migrations'], ['AI layer', 'Azure OpenAI · GPT-4 · context-grounded chat'], ['Infra', 'Docker · Azure Container Apps · Azure Container Registry · GitHub Actions CI/CD']] },
    { id: 'ma', n: '03', title: 'M&A Due Diligence', sub: 'AI-powered acquisition intel', tag: 'RAG · Citations', role: 'AI Engineer · Jonas Finance', tech: 'Next.js 15 · pgvector · GPT-4.1 · LangChain',
      summary: 'RAG-based due diligence platform for the Jonas Finance team. Grounded document Q&A with clickable in-line citations so analysts could verify every AI claim instantly.',
      frame: 'RAG · Server Actions',
      rows: [
        [['Analyst', 'Finance Team', 'Brent · Zack · Maria']],
        [['Frontend', 'Next.js 15 + React', 'Two-panel UX · TypeScript']],
        [['Server actions', 'Next.js Server Functions', 'No exposed API · type-safe RPC']],
        [['Vector store', 'Supabase + pgvector', 'text-embedding-3-large · prod docs'], ['LLM', 'Azure OpenAI GPT-4.1', 'LangChain · grounded responses']],
        [['Response', 'Cited Answer', 'Clickable ¹ ² ³ to the source passage']],
      ],
      out: [['$120K', 'yearly savings'], ['RAG', 'on production M&A docs'], ['¹ ² ³', 'clickable inline citations'], ['3', 'finance stakeholders bought in']],
      steps: [
        'Used Next.js Server Actions instead of REST endpoints: type-safe RPC, no exposed API surface, simpler auth.',
        'RAG pipeline: text-embedding-3-large into pgvector on Supabase for semantic doc search.',
        'Two-panel UX: document navigation on the left, AI response on the right. UX directive from finance stakeholders.',
        'Clickable in-line citations link every claim back to its source passage, so analysts verify in one click.',
        'Deliberately no auto-generated summaries on doc load. AI only responds to explicit queries, so analysts stay in control.',
        'Iterated weekly with Brent, Zack and Maria from finance leadership.',
        'Used Supabase MCP server and Claude Code for accelerated delivery.',
      ],
      stack: [['Frontend', 'Next.js 15 · React · TypeScript · Tailwind · shadcn/ui'], ['Server', 'Next.js Server Actions (no exposed API surface)'], ['Vector', 'Supabase + pgvector · text-embedding-3-large'], ['LLM', 'Azure OpenAI GPT-4.1 · LangChain'], ['Dev loop', 'Supabase MCP server · Claude Code']],
      quote: 'Impressed Brent, Zack, and Maria from finance leadership. Built iteratively with weekly direct stakeholder input.' },
    { id: 'computrition', n: '04', title: 'Computrition Chatbot', sub: 'Healthcare AI, as architect', tag: 'Healthcare · HIPAA-aware', role: 'AI Consultant · Jonas Subsidiary', tech: 'Amazon Bedrock · AWS AI-DLC · Brownfield',
      summary: "Consulting and coaching engagement. Designed the end-to-end AI chatbot architecture for Computrition's healthcare platform and coached the team through implementation via AWS AI-DLC.",
      frame: 'Consulting · AI-DLC methodology',
      rows: [
        [['Architect', 'AI Architecture + Roadmap', 'Designed end to end · handed off']],
        [['Methodology', 'AWS AI-DLC Framework', 'Mob elaboration · semantic context · adaptive rituals']],
        [['Team', 'Computrition Dev Team', '10+ engineers · brownfield healthcare app']],
        [['Outcome', 'Production Chatbot, Shipped', 'Under 2 weeks · 1 day ahead of plan']],
      ],
      foot: { k: 'Ongoing impact', v: '10+ person team now uses AI coding in their daily workflow via AI-DLC.' },
      out: [['$33K', 'in savings'], ['400+', 'senior leaders on it daily'], ['< 2 wks', 'team shipped to production'], ['+1 day', 'ahead of target deadline'], ['10+', 'team now using AI coding daily'], ['AI-DLC', 'adopted as ongoing practice']],
      steps: [
        'Designed the full chatbot architecture and provided implementation guidance throughout the project lifecycle.',
        'Defined technical roadmap, best practices, and step-by-step integration approach.',
        'Facilitated daily standups and working sessions to keep the team aligned and unblocked.',
        'Coached AI-DLC rituals: mob elaboration, semantic context building, adaptive workflow.',
        'Ensured every line of AI-generated code was understood by the team: quality alongside velocity.',
      ],
      stack: [['Role', 'AI Architect / Consultant / Coach'], ['Platform', 'Amazon Bedrock'], ['Methodology', 'AWS AI-Driven Development Lifecycle (AI-DLC)'], ['Format', 'Daily standups + working sessions · about 2 weeks'], ['Domain', 'Healthcare software · brownfield integration']],
      quote: '10+ person team is now using AI coding in their work every day via AI-DLC. The methodology stuck.' },
    { id: 'zerpha', n: '05', title: 'Zerpha Intelligence', sub: 'AI vertical SaaS analysis', tag: 'Founder', role: 'Founder', tech: 'Node.js · Supabase · React · Claude · Gemini', link: 'https://zerpha.ca', linkText: 'zerpha.ca',
      summary: 'Personal project. RAG-powered intelligence platform for tracking M&A deals at the initial stage, compressing analyst research from hours to under three minutes.',
      frame: 'Personal · RAG-powered M&A tracker',
      rows: [
        [['Analyst', 'M&A Researcher', 'Initial-stage deal discovery']],
        [['Frontend', 'React (Netlify)', 'Static site · zerpha.ca']],
        [['Backend', 'Node.js (Railway)', 'Multi-page scraper · structured extraction']],
        [['RAG pipeline', 'Claude + Gemini', 'Semantic M&A queries · JSON correction'], ['Database', 'Supabase + MDE', 'Model-driven entity tracking']],
        [['Output', 'Deal Intel in under 3 min', 'Hours to minutes · 4× dev velocity']],
      ],
      out: [['< 3 min', 'research cycle (from hours)'], ['4×', 'dev velocity (vs early monolith)'], ['RAG', 'semantic M&A queries'], ['MDE', 'deal-stage tracking']],
      steps: [
        'Architected modular services for discovery, multi-page scraping, and structured insight extraction.',
        'Deployed split-stack: Netlify for static frontend, Railway for backend services, chosen intentionally to learn the infra layer.',
        'Built a RAG pipeline grounding LLM responses in scraped deal documents.',
        'Used model-driven entity tracking (MDE) to maintain a canonical deal-stage representation across noisy sources.',
        'Service-oriented backend architecture enabled 4× faster development velocity vs the initial monolith attempt.',
      ],
      stack: [['Frontend', 'React (Netlify) · static site at zerpha.ca'], ['Backend', 'Node.js · Express · Railway'], ['Scraping', 'Modular multi-page scrapers · structured extraction'], ['AI', 'Claude · Gemini · semantic M&A queries · JSON correction logic'], ['Data', 'Supabase · MDE (model-driven entity tracking)']] },
    { id: 'ulife', n: '06', title: 'Ulife AI Agency', sub: 'Automated AI receptionist', tag: 'Founder', role: 'Founder', tech: 'React · Node.js · OpenAI · Vapi · PostgreSQL', link: 'https://ulife.ai', linkText: 'ulife.ai',
      summary: 'AI voice receptionist for healthcare and service-industry clients. Handles inbound calls end to end: appointment scheduling, intake, sales qualification.',
      frame: 'AI receptionist · Voice + sales',
      rows: [
        [['Caller', 'Patient / Client', 'Inbound voice call']],
        [['Voice layer', 'Vapi', 'Real-time speech-to-speech AI agent']],
        [['Backend', 'Node.js API', 'Intent routing · sales scripts · qualifier']],
        [['LLM', 'OpenAI API', 'Conversational + intent classification'], ['Database', 'PostgreSQL', 'Appointments · intake · client log']],
      ],
      out: [['3', 'paid contracts closed'], ['30–50', 'qualified meetings generated'], ['24/7', 'lead capture, no human staffing'], ['Healthcare', 'primary vertical, PMF signal']],
      steps: [
        'Used Vapi as the real-time voice layer: it handles speech-to-text, agent turn-taking, and TTS without rolling our own.',
        'Built intent routing and sales-qualification logic in Node.js. The agent does more than book, it qualifies.',
        'Integrated with PostgreSQL for appointment booking and client intake, so the agent writes directly to the schedule.',
        'Sold the platform via direct outreach and product demos in healthcare and service verticals.',
      ],
      stack: [['Frontend', 'React · client dashboard'], ['Voice layer', 'Vapi · real-time speech-to-speech AI agent'], ['Backend', 'Node.js API · intent routing · sales scripts'], ['LLM', 'OpenAI API · conversational + intent classification'], ['Database', 'PostgreSQL · appointments · intake · client log']] },
    { id: 'minisoft', n: '07', title: 'Minisoft Payments', sub: 'AI-DLC consulting', tag: 'Consulting · AI-DLC', role: 'AI Architect / Coach', tech: 'AWS AI-DLC · Brownfield · Payments',
      summary: 'AI consulting and coaching engagement. Helping Minisoft (post-acquisition into Jonas / CSI) implement AI capabilities in their payments product via AWS AI-DLC.',
      frame: 'Consulting · Tech implementation coaching',
      rows: [
        [['Role', 'AI Architect / Coach', 'Post-acquisition onboarding into CSI']],
        [['Framework', 'AWS AI-DLC', 'Translated to payments domain']],
        [['Tooling', 'AI Coding Tools', 'Cursor · Claude Code · spec-driven'], ['Team', 'Minisoft Engineers', 'Brownfield payments integration']],
        [['Outcome', '60% time savings', 'Team now ships AI-assisted features']],
      ],
      out: [['60%', 'time savings on delivery'], ['CSI', 'AI standards onboarding'], ['Brownfield', 'payments feature integration'], ['Live', 'consulting, ongoing']],
      steps: [
        "Acting as primary AI architect, translating AWS AI-DLC into Minisoft's payments product context.",
        'Hands-on guidance on AI coding tooling: Cursor, Claude Code, spec-driven workflows.',
        'Educating the team on AI-DLC rituals: mob elaboration, semantic context building, adaptive sprints.',
        'Same proven model that worked at Computrition: daily collaboration, architecture ownership, team enablement.',
        'Coaching the team from AI-assisted to AI-native development practices.',
      ],
      stack: [['Role', 'AI Architect / Consultant / Coach'], ['Framework', 'AWS AI-DLC · translated to payments domain'], ['Tooling', 'Cursor · Claude Code · spec-driven dev'], ['Pattern', 'Brownfield integration into existing payments feature']] },
];
