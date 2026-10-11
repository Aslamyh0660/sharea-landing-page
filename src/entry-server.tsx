import { renderToString } from "react-dom/server"

import App from "@/App"

/** Build-time prerender: the whole page as static HTML (see scripts/ssg.mjs). */
export function render(): string {
  return renderToString(<App />)
}
