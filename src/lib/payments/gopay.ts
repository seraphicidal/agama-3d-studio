import type { CheckoutSessionInput, CheckoutSessionResult } from "@/lib/stripe/client"

// GoPay integration seam (popular Slovak/Czech gateway). Wire with
// GOPAY_GOID / GOPAY_CLIENT_ID / GOPAY_CLIENT_SECRET and implement the
// standard payment flow: OAuth token -> create payment -> redirect to gw_url.
export async function createGopayPayment(
  _input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  throw new Error(
    "GoPay is not configured yet. Add GOPAY_* env vars and implement createGopayPayment()."
  )
}
