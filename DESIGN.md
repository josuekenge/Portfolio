DESIGN SYSTEM PROMPT — "Warm Editorial Blueprint"

Build UI in this exact visual language. It is a warm, editorial, architectural aesthetic — cream "paper" backgrounds, near-black ink, a serif display face for headlines, and a subtle pixel/blueprint tech motif. Restrained, premium, lots of whitespace. Never bright, never generic-SaaS.


COLOR PALETTE (use these exact values — never invent colors)

paper    F4F1E9   page background (warm cream)
surface  FCFBF7   cards / raised panels (slightly lighter than paper)
ink      1B1A16   primary text, solid buttons (near-black, warm)
ink-700  3C3A33   strong secondary text
ink-500  726E63   body / muted text
ink-400  989487   captions, labels
ink-300  B4B0A3   faintest text, placeholders
line     E5E1D6   hairline borders, dividers
lined    D8D3C6   slightly stronger borders, input outlines
accent   3A43D6   electric blue — use sparingly, only for a rare highlight
moss     4C9E68   green — status "active" dots, success states only

Rules: backgrounds are paper/surface only. Text is the ink scale. Accent and moss are garnish (1 to 2 uses per screen max). No pure black (000000) or pure white (FFFFFF).


TYPOGRAPHY

Display / headings: Fraunces (serif, optical sizing). Weight around normal (400), tight tracking, line-height around 1.0 to 1.08. Big and editorial.
Body / UI: Poppins (sans). Light (300) for long copy, 400 to 500 for UI.
Labels / code / terminal: JetBrains Mono.
Signature move — the italic accent: set one or two words of a headline in italic Fraunces, colored ink-500, for example "architecture to production" with "production" italic.
Eyebrows: uppercase, around 11px, letter-spacing .18em, ink-400, preceded by a small 7px solid ink square.


COMPONENTS

Pills (buttons): border-radius 999px, padding around .85rem 1.5rem, weight 500.
  Solid: ink background, paper text. Hover: lift 2px plus soft shadow.
  Ghost: transparent, 1px C9C4B6 border, ink text. Hover: border becomes ink.
  Include a trailing arrow that nudges right on hover.
Cards: surface background, 1px line border, generous radius (16 to 24px). Hover: border becomes darker plus a faint shadow. No heavy drop shadows.
Bordered data grid: metrics/features laid out in a grid with border-top and border-left on the container and border-bottom and border-right on each cell — a clean ruled table look, not floating cards.
Status pill: rounded-full outline chip with a pulsing moss dot plus uppercase label (for example "ACTIVE").
Inputs: surface background, 1px lined border, radius around 8px, ink text, ink-300 placeholder, focus makes the border ink (no glow rings).
Icons: 1.6px stroke, rounded line-caps, currentColor (Lucide-style).


LAYOUT AND SPACING

Content max-width 1360px, centered, horizontal padding px-5 on mobile and px-8 on larger screens.
Vertical section rhythm py-16 on mobile and py-28 on larger screens.
Each section opens with an Eyebrow, then a large Fraunces section title.
Mobile-first, 2-column grids on small screens moving to 3 or 4 on desktop.
Generous negative space; align to a clear grid.


MOTIFS (the brand texture — use subtly)

Pixel mark: a logo/glyph made of 3 offset squares at varying opacity (1.0, .55, .28). Scatter faint rotated pixel squares in section gutters.
Blueprint grid: a very faint rgba(27,26,22,0.045) 78px line grid as a background wash behind hero/contact sections.
Monospace labels for meta info (dates, tags, terminal readouts).


MOTION

Reveal-on-scroll: elements start at opacity 0 and translateY 24px, ease in over around .9s cubic-bezier(.22,.61,.36,1), with small stagger delays (.07s steps).
Count-up numbers roll from 0 on scroll-into-view (easeOutCubic).
Everything smooth and restrained — no bounce, no spin. Respect prefers-reduced-motion.


TONE

Confident, concrete, understated. Quantified claims. No emoji, no gradients on text, no neon. Think architectural monograph meets a well-made terminal.


SETUP NOTES

If pasting into a plain Tailwind project, add the palette to tailwind.config under theme.extend.colors and load the three Google Fonts (Fraunces, Poppins, JetBrains Mono) — otherwise the color and font names will not resolve.
Every value here is pulled straight from index.html and portfolio.jsx, so it mirrors the live site exactly.
