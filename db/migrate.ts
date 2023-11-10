import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString);
const db = drizzle(client);

//add this to db/schema.ts
{
	/*
CREATE EXTENSION IF NOT EXISTS vector
--> statement-breakpoint
*/
}
//change "vector(1536)" to vector(1536) in db/schema.ts

const main = async () => {
	console.log('Migrating...');
	await migrate(db, { migrationsFolder: 'drizzle' });
	console.log('Done!');
};

main();
