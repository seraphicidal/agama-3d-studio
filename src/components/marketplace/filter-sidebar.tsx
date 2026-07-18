"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/rating-stars"
import { categories } from "@/lib/data/categories"
import { creators } from "@/lib/data/creators"
import { materials } from "@/lib/data/materials"
import type { MarketplaceFilters } from "./marketplace-view"

const COLOR_SWATCHES = [
  { id: "black", hex: "#1a1a1a" },
  { id: "white", hex: "#f5f5f5" },
  { id: "green", hex: "#7fb239" },
  { id: "orange", hex: "#d8893a" },
  { id: "bronze", hex: "#8c6b3f" },
  { id: "silver", hex: "#c7c7c7" },
  { id: "obsidian", hex: "#232323" },
  { id: "emerald", hex: "#2e7d5b" },
  { id: "red", hex: "#c94b3f" },
  { id: "blue", hex: "#3b6fc4" },
  { id: "purple", hex: "#7a4fc7" },
  { id: "yellow", hex: "#e0b23c" },
]

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function FilterSidebar({
  filters,
  setFilters,
  onReset,
}: {
  filters: MarketplaceFilters
  setFilters: React.Dispatch<React.SetStateAction<MarketplaceFilters>>
  onReset: () => void
}) {
  return (
    <div className="space-y-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filtre</h2>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
          Vymazať
        </Button>
      </div>

      <Accordion defaultValue={["price", "category", "material"]}>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm">Cena</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Slider
              min={0}
              max={150}
              step={5}
              value={filters.priceRange}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, priceRange: v as [number, number] }))
              }
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{filters.priceRange[0]} €</span>
              <span>{filters.priceRange[1]} €</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className="text-sm">Kategória</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={filters.categories.includes(c.id)}
                  onCheckedChange={() =>
                    setFilters((f) => ({ ...f, categories: toggle(f.categories, c.id) }))
                  }
                />
                {c.name}
                <span className="ml-auto text-xs text-muted-foreground">{c.productCount}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="material">
          <AccordionTrigger className="text-sm">Materiál</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {materials.map((m) => (
              <label key={m.id} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={filters.materials.includes(m.id)}
                  onCheckedChange={() =>
                    setFilters((f) => ({ ...f, materials: toggle(f.materials, m.id) }))
                  }
                />
                {m.name}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="text-sm">Farba</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    setFilters((f) => ({ ...f, colors: toggle(f.colors, c.id) }))
                  }
                  aria-label={c.id}
                  className={`size-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    filters.colors.includes(c.id) ? "border-brand-primary" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="designer">
          <AccordionTrigger className="text-sm">Dizajnér</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {creators.map((c) => (
              <label key={c.id} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={filters.designers.includes(c.id)}
                  onCheckedChange={() =>
                    setFilters((f) => ({ ...f, designers: toggle(f.designers, c.id) }))
                  }
                />
                {c.name}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm">Hodnotenie</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {[4.5, 4, 3.5, 3].map((r) => (
              <label key={r} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={filters.minRating === r}
                  onCheckedChange={() =>
                    setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))
                  }
                />
                <RatingStars rating={r} size={13} />
                <span className="text-xs text-muted-foreground">a viac</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm">Dostupnosť</AccordionTrigger>
          <AccordionContent>
            <label className="flex items-center gap-2.5 text-sm">
              <Checkbox
                checked={filters.inStockOnly}
                onCheckedChange={(v) =>
                  setFilters((f) => ({ ...f, inStockOnly: !!v }))
                }
              />
              Iba skladom
            </label>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="printtime">
          <AccordionTrigger className="text-sm">Čas tlače</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Slider
              min={0}
              max={36}
              step={2}
              value={[filters.maxPrintTime]}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, maxPrintTime: (v as number[])[0] }))
              }
            />
            <p className="text-xs text-muted-foreground">Do {filters.maxPrintTime} h</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="license">
          <AccordionTrigger className="text-sm">Licencia</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {(["personal", "commercial"] as const).map((l) => (
              <label key={l} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={filters.license.includes(l)}
                  onCheckedChange={() =>
                    setFilters((f) => ({ ...f, license: toggle(f.license, l) }))
                  }
                />
                {l === "personal" ? "Osobné použitie" : "Komerčná"}
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
