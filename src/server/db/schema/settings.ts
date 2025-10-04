import type { InferSelectModel } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { nanoid } from 'nanoid'
import { z } from 'zod'

export const settingCategory = pgEnum('setting_category', [
  'site',
  'app',
  'user',
  'system',
])

export const settings = pgTable('settings', {
  id: varchar('id', { length: 21 })
    .primaryKey()
    .$defaultFn(() => nanoid()),

  key: text('key').notNull().unique(),
  category: settingCategory('category').notNull(),
  value: text('value').notNull(),
  description: text('description'),
  isPublic: boolean('isPublic').default(false).notNull(), // Whether to display publicly

  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Schema for validation
export const settingsInsertSchema = createInsertSchema(settings).extend({
  key: z.string().min(1, { message: 'Key is required' }),
  value: z.string().min(1, { message: 'Value is required' }),
})

export const settingsSelectSchema = createSelectSchema(settings)
export const settingsUpdateSchema = createUpdateSchema(settings)
  .pick({
    key: true,
    value: true,
    description: true,
    isPublic: true,
  })
  .partial()

// Types
export type Setting = InferSelectModel<typeof settings>

// Predefined setting key constants
export const SETTING_KEYS = {
  // Site settings
  SITE_NAME: 'site.name',
  SITE_DESCRIPTION: 'site.description',
  SITE_KEYWORDS: 'site.keywords',
  SITE_LOGO: 'site.logo',
  SITE_FAVICON: 'site.favicon',

  // Application settings
  IMAGE_SIZE_LIMIT: 'app.image_size_limit',
  ENABLE_FILE_COMPRESSION: 'app.enable_file_compression',
  COMPRESS_QUALITY: 'app.compress_quality',
  DEFAULT_PHOTO_RATING: 'app.default_photo_rating',
  ADDRESS_LANGUAGE: 'app.address_language',
  PER_PAGE_PHOTOS_COUNT_INFINITE: 'app.per_page_photos_count_infinite',
  SHUFFLE_PHOTOS_COUNT: 'app.shuffle_photos_count',

  // User settings
  DEFAULT_PHOTO_VISIBILITY: 'user.default_photo_visibility',
  ENABLE_LOCATION_TRACKING: 'user.enable_location_tracking',

  // System settings
  MAINTENANCE_MODE: 'system.maintenance_mode',
  ANALYTICS_ENABLED: 'system.analytics_enabled',
} as const

// Default setting values
export const DEFAULT_SETTINGS = {
  [SETTING_KEYS.SITE_NAME]: 'CamLife',
  [SETTING_KEYS.SITE_DESCRIPTION]:
    'A platform focused on photography sharing and exploration',
  [SETTING_KEYS.SITE_KEYWORDS]: 'photography,photos,sharing,exploration,camera',
  [SETTING_KEYS.SITE_LOGO]: '',
  [SETTING_KEYS.SITE_FAVICON]: '/favicon.ico',

  [SETTING_KEYS.IMAGE_SIZE_LIMIT]: '10', // MB
  [SETTING_KEYS.ENABLE_FILE_COMPRESSION]: 'true',
  [SETTING_KEYS.COMPRESS_QUALITY]: '0.6',
  [SETTING_KEYS.DEFAULT_PHOTO_RATING]: '3',
  [SETTING_KEYS.ADDRESS_LANGUAGE]: 'zh',
  [SETTING_KEYS.PER_PAGE_PHOTOS_COUNT_INFINITE]: '10',
  [SETTING_KEYS.SHUFFLE_PHOTOS_COUNT]: '20',

  [SETTING_KEYS.DEFAULT_PHOTO_VISIBILITY]: 'private',
  [SETTING_KEYS.ENABLE_LOCATION_TRACKING]: 'true',

  [SETTING_KEYS.MAINTENANCE_MODE]: 'false',
  [SETTING_KEYS.ANALYTICS_ENABLED]: 'true',
} as const
