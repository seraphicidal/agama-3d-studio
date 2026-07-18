import { NextResponse, type NextRequest } from "next/server"
import { queryProducts, type ProductSort } from "@/lib/data/products"
import { getCategoryBySlug } from "@/lib/data/categories"

const SORTS: ProductSort[] = ["newest", "popular", "rating", "price-asc", "price-desc", "alpha"]

/**
 * GET /api/products?kategoria=<slug>&q=<text>&sort=<ProductSort>&limit=<n>
 * Serves the mock catalog today; the response shape is what the Supabase-backed
 * implementation will keep returning.
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const categorySlug = params.get("kategoria") ?? undefined
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined
  if (categorySlug && !category) {
    return NextResponse.json(
      { error: `Unknown category: ${categorySlug}` },
      { status: 400 }
    )
  }

  const sortParam = params.get("sort") ?? "newest"
  if (!SORTS.includes(sortParam as ProductSort)) {
    return NextResponse.json({ error: `Unknown sort: ${sortParam}` }, { status: 400 })
  }

  const limitParam = params.get("limit")
  const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined
  if (limitParam && Number.isNaN(limit)) {
    return NextResponse.json({ error: "limit must be a number" }, { status: 400 })
  }

  const items = queryProducts({
    categoryId: category?.id,
    q: params.get("q") ?? undefined,
    sort: sortParam as ProductSort,
    limit,
  })

  return NextResponse.json(
    { items, total: items.length },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
