import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCard />

      <section className="bg-ink-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid items-center gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight text-ink-900">
                Built for the way trades businesses actually work.
              </h2>
              <p className="mt-3 text-ink-500">
                You&apos;re on a roof, in a crawlspace, or driving between jobs.
                Your website should work harder so you don&apos;t have to.
              </p>
            </div>
            <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
              {[
                ['80%', 'of homeowners search online first'],
                ['<60s', 'is the response time that wins the job'],
                ['35%', 'of calls to small businesses go unanswered'],
                ['5x', 'ROI typical in the first 90 days'],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-xl border border-ink-100 bg-white p-5"
                >
                  <div className="text-3xl font-bold text-brand-600">{n}</div>
                  <div className="mt-1 text-sm text-ink-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">
          Ready to stop losing leads?
        </h2>
        <p className="mt-3 text-ink-500">
          Free 30-minute walkthrough. We&apos;ll show you exactly what we&apos;d
          build and what it&apos;d cost.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Book a walkthrough
          </Link>
          <Link
            href="/demo"
            className="rounded-lg border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            Try the live demo
          </Link>
        </div>
      </section>
    </>
  );
}