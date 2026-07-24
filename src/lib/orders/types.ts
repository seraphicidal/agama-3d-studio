import type { OrderStatus } from "@/lib/types"

export type { OrderStatus }

export interface OrderLineItem {
  productId: string
  name: string
  /** Human variant summary, e.g. "PLA · Čierna · M". */
  variant: string
  /** VAT-inclusive unit price. */
  unitPrice: number
  quantity: number
  lineTotal: number
  vatRate: number | null
  /** VAT portion of lineTotal (prices are VAT-inclusive). */
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

// Snapshot of a placed order. Money fields are EUR (VAT-inclusive) unless noted.
export interface OrderRecord {
  number: string
  status: OrderStatus
  currency: string
  /** null for a guest order. */
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
  /** VAT portion of the whole order total. */
  vatAmount: number | null
  netAmount: number | null
  total: number
  paymentProvider: string
  paymentReference: string
}
