import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CapabilityDial, DIAL_INTERVAL_MS, shortestStep, type Capability } from '../components/CapabilityDial';

const ITEMS: Capability[] = [
  ['01', 'Brownfield', 'Body one', ['dotnet']],
  ['02', 'Agentic', 'Body two', ['claude']],
  ['03', 'Full-stack', 'Body three', ['nextdotjs']],
];

class FakeObserver {
  static last: FakeObserver;
  constructor(private cb: IntersectionObserverCallback) {
    FakeObserver.last = this;
  }
  observe() {}
  disconnect() {}
  show(isIntersecting: boolean) {
    this.cb([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

function setReducedMotion(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduce && query.includes('reduced-motion'),
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia;
}

function pointer(el: Element, type: string, clientX: number, clientY: number) {
  act(() => {
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX, clientY }));
  });
}

function swipe(el: Element, dx: number, dy = 0) {
  pointer(el, 'pointerdown', 200, 300);
  pointer(el, 'pointerup', 200 + dx, 300 + dy);
}

function mount() {
  const view = render(<CapabilityDial items={ITEMS} />);
  const q = (s: string) => view.container.querySelector(s)!;
  return { ...view, title: () => q('.dpi.on .ct').textContent, step: () => (q('.dial') as HTMLElement).style.getPropertyValue('--step'), surface: () => q('.dialw') };
}

const tick = () => act(() => void vi.advanceTimersByTime(DIAL_INTERVAL_MS));
const seen = (visible = true) => act(() => FakeObserver.last.show(visible));

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  setReducedMotion(false);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('shortestStep', () => {
  it('takes the short way round the ring', () => {
    expect(shortestStep(0, 1, 3)).toBe(1);
    expect(shortestStep(0, 2, 3)).toBe(-1);
    expect(shortestStep(2, 0, 3)).toBe(1);
    expect(shortestStep(1, 1, 3)).toBe(0);
  });
});

describe('auto rotation', () => {
  it('advances through every capability and wraps back to the first', () => {
    const d = mount();
    seen();
    expect(d.title()).toBe('Brownfield');
    tick();
    expect(d.title()).toBe('Agentic');
    tick();
    expect(d.title()).toBe('Full-stack');
    tick();
    expect(d.title()).toBe('Brownfield');
    expect(d.step()).toBe('3');
  });

  it('waits while the dial is off screen', () => {
    const d = mount();
    tick();
    expect(d.title()).toBe('Brownfield');
    seen();
    seen(false);
    tick();
    expect(d.title()).toBe('Brownfield');
  });

  it('never runs with reduced motion, and tapping still works', () => {
    setReducedMotion(true);
    const d = mount();
    seen();
    tick();
    expect(d.title()).toBe('Brownfield');
    fireEvent.click(screen.getByRole('button', { name: 'Show Agentic' }));
    expect(d.title()).toBe('Agentic');
  });

  it('leaves no timer running after unmount', () => {
    const d = mount();
    seen();
    d.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('touching the dial', () => {
  it('tapping a logo shows it and stops the rotation for good', () => {
    const d = mount();
    seen();
    fireEvent.click(screen.getByRole('button', { name: 'Show Agentic' }));
    expect(d.title()).toBe('Agentic');
    expect(screen.getByRole('button', { name: 'Show Agentic' }).getAttribute('aria-pressed')).toBe('true');
    tick();
    tick();
    expect(d.title()).toBe('Agentic');
  });

  it('rotates the short way when the far logo is tapped', () => {
    const d = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Show Full-stack' }));
    expect(d.title()).toBe('Full-stack');
    expect(d.step()).toBe('-1');
  });

  it('tapping the logo already shown changes nothing', () => {
    const d = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Show Brownfield' }));
    expect(d.step()).toBe('0');
  });

  it('swiping left goes forward and swiping right goes back, then stays put', () => {
    const d = mount();
    seen();
    swipe(d.surface(), -80);
    expect(d.title()).toBe('Agentic');
    swipe(d.surface(), 80);
    expect(d.title()).toBe('Brownfield');
    swipe(d.surface(), 80);
    expect(d.title()).toBe('Full-stack');
    tick();
    expect(d.title()).toBe('Full-stack');
  });

  it('ignores small drags and vertical scrolling, which keep it rotating', () => {
    const d = mount();
    seen();
    swipe(d.surface(), -20);
    swipe(d.surface(), -50, 200);
    expect(d.title()).toBe('Brownfield');
    tick();
    expect(d.title()).toBe('Agentic');
  });

  it('a swipe that starts and ends on a logo moves one step, not two', () => {
    const d = mount();
    const button = screen.getByRole('button', { name: 'Show Full-stack' });
    swipe(button, -80);
    fireEvent.click(button);
    expect(d.title()).toBe('Agentic');
    fireEvent.click(button);
    expect(d.title()).toBe('Full-stack');
  });

  it('a cancelled touch does nothing', () => {
    const d = mount();
    const surface = d.surface();
    pointer(surface, 'pointerdown', 200, 300);
    pointer(surface, 'pointercancel', 100, 300);
    pointer(surface, 'pointerup', 100, 300);
    expect(d.title()).toBe('Brownfield');
  });

  it('reading position stays with the text: only the active panel is exposed', () => {
    const d = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Show Agentic' }));
    const hidden = [...d.container.querySelectorAll('.dpi')].map((p) => p.getAttribute('aria-hidden'));
    expect(hidden).toEqual(['true', 'false', 'true']);
  });
});
