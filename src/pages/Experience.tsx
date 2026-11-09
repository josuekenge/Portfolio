import { useRef } from 'react';
import { ExperienceOverview } from '../components/ExperienceOverview';
import { ExperienceScroll } from '../components/ExperienceScroll';
import { LogoRow } from '../components/Logos';
import { TopNav, usePageTitle, useReveal } from '../components/Shell';
import { Link } from 'react-router-dom';

const SKILLS = [
  { group: 'AI / ML', items: ['Claude API', 'OpenAI / Azure OpenAI', 'Amazon Bedrock', 'RAG', 'pgvector', 'Agentic workflows', 'Prompt engineering', 'Spec-driven dev'] },
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'Java', 'C / C++', 'SQL', 'HTML / CSS'] },
  { group: 'Frameworks', items: ['Next.js', 'React', 'FastAPI', 'Express', 'Spring Boot', '.NET Core', 'LangChain', 'Tailwind'] },
  { group: 'Infra / Cloud', items: ['Azure Container Apps', 'AWS Bedrock', 'Docker', 'PostgreSQL', 'Supabase', 'GitHub Actions', 'Firebase', 'REST APIs'] },
];

export function Experience() {
  usePageTitle('Experience | Josue Kenge');
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div ref={root} className="root">
      <TopNav />
      <main className="pad xpage">
        <ExperienceOverview heading="h1" />
        <ExperienceScroll />
      </main>

      <section id="stack" className="pad sec sr">
        <div className="lab">Stack</div>
        <div className="g4 mt28">
          {SKILLS.map((s) => (
            <div key={s.group}>
              <div className="h3">{s.group}</div>
              <ul className="svc">
                {s.items.map((i) => (
                  <li key={i}><LogoRow text={i} max={1} /><span>{i}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="pad sec sr">
        <div className="about">
          <img className="photo" src="/assets/josue-headshot.png" alt="Josue Kenge" loading="lazy" />
          <div>
            <div className="lab">About</div>
            <h2 className="h2 mt14">I ship GenAI end to end, architecture to production.</h2>
            <p className="body mt24 w760">I'm a Computer Science student at Carleton, currently engineering AI features on IBM watsonx Workshop for 35,000+ sellers globally. Before that I shipped 7 production AI systems at Jonas Software / CSI: chatbots, analytics platforms and RAG pipelines that moved real numbers.</p>
            <p className="body mt16 w760">My favorite mode is brownfield integration: embedding net-new AI capability into existing production codebases without disrupting live operations, often at 2× the expected velocity.</p>
            <div className="lab mt28">Carleton, B.Sc. CS · Ottawa, ON · English, French</div>
          </div>
        </div>
      </section>

      <footer className="pad pager toplined">
        <Link className="nl" to="/">← Home</Link>
        <Link className="nl big" to="/projects">Projects →</Link>
      </footer>
    </div>
  );
}
