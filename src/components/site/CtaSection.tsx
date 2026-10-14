import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { Toaster, toast } from "@/components/m3e/toast"
import * as React from "react"
import { cn } from "@/lib/m3e/cn"
import { Reveal } from "./Reveal"
import {
  HERO,
  SECTION_TITLES,
  TELEGRAM_URL,
  TELEGRAM_HANDLE,
  WHATSAPP_GROUP_LINK,
} from "@/config"

function CtaActions({ compact }: { compact?: boolean }) {
  // the module-level toast manager singleton — same one <Toaster /> renders;
  // works outside the provider context (Base UI error #73 otherwise)
  const toastManager = toast
  // Web Share availability decided after hydration (SSR-safe)
  const [hasShare, setHasShare] = React.useState(false)
  React.useEffect(() => {
    setHasShare("share" in navigator)
  }, [])

  const share = async () => {
    const url = window.location.href
    const data = { title: document.title, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(url)
      toastManager.add({
        title: "تم نسخ الرابط",
        description: "مشاركة غير مدعومة في هذا المتصفح — نسخنا الرابط بدلاً من ذلك.",
      })
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return
      toastManager.add({ title: "تعذّرت المشاركة", description: "حاول مرة أخرى." })
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toastManager.add({ title: "تم نسخ الرابط" })
    } catch {
      toastManager.add({ title: "تعذّر نسخ الرابط", description: "انسخه من شريط العنوان." })
    }
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3",
        compact ? "sm:flex-row" : "sm:flex-row sm:flex-wrap"
      )}
    >
      <Button
        render={<a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" />}
        variant="filled"
        size="md"
        className="bg-tertiary text-on-tertiary hover:shadow-elevation-1"
      >
        <Icon name="send" size={20} className="rtl:scale-x-[-1]" />
        {HERO.cta}
      </Button>

      <Button
        render={<a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" />}
        variant="filled"
        size="md"
        className="bg-[var(--sharea-success-container)] text-[var(--sharea-success-on-container)] hover:shadow-elevation-1"
      >
        <Icon name="forum" size={20} />
        انضم إلى مجموعة الواتساب
      </Button>

      <div className="flex items-center gap-1">
        {hasShare && (
          <button
            type="button"
            onClick={() => void share()}
            aria-label="شارك الصفحة"
            className="state-layer relative inline-grid size-11 cursor-pointer place-items-center rounded-full text-on-surface-variant outline-none focus-ring"
          >
            <Icon name="share" size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={() => void copy()}
          aria-label="انسخ رابط الصفحة"
          className="state-layer relative inline-grid size-11 cursor-pointer place-items-center rounded-full text-on-surface-variant outline-none focus-ring"
        >
          <Icon name="content_copy" size={20} />
        </button>
      </div>
    </div>
  )
}

export function CtaSection() {
  return (
    <>
      <Toaster />
      <section
        aria-labelledby="cta-title"
        className="mx-auto max-w-5xl px-4 pb-20 sm:px-6"
      >
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl bg-surface-container px-6 py-10 text-center">
            <h2
              id="cta-title"
              className="font-heading text-headline-small font-semibold text-on-surface"
            >
              {SECTION_TITLES.cta}
            </h2>
            <p className="max-w-md font-body-ar text-body-medium text-on-surface-variant">
              {SECTION_TITLES.ctaIntro}
            </p>
            <CtaActions compact />
            <p className="text-body-small text-on-surface-variant">
              البوت على تيليغرام:{" "}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xs px-2 py-4 text-primary underline-offset-4 hover:underline focus-ring"
              >
                <bdi dir="ltr">{TELEGRAM_HANDLE}</bdi>
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  )
}

/** Mobile sticky bottom bar (M3E bottom-toolbar style). Hidden ≥ sm where the
 *  inline CTAs are comfortable; padded by the safe-area inset. */
export function StickyCtaBar() {
  return (
    <nav
      aria-label="إجراءات سريعة"
      className={cn(
        "sticky-cta fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant",
        "bg-surface-container shadow-elevation-2 md:hidden"
      )}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2 px-4 pt-3">
        <Button
          render={<a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" />}
          variant="filled"
          className="h-12 flex-1 bg-tertiary text-on-tertiary hover:shadow-elevation-1"
        >
          <Icon name="send" size={20} className="rtl:scale-x-[-1]" />
          {HERO.cta}
        </Button>
        {/* Temporarily disabled like shortcut; kept here for rollback.
        <a
          href="#like"
          aria-label="أضِف إعجاباً بصفحة الشارع"
          className="state-layer relative inline-grid size-12 shrink-0 place-items-center rounded-full text-on-surface-variant outline-none focus-ring"
        >
          <Icon name="favorite" size={22} />
        </a>
        */}
        <a
          href="#share-row"
          aria-label="خيارات المشاركة ونسخ الرابط"
          className="state-layer relative inline-grid size-12 shrink-0 place-items-center rounded-full text-on-surface-variant outline-none focus-ring"
        >
          <Icon name="share" size={22} />
        </a>
      </div>
    </nav>
  )
}
