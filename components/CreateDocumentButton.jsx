'use client';

import UploadModal from '@/components/UploadModal';
import { useState } from 'react';

export default function CreateDocumentButton() {
	const [isUploading, setIsUploading] = useState(false);

	const handleFileUpload = (selectedFile) => {
		const file = selectedFile;

		const formData = new FormData();

		formData.append('file', file);
		formData.append('name', file.name);

		fetch('/api/document', {
			method: 'POST',
			body: formData,
		});
	};

	return (
		<>
			<button
				className="flex items-center gap-2 rounded-lg bg-accent p-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-accent-hover"
				onClick={() => setIsUploading(true)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={3}
					stroke="currentColor"
					className="h-4 w-4"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				Upload Document
			</button>
			{isUploading && (
				<UploadModal
					text="Upload Document"
					setIsUploading={setIsUploading}
					uploadFunction={handleFileUpload}
				/>
			)}
		</>
	);
}
