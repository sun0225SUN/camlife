'use client'

import { Gallery } from '@/components/gallery/photo'
import { api } from '@/trpc/react'

export function RecentPhotos() {
  const [photosData] = api.photo.getPhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
