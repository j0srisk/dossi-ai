import { CollectionsContext } from '../contexts/collections';
import Bubble from './chat/Bubble';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatContainer = () => {
	const [collection, setCollection] = useState(null);
	const [document, setDocument] = useState(null);
	const { collections, documents } = useContext(CollectionsContext);
	const [searching, setSearching] = useState(true);

	const { collectionId, documentId } = useParams();

	const searchCollection = useCallback(async () => {
		console.log(collectionId);
		const currentCollection = await collections.find(
			(collection) => collection.id === collectionId,
		);
		console.log(currentCollection);
		setCollection(currentCollection);
		setSearching(false);
	}, [collections, collectionId]);

	const searchDocument = useCallback(async () => {
		const currentDocument = await documents.find((document) => document.id === documentId);
		setDocument(currentDocument);
		setSearching(false);
	}, [documents, documentId]);

	useEffect(() => {
		if (collections.length > 0) {
			searchCollection();
		}
	}, [collections, searchCollection]);

	useEffect(() => {
		if (documents.length > 0) {
			searchDocument();
		}
	}, [documents, searchDocument]);

	return (
		<div className="w-full h-full flex flex-col gap-2 items-center max-w-screen-md">
			{!searching && (
				<div className="w-full flex flex-row items-center justify-center gap-1 p-3 bg-transparent rounded-md border border-transparent">
					{document && (
						<>
							<p className="text-center text-base font-bold text-white">Chatting with:</p>
							<p className="text-center text-base text-cyan-500 font-bold">{document.name}</p>
						</>
					)}
					{!document && (
						<>
							<p className="text-center text-base font-bold text-white">Chatting with entire:</p>
							<p className="text-center text-base text-cyan-500 font-bold">{collection.name}</p>
						</>
					)}
				</div>
			)}
			<div className="w-full flex flex-1 flex-col items-start justify-start gap-4">
				<Bubble message={'Program Message'} user={false} />
				<Bubble message={'User Message'} user={true} />
			</div>
			<div className="flex flex-row items-center justify-center gap-2 w-full">
				<input
					type="text"
					placeholder="Type a message..."
					className="w-full flex-1 rounded-md p-2 bg-transparent border-neutral-500 border outline-none text-white"
					style={{ overflowY: 'auto', resize: 'none' }}
				/>
				<button className="h-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 p-2  hover:from-cyan-600 hover:to-blue-600 hover:bg-opacity-90 hover:shadow-md px-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 flex-shrink-0"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default ChatContainer;
