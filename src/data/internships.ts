import type { LogoKey } from './logos';
import type { DiagramNode, Stat } from './systems';
import type { FigureKey } from '../motion/figures';

export interface Workstream {
  id: string;
  title: string;
  sub: string;
  summary: string;
  /** When set, the architecture and results come from this full case study. */
  system?: FigureKey;
  frame?: string;
  rows?: DiagramNode[][];
  labels?: { from: string; to: string; text: string }[];
  out?: Stat[];
  steps: string[];
  tools?: LogoKey[];
}

export interface Internship {
  id: 'ibm' | 'jonas' | 'microsoft';
  mark: LogoKey;
  glow: string;
  company: string;
  role: string;
  when: string;
  where: string;
  thesis: string;
  stats: Stat[];
  overviewFrame: string;
  overview: DiagramNode[][];
  workstreams: Workstream[];
}

export const INTERNSHIPS: Internship[] = [
  {
    id: 'ibm',
    mark: 'ibm',
    glow: '#4C8DFF',
    company: 'IBM',
    role: 'AI Engineer Intern, watsonx Workshop',
    when: 'May 2026 to present',
    where: 'Markham, ON',
    thesis: "watsonx Workshop is IBM's internal AI platform that helps 35,000+ sellers research accounts, build demos and rehearse pitches. I build the AI agents and full-stack features they use every day, across a FastAPI / Python backend and a React frontend.",
    stats: [['35K+', 'sellers globally'], ['4', 'AI capabilities shipped'], ['0 → 11.6K', 'chars of chat grounded'], ['74', 'tests locking the rules']],
    overviewFrame: 'Where my work sits in Workshop',
    overview: [
      [['Users', 'IBM Sellers', '35,000+ globally']],
      [['Surface', 'Workshop App', 'React frontend'], ['Surface', 'Workshop in Slack', 'Bot, notifications, file delivery']],
      [['Backend', 'FastAPI Services', 'Python, shipped into the daily sales workflow']],
      [['Agent', 'Demo Creator', 'Product-led demo recommendations'], ['Memory', 'Thread Recall', 'Long-term memory for the Slack bot'], ['Generation', 'Podcasts + Decks', 'Grounded content from any session']],
    ],
    workstreams: [
      {
        id: 'demo-creator',
        title: 'Demo Creator agent, V1',
        sub: 'From a 6-question form to 2 questions and a tailored top-3',
        summary: "An LLM tool I built end to end. A seller answers a 2-question, product-led intake, and the agent returns tailored demo recommendations with matched build scripts. Sales stage, audience and industry come from the seller's linked opportunity, so they only answer what can't be inferred.",
        frame: 'Multi-source agentic search',
        rows: [
          [['Seller', 'Product-Led Intake', '2 questions, replacing a 6-question form'], ['Opportunity', 'Linked Opportunity', 'Sales stage, audience, industry auto-derived']],
          [['Agent', 'Demo Creator Agent', 'LLM tool · scenario and product kept separate']],
          [['Source', 'Seismic', 'Per-user OAuth · permission-scoped'], ['Source', 'IBM TechZone', 'Interactive demos over MCP'], ['Source', 'Navattic', 'Interactive demos over MCP']],
          [['Fusion', 'Tuned LLM Passes', 'Several passes fuse results across sources']],
          [['Gate', 'Dedupe + Availability', 'Only available demos, no duplicates']],
          [['Output', 'Top-3 Demos', 'Matched L100 to L300 build scripts']],
        ],
        labels: [{ from: 'Dedupe + Availability', to: 'Top-3 Demos', text: 'deduped, availability-gated' }],
        out: [['2', 'questions, down from 6'], ['3', 'sources searched concurrently'], ['Top-3', 'deduped, availability-gated'], ['L100–L300', 'matched build scripts']],
        steps: [
          "Why only two questions? Sales stage, audience and industry are derived from the seller's linked opportunity, so sellers only answer what can't be inferred.",
          'Why search concurrently? Three sources feed one answer, so Seismic, IBM TechZone and Navattic are queried at the same time.',
          'How is access respected? Seismic is permission-scoped through per-user OAuth, so a seller only sees what they are allowed to see.',
          'Why keep scenario and product separate? So each source is queried the way it ranks best.',
          'What does the seller get? Results fused through several tuned LLM passes into a deduped, availability-gated top-3, each with a matched L100 to L300 build script.',
        ],
        tools: ['python', 'fastapi', 'react'],
      },
      {
        id: 'demo-creator-v2',
        title: 'Demo Creator, rebuilt on Agent V2',
        sub: 'Same search engine, moved onto a new agent platform',
        summary: "Agent V2 is Workshop's new durable agent platform, built by the Workshop team. When Demo Creator moved onto it, ranked results, supporting decks, the Studio view and the script-to-podcast flow were lost. I reorganized Demo Creator for V2 across the backend and the React frontend and took it through review and merge.",
        frame: 'Agent V2 runtime, with my part of it',
        rows: [
          [['Seller', 'Chat Message', 'A form opens only for what the chat left out']],
          [['Platform', 'Turn API', 'Accepts the turn, then streams events live over SSE']],
          [['Platform', 'LangGraph Runtime', 'Guard, planner, dispatch · checkpointed every step'], ['State', 'PostgreSQL + Redis', 'Durable turns and a resumable event stream']],
          [['My part', 'Demo Finder App', 'Returns a run id, searches in the background'], ['My part', 'Talk Track Tool', "Written from the demo's script, deck or steps"]],
          [['Source', 'Seismic Search', 'Permission-scoped · fails closed'], ['Source', 'Navattic Search', 'Interactive demos, ranked by the shared engine']],
          [['Output', 'Demo Cards + Studio', 'Drawn from the saved run, not the model'], ['Output', 'Script to Podcast', 'One click from each card']],
        ],
        out: [['3 → 1', 'raw searches folded into one tool'], ['60 s', 'tool limit the search no longer hits'], ['~1 min', 'search moved off the chat turn'], ['Fail-closed', 'on an expired Seismic login']],
        steps: [
          'What is Agent V2? A durable runtime where each turn runs a LangGraph loop of guard, planner and tool dispatch. Every step is checkpointed, and events stream to the browser and resume from the last one received.',
          "What was my part? I moved Demo Creator onto the platform without changing its architecture or contracts, working in Demo Creator's own backend and frontend code and its configuration.",
          'What had broken in the move? The agent combined raw searches and often answered with a text table, supporting decks disappeared, the Studio view stayed empty and the script-to-podcast flow was gone.',
          "How did the results become reliable? The agent now launches one published app, and the cards are drawn from the saved run, so the model can't replace them with a table.",
          'Why did good results still get lost? V2 cuts a tool result at 8,000 characters, and the instruction to show the cards started at character 8,048. Each demo is now sent once with the instruction first, taking the worst case from 12,425 characters to 7,457.',
          'What happens when a Seismic login expires? It fails closed: Seismic demos are hidden rather than shown unchecked.',
          'Why two sources here? TechZone was retired as a demo source in June 2026. It still serves hands-on L300 environments through its own search.',
        ],
        tools: ['python', 'fastapi', 'langchain', 'react', 'postgresql'],
      },
      {
        id: 'v2-timeouts',
        title: 'Hunting down the V2 timeouts',
        sub: 'Two failures that looked like ordinary bad answers',
        summary: 'Demo searches on V2 failed intermittently and came back as a plain document instead of ranked demos, with nothing in the logs. I traced that to a flat 60-second tool limit, then found a second failure where a runaway tool call froze the event loop and got the whole turn cancelled.',
        frame: 'From a silent timeout to a background run',
        rows: [
          [['Symptom', 'Silent Failure', 'A plain document instead of ranked demos']],
          [['Cause 1', 'Flat 60 s Tool Limit', 'Search needs 50 to 65 s, its declared budget was ignored'], ['Cause 2', 'Frozen Event Loop', 'Runaway tool call blocks the loop for 60 to 108 s']],
          [['Evidence', 'Timing Breakdown', 'About 49 of 60 s in six sequential LLM calls'], ['Evidence', 'Watchdog Stack Dumps', 'Quadratic chunk merge in the watsonx stream']],
          [['Fix', 'Background Search', 'The tool returns at once, the card fills in later'], ['Escalated', 'Platform Write-up', 'Root cause and fix options for the runtime owners']],
          [['Guard', 'Stale Run Reconciler', 'A stopped search is re-run or marked failed']],
          [['Output', 'Cards or a Clear Error', 'No more quiet fallback to a generic search']],
        ],
        out: [['60 s', 'flat limit on every tool'], ['50–65 s', 'what the search actually needed'], ['~49 s', 'spent in six sequential LLM calls'], ['60–108 s', 'event loop frozen by one tool call']],
        steps: [
          "Why was it so hard to see? The adapter handed the timeout back to the model but logged nothing, the cancellation skipped the tool's own error handler, and the planner fell back to a generic search that looked plausible.",
          'What proved it? The same kind of search separated only by duration: 52 s succeeded, 60.025 s and about 62 s failed.',
          'Where did the 60 seconds go? Upstream search took about 9 s. Roughly 49 s went to six sequential LLM calls, and the tool had finished its work when it was cancelled.',
          'Why not just raise the limit? Raising it to 150 s gave every other tool 150 s to hang. The search now launches as a background run, so the limit no longer applies to it and the chat stays free.',
          "What was the second failure? A runaway tool call from the watsonx planner. langchain_ibm buffered the chunks and merged them in one synchronous, quadratic loop, so the turn's heartbeat could not run and the runtime cancelled it as abandoned.",
          'How was that caught? With a temporary watchdog thread that dumped every stack when the event loop stopped turning. Every dump showed the same frames, and capping output alone did not help because truncated JSON is the worst case for the parser.',
          'Where does it stand? It sits in the platform rather than in Demo Creator, so I wrote up the root cause, evidence and fix options for the runtime owners.',
        ],
        tools: ['python', 'fastapi', 'langchain'],
      },
      {
        id: 'slack-memory',
        title: "Long-term memory for IBM's Slack bot",
        sub: 'A new conversation that remembers the last one',
        summary: "A recall system for IBM's Slack bot. When a seller starts a conversation, an LLM judge scores up to a dozen of their prior threads from a 30-day window and, on a confident match, carries the earlier session's context into the new conversation.",
        frame: 'Recall with an LLM judge',
        rows: [
          [['Seller', 'New Slack Conversation', "A seller's next question"]],
          [['Retrieve', 'Prior Threads', "Up to a dozen of the seller's threads · 30-day window"]],
          [['Judge', 'LLM Judge', 'Scores each prior thread against the new conversation']],
          [['Gate', 'Confident Match', 'Context carries over only on a confident match']],
          [['Output', 'Context Carried Forward', "The earlier session's context joins the new conversation"]],
        ],
        out: [['12', 'prior threads scored, at most'], ['30 days', 'recall window']],
        steps: [
          "What gets remembered? Up to a dozen of a seller's prior threads from the last 30 days.",
          'Who decides what is relevant? An LLM judge scores each prior thread against the new conversation.',
          "When does context carry over? Only on a confident match, so an unrelated thread doesn't leak into a new conversation.",
        ],
        tools: ['slack', 'python'],
      },
      {
        id: 'content-generation',
        title: 'Podcast and presentation generation',
        sub: 'Any session, turned into content that finds its owner',
        summary: 'Sellers can generate an AI podcast or a branded presentation from any session. A Slack notification bell DMs the owner a deep link the moment content is ready and auto-delivers the file back into the thread where they asked.',
        frame: 'Generate, notify, deliver',
        rows: [
          [['Input', 'Any Workshop Session', 'The source for generated content']],
          [['Generate', 'Podcast Script', 'Written from the session'], ['Generate', 'Presentation', 'Built from the session']],
          [['Render', 'ElevenLabs Audio', 'Narrated podcast'], ['Render', 'Branded PPTX', 'Ready to present']],
          [['Notify', 'Slack Notification Bell', 'DMs the owner a deep link the moment content is ready']],
          [['Output', 'Back in the Thread', 'File auto-delivered where they asked']],
        ],
        out: [['2', 'formats: audio and PPTX'], ['Any', 'session can be the source']],
        steps: [
          'What can a seller make? An AI podcast (script to ElevenLabs audio) or a branded PPTX, from any session.',
          'How do they know it is ready? A Slack notification bell DMs the owner a deep link the moment content is ready.',
          'Where does the file end up? It is auto-delivered back into the thread where they asked.',
        ],
        tools: ['elevenlabs', 'slack', 'python', 'fastapi'],
      },
      {
        id: 'grounded-decks',
        title: 'Grounded Decks',
        sub: 'The layer that decides what an agentic slide engine sees',
        summary: "Workshop's AI presentation generator was producing decks with no chat context: 30 of 30 test runs carried none. I engineered the grounding layer: 4 rules for what the engine sees, environment-safe session reads across per-branch Postgres schemas, and a background run driver with a 35-minute budget for 15 to 20 minute jobs.",
        system: 'decks',
        steps: [
          'How was it built? With two AI coding agents in parallel. I reviewed and approved every commit and ran the real validation runs myself.',
          'Who else was involved? The partner team that owns the engine, our testers and my team lead, in one shared channel. It merged on the planned release day.',
        ],
      },
    ],
  },
  {
    id: 'jonas',
    mark: 'jonas',
    glow: '#EFEDE8',
    company: 'Jonas Software',
    role: 'AI Engineer Intern',
    when: 'Jan 2026 to Apr 2026',
    where: 'Remote',
    thesis: 'Jonas Software is part of Constellation Software (CSI), a portfolio of 100+ vertical-market software companies. I was the AI engineer embedding GenAI into their live products and coaching acquired teams to build with it.',
    stats: [['$303K+', 'savings delivered'], ['957', 'AI initiatives tracked'], ['20×', 'faster queries on Wes'], ['400+', 'senior leaders served']],
    overviewFrame: 'What I shipped across the portfolio',
    overview: [
      [['Portfolio', 'Constellation Software', '100+ vertical-market software companies']],
      [['Team', 'Jonas Software', 'GenAI into live products, coaching for acquired teams']],
      [['Shipped', 'Production Systems', 'Wes · AIQSR · M&A Due Diligence'], ['Architected', 'Client Engagements', 'Computrition · Minisoft'], ['Coached', 'AI-DLC Workshops', 'Toronto bootcamp · spec-driven workshop']],
      [['Outcome', '$303K+ Saved', 'Wes $150K · M&A $120K · Computrition $33K']],
    ],
    workstreams: [
      {
        id: 'wes',
        title: 'Wes',
        sub: 'Production text-to-SQL inside live warehouse software',
        summary: 'A production AI chatbot embedded into an existing .NET warehouse system, translating natural-language questions into validated SQL. Query response went from 1 minute to 2.3 seconds at 95% accuracy, unlocking $150K in 2 weeks.',
        system: 'wes',
        steps: [],
      },
      {
        id: 'aiqsr',
        title: 'AIQSR',
        sub: 'Quarterly scorecard for AI across the portfolio',
        summary: 'An enterprise analytics platform on Azure Container Apps with fully automated CI/CD, tracking 957 AI initiatives across 100+ operating companies.',
        system: 'aiqsr',
        steps: [
          'How is it deployed? A monorepo of web, API and worker, containerized with Docker onto Azure Container Apps with auto-scaling.',
          'How does the assistant stay within limits? A rolling message window, automatic retry and context size management keep Azure OpenAI within token limits.',
          'What can leadership see? 5 interconnected dashboard views: Overview, Clean Data, Leadership Summary, Leaderboard and Configuration, with KPIs, trend analysis, company rankings and quarter-over-quarter deltas.',
          'What made it fast? Removing a double-navigation pattern took page transitions from 2+ seconds to sub-second, and middleware-level caching halved database calls per request.',
        ],
      },
      {
        id: 'ma',
        title: 'M&A due diligence',
        sub: 'Grounded answers that cite their source',
        summary: 'A full-stack RAG platform for the Jonas finance team, with grounded document Q&A and clickable citations back to the source, generating $120K in yearly savings.',
        system: 'ma',
        steps: [],
      },
      {
        id: 'computrition',
        title: 'Computrition',
        sub: 'A HIPAA-aware healthcare chatbot on Amazon Bedrock',
        summary: 'I architected a HIPAA-aware AI healthcare chatbot on Amazon Bedrock, driving $33K in savings and daily adoption across 400+ senior leaders, and coached the team to ship it in under 2 weeks.',
        system: 'computrition',
        steps: [],
      },
      {
        id: 'minisoft',
        title: 'Minisoft payments',
        sub: 'Bringing an acquired team into AI-native delivery',
        summary: 'Led a brownfield AWS AI-DLC engagement for Minisoft, recently acquired by Jonas / CSI, shipping a payments integration with 60% time savings.',
        system: 'minisoft',
        steps: [],
      },
      {
        id: 'ai-dlc',
        title: 'AI-DLC and spec-driven workshops',
        sub: 'Teaching teams to ship with AI, and understand every line',
        summary: 'As AI architect and coach, I worked with cross-company teams at a 3-day AWS AI-DLC workshop in Toronto, where a production-ready frontend component shipped in under 72 hours. I also developed and delivered a spec-driven implementation workshop for a 5-person cross-functional team.',
        frame: 'AWS AI-DLC, with human oversight',
        rows: [
          [['Inception', 'Mob Elaboration', 'The team shapes the work together']],
          [['Context', 'Semantic Context Building', 'What the AI needs to know about the codebase']],
          [['Construction', 'AI-Driven Build', 'Brownfield, into existing codebases'], ['Oversight', 'Human Review', 'Every line of AI code is understood by its developer']],
          [['Operation', 'Adaptive Workflow Rituals', 'The practice stays with the team']],
          [['Outcome', 'Production in 72 Hours', 'Frontend component, from a 3-day workshop']],
        ],
        out: [['72 hrs', 'production-ready frontend'], ['50%', 'time saved, spec-driven workshop'], ['90%', 'of code output produced by AI'], ['5', 'person cross-functional team']],
        steps: [
          'What was the format? A 3-day, in-person AWS AI-DLC workshop in Toronto for Constellation Software operating companies, coaching cross-company teams.',
          'What was the one rule? Every line of AI-generated code must be understood by the developer.',
          'What did spec-driven delivery prove? For a 5-person cross-functional team, 50% time savings with AI producing 90% of code output.',
        ],
        tools: ['aws', 'claude', 'cursor'],
      },
    ],
  },
  {
    id: 'microsoft',
    mark: 'microsoft',
    glow: '#00A4EF',
    company: 'Microsoft',
    role: 'Software Engineering and PM Intern',
    when: 'Jun 2024 to Aug 2024',
    where: 'Redmond, WA',
    thesis: "On the Office 365 substrate search team: the C# / Azure microservices behind enterprise search across Microsoft 365. A hybrid SWE/PM role where I scoped the work, set the targets, and shipped to Microsoft's core productivity stack.",
    stats: [['+25%', 'search accuracy'], ['1M+', 'entries in the corpus'], ['40%', 'lower latency'], ['$14.5K', 'Azure compute saved weekly']],
    overviewFrame: 'Where my work sat in Office 365 search',
    overview: [
      [['Product', 'Microsoft 365 Search', 'Enterprise search across Microsoft 365']],
      [['Platform', 'Office 365 Substrate Search', 'C# / Azure microservices']],
      [['Relevance', 'Semantic Indexing Prototype', 'Better results on a 1M+ corpus'], ['Efficiency', 'Multithreaded Workflow', 'Lower latency and compute cost']],
      [['Outcome', 'Better and Cheaper Search', '+25% accuracy · 40% lower latency · about $14,500 a week']],
    ],
    workstreams: [
      {
        id: 'semantic-indexing',
        title: 'Semantic indexing prototype',
        sub: 'A concrete relevance gain, under production-scale load',
        summary: 'A semantic-indexing approach in C# on Azure that lifted search accuracy 25% on a corpus above 1M entries while holding stable under heavy query load, validating a concrete relevance improvement for Office 365 substrate search.',
        frame: 'Semantic relevance on Azure',
        rows: [
          [['Query', 'Search Query', 'Production-scale query load']],
          [['Service', 'C# Search Service', 'Office 365 substrate search']],
          [['Index', 'Semantic Index on Azure', 'Dataset above 1M entries']],
          [['Ranking', 'Ranking + Scoring Logic', 'Optimized to stay stable under heavy load']],
          [['Outcome', 'More Relevant Results', '+25% search accuracy']],
        ],
        out: [['+25%', 'search accuracy'], ['1M+', 'entries in the dataset'], ['Stable', 'under heavy query load']],
        steps: [
          'What was the question? Whether semantic indexing could produce a concrete relevance improvement for Office 365 substrate search.',
          'What kept it stable? Optimized ranking and scoring logic, which held performance under heavy query load.',
          'How was success defined? I scoped the prototype and defined its accuracy and latency targets, then presented the results to steer next steps.',
        ],
        tools: ['azure', 'csharp'],
      },
      {
        id: 'multithreaded-workflow',
        title: 'Multithreaded microservices workflow',
        sub: '40% less latency, about $14,500 a week back',
        summary: 'I re-worked a microservices workflow to run multithreaded by restructuring execution paths, tuning concurrency, batching requests and adding targeted caching. Request latency fell 40% and Azure compute costs dropped about $14,500 a week.',
        frame: 'Serial to concurrent',
        rows: [
          [['Input', 'Inbound Requests', 'Office 365 search traffic']],
          [['Restructure', 'New Execution Paths', 'Serial work becomes multithreaded']],
          [['Concurrency', 'Concurrency Tuning', 'Thread behavior tuned for the load'], ['Batching', 'Request Batching', 'Fewer, fuller calls'], ['Cache', 'Targeted Caching', 'Repeat work avoided']],
          [['Compute', 'Azure Microservices', 'C# services, less compute per request']],
          [['Outcome', '40% Lower Latency', 'About $14,500 a week in Azure compute saved']],
        ],
        out: [['40%', 'lower request latency'], ['$14.5K', 'saved weekly on Azure'], ['3', 'levers: concurrency, batching, caching']],
        steps: [
          'What changed in the code? I restructured the execution paths so the workflow runs multithreaded.',
          'How was the saving made real? Concurrency tuning, request batching and targeted caching together cut both latency and Azure compute.',
        ],
        tools: ['azure', 'csharp', 'dotnet'],
      },
      {
        id: 'service-design',
        title: 'Service design for the search stack',
        sub: 'Code held to the bar of a core Microsoft service',
        summary: "I built maintainable, scalable C# microservices for Office 365 search infrastructure using object-oriented design, meeting the reliability and code-review bar required of a service on Microsoft's core productivity stack.",
        frame: 'Object-oriented service design',
        rows: [
          [['Contracts', 'Segregated Interfaces', 'Interface segregation between services']],
          [['Wiring', 'Dependency Injection', 'Implementations are swappable and testable']],
          [['Architecture', 'Service-Oriented C#', 'Maintainable, scalable microservices']],
          [['Outcome', 'Office 365 Search Infrastructure', 'Met the reliability and code-review bar']],
        ],
        steps: [
          'What principles did it follow? Dependency injection, interface segregation and service-oriented architecture.',
          'What was the role beyond code? Operating across engineering and product: scoping, setting targets and presenting results back to the team.',
        ],
        tools: ['csharp', 'dotnet', 'azure'],
      },
    ],
  },
];
