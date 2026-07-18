export type Currency = "EUR"

export interface Money {
  amount: number
  currency: Currency
}

export type MaterialId =
  | "pla"
  | "petg"
  | "abs"
  | "asa"
  | "tpu"
  | "resin"
  | "carbon-fiber"

export interface MaterialInfo {
  id: MaterialId
  name: string
  shortDescription: string
  pros: string[]
  cons: string[]
  recommendedUse: string[]
  image: string
  color: string
}

export interface ColorOption {
  id: string
  name: string
  hex: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
  productCount: number
}

export interface Creator {
  id: string
  slug: string
  name: string
  avatar: string
  bio: string
  followers: number
  featuredPrintIds: string[]
  location: string
  joinedYear: number
}

export interface Review {
  id: string
  productId: string
  author: string
  avatar?: string
  rating: number
  date: string
  title: string
  comment: string
  photos?: string[]
  verified: boolean
}

export interface ProductVariant {
  materials: MaterialId[]
  colors: ColorOption[]
  sizes: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  categoryIds: string[]
  creatorId: string
  price: Money
  compareAtPrice?: Money
  images: string[]
  rating: number
  reviewCount: number
  variants: ProductVariant
  printTimeHours: number
  deliveryDaysMin: number
  deliveryDaysMax: number
  inStock: boolean
  trending?: boolean
  newArrival?: boolean
  featured?: boolean
  license: "personal" | "commercial"
  sizeCm: { width: number; height: number; depth: number }
  weightGrams: number
  specifications: { label: string; value: string }[]
  printingSettings: { label: string; value: string }[]
  createdAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  coverImage: string
  author: string
  date: string
  readMinutes: number
  tags: string[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  image: string
  price: Money
  quantity: number
  material: string
  color: string
  size: string
}

export interface Address {
  id: string
  label: string
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone: string
  isDefault?: boolean
}

export type OrderStatus =
  | "processing"
  | "printing"
  | "shipped"
  | "delivered"
  | "cancelled"

export interface Order {
  id: string
  number: string
  date: string
  status: OrderStatus
  total: Money
  items: CartItem[]
}
