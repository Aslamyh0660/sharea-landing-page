import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { ApprovalBadge } from "./ApprovalBadge"
import { Reveal } from "./Reveal"
import { HERO, BRAND, TELEGRAM_URL } from "@/config"

/**
 * The hero — the page's core message: the place you are standing in is
 * approved by Sharea. No codes, no dates, no guarantees beyond that.
 *
 * The headline is deliberately NOT wrapped in an entrance effect so the
 * largest paint happens as soon as the preloaded font arrives.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-headline"
      className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-16"
    >
      <Reveal auto>
        <ApprovalBadge />
      </Reveal>

      <h1
        id="hero-headline"
        className="mt-8 font-heading text-headline-large font-semibold text-balance text-on-surface sm:text-display-small"
      >
        {HERO.headline}
      </h1>

      <Reveal auto style={{ animationDelay: "70ms" }} className="mt-5 max-w-xl">
        <p className="font-body-ar text-body-large text-on-surface-variant">
          {HERO.support}
        </p>
        <p className="mt-3 font-body-ar text-body-large font-medium text-on-surface">
          {HERO.reassurance}
        </p>
      </Reveal>

      <Reveal auto style={{ animationDelay: "210ms" }} className="mt-8">
        <p className="font-heading text-title-large font-semibold text-tertiary">
          {BRAND.slogan}
        </p>
        <p className="mt-2 text-body-medium text-on-surface-variant">{BRAND.tagline}</p>
      </Reveal>

      <Reveal auto style={{ animationDelay: "280ms" }} className="mt-8">
        <Button
          render={
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" />
          }
          variant="filled"
          size="md"
          className="bg-tertiary text-on-tertiary hover:shadow-elevation-1"
        >
          <Icon name="send" size={20} className="rtl:scale-x-[-1]" data-icon="inline-start" />
          {HERO.cta}
        </Button>
      </Reveal>
    </section>
  )
}
