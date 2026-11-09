export function splitLead(text: string): { lead: string; rest: string } {
  const m = text.match(/^([^.?:]{3,62}[?:])\s(.+)$/);
  // A long clause ending in a colon is a sentence, not a heading.
  if (!m || (m[1].endsWith(':') && m[1].split(/\s+/).length > 6)) return { lead: '', rest: text };
  return { lead: m[1], rest: m[2] };
}
