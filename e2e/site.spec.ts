import { expect, test, type Page } from '@playwright/test';

const SYSTEMS = ['decks', 'wes', 'aiqsr', 'ma', 'computrition', 'zerpha', 'ulife', 'minisoft'];

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/fonts\.g|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

async function expectNoSidewaysScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

const paintedFigures = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLCanvasElement>('canvas.fig')].filter((c) => {
      if (c.clientWidth === 0) return true; // hidden thumbnails on phones
      const ctx = c.getContext('2d');
      if (!ctx || !c.width) return false;
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) return true;
      return false;
    }).length,
  );

const figureCount = (page: Page) => page.locator('canvas.fig').count();

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, 0);
  });
}

test('home shows the hero and the whole story, with no errors', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Production AI');
  await expect(page.locator('.bodyo')).toHaveCount(4);
  await expect(page.locator('.pcard')).toHaveCount(0);
  await page.waitForTimeout(800);
  await expectNoSidewaysScroll(page);
  expect(errors).toEqual([]);
});

test('the hero mark is always visible: live metal or the vector fallback', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1500);
  const state = await page.evaluate(() => ({
    gl: !document.querySelector('canvas.gl')?.classList.contains('gl-off'),
    svg: getComputedStyle(document.querySelector('svg.fall')!).display !== 'none',
    logs: (window.__jkLogs ?? []).filter((l) => l.scope === 'liquid').map((l) => l.message),
  }));
  expect(state.gl || state.svg, JSON.stringify(state)).toBe(true);
  expect(state.gl && state.svg).toBe(false);
});

test('content is revealed after scrolling through the page', async ({ page }) => {
  await page.goto('/');
  await scrollThrough(page);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('.sr:not(.on)')].length);
  expect(hidden).toBe(0);
});

