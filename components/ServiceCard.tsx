type Service = {
  title: string;
  blurb: string;
  bullets: string[];
};

const services: Service[] = [
  {
    title: 'AI-Powered Websites',
    blurb:
      'A modern, fast site that ranks locally and turns visitors into booked jobs.',
    bullets: [
      'Mobile-first, lightning fast',
      'Local SEO built in (Google Business, schema)',
      'Service pages + quote forms',
      'Hosted on Vercel — 99.99% uptime',
    ],
  },
  {
    title: '24/7 AI Receptionist',
    blurb:
      'A chat agent that answers questions, qualifies leads, and books appointments — day or night.',
    bullets: [
      'Trained on YOUR services and pricing',
      'Captures name, phone, address, job type',
      'Urgent-flag routing to your phone',
      'Speaks plain English, not corporate',
    ],
  },
  {
    title: 'Lead Pipeline & CRM',
    blurb:
      'Every lead lands in one place. Auto-text back within 60 seconds. No more missed calls.',
    bullets: [
      'Web leads → SMS + email instantly',
      'Missed-call text-back',
      'Pipeline view (new, quoted, won, lost)',
      'Weekly summary emails',
    ],
  },
  {
    title: 'Review & Reputation Engine',
    blurb:
      'Automatically request Google reviews after every job. Build the social proof that wins new work.',
    bullets: [
      'Auto text after job completion',
      'Direct link to Google review form',
      'Negative feedback routed to you (not Google)',
      'Dashboard of new reviews',
    ],
  },
];

export default function ServiceCard() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          Everything your business needs online.
        </h2>
        <p className="mt-3 text-ink-500">
          Done for you. Month-to-month. No tech skills required.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition hover:border-brand-200"
          >
            <h3 className="text-xl font-semibold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-ink-500">{s.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-700">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}