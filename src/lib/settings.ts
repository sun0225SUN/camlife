import { eq, inArray } from 'drizzle-orm'
import { db } from '@/server/db'
import { SETTING_KEYS, settings } from '@/server/db/schema/settings'
import type { SiteSEOData } from '@/types'

export async function getSiteSEOData(): Promise<SiteSEOData> {
  const seoKeys = [
    SETTING_KEYS.SITE_NAME,
    SETTING_KEYS.SITE_DESCRIPTION,
    SETTING_KEYS.SITE_KEYWORDS,
    SETTING_KEYS.SITE_LOGO,
    SETTING_KEYS.SITE_FAVICON,
  ]

  const seoSettings = await db
    .select()
    .from(settings)
    .where(inArray(settings.key, seoKeys))

  const seoData: Record<string, string> = {}
  seoSettings.forEach((setting) => {
    seoData[setting.key] = setting.value
  })

  return {
    title: seoData[SETTING_KEYS.SITE_NAME] || 'CamLife',
    description:
      seoData[SETTING_KEYS.SITE_DESCRIPTION] ||
      'A platform focused on photography sharing and exploration',
    keywords:
      seoData[SETTING_KEYS.SITE_KEYWORDS] ||
      'photography,photos,sharing,exploration,camera',
    logo: seoData[SETTING_KEYS.SITE_LOGO] || '',
    favicon: seoData[SETTING_KEYS.SITE_FAVICON] || '/favicon.ico',
  }
}

export async function getSettingByKey(key: string): Promise<string | null> {
  const setting = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1)

  return setting[0]?.value || null
}

export async function getSettingsByCategory(
  category: 'site' | 'app' | 'user' | 'system',
): Promise<Record<string, string>> {
  const categorySettings = await db
    .select()
    .from(settings)
    .where(eq(settings.category, category))

  const settingsMap: Record<string, string> = {}
  categorySettings.forEach((setting) => {
    settingsMap[setting.key] = setting.value
  })

  return settingsMap
}
