import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { db } from "~/server/db"
import authConfig from "./config"

// https://authjs.dev/getting-started/authentication/credentials
// https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
