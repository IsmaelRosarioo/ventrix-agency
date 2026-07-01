'use client';

import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

const NICHES = [
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'hvac', label: 'HVAC' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'general', label: 'General' },
];

export default function ChatWidget() {
  const [niche, setNiche] = useState('plumbing');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // We deliberately don't expose the AI provider to visitors.
  // (Showing internals lets prospects think "I can do this myself".)

  // Auto-scroll to bottom as messages stream in.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, busy]);

  async function send() {
    if (!input.trim() || busy) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The encrypted conversation token travels in an HttpOnly cookie set by
        // the server, not in the body — JS (and therefore XSS) cannot read it.
        body: JSON.stringify({ message: userMsg.content, niche }),
      });
      if (!res.ok) {
        const t = await res.text();
        let msg = `HTTP ${res.status}`;
        try {
          const j = JSON.parse(t) as { error?: string };
          if (j?.error) msg = j.error;
        } catch {
          if (t) msg = t;
        }
        throw new Error(msg);
      }
      const data = (await res.json()) as { reply: string };
      setMessages([...next, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      const m = e instanceof Error ? e.message : 'request failed';
      setError(m);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
    // Tell the server to drop the encrypted history cookie.
    void fetch('/api/agent-reset', { method: 'POST' }).catch(() => {});
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-sm font-semibold text-ink-900">
            Live AI receptionist
          </span>
          <span className="text-xs text-ink-400">
            · online now
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={niche}
            onChange={(e) => {
              setNiche(e.target.value);
              reset();
            }}
            className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs text-ink-700"
            aria-label="Choose demo niche"
          >
            {NICHES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
          <button
            onClick={reset}
            className="rounded-md border border-ink-200 px-2 py-1 text-xs text-ink-600 hover:bg-ink-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-96 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-ink-500">
              👋 Try me. Tell me what your problem is —&nbsp;
              <span className="italic">
                &quot;my sink is leaking&quot;, &quot;no heat&quot;,
                &quot;panel is sparking&quot;
              </span>
              .
            </p>
            <p className="mt-2 text-xs text-ink-400">
              This is a real AI agent. Nothing is faked.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                m.role === 'user'
                  ? 'rounded-br-md bg-brand-600 text-white'
                  : 'rounded-bl-md bg-ink-50 text-ink-800'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {busy && (
          <div className="mb-3 flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-ink-50 px-4 py-2 text-sm text-ink-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:120ms]">.</span>
                <span className="animate-bounce [animation-delay:240ms]">.</span>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div
            className={`mb-3 rounded-md px-3 py-2 text-xs ${
              error.toLowerCase().includes('temporarily offline')
                ? 'bg-amber-50 text-amber-800'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {error.toLowerCase().includes('temporarily offline') ? '🔧' : '⚠'} {error}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-ink-100 px-4 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          disabled={busy}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}