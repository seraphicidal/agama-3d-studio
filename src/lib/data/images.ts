// Central place for imagery. Every URL below was verified (via browser fetch)
// to resolve to a real photo before being added here — swapping in actual
// product photography later means editing this file only.

function unsplash(id: string, w = 1000, h = 1000) {
  return `https://images.unsplash.com/${id}?q=80&w=${w}&h=${h}&auto=format&fit=crop`
}

function picsum(seed: string, w = 900, h = 900) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

const CATEGORY_IMAGES: Record<string, string> = {
  anime: "photo-1764083680353-0de3e959a375",
  gaming: "photo-1614179924047-e1ab49a0a0cf",
  fantasy: "photo-1646003224990-b59ff1710e6e",
  dragons: "photo-1548412576-d92cb3275e23",
  animals: "photo-1619816128374-a6b4766ca92c",
  "collectible-display": "photo-1764709125089-740593af301d",
  cosplay: "photo-1576704563778-8fc304bd63c0",
  "replacement-parts": "photo-1769147339214-076740872485",
  "desk-accessories": "photo-1781213983314-037deccf30a7",
  miniatures: "photo-1577835890498-85ec5f648040",
  "home-decor": "photo-1769874825483-92ad32e92e25",
  keychains: "photo-1770515927688-74433e0d1ed9",
  "custom-prints": "photo-1741848137437-56fb14b7ba87",
  "stl-printing": "photo-1642969164999-979483e21601",
  prototypes: "photo-1769151174211-a1b2d41117bd",
}

const PRODUCT_HERO: Record<string, string> = {
  "dragon-bust": "photo-1646003224990-b59ff1710e6e",
  "baby-dragon": "photo-1556709909-c2f541087adb",
  "articulated-snake": "photo-1763824372054-e7ead3f18acc",
  "anime-warrior-figure": "photo-1764083680353-0de3e959a375",
  "pokemon-display-stand": "photo-1769179081871-f0fdd5ef90ee",
  "skull-lamp": "photo-1698176073290-ce84292f3771",
  "cosplay-mask-oni": "photo-1630198696583-a5e4e1275232",
  "cosplay-helmet-visor": "photo-1576704563778-8fc304bd63c0",
  "fantasy-wizard-miniature": "photo-1549056572-75914d5d5fd4",
  "dnd-terrain-tower": "photo-1547638382-ed227146ab88",
  "orc-warband-set": "photo-1549056630-ee2626bb5ad5",
  "gear-replacement-part": "photo-1769147339214-076740872485",
  "drone-propeller-guard": "photo-1723632670536-e3104577a19c",
  "camera-mount-bracket": "photo-1769151174211-a1b2d41117bd",
  "geometric-vase": "photo-1771862956454-ad43adc3c19e",
  "desk-organizer-set": "photo-1781213983314-037deccf30a7",
  "custom-nameplate": "photo-1764588037043-0fcea37695b6",
  "mechanical-keycap-set": "photo-1595044426077-d36d9236d54a",
  "bearded-dragon-statue": "photo-1619816128374-a6b4766ca92c",
  "mecha-pilot-figure": "photo-1777730039398-830cddd1cf15",
  "armor-pauldron-set": "photo-1698676974067-2f1710bca167",
  "phone-stand-adjustable": "photo-1636489953081-c4ebbd50fa3a",
  "keychain-pack-icons": "photo-1770515927688-74433e0d1ed9",
  "articulated-dragon-large": "photo-1664193314424-7f823ccaa301",
  "prototype-enclosure-box": "photo-1770816307472-945144576a1f",
  "wall-mounted-planter": "photo-1769874825483-92ad32e92e25",
}

const PRODUCT_GALLERY_EXTRA: string[] = [
  "photo-1642969164999-979483e21601",
  "photo-1706895247302-20d321119c1c",
  "photo-1644936580583-91eb0c32c3db",
  "photo-1702863361902-93c51bfbd923",
  "photo-1741848137437-56fb14b7ba87",
]

const CREATOR_AVATARS: Record<string, string> = {
  martin: "photo-1500648767791-00dcc994a43e",
  lucia: "photo-1494790108377-be9c29b29330",
  tomas: "photo-1531750026848-8ada78f641c2",
  eva: "photo-1758600587811-e9a20851cf7d",
  peter: "photo-1589386417686-0d34b5903d23",
  zuzana: "photo-1758600587811-e9a20851cf7d",
}

