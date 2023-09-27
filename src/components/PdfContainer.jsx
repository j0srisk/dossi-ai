import { CollectionsContext } from '../contexts/collections';
import { supabase } from '../services/supabase';
import PdfViewer from './PdfViewer';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PdfContainer = () => {
	const [collection, setCollection] = useState(null);
	const [document, setDocument] = useState(null);
	const [documentUrl, setDocumentUrl] = useState(null);
	const [downloading, setDownloading] = useState(true);

	const { collections, documents } = useContext(CollectionsContext);

	const { collectionId, documentId } = useParams();

	console.log(documentId);

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
			setDownloading(false);
		}
	}, [document, downloadDocument]);

	return (
		<div className="flex flex-col w-full h-full">
			<div
				className={`flex w-full flex-col p-3 bg-neutral-800 justify-center border border-neutral-800 rounded-t-md ${
					!document && !downloading ? 'rounded-b-md h-full' : ''
				}`}
			>
				{document && <p className="text-center text-base font-bold text-white">{document.name}</p>}
				{!document && !downloading && (
					<p className="text-center text-base font-bold text-white">
						Chating with all Documents in Collection
					</p>
				)}
			</div>
			{document && documentUrl && !downloading && (
				<div className="flex h-fit min-h-full w-full flex-col overflow-scroll">
					<div className="flex flex-col rounded-b-md bg-neutral-800 p-2">
						<PdfViewer url={documentUrl} />
					</div>
				</div>
			)}
		</div>
	);
};

export default PdfContainer;
