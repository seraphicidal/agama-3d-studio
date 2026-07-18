"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { useUIStore } from "@/store/ui-store"
import { dict } from "@/lib/i18n"

export function MobileBottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.productIds.length)
  const setCartOpen = useUIStore((s) => s.setCartOpen)

  const items = [
    { href: "/", label: dict.nav.home, icon: Home },
    { href: "/modely", label: dict.nav.models, icon: LayoutGrid },
    { href: "/ucet?tab=wishlist", label: dict.nav.wishlist, icon: Heart, badge: wishlistCount },
    { href: "/ucet", label: dict.nav.account, icon: User },
  ]

  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border/60 px-2 py-2 lg:hidden [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map((item) => {
        const active = pathname === item.href.split("?")[0]
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium",
              active ? "text-brand-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
            {item.label}
            {!!item.badge && (
              <span className="absolute top-0 right-1 flex size-3.5 items-center justify-center rounded-full bg-brand-orange text-[8px] font-semibold text-brand-orange-foreground">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
      <button
        onClick={() => setCartOpen(true)}
        className="relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] font-medium text-muted-foreground"
      >
        <ShoppingBag className="size-5" />
        {dict.nav.cart}
        {itemCount > 0 && (
          <span className="absolute top-0 right-1 flex size-3.5 items-center justify-center rounded-full bg-brand-primary text-[8px] font-semibold text-brand-primary-foreground">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  )
}
