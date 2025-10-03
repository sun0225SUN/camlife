/**
 * Format EXIF date time string
 * @param dateTime EXIF format date time string, e.g. "2024:09:09 19:44:17"
 * @returns Formatted Date object, returns null if parsing fails
 */
export function formatExifDateTime(dateTime: string): Date | null {
  if (!dateTime || typeof dateTime !== 'string') {
    return null
  }

  // Handle EXIF format: "2024:09:09 19:44:17"
  if (dateTime.match(/^\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}$/)) {
    const formattedDateString = dateTime.replace(
      /^(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})$/,
      '$1-$2-$3T$4',
    )
    const parsedDate = new Date(formattedDateString)

    // Check if date is valid
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate
    }
  }

  // Try to parse other formats directly
  const parsedDate = new Date(dateTime)
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  return null
}

/**
 * Format exposure time to human-readable string
 * @param exposureTime Exposure time in seconds (e.g., 0.00125 for 1/800s)
 * @returns Formatted exposure time string (e.g., "1/800s", "1s", "2.5s")
 */
export function formatExposureTime(exposureTime: number): string {
  if (!exposureTime || exposureTime <= 0) {
    return 'unknown'
  }

  // If exposure time is less than 1 second, show as fraction
  if (exposureTime < 1) {
    const denominator = Math.round(1 / exposureTime)
    return `1/${denominator}s`
  }

  // If exposure time is 1 second or more, show as decimal
  if (exposureTime === 1) {
    return '1s'
  }

  // For longer exposures, show with 1 decimal place
  return `${exposureTime.toFixed(1)}s`
}
