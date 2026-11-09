export const MOBISOINS = {
  status: 'In development · Montreal',
  title: 'MobiSoins',
  tagline: 'On-demand home nursing — Uber, but for licensed nurses.',
  blurb: 'A two-sided marketplace connecting patients who need clinical care with licensed (OIIQ) nurses who deliver it at home — see nurses on a live map, book, pay, and track in real time. Architected and built end-to-end: a role-aware Expo / React Native client, a NestJS + TypeORM API over PostgreSQL as the system of record, and Firebase RTDB as the realtime layer — self-hosted on AWS (EC2, Cognito, S3 / SES / SNS) and glued to Stripe, Twilio, and Mapbox.',
  roles: [
    {
      label: 'For patients',
      items: [
        'Live map of available nurses nearby',
        'Book a service, pay in-app before the visit',
        'Real-time tracking to your door + arrival alert',
        'In-app chat, visit history, ratings & receipts',
      ],
    },
    {
      label: 'For nurses',
      items: [
        'Go online to appear on the patient map',
        'Job requests with service, distance & payout',
        '18-second exclusive offer, then one-tap navigation',
        'Visit reports + weekly earnings dashboard',
      ],
    },
  ],
  highlights: [
    { t: 'Uber-style dispatch', d: 'Online nurses are ranked by a Haversine SQL query and offered each job for an exclusive 18s, rolling through 3 rounds. A single atomic conditional UPDATE — guarded by a partial unique index — makes concurrent accepts race-safe: exactly one winner, everyone else a clean 409.' },
    { t: 'Real-time tracking', d: 'Nurse GPS publishes to Firebase RTDB every few seconds; the client tweens the pin on a requestAnimationFrame loop so it glides instead of teleporting, fires a 200 m arrival alert, and speaks Mapbox turn-by-turn cues.' },
    { t: 'Escrow payments', d: 'Stripe manual-capture PaymentIntents pre-authorize on booking and capture only after the visit report — itemized GST 5% + QST 9.975% + platform fee, a $25 partial-capture cancellation, signed idempotent webhooks, and weekly Stripe Connect payouts.' },
    { t: 'Built for Québec', d: 'Law 25 by design: a PHI audit interceptor, soft deletes, 30-day deletion grace with purge fan-out (Cognito · S3 · Stripe), ca-central-1 residency, plus helmet + tiered rate-limiting on the API.' },
  ],
  note: 'Plus an in-app support assistant powered by Claude Haiku 4.5 with a hard medical-advice guardrail (emergencies → 911 / Info-Santé 811).',
  techApp: ['Expo', 'React Native', 'TypeScript', 'Zustand', 'Mapbox', 'Stripe', 'Firebase'],
  techApi: ['NestJS', 'TypeORM', 'PostgreSQL', 'AWS EC2', 'AWS Cognito', 'S3 · SES · SNS', 'Twilio', 'Claude'],
  metrics: [
    { v: '1 app', l: 'two roles, role-aware' },
    { v: '< 3 min', l: 'open → nurse confirmed' },
    { v: '~111', l: 'REST endpoints · 18 modules' },
    { v: 'iOS · Android', l: 'Expo · EAS → TestFlight' },
  ],
};

export const ARCH_CARDS: { t: string; d: string }[] = [
  { t: 'Live map & discovery', d: 'Nearby nurses come from a Haversine geo-query; each pin’s live GPS rides Firebase and is interpolated client-side so it glides instead of jumping.' },
  { t: 'Booking & accept', d: 'A booking pre-authorizes payment, then the API offers it to the closest nurse for 18s across 3 rounds. The first atomic accept wins — everyone else gets a clean 409.' },
  { t: 'Real-time speed', d: 'Offers land in ~hundreds of ms over Firebase, with push + polling as fallbacks. A patient goes from open → nurse confirmed in under 3 minutes.' },
  { t: 'Reviews & ratings', d: 'A delayed prompt after each completed visit collects a rating; nurse profiles aggregate reviews that feed back into discovery.' },
  { t: 'Firebase SDK', d: 'The realtime backbone — RTDB streams GPS, job offers, and in-app chat keyed by bookingId; FCM handles push. App uses the JS SDK, backend the Admin SDK.' },
  { t: 'Auth & OTP', d: 'Google, Apple & Facebook sign-in flow through Firebase/Cognito; email OTP goes through AWS (Cognito + SES), phone OTP through Twilio. The backend verifies tokens (JWKS + Apple verifier) and issues role-scoped JWTs.' },
  { t: 'Escrow payments', d: 'Stripe manual-capture holds funds until the visit report is filed; signed, idempotent webhooks reconcile state and nurses are paid weekly via Connect.' },
  { t: 'Data & compliance', d: 'PostgreSQL via TypeORM — 15 entities, 18 migrations — with Law 25 audit logging, soft deletes, and ca-central-1 residency.' },
];
