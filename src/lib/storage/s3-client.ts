import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'
import { env } from '@/env'

/**
 * AWS S3 client, only used in server side
 */
export const s3Client = new S3Client({
  region: env.CLOUDFLARE_R2_REGION,
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})
