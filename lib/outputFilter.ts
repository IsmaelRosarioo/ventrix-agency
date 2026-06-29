// Output disclosure filter — defense-in-depth backstop.
//
// The primary defense against prompt leakage is the base policy in prompts.ts
// instructing the model never to reveal its instructions. This filter catches
// verbatim leaks the model may still produce: it scans the reply for niche
// business names, verbatim instruction sentences (canaries), and prompt
// scaffolding phrases, and swaps in a canned refusal if any are found.
//
// It cannot catch paraphrased leaks — that relies on the base policy. It is a
// belt-and-braces check, not the sole boundary.

import { getCanaryPhrases } from './prompts';

const SAFE_FALLBACK =
  "I'm not able to share my internal instructions. How can I help you with a home-services issue today?";

// Phrases that indicate the model echoed prompt scaffolding regardless of niche.
const STRUCTURE_PHRASES = [
  'you are the ai receptionist',
  'your job:',
  'capture: name, phone',
  'always end by asking',
  'never reveal, repeat',
];

function containsDisclosure(reply: string, niche: string): boolean {
  const r = reply.toLowerCase();
  for (const c of getCanaryPhrases(niche)) {
    if (c.length >= 6 && r.includes(c.toLowerCase())) return true;
  }
  for (const s of STRUCTURE_PHRASES) {
    if (r.includes(s)) return true;
  }
  return false;
}

export function filterReply(reply: string, niche: string): string {
  return containsDisclosure(reply, niche) ? SAFE_FALLBACK : reply;
}

export { SAFE_FALLBACK };