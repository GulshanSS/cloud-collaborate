CREATE TABLE IF NOT EXISTS "cloud-collaborate-v2"."collborators" (
	"workspace_id" uuid NOT NULL,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cloud-collaborate-v2"."collborators" ADD CONSTRAINT "collborators_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "cloud-collaborate-v2"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cloud-collaborate-v2"."collborators" ADD CONSTRAINT "collborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "cloud-collaborate-v2"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
