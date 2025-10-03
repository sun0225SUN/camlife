'use client'

import Image from 'next/image'
import { PhotoHoverOverlay } from '@/components/gallery/photo-info/hover-overlay'
import { useIsClient } from '@/hooks/use-client'
import type { Photo } from '@/server/db/schema/photos'

interface WaterfallGalleryProps {
  photo: Photo
}

export function WaterfallGallery({ photo }: WaterfallGalleryProps) {
  const isClient = useIsClient()
  const photoWidth = photo.width || 1200
  const photoHeight = photo.height || 900
  const isPortrait = photoHeight > photoWidth

  return (
    <div className='fade-in-0 slide-in-from-bottom-2 mb-3 animate-in break-inside-avoid duration-500 md:mb-4'>
      <div className='group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg md:shadow-lg md:hover:shadow-xl'>
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
