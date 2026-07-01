// Same-origin enforcement, shared by the agent + reset endpoints.
//
// Only requests from this site itself are accepted. Stops the endpoint being
// called from another domain, a script, or curl using your paid model for free.
// The browser's SameSite=Lax cookie is the first line of defense; this is the
// server-side second line.

import { NextRequest } from 'next/server';

export function allowedOrigins(): string[] {
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

export function originOk(req: NextRequest): boolean {
  const allowed = allowedOrigins();
  const match = (h: string | null) =>
    !!h && allowed.some((a) => h === a || h.startsWith(`${a}/`));
  return match(req.headers.get('origin')) || match(req.headers.get('referer'));
}