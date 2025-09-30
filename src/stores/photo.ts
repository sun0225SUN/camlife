import { create } from 'zustand'
import type { PhotoInfo, PhotoInfoDialogTriggerType } from '@/types'

interface PhotoState {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void

  triggerType: PhotoInfoDialogTriggerType
  setTriggerType: (triggerType: PhotoInfoDialogTriggerType) => void

  photoInfo: PhotoInfo | null
  setPhotoInfo: (photoInfo: PhotoInfo) => void
}

export const usePhotoStore = create<PhotoState>()((set) => ({
  dialogOpen: false,
  setDialogOpen: (open) => set({ dialogOpen: open }),

  triggerType: null,
  setTriggerType: (triggerType) => set({ triggerType }),

  photoInfo: null,
  setPhotoInfo: (photoInfo) => set({ photoInfo }),
}))
