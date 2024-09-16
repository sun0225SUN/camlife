import { useMediaQuery } from "@uidotdev/usehooks"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import { Loading } from "~/components/loading"
import { formatLatitude, formatLongitude } from "~/utils/format"

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

export const LocationDisplay = ({
  latitude,
  longitude,
  placeName,
}: {
  latitude: number | null
  longitude: number | null
  placeName: string
}) => {
  const t = useTranslations("PhotoInfo")
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")

  const DynamicLocationMap = dynamic(
    () =>
      import("~/components/photo-info/location-map").then(
        (module) => module.DynamicLocationMap,
      ),
    {
      ssr: false,
      loading: () => (
        <div
          className="flex items-center justify-center"
          style={{ width: isMobile ? "auto" : "300px", height: "120px" }}
        >
          <Loading />
        </div>
      ),
    },
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <DynamicLocationMap
          latitude={latitude ?? 0}
          longitude={longitude ?? 0}
        />
        <div className="my-4 flex items-center justify-center p-2">
          <div className="w-full max-w-[280px] break-words text-center text-base">
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
  )
}
