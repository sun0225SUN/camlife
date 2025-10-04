'use client'

import { Gallery } from '@/components/gallery'
import { BaseLayout } from '@/components/layout/base'
import { useAppSettings } from '@/hooks/use-settings'
import { api } from '@/trpc/react'

export default function EssentialPage() {
  const { perPagePhotosCountInfinite } = useAppSettings()

  const essentialPhotosQuery =
    api.photo.getEssentialPhotosInfinite.useInfiniteQuery(
      {
        limit: perPagePhotosCountInfinite,
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
