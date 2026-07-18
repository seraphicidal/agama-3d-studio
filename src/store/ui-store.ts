import { create } from "zustand"

interface UIState {
  cartOpen: boolean
  searchOpen: boolean
  mobileNavOpen: boolean
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileNavOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}))
