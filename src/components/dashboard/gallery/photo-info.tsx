'use client'

import '@smastrom/react-rating/style.css'

import { Rating } from '@smastrom/react-rating'
import { ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { LocationMap } from '@/components/dashboard/gallery/location-map'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Snippet } from '@/components/ui/snippet'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_PHOTO_RATING } from '@/constants'
import { getCompressedFileName } from '@/lib/utils'
import { usePhotoStore } from '@/stores/photo'
import { api } from '@/trpc/react'

export function PhotoInfo() {
  const {
    photoInfo,
    dialogOpen,
    setDialogOpen,
    triggerType,
    setTriggerType,
    setPhotoInfo,
  } = usePhotoStore()
  const { mutateAsync: deleteFile } = api.upload.deleteFile.useMutation()
  const { resolvedTheme } = useTheme()

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>('10:30:00')

  useEffect(() => {
    console.log(photoInfo)
  }, [photoInfo])

  useEffect(() => {
    if (photoInfo?.dateTimeOriginal) {
      setDate(photoInfo.dateTimeOriginal)
      setTime(photoInfo.dateTimeOriginal.toTimeString().slice(0, 8))
    }
  }, [photoInfo?.dateTimeOriginal])

  const updateDateTime = (newDate?: Date, newTime?: string) => {
    if (!photoInfo) return

    const currentDate = newDate || date
    const currentTime = newTime || time

    if (currentDate && currentTime) {
      const [hours, minutes, seconds] = currentTime.split(':').map(Number)
      const dateTime = new Date(currentDate)
      dateTime.setHours(hours || 0, minutes || 0, seconds || 0)

      setPhotoInfo({
        ...photoInfo,
        dateTimeOriginal: dateTime,
      })
    }
  }

  const handleCancel = async () => {
    if (triggerType === 'file-upload') {
      await deleteFile({ key: photoInfo?.fileName! })
      await deleteFile({ key: getCompressedFileName(photoInfo?.fileName!)! })
    }

    setDialogOpen(false)
    setTriggerType(null)
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger>Open</DialogTrigger>

      <DialogContent
        className='!max-w-7xl !max-h-[90vh] flex flex-col'
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Photo Info</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className='flex flex-1 flex-col gap-8 overflow-y-auto px-1 py-4 lg:grid lg:grid-cols-[1fr_384px] lg:gap-12'>
          <div className='flex flex-1 flex-col space-y-5'>
            <div className='space-y-2'>
              <Label>Title</Label>
              <Input
                value={photoInfo?.title || 'untitled'}
                onChange={(e) => {
                  if (!photoInfo) return
                  setPhotoInfo({ ...photoInfo, title: e.target.value })
                }}
                autoFocus={false}
              />
            </div>

            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea
                placeholder='Type your message here.'
                value={photoInfo?.description || 'No description'}
                onChange={(e) => {
                  if (!photoInfo) return
                  setPhotoInfo({ ...photoInfo, description: e.target.value })
                }}
              />
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <div className='space-y-2'>
                <Label>Capture Time</Label>
                <div className='flex gap-4'>
                  <Popover
                    open={open}
                    onOpenChange={setOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        id='date-picker'
                        className={`w-32 justify-between font-normal ${!date ? 'text-muted-foreground' : ''}`}
                      >
                        {date ? date.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto overflow-hidden p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={date}
                        captionLayout='dropdown'
                        onSelect={(selectedDate) => {
                          setDate(selectedDate)
                          updateDateTime(selectedDate, time)
                          setOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type='time'
                    id='time-picker'
                    step='1'
                    value={time}
                    onChange={(e) => {
                      const newTime = e.target.value
                      setTime(newTime)
                      updateDateTime(date, newTime)
                    }}
                    className='w-24 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label>Visibility</Label>
                <Select
                  value={photoInfo?.visibility || 'public'}
                  onValueChange={(value) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      visibility: value as 'public' | 'private',
                    })
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select visibility' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='public'>Public</SelectItem>
                    <SelectItem value='private'>Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Rating</Label>
                <Rating
                  style={{ maxWidth: 150, width: '100%', minWidth: 120 }}
                  value={photoInfo?.rating || DEFAULT_PHOTO_RATING}
                  onChange={(value: number) => {
                    if (!photoInfo) return
                    setPhotoInfo({ ...photoInfo, rating: value })
                  }}
                  items={5}
                  spaceBetween='medium'
                  className='flex-shrink-0'
                  itemStyles={{
                    itemShapes: (
                      <path d='M62.799,23.737c-0.47-1.399-1.681-2.419-3.139-2.642l-16.969-2.593L35.069,2.265 C34.419,0.881,33.03,0,31.504,0c-1.527,0-2.915,0.881-3.565,2.265l-7.623,16.238L3.347,21.096c-1.458,0.223-2.669,1.242-3.138,2.642 c-0.469,1.4-0.115,2.942,0.916,4l12.392,12.707l-2.935,17.977c-0.242,1.488,0.389,2.984,1.62,3.854 c1.23,0.87,2.854,0.958,4.177,0.228l15.126-8.365l15.126,8.365c0.597,0.33,1.254,0.492,1.908,0.492c0.796,0,1.592-0.242,2.269-0.72 c1.231-0.869,1.861-2.365,1.619-3.854l-2.935-17.977l12.393-12.707C62.914,26.68,63.268,25.138,62.799,23.737z'></path>
                    ),
                    activeFillColor:
                      resolvedTheme === 'dark' ? '#ffd700' : '#ff9500',
                    inactiveFillColor:
                      resolvedTheme === 'dark' ? '#3f3f46' : '#d4d4d8',
                  }}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <div className='space-y-2'>
                <Label>Camera Make</Label>
                <Input
                  value={
                    Array.isArray(photoInfo?.make)
                      ? photoInfo.make.join(', ')
                      : photoInfo?.make || ''
                  }
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({ ...photoInfo, make: e.target.value })
                  }}
                  placeholder='Unknown'
                />
              </div>

              <div className='space-y-2'>
                <Label>Camera Model</Label>
                <Input
                  value={
                    Array.isArray(photoInfo?.model)
                      ? photoInfo.model.join(', ')
                      : photoInfo?.model || ''
                  }
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({ ...photoInfo, model: e.target.value })
                  }}
                  placeholder='Unknown'
                />
              </div>

              <div className='space-y-2'>
                <Label>Lens Model</Label>
                <Input
                  value={photoInfo?.lensModel || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({ ...photoInfo, lensModel: e.target.value })
                  }}
                  placeholder='Unknown'
                />
              </div>

              <div className='space-y-2'>
                <Label>Focal Length (mm)</Label>
                <Input
                  type='number'
                  value={photoInfo?.focalLength || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      focalLength: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }}
                  placeholder='Unknown'
                />
              </div>

              <div className='space-y-2'>
                <Label>35mm Equivalent (mm)</Label>
                <Input
                  type='number'
                  value={photoInfo?.focalLength35mm || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      focalLength35mm: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }}
                  placeholder='Unknown'
                />
              </div>

              <div className='space-y-2'>
                <Label>Aperture (f/)</Label>
                <Input
                  type='number'
                  step='0.1'
                  value={photoInfo?.fNumber || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      fNumber: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }}
                  placeholder='Unknown'
                />
              </div>

              <div className='space-y-2'>
                <Label>ISO</Label>
                <Input
                  type='number'
                  value={photoInfo?.iso || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      iso: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }}
                  placeholder='ISO Value'
                />
              </div>

              <div className='space-y-2'>
                <Label>Shutter Speed (1/s)</Label>
                <Input
                  type='number'
                  value={
                    photoInfo?.exposureTime
                      ? Math.round(1 / photoInfo.exposureTime)
                      : ''
                  }
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      exposureTime: e.target.value
                        ? 1 / Number(e.target.value)
                        : undefined,
                    })
                  }}
                  placeholder='Shutter Speed (1/s)'
                />
              </div>

              <div className='space-y-2'>
                <Label>Exposure Compensation (EV)</Label>
                <Input
                  type='number'
                  step='0.1'
                  value={photoInfo?.exposureCompensation || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      exposureCompensation: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }}
                  placeholder='Unknown'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <div className='space-y-2'>
                <Label>Latitude</Label>
                <Input
                  value={photoInfo?.latitude || 'Unknown'}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      latitude: Number(e.target.value),
                    })
                  }}
                />
              </div>
              <div className='space-y-2'>
                <Label>Longitude</Label>
                <Input
                  value={photoInfo?.longitude || 'Unknown'}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      longitude: Number(e.target.value),
                    })
                  }}
                />
              </div>
              <div className='space-y-2'>
                <Label>Altitude</Label>
                <Input
                  value={photoInfo?.gpsAltitude || 'Unknown'}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      gpsAltitude: Number(e.target.value),
                    })
                  }}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Address</Label>
              <Input
                value={photoInfo?.fullAddress || 'Unknown'}
                onChange={(e) => {
                  if (!photoInfo) return
                  setPhotoInfo({
                    ...photoInfo,
                    fullAddress: e.target.value,
                  })
                }}
              />
              <LocationMap
                latitude={photoInfo?.latitude || 0}
                longitude={photoInfo?.longitude || 0}
                width='100%'
                height='200px'
              />
            </div>
          </div>

          <div className='flex h-full w-full flex-col justify-between gap-6 lg:w-96 lg:flex-shrink-0 lg:gap-0'>
            {photoInfo?.url && (
              <div className='flex flex-col gap-3'>
                <p className='font-medium text-sm'>Original</p>

                <div className='relative overflow-hidden rounded-lg border'>
                  <div className='relative h-[180px] w-full overflow-hidden'>
                    <Image
                      src={photoInfo.url}
                      alt='Original Image'
                      className='h-full w-full object-contain'
                      width={photoInfo?.width}
                      height={photoInfo?.height}
                    />
                    <span className='absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 font-mono text-black text-xs backdrop-blur-sm transition-all hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/90'>
                      {photoInfo?.fileSize
                        ? `${(photoInfo.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : 'Unknown'}
                    </span>
                  </div>
                </div>

                <Snippet text={photoInfo?.url || 'Null Content'} />
              </div>
            )}

            {photoInfo?.compressedUrl && (
              <div className='flex flex-col gap-3'>
                <p className='font-medium text-sm'>Compressed</p>

                <div className='relative overflow-hidden rounded-lg border'>
                  <div className='relative h-[180px] w-full overflow-hidden'>
                    <Image
                      src={photoInfo.compressedUrl}
                      alt='Compressed Image'
                      className='h-full w-full object-contain'
                      width={photoInfo?.width}
                      height={photoInfo?.height}
                    />
                    <span className='absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 font-mono text-black text-xs backdrop-blur-sm transition-all hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/90'>
                      {photoInfo?.compressedSize
                        ? `${(photoInfo.compressedSize / 1024 / 1024).toFixed(2)} MB`
                        : 'Unknown'}
                    </span>
                  </div>
                </div>

                <Snippet text={photoInfo?.compressedUrl || 'Null Content'} />
              </div>
            )}

            {photoInfo?.blurDataUrl && (
              <div className='flex flex-col gap-3'>
                <p className='font-medium text-sm'>BlurHash</p>

                <div className='relative overflow-hidden rounded-lg border'>
                  <div className='relative h-[180px] w-full overflow-hidden'>
                    <Image
                      src={photoInfo.blurDataUrl}
                      alt='Blur Preview'
                      className='h-full w-full object-contain'
                      width={photoInfo?.width}
                      height={photoInfo?.height}
                    />
                    <span className='absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 font-mono text-black text-xs backdrop-blur-sm transition-all hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/90'>
                      {photoInfo?.blurDataUrl
                        ? `${(photoInfo.blurDataUrl.length / 1024).toFixed(2)} KB`
                        : 'Unknown'}
                    </span>
                  </div>
                </div>

                <Snippet text={photoInfo?.blurDataUrl || 'Null Content'} />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='mt-4 flex-shrink-0'>
          <DialogClose asChild>
            <Button
              variant='outline'
              className='cursor-pointer'
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            className='cursor-pointer'
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
