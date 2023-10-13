'use client';

const DeleteChatButton = ({ topic }) => {
	const handleDelete = async () => {
		let body;

		if (topic.type === 'document') {
			body = {
				documentId: topic.id,
			};
		} else if (topic.type === 'collection') {
			body = {
				collectionId: topic.id,
			};
		}

		console.log(body);

		fetch('/api/chat', {
			method: 'DELETE',
			body: JSON.stringify(body),
		});

		window.location.reload(false);
	};

	return (
		<button
			className="flex h-full  items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10"
			onClick={handleDelete}
		>
			<p className="flex-1 text-left text-sm font-bold">Reset Chat</p>
		</button>
	);
};

export default DeleteChatButton;
