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
        "approval-badge inline-flex h-12 items-center gap-2.5 rounded-full border px-5 text-[1rem] leading-5",
        className
      )}
    >
      <Icon name="verified" size={24} className="approval-badge__check" />
      <span className="font-semibold">{HERO.badge}</span>
      <span aria-hidden="true" className="approval-badge__divider h-5 w-px" />
      <span dir="ltr" className="font-wordmark text-[1.1rem] font-semibold tracking-[0.12em]">
        SHAREA
      </span>
    </span>
  )
}
