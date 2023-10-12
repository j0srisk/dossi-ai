'use client';

import DocumentList from '@/components/DocumentList';
import FileContainer from '@/components/FileContainer';
import Message from '@/components/Message';
import MessageContainer from '@/components/MessageContainer';
import QueryContainer from '@/components/QueryContainer';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useRef } from 'react';

const ChatContainer = ({ topic, messages }) => {
	const containerRef = useRef(null);
	const [clientMessages, setClientMessages] = useState(messages);
	const [rendered, setRendered] = useState(false);
	const [activePage, setActivePage] = useState(null);

	//only used for collections
	const [documents, setDocuments] = useState(null);
	const [activeDocument, setActiveDocument] = useState(null);

	const updateMessages = (message) => {
		setClientMessages((prevMessages) => [...prevMessages, message]);
	};

	useEffect(() => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
	}, [clientMessages]);

	const getDocuments = async () => {
		const supabase = createClientComponentClient();
		const { data, error } = await supabase.from('documents').select('*').eq('collection', topic.id);

		if (error) {
			console.error(error);
			return;
		}

		setDocuments(data);
	};

	useEffect(() => {
		if (topic.type === 'collection') {
			getDocuments();
		}
	}, []);

	const setReference = (document, page) => {
		setActiveDocument(document);
		setActivePage(page);
	};

	return (
		<div className="flex max-h-[calc(100vh-72px)] w-full flex-1">
			{topic.type === 'document' && (
				<div className="flex-1 overflow-hidden">
					<FileContainer
						document={topic}
						page={activePage}
						setPage={setActivePage}
						setRendered={setRendered}
					/>
				</div>
			)}
			{topic.type === 'collection' && (
				<>
					{activeDocument ? (
						<div className="relative flex-1 overflow-hidden">
							<FileContainer
								document={activeDocument}
								page={activePage}
								setPage={setActivePage}
								setRendered={setRendered}
							/>
							<div className="absolute right-6 top-6 z-20 rounded-md bg-white">
								<button
									className="flex aspect-square h-full items-center justify-center gap-2 rounded-md border border-neutral-300 p-1 text-neutral-300 shadow-sm transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:text-neutral-700 hover:shadow-md"
									onClick={() => setActiveDocument(null)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-6 w-6"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-1 flex-col items-center justify-center overflow-hidden">
							{documents && (
								<DocumentList documents={documents} setActiveDocument={setActiveDocument} />
							)}
						</div>
					)}
				</>
			)}
			<div className="flex w-full flex-1 outline outline-neutral-300">
				<div className="flex w-full flex-col">
					<div className="flex h-full flex-1 flex-col overflow-scroll bg-white" ref={containerRef}>
						{clientMessages.map((message, index) => (
							<div className="w-full" key={index}>
								<Message
									message={message}
									setActiveDocument={setActiveDocument}
									setReference={setReference}
									documents={documents}
								/>
							</div>
						))}
					</div>
					<button onClick={() => setActivePage(2)}>{activePage}</button>
					<QueryContainer topic={topic} updateMessages={updateMessages} />
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;
