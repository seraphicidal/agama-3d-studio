import type { Product, MaterialId } from "@/lib/types"
import { productImage } from "./images"

const COLORS = {
  standard: [
    { id: "black", name: "Čierna", hex: "#1a1a1a" },
    { id: "white", name: "Biela", hex: "#f5f5f5" },
    { id: "green", name: "Agama zelená", hex: "#7fb239" },
    { id: "orange", name: "Oranžová", hex: "#d8893a" },
  ],
  fantasy: [
    { id: "bronze", name: "Bronzová", hex: "#8c6b3f" },
    { id: "silver", name: "Strieborná", hex: "#c7c7c7" },
    { id: "obsidian", name: "Obsidiánová", hex: "#232323" },
    { id: "emerald", name: "Smaragdová", hex: "#2e7d5b" },
  ],
  vivid: [
    { id: "red", name: "Červená", hex: "#c94b3f" },
    { id: "blue", name: "Modrá", hex: "#3b6fc4" },
    { id: "purple", name: "Fialová", hex: "#7a4fc7" },
    { id: "yellow", name: "Žltá", hex: "#e0b23c" },
  ],
}

// Fixed anchor for all relative mock dates. Using Date.now() here caused a real
// hydration bug: this module evaluates in both the server and client bundles, and
// products sharing the same `daysAgo` (e.g. two at 60) flipped sort order whenever
// the two evaluations landed across a millisecond boundary.
export const MOCK_NOW = Date.parse("2026-07-18T12:00:00Z")

interface ProductSeed {
  id: string
  name: string
  tagline: string
  description: string
  categoryIds: string[]
  creatorId: string
  price: number
  compareAtPrice?: number
  images?: number
  rating: number
  reviewCount: number
  materials: MaterialId[]
  colors: (typeof COLORS)["standard"]
  sizes?: string[]
  printTimeHours: number
  deliveryDaysMin: number
  deliveryDaysMax: number
  trending?: boolean
  newArrival?: boolean
  featured?: boolean
  license?: "personal" | "commercial"
  size: { width: number; height: number; depth: number }
  weight: number
  daysAgo: number
}

function buildProduct(seed: ProductSeed): Product {
  return {
    id: seed.id,
    slug: seed.id,
    name: seed.name,
    tagline: seed.tagline,
    description: seed.description,
    categoryIds: seed.categoryIds,
    creatorId: seed.creatorId,
    price: { amount: seed.price, currency: "EUR" },
    compareAtPrice: seed.compareAtPrice
      ? { amount: seed.compareAtPrice, currency: "EUR" }
      : undefined,
    images: Array.from({ length: seed.images ?? 4 }, (_, i) =>
      productImage(seed.id, i)
    ),
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    variants: {
      materials: seed.materials,
      colors: seed.colors,
      sizes: seed.sizes ?? ["S", "M", "L"],
    },
    printTimeHours: seed.printTimeHours,
    deliveryDaysMin: seed.deliveryDaysMin,
    deliveryDaysMax: seed.deliveryDaysMax,
    inStock: true,
    trending: seed.trending,
    newArrival: seed.newArrival,
    featured: seed.featured,
    license: seed.license ?? "personal",
    sizeCm: seed.size,
    weightGrams: seed.weight,
    specifications: [
      { label: "Materiál", value: seed.materials.map((m) => m.toUpperCase()).join(" / ") },
      { label: "Rozmery", value: `${seed.size.width} × ${seed.size.height} × ${seed.size.depth} cm` },
      { label: "Hmotnosť", value: `${seed.weight} g` },
      { label: "Licencia", value: seed.license === "commercial" ? "Komerčná" : "Osobné použitie" },
    ],
    printingSettings: [
      { label: "Výška vrstvy", value: "0.12 – 0.2 mm" },
      { label: "Výplň", value: "15 – 25 %" },
      { label: "Podpory", value: "Áno, organické" },
      { label: "Post-processing", value: "Brúsenie, základový náter" },
    ],
    createdAt: new Date(MOCK_NOW - seed.daysAgo * 86400000).toISOString(),
  }
}

