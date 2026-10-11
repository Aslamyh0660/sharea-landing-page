// Post-build: inject <link rel="preload"> for the critical above-the-fold
// fonts (Arabic headline + body, Latin wordmark). Runs after `vite build`,
// when the hashed woff2 names are known.
//
// `--base=/site/` (sandbox preview build) also rewrites the static asset
// URLs in dist/index.html so they resolve under the preview mount point.
import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  // supports both "--base /site/" and "--base=/site/"
  const i = args.indexOf(name)
  if (i >= 0 && i + 1 < args.length) return args[i + 1]
  const withEq = args.find((a) => a.startsWith(name + "="))
  return withEq ? withEq.slice(name.length + 1) : fallback
}
const base = flag("--base", "/") // e.g. "/" or "/site/"
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(ROOT, "dist")

// family pattern → which subsets/weights are first-paint critical.
// Deliberately short: every preloaded font competes for bandwidth with the
// render-blocking CSS on mobile data, so only the two fonts the first paint
// cannot do without are preloaded (headline + body). The rest load via CSS
// discovery a moment later.
const CRITICAL = [
  /noto-kufi-arabic.*arabic-600-normal/, // headlines (the LCP text)
  /ibm-plex-sans-arabic.*arabic-400-normal/, // body
]

const assets = readdirSync(join(DIST, "assets"))
const fonts = []
for (const pattern of CRITICAL) {
  const hit = assets.find((f) => pattern.test(f) && f.endsWith(".woff2"))
  if (hit) fonts.push(hit)
}

const indexPath = join(DIST, "index.html")
let html = readFileSync(indexPath, "utf8")

// sandbox/preview mount: rewrite static /assets/… URLs (favicon, OG, preload)
if (base !== "/") {
  html = html.replaceAll('"/assets/', `"${base}assets/`)
}

// insert right after <head> so fonts start downloading immediately
const links = fonts
  .map(
    (f) =>
      `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/${f}" />`
  )
  .join("\n    ")

html = html.replace(
  "<head>",
  `<head>\n    <!-- critical font preloads (scripts/preload-fonts.mjs) -->\n    ${links}`
)
writeFileSync(indexPath, html)
console.log(`✓ base=${base} · preloaded ${fonts.length} critical font files`)
