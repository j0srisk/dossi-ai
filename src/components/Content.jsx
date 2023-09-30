import { CollectionsContext } from '../contexts/collections';
import ChatContainer from './ChatContainer';
import DocumentContainer from './DocumentContainer';
import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';

const Content = () => {
	const [collection, setCollection] = useState([]);
	const [document, setDocument] = useState(null);

	const { collections, documents } = useContext(CollectionsContext);
	const { collectionId, documentId } = useParams();

	const loadCollection = useCallback(async () => {
		const loadedCollection = await collections.find((collection) => collection.id === collectionId);
		setCollection(loadedCollection);
	}, [collections, collectionId]);

	const loadDocument = useCallback(
		async (documentId) => {
			const loadedDocument = await documents.find((document) => document.id === documentId);
			setDocument(loadedDocument);
		},
		[documents],
	);

	useEffect(() => {
		if (collections.length > 0) {
			loadCollection();
		}
	}, [collections, loadCollection]);

	useEffect(() => {
		setDocument(null);
		if (documents.length > 0 && documentId) {
			loadDocument(documentId);
		}
	}, [documents, documentId, loadDocument]);

	return (
		<div className="w-full h-full flex gap-2 p-2">
			{document && (
				<div className=" relative">
					<DocumentContainer document={document} />
					{!documentId && (
						<div className="absolute top-2 right-2 z-20">
							<button
								className="bg-neutral-500 rounded-md text-white opacity-50 hover:opacity-100 transition-opacity p-1"
								onClick={() => setDocument(null)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					)}
				</div>
			)}
			{document && (
				<>
					<div className="flex-1 flex justify-center">
						<ChatContainer
							collection={collection}
							document={document}
							loadDocument={loadDocument}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Content;
