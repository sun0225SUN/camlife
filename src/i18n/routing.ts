import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const locales: string[] = ["en", "zh"]

export type Locale = (typeof locales)[number]

export const defaultLocale = "en"

export const localeMap: Record<string, string> = {
  en: "English",
  zh: "简体中文",
}

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  // hide local prefix
  localePrefix: "never",
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
