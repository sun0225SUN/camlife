'use client'

import { Gallery } from '@/components/gallery'
import { api } from '@/trpc/react'

export function RecentPhotos() {
  const [photosData] = api.photo.getPhotosList.useSuspenseQuery()

  return <Gallery photosData={photosData.data} />
}
