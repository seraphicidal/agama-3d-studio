import type { BuildOrderInput } from "@/lib/orders/build"
import type { OrderAddress } from "@/lib/orders/types"

// Deliberately decoupled from Stripe's SDK types so it can be unit-tested with a
// plain mock. The webhook route adapts the real Stripe Session + line items into
// these shapes.

export interface SessionLineItemLike {
  description: string | null
  quantity: number | null
  /** Unit amount in cents (VAT-inclusive catalog price we set at checkout). */
  unitAmount: number | null
  productId: string | null
  variant: string | null
}

export interface SessionLike {
  metadata: Record<string, string> | null | undefined
  customerEmail: string | null | undefined
  /** payment_intent id (preferred) or session id. */
  paymentReference: string
}

function parseAddress(raw: string | undefined): OrderAddress {
  if (raw) {
    try {
      const a = JSON.parse(raw) as Partial<OrderAddress>
      return {
        fullName: String(a.fullName ?? ""),
        street: String(a.street ?? ""),
        city: String(a.city ?? ""),
        postalCode: String(a.postalCode ?? ""),
        country: String(a.country ?? "Slovensko"),
        phone: a.phone ? String(a.phone) : undefined,
      }
    } catch {
      // fall through to empty address
    }
  }
  return { fullName: "", street: "", city: "", postalCode: "", country: "Slovensko" }
}

// Rebuilds order input from a completed Stripe session. Prices come from the line
// items we set server-side; discount + shipping method come from our metadata, so
// buildOrder recomputes totals with the shared (tested) pricing formula.
export function buildOrderInputFromSession(
  session: SessionLike,
  lineItems: SessionLineItemLike[],
  opts: { number: string }
): BuildOrderInput {
  const meta = session.metadata ?? {}
  const lines = lineItems.map((li) => ({
    productId: li.productId ?? "",
    name: li.description ?? li.productId ?? "Položka",
    variant: li.variant ?? "",
    unitPrice: (li.unitAmount ?? 0) / 100,
    quantity: li.quantity ?? 1,
  }))

  return {
    number: opts.number,
    userId: meta.userId ? meta.userId : null,
    customerEmail: session.customerEmail ?? "",
    customerName: meta.customerName ?? "",
    address: parseAddress(meta.address),
    shippingMethodId: meta.shippingMethodId || "courier",
    couponCode: meta.couponCode || null,
    paymentProvider: "stripe",
    paymentReference: session.paymentReference,
    lines,
  }
}
