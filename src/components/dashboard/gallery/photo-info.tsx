'use client'

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
  const { photoInfo, dialogOpen, setDialogOpen, triggerType, setTriggerType } =
    usePhotoStore()
  const { mutateAsync: deleteFile } = api.upload.deleteFile.useMutation()

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
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{photoInfo?.title ?? 'Untitled'}</DialogTitle>
          <DialogDescription>{photoInfo?.url}</DialogDescription>
        </DialogHeader>

        {photoInfo?.blurDataUrl && (
          // biome-ignore lint/performance/noImgElement: blur image
          <img
            src={photoInfo?.blurDataUrl}
            alt='blur data'
            className='aspect-video h-[200px] object-cover'
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
