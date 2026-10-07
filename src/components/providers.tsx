"use client"

import { ThemeProvider } from "next-themes"
import { MotionConfig } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" mobileOffset={{ bottom: 76 }} />
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
