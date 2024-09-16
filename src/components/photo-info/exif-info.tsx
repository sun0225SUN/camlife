import { Aperture, Telescope, Timer } from "lucide-react"
import React from "react"
import ISO from "~/assets/images/svg/iso.svg"
import { type PhotoInfoProps } from "~/types/photo"
import { formatExposureTime } from "~/utils/format"

const ExifItem = ({
  icon,
  value,
}: {
  icon: React.ReactNode
  value: string
}) => (
  <div className="flex items-center gap-1">
    {icon}
    {value}
  </div>
)

export const ExifInfo = ({
  focalLengthIn35mmFormat,
  fNumber,
  exposureTime,
  iso,
}: Pick<
  PhotoInfoProps,
  "focalLengthIn35mmFormat" | "fNumber" | "exposureTime" | "iso"
>) => (
  <div className="flex gap-4">
    <ExifItem
      icon={<Telescope size={18} strokeWidth={2} />}
      value={
        focalLengthIn35mmFormat ? `${focalLengthIn35mmFormat}mm` : "unknown"
      }
    />
    <ExifItem
      icon={<Aperture size={18} strokeWidth={2} />}
      value={fNumber ? `ƒ/${fNumber}` : "unknown"}
    />
    <ExifItem
      icon={<Timer size={18} strokeWidth={2.2} absoluteStrokeWidth />}
      value={exposureTime ? formatExposureTime(exposureTime) : "unknown"}
    />
    <ExifItem
      icon={<ISO className="size-6 text-black dark:text-white" />}
      value={iso?.toString() ?? "unknown"}
    />
  </div>
)
