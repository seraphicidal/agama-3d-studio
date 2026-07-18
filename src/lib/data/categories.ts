import type { Category } from "@/lib/types"
import { categoryImage } from "./images"

export const categories: Category[] = [
  {
    id: "anime",
    slug: "anime",
    name: "Anime",
    description: "Postavy a doplnky inšpirované japonskou animáciou.",
    image: categoryImage("anime"),
    productCount: 42,
  },
  {
    id: "gaming",
    slug: "gaming",
    name: "Gaming",
    description: "Herné rekvizity, stojany a zberateľské predmety.",
    image: categoryImage("gaming"),
    productCount: 37,
  },
  {
    id: "fantasy",
    slug: "fantasy",
    name: "Fantasy",
    description: "Svet mágie, hrdinov a mýtických tvorov.",
    image: categoryImage("fantasy"),
    productCount: 55,
  },
  {
    id: "dragons",
    slug: "draci",
    name: "Draci",
    description: "Articulated aj statické draky každej veľkosti.",
    image: categoryImage("dragons"),
    productCount: 28,
  },
  {
    id: "animals",
    slug: "zvierata",
    name: "Zvieratá",
    description: "Realistické aj štylizované zvieracie modely.",
    image: categoryImage("animals"),
    productCount: 33,
  },
  {
    id: "collectible-display",
    slug: "zberatelske-figurky",
    name: "Zberateľské figúrky",
    description: "Malé zberateľské postavičky pre tvoju vitrínu.",
    image: categoryImage("collectible"),
    productCount: 61,
  },
  {
    id: "cosplay",
    slug: "cosplay",
    name: "Cosplay",
    description: "Masky, brnenia a doplnky pre tvoj ďalší kostým.",
    image: categoryImage("cosplay"),
    productCount: 19,
  },
  {
    id: "replacement-parts",
    slug: "nahradne-diely",
    name: "Náhradné diely",
    description: "Presné náhrady za rozbité alebo chýbajúce diely.",
    image: categoryImage("parts"),
    productCount: 24,
  },
  {
    id: "desk-accessories",
    slug: "doplnky-na-stol",
    name: "Doplnky na stôl",
    description: "Organizéry, stojany a praktické maličkosti.",
    image: categoryImage("desk"),
    productCount: 31,
  },
  {
    id: "miniatures",
    slug: "miniatury",
    name: "Miniatúry",
    description: "Detailné miniatúry pre stolové hry a zberateľov.",
    image: categoryImage("miniatures"),
    productCount: 48,
  },
  {
    id: "home-decor",
    slug: "bytove-dekoracie",
    name: "Bytové dekorácie",
    description: "Sochy, vázy a dekoratívne doplnky do interiéru.",
    image: categoryImage("decor"),
    productCount: 26,
  },
  {
    id: "keychains",
    slug: "klucenky",
    name: "Kľúčenky",
    description: "Drobné, obľúbené a rýchlo vytlačiteľné doplnky.",
    image: categoryImage("keychains"),
    productCount: 40,
  },
  {
    id: "custom-prints",
    slug: "zakazkova-tlac",
    name: "Zákazková tlač",
    description: "Vlastný návrh vytlačený presne podľa teba.",
    image: categoryImage("custom"),
    productCount: 12,
  },
  {
    id: "stl-printing",
    slug: "stl-tlac",
    name: "STL tlač",
    description: "Nahraj vlastný súbor a nechaj nás ho vytlačiť.",
    image: categoryImage("stl"),
    productCount: 8,
  },
  {
    id: "prototypes",
    slug: "prototypy",
    name: "Prototypy",
    description: "Funkčné prototypy pre vývoj a testovanie.",
    image: categoryImage("prototypes"),
    productCount: 15,
  },
]

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id)
}
