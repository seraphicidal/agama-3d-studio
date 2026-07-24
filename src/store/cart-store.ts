import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/lib/types"
import { normalizeCoupon } from "@/lib/pricing"

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
        const normalized = normalizeCoupon(code)
        if (!normalized) return false
        set({ couponCode: normalized })
        return true
      },
      removeCoupon: () => set({ couponCode: null }),
      clear: () => set({ items: [], couponCode: null }),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "agama-cart" }
  )
)
