import { Ellipsis } from 'lucide-react'
import { PhotoExifContent } from '@/components/gallery/photo-exif'
import { InfoItem } from '@/components/gallery/photo-info-item'
import { PhotoLocationContent } from '@/components/gallery/photo-location'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Photo } from '@/server/db/schema/photos'

interface PhotoInfoMoreProps {
  photo: Photo
}

export function PhotoInfoMore({ photo }: PhotoInfoMoreProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <InfoItem title='&emsp;'>
          <Ellipsis className='size-6' />
        </InfoItem>
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex w-auto flex-col gap-4'>
          <PhotoLocationContent photo={photo} />
          <PhotoExifContent photo={photo} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
