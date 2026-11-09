import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { logo, type LogoKey } from '../data/logos';
import { log, prefersReducedMotion } from '../lib/log';
import { Logo, Tile } from './Logos';

export type Capability = [no: string, title: string, body: string, marks: LogoKey[]];

export const DIAL_INTERVAL_MS = 4000;
const SWIPE_PX = 36;

const wrap = (value: number, count: number) => ((value % count) + count) % count;

/** Steps to turn from one position to another, going the short way round the ring. */
export function shortestStep(from: number, to: number, count: number) {
  const forward = wrap(to - from, count);
  return forward > count / 2 ? forward - count : forward;
}

/** Phone view of the capabilities: logos ride a ring, and the one at the top is shown below it. */
export function CapabilityDial({ items }: { items: Capability[] }) {
  const count = items.length;
  const root = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(() => !prefersReducedMotion());
  const active = wrap(step, count);

  useEffect(() => {
    log.info('dial', 'ready', { count, reducedMotion: prefersReducedMotion() });
  }, [count]);

  useEffect(() => {
    if (!auto) return;
    const hasObserver = typeof IntersectionObserver === 'function';
    if (!hasObserver) log.warn('dial', 'IntersectionObserver missing, rotating without a visibility check');
    let visible = !hasObserver;
    const io = hasObserver
      ? new IntersectionObserver((entries) => {
          visible = entries[entries.length - 1].isIntersecting;
        }, { threshold: 0.35 })
      : null;
    if (root.current) io?.observe(root.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setStep((s) => s + 1);
    }, DIAL_INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      io?.disconnect();
    };
  }, [auto]);

  const takeOver = (how: string) => {
    if (!auto) return;
    setAuto(false);
    log.info('dial', 'auto rotation stopped', { how });
  };

  const onDown = (e: PointerEvent) => {
    press.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };

  const onUp = (e: PointerEvent) => {
    if (!press.current) return;
    const dx = e.clientX - press.current.x;
    const dy = e.clientY - press.current.y;
    press.current = null;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
    swiped.current = true;
    takeOver('swipe');
    setStep((s) => s + (dx < 0 ? 1 : -1));
  };

  const onTap = (index: number) => {
    // A swipe that ends on a logo also fires a click, which must not move the ring again.
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    takeOver('tap');
    setStep((s) => s + shortestStep(wrap(s, count), index, count));
  };

  const unit = 360 / count;

  return (
    <div
      className="dialw"
      ref={root}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => {
        press.current = null;
      }}
    >
      <div className="dial" style={{ '--step': step, '--u': `${unit}deg` } as CSSProperties}>
        <div className="dring a" />
        <div className="dring b" />
        <div className="dcomet" />
        {items.map(([no], i) => (
          <div className={`dnum ${i === active ? 'on' : ''}`} key={no} aria-hidden="true">{no}</div>
        ))}
        <div className="drot">
          {items.map(([, title, , marks], i) => (
            <div className="dnd" key={title} style={{ '--a': `${i * unit}deg` } as CSSProperties}>
              <button
                type="button"
                className={`dbtn ${i === active ? 'on' : ''}`}
                aria-label={`Show ${title}`}
                aria-pressed={i === active}
                onClick={() => onTap(i)}
                onFocus={() => takeOver('focus')}
              >
                <Logo def={logo(marks[0])} decorative />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="dpan">
        {items.map(([, title, body, marks], i) => (
          <div className={`dpi ${i === active ? 'on' : ''}`} key={title} aria-hidden={i !== active}>
            <div>
              <div className="ct">{title}</div>
              <p className="cb">{body}</p>
            </div>
            <div className="tiles">{marks.map((m) => <Tile key={m} marks={[m]} />)}</div>
          </div>
        ))}
      </div>
      <div className="dseg" aria-hidden="true">
        {items.map(([no], i) => <i key={no} className={i === active ? 'on' : ''} />)}
      </div>
    </div>
  );
}
