// Stateless, server-signed conversation token.
//
// The client holds an opaque token and sends it back each turn. The server
// verifies the HMAC, reconstructs the full message history from the payload,
// appends the new user turn, and reissues a fresh token with the assistant
// reply included. This means the server — not the client — owns assistant
// turns, so a caller cannot forge a history where "the assistant already
// agreed to drop its rules". No DB needed; state travels with the client.
//
// Token format: base64url(payload).base64url(hmac-sha256(payload))

import { createHmac, timingSafeEqual } from 'crypto';

export type Turn = { role: 'user' | 'assistant'; content: string };
type Payload = {
  v: 1;
  niche: string;
  iat: number;
  turns: Turn[];
};

export const MAX_TURNS_TOKEN = 20;
const TTL_MS = 15 * 60_000;

function secret(): string {
  const s = process.env.AGENT_TOKEN_SECRET;
  if (!s || s.length < 32) {
    throw new Error('AGENT_TOKEN_SECRET missing or too short (need >=32 chars)');
  }
  return s;
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

function signToken(payload: Payload): string {
  const body = b64url(JSON.stringify(payload));
  const mac = createHmac('sha256', secret()).update(body).digest();
  return `${body}.${b64url(mac)}`;
}

export function newToken(niche: string, turns: Turn[]): string {
  return signToken({ v: 1, niche, iat: Date.now(), turns: turns.slice(-MAX_TURNS_TOKEN) });
}

export function verifyToken(token: string): Payload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, mac] = parts;

  let expected: Buffer;
  try {
    expected = createHmac('sha256', secret()).update(body).digest();
  } catch {
    return null;
  }

  let given: Buffer;
  try {
    given = Buffer.from(mac, 'base64url');
  } catch {
    return null;
  }
  if (expected.length !== given.length) return null;
  if (!timingSafeEqual(expected, given)) return null;

  let payload: Payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Payload;
  } catch {
    return null;
  }
  if (payload.v !== 1) return null;
  if (typeof payload.niche !== 'string') return null;
  if (typeof payload.iat !== 'number') return null;
  if (Date.now() - payload.iat > TTL_MS) return null;
  if (!Array.isArray(payload.turns) || payload.turns.length > MAX_TURNS_TOKEN) return null;
  return payload;
}