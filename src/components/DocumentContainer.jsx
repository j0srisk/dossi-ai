import useRequireAuth from '../hooks/useRequireAuth';
import { supabase } from '../services/supabase';
import { useEffect, useState, useCallback } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

const DocumentContainer = () => {
	const [document, setDocument] = useState(null);
	const [documentUrl, setDocumentUrl] = useState(null);
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState(true);

	const { documentId } = useParams();

	const user = useRequireAuth();

	const fetchDocument = useCallback(async () => {
		const { data, error } = await supabase
			.from('documents')
			.select('*')
			.eq('created_by', user.id)
			.eq('id', documentId)
			.single();
		if (error) {
			throw error;
		} else {
			setDocument(data);
			setLoading(false);
		}
	}, [user.id, documentId]);

	const downloadDocument = useCallback(async () => {
		console.log(document);
		const { data, error } = await supabase.storage.from('documents').download(document.url);
		if (error) {
			throw error;
		} else {
			const url = URL.createObjectURL(data);
			setDocumentUrl(url);
			setDownloading(false);
		}
	}, [document]);

	useEffect(() => {
		if (user && user.id) {
			fetchDocument();
		}
	}, [user, fetchDocument]);

	useEffect(() => {
		if (document) {
			downloadDocument();
		}
	}, [document, downloadDocument]);

	return (
		<>
			{document && documentUrl && (
				<div className="flex h-full w-full flex-col gap-8 p-8">
					<div className=" flex h-fit w-full flex-col gap-2 rounded-md bg-neutral-800 p-2">
						<img src={documentUrl} alt="document" className="rounded-md" />
						<p className="text-center text-base font-bold text-white">{document.name}</p>
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
