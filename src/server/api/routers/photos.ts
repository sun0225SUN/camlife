import { type Prisma } from "@prisma/client"
import { put } from "@vercel/blob"
import fs from "fs/promises"
import "mapbox-gl/dist/mapbox-gl.css"
import { nanoid } from "nanoid"
import os from "os"
import path from "path"
import { z } from "zod"
import { createPhotoSchema } from "~/lib/zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { calculateDistance } from "~/utils/calculateDistance"
import { compressImage } from "~/utils/compressImage"
import { generateBlurData } from "~/utils/genBlurData"

export const photosRouter = createTRPCRouter({
  getAllPhotos: publicProcedure
    .input(
      z.object({
        tab: z.enum(["essential", "recent", "shuffle", "nearby", "faraway"]),
        location: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().default(20),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { tab, location, cursor, limit } = input
      let photos
      let nextCursor: string | undefined

      const baseQuery: Prisma.photosFindManyArgs = {
        take: limit + 1,
        cursor: cursor ? { uuid: cursor } : undefined,
        orderBy: { createdAt: "asc" },
      }

      const fetchPhotos = async (query: Prisma.photosFindManyArgs) =>
        ctx.db.photos.findMany(query)

      switch (tab) {
        case "recent":
          photos = await fetchPhotos({
            ...baseQuery,
            orderBy: { takenAt: "desc" },
          })
          break
        case "shuffle":
          photos = await fetchPhotos(baseQuery)
          photos.sort(() => Math.random() - 0.5)
          break
        case "nearby":
        case "faraway":
          if (!location) {
            throw new Error("Location is required for nearby and faraway tabs")
          }
          const [userLat, userLon] = location.split(",").map(Number)
          const allPhotos = await fetchPhotos({
            ...baseQuery,
            where: {
              latitude: { not: 0 },
              longitude: { not: 0 },
            },
          })

          photos = allPhotos.map((photo) => ({
            ...photo,
            distance: calculateDistance(
              userLat!,
              userLon!,
              photo.latitude!,
              photo.longitude!,
            ),
          }))

          photos.sort((a, b) =>
            tab === "nearby"
              ? a.distance - b.distance
              : b.distance - a.distance,
          )
          break
        default:
          photos = await fetchPhotos(baseQuery)
      }

      if (photos.length > limit) {
        nextCursor = photos[limit]?.uuid
        photos = photos.slice(0, limit)
      }

      return { items: photos, nextCursor }
    }),

  getAllCoordinates: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.photos.findMany({
      select: {
        width: true,
        height: true,
        latitude: true,
        longitude: true,
        url: true,
        blurData: true,
      },
      where: {
        width: { not: 0 },
        height: { not: 0 },
        latitude: { not: 0 },
        longitude: { not: 0 },
        url: { not: "" },
        blurData: { not: "" },
      },
    })
  }),

  uploadChunk: publicProcedure
    .input(
      z.object({
        uploadId: z.string(),
        chunkIndex: z.number(),
        chunk: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { uploadId, chunkIndex, chunk } = input
      const chunkBuffer = Buffer.from(chunk, "base64")
      const tempDir = path.join(os.tmpdir(), uploadId)
      await fs.mkdir(tempDir, { recursive: true })
      await fs.writeFile(path.join(tempDir, `chunk_${chunkIndex}`), chunkBuffer)
      return { success: true }
    }),

  finalizeUpload: publicProcedure
    .input(z.object({ uploadId: z.string() }))
    .mutation(async ({ input }) => {
      const { uploadId } = input
      const tempDir = path.join(os.tmpdir(), uploadId)

      try {
        const chunks = await fs.readdir(tempDir)
        chunks.sort(
          (a, b) =>
            parseInt(a.split("_")[1] ?? "0") - parseInt(b.split("_")[1] ?? "0"),
        )

        const finalBuffer = Buffer.concat(
          await Promise.all(
            chunks.map((chunk) => fs.readFile(path.join(tempDir, chunk))),
          ),
        )

        const compressedBuffer = await compressImage(finalBuffer, 80, 0.5)

        const blurData = await generateBlurData(compressedBuffer)

        const blob = await put(`${uploadId}.webp`, compressedBuffer, {
          access: "public",
        })

        await fs.rm(tempDir, { recursive: true, force: true })

        return {
          success: true,
          url: blob.url,
          blurData,
        }
      } catch (error) {
        console.error("Error processing upload:", error)
        await fs
          .rm(tempDir, { recursive: true, force: true })
          .catch(console.error)
        throw error
      }
    }),

  createPhoto: protectedProcedure
    .input(createPhotoSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.photos.create({
        data: {
          ...input,
          uuid: nanoid(10),
        },
      })
    }),
})
