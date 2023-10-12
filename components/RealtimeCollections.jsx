'use client';

import Collection from './Collection';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RealtimeCollections = ({ collections, documents, children }) => {
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

	return collections?.map((collection) => (
		<Collection
			key={collection.id}
			collection={collection}
			documents={documents.filter((document) => document.collection === collection.id)}
		/>
	));
};

export default RealtimeCollections;
