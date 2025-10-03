import { Ellipsis } from 'lucide-react'
import { PhotoExifContent } from '@/components/gallery/photo-info/exif'
import { InfoItem } from '@/components/gallery/photo-info/item'
import { PhotoLocationContent } from '@/components/gallery/photo-info/location'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Photo } from '@/server/db/schema/photos'

interface PhotoInfoMoreProps {
  photo: Photo
}

export function PhotoInfoMore({ photo }: PhotoInfoMoreProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <InfoItem title='&emsp;'>
            <PhotoInfoMoreTrigger />
          </InfoItem>
        </DrawerTrigger>
        <DrawerContent className='max-h-[60vh] p-4'>
          <DrawerHeader>
            <DrawerTitle>详细信息</DrawerTitle>
          </DrawerHeader>
          <PhotoInfoMoreContent photo={photo} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InfoItem title='&emsp;'>
          <PhotoInfoMoreTrigger />
        </InfoItem>
      </PopoverTrigger>
      <PopoverContent>
        <PhotoInfoMoreContent photo={photo} />
      </PopoverContent>
    </Popover>
  )
}

export function PhotoInfoMoreTrigger() {
  return <Ellipsis className='size-6' />
}

export function PhotoInfoMoreContent({ photo }: PhotoInfoMoreProps) {
  return (
    <div className='flex w-auto flex-col gap-4'>
      <PhotoLocationContent photo={photo} />
      <PhotoExifContent photo={photo} />
    </div>
  )
}
