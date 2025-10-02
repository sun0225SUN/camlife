import { TRPCError } from '@trpc/server'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { env } from '@/env'
import { deleteFile, getPublicUrl, getSignedUrlForUpload } from '@/lib/storage'
import { s3Client } from '@/lib/storage/s3-client'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'
import { photos, photosInsertSchema } from '@/server/db/schema/photos'

export const photoRouter = createTRPCRouter({
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
          case 'cloudflare-r2': {
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
        case 'cloudflare-r2':
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
  // upsert photo - create or update
  upsertPhoto: protectedProcedure
    .input(z.object({ photo: photosInsertSchema }))
    .mutation(async ({ input }) => {
      const { photo } = input

      try {
        const [data] = await db
          .insert(photos)
          .values(photo)
          .onConflictDoUpdate({
            target: photos.id,
            set: {
              title: photo.title,
              description: photo.description,
              rating: photo.rating,
              isFavorite: photo.isFavorite,
              visibility: photo.visibility,
              latitude: photo.latitude,
              longitude: photo.longitude,
              gpsAltitude: photo.gpsAltitude,
              dateTimeOriginal: photo.dateTimeOriginal,
              country: photo.country,
              countryCode: photo.countryCode,
              region: photo.region,
              city: photo.city,
              district: photo.district,
              fullAddress: photo.fullAddress,
              placeFormatted: photo.placeFormatted,
              make: photo.make,
              model: photo.model,
              lensModel: photo.lensModel,
              focalLength: photo.focalLength,
              focalLength35mm: photo.focalLength35mm,
              fNumber: photo.fNumber,
              iso: photo.iso,
              exposureTime: photo.exposureTime,
              exposureCompensation: photo.exposureCompensation,
              updatedAt: new Date(),
            },
          })
          .returning()

        if (!data) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upsert photo',
          })
        }

        return {
          success: true,
          photo: data,
          isUpdate: !!photo.id,
        }
      } catch (error) {
        console.error('Upsert photo error:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upsert photo',
        })
      }
    }),
  // delete photo
  deletePhoto: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input

      const [photo] = await db
        .select()
        .from(photos)
        .where(eq(photos.id, id))
        .limit(1)

      if (!photo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Photo not found',
        })
      }

      // delete photo from database
      await db.delete(photos).where(eq(photos.id, id))

      // delete files from storage
      try {
        if (photo.url) {
          const originalKey = photo.url.split('/').pop()
          if (originalKey) {
            await deleteFile(s3Client, originalKey)
          }
        }

        if (photo.compressedUrl) {
          const compressedKey = photo.compressedUrl.split('/').pop()
          if (compressedKey) {
            await deleteFile(s3Client, compressedKey)
          }
        }
      } catch (error) {
        console.error('Failed to delete files from storage:', error)
      }

      return { success: true }
    }),
  // get photos list
  getPhotosList: protectedProcedure.query(async () => {
    const photosList = await db
      .select()
      .from(photos)
      .orderBy(desc(photos.createdAt))
    return {
      data: photosList,
    }
  }),
  // get essential photos list（bg rating > 2）
  getEssentialPhotosList: protectedProcedure.query(async () => {
    const photosList = await db
      .select()
      .from(photos)
      .orderBy(desc(photos.createdAt))
    return {
      data: photosList,
    }
  }),
})
