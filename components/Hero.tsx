import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
              For plumbers, electricians, HVAC & roofers
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink-900 md:text-6xl">
              Get a website that{' '}
              <span className="text-brand-600">books jobs while you sleep.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-500">
              We build AI-powered websites and 24/7 receptionist agents for local
              home-service businesses. Capture every lead. Quote faster. Grow without
              hiring.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              >
                Book a free walkthrough
              </Link>
              <Link
                href="/demo"
                className="rounded-lg border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-300 hover:bg-ink-50"
              >
                See the live demo →
              </Link>
            </div>
            <p className="mt-6 text-xs text-ink-400">
              No long contract. Month-to-month. Cancel any time.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-ink-400">
                  bluepipeplumbing.com — AI receptionist
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2 text-white">
                    Hi, my kitchen sink is leaking under the cabinet
                  </div>
                </div>
                <div className="flex">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-ink-50 px-4 py-2 text-ink-800">
                    Sorry to hear that — I can get a plumber to you today.
                    What&apos;s the best number to reach you on?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2 text-white">
                    555-0142
                  </div>
                </div>
                <div className="flex">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-ink-50 px-4 py-2 text-ink-800">
                    Got it. I&apos;m flagging this urgent — a dispatcher will
                    call within 15 minutes.
                  </div>
                </div>
              </div>
              <Link
                href="/demo"
                className="mt-4 inline-block text-xs font-medium text-brand-600 hover:underline"
              >
                Try the real thing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}