import type { Creator } from "@/lib/types"
import { creatorAvatar, creatorCover } from "./images"

export const creators: Creator[] = [
  {
    id: "martin-k",
    slug: "martin-kovac",
    name: "Martin Kováč",
    avatar: creatorAvatar("martin"),
    bio: "Zakladateľ Agama 3D Studio. Špecializuje sa na fantasy busty a articulated modely.",
    followers: 4210,
    featuredPrintIds: ["dragon-bust", "baby-dragon", "articulated-snake"],
    location: "Bratislava",
    joinedYear: 2019,
  },
  {
    id: "lucia-h",
    slug: "lucia-horvathova",
    name: "Lucia Horváthová",
    avatar: creatorAvatar("lucia"),
    bio: "Dizajnérka zameraná na anime a herné postavy s dôrazom na detail.",
    followers: 3120,
    featuredPrintIds: ["anime-warrior-figure", "pokemon-display-stand", "mecha-pilot-figure"],
    location: "Košice",
    joinedYear: 2020,
  },
  {
    id: "tomas-b",
    slug: "tomas-baran",
    name: "Tomáš Baran",
    avatar: creatorAvatar("tomas"),
    bio: "Inžinier a modelár. Tvorí precízne náhradné diely a funkčné prototypy.",
    followers: 1890,
    featuredPrintIds: ["gear-replacement-part", "drone-propeller-guard", "camera-mount-bracket"],
    location: "Žilina",
    joinedYear: 2021,
  },
  {
    id: "eva-s",
    slug: "eva-strakova",
    name: "Eva Straková",
    avatar: creatorAvatar("eva"),
    bio: "Autorka minimalistických dekorácií a doplnkov do domácnosti.",
    followers: 2650,
    featuredPrintIds: ["skull-lamp", "geometric-vase", "desk-organizer-set"],
    location: "Nitra",
    joinedYear: 2020,
  },
  {
    id: "peter-v",
    slug: "peter-vranka",
    name: "Peter Vranka",
    avatar: creatorAvatar("peter"),
    bio: "Cosplay tvorca — masky, prilby a brnenia pre conové kostýmy.",
    followers: 5430,
    featuredPrintIds: ["cosplay-mask-oni", "cosplay-helmet-visor", "armor-pauldron-set"],
    location: "Prešov",
    joinedYear: 2018,
  },
  {
    id: "zuzana-m",
    slug: "zuzana-molnarova",
    name: "Zuzana Molnárová",
    avatar: creatorAvatar("zuzana"),
    bio: "Maliarka a sochárka miniatúr pre stolové hry a zberateľov.",
    followers: 3980,
    featuredPrintIds: ["fantasy-wizard-miniature", "dnd-terrain-tower", "orc-warband-set"],
    location: "Trnava",
    joinedYear: 2021,
  },
]

export function getCreatorBySlug(slug: string) {
  return creators.find((c) => c.slug === slug)
}

export function getCreatorById(id: string) {
  return creators.find((c) => c.id === id)
}

export { creatorCover }
