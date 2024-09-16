import { Ellipsis } from "lucide-react"
import { useTranslations } from "next-intl"
import Drawer from "react-modern-drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { type PhotoInfoProps } from "~/types/photo"
import { ExifDisplay } from "./exif-display"
import { InfoItem } from "./info-item"
import { LocationDisplay } from "./location-display"

interface PhotoInfoDetailsProps {
  isMobile: boolean
  placeName: string
  latitude: number | null
  longitude: number | null
  exifProps: Pick<
    PhotoInfoProps,
    "focalLengthIn35mmFormat" | "fNumber" | "exposureTime" | "iso"
  >
  drawerState: { all: boolean }
  toggleDrawer: (type: string) => void
}

export function PhotoInfoDetails({
  isMobile,
  placeName,
  latitude,
  longitude,
  exifProps,
  drawerState,
  toggleDrawer,
}: PhotoInfoDetailsProps) {
  const t = useTranslations("PhotoInfo")
  const content = (
    <>
      <div className="my-4 text-center text-lg font-medium md:my-0">
        {t("location")}
      </div>
      <LocationDisplay
        placeName={placeName}
        latitude={latitude ?? 0}
        longitude={longitude ?? 0}
      />
      <div className="my-4 text-center text-lg font-medium md:my-0">
        {t("exif")}
      </div>
      <ExifDisplay {...exifProps} />
    </>
  )

  return !isMobile ? (
    <Popover>
      <PopoverTrigger>
        <InfoItem className="!h-[68px] !justify-end">
          <Ellipsis />
        </InfoItem>
      </PopoverTrigger>
      <PopoverContent className="scrollbar-hide hidden h-[500px] w-auto flex-col gap-4 overflow-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:flex">
        {content}
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
        {content}
      </Drawer>
    </>
  )
}
