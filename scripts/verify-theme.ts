// CI check — `npm run verify:theme` (runs with bun; see README)
//
// Regenerates the scheme from src/lib/m3e/color.ts (the library code the
// M3eProvider would run) with the exact Sharea options and diffs every role
// against the frozen stylesheet (src/lib/m3e/theme-sharea.css). Proves the
// frozen CSS the user sees is byte-identical to what the library's runtime
// generator would produce.
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { generateScheme } from "../src/lib/m3e/color"
import { THEME_OPTIONS } from "../src/lib/site/theme"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const css = readFileSync(join(ROOT, "src/lib/m3e/theme-sharea.css"), "utf8")

const roleRe = /--md-sys-color-([a-z0-9-]+):\s*(#[0-9a-f]{6})/g

function blockAfter(css: string, selector: string): Map<string, string> {
  const start = css.indexOf(selector)
  if (start < 0) throw new Error(`selector ${selector} not found in frozen css`)
  const end = css.indexOf("}", start)
  const map = new Map<string, string>()
  for (const m of css.slice(start, end).matchAll(roleRe)) map.set(m[1], m[2])
  return map
}

const frozenDark = blockAfter(css, ".dark {")
const frozenLight = blockAfter(css, ":root {")

for (const dark of [true, false]) {
  const generated = generateScheme({
    source: THEME_OPTIONS.source!,
    variant: THEME_OPTIONS.variant!,
    contrast: THEME_OPTIONS.contrast!,
    spec: THEME_OPTIONS.spec!,
    overrides: THEME_OPTIONS.overrides,
    dark,
  })
  const frozen = dark ? frozenDark : frozenLight
  const missing: string[] = []
  const mismatched: string[] = []
  for (const [role, hex] of frozen) {
    const got = (generated as Record<string, string>)[role]
    if (got === undefined) missing.push(role)
    else if (got.toLowerCase() !== hex.toLowerCase()) {
      mismatched.push(`${role}: frozen ${hex} vs generated ${got}`)
    }
  }
  const label = dark ? "dark (.dark)" : "light (:root)"
  if (missing.length || mismatched.length) {
    console.error(`✗ frozen theme drift in ${label}`)
    for (const m of [...missing, ...mismatched]) console.error("   ", m)
    process.exit(1)
  }
  console.log(`✓ frozen ${label}: ${frozen.size} roles match generateScheme() exactly`)
}
