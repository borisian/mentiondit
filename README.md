# Comment Hub

**Reddit share of voice.** Reddit is the single most-cited domain across AI answer
engines, so what Reddit says about a brand is upstream of what ChatGPT, Perplexity and
AI Overviews will say about it. Comment Hub measures it.

Two modes:

- **Compare** — give it a category; it ranks the brands Reddit talks about, or the
  ones you pin. Built for brand and competitive tracking.
- **Recommend** — ask a question the way you would ask Reddit; it counts the places
  and titles people name in the answers, and quotes them.

Either way, every number links back to the comment it came from.

- **Part de voix** — mentions per brand, share, comments, threads, cumulative upvotes
- **Évolution** — mentions per month, per brand
- **Tonalité** — positive / neutral / negative split, scored per sentence with negation handling
- **Preuves** — the highest-upvoted comments citing each brand, with permalinks
- **Aussi mentionné** — recurring names you are *not* tracking, one click to add
- **CSV export**

## Architecture

Fastify + TypeScript on the server, Next.js 14 + Tailwind on the client. No LLM in
the loop — counting is deterministic and reproducible. Charts are hand-rolled
SVG/CSS, no charting library.

```
server/src/
  index.ts          bootstrap — buildApp().listen()
  app.ts            buildApp() — plugins, then feature modules
  context.ts        RequestContext + PLAN_LIMITS
  core/             pure domain, no I/O, no framework
  providers/        outbound I/O — reddit, search (serper | reddit)
  modules/          one folder per feature: routes + schema + service
client/src/
  app/              routes, thin
  features/analysis components, useAnalysis, api, copy, types
  components/ui/    shared primitives
  lib/              api-client, format
```

**Where the next features go.** `resolveContext` (`server/src/context.ts`) is the
only place that decides who a caller is; it returns anonymous today. Everything
downstream reads `context.limits`, so authentication means replacing that resolver
and adding plans to `PLAN_LIMITS` — no service or route changes. `runAnalysis`
(`modules/analysis/service.ts`) is transport-free: a quota check goes immediately
before it (the Serper + Reddit fan-out is the expensive part) and usage metering
immediately after. New features become `modules/auth/`, `modules/billing/`;
cross-cutting plugins register in `app.ts` ahead of the modules.

Client types mirror `server/src/core/types.ts` by hand. That is deliberate while
the wire format is small — promote it to a shared package rather than let the
copies drift.

## Setup

Create a Reddit app of type **script** at <https://www.reddit.com/prefs/apps>, then:

```bash
cd server
cp .env.example .env      # fill in client id, secret, and a descriptive user agent
npm install
npm run dev               # http://localhost:8080
```

```bash
cd client
npm install
npm run dev               # http://localhost:3000, proxies /api to the server
```

### Search provider

Thread discovery goes through Google (via [Serper](https://serper.dev), 2500 free
queries, no card) when `SERPER_API_KEY` is set, and falls back to Reddit's own search
otherwise — also on any Serper error, so a third party can never hard-stop the app.
The response carries `provider` so the UI shows which engine answered.

The key is optional but close to required for **recommend** mode: Reddit's own search
collapses on long-tail and local questions. "best brunch in Toronto" returns an
879-comment reality-TV thread; "best coffee in Lisbon" returns nothing at all.

## Things worth knowing

- **Reddit's free tier is non-commercial only** (100 req/min per OAuth client). Charging
  for anything built on this requires written approval from Reddit and a paid agreement.
  Request it before you monetise, not after.
- **Brand matching is literal.** Aliases go after a pipe: `Sony|WH-1000XM5, Bose|QuietComfort`.
  Word boundaries use lookaround, so `Sonymusic` never counts as `Sony`.
- **Sentiment is lexicon-based**, not a model. It is a fast, transparent, auditable signal —
  every score traces back to the words that moved it — but it is a signal, not a verdict.
- Up to 6 tracked brands, matching the validated 6-slot categorical palette.
