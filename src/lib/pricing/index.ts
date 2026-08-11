// Single source of truth for cart/checkout money math.
//
// Deliberately framework-free and catalog-free: it takes already-priced lines,
// so the SAME formula runs in two places without pulling the product catalog
// into the client bundle —
//   • client (cart drawer / checkout): a display *estimate* from cart prices;
//   • server (`/api/checkout/quote`, Stripe session, order creation): the
//     AUTHORITATIVE figure, built from catalog prices looked up by product id.
// Never trust client-sent totals — the server recomputes here from ids.

import {
  SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD_ID,
  FREE_SHIPPING_THRESHOLD,
  FREE_SHIPPING_BASIS,
  getShippingMethod,
  type ShippingMethod,
} from "@/lib/shipping"

// Re-exported so existing callers can keep importing shipping bits from here.
export {
  SHIPPING_METHODS,
  DEFAULT_SHIPPING_METHOD_ID,
  FREE_SHIPPING_THRESHOLD,
  getShippingMethod,
}
export type { ShippingMethod }

// Demo coupons. Replace with a server-side lookup (usage limits, expiry) later;
// callers won't change shape. Defined here so client + server validate identically.
export const COUPONS: Record<string, number> = { AGAMA10: 0.1 }

// Slovak standard DPH (VAT) rate, used ONLY when the shop is a registered VAT
// payer (platiteľ DPH). Catalog prices are VAT-INCLUSIVE (gross), so this only
// affects the informational "z toho DPH" breakdown — VAT is BACKED OUT of the
// gross total (vat = total − total/(1+rate)), never added on top.
export const DEFAULT_VAT_RATE = 0.23

// ⚠️ SAFETY DEFAULT: OFF. Showing a DPH line while NOT registered for VAT is not
// a cosmetic error — §69 ods. 5 zákona o DPH: "Každá osoba, ktorá uvedie vo
// faktúre alebo v inom doklade o predaji daň, je povinná zaplatiť túto daň",
// i.e. stating VAT on a sales document creates a real debt to the Financial
// Administration, with no right to deduct input VAT. Having a DIČ does NOT make
// a company a VAT payer — only a §4 registration (which issues an IČ DPH) does.
// Verify status at financnasprava.sk (overovanie IČ DPH) and have an účtovník
// confirm, THEN set NEXT_PUBLIC_IS_VAT_PAYER=true. See SETUP.md → DPH.
export const IS_VAT_PAYER = process.env.NEXT_PUBLIC_IS_VAT_PAYER === "true"

/** Exported for testing: resolves the effective VAT rate from config. */
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
  /** Portion of `total` that is VAT (prices are VAT-inclusive); null when off. */
  vatAmount: number | null
  /** Net amount excluding VAT (total − vatAmount); null when VAT is off. */
  netAmount: number | null
  total: number
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function computeTotals(
  lines: PricedLine[],
  opts: {
    couponCode?: string | null
    shippingMethodId?: string
    /** Override the configured VAT rate (mainly for tests); null disables VAT. */
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
