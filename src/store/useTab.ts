import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface TabStore {
  tab: string
  setTab: (tab: string) => void
}

export const useTab = create<TabStore>()(
  persist(
    (set) => ({
      tab: "essential",
      setTab: (tab) => set({ tab }),
    }),
    {
      name: "tab-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
