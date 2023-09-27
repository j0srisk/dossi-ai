import { supabase } from '../services/supabase';
import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

const DocumentContainer = () => {
	const [documentUrl, setDocumentUrl] = useState(null);

	const loaderData = useLoaderData();

	const { documentId } = useParams();

	const photoUrl = loaderData.data.url;

	async function downloadDocument() {
		const { data, error } = await supabase.storage.from('documents').download(photoUrl);
		if (error) {
			throw error;
		}
		const url = URL.createObjectURL(data);
		setDocumentUrl(url);
	}

	useEffect(() => {
		downloadDocument();
	}, [loaderData]);

	return (
		<div className="flex h-full w-full flex-col gap-8 p-8">
			<div className=" flex h-fit w-full flex-col gap-2 rounded-md bg-neutral-800 p-2">
				<img src={documentUrl} alt="document" className="rounded-md" />
				<p className="text-center text-base font-bold text-white">{loaderData.data.name}</p>
			</div>
			<div className=" flex h-fit w-full flex-col gap-2 rounded-md bg-neutral-800 p-2">
				<img src={documentUrl} alt="document" className="rounded-md" />
				<p className="text-center text-base font-bold text-white">{loaderData.data.name}</p>
			</div>
		</div>
	);
};

export default DocumentContainer;
