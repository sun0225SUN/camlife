import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewType = 'feed' | 'waterfall' | 'grid'

interface ViewStore {
  view: ViewType
  setView: (view: ViewType) => void
}

export const useView = create<ViewStore>()(
  persist(
    (set) => ({
      view: 'feed',
      setView: (view) => set({ view }),
    }),
    {
      name: 'view-store',
    },
  ),
)
