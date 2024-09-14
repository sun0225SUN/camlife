"use client"

import { upload } from "@vercel/blob/client"
import Image from "next/image"
import { useRef, useState, type FormEvent } from "react"
import { ExifParserFactory } from "ts-exif-parser"
import { api } from "~/trpc/react"
import { type ImageMetaData } from "~/types/photo"

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [imageMetaData, setImageMetaData] = useState<ImageMetaData | null>(null)
  const genBlurData = api.photos.genBlurData.useMutation()
  const createPhoto = api.photos.createPhoto.useMutation()
  const compressImage = api.photos.compressImage.useMutation()

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
      console.log(exifData)
      const base64Data = Buffer.from(buffer).toString("base64")

      const compressedImage = await compressImage.mutateAsync({
        data: base64Data,
      })

      const blurData = await genBlurData.mutateAsync({
        data: compressedImage,
        isBase64: true,
      })

      const compressedImageBuffer = Buffer.from(
        compressedImage.split(",")[1] ?? "",
        "base64",
      )
      const compressedImageBlob = new Blob([compressedImageBuffer], {
        type: "image/webp",
      })

      const { url } = await upload(
        file.name.replace(/\.\w+$/, ".webp"),
        compressedImageBlob,
        {
          access: "public",
          handleUploadUrl: "/api/storage/vercel-blob",
        },
      )

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
    <div className="flex w-full flex-col items-center rounded-lg bg-white p-6 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-semibold">头像上传</h1>
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
          解析
        </button>
      </form>
      <button
        onClick={handleUpload}
        className="mt-4 w-full max-w-md rounded bg-green-500 p-3 text-white transition duration-200 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500"
      >
        上传
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
    </div>
  )
}
