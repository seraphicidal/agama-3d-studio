import type { CheckoutSessionInput, CheckoutSessionResult } from "@/lib/stripe/client"

export async function createGopayPayment(
  _input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  throw new Error(
    "GoPay is not configured yet. Add GOPAY_* env vars and implement createGopayPayment()."
  )
}
