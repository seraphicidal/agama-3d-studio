"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Clock, Search as SearchIcon, TrendingUp, CornerDownLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUIStore } from "@/store/ui-store"
import { useSearchStore } from "@/store/search-store"
import type { Product, Category } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { dict } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface SearchItem {
  id: string
  label: string
  hint?: string
  image?: string
  icon?: React.ComponentType<{ className?: string }>
  path: string
  term?: string
}

interface SearchSection {
  heading: string
  items: SearchItem[]
}

// Hand-rolled command palette. Deliberately NOT cmdk: its listbox hard-crashed
// the renderer in an embedded-Chromium environment during testing, and all the
// filtering here is custom anyway — this drops the dependency entirely.
export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen)
  const setOpen = useUIStore((s) => s.setSearchOpen)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const router = useRouter()
  const recent = useSearchStore((s) => s.recent)
  const addRecent = useSearchStore((s) => s.addRecent)
  const listRef = React.useRef<HTMLDivElement>(null)
  const [catalog, setCatalog] = React.useState<{
    products: Product[]
    categories: Category[]
  } | null>(null)

  // Lazy-load the catalog the first time the palette opens, via the API — the
  // product array no longer ships in the global bundle through this
  // layout-level component.
  React.useEffect(() => {
    if (!open || catalog) return
    let active = true
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([p, c]) => {
        if (active)
          setCatalog({ products: p.items ?? [], categories: c.items ?? [] })
      })
      .catch(() => {
        if (active) setCatalog({ products: [], categories: [] })
      })
    return () => {
      active = false
    }
  }, [open, catalog])

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, setOpen])

  const sections = React.useMemo<SearchSection[]>(() => {
    const result: SearchSection[] = []
    const q = query.trim().toLowerCase()
    const cats = catalog?.categories ?? []
    const prods = catalog?.products ?? []

    if (!q && recent.length > 0) {
      result.push({
        heading: dict.search.recent,
        items: recent.map((term) => ({
          id: `recent-${term}`,
          label: term,
          icon: Clock,
          path: `/modely?q=${encodeURIComponent(term)}`,
          term,
        })),
      })
    }

    const matchedCategories = (
      q ? cats.filter((c) => c.name.toLowerCase().includes(q)) : cats
    ).slice(0, 5)
    if (matchedCategories.length > 0) {
      result.push({
        heading: q ? dict.search.inCategories : dict.search.trendingCategories,
        items: matchedCategories.map((c) => ({
          id: `cat-${c.id}`,
          label: c.name,
          icon: TrendingUp,
          path: `/modely?kategoria=${c.slug}`,
          term: c.name,
        })),
      })
    }

    const matchedProducts = (
      q
        ? prods.filter((p) => p.name.toLowerCase().includes(q))
        : prods.filter((p) => p.trending)
    ).slice(0, 6)
    if (matchedProducts.length > 0) {
      result.push({
        heading: q ? dict.search.inProducts : dict.common.trending,
        items: matchedProducts.map((p) => ({
          id: `product-${p.id}`,
          label: p.name,
          hint: formatPrice(p.price),
          image: p.images[0],
          path: `/modely/${p.slug}`,
          term: p.name,
        })),
      })
    }

    if (q) {
      result.push({
        heading: "",
        items: [
          {
            id: "search-all",
            label: dict.search.searchAll.replace("{query}", query.trim()),
            icon: SearchIcon,
            path: `/modely?q=${encodeURIComponent(query.trim())}`,
            term: query.trim(),
          },
        ],
      })
    }

    return result
  }, [query, recent, catalog])

  const flatItems = React.useMemo(() => sections.flatMap((s) => s.items), [sections])

  React.useEffect(() => {
    // Selection follows the query: reset highlight to the first result.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0)
  }, [query])

  function go(item: SearchItem) {
    if (item.term) addRecent(item.term)
    setOpen(false)
    setQuery("")
    router.push(item.path as Parameters<typeof router.push>[0])
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const delta = e.key === "ArrowDown" ? 1 : -1
      const next = flatItems.length
        ? (activeIndex + delta + flatItems.length) % flatItems.length
        : 0
      setActiveIndex(next)
      listRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" })
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = flatItems[activeIndex]
      if (item) go(item)
    }
  }

  let runningIndex = -1

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <DialogContent
        className="top-1/3 max-w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{dict.nav.search}</DialogTitle>
          <DialogDescription>{dict.search.placeholder}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={
              flatItems[activeIndex] ? `search-item-${flatItems[activeIndex].id}` : undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={dict.search.placeholder}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          className="max-h-[55vh] overflow-y-auto p-2"
        >
          {flatItems.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {dict.search.noResults}
            </p>
          )}

          {sections.map((section, si) => (
            <div key={section.heading || `section-${si}`} className="mb-1">
              {section.heading && (
                <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {section.heading}
                </p>
              )}
              {section.items.map((item) => {
                runningIndex += 1
                const index = runningIndex
                const active = index === activeIndex
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    id={`search-item-${item.id}`}
                    data-index={index}
                    role="option"
                    aria-selected={active}
                    onClick={() => go(item)}
                    onMouseMove={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                      active ? "bg-secondary text-foreground" : "text-foreground/85"
                    )}
                  >
                    {item.image ? (
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <Image src={item.image} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    ) : Icon ? (
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                    ) : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.hint && (
                      <span className="shrink-0 text-xs text-muted-foreground">{item.hint}</span>
                    )}
                    {active && (
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
