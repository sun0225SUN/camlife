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
import { cn } from '@/lib/utils'
import type { Photo } from '@/server/db/schema/photos'
import { useView } from '@/stores/use-view'

interface GalleryProps {
  photosData?: Photo[]
}

export function Gallery({ photosData }: GalleryProps) {
  const { layout } = useView()

  if (!photosData) return null

  return (
    <div
      className={cn(
        'mt-5 mb-10 w-full md:px-12 xl:px-48',
        layout === 'grid' &&
          'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4',
        layout === 'waterfall' && 'columns-2 gap-4 md:columns-3 lg:columns-4',
        layout === 'feed' && 'flex flex-col items-center gap-20',
      )}
    >
      {photosData.map((photo, index) => {
        if (layout === 'feed') {
          return (
            <FeedPhoto
              key={photo.id}
              photo={photo}
              index={index}
            />
          )
        }

        if (layout === 'waterfall') {
          return (
            <WaterfallPhoto
              key={photo.id}
              photo={photo}
            />
          )
        }

        if (layout === 'grid') {
          return (
            <GridPhoto
              key={photo.id}
              photo={photo}
            />
          )
        }

        return (
          <FeedPhoto
            key={photo.id}
            photo={photo}
            index={index}
          />
        )
      })}
    </div>
  )
}

function FeedPhoto({ photo, index }: { photo: Photo; index: number }) {
  const isPortrait = photo.height > photo.width

  const isClient = useIsClient()

  const { displaySize } = useImageDisplaySize({
    width: photo.width,
    height: photo.height,
  })

  return (
    <div className='relative flex max-w-full flex-col items-center justify-center gap-10'>
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
      <FeedPhotoInfoDocker photo={photo} />
    </div>
  )
}

function FeedPhotoInfoDocker({ photo }: { photo: Photo }) {
  const t = useTranslations('PhotoInfo')

  // todo: save temp rating to db
  const [tempRating, setTempRating] = useState<number | undefined>(undefined)

  return (
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
  )
}

function WaterfallPhoto({ photo }: { photo: Photo }) {
  const isClient = useIsClient()
  const isPortrait = photo.height > photo.width

  return (
    <div className='mb-4 break-inside-avoid'>
      <div className='group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl'>
        {isClient && (
          <Image
            placeholder='blur'
            blurDataURL={photo.blurDataUrl}
            src={photo.compressedUrl || photo.url}
            width={photo.width}
            height={photo.height}
            alt={photo.title || 'Photo'}
            className='h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
          />
        )}

        <PhotoHoverOverlay
          title={photo.title}
          description={photo.description}
          isPortrait={isPortrait}
        />
      </div>
    </div>
  )
}

function GridPhoto({ photo }: { photo: Photo }) {
  const isClient = useIsClient()
  const isPortrait = photo.height > photo.width

  return (
    <div className='aspect-square w-full'>
      <div className='group relative h-full w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl'>
        {isClient && (
          <Image
            placeholder='blur'
            blurDataURL={photo.blurDataUrl}
            src={photo.compressedUrl || photo.url}
            fill
            alt={photo.title || 'Photo'}
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw'
          />
        )}

        <PhotoHoverOverlay
          title={photo.title}
          description={photo.description}
          isPortrait={isPortrait}
        />
      </div>
    </div>
  )
}
