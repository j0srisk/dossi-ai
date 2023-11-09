'use client';

import DocumentList from '@/components/DocumentList';
import FileContainer from '@/components/FileContainer';
import Message from '@/components/Message';
import QueryContainer from '@/components/QueryContainer';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function ChatContainer({ topic, documents }) {
	const containerRef = useRef(null);
	const [rendered, setRendered] = useState(false);
	const [activePage, setActivePage] = useState(1);
	const [generating, setGenerating] = useState(false);
	const searchParams = useSearchParams();
	const [messages, setMessages] = useState([]);
	const [chatId, setChatId] = useState(searchParams.get('chat'));

	//only used for collections
	const [activeDocument, setActiveDocument] = useState(null);

	useEffect(() => {
		if (!chatId) {
			return;
		}

		const getMessages = async () => {
			const res = await fetch(`/api/chat/${chatId}`);

			const data = await res.json();

			console.log(data);

			if (!(data.collection === topic.id || data.document === topic.id)) {
				//todo: redirect to 404
				console.log('not the right chat');
				return;
			}

			setMessages(data.messages);
		};

		getMessages();
	}, []);

	const updateMessages = (message) => {
		setMessages((prevMessages) => [...prevMessages, message]);
	};

	useEffect(() => {
		containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
							>
								<button
									className=""
									onClick={() => {
										setActiveDocument(null);
										setActivePage(1);
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.25}
										stroke="currentColor"
										className="h-6 w-6 text-neutral-300 transition-all duration-300 ease-in-out hover:text-neutral-500"
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</FileContainer>
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
			<div className="z-30 flex w-full flex-1 border-l border-neutral-300">
				<div className="flex w-full flex-col">
					<div className="flex h-full flex-1 flex-col overflow-scroll bg-white" ref={containerRef}>
						<>
							{topic.type === 'document' ? (
								<Message
									message={{
										role: 'assistant',
										content: `Welcome to Dossi AI. Ask me a question about ${topic.name} and I will do my best to answer it!`,
									}}
								></Message>
							) : (
								<Message
									message={{
										role: 'assistant',
										content: `Welcome to Dossi AI. Ask me a question about this collection of ${topic.name} documents and I will do my best to answer it!`,
									}}
								></Message>
							)}

							{messages.map((message, index) => (
								<div className="w-full" key={index}>
									<Message
										message={message}
										setActiveDocument={setActiveDocument}
										setReference={setReference}
										documents={documents}
									/>
								</div>
							))}

							{generating && (
								<Message message={{ role: 'assistant' }}>
									{' '}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-10 w-10 animate-spin stroke-neutral-600"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
										/>
									</svg>
								</Message>
							)}
						</>
					</div>
					<QueryContainer
						topic={topic}
						updateMessages={updateMessages}
						setGenerating={setGenerating}
						chatId={chatId}
						setChatId={setChatId}
					/>
				</div>
			</div>
		</div>
	);
}
