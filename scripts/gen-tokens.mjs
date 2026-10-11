// Sharea frozen theme generator — `npm run gen:tokens`
//
// Generates the M3 color scheme for Sharea from the brand seed colors using
// Google's material-color-utilities, exactly like shadcn M3E's
// src/lib/m3e/color.ts does at runtime (see the repo: Crysta1221/shadcn-m3e,
// MIT). Because the theme is fixed, the official docs ("Freezing a theme")
// recommend generating the CSS once and shipping it in the stylesheet — that
// is what this script does. The M3eProvider in src/main.tsx is configured
// with the same source colors, so the runtime scheme (if it runs) is
// byte-identical to the frozen one.
//
// Brand → scheme mapping:
//   navy #0F2A4A  → seed: primary palette (+ neutral / neutral-variant hues)
//   gold #D4A24C  → tertiary palette (the light "tone 80" gold of that
//                   palette is our signature soft gold, near #F3D48A)
//   deep navy     → surface roles come out of the navy-hued neutral palette
//
// Outputs:
//   src/lib/m3e/theme-sharea.css   frozen :root (light) + .dark (dark) blocks
//   docs/COLOR_MAPPING.md          brand → role / palette / tone table + WCAG
//   scripts/theme-report.json      raw data for audits

import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  TonalPalette,
  Variant,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

/* ---------- brand colors (single source of truth) ---------- */

export const BRAND = {
  navyPrimary: "#0F2A4A", // royal / midnight navy — seed
  navySecondary: "#16375F",
  navyDeep: "#0A1C33", // deep background navy
  goldMain: "#D4A24C",
  goldLight: "#F3D48A", // signature soft gold
  goldDeep: "#A87824",
  textWarm: "#F5EEDC", // warm off-white
}

// The scheme options — identical to <M3eProvider theme={{ defaultTheme: … }}>
// in src/main.tsx. The "image" variant is the shadcn M3E way to feed explicit
// key colors (primary / tertiary / neutral) instead of a single seed.
// neutralChroma 16 / neutralVariantChroma 20: the M3E defaults (6/10) read
// gray on large dark surfaces; the brief requires navy surfaces, so the
// neutral palettes use the navy hue with more chroma (M3 tonal practice,
// same latitude expressive/vibrant variants use).
// Overrides pin two roles to exact brand tones:
//   tertiary   → gold palette tone 86 ≈ the signature light gold #F3D48A
//   on-surface → the brand warm off-white #F5EEDC
export const SCHEME_OPTIONS = {
  source: {
    primary: BRAND.navyPrimary,
    tertiary: BRAND.goldMain,
    neutral: BRAND.navyPrimary,
    neutralChroma: 16,
    neutralVariantChroma: 20,
  },
  variant: "image",
  contrast: "standard",
  spec: "2021",
  overrides: {
    dark: {
      // decided after the tuning run (scripts/tune-theme.mjs):
      tertiary: "#ffd189", // gold palette tone 86 — signature soft gold
      "on-surface": BRAND.textWarm, // warm off-white body text
    },
  },
}

/* ---------- scheme generation (mirrors src/lib/m3e/color.ts) ---------- */

const mdc = new MaterialDynamicColors()

const ROLES = [
  ...mdc.allColors,
  mdc.surfaceVariant(),
  mdc.surfaceTint(),
  mdc.shadow(),
  mdc.scrim(),
].map((c) => [c.name.replaceAll("_", "-"), c])

const imagePalette = (hex, minChroma) => {
  if (!hex) return undefined
  const hct = Hct.fromInt(argbFromHex(hex))
  return TonalPalette.fromHueAndChroma(hct.hue, Math.max(hct.chroma, minChroma))
}

