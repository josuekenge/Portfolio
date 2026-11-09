import { log } from './log';

// Public Web3Forms access key: it only allows sending to the site owner's inbox.
export const WEB3FORMS_ACCESS_KEY = '9006bcee-99d5-46da-a095-92e8b092709d';
export const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export const PROJECT_TYPES = ['Mobile app', 'Web app', 'AI feature / integration', 'Something else'];
export const BUDGETS = ['Under $1k', '$1k – $5k', '$5k – $10k', '$10k+', 'Not sure yet'];
export const TIMELINES = ['ASAP', '2–4 weeks', '1–2 months', 'Flexible / not sure'];

export interface InquiryForm {
  name: string;
  email: string;
  type: string;
  industry: string;
  budget: string;
  timeline: string;
  message: string;
  botcheck: string;
}

export const EMPTY_INQUIRY: InquiryForm = { name: '', email: '', type: '', industry: '', budget: '', timeline: '', message: '', botcheck: '' };

export function validateInquiry(form: InquiryForm): string | null {
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return 'Please add your name, email, and a short note.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "That email doesn't look right. Mind double-checking it?";
  return null;
}

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendInquiry(form: InquiryForm, fetchImpl: typeof fetch = fetch): Promise<SendResult> {
  if (form.botcheck) {
    log.warn('inquiry', 'honeypot tripped, dropped silently');
    return { ok: true };
  }
  log.info('inquiry', 'sending');
  try {
    const res = await fetchImpl(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        botcheck: form.botcheck,
        subject: `New project inquiry — ${form.name.trim()}`,
        from_name: 'josue.fun · project form',
        replyto: form.email.trim(),
        Name: form.name.trim(),
        Email: form.email.trim(),
        'Project type': form.type || '—',
        Industry: form.industry || '—',
        Budget: form.budget || '—',
        Timeline: form.timeline || '—',
        Details: form.message.trim(),
      }),
    });
    const data = (await res.json()) as { success?: boolean; message?: string };
    if (data.success) {
      log.info('inquiry', 'delivered');
      return { ok: true };
    }
    log.error('inquiry', 'rejected by provider', { status: res.status, message: data.message });
    return { ok: false, error: data.message || 'Something went wrong. Please email me directly.' };
  } catch (err) {
    log.error('inquiry', 'network failure', err);
    return { ok: false, error: 'Network error. Please email me directly at josuekenge4@gmail.com.' };
  }
}
