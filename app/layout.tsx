import './globals.css';
import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'AI Websites & 24/7 Agents for Local Home Services',
    template: '%s · Ventrix Agency',
  },
  description:
    'AI-powered websites, lead pipelines, and 24/7 receptionist agents for plumbers, electricians, HVAC, and roofers.',
  openGraph: {
    type: 'website',
    title: 'Ventrix Agency — AI for Local Home Services',
    description:
      'AI-powered websites and receptionist agents for local home-service businesses.',
    url: 'https://ventrixagency.com',
    siteName: 'Ventrix Agency',
  },
  metadataBase: new URL('https://ventrixagency.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink-900 antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}