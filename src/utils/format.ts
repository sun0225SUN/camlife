export function formatExposureTime(exposureTime: number | null): string {
  if (!exposureTime) return ""
  if (exposureTime >= 1) return `${exposureTime}s`
  const denominator = Math.round(1 / exposureTime)
  return `1/${denominator}s`
}

export function formatDateTime(timestamp: string | null): string {
  if (!timestamp) return "unknown"

  const date = new Date(
    isNaN(Number(timestamp)) ? timestamp : Number(timestamp) * 1000,
  )

  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
}
