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
