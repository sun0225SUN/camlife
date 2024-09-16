import { useTranslations } from "next-intl"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { type PhotoInfoProps } from "~/types/photo"
import { ExifDisplay } from "./exif-display"
import { ExifInfo } from "./exif-info"
import { InfoItem } from "./info-item"
import { LocationDisplay } from "./location-display"

interface MobileDrawersProps {
  exifProps: Pick<
    PhotoInfoProps,
    "focalLengthIn35mmFormat" | "fNumber" | "exposureTime" | "iso"
  >
  locationValue: string
  latitude: number | null
  longitude: number | null
  placeName: string
}

export const MobileDrawers = ({
  exifProps,
  locationValue,
  latitude,
  longitude,
  placeName,
}: MobileDrawersProps) => {
  const t = useTranslations("PhotoInfo")

  return (
    <>
      <Drawer shouldScaleBackground={false}>
        <DrawerTrigger>
          <InfoItem title={t("exif")}>
            <ExifInfo {...exifProps} />
          </InfoItem>
        </DrawerTrigger>

        <DrawerContent className="z-[100] px-4 pb-4">
          <DrawerHeader>
            <DrawerTitle>{t("exif")}</DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          <ExifDisplay {...exifProps} />
        </DrawerContent>
      </Drawer>

      <Drawer shouldScaleBackground={false}>
        <DrawerTrigger>
          <InfoItem title={t("location")}>
            <div className="whitespace-nowrap">{locationValue}</div>
          </InfoItem>
        </DrawerTrigger>
        {!!latitude && !!longitude && (
          <DrawerContent className="z-[100] px-4 pb-4">
            <DrawerHeader>
              <DrawerTitle>{t("location")}</DrawerTitle>
              <DrawerDescription />
            </DrawerHeader>
            <div data-vaul-no-drag>
              <LocationDisplay
                latitude={latitude ?? 0}
                longitude={longitude ?? 0}
                placeName={placeName}
              />
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </>
  )
}
