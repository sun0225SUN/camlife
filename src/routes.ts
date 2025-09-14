import { routing } from '@/i18n/routing'

export const SIGN_IN_PAGE = '/sign-in'
export const DASHBOARD_PAGE = '/dashboard'

const protectedRoutes = ['/dashboard']

/**
 * Check if the pathname is a protected route
 * @param pathname - The pathname to check
 * @returns True if the pathname is a protected route, false otherwise
 */
export const protectedRoute = (pathname?: string) => {
  if (!pathname) return false

  const localePattern = routing.locales.join('|')
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/(${localePattern})/`), '/') || pathname
  return protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))
}
