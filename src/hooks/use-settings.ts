'use client'

import {
  ADDRESS_LANGUAGE,
  COMPRESS_QUALITY,
  DEFAULT_PHOTO_RATING,
  ENABLE_FILE_COMPRESSION,
  IMAGE_SIZE_LIMIT,
  PER_PAGE_PHOTOS_COUNT_INFINITE,
  SHUFFLE_PHOTOS_COUNT,
} from '@/constants'
import { api } from '@/trpc/react'

/**
 * Client-side hook for getting app settings
 * Prioritizes values from database settings, falls back to default constants if not found
 */
export function useAppSettings() {
  const { data: appSettings, isLoading } =
    api.settings.getByCategory.useQuery('app')

  // Image size limit (MB)
  const imageSizeLimit = appSettings?.['app.image_size_limit']
    ? Number(appSettings['app.image_size_limit']) * 1024 * 1024 // Convert to bytes
    : IMAGE_SIZE_LIMIT

  // Enable file compression
  const enableFileCompression = appSettings?.['app.enable_file_compression']
    ? appSettings['app.enable_file_compression'] === 'true'
    : ENABLE_FILE_COMPRESSION

  // Compression quality
  const compressQuality = appSettings?.['app.compress_quality']
    ? Number(appSettings['app.compress_quality'])
    : COMPRESS_QUALITY

  // Default photo rating
  const defaultPhotoRating = appSettings?.['app.default_photo_rating']
    ? Number(appSettings['app.default_photo_rating'])
    : DEFAULT_PHOTO_RATING

  // Address language
  const addressLanguage = appSettings?.['app.address_language']
    ? appSettings['app.address_language']
    : ADDRESS_LANGUAGE

  // Infinite scroll photos per page count
  const perPagePhotosCountInfinite = appSettings?.[
    'app.per_page_photos_count_infinite'
  ]
    ? Number(appSettings['app.per_page_photos_count_infinite'])
    : PER_PAGE_PHOTOS_COUNT_INFINITE

  // Shuffle photos count
  const shufflePhotosCount = appSettings?.['app.shuffle_photos_count']
    ? Number(appSettings['app.shuffle_photos_count'])
    : SHUFFLE_PHOTOS_COUNT

  return {
    imageSizeLimit,
    enableFileCompression,
    compressQuality,
    defaultPhotoRating,
    addressLanguage,
    perPagePhotosCountInfinite,
    shufflePhotosCount,
    isLoading,
  }
}
