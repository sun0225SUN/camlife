'use client'

import { Gallery } from '@/components/gallery/photo'
import { api } from '@/trpc/react'

export function EssentialPhotos() {
  const [photosData] = api.photo.getEssentialPhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
