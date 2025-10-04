'use client'

import { Gallery } from '@/components/gallery'
import { BaseLayout } from '@/components/layout/base'
import { useAppSettings } from '@/hooks/use-settings'
import { api } from '@/trpc/react'

export default function RecentPage() {
  const { perPagePhotosCountInfinite } = useAppSettings()

  const recentPhotosQuery = api.photo.getRecentPhotosInfinite.useInfiniteQuery(
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
      <Gallery queryResult={recentPhotosQuery} />
    </BaseLayout>
  )
}
