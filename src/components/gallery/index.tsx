'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { LoadingDot } from '@/components/common/loading-dot'
import { FeedGallery } from '@/components/gallery/feed'
import { GridGallery } from '@/components/gallery/grid'
import { WaterfallGallery } from '@/components/gallery/waterfall'
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
  const t = useTranslations('Gallery')

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
  const [isLayoutChanging, setIsLayoutChanging] = useState(false)
  const [showLayoutContent, setShowLayoutContent] = useState(true)
  const prevLayoutRef = useRef(layout)

  useEffect(() => {
    if (prevLayoutRef.current !== layout) {
      setIsLayoutChanging(true)
      setShowLayoutContent(false)
      prevLayoutRef.current = layout

      // hide content, show loading
      const hideTimer = setTimeout(() => {
        setShowLayoutContent(true)
      }, 500)

      // show new layout
      const showTimer = setTimeout(() => {
        setIsLayoutChanging(false)
      }, 500)

      return () => {
        clearTimeout(hideTimer)
        clearTimeout(showTimer)
      }
    }
  }, [layout])

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
      }, 500)
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

  if (isLayoutChanging && !showLayoutContent) {
    return (
      <div className='flex h-[60vh] w-full items-center justify-center'>
        <LoadingDot />
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'layout-transition w-full',
          isLayoutChanging && 'layout-transition-exiting pointer-events-none',
          !isLayoutChanging && 'layout-transition-entered',
          layout === 'grid' && [
            'px-2 py-2 sm:px-3 sm:py-3 md:px-6 md:py-6 xl:px-48',
            'grid grid-cols-1 gap-3',
            'sm:grid-cols-2 sm:gap-4',
            'md:grid-cols-3 md:gap-5',
            'lg:grid-cols-4 lg:gap-6',
            'xl:grid-cols-5 xl:gap-7',
            '2xl:grid-cols-6 2xl:gap-8',
          ],
          layout === 'waterfall' && [
            'px-3 pt-4 pb-3 sm:px-4 sm:pb-4 md:px-12 md:pb-12 xl:px-48 xl:pb-48',
            'columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4',
          ],
          layout === 'feed' && [
            'px-3 pt-4 pb-3 sm:px-4 sm:pb-4 md:px-12 md:pb-12 xl:px-48 xl:pb-48',
            'flex flex-col items-center gap-8 px-2 md:gap-20 md:px-0',
          ],
        )}
      >
        {photos.map((photo: Photo, index: number) => {
          const photoKey = `${photo.id}-${index}`

          switch (layout) {
            case 'feed':
              return (
                <FeedGallery
                  key={photoKey}
                  photo={photo}
                  index={index}
                  tempRating={tempRatings[photo.id]}
                  onRatingChange={(rating) =>
                    handleRatingChange(photo.id, rating)
                  }
                  photos={photos}
                  queryResult={queryResult}
                />
              )
            case 'waterfall':
              return (
                <WaterfallGallery
                  key={photoKey}
                  photo={photo}
                  index={index}
                  tempRating={tempRatings[photo.id]}
                  onRatingChange={(rating) =>
                    handleRatingChange(photo.id, rating)
                  }
                  photos={photos}
                  queryResult={queryResult}
                />
              )
            case 'grid':
              return (
                <GridGallery
                  key={photoKey}
                  photo={photo}
                  index={index}
                  tempRating={tempRatings[photo.id]}
                  onRatingChange={(rating) =>
                    handleRatingChange(photo.id, rating)
                  }
                  photos={photos}
                  queryResult={queryResult}
                />
              )
            default:
              return (
                <FeedGallery
                  key={photoKey}
                  photo={photo}
                  index={index}
                  tempRating={tempRatings[photo.id]}
                  onRatingChange={(rating) =>
                    handleRatingChange(photo.id, rating)
                  }
                  photos={photos}
                  queryResult={queryResult}
                />
              )
          }
        })}
      </div>

      {isFetchingNextPage && <LoadingDot />}

      {!inFinite && !hasNextPage && photos.length > 0 && (
        <p className='mb-5 flex justify-center text-gray-500 text-sm dark:text-gray-400'>
          {t('allPhotosDisplayed', { count: photos.length })}
        </p>
      )}

      {/* to prevent layout changing when scrolling */}
      <div
        ref={ref}
        className='h-32 w-full'
        aria-hidden='true'
      />
    </>
  )
}
