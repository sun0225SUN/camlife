import {
  DeleteObjectCommand,
  PutObjectCommand,
  type S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/env'

/**
 * Utility function to generate full object key with optional prefix
 *
 * @param key - The base key/filename
 * @returns Full key with prefix if configured, otherwise returns the original key
 */
export function getFullKey(key: string): string {
  return env.CLOUDFLARE_R2_PREFIX ? `${env.CLOUDFLARE_R2_PREFIX}/${key}` : key
}

/**
 * Get public url
 * @param key the key of the file
 * @returns the public url
 */
export function getPublicUrl(key: string) {
  switch (env.STORAGE_PROVIDER) {
    case 'cloudflare_r2':
      return `${env.CLOUDFLARE_R2_PUBLIC_URL}/${getFullKey(key)}`
    default:
      throw new Error('Invalid storage provider, no public url available')
  }
}

/**
 * Get signed URL for upload
 *
 * @param key - The key to upload the file to
 * @param contentType - The content type of the file
 * @returns The signed URL
 */
export async function getSignedUrlForUpload(
  s3Client: S3Client,
  key: string,
  contentType: string,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET,
    Key: getFullKey(key),
    ContentType: contentType,
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw error
  }
}

/**
 * Delete file from Cloudflare R2
 *
 * @param key - The key to delete the file
 * @returns The response from the delete
 */
export async function deleteFile(s3Client: S3Client, key: string) {
  const command = new DeleteObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET,
    Key: getFullKey(key),
  })

  try {
    const response = await s3Client.send(command)
    return response
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}
