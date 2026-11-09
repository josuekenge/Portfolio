import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo, LogoRow, Tile } from '../components/Logos';
import { Mark, TopNav, usePageTitle, useReveal } from '../components/Shell';
import { MobiSoinsMap } from '../components/SystemMap';
import { logo } from '../data/logos';
import { COMPANY, EXTRAS } from '../data/maps';
import { ARCH_CARDS, MOBISOINS as M } from '../data/mobisoins';
import { SYSTEMS, type System } from '../data/systems';
import { Figure } from '../motion/Figure';

function ProjectCard({ system }: { system: System }) {
  const company = COMPANY[system.id];
  const hero = EXTRAS[system.id]?.heroStat ?? 0;
  const stats = [system.out[hero], ...system.out.filter((_, i) => i !== hero)].slice(0, 3);
  return (
    <article className="pcard sr" id={system.id}>
      <div className="pcfig"><Figure name={system.id} /></div>
      <div className="pcb">
        <div className="pcm">
          <span className="lab">{system.n} · {system.tag}</span>
          {company ? <span className="co-m sz-card"><Logo def={logo(company)} /></span> : <span className="lab">Founder <Mark width={18} /></span>}
        </div>
        <div>
          <h2 className="pct">{system.title}</h2>
          <p className="pcs">{system.sub}</p>
        </div>
        <p className="pcd">{system.summary}</p>
        <div className="nums">
          {stats.map(([v, l]) => (
            <div key={`${v}${l}`}><div className="nv">{v}</div><div className="nlb">{l}</div></div>
          ))}
        </div>
        <LogoRow text={`${system.tech} ${system.stack.map(([, v]) => v).join(' ')}`} max={8} />
        <div className="pcl"><Link className="tl" to={`/systems/${system.id}`}>Full architecture and decisions →</Link></div>
      </div>
    </article>
  );
}

export function Projects() {
  usePageTitle('Projects | Josue Kenge');
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div ref={root} className="root">
      <TopNav />
      <header className="pad ptop">
        <div className="lab">Nine systems, architecture included</div>
        <h1 className="phead">Projects</h1>
        <nav className="pindex" aria-label="Jump to a project">
          <a href="#mobisoins">MobiSoins</a>
          {SYSTEMS.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
        </nav>
      </header>

      <section id="mobisoins" className="pad secs">
        <div className="sr">
          <div className="lab">Flagship · {M.status}</div>
          <h2 className="display">{M.title}</h2>
          <div className="g2 mt32 endalign">
            <p className="lede">{M.tagline}</p>
            <p className="body">{M.blurb}</p>
          </div>
        </div>
        <div className="xover mt64 sr">
          <div className="sfig"><Figure name="mobisoins" /></div>
          <div className="g2 tightish">
            {M.metrics.map((x) => (
              <div key={x.v}><div className="mv mv-s">{x.v}</div><div className="body mt8">{x.l}</div></div>
            ))}
          </div>
        </div>
        <div className="g2 sr mt72">
          {M.roles.map((r) => (
            <div key={r.label}>
              <div className="h3">{r.label}</div>
              <ul className="bl">{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="hl sr mt72">
          {M.highlights.map((h) => (
            <div key={h.t}><div className="h3">{h.t}</div><p className="body mt10">{h.d}</p></div>
          ))}
        </div>
        <div className="sr mt96">
          <div className="lab">System architecture</div>
          <h3 className="h2 small mt14">How MobiSoins fits together</h3>
          <div className="mt32"><MobiSoinsMap /></div>
          <div className="g2 mt32">
            <div>
              <div className="lab">Delivery</div>
              <p className="body mt10">CI/CD from GitHub, build, then SSH deploy to the AWS EC2 instance. iOS builds via EAS to TestFlight for pre-prod QA.</p>
            </div>
            <div>
              <div className="lab">Assistant</div>
              <p className="body mt10">{M.note}</p>
              <a className="tl mt14" href="/mobisoins-story.html">Read the MobiSoins story</a>
            </div>
          </div>
        </div>
        <div className="ac sr mt64">
          {ARCH_CARDS.map((c) => (
            <div key={c.t}><div className="nn m0">{c.t}</div><p className="ns mt10">{c.d}</p></div>
          ))}
        </div>
        <div className="tiles sr mt32">
          {(['expo', 'react', 'nestjs', 'postgresql', 'firebase', 'stripe', 'twilio', 'mapbox', 'aws', 'claude'] as const).map((key) => <Tile key={key} marks={[key]} />)}
        </div>
      </section>

      <section className="pad sec">
        <div className="sr pb40">
          <div className="lab">Eight more systems</div>
          <h2 className="h2 w900 mt14">Each with its full architecture, decisions and results.</h2>
        </div>
        <div className="pgrid">
          {SYSTEMS.map((system) => <ProjectCard key={system.id} system={system} />)}
        </div>
      </section>

      <footer className="pad pager toplined">
        <Link className="nl" to="/">← Home</Link>
        <Link className="nl big" to="/experience">Experience →</Link>
      </footer>
    </div>
  );
}
