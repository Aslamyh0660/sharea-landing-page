import { Icon } from "@/components/m3e/icon"
import { RIBBON } from "@/config"

/**
 * The services ribbon: one slow, seamless row. The second copy is aria-hidden
 * so screen readers never hear the items twice; hover/touch pauses; reduced
 * motion gets a hand-scrollable static row (see index.css).
 */
export function ServicesRibbon() {
  const items = (hidden: boolean) =>
    RIBBON.map(({ icon, label }) => (
      <span
        key={(hidden ? "b-" : "a-") + icon}
        aria-hidden={hidden || undefined}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-surface-container-low px-4 text-label-large text-on-surface"
      >
        <Icon name={icon} size={20} className="text-tertiary" />
        {label}
      </span>
    ))

  return (
    <section aria-label={RIBBON.map((r) => r.label).join("، ")} className="py-2">
      <div className="ribbon py-1">
        <div className="ribbon-track">
          <div className="flex gap-3 pe-3">
            {items(false)}
          </div>
          <div className="flex gap-3 pe-3">{items(true)}</div>
        </div>
      </div>
    </section>
  )
}
