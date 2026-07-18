import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Address } from "@/lib/types"

interface AccountUser {
  name: string
  email: string
}

interface AccountState {
  user: AccountUser | null
  addresses: Address[]
  login: (email: string, name?: string) => void
  logout: () => void
  addAddress: (address: Address) => void
  removeAddress: (id: string) => void
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      login: (email, name) =>
        set({ user: { email, name: name ?? email.split("@")[0] } }),
      logout: () => set({ user: null }),
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
    }),
    { name: "agama-account" }
  )
)
