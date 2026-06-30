# Ventrix Agency — Handoff Document

> **Read this first.** Complete project state for the Ventrix Agency website.
> Designed so any AI assistant can pick up where Claude Code (M3) left off.

**Last updated:** 2026-06-28
**Maintained by:** Ismael (IsmaelRosarioo on GitHub)
**Current model during build:** GLM 4.5 (`glm-5.2` on Ollama Cloud)

---

## 1. What this is

**Ventrix Agency** (ventrixagency.com) — an AI services business that builds
AI-powered websites and 24/7 receptionist agents for local home-service
businesses (plumbers, electricians, HVAC, roofers).

Three pricing tiers:
- **Starter** — $497/mo
- **Growth** — $997/mo (most popular)
- **Custom** — $2,497+/mo

This is a sole proprietorship (no LLC yet). Form one at ~$25K revenue.

---

## 2. Current deployment state

| Item | Status |
|---|---|
| Code on GitHub | ✅ github.com/IsmaelRosarioo/ventrix-agency |
| Live on Vercel | ✅ https://ventrix-agency.vercel.app |
| Custom domain | 🔄 In progress (ventrixagency.com → Vercel) |
| AI demo working | ✅ Yes — uses Ollama Cloud, model `glm-5.2` |
| Provider hidden from UI | ✅ Visitors see only "online now", not stack details |
| Contact form | ✅ Built, awaits Resend API key for email delivery |
| Outreach docs | ✅ Created |

---

