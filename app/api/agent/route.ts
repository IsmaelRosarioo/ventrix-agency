import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai';
import { systemPrompts, getSystemPrompt } from '@/lib/prompts';
import { verifyToken, newToken, MAX_TURNS_TOKEN, type Turn } from '@/lib/conversation';
import { filterReply } from '@/lib/outputFilter';

export const runtime = 'nodejs';

type Body = { message?: unknown; niche?: unknown; token?: unknown };

const ALLOWED_NICHES = Object.keys(systemPrompts);

// --- Same-origin enforcement -------------------------------------------------
// Only requests from this site itself are accepted. Stops the endpoint being
// called from curl, another domain, or a script using your paid model for free.
function allowedOrigins(): string[] {
  const origins: string[] = [];
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) origins.push(site.replace(/\/$/, ''));
  if (process.env.VERCEL_URL) origins.push(`https://${process.env.VERCEL_URL}`);
  origins.push(
    'https://ventrix-agency.vercel.app',
    'https://www.ventrixagency.com',
    'http://localhost:3000',
  );
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
// protects the model quota. For cross-instance limiting, upgrade to Upstash.
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
const MAX_CONTENT = 1000;

function validateMessage(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_CONTENT) return null;
  return trimmed;
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

    const nicheRaw = body && typeof body.niche === 'string' ? body.niche : '';
    if (!ALLOWED_NICHES.includes(nicheRaw)) {
      return NextResponse.json({ error: 'invalid request' }, { status: 400 });
    }
    const niche = nicheRaw;

    const message = validateMessage(body?.message);
    if (!message) {
      return NextResponse.json({ error: 'invalid request' }, { status: 400 });
    }

    // Reconstruct server-owned history from the signed token (if present).
    // The client can never forge assistant turns — the token is HMAC-signed.
    let turns: Turn[] = [];
    if (typeof body?.token === 'string' && body.token.length > 0) {
      const payload = verifyToken(body.token);
      if (!payload) {
        return NextResponse.json({ error: 'session expired' }, { status: 400 });
      }
      if (payload.niche !== niche) {
        return NextResponse.json({ error: 'invalid request' }, { status: 400 });
      }
      turns = payload.turns.length >= MAX_TURNS_TOKEN ? [] : payload.turns;
    }
    turns.push({ role: 'user', content: message });

    const system = getSystemPrompt(niche);
    const fullMessages = [
      { role: 'system' as const, content: system },
      ...turns.map((t) => ({ role: t.role, content: t.content })),
    ];

    const { text } = await chat(fullMessages, { maxTokens: 300 });
    if (!text || !text.trim()) {
      return NextResponse.json({ error: sanitizeError('empty reply') }, { status: 502 });
    }

    const safe = filterReply(text, niche);
    const updatedTurns: Turn[] = [...turns, { role: 'assistant', content: safe }];
    const nextToken = newToken(niche, updatedTurns);

    return NextResponse.json({ reply: safe, token: nextToken });
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}