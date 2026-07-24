import { describe, it, expect } from "vitest"
import { computeTotals, normalizeCoupon, DEFAULT_VAT_RATE } from "./index"

const line = (unitPrice: number, quantity = 1) => ({ unitPrice, quantity })

describe("normalizeCoupon", () => {
  it("accepts a known code case/space-insensitively", () => {
    expect(normalizeCoupon("  agama10 ")).toBe("AGAMA10")
  })
  it("rejects unknown codes", () => {
    expect(normalizeCoupon("NOPE")).toBeNull()
    expect(normalizeCoupon("")).toBeNull()
    expect(normalizeCoupon(null)).toBeNull()
  })
})

describe("computeTotals — subtotal & discount", () => {
  it("sums line items", () => {
    expect(computeTotals([line(89, 2), line(19)]).subtotal).toBe(197)
  })
  it("applies a valid coupon", () => {
    const t = computeTotals([line(100)], { couponCode: "AGAMA10", vatRate: null })
    expect(t.discountRate).toBe(0.1)
    expect(t.discountAmount).toBe(10)
  })
  it("ignores an unknown coupon", () => {
    const t = computeTotals([line(100)], { couponCode: "NOPE" })
    expect(t.couponCode).toBeNull()
    expect(t.discountAmount).toBe(0)
  })
})

describe("computeTotals — shipping", () => {
  it("charges the method rate below the free threshold", () => {
    const t = computeTotals([line(9)], { shippingMethodId: "courier", vatRate: null })
    expect(t.freeShipping).toBe(false)
    expect(t.shipping).toBe(4.9)
    expect(t.total).toBe(13.9)
  })
  it("is free at/above the threshold", () => {
    const t = computeTotals([line(60)], { shippingMethodId: "courier", vatRate: null })
    expect(t.freeShipping).toBe(true)
    expect(t.shipping).toBe(0)
  })
  it("free-shipping threshold is POST-discount (audit fix)", () => {
    // 64 pre-discount is >= 60, but AGAMA10 drops it to 57.6 (< 60) → charged.
    const t = computeTotals([line(42), line(22)], {
      couponCode: "AGAMA10",
      shippingMethodId: "courier",
      vatRate: null,
    })
    expect(t.subtotal).toBe(64)
    expect(t.discountAmount).toBe(6.4)
    expect(t.freeShipping).toBe(false)
    expect(t.shipping).toBe(4.9)
  })
  it("pickup is always free", () => {
    expect(computeTotals([line(9)], { shippingMethodId: "pickup" }).shipping).toBe(0)
  })
  it("falls back to the default method for an unknown id", () => {
    const t = computeTotals([line(9)], { shippingMethodId: "does-not-exist", vatRate: null })
    expect(t.shippingMethodId).toBe("courier")
  })
})

describe("computeTotals — VAT (inclusive, backed out)", () => {
  it("backs VAT out of the gross total and does NOT change the price", () => {
    const t = computeTotals([line(89)], { shippingMethodId: "pickup", vatRate: 0.23 })
    expect(t.total).toBe(89) // price unchanged — VAT is not added on top
    expect(t.vatRate).toBe(0.23)
    expect(t.vatAmount).toBeCloseTo(16.64, 2) // 89 − 89/1.23
    expect(t.netAmount).toBeCloseTo(72.36, 2) // 89/1.23
    expect((t.netAmount ?? 0) + (t.vatAmount ?? 0)).toBeCloseTo(89, 2)
  })
  it("defaults to 23% and leaves the total unchanged", () => {
    const withVat = computeTotals([line(100)], { shippingMethodId: "pickup" })
    const noVat = computeTotals([line(100)], { shippingMethodId: "pickup", vatRate: null })
    expect(DEFAULT_VAT_RATE).toBe(0.23)
    expect(withVat.vatRate).toBe(0.23)
    expect(withVat.total).toBe(noVat.total) // 100 either way
    expect(noVat.vatAmount).toBeNull()
  })
  it("VAT applies to the shipping-inclusive total", () => {
    const t = computeTotals([line(9)], { shippingMethodId: "courier", vatRate: 0.23 })
    expect(t.total).toBe(13.9)
    expect(t.vatAmount).toBeCloseTo(13.9 - 13.9 / 1.23, 2)
  })
})
