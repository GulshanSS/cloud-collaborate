ALTER TABLE "cloud-collaborate-v2"."files" ALTER COLUMN "created_At" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."files" ALTER COLUMN "created_At" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."folders" ALTER COLUMN "created_At" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."folders" ALTER COLUMN "created_At" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."workspaces" ALTER COLUMN "created_At" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "cloud-collaborate-v2"."workspaces" ALTER COLUMN "created_At" SET NOT NULL;