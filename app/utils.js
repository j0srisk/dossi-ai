import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import db from '@/db/index';
import { collections, documents, vectors, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { encode } from 'gpt-tokenizer';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import OpenOllama from 'openollama';
import { maxInnerProduct } from 'pgvector/drizzle-orm';

export const getTopic = async (id) => {
	let topic = null;
	if (id === '280b8974-866a-49ea-86d9-1feb83702806') {
		console.log('demo collection');
		let collection = await db.select().from(collections).where(eq(collections.id, id));

		collection = collection[0];

		topic = collection;

		topic.type = 'collection';

		return topic;
	}

	let session = await getServerSession(authOptions);

	let user = session.user;

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
	if (id === '280b8974-866a-49ea-86d9-1feb83702806') {
		const demoDocuments = await db.select().from(documents).where(eq(documents.collection, id));

		return demoDocuments;
	}

	let session = await getServerSession(authOptions);

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

export const getUser = async () => {
	let session = await getServerSession(authOptions);

	if (!session) {
		return null;
	}

	let user = session.user;

	const dbUser = await db.select().from(users).where(eq(users.id, user.id));

	return dbUser[0];
};

export const getUsers = async () => {
	let session = await getServerSession(authOptions);

	if (!session) {
		return null;
	}

	let allUsers = await db.select().from(users);

	return allUsers;
};

export const isValidUUID = (uuid) => {
	// Regular expression to validate UUID format
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
};

export const sanitize = (text) => {
	// replace newlines with spaces
	const singleLineText = text.replace(/\n/g, ' ');
	// trim whitespace
	const trimmedText = singleLineText.trim();

	return trimmedText;
};

export const generateEmbedding = async (text) => {
	const openAi = new OpenAI();

	const embeddingResponse = await openAi.embeddings.create({
		model: 'text-embedding-ada-002',
		input: text,
	});

	const embedding = embeddingResponse.data[0].embedding;
	const tokens = embeddingResponse.usage.total_tokens;

	return { embedding, tokens };
};

export const ingestDocument = async (blob, documentId) => {
	console.log('ingesting document');
	const loader = new PDFLoader(blob);

	const rawDocs = await loader.load();

	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 100,
	});

	const docs = await textSplitter.splitDocuments(rawDocs);

	let processedVectors = [];

	const user = await getUser();

	//for loop to process all documents before inserting into database
	//forEach loop does not work with async/await
	for (const doc of docs) {
		const sanitizedDoc = sanitize(doc.pageContent);
		const { embedding, tokens } = await generateEmbedding(sanitizedDoc);

		processedVectors.push({
			content: sanitizedDoc,
			embedding: embedding,
			metadata: doc.metadata,
			document: documentId,
			createdBy: user.id,
		});
	}

	await db.insert(vectors).values(processedVectors);
};

export const similaritySearch = async (query, id, type) => {
	const { embedding, tokens } = await generateEmbedding(query);

	let matchingVectors = null;

	if (type === 'document') {
		matchingVectors = await db
			.select()
			.from(vectors)
			.where(eq(vectors.document, id))
			.orderBy(maxInnerProduct(vectors.embedding, embedding))
			.limit(5);
	} else if (type === 'collection') {
		matchingVectors = await db
			.select({ id: vectors.id, content: vectors.content, metadata: vectors.metadata })
			.from(vectors)
			.innerJoin(documents, eq(vectors.document, documents.id))
			.where(eq(documents.collection, id))
			.orderBy(maxInnerProduct(vectors.embedding, embedding))
			.limit(5);
	}

	return matchingVectors;
};

export const generateContext = async (query, id, type) => {
	let data = null;

	if (type === 'document') {
		data = await similaritySearch(query, id, type);
	} else if (type === 'collection') {
		data = await similaritySearch(query, id, type);
	}

	let maxTokens = 1024;
	let tokenCount = 0;
	let contextText = '---\n';

	for (let i = 0; i < data.length; i++) {
		let pageContent = '';
		const match = data[i];
		const pageNumbers = match.metadata.loc.pageNumber;
		const document = match.id;
		pageContent = 'Document: ' + document + '\n';
		pageContent += 'Page: ' + pageNumbers + '\n';
		pageContent += 'Content: ';
		if (i === 0) {
			//console.log('first match --- document:', document, ' page:', pageNumbers);
		}
		const sanitizedMatch = sanitize(match.content);
		const tokens = encode(sanitizedMatch);
		tokenCount += tokens.length;
		if (tokenCount >= maxTokens) {
			// removes last match token count from total if it exceeds maxTokens
			tokenCount -= tokens.length;
			break;
		}

		pageContent += sanitizedMatch;

		// adds match content to context text and adds line break between matches
		contextText += pageContent + '\n---\n';
	}

	return contextText;
};

