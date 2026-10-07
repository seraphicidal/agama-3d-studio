import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { queryProducts } from "@/lib/data/products"
import { getCategoryBySlug } from "@/lib/data/categories"

const querySchema = z.object({
  kategoria: z.string().trim().min(1).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z
    .enum(["newest", "popular", "rating", "price-asc", "price-desc", "alpha"])
    .default("newest"),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

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
