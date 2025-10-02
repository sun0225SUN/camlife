import { Suspense } from 'react'
import { Fallback } from '@/components/common/fallback'
import { BaseLayout } from '@/components/layout/base'
import { RecentPhotos } from '@/components/photos/recent'
import { api, HydrateClient } from '@/trpc/server'

export default async function RecentPage() {
  void api.photo.getPhotosList.prefetch()

  return (
    <HydrateClient>
      <BaseLayout>
        <Suspense fallback={<Fallback />}>
          <RecentPhotos />
        </Suspense>
      </BaseLayout>
    </HydrateClient>
  )
}
