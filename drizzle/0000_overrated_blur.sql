CREATE TYPE "public"."photo_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city_sets" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"description" text,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"city" text NOT NULL,
	"photo_count" integer DEFAULT 0 NOT NULL,
	"cover_photo_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"blur_data_url" text NOT NULL,
	"compressed_url" text,
	"file_size" integer,
	"compressed_size" integer,
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
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_sets" ADD CONSTRAINT "city_sets_cover_photo_id_photos_id_fk" FOREIGN KEY ("cover_photo_id") REFERENCES "public"."photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_city_set" ON "city_sets" USING btree ("country","city");--> statement-breakpoint
CREATE INDEX "year_idx" ON "photos" USING btree (DATE_TRUNC('year', "datetime_original"));--> statement-breakpoint
CREATE INDEX "city_idx" ON "photos" USING btree ("city");