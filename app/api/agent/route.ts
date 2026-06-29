import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/ai';
import { getSystemPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

type Body = {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  niche?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.messages?.length) {
      return NextResponse.json({ error: 'messages required' }, { status: 400 });
    }

    const system = getSystemPrompt(body.niche ?? 'plumbing');
    const fullMessages = [
      { role: 'system' as const, content: system },
      ...body.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const { text, provider } = await chat(fullMessages);

    return NextResponse.json({
      reply: text,
      provider,
      // Tell the client which provider was used — useful for the demo banner.
      mode: process.env.AI_PROVIDER ?? 'ollama',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    provider: process.env.AI_PROVIDER ?? 'ollama',
    model:
      process.env.AI_PROVIDER === 'anthropic'
        ? process.env.ANTHROPIC_MODEL
        : process.env.AI_PROVIDER === 'ollama-cloud'
          ? process.env.OLLAMA_CLOUD_MODEL
          : process.env.OLLAMA_MODEL,
  });
}