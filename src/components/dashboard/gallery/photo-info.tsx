'use client'

import '@smastrom/react-rating/style.css'

import { Rating } from '@smastrom/react-rating'
import { ChevronDownIcon, Download } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LocationMap } from '@/components/common/location-map'
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
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useAppSettings } from '@/hooks/use-settings'
import { downloadImage, getLocationFromCoordinates } from '@/lib/image'
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

  const utils = api.useUtils()
  const { mutateAsync: deleteFile } = api.photo.deleteFile.useMutation()
  const { mutateAsync: upsertPhoto } = api.photo.upsertPhoto.useMutation()
  const t = useTranslations()

  const { resolvedTheme } = useTheme()

  // Get app settings
  const { defaultPhotoRating, addressLanguage } = useAppSettings()

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>('10:30:00')
  const [isSaving, setIsSaving] = useState(false)
  const [isGeoLoading, setIsGeoLoading] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)

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

  const handleSave = async () => {
    if (!photoInfo) {
      toast.error(t('photo.no-photo-information-to-save'))
      return
    }

    setIsSaving(true)

    try {
      const photoData = {
        id: photoInfo.id,
        url: photoInfo.url,
        blurDataUrl: photoInfo.blurDataUrl || '',
        compressedUrl: photoInfo.compressedUrl || null,
        fileSize: photoInfo.fileSize || null,
        compressedSize: photoInfo.compressedSize || null,

        // Basic information - set default values
        title: photoInfo.title?.trim() || 'untitled',
        description: photoInfo.description?.trim() || t('photo.no-description'),
        rating: photoInfo.rating ?? defaultPhotoRating,
        isFavorite: photoInfo.isFavorite ?? false,
        visibility: (photoInfo.visibility as 'public' | 'private') || 'public',

        // Image dimensions - required fields
        width: photoInfo.width || 0,
        height: photoInfo.height || 0,
        aspectRatio:
          photoInfo.aspectRatio ||
          (photoInfo.width && photoInfo.height
            ? photoInfo.width / photoInfo.height
            : 1),

        // Camera information - optional fields
        make: Array.isArray(photoInfo.make)
          ? photoInfo.make.join(', ')
          : photoInfo.make || null,
        model: Array.isArray(photoInfo.model)
          ? photoInfo.model.join(', ')
          : photoInfo.model || null,
        lensModel: Array.isArray(photoInfo.lensModel)
          ? photoInfo.lensModel.join(', ')
          : photoInfo.lensModel || null,
        focalLength: photoInfo.focalLength || null,
        focalLength35mm: photoInfo.focalLength35mm || null,
        fNumber: photoInfo.fNumber || null,
        iso: photoInfo.iso || null,
        exposureTime: photoInfo.exposureTime || null,
        exposureCompensation: photoInfo.exposureCompensation || null,

        // Location information - optional fields
        latitude: photoInfo.latitude || null,
        longitude: photoInfo.longitude || null,
        gpsAltitude: photoInfo.gpsAltitude || null,
        dateTimeOriginal: photoInfo.dateTimeOriginal || null,
        country: photoInfo.country || null,
        countryCode: photoInfo.countryCode || null,
        region: photoInfo.region || null,
        city: photoInfo.city || null,
        district: photoInfo.district || null,
        fullAddress: photoInfo.fullAddress || null,
        placeFormatted: photoInfo.placeFormatted || null,
      }

      const result = await upsertPhoto({ photo: photoData })

      if (result.isUpdate) {
        toast.success(t('photo.photo-updated-successfully'))
      } else {
        toast.success(t('photo.photo-created-successfully'))
      }

      // invalidate photos list
      await utils.photo.getPhotosList.invalidate()

      setDialogOpen(false)
      setTriggerType(null)
    } catch (error) {
      console.error('Failed to save photo:', error)
      toast.error(t('photo.failed-to-save-photo'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleUseCurrentLocation = async () => {
    if (!photoInfo) return
    if (!navigator.geolocation) {
      toast.error(t('common.geolocation-not-supported'))
      return
    }
    setIsGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPhotoInfo({ ...photoInfo, latitude, longitude })
        setIsGeoLoading(false)
      },
      (err) => {
        console.error('geolocation error', err)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            toast.error(t('common.user-denied-geolocation'))
            break
          case err.POSITION_UNAVAILABLE:
            toast.error(t('common.location-information-unavailable'))
            break
          case err.TIMEOUT:
            toast.error(t('common.location-request-timed-out'))
            break
          default:
            toast.error(t('common.unknown-error-occurred'))
        }
        setIsGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  const handleReverseGeocode = async () => {
    if (!photoInfo?.latitude || !photoInfo?.longitude) {
      toast.error(t('photo.location-not-available'))
      return
    }
    setIsReverseGeocoding(true)
    try {
      const location = await getLocationFromCoordinates(
        photoInfo.latitude,
        photoInfo.longitude,
        3,
        addressLanguage,
      )
      setPhotoInfo({ ...photoInfo, ...location })
    } catch (e) {
      console.error('reverse geocode failed', e)
      toast.error(t('gallery.get-location-failed'))
    } finally {
      setIsReverseGeocoding(false)
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogContent
        className='!max-w-7xl !max-h-[90vh] flex flex-col'
        // biome-ignore lint/suspicious/noExplicitAny: need to be any
        onOpenAutoFocus={(e: any) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('photo.details')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className='flex flex-1 flex-col gap-8 overflow-y-auto px-1 py-4 lg:grid lg:grid-cols-[1fr_384px] lg:gap-12'>
          <div className='flex flex-1 flex-col space-y-5'>
            <div className='space-y-2'>
              <Label>{t('gallery.title')}</Label>
              <Input
                value={photoInfo?.title ?? ''}
                onChange={(e) => {
                  if (!photoInfo) return
                  setPhotoInfo({ ...photoInfo, title: e.target.value })
                }}
                autoFocus={false}
                placeholder={t('gallery.title')}
              />
            </div>

            <div className='space-y-2'>
              <Label>{t('gallery.description')}</Label>
              <Textarea
                placeholder={t('gallery.description')}
                value={photoInfo?.description ?? ''}
                onChange={(e) => {
                  if (!photoInfo) return
                  setPhotoInfo({ ...photoInfo, description: e.target.value })
                }}
              />
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <div className='space-y-2'>
                <Label>{t('photo.time')}</Label>
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
                        {date
                          ? date.toLocaleDateString()
                          : t('photo.select-date')}
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
                <Label>{t('gallery.visibility')}</Label>
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
                    <SelectValue placeholder={t('photo.select-visibility')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='public'>
                      {t('gallery.public')}
                    </SelectItem>
                    <SelectItem value='private'>
                      {t('gallery.private')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>{t('gallery.rating')}</Label>
                <Rating
                  style={{ maxWidth: 150, width: '100%', minWidth: 120 }}
                  value={photoInfo?.rating || defaultPhotoRating}
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
                <Label>{t('gallery.make')}</Label>
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
                  placeholder={t('photo.unknown')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('gallery.model')}</Label>
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
                  placeholder={t('photo.unknown')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('photo.lens-model')}</Label>
                <Input
                  value={photoInfo?.lensModel || ''}
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({ ...photoInfo, lensModel: e.target.value })
                  }}
                  placeholder={t('photo.unknown')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('photo.focal-length')}</Label>
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
                  placeholder={t('photo.unknown')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('photo.focal-length')} (35mm)</Label>
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
                  placeholder={t('photo.unknown')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('photo.aperture')}</Label>
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
                  placeholder={t('photo.unknown')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('photo.iso')}</Label>
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
                  placeholder={t('photo.iso')}
                />
              </div>

              <div className='space-y-2'>
                <Label>{t('photo.exposure-time')}</Label>
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
                  placeholder={t('photo.shutter-speed-placeholder')}
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
                  placeholder={t('photo.unknown')}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <div className='space-y-2'>
                <Label>{t('photo.latitude')}</Label>
                <Input
                  type='number'
                  inputMode='decimal'
                  value={
                    photoInfo?.latitude === undefined ||
                    photoInfo?.latitude === null
                      ? ''
                      : String(photoInfo.latitude)
                  }
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      latitude:
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                    })
                  }}
                />
              </div>
              <div className='space-y-2'>
                <Label>{t('photo.longitude')}</Label>
                <Input
                  type='number'
                  inputMode='decimal'
                  value={
                    photoInfo?.longitude === undefined ||
                    photoInfo?.longitude === null
                      ? ''
                      : String(photoInfo.longitude)
                  }
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      longitude:
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                    })
                  }}
                />
              </div>
              <div className='space-y-2'>
                <Label>Altitude</Label>
                <Input
                  type='number'
                  inputMode='decimal'
                  value={
                    photoInfo?.gpsAltitude === undefined ||
                    photoInfo?.gpsAltitude === null
                      ? ''
                      : String(photoInfo.gpsAltitude)
                  }
                  onChange={(e) => {
                    if (!photoInfo) return
                    setPhotoInfo({
                      ...photoInfo,
                      gpsAltitude:
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                    })
                  }}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>{t('photo.location')}</Label>
                <div className='flex items-center gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='cursor-pointer'
                    onClick={handleUseCurrentLocation}
                    disabled={isGeoLoading}
                  >
                    {isGeoLoading ? (
                      <div className='flex items-center gap-1'>
                        <Spinner className='h-3.5 w-3.5' />
                        <span>{t('photo.using-current-location')}</span>
                      </div>
                    ) : (
                      <span>{t('photo.use-current-location')}</span>
                    )}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='cursor-pointer'
                    onClick={handleReverseGeocode}
                    disabled={isReverseGeocoding}
                  >
                    {isReverseGeocoding ? (
                      <div className='flex items-center gap-1'>
                        <Spinner className='h-3.5 w-3.5' />
                        <span>{t('photo.filling-address')}</span>
                      </div>
                    ) : (
                      <span>{t('photo.fill-address-from-coordinates')}</span>
                    )}
                  </Button>
                </div>
              </div>
              <Input
                value={photoInfo?.fullAddress || t('photo.unknown')}
                onChange={(e) => {
                  if (!photoInfo) return
                  setPhotoInfo({
                    ...photoInfo,
                    fullAddress: e.target.value,
                  })
                }}
              />
              <LocationMap
                latitude={photoInfo?.latitude ?? 0}
                longitude={photoInfo?.longitude ?? 0}
                width='100%'
                height='200px'
                zoom={photoInfo?.latitude && photoInfo?.longitude ? 14 : 2}
                editable
                onChange={(coords) => {
                  if (!photoInfo) return
                  setPhotoInfo({ ...photoInfo, ...coords })
                }}
              />
              <p className='text-muted-foreground text-xs'>
                {t('photo.click-map-to-set-location')}
              </p>
            </div>
          </div>

          <div className='flex h-full w-full flex-col justify-between gap-6 lg:w-96 lg:flex-shrink-0 lg:gap-0'>
            {photoInfo?.url && (
              <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium text-sm'>
                    {t('photo.original-image')}
                  </p>
                  <Button
                    onClick={() => {
                      if (photoInfo.url) {
                        const filename = `${photoInfo.title || 'photo'}_original.jpg`
                        downloadImage(photoInfo.url, filename)
                      }
                    }}
                    variant='outline'
                    size='sm'
                    className='cursor-pointer'
                  >
                    <Download />
                  </Button>
                </div>

                <div className='relative overflow-hidden rounded-lg border'>
                  <div className='relative h-[180px] w-full overflow-hidden'>
                    <Image
                      src={photoInfo.url}
                      alt={t('photo.original-image')}
                      className='h-full w-full object-contain'
                      width={photoInfo?.width || 1200}
                      height={photoInfo?.height || 900}
                    />
                    <span className='absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 font-mono text-black text-xs backdrop-blur-sm transition-all hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/90'>
                      {photoInfo?.fileSize
                        ? `${(photoInfo.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : t('photo.unknown')}
                    </span>
                  </div>
                </div>

                <Snippet text={photoInfo?.url || t('photo.null-content')} />
              </div>
            )}

            {photoInfo?.compressedUrl && (
              <div className='mt-5 flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium text-sm'>
                    {t('photo.compressed-image')}
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      if (photoInfo.compressedUrl) {
                        const filename = `${photoInfo.title || 'photo'}_compressed.jpg`
                        downloadImage(photoInfo.compressedUrl, filename)
                      }
                    }}
                    className='cursor-pointer'
                  >
                    <Download />
                  </Button>
                </div>

                <div className='relative overflow-hidden rounded-lg border'>
                  <div className='relative h-[180px] w-full overflow-hidden'>
                    <Image
                      src={photoInfo.compressedUrl}
                      alt={t('photo.compressed-image')}
                      className='h-full w-full object-contain'
                      width={photoInfo?.width || 1200}
                      height={photoInfo?.height || 900}
                    />
                    <span className='absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 font-mono text-black text-xs backdrop-blur-sm transition-all hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/90'>
                      {photoInfo?.compressedSize
                        ? `${(photoInfo.compressedSize / 1024 / 1024).toFixed(2)} MB`
                        : t('photo.unknown')}
                    </span>
                  </div>
                </div>

                <Snippet
                  text={photoInfo?.compressedUrl || t('photo.null-content')}
                />
              </div>
            )}

            {photoInfo?.blurDataUrl && (
              <div className='mt-5 flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium text-sm'>
                    {t('photo.blur-preview')}
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      if (photoInfo.blurDataUrl) {
                        const filename = `${photoInfo.title || 'photo'}_blur.jpg`
                        downloadImage(photoInfo.blurDataUrl, filename)
                      }
                    }}
                    className='cursor-pointer'
                  >
                    <Download />
                  </Button>
                </div>

                <div className='relative overflow-hidden rounded-lg border'>
                  <div className='relative h-[180px] w-full overflow-hidden'>
                    <Image
                      src={photoInfo.blurDataUrl}
                      alt={t('photo.blur-preview')}
                      className='h-full w-full object-contain'
                      width={photoInfo?.width || 1200}
                      height={photoInfo?.height || 900}
                    />
                    <span className='absolute right-2 bottom-2 rounded-md bg-white/90 px-2 py-1 font-mono text-black text-xs backdrop-blur-sm transition-all hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/90'>
                      {photoInfo?.blurDataUrl
                        ? `${(photoInfo.blurDataUrl.length / 1024).toFixed(2)} KB`
                        : t('photo.unknown')}
                    </span>
                  </div>
                </div>

                <Snippet
                  text={photoInfo?.blurDataUrl || t('photo.null-content')}
                />
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
              disabled={isSaving}
            >
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button
            type='submit'
            className='cursor-pointer'
            onClick={handleSave}
            disabled={isSaving}
          >
            {
              <div className='flex items-center gap-1'>
                {isSaving && <Spinner />}

                {!isSaving && triggerType === 'file-upload' && (
                  <span>{t('common.save')}</span>
                )}

                {!isSaving && triggerType !== 'file-upload' && (
                  <span>{t('common.update')}</span>
                )}
              </div>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
