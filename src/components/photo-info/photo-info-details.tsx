import { Ellipsis } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
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
}

export function PhotoInfoDetails({
  isMobile,
  placeName,
  latitude,
  longitude,
  exifProps,
}: PhotoInfoDetailsProps) {
  const t = useTranslations("PhotoInfo")

  const content = (
    <>
      {!!latitude && !!longitude && (
        <>
          <div className="mb-4 text-center text-lg font-medium">
            {t("location")}
          </div>
          <div data-vaul-no-drag>
            <LocationDisplay
              placeName={placeName}
              latitude={latitude ?? 0}
              longitude={longitude ?? 0}
            />
          </div>
        </>
      )}
      <div className="my-4 text-center text-lg font-medium">{t("exif")}</div>
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
      <PopoverContent className="scrollbar-hide hidden max-h-[500px] w-auto flex-col gap-4 overflow-auto rounded-2xl bg-white/80 backdrop-blur-sm dark:bg-black/80 md:flex">
        {content}
      </PopoverContent>
    </Popover>
  ) : (
    <>
      <Drawer shouldScaleBackground={false}>
        <DrawerTrigger>
          <InfoItem className="!h-[68px] !justify-end hover:!bg-transparent">
            <Ellipsis />
          </InfoItem>
        </DrawerTrigger>
        <DrawerContent className="z-[100] max-h-[80vh] px-4 pb-4">
          <DrawerHeader>
            <DrawerTitle />
            <DrawerDescription />
          </DrawerHeader>
          <div className="scrollbar-hide h-full overflow-auto">{content}</div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
