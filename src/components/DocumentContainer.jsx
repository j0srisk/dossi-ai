import { supabase } from '../services/supabase';
import PdfViewer from './PdfViewer';
import { useCallback, useEffect, useState } from 'react';

const DocumentContainer = ({ document }) => {
	const [documentUrl, setDocumentUrl] = useState(null);
	const [downloading, setDownloading] = useState(true);

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
		downloadDocument();
	}, [document, downloadDocument]);

	return (
		<>
			{documentUrl && !downloading && (
				<div className="flex h-full min-h-full w-full flex-col overflow-scroll relative">
					<div className="flex flex-col gap-2 bg-neutral-800">
						<PdfViewer url={documentUrl} />
					</div>
				</div>
			)}
		</>
	);
};

export default DocumentContainer;
