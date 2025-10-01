'use client'

import '@smastrom/react-rating/style.css'
import Compressor from 'compressorjs'
import ExifReader, { type Tags } from 'exifreader'
import { LoaderIcon, Upload } from 'lucide-react'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { useLocale } from 'next-intl'
import { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import {
  COMPRESS_QUALITY,
  ENABLE_FILE_COMPRESSION,
  IMAGE_SIZE_LIMIT,
} from '@/constants'
import { formatExifDateTime } from '@/lib/format'
import { generateBlurData, getLocationFromCoordinates } from '@/lib/image'
import { uploadFileWithProgress } from '@/lib/storage'
import { cn, getCompressedFileName } from '@/lib/utils'
import { usePhotoStore } from '@/stores/photo'
import { api } from '@/trpc/react'
import type { FileUploadStep, ImageLocation } from '@/types'

export function FileUpload() {
  const locale = useLocale()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [step, setStep] = useState<FileUploadStep | null>(null)
  const [progress, setProgress] = useState<number>(0)

  const { setDialogOpen, setPhotoInfo, setTriggerType } = usePhotoStore()

  const randomId = nanoid()

  const { mutateAsync: getPresignedUrl } =
    api.photo.getPresignedUrl.useMutation()

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

    setFile(file)
    const { name, type: fileType, size: fileSize } = file
    const fileNameWithoutExt = name.substring(0, name.lastIndexOf('.'))
    const fileExt = name.substring(name.lastIndexOf('.'))
    const fileName = `${fileNameWithoutExt}_${randomId}${fileExt}`

    console.info('--- 1. validate file size ---')
    setStep('upload')
    if (fileSize > IMAGE_SIZE_LIMIT) {
      toast.error(`File size exceeds ${IMAGE_SIZE_LIMIT / 1024 / 1024}MB limit`)
      return
    }

    try {
      console.info('--- 2. get presigned url and upload file ---')
      const { signedUrl, publicUrl } = await getPresignedUrl({
        fileName,
        fileType,
      })
      await uploadFileWithProgress(file, signedUrl, setProgress)
      setFile(null)

      console.info('--- 3. compress file and upload if enabled ---')
      let compressedData = { compressedUrl: '', compressedSize: 0 }
      if (ENABLE_FILE_COMPRESSION) {
        setStep('compress')
        compressedData = await new Promise<{
          compressedUrl: string
          compressedSize: number
        }>((resolve, reject) => {
          new Compressor(file, {
            quality: COMPRESS_QUALITY,
            success: async (compressedFile) => {
              try {
                const compressedFileName = getCompressedFileName(fileName)
                if (!compressedFileName) {
                  throw new Error('Failed to generate compressed file name')
                }

                const {
                  signedUrl: compressedSignedUrl,
                  publicUrl: compressedPublicUrl,
                } = await getPresignedUrl({
                  fileName: compressedFileName,
                  fileType: compressedFile.type,
                })

                await uploadFileWithProgress(
                  compressedFile as File,
                  compressedSignedUrl,
                  setProgress,
                )

                const result = {
                  compressedUrl: compressedPublicUrl,
                  compressedSize: compressedFile.size,
                }
                console.log('compressed data set:', result)
                resolve(result)
              } catch (error) {
                console.error('compress file upload failed: ', error)
                toast.error('compress file upload failed')
                reject(error)
              }
            },
            error: (err) => {
              console.log(err.message)
              reject(err)
            },
          })
        })
      }

      console.info('--- 4. generate blur data url ---')
      setStep('blur')
      let blurDataUrl = ''
      try {
        blurDataUrl = await generateBlurData(file, 20) // reduce quality for better performance
        console.log('blur data generation completed')
      } catch (error) {
        console.error('generate blur data url failed: ', error)
        toast.error('generate blur data url failed')
      }

      console.info('--- 5. parse exif data ---')
      setStep('exif')
      let exifData: Tags | null = null
      try {
        exifData = await ExifReader.load(file)
        console.log(exifData)
        console.log('exif data parsing completed')
      } catch (error) {
        console.error('parse exif data failed: ', error)
        toast.error('parse exif data failed')
      }

      console.info('--- 6. get photo location ---')
      setStep('location')
      let imageLocation: ImageLocation | null = null
      if (exifData) {
        try {
          imageLocation = await getLocationFromCoordinates(
            Number(exifData.GPSLatitude?.description),
            Number(exifData.GPSLongitude?.description),
            locale,
            3,
          )
        } catch (error) {
          console.error('get location failed: ', error)
          toast.error('get location failed')
        }
      }

      console.info('--- 7. set photo info ---')

      const newPhotoInfo = {
        // storage
        url: publicUrl,
        fileName,
        fileSize,
        // compressed
        compressedUrl: compressedData.compressedUrl,
        compressedSize: compressedData.compressedSize,
        // blur
        blurDataUrl,
        // exif
        ...(exifData && {
          width: exifData.ImageWidth?.value as number,
          height: exifData.ImageLength?.value as number,
          aspectRatio:
            (exifData.ImageWidth?.value as number) /
            (exifData.ImageLength?.value as number),
          make: exifData.Make?.value as string,
          model: exifData.Model?.value as string,
          lensModel: exifData.LensModel?.value as string,
          focalLength:
            (exifData.FocalLength?.value[0] as number) /
            (exifData.FocalLength?.value[1] as number),
          focalLength35mm: exifData.FocalLength35efl?.value as number,
          fNumber:
            (exifData.FNumber?.value[0] as number) /
            (exifData.FNumber?.value[1] as number),
          iso: exifData.ISOSpeedRatings?.value as number,
          exposureTime:
            (exifData.ExposureTime?.value[0] as number) /
            (exifData.ExposureTime?.value[1] as number),
          exposureCompensation:
            (exifData.ExposureBiasValue?.value[0] as number) /
            (exifData.ExposureBiasValue?.value[1] as number),
          latitude: Number(exifData.GPSLatitude?.description),
          longitude: Number(exifData.GPSLongitude?.description),
          gpsAltitude: Array.isArray(exifData.GPSAltitude?.value)
            ? (exifData.GPSAltitude.value[0] as number) /
              (exifData.GPSAltitude.value[1] as number)
            : undefined,
          dateTimeOriginal:
            formatExifDateTime(
              Array.isArray(exifData?.DateTimeOriginal?.value)
                ? (exifData.DateTimeOriginal.value[0] as string)
                : (exifData?.DateTimeOriginal?.value as string),
            ) || undefined,
        }),
        // location
        ...(imageLocation && {
          country: imageLocation.country,
          countryCode: imageLocation.countryCode,
          region: imageLocation.region,
          city: imageLocation.city,
          district: imageLocation.district,
          fullAddress: imageLocation.fullAddress,
          placeFormatted: imageLocation.placeFormatted,
        }),
      }

      setPhotoInfo(newPhotoInfo)

      setFile(null)
      setStep(null)
      setTriggerType('file-upload')
      setDialogOpen(true)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setStep(null)
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
      className='h-80 w-full'
      {...getRootProps()}
    >
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        whileHover='animate'
        className='group/file relative block h-full w-full cursor-pointer overflow-hidden rounded-lg p-10'
      >
        <div className='flex flex-col items-center justify-center'>
          {(step === 'upload' || step === null) && (
            <>
              <p className='relative z-20 font-bold font-sans text-base text-neutral-700 dark:text-neutral-300'>
                Upload Your Image
              </p>
              <p className='relative z-20 mt-2 font-normal font-sans text-base text-neutral-400 dark:text-neutral-400'>
                Drag or drop your image here or click to upload, max size{' '}
                {IMAGE_SIZE_LIMIT / 1024 / 1024}MB
              </p>
            </>
          )}

          <div className='relative mx-auto mt-10 w-full max-w-xl'>
            {file && (step === 'upload' || step === null) && (
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
                      {`${progress}%`}
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

            {!file && (step === 'upload' || step === null) && (
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

          <div className='absolute inset-0 z-50 flex items-center justify-center'>
            {step === 'compress' && (
              <div className='flex flex-col items-center gap-2'>
                <LoaderIcon className='animate-spin' />
                <p>Compressing file...</p>
              </div>
            )}
            {step === 'blur' && (
              <div className='flex flex-col items-center gap-2'>
                <LoaderIcon className='animate-spin' />
                <p>Generating blur data...</p>
                <p className='text-red-500'>
                  Here is a bug, process blocking, causing the loading animation
                  to stop.
                </p>
              </div>
            )}
            {step === 'exif' && (
              <div className='flex flex-col items-center gap-2'>
                <LoaderIcon className='animate-spin' />
                <p>Parsing exif data...</p>
              </div>
            )}
            {step === 'location' && (
              <div className='flex flex-col items-center gap-2'>
                <LoaderIcon className='animate-spin' />
                <p>Getting location...</p>
              </div>
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
