import { useTranslations } from 'next-intl'
import { LocationMap } from '@/components/common/location-map'
import { InfoItem } from '@/components/gallery/photo-info-item'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatLatitude, formatLongitude } from '@/lib/format/coordinates'
import type { Photo } from '@/server/db/schema/photos'

interface PhotoLocationProps {
  photo: Photo
}

export function PhotoLocation({ photo }: PhotoLocationProps) {
  const t = useTranslations('PhotoInfo')
  return (
    <Popover>
      <PopoverTrigger asChild>
        <InfoItem title={t('location')}>
          <p className='max-w-100 overflow-x-hidden text-ellipsis whitespace-nowrap pl-1 text-center'>
            {photo.city && photo.region && photo.country
              ? `${photo.city} , ${photo.region} , ${photo.country}`
              : t('locationNotAvailable')}
          </p>
        </InfoItem>
      </PopoverTrigger>
      <PopoverContent className='w-auto'>
        <PhotoLocationContent photo={photo} />
      </PopoverContent>
    </Popover>
  )
}

export function PhotoLocationContent({ photo }: PhotoLocationProps) {
  const t = useTranslations('PhotoInfo')
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-center space-y-2'>
        <p className='max-w-60 overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium text-lg'>
          {photo.city && photo.region && photo.country
            ? `${photo.city} , ${photo.region}`
            : t('locationNotAvailable')}
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
          <div className='font-medium text-gray-900 dark:text-gray-100'>
            {formattedValue}
          </div>
        </div>
      </div>
    </div>
  )
}
