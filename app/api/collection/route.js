import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
	const body = await request.json();
	const name = body.name;

	const supabase = createRouteHandlerClient({ cookies });
	const { data: userData } = await supabase.auth.getUser();
	const user = userData.user;

	const collectionId = crypto.randomUUID();

	const { error } = await supabase.from('collections').insert({
		id: collectionId,
		name: name,
		created_by: user.id,
	});

	if (error) {
		console.error(error);
		return new NextResponse('Error creating collection', { status: 500 });
	}

	const { error: chatError } = await supabase.from('chats').insert([
		{
			collection: collectionId,
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
		console.log('chatError', chatError);
		return new NextResponse('Error creating chat in database', { status: 500 });
	}

	return new NextResponse('Collection created', { status: 200 });
}
