import type { Order } from "@/lib/types"
import { products } from "./products"

function item(productId: string, quantity: number) {
  const p = products.find((x) => x.id === productId)!
  return {
    id: `${productId}-item`,
    productId: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0],
    price: p.price,
    quantity,
    material: p.variants.materials[0].toUpperCase(),
    color: p.variants.colors[0].name,
    size: p.variants.sizes[0],
  }
}

export const mockOrders: Order[] = [
  {
    id: "o1",
    number: "AGM-10482",
    date: "2026-07-02",
    status: "delivered",
    total: { amount: 89, currency: "EUR" },
    items: [item("dragon-bust", 1)],
  },
  {
    id: "o2",
    number: "AGM-10465",
    date: "2026-06-18",
    status: "shipped",
    total: { amount: 37, currency: "EUR" },
    items: [item("baby-dragon", 1), item("keychain-pack-icons", 1)],
  },
  {
    id: "o3",
    number: "AGM-10421",
    date: "2026-05-27",
    status: "printing",
    total: { amount: 42, currency: "EUR" },
    items: [item("skull-lamp", 1)],
  },
  {
    id: "o4",
    number: "AGM-10388",
    date: "2026-04-30",
    status: "cancelled",
    total: { amount: 22, currency: "EUR" },
    items: [item("desk-organizer-set", 1)],
  },
]

// Status labels moved to ./order-status (pure) so client components importing
// them don't pull this products-dependent module into their bundle.
