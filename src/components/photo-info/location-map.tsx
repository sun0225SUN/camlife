"use client"

import MapboxLanguage from "@mapbox/mapbox-gl-language"
import { useMediaQuery } from "@uidotdev/usehooks"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"
import { useCallback, useMemo } from "react"
import Map, { FullscreenControl, type MapRef, Marker } from "react-map-gl"
import { env } from "~/env"

interface DynamicLocationMapProps {
  latitude: number
  longitude: number
}

export function DynamicLocationMap({
  latitude,
  longitude,
}: DynamicLocationMapProps) {
  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_TOKEN
  const { resolvedTheme } = useTheme()
  const locale = useLocale()
  const isMobile = useMediaQuery("only screen and (max-width : 768px)")

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

  return (
    <Map
      // @ts-expect-error eslint-disable-line
      mapLib={mapboxgl}
      initialViewState={{ longitude, latitude, zoom: 14 }}
      mapStyle={mapStyle}
      mapboxAccessToken={mapboxToken}
      ref={mapRef}
      style={{ width: isMobile ? "auto" : "300px", height: "120px" }}
    >
      <FullscreenControl position="bottom-right" />
      <Marker longitude={longitude} latitude={latitude}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#FF9900",
              opacity: 0.4,
              filter: "blur(4px)",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#FF6600",
              border: "2px solid #FFFFFF",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </Marker>
    </Map>
  )
}
