import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tile } from '../components/Logos';
import { TopNav, usePageTitle, useReveal, Mark } from '../components/Shell';
import { SystemMap } from '../components/SystemMap';
import { matchLogos } from '../data/logos';
import { COMPANY, EXTRAS, toModel } from '../data/maps';
import { SYSTEMS, type System } from '../data/systems';
import { splitLead } from '../lib/text';
import { Figure } from '../motion/Figure';

function Outcomes({ system }: { system: System }) {
  const heroIndex = EXTRAS[system.id]?.heroStat ?? 0;
  const hero = system.out[heroIndex];
  const rest = system.out.filter((_, i) => i !== heroIndex);
  return (
    <div className="bento sr">
      <div className="btile bhero">
        {system.id === 'decks' && <div className="cells" aria-hidden="true" />}
        <div className="bv bhv">{hero[0]}</div>
        <div className="btl large">{hero[1]}</div>
      </div>
      {rest.map(([v, l]) => (
        <div className="btile" key={`${v}${l}`}>
          <div className="bv">{v}</div>
          <div className="btl">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Tools({ system }: { system: System }) {
  const tools = matchLogos(`${system.tech} ${system.stack.map(([, v]) => v).join(' ')}`);
  if (!tools.length) return null;
  return (
    <div className="stk sr">
      {tools.map((tool) => (
        <div key={tool.key}><Tile marks={[tool.key]} />{tool.title}</div>
      ))}
    </div>
  );
}

export function SystemPage({ system }: { system: System }) {
  usePageTitle(`${system.title} | Josue Kenge`);
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  const index = SYSTEMS.indexOf(system);
  const next = SYSTEMS[(index + 1) % SYSTEMS.length];
  const prev = SYSTEMS[(index - 1 + SYSTEMS.length) % SYSTEMS.length];
  const company = COMPANY[system.id];
  const model = useMemo(() => toModel(system), [system]);

  return (
    <div ref={root} className="root">
      <TopNav />
      <article id={system.id}>
        <header className="pad syshead">
          <div>
            <div className="sysmeta">
              {company ? <Tile marks={[company]} /> : <span className="tile founder"><Mark width={26} /></span>}
              <span className="lab">{system.n} · {system.tag}<br />{system.role}</span>
            </div>
            <h1 className="systitle">{system.title}</h1>
            <p className="syssub">{system.sub}</p>
            <p className="sum">{system.summary}</p>
            {system.link && <a className="tl mt8" href={system.link} target="_blank" rel="noreferrer">{system.linkText}</a>}
          </div>
          <div className="sfig"><Figure name={system.id} /></div>
        </header>

        <section className="pad"><SystemMap model={model} /></section>

        <section className="pad secm">
          <div className="lab shead">Outcomes</div>
          <Outcomes system={system} />
        </section>

        {system.find && (
          <section className="pad secs">
            <div className="term sr">
              <div className="termh"><span className="lab">investigation.log</span><span className="lab">before the change</span></div>
              {system.find.map(([v, l]) => (
                <div className="tlog" key={`${v}${l}`}><span className="warn">WARN</span><span>{v}</span><span>{l}</span></div>
              ))}
            </div>
          </section>
        )}

        <section className="pad secm">
          <div className="lab shead">Decision log</div>
          {system.steps.map((step, i) => {
            const { lead, rest } = splitLead(step);
            const no = String(i + 1).padStart(2, '0');
            return lead ? (
              <div className="dec sr" key={i}><span className="lab">{no}</span><div className="dq">{lead.replace(/:$/, '')}</div><p className="da">{rest}</p></div>
            ) : (
              <div className="dec plain sr" key={i}><span className="lab">{no}</span><p className="dp">{rest}</p></div>
            );
          })}
        </section>

        <section className="pad secm">
          <div className="lab shead">Built with</div>
          <Tools system={system} />
          <div className="stable sr">
            {system.stack.map(([k, v]) => (
              <div className="st" key={k}><span className="lab">{k}</span><span>{v}</span></div>
            ))}
          </div>
          {system.quote && <blockquote className="qt sr">{system.quote}</blockquote>}
        </section>
      </article>
      <footer className="pad pager toplined">
        <Link className="nl" to={`/systems/${prev.id}`}>← {prev.title}</Link>
        <Link className="nl big" to={`/systems/${next.id}`}>{next.title} →</Link>
      </footer>
    </div>
  );
}
