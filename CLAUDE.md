# Ventrix Agency — Agent Instructions

> Auto-loaded by Claude Code at the start of every session in this repo.
> Source of truth for guardrails, stack, and workflow. Human-readable context
> lives in HANDOFF.md / BUSINESS-PLAN.md / README.md — read those for depth.

## Identity

**Ventrix Agency** — sells AI-powered websites + 24/7 AI receptionist agents to
local home-service businesses (plumbers, electricians, HVAC, roofers).
Live at https://ventrixagency.com (Vercel, auto-deploys from `main`).

## Tech stack

- Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v3
- Hosting: Vercel free tier · Repo: github.com/IsmaelRosarioo/ventrix-agency
- AI prod: Ollama Cloud, model `glm-5.2` (Pro $20/mo)
- AI provider switcher: `lib/ai.ts` — `AI_PROVIDER` = `ollama` | `ollama-cloud` | `anthropic`
- Email: Resend, sends from `hello@ventrixagency.com` (domain verified)

## Codebase map

```
app/                    Next.js App Router
  page.tsx              Homepage (Hero + mock chat)
  about|services|pricing|contact|demo/   Marketing pages
  api/agent/route.ts    POST — live AI chat endpoint
  api/contact/route.ts  POST — contact form → Resend
components/             Nav, Footer, Hero, ServiceCard, ChatWidget
lib/ai.ts               AI provider switcher (3 providers)
lib/prompts.ts          System prompts per niche (5 — DO NOT regenerate)
outreach/               Walk-in playbook, cold/follow-up email, one-pager
tailwind.config.ts      Brand palette (brand blue, ink grays)
```

## Guardrails — DO NOT violate

- **NEVER expose the AI provider** in UI text, API responses, comments, or error
  messages. No "ollama", "minimax", "anthropic", "claude" anywhere a prospect sees.
  Visitors see only "Live AI receptionist · online now".
- **NEVER change pricing** ($497 / $997 / $2,497) or the three tiers (Starter / Growth / Custom).
- **NEVER regenerate the 5 prompts in `lib/prompts.ts`** — they're tuned and working.
- **NEVER change** the brand name "Ventrix Agency", the domain, or the home-service niche.
- Don't add features without scoping first — this is a lean foundation.
- Don't introduce Tailwind classes outside the existing palette in `tailwind.config.ts`.
- **Don't weaken `/api/agent` protections** — it enforces same-origin, per-IP rate
  limiting (12/min), input caps (≤20 msgs, ≤1000 chars each), forced user/assistant
  roles (no client `system`), and sanitized errors. These stop quota abuse, prompt
  injection, and provider/prompt leakage. Re-add any removed check before deploying.

## Style

- Match surrounding code density. Comments only where necessary.
- TypeScript strict mode. Server components by default; `"use client"` only when needed.
- Styling via Tailwind only — no CSS modules, no inline `style={{}}`.
- Brand voice: direct, no jargon ("synergy", "leverage", "solutions" banned),
  no "competitive/affordable" — always exact numbers. Short sentences, bullets.

## Deploy workflow

```bash
git add . && git commit -m "..." && git push   # Vercel auto-deploys ~60s
```
- Verify with `npm run build` locally before pushing if deps changed.
- Git credentials are configured (PAT in credential helper) — never ask the user to paste tokens.
- Secrets live in Vercel env vars, never in code. Never paste API keys into chat.

## Vercel env vars (current)

`AI_PROVIDER=ollama-cloud` · `OLLAMA_CLOUD_MODEL=glm-5.2` ·
`OLLAMA_CLOUD_API_KEY` (secret) · `RESEND_API_KEY` (secret) ·
`CONTACT_EMAIL=hello@ventrixagency.com` ·
`NEXT_PUBLIC_BUSINESS_NAME=Ventrix Agency` ·
`NEXT_PUBLIC_SITE_URL=https://ventrixagency.com` ·
`NEXT_PUBLIC_PHONE` (empty).

## Session protocol

- Default to autonomous execution. Pick the obvious path and do the work;
  don't ask 5 clarifying questions first.
- After meaningful work, update `HANDOFF.md` "current deployment state" if status
  changed, and keep this file + the codebase map in sync.