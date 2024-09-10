"use client"

import MapboxLanguage from "@mapbox/mapbox-gl-language"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"
import { useCallback } from "react"
import Map, { type MapRef } from "react-map-gl"
import { env } from "~/env"

export default function MapBox() {
  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_TOKEN
  const { resolvedTheme } = useTheme()
  const locale = useLocale()

  const mapRef = useCallback(
    (ref: MapRef) => {
      if (ref) {
        const map = ref.getMap()
        if (locale === "zh") {
          map.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }))
        }
      }
    },
    [locale],
  )

  const mapStyles = {
    light: "mapbox://styles/mapbox/outdoors-v12",
    dark: "mapbox://styles/mapbox/dark-v11",
  }

  const currentMapStyle = mapStyles[resolvedTheme as keyof typeof mapStyles]

  return (
    <Map
      // @ts-expect-error eslint-disable-line
      mapLib={import("mapbox-gl")}
      initialViewState={{
        longitude: 116.4,
        latitude: 39.91,
        zoom: 1,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle={currentMapStyle}
      mapboxAccessToken={mapboxToken}
      ref={mapRef}
    />
  )
}
