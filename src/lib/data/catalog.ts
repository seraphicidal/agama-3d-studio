import type { Category } from "@/lib/types"
import { categories } from "./categories"
import { products } from "./products"

// Joins the pure category reference list to the product catalog to produce real
// per-category counts. Importing this pulls in the product catalog, so use it
// only from server components / route handlers, then pass the result as props —
// never import it from a client component (that would defeat the split in
// ./categories that keeps the catalog out of client bundles).
export function getCategoriesWithCounts(): Category[] {
  return categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryIds.includes(category.id)).length,
  }))
}
