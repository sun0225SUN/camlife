"use client"

import clsx from "clsx"
import { format } from "date-fns"
import { Calendar as CalendarIcon, CircleHelp } from "lucide-react"
import { nanoid } from "nanoid"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { ExifParserFactory } from "ts-exif-parser"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { FileUpload } from "~/components/ui/file-upload"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { api } from "~/trpc/react"
import { type ImageMetaData } from "~/types/photo"

const CHUNK_SIZE = 3 * 1024 * 1024

export default function AvatarUploadPage() {
  const [imageMetaData, setImageMetaData] = useState<ImageMetaData | null>(null)
  const uploadChunk = api.photos.uploadChunk.useMutation()
  const finalizeUpload = api.photos.finalizeUpload.useMutation()
  const createPhoto = api.photos.createPhoto.useMutation()
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const fileUploadRef = useRef<{ reset: () => void } | null>(null)

  const handleReset = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.reset()
    }
  }

  const handleFileUpload = async (files: File[]) => {
    const file = files?.[0]
    setIsOpen(true)

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
      }

      const { url, blurData } = await finalizeUpload.mutateAsync({ uploadId })

      setImageMetaData({
        url,
        blurData,
        width: exifData.imageSize?.width ?? 0,
        height: exifData.imageSize?.height ?? 0,
        model: exifData.tags?.Model ?? "",
        focalLengthIn35mmFormat:
          Number(exifData.tags?.FocalLengthIn35mmFormat) || 0,
        lensModel: exifData.tags?.LensModel ?? "",
        fNumber: Number(exifData.tags?.FNumber) || 0,
        iso: Number(exifData.tags?.ISO) || 0,
        exposureTime: Number(exifData.tags?.ExposureTime) || 0,
        latitude: Number(exifData.tags?.GPSLatitude) || 0,
        longitude: Number(exifData.tags?.GPSLongitude) || 0,
        takenAtNaive: exifData.tags?.DateTimeOriginal?.toString() ?? "",
        hidden: false,
      })
    } catch (error) {
      console.error("File processing error:", error)
    }
  }

  const handleMetaDataChange = <K extends keyof ImageMetaData>(
    field: K,
    value: ImageMetaData[K],
  ) => {
    if (imageMetaData) {
      setImageMetaData({ ...imageMetaData, [field]: value })
    }
  }

  const handleUpload = async () => {
    const res = await createPhoto.mutateAsync(imageMetaData!)
    if (res.success) {
      setIsOpen(false)
      handleReset()
    } else {
      console.log(res.error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto min-h-96 w-full max-w-4xl rounded-lg border border-dashed border-neutral-300 bg-white hover:border-neutral-500 dark:border-neutral-600 dark:bg-black dark:hover:border-neutral-500 md:m-10">
        <FileUpload
          ref={fileUploadRef}
          onChange={handleFileUpload}
          onReset={() => setImageMetaData(null)}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild />
        <DialogContent className="w-full max-w-4xl">
          <DialogHeader>
            <DialogTitle>上传图像</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {imageMetaData && (
            <div className="flex justify-between gap-10">
              <div className="flex w-1/2 items-center justify-center">
                <Image
                  src={imageMetaData.url}
                  alt="Uploaded Image"
                  sizes="100vw"
                  width={0}
                  height={0}
                  style={{ width: "auto", height: "auto" }}
                />
              </div>

              <div className="flex max-h-[50vh] w-[500px] flex-col gap-5 overflow-y-auto p-5">
                <div className="flex flex-col gap-5">
                  <Label>拍摄时间</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={clsx(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>选择日期</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate)
                          handleMetaDataChange(
                            "takenAtNaive",
                            selectedDate
                              ? selectedDate.getTime().toString()
                              : new Date().getTime().toString(),
                          )
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex w-full items-center justify-center gap-2">
                    <Label className="text-md relative text-center">
                      <div>位置</div>
                      <div className="absolute left-10 top-1">
                        <Link href="https://lbs.amap.com/tools/picker">
                          <CircleHelp className="h-4 w-4" />
                        </Link>
                      </div>
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex items-center justify-center gap-2">
                      <Label className="whitespace-nowrap">经度</Label>
                      <Input
                        value={imageMetaData.longitude}
                        placeholder="经度"
                        onChange={(e) =>
                          handleMetaDataChange(
                            "longitude",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Label className="whitespace-nowrap">纬度</Label>
                      <Input
                        value={imageMetaData.latitude}
                        placeholder="纬度"
                        onChange={(e) =>
                          handleMetaDataChange(
                            "latitude",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <Label className="text-md text-center">设备</Label>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex items-center justify-center gap-2">
                      <Label className="whitespace-nowrap">相机</Label>
                      <Input
                        value={imageMetaData.model}
                        placeholder="相机型号"
                        onChange={(e) =>
                          handleMetaDataChange("model", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Label className="whitespace-nowrap">镜头</Label>
                      <Input
                        value={imageMetaData.lensModel}
                        placeholder="镜头型号"
                        onChange={(e) =>
                          handleMetaDataChange("lensModel", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <Label className="text-md text-center">参数</Label>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex items-center gap-2">
                      <Label className="whitespace-nowrap">快门</Label>
                      <Input
                        value={imageMetaData.exposureTime}
                        placeholder="快门"
                        onChange={(e) =>
                          handleMetaDataChange(
                            "exposureTime",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="whitespace-nowrap">焦距</Label>
                      <Input
                        value={imageMetaData.focalLengthIn35mmFormat}
                        placeholder="焦距"
                        onChange={(e) =>
                          handleMetaDataChange("lensModel", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="whitespace-nowrap">光圈</Label>
                      <Input
                        value={imageMetaData.fNumber}
                        placeholder="光圈"
                        onChange={(e) =>
                          handleMetaDataChange(
                            "fNumber",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="whitespace-nowrap">ISO</Label>
                      <Input
                        value={imageMetaData.iso}
                        placeholder="ISO"
                        onChange={(e) =>
                          handleMetaDataChange("lensModel", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Button onClick={() => handleUpload()}>确认上传</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
