import useRequireAuth from '../hooks/useRequireAuth';
import { supabase } from '../services/supabase';
import { createContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const CollectionsContext = createContext();

export const CollectionsProvider = ({ children }) => {
	const [collections, setCollections] = useState([]);
	const [documents, setDocuments] = useState([]);

	const user = useRequireAuth();

	const { collectionId } = useParams();
	const navigate = useNavigate();

	const fetchCollections = useCallback(async () => {
		console.log('querying collections');
		console.log('user: ', user.id);
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
		}
	}, [user]);

	const fetchDocuments = useCallback(async () => {
		console.log('querying documents');
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
		if (collections.length > 0 && user && user.id) {
			fetchDocuments();
		}
	}, [user, collections, fetchDocuments]);

	async function handleCreateCollection() {
		const id = uuidv4();
		const { error } = await supabase
			.from('collections')
			.insert([{ id: id, created_by: user.id, name: 'New Collection' }]);
		if (error) {
			console.log('error creating collection');
			alert(error.message);
		} else {
			await fetchCollections();
			navigate(`/c/${id}`);
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
			navigate('/');
			await fetchCollections();
		}
	}

	async function handleCreateDocument(event) {
		const file = event.target.files[0];

		const url = uuidv4();

		const filePath = `${user.id}/${url}`;

		const { error: databaseError } = await supabase
			.from('documents')
			.insert([
				{ id: url, created_by: user.id, name: file.name, collection: collectionId, url: filePath },
			]);
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

	async function handleUpdateDocument(document, name) {
		const { error } = await supabase.from('documents').update({ name: name }).eq('id', document.id);
		if (error) {
			console.log('error updating document');
			alert(error.message);
		} else {
			await fetchDocuments();
		}
	}

	async function handleDeleteDocument(document, collection) {
		const { error: databaseError } = await supabase
			.from('documents')
			.delete()
			.eq('id', document.id);
		const { error: storageError } = await supabase.storage.from('documents').remove([document.url]);
		if (databaseError || storageError) {
			console.log('error deleting document');
			alert(databaseError.message);
			alert(storageError.message);
		} else {
			navigate(`c/${collection.id}`);
			await fetchDocuments();
		}
	}

	const value = {
		collections,
		documents,
		handleCreateCollection,
		handleUpdateCollection,
		handleDeleteCollection,
		handleCreateDocument,
		handleUpdateDocument,
		handleDeleteDocument,
	};

	return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
};