const MATERIAL_IMAGES: Record<string, string> = {
  pla: "photo-1742971239045-afabc9f7d744",
  petg: "photo-1739169169463-450148af26ce",
  abs: "photo-1645084102549-e766a3a24827",
  asa: "photo-1741848137437-56fb14b7ba87",
  tpu: "photo-1644936580583-91eb0c32c3db",
  resin: "photo-1547638382-ed227146ab88",
  "carbon-fiber": "photo-1723632670536-e3104577a19c",
}

const BLOG_IMAGES: Record<string, string> = {
  materials: "photo-1742971239045-afabc9f7d744",
  care: "photo-1764588037043-0fcea37695b6",
  process: "photo-1563520239648-a24e51d4b570",
  cosplay: "photo-1576704563778-8fc304bd63c0",
  minis: "photo-1577835890498-85ec5f648040",
}

const HERO_IMAGES = [
  "photo-1646003224990-b59ff1710e6e",
  "photo-1764083680353-0de3e959a375",
  "photo-1549056572-75914d5d5fd4",
  "photo-1741848137437-56fb14b7ba87",
  "photo-1698176073290-ce84292f3771",
  "photo-1770515927688-74433e0d1ed9",
]

const WORKSHOP_IMAGES = [
  "photo-1761519609252-3b868e540398",
  "photo-1563520239648-a24e51d4b570",
  "photo-1737332439478-4fe9721a2f3e",
  "photo-1702863361902-93c51bfbd923",
  "photo-1642969164999-979483e21601",
  "photo-1706895247302-20d321119c1c",
]

const INSTAGRAM_IMAGES = [
  "photo-1612538811009-ed19118a2b53",
  "photo-1558050032-160f36233a07",
  "photo-1781027237929-ee1b0448c812",
  "photo-1770816307472-945144576a1f",
  "photo-1707735325033-af8b8ad6a01f",
  "photo-1742971239045-afabc9f7d744",
  "photo-1737332439478-4fe9721a2f3e",
  "photo-1636489953081-c4ebbd50fa3a",
  "photo-1698676974067-2f1710bca167",
]

const TESTIMONIAL_PHOTOS: Record<string, string> = {
  t1: "photo-1758691031658-1883cf837461",
  t2: "photo-1636132425522-ad0ba8563953",
  t3: "photo-1556228149-0b37a8638663",
  t4: "photo-1500648767791-00dcc994a43e",
}

export const packagingImage = unsplash("photo-1541544181051-e46607bc22a4", 1400, 1000)

export function categoryImage(id: string) {
  const photo = CATEGORY_IMAGES[id]
  return photo ? unsplash(photo, 900, 1100) : picsum(`cat-${id}`, 900, 1100)
}

export function productImage(seed: string, index = 0) {
  if (index === 0 && PRODUCT_HERO[seed]) {
    return unsplash(PRODUCT_HERO[seed], 1000, 1000)
  }
  const extra = PRODUCT_GALLERY_EXTRA[(index + seed.length) % PRODUCT_GALLERY_EXTRA.length]
  return unsplash(extra, 1000, 1000)
}

export function creatorAvatar(id: string) {
  const photo = CREATOR_AVATARS[id]
  return photo ? unsplash(photo, 300, 300) : picsum(`avatar-${id}`, 300, 300)
}

export function creatorCover(seed: string) {
  const photo = WORKSHOP_IMAGES[seed.length % WORKSHOP_IMAGES.length]
  return unsplash(photo, 1200, 700)
}

export function materialImage(id: string) {
  const photo = MATERIAL_IMAGES[id]
  return photo ? unsplash(photo, 900, 700) : picsum(`mat-${id}`, 900, 700)
}

export function blogImage(id: string) {
  const photo = BLOG_IMAGES[id]
  return photo ? unsplash(photo, 1200, 800) : picsum(`blog-${id}`, 1200, 800)
}

export function reviewAvatar(seed: string) {
  return picsum(`review-${seed}`, 200, 200)
}

export function heroImage(index: number) {
  return unsplash(HERO_IMAGES[index % HERO_IMAGES.length], 1600, 1600)
}

export function workshopImage(index: number) {
  return unsplash(WORKSHOP_IMAGES[index % WORKSHOP_IMAGES.length], 1400, 1000)
}

export function instagramImage(index: number) {
  return unsplash(INSTAGRAM_IMAGES[index % INSTAGRAM_IMAGES.length], 800, 800)
}

export function testimonialPhoto(id: string) {
  const photo = TESTIMONIAL_PHOTOS[id]
  return photo ? unsplash(photo, 200, 200) : picsum(`t-${id}`, 200, 200)
}
