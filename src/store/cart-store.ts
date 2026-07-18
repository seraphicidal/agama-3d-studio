import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/lib/types"

// Demo coupon codes → discount rate. Replace with a server-side lookup once a
// real backend exists; the store API below won't need to change shape.
export const COUPONS: Record<string, number> = {
  AGAMA10: 0.1,
}

interface CartState {
  items: CartItem[]
  couponCode: string | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  /** Validates against known codes; returns whether the code was accepted. */
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  clear: () => void
  subtotal: () => number
  discountRate: () => number
  discountAmount: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase()
        if (!(normalized in COUPONS)) return false
        set({ couponCode: normalized })
        return true
      },
      removeCoupon: () => set({ couponCode: null }),
      clear: () => set({ items: [], couponCode: null }),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price.amount * i.quantity, 0),
      discountRate: () => {
        const code = get().couponCode
        return code ? (COUPONS[code] ?? 0) : 0
      },
      discountAmount: () =>
        Math.round(get().subtotal() * get().discountRate() * 100) / 100,
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "agama-cart" }
  )
)
