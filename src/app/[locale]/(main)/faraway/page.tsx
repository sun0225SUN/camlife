'use client'

import { Gallery } from '@/components/gallery'
import { BaseLayout } from '@/components/layout/base'
import { useGeolocation } from '@/hooks/use-geolocation'
import { useAppSettings } from '@/hooks/use-settings'
import { api } from '@/trpc/react'

export default function FarawayPage() {
  const { latitude, longitude, error, loading: geoLoading } = useGeolocation()
  const { perPagePhotosCountInfinite } = useAppSettings()

  const hasLocation = latitude !== null && longitude !== null
  const hasError = error !== null

  const farawayPhotosQuery =
    api.photo.getFarawayPhotosInfinite.useInfiniteQuery(
      {
        latitude: latitude!,
        longitude: longitude!,
        limit: perPagePhotosCountInfinite,
      },
      {
        enabled: hasLocation && !hasError,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
    )

  if (geoLoading) {
    return (
      <BaseLayout>
        <div className='flex h-[60vh] w-full items-center justify-center'>
          <p>Getting location...</p>
        </div>
      </BaseLayout>
    )
  }

  if (hasError) {
    return (
      <BaseLayout>
        <div className='flex h-[60vh] w-full flex-col items-center justify-center gap-4'>
          <p className='text-red-500'>Location access failed: {error}</p>
          <p className='text-gray-500 text-sm'>
            Please allow location permission to show faraway photos
          </p>
        </div>
      </BaseLayout>
    )
  }

  if (!hasLocation) {
    return (
      <BaseLayout>
        <div className='flex h-[60vh] w-full items-center justify-center'>
          <p>Location permission required to show faraway photos</p>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <Gallery queryResult={farawayPhotosQuery} />
    </BaseLayout>
  )
}
