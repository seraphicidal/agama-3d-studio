"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { X, ShoppingBag, Truck, TicketPercent } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { QuantityStepper } from "@/components/quantity-stepper"
import { useUIStore } from "@/store/ui-store"
import { useCartStore } from "@/store/cart-store"
import { formatPrice } from "@/lib/format"
import { dict } from "@/lib/i18n"
import { products } from "@/lib/data/products"
import { ProductCard } from "@/components/product/product-card"

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen)
  const setOpen = useUIStore((s) => s.setCartOpen)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore((s) => s.subtotal())
  const couponCode = useCartStore((s) => s.couponCode)
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)
  const discountAmount = useCartStore((s) => s.discountAmount())
  const discountRate = useCartStore((s) => s.discountRate())

  const [couponInput, setCouponInput] = React.useState("")

  function handleApplyCoupon() {
    if (!couponInput.trim()) return
    if (applyCoupon(couponInput)) {
      toast.success(dict.cart.couponApplied)
      setCouponInput("")
    } else {
      toast.error(dict.cart.couponInvalid)
    }
  }

  const recommended = products.slice(0, 3)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="size-5 text-brand-primary" />
            {dict.cart.title}
            {items.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="font-medium">{dict.cart.empty}</p>
            <p className="text-sm text-muted-foreground">{dict.cart.emptyDesc}</p>
            <Button
              className="mt-2"
              onClick={() => setOpen(false)}
              render={<Link href="/modely" />}
              nativeButton={false}
            >
              {dict.nav.models}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 border-b border-border py-4 last:border-0"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/modely/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium leading-tight hover:text-brand-primary"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={dict.common.remove}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.material} · {item.color} · {item.size}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.id, q)}
                          size="sm"
                        />
                        <span className="text-sm font-semibold">
                          {formatPrice({
                            amount: item.price.amount * item.quantity,
                            currency: item.price.currency,
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="py-5">
                <p className="mb-2 text-sm font-medium">{dict.cart.recommended}</p>
                <div className="grid grid-cols-2 gap-3">
                  {recommended.map((p) => (
                    <ProductCard key={p.id} product={p} compact />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border p-4">
              {couponCode ? (
                <div className="flex items-center justify-between rounded-xl bg-brand-primary/10 px-3 py-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-brand-primary">
                    <TicketPercent className="size-4" />
                    {couponCode} (−{Math.round(discountRate * 100)} %)
                  </span>
                  <button
                    onClick={removeCoupon}
                    aria-label={dict.common.remove}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder={dict.cart.coupon}
                    className="h-9"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0"
                    onClick={handleApplyCoupon}
                  >
                    {dict.cart.applyCoupon}
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="size-3.5" />
                {subtotal >= 60 ? dict.common.freeShipping : dict.cart.shippingAtCheckout}
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{dict.cart.subtotal}</span>
                  <span className="font-semibold">
                    {formatPrice({ amount: subtotal, currency: "EUR" })}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{dict.cart.discount}</span>
                    <span className="font-semibold text-brand-primary">
                      −{formatPrice({ amount: discountAmount, currency: "EUR" })}
                    </span>
                  </div>
                )}
              </div>
              <Button
                size="lg"
                className="w-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
                onClick={() => setOpen(false)}
                render={<Link href="/checkout" />}
                nativeButton={false}
              >
                {dict.cart.checkout}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
