import type { Metadata } from 'next';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = { title: 'Live Demo' };

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
        Live AI receptionist demo
      </h1>
      <p className="mt-3 max-w-2xl text-ink-500">
        This is a real AI agent, running on this site right now. Pick a trade,
        describe a problem, and watch it work. Switch the niche to see how
        the same agent handles different businesses.
      </p>

      <div className="mt-8">
        <ChatWidget />
      </div>

      <div className="mt-10 rounded-2xl border border-ink-100 bg-ink-50 p-6 text-sm text-ink-700">
        <h2 className="text-lg font-semibold text-ink-900">
          What this demonstrates
        </h2>
        <ul className="mt-3 space-y-2">
          <li>• Answers in plain English, not corporate jargon</li>
          <li>• Asks the right qualifying questions</li>
          <li>• Captures contact info naturally</li>
          <li>• Flags emergencies with a clear handoff</li>
          <li>• Switches tone instantly per niche (plumber vs. HVAC vs. roofer)</li>
        </ul>
      </div>

      <p className="mt-8 text-center text-xs text-ink-400">
        Want this on YOUR site?{' '}
        <a href="/contact" className="font-medium text-brand-600 hover:underline">
          Get a quote
        </a>
        .
      </p>
    </div>
  );
}