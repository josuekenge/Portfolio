import { useEffect, useRef, useState, type RefObject } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import { LOGO_PATHS, LOGO_VIEWBOX } from '../lib/logo';
import { log, prefersReducedMotion } from '../lib/log';

export function Mark({ width = 28 }: { width?: number }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} width={width} height={Math.round((width * 675) / 785)} fill="currentColor" aria-hidden="true">
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function SiteLinks() {
  return (
    <div className="links">
      <Link className="nl" to="/experience">Experience</Link>
      <Link className="nl" to="/projects">Projects</Link>
      <Link className="nl" to="/#contact">Contact</Link>
    </div>
  );
}

export function TopNav() {
  return (
    <nav className="pad topnav" aria-label="Main">
      <Link className="nl brand" to="/">
        <Mark /> Josue Kenge
      </Link>
      <SiteLinks />
    </nav>
  );
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
    log.info('route', `viewing ${window.location.pathname}`);
  }, [title]);
}

/** Fades sections in as they enter the viewport; content stays visible if the observer is missing. */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver !== 'function' || prefersReducedMotion()) return;
    root.classList.add('arm');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: '0px 0px -6% 0px' },
    );
    root.querySelectorAll('.sr').forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [ref]);
}

export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const type = useNavigationType();
  useEffect(() => {
    if (hash) {
      let tries = 0;
      const seek = () => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView();
          // Font swap can move the page after the first jump, so land again once fonts settle.
          void document.fonts?.ready.then(() => {
            if (window.location.hash === hash) target.scrollIntoView();
          });
        }
        else if (tries++ < 300) requestAnimationFrame(seek); // lazy pages can take a few seconds on slow networks
        else log.warn('route', `no element for ${hash}`);
      };
      seek();
    } else if (type !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, type]);
  return null;
}

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      node.style.opacity = '1';
      node.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div ref={ref} className="cur" aria-hidden="true" />;
}

export function OttawaClock() {
  const [now, setNow] = useState('--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="lab hidem">Ottawa {now}</span>;
}
