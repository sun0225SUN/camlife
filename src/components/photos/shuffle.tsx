'use client'

import { Gallery } from '@/components/gallery'
import { api } from '@/trpc/react'

export function ShufflePhotos() {
  const [photosData] = api.photo.getShuffledPhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
