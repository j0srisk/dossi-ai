import { useEffect, useState } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import { supabase } from '../services/supabase';
import Collection from './Collection';
const Collections = () => {
	const [activeCollection, setActiveCollection] = useState(null);
	const [collections, setCollections] = useState(null);
	const [loading, setLoading] = useState(true);

	const user = useRequireAuth();

	async function fetchCollections() {
		console.log('querying collections');
		const res = await supabase
			.from('collections')
			.select('*')
			.eq('created_by', user.id)
			.order('created_at', { ascending: false });
		setCollections(res.data);
		setLoading(false);
	}

	useEffect(() => {
		if (user && user.id) {
			fetchCollections();
		}
	}, [user]);

	async function handleCreateCollection() {
		const { error } = await supabase
			.from('collections')
			.insert([{ created_by: user.id, name: 'New Collection' }]);
		if (error) {
			alert(error.message);
		} else {
			await fetchCollections();
		}
	}

	return (
		<>
			<button
				className="mb-2  rounded-md border border-neutral-500 p-3"
				onClick={() => handleCreateCollection()}
			>
				<p className="text-center text-base font-bold text-white">New Collection</p>
			</button>
			<div className="flex flex-1 flex-col gap-2 overflow-scroll">
				{!loading &&
					collections.map((collection) => {
						return (
							<Collection
								key={collection.id}
								id={collection.id}
								name={collection.name}
								activeCollection={activeCollection}
								setActiveCollection={setActiveCollection}
								fetchCollections={fetchCollections}
							/>
						);
					})}
			</div>
		</>
	);
};

export default Collections;
