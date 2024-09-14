import { nanoid } from "nanoid"
import { z } from "zod"
import { photoSchema } from "~/lib/zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { calculateDistance } from "~/utils/calculateDistance"
import { compressBase64Image } from "~/utils/compressImage"
import { generateBlurredImageData } from "~/utils/genBlurData"

export const photosRouter = createTRPCRouter({
  getAllPhotos: publicProcedure
    .input(z.object({ tab: z.string(), location: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      switch (input.tab) {
        case "essential":
          return ctx.db.photos.findMany({})
        case "recent":
          return ctx.db.photos.findMany({
            orderBy: {
              id: "desc",
            },
          })
        case "shuffle":
          const photos = await ctx.db.photos.findMany()
          return photos.sort(() => Math.random() - 0.5)
        case "nearby":
        case "faraway":
          if (!input.location) {
            throw new Error("Location is required for nearby and faraway tabs")
          }
          const [userLat, userLon] = input.location.split(",").map(Number)
          const allPhotos = await ctx.db.photos.findMany({
            where: {
              latitude: { not: 0 },
              longitude: { not: 0 },
            },
          })

          const photosWithDistance = allPhotos.map((photo) => ({
            ...photo,
            distance: calculateDistance(
              userLat!,
              userLon!,
              photo.latitude!,
              photo.longitude!,
            ),
          }))

          photosWithDistance.sort((a, b) =>
            input.tab === "nearby"
              ? a.distance - b.distance
              : b.distance - a.distance,
          )

          return photosWithDistance
        default:
          return ctx.db.photos.findMany({})
      }
    }),

  genBlurData: publicProcedure
    .input(
      z.object({
        data: z.string(), // base64 data or http link
        isBase64: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) =>
      generateBlurredImageData(input.data, input.isBase64 ?? false),
    ),

  compressImage: publicProcedure
    .input(z.object({ data: z.string() })) // base64 data
    .mutation(async ({ input }) => compressBase64Image(input.data)),

  createPhoto: publicProcedure
    .input(photoSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.photos.create({
        data: {
          ...input,
          uuid: nanoid(10),
        },
      })
    }),
})
