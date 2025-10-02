'use client'

import { Gallery } from '@/components/gallery'
import { api } from '@/trpc/react'

export function NearbyPhotos() {
  const [photosData] = api.photo.getNearbyPhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
