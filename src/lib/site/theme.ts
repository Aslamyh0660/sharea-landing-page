/**
 * The fixed Sharea theme, expressed the way <M3eProvider> consumes it.
 *
 * These values mirror scripts/gen-tokens.mjs (SCHEME_OPTIONS) one to one:
 * the frozen stylesheet (src/lib/m3e/theme-sharea.css) paints the correct
 * colors before JS loads, and the runtime provider regenerates the very same
 * roles. Keep the two in sync — or better, run `npm run gen:tokens` after
 * changing anything here.
 */
import type { M3Theme } from "@/components/m3e/m3-theme-provider"

export const THEME_OPTIONS: Partial<M3Theme> = {
  source: {
    primary: "#0F2A4A", // royal / midnight navy — the seed
    tertiary: "#D4A24C", // main gold → tertiary palette
    neutral: "#0F2A4A", // navy-hued neutrals → navy surfaces, blue-gray outlines
    neutralChroma: 16,
    neutralVariantChroma: 20,
  },
  variant: "image",
  contrast: "standard",
  spec: "2021",
  motion: "expressive",
  shapeScale: 1,
  overrides: {
    dark: {
      tertiary: "#ffd189", // gold palette tone 86 — the signature soft gold
      "on-surface": "#F5EEDC", // warm off-white body text
    },
  },
}