function createDynamicScheme({ source, dark }) {
  const sourceColorHct = Hct.fromInt(argbFromHex(source.primary))
  return new DynamicScheme({
    sourceColorHct,
    contrastLevel: 0,
    isDark: dark,
    specVersion: "2021",
    variant: Variant.TONAL_SPOT,
    primaryPalette: TonalPalette.fromHueAndChroma(
      sourceColorHct.hue,
      Math.max(sourceColorHct.chroma, 36)
    ),
    // secondary: not supplied → the variant default (navy-hued, muted)
    tertiaryPalette: imagePalette(source.tertiary, 24),
    neutralPalette: source.neutral
      ? TonalPalette.fromHueAndChroma(
          Hct.fromInt(argbFromHex(source.neutral)).hue,
          source.neutralChroma ?? 6
        )
      : undefined,
    neutralVariantPalette: source.neutral
      ? TonalPalette.fromHueAndChroma(
          Hct.fromInt(argbFromHex(source.neutral)).hue,
          source.neutralVariantChroma ?? 10
        )
      : undefined,
  })
}

function generateScheme(opts) {
  const { dark = false } = opts
  const scheme = createDynamicScheme(opts)
  const out = Object.fromEntries(
    ROLES.map(([name, color]) => [name, hexFromArgb(color.getArgb(scheme))])
  )
  // M3 Expressive (Compose expressiveLightColorScheme): on-container = tone 30
  if (!dark) {
    out["on-primary-container"] = hexFromArgb(scheme.primaryPalette.tone(30))
    out["on-secondary-container"] = hexFromArgb(
      scheme.secondaryPalette.tone(30)
    )
    out["on-tertiary-container"] = hexFromArgb(scheme.tertiaryPalette.tone(30))
    out["on-error-container"] = hexFromArgb(scheme.errorPalette.tone(30))
  }
  // 2021 has no *-dim roles
  for (const k of ["primary", "secondary", "tertiary", "error"]) {
    out[`${k}-dim`] ??= out[k]
  }
  // Sharea brand overrides, applied last (mirrors the extended color.ts)
  const brandOverrides = opts.overrides?.[dark ? "dark" : "light"]
  if (brandOverrides) Object.assign(out, brandOverrides)
  return { scheme, roles: out }
}

/* ---------- WCAG contrast ---------- */

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrastRatio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

/* ---------- palettes for the docs ---------- */

const PALETTE_TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100]

const toneOf = (scheme, paletteName, hex) => {
  const hct = Hct.fromInt(argbFromHex(hex))
  // find the closest tone actually produced by that palette
  let best = null
  for (const t of PALETTE_TONES.concat([6, 12, 17, 22, 24, 30, 80, 87, 90, 92])) {
    const cand = hexFromArgb(scheme[paletteName].tone(t))
    const d =
      Math.abs(luminance(cand) - luminance(hex)) +
      Math.abs(
        Hct.fromInt(argbFromHex(cand)).hue - hct.hue
      ) / 360
    if (!best || d < best.d) best = { tone: t, hex: cand, d }
  }
  return best
}

/* ---------- run ---------- */

const light = generateScheme({ ...SCHEME_OPTIONS, dark: false })
const dark = generateScheme({ ...SCHEME_OPTIONS, dark: true })

const schemeToCss = (roles, indent = "  ") =>
  Object.entries(roles)
    .map(([role, hex]) => `${indent}--md-sys-color-${role}: ${hex};`)
    .join("\n")

const css = `/* Generated by scripts/gen-tokens.mjs — do not edit by hand.
   Run \`npm run gen:tokens\` to regenerate.
   Sharea frozen theme: navy seed (#0F2A4A), gold tertiary (#D4A24C).
   Import order: after ./m3e.css so it overrides the baseline scheme. */

:root {
${schemeToCss(light.roles)}
}

.dark {
${schemeToCss(dark.roles)}
}
`

const cssPath = join(ROOT, "src/lib/m3e/theme-sharea.css")
mkdirSync(dirname(cssPath), { recursive: true })
writeFileSync(cssPath, css)

/* ---------- mapping + contrast docs ---------- */

const T = (darkScheme, palette) => (hex) => toneOf(darkScheme, palette, hex).tone

const darkPrimaryTone = T(dark.scheme, "primaryPalette")
const darkTertiaryTone = T(dark.scheme, "tertiaryPalette")
const darkNeutralTone = T(dark.scheme, "neutralPalette")

