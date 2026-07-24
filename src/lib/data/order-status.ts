import type { OrderStatus } from "@/lib/types"

// Pure status→label map. Kept separate from ./orders (whose mock orders import
// the product catalog) so client components can show status labels without
// pulling the catalog into their bundle.
export const orderStatusLabels: Record<OrderStatus, string> = {
  processing: "Spracováva sa",
  printing: "Tlačí sa",
  shipped: "Odoslané",
  delivered: "Doručené",
  cancelled: "Zrušené",
}
