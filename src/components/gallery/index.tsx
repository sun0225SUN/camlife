'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { LoadingDot } from '@/components/common/loading-dot'
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
  inFinite?: boolean
  queryResult: {
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

export function Gallery({ queryResult, inFinite = false }: GalleryProps) {
  const { layout } = useView()

  // Check if the component is in view
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  })

  const [tempRatings, setTempRatings] = useState<
    Record<string, number | undefined>
  >({})

  const [isFetching, setIsFetching] = useState(false)

  // Get photos list with infinite scroll support
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    queryResult

  const photos = useMemo(() => {
    if (!data?.pages) return []

    // Flatten all pages and deduplicate by photo.id
    const allPhotos = data.pages.flatMap((page) => page.items)
    const seenIds = new Set<string>()
    return allPhotos.filter((photo) => {
      if (seenIds.has(photo.id)) {
        return false
      }
      seenIds.add(photo.id)
      return true
    })
  }, [data])

  // Fetch next page when the component is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
      setIsFetching(true)
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isFetching])

  // Reset isFetching when fetchNextPage completes
  useEffect(() => {
    if (!isFetchingNextPage && isFetching) {
      // Add a brief delay to prevent continuous triggering
      const timer = setTimeout(() => {
        setIsFetching(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isFetchingNextPage, isFetching])

  const handleRatingChange = useCallback(
    (photoId: string, rating: number | undefined) => {
      setTempRatings((prev) => ({
        ...prev,
        [photoId]: rating,
      }))
    },
    [],
  )

  if (isLoading) {
    return (
      <div className='flex h-[60vh] w-full items-center justify-center'>
        <LoadingDot />
      </div>
    )
  }

  if (!photos || photos.length === 0) {
    return (
      <div className='flex h-[60vh] w-full items-center justify-center'>
        <p>No photos found</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'mt-5 mb-10 w-full space-y-20 md:px-12 xl:px-48',
          layout === 'grid' &&
            'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4',
          layout === 'waterfall' && 'columns-2 gap-4 md:columns-3 lg:columns-4',
          layout === 'feed' && 'flex flex-col items-center gap-20',
        )}
      >
        {photos.map((photo: Photo, index: number) => {
          // Use a combination of photo.id and index to ensure unique keys
          const uniqueKey = `${photo.id}-${index}`

          if (layout === 'feed') {
            return (
              <FeedPhoto
                key={uniqueKey}
                photo={photo}
                index={index}
                tempRating={tempRatings[photo.id]}
                onRatingChange={(rating) =>
                  handleRatingChange(photo.id, rating)
                }
              />
            )
          }

          if (layout === 'waterfall') {
            return (
              <WaterfallPhoto
                key={uniqueKey}
                photo={photo}
              />
            )
          }

          if (layout === 'grid') {
            return (
              <GridPhoto
                key={uniqueKey}
                photo={photo}
              />
            )
          }

          return (
            <FeedPhoto
              key={uniqueKey}
              photo={photo}
              index={index}
              tempRating={tempRatings[photo.id]}
              onRatingChange={(rating) => handleRatingChange(photo.id, rating)}
            />
          )
        })}
      </div>

      {isFetchingNextPage && <LoadingDot />}

      {!inFinite && !hasNextPage && photos.length > 0 && (
        <p className='mb-5 flex justify-center text-gray-500 text-sm dark:text-gray-400'>
          All photos ({photos.length} is displayed)
        </p>
      )}

      <div
        ref={ref}
        className='h-32 w-full'
        aria-hidden='true'
      />
    </>
  )
}

function FeedPhoto({
  photo,
  index,
  tempRating,
  onRatingChange,
}: {
  photo: Photo
  index: number
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
}) {
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth
  const isClient = useIsClient()

  const { displaySize } = useImageDisplaySize({
    width: photoWidth,
    height: photoHeight,
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
      <FeedPhotoInfoDocker
        photo={photo}
        tempRating={tempRating}
        onRatingChange={onRatingChange}
      />
    </div>
  )
}

function FeedPhotoInfoDocker({
  photo,
  tempRating,
  onRatingChange,
}: {
  photo: Photo
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
}) {
  const t = useTranslations('PhotoInfo')

  return (
    <div className='flex w-full items-center justify-center gap-6 overflow-x-auto'>
      <InfoItem title={t('rating')}>
        <PhotoRating
          rating={tempRating || photo.rating}
          setRating={onRatingChange}
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
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth

  return (
    <div className='mb-4 break-inside-avoid'>
      <div className='group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl'>
        {isClient && (
          <Image
            placeholder='blur'
            blurDataURL={photo.blurDataUrl}
            src={photo.compressedUrl || photo.url}
            width={photoWidth}
            height={photoHeight}
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
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth

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
