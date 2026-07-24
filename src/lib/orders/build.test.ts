import { describe, it, expect } from "vitest"
import { buildOrder, type BuildOrderInput } from "./build"
import { renderOrderConfirmation } from "@/lib/email/templates/order-confirmation"

const baseInput: BuildOrderInput = {
  number: "AGM-10501",
  userId: null,
  customerEmail: "test@example.sk",
  customerName: "Ján Novák",
  address: {
    fullName: "Ján Novák",
    street: "Hlavná 1",
    city: "Bratislava",
    postalCode: "81101",
    country: "Slovensko",
  },
  shippingMethodId: "courier",
  paymentProvider: "stripe",
  paymentReference: "cs_test_123",
  lines: [
    { productId: "dragon-bust", name: "Dragon Bust", variant: "RESIN · Bronzová · M", unitPrice: 89, quantity: 1 },
    { productId: "baby-dragon", name: "Baby Dragon", variant: "PLA · Modrá · S", unitPrice: 24, quantity: 2 },
  ],
}

describe("buildOrder", () => {
  it("computes server-authoritative totals with per-line VAT", () => {
    const o = buildOrder(baseInput)
    expect(o.subtotal).toBe(137) // 89 + 24*2
    expect(o.shipping).toBe(0) // >= 60 → free
    expect(o.total).toBe(137)
    expect(o.vatRate).toBe(0.23)
    expect(o.items[1].lineTotal).toBe(48)
    // per-line VAT (backed out) sums to the order VAT
    const lineVatSum = o.items.reduce((s, i) => s + (i.vatAmount ?? 0), 0)
    expect(lineVatSum).toBeCloseTo(o.vatAmount ?? 0, 1)
    expect(o.status).toBe("processing")
    expect(o.userId).toBeNull() // guest order supported
    expect(o.paymentReference).toBe("cs_test_123")
  })

  it("applies a coupon and charges shipping when post-discount < threshold", () => {
    const o = buildOrder({
      ...baseInput,
      couponCode: "AGAMA10",
      lines: [{ productId: "skull-lamp", name: "Skull Lamp", variant: "PLA · Čierna · M", unitPrice: 42, quantity: 1 }],
    })
    expect(o.discountCode).toBe("AGAMA10")
    expect(o.discountAmount).toBe(4.2)
    expect(o.shipping).toBe(4.9) // 42 − 4.2 = 37.8 < 60
  })
})

describe("renderOrderConfirmation", () => {
  it("produces a SK email with order number, VAT breakdown and total", () => {
    const email = renderOrderConfirmation(buildOrder(baseInput))
    expect(email.subject).toContain("AGM-10501")
    expect(email.text).toContain("z toho DPH (23 %)")
    expect(email.text).toContain("Spolu")
    expect(email.html).toContain("Dragon Bust")
  })
})
