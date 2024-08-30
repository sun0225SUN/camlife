import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const photosRouter = createTRPCRouter({
  getAllPost: publicProcedure.query(({ ctx }) => {
    return ctx.db.photos.findMany()
  }),
  helloAdmin: protectedProcedure.query(() => {
    return "你好，管理员"
  }),
})
