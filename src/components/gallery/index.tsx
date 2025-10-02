'use client'

import Image from 'next/image'
import { PhotoHoverOverlay } from '@/components/gallery/photo-hover-overlay'
import { PER_PAGE_PHOTOS_COUNT } from '@/constants'
import { useImageDisplaySize } from '@/hooks/use-image-display-size'
import { useIsClient } from '@/hooks/use-is-client'
import type { Photo } from '@/server/db/schema/photos'

interface GalleryProps {
  photosData?: Photo[]
}

function GalleryItem({ photo, index }: { photo: Photo; index: number }) {
  const isClient = useIsClient()

  const isPortrait = photo.height > photo.width

  const { displaySize } = useImageDisplaySize({
    width: photo.width,
    height: photo.height,
  })

  return (
    <div className='group relative flex w-full max-w-full justify-center'>
      <div
        className='relative max-w-full'
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
            className='rounded-lg object-contain'
            sizes={`(min-width: 1280px) min(${displaySize.width}px, calc(100vw - 384px)), (min-width: 768px) min(${displaySize.width}px, calc(100vw - 96px)), min(${displaySize.width}px, 100vw)`}
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

export function Gallery({ photosData }: GalleryProps) {
  if (!photosData) return null

  return (
    <div className='flex w-full flex-col items-center gap-20 md:px-12 xl:px-48'>
      {photosData.map((photo, index) => (
        <GalleryItem
          key={photo.id}
          photo={photo}
          index={index}
        />
      ))}
    </div>
  )
}
