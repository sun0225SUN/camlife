import createMiddleware from "next-intl/middleware"
import { defaultLocale, locales } from "~/i18n"

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  // The directory where the translations are stored
  localePrefix: "never",
})

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Skip all paths that should not be internationalized. This example skips the
    // folders "api", "_next", "_vercel"
    "/((?!api|_next/static|_next/image|img/|favicon.ico).*)",
  ],
}