for (const slug of SYSTEMS) {
  test(`system page ${slug}: deep link, diagram, motion, logos`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`/systems/${slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.map .node').first()).toBeAttached();
    await page.locator('canvas.fig').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(await paintedFigures(page)).toBe(await figureCount(page));
    expect(await figureCount(page)).toBe(1);
    await expect(page.locator('.logo').first()).toBeAttached();
    await expectNoSidewaysScroll(page);
    expect(errors).toEqual([]);
  });
}

test('project figures stay idle off-screen, then paint when scrolled into view', async ({ page }) => {
  await page.goto('/projects');
  await page.waitForTimeout(600);
  expect(await figureCount(page)).toBe(9);
  expect(await paintedFigures(page)).toBeLessThan(9);
  await scrollThrough(page);
  expect(await paintedFigures(page)).toBe(9);
});

test('experience shows every employer, with no errors', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/experience');
  for (const name of ['IBM', 'Jonas Software', 'Microsoft', 'Carleton University']) {
    await expect(page.locator('.chn', { hasText: name })).toBeAttached();
  }
  await expect(page.locator('[data-step]')).toHaveCount(16);
  await expectNoSidewaysScroll(page);
  expect(errors).toEqual([]);
});

test('navigation: top bar reaches projects, a project opens, next moves on, back returns', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await page.locator('#decks').getByRole('link', { name: /Full architecture/ }).click();
  await expect(page).toHaveURL(/\/systems\/decks$/);
  await page.getByRole('link', { name: 'Wes Chatbot →' }).first().click();
  await expect(page).toHaveURL(/\/systems\/wes$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Wes Chatbot');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Grounded Decks');
});

test('hash links land on their section', async ({ page }) => {
  await page.goto('/projects#mobisoins');
  await expect(page.locator('#mobisoins')).toBeAttached();
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('mobisoins')!.getBoundingClientRect().top))).toBeLessThan(5);
});

test('unknown routes and unknown systems show the not-found page', async ({ page }) => {
  for (const path of ['/nope', '/systems/not-a-system']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: "This page didn't ship." })).toBeVisible();
  }
});

test('the MobiSoins story page still exists and has its assets', async ({ page, request }) => {
  await page.goto('/mobisoins-story.html');
  await expect(page).toHaveTitle(/MobiSoins/);
  expect((await request.get('/assets/mobisoins-logo.png')).status()).toBe(200);
  expect((await request.get('/assets/josue-headshot.png')).status()).toBe(200);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no preloader, figures hold their finished state, content visible', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForTimeout(500);
    const orbit = await page.locator('.bodyo').first().evaluate((el) => (el as HTMLElement).style.transform);
    expect(orbit).toContain('translate3d');
    expect(await page.evaluate(() => document.querySelector('.arm') === null)).toBe(true);
    expect(errors).toEqual([]);
  });
});

test.describe('inquiry form (provider mocked, nothing is really sent)', () => {
  const open = async (page: Page) => {
    await page.goto('/');
    await page.locator('#freelance').getByRole('button', { name: 'Start a project' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  };
  const fill = async (page: Page) => {
    await page.getByLabel('Name *').fill('Jane Doe');
    await page.getByLabel('Email *').fill('jane@co.com');
    await page.getByLabel('What do you have in mind? *').fill('Build it');
  };

  test('success', async ({ page }) => {
    let calls = 0;
    await page.route('https://api.web3forms.com/submit', (r) => {
      calls++;
      return r.fulfill({ json: { success: true } });
    });
    await open(page);
    await fill(page);
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.getByText('Message sent.')).toBeVisible();
    expect(calls).toBe(1);
  });

  test('provider failure keeps the message and shows why', async ({ page }) => {
    await page.route('https://api.web3forms.com/submit', (r) => r.fulfill({ status: 400, json: { success: false, message: 'Bad key' } }));
    await open(page);
    await fill(page);
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.getByRole('alert')).toHaveText('Bad key');
    await expect(page.getByLabel('What do you have in mind? *')).toHaveValue('Build it');
  });

  test('network failure tells the visitor to email', async ({ page }) => {
    await page.route('https://api.web3forms.com/submit', (r) => r.abort());
    await open(page);
    await fill(page);
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.getByRole('alert')).toContainText('Network error');
  });
});

test('every system map draws connected wires and real marks', async ({ page }, info) => {
  const compact = /android|iphone/.test(info.project.name);
  for (const slug of SYSTEMS) {
    await page.goto(`/systems/${slug}`);
    await expect(page.locator('.map .node').first()).toBeAttached();
    await page.waitForTimeout(120);
    const result = await page.evaluate(() => {
      const stage = document.querySelector('.mstage')!;
      const s = stage.getBoundingClientRect();
      const boxes = [...stage.querySelectorAll('.node')].map((n) => n.getBoundingClientRect());
      const wires = [...stage.querySelectorAll('path.w')].map((p) => p.getAttribute('d')!);
      const near = (x: number, y: number) => boxes.some((b) => x >= b.left - s.left - 2 && x <= b.right - s.left + 2 && Math.min(Math.abs(y - (b.top - s.top)), Math.abs(y - (b.bottom - s.top))) < 3);
      const bad = wires.filter((d) => {
        const n = d.match(/-?\d+\.?\d*/g)!.map(Number);
        return !near(n[0], n[1]) || !near(n[n.length - 2], n[n.length - 1]);
      });
      return { wires: wires.length, nodes: boxes.length, bad: bad.length, emptyTiles: [...stage.querySelectorAll('.tile')].filter((t) => !t.querySelector('svg')).length };
    });
    expect(result.nodes, slug).toBeGreaterThanOrEqual(4);
    expect(result.wires, slug).toBeGreaterThanOrEqual(compact ? 3 : result.nodes - 2);
    expect(result.bad, slug).toBe(0);
    expect(result.emptyTiles, slug).toBe(0);
  }
});

test('hero shows where the work happened, on every screen size', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.heroleft:visible, .heroleft-m:visible');
  await expect(hero).toHaveCount(1);
  await expect(hero).toContainText('Now shipping at IBM watsonx');
  await expect(hero.getByRole('img', { name: 'IBM' })).toBeVisible();
  await expect(hero.getByRole('img', { name: 'Jonas Software' })).toBeVisible();
  await hero.getByRole('link', { name: 'Explore the projects' }).click();
  await expect(page).toHaveURL(/\/projects$/);
});

test('hero block does not collide with the headline', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(400);
  const gap = await page.evaluate(() => {
    const left = document.querySelector('.heroleft');
    if (!left || getComputedStyle(left).display === 'none') return 999;
    return document.querySelector('.h1')!.getBoundingClientRect().top - left.getBoundingClientRect().bottom;
  });
  expect(gap).toBeGreaterThan(0);
});

test('MobiSoins map is complete on the home page', async ({ page }, info) => {
  await page.goto('/projects#mobisoins');
  const map = page.locator('figure[aria-label="MobiSoins system map"]');
  await expect(map.locator('.node')).toHaveCount(10);
  if (!/android|iphone/.test(info.project.name)) await expect(map.locator('path.w')).toHaveCount(10);
});


test('the grounding band label never sits on top of a tier label', async ({ page }) => {
  await page.goto('/systems/decks');
  await expect(page.locator('.mbandl')).toBeAttached();
  await page.waitForTimeout(200);
  const overlaps = await page.evaluate(() => {
    const label = document.querySelector('.mbandl')!.getBoundingClientRect();
    return [...document.querySelectorAll('.mtier')].filter((t) => {
      const r = t.getBoundingClientRect();
      return r.left < label.right && r.right > label.left && r.top < label.bottom && r.bottom > label.top;
    }).length;
  });
  expect(overlaps).toBe(0);
});




test('orbit moves smoothly and never leaves its stage', async ({ page }) => {
  await page.goto('/');
  await page.locator('.orb').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const samples = await page.evaluate(async () => {
    const stage = document.querySelector('.orb')!;
    const body = document.querySelector('.bodyo') as HTMLElement;
    const out: { clipped: boolean; x: number; y: number; t: number }[] = [];
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const s = stage.getBoundingClientRect();
      const clipped = [...stage.querySelectorAll('.bodyo')].some((b) => {
        const r = b.getBoundingClientRect();
        return r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1;
      });
      const m = new DOMMatrix(getComputedStyle(body).transform);
      out.push({ clipped, x: m.m41, y: m.m42, t: performance.now() });
    }
    return out;
  });
  expect(samples.filter((s) => s.clipped)).toHaveLength(0);
  const moved = Math.hypot(samples[39].x - samples[0].x, samples[39].y - samples[0].y);
  expect(moved).toBeGreaterThan(0.5);
  for (let i = 1; i < samples.length; i++) {
    const step = Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y);
    const dt = Math.max(1, samples[i].t - samples[i - 1].t);
    expect(step / dt).toBeLessThan(0.3);
  }
});

test('clicking an orbiting company jumps to that job', async ({ page }) => {
  await page.goto('/');
  await page.locator('.orb').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'Microsoft experience' }).click({ force: true });
  await expect(page).toHaveURL(/\/experience#microsoft$/);
  await expect(page.locator('#microsoft')).toBeAttached();
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('microsoft')!.getBoundingClientRect().top))).toBeLessThan(60);
});

test('old links keep working', async ({ page }) => {
  await page.goto('/record');
  await expect(page).toHaveURL(/\/experience$/);
  await page.goto('/experience/ibm');
  await expect(page).toHaveURL(/\/experience#ibm$/);
});

test.describe('experience scroll on desktop', () => {
  test('the pinned diagram always matches the text being read, for every section', async ({ page }, info) => {
    test.skip(/android|iphone/.test(info.project.name), 'phones show the diagram inline');
    test.slow();
    await page.goto('/experience');
    await expect(page.locator('[data-step]')).toHaveCount(16);
    const count = await page.locator('[data-step]').count();
    expect(count).toBe(16);
    for (let i = 0; i < count; i++) {
      await page.evaluate((n) => {
        const el = document.querySelector(`[data-step="${n}"]`)!;
        const r = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
      }, i);
      await expect(page.locator(`[data-step="${i}"]`)).toHaveClass(/\bon\b/);
      const heading = page.locator(`[data-step="${i}"] .stt`);
      const title = await ((await heading.count()) ? heading : page.locator(`[data-step="${i}"] .chn`)).first().innerText();
      const shown = await page.locator('.pm.on').getAttribute('data-map');
      expect(shown).toBe(title);
      await expect(page.locator('.step.on')).toHaveCount(1);
      await expect(page.locator('.pm.on')).toHaveCount(1);
    }
  });

  test('pinned panel really stays put while the text scrolls, and its map is connected', async ({ page }, info) => {
    test.skip(/android|iphone/.test(info.project.name), 'phones show the diagram inline');
    await page.goto('/experience');
    await expect(page.locator('[data-step]')).toHaveCount(16);
    await page.evaluate(() => {
      const el = document.querySelector('[data-step="1"]')!;
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + 40);
    });
    await page.waitForTimeout(250);
    const top1 = await page.locator('.pin').evaluate((e) => e.getBoundingClientRect().top);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(250);
    const top2 = await page.locator('.pin').evaluate((e) => e.getBoundingClientRect().top);
    expect(Math.abs(top1 - top2)).toBeLessThan(2);
    const check = await page.locator('.pm.on .pms').evaluate((stage) => {
      const s = stage.getBoundingClientRect();
      const boxes = [...stage.querySelectorAll('.pn')].map((n) => n.getBoundingClientRect());
      const wires = [...stage.querySelectorAll('path.w')].map((p) => p.getAttribute('d')!);
      const near = (x: number, y: number) => boxes.some((b) => x >= b.left - s.left - 2 && x <= b.right - s.left + 2 && Math.min(Math.abs(y - (b.top - s.top)), Math.abs(y - (b.bottom - s.top))) < 3);
      return { wires: wires.length, bad: wires.filter((d) => { const n = d.match(/-?\d+\.?\d*/g)!.map(Number); return !near(n[0], n[1]) || !near(n[n.length - 2], n[n.length - 1]); }).length, over: boxes.some((b) => b.bottom > s.bottom + 1 || b.top < s.top - 1) };
    });
    expect(check.wires).toBeGreaterThan(2);
    expect(check.bad).toBe(0);
    expect(check.over).toBe(false);
  });
});

test('every diagram fits the pinned panel at laptop height', async ({ page }, info) => {
  test.skip(/android|iphone/.test(info.project.name), 'phones show the diagram inline');
  test.slow();
  await page.setViewportSize({ width: 1366, height: 680 });
  await page.goto('/experience');
  await expect(page.locator('[data-step]')).toHaveCount(16);
  const count = await page.locator('[data-step]').count();
  for (let i = 0; i < count; i++) {
    await page.evaluate((n) => {
      const el = document.querySelector(`[data-step="${n}"]`)!;
      const r = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
    }, i);
    await expect(page.locator(`[data-step="${i}"]`)).toHaveClass(/\bon\b/);
    const over = await page.locator('.pm.on .pms').evaluate((stage) => {
      const s = stage.getBoundingClientRect();
      return [...stage.querySelectorAll('.pn')].some((b) => { const r = b.getBoundingClientRect(); return r.bottom > s.bottom + 1 || r.top < s.top - 1; });
    });
    expect(over, `section ${i}`).toBe(false);
  }
});

test('phones show each diagram inline under its text', async ({ page }, info) => {
  test.skip(!/android|iphone/.test(info.project.name), 'desktop pins the diagram');
  await page.goto('/experience');
  await expect(page.locator('.pin')).toHaveCount(0);
  await expect(page.locator('.inlinemap .map')).toHaveCount(15);
  await expectNoSidewaysScroll(page);
});

test('projects page shows everything, expanded', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/projects');
  await expect(page.locator('.pcard')).toHaveCount(8);
  await expect(page.locator('figure[aria-label="MobiSoins system map"] .node')).toHaveCount(10);
  await expect(page.locator('#decks .pct')).toHaveText('Grounded Decks');
  await expectNoSidewaysScroll(page);
  expect(errors).toEqual([]);
});

test('home is compact: far shorter than the expanded pages', async ({ page }) => {
  await page.goto('/');
  const home = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.goto('/projects');
  await expect(page.locator('.pcard')).toHaveCount(8);
  const projects = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(home).toBeLessThan(projects * 0.55);
});

for (const path of ['/', '/experience', '/projects', '/systems/wes']) {
  test(`top bar links are centered on ${path}`, async ({ page }, info) => {
    test.skip(/android|iphone/.test(info.project.name), 'phones keep the name left and links right');
    await page.goto(path);
    const links = page.getByRole('navigation', { name: 'Main' }).locator('.links');
    await expect(links).toBeVisible();
    const offset = await links.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return Math.abs((r.left + r.right) / 2 - document.documentElement.clientWidth / 2);
    });
    expect(offset).toBeLessThan(2);
  });
}

test('the contact section stays compact and inside the page', async ({ page }) => {
  await page.goto('/');
  const contact = page.locator('#contact');
  await contact.scrollIntoViewIfNeeded();
  await expect(contact.getByRole('link', { name: 'josuekenge4@gmail.com' })).toBeVisible();
  const box = await contact.boundingBox();
  expect(box?.height ?? Infinity).toBeLessThanOrEqual(420);
  const wordmarkRight = await contact.locator('.wordmark').evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().right;
  });
  expect(wordmarkRight).toBeLessThanOrEqual(page.viewportSize()?.width ?? 0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('my part of the V2 diagram stands out from the team platform', async ({ page }, info) => {
  await page.goto('/experience#demo-creator-v2');
  if (/android|iphone/.test(info.project.name)) {
    await expect(page.locator('.inlinemap .node.mine')).toHaveCount(2);
    return;
  }
  const mine = page.locator('.pm.on .pn.mine');
  await expect(mine).toHaveCount(2);
  await expect(mine.first()).toContainText('Demo Finder App');
  const border = (selector: string) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).borderTopColor);
  expect(await border('.pm.on .pn.mine')).not.toBe(await border('.pm.on .pn:not(.mine):not(.hot)'));
});

const isPhone = (name: string) => /android|iphone/.test(name);

test('phone hero sits side by side on one row', async ({ page }, info) => {
  test.skip(!isPhone(info.project.name), 'phone layout');
  await page.goto('/');
  const width = page.viewportSize()!.width;
  const cells = await page.locator('.heroleft-m .co-m').evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ top: r.top, right: r.right })));
  expect(cells).toHaveLength(4);
  cells.forEach((c) => {
    expect(Math.abs(c.top - cells[0].top)).toBeLessThan(2);
    expect(c.right).toBeLessThanOrEqual(width);
  });
  const tops = await page.locator('.heroleft-m .cta .btn').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().top));
  expect(tops).toHaveLength(2);
  expect(Math.abs(tops[0] - tops[1])).toBeLessThan(2);
  const now = await page.locator('.heroleft-m .now').boundingBox();
  expect(now!.height).toBeLessThan(32);
  await expectNoSidewaysScroll(page);
});

test('phone capabilities are a circular dial, not a stack', async ({ page }, info) => {
  test.skip(!isPhone(info.project.name), 'phone layout');
  await page.goto('/');
  await expect(page.locator('.bent')).toHaveCount(0);
  const dial = page.locator('.dial');
  await dial.scrollIntoViewIfNeeded();
  await expect(dial.locator('.dbtn')).toHaveCount(3);
  await page.getByRole('button', { name: 'Show Agentic and RAG Systems' }).dispatchEvent('click');
  await expect(page.locator('.dpi.on .ct')).toHaveText('Agentic and RAG Systems');
  await page.waitForTimeout(4600);
  await expect(page.locator('.dpi.on .ct')).toHaveText('Agentic and RAG Systems');
  const box = await page.locator('section:has(.dial)').boundingBox();
  expect(box!.height).toBeLessThanOrEqual(760);
  await expectNoSidewaysScroll(page);
});

test('the dial turns by itself while on screen', async ({ page }, info) => {
  test.skip(!isPhone(info.project.name), 'phone layout');
  await page.goto('/');
  await page.locator('.dial').scrollIntoViewIfNeeded();
  await expect(page.locator('.dpi.on .ct')).not.toHaveText('Brownfield Integration', { timeout: 9000 });
});

test('the phone layout holds at 320px wide', async ({ page }, info) => {
  test.skip(!isPhone(info.project.name), 'phone layout');
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const rights = await page.locator('.heroleft-m .co-m, .heroleft-m .cta .btn').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().right));
  rights.forEach((r) => expect(r).toBeLessThanOrEqual(320));
  await page.locator('.dial').scrollIntoViewIfNeeded();
  const nodes = await page.locator('.dbtn').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  nodes.forEach((w) => expect(w).toBeGreaterThanOrEqual(44));
  await expectNoSidewaysScroll(page);
});

test('desktop keeps the three cards and the original logo row', async ({ page }, info) => {
  test.skip(isPhone(info.project.name), 'desktop layout');
  await page.goto('/');
  await expect(page.locator('.bent .card')).toHaveCount(3);
  await expect(page.locator('.dial')).toHaveCount(0);
  await expect(page.locator('.heroleft .co-m', { hasText: 'Microsoft' })).toBeVisible();
  await expect(page.locator('.heroleft .atl')).toBeVisible();
  const captions = await page.locator('.heroleft .sz-ibm .atn, .heroleft .sz-jonas .atn').evaluateAll((els) => els.map((e) => getComputedStyle(e).display));
  captions.forEach((d) => expect(d).toBe('none'));
});
