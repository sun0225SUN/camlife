'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PhotoLightbox } from '@/components/gallery/lightbox'
import { PhotoExif } from '@/components/gallery/photo-info/exif'
import { PhotoHoverOverlay } from '@/components/gallery/photo-info/hover-overlay'
import { InfoItem } from '@/components/gallery/photo-info/item'
import { PhotoLocation } from '@/components/gallery/photo-info/location'
import { PhotoInfoMore } from '@/components/gallery/photo-info/more'
import { PhotoRating } from '@/components/gallery/photo-info/photo-rating'
import { useIsClient } from '@/hooks/use-client'
import { useImageDisplaySize } from '@/hooks/use-image-display-size'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAppSettings } from '@/hooks/use-settings'
import { formatExifDateTime } from '@/lib/format/date-time'
import type { Photo } from '@/server/db/schema/photos'

interface FeedGalleryProps {
  photo: Photo
  index: number
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
  photos: Photo[]
  queryResult?: {
    data?: {
      pages: Array<{
        items: Photo[]
        nextCursor?: string
      }>
    }
    fetchNextPage: () => void
    hasNextPage?: boolean
    isFetchingNextPage: boolean
    isLoading: boolean
  }
}

export function FeedGallery({
  photo,
  index,
  tempRating,
  onRatingChange,
  photos,
  queryResult,
}: FeedGalleryProps) {
  const t = useTranslations('photo')
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth
  const isClient = useIsClient()

  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Get app settings
  const { perPagePhotosCountInfinite } = useAppSettings()

  const { displaySize } = useImageDisplaySize({
    width: photoWidth,
    height: photoHeight,
  })

  return (
    <>
      <div className='fade-in-0 slide-in-from-bottom-4 relative flex max-w-full animate-in cursor-pointer flex-col items-center justify-center gap-6 px-2 duration-700 md:gap-10 md:px-0'>
        <div
          className='group relative max-w-full rounded-lg object-contain'
          style={{ width: displaySize.width, height: displaySize.height }}
          onClick={() => setLightboxOpen(true)}
        >
          {isClient && (
            <Image
              placeholder='blur'
              blurDataURL={photo.blurDataUrl}
              src={photo.compressedUrl || photo.url}
              fill
              alt={photo.title || t('photo')}
              priority={index < perPagePhotosCountInfinite}
              className='rounded-lg shadow-2xl'
              sizes={`(min-width: 1280px) min(${displaySize.width}px, calc(100vw - 384px)), (min-width: 768px) min(${displaySize.width}px, calc(100vw - 96px)), min(${displaySize.width}px, 100vw)`}
            />
          )}
          <PhotoHoverOverlay
            title={photo.title}
            description={photo.description}
            isPortrait={isPortrait}
          />
        </div>
        <FeedPhotoInfo
          photo={photo}
          tempRating={tempRating}
          onRatingChange={onRatingChange}
        />
      </div>

      <PhotoLightbox
        photos={photos}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        index={index}
        tempRating={tempRating}
        onRatingChange={onRatingChange}
        queryResult={queryResult}
      />
    </>
  )
}

export function FeedPhotoInfo({
  photo,
  tempRating,
  onRatingChange,
}: {
  photo: Photo
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
}) {
  const t = useTranslations('photo')
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className='flex w-full items-center justify-between gap-2 px-2'>
        <div className='scrollbar-hide flex flex-1 items-center gap-3 overflow-x-auto'>
          <InfoItem title={t('rating')}>
            <PhotoRating
              rating={tempRating || photo.rating}
              setRating={onRatingChange}
            />
          </InfoItem>

          <PhotoExif photo={photo} />

          <InfoItem title={t('camera')}>
            <div className='whitespace-nowrap text-xs uppercase'>
              {photo.model ?? t('unknown')}
            </div>
          </InfoItem>

          {photo.lensModel && (
            <InfoItem title={t('lens-model')}>
              <div className='whitespace-nowrap text-xs uppercase'>
                {photo.lensModel ?? t('unknown')}
              </div>
            </InfoItem>
          )}

          <PhotoLocation photo={photo} />

          <InfoItem title={t('time')}>
            <div className='whitespace-nowrap text-xs'>
              {photo.dateTimeOriginal
                ? formatExifDateTime(
                    photo.dateTimeOriginal.toString(),
                  )?.toLocaleString()
                : t('unknown')}
            </div>
          </InfoItem>
        </div>

        <PhotoInfoMore photo={photo} />
      </div>
    )
  }

  return (
    <div className='relative flex w-full items-center justify-center gap-6'>
      <div className='scrollbar-hide flex items-center gap-6 overflow-x-auto'>
        <InfoItem title={t('rating')}>
          <PhotoRating
            rating={tempRating || photo.rating}
            setRating={onRatingChange}
          />
        </InfoItem>

        <PhotoExif photo={photo} />

        <InfoItem title={t('camera')}>
          <div className='whitespace-nowrap uppercase'>
            {photo.model ?? t('unknown')}
          </div>
        </InfoItem>

        {photo.lensModel && (
          <InfoItem title={t('lens-model')}>
            <div className='whitespace-nowrap uppercase'>
              {photo.lensModel ?? t('unknown')}
            </div>
          </InfoItem>
        )}

        <PhotoLocation photo={photo} />

        <InfoItem title={t('time')}>
          <div className='whitespace-nowrap'>
            {photo.dateTimeOriginal
              ? formatExifDateTime(
                  photo.dateTimeOriginal.toString(),
                )?.toLocaleString()
              : t('unknown')}
          </div>
        </InfoItem>
      </div>

      <PhotoInfoMore photo={photo} />
    </div>
  )
}