export const generatePrompt = async (query, id, type) => {
	const context = await generateContext(query, id, type);

	const prompt = `You are a very enthusiastic document question answering representative who loves to help people! You are given the following context as relevant chunks from a specific document, answer the question using only that information. The current date is October 19th, 2023. \nContext sections:\n${context}\nQuestion: \n"""${query}"""`;

	return prompt;
};

export const generateAnswerChat = async (prompt) => {
	const openai = new OpenAI();

	const openollama = new OpenOllama({
		baseUrl: 'http://ubuntu-server:11434/api',
	});

	const start = Date.now();

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo-1106',
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
	});

	const end = Date.now();

	if (response.error) {
		console.error(response.error);
		return new NextResponse('Error generating answer', { status: 500 });
	}

	console.log('Chat');

	console.log('input tokens: ', response.usage.prompt_tokens);

	console.log('output tokens: ', response.usage.completion_tokens);

	console.log('total tokens: ', response.usage.total_tokens);

	console.log('Time to generate answer: ' + (end - start) / 1000 + ' seconds');

	const answer = response.choices[0].message.content;

	const assistantMessage = { role: 'assistant', content: answer };

	console.log('Answer: ' + answer);

	return assistantMessage;
};

export const generateAnswerInstruct = async (prompt) => {
	const openAi = new OpenAI();

	const start = Date.now();

	const response = await openAi.completions.create({
		model: 'gpt-3.5-turbo-instruct',
		prompt: prompt,
		max_tokens: 150,
	});

	const end = Date.now();

	if (response.error) {
		console.error(response.error);
		return new NextResponse('Error generating answer', { status: 500 });
	}

	{
		/*
	console.log('Instruct');

	console.log('input tokens', response.usage.prompt_tokens);

	console.log('output tokens', response.usage.completion_tokens);

	console.log('total tokens', response.usage.prompt_tokens + response.usage.completion_tokens);

	console.log('Time to generate answer: ' + (end - start) / 1000 + ' seconds');

	console.log('response', response);
	*/
	}

	const answer = response.choices[0].text;

	const assistantMessage = { role: 'assistant', content: answer };

	console.log('answer ' + answer);

	return assistantMessage;
};

export const generateAnswerWithReference = async (prompt, type) => {
	const openAi = new OpenAI();

	let schema = {
		name: 'answer_question',
		parameters: {
			type: 'object',
			properties: {
				answer: { type: 'string', description: 'Answer to the question.' },
				pageNumber: {
					type: 'number',
					description:
						'Page number of the most relevant document section if you think the user is asking about a specific section of the document. If the user is asking about the document as a whole, set this to 0.',
				},
			},
			description: 'Answer to the question and page number of the most relevant document section.',
			required: ['answer', 'pageNumber'],
		},
	};

	//add document parameter to schema if type is collection to generate document references
	if (type === 'collection') {
		schema.parameters.properties.document = {
			type: 'string',
			description:
				'ID of the document that the answer is from if you think the user is asking about a specific document. If the user is asking about the collection as a whole, set this to 0.',
		};
		schema.parameters.required.push('document');
	}

	const start = Date.now();

	const response = await openAi.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		functions: [schema],
		function_call: { name: 'answer_question' },
	});

	const end = Date.now();

	console.log('Function call');

	console.log('input tokens', response.usage.prompt_tokens);

	console.log('output tokens', response.usage.completion_tokens);

	console.log('total tokens', response.usage.prompt_tokens + response.usage.completion_tokens);

	console.log('Time to generate answer: ' + (end - start) / 1000 + ' seconds');

	if (response.error) {
		console.error(response.error);
		return new NextResponse('Error generating answer', { status: 500 });
	}

	let answerWithReferences = response.choices[0].message.function_call.arguments;

	answerWithReferences = JSON.parse(answerWithReferences);

	const assistantMessage = {
		role: 'assistant',
		content: answerWithReferences.answer,
	};

	if (answerWithReferences.pageNumber !== 0) {
		assistantMessage.referencePage = answerWithReferences.pageNumber;
	}

	if (answerWithReferences.document !== 0) {
		assistantMessage.referenceDocument = answerWithReferences.document;
	}

	console.log('answer ' + answerWithReferences.answer);

	return assistantMessage;
};
