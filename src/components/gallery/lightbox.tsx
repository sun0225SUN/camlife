'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeedPhotoInfo } from '@/components/gallery/feed'
import { useIsClient } from '@/hooks/use-client'
import { cn } from '@/lib/utils'
import type { Photo } from '@/server/db/schema/photos'
import '@/styles/lightbox.css'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import { useIsMobile } from '@/hooks/use-mobile'

interface PhotoLightboxProps {
  photos: Photo[]
  open: boolean
  onClose: () => void
  index: number
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
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

export function PhotoLightbox({
  photos,
  open,
  onClose,
  index,
  tempRating,
  onRatingChange,
  queryResult,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index)
  const [allPhotos, setAllPhotos] = useState<Photo[]>(photos)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  useEffect(() => {
    if (queryResult?.data?.pages) {
      const allPhotosFromPages = queryResult.data.pages.flatMap(
        (page) => page.items,
      )
      const seenIds = new Set<string>()
      const deduplicatedPhotos = allPhotosFromPages.filter((photo) => {
        if (seenIds.has(photo.id)) {
          return false
        }
        seenIds.add(photo.id)
        return true
      })
      setAllPhotos(deduplicatedPhotos)
    } else {
      setAllPhotos(photos)
    }
  }, [photos, queryResult?.data?.pages])

  const isClient = useIsClient()
  const { resolvedTheme } = useTheme()

  const slides = useMemo(() => {
    return allPhotos.map((photo) => {
      // Ensure width and height are valid numbers
      const width =
        photo.width && photo.width > 0 ? Math.round(photo.width) : 1200
      const height =
        photo.height && photo.height > 0 ? Math.round(photo.height) : 900

      return {
        // Use the original URL for the slide source
        src: photo.url,
        alt: photo.title || 'Photo',
        title: photo.title,
        width,
        height,
        srcSet: [
          {
            src: photo.compressedUrl || photo.url,
            width,
            height,
          },
          {
            src: photo.url,
            width,
            height,
          },
        ],
      }
    })
  }, [allPhotos])

  const currentPhoto = allPhotos[currentIndex]

  const lightboxStyles = useMemo(() => {
    const isDark = resolvedTheme === 'dark'
    return {
      container: {
        backgroundColor: isDark
          ? 'rgba(0, 0, 0, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
      },
    }
  }, [resolvedTheme])

  const handleViewChange = useCallback(
    ({ index: newIndex }: { index: number }) => {
      setCurrentIndex(newIndex)

      if (
        queryResult?.hasNextPage &&
        !queryResult?.isFetchingNextPage &&
        !isLoadingMore &&
        newIndex >= allPhotos.length - 3
      ) {
        setIsLoadingMore(true)
        queryResult.fetchNextPage()
        setTimeout(() => {
          setIsLoadingMore(false)
        }, 1000)
      }
    },
    [queryResult, isLoadingMore, allPhotos.length],
  )

  if (!isClient) {
    return null
  }

  return (
    <>
      <Lightbox
        open={open}
        index={currentIndex}
        plugins={[Captions, Zoom]}
        styles={lightboxStyles}
        slides={slides}
        on={{
          view: handleViewChange,
        }}
        carousel={{
          finite: true,
          preload: 2,
        }}
        animation={{
          fade: 300,
          swipe: 300,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        close={() => {
          setCurrentIndex(index)
          onClose()
        }}
        render={{
          slide: ({ slide, rect }) => {
            const slideIndex = slides.findIndex((s) => s.src === slide.src)
            const photo = slideIndex >= 0 ? allPhotos[slideIndex] : null

            // Use the pre-calculated dimensions from slides
            const slideWidth = slide.width || 1200
            const slideHeight = slide.height || 900

            // Calculate aspect ratio
            const slideAspectRatio = slideWidth / slideHeight
            const rectAspectRatio = rect.width / rect.height

            let width: number, height: number

            if (slideAspectRatio > rectAspectRatio) {
              // Image is wider than container - fit to width
              width = Math.round(rect.width)
              height = Math.round(width / slideAspectRatio)
            } else {
              // Image is taller than container - fit to height
              height = Math.round(rect.height)
              width = Math.round(height * slideAspectRatio)
            }

            return (
              <div className='relative flex h-full w-full items-center justify-center'>
                <Image
                  src={slide.src}
                  alt={slide.alt || 'Photo'}
                  width={width}
                  height={height}
                  className='max-h-[70vh] object-contain'
                  unoptimized
                  placeholder={photo?.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={photo?.blurDataUrl || undefined}
                  priority={slideIndex === currentIndex}
                  sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
                />
              </div>
            )
          },
          buttonClose: () => (
            <button
              key='close-button'
              type='button'
              onClick={() => {
                setCurrentIndex(index)
                onClose()
              }}
              className={cn(
                'absolute top-3 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 md:right-16',
                'cursor-pointer border backdrop-blur-md hover:scale-110 active:scale-95',
                resolvedTheme === 'dark'
                  ? 'border-white/20 bg-black/30 text-white hover:bg-black/50'
                  : 'border-black/20 bg-white/30 text-black hover:bg-white/50',
              )}
            >
              <X className='size-5' />
            </button>
          ),
          buttonPrev: () => (
            <button
              key='prev-button'
              type='button'
              onClick={() => {
                if (currentIndex > 0) {
                  handleViewChange({ index: currentIndex - 1 })
                }
              }}
              disabled={currentIndex === 0}
              className={cn(
                '-translate-y-1/2 absolute top-1/2 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                'cursor-pointer border backdrop-blur-md hover:scale-110 active:scale-95',
                currentIndex === 0 && 'cursor-not-allowed opacity-50',
                resolvedTheme === 'dark'
                  ? 'border-white/20 bg-black/30 text-white hover:bg-black/50'
                  : 'border-black/20 bg-white/30 text-black hover:bg-white/50',
              )}
            >
              <ChevronLeft className='size-6' />
            </button>
          ),
          buttonNext: () => (
            <button
              key='next-button'
              type='button'
              onClick={() => {
                if (currentIndex < allPhotos.length - 1) {
                  handleViewChange({ index: currentIndex + 1 })
                }
              }}
              disabled={currentIndex === allPhotos.length - 1}
              className={cn(
                '-translate-y-1/2 absolute top-1/2 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                'cursor-pointer border backdrop-blur-md hover:scale-110 active:scale-95',
                currentIndex === allPhotos.length - 1 &&
                  'cursor-not-allowed opacity-50',
                resolvedTheme === 'dark'
                  ? 'border-white/20 bg-black/30 text-white hover:bg-black/50'
                  : 'border-black/20 bg-white/30 text-black hover:bg-white/50',
              )}
            >
              <ChevronRight className='size-6' />
            </button>
          ),
        }}
      />

      {currentPhoto &&
        !isMobile &&
        createPortal(
          <div
            className={cn(
              'pointer-events-none fixed bottom-6 left-1/2 z-[9999] transition-all duration-200',
              '-translate-x-1/2 transform',
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
              'bg-white/80 backdrop-blur-md dark:bg-black/80',
              'rounded-2xl border border-white/20 dark:border-black/20',
              'mx-auto max-w-7xl p-4 shadow-lg',
            )}
          >
            <FeedPhotoInfo
              photo={currentPhoto}
              tempRating={tempRating}
              onRatingChange={onRatingChange}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
