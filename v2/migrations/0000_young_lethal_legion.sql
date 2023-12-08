CREATE SCHEMA "cloud-collaborate-v2";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cloud-collaborate-v2"."workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_At" timestamp with time zone,
	"workspace_owner" uuid NOT NULL,
	"title" text NOT NULL,
	"icon_id" text NOT NULL,
	"data" text,
	"in_trash" text,
	"logo" text,
	"banner_url" text
);
