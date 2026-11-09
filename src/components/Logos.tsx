import { logo, matchLogos, type LogoDef, type LogoKey } from '../data/logos';

function ratio(viewBox: string) {
  const [, , w, h] = viewBox.split(' ').map(Number);
  return w / h;
}

export function Logo({ def, decorative = false }: { def: LogoDef; decorative?: boolean }) {
  const label = decorative || !def.title ? undefined : def.title;
  return (
    <svg
      className={`logo ${def.line ? 'glyph' : ''}`}
      viewBox={def.viewBox}
      style={{ width: `${ratio(def.viewBox)}em` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: def.inner }}
    />
  );
}

export function LogoRow({ text, max, className = '' }: { text: string; max?: number; className?: string }) {
  const defs = matchLogos(text, max);
  if (!defs.length) return null;
  return (
    <span className={`logos ${className}`}>
      {defs.map((def) => (
        <Logo key={def.key} def={def} />
      ))}
    </span>
  );
}

export function Tile({ marks, color }: { marks: LogoKey[]; color?: string }) {
  const defs = marks.map(logo);
  return (
    <span className="tile" style={{ '--c': color ?? defs[0]?.color } as React.CSSProperties}>
      {defs.map((def) => (
        <Logo key={def.key} def={def} />
      ))}
    </span>
  );
}

export function ToolPills({ tools }: { tools: LogoKey[] }) {
  return (
    <div className="tools">
      {tools.map((key) => (
        <span className="tool" key={key}>
          <Logo def={logo(key)} decorative />
          {logo(key).title}
        </span>
      ))}
    </div>
  );
}
