import {
  Aperture,
  Ellipsis,
  Star,
  StarHalf,
  Telescope,
  Timer,
} from "lucide-react"
import { useTranslations } from "next-intl"
import ISO from "~/assets/images/svg/iso.svg"
import { formatDateTime, formatExposureTime } from "~/utils/format"

interface PhotoInfoProps {
  make?: string | null
  model?: string | null
  lensModel?: string | null
  latitude?: number | null
  longitude?: number | null
  focalLengthIn35mmFormat?: number | null
  fNumber?: number | null
  iso?: number | null
  exposureTime?: number | null
  exposureCompensation?: number | null
  takenAtNaive?: string | null
}

export function PhotoInfo({
  focalLengthIn35mmFormat,
  fNumber,
  iso,
  exposureTime,
  // exposureCompensation,
  model,
  // latitude,
  // longitude,
  lensModel,
  takenAtNaive,
}: PhotoInfoProps) {
  const t = useTranslations("PhotoInfo")
  return (
    <div className="my-4 flex justify-center text-xs md:my-10 md:text-base">
      <div className="mx-auto flex w-[100vw] justify-center gap-4 px-2 xl:w-auto">
        <div className="scrollbar-hide flex gap-4 overflow-x-auto">
          <div className="hidden cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60 md:flex">
            <div className="text-xs md:text-sm">{t("score")}</div>
            <div className="flex gap-2">
              <Star size={20} strokeWidth={2} />
              <Star size={20} strokeWidth={2} />
              <Star size={20} strokeWidth={2} />
              <Star size={20} strokeWidth={2} />
              <StarHalf size={20} strokeWidth={2} />
            </div>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
            <div className="text-xs md:text-sm">{t("exif")}</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <Telescope size={18} strokeWidth={2} />
                {!!focalLengthIn35mmFormat
                  ? focalLengthIn35mmFormat + "mm"
                  : "unknown"}
              </div>
              <div className="flex items-center gap-1">
                <Aperture size={18} strokeWidth={2} />
                {!!fNumber ? "ƒ/" + fNumber : "unknown"}
              </div>
              <div className="flex items-center gap-1">
                <Timer size={18} strokeWidth={2.2} absoluteStrokeWidth />
                {!!exposureTime
                  ? formatExposureTime(exposureTime ?? null)
                  : "unknown"}
              </div>
              <div className="flex items-center gap-1">
                <ISO className="size-6 text-black dark:text-white" />
                {!!iso ? iso : "unknown"}
              </div>
            </div>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
            <div className="text-xs md:text-sm">{t("location")}</div>
            <div className="whitespace-nowrap">
              unknown
              {/* {latitude}
          {longitude} */}
            </div>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
            <div className="text-xs md:text-sm">{t("camera")}</div>
            <div className="whitespace-nowrap">
              {!!model ? model : "unknown"}
            </div>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
            <div className="text-xs md:text-sm">{t("lens")}</div>
            <div className="whitespace-nowrap">
              {!!lensModel ? lensModel : "unknown"}
            </div>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
            <div className="text-xs md:text-sm">{t("time")}</div>
            <div className="whitespace-nowrap">
              {takenAtNaive ? formatDateTime(takenAtNaive) : "unknown"}
            </div>
          </div>
        </div>
        <div className="flex cursor-pointer flex-col items-center justify-end gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
          <Ellipsis />
        </div>
      </div>
    </div>
  )
}
