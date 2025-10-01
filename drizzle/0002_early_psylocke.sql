ALTER TABLE "city_sets" ALTER COLUMN "id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "city_sets" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "city_sets" ALTER COLUMN "cover_photo_id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "photos" ALTER COLUMN "id" SET DATA TYPE varchar(21);--> statement-breakpoint
ALTER TABLE "photos" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "compressed_size" integer;