import { Icon } from "@/components/m3e/icon"
import { Reveal } from "./Reveal"
import { TRUST_VALUES, SECTION_TITLES } from "@/config"

/**
 * Brand values — موثوق، مريح، سريع، آمن — presented as what Sharea aims for
 * with every visitor, not as legal or technical guarantees.
 */
export function TrustStrip() {
  return (
    <section aria-labelledby="trust-title" className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
      <Reveal>
        <h2
          id="trust-title"
          className="text-center font-heading text-headline-small font-semibold text-on-surface"
        >
          {SECTION_TITLES.trust}
        </h2>
      </Reveal>

      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {TRUST_VALUES.map((value) => (
          <Reveal as="li" key={value.icon} className="flex flex-col items-center gap-2 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-tertiary-container text-on-tertiary-container">
              <Icon name={value.icon} size={26} />
            </span>
            <span className="font-heading text-title-medium font-semibold text-on-surface">
              {value.label}
            </span>
            <span className="font-body-ar text-body-small text-on-surface-variant">
              {value.caption}
            </span>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
