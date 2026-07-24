import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { isStripeConfigured, getStripeClient } from "@/lib/stripe/client"
import { buildOrderInputFromSession } from "@/lib/stripe/order-from-session"
import { buildOrder, generateOrderNumber } from "@/lib/orders/build"
import { saveOrder, orderExistsByPaymentReference } from "@/lib/orders/repository"
import { renderOrderConfirmation } from "@/lib/email/templates/order-confirmation"
import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"

// Stripe webhook: on payment success, records the order (server-authoritative)
// and sends the confirmation email. Signature-verified + idempotent.
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!isStripeConfigured() || !webhookSecret) {
    return NextResponse.json({ error: "Webhooks are not configured yet." }, { status: 503 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const stripe = getStripeClient()
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json(
      { error: `Invalid signature: ${(err as Error).message}` },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const paymentReference =
      typeof session.payment_intent === "string" ? session.payment_intent : session.id

    // Idempotency: Stripe may deliver an event more than once.
    if (!(await orderExistsByPaymentReference(paymentReference))) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      })

      const lines = lineItems.data.map((li) => {
        const rawProduct = li.price?.product
        const product =
          rawProduct && typeof rawProduct === "object" ? (rawProduct as Stripe.Product) : null
        return {
          description: li.description,
          quantity: li.quantity,
          unitAmount: li.price?.unit_amount ?? null,
          productId: product?.metadata?.productId ?? null,
          variant: product?.metadata?.variant ?? null,
        }
      })

      const input = buildOrderInputFromSession(
        {
          metadata: session.metadata,
          customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
          paymentReference,
        },
        lines,
        { number: generateOrderNumber() }
      )

      const order = buildOrder(input)
      await saveOrder(order)

      // Don't fail the webhook on email errors — that would trigger Stripe
      // retries and duplicate order attempts. Log and continue.
      try {
        if (order.customerEmail) {
          await sendEmail({ to: order.customerEmail, ...renderOrderConfirmation(order) })
        }
      } catch (err) {
        console.error("Order confirmation email failed:", err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
