import { useEffect, useState } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import { supabase } from '../services/supabase';
import Document from './Document';

const Documents = ({ collection }) => {
	const [documents, setDocuments] = useState(null);
	const [activeDocument, setActiveDocument] = useState(null);
	const [loading, setLoading] = useState(true);

	const user = useRequireAuth();

	async function fetchDocuments() {
		console.log('querying documents');
		const res = await supabase
			.from('documents')
			.select('*')
			.eq('created_by', user.id)
			.eq('collection', collection);
		console.log(res.data);
		setDocuments(res.data);
		setLoading(false);
	}

	useEffect(() => {
		if (user && user.id) {
			fetchDocuments();
		}
	}, [user]);

	async function handleCreateDocument() {
		const { error } = await supabase
			.from('documents')
			.insert([{ created_by: user.id, name: 'New Document', collection: collection }]);
		if (error) {
			alert(error.message);
		} else {
			await fetchDocuments();
		}
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-2 overflow-scroll">
				{!loading &&
					documents &&
					documents.length > 0 &&
					documents.map((document) => {
						return (
							<Document
								key={document.id}
								id={document.id}
								name={document.name}
								activeDocument={activeDocument}
								setActiveDocument={setActiveDocument}
								fetchDocuments={fetchDocuments}
							/>
						);
					})}
			</div>
			<button
				className="flex items-center justify-center gap-1 rounded-md border-2 border-dashed border-neutral-500 p-2 text-neutral-500"
				onClick={() => handleCreateDocument()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-4 w-4"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>

				<p className="text-center text-base ">New Document</p>
			</button>
		</>
	);
};

export default Documents;
