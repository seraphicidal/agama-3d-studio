import type { OrderRecord, OrderLineItem, OrderAddress } from "./types"
import { computeTotals, type PricedLine } from "@/lib/pricing"

export interface BuildOrderLine {
  productId: string
  name: string
  variant: string
  unitPrice: number
  quantity: number
}

export interface BuildOrderInput {
  number: string
  userId: string | null
  customerEmail: string
  customerName: string
  address: OrderAddress
  shippingMethodId: string
  couponCode?: string | null
  currency?: string
  paymentProvider: string
  paymentReference: string
  lines: BuildOrderLine[]
  vatRate?: number | null
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5)
  const rand = Math.floor(Math.random() * 36 ** 2)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")
  return `AGM-${stamp}${rand}`
}

function backOutVat(grossAmount: number, rate: number | null) {
  if (rate == null || rate <= 0) return { vatAmount: null, netAmount: null }
  const vatAmount = round2(grossAmount - grossAmount / (1 + rate))
  return { vatAmount, netAmount: round2(grossAmount - vatAmount) }
}

export function buildOrder(input: BuildOrderInput): OrderRecord {
  const priced: PricedLine[] = input.lines.map((l) => ({
    unitPrice: l.unitPrice,
    quantity: l.quantity,
  }))
  const totals = computeTotals(priced, {
    couponCode: input.couponCode,
    shippingMethodId: input.shippingMethodId,
    ...(input.vatRate !== undefined ? { vatRate: input.vatRate } : {}),
  })

  const items: OrderLineItem[] = input.lines.map((l) => {
    const lineTotal = round2(l.unitPrice * l.quantity)
    const { vatAmount, netAmount } = backOutVat(lineTotal, totals.vatRate)
    return {
      productId: l.productId,
      name: l.name,
      variant: l.variant,
      unitPrice: l.unitPrice,
      quantity: l.quantity,
      lineTotal,
      vatRate: totals.vatRate,
      vatAmount,
      netAmount,
    }
  })

  return {
    number: input.number,
    status: "processing",
    currency: input.currency ?? "EUR",
    userId: input.userId,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    shippingAddress: input.address,
    shippingMethodId: totals.shippingMethodId,
    items,
    subtotal: totals.subtotal,
    discountCode: totals.couponCode,
    discountAmount: totals.discountAmount,
    shipping: totals.shipping,
    vatRate: totals.vatRate,
    vatAmount: totals.vatAmount,
    netAmount: totals.netAmount,
    total: totals.total,
    paymentProvider: input.paymentProvider,
    paymentReference: input.paymentReference,
  }
}
