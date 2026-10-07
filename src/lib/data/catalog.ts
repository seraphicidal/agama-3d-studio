import type { Category } from "@/lib/types"
import { categories } from "./categories"
import { products } from "./products"

export function getCategoriesWithCounts(): Category[] {
  return categories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.categoryIds.includes(category.id)).length,
  }))
}
