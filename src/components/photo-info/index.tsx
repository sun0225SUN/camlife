import { useMediaQuery } from "@uidotdev/usehooks"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"
import { useMapboxGeocoding } from "~/hooks/fetchPlaceName"
import { useDrawerState } from "~/hooks/useDrawerState"
import { type PhotoInfoProps } from "~/types/photo"
import { formatAddress, formatDateTime } from "~/utils/format"
import { getPhoneName } from "~/utils/getPhoneName"
import { DesktopPopovers } from "./desktop-popovers"
import { InfoItem } from "./info-item"
import { MobileDrawers } from "./mobile-drawers"
import { PhotoInfoDetails } from "./photo-info-details"
import { RatingDisplay } from "./rating-display"

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

  return (
    <div className="my-4 flex justify-center text-xs md:my-10 md:text-base">
      <div className="mx-auto flex w-[100vw] justify-center gap-4 px-2 xl:w-auto xl:max-w-[80vw]">
        <div className="scrollbar-hide flex gap-4 overflow-x-auto">
          <RatingDisplay
            rating={rating}
            setRating={setRating}
            resolvedTheme={resolvedTheme!}
          />
          {!isMobile ? (
            <DesktopPopovers
              exifProps={exifProps}
              locationValue={locationValue}
              latitude={latitude ?? 0}
              longitude={longitude ?? 0}
              placeName={placeName}
            />
          ) : (
            <MobileDrawers
              exifProps={exifProps}
              locationValue={locationValue}
              latitude={latitude ?? 0}
              longitude={longitude ?? 0}
              drawerState={drawerState}
              toggleDrawer={toggleDrawer}
              placeName={placeName}
            />
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
        <PhotoInfoDetails
          isMobile={isMobile}
          placeName={placeName}
          latitude={latitude ?? 0}
          longitude={longitude ?? 0}
          exifProps={exifProps}
          drawerState={drawerState}
          toggleDrawer={() => toggleDrawer("all")}
        />
      </div>
    </div>
  )
}
