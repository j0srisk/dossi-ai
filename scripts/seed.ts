import { ingestDocument } from '@/app/utils';
import { collections, users, documents } from '@/db/schema';
import crypto from 'crypto';
import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL env var not set');
}

const main = async () => {
	const client = postgres(process.env.DATABASE_URL);
	const db = drizzle(client);

	//adds demo user to db
	const user = await db.select().from(users).where(eq(users.id, 'demo'));
	if (user[0]) {
		console.log('Demo User already exists in db');
	} else {
		await db.insert(users).values({
			id: 'demo',
			email: 'demo-email',
		});
	}

	//adds demo collection to db
	const collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.createdBy, 'demo'), eq(collections.name, 'Demo Collection')));

	if (collection[0]) {
		console.log('Demo Collection already exists in db');
	} else {
		await db.insert(collections).values({
			id: '280b8974-866a-49ea-86d9-1feb83702806',
			createdBy: 'demo',
			name: 'Demo Collection',
		});
	}

	//searches public folder for demo documents to add to db and removes documents that are no longer in the public folder
	const publicFolderPath = path.join(__dirname, '..', 'public');

	const demoFiles = fs.readdirSync(publicFolderPath);

	for (const file of demoFiles) {
		if (file.endsWith('.pdf')) {
			const document = await db
				.select()
				.from(documents)
				.where(and(eq(documents.name, file), eq(documents.createdBy, 'demo')));

			if (document[0]) {
				console.log(file + ' already exists in db');
			} else {
				console.log('Inserting ' + file + ' into db');
				await db.insert(documents).values({
					id: crypto.randomUUID(),
					createdBy: 'demo',
					name: file,
					collection: '280b8974-866a-49ea-86d9-1feb83702806',
					url: '/' + file,
				});

				const filePath = path.join(publicFolderPath, file);
				const fileData = fs.readFileSync(filePath);
				const blob = new Blob([fileData], { type: 'application/pdf' });

				ingestDocument(blob, file);
			}
		}
	}

	// Remove documents that are no longer in the public folder
	const demoDocuments = await db.select().from(documents).where(eq(documents.createdBy, 'demo'));

	for (const document of demoDocuments) {
		if (!demoFiles.includes(document.name)) {
			console.log('Removing ' + document.name + ' from db');
			await db.delete(documents).where(eq(documents.id, document.id));
		}
	}

	console.log('Done!');
};

main();
