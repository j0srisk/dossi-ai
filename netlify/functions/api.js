import { createClient } from '@supabase/supabase-js';
import { encode } from 'gpt-tokenizer';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// supabase client
const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.VITE_SUPABASE_URL;
if (!url) throw new Error(`Expected env var VITE_SUPABASE_URL`);

const supabase = createClient(url, privateKey);

// openai client
const openai = new OpenAI();

async function createEmbedding(input) {
	const embedding = await openai.embeddings.create({
		model: 'text-embedding-ada-002',
		input: input,
	});

	return embedding;
}

// processing functions

// sanitizes query
function sanitize(query) {
	const singleLineQuery = query.replace(/\n/g, ' ');
	const trimmedQuery = singleLineQuery.trim();

	return trimmedQuery;
}

// uses OpenAI to check if content is safe
async function checkContent(query) {}

//searches supabase for similar document vectors
async function similaritySearch(query, document, collection) {
	const embedding = await createEmbedding(query);
	const embeddingData = embedding.data[0].embedding;

	console.log(document);
	console.log(collection);

	let error = null;
	let data = null;

	if (document) {
		const result = await supabase.rpc('match_document_vectors', {
			document_id: document,
			input_embedding: embeddingData,
			match_threshold: 0.0,
			match_count: 10,
			min_content_length: 0,
		});
		error = result.error;
		data = result.data;
	} else if (collection) {
		const result = await supabase.rpc('match_collection_vectors', {
			collection_id: collection,
			input_embedding: embeddingData,
			match_threshold: 0.0,
			match_count: 10,
			min_content_length: 0,
		});
		error = result.error;
		data = result.data;
	}

	if (error) {
		console.log(error);
		return { error };
	} else {
		return { data };
	}
}

