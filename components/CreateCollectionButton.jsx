'use client';

export default function CreateCollectionButton() {
	const createCollection = async () => {
		const name = 'New Collection';

		fetch('/api/collection', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
	};

	return (
		<button
			className="flex items-center gap-2 rounded-lg bg-accent p-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-accent-hover"
			onClick={() => createCollection()}
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
			Create Collection
		</button>
	);
}
