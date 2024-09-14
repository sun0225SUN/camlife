"use client"

import MapboxLanguage from "@mapbox/mapbox-gl-language"
import { useMediaQuery } from "@uidotdev/usehooks"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useCallback, useMemo } from "react"
import Map, { FullscreenControl, type MapRef, Marker } from "react-map-gl"
import { env } from "~/env"
import { useMapboxGeocoding } from "~/hooks/fetchPlaceName"
import { formatLatitude, formatLongitude } from "~/utils/format"

interface LocationMapProps {
  latitude: number
  longitude: number
}

export function LocationMap({ latitude, longitude }: LocationMapProps) {
  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_TOKEN
  const { resolvedTheme } = useTheme()
  const locale = useLocale()
  const t = useTranslations("LocationMap")
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)")

  const mapRef = useCallback(
    (ref: MapRef) => {
      if (ref && locale === "zh") {
        ref
          .getMap()
          .addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }))
      }
    },
    [locale],
  )

  const mapStyle = useMemo(() => {
    const styles = {
      light: "mapbox://styles/mapbox/navigation-day-v1",
      dark: "mapbox://styles/mapbox/dark-v11",
    }
    return styles[resolvedTheme as keyof typeof styles] || styles.light
  }, [resolvedTheme])

  const placeName = useMapboxGeocoding({
    latitude,
    longitude,
    language: locale,
    level: 2,
  })

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

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <Map
          // @ts-expect-error eslint-disable-line
          mapLib={mapboxgl}
          initialViewState={{ longitude, latitude, zoom: 14 }}
          mapStyle={mapStyle}
          mapboxAccessToken={mapboxToken}
          ref={mapRef}
          style={{ width: isSmallDevice ? "auto" : "300px", height: "120px" }}
        >
          <FullscreenControl position="bottom-right" />
          <Marker longitude={longitude} latitude={latitude} />
        </Map>
        <div className="my-4 flex items-center justify-center p-2">
          <div className="w-full max-w-[280px] break-words text-center text-sm">
            {placeName}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <CoordinateDisplay
          label={t("latitude")}
          value={latitude}
          formattedValue={formatLatitude(latitude)}
        />
        <CoordinateDisplay
          label={t("longitude")}
          value={longitude}
          formattedValue={formatLongitude(longitude)}
        />
      </div>
    </div>
  )
}
