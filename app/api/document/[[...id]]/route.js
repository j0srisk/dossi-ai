import { getUser, isValidUUID, ingestDocument } from '@/app/api/utils';
import db from '@/lib/index';
import { documents } from '@/lib/schema';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
	let id = params.id;

	if (id) {
		return new NextResponse('ID provided', { status: 400 });
	}

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

	const user = await getUser();

	const documentId = crypto.randomUUID();
	const documentUrl = `${user.id}/${documentId}`;

	await db.insert(documents).values({
		id: documentId,
		name: name,
		collection: collectionId,
		createdBy: user.id,
		url: documentUrl,
	});

	const { error: storageError } = await supabase.storage
		.from('documents')
		.upload(documentUrl, buffer, {
			contentType: 'application/pdf',
		});

	if (storageError) {
		console.error('storageError', storageError);
		return new NextResponse('Error uploading document to storage', { status: 500 });
	}

	await ingestDocument(blob, documentId);

	let document = await db
		.select()
		.from(documents)
		.where(and(eq(documents.id, documentId)));

	document = document[0];

	if (!document) {
		return new NextResponse('Document not found', { status: 404 });
	}

	return new NextResponse(JSON.stringify(document), { status: 200 });
}

export async function GET(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let document = await db
		.select()
		.from(documents)
		.where(and(eq(documents.id, id), eq(documents.createdBy, user.id)));

	document = document[0];

	if (!document) {
		return new NextResponse('Document not found', { status: 404 });
	}

	return new NextResponse(JSON.stringify(document), { status: 200 });
}

export async function PATCH(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let document = await db
		.select()
		.from(documents)
		.where(and(eq(documents.id, id), eq(documents.createdBy, user.id)));

	document = document[0];

	if (!document) {
		return new NextResponse('Document not found', { status: 404 });
	}

	const body = await request.json();
	const name = body.name;

	await db
		.update(documents)
		.set({ name: name })
		.where(and(eq(documents.id, id), eq(documents.createdBy, user.id)));

	return new NextResponse('Document updated', { status: 200 });
}

export async function DELETE(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let document = await db
		.select()
		.from(documents)
		.where(and(eq(documents.id, id), eq(documents.createdBy, user.id)));

	document = document[0];

	if (!document) {
		return new NextResponse('Document not found', { status: 404 });
	}

	await db.delete(documents).where(and(eq(documents.id, id), eq(documents.createdBy, user.id)));

	return new NextResponse('Document deleted', { status: 200 });
}
