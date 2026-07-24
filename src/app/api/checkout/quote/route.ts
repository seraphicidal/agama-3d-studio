import { NextResponse } from "next/server"
import { z } from "zod"
import { getProductBySlug } from "@/lib/data/products"
import { computeTotals, type PricedLine } from "@/lib/pricing"

// Server-authoritative order quote. The client sends only product ids + quantities
// (plus optional coupon / shipping choice) — prices come from the catalog here, so
// a tampered client cart can never change what is charged. This is the seam order
// creation and the Stripe session will call.
const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().positive().max(999),
      })
    )
    .min(1)
    .max(100),
  couponCode: z.string().trim().max(40).optional(),
  shippingMethodId: z.string().trim().optional(),
})

export async function POST(request: Request) {
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
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    )
  }

  const { items, couponCode, shippingMethodId } = parsed.data

  const lines: PricedLine[] = []
  for (const item of items) {
    const product = getProductBySlug(item.productId)
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${item.productId}` },
        { status: 400 }
      )
    }
    if (!product.inStock) {
      return NextResponse.json(
        { error: `Out of stock: ${item.productId}` },
        { status: 409 }
      )
    }
    lines.push({ unitPrice: product.price.amount, quantity: item.quantity })
  }

  const totals = computeTotals(lines, { couponCode, shippingMethodId })
  return NextResponse.json(totals)
}