// generates context text for query
async function contextGenerator(query, document, collection, maxTokens) {
	let error = null;
	let data = null;

	if (document) {
		const result = await similaritySearch(query, document, null);
		error = result.error;
		data = result.data;
	} else if (collection) {
		const result = await similaritySearch(query, null, collection);
		error = result.error;
		data = result.data;
	}

	if (error) {
		console.log(error);
		return { error };
	}

	let tokenCount = 0;
	let contextText = '---\n';

	// iterates through matches until token count exceeds maxTokens to generate max context
	for (let i = 0; i < data.length; i++) {
		let pageContent = '';
		const match = data[i];
		const pageNumbers = match.metadata.loc.pageNumber;
		pageContent = 'Page ' + pageNumbers + ': \n';
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
}

async function promptGenerator(query, documentId) {
	const contextText = await contextGenerator(query, documentId, 2048);

	const prompt = `You are a very enthusiastic document question answering representative who loves to help people! You are given the following context as relevant chunks from a specific document, answer the question using only that information.\nContext sections: ${contextText}\nQuestion: """${sanitizedQuery}"""`;

	return prompt;
}

// express server

// middleware to check for API key
async function apiKeyMiddleware(req, res, next) {
	const apiKey = req.headers['x-api-key'];

	if (!apiKey) {
		res.status(401).json({ error: 'No API key provided' });
		return;
	}

	const { error, data } = await supabase
		.from('profiles')
		.select('*')
		.eq('api_key', apiKey)
		.single();
	if (!data) {
		res.status(401).json({ error: 'Invalid API key' });
		return;
	}

	req.user = data;

	next();
}

const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');

const app = express();
const upload = multer();

const router = express.Router();

app.use(express.json());
app.use(apiKeyMiddleware);

router.post('/create-collection', async (req, res) => {
	const user = req.user;
	//const { userId } = req.body;
	const collection = uuidv4();
	const { error: databaseError } = await supabase.from('collections').insert([
		{
			id: collection,
			created_by: user.id,
			name: 'New Collection',
		},
	]);
	if (databaseError) {
		console.log(databaseError);
		res.status(500).json({ error: databaseError.message });
		return;
	}

	const { error: chatError } = await supabase.from('chats').insert([
		{
			collection: collection,
			messages: [
				{
					role: 'assistant',
					content:
						'Welcome to the chat! Ask me a question about this collection of document and I will do my best to answer it!',
				},
			],
			created_by: user.id,
		},
	]);

	if (chatError) {
		console.log(chatError);
		res.status(500).json({ error: chatError.message });
		return;
	}

	res.status(200).json({ message: 'success', collection: collection });
});

router.post('/update-collection', async (req, res) => {
	const user = req.user;
	const { collection, name } = req.body;
	const { error } = await supabase
		.from('collections')
		.update({ name: name })
		.eq('id', collection)
		.eq('created_by', user.id);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
		return;
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/delete-collection', async (req, res) => {
	const user = req.user;
	const { collection } = req.body;
	const { error } = await supabase
		.from('collections')
		.delete()
		.eq('id', collection)
		.eq('created_by', user.id);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
		return;
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/create-document', upload.single('file'), async (req, res) => {
	const user = req.user;
	const { name, collection } = req.body;
	const file = req.file;

	console.log(file.mimetype);

	if (file.mimetype !== 'application/pdf') {
		console.log('File must be a PDF');
		res.status(500).json({ error: 'File must be a PDF' });
		return;
	}

	const document = uuidv4();
	const url = `${user.id}/${document}`;

	// insert document into supabase
	const { error: databaseError } = await supabase.from('documents').insert([
		{
			id: document,
			name,
			collection: collection,
			created_by: user.id,
			url: url,
		},
	]);

	if (databaseError) {
		console.log(databaseError);
		res.status(500).json({ error: databaseError.message });
		return;
	}

	// create chat for document
	const { error: chatError } = await supabase.from('chats').insert([
		{
			document: document,
			messages: [
				{
					role: 'assistant',
					content:
						'Welcome to the chat! Ask me a question about the document and I will do my best to answer it!',
				},
			],
			created_by: user.id,
		},
	]);

	if (chatError) {
		console.log(chatError);
		res.status(500).json({ error: chatError.message });
		return;
	}

	// upload document to supabase storage
	const { error: uploadError } = await supabase.storage.from('documents').upload(url, file.buffer, {
		contentType: 'application/pdf',
	});

	if (uploadError) {
		console.log(uploadError);
		res.status(500).json({ error: uploadError.message });
		return;
	}

	// ingest document into supabase
	const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

	const loader = new PDFLoader(blob);

	const rawDocs = await loader.load();

	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});

	const docs = await textSplitter.splitDocuments(rawDocs);

	docs.forEach(async (doc) => {
		const sanitizedContent = sanitize(doc.pageContent);
		const embedding = await createEmbedding(sanitizedContent);
		const embeddingData = embedding.data[0].embedding;

		const { error } = await supabase.from('vectors').insert([
			{
				content: doc.pageContent,
				embedding: embeddingData,
				metadata: doc.metadata,
				document: document,
				created_by: user.id,
			},
		]);
		if (error) {
			console.log(error);
			res.status(500).json({ error: error.message });
			return;
		}
	});

	res.status(200).json({ message: 'success', document: document });
});

router.post('/update-document', async (req, res) => {
	const user = req.user;
	const { document, name } = req.body;
	const { error } = await supabase
		.from('documents')
		.update({ name: name })
		.eq('id', document)
		.eq('created_by', user.id);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
		return;
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/delete-document', async (req, res) => {
	const user = req.user;
	const { document } = req.body;
	const { error } = await supabase
		.from('documents')
		.delete()
		.eq('id', document)
		.eq('created_by', user.id);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
		return;
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/similarity-search', async (req, res) => {
	const { query, document, collection } = req.body;

	const { error, data } = await similaritySearch(query, document, collection);

	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
		return;
	}

	res.status(200).json({ data: data });
});

router.post('/generate-prompt', async (req, res) => {
	const { query, document } = req.body;

	const sanitizedQuery = sanitize(query);

	const contextText = await contextGenerator(sanitizedQuery, document, 512);

	const prompt = `You are a very enthusiastic document question answering representative who loves to help people! You are given the following context as relevant chunks from a specific document, answer the question using only that information.\nContext sections:\n${contextText}\nQuestion: \n"""${sanitizedQuery}"""`;

	console.log(prompt);

	res.status(200).json({ prompt: prompt });
});

