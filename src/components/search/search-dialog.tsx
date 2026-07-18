"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Clock, Search as SearchIcon, TrendingUp } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useUIStore } from "@/store/ui-store"
import { useSearchStore } from "@/store/search-store"
import { products } from "@/lib/data/products"
import { categories } from "@/lib/data/categories"
import { formatPrice } from "@/lib/format"
import { dict } from "@/lib/i18n"

export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen)
  const setOpen = useUIStore((s) => s.setSearchOpen)
  const [query, setQuery] = React.useState("")
  const router = useRouter()
  const recent = useSearchStore((s) => s.recent)
  const addRecent = useSearchStore((s) => s.addRecent)

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

  const matchedProducts = query
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6)
    : products.filter((p) => p.trending).slice(0, 4)

  const matchedCategories = query
    ? categories
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : categories.slice(0, 5)

  function go(path: string, term?: string) {
    if (term) addRecent(term)
    setOpen(false)
    setQuery("")
    router.push(path)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={dict.nav.search}
      description={dict.search.placeholder}
    >
      <CommandInput
        placeholder={dict.search.placeholder}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[65vh]">
        <CommandEmpty>{dict.search.noResults}</CommandEmpty>

        {!query && recent.length > 0 && (
          <CommandGroup heading={dict.search.recent}>
            {recent.map((term) => (
              <CommandItem
                key={term}
                value={term}
                onSelect={() => go(`/modely?q=${encodeURIComponent(term)}`, term)}
              >
                <Clock className="size-4 text-muted-foreground" />
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading={query ? dict.search.inCategories : "Trendy kategórie"}>
          {matchedCategories.map((c) => (
            <CommandItem
              key={c.id}
              value={c.name}
              onSelect={() => go(`/modely?kategoria=${c.slug}`, c.name)}
            >
              <TrendingUp className="size-4 text-muted-foreground" />
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading={query ? dict.search.inProducts : dict.common.trending}>
          {matchedProducts.map((p) => (
            <CommandItem
              key={p.id}
              value={p.name}
              onSelect={() => go(`/modely/${p.slug}`, p.name)}
              className="gap-3"
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm">{p.name}</span>
                <span className="text-xs text-muted-foreground">{formatPrice(p.price)}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        {query && (
          <CommandGroup>
            <CommandItem onSelect={() => go(`/modely?q=${encodeURIComponent(query)}`, query)}>
              <SearchIcon className="size-4 text-muted-foreground" />
              Hľadať &quot;{query}&quot; vo všetkých modeloch
            </CommandItem>
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
