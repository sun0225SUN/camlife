"use client"

import MapboxLanguage from "@mapbox/mapbox-gl-language"
import { useMediaQuery } from "@uidotdev/usehooks"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useLocale } from "next-intl"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Map, {
  GeolocateControl,
  Layer,
  type MapRef,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl"
import { MapTools } from "~/components/map-tools"
import { env } from "~/env"
import "~/styles/popup.css"
import { api } from "~/trpc/react"

interface mapProps {
  lang: string | null
  hideControls: boolean
}

export default function MapBox({ hideControls, lang }: mapProps) {
  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_TOKEN
  const { resolvedTheme } = useTheme()

  const locale = useLocale()

  const { data: coordinates } = api.photos.getAllCoordinates.useQuery()

  const [popupInfo, setPopupInfo] = useState<{
    longitude: number
    latitude: number
    url: string
    blurData: string
    width: number
    height: number
  } | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)

  const mapRef = useCallback(
    (ref: MapRef) => {
      if (ref) {
        mapInstanceRef.current = ref.getMap()
        if (lang) {
          console.log("lang", lang)
          const language = lang === "zh" ? "zh-Hans" : "en"
          ref
            .getMap()
            .addControl(new MapboxLanguage({ defaultLanguage: language }))
        } else if (locale === "zh") {
          console.log("zh")
          ref
            .getMap()
            .addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }))
        }
        mapInstanceRef.current.on("load", () => {
          setMapLoaded(true)
        })
      }
    },
    [locale, lang],
  )

  const rotate = useCallback(() => {
    if (isRotating && mapInstanceRef.current) {
      const zoom = mapInstanceRef.current.getZoom()
      if (zoom < 5) {
        const center = mapInstanceRef.current.getCenter()
        center.lng -= 6
        mapInstanceRef.current.easeTo({
          center,
          duration: 1000,
          easing: (n) => n,
        })
      }
    }
  }, [isRotating])

  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      mapInstanceRef.current.on("moveend", rotate)
      if (isRotating) rotate()
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off("moveend", rotate)
      }
    }
  }, [mapLoaded, isRotating, rotate])

  const mapStyle = useMemo(() => {
    const styles = {
      light: "mapbox://styles/sunguoqi/cm1xkfhra014901qr0td1a0mz",
      dark: "mapbox://styles/sunguoqi/cm1xkp4hc000i01nthigphlmh",
    }
    return styles[resolvedTheme as keyof typeof styles] || styles.light
  }, [resolvedTheme])

  const isMobile = useMediaQuery("only screen and (max-width : 768px)")

  const mapZoom = useMemo(() => (isMobile ? 1 : 2), [isMobile])

  const geojsonData = useMemo(() => {
    if (!coordinates) return null
    return {
      type: "FeatureCollection",
      features: coordinates.map((coord, index) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coord.longitude!, coord.latitude!],
        },
        properties: {
          id: index,
          url: coord.url,
          blurData: coord.blurData,
          width: coord.width,
          height: coord.height,
        },
      })),
    }
  }, [coordinates])

  const onClick = useCallback((event: mapboxgl.MapMouseEvent) => {
    setIsRotating(false)
    const feature = event.features?.[0]
    if (feature && feature.geometry.type === "Point") {
      setPopupInfo({
        longitude: feature.geometry.coordinates[0]!,
        latitude: feature.geometry.coordinates[1]!,
        url: feature.properties?.url as string,
        blurData: feature.properties?.blurData as string,
        width: feature.properties?.width as number,
        height: feature.properties?.height as number,
      })
    } else {
      setPopupInfo(null)
    }
  }, [])

  return (
    <>
      {!hideControls && (
        <MapTools isRotating={isRotating} setIsRotating={setIsRotating} />
      )}
      <Map
        // @ts-expect-error eslint-disable-line
        mapLib={mapboxgl}
        initialViewState={{
          longitude: 116.38,
          latitude: 39.9,
          zoom: mapZoom,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}
        ref={mapRef}
        interactiveLayerIds={["point-hitbox", "point"]}
        onClick={onClick}
        projection={{ name: "globe" }}
      >
        {geojsonData && (
          <Source type="geojson" data={geojsonData}>
            <Layer
              id="point-hitbox"
              type="circle"
              paint={{
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  10,
                  22,
                  30,
                ],
                "circle-opacity": 0,
              }}
            />
            <Layer
              id="point-glow"
              type="circle"
              paint={{
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  5,
                  22,
                  20,
                ],
                "circle-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "id"],
                  0,
                  "#FF9900",
                  coordinates?.length ?? 1,
                  "#00FFFF",
                ],
                "circle-opacity": 0.4,
                "circle-blur": 1,
              }}
            />
            <Layer
              id="point"
              type="circle"
              paint={{
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0,
                  3,
                  22,
                  12,
                ],
                "circle-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "id"],
                  0,
                  "#FF6600",
                  coordinates?.length ?? 1,
                  "#00CCFF",
                ],
                "circle-opacity": 0.8,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#FFFFFF",
              }}
            />
          </Source>
        )}
        {!hideControls && popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            offset={[0, -15]}
          >
            <div className="rounded-md p-2 dark:bg-[#333333]">
              <Image
                src={popupInfo.url}
                placeholder="blur"
                blurDataURL={popupInfo.blurData ?? ""}
                alt="map photo"
                width={popupInfo.width}
                height={popupInfo.height}
              />
            </div>
          </Popup>
        )}
        {!hideControls && (
          <>
            <NavigationControl
              position="bottom-right"
              style={
                isMobile
                  ? { marginBottom: "80px", marginRight: "20px" }
                  : { marginBottom: "80px", marginRight: "50px" }
              }
            />
            <GeolocateControl
              position="bottom-right"
              style={
                isMobile ? { marginRight: "20px" } : { marginRight: "50px" }
              }
            />
          </>
        )}
      </Map>
    </>
  )
}
