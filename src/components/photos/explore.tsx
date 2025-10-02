'use client'

import { Gallery } from '@/components/gallery'
import { api } from '@/trpc/react'

export function ExplorePhotos() {
  const [photosData] = api.photo.getExplorePhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
