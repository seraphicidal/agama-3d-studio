import type { OrderStatus } from "@/lib/types"

export const orderStatusLabels: Record<OrderStatus, string> = {
  processing: "Spracováva sa",
  printing: "Tlačí sa",
  shipped: "Odoslané",
  delivered: "Doručené",
  cancelled: "Zrušené",
}
