import type { Money } from "@/lib/types"

export function formatPrice(money: Money) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: money.currency,
    maximumFractionDigits: money.amount % 1 === 0 ? 0 : 2,
  }).format(money.amount)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}
