import type { NextAuthConfig, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { env } from "~/env"
import { signInSchema } from "~/lib/zod"

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = await signInSchema.parseAsync(credentials)
        if (
          env.ADMIN_EMAIL &&
          env.ADMIN_EMAIL === email &&
          env.ADMIN_PASSWORD &&
          env.ADMIN_PASSWORD === password
        ) {
          const user: User = { email, name: "Admin User" }
          return user
        } else {
          return null
        }
      },
    }),
  ],
} satisfies NextAuthConfig
