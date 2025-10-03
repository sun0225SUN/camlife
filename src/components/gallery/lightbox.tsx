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

interface PhotoLightboxProps {
  photos: Photo[]
  open: boolean
  onClose: () => void
  index: number
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
}

export function PhotoLightbox({
  photos,
  open,
  onClose,
  index,
  tempRating,
  onRatingChange,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index)

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  const isClient = useIsClient()
  const { resolvedTheme } = useTheme()

  const slides = useMemo(() => {
    return photos.map((photo) => ({
      src: photo.compressedUrl || photo.url,
      alt: photo.title || 'Photo',
      title: photo.title,
      width: photo.width || 1200,
      height: photo.height || 900,
      srcSet: [
        {
          src: photo.compressedUrl || photo.url,
          width: photo.width || 1200,
          height: photo.height || 900,
        },
        {
          src: photo.url,
          width: photo.width || 1200,
          height: photo.height || 900,
        },
      ],
    }))
  }, [photos])

  const currentPhoto = photos[currentIndex]

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
    },
    [],
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
            const photo = slideIndex >= 0 ? photos[slideIndex] : null

            // Calculate optimal display size
            const cover = false // Use contain mode
            const slideWidth = slide.width || 1200
            const slideHeight = slide.height || 900

            const width = !cover
              ? Math.round(
                  Math.min(
                    rect.width,
                    (rect.height / slideHeight) * slideWidth,
                  ),
                )
              : rect.width

            const height = !cover
              ? Math.round(
                  Math.min(
                    rect.height,
                    (rect.width / slideWidth) * slideHeight,
                  ),
                )
              : rect.height

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
                  setCurrentIndex(currentIndex - 1)
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
                if (currentIndex < photos.length - 1) {
                  setCurrentIndex(currentIndex + 1)
                }
              }}
              disabled={currentIndex === photos.length - 1}
              className={cn(
                '-translate-y-1/2 absolute top-1/2 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                'cursor-pointer border backdrop-blur-md hover:scale-110 active:scale-95',
                currentIndex === photos.length - 1 &&
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
        createPortal(
          <div
            className={cn(
              'fixed right-0 bottom-15 left-0 z-50 transition-all duration-200',
              open
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-4 opacity-0',
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
