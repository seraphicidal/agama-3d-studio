"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: string[]
  current: number
  onStepClick?: (index: number) => void
}) {
  return (
    <div className="flex items-center overflow-x-auto pb-1 no-scrollbar">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex shrink-0 items-center">
            <button
              onClick={() => onStepClick?.(i)}
              disabled={!onStepClick || i > current}
              className="flex flex-col items-center gap-2 px-2 disabled:cursor-default"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors sm:size-9",
                  done && "border-brand-primary bg-brand-primary text-brand-primary-foreground",
                  active && "border-brand-primary text-brand-primary",
                  !done && !active && "border-border text-muted-foreground"
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden max-w-20 text-center text-[11px] font-medium leading-tight sm:block",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 shrink-0 sm:w-12",
                  done ? "bg-brand-primary" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
