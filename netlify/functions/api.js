import { createClient } from '@supabase/supabase-js';
import {
	encode,
	encodeChat,
	decode,
	isWithinTokenLimit,
	encodeGenerator,
	decodeGenerator,
	decodeAsyncGenerator,
} from 'gpt-tokenizer';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
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
async function similaritySearch(query, documentId) {
	const embedding = await createEmbedding(query);
	const embeddingData = embedding.data[0].embedding;

	const { error, data } = await supabase.rpc('match_document_vectors', {
		document_id: documentId,
		input_embedding: embeddingData,
		match_threshold: 0.0,
		match_count: 10,
		min_content_length: 0,
	});
	if (error) {
		console.log(error);
		return { error };
	} else {
		return { data };
	}
}

// generates context text for query
async function contextGenerator(query, documentId, maxTokens) {
	const { error, data } = await similaritySearch(query, documentId);

	if (error) {
		console.log(error);
		return { error };
	}

	let tokenCount = 0;
	let contextText = '';

	// iterates through matches until token count exceeds maxTokens to generate max context
	for (let i = 0; i < data.length; i++) {
		const match = data[i];
		const sanitizedMatch = sanitize(match.content);
		const tokens = encode(sanitizedMatch);
		tokenCount += tokens.length;
		if (tokenCount >= maxTokens) {
			// removes last match token count from total if it exceeds maxTokens
			tokenCount -= tokens.length;
			break;
		}
		// adds match content to context text and adds line break between matches
		contextText += sanitizedMatch + '\n---\n';
	}

	return contextText;
}

async function promptGenerator(query, documentId) {
	const sanitizedQuery = sanitize(query);
	console.log(sanitizedQuery);

	const contextText = await contextGenerator(sanitizedQuery, documentId, 2048);

	const prompt = `You are a very enthusiastic representative who loves to help people! Given the following context, answer the question using only that information. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that."    Context sections: ${contextText}    Question: """${sanitizedQuery}"""`;
	console.log(prompt);

	return prompt;
}

// express server
const express = require('express');
const serverless = require('serverless-http');
const multer = require('multer');

const app = express();
const upload = multer();

const router = express.Router();

app.use(express.json());

router.get('/', (req, res) => {
	res.json({
		hello: 'hi!',
	});
});

router.get('/test', (req, res) => {
	res.json({
		hello: 'test!',
	});
});

router.post('/testpost', (req, res) => {
	res.json({
		hello: 'hit the POST!',
	});
});

router.post('/create-collection', async (req, res) => {
	const { userId } = req.body;
	const collectionId = uuidv4();
	const { error } = await supabase.from('collections').insert([
		{
			id: collectionId,
			created_by: userId,
			name: 'New Collection',
		},
	]);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ message: 'success', collectionId: collectionId });
	}
});

router.post('/update-collection', async (req, res) => {
	const { collectionId, name, userId } = req.body;
	const { error } = await supabase
		.from('collections')
		.update({ name: name })
		.eq('id', collectionId)
		.eq('created_by', userId);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/delete-collection', async (req, res) => {
	const { collectionId, userId } = req.body;
	const { error } = await supabase
		.from('collections')
		.delete()
		.eq('id', collectionId)
		.eq('created_by', userId);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/create-document', upload.single('file'), async (req, res) => {
	const { name, collectionId, userId } = req.body;
	const file = req.file;
	const documentId = uuidv4();
	const url = `${userId}/${documentId}`;

	// insert document into supabase
	const { error: databaseError } = await supabase.from('documents').insert([
		{
			id: documentId,
			name,
			collection: collectionId,
			created_by: userId,
			url: url,
		},
	]);

	// upload document to supabase storage
	const { error: uploadError } = await supabase.storage.from('documents').upload(url, file.buffer, {
		contentType: 'application/pdf',
	});

	// ingest document into supabase
	const blob = new Blob([req.file.buffer], { type: req.file.mimetype });

	const loader = new PDFLoader(blob);

	const rawDocs = await loader.load();

	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});

	const docs = await textSplitter.splitDocuments(rawDocs);

	let ingestErrors = [];

	docs.forEach(async (doc) => {
		const embedding = await createEmbedding(doc.pageContent);
		const embeddingData = embedding.data[0].embedding;

		const { error } = await supabase.from('vectors').insert([
			{
				content: doc.pageContent,
				embedding: embeddingData,
				metadata: doc.metadata,
				document: documentId,
				created_by: userId,
			},
		]);
		if (error) {
			console.log(error);
			ingestErrors.push(error);
		}
	});

	if (databaseError || uploadError || ingestErrors.length > 0) {
		console.log(databaseError);
		console.log(uploadError);
		res
			.status(500)
			.json({ error: databaseError.message || uploadError.message || ingestErrors[0].message });
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/update-document', async (req, res) => {
	const { documentId, name, userId } = req.body;
	const { error } = await supabase
		.from('documents')
		.update({ name: name })
		.eq('id', documentId)
		.eq('created_by', userId);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/delete-document', async (req, res) => {
	const { documentId, userId } = req.body;
	const { error } = await supabase
		.from('documents')
		.delete()
		.eq('id', documentId)
		.eq('created_by', userId);
	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ message: 'success' });
	}
});

router.post('/sanitize', async (req, res) => {
	const { query } = req.body;

	const sanitizedQuery = await sanitize(query);

	res.status(200).json({ sanitizedQuery: sanitizedQuery });
});

router.post('/similarity-search', async (req, res) => {
	const { query, documentId } = req.body;

	const { error, data } = await similaritySearch(query, documentId);

	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ matches: data });
	}
});

router.post('/tokenize', async (req, res) => {
	const { query } = req.body;

	const tokens = encode(query);

	const tokensCount = tokens.length;

	res.status(200).json({ tokens: tokensCount });
});

router.post('/context-generator', async (req, res) => {
	const { query, documentId } = req.body;

	const { error, tokenCount, contextText } = await contextGenerator(query, documentId, 2048);

	if (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ contextText: contextText });
	}
});

router.post('/prompt-generator', async (req, res) => {
	const { query, documentId } = req.body;

	const prompt = await promptGenerator(query, documentId);

	res.status(200).json({ prompt: prompt });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