## 3. Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v3 |
| Language | TypeScript |
| Hosting | Vercel (free tier) |
| AI — dev | Local Ollama (free, on user's PC) |
| AI — prod | Ollama Cloud ($20/mo Pro plan) |
| AI model | `glm-5.2` on Ollama Cloud |
| Backup AI options | Anthropic Claude API (also supported via `lib/ai.ts`) |
| Code repo | github.com/IsmaelRosarioo/ventrix-agency |
| Domain registrar | Namecheap |

**Important:** the AI provider is deliberately hidden from end users. Visitors
see "Live AI receptionist · online now" — they do NOT see "ollama cloud",
"minimax", or any provider name. The reasoning: prospects should focus on the
product, not the stack.

---

## 4. Project structure

```
ai-business-foundation/
├── app/
│   ├── layout.tsx              # Root layout with Nav + Footer
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Tailwind + base styles
│   ├── about/page.tsx          # About page
│   ├── services/page.tsx       # Services list
│   ├── pricing/page.tsx        # 3 pricing tiers
│   ├── contact/page.tsx        # Contact form (Resend integration)
│   ├── demo/page.tsx           # Live AI demo page
│   └── api/
│       ├── agent/route.ts      # POST /api/agent — chat endpoint
│       └── contact/route.ts    # POST /api/contact — form handler
├── components/
│   ├── Nav.tsx                 # Top navigation
│   ├── Footer.tsx              # Footer
│   ├── Hero.tsx                # Homepage hero with mock chat
│   ├── ServiceCard.tsx         # Service grid
│   └── ChatWidget.tsx          # Live AI chat UI (hides provider)
├── lib/
│   ├── ai.ts                   # AI provider switcher (3 providers)
│   └── prompts.ts              # System prompts per niche
├── outreach/
│   ├── first-10-prospects.md   # Walk-in visit playbook
│   ├── cold-email.md           # Cold email template
│   ├── follow-up-email.md      # Post-visit email
│   └── one-pager.md            # Print-and-leave handout
├── README.md                   # Technical setup docs
├── BUSINESS-PLAN.md            # Legal, pricing, contracts, 90-day plan
├── HANDOFF.md                  # THIS FILE — for any AI to pick up
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── .env.example
└── .gitignore
```

---

## 5. AI provider switcher (`lib/ai.ts`)

Three supported providers. Switch via `AI_PROVIDER` env var:

| Value | Uses | Cost |
|---|---|---|
| `ollama` | Local Ollama on user's PC | Free, but Vercel can't reach it |
| `ollama-cloud` | Ollama Cloud (Pro plan) | $20/mo — covers it |
| `anthropic` | Anthropic Claude API | Pay per token, ~$5–50/mo |

**Current production setting:** `ollama-cloud` with model `glm-5.2`.

The switcher lives in `lib/ai.ts`. To swap models, change env vars in Vercel:
- `AI_PROVIDER` (set to `ollama-cloud`, `ollama`, or `anthropic`)
- `OLLAMA_CLOUD_MODEL` (e.g. `minimax-m3`, `deepseek-v3.1:671b`, `gpt-oss:120b`)

---

## 6. Available models on Ollama Cloud (verified June 2026)

The user has Ollama Pro ($20/mo). Available models include:

**Best for general chat:**
- `glm-5.2` ← currently using
- `minimax-m2.7`, `m2.5`, `m2.1` (smaller, faster)
- `deepseek-v3.1:671b` (671B params, near-frontier)
- `deepseek-v4-flash` (faster, smaller)
- `gpt-oss:120b` (OpenAI's open model)
- `qwen3.5:397b` (large Qwen)
- `mistral-large-3:675b`
- `gemini-3-flash-preview`

**Specialized:**
- `kimi-k2.7-code` (coding)
- `devstral-2:123b` (code)
- `gemma3:27b`, `gemma4:31b` (smaller, faster)
- `ministral-3:8b/14b/3b` (tiny, fast)

To use a different model, just update `OLLAMA_CLOUD_MODEL` in Vercel env vars.

---

## 7. Vercel environment variables (current)

| Var | Value | Purpose |
|---|---|---|
| `AI_PROVIDER` | `ollama-cloud` | Which AI backend |
| `OLLAMA_CLOUD_API_KEY` | (rotated, never paste in chat) | Ollama Cloud auth |
| `OLLAMA_CLOUD_MODEL` | `glm-5.2` | Model name |
| `NEXT_PUBLIC_BUSINESS_NAME` | `Ventrix Agency` | Brand name in UI |
| `NEXT_PUBLIC_SITE_URL` | `https://www.ventrixagency.com` | Canonical URL |
| `NEXT_PUBLIC_PHONE` | (empty) | Phone shown in UI |
| `CONTACT_EMAIL` | `hello@ventrixagency.com` | Lead destination |
| `AGENT_TOKEN_SECRET` | (generate 32+ char secret, keep hidden) | HMAC secret for signed conversation tokens — required for multi-turn history. Without it the agent runs single-turn (no 500). |

**Still to add (not yet set):**
- `RESEND_API_KEY` — for contact form to email leads
- `ANTHROPIC_API_KEY` — backup AI provider (optional)
- `AGENT_TOKEN_SECRET` — HMAC secret for signed multi-turn history (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`). Optional now: the agent degrades to single-turn without it instead of 500-ing.

---

## 8. Critical rules when working on this project

### DO:
- Match the existing code style (TypeScript strict, Tailwind, no comments unless necessary)
- Keep the AI provider name hidden from UI
- Push changes to GitHub — Vercel auto-deploys
- Use the existing brand palette in `tailwind.config.ts` (brand blue, ink grays)
- Verify with `npm run build` locally before pushing if you change deps

### DON'T:
- DON'T expose "ollama", "minimax", or any provider name in UI text, API responses, or comments visible to prospects
- DON'T change pricing tiers without consulting the user
- DON'T add features without scoping first (this is a lean foundation)
- DON'T use Tailwind classes that aren't already in use (keep palette tight)

### Style preferences:
- Code matches surrounding density (no over-commenting, no under-commenting)
- Use TypeScript strict mode
- Server components by default; `"use client"` only when needed
- Inline styles only via Tailwind, no CSS modules

---

## 9. Git workflow

Repo: https://github.com/IsmaelRosarioo/ventrix-agency
Branch: `main` (only branch)

**To deploy changes:**
```bash
cd C:\Users\benny\Desktop\VentrixAgency\ventrix-agency
git add .
git commit -m "descriptive message"
git push
```
Vercel auto-detects the push and redeploys (~60 sec).

**Git credentials:** User has a Personal Access Token configured (rotated once after
a leak in chat). Token is in PowerShell credential helper or memory — do NOT ask
the user to paste it.

---

## 10. What still needs to happen

### Immediate (in progress):
1. **Connect ventrixagency.com** to Vercel
   - Add domain in Vercel project settings
   - Add DNS records (A record + CNAME) in Namecheap
   - Wait for propagation (5–30 min)

2. **Set up Resend** for contact form
   - Sign up at resend.com
   - Get API key
   - Add `RESEND_API_KEY` + `CONTACT_EMAIL` env vars in Vercel
   - Redeploy

### Next phase:
3. **Outreach** — user is about to walk into local trade businesses using the
   scripts in `outreach/`. Track results in a spreadsheet.

4. **First client** — likely a pilot at 50% off in exchange for case study.

### Later:
5. **LLC formation** — once revenue > $25K or first paying client signs
6. **Multi-client customization** — agent prompts, branding, content per client
7. **Stripe checkout** for self-serve signups
8. **Portfolio page** with before/after client sites

---

## 11. Brand voice & copy

- **Tone:** Direct, no-BS, conversational. Talks like a peer, not a salesperson.
- **Pricing language:** Never say "competitive pricing" or "affordable". Say exact numbers.
- **Avoid jargon:** No "synergy", "leverage", "solutions". Plain words.
- **Avoid:** Long paragraphs. Use bullets, short sentences.
- **Always include:** Specific numbers (35% of calls go unanswered, <60s response time, etc.)

Hero copy:
> "Get a website that books jobs while you sleep."
> "AI-powered websites and 24/7 receptionist agents for local home-service businesses."

Pricing page CTA:
- Starter → "Get started"
- Growth → "Get started"
- Custom → "Talk to us"

---

## 12. Key files to read first

When picking up this project, read these in order:

1. **THIS FILE** (`HANDOFF.md`) — you're doing it ✅
2. `README.md` — technical setup
3. `BUSINESS-PLAN.md` — business side, pricing, contracts
4. `lib/ai.ts` — AI provider logic
5. `lib/prompts.ts` — system prompts per niche
6. `app/page.tsx` — homepage structure
7. `app/api/agent/route.ts` — chat endpoint
8. `outreach/first-10-prospects.md` — current focus (user is starting outreach)

---

## 13. The user's working preferences

From memory:
- **Autonomous execution** — does NOT want to be asked permission for routine work
- **Impatient with friction** — wants fast iteration, prefers solving problems over discussing them
- **Already paid for:** Ollama Pro ($20/mo), Namecheap domain
- **Will share API keys in chat** — should rotate them after, don't lecture
- **Tech level:** Can use PowerShell, Git, follow instructions. Not a dev by trade but capable.
- **Time zone:** US Eastern (judging by Windows locale + working hours)

When picking up this project: just do the work, don't ask 5 clarifying questions
before starting. Pick the obvious path and execute.

---

## 14. Outreach scripts (current)

The user is about to start visiting local trade businesses. Key files:

- `outreach/first-10-prospects.md` — full walk-in playbook
- `outreach/cold-email.md` — for prospects you haven't met
- `outreach/follow-up-email.md` — post-visit email
- `outreach/one-pager.md` — print and leave behind

**The opener in person:**
> "Hey, I'm [name] with Ventrix — I help local [trade] companies get a website
> that actually books jobs instead of just sitting there. Got 3 minutes? I want
> to show you something on my tablet."

**Conversion math:** 10 visits → 4–6 conversations → 1–2 signed clients →
$1,000–$2,000/mo recurring within 2 weeks.

---

## 15. Things to NOT change without asking

- Pricing tier numbers ($497 / $997 / $2,497)
- The three tiers themselves (Starter / Growth / Custom)
- The "Ventrix Agency" brand name
- The domain (ventrixagency.com)
- The niche focus (home services — plumbers, electricians, HVAC, roofers)
- The 5 agent prompts in `lib/prompts.ts` (working well, do not regenerate)

---

## 16. How to switch AI models

If user wants to switch from `minimax-m3` to a different model:

1. Open `https://ollama.com/api/tags` to verify the new model name exists
2. Go to Vercel → ventrix-agency → Settings → Environment Variables
3. Change `OLLAMA_CLOUD_MODEL` to the new model name
4. Save
5. Go to Deployments → three dots → Redeploy
6. Wait ~60 sec
7. Test at https://ventrix-agency.vercel.app/demo (or ventrixagency.com once connected)

---

## 17. Quick reference commands

### Deploy a code change:
```powershell
cd C:\Users\benny\Desktop\VentrixAgency\ventrix-agency
git add .
git commit -m "describe change"
git push
```

### Run locally:
```powershell
cd C:\Users\benny\Desktop\VentrixAgency\ventrix-agency
npm install    # first time only
npm run dev    # http://localhost:3000
```

### Check the live site:
- https://ventrix-agency.vercel.app (Vercel domain, always works)
- https://ventrixagency.com (real domain, after DNS connects)
- https://ventrix-agency.vercel.app/demo (live AI demo)

---

## 18. Success criteria for "foundation complete"

✅ Site live on Vercel — DONE
✅ AI demo working with M3 model — DONE
✅ Domain connected — IN PROGRESS
✅ Contact form emails leads — IN PROGRESS (Resend pending)
✅ Outreach prepped — DONE
⏳ First client signed — PENDING
⏳ First case study published — PENDING

Once all checked, the user transitions from "building foundation" to "running
the business" mode. Help shifts from code to growth tactics, client onboarding,
and content.

---

*End of handoff document. Read the files referenced above to get full context.*