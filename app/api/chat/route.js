import {
	sanitize,
	generateContext,
	generatePrompt,
	generateAnswer,
	generateAnswerWithReference,
} from '@/app/api/utils';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
	const body = await request.json();
	const query = body.query;
	const collectionId = body.collectionId;
	const documentId = body.documentId;

	if (documentId && collectionId) {
		return new NextResponse('Cannot specify both documentId and collectionId', { status: 400 });
	}

	let type;

	if (documentId) {
		type = 'document';
	} else if (collectionId) {
		type = 'collection';
	}

	const supabase = createRouteHandlerClient({ cookies });

	// Retrieve previous messages from chat
	let retrieveChatQuery = supabase.from('chats').select('*');

	if (type === 'document') {
		retrieveChatQuery = retrieveChatQuery.or(`document.eq.${documentId}`).single();
	} else if (type === 'collection') {
		retrieveChatQuery = retrieveChatQuery.or(`collection.eq.${collectionId}`).single();
	}

	const { data: retrieveChatData, error: retrieveChatError } = await retrieveChatQuery;

	if (retrieveChatError) {
		console.error(retrieveChatError);
		return new NextResponse('Error retrieving past chats', { status: 500 });
	}

	const sanitizedQuery = sanitize(query);

	const prompt = await generatePrompt(sanitizedQuery, documentId || collectionId, type);

	//const answer = await generateAnswer(prompt);

	const answer = await generateAnswerWithReference(prompt, type);

	const assistantMessage = answer;

	console.log('assistantMessage', assistantMessage);

	// Update chat with new messages
	let updateChatQuery = supabase.from('chats').update({
		messages: [...retrieveChatData.messages, { role: 'user', content: query }, assistantMessage],
	});

	if (type === 'document') {
		updateChatQuery = updateChatQuery.match({ document: documentId });
	} else if (type === 'collection') {
		updateChatQuery = updateChatQuery.match({ collection: collectionId });
	}

	const { data: updateChatData, error: updateChatError } = await updateChatQuery;

	if (updateChatError) {
		console.error(updateChatError);
		return new NextResponse('Error updating chat', { status: 500 });
	}

	return new NextResponse(JSON.stringify(assistantMessage), { status: 200 });
}

export async function DELETE(request) {
	const body = await request.json();
	const collectionId = body.collectionId;
	const documentId = body.documentId;

	if (documentId && collectionId) {
		return new NextResponse('Cannot specify both documentId and collectionId', { status: 400 });
	}

	let type;

	if (documentId) {
		type = 'document';
	} else if (collectionId) {
		type = 'collection';
	}

	const supabase = createRouteHandlerClient({ cookies });

	let deleteChatQuery = supabase.from('chats').update({
		messages: [],
	});

	if (type === 'document') {
		deleteChatQuery = deleteChatQuery.match({ document: documentId });
	} else if (type === 'collection') {
		deleteChatQuery = deleteChatQuery.match({ collection: collectionId });
	}

	const { data: deleteChatData, error: deleteChatError } = await deleteChatQuery;

	if (deleteChatError) {
		console.error(deleteChatError);
		return new NextResponse('Error deleting chat', { status: 500 });
	}

	return new NextResponse('Chat deleted', { status: 200 });
}
