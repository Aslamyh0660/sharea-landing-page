import * as React from "react"

import { Icon } from "@/components/m3e/icon"
import { cn } from "@/lib/m3e/cn"
import { LogoLockup } from "./LogoLockup"
import { TELEGRAM_URL } from "@/config"

/**
 * M3E top app bar (small, 64dp): surface at rest; once content scrolls under
 * it, surface-container with elevation 2 — the M3E scrolled behavior. Built
 * as a lean custom header (instead of the M3E AppBar) so the page keeps a
 * single <h1> in the hero.
 */
export function TopBar() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        "sticky top-0 z-40 h-16 w-full bg-surface text-on-surface",
        "transition-[background-color,box-shadow] duration-300 ease-standard",
        "data-scrolled:bg-surface-container data-scrolled:shadow-elevation-2"
      )}
    >
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="rounded-full outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <LogoLockup size="sm" />
          <span className="sr-only"> — إلى أعلى الصفحة</span>
        </a>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="افتح بوت الشارع على تيليغرام"
          className={cn(
            "state-layer relative inline-grid size-11 cursor-pointer place-items-center rounded-full",
            "text-on-surface-variant outline-none focus-ring"
          )}
        >
          <Icon name="send" size={22} className="rtl:scale-x-[-1]" />
        </a>
      </div>
    </header>
  )
}
