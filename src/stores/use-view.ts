import { create } from 'zustand'

type ViewType = 'feed' | 'waterfall' | 'grid'

interface ViewStore {
  layout: ViewType
  setLayout: (layout: ViewType) => void
}

export const useView = create<ViewStore>()((set) => ({
  layout: 'feed',
  setLayout: (layout) => set({ layout }),
}))
