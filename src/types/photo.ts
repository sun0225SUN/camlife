export interface PhotoInfo {
  fileKey: string
  url: string
  blurDataUrl?: string
  compressedUrl?: string
  title?: string
  description?: string
  rating?: number
  isFavorite?: boolean
  visibility?: string
  width?: number
  height?: number
  aspectRatio?: number
  make?: string
  model?: string
  lensModel?: string
  focalLength?: number
  focalLength35mm?: number
  fNumber?: number
  iso?: number
  exposureTime?: number
  exposureCompensation?: number
  latitude?: number
  longitude?: number
  gpsAltitude?: number
  dateTimeOriginal?: string
  country?: string
  countryCode?: string
  region?: string
  city?: string
  district?: string
  fullAddress?: string
  placeFormatted?: string
}

export type PhotoInfoDialogTriggerType =
  | 'file-upload'
  | 'view-photo-info'
  | 'edit-photo-info'
  | null

export type FileUploadStep = 'upload' | 'processing' | 'success' | 'failed'
