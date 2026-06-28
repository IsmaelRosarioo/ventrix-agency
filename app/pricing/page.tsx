import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Pricing' };

const tiers = [
  {
    name: 'Starter',
    price: '$497',
    cadence: '/mo',
    blurb: 'For solo operators and new businesses getting online for real.',
    features: [
      '1-page AI website with quote form',
      'Local SEO foundations',
      'Basic 24/7 AI receptionist',
      'Missed-call text-back',
      'Monthly reporting email',
      'Up to 50 leads/mo',
    ],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$997',
    cadence: '/mo',
    blurb: 'For established businesses ready to dominate locally.',
    features: [
      'Multi-page custom website',
      'Advanced AI receptionist (booking, FAQs, qualification)',
      'Lead pipeline + auto-text-back',
      'Review request automation',
      'Quarterly strategy call',
      'Up to 250 leads/mo',
    ],
    cta: 'Get started',
    highlight: true,
  },
  {
    name: 'Custom',
    price: '$2,497+',
    cadence: '/mo',
    blurb: 'Multi-location, complex funnels, custom integrations.',
    features: [
      'Everything in Growth',
      'Multi-location support',
      'Custom integrations (CRM, dispatch, accounting)',
      'Recruiting/hiring page',
      'Dedicated success manager',
      'Unlimited leads',
    ],
    cta: 'Talk to us',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
          Simple, month-to-month pricing.
        </h1>
        <p className="mt-3 text-ink-500">
          No setup fee. No contract. Cancel any time. Most clients pay for
          themselves in the first week.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl border p-6 shadow-soft ${
              t.highlight
                ? 'border-brand-500 bg-brand-50/40'
                : 'border-ink-100 bg-white'
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 right-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-semibold text-ink-900">{t.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-ink-900">{t.price}</span>
              <span className="text-sm text-ink-500">{t.cadence}</span>
            </div>
            <p className="mt-2 text-sm text-ink-500">{t.blurb}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-700">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`mt-6 block rounded-lg px-4 py-2 text-center text-sm font-semibold transition ${
                t.highlight
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-ink-400">
        AI usage (Claude API) included up to fair-use limits. Heavy traffic?
        We&apos;ll talk about it — no surprise bills.
      </p>
    </div>
  );
}