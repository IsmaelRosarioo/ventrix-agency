// AI provider switcher.
// AI_PROVIDER=ollama  -> local, free (needs Ollama running)
// AI_PROVIDER=anthropic -> cloud, paid (~$0.25-3 / 1M tokens)

type Message = { role: 'system' | 'user' | 'assistant'; content: string };

type ChatResult = { text: string; provider: 'ollama' | 'anthropic' };

async function chatOllama(messages: Message[]): Promise<string> {
  const base = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1:8b';

  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ollama ${res.status}: ${body}`);
  }

  const data = (await res.json()) as { message?: { content?: string } };
  return data.message?.content ?? '';
}

async function chatAnthropic(messages: Message[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-3-5-haiku-latest';

  // Anthropic requires system as a top-level field, not in messages.
  const system = messages.find((m) => m.role === 'system')?.content;
  const rest = messages.filter((m) => m.role !== 'system');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system,
      messages: rest,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic ${res.status}: ${body}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  return data.content?.find((b) => b.type === 'text')?.text ?? '';
}

export async function chat(messages: Message[]): Promise<ChatResult> {
  const provider = (process.env.AI_PROVIDER ?? 'ollama') as 'ollama' | 'anthropic';

  if (provider === 'anthropic') {
    const text = await chatAnthropic(messages);
    return { text, provider };
  }

  // Default to Ollama.
  const text = await chatOllama(messages);
  return { text, provider: 'ollama' };
}