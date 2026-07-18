"use client"

import { ThemeProvider } from "next-themes"
import { MotionConfig } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {/* reducedMotion="user" makes every framer animation respect the OS
          prefers-reduced-motion setting. */}
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          {children}
          {/* mobileOffset keeps toasts clear of the fixed bottom nav */}
          <Toaster position="bottom-right" mobileOffset={{ bottom: 76 }} />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
