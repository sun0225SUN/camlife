import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    DATABASE_URL: z.url(),
    // Storage provider
    STORAGE_PROVIDER: z
      .enum(['cloudflare-r2', 'aws-s3', 'vercel-blob'])
      .default('cloudflare-r2'),
    // Cloudflare R2 存储配置
    CLOUDFLARE_R2_ENDPOINT: z.url(),
    CLOUDFLARE_R2_BUCKET: z.string(),
    CLOUDFLARE_R2_REGION: z.string().default('auto'),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
    CLOUDFLARE_R2_PREFIX: z.string().default('camlife'),
    CLOUDFLARE_R2_PUBLIC_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
    NEXT_PUBLIC_UMAMI_ANALYTICS_ID: z.string().optional(),
    NEXT_PUBLIC_UMAMI_ANALYTICS_JS: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    // Storage provider
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
    // Cloudflare R2
    CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
    CLOUDFLARE_R2_BUCKET: process.env.CLOUDFLARE_R2_BUCKET,
    CLOUDFLARE_R2_REGION: process.env.CLOUDFLARE_R2_REGION,
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY:
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_PREFIX: process.env.CLOUDFLARE_R2_PREFIX,
    CLOUDFLARE_R2_PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_UMAMI_ANALYTICS_ID: process.env.NEXT_PUBLIC_UMAMI_ANALYTICS_ID,
    NEXT_PUBLIC_UMAMI_ANALYTICS_JS: process.env.NEXT_PUBLIC_UMAMI_ANALYTICS_JS,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
