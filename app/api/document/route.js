import { sanitize, generateEmbeddings } from '@/app/api/utils';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
	const formData = await request.formData();
	const file = formData.get('file');
	const collectionId = formData.get('collectionId');
	const name = formData.get('name');

	if (file.type !== 'application/pdf') {
		return new NextResponse('File must be a PDF', { status: 400 });
	}

	//convert file to buffer and then blob
	const buffer = Buffer.from(await file.arrayBuffer());
	const blob = new Blob([buffer], { type: file.type });

	const supabase = createRouteHandlerClient({ cookies });
	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;

	const documentId = crypto.randomUUID();
	const documentUrl = `${user.id}/${documentId}`;

	const { error: databaseError } = await supabase.from('documents').insert([
		{
			id: documentId,
			name: name,
			collection: collectionId,
			created_by: user.id,
			url: documentUrl,
			ingesting: true,
		},
	]);

	if (databaseError) {
		console.error('databaseError', databaseError);
		return new NextResponse('Error creating document in database', { status: 500 });
	}

	const { error: chatError } = await supabase.from('chats').insert([
		{
			document: documentId,
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
		console.log('chatError', chatError);
		return new NextResponse('Error creating chat in database', { status: 500 });
	}

	const { error: storageError } = await supabase.storage
		.from('documents')
		.upload(documentUrl, buffer, {
			contentType: 'application/pdf',
		});

	if (storageError) {
		console.error('storageError', storageError);
		return new NextResponse('Error uploading document to storage', { status: 500 });
	}

	const loader = new PDFLoader(blob);

	const rawDocs = await loader.load();

	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 100,
	});

	const docs = await textSplitter.splitDocuments(rawDocs);

	let docsIngested = 0;
	let ingestProgress = 0;

	docs.forEach(async (doc) => {
		const sanitizedDoc = sanitize(doc.pageContent);
		console.log('sanitizedDoc', sanitizedDoc);

		const embeddings = await generateEmbeddings(doc.pageContent);

		console.log('embeddings', embeddings);
		const { error: ingestError } = await supabase.from('vectors').insert([
			{
				content: doc.pageContent,
				embedding: embeddings,
				metadata: doc.metadata,
				document: documentId,
				created_by: user.id,
			},
		]);

		if (ingestError) {
			console.error('ingestError', ingestError);
			const { error: ingestCompleteError } = await supabase
				.from('documents')
				.update({
					ingesting: null,
				})
				.match({ id: documentId });

			if (ingestCompleteError) {
				console.error('ingestCompleteError', ingestCompleteError);
				return new NextResponse('Error nulling document ingestion', { status: 500 });
			}
			return new NextResponse('Error ingesting document', { status: 500 });
		}

		docsIngested++;
		ingestProgress = (docsIngested / docs.length) * 100;

		console.log(ingestProgress + '% complete');

		if (docsIngested === docs.length) {
			const { error: ingestCompleteError } = await supabase
				.from('documents')
				.update({
					ingesting: false,
				})
				.match({ id: documentId });

			if (ingestCompleteError) {
				console.error('ingestCompleteError', ingestCompleteError);
				return new NextResponse('Error completing document ingestion', { status: 500 });
			}
			console.log('Ingestion complete');
		}
	});

	return new NextResponse('Document created', { status: 200 });
}
