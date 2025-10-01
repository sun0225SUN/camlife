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
}

export function LocationMap({
  latitude,
  longitude,
  width,
  height,
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
      initialViewState={{ longitude, latitude, zoom: 14 }}
      mapStyle={mapStyle}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      ref={mapRef}
      style={{ width, height }}
    >
      <FullscreenControl position='bottom-right' />
      <Marker
        longitude={longitude}
        latitude={latitude}
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
