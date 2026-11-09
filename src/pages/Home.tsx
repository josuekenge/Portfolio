import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CapabilityDial, type Capability } from '../components/CapabilityDial';
import { ExperienceOverview } from '../components/ExperienceOverview';
import { useInquiry } from '../components/Inquiry';
import { LiquidMark } from '../components/LiquidMark';
import { Logo, Tile } from '../components/Logos';
import { Mark, OttawaClock, SiteLinks, usePageTitle, useReveal } from '../components/Shell';
import { logo, MARQUEE_LOGOS } from '../data/logos';
import { useMediaQuery } from '../lib/useMediaQuery';

const CAPABILITIES: Capability[] = [
  ['01', 'Brownfield Integration', 'Embedding net-new AI capability into live production codebases, .NET, Angular and legacy stacks, without disrupting operations, often at 2× the expected velocity.', ['dotnet', 'angular', 'azure']],
  ['02', 'Agentic and RAG Systems', 'Grounded document Q&A with clickable citations, text-to-SQL agents, and multi-model pipelines on Azure OpenAI, Bedrock, pgvector and LangChain.', ['claude', 'openai', 'langchain']],
  ['03', 'Full-stack Delivery', 'Architecture to deployment: Next.js, FastAPI and Express front to back, Dockerized on Azure Container Apps with automated CI/CD, shipped in a single dev cycle.', ['nextdotjs', 'fastapi', 'docker']],
];

const HEADLINES = [
  ['35K+', 'sellers reached at IBM'],
  ['$303K+', 'client savings shipped'],
  ['957', 'AI initiatives tracked'],
  ['20×', 'query response speedup'],
];

function HeroLeft({ className }: { className: string }) {
  const openInquiry = useInquiry();
  return (
    <div className={className}>
      <div className="now"><i />Now shipping at IBM watsonx, for 35,000+ sellers</div>
      <div>
        <div className="lab atl">Built at</div>
        <div className="at">
          <Link className="co-m sz-ibm" to="/experience#ibm"><Logo def={logo('ibm')} /><span className="atn ph" aria-hidden="true">IBM</span></Link>
          <Link className="co-m sz-ms" to="/experience#microsoft"><Logo def={logo('microsoft')} decorative /><span className="atn">Microsoft</span></Link>
          <Link className="co-m sz-jonas" to="/experience#jonas"><Logo def={logo('jonas')} /><span className="atn ph" aria-hidden="true">Jonas</span></Link>
          <Link className="co-m sz-cu" to="/experience#carleton"><Logo def={logo('carleton')} decorative /><span className="atn">Carleton</span></Link>
        </div>
      </div>
      <div className="cta">
        <Link className="btn round" to="/projects">Explore the projects</Link>
        <button className="btn round ghost" type="button" onClick={openInquiry}>Start a project</button>
      </div>
    </div>
  );
}

function Marquee() {
  const group = (hidden: boolean) => (
    <div className="mq-g" aria-hidden={hidden || undefined}>
      {MARQUEE_LOGOS.map((key) => (
        <Logo key={key} def={logo(key)} decorative={hidden} />
      ))}
    </div>
  );
  return (
    <section className="mq" aria-label="Tools I build with">
      <div className="mq-t">
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export function Home() {
  usePageTitle('Josue Kenge | AI Engineer');
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const openInquiry = useInquiry();
  const isPhone = useMediaQuery('(max-width: 820px)');

  return (
    <div ref={root} className="root">
      <header id="top" className="hero">
        <LiquidMark revealDelay={0} />
        <HeroLeft className="heroleft fi" />
        <nav className="pad heronav fi" style={{ animationDelay: '.05s' }} aria-label="Main">
          <Link className="nl brand" to="/">Josue Kenge</Link>
          <SiteLinks />
          <OttawaClock />
        </nav>
        <div className="pad foot herofoot">
          <h1 className="h1">
            <span className="ln"><span className="in" style={{ animationDelay: '.05s' }}>Production AI,</span></span>
            <span className="ln"><span className="in" style={{ animationDelay: '.15s' }}>actually shipped.</span></span>
          </h1>
          <p className="fi herop" style={{ animationDelay: '.2s' }}>AI engineer at IBM watsonx. Agents, RAG and full-stack products, from architecture to deployment.</p>
        </div>
      </header>

      <HeroLeft className="heroleft-m pad" />

      <section className="pad mx sr" aria-label="Headline results">
        {HEADLINES.map(([v, l]) => (
          <div key={v}>
            <div className="mv">{v}</div>
            <div className="body mt10">{l}</div>
          </div>
        ))}
      </section>

      <Marquee />

      <section id="experience" className="pad sec-c sr">
        <ExperienceOverview heading="h2" linkAll />
      </section>

      <section className="pad sec-c sr">
        <div className="lab">What I do</div>
        {isPhone ? (
          <CapabilityDial items={CAPABILITIES} />
        ) : (
          <div className="bent mt28">
            {CAPABILITIES.map(([n, title, body, marks]) => (
              <div className="card" key={n}>
                <div className="tiles">{marks.map((m) => <Tile key={m} marks={[m]} />)}</div>
                <div>
                  <div className="ct">{title}</div>
                  <p className="cb">{body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="freelance" className="pad sec-c sr">
        <div className="foot band">
          <div>
            <div className="lab">Work with me</div>
            <h2 className="h2 small mt14">Have something you want built?</h2>
            <p className="body mt14 w620">Alongside my full-time work, I take on a few freelance projects: production AI and full-stack builds. Tell me the problem and the timeline.</p>
          </div>
          <button className="btn" type="button" onClick={openInquiry}>Start a project</button>
        </div>
      </section>

      <footer id="contact" className="pad footer compact">
        <div className="foot sr endrow">
          <h2 className="h2">Let's build something<br />that ships.</h2>
          <div className="right">
            <a className="nl mail" href="mailto:josuekenge4@gmail.com">josuekenge4@gmail.com</a>
            <div className="lab mt6">613.415.6829 · Ottawa, ON · Open to remote</div>
          </div>
        </div>
        <div className="wordmark" aria-hidden="true">Josue Kenge</div>
        <div className="footmark"><Mark width={36} /></div>
      </footer>
    </div>
  );
}
