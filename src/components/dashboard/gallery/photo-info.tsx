'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
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

  const mockInfoData = {
    title: 'Mock Title',
    description: 'Mock Description',
    url: 'https://pub-ba8dd75c4c7c41a2beb5edc1845d2275.r2.dev/camlife/IMG_20240909_194417_6z9DU-_LqMYNaZRSQ2K75.jpg',
    fileName: 'mock.jpg',
    fileSize: 1000,
    blurDataUrl:
      'data:image/webp;base64,UklGRkgCAABXRUJQVlA4WAoAAAAgAAAAHwAAHwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggWgAAANADAJ0BKiAAIAA/LX65U7+oJiKwDAPwJYlkALszhP/4N/86XbcoAAD+zZHZsLzHkXEPK315wt18157XNrBcrXgNoJnlXppfhrvk08Bd2sHDJALYcy09+/gAAA==',
    compressedUrl:
      'https://pub-ba8dd75c4c7c41a2beb5edc1845d2275.r2.dev/camlife/IMG_20240909_194417_6z9DU-_LqMYNaZRSQ2K75_compressed.jpg',
    compressedSize: 1000,
    width: 1000,
    height: 1000,
    aspectRatio: 1,
    make: 'Mock Make',
    model: 'Mock Model',
    lensModel: 'Mock Lens Model',
    focalLength: 1000,
    focalLength35mm: 1000,
    fNumber: 1000,
    iso: 1000,
    exposureTime: 1000,
    exposureCompensation: 1000,
    latitude: 1000,
    longitude: 1000,
    gpsAltitude: 1000,
    dateTimeOriginal: '2021-01-01',
    country: 'Mock Country',
    countryCode: 'Mock Country Code',
    region: 'Mock Region',
    city: 'Mock City',
    district: 'Mock District',
    fullAddress: 'Mock Full Address',
    placeFormatted: 'Mock Place Formatted',
    rating: 1000,
    isFavorite: true,
    visibility: 'public',
  }

  useEffect(() => {
    setPhotoInfo(mockInfoData)
  }, [setPhotoInfo])

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
        className='!max-w-7xl'
        // onPointerDownOutside={(e) => e.preventDefault()}
        // onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Photo Info</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {photoInfo?.blurDataUrl && (
          // biome-ignore lint/performance/noImgElement: blur image
          <img
            src={photoInfo?.blurDataUrl}
            alt='blur data'
            className='aspect-video h-[200px] object-cover'
          />
        )}
        {photoInfo?.url && (
          <Image
            src={photoInfo?.url}
            alt='photo'
            className='aspect-video h-[200px] object-cover'
            width={photoInfo?.width}
            height={photoInfo?.height}
          />
        )}
        {photoInfo?.compressedUrl && (
          <Image
            src={photoInfo?.compressedUrl}
            alt='photo'
            className='aspect-video h-[200px] object-cover'
            width={photoInfo?.width}
            height={photoInfo?.height}
          />
        )}
        <p>{photoInfo?.description}</p>
        <p>{photoInfo?.url}</p>
        <p>{photoInfo?.fileSize}</p>
        <p>{photoInfo?.compressedUrl}</p>
        <p>{photoInfo?.compressedSize}</p>
        <div className='flex'>
          <p>{photoInfo?.width}</p>
          <p>{photoInfo?.height}</p>
          <p>{photoInfo?.aspectRatio}</p>
          <p>{photoInfo?.make}</p>
          <p>{photoInfo?.model}</p>
          <p>{photoInfo?.lensModel}</p>
          <p>{photoInfo?.focalLength}</p>
          <p>{photoInfo?.focalLength35mm}</p>
          <p>{photoInfo?.fNumber}</p>
          <p>{photoInfo?.iso}</p>
          <p>{photoInfo?.exposureTime}</p>
          <p>{photoInfo?.exposureCompensation}</p>
          <p>{photoInfo?.latitude}</p>
          <p>{photoInfo?.longitude}</p>
          <p>{photoInfo?.gpsAltitude}</p>
          <p>{photoInfo?.dateTimeOriginal}</p>
          <p>{photoInfo?.country}</p>
          <p>{photoInfo?.countryCode}</p>
          <p>{photoInfo?.region}</p>
          <p>{photoInfo?.city}</p>
          <p>{photoInfo?.district}</p>
          <p>{photoInfo?.fullAddress}</p>
          <p>{photoInfo?.placeFormatted}</p>
          <p>{photoInfo?.rating}</p>
          <p>{photoInfo?.isFavorite}</p>
          <p>{photoInfo?.visibility}</p>
        </div>
        <p>{photoInfo?.country}</p>
        <p>{photoInfo?.countryCode}</p>
        <p>{photoInfo?.region}</p>
        <p>{photoInfo?.city}</p>
        <p>{photoInfo?.district}</p>
        <p>{photoInfo?.fullAddress}</p>
        <p>{photoInfo?.placeFormatted}</p>
        <DialogFooter>
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
