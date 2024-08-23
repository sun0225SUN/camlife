import createNextIntlPlugin from "next-intl/plugin"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js")

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://react-svgr.com/docs/next/
  // https://github.com/vercel/next.js/issues/48177#issuecomment-1506251112
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    })
    return config
  },
}

export default withNextIntl(nextConfig)
