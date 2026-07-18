import { NextResponse } from "next/server"
import { categories } from "@/lib/data/categories"

/** GET /api/categories — full category list. */
export function GET() {
  return NextResponse.json(
    { items: categories, total: categories.length },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
