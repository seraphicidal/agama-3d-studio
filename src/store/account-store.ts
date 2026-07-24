import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Address } from "@/lib/types"

// Saved delivery addresses (a convenience feature, kept client-side). The auth
// user itself now comes from Supabase (server) — the old localStorage login was
// retired. Move addresses to a Supabase `addresses` table when convenient.
interface AddressState {
  addresses: Address[]
  addAddress: (address: Address) => void
  removeAddress: (id: string) => void
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
    }),
    { name: "agama-account" }
  )
)
