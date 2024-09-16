import { Aperture, Telescope, Timer } from "lucide-react"
import { useTranslations } from "next-intl"
import ISO from "~/assets/images/svg/iso.svg"
import { ExifCard } from "~/components/photo-info/exif-card"
import { type PhotoInfoProps } from "~/types/photo"
import { formatExposureTime } from "~/utils/format"

export const ExifDisplay = ({
  focalLengthIn35mmFormat,
  fNumber,
  exposureTime,
  iso,
}: Pick<
  PhotoInfoProps,
  "focalLengthIn35mmFormat" | "fNumber" | "exposureTime" | "iso"
>) => {
  const t = useTranslations("PhotoInfo")

  return (
    <div className="grid w-full grid-cols-2 gap-4">
      <ExifCard
        title={t("focalLength")}
        value={
          focalLengthIn35mmFormat ? `${focalLengthIn35mmFormat}mm` : "unknown"
        }
        icon={<Telescope size={30} strokeWidth={2} />}
      />
      <ExifCard
        title={t("aperture")}
        value={fNumber ? `ƒ/${fNumber}` : "unknown"}
        icon={<Aperture size={30} strokeWidth={2} />}
      />
      <ExifCard
        title={t("exposureTime")}
        value={exposureTime ? formatExposureTime(exposureTime) : "unknown"}
        icon={<Timer size={30} strokeWidth={3} absoluteStrokeWidth />}
      />
      <ExifCard
        title={t("iso")}
        value={iso?.toString() ?? "unknown"}
        icon={<ISO className="size-10 text-black dark:text-white" />}
      />
    </div>
  )
}
