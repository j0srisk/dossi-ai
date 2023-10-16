'use client';

import NewCollection from '@/components/NewCollection';
import SearchBar from '@/components/SearchBar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RealtimeCollections({ collections, documents }) {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('name');
	const [order, setOrder] = useState('asc');
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
				{collections
					?.filter((collection) => collection.name.toLowerCase().includes(search.toLowerCase()))
					.sort((a, b) => {
						if (sort === 'name') {
							if (order === 'asc') {
								return a.name.localeCompare(b.name);
							} else if (order === 'desc') {
								return b.name.localeCompare(a.name);
							}
						} else if (sort === 'date') {
							if (order === 'asc') return a.created_at.localeCompare(b.created_at);
							else if (order === 'desc') {
								return b.created_at.localeCompare(a.created_at);
							}
						}
						return 0;
					})
					.map((collection) => (
						<NewCollection
							key={collection.id}
							collection={collection}
							documents={documents.filter((document) => document.collection === collection.id)}
						/>
					))}
			</div>
		</div>
	);
}
