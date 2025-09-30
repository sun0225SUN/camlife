CREATE TYPE "public"."photo_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "city_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"city" text NOT NULL,
	"photo_count" integer DEFAULT 0 NOT NULL,
	"cover_photo_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"blur_data_url" text NOT NULL,
	"compressed_url" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"visibility" "photo_visibility" DEFAULT 'private' NOT NULL,
	"width" real NOT NULL,
	"height" real NOT NULL,
	"aspect_ratio" real NOT NULL,
	"make" varchar(255),
	"model" varchar(255),
	"lens_model" varchar(255),
	"focal_length" real,
	"focal_length_35mm" real,
	"f_number" real,
	"iso" integer,
	"exposure_time" real,
	"exposure_compensation" real,
	"latitude" real,
	"longitude" real,
	"gps_altitude" real,
	"datetime_original" timestamp,
	"country" text,
	"country_code" text,
	"region" text,
	"city" text,
	"district" text,
	"full_address" text,
	"place_formatted" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "city_sets" ADD CONSTRAINT "city_sets_cover_photo_id_photos_id_fk" FOREIGN KEY ("cover_photo_id") REFERENCES "public"."photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_city_set" ON "city_sets" USING btree ("country","city");--> statement-breakpoint
CREATE INDEX "year_idx" ON "photos" USING btree (DATE_TRUNC('year', "datetime_original"));--> statement-breakpoint
CREATE INDEX "city_idx" ON "photos" USING btree ("city");