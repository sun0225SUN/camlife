"use client"

import { upload } from "@vercel/blob/client"
import Image from "next/image"
import { useRef, useState, type FormEvent } from "react"
import { ExifParserFactory } from "ts-exif-parser"
import { api } from "~/trpc/react"

interface ImageMetaData {
  url: string
  width: number
  height: number
  blurData: string
  aspectRatio: number
  focalLength: number
  focalLengthIn35mmFormat: number
  fNumber: number
  iso: number
  exposureTime: number
  exposureCompensation: number
  latitude: number
  longitude: number
  locationName: string
  filmSimulation: string
  priorityOrder: number
  takenAt: Date
  takenAtNaive: string
  hidden: boolean
  extension: string
  title: string
  caption: string
  semanticDescription: string
  tags: string[]
  make: string
  model: string
  lensMake: string
  lensModel: string
}

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [imageMetaData, setImageMetaData] = useState<ImageMetaData | null>(null)
  const genBlurData = api.photos.genBlurData.useMutation()
  const createPhoto = api.photos.createPhoto.useMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const file = inputFileRef.current?.files?.[0]
    if (!file) {
      console.error("未选择文件")
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const exifData = ExifParserFactory.create(buffer).parse()
      const base64Data = Buffer.from(buffer).toString("base64")
      const blurData = await genBlurData.mutateAsync({
        data: base64Data,
        isBase64: true,
      })

      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/storage/vercel-blob",
      })

      setImageMetaData({
        url,
        blurData,
        width: exifData.imageSize?.width ?? 0,
        height: exifData.imageSize?.height ?? 0,
        extension: file.name.split(".").pop() ?? "",
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
      console.error("文件处理错误:", error)
    }
  }

  const handleUpload = async () => {
    if (imageMetaData) {
      await createPhoto.mutateAsync(imageMetaData)
    } else {
      console.error("imageMetaData 为空，无法上传")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          required
          accept="image/*"
        />
        <button type="submit">解析</button>
      </form>

      <button onClick={handleUpload}>上传</button>
      {imageMetaData && (
        <Image
          src={imageMetaData.url}
          alt="avatar"
          width={200}
          height={112}
          placeholder="blur"
          blurDataURL={imageMetaData.blurData}
        />
      )}
    </>
  )
}
