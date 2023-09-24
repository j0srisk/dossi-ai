import { useState, useRef } from 'react';
import { supabase } from '../services/supabase';

const Document = ({ id, name, activeDocument, setActiveDocument, fetchDocuments }) => {
	const [documentName, setDocumentName] = useState(name);
	const [editing, setEditing] = useState(false);

	const inputRef = useRef(null);

	const handleClick = () => {
		setActiveDocument(id);
	};

	const updateDocumentName = async () => {
		const { error } = await supabase.from('documents').update({ name: documentName }).eq('id', id);
		if (error) {
			alert(error.message);
		} else {
			setEditing(false);
			fetchDocuments();
		}
	};

	const deleteDocument = async () => {
		const { error } = await supabase.from('documents').delete().eq('id', id);
		if (error) {
			alert(error.message);
		} else {
			setActiveDocument(null);
			fetchDocuments();
		}
	};

	return (
		<>
			{id === activeDocument && (
				<button
					className="flex items-center rounded-md border-2 border-neutral-800 bg-neutral-800 p-2"
					onClick={handleClick}
				>
					<input
						type="text"
						className="w-full flex-1 border-none bg-transparent text-base text-white outline-none"
						ref={inputRef}
						value={documentName}
						disabled={!editing}
						onBlur={() => {
							setEditing(false);
							updateDocumentName();
						}}
						onChange={(e) => setDocumentName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								inputRef.current.blur();
							}
						}}
					/>
					<div className="flex gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="h-4 w-4 stroke-neutral-500"
							onClick={() => {
								setEditing(true);
								setTimeout(() => {
									inputRef.current.focus();
								}, 0);
							}}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
							/>
						</svg>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="h-4 w-4 stroke-neutral-500"
							onClick={() => deleteDocument()}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
					</div>
				</button>
			)}

			{id != activeDocument && (
				<button
					className="flex rounded-md border-2 border-transparent bg-transparent p-2"
					onClick={handleClick}
				>
					<p className="text-left text-base">{documentName}</p>
				</button>
			)}
		</>
	);
};

export default Document;
