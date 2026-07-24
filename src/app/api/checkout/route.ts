import { NextResponse } from "next/server"
import { z } from "zod"
import { isStripeConfigured } from "@/lib/stripe/client"
import { createCheckoutSession } from "@/lib/payments"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getUser } from "@/lib/supabase/server"
import { getProductBySlug } from "@/lib/data/products"
import { SITE_URL } from "@/lib/site"

export const runtime = "nodejs"

const addressSchema = z.object({
  fullName: z.string().trim().min(1),
  street: z.string().trim().min(1),
  city: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(1),
  phone: z.string().trim().optional(),
})

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().positive().max(999),
        material: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .min(1)
    .max(100),
  couponCode: z.string().trim().max(40).optional(),
  shippingMethodId: z.string().trim().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().trim().max(120).optional(),
  address: addressSchema.optional(),
})

// Creates a Stripe Checkout Session from the cart. Server-authoritative: the
// Stripe layer re-prices every line from the catalog by product id.
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 }
    )
  }

  const { items, couponCode, shippingMethodId, customerEmail, customerName, address } = parsed.data

  // Validate ids + stock server-side before taking a payment.
  for (const item of items) {
    const product = getProductBySlug(item.productId)
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: `Out of stock: ${item.productId}` }, { status: 409 })
    }
  }

  // Attach the authenticated user when available; otherwise it's a guest order.
  let userId: string | null = null
  if (isSupabaseConfigured()) {
    try {
      userId = (await getUser())?.id ?? null
    } catch {
      userId = null
    }
  }

  const result = await createCheckoutSession("stripe", {
    items,
    couponCode,
    shippingMethodId,
    customerEmail,
    customerName,
    userId,
    address,
    successUrl: `${SITE_URL}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${SITE_URL}/checkout?canceled=1`,
  })

  return NextResponse.json({ url: result.url })
}
