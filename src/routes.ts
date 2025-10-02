import { routing } from './i18n/routing'

export const SIGN_IN_PAGE = '/sign-in'
export const SIGN_UP_PAGE = '/sign-up'

export const EXPLORE_MAP_PAGE = '/explore'

export const DEFAULT_DASHBOARD_PAGE = '/dashboard/home'
export const DASHBOARD_HOME_PAGE = '/dashboard/home'
export const DASHBOARD_GALLERY_PAGE = '/dashboard/gallery'
export const DASHBOARD_PROFILE_PAGE = '/dashboard/profile'
export const DASHBOARD_TODO_PAGE = '/dashboard/todo'
export const DASHBOARD_PLAYGROUND_PAGE = '/playground'

/**
 * Remove the locale from the pathname
 * @param pathname - The pathname to remove the locale from
 * @returns The pathname without the locale
 */
export const withoutLocale = (pathname?: string) => {
  if (!pathname) return '/'

  const localePattern = routing.locales.join('|')

  return pathname.replace(new RegExp(`^/(${localePattern})/`), '/') || pathname
}
