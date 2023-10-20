import {
	sanitize,
	generateContext,
	generatePrompt,
	generateAnswerChat,
	generateAnswerInstruct,
	generateAnswerWithReference,
	getChatData,
	createChatData,
} from '@/app/api/utils';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
	const body = await request.json();
	const query = body.query;
	const collectionId = body.collectionId;
	const documentId = body.documentId;

	const chatId = body.chatId;

	if (documentId && collectionId) {
		return new NextResponse('Cannot specify both documentId and collectionId', { status: 400 });
	}

	let topic = {};

	let type;

	if (documentId) {
		topic.id = documentId;
		topic.type = 'document';
		type = 'document';
	} else if (collectionId) {
		topic.id = collectionId;
		topic.type = 'collection';
		type = 'collection';
	}

	const supabase = createRouteHandlerClient({ cookies });

	// Get chat data
	let chatData = await getChatData(chatId);

	// Create chat data if it doesn't exist
	if (!chatData) {
		let name = query.substring(0, 30);
		if (name.length === 30) {
			name += '...';
		}
		await createChatData(chatId, topic, name);
		// set chatData.messages to empty array so that we can push to it later
		chatData = { messages: [] };
	}

	const sanitizedQuery = sanitize(query);

	let prompt = await generatePrompt(sanitizedQuery, documentId || collectionId, type);

	//await generateAnswerChat(prompt);

	//prompt = prompt + '/n Answer:';

	const answer = await generateAnswerWithReference(prompt, type);

	//const answer = await generateAnswerInstruct(prompt);

	const assistantMessage = answer;

	// Update chat with new messages
	let updateChatQuery = supabase.from('chats').update({
		messages: [...chatData.messages, { role: 'user', content: query }, assistantMessage],
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
