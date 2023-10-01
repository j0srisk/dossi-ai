import useUser from '../hooks/useUser';
import { supabase } from '../services/supabase';
import { createContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const CollectionsContext = createContext();

export const CollectionsProvider = ({ children }) => {
	const [collections, setCollections] = useState([]);
	const [documents, setDocuments] = useState([]);

	const { user, profile } = useUser();

	const { collectionId } = useParams();
	const navigate = useNavigate();

	const fetchCollections = useCallback(async () => {
		console.log('querying collections');
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
		const { error, collection } = await fetch('/.netlify/functions/api/create-collection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': profile.api_key,
			},
		}).then((response) => response.json());

		if (error) {
			console.log('error creating collection');
			alert(error.message);
		} else {
			await fetchCollections();
			navigate(`/c/${collection}`);
		}
	}

	async function handleUpdateCollection(collection, name) {
		const { error } = await fetch('/.netlify/functions/api/update-collection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': profile.api_key,
			},
			body: JSON.stringify({ collection: collection, name: name }),
		});
		if (error) {
			console.log('error updating collection');
			alert(error.message);
		} else {
			await fetchCollections();
		}
	}

	async function handleDeleteCollection(collection) {
		const { error } = await fetch('/.netlify/functions/api/delete-collection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': profile.api_key,
			},
			body: JSON.stringify({ collection: collection.id }),
		});
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

		const formData = new FormData();

		formData.append('file', file);
		formData.append('name', file.name);
		formData.append('collection', collectionId);

		const { error } = await fetch('/.netlify/functions/api/create-document', {
			method: 'POST',
			headers: {
				'x-api-key': profile.api_key,
			},
			body: formData,
		});
		if (error) {
			console.log('error creating document');
			alert(error.message);
		} else {
			await fetchDocuments();
		}
	}

	async function handleUpdateDocument(document, name) {
		const { error } = await fetch('/.netlify/functions/api/update-document', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': profile.api_key,
			},
			body: JSON.stringify({ document: document.id, name: name }),
		});
		if (error) {
			console.log('error updating document');
			alert(error.message);
		} else {
			await fetchDocuments();
		}
	}

	async function handleDeleteDocument(document, collection) {
		const { error } = await fetch('/.netlify/functions/api/delete-document', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': profile.api_key,
			},
			body: JSON.stringify({ document: document.id }),
		});
		if (error) {
			console.log('error deleting document');
			alert(error.message);
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
