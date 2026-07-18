import {
  createCheckoutSession as createStripeSession,
  type CheckoutSessionInput,
  type CheckoutSessionResult,
} from "@/lib/stripe/client"
import { createGopayPayment } from "@/lib/payments/gopay"

export type { CheckoutSessionInput, CheckoutSessionResult }

// Apple Pay and card payments both ride on Stripe; GoPay covers local
// bank buttons popular in SK/CZ. The checkout UI calls this single seam.
export type PaymentProvider = "stripe" | "gopay"

export async function createCheckoutSession(
  provider: PaymentProvider,
  input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  switch (provider) {
    case "gopay":
      return createGopayPayment(input)
    default:
      return createStripeSession(input)
  }
}
