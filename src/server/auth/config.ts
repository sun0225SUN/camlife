import type { NextAuthConfig, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { env } from "~/env"

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = await z
          .object({
            email: z
              .string({ required_error: "Email is required" })
              .min(1, "Email is required")
              .email("Invalid email"),
            password: z
              .string({ required_error: "Password is required" })
              .min(8, "Password must be more than 8 characters")
              .max(32, "Password must be less than 32 characters"),
          })
          .parseAsync(credentials)

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
