import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"

export const locales: string[] = ["zh", "en"]

export type Locale = (typeof locales)[number]

export const defaultLocale = "zh"

export const nameMap: Record<string, string> = {
  zh: "简体中文",
  en: "English",
}

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound()

  return {
    // eslint-disable-next-line
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
