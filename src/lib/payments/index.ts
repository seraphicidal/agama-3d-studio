import {
  createCheckoutSession as createStripeSession,
  type CheckoutSessionInput,
  type CheckoutSessionResult,
} from "@/lib/stripe/client"
import { createGopayPayment } from "@/lib/payments/gopay"

export type { CheckoutSessionInput, CheckoutSessionResult }

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
