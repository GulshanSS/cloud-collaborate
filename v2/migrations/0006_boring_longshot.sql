ALTER TABLE "cloud-collaborate-v2"."files" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."files" ALTER COLUMN "folder_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."folders" ALTER COLUMN "workspace_id" SET NOT NULL;