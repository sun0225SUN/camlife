export interface PhotoInfo {
  name: string
  size: number
  type: string
  url: string
}

export type PhotoInfoDialogTriggerType =
  | 'file-upload'
  | 'view-photo-info'
  | 'edit-photo-info'
  | null

export type FileUploadStep = 'upload' | 'processing' | 'success' | 'failed'
