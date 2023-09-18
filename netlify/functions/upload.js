import 'dotenv/config';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
//import { createClient } from '@supabase/supabase-js';
//import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
//import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.VITE_SUPABASE_URL;
if (!url) throw new Error(`Expected env var VITE_SUPABASE_URL`);

export async function handler(event) {
	if (event.httpMethod !== 'POST') {
		return { statusCode: 405, body: 'Method Not Allowed' };
	}

	try {
		const base64string = event.body;

		const binaryData = Buffer.from(base64string, 'base64');

		const blob = new Blob([binaryData], { type: 'application/pdf' });

		const loader = new PDFLoader(blob);

		const rawDocs = await loader.load();

		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const docs = await textSplitter.splitDocuments(rawDocs);

		/*
		const client = createClient(url, privateKey);

		const vectorStore = await SupabaseVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
			client,
			tableName: 'documents',
			queryName: 'match_documents',
		});

		console.log(vectorStore);
        */

		console.log(docs);

		return {
			statusCode: 200,
			headers: {
				'access-control-allow-origin': '*',
			},
			body: JSON.stringify({ docs }),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				'access-control-allow-origin': '*',
			},
			body: JSON.stringify({ error: error.message }),
		};
	}
}
