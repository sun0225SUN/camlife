import { Suspense } from 'react'
import { Fallback } from '@/components/common/fallback'
import { BaseLayout } from '@/components/layout/base'
import { EssentialPhotos } from '@/components/photos/essential'
import { api, HydrateClient } from '@/trpc/server'

export default async function HomePage() {
  void (await api.photo.getEssentialPhotosList.prefetch())

  return (
    <HydrateClient>
      <BaseLayout>
        <Suspense fallback={<Fallback />}>
          <EssentialPhotos />
        </Suspense>
      </BaseLayout>
    </HydrateClient>
  )
}
