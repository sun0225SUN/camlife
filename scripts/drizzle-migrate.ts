#!/usr/bin/env bun

/**
 * Minimal database migration script
 * For PostgreSQL + Drizzle ORM
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// Get current file directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  console.log('🔄 Starting database migration...')

  // Get database connection string
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable not set')
    process.exit(1)
  }

  console.log(
    '📍 Database connection:',
    databaseUrl.replace(/:[^:]*@/, ':***@'),
  ) // Hide password

  // Create database connection
  const connection = postgres(databaseUrl, {
    max: 1,
    onnotice: () => {}, // Silent notifications
  })

  const db = drizzle(connection)

  try {
    // Execute migrations
    const migrationsFolder = path.join(__dirname, '..', 'drizzle')
    console.log('📁 Migrations folder:', migrationsFolder)

    await migrate(db, {
      migrationsFolder,
    })

    console.log('✅ Database migration completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    // Close database connection
    await connection.end()
  }
}

// Run migration
main().catch((error) => {
  console.error('❌ Migration script execution failed:', error)
  process.exit(1)
})
