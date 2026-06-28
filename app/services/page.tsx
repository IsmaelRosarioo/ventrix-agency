import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Services' };

const services = [
  {
    title: 'AI-Powered Websites',
    desc: 'A modern site that ranks locally and turns visitors into booked jobs. Mobile-first, fast, SEO-ready.',
    features: [
      'Custom design (no templates that look like everyone else)',
      'Service pages, city pages, quote forms',
      'Google Business Profile integration',
      'Local SEO foundations: schema, sitemap, page speed',
    ],
  },
  {
    title: '24/7 AI Receptionist',
    desc: 'A chat agent trained on your business — answers FAQs, qualifies leads, books appointments.',
    features: [
      'Trained on YOUR services, service area, pricing language',
      'Captures lead info automatically',
      'Urgent-flag routing for emergencies',
      'Speaks plain English — not corporate jargon',
    ],
  },
  {
    title: 'Lead Pipeline & SMS Auto-Reply',
    desc: 'Every web lead gets an instant text back. Missed calls trigger an auto-text. No more lost leads.',
    features: [
      '60-second lead response (industry gold standard)',
      'Missed-call text-back',
      'Pipeline view of every lead',
      'Weekly summary emails to you',
    ],
  },
  {
    title: 'Review & Reputation Engine',
    desc: 'Automatically request Google reviews after every completed job.',
    features: [
      'Auto-text after job marked complete',
      'Direct Google review link',
      'Negative feedback routed to you privately',
      'Monthly review report',
    ],
  },
  {
    title: 'Recruiting & Hiring Page',
    desc: 'Stop losing hires to competitors. A dedicated careers page that converts applicants.',
    features: [
      'Mobile-friendly application form',
      'Auto-text applicants within 60 seconds',
      'Pre-qualification questions',
      'Posts to Indeed, ZipRecruiter automatically',
    ],
  },
  {
    title: 'Monthly Reporting & Optimization',
    desc: 'A monthly call to review what&apos;s working and what to fix. We tweak things so the numbers keep climbing.',
    features: [
      'Traffic, leads, conversion report',
      'Heatmaps of where people click',
      'A/B test landing pages',
      'Quarterly strategy review',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-ink-900 md:text-5xl">
        Services
      </h1>
      <p className="mt-3 max-w-2xl text-ink-500">
        Everything a local home-service business needs online, bundled into one
        monthly plan. No tech skills required on your end.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft"
          >
            <h2 className="text-xl font-semibold text-ink-900">{s.title}</h2>
            <p className="mt-2 text-ink-500">{s.desc}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              {s.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}