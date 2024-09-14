import { useEffect, useState } from "react"
import { env } from "~/env"

interface UseMapboxGeocodingProps {
  latitude: number | null | undefined
  longitude: number | null | undefined
  language?: string
  level?: number
}

interface MapboxFeature {
  place_name: string
}

interface MapboxResponse {
  features: MapboxFeature[]
}

export function useMapboxGeocoding({
  latitude,
  longitude,
  language,
  level,
}: UseMapboxGeocodingProps) {
  const [placeName, setPlaceName] = useState<string>("")
  const mapboxToken = env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    const fetchPlaceName = async () => {
      if (typeof latitude !== "number" || typeof longitude !== "number") return

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&language=${language}`,
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = (await response.json()) as MapboxResponse
        const feature = data.features?.[level ?? 3]
        if (feature?.place_name) {
          setPlaceName(feature.place_name)
        }
      } catch (error) {
        console.error("Error fetching place name:", error)
      }
    }

    void fetchPlaceName()
  }, [latitude, longitude, language, mapboxToken, level])

  return placeName
}
