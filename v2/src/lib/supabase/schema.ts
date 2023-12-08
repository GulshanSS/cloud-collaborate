import { pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const cloudCollaborateV2 = pgSchema("cloud-collaborate-v2");

export const workspaces = cloudCollaborateV2.table("workspaces", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_At", {
    withTimezone: true,
    mode: "string",
  }),
  workspaceOwner: uuid("workspace_owner").notNull(),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
});

export const folders = cloudCollaborateV2.table("folders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_At", {
    withTimezone: true,
    mode: "string",
  }),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
});

export const files = cloudCollaborateV2.table("files", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdAt: timestamp("created_At", {
    withTimezone: true,
    mode: "string",
  }),
  title: text("title").notNull(),
  iconId: text("icon_id").notNull(),
  data: text("data"),
  inTrash: text("in_trash"),
  logo: text("logo"),
  bannerUrl: text("banner_url"),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "cascade",
  }),
  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),
});


