import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
        About
      </h1>
      <div className="prose prose-slate mt-8 max-w-none text-ink-700">
        <p>
          We help local home-service businesses — plumbers, electricians, HVAC
          contractors, roofers — get found online, capture every lead, and stop
          losing jobs to competitors with better websites.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-ink-900">
          Who we work with
        </h2>
        <p>
          Owner-operators doing $300K–$5M/year. The businesses big enough to
          need real marketing, small enough that every lead matters.
        </p>
        <h2 className="mt-8 text-2xl font-semibold text-ink-900">
          How we work
        </h2>
        <ol className="list-decimal space-y-2 pl-6">
          <li>
            Free 30-minute walkthrough. We look at your current site, your
            competitors, and your local market.
          </li>
          <li>
            We build a plan and quote. Fixed monthly fee. No surprises.
          </li>
          <li>
            We build your new site and AI agent in 7–14 days.
          </li>
          <li>
            We handle hosting, updates, and optimization. You handle the jobs.
          </li>
          <li>
            Monthly reporting and quarterly strategy reviews.
          </li>
        </ol>
        <h2 className="mt-8 text-2xl font-semibold text-ink-900">
          Why this works
        </h2>
        <p>
          Trades businesses lose leads in three places: bad websites, missed
          calls, and slow follow-up. We fix all three with a single monthly
          plan — and we measure success by the leads and jobs you actually get.
        </p>
      </div>
    </div>
  );
}