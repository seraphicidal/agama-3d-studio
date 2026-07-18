import type { CartItem } from "@/lib/types"

// Integration seam for Stripe. No live API key exists yet, so this throws
// instead of pretending to charge a card. Swap the body for a real
// `stripe.checkout.sessions.create(...)` call (server-side) when ready —
// callers below are already shaped for that.

export interface CheckoutSessionInput {
  items: CartItem[]
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSessionResult {
  sessionId: string
  url: string
}

export async function createCheckoutSession(
  _input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  throw new Error(
    "Stripe is not configured yet. Add STRIPE_SECRET_KEY and implement createCheckoutSession()."
  )
}
