import { nanoid } from "nanoid"
import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { generateBlurredImageData } from "~/utils/genBlurData"

export const photosRouter = createTRPCRouter({
  getAllPhotos: publicProcedure.query(({ ctx }) => {
    return ctx.db.photos.findMany()
  }),
  genBlurData: publicProcedure
    .input(
      z.object({
        // base64 data or http link
        data: z.string(),
        isBase64: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return generateBlurredImageData(input.data, input.isBase64 ?? false)
    }),
  createPhoto: publicProcedure
    .input(
      z.object({
        url: z.string().max(255),
        width: z.number(),
        height: z.number(),
        blurData: z.string().max(100000),
        aspectRatio: z.number(),
        focalLength: z.number(),
        focalLengthIn35mmFormat: z.number(),
        fNumber: z.number(),
        iso: z.number(),
        exposureTime: z.number(),
        exposureCompensation: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        locationName: z.string().max(100),
        filmSimulation: z.string().max(50),
        priorityOrder: z.number(),
        takenAt: z.date(),
        takenAtNaive: z.string(),
        hidden: z.boolean(),
        extension: z.string().max(10),
        title: z.string().max(100),
        caption: z.string().max(500),
        semanticDescription: z.string().max(1000),
        tags: z.array(z.string().max(50)),
        make: z.string().max(50),
        model: z.string().max(50),
        lensMake: z.string().max(50),
        lensModel: z.string().max(50),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.photos.create({
        data: {
          ...input,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          uuid: nanoid(10),
        },
      })
    }),
})
