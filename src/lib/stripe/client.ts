import Stripe from "stripe"
import type { OrderAddress } from "@/lib/orders/types"
import { getProductBySlug } from "@/lib/data/products"
import { SHIPPING_METHODS, getShippingMethod } from "@/lib/shipping"
import { COUPONS, normalizeCoupon, computeTotals } from "@/lib/pricing"

// SERVER-ONLY. Do not import from a Client Component — it pulls in the Stripe
// Node SDK and reads the secret key. The single checkout seam
// (lib/payments/createCheckoutSession) routes here for cards + Apple Pay.

// Minimal, server-authoritative line input: only ids + variant are trusted from
// the client; prices are always resolved from the catalog here.
export interface CheckoutLineInput {
  productId: string
  quantity: number
  material?: string
  color?: string
  size?: string
}

export interface CheckoutSessionInput {
  items: CheckoutLineInput[]
  couponCode?: string | null
  shippingMethodId?: string
  customerEmail?: string
  customerName?: string
  userId?: string | null
  address?: OrderAddress
  successUrl: string
  cancelUrl: string
}

export interface CheckoutSessionResult {
  sessionId: string
  url: string
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

// For the webhook route: signature verification + line-item retrieval. Throws
// cleanly if unconfigured (guard with isStripeConfigured() first).
export function getStripeClient(): Stripe {
  return getStripe()
}

let stripeSingleton: Stripe | null = null

function getStripe(): Stripe {
  if (stripeSingleton) return stripeSingleton
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY (server-only; see .env.example)."
    )
  }
  // Pinned to the installed SDK's API version; a TS error here after an SDK bump
  // is a useful prompt to review the upgrade.
  stripeSingleton = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" })
  return stripeSingleton
}

const eurToCents = (n: number) => Math.round(n * 100)

// Stripe shipping options from the shipping config (max 5). When the cart already
// qualifies for free shipping (our server-authoritative rule), a free option is
// offered up front.
function buildShippingOptions(
  freeEligible: boolean
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = []
  if (freeEligible) {
    options.push({
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 0, currency: "eur" },
        display_name: "Doprava zadarmo",
      },
    })
  }
  for (const m of SHIPPING_METHODS) {
    options.push({
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: eurToCents(m.price), currency: "eur" },
        display_name: m.label,
        ...(m.estimatedDaysMax > 0
          ? {
              delivery_estimate: {
                minimum: { unit: "business_day", value: m.estimatedDaysMin },
                maximum: { unit: "business_day", value: m.estimatedDaysMax },
              },
            }
          : {}),
      },
    })
  }
  return options.slice(0, 5)
}

export async function createCheckoutSession(
  input: CheckoutSessionInput
): Promise<CheckoutSessionResult> {
  const stripe = getStripe()

  // Server-authoritative: every line is priced from the catalog by product id;
  // the client never sets prices. tax_behavior "inclusive" matches our VAT-inclusive
  // catalog prices (Stripe Tax must be enabled + an origin registered — see SETUP.md).
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = input.items.map(
    (item) => {
      const product = getProductBySlug(item.productId)
      if (!product) throw new Error(`Unknown product: ${item.productId}`)
      const variant = [item.material, item.color, item.size].filter(Boolean).join(" · ")
      return {
        quantity: item.quantity,
        price_data: {
          currency: product.price.currency.toLowerCase(),
          unit_amount: eurToCents(product.price.amount),
          tax_behavior: "inclusive",
          product_data: {
            name: product.name,
            description: variant,
            images: product.images.slice(0, 1),
            metadata: { productId: product.id, variant },
          },
        },
      }
    }
  )

  // Free-shipping eligibility comes from our engine (post-discount rule).
  const totals = computeTotals(
    input.items.map((i) => {
      const p = getProductBySlug(i.productId)
      return { unitPrice: p?.price.amount ?? 0, quantity: i.quantity }
    }),
    { couponCode: input.couponCode, shippingMethodId: input.shippingMethodId }
  )

  const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = []
  const coupon = normalizeCoupon(input.couponCode)
  if (coupon) {
    const created = await stripe.coupons.create({
      percent_off: COUPONS[coupon] * 100,
      duration: "once",
      name: coupon,
    })
    discounts.push({ coupon: created.id })
  }

  const metadata: Record<string, string> = {
    couponCode: coupon ?? "",
    shippingMethodId: input.shippingMethodId ?? getShippingMethod(undefined).id,
    customerName: input.customerName ?? "",
    address: input.address ? JSON.stringify(input.address) : "",
    userId: input.userId ?? "",
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    ...(discounts.length ? { discounts } : {}),
    automatic_tax: { enabled: true },
    shipping_options: buildShippingOptions(totals.freeShipping),
    shipping_address_collection: { allowed_countries: ["SK", "CZ"] },
    billing_address_collection: "required",
    ...(input.customerEmail ? { customer_email: input.customerEmail } : {}),
    metadata,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
  })

  return { sessionId: session.id, url: session.url ?? "" }
}
