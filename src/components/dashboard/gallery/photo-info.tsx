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
import { usePhotoStore } from '@/stores/photo'
import { api } from '@/trpc/react'

export function PhotoInfo() {
  const { photoInfo, dialogOpen, setDialogOpen, triggerType, setTriggerType } =
    usePhotoStore()
  const { mutateAsync: deleteFile } = api.upload.deleteFile.useMutation()

  const handleCancel = async () => {
    if (triggerType === 'file-upload') {
      await deleteFile({ key: photoInfo?.name! })
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
          <DialogTitle>{photoInfo?.name}</DialogTitle>
          <DialogDescription>{photoInfo?.url}</DialogDescription>
        </DialogHeader>

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
