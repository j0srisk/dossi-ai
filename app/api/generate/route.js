import {
	sanitize,
	generateContext,
	generatePrompt,
	generateAnswerChat,
	generateAnswerInstruct,
	generateAnswerWithReference,
} from '@/app/utils';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const body = await request.json();

	const messages = body.messages;
	const collectionId = body.collectionId;
	const documentId = body.documentId;

	if (documentId && collectionId) {
		return new NextResponse('Cannot specify both documentId and collectionId', { status: 400 });
	}

	if (!messages) {
		return new NextResponse('No messages provided', { status: 400 });
	}

	if (!documentId && !collectionId) {
		return new NextResponse('No documentId or collectionId provided', { status: 400 });
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

	//TODO: look up if document or collections belongs to user

	const lastQuestion = messages[messages.length - 1].content;

	const sanitizedQuestion = sanitize(lastQuestion);

	let prompt = await generatePrompt(sanitizedQuestion, documentId || collectionId, type);

	const assistantMessage = await generateAnswerChat(prompt);

	//const assistantMessage = await generateAnswerWithReference(prompt, type);

	//prompt = prompt + '/n Answer:';

	//const assistantMessage = await generateAnswerInstruct(prompt);

	const response = { choices: [{ message: assistantMessage }] };

	return new NextResponse(JSON.stringify(response), { status: 200 });
}
