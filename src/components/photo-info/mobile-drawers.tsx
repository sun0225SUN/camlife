import { useTranslations } from "next-intl"
import Drawer from "react-modern-drawer"
import "react-modern-drawer/dist/index.css"
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
  drawerState: { exif: boolean; location: boolean; all: boolean }
  toggleDrawer: (drawer: "exif" | "location" | "all") => void
  placeName: string
}

export const MobileDrawers = ({
  exifProps,
  locationValue,
  latitude,
  longitude,
  drawerState,
  toggleDrawer,
  placeName,
}: MobileDrawersProps) => {
  const t = useTranslations("PhotoInfo")

  return (
    <>
      <InfoItem title={t("exif")} onClick={() => toggleDrawer("exif")}>
        <ExifInfo {...exifProps} />
      </InfoItem>
      <InfoItem title={t("location")} onClick={() => toggleDrawer("location")}>
        <div className="whitespace-nowrap">{locationValue}</div>
      </InfoItem>
      <Drawer
        overlayOpacity={0.6}
        open={drawerState.exif}
        onClose={() => toggleDrawer("exif")}
        direction="bottom"
        className="!h-auto overflow-auto rounded-t-xl bg-white p-5 dark:!bg-black"
      >
        <ExifDisplay {...exifProps} />
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
            placeName={placeName}
          />
        )}
      </Drawer>
    </>
  )
}
