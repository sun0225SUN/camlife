import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get compressed file name
 * @param fileName Original file name
 * @returns Compressed file name
 */
export function getCompressedFileName(fileName: string): string | null {
  if (!fileName) return null

  const fileExtension = fileName.split('.').pop()
  const fileNameWithoutExt = fileName.split('.')[0]

  if (!fileNameWithoutExt || !fileExtension) return null

  return `${fileNameWithoutExt}_compressed.${fileExtension}`
}
