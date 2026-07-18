import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

type LinkButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string }

// Button is a Base UI primitive that renders a native <button> by default.
// Composing it with next/link via the `render` prop requires nativeButton={false} —
// this wrapper bakes that in so call sites don't have to remember it.
export function LinkButton({
  variant,
  size,
  className,
  href,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={<Link href={href} {...props} />}
    >
      {children}
    </Button>
  )
}
