import { Aperture, Telescope, Timer } from 'lucide-react'
import ISO from '@/assets/images/iso.svg'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatExposureTime } from '@/lib/format'
import type { Photo } from '@/server/db/schema/photos'
import { InfoItem } from './photo-info-item'

interface PhotoExifProps {
  photo: Photo
}

export const PhotoExif = ({ photo }: PhotoExifProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <InfoItem title='Exif Info'>
        <div className='flex cursor-pointer gap-4'>
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
        </div>
      </InfoItem>
    </PopoverTrigger>
    <PopoverContent>
      <PhotoExifContent photo={photo} />
    </PopoverContent>
  </Popover>
)

export function PhotoExifContent({ photo }: PhotoExifProps) {
  return (
    <div className='grid w-full grid-cols-2 gap-4'>
      <ExifCard
        title='Focal Length'
        value={photo.focalLength35mm ? `${photo.focalLength35mm}mm` : 'unknown'}
        icon={<Telescope className='size-7' />}
      />
      <ExifCard
        title='Aperture'
        value={photo.fNumber ? `ƒ/${photo.fNumber}` : 'unknown'}
        icon={<Aperture className='size-7' />}
      />
      <ExifCard
        title='Shutter Speed'
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
