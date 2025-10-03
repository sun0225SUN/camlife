'use client'

import { toast } from 'sonner'
import { Gallery } from '@/components/gallery/photo'
import { useGeolocation } from '@/hooks/use-geolocation'
import type { Photo } from '@/server/db/schema/photos'
import { api } from '@/trpc/react'

export function NearbyPhotos() {
  const { latitude, longitude, error, loading: geoLoading } = useGeolocation()

  const hasLocation = latitude !== null && longitude !== null

  const { data: photosDataByLocation, isLoading: isLoadingByLocation } =
    api.photo.getNearbyPhotosByLocation.useQuery(
      {
        latitude: latitude!,
        longitude: longitude!,
        limit: 50,
      },
      {
        enabled: hasLocation,
      },
    )

  const { data: photosDataDefault, isLoading: isLoadingDefault } =
    api.photo.getNearbyPhotosList.useQuery(undefined, {
      enabled: !hasLocation,
    })

  const isLoading = geoLoading || isLoadingByLocation || isLoadingDefault
  const photosData = hasLocation ? photosDataByLocation : photosDataDefault

  if (isLoading) {
    return null
  }

  if (error) {
    toast.error(error)
  }

  return (
    <>{photosData && <Gallery photosData={photosData.data as Photo[]} />}</>
  )
}
