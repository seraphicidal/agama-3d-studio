"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Plus, Clock, Truck, Eye, Ruler } from "lucide-react"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { RatingStars } from "@/components/rating-stars"
import { QuickView } from "@/components/product/quick-view"
import { useWishlistStore } from "@/store/wishlist-store"
import { useCartStore } from "@/store/cart-store"
import { getCategoryById } from "@/lib/data/categories"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function ProductCard({
  product,
  compact = false,
  priority = false,
}: {
  product: Product
  compact?: boolean
  priority?: boolean
}) {
  const isWishlisted = useWishlistStore((s) => s.has(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const addItem = useCartStore((s) => s.addItem)
  const [quickViewOpen, setQuickViewOpen] = React.useState(false)

  const category = getCategoryById(product.categoryIds[0])

  function quickAdd() {
    if (!product.inStock) return
    addItem({
      id: `${product.id}-${product.variants.materials[0]}-${product.variants.colors[0].id}-${product.variants.sizes[0]}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      material: product.variants.materials[0].toUpperCase(),
      color: product.variants.colors[0].name,
      size: product.variants.sizes[0],
    })
    toast.success(`${product.name} ${dict.common.addedToCart}`)
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative"
    >
      {/* Stretched link keeps the whole card clickable without nesting the
          action <button>s inside an <a> (invalid HTML + a11y problem). */}
      <Link
        href={`/modely/${product.slug}`}
        aria-label={product.name}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-brand-primary"
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-secondary",
          compact ? "aspect-square" : "aspect-[4/5]"
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />

        {(product.newArrival || product.trending || product.compareAtPrice) && (
          <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {product.newArrival && (
              <span className="rounded-full bg-brand-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-primary-foreground">
                {dict.common.new}
              </span>
            )}
            {product.trending && !product.newArrival && (
              <span className="rounded-full bg-brand-dark/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {dict.common.trending}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-orange-foreground">
                {dict.common.sale}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={dict.nav.wishlist}
          aria-pressed={isWishlisted}
          className="absolute right-2.5 top-2.5 z-20 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-transform hover:scale-110"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              isWishlisted && "fill-brand-orange text-brand-orange"
            )}
          />
        </button>

        {!compact && (
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex translate-y-3 gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            {product.inStock && (
              <button
                onClick={quickAdd}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-background/95 py-2.5 text-xs font-semibold text-foreground backdrop-blur-sm hover:bg-brand-primary hover:text-brand-primary-foreground"
              >
                <Plus className="size-3.5" />
                {dict.common.quickAdd}
              </button>
            )}
            <button
              onClick={() => setQuickViewOpen(true)}
              aria-label={dict.common.quickView}
              className="flex items-center justify-center rounded-xl bg-background/95 px-3 text-foreground backdrop-blur-sm hover:bg-brand-primary hover:text-brand-primary-foreground"
            >
              <Eye className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className={cn("space-y-1.5", compact ? "pt-2" : "pt-3")}>
        {!compact && category && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {category.name}
          </p>
        )}
        <h3 className={cn("font-medium leading-tight", compact ? "text-xs" : "text-sm")}>
          {product.name}
        </h3>

        {!compact && product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RatingStars rating={product.rating} size={11} />
            <span>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && !compact && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {!compact && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11px] text-muted-foreground">
            <span>{product.variants.materials[0].toUpperCase()}</span>
            <span className="flex items-center gap-1">
              <Ruler className="size-3" />
              {product.sizeCm.height} cm
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {product.printTimeHours}
              {dict.common.hours}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="size-3" />
              {product.deliveryDaysMin}-{product.deliveryDaysMax} {dict.common.days}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 font-medium",
                product.inStock ? "text-brand-primary" : "text-destructive"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  product.inStock ? "bg-brand-primary" : "bg-destructive"
                )}
              />
              {product.inStock ? dict.common.inStock : dict.common.outOfStock}
            </span>
          </div>
        )}
      </div>

      {!compact && quickViewOpen && (
        <QuickView
          product={product}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      )}
    </motion.article>
  )
}
