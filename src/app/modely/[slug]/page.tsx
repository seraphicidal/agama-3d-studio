import { notFound } from "next/navigation"
import { getProductBySlug, getRelatedProducts, products } from "@/lib/data/products"
import { getReviewsForProduct } from "@/lib/data/reviews"
import { ProductDetailView } from "@/components/product/product-detail-view"

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

  return <ProductDetailView product={product} related={related} reviews={reviews} />
}
