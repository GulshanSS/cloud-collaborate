import { pgSchema, pgEnum, uuid, timestamp, text, foreignKey, jsonb, boolean, bigint, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const pricingType = pgEnum("pricing_type", ['one_time', 'recurring'])
export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['day', 'week', 'month', 'year'])
export const subscriptionStatus = pgEnum("subscription_status", ['trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'])

export const cloudCollaborateV2 = pgSchema("cloud-collaborate-v2");

export const workspaces = cloudCollaborateV2.table("workspaces", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_At", { withTimezone: true, mode: 'string' }),
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
	createdAt: timestamp("created_At", { withTimezone: true, mode: 'string' }),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	logo: text("logo"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" } ),
});

export const files = cloudCollaborateV2.table("files", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_At", { withTimezone: true, mode: 'string' }),
	title: text("title").notNull(),
	iconId: text("icon_id").notNull(),
	data: text("data"),
	inTrash: text("in_trash"),
	logo: text("logo"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" } ),
	folderId: uuid("folder_id").references(() => folders.id, { onDelete: "cascade" } ),
});

export const users = cloudCollaborateV2.table("users", {
	id: uuid("id").primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	billingAddress: jsonb("billing_address"),
	paymentMethod: jsonb("payment_method"),
	email: text("email"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const customers = cloudCollaborateV2.table("customers", {
	id: uuid("id").primaryKey().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
});

export const products = cloudCollaborateV2.table("products", {
	id: text("id").primaryKey().notNull(),
	active: boolean("active"),
	name: text("name"),
	description: text("description"),
	image: text("image"),
	metadata: jsonb("metadata"),
});

export const prices = cloudCollaborateV2.table("prices", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id").references(() => products.id),
	active: boolean("active"),
	description: text("description"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitAmount: bigint("unit_amount", { mode: "number" }),
	currency: text("currency"),
	// TODO: failed to parse database type 'cloud-collaborate-v2".pricing_type'
	type: pricingType("type"),
	// TODO: failed to parse database type 'cloud-collaborate-v2".pricing_plan_interval'
	interval: pricingPlanInterval("interval"),
	intervalCount: integer("interval_count"),
	trialPeriodDays: integer("trial_period_days"),
	metadata: jsonb("metadata"),
});

export const subscriptions = cloudCollaborateV2.table("subscriptions", {
	id: text("id").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	// TODO: failed to parse database type 'cloud-collaborate-v2".subscription_status'
	status: subscriptionStatus("status"),
	metadata: jsonb("metadata"),
	priceId: text("price_id").references(() => prices.id),
	quantity: integer("quantity"),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	created: timestamp("created", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
	currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
	currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).default(sql`now()`),
	cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'string' }).default(sql`now()`),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }).default(sql`now()`),
	trialStart: timestamp("trial_start", { withTimezone: true, mode: 'string' }).default(sql`now()`),
	trialEnd: timestamp("trial_end", { withTimezone: true, mode: 'string' }).default(sql`now()`),
});