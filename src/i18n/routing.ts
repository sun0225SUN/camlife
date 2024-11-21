import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const locales: string[] = ["zh", "en"]

export type Locale = (typeof locales)[number]

export const defaultLocale = "zh"

export const nameMap: Record<string, string> = {
  zh: "简体中文",
  en: "English",
}

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "zh"],

  // Used when no locale matches
  defaultLocale: "en",

  // no prefix
  localePrefix: "never",
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
