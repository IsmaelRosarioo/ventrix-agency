// Stateless, server-issued, ENCRYPTED conversation token.
//
// The client holds an opaque cookie value and sends it back each turn (via an
// HttpOnly cookie, so JS/XSS cannot read it). The server decrypts it, reads the
// conversation history, appends the new user turn, and reissues a fresh token
// with the assistant reply included. The server — not the client — owns
// assistant turns, so a caller cannot forge a history where "the assistant
// already agreed to drop its rules". No DB needed; state travels with the
// cookie.
//
// Token format: base64url( iv(12B) || ciphertext || GCM-tag(16B) ).
// AES-256-GCM gives both confidentiality (PII like name/phone/address is
// encrypted, not just signed) and integrity (the auth tag detects tampering).

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  type CipherGCMTypes,
} from 'crypto';

export type Turn = { role: 'user' | 'assistant'; content: string };
type Payload = {
  v: 2;
  niche: string;
  iat: number;
  turns: Turn[];
};

export const MAX_TURNS_TOKEN = 20;
const TTL_MS = 15 * 60_000;
const IV_LEN = 12;
const TAG_LEN = 16;
const ALGO: CipherGCMTypes = 'aes-256-gcm';

function key(): Buffer {
  const s = process.env.AGENT_TOKEN_SECRET;
  if (!s || s.length < 32) {
    throw new Error('AGENT_TOKEN_SECRET missing or too short (need >=32 chars)');
  }
  // Derive a fixed 32-byte AES-256 key from the secret. sha256 is sufficient
  // here; the secret itself is high-entropy (>=32 chars) and never disclosed.
  return createHash('sha256').update(s).digest();
}

// Whether a usable signing/encryption secret is configured. When false, the
// agent endpoint runs in single-turn mode (no encrypted history) instead of
// 500-ing after a successful model call. Full multi-turn resumes once the
// secret is set. No security regression: single-turn has no history to forge.
export function hasSecret(): boolean {
  const s = process.env.AGENT_TOKEN_SECRET;
  return typeof s === 'string' && s.length >= 32;
}

function b64url(buf: Buffer): string {
  return Buffer.from(buf).toString('base64url');
}

function encryptToken(plain: string): string {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return b64url(Buffer.concat([iv, ciphertext, tag]));
}

function decryptToken(token: string): string | null {
  let buf: Buffer;
  try {
    buf = Buffer.from(token, 'base64url');
  } catch {
    return null;
  }
  if (buf.length < IV_LEN + TAG_LEN) return null;
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  try {
    const decipher = createDecipheriv(ALGO, key(), iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return plain.toString('utf8');
  } catch {
    // Tampered or wrong key -> treat as invalid.
    return null;
  }
}

export function newToken(niche: string, turns: Turn[]): string {
  const payload: Payload = {
    v: 2,
    niche,
    iat: Date.now(),
    turns: turns.slice(-MAX_TURNS_TOKEN),
  };
  return encryptToken(JSON.stringify(payload));
}

export function verifyToken(token: string): Payload | null {
  const plain = decryptToken(token);
  if (!plain) return null;
  let payload: Payload;
  try {
    payload = JSON.parse(plain) as Payload;
  } catch {
    return null;
  }
  if (payload.v !== 2) return null;
  if (typeof payload.niche !== 'string') return null;
  if (typeof payload.iat !== 'number') return null;
  if (Date.now() - payload.iat > TTL_MS) return null;
  if (!Array.isArray(payload.turns) || payload.turns.length > MAX_TURNS_TOKEN) return null;
  return payload;
}