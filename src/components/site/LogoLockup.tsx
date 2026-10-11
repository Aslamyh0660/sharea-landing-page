import { cn } from "@/lib/m3e/cn"
import { asset } from "@/lib/site/asset"
import { BRAND } from "@/config"

type Size = "sm" | "md" | "lg"

const SIZES: Record<Size, { img: string; latin: string; arabic: string; gap: string }> = {
  sm: { img: "size-10", latin: "text-[1.05rem] leading-none", arabic: "text-title-medium", gap: "gap-2" },
  md: { img: "size-14", latin: "text-[1.4rem] leading-none", arabic: "text-title-large", gap: "gap-3" },
  lg: { img: "size-20", latin: "text-[2rem] leading-none", arabic: "text-headline-small", gap: "gap-4" },
}

/**
 * The Sharea logo lockup: the official portrait (used exactly as supplied,
 * clipped to a circle by CSS) inside a flat light-gold ring, next to the
 * Latin wordmark and the Arabic name.
 */
export function LogoLockup({
  size = "md",
  layout = "row",
  className,
}: {
  size?: Size
  layout?: "row" | "column"
  className?: string
}) {
  const s = SIZES[size]
  return (
    <span
      className={cn(
        "inline-flex items-center",
        layout === "row" ? cn("flex-row", s.gap) : "flex-col gap-3",
        className
      )}
    >
      <span className={cn("relative inline-grid shrink-0 place-items-center rounded-full", s.img)}>
        <img
          src={asset("portrait.jpg")}
          alt="شعار شارع: الصورة الرمزية الرسمية لبوت شارع"
          width={96}
          height={96}
          className="size-full rounded-full object-cover"
          decoding="async"
          fetchPriority={size === "lg" ? "high" : "auto"}
        />
        {/* flat light-gold ring — no glow, no gradient */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-tertiary"
        />
      </span>
      <span
        className={cn(
          "inline-flex flex-col",
          layout === "column" ? "items-center" : "items-start"
        )}
      >
        <span
          dir="ltr"
          className={cn("font-wordmark font-semibold tracking-[0.14em] text-on-surface", s.latin)}
        >
          {BRAND.latin}
        </span>
        <span className={cn("font-heading font-semibold text-tertiary", s.arabic)}>
          {BRAND.arabic}
        </span>
      </span>
    </span>
  )
}
