// Build-time prerender (`npm run build` step): renders <App /> to static HTML
// and injects it into dist/index.html, replacing the empty root. The page
// then paints its full content on the first byte — JavaScript only hydrates.
import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SSR = join(ROOT, "dist-ssr", "entry-server.js")
const INDEX = join(ROOT, "dist", "index.html")

if (!existsSync(SSR)) {
  console.error("dist-ssr/entry-server.js missing — run `vite build --ssr` first")
  process.exit(1)
}

const { render } = await import(SSR)
const html = render()

let doc = readFileSync(INDEX, "utf8")
const EMPTY_ROOT = /<div id="root"><\/div>/
if (!EMPTY_ROOT.test(doc)) {
  console.error('#root in dist/index.html is not the empty placeholder — aborting')
  process.exit(1)
}
doc = doc.replace(EMPTY_ROOT, `<div id="root">${html}</div>`)

// Inline the stylesheet into the document. A QR landing page is visited once
// from a phone on mobile data — CSS caching across visits buys nothing, while
// the extra request hop costs ~0.7s of first-paint time under real network
// conditions. With the CSS inlined, first paint needs exactly one request.
const linkMatch = doc.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)
if (linkMatch) {
  // works for both bases: the URL basename always lives in dist/assets/
  const cssPath = join(ROOT, "dist", "assets", linkMatch[1].split("/").pop())
  if (existsSync(cssPath)) {
    const css = readFileSync(cssPath, "utf8")
    doc = doc.replace(linkMatch[0], `<style>${css}</style>`)
    console.log(`✓ inlined stylesheet (${(css.length / 1024).toFixed(1)}KB) — removed a render-blocking request`)
  } else {
    console.warn("stylesheet file not found, keeping the link")
  }
}

writeFileSync(INDEX, doc)

// the SSR bundle is a build tool, not a shipped asset
rmSync(join(ROOT, "dist-ssr"), { recursive: true, force: true })
console.log(`✓ prerendered ${(html.length / 1024).toFixed(1)}KB of HTML into dist/index.html`)
