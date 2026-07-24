import type { Order, CartItem } from "@/lib/types"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getProductBySlug } from "@/lib/data/products"

// User-scoped order reads (RLS lets a user see only their own). Distinct from
// repository.ts, which does privileged writes via the service role.

interface OrderItemRow {
  product_id: string | null
  name: string
  variant: string
  price_cents: number
  quantity: number
}

interface OrderRow {
  id: string
  number: string
  created_at: string
  status: Order["status"]
  total_cents: number
  currency: string
  order_items: OrderItemRow[] | null
}

function toCartItem(row: OrderItemRow, index: number): CartItem {
  const [material = "", color = "", size = ""] = row.variant.split(" · ")
  const product = row.product_id ? getProductBySlug(row.product_id) : undefined
  return {
    id: `${row.product_id ?? "item"}-${index}`,
    productId: row.product_id ?? "",
    name: row.name,
    slug: row.product_id ?? "",
    image: product?.images[0] ?? "",
    price: { amount: row.price_cents / 100, currency: "EUR" },
    quantity: row.quantity,
    material,
    color,
    size,
  }
}

export async function listUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, number, created_at, status, total_cents, currency, order_items(product_id, name, variant, price_cents, quantity)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error || !data) return []

  return (data as unknown as OrderRow[]).map((o) => ({
    id: o.id,
    number: o.number,
    date: o.created_at,
    status: o.status,
    total: { amount: o.total_cents / 100, currency: "EUR" as const },
    items: (o.order_items ?? []).map(toCartItem),
  }))
}
