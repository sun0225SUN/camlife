export interface ImageMetaData {
  url: string
  width: number
  height: number
  blurData: string
  aspectRatio: number
  focalLength: number
  focalLengthIn35mmFormat: number
  fNumber: number
  iso: number
  exposureTime: number
  exposureCompensation: number
  latitude: number
  longitude: number
  locationName: string
  filmSimulation: string
  priorityOrder: number
  takenAt: Date
  takenAtNaive: string
  hidden: boolean
  title: string
  caption: string
  semanticDescription: string
  tags: string[]
  make: string
  model: string
  lensMake: string
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
