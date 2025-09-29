import type { Config } from 'drizzle-kit'
import { env } from './src/env'

export default {
  schema: './src/server/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ['camlife_*'],
} satisfies Config
