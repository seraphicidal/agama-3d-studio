import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products"
import { getReviewsForProduct } from "@/lib/data/reviews"
import { ProductDetailView } from "@/components/product/product-detail-view"
import { JsonLd } from "@/components/json-ld"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/modely/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.images[0], width: 1000, height: 1000 }],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product)
  const reviews = getReviewsForProduct(product.id, 6)

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/modely/${product.slug}`,
      priceCurrency: product.price.currency,
      price: product.price.amount,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Domov", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Modely", item: `${SITE_URL}/modely` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${SITE_URL}/modely/${product.slug}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ProductDetailView product={product} related={related} reviews={reviews} />
    </>
  )
}
