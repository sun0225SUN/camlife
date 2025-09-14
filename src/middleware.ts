import { betterFetch } from '@better-fetch/fetch'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import type { Session } from '@/lib/auth'
import { routing } from './i18n/routing'
import { protectedRoute, SIGN_IN_PAGE } from './routes'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (protectedRoute(pathname)) {
    try {
      const { data: session } = await betterFetch<Session>(
        '/api/auth/get-session',
        {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
        },
      )

      if (!session) {
        const signInUrl = new URL(SIGN_IN_PAGE, request.url)
        return NextResponse.redirect(signInUrl)
      }
    } catch (error) {
      console.error('Session validation failed:', error)
      const signInUrl = new URL(SIGN_IN_PAGE, request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  const response = intlMiddleware(request)

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
