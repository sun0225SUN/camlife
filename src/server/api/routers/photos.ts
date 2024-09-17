import { type Prisma } from "@prisma/client"
import "mapbox-gl/dist/mapbox-gl.css"
import { nanoid } from "nanoid"
import { z } from "zod"
import { photoSchema } from "~/lib/zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { calculateDistance } from "~/utils/calculateDistance"
import { compressBase64Image } from "~/utils/compressImage"
import { generateBlurredImageData } from "~/utils/genBlurData"

const inputSchema = z.object({
  tab: z.enum(["essential", "recent", "shuffle", "nearby", "faraway"]),
  location: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().default(20),
})

export const photosRouter = createTRPCRouter({
  getAllPhotos: publicProcedure
    .input(inputSchema)
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

  genBlurData: publicProcedure
    .input(
      z.object({
        data: z.string(),
        isBase64: z.boolean().optional(),
      }),
    )
    .mutation(({ input }) =>
      generateBlurredImageData(input.data, input.isBase64 ?? false),
    ),

  compressImage: publicProcedure
    .input(z.object({ data: z.string() }))
    .mutation(({ input }) => compressBase64Image(input.data)),

  createPhoto: protectedProcedure
    .input(photoSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.photos.create({
        data: {
          ...input,
          uuid: nanoid(10),
        },
      })
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
})
