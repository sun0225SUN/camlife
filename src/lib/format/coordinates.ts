/**
 * Format latitude coordinate to DMS (Degrees, Minutes, Seconds) format
 * @param latitude Latitude coordinate in decimal degrees
 * @returns Formatted latitude string (e.g., "39°54'26.4\"N")
 */
export function formatLatitude(latitude: number): string {
  if (typeof latitude !== 'number' || Number.isNaN(latitude)) {
    return 'N/A'
  }

  const absLat = Math.abs(latitude)
  const degrees = Math.floor(absLat)
  const minutes = Math.floor((absLat - degrees) * 60)
  const seconds = ((absLat - degrees) * 60 - minutes) * 60

  const direction = latitude >= 0 ? 'N' : 'S'

  return `${degrees}°${minutes}'${seconds.toFixed(1)}"${direction}`
}

/**
 * Format longitude coordinate to DMS (Degrees, Minutes, Seconds) format
 * @param longitude Longitude coordinate in decimal degrees
 * @returns Formatted longitude string (e.g., "116°23'45.6\"E")
 */
export function formatLongitude(longitude: number): string {
  if (typeof longitude !== 'number' || Number.isNaN(longitude)) {
    return 'N/A'
  }

  const absLng = Math.abs(longitude)
  const degrees = Math.floor(absLng)
  const minutes = Math.floor((absLng - degrees) * 60)
  const seconds = ((absLng - degrees) * 60 - minutes) * 60

  const direction = longitude >= 0 ? 'E' : 'W'

  return `${degrees}°${minutes}'${seconds.toFixed(1)}"${direction}`
}
