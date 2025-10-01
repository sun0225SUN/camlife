import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { env } from '@/env'
import { deleteFile, getPublicUrl, getSignedUrlForUpload } from '@/lib/storage'
import { s3Client } from '@/lib/storage/s3-client'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { photos, photosInsertSchema } from '@/server/db/schema/photos'

export const uploadRouter = createTRPCRouter({
  // get presigned url for upload
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
  // delete file from storage
  deleteFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      switch (env.STORAGE_PROVIDER) {
        case 'cloudflare_r2':
          await deleteFile(s3Client, input.key)
      }
    }),
  // create photo in database
  createPhoto: protectedProcedure
    .input(z.object({ photo: photosInsertSchema }))
    .mutation(async ({ input }) => {
      const { photo } = input
      const [data] = await db.insert(photos).values(photo).returning()

      if (!data) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create photo',
        })
      }

      return {
        success: true,
        photo: data,
      }
    }),
})
