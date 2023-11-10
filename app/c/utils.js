import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import db from '@/db/index';
import { collections, documents, chats } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export const getTopic = async (id) => {
	const session = await getServerSession(authOptions);

	let user = session.user;

	let topic = null;

	let collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	collection = collection[0];

	if (!collection) {
		let document = await db
			.select()
			.from(documents)
			.where(and(eq(documents.id, id), eq(documents.createdBy, user.id)));

		document = document[0];

		if (!document) {
			return null;
		} else {
			topic = document;
			topic.type = 'document';
		}
	} else {
		topic = collection;
		topic.type = 'collection';
	}

	if (!topic) {
		return null;
	}

	return topic;
};

export const getDocuments = async (id) => {
	const session = await getServerSession(authOptions);
	const user = session.user;

	const colectionDocuments = await db
		.select()
		.from(documents)
		.where(and(eq(documents.collection, id), eq(documents.createdBy, user.id)));

	if (!colectionDocuments) {
		return null;
	}

	return colectionDocuments;
};

export const getMessages = async (id) => {
	const session = await getServerSession(authOptions);

	let user = session.user;

	const chat = await db
		.select()
		.from(chats)
		.where(and(eq(chats.id, id), eq(chats.createdBy, user.id)));

	const messages = chat.messages;

	return messages;
};
