import NextAuth from "next-auth"
import createMiddleware from "next-intl/middleware"
import { defaultLocale, locales } from "~/i18n"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  protectedRoute,
} from "~/routes"
import authConfig from "~/server/auth/config"

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "never",
})

const { auth } = NextAuth(authConfig)

// https://authjs.dev/getting-started/migrating-to-v5#details
// eslint-disable-next-line
// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isProtectedRoute = protectedRoute(nextUrl.pathname)

  // Skip API routes
  if (isApiAuthRoute) return null

  // Redirect to the default login redirect if the user is already logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
  }

  // Redirect to login page if user is not logged in
  if (isProtectedRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    )
  }
  return intlMiddleware(req)
})

export const config = {
  // Optionally, don't invoke Middleware on some paths
  matcher: [
    // Skip all paths that should not be internationalized.
    "/((?!api|_next/static|_next/image|img/|favicon.ico).*)",
  ],
}
