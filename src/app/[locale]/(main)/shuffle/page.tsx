'use client'

import { Gallery } from '@/components/gallery'
import { BaseLayout } from '@/components/layout/base'
import { SHUFFLE_PHOTOS_COUNT } from '@/constants'
import { api } from '@/trpc/react'

export default function ShufflePage() {
  const shufflePhotosQuery =
    api.photo.getShuffledPhotosInfinite.useInfiniteQuery(
      {
        limit: SHUFFLE_PHOTOS_COUNT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    )

  return (
    <BaseLayout>
      <Gallery
        queryResult={shufflePhotosQuery}
        inFinite
      />
    </BaseLayout>
  )
}
