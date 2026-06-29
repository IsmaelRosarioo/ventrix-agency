import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Body = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
};

// Sends an email via Resend (free tier: 100/day).
// If RESEND_API_KEY is not set, we fall back to logging the lead
// (still useful in development — you'll see leads in the terminal).
async function sendViaResend(lead: Body) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) return { sent: false, reason: 'no api key or recipient' };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Ventrix Agency <hello@ventrixagency.com>',
      to,
      subject: `New lead from ${lead.source ?? 'website'}: ${lead.name}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone ?? '(none)'}`,
        `Source: ${lead.source ?? 'website'}`,
        '',
        'Message:',
        lead.message,
      ].join('\n'),
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Resend ${res.status}: ${t}`);
  }
  return { sent: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.name || !body?.email || !body?.message) {
      return NextResponse.json(
        { error: 'name, email, and message are required' },
        { status: 400 },
      );
    }

    // Basic email sanity check.
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 });
    }

    // eslint-disable-next-line no-console
    console.log('[lead]', body);
    const result = await sendViaResend(body);

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}