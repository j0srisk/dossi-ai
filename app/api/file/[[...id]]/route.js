import { getUser } from '@/app/utils';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY,
);

//creates a new file
export async function POST(request, { params }) {
	console.log('uploading file');
	let id = params.id;

	if (!id) {
		return new NextResponse('No ID provided', { status: 400 });
	}

	const formData = await request.formData();
	const file = formData.get('file');

	const buffer = Buffer.from(await file.arrayBuffer());

	const user = await getUser();

	const documentUrl = `${user.id}/${id}`;

	const { error: storageError } = await supabase.storage
		.from('documents')
		.upload(documentUrl, buffer, {
			contentType: 'application/pdf',
		});

	if (storageError) {
		console.error('storageError', storageError);
		return new NextResponse('Error uploading document to storage', { status: 500 });
	}

	return new NextResponse(JSON.stringify('Success'), { status: 200 });
}

//gets a file from storage and returns it as a blob
export async function GET(request, { params }) {
	let id = params.id;

	if (!id) {
		return new NextResponse('No ID provided', { status: 400 });
	}

	const user = await getUser();

	const documentUrl = `${user.id}/${id}`;

	const { data, error: storageError } = await supabase.storage
		.from('documents')
		.download(documentUrl);

	if (storageError) {
		console.error('storageError', storageError);
		return new NextResponse('Error getting document from storage', { status: 500 });
	}

	return new NextResponse(data, { status: 200 });
}

//removes a file from storage
export async function DELETE(request, { params }) {
	let id = params.id;

	if (!id) {
		return new NextResponse('No ID provided', { status: 400 });
	}

	const user = await getUser();

	const documentUrl = `${user.id}/${id}`;

	const { error: storageError } = await supabase.storage.from('documents').remove([documentUrl]);

	if (storageError) {
		console.error('storageError', storageError);
		return new NextResponse('Error deleting document from storage', { status: 500 });
	}

	return new NextResponse(JSON.stringify('Success'), { status: 200 });
}
