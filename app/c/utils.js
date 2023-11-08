import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getTopic = async (id) => {
	const supabase = createServerComponentClient({ cookies });

	let topic = null;

	const { data: collection } = await supabase.from('collections').select().eq('id', id).single();

	if (!collection) {
		const { data: document } = await supabase.from('documents').select().eq('id', id).single();

		if (!document) {
			return null;
		} else {
			topic = document;
			topic.type = 'document';
		}
	} else {
		topic = collection;
		topic.type = 'collection';
	}

	if (!topic) {
		return null;
	}

	return topic;
};

export const getDocuments = async (id) => {
	const supabase = createServerComponentClient({ cookies });

	const { data: documents } = await supabase.from('documents').select().eq('collection', id);

	if (!documents) {
		return null;
	}

	return documents;
};

export const getMessages = async (id) => {
	const supabase = createServerComponentClient({ cookies });

	const { data: chats } = await supabase.from('chats').select().eq('id', id).single();
	if (!chats) {
		return null;
	}
	const messages = chats.messages;

	return messages;
};
