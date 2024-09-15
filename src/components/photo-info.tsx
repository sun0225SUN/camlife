import { Rating as ReactRating } from "@smastrom/react-rating"
import "@smastrom/react-rating/style.css"
import { useMediaQuery } from "@uidotdev/usehooks"
import { Aperture, Ellipsis, Telescope, Timer } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"
import Drawer from "react-modern-drawer"
import "react-modern-drawer/dist/index.css"
import ISO from "~/assets/images/svg/iso.svg"
import Star from "~/assets/images/svg/star.svg"
import { ExifCard } from "~/components/exif-card"
import { LocationMap } from "~/components/location-map"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { useMapboxGeocoding } from "~/hooks/fetchPlaceName"
import { useDrawerState } from "~/hooks/useDrawerState"
import {
  formatAddress,
  formatDateTime,
  formatExposureTime,
} from "~/utils/format"
import { getPhoneName } from "~/utils/getPhoneName"

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

const ExifInfo = ({
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

const InfoItem = ({
  title,
  children,
  onClick,
}: {
  title: string
  children: React.ReactNode
  onClick?: () => void
}) => (
  <div
    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60"
    onClick={onClick}
  >
    <div className="text-xs md:text-sm">{title}</div>
    {children}
  </div>
)

export function PhotoInfo({
  focalLengthIn35mmFormat,
  fNumber,
  iso,
  exposureTime,
  model,
  latitude,
  longitude,
  lensModel,
  takenAtNaive,
}: PhotoInfoProps) {
  const t = useTranslations("PhotoInfo")
  const locale = useLocale()
  const placeName = useMapboxGeocoding({
    latitude,
    longitude,
    language: locale,
    level: 2,
  })
  const { drawerState, toggleDrawer } = useDrawerState()
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)")
  const [rating, setRating] = useState(3)
  const { resolvedTheme } = useTheme()

  const exifProps = useMemo(
    () => ({ focalLengthIn35mmFormat, fNumber, exposureTime, iso }),
    [focalLengthIn35mmFormat, fNumber, exposureTime, iso],
  )
  const locationValue = useMemo(
    () => (placeName !== "" ? formatAddress(placeName) : "unknown"),
    [placeName],
  )
  const cameraInfo = useMemo(() => {
    if (!model) return "unknown"
    const phoneName = getPhoneName(model)
    return phoneName.got ? phoneName.name : model
  }, [model])

  const renderExifContent = () => (
    <div className="grid grid-cols-2 gap-4">
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

  return (
    <div className="my-4 flex justify-center text-xs md:my-10 md:text-base">
      <div className="mx-auto flex w-[100vw] justify-center gap-4 px-2 xl:w-auto xl:max-w-[80vw]">
        <div className="scrollbar-hide flex gap-4 overflow-x-auto">
          <div className="hidden cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60 md:flex">
            <div className="text-xs md:text-sm">{t("score")}</div>
            <ReactRating
              style={{
                maxWidth: 150,
              }}
              value={rating}
              onChange={setRating}
              spaceBetween="medium"
              itemStyles={{
                itemShapes: <Star />,
                activeFillColor: resolvedTheme === "dark" ? "#fff" : "#242424",
                inactiveFillColor:
                  resolvedTheme === "dark" ? "#4A4A4A" : "#D3D3D3",
              }}
            />
          </div>
          {!isSmallDevice ? (
            <>
              <Popover>
                <PopoverTrigger>
                  <InfoItem title={t("exif")}>
                    <ExifInfo {...exifProps} />
                  </InfoItem>
                </PopoverTrigger>
                <PopoverContent className="hidden w-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:block">
                  {renderExifContent()}
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger>
                  <InfoItem title={t("location")}>
                    <div className="whitespace-nowrap">{locationValue}</div>
                  </InfoItem>
                </PopoverTrigger>
                <PopoverContent className="hidden w-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:block">
                  <LocationMap
                    latitude={latitude ?? 0}
                    longitude={longitude ?? 0}
                  />
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <InfoItem title={t("exif")} onClick={() => toggleDrawer("exif")}>
                <ExifInfo {...exifProps} />
              </InfoItem>
              <InfoItem
                title={t("location")}
                onClick={() => toggleDrawer("location")}
              >
                <div className="whitespace-nowrap">{locationValue}</div>
              </InfoItem>
              <Drawer
                overlayOpacity={0.6}
                open={drawerState.exif}
                onClose={() => toggleDrawer("exif")}
                direction="bottom"
                className="!h-auto overflow-auto rounded-t-xl bg-white p-5 dark:!bg-black"
              >
                {renderExifContent()}
              </Drawer>
              <Drawer
                overlayOpacity={0.6}
                open={drawerState.location}
                onClose={() => toggleDrawer("location")}
                direction="bottom"
                className="!h-auto overflow-auto rounded-t-xl bg-white p-5 dark:!bg-black"
              >
                <LocationMap
                  latitude={latitude ?? 0}
                  longitude={longitude ?? 0}
                />
              </Drawer>
            </>
          )}
          <InfoItem title={t("camera")}>
            <div className="whitespace-nowrap uppercase">{cameraInfo}</div>
          </InfoItem>
          {!getPhoneName(model ?? "").got && (
            <InfoItem title={t("lens")}>
              <div className="whitespace-nowrap">{lensModel ?? "unknown"}</div>
            </InfoItem>
          )}
          <InfoItem title={t("time")}>
            <div className="whitespace-nowrap">
              {takenAtNaive ? formatDateTime(takenAtNaive) : "unknown"}
            </div>
          </InfoItem>
        </div>
        <div className="flex cursor-pointer flex-col items-center justify-end gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60">
          <Ellipsis />
        </div>
      </div>
    </div>
  )
}
