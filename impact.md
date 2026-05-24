# Impact

A record of shipped systems, measurable outcomes, and business value delivered. Every line is a real production system used by real teams.

---

## 📊 Headline Numbers

| Metric | Value | Context |
|---|---|---|
| Users reached | **25,000+** | IBM sellers using watsonx Workshop |
| Companies tracked | **100+** | Operating cos on AIQSR platform |
| AI initiatives managed | **957** | Across the Constellation Software portfolio |
| Senior leaders served | **400+** | Computrition healthcare AI chatbot |
| Savings delivered | **$303K+ USD** | Wes ($150K) + Computrition ($33K) + M&A ($120K) |
| Microsoft compute saved | **$14,500/week** | Office 365 search infrastructure |
| Query response speedup | **20×** | 1 min → 2.3s on Wes chatbot |
| Search accuracy lift | **+25%** | Semantic indexing on 1M+ dataset |
| API call reduction | **80%** | AIQSR caching + dedup |
| Latency reduction | **40%** | Microsoft microservices refactor |
| Time savings (delivery) | **60% / 50%** | Minisoft payments / spec workshop |
| Frontend shipped in | **72 hours** | Toronto AI-DLC workshop |

---

## 🚀 Project-by-Project Impact

### 1. AIQSR Dashboard — Quarterly Scorecard for AI Initiatives
*Jonas Software · 2025*

Full-stack enterprise analytics platform tracking AI initiatives across **100+ operating companies** at Jonas Software (Constellation Software subsidiary).

**Architecture & Deployment**
- Monorepo (web, API, worker) containerized with Docker → Azure Container Apps with auto-scaling. **0 to production in a single dev cycle.**
- CI/CD via GitHub Actions: builds 3 Docker images, pushes to Azure Container Registry, deploys on every merge to main.
- Managed schema evolution across **44 database migrations** in PostgreSQL with zero downtime.

**AI Integration**
- Azure OpenAI (GPT-4) as a context-aware chat assistant grounded in live quarterly data — natural language exploration of **957 initiatives**.
- Rolling message window + automatic retry + context size management to stay within token limits.

**Data, Analytics & Reporting**
- Reporting engine aggregating data across **100+ companies** — KPIs, trend analysis, company rankings.
- Leaderboard with multi-column sort, QoQ delta calculations, portfolio filtering.
- **5 interconnected dashboard views** (Overview, Clean Data, Leadership Summary, Leaderboard, Configuration) with Chart.js + real-time scope state.

**Auth & Security**
- Domain-restricted auth across **120+ approved orgs** with admin / editor / viewer roles.
- Fixed PKCE auth bug where `code_verifier` cookies failed across browser tabs — migrated to Supabase `token_hash` verification.
- Discovered a PostgreSQL `NULL != NULL` bug in triggers that silently blocked admin removal for invited users.

**Performance**
- Eliminated double-navigation pattern — page transitions from **2+ seconds → sub-second**.
- Client-side caching + request deduplication → **80% fewer redundant API calls**, half the DB calls per request via middleware-level caching.

> 120+ domains · 100+ companies · 957 initiatives · 5 dashboards · 44 migrations · 3 services · 80% API reduction

---

### 2. Wes — AI Warehouse Chatbot
*Jonas Software · 2025 · .NET, Angular, AWS AI-DLC, RBAC*

AI-powered chatbot embedded into an existing warehouse management system using a **brownfield approach** — delivered at **2× the expected velocity**.

- Net-new AI chatbot embedded into a production codebase **without disrupting live operations**.
- Scoped and delivered end-to-end in **2 weeks against a 4-week production timeline**.
- RBAC governing chatbot access across warehouse user roles.
- Conversational layer letting staff query operational data in natural language.
- Applied AWS **AI-DLC** methodology throughout.

> 2-week delivery · 2× velocity · RBAC · 0 disruption · 20× faster queries · $150K saved

---

### 3. Computrition — Healthcare AI Chatbot (AI Architect)
*Jonas Software · 2025*

Served as **AI architect and consultant** coaching the Computrition team through the design and implementation of a production AI chatbot for their healthcare platform, guided by AWS AI-DLC.

- Designed end-to-end AI chatbot architecture and implementation guidance.
- Defined technical roadmap, best practices, and step-by-step integration approach.
- Daily standups + working sessions keeping the team aligned and unblocked.
- Brownfield integration patterns — clean embedding into existing healthcare software.
- Team completed full implementation in **under 2 weeks — a day ahead of schedule**.

> Under 2-week delivery · 1 day ahead · Daily coaching · Full architecture handed off

---

### 4. AWS AI-DLC Workshop — 3-Day Bootcamp
*Toronto · 2025*

Participated as **AI architect and coach** in a 3-day in-person AWS AI-DLC workshop in Toronto for Constellation Software operating companies. **Production-ready frontend component in under 72 hours.**

- Coached cross-company teams through AI-DLC in a hands-on, time-compressed environment.
- Brownfield approach — integrating AI-driven capabilities into existing codebases.
- Coached mob elaboration, semantic context building, adaptive workflow rituals.
- Reinforced: every line of AI-generated code must be understood by the developer.

> 72-hour frontend delivery · 3-day intensive · Multiple CSI cos · Brownfield approach

---

### 5. AWS Transform — Executive AI-DLC Conference
*Virtual · 2025 · Representing Jonas Software*

Participated in AWS Transform alongside enterprise businesses across the Constellation Software portfolio.

- AWS AI-DLC framework deep-dive — full SDLC from inception → construction → operation with human oversight.
- Applied learnings directly to ongoing AI initiatives at Jonas Software.

---

### 6. M&A Due Diligence Platform — AI-Powered Acquisition Intelligence
*Jonas Finance · 2025*

Full-stack RAG-based due diligence platform built for the Jonas Software finance team — AI-grounded document querying with **source-cited responses**.

**Stack:** Next.js 15, Supabase (PostgreSQL + pgvector), Azure OpenAI GPT-4.1, text-embedding-3-large, LangChain, TypeScript, Tailwind, shadcn/ui

- Full **RAG pipeline** with Azure OpenAI GPT-4.1 + text-embedding-3-large + pgvector on Supabase.
- Two-panel layout separating document navigation from AI response output.
- **Clickable in-line citations** linking AI responses to source passages — instant verification.
- Supabase MCP server for streamlined database operations.
- No auto-generated summaries — AI only responds to explicit queries. Analysts stay in control.
- Built iteratively with direct stakeholder input from finance leads Zac and Brent.
- Accelerated delivery via Claude Code.

> RAG on production docs · Clickable citations · Two-panel UX · $120K/yr savings

---

### 7. Minisoft Inc — AI-DLC Payments Consulting
*Jonas Software · 2025*

Serving as **AI consultant, architect, and coach** for Minisoft (recently acquired by Jonas/CSI), guiding their team through AWS AI-DLC to build AI capabilities into their core payments feature.

- Primary AI architect translating AWS AI-DLC practices into payments product context.
- Hands-on guidance on tooling, best practices, step-by-step implementation.
- Upskilling on mob elaboration, semantic context, adaptive workflows.
- Same proven coaching model that succeeded at Computrition.

> Brownfield payments · AWS AI-DLC · Post-acquisition onboarding into CSI AI standards · 60% time savings
