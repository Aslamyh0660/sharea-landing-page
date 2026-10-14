# Sharea · شارع — Universal Verified-Location Landing Page

A single, universal page that every printed **Sharea** verification stand
links to. When a visitor scans the QR code on a stand at an approved hotel or
business, this page tells them clearly:

> **The place where you scanned this code is approved and trusted by Sharea.**

One page. One QR code. No per-venue routes, records, or parameters — and no
fabricated verification IDs, dates, or security claims.

Design: **Material 3 Expressive** via [shadcn M3E](https://shadcn-m3e.crystaworld.dev)
(a shadcn registry over React 19 + Base UI), flat luxury navy-and-gold theme,
Arabic-only RTL content, mobile-first.

---

## Stack

| Layer      | Choice                                                              |
| ---------- | ------------------------------------------------------------------- |
| Build      | Vite 7 + TypeScript                                                 |
| UI         | React 19 + shadcn M3E components (`@m3e` registry, Base UI)          |
| Styling    | Tailwind CSS v4 + M3E design tokens (`src/lib/m3e/m3e.css`)          |
| Fonts      | Noto Kufi Arabic (headings) · IBM Plex Sans Arabic (body/UI) · Cormorant Garamond (Latin wordmark) — self-hosted WOFF2, OFL |
| Icons      | Material Symbols Rounded, bundled per-glyph (no icon font)           |
| Theme      | Frozen M3 scheme generated from brand seeds with `@material/material-color-utilities` |
| Backend    | Like counter: Cloudflare Pages Function + KV (production), any endpoint speaking the same contract |
| Deploy     | Cloudflare Pages (`wrangler.toml` included)                          |

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # serve the production build locally
```

Node 20+ recommended. `bun` is only needed for `npm run gen:tokens` and
`npm run verify:theme` (the theme tooling).

## Editing the Arabic content

Everything visible lives in **`src/config.ts`** — section headings, the seven
services (icon + title + description), trust values, the slogan, and the
footer line. Edit there; no component changes needed for copy.

Arabic quality rules used in this file (keep them when editing): hamzas
(أ إ ء ئ ؤ), taa marbuta (ة) vs haa (ه), alef maqsura (ى) vs yaa (ي), Arabic
punctuation (، ؛ ؟), and **no Persian-only letters** (پ چ ژ گ ک ی) — use
Arabic ك and ي. Latin handles/URLs are isolated with `<bdi dir="ltr">` in the
components.

## Changing the links

Also in `src/config.ts`:

```ts
export const TELEGRAM_URL = "https://t.me/Sharea_qombot"   // the bot (note: qombot with q)
export const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/…"
```

The WhatsApp group button is an active link and uses the site's semantic green
Material 3 color roles.

## Replacing the portrait

Drop the new image at **`public/assets/portrait.jpg`** (square works best).
It is shown exactly as supplied — the circular crop and gold ring are CSS, no
pixels are edited. The favicon/app icons are separate (see below) and keep
the «ش» monogram.

## Changing the theme colors (seed and tones)

The brand → M3 mapping is generated, not hand-painted:

1. Edit `BRAND` / `SCHEME_OPTIONS` in **`scripts/gen-tokens.mjs`** (navy seed
   `#0F2A4A`, gold tertiary `#D4A24C`, optional role overrides).
2. Mirror the same values in **`src/lib/site/theme.ts`** (used only if you
   re-enable the runtime provider).
3. Regenerate and verify:

   ```bash
   npm run gen:tokens     # rewrites src/lib/m3e/theme-sharea.css + docs table (bun)
   npm run verify:theme   # proves the frozen CSS == the library's generator (bun)
   ```

The full brand → role / tone / hex mapping and the WCAG contrast table live in
**`docs/COLOR_MAPPING.md`**.

## Adding Material icons

1. Use it: `<Icon name="rocket_launch" />` (or add it to a runtime list —
   see the `// @icons …` comment in `src/config.ts`).
2. Bundle it (downloads exactly the used glyphs, outlined + filled):

   ```bash
   npm run gen:icons     # rewrites src/components/m3e/icon-data.app.ts
   npm run check:icons   # CI check: every used glyph exists and is bundled
   ```

## Configure the like backend (production, Cloudflare Pages)

The counter is one global number with per-IP rate limiting and honest failure
states. The client (`src/lib/likes.ts`) talks to `/api/likes`:

```
GET  /api/likes            → { ok: true, count }        | 503 { ok: false }
POST /api/likes {action}   → { ok: true, count, liked } | 429 / 400 / 503
```

Setup on Cloudflare Pages:

1. Create the KV namespace:
   `npx wrangler kv namespace create LIKES_KV`
2. Paste the returned id into **`wrangler.toml`** (`id`, and `preview_id` if
   you want deploy previews to work too).
3. Deploy (`npm run deploy` or connect the repo in the Pages dashboard —
   build command `npm run build`, output `dist`).

No secrets are required by the site code. localStorage on the visitor's
device only *discourages* repeat likes; the KV rate-limit marker is the
server-side guard. Neither is presented as "one person, one like".

The function source is **`functions/api/likes.ts`**. Any backend that speaks
the contract above works (the bundled sandbox preview uses a Prisma route
handler with the same JSON shapes).

## Regenerate the universal QR code

One QR points at the canonical page URL. After you know the final URL:

```bash
npm run qr -- --url https://your-domain/
```

writes to `assets/qr/`:

| File            | Use                                            |
| --------------- | ---------------------------------------------- |
| `qr-plain.png`  | high-res black/white (default 1024px class)    |
| `qr-plain.svg`  | print-ready vector, quiet zone preserved       |
| `qr-styled.png` | brand style: navy modules on warm off-white   |
| `qr-styled.svg` | brand style, vector                            |

Every PNG is decode-verified with OpenCV before the script exits.

## Deploy / redeploy

**GitHub Pages (static deployment):** the workflow in
`.github/workflows/pages.yml` builds this repository and publishes `dist/` at
`https://aslamyh0660.github.io/sharea-landing-page/`. The Pages build uses the
repository subpath as Vite's base URL. GitHub Pages does not run the Cloudflare
Pages Function, so the like counter remains unavailable there until a backend
is configured; the page reports that state rather than inventing a count.

**Cloudflare Pages (recommended — the like function ships with the repo):**

- Git-connected: push the repo, "Create a project" in the Pages dashboard,
  framework preset *None*, build `npm run build`, output `dist`. Functions in
  `functions/` deploy automatically.
- CLI: `npx wrangler login` once, then `npm run deploy` (build + deploy).

### After your first deploy (checklist)

- [ ] `npm run qr -- --url https://<your-domain>/` and hand the new QR to the
      print shop.
- [ ] Point `og:image` / `twitter:image` in `index.html` at the absolute
      `https://<your-domain>/assets/og.png`.
- [ ] Optional: point a custom domain in the Pages dashboard.

## Project structure

```
├── index.html                  RTL entry, meta/OG, font preloads (post-build)
├── src/
│   ├── config.ts               ✏️ ALL visible content + links
│   ├── main.tsx                entry (frozen-theme note inside)
│   ├── App.tsx                 section composition A–H
│   ├── index.css               Tailwind + fonts + the two custom motion rules
│   ├── components/m3e/         shadcn M3E components (you own these)
│   ├── components/site/        TopBar, Hero, Ribbon, Grid, Trust, Like, CTA, Footer
│   └── lib/
│       ├── m3e/                tokens (m3e.css) + frozen theme (theme-sharea.css) + cn/color
│       └── site/               asset helper, theme options, likes client
├── functions/api/likes.ts      production like backend (CF Pages + KV)
├── scripts/                    gen-tokens, verify-theme, icons, preload-fonts, make-qr
├── public/assets/              portrait, favicon set, OG image, QR output
├── docs/COLOR_MAPPING.md       brand → M3 roles, tones, WCAG table
├── wrangler.toml               CF Pages + KV binding
└── components.json             @m3e registry (add more components anytime)
```

## Adding more M3E components

`components.json` registers the `@m3e` namespace:

```bash
npx shadcn@latest add @m3e/dialog   # example
```

> Note: the registry host may sit behind a bot challenge in some networks —
> the components in this repo were installed from the same registry's source
> (MIT, github.com/Crysta1221/shadcn-m3e), and hand-copying from there is the
> documented fallback.

## Motion & accessibility contract

- The only ambient motion is the services ribbon (pauses on hover/touch;
  static hand-scrollable row under `prefers-reduced-motion: reduce`).
- One reveal-on-first-view effect; without JS nothing is ever hidden.
- All interactive targets ≥ 44px, visible M3 focus rings, `aria-pressed` on
  the like toggle, polite live region for like/copy status.
- Colors: every text/background pair in the dark theme is WCAG AAA
  (see `docs/COLOR_MAPPING.md`).
