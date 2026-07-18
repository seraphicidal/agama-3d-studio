import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SearchState {
  recent: string[]
  addRecent: (query: string) => void
  clearRecent: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recent: [],
      addRecent: (query) => {
        const trimmed = query.trim()
        if (!trimmed) return
        const next = [trimmed, ...get().recent.filter((q) => q !== trimmed)].slice(
          0,
          6
        )
        set({ recent: next })
      },
      clearRecent: () => set({ recent: [] }),
    }),
    { name: "agama-search" }
  )
)
