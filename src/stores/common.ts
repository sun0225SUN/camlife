import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CommonState {
  firstPhotoUploaded: boolean
  setFirstPhotoUploaded: (firstPhotoUploaded: boolean) => void
}

export const useCommonStore = create<CommonState>()(
  persist(
    (set) => ({
      firstPhotoUploaded: false,
      setFirstPhotoUploaded: (firstPhotoUploaded) =>
        set({ firstPhotoUploaded }),
    }),
    {
      name: 'common-store',
    },
  ),
)
