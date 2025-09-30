import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { env } from '@/env'
import { deleteFile, getPublicUrl, getSignedUrlForUpload } from '@/lib/storage'
import { s3Client } from '@/lib/storage/s3-client'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const uploadRouter = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z
          .string()
          .refine(
            (type) => type.startsWith('image/'),
            'Invalid file type. Only images are allowed',
          ),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        switch (env.STORAGE_PROVIDER) {
          case 'cloudflare_r2': {
            const signedUrl = await getSignedUrlForUpload(
              s3Client,
              input.fileName,
              input.fileType,
            )
            return { signedUrl, publicUrl: getPublicUrl(input.fileName) }
          }
          default:
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Invalid storage provider',
            })
        }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get presigned URL',
        })
      }
    }),
  deleteFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      switch (env.STORAGE_PROVIDER) {
        case 'cloudflare_r2':
          await deleteFile(s3Client, input.key)
      }
    }),
})
