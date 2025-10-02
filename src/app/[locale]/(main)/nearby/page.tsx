import { Suspense } from 'react'
import { Fallback } from '@/components/common/fallback'
import { BaseLayout } from '@/components/layout/base'
import { NearbyPhotos } from '@/components/photos/nearby'
import { api, HydrateClient } from '@/trpc/server'

export default async function NearbyPage() {
  void api.photo.getNearbyPhotosList.prefetch()

  return (
    <HydrateClient>
      <BaseLayout>
        <Suspense fallback={<Fallback />}>
          <NearbyPhotos />
        </Suspense>
      </BaseLayout>
    </HydrateClient>
  )
}
