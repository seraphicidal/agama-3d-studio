import { Container } from "@/components/container"
import { CategoryCard } from "@/components/category/category-card"
import { categories } from "@/lib/data/categories"

export const metadata = { title: "Kategórie" }

export default function CategoriesPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Kategórie</h1>
          <p className="text-lg text-muted-foreground">
            Preskúmaj celú našu ponuku podľa témy — od fantasy a anime po náhradné diely a
            zákazkovú tlač.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} size="large" />
          ))}
        </div>
      </Container>
    </div>
  )
}
