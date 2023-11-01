import { pgTable, unique, pgEnum, uuid, timestamp, text, integer, foreignKey, jsonb, boolean } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"
export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])


export const profiles = pgTable("profiles", {
	id: uuid("id").primaryKey().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	username: text("username"),
	firstName: text("first_name"),
	avatarUrl: text("avatar_url"),
	lastName: text("last_name"),
	apiKey: uuid("api_key"),
	email: text("email"),
	adaV2Tokens: integer("ada_v2_tokens"),
	gpt3Turbo4KInputTokens: integer("gpt_3_turbo_4k_input_tokens"),
	gpt3Turbo4KOutputTokens: integer("gpt_3_turbo_4k_output_tokens"),
},
(table) => {
	return {
		profilesUsernameKey: unique("profiles_username_key").on(table.username),
		profilesApiKeyKey: unique("profiles_api_key_key").on(table.apiKey),
	}
});

export const vectors = pgTable("vectors", {
	id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	content: text("content"),
	metadata: jsonb("metadata"),
	// TODO: failed to parse database type 'vector(1536)'
	embedding: unknown("embedding"),
	document: uuid("document").notNull().references(() => documents.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdBy: uuid("created_by").notNull(),
});

export const chats = pgTable("chats", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
	document: uuid("document").references(() => documents.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	collection: uuid("collection").references(() => collections.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	messages: jsonb("messages"),
	name: text("name"),
});

export const collections = pgTable("collections", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
	name: text("name"),
});

export const documents = pgTable("documents", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
	name: text("name"),
	url: text("url"),
	collection: uuid("collection").references(() => collections.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	ingesting: boolean("ingesting"),
});