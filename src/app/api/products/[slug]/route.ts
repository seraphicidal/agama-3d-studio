import { NextResponse } from "next/server"
import { getProductBySlug } from "@/lib/data/products"

/** GET /api/products/:slug — single product detail. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json(product, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  })
}
