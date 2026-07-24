import type { OrderRecord } from "./types"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

// Persists placed orders via the service-role client (bypasses RLS). SERVER-ONLY.
// Throws cleanly (via the admin client) when Supabase isn't configured.

const cents = (n: number) => Math.round(n * 100)

export async function saveOrder(order: OrderRecord): Promise<void> {
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from("orders")
    .insert({
      number: order.number,
      user_id: order.userId,
      email: order.customerEmail,
      customer_name: order.customerName,
      status: order.status,
      currency: order.currency,
      subtotal_cents: cents(order.subtotal),
      discount_code: order.discountCode,
      discount_cents: cents(order.discountAmount),
      shipping_cents: cents(order.shipping),
      shipping_method: order.shippingMethodId,
      vat_rate: order.vatRate,
      vat_cents: order.vatAmount != null ? cents(order.vatAmount) : null,
      net_cents: order.netAmount != null ? cents(order.netAmount) : null,
      total_cents: cents(order.total),
      address: order.shippingAddress,
      payment_provider: order.paymentProvider,
      payment_reference: order.paymentReference,
    })
    .select("id")
    .single()

  if (error) throw new Error(`Failed to save order: ${error.message}`)

  const items = order.items.map((i) => ({
    order_id: data.id as string,
    product_id: i.productId,
    name: i.name,
    variant: i.variant,
    price_cents: cents(i.unitPrice),
    quantity: i.quantity,
    line_total_cents: cents(i.lineTotal),
    vat_rate: i.vatRate,
    vat_cents: i.vatAmount != null ? cents(i.vatAmount) : null,
    net_cents: i.netAmount != null ? cents(i.netAmount) : null,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(items)
  if (itemsError) throw new Error(`Failed to save order items: ${itemsError.message}`)
}

// Webhook idempotency: Stripe may deliver the same event more than once.
export async function orderExistsByPaymentReference(reference: string): Promise<boolean> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("payment_reference", reference)
    .maybeSingle()
  return Boolean(data)
}
