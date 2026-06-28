import Link from 'next/link';

export default function Footer() {
  const name = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? 'Ventrix Agency';
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
              {name.charAt(0)}
            </span>
            <span className="font-semibold text-ink-900">{name}</span>
          </div>
          <p className="mt-3 text-sm text-ink-500">
            AI websites and 24/7 agents for local home-service businesses.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link href="/about" className="hover:text-ink-900">About</Link></li>
            <li><Link href="/services" className="hover:text-ink-900">Services</Link></li>
            <li><Link href="/pricing" className="hover:text-ink-900">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-ink-900">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Try it</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><Link href="/demo" className="hover:text-ink-900">Live demo agent</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink-900">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Cookies</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-400">
          © {year} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}