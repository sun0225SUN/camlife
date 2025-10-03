import { TRPCError } from '@trpc/server'
import { desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { env } from '@/env'
import { deleteFile, getPublicUrl, getSignedUrlForUpload } from '@/lib/storage'
import { s3Client } from '@/lib/storage/s3-client'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import { photos, photosInsertSchema } from '@/server/db/schema/photos'

// common photo select fields
const photoSelectFields = {
  id: photos.id,
  url: photos.url,
  blurDataUrl: photos.blurDataUrl,
  compressedUrl: photos.compressedUrl,
  fileSize: photos.fileSize,
  compressedSize: photos.compressedSize,
  title: photos.title,
  description: photos.description,
  rating: photos.rating,
  isFavorite: photos.isFavorite,
  visibility: photos.visibility,
  width: photos.width,
  height: photos.height,
  aspectRatio: photos.aspectRatio,
  make: photos.make,
  model: photos.model,
  lensModel: photos.lensModel,
  focalLength: photos.focalLength,
  focalLength35mm: photos.focalLength35mm,
  fNumber: photos.fNumber,
  iso: photos.iso,
  exposureTime: photos.exposureTime,
  exposureCompensation: photos.exposureCompensation,
  latitude: photos.latitude,
  longitude: photos.longitude,
  gpsAltitude: photos.gpsAltitude,
  dateTimeOriginal: photos.dateTimeOriginal,
  country: photos.country,
  countryCode: photos.countryCode,
  region: photos.region,
  city: photos.city,
  district: photos.district,
  fullAddress: photos.fullAddress,
  placeFormatted: photos.placeFormatted,
  createdAt: photos.createdAt,
  updatedAt: photos.updatedAt,
}

// updatable photo fields (for upsert operation)
const updatablePhotoFields = (photo: z.infer<typeof photosInsertSchema>) => ({
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
})

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
            set: updatablePhotoFields(photo),
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
  // get essential photos list with infinite scroll support
  getEssentialPhotosInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input

      // query limit + 1 records to check if there is more data
      const photosList = await db
        .select()
        .from(photos)
        .where(
          sql`${photos.visibility} = 'public' ${
            cursor
              ? sql`AND (${photos.rating} < ${cursor.split(',')[0]}::integer OR (${photos.rating} = ${cursor.split(',')[0]}::integer AND ${photos.createdAt} < ${cursor.split(',')[1]}::timestamp))`
              : sql``
          }`,
        )
        .orderBy(desc(photos.rating), desc(photos.createdAt))
        .limit(limit + 1)

      let nextCursor: string | undefined
      let hasMore = false

      // if the number of returned records is greater than limit, there is more data
      if (photosList.length > limit) {
        hasMore = true
        // remove the last record
        photosList.pop()
        // use the rating and createdAt of the last record as the next page cursor
        const lastItem = photosList[photosList.length - 1]
        nextCursor = `${lastItem?.rating},${lastItem?.createdAt.toISOString()}`
      }

      return {
        items: photosList,
        nextCursor: hasMore ? nextCursor : undefined,
      }
    }),
  // get shuffled photos list
  getShuffledPhotosList: publicProcedure.query(async () => {
    const photosList = await db
      .select()
      .from(photos)
      .where(eq(photos.visibility, 'public'))
      .orderBy(sql`RANDOM()`)
    return {
      data: photosList,
    }
  }),
  // get nearby photos list (photos with GPS coordinates)
  getNearbyPhotosList: publicProcedure.query(async () => {
    const photosList = await db
      .select()
      .from(photos)
      .where(
        sql`${photos.visibility} = 'public' AND ${photos.latitude} IS NOT NULL AND ${photos.longitude} IS NOT NULL`,
      )
      .orderBy(desc(photos.createdAt))
    return {
      data: photosList,
    }
  }),
  // get nearby photos list based on user location
  getNearbyPhotosByLocation: publicProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ input }) => {
      const { latitude, longitude, limit } = input

      // Use Haversine formula in SQL to calculate distance
      const photosList = await db
        .select({
          ...photoSelectFields,
          distance: sql<number>`
            ROUND(
              6371 * acos(
                cos(radians(${latitude})) *
                cos(radians("photos"."latitude")) *
                cos(radians("photos"."longitude") - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians("photos"."latitude"))
              )::numeric, 2
            )
          `,
        })
        .from(photos)
        .where(
          sql`
            ${photos.visibility} = 'public'
            AND ${photos.latitude} IS NOT NULL
            AND ${photos.longitude} IS NOT NULL
          `,
        )
        .orderBy(sql`
          6371 * acos(
            cos(radians(${latitude})) *
            cos(radians("photos"."latitude")) *
            cos(radians("photos"."longitude") - radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians("photos"."latitude"))
          )
        `)
        .limit(limit)

      return {
        data: photosList,
        userLocation: { latitude, longitude },
      }
    }),
  // get faraway photos list (photos without GPS coordinates or from different countries)
  getFarawayPhotosList: publicProcedure.query(async () => {
    const photosList = await db
      .select()
      .from(photos)
      .where(
        sql`${photos.visibility} = 'public' AND (${photos.latitude} IS NULL OR ${photos.longitude} IS NULL OR ${photos.country} IS NOT NULL)`,
      )
      .orderBy(desc(photos.createdAt))
    return {
      data: photosList,
    }
  }),
  // get faraway photos list based on user location (photos far from user)
  getFarawayPhotosByLocation: publicProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ input }) => {
      const { latitude, longitude, limit } = input

      // Get photos that are far from user location
      const photosList = await db
        .select({
          ...photoSelectFields,
          distance: sql<number>`
            ROUND(
              6371 * acos(
                cos(radians(${latitude})) *
                cos(radians("photos"."latitude")) *
                cos(radians("photos"."longitude") - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians("photos"."latitude"))
              )::numeric, 2
            )
          `,
        })
        .from(photos)
        .where(
          sql`
            ${photos.visibility} = 'public'
            AND ${photos.latitude} IS NOT NULL 
            AND ${photos.longitude} IS NOT NULL
          `,
        )
        .orderBy(sql`
          6371 * acos(
            cos(radians(${latitude})) *
            cos(radians("photos"."latitude")) *
            cos(radians("photos"."longitude") - radians(${longitude})) +
            sin(radians(${latitude})) *
            sin(radians("photos"."latitude"))
          ) DESC
        `)
        .limit(limit)

      return {
        data: photosList,
        userLocation: { latitude, longitude },
      }
    }),
  // get explore photos list with infinite scroll support
  getExplorePhotosInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input

      // query limit + 1 records to check if there is more data
      const photosList = await db
        .select()
        .from(photos)
        .where(
          sql`${photos.visibility} = 'public' ${
            cursor
              ? sql`AND (${photos.rating} < ${cursor.split(',')[0]}::integer OR (${photos.rating} = ${cursor.split(',')[0]}::integer AND ${photos.createdAt} < ${cursor.split(',')[1]}::timestamp))`
              : sql``
          }`,
        )
        .orderBy(desc(photos.rating), desc(photos.createdAt))
        .limit(limit + 1)

      let nextCursor: string | undefined
      let hasMore = false

      // if the number of returned records is greater than limit, there is more data
      if (photosList.length > limit) {
        hasMore = true
        // remove the last record
        photosList.pop()
        // use the rating and createdAt of the last record as the next page cursor
        const lastItem = photosList[photosList.length - 1]
        nextCursor = `${lastItem?.rating},${lastItem?.createdAt.toISOString()}`
      }

      return {
        items: photosList,
        nextCursor: hasMore ? nextCursor : undefined,
      }
    }),
  // get shuffled photos list with infinite scroll support
  getShuffledPhotosInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async () => {
      // Get up to 20 random public photos, no pagination
      const photosList = await db
        .select()
        .from(photos)
        .where(eq(photos.visibility, 'public'))
        .orderBy(sql`RANDOM()`)
        .limit(20)

      // Return as if it's a single page with no more data
      return {
        items: photosList,
        nextCursor: undefined, // No pagination
      }
    }),
  // get nearby photos list with infinite scroll support
  getNearbyPhotosInfinite: publicProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { latitude, longitude, limit, cursor } = input

      // Parse cursor to get distance and createdAt
      let cursorDistance: number | undefined
      let cursorCreatedAt: string | undefined
      if (cursor) {
        const [distanceStr, createdAtStr] = cursor.split(',')
        cursorDistance = distanceStr ? parseFloat(distanceStr) : undefined
        cursorCreatedAt = createdAtStr || undefined
      }

      const photosList = await db
        .select({
          ...photoSelectFields,
          distance: sql<number>`
            ROUND(
              6371 * acos(
                cos(radians(${latitude})) *
                cos(radians("photos"."latitude")) *
                cos(radians("photos"."longitude") - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians("photos"."latitude"))
              )::numeric, 2
            )
          `,
        })
        .from(photos)
        .where(
          sql`
            ${photos.visibility} = 'public'
            AND ${photos.latitude} IS NOT NULL
            AND ${photos.longitude} IS NOT NULL
            ${
              cursor
                ? sql`AND (
              (6371 * acos(
                cos(radians(${latitude})) *
                cos(radians("photos"."latitude")) *
                cos(radians("photos"."longitude") - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians("photos"."latitude"))
              )) > ${cursorDistance}
              OR (
                (6371 * acos(
                  cos(radians(${latitude})) *
                  cos(radians("photos"."latitude")) *
                  cos(radians("photos"."longitude") - radians(${longitude})) +
                  sin(radians(${latitude})) *
                  sin(radians("photos"."latitude"))
                )) = ${cursorDistance}
                AND ${photos.createdAt} < ${cursorCreatedAt}::timestamp
              )
            )`
                : sql``
            }
          `,
        )
        .orderBy(
          sql`
            6371 * acos(
              cos(radians(${latitude})) *
              cos(radians("photos"."latitude")) *
              cos(radians("photos"."longitude") - radians(${longitude})) +
              sin(radians(${latitude})) *
              sin(radians("photos"."latitude"))
            )
          `,
          desc(photos.createdAt),
        )
        .limit(limit + 1)

      let nextCursor: string | undefined
      let hasMore = false

      if (photosList.length > limit) {
        hasMore = true
        photosList.pop()
        const lastItem = photosList[photosList.length - 1]
        nextCursor = `${lastItem?.distance},${lastItem?.createdAt.toISOString()}`
      }

      return {
        items: photosList,
        nextCursor: hasMore ? nextCursor : undefined,
      }
    }),
  // get faraway photos list with infinite scroll support
  getFarawayPhotosInfinite: publicProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { latitude, longitude, limit, cursor } = input

      // Parse cursor to get distance and createdAt
      let cursorDistance: number | undefined
      let cursorCreatedAt: string | undefined
      if (cursor) {
        const [distanceStr, createdAtStr] = cursor.split(',')
        cursorDistance = distanceStr ? parseFloat(distanceStr) : undefined
        cursorCreatedAt = createdAtStr || undefined
      }

      const photosList = await db
        .select({
          ...photoSelectFields,
          distance: sql<number>`
            ROUND(
              6371 * acos(
                cos(radians(${latitude})) *
                cos(radians("photos"."latitude")) *
                cos(radians("photos"."longitude") - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians("photos"."latitude"))
              )::numeric, 2
            )
          `,
        })
        .from(photos)
        .where(
          sql`
            ${photos.visibility} = 'public'
            AND ${photos.latitude} IS NOT NULL
            AND ${photos.longitude} IS NOT NULL
            ${
              cursor
                ? sql`AND (
              (6371 * acos(
                cos(radians(${latitude})) *
                cos(radians("photos"."latitude")) *
                cos(radians("photos"."longitude") - radians(${longitude})) +
                sin(radians(${latitude})) *
                sin(radians("photos"."latitude"))
              )) < ${cursorDistance}
              OR (
                (6371 * acos(
                  cos(radians(${latitude})) *
                  cos(radians("photos"."latitude")) *
                  cos(radians("photos"."longitude") - radians(${longitude})) +
                  sin(radians(${latitude})) *
                  sin(radians("photos"."latitude"))
                )) = ${cursorDistance}
                AND ${photos.createdAt} < ${cursorCreatedAt}::timestamp
              )
            )`
                : sql``
            }
          `,
        )
        .orderBy(
          sql`
            6371 * acos(
              cos(radians(${latitude})) *
              cos(radians("photos"."latitude")) *
              cos(radians("photos"."longitude") - radians(${longitude})) +
              sin(radians(${latitude})) *
              sin(radians("photos"."latitude"))
            ) DESC
          `,
          desc(photos.createdAt),
        )
        .limit(limit + 1)

      let nextCursor: string | undefined
      let hasMore = false

      if (photosList.length > limit) {
        hasMore = true
        photosList.pop()
        const lastItem = photosList[photosList.length - 1]
        nextCursor = `${lastItem?.distance},${lastItem?.createdAt.toISOString()}`
      }

      return {
        items: photosList,
        nextCursor: hasMore ? nextCursor : undefined,
      }
    }),
  // get recent photos list with infinite scroll support
  getRecentPhotosInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input

      const photosList = await db
        .select()
        .from(photos)
        .where(
          sql`${photos.visibility} = 'public' ${
            cursor ? sql`AND ${photos.createdAt} < ${cursor}::timestamp` : sql``
          }`,
        )
        .orderBy(desc(photos.createdAt))
        .limit(limit + 1)

      let nextCursor: string | undefined
      let hasMore = false

      if (photosList.length > limit) {
        hasMore = true
        photosList.pop()
        const lastItem = photosList[photosList.length - 1]
        nextCursor = lastItem?.createdAt.toISOString()
      }

      return {
        items: photosList,
        nextCursor: hasMore ? nextCursor : undefined,
      }
    }),
  // get all coordinates for map display
  getAllCoordinates: publicProcedure.query(async () => {
    const coordinatesList = await db
      .select({
        longitude: photos.longitude,
        latitude: photos.latitude,
        url: photos.url,
        compressedUrl: photos.compressedUrl,
        blurData: photos.blurDataUrl,
        width: photos.width,
        height: photos.height,
      })
      .from(photos)
      .where(
        sql`${photos.visibility} = 'public' AND ${photos.latitude} IS NOT NULL AND ${photos.longitude} IS NOT NULL`,
      )
      .orderBy(desc(photos.createdAt))

    return coordinatesList
  }),
})
