import { StrictMode } from "react"
import { hydrateRoot, createRoot } from "react-dom/client"

import "@/index.css"
import App from "@/App"

/**
 * The page is prerendered to static HTML at build time (scripts/ssg.mjs),
 * so the approval statement paints with the first byte + preloaded fonts —
 * no waiting for JavaScript. When the prerendered markup is present we
 * hydrate it; otherwise (plain `vite dev`) we render as usual.
 *
 * Theme note: colors come from the frozen scheme stylesheet
 * (src/lib/m3e/theme-sharea.css, "Freezing a theme" in the shadcn M3E docs)
 * and <html> carries class="dark" + data-motion="expressive". To enable
 * runtime theming instead, mount the library's M3eProvider here — it is in
 * the repo and documented in the README.
 */
const rootEl = document.getElementById("root")!

if (rootEl.children.length > 0) {
  hydrateRoot(
    rootEl,
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
