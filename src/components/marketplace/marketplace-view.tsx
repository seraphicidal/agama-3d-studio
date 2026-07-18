"use client"

import * as React from "react"
import { SlidersHorizontal, Search } from "lucide-react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product/product-card"
import { FilterSidebar } from "@/components/marketplace/filter-sidebar"
import { products } from "@/lib/data/products"
import { categories } from "@/lib/data/categories"

export interface MarketplaceFilters {
  categories: string[]
  materials: string[]
  colors: string[]
  designers: string[]
  minRating: number
  inStockOnly: boolean
  maxPrintTime: number
  license: ("personal" | "commercial")[]
  priceRange: [number, number]
}

const DEFAULT_FILTERS: MarketplaceFilters = {
  categories: [],
  materials: [],
  colors: [],
  designers: [],
  minRating: 0,
  inStockOnly: false,
  maxPrintTime: 36,
  license: [],
  priceRange: [0, 150],
}

const SORT_OPTIONS = [
  { value: "newest", label: "Najnovšie" },
  { value: "popular", label: "Najpopulárnejšie" },
  { value: "rating", label: "Najlepšie hodnotené" },
  { value: "price-asc", label: "Cena: od najnižšej" },
  { value: "price-desc", label: "Cena: od najvyššej" },
  { value: "alpha", label: "Abecedne" },
]

export function MarketplaceView({
  initialCategory,
  initialQuery,
  initialSort,
}: {
  initialCategory?: string
  initialQuery?: string
  initialSort?: string
}) {
  const [filters, setFilters] = React.useState<MarketplaceFilters>(() => {
    const cat = categories.find((c) => c.slug === initialCategory)
    return cat ? { ...DEFAULT_FILTERS, categories: [cat.id] } : DEFAULT_FILTERS
  })
  const [query, setQuery] = React.useState(initialQuery ?? "")
  const [sort, setSort] = React.useState(initialSort ?? "newest")
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    let list = products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false
      if (filters.categories.length && !p.categoryIds.some((c) => filters.categories.includes(c)))
        return false
      if (
        filters.materials.length &&
        !p.variants.materials.some((m) => filters.materials.includes(m))
      )
        return false
      if (
        filters.colors.length &&
        !p.variants.colors.some((c) => filters.colors.includes(c.id))
      )
        return false
      if (filters.designers.length && !filters.designers.includes(p.creatorId)) return false
      if (filters.minRating && p.rating < filters.minRating) return false
      if (filters.inStockOnly && !p.inStock) return false
      if (p.printTimeHours > filters.maxPrintTime) return false
      if (filters.license.length && !filters.license.includes(p.license)) return false
      if (p.price.amount < filters.priceRange[0] || p.price.amount > filters.priceRange[1])
        return false
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "popular":
          return b.reviewCount - a.reviewCount
        case "rating":
          return b.rating - a.rating
        case "price-asc":
          return a.price.amount - b.price.amount
        case "price-desc":
          return b.price.amount - a.price.amount
        case "alpha":
          return a.name.localeCompare(b.name)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return list
  }, [filters, query, sort])

  const activeFilterCount =
    filters.categories.length +
    filters.materials.length +
    filters.colors.length +
    filters.designers.length +
    filters.license.length +
    (filters.minRating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Modely</h1>
          <p className="text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "model" : "modelov"} k dispozícii
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hľadaj modely..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" />
              Filtre
              {activeFilterCount > 0 && (
                <Badge className="ml-1 h-5 bg-brand-primary px-1.5 text-brand-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Select value={sort} onValueChange={(v) => v && setSort(v)}>
              <SelectTrigger className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onReset={() => setFilters(DEFAULT_FILTERS)}
              />
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
                <p className="font-medium">Žiadne modely nezodpovedajú filtrom</p>
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Vymazať filtre
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Filtre</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
