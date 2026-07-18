import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { ProductCard } from "@/components/product/product-card"
import { getTrendingProducts } from "@/lib/data/products"
import { dict } from "@/lib/i18n"

export function TrendingSection() {
  const trending = getTrendingProducts().slice(0, 8)

  return (
    <section className="py-20 sm:py-28">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Obľúbené"
          title={dict.home.trendingTitle}
          subtitle={dict.home.trendingSubtitle}
          action={{ label: dict.common.viewAll, href: "/modely?sort=trending" }}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {trending.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </Container>
    </section>
  )
}
