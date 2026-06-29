# Ventrix Agency — Foundation

A working Next.js site + AI agent that you (or any client) can deploy in a day.
Built for the home-services trades niche: plumbers, electricians, HVAC, roofers.

## What's in here

- **Marketing site** — homepage, services, pricing, about, contact
- **Live AI demo** at `/demo` — a working 24/7 receptionist you can show prospects
- **AI provider switcher** — flip one env var between Ollama (free, local) and Anthropic Claude (paid, production)
- **Lead capture** — contact form posts to `/api/contact`, optionally emails you via Resend
- **Tailwind UI** — clean, modern, mobile-first

## Quick start

### 1. Install

```bash
cd C:\Users\benny\Documents\ai-business-foundation
npm install
```

### 2. Configure

```bash
cp .env.example .env.local
```

Edit `.env.local`. Minimal config:

```env
AI_PROVIDER=ollama
NEXT_PUBLIC_BUSINESS_NAME="BluePipe Marketing"
```

### 3. Run

```bash
npm run dev
```

Site will be at http://localhost:3000.

### 4. Get the AI working

You have three options. Pick one based on what you have:

**Option A — Ollama Cloud (recommended if you have Ollama Pro):**
1. Get your API key at https://ollama.com/settings/keys
2. Set in `.env.local`:
 ```env
 AI_PROVIDER=ollama-cloud
 OLLAMA_CLOUD_API_KEY=your_key_here
 OLLAMA_CLOUD_MODEL=qwen2.5:72b
 ```
3. Visit http://localhost:3000/demo — chat works.

**Option B — Free, local (Ollama on your PC):**
1. Install Ollama: https://ollama.com/download
2. Pull a model: `ollama pull llama3.1:8b`
3. Make sure Ollama is running (`ollama serve` if needed)
4. Set `AI_PROVIDER=ollama` in `.env.local`
5. Visit http://localhost:3000/demo — chat works.

**Option C — Paid, production (Anthropic):**
1. Get an API key: https://console.anthropic.com
2. Set `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY=sk-ant-...` in `.env.local`
3. Restart `npm run dev`.
4. Haiku is recommended for cost: ~$0.25/1M input tokens.

**Required for the demo agent in all cases:** generate a signing secret and set
`AGENT_TOKEN_SECRET` in `.env.local` (and in Vercel env vars for production):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
The `/api/agent` endpoint uses it to sign conversation tokens (server-owned
history, anti-abuse). Without it the demo will return an error.

### 5. Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

Or push to GitHub and import at https://vercel.com/new. Set env vars in the Vercel dashboard.

## Architecture

```
app/
├── layout.tsx              # Site shell (Nav + Footer)
├── page.tsx                # Homepage
├── services/page.tsx       # What you sell
├── pricing/page.tsx        # 3 tiers
├── about/page.tsx          # About you
├── contact/page.tsx        # Contact form
├── demo/page.tsx           # Live AI demo
└── api/
    ├── agent/route.ts      # POST /api/agent — chat endpoint
    └── contact/route.ts    # POST /api/contact — form endpoint

components/
├── Nav.tsx                 # Top nav
├── Footer.tsx              # Footer
├── Hero.tsx                # Homepage hero
├── ServiceCard.tsx         # Homepage services grid
└── ChatWidget.tsx          # The AI chat UI on /demo

lib/
├── ai.ts                   # Provider switcher (Ollama ↔ Anthropic)
└── prompts.ts              # System prompts per niche
```

## Customizing for a client

When you onboard a real client:

1. **Branding** — change `NEXT_PUBLIC_BUSINESS_NAME` and replace logo colors in `tailwind.config.ts` (the `brand` palette).
2. **Content** — edit copy in each page file. Most pages have their text right at the top.
3. **Agent prompt** — edit `lib/prompts.ts` and add a new niche, or modify existing ones. This is where the agent's personality lives.
4. **Contact email** — set `CONTACT_EMAIL` and `RESEND_API_KEY` so leads actually email you.
5. **Deploy** — push to Vercel with their custom domain.

## Cost math (production)

| Item | Free tier | Realistic client |
|---|---|---|
| Vercel hosting | Free up to hobby limits | $20/mo Pro |
| Domain | n/a | ~$15/yr |
| Anthropic API | n/a | $5–50/mo per client |
| Resend email | 100/day free | $20/mo |
| **Total** | **$0** | **~$50–90/mo** |

Charge: $497–$2,497/mo. Margins are excellent.

## Adding more niches

To add a niche (say, "landscaping"):

1. Open `lib/prompts.ts`
2. Add a new key:
   ```ts
   landscaping: `You are the AI receptionist for "GreenBlade Landscaping"...`
   ```
3. Open `components/ChatWidget.tsx`
4. Add to `NICHES` array: `{ id: 'landscaping', label: 'Landscaping' }`

That's it. The demo widget and API endpoint pick it up automatically.

## Common gotchas

- **Ollama not running?** You'll see `Ollama connection refused`. Run `ollama serve` in another terminal.
- **Anthropic 401?** Check `ANTHROPIC_API_KEY` is set in `.env.local`, not `.env`.
- **Build error on Vercel?** Make sure Node version is 20+. Vercel auto-detects.
- **Form not sending email?** Set `RESEND_API_KEY` and verify the `CONTACT_EMAIL`. Without those, leads just log to your dev terminal.

## What's next

See `BUSINESS-PLAN.md` for the business side — legal setup, pricing rationale, outreach scripts, proposal template, contracts.