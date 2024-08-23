import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const postRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return "hello world"
  }),
  helloAdmin: protectedProcedure.query(() => {
    return "Hello Admin"
  }),
})
