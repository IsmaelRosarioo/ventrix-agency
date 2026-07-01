/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Security headers applied to every route. CSP (which needs a per-request
  // nonce) is added in middleware.ts; these are the static ones.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Force HTTPS for two years and opt into browser HSTS preload lists.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Stop MIME-type sniffing.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Block the site from being framed by other origins (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Only send the origin (not the full URL) to other sites.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Lock down browser features the site never uses.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=()',
          },
          // Cross-Origin-* isolation headers are intentionally NOT set: they would
          // break the demo's same-origin fetch to /api/agent and aren't needed.
        ],
      },
    ];
  },
};

export default nextConfig;