import { NextRequest, NextResponse } from 'next/server';
import { originOk } from '@/lib/origin';
import { COOKIE_NAME } from '@/app/api/agent/route';

export const runtime = 'nodejs';

// Clears the encrypted conversation cookie so a "Reset" (or niche switch in
// the UI) discards server-side history. Same-origin only.
export async function POST(req: NextRequest) {
  if (!originOk(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}