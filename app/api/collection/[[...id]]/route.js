import { getUser, isValidUUID } from '@/app/api/utils';
import db from '@/lib/index';
import { collections } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

//creates a new collection
export async function POST(request, { params }) {
	let id = params.id;

	if (id) {
		return new NextResponse('ID provided', { status: 400 });
	}

	const body = await request.json();
	const name = body.name;

	id = crypto.randomUUID();

	const user = await getUser();

	await db.insert(collections).values({ id: id, name: name, createdBy: user.id });

	// looks up the collection that was just created
	let collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	collection = collection[0];

	if (!collection) {
		return new NextResponse('Error creating collection', { status: 500 });
	}

	return new NextResponse(JSON.stringify(collection), { status: 200 });
}

//gets a collection
export async function GET(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	collection = collection[0];

	if (!collection) {
		return new NextResponse('Collection not found', { status: 404 });
	}

	return new NextResponse(JSON.stringify(collection), { status: 200 });
}

//updates a collection name
export async function PATCH(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	collection = collection[0];

	if (!collection) {
		return new NextResponse('Collection not found', { status: 404 });
	}

	const body = await request.json();
	const name = body.name;

	await db
		.update(collections)
		.set({ name: name })
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	return new NextResponse('Collection updated', { status: 200 });
}

//deletes a collection
export async function DELETE(request, { params }) {
	const id = params.id;

	if (!id || !isValidUUID(id)) {
		return new NextResponse('Invalid ID provided', { status: 400 });
	}

	const user = await getUser();

	let collection = await db
		.select()
		.from(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	collection = collection[0];

	if (!collection) {
		return new NextResponse('Collection not found', { status: 404 });
	}

	await db
		.delete(collections)
		.where(and(eq(collections.id, id), eq(collections.createdBy, user.id)));

	return new NextResponse('Collection deleted', { status: 200 });
}
