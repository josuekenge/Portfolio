import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logo, type LogoKey } from '../data/logos';
import { Logo } from './Logos';
import { Orbit } from './Orbit';

const ROWS: { id: string; mark: LogoKey; size: string; name: string; role: string; when: string; highlight: string }[] = [
  { id: 'ibm', mark: 'ibm', size: 'sz-ibm', name: 'IBM', role: 'AI Engineer Intern, watsonx Workshop', when: 'May 2026 to present', highlight: 'AI agents and full-stack features for 35,000+ sellers: Demo Creator, Slack long-term memory, content generation and Grounded Decks.' },
  { id: 'jonas', mark: 'jonas', size: 'sz-jonas', name: 'Jonas Software', role: 'AI Engineer Intern', when: 'Jan to Apr 2026', highlight: 'GenAI inside live products across Constellation Software: $303K+ saved, 957 initiatives tracked, query time cut 20×.' },
  { id: 'microsoft', mark: 'microsoft', size: 'sz-ms', name: 'Microsoft', role: 'Software Engineering and PM Intern', when: 'Jun to Aug 2024', highlight: 'Office 365 substrate search: 25% better accuracy on a 1M+ corpus, 40% lower latency, about $14,500 a week saved.' },
  { id: 'carleton', mark: 'carleton', size: 'sz-cu', name: 'Carleton University', role: 'B.Sc. Computer Science', when: 'Expected December 2027', highlight: 'Studying alongside AI engineering internships and founder work on MobiSoins and Zerpha.' },
];

export function ExperienceOverview({ heading, linkAll = false }: { heading: 'h1' | 'h2'; linkAll?: boolean }) {
  const [focus, setFocus] = useState(-1);
  const Title = heading;
  return (
    <div className="xover">
      <div>
        <div className="lab">Experience</div>
        <Title className="h1 small-h1">The record</Title>
        <p className="xintro">Production AI at IBM, Jonas Software and Microsoft, alongside a Computer Science degree at Carleton.</p>
        <div className="xrows">
          {ROWS.map((row, i) => (
            <Link
              className="rr"
              key={row.id}
              to={`/experience#${row.id}`}
              onMouseEnter={() => setFocus(i)}
              onMouseLeave={() => setFocus(-1)}
              onFocus={() => setFocus(i)}
              onBlur={() => setFocus(-1)}
            >
              <span className={`rlogo ${row.size}`}><Logo def={logo(row.mark)} decorative /></span>
              <span><div className="rc">{row.name}</div><div className="rrole">{row.role}</div></span>
              <span className="lab xwhen">{row.when}</span>
              <span className="rhi">{row.highlight}</span>
            </Link>
          ))}
        </div>
        {linkAll && <Link className="btn round mt24" to="/experience">See the full record →</Link>}
      </div>
      <Orbit focus={focus} />
    </div>
  );
}
