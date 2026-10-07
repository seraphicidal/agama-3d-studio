import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Address } from "@/lib/types"

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
