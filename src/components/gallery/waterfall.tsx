'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PhotoLightbox } from '@/components/gallery/lightbox'
import { PhotoHoverOverlay } from '@/components/gallery/photo-info/hover-overlay'
import { useIsClient } from '@/hooks/use-client'
import type { Photo } from '@/server/db/schema/photos'

interface WaterfallGalleryProps {
  photo: Photo
  index: number
  tempRating?: number
  onRatingChange: (rating: number | undefined) => void
  photos: Photo[]
}

export function WaterfallGallery({
  photo,
  index,
  tempRating,
  onRatingChange,
  photos,
}: WaterfallGalleryProps) {
  const isClient = useIsClient()
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div className='fade-in-0 slide-in-from-bottom-2 mb-3 animate-in break-inside-avoid duration-500 md:mb-4'>
        <div
          className='group relative cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg md:shadow-lg md:hover:shadow-xl'
          onClick={() => setLightboxOpen(true)}
        >
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
