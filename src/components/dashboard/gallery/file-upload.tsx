'use client'

import { LoaderIcon, Upload } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { IMAGE_SIZE_LIMIT } from '@/constants'
import { getExifData } from '@/lib/exif'
import { uploadFileWithProgress } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { usePhotoStore } from '@/stores/photo'
import { api } from '@/trpc/react'
import type { FileUploadStep } from '@/types'

export function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<FileUploadStep | null>(null)
  const [progress, setProgress] = useState<number>(0)

  const { setDialogOpen, setPhotoInfo, setTriggerType } = usePhotoStore()

  const { mutateAsync: getPresignedUrl } =
    api.upload.getPresignedUrl.useMutation()

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]!)
      }
    },
    onDropRejected: (error) => {
      console.log(error)
    },
  })

  // todo: support batch upload
  const handleFileChange = async (file: File) => {
    if (!file) return

    // 0. prepare file data
    setFile(file)
    const { name: fileName, type: fileType, size: fileSize } = file

    // 1. validate file size
    if (fileSize > IMAGE_SIZE_LIMIT) {
      toast.error(`File size exceeds ${IMAGE_SIZE_LIMIT / 1024 / 1024}MB limit`)
      return
    }

    try {
      setStep('upload')
      setProgress(0)

      // 2. get presigned and public url
      const { signedUrl, publicUrl } = await getPresignedUrl({
        fileName,
        fileType,
      })

      // 3. upload file
      await uploadFileWithProgress(file, signedUrl, setProgress)
      setStep('processing')

      // 4. get exif data and set photo info
      const exifData = await getExifData(file)
      console.log(exifData)
      setPhotoInfo({
        name: fileName,
        size: fileSize,
        type: fileType,
        url: publicUrl,
      })

      setFile(null)
      setStep('success')
      setTriggerType('file-upload')
      setDialogOpen(true)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setStep('failed')
      setFile(null)
      setProgress(0)
      console.error(error)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div
      className='h-[330px] w-full'
      {...getRootProps()}
    >
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        whileHover='animate'
        className='group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='relative z-20 font-bold font-sans text-base text-neutral-700 dark:text-neutral-300'>
            Upload Your Image
          </p>
          <p className='relative z-20 mt-2 font-normal font-sans text-base text-neutral-400 dark:text-neutral-400'>
            Drag or drop your image here or click to upload, max size{' '}
            {IMAGE_SIZE_LIMIT / 1024 / 1024}MB
          </p>

          <div className='relative mx-auto mt-10 w-full max-w-xl'>
            {file && (
              <div className='flex flex-col items-center justify-center gap-4'>
                <Progress
                  value={progress}
                  className='z-50 w-4/5'
                />
                <motion.div
                  layoutId='file-upload'
                  className={cn(
                    'relative z-40 mx-auto mt-4 p-4 md:h-24',
                    'flex w-full flex-col items-start justify-start',
                    'overflow-hidden rounded-md bg-white shadow-sm dark:bg-neutral-900',
                  )}
                >
                  <div className='flex w-full items-center justify-between gap-4'>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className='max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300'
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      <p>{`${progress}%`}</p>
                    </motion.p>
                  </div>

                  <div
                    className={cn(
                      'flex w-full flex-col items-start justify-between md:flex-row md:items-center',
                      'mt-2 text-neutral-600 text-sm dark:text-neutral-400',
                    )}
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className='rounded-md bg-gray-100 px-1 py-0.5 dark:bg-neutral-800'
                    >
                      {file.type}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className={cn(
                        'w-fit flex-shrink-0 rounded-lg px-2 py-1 text-sm shadow-input',
                        'text-neutral-600 dark:bg-neutral-800 dark:text-white',
                      )}
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            )}

            {file && step === 'processing' && (
              <div className='flex items-center gap-2'>
                <LoaderIcon className='animate-spin' />
                <p>Parsing file...</p>
              </div>
            )}

            {!file && (
              <motion.div
                layoutId='file-upload'
                variants={{
                  initial: {
                    x: 0,
                    y: 0,
                  },
                  animate: {
                    x: 20,
                    y: -20,
                    opacity: 0.9,
                  },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  'relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center',
                  'rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] group-hover/file:shadow-2xl dark:bg-neutral-900',
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex flex-col items-center text-neutral-600'
                  >
                    Drop it
                    <Upload className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                  </motion.p>
                ) : (
                  <Upload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
                )}
              </motion.div>
            )}

            {!file && (
              <motion.div
                variants={{
                  initial: {
                    opacity: 0,
                  },
                  animate: {
                    opacity: 1,
                  },
                }}
                className={cn(
                  'absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center',
                  'rounded-md border border-sky-400 border-dashed bg-transparent opacity-0',
                )}
              />
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          id='file-upload-handle'
          type='file'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileChange(file)
          }}
          className='hidden'
        />

        <div className='absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]'>
          <GridPattern />
        </div>
      </motion.div>
    </div>
  )
}

export function GridPattern() {
  const columns = 41
  const rows = 11
  return (
    <div
      className={cn(
        'flex flex-shrink-0 flex-wrap items-center justify-center gap-x-px gap-y-px',
        'scale-105 bg-gray-100 dark:bg-neutral-900',
      )}
    >
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col
          return (
            <div
              key={`${col}-${String(row)}`}
              className={`flex h-10 w-10 flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? 'bg-gray-50 dark:bg-neutral-950'
                  : 'bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:bg-neutral-950 dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]'
              }`}
            />
          )
        }),
      )}
    </div>
  )
}
