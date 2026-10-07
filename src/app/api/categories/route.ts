import { NextResponse } from "next/server"
import { getCategoriesWithCounts } from "@/lib/data/catalog"

export function GET() {
  const items = getCategoriesWithCounts()
  return NextResponse.json(
    { items, total: items.length },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  )
}
