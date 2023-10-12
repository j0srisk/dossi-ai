import { useRouter } from 'next/navigation';

const UploadFile = ({ collection }) => {
	const router = useRouter();

	const handleFileUpload = (e) => {
		const file = e.target.files[0];

		console.log(file);

		const formData = new FormData();

		console.log(collection.id);
		formData.append('file', file);
		formData.append('name', file.name);
		formData.append('collectionId', collection.id);

		fetch('/api/document', {
			method: 'POST',
			body: formData,
		});
	};

	return (
		<button className="relative flex w-fit items-center gap-2 p-2 hover:cursor-pointer hover:underline">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				className="h-5 w-5"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>

			<p className="w-fit font-bold">Upload File</p>
			<input
				type="file"
				id="file"
				name="file"
				accept=".pdf"
				className="absolute top-0 h-full w-full opacity-0 hover:cursor-pointer"
				onChange={(e) => handleFileUpload(e)}
			/>
		</button>
	);
};

export default UploadFile;
