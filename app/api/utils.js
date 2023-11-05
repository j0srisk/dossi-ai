import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { encode } from 'gpt-tokenizer';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const getUser = async () => {
	const supabase = createRouteHandlerClient({ cookies });
	const { data: userData } = await supabase.auth.getUser();
	let user = userData.user;

	//default user for testing
	if (!user) {
		user = { id: 'aba5562e-f500-4f92-87c8-8e9a3bcb581a' };
	}

	return user;
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

export const generateEmbeddings = async (text) => {
	const openAi = new OpenAI();

	const embeddingResponse = await openAi.embeddings.create({
		model: 'text-embedding-ada-002',
		input: text,
	});

	const embeddings = embeddingResponse.data[0].embedding;
	const tokens = embeddingResponse.usage.total_tokens;

	return { embeddings, tokens };
};

export const similaritySearch = async (query, id, type) => {
	let totalTokens = await getEmbeddingsTokenCount();

	const { embeddings, tokens } = await generateEmbeddings(query);

	totalTokens += tokens;

	await updateEmbeddingsTokenCount(totalTokens);

	const supabase = createRouteHandlerClient({ cookies });

	let result = null;

	if (type === 'document') {
		const { data, error } = await supabase.rpc('match_document_vectors', {
			document_id: id,
			input_embedding: embeddings,
			match_threshold: 0.0,
			match_count: 10,
			min_content_length: 0,
		});

		if (error) {
			console.error(error);
			return new NextResponse('Error searching for similar documents', { status: 500 });
		}

		result = data;
	} else if (type === 'collection') {
		const { data, error } = await supabase.rpc('match_collection_vectors', {
			collection_id: id,
			input_embedding: embeddings,
			match_threshold: 0.0,
			match_count: 10,
			min_content_length: 0,
		});

		if (error) {
			console.error(error);
			return new NextResponse('Error searching for similar collections', { status: 500 });
		}

		result = data;
	}

	return result;
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
		const document = match.document;
		pageContent = 'Document: ' + document + '\n';
		pageContent += 'Page: ' + pageNumbers + '\n';
		pageContent += 'Content: ';
		if (i === 0) {
			console.log('first match --- document:', document, ' page:', pageNumbers);
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
	const openAi = new OpenAI();

	const start = Date.now();

	const response = await openAi.chat.completions.create({
		model: 'gpt-3.5-turbo',
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

	let { totalInputTokens, totalOutputTokens } = await getGptTokenCount();

	totalInputTokens += response.usage.prompt_tokens;

	totalOutputTokens += response.usage.completion_tokens;

	await updateGptTokenCount(totalInputTokens, totalOutputTokens);

	console.log('Chat');

	console.log('input tokens', response.usage.prompt_tokens);

	console.log('output tokens', response.usage.completion_tokens);

	console.log('total tokens', response.usage.prompt_tokens + response.usage.completion_tokens);

	console.log('Time to generate answer: ' + (end - start) / 1000 + ' seconds');

	const answer = response.choices[0].message.content;

	const assistantMessage = { role: 'assistant', content: answer };

	console.log('answer ' + answer);

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

	let { totalInputTokens, totalOutputTokens } = await getGptTokenCount();

	totalInputTokens += response.usage.prompt_tokens;

	totalOutputTokens += response.usage.completion_tokens;

	await updateGptTokenCount(totalInputTokens, totalOutputTokens);

	console.log('Instruct');

	console.log('input tokens', response.usage.prompt_tokens);

	console.log('output tokens', response.usage.completion_tokens);

	console.log('total tokens', response.usage.prompt_tokens + response.usage.completion_tokens);

	console.log('Time to generate answer: ' + (end - start) / 1000 + ' seconds');

	console.log('response', response);

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

	let { totalInputTokens, totalOutputTokens } = await getGptTokenCount();

	totalInputTokens += response.usage.prompt_tokens;

	totalOutputTokens += response.usage.completion_tokens;

	await updateGptTokenCount(totalInputTokens, totalOutputTokens);

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

export const getChatData = async (id) => {
	const supabase = createRouteHandlerClient({ cookies });

	let chatData = null;

	let { data: retrieveChatData, error: retrieveChatError } = await supabase
		.from('chats')
		.select('*')
		.eq('id', id);

	if (retrieveChatError) {
		console.error(retrieveChatError);
		return new NextResponse('Error retrieving past chats', { status: 500 });
	}

	chatData = retrieveChatData[0];

	return chatData;
};

export const createChatData = async (id, topic, name) => {
	const supabase = createRouteHandlerClient({ cookies });
	console.log('chat does not exist, creating new chat');
	console.log('name', name);
	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;

	const { data: createChatData, error: createChatError } = await supabase.from('chats').insert([
		{
			id: id,
			[topic.type]: topic.id,
			messages: [],
			created_by: user.id,
			name: name,
		},
	]);

	if (createChatError) {
		console.error(createChatError);
		return new NextResponse('Error creating chat', { status: 500 });
	}
};

export const getEmbeddingsTokenCount = async () => {
	const supabase = createRouteHandlerClient({ cookies });

	const { data: profileData, error: profileDataError } = await supabase
		.from('profiles')
		.select('*')
		.single();

	if (profileDataError) {
		console.error(profileDataError);
		return new NextResponse('Error retrieving profile embedding token count', { status: 500 });
	}
	return profileData.ada_v2_tokens;
};

export const updateEmbeddingsTokenCount = async (totalTokens) => {
	const supabase = createRouteHandlerClient({ cookies });

	const user = await getUser();

	const { data: profileData, error: profileDataError } = await supabase
		.from('profiles')
		.update({
			ada_v2_tokens: totalTokens,
		})
		.eq('id', user.id)
		.single();

	if (profileDataError) {
		console.error(profileDataError);
		return new NextResponse('Error updating profile embedding token count', { status: 500 });
	}
};

export const getGptTokenCount = async () => {
	const supabase = createRouteHandlerClient({ cookies });

	const { data: profileData, error: profileDataError } = await supabase
		.from('profiles')
		.select('*')
		.single();

	if (profileDataError) {
		console.error(profileDataError);
		return new NextResponse('Error retrieving profile GPT token count', { status: 500 });
	}

	return {
		totalInputTokens: profileData.gpt_3_turbo_4k_input_tokens,
		totalOutputTokens: profileData.gpt_3_turbo_4k_output_tokens,
	};
};

export const updateGptTokenCount = async (totalInputTokens, totalOutputTokens) => {
	const supabase = createRouteHandlerClient({ cookies });

	const user = await getUser();

	const { data: profileData, error: profileDataError } = await supabase
		.from('profiles')
		.update({
			gpt_3_turbo_4k_input_tokens: totalInputTokens,
			gpt_3_turbo_4k_output_tokens: totalOutputTokens,
		})
		.eq('id', user.id)
		.single();

	if (profileDataError) {
		console.error(profileDataError);
		return new NextResponse('Error updating profile GPT token count', { status: 500 });
	}
};
