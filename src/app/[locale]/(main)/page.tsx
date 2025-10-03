'use client'

import { Gallery } from '@/components/gallery'
import { BaseLayout } from '@/components/layout/base'
import { PER_PAGE_PHOTOS_COUNT_INFINITE } from '@/constants'
import { api } from '@/trpc/react'

export default function EssentialPage() {
  const essentialPhotosQuery =
    api.photo.getEssentialPhotosInfinite.useInfiniteQuery(
      {
        limit: PER_PAGE_PHOTOS_COUNT_INFINITE,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    )

  return (
    <BaseLayout>
      <Gallery queryResult={essentialPhotosQuery} />
    </BaseLayout>
  )
}
