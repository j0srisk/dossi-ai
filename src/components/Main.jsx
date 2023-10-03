import { CollectionsContext } from '../contexts/collections';
import NewChatContainer from './NewChatContainer';
import NewDocumentContainer from './NewDocumentContainer';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Main = () => {
	const [document, setDocument] = useState(null);
	const [pageNumber, setPageNumber] = useState(null);

	const { collectionId, documentId } = useParams();

	const { collections, documents } = useContext(CollectionsContext);

	useEffect(() => {
		console.log('resetting document');
		setDocument(null);
		if (documents.length > 0 && documentId) {
			const loadedDocument = documents.find((document) => document.id === documentId);
			console.log('loadedDocument: ', loadedDocument);
			setDocument(loadedDocument);
		}
	}, [documents, documentId]);

	const handleSetDocument = (document) => {
		console.log('setting document: ', document);
		const loadedDocument = documents.find((doc) => doc.id === document);
		setDocument(loadedDocument);
	};

	return (
		<div className="w-full h-full flex gap-2 p-2 items-center justify-center">
			{document && (
				<div className="flex-1 w-full h-full relative">
					<NewDocumentContainer
						document={document}
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
					/>
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

			<NewChatContainer
				collectionId={collectionId}
				documentId={documentId}
				collections={collections}
				documents={documents}
				setPageNumber={setPageNumber}
				handleSetDocument={handleSetDocument}
			/>
		</div>
	);
};

export default Main;
