"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import {
  Heart,
  Share2,
  Truck,
  Clock,
  ShieldCheck,
  Rotate3d,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Container } from "@/components/container"
import { RatingStars } from "@/components/rating-stars"
import { ProductCard } from "@/components/product/product-card"
import { SectionHeading } from "@/components/section-heading"
import { QuantityStepper } from "@/components/quantity-stepper"
import { ModelViewerLazy } from "@/components/three/model-viewer-lazy"
import type { ModelVariant } from "@/components/three/model-viewer"
import type { Product, Review } from "@/lib/types"
import { formatPrice, formatDate } from "@/lib/format"
import { useCartStore } from "@/store/cart-store"
import { useWishlistStore } from "@/store/wishlist-store"
import { useUIStore } from "@/store/ui-store"
import { getCreatorById } from "@/lib/data/creators"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function variantForProduct(product: Product): ModelVariant {
  const ids = product.categoryIds
  if (ids.some((c) => ["prototypes", "replacement-parts", "stl-printing"].includes(c)))
    return "gem"
  if (ids.some((c) => ["home-decor", "desk-accessories", "keychains"].includes(c)))
    return "vase"
  return "knot"
}

export function ProductDetailView({
  product,
  related,
  reviews,
}: {
  product: Product
  related: Product[]
  reviews: Review[]
}) {
  const [activeImage, setActiveImage] = React.useState(0)
  const [material, setMaterial] = React.useState(product.variants.materials[0])
  const [color, setColor] = React.useState(product.variants.colors[0])
  const [size, setSize] = React.useState(product.variants.sizes[0])
  const [quantity, setQuantity] = React.useState(1)
  const [view360, setView360] = React.useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useUIStore((s) => s.setCartOpen)
  const isWishlisted = useWishlistStore((s) => s.has(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const creator = getCreatorById(product.creatorId)

  function handleAddToCart() {
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
    setCartOpen(true)
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {})
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(window.location.href)
      toast.success(dict.common.linkCopied)
    }
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Domov</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/modely" />}>Modely</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary">
              {view360 ? (
                <>
                  <ModelViewerLazy variant={variantForProduct(product)} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-3 bottom-3 z-10 bg-background/90 backdrop-blur-sm sm:left-auto sm:right-24"
                    onClick={() => setView360(false)}
                  >
                    {dict.viewer.backToPhotos}
                  </Button>
                </>
              ) : (
                <>
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm"
                    onClick={() => setView360(true)}
                  >
                    <Rotate3d className="size-3.5" />
                    3D
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(i)
                    setView360(false)
                  }}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl bg-secondary ring-2 ring-transparent transition-all",
                    activeImage === i && !view360 && "ring-brand-primary"
                  )}
                >
                  <Image src={img} alt="" fill sizes="150px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              {creator && (
                <Link
                  href={`/tvorcovia/${creator.slug}`}
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  {dict.common.by} {creator.name}
                </Link>
              )}
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
              <p className="text-muted-foreground">{product.tagline}</p>
              <div className="flex items-center gap-3 pt-1">
                {product.reviewCount > 0 && (
                  <>
                    <RatingStars rating={product.rating} size={16} />
                    <span className="text-sm text-muted-foreground">
                      {product.rating.toFixed(1)} ({product.reviewCount} {dict.common.reviews})
                    </span>
                  </>
                )}
                <Badge variant={product.inStock ? "default" : "secondary"} className={product.inStock ? "bg-brand-primary text-brand-primary-foreground" : ""}>
                  {product.inStock ? dict.common.inStock : dict.common.outOfStock}
                </Badge>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 rounded-2xl bg-secondary p-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-brand-primary" />
                {dict.common.printTime}: {product.printTimeHours}
                {dict.common.hours}
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-brand-primary" />
                {dict.common.delivery}: {product.deliveryDaysMin}-{product.deliveryDaysMax} {dict.common.days}
              </div>
            </div>

            <Separator />

            <div className="space-y-5">
              <div className="space-y-2.5">
                <p className="text-sm font-medium">{dict.common.material}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.materials.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMaterial(m)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        material === m
                          ? "border-brand-primary bg-brand-primary text-brand-primary-foreground"
                          : "border-border hover:border-brand-primary/50"
                      )}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-medium">
                  {dict.common.color}: <span className="font-normal text-muted-foreground">{color.name}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColor(c)}
                      aria-label={c.name}
                      className={cn(
                        "size-9 rounded-full border-2 transition-transform hover:scale-110",
                        color.id === c.id ? "border-brand-primary" : "border-transparent"
                      )}
                      style={{ backgroundColor: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-sm font-medium">{dict.common.size}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
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
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <Button
                size="lg"
                disabled={!product.inStock}
                className="h-11 flex-1 rounded-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-accent"
                onClick={handleAddToCart}
              >
                {product.inStock ? dict.common.addToCart : dict.common.outOfStock}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-11 shrink-0 rounded-full"
                onClick={() => toggleWishlist(product.id)}
                aria-label={dict.nav.wishlist}
              >
                <Heart className={cn("size-4", isWishlisted && "fill-brand-orange text-brand-orange")} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-11 shrink-0 rounded-full"
                onClick={handleShare}
                aria-label="Zdieľať"
              >
                <Share2 className="size-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-brand-primary" />
              Bezpečná platba a starostlivo zabalené doručenie
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="flex-wrap">
              <TabsTrigger value="description">Popis</TabsTrigger>
              <TabsTrigger value="specifications">Špecifikácie</TabsTrigger>
              <TabsTrigger value="reviews">Recenzie ({reviews.length})</TabsTrigger>
              <TabsTrigger value="printing">Nastavenia tlače</TabsTrigger>
              <TabsTrigger value="materials">Materiály</TabsTrigger>
              <TabsTrigger value="shipping">Doprava</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="max-w-3xl py-6 text-muted-foreground">
              <p>{product.description}</p>
            </TabsContent>

            <TabsContent value="specifications" className="max-w-2xl py-6">
              <dl className="divide-y divide-border">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-3 text-sm">
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="max-w-2xl space-y-6 py-6">
              {reviews.length === 0 && (
                <p className="text-sm text-muted-foreground">{dict.common.noReviews}</p>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="space-y-2 border-b border-border pb-6 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-9 overflow-hidden rounded-full bg-secondary">
                        {review.avatar && (
                          <Image src={review.avatar} alt="" fill sizes="36px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} size={13} />
                  </div>
                  <p className="text-sm font-medium">{review.title}</p>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="printing" className="max-w-2xl py-6">
              <dl className="divide-y divide-border">
                {product.printingSettings.map((s) => (
                  <div key={s.label} className="flex justify-between py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="materials" className="max-w-2xl py-6 text-sm text-muted-foreground">
              <p>
                Tento model tlačíme z materiálov:{" "}
                <span className="font-medium text-foreground">
                  {product.variants.materials.map((m) => m.toUpperCase()).join(", ")}
                </span>
                . Podrobné vlastnosti každého materiálu nájdeš na{" "}
                <Link href="/materialy" className="text-brand-primary hover:underline">
                  stránke Materiály
                </Link>
                .
              </p>
            </TabsContent>

            <TabsContent value="shipping" className="max-w-2xl space-y-3 py-6 text-sm text-muted-foreground">
              <p>
                Odhadovaný čas výroby je {product.printTimeHours} hodín. Po dokončení expedujeme
                do {product.deliveryDaysMin}-{product.deliveryDaysMax} pracovných dní kuriérom
                priamo k tebe domov.
              </p>
              <p>Každý výtlačok starostlivo balíme do vlastného obalu navrhnutého tak, aby model prežil cestu bez poškodenia.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <SectionHeading title="Podobné modely" className="mb-8" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
