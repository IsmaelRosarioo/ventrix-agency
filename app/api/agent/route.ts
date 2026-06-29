import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai';
import { systemPrompts, getSystemPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

type IncomingMessage = { role: 'user' | 'assistant'; content: string };
type Body = { messages?: unknown; niche?: unknown };

const ALLOWED_NICHES = Object.keys(systemPrompts);

// --- Same-origin enforcement -------------------------------------------------
// Only requests from this site itself are accepted. Stops the endpoint being
// called from curl, another domain, or a script using your paid model for free.
function allowedOrigins(): string[] {
  const origins: string[] = [];
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) origins.push(site.replace(/\/$/, ''));
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  origins.push('https://ventrix-agency.vercel.app', 'http://localhost:3000');
  return origins;
}

function originOk(req: NextRequest): boolean {
  const allowed = allowedOrigins();
  const match = (h: string | null) =>
    !!h && allowed.some((a) => h === a || h.startsWith(`${a}/`));
  return match(req.headers.get('origin')) || match(req.headers.get('referer'));
}

// --- Lightweight in-memory rate limit (per IP, fixed window) -----------------
// Best-effort on Vercel serverless (per instance). Stops casual abuse and
// protects the Ollama Cloud quota. For cross-instance limiting, upgrade to
// Upstash Redis + @upstash/ratelimit.
const WINDOW_MS = 60_000;
const MAX_REQS = 12;
const hits = new Map<string, { start: number; count: number }>();

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_REQS;
}

function getClientIp(req: NextRequest): string {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

// --- Input validation --------------------------------------------------------
const MAX_MESSAGES = 20;
const MAX_CONTENT = 1000;

function validateMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const out: IncomingMessage[] = [];
  for (const m of raw) {
    if (typeof m !== 'object' || m === null) return null;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    // Never accept 'system' from the client — that would let a caller override
    // the locked system prompt. Only user/assistant pass through.
    if (role !== 'user' && role !== 'assistant') return null;
    if (typeof content !== 'string') return null;
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > MAX_CONTENT) return null;
    out.push({ role, content: trimmed });
  }
  // The latest turn must be from the visitor.
  if (out[out.length - 1]!.role !== 'user') return null;
  return out;
}

// Never surface upstream/provider details to the client. Log full detail
// server-side only, return a generic message to the browser.
function sanitizeError(err: unknown): string {
  // eslint-disable-next-line no-console
  console.error('[agent] error:', err instanceof Error ? err.message : err);
  return 'The assistant is unavailable right now. Please try again in a moment.';
}

export async function POST(req: NextRequest) {
  try {
    if (!originOk(req)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 403 });
    }
    if (!rateLimitOk(getClientIp(req))) {
      return NextResponse.json({ error: 'too many requests, slow down' }, { status: 429 });
    }

    const body = (await req.json()) as Body;
    const messages = validateMessages(body?.messages);
    if (!messages) {
      return NextResponse.json({ error: 'invalid request' }, { status: 400 });
    }

    const nicheRaw =
      body && typeof body.niche === 'string' ? body.niche : '';
    const niche = ALLOWED_NICHES.includes(nicheRaw) ? nicheRaw : 'plumbing';

    const system = getSystemPrompt(niche);
    const fullMessages = [
      { role: 'system' as const, content: system },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const { text } = await chat(fullMessages);
    if (!text || !text.trim()) {
      return NextResponse.json({ error: sanitizeError('empty reply') }, { status: 502 });
    }

    return NextResponse.json({ reply: text });
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}