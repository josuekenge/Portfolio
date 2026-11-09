import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InquiryModal } from '../components/Inquiry';
import { EMPTY_INQUIRY, sendInquiry, validateInquiry, WEB3FORMS_URL } from '../lib/inquiry';

const good = { ...EMPTY_INQUIRY, name: ' Jane Doe ', email: ' jane@co.com ', message: ' Build a thing ' };
const respond = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }));

describe('validateInquiry', () => {
  it('accepts a complete form', () => expect(validateInquiry(good)).toBeNull());
  it.each([
    ['name', { ...good, name: '  ' }],
    ['email', { ...good, email: '' }],
    ['message', { ...good, message: '\n' }],
  ])('rejects a blank %s', (_f, form) => expect(validateInquiry(form)).toMatch(/name, email/));
  it.each(['nope', 'a@b', 'a b@c.com', '@c.com'])('rejects malformed email %s', (email) => {
    expect(validateInquiry({ ...good, email })).toMatch(/doesn't look right/);
  });
});

describe('sendInquiry', () => {
  it('posts the trimmed form to Web3Forms and reports success', async () => {
    const f = vi.fn(() => respond({ success: true })) as unknown as typeof fetch;
    await expect(sendInquiry(good, f)).resolves.toEqual({ ok: true });
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe(WEB3FORMS_URL);
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ Name: 'Jane Doe', Email: 'jane@co.com', replyto: 'jane@co.com', Details: 'Build a thing', Budget: '—' });
    expect(body.access_key).toBeTruthy();
  });
  it('surfaces a provider rejection', async () => {
    const f = vi.fn(() => respond({ success: false, message: 'Bad key' }, 400)) as unknown as typeof fetch;
    await expect(sendInquiry(good, f)).resolves.toEqual({ ok: false, error: 'Bad key' });
  });
  it('has a fallback message when the provider gives none', async () => {
    const f = vi.fn(() => respond({ success: false })) as unknown as typeof fetch;
    await expect(sendInquiry(good, f)).resolves.toMatchObject({ ok: false, error: expect.stringContaining('email me') });
  });
  it('handles a network failure', async () => {
    const f = vi.fn(() => Promise.reject(new Error('offline'))) as unknown as typeof fetch;
    await expect(sendInquiry(good, f)).resolves.toMatchObject({ ok: false, error: expect.stringContaining('Network error') });
  });
  it('handles a response that is not JSON', async () => {
    const f = vi.fn(() => Promise.resolve(new Response('<html>403</html>', { status: 403 }))) as unknown as typeof fetch;
    await expect(sendInquiry(good, f)).resolves.toMatchObject({ ok: false });
  });
  it('drops honeypot submissions without any network call', async () => {
    const f = vi.fn() as unknown as typeof fetch;
    await expect(sendInquiry({ ...good, botcheck: 'x' }, f)).resolves.toEqual({ ok: true });
    expect(f).not.toHaveBeenCalled();
  });
});

describe('InquiryModal', () => {
  const fill = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Name *'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email *'), 'jane@co.com');
    await user.type(screen.getByLabelText('What do you have in mind? *'), 'Build it');
  };

  it('blocks an empty submit and sends nothing', async () => {
    const f = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();
    render(<InquiryModal onClose={() => undefined} />);
    await user.click(screen.getByRole('button', { name: 'Send inquiry' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/name, email/);
    expect(f).not.toHaveBeenCalled();
  });

  it('shows confirmation after a successful send', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => respond({ success: true }));
    const user = userEvent.setup();
    render(<InquiryModal onClose={() => undefined} />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send inquiry' }));
    expect(await screen.findByText('Message sent.')).toBeInTheDocument();
    expect(screen.getByText(/Thanks, Jane/)).toBeInTheDocument();
  });

  it('keeps what the visitor typed when sending fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject(new Error('offline')));
    const user = userEvent.setup();
    render(<InquiryModal onClose={() => undefined} />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Send inquiry' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Network error/);
    expect(screen.getByLabelText('What do you have in mind? *')).toHaveValue('Build it');
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeEnabled();
  });

  it('sends only once on a double submit', async () => {
    let finish: (r: Response) => void = () => undefined;
    const f = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise((r) => (finish = r)));
    const user = userEvent.setup();
    render(<InquiryModal onClose={() => undefined} />);
    await fill(user);
    const form = screen.getByRole('button', { name: 'Send inquiry' }).closest('form') as HTMLFormElement;
    form.requestSubmit();
    form.requestSubmit();
    await waitFor(() => expect(f).toHaveBeenCalledTimes(1));
    finish(new Response(JSON.stringify({ success: true })));
    expect(await screen.findByText('Message sent.')).toBeInTheDocument();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<InquiryModal onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
