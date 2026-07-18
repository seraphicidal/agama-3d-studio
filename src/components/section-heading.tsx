import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
  action?: { label: string; href: string }
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("max-w-xl space-y-2", align === "center" && "mx-auto")}>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground sm:text-lg">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand-primary"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
