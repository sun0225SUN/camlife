"use client"

import { nanoid } from "nanoid"
import Image from "next/image"
import { useRef, useState, type FormEvent } from "react"
import { ExifParserFactory } from "ts-exif-parser"
import { api } from "~/trpc/react"
import { type ImageMetaData } from "~/types/photo"

const CHUNK_SIZE = 3 * 1024 * 1024 // 3MB

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [imageMetaData, setImageMetaData] = useState<ImageMetaData | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const uploadChunk = api.photos.uploadChunk.useMutation()
  const finalizeUpload = api.photos.finalizeUpload.useMutation()
  const createPhoto = api.photos.createPhoto.useMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const file = inputFileRef.current?.files?.[0]
    if (!file) {
      console.error("No file selected")
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const exifData = ExifParserFactory.create(buffer).parse()

      const totalChunks = Math.ceil(buffer.byteLength / CHUNK_SIZE)

      const uploadId = nanoid()

      for (let i = 0; i < totalChunks; i++) {
        const chunk = buffer.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
        const chunkBase64 = Buffer.from(chunk).toString("base64")

        await uploadChunk.mutateAsync({
          uploadId,
          chunkIndex: i,
          chunk: chunkBase64,
        })

        setUploadProgress(((i + 1) / totalChunks) * 100)
      }

      const { url, blurData } = await finalizeUpload.mutateAsync({ uploadId })

      setImageMetaData({
        url,
        blurData,
        width: exifData.imageSize?.width ?? 0,
        height: exifData.imageSize?.height ?? 0,
        aspectRatio:
          (exifData.imageSize?.width ?? 0) / (exifData.imageSize?.height ?? 1),
        title: "",
        caption: "",
        semanticDescription: "",
        tags: [],
        make: exifData.tags?.Make ?? "",
        model: exifData.tags?.Model ?? "",
        focalLength: Number(exifData.tags?.FocalLength) || 0,
        focalLengthIn35mmFormat:
          Number(exifData.tags?.FocalLengthIn35mmFormat) || 0,
        lensMake: exifData.tags?.LensMake ?? "",
        lensModel: exifData.tags?.LensModel ?? "",
        fNumber: Number(exifData.tags?.FNumber) || 0,
        iso: Number(exifData.tags?.ISO) || 0,
        exposureTime: Number(exifData.tags?.ExposureTime) || 0,
        exposureCompensation: Number(exifData.tags?.ExposureCompensation) || 0,
        locationName: "",
        latitude: Number(exifData.tags?.GPSLatitude) || 0,
        longitude: Number(exifData.tags?.GPSLongitude) || 0,
        filmSimulation: "",
        priorityOrder: 0,
        takenAt: new Date(exifData.tags?.DateTimeOriginal ?? Date.now()),
        takenAtNaive: exifData.tags?.DateTimeOriginal?.toString() ?? "",
        hidden: false,
      })
    } catch (error) {
      console.error("File processing error:", error)
      setUploadProgress(0)
    }
  }

  const handleUpload = async () => {
    if (imageMetaData) {
      await createPhoto.mutateAsync(imageMetaData)
    } else {
      console.error("imageMetaData is empty, cannot upload")
    }
  }

  return (
    <div className="flex w-full flex-col items-center rounded-lg bg-white p-6 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-semibold">Avatar Upload</h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col items-center space-y-4"
      >
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          required
          accept="image/*"
          className="w-full rounded border border-gray-300 bg-gray-100 p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-3 text-white transition duration-200 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Parse
        </button>
      </form>
      <button
        onClick={handleUpload}
        className="mt-4 w-full max-w-md rounded bg-green-500 p-3 text-white transition duration-200 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
      >
        Upload
      </button>

      {imageMetaData && (
        <div className="mt-4 w-full max-w-md">
          <Image
            src={imageMetaData.url}
            alt="avatar"
            sizes="100vw"
            width={0}
            height={0}
            style={{ width: "auto", height: "auto" }}
            placeholder="blur"
            blurDataURL={imageMetaData.blurData}
            className="transform rounded shadow-lg transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4 w-full max-w-md">
          <progress value={uploadProgress} max="100" className="w-full" />
          <p>{Math.round(uploadProgress)}% Uploaded</p>
        </div>
      )}
    </div>
  )
}