const brandMapping = [
  {
    brand: "Royal / midnight navy",
    hex: BRAND.navyPrimary,
    role: "seed → primary palette; drives primary / secondary / neutrals",
    palette: "primary",
    tone: darkPrimaryTone(BRAND.navyPrimary),
    generated: "(palette source)",
  },
  {
    brand: "Secondary navy",
    hex: BRAND.navySecondary,
    role: "covered by the primary palette (upper tones)",
    palette: "primary",
    tone: darkPrimaryTone(BRAND.navySecondary),
    generated: dark.roles["primary-container"],
  },
  {
    brand: "Deep background navy",
    hex: BRAND.navyDeep,
    role: "surface (dark) — navy-hued neutral, tone 6",
    palette: "neutral (chroma 16)",
    tone: darkNeutralTone(BRAND.navyDeep),
    generated: dark.roles["surface"],
  },
  {
    brand: "Main gold",
    hex: BRAND.goldMain,
    role: "seed of the tertiary palette (its tone 70 ≈ brand gold)",
    palette: "tertiary",
    tone: darkTertiaryTone(BRAND.goldMain),
    generated: hexFromArgb(dark.scheme.tertiaryPalette.tone(70)),
  },
  {
    brand: "Light gold (signature)",
    hex: BRAND.goldLight,
    role: "tertiary (dark) — pinned to gold palette tone 86",
    palette: "tertiary",
    tone: 86,
    generated: dark.roles["tertiary"],
  },
  {
    brand: "Deep gold",
    hex: BRAND.goldDeep,
    role: "on-tertiary (dark) — gold palette low tone",
    palette: "tertiary",
    tone: darkTertiaryTone(BRAND.goldDeep),
    generated: dark.roles["on-tertiary"],
  },
  {
    brand: "Warm off-white",
    hex: BRAND.textWarm,
    role: "on-surface (dark) — pinned to the brand token",
    palette: "neutral",
    tone: darkNeutralTone(BRAND.textWarm),
    generated: dark.roles["on-surface"],
  },
]

const pairs = [
  ["on-surface", "surface", "body text on page background (dark)"],
  ["on-surface", "surface-container-low", "cards (elevated variant)"],
  ["on-surface", "surface-container-highest", "cards (filled variant)"],
  ["on-surface-variant", "surface", "secondary text on background"],
  ["primary", "surface", "primary-colored text/icons on background"],
  ["on-primary", "primary", "filled primary button"],
  ["on-tertiary", "tertiary", "gold CTA button (hero / sticky bar)"],
  ["on-tertiary-container", "tertiary-container", "tertiary container chips"],
  ["on-primary-container", "primary-container", "primary container surfaces"],
  ["inverse-on-surface", "inverse-surface", "snackbar (toast)"],
  ["outline", "surface", "outlines / input borders"],
  ["outline-variant", "surface", "card borders, separators (decorative only — surfaces differ by container tones; WCAG 1.4.11 non-text contrast does not apply to purely decorative strokes)"],
]

const contrast = pairs.map(([fg, bg, use]) => {
  const ratio = contrastRatio(dark.roles[fg], dark.roles[bg])
  const decorative = use.includes("decorative")
  const grade = decorative
    ? "decorative"
    : ratio >= 7
      ? "AAA"
      : ratio >= 4.5
        ? "AA"
        : ratio >= 3
          ? "AA-large/UI"
          : "fail"
  return { fg, bg, fgHex: dark.roles[fg], bgHex: dark.roles[bg], ratio: +ratio.toFixed(2), grade, use }
})

const report = {
  generatedAt: new Date().toISOString(),
  options: SCHEME_OPTIONS,
  hct: {
    navy: (() => { const h = Hct.fromInt(argbFromHex(BRAND.navyPrimary)); return { hue: +h.hue.toFixed(1), chroma: +h.chroma.toFixed(1), tone: +h.tone.toFixed(1) } })(),
    gold: (() => { const h = Hct.fromInt(argbFromHex(BRAND.goldMain)); return { hue: +h.hue.toFixed(1), chroma: +h.chroma.toFixed(1), tone: +h.tone.toFixed(1) } })(),
  },
  brandMapping,
  contrast,
  darkRoles: dark.roles,
  lightRoles: light.roles,
  palettes: {
    primary: PALETTE_TONES.map((t) => [t, hexFromArgb(dark.scheme.primaryPalette.tone(t))]),
    tertiary: PALETTE_TONES.map((t) => [t, hexFromArgb(dark.scheme.tertiaryPalette.tone(t))]),
    neutral: PALETTE_TONES.map((t) => [t, hexFromArgb(dark.scheme.neutralPalette.tone(t))]),
    neutralVariant: PALETTE_TONES.map((t) => [t, hexFromArgb(dark.scheme.neutralVariantPalette.tone(t))]),
  },
}

