import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import { db } from "~/server/db"
import authConfig from "./config"

export const KEY_CALLBACK_URL = "callbackUrl"
export const KEY_CREDENTIALS_SIGN_IN_ERROR_URL =
  "https://errors.authjs.dev#credentialssignin"
export const KEY_CREDENTIALS_CALLBACK_ROUTE_ERROR_URL =
  "https://errors.authjs.dev#callbackrouteerror"

// https://authjs.dev/getting-started/authentication/credentials
// https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(db),
  ...authConfig,
})
