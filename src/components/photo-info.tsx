import { Rating as ReactRating } from "@smastrom/react-rating"
import "@smastrom/react-rating/style.css"
import { useMediaQuery } from "@uidotdev/usehooks"
import clsx from "clsx"
import { Aperture, Ellipsis, Telescope, Timer } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import Drawer from "react-modern-drawer"
import "react-modern-drawer/dist/index.css"
import ISO from "~/assets/images/svg/iso.svg"
import Star from "~/assets/images/svg/star.svg"
import { ExifCard } from "~/components/exif-card"
import { Loading } from "~/components/loading"
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
  formatLatitude,
  formatLongitude,
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

const DynamicLocationMap = dynamic(
  () =>
    import("~/components/location-map").then(
      (module) => module.DynamicLocationMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[120px] w-full items-center justify-center">
        <Loading />
      </div>
    ),
  },
)

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
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => (
  <div
    className={clsx(
      "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-[rgba(36,36,36,0.6)]/60",
      className,
    )}
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
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")
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

  const CoordinateDisplay = ({
    label,
    value,
    formattedValue,
  }: {
    label: string
    value: number
    formattedValue: string
  }) => (
    <div className="flex h-32 flex-1 flex-col justify-between rounded-2xl border border-gray-200 bg-white p-2 text-sm dark:border-gray-800 dark:bg-black">
      <div className="flex flex-col items-start gap-2 p-2">
        <div>{label}</div>
        <div className="text-xl font-medium">{formattedValue}</div>
      </div>
      <div className="flex items-center justify-between p-2">
        {value.toFixed(6)}
      </div>
    </div>
  )

  const LocationDisplay = ({
    latitude,
    longitude,
  }: {
    latitude: number | null
    longitude: number | null
  }) => (
    <>
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
          <DynamicLocationMap
            latitude={latitude ?? 0}
            longitude={longitude ?? 0}
          />
          <div className="my-4 flex items-center justify-center p-2">
            <div className="w-full max-w-[280px] break-words text-center text-sm">
              {placeName}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <CoordinateDisplay
            label={t("latitude")}
            value={latitude ?? 0}
            formattedValue={formatLatitude(latitude ?? 0)}
          />
          <CoordinateDisplay
            label={t("longitude")}
            value={longitude ?? 0}
            formattedValue={formatLongitude(longitude ?? 0)}
          />
        </div>
      </div>
    </>
  )

  const ExifDisplay = () => (
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
          {!isMobile ? (
            <>
              <Popover>
                <PopoverTrigger>
                  <InfoItem title={t("exif")}>
                    <ExifInfo {...exifProps} />
                  </InfoItem>
                </PopoverTrigger>
                <PopoverContent className="hidden w-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:block">
                  {ExifDisplay()}
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger>
                  <InfoItem title={t("location")}>
                    <div className="whitespace-nowrap">{locationValue}</div>
                  </InfoItem>
                </PopoverTrigger>
                <PopoverContent className="hidden w-auto gap-4 rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:flex">
                  <LocationDisplay
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
                {ExifDisplay()}
              </Drawer>
              <Drawer
                overlayOpacity={0.6}
                open={drawerState.location}
                onClose={() => toggleDrawer("location")}
                direction="bottom"
                className="!h-auto overflow-auto rounded-t-xl bg-white p-5 dark:!bg-black"
              >
                {drawerState.location && (
                  <LocationDisplay
                    latitude={latitude ?? 0}
                    longitude={longitude ?? 0}
                  />
                )}
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
        {!isMobile ? (
          <Popover>
            <PopoverTrigger>
              <InfoItem className="!h-[68px] !justify-end">
                <Ellipsis />
              </InfoItem>
            </PopoverTrigger>
            <PopoverContent className="scrollbar-hide hidden h-[500px] w-auto flex-col gap-4 overflow-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:flex">
              <div className="flex flex-col items-center justify-between gap-4">
                <div className="text-lg font-medium">{t("location")}</div>
                <LocationDisplay
                  latitude={latitude ?? 0}
                  longitude={longitude ?? 0}
                />
              </div>
              <div className="flex flex-col items-center justify-between gap-4">
                <div className="text-lg font-medium">{t("exif")}</div>
                {ExifDisplay()}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <>
            <InfoItem
              className="!h-[68px] !justify-end !px-0 hover:!bg-transparent"
              onClick={() => toggleDrawer("all")}
            >
              <Ellipsis />
            </InfoItem>
            <Drawer
              overlayOpacity={0.6}
              open={drawerState.all}
              onClose={() => toggleDrawer("all")}
              direction="bottom"
              className="!h-[70vh] w-full overflow-auto rounded-t-xl bg-white p-5 dark:!bg-black"
            >
              <div className="flex flex-col gap-4">
                <div className="text-center text-lg font-medium">
                  {t("location")}
                </div>
                {drawerState.all && (
                  <LocationDisplay
                    latitude={latitude ?? 0}
                    longitude={longitude ?? 0}
                  />
                )}
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <div className="text-center text-lg font-medium">
                  {t("exif")}
                </div>
                {ExifDisplay()}
              </div>
            </Drawer>
          </>
        )}
      </div>
    </div>
  )
}
