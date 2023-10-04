import { CollectionsContext } from '../contexts/collections';
import ChatContainer from './ChatContainer';
import DocumentContainer from './DocumentContainer';
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
		<div className="w-full h-full flex items-center justify-center border border-neutral-300 rounded-r-2xl bg-white shadow-sm">
			{document && (
				<div className="flex-1 aspect-[8.5/11] h-full relative border-r border-neutral-300">
					<DocumentContainer
						document={document}
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
					/>
					{!documentId && (
						<div className="absolute top-2 right-2 z-20 rounded-md bg-white">
							<button
								className="rounded-md flex items-center h-full aspect-square text-neutral-300 gap-2 justify-center p-1 border-neutral-300 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:text-neutral-700 hover:bg-opacity-10 transition-all"
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

			{collectionId && !document && (
				<div className="h-full aspect-[8.5/11] bg-white border-r border-neutral-300 items-center justify-center flex">
					<p className="text-center text-neutral-400 text-xl font-bold">Document Preview Window</p>
				</div>
			)}

			{collectionId && (
				<ChatContainer
					collectionId={collectionId}
					documentId={documentId}
					collections={collections}
					documents={documents}
					setPageNumber={setPageNumber}
					handleSetDocument={handleSetDocument}
				/>
			)}

			{!documentId && !collectionId && (
				<p className="text-center text-neutral-500 text-xl font-bold">
					Select a collection or document to chat
				</p>
			)}
		</div>
	);
};

export default Main;
