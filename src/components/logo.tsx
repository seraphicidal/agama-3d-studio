import Link from "next/link"
import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <path
        d="M24 4c-2.5 0-4.6 1.7-5.4 4-3.6.4-6.9 2-9.4 4.6-1-.4-2.2-.2-3 .6-1 1-1 2.6 0 3.6.5.5 1.1.7 1.8.7-1.3 2.4-2 5.1-2 8 0 3.3 1 6.4 2.7 9-.9 1.5-1.4 3.3-1.4 5.1 0 1.4.3 2.7.8 3.9.3.7 1.2.9 1.8.4 1.8-1.4 3.1-3.4 3.7-5.6 1.9 1 4 1.6 6.2 1.8v2.1c0 .9.7 1.6 1.6 1.6h6.4c.9 0 1.6-.7 1.6-1.6v-2.1c5.9-.6 10.9-4.3 13.3-9.5.5.2 1.1.1 1.5-.3.6-.6.6-1.6 0-2.2-.3-.3-.7-.5-1.1-.5.3-1.1.5-2.3.5-3.6 0-2.9-.7-5.6-2-8 .7 0 1.3-.2 1.8-.7 1-1 1-2.6 0-3.6-.8-.8-2-1-3-.6-2.5-2.6-5.8-4.2-9.4-4.6-.8-2.3-2.9-4-5.4-4z"
        fill="currentColor"
      />
      <circle cx="19.5" cy="20" r="1.8" fill="var(--brand-dark)" />
      <path
        d="M14 26c2.5 2 6 3 10 3s7.5-1 10-3"
        stroke="var(--brand-dark)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 text-brand-dark dark:text-brand-light",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-2xl bg-brand-primary text-brand-primary-foreground">
        <LogoMark className="size-6" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">Agama</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          3D Studio
        </span>
      </span>
    </Link>
  )
}
