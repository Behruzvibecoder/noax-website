# CORPUS design language — adapted from Noax

The reference implementation is the Noax mirror that lives one level up in this
repository (`../main.css`, `../index.html` — a 1:1 capture of trevornoah.com).
Everything below states **what was taken from Noax, what was changed, and why**.

Nothing here is a 1:1 clone: Noax is a personal-brand site built around a WebGL
portrait; CORPUS is a learning product that has to be readable for hours, carry
dense clinical content, and stay usable on a phone in a lecture hall. The
*grammar* is Noax's. The *vocabulary* is anatomy.

---

## 1. Colour

Kept **exactly** as Noax, by product decision.

| CORPUS token | Value | Noax origin | Role in CORPUS |
|---|---|---|---|
| `--color-ink` | `#1d2440` | `--color-background` / `--color-primary` | Default app canvas |
| `--color-ink-deep` | `#1a2037` | `--color-surface-deep` | Cards, atlas stage |
| `--color-ink-tint` | `#3e486f` | `--color-surface-deep-tint` | Hover fills |
| `--color-ink-muted` | `#6f7ba9` | `--color-surface-deep-muted` | Secondary text on navy |
| `--color-cream` | `#f9fcf4` | `--color-surface` | Foreground on navy; auth canvas |
| `--color-cream-tint` | `#edf4f4` | `--color-surface-tint` | Paper surfaces |
| `--color-blush` | `#ff9bb4` | `--color-accent` | Primary accent, CTAs, mastery |
| `--color-hairline` | `#f2f1ff` | `--color-border` | 1px rules |
| `--color-pill` / `--color-pill-stroke` | `#46517b` / `#615e83` | same | Chips |
| `--color-crimson` | `#c6313e` | `--color-heart` | **Repurposed** as the anatomical accent |
| `--color-night` | `#2b2b2b` | `--color-dark` | Full-screen menu overlay |

**The one deliberate change:** Noax uses `--color-heart` for a single decorative
heart. CORPUS promotes it to `--color-crimson` — the accent on cream ("paper")
surfaces and on clinical callouts — because the blush pink is too soft to carry
"this is a clinical warning" at small sizes, and because a warm arterial red
reads correctly inside an anatomy product.

### Three surfaces, not one theme

Noax alternates a WebGL stage with content blocks. CORPUS formalises that into
three scoped surfaces (`styles/tokens.css`), switched by class:

| Class | Canvas | Foreground | Used for |
|---|---|---|---|
| *(default)* | navy | cream | Landing, app shell, atlas |
| `.surface-cream` | cream | navy | Auth, footer, editorial |
| `.surface-stage` | deep navy | cream | 3D viewer stage |

Each surface redefines the six `--cx-*` semantic variables. Components only ever
reference `--cx-canvas`, `--cx-foreground`, `--cx-accent`, `--cx-line`,
`--cx-muted` — so a component works on any surface with no conditional styles.

---

## 2. Typography

Noax ships *Die Grotesk C/D/B*, which are Webflow-licensed and not
redistributable. CORPUS keeps the **structure** and substitutes open faces:

| Noax | CORPUS | Token |
|---|---|---|
| Die Grotesk D (display) | Bricolage Grotesque | `--font-display` |
| Die Grotesk C (text) | Familjen Grotesk | `--font-sans` |
| Die Grotesk B (meta) | Familjen Grotesk, +0.08em, uppercase | `--font-meta` pattern |

Both stacks end in system grotesques, and fonts are loaded with a stylesheet
link rather than `next/font/google` **so the build never needs network access to
fonts.googleapis.com**. Offline, the fallback stack renders and the layout holds.

### The scale is Noax's, verbatim

All fluid clamps are lifted unchanged from `../main.css` (1920 / 390 design
widths):

```
--font-size-h2:      clamp(2.5rem, 1.07658rem + 5.66535vw, 7.875rem)
--font-size-h3:      clamp(2.5rem, 2.00346rem + 1.97628vw, 4.375rem)
--font-size-h4:      clamp(.75rem, .452075rem + 1.18577vw, 1.875rem)
--font-size-body:    clamp(1.125rem, 1.0919rem + .131752vw, 1.25rem)
--font-size-pill:    clamp(.75rem, .700346rem + .197628vw, .9375rem)
--font-size-marquee: clamp(3.125rem, .642292rem + 9.88142vw, 12.5rem)
--font-size-menu:    clamp(2.0625rem, 1.28458rem + 3.09618vw, 5rem)
--font-size-counter: clamp(5rem, 1.02941rem + 16.1765vw, 14rem)
```

Two sizes were **added** rather than copied:

- `--font-size-display: clamp(4.5rem, 1.4rem + 12.5vw, 20rem)` — Noax's `h1`
  tops out at 28.125rem (450px), which is a wordmark, not a headline. CORPUS
  needs a large-but-sane hero line, so the hero uses `--font-size-h1`
  (13rem max) and `--font-size-display` is reserved for statement type.
- Body line-height is 1.4 on Noax's scale, but lesson prose uses **1.65**.
  Noax sets 1.4 for marketing copy of two or three lines; 600 words of
  clinical text at 1.4 is genuinely hard to read.

