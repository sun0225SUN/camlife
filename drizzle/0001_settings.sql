CREATE TYPE "public"."setting_category" AS ENUM('site', 'app', 'user', 'system');--> statement-breakpoint
CREATE TABLE "settings" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"category" "setting_category" NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"isPublic" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
