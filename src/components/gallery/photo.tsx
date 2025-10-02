'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PhotoExif } from '@/components/gallery/photo-exif'
import { PhotoHoverOverlay } from '@/components/gallery/photo-hover-overlay'
import { InfoItem } from '@/components/gallery/photo-info-item'
import { PhotoInfoMore } from '@/components/gallery/photo-info-more'
import { PhotoLocation } from '@/components/gallery/photo-location'
import { PhotoRating } from '@/components/gallery/photo-rating'
import { PER_PAGE_PHOTOS_COUNT } from '@/constants'
import { useImageDisplaySize } from '@/hooks/use-image-display-size'
import { useIsClient } from '@/hooks/use-is-client'
import { formatExifDateTime } from '@/lib/format/date-time'
import type { Photo } from '@/server/db/schema/photos'

interface GalleryProps {
  photosData?: Photo[]
}

export function SinglePhoto({ photo, index }: { photo: Photo; index: number }) {
  const isPortrait = photo.height > photo.width

  const isClient = useIsClient()

  const t = useTranslations('PhotoInfo')

  // todo: save temp rating to db
  const [tempRating, setTempRating] = useState<number | undefined>(undefined)

  const { displaySize } = useImageDisplaySize({
    width: photo.width,
    height: photo.height,
  })

  return (
    <div className='flew-full relative flex max-w-full flex-col items-center justify-center gap-10'>
      <div
        className='group relative max-w-full rounded-lg object-contain'
        style={{ width: displaySize.width, height: displaySize.height }}
      >
        {isClient && (
          <Image
            placeholder='blur'
            blurDataURL={photo.blurDataUrl}
            src={photo.compressedUrl || photo.url}
            fill
            alt={photo.title || 'Photo'}
            priority={index < PER_PAGE_PHOTOS_COUNT}
            className='rounded-lg object-contain shadow-2xl'
            sizes={`(min-width: 1280px) min(${displaySize.width}px, calc(100vw - 384px)), (min-width: 768px) min(${displaySize.width}px, calc(100vw - 96px)), min(${displaySize.width}px, 100vw)`}
          />
        )}

        <PhotoHoverOverlay
          title={photo.title}
          description={photo.description}
          isPortrait={isPortrait}
        />
      </div>

      <div className='flex w-full items-center justify-center gap-6 overflow-x-auto'>
        <InfoItem title={t('rating')}>
          <PhotoRating
            rating={tempRating || photo.rating}
            setRating={(rating) => {
              setTempRating(rating)
            }}
          />
        </InfoItem>

        <PhotoExif photo={photo} />

        <InfoItem title={t('camera')}>
          <div className='whitespace-nowrap uppercase'>
            {photo.model ?? 'unknown'}
          </div>
        </InfoItem>

        {photo.lensModel && (
          <InfoItem title={t('lensModel')}>
            <div className='whitespace-nowrap uppercase'>
              {photo.lensModel ?? 'unknown'}
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
              : 'unknown'}
          </div>
        </InfoItem>

        <PhotoInfoMore photo={photo} />
      </div>
    </div>
  )
}

export function Gallery({ photosData }: GalleryProps) {
  if (!photosData) return null

  return (
    <div className='mt-5 mb-10 flex w-full flex-col items-center gap-20 md:px-12 xl:px-48'>
      {photosData.map((photo, index) => (
        <SinglePhoto
          key={photo.id}
          photo={photo}
          index={index}
        />
      ))}
    </div>
  )
}
