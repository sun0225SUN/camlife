import { eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import {
  SETTING_KEYS,
  settings,
  settingsInsertSchema,
  settingsUpdateSchema,
} from '@/server/db/schema/settings'

export const settingsRouter = createTRPCRouter({
  // Get all settings
  getAll: publicProcedure.query(async () => {
    const allSettings = await db.select().from(settings)

    // Convert to key-value pair format
    const settingsMap: Record<string, string> = {}
    allSettings.forEach((setting) => {
      settingsMap[setting.key] = setting.value
    })

    return settingsMap
  }),

  // Get public settings (for frontend display)
  getPublic: publicProcedure.query(async () => {
    const publicSettings = await db
      .select()
      .from(settings)
      .where(eq(settings.isPublic, true))

    const settingsMap: Record<string, string> = {}
    publicSettings.forEach((setting) => {
      settingsMap[setting.key] = setting.value
    })

    return settingsMap
  }),

  // Get settings by specific category
  getByCategory: publicProcedure
    .input(z.enum(['site', 'app', 'user', 'system']))
    .query(async ({ input: category }) => {
      const categorySettings = await db
        .select()
        .from(settings)
        .where(eq(settings.category, category))

      const settingsMap: Record<string, string> = {}
      categorySettings.forEach((setting) => {
        settingsMap[setting.key] = setting.value
      })

      return settingsMap
    }),

  // Get single setting
  getByKey: publicProcedure.input(z.string()).query(async ({ input: key }) => {
    const setting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1)

    return setting[0] || null
  }),

  // Get settings by keys
  getByKeys: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input: keys }) => {
      const settingsList = await db
        .select()
        .from(settings)
        .where(inArray(settings.key, keys))

      const settingsMap: Record<string, string> = {}
      settingsList.forEach((setting) => {
        settingsMap[setting.key] = setting.value
      })

      return settingsMap
    }),

  // Update setting (requires authentication)
  update: protectedProcedure
    .input(
      settingsUpdateSchema.extend({
        key: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const updatedSetting = await db
        .update(settings)
        .set({
          value: input.value,
          description: input.description,
          isPublic: input.isPublic,
          updatedAt: new Date(),
        })
        .where(eq(settings.key, input.key))
        .returning()

      return updatedSetting[0]
    }),

  // Batch update settings (requires authentication)
  updateBatch: protectedProcedure
    .input(
      z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      console.log('🔄 Batch updating settings:', input)
      const results = []

      for (const { key, value } of input) {
        console.log(`📝 Upserting setting: ${key} = ${value}`)

        // Determine category from key
        const category = key.startsWith('site.')
          ? 'site'
          : key.startsWith('app.')
            ? 'app'
            : key.startsWith('user.')
              ? 'user'
              : key.startsWith('system.')
                ? 'system'
                : 'system'

        // Use upsert (INSERT ... ON CONFLICT ... DO UPDATE)
        const upsertedSetting = await db
          .insert(settings)
          .values({
            key,
            category,
            value,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: settings.key,
            set: {
              value,
              updatedAt: new Date(),
            },
          })
          .returning()

        results.push(upsertedSetting[0])
        console.log(`✅ Setting upserted successfully:`, upsertedSetting[0])
      }

      console.log('🎉 Batch upsert completed:', results)
      return results
    }),

  // Create new setting (requires authentication)
  create: protectedProcedure
    .input(settingsInsertSchema)
    .mutation(async ({ input }) => {
      const newSetting = await db.insert(settings).values(input).returning()

      return newSetting[0]
    }),

  // Delete setting (requires authentication)
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: key }) => {
      await db.delete(settings).where(eq(settings.key, key))

      return { success: true }
    }),

  // Get site SEO data
  getSiteSEO: publicProcedure.query(async () => {
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
  }),
})
