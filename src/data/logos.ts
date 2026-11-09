import { LOGO_DATA } from './logos.generated';

export type LogoKey = keyof typeof LOGO_DATA;
export interface LogoDef {
  key: LogoKey;
  title: string;
  viewBox: string;
  inner: string;
  color: string;
  line: boolean;
}

const RULES: [RegExp, LogoKey][] = [
  [/\bNext\.js\b/, 'nextdotjs'],
  [/\bReact( Native)?\b/, 'react'],
  [/\bTypeScript\b/, 'typescript'],
  [/\bJavaScript\b/, 'javascript'],
  [/\bNode(\.js)?\b/, 'nodedotjs'],
  [/\bExpress\b/, 'express'],
  [/\bSupabase\b/, 'supabase'],
  [/\bPostgre(SQL|s)\b/, 'postgresql'],
  [/\bDocker\b/, 'docker'],
  [/\bGitHub Actions\b/, 'githubactions'],
  [/\bPython\b/, 'python'],
  [/\bFastAPI\b/, 'fastapi'],
  [/\bSQLAlchemy\b/, 'sqlalchemy'],
  [/\bOpenShift\b/, 'redhatopenshift'],
  [/\bClaude\b/, 'claude'],
  [/\bAWS\b|\bBedrock\b|\bCognito\b|\bEC2\b|\bS3\b|\bSES\b|\bSNS\b/, 'aws'],
  [/\bAzure\b/, 'azure'],
  [/\bOpenAI\b/, 'openai'],
  [/\bVapi\b/, 'vapi'],
  [/\.NET\b/, 'dotnet'],
  [/\bC#/, 'csharp'],
  [/\bAngular\b/, 'angular'],
  [/\bLangChain\b/, 'langchain'],
  [/\bTailwind\b/, 'tailwindcss'],
  [/\bshadcn\b/, 'shadcnui'],
  [/\bExpo\b/, 'expo'],
  [/\bFirebase\b/, 'firebase'],
  [/\bStripe\b/, 'stripe'],
  [/\bTwilio\b/, 'twilio'],
  [/\bMapbox\b/, 'mapbox'],
  [/\bNestJS\b/, 'nestjs'],
  [/\bTypeORM\b/, 'typeorm'],
  [/\bGemini\b/, 'googlegemini'],
  [/\bNetlify\b/, 'netlify'],
  [/\bRailway\b/, 'railway'],
  [/\bElevenLabs\b/, 'elevenlabs'],
  [/\bSlack\b/, 'slack'],
  [/\bIBM\b/, 'ibm'],
  [/\bMicrosoft 365\b|\bOffice 365\b/, 'microsoft'],
  [/\bpytest\b/, 'pytest'],
  [/\bCursor\b/, 'cursor'],
  [/\bChart\.js\b/, 'chartdotjs'],
  [/\bSpring Boot\b/, 'springboot'],
  [/\bJava\b(?!Script)/, 'java'],
  [/\bC\+\+/, 'cplusplus'],
  [/\bHTML\b/, 'html5'],
  [/\bCSS\b/, 'css'],
];

export function logo(key: LogoKey): LogoDef {
  return { key, ...LOGO_DATA[key] };
}

/** Finds every tool named in a piece of text, in the order the rules list them. */
export function matchLogos(text: string, max = Infinity): LogoDef[] {
  const found: LogoDef[] = [];
  for (const [pattern, key] of RULES) {
    if (found.length >= max) break;
    if (pattern.test(text)) found.push(logo(key));
  }
  return found;
}

export const MARQUEE_LOGOS: LogoKey[] = [
  'ibm', 'microsoft', 'claude', 'openai', 'azure', 'aws', 'nextdotjs', 'react', 'fastapi', 'python', 'typescript', 'nestjs', 'expo',
  'firebase', 'stripe', 'supabase', 'postgresql', 'langchain', 'docker', 'githubactions', 'redhatopenshift', 'dotnet',
  'angular', 'twilio', 'mapbox', 'googlegemini', 'elevenlabs', 'slack', 'cursor', 'vapi',
];
