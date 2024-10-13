import { useMediaQuery } from "@uidotdev/usehooks"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"
import { useMapboxGeocoding } from "~/hooks/fetchPlaceName"
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
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")
  const [rating, setRating] = useState(3)
  const { resolvedTheme } = useTheme()

  const exifProps = useMemo(
    () => ({ focalLengthIn35mmFormat, fNumber, exposureTime, iso }),
    [focalLengthIn35mmFormat, fNumber, exposureTime, iso],
  )
  const locationValue = useMemo(
    () => (placeName !== "" ? formatAddress(placeName) : "UNKNOWN"),
    [placeName],
  )

  return (
    <div className="my-4 flex justify-center text-xs md:my-10 md:text-base">
      <div className="mx-auto flex w-[100vw] justify-center gap-4 px-2 xl:w-auto xl:max-w-[80vw]">
        <div className="scrollbar-hide flex overflow-x-auto md:gap-4">
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
              placeName={placeName}
            />
          )}

          {!getPhoneName(model ?? "") ? (
            <InfoItem title={t("lens")}>
              <div className="whitespace-nowrap uppercase">
                {!!lensModel ? lensModel : "unknown"}
              </div>
            </InfoItem>
          ) : (
            <InfoItem title={t("camera")}>
              <div className="whitespace-nowrap uppercase">
                {getPhoneName(model ?? "") ?? model ?? "UNKNOWN"}
              </div>
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
        />
      </div>
    </div>
  )
}
