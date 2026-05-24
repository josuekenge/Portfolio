// terminal.jsx
// Reusable typewriter terminal. Self-contained — no external deps.
// Respects prefers-reduced-motion.

const AGENT_TRACE = [
  '> $ josue --whoami',
  '',
  '  loading profile................. ✓',
  '  ├─ role:    AI Engineer @ Markham',
  '  ├─ shipped: 7 production systems',
  '  ├─ reach:   25,000+ users',
  '  └─ saved:   $303K+ in client value',
  '',
  '  > const next = await reachOut(you);',
  '',
  '  ✓ availability: open',
  '  ✓ response:     < 24h',
  "  ✓ ready: let's build →",
];

const FUN_TRACE = [
  '> $ josue --fun-stuff',
  '',
  '  class Josue(AIEngineer):',
  '      """ when not shipping code """',
  '',
  '      hobbies = {',
  "          'basketball': Hooper(level='obsessed'),",
  "          'anime':      Watcher(genre='shōnen'),",
  "          'reading':    Reader(formats=[",
  "              'light novels',",
  "              'manhwa',",
  "              'manga',",
  '          ]),',
  '      }',
  '',
  '  > josue.hobbies.now_playing()',
  '',
  '  ✓ basketball → pickup runs · weekends',
  '  ✓ anime      → Jujutsu Kaisen · Vinland Saga',
  '  ✓ reading    → Solo Leveling · Tower of God',
];

// Highlight ✓ ticks, arrows, and numeric tokens in accent blue.
const renderLine = (text) => {
  if (!text) return '\u00A0';
  const parts = [];
  let last = 0;
  const re = /(✓|→|\$?\d{1,3}(?:[,.]?\d+)*[a-zA-Z%+]*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      React.createElement('span', { key: m.index, style: { color: '#9bb4ff' } }, m[0])
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
  maxWidth = '720px',
  fontSize = 'clamp(13px, 1.2vw, 17px)',
}) => {
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
    <div className="relative w-full" style={{ maxWidth }}>
      {/* outer cobalt glow */}
      <div
        className="absolute inset-0 -z-10 rounded-3xl"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(59,109,255,0.4) 0%, rgba(59,109,255,0.14) 35%, transparent 70%)',
          filter: 'blur(48px)',
          transform: 'scale(1.2)',
        }}
      />

      {/* terminal pane */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: '#06080f',
          border: '1px solid rgba(96,165,250,0.15)',
          boxShadow:
            '0 30px 80px rgba(3,6,15,0.6), inset 0 1px 0 rgba(155,180,255,0.04)',
        }}
      >
        {/* top bar */}
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'rgba(96,165,250,0.1)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#5c2222' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#5c4a22' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22442c' }} />
          </div>
          <div
            className="font-mono text-[11px] tracking-wider"
            style={{ color: 'rgba(255,255,255,0.42)' }}
          >
            {label}
          </div>
        </div>

        {/* body */}
        <div
          className="px-7 py-7 font-mono whitespace-pre"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize,
            lineHeight: 1.65,
            minHeight,
          }}
        >
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            return (
              <div key={i}>
                {renderLine(line)}
                {isLast && !reducedMotion && (
                  <span style={{ opacity: cursor ? 1 : 0, color: '#9bb4ff' }}>▊</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Convenience wrapper used by the hero
const AgentTerminal = () => <Terminal trace={AGENT_TRACE} label="agent.session · live" />;

Object.assign(window, { Terminal, AgentTerminal, AGENT_TRACE, FUN_TRACE });
