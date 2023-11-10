import { sql } from 'drizzle-orm';
import {
	pgTable,
	unique,
	pgEnum,
	uuid,
	timestamp,
	text,
	integer,
	primaryKey,
	foreignKey,
	boolean,
	customType,
} from 'drizzle-orm/pg-core';
import { AdapterAccount } from 'next-auth/adapters';
import { vector } from 'pgvector/drizzle-orm';

//custom jsonb to fix bug with drizzle converting jsonb to string
//https://github.com/drizzle-team/drizzle-orm/pull/666#issuecomment-1602918513
const jsonb = customType<{ data: any }>({
	dataType() {
		return 'jsonb';
	},
	toDriver(val) {
		return val as any;
	},
	fromDriver(value) {
		if (typeof value === 'string') {
			try {
				return JSON.parse(value) as any;
			} catch {}
		}
		return value as any;
	},
});

//auth stuff
export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId),
	}),
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token),
	}),
);

{
	/*

export const keyStatus = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const keyType = pgEnum('key_type', [
	'aead-ietf',
	'aead-det',
	'hmacsha512',
	'hmacsha256',
	'auth',
	'shorthash',
	'generichash',
	'kdf',
	'secretbox',
	'secretstream',
	'stream_xchacha20',
]);
export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['s256', 'plain']);
export const equalityOp = pgEnum('equality_op', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in']);
export const action = pgEnum('action', ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR']);

*/
}

{
	/*
export const profiles = pgTable(
	'profiles',
	{
		id: uuid('id').primaryKey().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
		username: text('username'),
		firstName: text('first_name'),
		avatarUrl: text('avatar_url'),
		lastName: text('last_name'),
		apiKey: uuid('api_key'),
		email: text('email'),
		adaV2Tokens: integer('ada_v2_tokens'),
		gpt3Turbo4KInputTokens: integer('gpt_3_turbo_4k_input_tokens'),
		gpt3Turbo4KOutputTokens: integer('gpt_3_turbo_4k_output_tokens'),
	},
	(table) => {
		return {
			profilesUsernameKey: unique('profiles_username_key').on(table.username),
			profilesApiKeyKey: unique('profiles_api_key_key').on(table.apiKey),
		};
	},
);
*/
}

export const vectors = pgTable('vectors', {
	//todo change this to defaultRandom
	id: uuid('id')
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	content: text('content'),
	metadata: jsonb('metadata'),
	embedding: vector('embedding', { dimensions: 1536 }),
	document: uuid('document')
		.notNull()
		.references(() => documents.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	createdBy: text('created_by').references(() => users.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
});

export const chats = pgTable('chats', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: text('created_by').references(() => users.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	document: uuid('document').references(() => documents.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	collection: uuid('collection').references(() => collections.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	messages: jsonb('messages'),
	name: text('name'),
});

export const collections = pgTable('collections', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: text('created_by').references(() => users.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	name: text('name'),
});

export const documents = pgTable('documents', {
	id: uuid('id').defaultRandom().primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: text('created_by').references(() => users.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	name: text('name'),
	url: text('url'),
	collection: uuid('collection').references(() => collections.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade',
	}),
	ingesting: boolean('ingesting'),
});
