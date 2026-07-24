"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowRight, Clock, Truck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/rating-stars"
import { QuantityStepper } from "@/components/quantity-stepper"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { useCartStore } from "@/store/cart-store"
import { useUIStore } from "@/store/ui-store"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [material, setMaterial] = React.useState(product.variants.materials[0])
  const [color, setColor] = React.useState(product.variants.colors[0])
  const [size, setSize] = React.useState(product.variants.sizes[0])
  const [quantity, setQuantity] = React.useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useUIStore((s) => s.setCartOpen)

  function handleAdd() {
    if (!product.inStock) return
    addItem({
      id: `${product.id}-${material}-${color.id}-${size}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      quantity,
      material: material.toUpperCase(),
      color: color.name,
      size,
    })
    toast.success(`${product.name} ${dict.common.addedToCart}`)
    onOpenChange(false)
    setCartOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-3xl sm:grid-cols-2">
        <div className="relative aspect-square bg-secondary">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, 380px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{product.name}</DialogTitle>
            <DialogDescription>{product.tagline}</DialogDescription>
          </DialogHeader>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RatingStars rating={product.rating} size={13} />
              {product.rating.toFixed(1)} ({product.reviewCount})
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {product.variants.materials.map((m) => (
                <button
                  key={m}
                  onClick={() => setMaterial(m)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    material === m
                      ? "border-brand-primary bg-brand-primary text-brand-primary-foreground"
                      : "border-border hover:border-brand-primary/50"
                  )}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.variants.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform hover:scale-110",
                    color.id === c.id ? "border-brand-primary" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    size === s
                      ? "border-brand-primary bg-brand-primary text-brand-primary-foreground"
                      : "border-border hover:border-brand-primary/50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {product.printTimeHours}
              {dict.common.hours}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="size-3.5" />
              {product.deliveryDaysMin}-{product.deliveryDaysMax} {dict.common.days}
            </span>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-2">
            <QuantityStepper value={quantity} onChange={setQuantity} size="sm" className="h-9 px-1" />
            <Button
              disabled={!product.inStock}
              className="h-9 flex-1 rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
              onClick={handleAdd}
            >
              {product.inStock ? dict.common.addToCart : dict.common.outOfStock}
            </Button>
          </div>
          <Link
            href={`/modely/${product.slug}`}
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
          >
            {dict.common.viewDetail}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
