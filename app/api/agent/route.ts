import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai';
import { systemPrompts, getSystemPrompt } from '@/lib/prompts';
import { verifyToken, newToken, hasSecret, MAX_TURNS_TOKEN, type Turn } from '@/lib/conversation';
import { originOk } from '@/lib/origin';
import { filterReply } from '@/lib/outputFilter';

export const runtime = 'nodejs';

// Carries the encrypted conversation history. HttpOnly so JS/XSS cannot read
// it; SameSite=Lax so it is only sent on same-site requests; Secure in prod.
export const COOKIE_NAME = 'ventrix_chat';
const COOKIE_TTL_S = 15 * 60;

type Body = { message?: unknown; niche?: unknown };

const ALLOWED_NICHES = Object.keys(systemPrompts);

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

function cookieOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: COOKIE_TTL_S,
  };
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

    // If no encryption secret is configured, run single-turn (no history) and
    // do not set a cookie. Full multi-turn resumes once AGENT_TOKEN_SECRET is
    // set. No security regression: single-turn has no history to forge.
    const canSign = hasSecret();
    if (!canSign) {
      // eslint-disable-next-line no-console
      console.warn('[agent] AGENT_TOKEN_SECRET missing/short — single-turn mode. Set it for encrypted multi-turn history.');
    }

    // Reconstruct server-owned history from the encrypted cookie token.
    // A missing/expired/tampered token, or a niche switch, simply starts a
    // fresh conversation — it is NOT an error. (Tampering is detected by the
    // GCM auth tag; a forged token decrypts to null and is ignored.)
    let turns: Turn[] = [];
    if (canSign) {
      const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
      if (cookieToken) {
        const payload = verifyToken(cookieToken);
        if (payload && payload.niche === niche) {
          turns = payload.turns.length >= MAX_TURNS_TOKEN ? [] : payload.turns;
        }
      }
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

    const res = NextResponse.json({ reply: safe });
    if (canSign) {
      res.cookies.set(COOKIE_NAME, newToken(niche, updatedTurns), cookieOpts());
    }
    return res;
  } catch (err) {
    return NextResponse.json({ error: sanitizeError(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}