import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { queryProducts } from "@/lib/data/products"
import { getCategoryBySlug } from "@/lib/data/categories"

// Validate + coerce query params at the trust boundary. Unknown params are
// stripped (lenient); malformed known params return 400 with per-field detail.
const querySchema = z.object({
  kategoria: z.string().trim().min(1).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z
    .enum(["newest", "popular", "rating", "price-asc", "price-desc", "alpha"])
    .default("newest"),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

/**
 * GET /api/products?kategoria=<slug>&q=<text>&sort=<ProductSort>&limit=<n>
 * Serves the mock catalog today; the response shape is what the Supabase-backed
 * implementation will keep returning.
 */
export function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  )
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    )
  }

  const { kategoria, q, sort, limit } = parsed.data

  const category = kategoria ? getCategoryBySlug(kategoria) : undefined
  if (kategoria && !category) {
    return NextResponse.json(
      { error: `Unknown category: ${kategoria}` },
      { status: 400 }
    )
  }

  const items = queryProducts({ categoryId: category?.id, q, sort, limit })

  return NextResponse.json(
    { items, total: items.length },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
