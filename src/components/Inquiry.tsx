import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent } from 'react';
import { BUDGETS, EMPTY_INQUIRY, PROJECT_TYPES, sendInquiry, TIMELINES, validateInquiry, type InquiryForm } from '../lib/inquiry';

const InquiryContext = createContext<() => void>(() => undefined);
export const useInquiry = () => useContext(InquiryContext);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return (
    <InquiryContext.Provider value={openModal}>
      {children}
      {open && <InquiryModal onClose={close} />}
    </InquiryContext.Provider>
  );
}

function Choice({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="lab flabel" htmlFor={id}>{label}</label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function InquiryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<InquiryForm>(EMPTY_INQUIRY);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const first = useRef<HTMLInputElement>(null);
  const sending = useRef(false);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    first.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus?.();
    };
  }, [onClose]);

  const set = (key: keyof InquiryForm) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending.current) return;
    const problem = validateInquiry(form);
    if (problem) {
      setError(problem);
      return;
    }
    sending.current = true;
    setError('');
    setStatus('sending');
    const result = await sendInquiry(form);
    sending.current = false;
    if (result.ok) {
      setStatus('success');
    } else {
      setStatus('idle');
      setError(result.error);
    }
  };

  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="inq-title">
        <button className="close" type="button" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
        {status === 'success' ? (
          <div>
            <h2 id="inq-title" className="h2 small">Message sent.</h2>
            <p className="body">Thanks, {form.name.trim().split(' ')[0]}. It's in my inbox, and I'll get back to you at {form.email.trim()} soon.</p>
            <button className="btn" type="button" onClick={onClose} style={{ marginTop: 24 }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="lab">Start a project</div>
            <h2 id="inq-title" className="h2 small" style={{ marginTop: 10 }}>Tell me what you want built.</h2>
            <input className="hp" type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.botcheck} onChange={(e) => set('botcheck')(e.target.value)} />
            <div className="fgrid">
              <div>
                <label className="lab flabel" htmlFor="pi-name">Name *</label>
                <input ref={first} id="pi-name" className="field" value={form.name} onChange={(e) => set('name')(e.target.value)} />
              </div>
              <div>
                <label className="lab flabel" htmlFor="pi-email">Email *</label>
                <input id="pi-email" className="field" type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} />
              </div>
              <Choice id="pi-type" label="What are we building?" value={form.type} options={PROJECT_TYPES} onChange={set('type')} />
              <div>
                <label className="lab flabel" htmlFor="pi-industry">Industry</label>
                <input id="pi-industry" className="field" value={form.industry} onChange={(e) => set('industry')(e.target.value)} />
              </div>
              <Choice id="pi-budget" label="Budget" value={form.budget} options={BUDGETS} onChange={set('budget')} />
              <Choice id="pi-timeline" label="Timeline" value={form.timeline} options={TIMELINES} onChange={set('timeline')} />
            </div>
            <label className="lab flabel" htmlFor="pi-msg" style={{ marginTop: 16 }}>What do you have in mind? *</label>
            <textarea id="pi-msg" className="field" rows={4} value={form.message} onChange={(e) => set('message')(e.target.value)} />
            {error && <p className="ferr" role="alert">{error}</p>}
            <button className="btn wide" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send inquiry'}</button>
            <p className="lab" style={{ textAlign: 'center', marginTop: 12 }}>Or email me directly: josuekenge4@gmail.com</p>
          </form>
        )}
      </div>
    </div>
  );
}
