'use client';

import NewChat from '@/components/NewChat';
import SearchBar from '@/components/SearchBar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RealtimeChats({ chats, documents, collections }) {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('date');
	const supabase = createClientComponentClient();
	const router = useRouter();

	useEffect(() => {
		const channel = supabase
			.channel('realtime-collections')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'collections' }, (payload) => {
				router.refresh();
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, router]);

	useEffect(() => {
		const channel = supabase
			.channel('realtime-documents')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => {
				router.refresh();
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, router]);

	function findMatchingTopic(chat) {
		for (const document of documents) {
			if (document.id === chat.document) {
				return document;
			}
		}

		for (const collection of collections) {
			if (collection.id === chat.collection) {
				return collection;
			}
		}
	}

	return (
		<div className="relative flex flex-col gap-4 overflow-visible text-white">
			<SearchBar search={search} setSearch={setSearch} sort={sort} setSort={setSort} />

			<div className="flex flex-col items-center justify-between">
				{chats
					?.filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()))
					.sort((a, b) => {
						if (sort === 'name') {
							return a.name.localeCompare(b.name);
						} else if (sort === 'date') {
							return b.created_at.localeCompare(a.created_at);
						}
						return 0;
					})
					.map((chat) => (
						<NewChat key={chat.id} chat={chat} topic={findMatchingTopic(chat)} />
					))}
			</div>
		</div>
	);
}