const seeds: ProductSeed[] = [
  {
    id: "dragon-bust",
    name: "Dragon Bust",
    tagline: "Monumentálna busta draka v detailnom prevedení",
    description:
      "Vysoko detailná busta draka určená pre zberateľov. Vytlačená technológiou living hinge s dôrazom na šupiny, rohy a mimiku. Ideálna ako centrálny bod v tvojej vitríne.",
    categoryIds: ["fantasy", "dragons", "home-decor"],
    creatorId: "martin-k",
    price: 89,
    compareAtPrice: 109,
    rating: 4.9,
    reviewCount: 142,
    materials: ["resin", "pla"],
    colors: COLORS.fantasy,
    printTimeHours: 18,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    trending: true,
    featured: true,
    size: { width: 22, height: 28, depth: 18 },
    weight: 640,
    daysAgo: 40,
  },
  {
    id: "baby-dragon",
    name: "Baby Dragon",
    tagline: "Roztomilý articulated dráčik s pohyblivými kĺbmi",
    description:
      "Malý dráčik s plne pohyblivými kĺbmi vytlačený na jeden diel bez potreby lepenia. Obľúbený fidget model pre všetky vekové kategórie.",
    categoryIds: ["dragons", "fantasy", "animals"],
    creatorId: "martin-k",
    price: 24,
    rating: 4.8,
    reviewCount: 318,
    materials: ["pla", "petg"],
    colors: COLORS.vivid,
    printTimeHours: 6,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    trending: true,
    size: { width: 18, height: 8, depth: 6 },
    weight: 120,
    daysAgo: 12,
  },
  {
    id: "articulated-snake",
    name: "Articulated Snake",
    tagline: "Had s reálnym pohybom, tlačený bez podpôr",
    description:
      "Plne článkovaný had, ktorý sa hýbe presne ako živý. Tlačený priamo v pohyblivej forme — žiadne skladanie, žiadne lepenie.",
    categoryIds: ["animals", "desk-accessories"],
    creatorId: "eva-s",
    price: 19,
    rating: 4.7,
    reviewCount: 256,
    materials: ["pla", "petg"],
    colors: COLORS.vivid,
    printTimeHours: 5,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    size: { width: 45, height: 4, depth: 4 },
    weight: 95,
    daysAgo: 60,
  },
  {
    id: "anime-warrior-figure",
    name: "Anime Warrior Figure",
    tagline: "Zberateľská figúrka bojovníka s dynamickou pózou",
    description:
      "Detailná figúrka inšpirovaná anime bojovníkmi, ručne domaľovaná do vysokého lesku. Limitovaná séria pre náročných zberateľov.",
    categoryIds: ["anime", "collectible-display"],
    creatorId: "lucia-h",
    price: 54,
    rating: 4.9,
    reviewCount: 98,
    materials: ["resin"],
    colors: COLORS.standard,
    printTimeHours: 10,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    featured: true,
    size: { width: 12, height: 24, depth: 10 },
    weight: 210,
    daysAgo: 8,
  },
  {
    id: "pokemon-display-stand",
    name: "Pokémon Display Stand",
    tagline: "Elegantný stojan pre tvoju zberateľskú kolekciu",
    description:
      "Modulárny vystavovací stojan navrhnutý pre malé zberateľské figúrky. Stohovateľný dizajn šetrí miesto na poličke.",
    categoryIds: ["collectible-display", "gaming", "desk-accessories"],
    creatorId: "lucia-h",
    price: 16,
    rating: 4.6,
    reviewCount: 187,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    printTimeHours: 4,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    newArrival: true,
    size: { width: 10, height: 6, depth: 10 },
    weight: 60,
    daysAgo: 4,
  },
  {
    id: "skull-lamp",
    name: "Skull Lamp",
    tagline: "Gotická stolná lampa v tvare lebky",
    description:
      "Atmosférická stolná lampa s vnútorným rozptylom svetla cez tenké steny modelu. Dodáva sa s LED modulom a USB napájaním.",
    categoryIds: ["home-decor", "desk-accessories"],
    creatorId: "eva-s",
    price: 42,
    rating: 4.8,
    reviewCount: 133,
    materials: ["pla", "resin"],
    colors: COLORS.standard,
    printTimeHours: 14,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    trending: true,
    size: { width: 14, height: 16, depth: 14 },
    weight: 310,
    daysAgo: 22,
  },
  {
    id: "cosplay-mask-oni",
    name: "Cosplay Mask — Oni",
    tagline: "Divoká japonská maska Oni pre cosplay a dekoráciu",
    description:
      "Anatomicky tvarovaná maska Oni s pohodlným nosením na celý deň. Povrch pripravený na maľovanie a lakovanie.",
    categoryIds: ["cosplay"],
    creatorId: "peter-v",
    price: 38,
    rating: 4.7,
    reviewCount: 76,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    printTimeHours: 9,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    size: { width: 22, height: 26, depth: 14 },
    weight: 280,
    daysAgo: 30,
  },
  {
    id: "cosplay-helmet-visor",
    name: "Cosplay Helmet Visor",
    tagline: "Sci-fi prilba s priehľadným priezorom",
    description:
      "Futuristická prilba v niekoľkých tlačených dieloch pripravených na zloženie. Vhodná pre veľké convention kostýmy.",
    categoryIds: ["cosplay", "gaming"],
    creatorId: "peter-v",
    price: 76,
    rating: 4.6,
    reviewCount: 41,
    materials: ["abs", "asa"],
    colors: COLORS.standard,
    printTimeHours: 22,
    deliveryDaysMin: 5,
    deliveryDaysMax: 9,
    size: { width: 30, height: 32, depth: 28 },
    weight: 520,
    daysAgo: 15,
  },
  {
    id: "fantasy-wizard-miniature",
    name: "Fantasy Wizard Miniature",
    tagline: "32mm miniatúra čarodejníka pre stolové hry",
    description:
      "Vysoko detailná 32mm miniatúra pripravená na maľovanie. Kompatibilná s bežnými stolovými RPG systémami.",
    categoryIds: ["miniatures", "fantasy"],
    creatorId: "zuzana-m",
    price: 9,
    rating: 4.9,
    reviewCount: 210,
    materials: ["resin"],
    colors: COLORS.standard,
    sizes: ["28mm", "32mm", "54mm"],
    printTimeHours: 2,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    trending: true,
    size: { width: 3, height: 3.2, depth: 3 },
    weight: 15,
    daysAgo: 6,
  },
  {
    id: "dnd-terrain-tower",
    name: "D&D Terrain Tower",
    tagline: "Modulárna veža ako terén pre stolové hry",
    description:
      "Modulárna herná veža v mierke 28mm s odnímateľnou strechou a detailným interiérom. Skvelý terénny prvok na herný stôl.",
    categoryIds: ["miniatures", "fantasy", "gaming"],
    creatorId: "zuzana-m",
    price: 68,
    rating: 4.8,
    reviewCount: 54,
    materials: ["pla"],
    colors: COLORS.standard,
    printTimeHours: 26,
    deliveryDaysMin: 5,
    deliveryDaysMax: 8,
    size: { width: 20, height: 34, depth: 20 },
    weight: 780,
    daysAgo: 50,
  },
  {
    id: "orc-warband-set",
    name: "Orc Warband Set",
    tagline: "Sada 10 orčích bojovníkov s rôznymi pózami",
    description:
      "Kompletná sada desiatich orkov v rôznych bojových pózach. Ideálna pre wargaming a stolové RPG kampane.",
    categoryIds: ["miniatures", "fantasy"],
    creatorId: "zuzana-m",
    price: 45,
    rating: 4.7,
    reviewCount: 63,
    materials: ["resin"],
    colors: COLORS.standard,
    sizes: ["28mm", "32mm"],
    printTimeHours: 12,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    newArrival: true,
    size: { width: 3, height: 3.5, depth: 3 },
    weight: 140,
    daysAgo: 3,
  },
  {
    id: "gear-replacement-part",
    name: "Gear Replacement Part",
    tagline: "Presné ozubené koleso na mieru pre domáce spotrebiče",
    description:
      "Funkčné náhradné ozubené koleso tlačené z odolného materiálu podľa presných rozmerov originálu. Pošli nám fotku alebo rozmer a vytlačíme presný náhrad.",
    categoryIds: ["replacement-parts", "prototypes"],
    creatorId: "tomas-b",
    price: 14,
    rating: 4.5,
    reviewCount: 89,
    materials: ["petg", "abs", "asa"],
    colors: COLORS.standard,
    sizes: ["Na mieru"],
    printTimeHours: 3,
    deliveryDaysMin: 2,
    deliveryDaysMax: 5,
    size: { width: 6, height: 6, depth: 1.5 },
    weight: 25,
    daysAgo: 70,
  },
  {
    id: "drone-propeller-guard",
    name: "Drone Propeller Guard",
    tagline: "Ochranný kryt vrtule pre FPV drony",
    description:
      "Ľahký, ale odolný ochranný kryt vrtule pre bežné veľkosti FPV dronov. Testovaný na náraz a flexibilitu.",
    categoryIds: ["replacement-parts", "prototypes", "gaming"],
    creatorId: "tomas-b",
    price: 12,
    rating: 4.6,
    reviewCount: 47,
    materials: ["tpu", "petg"],
    colors: COLORS.standard,
    printTimeHours: 2,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    size: { width: 8, height: 8, depth: 2 },
    weight: 18,
    daysAgo: 25,
  },
  {
    id: "camera-mount-bracket",
    name: "Camera Mount Bracket",
    tagline: "Univerzálny držiak kamery na tripod alebo rig",
    description:
      "Precízny držiak kompatibilný so štandardným 1/4″ závitom. Navrhnutý pre maximálnu tuhosť pri minimálnej hmotnosti.",
    categoryIds: ["prototypes", "desk-accessories"],
    creatorId: "tomas-b",
    price: 17,
    rating: 4.7,
    reviewCount: 35,
    materials: ["petg", "carbon-fiber"],
    colors: COLORS.standard,
    printTimeHours: 3,
    deliveryDaysMin: 2,
    deliveryDaysMax: 5,
    newArrival: true,
    size: { width: 7, height: 3, depth: 5 },
    weight: 32,
    daysAgo: 5,
  },
  {
    id: "geometric-vase",
    name: "Geometric Vase",
    tagline: "Minimalistická váza s geometrickým vzorom",
    description:
      "Vodotesná váza tlačená technikou vase mode s jemným geometrickým reliéfom. Škandinávsky dizajn pre moderný interiér.",
    categoryIds: ["home-decor", "desk-accessories"],
    creatorId: "eva-s",
    price: 28,
    rating: 4.8,
    reviewCount: 121,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    printTimeHours: 7,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    size: { width: 12, height: 20, depth: 12 },
    weight: 180,
    daysAgo: 18,
  },
  {
    id: "desk-organizer-set",
    name: "Desk Organizer Set",
    tagline: "Modulárny organizér pre poriadok na stole",
    description:
      "Sada modulárnych zásobníkov, ktoré do seba zapadajú a dajú sa poskladať podľa potreby tvojho stola.",
    categoryIds: ["desk-accessories"],
    creatorId: "eva-s",
    price: 22,
    rating: 4.7,
    reviewCount: 156,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    printTimeHours: 5,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    trending: true,
    size: { width: 20, height: 8, depth: 12 },
    weight: 210,
    daysAgo: 33,
  },
  {
    id: "custom-nameplate",
    name: "Custom Nameplate",
    tagline: "Personalizovaná tabuľka s menom na stôl alebo dvere",
    description:
      "Nechaj si vyrobiť menovku presne podľa vlastného textu a farby. Ideálny darček alebo doplnok na pracovný stôl.",
    categoryIds: ["desk-accessories", "custom-prints"],
    creatorId: "eva-s",
    price: 15,
    rating: 4.9,
    reviewCount: 204,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    sizes: ["Na mieru"],
    printTimeHours: 3,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    size: { width: 15, height: 4, depth: 1 },
    weight: 45,
    daysAgo: 2,
    newArrival: true,
  },
  {
    id: "mechanical-keycap-set",
    name: "Mechanical Keyboard Keycap Set",
    tagline: "Sada dizajnových keycapov pre mechanickú klávesnicu",
    description:
      "Sada 8 tematických keycapov kompatibilných s Cherry MX prepínačmi. Skvelý spôsob ako oživiť svoj setup.",
    categoryIds: ["desk-accessories", "gaming"],
    creatorId: "tomas-b",
    price: 26,
    rating: 4.6,
    reviewCount: 88,
    materials: ["petg", "resin"],
    colors: COLORS.vivid,
    printTimeHours: 4,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    size: { width: 1.8, height: 1.8, depth: 1.2 },
    weight: 8,
    daysAgo: 9,
  },
  {
    id: "bearded-dragon-statue",
    name: "Bearded Dragon Statue",
    tagline: "Realistická socha vodnej agamy v životnej veľkosti",
    description:
      "Detailná socha bradatej agamy s presnou textúrou šupín. Naša značková figúrka — pocta menu štúdia.",
    categoryIds: ["animals", "home-decor"],
    creatorId: "martin-k",
    price: 64,
    rating: 5.0,
    reviewCount: 71,
    materials: ["resin", "pla"],
    colors: COLORS.fantasy,
    printTimeHours: 16,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    featured: true,
    size: { width: 26, height: 10, depth: 14 },
    weight: 420,
    daysAgo: 45,
  },
  {
    id: "mecha-pilot-figure",
    name: "Mecha Pilot Figure",
    tagline: "Figúrka pilota v sci-fi mecha obleku",
    description:
      "Vysoko detailná figúrka pilota inšpirovaná mecha anime žánrom. Dodáva sa s výmennou zbraňou.",
    categoryIds: ["anime", "gaming", "collectible-display"],
    creatorId: "lucia-h",
    price: 48,
    rating: 4.8,
    reviewCount: 66,
    materials: ["resin"],
    colors: COLORS.standard,
    printTimeHours: 11,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    size: { width: 10, height: 18, depth: 8 },
    weight: 165,
    daysAgo: 27,
  },
  {
    id: "armor-pauldron-set",
    name: "Armor Pauldron Set",
    tagline: "Sada ramenných chráničov pre fantasy brnenie",
    description:
      "Pár ozdobných ramenných chráničov v štýle fantasy brnenia. Ľahké nosenie vďaka dutej konštrukcii.",
    categoryIds: ["cosplay", "fantasy"],
    creatorId: "peter-v",
    price: 34,
    rating: 4.5,
    reviewCount: 29,
    materials: ["pla", "abs"],
    colors: COLORS.fantasy,
    printTimeHours: 8,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    size: { width: 16, height: 14, depth: 10 },
    weight: 190,
    daysAgo: 14,
  },
  {
    id: "phone-stand-adjustable",
    name: "Adjustable Phone Stand",
    tagline: "Nastaviteľný stojan na telefón pre stôl",
    description:
      "Kompaktný a stabilný stojan s nastaviteľným uhlom, vhodný pre videohovory aj sledovanie videí.",
    categoryIds: ["desk-accessories"],
    creatorId: "tomas-b",
    price: 11,
    rating: 4.6,
    reviewCount: 174,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    printTimeHours: 2,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    size: { width: 9, height: 10, depth: 7 },
    weight: 55,
    daysAgo: 55,
  },
  {
    id: "keychain-pack-icons",
    name: "Keychain Pack — Icons",
    tagline: "Sada 5 minimalistických kľúčeniek",
    description:
      "Sada piatich obľúbených ikonických tvarov ako kľúčenky. Odolný a ľahký materiál pre každodenné použitie.",
    categoryIds: ["keychains"],
    creatorId: "eva-s",
    price: 13,
    rating: 4.7,
    reviewCount: 233,
    materials: ["pla", "petg"],
    colors: COLORS.vivid,
    printTimeHours: 2,
    deliveryDaysMin: 2,
    deliveryDaysMax: 4,
    trending: true,
    size: { width: 4, height: 4, depth: 0.6 },
    weight: 10,
    daysAgo: 11,
  },
  {
    id: "articulated-dragon-large",
    name: "Articulated Dragon — Large",
    tagline: "Veľký pohyblivý drak s krídlami, 50cm",
    description:
      "Náš najväčší articulated drak s pohyblivými krídlami a chvostom. Vlajková loď našej dračej kolekcie.",
    categoryIds: ["dragons", "fantasy", "home-decor"],
    creatorId: "martin-k",
    price: 119,
    compareAtPrice: 139,
    rating: 4.9,
    reviewCount: 87,
    materials: ["pla", "petg"],
    colors: COLORS.fantasy,
    printTimeHours: 32,
    deliveryDaysMin: 6,
    deliveryDaysMax: 10,
    trending: true,
    featured: true,
    size: { width: 50, height: 20, depth: 15 },
    weight: 890,
    daysAgo: 20,
  },
  {
    id: "prototype-enclosure-box",
    name: "Prototype Enclosure Box",
    tagline: "Elektronický kryt na mieru pre tvoj projekt",
    description:
      "Presný kryt navrhnutý podľa tvojich rozmerov PCB alebo elektroniky. Ideálne pre maker a IoT projekty.",
    categoryIds: ["prototypes", "custom-prints"],
    creatorId: "tomas-b",
    price: 21,
    rating: 4.5,
    reviewCount: 22,
    materials: ["petg", "abs", "asa"],
    colors: COLORS.standard,
    sizes: ["Na mieru"],
    printTimeHours: 5,
    deliveryDaysMin: 3,
    deliveryDaysMax: 6,
    license: "commercial",
    size: { width: 10, height: 6, depth: 4 },
    weight: 60,
    daysAgo: 60,
  },
  {
    id: "wall-mounted-planter",
    name: "Wall Mounted Planter",
    tagline: "Nástenný kvetináč so skrytým samozavlažovaním",
    description:
      "Elegantný nástenný kvetináč so zabudovaným zásobníkom vody pre menšiu údržbu tvojich rastlín.",
    categoryIds: ["home-decor", "desk-accessories"],
    creatorId: "eva-s",
    price: 19,
    rating: 4.6,
    reviewCount: 64,
    materials: ["pla", "petg"],
    colors: COLORS.standard,
    printTimeHours: 6,
    deliveryDaysMin: 3,
    deliveryDaysMax: 5,
    newArrival: true,
    size: { width: 16, height: 12, depth: 9 },
    weight: 150,
    daysAgo: 1,
  },
]

export const products: Product[] = seeds.map(buildProduct)

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryIds.includes(categoryId))
}

export function getProductsByCreator(creatorId: string) {
  return products.filter((p) => p.creatorId === creatorId)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categoryIds.some((c) => product.categoryIds.includes(c))
    )
    .slice(0, limit)
}

export function getTrendingProducts() {
  return products.filter((p) => p.trending)
}

export function getNewArrivals() {
  return [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}

export type ProductSort =
  | "newest"
  | "popular"
  | "rating"
  | "price-asc"
  | "price-desc"
  | "alpha"

export interface ProductQuery {
  categoryId?: string
  q?: string
  sort?: ProductSort
  limit?: number
}

// Single query seam shared by the API routes (and later the real DB layer —
// swap the body for a Supabase query without touching callers).
export function queryProducts({ categoryId, q, sort = "newest", limit }: ProductQuery) {
  let list = products.filter((p) => {
    if (categoryId && !p.categoryIds.includes(categoryId)) return false
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false
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

  return typeof limit === "number" ? list.slice(0, Math.max(0, limit)) : list
}
