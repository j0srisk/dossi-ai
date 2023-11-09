'use client';

import CreateCollectionModal from './CreateCollectionModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateCollectionButton() {
	const [isCreating, setIsCreating] = useState(false);

	const router = useRouter();

	const createCollection = async (name) => {
		await fetch('/api/collection', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});

		setIsCreating(false);

		router.refresh();
	};

	return (
		<>
			<button
				className="flex items-center gap-2 rounded-lg bg-accent p-2 px-4 text-sm font-bold text-white shadow-sm hover:bg-accent-hover"
				onClick={() => setIsCreating(true)}
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

			{isCreating && (
				<CreateCollectionModal
					text="Create Collection"
					setIsCreating={setIsCreating}
					createFunction={createCollection}
				/>
			)}
		</>
	);
}
