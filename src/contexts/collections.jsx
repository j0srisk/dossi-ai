import useUser from '../hooks/useUser';
import { supabase } from '../services/supabase';
import { createContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const CollectionsContext = createContext();

export const CollectionsProvider = ({ children }) => {
	const [collections, setCollections] = useState([]);
	const [documents, setDocuments] = useState([]);

	const { user } = useUser();

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
		//const id = uuidv4();
		/*
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
		*/

		const { error, collectionId } = await fetch('/.netlify/functions/api/create-collection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId: user.id }),
		}).then((response) => response.json());

		if (error) {
			console.log('error creating collection');
			alert(error.message);
		} else {
			await fetchCollections();
			navigate(`/c/${collectionId}`);
		}
	}

	async function handleUpdateCollection(collection, name) {
		/*
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
		*/
		const { error } = await fetch('/.netlify/functions/api/update-collection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ collectionId: collection.id, name: name, userId: user.id }),
		});
		if (error) {
			console.log('error updating collection');
			alert(error.message);
		} else {
			await fetchCollections();
		}
	}

	async function handleDeleteCollection(collection) {
		/*
		const { error } = await supabase.from('collections').delete().eq('id', collection.id);
		if (error) {
			console.log('error deleting collection');
			alert(error.message);
		} else {
			navigate('/');
			await fetchCollections();
		}
		*/
		const { error } = await fetch('/.netlify/functions/api/delete-collection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ collectionId: collection.id, userId: user.id }),
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

		/*
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
		

		const reader = new FileReader();

		reader.onload = async () => {
			const base64String = reader.result.split(',')[1];
			const payload = {
				file: base64String,
				name: file.name,
				collectionId: collectionId,
				documentId: url,
				userId: user.id,
			};

			const { error } = await fetch('/.netlify/functions/api/create-document', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			if (error) {
				console.log('error creating document');
				alert(error.message);
			} else {
				await fetchDocuments();
			}
		};

		reader.readAsDataURL(file);
		*/

		const formData = new FormData();

		formData.append('file', file);
		formData.append('name', file.name);
		formData.append('collectionId', collectionId);
		formData.append('userId', user.id);

		const { error } = await fetch('/.netlify/functions/api/create-document', {
			method: 'POST',
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
		/*
		const { error } = await supabase.from('documents').update({ name: name }).eq('id', document.id);
		if (error) {
			console.log('error updating document');
			alert(error.message);
		} else {
			await fetchDocuments();
		}
		*/
		const { error } = await fetch('/.netlify/functions/api/update-document', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ documentId: document.id, name: name, userId: user.id }),
		});
		if (error) {
			console.log('error updating document');
			alert(error.message);
		} else {
			await fetchDocuments();
		}
	}

	async function handleDeleteDocument(document, collection) {
		/*
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
		*/
		const { error } = await fetch('/.netlify/functions/api/delete-document', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ documentId: document.id, userId: user.id }),
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
