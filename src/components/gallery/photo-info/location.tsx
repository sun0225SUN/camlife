import { useTranslations } from 'next-intl'
import { LocationMap } from '@/components/common/location-map'
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
import { formatLatitude, formatLongitude } from '@/lib/format/coordinates'
import type { Photo } from '@/server/db/schema/photos'

interface PhotoLocationProps {
  photo: Photo
}

export function PhotoLocation({ photo }: PhotoLocationProps) {
  const t = useTranslations('photo')
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <InfoItem title={t('location')}>
            <PhotoLocationTrigger photo={photo} />
          </InfoItem>
        </DrawerTrigger>
        <DrawerContent className='max-h-[60vh] overflow-y-auto p-4'>
          <DrawerHeader>
            <DrawerTitle>{t('location')}</DrawerTitle>
          </DrawerHeader>
          <PhotoLocationContent photo={photo} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InfoItem title={t('location')}>
          <PhotoLocationTrigger photo={photo} />
        </InfoItem>
      </PopoverTrigger>
      <PopoverContent className='w-auto'>
        <PhotoLocationContent photo={photo} />
      </PopoverContent>
    </Popover>
  )
}

export function PhotoLocationTrigger({ photo }: PhotoLocationProps) {
  const t = useTranslations('photo')
  return (
    <p className='max-w-100 overflow-x-hidden text-ellipsis whitespace-nowrap pl-1 text-center'>
      {photo.city && photo.region && photo.country
        ? `${photo.city} , ${photo.region} , ${photo.country}`
        : t('location-not-available')}
    </p>
  )
}

export function PhotoLocationContent({ photo }: PhotoLocationProps) {
  const t = useTranslations('photo')
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-center space-y-2'>
        <p className='max-w-60 overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium text-lg'>
          {photo.city && photo.region && photo.country
            ? `${photo.city} , ${photo.region}`
            : t('location-not-available')}
        </p>
        <LocationMap
          latitude={photo.latitude ?? 0}
          longitude={photo.longitude ?? 0}
          width='100%'
          height='100px'
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <CoordinateCard
          label={t('latitude')}
          value={photo.latitude ?? 0}
          formattedValue={formatLatitude(photo.latitude ?? 0)}
        />
        <CoordinateCard
          label={t('longitude')}
          value={photo.longitude ?? 0}
          formattedValue={formatLongitude(photo.longitude ?? 0)}
        />
      </div>
    </div>
  )
}

interface CoordinateCardProps {
  label: string
  value: number
  formattedValue: string
}

function CoordinateCard({ label, formattedValue }: CoordinateCardProps) {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex w-40 flex-1 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-2 text-sm md:w-36 dark:border-gray-800 dark:bg-black'>
        <div className='flex flex-col items-start gap-2 p-2'>
          <div className='text-gray-500 text-xs dark:text-gray-400'>
            {label}
          </div>
          <div className='font-medium text-lg'>{formattedValue}</div>
        </div>
      </div>
    </div>
  )
}