Letter-spacing is `0` on every display size, exactly as Noax specifies.

---

## 3. Motion

Noax's easing library is imported whole (`styles/tokens.css`), including the
three bounce curves that give the site its character:

```
--ease:              cubic-bezier(.645, 0, 0, 1)      /* signature */
--ease-custom:       cubic-bezier(.215, .61, .355, 1) /* reveals */
--ease-bounce:       cubic-bezier(.17, .67, .3, 1.33) /* hover */
--ease-bounce-smooth:cubic-bezier(.5, 1.8, .62, 1)
```

| Noax interaction | CORPUS equivalent | Where |
|---|---|---|
| `.button_pill` rotates `-5deg` + `scale(1.02)` on hover | Same, on every button | `styles/components.css` `.cx-button` |
| `.button` wipes in via `clip-path: inset()` on page enter | Same, on the header CTA | `.cx-wipe` |
| `.menu_wrap` unfolds with `clip-path: inset(0 0 100% 0)` over 0.9s | Full-screen nav overlay | `.cx-menu` |
| Menu items' underlines `scaleX(0→1)` on a `0.12s` stagger | Same | `.cx-menu__item::before` |
| `.preloader_percentage` counter | Session-first counter | `components/layout/Preloader.tsx` |
| `[data-marquee]` with accent drop-shadow | Anatomical-term marquee | `components/sections/Marquee.tsx` |
| `.card_peel` rotates `-2deg` on hover | Card tilt + accent corner flap | `.cx-peel`, `.cx-card__peel` |
| `.social_link circle` `stroke-dashoffset` from `--progress` | Mastery rings | `components/ui/ProgressRing.tsx` |
| Hero logo parts `translateY(110% → 0)` on `--i * 50ms` | Masked line reveals | `.cx-mask-line`, `useReveal` |

### What was removed, and why

- **Page-transition (Taxi.js) choreography.** Noax animates whole-route
  transitions with a WebGL hand-off. CORPUS uses App Router; faking route
  transitions without a real renderer would add latency to the one thing a
  learner does most — open the next lesson. Reveals are per-section instead.
- **The 3D portrait.** Replaced by `.cx-stage`: a dark panel with a guide grid
  and a scan line, sized and positioned as the mount point for the anatomy
  viewer. `AnatomyViewer` already owns layer/selection state, so wiring
  three.js or `<model-viewer>` in is an effect, not a redesign.
- **Cookie banner, tour head, book peel.** No CORPUS equivalent.

### Reduced motion

Noax zeroes every duration token under `prefers-reduced-motion` rather than
hiding elements. CORPUS does the same (`styles/motion.css`) **and** every hook
resolves to its end state immediately — `useReveal` sets visible, `useCountUp`
jumps to the final number, the preloader completes instantly. Nothing is gated
behind an animation.

---

## 4. Layout & components

- **Container** uses Noax's grid maths verbatim:
  `--grid-margin: clamp(20px, …, 60px)`, `--grid-max: calc(1920px - margin*2)`.
- **Section rhythm** uses Noax's fluid spacing scale (`--spacing-fluid-*`), so
  vertical space scales with the viewport instead of being a fixed 96px.
- **Buttons** keep Noax's pill geometry (`height` → `radius: height/2`) and the
  lg/sm variants derived from its `--button-height-lg`.
- **Chips** reuse Noax's `--color-pill` / `--color-pill-stroke` pair at the
  `--font-size-pill` size, uppercased — for level, system and status labels.
- **Focus** is a wide ring in the accent colour with `--focus-offset`, matching
  Noax's `--focus-*` set. Every interactive element is keyboard-reachable, and
  there is a skip link that appears on focus.

### Responsive

The Noax grid margins are the responsive system: they collapse 60px → 20px
automatically. On top of that:

- Header nav collapses to the overlay under `lg`; the overlay's display type
  is fluid, so it still fits a 390px viewport.
- The app sidebar becomes a **horizontal scroller** on mobile rather than a
  drawer — one tap instead of two, and lesson content keeps full width.
- Atlas layout goes from two columns to one under `xl`, with the viewer first.
- The marquee, stage and cards use `aspect-ratio`, so nothing reflows on rotate.

---

## 5. Files

| File | Contents |
|---|---|
| `styles/tokens.css` | Colour, type scale, spacing, easings, radii, z-index, surfaces |
| `styles/base.css` | Reset, typography, container, focus, selection, scrollbar |
| `styles/motion.css` | Keyframes, reveal/mask/marquee/peel utilities, reduced motion |
| `styles/components.css` | Button, chip, card, field, menu, preloader, progress, chat, stage |
| `app/globals.css` | Entry point; `@source` directives scoped to this app |
| `hooks/` | `useReveal`, `useCountUp`, `useReducedMotion`, `useMenuOverlay` |

`app/globals.css` uses `@import "tailwindcss" source(none)` plus explicit
`@source` directives. That is deliberate: this app sits inside a git repository
whose root also contains the multi-megabyte Noax mirror, and Tailwind v4's
automatic content detection would otherwise crawl it.
