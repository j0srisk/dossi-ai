import useRequireAuth from '../../hooks/useRequireAuth';
import { supabase } from '../../services/supabase';
import Collection from './Collection';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CollectionManager = () => {
	const [collections, setCollections] = useState([]);
	const [documents, setDocuments] = useState([]);
	const [activeCollection, setActiveCollection] = useState(null);
	const [activeDocument, setActiveDocument] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);

	const user = useRequireAuth();

	const { collectionId, documentId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		setActiveCollection(collectionId);
		setActiveDocument(documentId);
	}, [collectionId, documentId]);

	const fetchCollections = useCallback(async () => {
		const { data, error } = await supabase
			.from('collections')
			.select('*')
			.eq('created_by', user.id)
			.order('created_at', { ascending: false });
		if (error) {
			console.log('error fetching collections');
			alert(error.message);
		} else {
			setCollections(data);
			setLoading(false);
		}
	}, [user]);

	const fetchDocuments = useCallback(async () => {
		const collectionIds = collections.map((collection) => collection.id);
		const { data, error } = await supabase
			.from('documents')
			.select('*')
			.eq('created_by', user.id)
			.in('collection', collectionIds)
			.order('created_at', { ascending: false });

		if (error) {
			console.log('error fetching documents');
			alert(error.message);
		} else {
			setDocuments(data);
		}
	}, [collections, user]);

	useEffect(() => {
		if (user && user.id) {
			fetchCollections();
		}
	}, [user, fetchCollections]);

	useEffect(() => {
		if (collections.length > 0) {
			fetchDocuments();
		}
	}, [collections, fetchDocuments]);

	async function handleCreateCollection() {
		setIsAdding(true);
		const id = uuidv4();
		const { error } = await supabase
			.from('collections')
			.insert([{ id: id, created_by: user.id, name: 'New Collection' }]);
		if (error) {
			console.log('error creating collection');
			alert(error.message);
		} else {
			setActiveCollection(id);
			await fetchCollections();
			navigate(`/c/${id}`);
			setIsAdding(false);
		}
	}

	async function handleUpdateCollection(collection, name) {
		const { error } = await supabase
			.from('collections')
			.update({ name: name })
			.eq('id', collection.id);
		if (error) {
			console.log('error updating collection');
			alert(error.message);
		} else {
			await fetchCollections();
		}
	}

	async function handleDeleteCollection(collection) {
		const { error } = await supabase.from('collections').delete().eq('id', collection.id);
		if (error) {
			console.log('error deleting collection');
			alert(error.message);
		} else {
			navigate('/c');
			await fetchCollections();
		}
	}

	async function handleCreateDocument(event) {
		const file = event.target.files[0];

		const url = uuidv4();

		const filePath = `${user.id}/${url}`;

		const { error: databaseError } = await supabase
			.from('documents')
			.insert([{ created_by: user.id, name: file.name, collection: collectionId, url: filePath }]);
		if (databaseError) {
			alert(databaseError.message);
		} else {
			await fetchDocuments();
		}

		const { error: storageError } = await supabase.storage.from('documents').upload(filePath, file);
		if (storageError) {
			alert(storageError.message);
		} else {
			await fetchDocuments();
		}
	}

	const handleUpdateDocument = async (document, name) => {
		console.log(document);
		console.log(name);
		const { error } = await supabase.from('documents').update({ name: name }).eq('id', document.id);
		if (error) {
			console.log('error updating document');
			alert(error.message);
		} else {
			await fetchDocuments();
		}
	};

	const handleDeleteDocument = async (document, collection) => {
		const { error } = await supabase.from('documents').delete().eq('id', document.id);
		if (error) {
			console.log('error deleting document');
			alert(error.message);
		} else {
			navigate(`/c/${collection.id}`);
			await fetchDocuments();
		}
	};

	return (
		<div className="flex flex-col overflow-auto h-full">
			<button
				className="rounded-md border border-neutral-500 p-3 mb-2"
				onClick={() => handleCreateCollection()}
				disabled={isAdding}
			>
				<p className="text-center text-base font-bold text-white">New Collection</p>
			</button>
			<div className="flex flex-1 flex-col h-full gap-2 overflow-scroll mb-2">
				{!loading &&
					collections.map((collection) => {
						return (
							<Collection
								key={collection.id}
								collection={collection}
								documents={documents.filter((doc) => doc.collection === collection.id)}
								activeCollection={activeCollection}
								activeDocument={activeDocument}
								handleUpdateCollection={handleUpdateCollection}
								handleDeleteCollection={handleDeleteCollection}
								handleCreateDocument={handleCreateDocument}
								handleUpdateDocument={handleUpdateDocument}
								handleDeleteDocument={handleDeleteDocument}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default CollectionManager;
