import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { CategoryCard } from "@/components/category/category-card"
import { categories } from "@/lib/data/categories"
import { dict } from "@/lib/i18n"

export function CategoriesSection() {
  const featured = categories.slice(0, 10)

  return (
    <section className="py-20 sm:py-28">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Kategórie"
          title={dict.home.categoriesTitle}
          subtitle={dict.home.categoriesSubtitle}
          action={{ label: dict.common.viewAll, href: "/kategorie" }}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {featured.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}
