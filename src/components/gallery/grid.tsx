'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PhotoLightbox } from '@/components/gallery/lightbox'
import { PhotoHoverOverlay } from '@/components/gallery/photo-info/hover-overlay'
import { useIsClient } from '@/hooks/use-client'
import type { Photo } from '@/server/db/schema/photos'

interface GridGalleryProps {
  photo: Photo
  index: number
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
  photos: Photo[]
}

export function GridGallery({
  photo,
  index,
  tempRating,
  onRatingChange,
  photos,
}: GridGalleryProps) {
  const isClient = useIsClient()
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div className='fade-in-0 slide-in-from-bottom-2 grid-item-responsive grid-item-smooth aspect-square w-full animate-in duration-500'>
        <div
          className='group relative h-full w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all duration-300 ease-out hover:shadow-xl md:shadow-lg md:hover:shadow-2xl dark:bg-gray-800'
          onClick={() => setLightboxOpen(true)}
        >
          {isClient && (
            <Image
              placeholder='blur'
              blurDataURL={photo.blurDataUrl}
              src={photo.compressedUrl || photo.url}
              fill
              alt={photo.title || 'Photo'}
              className='object-cover transition-all duration-300 ease-out group-hover:scale-105'
              sizes='(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw'
            />
          )}

          <PhotoHoverOverlay
            title={photo.title}
            description={photo.description}
            isPortrait={isPortrait}
          />
        </div>
      </div>

      <PhotoLightbox
        photos={photos}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        index={index}
        tempRating={tempRating}
        onRatingChange={onRatingChange}
      />
    </>
  )
}
