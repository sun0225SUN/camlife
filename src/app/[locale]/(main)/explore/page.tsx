import { Suspense } from 'react'
import { Fallback } from '@/components/common/fallback'
import { BaseLayout } from '@/components/layout/base'
import { ExplorePhotos } from '@/components/photos/explore'
import { api, HydrateClient } from '@/trpc/server'

export default async function ExplorePage() {
  void api.photo.getExplorePhotosList.prefetch()

  return (
    <HydrateClient>
      <BaseLayout>
        <Suspense fallback={<Fallback />}>
          <ExplorePhotos />
        </Suspense>
      </BaseLayout>
    </HydrateClient>
  )
}
