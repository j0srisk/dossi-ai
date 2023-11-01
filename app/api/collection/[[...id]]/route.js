import { getUser } from '@/app/api/utils';
import db from '@/lib/index';
import { collections } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

//creates a new collection
export async function POST(request, { params }) {
	const id = params.id;

	if (id) {
		return new NextResponse('ID provided', { status: 400 });
	}

	const body = await request.json();
	const name = body.name;

	const collectionId = crypto.randomUUID();

	const user = await getUser();

	console.log(user.id);

	{
		/*
	const { error } = await supabase.from('collections').insert({
		id: collectionId,
		name: name,
		created_by: user.id,
	});

	if (error) {
		console.error(error);
		return new NextResponse('Error creating collection', { status: 500 });
	}
	*/
	}

	await db.insert(collections).values({ id: collectionId, name: name, createdBy: user.id });
	return new NextResponse('Collection created', { status: 200 });
}

// gets a collection
export async function GET(request, { params }) {
	const id = params.id;

	if (!id) {
		return new NextResponse('No ID provided', { status: 400 });
	}

	const user = await getUser();

	const collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	return new NextResponse(JSON.stringify(collection), { status: 200 });
}

// updates a collection name
export async function PATCH(request, { params }) {
	const id = params.id;

	if (!id) {
		return new NextResponse('No ID provided', { status: 400 });
	}

	const body = await request.json();
	const name = body.name;

	const user = await getUser();

	await db
		.update(collections)
		.set({ name: name })
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	return new NextResponse('Collection updated', { status: 200 });
}

// deletes a collection
export async function DELETE(request, { params }) {
	const id = params.id;

	if (!id) {
		return new NextResponse('No ID provided', { status: 400 });
	}

	const user = await getUser();

	await db
		.delete(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	return new NextResponse('Collection deleted', { status: 200 });
}
