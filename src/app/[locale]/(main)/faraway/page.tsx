import { Suspense } from 'react'
import { Fallback } from '@/components/common/fallback'
import { BaseLayout } from '@/components/layout/base'
import { FarawayPhotos } from '@/components/photos/faraway'
import { api, HydrateClient } from '@/trpc/server'

export default async function FarawayPage() {
  void api.photo.getFarawayPhotosList.prefetch()

  return (
    <HydrateClient>
      <BaseLayout>
        <Suspense fallback={<Fallback />}>
          <FarawayPhotos />
        </Suspense>
      </BaseLayout>
    </HydrateClient>
  )
}
