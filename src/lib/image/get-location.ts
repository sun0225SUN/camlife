import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'
import { ADDRESS_LANGUAGE } from '@/constants'
import { env } from '@/env'
import type { ImageLocation } from '@/types'

const geocodingClient = mbxGeocoding({
  accessToken: env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
})

/**
 * Get location information using Mapbox Geocoding SDK
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @param level Address level, defaults to 0
 * @param language Language code for address, defaults to ADDRESS_LANGUAGE constant
 * @returns Promise<ImageLocation> Location information
 */
export async function getLocationFromCoordinates(
  latitude: number,
  longitude: number,
  level = 0,
  language = ADDRESS_LANGUAGE,
): Promise<ImageLocation> {
  try {
    const response = await geocodingClient
      .reverseGeocode({
        query: [longitude, latitude],
        language: [language],
        types: [
          'country',
          'region',
          'district',
          'place',
          'locality',
          'neighborhood',
          'address',
        ],
      })
      .send()

    const features = response.body.features || []
    console.log(features)

    if (features.length === 0) {
      return {}
    }

    // Parse geographic information - much simpler approach
    const locationData: ImageLocation = {}

    // Get full address and formatted place name
    if (features[0]) {
      locationData.fullAddress = features[0].place_name
      locationData.placeFormatted =
        features[level]?.place_name || features[0].place_name
    }

    // Create a map of all features by type for easy lookup
    const featureMap = new Map()
    features.forEach((feature) => {
      const type = feature.place_type?.[0] // Get the first place_type
      if (type) {
        featureMap.set(type, feature)
      }
    })

    // Extract location data based on feature types
    const countryFeature = featureMap.get('country')
    if (countryFeature) {
      locationData.country = countryFeature.text
      locationData.countryCode = countryFeature.properties?.short_code
    }

    const regionFeature = featureMap.get('region')
    if (regionFeature) {
      locationData.region = regionFeature.text
    }

    // City can be either 'place' or 'locality'
    const cityFeature = featureMap.get('locality') || featureMap.get('place')
    if (cityFeature) {
      locationData.city = cityFeature.text
    }

    // District can be 'district' or 'neighborhood'
    const districtFeature =
      featureMap.get('district') || featureMap.get('neighborhood')
    if (districtFeature) {
      locationData.district = districtFeature.text
    }

    return locationData
  } catch (error) {
    console.error('Error fetching location data:', error)
    return {}
  }
}
