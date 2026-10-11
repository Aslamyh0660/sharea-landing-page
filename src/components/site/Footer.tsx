import { LogoLockup } from "./LogoLockup"
import { FOOTER, TELEGRAM_HANDLE, TELEGRAM_URL } from "@/config"

export function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low">
      {/* extra bottom padding on mobile so the sticky CTA bar never covers it */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 pt-10 pb-28 text-center sm:px-6 md:pb-10">
        <LogoLockup size="sm" />
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-xs px-2 py-4 text-body-medium text-primary outline-none underline-offset-4 hover:underline focus-ring"
        >
          <bdi dir="ltr">{TELEGRAM_HANDLE}</bdi>
        </a>
        <p className="text-body-small text-on-surface-variant">{FOOTER.line}</p>
      </div>
    </footer>
  )
}