router.post('/generate', async (req, res) => {
	const { query, document } = req.body;

	const { data, error: databaseReadError } = await supabase
		.from('chats')
		.select('*')
		.eq('document', document)
		.single();

	if (databaseReadError) {
		console.log(databaseReadError);
		res.status(500).json({ error: databaseReadError.message });
		return;
	}

	const sanitizedQuery = sanitize(query);

	const contextText = await contextGenerator(sanitizedQuery, document, 2048);

	//const contextText = 'No context yet!';

	const prompt = `You are a very enthusiastic document question answering representative who loves to help people! You are given the following context as relevant chunks from a specific document, answer the question using only that information.\nContext sections: ${contextText}\nQuestion: """${sanitizedQuery}"""`;

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		temperature: 1,
		max_tokens: 256,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});

	if (!response) {
		console.log(response);
		res.status(500).json({ error: 'No response' });
		return;
	}

	console.log(response.choices[0].message);

	const { error: databaseInsertError } = await supabase
		.from('chats')
		.update({
			messages: [...data.messages, { role: 'user', content: query }, response.choices[0].message],
		})
		.eq('document', document);

	if (databaseInsertError) {
		console.log(databaseInsertError);
		res.status(500).json({ error: databaseInsertError.message });
		return;
	}

	res.status(200).json({ response: response.choices[0].message });
});

router.post('/generate-with-references', async (req, res) => {
	const { query, document, collection } = req.body;

	console.log(document);
	console.log(collection);

	let databaseReadError = null;
	let data = null;

	if (document) {
		const result = await supabase.from('chats').select('*').eq('document', document).single();
		databaseReadError = result.error;
		data = result.data;
	} else if (collection) {
		const result = await supabase.from('chats').select('*').eq('collection', collection).single();
		databaseReadError = result.error;
		data = result.data;
	}

	if (databaseReadError) {
		console.log(databaseReadError);
		res.status(500).json({ error: databaseReadError.message });
		return;
	}

	const sanitizedQuery = sanitize(query);

	let contextText = '';

	if (document) {
		contextText = await contextGenerator(sanitizedQuery, document, null, 2048);
	} else if (collection) {
		contextText = await contextGenerator(sanitizedQuery, null, collection, 2048);
	}

	const prompt = `You are a very enthusiastic document question answering representative who loves to help people! You are given the following context as relevant chunks from a specific document, answer the question using only that information.\nContext sections:\n${contextText}\nQuestion: \n"""${sanitizedQuery}"""`;

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: prompt,
			},
		],
		functions: [
			{
				name: 'answer_question',
				parameters: {
					type: 'object',
					properties: {
						answer: { type: 'string' },
						pageNumber: {
							type: 'number',
							description:
								'Page number of the most relevant document section if you think the user is asking about a specific section of the document. If the user is asking about the document as a whole, set this to 0.',
						},
					},
					description:
						'Answer to the question and page number of the most relevant document section.',
					required: ['answer', 'pageNumber'],
				},
			},
		],
		function_call: { name: 'answer_question' },
	});

	if (!response) {
		console.log(response);
		res.status(500).json({ error: 'No response' });
		return;
	}

	console.log(response.choices[0].message);

	const responseInJSON = JSON.parse(response.choices[0].message.function_call.arguments);

	const assistantMessage = {
		role: 'assistant',
		content: responseInJSON.answer,
	};

	if (responseInJSON.pageNumber !== 0) {
		assistantMessage.referencePage = responseInJSON.pageNumber;
	}

	console.log(assistantMessage);

	let databaseInsertError = null;

	if (document) {
		const response = await supabase
			.from('chats')
			.update({
				messages: [...data.messages, { role: 'user', content: query }, assistantMessage],
			})
			.eq('document', document);
		databaseInsertError = response.error;
	} else if (collection) {
		const response = await supabase
			.from('chats')
			.update({
				messages: [...data.messages, { role: 'user', content: query }, assistantMessage],
			})
			.eq('collection', collection);
		databaseInsertError = response.error;
	}

	if (databaseInsertError) {
		console.log(databaseInsertError);
		res.status(500).json({ error: databaseInsertError.message });
		return;
	}

	res.status(200).json({ response: assistantMessage });
});

router.post('/find-user', apiKeyMiddleware, async (req, res) => {
	const user = req.user;

	res.status(200).json({ user: user });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
