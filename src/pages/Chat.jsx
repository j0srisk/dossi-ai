import ChatContainer from '../components/ChatContainer';
import DocumentContainer from '../components/DocumentContainer';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { CollectionsContext } from '../contexts/collections';
import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
	const [document, setDocument] = useState(null);
	const [pageNumber, setPageNumber] = useState(null);
	const [rendered, setRendered] = useState(false);

	const { collectionId, documentId } = useParams();

	const navigate = useNavigate();

	const { collections, documents } = useContext(CollectionsContext);

	//set document if documentId is in url
	useEffect(() => {
		setDocument(null);
		setPageNumber(null);
		if (documents.length > 0 && documentId) {
			const loadedDocument = documents.find((document) => document.id === documentId);
			setDocument(loadedDocument);
		}
	}, [documents, documentId]);

	//sets document and page number from document reference
	const handleSetDocument = (newDocument, pageNumber) => {
		setDocument(newDocument);
		setPageNumber(pageNumber);

		//scroll to page if document is already rendered
		if (newDocument.id === document?.id) {
			scrollToPage(pageNumber);
		}
	};

	//scrolls to page and resets page number so it can be scrolled to again
	const scrollToPage = (pageNumber) => {
		setPageNumber(pageNumber);
		//timeout to update state twice in fuction
		setTimeout(() => {
			if (rendered) {
				setPageNumber(null);
			}
		}, 0);
	};

	//scrolls to page when document is rendered
	useEffect(() => {
		if (rendered) {
			scrollToPage(pageNumber);
		}
	}, [rendered]);

	//resets rendered state when document changes
	useEffect(() => {
		setRendered(false);
	}, [document]);

	return (
		<div className="w-full h-full flex flex-col">
			<Navbar>
				<div className="flex-1 flex items-center">
					<div className="w-fit">
						<Button onClick={() => navigate('/')}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 19.5L8.25 12l7.5-7.5"
								/>
							</svg>

							<p className="text-left text-sm flex-1 font-bold">Collections</p>
						</Button>
					</div>
				</div>
				{collectionId && !documentId && (
					<div className="flex gap-1 items-end font-inter">
						<p className="text-center text-lg font-bold text-white">Chatting with entire</p>
						<p className="text-center text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
							{collections.find((collection) => collection.id === collectionId)?.name}
						</p>
						<p className="text-center text-lg font-bold text-white">collection</p>
					</div>
				)}
				{documentId && (
					<div className="flex gap-1 font-inter">
						<p className="text-center text-base font-bold text-white">Chatting with</p>
						<div className="flex">
							<p className="text-center text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
								{documents.find((document) => document.id === documentId)?.name}
							</p>
						</div>
					</div>
				)}
				<div className="flex-1 flex items-center justify-end"></div>
			</Navbar>
			<div className="w-full h-[calc(100vh-72px)] flex items-center justify-center border border-neutral-300 shadow-sm">
				{document && (
					<div className="flex-1 h-full relative border-r border-neutral-300 bg-white">
						<DocumentContainer
							document={document}
							pageNumber={pageNumber}
							setRendered={setRendered}
						/>
						{!documentId && (
							<div className="absolute top-6 right-6 z-20 rounded-md bg-white">
								<button
									className="rounded-md flex items-center h-full aspect-square text-neutral-300 gap-2 justify-center p-1 border-neutral-300 border shadow-sm hover:shadow-md hover:bg-neutral-700 hover:text-neutral-700 hover:bg-opacity-10 transition-all"
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
					<div className="h-full flex-col bg-white border-r border-neutral-300 items-center justify-center flex flex-1 gap-2">
						<p className="text-center text-neutral-400 text-xl font-bold">
							Document Preview Window
						</p>
						<div className="flex flex-col gap-1 items-center">
							{documents
								.filter((document) => document.collection === collectionId)
								.map((document) => {
									return (
										<button
											className="text-neutral-300 text-sm w-fit hover:underline hover:text-neutral-700"
											key={document.id}
											onClick={() => {
												handleSetDocument(document);
											}}
										>
											{document.name}
										</button>
									);
								})}
						</div>
					</div>
				)}

				{collectionId && documents.some((document) => document.collection === collectionId) && (
					<ChatContainer
						collectionId={collectionId}
						documentId={documentId}
						collections={collections}
						documents={documents}
						scrollToPage={scrollToPage}
						handleSetDocument={handleSetDocument}
					/>
				)}
			</div>
		</div>
	);
};

export default Chat;
