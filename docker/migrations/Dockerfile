# Use Bun's official image as the base image
FROM oven/bun:1 AS base

WORKDIR /app

RUN bun install drizzle-orm postgres

# Builder stage: Prepare migration environment
FROM base AS builder

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

COPY . .

# Execute database migration script
CMD ["bun", "scripts/drizzle-migrate.ts"]