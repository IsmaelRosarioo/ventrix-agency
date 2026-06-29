import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// DEBUG endpoint — shows what env vars are actually loaded.
// Safe to expose since it only reports which env vars are *set*, not their values.
export async function GET() {
  const provider = process.env.AI_PROVIDER ?? 'NOT SET';
  const ollamaCloudKey = process.env.OLLAMA_CLOUD_API_KEY ? 'SET' : 'NOT SET';
  const ollamaCloudModel = process.env.OLLAMA_CLOUD_MODEL ?? 'NOT SET';
  const ollamaBase = process.env.OLLAMA_BASE_URL ?? 'NOT SET';
  const ollamaModel = process.env.OLLAMA_MODEL ?? 'NOT SET';
  const anthropicKey = process.env.ANTHROPIC_API_KEY ? 'SET' : 'NOT SET';

  return NextResponse.json({
    provider,
    ollamaCloudKey,
    ollamaCloudModel,
    ollamaBase,
    ollamaModel,
    anthropicKey,
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
    vercelEnv: process.env.VERCEL_ENV ?? 'not on vercel',
  });
}