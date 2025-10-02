import { Suspense } from 'react'
import { Fallback } from '@/components/common/fallback'
import { BaseLayout } from '@/components/layout/base'
import { ShufflePhotos } from '@/components/photos/shuffle'
import { api, HydrateClient } from '@/trpc/server'

export default async function ShufflePage() {
  void api.photo.getShuffledPhotosList.prefetch()

  return (
    <HydrateClient>
      <BaseLayout>
        <Suspense fallback={<Fallback />}>
          <ShufflePhotos />
        </Suspense>
      </BaseLayout>
    </HydrateClient>
  )
}
