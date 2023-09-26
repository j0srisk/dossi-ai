import { useEffect, useState } from 'react';
import useRequireAuth from '../hooks/useRequireAuth';
import { supabase } from '../services/supabase';
import Document from './Document';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Documents = ({ collection }) => {
	const [documents, setDocuments] = useState(null);
	const [activeDocument, setActiveDocument] = useState(null);
	const [loading, setLoading] = useState(true);

	const { documentId } = useParams();

	const navigate = useNavigate();

	const user = useRequireAuth();

	async function fetchDocuments() {
		const res = await supabase
			.from('documents')
			.select('*')
			.eq('created_by', user.id)
			.eq('collection', collection);
		setDocuments(res.data);
		setLoading(false);
	}

	useEffect(() => {
		if (user && user.id) {
			fetchDocuments();
		}
	}, [user]);

	useEffect(() => {
		setActiveDocument(documentId);
	}, [documentId]);

	async function handleCreateDocument(event) {
		const file = event.target.files[0];

		const url = uuidv4();

		const filePath = `${user.id}/${url}`;

		const { error: databaseError } = await supabase
			.from('documents')
			.insert([{ created_by: user.id, name: file.name, collection: collection, url: filePath }]);
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
								collection={collection}
								name={document.name}
								activeDocument={activeDocument}
								setActiveDocument={setActiveDocument}
								fetchDocuments={fetchDocuments}
							/>
						);
					})}
			</div>
			<div className="relative w-full">
				<button className="flex w-full items-center justify-center gap-1 rounded-md border-2 border-dashed border-neutral-500 p-2 text-neutral-500">
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
				<input
					type="file"
					id="file"
					name="file"
					className="absolute top-0 h-full w-full rounded-md opacity-0"
					onChange={(e) => handleCreateDocument(e)}
				/>
			</div>
		</>
	);
};

export default Documents;
