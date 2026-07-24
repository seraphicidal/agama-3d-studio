"use client"

import * as React from "react"
import { Heart } from "lucide-react"
import { Container } from "@/components/container"
import { ProductCard } from "@/components/product/product-card"
import { LinkButton } from "@/components/ui/link-button"
import { useWishlistStore } from "@/store/wishlist-store"
import type { Product } from "@/lib/types"
import { dict } from "@/lib/i18n"

export function WishlistView({ products }: { products: Product[] }) {
  // Wishlist lives in localStorage; render after mount to avoid an
  // SSR (always empty) vs client (persisted) mismatch.
  const [mounted, setMounted] = React.useState(false)
  const wishlistIds = useWishlistStore((s) => s.productIds)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const wishlistProducts = mounted
    ? products.filter((p) => wishlistIds.includes(p.id))
    : []

  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">{dict.nav.wishlist}</h1>
          {mounted && wishlistProducts.length > 0 && (
            <p className="text-muted-foreground">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "model" : "modelov"}
            </p>
          )}
        </div>

        {mounted && wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
            <Heart className="size-8 text-muted-foreground" />
            <p className="font-medium">Zatiaľ nemáš obľúbené modely</p>
            <p className="text-sm text-muted-foreground">
              Klikni na srdiečko pri modeli a nájdeš ho tu.
            </p>
            <LinkButton href="/modely" variant="outline" className="mt-2 rounded-full">
              {dict.checkout.browseModels}
            </LinkButton>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
