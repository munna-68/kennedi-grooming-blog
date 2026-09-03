# Main Site Reference — Kennedi's Grooming Studio

> **This repo (`kennedi-grooming-blog`) is NOT a standalone design.**
> It is the `/blog` **extension** of the main marketing site at **`../kennedis-studio`** (Vite + React + Tailwind, live at https://www.kennedigroomingstudio.com). Every header, button, spacing token, and decorative detail in the blog must visually mirror the main site. When in doubt: open the main site source — don't re-approximate.

## Where the main site lives

- **Sibling repo on disk:** `../kennedis-studio` (one directory up from this repo)
- **Live:** https://www.kennedigroomingstudio.com — `/blog/*` is Vercel-rewritten to this Next.js app (see `../kennedis-studio/vercel.json` → `basePath: '/blog'` here in `next.config.mjs`)
- The blog deploys separately (`kennedi-grooming-blog.vercel.app`) but is served under the main domain. Treat the two as one visual system.

## Files you must read before styling anything

| What | Main site path | What it defines |
|------|----------------|-----------------|
| Header / nav / hero / sections / footer | `src/App.jsx` (lines ~711: header, ~812: CTA, ~741: nav) | Exact classNames, container sizing, breakpoints |
| Design tokens | `src/index.css` (`@theme` + `:root`) | `--color-primary: #8AC2A7`, `--color-sage: #D4E8E0`, `--color-pink: #FFDDF4`, `--radius-btn: 16px`, fonts `Brasika Display` + `Times New Roman MT`, transitions, `backdrop-blur-md: 12px` |
| Heart-dot decoration | `src/components/HeartDottedText.jsx` | **Current** shipped version (23-path 335×335 hand-drawn heart, NOT the outdated `HEART-DOTTED-I.md` which documents an old 20×20 geometric heart + `heartSize: 0.3` / `top: +0.06`) |

> ⚠️ `HEART-DOTTED-I.md` in the main repo is **STALE** — it describes a 20×20 `fill="currentColor"` heart with `heartSize = 0.3 * charHeight`. The actual deployed component (confirmed in `dist/assets/index-CDQ8WofB.js` and live at `https://www.kennedigroomingstudio.com/assets/index-CDQ8WofB.js`) uses the 335×335 painted-heart asset at `heartSize = charHeight * 0.55`, `top: -heartSize*0.05`, `filter: invert(1)` for `lightText`. Always copy the component source, not the doc.

## How to keep the blog in sync

1. **Copy classNames/CSS verbatim** from `src/App.jsx` + `src/index.css`, then map Tailwind utilities to the blog's `app/globals.css` classes (e.g. `gap-4` → `16px`, `text-[11px]` → `11px`, `tracking-widest` → `0.1em`, `px-8 py-3` → `12px 32px`, `shadow-sm` → `0 1px 3px rgba(0,0,0,.1)`).
2. **Never invent new decoration variants** — if a heading needs hearts, use `HeartDottedText` exactly as the main site does; don't make a simplified SVG.
3. **Breakpoints must match:** nav `hidden lg:flex` (=768px for CTA `hidden md:inline-flex`, =1024px for desktop nav) — blog's `app/globals.css` media queries already mirror these.
4. **Test at 1024px + 1440px** — the main site's header is tight at `lg` (1024px) with 9 links; the blog has 10 links (Policy added), so pixel-exact values matter.

## Design tokens to reuse

```css
--color-primary: #8AC2A7; --color-sage: #D4E8E0; --color-pink: #FFDDF4;
--radius-btn: 16px; /* main site — blog had pill (999px) div, nav CTA now uses 16px */
font-display: Brasika Display (src: /brasika-display-trial-v2.otf, also blog/app/fonts/…)
body font: 'Times New Roman MT', serif; serif headings: Brasika Display;
header: bg rgba(255,255,255,.9), backdrop-blur 12px, border sage/45 (212,232,224,45%)
```

## 2026-09 Sync — what was fixed and why

The 4 mismatches that were corrected (details preserved for next agents):

1. **Nav logo truncation** — main logo uses `<a class="flex gap-2 sm:gap-3 shrink-0">` + brand `HeartDottedText as="span"` with `whitespace-nowrap` + `clamp(0.62rem,1.15vw,0.95rem)` — no `overflow:hidden`/`text-overflow:ellipsis`, container `max-w-7xl px-6 lg:px-12`. Blog had `min-width:0` chain + `overflow:hidden` + `text-overflow:ellipsis` → "Kennedi's Grooming S…". Fix removed those constraints, made brand full-width via `flex-shrink:0` + `clamp(0.62rem,1.15vw,0.95rem)` + removed mobile `max-width` cap.

2. **BOOK NOW wrap** — main button: `hidden md:inline-flex … px-8 py-3 bg-black text-white shadow-sm text-xs uppercase` + `borderRadius: 16px` (height 40px). Blog had `11px 20px`, `0.64rem`, `min-height:44px`, no `white-space:nowrap` → text broke to "BOOK"/"NOW" when flex line tightened. Fix: `12px 32px`, `0.75rem/1rem`, `border:0`, `white-space:nowrap`.

3. **Nav gap** — main nav: `gap-4` (16px), links `text-[11px] tracking-widest (0.1em)` color `rgba(0,0,0,.75)` hover `primary`. Blog had `clamp(13px,1.7vw,25px)` + `0.68rem/0.12em`. Fix: `gap:16px`, `11px/0.1em/nowrap`.

4. **Heart-dot** — see HeartDottedText row above; 1:1 port guarantees the scattered small tilted hearts (one per lowercase "i") positioned `left: center - size/2`, `top: -size*0.05` above the dot, size `0.55*charHeight`, painted 335×335 asset with `invert(1)` for `lightText`.

5. **Nav font stack** (2026-09) — blog's `--font-sans` / `.navbar-desktop` / `.site-footer` had a `Georgia` fallback (`'Times New Roman MT', Georgia, serif`) while main uses `'Times New Roman MT', serif` verbatim. On machines without Times New Roman MT, Georgia fallback rendered nav links ~7% wider (648px vs 606px total) and the BOOK NOW button wider. Fix drops Georgia in those three spots; `--font-serif` (Georgia) still serves article/serif contexts like main's `font-serif`.
6. **Mobile drawer icons** (2026-09) — icon SVGs carried Tailwind `w-6 h-6 text-[#4A5D4A]`, dead without Tailwind, so SVGs stretched to 48px filling the circle (main: 24px icon in 48px circle). Fix: `.navbar-mobile-icon svg { 24px; color: #4A5D4A }`.
7. **Mobile drawer utilities** (2026-09) — `col-span-2 mx-auto w-full max-w-[50%]` + `absolute left-20 bottom-24 …` classes are dead without Tailwind. Replaced with `.navbar-mobile-item--wide` (`grid-column: span 2; margin-inline: auto`, matching main's `col-span-2 mx-auto`) and `.navbar-mobile-star-one/two` (80/96px, 96/112px). Also aligned micro-spacing: grid row gap 20→24px, top pad bottom 22→24px, bottom pad bottom 28→32px, script 1.45rem→1.5rem + `tracking-wide`, kicker weight 700→500 + mb 20px, CTA weight 800→700.
8. **Drawer order + CTA contrast** (2026-09) — blog had Mobile 6th of 10 (Gallery stranded, Policy|Blog extra row); main is 8 pairs + Mobile wide last, Policy footer-only. Fix: `mobileLinks` = Home, About, Dog, Cat, Gallery, FAQ, Reviews, Blog, Mobile (Policy stays in footer, desktop has none either). Also fixed dark-on-dark BOOK NOW: `.navbar-mobile a` (0,1,1) beat `.navbar-mobile-cta` (0,1,0) → added `.navbar-mobile a.navbar-mobile-cta { color:#fff }`. Verified white + order in browser.
9. **Dev-server fragility** — two recurring dev-only (never production `next build`) failures, both fixed by `pkill -f "next dev"; rm -rf .next` + single restart: (a) duplicate dev processes corrupting the cache (`__webpack_modules__[moduleId] is not a function`); (b) stale chunk manifest 404s (`main-app.js`, `app-pages-internals.js`) leaving SSR HTML unhydrated (drawer clicks dead, no React props; hero `.reveal` content stuck invisible = "empty section on top"). Diagnose via DevTools Network for `_next/static` 404s.
10. **Hero bg + empty-mark** (2026-09) — `.blog-hero` used `background:` shorthand, wiping the `.grid-accent` dot grid (main sets `backgroundColor`, preserving dots). Fix: `background-color`. Empty-state mark: replaced ♡ glyph (italic side-bearings sat ink off-center) with a 34px stroke SVG heart (same doodle path as main reviews) for geometric centering — verified mark/heading/SVG centers all equal. `BlogMotion` now also refreshes ScrollTrigger on `load` + `fonts.ready`, plus a 2.5s safety net revealing any still-hidden above-fold `.reveal`/`.reveal-text` instead of leaving a gap.

## When adding new blog UI

- Grep the main site for the nearest equivalent section first (`rg -n "className" ../kennedis-studio/src/App.jsx`).
- Reuse its classes/tokens exactly; if a token doesn't exist here yet, add it under the same name.
- Keep the blog's Notion content (Pages → Notion DB) separate from chrome — chrome stays a mirror of the main site.

_Last verified: 2026-09-03 against deployed `assets/index-CDQ8WofB.js` matching `src/components/HeartDottedText.jsx` (77a1adc "all the i with the svg")._
