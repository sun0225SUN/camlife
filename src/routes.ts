export const PATH_ADMIN = "/admin"

export const DEFAULT_LOGIN_REDIRECT = "/admin"

export const authRoutes = ["/login"]

export const publicRoutes = ["/"]

export const apiAuthPrefix = "/api/auth"

export const checkPathPrefix = (pathname = "", prefix: string) =>
  pathname.toLowerCase().startsWith(prefix)

export const protectedRoutes = (pathname?: string) =>
  checkPathPrefix(pathname, PATH_ADMIN)
