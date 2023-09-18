import { useState } from 'react';

function App() {
	const [uploading, setUploading] = useState(false);

	async function handleUpload(event) {
		console.log('handleUpload');
		try {
			setUploading(true);

			if (!event.target.files || event.target.files.length === 0) {
				throw new Error('You must select an pdf to upload.');
			}

			const file = event.target.files[0];

			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('http://localhost:9999/.netlify/functions/hello', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();
		} catch (error) {
			alert(error.message);
		} finally {
			setUploading(false);
		}
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="relative flex items-center justify-center gap-2 rounded-lg border-2 border-black p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
					/>
				</svg>
				<p className="text-center text-base font-bold ">Drag and drop your document here</p>
				<input
					type="file"
					accept=".pdf"
					onChange={handleUpload}
					className="absolute top-0 h-full w-full opacity-0"
				/>
			</div>
		</div>
	);
}

export default App;
