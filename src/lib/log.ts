// Always-on client logging. Every entry goes to the console and to an in-memory
// ring buffer (window.__jkLogs) so a live session can be inspected after the fact.
export type LogLevel = 'info' | 'warn' | 'error';
export interface LogEntry {
  at: string;
  level: LogLevel;
  scope: string;
  message: string;
  detail?: unknown;
}

const MAX_ENTRIES = 500;
const buffer: LogEntry[] = [];

declare global {
  interface Window {
    __jkLogs?: LogEntry[];
  }
}

function write(level: LogLevel, scope: string, message: string, detail?: unknown) {
  const entry: LogEntry = { at: new Date().toISOString(), level, scope, message, detail };
  buffer.push(entry);
  if (buffer.length > MAX_ENTRIES) buffer.shift();
  const line = `[${scope}] ${message}`;
  if (detail === undefined) console[level](line);
  else console[level](line, detail);
}

export const log = {
  info: (scope: string, message: string, detail?: unknown) => write('info', scope, message, detail),
  warn: (scope: string, message: string, detail?: unknown) => write('warn', scope, message, detail),
  error: (scope: string, message: string, detail?: unknown) => write('error', scope, message, detail),
};

export function installGlobalLogging() {
  window.__jkLogs = buffer;
  window.addEventListener('error', (e) => log.error('window', e.message, e.error));
  window.addEventListener('unhandledrejection', (e) => log.error('promise', 'unhandled rejection', e.reason));
  log.info('app', 'started', {
    mode: import.meta.env.MODE,
    path: window.location.pathname,
    dpr: window.devicePixelRatio,
    reducedMotion: prefersReducedMotion(),
  });
}

export function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
