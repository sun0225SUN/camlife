'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@/styles/mapbox.css'

import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useCallback, useMemo } from 'react'
import {
  FullscreenControl,
  Map as MapGL,
  type MapRef,
  Marker,
} from 'react-map-gl/mapbox'
import { env } from '@/env'

interface locationMapProps {
  latitude: number
  longitude: number
  width: string
  height: string
  editable?: boolean
  onChange?: (coords: { latitude: number; longitude: number }) => void
  zoom?: number
}

export function LocationMap({
  latitude,
  longitude,
  width,
  height,
  editable = false,
  onChange,
  zoom,
}: locationMapProps) {
  const { resolvedTheme } = useTheme()
  const locale = useLocale()

  const mapRef = useCallback(
    (ref: MapRef) => {
      if (ref && locale === 'zh') {
        ref
          .getMap()
          .addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))
      }
    },
    [locale],
  )

  const mapStyle = useMemo(() => {
    const styles = {
      light: 'mapbox://styles/mapbox/navigation-day-v1',
      dark: 'mapbox://styles/mapbox/dark-v11',
    }
    return styles[resolvedTheme as keyof typeof styles] || styles.light
  }, [resolvedTheme])

  return (
    <MapGL
      mapLib={mapboxgl}
      initialViewState={{ longitude, latitude, zoom: zoom ?? 14 }}
      mapStyle={mapStyle}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      ref={mapRef}
      style={{ width, height }}
      // biome-ignore lint/suspicious/noExplicitAny: need to be any
      onClick={(e: any) => {
        if (!editable) return
        const { lng, lat } = e.lngLat || {}
        if (typeof lng === 'number' && typeof lat === 'number') {
          onChange?.({ latitude: lat, longitude: lng })
        }
      }}
    >
      <FullscreenControl position='bottom-right' />
      <Marker
        longitude={longitude}
        latitude={latitude}
        draggable={editable}
        // biome-ignore lint/suspicious/noExplicitAny:  need to be any
        onDragEnd={(e: any) => {
          const { lng, lat } = e.lngLat || {}
          if (typeof lng === 'number' && typeof lat === 'number') {
            onChange?.({ latitude: lat, longitude: lng })
          }
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FF9900',
              opacity: 0.4,
              filter: 'blur(4px)',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#FF6600',
              border: '2px solid #FFFFFF',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </Marker>
    </MapGL>
  )
}

export function DynamicLocationMap({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) {
  return (
    <LocationMap
      latitude={latitude}
      longitude={longitude}
      width='100%'
      height='200px'
    />
  )
}
