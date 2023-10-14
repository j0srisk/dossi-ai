import Modal from '@/components/Modal';
import { useState } from 'react';

export default function UploadModal({ text, name, setIsUploading, uploadFunction }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState(null);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		console.log(file.name);
		setSelectedFile(file);
		setSelectedFileName(file.name);
	};

	const resetFileUpload = () => {
		setSelectedFile(null);
		setSelectedFileName(null);
	};

	return (
		<Modal>
			<p className="font-bold">{text}</p>

			<div className="relative flex h-36 w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed py-5 text-neutral-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
					/>
				</svg>

				{selectedFileName ? (
					<p className="text-sm font-bold">{selectedFileName}</p>
				) : (
					<p className="text-sm font-bold">Drag and drop PDF file here</p>
				)}

				<input
					type="file"
					accept="application/pdf"
					className="absolute left-0 top-0 h-full w-full bg-red-500 opacity-0 hover:cursor-pointer"
					onChange={handleFileChange}
				/>
			</div>
			<div className="flex w-full items-center justify-between gap-2">
				<button
					className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-neutral-300"
					onClick={() => {
						setIsUploading(false);
						resetFileUpload();
					}}
				>
					<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
				</button>
				{selectedFileName ? (
					<button
						className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-accent hover:text-white"
						onClick={() => {
							setIsUploading(false);
							uploadFunction(selectedFile);
							resetFileUpload();
						}}
					>
						<p className="whitespace-nowrap text-sm font-bold">Upload</p>
					</button>
				) : (
					<div className="flex h-full w-full select-none items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-not-allowed">
						<p className="whitespace-nowrap text-sm font-bold">Upload</p>
					</div>
				)}
			</div>
		</Modal>
	);
}
