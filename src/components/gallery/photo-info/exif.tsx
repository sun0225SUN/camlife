import { Aperture, Telescope, Timer } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ISO from '@/assets/images/iso.svg'
import { InfoItem } from '@/components/gallery/photo-info/item'
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
import { formatExposureTime } from '@/lib/format'
import type { Photo } from '@/server/db/schema/photos'

interface PhotoExifProps {
  photo: Photo
}

export function PhotoExif({ photo }: PhotoExifProps) {
  const t = useTranslations('photo')
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <InfoItem title={t('exif-info')}>
            <PhotoExifTrigger photo={photo} />
          </InfoItem>
        </DrawerTrigger>
        <DrawerContent className='max-h-[60vh] overflow-y-auto p-4'>
          <DrawerHeader>
            <DrawerTitle>{t('exif-info')}</DrawerTitle>
          </DrawerHeader>
          <PhotoExifContent photo={photo} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InfoItem title={t('exif-info')}>
          <PhotoExifTrigger photo={photo} />
        </InfoItem>
      </PopoverTrigger>
      <PopoverContent>
        <PhotoExifContent photo={photo} />
      </PopoverContent>
    </Popover>
  )
}

export function PhotoExifTrigger({ photo }: PhotoExifProps) {
  return (
    <button
      className='flex cursor-pointer gap-4'
      type='button'
    >
      <div className='flex items-center gap-1'>
        <Telescope
          size={18}
          strokeWidth={2}
        />
        {photo.focalLength35mm ? `${photo.focalLength35mm}mm` : 'unknown'}
      </div>
      <div className='flex items-center gap-1'>
        <Aperture
          size={18}
          strokeWidth={2}
        />
        {photo.fNumber ? `ƒ/${photo.fNumber}` : 'unknown'}
      </div>
      <div className='flex items-center gap-1'>
        <Timer
          size={18}
          strokeWidth={2.2}
          absoluteStrokeWidth
        />
        {photo.exposureTime
          ? formatExposureTime(photo.exposureTime)
          : 'unknown'}
      </div>
      <div className='flex items-center gap-1'>
        <ISO className='size-6' />
        {photo.iso?.toString() ?? 'unknown'}
      </div>
    </button>
  )
}

export function PhotoExifContent({ photo }: PhotoExifProps) {
  const t = useTranslations('photo')
  return (
    <div className='grid w-full grid-cols-2 gap-4'>
      <ExifCard
        title={t('focal-length')}
        value={photo.focalLength35mm ? `${photo.focalLength35mm}mm` : 'unknown'}
        icon={<Telescope className='size-7' />}
      />
      <ExifCard
        title={t('aperture')}
        value={photo.fNumber ? `ƒ/${photo.fNumber}` : 'unknown'}
        icon={<Aperture className='size-7' />}
      />
      <ExifCard
        title={t('exposure-time')}
        value={
          photo.exposureTime
            ? formatExposureTime(photo.exposureTime)
            : 'unknown'
        }
        icon={<Timer className='size-7' />}
      />
      <ExifCard
        title='ISO'
        value={photo.iso?.toString() ?? 'unknown'}
        icon={<ISO className='size-8' />}
      />
    </div>
  )
}

interface ExifCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

function ExifCard({ title, value, icon }: ExifCardProps) {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-40 flex-1 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-2 text-sm md:w-36 dark:border-gray-800 dark:bg-black'>
        <div className='flex flex-col items-start gap-2 p-2'>
          <div className='text-gray-500 text-xs dark:text-gray-400'>
            {title}
          </div>
          <div className='font-medium text-2xl'>{value}</div>
        </div>
        <div className='flex items-center justify-end p-2'>{icon}</div>
      </div>
    </div>
  )
}
