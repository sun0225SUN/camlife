/**
 * 格式化 EXIF 日期时间字符串
 * @param dateTime EXIF 格式的日期时间字符串，如 "2024:09:09 19:44:17"
 * @returns 格式化后的 Date 对象，如果解析失败则返回 null
 */
export function formatExifDateTime(dateTime: string): Date | null {
  if (!dateTime || typeof dateTime !== 'string') {
    return null
  }

  // 处理 EXIF 格式: "2024:09:09 19:44:17"
  if (dateTime.match(/^\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}$/)) {
    const formattedDateString = dateTime.replace(
      /^(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})$/,
      '$1-$2-$3T$4',
    )
    const parsedDate = new Date(formattedDateString)

    // 检查日期是否有效
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate
    }
  }

  // 尝试直接解析其他格式
  const parsedDate = new Date(dateTime)
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate
  }

  return null
}
