import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type ViewType } from "~/types/view"

interface ViewStore {
  view: ViewType
  setView: (view: ViewType) => void
}

export const useView = create<ViewStore>()(
  persist(
    (set) => ({
      view: "feed",
      setView: (view) => set({ view }),
    }),
    {
      name: "view-store",
      getStorage: () => sessionStorage,
    },
  ),
)
