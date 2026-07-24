import type { Category } from "@/lib/types"
import { categoryImage } from "./images"

// Pure reference data — intentionally does NOT import the product catalog, so
// that client components using getCategoryById/BySlug (e.g. product cards, which
// only need the category name) don't drag the whole catalog into their bundle.
// Real per-category counts are joined server-side by getCategoriesWithCounts()
// in ./catalog — the only module that couples categories to products.
export type CategoryBase = Omit<Category, "productCount">

export const categories: CategoryBase[] = [
  {
    id: "anime",
    slug: "anime",
    name: "Anime",
    description: "Postavy a doplnky inšpirované japonskou animáciou.",
    image: categoryImage("anime"),
  },
  {
    id: "gaming",
    slug: "gaming",
    name: "Gaming",
    description: "Herné rekvizity, stojany a zberateľské predmety.",
    image: categoryImage("gaming"),
  },
  {
    id: "fantasy",
    slug: "fantasy",
    name: "Fantasy",
    description: "Svet mágie, hrdinov a mýtických tvorov.",
    image: categoryImage("fantasy"),
  },
  {
    id: "dragons",
    slug: "draci",
    name: "Draci",
    description: "Articulated aj statické draky každej veľkosti.",
    image: categoryImage("dragons"),
  },
  {
    id: "animals",
    slug: "zvierata",
    name: "Zvieratá",
    description: "Realistické aj štylizované zvieracie modely.",
    image: categoryImage("animals"),
  },
  {
    id: "collectible-display",
    slug: "zberatelske-figurky",
    name: "Zberateľské figúrky",
    description: "Malé zberateľské postavičky pre tvoju vitrínu.",
    image: categoryImage("collectible"),
  },
  {
    id: "cosplay",
    slug: "cosplay",
    name: "Cosplay",
    description: "Masky, brnenia a doplnky pre tvoj ďalší kostým.",
    image: categoryImage("cosplay"),
  },
  {
    id: "replacement-parts",
    slug: "nahradne-diely",
    name: "Náhradné diely",
    description: "Presné náhrady za rozbité alebo chýbajúce diely.",
    image: categoryImage("parts"),
  },
  {
    id: "desk-accessories",
    slug: "doplnky-na-stol",
    name: "Doplnky na stôl",
    description: "Organizéry, stojany a praktické maličkosti.",
    image: categoryImage("desk"),
  },
  {
    id: "miniatures",
    slug: "miniatury",
    name: "Miniatúry",
    description: "Detailné miniatúry pre stolové hry a zberateľov.",
    image: categoryImage("miniatures"),
  },
  {
    id: "home-decor",
    slug: "bytove-dekoracie",
    name: "Bytové dekorácie",
    description: "Sochy, vázy a dekoratívne doplnky do interiéru.",
    image: categoryImage("decor"),
  },
  {
    id: "keychains",
    slug: "klucenky",
    name: "Kľúčenky",
    description: "Drobné, obľúbené a rýchlo vytlačiteľné doplnky.",
    image: categoryImage("keychains"),
  },
  {
    id: "custom-prints",
    slug: "zakazkova-tlac",
    name: "Zákazková tlač",
    description: "Vlastný návrh vytlačený presne podľa teba.",
    image: categoryImage("custom"),
  },
  {
    id: "stl-printing",
    slug: "stl-tlac",
    name: "STL tlač",
    description: "Nahraj vlastný súbor a nechaj nás ho vytlačiť.",
    image: categoryImage("stl"),
  },
  {
    id: "prototypes",
    slug: "prototypy",
    name: "Prototypy",
    description: "Funkčné prototypy pre vývoj a testovanie.",
    image: categoryImage("prototypes"),
  },
]

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id)
}
