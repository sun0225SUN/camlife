'use client'

import Image from 'next/image'
import { PER_PAGE_PHOTOS_COUNT } from '@/constants'
import type { Photo } from '@/server/db/schema/photos'

interface GalleryProps {
  photosData?: Photo[]
}

export function Gallery({ photosData }: GalleryProps) {
  if (!photosData) return null

  return (
    <div className='flex w-full flex-col items-center gap-20 px-4 md:px-0'>
      {photosData.map((photo, index) => (
        <div key={photo.id}>
          <Image
            placeholder='blur'
            blurDataURL={photo.blurDataUrl}
            src={photo.compressedUrl || photo.url}
            width={photo.width}
            height={photo.height}
            alt={photo.title || 'Photo'}
            priority={index < PER_PAGE_PHOTOS_COUNT}
            className='h-auto max-h-[80vh] w-full rounded-lg object-contain'
          />
        </div>
      ))}
    </div>
  )
}
