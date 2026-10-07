import type { OrderStatus } from "@/lib/types"

export type { OrderStatus }

export interface OrderLineItem {
  productId: string
  name: string
  variant: string
  unitPrice: number
  quantity: number
  lineTotal: number
  vatRate: number | null
  vatAmount: number | null
  netAmount: number | null
}

export interface OrderAddress {
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

export interface OrderRecord {
  number: string
  status: OrderStatus
  currency: string
  userId: string | null
  customerEmail: string
  customerName: string
  shippingAddress: OrderAddress
  shippingMethodId: string
  items: OrderLineItem[]
  subtotal: number
  discountCode: string | null
  discountAmount: number
  shipping: number
  vatRate: number | null
  vatAmount: number | null
  netAmount: number | null
  total: number
  paymentProvider: string
  paymentReference: string
}
