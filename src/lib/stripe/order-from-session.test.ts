import { describe, it, expect } from "vitest"
import {
  buildOrderInputFromSession,
  type SessionLike,
  type SessionLineItemLike,
} from "./order-from-session"
import { buildOrder } from "@/lib/orders/build"

// Simulates a completed Stripe Checkout Session for a guest, paid with a coupon.
const session: SessionLike = {
  customerEmail: "guest@example.sk",
  paymentReference: "pi_test_abc",
  metadata: {
    couponCode: "AGAMA10",
    shippingMethodId: "courier",
    customerName: "Ján Novák",
    address: JSON.stringify({
      fullName: "Ján Novák",
      street: "Hlavná 1",
      city: "Bratislava",
      postalCode: "81101",
      country: "Slovensko",
    }),
    userId: "",
  },
}

const lineItems: SessionLineItemLike[] = [
  { description: "Skull Lamp", quantity: 1, unitAmount: 4200, productId: "skull-lamp", variant: "PLA · Čierna · M" },
]

describe("buildOrderInputFromSession → buildOrder", () => {
  it("rebuilds a server-authoritative order (coupon + shipping recomputed)", () => {
    const input = buildOrderInputFromSession(session, lineItems, { number: "AGM-TEST1" })
    expect(input.userId).toBeNull() // guest
    expect(input.customerEmail).toBe("guest@example.sk")
    expect(input.address.city).toBe("Bratislava")

    const order = buildOrder(input)
    expect(order.number).toBe("AGM-TEST1")
    expect(order.items[0].unitPrice).toBe(42) // cents → EUR
    expect(order.discountCode).toBe("AGAMA10")
    expect(order.discountAmount).toBe(4.2)
    expect(order.shipping).toBe(4.9) // 42 − 4.2 = 37.8 < 60 → charged
    expect(order.total).toBe(42.7) // 42 − 4.2 + 4.9, rounded to cents
    expect(order.vatRate).toBe(0.23)
    expect(order.paymentReference).toBe("pi_test_abc")
  })

  it("defaults gracefully when metadata is missing", () => {
    const input = buildOrderInputFromSession(
      { customerEmail: null, paymentReference: "cs_1", metadata: null },
      [{ description: null, quantity: null, unitAmount: null, productId: null, variant: null }],
      { number: "AGM-TEST2" }
    )
    expect(input.shippingMethodId).toBe("courier")
    expect(input.couponCode).toBeNull()
    expect(input.customerEmail).toBe("")
    expect(input.lines[0].quantity).toBe(1)
  })
})
