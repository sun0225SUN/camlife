'use client'

import { Layer, Source } from 'react-map-gl/mapbox'

interface MapPointsProps {
  geojsonData: {
    type: 'FeatureCollection'
    features: {
      type: 'Feature'
      geometry: {
        type: 'Point'
        coordinates: number[]
      }
      properties: {
        id: number
        url: string
        blurData: string
        width: number
        height: number
      }
    }[]
  } | null
  validCoordinatesCount: number
}

export function MapPoints({
  geojsonData,
  validCoordinatesCount,
}: MapPointsProps) {
  if (!geojsonData) return null

  return (
    <Source
      type='geojson'
      data={geojsonData}
    >
      <Layer
        id='point-hitbox'
        type='circle'
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 22, 30],
          'circle-opacity': 0,
        }}
      />

      <Layer
        id='point-glow'
        type='circle'
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 5, 22, 20],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'id'],
            0,
            '#FF9900',
            Math.max(validCoordinatesCount - 1, 1),
            '#00FFFF',
          ],
          'circle-opacity': 0.4,
          'circle-blur': 1,
        }}
      />

      <Layer
        id='point'
        type='circle'
        paint={{
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 3, 22, 12],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'id'],
            0,
            '#FF6600',
            Math.max(validCoordinatesCount - 1, 1),
            '#00CCFF',
          ],
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
        }}
      />
    </Source>
  )
}
