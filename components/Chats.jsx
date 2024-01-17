'use client';

import Chat from '@/components/Chat';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';

export default function Chats({ chats, documents, collections }) {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('date');
	const [order, setOrder] = useState('desc');

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
			<SearchBar
				search={search}
				setSearch={setSearch}
				sort={sort}
				setSort={setSort}
				order={order}
				setOrder={setOrder}
			/>

			<div className="flex flex-col items-center justify-between">
				{chats
					?.filter((chat) => chat.name && chat.name.toLowerCase().includes(search.toLowerCase()))
					.sort((a, b) => {
						if (sort === 'name') {
							if (order === 'asc') {
								return a.name.localeCompare(b.name);
							} else if (order === 'desc') {
								return b.name.localeCompare(a.name);
							}
						} else if (sort === 'date') {
							if (order === 'asc') return String(a.createdAt).localeCompare(String(b.createdAt));
							else if (order === 'desc') {
								return String(b.createdAt).localeCompare(String(b.createdAt));
							}
						}
						return 0;
					})
					.map((chat) => (
						<Chat key={chat.id} chat={chat} topic={findMatchingTopic(chat)} />
					))}
			</div>
		</div>
	);
}
