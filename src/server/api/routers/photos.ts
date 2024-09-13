import { nanoid } from "nanoid"
import { z } from "zod"
import { photoSchema } from "~/lib/zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { compressBase64Image } from "~/utils/compressImage"
import { generateBlurredImageData } from "~/utils/genBlurData"

export const photosRouter = createTRPCRouter({
  getAllPhotos: publicProcedure
    .input(z.object({ tab: z.string() }))
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
