/**
 * Formats the exposure time into a readable string
 * @param exposureTime The exposure time in seconds
 * @returns Formatted exposure time string
 */
export function formatExposureTime(exposureTime: number | null): string {
  if (!exposureTime) return ""
  if (exposureTime >= 1) return `${exposureTime}s`
  const denominator = Math.round(1 / exposureTime)
  return `1/${denominator}s`
}

/**
 * Formats a timestamp into a localized date string
 * @param timestamp The timestamp to format (string or number)
 * @returns Formatted date string in "YYYY-MM-DD" format for zh-CN locale
 */
export function formatDateTime(timestamp: string | null): string {
  if (!timestamp) return "unknown"

  // Convert to Date object, handling both string and number inputs
  const date = new Date(
    isNaN(Number(timestamp)) ? timestamp : Number(timestamp) * 1000,
  )

  // Check if the date is valid
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
}

/**
 * Formats a full address into a simplified form
 * @param address The complete address string
 * @returns The formatted address string
 */
export function formatAddress(address: string): string {
  const parts = address.match(/(.*国)(.*省)(.*市)/)
  if (!parts) return address
  return `${parts[1]} · ${parts[2]} · ${parts[3]}`
}

/**
 * Converts a coordinate (latitude or longitude) to a formatted string
 * @param coordinate The coordinate value in decimal degrees
 * @param isLatitude Boolean indicating whether the coordinate is latitude
 * @returns Formatted coordinate string in degrees, minutes, seconds, and direction
 */
function convertCoordinate(coordinate: number, isLatitude: boolean): string {
  const abs = Math.abs(coordinate)
  const degrees = Math.floor(abs)
  const minutes = Math.floor((abs - degrees) * 60)
  const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(0)
  const direction = isLatitude
    ? coordinate < 0
      ? "S"
      : "N"
    : coordinate < 0
      ? "W"
      : "E"

  return `${degrees}°${minutes}'${seconds}"${direction}`
}

/**
 * Formats a latitude value into a readable string
 * @param latitude The latitude value in decimal degrees
 * @returns Formatted latitude string
 */
export function formatLatitude(latitude: number): string {
  return convertCoordinate(latitude, true)
}

/**
 * Formats a longitude value into a readable string
 * @param longitude The longitude value in decimal degrees
 * @returns Formatted longitude string
 */
export function formatLongitude(longitude: number): string {
  return convertCoordinate(longitude, false)
}

/**
 * Formats both latitude and longitude into a single readable string
 * @param latitude The latitude value in decimal degrees
 * @param longitude The longitude value in decimal degrees
 * @returns Formatted string containing both latitude and longitude
 */
export function formatLatitudeLongitude(
  latitude: number,
  longitude: number,
): string {
  return `${formatLatitude(latitude)} ${formatLongitude(longitude)}`
}
