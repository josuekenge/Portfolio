import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EDUCATION } from '../data/experience';
import { INTERNSHIPS, type Internship, type Workstream } from '../data/internships';
import { logo, matchLogos, type LogoKey } from '../data/logos';
import { toModel, type MapModel } from '../data/maps';
import { SYSTEMS, type Stat, type System } from '../data/systems';
import { splitLead } from '../lib/text';
import { useMediaQuery } from '../lib/useMediaQuery';
import { Figure } from '../motion/Figure';
import { Logo, ToolPills } from './Logos';
import { CompactMap, SystemMap } from './SystemMap';

export interface ResumeStep {
  key: string;
  job?: Internship;
  showHead: boolean;
  work?: Workstream;
  system?: System;
  model?: MapModel;
  no?: string;
  stats: Stat[];
  points: string[];
  tools: LogoKey[];
}

export function buildSteps(): ResumeStep[] {
  const steps: ResumeStep[] = [];
  INTERNSHIPS.forEach((job) => {
    job.workstreams.forEach((work, i) => {
      const system = work.system ? SYSTEMS.find((s) => s.id === work.system) : undefined;
      const model: MapModel | undefined = system ? { ...toModel(system), title: work.title } : work.rows && { id: `x-${work.id}`, title: work.title, frame: work.frame ?? '', rows: work.rows, labels: work.labels };
      steps.push({
        key: work.id,
        job,
        showHead: i === 0,
        work,
        system,
        model,
        no: String(i + 1).padStart(2, '0'),
        stats: (system ? system.out.slice(0, 4) : work.out) ?? [],
        points: [...work.steps, ...(system ? system.steps.slice(0, 4) : [])],
        tools: work.tools ?? (system ? matchLogos(system.tech).map((l) => l.key) : []),
      });
    });
  });
  steps.push({ key: 'carleton', showHead: false, stats: [], points: EDUCATION.bullets, tools: [] });
  return steps;
}

function Stats({ items }: { items: Stat[] }) {
  if (!items.length) return null;
  return (
    <div className="nums">
      {items.map(([v, l]) => (
        <div key={`${v}${l}`}><div className="nv">{v}</div><div className="nlb">{l}</div></div>
      ))}
    </div>
  );
}

function Points({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="qa">
      {items.map((text) => {
        const { lead, rest } = splitLead(text);
        return <li key={text}>{lead && <b>{lead} </b>}{rest}</li>;
      })}
    </ul>
  );
}

function CompanyHead({ job }: { job: Internship }) {
  return (
    <header className="chead" id={job.id}>
      <div>
        <div className="chl">
          <span className="lt"><Logo def={logo(job.mark)} /></span>
          <div>
            <h2 className="chn">{job.company}</h2>
            <div className="chr">{job.role}</div>
          </div>
        </div>
        <div className="lab mt12">{job.when} · {job.where}</div>
        <p className="cht">{job.thesis}</p>
        <div className="chstats">
          {job.stats.map(([v, l]) => (
            <div key={l}><div className="nv">{v}</div><div className="nlb">{l}</div></div>
          ))}
        </div>
      </div>
      <div className="chf"><Figure name={job.id} /></div>
    </header>
  );
}

const Step = memo(function Step({ step, index, active, stacked }: { step: ResumeStep; index: number; active: boolean; stacked: boolean }) {
  if (!step.work) {
    return (
      <article className={`step ${active ? 'on' : ''}`} id="carleton" data-step={index}>
        <header className="chead">
          <div>
            <div className="chl">
              <span className="lt"><Logo def={logo('carleton')} /></span>
              <div>
                <h2 className="chn">{EDUCATION.co}</h2>
                <div className="chr">{EDUCATION.role}</div>
              </div>
            </div>
            <div className="lab mt12">{EDUCATION.when} · {EDUCATION.loc}</div>
            <p className="cht">{EDUCATION.context}</p>
          </div>
          <div className="chf"><Figure name="carleton" /></div>
        </header>
        <Points items={step.points} />
      </article>
    );
  }
  const { work, system, job } = step;
  return (
    <article className={`step ${active ? 'on' : ''}`} data-step={index}>
      {step.showHead && job && <CompanyHead job={job} />}
      <div id={work.id}>
        <div className="lab">{job?.company} · {step.no}</div>
        <h3 className="stt">{work.title}</h3>
        <p className="stsub">{work.sub}</p>
        <p className="stb">{work.summary}</p>
      </div>
      <Stats items={step.stats} />
      <Points items={step.points} />
      {step.tools.length > 0 && <ToolPills tools={step.tools} />}
      {system && <Link className="tl mt8" to={`/systems/${system.id}`}>Read the full case study →</Link>}
      {stacked && step.model && <div className="inlinemap"><SystemMap model={step.model} /></div>}
    </article>
  );
});

const useIsStacked = () => useMediaQuery('(max-width: 860px)');

export function ExperienceScroll() {
  const steps = useMemo(buildSteps, []);
  const [active, setActive] = useState(0);
  const column = useRef<HTMLDivElement>(null);
  const stacked = useIsStacked();

  useEffect(() => {
    let queued = false;
    const pick = () => {
      queued = false;
      const nodes = column.current?.querySelectorAll<HTMLElement>('[data-step]');
      if (!nodes) return;
      const mid = window.innerHeight / 2;
      let best = 0;
      let gap = Infinity;
      nodes.forEach((n, i) => {
        const r = n.getBoundingClientRect();
        const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
        if (d < gap) {
          gap = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(pick);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    pick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="scrolly" aria-label="Experience in detail">
      <div ref={column}>
        {steps.map((step, i) => (
          <Step key={step.key} step={step} index={i} active={i === active} stacked={stacked} />
        ))}
      </div>
      {!stacked && (
        <aside className="pin" aria-label="Architecture of the section you are reading">
          {steps.map((step, i) =>
            Math.abs(i - active) <= 1 ? (
              step.model ? (
                <CompactMap key={step.key} model={step.model} active={i === active} />
              ) : (
                <div key={step.key} className={`pm ${i === active ? 'on' : 'off'}`} data-map="Carleton University">
                  <div className="pmh"><span>Carleton University</span><span className="lab">Months to graduation</span></div>
                  <div className="pms"><div className="pfig"><div className="sfig"><Figure name="carleton" /></div></div></div>
                </div>
              )
            ) : null,
          )}
        </aside>
      )}
    </section>
  );
}
