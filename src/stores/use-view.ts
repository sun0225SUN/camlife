import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewType = 'feed' | 'waterfall' | 'grid'

interface ViewStore {
  layout: ViewType
  setLayout: (layout: ViewType) => void
}

export const useView = create<ViewStore>()(
  persist(
    (set) => ({
      layout: 'feed',
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: 'view-store',
    },
  ),
)
