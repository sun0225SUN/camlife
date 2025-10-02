'use client'

import { Gallery } from '@/components/gallery/photo'
import { api } from '@/trpc/react'

export function FarawayPhotos() {
  const [photosData] = api.photo.getFarawayPhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
