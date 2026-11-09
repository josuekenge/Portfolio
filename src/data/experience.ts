import type { FigureKey } from '../motion/figures';

export interface Experience {
  id: FigureKey;
  co: string;
  role: string;
  loc: string;
  when: string;
  context: string;
  bullets: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'ibm',
    co: 'IBM',
    role: 'AI Engineer Intern, watsonx Workshop',
    loc: 'Markham, ON',
    when: 'May 2026 to Present',
    context: 'watsonx Workshop is IBM\'s internal AI platform that helps 35,000+ sellers research accounts, build demos, and rehearse pitches. I build the AI agents and full-stack features they use every day.',
    bullets: [
      'Engineering AI features across a FastAPI / Python backend and a React frontend, shipping into the daily workflow of IBM\'s global sales force.',
      'Built the Demo Creator agent end-to-end: an LLM tool that turns a 2-question, product-led intake (replacing a 6-question form) into tailored demo recommendations, auto-deriving sales stage, audience, and industry from the seller\'s linked opportunity so they only answer what can\'t be inferred.',
      'Architected its multi-source search — concurrent, permission-scoped Seismic (per-user OAuth) plus IBM TechZone and Navattic interactive demos over MCP — keeping scenario and product separate so each source is queried the way it ranks best, then fusing results through several tuned LLM passes into a deduped, availability-gated top-3 with matched L100–L300 build scripts.',
      'Gave IBM\'s Slack bot long-term memory: a recall system that scores up to a dozen of a seller\'s prior threads (30-day window) with an LLM judge and, on a confident match, carries the earlier session\'s context into the new conversation.',
      'Shipped AI podcast & presentation generation from any session (script → ElevenLabs audio / branded PPTX), with a Slack notification bell that DMs the owner a deep link the moment content is ready and auto-delivers the file back into the thread where they asked.',
      'Engineered the grounding layer for Workshop\'s AI presentation generator: 4 rules for what an agentic slide engine sees (session chat, the seller\'s own slides, focus), environment-safe session reads across per-branch Postgres schemas, and a background run driver with a 35-minute budget for 15 to 20 minute jobs.',
      'Took the chat reaching that engine from 0 to 11,600 characters (30 of 30 test runs carried none before), with 21 of 25 deck details traceable to the seller\'s session and a 12-slide upload returned as the same 12 slides — locked by 74 tests, built with two AI coding agents in parallel alongside the partner team that owns the engine, and merged on the planned release day.',
    ],
  },
  {
    id: 'jonas',
    co: 'Jonas Software',
    role: 'AI Engineer Intern',
    loc: 'Remote',
    when: 'Jan 2026 to Apr 2026',
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
    id: 'microsoft',
    co: 'Microsoft',
    role: 'Software Engineering & PM Intern',
    loc: 'Redmond, WA',
    when: 'Jun 2024 to Aug 2024',
    context: 'On the Office 365 substrate search team in Redmond — the C# / Azure microservices behind enterprise search across Microsoft 365. A hybrid SWE/PM role: I scoped the work, set the targets, and shipped to Microsoft\'s core productivity stack.',
    bullets: [
      'Prototyped a semantic-indexing approach in C# on Azure that lifted search accuracy 25% on a 1M+ entry corpus under production-scale query load — validating a concrete relevance improvement for Office 365 substrate search.',
      'Re-worked a microservices workflow to run multithreaded, cutting request latency 40% and saving ~$14,500/week in Azure compute through concurrency tuning, request batching, and caching.',
      'Shipped maintainable, scalable C# microservices into the Office 365 search infrastructure, meeting the reliability and code-review bar required of a service on Microsoft\'s core productivity stack.',
      'Operated across engineering and product — scoping the prototype, defining its accuracy and latency targets, and presenting results back to the team to steer next steps.',
    ],
  },
];

export const EDUCATION: Experience = {
  id: 'carleton',
  co: 'Carleton University',
  role: 'B.Sc. Computer Science',
  loc: 'Ottawa, ON',
  when: 'Expected December 2027',
  context: 'Studying Computer Science while shipping production AI on the side — coursework in parallel with full-time-caliber internships and founder work.',
  bullets: [
    'B.Sc. Computer Science, expected December 2027.',
    'Balancing a full course load with AI engineering internships at IBM, Jonas Software, and Microsoft.',
    'Founder of MobiSoins and Zerpha alongside school.',
  ],
};
