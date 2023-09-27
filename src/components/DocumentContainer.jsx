import { CollectionsContext } from '../contexts/collections';
import { supabase } from '../services/supabase';
import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';

const DocumentContainer = () => {
	const [collection, setCollection] = useState([]);
	const [document, setDocument] = useState(null);
	const [documentUrl, setDocumentUrl] = useState(null);
	const [downloading, setDownloading] = useState(true);

	const { collections, documents } = useContext(CollectionsContext);

	const { collectionId, documentId } = useParams();

	const searchCollection = useCallback(async () => {
		const currentCollection = await collections.find(
			(collection) => collection.id === collectionId,
		);
		setCollection(currentCollection);
	}, [collections, collectionId]);

	const searchDocument = useCallback(async () => {
		const currentDocument = await documents.find((document) => document.id === documentId);
		setDocument(currentDocument);
	}, [documents, documentId]);

	useEffect(() => {
		if (collections.length > 0) {
			searchCollection();
		}
	}, [collections, searchCollection]);

	useEffect(() => {
		if (documents.length > 0) {
			searchDocument();
		}
	}, [documents, searchDocument]);

	const downloadDocument = useCallback(async () => {
		console.log('downloading document: ', document.name);
		const startTimer = Date.now();

		// Create a promise that resolves when the download is complete
		const downloadPromise = supabase.storage.from('documents').download(document.url);

		// Create a promise that rejects after a specified timeout
		const timeoutPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Download timed out'));
			}, 5000); // Set the timeout duration in milliseconds (e.g., 5000 for 5 seconds)
		});

		try {
			// Use Promise.race to wait for either the download or the timeout
			const { data, error } = await Promise.race([downloadPromise, timeoutPromise]);
			const endTimer = Date.now();
			console.log('download time: ', endTimer - startTimer);

			if (error) {
				throw error;
			} else {
				const url = URL.createObjectURL(data);
				setDocumentUrl(url);
				setDownloading(false);
			}
		} catch (error) {
			console.error('Download error:', error);
			// Handle the timeout or other download errors here
		}
	}, [document]);

	useEffect(() => {
		setDownloading(true);
		if (document) {
			downloadDocument();
		} else {
			setDocumentUrl(null);
		}
	}, [document, downloadDocument]);

	return (
		<>
			{document && documentUrl && !downloading && (
				<div className="flex h-full w-full flex-col gap-8 p-8">
					<div className=" flex h-fit w-full flex-col gap-2 rounded-md bg-neutral-800 p-2">
						<img src={documentUrl} alt="document" className="rounded-md" />
						<p className="text-center text-base font-bold text-white">{document.name}</p>
						<p className="text-center text-base font-bold text-white">{collection.name}</p>
					</div>
					<div className=" flex h-fit w-full flex-col gap-2 rounded-md bg-neutral-800 p-2">
						<img src={documentUrl} alt="document" className="rounded-md" />
						<p className="text-center text-base font-bold text-white">{document.name}</p>
					</div>
				</div>
			)}
		</>
	);
};

export default DocumentContainer;
