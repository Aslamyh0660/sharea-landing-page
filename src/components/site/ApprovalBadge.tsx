import { Icon } from "@/components/m3e/icon"
import { cn } from "@/lib/m3e/cn"
import { HERO } from "@/config"

/**
 * The flat approval badge: M3 shape language (full pill) + the verified
 * Material Symbol + «معتمد». No laurels, no ornaments, no effects.
 */
export function ApprovalBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border border-tertiary-container bg-tertiary-container/40 px-4 text-label-large text-on-tertiary-container",
        className
      )}
    >
      <Icon name="verified" size={20} className="text-tertiary" />
      <span className="font-semibold">{HERO.badge}</span>
      <span aria-hidden="true" className="h-4 w-px bg-outline-variant" />
      <span dir="ltr" className="font-wordmark text-[0.95rem] font-semibold tracking-[0.12em]">
        SHAREA
      </span>
    </span>
  )
}
