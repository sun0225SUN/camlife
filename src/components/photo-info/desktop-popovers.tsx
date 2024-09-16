import { useTranslations } from "next-intl"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { type PhotoInfoProps } from "~/types/photo"
import { ExifDisplay } from "./exif-display"
import { ExifInfo } from "./exif-info"
import { InfoItem } from "./info-item"
import { LocationDisplay } from "./location-display"

interface DesktopPopoversProps {
  exifProps: Pick<
    PhotoInfoProps,
    "focalLengthIn35mmFormat" | "fNumber" | "exposureTime" | "iso"
  >
  locationValue: string
  latitude: number | null
  longitude: number | null
  placeName: string
}

export const DesktopPopovers = ({
  exifProps,
  locationValue,
  latitude,
  longitude,
  placeName,
}: DesktopPopoversProps) => {
  const t = useTranslations("PhotoInfo")
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <InfoItem title={t("exif")}>
            <ExifInfo {...exifProps} />
          </InfoItem>
        </PopoverTrigger>
        <PopoverContent className="hidden w-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:block">
          <ExifDisplay {...exifProps} />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <InfoItem title={t("location")}>
            <div className="max-w-72 overflow-hidden text-ellipsis whitespace-nowrap">
              {locationValue}
            </div>
          </InfoItem>
        </PopoverTrigger>
        {!!latitude && !!longitude && (
          <PopoverContent className="hidden w-auto gap-4 rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:flex">
            <LocationDisplay
              latitude={latitude ?? 0}
              longitude={longitude ?? 0}
              placeName={placeName}
            />
          </PopoverContent>
        )}
      </Popover>
    </>
  )
}
