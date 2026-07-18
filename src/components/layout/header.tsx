"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useUIStore } from "@/store/ui-store"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: dict.nav.home },
  { href: "/modely", label: dict.nav.models },
  { href: "/kategorie", label: dict.nav.categories },
  { href: "/zakazkova-vyroba", label: dict.nav.customOrder },
  { href: "/ako-to-funguje", label: dict.nav.howItWorks },
  { href: "/blog", label: dict.nav.blog },
  { href: "/kontakt", label: dict.nav.contact },
]

export function Header() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()
  const setSearchOpen = useUIStore((s) => s.setSearchOpen)
  const setCartOpen = useUIStore((s) => s.setCartOpen)
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const itemCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.productIds.length)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12)
  })

  React.useEffect(() => {
    // Deliberate: next-themes' recommended pattern to defer theme-dependent
    // UI (the sun/moon icon) until after client mount, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <motion.div
          animate={{
            paddingTop: scrolled ? 10 : 18,
            paddingBottom: scrolled ? 10 : 18,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "px-4 sm:px-6 lg:px-8 transition-colors duration-300",
            scrolled
              ? "glass border-b border-border/60 shadow-sm"
              : "bg-background/0"
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Logo />

            <nav className="hidden items-center gap-1 rounded-full border border-border/0 lg:flex">
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground",
                      active ? "bg-secondary text-foreground" : "text-foreground/80"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={dict.nav.search}
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={dict.nav.wishlist}
                className="relative hidden sm:inline-flex"
                render={<Link href="/oblubene" />}
                nativeButton={false}
              >
                <Heart className="size-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-semibold text-brand-orange-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={dict.nav.cart}
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="size-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-semibold text-brand-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={dict.nav.account}
                className="hidden sm:inline-flex"
                render={<Link href="/ucet" />}
                nativeButton={false}
              >
                <User className="size-[18px]" />
              </Button>
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={dict.nav.darkMode}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hidden sm:inline-flex"
                >
                  {theme === "dark" ? (
                    <Sun className="size-[18px]" />
                  ) : (
                    <Moon className="size-[18px]" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className="lg:hidden"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                {mobileNavOpen ? (
                  <X className="size-[18px]" />
                ) : (
                  <Menu className="size-[18px]" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden border-b border-border/60 lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-1 flex items-center gap-2 border-t border-border/60 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSearchOpen(true)
                    setMobileNavOpen(false)
                  }}
                >
                  <Search className="size-4" /> {dict.nav.search}
                </Button>
                {mounted && (
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? (
                      <Sun className="size-4" />
                    ) : (
                      <Moon className="size-4" />
                    )}
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </header>
    </>
  )
}
