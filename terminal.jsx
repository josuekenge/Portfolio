// terminal.jsx
// Reusable typewriter terminal. Self-contained — no external deps.
// Respects prefers-reduced-motion.

const AGENT_TRACE = [
  '> $ josue --whoami',
  '',
  '  loading profile................. ✓',
  '  ├─ role:    AI Engineer · Ottawa',
  '  ├─ shipped: 7 production systems',
  '  ├─ reach:   35,000+ users',
  '  └─ saved:   $303K+ in client value',
  '',
  '  > const next = await reachOut(you);',
  '',
  '  ✓ availability: open',
  '  ✓ response:     < 24h',
  "  ✓ ready: let's build →",
];

const FUN_TRACE = [
  '> $ josue --fun',
  '',
  '  class Josue:',
  '    # off the clock',
  '',
  '    hobbies = {',
  "      'ball':  'weekends',",
  "      'anime': 'shōnen',",
  "      'read':  'novels',",
  '    }',
  '',
  '  ✓ hooping → pickup runs',
  '  ✓ anime   → JJK',
  '  ✓ reading → Solo Leveling',
];

// Two palettes so the terminal can render dark (hero) or light (about),
// both tuned to the warm cream / ink / moss brand system.
const PALETTES = {
  light: { pane: '#FCFBF7', border: '#E5E1D6', bar: '#EDEAE1', label: '#989487',
    text: '#3C3A33', dotOff: '#D8D3C6', tick: '#4C9E68', num: '#3A43D6', cursor: '#3A43D6', shadow: '0 20px 50px rgba(27,26,22,0.07)' },
  dark: { pane: 'linear-gradient(180deg,#242017 0%,#1a1712 100%)', border: 'rgba(236,231,216,0.12)', bar: 'rgba(236,231,216,0.08)', label: 'rgba(236,231,216,0.5)',
    text: 'rgba(236,231,216,0.86)', dotOff: '#48453a', tick: '#7CC39A', num: '#A6ACF2', cursor: '#A6ACF2', shadow: '0 34px 80px rgba(27,26,22,0.35)' },
};

// Highlight tick, arrow, and numeric tokens in accent colors.
const renderLine = (text, pal) => {
  if (!text) return '\u00A0';
  const parts = [];
  let last = 0;
  const re = /(✓|→|\$?\d{1,3}(?:[,.]?\d+)*[a-zA-Z%+]*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    const color = (tok === '✓' || tok === '→') ? pal.tick : pal.num;
    parts.push(
      React.createElement('span', { key: m.index, style: { color } }, tok)
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const Terminal = ({
  trace,
  label = 'session · live',
  minHeight = '420px',
  height,
  maxWidth = '720px',
  fontSize = 'clamp(11px, 2.6vw, 17px)',
  dark = false,
}) => {
  const pal = dark ? PALETTES.dark : PALETTES.light;
  const [lines, setLines] = React.useState([]);
  const [cursor, setCursor] = React.useState(true);
  const reducedMotion = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  // Typewriter loop
  React.useEffect(() => {
    if (reducedMotion) {
      setLines(trace);
      return;
    }
    let cancelled = false;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const run = async () => {
      while (!cancelled) {
        setLines([]);
        for (let i = 0; i < trace.length; i++) {
          const full = trace[i];
          if (full === '') {
            if (cancelled) return;
            setLines((prev) => [...prev, '']);
            await sleep(120);
            continue;
          }
          for (let j = 1; j <= full.length; j++) {
            if (cancelled) return;
            setLines((prev) => {
              const next = [...prev];
              next[i] = full.slice(0, j);
              return next;
            });
            await sleep(20 + Math.random() * 8);
          }
          await sleep(220);
        }
        await sleep(2400);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [trace, reducedMotion]);

  // Cursor blink ~1Hz
  React.useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setCursor((v) => !v), 520);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="relative w-full mx-auto" style={{ maxWidth }}>
      {/* terminal pane */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: pal.pane,
          border: `1px solid ${pal.border}`,
          boxShadow: pal.shadow,
        }}
      >
        {/* top bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: pal.bar }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: pal.dotOff }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: pal.dotOff }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: pal.tick }} />
          </div>
          <div
            className="font-mono text-[11px] tracking-wider"
            style={{ color: pal.label }}
          >
            {label}
          </div>
        </div>

        {/* body — horizontal scroll on small screens so long pre lines don't blow out layout */}
        <div
          className="terminal-body px-4 sm:px-7 py-5 sm:py-7 font-mono whitespace-pre"
          style={{
            color: pal.text,
            fontSize,
            lineHeight: 1.6,
            // Fixed height reserves space so the box never expands while typing.
            ...(height ? { height, overflowY: 'hidden' } : { minHeight }),
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            return (
              <div key={i}>
                {renderLine(line, pal)}
                {isLast && !reducedMotion && (
                  <span style={{ opacity: cursor ? 1 : 0, color: pal.cursor }}>▊</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Convenience wrapper used by the hero — dark variant to match the reference.
const AgentTerminal = () => <Terminal trace={AGENT_TRACE} label="agent.session · live" dark minHeight="360px" />;

Object.assign(window, { Terminal, AgentTerminal, AGENT_TRACE, FUN_TRACE });
