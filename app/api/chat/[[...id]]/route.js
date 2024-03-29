import { getUser, isValidUUID } from '@/app/utils';
import db from '@/db/index';
import { chats } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
	let id = params.id;

	if (id) {
		return new NextResponse('ID provided', { status: 400 });
	}

	const body = await request.json();
	const name = body.name;
	const collectionId = body.collectionId;
	const documentId = body.documentId;

	if (documentId && collectionId) {
		return new NextResponse('Cannot specify both documentId and collectionId', { status: 400 });
	}

	id = crypto.randomUUID();

	let user;

	if (collectionId === '280b8974-866a-49ea-86d9-1feb83702806') {
		//demo collection
		user = { id: 'demo' };
	} else {
		user = await getUser();
	}

	await db.insert(chats).values({
		id: id,
		name: name,
		messages: [],
		collection: collectionId,
		document: documentId,
		createdBy: user.id,
	});

	// looks up the chat that was just created
	let chat = await db.select().from(chats).where(eq(chats.id, id));

	chat = chat[0];

	if (!chat) {
		return new NextResponse('Error creating chat', { status: 500 });
	}

	return new NextResponse(JSON.stringify(chat), { status: 200 });
}

export async function GET(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let chat = await db.select().from(chats).where(eq(chats.id, id));

	chat = chat[0];

	if (user) {
		if (chat.createdBy !== user.id && chat.createdBy !== 'demo') {
			return new NextResponse('Chat not found', { status: 404 });
		}
	}

	if (!chat) {
		return new NextResponse('Chat not found', { status: 404 });
	}

	return new NextResponse(JSON.stringify(chat), { status: 200 });
}

export async function PATCH(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let chat = await db.select().from(chats).where(eq(chats.id, id));

	chat = chat[0];

	if (user) {
		if (chat.createdBy !== user.id && chat.createdBy !== 'demo') {
			return new NextResponse('Chat not found', { status: 404 });
		}
	}

	if (!chat) {
		return new NextResponse('Chat not found', { status: 404 });
	}

	const body = await request.json();

	let name = body.name;

	if (!name) {
		name = chat.name;
	}

	const messages = body.messages;

	await db.update(chats).set({ name: name, messages: messages }).where(eq(chats.id, id));

	return new NextResponse('Chat updated', { status: 200 });
}

export async function DELETE(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	let user = await getUser();

	let chat = await db
		.select()
		.from(chats)
		.where(and(eq(chats.id, id), eq(chats.createdBy, user.id)));

	chat = chat[0];

	if (!chat) {
		return new NextResponse('Chat not found', { status: 404 });
	}

	await db.delete(chats).where(and(eq(chats.id, id), eq(chats.createdBy, user.id)));

	return new NextResponse('Chat deleted', { status: 200 });
}
