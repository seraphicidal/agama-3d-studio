"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { dict } from "@/lib/i18n"

const SIZES = {
  sm: { btn: "size-6", icon: "size-3", value: "w-5 text-xs" },
  default: { btn: "size-11", icon: "size-4", value: "w-8 text-sm" },
  lg: { btn: "size-12", icon: "size-4", value: "w-12 text-lg" },
} as const

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  size = "default",
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  size?: keyof typeof SIZES
  className?: string
}) {
  const s = SIZES[size]
  return (
    <div
      className={cn("flex items-center rounded-full border border-border", size === "sm" && "gap-1", className)}
      role="group"
      aria-label={dict.common.quantity}
    >
      <button
        type="button"
        aria-label="−1"
        className={cn("flex items-center justify-center rounded-full hover:bg-secondary disabled:opacity-40", s.btn)}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className={s.icon} />
      </button>
      <span className={cn("text-center font-medium tabular-nums", s.value)}>{value}</span>
      <button
        type="button"
        aria-label="+1"
        className={cn("flex items-center justify-center rounded-full hover:bg-secondary", s.btn)}
        onClick={() => onChange(value + 1)}
      >
        <Plus className={s.icon} />
      </button>
    </div>
  )
}
