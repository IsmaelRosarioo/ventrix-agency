import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef7ff',
          100: '#d8ecff',
          200: '#b9dcff',
          300: '#8bc5ff',
          400: '#58a5ff',
          500: '#2f86ff',
          600: '#1a66f0',
          700: '#1751d4',
          800: '#1844a9',
          900: '#193c85',
        },
        ink: {
          900: '#0b1220',
          800: '#101a2e',
          700: '#1b2740',
          600: '#2a3754',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
          200: '#cbd5e1',
          100: '#e2e8f0',
          50:  '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(15, 23, 42, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;