import {
  SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD_ID,
  FREE_SHIPPING_THRESHOLD,
  FREE_SHIPPING_BASIS,
  getShippingMethod,
  type ShippingMethod,
} from "@/lib/shipping"

export {
  SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD_ID,
  FREE_SHIPPING_THRESHOLD,
  getShippingMethod,
}
export type { ShippingMethod }

export const COUPONS: Record<string, number> = { AGAMA10: 0.1 }

export const DEFAULT_VAT_RATE = 0.23

export const IS_VAT_PAYER = process.env.NEXT_PUBLIC_IS_VAT_PAYER === "true"

export function resolveVatRate(opts: {
  isVatPayer: boolean
  rawRate?: string
}): number | null {
  if (!opts.isVatPayer) return null
  const raw = opts.rawRate
  if (raw === undefined || raw.trim() === "") return DEFAULT_VAT_RATE
  const parsed = Number(raw)
  return Number.isNaN(parsed) || parsed <= 0 ? null : parsed
}

export const VAT_RATE: number | null = resolveVatRate({
  isVatPayer: IS_VAT_PAYER,
  rawRate: process.env.NEXT_PUBLIC_VAT_RATE,
})

export function normalizeCoupon(code: string | null | undefined): string | null {
  if (!code) return null
  const normalized = code.trim().toUpperCase()
  return normalized in COUPONS ? normalized : null
}

export interface PricedLine {
  unitPrice: number
  quantity: number
}

export interface OrderTotals {
  subtotal: number
  couponCode: string | null
  discountRate: number
  discountAmount: number
  shippingMethodId: string
  shipping: number
  freeShipping: boolean
  vatRate: number | null
  vatAmount: number | null
  netAmount: number | null
  total: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function computeTotals(
  lines: PricedLine[],
  opts: {
    couponCode?: string | null
    shippingMethodId?: string
    vatRate?: number | null
  } = {}
): OrderTotals {
  const subtotal = round2(
    lines.reduce((sum, line) => sum + line.unitPrice * Math.max(0, line.quantity), 0)
  )

  const couponCode = normalizeCoupon(opts.couponCode)
  const discountRate = couponCode ? COUPONS[couponCode] : 0
  const discountAmount = round2(subtotal * discountRate)
  const afterDiscount = round2(subtotal - discountAmount)

  const method = getShippingMethod(opts.shippingMethodId)
  const shippingBasis = FREE_SHIPPING_BASIS === "pre-discount" ? subtotal : afterDiscount
  const freeShipping = shippingBasis <= 0 || shippingBasis >= FREE_SHIPPING_THRESHOLD
  const shipping = freeShipping ? 0 : method.price

  const total = round2(afterDiscount + shipping)

  const vatRate = opts.vatRate !== undefined ? opts.vatRate : VAT_RATE
  const vatAmount =
    vatRate != null && vatRate > 0 ? round2(total - total / (1 + vatRate)) : null
  const netAmount = vatAmount != null ? round2(total - vatAmount) : null

  return {
    subtotal,
    couponCode,
    discountRate,
    discountAmount,
    shippingMethodId: method.id,
    shipping,
    freeShipping,
    vatRate: vatAmount != null ? vatRate : null,
    vatAmount,
    netAmount,
    total,
  }
}
