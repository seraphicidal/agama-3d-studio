"use client"

import * as React from "react"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { ProductCard } from "@/components/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getNewArrivals } from "@/lib/data/products"
import { dict } from "@/lib/i18n"

const PAGE_SIZE = 8
const all = getNewArrivals()

export function NewArrivalsSection() {
  const [count, setCount] = React.useState(PAGE_SIZE)
  const [loading, setLoading] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && count < all.length && !loading) {
          setLoading(true)
          setTimeout(() => {
            setCount((c) => Math.min(c + PAGE_SIZE, all.length))
            setLoading(false)
          }, 500)
        }
      },
      { rootMargin: "300px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [count, loading])

  const visible = all.slice(0, count)

  return (
    <section className="py-20 sm:py-28">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Novinky"
          title={dict.home.newArrivalsTitle}
          subtitle={dict.home.newArrivalsSubtitle}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`s-${i}`} className="space-y-2">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>
            ))}
        </div>
        {count < all.length && <div ref={sentinelRef} className="h-1" />}
      </Container>
    </section>
  )
}
