# CORPUS

AI-grounded anatomy learning platform. The UI layer is adapted from the Noax
design language — see [`docs/design-language.md`](./docs/design-language.md)
for the full token-by-token provenance.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Supabase (auth + Postgres + pgvector).

---

## Quick start

```bash
cd corpus
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

The app **runs without any configuration**. Supabase, the vector store and the
LLM endpoint all degrade to a working fallback so the product is reviewable on a
fresh clone:

| Missing | Behaviour |
|---|---|
| Supabase keys | `proxy.ts` passes through (no route gating); the auth form shows a configuration message instead of throwing |
| `SUPABASE_SERVICE_ROLE_KEY` / vector store | RAG falls back to a lexical index over the curriculum |
| `OPENAI_API_KEY` | The tutor returns a grounded, cited answer assembled from retrieval instead of streaming from a model |

Progress is stored client-side (`lib/learning/localProgress.ts`) in the exact
shape of the `learning_progress` row, so wiring Supabase is a one-module change
rather than a rewrite.

## Scripts

```bash
npm run dev        # Turbopack dev server on 0.0.0.0:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

## Routes

| Route | What it is |
|---|---|
| `/` | Landing — hero, marquee, method, curriculum, tutor preview |
| `/login`, `/signup` | Email + password auth (cream "paper" surface) |
| `/dashboard` | Mastery by lesson and by system, quiz accuracy |
| `/learn/[lessonId]` | Lesson: prose → structure → clinical callout → quiz |
| `/anatomy/[structureId]` | Atlas viewer (isolate / labels / related) |
| `/tutor` | Streaming AI tutor with inline source chips |
| `/api/tutor/chat` | `POST` — provenance frame, then streamed text |
| `/api/rag/search` | `GET ?q=` — retrieval only |
| `/auth/callback`, `/auth/signout` | Supabase OAuth / magic-link handlers |

## Previewing on a phone

The Arena sandbox preview is **gated to the Arena client** — it will not open in
a standalone browser tab, and it cannot be tunnelled out, because sandbox egress
only reaches `registry.npmjs.org` and `github.com`.

Two options that actually work:

**1. Open Arena itself on the phone.** The preview is an iframe inside the chat,
so opening this conversation in a mobile browser renders it there. The app is
responsive down to 390px, so this is a genuine mobile check, not a shrunken
desktop view.

**2. Deploy for a standalone URL.** Vercel is the path of least resistance:

- Import the repository, set **Root Directory** to `corpus` (the app is not at
  the repo root).
- Framework preset: Next.js — no `vercel.json` needed.
- No environment variables are required for a reviewable deploy; the app runs
  on its fallbacks. Add `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` to switch on route protection and real auth.

### Why not a static export / GitHub Pages

Verified: `output: "export"` fails to build. The app has server route handlers
(`/api/tutor/chat`, `/api/rag/search`, `/auth/callback`, `/auth/signout`) and
`/login` reads `searchParams` — none of which exist in a static export. Making
one would mean deleting the API layer, i.e. changing the architecture rather
than just the presentation. Not worth it for a preview.

## Database

```bash
# paste supabase/schema.sql into the Supabase SQL editor
```

It creates `profiles`, `learning_progress`, `quiz_attempts`, `document_chunks`
(pgvector, 1536-dim) and the `match_documents` RPC that
`lib/rag/retrieve.ts` calls, with row-level security on every learner-owned
table.

---

## Architecture

```
app/                  routes (App Router)
  (auth)/             login, signup        — cream surface
  (app)/              dashboard, learn, anatomy, tutor — dark app shell
  api/                tutor/chat, rag/search
  auth/               callback, signout
components/
  ui/                 Button, Card, Chip, Field, ProgressRing, Reveal, AuthForm
  layout/             SiteHeader, MenuOverlay, SiteFooter, Preloader, AppSidebar, TopBar
  sections/           Hero, Marquee, FeatureGrid, SystemGrid, TutorPreview, CTA
  learning/           LessonBlocks, QuizCard, LessonTracker, AnatomyViewer, DashboardShell
  tutor/              TutorPanel, ChatBubble, Composer
hooks/                useReveal, useCountUp, useReducedMotion, useMenuOverlay
lib/
  supabase/           client (browser), server (cookies), admin (service role), middleware
  learning/           curriculum, progress (pure maths), quiz, localProgress
  rag/                retrieve — pgvector primary, lexical fallback
  ai/                 prompt (persona + grounding), tutor (streaming transport)
styles/               tokens, base, motion, components
supabase/             schema.sql
proxy.ts              session refresh + route protection (Next 16 `proxy` convention)
```

### Layering rule

`lib/` is pure and framework-agnostic — `computeMastery`, `scoreAnswers`,
`summariseBySystem` and `computeStreak` take data in and return data out, with no
React and no database. Components never compute learning maths inline, and no
API route contains presentation logic. That is what makes the UI swappable
without touching the product.

### Where the 3D viewer goes

`components/learning/AnatomyViewer.tsx` owns layer state (`isolated`, `labels`)
and structure selection, and renders `.cx-stage` as the mount point. Dropping in
three.js or `<model-viewer>` means adding an effect inside that one component —
no layout or state changes elsewhere.

## Design system

All four stylesheets are plain CSS custom properties, so the design language is
portable out of this app:

- `styles/tokens.css` — colour, fluid type scale, spacing, the full Noax easing
  library, radii, z-index, and the three surfaces
- `styles/base.css` — reset, typography, container, focus, scrollbar
- `styles/motion.css` — reveals, mask lines, marquee, peel, reduced motion
- `styles/components.css` — button, chip, card, field, menu, preloader,
  progress, chat, stage

Tailwind v4 is configured with `source(none)` + explicit `@source` directives in
`app/globals.css`, so it only scans this app and not the Noax mirror that shares
the repository root.

---

## Verified

- `npm run build` — 25 static pages, no errors
- `npm run typecheck` — clean
- `npm start` then all 8 routes: `200`, unknown path `404`
- `GET /api/rag/search?q=femoral+neck+fracture` returns a scored hit
- `POST /api/tutor/chat` streams a provenance frame + grounded answer
- Generated CSS contains every design token and every arbitrary utility used by
  the components, and contains no Noax mirror classes
- Dev-mode request log: no React warnings, no hydration errors, no deprecations

**Not verified:** rendering in a real browser. Headless Chrome cannot be
installed in this sandbox (`storage.googleapis.com` is unreachable), so
hydration, animation timing and responsive layout at real breakpoints are
unchecked. The server-rendered HTML was inspected instead and matches each
component's initial client state.