const docs = `<!-- Generated by scripts/gen-tokens.mjs — run \`npm run gen:tokens\` to regenerate. -->

# Sharea color mapping — brand → Material 3 roles

Scheme: \`material-color-utilities\` (as used by shadcn M3E), variant \`image\`
(explicit key colors), spec 2021, contrast standard.

- **Seed / primary:** navy \`${BRAND.navyPrimary}\` (HCT hue ${report.hct.navy.hue}, chroma ${report.hct.navy.chroma})
- **Tertiary:** gold \`${BRAND.goldMain}\` (HCT hue ${report.hct.gold.hue}, chroma ${report.hct.gold.chroma})
- **Neutrals:** navy hue, chroma 6 (neutral) / 10 (neutral-variant) → blue-gray
  outlines and deep navy surfaces (never pure black)

## Brand colors → M3 roles (dark scheme, the default experience)

| Brand token | Brand hex | M3 role(s) | Palette | Nearest tone | Generated hex (dark) |
|---|---|---|---|---|---|
${brandMapping
  .map(
    (m) =>
      `| ${m.brand} | \`${m.hex}\` | ${m.role} | ${m.palette} | ${m.tone} | ${m.generated} |`
  )
  .join("\n")}

> Two roles are pinned to exact brand tones (see the table): the dark-scheme
> **tertiary** (gold palette tone 86 — the signature soft gold, used for the
> CTA) and **on-surface** (the warm off-white). Everything else is generated
> from the seeds. The authoritative values are the roles in
> \`src/lib/m3e/theme-sharea.css\`. Highlights: surface =
> \`${dark.roles["surface"]}\`; tertiary = \`${dark.roles["tertiary"]}\`;
> on-tertiary = \`${dark.roles["on-tertiary"]}\`.

## Tonal palettes (dark scheme)

| Tone | Primary (navy) | Tertiary (gold) | Neutral | Neutral variant |
|---|---|---|---|---|
${PALETTE_TONES.map(
  (t) =>
    `| ${t} | \`${hexFromArgb(dark.scheme.primaryPalette.tone(t))}\` | \`${hexFromArgb(dark.scheme.tertiaryPalette.tone(t))}\` | \`${hexFromArgb(dark.scheme.neutralPalette.tone(t))}\` | \`${hexFromArgb(dark.scheme.neutralVariantPalette.tone(t))}\` |`
).join("\n")}

## WCAG contrast (dark scheme, key pairs)

| Foreground | Background | Ratio | Grade | Used for |
|---|---|---|---|---|
${contrast
  .map(
    (c) =>
      `| \`${c.fgHex}\` (${c.fg}) | \`${c.bgHex}\` (${c.bg}) | ${c.ratio}:1 | ${c.grade} | ${c.use} |`
  )
  .join("\n")}

Style rules honored: flat colors only — no gradients, glows or metallic
effects; the gold reads as luxurious through tone choice and restraint.
`

const docsPath = join(ROOT, "docs/COLOR_MAPPING.md")
mkdirSync(dirname(docsPath), { recursive: true })
writeFileSync(docsPath, docs)
writeFileSync(join(ROOT, "scripts/theme-report.json"), JSON.stringify(report, null, 2))

console.log("✓ wrote", cssPath.replace(ROOT + "/", ""))
console.log("✓ wrote", docsPath.replace(ROOT + "/", ""))
console.log("\nKey dark roles:")
for (const k of ["surface", "surface-container-low", "surface-container", "surface-container-high", "on-surface", "on-surface-variant", "primary", "on-primary", "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container", "outline", "outline-variant"]) {
  console.log(`  ${k.padEnd(26)} ${dark.roles[k]}`)
}
console.log("\nContrast (dark):")
for (const c of contrast) console.log(`  ${c.fg} on ${c.bg}: ${c.ratio}:1 [${c.grade}]`)
