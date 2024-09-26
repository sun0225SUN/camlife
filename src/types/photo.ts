export interface ImageMetaData {
  url: string
  width: number
  height: number
  blurData: string
  focalLengthIn35mmFormat: number
  fNumber: number
  iso: number
  exposureTime: number
  latitude: number
  longitude: number
  takenAtNaive: string
  hidden: boolean
  model: string
  lensModel: string
}

export interface PhotoInfoProps {
  make?: string | null
  model?: string | null
  lensModel?: string | null
  latitude?: number | null
  longitude?: number | null
  focalLengthIn35mmFormat?: number | null
  fNumber?: number | null
  iso?: number | null
  exposureTime?: number | null
  exposureCompensation?: number | null
  takenAtNaive?: string | null
}
