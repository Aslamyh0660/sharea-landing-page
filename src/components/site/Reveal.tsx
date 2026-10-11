import * as React from "react"

import { cn } from "@/lib/m3e/cn"

type RevealProps = React.ComponentProps<"div"> & {
  /** element to render (defaults to div); li keeps list semantics */
  as?: "div" | "li" | "section" | "article"
  /**
   * CSS-only entrance: runs as a plain animation on load (with a delay via
   * style), no IntersectionObserver and no JS dependency. Use for
   * above-the-fold content so the entrance never waits for hydration.
   */
  auto?: boolean
}

/**
 * The page's single scroll effect: a short fade/slide the first time a
 * section enters the viewport.
 *
 * - without JS: never hides anything (the `.js` class guards the CSS)
 * - with `prefers-reduced-motion: reduce`: revealed immediately, no motion
 * - `auto`: above-the-fold variant — pure CSS animation on load
 */
export function Reveal({ as = "div", auto = false, className, children, style, ...props }: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (auto) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-revealed", "true")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-revealed", "true")
            io.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    )
    io.observe(el)
    // safety net: if the observer never fires (edge-case browsers, embedded
    // webviews), reveal anyway — content must never stay hidden
    const fallback = window.setTimeout(() => {
      el.setAttribute("data-revealed", "true")
      io.disconnect()
    }, 2500)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [auto])

  return React.createElement(
    as,
    {
      ref: auto ? undefined : ref,
      className: cn(auto ? "reveal-auto" : "reveal", className),
      style,
      ...props,
    },
    children
  )
}
