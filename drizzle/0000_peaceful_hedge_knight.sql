CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text,
	"email" varchar(256),
	"phone" varchar(256),
	"last_name" varchar(256)
);
