'use client';

const CreateCollectionButton = () => {
	const createCollection = async () => {
		const name = 'New Collection';

		fetch('/api/collection', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
	};

	return (
		<button
			className="font-ar-one-sans rounded-md bg-accent p-2 font-bold text-white shadow-sm"
			onClick={() => createCollection()}
		>
			Create Collection
		</button>
	);
};

export default CreateCollectionButton;
