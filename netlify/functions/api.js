import { createClient } from '@supabase/supabase-js';
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

router.post('/similarity-search', async (req, res) => {
	const { query, documentId } = req.body;

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
		res.status(500).json({ error: error.message });
	} else {
		res.status(200).json({ matches: data });
	}

	//res.status(200).json({ query: query, documentId: documentId });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
